# Real Estate Sector - Level 3: Company Relationships

**Purpose:** Define individual real estate companies and their cross-sector relationships
**Ref Document:** REALESTATE_CORE_EQUATIONS.md (all calculations based on these)
**Date:** 2025-11-01

---

## 🎯 Overview: Real Estate Companies in Korea

```
Real Estate Sector Companies (Level 3)

Korean REITs (부동산리츠)
├─ 신한알파리츠 (Shinhan Alpha REIT)
├─ 이리츠코크렙 (E-REIT Cokehp)
├─ NH프라임리츠 (NH Prime REIT)
├─ 산단공업용지리츠 (Industrial Land REIT)
└─ 기타 리츠들 (20+ more REITs)

US Real Estate ETFs (Used as comparable)
├─ VNQ (Vanguard Real Estate ETF)
├─ SCHH (Schwab US REIT ETF)
└─ IYR (iShares US Real Estate ETF)

Relationships to Map:
├─ Company ↔ Company (competition, supply chain)
├─ Company ↔ Bank (financing relationships)
├─ Company ↔ Sector (market dynamics)
└─ Company ↔ Macro (rate, inflation, policy)
```

---

## 🏢 Company 1: 신한알파리츠 (Shinhan Alpha REIT)

### Basic Information
```
Ticker: 293940 (Korea)
Type: Equity REIT
Focus: Mixed-use real estate (office, retail, logistics)
Market Cap: ~1.2T won
```

### Level 3.1: Balance Sheet (From Equation 3.1)

```typescript
// Using Equation 3.1: Assets = Liabilities + Equity

company_shinhan_alpha = {
  // Company Identity
  name: "신한알파리츠",
  ticker: "293940",
  type: "Equity REIT",

  // EQUATION 3.1: BALANCE SHEET
  balance_sheet: {
    // Assets
    assets: {
      real_estate_value: 500_000_000_000,    // 500B won (부동산 포트폴리오)
      cash: 50_000_000_000,                  // 50B won
      receivables: 20_000_000_000,           // 20B won
      other_assets: 10_000_000_000,          // 10B won
      total: 580_000_000_000,                // 580B won
    },

    // Liabilities
    liabilities: {
      total_debt: 290_000_000_000,           // 290B won (이자부담부채)
      short_term_debt: 50_000_000_000,       // 50B won (1년 내 만기)
      long_term_debt: 240_000_000_000,       // 240B won (1년 초과)
      accounts_payable: 20_000_000_000,      // 20B won
      total: 310_000_000_000,                // 310B won
    },

    // Equity
    equity: {
      common_stock: 100_000_000_000,         // 100B won
      retained_earnings: 170_000_000_000,    // 170B won
      total: 270_000_000_000,                // 270B won
    },

    // Verification: Assets = Liabilities + Equity
    // 580B = 310B + 270B ✓ Correct
  },

  // Derived Metrics (from balance sheet)
  financial_metrics: {
    debt_to_equity: 290_000_000_000 / 270_000_000_000,  // 1.07x (Equation 3.5)
    debt_ratio: 290_000_000_000 / 580_000_000_000,      // 50% (used in Eq 2.1)
    equity_multiplier: 580_000_000_000 / 270_000_000_000, // 2.15x
  }
}
```

### Level 3.2: Income Statement (From Equation 3.2)

