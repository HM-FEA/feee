# 🔄 Development Process Guide

**Purpose:** 새로운 섹터나 기능을 추가할 때 따라야 할 표준 프로세스
**Version:** 1.0.0
**Last Updated:** 2025-10-31

---

## 🎯 Overview

Nexus-Alpha는 **섹터별 수직 개발** 방식을 사용합니다. 각 섹터(부동산, 제조업, 암호화폐 등)는 독립적으로 개발되며, 동일한 프로세스를 따릅니다.

이 가이드는 **부동산 섹터 파일럿**을 기준으로 작성되었으며, 다른 섹터 개발 시에도 동일하게 적용됩니다.

---

## 📋 Standard Development Flow

```
1. Planning Phase (Week 1)
   ├── Feature scoping
   ├── Team assignment
   ├── Technical design
   └── Board update

2. Backend Development (Week 2)
   ├── Quant Engine: Simulation logic
   ├── Data Pipeline: Data collection
   └── Testing

3. Frontend Development (Week 2-3)
   ├── SimViz: Network graph generation
   ├── Web UI: React components
   └── Integration testing

4. Data Integration (Week 3)
   ├── External API integration
   ├── Database schema
   └── ETL pipeline setup

5. Testing & Deployment (Week 4)
   ├── End-to-end testing
   ├── Performance optimization
   ├── Staging deployment
   └── Documentation update
```

---

## 📝 Step 1: Planning Phase

### 1.1 Create Feature Specification

**Location:** `/docs/implementation/[SECTOR_NAME]_SPEC.md`

**Template:**
```markdown
# [Sector Name] Sector Specification

## Business Goal
- What problem does this solve?
- Who are the target users?
- Expected business impact?

## Technical Requirements
### Backend
- [ ] Simulation models needed
- [ ] Data sources
- [ ] API endpoints

### Frontend
- [ ] Visualization types (3D, charts, tables)
- [ ] User interactions
- [ ] Real-time updates

### Data
- [ ] External APIs
- [ ] Database tables
- [ ] ETL jobs

## Success Criteria
- Technical KPIs
- Business KPIs
- Timeline
```

### 1.2 Update Development Board

**Location:** `DEVELOPMENT_BOARD.md`

Add new project card:
```markdown
## [Sector Name] Pilot

**Status:** 🏗️ Planning
**Team Lead:** [Lead Name]
**Start Date:** [Date]
**Target Launch:** Week [X]

### Team Assignment
- Backend: Team Quant (Lead + Senior)
- Frontend: Team UI (Senior FE #1)
- Data: Team Data (Engineer)
- Infra: Team Infra (Support)

### Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3
```

### 1.3 Architecture Design

**Create:** `/docs/implementation/[SECTOR_NAME]_ARCHITECTURE.md`

**Include:**
- Data flow diagram
- API contracts
- Database schema
- Component hierarchy

---

## 🛠️ Step 2: Backend Development

### 2.1 Quant Engine: Simulation Module

**Workspace:** `services/quant-engine/`

#### Create Module Structure
```bash
cd services/quant-engine
mkdir -p quant/simulations/[sector_name]
touch quant/simulations/[sector_name]/__init__.py
touch quant/simulations/[sector_name]/simulator.py
touch quant/simulations/[sector_name]/models.py
```

#### Implement Simulator Class
```python
# quant/simulations/[sector_name]/simulator.py

from typing import List, Dict
import numpy as np

class [SectorName]Simulator:
    """[Sector] 시뮬레이터"""

    def __init__(self, data: List[Dict]):
        self.data = data

    def simulate(self, parameters: Dict) -> Dict:
        """
        시뮬레이션 실행

        Args:
            parameters: 시뮬레이션 파라미터

        Returns:
            시뮬레이션 결과
        """
        results = []

        for item in self.data:
            result = self._calculate_impact(item, parameters)
            results.append(result)

        summary = self._calculate_summary(results)

        return {
            'scenario': parameters,
            'results': results,
            'summary': summary,
        }

    def _calculate_impact(self, item: Dict, parameters: Dict) -> Dict:
        """개별 항목 영향 계산"""
        # 구현
        pass

    def _calculate_summary(self, results: List[Dict]) -> Dict:
        """집계 통계"""
        # 구현
        pass
```

