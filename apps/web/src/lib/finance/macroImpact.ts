/**
 * Advanced Macro Impact on Company Financials
 * Uses financial theory to model how macro variables affect company metrics
 *
 * NOW USES: sectorCoefficients.ts for all calibrated parameters
 */

import { Company } from '@/data/companies';
import { MacroState } from '@/lib/store/macroStore';
import { calculateCostOfEquity, calculateSectorBeta } from './capm';
import { calculateDCF, calculateFreeCashFlow, DCFParams } from './dcf';
import { getSectorCoefficient, SECTOR_COEFFICIENTS } from '@/lib/config/sectorCoefficients';
import { MACRO_DEFAULTS } from '@/lib/config/macroDefaults';

export interface MacroImpactFactors {
  // Revenue factors
  demandImpact: number;          // GDP, consumer confidence
  priceImpact: number;           // Inflation, pricing power
  volumeImpact: number;          // Market share, capacity utilization

  // Cost factors
  cogsPressure: number;          // Commodity prices, input costs
  laborCostImpact: number;       // Unemployment, wage inflation
  financingCostImpact: number;   // Interest rates

  // Investment factors
  capexImpact: number;           // Interest rates, growth expectations
  rdInvestment: number;          // Tech sector specific

  // Valuation factors
  discountRateImpact: number;    // Risk-free rate, risk premium
  multipleExpansion: number;     // Market sentiment, liquidity
}

/**
 * Get coefficient from config file, with fallback
 */
function getCoefficient(sector: string, type: string, fallback: number): number {
  const coef = getSectorCoefficient(sector, type);
  return coef?.value ?? fallback;
}

/**
 * Calculate how macro environment affects a company
 * ✅ NOW USES sectorCoefficients.ts instead of hardcoded values
 */
export function calculateMacroImpactFactors(
  company: Company,
  macroState: MacroState
): MacroImpactFactors {
  const sector = company.sector;

  // Extract key macro variables (with defaults from MACRO_DEFAULTS)
  const fedRate = macroState['fed_funds_rate'] || MACRO_DEFAULTS.fed_funds_rate;
  const gdpGrowth = macroState['us_gdp_growth'] || MACRO_DEFAULTS.us_gdp_growth;
  const inflation = macroState['us_cpi'] || MACRO_DEFAULTS.us_cpi;
  const oilPrice = macroState['wti_oil'] || MACRO_DEFAULTS.wti_oil;
  const vix = macroState['vix'] || MACRO_DEFAULTS.vix;
  const usdIndex = macroState['usd_index'] || MACRO_DEFAULTS.usd_index;
  const unemployment = macroState['us_unemployment'] || MACRO_DEFAULTS.us_unemployment;
  const m2Growth = macroState['us_m2_money_supply'] || MACRO_DEFAULTS.us_m2_money_supply;

  // ✅ DEMAND IMPACT - Now uses sectorCoefficients.ts
  const gdpElasticity = getCoefficient(sector, 'gdp_elasticity', 1.0);
  const demandImpact = (gdpGrowth - MACRO_DEFAULTS.us_gdp_growth) * gdpElasticity * 100;

  // ✅ PRICE IMPACT - Now uses sectorCoefficients.ts
  const pricingPower = getCoefficient(sector, 'pricing_power', 0.5);
  const priceImpact = (inflation - MACRO_DEFAULTS.us_cpi) * pricingPower * 100;

  // VOLUME IMPACT (Market dynamics)
  const volumeImpact = demandImpact * 0.6; // Volume typically 60% of demand change

  // ✅ COGS PRESSURE - Now uses sectorCoefficients.ts
  const commoditySensitivity = getCoefficient(sector, 'commodity_sensitivity', 0.5);
  const oilImpact = ((oilPrice - MACRO_DEFAULTS.wti_oil) / MACRO_DEFAULTS.wti_oil) * commoditySensitivity * 100;
  const cogsPressure = oilImpact + (inflation - MACRO_DEFAULTS.us_cpi) * 50;

  // LABOR COST IMPACT
  const laborIntensity = getCoefficient(sector, 'labor_intensity', 0.5);
  const wageInflation = Math.max(0, 5 - unemployment); // Tight labor → wage pressure
  const laborCostImpact = wageInflation * laborIntensity;

  // ✅ FINANCING COST IMPACT - Now uses sectorCoefficients.ts
  const rateSensitivity = getCoefficient(sector, 'rate_sensitivity', 0.0);
  const rateChange = fedRate - MACRO_DEFAULTS.fed_funds_rate;
  const financingCostImpact = rateChange * Math.abs(rateSensitivity) * 100;

  // CAPEX IMPACT (higher rates → lower capex)
  const capexSensitivity = getCoefficient(sector, 'capex_sensitivity', 0.5);
  const capexImpact = -rateChange * capexSensitivity * 100;

  // R&D INVESTMENT (Tech-specific)
  const aiDemandGrowth = getCoefficient(sector, 'ai_demand_growth', 0.0);
  const rdInvestment = (sector === 'SEMICONDUCTOR' || sector === 'TECHNOLOGY')
    ? gdpGrowth * aiDemandGrowth * 100
    : 0;

  // DISCOUNT RATE IMPACT (CAPM-based)
  const discountRateImpact = rateChange * 100; // 1% rate → 1% discount rate

  // MULTIPLE EXPANSION/CONTRACTION
  // Lower rates + lower VIX → multiple expansion
  const vixChange = (vix - MACRO_DEFAULTS.vix) / MACRO_DEFAULTS.vix;
  const liquidityChange = (m2Growth - MACRO_DEFAULTS.us_m2_money_supply) / MACRO_DEFAULTS.us_m2_money_supply;
  const multipleExpansion = (-rateChange * 5) + (-vixChange * 3) + (liquidityChange * 2);

  return {
    demandImpact,
    priceImpact,
    volumeImpact,
    cogsPressure,
    laborCostImpact,
    financingCostImpact,
    capexImpact,
    rdInvestment,
    discountRateImpact,
    multipleExpansion,
  };
}

