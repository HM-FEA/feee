# Real Estate + Banking Data Schema

**Purpose:** PostgreSQL database schema for Real Estate and Banking sectors
**Based on:** REALESTATE_CORE_EQUATIONS.md (Equations 2.1 - 4.2)
**Status:** Foundation for implementation
**Date:** 2025-11-01

---

## 📋 Schema Overview

```
┌─────────────────────────────────────────────┐
│ macro_variables                              │
│ ├─ interest_rate (PRIMARY)                   │
│ ├─ inflation_rate                            │
│ ├─ wage_inflation_rate                       │
│ ├─ property_price_index                      │
│ └─ rental_market_yield                       │
├─────────────────────────────────────────────┤
│ companies                                    │
│ ├─ id, name, sector_type                     │
│ ├─ created_at, updated_at                    │
│ └─ sector_specific_data (JSONB)              │
├─────────────────────────────────────────────┤
│ balance_sheets                               │
│ ├─ company_id, date                          │
│ ├─ assets_total, liabilities_total           │
│ ├─ equity_total                              │
│ └─ debt_interestbearing                      │
├─────────────────────────────────────────────┤
│ income_statements                            │
│ ├─ company_id, date                          │
│ ├─ rental_income, operating_expenses         │
│ ├─ ebitda, interest_expense                  │
│ └─ net_income                                │
├─────────────────────────────────────────────┤
│ properties (Real Estate Only)                │
│ ├─ company_id, property_id                   │
│ ├─ property_value, occupancy_rate            │
│ ├─ rental_yield, annual_rental_income        │
│ └─ operating_expenses                        │
├─────────────────────────────────────────────┤
│ bank_loan_portfolios (Banking Only)          │
│ ├─ bank_company_id, borrower_company_id     │
│ ├─ loan_amount, interest_rate                │
│ ├─ default_probability, provision_rate       │
│ └─ sector_of_borrower                        │
├─────────────────────────────────────────────┤
│ company_financials                           │
│ ├─ company_id, date                          │
│ ├─ debt_to_equity, interest_coverage         │
│ ├─ dividend_yield, stock_price               │
│ └─ health_score                              │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Table Definitions

### 1. macro_variables

Stores macro-level economic variables (Equation 2.1 inputs)

```sql
CREATE TABLE macro_variables (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,

  -- Primary Macro Variables
  interest_rate DECIMAL(5,3) NOT NULL,        -- 0.000 - 10.000 %
  inflation_rate DECIMAL(5,3) DEFAULT 2.0,    -- 0.000 - 10.000 %
  wage_inflation_rate DECIMAL(5,3) DEFAULT 2.5, -- 0.000 - 8.000 %

  -- Real Estate Specific
  property_price_index DECIMAL(8,2) DEFAULT 100.0, -- Index (base=100)
  rental_market_yield DECIMAL(5,3) DEFAULT 4.0,    -- 2.000 - 6.000 %
  occupancy_rate_market DECIMAL(5,2) DEFAULT 85.0, -- 70.0 - 95.0 %

  -- Banking & Credit
  credit_spread INT DEFAULT 200,              -- 100-500 basis points

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE INDEX idx_macro_variables_date ON macro_variables(date);
```

**Used by:** All financial calculations
**Reference:** Equation 2.1, Section 1 (Macro Variables)

---

### 2. companies

Stores company information for both Banking and Real Estate sectors

```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 000030 (Samsung)
  name VARCHAR(255) NOT NULL,
  sector_type VARCHAR(50) NOT NULL,  -- 'BANKING', 'REALESTATE', 'MANUFACTURING'
  country VARCHAR(2) DEFAULT 'KR',

  -- Company-Specific Data (stored as JSONB for flexibility)
  -- For Real Estate: properties count, main portfolio focus
  -- For Banking: loan portfolio size, NIM target
  sector_data JSONB,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_sector CHECK (sector_type IN ('BANKING', 'REALESTATE', 'MANUFACTURING'))
);

