# Real Estate Sector - Core Financial Equations

**Purpose:** Define fundamental financial equations that all teams use as foundation
**Audience:** Team Quant, Team Data, Team SimViz, Team UI, Market Structuring Team
**Date:** 2025-11-01
**Status:** Core Foundation (All development depends on this)

---

## 🎯 Principle

**One Source of Truth for All Teams**

```
Core Equations (This Document)
    ↓
├─→ Team Quant: Implements these formulas
├─→ Team Data: Collects data for these inputs
├─→ Team SimViz: Visualizes these outputs
├─→ Team UI: Displays these results
└─→ Market Structuring: Maintains this as reference
```

**Every line of code must reference which equation it implements.**

---

## 📐 Level 1: Macro Variables Affecting Real Estate

### Definition
Variables that affect ALL real estate companies equally (macro level)

```typescript
// Real Estate는 다음 Macro Variables에 영향받음
interface RealEstateMacroImpact {
  // PRIMARY (최고 영향)
  interest_rate: {
    symbol: "r",
    unit: "% per annum",
    range: "0% - 10%",
    impact_type: "NEGATIVE",
    description: "기업이 빌린 돈의 이자비용 결정"
  },

  // SECONDARY (중간 영향)
  inflation_rate: {
    symbol: "π",
    unit: "% per annum",
    range: "0% - 10%",
    impact_type: "MIXED",
    description: "임대료는 올라도 운영비도 올라감"
  },

  wage_inflation_rate: {
    symbol: "w_π",
    unit: "% per annum",
    range: "0% - 8%",
    impact_type: "NEGATIVE",
    description: "관리비, 유지보수비 증가"
  },

  property_price_index: {
    symbol: "P_index",
    unit: "Index (base=100)",
    range: "50 - 150",
    impact_type: "POSITIVE",
    description: "부동산 자산가격 변화 → 자산가치 → 신용도"
  },

  rental_market_yield: {
    symbol: "y_market",
    unit: "% per annum",
    range: "2% - 6%",
    impact_type: "POSITIVE",
    description: "시장의 임대수익률 → 임대료 결정"
  },

  occupancy_rate_market: {
    symbol: "occ_market",
    unit: "%",
    range: "70% - 95%",
    impact_type: "POSITIVE",
    description: "시장 입주율 → 임차인 수요 → 수익성"
  },

  credit_spread: {
    symbol: "s_credit",
    unit: "basis points (bps)",
    range: "100 - 500 bps",
    impact_type: "NEGATIVE",
    description: "부동산 회사의 신용위험 프리미엄"
  }
}
```

---

## 💼 Level 2: Real Estate Sector-Specific Metrics

### Equation 2.1: Sector-Level Interest Rate Sensitivity

**문제:** 금리가 오르면 부동산 기업의 수익이 얼마나 변하는가?

```
Sector_Interest_Sensitivity = -β_RE

β_RE = Weighted Average Debt Ratio of Sector

Example:
  Average Debt Ratio in RE Sector = 50% of Assets
  For 1% interest rate increase:
    Sector Revenue Impact = -β_RE × ΔRate
                          = -0.50 × 0.01
                          = -0.5%
```

**Formula:**
```
Equation 2.1:
ΔRevenue_Sector = -β_RE × ΔRate

Where:
  ΔRevenue_Sector = 섹터 평균 수익 변화율 (%)
  β_RE = 부동산 섹터의 평균 부채비율 (0-1)
  ΔRate = 금리 변화 (percentage points)

Example:
  ΔRate = +0.5% (금리 2.5% → 3.0%)
  β_RE = 0.50 (평균 부채비율 50%)
  ΔRevenue_Sector = -0.50 × 0.005 = -0.0025 = -0.25%
```

**Interpretation:**
- 부동산 섹터는 평균 0.5% 수익 감소

---

## 🏢 Level 3: Individual Company Financial Structure

### Equation 3.1: Company Balance Sheet

**목적:** 각 부동산 회사의 재무상태를 정의

```
Equation 3.1: Balance Sheet Identity

Assets = Liabilities + Equity

Where:
  Assets = Real Estate Value + Cash + Other
  Liabilities = Total Debt (interest-bearing)
  Equity = Shareholders' Equity
```

