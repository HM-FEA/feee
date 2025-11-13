# 9-Level Propagation System - Integration Guide

**Created:** 2025-11-13
**Purpose:** Guide for integrating 9-level formula propagation into Simulation UI
**Status:** Implementation Complete, UI Integration Pending

---

## Overview

The 9-level ontology system is now **fully implemented** in:
```
/apps/web/src/lib/finance/nineLevelPropagation.ts
```

This document shows how to integrate it into the Simulation page.

---

## Quick Start: Using the 9-Level System

### 1. Basic Usage

```typescript
import { propagateAllLevels, analyzeFedRateImpact } from '@/lib/finance/nineLevelPropagation';
import { useCompanies } from '@/data/companies';
import { useMacroStore } from '@/lib/store/macroStore';

function SimulationComponent() {
  const companies = useCompanies();
  const macroState = useMacroStore((state) => state);

  // Define cross-level state
  const level0 = {
    container_rate_us_china: 3500,
    semiconductor_tariff: 0,
    energy_cost_index: 100,
  };

  // Run full 9-level propagation
  const propagationState = propagateAllLevels(level0, macroState, companies);

  // Access results by level
  const semiconductorSector = propagationState.level2.get('SEMICONDUCTOR');
  const nvidiaCompany = propagationState.level3.get('NVDA');
  const h100Product = propagationState.level4.get('H100');
  const hbm3eComponent = propagationState.level5.get('HBM3E');
  const aiTech = propagationState.level6.get('AI_TECH');
  const nvidiaOwnership = propagationState.level7.get('NVDA');
  const hyperscalerCustomer = propagationState.level8.get('HYPERSCALER');
  const tsmcFab = propagationState.level9.get('TSMC_FAB18');

  return (
    <div>
      {/* Display results */}
      <h2>Sector Impact</h2>
      <p>Revenue: {semiconductorSector?.revenue_impact.toFixed(2)}%</p>

      <h2>NVIDIA</h2>
      <p>Market Cap: ${(nvidiaCompany?.market_cap / 1000).toFixed(0)}B</p>

      <h2>H100 Demand</h2>
      <p>Demand Index: {h100Product?.demand_index.toFixed(0)}</p>

      <h2>HBM3E Supply</h2>
      <p>Bottleneck: {hbm3eComponent?.bottleneck ? 'YES ⚠️' : 'NO ✅'}</p>

      <h2>TSMC Fab 18</h2>
      <p>Utilization: {tsmcFab?.utilization_pct.toFixed(1)}%</p>
      <p>CapEx Required: ${tsmcFab?.capex_requirement}B</p>
    </div>
  );
}
```

---

## 2. Scenario Analysis (Baseline vs Shock)

```typescript
import { analyzeFedRateImpact } from '@/lib/finance/nineLevelPropagation';

function FedRateScenarioAnalysis() {
  const companies = useCompanies();

  // Run baseline vs +50bps shock
  const { baseline, shock, analysis } = analyzeFedRateImpact(companies);

  return (
    <div>
      <h1>Fed Rate Impact: +50 bps</h1>

      {/* Show markdown analysis */}
      <ReactMarkdown>{analysis}</ReactMarkdown>

      {/* Compare specific metrics */}
      <ComparisonTable>
        <Row>
          <Cell>NVIDIA Market Cap</Cell>
          <Cell>${(baseline.level3.get('NVDA')?.market_cap / 1000).toFixed(0)}B</Cell>
          <Cell>${(shock.level3.get('NVDA')?.market_cap / 1000).toFixed(0)}B</Cell>
          <Cell className="text-red-500">
            {(((shock.level3.get('NVDA')?.market_cap - baseline.level3.get('NVDA')?.market_cap) /
               baseline.level3.get('NVDA')?.market_cap) * 100).toFixed(2)}%
          </Cell>
        </Row>
        <Row>
          <Cell>HBM3E Bottleneck</Cell>
          <Cell>{baseline.level5.get('HBM3E')?.bottleneck ? 'YES' : 'NO'}</Cell>
          <Cell>{shock.level5.get('HBM3E')?.bottleneck ? 'YES' : 'NO'}</Cell>
          <Cell className="text-green-500">RELIEVED ✅</Cell>
        </Row>
        <Row>
          <Cell>TSMC CapEx</Cell>
          <Cell>${baseline.level9.get('TSMC_FAB18')?.capex_requirement}B</Cell>
          <Cell>${shock.level9.get('TSMC_FAB18')?.capex_requirement}B</Cell>
          <Cell className="text-green-500">-$10B (can defer) ✅</Cell>
        </Row>
      </ComparisonTable>
    </div>
  );
}
```

