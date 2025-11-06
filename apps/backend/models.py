"""
Database Models for Nexus-Alpha
Supports SQLAlchemy ORM for PostgreSQL/SQLite
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Optional

Base = declarative_base()

# ============================================
# Core Models
# ============================================

class Stock(Base):
    """Stock master data"""
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String(10), unique=True, index=True, nullable=False)
    company_name = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=True)
    country = Column(String(50), nullable=True)
    market_cap = Column(Float, nullable=True)
    description = Column(String, nullable=True)

    # Relationships
    price_history = relationship("StockPrice", back_populates="stock", cascade="all, delete-orphan")
    fundamental_data = relationship("FundamentalData", back_populates="stock", cascade="all, delete-orphan")
    technical_data = relationship("TechnicalData", back_populates="stock", cascade="all, delete-orphan")
    ai_reports = relationship("AIReport", back_populates="stock", cascade="all, delete-orphan")
    trading_signals = relationship("TradingSignal", back_populates="stock", cascade="all, delete-orphan")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_ticker_sector", "ticker", "sector"),
    )


class StockPrice(Base):
    """Daily stock price data"""
    __tablename__ = "stock_prices"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False)

    open_price = Column(Float, nullable=True)
    high_price = Column(Float, nullable=True)
    low_price = Column(Float, nullable=True)
    close_price = Column(Float, nullable=False)
    volume = Column(Integer, nullable=True)
    adjusted_close = Column(Float, nullable=True)

    # Price changes
    price_change_1d = Column(Float, nullable=True)
    price_change_1w = Column(Float, nullable=True)
    price_change_1m = Column(Float, nullable=True)

    # Relationships
    stock = relationship("Stock", back_populates="price_history")

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_stock_date", "stock_id", "date"),
        Index("idx_date", "date"),
    )


class FundamentalData(Base):
    """Fundamental analysis data"""
    __tablename__ = "fundamental_data"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False)

    # Financial Ratios
    pe_ratio = Column(Float, nullable=True)
    pb_ratio = Column(Float, nullable=True)
    roe = Column(Float, nullable=True)
    roa = Column(Float, nullable=True)
    debt_to_equity = Column(Float, nullable=True)
    current_ratio = Column(Float, nullable=True)
    quick_ratio = Column(Float, nullable=True)
    interest_coverage = Column(Float, nullable=True)

    # Financial Statements
    revenue = Column(Float, nullable=True)
    net_income = Column(Float, nullable=True)
    operating_income = Column(Float, nullable=True)
    total_assets = Column(Float, nullable=True)
    total_liabilities = Column(Float, nullable=True)
    shareholders_equity = Column(Float, nullable=True)
    free_cash_flow = Column(Float, nullable=True)

    # Growth metrics
    revenue_growth_yoy = Column(Float, nullable=True)
    earnings_growth_yoy = Column(Float, nullable=True)
    dividend_yield = Column(Float, nullable=True)

    # Relationships
    stock = relationship("Stock", back_populates="fundamental_data")

    created_at = Column(DateTime, default=datetime.utcnow)
    source = Column(String(50), default="yfinance")

    __table_args__ = (
        Index("idx_stock_fundamental_date", "stock_id", "date"),
    )


class TechnicalData(Base):
    """Technical analysis indicators"""
    __tablename__ = "technical_data"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False)

    # Momentum indicators
    rsi_14 = Column(Float, nullable=True)
    macd = Column(Float, nullable=True)
    macd_signal = Column(Float, nullable=True)
    macd_histogram = Column(Float, nullable=True)

    # Moving Averages
    sma_20 = Column(Float, nullable=True)
    sma_50 = Column(Float, nullable=True)
    sma_200 = Column(Float, nullable=True)
    ema_12 = Column(Float, nullable=True)
    ema_26 = Column(Float, nullable=True)

    # Volatility
    bollinger_upper = Column(Float, nullable=True)
    bollinger_middle = Column(Float, nullable=True)
    bollinger_lower = Column(Float, nullable=True)
    atr_14 = Column(Float, nullable=True)

    # Volume indicators
    obv = Column(Float, nullable=True)
    ad_line = Column(Float, nullable=True)

    # Trend
    trend = Column(String(20), nullable=True)  # BULLISH, NEUTRAL, BEARISH
    strength = Column(Float, nullable=True)  # 0.0 - 1.0

    # Relationships
    stock = relationship("Stock", back_populates="technical_data")

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_stock_technical_date", "stock_id", "date"),
    )


class AIReport(Base):
    """AI-generated investment reports"""
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    summary = Column(String, nullable=True)
    sentiment = Column(String(20), nullable=True)  # bullish, neutral, bearish
    confidence = Column(Float, nullable=True)

    # Report details
    key_points = Column(JSON, nullable=True)  # List of key insights
    macro_impact_analysis = Column(JSON, nullable=True)  # Dict of macro impacts
    recommendation = Column(String(255), nullable=True)

    # Macro context
    interest_rate = Column(Float, nullable=True)
    tariff_rate = Column(Float, nullable=True)
    fx_rate = Column(Float, nullable=True)

    # Report metadata
    model_used = Column(String(50), nullable=True)  # gpt-4o-mini, o1-preview, etc
    report_type = Column(String(50), nullable=True)  # ai, trading_agents, hybrid

    # Relationships
    stock = relationship("Stock", back_populates="ai_reports")

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("idx_stock_report_date", "stock_id", "created_at"),
        Index("idx_sentiment", "sentiment"),
    )


class TradingSignal(Base):
    """Trading signals from various analysis methods"""
    __tablename__ = "trading_signals"

    id = Column(Integer, primary_key=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False, index=True)

    signal_type = Column(String(50), nullable=False)  # technical, fundamental, ai, consensus
    action = Column(String(20), nullable=False)  # BUY, SELL, HOLD
    confidence = Column(Float, nullable=False)  # 0.0 - 1.0

    reason = Column(String, nullable=True)
    price_target = Column(Float, nullable=True)
    stop_loss = Column(Float, nullable=True)

    # Signal validity
    is_active = Column(Boolean, default=True)
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)

    # Relationships
    stock = relationship("Stock", back_populates="trading_signals")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_stock_active_signal", "stock_id", "is_active"),
    )


class MacroEnvironment(Base):
    """Global macro environment data"""
    __tablename__ = "macro_environment"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, unique=True, index=True)

    # Interest rates
    us_fed_rate = Column(Float, nullable=True)
    us_10y_yield = Column(Float, nullable=True)
    korea_base_rate = Column(Float, nullable=True)

    # Currency rates
    usd_krw = Column(Float, nullable=True)
    usd_jpy = Column(Float, nullable=True)
    usd_eur = Column(Float, nullable=True)

    # Commodity prices
    oil_wti = Column(Float, nullable=True)
    gold_price = Column(Float, nullable=True)
    copper_price = Column(Float, nullable=True)

    # Market indices
    sp500_close = Column(Float, nullable=True)
    nasdaq_close = Column(Float, nullable=True)
    kospi_close = Column(Float, nullable=True)
    nikkei_close = Column(Float, nullable=True)

    # Trade/Tariffs
    us_tariff_rate = Column(Float, nullable=True)
    china_tariff_rate = Column(Float, nullable=True)
    us_unemployment = Column(Float, nullable=True)
    us_inflation = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class PortfolioData(Base):
    """Portfolio and position tracking (optional)"""
    __tablename__ = "portfolio_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=True, index=True)
    stock_id = Column(Integer, ForeignKey("stocks.id"), nullable=False)

    quantity = Column(Float, nullable=False)
    average_cost = Column(Float, nullable=False)
    current_value = Column(Float, nullable=True)
    unrealized_gain_loss = Column(Float, nullable=True)

    # Position details
    entry_date = Column(DateTime, nullable=False)
    exit_date = Column(DateTime, nullable=True)
    is_closed = Column(Boolean, default=False)

    # Notes
    notes = Column(String, nullable=True)

    # Relationships
    stock = relationship("Stock")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        Index("idx_user_portfolio", "user_id", "is_closed"),
    )


class AnalysisCache(Base):
    """Cache for expensive API calls to avoid rate limiting"""
    __tablename__ = "analysis_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, index=True, nullable=False)

    ticker = Column(String(10), nullable=True, index=True)
    analysis_type = Column(String(50), nullable=True)  # fundamental, technical, ai, etc

    data = Column(JSON, nullable=False)
    ttl = Column(Integer, nullable=True)  # Time to live in seconds

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    expires_at = Column(DateTime, nullable=True, index=True)

    __table_args__ = (
        Index("idx_ticker_analysis_type", "ticker", "analysis_type"),
    )


# ============================================
# Database Configuration
# ============================================

class DatabaseConfig:
    """Database configuration"""

    # SQLite for development
    SQLITE_URL = "sqlite:///./nexus_alpha.db"

    # PostgreSQL for production
    # Update with your database credentials
    POSTGRES_URL = "postgresql://user:password@localhost/nexus_alpha"

    @staticmethod
    def get_database_url(environment: str = "development") -> str:
        if environment == "production":
            return DatabaseConfig.POSTGRES_URL
        return DatabaseConfig.SQLITE_URL


# ============================================
# Schema info for API documentation
# ============================================

DATABASE_SCHEMA_INFO = """
Nexus-Alpha Database Schema:

Tables:
1. stocks - Master stock data (23 companies)
2. stock_prices - Daily OHLCV data
3. fundamental_data - Financial ratios & statements
4. technical_data - Technical indicators (RSI, MACD, Bollinger, MA)
5. ai_reports - AI-generated investment reports
6. trading_signals - Buy/Sell/Hold signals
7. macro_environment - Global macro economic data
8. portfolio_data - User positions (optional)
9. analysis_cache - Cache for API calls

Indexes optimize:
- Stock lookup by ticker
- Time-series queries (stock_id + date)
- Signal filtering by stock & type
"""