CREATE INDEX idx_companies_sector ON companies(sector_type);
CREATE INDEX idx_companies_code ON companies(code);
```

**Example sector_data:**

```jsonb
-- Real Estate Company
{
  "num_properties": 15,
  "portfolio_focus": "office_buildings",
  "main_regions": ["Seoul", "Busan"],
  "preferred_occupancy_target": 0.90,
  "dividend_payout_ratio": 0.40
}

-- Banking Company
{
  "prime_lending_rate": 0.050,
  "deposit_rate": 0.020,
  "loan_loss_provision_rate": 0.015,
  "re_sector_exposure_pct": 0.25,
  "manufacturing_sector_exposure_pct": 0.35
}
```

---

### 3. balance_sheets

Stores company balance sheet data (Equation 3.1)

```sql
CREATE TABLE balance_sheets (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  date DATE NOT NULL,

  -- ASSETS (Equation 3.1)
  assets_total BIGINT NOT NULL,                    -- Total Assets (원)
  assets_real_estate_value BIGINT,                 -- For RE companies
  assets_cash_equivalents BIGINT,
  assets_receivables BIGINT,
  assets_other BIGINT,

  -- LIABILITIES
  liabilities_total BIGINT NOT NULL,
  liabilities_debt_total BIGINT NOT NULL,
  liabilities_debt_interestbearing BIGINT NOT NULL, -- KEY for Eq. 3.2.4
  liabilities_accounts_payable BIGINT,
  liabilities_other BIGINT,

  -- EQUITY
  equity_total BIGINT NOT NULL,
  equity_common_stock BIGINT,
  equity_retained_earnings BIGINT,
  equity_other BIGINT,

  -- Calculated Ratios (for quick access)
  debt_ratio DECIMAL(5,4),                        -- debt_total / assets_total
  debt_to_equity DECIMAL(8,4),                    -- debt_total / equity_total

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT balance_sheet_identity CHECK (
    ABS((assets_total) - (liabilities_total + equity_total)) < 1000
  )
);

CREATE INDEX idx_balance_sheets_company_date ON balance_sheets(company_id, date);
```

**Validation:** Balance Sheet Identity (Equation 3.1)
```
Assets = Liabilities + Equity
```

---

### 4. income_statements

Stores company income statement data (Equation 3.2)

```sql
CREATE TABLE income_statements (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  date DATE NOT NULL,
  period_type VARCHAR(20) DEFAULT 'ANNUAL',  -- ANNUAL, QUARTERLY

  -- Revenue Side (Equation 3.2.1)
  rental_income BIGINT,                    -- For RE companies (원/year)
  other_income BIGINT,
  total_revenue BIGINT NOT NULL,

  -- Operating Expenses (Equation 3.2.2)
  maintenance_expenses BIGINT,
  management_fees BIGINT,
  property_tax BIGINT,
  insurance_expenses BIGINT,
  depreciation BIGINT,
  operating_expenses BIGINT NOT NULL,

  -- Operating Income (Equation 3.2.3)
  ebitda BIGINT NOT NULL,

  -- Interest Expense (Equation 3.2.4) -- RATE SENSITIVE
  interest_expense BIGINT NOT NULL,

  -- Tax (Equation 3.2.5)
  tax_expense BIGINT,
  tax_rate DECIMAL(5,4),

  -- Net Income (Equation 3.2.6) -- FINAL OUTPUT
  net_income BIGINT NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT income_calc CHECK (
    ebitda = (total_revenue - operating_expenses)
  )
);

CREATE INDEX idx_income_statements_company_date ON income_statements(company_id, date);
```

**Flow:**
```
Equation 3.2.1: Rental Income
         ↓
Equation 3.2.2: Operating Expenses
         ↓
Equation 3.2.3: EBITDA = Rental Income - OpEx
         ↓
Equation 3.2.4: Interest Expense = Debt × Rate
         ↓
Equation 3.2.5: Taxes
         ↓
