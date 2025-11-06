# Economic Ontology System - Nexus-Alpha Core

**Purpose:** Model cross-sector economic relationships and macro-variable impacts
**Version:** 1.0.0
**Status:** Architecture Definition (Core Framework)
**Date:** 2025-11-01

---

## 🎯 Core Concept

### What We're Building
NOT: Simple stock price simulator
YES: **Economic Relationship Graph** where sectors/companies influence each other

```
금리 인상 (2.5% → 3.0%)
    ↓
├─→ 은행 (Bank) ✅ 수익 증가
│   ├─ 대출금리 상승
│   ├─ 순이자마진(NIM) 확대
│   └─ 수익성 개선
│
├─→ 부동산(주택) (Real Estate) ❌ 수익 감소
│   ├─ 임차인 자금조달 비용 ↑
│   ├─ 부동산 수요 ↓
│   ├─ 대출금리 상승 → 이자비용 ↑
│   └─ 순이익 감소
│
├─→ 제조업 (Manufacturing) ❌ 수익 감소
│   ├─ 설비투자 자금조달 비용 ↑
│   ├─ 운영금 차입 비용 ↑
│   └─ 순이익 감소
│
└─→ 금융 회사들 간 관계도 형성
    ├─ 은행 수익↑ → 주식가격↑ → 배당↑
    ├─ 부동산 수익↓ → 주가↓ → 배당↓
    └─ 제조업 차입증가 → 은행 대출 포트폴리오 리스크↑
```

---

## 🏗️ Three-Layer Architecture

### Layer 1: Macro Variables (Shared)
변수들이 **모든 섹터에 영향**을 미치는 상위 계층

```typescript
interface MacroVariables {
  // Interest Rate Environment
  base_interest_rate: number;           // 기준금리 (영향: 모든 차입기업)
  treasury_yield_curve: Curve;          // 수익률곡선 (영향: 금리 예측)

  // Trade & Tariffs
  tariff_rate: number;                  // 관세율 (영향: 수입/수출 기업)
  trade_policy: string;                 // Free trade / Protectionist

  // Currency
  fx_rate: number;                      // 환율 (영향: 국제거래 기업)

  // Inflation
  inflation_rate: number;               // 물가상승률 (영향: 임금/원가)

  // Liquidity
  m2_money_supply: number;              // M2 통화량 (영향: 전체 경제)
  credit_spread: number;                // 신용스프레드 (영향: 기업 차입 가능성)

  // Tax Policy
  corporate_tax_rate: number;           // 법인세율 (영향: 순이익)
  depreciation_allowance: number;       // 감가상각 허용 (영향: 세금)
}
```

### Layer 2: Sector-Specific Variables
각 **섹터만 영향**받는 변수들

```typescript
// BANKING SECTOR
interface BankingSectorVariables {
  prime_lending_rate: number;           // 우대금리
  deposit_rate: number;                 // 예금금리
  loan_loss_provision_rate: number;     // 대손충당금율
  concentration_risk: number;           // 산업집중도 위험
  regulatory_capital_ratio: number;     // 자본적정성 규제
}

// REAL ESTATE SECTOR
interface RealEstateSectorVariables {
  property_price_index: number;         // 부동산 가격지수
  rental_yield_market: number;          // 시장 임대수익률
  occupancy_rate_avg: number;           // 평균 입주율
  construction_cost_index: number;      // 건설원가지수
  real_estate_transaction_tax: number;  // 부동산거래세
}

// MANUFACTURING SECTOR
interface ManufacturingSectorVariables {
  capacity_utilization: number;         // 가동률
  labor_cost_index: number;             // 노동비용지수
  raw_material_price_index: number;     // 원자재가격지수
  export_volume: number;                // 수출량
  inventory_level: number;              // 재고수준
}
```

### Layer 3: Company-Specific Variables
각 **개별 기업만**의 변수들

