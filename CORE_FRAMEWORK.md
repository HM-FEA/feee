# Core Framework - 모든 섹터의 기초

**Purpose:** 모든 섹터가 사용하는 공통 프레임워크
**Rule:** 새 섹터 추가 시, 이 문서는 **추가만** 하고 변경 없음
**Last Updated:** 2025-11-01

---

## 🏗️ 4-Level 온톨로지 (모든 섹터 동일 구조)

```
Level 1: Macro Variables
├─ 정의: 전체 경제에 영향을 주는 변수들
├─ 예시: 금리, 관세, 환율, 인플레이션
└─ 영향: 모든 섹터에 동일하게 적용

Level 2: Sector-Specific Metrics
├─ 정의: 특정 섹터만 영향받는 지표들
├─ 예시: Banking(NIM), Real Estate(Occupancy), Manufacturing(Capacity)
└─ 영향: 해당 섹터 내 모든 회사

Level 3: Company-Level Details
├─ 정의: 개별 회사의 재무 상태
├─ 예시: Balance Sheet, Income Statement, Key Ratios
└─ 영향: 해당 회사의 주가, 배당

Level 4: Asset/Product-Level
├─ 정의: 회사 내 개별 자산/제품
├─ 예시: Banking(대출), Real Estate(부동산), Manufacturing(제품)
└─ 영향: 회사 전체 수익성에 기여
```

---

## 📐 Level 1: Macro Variables (공용)

### 정의

```typescript
interface MacroVariables {
  // 금리 환경
  interest_rate: number;        // 0-10%, 모든 차입기업 영향

  // 무역 & 관세
  tariff_rate: number;          // 0-50%, 수입/수출 기업 영향

  // 환율
  fx_rate: number;              // USD/KRW, 국제거래 기업 영향

  // 인플레이션
  inflation_rate: number;       // 0-10%, 임금/원가 영향

  // 유동성
  m2_money_supply: number;      // 통화량, 전체 경제 영향
  credit_spread: number;        // 100-500 bps, 차입 가능성 영향
}
```

### Equation 1.1: Macro Impact on Sectors

```
Impact_Sector = f(Macro_Variable, Sector_Sensitivity)

예시:
  금리 ↑ 0.5% → Banking Sector Revenue ↑ 0.3%
  금리 ↑ 0.5% → Real Estate Sector Revenue ↓ 0.25%
  관세 ↑ 10% → Manufacturing Sector Revenue ↓ 5%
```

**구현 위치:** `/docs/shared/LEVEL1_MACRO.md`

---

## 📊 Level 2: Sector-Specific Metrics (추가형)

### 공통 구조

```typescript
interface SectorMetrics {
  sector_name: string;          // "Banking", "Real Estate", etc
  sensitivity_to_rate: number;  // +/- sensitivity
  key_metric_1: number;         // 섹터별로 정의
  key_metric_2: number;         // 섹터별로 정의
}
```

### Equation 2.1: Sector-Level Sensitivity

```
ΔRevenue_Sector = Sensitivity × ΔMacro_Variable

Banking:
  ΔRevenue = +β_Banking × ΔRate
  β_Banking = 0.30 (positive, 금리↑ → 수익↑)

Real Estate:
  ΔRevenue = -β_RE × ΔRate
  β_RE = 0.50 (negative, 금리↑ → 수익↓)

Manufacturing:
  ΔRevenue = -β_Mfg × ΔTariff
  β_Mfg = 0.80 (negative, 관세↑ → 수익↓)
```

### 섹터별 추가 지표

**Banking:**
```
NIM (Net Interest Margin) = Lending Rate - Deposit Rate
Provision Rate = Expected Loan Losses
```

**Real Estate:**
```
Occupancy Rate = Occupied / Total Units
Rental Yield = Annual Rent / Property Value
```

**Manufacturing (추후):**
```
Capacity Utilization = Actual Production / Max Capacity
Labor Cost Index = Wage Level Index
```

**구현 위치:** `/docs/shared/LEVEL2_SECTOR.md`

---

## 🏢 Level 3: Company-Level Details (공용 구조)

### Equation 3.1: Balance Sheet Identity (모든 회사 공통)

```
Assets = Liabilities + Equity

상세:
Assets = Earning_Assets + Non_Earning_Assets
Liabilities = Interest_Bearing_Debt + Non_Interest_Debt
Equity = Common_Stock + Retained_Earnings
```

### Equation 3.2: Income Statement (모든 회사 공통)

```
Net Income = Revenue - Operating_Expenses - Interest_Expense - Taxes

상세:
Revenue = Core_Revenue + Other_Revenue
Operating_Expenses = Fixed_Costs + Variable_Costs
Interest_Expense = Debt × Interest_Rate  ← Rate Sensitive!
Taxes = Tax_Rate × (Revenue - Expenses - Interest)
```

### Equation 3.3: Key Ratios (모든 회사 공통)

