/**
 * 9-Level Ontology Formula Propagation System
 *
 * Complete implementation of formula propagation from Macro (L1) → Facility (L9)
 *
 * Structure:
 * - Level 0: Cross-cutting (Trade, Logistics, Tariffs) - affects multiple levels
 * - Level 1: Macro Variables (Fed Rate, GDP, Inflation, Oil, VIX, M2)
 * - Level 2: Sector Indicators (CapEx, Credit Spread, Vacancy Rate)
 * - Level 3: Company Metrics (Market Share, Utilization, Revenue)
 * - Level 4: Product Demand (GPU Demand, Smartphone Units, Cloud Growth)
 * - Level 5: Component Supply (HBM3E, DRAM, CoWoS, EUV)
 * - Level 6: Technology Innovation (AI Investment, Process Node, CUDA)
 * - Level 7: Ownership Dynamics (Institutional %, Insider Buying)
 * - Level 8: Customer Behavior (Hyperscaler CapEx, Enterprise AI Adoption)
 * - Level 9: Facility Operations (Fab Utilization, Data Center Buildout)
 */

import { MacroState } from '@/lib/store/macroStore';
import { Company } from '@/data/companies';
import { getSectorCoefficient } from '@/lib/config/sectorCoefficients';
import { MACRO_DEFAULTS } from '@/lib/config/macroDefaults';

// ============================================================================
// LEVEL INTERFACES
// ============================================================================

export interface Level0State {
  container_rate_us_china: number;    // Shipping cost
  semiconductor_tariff: number;        // Import tariffs
  energy_cost_index: number;           // Manufacturing energy costs
}

export interface Level1State extends MacroState {
  // Macro variables from macroStore
}

export interface Level2State {
  sector: string;
  semiconductor_capex_index?: number;
  banking_credit_spread?: number;
  realestate_vacancy_rate?: number;
  // Calculated from Level 1
  revenue_impact: number;              // % change
  margin_impact: number;               // % change
  valuation_impact: number;            // % change
}

export interface Level3State {
  company: string;
  ticker: string;
  sector: string;
  // Company-specific metrics
  market_share?: number;
  utilization_rate?: number;
  hbm_share?: number;
  // Calculated from Level 2
  revenue: number;
  margin: number;
  market_cap: number;
  revenue_change_pct: number;
}

export interface Level4State {
  product: string;
  type: 'AI_GPU' | 'SMARTPHONE' | 'CLOUD_SERVICE' | 'OTHER';
  // Product demand metrics
  demand_index: number;
  unit_demand?: number;
  growth_rate?: number;
  // Calculated from Level 3
  price: number;
  volume: number;
  revenue: number;
  demand_change_pct: number;
}

export interface Level5State {
  component: string;
  type: 'HBM3E' | 'DRAM' | 'COWOS' | 'EUV' | 'OTHER';
  // Component supply metrics
  supply_index: number;
  capacity?: number;
  price_index: number;
  // Calculated from Level 4
  required_quantity: number;
  bottleneck: boolean;
  constraint_impact: number;           // -1 to 0 (0 = no constraint)
}

export interface Level6State {
  technology: string;
  // Technology metrics
  ai_investment: number;               // Billion $
  process_node_progress: number;       // Index
  ecosystem_strength: number;          // 0-100
  // Calculated from Level 5
  rd_multiplier: number;               // How much tech investment affects products
  competitive_moat: number;            // 0-1
}

export interface Level7State {
  ticker: string;
  // Ownership metrics
  institutional_ownership_pct: number;
  insider_buying_index: number;
  // Calculated from Level 6
  allocation_priority: number;         // Higher = gets scarce resources first
  governance_quality: number;          // 0-1
}

export interface Level8State {
  customer_segment: string;
  // Customer behavior metrics
  hyperscaler_capex: number;           // Billion $
  enterprise_ai_adoption_pct: number;
  consumer_spending_index: number;
  // Calculated from Level 7
  purchase_urgency: number;            // 0-1
  order_volume_multiplier: number;     // Multiplier on base demand
}

