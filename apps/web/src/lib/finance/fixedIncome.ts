/**
 * Fixed Income Analytics & Bond Pricing
 *
 * Implements:
 * - Bond pricing (coupon, zero-coupon, floating rate)
 * - Yield to Maturity (YTM) calculation
 * - Duration (Macaulay, Modified)
 * - Convexity
 * - Yield curve construction (Nelson-Siegel, splines)
 * - Credit spread analysis
 * - Bond portfolio immunization
 */

/**
 * Bond characteristics
 */
export interface Bond {
  faceValue: number; // Par value (usually 100 or 1000)
  couponRate: number; // Annual coupon rate (as decimal, e.g., 0.05 for 5%)
  maturity: number; // Years to maturity
  paymentFrequency: number; // Payments per year (1=annual, 2=semi-annual, 4=quarterly, 12=monthly)
  yieldToMaturity?: number; // YTM (as decimal)
  price?: number; // Market price
  creditSpread?: number; // Spread over risk-free rate
  rating?: string; // Credit rating (AAA, AA, A, BBB, etc.)
}

/**
 * Bond analytics result
 */
export interface BondAnalytics {
  price: number;
  yieldToMaturity: number;
  currentYield: number; // Annual coupon / price
  macaulayDuration: number; // Weighted average time to cash flows
  modifiedDuration: number; // Price sensitivity to yield changes
  convexity: number; // Curvature of price-yield relationship
  dv01: number; // Dollar value of 1 basis point (0.01%)
  accruedInterest: number;
  cleanPrice: number; // Price excluding accrued interest
  dirtyPrice: number; // Price including accrued interest
}

/**
 * Yield curve point
 */
export interface YieldCurvePoint {
  maturity: number; // Years
  yield: number; // Yield (as decimal)
  price?: number;
}

/**
 * Bond Price Calculation
 *
 * PV = Σ(C / (1 + y)^t) + F / (1 + y)^T
 * Where:
 * - C = coupon payment
 * - y = yield per period
 * - F = face value
 * - T = number of periods
 */
export function bondPrice(bond: Bond, yieldToMaturity: number): number {
  const { faceValue, couponRate, maturity, paymentFrequency } = bond;

  const periodsPerYear = paymentFrequency;
  const totalPeriods = maturity * periodsPerYear;
  const couponPayment = (faceValue * couponRate) / periodsPerYear;
  const yieldPerPeriod = yieldToMaturity / periodsPerYear;

  if (totalPeriods === 0) return faceValue;

  let price = 0;

  // Present value of coupon payments
  for (let t = 1; t <= totalPeriods; t++) {
    price += couponPayment / Math.pow(1 + yieldPerPeriod, t);
  }

  // Present value of face value
  price += faceValue / Math.pow(1 + yieldPerPeriod, totalPeriods);

  return price;
}

/**
 * Zero-Coupon Bond Price
 */
export function zeroCouponBondPrice(
  faceValue: number,
  maturity: number,
  yieldToMaturity: number
): number {
  return faceValue / Math.pow(1 + yieldToMaturity, maturity);
}

/**
 * Yield to Maturity (YTM) Calculation
 *
 * Solves for y in: Price = Σ(C / (1 + y)^t) + F / (1 + y)^T
 * Uses Newton-Raphson iteration
 */
export function yieldToMaturity(bond: Bond, marketPrice: number): number {
  const { faceValue, couponRate, maturity, paymentFrequency } = bond;

  // Initial guess: current yield
  let ytm = (couponRate * faceValue) / marketPrice;

  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const price = bondPrice(bond, ytm);
    const diff = price - marketPrice;

    if (Math.abs(diff) < tolerance) {
      return ytm;
    }

    // Modified duration for derivative
    const modDuration = modifiedDuration(bond, ytm);
    const derivative = -price * modDuration;

    if (Math.abs(derivative) < 1e-10) {
      throw new Error('YTM calculation failed: derivative too small');
    }

    // Newton-Raphson update
    ytm = ytm - diff / derivative;

    // Prevent negative yields
    ytm = Math.max(ytm, 0.0001);
  }

  throw new Error('YTM calculation did not converge');
}

/**
 * Macaulay Duration
 *
 * Weighted average time to receive cash flows (in years)
 * Duration = Σ(t * PV(CF_t)) / Price
 */
