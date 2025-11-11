/**
 * Level-Specific Control Systems
 *
 * Organizes control variables by ontology level (1-9) with proper formulas.
 * Each level has its own impact calculation system separate from macro variables.
 */

export interface LevelControl {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  description: string;
  impactFormula?: string; // Formula description for transparency
}

export interface OntologyLevel {
  level: number;
  name: string;
  description: string;
  controls: LevelControl[];
}

/**
 * Level 1: Macro Variables
 * Handled separately in Simulation macro controls
 * - Fed Funds Rate, Treasury Yield, GDP Growth, M2 Supply, Oil, VIX
 */

/**
 * Level 2: Sector-Level Controls
 * Sector-specific indices and metrics
 */
export const SECTOR_LEVEL_CONTROLS: OntologyLevel = {
  level: 2,
  name: 'Sector Indicators',
  description: 'Sector-specific indices affecting industry dynamics',
  controls: [
    {
      id: 'semiconductor_capex_index',
      label: 'Semiconductor CapEx Index',
      value: 100,
      min: 50,
      max: 200,
      step: 5,
      unit: '',
      description: 'Industry capital expenditure intensity',
      impactFormula: 'Impact on fab capacity, equipment orders (ASML, Applied Materials)'
    },
    {
      id: 'banking_credit_spread',
      label: 'Banking Credit Spread',
      value: 150,
      min: 50,
      max: 500,
      step: 10,
      unit: 'bps',
      description: 'Corporate credit spread over risk-free rate',
      impactFormula: 'Affects lending rates, bank profitability'
    },
    {
      id: 'real_estate_vacancy_rate',
      label: 'Real Estate Vacancy',
      value: 8.5,
      min: 0,
      max: 25,
      step: 0.5,
      unit: '%',
      description: 'Commercial real estate vacancy rate',
      impactFormula: 'Inversely affects REIT valuations'
    }
  ]
};

/**
 * Level 3: Company-Level Controls
 * Company-specific operational metrics
 */
export const COMPANY_LEVEL_CONTROLS: OntologyLevel = {
  level: 3,
  name: 'Company Metrics',
  description: 'Company-specific operational indicators',
  controls: [
    {
      id: 'nvidia_market_share',
      label: 'NVIDIA AI GPU Share',
      value: 85,
      min: 50,
      max: 95,
      step: 1,
      unit: '%',
      description: 'Market share in AI accelerator market',
      impactFormula: 'Affects revenue, pricing power vs AMD/Intel'
    },
    {
      id: 'tsmc_utilization_rate',
      label: 'TSMC Fab Utilization',
      value: 95,
      min: 60,
      max: 100,
      step: 1,
      unit: '%',
      description: 'Foundry capacity utilization',
      impactFormula: 'Affects wafer pricing, supply constraints'
    },
    {
      id: 'sk_hynix_hbm_share',
      label: 'SK Hynix HBM Share',
      value: 50,
      min: 20,
      max: 80,
      step: 5,
      unit: '%',
      description: 'Market share in HBM3/HBM3E memory',
      impactFormula: 'Affects GPU supply constraints, pricing power'
    }
  ]
};

/**
 * Level 4: Product-Level Controls
 * Product demand and pricing dynamics
 */
export const PRODUCT_LEVEL_CONTROLS: OntologyLevel = {
  level: 4,
  name: 'Product Demand',
  description: 'Product-level demand indices and pricing',
  controls: [
    {
      id: 'gpu_demand_index',
      label: 'AI GPU Demand Index',
      value: 85,
      min: 0,
      max: 150,
      step: 5,
      unit: '',
      description: 'Overall demand for AI accelerators (H100, MI300X)',
      impactFormula: 'Base demand multiplier: Revenue = Base × Demand × Price'
    },
    {
      id: 'smartphone_demand',
      label: 'Smartphone Unit Demand',
      value: 100,
      min: 60,
      max: 140,
      step: 5,
      unit: 'M units',
      description: 'Global smartphone quarterly shipments',
      impactFormula: 'Affects Apple, Samsung revenue and chip orders'
    },
    {
      id: 'cloud_service_growth',
      label: 'Cloud Services Growth',
      value: 25,
      min: 5,
      max: 50,
      step: 1,
      unit: '%',
      description: 'YoY cloud infrastructure revenue growth',
      impactFormula: 'Drives Azure AI, AWS demand for GPUs'
    }
  ]
};

