'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, TrendingUp, Users, Play, Check } from 'lucide-react';
import { SUPPLY_CHAIN_SCENARIOS, voteOnScenario } from '@/data/supplyChainScenarios';

interface ScenarioSelectorProps {
  onScenarioSelect: (scenarioId: string) => void;
  selectedScenarioId: string | null;
}

/**
 * ScenarioSelector - Polymarket 스타일 Supply Chain Scenario 선택기
 *
 * Features:
 * - Probability display (%)
 * - Vote counts
 * - Upvote/Downvote buttons
 * - Active scenario highlighting
 * - Run simulation button
 */

export default function ScenarioSelector({ onScenarioSelect, selectedScenarioId }: ScenarioSelectorProps) {
  const [scenarios, setScenarios] = useState(SUPPLY_CHAIN_SCENARIOS);

  const handleVote = (scenarioId: string, voteType: 'up' | 'down') => {
    const updated = voteOnScenario(scenarioId, voteType);
    setScenarios(updated);
  };

  const handleScenarioClick = (scenarioId: string) => {
    onScenarioSelect(scenarioId);
  };

  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-lg p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <TrendingUp size={16} className="text-accent-cyan" />
          Supply Chain Scenarios
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Polymarket-style prediction scenarios
        </p>
      </div>

      {/* Scenario List */}
      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarioId === scenario.id;
          const upvotePercent = (scenario.votes.up / scenario.votes.total) * 100;
          const downvotePercent = (scenario.votes.down / scenario.votes.total) * 100;

          return (
            <div
              key={scenario.id}
              className={`border rounded-lg p-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-accent-cyan bg-accent-cyan/10'
                  : 'border-gray-800 bg-[#1a1a1a] hover:border-gray-700'
              }`}
              onClick={() => handleScenarioClick(scenario.id)}
            >
              {/* Scenario Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isSelected && <Check size={14} className="text-accent-cyan" />}
                    <h4 className="text-sm font-medium text-white">
                      {scenario.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500">
                    {scenario.description}
                  </p>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-green-400 font-bold">
                    <ThumbsUp size={12} className="inline mr-1" />
                    {upvotePercent.toFixed(0)}%
                  </span>
                  <span className="text-gray-600">
                    {scenario.votes.total} votes
                  </span>
                  <span className="text-red-400 font-bold">
                    {downvotePercent.toFixed(0)}%
                    <ThumbsDown size={12} className="inline ml-1" />
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-green-500"
                    style={{ width: `${upvotePercent}%` }}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${downvotePercent}%` }}
                  />
                </div>
              </div>

              {/* Vote Buttons + Run */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(scenario.id, 'up');
                  }}
                  className="flex-1 px-2 py-1.5 bg-green-500/20 border border-green-500/50 rounded text-green-400 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <ThumbsUp size={12} />
                  <span>{scenario.votes.up}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(scenario.id, 'down');
                  }}
                  className="flex-1 px-2 py-1.5 bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-1 text-xs"
                >
                  <ThumbsDown size={12} />
                  <span>{scenario.votes.down}</span>
                </button>

                {isSelected && (
                  <button
                    className="px-3 py-1.5 bg-accent-cyan text-black rounded font-medium hover:bg-accent-cyan/80 transition-colors flex items-center gap-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Trigger propagation animation
                      console.log('Run simulation for:', scenario.id);
                    }}
                  >
                    <Play size={12} />
                    <span>Run</span>
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {scenario.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-600">
                <span className="flex items-center gap-1">
                  <Users size={10} />
                  {scenario.votes.total} participants
                </span>
                <span>Updated {scenario.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Scenario Button */}
      <button className="w-full mt-3 px-3 py-2 border border-dashed border-gray-700 rounded text-xs text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
        + Add New Scenario
      </button>
    </div>
  );
}
