# 🏢 부동산 섹터 파일럿 프로젝트: 개발 가이드라인

**Project:** Nexus-Alpha - Real Estate Financial Simulation Module
**Status:** Phase 1 - Pilot Implementation
**Date:** 2025-10-31

---

## 🎯 프로젝트 목표

부동산 섹터를 **첫 번째 구현 사례**로 삼아, 다음을 달성:

1. **재무 건전성 분석**: 부동산 기업들의 재무제표 기반 건전성 평가
2. **금리 영향 시뮬레이션**: 금리 변동 시 이자비용, 순이익, ICR 변화 계산
3. **3D 네트워크 시각화**: Three.js 기반 기업-은행 간 부채 관계도
4. **인터랙티브 조작**: 금리 슬라이더로 실시간 시뮬레이션 결과 확인
5. **Value Chain Mapping**: 자본 흐름 (은행 → 부동산 기업 → 임대수익) 시각화

이 파일럿을 성공시킨 후, **다른 섹터(제조업, IT, 에너지 등)**로 확장.

---

## 📊 부동산 섹터 분석 프레임워크

### 1. 핵심 재무 지표

#### Input (기업 재무 데이터)
```typescript
interface RealEstateCompany {
  // 기본 정보
  company_id: string;
  company_name: string;
  sector: 'REIT' | 'Construction' | 'Developer' | 'Property_Management';

  // 재무 데이터 (단위: 백만원)
  total_assets: number;           // 총자산
  total_liabilities: number;      // 총부채
  equity: number;                 // 자본

  // 손익계산서
  revenue: number;                // 매출액 (임대수익 + 매각수익)
  operating_expense: number;      // 영업비용 (관리비, 인건비 등)
  interest_expense: number;       // 이자비용
  net_income: number;             // 순이익

  // 부채 구조
  bank_loans: {
    bank_id: string;
    bank_name: string;
    loan_amount: number;          // 대출금액
    interest_rate: number;        // 현재 금리 (%)
    loan_type: 'Fixed' | 'Variable';  // 고정/변동금리
    collateral_value: number;     // 담보 부동산 가치
  }[];

  // 부동산 포트폴리오
  properties: {
    property_id: string;
    property_type: 'Office' | 'Retail' | 'Residential' | 'Industrial';
    location: string;
    value: number;                // 부동산 가치
    rental_income: number;        // 연간 임대수익
    occupancy_rate: number;       // 임차율 (%)
  }[];
}
```

#### Output (시뮬레이션 결과)
```typescript
interface SimulationResult {
  scenario: {
    new_interest_rate: number;    // 새로운 기준금리 (%)
    rate_change: number;          // 금리 변화 (bp)
  };

  company_results: {
    company_id: string;
    company_name: string;

    // 금리 영향
    old_interest_expense: number;
    new_interest_expense: number;
    expense_increase: number;     // 이자비용 증가액

    // 수익성 변화
    old_net_income: number;
    new_net_income: number;
    income_change_pct: number;    // 순이익 증감률 (%)

    // 건전성 지표
    old_icr: number;              // 기존 이자보상비율
    new_icr: number;              // 새로운 ICR
    debt_ratio: number;           // 부채비율 (%)

    // 종합 평가
    health_score: number;         // 건전성 점수 (0-100)
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';

    // 재무 안정성
    is_distressed: boolean;       // 부실 가능성
    default_probability: number;  // 부도 확률 (%)
  }[];

  // 집계 통계
  summary: {
    total_companies: number;
    companies_at_risk: number;    // 위험 기업 수
    total_loan_amount: number;    // 총 대출금액
    total_interest_impact: number; // 총 이자비용 증가
    avg_health_score: number;     // 평균 건전성 점수
  };

  // 네트워크 그래프 데이터
  network: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  };
}
```

### 2. 계산 로직

