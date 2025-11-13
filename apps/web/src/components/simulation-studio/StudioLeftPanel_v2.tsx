'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Zap, TrendingUp, DollarSign, Activity, Package, Cpu, Users, ShoppingCart, Building } from 'lucide-react';
import { useLevelStore } from '@/lib/store/levelStore';

interface StudioLeftPanelProps {
  macroState: Record<string, number>;
  updateMacroVariable: (id: string, value: number) => void;
  onLevelChange?: (level: number, controlId: string, value: number) => void;
  activePropagationLevel?: number; // For animation
}

/**
 * StudioLeftPanel v2 - Level별 Toggle 컨트롤
 *
 * Structure:
 * - Level 0: Cross-cutting (3 controls)
 * - Level 1: Macro (8 controls)
 * - Level 2: Sector (per-sector controls)
 * - Level 3: Company (per-company controls)
 * - Level 4: Product (demand indices)
 * - Level 5: Component (supply indices)
 * - Level 6: Technology (R&D, innovation)
 * - Level 7: Ownership (institutional, insider)
 * - Level 8: Customer (CapEx, adoption)
 * - Level 9: Facility (utilization, buildout)
 */

interface LevelSection {
  level: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  controls: LevelControl[];
}

interface LevelControl {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description?: string;
}

export default function StudioLeftPanel({
  macroState,
  updateMacroVariable,
  onLevelChange,
  activePropagationLevel
}: StudioLeftPanelProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([0, 1])); // Level 0, 1 open by default
  const levelState = useLevelStore(state => state.levelState);
  const updateLevelControl = useLevelStore(state => state.updateLevelControl);

  const toggleLevel = (level: number) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  // Define all levels with their controls
  const levels: LevelSection[] = [
    {
      level: 0,
      name: 'Trade & Logistics',
      icon: <Package size={16} />,
      color: '#6b7280', // Gray
      controls: [
        {
          id: 'container_rate_us_china',
          label: 'Container Rate (US-China)',
          value: levelState['container_rate_us_china'] || 3500,
          min: 1000,
          max: 10000,
          step: 100,
          unit: '$',
          description: '40ft container Shanghai-LA'
        },
        {
          id: 'semiconductor_tariff',
          label: 'Semiconductor Tariffs',
          value: levelState['semiconductor_tariff'] || 0,
          min: 0,
          max: 50,
          step: 5,
          unit: '%',
          description: 'Import tariffs on chips'
        },
        {
          id: 'energy_cost_index',
          label: 'Energy Cost Index',
          value: levelState['energy_cost_index'] || 100,
          min: 60,
          max: 200,
          step: 5,
          unit: '',
          description: 'Industrial electricity cost'
        }
      ]
    },
    {
      level: 1,
      name: 'Macro Variables',
      icon: <TrendingUp size={16} />,
      color: '#00d4ff', // Cyan
      controls: [
        {
          id: 'fed_funds_rate',
          label: 'Fed Funds Rate',
          value: macroState['fed_funds_rate'] || 5.25,
          min: 0,
          max: 10,
          step: 0.25,
          unit: '%'
        },
        {
          id: 'us_gdp_growth',
          label: 'US GDP Growth',
          value: macroState['us_gdp_growth'] || 2.5,
          min: -5,
          max: 7,
          step: 0.1,
          unit: '%'
        },
        {
          id: 'us_cpi',
          label: 'CPI Inflation',
          value: (macroState['us_cpi'] || 0.037) * 100,
          min: -2,
          max: 10,
          step: 0.1,
          unit: '%'
        },
        {
          id: 'wti_oil',
          label: 'WTI Oil Price',
          value: macroState['wti_oil'] || 78,
          min: 20,
          max: 200,
          step: 5,
          unit: '$'
        },
        {
          id: 'vix',
          label: 'VIX Volatility',
          value: macroState['vix'] || 15,
          min: 5,
          max: 80,
          step: 1,
          unit: ''
        },
        {
          id: 'us_m2_money_supply',
          label: 'M2 Money Supply',
          value: macroState['us_m2_money_supply'] || 21000,
          min: 15000,
          max: 30000,
          step: 100,
          unit: 'B'
        },
        {
          id: 'usd_index',
          label: 'USD Index',
          value: macroState['usd_index'] || 104.5,
          min: 80,
          max: 130,
          step: 0.5,
          unit: ''
        },
        {
          id: 'us_unemployment',
          label: 'Unemployment Rate',
          value: macroState['us_unemployment'] || 3.8,
          min: 2,
          max: 15,
          step: 0.1,
          unit: '%'
        }
      ]
    },
    {
      level: 2,
      name: 'Sector Indicators',
      icon: <Activity size={16} />,
      color: '#00ff88', // Green
      controls: [
        {
          id: 'semiconductor_capex_index',
          label: 'Semiconductor CapEx',
          value: levelState['semiconductor_capex_index'] || 100,
          min: 50,
          max: 200,
          step: 5,
          unit: '',
          description: 'Industry capital expenditure intensity'
        },
        {
          id: 'banking_credit_spread',
          label: 'Banking Credit Spread',
          value: levelState['banking_credit_spread'] || 150,
          min: 50,
          max: 500,
          step: 10,
          unit: 'bps'
        },
        {
          id: 'realestate_vacancy_rate',
          label: 'Real Estate Vacancy',
          value: levelState['realestate_vacancy_rate'] || 8.5,
          min: 0,
          max: 25,
          step: 0.5,
          unit: '%'
        }
      ]
    },
    {
      level: 3,
      name: 'Company Metrics',
      icon: <Building size={16} />,
      color: '#ff00ff', // Magenta
      controls: [
        {
          id: 'nvidia_market_share',
          label: 'NVIDIA AI GPU Share',
          value: levelState['nvidia_market_share'] || 85,
          min: 50,
          max: 95,
          step: 1,
          unit: '%'
        },
        {
          id: 'tsmc_utilization_rate',
          label: 'TSMC Fab Utilization',
          value: levelState['tsmc_utilization_rate'] || 95,
          min: 60,
          max: 100,
          step: 1,
          unit: '%'
        },
        {
          id: 'sk_hynix_hbm_share',
          label: 'SK Hynix HBM Share',
          value: levelState['sk_hynix_hbm_share'] || 50,
          min: 20,
          max: 80,
          step: 5,
          unit: '%'
        }
      ]
    },
    {
      level: 4,
      name: 'Product Demand',
      icon: <Package size={16} />,
      color: '#ffaa00', // Orange
      controls: [
        {
          id: 'gpu_demand_index',
          label: 'AI GPU Demand',
          value: levelState['gpu_demand_index'] || 85,
          min: 0,
          max: 150,
          step: 5,
          unit: ''
        },
        {
          id: 'smartphone_demand',
          label: 'Smartphone Demand',
          value: levelState['smartphone_demand'] || 100,
          min: 60,
          max: 140,
          step: 5,
          unit: 'M units'
        },
        {
          id: 'cloud_service_growth',
          label: 'Cloud Services Growth',
          value: levelState['cloud_service_growth'] || 25,
          min: 5,
          max: 50,
          step: 1,
          unit: '%'
        }
      ]
    },
    {
      level: 5,
      name: 'Component Supply',
      icon: <Cpu size={16} />,
      color: '#ff6b6b', // Red
      controls: [
        {
          id: 'hbm3e_supply_index',
          label: 'HBM3E Supply',
          value: levelState['hbm3e_supply_index'] || 100,
          min: 50,
          max: 150,
          step: 5,
          unit: ''
        },
        {
          id: 'dram_price_index',
          label: 'DRAM Price Index',
          value: levelState['dram_price_index'] || 100,
          min: 50,
          max: 200,
          step: 5,
          unit: ''
        },
        {
          id: 'cowos_capacity',
          label: 'CoWoS Capacity',
          value: levelState['cowos_capacity'] || 15000,
          min: 10000,
          max: 30000,
          step: 500,
          unit: 'units/mo'
        },
        {
          id: 'euv_machine_shipments',
          label: 'EUV System Deliveries',
          value: levelState['euv_machine_shipments'] || 60,
          min: 40,
          max: 100,
          step: 5,
          unit: 'units/yr'
        }
      ]
    },
    {
      level: 6,
      name: 'Technology Innovation',
      icon: <Zap size={16} />,
      color: '#a855f7', // Purple
      controls: [
        {
          id: 'ai_investment',
          label: 'Global AI Investment',
          value: levelState['ai_investment'] || 150,
          min: 50,
          max: 500,
          step: 10,
          unit: 'B'
        },
        {
          id: 'process_node_advancement',
          label: 'Process Node Progress',
          value: levelState['process_node_advancement'] || 100,
          min: 80,
          max: 120,
          step: 5,
          unit: ''
        },
        {
          id: 'cuda_ecosystem_strength',
          label: 'CUDA Ecosystem',
          value: levelState['cuda_ecosystem_strength'] || 90,
          min: 60,
          max: 100,
          step: 5,
          unit: ''
        }
      ]
    },
    {
      level: 7,
      name: 'Ownership Dynamics',
      icon: <Users size={16} />,
      color: '#10b981', // Emerald
      controls: [
        {
          id: 'institutional_ownership',
          label: 'Institutional Ownership',
          value: levelState['institutional_ownership'] || 65,
          min: 40,
          max: 85,
          step: 1,
          unit: '%'
        },
        {
          id: 'insider_buying_index',
          label: 'Insider Buying',
          value: levelState['insider_buying_index'] || 100,
          min: 50,
          max: 200,
          step: 10,
          unit: ''
        }
      ]
    },
    {
      level: 8,
      name: 'Customer Behavior',
      icon: <ShoppingCart size={16} />,
      color: '#f59e0b', // Amber
      controls: [
        {
          id: 'hyperscaler_capex',
          label: 'Hyperscaler CapEx',
          value: levelState['hyperscaler_capex'] || 180,
          min: 100,
          max: 300,
          step: 10,
          unit: 'B'
        },
        {
          id: 'enterprise_ai_adoption',
          label: 'Enterprise AI Adoption',
          value: levelState['enterprise_ai_adoption'] || 45,
          min: 20,
          max: 80,
          step: 5,
          unit: '%'
        },
        {
          id: 'consumer_spending_index',
          label: 'Consumer Spending',
          value: levelState['consumer_spending_index'] || 100,
          min: 60,
          max: 140,
          step: 5,
          unit: ''
        }
      ]
    },
    {
      level: 9,
      name: 'Facility Operations',
      icon: <Building size={16} />,
      color: '#3b82f6', // Blue
      controls: [
        {
          id: 'fab_utilization',
          label: 'Global Fab Utilization',
          value: levelState['fab_utilization'] || 85,
          min: 60,
          max: 100,
          step: 1,
          unit: '%'
        },
        {
          id: 'datacenter_buildout',
          label: 'Data Center Construction',
          value: levelState['datacenter_buildout'] || 50,
          min: 20,
          max: 100,
          step: 5,
          unit: 'facilities/yr'
        }
      ]
    }
  ];

  const handleControlChange = (level: number, controlId: string, value: number) => {
    if (level === 0) {
      // Level 0: Trade & Logistics → use levelStore
      updateLevelControl(controlId, value);
    } else if (level === 1) {
      // Level 1: Macro variables → use macroStore
      if (controlId === 'us_cpi') {
        updateMacroVariable(controlId, value / 100); // Convert percentage to decimal
      } else {
        updateMacroVariable(controlId, value);
      }
    } else {
      // Other levels (2-9) → use levelStore
      updateLevelControl(controlId, value);
    }

    // Trigger propagation callback
    if (onLevelChange) {
      onLevelChange(level, controlId, value);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      {/* Header */}
      <div className="pb-3 border-b border-gray-800">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Level Controls
        </h2>
        <p className="text-[10px] text-gray-600 mt-1">
          9-level ontology system
        </p>
      </div>

      {/* Level Sections */}
      {levels.map((levelSection) => {
        const isExpanded = expandedLevels.has(levelSection.level);
        const isActive = activePropagationLevel === levelSection.level;

        return (
          <div
            key={levelSection.level}
            className={`border rounded-lg transition-all ${
              isActive
                ? `border-[${levelSection.color}] bg-[${levelSection.color}]/10 shadow-lg shadow-[${levelSection.color}]/20`
                : 'border-gray-800 bg-[#1a1a1a]'
            }`}
          >
            {/* Level Header - Toggle */}
            <button
              onClick={() => toggleLevel(levelSection.level)}
              className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#0f0f0f] transition-colors"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                <div
                  className="p-1.5 rounded"
                  style={{ backgroundColor: `${levelSection.color}20`, color: levelSection.color }}
                >
                  {levelSection.icon}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-300">
                    Level {levelSection.level}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    {levelSection.name}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-600">
                {levelSection.controls.length} controls
              </div>
            </button>

            {/* Level Controls - Expanded */}
            {isExpanded && (
              <div className="px-3 pb-3 space-y-3 border-t border-gray-800">
                {levelSection.controls.map((control) => (
                  <div key={control.id} className="pt-3">
                    {/* Control Label + Value */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400">
                        {control.label}
                      </div>
                      <div
                        className="text-sm font-bold font-mono"
                        style={{ color: levelSection.color }}
                      >
                        {control.value.toFixed(control.step < 1 ? 2 : 0)}
                        {control.unit}
                      </div>
                    </div>

                    {/* Slider */}
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={control.value}
                      onChange={(e) =>
                        handleControlChange(
                          levelSection.level,
                          control.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full h-1 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(90deg, ${levelSection.color}40 0%, ${levelSection.color}40 ${
                          ((control.value - control.min) / (control.max - control.min)) * 100
                        }%, #1a1a1a ${
                          ((control.value - control.min) / (control.max - control.min)) * 100
                        }%, #1a1a1a 100%)`
                      }}
                    />

                    {/* Min/Max */}
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-gray-700">
                        {control.min}{control.unit}
                      </span>
                      <span className="text-[9px] text-gray-700">
                        {control.max}{control.unit}
                      </span>
                    </div>

                    {/* Description */}
                    {control.description && (
                      <div className="text-[9px] text-gray-600 mt-1">
                        {control.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
