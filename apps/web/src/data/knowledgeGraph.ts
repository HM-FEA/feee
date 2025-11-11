/**
 * Economic Knowledge Graph / Ontology System
 * Multi-layer relationship mapping of entire economic ecosystem
 */

import { Company, Sector } from './companies';

// ==========================================
// ENTITY TYPES (Nodes)
// ==========================================

export type EntityType =
  | 'MACRO'           // Macro variables (금리, GDP, etc.)
  | 'SECTOR'          // Industry sectors
  | 'COMPANY'         // Companies
  | 'PRODUCT'         // Products/Services
  | 'COMPONENT'       // Components/Materials
  | 'TECHNOLOGY'      // Technologies/Patents
  | 'SHAREHOLDER'     // Institutional/Individual investors
  | 'CUSTOMER'        // Customer companies
  | 'EQUIPMENT'       // Manufacturing equipment
  | 'FACILITY';       // Factories/Data centers

// ==========================================
// RELATIONSHIP TYPES (Edges)
// ==========================================

export type RelationshipType =
  // Production & Supply
  | 'PRODUCES'        // Company → Product
  | 'SUPPLIES'        // Supplier → Component → Customer
  | 'USES'            // Product → Component
  | 'MANUFACTURES'    // Company → Product at Facility
  | 'REQUIRES'        // Component → Equipment/Material

  // Ownership & Investment
  | 'OWNS'            // Shareholder → Company (% stake)
  | 'INVESTS_IN'      // Company → Company (strategic investment)
  | 'SUBSIDIARY_OF'   // Company → Parent company

  // Commercial
  | 'BUYS'            // Customer → Product
  | 'SELLS_TO'        // Company → Customer
  | 'LICENSES'        // Technology → Company

  // Competition & Collaboration
  | 'COMPETES_WITH'   // Company ↔ Company
  | 'PARTNERS_WITH'   // Company ↔ Company
  | 'JOINT_VENTURE'   // Company ↔ Company

  // Technology & IP
  | 'DEVELOPS'        // Company → Technology
  | 'PATENTS'         // Company → Patent
  | 'LICENSES_FROM'   // Company ← Technology owner

  // Macro Impact
  | 'IMPACTS'         // Macro → Sector/Company
  | 'EXPOSED_TO';     // Company → Macro variable

// ==========================================
// ENTITY DEFINITIONS
// ==========================================

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Relationship {
  id: string;
  type: RelationshipType;
  source: string;      // Entity ID
  target: string;      // Entity ID
  weight: number;      // Strength of relationship (0-1)
  metadata?: Record<string, any>;  // Additional data (%, $, etc.)
}

// ==========================================
// NVIDIA ECOSYSTEM EXAMPLE
// ==========================================

// Level 3: Company
export const NVIDIA: Entity = {
  id: 'company-nvidia',
  type: 'COMPANY',
  name: 'Nvidia Corporation',
  description: 'AI chip maker, GPU leader',
  metadata: {
    ticker: 'NVDA',
    sector: 'SEMICONDUCTOR',
    revenue: 60922,  // $60.9B (FY2024)
    marketCap: 3000000,  // $3T
    employees: 29600,
    founded: 1993,
    hq: 'Santa Clara, CA',
  },
};

// Level 4: Products
export const NVIDIA_PRODUCTS: Entity[] = [
  {
    id: 'product-h100',
    type: 'PRODUCT',
    name: 'H100 GPU',
    description: 'Flagship AI training chip',
    metadata: {
      launched: '2022-03',
      price: 30000,  // $30k per unit
      process: '4nm',
      transistors: 80_000_000_000,  // 80B
      tdp: 700,  // watts
      memory: 80,  // GB HBM3
    },
  },
  {
    id: 'product-a100',
    type: 'PRODUCT',
    name: 'A100 GPU',
    description: 'Previous gen AI chip',
    metadata: {
      launched: '2020-05',
      price: 10000,
      process: '7nm',
      memory: 40,  // GB HBM2e
    },
  },
  {
    id: 'product-rtx4090',
    type: 'PRODUCT',
    name: 'RTX 4090',
    description: 'Consumer gaming GPU',
    metadata: {
      launched: '2022-10',
      price: 1599,
      process: '4nm',
      memory: 24,  // GB GDDR6X
    },
  },
  {
    id: 'product-gb200',
    type: 'PRODUCT',
    name: 'GB200 NVL72',
    description: 'Next-gen AI superchip rack',
    metadata: {
      launched: '2024-03',
      price: 3000000,  // $3M per rack
      gpus: 36,
      cpus: 18,
      memory: 1440,  // GB total HBM3e
    },
  },
];

