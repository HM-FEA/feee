/**
 * Global Constants
 * Purpose: Centralized constants used across the application
 * Benefits: Single source of truth for magic numbers and strings
 */

// Application metadata
export const APP_NAME = 'NEXUS-ALPHA';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Economic Simulation & Analysis Platform';

// Time constants (in milliseconds)
export const DEBOUNCE_DELAY = 300;
export const THROTTLE_DELAY = 500;
export const API_TIMEOUT = 30000;
export const REALTIME_UPDATE_INTERVAL = 5000;
export const GRAPH_UPDATE_INTERVAL = 1000;

// Numeric constants
export const DEFAULT_DECIMAL_PLACES = 2;
export const DEFAULT_CURRENCY_DECIMALS = 0;
export const DEFAULT_PERCENT_DECIMALS = 2;

// Grid and layout constants
export const GRID_COLUMNS_DEFAULT = 4;
export const GRID_COLUMNS_TABLET = 3;
export const GRID_COLUMNS_MOBILE = 1;

// Chart constants
export const CHART_HEIGHT_SMALL = 200;
export const CHART_HEIGHT_MEDIUM = 300;
export const CHART_HEIGHT_LARGE = 400;
export const CHART_COLORS = [
  '#00C9FF', // Cyan
  '#00FF9F', // Emerald
  '#FF00FF', // Magenta
  '#FFD700', // Amber
  '#FF3D3D', // Red
  '#FF8C42', // Orange
];

// Data limits
export const MAX_COMPANIES_DISPLAY = 100;
export const MAX_SECTORS_DISPLAY = 20;
export const COMPANY_BATCH_SIZE = 10;
export const ITEMS_PER_PAGE = 20;

// Validation constants
export const MIN_COMPANY_NAME_LENGTH = 2;
export const MAX_COMPANY_NAME_LENGTH = 100;
export const MIN_TICKER_LENGTH = 1;
export const MAX_TICKER_LENGTH = 10;

// Sensitivity levels
export const SENSITIVITY_LEVELS = {
  VERY_HIGH: 1,
  HIGH: 0.75,
  MEDIUM: 0.5,
  LOW: 0.25,
  VERY_LOW: 0,
} as const;

// Risk levels
export const RISK_LEVELS = {
  VERY_LOW: 'very_low',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;

// Market data types
export const DATA_TYPES = {
  FUNDAMENTAL: 'fundamental',
  TECHNICAL: 'technical',
  QUANTITATIVE: 'quantitative',
  HFT: 'hft',
  BLOCKCHAIN: 'blockchain',
} as const;

// Economic indicators
export const ECONOMIC_INDICATORS = {
  INTEREST_RATE: 'interest_rate',
  TARIFF_RATE: 'tariff_rate',
  FX_RATE: 'fx_rate',
  INFLATION: 'inflation',
  GDP_GROWTH: 'gdp_growth',
  UNEMPLOYMENT: 'unemployment',
} as const;

// Metric types
export const METRIC_TYPES = {
  PERCENTAGE: 'percentage',
  RATIO: 'ratio',
  BASIS_POINTS: 'basis_points',
  COUNT: 'count',
  CURRENCY: 'currency',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  VERY_SHORT: 30,
  SHORT: 300,
  MEDIUM: 1800,
  LONG: 3600,
  VERY_LONG: 86400,
} as const;

// Accessibility constants
export const ARIA_LABELS = {
  LOADING: 'Loading...',
  ERROR: 'Error occurred',
  SUCCESS: 'Success',
  MENU: 'Menu',
  CLOSE: 'Close',
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'Sort',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'ctrl+k',
  ESCAPE: 'esc',
  ENTER: 'enter',
  ARROW_UP: 'arrow-up',
  ARROW_DOWN: 'arrow-down',
  ARROW_LEFT: 'arrow-left',
  ARROW_RIGHT: 'arrow-right',
} as const;

// API error codes
export const API_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'nexus_user_preferences',
  SAVED_DASHBOARDS: 'nexus_saved_dashboards',
  FAVORITE_COMPANIES: 'nexus_favorite_companies',
  THEME_MODE: 'nexus_theme_mode',
  LANGUAGE: 'nexus_language',
} as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Locales supported
export const SUPPORTED_LOCALES = ['ko-KR', 'en-US', 'ja-JP'] as const;
export const DEFAULT_LOCALE = 'ko-KR';

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  NUMERIC: 'MM/DD/YYYY',
  ISO: 'YYYY-MM-DD',
} as const;

// Percentage formats
export const PERCENTAGE_FORMATS = {
  SIMPLE: '{value}%',
  WITH_SIGN: '{sign}{value}%',
  WITH_ARROW: '{arrow} {value}%',
} as const;

// Export formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'xlsx',
  CSV: 'csv',
  JSON: 'json',
  TEXT: 'txt',
} as const;

// Animation durations (milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-index scale
export const Z_INDEX = {
  DROPDOWN: 100,
  STICKY: 200,
  FIXED: 300,
  MODAL_BACKDROP: 400,
  MODAL: 500,
  TOOLTIP: 600,
  NOTIFICATION: 700,
} as const;

// Breakpoints (pixels)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280,
  ULTRA_WIDE: 1536,
} as const;

// Feature release dates
export const FEATURE_RELEASE_DATES = {
  'SECTOR_ANALYSIS': '2024-Q1',
  'HFT_TRADING': '2024-Q2',
  'SENTIMENT_ANALYSIS': '2024-Q3',
  'BLOCKCHAIN': '2024-Q3',
  'BACKTESTING': '2024-Q4',
} as const;

// Compliance and legal
export const DISCLAIMER = 'This analysis is for informational purposes only and should not be construed as investment advice.';
export const PRIVACY_POLICY_URL = '/privacy';
export const TERMS_OF_SERVICE_URL = '/terms';
