/**
 * AI Report Template Generator (Mock)
 *
 * Generates analyst-style markdown reports based on scenarios.
 * No actual AI API - uses template-based generation with scenario data.
 */

import { Scenario } from '@/lib/store/scenarioStore';
import { MacroState } from '@/lib/store/macroStore';
import { LevelState } from '@/lib/store/levelStore';

export type ReportType = 'scenario_analysis' | 'sector_deep_dive' | 'risk_assessment' | 'macro_outlook';

export interface ReportTemplate {
  type: ReportType;
  title: string;
  description: string;
  icon: string;
}

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    type: 'scenario_analysis',
    title: 'Scenario Analysis Report',
    description: 'Comprehensive analysis of scenario impacts across the knowledge graph',
    icon: '📊',
  },
  {
    type: 'sector_deep_dive',
    title: 'Sector Deep Dive',
    description: 'Detailed sector-specific analysis with supply chain implications',
    icon: '🔍',
  },
  {
    type: 'risk_assessment',
    title: 'Risk Assessment',
    description: 'Identify key risks and vulnerabilities in the current scenario',
    icon: '⚠️',
  },
  {
    type: 'macro_outlook',
    title: 'Macro Economic Outlook',
    description: 'Top-down analysis of macroeconomic conditions and projections',
    icon: '🌍',
  },
];

/**
 * Generate a mock AI report based on a scenario
 */
export function generateReport(
  scenario: Scenario,
  reportType: ReportType,
  additionalContext?: string
): string {
  switch (reportType) {
    case 'scenario_analysis':
      return generateScenarioAnalysisReport(scenario, additionalContext);
    case 'sector_deep_dive':
      return generateSectorDeepDiveReport(scenario, additionalContext);
    case 'risk_assessment':
      return generateRiskAssessmentReport(scenario, additionalContext);
    case 'macro_outlook':
      return generateMacroOutlookReport(scenario, additionalContext);
    default:
      return generateScenarioAnalysisReport(scenario, additionalContext);
  }
}

/**
 * Scenario Analysis Report
 */
function generateScenarioAnalysisReport(scenario: Scenario, context?: string): string {
  const { macroState, levelState, description, selectedSector, stats } = scenario;

  // Analyze key macro changes
  const macroChanges = analyzeMacroChanges(macroState);
  const levelChanges = analyzeLevelChanges(levelState || {});

  const report = `# ${scenario.icon || '📊'} ${scenario.name}

**Report Type:** Scenario Analysis
**Generated:** ${new Date().toLocaleString()}
**Author:** Nexus-Alpha AI Assistant (Mock)

---

## Executive Summary

${description}

${context ? `\n**Additional Context:** ${context}\n` : ''}

This scenario analysis examines the cascading effects of ${macroChanges.length} macro-economic changes and ${levelChanges.length} level-specific adjustments across the economic knowledge graph.

**Key Metrics:**
- **Total Impact Score:** ${stats?.totalImpact || 'N/A'}
- **Affected Sectors:** ${stats?.affectedSectors.join(', ') || 'Multiple'}
- **Analysis Date:** ${new Date().toLocaleDateString()}

---

## Macro-Economic Changes

${macroChanges.length > 0 ? macroChanges.map(change => `
### ${change.name}

- **Current Value:** ${change.current}
- **Baseline:** ${change.baseline}
- **Change:** ${change.delta} (${change.percentChange})
- **Impact:** ${change.impact}

${change.implications}
`).join('\n') : '*No significant macro changes detected.*'}

---

## Level-Specific Dynamics

${levelChanges.length > 0 ? levelChanges.map(change => `
### ${change.name}

- **Level:** ${change.level}
- **Current Value:** ${change.current}
- **Change:** ${change.delta}
- **Primary Affected Entities:** ${change.affectedEntities}

**Analysis:**
${change.analysis}
`).join('\n') : '*No level-specific adjustments in this scenario.*'}

---

## Sector Analysis

${selectedSector ? `
This scenario focuses on the **${selectedSector}** sector.

### Supply Chain Implications

The changes in this scenario will propagate through the supply chain as follows:

1. **Upstream Impact:** ${getUpstreamImpact(selectedSector, macroState)}
2. **Downstream Impact:** ${getDownstreamImpact(selectedSector, macroState)}
3. **Cross-Sector Dependencies:** ${getCrossSectorImpact(selectedSector)}

` : '*This is a general macro scenario without sector-specific focus.*'}

---

## Key Insights

${stats?.keyInsights && stats.keyInsights.length > 0 ? stats.keyInsights.map((insight, idx) => `${idx + 1}. ${insight}`).join('\n') : generateDefaultInsights(macroState, levelState)}

---

## Risk Assessment

### Primary Risks

${generateRisks(macroState, levelState)}

### Opportunities

${generateOpportunities(macroState, levelState)}

---

## Recommendations

${generateRecommendations(scenario)}

---

## Data Sources & Methodology

- **Knowledge Graph:** 9-Level Economic Ontology (Macro → Facility)
- **Impact Calculation:** Formula-based propagation system
- **Entity Coverage:** ${stats?.affectedSectors.length || 0}+ sectors analyzed
- **Confidence Level:** Medium (Mock AI Generation)

---

*This report was generated using Nexus-Alpha's AI Report Generator (Mock). For production analysis, connect to real-time data feeds and LLM APIs.*

---

## Entity References

${generateEntityReferences(scenario)}
`;

  return report;
}