Equation 3.2.6: Net Income = EBITDA - Interest - Taxes
```

---

### 5. properties (Real Estate Only)

Stores property-level data for real estate companies (Equation 4.1)

```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  property_code VARCHAR(50) UNIQUE NOT NULL,

  -- Property Identification
  name VARCHAR(255) NOT NULL,
  property_type VARCHAR(50),              -- OFFICE, RESIDENTIAL, RETAIL, INDUSTRIAL
  location VARCHAR(255),
  city VARCHAR(100),

  -- Property Financials (Equation 4.1)
  property_value BIGINT NOT NULL,         -- 부동산 자산가치 (원)
  annual_rental_yield DECIMAL(5,3),       -- 4.0% = 0.040
  occupancy_rate DECIMAL(5,2),            -- 95.0% = 95.0
  annual_rental_income BIGINT,            -- Calculated

  -- Operating Costs (Equation 4.1)
  maintenance_annual BIGINT,
  management_fees_annual BIGINT,
  property_tax_annual BIGINT,
  insurance_annual BIGINT,
  total_opex_annual BIGINT,

  -- NOI (Net Operating Income)
  noi_annual BIGINT,                      -- Calculated: rental_income - opex
  roi_percent DECIMAL(8,4),               -- NOI / property_value

  -- Debt Allocation (Equation 4.2)
  allocated_debt BIGINT,                  -- Portion of company debt for this property
  allocated_interest_current BIGINT,      -- Interest at current rates

  -- Status
  acquisition_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated DATE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT noi_calc CHECK (
    noi_annual = (annual_rental_income - total_opex_annual)
  )
);

CREATE INDEX idx_properties_company ON properties(company_id);
CREATE INDEX idx_properties_city ON properties(city);
```

**Equation 4.1: Property NOI**
```
NOI = Gross Rental Income - Operating Expenses
    = (Property Value × Occupancy × Annual Yield) - OpEx
```

**Equation 4.2: Debt Allocation**
```
Allocated Debt per Property = Total Company Debt × (Property Value / Total Property Value)
Interest per Property = Allocated Debt × Interest Rate
```

---

### 6. bank_loan_portfolios (Banking Only)

Stores bank's loan portfolio and exposure (Equation 3.8)

```sql
CREATE TABLE bank_loan_portfolios (
  id SERIAL PRIMARY KEY,
  bank_company_id INT NOT NULL REFERENCES companies(id),
  borrower_company_id INT NOT NULL REFERENCES companies(id),

  -- Loan Details
  loan_code VARCHAR(50) UNIQUE,
  loan_amount BIGINT NOT NULL,             -- 대출액 (원)
  interest_rate DECIMAL(5,3) NOT NULL,     -- 금리 (%)
  origination_date DATE,
  maturity_date DATE,

  -- Borrower Sector
  borrower_sector VARCHAR(50),             -- REALESTATE, MANUFACTURING, etc

  -- Risk Metrics (Equation 3.8)
  default_probability DECIMAL(5,4),        -- 부실 확률 (current)
  default_probability_base DECIMAL(5,4),   -- 부실 확률 (base case)

  -- Provision (대손충당금)
  provision_rate DECIMAL(5,4),             -- 대손충당금율
  provision_amount BIGINT,                 -- Calculated: loan_amount × provision_rate

  -- Borrower Health Indicators
  borrower_icr DECIMAL(8,4),               -- Interest Coverage Ratio
  borrower_debt_to_equity DECIMAL(8,4),    -- D/E ratio

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_review_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_rates CHECK (
    interest_rate >= 0 AND interest_rate <= 20 AND
    default_probability >= 0 AND default_probability <= 1 AND
    provision_rate >= 0 AND provision_rate <= 1
  ),

  CONSTRAINT provision_calc CHECK (
    ABS(provision_amount - (loan_amount * provision_rate)) < 1000000
  )
);