/**
 * Apply macro impacts to company financials
 * ✅ Formula now uses sectorCoefficients.ts
 */
export function applyMacroImpacts(
  company: Company,
  macroState: MacroState
): Company {
  const impacts = calculateMacroImpactFactors(company, macroState);

  // Revenue impact
  const revenueMultiplier = 1 + (impacts.demandImpact + impacts.priceImpact + impacts.volumeImpact) / 100;
  const newRevenue = company.financials.revenue * revenueMultiplier;

  // COGS impact
  const cogsMultiplier = 1 + (impacts.cogsPressure + impacts.laborCostImpact) / 100;
  const currentCogs = company.financials.revenue * 0.65; // Assume 65% COGS
  const newCogs = currentCogs * cogsMultiplier;

  // Operating expenses (includes labor)
  const opexMultiplier = 1 + impacts.laborCostImpact / 100;
  const currentOpex = company.financials.revenue * 0.20; // Assume 20% OpEx
  const newOpex = currentOpex * opexMultiplier;

  // Interest expense (debt × rate)
  const fedRate = macroState['fed_funds_rate'] || MACRO_DEFAULTS.fed_funds_rate;
  const debtCost = fedRate + 0.02; // Corp spread ~200bps
  const newInterestExpense = company.financials.total_debt * debtCost;

  // Net Income calculation
  const ebitda = newRevenue - newCogs - newOpex;
  const ebit = ebitda - (company.financials.revenue * 0.05); // 5% depreciation
  const ebt = ebit - newInterestExpense;
  const newNetIncome = ebt * (1 - 0.21); // 21% tax rate

  // Market cap impact (P/E adjustment)
  const multipleChange = impacts.multipleExpansion;
  const newMarketCap = company.financials.market_cap * (1 + multipleChange / 100);

  // Updated company
  return {
    ...company,
    financials: {
      ...company.financials,
      revenue: newRevenue,
      net_income: newNetIncome,
      ebitda: ebitda,
      market_cap: newMarketCap,
    },
    ratios: {
      ...company.ratios,
      icr: ebit / Math.max(newInterestExpense, 1), // Avoid division by zero
      de_ratio: company.financials.total_debt / company.financials.equity,
      roe: newNetIncome / company.financials.equity,
    },
  };
}

/**
 * Calculate sector-level aggregate impact
 * ✅ Uses sectorCoefficients.ts for all calculations
 */
export function calculateSectorImpact(
  sector: string,
  macroState: MacroState
): {
  revenueChange: number;
  marginChange: number;
  valuationChange: number;
} {
  const fedRate = macroState['fed_funds_rate'] || MACRO_DEFAULTS.fed_funds_rate;
  const gdpGrowth = macroState['us_gdp_growth'] || MACRO_DEFAULTS.us_gdp_growth;
  const inflation = macroState['us_cpi'] || MACRO_DEFAULTS.us_cpi;

  // ✅ Get coefficients from config
  const gdpElasticity = getCoefficient(sector, 'gdp_elasticity', 1.0);
  const rateSensitivity = getCoefficient(sector, 'rate_sensitivity', 0.0);
  const pricingPower = getCoefficient(sector, 'pricing_power', 0.5);

  // Revenue change
  const revenueChange = (gdpGrowth - MACRO_DEFAULTS.us_gdp_growth) * gdpElasticity * 100;

  // Margin change (rate + cost pressure)
  const rateChange = fedRate - MACRO_DEFAULTS.fed_funds_rate;
  const inflationPressure = (inflation - MACRO_DEFAULTS.us_cpi) * (1 - pricingPower);
  const marginChange = (rateChange * rateSensitivity) - (inflationPressure * 100);

  // Valuation change (multiple impact)
  const valuationChange = -rateChange * 5; // 1% rate → -5% valuation

  return {
    revenueChange,
    marginChange,
    valuationChange,
  };
}

