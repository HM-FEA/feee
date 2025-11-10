/**
 * Impact Calculation Engine
 * Calculates sector impacts based on macro variables and linkages
 */

import { MacroSectorLink, getLinkagesBySector, getEffectiveWeight } from '@/data/macroSectorLinkages';
import { getVariableById } from '@/data/macroVariables';
import { SectorType } from '@/data/companies';

export interface MacroState {
  [key: string]: number;
}

export interface SectorImpact {
  banking: number;
  realEstate: number;
  manufacturing: number;
  semiconductor: number;
  crypto: number;
}

/**
 * Calculate the impact of a single macro variable change on a sector
 */
function calculateSingleImpact(
  macroValue: number,
  defaultValue: number,
  link: MacroSectorLink
): number {
  // Calculate percentage change from default
  const percentChange = ((macroValue - defaultValue) / defaultValue) * 100;

  // Apply link weight and direction
  const effectiveWeight = getEffectiveWeight(link);
  const directionMultiplier = link.direction === 'positive' ? 1 : link.direction === 'negative' ? -1 : 0;

  // Apply sensitivity scaling
  const sensitivityMultiplier =
    link.sensitivity === 'high' ? 1.5 :
    link.sensitivity === 'medium' ? 1.0 :
    0.5;

  // Calculate impact
  const impact = percentChange * effectiveWeight * directionMultiplier * sensitivityMultiplier;

  return impact;
}

/**
 * Calculate total impact on a sector from all macro variables
 */
function calculateSectorImpact(
  sector: SectorType,
  macroState: MacroState,
  linkages: MacroSectorLink[]
): number {
  const sectorLinkages = linkages.filter(l => l.sectorId === sector);

  let totalImpact = 0;

  sectorLinkages.forEach(link => {
    const macroVariable = getVariableById(link.macroId);
    if (!macroVariable) return;

    const currentValue = macroState[link.macroId] ?? macroVariable.defaultValue;
    const defaultValue = macroVariable.defaultValue;

    const impact = calculateSingleImpact(currentValue, defaultValue, link);
    totalImpact += impact;
  });

  // Apply dampening to prevent unrealistic values
  // Using tanh to bound impact between -100% and +100%
  const dampened = Math.tanh(totalImpact / 50) * 50;

  return dampened;
}

/**
 * Calculate impacts for all sectors
 */
export function calculateAllImpacts(
  macroState: MacroState,
  linkages: MacroSectorLink[]
): SectorImpact {
  return {
    banking: calculateSectorImpact('BANKING', macroState, linkages),
    realEstate: calculateSectorImpact('REALESTATE', macroState, linkages),
    manufacturing: calculateSectorImpact('MANUFACTURING', macroState, linkages),
    semiconductor: calculateSectorImpact('SEMICONDUCTOR', macroState, linkages),
    crypto: calculateSectorImpact('CRYPTO', macroState, linkages),
  };
}

/**
 * Get detailed breakdown of impacts for a sector
 */
export interface ImpactBreakdown {
  macroId: string;
  macroName: string;
  impact: number;
  contribution: number; // Percentage of total impact
}

export function getSectorImpactBreakdown(
  sector: SectorType,
  macroState: MacroState,
  linkages: MacroSectorLink[]
): ImpactBreakdown[] {
  const sectorLinkages = linkages.filter(l => l.sectorId === sector);
  const breakdown: ImpactBreakdown[] = [];

  sectorLinkages.forEach(link => {
    const macroVariable = getVariableById(link.macroId);
    if (!macroVariable) return;

    const currentValue = macroState[link.macroId] ?? macroVariable.defaultValue;
    const defaultValue = macroVariable.defaultValue;

    const impact = calculateSingleImpact(currentValue, defaultValue, link);

    breakdown.push({
      macroId: link.macroId,
      macroName: macroVariable.name,
      impact,
      contribution: 0, // Will be calculated below
    });
  });

  // Calculate contribution percentages
  const totalAbsImpact = breakdown.reduce((sum, item) => sum + Math.abs(item.impact), 0);
  breakdown.forEach(item => {
    item.contribution = totalAbsImpact > 0 ? (Math.abs(item.impact) / totalAbsImpact) * 100 : 0;
  });

  // Sort by absolute impact (descending)
  breakdown.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return breakdown;
}

/**
 * Simulate what-if scenario
 */
export function simulateScenario(
  baseState: MacroState,
  changes: Record<string, number>,
  linkages: MacroSectorLink[]
): {
  before: SectorImpact;
  after: SectorImpact;
  delta: SectorImpact;
} {
  const before = calculateAllImpacts(baseState, linkages);

  const newState = { ...baseState, ...changes };
  const after = calculateAllImpacts(newState, linkages);

  const delta: SectorImpact = {
    banking: after.banking - before.banking,
    realEstate: after.realEstate - before.realEstate,
    manufacturing: after.manufacturing - before.manufacturing,
    semiconductor: after.semiconductor - before.semiconductor,
    crypto: after.crypto - before.crypto,
  };

  return { before, after, delta };
}