export function macaulayDuration(bond: Bond, yieldToMaturity: number): number {
  const { faceValue, couponRate, maturity, paymentFrequency } = bond;

  const periodsPerYear = paymentFrequency;
  const totalPeriods = maturity * periodsPerYear;
  const couponPayment = (faceValue * couponRate) / periodsPerYear;
  const yieldPerPeriod = yieldToMaturity / periodsPerYear;

  const price = bondPrice(bond, yieldToMaturity);

  let weightedTime = 0;

  // Coupon payments
  for (let t = 1; t <= totalPeriods; t++) {
    const pv = couponPayment / Math.pow(1 + yieldPerPeriod, t);
    const timeInYears = t / periodsPerYear;
    weightedTime += timeInYears * pv;
  }

  // Face value
  const pvFace = faceValue / Math.pow(1 + yieldPerPeriod, totalPeriods);
  weightedTime += maturity * pvFace;

  return weightedTime / price;
}

/**
 * Modified Duration
 *
 * Measures price sensitivity to yield changes
 * ModDuration = MacaulayDuration / (1 + y/k)
 * Where k = payment frequency
 *
 * Price change ≈ -ModDuration × ΔYield × Price
 */
export function modifiedDuration(bond: Bond, yieldToMaturity: number): number {
  const macDuration = macaulayDuration(bond, yieldToMaturity);
  const yieldPerPeriod = yieldToMaturity / bond.paymentFrequency;
  return macDuration / (1 + yieldPerPeriod);
}

/**
 * Convexity
 *
 * Measures curvature of price-yield relationship (second derivative)
 * Used for more accurate price change estimation
 *
 * ΔPrice/Price ≈ -ModDuration × ΔYield + 0.5 × Convexity × (ΔYield)²
 */
export function convexity(bond: Bond, yieldToMaturity: number): number {
  const { faceValue, couponRate, maturity, paymentFrequency } = bond;

  const periodsPerYear = paymentFrequency;
  const totalPeriods = maturity * periodsPerYear;
  const couponPayment = (faceValue * couponRate) / periodsPerYear;
  const yieldPerPeriod = yieldToMaturity / periodsPerYear;

  const price = bondPrice(bond, yieldToMaturity);

  let convexitySum = 0;

  // Coupon payments
  for (let t = 1; t <= totalPeriods; t++) {
    const pv = couponPayment / Math.pow(1 + yieldPerPeriod, t);
    convexitySum += pv * t * (t + 1);
  }

  // Face value
  const pvFace = faceValue / Math.pow(1 + yieldPerPeriod, totalPeriods);
  convexitySum += pvFace * totalPeriods * (totalPeriods + 1);

  const conv = convexitySum / (price * Math.pow(1 + yieldPerPeriod, 2));

  // Convert to annual convexity
  return conv / Math.pow(periodsPerYear, 2);
}

/**
 * DV01 (Dollar Value of 1 Basis Point)
 *
 * Change in bond price for a 1 basis point (0.01%) change in yield
 */
export function dv01(bond: Bond, yieldToMaturity: number): number {
  const price = bondPrice(bond, yieldToMaturity);
  const modDur = modifiedDuration(bond, yieldToMaturity);
  return price * modDur * 0.0001; // 0.0001 = 1 basis point
}

/**
 * Accrued Interest
 *
 * Interest accumulated since last coupon payment
 */
export function accruedInterest(
  bond: Bond,
  daysSinceLastCoupon: number,
  daysInCouponPeriod: number
): number {
  const annualCoupon = bond.faceValue * bond.couponRate;
  const couponPayment = annualCoupon / bond.paymentFrequency;
  return couponPayment * (daysSinceLastCoupon / daysInCouponPeriod);
}

/**
 * Full Bond Analytics
 */
export function analyzeBond(
  bond: Bond,
  marketPrice?: number,
  daysSinceLastCoupon: number = 0,
  daysInCouponPeriod: number = 180
): BondAnalytics {
  // Determine YTM and price
  let ytm: number;
  let price: number;

  if (marketPrice !== undefined) {
    price = marketPrice;
    ytm = yieldToMaturity(bond, marketPrice);
  } else if (bond.yieldToMaturity !== undefined) {
    ytm = bond.yieldToMaturity;
    price = bondPrice(bond, ytm);
  } else {
    throw new Error('Either marketPrice or yieldToMaturity must be provided');
  }

  const currentYield = (bond.couponRate * bond.faceValue) / price;
  const macDuration = macaulayDuration(bond, ytm);
  const modDuration = modifiedDuration(bond, ytm);
  const conv = convexity(bond, ytm);
  const dv = dv01(bond, ytm);
  const accrued = accruedInterest(bond, daysSinceLastCoupon, daysInCouponPeriod);

  return {
    price,
    yieldToMaturity: ytm,
    currentYield,
    macaulayDuration: macDuration,
    modifiedDuration: modDuration,
    convexity: conv,
    dv01: dv,
    accruedInterest: accrued,
    cleanPrice: price - accrued,
    dirtyPrice: price + accrued,
  };
}

/**
 * Estimate price change using duration and convexity
 */
