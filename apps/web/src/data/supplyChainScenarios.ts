/**
 * Supply Chain Scenarios - Multiple themes with voting
 * Polymarket-style community-driven supply chain analysis
 */

import { SupplyChainNode, SupplyChainLink } from '@/components/visualization/SupplyChainDiagram';
import { Factory, Cpu, Zap, Package, DollarSign, Battery, Smartphone, Car } from 'lucide-react';

export interface SupplyChainScenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'semiconductor' | 'automotive' | 'energy' | 'consumer-electronics' | 'pharmaceutical';
  votes: {
    up: number;
    down: number;
    total: number;
  };
  createdBy: string;
  lastUpdated: string;
  tags: string[];
  nodes: any[];
  links: any[];
  criticality: 'low' | 'medium' | 'high' | 'critical';
  keyInsights: string[];
}

export const SUPPLY_CHAIN_SCENARIOS: SupplyChainScenario[] = [
  // 1. NVIDIA H100 Supply Chain (existing)
  {
    id: 'nvidia-h100-hbm',
    name: 'NVIDIA H100 GPU Supply Chain',
    icon: '🔥',
    description: 'Critical AI accelerator supply chain analysis - HBM memory bottleneck, CoWoS packaging constraints, geopolitical Taiwan risk',
    category: 'semiconductor',
    votes: {
      up: 298,
      down: 44,
      total: 342
    },
    createdBy: 'Alex Chen',
    lastUpdated: '2h ago',
    tags: ['AI', 'GPU', 'HBM', 'TSMC', 'Taiwan-Risk'],
    criticality: 'critical',
    keyInsights: [
      'HBM3E production at 400K stacks/month = 2.4M GPUs/year (demand: 4M)',
      'CoWoS packaging bottleneck: 25K wafers/month limit',
      'Taiwan geopolitical risk: 90% of advanced chips',
      'Gray market premium: $45K vs $30K official price',
    ],
    nodes: [
      {
        id: 'asml',
        name: 'ASML',
        type: 'equipment',
        icon: '🔬',
        details: {
          role: 'EUV lithography equipment supplier',
          marketShare: '100% (monopoly)',
          leadTime: '18-24 months',
          cost: '$150M per machine',
          risk: 'high',
        },
        position: { x: 50, y: 50 },
      },
      {
        id: 'tsmc',
        name: 'TSMC',
        type: 'manufacturer',
        icon: '🏭',
        details: {
          role: '4nm GPU die fabrication',
          marketShare: '92% advanced nodes',
          leadTime: '90-120 days',
          cost: '$11B annual (NVIDIA)',
          risk: 'critical',
        },
        position: { x: 250, y: 50 },
      },
      {
        id: 'sk-hynix',
        name: 'SK Hynix',
        type: 'component',
        icon: '💾',
        details: {
          role: 'HBM3E memory production',
          marketShare: '50% HBM market',
          leadTime: '60-90 days',
          cost: '$1,200 per stack',
          risk: 'critical',
        },
        position: { x: 250, y: 200 },
      },
      {
        id: 'cowos',
        name: 'CoWoS Packaging',
        type: 'component',
        icon: '📦',
        details: {
          role: 'Advanced packaging (TSMC)',
          marketShare: '100% (exclusive)',
          leadTime: '30-45 days',
          cost: '$2,500 per unit',
          risk: 'critical',
        },
        position: { x: 450, y: 125 },
      },
      {
        id: 'h100',
        name: 'H100 GPU',
        type: 'product',
        icon: '🎮',
        details: {
          role: 'Final AI accelerator',
          marketShare: '95% AI training market',
          leadTime: '52 weeks',
          cost: '$30K-$40K',
          risk: 'high',
        },
        position: { x: 650, y: 125 },
      },
      {
        id: 'hyperscalers',
        name: 'Hyperscalers',
        type: 'customer',
        icon: '☁️',
        details: {
          role: 'Microsoft, Meta, Google, Amazon',
          marketShare: '70% of demand',
          leadTime: 'Immediate deployment',
          cost: '$10B+ capex each',
          risk: 'medium',
        },
        position: { x: 850, y: 125 },
      },
    ],
    links: [
      { from: 'asml', to: 'tsmc', label: '$150M/machine', strength: 1.0, bottleneck: false },
      { from: 'tsmc', to: 'cowos', label: '25K wafers/month', strength: 0.9, bottleneck: true },
      { from: 'sk-hynix', to: 'cowos', label: '400K stacks/month', strength: 0.85, bottleneck: true },
      { from: 'cowos', to: 'h100', label: '2M units/year', strength: 0.8, bottleneck: true },
      { from: 'h100', to: 'hyperscalers', label: '$30K-$40K/unit', strength: 0.8, bottleneck: false },
    ],
  },

  // 2. Tesla 4680 Battery Supply Chain
  {
    id: 'tesla-4680-battery',
    name: 'Tesla 4680 Battery Cell Supply Chain',
    icon: '🔋',
    description: 'Revolutionary battery cell production - Nickel dependency, dry electrode technology, Gigafactory Texas ramp-up',
    category: 'automotive',
    votes: {
      up: 251,
      down: 36,
      total: 287
    },
    createdBy: 'Sarah Kumar',
    lastUpdated: '1d ago',
    tags: ['EV', 'Battery', 'Tesla', 'Lithium', 'Nickel'],
    criticality: 'high',
    keyInsights: [
      'Nickel supply: 80% from Indonesia/Russia (geopolitical risk)',
      'Dry electrode tech: 50% cost reduction, but yield issues',
      'Target: 100 GWh/year by 2025 (currently 10 GWh)',
      'Cost goal: $50/kWh (currently $95/kWh)',
    ],
    nodes: [
      { id: 'lithium-mines', name: 'Lithium Mines', type: 'raw-material', details: { role: 'Australia/Chile lithium extraction', marketShare: '60% global', leadTime: '6-12 months', cost: '$75K/ton', risk: 'medium' }, position: { x: 50, y: 100 } },
      { id: 'nickel-mines', name: 'Nickel Refineries', type: 'raw-material', details: { role: 'Indonesia/Russia nickel sulfate', marketShare: '80% EV-grade', leadTime: '3-6 months', cost: '$25K/ton', risk: 'critical' }, position: { x: 50, y: 200 } },
      { id: 'cathode-material', name: 'Cathode Material', type: 'component', details: { role: 'NMC 811 (Nickel-Manganese-Cobalt)', marketShare: 'N/A', leadTime: '2-4 months', cost: '$18/kg', risk: 'high' }, position: { x: 250, y: 150 } },
      { id: '4680-cell', name: '4680 Battery Cell', type: 'product', details: { role: 'Tesla Gigafactory Texas', marketShare: '5% (ramping)', leadTime: '90 days', cost: '$95/kWh', risk: 'high' }, position: { x: 450, y: 150 } },
      { id: 'model-y', name: 'Model Y', type: 'product', details: { role: 'Final EV product', marketShare: '15% EV market', leadTime: '30 days', cost: '$50K vehicle', risk: 'low' }, position: { x: 650, y: 150 } },
      { id: 'consumers', name: 'EV Buyers', type: 'customer', details: { role: 'Global EV market', marketShare: '18% share', leadTime: 'Immediate', cost: '$50K avg', risk: 'low' }, position: { x: 850, y: 150 } },
    ],
    links: [
      { from: 'lithium-mines', to: 'cathode-material', label: '$75K/ton', strength: 0.9, bottleneck: false },
      { from: 'nickel-mines', to: 'cathode-material', label: '$25K/ton', strength: 0.85, bottleneck: true },
      { from: 'cathode-material', to: '4680-cell', label: '$18/kg', strength: 0.8, bottleneck: false },
      { from: '4680-cell', to: 'model-y', label: '950 cells/vehicle', strength: 0.75, bottleneck: true },
      { from: 'model-y', to: 'consumers', label: '$50K/unit', strength: 0.9, bottleneck: false },
    ],
  },

  // 3. iPhone 15 Pro Supply Chain
  {
    id: 'apple-iphone15-supply',
    name: 'Apple iPhone 15 Pro Supply Chain',
    icon: '📱',
    description: 'A17 Pro chip manufacturing, camera module assembly, Foxconn production, global distribution network',
    category: 'consumer-electronics',
    votes: {
      up: 172,
      down: 26,
      total: 198
    },
    createdBy: 'David Park',
    lastUpdated: '3d ago',
    tags: ['Apple', 'iPhone', 'TSMC', 'Foxconn', 'Camera'],
    criticality: 'medium',
    keyInsights: [
      'A17 Pro: TSMC 3nm process, 30% faster, 20% more efficient',
      'Camera module: Sony IMX903 sensor, $120 per module',
      'Foxconn assembly: 500K units/day (Zhengzhou)',
      'Logistics: 95% air freight for launch (speed premium)',
    ],
    nodes: [
      { id: 'tsmc-3nm', name: 'TSMC (3nm)', type: 'manufacturer', details: { role: 'A17 Pro chip fabrication', marketShare: '100% 3nm', leadTime: '120 days', cost: '$250/chip', risk: 'medium' }, position: { x: 50, y: 100 } },
      { id: 'sony-camera', name: 'Sony Camera', type: 'component', details: { role: 'IMX903 48MP sensor', marketShare: '80% premium phones', leadTime: '60 days', cost: '$120/module', risk: 'low' }, position: { x: 50, y: 200 } },
      { id: 'foxconn', name: 'Foxconn', type: 'manufacturer', details: { role: 'Final assembly (Zhengzhou)', marketShare: '60% iPhones', leadTime: '14 days', cost: '$40/unit labor', risk: 'medium' }, position: { x: 350, y: 150 } },
      { id: 'iphone15', name: 'iPhone 15 Pro', type: 'product', details: { role: 'Flagship smartphone', marketShare: '18% global', leadTime: '7 days', cost: '$1,199 retail', risk: 'low' }, position: { x: 600, y: 150 } },
      { id: 'retail', name: 'Apple Stores', type: 'distribution', details: { role: 'Global retail + online', marketShare: '100% direct', leadTime: 'Immediate', cost: '$1,199', risk: 'low' }, position: { x: 850, y: 150 } },
    ],
    links: [
      { from: 'tsmc-3nm', to: 'foxconn', label: '$250/chip', strength: 0.9, bottleneck: false },
      { from: 'sony-camera', to: 'foxconn', label: '$120/module', strength: 0.85, bottleneck: false },
      { from: 'foxconn', to: 'iphone15', label: '500K/day', strength: 0.9, bottleneck: false },
      { from: 'iphone15', to: 'retail', label: '$1,199 retail', strength: 1.0, bottleneck: false },
    ],
  },

  // 4. Pfizer COVID Vaccine Supply Chain
  {
    id: 'pfizer-vaccine-mrna',
    name: 'Pfizer mRNA Vaccine Supply Chain',
    icon: '💉',
    description: 'Ultra-cold storage requirements, lipid nanoparticle production, global distribution, mRNA synthesis',
    category: 'pharmaceutical',
    votes: {
      up: 142,
      down: 14,
      total: 156
    },
    createdBy: 'Dr. Emily Zhang',
    lastUpdated: '5d ago',
    tags: ['Vaccine', 'mRNA', 'Cold-Chain', 'Logistics', 'Lipid'],
    criticality: 'high',
    keyInsights: [
      'Cold storage: -70°C requirement (dry ice logistics)',
      'Lipid nanoparticles: 4 specialized lipids, limited suppliers',
      'mRNA synthesis: 10-14 days production time',
      'Global distribution: 3 billion doses in 2021',
    ],
    nodes: [
      { id: 'mrna-synthesis', name: 'mRNA Synthesis', type: 'raw-material', details: { role: 'Genetic code production', marketShare: 'N/A', leadTime: '10-14 days', cost: '$5/dose', risk: 'medium' }, position: { x: 50, y: 100 } },
      { id: 'lipid-nano', name: 'Lipid Nanoparticles', type: 'component', details: { role: '4 specialized lipids', marketShare: '3 suppliers globally', leadTime: '30 days', cost: '$8/dose', risk: 'high' }, position: { x: 50, y: 200 } },
      { id: 'vaccine-fill', name: 'Fill & Finish', type: 'manufacturer', details: { role: 'Vial filling, packaging', marketShare: 'Pfizer facilities', leadTime: '7 days', cost: '$2/dose', risk: 'low' }, position: { x: 350, y: 150 } },
      { id: 'vaccine-final', name: 'mRNA Vaccine', type: 'product', details: { role: 'Final COVID-19 vaccine', marketShare: '35% global', leadTime: '14 days total', cost: '$20/dose', risk: 'medium' }, position: { x: 600, y: 150 } },
      { id: 'distribution', name: 'Cold Chain Logistics', type: 'distribution', details: { role: 'Ultra-cold distribution', marketShare: 'UPS/FedEx', leadTime: '48 hours', cost: '$5/dose shipping', risk: 'high' }, position: { x: 850, y: 150 } },
    ],
    links: [
      { from: 'mrna-synthesis', to: 'vaccine-fill', label: '$5/dose', strength: 0.9, bottleneck: false },
      { from: 'lipid-nano', to: 'vaccine-fill', label: '$8/dose', strength: 0.8, bottleneck: true },
      { from: 'vaccine-fill', to: 'vaccine-final', label: '$2/dose', strength: 0.95, bottleneck: false },
      { from: 'vaccine-final', to: 'distribution', label: '-70°C required', strength: 0.75, bottleneck: true },
    ],
  },

  // 5. Solar Panel Supply Chain (Polysilicon)
  {
    id: 'solar-panel-polysilicon',
    name: 'Solar Panel Supply Chain (China-Dominated)',
    icon: '☀️',
    description: 'Polysilicon production, wafer manufacturing, cell assembly, global module distribution - 80% China control',
    category: 'energy',
    votes: {
      up: 115,
      down: 19,
      total: 134
    },
    createdBy: 'Michael Brown',
    lastUpdated: '1w ago',
    tags: ['Solar', 'Renewable', 'China', 'Polysilicon', 'Energy'],
    criticality: 'medium',
    keyInsights: [
      'China control: 80% of global polysilicon, 95% of wafers',
      'Xinjiang polysilicon: 45% global supply (forced labor concerns)',
      'Polysilicon price: $9/kg (down from $35/kg in 2022)',
      'Module efficiency: 22% (up from 18% in 2019)',
    ],
    nodes: [
      { id: 'polysilicon', name: 'Polysilicon', type: 'raw-material', details: { role: 'High-purity silicon', marketShare: '80% China', leadTime: '60 days', cost: '$9/kg', risk: 'high' }, position: { x: 50, y: 150 } },
      { id: 'wafer', name: 'Silicon Wafer', type: 'component', details: { role: 'Monocrystalline wafer', marketShare: '95% China', leadTime: '30 days', cost: '$0.18/watt', risk: 'critical' }, position: { x: 250, y: 150 } },
      { id: 'solar-cell', name: 'Solar Cell', type: 'component', details: { role: 'PERC/TOPCon cells', marketShare: '90% China', leadTime: '14 days', cost: '$0.12/watt', risk: 'high' }, position: { x: 450, y: 150 } },
      { id: 'module', name: 'Solar Module', type: 'product', details: { role: 'Complete panel', marketShare: '85% China', leadTime: '7 days', cost: '$0.22/watt', risk: 'medium' }, position: { x: 650, y: 150 } },
      { id: 'installers', name: 'Global Installers', type: 'customer', details: { role: 'Residential/commercial', marketShare: 'Distributed', leadTime: 'Immediate', cost: '$3/watt installed', risk: 'low' }, position: { x: 850, y: 150 } },
    ],
    links: [
      { from: 'polysilicon', to: 'wafer', label: '$9/kg', strength: 0.9, bottleneck: false },
      { from: 'wafer', to: 'solar-cell', label: '$0.18/W', strength: 0.95, bottleneck: false },
      { from: 'solar-cell', to: 'module', label: '$0.12/W', strength: 0.95, bottleneck: false },
      { from: 'module', to: 'installers', label: '$0.22/W', strength: 0.9, bottleneck: false },
    ],
  },
];

/**
 * Vote on a supply chain scenario
 */
export function voteOnScenario(scenarioId: string, voteType: 'up' | 'down'): SupplyChainScenario[] {
  const scenarioIndex = SUPPLY_CHAIN_SCENARIOS.findIndex(s => s.id === scenarioId);
  if (scenarioIndex === -1) return SUPPLY_CHAIN_SCENARIOS;

  const scenario = SUPPLY_CHAIN_SCENARIOS[scenarioIndex];

  if (voteType === 'up') {
    scenario.votes.up++;
  } else {
    scenario.votes.down++;
  }
  scenario.votes.total = scenario.votes.up + scenario.votes.down;

  return [...SUPPLY_CHAIN_SCENARIOS];
}

/**
 * Get top voted scenarios
 */
export function getTopScenarios(limit: number = 5): SupplyChainScenario[] {
  return [...SUPPLY_CHAIN_SCENARIOS]
    .sort((a, b) => b.votes.total - a.votes.total)
    .slice(0, limit);
}

/**
 * Filter scenarios by category
 */
export function getScenariosByCategory(category: string): SupplyChainScenario[] {
  return SUPPLY_CHAIN_SCENARIOS.filter(s => s.category === category);
}
