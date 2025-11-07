'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, BarChart2, Activity, DollarSign, Search, Play, Lock, Zap, Settings2 } from 'lucide-react';
import { companies, Company } from '@/data/companies';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

// Mock user plan
const USER_PLAN = 'FREE'; // or 'PRO'

const PLAN_LIMITS = {
  FREE: {
    backtestsPerDay: 3,
    maxStocks: 2,
    label: 'Free Plan',
    color: 'text-text-secondary'
  },
  PRO: {
    backtestsPerDay: Infinity,
    maxStocks: Infinity,
    label: 'Pro Plan',
    color: 'text-accent-cyan'
  }
};

// Generate realistic price data
const generatePriceData = (ticker: string, basePrice: number, days: number = 90) => {
  const data = [];
  const now = new Date();
  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add realistic price movement
    const change = (Math.random() - 0.48) * (basePrice * 0.02);
    price = Math.max(price + change, basePrice * 0.7);
    const volume = Math.floor(Math.random() * 2000000) + 500000;

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      price: parseFloat(price.toFixed(2)),
      volume
    });
  }

  return data;
};

// Backtest simulation
const runBacktest = (
  companies: Company[],
  strategy: {
    risk: number;
    momentum: number;
    value: number;
    technical: number;
  },
  description: string
) => {
  const results = companies.map(company => {
    const baseReturn = Math.random() * 40 - 10; // -10% to +30%

    // Strategy impact
    const strategyBoost =
      (strategy.risk * 0.15) +
      (strategy.momentum * 0.1) +
      (strategy.value * 0.08) +
      (strategy.technical * 0.12);

    const finalReturn = baseReturn + strategyBoost;
    const sharpe = (Math.random() * 2 + 0.5).toFixed(2);
    const maxDrawdown = (Math.random() * -25 - 5).toFixed(2);

    return {
      ticker: company.ticker,
      return: parseFloat(finalReturn.toFixed(2)),
      sharpe: parseFloat(sharpe),
      maxDrawdown: parseFloat(maxDrawdown),
      trades: Math.floor(Math.random() * 50) + 20,
      winRate: (Math.random() * 30 + 50).toFixed(1)
    };
  });

  // Generate equity curve
  const equityCurve = [];
  let equity = 10000;
  for (let i = 0; i <= 90; i++) {
    const avgReturn = results.reduce((sum, r) => sum + r.return, 0) / results.length;
    const dailyReturn = avgReturn / 90;
    equity *= (1 + dailyReturn / 100);
    equityCurve.push({
      day: i,
      equity: parseFloat(equity.toFixed(2))
    });
  }

  return { results, equityCurve };
};