#### Create FastAPI Endpoint
```python
# app/api/v1/routes/[sector_name]_simulation.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from quant.simulations.[sector_name].simulator import [SectorName]Simulator

router = APIRouter()

class SimulationRequest(BaseModel):
    parameters: Dict
    data: List[Dict]

@router.post("/[sector-name]/simulate")
async def simulate(request: SimulationRequest):
    """
    [Sector] 시뮬레이션

    Example:
    ```
    POST /api/v1/simulations/[sector-name]/simulate
    {
        "parameters": {...},
        "data": [...]
    }
    ```
    """
    try:
        simulator = [SectorName]Simulator(request.data)
        result = simulator.simulate(request.parameters)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### Register Router
```python
# app/main.py

from app.api.v1.routes import [sector_name]_simulation

app.include_router(
    [sector_name]_simulation.router,
    prefix="/api/v1/simulations",
    tags=["[sector-name]"]
)
```

#### Write Tests
```python
# tests/unit/test_[sector_name]_simulator.py

import pytest
from quant.simulations.[sector_name].simulator import [SectorName]Simulator

def test_simulator():
    data = [...]
    parameters = {...}

    simulator = [SectorName]Simulator(data)
    result = simulator.simulate(parameters)

    assert 'results' in result
    assert len(result['results']) > 0
```

---

## 🎨 Step 3: Frontend Development

### 3.1 SimViz Service: Graph Generation

**Workspace:** `services/simviz-service/backend/`

```python
# app/services/[sector_name]/network_generator.py

import networkx as nx
from typing import Dict

class [SectorName]NetworkGenerator:
    """[Sector] 네트워크 그래프 생성"""

    def generate(self, simulation_result: Dict) -> Dict:
        """D3.js 호환 네트워크 데이터 생성"""
        G = nx.DiGraph()

        # 노드 추가
        for item in simulation_result['results']:
            G.add_node(
                item['id'],
                name=item['name'],
                type='[node-type]',
                value=item['value'],
            )

        # 엣지 추가
        # ...

        return self._to_d3_format(G)

    def _to_d3_format(self, G: nx.DiGraph) -> Dict:
        """NetworkX → D3.js"""
        nodes = [{'id': node, **data} for node, data in G.nodes(data=True)]
        links = [{'source': s, 'target': t, **data} for s, t, data in G.edges(data=True)]
        return {'nodes': nodes, 'links': links}
```

### 3.2 Web UI: Components

**Workspace:** `apps/web/`

#### Create Component Structure
```bash
cd apps/web
mkdir -p components/[sector-name]
touch components/[sector-name]/Simulator.tsx
touch components/[sector-name]/NetworkGraph.tsx
touch components/[sector-name]/ResultsTable.tsx
touch components/[sector-name]/Controls.tsx
```

#### Main Simulator Component
```tsx
// components/[sector-name]/Simulator.tsx
'use client';

import { useState } from 'react';
import { NetworkGraph } from './NetworkGraph';
import { ResultsTable } from './ResultsTable';
import { Controls } from './Controls';

