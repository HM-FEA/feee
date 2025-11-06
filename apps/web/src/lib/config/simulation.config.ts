/**
 * Simulation Parameters Configuration
 * Purpose: Centralized configuration for all economic simulation parameters
 * Benefits: Consistent parameter ranges, easy scenario templates, auditable simulation setup
 */

export interface RateRange {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface TariffRange {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface FXRange {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface RiskThreshold {
  safe: number;
  caution: number;
  risk: number;
}

export interface ScenarioTemplate {
  name: string;
  description: string;
  interestRate: number;
  tariffRate: number;
  fxRate: number;
}

/**
 * Core simulation parameters - organized by variable type
 */
export const SIMULATION_CONFIG = {
  // Interest rate parameters (basis points converted to percentages)
  interestRate: {
    min: 0,
    max: 10,
    step: 0.1,
    default: 2.5,
    unit: '%',
    description: 'Central bank policy rate',
  } as RateRange,

  // Tariff parameters
  tariff: {
    min: 0,
    max: 50,
    step: 1,
    default: 0,
    unit: '%',
    description: 'Import tariff rate',
  } as TariffRange,

  // Foreign exchange parameters (KRW per USD for Korean context)
  fx: {
    min: 900,
    max: 1500,
    step: 10,
    default: 1200,
    unit: 'KRW/USD',
    description: 'Foreign exchange rate',
  } as FXRange,

  // Risk thresholds (sector-independent defaults)
  riskThresholds: {
    safe: 2.5,
    caution: 2.0,
    risk: 0,
  } as RiskThreshold,

  // Scenario templates - pre-defined economic scenarios
  scenarios: {
    baseline: {
      name: 'Baseline',
      description: 'Current market conditions',
      interestRate: 2.5,
      tariffRate: 0,
      fxRate: 1200,
    },
    rateRise: {
      name: 'Rate Hike',
      description: 'Central bank tightening cycle',
      interestRate: 4.0,
      tariffRate: 0,
      fxRate: 1200,
    },
    ratecut: {
      name: 'Rate Cut',
      description: 'Monetary easing/recession response',
      interestRate: 1.0,
      tariffRate: 0,
      fxRate: 1200,
    },
    tariffWar: {
      name: 'Tariff War',
      description: 'Trade tensions and protective tariffs',
      interestRate: 2.5,
      tariffRate: 25,
      fxRate: 1100,
    },
    weakCurrency: {
      name: 'Weak Currency',
      description: 'Currency depreciation scenario',
      interestRate: 3.5,
      tariffRate: 0,
      fxRate: 1400,
    },
    strongCurrency: {
      name: 'Strong Currency',
      description: 'Currency appreciation scenario',
      interestRate: 3.0,
      tariffRate: 0,
      fxRate: 1000,
    },
    recession: {
      name: 'Recession',
      description: 'Economic slowdown with rate cuts',
      interestRate: 1.0,
      tariffRate: 15,
      fxRate: 1300,
    },
    highInflation: {
      name: 'High Inflation',
      description: 'Inflationary environment with high rates',
      interestRate: 5.5,
      tariffRate: 10,
      fxRate: 1150,
    },
  } as Record<string, ScenarioTemplate>,

  // Animation and display parameters
  animation: {
    transitionDuration: 300,        // milliseconds
    graphUpdateInterval: 1000,      // milliseconds
    tooltipDelay: 200,              // milliseconds
  },

  // Data aggregation parameters
  aggregation: {
    decimalPlaces: 2,
    currencyDecimals: 0,
    percentDecimals: 2,
  },

  // Simulation time horizon
  timeHorizon: {
    shortTerm: 3,                   // months
    mediumTerm: 6,                  // months
    longTerm: 12,                   // months
  },
} as const;

/**
 * Get scenario by name
 */
export function getScenario(scenarioName: string): ScenarioTemplate | null {
  return SIMULATION_CONFIG.scenarios[scenarioName as keyof typeof SIMULATION_CONFIG.scenarios] || null;
}

/**
 * Get all scenario names
 */
export function getScenarioNames(): string[] {
  return Object.keys(SIMULATION_CONFIG.scenarios);
}

/**
 * Validate parameter is within bounds
 */
export function validateInterestRate(rate: number): boolean {
  const config = SIMULATION_CONFIG.interestRate;
  return rate >= config.min && rate <= config.max;
}

export function validateTariff(tariff: number): boolean {
  const config = SIMULATION_CONFIG.tariff;
  return tariff >= config.min && tariff <= config.max;
}

export function validateFX(fx: number): boolean {
  const config = SIMULATION_CONFIG.fx;
  return fx >= config.min && fx <= config.max;
}

/**
 * Clamp parameter to valid range
 */
export function clampInterestRate(rate: number): number {
  const config = SIMULATION_CONFIG.interestRate;
  return Math.max(config.min, Math.min(config.max, rate));
}

export function clampTariff(tariff: number): number {
  const config = SIMULATION_CONFIG.tariff;
  return Math.max(config.min, Math.min(config.max, tariff));
}

export function clampFX(fx: number): number {
  const config = SIMULATION_CONFIG.fx;
  return Math.max(config.min, Math.min(config.max, fx));
}

/**
 * Format parameter for display
 */
export function formatParameter(
  value: number,
  paramType: 'rate' | 'tariff' | 'fx'
): string {
  switch (paramType) {
    case 'rate':
    case 'tariff':
      return `${value.toFixed(SIMULATION_CONFIG.aggregation.percentDecimals)}%`;
    case 'fx':
      return `${value.toFixed(0)}`;
  }
}

/**
 * Get rate sensitivity description
 */
export function getRateSensitivityLabel(sensitivity: 'positive' | 'negative' | 'neutral'): string {
  const labels = {
    positive: '↑ Higher rates = Higher sector performance',
    negative: '↓ Higher rates = Lower sector performance',
    neutral: '→ Neutral to interest rates',
  };
  return labels[sensitivity];
}
