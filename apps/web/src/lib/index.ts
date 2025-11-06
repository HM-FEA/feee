/**
 * Main Library Export Index
 * Centralized export point for all configuration and utility modules
 * This file makes importing easier: import { getSectorColor, formatCurrency } from '@/lib'
 */

// Configuration exports
export { API_CONFIG, buildUrl, getEndpoint } from './config/api.config';
export type { SectorType, SectorConfig } from './config/sectors.config';
export {
  SECTORS_CONFIG,
  getSectorConfig,
  getActiveSectors,
  getAllSectors,
  getSectorColor as getSectorColorConfig,
  getSectorIcon,
  getSectorLabel,
  getSectorNodeRadius,
  getSectorMetrics,
} from './config/sectors.config';

export { COLORS_CONFIG, getSectorColor, getStatusColor, getCanvasColor, getSentimentColor, TAILWIND_COLORS } from './config/colors.config';
export type { ColorVariant, SectorColorKey, StatusColorKey, CanvasColorKey } from './config/colors.config';

export {
  SIMULATION_CONFIG,
  getScenario,
  getScenarioNames,
  validateInterestRate,
  validateTariff,
  validateFX,
  clampInterestRate,
  clampTariff,
  clampFX,
  formatParameter,
  getRateSensitivityLabel,
} from './config/simulation.config';
export type { RateRange, TariffRange, FXRange, RiskThreshold, ScenarioTemplate } from './config/simulation.config';

export {
  ROUTES_CONFIG,
  getRoute,
  buildRoutePath,
  getBreadcrumbs,
  getMainNavigationItems,
  routeMatches,
  extractRouteParams,
} from './config/routes.config';
export type { RouteMetadata } from './config/routes.config';

export {
  FEATURES_CONFIG,
  isFeatureEnabled,
  getFeature,
  getEnabledFeatures,
  getBetaFeatures,
  isFeatureBeta,
  hasFeaturePermission,
  canAccessFeature,
  getUpcomingFeatures,
  getFeaturesByCategory,
  checkFeatures,
} from './config/features.config';
export type { FeatureFlag } from './config/features.config';

// Constants exports
export {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  DEBOUNCE_DELAY,
  THROTTLE_DELAY,
  API_TIMEOUT,
  REALTIME_UPDATE_INTERVAL,
  GRAPH_UPDATE_INTERVAL,
  DEFAULT_DECIMAL_PLACES,
  DEFAULT_CURRENCY_DECIMALS,
  DEFAULT_PERCENT_DECIMALS,
  GRID_COLUMNS_DEFAULT,
  GRID_COLUMNS_TABLET,
  GRID_COLUMNS_MOBILE,
  CHART_HEIGHT_SMALL,
  CHART_HEIGHT_MEDIUM,
  CHART_HEIGHT_LARGE,
  CHART_COLORS,
  MAX_COMPANIES_DISPLAY,
  MAX_SECTORS_DISPLAY,
  COMPANY_BATCH_SIZE,
  ITEMS_PER_PAGE,
  MIN_COMPANY_NAME_LENGTH,
  MAX_COMPANY_NAME_LENGTH,
  MIN_TICKER_LENGTH,
  MAX_TICKER_LENGTH,
  SENSITIVITY_LEVELS,
  RISK_LEVELS,
  DATA_TYPES,
  ECONOMIC_INDICATORS,
  METRIC_TYPES,
  NOTIFICATION_TYPES,
  CACHE_DURATION,
  ARIA_LABELS,
  KEYBOARD_SHORTCUTS,
  API_ERROR_CODES,
  HTTP_METHODS,
  STORAGE_KEYS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  DATE_FORMATS,
  PERCENTAGE_FORMATS,
  EXPORT_FORMATS,
  ANIMATION_DURATION,
  Z_INDEX,
  BREAKPOINTS,
  FEATURE_RELEASE_DATES,
  DISCLAIMER,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from './config/constants';

// Utility exports
export {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatWithSign,
  formatScale,
  formatDate,
  formatTime,
  getTrendColorClass,
  getTrendArrow,
  formatMetric,
  abbreviateText,
  parseCurrency,
  parsePercent,
} from './utils/formatting';

// Service exports
export { CompanyService, useCompanyService } from './services/company.service';
export type { Company, FinancialData, FinancialRatios, SectorMetrics } from './services/company.service';

export { SectorService, useSectorService } from './services/sector.service';
export type { SectorPerformance } from './services/sector.service';