export interface Level9State {
  facility: string;
  type: 'FAB' | 'DATACENTER';
  // Facility metrics
  utilization_pct: number;
  buildout_rate: number;               // New facilities per year
  // Calculated from Level 8
  capacity_constraint: boolean;
  margin_expansion: number;            // % change from high utilization
  capex_requirement: number;           // $ needed for expansion
}

// ============================================================================
// PROPAGATION STATE (holds all levels)
// ============================================================================

export interface PropagationState {
  level0: Level0State;
  level1: Level1State;
  level2: Map<string, Level2State>;    // Key: sector
  level3: Map<string, Level3State>;    // Key: ticker
  level4: Map<string, Level4State>;    // Key: product ID
  level5: Map<string, Level5State>;    // Key: component ID
  level6: Map<string, Level6State>;    // Key: technology ID
  level7: Map<string, Level7State>;    // Key: ticker
  level8: Map<string, Level8State>;    // Key: customer segment
  level9: Map<string, Level9State>;    // Key: facility ID
}

// ============================================================================
// LEVEL 1 → LEVEL 2: MACRO → SECTOR
// ============================================================================

export function propagateLevel1ToLevel2(
  level0: Level0State,
  level1: Level1State,
  sector: string
): Level2State {
  // Extract macro variables
  const fedRate = level1.fed_funds_rate || MACRO_DEFAULTS.fed_funds_rate;
  const gdpGrowth = level1.us_gdp_growth || MACRO_DEFAULTS.us_gdp_growth;
  const inflation = level1.us_cpi || MACRO_DEFAULTS.us_cpi;
  const oilPrice = level1.wti_oil || MACRO_DEFAULTS.wti_oil;

  // Get sector coefficients
  const gdpElasticity = getSectorCoefficient(sector, 'gdp_elasticity')?.value ?? 1.0;
  const rateSensitivity = getSectorCoefficient(sector, 'rate_sensitivity')?.value ?? 0.0;
  const pricingPower = getSectorCoefficient(sector, 'pricing_power')?.value ?? 0.5;
  const commoditySensitivity = getSectorCoefficient(sector, 'commodity_sensitivity')?.value ?? 0.5;

  // Revenue impact
  const gdpImpact = (gdpGrowth - MACRO_DEFAULTS.us_gdp_growth) * gdpElasticity;
  const tariffImpact = -level0.semiconductor_tariff * 0.01 * (sector === 'SEMICONDUCTOR' ? 1.2 : 0.3);
  const revenue_impact = (gdpImpact + tariffImpact) * 100; // % change

  // Margin impact
  const rateImpact = (fedRate - MACRO_DEFAULTS.fed_funds_rate) * rateSensitivity;
  const inflationPressure = (inflation - MACRO_DEFAULTS.us_cpi) * (1 - pricingPower);
  const oilImpact = ((oilPrice - MACRO_DEFAULTS.wti_oil) / MACRO_DEFAULTS.wti_oil) * commoditySensitivity;
  const energyImpact = ((level0.energy_cost_index - 100) / 100) * 0.15; // 15% sensitivity to energy
  const margin_impact = (rateImpact - inflationPressure - oilImpact - energyImpact) * 100; // % change

  // Valuation impact (multiple expansion/contraction)
  const rateChange = fedRate - MACRO_DEFAULTS.fed_funds_rate;
  const vixChange = (level1.vix - MACRO_DEFAULTS.vix) / MACRO_DEFAULTS.vix;
  const m2Growth = (level1.us_m2_money_supply - MACRO_DEFAULTS.us_m2_money_supply) / MACRO_DEFAULTS.us_m2_money_supply;
  const valuation_impact = (-rateChange * 500) + (-vixChange * 300) + (m2Growth * 200); // basis points

  return {
    sector,
    revenue_impact,
    margin_impact,
    valuation_impact,
  };
}

