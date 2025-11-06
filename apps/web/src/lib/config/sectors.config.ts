/**
 * Sector Configuration System
 * Purpose: Centralized configuration for all sectors - colors, icons, metrics, properties
 * Benefits: Add new sectors without modifying component code, theme consistency, scalable
 */

export type SectorType = 'BANKING' | 'REALESTATE' | 'MANUFACTURING' | 'SEMICONDUCTOR' | 'OPTIONS' | 'CRYPTO';

export interface SectorConfig {
  id: SectorType;
  label: string;
  icon: string;
  description: string;
  status: 'active' | 'coming_soon' | 'archived';
  colors: {
    primary: string;      // Main color
    light: string;        // Light variant
    dark: string;         // Dark variant
    rgba: string;         // For transparency
  };
  size: {
    nodeRadius: number;   // For graph visualization
    iconSize: number;     // For UI
  };
  metrics: {
    key: string;
    label: string;
    unit: string;
  }[];
  sensitivity: {
    toRates: 'positive' | 'negative' | 'neutral';
    toTariff: 'positive' | 'negative' | 'neutral';
    toFX: 'positive' | 'negative' | 'neutral';
  };
  riskThresholds?: {
    safe: number;
    caution: number;
    risk: number;
  };
}

/**
 * Comprehensive Sector Configuration
 * Can be extended with database lookup or environment-based loading
 */
export const SECTORS_CONFIG: Record<SectorType, SectorConfig> = {
  BANKING: {
    id: 'BANKING',
    label: '금융',
    icon: '🏦',
    description: 'Banking Sector - Net Interest Margin and Credit Risk',
    status: 'active',
    colors: {
      primary: '#06B6D4',      // Cyan
      light: '#0891B2',
      dark: '#155E75',
      rgba: 'rgba(6, 182, 212, 0.3)',
    },
    size: {
      nodeRadius: 35,
      iconSize: 24,
    },
    metrics: [
      { key: 'nim', label: 'Net Interest Margin', unit: '%' },
      { key: 'provision_rate', label: 'Provision Rate', unit: '%' },
      { key: 'roa', label: 'Return on Assets', unit: '%' },
      { key: 'roe', label: 'Return on Equity', unit: '%' },
    ],
    sensitivity: {
      toRates: 'positive',    // Rising rates ↑ NIM
      toTariff: 'neutral',
      toFX: 'positive',
    },
    riskThresholds: {
      safe: 2.5,
      caution: 2.0,
      risk: 0,
    },
  },

  REALESTATE: {
    id: 'REALESTATE',
    label: '부동산',
    icon: '🏢',
    description: 'Real Estate - Occupancy Rate and Rental Yield',
    status: 'active',
    colors: {
      primary: '#EC4899',      // Magenta/Pink
      light: '#F472B6',
      dark: '#BE185D',
      rgba: 'rgba(236, 72, 153, 0.3)',
    },
    size: {
      nodeRadius: 28,
      iconSize: 24,
    },
    metrics: [
      { key: 'occupancy_rate', label: 'Occupancy Rate', unit: '%' },
      { key: 'rental_yield', label: 'Rental Yield', unit: '%' },
      { key: 'ltv', label: 'Loan-to-Value', unit: '%' },
      { key: 'icr', label: 'Interest Coverage', unit: 'x' },
    ],
    sensitivity: {
      toRates: 'negative',     // Rising rates ↓ Property values
      toTariff: 'neutral',
      toFX: 'negative',
    },
    riskThresholds: {
      safe: 2.5,
      caution: 2.0,
      risk: 0,
    },
  },

  MANUFACTURING: {
    id: 'MANUFACTURING',
    label: '제조업',
    icon: '🏭',
    description: 'Manufacturing - Capacity Utilization and Labor Costs',
    status: 'active',
    colors: {
      primary: '#8B5CF6',      // Purple
      light: '#A78BFA',
      dark: '#6D28D9',
      rgba: 'rgba(139, 92, 246, 0.3)',
    },
    size: {
      nodeRadius: 30,
      iconSize: 24,
    },
    metrics: [
      { key: 'capacity_utilization', label: 'Capacity Utilization', unit: '%' },
      { key: 'labor_cost_ratio', label: 'Labor Cost Ratio', unit: '%' },
      { key: 'tariff_exposure', label: 'Tariff Exposure', unit: '%' },
      { key: 'capex_ratio', label: 'CapEx Ratio', unit: '%' },
    ],
    sensitivity: {
      toRates: 'negative',     // Rising rates ↓ Investment
      toTariff: 'negative',    // Rising tariffs ↓ Exports
      toFX: 'positive',        // Weak currency helps exports
    },
  },

  SEMICONDUCTOR: {
    id: 'SEMICONDUCTOR',
    label: '반도체',
    icon: '💻',
    description: 'Semiconductor - Wafer Utilization and R&D Intensity',
    status: 'active',
    colors: {
      primary: '#F59E0B',      // Amber/Yellow
      light: '#FBBF24',
      dark: '#D97706',
      rgba: 'rgba(245, 158, 11, 0.3)',
    },
    size: {
      nodeRadius: 26,
      iconSize: 24,
    },
    metrics: [
      { key: 'wafer_utilization', label: 'Wafer Utilization', unit: '%' },
      { key: 'rd_intensity', label: 'R&D Intensity', unit: '%' },
      { key: 'asp_change', label: 'ASP Change', unit: '%' },
      { key: 'capex_ratio', label: 'CapEx Ratio', unit: '%' },
    ],
    sensitivity: {
      toRates: 'negative',     // Rising rates ↓ CapEx
      toTariff: 'negative',    // Tariffs on imports
      toFX: 'positive',
    },
  },

  OPTIONS: {
    id: 'OPTIONS',
    label: '옵션',
    icon: '📈',
    description: 'Options Market - Volatility and Greeks',
    status: 'coming_soon',
    colors: {
      primary: '#10B981',      // Green
      light: '#34D399',
      dark: '#047857',
      rgba: 'rgba(16, 185, 129, 0.3)',
    },
    size: {
      nodeRadius: 25,
      iconSize: 24,
    },
    metrics: [
      { key: 'delta', label: 'Delta', unit: '' },
      { key: 'gamma', label: 'Gamma', unit: '' },
      { key: 'vega', label: 'Vega', unit: '' },
      { key: 'theta', label: 'Theta', unit: '' },
    ],
    sensitivity: {
      toRates: 'neutral',
      toTariff: 'neutral',
      toFX: 'neutral',
    },
  },

  CRYPTO: {
    id: 'CRYPTO',
    label: '암호화폐',
    icon: '₿',
    description: 'Cryptocurrency - Blockchain Analytics',
    status: 'coming_soon',
    colors: {
      primary: '#F97316',      // Orange
      light: '#FB923C',
      dark: '#C2410C',
      rgba: 'rgba(249, 115, 22, 0.3)',
    },
    size: {
      nodeRadius: 24,
      iconSize: 24,
    },
    metrics: [
      { key: 'market_cap', label: 'Market Cap', unit: 'B' },
      { key: 'trading_volume', label: '24h Volume', unit: 'B' },
      { key: 'volatility', label: 'Volatility', unit: '%' },
      { key: 'adoption', label: 'Adoption', unit: '%' },
    ],
    sensitivity: {
      toRates: 'negative',
      toTariff: 'neutral',
      toFX: 'neutral',
    },
  },
};