#### 금리 영향 계산
```python
# quant-engine/quant/simulations/real_estate.py

def calculate_interest_rate_impact(company: dict, new_rate: float) -> dict:
    """
    금리 변동에 따른 재무 영향 계산

    Args:
        company: 기업 재무 데이터
        new_rate: 새로운 기준금리 (%)

    Returns:
        계산된 재무 지표
    """

    # 1. 이자비용 계산
    old_expense = 0
    new_expense = 0

    for loan in company['bank_loans']:
        if loan['loan_type'] == 'Variable':
            # 변동금리 대출: 기준금리 변화 반영
            old_rate = loan['interest_rate']
            rate_change = new_rate - company['base_rate']
            new_loan_rate = old_rate + rate_change

            old_expense += loan['loan_amount'] * (old_rate / 100)
            new_expense += loan['loan_amount'] * (new_loan_rate / 100)
        else:
            # 고정금리 대출: 변화 없음
            expense = loan['loan_amount'] * (loan['interest_rate'] / 100)
            old_expense += expense
            new_expense += expense

    # 2. 순이익 계산
    revenue = company['revenue']
    operating_expense = company['operating_expense']

    old_net_income = revenue - operating_expense - old_expense
    new_net_income = revenue - operating_expense - new_expense

    # 3. 이자보상비율 (ICR) 계산
    ebit = revenue - operating_expense  # 영업이익

    old_icr = ebit / old_expense if old_expense > 0 else float('inf')
    new_icr = ebit / new_expense if new_expense > 0 else float('inf')

    # 4. 부채비율
    debt_ratio = (company['total_liabilities'] / company['equity']) * 100

    # 5. 건전성 점수 계산 (0-100)
    health_score = calculate_health_score(new_icr, debt_ratio, new_net_income)

    # 6. 위험도 평가
    risk_level = classify_risk(health_score, new_icr)

    # 7. 부도 확률 예측 (로지스틱 회귀 모델)
    default_prob = predict_default_probability(
        icr=new_icr,
        debt_ratio=debt_ratio,
        net_income=new_net_income,
        total_assets=company['total_assets']
    )

    return {
        'old_interest_expense': old_expense,
        'new_interest_expense': new_expense,
        'expense_increase': new_expense - old_expense,
        'old_net_income': old_net_income,
        'new_net_income': new_net_income,
        'income_change_pct': ((new_net_income - old_net_income) / old_net_income) * 100,
        'old_icr': old_icr,
        'new_icr': new_icr,
        'debt_ratio': debt_ratio,
        'health_score': health_score,
        'risk_level': risk_level,
        'is_distressed': health_score < 40 or new_icr < 1.0,
        'default_probability': default_prob,
    }


def calculate_health_score(icr: float, debt_ratio: float, net_income: float) -> float:
    """
    재무 건전성 점수 계산 (0-100)

    평가 기준:
    - ICR (40점): > 3.0 (40점), 1.5-3.0 (20점), < 1.5 (0점)
    - 부채비율 (30점): < 100% (30점), 100-200% (15점), > 200% (0점)
    - 순이익 (30점): 흑자 (30점), 적자 (0점)
    """
    score = 0

    # ICR 평가 (40점)
    if icr >= 3.0:
        score += 40
    elif icr >= 1.5:
        score += 20 + ((icr - 1.5) / 1.5) * 20
    else:
        score += (icr / 1.5) * 20

    # 부채비율 평가 (30점)
    if debt_ratio < 100:
        score += 30
    elif debt_ratio < 200:
        score += 30 - ((debt_ratio - 100) / 100) * 15
    else:
        score += max(0, 15 - ((debt_ratio - 200) / 100) * 5)

    # 순이익 평가 (30점)
    if net_income > 0:
        score += 30
    else:
        score += 0

    return min(100, max(0, score))


def classify_risk(health_score: float, icr: float) -> str:
    """위험도 분류"""
    if health_score >= 70 and icr >= 2.0:
        return 'Low'
    elif health_score >= 50 and icr >= 1.5:
        return 'Medium'
    elif health_score >= 30 and icr >= 1.0:
        return 'High'
    else:
        return 'Critical'
```

---

## 🏗️ 개발 단계별 가이드

### **Phase 1: 백엔드 - 시뮬레이션 엔진 구축 (Week 1-2)**

#### Step 1.1: Quant Engine 시뮬레이션 모듈 개발

**담당 팀:** Team Quant (Lead + Senior Quant Engineer)

**작업 내용:**
```bash
cd services/quant-engine

# 1. 부동산 시뮬레이션 모듈 생성
mkdir -p quant/simulations/real_estate
touch quant/simulations/real_estate/__init__.py
touch quant/simulations/real_estate/interest_rate_impact.py
touch quant/simulations/real_estate/health_score.py
touch quant/simulations/real_estate/default_prediction.py
```

