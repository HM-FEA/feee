'use client';

import React, { useState, useMemo } from 'react';
import { Play, BarChart3, TrendingUp, Calendar, DollarSign, Target, Zap, Settings, ChevronRight, Clock, Check, ClipboardList } from 'lucide-react';

// Types
interface SimulationMode {
  key: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  requiredTier: 'free' | 'pro' | 'premium';
  estimatedTime: string;
}

interface Portfolio {
  id: string;
  name: string;
  description: string;
  mode: string;
  createdAt: Date;
  initialCapital: number;
  currentValue: number;
  return: number;
  status: 'draft' | 'running' | 'completed';
  period: string;
}

// Mock Data
const SIMULATION_MODES: SimulationMode[] = [
  {
    key: 'simple',
    title: 'Simple Mode',
    description: 'Quick portfolio construction. Buy and hold strategy with basic allocation.',
    icon: 'barchart',
    difficulty: 'beginner',
    features: [
      'Drag-and-drop portfolio builder',
      'Real historical data',
      'Basic performance metrics',
      'Compare to benchmarks',
    ],
    requiredTier: 'free',
    estimatedTime: '10-15 min',
  },
  {
    key: 'strategy',
    title: 'Strategy Mode',
    description: 'Backtest investment strategies. Test tactical allocation, rebalancing, and macro triggers.',
    icon: 'target',
    difficulty: 'intermediate',
    features: [
      'Custom rebalancing rules',
      'Macro condition triggers',
      'Sector rotation strategies',
      'Advanced analytics dashboard',
      'Risk metrics & sharpe ratio',
      'Drawdown analysis',
    ],
    requiredTier: 'pro',
    estimatedTime: '20-30 min',
  },
  {
    key: 'advanced',
    title: 'Advanced Mode',
    description: 'Full quant environment. Code custom indicators, algorithms, and machine learning models.',
    icon: 'settings',
    difficulty: 'advanced',
    features: [
      'Python backtesting engine',
      'Custom indicator development',
      'ML model integration',
      'High-frequency trading support',
      'Walk-forward optimization',
      'Live paper trading',
      'API access for external data',
    ],
    requiredTier: 'premium',
    estimatedTime: '1-3 hours',
  },
];

