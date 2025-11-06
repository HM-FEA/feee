"""
Mock data generator for development and testing
"""

import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Real estate stocks data
REALESTATE_DATA = {
    "293940": {
        "name": "신한알파리츠",
        "sector": "Real Estate",
        "base_price": 9850.0,
    },
    "377190": {
        "name": "이리츠코크렙",
        "sector": "Real Estate",
        "base_price": 7200.0,
    },
    "338100": {
        "name": "NH프라임리츠",
        "sector": "Real Estate",
        "base_price": 9200.0,
    },
    "VNQ": {
        "name": "Vanguard Real Estate ETF",
        "sector": "Real Estate",
        "base_price": 82.50,
    },
    "SCHH": {
        "name": "Schwab US REIT ETF",
        "sector": "Real Estate",
        "base_price": 54.30,
    },
    "IYR": {
        "name": "iShares US Real Estate ETF",
        "sector": "Real Estate",
        "base_price": 180.45,
    },
}


def generate_stock_data(ticker: str) -> Dict[str, Any]:
    """Generate mock stock data"""
    if ticker not in REALESTATE_DATA:
        raise ValueError(f"Unknown ticker: {ticker}")

    info = REALESTATE_DATA[ticker]
    base_price = info["base_price"]

    # Random variation (-5% to +5%)
    change_percent = random.uniform(-5, 5)
    change = (base_price * change_percent) / 100
    current_price = base_price + change

    return {
        "ticker": ticker,
        "name": info["name"],
        "sector": info["sector"],
        "price": round(current_price, 2),
        "change": round(change, 2),
        "changePercent": round(change_percent, 2),
        "volume": random.randint(1000000, 50000000),
        "marketCap": random.randint(1000000000, 50000000000),
        "pe": round(random.uniform(10, 30), 2),
        "dividendYield": round(random.uniform(2, 6), 2),
    }


def generate_batch_stocks(tickers: List[str]) -> List[Dict[str, Any]]:
    """Generate mock data for multiple tickers"""
    return [generate_stock_data(ticker) for ticker in tickers]


def generate_historical_data(ticker: str, days: int = 30) -> List[Dict[str, Any]]:
    """Generate mock historical data"""
    if ticker not in REALESTATE_DATA:
        raise ValueError(f"Unknown ticker: {ticker}")

    base_price = REALESTATE_DATA[ticker]["base_price"]
    data = []

    for i in range(days, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")

        # Generate realistic OHLCV data
        open_price = base_price + random.uniform(-5, 5)
        close_price = base_price + random.uniform(-5, 5)
        high_price = max(open_price, close_price) + random.uniform(0, 2)
        low_price = min(open_price, close_price) - random.uniform(0, 2)

        data.append({
            "date": date,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": random.randint(1000000, 50000000),
        })

        # Small drift in base price
        base_price += random.uniform(-1, 1)

    return data


def generate_news() -> List[Dict[str, Any]]:
    """Generate mock news data"""
    news_items = [
        {
            "id": "1",
            "type": "news",
            "title": "Real Estate Sector Shows Strong Recovery in Q4",
            "source": "Financial Times",
            "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
            "sector": "real-estate",
            "sentiment": "positive",
            "url": "https://ft.com/news/1",
        },
        {
            "id": "2",
            "type": "market_update",
            "title": "Interest Rates Hold Steady at 3.5%",
            "source": "Bloomberg",
            "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
            "sector": "all",
            "sentiment": "neutral",
            "url": "https://bloomberg.com/news/2",
        },
        {
            "id": "3",
            "type": "analyst_report",
            "title": "REIT Valuations Attractive at Current Levels",
            "source": "Goldman Sachs",
            "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat(),
            "sector": "real-estate",
            "sentiment": "positive",
            "url": "https://goldmansachs.com/news/3",
        },
        {
            "id": "4",
            "type": "news",
            "title": "Commercial Real Estate Trends: Office Space Demand Down",
            "source": "Reuters",
            "timestamp": (datetime.now() - timedelta(minutes=45)).isoformat(),
            "sector": "real-estate",
            "sentiment": "negative",
            "url": "https://reuters.com/news/4",
        },
        {
            "id": "5",
            "type": "news",
            "title": "Residential Property Prices Continue Upward Trend",
            "source": "MarketWatch",
            "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
            "sector": "real-estate",
            "sentiment": "positive",
            "url": "https://marketwatch.com/news/5",
        },
    ]

    return sorted(news_items, key=lambda x: x["timestamp"], reverse=True)


def generate_simulation_result(
    tickers: List[str],
    interest_rate: float,
    current_rate: float = 2.5
) -> Dict[str, Any]:
    """Generate mock simulation results"""
    rate_change = interest_rate - current_rate
    impact_multiplier = abs(rate_change) / 10  # More impact for larger changes

    results = {
        "tickers": tickers,
        "current_rate": current_rate,
        "new_rate": interest_rate,
        "rate_change": rate_change,
        "companies": [],
    }

    for ticker in tickers:
        if ticker not in REALESTATE_DATA:
            continue

        base_stock = generate_stock_data(ticker)

        # Simulate interest rate impact
        # Rising rates generally hurt REITs
        impact_factor = -1 if rate_change > 0 else 1
        projected_price = base_stock["price"] * (1 + (impact_factor * impact_multiplier * 0.05))

        company_result = {
            "ticker": ticker,
            "name": base_stock["name"],
            "current": {
                "price": base_stock["price"],
                "dividendYield": base_stock["dividendYield"],
                "debtRatio": round(random.uniform(0.3, 0.7), 2),
                "interestCoverage": round(random.uniform(2, 5), 2),
            },
            "projected": {
                "price": round(projected_price, 2),
                "dividendYield": round(base_stock["dividendYield"] * (1 - impact_multiplier * 0.1), 2),
                "debtRatio": round(random.uniform(0.3, 0.7), 2),
                "interestCoverage": round(random.uniform(1.5, 4.5), 2),
            },
            "healthScore": round(random.uniform(40, 90), 1),
            "riskLevel": random.choice(["low", "medium", "high"]),
            "recommendation": random.choice(["buy", "hold", "sell"]),
        }
        results["companies"].append(company_result)

    return results
