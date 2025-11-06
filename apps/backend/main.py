"""
Nexus-Alpha Backend API
FastAPI server integrating TradingAgents and yfinance
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import yfinance as yf
from datetime import datetime, timedelta
import sys
import os

# TradingAgents 경로 추가
TRADINGAGENTS_PATH = "/Users/jeonhyeonmin/Simulation/TradingAgents"
if TRADINGAGENTS_PATH not in sys.path:
    sys.path.append(TRADINGAGENTS_PATH)

app = FastAPI(
    title="Nexus-Alpha API",
    description="AI-powered financial analysis platform",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Data Models
# ============================================

class StockPriceResponse(BaseModel):
    ticker: str
    current_price: float
    price_change_1d: float
    price_change_1w: float
    volume: int
    market_cap: Optional[float]
    last_updated: str

class FinancialRatios(BaseModel):
    roe: Optional[float]
    roa: Optional[float]
    pe_ratio: Optional[float]
    pb_ratio: Optional[float]
    debt_to_equity: Optional[float]
    current_ratio: Optional[float]

class FundamentalResponse(BaseModel):
    ticker: str
    company_name: str
    sector: str
    ratios: FinancialRatios
    revenue: Optional[float]
    net_income: Optional[float]
    total_assets: Optional[float]
    recommendation: Optional[str]

class TechnicalIndicators(BaseModel):
    macd: float
    signal: float
    rsi: float
    sma_20: float
    sma_50: float
    bollinger_upper: float
    bollinger_lower: float

class TechnicalResponse(BaseModel):
    ticker: str
    indicators: TechnicalIndicators
    trend: str
    strength: float
    signals: List[str]

# ============================================
# Helper Functions
# ============================================

def calculate_technical_indicators(ticker: str) -> Dict:
    """Calculate technical indicators using yfinance data"""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")

        if hist.empty:
            raise ValueError(f"No data available for {ticker}")

        close = hist['Close']

        # MACD
        exp12 = close.ewm(span=12, adjust=False).mean()
        exp26 = close.ewm(span=26, adjust=False).mean()
        macd = exp12 - exp26
        signal = macd.ewm(span=9, adjust=False).mean()

        # RSI
        delta = close.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))

        # Moving Averages
        sma_20 = close.rolling(window=20).mean()
        sma_50 = close.rolling(window=50).mean()

        # Bollinger Bands
        bb_middle = sma_20
        bb_std = close.rolling(window=20).std()
        bb_upper = bb_middle + (bb_std * 2)
        bb_lower = bb_middle - (bb_std * 2)

        # Get latest values
        latest = {
            "macd": float(macd.iloc[-1]),
            "signal": float(signal.iloc[-1]),
            "rsi": float(rsi.iloc[-1]),
            "sma_20": float(sma_20.iloc[-1]),
            "sma_50": float(sma_50.iloc[-1]),
            "bollinger_upper": float(bb_upper.iloc[-1]),
            "bollinger_lower": float(bb_lower.iloc[-1]),
            "current_price": float(close.iloc[-1])
        }

        # Determine trend
        if latest["macd"] > latest["signal"] and latest["rsi"] > 50:
            trend = "BULLISH"
            strength = min((latest["rsi"] - 50) / 50, 1.0)
        elif latest["macd"] < latest["signal"] and latest["rsi"] < 50:
            trend = "BEARISH"
            strength = min((50 - latest["rsi"]) / 50, 1.0)
        else:
            trend = "NEUTRAL"
            strength = 0.5

        # Generate signals
        signals = []
        if latest["rsi"] > 70:
            signals.append("Overbought - Consider selling")
        elif latest["rsi"] < 30:
            signals.append("Oversold - Consider buying")

        if latest["current_price"] > latest["bollinger_upper"]:
            signals.append("Price above upper Bollinger Band")
        elif latest["current_price"] < latest["bollinger_lower"]:
            signals.append("Price below lower Bollinger Band")

        if latest["sma_20"] > latest["sma_50"]:
            signals.append("Golden Cross - Bullish signal")
        elif latest["sma_20"] < latest["sma_50"]:
            signals.append("Death Cross - Bearish signal")

        return {
            "indicators": latest,
            "trend": trend,
            "strength": strength,
            "signals": signals
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating indicators: {str(e)}")

# ============================================
# API Endpoints
# ============================================

@app.get("/")
async def root():
    return {
        "message": "Nexus-Alpha API v2.0",
        "version": "2.0.0",
        "description": "AI-powered financial analysis platform with 9 advanced features",
        "core_endpoints": {
            "stock_price": "/api/stock/{ticker}",
            "fundamental": "/api/fundamental/{ticker}",
            "technical": "/api/technical/{ticker}",
            "news": "/api/news/{ticker}"
        },
        "advanced_features": {
            "portfolio": "/api/portfolio/{user_id}",
            "alerts": "/api/alerts/{user_id}",
            "comparison": "/api/compare/{ticker1}/{ticker2}",
            "sentiment": "/api/sentiment/{ticker}",
            "prediction": "/api/predict/{ticker}",
            "chart": "/api/chart/{ticker}",
            "backtest": "/api/backtest/{ticker}",
            "analytics": "/api/analytics/{ticker}",
            "news_summary": "/api/news-summary/{ticker}"
        },
        "features_status": "/api/features/status"
    }

@app.get("/api/stock/{ticker}", response_model=StockPriceResponse)
async def get_stock_price(ticker: str):
    """Get current stock price and basic info"""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="1mo")

        if hist.empty:
            raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")

        current_price = float(hist['Close'].iloc[-1])
        prev_close_1d = float(hist['Close'].iloc[-2]) if len(hist) > 1 else current_price
        prev_close_1w = float(hist['Close'].iloc[-5]) if len(hist) > 5 else current_price

        return StockPriceResponse(
            ticker=ticker.upper(),
            current_price=current_price,
            price_change_1d=((current_price - prev_close_1d) / prev_close_1d) * 100,
            price_change_1w=((current_price - prev_close_1w) / prev_close_1w) * 100,
            volume=int(hist['Volume'].iloc[-1]),
            market_cap=info.get('marketCap'),
            last_updated=datetime.now().isoformat()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/fundamental/{ticker}", response_model=FundamentalResponse)
async def get_fundamental_analysis(ticker: str):
    """Get fundamental analysis data"""
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        # Extract financial ratios
        ratios = FinancialRatios(
            roe=info.get('returnOnEquity'),
            roa=info.get('returnOnAssets'),
            pe_ratio=info.get('trailingPE'),
            pb_ratio=info.get('priceToBook'),
            debt_to_equity=info.get('debtToEquity'),
            current_ratio=info.get('currentRatio')
        )

        # Basic recommendation logic
        recommendation = "HOLD"
        if ratios.pe_ratio and ratios.pe_ratio < 15:
            recommendation = "BUY - Undervalued (Low P/E)"
        elif ratios.pe_ratio and ratios.pe_ratio > 30:
            recommendation = "SELL - Overvalued (High P/E)"

        return FundamentalResponse(
            ticker=ticker.upper(),
            company_name=info.get('longName', ticker),
            sector=info.get('sector', 'Unknown'),
            ratios=ratios,
            revenue=info.get('totalRevenue'),
            net_income=info.get('netIncomeToCommon'),
            total_assets=info.get('totalAssets'),
            recommendation=recommendation
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/technical/{ticker}", response_model=TechnicalResponse)
async def get_technical_analysis(ticker: str):
    """Get technical analysis with indicators"""
    try:
        result = calculate_technical_indicators(ticker)

        indicators = TechnicalIndicators(
            macd=result["indicators"]["macd"],
            signal=result["indicators"]["signal"],
            rsi=result["indicators"]["rsi"],
            sma_20=result["indicators"]["sma_20"],
            sma_50=result["indicators"]["sma_50"],
            bollinger_upper=result["indicators"]["bollinger_upper"],
            bollinger_lower=result["indicators"]["bollinger_lower"]
        )

        return TechnicalResponse(
            ticker=ticker.upper(),
            indicators=indicators,
            trend=result["trend"],
            strength=result["strength"],
            signals=result["signals"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news/{ticker}")
async def get_news_analysis(ticker: str):
    """Get news data for ticker"""
    try:
        stock = yf.Ticker(ticker)
        news = stock.news

        return {
            "ticker": ticker.upper(),
            "news": news[:10],  # Latest 10 news items
            "count": len(news)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

# ============================================
# AI-Powered Report Generation (OpenAI)
# ============================================

try:
    from openai import OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    if OPENAI_API_KEY:
        client = OpenAI(api_key=OPENAI_API_KEY)
        AI_ENABLED = True
    else:
        AI_ENABLED = False
        print("⚠️  OPENAI_API_KEY not set - AI endpoints will use simulated responses")

except ImportError:
    AI_ENABLED = False
    print("⚠️  OpenAI library not installed - AI endpoints disabled")

class AIReportRequest(BaseModel):
    ticker: str
    company_name: str
    sector: str
    interest_rate: Optional[float] = 2.5
    tariff_rate: Optional[float] = 0
    fx_rate: Optional[float] = 1200
    current_price: Optional[float] = None
    pe_ratio: Optional[float] = None
    roe: Optional[float] = None

class AIReport(BaseModel):
    ticker: str
    title: str
    summary: str
    sentiment: str  # bullish, neutral, bearish
    confidence: float
    key_points: List[str]
    macro_impact_analysis: Dict
    recommendation: str
    generated_at: str

@app.post("/api/ai-report", response_model=AIReport)
async def generate_ai_report(request: AIReportRequest):
    """Generate AI-powered investment report using OpenAI"""

    try:
        if AI_ENABLED:
            # Generate report using OpenAI
            prompt = f"""
