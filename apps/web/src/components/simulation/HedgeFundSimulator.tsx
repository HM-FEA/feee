'use client';

import React, { useState, useMemo } from 'react';
import { Card, Button } from '@/components/ui/DesignSystem';
import { TrendingUp, DollarSign, Activity, Target, Zap, Shield } from 'lucide-react';
import {
  Portfolio,
  tangencyPortfolio,
  riskParityPortfolio,
  minimumVariancePortfolio,
  analyzePortfolio,
} from '@/lib/financial/portfolioOptimization';
import {
  VaRResult,
  portfolioVaR,
  stressTest,
  STRESS_SCENARIOS,
  StressTestResult,
} from '@/lib/financial/riskMetrics';
import {
  blackScholes,
  OptionPriceResult,
} from '@/lib/financial/blackScholes';

/**
 * Hedge Fund Strategies
 */
const HEDGE_FUND_STRATEGIES = {
  'long-short-equity': {
    name: 'Long/Short Equity',
    description: 'Buy undervalued stocks, short overvalued stocks. Market neutral.',
    typicalReturn: 0.12, // 12% annual
    volatility: 0.08,
    sharpe: 1.5,
    beta: 0.3,
    leverage: 2.0,
  },
  'global-macro': {
    name: 'Global Macro',
    description: 'Trade currencies, bonds, commodities based on macro trends.',
    typicalReturn: 0.15,
    volatility: 0.12,
    sharpe: 1.25,
    beta: 0.1,
    leverage: 3.0,
  },
  'event-driven': {
    name: 'Event-Driven',
    description: 'Merger arbitrage, distressed debt, special situations.',
    typicalReturn: 0.10,
    volatility: 0.06,
    sharpe: 1.67,
    beta: 0.4,
    leverage: 1.5,
  },
  'cta-trend-following': {
    name: 'CTA Trend Following',
    description: 'Momentum strategies across futures markets.',
    typicalReturn: 0.18,
    volatility: 0.15,
    sharpe: 1.2,
    beta: 0.0,
    leverage: 4.0,
  },
  'multi-strategy': {
    name: 'Multi-Strategy',
    description: 'Combine multiple strategies for diversification.',
    typicalReturn: 0.11,
    volatility: 0.07,
    sharpe: 1.57,
    beta: 0.2,
    leverage: 2.5,
  },
  'stat-arb': {
    name: 'Statistical Arbitrage',
    description: 'Quantitative mean-reversion strategies.',
    typicalReturn: 0.09,
    volatility: 0.05,
    sharpe: 1.8,
    beta: 0.15,
    leverage: 5.0,
  },
};

interface HedgeFundSimulatorProps {
  initialCapital?: number;
}

