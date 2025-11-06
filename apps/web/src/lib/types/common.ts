// Common types used across the application

export type SectorType = 'real-estate' | 'stocks' | 'crypto' | 'manufacturing';

export interface NewsItem {
  id: string;
  type: 'news' | 'analyst_report' | 'market_update';
  title: string;
  source: string;
  timestamp: Date | string;
  sector: SectorType | 'all';
  sentiment?: 'positive' | 'negative' | 'neutral';
  url?: string;
  content?: string;
}

export interface AnalystReport {
  id: string;
  ticker: string;
  date: string;
  markdown: string;
  confidence: number;
  decision: 'buy' | 'sell' | 'hold';
  reasoning: string;
}

export interface SimulationResult {
  id: string;
  timestamp: Date;
  params: Record<string, any>;
  results: Record<string, any>;
}

export interface ControlConfig {
  id: string;
  type: 'slider' | 'input' | 'select' | 'toggle';
  label: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
}

export interface ResultsSummary {
  metrics: {
    label: string;
    value: string | number;
    change?: number;
    unit?: string;
  }[];
  confidence?: number;
}
