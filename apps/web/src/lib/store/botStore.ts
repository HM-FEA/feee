/**
 * Trading Bot Store - Arena system for AI trading bot competitions
 * Users can create bots, backtest strategies, and compete in tournaments
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BotStrategy =
  | 'sma_crossover'
  | 'rsi_threshold'
  | 'bollinger_bands'
  | 'macd_signal'
  | 'mean_reversion'
  | 'momentum'
  | 'custom';

export type BotStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error';

export interface BotConfig {
  strategy: BotStrategy;
  parameters: Record<string, number | string | boolean>;
  riskManagement: {
    maxPositionSize: number; // %
    stopLoss: number; // %
    takeProfit: number; // %
    maxDrawdown: number; // %
  };
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

export interface BacktestResult {
  id: string;
  botId: string;
  startDate: string;
  endDate: string;

  // Performance metrics
  totalReturn: number; // %
  sharpeRatio: number;
  maxDrawdown: number; // %
  winRate: number; // %
  profitFactor: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;

  // Time series data
  equityCurve: { date: string; value: number }[];
  trades: Trade[];

  // Execution
  executedAt: string;
  duration: number; // ms
}

export interface Trade {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  symbol: string;
  price: number;
  quantity: number;
  pnl?: number;
  reason: string; // Strategy signal
}

export interface TradingBot {
  id: string;
  name: string;
  description: string;
  config: BotConfig;

  // Status
  status: BotStatus;
  isPublic: boolean;

  // Performance
  backtestResults: BacktestResult[];
  bestResult?: BacktestResult;
  rank?: number;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;

  // Tournament
  tournamentScore?: number;
  leaderboardPosition?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';

  // Rules
  initialCapital: number;
  allowedSymbols: string[];
  maxLeverage: number;

  // Participants
  participants: string[]; // botIds
  leaderboard: {
    botId: string;
    botName: string;
    owner: string;
    return: number;
    sharpeRatio: number;
    maxDrawdown: number;
  }[];

  // Prizes
  prizes: {
    rank: number;
    reward: string;
  }[];
}

interface BotStore {
  bots: Record<string, TradingBot>;
  tournaments: Record<string, Tournament>;
  activeTournamentId: string | null;

  // Actions
  createBot: (bot: Omit<TradingBot, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'backtestResults' | 'status'>) => string;
  updateBot: (botId: string, updates: Partial<TradingBot>) => void;
  deleteBot: (botId: string) => void;
  runBacktest: (botId: string, startDate: string, endDate: string) => Promise<BacktestResult>;
  updateBotStatus: (botId: string, status: BotStatus) => void;

  // Tournament
  joinTournament: (botId: string, tournamentId: string) => void;
  leaveTournament: (botId: string, tournamentId: string) => void;
  updateLeaderboard: (tournamentId: string) => void;

  // Getters
  getUserBots: (userId: string) => TradingBot[];
  getPublicBots: () => TradingBot[];
  getBotsByStrategy: (strategy: BotStrategy) => TradingBot[];
  getTopBots: (limit?: number) => TradingBot[];
  getActiveTournament: () => Tournament | null;
}

export const useBotStore = create<BotStore>()(
  persist(
    (set, get) => ({
      bots: {},
      tournaments: {},
      activeTournamentId: null,

      createBot: (bot) => {
        const id = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newBot: TradingBot = {
          ...bot,
          id,
          createdAt: now,
          updatedAt: now,
          version: 1,
          backtestResults: [],
          status: 'idle',
        };

        set(state => ({
          bots: {
            ...state.bots,
            [id]: newBot,
          },
        }));

        return id;
      },

      updateBot: (botId, updates) => {
        const bot = get().bots[botId];
        if (!bot) return;

        set(state => ({
          bots: {
            ...state.bots,
            [botId]: {
              ...bot,
              ...updates,
              updatedAt: new Date().toISOString(),
              version: bot.version + 1,
            },
          },
        }));
      },

      deleteBot: (botId) => {
        set(state => {
          const { [botId]: deleted, ...remaining } = state.bots;
          return { bots: remaining };
        });
      },

      runBacktest: async (botId, startDate, endDate) => {
        const bot = get().bots[botId];
        if (!bot) throw new Error('Bot not found');

        // Update status
        get().updateBotStatus(botId, 'running');

        // Simulate backtest (in real app, would call backend)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock result
        const result: BacktestResult = {
          id: `backtest-${Date.now()}`,
          botId,
          startDate,
          endDate,
          totalReturn: Math.random() * 40 - 10, // -10% to +30%
          sharpeRatio: Math.random() * 2,
          maxDrawdown: Math.random() * -30,
          winRate: 40 + Math.random() * 40, // 40-80%
          profitFactor: 0.8 + Math.random() * 2, // 0.8-2.8
          totalTrades: Math.floor(Math.random() * 200) + 50,
          avgWin: Math.random() * 5 + 1,
          avgLoss: -(Math.random() * 3 + 1),
          equityCurve: generateMockEquityCurve(startDate, endDate),
          trades: [],
          executedAt: new Date().toISOString(),
          duration: 2000,
        };

        // Update bot with result
        const updatedBot = {
          ...bot,
          backtestResults: [...bot.backtestResults, result],
          bestResult: !bot.bestResult || result.sharpeRatio > bot.bestResult.sharpeRatio
            ? result
            : bot.bestResult,
          status: 'completed' as BotStatus,
        };

        set(state => ({
          bots: {
            ...state.bots,
            [botId]: updatedBot,
          },
        }));

        return result;
      },

      updateBotStatus: (botId, status) => {
        const bot = get().bots[botId];
        if (!bot) return;

        set(state => ({
          bots: {
            ...state.bots,
            [botId]: {
              ...bot,
              status,
            },
          },
        }));
      },

      joinTournament: (botId, tournamentId) => {
        const tournament = get().tournaments[tournamentId];
        if (!tournament || tournament.participants.includes(botId)) return;

        set(state => ({
          tournaments: {
            ...state.tournaments,
            [tournamentId]: {
              ...tournament,
              participants: [...tournament.participants, botId],
            },
          },
        }));
      },

      leaveTournament: (botId, tournamentId) => {
        const tournament = get().tournaments[tournamentId];
        if (!tournament) return;

        set(state => ({
          tournaments: {
            ...state.tournaments,
            [tournamentId]: {
              ...tournament,
              participants: tournament.participants.filter(id => id !== botId),
            },
          },
        }));
      },

      updateLeaderboard: (tournamentId) => {
        const tournament = get().tournaments[tournamentId];
        if (!tournament) return;

        const bots = get().bots;
        const leaderboard = tournament.participants
          .map(botId => {
            const bot = bots[botId];
            if (!bot || !bot.bestResult) return null;

            return {
              botId: bot.id,
              botName: bot.name,
              owner: bot.createdBy,
              return: bot.bestResult.totalReturn,
              sharpeRatio: bot.bestResult.sharpeRatio,
              maxDrawdown: bot.bestResult.maxDrawdown,
            };
          })
          .filter(Boolean)
          .sort((a, b) => b!.sharpeRatio - a!.sharpeRatio) as Tournament['leaderboard'];

        set(state => ({
          tournaments: {
            ...state.tournaments,
            [tournamentId]: {
              ...tournament,
              leaderboard,
            },
          },
        }));
      },

      // Getters
      getUserBots: (userId) => {
        return Object.values(get().bots)
          .filter(bot => bot.createdBy === userId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getPublicBots: () => {
        return Object.values(get().bots)
          .filter(bot => bot.isPublic)
          .sort((a, b) => (b.bestResult?.sharpeRatio || 0) - (a.bestResult?.sharpeRatio || 0));
      },

      getBotsByStrategy: (strategy) => {
        return Object.values(get().bots).filter(bot => bot.config.strategy === strategy);
      },

      getTopBots: (limit = 10) => {
        return Object.values(get().bots)
          .filter(bot => bot.bestResult)
          .sort((a, b) => (b.bestResult!.sharpeRatio) - (a.bestResult!.sharpeRatio))
          .slice(0, limit);
      },

      getActiveTournament: () => {
        const id = get().activeTournamentId;
        return id ? get().tournaments[id] : null;
      },
    }),
    {
      name: 'bot-store',
    }
  )
);

// Helper: Generate mock equity curve
function generateMockEquityCurve(startDate: string, endDate: string): { date: string; value: number }[] {
  const curve: { date: string; value: number }[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  let value = 100000; // Initial capital
  for (let i = 0; i <= days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    value *= (1 + (Math.random() * 0.04 - 0.01)); // Random daily return -1% to +3%
    curve.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }

  return curve;
}

// Strategy presets
export const STRATEGY_PRESETS: Record<BotStrategy, { name: string; description: string; defaultParams: any }> = {
  sma_crossover: {
    name: 'SMA Crossover',
    description: 'Buy when fast SMA crosses above slow SMA, sell when it crosses below',
    defaultParams: { fastPeriod: 50, slowPeriod: 200 },
  },
  rsi_threshold: {
    name: 'RSI Threshold',
    description: 'Buy when RSI < oversold, sell when RSI > overbought',
    defaultParams: { period: 14, oversold: 30, overbought: 70 },
  },
  bollinger_bands: {
    name: 'Bollinger Bands',
    description: 'Mean reversion strategy using Bollinger Bands',
    defaultParams: { period: 20, stdDev: 2 },
  },
  macd_signal: {
    name: 'MACD Signal',
    description: 'Trade based on MACD line and signal line crossovers',
    defaultParams: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  },
  mean_reversion: {
    name: 'Mean Reversion',
    description: 'Buy oversold, sell overbought based on price deviation',
    defaultParams: { lookback: 20, threshold: 2 },
  },
  momentum: {
    name: 'Momentum',
    description: 'Follow strong trends with momentum indicators',
    defaultParams: { period: 14, threshold: 0.02 },
  },
  custom: {
    name: 'Custom Strategy',
    description: 'Define your own custom trading logic',
    defaultParams: {},
  },
};
