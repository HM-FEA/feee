/**
 * Economic Flow Modeling
 *
 * Tracks how changes in macro variables (Fed Rate, M2, GDP) propagate through
 * the economic network: Central Bank → Banks → Companies → Consumers → Markets
 *
 * Implements:
 * - Money velocity and circulation
 * - Credit multiplier effects
 * - Interest rate transmission mechanism
 * - Fiscal/monetary policy impacts
 * - Cross-asset correlations
 */

import { MacroState } from '../store/macroStore';
import { LevelState } from '../store/levelStore';

/**
 * Economic Flow represents a directional transfer of value/impact
 */
export interface EconomicFlow {
  id: string;
  from: string; // Source entity
  to: string; // Target entity
  type: 'monetary' | 'credit' | 'trade' | 'investment' | 'policy';
  magnitude: number; // Flow size (normalized 0-1)
  impact: 'positive' | 'negative' | 'neutral';
  multiplier: number; // Amplification factor
  description: string;
  timestamp: Date;
}

/**
 * Flow Network Node
 */
export interface FlowNode {
  id: string;
  name: string;
  type: 'central-bank' | 'bank' | 'company' | 'consumer' | 'market' | 'government';
  level: number; // Position in economic hierarchy (0-8)
  inflows: number; // Total incoming flow
  outflows: number; // Total outgoing flow
  netFlow: number; // Net position
  velocity: number; // Money velocity at this node
}

/**
 * Calculate economic flows based on macro state changes
 */