// ============================================================================
// LEVEL 2 → LEVEL 3: SECTOR → COMPANY
// ============================================================================

export function propagateLevel2ToLevel3(
  level2: Level2State,
  company: Company
): Level3State {
  // Company inherits sector impacts, but may have different sensitivities
  const companyBeta = company.ratios?.beta || 1.0; // Company-specific beta

  // Revenue: Company revenue changes based on sector revenue + market share dynamics
  const baseRevenue = company.financials.revenue;
  const marketShareBonus = 0; // TODO: Add market share dynamics
  const revenueChangeMultiplier = 1 + (level2.revenue_impact / 100);
  const newRevenue = baseRevenue * revenueChangeMultiplier * (1 + marketShareBonus);

  // Margin: Company margin affected by sector margin + company-specific factors
  const baseMargin = company.financials.ebitda / company.financials.revenue;
  const marginChangeMultiplier = 1 + (level2.margin_impact / 100);
  const newMargin = baseMargin * marginChangeMultiplier;

  // Market cap: Affected by valuation impact + company-specific momentum
  const baseMarketCap = company.financials.market_cap;
  const valuationChangeMultiplier = 1 + (level2.valuation_impact / 10000); // bps to decimal
  const betaAdjustment = companyBeta; // High beta = higher volatility
  const newMarketCap = baseMarketCap * valuationChangeMultiplier * betaAdjustment;

  return {
    company: company.name,
    ticker: company.ticker,
    sector: company.sector,
    revenue: newRevenue,
    margin: newMargin,
    market_cap: newMarketCap,
    revenue_change_pct: ((newRevenue - baseRevenue) / baseRevenue) * 100,
  };
}

// ============================================================================
// LEVEL 3 → LEVEL 4: COMPANY → PRODUCT
// ============================================================================

export function propagateLevel3ToLevel4(
  level3: Level3State,
  productId: string,
  productType: Level4State['type'],
  baseProductState: Partial<Level4State>
): Level4State {
  // Product demand is affected by company revenue changes
  // Higher revenue usually means higher product sales

  const demandElasticity = productType === 'AI_GPU' ? 1.2 : // Elastic demand
                           productType === 'SMARTPHONE' ? 0.8 : // Inelastic
                           1.0;

  const companyRevenueGrowth = level3.revenue_change_pct / 100;
  const demandGrowth = companyRevenueGrowth * demandElasticity;

  const baseDemandIndex = baseProductState.demand_index || 100;
  const newDemandIndex = baseDemandIndex * (1 + demandGrowth);

  // Price: If demand increases and supply is constrained, price increases
  const priceElasticity = 0.3; // 30% of demand change affects price
  const basePrice = 10000; // Example: H100 ~$30k, but we'll use index
  const newPrice = basePrice * (1 + demandGrowth * priceElasticity);

  // Volume: Remaining demand change affects volume
  const volumeChange = demandGrowth * (1 - priceElasticity);
  const baseVolume = 1000; // Example units
  const newVolume = baseVolume * (1 + volumeChange);

  return {
    product: productId,
    type: productType,
    demand_index: newDemandIndex,
    price: newPrice,
    volume: newVolume,
    revenue: newPrice * newVolume,
    demand_change_pct: demandGrowth * 100,
  };
}

// ============================================================================
// LEVEL 4 → LEVEL 5: PRODUCT → COMPONENT
// ============================================================================

