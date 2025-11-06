# Banking Sector - Core Financial Equations

**Purpose:** Define fundamental financial equations for Banking sector
**Audience:** Team Quant, Team Data, Team SimViz, Team UI, Market Structuring Team
**Date:** 2025-11-01
**Status:** Core Foundation (All development depends on this)

---

## 🎯 Principle

**One Source of Truth for Banking Sector**

```
Banking Core Equations (This Document)
    ↓
├─→ Team Quant: Implements these formulas
├─→ Team Data: Collects data for these inputs
├─→ Team SimViz: Visualizes these outputs
├─→ Team UI: Displays these results
└─→ Market Structuring: Maintains this as reference
```

**Every line of Banking code must reference which equation it implements.**

---

## 📐 Level 1: Macro Variables Affecting Banking

### Definition
Variables that affect ALL banking companies equally (macro level)

```typescript
// Banking은 다음 Macro Variables에 영향받음
interface BankingMacroImpact {
  // PRIMARY (최고 영향)
  interest_rate: {
    symbol: "r",
    unit: "% per annum",
    range: "0% - 10%",
    impact_type: "POSITIVE",
    description: "기준금리 인상 → 순이자마진(NIM) 확대"
  },

  // SECONDARY (중간 영향)
  inflation_rate: {
    symbol: "π",
    unit: "% per annum",
    range: "0% - 10%",
    impact_type: "MIXED",
    description: "인플레이션 ↑ → 금리 더 올라갈 가능성 높음"
  },

  credit_spread: {
    symbol: "s_credit",
    unit: "basis points (bps)",
    range: "100 - 500 bps",
    impact_type: "NEGATIVE",
    description: "신용스프레드 확대 → 대출 신청자 줄어듦"
  },

  m2_money_supply: {
    symbol: "M2",
    unit: "Trillions",
    range: "500T - 3000T",
    impact_type: "POSITIVE",
    description: "유동성 공급 ↑ → 대출 기회 ↑"
  }
}
```

---

## 💼 Level 2: Banking Sector-Specific Metrics

### Equation 2.1: Sector-Level Interest Rate Sensitivity

**문제:** 금리가 오르면 은행 섹터의 수익이 얼마나 변하는가?

```
Banking_Interest_Sensitivity = +β_Banking

β_Banking = Sector Average NIM Sensitivity to Rate

Example:
  Average NIM in Banking Sector = 3.0% (Lending Rate - Deposit Rate)
  For 1% interest rate increase:
    Sector Revenue Impact = +β_Banking × ΔRate
                          = +0.30 × 0.01
                          = +0.3% (POSITIVE!)
```

**Formula:**

```
Equation 2.1 (Banking):
ΔRevenue_Sector = +β_Banking × ΔRate

Where:
  ΔRevenue_Sector = 섹터 평균 순이자수익 변화율 (%)
  β_Banking = 은행 섹터의 평균 NIM 민감도 (0-1)
  ΔRate = 금리 변화 (percentage points)

Example:
  ΔRate = +0.5% (금리 2.5% → 3.0%)
  β_Banking = 0.30 (NIM이 금리의 30% 만큼 확대)
  ΔRevenue_Sector = +0.30 × 0.005 = +0.0015 = +0.15%
```

**Interpretation:**
- 은행 섹터는 평균 +0.15% 순이자수익 증가

---

## 🏢 Level 3: Individual Banking Company Financial Structure

### Equation 3.1: Banking Balance Sheet

**목적:** 각 은행의 재무상태를 정의

```
Equation 3.1: Balance Sheet Identity (Same as Real Estate)

Assets = Liabilities + Equity

Where:
  Assets = Loan Portfolio + Cash + Securities + Other
  Liabilities = Customer Deposits + Debt (wholesale funding)
  Equity = Shareholders' Equity
```

**Detailed:**

