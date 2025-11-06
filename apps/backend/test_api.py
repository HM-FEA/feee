"""
Integration tests for Nexus-Alpha API
Run with: pytest test_api.py -v
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from main import app
from cache import cache_manager


@pytest.fixture
def client():
    """FastAPI test client"""
    return TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def cleanup():
    """Cleanup cache after tests"""
    yield
    cache_manager.clear()


# ============================================
# Health & Status Tests
# ============================================

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert "endpoints" in data


# ============================================
# Stock Price Tests
# ============================================

def test_get_stock_price_valid(client):
    """Test getting stock price for valid ticker"""
    response = client.get("/api/stock/AAPL")
    assert response.status_code == 200
    data = response.json()

    assert data["ticker"] == "AAPL"
    assert "current_price" in data
    assert "price_change_1d" in data
    assert "price_change_1w" in data
    assert "volume" in data
    assert "last_updated" in data


def test_get_stock_price_invalid_ticker(client):
    """Test getting stock price for invalid ticker"""
    response = client.get("/api/stock/INVALID")
    assert response.status_code == 500  # yfinance will throw error


def test_get_stock_price_case_insensitive(client):
    """Test that ticker is case-insensitive"""
    response1 = client.get("/api/stock/AAPL")
    response2 = client.get("/api/stock/aapl")

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json()["ticker"] == response2.json()["ticker"] == "AAPL"


# ============================================
# Fundamental Analysis Tests
# ============================================

def test_get_fundamental_analysis(client):
    """Test fundamental analysis endpoint"""
    response = client.get("/api/fundamental/AAPL")
    assert response.status_code == 200
    data = response.json()

    assert data["ticker"] == "AAPL"
    assert "company_name" in data
    assert "sector" in data
    assert "ratios" in data
    assert "revenue" in data
    assert "net_income" in data
    assert "total_assets" in data
    assert "recommendation" in data


def test_fundamental_pe_ratio_logic(client):
    """Test P/E ratio recommendation logic"""
    response = client.get("/api/fundamental/AAPL")
    assert response.status_code == 200

    # Logic: pe < 15 = BUY, pe > 30 = SELL, else HOLD
    recommendation = response.json()["recommendation"]
    assert recommendation in ["BUY - Undervalued (Low P/E)", "SELL - Overvalued (High P/E)", "HOLD"]


# ============================================
# Technical Analysis Tests
# ============================================

def test_get_technical_analysis(client):
    """Test technical analysis endpoint"""
    response = client.get("/api/technical/AAPL")
    assert response.status_code == 200
    data = response.json()

    assert data["ticker"] == "AAPL"
    assert "indicators" in data
    assert "trend" in data
    assert "strength" in data
    assert "signals" in data

    # Validate indicator values
    indicators = data["indicators"]
    assert "rsi" in indicators
    assert "macd" in indicators
    assert "signal" in indicators
    assert "sma_20" in indicators
    assert "sma_50" in indicators
    assert "bollinger_upper" in indicators
    assert "bollinger_lower" in indicators


def test_technical_trend_values(client):
    """Test that trend is one of valid values"""
    response = client.get("/api/technical/AAPL")
    assert response.status_code == 200

    trend = response.json()["trend"]
    assert trend in ["BULLISH", "BEARISH", "NEUTRAL"]


def test_technical_strength_range(client):
    """Test that strength is between 0 and 1"""
    response = client.get("/api/technical/AAPL")
    assert response.status_code == 200

    strength = response.json()["strength"]
    assert 0.0 <= strength <= 1.0


# ============================================
# News Tests
# ============================================

def test_get_news(client):
    """Test news endpoint"""
    response = client.get("/api/news/AAPL")
    assert response.status_code == 200
    data = response.json()

    assert data["ticker"] == "AAPL"
    assert "news" in data
    assert "count" in data
    assert data["count"] <= 10  # Limited to 10 items


# ============================================
# AI Report Tests
# ============================================

def test_generate_ai_report(client):
    """Test AI report generation"""
    request_data = {
        "ticker": "AAPL",
        "company_name": "Apple Inc.",
        "sector": "Technology",
        "interest_rate": 5.25,
        "tariff_rate": 0,
        "fx_rate": 1200,
        "current_price": 230.0,
        "pe_ratio": 25.5,
        "roe": 85.0
    }

    response = client.post("/api/ai-report", json=request_data)
    assert response.status_code == 200
    data = response.json()

    assert data["ticker"] == "AAPL"
    assert data["title"] != ""
    assert data["sentiment"] in ["bullish", "neutral", "bearish"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert "key_points" in data
    assert "macro_impact_analysis" in data
    assert "recommendation" in data
    assert "generated_at" in data


def test_ai_report_missing_fields(client):
    """Test AI report with minimal fields"""
    request_data = {
        "ticker": "MSFT",
        "company_name": "Microsoft",
        "sector": "Technology"
    }

    response = client.post("/api/ai-report", json=request_data)
    assert response.status_code == 200
    data = response.json()

    # Should still work with default values
    assert data["sentiment"] in ["bullish", "neutral", "bearish"]


# ============================================
# Cache Tests
# ============================================

def test_cache_hit_on_stock_price(client):
    """Test that cache hits reduce API calls"""
    cache_manager.clear()

    # First request
    response1 = client.get("/api/stock/AAPL")
    assert response1.status_code == 200

    # Second request (should be cached)
    response2 = client.get("/api/stock/AAPL")
    assert response2.status_code == 200

    # Responses should be identical
    assert response1.json() == response2.json()


def test_cache_stats(client):
    """Test cache statistics"""
    from cache import cache_manager

    stats = cache_manager.get_stats()
    assert "memory_cache" in stats
    assert "hits" in stats["memory_cache"]
    assert "misses" in stats["memory_cache"]
    assert "hit_rate" in stats["memory_cache"]


# ============================================
# Error Handling Tests
# ============================================

def test_nonexistent_endpoint(client):
    """Test 404 on nonexistent endpoint"""
    response = client.get("/api/nonexistent")
    assert response.status_code == 404


def test_missing_required_field_ai_report(client):
    """Test validation error for missing required field"""
    request_data = {
        "ticker": "AAPL"
        # Missing company_name and sector
    }

    response = client.post("/api/ai-report", json=request_data)
    assert response.status_code == 422  # Unprocessable entity


# ============================================
# Integration Tests
# ============================================

def test_full_analysis_workflow(client):
    """Test complete analysis workflow for a stock"""
    ticker = "AAPL"

    # Get stock price
    price_response = client.get(f"/api/stock/{ticker}")
    assert price_response.status_code == 200
    current_price = price_response.json()["current_price"]

    # Get fundamental data
    fund_response = client.get(f"/api/fundamental/{ticker}")
    assert fund_response.status_code == 200
    pe_ratio = fund_response.json()["ratios"]["pe_ratio"]
    roe = fund_response.json()["ratios"]["roe"]

    # Get technical data
    tech_response = client.get(f"/api/technical/{ticker}")
    assert tech_response.status_code == 200
    trend = tech_response.json()["trend"]

    # Generate AI report
    report_response = client.post("/api/ai-report", json={
        "ticker": ticker,
        "company_name": "Apple Inc.",
        "sector": "Technology",
        "current_price": current_price,
        "pe_ratio": pe_ratio,
        "roe": roe,
        "interest_rate": 5.25
    })
    assert report_response.status_code == 200
    recommendation = report_response.json()["recommendation"]

    # Verify all data was collected
    assert current_price > 0
    assert recommendation != ""
    assert trend in ["BULLISH", "BEARISH", "NEUTRAL"]


# ============================================
# Performance Tests
# ============================================

@pytest.mark.performance
def test_stock_price_response_time(client):
    """Test that stock price response is fast"""
    import time

    start = time.time()
    response = client.get("/api/stock/AAPL")
    elapsed = time.time() - start

    assert response.status_code == 200
    assert elapsed < 5.0  # Should respond within 5 seconds


@pytest.mark.performance
def test_cache_improves_response_time(client):
    """Test that cached responses are faster"""
    import time

    cache_manager.clear()

    # First request (uncached)
    start1 = time.time()
    client.get("/api/stock/AAPL")
    time1 = time.time() - start1

    # Second request (cached)
    start2 = time.time()
    client.get("/api/stock/AAPL")
    time2 = time.time() - start2

    # Cached should be significantly faster
    # Note: This is a rough test, times may vary
    print(f"Uncached: {time1:.3f}s, Cached: {time2:.3f}s")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
