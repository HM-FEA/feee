/**
 * Modern Portfolio Theory & Optimization
 * Nobel Prize 1990 (Harry Markowitz)
 *
 * Implements:
 * - Markowitz mean-variance optimization
 * - Efficient frontier generation
 * - Tangency portfolio (maximum Sharpe ratio)
 * - Minimum variance portfolio
 * - Risk parity portfolio
 * - Performance metrics (Sharpe, Sortino, Calmar, Information Ratio)
 * - Beta, Alpha, Tracking Error
 */

/**
 * Portfolio allocation and metrics
 */
export interface Portfolio {
  weights: number[]; // Asset weights (sum to 1.0)
  expectedReturn: number; // Annualized expected return
  volatility: number; // Annualized standard deviation (risk)
  sharpeRatio: number; // Risk-adjusted return
  sortinoRatio?: number; // Downside risk-adjusted return
  calmarRatio?: number; // Return / max drawdown
  maxDrawdown?: number; // Maximum peak-to-trough decline
  beta?: number; // Systematic risk vs benchmark
  alpha?: number; // Excess return vs benchmark
  trackingError?: number; // Deviation from benchmark
  informationRatio?: number; // Alpha / tracking error
}

/**
 * Asset statistics
 */
export interface AssetStats {
  name: string;
  returns: number[]; // Historical returns (periodic)
  expectedReturn: number; // Mean return
  volatility: number; // Standard deviation
  sharpeRatio: number;
}

/**
 * Calculate basic statistics from return series
 */
export function calculateStats(
  returns: number[],
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252 // Daily = 252, Monthly = 12, Weekly = 52
): {
  mean: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
} {
  const n = returns.length;
  if (n === 0) throw new Error('Empty returns array');

  // Mean return
  const mean = returns.reduce((sum, r) => sum + r, 0) / n;

  // Volatility (standard deviation)
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (n - 1);
  const volatility = Math.sqrt(variance);

  // Annualize
  const annualizedReturn = mean * periodsPerYear;
  const annualizedVol = volatility * Math.sqrt(periodsPerYear);
  const annualizedRF = riskFreeRate;

  // Sharpe Ratio
  const sharpeRatio = annualizedVol > 0 ? (annualizedReturn - annualizedRF) / annualizedVol : 0;

  // Sortino Ratio (only downside volatility)
  const downsideReturns = returns.filter((r) => r < 0);
  const downsideVariance =
    downsideReturns.length > 0
      ? downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length
      : 0;
  const downsideVol = Math.sqrt(downsideVariance) * Math.sqrt(periodsPerYear);
  const sortinoRatio = downsideVol > 0 ? (annualizedReturn - annualizedRF) / downsideVol : 0;

  // Maximum Drawdown
  let maxDrawdown = 0;
  let peak = 1.0;
  let cumulative = 1.0;
  for (const r of returns) {
    cumulative *= 1 + r;
    if (cumulative > peak) peak = cumulative;
    const drawdown = (peak - cumulative) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Calmar Ratio (return / max drawdown)
  const calmarRatio = maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0;

  return {
    mean: annualizedReturn,
    volatility: annualizedVol,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    calmarRatio,
  };
}

/**
 * Calculate covariance matrix from returns
 */
export function covarianceMatrix(returns: number[][]): number[][] {
  const n = returns.length; // Number of assets
  const T = returns[0].length; // Number of periods

  // Calculate means
  const means = returns.map((assetReturns) => {
    return assetReturns.reduce((sum, r) => sum + r, 0) / T;
  });

  // Calculate covariance matrix
  const cov: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let t = 0; t < T; t++) {
        sum += (returns[i][t] - means[i]) * (returns[j][t] - means[j]);
      }
      cov[i][j] = sum / (T - 1);
    }
  }

  return cov;
}

/**
 * Calculate correlation matrix from returns
 */
export function correlationMatrix(returns: number[][]): number[][] {
  const cov = covarianceMatrix(returns);
  const n = cov.length;
  const corr: number[][] = Array(n)
    .fill(0)
    .map(() => Array(n).fill(0));

  // Standard deviations
  const stdDevs = cov.map((row, i) => Math.sqrt(row[i]));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (stdDevs[i] > 0 && stdDevs[j] > 0) {
        corr[i][j] = cov[i][j] / (stdDevs[i] * stdDevs[j]);
      } else {
        corr[i][j] = i === j ? 1 : 0;
      }
    }
  }

  return corr;
}

/**
 * Portfolio variance given weights and covariance matrix
 */
export function portfolioVariance(weights: number[], covMatrix: number[][]): number {
  const n = weights.length;
  let variance = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      variance += weights[i] * weights[j] * covMatrix[i][j];
    }
  }

  return variance;
}

