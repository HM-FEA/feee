/**
 * Quantitative Financial Models
 * Black-Scholes, Black-Litterman, and other financial theories
 */

// ========================================
// BLACK-SCHOLES OPTION PRICING MODEL
// ========================================

/**
 * Standard normal cumulative distribution function
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/**
 * Black-Scholes Option Pricing Model
 * @param S - Current stock price
 * @param K - Strike price
 * @param T - Time to expiration (years)
 * @param r - Risk-free rate
 * @param sigma - Volatility (annualized)
 * @param type - 'call' or 'put'
 */
export function blackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  type: 'call' | 'put' = 'call'
): number {
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  if (type === 'call') {
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
}

/**
 * Calculate option Greeks
 */
export interface OptionGreeks {
  delta: number;   // Δ - Price sensitivity
  gamma: number;   // Γ - Delta sensitivity
  vega: number;    // ν - Volatility sensitivity
  theta: number;   // Θ - Time decay
  rho: number;     // ρ - Interest rate sensitivity
}

export function calculateGreeks(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  type: 'call' | 'put' = 'call'
): OptionGreeks {
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  const sqrtT = Math.sqrt(T);
  const pdf_d1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI);

  const delta = type === 'call' ? normalCDF(d1) : normalCDF(d1) - 1;
  const gamma = pdf_d1 / (S * sigma * sqrtT);
  const vega = S * pdf_d1 * sqrtT / 100; // Divided by 100 for 1% change
  const theta =
    type === 'call'
      ? -(S * pdf_d1 * sigma) / (2 * sqrtT) - r * K * Math.exp(-r * T) * normalCDF(d2)
      : -(S * pdf_d1 * sigma) / (2 * sqrtT) + r * K * Math.exp(-r * T) * normalCDF(-d2);
  const rho =
    type === 'call'
      ? K * T * Math.exp(-r * T) * normalCDF(d2) / 100
      : -K * T * Math.exp(-r * T) * normalCDF(-d2) / 100;

  return { delta, gamma, vega, theta: theta / 365, rho };
}

/**
 * Implied Volatility using Newton-Raphson method
 */
export function impliedVolatility(
  S: number,
  K: number,
  T: number,
  r: number,
  marketPrice: number,
  type: 'call' | 'put' = 'call',
  maxIterations: number = 100,
  tolerance: number = 1e-5
): number {
  let sigma = 0.3; // Initial guess

  for (let i = 0; i < maxIterations; i++) {
    const price = blackScholes(S, K, T, r, sigma, type);
    const diff = marketPrice - price;

    if (Math.abs(diff) < tolerance) {
      return sigma;
    }

    const vega = calculateGreeks(S, K, T, r, sigma, type).vega * 100;
    sigma = sigma + diff / vega;

    // Ensure sigma stays positive
    if (sigma <= 0) sigma = 0.01;
  }

  return sigma; // Return last estimate if not converged
}

// ========================================
// BLACK-LITTERMAN MODEL
// ========================================

/**
 * Matrix operations helper (simplified for 2x2 and 3x3 matrices)
 */
function matrixInverse(matrix: number[][]): number[][] {
  const n = matrix.length;
  if (n === 2) {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return [
      [matrix[1][1] / det, -matrix[0][1] / det],
      [-matrix[1][0] / det, matrix[0][0] / det],
    ];
  }
  // For larger matrices, would need full implementation
  throw new Error('Matrix inversion only implemented for 2x2 matrices');
}