**파일 1: 금리 영향 시뮬레이션**
```python
# quant/simulations/real_estate/interest_rate_impact.py

from typing import List, Dict
import numpy as np
from dataclasses import dataclass

@dataclass
class LoanInfo:
    bank_id: str
    bank_name: str
    loan_amount: float
    interest_rate: float
    loan_type: str  # 'Fixed' or 'Variable'

@dataclass
class RealEstateCompany:
    company_id: str
    company_name: str
    sector: str
    revenue: float
    operating_expense: float
    total_liabilities: float
    equity: float
    bank_loans: List[LoanInfo]
    base_rate: float  # 현재 기준금리

class RealEstateSimulator:
    """부동산 섹터 금리 영향 시뮬레이터"""

    def __init__(self, companies: List[RealEstateCompany]):
        self.companies = companies

    def simulate(self, new_rate: float) -> Dict:
        """
        금리 변동 시뮬레이션 실행

        Args:
            new_rate: 새로운 기준금리 (%)

        Returns:
            시뮬레이션 결과 딕셔너리
        """
        results = []

        for company in self.companies:
            result = self._calculate_company_impact(company, new_rate)
            results.append(result)

        # 집계 통계 계산
        summary = self._calculate_summary(results)

        # 네트워크 그래프 데이터 생성
        network = self._generate_network_data(results)

        return {
            'scenario': {
                'new_interest_rate': new_rate,
                'rate_change': (new_rate - self.companies[0].base_rate) * 100,  # bp
            },
            'company_results': results,
            'summary': summary,
            'network': network,
        }

    def _calculate_company_impact(self, company: RealEstateCompany, new_rate: float) -> Dict:
        """개별 기업 영향 계산"""

        # 1. 이자비용 계산
        old_expense = 0
        new_expense = 0

        for loan in company.bank_loans:
            if loan.loan_type == 'Variable':
                rate_change = new_rate - company.base_rate
                old_expense += loan.loan_amount * (loan.interest_rate / 100)
                new_expense += loan.loan_amount * ((loan.interest_rate + rate_change) / 100)
            else:
                expense = loan.loan_amount * (loan.interest_rate / 100)
                old_expense += expense
                new_expense += expense

        # 2. 순이익 계산
        ebit = company.revenue - company.operating_expense
        old_net_income = ebit - old_expense
        new_net_income = ebit - new_expense

        # 3. ICR 계산
        old_icr = ebit / old_expense if old_expense > 0 else float('inf')
        new_icr = ebit / new_expense if new_expense > 0 else float('inf')

        # 4. 부채비율
        debt_ratio = (company.total_liabilities / company.equity) * 100

        # 5. 건전성 점수
        health_score = self._calculate_health_score(new_icr, debt_ratio, new_net_income)

        # 6. 위험도
        risk_level = self._classify_risk(health_score, new_icr)

        return {
            'company_id': company.company_id,
            'company_name': company.company_name,
            'sector': company.sector,
            'old_interest_expense': old_expense,
            'new_interest_expense': new_expense,
            'expense_increase': new_expense - old_expense,
            'old_net_income': old_net_income,
            'new_net_income': new_net_income,
            'income_change_pct': ((new_net_income - old_net_income) / old_net_income * 100) if old_net_income != 0 else 0,
            'old_icr': old_icr,
            'new_icr': new_icr,
            'debt_ratio': debt_ratio,
            'health_score': health_score,
            'risk_level': risk_level,
            'is_distressed': health_score < 40 or new_icr < 1.0,
        }

    def _calculate_health_score(self, icr: float, debt_ratio: float, net_income: float) -> float:
        """건전성 점수 계산 (0-100)"""
        score = 0

        # ICR (40점)
        if icr >= 3.0:
            score += 40
        elif icr >= 1.5:
            score += 20 + ((icr - 1.5) / 1.5) * 20
        else:
            score += min(20, (icr / 1.5) * 20)

        # 부채비율 (30점)
        if debt_ratio < 100:
            score += 30
        elif debt_ratio < 200:
            score += 30 - ((debt_ratio - 100) / 100) * 15
        else:
            score += max(0, 15 - ((debt_ratio - 200) / 100) * 5)

        # 순이익 (30점)
        score += 30 if net_income > 0 else 0

        return min(100, max(0, score))

    def _classify_risk(self, health_score: float, icr: float) -> str:
        """위험도 분류"""
        if health_score >= 70 and icr >= 2.0:
            return 'Low'
        elif health_score >= 50 and icr >= 1.5:
            return 'Medium'
        elif health_score >= 30 and icr >= 1.0:
            return 'High'
        else:
            return 'Critical'

    def _calculate_summary(self, results: List[Dict]) -> Dict:
        """집계 통계"""
        return {
            'total_companies': len(results),
            'companies_at_risk': sum(1 for r in results if r['risk_level'] in ['High', 'Critical']),
            'total_interest_impact': sum(r['expense_increase'] for r in results),
            'avg_health_score': np.mean([r['health_score'] for r in results]),
        }

    def _generate_network_data(self, results: List[Dict]) -> Dict:
        """네트워크 그래프 데이터 생성"""
        nodes = []
        edges = []

        # 기업 노드 생성
        for result in results:
            nodes.append({
                'id': result['company_id'],
                'name': result['company_name'],
                'type': 'company',
                'sector': result['sector'],
                'health_score': result['health_score'],
                'risk_level': result['risk_level'],
            })

        # 은행-기업 간 엣지 생성 (실제 대출 데이터 필요)
        # TODO: 은행 데이터 연동 후 구현

        return {'nodes': nodes, 'edges': edges}
```

