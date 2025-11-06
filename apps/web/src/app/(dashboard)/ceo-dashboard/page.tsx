'use client';

import React, { useState } from 'react';
import InteractiveCard from '@/components/ui/InteractiveCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BarChart3, Rocket, TrendingUp, Users, DollarSign, Target, CheckCircle, Clock, Circle } from 'lucide-react';

type DashboardTab = 'project' | 'users' | 'revenue' | 'teams';

// Admin Dashboard Data
const adminMetrics = {
  totalUsers: 14000,
  activeUsers: 10500,
  freeUsers: 10000,
  proUsers: 3000,
  premiumUsers: 600,
  institutionalUsers: 40,
  monthlyRevenue: 51963.60,
  monthlyUsingCost: 25118.80,
  monthlyProfit: 26844.80,
  profitMargin: 51.6,
  breakEvenUsers: 1850,
  currentPhase: '2.1',
};

const teamCapacityData = [
  { role: 'Market Structuring', progress: 100, status: 'completed' as const, team: 'Ontology' },
  { role: 'Sector Analysis', progress: 75, status: 'in_progress' as const, team: 'Research' },
  { role: 'Fundamental AI', progress: 0, status: 'pending' as const, team: 'AI' },
  { role: 'Technical AI', progress: 0, status: 'pending' as const, team: 'AI' },
  { role: 'Quant Engine', progress: 50, status: 'in_progress' as const, team: 'Backend' },
  { role: 'Data Pipeline', progress: 46, status: 'in_progress' as const, team: 'Data' },
  { role: 'SimViz', progress: 40, status: 'in_progress' as const, team: 'Frontend' },
  { role: 'UI/Frontend', progress: 55, status: 'in_progress' as const, team: 'Frontend' },
];

const dataCoverageData = [
  { sector: 'Banking', current: 7, total: 10, percentage: 70 },
  { sector: 'Real Estate', current: 7, total: 15, percentage: 47 },
  { sector: 'Manufacturing', current: 5, total: 10, percentage: 50 },
  { sector: 'Semiconductors', current: 4, total: 10, percentage: 40 },
  { sector: 'Options', current: 0, total: 5, percentage: 0 },
];

const phasesData = [
  { phase: 'Phase 2.1 - Platform Refactor', status: 'completed' as const, completion: 100 },
  { phase: 'Phase 2.2 - Community System', status: 'in_progress' as const, completion: 30 },
  { phase: 'Phase 2.3 - Knowledge Base', status: 'pending' as const, completion: 0 },
  { phase: 'Phase 2.4 - Simulation Platform', status: 'pending' as const, completion: 0 },
  { phase: 'Phase 2.5 - Trading Bot Arena', status: 'pending' as const, completion: 0 },
];

const revenueBreakdown = [
  { tier: 'Free', users: 10000, revenue: 0, apiCost: 0, infrastructureCost: 1.05, profit: -10500 },
  { tier: 'Pro', users: 3000, revenue: 29970, apiCost: 450, infrastructureCost: 4500, profit: 25020 },
  { tier: 'Premium', users: 600, revenue: 17994, apiCost: 6102, infrastructureCost: 1800, profit: 10092 },
  { tier: 'Institutional', users: 40, revenue: 3999.60, apiCost: 1446.80, infrastructureCost: 320, profit: 2232.80 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-status-safe';
    case 'in_progress':
      return 'text-status-caution';
    default:
      return 'text-text-tertiary';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-status-safe/10';
    case 'in_progress':
      return 'bg-status-caution/10';
    default:
      return 'bg-background-tertiary';
  }
};

