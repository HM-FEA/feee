import { create } from 'zustand';

export type BotType = 'AI_DESCRIPTION' | 'TRADITIONAL';
export type BotStatus = 'DRAFT' | 'BACKTESTING' | 'LIVE' | 'PAUSED' | 'STOPPED';

export interface BacktestResult {
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;  // %
  sharpeRatio: number;
  maxDrawdown: number;  // %
  winRate: number;  // %
  totalTrades: number;
  avgTradeReturn: number;  // %
  bestTrade: number;  // %
  worstTrade: number;  // %
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  author: string;
  type: BotType;
  status: BotStatus;

  // Strategy definition
  strategy: string;  // AI description or code
  aiPrompt?: string;  // For AI bots: natural language strategy
  strategyCode?: string;  // Generated or manual code

  // Traditional bot settings
  strategyType?: 'MEAN_REVERSION' | 'MOMENTUM' | 'PAIRS_TRADING' | 'STAT_ARB' | 'LONG_SHORT' | 'OPTIONS' | 'HFT';
  parameters?: Record<string, number>;  // Strategy-specific parameters

  // Performance
  backtestResults?: BacktestResult;
  livePerformance?: {
    dailyPnL: number[];
    currentReturn: number;
    currentDrawdown: number;
  };

  // Marketplace
  isPublic: boolean;
  subscriptionPrice: number;  // $29/mo default
  subscribers: number;
  rating: number;  // 0-5 stars
  reviews: number;
  revenueShare: number;  // 70% to creator

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastBacktest?: string;
}

interface TradingBotState {
  bots: Record<string, TradingBot>;
  createBot: (bot: Omit<TradingBot, 'id' | 'createdAt' | 'updatedAt' | 'subscribers' | 'rating' | 'reviews'>) => string;
  updateBot: (id: string, updates: Partial<TradingBot>) => void;
  deleteBot: (id: string) => void;
  subscribeToBot: (botId: string) => void;
  unsubscribeFromBot: (botId: string) => void;
  runBacktest: (botId: string) => Promise<BacktestResult>;
}

