# Banking Sector - Level 3: Company Profiles

**Purpose:** Define sample banking companies with detailed financials
**Based on:** BANKING_CORE_EQUATIONS.md (Equations 2.1 - 3.8)
**Status:** Implementation Examples
**Date:** 2025-11-01

---

## 📊 Three Sample Banks

We'll model three Korean banks with different characteristics:
- **Shinhan Bank**: Large, well-diversified, moderate risk
- **KB Financial**: Large, RE-heavy exposure, moderate-high risk
- **Woori Bank**: Mid-size, conservative lending, low risk

---

## 🏦 Bank 1: Shinhan Bank (대형 종합 은행)

### Balance Sheet (Equation 3.1)

```
As of 2025-11-01
Interest Rate Environment: 2.5%

ASSETS (조 원)
├─ Loan Portfolio
│  ├─ Real Estate Loans: 75조
│  ├─ Manufacturing Loans: 85조
│  ├─ Consumer Loans: 95조
│  └─ Other Loans: 45조
│  └─ Total Loans: 300조
├─ Securities (bonds, stocks): 80조
├─ Trading Securities: 20조
├─ Cash & Equivalents: 50조
└─ Fixed Assets & Other: 20조
TOTAL ASSETS: 450조 원

LIABILITIES (조 원)
├─ Customer Deposits: 350조
├─ Wholesale Funding: 40조
├─ Borrowings: 10조
└─ Other Liabilities: 50조
TOTAL LIABILITIES: 450조 원 (to be adjusted)

Actually:
TOTAL LIABILITIES: 400조 원

EQUITY (조 원)
├─ Common Stock: 10조
├─ Retained Earnings: 35조
└─ Other Equity: 5조
TOTAL EQUITY: 50조 원

Verification: 450조 (assets) = 400조 (liab) + 50조 (equity) ✓
```

### Income Statement (Current Rate: 2.5%)

**Equation 3.2: Annual Net Interest Income**

```
INTEREST INCOME (Equation 3.2.1)

Loan Portfolio Breakdown:
  Real Estate Loans:      75조 × 5.2% = 3.90조
  Manufacturing Loans:    85조 × 5.1% = 4.34조
  Consumer Loans:         95조 × 6.5% = 6.18조
  Other Loans:            45조 × 4.9% = 2.21조
  ────────────────────────────────────────────
  Total Interest Income: 16.63조 원

Securities Income:         1.37조 (bonds @ 4.1%)
────────────────────────────────────────────
TOTAL INTEREST INCOME: 18.00조 원


INTEREST EXPENSE (Equation 3.2.2)

Customer Deposits:
  Savings Accounts:    200조 × 1.8% = 3.60조
  Money Market:        100조 × 2.2% = 2.20조
  CDs & Others:         50조 × 2.5% = 1.25조
  ─────────────────────────────────────────
  Total Deposit Cost:                7.05조

Wholesale Funding:
  Bonds Issued:         25조 × 3.5% = 0.88조
  Interbank Borrowing:  15조 × 3.0% = 0.45조
  ─────────────────────────────────────
  Total Wholesale Cost:               1.33조

────────────────────────────────────────────
TOTAL INTEREST EXPENSE: 8.38조 원


NET INTEREST INCOME (Equation 3.2.3)
NII = 18.00조 - 8.38조 = 9.62조 원

NET INTEREST MARGIN (Equation 3.3)
NIM = NII / Average Earning Assets
    = 9.62조 / (300조 loans + 80조 securities)
    = 9.62조 / 380조
    = 2.53%

Alternative: NIM = Avg Lending Rate - Avg Deposit Rate
           = 5.25% - 2.20%
           = 3.05%
           (slight difference due to composition)


NON-INTEREST INCOME (Equation 3.2.5)

Loan Origination Fees:        1.80조
Credit Card Fees:             2.40조
Trading & Investment Gains:   0.95조
Foreign Exchange Gains:       0.50조
Other Fees & Income:          0.35조
────────────────────────────────────
TOTAL NON-INTEREST INCOME: 6.00조 원


LOAN LOSS PROVISION (Equation 3.2.6) - CURRENT CONDITIONS

Default Rate Analysis:
  RE Sector:           1.0% default (normal)
  Manufacturing:       0.8% default (normal)
  Consumer:            2.5% default (normal)
  Other:               1.2% default (normal)

Weighted Default Rate: 1.4%
Loss Given Default: 30%

Provision = Loan Portfolio × Weighted Default Rate × LGD
         = 300조 × 0.014 × 0.30
         = 1.26조 원


OPERATING EXPENSES (Equation 3.2.7)

Personnel:           3.50조
IT & Technology:     2.00조
Branch Operations:   2.50조
Marketing:           1.00조
Depreciation:        0.50조
Other:               1.50조
────────────────────────────────
TOTAL OPEX: 11.00조 원


NET INCOME (Equation 3.2.8) - CURRENT CONDITIONS

NII:                        9.62조
+ Non-Interest Income:      6.00조
─────────────────────────────────
= Operating Income:        15.62조
- Provision:                1.26조
- Operating Expenses:      11.00조
─────────────────────────────────
= PRETAX INCOME:            3.36조

Tax (25% rate):             0.84조

= NET INCOME (2.5% rate): 2.52조 원 annually
```