export function estimatePriceChange(
  bond: Bond,
  currentYield: number,
  yieldChange: number
): {
  durationEffect: number;
  convexityEffect: number;
  totalChange: number;
  newPrice: number;
} {
  const currentPrice = bondPrice(bond, currentYield);
  const modDur = modifiedDuration(bond, currentYield);
  const conv = convexity(bond, currentYield);

  // ΔP/P ≈ -ModDuration × ΔY + 0.5 × Convexity × (ΔY)²
  const durationEffect = -modDur * yieldChange;
  const convexityEffect = 0.5 * conv * yieldChange * yieldChange;
  const totalChange = durationEffect + convexityEffect;

  const newPrice = currentPrice * (1 + totalChange);

  return {
    durationEffect,
    convexityEffect,
    totalChange,
    newPrice,
  };
}

/**
 * Nelson-Siegel Yield Curve Model
 *
 * y(τ) = β₀ + β₁[(1 - e^(-τ/λ))/(τ/λ)] + β₂[(1 - e^(-τ/λ))/(τ/λ) - e^(-τ/λ)]
 *
 * Where:
 * - τ = time to maturity
 * - β₀ = long-term rate
 * - β₁ = short-term component
 * - β₂ = medium-term component
 * - λ = decay parameter
 */
export interface NelsonSiegelParameters {
  beta0: number; // Long-term level
  beta1: number; // Short-term component
  beta2: number; // Medium-term component
  lambda: number; // Decay factor
}

export function nelsonSiegelYield(
  maturity: number,
  params: NelsonSiegelParameters
): number {
  const { beta0, beta1, beta2, lambda } = params;
  const tau = maturity;

  if (tau === 0) return beta0 + beta1;

  const expTerm = Math.exp(-tau / lambda);
  const factor = (1 - expTerm) / (tau / lambda);

  return beta0 + beta1 * factor + beta2 * (factor - expTerm);
}

/**
 * Generate yield curve using Nelson-Siegel
 */
export function generateYieldCurve(
  params: NelsonSiegelParameters,
  maturities: number[]
): YieldCurvePoint[] {
  return maturities.map((maturity) => ({
    maturity,
    yield: nelsonSiegelYield(maturity, params),
  }));
}

/**
 * Fit Nelson-Siegel to observed yields (simplified)
 */
export function fitNelsonSiegel(
  observedPoints: YieldCurvePoint[]
): NelsonSiegelParameters {
  // Simplified fitting: use approximations
  // In practice, use non-linear optimization (Levenberg-Marquardt)

  const n = observedPoints.length;
  const yields = observedPoints.map((p) => p.yield);

  // Approximate parameters
  const beta0 = yields[yields.length - 1]; // Long-term rate
  const beta1 = yields[0] - beta0; // Short-term deviation
  const beta2 = Math.max(...yields) - beta0; // Medium-term hump
  const lambda = 2.5; // Typical value

  return { beta0, beta1, beta2, lambda };
}

/**
 * Credit Spread Analysis
 */
export interface CreditSpreadAnalysis {
  riskFreeRate: number;
  creditSpread: number;
  yieldWithSpread: number;
  probabilityOfDefault: number; // Implied from spread
  lossGivenDefault: number; // Assumed (typically 40-60%)
  expectedLoss: number;
}

export function analyzeCreditSpread(
  riskFreeRate: number,
  corporateYield: number,
  lossGivenDefault: number = 0.5,
  maturity: number = 1
): CreditSpreadAnalysis {
  const creditSpread = corporateYield - riskFreeRate;

  // Simplified: spread ≈ PD × LGD
  // More accurate: use Merton model or reduced-form models
  const probabilityOfDefault = creditSpread / lossGivenDefault;

  const expectedLoss = probabilityOfDefault * lossGivenDefault;

  return {
    riskFreeRate,
    creditSpread,
    yieldWithSpread: corporateYield,
    probabilityOfDefault,
    lossGivenDefault,
    expectedLoss,
  };
}

/**
 * Bond Portfolio Immunization
 *
 * Match portfolio duration to investment horizon to protect against rate changes
 */
export interface ImmunizationStrategy {
  targetDuration: number; // Investment horizon
  currentDuration: number;
  durationGap: number;
  rebalanceNeeded: boolean;
  suggestedWeights: number[];
}

