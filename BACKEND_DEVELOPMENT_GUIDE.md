# Backend & API Development Guide
## Nexus-Alpha Platform - Phase 2-3 Implementation

> **Note**: 이 문서는 프론트엔드가 완성된 후 백엔드를 구축하기 위한 가이드입니다.
> 현재 프론트엔드는 Mock 데이터로 동작하며, 이 가이드를 따라 실제 API를 구현하면 됩니다.

---

## 📋 목차
1. [시스템 아키텍처](#시스템-아키텍처)
2. [Tech Stack](#tech-stack)
3. [데이터베이스 스키마](#데이터베이스-스키마)
4. [API 엔드포인트](#api-엔드포인트)
5. [실시간 데이터 파이프라인](#실시간-데이터-파이프라인)
6. [TradingAgents 통합](#tradingagents-통합)
7. [배포 및 인프라](#배포-및-인프라)
8. [보안 및 인증](#보안-및-인증)

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 14)                   │
│  - Dashboard, 3D Visualizations, Charts, Community          │
└───────────────────┬─────────────────────────────────────────┘
                    │ REST API / WebSocket
┌───────────────────┴─────────────────────────────────────────┐
│                   API Gateway (FastAPI)                      │
│  - Authentication, Rate Limiting, Caching                   │
└───────┬──────────┬──────────┬───────────┬──────────────────┘
        │          │          │           │
   ┌────┴────┐ ┌──┴───┐ ┌────┴─────┐ ┌──┴──────────┐
   │Financial│ │ User │ │Community│ │TradingAgents│
   │ Service │ │Service│ │ Service │ │   Service   │
   └────┬────┘ └──┬───┘ └────┬─────┘ └──┬──────────┘
        │         │          │           │
   ┌────┴─────────┴──────────┴───────────┴───┐
   │         PostgreSQL + TimescaleDB         │
   │  - Users, Companies, Financials, Posts   │
   └────────────────┬─────────────────────────┘
                    │
   ┌────────────────┴─────────────────────────┐
   │              Redis Cache                  │
   │  - Session, Real-time data, Rate limits  │
   └──────────────────────────────────────────┘

   ┌──────────────────────────────────────────┐
   │        External Data Sources              │
   │  - yfinance, FRED, Alpha Vantage, SEC    │
   └──────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend Framework
```python
# FastAPI (Python 3.11+)
# - Async/await support
# - Auto-generated OpenAPI docs
# - High performance
# - Type safety with Pydantic

pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary \
    redis celery pandas numpy yfinance fredapi pydantic
```

### Database
```sql
-- PostgreSQL 15+ with TimescaleDB extension
-- TimescaleDB: Time-series data (stock prices, macro variables)

CREATE EXTENSION IF NOT EXISTS timescaledb;
```

### Message Queue
```python
# Celery with Redis
# - Background tasks (data fetching, report generation)
# - Scheduled jobs (daily market data update)

pip install celery redis
```

### Caching
```python
# Redis
# - Session storage
# - API response caching
# - Real-time data caching

pip install redis
```

---

## 🗄 데이터베이스 스키마

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier VARCHAR(20) DEFAULT 'free', -- free, pro, premium, institutional
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    api_key VARCHAR(64) UNIQUE,
    api_calls_today INTEGER DEFAULT 0,
    contribution_score INTEGER DEFAULT 0,

    CONSTRAINT tier_check CHECK (tier IN ('free', 'pro', 'premium', 'institutional'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key);
```

### 2. Companies Table
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticker VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    description TEXT,

    -- Financials (updated quarterly)
    revenue BIGINT,
    net_income BIGINT,
    operating_income BIGINT,
    total_assets BIGINT,
    total_debt BIGINT,
    equity BIGINT,

    -- Ratios (calculated)
    icr DECIMAL(10, 2),
    pe_ratio DECIMAL(10, 2),
    roe DECIMAL(10, 2),
    de_ratio DECIMAL(10, 2),

    last_updated TIMESTAMP DEFAULT NOW(),

    CONSTRAINT sector_check CHECK (sector IN ('BANKING', 'REALESTATE', 'MANUFACTURING', 'SEMICONDUCTOR', 'CRYPTO'))
);

CREATE INDEX idx_companies_ticker ON companies(ticker);
CREATE INDEX idx_companies_sector ON companies(sector);
```

### 3. Stock Prices Table (TimescaleDB Hypertable)
```sql
CREATE TABLE stock_prices (
    time TIMESTAMPTZ NOT NULL,
    ticker VARCHAR(10) NOT NULL,
    open DECIMAL(12, 2),
    high DECIMAL(12, 2),
    low DECIMAL(12, 2),
    close DECIMAL(12, 2),
    volume BIGINT,

    FOREIGN KEY (ticker) REFERENCES companies(ticker)
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('stock_prices', 'time');

CREATE INDEX idx_stock_prices_ticker_time ON stock_prices (ticker, time DESC);
```

### 4. Macro Variables Table
```sql
CREATE TABLE macro_variables (
    time TIMESTAMPTZ NOT NULL,
    variable_id VARCHAR(50) NOT NULL, -- e.g., 'fed_funds_rate', 'us_gdp_growth'
    value DECIMAL(12, 4) NOT NULL,
    unit VARCHAR(20), -- '%', 'T USD', 'Index', etc.

    PRIMARY KEY (time, variable_id)
);

SELECT create_hypertable('macro_variables', 'time');

CREATE INDEX idx_macro_var_id ON macro_variables (variable_id, time DESC);
```

### 5. Community Posts Table
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(20) DEFAULT 'discussion', -- discussion, hypothesis, analysis

    -- For hypothesis posts
    hypothesis_statement TEXT,
    target_variable VARCHAR(50), -- e.g., 'BTC', 'fed_funds_rate'
    prediction_value DECIMAL(12, 2),
    confidence_level INTEGER, -- 1-100

    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT post_type_check CHECK (post_type IN ('discussion', 'hypothesis', 'analysis'))
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 6. Trading Bots Table
```sql
CREATE TABLE trading_bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    strategy TEXT NOT NULL, -- JSON string of strategy parameters

    -- Backtest results
    total_return DECIMAL(10, 2),
    sharpe_ratio DECIMAL(10, 4),
    max_drawdown DECIMAL(10, 2),
    win_rate DECIMAL(10, 2),

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_run TIMESTAMP
);

CREATE INDEX idx_bots_user_id ON trading_bots(user_id);
CREATE INDEX idx_bots_return ON trading_bots(total_return DESC);
```

### 7. Connections Table (Knowledge Graph)
```sql
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_id UUID NOT NULL,
    to_id UUID NOT NULL,
    from_type VARCHAR(20) NOT NULL, -- 'macro', 'sector', 'company', 'asset'
    to_type VARCHAR(20) NOT NULL,
    connection_type VARCHAR(30) NOT NULL, -- 'impact', 'supply', 'competition', 'ownership'
    strength DECIMAL(5, 2) DEFAULT 0.5, -- 0.0 to 1.0

    created_by UUID REFERENCES users(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_connections_from ON connections(from_id, from_type);
CREATE INDEX idx_connections_to ON connections(to_id, to_type);
```

---

## 🌐 API 엔드포인트

### Authentication & Users
```python
# POST /api/auth/register
# POST /api/auth/login
# POST /api/auth/logout
# GET /api/users/me
# PATCH /api/users/me
# GET /api/users/{user_id}/stats
```

### Companies & Financials
```python
# GET /api/companies - List all companies (paginated, filterable)
# GET /api/companies/{ticker} - Get company details
# GET /api/companies/{ticker}/financials - Historical financials
# GET /api/companies/{ticker}/prices - Stock price history
# POST /api/companies - Add new company (admin only)
# PATCH /api/companies/{ticker} - Update company
# DELETE /api/companies/{ticker} - Delete company (admin only)
```

### Macro Variables
```python
# GET /api/macro/variables - List all macro variables
# GET /api/macro/{variable_id} - Get specific macro variable
# GET /api/macro/{variable_id}/history - Historical data
# POST /api/macro/simulate - Run macro scenario simulation
```

### Analysis & Simulation
```python
# POST /api/analysis/circuit-diagram - Generate circuit diagram data
# POST /api/analysis/impact - Calculate macro impact on companies
# POST /api/analysis/correlation - Calculate correlations
# POST /api/simulate/filing - Simulate filing impact on financials
```

### Community
```python
# GET /api/posts - List posts (paginated, filterable by type)
# POST /api/posts - Create new post
# GET /api/posts/{post_id} - Get post details
# PATCH /api/posts/{post_id} - Update post
# DELETE /api/posts/{post_id} - Delete post
# POST /api/posts/{post_id}/vote - Upvote/downvote
# POST /api/posts/{post_id}/verify - Verify hypothesis (admin)
```

### Trading Bots (Arena)
```python
# GET /api/bots - List all bots (leaderboard)
# GET /api/bots/my - Get user's bots
# POST /api/bots - Create new bot
# GET /api/bots/{bot_id} - Get bot details
# POST /api/bots/{bot_id}/backtest - Run backtest
# DELETE /api/bots/{bot_id} - Delete bot
```

### TradingAgents Integration
```python
# POST /api/agents/analyze - Request AI analyst report
# GET /api/agents/reports/{report_id} - Get generated report
# GET /api/agents/reports - List user's reports
```

### WebSocket Endpoints
```python
# ws://api/ws/prices - Real-time stock prices
# ws://api/ws/macro - Real-time macro variable updates
# ws://api/ws/notifications - User notifications
```

---

## 📊 실시간 데이터 파이프라인

### Data Fetcher Service (Celery Tasks)
```python
# app/tasks/data_fetcher.py

from celery import Celery
from celery.schedules import crontab
import yfinance as yf
from fredapi import Fred

celery = Celery('nexus_alpha')

# Daily stock data update (after market close)
@celery.task
def fetch_daily_stock_prices():
    """
    Fetch daily stock prices for all companies
    Runs daily at 5:00 PM EST (after market close)
    """
    companies = get_all_companies()  # From DB
    for company in companies:
        ticker = yf.Ticker(company.ticker)
        hist = ticker.history(period="1d")

        # Save to stock_prices table
        save_stock_price(
            ticker=company.ticker,
            time=hist.index[0],
            open=hist['Open'][0],
            high=hist['High'][0],
            low=hist['Low'][0],
            close=hist['Close'][0],
            volume=hist['Volume'][0]
        )

# Macro data update (weekly)
@celery.task
def fetch_macro_variables():
    """
    Fetch macro variables from FRED API
    Runs weekly on Monday at 6:00 AM
    """
    fred = Fred(api_key=FRED_API_KEY)

    # Fed Funds Rate
    fed_rate = fred.get_series_latest_release('FEDFUNDS')
    save_macro_variable('fed_funds_rate', fed_rate.iloc[-1], '%')

    # GDP Growth
    gdp = fred.get_series_latest_release('GDPC1')
    save_macro_variable('us_gdp_growth', calculate_yoy_growth(gdp), '%')

    # CPI
    cpi = fred.get_series_latest_release('CPIAUCSL')
    save_macro_variable('us_cpi', calculate_yoy_growth(cpi), '%')

    # ... (50+ more variables)

# Celery Beat Schedule
celery.conf.beat_schedule = {
    'fetch-stock-prices-daily': {
        'task': 'app.tasks.data_fetcher.fetch_daily_stock_prices',
        'schedule': crontab(hour=17, minute=0),  # 5:00 PM daily
    },
    'fetch-macro-weekly': {
        'task': 'app.tasks.data_fetcher.fetch_macro_variables',
        'schedule': crontab(day_of_week=1, hour=6, minute=0),  # Monday 6:00 AM
    },
}
```

### Data Sources & Costs

| Data Source | Type | Cost | Usage |
|------------|------|------|-------|
| **yfinance** | Stock prices | Free | Daily prices, company info |
| **FRED API** | Macro variables | Free | GDP, CPI, Interest rates |
| **Alpha Vantage** | Advanced data | $50/month | Real-time quotes, forex |
| **SEC EDGAR** | Filings | Free | 10-K, 10-Q, 8-K |
| **Whale Wisdom** | 13F filings | $99/month | Hedge fund portfolios |
| **World Bank API** | Global macro | Free | International GDP, inflation |

**Total Monthly Cost:** ~$150/month (for Phase 2-3)

---

## 🤖 TradingAgents 통합

### TradingAgents Service
```python
# app/services/trading_agents.py

from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, Tool
from langchain.memory import ConversationBufferMemory

class TradingAgentsService:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.7)
        self.memory = ConversationBufferMemory()

    async def generate_analyst_report(self, ticker: str, user_id: str):
        """
        Generate AI analyst report for a company
        Cost: ~$0.03 per report (GPT-4)
        """
        # Check user tier (free users get limited reports)
        user = await get_user(user_id)
        if user.tier == 'free' and user.reports_today >= 3:
            raise Exception("Daily report limit reached. Upgrade to Pro.")

        # Fetch company data
        company = await get_company(ticker)
        stock_prices = await get_stock_prices(ticker, period="1y")
        macro_data = await get_macro_variables(['fed_funds_rate', 'us_gdp_growth'])

        # Create agent tools
        tools = [
            Tool(
                name="Fundamental Analysis",
                func=lambda q: self.fundamental_analysis(company),
                description="Analyze company financials, ratios, and health"
            ),
            Tool(
                name="Technical Analysis",
                func=lambda q: self.technical_analysis(stock_prices),
                description="Analyze price trends, RSI, MACD, moving averages"
            ),
            Tool(
                name="Macro Impact",
                func=lambda q: self.macro_impact_analysis(company, macro_data),
                description="Assess impact of macro variables on company"
            ),
        ]

        # Initialize agent
        agent = initialize_agent(
            tools,
            self.llm,
            agent="zero-shot-react-description",
            verbose=True,
            memory=self.memory
        )

        # Generate report
        prompt = f"""
        As a financial analyst, create a comprehensive report for {company.name} ({ticker}).
        Include:
        1. Executive Summary
        2. Fundamental Analysis (ICR, ROE, Debt/Equity)
        3. Technical Analysis (trends, indicators)
        4. Macro Environment Impact (interest rates, GDP, sector outlook)
        5. Recommendation (Buy/Hold/Sell with price target)
        6. Risk Assessment

        Use all available tools to gather insights.
        """

        report = await agent.arun(prompt)

        # Save report to database
        await save_analyst_report(user_id, ticker, report)

        # Increment user's report count
        await increment_user_reports(user_id)

        return report
```

### Cost Estimation
```python
# OpenAI API Costs (GPT-4)
# Input: ~2,000 tokens (company data + prompt)
# Output: ~1,500 tokens (comprehensive report)
# Total: 3,500 tokens × $0.03/1K tokens = $0.105 per report

# Pricing Tiers:
# Free: 3 reports/day = $9.45/month cost
# Pro ($20/month): Unlimited reports = customer pays more than cost
# Premium ($100/month): Priority queue + advanced models
```

---

## 🚀 배포 및 인프라

### Development Environment
```bash
# Local development
docker-compose up -d

# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_DB: nexus_alpha
      POSTGRES_USER: nexus
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://nexus:${DB_PASSWORD}@postgres:5432/nexus_alpha
      REDIS_URL: redis://redis:6379
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  celery_worker:
    build: ./backend
    command: celery -A app.tasks worker --loglevel=info
    depends_on:
      - redis
      - postgres

  celery_beat:
    build: ./backend
    command: celery -A app.tasks beat --loglevel=info
    depends_on:
      - redis
```

### Production Deployment (AWS)

```
Architecture:
┌─────────────────────────────────────────┐
│          Cloudflare CDN                 │
│  - DDoS protection, SSL, Caching        │
└───────────────┬─────────────────────────┘
                │
┌───────────────┴─────────────────────────┐
│      AWS Application Load Balancer      │
└───────┬─────────────────────────────────┘
        │
┌───────┴──────────┬──────────────────────┐
│   ECS Fargate    │   ECS Fargate        │
│   (API Service)  │  (Celery Workers)    │
│   Auto-scaling   │                      │
└───────┬──────────┴──────────────────────┘
        │
┌───────┴─────────────────────────────────┐
│        RDS PostgreSQL (TimescaleDB)     │
│  - Multi-AZ deployment                  │
│  - Automated backups                    │
└─────────────────────────────────────────┘
        │
┌───────┴─────────────────────────────────┐
│         ElastiCache (Redis)             │
│  - Session storage, Caching             │
└─────────────────────────────────────────┘
```

### Cost Estimation (AWS)

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **ECS Fargate (API)** | 2 vCPU, 4GB RAM × 2 tasks | $70 |
| **ECS Fargate (Celery)** | 1 vCPU, 2GB RAM × 1 task | $20 |
| **RDS PostgreSQL** | db.t4g.medium (2 vCPU, 4GB) | $80 |
| **ElastiCache Redis** | cache.t4g.small | $25 |
| **ALB** | Load balancer + traffic | $20 |
| **Data Transfer** | ~100GB/month | $10 |
| **Cloudflare** | Pro plan | $20 |
| **Total** | | **~$245/month** |

---

## 🔐 보안 및 인증

### JWT Authentication
```python
# app/auth/jwt.py

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### API Rate Limiting
```python
# app/middleware/rate_limit.py

from fastapi import Request, HTTPException
from redis import Redis
import time

redis_client = Redis(host='redis', port=6379, db=0)

async def rate_limit_middleware(request: Request, call_next):
    """
    Rate limiting based on user tier:
    - Free: 100 requests/hour
    - Pro: 1,000 requests/hour
    - Premium: 10,000 requests/hour
    - Institutional: Unlimited
    """
    user = get_current_user(request)
    tier = user.tier

    limits = {
        'free': 100,
        'pro': 1000,
        'premium': 10000,
        'institutional': float('inf')
    }

    key = f"rate_limit:{user.id}:{int(time.time() / 3600)}"
    count = redis_client.incr(key)
    redis_client.expire(key, 3600)  # 1 hour TTL

    if count > limits[tier]:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Upgrade to increase limits."
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(limits[tier])
    response.headers["X-RateLimit-Remaining"] = str(limits[tier] - count)
    return response
```

---

## 📝 Next Steps

### Phase 2 (3-6 months)
1. ✅ Set up PostgreSQL + TimescaleDB
2. ✅ Implement authentication (JWT)
3. ✅ Build core API endpoints (Companies, Macro, Users)
4. ✅ Implement data fetcher service (Celery)
5. ✅ Deploy to AWS
6. ✅ Connect frontend to real API

### Phase 3 (6-12 months)
1. ✅ Implement TradingAgents service
2. ✅ Add Community features (Posts, Voting)
3. ✅ Build Trading Bot Arena
4. ✅ Add global data sources (World Bank, etc.)
5. ✅ Implement WebSocket for real-time updates
6. ✅ Scale to 100+ companies

### Phase 4 (12-18 months) - Blockchain (Optional)
1. ✅ Design token economics
2. ✅ Implement smart contracts (Polygon)
3. ✅ Migrate contribution scores to blockchain
4. ✅ Launch NEXUS token

---

## 💰 Revenue Model

| Tier | Price | API Calls/hour | Reports/day | Features |
|------|-------|----------------|-------------|----------|
| **Free** | $0 | 100 | 3 | Basic dashboard, limited data |
| **Pro** | $20/month | 1,000 | Unlimited | Full dashboard, all sectors, bot arena |
| **Premium** | $100/month | 10,000 | Unlimited | Priority reports, advanced analytics |
| **Institutional** | $500/month | Unlimited | Unlimited | API access, custom integrations |

**Break-even Analysis:**
- Monthly cost: $245 (infrastructure) + $150 (data) = $395
- Break-even: 20 Pro users OR 4 Premium users OR 1 Institutional
- Target: 100 Pro + 20 Premium = $4,000/month revenue

---

## 📚 Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **TimescaleDB Docs**: https://docs.timescale.com/
- **LangChain Guide**: https://python.langchain.com/docs/
- **yfinance**: https://github.com/ranaroussi/yfinance
- **FRED API**: https://fred.stlouisfed.org/docs/api/

---

## ⚠️ Important Notes

1. **API Keys 보안**: 모든 API 키는 환경 변수로 관리 (.env)
2. **데이터 품질**: yfinance 무료 데이터는 15분 지연, 실시간 필요시 Alpha Vantage 유료
3. **확장성**: TimescaleDB hypertable은 자동 partitioning으로 수억 row 처리 가능
4. **비용 최적화**: Redis 캐싱으로 API 호출 90% 감소 가능

---

**Author**: Claude (Nexus-Alpha Development Agent)
**Last Updated**: 2025-11-06
**Version**: 1.0