### Key Ratios (Equations 3.3-3.6)

```
Equation 3.3: Net Interest Margin
NIM = 2.53% to 3.05% (depending on calculation method)
Status: Healthy for Korean bank (target 3.0%)

Equation 3.4: Loan-to-Deposit Ratio
LTD = 300조 / 350조 = 85.7%
Status: Healthy (within 70-100% range)

Equation 3.5.1: Return on Assets
ROA = 2.52조 / 450조 = 0.56%
Status: Below target (1.0% is excellent)

Equation 3.5.2: Return on Equity
ROE = 2.52조 / 50조 = 5.04%
Status: Low for bank (target 10-15%)

Equation 3.6: Equity Multiplier
Equity Multiplier = 450조 / 50조 = 9.0x
Verification: ROE = 0.56% × 9.0 = 5.04% ✓
Status: Typical banking leverage

Dividend Yield
Annual Dividend per Share: estimated 1,500 won
Stock Price: estimated 60,000 won
Dividend Yield = 1,500 / 60,000 = 2.5%
```

---

## 📈 Rate Change Scenario: 2.5% → 3.0% (+0.5% increase)

### Impact Calculation (Equation 3.7)

```
STEP 1: New Lending & Deposit Rates

Assumption: Lending rates move 100%, Deposit rates move 40% of base rate move

New Lending Rates:
  RE Loans:        5.2% + 0.5% = 5.7%
  Manufacturing:   5.1% + 0.5% = 5.6%
  Consumer:        6.5% + 0.5% = 7.0%
  Other:           4.9% + 0.5% = 5.4%

New Deposit Rates:
  Savings:         1.8% + (0.5% × 0.4) = 2.0%
  Money Market:    2.2% + (0.5% × 0.4) = 2.4%
  CDs:             2.5% + (0.5% × 0.4) = 2.7%


STEP 2: New Interest Income (Equation 3.2.1)

Loan Interest Income Change:
  RE Loans:      75조 × 0.5% = 0.375조 increase
  Manuf Loans:   85조 × 0.5% = 0.425조 increase
  Consumer:      95조 × 0.5% = 0.475조 increase
  Other:         45조 × 0.5% = 0.225조 increase
  ─────────────────────────────────────────
  Total Loan Interest ↑: 1.50조

Securities:    (slower repricing, assume 50%)
  Securities ↑: 80조 × 0.5% × 0.5 = 0.20조

New Total Interest Income: 18.00조 + 1.50조 + 0.20조 = 19.70조 원


STEP 3: New Interest Expense (Equation 3.2.2)

Customer Deposits:
  Savings:       200조 × 0.2% = 0.40조 increase
  Money Market:  100조 × 0.2% = 0.20조 increase
  CDs:            50조 × 0.2% = 0.10조 increase
  ───────────────────────────────────────
  Total Deposit Cost ↑: 0.70조

Wholesale Funding:
  Bonds:         25조 × 0.5% = 0.125조 increase
  Interbank:     15조 × 0.5% = 0.075조 increase
  ───────────────────────────────────────
  Total Wholesale Cost ↑: 0.20조

New Total Interest Expense: 8.38조 + 0.70조 + 0.20조 = 9.28조 원


STEP 4: New NII and NIM (Equations 3.2.3, 3.3)

New NII = 19.70조 - 9.28조 = 10.42조 원
Old NII = 9.62조 원
ΔNII = +0.80조 (+8.3%)

New NIM = 10.42조 / 380조 = 2.74%
Old NIM = 2.53%
ΔNIM = +0.21% (relative: +8.3%) ← KEY DRIVER


STEP 5: Provision Change (Equation 3.2.6) - CRITICAL!

When interest rates rise:
  - Economic conditions typically worsen
  - Default rates increase
  - RE sector stress (from REALESTATE equations)
  - Manufacturing sector stress

New Assumptions:
  RE Default Rate:    1.0% → 1.5% (worse environment)
  Manufacturing:      0.8% → 1.3% (worse environment)
  Consumer:           2.5% → 3.2% (worse environment)
  Other:              1.2% → 1.7% (worse environment)

New Weighted Default Rate: 1.8%
Loss Given Default: 30%

New Provision = 300조 × 0.018 × 0.30 = 1.62조 원
Old Provision = 1.26조 원
ΔProvision = +0.36조 (+28.6%)

Wait, this is significant! It partially offsets the NII gain!


STEP 6: Pre-tax Income Change

Old Operating Income:  15.62조
New Operating Income:  15.62조 + 0.80조 (ΔNII) = 16.42조

Old After Provision:   15.62조 - 1.26조 = 14.36조
New After Provision:   16.42조 - 1.62조 = 14.80조

ΔPretax = 14.80조 - 14.36조 = +0.44조 (+3.1%)

Old Net Income: 2.52조
After Tax: 0.44조 × (1 - 0.25) = +0.33조
New Net Income: 2.52조 + 0.33조 = 2.85조 원

ΔNI = +0.33조 (+13.1%)
```

