/**
 * Black-Scholes Option Pricing Model
 * Nobel Prize 1997 (Myron Scholes, Robert Merton)
 *
 * Assumptions:
 * - European-style options (exercise only at expiry)
 * - No dividends (or continuous dividend yield)
 * - Constant risk-free rate and volatility
 * - Log-normal asset price distribution
 * - No transaction costs or taxes
 * - Continuous trading
 */

/**
 * Standard normal cumulative distribution function
 * Approximation using Hart's algorithm (error < 7.5e-8)
 */
function normalCDF(x: number): number {
  const a1 = 0.31938153;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const k = 1.0 / (1.0 + 0.2316419 * Math.abs(x));
  const w =
    1.0 -
    (1.0 / Math.sqrt(2.0 * Math.PI)) *
      Math.exp(-0.5 * x * x) *
      (a1 * k +
        a2 * k * k +
        a3 * k * k * k +
        a4 * k * k * k * k +
        a5 * k * k * k * k * k);

  return x < 0 ? 1.0 - w : w;
}

/**
 * Standard normal probability density function
 */
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2.0 * Math.PI);
}

/**
 * Greeks (sensitivities)
 */
export interface Greeks {
  delta: number; // ∂V/∂S - Change in option price per $1 change in underlying
  gamma: number; // ∂²V/∂S² - Rate of change of delta
  vega: number; // ∂V/∂σ - Change in option price per 1% change in volatility
  theta: number; // ∂V/∂t - Time decay (per day)
  rho: number; // ∂V/∂r - Change in option price per 1% change in interest rate
}

/**
 * Option pricing result
 */
export interface OptionPriceResult {
  call: number;
  put: number;
  callGreeks: Greeks;
  putGreeks: Greeks;
  d1: number;
  d2: number;
  intrinsicValueCall: number;
  intrinsicValuePut: number;
  timeValueCall: number;
  timeValuePut: number;
}

/**
 * Black-Scholes formula for European options
 *
 * @param S - Current stock price
 * @param K - Strike price
 * @param T - Time to expiration (in years)
 * @param r - Risk-free interest rate (annual, as decimal, e.g., 0.05 for 5%)
 * @param sigma - Volatility (annual, as decimal, e.g., 0.25 for 25%)
 * @param q - Continuous dividend yield (optional, default 0)
 * @returns Option prices and Greeks
 */
export function blackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  q: number = 0
): OptionPriceResult {
  // Validate inputs
  if (S <= 0) throw new Error('Stock price must be positive');
  if (K <= 0) throw new Error('Strike price must be positive');
  if (T <= 0) throw new Error('Time to expiration must be positive');
  if (sigma <= 0) throw new Error('Volatility must be positive');

  // Calculate d1 and d2
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  // Call and Put prices
  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const Nmd1 = normalCDF(-d1);
  const Nmd2 = normalCDF(-d2);

  const discountFactor = Math.exp(-r * T);
  const dividendFactor = Math.exp(-q * T);

  const callPrice = S * dividendFactor * Nd1 - K * discountFactor * Nd2;
  const putPrice = K * discountFactor * Nmd2 - S * dividendFactor * Nmd1;

  // Intrinsic values
  const intrinsicValueCall = Math.max(S - K, 0);
  const intrinsicValuePut = Math.max(K - S, 0);

  // Time values
  const timeValueCall = callPrice - intrinsicValueCall;
  const timeValuePut = putPrice - intrinsicValuePut;

  // Greeks
  const nd1 = normalPDF(d1);

  // Call Greeks
  const callDelta = dividendFactor * Nd1;
  const callGamma = (dividendFactor * nd1) / (S * sigma * sqrtT);
  const callVega = S * dividendFactor * nd1 * sqrtT / 100; // per 1% change
  const callTheta =
    (-((S * nd1 * sigma * dividendFactor) / (2 * sqrtT)) -
      r * K * discountFactor * Nd2 +
      q * S * dividendFactor * Nd1) /
    365; // per day
  const callRho = (K * T * discountFactor * Nd2) / 100; // per 1% change

  // Put Greeks
  const putDelta = dividendFactor * (Nd1 - 1);
  const putGamma = callGamma; // Gamma is same for call and put
  const putVega = callVega; // Vega is same for call and put
  const putTheta =
    (-((S * nd1 * sigma * dividendFactor) / (2 * sqrtT)) +
      r * K * discountFactor * Nmd2 -
      q * S * dividendFactor * Nmd1) /
    365; // per day
  const putRho = (-K * T * discountFactor * Nmd2) / 100; // per 1% change

  return {
    call: callPrice,
    put: putPrice,
    callGreeks: {
      delta: callDelta,
      gamma: callGamma,
      vega: callVega,
      theta: callTheta,
      rho: callRho,
    },
    putGreeks: {
      delta: putDelta,
      gamma: putGamma,
      vega: putVega,
      theta: putTheta,
      rho: putRho,
    },
    d1,
    d2,
    intrinsicValueCall,
    intrinsicValuePut,
    timeValueCall,
    timeValuePut,
  };
}

/**
 * Implied Volatility using Newton-Raphson method
 *
 * @param marketPrice - Observed market price of the option
 * @param S - Current stock price
 * @param K - Strike price
 * @param T - Time to expiration (in years)
 * @param r - Risk-free interest rate
 * @param optionType - 'call' or 'put'
 * @param q - Continuous dividend yield (optional)
 * @returns Implied volatility (as decimal)
 */