export function propagateLevel4ToLevel5(
  level4: Level4State,
  componentId: string,
  componentType: Level5State['type'],
  baseComponentState: Partial<Level5State>
): Level5State {
  // Component demand driven by product demand
  // Example: H100 needs 6x HBM3E modules per GPU

  const componentsPerProduct = componentType === 'HBM3E' ? 6 :
                                componentType === 'DRAM' ? 8 :
                                componentType === 'COWOS' ? 1 :
                                componentType === 'EUV' ? 0.001 : // 1 EUV machine per 1000 wafers
                                1;

  const requiredQuantity = level4.volume * componentsPerProduct;

  const baseSupplyIndex = baseComponentState.supply_index || 100;
  const baseCapacity = baseComponentState.capacity || 10000;

  // Bottleneck detection: If demand > 80% of capacity
  const utilizationRate = requiredQuantity / baseCapacity;
  const bottleneck = utilizationRate > 0.8;

  // Constraint impact: How much production is reduced due to bottleneck
  let constraint_impact = 0;
  if (utilizationRate > 1.0) {
    constraint_impact = -(utilizationRate - 1.0) * 0.5; // -50% production if 2x over capacity
  } else if (utilizationRate > 0.8) {
    constraint_impact = -(utilizationRate - 0.8) * 0.2; // -4% max if just hitting limit
  }

  // Price impact: Supply shortage → price increase
  const basePriceIndex = baseComponentState.price_index || 100;
  const supplyShortage = Math.max(0, utilizationRate - 0.8);
  const newPriceIndex = basePriceIndex * (1 + supplyShortage * 0.5); // 50% price increase if 100% over

  return {
    component: componentId,
    type: componentType,
    supply_index: baseSupplyIndex,
    capacity: baseCapacity,
    price_index: newPriceIndex,
    required_quantity: requiredQuantity,
    bottleneck,
    constraint_impact,
  };
}

// ============================================================================
// LEVEL 5 → LEVEL 6: COMPONENT → TECHNOLOGY
// ============================================================================

export function propagateLevel5ToLevel6(
  level5States: Level5State[],
  technologyId: string,
  baseTechState: Partial<Level6State>
): Level6State {
  // Technology advancement affected by component bottlenecks
  // If HBM3E is constrained, it drives more R&D investment

  const totalBottlenecks = level5States.filter(c => c.bottleneck).length;
  const avgConstraintImpact = level5States.reduce((sum, c) => sum + Math.abs(c.constraint_impact), 0) / level5States.length;

  // More bottlenecks → More R&D investment to solve them
  const rdInvestmentBonus = totalBottlenecks * 10; // +$10B per bottleneck
  const baseAiInvestment = baseTechState.ai_investment || 150;
  const newAiInvestment = baseAiInvestment + rdInvestmentBonus;

  // R&D multiplier: How much tech investment translates to product improvement
  const rd_multiplier = 1 + (newAiInvestment - baseAiInvestment) / baseAiInvestment * 0.3;

  // Competitive moat: Strong technology (high ecosystem strength) + high investment = moat
  const ecosystemStrength = baseTechState.ecosystem_strength || 80;
  const competitive_moat = Math.min(1.0, (ecosystemStrength / 100) * rd_multiplier);

  return {
    technology: technologyId,
    ai_investment: newAiInvestment,
    process_node_progress: baseTechState.process_node_progress || 100,
    ecosystem_strength: ecosystemStrength,
    rd_multiplier,
    competitive_moat,
  };
}

// ============================================================================
// LEVEL 6 → LEVEL 7: TECHNOLOGY → OWNERSHIP
// ============================================================================

export function propagateLevel6ToLevel7(
  level6: Level6State,
  ticker: string,
  baseOwnershipState: Partial<Level7State>
): Level7State {
  // Strong technology moat attracts institutional investors
  // High R&D spending signals future growth → insider buying

  const baseInstitutionalPct = baseOwnershipState.institutional_ownership_pct || 65;
  const baseInsiderIndex = baseOwnershipState.insider_buying_index || 100;

  // Competitive moat → Institutional interest
  const moatBonus = (level6.competitive_moat - 0.5) * 20; // ±10% swing
  const newInstitutionalPct = Math.max(40, Math.min(85, baseInstitutionalPct + moatBonus));

  // R&D multiplier → Insider confidence
  const rdBonus = (level6.rd_multiplier - 1.0) * 50; // Up to +50 on index
  const newInsiderIndex = baseInsiderIndex + rdBonus;

  // Allocation priority: Institutional ownership + insider buying = priority for scarce resources
  const allocation_priority = (newInstitutionalPct / 100) * 0.6 + (newInsiderIndex / 200) * 0.4;

  // Governance quality: Institutional investors demand good governance
  const governance_quality = newInstitutionalPct / 100;

  return {
    ticker,
    institutional_ownership_pct: newInstitutionalPct,
    insider_buying_index: newInsiderIndex,
    allocation_priority,
    governance_quality,
  };
}

