"""
Advanced Features Module
포트폴리오, 알림, 뉴스, 비교, 예측, 감정 분석, 실시간 차트, 백테스팅
"""

from typing import Optional, Dict, List
from pydantic import BaseModel
from datetime import datetime, timedelta
import yfinance as yf
import json

# ============================================
# 1. Portfolio Management (포트폴리오 추적)
# ============================================

class Position(BaseModel):
    ticker: str
    quantity: float
    average_cost: float
    entry_date: str

class Portfolio(BaseModel):
    user_id: Optional[str] = None
    positions: List[Position]
    total_value: float
    total_cost: float
    total_gain_loss: float
    total_gain_loss_percent: float
    last_updated: str

class PortfolioManager:
    def __init__(self):
        self.portfolios: Dict[str, List[Position]] = {}

    def add_position(self, user_id: str, position: Position):
        """Add position to portfolio"""
        if user_id not in self.portfolios:
            self.portfolios[user_id] = []
        self.portfolios[user_id].append(position)

    def remove_position(self, user_id: str, ticker: str):
        """Remove position from portfolio"""
        if user_id in self.portfolios:
            self.portfolios[user_id] = [p for p in self.portfolios[user_id] if p.ticker != ticker]

    def get_portfolio_value(self, user_id: str) -> Portfolio:
        """Calculate portfolio value and performance"""
        if user_id not in self.portfolios:
            return Portfolio(
                positions=[],
                total_value=0,
                total_cost=0,
                total_gain_loss=0,
                total_gain_loss_percent=0,
                last_updated=datetime.now().isoformat()
            )

        positions = self.portfolios[user_id]
        total_cost = 0
        total_value = 0

        for pos in positions:
            try:
                stock = yf.Ticker(pos.ticker)
                current_price = stock.info.get('currentPrice', 0)
                pos_cost = pos.quantity * pos.average_cost
                pos_value = pos.quantity * current_price
                total_cost += pos_cost
                total_value += pos_value
            except:
                total_cost += pos.quantity * pos.average_cost

        total_gain_loss = total_value - total_cost
        total_gain_loss_percent = (total_gain_loss / total_cost * 100) if total_cost > 0 else 0

        return Portfolio(
            user_id=user_id,
            positions=positions,
            total_value=total_value,
            total_cost=total_cost,
            total_gain_loss=total_gain_loss,
            total_gain_loss_percent=total_gain_loss_percent,
            last_updated=datetime.now().isoformat()
        )


# ============================================
# 2. Price Alerts (가격 알림)
# ============================================

class PriceAlert(BaseModel):
    ticker: str
    target_price: float
    alert_type: str  # "above" or "below"
    is_active: bool = True
    created_at: str

class AlertManager:
    def __init__(self):
        self.alerts: Dict[str, List[PriceAlert]] = {}

    def create_alert(self, user_id: str, alert: PriceAlert):
        """Create price alert"""
        if user_id not in self.alerts:
            self.alerts[user_id] = []
        alert.created_at = datetime.now().isoformat()
        self.alerts[user_id].append(alert)

    def check_alerts(self, user_id: str) -> List[Dict]:
        """Check which alerts have been triggered"""
        if user_id not in self.alerts:
            return []

        triggered = []
        for alert in self.alerts[user_id]:
            if not alert.is_active:
                continue

            try:
                stock = yf.Ticker(alert.ticker)
                current_price = stock.info.get('currentPrice', 0)

                is_triggered = False
                if alert.alert_type == "above" and current_price >= alert.target_price:
                    is_triggered = True
                elif alert.alert_type == "below" and current_price <= alert.target_price:
                    is_triggered = True

                if is_triggered:
                    triggered.append({
                        "ticker": alert.ticker,
                        "target_price": alert.target_price,
                        "current_price": current_price,
                        "alert_type": alert.alert_type,
                        "triggered_at": datetime.now().isoformat()
                    })
                    alert.is_active = False  # Deactivate after trigger

            except Exception as e:
                print(f"Error checking alert for {alert.ticker}: {str(e)}")

        return triggered


# ============================================
# 3. Stock Comparison (주식 비교 분석)
# ============================================

class StockComparison(BaseModel):
    ticker1: str
    ticker2: str
    company1_name: str
    company2_name: str
    price_ratio: float
    pe_ratio_comparison: Dict[str, Optional[float]]
    market_cap_comparison: Dict[str, Optional[float]]
    dividend_yield_comparison: Dict[str, Optional[float]]
    recommendation: str