export function impliedVolatility(
  marketPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  optionType: 'call' | 'put',
  q: number = 0
): number {
  // Initial guess: ATM implied vol ~= sqrt(2π / T) * (price / S)
  let sigma = Math.sqrt(2 * Math.PI / T) * (marketPrice / S);
  sigma = Math.max(0.01, Math.min(sigma, 5.0)); // Clamp between 1% and 500%

  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    try {
      const result = blackScholes(S, K, T, r, sigma, q);
      const price = optionType === 'call' ? result.call : result.put;
      const vega = optionType === 'call' ? result.callGreeks.vega : result.putGreeks.vega;

      const diff = price - marketPrice;

      // Check convergence
      if (Math.abs(diff) < tolerance) {
        return sigma;
      }

      // Newton-Raphson update: σ_new = σ_old - f(σ) / f'(σ)
      // f(σ) = BS_price(σ) - market_price
      // f'(σ) = vega
      if (vega === 0) {
        throw new Error('Vega is zero, cannot converge');
      }

      sigma = sigma - diff / (vega * 100); // vega is per 1% change

      // Prevent negative or extreme volatilities
      sigma = Math.max(0.01, Math.min(sigma, 5.0));
    } catch (e) {
      // If calculation fails, try a different starting point
      sigma = 0.5;
    }
  }

  throw new Error('Implied volatility did not converge');
}

/**
 * Put-Call Parity check
 * European options: C - P = S * e^(-qT) - K * e^(-rT)
 *
 * @returns Difference (should be ~0 for correct pricing)
 */
export function putCallParity(
  callPrice: number,
  putPrice: number,
  S: number,
  K: number,
  T: number,
  r: number,
  q: number = 0
): number {
  const lhs = callPrice - putPrice;
  const rhs = S * Math.exp(-q * T) - K * Math.exp(-r * T);
  return Math.abs(lhs - rhs);
}

/**
 * Classify option moneyness
 */
export function getMoneyness(S: number, K: number): 'ITM' | 'ATM' | 'OTM' {
  const ratio = S / K;
  if (Math.abs(ratio - 1) < 0.02) return 'ATM'; // Within 2% of ATM
  return ratio > 1 ? 'ITM' : 'OTM';
}

/**
 * Interpret Greeks for user
 */
export function interpretGreeks(greeks: Greeks, optionType: 'call' | 'put'): {
  delta: string;
  gamma: string;
  vega: string;
  theta: string;
  rho: string;
} {
  return {
    delta:
      optionType === 'call'
        ? `${(greeks.delta * 100).toFixed(1)}% of stock movement`
        : `${(Math.abs(greeks.delta) * 100).toFixed(1)}% of stock movement (inverse)`,
    gamma: `Delta changes by ${greeks.gamma.toFixed(4)} per $1 stock move`,
    vega: `Option price changes by $${greeks.vega.toFixed(3)} per 1% volatility change`,
    theta: `Option loses $${Math.abs(greeks.theta).toFixed(3)} per day (time decay)`,
    rho: `Option price changes by $${greeks.rho.toFixed(3)} per 1% rate change`,
  };
}

/**
 * Calculate break-even points
 */
export function calculateBreakEven(
  K: number,
  premium: number,
  optionType: 'call' | 'put'
): number {
  return optionType === 'call' ? K + premium : K - premium;
}

/**
 * Maximum profit and loss
 */
export function maxProfitLoss(
  K: number,
  premium: number,
  position: 'long' | 'short',
  optionType: 'call' | 'put'
): { maxProfit: number | string; maxLoss: number } {
  if (position === 'long') {
    if (optionType === 'call') {
      return {
        maxProfit: 'Unlimited',
        maxLoss: premium,
      };
    } else {
      return {
        maxProfit: K - premium,
        maxLoss: premium,
      };
    }
  } else {
    // short position
    if (optionType === 'call') {
      return {
        maxProfit: premium,
        maxLoss: Infinity, // Unlimited loss
      };
    } else {
      return {
        maxProfit: premium,
        maxLoss: K - premium,
      };
    }
  }
}

/**
 * Generate option chain (multiple strikes)
 */
export interface OptionChainEntry {
  strike: number;
  call: number;
  put: number;
  callIV: number;
  putIV: number;
  callDelta: number;
  putDelta: number;
  moneyness: 'ITM' | 'ATM' | 'OTM';
}

export function generateOptionChain(
  S: number,
  strikes: number[],
  T: number,
  r: number,
  sigma: number,
  q: number = 0
): OptionChainEntry[] {
  return strikes.map((K) => {
    const result = blackScholes(S, K, T, r, sigma, q);
    return {
      strike: K,
      call: result.call,
      put: result.put,
      callIV: sigma,
      putIV: sigma,
      callDelta: result.callGreeks.delta,
      putDelta: result.putGreeks.delta,
      moneyness: getMoneyness(S, K),
    };
  });
}

/**
 * Calculate probability of profit at expiration
 * For call: P(S_T > K + premium)
 * For put: P(S_T < K - premium)
 */
export function probabilityOfProfit(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  premium: number,
  optionType: 'call' | 'put',
  q: number = 0
): number {
  const breakEven = calculateBreakEven(K, premium, optionType);
  const d = (Math.log(S / breakEven) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));

  return optionType === 'call' ? normalCDF(d) : normalCDF(-d);
}

/**
 * Example usage and tests
 */
export const EXAMPLES = {
  atm: {
    description: 'At-the-money Google call option',
    S: 150,
    K: 150,
    T: 0.25, // 3 months
    r: 0.05, // 5%
    sigma: 0.25, // 25%
  },
  itm: {
    description: 'In-the-money Apple put option',
    S: 180,
    K: 200,
    T: 0.5, // 6 months
    r: 0.04,
    sigma: 0.30,
  },
  otm: {
    description: 'Out-of-the-money Tesla call option',
    S: 250,
    K: 300,
    T: 1.0, // 1 year
    r: 0.045,
    sigma: 0.50,
  },
};
