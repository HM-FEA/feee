/**
 * DCF (Discounted Cash Flow) Valuation
 * Enterprise Value = Σ(FCF_t / (1 + WACC)^t) + Terminal Value
 */

import { calculateCostOfEquity } from './capm';

export interface DCFParams {
  // Free Cash Flows
  currentFCF: number;           // Current year FCF
  fcfGrowthRate: number;        // Expected FCF growth rate
  projectionYears: number;      // Number of years to project (typically 5-10)

  // Discount rates
  costOfEquity: number;         // From CAPM
  costOfDebt: number;           // After-tax cost of debt
  debtToEquityRatio: number;    // D/E ratio

  // Terminal value
  terminalGrowthRate: number;   // Perpetual growth rate (typically 2-3%)
  terminalMultiple?: number;    // Alternative: EV/EBITDA multiple

  // Capital structure
  sharesOutstanding: number;    // For per-share valuation
  netDebt: number;              // Total debt - cash
}

export interface DCFResult {
  presentValueFCF: number;      // PV of projected FCF
  terminalValue: number;        // TV
  presentValueTV: number;       // PV of TV
  enterpriseValue: number;      // EV = PV(FCF) + PV(TV)
  equityValue: number;          // EV - Net Debt
  valuePerShare: number;        // Equity Value / Shares
  wacc: number;                 // Weighted Average Cost of Capital
}

/**
 * Calculate WACC (Weighted Average Cost of Capital)
 * WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))
 */
export function calculateWACC(
  costOfEquity: number,
  costOfDebt: number,
  debtToEquityRatio: number,
  taxRate: number = 0.21  // Corporate tax rate
): number {
  const D = debtToEquityRatio;
  const E = 1;
  const V = E + D;

  const equityWeight = E / V;
  const debtWeight = D / V;

  return (equityWeight * costOfEquity) + (debtWeight * costOfDebt * (1 - taxRate));
}

/**
 * Calculate DCF valuation
 */
export function calculateDCF(params: DCFParams): DCFResult {
  const {
    currentFCF,
    fcfGrowthRate,
    projectionYears,
    costOfEquity,
    costOfDebt,
    debtToEquityRatio,
    terminalGrowthRate,
    terminalMultiple,
    sharesOutstanding,
    netDebt,
  } = params;

  // Calculate WACC
  const wacc = calculateWACC(costOfEquity, costOfDebt, debtToEquityRatio);

  // Project FCF and calculate present value
  let presentValueFCF = 0;
  let lastYearFCF = currentFCF;

  for (let year = 1; year <= projectionYears; year++) {
    const fcf = lastYearFCF * (1 + fcfGrowthRate);
    const pv = fcf / Math.pow(1 + wacc, year);
    presentValueFCF += pv;
    lastYearFCF = fcf;
  }

  // Calculate Terminal Value
  let terminalValue: number;
  if (terminalMultiple) {
    // Exit multiple method
    terminalValue = lastYearFCF * terminalMultiple;
  } else {
    // Gordon Growth Model: TV = FCF_{n+1} / (WACC - g)
    const fcfNextYear = lastYearFCF * (1 + terminalGrowthRate);
    terminalValue = fcfNextYear / (wacc - terminalGrowthRate);
  }

  // Present value of terminal value
  const presentValueTV = terminalValue / Math.pow(1 + wacc, projectionYears);

  // Enterprise Value
  const enterpriseValue = presentValueFCF + presentValueTV;

  // Equity Value
  const equityValue = enterpriseValue - netDebt;

  // Value per share
  const valuePerShare = equityValue / sharesOutstanding;

  return {
    presentValueFCF,
    terminalValue,
    presentValueTV,
    enterpriseValue,
    equityValue,
    valuePerShare,
    wacc,
  };
}

/**
 * Sensitivity analysis for DCF
 */
export interface DCFSensitivity {
  waccRange: number[];
  growthRange: number[];
  valuationMatrix: number[][];  // [wacc][growth] -> value per share
}

export function calculateDCFSensitivity(
  baseParams: DCFParams,
  waccRange: number[],
  growthRange: number[]
): DCFSensitivity {
  const valuationMatrix: number[][] = [];

  waccRange.forEach(wacc => {
    const row: number[] = [];
    growthRange.forEach(growth => {
      // Override WACC by adjusting cost of equity
      const adjustedParams = {
        ...baseParams,
        terminalGrowthRate: growth,
      };

      // Calculate with adjusted parameters
      const result = calculateDCF(adjustedParams);
      row.push(result.valuePerShare);
    });
    valuationMatrix.push(row);
  });

  return {
    waccRange,
    growthRange,
    valuationMatrix,
  };
}

/**
 * Calculate FCF from financial statements
 */
export function calculateFreeCashFlow(
  operatingIncome: number,
  taxRate: number,
  depreciation: number,
  changeInNWC: number,  // Change in Net Working Capital
  capex: number         // Capital Expenditures
): number {
  const nopat = operatingIncome * (1 - taxRate);  // Net Operating Profit After Tax
  const fcf = nopat + depreciation - changeInNWC - capex;
  return fcf;
}