**파일 2: FastAPI 엔드포인트**
```python
# app/api/v1/routes/real_estate_simulation.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from quant.simulations.real_estate.interest_rate_impact import (
    RealEstateSimulator, RealEstateCompany, LoanInfo
)

router = APIRouter()

class LoanRequest(BaseModel):
    bank_id: str
    bank_name: str
    loan_amount: float
    interest_rate: float
    loan_type: str

class CompanyRequest(BaseModel):
    company_id: str
    company_name: str
    sector: str
    revenue: float
    operating_expense: float
    total_liabilities: float
    equity: float
    bank_loans: List[LoanRequest]
    base_rate: float

class SimulationRequest(BaseModel):
    new_rate: float
    companies: List[CompanyRequest]

@router.post("/real-estate/interest-rate")
async def simulate_real_estate_interest_rate(request: SimulationRequest):
    """
    부동산 섹터 금리 영향 시뮬레이션

    Example:
    ```
    POST /api/v1/simulations/real-estate/interest-rate
    {
        "new_rate": 4.5,
        "companies": [
            {
                "company_id": "re001",
                "company_name": "신한리츠",
                "sector": "REIT",
                "revenue": 50000,
                "operating_expense": 15000,
                "total_liabilities": 200000,
                "equity": 100000,
                "base_rate": 3.5,
                "bank_loans": [
                    {
                        "bank_id": "kb",
                        "bank_name": "KB국민은행",
                        "loan_amount": 100000,
                        "interest_rate": 4.0,
                        "loan_type": "Variable"
                    }
                ]
            }
        ]
    }
    ```
    """
    try:
        # Pydantic → dataclass 변환
        companies = []
        for comp in request.companies:
            loans = [LoanInfo(**loan.dict()) for loan in comp.bank_loans]
            company = RealEstateCompany(
                company_id=comp.company_id,
                company_name=comp.company_name,
                sector=comp.sector,
                revenue=comp.revenue,
                operating_expense=comp.operating_expense,
                total_liabilities=comp.total_liabilities,
                equity=comp.equity,
                bank_loans=loans,
                base_rate=comp.base_rate,
            )
            companies.append(company)

        # 시뮬레이션 실행
        simulator = RealEstateSimulator(companies)
        result = simulator.simulate(request.new_rate)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**FastAPI 앱에 라우터 등록**
```python
# app/main.py (수정)

from app.api.v1.routes import real_estate_simulation

app.include_router(
    real_estate_simulation.router,
    prefix="/api/v1/simulations",
    tags=["real-estate"]
)
```

#### Step 1.2: 테스트

```bash
# 서버 실행
uvicorn app.main:app --reload --port 8000

# 테스트 요청
curl -X POST "http://localhost:8000/api/v1/simulations/real-estate/interest-rate" \
  -H "Content-Type: application/json" \
  -d '{
    "new_rate": 4.5,
    "companies": [
      {
        "company_id": "re001",
        "company_name": "신한리츠",
        "sector": "REIT",
        "revenue": 50000,
        "operating_expense": 15000,
        "total_liabilities": 200000,
        "equity": 100000,
        "base_rate": 3.5,
        "bank_loans": [
          {
            "bank_id": "kb",
            "bank_name": "KB국민은행",
            "loan_amount": 100000,
            "interest_rate": 4.0,
            "loan_type": "Variable"
          }
        ]
      }
    ]
  }'
