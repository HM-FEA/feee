"""
Database initialization and session management
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from typing import Generator

from models import Base, DatabaseConfig

# ============================================
# Database Setup
# ============================================

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DATABASE_URL = DatabaseConfig.get_database_url(ENVIRONMENT)

print(f"📊 Using {ENVIRONMENT.upper()} database: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else 'SQLite'}")

if "postgresql" in DATABASE_URL:
    # PostgreSQL setup
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,  # Verify connections before use
        pool_size=20,
        max_overflow=40
    )
else:
    # SQLite setup (development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # Use single connection for SQLite
        echo=False
    )

    # Enable foreign keys for SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# Create all tables
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ============================================
# Dependency Injection
# ============================================

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================
# Database utilities
# ============================================

class DatabaseUtils:
    """Utility functions for database operations"""

    @staticmethod
    def init_db():
        """Initialize database with sample data"""
        from models import Stock, MacroEnvironment
        from datetime import datetime

        db = SessionLocal()
        try:
            # Check if stocks already exist
            existing = db.query(Stock).first()
            if existing:
                print("✅ Database already initialized")
                return

            # Sample stocks for Nexus-Alpha
            sample_stocks = [
                # Banking
                ("000060", "KB Financial", "Financial Services", "South Korea", 20000000000),
                ("055550", "Shinhan Financial", "Financial Services", "South Korea", 18000000000),
                ("105560", "KB Financial Group", "Financial Services", "South Korea", 15000000000),

                # Real Estate
                ("034820", "Kangwon Land", "Real Estate", "South Korea", 5000000000),
                ("000670", "LS Cable", "Construction & Real Estate", "South Korea", 4000000000),

                # Semiconductors
                ("000150", "Doosan Heavy Industries", "Semiconductors", "South Korea", 3000000000),
                ("005380", "Hyundai Motor", "Automotive", "South Korea", 25000000000),

                # US Tech (Sample)
                ("AAPL", "Apple", "Technology", "United States", 2500000000000),
                ("MSFT", "Microsoft", "Technology", "United States", 2300000000000),
                ("NVDA", "NVIDIA", "Semiconductors", "United States", 1200000000000),
            ]

            for ticker, name, sector, country, market_cap in sample_stocks:
                stock = Stock(
                    ticker=ticker,
                    company_name=name,
                    sector=sector,
                    country=country,
                    market_cap=market_cap
                )
                db.add(stock)

            # Sample macro environment
            macro = MacroEnvironment(
                date=datetime.utcnow(),
                us_fed_rate=5.25,
                korea_base_rate=3.25,
                usd_krw=1250.5,
                us_unemployment=3.8,
                us_inflation=3.4
            )
            db.add(macro)

            db.commit()
            print("✅ Database initialized with sample data")

        except Exception as e:
            db.rollback()
            print(f"⚠️  Error initializing database: {str(e)}")
        finally:
            db.close()

    @staticmethod
    def reset_db():
        """Drop all tables and recreate (use with caution!)"""
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("⚠️  Database reset completed")
