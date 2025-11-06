/**
 * Sector Data Service
 * Purpose: Abstraction layer for sector-specific operations and metrics
 * Benefits: Centralized sector logic, easy to maintain sector-specific rules
 */

import { API_CONFIG, buildUrl } from '../config/api.config';
import { SECTORS_CONFIG, getSectorConfig, getSectorIcon, SectorType } from '../config/sectors.config';

export interface SectorMetrics {
  sector: SectorType;
  label: string;
  icon: string;
  metrics: Array<{
    key: string;
    label: string;
    unit: string;
    value?: number;
    change?: number;
  }>;
  sensitivity: {
    toRates: 'positive' | 'negative' | 'neutral';
    toTariff: 'positive' | 'negative' | 'neutral';
    toFX: 'positive' | 'negative' | 'neutral';
  };
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface SectorPerformance {
  sector: SectorType;
  dayChange: number;
  weekChange: number;
  monthChange: number;
  yearChange: number;
  volatility: number;
}

/**
 * Sector Service Class
 */
export class SectorService {
  /**
   * Get all sectors
   */
  static getAllSectors() {
    return Object.values(SECTORS_CONFIG);
  }

  /**
   * Get active sectors only
   */
  static getActiveSectors() {
    return Object.values(SECTORS_CONFIG).filter((sector) => sector.status === 'active');
  }

  /**
   * Get sector by ID
   */
  static getSectorById(sectorId: SectorType) {
    return getSectorConfig(sectorId);
  }

  /**
   * Get sector label
   */
  static getSectorLabel(sectorId: SectorType): string {
    return getSectorConfig(sectorId)?.label || sectorId;
  }

  /**
   * Get sector icon
   */
  static getSectorIcon(sectorId: SectorType): string {
    return getSectorIcon(sectorId);
  }

  /**
   * Get sector color variants
   */
  static getSectorColors(sectorId: SectorType) {
    return getSectorConfig(sectorId)?.colors;
  }

  /**
   * Get sector metrics
   */
  static getSectorMetrics(sectorId: SectorType) {
    return getSectorConfig(sectorId)?.metrics || [];
  }

  /**
   * Get sector sensitivity to macro variables
   */
  static getSectorSensitivity(sectorId: SectorType) {
    return getSectorConfig(sectorId)?.sensitivity;
  }

  /**
   * Get sector risk thresholds
   */
  static getSectorRiskThresholds(sectorId: SectorType) {
    return getSectorConfig(sectorId)?.riskThresholds;
  }

  /**
   * Calculate sector impact from interest rate change
   */
  static calculateRateImpact(
    sectorId: SectorType,
    oldRate: number,
    newRate: number
  ): number {
    const sector = getSectorConfig(sectorId);
    if (!sector) return 0;

    const rateChange = newRate - oldRate;
    const sensitivity = sector.sensitivity.toRates === 'positive' ? 1 : sector.sensitivity.toRates === 'negative' ? -1 : 0;

    // Simple impact calculation: change * sensitivity * volatility factor
    return rateChange * sensitivity;
  }

  /**
   * Calculate sector impact from tariff change
   */
  static calculateTariffImpact(
    sectorId: SectorType,
    oldTariff: number,
    newTariff: number
  ): number {
    const sector = getSectorConfig(sectorId);
    if (!sector) return 0;

    const tariffChange = newTariff - oldTariff;
    const sensitivity = sector.sensitivity.toTariff === 'positive' ? 1 : sector.sensitivity.toTariff === 'negative' ? -1 : 0;

    return tariffChange * sensitivity;
  }

  /**
   * Calculate sector impact from FX change
   */
  static calculateFXImpact(
    sectorId: SectorType,
    oldFX: number,
    newFX: number
  ): number {
    const sector = getSectorConfig(sectorId);
    if (!sector) return 0;

    const fxChange = newFX - oldFX;
    const sensitivity = sector.sensitivity.toFX === 'positive' ? 1 : sector.sensitivity.toFX === 'negative' ? -1 : 0;

    return fxChange * sensitivity;
  }

