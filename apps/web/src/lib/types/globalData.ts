/**
 * Global Data Structure - Universal Entity System
 *
 * Purpose: Unified interface for ALL assets, companies, and financial entities
 * H100 is just an example - this system supports ANY asset/company
 *
 * Design Principles:
 * 1. Element화 (Elementization) - Everything is a composable element
 * 2. Automatic Connection - Relations auto-propagate through ontology levels
 * 3. Real-time Updates - Data can be refreshed from external sources
 * 4. Version Control - Track changes to formulas and coefficients
 */

export type EntityType = 'COMPANY' | 'ASSET' | 'PRODUCT' | 'COMPONENT' | 'SECTOR' | 'MACRO' | 'TECHNOLOGY' | 'FACILITY';

export type OntologyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type RelationshipType =
  | 'SUPPLIES'
  | 'COMPETES'
  | 'FINANCES'
  | 'IMPACTS'
  | 'CONTAINS'
  | 'OWNS'
  | 'CUSTOMER_OF'
  | 'USES';

export type DataSourceType = 'MANUAL' | 'API' | 'SCRAPED' | 'CALCULATED';
export type UpdateFrequency = 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'MANUAL';

// ============================================
// 1. UNIVERSAL ENTITY INTERFACE
// ============================================

/**
 * UniversalEntity - Base interface for ALL entities in the system
 * Replaces hardcoded H100 data with flexible, extensible structure
 */
export interface UniversalEntity {
  // Core Identity
  id: string;
  type: EntityType;
  name: string;
  category: string;  // SEMICONDUCTOR | BANKING | REALESTATE | CRYPTO | ...

  // Ontology Position
  ontologyLevel: OntologyLevel;

  // Financial Data (optional, based on entity type)
  financials?: FinancialData;

  // Sector-specific metrics (optional)
  sectorMetrics?: SectorMetrics;

  // Simulation parameters
  simulationParams: SimulationParams;

  // Relationships
  relationships: Relationship[];

  // Data source tracking
  dataSource: DataSource;

  // Metadata
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// ============================================
// 2. FINANCIAL DATA
// ============================================

export interface FinancialData {
  // Income Statement
  revenue?: number;
  cogs?: number;
  grossProfit?: number;
  operatingExpenses?: number;
  ebitda?: number;
  netIncome?: number;

  // Balance Sheet
  totalAssets?: number;
  currentAssets?: number;
  totalLiabilities?: number;
  currentLiabilities?: number;
  totalDebt?: number;
  equity?: number;

  // Cash Flow
  operatingCashFlow?: number;
  freeCashFlow?: number;
  capex?: number;

  // Market Data
  marketCap?: number;
  enterpriseValue?: number;
  sharesOutstanding?: number;
  stockPrice?: number;

  // Ratios
  pe?: number;
  pb?: number;
  ps?: number;
  evToEbitda?: number;
  debtToEquity?: number;
  currentRatio?: number;
  quickRatio?: number;
  roe?: number;
  roa?: number;
  roic?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;

  // Valuation Metrics
  dcfValue?: number;
  wacc?: number;
  beta?: number;
  costOfEquity?: number;
}

// ============================================
// 3. SECTOR METRICS (Dynamic)
// ============================================

export interface SectorMetrics {
  sector: string;
  metrics: Record<string, number>;
}

// Specific sector metric interfaces
export interface SemiconductorMetrics extends SectorMetrics {
  sector: 'SEMICONDUCTOR';
  metrics: {
    waferUtilization: number;
    processNode: number;  // nm
    yieldRate: number;
    fabCapacity: number;
    ashSupply: number;
    capexIndex: number;
  };
}

export interface BankingMetrics extends SectorMetrics {
  sector: 'BANKING';
  metrics: {
    nim: number;  // Net Interest Margin
    provisionRate: number;
    loanToDeposit: number;
    tier1Capital: number;
    npl: number;  // Non-performing loans
    creditSpread: number;
  };
}

export interface RealEstateMetrics extends SectorMetrics {
  sector: 'REALESTATE';
  metrics: {
    occupancyRate: number;
    rentalYield: number;
    vacancyRate: number;
    pricePerSqft: number;
    capRate: number;
  };
}

// ============================================
// 4. SIMULATION PARAMETERS
// ============================================

/**
 * SimulationParams - Replaces hardcoded coefficients
 * All parameters can be calibrated against historical data
 */
export interface SimulationParams {
  // Macro Sensitivity Coefficients
  gdpElasticity?: number;
  inflationSensitivity?: number;
  rateSensitivity?: number;
  commoditySensitivity?: number;
  fxSensitivity?: number;

