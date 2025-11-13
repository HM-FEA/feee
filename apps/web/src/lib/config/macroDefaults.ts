/**
 * Macro Variable Defaults
 * Replaces hardcoded macro values throughout the application
 *
 * Priority: HIGH (Phase 3.6)
 * Source: Federal Reserve, World Bank, Trading Economics (2025-01-13)
 */

export const MACRO_DEFAULTS = {
  // Interest Rates
  fed_funds_rate: 0.0525,  // 5.25% (as of Jan 2025)
  us_10y_yield: 0.045,     // 4.5%
  mortgage_rate_30y: 0.068, // 6.8%

  // Economic Growth
  us_gdp_growth: 0.025,    // 2.5% annual
  global_gdp_growth: 0.031,  // 3.1% annual
  us_productivity_growth: 0.015,  // 1.5%

  // Inflation
  us_cpi: 0.037,           // 3.7% YoY
  core_pce: 0.033,         // 3.3% YoY
  ppi: 0.029,              // 2.9% YoY

  // Commodities (USD)
  wti_oil: 78,             // $78/barrel
  brent_oil: 82,           // $82/barrel
  natural_gas: 3.2,        // $3.20/MMBtu
  gold: 2050,              // $2,050/oz
  copper: 8500,            // $8,500/ton

  // FX Rates
  usd_index: 104.5,        // DXY
  eur_usd: 1.08,
  usd_jpy: 148,
  gbp_usd: 1.27,
  usd_cny: 7.25,

  // Labor Market
  us_unemployment: 3.8,    // 3.8%
  labor_participation: 62.5,  // 62.5%
  avg_hourly_earnings_growth: 0.041,  // 4.1% YoY

  // Monetary Aggregates (Billions USD)
  us_m2_money_supply: 21000,  // $21T
  fed_balance_sheet: 7800,    // $7.8T

  // Volatility & Risk
  vix: 15,                 // Volatility index
  credit_spread_baa: 200,  // 200 bps over Treasuries
  corporate_default_rate: 0.01,  // 1%

  // Housing
  case_shiller_index: 312,  // 2000=100
  housing_starts: 1.35,     // Million units annualized
  median_home_price: 420000, // $420K

  // Manufacturing
  ism_manufacturing: 48.2,  // PMI (below 50 = contraction)
  industrial_production: 102.5,  // 2017=100
  capacity_utilization: 78.5,  // 78.5%

  // Consumer
  consumer_confidence: 102,  // Index
  retail_sales_growth: 0.034,  // 3.4% YoY
  personal_savings_rate: 0.045,  // 4.5%

  // Global Trade
  baltic_dry_index: 1680,  // Shipping cost index
  global_container_throughput: 850,  // Million TEU
  us_trade_deficit: -65,   // $65B monthly

  // Tech & Innovation
  ai_investment_growth: 0.42,  // 42% YoY
  global_semiconductor_sales: 580,  // $580B annually
  cloud_spending_growth: 0.21,  // 21% YoY
} as const;

// Type-safe accessor
export type MacroVariable = keyof typeof MACRO_DEFAULTS;

export function getMacroDefault(variable: MacroVariable): number {
  return MACRO_DEFAULTS[variable];
}

// ============================================
// HISTORICAL SCENARIOS (Pre-configured)
// ============================================

export const HISTORICAL_SCENARIOS = {
  crisis_2008: {
    name: '2008 Financial Crisis',
    date: '2008-09-15',
    macros: {
      fed_funds_rate: 0.0025,
      us_gdp_growth: -0.028,
      us_cpi: 0.038,
      vix: 80,
      us_unemployment: 10.0,
      credit_spread_baa: 600,
    },
  },
  pandemic_2020: {
    name: '2020 COVID-19 Pandemic',
    date: '2020-03-23',
    macros: {
      fed_funds_rate: 0.0025,
      us_gdp_growth: -0.031,
      us_cpi: 0.012,
      vix: 82,
      us_unemployment: 14.7,
      wti_oil: 20,
    },
  },
  inflation_2022: {
    name: '2022 Inflation Surge',
    date: '2022-06-15',
    macros: {
      fed_funds_rate: 0.0175,
      us_gdp_growth: 0.021,
      us_cpi: 0.091,
      vix: 28,
      us_unemployment: 3.6,
      wti_oil: 122,
    },
  },
} as const;

export type HistoricalScenarioKey = keyof typeof HISTORICAL_SCENARIOS;