// ============================================================================
// LEVEL 7 → LEVEL 8: OWNERSHIP → CUSTOMER
// ============================================================================

export function propagateLevel7ToLevel8(
  level7: Level7State,
  customerSegment: string,
  baseCustomerState: Partial<Level8State>
): Level8State {
  // High institutional ownership signals quality → Customers more willing to pay premium
  // High allocation priority → Gets preferential treatment during supply shortages

  const baseHyperscalerCapex = baseCustomerState.hyperscaler_capex || 180;
  const baseEnterpriseAdoption = baseCustomerState.enterprise_ai_adoption_pct || 45;
  const baseConsumerSpending = baseCustomerState.consumer_spending_index || 100;

  // Allocation priority affects purchase urgency
  // If company has high priority, customers rush to secure supply
  const urgencyBonus = level7.allocation_priority * 0.5; // Up to +0.5
  const purchase_urgency = Math.min(1.0, 0.5 + urgencyBonus);

  // Governance quality signals long-term stability → Customer confidence
  const confidenceBonus = level7.governance_quality * 0.3;
  const order_volume_multiplier = 1.0 + confidenceBonus;

  // For hyperscaler segment, high urgency → More CapEx
  let newHyperscalerCapex = baseHyperscalerCapex;
  if (customerSegment === 'HYPERSCALER') {
    newHyperscalerCapex = baseHyperscalerCapex * order_volume_multiplier;
  }

  return {
    customer_segment: customerSegment,
    hyperscaler_capex: newHyperscalerCapex,
    enterprise_ai_adoption_pct: baseEnterpriseAdoption,
    consumer_spending_index: baseConsumerSpending,
    purchase_urgency,
    order_volume_multiplier,
  };
}

// ============================================================================
// LEVEL 8 → LEVEL 9: CUSTOMER → FACILITY
// ============================================================================

export function propagateLevel8ToLevel9(
  level8: Level8State,
  facilityId: string,
  facilityType: Level9State['type'],
  baseFacilityState: Partial<Level9State>
): Level9State {
  // Customer demand (hyperscaler CapEx, enterprise adoption) → Facility utilization
  // High utilization → Margin expansion, but also signals need for more capacity

  const baseUtilization = baseFacilityState.utilization_pct || 85;
  const baseBuildoutRate = baseFacilityState.buildout_rate || 50;

  // Order volume multiplier affects utilization
  const demandMultiplier = level8.order_volume_multiplier;
  const newUtilization = Math.min(100, baseUtilization * demandMultiplier);

  // Capacity constraint: If utilization > 95%, we're constrained
  const capacity_constraint = newUtilization > 95;

  // Margin expansion: High utilization → Better margins (operating leverage)
  let margin_expansion = 0;
  if (newUtilization > 90) {
    margin_expansion = (newUtilization - 90) * 0.5; // +5% margin at 100% utilization
  }

  // CapEx requirement: If constrained, need to build more capacity
  let capex_requirement = 0;
  if (capacity_constraint) {
    // Estimate: $10B per new fab, $5B per datacenter
    const costPerFacility = facilityType === 'FAB' ? 10 : 5;
    const utilizationOverflow = (newUtilization - 95) / 100;
    const facilitiesNeeded = Math.ceil(utilizationOverflow * 2); // 2 facilities if 100% over
    capex_requirement = facilitiesNeeded * costPerFacility;
  }

  // Buildout rate increases if capacity constraint exists
  const newBuildoutRate = capacity_constraint ? baseBuildoutRate * 1.5 : baseBuildoutRate;

  return {
    facility: facilityId,
    type: facilityType,
    utilization_pct: newUtilization,
    buildout_rate: newBuildoutRate,
    capacity_constraint,
    margin_expansion,
    capex_requirement,
  };
}