/**
 * Portfolio expected return
 */
export function portfolioReturn(weights: number[], expectedReturns: number[]): number {
  return weights.reduce((sum, w, i) => sum + w * expectedReturns[i], 0);
}

/**
 * Efficient Frontier Generation (Monte Carlo method)
 *
 * Generates random portfolios to approximate the efficient frontier.
 * For exact optimization, use quadratic programming (not implemented here).
 *
 * @param returns - Matrix of asset returns [assets][periods]
 * @param numPortfolios - Number of random portfolios to generate
 * @param riskFreeRate - Annual risk-free rate
 * @param periodsPerYear - 252 for daily, 12 for monthly
 * @returns Array of portfolios on efficient frontier
 */
export function efficientFrontier(
  returns: number[][],
  numPortfolios: number = 10000,
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252
): Portfolio[] {
  const numAssets = returns.length;
  const T = returns[0].length;

  // Calculate expected returns and covariance
  const expectedReturns = returns.map((assetReturns) => {
    const mean = assetReturns.reduce((sum, r) => sum + r, 0) / T;
    return mean * periodsPerYear; // Annualize
  });

  const cov = covarianceMatrix(returns);
  // Annualize covariance matrix
  const annualizedCov = cov.map((row) => row.map((val) => val * periodsPerYear));

  const portfolios: Portfolio[] = [];

  // Generate random portfolios
  for (let p = 0; p < numPortfolios; p++) {
    // Random weights using Dirichlet distribution (ensures sum = 1)
    const raw = Array(numAssets)
      .fill(0)
      .map(() => -Math.log(Math.random()));
    const sum = raw.reduce((s, v) => s + v, 0);
    const weights = raw.map((v) => v / sum);

    const expectedReturn = portfolioReturn(weights, expectedReturns);
    const variance = portfolioVariance(weights, annualizedCov);
    const volatility = Math.sqrt(variance);
    const sharpeRatio = volatility > 0 ? (expectedReturn - riskFreeRate) / volatility : 0;

    portfolios.push({
      weights,
      expectedReturn,
      volatility,
      sharpeRatio,
    });
  }

  // Sort by Sharpe ratio (best portfolios)
  portfolios.sort((a, b) => b.sharpeRatio - a.sharpeRatio);

  return portfolios;
}

/**
 * Minimum Variance Portfolio
 *
 * Finds the portfolio with the lowest volatility.
 * Uses simplified analytical solution (equal weighted as approximation).
 * For exact solution, use quadratic programming.
 */
export function minimumVariancePortfolio(
  returns: number[][],
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252
): Portfolio {
  const numAssets = returns.length;
  const T = returns[0].length;

  // Calculate expected returns and covariance
  const expectedReturns = returns.map((assetReturns) => {
    const mean = assetReturns.reduce((sum, r) => sum + r, 0) / T;
    return mean * periodsPerYear;
  });

  const cov = covarianceMatrix(returns);
  const annualizedCov = cov.map((row) => row.map((val) => val * periodsPerYear));

  // Approximate solution: inverse volatility weighting
  const volatilities = returns.map((assetReturns, i) => {
    return Math.sqrt(annualizedCov[i][i]);
  });

  const invVols = volatilities.map((vol) => (vol > 0 ? 1 / vol : 0));
  const sumInvVols = invVols.reduce((s, v) => s + v, 0);
  const weights = invVols.map((v) => v / sumInvVols);

  const expectedReturn = portfolioReturn(weights, expectedReturns);
  const variance = portfolioVariance(weights, annualizedCov);
  const volatility = Math.sqrt(variance);
  const sharpeRatio = volatility > 0 ? (expectedReturn - riskFreeRate) / volatility : 0;

  return {
    weights,
    expectedReturn,
    volatility,
    sharpeRatio,
  };
}

/**
 * Tangency Portfolio (Maximum Sharpe Ratio)
 *
 * Portfolio on the efficient frontier with the highest Sharpe ratio.
 * Uses Monte Carlo approximation.
 */
export function tangencyPortfolio(
  returns: number[][],
  riskFreeRate: number = 0.03,
  numTrials: number = 50000,
  periodsPerYear: number = 252
): Portfolio {
  const frontier = efficientFrontier(returns, numTrials, riskFreeRate, periodsPerYear);
  // Already sorted by Sharpe ratio
  return frontier[0];
}

/**
 * Risk Parity Portfolio
 *
 * Portfolio where each asset contributes equally to total risk.
 * Iterative approximation.
 */
