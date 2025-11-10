/**
 * Advanced Macro Impact on Company Financials
 * Uses financial theory to model how macro variables affect company metrics
 */

import { Company } from '@/data/companies';
import { MacroState } from '@/lib/store/macroStore';
import { calculateCostOfEquity, calculateSectorBeta } from './capm';
import { calculateDCF, calculateFreeCashFlow, DCFParams } from './dcf';

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
 * Calculate how macro environment affects a company
 */
export function calculateMacroImpactFactors(
  company: Company,
  macroState: MacroState
): MacroImpactFactors {
  const sector = company.sector;

  // Extract key macro variables
  const fedRate = macroState['fed_funds_rate'] || 0.0525;
  const gdpGrowth = macroState['us_gdp_growth'] || 0.025;
  const inflation = macroState['us_cpi'] || 0.037;
  const oilPrice = macroState['wti_oil'] || 78;
  const vix = macroState['vix'] || 15;
  const usdIndex = macroState['usd_index'] || 104.5;
  const unemployment = macroState['us_unemployment'] || 3.8;
  const m2Growth = macroState['us_m2_money_supply'] || 21000;

  // DEMAND IMPACT (GDP-driven)
  // Revenue sensitivity to GDP varies by sector
  const gdpElasticity: Record<string, number> = {
    BANKING: 1.5,         // Highly cyclical
    REALESTATE: 2.0,      // Very cyclical
    MANUFACTURING: 1.2,   // Moderately cyclical
    SEMICONDUCTOR: 1.8,   // Tech cycle amplifies GDP
    CRYPTO: 0.5,          // Less GDP-dependent
  };

  const demandImpact = (gdpGrowth - 0.025) * (gdpElasticity[sector] || 1.0) * 100;

  // PRICE IMPACT (Inflation pass-through)
  // Companies' ability to pass costs to customers
  const pricingPower: Record<string, number> = {
    BANKING: 0.7,         // Moderate pricing power
    REALESTATE: 0.9,      // High pricing power (rents)
    MANUFACTURING: 0.5,   // Low (competitive)
    SEMICONDUCTOR: 0.8,   // High (oligopoly)
    CRYPTO: 0.3,          // Price takers
  };

  const priceImpact = (inflation - 0.037) * (pricingPower[sector] || 0.5) * 100;

  // VOLUME IMPACT (Market dynamics)
  const volumeImpact = demandImpact * 0.6; // Volume typically 60% of demand change

  // COGS PRESSURE (Commodity & Input Costs)
  const commoditySensitivity: Record<string, number> = {
    BANKING: 0.1,         // Low commodity exposure
    REALESTATE: 0.3,      // Energy costs
    MANUFACTURING: 0.8,   // High commodity exposure
    SEMICONDUCTOR: 0.6,   // Energy-intensive
    CRYPTO: 0.9,          // Very energy-intensive (mining)
  };

  const oilImpact = ((oilPrice - 78) / 78) * (commoditySensitivity[sector] || 0.5) * 100;
  const cogsPressure = oilImpact + (inflation - 0.037) * 50;

  // LABOR COST IMPACT
  const laborIntensity: Record<string, number> = {
    BANKING: 0.6,         // People-intensive
    REALESTATE: 0.3,      // Asset-intensive
    MANUFACTURING: 0.7,   // Labor-intensive
    SEMICONDUCTOR: 0.5,   // Capital-intensive
    CRYPTO: 0.2,          // Tech-intensive
  };

  const wageInflation = Math.max(0, 5 - unemployment); // Tight labor → wage pressure
  const laborCostImpact = wageInflation * (laborIntensity[sector] || 0.5);

  // FINANCING COST IMPACT
  const debtRatio = company.financials.total_debt / company.financials.total_assets;
  const rateSensitivity = debtRatio * 100; // Higher debt → more rate sensitivity
  const financingCostImpact = (fedRate - 0.0525) * rateSensitivity * 100;

  // CAPEX IMPACT (Investment decisions)
  const capexElasticity: Record<string, number> = {
    BANKING: -0.5,        // Rates ↑ → CapEx ↓
    REALESTATE: -1.5,     // Very rate-sensitive
    MANUFACTURING: -0.8,  // Moderately sensitive
    SEMICONDUCTOR: -1.2,  // High CapEx sensitivity
    CRYPTO: -0.3,         // Less traditional CapEx
  };

  const capexImpact = (fedRate - 0.0525) * (capexElasticity[sector] || -0.8) * 100;

  // R&D INVESTMENT (Tech sectors)
  const rdSensitivity = sector === 'SEMICONDUCTOR' ? 1.5 : sector === 'MANUFACTURING' ? 0.5 : 0;
  const rdInvestment = gdpGrowth * rdSensitivity * 100;

  // DISCOUNT RATE IMPACT (Valuation)
  const riskPremiumAdjustment = (vix - 15) / 15; // VIX above 15 → higher risk premium
  const discountRateImpact = (fedRate - 0.0525) * 100 + riskPremiumAdjustment * 50;

  // MULTIPLE EXPANSION (Market sentiment)
  const liquidityImpact = ((m2Growth - 21000) / 21000) * 100;
  const sentimentImpact = -(vix - 15) / 15 * 50; // Low VIX → multiple expansion
  const multipleExpansion = liquidityImpact + sentimentImpact;

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
 */
export function calculateAdjustedFinancials(
  company: Company,
  macroState: MacroState,
  sectorImpact: number
): {
  revenue: number;
  cogs: number;
  operatingIncome: number;
  netIncome: number;
  ebitda: number;
  fcf: number;
  costOfEquity: number;
  fairValue: number;
} {
  const base = company.financials;
  const impacts = calculateMacroImpactFactors(company, macroState);

  // REVENUE = Base × (1 + Demand + Price impacts)
  const revenueGrowth = (impacts.demandImpact + impacts.priceImpact) / 100;
  const adjustedRevenue = base.revenue * (1 + revenueGrowth);

  // COGS = Revenue × COGS Margin × (1 + Cost pressures)
  const baseCogsMargin = 0.65; // Assume 65% COGS/Revenue
  const cogsPressureFactor = impacts.cogsPressure / 100;
  const adjustedCogs = adjustedRevenue * baseCogsMargin * (1 + cogsPressureFactor);

  // OPERATING INCOME = Revenue - COGS - OpEx
  const grossProfit = adjustedRevenue - adjustedCogs;
  const opexRatio = 0.20; // Assume 20% OpEx/Revenue
  const opex = adjustedRevenue * opexRatio * (1 + impacts.laborCostImpact / 100);
  const operatingIncome = grossProfit - opex;

  // EBITDA (add back D&A)
  const depreciation = base.revenue * 0.05; // 5% of revenue
  const ebitda = operatingIncome + depreciation;

  // NET INCOME = Operating Income × (1 - Tax Rate) - Interest
  const taxRate = 0.21;
  const interestExpense = base.total_debt * (macroState['fed_funds_rate'] || 0.0525);
  const netIncome = operatingIncome * (1 - taxRate) - interestExpense;

  // FREE CASH FLOW
  const capex = base.revenue * 0.08 * (1 + impacts.capexImpact / 100);
  const changeInNWC = base.revenue * 0.02; // 2% revenue growth → 2% NWC increase
  const fcf = calculateFreeCashFlow(operatingIncome, taxRate, depreciation, changeInNWC, capex);

  // COST OF EQUITY (CAPM)
  const riskFreeRate = macroState['us_10y_yield'] || 0.045;
  const marketReturn = 0.10; // Assume 10% market return
  const beta = calculateSectorBeta(company.sector, macroState);
  const costOfEquity = calculateCostOfEquity(riskFreeRate, beta, marketReturn);

  // DCF VALUATION
  const dcfParams: DCFParams = {
    currentFCF: fcf,
    fcfGrowthRate: (impacts.demandImpact / 100) * 0.5, // Half of revenue growth
    projectionYears: 10,
    costOfEquity,
    costOfDebt: riskFreeRate + 0.02, // Credit spread
    debtToEquityRatio: company.ratios.de_ratio,
    terminalGrowthRate: 0.025,
    sharesOutstanding: 1000, // Placeholder
    netDebt: base.total_debt,
  };

  const dcfResult = calculateDCF(dcfParams);
  const fairValue = dcfResult.equityValue;

  return {
    revenue: adjustedRevenue,
    cogs: adjustedCogs,
    operatingIncome,
    netIncome,
    ebitda,
    fcf,
    costOfEquity,
    fairValue,
  };
}

/**
 * Calculate implied market cap based on multiples
 */
export function calculateImpliedValuation(
  company: Company,
  adjustedMetrics: ReturnType<typeof calculateAdjustedFinancials>,
  macroState: MacroState
): {
  evToEbitda: number;
  peRatio: number;
  impliedMarketCap: number;
} {
  // Sector-specific multiples (baseline)
  const baseMultiples: Record<string, { ev_ebitda: number; pe: number }> = {
    BANKING: { ev_ebitda: 8, pe: 12 },
    REALESTATE: { ev_ebitda: 15, pe: 20 },
    MANUFACTURING: { ev_ebitda: 10, pe: 15 },
    SEMICONDUCTOR: { ev_ebitda: 12, pe: 25 },
    CRYPTO: { ev_ebitda: 20, pe: 40 },
  };

  const base = baseMultiples[company.sector] || { ev_ebitda: 10, pe: 15 };

  // Adjust multiples based on macro environment
  const impacts = calculateMacroImpactFactors(company, macroState);
  const multipleAdjustment = 1 + impacts.multipleExpansion / 100;

  const evToEbitda = base.ev_ebitda * multipleAdjustment;
  const peRatio = base.pe * multipleAdjustment;

  const impliedMarketCap = adjustedMetrics.netIncome * peRatio;

  return {
    evToEbitda,
    peRatio,
    impliedMarketCap,
  };
}
