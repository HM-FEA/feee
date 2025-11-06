# 📊 Team Data: Data Engineering Handbook

**Team:** Data Engineering
**Squad Size:** 3 engineers
**Workspace:** `/services/data-pipeline`

---

## 🎯 Team Mission

"우리는 외부 세계의 모든 금융 데이터를 신뢰할 수 있고 즉시 사용 가능한 인사이트로 변환합니다."

---

## 👥 Team Roles

### Lead: Data Architect
- Data pipeline architecture design
- ETL/ELT strategy & best practices
- Data quality & governance
- Team mentoring & code review

### Senior Data Engineer
- Real-time streaming pipelines (Kafka)
- ClickHouse optimization
- Data warehouse design
- Performance tuning

### Data Engineer
- Batch ETL jobs (Airflow)
- API crawlers & scrapers
- Data cleaning & transformation
- Monitoring & alerting

---

## 🛠️ Technology Stack

```python
# Workflow Orchestration
Apache Airflow 2.7+

# Streaming
Apache Kafka 3.5+
kafka-python

# Data Processing
pandas 2.1+
polars 0.19+  # Faster than pandas
dask  # Parallel computing

# Databases
clickhouse-driver
psycopg2-binary
redis

# External APIs
requests
aiohttp  # Async HTTP
tweepy  # X (Twitter) API
praw  # Reddit API

# Data Quality
great-expectations
pandera

# Monitoring
prometheus-client
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
│   │   ├── text_cleaner.py      # NLP preprocessing
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
├── docker-compose.yml           # Local dev environment
├── requirements.txt
└── README.md
```

---

## 🔄 Data Sources & Pipelines

### 1. Macro-Economic Data

#### FRED (Federal Reserve Economic Data)
```python
# dags/macro/fred_daily.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import requests

def fetch_fred_data(**context):
    """
    Fetch key economic indicators from FRED API

    Indicators:
    - FEDFUNDS: Federal Funds Rate
    - DGS10: 10-Year Treasury Rate
    - M2: M2 Money Supply
    - UNRATE: Unemployment Rate
    - CPIAUCSL: CPI (Inflation)
    """
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
            results.append({
                'indicator': series_id,
                'date': obs['date'],
                'value': float(obs['value']) if obs['value'] != '.' else None,
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
with DAG(
    'fred_daily_indicators',
    default_args={
        'owner': 'data-team',
        'retries': 3,
        'retry_delay': timedelta(minutes=5),
    },
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

#### Global Liquidity (World Bank API)
```python
# dags/macro/global_liquidity.py
def fetch_global_m2(**context):
    """
    Fetch M2 money supply for major economies
    Countries: US, EU, China, Japan, UK, Canada
    """
    import wbgapi as wb

    countries = ['USA', 'EMU', 'CHN', 'JPN', 'GBR', 'CAN']
    indicator = 'FM.LBL.BMNY.GD.ZS'  # Broad money (% of GDP)

    data = wb.data.DataFrame(indicator, countries, mrv=12)  # Most recent 12 months

    results = []
    for country in countries:
        for date, value in data[country].items():
            if pd.notna(value):
                results.append({
                    'country': country,
                    'date': date,
                    'value': float(value),
                    'metric': 'm2_money_supply',
                })

    # Save to ClickHouse
    save_to_clickhouse('macro.global_liquidity', results)

    return len(results)
```

---

### 2. Micro Social Signals

#### X (Twitter) API - Influencer Tracking
```python
# crawlers/twitter_crawler.py
import tweepy
import asyncio
from typing import List, Dict

class TwitterInfluencerCrawler:
    def __init__(self):
        self.api_key = os.getenv('TWITTER_API_KEY')
        self.api_secret = os.getenv('TWITTER_API_SECRET')
        self.bearer_token = os.getenv('TWITTER_BEARER_TOKEN')

        # Initialize Tweepy v2 client
        self.client = tweepy.Client(bearer_token=self.bearer_token)

    def get_influencer_tweets(self, username: str, hours: int = 24) -> List[Dict]:
        """
        Fetch recent tweets from financial influencer

        Target influencers:
        - @elonmusk
        - @chamath
        - @michael_saylor
        - @cathiedwood
        - @zerohedge
        """
        user = self.client.get_user(username=username)
        user_id = user.data.id

        # Get tweets from last 24 hours
        tweets = self.client.get_users_tweets(
            id=user_id,
            max_results=100,
            tweet_fields=['created_at', 'public_metrics', 'entities'],
            start_time=(datetime.now() - timedelta(hours=hours)).isoformat() + 'Z',
        )

        results = []
        for tweet in tweets.data or []:
            # Extract stock mentions ($TSLA, $BTC, etc.)
            tickers = self._extract_tickers(tweet.text)

            results.append({
                'username': username,
                'tweet_id': tweet.id,
                'text': tweet.text,
                'created_at': tweet.created_at,
                'likes': tweet.public_metrics['like_count'],
                'retweets': tweet.public_metrics['retweet_count'],
                'replies': tweet.public_metrics['reply_count'],
                'tickers': tickers,
            })

        return results

    def _extract_tickers(self, text: str) -> List[str]:
        """Extract stock tickers like $TSLA, $BTC from tweet"""
        import re
        return re.findall(r'\$([A-Z]{2,5})\b', text)

