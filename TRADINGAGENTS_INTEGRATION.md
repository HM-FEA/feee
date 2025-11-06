# TradingAgents Integration Plan

**작성일:** 2025-11-03
**목적:** TradingAgents 프레임워크를 Nexus-Alpha에 통합하여 AI 기반 분석 강화

---

## 1. TradingAgents 개요

### 프레임워크 위치
```
/Users/jeonhyeonmin/Simulation/TradingAgents/
```

### 핵심 구성요소
TradingAgents는 실제 트레이딩 펌의 구조를 모방한 Multi-Agent LLM 프레임워크입니다.

#### Analyst Team (분석팀)
1. **Fundamentals Analyst** (펀더멘털 분석가)
   - 기업 재무제표, 성과 지표 평가
   - 내재가치 및 위험 요소 식별
   - **→ Nexus-Alpha Team Fundamental과 연동**

2. **Sentiment Analyst** (시장 심리 분석가)
   - 소셜 미디어, 대중 심리 분석
   - 감성 점수 알고리즘 활용
   - **→ Nexus-Alpha 향후 확장 (Team Sentiment)**

3. **News Analyst** (뉴스 분석가)
   - 글로벌 뉴스, 거시경제 지표 모니터링
   - 이벤트의 시장 영향 해석
   - **→ Nexus-Alpha Level 1 (Macro) 연동**

4. **Technical Analyst** (기술적 분석가)
   - MACD, RSI 등 기술적 지표 활용
   - 가격 패턴 및 움직임 예측
   - **→ Nexus-Alpha Team Technical과 연동**

#### Researcher Team (리서치팀)
- Bull/Bear 양측 관점에서 분석
- 구조화된 토론을 통한 위험/기회 균형
- **→ Nexus-Alpha에서 AI 기반 토론 시스템으로 활용 가능**

#### Trader Agent (트레이더)
- 분석가 및 리서처 보고서 종합
- 거래 타이밍 및 규모 결정
- **→ Nexus-Alpha 시뮬레이터와 연동**

#### Risk Management & Portfolio Manager
- 포트폴리오 리스크 평가
- 거래 전략 조정 및 승인
- **→ Nexus-Alpha Level 3 (Company) 리스크 평가와 연동**

---

## 2. Nexus-Alpha 연동 아키텍처

### 현재 Nexus-Alpha 구조
```
Nexus-Alpha (apps/web)
├─ 4-Level Ontology (Macro → Sector → Company → Asset)
├─ 9 Common Equations + Sector-Specific Equations
├─ 23 Companies (Banking, Real Estate, Manufacturing, Semiconductor)
├─ Frontend (Next.js)
└─ Data Layer (companies.ts)
```

### TradingAgents 통합 구조
```
Nexus-Alpha + TradingAgents
├─ Frontend (Next.js)
│   ├─ Dashboard
│   ├─ Fundamental Analysis (← TradingAgents Fundamental Analyst)
│   ├─ Technical Analysis (← TradingAgents Technical Analyst)
│   ├─ Network Graph
│   └─ CEO Dashboard
│
├─ Backend API (FastAPI)
│   ├─ /api/fundamental/{ticker} (← TradingAgents)
│   ├─ /api/technical/{ticker} (← TradingAgents)
│   ├─ /api/news/{ticker} (← TradingAgents)
│   └─ /api/simulator/* (Existing)
│
├─ TradingAgents Integration Layer
│   ├─ tradingagents.graph.trading_graph.TradingAgentsGraph
│   ├─ Data Vendors: yfinance, Alpha Vantage
│   └─ LLM: OpenAI (gpt-4o-mini for testing)
│
└─ Data Layer
    ├─ Real-time: yfinance (price, technical)
    ├─ Fundamental: Alpha Vantage (financials, news)
    └─ Internal: Nexus-Alpha companies.ts
```

---

## 3. 통합 구현 계획

### Phase 1: Backend API 구축 (Team Quant)
**목표:** TradingAgents를 FastAPI 백엔드로 래핑

