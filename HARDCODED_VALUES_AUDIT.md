# 🔍 HARDCODED VALUES AUDIT REPORT

**Date:** 2025-11-12
**Status:** Phase 3 - Data Unification
**Auditor:** Claude (AI Assistant)

---

## Executive Summary

Comprehensive audit of the NEXUS-ALPHA codebase identified **200+ hardcoded values** across financial libraries, simulation parameters, and UI components. These values should be migrated to configuration files or databases for:

1. **Flexibility** - Easy updates without code changes
2. **Traceability** - Track data sources and update history
3. **Calibration** - Historical regression for optimal coefficients
4. **Extensibility** - Support new assets/companies without code changes

---

## 1. MACRO VARIABLE DEFAULTS

**File:** `/lib/finance/macroImpact.ts`
**Count:** 8 hardcoded defaults

```typescript
const fedRate = macroState['fed_funds_rate'] || 0.0525;     // 5.25%
const gdpGrowth = macroState['us_gdp_growth'] || 0.025;     // 2.5%
const inflation = macroState['us_cpi'] || 0.037;            // 3.7%
const oilPrice = macroState['wti_oil'] || 78;               // $78/barrel
const vix = macroState['vix'] || 15;                        // 15 (volatility index)
const usdIndex = macroState['usd_index'] || 104.5;          // 104.5
const unemployment = macroState['us_unemployment'] || 3.8;   // 3.8%
const m2Growth = macroState['us_m2_money_supply'] || 21000; // $21T
```

**Recommendation:** Move to `/lib/config/macroDefaults.ts`

---

## 2. SECTOR SENSITIVITY COEFFICIENTS

**File:** `/lib/finance/macroImpact.ts`
**Count:** 25 coefficients (5 sectors × 5 sensitivity types)

### GDP Elasticity
```typescript
const gdpElasticity: Record<string, number> = {
  BANKING: 1.5,
  REALESTATE: 2.0,
  MANUFACTURING: 1.2,
  SEMICONDUCTOR: 1.8,
  CRYPTO: 0.5,
};
```

### Pricing Power
```typescript
const pricingPower: Record<string, number> = {
  BANKING: 0.7,
  REALESTATE: 0.9,
  MANUFACTURING: 0.5,
  SEMICONDUCTOR: 0.8,
  CRYPTO: 0.3,
};
```

### Commodity Sensitivity
```typescript
const commoditySensitivity: Record<string, number> = {
  BANKING: 0.1,
  REALESTATE: 0.3,
  MANUFACTURING: 0.8,
  SEMICONDUCTOR: 0.6,
  CRYPTO: 0.9,
};
```

### Labor Intensity
```typescript
const laborIntensity: Record<string, number> = {
  BANKING: 0.6,
  REALESTATE: 0.3,
  MANUFACTURING: 0.7,
  SEMICONDUCTOR: 0.5,
  CRYPTO: 0.2,
};
```

### CapEx Elasticity
```typescript
const capexElasticity: Record<string, number> = {
  BANKING: -0.5,
  REALESTATE: -1.5,
  MANUFACTURING: -0.8,
  SEMICONDUCTOR: -1.2,
  CRYPTO: -0.3,
};
```

**Recommendation:** Store in database table `sector_coefficients` with versioning

---

## 3. FINANCIAL STATEMENT ASSUMPTIONS

**File:** `/lib/finance/macroImpact.ts`
**Count:** 7 hardcoded ratios

```typescript
const baseCogsMargin = 0.65;        // 65% COGS/Revenue
const opexRatio = 0.20;             // 20% OpEx/Revenue
const depreciation = revenue * 0.05; // 5% depreciation rate
const taxRate = 0.21;               // 21% corporate tax
const capex = revenue * 0.08;       // 8% capex/revenue
const changeInNWC = revenue * 0.02; // 2% NWC change
const marketReturn = 0.10;          // 10% expected market return
```

**Recommendation:** Company-specific parameters in entity metadata

---

## 4. SECTOR VALUATION MULTIPLES

**File:** `/lib/finance/macroImpact.ts`
**Count:** 10 multiples (5 sectors × 2 types)

```typescript
const baseMultiples: Record<string, { ev_ebitda: number; pe: number }> = {
  BANKING: { ev_ebitda: 8, pe: 12 },
  REALESTATE: { ev_ebitda: 15, pe: 20 },
  MANUFACTURING: { ev_ebitda: 10, pe: 15 },
  SEMICONDUCTOR: { ev_ebitda: 12, pe: 25 },
  CRYPTO: { ev_ebitda: 20, pe: 40 },
};
```

**Recommendation:** Real-time data from Bloomberg/Reuters API

---

## 5. CAPM SECTOR BETAS

**File:** `/lib/finance/capm.ts`
**Count:** 5 beta values