```typescript
interface BankingBalanceSheet {
  // ASSETS
  assets_total: number;  // Total Assets (원)

  assets_breakdown: {
    loan_portfolio: number;              // A1: 대출금 (핵심 자산)
    cash_and_equivalents: number;        // A2: 현금 및 현금성자산
    securities: number;                  // A3: 증권 (채권 등)
    trading_securities: number;          // A4: 매매증권
    fixed_assets: number;                // A5: 고정자산
    other_assets: number;                // A6: 기타자산
  },

  // LIABILITIES (자금조달)
  liabilities_total: number;  // Total Liabilities

  liabilities_breakdown: {
    customer_deposits: number;           // L1: 고객예금 (주요 자금원)
    wholesale_funding: number;           // L2: 도매자금 (시장차입)
    borrowings: number;                  // L3: 차입금
    other_liabilities: number;           // L4: 기타부채
  },

  // EQUITY
  equity: {
    common_stock: number;                // E1: 보통주자본
    retained_earnings: number;           // E2: 이익잉여금
    other_equity: number;                // E3: 기타자본
    total_equity: number;                // E_total
  }
}
```

**Example (Korean Bank):**

```
Shinhan Bank (예시)
Assets:
  ├─ Loan Portfolio: 300T won (주요 수익원)
  ├─ Securities: 80T won
  ├─ Cash: 50T won
  └─ Other: 20T won
  └─ Total: 450T won

Liabilities:
  ├─ Customer Deposits: 350T won (대부분의 자금)
  ├─ Wholesale Funding: 50T won
  └─ Total: 400T won

Equity:
  └─ Total Equity: 50T won (= 450T - 400T)

Key Ratios:
  Loan-to-Deposit Ratio = 300T / 350T = 0.857 (86%)
  Equity Multiplier = 450T / 50T = 9.0x
```

---

### Equation 3.2: Annual Net Interest Income Statement

**목적:** 금리 변화가 은행의 순이자수익(NIM)에 미치는 영향

```
Equation 3.2: Banking Net Income Calculation

Net Income = Net Interest Income + Non-Interest Income - Loan Loss Provision - Operating Expenses

Detailed Breakdown:

NI = (Interest Income - Interest Expense) + Non-Interest Income - Provision - OpEx
   = (Lending Revenue - Deposit Cost) + Fees - Provision - OpEx
```

**Detailed Formula:**

```
Equation 3.2.1: Interest Income (대출 이자수익)

Interest_Income = Σ (Loan_i × Lending_Rate_i) for all loans

Example:
  Total Loan Portfolio: 300T won
  Average Lending Rate: 5.0%
  Interest Income = 300T × 0.05 = 15T won/year
```

```
Equation 3.2.2: Interest Expense (예금 이자비용)

Interest_Expense = Σ (Deposit_i × Deposit_Rate_i) + Wholesale_Cost

Example:
  Customer Deposits: 350T won
  Average Deposit Rate: 2.0%
  Interest Expense (Deposits) = 350T × 0.02 = 7T won/year

  Wholesale Funding: 50T won
  Average Cost: 3.5%
  Interest Expense (Wholesale) = 50T × 0.035 = 1.75T won/year

  Total Interest Expense = 7T + 1.75T = 8.75T won/year
```

```
Equation 3.2.3: Net Interest Income (순이자수익)

NII = Interest_Income - Interest_Expense

Example:
  NII = 15T - 8.75T = 6.25T won/year
```

```
Equation 3.2.4: Net Interest Margin (NIM) ← KEY METRIC!

NIM = Net_Interest_Income / Average_Earning_Assets

Example:
  NII = 6.25T won
  Average Earning Assets = (300T loans + 80T securities) = 380T
  NIM = 6.25T / 380T = 1.64%

Alternative calculation:
  NIM = (Average Lending Rate - Average Deposit Rate)
      = 5.0% - 2.0%
      = 3.0%
```

