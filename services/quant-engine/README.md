# 🧮 Nexus-Alpha Quant Engine

**Technology:** Python 3.11+ (FastAPI)
**Team:** Team Quant (AI & Models)
**Port:** 8000

---

## 📖 Overview

The Quant Engine is the brain of Nexus-Alpha, providing:

- 📊 **Quantitative Models**: Black-Scholes, CAPM, VaR, Portfolio Optimization
- 🤖 **AI/ML Models**: NLP sentiment analysis (FinBERT), time-series forecasting (LSTM)
- 🎲 **Simulation Engines**: Interest rate impact, macro-economic scenarios, crypto correlations
- 📈 **Financial Analysis**: Technical indicators, risk metrics, correlation matrices

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- (Optional) CUDA-enabled GPU for ML training

### Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install -r requirements-dev.txt

# Copy environment file
cp .env.example .env

# Edit .env
# DATABASE_URL=postgresql://user:pass@localhost:5432/nexus_alpha
# REDIS_URL=redis://localhost:6379
# OPENBB_PAT=your-openbb-token
```

### Development
```bash
# Run dev server with hot reload
uvicorn app.main:app --reload --port 8000

# Run with debugging
python -m debugpy --listen 5678 -m uvicorn app.main:app --reload

# Run tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Lint
ruff check .

# Format code
black .
```

---

## 📁 Project Structure

```
services/quant-engine/
├── app/
│   ├── main.py                  # FastAPI application
│   ├── api/
│   │   └── v1/
│   │       ├── routes/
│   │       │   ├── simulation.py      # /api/v1/simulations/*
│   │       │   ├── prediction.py      # /api/v1/predictions/*
│   │       │   ├── analysis.py        # /api/v1/analysis/*
│   │       │   └── options.py         # /api/v1/options/*
│   │       └── __init__.py
│   ├── models/                  # Pydantic models
│   │   ├── simulation.py
│   │   ├── market.py
│   │   └── prediction.py
│   ├── services/                # Business logic
│   │   ├── simulation_service.py
│   │   ├── nlp_service.py
│   │   └── risk_service.py
│   └── core/
│       ├── config.py
│       └── logging.py
├── ml/                          # ML models
│   ├── models/
│   │   ├── sentiment/
│   │   │   ├── finbert.py
│   │   │   └── train.py
│   │   └── timeseries/
│   │       ├── lstm.py
│   │       └── transformer.py
│   ├── pipelines/
│   │   └── sentiment_pipeline.py
│   └── utils/
│       ├── preprocessing.py
│       └── evaluation.py
├── quant/                       # Quantitative models
│   ├── models/
│   │   ├── black_scholes.py
│   │   ├── capm.py
│   │   ├── var.py
│   │   └── portfolio.py
│   ├── simulations/
│   │   ├── interest_rate.py
│   │   ├── macro_economy.py
│   │   └── crypto.py
│   └── utils/
│       ├── financial_math.py
│       └── indicators.py
├── data/
│   ├── datasets/                # Training data
│   ├── models/                  # Saved ML models
│   └── cache/                   # API response cache
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── scripts/
│   ├── train_sentiment_model.py
│   ├── backtest.py
│   └── migrate.py
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── pyproject.toml
└── README.md
```

---

## 🎯 Core Models

### 1. Black-Scholes Option Pricing
```python
# quant/models/black_scholes.py
import numpy as np
from scipy.stats import norm