#### 3.1. FastAPI 서버 구조
```python
# apps/backend/main.py
from fastapi import FastAPI
from tradingagents.graph.trading_graph import TradingAgentsGraph
from tradingagents.default_config import DEFAULT_CONFIG

app = FastAPI()

# Initialize TradingAgents
config = DEFAULT_CONFIG.copy()
config["deep_think_llm"] = "gpt-4o-mini"
config["quick_think_llm"] = "gpt-4o-mini"
config["max_debate_rounds"] = 1
ta = TradingAgentsGraph(debug=True, config=config)

@app.get("/api/fundamental/{ticker}")
async def get_fundamental_analysis(ticker: str, date: str = "latest"):
    # TradingAgents Fundamental Analyst 호출
    state, decision = ta.propagate(ticker, date)
    fundamental_report = state.get("fundamental_analyst_report", {})
    return {
        "ticker": ticker,
        "date": date,
        "analysis": fundamental_report,
        "recommendation": decision.get("action")
    }

@app.get("/api/technical/{ticker}")
async def get_technical_analysis(ticker: str, date: str = "latest"):
    # TradingAgents Technical Analyst 호출
    state, decision = ta.propagate(ticker, date)
    technical_report = state.get("technical_analyst_report", {})
    return {
        "ticker": ticker,
        "indicators": technical_report.get("indicators"),
        "signals": technical_report.get("signals")
    }

@app.get("/api/news/{ticker}")
async def get_news_analysis(ticker: str):
    # TradingAgents News Analyst 호출
    state, _ = ta.propagate(ticker, "latest")
    news_report = state.get("news_analyst_report", {})
    return {
        "ticker": ticker,
        "news": news_report
    }
```

#### 3.2. 환경 변수 설정
```bash
# apps/backend/.env
OPENAI_API_KEY=sk-...
ALPHA_VANTAGE_API_KEY=...
```

#### 3.3. Dependencies
```bash
# apps/backend/requirements.txt
fastapi
uvicorn
pydantic
# TradingAgents 의존성
langgraph
openai
yfinance
alpha-vantage
```

---

### Phase 2: Frontend 연동 (Team UI)

#### 2.1. Fundamental Analysis 페이지
```typescript
// apps/web/src/app/fundamental/[ticker]/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface FundamentalData {
  ticker: string;
  analysis: {
    balance_sheet: any;
    income_statement: any;
    cash_flow: any;
    ratios: {
      roe: number;
      roa: number;
      pe_ratio: number;
      pb_ratio: number;
    };
  };
  recommendation: string;
}

export default function FundamentalAnalysisPage({ params }: { params: { ticker: string } }) {
  const [data, setData] = useState<FundamentalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/fundamental/${params.ticker}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [params.ticker]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">{data?.ticker} - Fundamental Analysis</h1>

      {/* Financial Ratios */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <MetricCard title="ROE" value={data?.analysis.ratios.roe} />
        <MetricCard title="ROA" value={data?.analysis.ratios.roa} />
        <MetricCard title="P/E" value={data?.analysis.ratios.pe_ratio} />
        <MetricCard title="P/B" value={data?.analysis.ratios.pb_ratio} />
      </div>

      {/* AI Recommendation */}
      <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
        <p className="text-[#9CA3AF]">{data?.recommendation}</p>
      </div>
    </div>
  );
}
```

#### 2.2. Technical Analysis 페이지
```typescript
// apps/web/src/app/technical/[ticker]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TechnicalData {
  ticker: string;
  indicators: {
    macd: number[];
    rsi: number[];
    bollinger_bands: { upper: number[]; middle: number[]; lower: number[] };
  };
  signals: {
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number;
  };
}

export default function TechnicalAnalysisPage({ params }: { params: { ticker: string } }) {
  const [data, setData] = useState<TechnicalData | null>(null);

  useEffect(() => {
    fetch(`/api/technical/${params.ticker}`)
      .then(res => res.json())
      .then(setData);
  }, [params.ticker]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">{data?.ticker} - Technical Analysis</h1>

      {/* Technical Indicators */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <IndicatorCard title="MACD" value={data?.indicators.macd[0]} />
        <IndicatorCard title="RSI" value={data?.indicators.rsi[0]} />
        <IndicatorCard title="Trend" value={data?.signals.trend} />
      </div>

      {/* Price Chart with Bollinger Bands */}
      <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Price Chart</h2>
        {/* Recharts integration */}
      </div>
    </div>
  );
}
```

---

### Phase 3: Data Integration (Team Data)

#### 3.1. yfinance 실시간 데이터 수집
```python
# apps/backend/services/data_service.py
import yfinance as yf
from datetime import datetime, timedelta

class DataService:
    @staticmethod
    def get_stock_price(ticker: str, period: str = "1mo"):
        """Get stock price data from yfinance"""
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        return hist

    @staticmethod
    def get_financial_data(ticker: str):
        """Get financial statements from yfinance"""
        stock = yf.Ticker(ticker)
        return {
            "balance_sheet": stock.balance_sheet,
            "income_stmt": stock.income_stmt,
            "cashflow": stock.cashflow,
            "info": stock.info
        }

    @staticmethod
    def get_technical_indicators(ticker: str):
        """Calculate technical indicators"""
        hist = DataService.get_stock_price(ticker, period="3mo")

        # MACD
        exp12 = hist['Close'].ewm(span=12, adjust=False).mean()
        exp26 = hist['Close'].ewm(span=26, adjust=False).mean()
        macd = exp12 - exp26
        signal = macd.ewm(span=9, adjust=False).mean()

        # RSI
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))

        return {
            "macd": macd.tolist(),
            "signal": signal.tolist(),
            "rsi": rsi.tolist()
        }
```

