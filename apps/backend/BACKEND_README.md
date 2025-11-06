# Nexus-Alpha Backend API

FastAPI-based backend for AI-powered financial analysis and economic ontology modeling.

## Overview

The backend provides:
- **Real-time stock data** via yfinance
- **Fundamental analysis** (ratios, valuations)
- **Technical analysis** (indicators, trends)
- **AI-powered reports** (OpenAI integration)
- **TradingAgents integration** (multi-agent LLM analysis)
- **Database persistence** (PostgreSQL/SQLite)
- **Caching layer** (Redis/in-memory)

## Quick Start

### Development Setup

```bash
# 1. Navigate to backend directory
cd /Users/jeonhyeonmin/Simulation/nexus-alpha/apps/backend

# 2. Create virtual environment
python3.13 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Edit .env and add your API keys

# 5. Run development server
python main.py
# or with auto-reload
uvicorn main:app --reload --port 8000
```

Server runs at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Environment Variables

Create `.env` file based on `.env.example`:

```env
ENVIRONMENT=development
OPENAI_API_KEY=sk-your-key
DATABASE_URL=sqlite:///./nexus_alpha.db
REDIS_ENABLED=False
```

## API Endpoints

### Stock Data
- `GET /api/stock/{ticker}` - Get current price & volume
- `GET /api/fundamental/{ticker}` - Get financial ratios
- `GET /api/technical/{ticker}` - Get technical indicators
- `GET /api/news/{ticker}` - Get latest news

### AI Analysis
- `POST /api/ai-report` - Generate AI investment report
- `GET /api/trading-agents/{ticker}` - TradingAgents analysis (if enabled)
- `GET /api/trading-agents/status` - TradingAgents status

### System
- `GET /api/health` - Health check
- `GET /` - API info

## Architecture

### Core Components

1. **main.py** - FastAPI application with all endpoints
2. **models.py** - SQLAlchemy database models
3. **database.py** - Database initialization & session management
4. **cache.py** - Caching layer (in-memory + Redis)
5. **exceptions.py** - Custom exceptions & error handling
6. **test_api.py** - Integration tests

### Data Flow

```
Client Request
    ↓
Cache Check (Redis/Memory)
    ↓ (miss) → API Call (yfinance/OpenAI)
    ↓
Database Store (Optional)
    ↓
Response Return → Cache Store
    ↓
Client Response
```

## Database

### Models

| Model | Purpose |
|-------|---------|
| Stock | Master stock data |
| StockPrice | Daily OHLCV data |
| FundamentalData | Financial ratios & statements |
| TechnicalData | Technical indicators |
| AIReport | AI-generated reports |
| TradingSignal | Buy/Sell/Hold signals |
| MacroEnvironment | Global macro data |
| AnalysisCache | API cache |

### Setup

**Development (SQLite):**
```python
DATABASE_URL=sqlite:///./nexus_alpha.db
```

**Production (PostgreSQL):**
```python
DATABASE_URL=postgresql://user:password@host:5432/nexus_alpha
```

Initialize database:
```python
from database import DatabaseUtils
DatabaseUtils.init_db()
```

## Caching Strategy

### TTL by Data Type

| Data Type | TTL |
|-----------|-----|
| Stock Price | 5 minutes |
| Fundamental | 1 hour |
| Technical | 10 minutes |
| AI Report | 2 hours |
| News | 30 minutes |

### Cache Hierarchy

1. **Redis** (distributed, if available)
2. **In-Memory** (fallback)

Enable Redis:
```env
REDIS_ENABLED=True
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Testing

```bash
# Run all tests
pytest test_api.py -v

# Run specific test
pytest test_api.py::test_health_check -v

# With coverage
pytest test_api.py --cov=.

