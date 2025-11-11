/**
 * Expanded Knowledge Graph with Full 9-Level Ontology
 * Includes comprehensive relationships across semiconductor, tech, and finance sectors
 */

import { Entity, Relationship, EntityType, RelationshipType } from './knowledgeGraph';

// ==========================================
// ADDITIONAL COMPANIES (Level 3)
// ==========================================

export const AMD: Entity = {
  id: 'company-amd',
  type: 'COMPANY',
  name: 'Advanced Micro Devices (AMD)',
  metadata: {
    ticker: 'AMD',
    sector: 'SEMICONDUCTOR',
    revenue: 22680,
    marketCap: 200000,
  },
};

export const TSMC: Entity = {
  id: 'company-tsmc',
  type: 'COMPANY',
  name: 'Taiwan Semiconductor Manufacturing',
  metadata: {
    ticker: 'TSM',
    sector: 'SEMICONDUCTOR',
    revenue: 69300,
    marketCap: 550000,
  },
};

export const MICROSOFT: Entity = {
  id: 'company-microsoft',
  type: 'COMPANY',
  name: 'Microsoft Corporation',
  metadata: {
    ticker: 'MSFT',
    sector: 'TECHNOLOGY',
    revenue: 211915,
    marketCap: 3000000,
  },
};

export const APPLE: Entity = {
  id: 'company-apple',
  type: 'COMPANY',
  name: 'Apple Inc.',
  metadata: {
    ticker: 'AAPL',
    sector: 'TECHNOLOGY',
    revenue: 383285,
    marketCap: 3300000,
  },
};

export const ASML: Entity = {
  id: 'company-asml',
  type: 'COMPANY',
  name: 'ASML Holding',
  metadata: {
    ticker: 'ASML',
    sector: 'SEMICONDUCTOR_EQUIPMENT',
    revenue: 27600,
    marketCap: 350000,
  },
};

// ==========================================
// ADDITIONAL PRODUCTS (Level 4)
// ==========================================

export const AMD_PRODUCTS: Entity[] = [
  {
    id: 'product-mi300x',
    type: 'PRODUCT',
    name: 'AMD MI300X AI Accelerator',
    metadata: {
      price: 15000,
      memory: '192GB HBM3',
      releaseDate: '2023-Q4',
    },
  },
  {
    id: 'product-ryzen-9',
    type: 'PRODUCT',
    name: 'AMD Ryzen 9 7950X',
    metadata: {
      price: 699,
      cores: 16,
      releaseDate: '2022-Q4',
    },
  },
];

export const APPLE_PRODUCTS: Entity[] = [
  {
    id: 'product-iphone-15-pro',
    type: 'PRODUCT',
    name: 'iPhone 15 Pro',
    metadata: {
      price: 999,
      chip: 'A17 Pro',
      releaseDate: '2023-09',
    },
  },
  {
    id: 'product-m3-chip',
    type: 'PRODUCT',
    name: 'Apple M3 Chip',
    metadata: {
      process: '3nm',
      transistors: 25000000000,
      releaseDate: '2023-10',
    },
  },
];

export const MICROSOFT_PRODUCTS: Entity[] = [
  {
    id: 'product-azure-ai',
    type: 'PRODUCT',
    name: 'Microsoft Azure AI',
    metadata: {
      segment: 'Cloud Computing',
      revenue: 50000,
    },
  },
  {
    id: 'product-copilot',
    type: 'PRODUCT',
    name: 'Microsoft Copilot',
    metadata: {
      aiModel: 'GPT-4',
      launch: '2023-03',
    },
  },
];

// ==========================================
// ADDITIONAL COMPONENTS (Level 5)
// ==========================================

export const ADVANCED_COMPONENTS: Entity[] = [
  {
    id: 'component-euv-lithography',
    type: 'COMPONENT',
    name: 'EUV Lithography System',
    metadata: {
      wavelength: '13.5nm',
      cost: 150000000,
      supplier: 'ASML',
    },
  },
  {
    id: 'component-wafer-5nm',
    type: 'COMPONENT',
    name: '5nm Wafer',
    metadata: {
      process: 'N5',
      supplier: 'TSMC',
      costPerWafer: 16000,
    },
  },
  {
    id: 'component-wafer-3nm',
    type: 'COMPONENT',
    name: '3nm Wafer',
    metadata: {
      process: 'N3',
      supplier: 'TSMC',
      costPerWafer: 20000,
    },
  },
  {
    id: 'component-cowos-packaging',
    type: 'COMPONENT',
    name: 'CoWoS Advanced Packaging',
    metadata: {
      supplier: 'TSMC',
      capacity: '15000 units/month',
      bottleneck: true,
    },
  },
];

