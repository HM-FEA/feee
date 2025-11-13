'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Network, Globe as GlobeIcon, GitBranch, Activity } from 'lucide-react';
import { PropagationState } from '@/lib/finance/nineLevelPropagation';
import { TimeState } from './StudioLayout';

// Dynamic imports for 3D components
const Globe3D = dynamic(() => import('@/components/visualization/Globe3D'), { ssr: false });
const ForceNetworkGraph3D = dynamic(() => import('@/components/visualization/ForceNetworkGraph3D'), { ssr: false });

interface StudioCenterStageProps {
  focusedCompany: string | null;
  timeState: TimeState;
  propagationState: PropagationState | null;
  showPropagation: boolean;
}

type ViewMode = 'globe' | 'network' | 'propagation-flow';

/**
 * StudioCenterStage - Main visualization area
 *
 * Modes:
 * - Globe: 3D globe with companies and economic flows
 * - Network: 3D force-directed graph of relationships
 * - Propagation Flow: 9-level propagation waterfall
 */

export default function StudioCenterStage({
  focusedCompany,
  timeState,
  propagationState,
  showPropagation
}: StudioCenterStageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [globeViewMode, setGlobeViewMode] = useState<'companies' | 'flows' | 'm2'>('companies');

  return (
    <div className="h-full relative">
      {/* View Mode Selector (Top-left overlay) */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setViewMode('globe')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all backdrop-blur-md ${
            viewMode === 'globe'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/40 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <GlobeIcon size={18} />
          <span className="text-sm font-medium">Globe</span>
        </button>
        <button
          onClick={() => setViewMode('network')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all backdrop-blur-md ${
            viewMode === 'network'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/40 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <Network size={18} />
          <span className="text-sm font-medium">Network</span>
        </button>
        <button
          onClick={() => setViewMode('propagation-flow')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all backdrop-blur-md ${
            viewMode === 'propagation-flow'
              ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50'
              : 'bg-black/40 text-gray-400 border border-gray-700/50 hover:border-gray-600'
          }`}
        >
          <GitBranch size={18} />
          <span className="text-sm font-medium">9-Level Flow</span>
        </button>
      </div>

      {/* Globe Sub-mode Selector (Top-right overlay, only for globe view) */}
      {viewMode === 'globe' && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setGlobeViewMode('companies')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all backdrop-blur-md ${
              globeViewMode === 'companies'
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Companies
          </button>
          <button
            onClick={() => setGlobeViewMode('flows')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all backdrop-blur-md ${
              globeViewMode === 'flows'
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            Economic Flows
          </button>
          <button
            onClick={() => setGlobeViewMode('m2')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all backdrop-blur-md ${
              globeViewMode === 'm2'
                ? 'bg-accent-cyan/20 text-accent-cyan'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            M2 Money Flow
          </button>
        </div>
      )}

      {/* Focused Company Indicator (Top-center, when ticker is searched) */}
      {focusedCompany && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-accent-cyan/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-accent-cyan animate-pulse" />
              <div>
                <div className="text-xs text-gray-400">Focused on</div>
                <div className="text-sm font-bold text-accent-cyan">{focusedCompany}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Indicator (Bottom-left overlay) */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="px-4 py-2 bg-black/80 backdrop-blur-md border border-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${timeState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            <div className="text-sm font-mono text-gray-300">
              {timeState.currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-600">
              {timeState.speed}x
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="h-full">
        {viewMode === 'globe' && (
          <Globe3D viewMode={globeViewMode} focusedCompany={focusedCompany} />
        )}

        {viewMode === 'network' && (
          <ForceNetworkGraph3D />
        )}

        {viewMode === 'propagation-flow' && propagationState && (
          <PropagationFlowVisualization propagationState={propagationState} />
        )}
      </div>

      {/* Propagation Overlay (when showPropagation is true) */}
      {showPropagation && propagationState && viewMode !== 'propagation-flow' && (
        <div className="absolute bottom-20 right-4 w-80 max-h-96 overflow-y-auto bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg p-4 z-10">
          <h3 className="text-sm font-bold text-accent-cyan mb-3 flex items-center gap-2">
            <GitBranch size={16} />
            Live Propagation
          </h3>
          <div className="space-y-2 text-xs">
            {/* Level 2 */}
            <div>
              <div className="text-gray-400 font-medium">L2: Semiconductor</div>
              <div className="text-gray-500">
                Revenue: {propagationState.level2.get('SEMICONDUCTOR')?.revenue_impact.toFixed(2)}%
              </div>
            </div>
            {/* Level 3 */}
            <div>
              <div className="text-gray-400 font-medium">L3: NVIDIA</div>
              <div className="text-gray-500">
                Market Cap: ${(propagationState.level3.get('NVDA')?.market_cap / 1000).toFixed(0)}B
              </div>
            </div>
            {/* Level 5 */}
            <div>
              <div className="text-gray-400 font-medium">L5: HBM3E</div>
              <div className={propagationState.level5.get('HBM3E')?.bottleneck ? 'text-red-400' : 'text-green-400'}>
                {propagationState.level5.get('HBM3E')?.bottleneck ? '⚠️ Bottleneck' : '✅ No Constraint'}
              </div>
            </div>
            {/* Level 9 */}
            <div>
              <div className="text-gray-400 font-medium">L9: TSMC Fab</div>
              <div className="text-gray-500">
                Utilization: {propagationState.level9.get('TSMC_FAB18')?.utilization_pct.toFixed(1)}%
              </div>
            </div>
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
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Level 1 */}
        <LevelCard
          level={1}
          title="Macro Variables"
          color="from-blue-500 to-cyan-500"
          items={[
            { label: 'Fed Rate', value: `${(propagationState.level1.fed_funds_rate * 100).toFixed(2)}%` },
            { label: 'GDP Growth', value: `${(propagationState.level1.us_gdp_growth * 100).toFixed(2)}%` },
            { label: 'Inflation', value: `${(propagationState.level1.us_cpi * 100).toFixed(2)}%` },
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
          color="from-purple-500 to-pink-500"
          items={Array.from(propagationState.level3.entries()).slice(0, 3).map(([ticker, state]) => ({
            label: ticker,
            value: `$${(state.market_cap / 1000).toFixed(0)}B`,
          }))}
        />

        <Arrow />

        {/* Level 5 (skip 4 for brevity) */}
        <LevelCard
          level={5}
          title="Component Supply"
          color="from-orange-500 to-red-500"
          items={Array.from(propagationState.level5.entries()).map(([component, state]) => ({
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
          color="from-yellow-500 to-amber-500"
          items={Array.from(propagationState.level9.entries()).map(([facility, state]) => ({
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
    <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1 bg-gradient-to-r ${color} rounded-lg font-bold text-white`}>
          L{level}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#0f0f0f] border border-gray-800 rounded p-3">
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
      <div className="w-0.5 h-8 bg-gradient-to-b from-accent-cyan/50 to-transparent" />
    </div>
  );
}