/**
 * Level 5: Component-Level Controls
 * Component availability and pricing
 */
export const COMPONENT_LEVEL_CONTROLS: OntologyLevel = {
  level: 5,
  name: 'Component Supply',
  description: 'Critical component supply and pricing',
  controls: [
    {
      id: 'hbm3e_supply_index',
      label: 'HBM3E Supply',
      value: 100,
      min: 50,
      max: 150,
      step: 5,
      unit: '',
      description: 'High-bandwidth memory supply availability',
      impactFormula: 'Supply < 80: GPU bottleneck; Supply > 120: Price decline'
    },
    {
      id: 'dram_price_index',
      label: 'DRAM Price Index',
      value: 100,
      min: 50,
      max: 200,
      step: 5,
      unit: '',
      description: 'DRAM spot price index (baseline = 100)',
      impactFormula: 'Affects memory module costs, SK Hynix/Micron margins'
    },
    {
      id: 'cowos_capacity',
      label: 'CoWoS Packaging Capacity',
      value: 15000,
      min: 10000,
      max: 30000,
      step: 500,
      unit: 'units/mo',
      description: 'TSMC advanced packaging monthly capacity',
      impactFormula: 'Bottleneck for H100/MI300X production if < demand'
    },
    {
      id: 'euv_machine_shipments',
      label: 'EUV System Deliveries',
      value: 60,
      min: 40,
      max: 100,
      step: 5,
      unit: 'units/yr',
      description: 'ASML EUV lithography system shipments',
      impactFormula: 'Gates 3nm/5nm fab capacity expansion'
    }
  ]
};

/**
 * Level 6: Technology-Level Controls
 * Innovation and R&D metrics
 */
export const TECHNOLOGY_LEVEL_CONTROLS: OntologyLevel = {
  level: 6,
  name: 'Technology Innovation',
  description: 'R&D investment and technological advancement',
  controls: [
    {
      id: 'ai_investment',
      label: 'Global AI Investment',
      value: 150,
      min: 50,
      max: 500,
      step: 10,
      unit: 'B',
      description: 'Annual AI infrastructure investment',
      impactFormula: 'Drives GPU demand, data center buildout'
    },
    {
      id: 'process_node_advancement',
      label: 'Process Node Progress',
      value: 100,
      min: 80,
      max: 120,
      step: 5,
      unit: '',
      description: 'Semiconductor process technology advancement rate',
      impactFormula: 'Affects transistor density, power efficiency gains'
    },
    {
      id: 'cuda_ecosystem_strength',
      label: 'CUDA Ecosystem Lock-in',
      value: 90,
      min: 60,
      max: 100,
      step: 5,
      unit: '',
      description: 'Developer adoption of NVIDIA CUDA platform',
      impactFormula: 'Maintains NVIDIA pricing power vs AMD ROCm'
    }
  ]
};

/**
 * Level 7: Shareholder-Level Controls
 * Ownership and governance dynamics
 */
export const SHAREHOLDER_LEVEL_CONTROLS: OntologyLevel = {
  level: 7,
  name: 'Ownership Dynamics',
  description: 'Major shareholder activity and governance',
  controls: [
    {
      id: 'institutional_ownership',
      label: 'Institutional Ownership',
      value: 65,
      min: 40,
      max: 85,
      step: 1,
      unit: '%',
      description: 'Percentage held by institutional investors',
      impactFormula: 'Higher = lower volatility, more governance scrutiny'
    },
    {
      id: 'insider_buying_index',
      label: 'Insider Buying Activity',
      value: 100,
      min: 50,
      max: 200,
      step: 10,
      unit: '',
      description: 'Insider purchase activity index',
      impactFormula: 'Positive signal for future performance expectations'
    }
  ]
};

