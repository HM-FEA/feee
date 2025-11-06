# Multi-Level Economic Ontology System

**Purpose:** Model economic relationships across 4 levels - from macro variables to product-level cost structures
**Complexity Level:** Advanced
**Date:** 2025-11-01

---

## 🎯 Overview: 4-Level Ontology

```
┌─────────────────────────────────────────────────┐
│ Level 1: MACRO VARIABLES                        │
│ (금리, 관세, 환율, 인플레이션, 유동성)          │
│ Impact: 모든 하위 레벨에 영향                   │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Level 2: SECTOR RELATIONSHIPS                   │
│ (은행 vs 부동산 vs 제조업 vs 기술)              │
│ Impact: 섹터 간 상승/상충 효과                  │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Level 3: COMPANY RELATIONSHIPS                  │
│ (삼성-엔비디아, 애플-TSMC, 부동산-은행)        │
│ Impact: 기업 간 공급/수요/금융 관계             │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ Level 4: PRODUCT & COST STRUCTURE               │
│ (아이폰 부품단가, 제조원가, 마진율)            │
│ Impact: 최종 수익성에 직결                      │
└─────────────────────────────────────────────────┘
```

---

## 📐 Level 1: Macro Variables

### Definition
**Global economic variables that affect ALL sectors and companies**

```typescript
interface MacroVariables {
  // Interest Rate Environment
  base_interest_rate: number;           // 기준금리
  treasury_yield_curve: number[];       // 수익률곡선

  // Trade Environment
  tariff_rate: number;                  // 관세율
  trade_policy: "free" | "protectionist";

  // Currency
  exchange_rate: number;                // KRW/USD exchange rate
  currency_volatility: number;          // FX volatility

  // Inflation
  inflation_rate: number;               // 소비자물가상승률
  wage_inflation_rate: number;          // 임금상승률
  commodity_price_index: number;        // 원자재가격지수

  // Liquidity
  m2_money_supply: number;              // M2 통화량
  credit_spread: number;                // 신용스프레드
  repo_rate: number;                    // 환매조건부매매금리

  // Policy
  corporate_tax_rate: number;           // 법인세율
  capital_gains_tax_rate: number;       // 양도소득세
}
```

### Impact Pattern
```
금리 ↑ 0.5%
├─→ 모든 부채기업의 이자비용 ↑
├─→ 은행의 NIM ↑ (긍정)
├─→ 부동산의 이자비용 ↑ (부정)
├─→ 제조업의 운영금 비용 ↑ (부정)
└─→ 환율 영향 (통상 KRW weak → export +, import -)
```

---

## 🏢 Level 2: Sector Relationships

### Definition
**How macro variables affect each sector differently, and how sectors interact with each other**

```typescript
interface SectorRelationships {
  // Banking Sector
  banking: {
    affected_by: ["interest_rate", "credit_spread", "economic_growth"],
    sensitivity: {
      interest_rate: +0.5,      // 금리 0.1% 오르면 NIM 0.05% 증가
      default_rate: -0.8,       // 경기 약할수록 대손 증가
    },
    provides_to: ["all_sectors"], // 모든 기업에 자금 제공
  },

  // Real Estate Sector
  realestate: {
    affected_by: ["interest_rate", "inflation", "wage_inflation"],
    sensitivity: {
      interest_rate: -0.6,      // 금리 0.1% 오르면 수익 0.06% 감소
      wage_inflation: -0.3,     // 임금상승 → 관리비 증가
      occupancy_rate: +1.0,     // 경기 좋으면 입주율 ↑
    },
    depends_on: ["banking"],    // 은행 대출에 의존
  },

  // Manufacturing Sector
  manufacturing: {
    affected_by: ["interest_rate", "tariff_rate", "commodity_price", "exchange_rate"],
    sensitivity: {
      interest_rate: -0.2,      // 금리 0.1% 오르면 수익 0.02% 감소 (적은 영향)
      tariff_rate: -1.5,        // 관세 1% 오르면 수익 1.5% 감소 (수출 기준)
      exchange_rate: +0.7,      // USD/KRW 1% 오르면 수익 0.7% 증가 (export)
      commodity_price: -0.4,    // 원자재 가격 1% 오르면 원가 0.4% 증가
    },
    depends_on: ["banking"],    // 은행 운영금 대출에 의존
  },

  // Technology Sector
  technology: {
    affected_by: ["interest_rate", "exchange_rate", "tariff_rate"],
    sensitivity: {
      interest_rate: -0.15,     // 낮은 영향 (캐시 풍부)
      exchange_rate: +0.8,      // 높은 export 의존도
      tariff_rate: -0.9,        // 중간 영향
    },
    depends_on: ["manufacturing"],  // 부품 공급에 의존
  },
}

// Cross-Sector Effects (Causal Relations)
interface CrossSectorEffects {
  // 금리 변화의 연쇄 효과
  interest_rate_cascade: {
    direct: ["banking(+)", "realestate(-)", "manufacturing(-)"],
    indirect_1: "realestate(-) → banking(-)",  // 부동산 부실 → 은행 신용비용
    indirect_2: "manufacturing(-) → technology(-)",  // 제조업 약화 → 부품 수요 ↓
  },

  // 관세의 연쇄 효과
  tariff_cascade: {
    direct: ["manufacturing(-)", "technology(-)"],
    indirect: "manufacturing(-) → finance_stress → banking(-)",
  },
}
```

