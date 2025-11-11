'use client';

import React, { useState } from 'react';
import { Plus, ThumbsUp, ThumbsDown, Flame, Clock, CheckCircle, Play, Save, Sparkles, TrendingUp, Users, Award, Target } from 'lucide-react';
import { Card, Button } from '@/components/ui/DesignSystem';
import { useScenarioStore, Scenario } from '@/lib/store/scenarioStore';
import { useMacroStore } from '@/lib/store/macroStore';
import { useLevelStore } from '@/lib/store/levelStore';

interface ScenarioCardProps {
  scenario: Scenario;
  isCommunity?: boolean;
  onVote?: (scenarioId: string, isUpvote: boolean) => void;
  onLoad?: (scenarioId: string) => void;
}

const ScenarioCard = ({ scenario, isCommunity = false, onVote, onLoad }: ScenarioCardProps) => {
  const netVotes = (scenario.upvotes || 0) - (scenario.downvotes || 0);
  const totalVotes = (scenario.upvotes || 0) + (scenario.downvotes || 0);
  const approvalRate = totalVotes > 0 ? ((scenario.upvotes || 0) / totalVotes * 100) : 0;

  return (
    <Card className="hover:border-accent-cyan/50 transition-all cursor-pointer mb-3">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Votes */}
        {isCommunity && (
          <div className="flex flex-col items-center gap-1 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote?.(scenario.id, true);
              }}
              className="text-text-tertiary hover:text-accent-emerald transition-colors"
            >
              <ThumbsUp size={16} />
            </button>
            <span className={`text-sm font-bold ${netVotes > 0 ? 'text-accent-emerald' : netVotes < 0 ? 'text-red-400' : 'text-text-tertiary'}`}>
              {netVotes > 0 ? `+${netVotes}` : netVotes}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote?.(scenario.id, false);
              }}
              className="text-text-tertiary hover:text-red-400 transition-colors"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        )}

        {/* Center: Content */}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-2xl">{scenario.icon || '💾'}</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary mb-1">{scenario.name}</h3>
              <p className="text-xs text-text-secondary line-clamp-2">{scenario.description}</p>
            </div>
          </div>

          {/* Tags & Meta */}
          <div className="flex items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {scenario.createdBy}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(scenario.createdAt).toLocaleDateString()}
            </span>
            {scenario.isVerified && (
              <span className="flex items-center gap-1 text-accent-cyan">
                <CheckCircle size={12} />
                Verified
              </span>
            )}
            {isCommunity && approvalRate >= 70 && (
              <span className="text-accent-emerald font-semibold">
                {approvalRate.toFixed(0)}% approval
              </span>
            )}
          </div>

          {/* Tags */}
          {scenario.tags && scenario.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {scenario.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLoad?.(scenario.id);
            }}
            className="px-3 py-1.5 bg-accent-magenta/10 text-accent-magenta text-xs font-semibold rounded hover:bg-accent-magenta/20 transition-all flex items-center gap-1"
          >
            <Play size={12} />
            Load
          </button>
        </div>
      </div>
    </Card>
  );
};

interface CreateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateScenarioModal = ({ isOpen, onClose }: CreateScenarioModalProps) => {
  const [step, setStep] = useState<'info' | 'adjust' | 'preview'>('info');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const macroState = useMacroStore(state => state.macroState);
  const levelState = useLevelStore(state => state.levelState);
  const updateMacroVariable = useMacroStore(state => state.updateMacroVariable);
  const updateLevelControl = useLevelStore(state => state.updateLevelControl);
  const { saveScenario } = useScenarioStore();

  const iconOptions = ['🎯', '🚀', '⚠️', '💡', '🔥', '❄️', '📈', '📉', '🌟', '⚡', '🌊', '🏆'];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    saveScenario({
      name,
      description: description || 'Community scenario',
      icon,
      macroState,
      levelState,
      createdBy: 'user', // Would be actual user in production
      isPublic: true, // Community scenarios are public
      tags,
      upvotes: 0,
      downvotes: 0,
      isVerified: false,
    });