/**
 * Sector Deep Dive Report
 */
function generateSectorDeepDiveReport(scenario: Scenario, context?: string): string {
  const sector = scenario.selectedSector || 'SEMICONDUCTOR';

  return `# 🔍 Sector Deep Dive: ${sector}

**Scenario:** ${scenario.name}
**Generated:** ${new Date().toLocaleString()}

---

## Sector Overview

The **${sector}** sector is a critical component of the global economy, with significant exposure to macroeconomic variables and supply chain dynamics.

### Current State

${getSectorCurrentState(sector, scenario.macroState)}

---

## Supply Chain Analysis

### Tier 1: Direct Suppliers

${getTier1Suppliers(sector)}

### Tier 2: Component Manufacturers

${getTier2Components(sector)}

### Tier 3: Raw Materials & Technology

${getTier3Materials(sector)}

---

## Scenario Impact on ${sector}

${getDetailedSectorImpact(sector, scenario)}

---

## Company-Level Analysis

${getCompanyLevelAnalysis(sector, scenario)}

---

## Investment Implications

${getInvestmentImplications(sector, scenario.macroState)}

---

*Generated by Nexus-Alpha AI (Mock)*
`;
}

/**
 * Risk Assessment Report
 */
function generateRiskAssessmentReport(scenario: Scenario, context?: string): string {
  return `# ⚠️ Risk Assessment: ${scenario.name}

**Generated:** ${new Date().toLocaleString()}

---

## Risk Matrix

${generateRiskMatrix(scenario)}

---

## Critical Vulnerabilities

${generateCriticalVulnerabilities(scenario)}

---

## Mitigation Strategies

${generateMitigationStrategies(scenario)}

---

*Generated by Nexus-Alpha AI (Mock)*
`;
}

/**
 * Macro Outlook Report
 */
