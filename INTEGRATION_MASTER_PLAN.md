# Nexus-Alpha Integration Master Plan
**Complete Financial + Economic + Supply Chain Ontology Platform**

## 현재 상태 (2025-11-11)

### ✅ 완료된 항목
1. **Real Economic Simulation** ✅
   - Fed Rate ↔ M2 ↔ GDP ↔ VIX 상호작용
   - Banking: 금리 ↑ → +15% 수익
   - REITs: 금리 ↑ → -25% 손실
   - Crypto: M2 ↑ → +40% 상승
   - 파일: `dateBasedSimulation.ts` (486 lines)

2. **Supply Chain Marketplace** ✅
   - 5개 시나리오 (NVIDIA, Tesla, iPhone, Pfizer, Solar)
   - Polymarket-style voting
   - Dynamic scenario selection
   - 파일: `supplyChainScenarios.ts` (320 lines)

3. **Community Features** ✅ (commit b52862d)
   - Scenario voting & creation
   - AI Report Generator (4 templates)
   - MD Editor with [[entity-links]]
   - Cascade Effects animation
   - 파일: 8 files, 2278 lines

4. **9-Level Ontology** ✅ (commit fd1f92a)
   - NVIDIA deep supply chain
   - Knowledge graph relationships
   - Level-specific controls
   - 파일: `expandedKnowledgeGraph.ts`

5. **DateSimulator + Scenario Integration** ✅
   - Historical scenarios trigger date-based sim
   - 2008 Crisis, 2022 Inflation 등
   - 파일: `DateSimulator.tsx` (397 lines)

### ❌ 미완성 항목

#### 1. Financial Mathematics Tools (CRITICAL)
**Status**: 다른 브랜치에 존재 (commit 7f598b9) 하지만 현재 브랜치에 없음

필요한 파일:
- `lib/financial/blackScholes.ts` (520 lines) - Option pricing
- `lib/financial/portfolioOptimization.ts` (481 lines) - Markowitz
- `lib/financial/riskMetrics.ts` (570 lines) - VaR, CVaR
- `lib/financial/fixedIncome.ts` (620 lines) - Bond pricing
- `components/financial/OptionPricingCalculator.tsx` (345 lines)
- `components/financial/PortfolioOptimizer.tsx` (420 lines)
- `components/financial/RiskDashboard.tsx` (380 lines)
- `components/financial/BondAnalyzer.tsx` (450 lines)

**Total**: ~3,800 lines

#### 2. Arc Effects & Flow Visualization (HIGH)
**Status**: Globe3D에 기본 arcs만, 실제 impact flows 없음

필요:
- Fed Rate 변화 → Banking/REITs에 colored arcs
- M2 변화 → Asset prices에 flow
- Supply chain flows (SK Hynix → NVIDIA)
- Real-time animation

파일: `Globe3D.tsx` enhancement (~200 lines)

#### 3. Supply Chain Propagation (HIGH)
**Status**: SK Hynix 변화가 NVIDIA에 영향 안줌

필요:
- Downstream propagation logic
- HBM shortage → GPU production impact
- TSMC capacity → Multiple customers
- Bottleneck cascade effects

파일: `dateBasedSimulation.ts` enhancement (~150 lines)

#### 4. Economic Flow Dashboard (MEDIUM)
**Status**: 없음

필요:
- Real-time flow diagram (Fed → Banking → Economy)
- Loan flows visualization
- M2 circulation paths
- Credit market dynamics

파일: `components/simulation/EconomicFlowDashboard.tsx` (~400 lines)

#### 5. Header Navigation Integration (MEDIUM)
**Status**: Financial tools가 header에 없음

필요:
- "Finance" dropdown menu
- Links to Option/Portfolio/Risk/Bond
- Integration with Sim Lab

파일: `GlobalTopNav.tsx` enhancement (~50 lines)

---

## Phase 1: Financial Mathematics (6,000 lines)
**Priority**: CRITICAL
**Time**: 2-3 hours
**Token Budget**: 30,000

### 1.1 Black-Scholes Option Pricing
```typescript
// lib/financial/blackScholes.ts
export function blackScholes(
  S: number,    // Spot price
  K: number,    // Strike
  T: number,    // Time to expiry
  r: number,    // Risk-free rate
  sigma: number // Volatility
): { call: number; put: number; greeks: Greeks }

export function impliedVolatility(
  marketPrice: number,
  S: number, K: number, T: number, r: number,
  optionType: 'call' | 'put'
): number // Newton-Raphson

export interface Greeks {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  rho: number;
}
```

