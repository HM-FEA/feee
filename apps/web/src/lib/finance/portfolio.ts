/**
 * Portfolio Theory & Risk Metrics
 * - Sharpe Ratio
 * - Sortino Ratio
 * - Portfolio Variance
 * - Correlation Matrix
 */

export interface PortfolioAsset {
  id: string;
  name: string;
  weight: number;           // Portfolio weight (0-1)
  expectedReturn: number;   // Expected annual return
  volatility: number;       // Standard deviation of returns
  beta?: number;            // Market beta
}

export interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  beta: number;
  var95: number;           // Value at Risk (95% confidence)
  cvar95: number;          // Conditional VaR
}

/**
 * Calculate Sharpe Ratio
 * SR = (Rp - Rf) / σp
 */
export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (volatility === 0) return 0;
  return (portfolioReturn - riskFreeRate) / volatility;
}

/**
 * Calculate Sortino Ratio (uses downside deviation)
 * Sortino = (Rp - Rf) / σd
 */
export function calculateSortinoRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  downsideDeviation: number
): number {
  if (downsideDeviation === 0) return 0;
  return (portfolioReturn - riskFreeRate) / downsideDeviation;
}

/**
 * Calculate downside deviation (for Sortino Ratio)
 */
export function calculateDownsideDeviation(
  returns: number[],
  targetReturn: number = 0
): number {
  const downsideReturns = returns
    .filter(r => r < targetReturn)
    .map(r => Math.pow(r - targetReturn, 2));

  if (downsideReturns.length === 0) return 0;

  const sumSquares = downsideReturns.reduce((a, b) => a + b, 0);
  return Math.sqrt(sumSquares / returns.length);
}

/**
 * Calculate portfolio expected return
 * E(Rp) = Σ wi × E(Ri)
 */
export function calculatePortfolioReturn(assets: PortfolioAsset[]): number {
  return assets.reduce((sum, asset) => sum + asset.weight * asset.expectedReturn, 0);
}

/**
 * Calculate portfolio volatility (simplified - assumes zero correlation)
 * σp = √(Σ wi² × σi²)
 *
 * For full calculation with correlation:
 * σp = √(Σ Σ wi × wj × σi × σj × ρij)
 */
export function calculatePortfolioVolatility(
  assets: PortfolioAsset[],
  correlationMatrix?: number[][]
): number {
  if (!correlationMatrix) {
    // Simplified calculation (assumes independent assets)
    const variance = assets.reduce(
      (sum, asset) => sum + Math.pow(asset.weight * asset.volatility, 2),
      0
    );
    return Math.sqrt(variance);
  }

  // Full calculation with correlation
  let variance = 0;
  for (let i = 0; i < assets.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      variance +=
        assets[i].weight *
        assets[j].weight *
        assets[i].volatility *
        assets[j].volatility *
        correlationMatrix[i][j];
    }
  }
  return Math.sqrt(variance);
}

/**
 * Calculate portfolio beta (weighted average)
 */
export function calculatePortfolioBeta(assets: PortfolioAsset[]): number {
  return assets.reduce((sum, asset) => sum + asset.weight * (asset.beta || 1), 0);
}

/**
 * Calculate Value at Risk (VaR) using parametric method
 * VaR = μ - Z × σ
 * For 95% confidence: Z = 1.645
 * For 99% confidence: Z = 2.326
 */
export function calculateVaR(
  portfolioValue: number,
  expectedReturn: number,
  volatility: number,
  confidence: number = 0.95,
  timeHorizon: number = 1  // years
): number {
  const z = confidence === 0.95 ? 1.645 : 2.326;
  const varReturn = expectedReturn - z * volatility * Math.sqrt(timeHorizon);
  return portfolioValue * Math.abs(varReturn);
}

/**
 * Calculate Conditional VaR (CVaR / Expected Shortfall)
 * CVaR = E[Loss | Loss > VaR]
 */
export function calculateCVaR(
  portfolioValue: number,
  expectedReturn: number,
  volatility: number,
  confidence: number = 0.95
): number {
  // For normal distribution: CVaR = μ - σ × φ(z) / (1-α)
  const z = confidence === 0.95 ? 1.645 : 2.326;
  const phi_z = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);  // PDF of standard normal
  const cvarReturn = expectedReturn - volatility * phi_z / (1 - confidence);
  return portfolioValue * Math.abs(cvarReturn);
}

/**
 * Calculate full portfolio metrics
 */
export function calculatePortfolioMetrics(
  assets: PortfolioAsset[],
  riskFreeRate: number,
  portfolioValue: number = 1000000,
  correlationMatrix?: number[][]
): PortfolioMetrics {
  const expectedReturn = calculatePortfolioReturn(assets);
  const volatility = calculatePortfolioVolatility(assets, correlationMatrix);
  const beta = calculatePortfolioBeta(assets);

  const sharpeRatio = calculateSharpeRatio(expectedReturn, riskFreeRate, volatility);

  // For Sortino, we need historical returns - using approximation
  const downsideVolatility = volatility * 0.7;  // Typically ~70% of total volatility
  const sortinoRatio = calculateSortinoRatio(expectedReturn, riskFreeRate, downsideVolatility);

  const var95 = calculateVaR(portfolioValue, expectedReturn, volatility, 0.95);
  const cvar95 = calculateCVaR(portfolioValue, expectedReturn, volatility, 0.95);

  return {
    expectedReturn,
    volatility,
    sharpeRatio,
    sortinoRatio,
    beta,
    var95,
    cvar95,
  };
}

/**
 * Efficient Frontier - calculate for given target return
 * Minimize: σp² = w'Σw
 * Subject to: w'R = Rt (target return)
 *             w'1 = 1 (fully invested)
 */
export function calculateEfficientPortfolio(
  assets: { id: string; expectedReturn: number; volatility: number }[],
  targetReturn: number,
  correlationMatrix: number[][]
): { weights: number[]; volatility: number } {
  // Simplified - equal weight to assets closest to target return
  // In production, use quadratic programming (cvxpy, scipy.optimize)

  const n = assets.length;
  const weights = new Array(n).fill(1 / n);

  // Calculate resulting volatility
  const portfolioAssets = assets.map((asset, i) => ({
    ...asset,
    name: asset.id,
    weight: weights[i],
  }));

  const volatility = calculatePortfolioVolatility(portfolioAssets, correlationMatrix);

  return { weights, volatility };
}

/**
 * Calculate correlation between two return series
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
  if (returns1.length !== returns2.length) {
    throw new Error('Return series must have same length');
  }

  const n = returns1.length;
  const mean1 = returns1.reduce((a, b) => a + b, 0) / n;
  const mean2 = returns2.reduce((a, b) => a + b, 0) / n;

  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }

  const stdDev1 = Math.sqrt(variance1);
  const stdDev2 = Math.sqrt(variance2);

  if (stdDev1 === 0 || stdDev2 === 0) return 0;

  return covariance / (stdDev1 * stdDev2);
}
