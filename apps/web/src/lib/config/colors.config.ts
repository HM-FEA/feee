/**
 * Centralized Color/Theme Configuration System
 * Purpose: Single source of truth for all colors - sector colors, status colors, canvas colors
 * Benefits: Consistent theming across app, easy dark/light mode switching, color palette management
 */

export type ColorVariant = 'primary' | 'light' | 'dark' | 'rgba';
export type SectorColorKey = 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | 'OPTIONS' | 'CRYPTO';
export type StatusColorKey = 'positive' | 'negative' | 'neutral' | 'warning' | 'danger' | 'success';
export type CanvasColorKey = 'background' | 'grid' | 'text' | 'node' | 'edge' | 'highlight';

/**
 * Color palette configuration - organized by category
 */
export const COLORS_CONFIG = {
  // Background colors (dark theme)
  background: {
    primary: '#050505',
    secondary: '#0F0F15',
    tertiary: '#1A1A1F',
    overlay: 'rgba(0, 0, 0, 0.5)',
    modal: 'rgba(0, 0, 0, 0.8)',
  },

  // Text colors
  text: {
    primary: '#F3F4F6',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
    muted: '#4B5563',
    inverse: '#050505',
  },

  // Border colors
  border: {
    primary: '#1A1A1F',
    secondary: '#2D2D35',
    tertiary: '#3D3D45',
    light: '#4B5563',
  },

  // Accent colors (semantic)
  accent: {
    cyan: '#00C9FF',
    emerald: '#00FF9F',
    magenta: '#FF00FF',
    amber: '#FFD700',
    red: '#FF3D3D',
    orange: '#FF8C42',
  },

  // Status colors
  status: {
    positive: '#00FF9F',        // Green - success
    negative: '#FF3D3D',        // Red - danger
    neutral: '#9CA3AF',         // Gray - neutral
    warning: '#FFD700',         // Gold - caution
    danger: '#FF6B6B',          // Bright red
    success: '#00FF9F',         // Bright green
  },

  // Canvas/Visualization colors
  canvas: {
    background: '#050505',
    grid: '#1A1A1F',
    text: '#F3F4F6',
    node: {
      default: '#00C9FF',
      hover: '#00FF9F',
      active: '#FF00FF',
      selected: '#FFD700',
    },
    edge: {
      default: '#3D3D45',
      highlight: '#00C9FF',
      strong: '#00FF9F',
    },
  },

  // Gradient definitions
  gradients: {
    primary: 'linear-gradient(135deg, #00C9FF 0%, #00FF9F 100%)',
    secondary: 'linear-gradient(135deg, #FF00FF 0%, #FFD700 100%)',
    dark: 'linear-gradient(135deg, #050505 0%, #1A1A1F 100%)',
  },

  // Sector-specific colors (for quick reference, but use getSectorColors() function)
  sectors: {
    BANKING: {
      primary: '#06B6D4',
      light: '#0891B2',
      dark: '#155E75',
      rgba: 'rgba(6, 182, 212, 0.3)',
    },
    REALESTATE: {
      primary: '#EC4899',
      light: '#F472B6',
      dark: '#BE185D',
      rgba: 'rgba(236, 72, 153, 0.3)',
    },
    MANUFACTURING: {
      primary: '#8B5CF6',
      light: '#A78BFA',
      dark: '#6D28D9',
      rgba: 'rgba(139, 92, 246, 0.3)',
    },
    SEMICONDUCTOR: {
      primary: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      rgba: 'rgba(245, 158, 11, 0.3)',
    },
    OPTIONS: {
      primary: '#10B981',
      light: '#34D399',
      dark: '#047857',
      rgba: 'rgba(16, 185, 129, 0.3)',
    },
    CRYPTO: {
      primary: '#F97316',
      light: '#FB923C',
      dark: '#C2410C',
      rgba: 'rgba(249, 115, 22, 0.3)',
    },
  },
} as const;

/**
 * Get color for sector by variant
 */
export function getSectorColor(
  sectorId: SectorColorKey,
  variant: ColorVariant = 'primary'
): string {
  return COLORS_CONFIG.sectors[sectorId]?.[variant] || COLORS_CONFIG.background.secondary;
}

/**
 * Get status color (for indicators, badges, etc.)
 */
export function getStatusColor(status: StatusColorKey): string {
  return COLORS_CONFIG.status[status] || COLORS_CONFIG.text.secondary;
}

/**
 * Get canvas color
 */
export function getCanvasColor(category: CanvasColorKey): string {
  const canvasColors: Record<CanvasColorKey, string> = {
    background: COLORS_CONFIG.canvas.background,
    grid: COLORS_CONFIG.canvas.grid,
    text: COLORS_CONFIG.canvas.text,
    node: COLORS_CONFIG.canvas.node.default,
    edge: COLORS_CONFIG.canvas.edge.default,
    highlight: COLORS_CONFIG.canvas.edge.highlight,
  };
  return canvasColors[category];
}

/**
 * Get text color for sentiment (up/down/neutral)
 */
export function getSentimentColor(sentiment: 'up' | 'down' | 'neutral'): string {
  switch (sentiment) {
    case 'up':
      return COLORS_CONFIG.status.positive;
    case 'down':
      return COLORS_CONFIG.status.negative;
    case 'neutral':
      return COLORS_CONFIG.status.neutral;
  }
}

/**
 * Get Tailwind class for color (for dynamic className usage)
 */
export const TAILWIND_COLORS = {
  background: {
    primary: 'bg-background-primary',
    secondary: 'bg-background-secondary',
    tertiary: 'bg-background-tertiary',
  },
  text: {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    tertiary: 'text-text-tertiary',
  },
  border: {
    primary: 'border-border-primary',
    secondary: 'border-border-secondary',
  },
  accent: {
    cyan: 'text-accent-cyan',
    emerald: 'text-accent-emerald',
    magenta: 'text-accent-magenta',
    amber: 'text-accent-amber',
  },
  status: {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
    warning: 'text-yellow-400',
    danger: 'text-red-500',
  },
} as const;