export const [SectorName]Simulator = () => {
  const [parameters, setParameters] = useState({});
  const [result, setResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await fetch('http://localhost:8001/api/v1/viz/[sector-name]/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters, data: [] }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101015] p-8">
      <h1 className="text-4xl font-bold text-[#F5F5F5] mb-8">
        [Sector] 시뮬레이션
      </h1>

      <Controls
        parameters={parameters}
        onParametersChange={setParameters}
        onSimulate={runSimulation}
        isSimulating={isSimulating}
      />

      {result && (
        <div className="grid grid-cols-2 gap-8 mt-8">
          <NetworkGraph network={result.network} />
          <ResultsTable results={result.results} />
        </div>
      )}
    </div>
  );
};
```

#### Create Page Route
```tsx
// app/(dashboard)/[sector-name]/page.tsx

import { [SectorName]Simulator } from '@/components/[sector-name]/Simulator';

export default function [SectorName]Page() {
  return <[SectorName]Simulator />;
}
```

---

## 📊 Step 4: Data Integration

### 4.1 Database Schema

**Location:** `services/data-pipeline/migrations/`

```sql
-- migrations/create_[sector_name]_tables.sql

CREATE TABLE [sector_name]_entities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE [sector_name]_data (
    id SERIAL PRIMARY KEY,
    entity_id VARCHAR(50) REFERENCES [sector_name]_entities(id),
    metric_name VARCHAR(100),
    metric_value DECIMAL(20, 2),
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_[sector]_entity ON [sector_name]_data(entity_id);
CREATE INDEX idx_[sector]_recorded ON [sector_name]_data(recorded_at DESC);
```

### 4.2 Data Crawler

**Location:** `services/data-pipeline/crawlers/`

```python
# crawlers/[sector_name]_crawler.py

import requests
import pandas as pd

class [SectorName]Crawler:
    """[Sector] 데이터 크롤러"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.example.com"

    def fetch_data(self) -> pd.DataFrame:
        """데이터 수집"""
        response = requests.get(
            f"{self.base_url}/data",
            headers={'Authorization': f'Bearer {self.api_key}'}
        )
        data = response.json()
        return pd.DataFrame(data)

    def save_to_db(self, df: pd.DataFrame):
        """DB 저장"""
        # PostgreSQL 저장 로직
        pass
```

### 4.3 Airflow DAG

**Location:** `services/data-pipeline/dags/`

```python
# dags/[sector_name]_data_sync.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
from crawlers.[sector_name]_crawler import [SectorName]Crawler

def sync_data(**context):
    """데이터 동기화"""
    crawler = [SectorName]Crawler(os.getenv('API_KEY'))
    df = crawler.fetch_data()
    crawler.save_to_db(df)
    return len(df)

default_args = {
    'owner': 'data-team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    '[sector_name]_data_sync',
    default_args=default_args,
    description='[Sector] 데이터 동기화',
    schedule_interval='0 2 * * *',  # 매일 새벽 2시
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['[sector-name]', 'data-sync'],
) as dag:

    sync_task = PythonOperator(
        task_id='sync_data',
        python_callable=sync_data,
    )
```

---

## 🧪 Step 5: Testing & Deployment

### 5.1 Unit Tests

각 서비스별 테스트:
```bash
# Quant Engine
cd services/quant-engine
pytest tests/unit/test_[sector_name]_simulator.py

# SimViz Service
cd services/simviz-service/backend
pytest

# Web Frontend
cd apps/web
pnpm test
```

### 5.2 Integration Tests

```python
# tests/integration/test_[sector_name]_e2e.py

import requests

def test_end_to_end_simulation():
    """전체 흐름 테스트"""
    # 1. Quant Engine 호출
    quant_response = requests.post(
        "http://localhost:8000/api/v1/simulations/[sector-name]/simulate",
        json={"parameters": {}, "data": []}
    )
    assert quant_response.status_code == 200

    # 2. SimViz 호출
    simviz_response = requests.post(
        "http://localhost:8001/api/v1/viz/[sector-name]/simulate",
        json={"parameters": {}, "data": []}
    )
    assert simviz_response.status_code == 200

    # 3. 결과 검증
    result = simviz_response.json()
    assert 'network' in result
    assert len(result['network']['nodes']) > 0
```

### 5.3 Deployment Checklist

#### Staging Deployment
```bash
# 1. Build Docker images
docker build -t nexus-alpha/quant-engine:[sector-name]-v1 services/quant-engine
docker build -t nexus-alpha/simviz-service:[sector-name]-v1 services/simviz-service
docker build -t nexus-alpha/web:[sector-name]-v1 apps/web

# 2. Push to registry
docker push nexus-alpha/quant-engine:[sector-name]-v1
docker push nexus-alpha/simviz-service:[sector-name]-v1
docker push nexus-alpha/web:[sector-name]-v1

# 3. Deploy to Kubernetes (staging)
kubectl apply -f infra/kubernetes/applications/quant-engine/
kubectl apply -f infra/kubernetes/applications/simviz-service/
kubectl apply -f infra/kubernetes/applications/web/

# 4. Run smoke tests
./scripts/smoke-tests.sh staging

# 5. Monitor logs
kubectl logs -f deployment/quant-engine -n staging
```

#### Production Deployment
```bash
# GitHub Actions will handle this automatically
# Trigger: Push to main branch
# See: .github/workflows/deploy.yml
```

---

## 📋 Step 6: Documentation & Board Update

### 6.1 Update Implementation Guide

**Create:** `/docs/implementation/[SECTOR_NAME]_GUIDE.md`

Include:
- Overview
- Backend implementation
- Frontend implementation
- Data integration
- Testing guide
- Deployment guide

### 6.2 Update Development Board

**Location:** `DEVELOPMENT_BOARD.md`

```markdown
## [Sector Name] Pilot

**Status:** ✅ Completed
**Team Lead:** [Lead Name]
**Completion Date:** [Date]

### Delivered
- ✅ Backend simulation engine
- ✅ Frontend visualization
- ✅ Data integration
- ✅ E2E tests
- ✅ Staging deployment

### Metrics
- API Response Time: XXms (P95)
- Test Coverage: XX%
- User Testing: X users

### Learnings
- What went well?
- What can be improved?
- Next steps?
```

### 6.3 Update Main README

**Location:** `README.md`

Add new sector to "Current Projects":
```markdown
### ✅ Phase X: [Sector] (Completed)
- [x] Backend implementation
- [x] Frontend visualization
- [x] Data integration
- [x] Testing & deployment
```

---

## 📊 Templates & Checklists

### New Sector Checklist

```markdown
## [Sector Name] Development Checklist

### Planning (Week 1)
- [ ] Feature spec created
- [ ] Team assigned
- [ ] Architecture designed
- [ ] Board updated

### Backend (Week 2)
- [ ] Simulator module implemented
- [ ] FastAPI endpoints created
- [ ] Unit tests written (>80% coverage)
- [ ] API tested with Postman/curl

### Frontend (Week 2-3)
- [ ] SimViz network generator implemented
- [ ] React components created
- [ ] Integration with backend tested
- [ ] E2E tests written

### Data (Week 3)
- [ ] Database schema created
- [ ] Data crawler implemented
- [ ] Airflow DAG scheduled
- [ ] Sample data loaded

### Testing (Week 4)
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance tested (P95 < 200ms)

### Deployment (Week 4)
- [ ] Docker images built
- [ ] Staging deployment successful
- [ ] Smoke tests passing
- [ ] Documentation updated

### Post-Launch
- [ ] User feedback collected
- [ ] Metrics monitored
- [ ] Bugs fixed
- [ ] Board updated
```

---

## 🔗 Quick Reference

| Task | Command | Location |
|------|---------|----------|
| Create spec | `touch docs/implementation/[SECTOR]_SPEC.md` | `/docs/implementation/` |
| Update board | `vim DEVELOPMENT_BOARD.md` | Root |
| Create backend module | `mkdir quant/simulations/[sector]` | `services/quant-engine/` |
| Create frontend component | `mkdir components/[sector]` | `apps/web/` |
| Create DB migration | `touch migrations/create_[sector]_tables.sql` | `services/data-pipeline/` |
| Run tests | `pytest` or `pnpm test` | Workspace root |
| Deploy to staging | `kubectl apply -f infra/kubernetes/` | Root |

---

## 🎓 Best Practices

### Code Quality
- ✅ Follow TypeScript/Python type hints
- ✅ Write tests (target: >80% coverage)
- ✅ Use conventional commits (`feat:`, `fix:`, etc.)
- ✅ Document all public APIs

### Performance
- ✅ Optimize database queries (use indexes)
- ✅ Cache expensive computations (Redis)
- ✅ Minimize API calls (batch requests)
- ✅ Use CDN for static assets

### Security
- ✅ Never commit secrets (use environment variables)
- ✅ Validate all user inputs
- ✅ Use parameterized queries (prevent SQL injection)
- ✅ Rate limit public APIs

### Collaboration
- ✅ Update board regularly
- ✅ Review PRs within 24 hours
- ✅ Communicate blockers early
- ✅ Document decisions (ADRs)

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API not responding | Check if service is running (`docker ps`) |
| Database connection error | Verify `DATABASE_URL` in `.env` |
| Import error | Install dependencies (`pip install -r requirements.txt`) |
| Tests failing | Clear cache and re-run (`pytest --cache-clear`) |
| Frontend not loading | Check CORS settings in backend |

### Getting Help

1. **Check Documentation:** Relevant team handbook
2. **Search Issues:** GitHub Issues tab
3. **Ask Team:** Team Slack channel
4. **Escalate:** Team Lead

---

**Last Updated:** 2025-10-31
