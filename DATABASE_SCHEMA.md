# 🗄️ NEXUS-ALPHA DATABASE SCHEMA

**Last Updated:** 2025-11-12
**Database:** PostgreSQL 15 + TimescaleDB 2.12
**Purpose:** Phase 9-11 Backend Services + Formula Calibration

---

## 📊 Schema Overview

```
PostgreSQL (Relational data)
  ├── entities (Universal entity registry)
  ├── relationships (Ontology connections)
  ├── sector_coefficients (Variablized parameters)
  ├── formulas (Version-controlled formulas)
  ├── scenarios (User-created simulations)
  ├── reports (Analyst reports)
  └── trading_bots (Bot marketplace)

TimescaleDB (Time-series data)
  ├── financial_data (Company financials over time)
  ├── macro_data (Macro variables history)
  └── bot_performance (Trading bot PnL tracking)
```

---

## 1. **entities** (Universal Entity Registry)

**Purpose:** Central registry for ALL entities in the system (companies, products, components, sectors, macro variables)

```sql
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,  -- COMPANY, PRODUCT, COMPONENT, SECTOR, MACRO, TECHNOLOGY, FACILITY
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),  -- SEMICONDUCTOR, BANKING, REALESTATE, etc.
  ontology_level INTEGER,  -- 0-9
  metadata JSONB,  -- Flexible schema for entity-specific data

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Indexes
  CONSTRAINT entities_type_check CHECK (type IN (
    'COMPANY', 'PRODUCT', 'COMPONENT', 'SECTOR', 'MACRO',
    'TECHNOLOGY', 'SHAREHOLDER', 'CUSTOMER', 'EQUIPMENT', 'FACILITY'
  ))
);

CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_category ON entities(category);
CREATE INDEX idx_entities_level ON entities(ontology_level);
CREATE INDEX idx_entities_metadata ON entities USING GIN (metadata);

-- Example data
INSERT INTO entities (type, name, category, ontology_level, metadata) VALUES
  ('MACRO', 'Fed Funds Rate', 'INTEREST_RATE', 1, '{"unit": "%", "current_value": 5.25}'),
  ('SECTOR', 'Semiconductor', 'TECHNOLOGY', 2, '{"gdp_elasticity": 1.8}'),
  ('COMPANY', 'NVIDIA', 'SEMICONDUCTOR', 3, '{"ticker": "NVDA", "market_cap": 3000000}'),
  ('PRODUCT', 'H100 GPU', 'AI_CHIP', 4, '{"price": 30000, "launched": "2022-03"}'),
  ('COMPONENT', 'HBM3E Memory', 'MEMORY', 5, '{"supplier": "SK Hynix", "bandwidth": 819}');
```

---

## 2. **relationships** (Ontology Connections)

**Purpose:** Define how entities connect and influence each other

```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  target_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,  -- SUPPLIES, COMPETES, FINANCES, CONTAINS, IMPACTS
  weight DECIMAL(5,4),  -- 0.0-1.0 (relationship strength)
  impact_formula TEXT,  -- JavaScript expression for impact calculation
  metadata JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT relationships_type_check CHECK (type IN (
    'SUPPLIES', 'COMPETES', 'FINANCES', 'CONTAINS', 'IMPACTS',
    'MANUFACTURES', 'DESIGNS', 'OWNS', 'INVESTS_IN'
  ))
);

CREATE INDEX idx_relationships_source ON relationships(source_entity_id);
CREATE INDEX idx_relationships_target ON relationships(target_entity_id);
CREATE INDEX idx_relationships_type ON relationships(type);

-- Example: H100 requires HBM3E
INSERT INTO relationships (source_entity_id, target_entity_id, type, weight, impact_formula) VALUES
  (
    (SELECT id FROM entities WHERE name = 'H100 GPU'),
    (SELECT id FROM entities WHERE name = 'HBM3E Memory'),
    'REQUIRES',
    0.95,  -- Very strong dependency
    'if (hbm_supply < 80) return -0.25; else if (hbm_supply > 120) return 0.15;'
  );
```

---

## 3. **financial_data** (TimescaleDB Hypertable)

**Purpose:** Time-series financial data for companies

