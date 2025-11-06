"""
Extended API Endpoints for Advanced Features
포트폴리오, 알림, 비교, 예측, 감정, 차트, 백테스팅
"""

from fastapi import FastAPI, HTTPException
from features import (
    portfolio_manager, alert_manager,
    Position, Portfolio, PriceAlert,
    StockComparison, SentimentAnalysis, PricePrediction,
    ChartData, BacktestResult,
    compare_stocks, analyze_sentiment, predict_stock_price,
    get_chart_data, backtest_simple_ma_strategy
)

def setup_extended_endpoints(app: FastAPI):
    """Setup all extended endpoints"""

    # ============================================
    # 1. Portfolio Management (포트폴리오)
    # ============================================

    @app.get("/api/portfolio/{user_id}", response_model=Portfolio)
    async def get_portfolio(user_id: str):
        """Get user portfolio with current values"""
        try:
            portfolio = portfolio_manager.get_portfolio_value(user_id)
            return portfolio
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.post("/api/portfolio/{user_id}/add")
    async def add_position(user_id: str, position: Position):
        """Add position to portfolio"""
        try:
            portfolio_manager.add_position(user_id, position)
            return {
                "status": "success",
                "message": f"Position added: {position.quantity} shares of {position.ticker}",
                "position": position
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.delete("/api/portfolio/{user_id}/{ticker}")
    async def remove_position(user_id: str, ticker: str):
        """Remove position from portfolio"""
        try:
            portfolio_manager.remove_position(user_id, ticker)
            return {
                "status": "success",
                "message": f"Position removed: {ticker}"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 2. Price Alerts (가격 알림)
    # ============================================

    @app.post("/api/alerts/{user_id}")
    async def create_alert(user_id: str, alert: PriceAlert):
        """Create price alert for a stock"""
        try:
            alert_manager.create_alert(user_id, alert)
            return {
                "status": "success",
                "message": f"Alert created: {alert.ticker} {alert.alert_type} ${alert.target_price}",
                "alert": alert
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @app.get("/api/alerts/{user_id}/check")
    async def check_alerts(user_id: str):
        """Check triggered alerts"""
        try:
            triggered = alert_manager.check_alerts(user_id)
            return {
                "triggered_count": len(triggered),
                "alerts": triggered
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 3. Stock Comparison (주식 비교)
    # ============================================

    @app.get("/api/compare/{ticker1}/{ticker2}", response_model=StockComparison)
    async def compare_two_stocks(ticker1: str, ticker2: str):
        """Compare two stocks"""
        try:
            result = compare_stocks(ticker1, ticker2)
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 4. Sentiment Analysis (감정 분석)
    # ============================================

    @app.get("/api/sentiment/{ticker}", response_model=SentimentAnalysis)
    async def get_sentiment(ticker: str):
        """Get market sentiment analysis for a stock"""
        try:
            sentiment = analyze_sentiment(ticker)
            return sentiment
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 5. Price Prediction (가격 예측)
    # ============================================

    @app.get("/api/predict/{ticker}", response_model=PricePrediction)
    async def predict_price(ticker: str):
        """Get price prediction for a stock"""
        try:
            prediction = predict_stock_price(ticker)
            return prediction
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 6. Real-time Chart Data (실시간 차트)
    # ============================================

    @app.get("/api/chart/{ticker}", response_model=ChartData)
    async def get_chart(ticker: str, interval: str = "1d", period: str = "3mo"):
        """Get chart data for visualization"""
        try:
            chart = get_chart_data(ticker, interval, period)
            return chart
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # 7. Backtesting (백테스팅)
    # ============================================

    @app.get("/api/backtest/{ticker}", response_model=BacktestResult)
    async def backtest_strategy(
        ticker: str,
        initial_capital: float = 10000,
        fast_period: int = 20,
        slow_period: int = 50
    ):
        """Run backtesting on moving average strategy"""
        try:
            result = backtest_simple_ma_strategy(
                ticker,
                initial_capital,
                fast_period,
                slow_period
            )
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # News Integration (뉴스 통합)
    # ============================================

    @app.get("/api/news-summary/{ticker}")
    async def get_news_summary(ticker: str):
        """Get news summary and analysis"""
        try:
            import yfinance as yf
            stock = yf.Ticker(ticker)
            news = stock.news

            summary = {
                "ticker": ticker.upper(),
                "total_news": len(news),
                "latest_news": news[:5] if news else [],
                "sentiment_indicators": {
                    "bullish_keywords": ["upgrade", "strong", "beat", "growth"],
                    "bearish_keywords": ["downgrade", "weak", "miss", "decline"]
                },
                "last_updated": __import__('datetime').datetime.now().isoformat()
            }

            return summary

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # Analytics Dashboard (종합 분석 대시보드)
    # ============================================

    @app.get("/api/analytics/{ticker}")
    async def get_analytics_summary(ticker: str):
        """Get comprehensive analytics summary for a stock"""
        try:
            import yfinance as yf

            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period="1y")

            # Calculate metrics
            pe_ratio = info.get('trailingPE')
            pb_ratio = info.get('priceToBook')
            dividend_yield = info.get('dividendYield')
            market_cap = info.get('marketCap')

            # Calculate 52-week range
            high_52w = hist['High'].max() if not hist.empty else 0
            low_52w = hist['Low'].min() if not hist.empty else 0
            current_price = info.get('currentPrice', 0)

            return {
                "ticker": ticker.upper(),
                "company": info.get('longName', ticker),
                "sector": info.get('sector', 'N/A'),
                "industry": info.get('industry', 'N/A'),
                "valuation": {
                    "pe_ratio": pe_ratio,
                    "pb_ratio": pb_ratio,
                    "market_cap": market_cap,
                    "dividend_yield": dividend_yield
                },
                "performance": {
                    "current_price": current_price,
                    "52_week_high": high_52w,
                    "52_week_low": low_52w,
                    "52_week_range": f"${low_52w:.2f} - ${high_52w:.2f}"
                },
                "fundamentals": {
                    "revenue": info.get('totalRevenue'),
                    "net_income": info.get('netIncomeToCommon'),
                    "roe": info.get('returnOnEquity'),
                    "roa": info.get('returnOnAssets')
                },
                "last_updated": __import__('datetime').datetime.now().isoformat()
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # ============================================
    # Features Status
    # ============================================

    @app.get("/api/features/status")
    async def get_features_status():
        """Get status of all advanced features"""
        return {
            "features": {
                "portfolio_tracking": {"enabled": True, "version": "1.0"},
                "price_alerts": {"enabled": True, "version": "1.0"},
                "stock_comparison": {"enabled": True, "version": "1.0"},
                "sentiment_analysis": {"enabled": True, "version": "1.0"},
                "price_prediction": {"enabled": True, "version": "1.0"},
                "realtime_charts": {"enabled": True, "version": "1.0"},
                "backtesting": {"enabled": True, "version": "1.0"},
                "news_integration": {"enabled": True, "version": "1.0"},
                "analytics_dashboard": {"enabled": True, "version": "1.0"}
            },
            "total_features": 9,
            "version": "2.0.0"
        }