function matrixMultiply(A: number[][], B: number[][]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < A[0].length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

/**
 * Black-Litterman Model
 * Combines market equilibrium returns with investor views
 *
 * @param marketReturns - Market equilibrium returns (π)
 * @param marketCov - Market covariance matrix (Σ)
 * @param views - Investor views on expected returns
 * @param viewConfidence - Confidence in views (τ parameter)
 * @param viewMatrix - Matrix linking views to assets (P)
 */
export interface BlackLittermanInputs {
  marketReturns: number[];      // π - Market equilibrium returns
  marketCov: number[][];        // Σ - Covariance matrix
  views: number[];              // Q - View vector
  viewConfidence: number;       // τ - Scalar confidence parameter
  viewMatrix: number[][];       // P - View matrix
  viewUncertainty: number[][];  // Ω - View uncertainty matrix
}

export function blackLitterman(inputs: BlackLittermanInputs): {
  expectedReturns: number[];
  posteriorCov: number[][];
} {
  const { marketReturns, marketCov, views, viewConfidence, viewMatrix, viewUncertainty } = inputs;

  // Calculate posterior expected returns
  // μ_BL = [(τΣ)^-1 + P'Ω^-1P]^-1 [(τΣ)^-1 π + P'Ω^-1 Q]

  // Simplified calculation for demonstration
  // In production, would use proper matrix library
  const tau = viewConfidence;
  const adjustedReturns = marketReturns.map((r, i) => {
    // Weighted combination of market and views
    const viewWeight = 0.3; // Simplified
    const marketWeight = 1 - viewWeight;
    return marketWeight * r + viewWeight * (views[i] || r);
  });

  return {
    expectedReturns: adjustedReturns,
    posteriorCov: marketCov, // Simplified - would adjust in full implementation
  };
}

// ========================================
// MODERN PORTFOLIO THEORY (MPT)
// ========================================

/**
 * Calculate portfolio expected return
 */
export function portfolioReturn(weights: number[], returns: number[]): number {
  return weights.reduce((sum, w, i) => sum + w * returns[i], 0);
}

/**
 * Calculate portfolio variance
 */
export function portfolioVariance(weights: number[], cov: number[][]): number {
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * cov[i][j];
    }
  }
  return variance;
}

/**
 * Sharpe Ratio
 */
export function sharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  portfolioStdDev: number
): number {
  return (portfolioReturn - riskFreeRate) / portfolioStdDev;
}

/**
 * Maximum Sharpe Ratio Portfolio (simplified)
 */
export function maxSharpePortfolio(
  returns: number[],
  cov: number[][],
  riskFreeRate: number
): number[] {
  // Simplified optimization - in production use proper optimizer
  const n = returns.length;
  const weights = new Array(n).fill(1 / n); // Equal weight as starting point

  // Simple gradient ascent (simplified)
  const iterations = 100;
  const learningRate = 0.01;

  for (let iter = 0; iter < iterations; iter++) {
    const portReturn = portfolioReturn(weights, returns);
    const portVariance = portfolioVariance(weights, cov);
    const portStdDev = Math.sqrt(portVariance);
    const currentSharpe = sharpeRatio(portReturn, riskFreeRate, portStdDev);

    // Calculate gradient (simplified)
    const gradients = weights.map((w, i) => {
      const delta = 0.0001;
      const weightsPlus = [...weights];
      weightsPlus[i] += delta;
      // Normalize
      const sum = weightsPlus.reduce((a, b) => a + b, 0);
      weightsPlus.forEach((_, j) => (weightsPlus[j] /= sum));

      const newReturn = portfolioReturn(weightsPlus, returns);
      const newVariance = portfolioVariance(weightsPlus, cov);
      const newStdDev = Math.sqrt(newVariance);
      const newSharpe = sharpeRatio(newReturn, riskFreeRate, newStdDev);

      return (newSharpe - currentSharpe) / delta;
    });

    // Update weights
    weights.forEach((w, i) => {
      weights[i] = Math.max(0, w + learningRate * gradients[i]);
    });

    // Normalize weights
    const sum = weights.reduce((a, b) => a + b, 0);
    weights.forEach((w, i) => (weights[i] = w / sum));
  }

  return weights;
}

// ========================================
// VALUE AT RISK (VaR)
// ========================================

/**
 * Calculate Value at Risk using Historical Simulation
 */
export function historicalVaR(returns: number[], confidence: number = 0.95): number {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return -sorted[index];
}

/**
 * Calculate Value at Risk using Parametric Method (Variance-Covariance)
 */