const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: 'p1',
    name: 'Tech-Heavy Growth Portfolio',
    description: '80% Tech, 20% Finance - for growth investors',
    mode: 'simple',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    initialCapital: 100000,
    currentValue: 127500,
    return: 27.5,
    status: 'completed',
    period: '1 year',
  },
  {
    id: 'p2',
    name: 'Sector Rotation Strategy',
    description: 'Rotate based on interest rate cycles',
    mode: 'strategy',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    initialCapital: 250000,
    currentValue: 268750,
    return: 7.5,
    status: 'completed',
    period: '6 months',
  },
  {
    id: 'p3',
    name: 'ML-Driven Trading System',
    description: 'Neural network for price prediction',
    mode: 'advanced',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    initialCapital: 50000,
    currentValue: 52300,
    return: 4.6,
    status: 'running',
    period: 'Live',
  },
];

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const ModeCard = ({ mode, onSelect }: { mode: SimulationMode, onSelect: () => void }) => (
  <div onClick={onSelect} className="cursor-pointer">
    <Card className="hover:border-[#2A2A3F] transition-all group h-full">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-3xl">
            {mode.icon === 'barchart' && <BarChart3 size={32} />}
            {mode.icon === 'target' && <Target size={32} />}
            {mode.icon === 'settings' && <Settings size={32} />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{mode.title}</h3>
          <p className="text-xs text-text-secondary mt-1">{mode.description}</p>
        </div>
      </div>
      <ChevronRight className="text-text-tertiary group-hover:text-accent-cyan transition-colors" size={16} />
    </div>
    <div className="flex gap-2 mb-3">
      <div className={`text-xs px-2 py-0.5 rounded-full border ${mode.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border-green-500/30' : mode.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
        {mode.difficulty.charAt(0).toUpperCase() + mode.difficulty.slice(1)}
      </div>
      <div className="text-xs bg-background-tertiary text-text-tertiary px-2 py-0.5 rounded-full flex items-center gap-1"><Clock size={12} /> {mode.estimatedTime}</div>
    </div>
    <div className="mb-3 pb-3 border-t border-border-primary pt-3">
      <p className="text-xs text-text-secondary font-semibold mb-2">Key Features:</p>
      <div className="space-y-1">
        {mode.features.slice(0, 3).map((feature, idx) => (
          <div key={idx} className="text-xs text-text-tertiary flex items-center gap-1.5"><Check size={12} className="text-accent-cyan" />{feature}</div>
        ))}
      </div>
    </div>
    <div className="text-xs text-text-secondary">Requires: <span className="text-accent-cyan font-semibold">{mode.requiredTier}</span></div>
    </Card>
  </div>
);

const PortfolioCard = ({ portfolio, onOpen }: { portfolio: Portfolio, onOpen: () => void }) => {
  const isPositive = portfolio.return >= 0;
  return (
    <div onClick={onOpen} className="cursor-pointer">
      <Card className="hover:border-[#2A2A3F] transition-all group h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{portfolio.name}</h3>
          <p className="text-xs text-text-secondary mt-1">{portfolio.description}</p>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full font-semibold ${portfolio.status === 'completed' ? 'bg-green-500/20 text-green-400' : portfolio.status === 'running' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-border-primary">
        <div>
          <div className="text-xs text-text-secondary mb-1">Initial</div>
          <div className="text-sm font-semibold text-text-primary">${(portfolio.initialCapital / 1000).toFixed(1)}K</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">Current</div>
          <div className="text-sm font-semibold text-text-primary">${(portfolio.currentValue / 1000).toFixed(1)}K</div>
        </div>
        <div>
          <div className="text-xs text-text-secondary mb-1">Return</div>
          <div className={`text-sm font-semibold ${isPositive ? 'text-status-safe' : 'text-status-danger'}`}>{isPositive ? '+' : ''}{portfolio.return.toFixed(2)}%</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-tertiary">{portfolio.period}</span>
        <div className="flex items-center gap-1 text-text-tertiary group-hover:text-accent-cyan transition-colors"><Play size={12} />Run Simulation</div>
      </div>
    </Card>
    </div>
  );
};

export default function SimulatePage() {
  const [activeTab, setActiveTab] = useState('modes');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const availableModes = SIMULATION_MODES;

    return (

      <div className="relative min-h-screen bg-black text-text-primary">

        <div className="relative z-10">
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-cyan">Simulation Platform</h1>
              <p className="text-sm text-text-secondary">Test strategies with historical data. No risk, pure learning.</p>
            </div>
            <button className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"><Zap size={16} />Create Portfolio</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('modes')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'modes' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><ClipboardList size={16}/> Simulation Modes</button>
            <button onClick={() => setActiveTab('portfolios')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'portfolios' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><BarChart3 size={16}/> My Portfolios</button>
            <button onClick={() => setActiveTab('results')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'results' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><TrendingUp size={16}/> Results & Analysis</button>
          </div>
        </div>
        <div className="px-6 py-6 h-[calc(100vh-200px)] overflow-y-auto">
          {activeTab === 'modes' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Choose Your Simulation Mode</h2>
                <p className="text-sm text-text-secondary">Each mode offers different tools and complexity levels. Start simple and progress to advanced strategies.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">{availableModes.map(mode => (<ModeCard key={mode.key} mode={mode} onSelect={() => setSelectedMode(mode.key)} />))}</div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Calendar size={16} />Historical Data Available</h3>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="flex justify-between"><span>Full Period:</span><span className="text-accent-cyan">2015-2025</span></div>
                    <div className="flex justify-between"><span>Data Points:</span><span className="text-accent-cyan">2,500+ stocks</span></div>
                    <div className="flex justify-between"><span>Frequency:</span><span className="text-accent-cyan">Daily + Intraday</span></div>
                  </div>
                </Card>
                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><BarChart3 size={16} />Metrics Calculated</h3>
                  <div className="space-y-2 text-xs text-text-secondary">
                    <div className="flex justify-between"><span>Sharpe Ratio:</span><span className="text-accent-cyan"><Check size={12} className="inline"/></span></div>
                    <div className="flex justify-between"><span>Max Drawdown:</span><span className="text-accent-cyan"><Check size={12} className="inline"/></span></div>
                    <div className="flex justify-between"><span>Sortino Ratio:</span><span className="text-accent-cyan"><Check size={12} className="inline"/></span></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'portfolios' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-1">My Portfolios</h2>
                  <p className="text-sm text-text-secondary">View and manage your simulated portfolios</p>
                </div>
                <div className="text-xs text-text-secondary">{MOCK_PORTFOLIOS.length} Portfolios</div>
              </div>
              <div className="grid grid-cols-2 gap-4">{MOCK_PORTFOLIOS.map(portfolio => (<PortfolioCard key={portfolio.id} portfolio={portfolio} onOpen={() => console.log('Open portfolio:', portfolio.id)} />))}</div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card>
                  <div className="text-xs text-text-secondary mb-1">Total Invested</div>
                  <div className="text-2xl font-bold text-accent-cyan">${(MOCK_PORTFOLIOS.reduce((sum, p) => sum + p.initialCapital, 0) / 1000).toFixed(0)}K</div>
                </Card>
                <Card>
                  <div className="text-xs text-text-secondary mb-1">Current Value</div>
                  <div className="text-2xl font-bold text-accent-cyan">${(MOCK_PORTFOLIOS.reduce((sum, p) => sum + p.currentValue, 0) / 1000).toFixed(0)}K</div>
                </Card>
                <Card>
                  <div className="text-xs text-text-secondary mb-1">Avg Return</div>
                  <div className="text-2xl font-bold text-status-safe">+{(MOCK_PORTFOLIOS.reduce((sum, p) => sum + p.return, 0) / MOCK_PORTFOLIOS.length).toFixed(1)}%</div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === 'results' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary mb-1">Simulation Results & Analysis</h2>
                <p className="text-sm text-text-secondary">Detailed performance analytics and comparison tools</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2"><TrendingUp size={16} />Performance Comparison</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2 bg-background-secondary rounded"><span className="text-text-secondary">Your Portfolio</span><span className="text-status-safe font-semibold">+7.5%</span></div>
                    <div className="flex items-center justify-between p-2 bg-background-secondary rounded"><span className="text-text-secondary">S&P 500</span><span className="text-accent-cyan font-semibold">+5.2%</span></div>
                    <div className="flex items-center justify-between p-2 bg-background-secondary rounded"><span className="text-text-secondary">Russell 2000</span><span className="text-text-tertiary font-semibold">+3.1%</span></div>
                  </div>
                </Card>
                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2"><Target size={16} />Risk Metrics</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-text-secondary">Volatility:</span><span className="text-accent-cyan font-semibold">14.2%</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Sharpe Ratio:</span><span className="text-accent-cyan font-semibold">1.23</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Max Drawdown:</span><span className="text-status-danger font-semibold">-8.5%</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Sortino Ratio:</span><span className="text-accent-cyan font-semibold">2.14</span></div>
                  </div>
                </Card>
              </div>
              <Card className="mt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Chart Would Go Here</h3>
                <div className="h-64 bg-background-secondary rounded-lg flex items-center justify-center"><p className="text-text-tertiary text-sm">Performance chart visualization</p></div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}