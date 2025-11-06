/**
 * Comprehensive Macro Variables Data Structure
 * Based on NEXUS_VISION_MASTER.md - 50+ Variables across 9 Categories
 */

export interface MacroVariable {
  id: string;
  name: string;
  category: MacroCategory;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  description: string;
  impact: {
    sectors: string[];
    direction: 'positive' | 'negative' | 'mixed';
    magnitude: 'high' | 'medium' | 'low';
  };
}

export type MacroCategory =
  | 'MONETARY_POLICY'
  | 'LIQUIDITY'
  | 'ECONOMIC_GROWTH'
  | 'FOREIGN_EXCHANGE'
  | 'COMMODITIES'
  | 'TRADE_LOGISTICS'
  | 'MARKET_SENTIMENT'
  | 'REAL_ESTATE'
  | 'TECH_INNOVATION';

export const MACRO_CATEGORIES: Record<MacroCategory, { label: string; icon: string; color: string }> = {
  MONETARY_POLICY: { label: 'Monetary Policy', icon: '🏦', color: '#06B6D4' },
  LIQUIDITY: { label: 'Liquidity', icon: '💧', color: '#00E5FF' },
  ECONOMIC_GROWTH: { label: 'Economic Growth', icon: '📈', color: '#00FF9F' },
  FOREIGN_EXCHANGE: { label: 'Foreign Exchange', icon: '💱', color: '#C026D3' },
  COMMODITIES: { label: 'Commodities', icon: '🛢️', color: '#F59E0B' },
  TRADE_LOGISTICS: { label: 'Trade & Logistics', icon: '🚢', color: '#8B5CF6' },
  MARKET_SENTIMENT: { label: 'Market Sentiment', icon: '📊', color: '#E6007A' },
  REAL_ESTATE: { label: 'Real Estate', icon: '🏠', color: '#10B981' },
  TECH_INNOVATION: { label: 'Tech & Innovation', icon: '💻', color: '#3B82F6' }
};