---

## 3. Real-Time Propagation on Slider Change

```typescript
import { useState, useEffect } from 'react';
import { propagateAllLevels } from '@/lib/finance/nineLevelPropagation';
import { useMacroStore } from '@/lib/store/macroStore';

function InteractiveSimulation() {
  const companies = useCompanies();
  const [fedRate, setFedRate] = useState(5.25);
  const [propagationState, setPropagationState] = useState(null);

  // Recalculate on slider change
  useEffect(() => {
    const level0 = {
      container_rate_us_china: 3500,
      semiconductor_tariff: 0,
      energy_cost_index: 100,
    };

    const level1 = {
      fed_funds_rate: fedRate / 100, // Convert to decimal
      us_gdp_growth: 0.025,
      us_cpi: 0.037,
      wti_oil: 78,
      vix: 15,
      usd_index: 104.5,
      us_unemployment: 3.8,
      us_m2_money_supply: 21000,
    };

    const state = propagateAllLevels(level0, level1, companies);
    setPropagationState(state);
  }, [fedRate, companies]);

  return (
    <div>
      <label>Fed Funds Rate: {fedRate.toFixed(2)}%</label>
      <input
        type="range"
        min={0}
        max={10}
        step={0.25}
        value={fedRate}
        onChange={(e) => setFedRate(parseFloat(e.target.value))}
      />

      {propagationState && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Level 2: Sector */}
          <Card>
            <h3>L2: Semiconductor Sector</h3>
            <Metric
              label="Revenue Impact"
              value={`${propagationState.level2.get('SEMICONDUCTOR')?.revenue_impact.toFixed(2)}%`}
            />
          </Card>

          {/* Level 5: Component Bottleneck */}
          <Card>
            <h3>L5: HBM3E Supply</h3>
            <Metric
              label="Bottleneck"
              value={propagationState.level5.get('HBM3E')?.bottleneck ? '⚠️ YES' : '✅ NO'}
              className={propagationState.level5.get('HBM3E')?.bottleneck ? 'text-red-500' : 'text-green-500'}
            />
          </Card>

          {/* Level 9: Facility */}
          <Card>
            <h3>L9: TSMC Fab</h3>
            <Metric
              label="Utilization"
              value={`${propagationState.level9.get('TSMC_FAB18')?.utilization_pct.toFixed(1)}%`}
            />
            <Metric
              label="CapEx Needed"
              value={`$${propagationState.level9.get('TSMC_FAB18')?.capex_requirement}B`}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Visualization: 9-Level Flow Diagram

```typescript
import ReactFlow, { Node, Edge } from 'reactflow';