```typescript
company_shinhan_alpha.income_statement = {
  // EQUATION 3.2.1: RENTAL INCOME
  rental_income: {
    property_portfolio: [
      {
        name: "Seoul Office Building A",
        property_value: 250_000_000_000,
        occupancy_rate: 0.95,
        rental_yield: 0.04,  // 4% annual
        annual_income: 250_000_000_000 * 0.95 * 0.04,  // 9.5B won
      },
      {
        name: "Incheon Logistics Center B",
        property_value: 150_000_000_000,
        occupancy_rate: 0.92,
        rental_yield: 0.035,  // 3.5%
        annual_income: 150_000_000_000 * 0.92 * 0.035,  // 4.83B won
      },
      {
        name: "Busan Retail Complex C",
        property_value: 100_000_000_000,
        occupancy_rate: 0.88,
        rental_yield: 0.038,  // 3.8%
        annual_income: 100_000_000_000 * 0.88 * 0.038,  // 3.34B won
      },
    ],
    total_rental_income: 17.67_000_000_000,  // ≈17.67B won/year
  },

  // EQUATION 3.2.2: OPERATING EXPENSES
  operating_expenses: {
    maintenance_capex: 500_000_000_000 * 0.004,  // 2B won (0.4% of RE value)
    management_fees: 17.67_000_000_000 * 0.05,   // 0.88B won (5% of rental)
    property_tax: 500_000_000_000 * 0.002,       // 1B won (0.2% of RE value)
    insurance: 500_000_000,                      // 0.5B won
    depreciation: 2_000_000_000,                 // 2B won (tax benefit)
    total_opex: 6.38_000_000_000,               // ≈6.38B won/year
  },

  // EQUATION 3.2.3: EBITDA (Operating Income)
  ebitda: 17.67_000_000_000 - (6.38_000_000_000 - 2_000_000_000),  // 13.29B won
  // (subtract depreciation from OpEx since it's non-cash)

  // EQUATION 3.2.4: INTEREST EXPENSE (RATE-SENSITIVE!)
  interest_expense: {
    scenario_current: {
      debt: 290_000_000_000,
      interest_rate: 0.025,  // 2.5%
      annual_interest: 290_000_000_000 * 0.025,  // 7.25B won
    },
    scenario_rate_up_0_5pct: {
      debt: 290_000_000_000,
      interest_rate: 0.030,  // 3.0%
      annual_interest: 290_000_000_000 * 0.030,  // 8.7B won
      delta_interest: 1.45_000_000_000,          // +1.45B won (20% increase!)
    },
  },

  // EQUATION 3.2.5: TAXES
  taxes: {
    tax_rate: 0.25,  // 25% corporate tax

    current_scenario: {
      taxable_income: 13.29_000_000_000 - 7.25_000_000_000,  // 6.04B won
      taxes_paid: (13.29_000_000_000 - 7.25_000_000_000) * 0.25,  // 1.51B won
    },

    rate_up_scenario: {
      taxable_income: 13.29_000_000_000 - 8.7_000_000_000,   // 4.59B won
      taxes_paid: (13.29_000_000_000 - 8.7_000_000_000) * 0.25,  // 1.15B won
      tax_savings: 1.51_000_000_000 - 1.15_000_000_000,     // +0.36B won (partial offset)
    },
  },

  // EQUATION 3.2.6: NET INCOME (FINAL RESULT)
  net_income: {
    current: {
      ni: 13.29_000_000_000 - 7.25_000_000_000 - 1.51_000_000_000,  // 4.53B won
    },
    rate_up_by_0_5pct: {
      ni: 13.29_000_000_000 - 8.7_000_000_000 - 1.15_000_000_000,   // 3.44B won
      delta_ni: 3.44_000_000_000 - 4.53_000_000_000,                // -1.09B won
      delta_ni_percent: -1.09_000_000_000 / 4.53_000_000_000,       // -24.1%
    },
  },
}
```

### Level 3.3: Cash Flow (From Equation 3.3)

