/**
 * Risk Management & Metrics
 *
 * Implements:
 * - Value at Risk (VaR): Historical, Parametric, Monte Carlo
 * - Conditional Value at Risk (CVaR / Expected Shortfall)
 * - Stress Testing & Scenario Analysis
 * - Maximum Drawdown Analysis
 * - Risk Decomposition
 * - Tail Risk Metrics
 * - Correlation Breakdown
 */

/**
 * VaR Result
 */
export interface VaRResult {
  var: number; // Value at Risk (loss threshold)
  cvar: number; // Conditional VaR (expected loss beyond VaR)
  confidenceLevel: number; // e.g., 0.95 for 95%
  horizon: number; // Time horizon in days
  method: 'historical' | 'parametric' | 'monte-carlo';
}

/**
 * Stress Test Result
 */
export interface StressTestResult {
  scenario: string;
  portfolioReturn: number;
  portfolioValue: number; // Final value (starting from 1.0)
  maxDrawdown: number;
  duration: number; // Days to recovery
  assetReturns: { [asset: string]: number };
}

/**
 * Risk Decomposition
 */
export interface RiskDecomposition {
  totalRisk: number; // Portfolio volatility
  contributions: {
    asset: string;
    marginalRisk: number; // Risk per unit of asset
    contribution: number; // Contribution to total risk
    percentage: number; // % of total risk
  }[];
  diversificationBenefit: number; // Sum of individual risks - portfolio risk
}

/**
 * Historical VaR
 *
 * Uses actual historical returns to calculate VaR.
 * Most conservative approach, doesn't assume any distribution.
 */
export function historicalVaR(
  returns: number[],
  confidenceLevel: number = 0.95,
  horizon: number = 1
): VaRResult {
  if (returns.length === 0) throw new Error('Empty returns array');

  // Sort returns (worst to best)
  const sorted = [...returns].sort((a, b) => a - b);
  const n = sorted.length;

  // VaR: (1 - confidence level) quantile
  const index = Math.floor((1 - confidenceLevel) * n);
  const var_ = -sorted[index]; // Positive number for loss

  // CVaR: Average of all returns worse than VaR
  const tailReturns = sorted.slice(0, index + 1);
  const cvar = tailReturns.length > 0 ? -tailReturns.reduce((s, r) => s + r, 0) / tailReturns.length : var_;

  // Scale to horizon (assuming IID)
  const horizonVar = var_ * Math.sqrt(horizon);
  const horizonCVaR = cvar * Math.sqrt(horizon);

  return {
    var: horizonVar,
    cvar: horizonCVaR,
    confidenceLevel,
    horizon,
    method: 'historical',
  };
}

/**
 * Parametric VaR (Variance-Covariance method)
 *
 * Assumes returns follow a normal distribution.
 * Faster but less accurate for fat-tailed distributions.
 */
export function parametricVaR(
  returns: number[],
  confidenceLevel: number = 0.95,
  horizon: number = 1
): VaRResult {
  if (returns.length === 0) throw new Error('Empty returns array');

  const n = returns.length;
  const mean = returns.reduce((s, r) => s + r, 0) / n;
  const variance = returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // Z-score for confidence level
  const zScore = inverseNormalCDF(confidenceLevel);

  // VaR = μ - z * σ (for loss, we negate)
  const var_ = -(mean - zScore * stdDev);

  // CVaR for normal distribution: σ * φ(z) / (1 - Φ(z)) - μ
  const phi = normalPDF(-zScore);
  const cdf = 1 - confidenceLevel;
  const cvar = stdDev * (phi / cdf) - mean;

  // Scale to horizon
  const horizonVar = var_ * Math.sqrt(horizon);
  const horizonCVaR = cvar * Math.sqrt(horizon);

  return {
    var: horizonVar,
    cvar: horizonCVaR,
    confidenceLevel,
    horizon,
    method: 'parametric',
  };
}

/**
 * Monte Carlo VaR
 *
 * Simulates future returns using bootstrapping or fitted distribution.
 * More flexible, can capture non-normal distributions.
 */
