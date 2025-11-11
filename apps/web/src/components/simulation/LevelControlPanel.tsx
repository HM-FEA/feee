'use client';

import { useState } from 'react';
import {
  ALL_ONTOLOGY_LEVELS,
  OntologyLevel,
  LevelControl
} from '@/data/levelSpecificControls';

interface LevelControlPanelProps {
  onControlChange?: (levelId: number, controlId: string, value: number) => void;
}

export default function LevelControlPanel({ onControlChange }: LevelControlPanelProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, number>>({});

  const handleChange = (level: number, control: LevelControl, value: number) => {
    setControlValues(prev => ({
      ...prev,
      [control.id]: value
    }));
    onControlChange?.(level, control.id, value);
  };

  const getLevelColor = (level: number): string => {
    const colors: Record<number, string> = {
      0: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',      // Cross-level
      2: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',          // Sector
      3: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',      // Company
      4: 'from-green-500/20 to-emerald-500/20 border-green-500/30',     // Product
      5: 'from-red-500/20 to-rose-500/20 border-red-500/30',            // Component
      6: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',    // Technology
      7: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',     // Shareholder
      8: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30',          // Customer
      9: 'from-slate-500/20 to-gray-500/20 border-slate-500/30'         // Facility
    };
    return colors[level] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };

  const getLevelIcon = (level: number): string => {
    const icons: Record<number, string> = {
      0: '🌐',  // Cross-level
      2: '🏭',  // Sector
      3: '🏢',  // Company
      4: '📦',  // Product
      5: '🔧',  // Component
      6: '🔬',  // Technology
      7: '👥',  // Shareholder
      8: '🛒',  // Customer
      9: '🏗️'   // Facility
    };
    return icons[level] || '📊';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Ontology-Level Controls
        </h3>
        <div className="text-xs text-text-tertiary">
          9-Level Economic Model
        </div>
      </div>

      {ALL_ONTOLOGY_LEVELS.map((ontologyLevel) => {
        const isExpanded = expandedLevel === ontologyLevel.level;

        return (
          <div
            key={ontologyLevel.level}
            className={`
              rounded-lg border backdrop-blur-sm transition-all duration-200
              bg-gradient-to-br ${getLevelColor(ontologyLevel.level)}
              ${isExpanded ? 'shadow-lg' : 'shadow-sm'}
            `}
          >
            {/* Level Header */}
            <button
              onClick={() => setExpandedLevel(isExpanded ? null : ontologyLevel.level)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getLevelIcon(ontologyLevel.level)}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-text-primary">
                    {ontologyLevel.level === 0 ? 'Level 0' : `Level ${ontologyLevel.level}`}: {ontologyLevel.name}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {ontologyLevel.description}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">
                  {ontologyLevel.controls.length} controls
                </span>
                <svg
                  className={`w-5 h-5 text-text-tertiary transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Level Controls */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                {ontologyLevel.controls.map((control) => {
                  const currentValue = controlValues[control.id] ?? control.value;

                  return (
                    <div key={control.id} className="space-y-2">
                      {/* Control Header */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-text-secondary">
                          {control.label}
                        </label>
                        <span className="text-xs font-mono text-text-primary bg-black/20 px-2 py-0.5 rounded">
                          {currentValue.toLocaleString()}{control.unit}
                        </span>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={currentValue}
                        onChange={(e) => handleChange(
                          ontologyLevel.level,
                          control,
                          parseFloat(e.target.value)
                        )}
                        className="w-full h-1.5 bg-black/20 rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-3
                          [&::-webkit-slider-thumb]:h-3
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:w-3
                          [&::-moz-range-thumb]:h-3
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-white
                          [&::-moz-range-thumb]:border-0
                          [&::-moz-range-thumb]:shadow-lg
                          [&::-moz-range-thumb]:cursor-pointer"
                      />

                      {/* Description */}
                      <div className="text-[10px] text-text-tertiary leading-tight">
                        {control.description}
                      </div>

                      {/* Impact Formula */}
                      {control.impactFormula && (
                        <div className="text-[10px] text-blue-400/70 leading-tight italic">
                          Impact: {control.impactFormula}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
        <div className="text-[10px] text-text-tertiary leading-relaxed">
          <strong className="text-text-secondary">Note:</strong> These controls represent variables at different
          ontology levels (Sector → Company → Product → Component, etc.). Each level has its own impact formulas
          that affect entities at that level and propagate through the knowledge graph.
        </div>
      </div>
    </div>
  );
}
