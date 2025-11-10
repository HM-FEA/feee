'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Settings, Globe, Network, Zap, Play, Save, Users, Sparkles } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui/DesignSystem';
import { useMacroStore } from '@/lib/store/macroStore';
import { MACRO_CATEGORIES } from '@/data/macroVariables';

// Dynamic imports
const Globe3D = dynamic(() => import('@/components/visualization/Globe3D'), { ssr: false });
const ForceNetworkGraph3D = dynamic(() => import('@/components/visualization/ForceNetworkGraph3D'), { ssr: false });

type Sector = 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | null;

interface MacroControl {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export default function SimulationPage() {
  const [selectedSector, setSelectedSector] = useState<Sector>(null);
  const [viewMode, setViewMode] = useState<'split' | 'globe' | 'network'>('split');
  const [showElementLibrary, setShowElementLibrary] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [macroChanging, setMacroChanging] = useState(false);
  const [changedMacroId, setChangedMacroId] = useState<string | null>(null);

  const macroState = useMacroStore(state => state.macroState);
  const updateMacroVariable = useMacroStore(state => state.updateMacroVariable);
  const calculatedImpacts = useMacroStore(state => state.calculatedImpacts);

  // Key macro controls
  const macroControls: MacroControl[] = [
    {
      id: 'fed_rate',
      label: 'Fed Interest Rate',
      value: (macroState['fed_rate'] || 0.055) * 100,
      min: 0,
      max: 10,
      step: 0.25,
      unit: '%'
    },
    {
      id: 'gdp_growth_us',
      label: 'US GDP Growth',
      value: (macroState['gdp_growth_us'] || 0.021) * 100,
      min: -5,
      max: 10,
      step: 0.1,
      unit: '%'
    },
    {
      id: 'global_m2_growth',
      label: 'Global M2 Growth',
      value: macroState['global_m2_growth'] || 5,
      min: -10,
      max: 20,
      step: 0.5,
      unit: '%'
    },
    {
      id: 'oil_price_wti',
      label: 'Oil Price (WTI)',
      value: macroState['oil_price_wti'] || 85,
      min: 20,
      max: 200,
      step: 5,
      unit: '$'
    },
    {
      id: 'vix',
      label: 'VIX (Volatility)',
      value: macroState['vix'] || 18.5,
      min: 5,
      max: 80,
      step: 1,
      unit: ''
    }
  ];

  const handleMacroChange = (id: string, displayValue: number) => {
    setMacroChanging(true);
    setChangedMacroId(id);

    // Convert display value back to actual value
    let actualValue = displayValue;
    if (id === 'fed_rate' || id === 'gdp_growth_us') {
      actualValue = displayValue / 100;
    }

    updateMacroVariable(id, actualValue);

    // Reset bright effect after animation
    setTimeout(() => {
      setMacroChanging(false);
      setChangedMacroId(null);
    }, 1000);
  };

  const sectors = [
    { id: 'BANKING', label: 'Banking', color: '#06B6D4', icon: '🏦', impact: calculatedImpacts.banking },
    { id: 'REALESTATE', label: 'Real Estate', color: '#00FF9F', icon: '🏢', impact: calculatedImpacts.realEstate },
    { id: 'MANUFACTURING', label: 'Manufacturing', color: '#8B5CF6', icon: '🏭', impact: calculatedImpacts.manufacturing },
    { id: 'SEMICONDUCTOR', label: 'Semiconductor', color: '#F59E0B', icon: '💻', impact: calculatedImpacts.semiconductor },
    { id: 'CRYPTO', label: 'Crypto', color: '#E6007A', icon: '₿', impact: calculatedImpacts.crypto }
  ];