# Performance tests only
pytest test_api.py -m performance -v
```

## Error Handling

Custom exceptions with structured responses:

```json
{
  "error": "STOCK_NOT_FOUND",
  "message": "Stock 'INVALID' not found",
  "status_code": 404,
  "details": {"ticker": "INVALID"}
}
```

Error codes:
- `STOCK_NOT_FOUND` - Stock ticker not found
- `DATA_UNAVAILABLE` - No data available
- `INVALID_PARAMETER` - Invalid input
- `AI_SERVICE_ERROR` - AI service failed
- `DATABASE_ERROR` - Database operation failed
- `RATE_LIMIT_EXCEEDED` - Rate limit hit

## Performance Optimization

### Current Optimizations
- ✅ Caching (5-min to 2-hour TTL)
- ✅ Efficient technical indicator calculation
- ✅ Async/await for I/O operations
- ✅ Database indexes on frequent queries
- ✅ Connection pooling

### Recommended Improvements
- [ ] Add pagination for large datasets
- [ ] Implement rate limiting
- [ ] Add request logging & monitoring
- [ ] Use CDN for static assets
- [ ] Implement request compression

## Deployment

### Docker

```bash
# Build image
docker build -t nexus-alpha-backend .

# Run container
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sk-xxx \
  -e DATABASE_URL=postgresql://... \
  nexus-alpha-backend
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=sk-xxx
      - DATABASE_URL=postgresql://...
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=nexus_alpha
      - POSTGRES_PASSWORD=password

  redis:
    image: redis:7
```

### Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Enable Redis caching
- [ ] Set strong `SECRET_KEY`
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring (Sentry, Prometheus)
- [ ] Configure backups
- [ ] Set rate limits
- [ ] Load test the API

## Monitoring

### Endpoints

**Cache Stats:**
```bash
curl http://localhost:8000/cache/stats
```

**Error Metrics:**
```bash
curl http://localhost:8000/metrics/errors
```

**Health Check:**
```bash
curl http://localhost:8000/api/health
```

### Logging

Configure in `.env`:
```env
LOG_LEVEL=INFO
LOG_FILE=logs/nexus_alpha.log
LOG_FORMAT=json
```

## Integration with Frontend

Frontend should point to backend URL:

**.env.local (Frontend)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

CORS is configured for `localhost:3000`.

## TradingAgents Integration

Enable TradingAgents analysis:

```env
ENABLE_TRADING_AGENTS=True
TRADINGAGENTS_DEEP_THINK_MODEL=gpt-4o-mini
TRADINGAGENTS_QUICK_THINK_MODEL=gpt-4o-mini
```

Endpoint: `GET /api/trading-agents/{ticker}`

## Cost Estimation

### Development
- OpenAI API: ~$10/month (gpt-4o-mini)
- **Total: ~$10/month**

### Production
- OpenAI API: ~$100/month (gpt-4o)
- PostgreSQL: ~$25/month
- Redis: ~$20/month
- Hosting (Railway/Vercel): ~$20/month
- **Total: ~$165/month**

## Troubleshooting

### Issues

**Port 8000 already in use:**
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 <PID>
```

**OPENAI_API_KEY not set:**
- API will work but without AI reports
- Set key in `.env` to enable

**Database connection failed:**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check credentials

**Cache not working:**
- Verify Redis is running (if enabled)
- Check REDIS_ENABLED=True
- Falls back to in-memory cache

## API Response Examples

### Stock Price
```json
{
  "ticker": "AAPL",
  "current_price": 230.45,
  "price_change_1d": 1.5,
  "price_change_1w": 2.3,
  "volume": 50000000,
  "market_cap": 2500000000000,
  "last_updated": "2025-11-04T15:30:00"
}
```

### Technical Analysis
```json
{
  "ticker": "AAPL",
  "indicators": {
    "rsi": 65.2,
    "macd": 2.34,
    "signal": 2.10,
    "sma_20": 228.5,
    "sma_50": 225.3,
    "bollinger_upper": 235.2,
    "bollinger_lower": 220.1
  },
  "trend": "BULLISH",
  "strength": 0.75,
  "signals": [
    "Golden Cross - Bullish signal",
    "RSI above 50"
  ]
}
```

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test: `pytest test_api.py -v`
3. Format code: `black . && isort .`
4. Commit: `git add . && git commit -m "Add feature"`
5. Push: `git push origin feature/new-feature`

## License

MIT License - see LICENSE file