export default function HedgeFundSimulator({
  initialCapital = 100_000_000, // $100M AUM
}: HedgeFundSimulatorProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<keyof typeof HEDGE_FUND_STRATEGIES>('long-short-equity');
  const [aum, setAum] = useState(initialCapital);
  const [leverage, setLeverage] = useState(2.0);
  const [managementFee, setManagementFee] = useState(0.02); // 2%
  const [performanceFee, setPerformanceFee] = useState(0.20); // 20%
  const [isRunning, setIsRunning] = useState(false);

  const strategy = HEDGE_FUND_STRATEGIES[selectedStrategy];

  // Generate synthetic returns for selected strategy
  const syntheticReturns = useMemo(() => {
    const returns: number[] = [];
    for (let i = 0; i < 252; i++) {
      // Daily for 1 year
      const dailyReturn = strategy.typicalReturn / 252 +
        (Math.random() - 0.5) * strategy.volatility * Math.sqrt(1/252) * 2;
      returns.push(dailyReturn);
    }
    return returns;
  }, [selectedStrategy]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    // Benchmark (S&P 500 approximation)
    const benchmarkReturns = Array(252).fill(0).map(() =>
      0.10 / 252 + (Math.random() - 0.5) * 0.16 * Math.sqrt(1/252) * 2
    );

    return analyzePortfolio(syntheticReturns, benchmarkReturns, 0.03, 252);
  }, [syntheticReturns]);

  // Calculate VaR
  const var95 = useMemo(() => {
    return portfolioVaR([[...syntheticReturns]], [1.0], 0.95, 1, 'historical');
  }, [syntheticReturns]);

  const var99 = useMemo(() => {
    return portfolioVaR([[...syntheticReturns]], [1.0], 0.99, 1, 'historical');
  }, [syntheticReturns]);

  // Stress test
  const stressResults = useMemo(() => {
    const results: { [key: string]: StressTestResult } = {};
    Object.entries(STRESS_SCENARIOS).forEach(([key, scenario]) => {
      // Simplified: apply shock to strategy
      const shockReturn = -scenario.shocks[0] * strategy.beta;
      results[key] = {
        scenario: scenario.name,
        portfolioReturn: shockReturn,
        portfolioValue: 1 + shockReturn,
        maxDrawdown: Math.abs(shockReturn),
        duration: scenario.duration,
        assetReturns: { [strategy.name]: shockReturn },
      };
    });
    return results;
  }, [selectedStrategy]);

  // Calculate fees
  const annualManagementFee = aum * managementFee;
  const annualReturn = aum * portfolioMetrics.expectedReturn;
  const performanceFeeAmount = Math.max(0, annualReturn * performanceFee);
  const netReturn = annualReturn - annualManagementFee - performanceFeeAmount;

  // Run simulation
  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setAum(aum * (1 + portfolioMetrics.expectedReturn));
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Shield className="text-accent-magenta" size={24} />
            Hedge Fund Strategy Simulator
          </h2>
          <p className="text-sm text-text-tertiary">
            Simulate institutional-grade hedge fund strategies with leverage and risk management
          </p>
        </div>
        <Button onClick={runSimulation} disabled={isRunning}>
          <Zap size={16} className="mr-1" />
          {isRunning ? 'Running...' : 'Run 1Y Simulation'}
        </Button>
      </div>

      {/* AUM Card */}
      <Card className="bg-gradient-to-r from-accent-magenta/20 to-accent-cyan/20 border-2 border-accent-magenta/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-text-tertiary mb-1">Assets Under Management</div>
            <div className="text-4xl font-bold text-accent-magenta font-mono">
              ${(aum / 1_000_000).toFixed(1)}M
            </div>
            <div className="text-sm text-text-secondary mt-2">
              Net Return: ${(netReturn / 1_000_000).toFixed(2)}M/year
            </div>
          </div>
          <DollarSign size={60} className="text-accent-magenta opacity-30" />
        </div>
      </Card>

      {/* Strategy Selection */}
      <Card className="bg-background-secondary">
        <div className="text-sm font-semibold text-text-primary mb-3">Strategy Selection</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(HEDGE_FUND_STRATEGIES).map(([key, strat]) => (
            <button
              key={key}
              onClick={() => setSelectedStrategy(key as any)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedStrategy === key
                  ? 'bg-accent-magenta/20 border-accent-magenta'
                  : 'bg-background-tertiary border-border-primary hover:border-accent-magenta/50'
              }`}
            >
              <div className="font-semibold text-text-primary text-sm mb-1">
                {strat.name}
              </div>
              <div className="text-xs text-text-secondary mb-2">{strat.description}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-tertiary">Return:</span>
                  <span className="ml-1 font-mono text-accent-emerald">
                    {(strat.typicalReturn * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary">Sharpe:</span>
                  <span className="ml-1 font-mono text-accent-cyan">
                    {strat.sharpe.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary">Vol:</span>
                  <span className="ml-1 font-mono text-accent-yellow">
                    {(strat.volatility * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary">Beta:</span>
                  <span className="ml-1 font-mono text-text-primary">
                    {strat.beta.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Annual Return</div>
          <div className="text-2xl font-bold text-accent-emerald">
            {(portfolioMetrics.expectedReturn * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-text-secondary mt-1">
            vs {(strategy.typicalReturn * 100).toFixed(0)}% target
          </div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Sharpe Ratio</div>
          <div className="text-2xl font-bold text-accent-cyan">
            {portfolioMetrics.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1">Risk-adjusted</div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Max Drawdown</div>
          <div className="text-2xl font-bold text-red-400">
            {(portfolioMetrics.maxDrawdown! * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-text-secondary mt-1">Peak-to-trough</div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Alpha</div>
          <div className="text-2xl font-bold text-accent-magenta">
            {(portfolioMetrics.alpha! * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-text-secondary mt-1">vs S&P 500</div>
        </Card>
      </div>

      {/* Risk Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Value at Risk */}
        <Card className="bg-background-secondary">
          <div className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Target size={16} className="text-accent-yellow" />
            Value at Risk (VaR)
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-background-tertiary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-tertiary">95% VaR (1-day)</span>
                <span className="text-lg font-bold text-accent-yellow font-mono">
                  ${(var95.var * aum / 100).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-text-secondary">
                95% confidence: Daily loss won't exceed this
              </div>
            </div>

            <div className="p-3 bg-background-tertiary rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-tertiary">99% VaR (1-day)</span>
                <span className="text-lg font-bold text-red-400 font-mono">
                  ${(var99.var * aum / 100).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-text-secondary">
                99% confidence: Extreme loss threshold
              </div>
            </div>

            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-tertiary">CVaR (Expected Shortfall)</span>
                <span className="text-lg font-bold text-red-400 font-mono">
                  ${(var95.cvar * aum / 100).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-text-secondary">
                Average loss when VaR is exceeded
              </div>
            </div>
          </div>
        </Card>

        {/* Stress Tests */}
        <Card className="bg-background-secondary">
          <div className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Activity size={16} className="text-red-400" />
            Stress Test Scenarios
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(stressResults).slice(0, 5).map(([key, result]) => (
              <div
                key={key}
                className="p-3 bg-background-tertiary rounded-lg border border-border-primary"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-primary">
                    {result.scenario}
                  </span>
                  <span className={`text-sm font-bold font-mono ${
                    result.portfolioReturn < 0 ? 'text-red-400' : 'text-accent-emerald'
                  }`}>
                    {(result.portfolioReturn * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">Portfolio Value</span>
                  <span className="font-mono text-text-secondary">
                    ${((aum * result.portfolioValue) / 1_000_000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-text-tertiary">Max Drawdown</span>
                  <span className="font-mono text-red-400">
                    {(result.maxDrawdown * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fee Structure */}
      <Card className="bg-background-secondary">
        <div className="text-sm font-semibold text-text-primary mb-3">
          Fee Structure (2 and 20)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-background-tertiary rounded-lg">
            <div className="text-xs text-text-tertiary mb-1">Management Fee (2%)</div>
            <div className="text-xl font-bold text-accent-cyan font-mono">
              ${(annualManagementFee / 1_000_000).toFixed(2)}M/year
            </div>
            <div className="text-xs text-text-secondary mt-1">
              Charged on AUM regardless of performance
            </div>
          </div>

          <div className="p-3 bg-background-tertiary rounded-lg">
            <div className="text-xs text-text-tertiary mb-1">Performance Fee (20%)</div>
            <div className="text-xl font-bold text-accent-magenta font-mono">
              ${(performanceFeeAmount / 1_000_000).toFixed(2)}M/year
            </div>
            <div className="text-xs text-text-secondary mt-1">
              20% of profits above high-water mark
            </div>
          </div>

          <div className="p-3 bg-accent-emerald/10 border border-accent-emerald/30 rounded-lg">
            <div className="text-xs text-text-tertiary mb-1">Net Return (After Fees)</div>
            <div className="text-xl font-bold text-accent-emerald font-mono">
              ${(netReturn / 1_000_000).toFixed(2)}M/year
            </div>
            <div className="text-xs text-text-secondary mt-1">
              Investor net profit: {((netReturn / aum) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Leverage & Parameters */}
      <Card className="bg-background-secondary">
        <div className="text-sm font-semibold text-text-primary mb-3">
          Strategy Parameters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-tertiary mb-2 block">
              Leverage: {leverage.toFixed(1)}x
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={leverage}
              onChange={(e) => setLeverage(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-text-secondary mt-1">
              Recommended: {strategy.leverage.toFixed(1)}x for {strategy.name}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-text-tertiary">Key Metrics with Leverage</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-background-tertiary rounded">
                <span className="text-text-tertiary">Levered Return:</span>
                <span className="ml-1 font-mono text-accent-emerald">
                  {(portfolioMetrics.expectedReturn * leverage * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2 bg-background-tertiary rounded">
                <span className="text-text-tertiary">Levered Vol:</span>
                <span className="ml-1 font-mono text-accent-yellow">
                  {(portfolioMetrics.volatility * leverage * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