  /**
   * Calculate combined macro impact on sector
   */
  static calculateMacroImpact(
    sectorId: SectorType,
    macroChange: {
      rateOld?: number;
      rateNew?: number;
      tariffOld?: number;
      tariffNew?: number;
      fxOld?: number;
      fxNew?: number;
    }
  ): number {
    let totalImpact = 0;

    if (macroChange.rateOld !== undefined && macroChange.rateNew !== undefined) {
      totalImpact += this.calculateRateImpact(sectorId, macroChange.rateOld, macroChange.rateNew);
    }

    if (macroChange.tariffOld !== undefined && macroChange.tariffNew !== undefined) {
      totalImpact += this.calculateTariffImpact(sectorId, macroChange.tariffOld, macroChange.tariffNew);
    }

    if (macroChange.fxOld !== undefined && macroChange.fxNew !== undefined) {
      totalImpact += this.calculateFXImpact(sectorId, macroChange.fxOld, macroChange.fxNew);
    }

    return totalImpact;
  }

  /**
   * Get risk level for sector value
   */
  static getRiskLevel(
    sectorId: SectorType,
    value: number
  ): 'low' | 'medium' | 'high' | 'safe' {
    const thresholds = getSectorConfig(sectorId)?.riskThresholds;
    if (!thresholds) return 'medium';

    if (value >= thresholds.safe) return 'safe';
    if (value >= thresholds.caution) return 'low';
    if (value >= thresholds.risk) return 'medium';
    return 'high';
  }

  /**
   * Fetch sector performance data from API
   */
  static async getSectorPerformance(sectorId: SectorType): Promise<SectorPerformance | null> {
    try {
      const url = buildUrl(API_CONFIG.endpoints.sectors.metrics, {
        sector: sectorId,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data as SectorPerformance;
    } catch (error) {
      console.error(`Failed to fetch ${sectorId} performance:`, error);
      return null;
    }
  }

  /**
   * Fetch all sector metrics from API
   */
  static async getAllSectorMetrics(): Promise<SectorPerformance[]> {
    try {
      const sectors = this.getActiveSectors();
      const metrics = await Promise.all(
        sectors.map((sector) => this.getSectorPerformance(sector.id))
      );

      return metrics.filter((metric) => metric !== null) as SectorPerformance[];
    } catch (error) {
      console.error('Failed to fetch sector metrics:', error);
      return [];
    }
  }

  /**
   * Compare sectors
   */
  static compareSectors(sectorId1: SectorType, sectorId2: SectorType) {
    const sector1 = getSectorConfig(sectorId1);
    const sector2 = getSectorConfig(sectorId2);

    return {
      sector1: {
        label: sector1?.label,
        sensitivity: sector1?.sensitivity,
      },
      sector2: {
        label: sector2?.label,
        sensitivity: sector2?.sensitivity,
      },
      differences: {
        sameRateSensitivity: sector1?.sensitivity.toRates === sector2?.sensitivity.toRates,
        sameTariffSensitivity: sector1?.sensitivity.toTariff === sector2?.sensitivity.toTariff,
        sameFXSensitivity: sector1?.sensitivity.toFX === sector2?.sensitivity.toFX,
      },
    };
  }

  /**
   * Get sectors by sensitivity
   */
  static getSectorsBySensitivity(
    variable: 'toRates' | 'toTariff' | 'toFX',
    sensitivity: 'positive' | 'negative' | 'neutral'
  ) {
    return this.getAllSectors().filter((sector) => sector.sensitivity[variable] === sensitivity);
  }

  /**
   * Validate sector ID
   */
  static isValidSectorId(sectorId: string): sectorId is SectorType {
    return sectorId in SECTORS_CONFIG;
  }

  /**
   * Format sector for display
   */
  static formatSectorDisplay(sectorId: SectorType): {
    icon: string;
    label: string;
    description: string;
  } {
    const sector = getSectorConfig(sectorId);
    return {
      icon: sector?.icon || '📊',
      label: sector?.label || sectorId,
      description: sector?.description || '',
    };
  }
}

/**
 * Hook wrapper for easier React component usage
 */
export function useSectorService() {
  return SectorService;
}