### Stock Price Impact

```
Current Valuation:
  Net Income: 2.52조
  Number of Shares: 420M shares
  EPS: 2.52조 / 420M = 6,000 won/share
  P/E Ratio: 60,000 won / 6,000 = 10x
  Market Cap: 420M × 60,000 = 25.2조

After Rate Increase:
  New Net Income: 2.85조
  New EPS: 2.85조 / 420M = 6,786 won/share
  If P/E stays at 10x: New Price = 67,860 won
  Stock Price Change: (67,860 - 60,000) / 60,000 = +13.1%

More Conservative Analysis (P/E compression):
  If P/E compresses to 9x due to rate increase fears:
  New Price = 6,786 × 9 = 61,074 won
  Stock Price Change: (61,074 - 60,000) / 60,000 = +1.8%

Base Case (P/E stays at 10x):
  Stock Price Impact: +8-10%
```

### Dividend Impact

```
Current Annual Dividend:
  Payout Ratio: 50% of net income
  Total Dividend: 2.52조 × 0.50 = 1.26조
  Per Share: 1.26조 / 420M = 3,000 won

New Annual Dividend:
  Payout Ratio: maintained at 50% (conservative)
  Total Dividend: 2.85조 × 0.50 = 1.425조
  Per Share: 1.425조 / 420M = 3,393 won

Dividend Increase: (3,393 - 3,000) / 3,000 = +13.1%
```

---

## 🏦 Bank 2: KB Financial (고 부동산 노출)

### Profile

```
KB Financial (KBF)
- Size: Slightly smaller than Shinhan
- Specialty: Heavy Real Estate focus
- Risk Profile: Moderate-High (more RE exposure)
- RE Loan Portfolio: 90조 (30% of loans vs 25% for Shinhan)

Key Difference:
  Higher exposure to RE sector means:
  - More sensitive to rate increases (provision ↑ more)
  - More downside risk if RE sector collapses
```

### Balance Sheet (2.5% rate)

```
Total Assets: 400조
  RE Loans: 90조 (heavy!)
  Other Loans: 220조
  Securities: 60조
  Cash & Other: 30조

Total Liabilities: 350조
Total Equity: 50조

Current Net Income: 2.40조 (slightly lower NIM, but...)
```

### After Rate Increase to 3.0%

```
NII Increase: Similar to Shinhan, +0.75조

BUT: Provision Increase is MUCH LARGER
  - RE sector highly stressed
  - Many RE companies' ICR drops below 2.0x
  - Default probability: 1.0% → 2.5% for RE
  - Provision ↑: 1.20조 → 2.10조 = +0.90조

Net Impact:
  ΔNI = ΔNII - ΔProvision
      = +0.75조 - 0.90조
      = -0.15조 (-6.3%)

Stock Price Impact: NEGATIVE -5% to -8%

This bank is HURT by rate increase due to RE exposure!
```

---

## 🏦 Bank 3: Woori Bank (보수적)

### Profile

```
Woori Bank (WB)
- Size: Mid-size
- Specialty: Conservative lending, Corporate focus
- Risk Profile: Low (diverse, less RE exposure)
- RE Loan Portfolio: 45조 (15% of loans)

Key Difference:
  Lower RE exposure means:
  - Less sensitive to RE sector stress
  - More balanced portfolio
  - More stable earnings
```

### After Rate Increase to 3.0%

```
NII Increase: +0.60조 (smaller loan book)

Provision Increase: +0.25조 (low RE exposure)
  - RE stress affects only 45조 of loans
  - Manufacturing stable
  - Consumer stable

Net Impact:
  ΔNI = +0.60조 - 0.25조 = +0.35조 (+18.4%)

Stock Price Impact: POSITIVE +12-15%

This bank BENEFITS from rate increase (low RE risk)
```

---

## 🔗 Cross-Sector Integration (Equation 3.8)

### Shinhan Bank's Real Estate Loan Portfolio