// ==========================================
// ADDITIONAL TECHNOLOGIES (Level 6)
// ==========================================

export const TECHNOLOGIES: Entity[] = [
  {
    id: 'tech-euv',
    type: 'TECHNOLOGY',
    name: 'Extreme Ultraviolet Lithography',
    metadata: {
      owner: 'ASML',
      monopoly: true,
      patents: 2000,
    },
  },
  {
    id: 'tech-3nm-process',
    type: 'TECHNOLOGY',
    name: '3nm Process Technology',
    metadata: {
      leader: 'TSMC',
      transistorDensity: 300000000,
    },
  },
  {
    id: 'tech-tsmc-n4p',
    type: 'TECHNOLOGY',
    name: 'TSMC N4P Process',
    metadata: {
      node: '4nm',
      density: 171000000,
    },
  },
];

// ==========================================
// ADDITIONAL CUSTOMERS (Level 7)
// ==========================================

export const HYPERSCALERS: Entity[] = [
  {
    id: 'customer-meta',
    type: 'CUSTOMER',
    name: 'Meta Platforms',
    metadata: {
      ticker: 'META',
      aiSpend: 5000000000,
      gpuCount: 350000,
    },
  },
  {
    id: 'customer-amazon',
    type: 'CUSTOMER',
    name: 'Amazon AWS',
    metadata: {
      ticker: 'AMZN',
      aiSpend: 6000000000,
      gpuCount: 400000,
    },
  },
  {
    id: 'customer-openai',
    type: 'CUSTOMER',
    name: 'OpenAI',
    metadata: {
      aiSpend: 2000000000,
      gpuCount: 100000,
      mainModel: 'GPT-4',
    },
  },
];

// ==========================================
// COMPREHENSIVE RELATIONSHIPS
// ==========================================