  return (
    <div className="relative min-h-screen bg-black text-text-primary overflow-hidden">
      {/* Header */}
      <div className="relative z-10 border-b border-border-primary bg-black/80 backdrop-blur">
        <SectionHeader
          title="Economic Simulation Platform"
          subtitle="Unified Globe + Network Graph with Macro Control & Scenario Testing"
          icon={<Sparkles size={24} />}
        />
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Sector Focus */}
        <div className="w-64 border-r border-border-primary bg-black/50 backdrop-blur p-4 overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Sector Focus</h3>
            </div>
            <p className="text-xs text-text-tertiary mb-3">
              Select a sector to highlight related elements in both Globe and Network Graph
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedSector(null)}
                className={`w-full px-3 py-2.5 rounded-lg text-left transition-all ${
                  selectedSector === null
                    ? 'bg-accent-cyan text-black font-semibold shadow-lg shadow-accent-cyan/50'
                    : 'bg-background-secondary text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🌍</span>
                  <span className="text-sm">All Sectors (Overall)</span>
                </div>
              </button>

              {sectors.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id as Sector)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left transition-all border ${
                    selectedSector === sector.id
                      ? 'border-accent-cyan bg-accent-cyan/10 shadow-lg shadow-accent-cyan/20'
                      : 'border-border-primary bg-background-secondary hover:border-accent-cyan/50'
                  }`}
                  style={{
                    borderColor: selectedSector === sector.id ? sector.color : undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{sector.icon}</span>
                      <span className="text-sm font-medium text-text-primary">{sector.label}</span>
                    </div>
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        sector.impact >= 0 ? 'bg-status-safe/20 text-status-safe' : 'bg-status-danger/20 text-status-danger'
                      }`}
                    >
                      {sector.impact >= 0 ? '+' : ''}{sector.impact.toFixed(1)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Macro Controller */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings size={16} className="text-accent-magenta" />
              <h3 className="text-sm font-semibold text-text-primary">Macro Controller</h3>
            </div>
            <p className="text-xs text-text-tertiary mb-3">
              Adjust variables to see real-time impact
            </p>

            <div className="space-y-4">
              {macroControls.map(control => (
                <div key={control.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-text-secondary">{control.label}</label>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      changedMacroId === control.id && macroChanging
                        ? 'bg-accent-cyan text-black animate-pulse'
                        : 'bg-background-tertiary text-accent-cyan'
                    }`}>
                      {control.value.toFixed(2)}{control.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={control.value}
                    onChange={(e) => handleMacroChange(control.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-background-tertiary rounded-lg appearance-none cursor-pointer accent-accent-cyan"
                    style={{
                      background: changedMacroId === control.id && macroChanging
                        ? 'linear-gradient(90deg, #00E5FF 0%, #E6007A 100%)'
                        : undefined
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary mb-2">View Layout</h3>
            <div className="space-y-1">
              <button
                onClick={() => setViewMode('split')}
                className={`w-full px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-accent-cyan text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                Split View (Globe + Network)
              </button>
              <button
                onClick={() => setViewMode('globe')}
                className={`w-full px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'globe'
                    ? 'bg-accent-emerald text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                <Globe size={12} className="inline mr-1" />
                Globe Only
              </button>
              <button
                onClick={() => setViewMode('network')}
                className={`w-full px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  viewMode === 'network'
                    ? 'bg-accent-magenta text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                <Network size={12} className="inline mr-1" />
                Network Only
              </button>
            </div>
          </div>
        </div>

        {/* Center - Visualization */}
        <div className="flex-1 relative">
          {/* Bright effect overlay when macro changing */}
          {macroChanging && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/20 via-transparent to-transparent animate-pulse" />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-2 h-full w-full">
              <div className="border-r border-border-primary relative h-full w-full">
                <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur border border-accent-cyan rounded px-2 py-1">
                  <span className="text-xs font-semibold text-accent-cyan">Globe 3D - Capital Flows</span>
                </div>
                <Globe3D selectedSector={selectedSector} showControls={false} />
              </div>
              <div className="relative h-full w-full">
                <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur border border-accent-magenta rounded px-2 py-1">
                  <span className="text-xs font-semibold text-accent-magenta">Network Graph - Relationships</span>
                </div>
                <ForceNetworkGraph3D selectedSector={selectedSector} showControls={false} />
              </div>
            </div>
          )}

          {viewMode === 'globe' && (
            <div className="h-full relative">
              <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur border border-accent-cyan rounded px-2 py-1">
                <span className="text-xs font-semibold text-accent-cyan">Globe 3D - Capital Flows</span>
              </div>
              <Globe3D selectedSector={selectedSector} showControls={false} />
            </div>
          )}

          {viewMode === 'network' && (
            <div className="h-full relative">
              <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur border border-accent-magenta rounded px-2 py-1">
                <span className="text-xs font-semibold text-accent-magenta">Network Graph - Relationships</span>
              </div>
              <ForceNetworkGraph3D selectedSector={selectedSector} showControls={false} />
            </div>
          )}
        </div>

        {/* Right Sidebar - Element Library & Scenarios */}
        <div className="w-80 border-l border-border-primary bg-black/50 backdrop-blur overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Element Library */}
            <div>
              <button
                onClick={() => setShowElementLibrary(!showElementLibrary)}
                className="w-full flex items-center justify-between p-3 bg-background-secondary hover:bg-background-tertiary rounded-lg border border-border-primary transition-all"
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-accent-cyan" />
                  <span className="text-sm font-semibold">Element Library</span>
                </div>
                <span className="text-xs text-text-tertiary">{showElementLibrary ? '▼' : '▶'}</span>
              </button>

              {showElementLibrary && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-text-tertiary px-2">
                    Drag & drop elements to create custom relationships (Coming Soon)
                  </p>

                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-text-secondary px-2 py-1">Relationship Types</div>
                    <div className="space-y-1">
                      {['Impact', 'Ownership', 'Supply Chain', 'Loan', 'Competition'].map(type => (
                        <div
                          key={type}
                          className="px-3 py-2 bg-background-tertiary rounded border border-border-primary hover:border-accent-cyan transition-all cursor-move"
                        >
                          <span className="text-xs text-text-primary">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-text-secondary px-2 py-1">Macro Variables</div>
                    <div className="space-y-1">
                      {['Interest Rate', 'GDP Growth', 'M2 Supply', 'Oil Price'].map(type => (
                        <div
                          key={type}
                          className="px-3 py-2 bg-background-tertiary rounded border border-border-primary hover:border-accent-emerald transition-all cursor-move"
                        >
                          <span className="text-xs text-text-primary">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scenario Management */}
            <div>
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="w-full flex items-center justify-between p-3 bg-background-secondary hover:bg-background-tertiary rounded-lg border border-border-primary transition-all"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-accent-magenta" />
                  <span className="text-sm font-semibold">Scenarios</span>
                </div>
                <span className="text-xs text-text-tertiary">{showScenarios ? '▼' : '▶'}</span>
              </button>

              {showScenarios && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-text-tertiary px-2">
                    Save, load, and share custom economic scenarios
                  </p>

                  <div className="space-y-1">
                    <button className="w-full px-3 py-2 bg-accent-cyan text-black text-xs font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all">
                      <Save size={12} className="inline mr-1" />
                      Save Current Scenario
                    </button>
                    <button className="w-full px-3 py-2 bg-background-tertiary text-text-primary text-xs font-semibold rounded-lg hover:bg-background-secondary transition-all border border-border-primary">
                      <Play size={12} className="inline mr-1" />
                      Load Scenario
                    </button>
                  </div>

                  <div className="pt-3 border-t border-border-primary">
                    <div className="text-xs font-semibold text-text-secondary mb-2">Community Scenarios</div>
                    <div className="space-y-2">
                      <ScenarioCard
                        name="2008 Financial Crisis"
                        author="analyst_42"
                        upvotes={152}
                        description="Fed rate at 0%, high volatility, banking crisis"
                      />
                      <ScenarioCard
                        name="AI Boom 2025"
                        author="quant_trader"
                        upvotes={89}
                        description="Semiconductor surge, tech innovation spike"
                      />
                      <ScenarioCard
                        name="Oil Shock"
                        author="macro_guru"
                        upvotes={67}
                        description="Oil at $150, manufacturing impact"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Status */}
            <div className="bg-background-secondary border border-border-primary rounded-lg p-3">
              <h3 className="text-xs font-semibold text-text-primary mb-2">Current Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Selected Sector:</span>
                  <span className="text-accent-cyan font-semibold">
                    {selectedSector ? sectors.find(s => s.id === selectedSector)?.label : 'All Sectors'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Fed Rate:</span>
                  <span className="text-accent-emerald font-mono font-bold">
                    {((macroState['fed_rate'] || 0.055) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">View Mode:</span>
                  <span className="text-text-primary capitalize">{viewMode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scenario Card Component
function ScenarioCard({
  name,
  author,
  upvotes,
  description
}: {
  name: string;
  author: string;
  upvotes: number;
  description: string;
}) {
  return (
    <div className="bg-background-tertiary border border-border-primary rounded-lg p-3 hover:border-accent-magenta transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent-magenta transition-colors">
          {name}
        </h4>
        <div className="flex items-center gap-1 text-accent-cyan">
          <span className="text-[10px]">▲</span>
          <span className="text-[10px] font-bold">{upvotes}</span>
        </div>
      </div>
      <p className="text-[10px] text-text-tertiary mb-2">{description}</p>
      <div className="text-[10px] text-text-secondary">
        by <span className="text-accent-cyan">{author}</span>
      </div>
    </div>
  );
}
