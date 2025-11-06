import type { StockData, StockHistoricalData } from '@/lib/types/stocks';

const API_BASE = '/api/stocks';

export async function getStockData(ticker: string): Promise<StockData> {
  const response = await fetch(`${API_BASE}/${ticker}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for ${ticker}`);
  }
  return response.json();
}

export async function getMultipleStocks(tickers: string[]): Promise<StockData[]> {
  const response = await fetch(`${API_BASE}/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickers }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch multiple stocks');
  }
  return response.json();
}

export async function getHistoricalData(
  ticker: string,
  period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y' = '1mo'
): Promise<StockHistoricalData> {
  const response = await fetch(`${API_BASE}/${ticker}/history?period=${period}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch historical data for ${ticker}`);
  }
  return response.json();
}

export async function searchStocks(query: string, limit: number = 10): Promise<StockData[]> {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to search stocks');
  }
  return response.json();
}

// Real Estate specific tickers (Korean REITs)
export const KOREAN_REIT_TICKERS = [
  '293940', // 신한알파리츠
  '377190', // 이리츠코크렙
  '338100', // NH프라임리츠
  '365550', // ESR켄달스퀘어리츠
  '448730', // 삼성FN리츠
];

// US Real Estate ETF tickers
export const US_REALESTATE_TICKERS = [
  'VNQ',    // Vanguard Real Estate ETF
  'SCHH',   // Schwab US REIT ETF
  'IYR',    // iShares US Real Estate ETF
  'XLRE',   // Real Estate Select Sector SPDR Fund
  'RWR',    // SPDR Dow Jones REIT ETF
];

// Combined for international exposure
export const DEFAULT_REALESTATE_TICKERS = [
  ...KOREAN_REIT_TICKERS.slice(0, 3),
  ...US_REALESTATE_TICKERS.slice(0, 3),
];