// Level 5: Components
export const NVIDIA_COMPONENTS: Entity[] = [
  {
    id: 'component-hbm3e',
    type: 'COMPONENT',
    name: 'HBM3E Memory',
    description: 'High Bandwidth Memory 3E',
    metadata: {
      bandwidth: 819,  // GB/s
      capacity: 24,    // GB per stack
      supplier: 'SK Hynix',
      price: 1500,     // $ per unit
    },
  },
  {
    id: 'component-cowos',
    type: 'COMPONENT',
    name: 'CoWoS Packaging',
    description: 'Chip on Wafer on Substrate',
    metadata: {
      supplier: 'TSMC',
      process: 'Advanced packaging',
      costPerUnit: 5000,
    },
  },
  {
    id: 'component-gpu-die',
    type: 'COMPONENT',
    name: 'GH100 GPU Die',
    description: 'Main GPU silicon',
    metadata: {
      supplier: 'TSMC',
      process: '4nm (N4)',
      dieSize: 814,  // mm²
      costPerWafer: 17000,
    },
  },
  {
    id: 'component-nvlink',
    type: 'COMPONENT',
    name: 'NVLink Interconnect',
    description: 'GPU-to-GPU interconnect',
    metadata: {
      bandwidth: 900,  // GB/s per link
      generation: 4,
    },
  },
];

// Level 6: Equipment & Materials
export const SEMICONDUCTOR_EQUIPMENT: Entity[] = [
  {
    id: 'equipment-asml-euv',
    type: 'EQUIPMENT',
    name: 'ASML EUV Lithography',
    description: 'Extreme UV lithography machine',
    metadata: {
      model: 'Twinscan NXE:3600D',
      price: 200000000,  // $200M
      throughput: 160,   // wafers/hour
      resolution: 13,    // nm
    },
  },
  {
    id: 'equipment-amat-etch',
    type: 'EQUIPMENT',
    name: 'Applied Materials Etch',
    description: 'Plasma etching equipment',
    metadata: {
      supplier: 'Applied Materials',
      price: 5000000,
    },
  },
  {
    id: 'material-silicon-wafer',
    type: 'COMPONENT',
    name: '300mm Silicon Wafer',
    description: 'Base substrate',
    metadata: {
      diameter: 300,  // mm
      supplier: 'Shin-Etsu, Sumco',
      price: 150,
    },
  },
];

// Level 7: Shareholders
export const NVIDIA_SHAREHOLDERS: Entity[] = [
  {
    id: 'shareholder-vanguard',
    type: 'SHAREHOLDER',
    name: 'The Vanguard Group',
    metadata: {
      stake: 8.3,  // %
      shares: 207_000_000,
      value: 150_000_000_000,  // $150B
      type: 'Institutional',
    },
  },
  {
    id: 'shareholder-blackrock',
    type: 'SHAREHOLDER',
    name: 'BlackRock Inc.',
    metadata: {
      stake: 7.9,
      shares: 197_000_000,
      value: 142_000_000_000,
    },
  },
  {
    id: 'shareholder-jensen-huang',
    type: 'SHAREHOLDER',
    name: 'Jensen Huang',
    metadata: {
      stake: 3.5,
      shares: 87_000_000,
      value: 63_000_000_000,
      role: 'CEO & Founder',
    },
  },
];

// Level 8: Customers
export const NVIDIA_CUSTOMERS: Entity[] = [
  {
    id: 'customer-microsoft',
    type: 'CUSTOMER',
    name: 'Microsoft Azure',
    description: 'Cloud AI infrastructure',
    metadata: {
      annualPurchase: 8_000_000_000,  // $8B/year
      gpuCount: 250_000,
      products: ['H100', 'A100'],
    },
  },
  {
    id: 'customer-meta',
    type: 'CUSTOMER',
    name: 'Meta Platforms',
    description: 'AI research & infrastructure',
    metadata: {
      annualPurchase: 5_000_000_000,
      gpuCount: 150_000,
      products: ['H100', 'GB200'],
    },
  },
  {
    id: 'customer-google',
    type: 'CUSTOMER',
    name: 'Google Cloud',
    description: 'Cloud AI platform',
    metadata: {
      annualPurchase: 4_000_000_000,
      gpuCount: 120_000,
      products: ['H100', 'A100'],
    },
  },
  {
    id: 'customer-amazon',
    type: 'CUSTOMER',
    name: 'Amazon AWS',
    description: 'Cloud computing leader',
    metadata: {
      annualPurchase: 6_000_000_000,
      gpuCount: 180_000,
      products: ['H100', 'A100'],
    },
  },
];