**Detailed:**
```typescript
interface RealEstateCompanyBalanceSheet {
  // ASSETS
  assets_total: number;  // Total Assets (원)

  assets_breakdown: {
    real_estate_value: number;      // A1: 부동산 자산가치
    cash_equivalents: number;        // A2: 현금 및 현금성자산
    receivables: number;             // A3: 미수금
    other_assets: number;            // A4: 기타자산
  },

  // LIABILITIES
  liabilities_total: number;  // Total Liabilities

  liabilities_breakdown: {
    debt_total: number;              // L1: 총부채
    debt_interestbearing: number;    // L1a: 이자부담부채 (KEY!)
    accounts_payable: number;        // L2: 미지급금
    other_liabilities: number;       // L3: 기타부채
  },

  // EQUITY
  equity: {
    common_stock: number;            // E1: 보통주자본
    retained_earnings: number;       // E2: 이익잉여금
    other_equity: number;            // E3: 기타자본
    total_equity: number;            // E_total = common + retained + other
  }
}
```

**Example (한국 REIT):**
```
신한알파리츠 (예시)
Assets:
  ├─ Real Estate Value: 500B won
  ├─ Cash: 50B won
  └─ Other: 20B won
  └─ Total: 570B won

Liabilities:
  ├─ Total Debt: 285B won (interest-bearing)
  ├─ Other Liabilities: 15B won
  └─ Total: 300B won

Equity:
  └─ Total Equity: 270B won (= 570B - 300B)

Debt Ratio = 285B / 570B = 50%
```

---

### Equation 3.2: Annual Income Statement

**목적:** 금리 변화가 연간 수익에 미치는 영향

```
Equation 3.2: Net Income Calculation

Net Income = Operating Income - Interest Expense - Taxes

Detailed Breakdown:

NI = (Rental Income - Operating Expenses) - (Debt × Interest Rate) - Taxes
   = Operating_Income - Interest_Expense - Taxes

Where:
  Rental_Income = Σ(Property_i × Occupancy_i × Rent_i) for all properties
  Operating_Expenses = Maintenance + Management Fees + Property Tax + Insurance
  Interest_Expense = Debt × Interest_Rate  ← KEY: Rate Sensitive!
  Taxes = Tax_Rate × (Operating_Income - Interest_Expense)
```

**Detailed Formula:**
```
Equation 3.2.1: Rental Income

Rental_Income = Σ Property_i for i = 1 to N

Property_i = Property_Value_i × Occupancy_Rate_i × Annual_Rent_per_Unit_i

Example:
  Property 1: 500B won value × 95% occupancy × 4% rental yield
           = 500B × 0.95 × 0.04 = 19B won/year
  Property 2: 300B won value × 90% occupancy × 3.5% rental yield
           = 300B × 0.90 × 0.035 = 9.45B won/year
  Total Rental Income = 19B + 9.45B = 28.45B won/year
```

```
Equation 3.2.2: Operating Expenses

OpEx = Maintenance + Management + Property_Tax + Insurance + Depreciation

Example:
  Maintenance (annual): 2B won (부동산 가치의 0.4%)
  Management Fees: 1.4B won (임대료의 5%)
  Property Tax: 1B won (부동산 가치의 0.2%)
  Insurance: 0.5B won
  Depreciation (tax benefit): 2B won
  Total OpEx = 7.4B won/year
```

```
Equation 3.2.3: Operating Income (EBITDA)

EBITDA = Rental_Income - OpEx

Example:
  EBITDA = 28.45B - 7.4B = 21.05B won/year
```

```
Equation 3.2.4: Interest Expense (Rate-Sensitive!)

Interest_Expense = Debt × Interest_Rate

Example (Current):
  Debt = 285B won
  Rate = 2.5%
  Interest_Expense = 285B × 0.025 = 7.125B won/year

Example (Rate increases to 3.0%):
  Interest_Expense = 285B × 0.030 = 8.55B won/year
  ΔInterest = 8.55B - 7.125B = +1.425B won/year ← 20% increase!
```

```
Equation 3.2.5: Taxes

Taxes = Tax_Rate × (EBITDA - Interest_Expense)
      = Tax_Rate × (Operating_Income_Before_Interest)

Example (현재 2.5% 금리):
  Taxable Income = 21.05B - 7.125B = 13.925B won
  Taxes (25% rate) = 13.925B × 0.25 = 3.48B won

Example (3.0% 금리):
  Taxable Income = 21.05B - 8.55B = 12.5B won
  Taxes (25% rate) = 12.5B × 0.25 = 3.125B won
  ΔTaxes = 3.125B - 3.48B = -0.355B won (tax savings!)
```

```
Equation 3.2.6: Net Income (Final)

NI = EBITDA - Interest_Expense - Taxes
   = 21.05B - Interest_Expense - Taxes

Current (2.5% rate):
  NI = 21.05B - 7.125B - 3.48B = 10.445B won/year

After rate increase (3.0%):
  NI = 21.05B - 8.55B - 3.125B = 9.375B won/year

ΔNI = 9.375B - 10.445B = -1.07B won (-10.2%)
```