def black_scholes_call(S, K, T, r, sigma):
    """
    Calculate Black-Scholes call option price

    Args:
        S: Current stock price
        K: Strike price
        T: Time to maturity (years)
        r: Risk-free rate
        sigma: Volatility

    Returns:
        Option price
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    call_price = S * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    return call_price

# FastAPI endpoint
from fastapi import APIRouter, Body

router = APIRouter()

@router.post("/options/price")
async def calculate_option_price(
    S: float = Body(..., description="Current stock price"),
    K: float = Body(..., description="Strike price"),
    T: float = Body(..., description="Time to maturity"),
    r: float = Body(..., description="Risk-free rate"),
    sigma: float = Body(..., description="Volatility"),
):
    price = black_scholes_call(S, K, T, r, sigma)
    return {"call_price": price}
```

### 2. Interest Rate Impact Simulation
```python
# quant/simulations/interest_rate.py
import pandas as pd
import numpy as np

class InterestRateSimulation:
    def __init__(self, companies: list[dict]):
        self.companies = companies

    def simulate(self, new_rate: float) -> dict:
        """
        Simulate impact of interest rate change on companies

        Args:
            new_rate: New interest rate (%)

        Returns:
            Simulation results with company health scores
        """
        results = []

        for company in self.companies:
            # Calculate new interest expense
            debt = company['total_liabilities']
            old_expense = debt * (company['current_rate'] / 100)
            new_expense = debt * (new_rate / 100)

            # Calculate impact on net income
            revenue = company['revenue']
            operating_expense = company['operating_expense']
            old_net_income = revenue - operating_expense - old_expense
            new_net_income = revenue - operating_expense - new_expense

            # Calculate ICR (Interest Coverage Ratio)
            ebit = revenue - operating_expense
            new_icr = ebit / new_expense if new_expense > 0 else float('inf')

            # Health score (0-100)
            health_score = self._calculate_health(new_icr, company['debt_ratio'])

            results.append({
                'company_id': company['id'],
                'company_name': company['name'],
                'old_interest_expense': old_expense,
                'new_interest_expense': new_expense,
                'old_net_income': old_net_income,
                'new_net_income': new_net_income,
                'new_icr': new_icr,
                'health_score': health_score,
                'risk_level': self._get_risk_level(health_score),
            })

        return {
            'new_rate': new_rate,
            'total_companies': len(results),
            'at_risk': sum(1 for r in results if r['risk_level'] == 'high'),
            'companies': results,
        }

    def _calculate_health(self, icr: float, debt_ratio: float) -> float:
        """Calculate health score (0-100)"""
        score = 0

        # ICR component (max 40 points)
        if icr > 3:
            score += 40
        elif icr > 1.5:
            score += 20

        # Debt ratio component (max 30 points)
        if debt_ratio < 100:
            score += 30
        elif debt_ratio < 200:
            score += 15

        # Base score
        score += 30

        return min(100, score)

    def _get_risk_level(self, health_score: float) -> str:
        if health_score >= 70:
            return 'low'
        if health_score >= 40:
            return 'medium'
        return 'high'
```

### 3. FinBERT Sentiment Analysis
```python
# ml/models/sentiment/finbert.py
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

class FinBERTSentiment:
    def __init__(self):
        self.model_name = "ProsusAI/finbert"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def predict(self, text: str) -> dict:
        """
        Predict sentiment of financial text

        Args:
            text: Financial text (tweet, news, etc.)

        Returns:
            {
                'label': 'positive' | 'negative' | 'neutral',
                'score': float (confidence),
                'scores': dict (all probabilities)
            }
        """
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)

        labels = ['positive', 'negative', 'neutral']
        scores = {label: prob.item() for label, prob in zip(labels, probs[0])}

        max_label = max(scores, key=scores.get)

        return {
            'label': max_label,
            'score': scores[max_label],
            'scores': scores,
        }

# FastAPI endpoint
@router.post("/nlp/sentiment")
async def analyze_sentiment(
    text: str = Body(..., description="Text to analyze"),
):
    sentiment_model = FinBERTSentiment()
    result = sentiment_model.predict(text)
    return result
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pytest

# Test specific module
pytest tests/unit/test_black_scholes.py

# With coverage
pytest --cov=app --cov-report=html
open htmlcov/index.html
```

Example:
```python
# tests/unit/test_black_scholes.py
import pytest
from quant.models.black_scholes import black_scholes_call

def test_black_scholes_call():
    # Test with known values
    price = black_scholes_call(S=100, K=100, T=1, r=0.05, sigma=0.2)
    assert 8 < price < 12  # Approximate range

def test_black_scholes_zero_volatility():
    # With zero volatility, should be intrinsic value
    price = black_scholes_call(S=110, K=100, T=1, r=0, sigma=0.0001)
    assert abs(price - 10) < 0.1
```

### Integration Tests
```python
# tests/integration/test_simulation_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_simulate_interest_rate():
    response = client.post("/api/v1/simulations/interest-rate", json={
        "new_rate": 5.5,
        "companies": [
            {
                "id": "c1",
                "name": "Test REIT",
                "total_liabilities": 1000000,
                "current_rate": 3.5,
                "revenue": 200000,
                "operating_expense": 50000,
                "debt_ratio": 150,
            }
        ]
    })

    assert response.status_code == 200
    data = response.json()
    assert data["new_rate"] == 5.5
    assert len(data["companies"]) == 1
```

---

## 📊 ML Model Training

### Training FinBERT
```bash
# Run training script
python scripts/train_sentiment_model.py --epochs 3 --batch-size 16

# Monitor with MLflow
mlflow ui --port 5000
# Open http://localhost:5000
```

Training script:
```python
# scripts/train_sentiment_model.py
import mlflow
import torch
from transformers import Trainer, TrainingArguments
from datasets import load_dataset

def train_sentiment_model():
    # Load dataset
    dataset = load_dataset("financial_phrasebank", "sentences_allagree")

    # Split
    train_test = dataset["train"].train_test_split(test_size=0.2)
    train_ds = train_test["train"]
    test_ds = train_test["test"]

    # Training args
    training_args = TrainingArguments(
        output_dir="./results",
        num_train_epochs=3,
        per_device_train_batch_size=16,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
    )

    # MLflow tracking
    mlflow.start_run()
    mlflow.log_params({
        "model": "finbert",
        "epochs": 3,
        "batch_size": 16,
    })

    # Train
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=test_ds,
    )

    trainer.train()

    # Evaluate
    metrics = trainer.evaluate()
    mlflow.log_metrics(metrics)

    # Save model
    trainer.save_model("./data/models/sentiment_v1")
    mlflow.end_run()

if __name__ == "__main__":
    train_sentiment_model()
```

---

## 🚀 Deployment

### Docker
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t nexus-alpha/quant-engine:latest .
docker run -p 8000:8000 nexus-alpha/quant-engine:latest
```

### Kubernetes
```bash
# Deploy to K8s
kubectl apply -f /infra/kubernetes/applications/quant-engine/
```

---

## 📚 API Documentation

### Interactive Docs
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Example Request
```bash
# Calculate option price
curl -X POST "http://localhost:8000/api/v1/options/price" \
  -H "Content-Type: application/json" \
  -d '{
    "S": 100,
    "K": 105,
    "T": 0.5,
    "r": 0.05,
    "sigma": 0.2
  }'

# Response
{
  "call_price": 4.76
}
```

---

## 📈 Performance Optimization

### Caching with Redis
```python
# app/core/cache.py
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_result(expiration=300):
    """Decorator to cache function results in Redis"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"

            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # Execute function
            result = func(*args, **kwargs)

            # Store in cache
            redis_client.setex(cache_key, expiration, json.dumps(result))

            return result
        return wrapper
    return decorator

# Usage
@cache_result(expiration=600)  # 10 minutes
def calculate_portfolio_optimization(stocks, weights):
    # Expensive calculation
    ...
```

---

## 📚 Resources

### Books
- "Options, Futures, and Other Derivatives" - John C. Hull
- "Advances in Financial Machine Learning" - Marcos López de Prado

### Papers
- "Attention Is All You Need" (Transformer architecture)
- "FinBERT: Financial Sentiment Analysis with Pre-trained Language Models"

### Courses
- Coursera: Machine Learning Specialization
- Fast.ai: Practical Deep Learning
- QuantLib Python Tutorial

---

**Last Updated:** 2025-10-31
