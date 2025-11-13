'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Network, GitBranch, Activity, Maximize2, Minimize2, Globe, ChevronDown } from 'lucide-react';
import { PropagationState } from '@/lib/finance/nineLevelPropagation';
import { TimeState } from './StudioLayout_v3';
import NetworkGraph2D, { generateSampleNetwork, GraphNode } from '@/components/visualization/NetworkGraph2D';
import SupplyChainFlow from '@/components/visualization/SupplyChainFlow';
import { SUPPLY_CHAIN_SCENARIOS, SupplyChainScenario } from '@/data/supplyChainScenarios';

// Dynamic import for Globe3D (client-side only)
const Globe3D = dynamic(() => import('@/components/visualization/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-gray-400">Loading Globe...</div>
    </div>
  )
});

interface StudioCenterStageProps {
  focusedCompany: string | null;
  timeState: TimeState;
  propagationState: PropagationState | null;
  showPropagation: boolean;
  activePropagationLevel?: number; // From animation
}

type ViewMode = 'globe' | 'network' | 'supply-chain' | 'propagation-flow';

/**
 * StudioCenterStage - Main visualization area
 *
 * Features:
 * - Globe3D with company/flow visualization
 * - 2D Network Graph with propagation highlighting
 * - Supply Chain Flow (React Flow - multiple scenarios)
 * - 9-Level Propagation Flow
 * - Small inset graph in corner
 * - Synced with propagation animation
 */

// Generate static network data once (prevents re-rendering on variable change)
const STATIC_NETWORK = generateSampleNetwork();