function NineLevelFlowVisualization({ propagationState }: { propagationState: PropagationState }) {
  // Build nodes for all 9 levels
  const nodes: Node[] = [
    // Level 1: Macro
    {
      id: 'macro',
      type: 'input',
      data: { label: `Fed Rate: ${(propagationState.level1.fed_funds_rate * 100).toFixed(2)}%` },
      position: { x: 250, y: 0 },
    },

    // Level 2: Sector
    {
      id: 'sector-semi',
      data: {
        label: `Semiconductor\nRevenue: ${propagationState.level2.get('SEMICONDUCTOR')?.revenue_impact.toFixed(2)}%`
      },
      position: { x: 100, y: 100 },
    },

    // Level 3: Company
    {
      id: 'company-nvda',
      data: {
        label: `NVIDIA\nMarket Cap: $${(propagationState.level3.get('NVDA')?.market_cap / 1000).toFixed(0)}B`
      },
      position: { x: 100, y: 200 },
    },

    // Level 4: Product
    {
      id: 'product-h100',
      data: {
        label: `H100 GPU\nDemand: ${propagationState.level4.get('H100')?.demand_index.toFixed(0)}`
      },
      position: { x: 100, y: 300 },
    },

    // Level 5: Component
    {
      id: 'component-hbm',
      data: {
        label: `HBM3E\nBottleneck: ${propagationState.level5.get('HBM3E')?.bottleneck ? 'YES' : 'NO'}`,
        style: {
          background: propagationState.level5.get('HBM3E')?.bottleneck ? '#fee' : '#efe',
        },
      },
      position: { x: 100, y: 400 },
    },

    // Level 6: Technology
    {
      id: 'tech-ai',
      data: {
        label: `AI Tech\nInvestment: $${propagationState.level6.get('AI_TECH')?.ai_investment}B`
      },
      position: { x: 100, y: 500 },
    },

    // Level 7: Ownership
    {
      id: 'ownership-nvda',
      data: {
        label: `NVDA Ownership\nInstitutional: ${propagationState.level7.get('NVDA')?.institutional_ownership_pct.toFixed(1)}%`
      },
      position: { x: 100, y: 600 },
    },

    // Level 8: Customer
    {
      id: 'customer-hyper',
      data: {
        label: `Hyperscalers\nCapEx: $${propagationState.level8.get('HYPERSCALER')?.hyperscaler_capex.toFixed(1)}B`
      },
      position: { x: 100, y: 700 },
    },

    // Level 9: Facility
    {
      id: 'facility-tsmc',
      data: {
        label: `TSMC Fab 18\nUtilization: ${propagationState.level9.get('TSMC_FAB18')?.utilization_pct.toFixed(1)}%\nCapEx: $${propagationState.level9.get('TSMC_FAB18')?.capex_requirement}B`
      },
      position: { x: 100, y: 800 },
    },
  ];

  const edges: Edge[] = [
    { id: 'e1-2', source: 'macro', target: 'sector-semi', label: 'Rate Sensitivity' },
    { id: 'e2-3', source: 'sector-semi', target: 'company-nvda', label: 'Sector Impact' },
    { id: 'e3-4', source: 'company-nvda', target: 'product-h100', label: 'Revenue → Demand' },
    { id: 'e4-5', source: 'product-h100', target: 'component-hbm', label: 'Component Req' },
    { id: 'e5-6', source: 'component-hbm', target: 'tech-ai', label: 'Bottleneck → R&D' },
    { id: 'e6-7', source: 'tech-ai', target: 'ownership-nvda', label: 'Moat → Ownership' },
    { id: 'e7-8', source: 'ownership-nvda', target: 'customer-hyper', label: 'Priority' },
    { id: 'e8-9', source: 'customer-hyper', target: 'facility-tsmc', label: 'Order Volume' },
  ];

  return (
    <div style={{ width: '100%', height: '1000px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
}
```

---

## 5. Integration with Existing Simulation Page

### Option A: Add as New View Mode

```typescript
// In apps/web/src/app/(dashboard)/simulation/page.tsx

type ViewMode =
  | 'svg'
  | '2d-network'
  | '3d-twin'
  | 'economics'
  | 'sector-analysis'
  | 'nine-level-propagation';  // ← Add this

// In the view mode selector
<button
  onClick={() => setViewMode('nine-level-propagation')}
  className={viewMode === 'nine-level-propagation' ? 'active' : ''}
>
  <Network size={20} />
  <span>9-Level Propagation</span>
  <span className="badge">NEW</span>
</button>

// In the view rendering section
{viewMode === 'nine-level-propagation' && (
  <NineLevelPropagationView
    macroState={macroState}
    companies={companies}
  />
)}
```

### Option B: Add as Modal/Overlay

```typescript
import { Dialog } from '@/components/ui/dialog';

function SimulationPage() {
  const [show9LevelModal, setShow9LevelModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow9LevelModal(true)}
        className="btn-secondary"
      >
        View 9-Level Analysis
      </button>

      <Dialog open={show9LevelModal} onClose={() => setShow9LevelModal(false)}>
        <NineLevelFlowVisualization propagationState={propagationState} />
      </Dialog>
    </>
  );
}
```

### Option C: Add as Separate Page Route

```typescript
// Create: apps/web/src/app/(dashboard)/nine-level/page.tsx

export default function NineLevelAnalysisPage() {
  const companies = useCompanies();
  const macroState = useMacroStore();

  const level0 = { /* ... */ };
  const propagationState = propagateAllLevels(level0, macroState, companies);

  return (
    <div className="min-h-screen bg-background-primary">
      <Header title="9-Level Ontology Analysis" />

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <NineLevelFlowVisualization propagationState={propagationState} />

        <div className="grid grid-cols-3 gap-4 mt-6">
          <LevelCard level={2} state={propagationState.level2} />
          <LevelCard level={5} state={propagationState.level5} />
          <LevelCard level={9} state={propagationState.level9} />
        </div>
      </div>
    </div>
  );
}

// Add to LeftSidebar navigation
{
  name: '9-Level Analysis',
  href: '/nine-level',
  icon: <Network />,
  badge: 'New'
}
```

---

## 6. Performance Optimization

### Memoization

```typescript
import { useMemo } from 'react';

function OptimizedSimulation() {
  const companies = useCompanies();
  const macroState = useMacroStore();

  // Memoize propagation calculation
  const propagationState = useMemo(() => {
    const level0 = { /* ... */ };
    return propagateAllLevels(level0, macroState, companies);
  }, [macroState, companies]);

  return <div>{/* Use propagationState */}</div>;
}
```

### Incremental Updates

```typescript
// Only recalculate affected levels when macro changes
function incrementalPropagation(
  previousState: PropagationState,
  macroChange: Partial<MacroState>
): PropagationState {
  // If only Fed rate changed, recalculate from Level 1 → 9
  // If only sector-specific variable changed, start from Level 2
  // Etc.
}
```

---

## 7. Testing

### Unit Tests

```typescript
// tests/nineLevelPropagation.test.ts

import { propagateLevel1ToLevel2, propagateAllLevels } from '@/lib/finance/nineLevelPropagation';

describe('9-Level Propagation', () => {
  test('Level 1 → 2: Fed rate increase hurts semiconductors', () => {
    const level0 = { /* baseline */ };
    const level1 = { fed_funds_rate: 0.0575, /* ... */ };

    const result = propagateLevel1ToLevel2(level0, level1, 'SEMICONDUCTOR');

    expect(result.revenue_impact).toBeLessThan(0); // Negative impact
    expect(result.margin_impact).toBeLessThan(0);
  });

  test('Full 9-level propagation completes without errors', () => {
    const level0 = { /* ... */ };
    const level1 = { /* ... */ };
    const companies = [/* mock companies */];

    const state = propagateAllLevels(level0, level1, companies);

    expect(state.level2.size).toBeGreaterThan(0);
    expect(state.level3.size).toBeGreaterThan(0);
    expect(state.level9.size).toBeGreaterThan(0);
  });

  test('HBM3E bottleneck detection works', () => {
    // Test that Level 5 correctly identifies bottlenecks
    const level4 = {
      product: 'H100',
      type: 'AI_GPU',
      volume: 150000, // High demand
      /* ... */
    };

    const level5 = propagateLevel4ToLevel5(level4, 'HBM3E', 'HBM3E', {
      supply_index: 100,
      capacity: 120000, // Lower than demand
      price_index: 100,
    });

    expect(level5.bottleneck).toBe(true);
    expect(level5.constraint_impact).toBeLessThan(0);
  });
});
```

---

## 8. Future Enhancements

### 8.1 User-Defined Coefficients

Allow users to override default formulas:

```typescript
interface UserOverrides {
  sector: string;
  coefficient: string;
  value: number;
  reason: string;
}

const userOverrides: UserOverrides[] = [
  {
    sector: 'SEMICONDUCTOR',
    coefficient: 'gdp_elasticity',
    value: 2.0, // User thinks it's higher than default 1.8
    reason: 'AI boom increases cyclicality'
  }
];

// Apply overrides before propagation
const modifiedState = applyUserOverrides(propagationState, userOverrides);
```

### 8.2 Historical Backtesting

```typescript
async function backtestFormulas(startDate: Date, endDate: Date) {
  const historicalData = await fetchHistoricalMacroData(startDate, endDate);
  const actualOutcomes = await fetchActualCompanyData(startDate, endDate);

  const predictions = historicalData.map(snapshot => {
    return propagateAllLevels(snapshot.level0, snapshot.level1, companies);
  });

  const errors = compareWithActual(predictions, actualOutcomes);

  return {
    meanAbsoluteError: calculateMAE(errors),
    rSquared: calculateRSquared(predictions, actualOutcomes),
    recommendations: suggestCoefficientAdjustments(errors)
  };
}
```

### 8.3 Multi-Scenario Comparison

```typescript
function compareScenarios(scenarios: Scenario[]) {
  const results = scenarios.map(scenario => {
    return propagateAllLevels(scenario.level0, scenario.level1, companies);
  });

  return {
    bestCase: findBest(results),
    worstCase: findWorst(results),
    mostLikely: findMostLikely(results),
    comparison: buildComparisonMatrix(results)
  };
}
```

---

## Summary

✅ **Implementation Complete:** All 9 levels with formulas
✅ **Example Complete:** Fed Rate +50bps scenario documented
✅ **Ready for Integration:** Multiple integration options provided

**Next Steps:**
1. Choose integration approach (View Mode / Modal / Separate Page)
2. Build UI components (cards, flow diagram, comparison table)
3. Test with real macro data
4. Add to Simulation page navigation

**Files Created:**
- `/apps/web/src/lib/finance/nineLevelPropagation.ts` (740 lines)
- `/docs/implementation/9_LEVEL_PROPAGATION_EXAMPLE.md` (detailed example)
- `/docs/implementation/9_LEVEL_INTEGRATION_GUIDE.md` (this file)

**This is the complete 9-level ontology system you designed.**