```typescript
interface CompanySpecificVariables {
  // Real Estate Company Example
  num_properties: number;               // 보유 부동산 수
  total_debt: number;                   // 총 부채
  debt_maturity_profile: Object;        // 부채 만기구조
  occupancy_rate: number;               // 입주율 (회사별)
  property_quality_score: number;       // 부동산 품질
  management_efficiency: number;        // 경영 효율성
  dividend_payout_ratio: number;        // 배당성향
}
```

---

## 🔗 Impact Chain Model

### How Macro Changes Flow Through Economy

```
Macro Variable Change
    ↓
Sector-Specific Impact
    ↓
Company-Specific Calculation
    ↓
Stock Price Impact
    ↓
Cross-Sector Relationships Updated
```

### Example: 금리 인상 (2.5% → 3.0%)

#### Step 1: Macro Change
```
BASE_INTEREST_RATE: 2.5% → 3.0%
Change: +0.5% (50 basis points)
```

#### Step 2: Sector Impact Calculation

**BANKING SECTOR:**
```python
def calculate_banking_impact(rate_change):
    # 은행은 금리 인상으로 수익 증가
    deposit_rate = base_deposit_rate + (rate_change * 0.3)  # 일부 전가
    lending_rate = base_lending_rate + (rate_change * 0.7)  # 대부분 전가

    net_interest_margin = lending_rate - deposit_rate
    # 이전: (5.0% - 2.0%) = 3.0%
    # 이후: (5.35% - 2.15%) = 3.2%
    # NIM 확대 = 순이자수익 증가 ✅

    return {
        'impact': 'POSITIVE',
        'magnitude': 6.7%,  # NIM 증가율
        'winners': ['은행주'],
        'losers': ['대출 의존 기업']
    }
```

**REAL ESTATE SECTOR:**
```python
def calculate_realestate_impact(rate_change):
    # 부동산은 금리 인상으로 수익 감소

    # 회사 A (60% 차입 비율)
    old_interest_expense = total_debt * 0.025
    new_interest_expense = total_debt * 0.030
    interest_burden_increase = new_interest_expense - old_interest_expense

    ebitda = 100  # 임대수익
    new_net_income = ebitda - new_interest_expense - opex
    # 이전: 100 - 15 (이자) - 40 (운영비) = 45
    # 이후: 100 - 18 (이자↑) - 40 (운영비) = 42
    # 순이익 감소: -3/45 = -6.7% ❌

    return {
        'impact': 'NEGATIVE',
        'magnitude': -6.7%,
        'winners': ['저부채 부동산'],
        'losers': ['고부채 부동산']
    }
```

**MANUFACTURING SECTOR:**
```python
def calculate_manufacturing_impact(rate_change):
    # 제조업: 운영금 차입 비용 증가

    working_capital_loan = 100
    new_interest_cost = working_capital_loan * 0.030

    # 금리 오를 때 설비투자 미루는 경향
    capex_reduction = capacity * 0.05  # 설비투자 5% 감소

    return {
        'impact': 'NEGATIVE',
        'magnitude': -4.2%,  # 적은 영향 (차입 비중 낮음)
        'winners': [],
        'losers': ['고성장 기업 (투자↓)'],
        'delayed_impact': 'Capacity 문제 발생 가능'
    }
```

#### Step 3: Cross-Sector Relationships Update

```
은행 수익↑
    ↓
┌─→ 은행 주가↑
├─→ 은행 배당↑
└─→ 부동산 기업들의 차입 비용 상승
    ├─→ 부동산 기업 순이익↓
    ├─→ 부동산 기업 주가↓
    └─→ 부동산 보유 투자자들 손실
        ↓
    (은행과 부동산의 상반된 영향 발생!)
```

---

## 👥 Market Structuring Team Role

### Team Responsibilities

