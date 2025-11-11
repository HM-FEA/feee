'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, Clock, Activity } from 'lucide-react';
import { Card, Button } from '@/components/ui/DesignSystem';
import { useMacroStore } from '@/lib/store/macroStore';
import { useLevelStore } from '@/lib/store/levelStore';
import {
  runTimelineSimulation,
  interpolateTimeSteps,
  TimeStep,
  EntityState,
  SimulationConfig,
} from '@/lib/utils/timelineSimulation';

/**
 * Simulation Timeline - 시간에 따른 impact 전파 시뮬레이션
 */

interface SimulationTimelineProps {
  onTimeStepChange?: (timeStep: number, entityStates: Map<string, EntityState>) => void;
}

export default function SimulationTimeline({ onTimeStepChange }: SimulationTimelineProps) {
  const macroState = useMacroStore((state) => state.macroState);
  const levelState = useLevelStore((state) => state.levelState);

  const [timeSteps, setTimeSteps] = useState<TimeStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // 1.0 = 1초당 1 step
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    maxTimeSteps: 10,
    convergenceThreshold: 0.01,
    propagationSpeed: 1.0,
  });

  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  // 시뮬레이션 실행
  const runSimulation = () => {
    console.log('Running timeline simulation...');
    const steps = runTimelineSimulation(macroState, levelState, simulationConfig);
    setTimeSteps(steps);
    setCurrentStep(0);
    setIsPlaying(false);

    if (steps.length > 0 && onTimeStepChange) {
      onTimeStepChange(0, steps[0].entityStates);
    }
  };

  // 초기 시뮬레이션 실행
  useEffect(() => {
    runSimulation();
  }, []); // 최초 1회만

  // 재생 루프
  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;

      // playbackSpeed에 따라 진행 (1.0 = 1초당 1 step)
      if (deltaTime >= 1000 / playbackSpeed) {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= timeSteps.length) {
            setIsPlaying(false);
            return prev;
          }

          if (onTimeStepChange) {
            onTimeStepChange(next, timeSteps[next].entityStates);
          }

          return next;
        });

        lastUpdateRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, timeSteps, onTimeStepChange]);

  // 재생/일시정지
  const togglePlayback = () => {
    if (currentStep >= timeSteps.length - 1) {
      // 끝에 도달했으면 처음부터 재생
      setCurrentStep(0);
      if (onTimeStepChange) {
        onTimeStepChange(0, timeSteps[0].entityStates);
      }
    }
    setIsPlaying(!isPlaying);
    lastUpdateRef.current = Date.now();
  };

  // 리셋
  const resetSimulation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (timeSteps.length > 0 && onTimeStepChange) {
      onTimeStepChange(0, timeSteps[0].entityStates);
    }
  };

  // 수동 step 변경
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
    if (onTimeStepChange) {
      onTimeStepChange(step, timeSteps[step].entityStates);
    }
  };

  // 앞으로/뒤로 1 step
  const stepForward = () => {
    if (currentStep < timeSteps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  const currentTimeStep = timeSteps[currentStep];
  const progress = timeSteps.length > 1 ? (currentStep / (timeSteps.length - 1)) * 100 : 0;

  return (
    <Card className="bg-background-primary border-2 border-accent-cyan/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center">
            <Clock size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Timeline Simulation</h3>
            <p className="text-xs text-text-tertiary">
              {timeSteps.length} steps · Impact propagation over time
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" onClick={runSimulation}>
          <RotateCcw size={14} className="mr-1" />
          Re-run
        </Button>
      </div>

      {/* Current Step Info */}
      {currentTimeStep && (
        <div className="bg-background-secondary rounded-lg p-3 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs text-text-tertiary">Current Step</div>
              <div className="text-2xl font-bold text-accent-cyan">t = {currentTimeStep.time}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-tertiary">Active Changes</div>
              <div className="text-xl font-bold text-accent-emerald">
                {currentTimeStep.activeChanges.length}
              </div>
            </div>
          </div>
          <div className="text-xs text-text-secondary">{currentTimeStep.description}</div>
        </div>
      )}

      {/* Timeline Slider */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-text-tertiary">t=0</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={timeSteps.length - 1}
              value={currentStep}
              onChange={(e) => handleStepChange(parseInt(e.target.value))}
              className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #00E5FF ${progress}%, #27272E ${progress}%)`,
              }}
            />
            {/* Time markers */}
            <div className="flex justify-between mt-1">
              {timeSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx <= currentStep ? 'bg-accent-cyan' : 'bg-border-primary'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-text-tertiary">t={timeSteps.length - 1}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            className="w-8 h-8 rounded bg-background-secondary hover:bg-background-tertiary transition-colors flex items-center justify-center text-text-secondary hover:text-text-primary"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="w-8 h-8 rounded bg-background-secondary hover:bg-background-tertiary transition-colors flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <Rewind size={16} />
          </button>

          <button
            onClick={togglePlayback}
            className="w-10 h-10 rounded-full bg-accent-cyan hover:bg-accent-cyan/80 transition-colors flex items-center justify-center text-black font-bold"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep === timeSteps.length - 1}
            className="w-8 h-8 rounded bg-background-secondary hover:bg-background-tertiary transition-colors flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <FastForward size={16} />
          </button>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-tertiary">Speed:</span>
          <div className="flex gap-1">
            {[0.5, 1.0, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  playbackSpeed === speed
                    ? 'bg-accent-magenta text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Changes List */}
      {currentTimeStep && currentTimeStep.activeChanges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-primary">
          <div className="text-xs font-semibold text-text-secondary mb-2 flex items-center gap-2">
            <Activity size={12} className="text-accent-emerald" />
            Changes in this step ({currentTimeStep.activeChanges.length})
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentTimeStep.activeChanges.slice(0, 5).map((change, idx) => (
              <div
                key={idx}
                className="text-xs p-2 bg-background-secondary rounded flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-accent-cyan font-medium truncate">{change.sourceName}</span>
                  <span className="text-text-tertiary">→</span>
                  <span className="text-text-primary truncate">{change.targetName}</span>
                </div>
                <span
                  className={`font-mono font-bold ${
                    change.impactMagnitude > 0 ? 'text-accent-emerald' : 'text-red-400'
                  }`}
                >
                  {change.impactMagnitude > 0 ? '+' : ''}
                  {(change.impactMagnitude * 100).toFixed(1)}%
                </span>
              </div>
            ))}
            {currentTimeStep.activeChanges.length > 5 && (
              <div className="text-xs text-text-tertiary text-center py-1">
                +{currentTimeStep.activeChanges.length - 5} more changes
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