export function monteCarloVaR(
  returns: number[],
  numSimulations: number = 10000,
  confidenceLevel: number = 0.95,
  horizon: number = 1
): VaRResult {
  if (returns.length === 0) throw new Error('Empty returns array');

  const n = returns.length;
  const mean = returns.reduce((s, r) => s + r, 0) / n;
  const variance = returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  // Generate simulated returns
  const simulatedReturns: number[] = [];
  for (let i = 0; i < numSimulations; i++) {
    let pathReturn = 0;
    for (let t = 0; t < horizon; t++) {
      // Random draw from normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); // Box-Muller
      const dailyReturn = mean + z * stdDev;
      pathReturn += dailyReturn;
    }
    simulatedReturns.push(pathReturn);
  }

  // Calculate VaR and CVaR from simulations
  const sorted = simulatedReturns.sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * numSimulations);
  const var_ = -sorted[index];

  const tailReturns = sorted.slice(0, index + 1);
  const cvar = tailReturns.length > 0 ? -tailReturns.reduce((s, r) => s + r, 0) / tailReturns.length : var_;

  return {
    var: var_,
    cvar: cvar,
    confidenceLevel,
    horizon,
    method: 'monte-carlo',
  };
}

/**
 * Portfolio VaR (multi-asset)
 */
export function portfolioVaR(
  assetReturns: number[][], // [assets][periods]
  weights: number[],
  confidenceLevel: number = 0.95,
  horizon: number = 1,
  method: 'historical' | 'parametric' | 'monte-carlo' = 'historical'
): VaRResult {
  const numAssets = assetReturns.length;
  const T = assetReturns[0].length;

  // Calculate portfolio returns
  const portfolioReturns: number[] = [];
  for (let t = 0; t < T; t++) {
    let periodReturn = 0;
    for (let i = 0; i < numAssets; i++) {
      periodReturn += weights[i] * assetReturns[i][t];
    }
    portfolioReturns.push(periodReturn);
  }

  // Calculate VaR based on method
  if (method === 'historical') {
    return historicalVaR(portfolioReturns, confidenceLevel, horizon);
  } else if (method === 'parametric') {
    return parametricVaR(portfolioReturns, confidenceLevel, horizon);
  } else {
    return monteCarloVaR(portfolioReturns, 10000, confidenceLevel, horizon);
  }
}

/**
 * Marginal VaR (contribution of each asset to portfolio VaR)
 */
export function marginalVaR(
  assetReturns: number[][], // [assets][periods]
  weights: number[],
  confidenceLevel: number = 0.95
): number[] {
  const numAssets = assetReturns.length;
  const baseVaR = portfolioVaR(assetReturns, weights, confidenceLevel, 1, 'historical');

  const marginals: number[] = [];
  const epsilon = 0.001; // Small perturbation

  for (let i = 0; i < numAssets; i++) {
    // Increase weight slightly
    const perturbedWeights = [...weights];
    perturbedWeights[i] += epsilon;
    // Normalize
    const sum = perturbedWeights.reduce((s, w) => s + w, 0);
    const normalized = perturbedWeights.map((w) => w / sum);

    const perturbedVaR = portfolioVaR(assetReturns, normalized, confidenceLevel, 1, 'historical');

    // Marginal VaR = ΔVaR / Δweight
    const marginal = (perturbedVaR.var - baseVaR.var) / epsilon;
    marginals.push(marginal);
  }

  return marginals;
}

/**
 * Component VaR (contribution of each asset to total VaR)
 */
export function componentVaR(
  assetReturns: number[][], // [assets][periods]
  weights: number[],
  confidenceLevel: number = 0.95
): { componentVaRs: number[]; totalVaR: number } {
  const marginals = marginalVaR(assetReturns, weights, confidenceLevel);
  const totalVaR = portfolioVaR(assetReturns, weights, confidenceLevel, 1, 'historical').var;

  // Component VaR = weight * marginal VaR
  const componentVaRs = weights.map((w, i) => w * marginals[i]);

  return { componentVaRs, totalVaR };
}

/**
 * Maximum Drawdown Analysis
 */
export interface DrawdownAnalysis {
  maxDrawdown: number; // Maximum peak-to-trough decline
  maxDrawdownDuration: number; // Days underwater
  currentDrawdown: number; // Current drawdown
  recoveryTime: number; // Days to recover from max drawdown
  drawdownHistory: { date: number; value: number; drawdown: number }[];
}