```typescript
const baseBetas: Record<string, number> = {
  BANKING: 1.2,
  REALESTATE: 0.9,
  MANUFACTURING: 1.0,
  SEMICONDUCTOR: 1.5,
  CRYPTO: 2.5,
};
```

**Additional:** VIX baseline and adjustment factor
```typescript
const VIX_BASELINE = 18.5;
const VIX_ADJUSTMENT_FACTOR = 0.3;  // ±30% beta adjustment
```

**Recommendation:** Calculate from actual stock return correlations

---

## 6. PORTFOLIO OPTIMIZATION DEFAULTS

**File:** `/lib/financial/portfolioOptimization.ts`
**Count:** 4 defaults

```typescript
riskFreeRate: number = 0.03;        // 3% risk-free rate
periodsPerYear: number = 252;       // 252 trading days
transactionCost: number = 0.001;    // 0.1% per trade
rebalancePeriods: number = 21;      // Monthly rebalancing (21 days)
```

**Recommendation:** User-configurable in strategy settings

---

## 7. RISK METRICS CONSTANTS

**File:** `/lib/financial/riskMetrics.ts`
**Count:** 15+ constants

### VaR Z-Scores
```typescript
const zScores: Record<number, number> = {
  0.90: 1.282,
  0.95: 1.645,
  0.99: 2.326,
};
```

### Stress Test Scenarios
```typescript
const STRESS_SCENARIOS = {
  '2008-financial-crisis': {
    shocks: [-0.50, -0.40, -0.30, -0.15, 0.05],
    duration: 252,
  },
  '2020-covid': {
    shocks: [-0.35, -0.30, -0.20, 0.10, 0.05],
    duration: 120,
  },
  '1987-black-monday': {
    shocks: [-0.22, -0.18, -0.10, 0.05, 0.02],
    duration: 21,
  },
  '2022-inflation': {
    shocks: [-0.20, -0.25, -0.15, -0.12, 0.15],
    duration: 252,
  },
};
```

### Monte Carlo Defaults
```typescript
const MC_SIMULATIONS = 10000;
const CONVERGENCE_TOLERANCE = 1e-6;
const MAX_ITERATIONS = 100;
```

**Recommendation:** Historical scenario library with metadata

---

## 8. LEVEL-SPECIFIC CONTROL BASELINES

**File:** `/lib/utils/levelSpecificControls.ts`
**Count:** 50+ baseline values across 9 levels

### Level 2: Sector Indicators
```typescript
semiconductor_capex_index: 100,
banking_credit_spread: 150,          // bps
realestate_vacancy_rate: 8.5,       // %
```

### Level 3: Company Metrics
```typescript
nvidia_market_share: 85,             // %
tsmc_utilization_rate: 95,           // %
sk_hynix_hbm_share: 50,             // %
```

### Level 4: Product Demand
```typescript
gpu_demand_index: 85,
smartphone_demand: 100,              // Million units
cloud_growth_rate: 25,              // % YoY
```

### Level 5: Component Supply
```typescript
hbm3e_supply_index: 100,
dram_price_index: 100,
cowos_capacity: 15000,              // units/month
euv_shipments: 60,                  // units/year
```

### Level 6: Technology Innovation
```typescript
ai_investment: 150,                 // $B
process_node_index: 100,
cuda_ecosystem_strength: 90,
```

### Level 8: Customer Behavior
```typescript
hyperscaler_capex: 180,             // $B (MSFT+META+AMZN+GOOG)
enterprise_ai_adoption: 45,         // %
consumer_tech_spending: 100,
```

### Level 9: Facility Operations
```typescript
global_fab_utilization: 85,         // %
datacenter_construction_rate: 50,   // facilities/year
```

**Recommendation:** Real-time data sources or periodic manual updates

---

## 9. ECONOMIC FLOW MULTIPLIERS

**File:** `/lib/utils/economicFlows.ts`
**Count:** 10+ multipliers

```typescript
// Fed Rate → Banking NIM
multiplier: 15.0

// M2 Money Supply → Equity Markets
multiplier: 30.0

// M2 → Crypto Markets
multiplier: 40.0

// M2 → Real Estate
multiplier: 20.0

// GDP → Corporate Earnings
multiplier: 25.0

// Interest Rate → Lending Cost
multiplier: -10.0
```

**Recommendation:** Calibrate from historical data

---

## 10. FIXED INCOME DEFAULTS

**File:** `/lib/financial/fixedIncome.ts`
**Count:** 5+ defaults

```typescript
const DEFAULT_FACE_VALUE = 100;
const DEFAULT_FREQUENCY = 2;         // Semi-annual
const NELSON_SIEGEL_LAMBDA = 2.5;
const CONVERGENCE_TOLERANCE = 1e-6;
const MAX_YTM_ITERATIONS = 100;
```

**Recommendation:** Configuration file for bond calculation parameters

---

## 11. BLACK-SCHOLES CONSTANTS

**File:** `/lib/financial/blackScholes.ts`
**Count:** 3 numerical constants

