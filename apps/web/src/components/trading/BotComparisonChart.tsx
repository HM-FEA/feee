'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, Area, AreaChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Zap } from 'lucide-react';

// ===== TYPES =====

interface TradingBot {
  id: string;
  name: string;
  strategy: string;
  color: string;
  returns: number[];  // Daily returns
  sharpe: number;
  maxDrawdown: number;
  winRate: number;
  trades: number;
  status: 'active' | 'paused';
}

// ===== MOCK DATA =====

const generatePerformanceData = (seed: number, volatility: number, trend: number) => {
  const data: number[] = [100]; // Start at 100
  for (let i = 1; i < 252; i++) { // 252 trading days in a year
    const randomWalk = (Math.random() - 0.5) * volatility;
    const trendComponent = trend / 252;
    const newValue = data[i - 1] * (1 + randomWalk + trendComponent);
    data.push(newValue);
  }
  return data;
};

const BOTS: TradingBot[] = [
  {
    id: 'bot1',
    name: 'Momentum Chaser',
    strategy: 'Trend Following + RSI',
    color: '#06B6D4',
    returns: generatePerformanceData(1, 0.015, 0.18),
    sharpe: 1.85,
    maxDrawdown: -12.3,
    winRate: 58.2,
    trades: 145,
    status: 'active'
  },
  {
    id: 'bot2',
    name: 'Mean Reversion Pro',
    strategy: 'Bollinger Bands + MACD',
    color: '#10B981',
    returns: generatePerformanceData(2, 0.012, 0.12),
    sharpe: 2.12,
    maxDrawdown: -8.7,
    winRate: 62.1,
    trades: 203,
    status: 'active'
  },
  {
    id: 'bot3',
    name: 'ML Ensemble',
    strategy: 'Random Forest + LSTM',
    color: '#C026D3',
    returns: generatePerformanceData(3, 0.018, 0.25),
    sharpe: 1.92,
    maxDrawdown: -15.4,
    winRate: 55.8,
    trades: 89,
    status: 'active'
  },
  {
    id: 'bot4',
    name: 'Value Hunter',
    strategy: 'Fundamental + Technical',
    color: '#F59E0B',
    returns: generatePerformanceData(4, 0.010, 0.08),
    sharpe: 1.65,
    maxDrawdown: -6.2,
    winRate: 64.5,
    trades: 67,
    status: 'active'
  },
  {
    id: 'bot5',
    name: 'Volatility Arbitrage',
    strategy: 'Options Strategies',
    color: '#8B5CF6',
    returns: generatePerformanceData(5, 0.008, 0.06),
    sharpe: 2.45,
    maxDrawdown: -4.8,
    winRate: 71.3,
    trades: 312,
    status: 'active'
  },
  {
    id: 'benchmark',
    name: 'S&P 500 (Benchmark)',
    strategy: 'Buy & Hold',
    color: '#6B7280',
    returns: generatePerformanceData(6, 0.013, 0.10),
    sharpe: 1.20,
    maxDrawdown: -18.5,
    winRate: 100,
    trades: 1,
    status: 'active'
  }
];