export function calculateEconomicFlows(
  currentMacro: MacroState,
  previousMacro: MacroState,
  levelState: LevelState
): EconomicFlow[] {
  const flows: EconomicFlow[] = [];

  // 1. Fed Rate Changes → Banking Sector
  const fedRateChange = currentMacro.fed_funds_rate - previousMacro.fed_funds_rate;
  if (Math.abs(fedRateChange) > 0.0001) {
    // Fed → Banks: Interest rate transmission
    flows.push({
      id: `fed-banks-${Date.now()}`,
      from: 'Federal Reserve',
      to: 'Banking Sector',
      type: 'policy',
      magnitude: Math.abs(fedRateChange) * 100, // Convert to basis points
      impact: fedRateChange > 0 ? 'positive' : 'negative',
      multiplier: 15.0, // NIM expansion multiplier
      description: `Fed ${fedRateChange > 0 ? 'raised' : 'cut'} rates by ${Math.abs(fedRateChange * 100).toFixed(1)} bps → Bank NIM ${fedRateChange > 0 ? 'expands' : 'contracts'}`,
      timestamp: new Date(),
    });

    // Banks → Companies: Lending cost change
    flows.push({
      id: `banks-companies-${Date.now()}`,
      from: 'Banking Sector',
      to: 'Corporate Sector',
      type: 'credit',
      magnitude: Math.abs(fedRateChange) * 80,
      impact: fedRateChange > 0 ? 'negative' : 'positive',
      multiplier: -10.0, // Higher rates = lower borrowing
      description: `${fedRateChange > 0 ? 'Higher' : 'Lower'} lending rates → ${fedRateChange > 0 ? 'Reduced' : 'Increased'} corporate borrowing`,
      timestamp: new Date(),
    });

    // Companies → Consumers: Pass-through effects
    flows.push({
      id: `companies-consumers-${Date.now()}`,
      from: 'Corporate Sector',
      to: 'Consumer Sector',
      type: 'trade',
      magnitude: Math.abs(fedRateChange) * 50,
      impact: fedRateChange > 0 ? 'negative' : 'positive',
      multiplier: -5.0,
      description: `${fedRateChange > 0 ? 'Higher' : 'Lower'} corporate costs → ${fedRateChange > 0 ? 'Higher' : 'Lower'} consumer prices`,
      timestamp: new Date(),
    });
  }

  // 2. M2 Money Supply Changes → Asset Markets
  const m2Change = (currentMacro.us_m2_money_supply - previousMacro.us_m2_money_supply) / previousMacro.us_m2_money_supply;
  if (Math.abs(m2Change) > 0.001) {
    // Fed → Money Supply: QE/QT
    flows.push({
      id: `fed-m2-${Date.now()}`,
      from: 'Federal Reserve',
      to: 'Money Supply (M2)',
      type: 'monetary',
      magnitude: Math.abs(m2Change) * 100,
      impact: m2Change > 0 ? 'positive' : 'negative',
      multiplier: 1.0,
      description: `Fed ${m2Change > 0 ? 'expanding' : 'contracting'} money supply (${m2Change > 0 ? 'QE' : 'QT'}) by ${Math.abs(m2Change * 100).toFixed(1)}%`,
      timestamp: new Date(),
    });

    // M2 → Equity Markets: Liquidity effect
    flows.push({
      id: `m2-equities-${Date.now()}`,
      from: 'Money Supply (M2)',
      to: 'Equity Markets',
      type: 'investment',
      magnitude: Math.abs(m2Change) * 150,
      impact: m2Change > 0 ? 'positive' : 'negative',
      multiplier: 30.0, // Strong liquidity correlation
      description: `${m2Change > 0 ? 'Increased' : 'Decreased'} liquidity → ${m2Change > 0 ? 'Higher' : 'Lower'} equity valuations`,
      timestamp: new Date(),
    });

    // M2 → Crypto Markets: High sensitivity
    flows.push({
      id: `m2-crypto-${Date.now()}`,
      from: 'Money Supply (M2)',
      to: 'Crypto Markets',
      type: 'investment',
      magnitude: Math.abs(m2Change) * 200,
      impact: m2Change > 0 ? 'positive' : 'negative',
      multiplier: 40.0, // Very high correlation
      description: `M2 liquidity ${m2Change > 0 ? 'surge' : 'drain'} → Crypto ${m2Change > 0 ? 'rally' : 'selloff'}`,
      timestamp: new Date(),
    });

    // M2 → Real Estate: Asset inflation
    flows.push({
      id: `m2-realestate-${Date.now()}`,
      from: 'Money Supply (M2)',
      to: 'Real Estate',
      type: 'investment',
      magnitude: Math.abs(m2Change) * 100,
      impact: m2Change > 0 ? 'positive' : 'negative',
      multiplier: 20.0,
      description: `Liquidity ${m2Change > 0 ? 'boost' : 'squeeze'} → Real estate prices ${m2Change > 0 ? 'rise' : 'fall'}`,
      timestamp: new Date(),
    });
  }

  // 3. GDP Growth → Corporate Earnings
  const gdpChange = (currentMacro.us_gdp_growth - previousMacro.us_gdp_growth) / 100;
  if (Math.abs(gdpChange) > 0.001) {
    // GDP → Corporates: Revenue growth
    flows.push({
      id: `gdp-corporates-${Date.now()}`,
      from: 'GDP Growth',
      to: 'Corporate Earnings',
      type: 'trade',
      magnitude: Math.abs(gdpChange) * 100,
      impact: gdpChange > 0 ? 'positive' : 'negative',
      multiplier: 25.0,
      description: `GDP ${gdpChange > 0 ? 'expansion' : 'contraction'} → Corporate revenue ${gdpChange > 0 ? 'growth' : 'decline'}`,
      timestamp: new Date(),
    });

    // Corporates → Employment: Hiring cycle
    flows.push({
      id: `corporates-employment-${Date.now()}`,
      from: 'Corporate Earnings',
      to: 'Employment',
      type: 'trade',
      magnitude: Math.abs(gdpChange) * 80,
      impact: gdpChange > 0 ? 'positive' : 'negative',
      multiplier: 15.0,
      description: `${gdpChange > 0 ? 'Strong' : 'Weak'} earnings → ${gdpChange > 0 ? 'Hiring' : 'Layoffs'}`,
      timestamp: new Date(),
    });
  }

  // 4. VIX (Fear) → Risk Assets
  const vixChange = (currentMacro.vix - previousMacro.vix) / 100;
  if (Math.abs(vixChange) > 0.01) {
    // VIX → Risk Assets: Flight to safety
    flows.push({
      id: `vix-risk-${Date.now()}`,
      from: 'Market Volatility (VIX)',
      to: 'Risk Assets',
      type: 'investment',
      magnitude: Math.abs(vixChange) * 100,
      impact: vixChange > 0 ? 'negative' : 'positive',
      multiplier: -20.0,
      description: `${vixChange > 0 ? 'Rising' : 'Falling'} fear → ${vixChange > 0 ? 'Risk-off' : 'Risk-on'} trade`,
      timestamp: new Date(),
    });

    // Risk-off → Safe Havens
    if (vixChange > 0) {
      flows.push({
        id: `risk-safehaven-${Date.now()}`,
        from: 'Risk Assets',
        to: 'Safe Havens (Bonds, Gold)',
        type: 'investment',
        magnitude: Math.abs(vixChange) * 120,
        impact: 'positive',
        multiplier: 15.0,
        description: 'Flight to safety → Bond/Gold demand surge',
        timestamp: new Date(),
      });
    }
  }

  // 5. Sector-Specific Flows from Level State
  if (levelState.level0_macro) {
    // Technology Sector
    const techEntities = levelState.level2_companies?.filter(c =>
      c.toLowerCase().includes('nvidia') ||
      c.toLowerCase().includes('apple') ||
      c.toLowerCase().includes('tsmc')
    ) || [];

    if (techEntities.length > 0 && m2Change > 0.01) {
      flows.push({
        id: `m2-tech-${Date.now()}`,
        from: 'Money Supply (M2)',
        to: 'Technology Sector',
        type: 'investment',
        magnitude: m2Change * 180,
        impact: 'positive',
        multiplier: 35.0,
        description: 'Liquidity surge → Growth stock rally (Tech)',
        timestamp: new Date(),
      });
    }

    // Semiconductor Supply Chain
    const semiEntities = levelState.level4_components?.filter(c =>
      c.toLowerCase().includes('hbm') ||
      c.toLowerCase().includes('chip') ||
      c.toLowerCase().includes('wafer')
    ) || [];

    if (semiEntities.length > 0 && gdpChange > 0.01) {
      flows.push({
        id: `gdp-semi-${Date.now()}`,
        from: 'GDP Growth',
        to: 'Semiconductor Industry',
        type: 'trade',
        magnitude: gdpChange * 200,
        impact: 'positive',
        multiplier: 40.0,
        description: 'Economic expansion → Chip demand surge',
        timestamp: new Date(),
      });
    }
  }

  return flows;
}

