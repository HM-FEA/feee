/**
 * Feature Flags Configuration System
 * Purpose: Centralized feature toggle management for A/B testing and progressive rollout
 * Benefits: Easy feature enablement without code changes, environment-aware, audit trail
 */

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  releaseDate?: string;
  beta?: boolean;
  requiredPermissions?: string[];
}

/**
 * Feature flags configuration - all features in one place
 */
export const FEATURES_CONFIG: Record<string, FeatureFlag> = {
  // Core functionality
  'dashboard.fundamental': {
    key: 'dashboard.fundamental',
    name: 'Fundamental Analysis',
    description: 'Company fundamental analysis tab',
    enabled: true,
  },

  'dashboard.technical': {
    key: 'dashboard.technical',
    name: 'Technical Analysis',
    description: 'Company technical analysis tab',
    enabled: true,
  },

  'dashboard.quantitative': {
    key: 'dashboard.quantitative',
    name: 'Quantitative Analysis',
    description: 'Company quantitative metrics tab',
    enabled: true,
  },

  'dashboard.hft': {
    key: 'dashboard.hft',
    name: 'HFT Analysis',
    description: 'High-frequency trading analysis tab',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q2',
  },

  'dashboard.blockchain': {
    key: 'dashboard.blockchain',
    name: 'Blockchain Analysis',
    description: 'Blockchain and crypto analysis tab',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q3',
  },

  // Macro level
  'macro.globe': {
    key: 'macro.globe',
    name: 'Global Economy View',
    description: '3D globe visualization of global economy',
    enabled: true,
  },

  'macro.ceoboard': {
    key: 'macro.ceoboard',
    name: 'Executive Dashboard',
    description: 'CEO-level executive summary board',
    enabled: true,
  },

  'macro.network': {
    key: 'macro.network',
    name: 'Sector Network Graph',
    description: 'Sector relationships and dependencies visualization',
    enabled: true,
  },

  // Sector level
  'sector.analysis': {
    key: 'sector.analysis',
    name: 'Sector Analysis Pages',
    description: 'Dedicated sector-specific analysis pages',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q1',
  },

  'sector.metrics': {
    key: 'sector.metrics',
    name: 'Sector Metrics Dashboard',
    description: 'Comprehensive sector metrics view',
    enabled: false,
    beta: true,
  },

  // Company level
  'company.analystReport': {
    key: 'company.analystReport',
    name: 'AI Analyst Report',
    description: 'AI-generated analyst report with rate impact analysis',
    enabled: true,
  },

  'company.circuitDiagram': {
    key: 'company.circuitDiagram',
    name: 'Circuit Diagram',
    description: 'Company dependencies and relationships diagram',
    enabled: true,
  },

  // Simulation and analysis
  'simulator.rate': {
    key: 'simulator.rate',
    name: 'Interest Rate Simulator',
    description: 'Simulate interest rate impact on sectors and companies',
    enabled: true,
  },

  'simulator.tariff': {
    key: 'simulator.tariff',
    name: 'Tariff Simulator',
    description: 'Simulate tariff impact on sectors and companies',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q2',
  },

  'simulator.fx': {
    key: 'simulator.fx',
    name: 'FX Rate Simulator',
    description: 'Simulate foreign exchange impact on sectors and companies',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q2',
  },

  // Data and integration
  'data.realtime': {
    key: 'data.realtime',
    name: 'Real-time Data',
    description: 'Real-time stock price and market data',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q3',
  },

  'data.sentiment': {
    key: 'data.sentiment',
    name: 'Sentiment Analysis',
    description: 'AI-powered news and social sentiment analysis',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q4',
  },

  // Advanced features
  'advanced.modeling': {
    key: 'advanced.modeling',
    name: 'Advanced Financial Modeling',
    description: 'DCF, multiple methods, and scenario modeling',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q3',
  },

  'advanced.backtesting': {
    key: 'advanced.backtesting',
    name: 'Strategy Backtesting',
    description: 'Backtest trading strategies',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q4',
    requiredPermissions: ['premium'],
  },

  'advanced.alerts': {
    key: 'advanced.alerts',
    name: 'Intelligent Alerts',
    description: 'Custom alerts and notifications',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q2',
  },

  // UX/UI features
  'ui.darkMode': {
    key: 'ui.darkMode',
    name: 'Dark Mode',
    description: 'Dark theme support',
    enabled: true,
  },

  'ui.customization': {
    key: 'ui.customization',
    name: 'UI Customization',
    description: 'User-customizable layouts and dashboards',
    enabled: false,
    beta: true,
  },

  'ui.export': {
    key: 'ui.export',
    name: 'Report Export',
    description: 'Export reports to PDF, Excel, and other formats',
    enabled: false,
    beta: true,
    releaseDate: '2024-Q2',
  },
} as const;

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(featureKey: string): boolean {
  const feature = FEATURES_CONFIG[featureKey as keyof typeof FEATURES_CONFIG];
  return feature?.enabled ?? false;
}

/**
 * Get feature by key
 */
export function getFeature(featureKey: string): FeatureFlag | null {
  return FEATURES_CONFIG[featureKey as keyof typeof FEATURES_CONFIG] || null;
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.values(FEATURES_CONFIG).filter((feature) => feature.enabled);
}

/**
 * Get all beta features
 */
export function getBetaFeatures(): FeatureFlag[] {
  return Object.values(FEATURES_CONFIG).filter((feature) => feature.beta);
}

/**
 * Check if feature is in beta
 */
export function isFeatureBeta(featureKey: string): boolean {
  const feature = FEATURES_CONFIG[featureKey as keyof typeof FEATURES_CONFIG];
  return feature?.beta ?? false;
}

/**
 * Check if user has permission for feature
 */
export function hasFeaturePermission(featureKey: string, userPermissions: string[]): boolean {
  const feature = FEATURES_CONFIG[featureKey as keyof typeof FEATURES_CONFIG];
  if (!feature?.requiredPermissions || feature.requiredPermissions.length === 0) {
    return true; // No specific permissions required
  }

  return feature.requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Can user access feature (enabled + has permission)
 */
export function canAccessFeature(featureKey: string, userPermissions: string[] = []): boolean {
  return isFeatureEnabled(featureKey) && hasFeaturePermission(featureKey, userPermissions);
}

/**
 * Get upcoming features (beta features with release dates)
 */
export function getUpcomingFeatures(): FeatureFlag[] {
  return Object.values(FEATURES_CONFIG).filter((feature) => feature.beta && feature.releaseDate);
}

/**
 * Get features by category/prefix
 */
export function getFeaturesByCategory(prefix: string): FeatureFlag[] {
  return Object.values(FEATURES_CONFIG).filter((feature) => feature.key.startsWith(prefix));
}

/**
 * Bulk check feature status
 */
export function checkFeatures(featureKeys: string[]): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const key of featureKeys) {
    result[key] = isFeatureEnabled(key);
  }
  return result;
}