def compare_stocks(ticker1: str, ticker2: str) -> StockComparison:
    """Compare two stocks"""
    try:
        stock1 = yf.Ticker(ticker1)
        stock2 = yf.Ticker(ticker2)

        info1 = stock1.info
        info2 = stock2.info

        price1 = info1.get('currentPrice', 0)
        price2 = info2.get('currentPrice', 0)

        price_ratio = price1 / price2 if price2 > 0 else 0

        pe1 = info1.get('trailingPE')
        pe2 = info2.get('trailingPE')

        mc1 = info1.get('marketCap')
        mc2 = info2.get('marketCap')

        div1 = info1.get('dividendYield')
        div2 = info2.get('dividendYield')

        # Simple recommendation logic
        better_value = ticker1 if (pe1 and pe2 and pe1 < pe2) else ticker2
        recommendation = f"{better_value} offers better valuation (Lower P/E)"

        return StockComparison(
            ticker1=ticker1,
            ticker2=ticker2,
            company1_name=info1.get('longName', ticker1),
            company2_name=info2.get('longName', ticker2),
            price_ratio=price_ratio,
            pe_ratio_comparison={"ticker1": pe1, "ticker2": pe2},
            market_cap_comparison={"ticker1": mc1, "ticker2": mc2},
            dividend_yield_comparison={"ticker1": div1, "ticker2": div2},
            recommendation=recommendation
        )
    except Exception as e:
        raise ValueError(f"Error comparing stocks: {str(e)}")


# ============================================
# 4. Sentiment Analysis (감정 분석)
# ============================================

class SentimentAnalysis(BaseModel):
    ticker: str
    overall_sentiment: str  # positive, neutral, negative
    sentiment_score: float  # -1.0 to 1.0
    bullish_count: int
    bearish_count: int
    neutral_count: int
    key_drivers: List[str]
    recommendation: str