export function parametricVaR(
  portfolioValue: number,
  expectedReturn: number,
  portfolioStdDev: number,
  confidence: number = 0.95,
  timeHorizon: number = 1
): number {
  // Z-score for confidence level
  const zScores: { [key: number]: number } = {
    0.90: 1.282,
    0.95: 1.645,
    0.99: 2.326,
  };
  const z = zScores[confidence] || 1.645;

  const varReturn = expectedReturn - z * portfolioStdDev * Math.sqrt(timeHorizon);
  return -portfolioValue * varReturn;
}

/**
 * Conditional Value at Risk (CVaR / Expected Shortfall)
 */
export function conditionalVaR(returns: number[], confidence: number = 0.95): number {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  const tailReturns = sorted.slice(0, index + 1);
  const avgTailLoss = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
  return -avgTailLoss;
}

// ========================================
// CAPITAL ASSET PRICING MODEL (CAPM)
// ========================================

/**
 * Calculate Beta (systematic risk)
 */
export function calculateBeta(
  assetReturns: number[],
  marketReturns: number[]
): number {
  const n = assetReturns.length;
  const assetMean = assetReturns.reduce((a, b) => a + b) / n;
  const marketMean = marketReturns.reduce((a, b) => a + b) / n;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < n; i++) {
    covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
    marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
  }

  return covariance / marketVariance;
}

/**
 * CAPM Expected Return
 */
export function capmExpectedReturn(
  riskFreeRate: number,
  beta: number,
  marketReturn: number
): number {
  return riskFreeRate + beta * (marketReturn - riskFreeRate);
}

/**
 * Jensen's Alpha (risk-adjusted performance)
 */
export function jensensAlpha(
  actualReturn: number,
  riskFreeRate: number,
  beta: number,
  marketReturn: number
): number {
  const expectedReturn = capmExpectedReturn(riskFreeRate, beta, marketReturn);
  return actualReturn - expectedReturn;
}

// ========================================
// FAMA-FRENCH THREE-FACTOR MODEL
// ========================================

/**
 * Fama-French 3-Factor Model
 * R = Rf + β₁(Rm - Rf) + β₂(SMB) + β₃(HML)
 */
export interface FamaFrenchFactors {
  marketPremium: number; // Rm - Rf
  smb: number;          // Small Minus Big (size factor)
  hml: number;          // High Minus Low (value factor)
}

export function famaFrenchExpectedReturn(
  riskFreeRate: number,
  betaMarket: number,
  betaSMB: number,
  betaHML: number,
  factors: FamaFrenchFactors
): number {
  return (
    riskFreeRate +
    betaMarket * factors.marketPremium +
    betaSMB * factors.smb +
    betaHML * factors.hml
  );
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Calculate correlation coefficient
 */
export function correlation(x: number[], y: number[]): number {
  const n = x.length;
  const xMean = x.reduce((a, b) => a + b) / n;
  const yMean = y.reduce((a, b) => a + b) / n;

  let numerator = 0;
  let xDenom = 0;
  let yDenom = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    xDenom += Math.pow(x[i] - xMean, 2);
    yDenom += Math.pow(y[i] - yMean, 2);
  }

  return numerator / Math.sqrt(xDenom * yDenom);
}

/**
 * Calculate covariance
 */
export function covariance(x: number[], y: number[]): number {
  const n = x.length;
  const xMean = x.reduce((a, b) => a + b) / n;
  const yMean = y.reduce((a, b) => a + b) / n;

  let cov = 0;
  for (let i = 0; i < n; i++) {
    cov += (x[i] - xMean) * (y[i] - yMean);
  }

  return cov / (n - 1);
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    (values.length - 1);
  return Math.sqrt(variance);
}

// ========================================
// EXPORTS
// ========================================

export const QuantModels = {
  // Black-Scholes
  blackScholes,
  calculateGreeks,
  impliedVolatility,

  // Black-Litterman
  blackLitterman,

  // MPT
  portfolioReturn,
  portfolioVariance,
  sharpeRatio,
  maxSharpePortfolio,

  // VaR
  historicalVaR,
  parametricVaR,
  conditionalVaR,

  // CAPM
  calculateBeta,
  capmExpectedReturn,
  jensensAlpha,

  // Fama-French
  famaFrenchExpectedReturn,

  // Helpers
  correlation,
  covariance,
  standardDeviation,
};