```typescript
company_shinhan_alpha.cash_flow = {
  // EQUATION 3.3.1: OPERATING CASH FLOW
  operating_cash_flow: {
    current_scenario: {
      net_income: 4.53_000_000_000,
      depreciation: 2_000_000_000,            // add back non-cash charge
      changes_in_working_capital: -0.2_000_000_000,  // minor outflow
      ocf: 4.53_000_000_000 + 2_000_000_000 - 0.2_000_000_000,  // 6.31B won
    },

    rate_up_scenario: {
      net_income: 3.44_000_000_000,
      depreciation: 2_000_000_000,
      changes_in_working_capital: -0.2_000_000_000,
      ocf: 3.44_000_000_000 + 2_000_000_000 - 0.2_000_000_000,  // 5.22B won
      delta_ocf: 5.22_000_000_000 - 6.31_000_000_000,           // -1.09B won
    },
  },

  // EQUATION 3.3.2 & 3.3: CAPEX & FREE CASH FLOW
  capex_and_fcf: {
    maintenance_capex: 2_000_000_000,         // Keep existing properties
    growth_capex: 3_000_000_000,              // New acquisitions/renovations
    total_capex: 5_000_000_000,

    free_cash_flow: {
      current: 6.31_000_000_000 - 5_000_000_000,  // 1.31B won
      rate_up: 5.22_000_000_000 - 5_000_000_000,  // 0.22B won
      delta_fcf: 0.22_000_000_000 - 1.31_000_000_000,  // -1.09B won
    },

    cash_allocation: {
      current: {
        debt_repayment: 0.5_000_000_000,
        dividends: 0.6_000_000_000,
        cash_reserve: 0.21_000_000_000,
      },
      rate_up: {
        debt_repayment: 0.5_000_000_000,  // maintain
        dividends: 0.0,                   // cut to zero!
        cash_reserve: -0.28_000_000_000,  // draw down
      },
    },
  },
}
```

### Level 3.4: Key Ratios & Health (From Equations 3.4, 3.5, 3.6)

```typescript
company_shinhan_alpha.financial_health = {
  // EQUATION 3.4: INTEREST COVERAGE RATIO
  interest_coverage: {
    current: 13.29_000_000_000 / 7.25_000_000_000,  // 1.83x (⚠️ Warning!)
    rate_up_by_0_5: 13.29_000_000_000 / 8.7_000_000_000,  // 1.53x (🚨 Risk!)

    health_assessment: {
      current: "CAUTION - Below 2.0x threshold",
      rate_up: "RISK - Approaching danger zone",
      implication: "Little margin for error. One occupancy drop could be critical."
    },
  },

  // EQUATION 3.5: DEBT-TO-EQUITY
  debt_to_equity: {
    current: 290_000_000_000 / 270_000_000_000,  // 1.07x
    assessment: "High leverage. Vulnerable to rate increases."
  },

  // EQUATION 3.6: DIVIDEND YIELD
  dividend_yield: {
    current: {
      shares_outstanding: 2_000_000_000,         // 200M shares (example)
      annual_dividend: 600_000_000,              // From FCF allocation
      dividend_per_share: 3,                     // 3,000 won per share
      stock_price: 50_000,                       // 50,000 won
      yield: (3_000 / 50_000) * 100,            // 6%
    },

    rate_up_scenario: {
      annual_dividend: 0,                        // Cut to zero!
      dividend_per_share: 0,
      yield: 0,
      impact: "Stock crash likely. Investors expect 6% yield, now get 0%!"
    },
  },

  // EQUATION 3.7: COMPREHENSIVE RATE IMPACT
  rate_sensitivity: {
    interest_expense_change: 1.45_000_000_000,   // +20%
    tax_benefit_offset: 0.36_000_000_000,        // -25%
    net_income_impact: -1.09_000_000_000,        // -24%
    dividend_impact: -100,                       // -100% (cut to zero)
    stock_price_impact_estimated: -25,           // -25% expected crash
  },
}
```

---

## 🏢 Company 2: 이리츠코크렙 (E-REIT Cokehp)

### Simpler Profile (High Leverage)

