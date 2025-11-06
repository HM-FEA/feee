# 🧮 Team Quant: AI & Quantitative Models Handbook

**Team:** Quant (AI & Models)
**Squad Size:** 3 engineers
**Workspace:** `/services/quant-engine`

---

## 🎯 Team Mission

"우리는 금융 데이터를 예측 가능한 인사이트로 변환하는 최첨단 AI/금융 모델을 개발합니다."

---

## 👥 Team Roles

### Lead: Quant Lead / ML Engineer
- Model architecture design
- Research paper implementation
- Model performance optimization
- Team mentoring

### Senior Quant Engineer
- Traditional quant models (Black-Scholes, CAPM)
- Portfolio optimization
- Risk analytics
- OpenBB integration

### ML Engineer
- NLP for sentiment analysis
- Time-series forecasting
- Model training pipelines
- MLflow experiment tracking

---

## 🛠️ Technology Stack

```python
# Core
Python 3.11+
FastAPI 0.104+
Uvicorn

# Data Science
pandas 2.1+
numpy 1.26+
scipy 1.11+

# Machine Learning
torch 2.1+  # PyTorch
transformers 4.35+  # Hugging Face
scikit-learn 1.3+

# Financial
yfinance
openbb
quantlib-python

# MLOps
mlflow
weights-and-biases (wandb)

# Database
sqlalchemy
psycopg2-binary
redis
```

---

## 📁 Project Structure

```
services/quant-engine/
├── app/
│   ├── main.py                # FastAPI app
│   ├── api/
│   │   ├── v1/
│   │   │   ├── routes/
│   │   │   │   ├── simulation.py
│   │   │   │   ├── prediction.py
│   │   │   │   └── analysis.py
│   │   │   └── __init__.py
│   │   └── deps.py            # Dependencies
│   ├── models/                # Pydantic models
│   │   ├── simulation.py
│   │   ├── market.py
│   │   └── prediction.py
│   ├── services/              # Business logic
│   │   ├── simulation_service.py
│   │   ├── nlp_service.py
│   │   └── risk_service.py
│   └── core/
│       ├── config.py
│       └── logging.py
├── ml/
│   ├── models/                # ML model definitions
│   │   ├── sentiment/
│   │   │   ├── finbert.py
│   │   │   └── train.py
│   │   ├── timeseries/
│   │   │   ├── lstm.py
│   │   │   └── transformer.py
│   │   └── __init__.py
│   ├── pipelines/             # Training pipelines
│   │   ├── sentiment_pipeline.py
│   │   └── price_prediction_pipeline.py
│   └── utils/
│       ├── preprocessing.py
│       └── evaluation.py
├── quant/
│   ├── models/                # Quant models
│   │   ├── black_scholes.py
│   │   ├── capm.py
│   │   ├── var.py             # Value at Risk
│   │   └── portfolio.py
│   ├── simulations/           # Simulation engines
│   │   ├── interest_rate.py
│   │   ├── macro_economy.py
│   │   └── crypto.py
│   └── utils/
│       ├── financial_math.py
│       └── indicators.py
├── data/
│   ├── datasets/              # Training data
│   ├── models/                # Saved models
│   └── cache/                 # API response cache
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── scripts/
│   ├── train_sentiment_model.py
│   ├── backtest.py
│   └── migrate.py
├── requirements.txt
├── Dockerfile
└── pyproject.toml
```

---

## 🚀 Core Models

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
            Simulation results
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
            
            # Calculate ICR
            ebit = revenue - operating_expense
            new_icr = ebit / new_expense if new_expense > 0 else float('inf')
            
            # Health score
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
                'risk_level': self._get_risk_level(health_score)
            })
        
        return {
            'new_rate': new_rate,
            'total_companies': len(results),
            'at_risk': sum(1 for r in results if r['risk_level'] == 'high'),
            'companies': results
        }
    
    def _calculate_health(self, icr: float, debt_ratio: float) -> float:
        """Calculate health score (0-100)"""
        score = 0
        if icr > 3: score += 40
        elif icr > 1.5: score += 20
        
        if debt_ratio < 100: score += 30
        elif debt_ratio < 200: score += 15
        
        return min(100, score + 30)  # Base score
    
    def _get_risk_level(self, health_score: float) -> str:
        if health_score >= 70: return 'low'
        if health_score >= 40: return 'medium'
        return 'high'
```

### 3. NLP Sentiment Analysis
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
            'scores': scores
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

## 📊 Model Training Pipeline

### Training Script Example
```python
# ml/pipelines/sentiment_pipeline.py
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
        per_device_eval_batch_size=64,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir="./logs",
        logging_steps=10,
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
```

---

## 🧪 Testing

### Unit Tests
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

## 📚 Recommended Resources

### Books
- "Options, Futures, and Other Derivatives" - John C. Hull
- "Advances in Financial Machine Learning" - Marcos López de Prado
- "Machine Learning for Asset Managers" - Marcos López de Prado

### Papers
- "Attention Is All You Need" (Transformer)
- "BERT: Pre-training of Deep Bidirectional Transformers"
- "FinBERT: Financial Sentiment Analysis with Pre-trained Language Models"

### Courses
- Coursera: Machine Learning Specialization
- Fast.ai: Practical Deep Learning
- QuantLib Python Tutorial

---

**Document Owner:** Quant Lead
**Last Updated:** 2025-10-31