export function analyzeDrawdowns(returns: number[]): DrawdownAnalysis {
  let maxDrawdown = 0;
  let maxDrawdownDuration = 0;
  let currentDrawdownDuration = 0;
  let peak = 1.0;
  let cumulative = 1.0;
  let maxDrawdownStart = 0;
  let maxDrawdownEnd = 0;
  let recoveryTime = 0;

  const drawdownHistory: { date: number; value: number; drawdown: number }[] = [];

  for (let t = 0; t < returns.length; t++) {
    cumulative *= 1 + returns[t];

    if (cumulative > peak) {
      peak = cumulative;
      currentDrawdownDuration = 0;
    } else {
      currentDrawdownDuration++;
    }

    const drawdown = (peak - cumulative) / peak;

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownStart = t - currentDrawdownDuration;
      maxDrawdownEnd = t;
    }

    if (drawdown > 0) {
      maxDrawdownDuration = Math.max(maxDrawdownDuration, currentDrawdownDuration);
    }

    drawdownHistory.push({
      date: t,
      value: cumulative,
      drawdown,
    });
  }

  // Calculate recovery time
  if (maxDrawdownEnd < returns.length - 1) {
    for (let t = maxDrawdownEnd + 1; t < returns.length; t++) {
      if (drawdownHistory[t].drawdown === 0) {
        recoveryTime = t - maxDrawdownEnd;
        break;
      }
    }
  }

  const currentDrawdown = drawdownHistory[drawdownHistory.length - 1]?.drawdown || 0;

  return {
    maxDrawdown,
    maxDrawdownDuration,
    currentDrawdown,
    recoveryTime,
    drawdownHistory,
  };
}

/**
 * Stress Testing: Apply specific scenarios
 */
export function stressTest(
  assetReturns: number[][], // [assets][periods]
  weights: number[],
  assetNames: string[],
  scenario: {
    name: string;
    shocks: number[]; // Return shocks for each asset
    duration?: number; // Days (default 1)
  }
): StressTestResult {
  const numAssets = assetReturns.length;
  const duration = scenario.duration || 1;

  // Calculate portfolio return under stress
  let portfolioReturn = 0;
  const assetShocks: { [asset: string]: number } = {};

  for (let i = 0; i < numAssets; i++) {
    const shock = scenario.shocks[i] || 0;
    portfolioReturn += weights[i] * shock;
    assetShocks[assetNames[i]] = shock;
  }

  // Simulate cumulative impact
  const simulatedReturns = Array(duration).fill(portfolioReturn / duration);
  const drawdownAnalysis = analyzeDrawdowns(simulatedReturns);

  return {
    scenario: scenario.name,
    portfolioReturn,
    portfolioValue: 1 + portfolioReturn,
    maxDrawdown: drawdownAnalysis.maxDrawdown,
    duration: drawdownAnalysis.maxDrawdownDuration,
    assetReturns: assetShocks,
  };
}

/**
 * Predefined Stress Scenarios
 */
export const STRESS_SCENARIOS = {
  '2008-financial-crisis': {
    name: '2008 Financial Crisis',
    shocks: [-0.50, -0.40, -0.30, -0.15, 0.05], // Stocks, REITs, Corp Bonds, Govt Bonds, Gold
    duration: 252, // 1 year
  },
  '2020-covid-crash': {
    name: '2020 COVID-19 Crash',
    shocks: [-0.35, -0.30, -0.20, 0.10, 0.05],
    duration: 30, // 1 month rapid crash
  },
  '1987-black-monday': {
    name: '1987 Black Monday',
    shocks: [-0.22, -0.18, -0.10, 0.05, 0.02],
    duration: 1, // Single day
  },
  '2022-inflation-shock': {
    name: '2022 Inflation Shock',
    shocks: [-0.20, -0.25, -0.15, -0.12, 0.15],
    duration: 252,
  },
  'dot-com-bubble': {
    name: '2000 Dot-com Bubble',
    shocks: [-0.45, -0.20, -0.10, 0.08, -0.05],
    duration: 504, // 2 years
  },
  'interest-rate-spike': {
    name: 'Interest Rate Spike (+300bps)',
    shocks: [-0.15, -0.30, -0.20, -0.18, 0.02],
    duration: 63, // 3 months
  },
  'geopolitical-crisis': {
    name: 'Geopolitical Crisis',
    shocks: [-0.25, -0.20, -0.15, 0.05, 0.15],
    duration: 21, // 1 month
  },
};

/**
 * Tail Risk Metrics
 */
export interface TailRiskMetrics {
  skewness: number; // Asymmetry (-: left tail, +: right tail)
  kurtosis: number; // Tail fatness (>3: fat tails)
  excessKurtosis: number; // Kurtosis - 3
  tailRatio: number; // Right tail / Left tail
}

export function calculateTailRisk(returns: number[]): TailRiskMetrics {
  const n = returns.length;
  if (n < 4) throw new Error('Need at least 4 returns for tail risk calculation');

  const mean = returns.reduce((s, r) => s + r, 0) / n;
  const variance = returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Skewness: E[(X - μ)³] / σ³
  const skewness =
    returns.reduce((s, r) => s + Math.pow((r - mean) / stdDev, 3), 0) / n;

  // Kurtosis: E[(X - μ)⁴] / σ⁴
  const kurtosis =
    returns.reduce((s, r) => s + Math.pow((r - mean) / stdDev, 4), 0) / n;

  const excessKurtosis = kurtosis - 3;

  // Tail ratio: 95th percentile / 5th percentile
  const sorted = [...returns].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(0.95 * n)];
  const p5 = sorted[Math.floor(0.05 * n)];
  const tailRatio = p5 !== 0 ? Math.abs(p95 / p5) : 0;

  return {
    skewness,
    kurtosis,
    excessKurtosis,
    tailRatio,
  };
}