```sql
CREATE TABLE financial_data (
  id UUID DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id),
  date DATE NOT NULL,

  -- Income statement
  revenue DECIMAL(15,2),
  net_income DECIMAL(15,2),
  ebitda DECIMAL(15,2),
  operating_income DECIMAL(15,2),

  -- Balance sheet
  total_assets DECIMAL(15,2),
  total_debt DECIMAL(15,2),
  equity DECIMAL(15,2),

  -- Cash flow
  operating_cash_flow DECIMAL(15,2),
  free_cash_flow DECIMAL(15,2),
  capex DECIMAL(15,2),

  -- Market data
  market_cap DECIMAL(15,2),
  share_price DECIMAL(10,4),

  -- Metadata
  data_source VARCHAR(100),  -- 'BLOOMBERG', 'MANUAL', 'CALCULATED'

  PRIMARY KEY (entity_id, date)
);

-- Convert to TimescaleDB hypertable (optimized for time-series queries)
SELECT create_hypertable('financial_data', 'date', chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_financial_entity_date ON financial_data(entity_id, date DESC);

-- Example: NVIDIA quarterly data
INSERT INTO financial_data (entity_id, date, revenue, net_income, market_cap, data_source) VALUES
  ((SELECT id FROM entities WHERE name = 'NVIDIA'), '2024-Q1', 60922, 14881, 3000000, 'MANUAL');
```

---

## 4. **sector_coefficients** (Variablized Parameters)

**Purpose:** Replace all hardcoded sector sensitivities with database records

```sql
CREATE TABLE sector_coefficients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector VARCHAR(50) NOT NULL,
  coefficient_type VARCHAR(50) NOT NULL,  -- gdp_elasticity, pricing_power, etc.
  value DECIMAL(10,4) NOT NULL,

  -- Calibration metadata
  effective_date DATE NOT NULL,
  calibrated_from DATE,  -- Start of calibration period
  calibrated_to DATE,  -- End of calibration period
  r_squared DECIMAL(5,4),  -- Regression R²
  data_source VARCHAR(100),  -- Where this coefficient came from
  notes TEXT,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sector_coeff_sector ON sector_coefficients(sector);
CREATE INDEX idx_sector_coeff_type ON sector_coefficients(coefficient_type);
CREATE INDEX idx_sector_coeff_active ON sector_coefficients(is_active);

-- Example: Replace hardcoded GDP elasticity
INSERT INTO sector_coefficients (sector, coefficient_type, value, effective_date, r_squared, data_source, notes) VALUES
  ('SEMICONDUCTOR', 'gdp_elasticity', 1.8, '2025-01-01', 0.85, 'Historical regression 2000-2024', 'Strong correlation with GDP growth'),
  ('BANKING', 'pricing_power', 0.7, '2025-01-01', 0.72, 'Industry study', 'Banks can pass through ~70% of rate increases');
```

---

## 5. **formulas** (Version-Controlled Formulas)

**Purpose:** Git-like versioning for simulation formulas

```sql
CREATE TABLE formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  formula_type VARCHAR(50),  -- 'IMPACT_CALCULATION', 'VALUATION', 'RISK_METRIC'

  -- Formula definition
  formula_text TEXT NOT NULL,  -- JavaScript expression
  parameters JSONB,  -- Required parameters

  -- Calibration
  effective_date DATE NOT NULL,
  r_squared DECIMAL(5,4),  -- If calibrated
  mae DECIMAL(10,4),  -- Mean Absolute Error
  rmse DECIMAL(10,4),  -- Root Mean Square Error

  -- Metadata
  description TEXT,
  test_cases JSONB,  -- Unit test examples
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(name, version)
);

CREATE INDEX idx_formulas_name ON formulas(name);
CREATE INDEX idx_formulas_active ON formulas(is_active);

-- Example: GDP → Sector impact formula
INSERT INTO formulas (name, version, formula_type, formula_text, parameters, effective_date, r_squared, created_by) VALUES
  (
    'gdp_sector_impact',
    1,
    'IMPACT_CALCULATION',
    'return (gdpGrowth - baseline) * elasticity * 100;',
    '{"gdpGrowth": "number", "baseline": "number", "elasticity": "number"}',
    '2025-01-01',
    0.82,
    'system'
  );
```