```typescript
const CONVERGENCE_TOLERANCE = 1e-6;
const MAX_ITERATIONS = 100;
const INITIAL_VOL_GUESS = 0.3;       // 30% initial volatility
```

**Recommendation:** Configuration file

---

## 12. UI COLOR MAPPINGS (Reports Page)

**Files:**
- `/app/(dashboard)/reports/page.tsx`
- `/components/reports/ReportList.tsx`
- `/components/reports/ReportViewer.tsx`
- `/components/reports/ReportEditor.tsx`

**Count:** 100+ instances of `slate-*` colors

**Problem:** Reports pages use Tailwind `slate-*` colors instead of design system

**Examples:**
```typescript
"bg-slate-950", "bg-slate-900", "bg-slate-800", "bg-slate-700"
"text-slate-400", "text-slate-300", "text-slate-500"
"border-slate-700", "border-slate-600"
"text-blue-400", "bg-blue-600", "hover:bg-blue-700"
```

**Should Be:**
```typescript
"bg-background-primary", "bg-background-secondary", "bg-background-tertiary"
"text-text-primary", "text-text-secondary", "text-text-tertiary"
"border-border-primary"
"text-accent-cyan", "bg-accent-cyan", "hover:bg-accent-cyan/80"
```

**Recommendation:** Systematic color replacement in all Reports components

---

## SUMMARY TABLE

| Category | File(s) | Count | Priority | Recommendation |
|----------|---------|-------|----------|----------------|
| Macro Defaults | macroImpact.ts | 8 | 🔴 HIGH | Config file |
| Sector Coefficients | macroImpact.ts | 25 | 🔴 HIGH | Database table |
| Financial Assumptions | macroImpact.ts | 7 | 🟡 MEDIUM | Entity metadata |
| Valuation Multiples | macroImpact.ts | 10 | 🔴 HIGH | Real-time API |
| CAPM Betas | capm.ts | 5 | 🔴 HIGH | Calculated values |
| Portfolio Defaults | portfolioOptimization.ts | 4 | 🟢 LOW | User settings |
| Risk Constants | riskMetrics.ts | 15+ | 🟡 MEDIUM | Scenario library |
| Level Baselines | levelSpecificControls.ts | 50+ | 🔴 HIGH | Data sources |
| Economic Multipliers | economicFlows.ts | 10+ | 🟡 MEDIUM | Calibration |
| Fixed Income | fixedIncome.ts | 5 | 🟢 LOW | Config file |
| Black-Scholes | blackScholes.ts | 3 | 🟢 LOW | Config file |
| UI Colors | reports/*.tsx | 100+ | 🟡 MEDIUM | Design system |

**Total Hardcoded Values: 242+**

---

## MIGRATION PLAN

### Phase 3.5: Immediate (This Week)
1. ✅ Create `/lib/config/macroDefaults.ts` - Macro variable defaults
2. ✅ Create `/lib/config/levelDefaults.ts` - Level baseline values
3. ✅ Fix Reports page colors → Design system

### Phase 11: Variablization (Week 24-26)
1. Database schema for sector coefficients
2. Historical calibration engine
3. Formula versioning system
4. Custom formula editor

### Long-term (Ongoing)
1. Real-time API integration for multiples
2. Calculated betas from market data
3. User-configurable defaults
4. A/B testing for formulas

---

## BENEFITS OF VARIABLIZATION

### 1. Flexibility
- Update coefficients without code deployment
- Test different parameter sets
- Sector-specific or company-specific overrides

### 2. Traceability
- Track data sources and provenance
- Version history for all parameters
- Audit trail for formula changes

### 3. Calibration
- Historical regression for optimal fit
- R² metrics for validation
- Error analysis and adjustment

### 4. Extensibility
- Add new sectors instantly
- Support new asset classes
- Easy formula customization

### 5. Accuracy
- Real-time data instead of static values
- Periodic recalibration
- Market-informed parameters

---

## NEXT STEPS

1. **This Session:**
   - [x] Complete hardcoded values audit ✅
   - [ ] Fix Reports page colors (IN PROGRESS)
   - [ ] Create macroDefaults.ts config file

2. **Next Session:**
   - [ ] Create database schema for coefficients
   - [ ] Build calibration engine prototype
   - [ ] Connect Fixed Income/CAPM/DCF to UI

3. **Phase 11 (Weeks 24-26):**
   - [ ] Full variablization system
   - [ ] Historical regression
   - [ ] Formula versioning
   - [ ] Custom formula editor

---

**Status:** Audit Complete ✅
**Next Priority:** Reports Color Fix + Config Files
**Long-term Goal:** Zero hardcoded values in simulation logic

---

**Last Updated:** 2025-11-12
**Author:** Claude (AI Assistant)
**Branch:** `claude/simlab-design-audit-digital-twin-phase0-011CV4R368cMgezomJuF2qy5`
