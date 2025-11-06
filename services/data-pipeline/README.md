# 📊 Nexus-Alpha Data Pipeline

**Technology:** Python 3.11+ (Apache Airflow)
**Team:** Team Data (Data Engineering)
**Port:** 8081 (Airflow Webserver)

---

## 📖 Overview

The Data Pipeline service is responsible for all external data ingestion, transformation, and loading. It provides:

- 🔄 **ETL/ELT Jobs**: Scheduled data collection from external APIs
- 🌊 **Real-Time Streaming**: Kafka producers/consumers for live data
- 🧹 **Data Cleaning**: Normalization, deduplication, quality checks
- 📈 **Data Sources**:
  - **Macro**: FRED, World Bank, IMF, BIS
  - **Micro**: X (Twitter) API, Reddit API, SEC EDGAR
  - **Crypto**: Glassnode, CoinGecko, Etherscan
- 🗄️ **Data Storage**: ClickHouse (time-series), PostgreSQL (metadata)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Apache Airflow 2.7+
- Apache Kafka 3.5+
- ClickHouse 23+
- Redis 7+
- PostgreSQL 15+

### Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize Airflow database
export AIRFLOW_HOME=$(pwd)
airflow db init

# Create admin user
airflow users create \
    --username admin \
    --password admin \
    --firstname Admin \
    --lastname User \
    --role Admin \
    --email admin@nexus-alpha.com

# Copy environment file
cp .env.example .env

# Edit .env with API keys
# FRED_API_KEY=your-key-here
# TWITTER_BEARER_TOKEN=your-token-here
# GLASSNODE_API_KEY=your-key-here
```

### Development
```bash
# Start Airflow webserver
airflow webserver --port 8081

# Start Airflow scheduler (in another terminal)
airflow scheduler

# Access web UI: http://localhost:8081
# Username: admin, Password: admin

# Test a DAG
airflow dags test fred_daily_indicators 2025-10-31

# List all DAGs
airflow dags list

# Trigger a DAG manually
airflow dags trigger fred_daily_indicators
```

---

## 📁 Project Structure

```
services/data-pipeline/
├── dags/                        # Airflow DAGs
│   ├── macro/
│   │   ├── fred_daily.py        # FRED economic indicators
│   │   ├── treasury_rates.py   # US Treasury rates
│   │   └── global_liquidity.py # M2 money supply
│   ├── micro/
│   │   ├── twitter_influencers.py
│   │   ├── reddit_wsb.py        # WallStreetBets
│   │   └── sec_filings.py       # SEC EDGAR
│   └── crypto/
│       ├── glassnode_onchain.py
│       ├── defi_protocols.py
│       └── whale_tracking.py
├── kafka/
│   ├── producers/
│   │   ├── market_data_producer.py
│   │   └── social_stream_producer.py
│   └── consumers/
│       ├── clickhouse_consumer.py
│       └── redis_consumer.py
├── processors/
│   ├── cleaners/
│   │   ├── text_cleaner.py
│   │   ├── financial_normalizer.py
│   │   └── outlier_detector.py
│   └── transformers/
│       ├── sentiment_enricher.py
│       └── correlation_calculator.py
├── crawlers/
│   ├── twitter_crawler.py
│   ├── reddit_crawler.py
│   └── sec_crawler.py
├── models/                      # Data models
│   ├── macro.py
│   ├── social.py
│   └── crypto.py
├── utils/
│   ├── api_clients.py
│   ├── rate_limiter.py
│   └── retry_handler.py
├── tests/
│   ├── unit/
│   └── integration/
├── scripts/
│   ├── backfill_historical_data.py
│   └── data_quality_report.py
├── docker-compose.yml           # Local dev environment
├── requirements.txt
├── airflow.cfg
└── README.md
```

---

## 🔄 DAG Examples

### FRED Economic Indicators
```python
# dags/macro/fred_daily.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import requests
import os