/**
 * Build flow network from economic flows
 */
export function buildFlowNetwork(flows: EconomicFlow[]): {
  nodes: FlowNode[];
  edges: { from: string; to: string; weight: number; color: string }[];
} {
  const nodeMap = new Map<string, FlowNode>();

  // Initialize nodes
  flows.forEach(flow => {
    if (!nodeMap.has(flow.from)) {
      nodeMap.set(flow.from, {
        id: flow.from,
        name: flow.from,
        type: inferNodeType(flow.from),
        level: inferLevel(flow.from),
        inflows: 0,
        outflows: 0,
        netFlow: 0,
        velocity: 1.0,
      });
    }

    if (!nodeMap.has(flow.to)) {
      nodeMap.set(flow.to, {
        id: flow.to,
        name: flow.to,
        type: inferNodeType(flow.to),
        level: inferLevel(flow.to),
        inflows: 0,
        outflows: 0,
        netFlow: 0,
        velocity: 1.0,
      });
    }

    // Update flows
    const fromNode = nodeMap.get(flow.from)!;
    const toNode = nodeMap.get(flow.to)!;

    fromNode.outflows += flow.magnitude;
    toNode.inflows += flow.magnitude;
  });

  // Calculate net flows
  nodeMap.forEach(node => {
    node.netFlow = node.inflows - node.outflows;
  });

  // Create edges
  const edges = flows.map(flow => ({
    from: flow.from,
    to: flow.to,
    weight: flow.magnitude,
    color: flow.impact === 'positive' ? '#10B981' : flow.impact === 'negative' ? '#EF4444' : '#6B7280',
  }));

  return {
    nodes: Array.from(nodeMap.values()),
    edges,
  };
}

/**
 * Infer node type from name
 */
function inferNodeType(name: string): FlowNode['type'] {
  const lower = name.toLowerCase();
  if (lower.includes('fed') || lower.includes('reserve')) return 'central-bank';
  if (lower.includes('bank')) return 'bank';
  if (lower.includes('corporate') || lower.includes('company') || lower.includes('sector')) return 'company';
  if (lower.includes('consumer') || lower.includes('employment')) return 'consumer';
  if (lower.includes('market') || lower.includes('equity') || lower.includes('crypto')) return 'market';
  if (lower.includes('government') || lower.includes('gdp')) return 'government';
  return 'market';
}

/**
 * Infer level in economic hierarchy
 */
function inferLevel(name: string): number {
  const lower = name.toLowerCase();
  if (lower.includes('fed') || lower.includes('reserve')) return 0; // Macro
  if (lower.includes('sector') || lower.includes('banking')) return 1; // Sector
  if (lower.includes('corporate') || lower.includes('company')) return 2; // Company
  if (lower.includes('consumer') || lower.includes('employment')) return 7; // Customer
  if (lower.includes('market')) return 8; // Market
  return 5; // Default
}