---

### Equation 3.3: Cash Flow Analysis

**목적:** 기업이 실제로 사용할 수 있는 현금 계산

```
Equation 3.3: Free Cash Flow (FCF)

FCF = Operating_Cash_Flow - Capital_Expenditures

Where:
  OCF = Net Income + Depreciation - Changes in Working Capital
  CapEx = Maintenance Capital + Growth Capital
```

**Detailed:**
```
Equation 3.3.1: Operating Cash Flow

OCF = NI + Depreciation - ΔWorking_Capital

Example:
  NI = 10.445B won (current rate)
  Depreciation = 2B won (non-cash charge, added back)
  ΔWorking Capital = 0.2B won (minor)
  OCF = 10.445B + 2B - 0.2B = 12.245B won
```

```
Equation 3.3.2: Capital Expenditures

CapEx = Maintenance CapEx + Growth CapEx

Example:
  Maintenance CapEx = 2B won (keep existing properties)
  Growth CapEx = 3B won (new acquisitions, renovations)
  Total CapEx = 5B won
```

```
Equation 3.3.3: Free Cash Flow

FCF = OCF - CapEx = 12.245B - 5B = 7.245B won/year

Available for:
  ├─ Debt Repayment: 3B won
  ├─ Dividends to Shareholders: 4.245B won
  └─ Cash Reserve Build-up: 0B won
```

---

## 📊 Level 3: Key Financial Ratios

### Equation 3.4: Interest Coverage Ratio (Health Indicator)

**목적:** 회사가 이자를 얼마나 쉽게 낼 수 있는가?

```
Equation 3.4: Interest Coverage Ratio

ICR = EBITDA / Interest_Expense

Example (Current 2.5%):
  ICR = 21.05B / 7.125B = 2.95x
  → 이자를 거의 3배 쉽게 지불 가능 (건강함)

Example (After 3.0%):
  ICR = 21.05B / 8.55B = 2.46x
  → 이자 지불 능력 약화 (위험 증가)

Interpretation:
  ICR > 2.5x: 매우 건강 (✅ Safe)
  2.0x < ICR < 2.5x: 적당 (⚠️ Caution)
  ICR < 2.0x: 위험 (❌ Risk)
```

**Interest Coverage가 중요한 이유:**
```
은행 관점:
  "이 회사가 우리 대출금의 이자를 낼 수 있을까?"

투자자 관점:
  "배당금을 받을 수 있을까?"

신용평가사 관점:
  "회사의 신용등급은?"
```

---

### Equation 3.5: Debt-to-Equity Ratio

**목적:** 회사의 재무 레버리지 수준

```
Equation 3.5: Debt-to-Equity Ratio

D/E = Total_Debt / Total_Equity

Example:
  D/E = 285B / 270B = 1.06x

Interpretation:
  D/E < 1.0x: 자본이 부채보다 많음 (Safe)
  D/E = 1.0x: 자본과 부채가 같음 (Neutral)
  D/E > 1.5x: 부채가 자본의 1.5배 이상 (Risky)
```

---

### Equation 3.6: Dividend Yield

**목적:** 주주가 받는 수익

```
Equation 3.6: Dividend Yield

Dividend_Yield = Annual_Dividend / Stock_Price × 100%

Example:
  Annual Dividend per Share: 2,000 won
  Stock Price: 50,000 won
  Dividend Yield = 2,000 / 50,000 × 100% = 4%
```

**금리 변화의 영향:**
```
Current (2.5%):
  Net Income: 10.445B won
  Dividend Payout Ratio: 40%
  Dividend: 4.178B won
  Per Share: 2,089 won (가정: 200M shares)

After rate increase (3.0%):
  Net Income: 9.375B won
  Dividend Payout Ratio: 40% (유지)
  Dividend: 3.75B won
  Per Share: 1,875 won
  ΔDividend = -8.3%

Stock Price Impact:
  Old: 50,000 × (2,089/2,000) = 52,225 won (dividend yield 기반)
  New: 50,000 × (1,875/2,000) = 46,875 won
  ΔPrice = -10.2%
```

---

## 🔄 Level 3: Rate Sensitivity Analysis

### Equation 3.7: Complete Rate Impact

**목적:** 금리 변화 시 모든 영향을 계산