    // Reset form
    setStep('info');
    setName('');
    setDescription('');
    setIcon('🎯');
    setTags([]);
    onClose();
    alert('Scenario created and shared with community!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-background-primary border-2 border-accent-cyan rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles size={24} className="text-accent-cyan" />
            Create Community Scenario
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary text-2xl"
          >
            ×
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-6">
          {(['info', 'adjust', 'preview'] as const).map((s, idx) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'bg-accent-cyan text-black' : 'bg-background-secondary text-text-tertiary'}`}>
                {idx + 1}
              </div>
              <span className={`text-sm ${step === s ? 'text-text-primary font-semibold' : 'text-text-tertiary'}`}>
                {s === 'info' ? 'Info' : s === 'adjust' ? 'Adjust' : 'Preview'}
              </span>
              {idx < 2 && <div className="flex-1 h-0.5 bg-border-primary" />}
            </div>
          ))}
        </div>

        {/* Step 1: Info */}
        {step === 'info' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-2 block">Scenario Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., AI Winter 2025"
                className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-2 block">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes this scenario unique..."
                rows={4}
                className="w-full px-3 py-2 bg-background-secondary border border-border-primary rounded text-sm text-text-primary focus:outline-none focus:border-accent-cyan resize-none"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-2 block">Icon</label>
              <div className="flex gap-2">
                {iconOptions.map(i => (
                  <button
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`text-2xl w-12 h-12 rounded-lg transition-all ${icon === i ? 'bg-accent-cyan/20 border-2 border-accent-cyan' : 'bg-background-secondary border-2 border-transparent hover:border-border-primary'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tags (press Enter)"
                  className="flex-1 px-3 py-2 bg-background-secondary border border-border-primary rounded text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded hover:bg-accent-cyan/20 transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="text-accent-cyan hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-background-secondary text-text-primary border border-border-primary rounded hover:bg-background-tertiary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('adjust')}
                disabled={!name.trim() || !description.trim()}
                className="flex-1 px-4 py-2 bg-accent-cyan text-black font-semibold rounded hover:bg-accent-cyan/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Adjust Variables
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Adjust (show message to use Sim Lab) */}
        {step === 'adjust' && (
          <div className="space-y-4">
            <div className="bg-accent-cyan/10 border border-accent-cyan rounded-lg p-4">
              <p className="text-sm text-text-primary mb-3">
                <strong>Tip:</strong> Adjust macro variables and level controls in the <strong>Sim Lab</strong> page, then come back here to save your scenario.
              </p>
              <p className="text-xs text-text-secondary">
                Your current simulation state will be captured when you click "Create Scenario".
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Target size={16} className="text-accent-magenta" />
                  Macro Variables
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Fed Funds Rate:</span>
                    <span className="text-text-primary font-mono">{(macroState.fed_funds_rate * 100 || 5.25).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">GDP Growth:</span>
                    <span className="text-text-primary font-mono">{(macroState.us_gdp_growth * 100 || 2.5).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">VIX:</span>
                    <span className="text-text-primary font-mono">{(macroState.vix || 18.5).toFixed(1)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <TrendingUp size={16} className="text-accent-emerald" />
                  Level Controls
                </h4>
                <p className="text-xs text-text-tertiary">
                  {Object.keys(levelState).length} level-specific controls configured
                </p>
              </Card>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('info')}
                className="flex-1 px-4 py-2 bg-background-secondary text-text-primary border border-border-primary rounded hover:bg-background-tertiary transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep('preview')}
                className="flex-1 px-4 py-2 bg-accent-cyan text-black font-semibold rounded hover:bg-accent-cyan/80 transition-all"
              >
                Next: Preview
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <Card className="p-4 border-accent-cyan">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-4xl">{icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">{name}</h3>
                  <p className="text-sm text-text-secondary">{description}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-background-secondary p-3 rounded">
                  <div className="text-text-tertiary mb-1">Creator</div>
                  <div className="text-text-primary font-semibold">You</div>
                </div>
                <div className="bg-background-secondary p-3 rounded">
                  <div className="text-text-tertiary mb-1">Visibility</div>
                  <div className="text-accent-emerald font-semibold">Public</div>
                </div>
                <div className="bg-background-secondary p-3 rounded">
                  <div className="text-text-tertiary mb-1">Status</div>
                  <div className="text-accent-cyan font-semibold">Ready</div>
                </div>
              </div>
            </Card>

            <div className="bg-accent-emerald/10 border border-accent-emerald rounded-lg p-4">
              <p className="text-sm text-text-primary">
                ✅ Your scenario will be shared with the community and others can vote on it!
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('adjust')}
                className="flex-1 px-4 py-2 bg-background-secondary text-text-primary border border-border-primary rounded hover:bg-background-tertiary transition-all"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-magenta text-black font-bold rounded hover:opacity-90 transition-all"
              >
                Create Scenario
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ScenarioSection() {
  const [filter, setFilter] = useState<'trending' | 'my' | 'verified'>('trending');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { getAllScenarios, getUserScenarios, upvoteScenario, downvoteScenario, loadScenario } = useScenarioStore();

  // Mock community scenarios (in production, fetch from API)
  const communityScenarios = getAllScenarios().filter(s => s.isPublic);
  const myScenarios = getAllScenarios().filter(s => !s.isPublic || s.createdBy === 'user');

  const filteredScenarios = filter === 'trending'
    ? communityScenarios.sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)))
    : filter === 'verified'
    ? communityScenarios.filter(s => s.isVerified)
    : myScenarios;

  const handleVote = (scenarioId: string, isUpvote: boolean) => {
    if (isUpvote) {
      upvoteScenario(scenarioId);
    } else {
      downvoteScenario(scenarioId);
    }
  };

  const handleLoadScenario = (scenarioId: string) => {
    loadScenario(scenarioId);
    alert('Scenario loaded! Visit Sim Lab to see the changes.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['trending', 'verified', 'my'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-accent-cyan text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              {f === 'trending' && <Flame size={14} className="inline mr-1" />}
              {f === 'verified' && <CheckCircle size={14} className="inline mr-1" />}
              {f === 'my' && <Users size={14} className="inline mr-1" />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-accent-cyan to-accent-magenta text-black font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          Create Scenario
        </button>
      </div>

      {/* Scenarios List */}
      <div className="space-y-3">
        {filteredScenarios.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-sm text-text-secondary mb-4">No scenarios found. Create the first one!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded hover:bg-accent-cyan/80 transition-all"
            >
              <Plus size={16} className="inline mr-2" />
              Create Scenario
            </button>
          </Card>
        ) : (
          filteredScenarios.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isCommunity={filter !== 'my'}
              onVote={handleVote}
              onLoad={handleLoadScenario}
            />
          ))
        )}
      </div>

      {/* Create Modal */}
      <CreateScenarioModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