### Visualization: 2D Sector Network
```
          [금리↑]
        /   |   \
       ↓    ↓    ↓
   [은행]  [부동산]  [제조업]  [기술]
    +8%    -6.7%    -3%     -2.5%

  연결선:
  부동산(-) → 은행의 대출포트폴리오 위험 ↑
  제조업(-) → 기술 부품수요 ↓
```

---

## 🏭 Level 3: Company Relationships

### Definition
**How individual companies affect each other through supply chains, competition, financing, and customer relationships**

```typescript
interface CompanyRelationships {
  // Example: Samsung Electronics
  samsung_electronics: {
    direct_macro_impact: {
      interest_rate: -0.25,     // 자체 부채의 영향
      exchange_rate: +0.85,     // export 의존도
    },

    // Suppliers (samsung이 구매)
    suppliers: [
      {
        company: "sk_hynix",
        product: "memory_chips",
        annual_purchase: "$2B",
        impact: {
          // SK Hynix는 금리 변화에 다르게 반응 (다른 부채 구조)
          interest_rate_sensitivity: -0.3,  // SK Hynix의 이자비용이 삼성보다 더 민감
          result: "SK Hynix 이자비용 ↑ → 수익 ↓ → 가격 협상력 약화 → SK가격 올림"
        }
      },
      {
        company: "tsmc",
        product: "foundry_services",
        annual_purchase: "$1.5B",
        impact: {
          interest_rate_sensitivity: -0.15,  // TSMC 대만 기업, 다른 금융구조
          result: "TSMC 자본지출 축소 → 신규 공정 투자 지연 → 기술 경쟁 우위 유지"
        }
      }
    ],

    // Competitors (경쟁)
    competitors: [
      {
        company: "nvidia",
        product: "gpu_chips",
        competition_type: "indirect",  // 직접 경쟁 X, 간접 경쟁 O (supply chain)
        impact: {
          // Nvidia도 금리 변화에 영향받음 (다른 구조)
          nvidia_interest_rate_sensitivity: -0.1,  // 낮은 부채
          nvidia_tariff_rate_sensitivity: -1.8,    // 높은 중국 의존도
          result: "금리↑는 Samsung에 유리 (경쟁 약화), 관세↑는 Nvidia에 불리"
        }
      }
    ],

    // Customers (판매)
    customers: [
      {
        company: "apple",
        product: "iphone_components",
        annual_sales: "$3B",
        impact: {
          // Apple도 금리 영향받음
          apple_interest_rate_sensitivity: -0.12,
          result: "Apple 이자비용 ↑ → iPhone 마진 압박 → Samsung 부품 가격 인하 압박"
        }
      }
    ],

    // Financing (은행)
    financing: [
      {
        bank: "shinhan_bank",
        credit_line: "$500M",
        interest_rate_impact: {
          rate_change: "0.1%",
          result: "Shinhan이 금리 올림 → Samsung 차입비용 ↑ → 재정비용 ↑"
        }
      }
    ]
  }
}
```