```
Interest Coverage Ratio (ICR) = EBITDA / Interest_Expense
  - ICR > 2.5x: Safe
  - 2.0x < ICR < 2.5x: Caution
  - ICR < 2.0x: Risk

Debt-to-Equity (D/E) = Total_Debt / Total_Equity
  - D/E < 1.0x: Conservative
  - D/E > 1.5x: Aggressive

Return on Assets (ROA) = Net_Income / Assets
Return on Equity (ROE) = Net_Income / Equity
```

### Equation 3.7: Rate Sensitivity Analysis (모든 회사)

```
For interest rate change ΔRate:

1. ΔInterest_Expense = Debt × ΔRate
2. ΔTax_Benefit = ΔInterest_Expense × Tax_Rate
3. ΔNet_Income = -ΔInterest_Expense + ΔTax_Benefit
               = -Debt × ΔRate × (1 - Tax_Rate)

4. ΔICR = ΔInterest_Expense / EBITDA
5. ΔStock_Price = f(ΔNet_Income, ΔRisk)
```

**단, 섹터마다 방향이 다름:**
- Banking: Revenue ↑ > Interest Expense ↑ → Net Income ↑
- Real Estate: Interest Expense ↑ > Revenue same → Net Income ↓

### Equation 3.8: Cross-Sector Relationships

```
Bank's Risk from Borrower = Σ(Loan_Amount × Default_Probability)

Where Default_Probability = f(Borrower_ICR, Macro_Conditions)

Example:
  부동산 회사 ICR 2.0x → 1.5x (금리 인상)
  → Default Probability 1% → 3%
  → Bank Provision ↑
```

**구현 위치:** `/docs/shared/LEVEL3_COMPANY.md`

---

## 🔧 Level 4: Asset/Product-Level (섹터별)

### 공통 구조

```typescript
interface AssetLevel {
  asset_id: string;
  company_id: string;
  asset_type: string;          // 섹터별로 다름
  value: number;
  profitability: number;
  allocated_debt: number;       // 이 자산에 할당된 부채
  allocated_interest: number;   // 이 자산의 이자비용
}
```

### Equation 4.1: Asset-Level Profitability

```
Asset_NOI = Asset_Revenue - Asset_Operating_Expenses

Asset_ROI = Asset_NOI / Asset_Value
```

### Equation 4.2: Debt Allocation

```
For a company with multiple assets:

Allocated_Debt_i = Total_Debt × (Asset_Value_i / Total_Asset_Value)
Allocated_Interest_i = Allocated_Debt_i × Interest_Rate

Example:
  Company has 300B debt, 800B total assets
  Asset A worth 500B: Allocated Debt = 300B × (500/800) = 187.5B
  At 2.5% rate: Interest = 187.5B × 0.025 = 4.69B
```

**섹터별 구현:**
- Banking: Individual loans in `bank_loan_portfolios`
- Real Estate: Individual properties in `properties`
- Manufacturing: Individual products (추후)

**구현 위치:** `/docs/shared/LEVEL4_ASSET.md`

---

## 🗄️ Database Schema (공용 테이블)

### 모든 섹터가 사용하는 테이블

```sql
-- Level 1
CREATE TABLE macro_variables (
  date DATE PRIMARY KEY,
  interest_rate DECIMAL(5,3),
  tariff_rate DECIMAL(5,2),
  inflation_rate DECIMAL(5,3),
  fx_rate DECIMAL(10,2),
  m2_money_supply BIGINT,
  credit_spread INT
);

-- Level 3
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE,
  name VARCHAR(255),
  sector_type VARCHAR(50),  -- 'BANKING', 'REALESTATE', 'MANUFACTURING'
  sector_data JSONB         -- 섹터별 추가 데이터
);

CREATE TABLE balance_sheets (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  date DATE,
  assets_total BIGINT,
  liabilities_total BIGINT,
  liabilities_debt_interestbearing BIGINT,  -- KEY
  equity_total BIGINT,
  CONSTRAINT balance_identity CHECK (
    ABS(assets_total - (liabilities_total + equity_total)) < 1000
  )
);

CREATE TABLE income_statements (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  date DATE,
  total_revenue BIGINT,
  operating_expenses BIGINT,
  ebitda BIGINT,
  interest_expense BIGINT,  -- RATE SENSITIVE
  tax_expense BIGINT,
  net_income BIGINT
);

CREATE TABLE company_financials (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  date DATE,
  interest_rate DECIMAL(5,3),
  interest_coverage_ratio DECIMAL(8,4),
  debt_to_equity DECIMAL(8,4),
  stock_price DECIMAL(12,2),
  rate_sensitivity_pct DECIMAL(8,4),
  rate_sensitivity_direction VARCHAR(10)  -- 'POSITIVE', 'NEGATIVE'
);

-- Cross-Sector
CREATE TABLE relationships (
  id SERIAL PRIMARY KEY,
  from_company_id INT REFERENCES companies(id),
  to_company_id INT REFERENCES companies(id),
  relationship_type VARCHAR(50),  -- 'LENDING', 'SUPPLIER', 'CUSTOMER'
  amount BIGINT,
  risk_metric DECIMAL(8,4)
);
```