export const useTradingBotStore = create<TradingBotState>((set, get) => ({
  bots: {},

  createBot: (botData) => {
    const id = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newBot: TradingBot = {
      ...botData,
      id,
      createdAt: now,
      updatedAt: now,
      subscribers: 0,
      rating: 0,
      reviews: 0,
    };

    set(state => ({
      bots: {
        ...state.bots,
        [id]: newBot,
      },
    }));

    return id;
  },

  updateBot: (id, updates) => {
    set(state => ({
      bots: {
        ...state.bots,
        [id]: {
          ...state.bots[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  },

  deleteBot: (id) => {
    set(state => {
      const { [id]: deleted, ...rest } = state.bots;
      return { bots: rest };
    });
  },

  subscribeToBot: (botId) => {
    set(state => ({
      bots: {
        ...state.bots,
        [botId]: {
          ...state.bots[botId],
          subscribers: state.bots[botId].subscribers + 1,
        },
      },
    }));
  },

  unsubscribeFromBot: (botId) => {
    set(state => ({
      bots: {
        ...state.bots,
        [botId]: {
          ...state.bots[botId],
          subscribers: Math.max(0, state.bots[botId].subscribers - 1),
        },
      },
    }));
  },

  runBacktest: async (botId) => {
    // Mock backtest simulation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResult: BacktestResult = {
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      initialCapital: 100000,
      finalCapital: 100000 * (1 + Math.random() * 0.5), // 0-50% return
      totalReturn: Math.random() * 50,
      sharpeRatio: 0.5 + Math.random() * 2, // 0.5-2.5
      maxDrawdown: -(5 + Math.random() * 20), // -5% to -25%
      winRate: 40 + Math.random() * 30, // 40-70%
      totalTrades: Math.floor(100 + Math.random() * 400), // 100-500 trades
      avgTradeReturn: -1 + Math.random() * 4, // -1% to 3%
      bestTrade: 5 + Math.random() * 15, // 5-20%
      worstTrade: -(5 + Math.random() * 10), // -5% to -15%
    };

    get().updateBot(botId, {
      backtestResults: mockResult,
      lastBacktest: new Date().toISOString(),
    });

    return mockResult;
  },
}));

// Sample bots
export const SAMPLE_TRADING_BOTS: Omit<TradingBot, 'id' | 'createdAt' | 'updatedAt' | 'subscribers' | 'rating' | 'reviews'>[] = [
  {
    name: 'Fed Rate Rotator',
    description: 'AI-powered strategy that rotates between bank stocks and growth stocks based on Fed rate changes',
    author: 'quant-master',
    type: 'AI_DESCRIPTION',
    status: 'LIVE',
    strategy: 'If Fed rate > 5%, buy bank stocks (high NIM). If Fed rate < 3%, buy growth/tech stocks. Maintain 15% portfolio volatility.',
    aiPrompt: 'If Fed rate > 5%, buy bank stocks (high NIM). If Fed rate < 3%, buy growth/tech stocks. Maintain 15% portfolio volatility.',
    isPublic: true,
    subscriptionPrice: 29,
    revenueShare: 0.7,
    backtestResults: {
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      initialCapital: 100000,
      finalCapital: 142000,
      totalReturn: 42,
      sharpeRatio: 1.8,
      maxDrawdown: -12,
      winRate: 65,
      totalTrades: 24,
      avgTradeReturn: 1.75,
      bestTrade: 12,
      worstTrade: -6,
    },
  },
  {
    name: 'Mean Reversion Master',
    description: 'Classic mean reversion strategy with Bollinger Bands',
    author: 'algo-trader',
    type: 'TRADITIONAL',
    status: 'LIVE',
    strategy: 'Buy when price touches lower Bollinger Band, sell at mean or upper band',
    strategyType: 'MEAN_REVERSION',
    parameters: {
      bollinger_period: 20,
      bollinger_std: 2,
      stop_loss: -2,
      take_profit: 3,
    },
    isPublic: true,
    subscriptionPrice: 19,
    revenueShare: 0.7,
    backtestResults: {
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      initialCapital: 100000,
      finalCapital: 128000,
      totalReturn: 28,
      sharpeRatio: 1.5,
      maxDrawdown: -15,
      winRate: 58,
      totalTrades: 156,
      avgTradeReturn: 0.6,
      bestTrade: 8,
      worstTrade: -4,
    },
  },
  {
    name: 'Momentum Breakout',
    description: 'High-frequency momentum strategy with tight stops',
    author: 'hft-pro',
    type: 'TRADITIONAL',
    status: 'LIVE',
    strategy: 'Buy on 20-day high breakout, sell on 10-day low',
    strategyType: 'MOMENTUM',
    parameters: {
      breakout_period: 20,
      exit_period: 10,
      atr_multiplier: 2,
      position_size: 0.1,
    },
    isPublic: true,
    subscriptionPrice: 39,
    revenueShare: 0.7,
    backtestResults: {
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      initialCapital: 100000,
      finalCapital: 165000,
      totalReturn: 65,
      sharpeRatio: 2.1,
      maxDrawdown: -18,
      winRate: 48,
      totalTrades: 342,
      avgTradeReturn: 0.95,
      bestTrade: 15,
      worstTrade: -7,
    },
  },
  {
    name: 'AI Macro Predictor',
    description: 'Uses GPT-4 to analyze macro news and adjust positions',
    author: 'ai-quant',
    type: 'AI_DESCRIPTION',
    status: 'BACKTESTING',
    strategy: 'Analyze Fed announcements, CPI data, employment reports. Adjust sector allocation based on macro regime.',
    aiPrompt: 'Analyze Fed announcements, CPI data, employment reports. Adjust sector allocation based on macro regime: defensive (utilities, healthcare) in recession, cyclical (tech, industrials) in expansion.',
    isPublic: false,
    subscriptionPrice: 49,
    revenueShare: 0.7,
    backtestResults: {
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      initialCapital: 100000,
      finalCapital: 138000,
      totalReturn: 38,
      sharpeRatio: 1.6,
      maxDrawdown: -14,
      winRate: 62,
      totalTrades: 18,
      avgTradeReturn: 2.1,
      bestTrade: 18,
      worstTrade: -8,
    },
  },
];