```
Equation 3.2.5: Non-Interest Income (부가수익)

Non-Interest_Income = Fees + Trading_Gains + Other_Income

Example:
  Loan Origination Fees: 1.2T won
  Trading Gains: 0.5T won
  Credit Card Fees: 0.8T won
  Other: 0.5T won
  Total = 3.0T won/year
```

```
Equation 3.2.6: Loan Loss Provision (대손충당금) ← CRITICAL FOR RATE IMPACT

Provision = Loan_Portfolio × Default_Rate × Loss_Given_Default

Where Default_Rate depends on:
  ├─ Economic Cycle (금리 영향 큼)
  ├─ Borrower Sector Health (부동산 부실 ↑ → provision ↑)
  └─ Credit Spread (신용스프레드 ↑ → risk ↑)

Example (Current 2.5% rate):
  Default Rate = 1.0% (normal times)
  Loss Given Default = 30%
  Provision = 300T × 0.01 × 0.30 = 0.9T won/year

Example (After rate increase to 3.0%):
  Default Rate = 1.5% (worse economic conditions)
  Loss Given Default = 30%
  Provision = 300T × 0.015 × 0.30 = 1.35T won/year
  ΔProvision = +0.45T won/year (COST!)
```

```
Equation 3.2.7: Operating Expenses (운영비)

OpEx = Personnel + Technology + Branches + Other

Example:
  Personnel Costs: 2.0T won
  IT & Technology: 1.0T won
  Branch Operations: 1.5T won
  Other: 0.5T won
  Total OpEx = 5.0T won/year
```

```
Equation 3.2.8: Net Income (최종 순이익)

Net Income = NII + Non-Interest Income - Provision - OpEx

Example (Current 2.5% rate):
  NII = 6.25T won
  Non-Interest Income = 3.0T won
  Provision = 0.9T won
  OpEx = 5.0T won
  Net Income = 6.25T + 3.0T - 0.9T - 5.0T = 3.35T won/year

Example (After rate increase to 3.0%):
  NII = 6.75T won (↑ because lending rate ↑ more than deposit rate)
  Non-Interest Income = 3.0T won (same)
  Provision = 1.35T won (↑ because default risk ↑)
  OpEx = 5.0T won (same)
  Net Income = 6.75T + 3.0T - 1.35T - 5.0T = 3.4T won/year

  ΔNI = 3.4T - 3.35T = +0.05T won (+1.5%)

  Wait! That's small... why? Because:
  - Interest Income ↑ (+0.5T from NIM expansion)
  - BUT Provision ↑ (+0.45T from more defaults)
  - Net = only +0.05T
```

---

## 📊 Level 3: Key Financial Ratios

### Equation 3.3: Net Interest Margin (NIM) ← MOST IMPORTANT!

**목적:** 은행의 핵심 수익성 지표

```
Equation 3.3: Net Interest Margin

NIM = (Interest Income - Interest Expense) / Average Earning Assets

Or simplified:
NIM = (Average Lending Rate - Average Deposit Rate)

Example:
  Lending Rate: 5.0% (changes with base rate)
  Deposit Rate: 2.0% (changes less than lending rate)
  NIM = 5.0% - 2.0% = 3.0%

Rate Increase Scenario (+0.5%):
  Old: 5.0% - 2.0% = 3.0%
  New: 5.35% - 2.15% = 3.20% ← NIM WIDENS!
  ΔNIM = +0.20% (relative: +6.7%)
```

**Why This Matters:**
```
NIM Expansion = Bank Profit Engine

When rates rise:
  - Banks raise lending rates FAST ↑↑
  - Banks raise deposit rates SLOW ↑
  - Difference (NIM) WIDENS
  - Bank profits EXPAND

This is the OPPOSITE of Real Estate:
  - RE companies borrow at HIGHER rates
  - RE rental income SAME
  - Interest costs UP
  - RE profits SHRINK
```

---

### Equation 3.4: Loan-to-Deposit Ratio (LTD)

