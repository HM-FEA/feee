'use client';

import React, { useState } from 'react';
import HedgeFundSimulator from '@/components/simulation/HedgeFundSimulator';
import { Briefcase, TrendingUp, Shield, Wallet, BarChart3, Target } from 'lucide-react';

/**
 * Portfolio Manager - Personal Portfolio Management & Analysis
 *
 * Separated from Simulation as personal investment management tool
 * Features:
 * - Hedge Fund strategies (6 types)
 * - Risk management (VaR, CVaR, Stress Tests)
 * - Personal portfolio tracking
 * - Performance analytics
 */

type TabType = 'hedge-fund' | 'portfolio' | 'performance' | 'risk';

export default function PortfolioManagerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hedge-fund');

  const tabs = [
    { id: 'hedge-fund' as TabType, label: 'Hedge Fund Strategy', icon: <Briefcase size={18} /> },
    { id: 'portfolio' as TabType, label: 'My Portfolio', icon: <Wallet size={18} /> },
    { id: 'performance' as TabType, label: 'Performance', icon: <TrendingUp size={18} /> },
    { id: 'risk' as TabType, label: 'Risk Analysis', icon: <Shield size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="bg-background-secondary border-b border-border-primary">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase size={32} className="text-accent-cyan" />
            <h1 className="text-3xl font-bold text-text-primary">Portfolio Manager</h1>
          </div>
          <p className="text-text-secondary">
            Personal portfolio management with institutional-grade hedge fund strategies
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background-secondary border-b border-border-primary">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium
                  border-b-2 transition-all
                  ${
                    activeTab === tab.id
                      ? 'border-accent-cyan text-accent-cyan'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {activeTab === 'hedge-fund' && (
          <div>
            <HedgeFundSimulator />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-background-secondary border border-border-primary rounded-lg p-8">
            <div className="text-center">
              <Wallet size={64} className="mx-auto text-text-tertiary mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">My Portfolio</h2>
              <p className="text-text-secondary mb-6">
                Track your personal holdings and positions
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-text-primary">$125,480</div>
                  <div className="text-status-safe text-sm mt-1">+12.4% (All time)</div>
                </div>
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">Today's P&L</div>
                  <div className="text-2xl font-bold text-status-safe">+$1,245</div>
                  <div className="text-status-safe text-sm mt-1">+0.99%</div>
                </div>
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">Cash Available</div>
                  <div className="text-2xl font-bold text-text-primary">$24,500</div>
                  <div className="text-text-tertiary text-sm mt-1">19.5% allocation</div>
                </div>
              </div>
              <div className="mt-8 text-text-tertiary text-sm">
                <p>Feature coming soon: Full portfolio tracking with real-time updates</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-background-secondary border border-border-primary rounded-lg p-8">
            <div className="text-center">
              <BarChart3 size={64} className="mx-auto text-text-tertiary mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Performance Analytics</h2>
              <p className="text-text-secondary mb-6">
                Detailed performance metrics and attribution analysis
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-background-tertiary p-4 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-xs mb-1">1M Return</div>
                  <div className="text-xl font-bold text-status-safe">+3.2%</div>
                </div>
                <div className="bg-background-tertiary p-4 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-xs mb-1">YTD Return</div>
                  <div className="text-xl font-bold text-status-safe">+12.4%</div>
                </div>
                <div className="bg-background-tertiary p-4 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-xs mb-1">Sharpe Ratio</div>
                  <div className="text-xl font-bold text-text-primary">1.85</div>
                </div>
                <div className="bg-background-tertiary p-4 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-xs mb-1">Max Drawdown</div>
                  <div className="text-xl font-bold text-status-danger">-5.2%</div>
                </div>
              </div>
              <div className="mt-8 text-text-tertiary text-sm">
                <p>Feature coming soon: Performance charts, attribution analysis, and benchmarking</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="bg-background-secondary border border-border-primary rounded-lg p-8">
            <div className="text-center">
              <Shield size={64} className="mx-auto text-text-tertiary mb-4" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Risk Analysis</h2>
              <p className="text-text-secondary mb-6">
                Comprehensive risk metrics and stress testing
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">VaR (95%)</div>
                  <div className="text-2xl font-bold text-status-warning">-$3,245</div>
                  <div className="text-text-tertiary text-sm mt-1">Daily risk</div>
                </div>
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">Beta</div>
                  <div className="text-2xl font-bold text-text-primary">0.85</div>
                  <div className="text-text-tertiary text-sm mt-1">vs S&P 500</div>
                </div>
                <div className="bg-background-tertiary p-6 rounded-lg border border-border-secondary">
                  <div className="text-text-tertiary text-sm mb-1">Volatility</div>
                  <div className="text-2xl font-bold text-text-primary">12.5%</div>
                  <div className="text-text-tertiary text-sm mt-1">Annualized</div>
                </div>
              </div>
              <div className="mt-8 text-text-tertiary text-sm">
                <p>Feature coming soon: Stress tests, scenario analysis, and correlation matrices</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