---

## 6. **scenarios** (User Simulations)

**Purpose:** Store user-created simulation scenarios (Polymarket-style)

```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(100) NOT NULL,

  -- Macro variable settings
  macro_variables JSONB NOT NULL,  -- {"fed_rate": 0.06, "gdp_growth": 0.03, ...}

  -- Level-specific settings (Level 0-9)
  level_settings JSONB,

  -- Results
  simulation_results JSONB,  -- Cached results

  -- Community features
  is_public BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scenarios_author ON scenarios(author);
CREATE INDEX idx_scenarios_public ON scenarios(is_public);

-- Example: "Fed Rate Cut 2025" scenario
INSERT INTO scenarios (name, description, author, macro_variables, is_public) VALUES
  (
    'Fed Rate Cut 2025',
    'What happens if Fed cuts rates to 2.5% by end of 2025?',
    'quant-master',
    '{"fed_funds_rate": 0.025, "us_gdp_growth": 0.035, "us_cpi": 0.025}',
    TRUE
  );
```

---

## 7. **reports** (Analyst Reports with [[wiki-links]])

**Purpose:** Community analyst reports with entity linking

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id),
  entity_type VARCHAR(50),
  entity_name VARCHAR(255),

  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,  -- Markdown with [[wiki-links]]

  author VARCHAR(100) NOT NULL,
  category VARCHAR(50),  -- technical, financial, strategic, market, supply-chain
  tags TEXT[],
  sources TEXT[],
  linked_entities UUID[],  -- Extracted from [[links]]

  -- Community
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,

  is_public BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_entity ON reports(entity_id);
CREATE INDEX idx_reports_author ON reports(author);
CREATE INDEX idx_reports_tags ON reports USING GIN (tags);
```

---

## 8. **trading_bots** (Bot Marketplace)

**Purpose:** Trading bot registry with subscription system

```sql
CREATE TABLE trading_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(100) NOT NULL,

  -- Bot type and strategy
  type VARCHAR(50) NOT NULL,  -- AI_DESCRIPTION, TRADITIONAL
  status VARCHAR(50) DEFAULT 'DRAFT',  -- DRAFT, BACKTESTING, LIVE, PAUSED, STOPPED
  strategy TEXT NOT NULL,
  ai_prompt TEXT,  -- For AI bots
  strategy_code TEXT,  -- Generated or manual code
  strategy_type VARCHAR(50),  -- MEAN_REVERSION, MOMENTUM, PAIRS_TRADING, etc.
  parameters JSONB,

  -- Performance
  backtest_results JSONB,
  live_performance JSONB,

  -- Marketplace
  is_public BOOLEAN DEFAULT FALSE,
  subscription_price DECIMAL(10,2) DEFAULT 29.00,
  subscribers INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews INTEGER DEFAULT 0,
  revenue_share DECIMAL(3,2) DEFAULT 0.70,  -- 70% to creator

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_backtest TIMESTAMP
);

CREATE INDEX idx_bots_author ON trading_bots(author);
CREATE INDEX idx_bots_public ON trading_bots(is_public);
CREATE INDEX idx_bots_type ON trading_bots(type);
```

---

## 9. **macro_data** (TimescaleDB Hypertable)

**Purpose:** Historical macro variable data (2000-2024)

```sql
CREATE TABLE macro_data (
  date DATE NOT NULL,
  variable_name VARCHAR(100) NOT NULL,
  value DECIMAL(15,6),
  unit VARCHAR(20),
  data_source VARCHAR(100),

  PRIMARY KEY (date, variable_name)
);