// ===== COMPONENTS =====

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-4 ${className}`}>
    {children}
  </div>
);

const PerformanceChart = ({ bots, selectedBots }: {
  bots: TradingBot[];
  selectedBots: string[];
}) => {
  const chartData = useMemo(() => {
    const maxLength = Math.max(...bots.map(b => b.returns.length));
    const data = [];

    for (let i = 0; i < maxLength; i++) {
      const point: any = { day: i };
      bots.forEach(bot => {
        if (selectedBots.includes(bot.id)) {
          point[bot.id] = bot.returns[i];
        }
      });
      data.push(point);
    }

    return data;
  }, [bots, selectedBots]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          {bots.filter(b => selectedBots.includes(b.id)).map(bot => (
            <linearGradient key={bot.id} id={`gradient-${bot.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={bot.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={bot.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
        <XAxis
          dataKey="day"
          stroke="#4B5563"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          label={{ value: 'Trading Days', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
        />
        <YAxis
          stroke="#4B5563"
          tick={{ fill: '#6B7280', fontSize: 12 }}
          label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0D0D0F',
            border: '1px solid #1A1A1F',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="line"
        />

        <ReferenceLine y={100} stroke="#6B7280" strokeDasharray="3 3" label={{ value: 'Start', fill: '#6B7280', fontSize: 10 }} />

        {bots.filter(b => selectedBots.includes(b.id)).map(bot => (
          <Area
            key={bot.id}
            type="monotone"
            dataKey={bot.id}
            stroke={bot.color}
            fill={`url(#gradient-${bot.id})`}
            strokeWidth={2}
            name={bot.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

const MetricsComparison = ({ bots, selectedBots }: {
  bots: TradingBot[];
  selectedBots: string[];
}) => {
  const metrics = ['sharpe', 'maxDrawdown', 'winRate', 'trades'] as const;
  const metricLabels = {
    sharpe: 'Sharpe Ratio',
    maxDrawdown: 'Max Drawdown',
    winRate: 'Win Rate',
    trades: 'Total Trades'
  };

  const selectedBotsData = bots.filter(b => selectedBots.includes(b.id));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(metric => (
        <Card key={metric}>
          <h4 className="text-xs text-text-tertiary mb-3 font-semibold">{metricLabels[metric]}</h4>
          <div className="space-y-2">
            {selectedBotsData.map(bot => {
              const value = bot[metric];
              const displayValue = metric === 'maxDrawdown'
                ? `${value.toFixed(1)}%`
                : metric === 'winRate'
                ? `${value.toFixed(1)}%`
                : metric === 'sharpe'
                ? value.toFixed(2)
                : value;

              const isGood = metric === 'maxDrawdown'
                ? value > -10
                : metric === 'sharpe'
                ? value > 1.5
                : metric === 'winRate'
                ? value > 60
                : true;

              return (
                <div key={bot.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bot.color }} />
                    <span className="text-xs text-text-secondary truncate">{bot.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${isGood ? 'text-status-safe' : 'text-status-caution'}`}>
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};

const BotSelector = ({ bots, selectedBots, onToggle }: {
  bots: TradingBot[];
  selectedBots: string[];
  onToggle: (botId: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {bots.map(bot => {
        const isSelected = selectedBots.includes(bot.id);
        const finalReturn = ((bot.returns[bot.returns.length - 1] - 100) / 100 * 100).toFixed(1);

        return (
          <button
            key={bot.id}
            onClick={() => onToggle(bot.id)}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${isSelected
                ? 'border-white bg-white/5'
                : 'border-[#1A1A1F] bg-[#0D0D0F] hover:border-[#2A2A2F]'
              }
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: bot.color }}
              />
              <span className="text-xs font-semibold text-text-primary">{bot.name}</span>
            </div>
            <div className="text-xs text-text-tertiary mb-1">{bot.strategy}</div>
            <div className={`text-sm font-bold ${parseFloat(finalReturn) >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
              {parseFloat(finalReturn) >= 0 ? '+' : ''}{finalReturn}%
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ===== MAIN COMPONENT =====

export default function BotComparisonChart() {
  const [selectedBots, setSelectedBots] = useState<string[]>(['bot1', 'bot2', 'bot3', 'benchmark']);

  const handleToggle = (botId: string) => {
    setSelectedBots(prev =>
      prev.includes(botId)
        ? prev.filter(id => id !== botId)
        : [...prev, botId]
    );
  };

  const topPerformer = useMemo(() => {
    const sorted = [...BOTS].sort((a, b) => {
      const returnA = a.returns[a.returns.length - 1];
      const returnB = b.returns[b.returns.length - 1];
      return returnB - returnA;
    });
    return sorted[0];
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">Trading Bot Performance</h2>
          <p className="text-sm text-text-secondary">Compare algorithmic trading strategies over 252 trading days</p>
        </div>
        <Card className="flex items-center gap-3">
          <div>
            <div className="text-xs text-text-tertiary">Top Performer</div>
            <div className="text-lg font-bold text-accent-cyan">{topPerformer.name}</div>
          </div>
          <TrendingUp size={32} className="text-accent-cyan" />
        </Card>
      </div>

      {/* Bot Selector */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Select Bots to Compare</h3>
        <BotSelector bots={BOTS} selectedBots={selectedBots} onToggle={handleToggle} />
      </div>

      {/* Performance Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary">Cumulative Returns</h3>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <Activity size={14} />
            <span>{selectedBots.length} bots selected</span>
          </div>
        </div>
        <PerformanceChart bots={BOTS} selectedBots={selectedBots} />
      </Card>

      {/* Metrics Comparison */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Key Metrics</h3>
        <MetricsComparison bots={BOTS} selectedBots={selectedBots} />
      </div>

      {/* Info */}
      <Card className="bg-accent-cyan/5 border-accent-cyan/20">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-accent-cyan mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-accent-cyan mb-1">n-of-1 Style Multi-Model Comparison</h4>
            <p className="text-xs text-text-secondary">
              Each bot represents a different AI/algorithmic strategy. Performance shown is simulated based on historical backtesting.
              Sharpe Ratio measures risk-adjusted returns, Max Drawdown shows worst peak-to-trough decline.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