### Visualization: 3D Company Network
```
당신의 이미지 같은 3D 형태:

                     [금리↑]
                       ↓
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      [Apple]   [Samsung]     [Nvidia]
        (-)       (-)           (-)

        상세 관계:
        Apple → Samsung (부품 구매)
          └─ Apple 이자비용↑ → 마진 ↓ → 부품가 협상 약화

        Samsung → SK Hynix (메모리 구매)
          └─ SK Hynix 이자비용↑ → 가격 올림 → Samsung 원가 ↑

        Samsung ← Shinhan Bank (차입)
          └─ Shinhan 금리 인상 → Samsung 차입비용 ↑
```

---

## 💰 Level 4: Product & Cost Structure

### Definition
**How macro variables affect the specific cost structure and margins of individual products**

```typescript
interface ProductCostStructure {
  // Example: Apple iPhone 15
  apple_iphone_15: {
    // Retail Price
    retail_price: 999,  // USD

    // Cost Breakdown (example)
    product_cost: {
      // Component Costs (from various suppliers)
      components: {
        display: {
          supplier: "samsung_electronics",
          unit_cost: 80,
          supplier_interest_sensitivity: -0.25,  // Samsung 금리 민감도
          supplier_tariff_sensitivity: -0.1,    // 관세 낮음 (내부 기업)
          change_factor: {
            base: 80,
            if_rate_up_0_5_percent: 80 * (1 + 0.0025),  // +$0.20
            if_tariff_up_5_percent: 80 * (1 - 0.0),     // 영향 없음 (내부)
          }
        },
        processor: {
          supplier: "tsmc",
          unit_cost: 70,
          supplier_interest_sensitivity: -0.15,
          supplier_tariff_sensitivity: -1.8,    // 높은 관세 민감도 (대만)
          change_factor: {
            base: 70,
            if_rate_up_0_5_percent: 70 * (1 + 0.00075),  // +$0.05
            if_tariff_up_5_percent: 70 * (1 - 0.09),     // -$6.30 (심각!)
          }
        },
        battery: {
          supplier: "lg_chem",
          unit_cost: 50,
          supplier_interest_sensitivity: -0.2,
          supplier_tariff_sensitivity: -0.3,
          change_factor: {
            base: 50,
            if_rate_up_0_5_percent: 50 * (1 + 0.001),     // +$0.05
            if_tariff_up_5_percent: 50 * (1 - 0.015),     // -$0.75
          }
        },
        other_components: {
          unit_cost: 150,  // Various suppliers with varying sensitivities
        }
      },

      // Labor & Manufacturing
      manufacturing: {
        labor_cost: 30,  // Foxconn in China/Vietnam
        wage_inflation_sensitivity: -0.5,
        tariff_impact: -0.2,  // Manufacturing tariffs
        change_factor: {
          base: 30,
          if_wage_inflation_2_percent: 30 * (1 + 0.01),  // +$0.30
        }
      },

      // Logistics
      logistics: {
        cost: 20,
        fuel_price_sensitivity: -0.3,
        shipping_tariff_impact: -0.1,
      },

      // Total Gross Cost
      total_cost: 400,  // sum of all above
    },

    // Impact Analysis (금리 0.5% 인상 시)
    impact_analysis: {
      scenario: "interest_rate_up_0_5_percent",
      component_cost_changes: {
        display: "+$0.20",     // Samsung 비용 증가
        processor: "+$0.05",   // TSMC 비용 증가
        battery: "+$0.05",     // LG 비용 증가
        manufacturing: "+$0.10", // 운영비 증가
        total_cost_increase: "+$0.40",
      },
      margin_impact: {
        old_margin: 999 - 400,  // $599 (60%)
        new_margin: 999 - 400.40,  // $598.60 (59.86%)
        margin_decline_percent: -0.067,  // -6.7 bps (basis points)
      },
      pricing_decision: {
        option_1: "Keep price at $999 → margin decreases to 59.86%",
        option_2: "Raise price to $1,000 to maintain margin → demand decreases",
        option_3: "Absorb part of cost → reduce other costs (R&D, marketing)",
      }
    },

    // Tariff Impact Analysis (관세 5% 인상 시 - 중국 대상)
    tariff_impact: {
      scenario: "tariff_up_5_percent_china",
      affected_components: {
        processor_from_taiwan: "-$6.30",  // TSMC (대만이지만 중국 제조)
        manufacturing_in_china: "-$3.00",  // 중국 제조 수수료
        battery_component: "-$0.75",
        total_cost_increase: "-$10.05",
      },
      margin_impact: {
        old_margin: 599,
        new_margin: 588.95,  // $999 - 410.05
        margin_decline_percent: -1.68,  // -168 bps (severe!)
      },
      strategic_response: {
        option_1: "Price increase to $1,010 → demand drops 10-15%",
        option_2: "Shift manufacturing to Vietnam/India → 6-12 month delay",
        option_3: "Lobby US government for exemptions",
      }
    }
  }
}
```