// ============================================================================
// FULL 9-LEVEL PROPAGATION
// ============================================================================

export function propagateAllLevels(
  level0: Level0State,
  level1: Level1State,
  companies: Company[]
): PropagationState {
  const state: PropagationState = {
    level0,
    level1,
    level2: new Map(),
    level3: new Map(),
    level4: new Map(),
    level5: new Map(),
    level6: new Map(),
    level7: new Map(),
    level8: new Map(),
    level9: new Map(),
  };

  // Level 1 → Level 2: For each sector
  const sectors = ['SEMICONDUCTOR', 'BANKING', 'REALESTATE', 'TECHNOLOGY', 'ENERGY', 'HEALTHCARE'];
  for (const sector of sectors) {
    const level2 = propagateLevel1ToLevel2(level0, level1, sector);
    state.level2.set(sector, level2);
  }

  // Level 2 → Level 3: For each company
  for (const company of companies) {
    const level2 = state.level2.get(company.sector);
    if (!level2) continue;

    const level3 = propagateLevel2ToLevel3(level2, company);
    state.level3.set(company.ticker, level3);
  }

  // Level 3 → Level 4: Example products for key companies
  const level3NVDA = state.level3.get('NVDA');
  if (level3NVDA) {
    const level4H100 = propagateLevel3ToLevel4(level3NVDA, 'H100', 'AI_GPU', { demand_index: 85 });
    state.level4.set('H100', level4H100);

    // Level 4 → Level 5: Components for H100
    const level5HBM = propagateLevel4ToLevel5(level4H100, 'HBM3E', 'HBM3E', { supply_index: 100, capacity: 15000, price_index: 100 });
    const level5CoWoS = propagateLevel4ToLevel5(level4H100, 'CoWoS', 'COWOS', { supply_index: 100, capacity: 15000, price_index: 100 });
    state.level5.set('HBM3E', level5HBM);
    state.level5.set('CoWoS', level5CoWoS);

    // Level 5 → Level 6: Technology advancement
    const level6AI = propagateLevel5ToLevel6([level5HBM, level5CoWoS], 'AI_TECH', {
      ai_investment: 150,
      process_node_progress: 100,
      ecosystem_strength: 90
    });
    state.level6.set('AI_TECH', level6AI);

    // Level 6 → Level 7: NVIDIA ownership
    const level7NVDA = propagateLevel6ToLevel7(level6AI, 'NVDA', {
      institutional_ownership_pct: 65,
      insider_buying_index: 100
    });
    state.level7.set('NVDA', level7NVDA);

    // Level 7 → Level 8: Hyperscaler customers
    const level8Hyperscaler = propagateLevel7ToLevel8(level7NVDA, 'HYPERSCALER', {
      hyperscaler_capex: 180,
      enterprise_ai_adoption_pct: 45,
      consumer_spending_index: 100
    });
    state.level8.set('HYPERSCALER', level8Hyperscaler);

    // Level 8 → Level 9: TSMC fabs
    const level9TSMCFab = propagateLevel8ToLevel9(level8Hyperscaler, 'TSMC_FAB18', 'FAB', {
      utilization_pct: 95,
      buildout_rate: 50
    });
    state.level9.set('TSMC_FAB18', level9TSMCFab);
  }

  return state;
}

// ============================================================================
// EXAMPLE ANALYSIS: Fed Rate +50bps Impact on All 9 Levels
// ============================================================================