export function riskParityPortfolio(
  returns: number[][],
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252,
  iterations: number = 100
): Portfolio {
  const numAssets = returns.length;
  const T = returns[0].length;

  // Calculate expected returns and covariance
  const expectedReturns = returns.map((assetReturns) => {
    const mean = assetReturns.reduce((sum, r) => sum + r, 0) / T;
    return mean * periodsPerYear;
  });

  const cov = covarianceMatrix(returns);
  const annualizedCov = cov.map((row) => row.map((val) => val * periodsPerYear));

  // Initial guess: equal weights
  let weights = Array(numAssets).fill(1 / numAssets);

  // Iterative adjustment
  for (let iter = 0; iter < iterations; iter++) {
    // Calculate marginal risk contribution for each asset
    const portfolioVol = Math.sqrt(portfolioVariance(weights, annualizedCov));
    const marginalContributions = weights.map((w, i) => {
      let contribution = 0;
      for (let j = 0; j < numAssets; j++) {
        contribution += weights[j] * annualizedCov[i][j];
      }
      return (w * contribution) / portfolioVol;
    });

    // Adjust weights inversely to risk contribution
    const targetContribution = 1 / numAssets;
    const adjustments = marginalContributions.map((mc) => {
      return mc > 0 ? targetContribution / mc : 1;
    });

    weights = weights.map((w, i) => w * adjustments[i]);

    // Normalize
    const sum = weights.reduce((s, w) => s + w, 0);
    weights = weights.map((w) => w / sum);
  }

  const expectedReturn = portfolioReturn(weights, expectedReturns);
  const variance = portfolioVariance(weights, annualizedCov);
  const volatility = Math.sqrt(variance);
  const sharpeRatio = volatility > 0 ? (expectedReturn - riskFreeRate) / volatility : 0;

  return {
    weights,
    expectedReturn,
    volatility,
    sharpeRatio,
  };
}

/**
 * Equal Weight Portfolio (1/N)
 */
export function equalWeightPortfolio(
  returns: number[][],
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252
): Portfolio {
  const numAssets = returns.length;
  const T = returns[0].length;

  const weights = Array(numAssets).fill(1 / numAssets);

  const expectedReturns = returns.map((assetReturns) => {
    const mean = assetReturns.reduce((sum, r) => sum + r, 0) / T;
    return mean * periodsPerYear;
  });

  const cov = covarianceMatrix(returns);
  const annualizedCov = cov.map((row) => row.map((val) => val * periodsPerYear));

  const expectedReturn = portfolioReturn(weights, expectedReturns);
  const variance = portfolioVariance(weights, annualizedCov);
  const volatility = Math.sqrt(variance);
  const sharpeRatio = volatility > 0 ? (expectedReturn - riskFreeRate) / volatility : 0;

  return {
    weights,
    expectedReturn,
    volatility,
    sharpeRatio,
  };
}

/**
 * Calculate Beta (systematic risk vs benchmark)
 */
export function calculateBeta(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  if (n === 0) return 1.0;

  const portfolioMean = portfolioReturns.slice(0, n).reduce((s, r) => s + r, 0) / n;
  const benchmarkMean = benchmarkReturns.slice(0, n).reduce((s, r) => s + r, 0) / n;

  let covariance = 0;
  let benchmarkVariance = 0;

  for (let i = 0; i < n; i++) {
    const pDiff = portfolioReturns[i] - portfolioMean;
    const bDiff = benchmarkReturns[i] - benchmarkMean;
    covariance += pDiff * bDiff;
    benchmarkVariance += bDiff * bDiff;
  }

  covariance /= n - 1;
  benchmarkVariance /= n - 1;

  return benchmarkVariance > 0 ? covariance / benchmarkVariance : 1.0;
}

/**
 * Calculate Alpha (excess return vs benchmark)
 */
export function calculateAlpha(
  portfolioReturn: number,
  benchmarkReturn: number,
  beta: number,
  riskFreeRate: number
): number {
  // Jensen's Alpha: α = R_p - [R_f + β(R_m - R_f)]
  return portfolioReturn - (riskFreeRate + beta * (benchmarkReturn - riskFreeRate));
}

/**
 * Calculate Tracking Error (deviation from benchmark)
 */
export function calculateTrackingError(
  portfolioReturns: number[],
  benchmarkReturns: number[],
  periodsPerYear: number = 252
): number {
  const n = Math.min(portfolioReturns.length, benchmarkReturns.length);
  if (n === 0) return 0;

  const differences = portfolioReturns
    .slice(0, n)
    .map((r, i) => r - benchmarkReturns[i]);

  const mean = differences.reduce((s, d) => s + d, 0) / n;
  const variance = differences.reduce((s, d) => s + Math.pow(d - mean, 2), 0) / (n - 1);

  return Math.sqrt(variance * periodsPerYear);
}

/**
 * Calculate Information Ratio (alpha / tracking error)
 */