function generateMacroOutlookReport(scenario: Scenario, context?: string): string {
  const { macroState } = scenario;

  return `# 🌍 Macro Economic Outlook

**Scenario:** ${scenario.name}
**Generated:** ${new Date().toLocaleString()}

---

## Economic Indicators

### Interest Rates & Monetary Policy

- **Fed Funds Rate:** ${(macroState.fed_funds_rate * 100).toFixed(2)}%
- **10Y Treasury Yield:** ${(macroState.us_10y_yield * 100).toFixed(2)}%
- **2Y Treasury Yield:** ${(macroState.us_2y_yield * 100).toFixed(2)}%
- **Yield Curve:** ${macroState.us_10y_yield > macroState.us_2y_yield ? 'Normal' : 'Inverted ⚠️'}

**Analysis:**
${analyzeMonetaryPolicy(macroState)}

---

## Growth & Inflation

- **GDP Growth:** ${(macroState.us_gdp_growth * 100).toFixed(2)}%
- **CPI Inflation:** ${(macroState.us_cpi * 100).toFixed(2)}%
- **Unemployment:** ${macroState.us_unemployment.toFixed(1)}%

**Analysis:**
${analyzeGrowthInflation(macroState)}

---

## Market Sentiment

- **VIX (Volatility):** ${macroState.vix.toFixed(1)}
- **USD Index:** ${macroState.usd_index.toFixed(1)}
- **WTI Oil:** $${macroState.wti_oil.toFixed(0)}/bbl

**Analysis:**
${analyzeMarketSentiment(macroState)}

---

## Sector Implications

${generateSectorImplications(macroState)}

---

*Generated by Nexus-Alpha AI (Mock)*
`;
}

/**
 * Helper: Analyze macro changes
 */
function analyzeMacroChanges(macroState: MacroState): any[] {
  const changes: any[] = [];

  // Fed Funds Rate
  if (Math.abs(macroState.fed_funds_rate - 0.0525) > 0.0025) {
    changes.push({
      name: 'Fed Funds Rate',
      current: `${(macroState.fed_funds_rate * 100).toFixed(2)}%`,
      baseline: '5.25%',
      delta: `${((macroState.fed_funds_rate - 0.0525) * 100).toFixed(2)}%`,
      percentChange: `${(((macroState.fed_funds_rate - 0.0525) / 0.0525) * 100).toFixed(1)}%`,
      impact: macroState.fed_funds_rate > 0.0525 ? 'Contractionary' : 'Expansionary',
      implications: macroState.fed_funds_rate > 0.0525
        ? 'Higher rates increase borrowing costs, strengthen USD, and typically pressure equity valuations. [[sector-banking]] benefits from wider net interest margins.'
        : 'Lower rates stimulate borrowing and investment, but may weaken USD. [[sector-technology]] and [[sector-real-estate]] tend to benefit.',
    });
  }

  // GDP Growth
  if (Math.abs(macroState.us_gdp_growth - 0.025) > 0.005) {
    changes.push({
      name: 'GDP Growth',
      current: `${(macroState.us_gdp_growth * 100).toFixed(2)}%`,
      baseline: '2.5%',
      delta: `${((macroState.us_gdp_growth - 0.025) * 100).toFixed(2)}%`,
      percentChange: `${(((macroState.us_gdp_growth - 0.025) / 0.025) * 100).toFixed(1)}%`,
      impact: macroState.us_gdp_growth > 0.025 ? 'Growth Acceleration' : 'Growth Slowdown',
      implications: macroState.us_gdp_growth > 0.025
        ? 'Strong growth supports corporate earnings across sectors, especially [[sector-manufacturing]] and [[sector-technology]]. Watch for inflation risks.'
        : 'Weak growth pressures corporate revenues. Defensive sectors like [[sector-utilities]] and [[sector-healthcare]] may outperform.',
    });
  }

  // VIX
  if (Math.abs(macroState.vix - 15) > 5) {
    changes.push({
      name: 'VIX (Market Volatility)',
      current: macroState.vix.toFixed(1),
      baseline: '15.0',
      delta: (macroState.vix - 15).toFixed(1),
      percentChange: `${(((macroState.vix - 15) / 15) * 100).toFixed(1)}%`,
      impact: macroState.vix > 25 ? 'High Stress' : macroState.vix > 15 ? 'Elevated' : 'Low',
      implications: macroState.vix > 25
        ? 'Heightened volatility indicates market stress. Flight to safety benefits [[sector-utilities]] and treasuries. Risky assets face headwinds.'
        : 'Low volatility environment supports risk assets. Equity valuations may expand.',
    });
  }

  return changes;
}

