'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Calendar, Clock, Gauge } from 'lucide-react';
import { TimeState } from './StudioLayout';

interface StudioTimeControlsProps {
  timeState: TimeState;
  setTimeState: React.Dispatch<React.SetStateAction<TimeState>>;
}

/**
 * StudioTimeControls - 음향장비 스타일의 Time Control Bar
 *
 * Features:
 * - Play/Pause/Skip controls
 * - Speed adjustment (1x, 2x, 5x, 10x, 100x)
 * - Date range selector
 * - Time step selector (day/week/month/quarter/year)
 * - Progress bar with scrubbing
 */

export default function StudioTimeControls({ timeState, setTimeState }: StudioTimeControlsProps) {
  const handlePlayPause = () => {
    setTimeState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleSkipBack = () => {
    setTimeState(prev => {
      const newDate = new Date(prev.currentDate);
      switch (prev.timeStep) {
        case 'day':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() - 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'quarter':
          newDate.setMonth(newDate.getMonth() - 3);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }
      return { ...prev, currentDate: newDate };
    });
  };

  const handleSkipForward = () => {
    setTimeState(prev => {
      const newDate = new Date(prev.currentDate);
      switch (prev.timeStep) {
        case 'day':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'week':
          newDate.setDate(newDate.getDate() + 7);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'quarter':
          newDate.setMonth(newDate.getMonth() + 3);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return { ...prev, currentDate: newDate };
    });
  };

  const handleSpeedChange = (speed: TimeState['speed']) => {
    setTimeState(prev => ({ ...prev, speed }));
  };

  const handleTimeStepChange = (timeStep: TimeState['timeStep']) => {
    setTimeState(prev => ({ ...prev, timeStep }));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value) / 100;
    const totalTime = timeState.endDate.getTime() - timeState.startDate.getTime();
    const newTime = timeState.startDate.getTime() + (totalTime * percent);
    setTimeState(prev => ({ ...prev, currentDate: new Date(newTime) }));
  };

  // Calculate progress percentage
  const totalTime = timeState.endDate.getTime() - timeState.startDate.getTime();
  const currentProgress = timeState.currentDate.getTime() - timeState.startDate.getTime();
  const progressPercent = (currentProgress / totalTime) * 100;

  return (
    <div className="h-full px-6 flex items-center gap-6">
      {/* Left: Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSkipBack}
          className="p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-accent-cyan transition-colors"
          title={`Skip back 1 ${timeState.timeStep}`}
        >
          <SkipBack size={18} />
        </button>

        <button
          onClick={handlePlayPause}
          className={`p-3 rounded-lg transition-all ${
            timeState.isPlaying
              ? 'bg-accent-cyan text-black hover:bg-accent-cyan/80'
              : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:text-white hover:border-accent-cyan'
          }`}
        >
          {timeState.isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={handleSkipForward}
          className="p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-accent-cyan transition-colors"
          title={`Skip forward 1 ${timeState.timeStep}`}
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Center: Timeline Scrubber */}
      <div className="flex-1 space-y-1">
        {/* Current Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span className="font-mono">
              {timeState.currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">
              {timeState.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </span>
            <span className="text-gray-700">→</span>
            <span className="text-gray-600">
              {timeState.endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progressPercent}
            onChange={handleProgressChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #00d4ff 0%, #00d4ff ${progressPercent}%, #1a1a1a ${progressPercent}%, #1a1a1a 100%)`
            }}
          />
          {/* Time markers */}
          <div className="absolute inset-0 flex pointer-events-none">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="flex-1 border-l border-gray-800 first:border-l-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Speed & Time Step Controls */}
      <div className="flex items-center gap-4">
        {/* Time Step Selector */}
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-600" />
          <div className="flex gap-1">
            {(['day', 'week', 'month', 'quarter', 'year'] as const).map((step) => (
              <button
                key={step}
                onClick={() => handleTimeStepChange(step)}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                  timeState.timeStep === step
                    ? 'bg-accent-cyan text-black'
                    : 'bg-[#1a1a1a] text-gray-500 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                {step[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <Gauge size={14} className="text-gray-600" />
          <div className="flex gap-1">
            {[1, 2, 5, 10, 100].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed as TimeState['speed'])}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors min-w-[32px] ${
                  timeState.speed === speed
                    ? 'bg-accent-magenta text-black'
                    : 'bg-[#1a1a1a] text-gray-500 hover:text-white border border-gray-800 hover:border-gray-700'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* VU Meter Style Speed Indicator */}
        <div className="w-16 h-8 bg-[#0a0a0a] border border-gray-800 rounded overflow-hidden">
          <div className="h-full flex items-end justify-center gap-0.5 p-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
              const threshold = (bar / 8) * 100;
              const speedPercent = Math.log10(timeState.speed) / Math.log10(100) * 100;
              const isActive = speedPercent >= threshold;
              const color = bar <= 4 ? '#00ff88' : bar <= 6 ? '#ffaa00' : '#ff6b6b';

              return (
                <div
                  key={bar}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    backgroundColor: isActive ? color : '#1a1a1a',
                    opacity: isActive ? 1 : 0.3,
                    height: `${20 + (bar * 10)}%`
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
