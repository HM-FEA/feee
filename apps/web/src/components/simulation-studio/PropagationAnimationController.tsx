'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Zap } from 'lucide-react';

/**
 * PropagationAnimationController
 *
 * 화학 반응처럼 Level 0 → Level 9까지 순차적으로 빛나는 애니메이션
 *
 * Flow:
 * 1. User changes a control (e.g., Fed Rate +50bps)
 * 2. Animation starts:
 *    - Level 1 glows (0.5s)
 *    - Level 2 glows (0.5s delay)
 *    - Level 3 glows (1.0s delay)
 *    - ... continues
 *    - Level 9 glows (4.0s delay)
 * 3. Each level shows impact value during glow
 * 4. Graph nodes also glow in sync
 */

export interface PropagationStep {
  level: number;
  label: string;
  impact: string;
  timestamp: number;
}

export interface PropagationAnimationState {
  isAnimating: boolean;
  currentLevel: number;
  steps: PropagationStep[];
  progress: number; // 0-100
}

interface PropagationAnimationControllerProps {
  onLevelActivate: (level: number) => void;
  onAnimationComplete: () => void;
}

export function usePropagationAnimation() {
  const [animationState, setAnimationState] = useState<PropagationAnimationState>({
    isAnimating: false,
    currentLevel: -1,
    steps: [],
    progress: 0
  });

  const startPropagation = useCallback((changeSummary: string) => {
    // Define propagation steps
    const steps: PropagationStep[] = [
      { level: 1, label: 'Macro Variables', impact: 'Fed Rate +50bps', timestamp: 0 },
      { level: 2, label: 'Sector Impact', impact: 'Semiconductor -0.20%', timestamp: 500 },
      { level: 3, label: 'Company Metrics', impact: 'NVIDIA -3.0%', timestamp: 1000 },
      { level: 4, label: 'Product Demand', impact: 'H100 -1.5%', timestamp: 1500 },
      { level: 5, label: 'Component Supply', impact: 'HBM3E Relieved', timestamp: 2000 },
      { level: 6, label: 'Technology', impact: 'AI Investment -$10B', timestamp: 2500 },
      { level: 7, label: 'Ownership', impact: 'Institutional -1.0%', timestamp: 3000 },
      { level: 8, label: 'Customer', impact: 'CapEx -$0.5B', timestamp: 3500 },
      { level: 9, label: 'Facility', impact: 'Utilization 94.7%', timestamp: 4000 }
    ];

    setAnimationState({
      isAnimating: true,
      currentLevel: 0,
      steps,
      progress: 0
    });

    // Animate through each level
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          currentLevel: step.level,
          progress: ((index + 1) / steps.length) * 100
        }));
      }, step.timestamp);
    });

    // Complete animation
    setTimeout(() => {
      setAnimationState({
        isAnimating: false,
        currentLevel: -1,
        steps: [],
        progress: 100
      });
    }, steps[steps.length - 1].timestamp + 1000);

  }, []);

  const stopPropagation = useCallback(() => {
    setAnimationState({
      isAnimating: false,
      currentLevel: -1,
      steps: [],
      progress: 0
    });
  }, []);

  return {
    animationState,
    startPropagation,
    stopPropagation
  };
}

/**
 * PropagationWave - Visual indicator of propagation wave
 */
export function PropagationWave({ animationState }: { animationState: PropagationAnimationState }) {
  if (!animationState.isAnimating) return null;

  const currentStep = animationState.steps.find(s => s.level === animationState.currentLevel);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Ripple Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-64 h-64 rounded-full border-4 border-accent-cyan animate-ping"
          style={{
            animationDuration: '0.5s',
            opacity: 0.5
          }}
        />
      </div>

      {/* Current Level Indicator */}
      {currentStep && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border-2 border-accent-cyan rounded-lg p-6 backdrop-blur-md shadow-2xl shadow-accent-cyan/50">
          <div className="flex items-center gap-3 mb-2">
            <Zap size={24} className="text-accent-cyan animate-pulse" />
            <div>
              <div className="text-sm font-bold text-accent-cyan">
                Level {currentStep.level}
              </div>
              <div className="text-xs text-gray-400">
                {currentStep.label}
              </div>
            </div>
          </div>
          <div className="text-lg font-bold text-white">
            {currentStep.impact}
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-cyan to-accent-magenta transition-all duration-500"
              style={{ width: `${animationState.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Particle Effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent-cyan rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * PropagationTimeline - Shows propagation history
 */
export function PropagationTimeline({ steps }: { steps: PropagationStep[] }) {
  if (steps.length === 0) return null;

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">
        Propagation Timeline
      </h4>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-cyan/20 border border-accent-cyan flex items-center justify-center text-xs font-bold text-accent-cyan">
              {step.level}
            </div>
            <div className="flex-1">
              <div className="text-xs text-white font-medium">
                {step.label}
              </div>
              <div className="text-[10px] text-gray-500">
                {step.impact}
              </div>
            </div>
            <div className="text-[10px] text-gray-600">
              +{step.timestamp}ms
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
