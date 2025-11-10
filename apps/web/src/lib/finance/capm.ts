/**
 * CAPM (Capital Asset Pricing Model)
 * E(Ri) = Rf + βi(E(Rm) - Rf)
 *
 * Expected Return = Risk-Free Rate + Beta × (Market Return - Risk-Free Rate)
 */

export interface CAPMParams {
  riskFreeRate: number;    // US Treasury 10Y yield
  marketReturn: number;    // Expected S&P 500 return
  beta: number;            // Asset's beta
}

export interface CAPMResult {
  expectedReturn: number;
  equityRiskPremium: number;
  requiredReturn: number;
}

/**
 * Calculate expected return using CAPM
 */
export function calculateCAPM(params: CAPMParams): CAPMResult {
  const { riskFreeRate, marketReturn, beta } = params;

  const equityRiskPremium = marketReturn - riskFreeRate;
  const expectedReturn = riskFreeRate + beta * equityRiskPremium;

  return {
    expectedReturn,
    equityRiskPremium,
    requiredReturn: expectedReturn,
  };
}

/**
 * Calculate Beta from historical returns
 * β = Cov(Ri, Rm) / Var(Rm)
 */
export function calculateBeta(
  assetReturns: number[],
  marketReturns: number[]
): number {
  if (assetReturns.length !== marketReturns.length) {
    throw new Error('Asset and market returns must have same length');
  }

  const n = assetReturns.length;
  const assetMean = assetReturns.reduce((a, b) => a + b, 0) / n;
  const marketMean = marketReturns.reduce((a, b) => a + b, 0) / n;

  let covariance = 0;
  let marketVariance = 0;

  for (let i = 0; i < n; i++) {
    const assetDiff = assetReturns[i] - assetMean;
    const marketDiff = marketReturns[i] - marketMean;
    covariance += assetDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }

  covariance /= n;
  marketVariance /= n;

  return covariance / marketVariance;
}

/**
 * Calculate sector-specific beta based on macro sensitivities
 */
export function calculateSectorBeta(
  sector: string,
  macroState: Record<string, number>
): number {
  // Base betas by sector (relative to market)
  const baseBetas: Record<string, number> = {
    BANKING: 1.2,        // Higher systematic risk
    REALESTATE: 0.9,     // Moderate risk
    MANUFACTURING: 1.0,  // Market risk
    SEMICONDUCTOR: 1.5,  // High tech volatility
    CRYPTO: 2.5,         // Very high volatility
  };

  const baseBeta = baseBetas[sector] || 1.0;

  // Adjust beta based on volatility (VIX)
  const vix = macroState['vix'] || 18.5;
  const vixAdjustment = (vix - 18.5) / 18.5 * 0.3; // ±30% beta adjustment

  return baseBeta * (1 + vixAdjustment);
}

/**
 * Calculate cost of equity using CAPM
 */
export function calculateCostOfEquity(
  riskFreeRate: number,
  beta: number,
  marketReturn: number
): number {
  return calculateCAPM({ riskFreeRate, marketReturn, beta }).expectedReturn;
}