def analyze_sentiment(ticker: str) -> SentimentAnalysis:
    """
    Analyze sentiment from news and social media indicators
    This is a simplified version - in production, integrate with APIs like
    NewsAPI, Twitter API, or sentiment analysis ML models
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.info

        # Get technical indicators for sentiment
        hist = stock.history(period="1mo")
        if not hist.empty:
            close = hist['Close']
            # Simple momentum-based sentiment
            change_percent = ((close.iloc[-1] - close.iloc[0]) / close.iloc[0] * 100)

            if change_percent > 5:
                sentiment = "positive"
                score = min(change_percent / 100, 1.0)
                bullish_count = 7
                bearish_count = 2
            elif change_percent < -5:
                sentiment = "negative"
                score = max(change_percent / 100, -1.0)
                bullish_count = 2
                bearish_count = 7
            else:
                sentiment = "neutral"
                score = 0.0
                bullish_count = 4
                bearish_count = 4
        else:
            sentiment = "neutral"
            score = 0.0
            bullish_count = 5
            bearish_count = 5

        drivers = []
        pe = info.get('trailingPE')
        if pe and pe < 15:
            drivers.append("Undervalued P/E ratio")
        if pe and pe > 30:
            drivers.append("Overvalued P/E ratio")

        if info.get('dividendYield'):
            drivers.append("Strong dividend yield")

        recommendation = f"Market sentiment is {sentiment} - {'BUY' if sentiment == 'positive' else 'SELL' if sentiment == 'negative' else 'HOLD'}"

        return SentimentAnalysis(
            ticker=ticker,
            overall_sentiment=sentiment,
            sentiment_score=score,
            bullish_count=bullish_count,
            bearish_count=bearish_count,
            neutral_count=10 - bullish_count - bearish_count,
            key_drivers=drivers if drivers else ["Neutral market conditions"],
            recommendation=recommendation
        )

    except Exception as e:
        raise ValueError(f"Error analyzing sentiment: {str(e)}")


# ============================================
# 5. Price Prediction (가격 예측)
# ============================================

class PricePrediction(BaseModel):
    ticker: str
    current_price: float
    predicted_price_1month: float
    predicted_price_3month: float
    predicted_price_12month: float
    confidence: float
    methodology: str
    risks: List[str]

def predict_stock_price(ticker: str) -> PricePrediction:
    """
    Simple price prediction using trend analysis
    In production, use ML models like ARIMA, LSTM, or XGBoost
    """
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")

        if hist.empty:
            raise ValueError(f"No data available for {ticker}")

        # Calculate trend using simple linear regression
        prices = hist['Close'].values
        current_price = float(prices[-1])

        # Simple trend calculation (change over last 3 months)
        if len(prices) >= 60:
            three_month_change = (prices[-1] - prices[-60]) / prices[-60]
            one_year_change = (prices[-1] - prices[0]) / prices[0]
        else:
            three_month_change = 0
            one_year_change = 0

        # Conservative projections
        pred_1month = current_price * (1 + three_month_change / 4)  # 1/4 of 3-month trend
        pred_3month = current_price * (1 + three_month_change)
        pred_12month = current_price * (1 + one_year_change * 1.5)  # Slightly amplified

        # Confidence based on price stability
        volatility = hist['Close'].pct_change().std()
        confidence = max(0.5, 1 - volatility)  # Higher volatility = lower confidence

        return PricePrediction(
            ticker=ticker,
            current_price=current_price,
            predicted_price_1month=pred_1month,
            predicted_price_3month=pred_3month,
            predicted_price_12month=pred_12month,
            confidence=confidence,
            methodology="Trend Analysis + Historical Performance",
            risks=[
                "Market volatility",
                "Economic changes",
                "Company-specific events",
                "Geopolitical factors"
            ]
        )

    except Exception as e:
        raise ValueError(f"Error predicting price: {str(e)}")


# ============================================
# 6. Real-time Chart Data (실시간 차트)
# ============================================

class ChartData(BaseModel):
    ticker: str
    interval: str  # 1m, 5m, 1h, 1d, 1wk, 1mo
    timestamps: List[str]
    opens: List[float]
    highs: List[float]
    lows: List[float]
    closes: List[float]
    volumes: List[int]

def get_chart_data(ticker: str, interval: str = "1d", period: str = "3mo") -> ChartData:
    """Get chart data for real-time visualization"""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)

        if hist.empty:
            raise ValueError(f"No data available for {ticker}")

        return ChartData(
            ticker=ticker,
            interval=interval,
            timestamps=[str(ts) for ts in hist.index],
            opens=hist['Open'].tolist(),
            highs=hist['High'].tolist(),
            lows=hist['Low'].tolist(),
            closes=hist['Close'].tolist(),
            volumes=hist['Volume'].tolist()
        )

    except Exception as e:
        raise ValueError(f"Error fetching chart data: {str(e)}")


# ============================================
# 7. Backtesting Engine (백테스팅)
# ============================================

class BacktestResult(BaseModel):
    ticker: str
    strategy: str
    start_date: str
    end_date: str
    initial_capital: float
    final_value: float
    total_return: float
    total_return_percent: float
    annual_return: float
    max_drawdown: float
    sharpe_ratio: float
    num_trades: int
    winning_trades: int
    losing_trades: int
    win_rate: float

def backtest_simple_ma_strategy(ticker: str, initial_capital: float = 10000, fast_period: int = 20, slow_period: int = 50) -> BacktestResult:
    """
    Simple Moving Average Crossover Strategy Backtest
    Buy when fast MA crosses above slow MA
    Sell when fast MA crosses below slow MA
    """
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="2y")

        if hist.empty or len(hist) < max(fast_period, slow_period):
            raise ValueError(f"Insufficient data for {ticker}")

        # Calculate moving averages
        hist['fast_ma'] = hist['Close'].rolling(window=fast_period).mean()
        hist['slow_ma'] = hist['Close'].rolling(window=slow_period).mean()

        # Generate signals
        hist['signal'] = 0
        hist.loc[hist['fast_ma'] > hist['slow_ma'], 'signal'] = 1
        hist.loc[hist['fast_ma'] < hist['slow_ma'], 'signal'] = -1

        # Identify crossovers
        hist['position'] = hist['signal'].diff()

        # Backtest
        capital = initial_capital
        position_size = 0
        entry_price = 0
        num_trades = 0
        winning_trades = 0
        losing_trades = 0
        max_value = initial_capital
        peak_capital = initial_capital

        for idx, row in hist.iterrows():
            if row['position'] == 1:  # Buy signal
                position_size = capital / row['Close']
                entry_price = row['Close']
                num_trades += 1
            elif row['position'] == -1 and position_size > 0:  # Sell signal
                capital = position_size * row['Close']
                if capital > entry_price * position_size:
                    winning_trades += 1
                else:
                    losing_trades += 1
                position_size = 0

            # Update max drawdown tracking
            if position_size > 0:
                current_value = position_size * row['Close']
            else:
                current_value = capital

            if current_value > peak_capital:
                peak_capital = current_value
                max_value = current_value

        # Close final position
        if position_size > 0:
            final_value = position_size * hist['Close'].iloc[-1]
        else:
            final_value = capital

        total_return = final_value - initial_capital
        total_return_percent = (total_return / initial_capital) * 100

        days = len(hist)
        years = days / 365
        annual_return = (total_return_percent / years) if years > 0 else 0

        # Simple max drawdown calculation
        max_drawdown = ((peak_capital - max_value) / peak_capital * 100) if peak_capital > 0 else 0

        # Simple sharpe ratio (not fully accurate without risk-free rate adjustment)
        returns = hist['Close'].pct_change().dropna()
        sharpe_ratio = returns.mean() / returns.std() * (252 ** 0.5) if returns.std() > 0 else 0

        win_rate = (winning_trades / num_trades * 100) if num_trades > 0 else 0

        return BacktestResult(
            ticker=ticker,
            strategy=f"Simple MA Crossover ({fast_period}/{slow_period})",
            start_date=str(hist.index[0]),
            end_date=str(hist.index[-1]),
            initial_capital=initial_capital,
            final_value=final_value,
            total_return=total_return,
            total_return_percent=total_return_percent,
            annual_return=annual_return,
            max_drawdown=max_drawdown,
            sharpe_ratio=sharpe_ratio,
            num_trades=num_trades,
            winning_trades=winning_trades,
            losing_trades=losing_trades,
            win_rate=win_rate
        )

    except Exception as e:
        raise ValueError(f"Error running backtest: {str(e)}")


# ============================================
# Global Manager Instances
# ============================================

portfolio_manager = PortfolioManager()
alert_manager = AlertManager()