export function calculateInformationRatio(
  alpha: number,
  trackingError: number
): number {
  return trackingError > 0 ? alpha / trackingError : 0;
}

/**
 * Full portfolio analysis with benchmark comparison
 */
export function analyzePortfolio(
  portfolioReturns: number[],
  benchmarkReturns: number[],
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252
): Portfolio {
  const stats = calculateStats(portfolioReturns, riskFreeRate, periodsPerYear);
  const beta = calculateBeta(portfolioReturns, benchmarkReturns);

  const benchmarkStats = calculateStats(benchmarkReturns, riskFreeRate, periodsPerYear);
  const alpha = calculateAlpha(stats.mean, benchmarkStats.mean, beta, riskFreeRate);

  const trackingError = calculateTrackingError(
    portfolioReturns,
    benchmarkReturns,
    periodsPerYear
  );
  const informationRatio = calculateInformationRatio(alpha, trackingError);

  return {
    weights: [], // Not applicable for historical analysis
    expectedReturn: stats.mean,
    volatility: stats.volatility,
    sharpeRatio: stats.sharpeRatio,
    sortinoRatio: stats.sortinoRatio,
    calmarRatio: stats.calmarRatio,
    maxDrawdown: stats.maxDrawdown,
    beta,
    alpha,
    trackingError,
    informationRatio,
  };
}

/**
 * Portfolio rebalancing simulation
 */
export interface RebalancingResult {
  portfolios: Portfolio[];
  cumulativeReturns: number[];
  dates: Date[];
  turnover: number[]; // Trading turnover at each rebalance
}

export function simulateRebalancing(
  returns: number[][], // [assets][periods]
  weights: number[], // Target weights
  rebalancePeriods: number = 21, // Rebalance every 21 days (monthly)
  transactionCost: number = 0.001, // 0.1% per trade
  riskFreeRate: number = 0.03,
  periodsPerYear: number = 252
): RebalancingResult {
  const numAssets = returns.length;
  const T = returns[0].length;

  let currentWeights = [...weights];
  const portfolios: Portfolio[] = [];
  const cumulativeReturns: number[] = [1.0];
  const dates: Date[] = [new Date()];
  const turnover: number[] = [0];

  for (let t = 0; t < T; t++) {
    // Apply returns for this period
    const periodReturn = currentWeights.reduce((sum, w, i) => sum + w * returns[i][t], 0);

    // Update portfolio value and weights (drift)
    const newValues = currentWeights.map((w, i) => w * (1 + returns[i][t]));
    const totalValue = newValues.reduce((sum, v) => sum + v, 0);
    currentWeights = newValues.map((v) => v / totalValue);

    // Cumulative return
    const newCumulative = cumulativeReturns[cumulativeReturns.length - 1] * (1 + periodReturn);
    cumulativeReturns.push(newCumulative);

    // Rebalance if needed
    if (t % rebalancePeriods === 0 && t > 0) {
      // Calculate turnover
      const turnoverAmount = currentWeights.reduce(
        (sum, w, i) => sum + Math.abs(w - weights[i]),
        0
      );
      turnover.push(turnoverAmount);

      // Apply transaction cost
      const cost = turnoverAmount * transactionCost;
      cumulativeReturns[cumulativeReturns.length - 1] *= 1 - cost;

      // Rebalance to target weights
      currentWeights = [...weights];
    } else {
      turnover.push(0);
    }

    // Record date
    const date = new Date();
    date.setDate(date.getDate() + t);
    dates.push(date);
  }

  return {
    portfolios,
    cumulativeReturns,
    dates,
    turnover,
  };
}

/**
 * Example portfolios for testing
 */
export const EXAMPLE_PORTFOLIOS = {
  conservative: {
    name: 'Conservative (60/40)',
    description: '60% Bonds, 40% Stocks',
    weights: [0.6, 0.4],
    assetNames: ['Bonds', 'Stocks'],
  },
  balanced: {
    name: 'Balanced',
    description: '40% Bonds, 60% Stocks',
    weights: [0.4, 0.6],
    assetNames: ['Bonds', 'Stocks'],
  },
  aggressive: {
    name: 'Aggressive (80/20)',
    description: '20% Bonds, 80% Stocks',
    weights: [0.2, 0.8],
    assetNames: ['Bonds', 'Stocks'],
  },
  allWeather: {
    name: 'All Weather (Ray Dalio)',
    description: '30% Stocks, 40% Long-term Bonds, 15% Intermediate Bonds, 7.5% Gold, 7.5% Commodities',
    weights: [0.3, 0.4, 0.15, 0.075, 0.075],
    assetNames: ['Stocks', 'LT Bonds', 'IT Bonds', 'Gold', 'Commodities'],
  },
};