```
Equation 3.7: Interest Rate Sensitivity

For interest rate change ΔRate (e.g., +0.5%):

1. Interest Expense Change:
   ΔInterest_Expense = Debt × ΔRate

2. Tax Benefit from Interest Deduction:
   ΔTax_Benefit = ΔInterest_Expense × Tax_Rate

3. Net Income Change:
   ΔNI = -ΔInterest_Expense + ΔTax_Benefit
        = -(Debt × ΔRate) + (Debt × ΔRate × Tax_Rate)
        = -Debt × ΔRate × (1 - Tax_Rate)

4. Interest Coverage Ratio Change:
   ΔICR = -ΔInterest_Expense / (EBITDA/Old_ICR)

5. Dividend Change:
   ΔDividend = ΔNI × Dividend_Payout_Ratio

6. Stock Price Impact:
   ΔPrice = ΔDividend / Old_Price × Price_Elasticity

Example with +0.5% rate increase:
  Debt = 285B won
  Tax Rate = 25%

  ΔInterest_Expense = 285B × 0.005 = 1.425B won
  ΔTax_Benefit = 1.425B × 0.25 = 0.356B won
  ΔNI = -1.425B + 0.356B = -1.069B won
  → Net Income drops 10.2%

  Old ICR = 2.95x
  New ICR = 2.95 - 0.49 = 2.46x

  ΔDividend = -1.069B × 0.40 = -0.428B won
  ΔPrice = -428M / 4,178B × 100% = -10.2%
```

---

## 🏗️ Level 4: Property-Level Cost Breakdown

### Equation 4.1: Property-Specific Profitability

**목적:** 각 부동산 프로젝트별 수익성 계산

```
Equation 4.1: Property Net Operating Income

NOI_Property = Gross_Rental_Income - Operating_Expenses

For each property i:

Gross_Rental_Income_i = Property_Value_i × Occupancy_i × Rental_Yield_i

Operating_Expenses_i = Maintenance_i + Management_i + Tax_i + Insurance_i

NOI_i = Gross_Rental_Income_i - Operating_Expenses_i

Example (Property 1 - Seoul Office Building):
  Property Value: 500B won
  Annual Rental Yield: 4% (market rate)
  Occupancy Rate: 95%

  Gross Rental Income = 500B × 0.04 × 0.95 = 19B won

  Operating Expenses:
    ├─ Maintenance: 500B × 0.004 = 2B won
    ├─ Management Fees: 19B × 0.05 = 0.95B won
    ├─ Property Tax: 500B × 0.002 = 1B won
    └─ Insurance: 0.5B won
  Total OpEx = 4.45B won

  NOI = 19B - 4.45B = 14.55B won/year

ROI on Property:
  ROI = NOI / Property_Value = 14.55B / 500B = 2.91%
```

---

### Equation 4.2: Cost Structure Change with Interest Rate

**목적:** 금리 변화가 특정 프로젝트의 원가에 미치는 영향

```
Equation 4.2: Interest Allocation per Property

For portfolio with multiple properties:

Total_Debt = 285B won (company-wide)
Debt_Allocation_i = Total_Debt × (Property_Value_i / Total_Property_Value)

Example:
  Total Property Value = 800B won

  Property 1 (Seoul, 500B):
    Allocated Debt = 285B × (500B/800B) = 178.125B won
    Interest (2.5%): 178.125B × 0.025 = 4.453B won/year
    Interest (3.0%): 178.125B × 0.030 = 5.344B won/year
    ΔInterest = +0.891B won/year

  Property 2 (Busan, 300B):
    Allocated Debt = 285B × (300B/800B) = 106.875B won
    Interest (2.5%): 106.875B × 0.025 = 2.672B won/year
    Interest (3.0%): 106.875B × 0.030 = 3.206B won/year
    ΔInterest = +0.534B won/year
```

---

## 🔗 Level 3: Cross-Company Relationships

### Equation 3.8: Bank Relationship Impact

**목적:** 은행과 부동산 회사의 상호작용

```
Equation 3.8: Loan Portfolio Risk

Bank_Default_Risk_RE = Σ (Loan_Amount_i × Default_Probability_i)

Where Default_Probability_i depends on:
  ├─ Interest Coverage Ratio
  ├─ Occupancy Rate
  ├─ Property Market Value
  └─ Company Financial Health

Example:
  Shinhan Bank has 1T won in RE sector loans distributed among:

  신한알파리츠: 200B won, ICR=2.95x (low risk)
  이리츠코크렙: 300B won, ICR=2.10x (medium risk)
  NH프라임리츠: 250B won, ICR=1.80x (high risk)
  기타: 250B won (varied risk)

When interest rate increases 0.5%:
  신한알파리츠: ICR 2.95x → 2.46x (still safe)
  이리츠코크렙: ICR 2.10x → 1.65x (becomes risky!)
  NH프라임리츠: ICR 1.80x → 1.35x (becomes very risky!)

Bank's Provision Increase:
  Old Default Rate: 2% of portfolio
  New Default Rate: 4% of portfolio (doubled due to rate)
  ΔProvision = 1T × (4% - 2%) = 20B won

  → Shinhan Bank's Net Income ↓ by 20B won
  → But Shinhan's NIM ↑ by 50B won
  → Net Effect: +30B won (still positive!)
```

