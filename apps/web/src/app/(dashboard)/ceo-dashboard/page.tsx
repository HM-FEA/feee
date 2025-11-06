'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus, Edit2, Trash2, Search, Filter, Network, Database,
  TrendingUp, Building2, Sliders, GitBranch, ChevronDown, ChevronRight,
  CheckCircle, AlertCircle, Info, BarChart3, Globe
} from 'lucide-react';
import {
  MACRO_VARIABLES,
  MACRO_CATEGORIES,
  MacroCategory,
  getVariablesByCategory
} from '@/data/macroVariables';
import { companies, Company } from '@/data/companies';

type AdminTab = 'overview' | 'companies' | 'macros' | 'connections' | 'add-data';
type ViewMode = 'list' | 'grid' | 'circuit';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-4 ${className}`}>
    {children}
  </div>
);

// Sector colors for visualization
const SECTOR_COLORS: Record<string, string> = {
  BANKING: '#06B6D4',
  REALESTATE: '#00FF9F',
  MANUFACTURING: '#8B5CF6',
  SEMICONDUCTOR: '#F59E0B',
  DEFAULT: '#9CA3AF'
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Statistics
  const stats = useMemo(() => {
    const totalCompanies = companies.length;
    const sectorCounts = companies.reduce((acc, c) => {
      acc[c.sector] = (acc[c.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgICR = companies.reduce((sum, c) => sum + (c.ratios?.icr || 0), 0) / totalCompanies;
    const healthyCompanies = companies.filter(c => (c.ratios?.icr || 0) > 2.5).length;

    return {
      totalCompanies,
      sectorCounts,
      totalMacroVariables: MACRO_VARIABLES.length,
      totalSectors: Object.keys(sectorCounts).length,
      avgICR: avgICR.toFixed(2),
      healthyCompanies,
      healthPercentage: ((healthyCompanies / totalCompanies) * 100).toFixed(1)
    };
  }, []);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [searchTerm, selectedSector]);

  const toggleCategory = (category: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  return (
    <div className="min-h-screen bg-black text-text-primary">
      {/* Header */}
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-light text-accent-cyan mb-1">Admin Dashboard</h1>
            <p className="text-xs text-text-secondary font-light">
              Comprehensive Data Management & System Overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-text-tertiary">Total Companies</div>
              <div className="text-2xl font-light text-accent-cyan">{stats.totalCompanies}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-tertiary">Macro Variables</div>
              <div className="text-2xl font-light text-accent-magenta">{stats.totalMacroVariables}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-tertiary">Health Score</div>
              <div className="text-2xl font-light text-accent-emerald">{stats.healthPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['overview', 'companies', 'macros', 'connections', 'add-data'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-light whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary border border-border-primary hover:border-[#2A2A3F]'
              }`}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
            {/* System Health */}
            <Card className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-accent-cyan" />
                <h3 className="text-base font-semibold text-text-primary">System Overview</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Total Companies</div>
                  <div className="text-2xl font-bold text-text-primary">{stats.totalCompanies}</div>
                </div>
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Sectors</div>
                  <div className="text-2xl font-bold text-accent-cyan">{stats.totalSectors}</div>
                </div>
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Healthy (ICR&gt;2.5)</div>
                  <div className="text-2xl font-bold text-accent-emerald">{stats.healthyCompanies}</div>
                </div>
                <div className="bg-background-secondary rounded-lg p-3">
                  <div className="text-xs text-text-tertiary mb-1">Avg ICR</div>
                  <div className="text-2xl font-bold text-accent-magenta">{stats.avgICR}x</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-text-primary">Sector Distribution</h4>
                {Object.entries(stats.sectorCounts).map(([sector, count]) => (
                  <div key={sector}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-text-secondary">{sector}</span>
                      <span className="text-xs font-mono text-accent-cyan">
                        {count} ({((count / stats.totalCompanies) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${(count / stats.totalCompanies) * 100}%`,
                          backgroundColor: SECTOR_COLORS[sector] || SECTOR_COLORS.DEFAULT
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Plus size={18} className="text-accent-emerald" />
                <h3 className="text-base font-semibold text-text-primary">Quick Actions</h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('add-data')}
                  className="w-full px-4 py-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan rounded-lg text-sm text-accent-cyan transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add New Company
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className="w-full px-4 py-3 bg-accent-magenta/10 hover:bg-accent-magenta/20 border border-accent-magenta rounded-lg text-sm text-accent-magenta transition-all flex items-center gap-2"
                >
                  <GitBranch size={16} />
                  View Connections
                </button>
                <button
                  onClick={() => setActiveTab('macros')}
                  className="w-full px-4 py-3 bg-accent-emerald/10 hover:bg-accent-emerald/20 border border-accent-emerald rounded-lg text-sm text-accent-emerald transition-all flex items-center gap-2"
                >
                  <Sliders size={16} />
                  Configure Macros
                </button>
              </div>

              <div className="mt-6 p-3 bg-background-secondary rounded-lg">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-accent-cyan mt-0.5" />
                  <div className="text-xs text-text-secondary">
                    <p className="font-semibold text-text-primary mb-1">System Status</p>
                    <p>All data pipelines operational. Last sync: 2 minutes ago.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Macro Variables Summary */}
            <Card className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-accent-magenta" />
                <h3 className="text-base font-semibold text-text-primary">Macro Variables Summary</h3>
                <span className="text-xs text-text-tertiary">({MACRO_VARIABLES.length} total)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(MACRO_CATEGORIES).map(([key, category]) => {
                  const vars = getVariablesByCategory(key as MacroCategory);
                  return (
                    <div key={key} className="bg-background-secondary rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{category.icon}</span>
                        <span className="text-xs font-semibold text-text-primary">{category.label}</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: category.color }}>
                        {vars.length}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        {vars[0]?.name || 'Variables'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <div className="max-w-7xl">
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-background-secondary border border-border-primary rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
              >
                <option value="all">All Sectors</option>
                {Object.keys(stats.sectorCounts).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>

              <div className="flex gap-2 border-l border-border-primary pl-4">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                  <Database size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-tertiary hover:text-text-primary'}`}
                >
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>

            {/* Companies List */}
            <div className="space-y-3">
              {filteredCompanies.map(company => (
                <Card key={company.ticker} className="hover:border-[#2A2A3F] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: SECTOR_COLORS[company.sector] || SECTOR_COLORS.DEFAULT }}
                      >
                        {company.ticker.substring(0, 2)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-text-primary">{company.name}</h4>
                          <span className="px-2 py-0.5 bg-background-secondary text-text-tertiary text-xs rounded">
                            {company.ticker}
                          </span>
                          <span
                            className="px-2 py-0.5 text-xs rounded"
                            style={{
                              backgroundColor: `${SECTOR_COLORS[company.sector]}20`,
                              color: SECTOR_COLORS[company.sector]
                            }}
                          >
                            {company.sector}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-text-tertiary">Revenue:</span>
                            <span className="ml-2 font-mono text-text-primary">
                              ${company.financials.revenue.toLocaleString()}M
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Net Income:</span>
                            <span className="ml-2 font-mono text-text-primary">
                              ${company.financials.net_income.toLocaleString()}M
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">ICR:</span>
                            <span className={`ml-2 font-mono font-semibold ${
                              (company.ratios?.icr || 0) > 2.5 ? 'text-accent-emerald' :
                              (company.ratios?.icr || 0) > 2 ? 'text-status-caution' : 'text-status-danger'
                            }`}>
                              {company.ratios?.icr?.toFixed(2) || 'N/A'}x
                            </span>
                          </div>
                          <div>
                            <span className="text-text-tertiary">Debt:</span>
                            <span className="ml-2 font-mono text-text-primary">
                              ${company.financials.total_debt.toLocaleString()}M
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 text-text-tertiary hover:text-accent-cyan transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-text-tertiary hover:text-status-danger transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <Database size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                <p className="text-text-secondary">No companies found matching your criteria</p>
              </div>
            )}
          </div>
        )}

        {/* MACROS TAB */}
        {activeTab === 'macros' && (
          <div className="max-w-7xl">
            <div className="mb-6">
              <h2 className="text-xl font-light text-text-primary mb-2">Macro Variables Configuration</h2>
              <p className="text-sm text-text-secondary">
                Manage all {MACRO_VARIABLES.length} macro variables across {Object.keys(MACRO_CATEGORIES).length} categories
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(MACRO_CATEGORIES).map(([categoryKey, category]) => {
                const isExpanded = expandedCategories.has(categoryKey);
                const variables = getVariablesByCategory(categoryKey as MacroCategory);

                return (
                  <Card key={categoryKey}>
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{category.icon}</span>
                        <div className="text-left">
                          <h3 className="text-base font-semibold text-text-primary">{category.label}</h3>
                          <p className="text-xs text-text-tertiary">{variables.length} variables</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border-primary">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {variables.map(variable => (
                            <div key={variable.id} className="bg-background-secondary rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-text-primary mb-1">
                                    {variable.name}
                                  </h4>
                                  <p className="text-xs text-text-tertiary">
                                    {variable.description}
                                  </p>
                                </div>
                                <button className="p-1 text-text-tertiary hover:text-accent-cyan">
                                  <Edit2 size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                                <div>
                                  <span className="text-text-tertiary">Min:</span>
                                  <span className="ml-1 font-mono text-text-primary">
                                    {variable.min}{variable.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-text-tertiary">Default:</span>
                                  <span className="ml-1 font-mono" style={{ color: category.color }}>
                                    {variable.defaultValue}{variable.unit}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-text-tertiary">Max:</span>
                                  <span className="ml-1 font-mono text-text-primary">
                                    {variable.max}{variable.unit}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-1">
                                {variable.impact.sectors.slice(0, 3).map(sector => (
                                  <span
                                    key={sector}
                                    className="px-2 py-0.5 bg-background-tertiary text-text-tertiary text-xs rounded"
                                  >
                                    {sector}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* CONNECTIONS TAB - Circuit Diagram View */}
        {activeTab === 'connections' && (
          <div className="max-w-7xl">
            <div className="mb-6">
              <h2 className="text-xl font-light text-text-primary mb-2">System Connections & Relationships</h2>
              <p className="text-sm text-text-secondary">
                Visualize how macro variables, sectors, and companies are interconnected
              </p>
            </div>

            <Card>
              <div className="text-center py-12">
                <Network size={64} className="mx-auto mb-4 text-accent-cyan opacity-50" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Circuit Diagram Visualization
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Interactive 4-Level Ontology: Macro → Sector → Company → Asset
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
                  <div className="bg-background-secondary rounded-lg p-4 border-l-4 border-accent-cyan">
                    <div className="text-2xl mb-2">🌐</div>
                    <h4 className="text-sm font-semibold text-accent-cyan mb-1">Level 1: Macro</h4>
                    <p className="text-xs text-text-tertiary">{MACRO_VARIABLES.length} variables</p>
                  </div>

                  <div className="bg-background-secondary rounded-lg p-4 border-l-4 border-accent-magenta">
                    <div className="text-2xl mb-2">🏭</div>
                    <h4 className="text-sm font-semibold text-accent-magenta mb-1">Level 2: Sector</h4>
                    <p className="text-xs text-text-tertiary">{stats.totalSectors} sectors</p>
                  </div>

                  <div className="bg-background-secondary rounded-lg p-4 border-l-4 border-accent-emerald">
                    <div className="text-2xl mb-2">🏢</div>
                    <h4 className="text-sm font-semibold text-accent-emerald mb-1">Level 3: Company</h4>
                    <p className="text-xs text-text-tertiary">{stats.totalCompanies} companies</p>
                  </div>

                  <div className="bg-background-secondary rounded-lg p-4 border-l-4 border-yellow-400">
                    <div className="text-2xl mb-2">💎</div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-1">Level 4: Asset</h4>
                    <p className="text-xs text-text-tertiary">Individual products</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/network-graph'}
                  className="mt-8 px-6 py-3 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all"
                >
                  Open Interactive Network Graph
                </button>
              </div>
            </Card>
          </div>
        )}

        {/* ADD DATA TAB */}
        {activeTab === 'add-data' && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Plus size={20} className="text-accent-cyan" />
                <h2 className="text-xl font-light text-text-primary">Add New Company</h2>
              </div>

              <form className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">Company Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Samsung Electronics"
                        className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">Ticker Symbol *</label>
                      <input
                        type="text"
                        placeholder="e.g., SSNLF"
                        className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                  </div>
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">Sector *</label>
                  <select className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan">
                    <option value="">Select a sector...</option>
                    <option value="BANKING">Banking</option>
                    <option value="REALESTATE">Real Estate</option>
                    <option value="MANUFACTURING">Manufacturing</option>
                    <option value="SEMICONDUCTOR">Semiconductor</option>
                  </select>
                </div>

                {/* Financials */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Financial Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">Revenue (M) *</label>
                      <input
                        type="number"
                        placeholder="e.g., 200000"
                        className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">Net Income (M) *</label>
                      <input
                        type="number"
                        placeholder="e.g., 25000"
                        className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">Total Debt (M) *</label>
                      <input
                        type="number"
                        placeholder="e.g., 50000"
                        className="w-full bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border-primary">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-background-secondary text-text-secondary rounded-lg hover:bg-background-tertiary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all"
                  >
                    Add Company
                  </button>
                </div>
              </form>

              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-blue-400 mt-0.5" />
                  <div className="text-xs text-blue-400">
                    <p className="font-semibold mb-1">Note:</p>
                    <p>All financial data should be in millions (M). ICR and other ratios will be automatically calculated.</p>
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