export const MACRO_VARIABLES: MacroVariable[] = [
  // ===== Category 1: Monetary Policy (10 variables) =====
  {
    id: 'fed_funds_rate',
    name: 'Fed Funds Rate',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 10,
    defaultValue: 5.25,
    step: 0.25,
    description: 'US Federal Reserve target interest rate',
    impact: { sectors: ['BANKING', 'REALESTATE', 'ALL'], direction: 'mixed', magnitude: 'high' }
  },
  {
    id: 'ecb_main_rate',
    name: 'ECB Main Rate',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 10,
    defaultValue: 4.5,
    step: 0.25,
    description: 'European Central Bank main refinancing rate',
    impact: { sectors: ['BANKING', 'MANUFACTURING'], direction: 'mixed', magnitude: 'high' }
  },
  {
    id: 'boj_rate',
    name: 'BOJ Rate',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: -1,
    max: 5,
    defaultValue: -0.1,
    step: 0.1,
    description: 'Bank of Japan policy rate',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'mixed', magnitude: 'medium' }
  },
  {
    id: 'bok_rate',
    name: 'BOK Rate',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 8,
    defaultValue: 3.5,
    step: 0.25,
    description: 'Bank of Korea base rate',
    impact: { sectors: ['REALESTATE', 'MANUFACTURING'], direction: 'mixed', magnitude: 'high' }
  },
  {
    id: 'pboc_rate',
    name: 'PBOC Rate',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 10,
    defaultValue: 3.45,
    step: 0.05,
    description: 'People\'s Bank of China loan prime rate',
    impact: { sectors: ['MANUFACTURING', 'REALESTATE'], direction: 'mixed', magnitude: 'high' }
  },
  {
    id: 'us_10y_yield',
    name: 'US 10Y Treasury Yield',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 8,
    defaultValue: 4.5,
    step: 0.1,
    description: '10-year US Treasury bond yield',
    impact: { sectors: ['BANKING', 'REALESTATE', 'ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'us_2y_yield',
    name: 'US 2Y Treasury Yield',
    category: 'MONETARY_POLICY',
    unit: '%',
    min: 0,
    max: 8,
    defaultValue: 5.0,
    step: 0.1,
    description: '2-year US Treasury bond yield',
    impact: { sectors: ['BANKING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'yield_curve',
    name: 'Yield Curve (10Y-2Y)',
    category: 'MONETARY_POLICY',
    unit: 'bps',
    min: -200,
    max: 300,
    defaultValue: -50,
    step: 10,
    description: 'Spread between 10Y and 2Y Treasury yields',
    impact: { sectors: ['BANKING', 'ALL'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'fed_balance_sheet',
    name: 'Fed Balance Sheet',
    category: 'MONETARY_POLICY',
    unit: 'T USD',
    min: 4,
    max: 10,
    defaultValue: 7.8,
    step: 0.1,
    description: 'Federal Reserve total assets',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'ecb_balance_sheet',
    name: 'ECB Balance Sheet',
    category: 'MONETARY_POLICY',
    unit: 'T EUR',
    min: 3,
    max: 9,
    defaultValue: 6.9,
    step: 0.1,
    description: 'European Central Bank total assets',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },

  // ===== Category 2: Liquidity (10 variables) =====
  {
    id: 'us_m2_money_supply',
    name: 'US M2 Money Supply',
    category: 'LIQUIDITY',
    unit: 'T USD',
    min: 18,
    max: 25,
    defaultValue: 21.0,
    step: 0.1,
    description: 'US broad money supply',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'china_m2',
    name: 'China M2 Money Supply',
    category: 'LIQUIDITY',
    unit: 'T CNY',
    min: 200,
    max: 300,
    defaultValue: 290.0,
    step: 1,
    description: 'China broad money supply',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'eu_m3',
    name: 'EU M3 Money Supply',
    category: 'LIQUIDITY',
    unit: 'T EUR',
    min: 12,
    max: 18,
    defaultValue: 16.5,
    step: 0.1,
    description: 'Eurozone broad money aggregate',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'korea_m2',
    name: 'Korea M2 Money Supply',
    category: 'LIQUIDITY',
    unit: 'T KRW',
    min: 2500,
    max: 3500,
    defaultValue: 3400.0,
    step: 10,
    description: 'South Korea broad money supply',
    impact: { sectors: ['SEMICONDUCTOR', 'REALESTATE'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'global_liquidity',
    name: 'Global Liquidity Index',
    category: 'LIQUIDITY',
    unit: 'Index',
    min: 80,
    max: 140,
    defaultValue: 105.0,
    step: 1,
    description: 'Composite measure of global money supply',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'credit_spread_baa',
    name: 'Credit Spread (BAA)',
    category: 'LIQUIDITY',
    unit: 'bps',
    min: 50,
    max: 600,
    defaultValue: 180.0,
    step: 10,
    description: 'BAA corporate bond spread over 10Y Treasury',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'ted_spread',
    name: 'TED Spread',
    category: 'LIQUIDITY',
    unit: 'bps',
    min: 10,
    max: 300,
    defaultValue: 30.0,
    step: 5,
    description: 'LIBOR-Treasury spread (interbank stress)',
    impact: { sectors: ['BANKING'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'repo_rate',
    name: 'US Repo Rate',
    category: 'LIQUIDITY',
    unit: '%',
    min: 0,
    max: 10,
    defaultValue: 5.3,
    step: 0.05,
    description: 'Overnight repurchase agreement rate',
    impact: { sectors: ['BANKING'], direction: 'mixed', magnitude: 'medium' }
  },
  {
    id: 'reverse_repo',
    name: 'Fed Reverse Repo',
    category: 'LIQUIDITY',
    unit: 'B USD',
    min: 0,
    max: 2500,
    defaultValue: 600.0,
    step: 50,
    description: 'Federal Reserve overnight reverse repo facility',
    impact: { sectors: ['BANKING'], direction: 'negative', magnitude: 'medium' }
  },
  {
    id: 'margin_debt',
    name: 'NYSE Margin Debt',
    category: 'LIQUIDITY',
    unit: 'B USD',
    min: 400,
    max: 1000,
    defaultValue: 700.0,
    step: 10,
    description: 'Total margin debt at NYSE brokerage firms',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'low' }
  },

  // ===== Category 3: Economic Growth (10 variables) =====
  {
    id: 'us_gdp_growth',
    name: 'US GDP Growth',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -5,
    max: 7,
    defaultValue: 2.5,
    step: 0.1,
    description: 'US real GDP growth rate (YoY)',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'china_gdp_growth',
    name: 'China GDP Growth',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -3,
    max: 10,
    defaultValue: 5.0,
    step: 0.1,
    description: 'China real GDP growth rate (YoY)',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'eu_gdp_growth',
    name: 'EU GDP Growth',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -5,
    max: 5,
    defaultValue: 1.0,
    step: 0.1,
    description: 'Eurozone real GDP growth rate (YoY)',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'us_unemployment',
    name: 'US Unemployment Rate',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: 3,
    max: 15,
    defaultValue: 3.8,
    step: 0.1,
    description: 'US unemployment rate',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'medium' }
  },
  {
    id: 'us_cpi',
    name: 'US CPI Inflation',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -2,
    max: 10,
    defaultValue: 3.7,
    step: 0.1,
    description: 'US Consumer Price Index (YoY)',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'us_pce',
    name: 'US PCE Inflation',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -2,
    max: 10,
    defaultValue: 3.4,
    step: 0.1,
    description: 'US Personal Consumption Expenditures (Fed\'s preferred)',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'us_pmi_manufacturing',
    name: 'US Manufacturing PMI',
    category: 'ECONOMIC_GROWTH',
    unit: 'Index',
    min: 30,
    max: 70,
    defaultValue: 48.5,
    step: 0.5,
    description: 'ISM Manufacturing Purchasing Managers Index',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'us_pmi_services',
    name: 'US Services PMI',
    category: 'ECONOMIC_GROWTH',
    unit: 'Index',
    min: 30,
    max: 70,
    defaultValue: 52.0,
    step: 0.5,
    description: 'ISM Services PMI',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'us_retail_sales',
    name: 'US Retail Sales Growth',
    category: 'ECONOMIC_GROWTH',
    unit: '%',
    min: -10,
    max: 10,
    defaultValue: 4.0,
    step: 0.5,
    description: 'US retail sales growth (YoY)',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'us_consumer_confidence',
    name: 'US Consumer Confidence',
    category: 'ECONOMIC_GROWTH',
    unit: 'Index',
    min: 50,
    max: 130,
    defaultValue: 102.0,
    step: 1,
    description: 'Conference Board Consumer Confidence Index',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'low' }
  },

  // ===== Category 4: Foreign Exchange (8 variables) =====
  {
    id: 'usd_index',
    name: 'US Dollar Index (DXY)',
    category: 'FOREIGN_EXCHANGE',
    unit: 'Index',
    min: 80,
    max: 120,
    defaultValue: 104.5,
    step: 0.5,
    description: 'US Dollar strength vs basket of currencies',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'krw_usd',
    name: 'KRW/USD Exchange Rate',
    category: 'FOREIGN_EXCHANGE',
    unit: 'KRW',
    min: 900,
    max: 1500,
    defaultValue: 1320.0,
    step: 10,
    description: 'Korean Won per US Dollar',
    impact: { sectors: ['SEMICONDUCTOR', 'MANUFACTURING'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'eur_usd',
    name: 'EUR/USD Exchange Rate',
    category: 'FOREIGN_EXCHANGE',
    unit: 'USD',
    min: 0.9,
    max: 1.3,
    defaultValue: 1.07,
    step: 0.01,
    description: 'Euro per US Dollar',
    impact: { sectors: ['MANUFACTURING'], direction: 'mixed', magnitude: 'medium' }
  },
  {
    id: 'jpy_usd',
    name: 'JPY/USD Exchange Rate',
    category: 'FOREIGN_EXCHANGE',
    unit: 'JPY',
    min: 90,
    max: 160,
    defaultValue: 149.0,
    step: 1,
    description: 'Japanese Yen per US Dollar',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'cny_usd',
    name: 'CNY/USD Exchange Rate',
    category: 'FOREIGN_EXCHANGE',
    unit: 'CNY',
    min: 6.0,
    max: 8.0,
    defaultValue: 7.25,
    step: 0.05,
    description: 'Chinese Yuan per US Dollar',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'gbp_usd',
    name: 'GBP/USD Exchange Rate',
    category: 'FOREIGN_EXCHANGE',
    unit: 'USD',
    min: 1.0,
    max: 1.5,
    defaultValue: 1.23,
    step: 0.01,
    description: 'British Pound per US Dollar',
    impact: { sectors: ['BANKING'], direction: 'mixed', magnitude: 'low' }
  },
  {
    id: 'emerging_fx_index',
    name: 'Emerging Markets FX Index',
    category: 'FOREIGN_EXCHANGE',
    unit: 'Index',
    min: 70,
    max: 110,
    defaultValue: 90.0,
    step: 1,
    description: 'Composite emerging markets currency strength',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'fx_volatility',
    name: 'FX Volatility Index',
    category: 'FOREIGN_EXCHANGE',
    unit: 'Index',
    min: 5,
    max: 20,
    defaultValue: 9.0,
    step: 0.5,
    description: 'Currency market volatility measure',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'low' }
  },

  // ===== Category 5: Commodities (7 variables) =====
  {
    id: 'wti_oil',
    name: 'WTI Crude Oil',
    category: 'COMMODITIES',
    unit: '$ / barrel',
    min: 30,
    max: 120,
    defaultValue: 78.0,
    step: 1,
    description: 'West Texas Intermediate crude oil price',
    impact: { sectors: ['MANUFACTURING', 'ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'brent_oil',
    name: 'Brent Crude Oil',
    category: 'COMMODITIES',
    unit: '$ / barrel',
    min: 30,
    max: 120,
    defaultValue: 82.0,
    step: 1,
    description: 'Brent crude oil price',
    impact: { sectors: ['MANUFACTURING', 'ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'natural_gas',
    name: 'Natural Gas (Henry Hub)',
    category: 'COMMODITIES',
    unit: '$ / MMBtu',
    min: 1.5,
    max: 10,
    defaultValue: 2.8,
    step: 0.1,
    description: 'Natural gas price',
    impact: { sectors: ['MANUFACTURING'], direction: 'negative', magnitude: 'medium' }
  },
  {
    id: 'gold',
    name: 'Gold',
    category: 'COMMODITIES',
    unit: '$ / oz',
    min: 1500,
    max: 2500,
    defaultValue: 2040.0,
    step: 10,
    description: 'Gold spot price',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'low' }
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'COMMODITIES',
    unit: '$ / lb',
    min: 2.5,
    max: 5.0,
    defaultValue: 3.8,
    step: 0.1,
    description: 'Copper price (industrial demand proxy)',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'steel',
    name: 'Steel',
    category: 'COMMODITIES',
    unit: '$ / ton',
    min: 400,
    max: 1000,
    defaultValue: 650.0,
    step: 10,
    description: 'Hot rolled coil steel price',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'COMMODITIES',
    unit: '$ / bushel',
    min: 4,
    max: 12,
    defaultValue: 5.8,
    step: 0.2,
    description: 'Wheat commodity price',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'low' }
  },

  // ===== Category 6: Trade & Logistics (6 variables) =====
  {
    id: 'container_rate_us_china',
    name: 'Container Rate (US-China)',
    category: 'TRADE_LOGISTICS',
    unit: '$ / 40ft',
    min: 1000,
    max: 10000,
    defaultValue: 2500.0,
    step: 100,
    description: 'Shanghai to Los Angeles container shipping rate',
    impact: { sectors: ['MANUFACTURING'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'baltic_dry_index',
    name: 'Baltic Dry Index',
    category: 'TRADE_LOGISTICS',
    unit: 'Index',
    min: 500,
    max: 5000,
    defaultValue: 1800.0,
    step: 50,
    description: 'Global shipping rates for dry bulk commodities',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'us_tariff_rate',
    name: 'US Tariff Rate',
    category: 'TRADE_LOGISTICS',
    unit: '%',
    min: 0,
    max: 50,
    defaultValue: 19.0,
    step: 1,
    description: 'Average US import tariff rate',
    impact: { sectors: ['MANUFACTURING'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'china_exports_growth',
    name: 'China Exports Growth',
    category: 'TRADE_LOGISTICS',
    unit: '%',
    min: -20,
    max: 30,
    defaultValue: 5.0,
    step: 1,
    description: 'China export growth (YoY)',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'us_imports_growth',
    name: 'US Imports Growth',
    category: 'TRADE_LOGISTICS',
    unit: '%',
    min: -20,
    max: 20,
    defaultValue: 3.0,
    step: 1,
    description: 'US import growth (YoY)',
    impact: { sectors: ['MANUFACTURING'], direction: 'positive', magnitude: 'medium' }
  },
  {
    id: 'supply_chain_pressure',
    name: 'Supply Chain Pressure Index',
    category: 'TRADE_LOGISTICS',
    unit: 'Index',
    min: -1,
    max: 4,
    defaultValue: 0.5,
    step: 0.1,
    description: 'NY Fed Global Supply Chain Pressure Index',
    impact: { sectors: ['MANUFACTURING', 'SEMICONDUCTOR'], direction: 'negative', magnitude: 'high' }
  },

  // ===== Category 7: Market Sentiment (5 variables) =====
  {
    id: 'vix',
    name: 'VIX (Volatility Index)',
    category: 'MARKET_SENTIMENT',
    unit: 'Index',
    min: 10,
    max: 80,
    defaultValue: 15.0,
    step: 1,
    description: 'CBOE Volatility Index (fear gauge)',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'put_call_ratio',
    name: 'Put/Call Ratio',
    category: 'MARKET_SENTIMENT',
    unit: 'Ratio',
    min: 0.5,
    max: 1.5,
    defaultValue: 0.85,
    step: 0.05,
    description: 'Options market sentiment indicator',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'low' }
  },
  {
    id: 'aaii_sentiment',
    name: 'AAII Bullish Sentiment',
    category: 'MARKET_SENTIMENT',
    unit: '%',
    min: 20,
    max: 60,
    defaultValue: 38.0,
    step: 1,
    description: 'American Association of Individual Investors bullish %',
    impact: { sectors: ['ALL'], direction: 'positive', magnitude: 'low' }
  },
  {
    id: 'high_yield_spread',
    name: 'High Yield Spread',
    category: 'MARKET_SENTIMENT',
    unit: 'bps',
    min: 200,
    max: 1000,
    defaultValue: 420.0,
    step: 10,
    description: 'Junk bond spread over Treasuries',
    impact: { sectors: ['ALL'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'emerging_market_risk',
    name: 'EM Risk Premium',
    category: 'MARKET_SENTIMENT',
    unit: 'bps',
    min: 200,
    max: 800,
    defaultValue: 350.0,
    step: 10,
    description: 'Emerging markets sovereign bond spread',
    impact: { sectors: ['MANUFACTURING'], direction: 'negative', magnitude: 'medium' }
  },

  // ===== Category 8: Real Estate (4 variables) =====
  {
    id: 'us_home_price_index',
    name: 'US Home Price Index',
    category: 'REAL_ESTATE',
    unit: 'Index',
    min: 200,
    max: 350,
    defaultValue: 310.0,
    step: 5,
    description: 'Case-Shiller National Home Price Index',
    impact: { sectors: ['REALESTATE', 'BANKING'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'us_mortgage_rate_30y',
    name: 'US 30Y Mortgage Rate',
    category: 'REAL_ESTATE',
    unit: '%',
    min: 2.5,
    max: 8,
    defaultValue: 7.2,
    step: 0.1,
    description: '30-year fixed mortgage rate',
    impact: { sectors: ['REALESTATE'], direction: 'negative', magnitude: 'high' }
  },
  {
    id: 'commercial_real_estate_index',
    name: 'Commercial Real Estate Index',
    category: 'REAL_ESTATE',
    unit: 'Index',
    min: 80,
    max: 160,
    defaultValue: 125.0,
    step: 5,
    description: 'Commercial property price index',
    impact: { sectors: ['REALESTATE', 'BANKING'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'cap_rate',
    name: 'Commercial Cap Rate',
    category: 'REAL_ESTATE',
    unit: '%',
    min: 4,
    max: 10,
    defaultValue: 6.8,
    step: 0.1,
    description: 'Capitalization rate for commercial properties',
    impact: { sectors: ['REALESTATE'], direction: 'negative', magnitude: 'medium' }
  },

  // ===== Category 9: Tech & Innovation (3 variables) =====
  {
    id: 'ai_investment',
    name: 'AI Investment Growth',
    category: 'TECH_INNOVATION',
    unit: '%',
    min: 0,
    max: 100,
    defaultValue: 35.0,
    step: 5,
    description: 'Year-over-year growth in AI/ML investments',
    impact: { sectors: ['SEMICONDUCTOR'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'semiconductor_equipment_orders',
    name: 'Semiconductor Equipment Orders',
    category: 'TECH_INNOVATION',
    unit: 'B USD',
    min: 20,
    max: 120,
    defaultValue: 95.0,
    step: 5,
    description: 'Global semiconductor equipment billings',
    impact: { sectors: ['SEMICONDUCTOR'], direction: 'positive', magnitude: 'high' }
  },
  {
    id: 'cloud_infrastructure_spend',
    name: 'Cloud Infrastructure Spend',
    category: 'TECH_INNOVATION',
    unit: 'B USD (quarterly)',
    min: 40,
    max: 80,
    defaultValue: 63.0,
    step: 2,
    description: 'Global cloud infrastructure spending',
    impact: { sectors: ['SEMICONDUCTOR'], direction: 'positive', magnitude: 'medium' }
  }
];

/**
 * Get variables by category
 */
export function getVariablesByCategory(category: MacroCategory): MacroVariable[] {
  return MACRO_VARIABLES.filter(v => v.category === category);
}

/**
 * Get default macro state (all variables at default values)
 */
export function getDefaultMacroState(): Record<string, number> {
  return MACRO_VARIABLES.reduce((acc, variable) => {
    acc[variable.id] = variable.defaultValue;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get variable by ID
 */
export function getVariableById(id: string): MacroVariable | undefined {
  return MACRO_VARIABLES.find(v => v.id === id);
}
