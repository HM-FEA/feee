'use client';

import React, { useState, useEffect } from 'react';
import { Search, Play, Pause, SkipForward, SkipBack, Settings, Zap, Activity } from 'lucide-react';
import StudioLeftPanel from './StudioLeftPanel';
import StudioCenterStage from './StudioCenterStage';
import StudioRightPanel from './StudioRightPanel';
import StudioTimeControls from './StudioTimeControls';
import { useMacroStore } from '@/lib/store/macroStore';
import { propagateAllLevels, PropagationState } from '@/lib/finance/nineLevelPropagation';
import { companies } from '@/data/companies';

/**
 * SimulationStudio - 음향장비 스타일의 고도화된 시뮬레이션 작업장
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────────────┐
 * │  [Logo]  NEXUS-ALPHA SIMULATION STUDIO      [Search] [⚙️]    │
 * ├──────────┬─────────────────────────────────────┬─────────────┤
 * │          │                                     │             │
 * │  LEFT    │         CENTER STAGE               │    RIGHT    │
 * │  PANEL   │         (Globe + Views)            │    PANEL    │
 * │  (300px) │                                     │   (350px)   │
 * │          │                                     │             │
 * │ Controls │         [Ticker Search]            │ News/Charts │
 * │  Knobs   │                                     │             │
 * │  Sliders │         3D Visualization           │ Propagation │
 * │  Meters  │                                     │   Graph     │
 * │          │                                     │             │
 * ├──────────┴─────────────────────────────────────┴─────────────┤
 * │  TIME CONTROLS: [◀◀] [▶] [▶▶] [━━━━●─────] 1x  2024-01-01  │
 * └──────────────────────────────────────────────────────────────┘
 */

export interface TimeState {
  isPlaying: boolean;
  currentDate: Date;
  startDate: Date;
  endDate: Date;
  speed: 1 | 2 | 5 | 10 | 100;
  timeStep: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export default function StudioLayout() {
  // Global state
  const macroState = useMacroStore(state => state.macroState);
  const updateMacroVariable = useMacroStore(state => state.updateMacroVariable);

  // Local state
  const [searchTicker, setSearchTicker] = useState('');
  const [focusedCompany, setFocusedCompany] = useState<string | null>(null);
  const [timeState, setTimeState] = useState<TimeState>({
    isPlaying: false,
    currentDate: new Date('2024-01-01'),
    startDate: new Date('2020-01-01'),
    endDate: new Date('2024-12-31'),
    speed: 1,
    timeStep: 'month',
  });

  // 9-level propagation state
  const [propagationState, setPropagationState] = useState<PropagationState | null>(null);
  const [showPropagation, setShowPropagation] = useState(false);

  // Calculate propagation whenever macro changes
  useEffect(() => {
    const level0 = {
      container_rate_us_china: 3500,
      semiconductor_tariff: 0,
      energy_cost_index: 100,
    };

    const state = propagateAllLevels(level0, macroState, companies);
    setPropagationState(state);
  }, [macroState]);

  // Time-based simulation
  useEffect(() => {
    if (!timeState.isPlaying) return;

    const interval = setInterval(() => {
      setTimeState(prev => {
        const newDate = new Date(prev.currentDate);

        // Advance time based on timeStep and speed
        switch (prev.timeStep) {
          case 'day':
            newDate.setDate(newDate.getDate() + prev.speed);
            break;
          case 'week':
            newDate.setDate(newDate.getDate() + (7 * prev.speed));
            break;
          case 'month':
            newDate.setMonth(newDate.getMonth() + prev.speed);
            break;
          case 'quarter':
            newDate.setMonth(newDate.getMonth() + (3 * prev.speed));
            break;
          case 'year':
            newDate.setFullYear(newDate.getFullYear() + prev.speed);
            break;
        }

        // Stop if reached end date
        if (newDate > prev.endDate) {
          return { ...prev, isPlaying: false, currentDate: prev.endDate };
        }

        // TODO: Load historical macro data for this date
        // loadMacroDataForDate(newDate);

        return { ...prev, currentDate: newDate };
      });
    }, 1000 / timeState.speed); // Faster intervals for higher speeds

    return () => clearInterval(interval);
  }, [timeState.isPlaying, timeState.speed, timeState.timeStep]);

  // Handle ticker search
  const handleTickerSearch = (ticker: string) => {
    setSearchTicker(ticker);
    setFocusedCompany(ticker);
    // TODO: Center globe on company
  };

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Top Bar - Studio Header */}
      <div className="h-16 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-b border-gray-800 flex items-center justify-between px-6">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-accent-magenta rounded-lg flex items-center justify-center">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">
              NEXUS-ALPHA
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Simulation Studio
            </p>
          </div>
        </div>

        {/* Center - Ticker Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search ticker (e.g., NVDA, TSMC, JPM)..."
              value={searchTicker}
              onChange={(e) => handleTickerSearch(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>
        </div>

        {/* Right - Status Indicators */}
        <div className="flex items-center gap-4">
          {/* Propagation Toggle */}
          <button
            onClick={() => setShowPropagation(!showPropagation)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              showPropagation
                ? 'bg-accent-cyan text-black'
                : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:border-accent-cyan'
            }`}
          >
            <Activity size={18} />
            <span className="text-sm font-medium">9-Level</span>
          </button>

          {/* Settings */}
          <button className="p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-accent-cyan transition-colors">
            <Settings size={20} />
          </button>

          {/* Status LED */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${timeState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-500 uppercase">
              {timeState.isPlaying ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Controls (300px) */}
        <div className="w-[300px] bg-[#0f0f0f] border-r border-gray-800 overflow-y-auto">
          <StudioLeftPanel
            macroState={macroState}
            updateMacroVariable={updateMacroVariable}
          />
        </div>

        {/* Center Stage - Main Visualization */}
        <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden">
          <StudioCenterStage
            focusedCompany={focusedCompany}
            timeState={timeState}
            propagationState={propagationState}
            showPropagation={showPropagation}
          />
        </div>

        {/* Right Panel - News/Charts/Propagation (350px) */}
        <div className="w-[350px] bg-[#0f0f0f] border-l border-gray-800 overflow-y-auto">
          <StudioRightPanel
            focusedCompany={focusedCompany}
            propagationState={propagationState}
            showPropagation={showPropagation}
          />
        </div>
      </div>

      {/* Bottom - Time Controls */}
      <div className="h-20 bg-gradient-to-t from-[#1a1a1a] to-[#0f0f0f] border-t border-gray-800">
        <StudioTimeControls
          timeState={timeState}
          setTimeState={setTimeState}
        />
      </div>
    </div>
  );
}
