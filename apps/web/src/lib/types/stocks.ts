// Stock-specific types

export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe?: number;
  dividendYield?: number;
}

export interface StockHistoricalData {
  ticker: string;
  data: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface RealEstateStock extends StockData {
  reitType?: 'equity' | 'mortgage' | 'hybrid';
  propertyTypes?: string[];
  occupancyRate?: number;
  ffo?: number; // Funds From Operations
  affo?: number; // Adjusted FFO
}

export interface InterestRateScenario {
  baseRate: number;
  newRate: number;
  impactedTickers: string[];
}

export interface RealEstateSimulationResult {
  ticker: string;
  currentMetrics: {
    price: number;
    dividendYield: number;
    debtRatio: number;
    interestCoverage: number;
  };
  projectedMetrics: {
    price: number;
    dividendYield: number;
    debtRatio: number;
    interestCoverage: number;
  };
  healthScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: 'buy' | 'hold' | 'sell';
}