export function immunizePortfolio(
  bonds: Bond[],
  currentWeights: number[],
  targetDuration: number,
  yields: number[]
): ImmunizationStrategy {
  // Calculate current portfolio duration
  const durations = bonds.map((bond, i) => macaulayDuration(bond, yields[i]));
  const currentDuration = durations.reduce((sum, dur, i) => sum + currentWeights[i] * dur, 0);

  const durationGap = Math.abs(currentDuration - targetDuration);
  const rebalanceNeeded = durationGap > 0.1; // Threshold: 0.1 years

  // Suggested weights to match target duration (simplified two-bond approach)
  let suggestedWeights = [...currentWeights];

  if (bonds.length === 2 && rebalanceNeeded) {
    // Two-bond immunization: w₁D₁ + w₂D₂ = D_target, w₁ + w₂ = 1
    const D1 = durations[0];
    const D2 = durations[1];
    const w1 = (D2 - targetDuration) / (D2 - D1);
    const w2 = 1 - w1;
    suggestedWeights = [Math.max(0, Math.min(1, w1)), Math.max(0, Math.min(1, w2))];
  }

  return {
    targetDuration,
    currentDuration,
    durationGap,
    rebalanceNeeded,
    suggestedWeights,
  };
}

/**
 * Floating Rate Note (FRN) Price
 *
 * Price typically near par, adjusted for credit spread
 */
export function floatingRateNotePrice(
  faceValue: number,
  referenceRate: number, // SOFR, LIBOR, etc.
  spread: number, // Credit spread over reference rate
  daysToNextReset: number = 90,
  daysInYear: number = 360
): number {
  // Simplified: FRN trades near par if spread = credit spread
  // Price ≈ Par / (1 + (referenceRate + spread) × (days/360))
  const discountRate = referenceRate + spread;
  const timeFraction = daysToNextReset / daysInYear;
  return faceValue / (1 + discountRate * timeFraction);
}

/**
 * Convertible Bond Pricing (simplified)
 *
 * Value = Bond Floor + Conversion Option
 */
export interface ConvertibleBond extends Bond {
  conversionRatio: number; // Shares per bond
  stockPrice: number; // Current stock price
  stockVolatility: number; // For option pricing
}

export function convertibleBondPrice(
  convertible: ConvertibleBond,
  riskFreeRate: number
): {
  bondFloor: number;
  conversionValue: number;
  optionValue: number;
  totalValue: number;
} {
  // Bond floor (straight bond value)
  const bondFloor = bondPrice(
    {
      faceValue: convertible.faceValue,
      couponRate: convertible.couponRate,
      maturity: convertible.maturity,
      paymentFrequency: convertible.paymentFrequency,
    },
    convertible.yieldToMaturity || riskFreeRate
  );

  // Conversion value
  const conversionValue = convertible.conversionRatio * convertible.stockPrice;

  // Option value (simplified: use Black-Scholes for embedded call option)
  // In practice, use binomial/trinomial trees or Monte Carlo
  const optionValue = Math.max(0, conversionValue - bondFloor) * 0.5; // Simplified

  const totalValue = Math.max(bondFloor, conversionValue) + optionValue;

  return {
    bondFloor,
    conversionValue,
    optionValue,
    totalValue,
  };
}

/**
 * Example bonds for testing
 */
export const EXAMPLE_BONDS = {
  usTreasury10Y: {
    name: 'US Treasury 10-Year',
    faceValue: 100,
    couponRate: 0.04, // 4%
    maturity: 10,
    paymentFrequency: 2, // Semi-annual
    rating: 'AAA',
  },
  corporateAAA5Y: {
    name: 'Corporate AAA 5-Year',
    faceValue: 100,
    couponRate: 0.05,
    maturity: 5,
    paymentFrequency: 2,
    creditSpread: 0.01, // 100 bps
    rating: 'AAA',
  },
  highYield3Y: {
    name: 'High Yield 3-Year',
    faceValue: 100,
    couponRate: 0.08,
    maturity: 3,
    paymentFrequency: 2,
    creditSpread: 0.04, // 400 bps
    rating: 'BB',
  },
  zeroCoupon5Y: {
    name: 'Zero-Coupon 5-Year',
    faceValue: 100,
    couponRate: 0,
    maturity: 5,
    paymentFrequency: 1,
    rating: 'AAA',
  },
};

/**
 * Typical yield curve shapes
 */
export const YIELD_CURVE_SCENARIOS = {
  normal: {
    name: 'Normal (Upward Sloping)',
    params: { beta0: 0.045, beta1: -0.015, beta2: 0.01, lambda: 2.5 },
  },
  inverted: {
    name: 'Inverted (Recession Signal)',
    params: { beta0: 0.035, beta1: 0.02, beta2: -0.015, lambda: 2.0 },
  },
  flat: {
    name: 'Flat',
    params: { beta0: 0.04, beta1: 0, beta2: 0, lambda: 2.5 },
  },
  humped: {
    name: 'Humped',
    params: { beta0: 0.04, beta1: -0.01, beta2: 0.03, lambda: 1.5 },
  },
};