export const EXPANDED_RELATIONSHIPS: Relationship[] = [
  // Supply Chain: ASML → TSMC → NVIDIA
  {
    id: 'rel-asml-supplies-tsmc',
    type: 'SUPPLIES',
    source: 'company-asml',
    target: 'company-tsmc',
    weight: 1.0,
    metadata: {
      product: 'EUV Lithography Systems',
      critical: true,
      annualValue: 10000000000,
    },
  },
  {
    id: 'rel-tsmc-manufactures-nvidia',
    type: 'MANUFACTURES',
    source: 'company-tsmc',
    target: 'product-h100',
    weight: 1.0,
    metadata: {
      process: '4nm N4P',
      capacity: 40000,
      unit: 'wafers/month',
    },
  },

  // Supply Chain: SK Hynix → NVIDIA (HBM3E)
  {
    id: 'rel-skhynix-supplies-nvidia-hbm',
    type: 'SUPPLIES',
    source: 'company-sk-hynix',
    target: 'product-h100',
    weight: 0.95,
    metadata: {
      component: 'HBM3E',
      exclusivity: 'high',
      annualValue: 8000000000,
    },
  },

  // Supply Chain: TSMC → AMD
  {
    id: 'rel-tsmc-manufactures-amd',
    type: 'MANUFACTURES',
    source: 'company-tsmc',
    target: 'product-mi300x',
    weight: 0.85,
    metadata: {
      process: '5nm N5',
    },
  },

  // Supply Chain: TSMC → Apple
  {
    id: 'rel-tsmc-manufactures-apple-m3',
    type: 'MANUFACTURES',
    source: 'company-tsmc',
    target: 'product-m3-chip',
    weight: 1.0,
    metadata: {
      process: '3nm N3',
      exclusivity: 'high',
      annualVolume: 15000000,
    },
  },
  {
    id: 'rel-tsmc-manufactures-apple-a17',
    type: 'MANUFACTURES',
    source: 'company-tsmc',
    target: 'product-iphone-15-pro',
    weight: 1.0,
    metadata: {
      process: '3nm N3E',
    },
  },

  // Customer Relationships: Hyperscalers → NVIDIA
  {
    id: 'rel-microsoft-buys-nvidia-h100',
    type: 'BUYS',
    source: 'customer-microsoft',
    target: 'product-h100',
    weight: 0.9,
    metadata: {
      annualSpend: 8000000000,
      gpuCount: 500000,
    },
  },
  {
    id: 'rel-meta-buys-nvidia-h100',
    type: 'BUYS',
    source: 'customer-meta',
    target: 'product-h100',
    weight: 0.75,
    metadata: {
      annualSpend: 5000000000,
      gpuCount: 350000,
    },
  },
  {
    id: 'rel-amazon-buys-nvidia',
    type: 'BUYS',
    source: 'customer-amazon',
    target: 'product-h100',
    weight: 0.8,
    metadata: {
      annualSpend: 6000000000,
    },
  },
  {
    id: 'rel-openai-buys-nvidia',
    type: 'BUYS',
    source: 'customer-openai',
    target: 'product-h100',
    weight: 0.7,
    metadata: {
      annualSpend: 2000000000,
      partnership: 'Microsoft-backed',
    },
  },

  // Customer → AMD
  {
    id: 'rel-meta-buys-amd-mi300x',
    type: 'BUYS',
    source: 'customer-meta',
    target: 'product-mi300x',
    weight: 0.6,
    metadata: {
      annualSpend: 2000000000,
      diversification: true,
    },
  },

  // Technology Relationships
  {
    id: 'rel-asml-develops-euv',
    type: 'DEVELOPS',
    source: 'company-asml',
    target: 'tech-euv',
    weight: 1.0,
    metadata: {
      monopoly: true,
      patents: 2000,
    },
  },
  {
    id: 'rel-tsmc-develops-3nm',
    type: 'DEVELOPS',
    source: 'company-tsmc',
    target: 'tech-3nm-process',
    weight: 1.0,
    metadata: {
      leadTime: '2-3 years ahead',
    },
  },

  // Component → Product relationships
  {
    id: 'rel-h100-uses-hbm3e',
    type: 'USES',
    source: 'product-h100',
    target: 'component-hbm3e',
    weight: 1.0,
    metadata: {
      quantity: 8,
      unit: 'stacks',
    },
  },
  {
    id: 'rel-h100-uses-cowos',
    type: 'USES',
    source: 'product-h100',
    target: 'component-cowos-packaging',
    weight: 1.0,
    metadata: {
      bottleneck: true,
    },
  },
  {
    id: 'rel-mi300x-uses-5nm-wafer',
    type: 'USES',
    source: 'product-mi300x',
    target: 'component-wafer-5nm',
    weight: 0.9,
  },
  {
    id: 'rel-m3-uses-3nm-wafer',
    type: 'USES',
    source: 'product-m3-chip',
    target: 'component-wafer-3nm',
    weight: 1.0,
  },

  // Equipment → Component relationships
  {
    id: 'rel-euv-makes-3nm',
    type: 'REQUIRES',
    source: 'component-wafer-3nm',
    target: 'component-euv-lithography',
    weight: 1.0,
    metadata: {
      essential: true,
    },
  },

  // Competition relationships
  {
    id: 'rel-nvidia-competes-amd',
    type: 'COMPETES_WITH',
    source: 'company-nvidia',
    target: 'company-amd',
    weight: 0.85,
    metadata: {
      market: 'AI Accelerators',
      nvidiaShare: 0.85,
      amdShare: 0.15,
    },
  },

  // Microsoft → Azure AI → Copilot chain
  {
    id: 'rel-microsoft-produces-azure',
    type: 'PRODUCES',
    source: 'company-microsoft',
    target: 'product-azure-ai',
    weight: 1.0,
  },
  {
    id: 'rel-azure-powers-copilot',
    type: 'USES',
    source: 'product-copilot',
    target: 'product-azure-ai',
    weight: 1.0,
  },
  {
    id: 'rel-azure-uses-h100',
    type: 'USES',
    source: 'product-azure-ai',
    target: 'product-h100',
    weight: 0.9,
    metadata: {
      gpuCount: 500000,
    },
  },

  // Apple → iPhone → M3 chain
  {
    id: 'rel-apple-produces-iphone',
    type: 'PRODUCES',
    source: 'company-apple',
    target: 'product-iphone-15-pro',
    weight: 1.0,
  },
  {
    id: 'rel-iphone-uses-a17',
    type: 'USES',
    source: 'product-iphone-15-pro',
    target: 'product-m3-chip',
    weight: 1.0,
  },
];

// ==========================================
// ALL EXPANDED ENTITIES
// ==========================================

export const ALL_EXPANDED_ENTITIES: Entity[] = [
  AMD,
  TSMC,
  MICROSOFT,
  APPLE,
  ASML,
  ...AMD_PRODUCTS,
  ...APPLE_PRODUCTS,
  ...MICROSOFT_PRODUCTS,
  ...ADVANCED_COMPONENTS,
  ...TECHNOLOGIES,
  ...HYPERSCALERS,
];