---

## 📋 Summary: Equation Reference Table

| 번호 | Equation | Input Variables | Output | Used By |
|------|----------|-----------------|--------|---------|
| 2.1 | Sector Interest Sensitivity | Avg Debt Ratio, ΔRate | Sector Revenue Change | Market Structuring |
| 3.1 | Balance Sheet | Assets, Liabilities, Equity | Debt Ratio | All Teams |
| 3.2 | Income Statement | Rental Income, OpEx, Rate | Net Income | Quant, Data |
| 3.3 | Cash Flow | NI, CapEx | Free Cash Flow | Quant, Finance |
| 3.4 | Interest Coverage | EBITDA, Interest | Health Metric | SimViz, UI |
| 3.5 | Debt-to-Equity | Debt, Equity | Leverage Ratio | SimViz, UI |
| 3.6 | Dividend Yield | Dividend, Price | Shareholder Return | UI, Investor |
| 3.7 | Rate Sensitivity | All Above | Comprehensive Impact | Quant, SimViz |
| 3.8 | Bank Risk | ICR, Loan Amount | Bank Provision | Cross-sector |

---

## 🎯 Implementation Rules for All Teams

### Rule 1: Every Calculation Must Reference an Equation
```
❌ Wrong:
  ni = rental_income - opex - interest

✅ Correct:
  # Equation 3.2: Net Income Calculation
  ni = (rental_income - opex) - (debt * interest_rate) - taxes
```

### Rule 2: Data Must Match Equation Inputs
```
If using Equation 3.2 (Income Statement):
  Inputs needed:
  ├─ rental_income (from Equation 3.2.1)
  ├─ opex (from Equation 3.2.2)
  ├─ debt (from Equation 3.1 - Balance Sheet)
  ├─ interest_rate (Macro Variable)
  └─ tax_rate (Company constant)
```

### Rule 3: Validation Tests
```
Every implementation must pass:

Test 1: Dimensional Analysis
  ├─ All money amounts in same currency
  ├─ All rates in consistent units (% or decimal)
  └─ All time periods consistent (annual)

Test 2: Reasonableness Check
  ├─ Interest Coverage 1.5x - 4.0x (normal range)
  ├─ Dividend Yield 2% - 6% (normal for RE)
  └─ OCF > CapEx (sustainable)

Test 3: Sensitivity Check
  ├─ Rate +1% → NI change in expected direction
  ├─ Occupancy +10% → Revenue increases
  └─ OpEx changes affect NI proportionally
```

---

## 📚 How Each Team Uses These Equations

### Team Quant
```
→ Implements Equations 3.2 through 3.8
→ Calculates rate sensitivities
→ Creates scenario models
→ References: All equations
```

### Team Data
```
→ Collects data for Equation 3.1 (Balance Sheet)
→ Maintains Macro Variables (Section 1)
→ Tracks occupancy, rental rates (Equation 4.1)
→ Validates data matches equation requirements
→ References: Equations 3.1, 4.1, Level 1
```

### Team SimViz
```
→ Visualizes outputs from Equations 3.4-3.7
→ Creates circuit diagrams showing Equation 3.2 flows
→ Animates rate sensitivity (Equation 3.7)
→ Shows cross-company impacts (Equation 3.8)
→ References: All equations
```

### Team UI
```
→ Displays results of Equations 3.6, 3.7
→ Shows Dividend Yield (Equation 3.6)
→ Displays Health Metrics (Equations 3.4, 3.5)
→ Controls rate slider → triggers Equation 3.7
→ References: Equations 3.4-3.7
```

### Market Structuring Team
```
→ Maintains this document
→ Updates Equation 2.1 (Sector Sensitivity)
→ Defines how Macro → Sector (Section 2)
→ Maps rate changes to company impacts
→ References: All equations, validates consistency
```

---

## ✅ Validation Checklist

Before any code is written:

- [ ] Equation number clearly referenced in code comment
- [ ] All input variables defined and available
- [ ] Unit consistency verified (currency, %, time period)
- [ ] Output matches expected range (reasonableness)
- [ ] Sensitivity direction correct (+ or -)
- [ ] Cross-reference to other equations verified

---

**This is the foundation. All other work builds on these equations.**