/**
 * Get sector configuration by ID
 */
export function getSectorConfig(sectorId: SectorType): SectorConfig {
  return SECTORS_CONFIG[sectorId];
}

/**
 * Get all active sectors
 */
export function getActiveSectors(): SectorConfig[] {
  return Object.values(SECTORS_CONFIG).filter((s) => s.status === 'active');
}

/**
 * Get all sectors (including coming soon)
 */
export function getAllSectors(): SectorConfig[] {
  return Object.values(SECTORS_CONFIG);
}

/**
 * Get sector color
 */
export function getSectorColor(
  sectorId: SectorType,
  variant: 'primary' | 'light' | 'dark' | 'rgba' = 'primary'
): string {
  return SECTORS_CONFIG[sectorId]?.colors[variant] || '#9CA3AF';
}

/**
 * Get sector icon
 */
export function getSectorIcon(sectorId: SectorType): string {
  return SECTORS_CONFIG[sectorId]?.icon || '📊';
}

/**
 * Get sector label
 */
export function getSectorLabel(sectorId: SectorType): string {
  return SECTORS_CONFIG[sectorId]?.label || sectorId;
}

/**
 * Get node radius for visualization
 */
export function getSectorNodeRadius(sectorId: SectorType): number {
  return SECTORS_CONFIG[sectorId]?.size.nodeRadius || 25;
}

/**
 * Get metrics for a sector
 */
export function getSectorMetrics(sectorId: SectorType) {
  return SECTORS_CONFIG[sectorId]?.metrics || [];
}