def fetch_fred_data(**context):
    """Fetch key economic indicators from FRED API"""
    api_key = os.getenv('FRED_API_KEY')
    base_url = 'https://api.stlouisfed.org/fred/series/observations'

    indicators = ['FEDFUNDS', 'DGS10', 'M2', 'UNRATE', 'CPIAUCSL']

    results = []
    for series_id in indicators:
        params = {
            'series_id': series_id,
            'api_key': api_key,
            'file_type': 'json',
            'observation_start': (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
        }

        response = requests.get(base_url, params=params)
        data = response.json()

        for obs in data['observations']:
            if obs['value'] != '.':
                results.append({
                    'indicator': series_id,
                    'date': obs['date'],
                    'value': float(obs['value']),
                    'timestamp': datetime.now(),
                })

    # Save to ClickHouse
    from clickhouse_driver import Client
    client = Client(host='clickhouse', port=9000)
    client.execute(
        'INSERT INTO macro.indicators (indicator, date, value, timestamp) VALUES',
        results
    )

    return len(results)

# DAG definition
default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['alerts@nexus-alpha.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'fred_daily_indicators',
    default_args=default_args,
    description='Fetch daily economic indicators from FRED',
    schedule_interval='0 9 * * *',  # Daily at 9 AM UTC
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['macro', 'fred', 'daily'],
) as dag:

    fetch_task = PythonOperator(
        task_id='fetch_fred_data',
        python_callable=fetch_fred_data,
    )
```

### Twitter Influencer Tracking
```python
# dags/micro/twitter_influencers.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from crawlers.twitter_crawler import TwitterInfluencerCrawler
import json

def crawl_influencers(**context):
    """Crawl tweets from financial influencers"""
    crawler = TwitterInfluencerCrawler()

    influencers = [
        'elonmusk',
        'chamath',
        'michael_saylor',
        'cathiedwood',
        'zerohedge',
    ]

    all_tweets = []
    for username in influencers:
        tweets = crawler.get_influencer_tweets(username, hours=1)
        all_tweets.extend(tweets)

    # Send to Kafka for real-time processing
    from kafka import KafkaProducer
    producer = KafkaProducer(bootstrap_servers='kafka:9092')

    for tweet in all_tweets:
        producer.send('social.twitter', value=json.dumps(tweet).encode())

    producer.flush()
    return len(all_tweets)

default_args = {
    'owner': 'data-team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'twitter_influencers',
    default_args=default_args,
    description='Track tweets from financial influencers',
    schedule_interval='*/15 * * * *',  # Every 15 minutes
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['micro', 'twitter', 'influencers'],
) as dag:

    crawl_task = PythonOperator(
        task_id='crawl_influencers',
        python_callable=crawl_influencers,
    )
```

---

## 🌊 Kafka Streaming

### Market Data Producer
```python
# kafka/producers/market_data_producer.py
from kafka import KafkaProducer
import yfinance as yf
import json
import time
from typing import List

class MarketDataProducer:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers='kafka:9092',
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        )

    def stream_stock_prices(self, tickers: List[str]):
        """Stream real-time stock prices to Kafka"""
        while True:
            for ticker in tickers:
                try:
                    stock = yf.Ticker(ticker)
                    info = stock.info

                    message = {
                        'ticker': ticker,
                        'price': info.get('currentPrice'),
                        'volume': info.get('volume'),
                        'market_cap': info.get('marketCap'),
                        'timestamp': datetime.now().isoformat(),
                    }

                    self.producer.send('market.stocks', value=message)

                except Exception as e:
                    print(f"Error fetching {ticker}: {e}")

            time.sleep(60)  # Update every minute

# Run producer
if __name__ == '__main__':
    producer = MarketDataProducer()
    tickers = ['AAPL', 'TSLA', 'NVDA', 'BTC-USD', 'ETH-USD']
    producer.stream_stock_prices(tickers)
```

### ClickHouse Consumer
```python
# kafka/consumers/clickhouse_consumer.py
from kafka import KafkaConsumer
from clickhouse_driver import Client
import json
from typing import List, Dict

class ClickHouseConsumer:
    def __init__(self):
        self.consumer = KafkaConsumer(
            'market.stocks',
            'social.twitter',
            bootstrap_servers='kafka:9092',
            group_id='clickhouse-writer',
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
        )

        self.client = Client(host='clickhouse', port=9000)
        self.batch = []
        self.batch_size = 100

    def consume_and_write(self):
        """Consume messages from Kafka and batch write to ClickHouse"""
        for message in self.consumer:
            topic = message.topic
            data = message.value

            if topic == 'market.stocks':
                self.batch.append({
                    'ticker': data['ticker'],
                    'price': data['price'],
                    'volume': data['volume'],
                    'timestamp': data['timestamp'],
                })

            elif topic == 'social.twitter':
                self.batch.append({
                    'username': data['username'],
                    'tweet_id': data['tweet_id'],
                    'text': data['text'],
                    'likes': data['likes'],
                    'created_at': data['created_at'],
                })

            # Batch insert
            if len(self.batch) >= self.batch_size:
                self._write_batch(topic)
                self.batch = []

    def _write_batch(self, topic: str):
        """Write batch to appropriate ClickHouse table"""
        if topic == 'market.stocks':
            table = 'market.stock_prices'
        elif topic == 'social.twitter':
            table = 'social.tweets'

        self.client.execute(f'INSERT INTO {table} VALUES', self.batch)
```

---

## 🧹 Data Quality

### Great Expectations Integration
```python
# processors/data_quality.py
import great_expectations as gx
import pandas as pd