### Cascading Effects Example
```
금리 0.5% ↑
├─→ TSMC (공급자) 이자비용 ↑
│   └─ TSMC 마진율 ↓ → 가격 협상력 약화 OR 가격 인상
│       └─ iPhone 부품단가 ↑ $0.05
│
├─→ LG Chem (배터리 공급자) 이자비용 ↑
│   └─ LG 마진율 ↓ → 가격 인상
│       └─ iPhone 부품단가 ↑ $0.05
│
└─→ Apple 자체 차입비용 ↑
    └─ Apple 마진율 ↓ OR 가격 인상
        └─ iPhone 가격 $1,000으로 인상
            └─ 수요 ↓ → 판매량 감소
                └─ Samsung (부품 공급자) 수주 ↓

관세 5% ↑ (중국 대상)
├─→ 모든 중국 제조 부품 비용 ↑ $10
│   └─ iPhone 부품단가 급상승
│
├─→ TSMC 가격 ↑ $6.30 (대만 하지만 중국 제조)
│   └─ 심각한 마진 압박
│
└─→ Apple 가격 인상 필수
    └─ 판매량 큰 폭 감소 (elasticity -1.5)
        └─ 공급체인 전체 축소 (Samsung, SK Hynix 등)
            └─ 산업 전체 경기 악화
```

---

## 🗺️ Complete Ontology Graph

### Data Structure
```
MacroVariables
    ↓
SectorRelationships
    ├─ Banking
    ├─ RealEstate
    ├─ Manufacturing
    └─ Technology
        ↓
CompanyRelationships
    ├─ Apple
    │   ├─ Suppliers: Samsung, TSMC, LG Chem
    │   ├─ Competitors: Nvidia
    │   └─ Financing: JPMorgan, Bank of America
    ├─ Samsung
    │   ├─ Suppliers: SK Hynix, Corning, 日本企業
    │   └─ Financing: Shinhan, Hana
    └─ [Other Companies]
        ↓
ProductCostStructure
    ├─ iPhone 부품단가 분석
    ├─ Galaxy 부품단가 분석
    └─ [Other Products]
```

---

## 📊 Visualization Strategy

### Level 1: Global View (Macro → Sector)
```
2D Network Graph (D3.js)
금리↑ 중앙 → 섹터들 영향도 표시
```

### Level 2: Sector Network
```
2D Network (D3.js)
섹터 내 회사들과 상호작용
```

### Level 3: Company Network (당신이 원하는 3D)
```
3D Network Graph (Three.js / Babylon.js)
├─ 노드: 기업들
├─ 연결선: 공급/수요/금융 관계
├─ 색상: 영향도 (빨강=부정, 초록=긍정)
├─ 굵기: 관계의 크기 ($)
└─ 애니메이션: 금리 변화 시 실시간 업데이트
```

### Level 4: Product Cost Breakdown (Circuit Diagram)
```
각 부품별 비용 시각화
├─ 공급자별 비용 (TSMC, Samsung, LG)
├─ 금리/관세 영향 컬러 하이라이트
└─ Total Cost → Margin → Price 영향도
```

---

## 🔧 Implementation Layers