// Level 9: Technologies
export const NVIDIA_TECHNOLOGIES: Entity[] = [
  {
    id: 'tech-cuda',
    type: 'TECHNOLOGY',
    name: 'CUDA',
    description: 'Parallel computing platform',
    metadata: {
      launched: 2006,
      developers: 3_000_000,
      patents: 500,
    },
  },
  {
    id: 'tech-tensor-cores',
    type: 'TECHNOLOGY',
    name: 'Tensor Cores',
    description: 'AI matrix math units',
    metadata: {
      generation: 4,
      performance: 1979,  // TFLOPS FP8
    },
  },
];

// ==========================================
// SK HYNIX ECOSYSTEM
// ==========================================

export const SK_HYNIX: Entity = {
  id: 'company-skhynix',
  type: 'COMPANY',
  name: 'SK Hynix',
  description: 'Memory chip manufacturer',
  metadata: {
    ticker: '000660.KS',
    sector: 'SEMICONDUCTOR',
    revenue: 36_700,  // $36.7B
    marketCap: 90_000,
    hbmMarketShare: 50,  // % of HBM market
  },
};

export const SKHYNIX_PRODUCTS: Entity[] = [
  {
    id: 'product-hbm3e-12hi',
    type: 'PRODUCT',
    name: 'HBM3E 12-High',
    description: '12-layer HBM3E stack',
    metadata: {
      capacity: 24,  // GB
      bandwidth: 819,  // GB/s
      launched: '2023-10',
      customers: ['Nvidia', 'AMD'],
    },
  },
];

// ==========================================
// RELATIONSHIPS
// ==========================================