/**
 * Helper: Analyze level changes
 */
function analyzeLevelChanges(levelState: LevelState): any[] {
  const changes: any[] = [];

  // NVIDIA Market Share
  if (levelState['nvidia_market_share'] && Math.abs(levelState['nvidia_market_share'] - 85) > 2) {
    changes.push({
      name: 'NVIDIA AI GPU Market Share',
      level: 'Level 3 (Company)',
      current: `${levelState['nvidia_market_share'].toFixed(1)}%`,
      delta: `${(levelState['nvidia_market_share'] - 85).toFixed(1)}%`,
      affectedEntities: '[[company-nvidia]], [[product-h100]], [[product-a100]]',
      analysis: levelState['nvidia_market_share'] > 85
        ? 'NVIDIA is expanding its dominance in AI GPUs, strengthening pricing power and ecosystem lock-in via [[technology-cuda]]. Suppliers like [[company-tsmc]] benefit from increased orders.'
        : 'NVIDIA faces increased competition from [[company-amd]] and custom hyperscaler chips. May pressure margins.',
    });
  }

  // HBM3E Supply
  if (levelState['hbm3e_supply_index'] && Math.abs(levelState['hbm3e_supply_index'] - 100) > 15) {
    changes.push({
      name: 'HBM3E Memory Supply',
      level: 'Level 5 (Component)',
      current: levelState['hbm3e_supply_index'].toFixed(0),
      delta: `${(levelState['hbm3e_supply_index'] - 100).toFixed(0)} pts`,
      affectedEntities: '[[component-hbm3e]], [[company-sk-hynix]], [[company-samsung]]',
      analysis: levelState['hbm3e_supply_index'] < 80
        ? 'Critical HBM3E shortage creates bottleneck for AI GPU production. [[company-sk-hynix]] (50% market share) has significant pricing power. [[product-h100]] production constrained.'
        : 'Improving HBM3E supply eases GPU production constraints. Prices may normalize.',
    });
  }

  // Hyperscaler CapEx
  if (levelState['hyperscaler_capex'] && Math.abs(levelState['hyperscaler_capex'] - 180) > 20) {
    changes.push({
      name: 'Hyperscaler CapEx',
      level: 'Level 8 (Customer)',
      current: `$${levelState['hyperscaler_capex'].toFixed(0)}B`,
      delta: `$${(levelState['hyperscaler_capex'] - 180).toFixed(0)}B`,
      affectedEntities: '[[customer-microsoft]], [[customer-meta]], [[customer-google]], [[customer-amazon]]',
      analysis: levelState['hyperscaler_capex'] > 180
        ? 'Hyperscalers are aggressively expanding AI infrastructure. Drives strong demand for [[product-h100]], [[component-hbm3e]], and [[company-tsmc]] capacity.'
        : 'CapEx cuts signal AI investment slowdown. Negative for [[sector-semiconductor]] supply chain.',
    });
  }

  return changes;
}

/**
 * Helper functions (simplified mocks)
 */
function getUpstreamImpact(sector: string, macroState: MacroState): string {
  return `Raw material suppliers and component manufacturers will see ${macroState.us_gdp_growth > 0.025 ? 'increased' : 'decreased'} demand.`;
}

function getDownstreamImpact(sector: string, macroState: MacroState): string {
  return `End customers and distributors face ${macroState.us_cpi > 0.035 ? 'inflationary pressures' : 'stable pricing'}.`;
}

function getCrossSectorImpact(sector: string): string {
  return 'Technology, Manufacturing, and Financial sectors show high correlation.';
}