**목적:** 은행의 유동성 및 자금 건전성

```
Equation 3.4: Loan-to-Deposit Ratio

LTD = Total Loans / Total Customer Deposits

Example:
  Total Loans: 300T won
  Customer Deposits: 350T won
  LTD = 300T / 350T = 0.857 = 85.7%

Interpretation:
  LTD < 70%: Overly conservative (can lend more)
  70% < LTD < 100%: Healthy (balanced)
  LTD > 100%: Need wholesale funding (risky)
```

---

### Equation 3.5: Return on Assets (ROA) & Return on Equity (ROE)

**목적:** 은행의 수익성

```
Equation 3.5.1: Return on Assets

ROA = Net Income / Average Total Assets

Example:
  Net Income: 3.35T won/year
  Total Assets: 450T won
  ROA = 3.35T / 450T = 0.744%

Interpretation:
  ROA > 1.0%: Excellent bank
  0.7% < ROA < 1.0%: Good bank
  0.5% < ROA < 0.7%: Average bank
  ROA < 0.5%: Struggling bank
```

```
Equation 3.5.2: Return on Equity

ROE = Net Income / Average Equity

Example:
  Net Income: 3.35T won/year
  Equity: 50T won
  ROE = 3.35T / 50T = 6.7%

Interpretation:
  ROE > 15%: Excellent for shareholders
  10% < ROE < 15%: Good
  8% < ROE < 10%: Acceptable
  ROE < 8%: Underperforming
```

---

### Equation 3.6: Equity Multiplier (Leverage)

**목적:** 은행이 얼마나 자산에 비해 많은 부채를 사용하는가?

```
Equation 3.6: Equity Multiplier

Equity_Multiplier = Total Assets / Total Equity

Example:
  Total Assets: 450T won
  Total Equity: 50T won
  Equity Multiplier = 450T / 50T = 9.0x

This means:
  For every 1 won of capital, bank manages 9 won of assets
  Very leveraged (typical for banks)

ROE = ROA × Equity Multiplier
    = 0.744% × 9.0
    = 6.7% ✓ (matches Equation 3.5.2)
```

---

## 🔄 Level 3: Rate Sensitivity Analysis

### Equation 3.7: Complete Rate Impact for Banking

**목적:** 금리 변화 시 은행의 모든 영향을 계산

```
Equation 3.7: Interest Rate Sensitivity (Banking)

For interest rate change ΔRate (e.g., +0.5%):

1. NIM Change:
   ΔNIM = (ΔLending_Rate - ΔDeposit_Rate)

   Assumption: Lending rates move 100%, deposit rates move 40%
   ΔNIM = (0.5% × 1.0) - (0.5% × 0.4) = 0.5% - 0.2% = 0.3%
   Relative NIM change = 0.3% / 3.0% = 10% increase

2. Interest Income Change:
   ΔInterest_Income = Loan_Portfolio × ΔLending_Rate
                    = 300T × 0.005 = 1.5T won
   But some loans reprice slower, so say 80% reprice:
   ΔInterest_Income = 300T × 0.80 × 0.005 = 1.2T won

3. Interest Expense Change:
   ΔInterest_Expense = Deposits × ΔDeposit_Rate
                     = 350T × (0.5% × 0.4) = 0.7T won

4. Net Interest Income Change:
   ΔNII = ΔInterest_Income - ΔInterest_Expense
        = 1.2T - 0.7T = 0.5T won (+8.0%)

5. Provision Change (if risk increases):
   Old Provision: 0.9T won
   New Provision: 1.35T won (worse economy)
   ΔProvision = +0.45T won (-8.3% of profit!)

6. Net Income Change:
   ΔNI = ΔNII - ΔProvision
       = 0.5T - 0.45T = +0.05T won

   Relative change = 0.05T / 3.35T = +1.5%

7. Stock Price Impact:
   Banks usually trade at 10-12x P/E
   If NI ↑1.5%, stock price might ↑ 3-5%
   (More conservative than linear because provision risk)
```