/**
 * Risk Decomposition (contribution of each asset to portfolio risk)
 */
export function decomposeRisk(
  assetReturns: number[][], // [assets][periods]
  weights: number[],
  assetNames: string[],
  periodsPerYear: number = 252
): RiskDecomposition {
  const numAssets = assetReturns.length;
  const T = assetReturns[0].length;

  // Calculate covariance matrix
  const means = assetReturns.map((returns) => {
    return returns.reduce((s, r) => s + r, 0) / T;
  });

  const cov: number[][] = Array(numAssets)
    .fill(0)
    .map(() => Array(numAssets).fill(0));

  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      let sum = 0;
      for (let t = 0; t < T; t++) {
        sum += (assetReturns[i][t] - means[i]) * (assetReturns[j][t] - means[j]);
      }
      cov[i][j] = (sum / (T - 1)) * periodsPerYear; // Annualize
    }
  }

  // Portfolio variance
  let portfolioVariance = 0;
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      portfolioVariance += weights[i] * weights[j] * cov[i][j];
    }
  }
  const totalRisk = Math.sqrt(portfolioVariance);

  // Marginal risk contribution for each asset
  const contributions = assetNames.map((name, i) => {
    let marginalRisk = 0;
    for (let j = 0; j < numAssets; j++) {
      marginalRisk += weights[j] * cov[i][j];
    }
    marginalRisk /= totalRisk; // ∂σ/∂w_i

    const contribution = weights[i] * marginalRisk;
    const percentage = (contribution / totalRisk) * 100;

    return {
      asset: name,
      marginalRisk,
      contribution,
      percentage,
    };
  });

  // Diversification benefit
  const individualRisks = assetReturns.map((returns, i) => {
    return Math.sqrt(cov[i][i]) * weights[i];
  });
  const sumIndividualRisks = individualRisks.reduce((s, r) => s + r, 0);
  const diversificationBenefit = sumIndividualRisks - totalRisk;

  return {
    totalRisk,
    contributions,
    diversificationBenefit,
  };
}

/**
 * Correlation Breakdown (rolling correlation)
 */
export function rollingCorrelation(
  returns1: number[],
  returns2: number[],
  window: number = 60
): number[] {
  const correlations: number[] = [];

  for (let i = window; i <= returns1.length; i++) {
    const slice1 = returns1.slice(i - window, i);
    const slice2 = returns2.slice(i - window, i);

    const mean1 = slice1.reduce((s, r) => s + r, 0) / window;
    const mean2 = slice2.reduce((s, r) => s + r, 0) / window;

    let covariance = 0;
    let var1 = 0;
    let var2 = 0;

    for (let j = 0; j < window; j++) {
      const diff1 = slice1[j] - mean1;
      const diff2 = slice2[j] - mean2;
      covariance += diff1 * diff2;
      var1 += diff1 * diff1;
      var2 += diff2 * diff2;
    }

    const correlation = Math.sqrt(var1 * var2) > 0 ? covariance / Math.sqrt(var1 * var2) : 0;
    correlations.push(correlation);
  }

  return correlations;
}

// Helper functions

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function inverseNormalCDF(p: number): number {
  // Approximation using Beasley-Springer-Moro algorithm
  const a = [2.50662823884, -18.61500062529, 41.39119773534, -25.44106049637];
  const b = [-8.47351093090, 23.08336743743, -21.06224101826, 3.13082909833];
  const c = [0.3374754822726147, 0.9761690190917186, 0.1607979714918209,
             0.0276438810333863, 0.0038405729373609, 0.0003951896511919,
             0.0000321767881768, 0.0000002888167364, 0.0000003960315187];

  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1');
  }

  const y = p - 0.5;

  if (Math.abs(y) < 0.42) {
    const r = y * y;
    return (
      (y *
        (((a[3] * r + a[2]) * r + a[1]) * r + a[0])) /
      ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1)
    );
  }

  let r = p;
  if (y > 0) r = 1 - p;
  r = Math.log(-Math.log(r));

  let x = c[0];
  for (let i = 1; i < c.length; i++) {
    x += c[i] * Math.pow(r, i);
  }

  if (y < 0) x = -x;
  return x;
}