  // Financial Assumptions
  cogsMargin?: number;
  opexRatio?: number;
  depreciationRate?: number;
  taxRate?: number;
  capexRatio?: number;
  workingCapitalRatio?: number;

  // Valuation Parameters
  baseMultiple?: ValuationMultiple;
  beta?: number;
  costOfEquity?: number;
  costOfDebt?: number;
  wacc?: number;
  terminalGrowthRate?: number;

  // Supply Chain Parameters
  leadTime?: number;  // days
  inventoryTurnover?: number;
  supplierConcentration?: number;
  productionCapacity?: number;

  // Custom Parameters (sector-specific)
  customParams?: Record<string, number>;

  // Calibration Metadata
  calibrationDate?: Date;
  rSquared?: number;  // Goodness of fit
  dataSource?: string;
  lastUpdated?: Date;
}

export interface ValuationMultiple {
  type: 'PE' | 'PS' | 'PB' | 'EV_EBITDA' | 'EV_REVENUE';
  value: number;
  industryAverage?: number;
  percentile?: number;  // 0-100
}

// ============================================
// 5. RELATIONSHIPS
// ============================================

export interface Relationship {
  id: string;
  type: RelationshipType;
  targetEntityId: string;
  weight: number;  // 0-1, strength of relationship

  // Impact Calculation
  impactFormula?: string;  // JavaScript expression
  elasticity?: number;
  timelag?: number;  // days

  // Metadata
  confidence?: number;  // 0-1
  dataSource?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// 6. DATA SOURCE TRACKING
// ============================================

export interface DataSource {
  type: DataSourceType;
  source: string;  // Bloomberg, Reuters, Federal Reserve, Manual, etc.
  updateFrequency: UpdateFrequency;
  lastFetch?: Date;
  nextUpdate?: Date;
  apiEndpoint?: string;
  credentials?: string;  // Reference to encrypted credentials
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  errorMessage?: string;
}

// ============================================
// 7. CHANGE EVENTS & IMPACT PROPAGATION
// ============================================

export interface ChangeEvent {
  entityId: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
  source: string;

  // Propagation
  propagate: boolean;
  impactedEntities?: string[];
}

export interface ImpactResult {
  targetEntityId: string;
  field: string;
  oldValue: any;
  newValue: any;
  changePercent: number;
  propagationPath: string[];  // Entity IDs in propagation chain
  formula: string;
  confidence: number;
}

// ============================================
// 8. ENTITY REGISTRY
// ============================================

/**
 * ElementRegistry - Central registry for all entities
 * Replaces hardcoded lists and enables dynamic entity management
 */
export interface ElementRegistry {
  entities: Map<string, UniversalEntity>;

  // Indexed lookups
  entitiesByType: Map<EntityType, Set<string>>;
  entitiesBySector: Map<string, Set<string>>;
  entitiesByLevel: Map<OntologyLevel, Set<string>>;

  // Methods
  register(entity: UniversalEntity): void;
  get(id: string): UniversalEntity | undefined;
  query(filter: EntityFilter): UniversalEntity[];
  connect(sourceId: string, targetId: string, relationship: Relationship): void;
  propagateImpact(entityId: string, change: ChangeEvent): ImpactResult[];
  getRelationships(entityId: string, type?: RelationshipType): Relationship[];
  getDependents(entityId: string): UniversalEntity[];
  getDependencies(entityId: string): UniversalEntity[];
}

export interface EntityFilter {
  type?: EntityType | EntityType[];
  category?: string | string[];
  ontologyLevel?: OntologyLevel | OntologyLevel[];
  hasFinancials?: boolean;
  dataSourceType?: DataSourceType;
  updatedAfter?: Date;
  customFilter?: (entity: UniversalEntity) => boolean;
}

// ============================================
// 9. TIME SERIES DATA
// ============================================

/**
 * TimeSeriesData - For historical and forecasted values
 * Enables time-based simulation (Phase 10)
 */
export interface TimeSeriesData {
  entityId: string;
  field: string;
  dataPoints: DataPoint[];
  frequency: 'MINUTE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: Date;
  endDate: Date;
  interpolation?: 'LINEAR' | 'STEP' | 'SPLINE';
}

export interface DataPoint {
  timestamp: Date;
  value: number;
  source?: string;
  confidence?: number;
  isForecasted?: boolean;
}

// ============================================
// 10. VERSIONING
// ============================================

export interface EntityVersion {
  entityId: string;
  version: number;
  snapshot: UniversalEntity;
  changedFields: string[];
  changedBy: string;
  changeReason?: string;
  timestamp: Date;
  parentVersion?: number;
}

// ============================================
// HELPER TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