**UI Component**: `OptionPricingCalculator.tsx`
- Interactive sliders (S, K, T, r, σ)
- Real-time Greeks display
- Put-Call Parity validation
- Implied Volatility calculator

### 1.2 Portfolio Optimization (Markowitz)
```typescript
// lib/financial/portfolioOptimization.ts
export function efficientFrontier(
  returns: number[][],
  targetReturns: number[]
): Portfolio[]

export function tangencyPortfolio(
  returns: number[][],
  riskFreeRate: number
): Portfolio // Max Sharpe

export function minVariancePortfolio(
  returns: number[][]
): Portfolio

export interface Portfolio {
  weights: number[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  beta: number;
  alpha: number;
}
```

**UI Component**: `PortfolioOptimizer.tsx`
- Scatter plot: Risk-Return frontier
- Strategy cards (Tangency, Min Var, Risk Parity)
- Asset allocation sliders
- Performance metrics

### 1.3 Risk Metrics (VaR)
```typescript
// lib/financial/riskMetrics.ts
export function calculateVaR(
  returns: number[],
  confidenceLevel: number,
  method: 'historical' | 'parametric' | 'monte-carlo'
): number

export function conditionalVaR(
  returns: number[],
  confidenceLevel: number
): number // CVaR / ES

export function stressTest(
  portfolio: Portfolio,
  scenario: StressScenario
): StressTestResult

export const SCENARIOS = {
  crisis2008: { ... },
  covid2020: { ... },
  inflation2022: { ... }
}
```

**UI Component**: `RiskDashboard.tsx`
- VaR calculator with confidence selector
- Stress test scenario cards
- Component VaR breakdown
- Historical drawdown chart

### 1.4 Fixed Income Analytics
```typescript
// lib/financial/fixedIncome.ts
export function bondPrice(
  coupon: number,
  frequency: number,
  maturity: number,
  yieldRate: number,
  faceValue: number
): number

export function yieldToMaturity(
  price: number,
  coupon: number,
  maturity: number,
  faceValue: number
): number // Newton-Raphson

export function duration(
  coupon: number,
  maturity: number,
  yieldRate: number
): { macaulay: number; modified: number }

export function convexity(
  coupon: number,
  maturity: number,
  yieldRate: number
): number

export function nelsonSiegelYieldCurve(
  beta0: number, beta1: number, beta2: number, tau: number,
  maturities: number[]
): number[]
```

**UI Component**: `BondAnalyzer.tsx`
- Bond pricer with parameter inputs
- Price-Yield curve visualization
- Duration vs Convexity comparison
- Yield curve display (Nelson-Siegel)

---

## Phase 2: Economic Flow Visualization (800 lines)
**Priority**: HIGH
**Time**: 1-2 hours
**Token Budget**: 15,000

### 2.1 Arc Effects Enhancement
```typescript
// Globe3D.tsx enhancement
interface ImpactArc {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  color: string; // green (positive) / red (negative)
  magnitude: number;
  label: string;
}

// Fed Rate ↑ → Banking arcs (green)
// Fed Rate ↑ → REITs arcs (red)
// M2 ↑ → Crypto arcs (green)
```

### 2.2 Economic Flow Dashboard
```typescript
// components/simulation/EconomicFlowDashboard.tsx
export default function EconomicFlowDashboard({
  currentSnapshot
}: Props) {
  return (
    <div className="flow-diagram">
      {/* Central Bank */}
      <div>Fed Rate: {rate}%</div>

      {/* Arrows with % changes */}
      <Arrow direction="down" change="+22%" color="green">
        → Banking Sector
      </Arrow>

      <Arrow direction="down" change="-30%" color="red">
        → REITs
      </Arrow>

      {/* M2 Flow */}
      <div>M2: ${m2}T</div>
      <Arrow direction="right" change="+15%" color="green">
        → Asset Prices
      </Arrow>
    </div>
  )
}
```

---

## Phase 3: Supply Chain Propagation (300 lines)
**Priority**: HIGH
**Time**: 1 hour
**Token Budget**: 8,000