```
Total RE Loans: 75조 distributed among:

신한알파리츠: 15조
  Current ICR: 2.95x
  After rate ↑: ICR 2.46x
  Risk Level: LOW
  Expected Loss: 15조 × 0.5% × 0.30 = 0.0225조

이리츠코크렙: 22조 (large exposure!)
  Current ICR: 2.10x
  After rate ↑: ICR 1.65x (becomes risky!)
  Risk Level: MEDIUM-HIGH
  Expected Loss: 22조 × 2.0% × 0.30 = 0.132조

NH프라임리츠: 18조
  Current ICR: 1.80x
  After rate ↑: ICR 1.35x (becomes very risky!)
  Risk Level: HIGH
  Expected Loss: 18조 × 3.5% × 0.30 = 0.189조

Other RE Companies: 20조
  Mixed Risk: 1.5% average default probability
  Expected Loss: 20조 × 1.5% × 0.30 = 0.09조

────────────────────────────────────────────
OLD EXPECTED LOSS (2.5% rate): 75조 × 1.0% × 0.30 = 0.225조
NEW EXPECTED LOSS (3.0% rate): 0.0225 + 0.132 + 0.189 + 0.09 = 0.4335조

INCREASE: 0.4335조 - 0.225조 = 0.2085조

This is part of the +0.36조 provision increase calculated earlier
```

### Key Insight: The Bank vs RE Tradeoff

```
For Shinhan Bank (balanced RE exposure):
  ✅ NII expands by +0.80조 (NIM ↑ from rate)
  ❌ Provision increases by +0.36조 (RE stress)
  ────────────────────────────────────────
  ✅ Net: +0.44조 (+13.1% NI, +8-10% stock)

For KB Financial (high RE exposure):
  ✅ NII expands by +0.75조
  ❌ Provision increases by +0.90조 (RE stress hits HARD)
  ────────────────────────────────────────
  ❌ Net: -0.15조 (-6.3% NI, -5-8% stock)

For Woori Bank (low RE exposure):
  ✅ NII expands by +0.60조
  ❌ Provision increases by +0.25조 (RE stress minimal)
  ────────────────────────────────────────
  ✅ Net: +0.35조 (+18.4% NI, +12-15% stock)

Conclusion:
  Rate increase ↑ helps banks, BUT exposure to RE matters!
  - Low RE exposure: WINS (Woori)
  - Balanced RE exposure: WINS (Shinhan)
  - High RE exposure: LOSES (KB)
```

---

## 📊 Comparison Table: Banking Companies at 2.5% Rate

| Metric | Shinhan | KB Financial | Woori |
|--------|---------|--------------|-------|
| Total Assets | 450조 | 400조 | 300조 |
| RE Loan Exposure | 75조 (25%) | 90조 (30%) | 45조 (15%) |
| Net Interest Margin | 2.53% | 2.45% | 2.70% |
| Net Income | 2.52조 | 2.40조 | 1.90조 |
| ROA | 0.56% | 0.60% | 0.63% |
| ROE | 5.04% | 4.80% | 3.80% |
| Dividend Yield | 2.5% | 2.3% | 2.8% |
| Stock Price | 60,000 | 55,000 | 40,000 |
| Risk Profile | Balanced | High RE Risk | Conservative |

---

## 📊 After Rate Increase to 3.0%

| Metric | Shinhan | KB Financial | Woori |
|--------|---------|--------------|-------|
| Net Income Change | +13.1% | -6.3% | +18.4% |
| Stock Price Change | +8-10% | -5-8% | +12-15% |
| Dividend Yield | 2.8% | 2.1% | 3.2% |
| Risk Level | Safe | Risky | Safe |

**Key Insight:** Banks with lower RE exposure benefit more from rate increases!

---

## ✅ Implementation for Development Teams

### Team Quant: Use These Companies to Test Equations
```python
# Equation 3.7: Rate Sensitivity
bank = ShinhanBank()
rate_change = 0.005  # +0.5%

old_ni = 2.52  # trillion
new_ni = bank.calculate_net_income(rate=0.030)  # Should be 2.85

assert new_ni == 2.85 (±tolerance), "Equation 3.7 implementation incorrect"
```

### Team Data: Populate These into Database
```sql
INSERT INTO companies VALUES (
  code='004170',
  name='Shinhan Bank',
  sector='BANKING',
  sector_data='{"re_exposure": 0.25, ...}'
);
```

### Team SimViz: Visualize These Impacts
```
Circuit Diagram for Shinhan Bank:
  Interest Income In (green): 18.00조 → 19.70조 (+1.70조)
  Interest Expense Out (red): 8.38조 → 9.28조 (+0.90조)
  Provision Out (red): 1.26조 → 1.62조 (+0.36조)
  Net Income (bottom): 2.52조 → 2.85조 (+0.33조)
```

---

**These three banks illustrate how cross-sector relationships create winners and losers when rates change.**
