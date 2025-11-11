'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/DesignSystem';
import { TrendingUp, TrendingDown, ArrowRight, Activity, DollarSign, Zap } from 'lucide-react';
import {
  EconomicFlow,
  FlowNode,
  calculateEconomicFlows,
  buildFlowNetwork,
  getFlowSummary,
  calculateMoneyVelocity,
  calculateCreditMultiplier,
} from '@/lib/utils/economicFlows';
import { MacroState } from '@/lib/store/macroStore';
import { LevelState } from '@/lib/store/levelStore';

interface EconomicFlowDashboardProps {
  currentMacro: MacroState;
  previousMacro: MacroState;
  levelState: LevelState;
}

export default function EconomicFlowDashboard({
  currentMacro,
  previousMacro,
  levelState,
}: EconomicFlowDashboardProps) {
  // Calculate flows
  const flows = useMemo(
    () => calculateEconomicFlows(currentMacro, previousMacro, levelState),
    [currentMacro, previousMacro, levelState]
  );

  const flowNetwork = useMemo(() => buildFlowNetwork(flows), [flows]);
  const summary = useMemo(() => getFlowSummary(flows), [flows]);

  // Calculate derived metrics
  const moneyVelocity = calculateMoneyVelocity(
    currentMacro.us_gdp_growth * 1e12, // Approximate GDP
    currentMacro.us_m2_money_supply
  );

  const creditMultiplier = calculateCreditMultiplier(0.10); // 10% reserve ratio

  // Group flows by type
  const flowsByType = useMemo(() => {
    const groups = {
      monetary: flows.filter(f => f.type === 'monetary'),
      credit: flows.filter(f => f.type === 'credit'),
      policy: flows.filter(f => f.type === 'policy'),
      investment: flows.filter(f => f.type === 'investment'),
      trade: flows.filter(f => f.type === 'trade'),
    };
    return groups;
  }, [flows]);

  // Top flows by magnitude
  const topFlows = useMemo(() => {
    return [...flows].sort((a, b) => b.magnitude - a.magnitude).slice(0, 5);
  }, [flows]);

  // Node statistics
  const topInflowNodes = useMemo(() => {
    return [...flowNetwork.nodes].sort((a, b) => b.inflows - a.inflows).slice(0, 3);
  }, [flowNetwork]);

  const topOutflowNodes = useMemo(() => {
    return [...flowNetwork.nodes].sort((a, b) => b.outflows - a.outflows).slice(0, 3);
  }, [flowNetwork]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Activity className="text-accent-cyan" size={24} />
            Economic Flow Analysis
          </h2>
          <p className="text-sm text-text-tertiary">
            Real-time money flow tracking: Fed Rate → Banks → Companies → Markets
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Total Flows</div>
          <div className="text-2xl font-bold text-accent-cyan">{summary.totalFlows}</div>
          <div className="text-xs text-text-secondary mt-1">
            {summary.positiveFlows} positive, {summary.negativeFlows} negative
          </div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Money Velocity</div>
          <div className="text-2xl font-bold text-accent-emerald">
            {moneyVelocity.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary mt-1">GDP / M2 ratio</div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Credit Multiplier</div>
          <div className="text-2xl font-bold text-accent-magenta">
            {creditMultiplier.toFixed(1)}x
          </div>
          <div className="text-xs text-text-secondary mt-1">Banking system leverage</div>
        </Card>

        <Card className="bg-background-secondary">
          <div className="text-xs text-text-tertiary mb-1">Avg Magnitude</div>
          <div className="text-2xl font-bold text-accent-yellow">
            {summary.averageMagnitude.toFixed(1)}
          </div>
          <div className="text-xs text-text-secondary mt-1">Flow intensity</div>
        </Card>
      </div>

      {/* Main Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Flows */}
        <Card className="bg-background-secondary">
          <div className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Zap size={16} className="text-accent-cyan" />
            Top Economic Flows
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {topFlows.map((flow, idx) => (
              <div
                key={flow.id}
                className={`p-3 rounded-lg border ${
                  flow.impact === 'positive'
                    ? 'bg-accent-emerald/10 border-accent-emerald/30'
                    : flow.impact === 'negative'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-background-tertiary border-border-primary'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-text-primary">
                    <span className="text-text-tertiary">#{idx + 1}</span>
                    {flow.from}
                    <ArrowRight size={12} />
                    {flow.to}
                  </div>
                  <div className="flex items-center gap-1">
                    {flow.impact === 'positive' ? (
                      <TrendingUp size={14} className="text-accent-emerald" />
                    ) : flow.impact === 'negative' ? (
                      <TrendingDown size={14} className="text-red-400" />
                    ) : (
                      <ArrowRight size={14} className="text-text-tertiary" />
                    )}
                    <span className="text-xs font-bold font-mono">
                      {flow.magnitude.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-text-secondary">{flow.description}</div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-text-tertiary">Type:</span>
                  <span className="px-2 py-0.5 rounded bg-background-tertiary text-accent-cyan">
                    {flow.type}
                  </span>
                  <span className="text-text-tertiary">Multiplier:</span>
                  <span className="font-mono text-accent-magenta">
                    {flow.multiplier.toFixed(1)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Flow Network Stats */}
        <Card className="bg-background-secondary">
          <div className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <DollarSign size={16} className="text-accent-emerald" />
            Network Statistics
          </div>

          {/* Top Inflow Nodes */}
          <div className="mb-4">
            <div className="text-xs text-text-tertiary mb-2 font-semibold">
              Top Recipients (Inflows)
            </div>
            <div className="space-y-2">
              {topInflowNodes.map((node, idx) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2 bg-background-tertiary rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary truncate">
                      {node.name}
                    </div>
                    <div className="text-xs text-text-tertiary">{node.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-accent-emerald font-mono">
                      +{node.inflows.toFixed(1)}
                    </div>
                    <div className="text-xs text-text-tertiary">inflow</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Outflow Nodes */}
          <div>
            <div className="text-xs text-text-tertiary mb-2 font-semibold">
              Top Sources (Outflows)
            </div>
            <div className="space-y-2">
              {topOutflowNodes.map((node, idx) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-2 bg-background-tertiary rounded"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-text-primary truncate">
                      {node.name}
                    </div>
                    <div className="text-xs text-text-tertiary">{node.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-400 font-mono">
                      -{node.outflows.toFixed(1)}
                    </div>
                    <div className="text-xs text-text-tertiary">outflow</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Flow Breakdown by Type */}
      <Card className="bg-background-secondary">
        <div className="text-sm font-semibold text-text-primary mb-3">
          Flow Breakdown by Type
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(flowsByType).map(([type, typeFlows]) => (
            <div key={type} className="p-3 bg-background-tertiary rounded-lg">
              <div className="text-xs text-text-tertiary mb-1 uppercase">{type}</div>
              <div className="text-2xl font-bold text-accent-cyan mb-1">
                {typeFlows.length}
              </div>
              <div className="text-xs text-text-secondary">
                Avg: {typeFlows.length > 0
                  ? (typeFlows.reduce((s, f) => s + f.magnitude, 0) / typeFlows.length).toFixed(1)
                  : '0'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Most Affected Entity */}
      {summary.mostAffectedEntity && (
        <Card className="bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 border-2 border-accent-cyan/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-text-tertiary mb-1">Most Affected Entity</div>
              <div className="text-xl font-bold text-accent-cyan">
                {summary.mostAffectedEntity}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                Central hub in economic flow network
              </div>
            </div>
            <Activity size={40} className="text-accent-cyan opacity-50" />
          </div>
        </Card>
      )}
    </div>
  );
}