### Data Layer (PostgreSQL + Neo4j)
```
postgresql:
├─ macro_variables
├─ sector_definitions
├─ company_financials
├─ product_cost_structures
└─ relationships (company-to-company)

neo4j:
├─ Company nodes
├─ Supplier relationships (edges)
├─ Customer relationships (edges)
└─ Financial relationships (edges)
```

### Calculation Layer (Quant Engine)
```
Level 1 → Level 2: Macro to Sector Impact
Level 2 → Level 3: Sector to Company Impact
Level 3 → Level 4: Company to Product Impact
```

### Visualization Layer
```
Level 2: 2D Sector Network (D3.js)
Level 3: 3D Company Network (Three.js)
Level 4: Circuit Diagrams + Tables (Canvas + SVG)
```

---

## 📈 Example Scenario Analysis

### Scenario: 금리 0.5% + 관세 5% (동시)

```
Step 1: Macro Impact
  interest_rate: 2.5% → 3.0%
  tariff_rate: 0% → 5%

Step 2: Sector Level
  Banking: +8% (이자수익 ↑)
  Manufacturing: -3% (금리) -5% (관세) = -8% total
  Technology: -2.5% (금리) -3% (관세) = -5.5% total
  Real Estate: -6.7% (금리만 영향)

Step 3: Company Level
  Apple:
    ├─ Direct: 자체 차입비용 ↑, 판매 영향 (관세)
    ├─ Supplier impact: TSMC 비용 심각 ↑, Samsung 비용 약간 ↑
    └─ Result: iPhone 마진 급감

  Samsung:
    ├─ Direct: 자체 차입비용 ↑, 부품 판매 영향 ↑ (Apple 위기)
    ├─ Supplier impact: SK Hynix 가격 ↑, SK Hynix 차용비용 ↑ 이중고
    └─ Result: 이득과 손해 섞임

  SK Hynix:
    ├─ 자체 차입비용 큰 폭 ↑ (금리 민감도 높음)
    ├─ 관세로 인한 판매 영향 (중국 고객 ↓)
    └─ Result: 가장 큰 영향 (손해)

Step 4: Product Level
  iPhone 15 부품단가: $400 → $410.40 (금리) + $10 (관세) = $420.40
    └─ 마진: 59.96% → 57.88% (2.08% point 감소)
    └─ 가격 인상 필수 OR 마진 감소 수용

  Galaxy S24 부품단가: 비슷한 수준
    └─ 하지만 Samsung은 공급자 입장도 있어서 수익에서 보상 가능
```

---

## 🎯 Benefits of 4-Level Ontology

1. **Macro-Level Decision Making**
   - 정책당국: "관세 인상 시 정확한 경제 파급효과?"
   - 중앙은행: "금리 인상의 정확한 영향?"

2. **Company-Level Strategy**
   - CFO: "금리 0.5% 인상 시 우리 회사 마진 영향?"
   - CEO: "경쟁사는 어떻게 영향받을까?"
   - COO: "공급체인 재편 필요한가?"

3. **Product-Level Optimization**
   - PM: "부품 원가 상승 시 가격 인상 전략?"
   - 구매팀: "공급자 가격 협상에서 근거?"

4. **Investment Decision**
   - 헤지펀드: "금리/관세 변화 시 최고의 거래?"
   - PE: "이 회사의 실제 마진율 변화는?"

---

## 📋 Development Phases

### Phase 1a: Macro + Sector (Weeks 1-2)
- 현재 계획대로 진행

### Phase 1b: Company Relationships (Weeks 3-4)
- Supply chain 관계 매핑
- 기업 간 영향 모델링
- 3D Network Graph 구축

### Phase 2: Product Cost Structure (Weeks 5-6)
- 부품별 비용 분해
- 공급자별 민감도 분석
- Circuit diagram 구축

### Phase 3+: Cross-Level Integration
- Level 4의 변화 → Level 3 → Level 2 → Level 1 피드백
- "iPhone 마진 ↓" → "Apple 이익 ↓" → "Technology sector ↓" → "전체 경제 영향"

---

**This is the complete economic ontology you need for true analytical depth.**