# Airflow DAG
def crawl_influencers(**context):
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
        time.sleep(1)  # Rate limiting

    # Send to Kafka for real-time processing
    producer = KafkaProducer(bootstrap_servers='kafka:9092')
    for tweet in all_tweets:
        producer.send('social.twitter', value=json.dumps(tweet).encode())

    return len(all_tweets)
```

#### Reddit WallStreetBets Scraper
```python
# crawlers/reddit_crawler.py
import praw

class RedditWSBCrawler:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_CLIENT_ID'),
            client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
            user_agent='nexus-alpha/1.0',
        )
        self.subreddit = self.reddit.subreddit('wallstreetbets')

    def get_trending_stocks(self, limit: int = 100) -> Dict[str, int]:
        """
        Analyze WSB hot posts to find trending stocks
        Returns: {ticker: mention_count}
        """
        ticker_counts = {}

        for submission in self.subreddit.hot(limit=limit):
            # Extract tickers from title and body
            text = f"{submission.title} {submission.selftext}"
            tickers = self._extract_tickers(text)

            for ticker in tickers:
                ticker_counts[ticker] = ticker_counts.get(ticker, 0) + 1

        # Sort by frequency
        return dict(sorted(ticker_counts.items(), key=lambda x: x[1], reverse=True))

    def get_post_sentiment(self, post_id: str) -> Dict:
        """Get detailed sentiment from post + comments"""
        submission = self.reddit.submission(id=post_id)

        # Collect all text
        texts = [submission.title, submission.selftext]
        submission.comments.replace_more(limit=0)
        texts.extend([comment.body for comment in submission.comments.list()[:50]])

        # Send to Quant Engine for sentiment analysis
        import requests
        response = requests.post(
            'http://quant-engine:8000/api/v1/nlp/sentiment',
            json={'text': ' '.join(texts)}
        )

        sentiment = response.json()

        return {
            'post_id': post_id,
            'title': submission.title,
            'score': submission.score,
            'num_comments': submission.num_comments,
            'sentiment_label': sentiment['label'],
            'sentiment_score': sentiment['score'],
        }
```

---

### 3. Crypto On-Chain Data

#### Glassnode API Integration
```python
# dags/crypto/glassnode_onchain.py
def fetch_glassnode_metrics(**context):
    """
    Fetch on-chain metrics from Glassnode

    Metrics:
    - Exchange netflow (whale movements)
    - Active addresses
    - SOPR (Spent Output Profit Ratio)
    - MVRV (Market Value to Realized Value)
    """
    api_key = os.getenv('GLASSNODE_API_KEY')
    base_url = 'https://api.glassnode.com/v1/metrics'

    metrics = [
        'distribution/exchange_net_position_change',
        'addresses/active_count',
        'indicators/sopr',
        'market/mvrv',
    ]

    results = []
    for metric in metrics:
        params = {
            'a': 'BTC',  # Asset
            'api_key': api_key,
            'i': '24h',  # Interval
            's': int((datetime.now() - timedelta(days=30)).timestamp()),
        }

        response = requests.get(f'{base_url}/{metric}', params=params)
        data = response.json()

        for point in data:
            results.append({
                'metric': metric.split('/')[-1],
                'timestamp': datetime.fromtimestamp(point['t']),
                'value': point['v'],
                'asset': 'BTC',
            })

    save_to_clickhouse('crypto.onchain_metrics', results)
    return len(results)
```

---

## 🚰 Real-Time Streaming (Kafka)

### Kafka Producer - Market Data
```python
# kafka/producers/market_data_producer.py
from kafka import KafkaProducer
import yfinance as yf
import json
import time

class MarketDataProducer:
    def __init__(self):
        self.producer = KafkaProducer(
            bootstrap_servers='kafka:9092',
            value_serializer=lambda v: json.dumps(v).encode('utf-8'),
        )

    def stream_stock_prices(self, tickers: List[str]):
        """
        Stream real-time stock prices to Kafka

        Topic: market.stocks
        """
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

