/**
 * Routes Configuration System
 * Purpose: Centralized navigation and route definitions
 * Benefits: Single source of truth for routes, type-safe navigation, breadcrumb management
 */

export interface RouteMetadata {
  path: string;
  label: string;
  icon: string;
  breadcrumb?: string;
  parent?: string;
  description?: string;
}

/**
 * Comprehensive routes configuration
 */
export const ROUTES_CONFIG: Record<string, RouteMetadata> = {
  // Main navigation
  home: {
    path: '/',
    label: 'Home',
    icon: '🏠',
    breadcrumb: 'Home',
  },

  dashboard: {
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    breadcrumb: 'Dashboard',
    description: 'Main Control Navigator - analyze stocks, sectors, and companies',
  },

  // Macro level
  'macro.globe': {
    path: '/globe',
    label: 'Global Economy',
    icon: '🌍',
    breadcrumb: 'Global View',
    parent: 'dashboard',
    description: 'Macro-level economic indicators',
  },

  'macro.network': {
    path: '/network-graph',
    label: 'Sector Network',
    icon: '🔗',
    breadcrumb: 'Network Analysis',
    parent: 'dashboard',
    description: 'Sector relationships and dependencies',
  },

  // Sector level (Level 2)
  'sector.detail': {
    path: '/sector/:sector',
    label: 'Sector Analysis',
    icon: '📈',
    breadcrumb: 'Sector',
    parent: 'dashboard',
    description: 'Sector-specific metrics and analysis',
  },

  // Company level (Level 3)
  'company.detail': {
    path: '/company/:id',
    label: 'Company Overview',
    icon: '🏢',
    breadcrumb: 'Company',
    parent: 'dashboard',
    description: 'Company financial analysis',
  },

  'company.analyst': {
    path: '/company/:id/analyst-report',
    label: 'Analyst Report',
    icon: '📋',
    breadcrumb: 'Analyst Report',
    parent: 'company.detail',
    description: 'AI-generated analyst report with rate impact analysis',
  },

  'company.circuit': {
    path: '/company/:id/circuit-diagram',
    label: 'Circuit Diagram',
    icon: '🔌',
    breadcrumb: 'Circuit Diagram',
    parent: 'company.detail',
    description: 'Company dependencies and relationships',
  },

  // Community & Learning
  'community.hub': {
    path: '/community',
    label: 'Community',
    icon: '👥',
    breadcrumb: 'Community Hub',
    parent: 'dashboard',
    description: 'Share insights, discussions, and trading strategies',
  },

  'learning.base': {
    path: '/learn',
    label: 'Learn',
    icon: '📚',
    breadcrumb: 'Knowledge Base',
    parent: 'dashboard',
    description: 'Educational content and financial concepts',
  },

  'analysis.ontology': {
    path: '/ontology',
    label: 'Ontology',
    icon: '🏗️',
    breadcrumb: '4-Level Ontology',
    parent: 'dashboard',
    description: '4-Level 경제 온톨로지: Macro→Sector→Company→Asset',
  },

  // Simulation
  'simulator.rate': {
    path: '/rate-simulator',
    label: 'Rate Simulator',
    icon: '💹',
    breadcrumb: 'Rate Simulator',
    description: 'Interest rate impact simulation',
  },

  'simulator.advanced': {
    path: '/simulate',
    label: 'Simulate',
    icon: '⚙️',
    breadcrumb: 'Simulation Platform',
    parent: 'dashboard',
    description: 'Multi-mode strategy backtesting environment',
  },

  'trading.arena': {
    path: '/arena',
    label: 'Arena',
    icon: '🏆',
    breadcrumb: 'Trading Bot Arena',
    parent: 'dashboard',
    description: 'Create, test, and compete with trading bots',
  },

  // Utilities
  'util.about': {
    path: '/about',
    label: 'About',
    icon: 'ℹ️',
    breadcrumb: 'About',
    description: 'About this application',
  },

  'util.settings': {
    path: '/settings',
    label: 'Settings',
    icon: '⚙️',
    breadcrumb: 'Settings',
    description: 'Application settings',
  },
} as const;

/**
 * Get route by key
 */
export function getRoute(routeKey: string): RouteMetadata | null {
  return ROUTES_CONFIG[routeKey as keyof typeof ROUTES_CONFIG] || null;
}

/**
 * Get route path with parameters substituted
 */
export function buildRoutePath(
  routeKey: string,
  params?: Record<string, string | number>
): string {
  const route = ROUTES_CONFIG[routeKey as keyof typeof ROUTES_CONFIG];
  if (!route) return '';

  let path = route.path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
}

/**
 * Get breadcrumb path for a route
 */
export function getBreadcrumbs(routeKey: string): RouteMetadata[] {
  const breadcrumbs: RouteMetadata[] = [];
  let currentKey: string | undefined = routeKey;

  while (currentKey && currentKey in ROUTES_CONFIG) {
    const route: RouteMetadata | undefined = ROUTES_CONFIG[currentKey as keyof typeof ROUTES_CONFIG];
    if (!route) break;

    breadcrumbs.unshift(route);
    currentKey = route.parent;
  }

  return breadcrumbs;
}

/**
 * Get navigation menu items (main routes only)
 */
export function getMainNavigationItems(): RouteMetadata[] {
  const mainRoutes = ['home', 'dashboard', 'macro.globe', 'macro.network', 'simulator.rate'];
  return mainRoutes
    .map((key) => ROUTES_CONFIG[key as keyof typeof ROUTES_CONFIG])
    .filter((route) => route !== undefined);
}

/**
 * Check if route matches pattern
 */
export function routeMatches(routePath: string, pattern: string): boolean {
  // Simple pattern matching for dynamic routes
  const patternParts = pattern.split('/');
  const pathParts = routePath.split('/');

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index];
  });
}

/**
 * Extract route parameters from path
 */
export function extractRouteParams(
  routePath: string,
  pattern: string
): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = routePath.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
}
