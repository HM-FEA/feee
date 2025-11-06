"""
Market Data API - Yahoo Finance Integration
Provides stock market data for Nexus-Alpha platform
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import yfinance as yf
from pydantic import BaseModel
from datetime import datetime, timedelta
from .mock_data import (
    generate_stock_data,
    generate_batch_stocks,
    generate_historical_data,
    generate_news,
    generate_simulation_result,
)

app = FastAPI(
    title="Nexus-Alpha Market Data API",
    description="Yahoo Finance integration for stock market data",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Models
class StockData(BaseModel):
    ticker: str
    name: str
    sector: str
    price: float
    change: float
    changePercent: float
    volume: int
    marketCap: float
    pe: float | None = None
    dividendYield: float | None = None


class BatchStockRequest(BaseModel):
    tickers: List[str]


class HistoricalDataPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class StockHistoricalData(BaseModel):
    ticker: str
    data: List[HistoricalDataPoint]


# Routes
@app.get("/")
async def root():
    return {
        "service": "Market Data API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/api/stocks/{ticker}")
async def get_stock(ticker: str) -> StockData:
    """Get current stock data for a single ticker"""
    try:
        # Use mock data for development
        data = generate_stock_data(ticker)
        return StockData(**data)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Stock {ticker} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")


@app.post("/api/stocks/batch")
async def get_batch_stocks(request: BatchStockRequest) -> List[StockData]:
    """Get current stock data for multiple tickers"""
    try:
        data = generate_batch_stocks(request.tickers)
        return [StockData(**item) for item in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching batch data: {str(e)}")


@app.get("/api/stocks/{ticker}/history")
async def get_historical(
    ticker: str,
    period: str = "1mo"  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y
) -> StockHistoricalData:
    """Get historical price data for a ticker"""
    try:
        # Parse period to days
        period_days = {
            "1d": 1,
            "5d": 5,
            "1mo": 30,
            "3mo": 90,
            "6mo": 180,
            "1y": 365,
            "5y": 1825,
        }.get(period, 30)

        data_points = generate_historical_data(ticker, period_days)
        data = [HistoricalDataPoint(**point) for point in data_points]

        return StockHistoricalData(
            ticker=ticker,
            data=data
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")


@app.get("/api/news")
async def get_news(
    sector: str = "all",
    limit: int = 20,
    tickers: str | None = None
):
    """Get financial news"""
    news_items = generate_news()

    # Filter by sector if specified
    if sector != "all":
        news_items = [item for item in news_items if item["sector"] == sector or item["sector"] == "all"]

    return news_items[:limit]


# ============================================
# Phase 1: Banking + Real Estate Rate Simulator
# ============================================

class CompanyImpact(BaseModel):
    """회사별 영향"""
    company_id: str
    name: str
    sector: str
    current_net_income: float
    new_net_income: float
    net_income_change: float
    net_income_change_pct: float
    stock_impact_pct: float
    current_icr: float
    new_icr: float
    new_interest_expense: float
    status: str


class RateScenarioRequest(BaseModel):
    """금리 시나리오 요청"""
    old_rate: float
    new_rate: float


class RateScenarioResponse(BaseModel):
    """금리 시나리오 응답"""
    old_rate: float
    new_rate: float
    rate_change: float
    companies: List[CompanyImpact]


# Sample companies (Phase 1)
SAMPLE_COMPANIES = {
    "SH_BANK": {
        "name": "신한은행",
        "sector": "BANKING",
        "deposits": 350_000_000_000_000,
        "loans": 300_000_000_000_000,
        "current_ni": 2_520_000_000_000,
        "re_exposure": 0.25,
    },
    "KB_BANK": {
        "name": "KB금융",
        "sector": "BANKING",
        "deposits": 320_000_000_000_000,
        "loans": 310_000_000_000_000,
        "current_ni": 2_400_000_000_000,
        "re_exposure": 0.30,
    },
    "WOORI_BANK": {
        "name": "우리은행",
        "sector": "BANKING",
        "deposits": 280_000_000_000_000,
        "loans": 255_000_000_000_000,
        "current_ni": 1_900_000_000_000,
        "re_exposure": 0.15,
    },
    "SHINHAN_REIT": {
        "name": "신한알파리츠",
        "sector": "REALESTATE",
        "debt": 290_000_000_000,
        "ebitda": 13_290_000_000,
        "current_ni": 4_480_000_000,
        "current_interest_expense": 7_250_000_000,
    },
    "EREIT": {
        "name": "이리츠코크렙",
        "sector": "REALESTATE",
        "debt": 250_000_000_000,
        "ebitda": 5_000_000_000,
        "current_ni": 1_880_000_000,
        "current_interest_expense": 6_250_000_000,
    },
    "NH_REIT": {
        "name": "NH프라임리츠",
        "sector": "REALESTATE",
        "debt": 75_000_000_000,
        "ebitda": 8_000_000_000,
        "current_ni": 4_600_000_000,
        "current_interest_expense": 1_875_000_000,
    },
}


def calculate_banking_impact(company_data: dict, old_rate: float, new_rate: float) -> dict:
    """Banking: Rate ↑ → NIM ↑ → Revenue ↑"""
    rate_change = new_rate - old_rate
    deposits = company_data["deposits"]
    loans = company_data["loans"]
    current_ni = company_data["current_ni"]
    re_exposure = company_data["re_exposure"]

    # NII increase
    interest_income_increase = loans * rate_change * 1.0
    interest_expense_increase = deposits * rate_change * 0.4
    nii_increase = interest_income_increase - interest_expense_increase

    # Provision increase (RE stress)
    provision_increase = loans * re_exposure * rate_change * 0.5

    # Net income change
    ni_change = nii_increase - provision_increase
    new_ni = current_ni + ni_change

    return {
        "current_net_income": current_ni,
        "new_net_income": new_ni,
        "net_income_change": ni_change,
        "net_income_change_pct": (ni_change / current_ni) * 100,
        "stock_impact_pct": (ni_change / current_ni) * 100,
        "new_icr": 999.0,
        "current_icr": 999.0,
        "new_interest_expense": 0,
        "status": "POSITIVE" if ni_change > 0 else "NEGATIVE"
    }


def calculate_realestate_impact(company_data: dict, old_rate: float, new_rate: float) -> dict:
    """Real Estate: Rate ↑ → Interest Expense ↑ → Net Income ↓"""
    rate_change = new_rate - old_rate
    debt = company_data["debt"]
    ebitda = company_data["ebitda"]
    current_ni = company_data["current_ni"]
    tax_rate = 0.25

    old_interest_expense = company_data["current_interest_expense"]
    new_interest_expense = debt * new_rate
    interest_expense_increase = new_interest_expense - old_interest_expense

    tax_benefit = interest_expense_increase * tax_rate
    ni_change = -interest_expense_increase + tax_benefit
    new_ni = current_ni + ni_change

    current_icr = ebitda / old_interest_expense if old_interest_expense > 0 else 999
    new_icr = ebitda / new_interest_expense if new_interest_expense > 0 else 999

    if new_icr > 2.5:
        status = "SAFE"
    elif new_icr > 2.0:
        status = "CAUTION"
    else:
        status = "RISK"

    return {
        "current_net_income": current_ni,
        "new_net_income": new_ni,
        "net_income_change": ni_change,
        "net_income_change_pct": (ni_change / current_ni) * 100,
        "stock_impact_pct": (ni_change / current_ni) * 100,
        "current_icr": current_icr,
        "new_icr": new_icr,
        "new_interest_expense": new_interest_expense,
        "status": status
    }


@app.post("/api/simulator/rate-change")
async def simulate_rate_change(request: RateScenarioRequest) -> RateScenarioResponse:
    """
    Simulate interest rate change impact on Banking + Real Estate
    Phase 1: Core Foundation
    """
    old_rate = request.old_rate
    new_rate = request.new_rate
    rate_change = new_rate - old_rate

    impacts = []

    for company_id, company_data in SAMPLE_COMPANIES.items():
        sector = company_data["sector"]

        if sector == "BANKING":
            impact = calculate_banking_impact(company_data, old_rate, new_rate)
        elif sector == "REALESTATE":
            impact = calculate_realestate_impact(company_data, old_rate, new_rate)
        else:
            continue

        impacts.append(CompanyImpact(
            company_id=company_id,
            name=company_data["name"],
            sector=sector,
            **impact
        ))

    return RateScenarioResponse(
        old_rate=old_rate,
        new_rate=new_rate,
        rate_change=rate_change,
        companies=impacts
    )


# ============================================
# Phase 2: Analyst Report Agent
# ============================================

class AnalystReportRequest(BaseModel):
    """분석 리포트 요청"""
    company_id: str
    old_rate: float
    new_rate: float


class AnalystReport(BaseModel):
    """분석 리포트"""
    company_id: str
    company_name: str
    sector: str
    executive_summary: str
    current_situation: str
    rate_impact_analysis: str
    risk_assessment: str
    recommendation: str
    forecast: str


def generate_analyst_report(company_id: str, old_rate: float, new_rate: float) -> dict:
    """분석 리포트 자동 생성"""
    if company_id not in SAMPLE_COMPANIES:
        raise ValueError(f"Company {company_id} not found")

    company = SAMPLE_COMPANIES[company_id]
    rate_change = new_rate - old_rate
    rate_change_pct = (rate_change / old_rate) * 100 if old_rate > 0 else 0

    if company["sector"] == "BANKING":
        impact = calculate_banking_impact(company, old_rate, new_rate)
        ni_change_pct = impact["net_income_change_pct"]
        status = impact["status"]

        # 은행 리포트 템플릿
        executive_summary = (
            f"{company['name']}은(는) 금리 인상({rate_change_pct:+.1f}%)에서 긍정적인 영향을 받을 것으로 예상됩니다. "
            f"순이익 증가: {ni_change_pct:+.1f}%"
        )

        current_situation = (
            f"현재 {company['name']}의 주요 특성:\n"
            f"- 예금: ₩{company['deposits']/1e12:.1f}T\n"
            f"- 대출: ₩{company['loans']/1e12:.1f}T\n"
            f"- 부동산 노출도: {company['re_exposure']*100:.0f}%\n"
            f"- 현재 순이익: ₩{company['current_ni']/1e12:.2f}T"
        )

        rate_impact = (
            f"금리가 {old_rate*100:.1f}%에서 {new_rate*100:.1f}%로 인상될 경우:\n"
            f"- 순이자수익 증가: ₩{impact['net_income_change']/1e12:+.2f}T\n"
            f"- 신규 순이익: ₩{impact['new_net_income']/1e12:.2f}T\n"
            f"- 영향도: {ni_change_pct:+.1f}%\n\n"
            f"메커니즘:\n"
            f"- 대출금리 인상 > 예금금리 인상\n"
            f"- NIM(순이자마진) 확대\n"
            f"- 부동산 고객 스트레스 시 충당금 증가"
        )

        risk_assessment = (
            f"위험도 평가:\n"
            f"- 금리 민감도: 높음 (대출 비중 {company['loans']/company['deposits']*100:.0f}%)\n"
            f"- 부동산 노출: {company['re_exposure']*100:.0f}% (중간 수준)\n"
            f"- 핵심 위험: 부동산 차입자 부도 위험\n"
            f"- 현재 상태: {status}"
        )

        recommendation = (
            "투자 권고:\n"
            f"⭐ LONG\n\n"
            f"근거:\n"
            f"1. 금리 인상 환경에서 NIM 확대\n"
            f"2. 대출 수익성 향상\n"
            f"3. 배당금 증가 가능성\n\n"
            f"주의사항:\n"
            f"- 부동산 시장 악화 시 충당금 증가\n"
            f"- 장기 금리 인상 지속성 필요"
        )

        forecast = (
            f"향후 전망 (6개월):\n"
            f"- 순이익 증가 추세 지속\n"
            f"- ROA/ROE 개선\n"
            f"- 배당금 정책 긍정적\n\n"
            f"시나리오:\n"
            f"- Base Case: 금리 {new_rate*100:.1f}% 유지 → 순이익 증가\n"
            f"- Bull Case: 금리 {(new_rate+0.5)*100:.1f}% 추가 인상 → 더 큰 수익 증가\n"
            f"- Bear Case: 금리 인하 역전 → 수익 악화"
        )

    elif company["sector"] == "REALESTATE":
        impact = calculate_realestate_impact(company, old_rate, new_rate)
        ni_change_pct = impact["net_income_change_pct"]
        icr = impact["new_icr"]
        status = impact["status"]

        # 부동산 리포트 템플릿
        executive_summary = (
            f"{company['name']}은(는) 금리 인상({rate_change_pct:+.1f}%)에서 부정적인 영향을 받을 것으로 예상됩니다. "
            f"순이익 감소: {ni_change_pct:.1f}%, ICR: {icr:.2f}x"
        )

        current_situation = (
            f"현재 {company['name']}의 주요 특성:\n"
            f"- 부채: ₩{company['debt']/1e12:.2f}T\n"
            f"- EBITDA: ₩{company['ebitda']/1e9:.1f}B\n"
            f"- 이자비용: ₩{company['current_interest_expense']/1e9:.1f}B\n"
            f"- 현재 순이익: ₩{company['current_ni']/1e9:.1f}B"
        )

        rate_impact = (
            f"금리가 {old_rate*100:.1f}%에서 {new_rate*100:.1f}%로 인상될 경우:\n"
            f"- 이자비용 증가: ₩{impact['new_interest_expense']/1e9 - company['current_interest_expense']/1e9:+.1f}B\n"
            f"- 신규 순이익: ₩{impact['new_net_income']/1e9:.1f}B\n"
            f"- 영향도: {ni_change_pct:.1f}%\n"
            f"- 신규 ICR: {icr:.2f}x\n\n"
            f"메커니즘:\n"
            f"- 고정부채 증가 (금리 연동)\n"
            f"- 이자비용 크기로 인한 이자보상배수(ICR) 악화\n"
            f"- 배당금 감소 가능성"
        )

        risk_assessment = (
            f"위험도 평가:\n"
            f"- ICR: {icr:.2f}x ({status})\n"
            f"  {'✅ 안전 (> 2.5x)' if icr > 2.5 else '⚠️  주의 (2.0-2.5x)' if icr > 2.0 else '🔴 위험 (< 2.0x)'}\n"
            f"- 레버리지 비율: {company['debt']/company['ebitda']:.1f}x\n"
            f"- 핵심 위험: 부도 위험 상승\n"
            f"- 현재 상태: {status}"
        )

        recommendation = (
            f"투자 권고:\n"
            f"{'🔴 SHORT' if status == 'RISK' else '⚠️  HOLD' if status == 'CAUTION' else '✅ LONG'}\n\n"
            f"근거:\n"
            f"1. 금리 상승에 민감한 비즈니스 모델\n"
            f"2. ICR 악화로 배당금 압박\n"
            f"3. 부도 위험 증가\n\n"
            f"권고:\n"
            f"- {'부도 위험 높음 - 매도 권고' if status == 'RISK' else '부도 위험 주의 - 보유만' if status == 'CAUTION' else '상대적으로 안전 - 보유'}"
        )

        forecast = (
            f"향후 전망 (6개월):\n"
            f"- 이자비용 부담 증가\n"
            f"- 배당금 감소 또는 중단\n"
            f"- 자산 매각 가능성\n\n"
            f"시나리오:\n"
            f"- Base Case: 금리 {new_rate*100:.1f}% 유지 → 이자비용 증가로 수익 악화\n"
            f"- Bull Case: 금리 인하 전환 → 이자비용 감소\n"
            f"- Bear Case: 금리 추가 인상 → 부도 위험 심화"
        )

    else:
        return {}

    return {
        "company_id": company_id,
        "company_name": company["name"],
        "sector": company["sector"],
        "executive_summary": executive_summary,
        "current_situation": current_situation,
        "rate_impact_analysis": rate_impact,
        "risk_assessment": risk_assessment,
        "recommendation": recommendation,
        "forecast": forecast
    }


@app.post("/api/reports/analyst")
async def get_analyst_report(request: AnalystReportRequest) -> AnalystReport:
    """분석 리포트 생성 (자동)"""
    try:
        report_data = generate_analyst_report(request.company_id, request.old_rate, request.new_rate)
        return AnalystReport(**report_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


# ============================================
# Phase 3: Manufacturing Sector (Tariff Sensitivity)
# ============================================

class TariffScenarioRequest(BaseModel):
    """관세 시나리오 요청"""
    tariff_rate: float  # 관세율 (%)
    base_tariff_rate: float = 0.0


class ManufacturingImpact(BaseModel):
    """제조업 회사 영향"""
    company_id: str
    name: str
    sector: str
    current_revenue: float
    new_revenue: float
    current_cogs: float
    new_cogs: float
    current_net_income: float
    new_net_income: float
    net_income_change: float
    net_income_change_pct: float
    stock_impact_pct: float
    capacity_utilization: float
    new_capacity_utilization: float
    status: str


class TariffScenarioResponse(BaseModel):
    """관세 시나리오 응답"""
    tariff_rate: float
    base_tariff_rate: float
    tariff_change: float
    companies: list[ManufacturingImpact]


# Manufacturing companies (Phase 3)
MANUFACTURING_COMPANIES = {
    "SAMSUNG": {
        "name": "삼성전자",
        "sector": "MANUFACTURING",
        "revenue": 280_000_000_000_000,
        "current_cogs_ratio": 0.643,
        "opex": 50_000_000_000_000,
        "current_ni": 35_000_000_000_000,
        "import_exposure": 0.70,
        "export_ratio": 0.95,
        "capacity_utilization": 0.80,
        "margin_per_unit": 50_000_000_000,
    },
    "SK_HYNIX": {
        "name": "SK하이닉스",
        "sector": "MANUFACTURING",
        "revenue": 70_000_000_000_000,
        "current_cogs_ratio": 0.60,
        "opex": 12_000_000_000_000,
        "current_ni": 12_000_000_000_000,
        "import_exposure": 0.65,
        "export_ratio": 0.92,
        "capacity_utilization": 0.90,
        "margin_per_unit": 30_000_000_000,
    },
    "LG_ELEC": {
        "name": "LG전자",
        "sector": "MANUFACTURING",
        "revenue": 85_000_000_000_000,
        "current_cogs_ratio": 0.706,
        "opex": 15_000_000_000_000,
        "current_ni": 8_000_000_000_000,
        "import_exposure": 0.75,
        "export_ratio": 0.85,
        "capacity_utilization": 0.90,
        "margin_per_unit": 25_000_000_000,
    },
}


def calculate_manufacturing_impact(company_data: dict, tariff_rate: float, base_tariff_rate: float = 0.0) -> dict:
    """Manufacturing: Tariff ↑ → COGS ↑ → Net Income ↓"""
    tariff_change = tariff_rate - base_tariff_rate

    revenue = company_data["revenue"]
    current_cogs_ratio = company_data["current_cogs_ratio"]
    opex = company_data["opex"]
    current_ni = company_data["current_ni"]
    import_exposure = company_data["import_exposure"]
    capacity_utilization = company_data["capacity_utilization"]
    tax_rate = 0.25

    # COGS 영향 (Eq M1)
    # 관세 인상 → 수입 원자재 비용 증가
    new_cogs_ratio = current_cogs_ratio + (tariff_change / 100 * import_exposure)
    current_cogs = revenue * current_cogs_ratio
    new_cogs = revenue * new_cogs_ratio

    # 가동률 영향 (관세로 수요 감소 가정)
    # 관세 25% 인상 시 가동률 약 10% 감소
    new_capacity_utilization = max(0.4, capacity_utilization - (tariff_change / 100 * 0.4))

    # 수익 영향 (가동률 감소 → 수익 감소)
    capacity_change = new_capacity_utilization - capacity_utilization
    revenue_from_capacity = revenue * (capacity_change / capacity_utilization) if capacity_utilization > 0 else 0
    new_revenue = revenue + revenue_from_capacity

    # Operating income 변화
    cogs_increase = new_cogs - current_cogs
    operating_income_change = revenue_from_capacity - cogs_increase

    # Tax benefit (이자비용이 아니므로 직접 감소)
    tax_impact = operating_income_change * tax_rate
    ni_change = operating_income_change - tax_impact
    new_ni = current_ni + ni_change

    # Status 결정
    if ni_change > 0:
        status = "POSITIVE"
    elif ni_change > -current_ni * 0.1:  # 10% 이상 감소 아님
        status = "CAUTION"
    else:
        status = "RISK"

    return {
        "current_revenue": revenue,
        "new_revenue": new_revenue,
        "current_cogs": current_cogs,
        "new_cogs": new_cogs,
        "current_net_income": current_ni,
        "new_net_income": new_ni,
        "net_income_change": ni_change,
        "net_income_change_pct": (ni_change / current_ni) * 100,
        "stock_impact_pct": (ni_change / current_ni) * 100,
        "capacity_utilization": capacity_utilization,
        "new_capacity_utilization": new_capacity_utilization,
        "status": status
    }


@app.post("/api/simulator/tariff-change")
async def simulate_tariff_change(request: TariffScenarioRequest):
    """
    Simulate tariff rate change impact on Manufacturing
    Phase 3: Manufacturing sector expansion
    """
    tariff_rate = request.tariff_rate / 100  # Convert percentage to decimal
    base_tariff_rate = request.base_tariff_rate / 100
    tariff_change = tariff_rate - base_tariff_rate

    impacts = []

    for company_id, company_data in MANUFACTURING_COMPANIES.items():
        impact = calculate_manufacturing_impact(company_data, tariff_rate * 100, base_tariff_rate * 100)

        impacts.append(ManufacturingImpact(
            company_id=company_id,
            name=company_data["name"],
            sector=company_data["sector"],
            **impact
        ))

    return TariffScenarioResponse(
        tariff_rate=request.tariff_rate,
        base_tariff_rate=request.base_tariff_rate,
        tariff_change=tariff_change * 100,
        companies=impacts
    )


# ============================================
# Trading Agent (자연어 분석)
# ============================================

class TradingAgentRequest(BaseModel):
    """거래 에이전트 요청"""
    query: str
    current_scenario: dict = {}


class TradingAgentResponse(BaseModel):
    """거래 에이전트 응답"""
    query: str
    analysis: str
    recommendation: str
    confidence: float


def analyze_query_with_agent(query: str, scenario: dict = {}) -> dict:
    """고도화된 자연어 쿼리 분석"""
    analysis = ""
    recommendation = ""
    confidence = 0.75
    details = {}

    query_lower = query.lower()

    # 금리 관련 - 고도화된 분석
    if "금리" in query_lower or "rate" in query_lower:
        rate = scenario.get('interestRate', 3.0)
        analysis = (
            f"현재 금리 {rate:.1f}% 환경 분석:\n\n"
            f"1️⃣ Banking 섹터:\n"
            f"   • 신한은행: NIM 확대 → +24.3% 수익 증가\n"
            f"   • NII (Net Interest Income) 상승의 주요 드라이버\n"
            f"   • 대출금리 인상 > 예금금리 인상 (스프레드 확대)\n"
            f"   • 부동산 고객 부도 위험 증가 → 충당금 비용 발생\n\n"
            f"2️⃣ Real Estate 섹터:\n"
            f"   • 이자비용 급증 → 순이익 악화\n"
            f"   • 이리츠코크렙: ICR 0.67x (부도 위험!)\n"
            f"   • EBITDA 대비 이자비용 비중 악화\n"
            f"   • 배당금 감소 또는 중단 가능성\n\n"
            f"3️⃣ Cross-Sector Impact:\n"
            f"   • 은행이 부동산에 대출 → 부도율 상승\n"
            f"   • 은행의 신용손실충당금 증가\n"
            f"   • 시스템 위험 (Systemic Risk) 증가"
        )
        recommendation = (
            "🏦 Banking BUY (특히 대출 포트폴리오 양호한 기업)\n"
            "🏢 Real Estate SELL (ICR < 2.0x 회피)\n"
            "⚖️ 포트폴리오: 80% Banking / 20% Cash"
        )
        confidence = 0.88
        details = {
            "banking_avg": 24.3,
            "realestate_avg": -26.8,
            "systemic_risk": "HIGH"
        }

    # 관세 관련 - 고도화된 분석
    elif "관세" in query_lower or "tariff" in query_lower:
        tariff = scenario.get('tariffRate', 0)
        analysis = (
            f"관세율 {tariff:.0f}% 시나리오 분석:\n\n"
            f"1️⃣ Manufacturing 직접 영향:\n"
            f"   • 삼성전자: COGS 증가 (70% 수입 의존도)\n"
            f"     - 원가율: 64.3% → 71.3% (+7%p)\n"
            f"     - 순이익: 35조 → 24.5조 (-31%)\n"
            f"     - 가동률: 80% → 72% (수요 감소)\n\n"
            f"   • SK하이닉스: 더 심각 (65% 수입 의존도)\n"
            f"     - 순이익: 12조 → 8.5조 (-29%)\n"
            f"     - 이익률 압박 심화\n\n"
            f"2️⃣ Contagion Effect:\n"
            f"   • 제조업 고객의 신용도 악화\n"
            f"   • 은행들의 부도율 상승 → 충당금 증가\n"
            f"   • 설비투자 감소 → 건설 수요 부진\n"
            f"   • REIT 자산가치 하락\n\n"
            f"3️⃣ 거시경제 영향:\n"
            f"   • 실업률 상승 우려\n"
            f"   • 수출 경쟁력 약화\n"
            f"   • 구조적 성장률 둔화"
        )
        recommendation = (
            "🏭 Manufacturing SELL (특히 수입의존도 높은 기업)\n"
            "🏦 Banking AVOID (Manufacturing 노출도 확인)\n"
            "💰 Current: 관세 완화 협상 모니터링 필수"
        )
        confidence = 0.86
        details = {
            "samsung_impact": -31,
            "sk_hynix_impact": -29,
            "lg_impact": -44,
            "systemic_risk": "VERY_HIGH"
        }

    # 환율 관련 - 고도화된 분석
    elif "환율" in query_lower or "fx" in query_lower or "환" in query_lower:
        fx = scenario.get('fxRate', 1200)
        analysis = (
            f"환율 {fx:.0f} KRW/USD 분석:\n\n"
            f"1️⃣ Manufacturing 수출 경쟁력:\n"
            f"   • 원화 약세 (1200 → 1400): +16.7%\n"
            f"   • 삼성전자 수출 수익 +8% 증가\n"
            f"   • SK하이닉스 수익 +7.7% 증가\n"
            f"   • 글로벌 가격 경쟁력 향상\n\n"
            f"2️⃣ Positive Impact:\n"
            f"   • 제조업 이익률 개선\n"
            f"   • 경기 회복 신호\n"
            f"   • 해외 매출 기업 선호\n\n"
            f"3️⃣ Negative Impact:\n"
            f"   • 수입 원자재 가격 상승\n"
            f"   • 통화 위험 증가\n"
            f"   • 중앙은행 개입 가능성"
        )
        recommendation = (
            "✅ Manufacturing BUY (수출 기업 중심)\n"
            "📈 특히: 삼성 전자, SK 하이닉스\n"
            "⚠️  주의: 환율 급락 위험 (Hedge 권고)"
        )
        confidence = 0.84
        details = {
            "samsung_boost": 25,
            "sk_boost": 35,
            "export_benefit": "HIGH"
        }

    # 부도 위험 분석
    elif "부도" in query_lower or "default" in query_lower or "risk" in query_lower or "icr" in query_lower:
        analysis = (
            "부도 위험도 분석:\n\n"
            f"🔴 HIGH RISK (즉시 회피):\n"
            f"   • 이리츠코크렙 (EREIT): ICR 0.67x\n"
            f"     - 부채: 250조, EBITDA: 5조\n"
            f"     - 이자비용 > EBITDA\n"
            f"     - 부도 확률: 60~70%\n"
            f"     - 신한은행 200조 대출 위험\n\n"
            f"⚠️  MEDIUM RISK (모니터링):\n"
            f"   • 신한알파리츠: ICR 1.53x (금리 3% 기준)\n"
            f"     - 경계 수준 (2.0x 미만)\n"
            f"     - 금리 추가 인상 시 위험 증가\n\n"
            f"✅ SAFE (보유 가능):\n"
            f"   • NH프라임리츠: ICR 3.56x\n"
            f"     - 안전 마진 충분\n"
            f"     - 배당금 안정성 높음\n\n"
            f"은행 노출도:\n"
            f"   • 신한은행: 부동산 대출 350조 (전체 대출의 25%)\n"
            f"   • 충당금 증가 → 은행 수익성 악화"
        )
        recommendation = (
            "🛑 EREIT: 매도 + 손절 (부도 임박)\n"
            "🟡 신한알파: 감소 추천\n"
            "✅ NH프라임: 보유\n"
            "💼 은행: 부도율 모니터링 필수"
        )
        confidence = 0.92
        details = {
            "ereit_default_probability": 0.68,
            "shinhan_reit_icr": 1.53,
            "nh_prime_icr": 3.56,
            "banking_exposure": "HIGH"
        }

    # 종합 분석
    else:
        analysis = (
            "종합 거시경제 분석:\n\n"
            "📊 현재 상황:\n"
            f"   • 금리: {scenario.get('interestRate', 2.5):.1f}%\n"
            f"   • 관세: {scenario.get('tariffRate', 0):.0f}%\n"
            f"   • 환율: {scenario.get('fxRate', 1200):.0f} KRW/USD\n\n"
            "3가지 거시 변수의 충돌:\n"
            "   1. 금리 인상 → Banking 긍정, RE 부정\n"
            "   2. 관세 인상 → Manufacturing 약세\n"
            "   3. 환율 변동 → 수출입 경쟁력 변화\n\n"
            "포트폴리오 영향:\n"
            "   • Sector Correlation: 높음 (공동 하락 위험)\n"
            "   • Systemic Risk: 중간~높음\n"
            "   • 다각화 필요"
        )
        recommendation = (
            "⚖️ 분산 투자 전략:\n"
            "   - 40% Banking (높은 수익성)\n"
            "   - 20% Real Estate (저평가 가능)\n"
            "   - 30% Manufacturing (환율/관세 모니터링)\n"
            "   - 10% Cash (유동성)"
        )
        confidence = 0.75
        details = {
            "diversification": True,
            "risk_level": "MEDIUM"
        }

    return {
        "query": query,
        "analysis": analysis,
        "recommendation": recommendation,
        "confidence": confidence,
        "details": details
    }


@app.post("/api/trading-agent/analyze")
async def trading_agent_analyze(request: TradingAgentRequest) -> TradingAgentResponse:
    """거래 에이전트 분석"""
    try:
        result = analyze_query_with_agent(request.query, request.current_scenario)
        return TradingAgentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent analysis failed: {str(e)}")


# ============================================
# DART API 통합 (한국 기업 재무제표)
# ============================================

class DARTFinancialRequest(BaseModel):
    """DART 재무제표 요청"""
    company_code: str  # 종목코드 (예: 005930 - 삼성전자)
    year: int = 2024
    report_type: str = "11011"  # 사업보고서


class DARTFinancialResponse(BaseModel):
    """DART 재무제표 응답"""
    company_code: str
    company_name: str
    year: int
    revenue: float
    operating_income: float
    net_income: float
    total_assets: float
    total_liabilities: float
    total_equity: float
    current_assets: float
    current_liabilities: float
    cash: float
    debt: float
    # Ratios
    debt_ratio: float
    current_ratio: float
    roe: float
    roa: float
    operating_margin: float
    net_margin: float


# 실제 DART API는 API 키 필요하므로, 샘플 데이터로 구현
# 향후 DART API 키 등록 시: https://opendart.fss.or.kr/
DART_SAMPLE_DATA = {
    "005930": {  # 삼성전자
        "company_name": "삼성전자",
        "revenue": 302_231_000_000_000,
        "operating_income": 54_336_000_000_000,
        "net_income": 35_982_000_000_000,
        "total_assets": 448_800_000_000_000,
        "total_liabilities": 115_549_000_000_000,
        "total_equity": 333_251_000_000_000,
        "current_assets": 180_957_000_000_000,
        "current_liabilities": 88_117_000_000_000,
        "cash": 75_782_000_000_000,
        "debt": 21_074_000_000_000,
    },
    "000660": {  # SK하이닉스
        "company_name": "SK하이닉스",
        "revenue": 73_744_000_000_000,
        "operating_income": 15_715_000_000_000,
        "net_income": 12_128_000_000_000,
        "total_assets": 106_215_000_000_000,
        "total_liabilities": 46_978_000_000_000,
        "total_equity": 59_237_000_000_000,
        "current_assets": 39_458_000_000_000,
        "current_liabilities": 18_347_000_000_000,
        "cash": 12_459_000_000_000,
        "debt": 26_132_000_000_000,
    },
    "066570": {  # LG전자
        "company_name": "LG전자",
        "revenue": 84_177_000_000_000,
        "operating_income": 2_756_000_000_000,
        "net_income": 1_772_000_000_000,
        "total_assets": 62_338_000_000_000,
        "total_liabilities": 38_927_000_000_000,
        "total_equity": 23_411_000_000_000,
        "current_assets": 29_847_000_000_000,
        "current_liabilities": 23_115_000_000_000,
        "cash": 6_924_000_000_000,
        "debt": 12_346_000_000_000,
    },
    "055550": {  # 신한지주
        "company_name": "신한지주",
        "revenue": 21_543_000_000_000,
        "operating_income": 6_832_000_000_000,
        "net_income": 4_921_000_000_000,
        "total_assets": 634_517_000_000_000,
        "total_liabilities": 598_234_000_000_000,
        "total_equity": 36_283_000_000_000,
        "current_assets": 87_452_000_000_000,
        "current_liabilities": 124_567_000_000_000,
        "cash": 45_234_000_000_000,
        "debt": 342_156_000_000_000,
    },
}


def calculate_financial_ratios(data: dict) -> dict:
    """재무비율 계산"""
    revenue = data["revenue"]
    operating_income = data["operating_income"]
    net_income = data["net_income"]
    total_assets = data["total_assets"]
    total_liabilities = data["total_liabilities"]
    total_equity = data["total_equity"]
    current_assets = data["current_assets"]
    current_liabilities = data["current_liabilities"]

    # Ratios
    debt_ratio = (total_liabilities / total_equity) * 100 if total_equity > 0 else 0
    current_ratio = (current_assets / current_liabilities) * 100 if current_liabilities > 0 else 0
    roe = (net_income / total_equity) * 100 if total_equity > 0 else 0
    roa = (net_income / total_assets) * 100 if total_assets > 0 else 0
    operating_margin = (operating_income / revenue) * 100 if revenue > 0 else 0
    net_margin = (net_income / revenue) * 100 if revenue > 0 else 0

    return {
        "debt_ratio": round(debt_ratio, 2),
        "current_ratio": round(current_ratio, 2),
        "roe": round(roe, 2),
        "roa": round(roa, 2),
        "operating_margin": round(operating_margin, 2),
        "net_margin": round(net_margin, 2),
    }


@app.post("/api/dart/financial")
async def get_dart_financial(request: DARTFinancialRequest) -> DARTFinancialResponse:
    """DART 재무제표 조회"""
    try:
        # 샘플 데이터에서 조회
        if request.company_code not in DART_SAMPLE_DATA:
            raise HTTPException(status_code=404, detail=f"Company {request.company_code} not found")

        company_data = DART_SAMPLE_DATA[request.company_code]
        ratios = calculate_financial_ratios(company_data)

        return DARTFinancialResponse(
            company_code=request.company_code,
            year=request.year,
            **company_data,
            **ratios
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching DART data: {str(e)}")


@app.get("/api/dart/companies")
async def get_dart_companies():
    """등록된 회사 목록"""
    return {
        "companies": [
            {"code": "005930", "name": "삼성전자", "sector": "MANUFACTURING"},
            {"code": "000660", "name": "SK하이닉스", "sector": "MANUFACTURING"},
            {"code": "066570", "name": "LG전자", "sector": "MANUFACTURING"},
            {"code": "055550", "name": "신한지주", "sector": "BANKING"},
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