export function analyzeFedRateImpact(companies: Company[]): {
  baseline: PropagationState;
  shock: PropagationState;
  analysis: string;
} {
  // Baseline scenario
  const baseLevel0: Level0State = {
    container_rate_us_china: 3500,
    semiconductor_tariff: 0,
    energy_cost_index: 100,
  };

  const baseLevel1: Level1State = {
    fed_funds_rate: MACRO_DEFAULTS.fed_funds_rate,
    us_gdp_growth: MACRO_DEFAULTS.us_gdp_growth,
    us_cpi: MACRO_DEFAULTS.us_cpi,
    wti_oil: MACRO_DEFAULTS.wti_oil,
    vix: MACRO_DEFAULTS.vix,
    usd_index: MACRO_DEFAULTS.usd_index,
    us_unemployment: MACRO_DEFAULTS.us_unemployment,
    us_m2_money_supply: MACRO_DEFAULTS.us_m2_money_supply,
  };

  const baseline = propagateAllLevels(baseLevel0, baseLevel1, companies);

  // Shock scenario: Fed rate +50bps
  const shockLevel1: Level1State = {
    ...baseLevel1,
    fed_funds_rate: baseLevel1.fed_funds_rate + 0.005, // +50 bps
  };

  const shock = propagateAllLevels(baseLevel0, shockLevel1, companies);

  // Analysis
  const analysis = generateImpactAnalysis(baseline, shock);

  return { baseline, shock, analysis };
}