```

---

### **Phase 2: 프론트엔드 - 3D 시각화 구축 (Week 2-3)**

#### Step 2.1: SimViz Service - 네트워크 그래프 생성

**담당 팀:** Team SimViz (3D Specialist + Python Engineer)

**작업 내용:**
```bash
cd services/simviz-service/backend

# 네트워크 그래프 생성 모듈
mkdir -p app/services/real_estate
touch app/services/real_estate/__init__.py
touch app/services/real_estate/network_generator.py
```

**파일: 네트워크 그래프 생성기**
```python
# app/services/real_estate/network_generator.py

import networkx as nx
from typing import List, Dict

class RealEstateNetworkGenerator:
    """부동산 섹터 네트워크 그래프 생성"""

    def generate_debt_network(self, simulation_result: Dict) -> Dict:
        """
        부채 관계 네트워크 생성

        Args:
            simulation_result: Quant Engine에서 받은 시뮬레이션 결과

        Returns:
            D3.js 호환 네트워크 데이터
        """
        G = nx.DiGraph()

        # 노드 추가 (기업)
        for company in simulation_result['company_results']:
            G.add_node(
                company['company_id'],
                name=company['company_name'],
                type='company',
                sector=company['sector'],
                health_score=company['health_score'],
                risk_level=company['risk_level'],
                total_debt=company['new_interest_expense'] * 20,  # 추정
                net_income=company['new_net_income'],
            )

        # 은행 노드 추가 (실제 데이터에서 추출 필요)
        # TODO: 실제 은행 데이터 연동
        banks = self._extract_banks(simulation_result)
        for bank in banks:
            G.add_node(
                bank['bank_id'],
                name=bank['bank_name'],
                type='bank',
                total_loans=bank['total_loans'],
            )

        # 엣지 추가 (대출 관계)
        edges = self._extract_loan_edges(simulation_result)
        for edge in edges:
            G.add_edge(
                edge['bank_id'],
                edge['company_id'],
                loan_amount=edge['loan_amount'],
                interest_rate=edge['interest_rate'],
                loan_type=edge['loan_type'],
            )

        # D3.js 형식으로 변환
        return self._to_d3_format(G)

    def _extract_banks(self, simulation_result: Dict) -> List[Dict]:
        """시뮬레이션 결과에서 은행 정보 추출"""
        # TODO: 실제 구현
        return [
            {'bank_id': 'kb', 'bank_name': 'KB국민은행', 'total_loans': 1000000},
            {'bank_id': 'shinhan', 'bank_name': '신한은행', 'total_loans': 800000},
        ]

    def _extract_loan_edges(self, simulation_result: Dict) -> List[Dict]:
        """대출 관계 추출"""
        # TODO: 실제 구현 (현재는 더미 데이터)
        return [
            {
                'bank_id': 'kb',
                'company_id': 're001',
                'loan_amount': 100000,
                'interest_rate': 4.0,
                'loan_type': 'Variable'
            }
        ]

    def _to_d3_format(self, G: nx.DiGraph) -> Dict:
        """NetworkX → D3.js 포맷 변환"""
        nodes = []
        for node_id, data in G.nodes(data=True):
            nodes.append({
                'id': node_id,
                **data
            })

        links = []
        for source, target, data in G.edges(data=True):
            links.append({
                'source': source,
                'target': target,
                **data
            })

        return {'nodes': nodes, 'links': links}
```

**FastAPI 엔드포인트**
```python
# app/api/v1/routes/real_estate_viz.py

from fastapi import APIRouter, HTTPException
from app.services.real_estate.network_generator import RealEstateNetworkGenerator
import httpx

router = APIRouter()