/**
 * Level 8: Customer-Level Controls
 * Customer behavior and purchase patterns
 */
export const CUSTOMER_LEVEL_CONTROLS: OntologyLevel = {
  level: 8,
  name: 'Customer Behavior',
  description: 'Customer purchasing patterns and preferences',
  controls: [
    {
      id: 'hyperscaler_capex',
      label: 'Hyperscaler CapEx',
      value: 180,
      min: 100,
      max: 300,
      step: 10,
      unit: 'B',
      description: 'Combined CapEx: Microsoft, Meta, Amazon, Google',
      impactFormula: 'Directly drives GPU orders, data center equipment'
    },
    {
      id: 'enterprise_ai_adoption',
      label: 'Enterprise AI Adoption',
      value: 45,
      min: 20,
      max: 80,
      step: 5,
      unit: '%',
      description: 'Enterprise adoption rate of AI solutions',
      impactFormula: 'Affects Azure AI, Copilot, enterprise GPU demand'
    },
    {
      id: 'consumer_spending_index',
      label: 'Consumer Tech Spending',
      value: 100,
      min: 60,
      max: 140,
      step: 5,
      unit: '',
      description: 'Consumer electronics purchase index',
      impactFormula: 'Affects iPhone, PC, consumer GPU sales'
    }
  ]
};

/**
 * Level 9: Facility-Level Controls
 * Production facilities and infrastructure
 */
export const FACILITY_LEVEL_CONTROLS: OntologyLevel = {
  level: 9,
  name: 'Facility Operations',
  description: 'Manufacturing facilities and data centers',
  controls: [
    {
      id: 'fab_utilization',
      label: 'Global Fab Utilization',
      value: 85,
      min: 60,
      max: 100,
      step: 1,
      unit: '%',
      description: 'Semiconductor fab capacity utilization',
      impactFormula: 'Affects wafer prices, lead times'
    },
    {
      id: 'datacenter_buildout',
      label: 'Data Center Construction',
      value: 50,
      min: 20,
      max: 100,
      step: 5,
      unit: 'facilities/yr',
      description: 'New hyperscale data center construction rate',
      impactFormula: 'Future GPU demand, power infrastructure'
    }
  ]
};

/**
 * Cross-Level Controls
 * Variables affecting multiple ontology levels
 */
export const CROSS_LEVEL_CONTROLS: OntologyLevel = {
  level: 0, // Special level for cross-cutting concerns
  name: 'Trade & Logistics',
  description: 'Cross-level trade and logistics factors',
  controls: [
    {
      id: 'container_rate_us_china',
      label: 'Container Rate (US-China)',
      value: 3500,
      min: 1000,
      max: 10000,
      step: 100,
      unit: '$',
      description: '40ft container shipping cost Shanghai-LA',
      impactFormula: 'Affects component costs, delivery times across all levels'
    },
    {
      id: 'semiconductor_tariff',
      label: 'Semiconductor Tariffs',
      value: 0,
      min: 0,
      max: 50,
      step: 5,
      unit: '%',
      description: 'Import tariffs on semiconductor products',
      impactFormula: 'Increases costs at Product/Component levels'
    },
    {
      id: 'energy_cost_index',
      label: 'Energy Cost (Manufacturing)',
      value: 100,
      min: 60,
      max: 200,
      step: 5,
      unit: '',
      description: 'Industrial electricity cost index',
      impactFormula: 'Affects fab operational costs, data center economics'
    }
  ]
};

/**
 * All ontology levels consolidated
 */