function generateDefaultInsights(macroState: MacroState, levelState?: LevelState): string {
  const insights: string[] = [];

  if (macroState.us_gdp_growth < 0) {
    insights.push('Negative GDP growth indicates recessionary conditions.');
  }

  if (macroState.vix > 25) {
    insights.push('Elevated VIX suggests heightened market uncertainty.');
  }

  if (macroState.us_10y_yield < macroState.us_2y_yield) {
    insights.push('Inverted yield curve historically precedes recessions.');
  }

  return insights.length > 0 ? insights.map((i, idx) => `${idx + 1}. ${i}`).join('\n') : '1. Scenario shows moderate economic conditions.';
}

function generateRisks(macroState: MacroState, levelState?: LevelState): string {
  const risks: string[] = [];

  if (macroState.vix > 25) risks.push('- **Market Volatility Risk:** High VIX indicates potential for sharp drawdowns.');
  if (macroState.us_unemployment > 5.0) risks.push('- **Employment Risk:** Rising unemployment may dampen consumer spending.');
  if (macroState.us_10y_yield < macroState.us_2y_yield) risks.push('- **Recession Risk:** Inverted yield curve is a historical recession indicator.');

  return risks.length > 0 ? risks.join('\n') : '- **Moderate Risk Profile:** No critical red flags detected in this scenario.';
}

function generateOpportunities(macroState: MacroState, levelState?: LevelState): string {
  const opps: string[] = [];

  if (macroState.us_gdp_growth > 0.03) opps.push('- **Growth Equities:** Strong GDP supports cyclical sectors.');
  if (macroState.vix < 15) opps.push('- **Risk Assets:** Low volatility favors equity and credit exposure.');
  if (macroState.fed_funds_rate > 0.05) opps.push('- **Banking Sector:** High rates improve net interest margins.');

  return opps.length > 0 ? opps.join('\n') : '- **Balanced Opportunities:** Mix of growth and defensive positioning recommended.';
}

function generateRecommendations(scenario: Scenario): string {
  return `
1. **Portfolio Positioning:** Adjust sector weights based on macro outlook and level dynamics.
2. **Risk Management:** Monitor key indicators like VIX, yield curve, and unemployment.
3. **Supply Chain Resilience:** Identify bottlenecks in component supply (e.g., HBM3E).
4. **Scenario Planning:** Run additional scenarios to stress-test portfolio exposure.
5. **Entity Monitoring:** Track performance of high-impact entities via knowledge graph.
  `.trim();
}

function generateEntityReferences(scenario: Scenario): string {
  const entities: string[] = [];

  if (scenario.selectedSector) entities.push(`- [[sector-${scenario.selectedSector.toLowerCase()}]]`);
  entities.push('- [[company-nvidia]]', '- [[company-tsmc]]', '- [[component-hbm3e]]');

  return entities.join('\n');
}

// Additional helper functions for sector deep dive
function getSectorCurrentState(sector: string, macroState: MacroState): string {
  return `The ${sector} sector is currently operating in a ${macroState.us_gdp_growth > 0.025 ? 'growth' : 'contraction'} environment with ${macroState.vix > 20 ? 'elevated' : 'moderate'} volatility.`;
}

function getTier1Suppliers(sector: string): string {
  return '- [[company-tsmc]] - Advanced semiconductor manufacturing\n- [[company-samsung]] - Memory and logic production\n- [[company-sk-hynix]] - HBM memory supplier';
}

function getTier2Components(sector: string): string {
  return '- [[component-hbm3e]] - High-bandwidth memory\n- [[component-cowos]] - Advanced packaging\n- Silicon wafers and substrates';
}

function getTier3Materials(sector: string): string {
  return '- [[technology-euv]] - Extreme ultraviolet lithography\n- Rare earth materials\n- Electronic-grade silicon';
}

function getDetailedSectorImpact(sector: string, scenario: Scenario): string {
  return `This scenario creates ${scenario.stats?.totalImpact || 0} impact points across the ${sector} supply chain, affecting ${scenario.stats?.affectedSectors.length || 0} interconnected sectors.`;
}