You are an expert financial analyst. Generate a professional investment report for {request.company_name} ({request.ticker}).

Company Details:
- Sector: {request.sector}
- Current Price: ${request.current_price or 'N/A'}
- P/E Ratio: {request.pe_ratio or 'N/A'}
- ROE: {request.roe or 'N/A'}%

Macro Environment:
- Interest Rate: {request.interest_rate}%
- Tariff Rate: {request.tariff_rate}%
- FX Rate (KRW/USD): {request.fx_rate}

Provide your analysis in the following JSON format:
{{
    "sentiment": "bullish|neutral|bearish",
    "confidence": 0.0-1.0,
    "summary": "Brief investment thesis (2-3 sentences)",
    "key_points": ["point1", "point2", "point3"],
    "macro_impact": {{
        "rate_impact": "description",
        "tariff_impact": "description",
        "fx_impact": "description"
    }},
    "recommendation": "BUY|HOLD|SELL with rationale"
}}

Be concise and data-driven. Focus on the macro impacts relevant to {request.sector}.
"""

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional financial analyst. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format={"type": "json_object"}
            )

            import json
            report_data = json.loads(response.choices[0].message.content)

            return AIReport(
                ticker=request.ticker,
                title=f"{request.company_name} Investment Analysis Report",
                summary=report_data.get("summary", ""),
                sentiment=report_data.get("sentiment", "neutral"),
                confidence=report_data.get("confidence", 0.5),
                key_points=report_data.get("key_points", []),
                macro_impact_analysis=report_data.get("macro_impact", {}),
                recommendation=report_data.get("recommendation", "HOLD"),
                generated_at=datetime.now().isoformat()
            )

        else:
            # Fallback: Generate simulated response
            sentiments = ["bullish", "neutral", "bearish"]
            sentiment = sentiments[hash(request.ticker) % 3]

            # Determine sentiment based on macro factors
            if request.sector == "BANKING" and request.interest_rate > 3:
                sentiment = "bullish"
            elif request.sector == "MANUFACTURING" and request.tariff_rate > 20:
                sentiment = "bearish"
            elif request.sector == "SEMICONDUCTOR" and request.fx_rate < 1100:
                sentiment = "bullish"

            return AIReport(
                ticker=request.ticker,
                title=f"{request.company_name} Investment Analysis Report",
                summary=f"{request.company_name} ({request.ticker}) in {request.sector} sector shows {sentiment} indicators based on current macro environment. Interest rates at {request.interest_rate}% and tariff rates at {request.tariff_rate}% suggest {sentiment.upper()} positioning.",
                sentiment=sentiment,
                confidence=0.75,
                key_points=[
                    f"Company operates in {request.sector} sector",
                    f"Current macro environment: Rates {request.interest_rate}%, Tariffs {request.tariff_rate}%",
                    f"FX rate at {request.fx_rate} KRW/USD impacts export competitiveness"
                ],
                macro_impact_analysis={
                    "rate_impact": "Higher rates impact borrowing costs and consumer spending",
                    "tariff_impact": f"Tariff rate of {request.tariff_rate}% affects {request.sector} competitiveness",
                    "fx_impact": f"FX rate at {request.fx_rate} impacts export margins"
                },
                recommendation=f"{'BUY - Strong fundamentals in current macro environment' if sentiment == 'bullish' else 'HOLD - Monitor macro changes' if sentiment == 'neutral' else 'SELL - Headwinds in current environment'}",
                generated_at=datetime.now().isoformat()
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating AI report: {str(e)}")

# ============================================
# TradingAgents Integration
# ============================================

TA_ENABLED = False
TA_ERROR = None

try:
    from tradingagents.graph.trading_graph import TradingAgentsGraph
    from tradingagents.default_config import DEFAULT_CONFIG

    config = DEFAULT_CONFIG.copy()
    config["deep_think_llm"] = "gpt-4o-mini"
    config["quick_think_llm"] = "gpt-4o-mini"
    config["max_debate_rounds"] = 1

    ta = TradingAgentsGraph(debug=False, config=config)
    TA_ENABLED = True
    print("✅ TradingAgents loaded successfully")

except ImportError as e:
    TA_ERROR = f"TradingAgents not available: {str(e)}"
    print(f"⚠️  {TA_ERROR}")

except Exception as e:
    TA_ERROR = f"Error initializing TradingAgents: {str(e)}"
    print(f"⚠️  {TA_ERROR}")

class TradingAgentsAnalysis(BaseModel):
    ticker: str
    date: str
    decision: Optional[str]
    confidence: Optional[float]
    fundamental_analysis: Optional[Dict]
    technical_analysis: Optional[Dict]
    news_analysis: Optional[Dict]
    final_recommendation: Optional[str]

@app.get("/api/trading-agents/{ticker}", response_model=TradingAgentsAnalysis)
async def get_trading_agents_analysis(ticker: str, date: Optional[str] = None):
    """Get comprehensive AI-powered analysis from TradingAgents framework"""

    if not TA_ENABLED:
        raise HTTPException(
            status_code=503,
            detail=f"TradingAgents not available: {TA_ERROR}"
        )

    try:
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")

        # Run TradingAgents analysis
        state, decision = ta.propagate(ticker, date)

        return TradingAgentsAnalysis(
            ticker=ticker.upper(),
            date=date,
            decision=decision,
            confidence=state.get("confidence", 0.5),
            fundamental_analysis=state.get("fundamental_analyst_report"),
            technical_analysis=state.get("technical_analyst_report"),
            news_analysis=state.get("news_analyst_report"),
            final_recommendation=state.get("final_recommendation")
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error running TradingAgents analysis: {str(e)}"
        )

@app.get("/api/trading-agents/status")
async def get_trading_agents_status():
    """Get TradingAgents system status"""
    return {
        "enabled": TA_ENABLED,
        "error": TA_ERROR,
        "config": {
            "model": "gpt-4o-mini",
            "max_debate_rounds": 1,
            "debug": False
        }
    }

# ============================================
# Extended Features (Advanced Features Setup)
# ============================================

try:
    from extended_endpoints import setup_extended_endpoints
    setup_extended_endpoints(app)
    print("✅ Extended features loaded successfully")
except ImportError as e:
    print(f"⚠️  Extended features not available: {str(e)}")
except Exception as e:
    print(f"⚠️  Error loading extended features: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