### 섹터별 추가 테이블

**Banking:**
```sql
CREATE TABLE bank_loan_portfolios (
  id SERIAL PRIMARY KEY,
  bank_company_id INT REFERENCES companies(id),
  borrower_company_id INT REFERENCES companies(id),
  loan_amount BIGINT,
  interest_rate DECIMAL(5,3),
  default_probability DECIMAL(5,4),
  borrower_icr DECIMAL(8,4)
);
```

**Real Estate:**
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  property_value BIGINT,
  occupancy_rate DECIMAL(5,2),
  annual_rental_yield DECIMAL(5,3),
  allocated_debt BIGINT,
  noi_annual BIGINT
);
```

**구현 위치:** `/docs/shared/DATABASE_SCHEMA.md`

---

## 🔄 Implementation Flow

### 금리 변화 시 전체 흐름

```
1. User Input: "금리를 2.5%에서 3.0%로 인상"
   └─ Update macro_variables.interest_rate

2. Level 2: Sector Impact Calculation
   └─ Banking: Revenue ↑ (Eq 2.1, positive sensitivity)
   └─ Real Estate: Revenue ↓ (Eq 2.1, negative sensitivity)

3. Level 3: Company Impact Calculation
   For each company:
   └─ Calculate new interest_expense (Eq 3.2)
   └─ Calculate new net_income (Eq 3.2)
   └─ Calculate new ICR (Eq 3.3)
   └─ Calculate stock_price_impact (Eq 3.7)

4. Level 4: Asset Impact Calculation
   For each asset:
   └─ Calculate new allocated_interest (Eq 4.2)
   └─ Calculate new asset profitability (Eq 4.1)

5. Cross-Sector: Relationship Impact
   For each bank-borrower relationship:
   └─ Check borrower ICR change
   └─ Update default_probability
   └─ Calculate bank provision_increase (Eq 3.8)
   └─ Adjust bank net_income

6. Output:
   └─ Updated company_financials for all companies
   └─ Stock price changes
   └─ Circuit diagrams (visualization)
   └─ Network graphs (relationships)
```

---

## ✅ Validation Rules (모든 섹터)

### Balance Sheet
```
Test: ABS(Assets - (Liabilities + Equity)) < 1000 won
```

### Income Statement
```
Test: Net Income = Revenue - OpEx - Interest - Tax (within tolerance)
```

### Rate Sensitivity
```
Test: For ΔRate = +0.5%
  Banking companies: Net Income ↑
  Real Estate companies: Net Income ↓
```

### Cross-Sector
```
Test: When RE company ICR ↓, Bank provision ↑
```

---

## 📋 Summary: 공용 방정식 목록

| Level | Equation | Purpose | All Sectors |
|---|---|---|---|
| 1 | Eq 1.1 | Macro → Sector | ✅ |
| 2 | Eq 2.1 | Sector Sensitivity | ✅ (섹터별 β 다름) |
| 3 | Eq 3.1 | Balance Sheet | ✅ |
| 3 | Eq 3.2 | Income Statement | ✅ |
| 3 | Eq 3.3 | Key Ratios (ICR, D/E, ROA, ROE) | ✅ |
| 3 | Eq 3.7 | Rate Sensitivity | ✅ |
| 3 | Eq 3.8 | Cross-Sector Impact | ✅ |
| 4 | Eq 4.1 | Asset Profitability | ✅ |
| 4 | Eq 4.2 | Debt Allocation | ✅ |

**Total: 9개 공용 방정식**

섹터별 추가 방정식은 각 섹터의 `SECTOR_SPEC.md`에 정의

---

## 🚀 새 섹터 추가 시 체크리스트

Manufacturing을 추가한다면:

1. **이 문서 (CORE_FRAMEWORK.md) 업데이트**
   ```
   Level 2 섹터별 지표에 추가:
   - Capacity Utilization
   - Labor Cost Index

   DATABASE_SCHEMA.md에 테이블 추가:
   - manufacturing_facilities
   ```

2. **새 섹터 문서 생성**
   ```
   /docs/sectors/manufacturing/SECTOR_SPEC.md
   ```

3. **공용 방정식은 그대로 사용**
   - Eq 3.1~3.8 모두 그대로 적용
   - Manufacturing만의 추가 방정식만 SECTOR_SPEC에 정의

4. **샘플 데이터 정의**
   - 3개 제조업 회사
   - Level 3-4 데이터

---

**이 문서는 모든 섹터의 기초입니다. 새 섹터 추가 시, 추가만 하고 기존 내용은 변경하지 않습니다.**