export default function StudioCenterStage({
  focusedCompany,
  timeState,
  propagationState,
  showPropagation,
  activePropagationLevel
}: StudioCenterStageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [showInsetGraph, setShowInsetGraph] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<SupplyChainScenario>(SUPPLY_CHAIN_SCENARIOS[0]);
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false);

  // Only calculate highlighted nodes (don't regenerate entire network)
  const highlightedNodes = useMemo(() => {
    const highlighted = new Set<string>();
    if (activePropagationLevel !== undefined && propagationState) {
      // Highlight nodes at the active level
      STATIC_NETWORK.nodes.forEach(node => {
        if (node.level === activePropagationLevel) {
          highlighted.add(node.id);
        }
      });
    }
    return highlighted;
  }, [activePropagationLevel, propagationState]);

  // Convert selected scenario to SupplyChainFlow format
  const supplyChainFlowData = useMemo(() => {
    const nodes = selectedScenario.nodes.map((node: any) => ({
      id: node.id,
      name: node.name,
      category: node.type as 'supplier' | 'manufacturer' | 'component' | 'customer' | 'equipment',
      details: {
        role: node.details?.role || node.name,
        risk: node.details?.risk as 'low' | 'medium' | 'high' | 'critical' || 'low',
        marketShare: node.details?.marketShare,
        leadTime: node.details?.leadTime,
        capacity: node.details?.capacity,
        cost: node.details?.cost,
      },
      position: node.position || { x: 0, y: 0 }
    }));

    const links = selectedScenario.links.map((link: any) => ({
      source: link.from,
      target: link.to,
      label: link.label || '',
      volume: link.volume,
      bottleneck: link.bottleneck || false
    }));

    return { nodes, links };
  }, [selectedScenario]);

  return (
    <div className="h-full relative bg-[#0a0a0a]">
      {/* View Mode Selector (Top-left overlay) */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setViewMode('globe')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm text-xs font-medium ${
            viewMode === 'globe'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/60 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <Globe size={14} />
          Globe
        </button>
        <button
          onClick={() => setViewMode('network')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm text-xs font-medium ${
            viewMode === 'network'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/60 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <Network size={14} />
          Network
        </button>
        <button
          onClick={() => setViewMode('supply-chain')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm text-xs font-medium ${
            viewMode === 'supply-chain'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/60 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <GitBranch size={14} />
          Supply Chain
        </button>
        <button
          onClick={() => setViewMode('propagation-flow')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm text-xs font-medium ${
            viewMode === 'propagation-flow'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/60 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <Activity size={14} />
          9-Level
        </button>
      </div>

      {/* Supply Chain Scenario Selector (Top-left, below view modes) */}
      {viewMode === 'supply-chain' && (
        <div className="absolute top-16 left-4 z-20">
          <div className="relative">
            <button
              onClick={() => setShowScenarioDropdown(!showScenarioDropdown)}
              className="px-3 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-gray-700/50 hover:border-accent-cyan/50 transition-all flex items-center gap-2 text-xs"
            >
              <span className="text-xl">{selectedScenario.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-gray-400 text-[10px]">Scenario</span>
                <span className="text-white font-medium">{selectedScenario.name}</span>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showScenarioDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showScenarioDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-black/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                {SUPPLY_CHAIN_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setShowScenarioDropdown(false);
                    }}
                    className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 ${
                      selectedScenario.id === scenario.id ? 'bg-accent-cyan/10' : ''
                    }`}
                  >
                    <span className="text-2xl">{scenario.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-medium text-white mb-1">{scenario.name}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-2">{scenario.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          scenario.criticality === 'critical' ? 'bg-red-500/20 text-red-400' :
                          scenario.criticality === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          scenario.criticality === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {scenario.criticality}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          ↑ {scenario.votes.up} ↓ {scenario.votes.down}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inset Graph Toggle (Top-right) */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowInsetGraph(!showInsetGraph)}
          className="p-2 rounded-lg backdrop-blur-sm bg-black/60 text-gray-400 border border-gray-700/50 hover:border-accent-cyan transition-all"
          title={showInsetGraph ? 'Hide inset graph' : 'Show inset graph'}
        >
          {showInsetGraph ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Focused Company Indicator (Top-center) */}
      {focusedCompany && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-3 py-2 bg-black/80 backdrop-blur-md border border-accent-cyan/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-accent-cyan animate-pulse" />
              <div>
                <div className="text-[10px] text-gray-400">Focused</div>
                <div className="text-xs font-bold text-accent-cyan">{focusedCompany}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Indicator (Bottom-left) */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="px-3 py-2 bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${timeState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            <div className="text-xs font-mono text-gray-300">
              {timeState.currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-[10px] text-gray-600">
              {timeState.speed}x
            </div>
          </div>
        </div>
      </div>

      {/* Active Propagation Level Indicator - REMOVED per user request */}

      {/* Main Visualization */}
      <div className="h-full w-full">
        {viewMode === 'globe' && (
          <Globe3D
            viewMode="flows"
            showControls={true}
            highlightedNodes={Array.from(highlightedNodes)}
            activeLevel={activePropagationLevel}
          />
        )}

        {viewMode === 'network' && (
          <NetworkGraph2D
            nodes={STATIC_NETWORK.nodes}
            edges={STATIC_NETWORK.edges}
            activeLevel={activePropagationLevel}
            highlightedNodes={highlightedNodes}
            onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
          />
        )}

        {viewMode === 'supply-chain' && (
          <div className="h-full w-full">
            <SupplyChainFlow
              nodes={supplyChainFlowData.nodes}
              links={supplyChainFlowData.links}
              title={selectedScenario.name}
              description={selectedScenario.description}
              activeLevel={activePropagationLevel}
            />
          </div>
        )}

        {viewMode === 'propagation-flow' && propagationState && (
          <PropagationFlowVisualization propagationState={propagationState} />
        )}
      </div>

      {/* Small Inset Graph (Bottom-right) - Show network when viewing other modes */}
      {showInsetGraph && viewMode !== 'network' && (
        <div className="absolute bottom-16 right-4 w-72 h-44 z-20 bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden">
          <div className="absolute top-2 left-2 z-30">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Network View</div>
          </div>
          <NetworkGraph2D
            nodes={STATIC_NETWORK.nodes}
            edges={STATIC_NETWORK.edges}
            activeLevel={activePropagationLevel}
            highlightedNodes={highlightedNodes}
            compact={true}
          />
        </div>
      )}

      {/* Propagation Stats Overlay */}
      {showPropagation && propagationState && viewMode !== 'propagation-flow' && (
        <div className="absolute top-20 right-4 w-72 max-h-80 overflow-y-auto bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg p-3 z-20">
          <h3 className="text-xs font-bold text-accent-cyan mb-2 flex items-center gap-2">
            <GitBranch size={14} />
            Live Propagation
          </h3>
          <div className="space-y-2 text-[10px]">
            {/* Level 2 */}
            {Array.from(propagationState.level2.entries()).slice(0, 2).map(([sector, state]) => (
              <div key={sector} className="bg-gray-900/50 rounded p-2">
                <div className="text-gray-400 font-medium">L2: {sector}</div>
                <div className={state.revenue_impact >= 0 ? 'text-green-400' : 'text-red-400'}>
                  Revenue: {state.revenue_impact >= 0 ? '+' : ''}{state.revenue_impact.toFixed(2)}%
                </div>
              </div>
            ))}
            {/* Level 3 */}
            {Array.from(propagationState.level3.entries()).slice(0, 2).map(([ticker, state]) => (
              <div key={ticker} className="bg-gray-900/50 rounded p-2">
                <div className="text-gray-400 font-medium">L3: {ticker}</div>
                <div className="text-gray-500">
                  Market Cap: ${(state.market_cap / 1000).toFixed(0)}B
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PropagationFlowVisualization - 9-level waterfall visualization
 */
function PropagationFlowVisualization({ propagationState }: { propagationState: PropagationState }) {
  return (
    <div className="h-full overflow-y-auto p-8 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Level 1 */}
        <LevelCard
          level={1}
          title="Macro Variables"
          color="from-cyan-500 to-blue-500"
          items={[
            { label: 'Fed Rate', value: `${((propagationState.level1.fed_funds_rate || 0) * 100).toFixed(2)}%` },
            { label: 'GDP Growth', value: `${((propagationState.level1.us_gdp_growth || 0) * 100).toFixed(2)}%` },
            { label: 'Inflation', value: `${((propagationState.level1.us_cpi || 0) * 100).toFixed(2)}%` },
          ]}
        />

        <Arrow />

        {/* Level 2 */}
        <LevelCard
          level={2}
          title="Sector Impact"
          color="from-green-500 to-emerald-500"
          items={Array.from(propagationState.level2.entries()).slice(0, 3).map(([sector, state]) => ({
            label: sector,
            value: `${state.revenue_impact >= 0 ? '+' : ''}${state.revenue_impact.toFixed(2)}%`,
            valueColor: state.revenue_impact >= 0 ? 'text-green-400' : 'text-red-400'
          }))}
        />

        <Arrow />

        {/* Level 3 */}
        <LevelCard
          level={3}
          title="Company Metrics"
          color="from-magenta-500 to-purple-500"
          items={Array.from(propagationState.level3.entries()).slice(0, 3).map(([ticker, state]) => ({
            label: ticker,
            value: `$${(state.market_cap / 1000).toFixed(0)}B`,
          }))}
        />

        <Arrow />

        {/* Level 5 */}
        <LevelCard
          level={5}
          title="Component Supply"
          color="from-red-500 to-orange-500"
          items={Array.from(propagationState.level5.entries()).slice(0, 3).map(([component, state]) => ({
            label: component,
            value: state.bottleneck ? '⚠️ Bottleneck' : '✅ Available',
            valueColor: state.bottleneck ? 'text-red-400' : 'text-green-400'
          }))}
        />

        <Arrow />

        {/* Level 9 */}
        <LevelCard
          level={9}
          title="Facility Operations"
          color="from-blue-500 to-indigo-500"
          items={Array.from(propagationState.level9.entries()).slice(0, 3).map(([facility, state]) => ({
            label: facility,
            value: `${state.utilization_pct.toFixed(1)}% utilized`,
            valueColor: state.capacity_constraint ? 'text-red-400' : 'text-green-400'
          }))}
        />
      </div>
    </div>
  );
}

function LevelCard({
  level,
  title,
  color,
  items
}: {
  level: number;
  title: string;
  color: string;
  items: { label: string; value: string; valueColor?: string }[];
}) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1 bg-gradient-to-r ${color} rounded-lg font-bold text-white text-sm`}>
          Level {level}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#0f0f0f] rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className={`text-sm font-bold ${item.valueColor || 'text-white'}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center">
      <div className="text-gray-600">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
          <path d="M12 0 L12 30 M12 30 L8 26 M12 30 L16 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