function generateImpactAnalysis(baseline: PropagationState, shock: PropagationState): string {
  const lines: string[] = [];

  lines.push('# 9-LEVEL PROPAGATION ANALYSIS: Fed Rate +50bps\n');

  // Level 1
  lines.push('## Level 1: Macro Change');
  lines.push(`Fed Funds Rate: ${(baseline.level1.fed_funds_rate * 100).toFixed(2)}% → ${(shock.level1.fed_funds_rate * 100).toFixed(2)}%`);
  lines.push(`Change: +${((shock.level1.fed_funds_rate - baseline.level1.fed_funds_rate) * 100).toFixed(0)}bps\n`);

  // Level 2
  lines.push('## Level 2: Sector Impact');
  for (const [sector, baseState] of baseline.level2) {
    const shockState = shock.level2.get(sector);
    if (!shockState) continue;

    const revenueChange = shockState.revenue_impact - baseState.revenue_impact;
    const marginChange = shockState.margin_impact - baseState.margin_impact;

    lines.push(`**${sector}:**`);
    lines.push(`  Revenue Impact: ${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(2)}%`);
    lines.push(`  Margin Impact: ${marginChange >= 0 ? '+' : ''}${marginChange.toFixed(2)}%`);
  }
  lines.push('');

  // Level 3
  lines.push('## Level 3: Company Impact (NVIDIA Example)');
  const baseNVDA = baseline.level3.get('NVDA');
  const shockNVDA = shock.level3.get('NVDA');
  if (baseNVDA && shockNVDA) {
    const revenueChange = ((shockNVDA.revenue - baseNVDA.revenue) / baseNVDA.revenue) * 100;
    const marketCapChange = ((shockNVDA.market_cap - baseNVDA.market_cap) / baseNVDA.market_cap) * 100;

    lines.push(`Revenue: $${(baseNVDA.revenue / 1000).toFixed(1)}B → $${(shockNVDA.revenue / 1000).toFixed(1)}B (${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(2)}%)`);
    lines.push(`Market Cap: $${(baseNVDA.market_cap / 1000).toFixed(0)}B → $${(shockNVDA.market_cap / 1000).toFixed(0)}B (${marketCapChange >= 0 ? '+' : ''}${marketCapChange.toFixed(2)}%)\n`);
  }

  // Level 4
  lines.push('## Level 4: Product Demand (H100 GPU)');
  const baseH100 = baseline.level4.get('H100');
  const shockH100 = shock.level4.get('H100');
  if (baseH100 && shockH100) {
    const demandChange = shockH100.demand_change_pct - baseH100.demand_change_pct;
    lines.push(`Demand Index: ${baseH100.demand_index.toFixed(0)} → ${shockH100.demand_index.toFixed(0)}`);
    lines.push(`Demand Change: ${demandChange >= 0 ? '+' : ''}${demandChange.toFixed(2)}%\n`);
  }

  // Level 5
  lines.push('## Level 5: Component Supply (HBM3E)');
  const baseHBM = baseline.level5.get('HBM3E');
  const shockHBM = shock.level5.get('HBM3E');
  if (baseHBM && shockHBM) {
    lines.push(`Bottleneck: ${baseHBM.bottleneck ? 'YES' : 'NO'} → ${shockHBM.bottleneck ? 'YES' : 'NO'}`);
    lines.push(`Constraint Impact: ${(baseHBM.constraint_impact * 100).toFixed(1)}% → ${(shockHBM.constraint_impact * 100).toFixed(1)}%\n`);
  }

  // Level 6
  lines.push('## Level 6: Technology Investment');
  const baseAI = baseline.level6.get('AI_TECH');
  const shockAI = shock.level6.get('AI_TECH');
  if (baseAI && shockAI) {
    lines.push(`AI Investment: $${baseAI.ai_investment}B → $${shockAI.ai_investment}B`);
    lines.push(`R&D Multiplier: ${baseAI.rd_multiplier.toFixed(2)}x → ${shockAI.rd_multiplier.toFixed(2)}x\n`);
  }

  // Level 7
  lines.push('## Level 7: Ownership Dynamics (NVIDIA)');
  const baseOwnership = baseline.level7.get('NVDA');
  const shockOwnership = shock.level7.get('NVDA');
  if (baseOwnership && shockOwnership) {
    lines.push(`Institutional Ownership: ${baseOwnership.institutional_ownership_pct.toFixed(1)}% → ${shockOwnership.institutional_ownership_pct.toFixed(1)}%`);
    lines.push(`Allocation Priority: ${baseOwnership.allocation_priority.toFixed(2)} → ${shockOwnership.allocation_priority.toFixed(2)}\n`);
  }

  // Level 8
  lines.push('## Level 8: Customer Behavior (Hyperscalers)');
  const baseCustomer = baseline.level8.get('HYPERSCALER');
  const shockCustomer = shock.level8.get('HYPERSCALER');
  if (baseCustomer && shockCustomer) {
    lines.push(`Hyperscaler CapEx: $${baseCustomer.hyperscaler_capex}B → $${shockCustomer.hyperscaler_capex.toFixed(1)}B`);
    lines.push(`Purchase Urgency: ${(baseCustomer.purchase_urgency * 100).toFixed(0)}% → ${(shockCustomer.purchase_urgency * 100).toFixed(0)}%\n`);
  }

  // Level 9
  lines.push('## Level 9: Facility Operations (TSMC Fab 18)');
  const baseFacility = baseline.level9.get('TSMC_FAB18');
  const shockFacility = shock.level9.get('TSMC_FAB18');
  if (baseFacility && shockFacility) {
    lines.push(`Utilization: ${baseFacility.utilization_pct.toFixed(1)}% → ${shockFacility.utilization_pct.toFixed(1)}%`);
    lines.push(`Capacity Constraint: ${baseFacility.capacity_constraint ? 'YES' : 'NO'} → ${shockFacility.capacity_constraint ? 'YES' : 'NO'}`);
    lines.push(`Margin Expansion: ${baseFacility.margin_expansion.toFixed(2)}% → ${shockFacility.margin_expansion.toFixed(2)}%`);
    lines.push(`CapEx Requirement: $${baseFacility.capex_requirement}B → $${shockFacility.capex_requirement}B`);
  }

  return lines.join('\n');
}