function getCompanyLevelAnalysis(sector: string, scenario: Scenario): string {
  return '### Top Companies\n\n- **[[company-nvidia]]:** Market leader with 85%+ AI GPU share\n- **[[company-amd]]:** Growing competitor with MI300X series\n- **[[company-intel]]:** Legacy player attempting comeback';
}

function getInvestmentImplications(sector: string, macroState: MacroState): string {
  return macroState.us_gdp_growth > 0.03
    ? 'Strong growth environment supports aggressive positioning in semiconductor equities.'
    : 'Defensive positioning recommended. Focus on established players with pricing power.';
}

// Risk assessment helpers
function generateRiskMatrix(scenario: Scenario): string {
  return `
| Risk Factor | Probability | Impact | Severity |
|-------------|-------------|--------|----------|
| Supply Chain Disruption | Medium | High | 🔴 Critical |
| Demand Slowdown | ${scenario.macroState.us_gdp_growth < 0.02 ? 'High' : 'Low'} | Medium | 🟡 Monitor |
| Geopolitical Tension | Medium | High | 🔴 Critical |
| Technology Disruption | Low | Medium | 🟢 Low |
  `.trim();
}

function generateCriticalVulnerabilities(scenario: Scenario): string {
  return '1. **HBM3E Bottleneck:** Limited suppliers create single point of failure\n2. **TSMC Concentration:** Over-reliance on single fab for advanced nodes\n3. **Hyperscaler Demand:** AI investment cycle could reverse quickly';
}

function generateMitigationStrategies(scenario: Scenario): string {
  return '1. **Diversify Suppliers:** Reduce concentration risk\n2. **Inventory Buffers:** Build strategic component reserves\n3. **Contract Hedging:** Lock in pricing for critical inputs';
}

// Macro outlook helpers
function analyzeMonetaryPolicy(macroState: MacroState): string {
  if (macroState.us_10y_yield < macroState.us_2y_yield) {
    return '⚠️ **Inverted yield curve** signals market expectations of Fed rate cuts ahead. Historically associated with recession within 12-18 months.';
  }
  if (macroState.fed_funds_rate > 0.055) {
    return 'Tight monetary policy aims to control inflation. Restrictive conditions pressure credit-sensitive sectors.';
  }
  return 'Neutral monetary stance supports balanced growth without excessive inflation risks.';
}

function analyzeGrowthInflation(macroState: MacroState): string {
  if (macroState.us_gdp_growth < 0) {
    return '🔴 **Recessionary conditions** with negative growth. Expect earnings pressure across cyclical sectors.';
  }
  if (macroState.us_cpi > 0.04 && macroState.us_gdp_growth > 0.03) {
    return '⚡ **Overheating economy** with strong growth and elevated inflation. Fed likely to tighten further.';
  }
  return 'Balanced growth-inflation dynamic supports stable economic expansion.';
}

function analyzeMarketSentiment(macroState: MacroState): string {
  if (macroState.vix > 30) {
    return '🔴 **Extreme fear** in markets. VIX above 30 indicates crisis-level volatility.';
  }
  if (macroState.vix < 12) {
    return '🟢 **Complacency risk**. Very low volatility may precede sharp corrections.';
  }
  return 'Moderate volatility reflects balanced risk appetite.';
}

function generateSectorImplications(macroState: MacroState): string {
  const implications: string[] = [];

  if (macroState.fed_funds_rate > 0.05) {
    implications.push('- **[[sector-banking]]:** Benefits from higher net interest margins');
  }

  if (macroState.us_gdp_growth > 0.03) {
    implications.push('- **[[sector-technology]]:** Strong growth supports capex spending');
  }

  if (macroState.vix > 25) {
    implications.push('- **[[sector-utilities]]:** Defensive characteristics attract safety flows');
  }

  return implications.join('\n') || '- Balanced sector outlook with no strong tilts';
}