export const ALL_ONTOLOGY_LEVELS: OntologyLevel[] = [
  CROSS_LEVEL_CONTROLS,       // Level 0: Cross-cutting
  // Level 1: Macro (handled separately)
  SECTOR_LEVEL_CONTROLS,      // Level 2
  COMPANY_LEVEL_CONTROLS,     // Level 3
  PRODUCT_LEVEL_CONTROLS,     // Level 4
  COMPONENT_LEVEL_CONTROLS,   // Level 5
  TECHNOLOGY_LEVEL_CONTROLS,  // Level 6
  SHAREHOLDER_LEVEL_CONTROLS, // Level 7
  CUSTOMER_LEVEL_CONTROLS,    // Level 8
  FACILITY_LEVEL_CONTROLS     // Level 9
];

/**
 * Helper: Get controls by level
 */
export function getControlsByLevel(level: number): LevelControl[] {
  const ontologyLevel = ALL_ONTOLOGY_LEVELS.find(l => l.level === level);
  return ontologyLevel?.controls || [];
}

/**
 * Helper: Get all controls as flat array
 */
export function getAllLevelControls(): LevelControl[] {
  return ALL_ONTOLOGY_LEVELS.flatMap(level => level.controls);
}

/**
 * Impact Calculation Formulas by Level
 *
 * These formulas define how each level's variables affect entity values
 */

export interface LevelImpactFormula {
  level: number;
  name: string;
  formula: (controlValues: Record<string, number>, entityData: any) => number;
  description: string;
}

/**
 * Example: Component-level impact on products
 */
export const componentToProductImpact: LevelImpactFormula = {
  level: 5,
  name: 'Component Supply Impact on Product Availability',
  description: 'HBM3E supply affects H100 production capacity',
  formula: (controls, product) => {
    const hbmSupply = controls['hbm3e_supply_index'] || 100;
    const cowosCapacity = controls['cowos_capacity'] || 15000;

    // Bottleneck logic
    if (hbmSupply < 80) {
      return -0.25; // 25% production constraint
    } else if (hbmSupply > 120) {
      return +0.15; // 15% cost reduction
    }

    // CoWoS packaging constraint
    if (product.requiredPackaging > cowosCapacity * 0.8) {
      return -0.20; // 20% delay impact
    }

    return 0; // No impact
  }
};

/**
 * Example: Technology-level impact on company valuation
 */
export const technologyToCompanyImpact: LevelImpactFormula = {
  level: 6,
  name: 'AI Investment Impact on Tech Companies',
  description: 'Global AI investment drives revenue for NVIDIA, AMD, cloud providers',
  formula: (controls, company) => {
    const aiInvestment = controls['ai_investment'] || 150; // Billion $
    const baselineInvestment = 150;

    if (company.sector === 'SEMICONDUCTOR' && company.hasAIProducts) {
      const growthMultiplier = aiInvestment / baselineInvestment;
      return (growthMultiplier - 1) * 0.8; // 80% correlation
    } else if (company.sector === 'TECHNOLOGY' && company.hasCloudAI) {
      const growthMultiplier = aiInvestment / baselineInvestment;
      return (growthMultiplier - 1) * 0.6; // 60% correlation
    }

    return 0;
  }
};

/**
 * Example: Customer-level impact on product demand
 */
export const customerToProductImpact: LevelImpactFormula = {
  level: 8,
  name: 'Hyperscaler CapEx Impact on GPU Demand',
  description: 'Microsoft, Meta, Amazon CapEx drives H100 orders',
  formula: (controls, product) => {
    const hyperscalerCapex = controls['hyperscaler_capex'] || 180; // Billion $
    const baselineCapex = 180;

    if (product.type === 'AI_GPU') {
      const capexGrowth = (hyperscalerCapex - baselineCapex) / baselineCapex;
      return capexGrowth * 1.2; // 120% sensitivity (elastic demand)
    }

    return 0;
  }
};

export const ALL_IMPACT_FORMULAS: LevelImpactFormula[] = [
  componentToProductImpact,
  technologyToCompanyImpact,
  customerToProductImpact
];