### 3.1 Downstream Propagation Logic
```typescript
// dateBasedSimulation.ts enhancement
interface SupplyChainRelationship {
  supplier: string;
  customer: string;
  propagationFactor: number; // 0-1
}

const SUPPLY_CHAIN_LINKS = [
  { supplier: 'sk-hynix', customer: 'company-nvidia', propagationFactor: 0.4 },
  { supplier: 'company-tsmc', customer: 'company-nvidia', propagationFactor: 0.5 },
  { supplier: 'company-nvidia', customer: 'customer-microsoft', propagationFactor: 0.3 },
]

// In evolveEntity():
// 1. Calculate entity's own change
// 2. Apply supplier impacts
// 3. Propagate to customers

function applySupplyChainPropagation(
  entityId: string,
  baseChange: number,
  allEntities: Map<string, EntitySnapshot>
): number {
  let totalImpact = 0;

  // Find suppliers
  const suppliers = SUPPLY_CHAIN_LINKS.filter(l => l.customer === entityId);
  suppliers.forEach(link => {
    const supplier = allEntities.get(link.supplier);
    if (supplier) {
      // Supplier growth → Customer growth
      totalImpact += supplier.changeRate * link.propagationFactor;
    }
  });

  return totalImpact;
}
```

### 3.2 Bottleneck Effects
```typescript
// If SK Hynix production drops 20%
// → NVIDIA production constrained by HBM shortage
// → Microsoft GPU deliveries delayed
// → AI training capacity reduced

function simulateBottleneck(
  bottleneckEntity: string,
  severityPct: number
): CascadeEffect[] {
  const effects: CascadeEffect[] = [];

  // Find downstream
  const downstream = findDownstream(bottleneckEntity);
  downstream.forEach(entity => {
    effects.push({
      entity,
      impactPct: severityPct * getBottleneckSeverity(bottleneckEntity),
      reason: `${bottleneckEntity} supply constraint`
    });
  });

  return effects;
}
```

---

## Phase 4: Complete Integration (500 lines)
**Priority**: MEDIUM
**Time**: 1 hour
**Token Budget**: 10,000

### 4.1 Header Navigation
```typescript
// GlobalTopNav.tsx
const mainNavigation = [
  // ...existing...
  {
    name: 'Finance',
    icon: DollarSign,
    group: 'tools',
    submenu: [
      { name: 'Option Pricing', href: '/finance/options' },
      { name: 'Portfolio Optimizer', href: '/finance/portfolio' },
      { name: 'Risk Dashboard', href: '/finance/risk' },
      { name: 'Bond Analyzer', href: '/finance/bonds' },
    ]
  },
]
```

### 4.2 Sim Lab Integration
```typescript
// simulation/page.tsx
const viewModes = [
  'globe',
  'network',
  'supply-chain',
  'economic-flows',  // NEW
  'financial-tools'  // NEW
]

{viewMode === 'financial-tools' && (
  <div className="grid grid-cols-2 gap-6">
    <OptionPricingCalculator />
    <PortfolioOptimizer />
    <RiskDashboard />
    <BondAnalyzer />
  </div>
)}
```

---

## Phase 5: Testing & Polish (200 lines)
**Priority**: MEDIUM
**Time**: 30 mins
**Token Budget**: 5,000

- Compile check
- Test all flows
- Fix TypeScript errors
- Performance optimization

---

## Phase 6: Documentation (500 lines)
**Priority**: LOW
**Time**: 30 mins
**Token Budget**: 8,000

- FINAL_SUMMARY.md
- API documentation
- User guide

---

## Implementation Order

### Immediate (Today)
1. ✅ Supply Chain Marketplace (DONE)
2. ✅ Real Economic Simulation (DONE)
3. ⏳ Financial Mathematics (IN PROGRESS)

### Next (3-4 hours)
4. Economic Flow Visualization
5. Supply Chain Propagation
6. Complete Integration

### Final (1 hour)
7. Testing & Polish
8. Documentation

---

## Total Estimates
- **Lines of Code**: ~8,000 new lines
- **Files**: ~15 new files
- **Time**: 5-6 hours
- **Token Budget**: ~80,000 tokens

---

## Success Criteria

### User Can:
1. Click Historical Scenario → See real economic impacts
2. Vote on Supply Chain scenarios → Select and analyze
3. Use Option Pricer → Calculate Greeks, Implied Vol
4. Use Portfolio Optimizer → Build efficient frontier
5. Use Risk Dashboard → Calculate VaR, stress tests
6. Use Bond Analyzer → Price bonds, yield curves
7. See Arc Effects → Fed→Banking flows visualized
8. See Supply Chain → SK Hynix→NVIDIA propagation

### Platform Has:
1. Real economic relationships (not random)
2. Multiple supply chain scenarios
3. Complete financial mathematics
4. Visual flow diagrams
5. Integrated ontology (9 levels)
6. Community features (voting, reports)

---

## Next Steps

**RIGHT NOW**: Implement Phase 1 (Financial Mathematics)

Starting with:
1. `lib/financial/blackScholes.ts`
2. `components/financial/OptionPricingCalculator.tsx`
3. Test Black-Scholes
4. Continue with Portfolio, Risk, Bond
