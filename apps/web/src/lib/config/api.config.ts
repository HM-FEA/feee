/**
 * Centralized API Configuration
 * Purpose: Single source of truth for all API endpoints and configurations
 * Benefits: Easy environment switching, no hardcoded URLs scattered across code
 */

export const API_CONFIG = {
  // Base URL - reads from environment, defaults to localhost
  base: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',

  // All API endpoints organized by domain
  endpoints: {
    // Stock data endpoints
    stocks: {
      price: '/api/stocks',
      fundamental: '/api/fundamental',
      technical: '/api/technical',
      batch: '/api/stocks/batch',
    },

    // News and data endpoints
    news: '/api/news',

    // Report endpoints
    reports: {
      analyst: '/api/reports/analyst',
      circuit: '/api/reports/circuit',
    },

    // Financial data endpoints
    dart: {
      financial: '/api/dart/financial',
    },

    // AI and trading endpoints
    trading: {
      analyze: '/api/trading-agent/analyze',
    },

    // Company data endpoints
    companies: {
      list: '/api/companies',
      detail: '/api/companies/:id',
      relationships: '/api/companies/:id/relationships',
    },

    // Sector endpoints
    sectors: {
      list: '/api/sectors',
      metrics: '/api/sectors/:sector/metrics',
    },

    // Health check
    health: '/api/health',
  },

  // Timeout configurations (in milliseconds)
  timeout: {
    default: 30000,      // 30 seconds
    realtime: 5000,      // 5 seconds for real-time data
    heavy: 60000,        // 60 seconds for heavy computations
  },

  // Retry configuration
  retry: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },

  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  },
} as const;

/**
 * Helper function to construct full URL
 */
export function buildUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${API_CONFIG.base}${endpoint}`;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }

  return url;
}

/**
 * Helper to get endpoint with type safety
 */
export function getEndpoint(path: string): string {
  const keys = path.split('.');
  let config: any = API_CONFIG.endpoints;

  for (const key of keys) {
    config = config[key];
    if (!config) {
      console.warn(`Endpoint not found: ${path}`);
      return '';
    }
  }

  return config;
}