export const NVIDIA_RELATIONSHIPS: Relationship[] = [
  // Nvidia → Products
  {
    id: 'rel-nvidia-produces-h100',
    type: 'PRODUCES',
    source: 'company-nvidia',
    target: 'product-h100',
    weight: 1.0,
    metadata: { unitsPerYear: 2_000_000 },
  },
  {
    id: 'rel-nvidia-produces-a100',
    type: 'PRODUCES',
    source: 'company-nvidia',
    target: 'product-a100',
    weight: 0.7,
    metadata: { unitsPerYear: 1_000_000 },
  },
  {
    id: 'rel-nvidia-produces-gb200',
    type: 'PRODUCES',
    source: 'company-nvidia',
    target: 'product-gb200',
    weight: 0.9,
    metadata: { unitsPerYear: 50_000 },
  },

  // H100 → Components
  {
    id: 'rel-h100-uses-hbm3e',
    type: 'USES',
    source: 'product-h100',
    target: 'component-hbm3e',
    weight: 1.0,
    metadata: { quantityPerUnit: 6, costPercentage: 30 },
  },
  {
    id: 'rel-h100-uses-cowos',
    type: 'USES',
    source: 'product-h100',
    target: 'component-cowos',
    weight: 1.0,
    metadata: { costPercentage: 20 },
  },
  {
    id: 'rel-h100-uses-gpu-die',
    type: 'USES',
    source: 'product-h100',
    target: 'component-gpu-die',
    weight: 1.0,
    metadata: { costPercentage: 40 },
  },

  // SK Hynix → HBM3E → Nvidia
  {
    id: 'rel-skhynix-produces-hbm3e',
    type: 'PRODUCES',
    source: 'company-skhynix',
    target: 'component-hbm3e',
    weight: 1.0,
    metadata: { marketShare: 50 },
  },
  {
    id: 'rel-skhynix-supplies-nvidia',
    type: 'SUPPLIES',
    source: 'company-skhynix',
    target: 'company-nvidia',
    weight: 0.95,
    metadata: { annualRevenue: 8_000_000_000, product: 'HBM3E' },
  },

  // TSMC → GPU Die → Nvidia
  {
    id: 'rel-tsmc-produces-die',
    type: 'PRODUCES',
    source: 'company-tsmc',
    target: 'component-gpu-die',
    weight: 1.0,
  },
  {
    id: 'rel-tsmc-supplies-nvidia',
    type: 'SUPPLIES',
    source: 'company-tsmc',
    target: 'company-nvidia',
    weight: 1.0,
    metadata: { annualRevenue: 15_000_000_000 },
  },

  // ASML → TSMC (Equipment dependency)
  {
    id: 'rel-asml-supplies-tsmc',
    type: 'SUPPLIES',
    source: 'equipment-asml-euv',
    target: 'company-tsmc',
    weight: 1.0,
    metadata: { critical: true },
  },

  // Shareholders → Nvidia
  {
    id: 'rel-vanguard-owns-nvidia',
    type: 'OWNS',
    source: 'shareholder-vanguard',
    target: 'company-nvidia',
    weight: 0.83,
    metadata: { stake: 8.3, voting: true },
  },
  {
    id: 'rel-blackrock-owns-nvidia',
    type: 'OWNS',
    source: 'shareholder-blackrock',
    target: 'company-nvidia',
    weight: 0.79,
    metadata: { stake: 7.9 },
  },
  {
    id: 'rel-jensen-owns-nvidia',
    type: 'OWNS',
    source: 'shareholder-jensen-huang',
    target: 'company-nvidia',
    weight: 0.35,
    metadata: { stake: 3.5, role: 'CEO' },
  },

  // Customers → Nvidia
  {
    id: 'rel-microsoft-buys-nvidia',
    type: 'BUYS',
    source: 'customer-microsoft',
    target: 'product-h100',
    weight: 0.9,
    metadata: { annualSpend: 8_000_000_000 },
  },
  {
    id: 'rel-meta-buys-nvidia',
    type: 'BUYS',
    source: 'customer-meta',
    target: 'product-h100',
    weight: 0.85,
    metadata: { annualSpend: 5_000_000_000 },
  },
  {
    id: 'rel-google-buys-nvidia',
    type: 'BUYS',
    source: 'customer-google',
    target: 'product-h100',
    weight: 0.75,
    metadata: { annualSpend: 4_000_000_000 },
  },

  // Technologies → Nvidia
  {
    id: 'rel-nvidia-develops-cuda',
    type: 'DEVELOPS',
    source: 'company-nvidia',
    target: 'tech-cuda',
    weight: 1.0,
    metadata: { moatStrength: 'very high' },
  },
];

// ==========================================
// HELPERS
// ==========================================

/**
 * Get all entities of a specific type
 */
export function getEntitiesByType(type: EntityType): Entity[] {
  // This would query a database in production
  const allEntities = [
    NVIDIA,
    ...NVIDIA_PRODUCTS,
    ...NVIDIA_COMPONENTS,
    ...SEMICONDUCTOR_EQUIPMENT,
    ...NVIDIA_SHAREHOLDERS,
    ...NVIDIA_CUSTOMERS,
    ...NVIDIA_TECHNOLOGIES,
    SK_HYNIX,
    ...SKHYNIX_PRODUCTS,
  ];

  return allEntities.filter(e => e.type === type);
}

/**
 * Get all relationships for an entity
 */
export function getRelationshipsForEntity(entityId: string): Relationship[] {
  return NVIDIA_RELATIONSHIPS.filter(
    r => r.source === entityId || r.target === entityId
  );
}

/**
 * Get relationship chain (e.g., ASML → TSMC → Nvidia → Microsoft)
 */
export function getSupplyChain(productId: string): Entity[] {
  // Traverse relationships backwards from product to raw materials
  // This is a simplified example
  const chain: Entity[] = [];
  // TODO: Implement graph traversal
  return chain;
}

/**
 * Calculate total dependencies for a company
 */
export function calculateDependencies(companyId: string): {
  suppliers: number;
  customers: number;
  criticalDependencies: string[];
} {
  const relationships = getRelationshipsForEntity(companyId);

  const suppliers = relationships.filter(r =>
    r.target === companyId && (r.type === 'SUPPLIES' || r.type === 'SELLS_TO')
  ).length;

  const customers = relationships.filter(r =>
    r.source === companyId && (r.type === 'SELLS_TO' || r.type === 'SUPPLIES')
  ).length;

  const criticalDependencies = relationships
    .filter(r => r.metadata?.critical === true)
    .map(r => r.source);

  return { suppliers, customers, criticalDependencies };
}