```
Market Structuring Team
├── 1. Macro Variable Identification
│   ├─ 어떤 변수가 영향을 주나? (금리, 관세, etc)
│   ├─ 각 변수의 범위는? (금리 0-10%)
│   └─ 변수들 간 상관관계는? (금리↑ → 환율?)
│
├── 2. Sector Impact Analysis
│   ├─ 각 섹터가 어떤 매크로 변수에 민감한가?
│   ├─ 각 섹터 내 회사들의 민감도 차이
│   └─ 섹터 간 상충관계 (은행 vs 부동산)
│
├── 3. Company-Level Sensitivity
│   ├─ 개별 회사의 특정 변수에 대한 민감도
│   ├─ 회사별 차입 비율, 구조 파악
│   └─ 회사별 노출 (Exposure) 계산
│
├── 4. Knowledge Graph Construction
│   ├─ "금리 ↑" → [영향받는 모든 회사/섹터]
│   ├─ "회사 A 부채 ↑" → [영향받는 다른 회사들]
│   └─ 영향의 크기, 방향, 시간차 정의
│
└── 5. Shared Knowledge Base Maintenance
    ├─ Core Engine (Quant): 계산 로직
    ├─ Side Memory (Database): 구조적 정보
    │   ├─ 어떤 회사가 어떤 변수에 민감?
    │   ├─ 섹터 간 관계는?
    │   └─ 과거 영향 패턴?
    └─ Update 메커니즘: 새로운 관계 발견 시
```

---

## 📊 Stock Ontology Graph

### Knowledge Representation

```
변수 (Variables)
├─ Macro: interest_rate, tariff_rate, inflation_rate, ...
├─ Sector: property_price_index, capacity_utilization, ...
└─ Company: total_debt, occupancy_rate, ...

기업 (Companies)
├─ Bank (은행)
│   ├─ 부동산 대출 포트폴리오
│   ├─ 제조업 대출 포트폴리오
│   └─ 순이자마진 (금리 민감)
├─ RealEstate (부동산)
│   ├─ 부채 비율 (금리 민감)
│   └─ 임대 수익 (금리↓ 영향)
└─ Manufacturing (제조)
    ├─ 운영금 차입 (금리 민감)
    └─ 설비투자 (금리 민감)

관계 (Relations)
├─ Causal Relations
│   ├─ 금리↑ → 은행 수익↑
│   ├─ 금리↑ → 부동산 비용↑
│   └─ 은행 수익↑ → 부동산 회사 차입 비용↑
│
└─ Dependency Relations
    ├─ 부동산 회사 → 은행에 의존 (차입)
    ├─ 제조업 회사 → 은행에 의존
    └─ 은행 수익성 → 신용공급 여유도
```

### Example Query (향후 구현)
```python
# Q: "금리가 3%로 오르면 누가 가장 영향을 받나?"
query = {
    "variable": "interest_rate",
    "value": 3.0,
    "operation": "increase_to"
}

result = ontology.query(query)
# Output:
# [
#   {"company": "은행A", "impact": "+8.5%", "reason": "NIM 확대"},
#   {"company": "부동산A", "impact": "-6.7%", "reason": "이자비용 증가"},
#   {"company": "제조업A", "impact": "-3.2%", "reason": "운영금 차입↑"},
#   ...
# ]

# Q: "부동산A가 채무 불이행하면?"
query = {
    "company": "부동산A",
    "scenario": "default"
}

result = ontology.query(query)
# Output:
# [
#   {"affected_company": "은행B", "exposure": "$50M", "impact": "-2.1%"},
#   {"affected_company": "건설사C", "exposure": "payment_delay", "impact": "cash_flow_issue"},
#   ...
# ]
```

---

## 🔄 Development Phases

### Phase 1: Core Framework (지금)
**목표:** 금리 중심으로 은행 vs 부동산 모델링

```
Week 1-2: Ontology Definition
├─ Macro Variables 정의 (금리 중심)
├─ Banking Sector 모델 정의
├─ Real Estate Sector 모델 정의
└─ Cross-sector Relationship 정의

Week 2-3: Market Structuring
├─ 은행과 부동산의 상반 관계 분석
├─ 각 회사별 민감도 데이터 수집
├─ Knowledge base 구축
└─ Impact calculation formula 개발

Week 3-4: Integration & Validation
├─ Core Quant Engine에 통합
├─ 실제 기업 데이터로 검증
├─ UI에 연결
└─ 1차 완성
```