export default function TradingPage() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('3M');

  // Backtest state
  const [backtestMode, setBacktestMode] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState<Company[]>([companies[0]]);
  const [backtestRunsToday, setBacktestRunsToday] = useState(0);
  const [strategy, setStrategy] = useState({
    risk: 50,
    momentum: 50,
    value: 50,
    technical: 50
  });
  const [strategyDescription, setStrategyDescription] = useState('');
  const [backtestResults, setBacktestResults] = useState<any>(null);

  const chartData = useMemo(() => {
    const basePrice = selectedCompany.financials.equity / 100;
    return generatePriceData(selectedCompany.ticker, basePrice);
  }, [selectedCompany]);

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[chartData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies.slice(0, 20);
    const term = searchTerm.toLowerCase();
    return companies.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.ticker.toLowerCase().includes(term)
    ).slice(0, 20);
  }, [searchTerm]);

  const currentPlan = PLAN_LIMITS[USER_PLAN as keyof typeof PLAN_LIMITS];
  const canRunBacktest = backtestRunsToday < currentPlan.backtestsPerDay;
  const canAddStock = selectedStocks.length < currentPlan.maxStocks;

  const toggleStockSelection = (company: Company) => {
    if (selectedStocks.find(s => s.ticker === company.ticker)) {
      setSelectedStocks(selectedStocks.filter(s => s.ticker !== company.ticker));
    } else if (canAddStock) {
      setSelectedStocks([...selectedStocks, company]);
    }
  };

  const handleRunBacktest = () => {
    if (!canRunBacktest) return;

    const results = runBacktest(selectedStocks, strategy, strategyDescription);
    setBacktestResults(results);
    setBacktestRunsToday(backtestRunsToday + 1);
  };

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <GlobalTopNav />

      {/* Header */}
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-16 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent-cyan mb-1 flex items-center gap-2">
              <Activity size={24} />
              Advanced Trading & Backtesting
            </h1>
            <p className="text-sm text-text-secondary">
              Customize trading strategies and backtest with real market data
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right">
              <div className={`text-xs font-semibold ${currentPlan.color}`}>{currentPlan.label}</div>
              <div className="text-xs text-text-tertiary">
                {canRunBacktest ? `${currentPlan.backtestsPerDay - backtestRunsToday} tests left today` : 'Limit reached'}
              </div>
            </div>
            <button
              onClick={() => setBacktestMode(!backtestMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                backtestMode
                  ? 'bg-accent-cyan text-black'
                  : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary'
              }`}
            >
              {backtestMode ? 'Chart View' : 'Backtest Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Sidebar - Watchlist */}
        <div className="w-64 border-r border-border-primary bg-[#0A0A0C] overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-text-tertiary mb-2 uppercase">
                {backtestMode ? 'Select Stocks' : 'Watchlist'}
              </h3>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary"/>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-secondary border border-border-primary rounded-lg pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-accent-cyan"
                />
              </div>
              {backtestMode && (
                <div className="text-xs text-text-tertiary mb-2">
                  {selectedStocks.length}/{currentPlan.maxStocks === Infinity ? '∞' : currentPlan.maxStocks} selected
                </div>
              )}
            </div>

            <div className="space-y-1">
              {filteredCompanies.map(company => {
                const isSelected = backtestMode
                  ? selectedStocks.find(s => s.ticker === company.ticker)
                  : selectedCompany.ticker === company.ticker;

                return (
                  <button
                    key={company.ticker}
                    onClick={() => backtestMode ? toggleStockSelection(company) : setSelectedCompany(company)}
                    disabled={backtestMode && !isSelected && !canAddStock}
                    className={`w-full text-left p-2 rounded-lg transition-all text-xs relative ${
                      isSelected
                        ? 'bg-accent-cyan/10 border border-accent-cyan'
                        : 'hover:bg-background-tertiary'
                    } ${backtestMode && !isSelected && !canAddStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-semibold text-text-primary">{company.ticker}</div>
                    <div className="text-text-tertiary text-xs">{company.sector}</div>
                    {backtestMode && !isSelected && !canAddStock && (
                      <Lock className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-accent-magenta" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Chart/Backtest Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!backtestMode ? (
            // Chart View
            <>
              {/* Price Header */}
              <div className="px-6 py-4 border-b border-border-primary bg-[#0A0A0C]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                      {selectedCompany.name} ({selectedCompany.ticker})
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-text-primary">
                        ${currentPrice.toFixed(2)}
                      </span>
                      <span className={`text-lg font-semibold ${priceChange >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                          timeframe === tf
                            ? 'bg-accent-cyan text-black'
                            : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="h-[400px] bg-[#0D0D0F] border border-border-primary rounded-2xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: '#1A1A1F' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        yAxisId="price"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: '#1A1A1F' }}
                        width={60}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <YAxis
                        yAxisId="volume"
                        orientation="right"
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: '#1A1A1F' }}
                        width={60}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1A1A1F', borderRadius: '8px' }}
                        labelStyle={{ color: '#00E5FF' }}
                        formatter={(value: any, name: string) => {
                          if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                          if (name === 'volume') return [`${(value / 1000000).toFixed(2)}M`, 'Volume'];
                          return value;
                        }}
                      />
                      <Area
                        yAxisId="price"
                        type="monotone"
                        dataKey="price"
                        stroke="#00E5FF"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                      <Bar
                        yAxisId="volume"
                        dataKey="volume"
                        fill="#E6007A"
                        opacity={0.3}
                        barSize={4}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Company Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <Card className="text-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign size={16} className="text-accent-cyan" />
                      <h3 className="font-semibold text-text-primary">Revenue</h3>
                    </div>
                    <div className="text-2xl font-bold text-text-primary mb-1">
                      ${selectedCompany.financials.revenue.toLocaleString()}M
                    </div>
                    <div className="text-text-tertiary">Annual</div>
                  </Card>

                  <Card className="text-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-accent-emerald" />
                      <h3 className="font-semibold text-text-primary">Net Income</h3>
                    </div>
                    <div className="text-2xl font-bold text-status-safe mb-1">
                      ${selectedCompany.financials.net_income.toLocaleString()}M
                    </div>
                    <div className="text-text-tertiary">Annual</div>
                  </Card>

                  <Card className="text-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart2 size={16} className="text-accent-magenta" />
                      <h3 className="font-semibold text-text-primary">ICR</h3>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${
                      selectedCompany.ratios?.icr && selectedCompany.ratios.icr > 2.5
                        ? 'text-status-safe'
                        : 'text-status-caution'
                    }`}>
                      {selectedCompany.ratios?.icr?.toFixed(2) || 'N/A'}x
                    </div>
                    <div className="text-text-tertiary">Interest Coverage</div>
                  </Card>

                  <Card className="text-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={16} className="text-accent-cyan" />
                      <h3 className="font-semibold text-text-primary">ROE</h3>
                    </div>
                    <div className="text-2xl font-bold text-accent-cyan mb-1">
                      {selectedCompany.ratios?.roe?.toFixed(1) || 'N/A'}%
                    </div>
                    <div className="text-text-tertiary">Return on Equity</div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            // Backtest View
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {!backtestResults ? (
                <div className="text-center py-12">
                  <Zap size={48} className="text-accent-cyan mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">Ready to Backtest</h3>
                  <p className="text-text-secondary text-sm">
                    Configure your strategy on the right and click Run Backtest
                  </p>
                </div>
              ) : (
                <>
                  {/* Equity Curve */}
                  <Card>
                    <h3 className="text-base font-semibold text-text-primary mb-4">Equity Curve</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={backtestResults.equityCurve} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" />
                          <XAxis
                            dataKey="day"
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#1A1A1F' }}
                          />
                          <YAxis
                            tick={{ fill: '#9CA3AF', fontSize: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#1A1A1F' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0D0D0F', border: '1px solid #1A1A1F', borderRadius: '8px' }}
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Equity']}
                          />
                          <Line
                            type="monotone"
                            dataKey="equity"
                            stroke="#00E5FF"
                            strokeWidth={2}
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Results Table */}
                  <Card>
                    <h3 className="text-base font-semibold text-text-primary mb-4">Performance by Stock</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border-primary">
                            <th className="text-left py-3 text-text-secondary font-semibold">Ticker</th>
                            <th className="text-right py-3 text-text-secondary font-semibold">Return</th>
                            <th className="text-right py-3 text-text-secondary font-semibold">Sharpe</th>
                            <th className="text-right py-3 text-text-secondary font-semibold">Max DD</th>
                            <th className="text-right py-3 text-text-secondary font-semibold">Trades</th>
                            <th className="text-right py-3 text-text-secondary font-semibold">Win Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backtestResults.results.map((result: any) => (
                            <tr key={result.ticker} className="border-b border-border-primary/50">
                              <td className="py-3 font-semibold text-accent-cyan">{result.ticker}</td>
                              <td className={`text-right py-3 font-bold ${
                                result.return >= 0 ? 'text-status-safe' : 'text-status-danger'
                              }`}>
                                {result.return >= 0 ? '+' : ''}{result.return.toFixed(2)}%
                              </td>
                              <td className="text-right py-3 text-text-primary">{result.sharpe}</td>
                              <td className="text-right py-3 text-status-danger">{result.maxDrawdown}%</td>
                              <td className="text-right py-3 text-text-primary">{result.trades}</td>
                              <td className="text-right py-3 text-text-primary">{result.winRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Strategy Customization (only in backtest mode) */}
        {backtestMode && (
          <div className="w-80 border-l border-border-primary bg-[#0A0A0C] overflow-y-auto p-4">
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Settings2 size={16} className="text-accent-cyan" />
                <h3 className="text-sm font-semibold text-text-primary">Strategy Configuration</h3>
              </div>

              <div className="space-y-4">
                {/* Strategy Sliders */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 flex justify-between">
                    <span>Risk Tolerance</span>
                    <span className="font-mono text-accent-cyan">{strategy.risk}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={strategy.risk}
                    onChange={(e) => setStrategy({ ...strategy, risk: parseInt(e.target.value) })}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00E5FF 0%, #00E5FF ${strategy.risk}%, #1A1A1F ${strategy.risk}%, #1A1A1F 100%)`
                    }}
                  />
                  <p className="text-xs text-text-tertiary mt-1">Higher = More aggressive position sizing</p>
                </div>

                <div>
                  <label className="text-xs text-text-secondary mb-2 flex justify-between">
                    <span>Momentum Factor</span>
                    <span className="font-mono text-accent-cyan">{strategy.momentum}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={strategy.momentum}
                    onChange={(e) => setStrategy({ ...strategy, momentum: parseInt(e.target.value) })}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #E6007A 0%, #E6007A ${strategy.momentum}%, #1A1A1F ${strategy.momentum}%, #1A1A1F 100%)`
                    }}
                  />
                  <p className="text-xs text-text-tertiary mt-1">Higher = Follow strong trends</p>
                </div>

                <div>
                  <label className="text-xs text-text-secondary mb-2 flex justify-between">
                    <span>Value Factor</span>
                    <span className="font-mono text-accent-cyan">{strategy.value}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={strategy.value}
                    onChange={(e) => setStrategy({ ...strategy, value: parseInt(e.target.value) })}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${strategy.value}%, #1A1A1F ${strategy.value}%, #1A1A1F 100%)`
                    }}
                  />
                  <p className="text-xs text-text-tertiary mt-1">Higher = Prefer undervalued stocks</p>
                </div>

                <div>
                  <label className="text-xs text-text-secondary mb-2 flex justify-between">
                    <span>Technical Indicators</span>
                    <span className="font-mono text-accent-cyan">{strategy.technical}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={strategy.technical}
                    onChange={(e) => setStrategy({ ...strategy, technical: parseInt(e.target.value) })}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${strategy.technical}%, #1A1A1F ${strategy.technical}%, #1A1A1F 100%)`
                    }}
                  />
                  <p className="text-xs text-text-tertiary mt-1">Higher = Rely on RSI, MACD, etc.</p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">Strategy Description</label>
                  <textarea
                    value={strategyDescription}
                    onChange={(e) => setStrategyDescription(e.target.value)}
                    placeholder="Describe your trading strategy..."
                    className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent-cyan min-h-[80px]"
                  />
                </div>

                {/* Run Button */}
                <button
                  onClick={handleRunBacktest}
                  disabled={!canRunBacktest || selectedStocks.length === 0}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    canRunBacktest && selectedStocks.length > 0
                      ? 'bg-accent-cyan hover:bg-accent-cyan/80 text-black'
                      : 'bg-background-secondary text-text-tertiary cursor-not-allowed'
                  }`}
                >
                  <Play size={16} />
                  Run Backtest
                </button>

                {!canRunBacktest && (
                  <div className="p-3 bg-accent-magenta/10 border border-accent-magenta rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock size={14} className="text-accent-magenta" />
                      <span className="text-xs font-semibold text-accent-magenta">Daily Limit Reached</span>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Upgrade to Pro for unlimited backtests and more stocks
                    </p>
                  </div>
                )}

                {/* Plan Info */}
                <div className="pt-4 border-t border-border-primary">
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Current Plan:</span>
                      <span className={`font-semibold ${currentPlan.color}`}>{currentPlan.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Tests Today:</span>
                      <span className="text-text-primary font-mono">
                        {backtestRunsToday}/{currentPlan.backtestsPerDay === Infinity ? '∞' : currentPlan.backtestsPerDay}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Max Stocks:</span>
                      <span className="text-text-primary font-mono">
                        {currentPlan.maxStocks === Infinity ? '∞' : currentPlan.maxStocks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