#### 3.2. companies.ts 확장
```typescript
// apps/web/src/data/companies.ts에 실시간 데이터 추가
export interface CompanyWithLiveData extends Company {
  live_data?: {
    current_price: number;
    price_change_1d: number;
    price_change_1w: number;
    volume: number;
    market_cap: number;
    last_updated: string;
  };
  technical_indicators?: {
    macd: number;
    rsi: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  };
}

// API 호출 함수
export async function fetchLiveData(ticker: string): Promise<CompanyWithLiveData> {
  const response = await fetch(`/api/fundamental/${ticker}`);
  const data = await response.json();
  return data;
}
```

---

## 4. TradingAgents 설정

### 4.1. 환경 변수
```bash
# Nexus-Alpha 프로젝트 루트에 .env 추가
OPENAI_API_KEY=sk-proj-...
ALPHA_VANTAGE_API_KEY=...

# TradingAgents 설정
TRADINGAGENTS_PATH=/Users/jeonhyeonmin/Simulation/TradingAgents
```

### 4.2. TradingAgents 커스텀 설정
```python
# apps/backend/config/tradingagents_config.py
from tradingagents.default_config import DEFAULT_CONFIG

NEXUS_CONFIG = DEFAULT_CONFIG.copy()
NEXUS_CONFIG.update({
    # LLM 설정 (비용 절감)
    "deep_think_llm": "gpt-4o-mini",
    "quick_think_llm": "gpt-4o-mini",

    # 토론 라운드 (속도 향상)
    "max_debate_rounds": 1,

    # 데이터 소스
    "data_vendors": {
        "core_stock_apis": "yfinance",
        "technical_indicators": "yfinance",
        "fundamental_data": "alpha_vantage",
        "news_data": "alpha_vantage",
    }
})
```

---

## 5. 개발 단계별 체크리스트

### ✅ Phase 1: Backend Setup (Week 1)
- [ ] FastAPI 서버 구축
- [ ] TradingAgents 패키지 통합
- [ ] `/api/fundamental/{ticker}` 엔드포인트
- [ ] `/api/technical/{ticker}` 엔드포인트
- [ ] `/api/news/{ticker}` 엔드포인트
- [ ] yfinance 실시간 데이터 연동
- [ ] Alpha Vantage API 연동

### ✅ Phase 2: Frontend Integration (Week 2)
- [ ] `/fundamental/[ticker]` 페이지
- [ ] `/technical/[ticker]` 페이지
- [ ] Dashboard에 AI 분석 섹션 추가
- [ ] 실시간 데이터 표시
- [ ] 차트 시각화 (Recharts)

### ✅ Phase 3: Testing & Optimization (Week 3)
- [ ] API 응답 속도 테스트
- [ ] 비용 모니터링 (OpenAI API)
- [ ] 캐싱 전략 구현
- [ ] 에러 핸들링
- [ ] 사용자 피드백 수집

---

## 6. 예상 비용 및 성능

### OpenAI API 비용 (gpt-4o-mini)
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- 1회 분석당 예상: ~5,000 tokens (약 $0.003)
- 하루 100회 분석: ~$0.30

### Alpha Vantage API
- Free Tier: 25 requests/day
- Premium: $49.99/month (75 requests/minute)
- Nexus-Alpha 전용: 60 requests/minute (무료 - 오픈소스 지원)

### 성능 목표
- API 응답 시간: < 3초
- 동시 사용자: 50명
- 캐싱으로 중복 요청 최소화

---

## 7. 향후 확장 계획

### Sentiment Analysis 추가
- TradingAgents Sentiment Analyst 활용
- Twitter, Reddit API 연동
- 실시간 시장 심리 분석

### Researcher Team 토론 시각화
- Bull vs Bear 토론 내용 표시
- 의사결정 프로세스 투명화
- 사용자가 토론에 개입 가능

### Portfolio Manager 통합
- 여러 종목 포트폴리오 관리
- 리스크 평가 및 리밸런싱
- 백테스팅 기능

---

**이 통합을 통해 Nexus-Alpha는 AI 기반 분석 능력을 크게 향상시킬 수 있습니다!**