def validate_stock_data(df: pd.DataFrame) -> dict:
    """Validate stock price data quality"""
    context = gx.get_context()

    validator = context.sources.pandas_default.read_dataframe(df)

    # Define expectations
    validator.expect_column_values_to_not_be_null("ticker")
    validator.expect_column_values_to_be_between("price", min_value=0)
    validator.expect_column_values_to_be_between("volume", min_value=0)
    validator.expect_column_values_to_match_regex("ticker", r"^[A-Z]{1,5}$")

    # Run validation
    results = validator.validate()

    if not results["success"]:
        # Send alert
        from utils.alerting import send_slack_alert
        send_slack_alert(f"Data quality check failed: {results['statistics']}")

    return results

# Usage in DAG
def validate_data(**context):
    df = pd.read_sql("SELECT * FROM staging.stock_prices WHERE date = CURRENT_DATE", engine)
    results = validate_stock_data(df)
    return results["success"]
```

---

## 🗄️ ClickHouse Schema

```sql
-- macro/indicators table
CREATE TABLE macro.indicators (
    indicator String,
    date Date,
    value Float64,
    timestamp DateTime,
    INDEX idx_indicator indicator TYPE bloom_filter GRANULARITY 1,
    INDEX idx_date date TYPE minmax GRANULARITY 3
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (indicator, date);

-- market/stock_prices table
CREATE TABLE market.stock_prices (
    ticker String,
    price Float64,
    volume UInt64,
    market_cap UInt64,
    timestamp DateTime,
    INDEX idx_ticker ticker TYPE bloom_filter GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(timestamp)
ORDER BY (ticker, timestamp);

-- social/tweets table
CREATE TABLE social.tweets (
    username String,
    tweet_id String,
    text String,
    likes UInt32,
    retweets UInt32,
    tickers Array(String),
    created_at DateTime,
    sentiment String,
    sentiment_score Float32,
    INDEX idx_username username TYPE bloom_filter GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(created_at)
ORDER BY (username, created_at);
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run tests
pytest tests/unit/

# With coverage
pytest --cov=. --cov-report=html
```

Example:
```python
# tests/unit/test_twitter_crawler.py
import pytest
from crawlers.twitter_crawler import TwitterInfluencerCrawler

@pytest.fixture
def crawler():
    return TwitterInfluencerCrawler()

def test_extract_tickers(crawler):
    text = "Buying more $TSLA and $BTC today! 🚀"
    tickers = crawler._extract_tickers(text)
    assert tickers == ['TSLA', 'BTC']

def test_extract_no_tickers(crawler):
    text = "Good morning everyone!"
    tickers = crawler._extract_tickers(text)
    assert tickers == []
```

### Integration Tests
```python
# tests/integration/test_kafka_pipeline.py
def test_end_to_end_pipeline():
    """Test producer → Kafka → consumer → ClickHouse"""
    # 1. Produce message
    producer = MarketDataProducer()
    producer.producer.send('market.stocks', value={
        'ticker': 'TEST',
        'price': 100.0,
        'volume': 1000000,
        'timestamp': datetime.now().isoformat(),
    })
    producer.producer.flush()

    # 2. Wait for consumer
    time.sleep(5)

    # 3. Check ClickHouse
    client = Client(host='clickhouse', port=9000)
    result = client.execute("SELECT * FROM market.stock_prices WHERE ticker='TEST'")

    assert len(result) > 0
    assert result[0][0] == 'TEST'
```

---

## 📊 Monitoring

### Airflow UI
- Web UI: http://localhost:8081
- Monitor DAG runs, task failures, execution times
- View logs for debugging

### Prometheus Metrics
```python
# utils/metrics.py
from prometheus_client import Counter, Gauge

kafka_messages_produced = Counter(
    'kafka_messages_produced_total',
    'Total messages produced to Kafka',
    ['topic']
)

dag_running_count = Gauge(
    'airflow_dag_running',
    'Number of running DAGs',
    ['dag_id']
)
```

### Slack Alerts
```python
# utils/alerting.py
import requests

def send_slack_alert(message: str, severity: str = 'warning'):
    webhook_url = os.getenv('SLACK_WEBHOOK_URL')

    payload = {
        'text': f"🚨 Data Pipeline Alert",
        'attachments': [{
            'color': '#FF1744' if severity == 'critical' else '#FFC107',
            'text': message,
            'footer': 'Nexus-Alpha Data Team',
        }]
    }

    requests.post(webhook_url, json=payload)
```

---

## 🚀 Deployment

### Docker Compose (Local)
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f airflow-webserver

# Stop services
docker-compose down
```

### Kubernetes
```bash
# Deploy to K8s
kubectl apply -f /infra/kubernetes/applications/data-pipeline/
```

---

## 📚 Resources

### Books
- "Designing Data-Intensive Applications" - Martin Kleppmann
- "The Data Warehouse Toolkit" - Ralph Kimball

### Courses
- Apache Airflow: The Hands-On Guide (Udemy)
- Kafka Streams for Data Processing (Confluent)

### Documentation
- Airflow: https://airflow.apache.org/docs/
- Kafka: https://kafka.apache.org/documentation/
- ClickHouse: https://clickhouse.com/docs/

---

**Last Updated:** 2025-10-31