const getProgressBarColor = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-status-safe';
        case 'in_progress': return 'bg-status-caution';
        default: return 'bg-text-tertiary';
    }
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('project');
  const overallProgress = Math.round(
    (teamCapacityData.reduce((sum, item) => sum + item.progress, 0) / (teamCapacityData.length * 100)) * 100
  );

  const userConversionRate = ((adminMetrics.proUsers + adminMetrics.premiumUsers + adminMetrics.institutionalUsers) / adminMetrics.totalUsers * 100).toFixed(1);
  const breakEvenPercentage = Math.round((adminMetrics.breakEvenUsers / adminMetrics.totalUsers) * 100);

  return (
    <>
      <div className="min-h-screen bg-black text-text-primary flex flex-col relative z-10">
        {/* Header */}
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-cyan">Admin Dashboard</h1>
              <p className="text-xs text-text-secondary mt-1">Platform Operations & Business Metrics</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-text-secondary">Platform Status</p>
              <p className="text-2xl font-bold text-accent-emerald">Live</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-t border-border-primary pt-4">
            {(['project', 'users', 'revenue', 'teams'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded text-xs font-mono transition-colors ${
                  activeTab === tab
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary border border-border-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Dynamic Content Based on Active Tab */}

            {/* PROJECT TAB */}
            {activeTab === 'project' && (
              <>
                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <BarChart3 size={20} /> Project Progress
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-text-secondary">Overall Completion</span>
                          <span className="text-sm font-mono text-accent-cyan">{overallProgress}%</span>
                        </div>
                        <ProgressBar value={overallProgress} gradient={true} />
                      </div>

                      <div className="bg-background-tertiary rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Current Phase:</span>
                          <span className="text-text-primary font-semibold">{adminMetrics.currentPhase}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Status:</span>
                          <span className="text-status-caution font-semibold">In Progress</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Last Updated:</span>
                          <span className="text-accent-cyan font-mono">Nov 4, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>

                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Rocket size={20} />Phase Roadmap</h3>
                    <div className="space-y-3">
                      {phasesData.map((p, idx) => (
                        <div key={idx} className={`p-2 rounded transition-colors ${getStatusBg(p.status)}`}>
                          <div className="flex items-start gap-2 mb-2">
                            <span className={`flex-shrink-0 ${getStatusColor(p.status)}`}>
                              {p.status === 'completed' ? <CheckCircle size={16} /> : p.status === 'in_progress' ? <Clock size={16} /> : <Circle size={16} />}
                            </span>
                            <span className={`text-xs font-semibold ${getStatusColor(p.status)}`}>
                              {p.phase}
                            </span>
                          </div>
                          <ProgressBar value={p.completion} color={getProgressBarColor(p.status)} height="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </InteractiveCard>

                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><TrendingUp size={20} />Data Coverage</h3>
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-background-tertiary rounded-lg mb-3">
                        <span className="text-xs text-text-secondary">Total Companies</span>
                        <p className="text-2xl font-bold text-accent-cyan">
                          {dataCoverageData.reduce((sum, item) => sum + item.current, 0)}/
                          {dataCoverageData.reduce((sum, item) => sum + item.total, 0)}
                        </p>
                      </div>

                      {dataCoverageData.map(item => (
                        <div key={item.sector}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-secondary">{item.sector}</span>
                            <span className="text-xs font-mono text-accent-cyan">
                              {item.current}/{item.total} ({item.percentage}%)
                            </span>
                          </div>
                          <ProgressBar value={item.percentage} color="bg-status-safe" height="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </InteractiveCard>
              </>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <>
                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Users size={20} />User Metrics</h3>
                    <div className="space-y-3">
                      <div className="bg-background-tertiary rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Total Users:</span>
                          <span className="text-text-primary font-semibold">{adminMetrics.totalUsers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Active Users:</span>
                          <span className="text-accent-emerald font-semibold">{adminMetrics.activeUsers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Conversion Rate:</span>
                          <span className="text-accent-cyan font-semibold">{userConversionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Break-even Target:</span>
                          <span className="text-accent-cyan font-semibold">{adminMetrics.breakEvenUsers.toLocaleString()} ({breakEvenPercentage}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>

                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><BarChart3 size={20} />Tier Distribution</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-secondary">Free</span>
                            <span className="text-xs font-mono text-accent-cyan">{adminMetrics.freeUsers.toLocaleString()} users</span>
                          </div>
                          <ProgressBar value={71} color="bg-text-tertiary" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-secondary">Pro</span>
                            <span className="text-xs font-mono text-accent-cyan">{adminMetrics.proUsers.toLocaleString()} users</span>
                          </div>
                          <ProgressBar value={21} color="bg-status-caution" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-secondary">Premium</span>
                            <span className="text-xs font-mono text-accent-cyan">{adminMetrics.premiumUsers.toLocaleString()} users</span>
                          </div>
                          <ProgressBar value={4.2} color="bg-status-safe" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-text-secondary">Institutional</span>
                            <span className="text-xs font-mono text-accent-cyan">{adminMetrics.institutionalUsers} users</span>
                          </div>
                          <ProgressBar value={0.3} color="bg-accent-emerald" />
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              </>
            )}

            {/* REVENUE TAB */}
            {activeTab === 'revenue' && (
              <>
                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><DollarSign size={20} />Revenue Summary</h3>
                    <div className="space-y-3">
                      <div className="bg-background-tertiary rounded-lg p-3 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Monthly Revenue:</span>
                          <span className="text-accent-emerald font-semibold">${adminMetrics.monthlyRevenue.toLocaleString('en-US', {maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Monthly Costs:</span>
                          <span className="text-status-caution font-semibold">${adminMetrics.monthlyUsingCost.toLocaleString('en-US', {maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between border-t border-border-primary pt-2">
                          <span className="text-text-secondary">Monthly Profit:</span>
                          <span className="text-accent-emerald font-bold">${adminMetrics.monthlyProfit.toLocaleString('en-US', {maximumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Profit Margin:</span>
                          <span className="text-accent-cyan font-semibold">{adminMetrics.profitMargin}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>

                <InteractiveCard intensity={15} glow={true}>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><BarChart3 size={20} />Tier Breakdown</h3>
                    <div className="space-y-3 text-xs">
                      {revenueBreakdown.map((tier) => (
                        <div key={tier.tier} className="border-b border-border-primary pb-2 last:border-0">
                          <div className="font-semibold text-text-primary mb-1">{tier.tier}</div>
                          <div className="grid grid-cols-2 gap-2 text-text-secondary">
                            <div className="flex justify-between">
                              <span>Users:</span>
                              <span className="text-text-primary">{tier.users.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Revenue:</span>
                              <span className="text-accent-emerald">${tier.revenue.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>API Cost:</span>
                              <span className="text-status-caution">${tier.apiCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Profit:</span>
                              <span className={tier.profit > 0 ? 'text-accent-emerald' : 'text-status-caution'}>${tier.profit.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </InteractiveCard>
              </>
            )}

            {/* TEAMS TAB */}
            {activeTab === 'teams' && (
              <InteractiveCard intensity={15} glow={true} className="lg:col-span-2">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Target size={20} />Team Capacity</h3>
                  <div className="space-y-4">
                    {teamCapacityData.map(item => (
                      <div key={item.role}>
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <span className="text-xs text-text-secondary">{item.role}</span>
                            <span className="text-xs text-text-tertiary ml-2">({item.team})</span>
                          </div>
                          <span className={`text-xs font-mono ${getStatusColor(item.status)}`}>
                            {item.progress}%
                          </span>
                        </div>
                        <ProgressBar value={item.progress} color={getProgressBarColor(item.status)} />
                      </div>
                    ))}
                  </div>
                </div>
              </InteractiveCard>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