@router.post("/real-estate/network")
async def generate_real_estate_network(simulation_request: dict):
    """
    부동산 네트워크 그래프 생성

    Steps:
    1. Quant Engine에 시뮬레이션 요청
    2. 결과를 받아 네트워크 그래프 생성
    3. D3.js 호환 데이터 반환
    """
    try:
        # 1. Quant Engine 호출
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://quant-engine:8000/api/v1/simulations/real-estate/interest-rate",
                json=simulation_request,
                timeout=30.0
            )
            simulation_result = response.json()

        # 2. 네트워크 그래프 생성
        generator = RealEstateNetworkGenerator()
        network = generator.generate_debt_network(simulation_result)

        # 3. 시뮬레이션 결과 + 네트워크 데이터 반환
        return {
            'simulation': simulation_result,
            'network': network,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

#### Step 2.2: 프론트엔드 - 3D 시각화 컴포넌트

**담당 팀:** Team UI (Frontend Architect + Senior FE)

**작업 내용:**
```bash
cd apps/web

# 부동산 시뮬레이션 페이지 생성
mkdir -p app/\(dashboard\)/real-estate
touch app/\(dashboard\)/real-estate/page.tsx

# 컴포넌트 생성
mkdir -p components/real-estate
touch components/real-estate/InterestRateSimulator.tsx
touch components/real-estate/DebtNetworkGraph.tsx
touch components/real-estate/CompanyHealthTable.tsx
touch components/real-estate/SimulationControls.tsx
```

**컴포넌트 1: 금리 시뮬레이터 (메인)**
```tsx
// components/real-estate/InterestRateSimulator.tsx
'use client';

import { useState } from 'react';
import { DebtNetworkGraph } from './DebtNetworkGraph';
import { CompanyHealthTable } from './CompanyHealthTable';
import { SimulationControls } from './SimulationControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SimulationResult {
  scenario: {
    new_interest_rate: number;
    rate_change: number;
  };
  company_results: any[];
  summary: any;
  network: {
    nodes: any[];
    links: any[];
  };
}

export const InterestRateSimulator = () => {
  const [interestRate, setInterestRate] = useState(3.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);

    try {
      // SimViz Service 호출
      const response = await fetch('http://localhost:8001/api/v1/viz/real-estate/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_rate: interestRate,
          companies: [
            {
              company_id: 're001',
              company_name: '신한리츠',
              sector: 'REIT',
              revenue: 50000,
              operating_expense: 15000,
              total_liabilities: 200000,
              equity: 100000,
              base_rate: 3.5,
              bank_loans: [
                {
                  bank_id: 'kb',
                  bank_name: 'KB국민은행',
                  loan_amount: 100000,
                  interest_rate: 4.0,
                  loan_type: 'Variable',
                },
              ],
            },
            // 더 많은 기업 데이터 추가...
          ],
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101015] p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">
          부동산 섹터 금리 영향 시뮬레이션
        </h1>
        <p className="text-[#A9A9A9]">
          금리 변동에 따른 부동산 기업 재무 건전성 분석
        </p>
      </div>

      {/* 시뮬레이션 컨트롤 */}
      <Card className="bg-[#1B1B22] border-[#33333F] p-6 mb-8">
        <SimulationControls
          interestRate={interestRate}
          onRateChange={setInterestRate}
          onSimulate={runSimulation}
          isSimulating={isSimulating}
        />
      </Card>

      {/* 결과 시각화 */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D 네트워크 그래프 */}
          <Card className="bg-[#1B1B22] border-[#33333F] p-6">
            <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
              부채 관계 네트워크
            </h2>
            <DebtNetworkGraph
              nodes={result.network.nodes}
              links={result.network.links}
            />
          </Card>

          {/* 기업 건전성 테이블 */}
          <Card className="bg-[#1B1B22] border-[#33333F] p-6">
            <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
              기업별 재무 영향
            </h2>
            <CompanyHealthTable companies={result.company_results} />
          </Card>
        </div>
      )}

      {/* 요약 통계 */}
      {result && (
        <Card className="bg-[#1B1B22] border-[#33333F] p-6 mt-8">
          <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-4">
            시뮬레이션 요약
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[#A9A9A9] text-sm">총 기업 수</p>
              <p className="text-3xl font-bold text-[#00E5FF]">
                {result.summary.total_companies}
              </p>
            </div>
            <div>
              <p className="text-[#A9A9A9] text-sm">위험 기업 수</p>
              <p className="text-3xl font-bold text-[#FF1744]">
                {result.summary.companies_at_risk}
              </p>
            </div>
            <div>
              <p className="text-[#A9A9A9] text-sm">평균 건전성 점수</p>
              <p className="text-3xl font-bold text-[#39FF14]">
                {result.summary.avg_health_score.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-[#A9A9A9] text-sm">총 이자비용 증가</p>
              <p className="text-3xl font-bold text-[#E6007A]">
                {(result.summary.total_interest_impact / 1000).toFixed(1)}B
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
```

**(계속됩니다 - 다음 메시지에서 나머지 컴포넌트와 배포 가이드 작성)**