### Phase 2: Multi-Sector Extension
**목표:** 관세, 환율 등 추가 변수 + 제조업 통합

```
Manufacturing Sector 추가
├─ 관세율 영향 모델
├─ 원자재 가격 민감도
└─ 은행/부동산과의 관계
```

### Phase 3: Full Economic Model
**목표:** 모든 주요 경제 변수 + 모든 섹터

```
완전한 경제 시뮬레이션
├─ 모든 Macro Variable 지원
├─ 모든 주요 섹터 포함
├─ 회사 간 거래 관계 모델
└─ 피드백 루프 (A의 문제 → B 문제 → 다시 A로)
```

---

## 💾 System Architecture

### Data Layer
```
PostgreSQL Database
├── macro_variables (금리, 관세, 환율, etc)
├── sector_definitions (각 섹터의 특성)
├── company_financials (회사별 재무정보)
├── relationships (회사/섹터 간 관계)
└── impact_history (과거 영향 패턴)
```

### Processing Layer
```
Market Structuring Engine
├── Macro Variable Parser
├── Sector Impact Calculator
├── Company-Level Aggregator
└── Relationship Graph Updater
```

### Quant Engine
```
Financial Model Calculator
├── Interest Expense Calculator (금리 기반)
├── Revenue/Cost Impact Model
├── Stock Price Estimator
└── Health Score Calculator
```

### Memory/Cache Layer
```
Redis Cache (Side Memory)
├── Recent Calculations
├── Relationship Graph (frequently accessed)
├── Company Sensitivity Scores
└── Sector Correlation Matrix
```

---

## 👥 Team Structure Change

### Current (Wrong)
```
Team Quant: Simulation 계산만
Team Data: 데이터 수집만
Team SimViz: 시각화만
```

### Corrected (Right)
```
Team Quant (Core Calculations)
├─ Financial model logic

Market Structuring Team (NEW!) ← 핵심
├─ 매크로 변수와 섹터의 관계 분석
├─ 회사 간 영향 관계 정의
├─ Knowledge base 관리

Team Data (Enhanced)
├─ Macro data (금리, 관세, etc)
├─ Sector data (부동산 가격, etc)
├─ Company financials (대출 구조, etc)
└─ Relationship data (new)

Team SimViz (Enhanced)
├─ 기본 시각화
├─ Circuit diagram (기업 내부 자금흐름)
├─ Cross-sector relationship diagram (NEW!)
└─ Impact visualization

Team UI (Enhanced)
├─ 매크로 변수 조정 UI
├─ 섹터별 영향 대시보드
├─ 기업 간 관계 네트워크 (NEW!)
└─ 영향 체인 시각화
```

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- [ ] 금리를 2.5% → 3.5%로 올리면
  - [ ] 은행 수익이 +6-8% 증가하는 것을 정확히 계산
  - [ ] 부동산 기업 수익이 -5-7% 감소하는 것을 정확히 계산
  - [ ] 왜인지를 circuit diagram으로 보여줄 수 있음
  - [ ] 각 기업별로 차이나는 이유를 설명 가능

- [ ] 관세를 추가하면
  - [ ] 수입 제조업에 영향
  - [ ] 은행의 export 대출 포트폴리오에 영향
  - [ ] 연쇄 효과까지 계산

---

## 📝 Next Documents to Create

1. `MACRO_VARIABLES_DEFINITION.md` - 모든 매크로 변수 정의
2. `SECTOR_IMPACT_MODEL.md` - 각 섹터별 영향 공식
3. `COMPANY_ONTOLOGY_SCHEMA.md` - 회사 데이터 구조
4. `RELATIONSHIP_GRAPH_SPEC.md` - 기업 간 관계 정의
5. `MARKET_STRUCTURING_TEAM_GUIDE.md` - 팀 역할 상세

---

**This is the correct architecture. Everything else builds on this.**