```typescript
company_e_reit = {
  name: "이리츠코크렙",
  ticker: "377190",
  type: "Equity REIT",

  // EQUATION 3.1: Balance Sheet (simplified)
  balance_sheet: {
    assets: 400_000_000_000,                      // 400B won
    liabilities: 250_000_000_000,                 // 250B won (HIGH debt!)
    equity: 150_000_000_000,                      // 150B won
    // Debt Ratio: 62.5% (Higher risk than Shinhan)
  },

  // EQUATION 3.2: Income Statement
  income_statement: {
    rental_income: 12_000_000_000,                // 12B won/year
    operating_expenses: 4_500_000_000,            // 4.5B won
    ebitda: 7_500_000_000,                        // 7.5B won
    interest_expense: {
      current: 250_000_000_000 * 0.025,           // 6.25B won
      rate_up: 250_000_000_000 * 0.030,           // 7.5B won
      delta: 1.25_000_000_000,                    // +20%
    },
  },

  // EQUATION 3.4: INTEREST COVERAGE (KEY INDICATOR!)
  interest_coverage: {
    current: 7.5_000_000_000 / 6.25_000_000_000,  // 1.20x (🚨 CRITICAL!)
    rate_up: 7.5_000_000_000 / 7.5_000_000_000,   // 1.00x (DANGER!)

    assessment: "
      Already at breaking point!
      Can barely cover interest.
      Any rate increase → bankruptcy risk!
    "
  },

  // Financial Distress Scenario
  rate_increase_impact: {
    ebitda: 7.5_000_000_000,
    interest_expense_rises_to: 7.5_000_000_000,
    net_income_before_tax: 0,
    after_tax: 0,
    dividend: 0,

    what_happens: "
      - Cannot pay dividend (already promised 5%)
      - Must cut capex severely
      - May need to sell properties
      - Likely credit downgrade
      - Bank may demand debt restructuring
      - Stock price crash 40-50%
    "
  },
}
```

---

## 🏢 Company 3: NH프라임리츠 (NH Prime REIT)

### Conservative Profile (Low Leverage)

```typescript
company_nh_prime = {
  name: "NH프라임리츠",
  ticker: "338100",
  type: "Equity REIT",

  balance_sheet: {
    assets: 600_000_000_000,                      // 600B won
    liabilities: 150_000_000_000,                 // 150B won (LOW debt!)
    equity: 450_000_000_000,                      // 450B won
    // Debt Ratio: 25% (Conservative, stable)
  },

  income_statement: {
    rental_income: 18_000_000_000,                // 18B won/year
    operating_expenses: 5_000_000_000,            // 5B won
    ebitda: 13_000_000_000,                       // 13B won
    interest_expense: {
      current: 150_000_000_000 * 0.025,           // 3.75B won
      rate_up: 150_000_000_000 * 0.030,           // 4.5B won
      delta: 0.75_000_000_000,                    // +20% (same % as others)
    },
  },

  interest_coverage: {
    current: 13_000_000_000 / 3.75_000_000_000,   // 3.47x (✅ HEALTHY!)
    rate_up: 13_000_000_000 / 4.5_000_000_000,    // 2.89x (Still solid)

    assessment: "
      Very healthy coverage ratio.
      Can absorb rate increases.
      Likely to maintain dividend.
      Stock impact: -5% to -10% only.
    "
  },

  rate_increase_impact: {
    net_income_drop: -0.56_000_000_000,           // -12%
    dividend_maintained: true,
    stock_impact: "Minimal (-5-10%)",
    conclusion: "Safe haven in rate-up scenario"
  },
}
```

---

## 🔗 Level 3: Cross-Company & Cross-Sector Relationships

### Relationship 1: Companies ↔ Financing Banks

```typescript
// EQUATION 3.8: Bank-REIT Relationship

banking_relationships = [
  {
    bank: "신한은행 (Shinhan Bank)",
    total_re_loans: 1_000_000_000_000,  // 1T won to RE sector

    portfolio_composition: {
      신한알파리츠: {
        loan_amount: 200_000_000_000,
        interest_coverage: 1.83,  // Current
        risk_level: "MEDIUM",
        default_probability_current: 0.02,
        default_probability_after_rate: 0.05,  // 2.5x increase!
      },

      이리츠코크렙: {
        loan_amount: 300_000_000_000,
        interest_coverage: 1.20,  // Current
        risk_level: "HIGH",
        default_probability_current: 0.08,
        default_probability_after_rate: 0.25,  // Critical!
      },

      NH프라임리츠: {
        loan_amount: 250_000_000_000,
        interest_coverage: 3.47,  // Current
        risk_level: "LOW",
        default_probability_current: 0.005,
        default_probability_after_rate: 0.008,
      },

      others: {
        loan_amount: 250_000_000_000,
        average_risk: "MEDIUM",
      },
    },

    // Bank's Provision Calculation
    provision_impact: {
      current_expected_loss: 1_000_000_000_000 *
        (0.02 * 0.2 + 0.08 * 0.3 + 0.005 * 0.25 + 0.02 * 0.25),
      // = 1T * (0.004 + 0.024 + 0.00125 + 0.005) = 30.25B won

      after_rate_increase: 1_000_000_000_000 *
        (0.05 * 0.2 + 0.25 * 0.3 + 0.008 * 0.25 + 0.035 * 0.25),
      // = 1T * (0.01 + 0.075 + 0.002 + 0.00875) = 95.75B won

      additional_provision: 95.75_000_000_000 - 30.25_000_000_000,
      // = 65.5B won additional expense!

      impact_on_bank: {
        shinhan_net_income_drop: -65_500_000_000,  // But...
        shinhan_nim_increase: 50_000_000_000,      // NIM rises more
        net_effect: -15_500_000_000,               // Still negative for bank!
      },
    },
  },

  {
    bank: "하나은행 (Hana Bank)",
    total_re_loans: 500_000_000_000,
    // Similar analysis...
  },
]
```