### Kafka Consumer - ClickHouse Writer
```python
# kafka/consumers/clickhouse_consumer.py
from kafka import KafkaConsumer
from clickhouse_driver import Client
import json

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

    def consume_and_write(self):
        """
        Consume messages from Kafka and write to ClickHouse
        Batch writes for performance
        """
        batch = []
        batch_size = 100

        for message in self.consumer:
            topic = message.topic
            data = message.value

            if topic == 'market.stocks':
                batch.append({
                    'ticker': data['ticker'],
                    'price': data['price'],
                    'volume': data['volume'],
                    'timestamp': data['timestamp'],
                })

            elif topic == 'social.twitter':
                batch.append({
                    'username': data['username'],
                    'tweet_id': data['tweet_id'],
                    'text': data['text'],
                    'likes': data['likes'],
                    'created_at': data['created_at'],
                })

            # Batch insert
            if len(batch) >= batch_size:
                self._write_batch(topic, batch)
                batch = []

    def _write_batch(self, topic: str, batch: List[Dict]):
        """Write batch to appropriate ClickHouse table"""
        if topic == 'market.stocks':
            table = 'market.stock_prices'
        elif topic == 'social.twitter':
            table = 'social.tweets'

        self.client.execute(f'INSERT INTO {table} VALUES', batch)
```

---

## 🗄️ ClickHouse Schema Design

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
    replies UInt32,
    tickers Array(String),
    created_at DateTime,
    sentiment String,
    sentiment_score Float32,
    INDEX idx_username username TYPE bloom_filter GRANULARITY 1,
    INDEX idx_tickers tickers TYPE bloom_filter GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toYYYYMMDD(created_at)
ORDER BY (username, created_at);

-- crypto/onchain_metrics table
CREATE TABLE crypto.onchain_metrics (
    metric String,
    asset String,
    value Float64,
    timestamp DateTime,
    INDEX idx_metric metric TYPE bloom_filter GRANULARITY 1
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (asset, metric, timestamp);
```

---

## 🔍 Data Quality Monitoring

### Great Expectations Integration
```python
# processors/data_quality.py
import great_expectations as gx

def validate_stock_data(df):
    """
    Validate stock price data quality
    """
    context = gx.get_context()

    # Create expectations
    suite = context.add_expectation_suite("stock_prices")

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
        send_slack_alert(f"Data quality check failed: {results['statistics']}")

    return results
```

---

## 🧪 Testing

### Unit Tests
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

## 📈 Monitoring & Alerting

### Prometheus Metrics
```python
# utils/metrics.py
from prometheus_client import Counter, Gauge, Histogram

# Counters
kafka_messages_produced = Counter(
    'kafka_messages_produced_total',
    'Total messages produced to Kafka',
    ['topic']
)

api_requests_total = Counter(
    'external_api_requests_total',
    'Total external API requests',
    ['api', 'status']
)

# Gauges
airflow_dag_running = Gauge(
    'airflow_dag_running',
    'Number of running DAGs',
    ['dag_id']
)

# Histograms
api_request_duration = Histogram(
    'api_request_duration_seconds',
    'API request duration',
    ['api']
)
```

### Slack Alerting
```python
# utils/alerting.py
def send_slack_alert(message: str, severity: str = 'warning'):
    """
    Send alert to Slack channel

    Channels:
    - #alerts-critical (severity=critical)
    - #alerts-data (severity=warning)
    """
    webhook_url = os.getenv('SLACK_WEBHOOK_URL')

    color = {
        'critical': '#FF1744',
        'warning': '#FFC107',
        'info': '#00E5FF',
    }[severity]

    payload = {
        'text': f"🚨 Data Pipeline Alert",
        'attachments': [{
            'color': color,
            'text': message,
            'footer': 'Nexus-Alpha Data Team',
            'ts': int(datetime.now().timestamp()),
        }]
    }

    requests.post(webhook_url, json=payload)
```

---

## 📚 Recommended Resources

### Books
- "Designing Data-Intensive Applications" - Martin Kleppmann
- "The Data Warehouse Toolkit" - Ralph Kimball
- "Streaming Systems" - Tyler Akidau

### Courses
- Apache Airflow: The Hands-On Guide (Udemy)
- Kafka Streams for Data Processing (Confluent)
- ClickHouse Performance Tuning

### Documentation
- Airflow Best Practices: https://airflow.apache.org/docs/
- Kafka Documentation: https://kafka.apache.org/documentation/
- ClickHouse Query Optimization: https://clickhouse.com/docs/

---

**Document Owner:** Data Architect
**Last Updated:** 2025-10-31