/**
 * Get human-readable impact summary
 */
export function getMacroImpactSummary(
  company: Company,
  macroState: MacroState
): string {
  const impacts = calculateMacroImpactFactors(company, macroState);

  const netRevenueImpact = impacts.demandImpact + impacts.priceImpact;
  const netMarginImpact = -impacts.cogsPressure - impacts.laborCostImpact + impacts.priceImpact;

  return `Revenue ${netRevenueImpact >= 0 ? '+' : ''}${netRevenueImpact.toFixed(1)}%, Margin ${netMarginImpact >= 0 ? '+' : ''}${netMarginImpact.toFixed(1)}%`;
}

/**
 * Calculate adjusted financials with all advanced metrics
 * Returns detailed financial metrics including CAPM cost of equity and DCF fair value
 */
export interface AdvancedFinancialMetrics {
  revenue: number;
  operatingIncome: number;
  netIncome: number;
  ebitda: number;
  fcf: number;
  costOfEquity: number;
  fairValue: number;
}

export function calculateAdjustedFinancials(
  company: Company,
  macroState: MacroState,
  sectorImpact: number
): AdvancedFinancialMetrics {
  const impacts = calculateMacroImpactFactors(company, macroState);

  // Revenue impact
  const revenueMultiplier = 1 + (impacts.demandImpact + impacts.priceImpact + impacts.volumeImpact) / 100;
  const revenue = company.financials.revenue * revenueMultiplier;

  // COGS and OpEx
  const cogsMultiplier = 1 + (impacts.cogsPressure + impacts.laborCostImpact) / 100;
  const cogs = revenue * 0.65 * cogsMultiplier; // 65% base COGS

  const opexMultiplier = 1 + impacts.laborCostImpact / 100;
  const opex = revenue * 0.20 * opexMultiplier; // 20% base OpEx

  // EBITDA and Operating Income
  const ebitda = revenue - cogs - opex;
  const depreciation = revenue * 0.05; // 5% depreciation
  const operatingIncome = ebitda - depreciation;

  // Interest expense
  const fedRate = macroState['fed_funds_rate'] || MACRO_DEFAULTS.fed_funds_rate;
  const debtCost = fedRate + 0.02; // 200bps corporate spread
  const interestExpense = company.financials.total_debt * debtCost;

  // Net Income
  const ebt = operatingIncome - interestExpense;
  const netIncome = ebt * (1 - 0.21); // 21% tax rate

  // Free Cash Flow
  const capex = revenue * 0.08; // 8% of revenue
  const fcf = calculateFreeCashFlow({
    operatingCashFlow: ebitda * 0.85, // 85% cash conversion
    capitalExpenditures: capex,
    workingCapitalChange: revenue * 0.02 // 2% working capital
  });

  // Cost of Equity (CAPM)
  const riskFreeRate = fedRate;
  const marketReturn = 0.10; // 10% historical market return
  const beta = calculateSectorBeta(company.sector);
  const costOfEquity = calculateCostOfEquity(riskFreeRate, beta, marketReturn);

  // DCF Fair Value
  const dcfParams: DCFParams = {
    initialFCF: fcf,
    growthRate: (macroState['us_gdp_growth'] || MACRO_DEFAULTS.us_gdp_growth) / 100,
    discountRate: costOfEquity,
    terminalGrowthRate: 0.025, // 2.5% terminal growth
    projectionYears: 5
  };
  const fairValue = calculateDCF(dcfParams);

  return {
    revenue,
    operatingIncome,
    netIncome,
    ebitda,
    fcf,
    costOfEquity,
    fairValue
  };
}

/**
 * Calculate implied valuation metrics
 */
export interface ValuationMetrics {
  impliedMarketCap: number;
  evToEbitda: number;
  peRatio: number;
}

export function calculateImpliedValuation(
  company: Company,
  advancedMetrics: AdvancedFinancialMetrics,
  macroState: MacroState
): ValuationMetrics {
  const impacts = calculateMacroImpactFactors(company, macroState);

  // Base valuation from DCF
  const fairValue = advancedMetrics.fairValue;

  // Apply multiple expansion/contraction
  const multipleChange = impacts.multipleExpansion;
  const impliedMarketCap = fairValue * (1 + multipleChange / 100);

  // EV/EBITDA multiple
  const enterpriseValue = impliedMarketCap + company.financials.total_debt;
  const evToEbitda = enterpriseValue / advancedMetrics.ebitda;

  // P/E ratio
  const peRatio = impliedMarketCap / Math.max(advancedMetrics.netIncome, 1);

  return {
    impliedMarketCap,
    evToEbitda,
    peRatio
  };
}