---

## 🔗 Level 3: Cross-Sector Relationships

### Equation 3.8: Bank's Real Estate Loan Portfolio Risk

**목적:** 부동산 회사의 악화가 은행에 미치는 영향

```
Equation 3.8: Bank's RE Sector Exposure

Total RE Exposure = Σ (Loan_Amount_i × Default_Probability_i × Loss_Given_Default)

Example (From REALESTATE_LEVEL3_COMPANIES.md):
  Shinhan Bank has 1T won in RE sector loans distributed among:

  신한알파리츠: 200B won, ICR=2.95x (current)
    After rate ↑: ICR=2.46x
    Default Probability: 0.5% (low)
    Expected Loss: 200B × 0.005 × 0.30 = 0.3B won

  이리츠코크렙: 300B won, ICR=2.10x (current)
    After rate ↑: ICR=1.65x (becomes risky!)
    Default Probability: 2.0% (elevated)
    Expected Loss: 300B × 0.02 × 0.30 = 1.8B won

  NH프라임리츠: 250B won, ICR=1.80x (current)
    After rate ↑: ICR=1.35x (becomes very risky!)
    Default Probability: 3.5% (very high)
    Expected Loss: 250B × 0.035 × 0.30 = 2.625B won

  Other: 250B won
    Default Probability: 1.0%
    Expected Loss: 250B × 0.01 × 0.30 = 0.75B won

Before rate increase:
  Total Expected Loss = 0.3B + 0.9B + 1.25B + 0.75B = 3.25B won
  (= 0.325% of 1T portfolio)

After rate increase:
  Total Expected Loss = 0.3B + 1.8B + 2.625B + 0.75B = 5.475B won
  (= 0.5475% of 1T portfolio)

ΔProvision = 5.475B - 3.25B = 2.225B won increase

Impact on Shinhan Bank:
  Old Net Income: 3.35T won
  Provision increase: 2.225B won
  New Net Income: 3.35T - 2.225B = 3.3277T won
  ΔNI = -0.0223T = -0.67%

Net Effect on Bank Stock:
  ΔNII (from NIM expansion): +0.5T (+14.9%)
  ΔProvision (from RE stress): -2.225B (-6.7%)
  Net: +0.5T - 2.225B = +0.4777T (+14.3% net!)

  Bank Stock Impact: Still strongly POSITIVE despite RE sector stress!
  This is why: NIM expansion > Provision increase
```

---

## 📋 Summary: Banking Equation Reference Table

| 번호 | Equation | Input Variables | Output | Used By |
|------|----------|-----------------|--------|---------|
| 2.1 | Sector Interest Sensitivity | NIM, ΔRate | Sector Revenue Change | Market Structuring |
| 3.1 | Balance Sheet | Assets, Liabilities, Equity | Loan Portfolio Size, Equity | All Teams |
| 3.2 | Income Statement | Interest Income, Expense, Provision | Net Income | Quant, Data |
| 3.3 | NIM | Lending Rate, Deposit Rate | Net Interest Margin | SimViz, UI |
| 3.4 | LTD Ratio | Loans, Deposits | Liquidity Ratio | SimViz, UI |
| 3.5 | ROA/ROE | Net Income, Assets, Equity | Profitability | SimViz, UI |
| 3.6 | Equity Multiplier | Assets, Equity | Leverage | SimViz, UI |
| 3.7 | Rate Sensitivity | All Above | Comprehensive Impact | Quant, SimViz |
| 3.8 | RE Portfolio Risk | Loan Amount, Default Prob, ICR | Bank Provision | Cross-sector |

---

## 🎯 Implementation Rules for All Teams

### Rule 1: Every Banking Calculation Must Reference an Equation

