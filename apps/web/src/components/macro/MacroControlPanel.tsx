'use client';

import React, { useState } from 'react';
import { Sliders, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useMacroStore } from '@/lib/store/macroStore';
import { MACRO_VARIABLES, MACRO_CATEGORIES, MacroCategory } from '@/data/macroVariables';

export default function MacroControlPanel() {
  const macroState = useMacroStore(state => state.macroState);
  const updateMacroVariable = useMacroStore(state => state.updateMacroVariable);
  const resetMacroState = useMacroStore(state => state.resetMacroState);

  const [expandedCategories, setExpandedCategories] = useState<Set<MacroCategory>>(
    new Set(['MONETARY_POLICY'])
  );

  // Key variables to show by default
  const keyVariables = [
    'fed_funds_rate',
    'us_tariff_rate',
    'gdp_growth_us',
    'oil_price_wti',
    'vix',
    'krw_usd'
  ];

  const toggleCategory = (category: MacroCategory) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  const keyVars = MACRO_VARIABLES.filter(v => keyVariables.includes(v.id));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-accent-cyan" />
          <h3 className="text-sm font-semibold text-text-primary">Macro Controls</h3>
        </div>
        <button
          onClick={resetMacroState}
          className="flex items-center gap-1 px-2 py-1 text-xs text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded transition-colors"
          title="Reset to defaults"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Key Variables (Always Shown) */}
      <div className="space-y-3 mb-4">
        {keyVars.map(variable => {
          const value = macroState[variable.id] ?? variable.defaultValue;
          const percentage = ((value - variable.min) / (variable.max - variable.min)) * 100;

          return (
            <div key={variable.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-primary">
                  {variable.name}
                </label>
                <span className="text-xs font-mono text-accent-cyan">
                  {value.toFixed(2)}{variable.unit}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  step={variable.step}
                  value={value}
                  onChange={(e) => updateMacroVariable(variable.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-background-tertiary rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right,
                      #00E5FF ${percentage}%,
                      #1A1A1F ${percentage}%
                    )`
                  }}
                />
              </div>

              <p className="text-xs text-text-tertiary line-clamp-1">
                {variable.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Category Groups (Collapsible) */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {Object.entries(MACRO_CATEGORIES).map(([categoryKey, category]) => {
          const categoryVars = MACRO_VARIABLES.filter(
            v => v.category === categoryKey && !keyVariables.includes(v.id)
          );

          if (categoryVars.length === 0) return null;

          const isExpanded = expandedCategories.has(categoryKey as MacroCategory);

          return (
            <div key={categoryKey} className="border border-border-primary rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(categoryKey as MacroCategory)}
                className="w-full flex items-center justify-between p-2.5 bg-background-secondary hover:bg-background-tertiary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{category.icon}</span>
                  <span className="text-xs font-semibold text-text-primary">
                    {category.label}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    ({categoryVars.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-text-secondary" />
                ) : (
                  <ChevronDown size={14} className="text-text-secondary" />
                )}
              </button>

              {/* Category Variables */}
              {isExpanded && (
                <div className="p-3 space-y-3 bg-black">
                  {categoryVars.map(variable => {
                    const value = macroState[variable.id] ?? variable.defaultValue;
                    const percentage = ((value - variable.min) / (variable.max - variable.min)) * 100;

                    return (
                      <div key={variable.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-text-primary">
                            {variable.name}
                          </label>
                          <span className="text-xs font-mono text-accent-cyan">
                            {value.toFixed(2)}{variable.unit}
                          </span>
                        </div>

                        <div className="relative">
                          <input
                            type="range"
                            min={variable.min}
                            max={variable.max}
                            step={variable.step}
                            value={value}
                            onChange={(e) => updateMacroVariable(variable.id, parseFloat(e.target.value))}
                            className="w-full h-1 bg-background-tertiary rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right,
                                ${category.color} ${percentage}%,
                                #1A1A1F ${percentage}%
                              )`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