### Relationship 2: Companies ↔ Competitors

```typescript
// EQUATION 3.7: Competitive Impact

competitive_dynamics = {
  // When rates rise, companies respond differently based on leverage

  // Scenario: Interest rate 2.5% → 3.0%

  strong_survivor: {
    company: "NH프라임리츠",
    interest_coverage_after: 2.89,
    status: "Still paying dividend 5%",
    action: "Can invest in acquiring distressed properties",
    market_advantage: "Buy competitors' properties at 30% discount"
  },

  weak_competitor: {
    company: "이리츠코크렙",
    interest_coverage_after: 1.00,
    status: "Cannot pay dividend, negotiating restructuring",
    action: "Must sell properties, downsize",
    market_disadvantage: "Forced seller at bad prices"
  },

  medium_competitor: {
    company: "신한알파리츠",
    interest_coverage_after: 1.53,
    status: "Cut dividend to zero, preserve cash",
    action: "Pause expansion, hunker down",
    market_position: "Neutral - neither attacking nor expanding"
  },

  result: "
    Market consolidation!
    Strong companies get stronger.
    Weak companies get acquired or collapse.
    This is how recessions create winners and losers.
  "
}
```

### Relationship 3: Companies ↔ Supply Chain

```typescript
// Real Estate companies buy from construction/materials suppliers

supply_chain_relationships = {
  신한알파리츠: {
    capital_expenditure: 3_000_000_000,  // 3B won/year in new projects

    suppliers: [
      {
        name: "대림산업 (Daelim Engineering & Construction)",
        construction_contract: 1_000_000_000,  // 1B won/year
        impact_of_rate_rise: {
          신한알파리츠_capex_reduction: 20,  // -20% from 3B to 2.4B
          impact_on_supplier: "Construction contracts drop from 1B to 0.8B",
          supplier_margins: "Squeezed (fixed costs don't drop with revenue)"
        }
      }
    ]
  }
}
```

---

## 📊 Summary: Real Estate Company Profiles

| Company | Debt Ratio | ICR Current | ICR After +0.5% | Status |
|---------|-----------|------------|-----------------|--------|
| **NH Prime** | 25% | 3.47x | 2.89x | ✅ Safe |
| **Shinhan Alpha** | 50% | 1.83x | 1.53x | ⚠️ Caution |
| **E-REIT** | 62.5% | 1.20x | 1.00x | 🚨 Crisis |

---

## 🎯 How This Feeds Into Other Levels

```
Level 3 Company Data
    ↓
Level 2: Sector Impact
    "Weighted average ICR drop from 2.17x to 1.81x"
    → Sector-wide provision increase
    → Sector credit spread widens

    ↓
Level 1: Macro Impact
    "RE sector credit risk up. Affects broader economy."
    → Central bank may respond with policy
    → Economic growth forecast lowered

    ↓
Level 4: Product Level
    "Construction project cancellations"
    → Suppliers lose contracts
    → Workers laid off
    → Unemployment rises
```

---

**This Level 3 foundation is referenced by all visualization and calculation teams.**