CREATE INDEX idx_bank_portfolio_bank ON bank_loan_portfolios(bank_company_id);
CREATE INDEX idx_bank_portfolio_borrower ON bank_loan_portfolios(borrower_company_id);
CREATE INDEX idx_bank_portfolio_sector ON bank_loan_portfolios(borrower_sector);
```

**Used by Equation 3.8: Bank Risk**
```
Bank Default Risk = Σ (Loan Amount × Default Probability)
Bank Provision = Σ (Loan Amount × Provision Rate)
```

---

### 7. company_financials

Stores calculated financial ratios and metrics

```sql
CREATE TABLE company_financials (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id),
  date DATE NOT NULL,
  interest_rate DECIMAL(5,3),              -- Reference macro rate

  -- Key Ratios (Equation 3.4-3.6)
  interest_coverage_ratio DECIMAL(8,4),    -- EBITDA / Interest (Eq. 3.4)
  debt_to_equity DECIMAL(8,4),             -- Debt / Equity (Eq. 3.5)
  dividend_yield DECIMAL(5,4),             -- Annual Div / Stock Price (Eq. 3.6)

  -- Stock Price
  stock_price DECIMAL(12,2),
  stock_price_change_pct DECIMAL(8,4),     -- % change from previous period

  -- Health Scores
  health_score VARCHAR(20),                -- EXCELLENT, GOOD, WARNING, CRITICAL
  financial_stress_index DECIMAL(5,2),     -- 0-100 scale

  -- Rate Sensitivity (Equation 3.7)
  rate_sensitivity_pct DECIMAL(8,4),       -- % NI change per 0.1% rate change
  rate_sensitivity_direction VARCHAR(10),  -- POSITIVE (bank), NEGATIVE (RE)

  -- Banking Specific
  nim_percent DECIMAL(5,3),                -- Net Interest Margin (%)
  loan_loss_provision BIGINT,

  -- Real Estate Specific
  property_portfolio_value BIGINT,
  weighted_occupancy_rate DECIMAL(5,2),

  -- Metadata
  calculated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT icr_check CHECK (interest_coverage_ratio > 0)
);

CREATE INDEX idx_company_financials_company_date ON company_financials(company_id, date);
CREATE INDEX idx_company_financials_health ON company_financials(health_score);
```

---

## 🔄 View: Rate Sensitivity Analysis (Equation 3.7)

Creates a view showing impact of rate changes on all companies:

```sql
CREATE VIEW rate_sensitivity_analysis AS
SELECT
  c.id,
  c.name,
  c.sector_type,
  cf.interest_coverage_ratio,
  cf.debt_to_equity,
  cf.rate_sensitivity_pct,
  cf.rate_sensitivity_direction,

  -- Calculate impact for +0.5% rate increase
  (cf.rate_sensitivity_pct * 5.0) AS impact_at_plus_50bps,

  -- Calculate impact for +1.0% rate increase
  (cf.rate_sensitivity_pct * 10.0) AS impact_at_plus_100bps,

  -- Health status
  CASE
    WHEN cf.interest_coverage_ratio > 2.5 THEN 'SAFE'
    WHEN cf.interest_coverage_ratio > 2.0 THEN 'CAUTION'
    ELSE 'RISK'
  END AS health_based_on_icr

FROM companies c
JOIN company_financials cf ON c.id = cf.company_id
WHERE cf.date = (SELECT MAX(date) FROM company_financials);
```

---

## 🔄 View: Cross-Sector Relationship Impact (Equation 3.8)

Shows how borrower health affects bank risk:

```sql
CREATE VIEW cross_sector_impact AS
SELECT
  b.bank_company_id,
  bc.name AS bank_name,
  b.borrower_company_id,
  boc.name AS borrower_name,
  boc.sector_type,

  b.loan_amount,
  b.interest_rate,

  -- Borrower Health
  b.borrower_icr,
  b.borrower_debt_to_equity,

  -- Current Provision
  b.provision_amount,
  b.provision_rate,

  -- Risk Assessment
  CASE
    WHEN b.borrower_icr > 2.5 THEN 'LOW_RISK'
    WHEN b.borrower_icr > 2.0 THEN 'MEDIUM_RISK'
    ELSE 'HIGH_RISK'
  END AS borrower_risk_level,

  -- Provision Recommendation (if ICR falls)
  CASE
    WHEN b.borrower_icr < 2.0 THEN b.loan_amount * 0.10
    WHEN b.borrower_icr < 2.5 THEN b.loan_amount * 0.05
    ELSE b.loan_amount * 0.02
  END AS recommended_provision