SELECT create_hypertable('macro_data', 'date', chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_macro_variable ON macro_data(variable_name, date DESC);

-- Example: Fed Funds Rate history
INSERT INTO macro_data (date, variable_name, value, unit, data_source) VALUES
  ('2024-01-01', 'fed_funds_rate', 5.25, '%', 'Federal Reserve'),
  ('2023-01-01', 'fed_funds_rate', 4.50, '%', 'Federal Reserve'),
  ('2022-01-01', 'fed_funds_rate', 0.25, '%', 'Federal Reserve');
```

---

## 10. **bot_performance** (TimescaleDB Hypertable)

**Purpose:** Track trading bot PnL over time

```sql
CREATE TABLE bot_performance (
  bot_id UUID REFERENCES trading_bots(id),
  date DATE NOT NULL,

  -- Daily metrics
  daily_pnl DECIMAL(15,2),
  cumulative_return DECIMAL(10,4),
  current_drawdown DECIMAL(10,4),
  sharpe_ratio DECIMAL(10,4),

  -- Trades
  trades_today INTEGER,
  win_rate DECIMAL(5,4),

  PRIMARY KEY (bot_id, date)
);

SELECT create_hypertable('bot_performance', 'date', chunk_time_interval => INTERVAL '1 month');

CREATE INDEX idx_bot_perf_bot ON bot_performance(bot_id, date DESC);
```

---

## 🔧 Database Functions

### 1. Get Entity with Relationships
```sql
CREATE OR REPLACE FUNCTION get_entity_graph(entity_id_param UUID)
RETURNS TABLE (
  entity_name VARCHAR,
  relationship_type VARCHAR,
  connected_entity VARCHAR,
  weight DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e1.name,
    r.type,
    e2.name,
    r.weight
  FROM relationships r
  JOIN entities e1 ON r.source_entity_id = e1.id
  JOIN entities e2 ON r.target_entity_id = e2.id
  WHERE r.source_entity_id = entity_id_param
     OR r.target_entity_id = entity_id_param;
END;
$$ LANGUAGE plpgsql;
```

### 2. Get Active Formula
```sql
CREATE OR REPLACE FUNCTION get_active_formula(formula_name_param VARCHAR)
RETURNS TABLE (
  version INTEGER,
  formula_text TEXT,
  parameters JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT f.version, f.formula_text, f.parameters
  FROM formulas f
  WHERE f.name = formula_name_param
    AND f.is_active = TRUE
    AND f.effective_date <= CURRENT_DATE
  ORDER BY f.version DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

---

## 🚀 Migration Strategy

### Phase 9 (Week 17-19): Initial Schema
- Create entities, relationships, financial_data tables
- Migrate existing company data
- Set up TimescaleDB hypertables

### Phase 10 (Week 20-23): Historical Data
- Load macro_data (2000-2024)
- Backfill financial_data for key companies
- Create time-series queries

### Phase 11 (Week 24-26): Calibration System
- Populate sector_coefficients from regression
- Create formulas table with version history
- Build calibration engine

### Phase 12 (Week 27-30): Production
- Add bot_performance tracking
- Enable reports + scenarios
- Full marketplace launch

---

## 📊 Performance Optimization

### Indexes
- **B-Tree**: Fast lookups on UUIDs, dates, status fields
- **GIN**: JSONB and array columns for flexible queries
- **TimescaleDB**: Automatic chunk management for time-series

### Query Patterns
```sql
-- Get company financials for last 5 years (optimized with TimescaleDB)
SELECT * FROM financial_data
WHERE entity_id = $1
  AND date >= NOW() - INTERVAL '5 years'
ORDER BY date DESC;

-- Get all semiconductor companies affected by Fed rate > 5%
SELECT e.* FROM entities e
WHERE e.category = 'SEMICONDUCTOR'
  AND EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.target_entity_id = e.id
      AND r.source_entity_id = (SELECT id FROM entities WHERE name = 'Fed Funds Rate')
  );
```

---

## 🔐 Security

- **Row-Level Security (RLS)**: Users can only edit their own bots/scenarios
- **API Rate Limiting**: Redis-based rate limiting (100 req/min per user)
- **Data Encryption**: At-rest encryption for sensitive financial data
- **Audit Log**: Track all coefficient/formula changes

---

**Status:** Schema Design Complete ✅
**Next:** Phase 9 Implementation (Backend Services)

---

**Author:** Claude (AI Assistant)
**Last Updated:** 2025-11-12
**Branch:** `claude/simlab-design-audit-digital-twin-phase0-011CV4R368cMgezomJuF2qy5`
