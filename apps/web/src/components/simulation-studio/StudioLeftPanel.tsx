'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, Globe } from 'lucide-react';

interface StudioLeftPanelProps {
  macroState: Record<string, number>;
  updateMacroVariable: (id: string, value: number) => void;
}

/**
 * StudioLeftPanel - 음향장비 스타일의 간소화된 컨트롤 패널
 *
 * Features:
 * - Knob controls (원형 다이얼)
 * - VU meters (계측기)
 * - LED indicators
 * - Minimal, professional layout
 */

interface KnobControl {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

export default function StudioLeftPanel({ macroState, updateMacroVariable }: StudioLeftPanelProps) {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  // Essential macro controls (simplified to 6 key variables)
  const controls: KnobControl[] = [
    {
      id: 'fed_funds_rate',
      label: 'Federal Funds Rate',
      shortLabel: 'FED RATE',
      value: macroState['fed_funds_rate'] || 5.25,
      min: 0,
      max: 10,
      step: 0.25,
      unit: '%',
      color: '#00d4ff', // Cyan
      icon: <TrendingUp size={16} />
    },
    {
      id: 'us_gdp_growth',
      label: 'GDP Growth',
      shortLabel: 'GDP',
      value: macroState['us_gdp_growth'] || 2.5,
      min: -5,
      max: 7,
      step: 0.1,
      unit: '%',
      color: '#00ff88', // Green
      icon: <Activity size={16} />
    },
    {
      id: 'us_cpi',
      label: 'CPI Inflation',
      shortLabel: 'CPI',
      value: (macroState['us_cpi'] || 0.037) * 100, // Convert to percentage for display
      min: -2,
      max: 10,
      step: 0.1,
      unit: '%',
      color: '#ff6b6b', // Red
      icon: <TrendingDown size={16} />
    },
    {
      id: 'wti_oil',
      label: 'WTI Oil Price',
      shortLabel: 'OIL',
      value: macroState['wti_oil'] || 78,
      min: 20,
      max: 200,
      step: 5,
      unit: '$',
      color: '#ffaa00', // Orange
      icon: <Zap size={16} />
    },
    {
      id: 'vix',
      label: 'VIX Volatility',
      shortLabel: 'VIX',
      value: macroState['vix'] || 15,
      min: 5,
      max: 80,
      step: 1,
      unit: '',
      color: '#ff00ff', // Magenta
      icon: <Activity size={16} />
    },
    {
      id: 'us_m2_money_supply',
      label: 'M2 Money Supply',
      shortLabel: 'M2',
      value: macroState['us_m2_money_supply'] || 21000,
      min: 15000,
      max: 30000,
      step: 100,
      unit: 'B',
      color: '#00ffff', // Cyan
      icon: <DollarSign size={16} />
    }
  ];

  const handleChange = (id: string, value: number) => {
    // Special handling for CPI - convert percentage back to decimal
    if (id === 'us_cpi') {
      updateMacroVariable(id, value / 100);
    } else {
      updateMacroVariable(id, value);
    }
  };

  return (
    <div className="h-full p-4 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-800">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Macro Controls
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          Adjust key economic variables
        </p>
      </div>

      {/* Control Grid */}
      <div className="space-y-6">
        {controls.map((control) => (
          <div
            key={control.id}
            className={`p-4 rounded-lg border transition-all ${
              activeControl === control.id
                ? 'bg-[#1a1a1a] border-gray-700'
                : 'bg-transparent border-transparent hover:border-gray-800'
            }`}
            onMouseEnter={() => setActiveControl(control.id)}
            onMouseLeave={() => setActiveControl(null)}
          >
            {/* Label + Value */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded"
                  style={{ backgroundColor: `${control.color}20`, color: control.color }}
                >
                  {control.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {control.shortLabel}
                  </div>
                  <div className="text-xs text-gray-600">
                    {control.label}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-lg font-bold tracking-tight"
                  style={{ color: control.color }}
                >
                  {control.value.toFixed(control.step < 1 ? 2 : 0)}
                </div>
                <div className="text-xs text-gray-600">
                  {control.unit}
                </div>
              </div>
            </div>

            {/* VU Meter Style Progress Bar */}
            <div className="relative h-2 bg-[#0a0a0a] rounded-full overflow-hidden mb-2">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${((control.value - control.min) / (control.max - control.min)) * 100}%`,
                  background: `linear-gradient(90deg, ${control.color}40, ${control.color})`,
                  boxShadow: `0 0 10px ${control.color}80`
                }}
              />
              {/* Segment markers (like VU meter) */}
              <div className="absolute inset-0 flex">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div
                    key={mark}
                    className="flex-1 border-r border-gray-800 last:border-r-0"
                    style={{ opacity: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(e) => handleChange(control.id, parseFloat(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${control.color}20 0%, ${control.color}20 ${
                  ((control.value - control.min) / (control.max - control.min)) * 100
                }%, #1a1a1a ${((control.value - control.min) / (control.max - control.min)) * 100}%, #1a1a1a 100%)`,
              }}
            />

            {/* Min/Max labels */}
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-700">
                {control.min}{control.unit}
              </span>
              <span className="text-[10px] text-gray-700">
                {control.max}{control.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Scenarios */}
      <div className="pt-4 border-t border-gray-800">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Quick Scenarios
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              updateMacroVariable('fed_funds_rate', 0.25);
              updateMacroVariable('us_gdp_growth', -3.4);
              updateMacroVariable('vix', 82);
            }}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-left hover:border-red-500/50 transition-colors group"
          >
            <div className="text-xs font-medium text-gray-300 group-hover:text-red-400">
              🦠 2020 Pandemic
            </div>
            <div className="text-[10px] text-gray-600">
              Market crash + Fed intervention
            </div>
          </button>
          <button
            onClick={() => {
              updateMacroVariable('fed_funds_rate', 5.25);
              updateMacroVariable('us_cpi', 0.08); // 8% inflation
              updateMacroVariable('wti_oil', 120);
            }}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-left hover:border-yellow-500/50 transition-colors group"
          >
            <div className="text-xs font-medium text-gray-300 group-hover:text-yellow-400">
              📈 2022 Inflation
            </div>
            <div className="text-[10px] text-gray-600">
              High inflation + rate hikes
            </div>
          </button>
          <button
            onClick={() => {
              updateMacroVariable('fed_funds_rate', 2.0);
              updateMacroVariable('us_gdp_growth', -2.8);
              updateMacroVariable('vix', 45);
            }}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded text-left hover:border-blue-500/50 transition-colors group"
          >
            <div className="text-xs font-medium text-gray-300 group-hover:text-blue-400">
              📉 2008 Crisis
            </div>
            <div className="text-[10px] text-gray-600">
              Financial meltdown
            </div>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  );
}
