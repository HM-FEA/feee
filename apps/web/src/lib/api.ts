/**
 * API Client for Nexus-Alpha Backend
 * Falls back to mock data when API is unavailable
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Mock Data
export const MOCK_STOCK_DATA = {
  ticker: 'AAPL',
  current_price: 150.2,
  price_change_1d: 2.3,
  price_change_1w: 4.1,
  volume: 52000000,
  market_cap: 2450000000000,
  last_updated: new Date().toISOString(),
};

export const MOCK_FUNDAMENTAL_DATA = {
  ticker: 'AAPL',
  company_name: 'Apple Inc.',
  sector: 'Technology',
  ratios: {
    roe: 85.2,
    roa: 18.5,
    pe_ratio: 24.5,
    pb_ratio: 45.2,
    debt_to_equity: 1.85,
    current_ratio: 1.07,
  },
  revenue: 383285000000,
  net_income: 96995000000,
  total_assets: 353755000000,
  recommendation: 'BUY - Undervalued (Low P/E)',
};

export const MOCK_TECHNICAL_DATA = {
  ticker: 'AAPL',
  indicators: {
    macd: 3.45,
    signal: 2.87,
    rsi: 68.5,
    sma_20: 148.2,
    sma_50: 145.8,
    bollinger_upper: 152.3,
    bollinger_lower: 143.1,
  },
  trend: 'BULLISH',
  strength: 0.75,
  signals: [
    'Golden Cross - Bullish signal',
    'Price above upper Bollinger Band',
    'RSI trending upward',
  ],
};

// API Functions
export async function fetchStockPrice(ticker: string) {
  try {
    const res = await fetch(`${API_URL}/api/stock/${ticker}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (error) {
    console.warn(`⚠️  Using mock data for stock/${ticker}`);
    return { ...MOCK_STOCK_DATA, ticker: ticker.toUpperCase() };
  }
}

export async function fetchFundamental(ticker: string) {
  try {
    const res = await fetch(`${API_URL}/api/fundamental/${ticker}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (error) {
    console.warn(`⚠️  Using mock data for fundamental/${ticker}`);
    return { ...MOCK_FUNDAMENTAL_DATA, ticker: ticker.toUpperCase() };
  }
}

export async function fetchTechnical(ticker: string) {
  try {
    const res = await fetch(`${API_URL}/api/technical/${ticker}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (error) {
    console.warn(`⚠️  Using mock data for technical/${ticker}`);
    return { ...MOCK_TECHNICAL_DATA, ticker: ticker.toUpperCase() };
  }
}

export async function healthCheck() {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
