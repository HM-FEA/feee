'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/ui/Button';
import { Slider } from '@/components/shared/ui/Slider';

interface RealEstateControlsProps {
  onRunSimulation: (params: {
    interestRate: number;
    timeHorizon: number;
    selectedTickers: string[];
  }) => void;
  loading?: boolean;
}

export const RealEstateControls = ({ onRunSimulation, loading = false }: RealEstateControlsProps) => {
  const [interestRate, setInterestRate] = useState(3.5);
  const [timeHorizon, setTimeHorizon] = useState(12);

  const handleRun = () => {
    onRunSimulation({
      interestRate,
      timeHorizon,
      selectedTickers: [], // Will be managed by parent
    });
  };

  return (
    <div className="space-y-6">
      {/* Interest Rate Slider */}
      <div>
        <Slider
          label="Interest Rate"
          min={0}
          max={10}
          step={0.1}
          value={interestRate}
          onChange={setInterestRate}
          unit="%"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Simulate the impact of different interest rate scenarios
        </p>
      </div>

      {/* Time Horizon */}
      <div>
        <Slider
          label="Time Horizon"
          min={1}
          max={60}
          step={1}
          value={timeHorizon}
          onChange={setTimeHorizon}
          unit=" months"
        />
        <p className="text-xs text-text-tertiary mt-2">
          Projection period for the simulation
        </p>
      </div>

      {/* Run Simulation Button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleRun}
        loading={loading}
      >
        Run Simulation
      </Button>

      {/* Quick Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Quick Metrics</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-tertiary">Base Rate</span>
            <span className="text-text-primary font-medium">2.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-tertiary">Rate Change</span>
            <span className={`font-medium ${interestRate > 2.5 ? 'text-accent-red' : 'text-accent-green'}`}>
              {interestRate > 2.5 ? '+' : ''}{(interestRate - 2.5).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