```
❌ Wrong:
  nim = lending_rate - deposit_rate

✅ Correct:
  # Equation 3.3: Net Interest Margin
  nim = lending_rate - deposit_rate  # Simplified form
  # Full form from Equation 3.2.3-3.2.2:
  nii = interest_income - interest_expense
  nim = nii / average_earning_assets
```

### Rule 2: NIM Expansion is the KEY Driver

```
Rate ↑
  ↓
Lending rates ↑↑ (fast response)
Deposit rates ↑ (slow response)
  ↓
NIM WIDENS
  ↓
Interest Income ↑↑↑
Interest Expense ↑ (less)
  ↓
Net Interest Income ↑↑
  ↓
Bank Net Income ↑

This is OPPOSITE to Real Estate:
Rate ↑
  ↓
Interest Expense ↑
Rental Income same
  ↓
Net Income ↓
```

### Rule 3: Provision Increase Offsets Some Gains

```
When rate increases:
  + NII increases (good for bank)
  - Provision increases (bad for bank, because RE/Manufacturing stress)
  = Net effect usually still positive (NII gain > Provision increase)
```

---

## 🎯 Integration with Real Estate

### How Banking Depends on Real Estate Health

```
Banking Model (This Document)
  + Real Estate Model (REALESTATE_CORE_EQUATIONS.md)
  = Cross-Sector Impact (Equation 3.8)

When calculating Bank's Net Income:
  1. Calculate ΔNII from rate change (Equation 3.7)
  2. Calculate Real Estate companies' health change (RE Equation 3.7)
  3. Calculate Bank's provision needs based on RE health (Equation 3.8)
  4. Final Bank NI = ΔNII - ΔProvision
```

---

## 📚 How Each Team Uses These Equations

### Team Quant (Banking Focus)
```
→ Implements Equations 3.1 through 3.8
→ Calculates NIM sensitivity (Equation 3.3)
→ Models provision changes (Equation 3.2.6, 3.8)
→ Creates scenario models with rate increases
→ References: All banking equations
```

### Team Data (Banking Focus)
```
→ Collects interest rate data (Macro input)
→ Maintains loan portfolio data (Equation 3.1, 3.2.1)
→ Tracks deposit rates (Equation 3.2.2)
→ Updates loan loss rates based on economic indicators
→ Maintains bank balance sheet data quarterly
→ References: Equations 3.1, 3.2.1-3.2.2, 3.8
```

### Team SimViz (Banking Visualization)
```
→ Visualizes NIM expansion (Equation 3.3)
  - Shows lending rate ↑↑ vs deposit rate ↑
  - Shows NIM widening
→ Animates provision increase (Equation 3.8)
  - Shows how RE stress increases provision
→ Creates circuit diagrams showing:
  - Interest Income flows (green, ↑ with rate)
  - Interest Expense flows (red, ↑ less with rate)
  - Provision (red, ↑ with sector stress)
→ References: Equations 3.2-3.3, 3.8
```

### Team UI (Banking Display)
```
→ Displays NIM % (Equation 3.3)
→ Shows ROA/ROE (Equation 3.5)
→ Shows LTD Ratio (Equation 3.4)
→ Displays stock price impact
→ Controls rate slider → triggers all recalculations
→ References: Equations 3.3-3.7
```

---

## ✅ Validation Checklist

Before any banking code is written:

- [ ] Equation number clearly referenced in code comment
- [ ] NIM calculation correct (Lending Rate - Deposit Rate)
- [ ] Interest Income formula: Loan Portfolio × Lending Rate
- [ ] Interest Expense formula: Deposits × Deposit Rate
- [ ] Provision increases when borrower ICR decreases
- [ ] Net Income = NII + Non-Interest Income - Provision - OpEx
- [ ] Rate sensitivity direction correct (POSITIVE for banks)
- [ ] Cross-check with Real Estate company stress (Equation 3.8)

---

**This is the foundation for Banking implementation. All code references these equations.**