/**
 * Calculate money velocity
 *
 * V = GDP / M2
 * Measures how fast money circulates through the economy
 */
export function calculateMoneyVelocity(gdp: number, m2: number): number {
  return m2 > 0 ? gdp / m2 : 0;
}

/**
 * Calculate credit multiplier
 *
 * Multiplier = 1 / Reserve Ratio
 * How much banks can lend per dollar of reserves
 */
export function calculateCreditMultiplier(reserveRatio: number): number {
  return reserveRatio > 0 ? 1 / reserveRatio : 0;
}

/**
 * Simulate flow propagation over time
 */
export interface FlowPropagation {
  step: number;
  timestamp: Date;
  activeFlows: EconomicFlow[];
  nodeStates: Map<string, { value: number; change: number }>;
}

export function simulateFlowPropagation(
  initialFlows: EconomicFlow[],
  steps: number = 10,
  dampingFactor: number = 0.8
): FlowPropagation[] {
  const propagations: FlowPropagation[] = [];
  let currentFlows = [...initialFlows];

  for (let step = 0; step < steps; step++) {
    const nodeStates = new Map<string, { value: number; change: number }>();

    // Apply flows
    currentFlows.forEach(flow => {
      const impact = flow.magnitude * flow.multiplier * Math.pow(dampingFactor, step);

      if (!nodeStates.has(flow.to)) {
        nodeStates.set(flow.to, { value: 1.0, change: 0 });
      }

      const state = nodeStates.get(flow.to)!;
      const changeAmount = (impact / 100) * (flow.impact === 'positive' ? 1 : -1);
      state.value *= 1 + changeAmount;
      state.change += changeAmount;
    });

    propagations.push({
      step,
      timestamp: new Date(Date.now() + step * 24 * 60 * 60 * 1000), // Daily steps
      activeFlows: currentFlows.map(f => ({
        ...f,
        magnitude: f.magnitude * dampingFactor,
      })),
      nodeStates,
    });

    // Dampen flows for next step
    currentFlows = currentFlows
      .map(f => ({ ...f, magnitude: f.magnitude * dampingFactor }))
      .filter(f => f.magnitude > 0.01); // Remove negligible flows
  }

  return propagations;
}

/**
 * Get flow summary statistics
 */
export function getFlowSummary(flows: EconomicFlow[]): {
  totalFlows: number;
  positiveFlows: number;
  negativeFlows: number;
  averageMagnitude: number;
  strongestFlow: EconomicFlow | null;
  mostAffectedEntity: string;
} {
  if (flows.length === 0) {
    return {
      totalFlows: 0,
      positiveFlows: 0,
      negativeFlows: 0,
      averageMagnitude: 0,
      strongestFlow: null,
      mostAffectedEntity: '',
    };
  }

  const positiveFlows = flows.filter(f => f.impact === 'positive').length;
  const negativeFlows = flows.filter(f => f.impact === 'negative').length;
  const averageMagnitude = flows.reduce((sum, f) => sum + f.magnitude, 0) / flows.length;
  const strongestFlow = flows.reduce((max, f) => f.magnitude > (max?.magnitude || 0) ? f : max, flows[0]);

  // Count entity mentions
  const entityCounts = new Map<string, number>();
  flows.forEach(f => {
    entityCounts.set(f.from, (entityCounts.get(f.from) || 0) + 1);
    entityCounts.set(f.to, (entityCounts.get(f.to) || 0) + 1);
  });

  let mostAffectedEntity = '';
  let maxCount = 0;
  entityCounts.forEach((count, entity) => {
    if (count > maxCount) {
      maxCount = count;
      mostAffectedEntity = entity;
    }
  });

  return {
    totalFlows: flows.length,
    positiveFlows,
    negativeFlows,
    averageMagnitude,
    strongestFlow,
    mostAffectedEntity,
  };
}

/**
 * Format flow for display
 */
export function formatFlow(flow: EconomicFlow): string {
  const arrow = flow.impact === 'positive' ? '↑' : flow.impact === 'negative' ? '↓' : '→';
  return `${flow.from} ${arrow} ${flow.to}: ${flow.description} (${flow.magnitude.toFixed(1)} × ${flow.multiplier.toFixed(1)})`;
}