FROM bank_loan_portfolios b
JOIN companies bc ON b.bank_company_id = bc.id
JOIN companies boc ON b.borrower_company_id = boc.id
WHERE b.is_active = TRUE;
```

---

## 📊 Sample Data Insert

```sql
-- Insert Macro Variables
INSERT INTO macro_variables (date, interest_rate, inflation_rate, wage_inflation_rate, property_price_index, rental_market_yield, occupancy_rate_market)
VALUES ('2025-11-01', 2.50, 2.0, 2.5, 100.0, 4.0, 85.0);

-- Insert Companies
INSERT INTO companies (code, name, sector_type, sector_data)
VALUES
  ('037200', 'Shinhan Alpha REIT', 'REALESTATE', '{"num_properties": 15, "portfolio_focus": "office", "dividend_payout_ratio": 0.40}'),
  ('000030', 'Shinhan Bank', 'BANKING', '{"prime_lending_rate": 0.050, "deposit_rate": 0.020, "re_sector_exposure_pct": 0.25}');

-- Insert Balance Sheet
INSERT INTO balance_sheets (company_id, date, assets_total, liabilities_debt_interestbearing, liabilities_total, equity_total, debt_ratio)
VALUES (1, '2025-11-01', 580000000000, 290000000000, 310000000000, 270000000000, 0.50);

-- Insert Income Statement
INSERT INTO income_statements (company_id, date, rental_income, operating_expenses, ebitda, interest_expense, tax_expense, net_income)
VALUES (1, '2025-11-01', 17670000000, 6380000000, 13290000000, 7250000000, 1557500000, 4482500000);

-- Insert Properties
INSERT INTO properties (company_id, property_code, name, property_type, property_value, annual_rental_yield, occupancy_rate, annual_rental_income, total_opex_annual, noi_annual, allocated_debt)
VALUES (1, 'P001', 'Seoul Office Building A', 'OFFICE', 500000000000, 0.04, 95.0, 19000000000, 4450000000, 14550000000, 178125000000);

-- Insert Bank Loan Portfolio
INSERT INTO bank_loan_portfolios (bank_company_id, borrower_company_id, loan_amount, interest_rate, borrower_sector, default_probability, provision_rate)
VALUES (2, 1, 200000000000, 0.025, 'REALESTATE', 0.02, 0.05);
```

---

## ✅ Validation Rules

All inserts and updates must satisfy:

1. **Balance Sheet Identity** (Equation 3.1)
   ```
   ABS(assets - (liabilities + equity)) < 1000
   ```

2. **Income Statement Flow** (Equation 3.2)
   ```
   ebitda = rental_income - operating_expenses
   net_income = ebitda - interest_expense - taxes
   ```

3. **Property NOI** (Equation 4.1)
   ```
   noi = (property_value × occupancy × rental_yield) - operating_expenses
   ```

4. **Interest Calculation** (Equation 3.2.4)
   ```
   interest_expense = debt_interestbearing × interest_rate
   ```

5. **Provision Amount** (Equation 3.8)
   ```
   provision_amount = loan_amount × provision_rate
   ```

---

## 🔧 Implementation Notes

### For Team Data:
- Use `macro_variables` table to store daily interest rate changes
- Update `balance_sheets` and `income_statements` quarterly
- Sync property data from real estate data sources to `properties`
- Update `bank_loan_portfolios` monthly with risk metrics

### For Team Quant:
- Query `balance_sheets` + `income_statements` to implement Equations 3.1-3.7
- Use `properties` data for Equation 4.1 (property-level NOI)
- Reference `bank_loan_portfolios` for Equation 3.8 (cross-sector impacts)
- Calculate `company_financials` using views and queries

### For Team SimViz:
- Use `income_statements` for circuit diagram flows (revenue in, interest out)
- Use `bank_loan_portfolios` + `company_financials` for network graphs
- Display `rate_sensitivity_analysis` view for impact visualization
- Show `cross_sector_impact` view for bank-RE relationships

---

**This schema implements all equations from REALESTATE_CORE_EQUATIONS.md**
