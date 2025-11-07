'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, BarChart3, TrendingUp, Zap, Globe, DollarSign, Target,
  Activity, Home, Cpu, ChevronRight, PlayCircle, AlertCircle
} from 'lucide-react';
import { companies, Company } from '@/data/companies';
import {
  MACRO_VARIABLES,
  MACRO_CATEGORIES,
  MacroCategory,
  getVariablesByCategory
} from '@/data/macroVariables';
import { useMacroStore } from '@/lib/store/macroStore';

// ===== TYPES =====

type SidebarSection = 'overview' | 'macro' | 'sectors' | 'companies' | 'circuit' | 'news' | 'community';

interface SidebarItem {
  id: SidebarSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

// ===== COMPONENTS =====

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-4 ${className}`}>
    {children}
  </div>
);

// ===== LEFT SIDEBAR (20%) =====

const Sidebar = ({
  activeSection,
  onSectionChange
}: {
  activeSection: SidebarSection,
  onSectionChange: (section: SidebarSection) => void
}) => {
  const items: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'macro', label: 'Macro Control', icon: <Globe size={18} />, badge: 63 },
    { id: 'sectors', label: 'Sector Analysis', icon: <Target size={18} /> },
    { id: 'companies', label: 'Companies', icon: <Home size={18} /> },
    { id: 'circuit', label: 'Circuit Diagram', icon: <Cpu size={18} /> },
    { id: 'news', label: 'News & Events', icon: <Activity size={18} /> },
    { id: 'community', label: 'Community', icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="h-full bg-[#0A0A0C] border-r border-[#1A1A1F] p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-accent-cyan mb-1">Nexus-Alpha</h2>
        <p className="text-xs text-text-tertiary">Dashboard v2.0</p>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
              ${activeSection === item.id
                ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan'
                : 'text-text-secondary hover:text-text-primary hover:bg-[#1A1A1F]'
              }
            `}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-xs px-1.5 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="mt-6">
        <h3 className="text-xs font-semibold text-text-tertiary mb-3">QUICK STATS</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-text-secondary">Active Variables</span>
            <span className="text-accent-cyan font-semibold">63</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Companies Tracked</span>
            <span className="text-text-primary font-semibold">{companies.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Sectors</span>
            <span className="text-text-primary font-semibold">6</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ===== CENTER MACRO PANEL (50%) =====

const MacroControlPanel = ({ selectedCategory, onCategoryChange }: {
  selectedCategory: MacroCategory | null,
  onCategoryChange: (category: MacroCategory | null) => void
}) => {
  const { macroState, updateMacroVariable, resetMacroState } = useMacroStore();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Object.keys(MACRO_CATEGORIES) as MacroCategory[];

  // Filter variables
  const visibleVariables = useMemo(() => {
    let vars = selectedCategory
      ? getVariablesByCategory(selectedCategory)
      : MACRO_VARIABLES;

    if (searchTerm) {
      vars = vars.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return vars;
  }, [selectedCategory, searchTerm]);

  return (
    <div className="h-full flex flex-col bg-black border-r border-[#1A1A1F]">
      {/* Header */}
      <div className="border-b border-[#1A1A1F] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-text-primary">Macro Control Panel</h2>
          <button
            onClick={resetMacroState}
            className="px-3 py-1.5 text-xs bg-[#1A1A1F] hover:bg-[#2A2A2F] text-text-secondary hover:text-text-primary rounded-lg transition-all"
          >
            Reset All
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1F] border border-[#2A2A2F] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan text-text-primary"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-[#1A1A1F] px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
              ${!selectedCategory
                ? 'bg-accent-cyan text-black'
                : 'bg-[#1A1A1F] text-text-secondary hover:text-text-primary'
              }
            `}
          >
            All ({MACRO_VARIABLES.length})
          </button>
          {categories.map(cat => {
            const config = MACRO_CATEGORIES[cat];
            const count = getVariablesByCategory(cat).length;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                  ${selectedCategory === cat
                    ? 'bg-accent-cyan text-black'
                    : 'bg-[#1A1A1F] text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Variables List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {visibleVariables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-sm">No variables found</p>
          </div>
        )}

        {visibleVariables.map(variable => {
          const currentValue = macroState[variable.id] ?? variable.defaultValue;
          const percentage = ((currentValue - variable.min) / (variable.max - variable.min)) * 100;

          return (
            <Card key={variable.id} className="hover:border-[#2A2A2F] transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{variable.name}</h4>
                  <p className="text-xs text-text-tertiary line-clamp-1">{variable.description}</p>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-lg font-bold text-accent-cyan">
                    {currentValue.toFixed(variable.step < 1 ? 2 : 0)}
                  </div>
                  <div className="text-xs text-text-tertiary">{variable.unit}</div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  step={variable.step}
                  value={currentValue}
                  onChange={(e) => updateMacroVariable(variable.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#1A1A1F] rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${percentage}%, #1A1A1F ${percentage}%, #1A1A1F 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>{variable.min} {variable.unit}</span>
                  <span>{variable.max} {variable.unit}</span>
                </div>
              </div>

              {/* Impact Badge */}
              <div className="mt-2 flex gap-1 flex-wrap">
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${variable.impact.magnitude === 'high' ? 'bg-red-500/20 text-red-400' :
                    variable.impact.magnitude === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }
                `}>
                  {variable.impact.magnitude.toUpperCase()} Impact
                </span>
                <span className="text-xs px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan rounded-full">
                  {variable.impact.sectors.slice(0, 2).join(', ')}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ===== RIGHT ANALYSIS PANEL (30%) =====

const AnalysisPanel = ({ selectedCompany, onCompanyChange }: {
  selectedCompany: Company | null,
  onCompanyChange: (company: Company) => void
}) => {
  const { calculatedImpacts } = useMacroStore();

  return (
    <div className="h-full flex flex-col bg-[#0A0A0C] overflow-y-auto">
      <div className="p-4 border-b border-[#1A1A1F]">
        <h2 className="text-lg font-bold text-text-primary mb-3">Live Analysis</h2>

        {/* Company Selector */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <select
            value={selectedCompany?.id || ''}
            onChange={(e) => {
              const company = companies.find(c => c.id === e.target.value);
              if (company) onCompanyChange(company);
            }}
            className="w-full bg-[#1A1A1F] border border-[#2A2A2F] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan text-text-primary"
          >
            <option value="">Select company...</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.ticker} - {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedCompany ? (
        <div className="p-4 space-y-4">
          {/* Company Header */}
          <Card>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-text-primary">{selectedCompany.ticker}</h3>
                <p className="text-sm text-text-secondary">{selectedCompany.name}</p>
              </div>
              <span className="px-2 py-1 text-xs bg-accent-cyan/10 text-accent-cyan rounded">
                {selectedCompany.sector}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-text-tertiary mb-1">Market Cap</div>
                <div className="font-bold text-text-primary">${selectedCompany.financials.market_cap.toLocaleString()}M</div>
              </div>
              <div>
                <div className="text-text-tertiary mb-1">Revenue</div>
                <div className="font-bold text-text-primary">${selectedCompany.financials.revenue.toLocaleString()}M</div>
              </div>
            </div>
          </Card>

          {/* Sector Impact */}
          <Card>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Zap size={16} className="text-accent-cyan" />
              Macro Impact on {selectedCompany.sector}
            </h4>
            <div className="space-y-2">
              {Object.entries(calculatedImpacts).map(([sector, impact]) => {
                if (sector.toUpperCase() !== selectedCompany.sector.toUpperCase()) return null;

                const isPositive = impact >= 0;
                return (
                  <div key={sector} className="flex items-center justify-between p-3 bg-[#1A1A1F] rounded-lg">
                    <span className="text-sm text-text-secondary capitalize">{sector}</span>
                    <span className={`text-lg font-bold ${isPositive ? 'text-status-safe' : 'text-status-danger'}`}>
                      {isPositive ? '+' : ''}{impact.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Circuit Diagram Preview */}
          <Card>
            <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-accent-magenta" />
              Circuit Diagram
            </h4>
            <div className="aspect-video bg-gradient-to-br from-accent-cyan/5 to-accent-magenta/5 rounded-lg border border-[#2A2A2F] flex items-center justify-center">
              <div className="text-center">
                <PlayCircle size={48} className="mx-auto mb-2 text-text-tertiary opacity-50" />
                <p className="text-xs text-text-secondary">Interactive visualization</p>
                <button className="mt-2 px-3 py-1.5 bg-accent-cyan text-black text-xs font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all">
                  Open Full View
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 bg-[#1A1A1F] hover:bg-[#2A2A2F] text-text-primary text-sm rounded-lg transition-all flex items-center justify-between">
                <span>View Detailed Report</span>
                <ChevronRight size={16} />
              </button>
              <button className="w-full px-3 py-2 bg-[#1A1A1F] hover:bg-[#2A2A2F] text-text-primary text-sm rounded-lg transition-all flex items-center justify-between">
                <span>Run Backtest</span>
                <ChevronRight size={16} />
              </button>
              <button className="w-full px-3 py-2 bg-[#1A1A1F] hover:bg-[#2A2A2F] text-text-primary text-sm rounded-lg transition-all flex items-center justify-between">
                <span>Add to Portfolio</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
            <p className="text-sm text-text-secondary">Select a company to view analysis</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== MAIN DASHBOARD =====

export default function PlatformDashboard() {
  const [activeSection, setActiveSection] = useState<SidebarSection>('macro');
  const [selectedCategory, setSelectedCategory] = useState<MacroCategory | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(companies[0]);

  return (
    <div className="h-screen flex bg-black text-text-primary">
      {/* Left Sidebar - 20% */}
      <div className="w-[20%] min-w-[240px]">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Center Macro Panel - 50% */}
      <div className="w-[50%]">
        <MacroControlPanel
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Right Analysis Panel - 30% */}
      <div className="w-[30%]">
        <AnalysisPanel
          selectedCompany={selectedCompany}
          onCompanyChange={setSelectedCompany}
        />
      </div>

      {/* Custom Slider Styles */}
      <style jsx global>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #06B6D4;
          cursor: pointer;
          border: 2px solid #0A0A0C;
        }

        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #06B6D4;
          cursor: pointer;
          border: 2px solid #0A0A0C;
        }
      `}</style>
    </div>
  );
}
