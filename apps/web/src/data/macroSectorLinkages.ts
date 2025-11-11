/**
 * Macro-Sector Linkage System
 * Defines how each macro variable affects each sector with adjustable weights
 */

import { MacroCategory } from './macroVariables';
import { SectorType } from './companies';

export interface MacroSectorLink {
  macroId: string;
  macroCategory: MacroCategory;
  sectorId: SectorType;

  // Impact definition
  baseWeight: number;        // Base impact strength (0-1)
  direction: 'positive' | 'negative' | 'neutral';
  sensitivity: 'high' | 'medium' | 'low';

  // User adjustable
  userWeight: number;        // User adjustment multiplier (0-2, default 1)

  // Description
  description: string;
  mechanism: string;         // How the impact works
}

/**
 * Comprehensive Macro → Sector Linkage Matrix
 *
 * Weight interpretation:
 * - 0.9-1.0: Very strong impact
 * - 0.7-0.8: Strong impact
 * - 0.4-0.6: Moderate impact
 * - 0.2-0.3: Weak impact
 * - 0.0-0.1: Minimal impact
 */
export const MACRO_SECTOR_LINKAGES: MacroSectorLink[] = [
  // ===== MONETARY_POLICY → BANKING =====
  {
    macroId: 'fed_funds_rate',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'BANKING',
    baseWeight: 0.95,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher rates → Higher Net Interest Margin',
    mechanism: 'Banks profit from spread between deposit and lending rates',
  },
  {
    macroId: 'us_10y_yield',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'BANKING',
    baseWeight: 0.75,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher yields → Better lending margins',
    mechanism: 'Long-term rates affect mortgage and corporate lending',
  },
  {
    macroId: 'yield_curve',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'BANKING',
    baseWeight: 0.85,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Steeper curve → Higher profitability',
    mechanism: 'Banks borrow short and lend long',
  },

  // ===== MONETARY_POLICY → REALESTATE =====
  {
    macroId: 'fed_funds_rate',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'REALESTATE',
    baseWeight: 0.90,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher rates → Lower property values',
    mechanism: 'Higher borrowing costs reduce demand and increase cap rates',
  },
  {
    macroId: 'us_mortgage_rate_30y',
    macroCategory: 'REAL_ESTATE',
    sectorId: 'REALESTATE',
    baseWeight: 0.95,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher mortgage rates → Lower affordability',
    mechanism: 'Direct impact on residential real estate demand',
  },
  {
    macroId: 'us_10y_yield',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'REALESTATE',
    baseWeight: 0.80,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher yields → Higher cap rates',
    mechanism: 'Real estate competes with bonds for investor capital',
  },

  // ===== MONETARY_POLICY → MANUFACTURING =====
  {
    macroId: 'fed_funds_rate',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.65,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher rates → Lower CapEx investment',
    mechanism: 'Increased cost of capital reduces expansion plans',
  },
  {
    macroId: 'credit_spread_baa',
    macroCategory: 'LIQUIDITY',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.70,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Wider spreads → Higher borrowing costs',
    mechanism: 'Corporate bond spreads affect financing availability',
  },

  // ===== MONETARY_POLICY → SEMICONDUCTOR =====
  {
    macroId: 'fed_funds_rate',
    macroCategory: 'MONETARY_POLICY',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.70,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher rates → Lower tech CapEx',
    mechanism: 'Semiconductor fabs require massive capital investment',
  },
  {
    macroId: 'ai_investment',
    macroCategory: 'TECH_INNOVATION',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.90,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'AI boom → Higher chip demand',
    mechanism: 'AI training requires advanced semiconductors',
  },
  {
    macroId: 'semiconductor_equipment_orders',
    macroCategory: 'TECH_INNOVATION',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.95,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Equipment orders → Industry health indicator',
    mechanism: 'Leading indicator of future production capacity',
  },

  // ===== LIQUIDITY → ALL SECTORS =====
  {
    macroId: 'us_m2_money_supply',
    macroCategory: 'LIQUIDITY',
    sectorId: 'BANKING',
    baseWeight: 0.60,
    direction: 'positive',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher M2 → More lending activity',
    mechanism: 'Increased money supply boosts credit creation',
  },
  {
    macroId: 'us_m2_money_supply',
    macroCategory: 'LIQUIDITY',
    sectorId: 'REALESTATE',
    baseWeight: 0.75,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher M2 → Asset price inflation',
    mechanism: 'Excess liquidity flows into real estate',
  },
  {
    macroId: 'us_m2_money_supply',
    macroCategory: 'LIQUIDITY',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.50,
    direction: 'positive',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher M2 → Increased demand',
    mechanism: 'More money in system boosts consumption',
  },
  {
    macroId: 'us_m2_money_supply',
    macroCategory: 'LIQUIDITY',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.55,
    direction: 'positive',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher M2 → Tech investment',
    mechanism: 'Liquidity drives tech sector valuations',
  },
  {
    macroId: 'us_m2_money_supply',
    macroCategory: 'LIQUIDITY',
    sectorId: 'CRYPTO',
    baseWeight: 0.85,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher M2 → Crypto bull market',
    mechanism: 'Crypto seen as inflation hedge and risk asset',
  },

  // ===== ECONOMIC_GROWTH → SECTORS =====
  {
    macroId: 'us_gdp_growth',
    macroCategory: 'ECONOMIC_GROWTH',
    sectorId: 'BANKING',
    baseWeight: 0.70,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher GDP → More credit demand',
    mechanism: 'Economic growth drives business and consumer borrowing',
  },
  {
    macroId: 'us_gdp_growth',
    macroCategory: 'ECONOMIC_GROWTH',
    sectorId: 'REALESTATE',
    baseWeight: 0.65,
    direction: 'positive',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher GDP → Commercial real estate demand',
    mechanism: 'Business expansion requires more office/warehouse space',
  },
  {
    macroId: 'us_gdp_growth',
    macroCategory: 'ECONOMIC_GROWTH',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.80,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher GDP → Manufacturing orders',
    mechanism: 'Direct correlation with industrial production',
  },
  {
    macroId: 'us_gdp_growth',
    macroCategory: 'ECONOMIC_GROWTH',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.75,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher GDP → Electronics demand',
    mechanism: 'Economic growth drives consumer tech purchases',
  },

  // ===== COMMODITIES → MANUFACTURING =====
  {
    macroId: 'wti_oil',
    macroCategory: 'COMMODITIES',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.75,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher oil → Higher production costs',
    mechanism: 'Energy and transportation costs impact margins',
  },
  {
    macroId: 'copper',
    macroCategory: 'COMMODITIES',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.65,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher copper → Input cost pressure',
    mechanism: 'Key industrial metal for manufacturing',
  },
  {
    macroId: 'steel',
    macroCategory: 'COMMODITIES',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.70,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher steel → Construction cost increase',
    mechanism: 'Primary material for heavy manufacturing',
  },

  // ===== FOREIGN_EXCHANGE → MANUFACTURING/SEMICONDUCTOR =====
  {
    macroId: 'krw_usd',
    macroCategory: 'FOREIGN_EXCHANGE',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.80,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Weak KRW → Export competitiveness',
    mechanism: 'Korean chip makers benefit from weak won',
  },
  {
    macroId: 'krw_usd',
    macroCategory: 'FOREIGN_EXCHANGE',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.75,
    direction: 'positive',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Weak KRW → Export advantage',
    mechanism: 'Makes Korean products more competitive globally',
  },
  {
    macroId: 'usd_index',
    macroCategory: 'FOREIGN_EXCHANGE',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.60,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Strong USD → Reduced export competitiveness',
    mechanism: 'Dollar strength makes imports cheaper but exports more expensive',
  },

  // ===== TRADE_LOGISTICS → MANUFACTURING =====
  {
    macroId: 'us_tariff_rate',
    macroCategory: 'TRADE_LOGISTICS',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.85,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher tariffs → Export challenges',
    mechanism: 'Trade barriers reduce international sales',
  },
  {
    macroId: 'container_rate_us_china',
    macroCategory: 'TRADE_LOGISTICS',
    sectorId: 'MANUFACTURING',
    baseWeight: 0.70,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher shipping costs → Margin pressure',
    mechanism: 'Logistics costs impact profitability',
  },
  {
    macroId: 'supply_chain_pressure',
    macroCategory: 'TRADE_LOGISTICS',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.80,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Supply chain stress → Production delays',
    mechanism: 'Chip shortages cascade through industry',
  },

  // ===== MARKET_SENTIMENT → ALL =====
  {
    macroId: 'vix',
    macroCategory: 'MARKET_SENTIMENT',
    sectorId: 'BANKING',
    baseWeight: 0.60,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher VIX → Credit stress',
    mechanism: 'Volatility increases default risk concerns',
  },
  {
    macroId: 'vix',
    macroCategory: 'MARKET_SENTIMENT',
    sectorId: 'REALESTATE',
    baseWeight: 0.55,
    direction: 'negative',
    sensitivity: 'medium',
    userWeight: 1.0,
    description: 'Higher VIX → Risk-off sentiment',
    mechanism: 'Volatility reduces appetite for illiquid assets',
  },
  {
    macroId: 'vix',
    macroCategory: 'MARKET_SENTIMENT',
    sectorId: 'SEMICONDUCTOR',
    baseWeight: 0.70,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher VIX → Tech sell-off',
    mechanism: 'High-beta sector sensitive to volatility',
  },
  {
    macroId: 'vix',
    macroCategory: 'MARKET_SENTIMENT',
    sectorId: 'CRYPTO',
    baseWeight: 0.90,
    direction: 'negative',
    sensitivity: 'high',
    userWeight: 1.0,
    description: 'Higher VIX → Risk asset flight',
    mechanism: 'Crypto highly correlated with risk appetite',
  },
];

/**
 * Get all linkages for a specific macro variable
 */
export function getLinkagesByMacro(macroId: string): MacroSectorLink[] {
  return MACRO_SECTOR_LINKAGES.filter(link => link.macroId === macroId);
}

/**
 * Get all linkages affecting a specific sector
 */
export function getLinkagesBySector(sectorId: SectorType): MacroSectorLink[] {
  return MACRO_SECTOR_LINKAGES.filter(link => link.sectorId === sectorId);
}

/**
 * Get a specific linkage
 */
export function getLinkage(macroId: string, sectorId: SectorType): MacroSectorLink | undefined {
  return MACRO_SECTOR_LINKAGES.find(
    link => link.macroId === macroId && link.sectorId === sectorId
  );
}

/**
 * Get effective weight (base * user adjustment)
 */
export function getEffectiveWeight(link: MacroSectorLink): number {
  return link.baseWeight * link.userWeight;
}
