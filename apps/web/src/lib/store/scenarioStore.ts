/**
 * Scenario Store - Save and load complete simulation scenarios
 * Users can save their current macro settings, relationship edits, and analysis state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MacroState } from './macroStore';
import { LevelState } from './levelStore';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon?: string; // Emoji icon for scenario

  // Simulation state
  macroState: MacroState;
  levelState?: LevelState; // Level-specific controls (9-level ontology)

  // User customizations (references to other stores)
  relationshipEdits?: Record<string, number>; // linkId → editedStrength
  removedRelationships?: string[]; // linkIds

  // Analysis metadata
  selectedSector?: string | null;
  focusedCompany?: string | null;

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isPublic: boolean; // Share with community

  // Community features
  upvotes?: number;
  downvotes?: number;
  isVerified?: boolean;

  // Statistics (auto-calculated when scenario is run)
  stats?: {
    totalImpact: number;
    affectedSectors: string[];
    keyInsights: string[];
  };
}

interface ScenarioStore {
  scenarios: Record<string, Scenario>;
  currentScenarioId: string | null;

  // Actions
  saveScenario: (scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>) => string;
  loadScenario: (scenarioId: string) => Scenario | null;
  updateScenario: (scenarioId: string, updates: Partial<Scenario>) => void;
  deleteScenario: (scenarioId: string) => void;
  setCurrentScenario: (scenarioId: string | null) => void;
  duplicateScenario: (scenarioId: string) => string | null;

  // Getters
  getAllScenarios: () => Scenario[];
  getPublicScenarios: () => Scenario[];
  getUserScenarios: (userId: string) => Scenario[];
  getScenariosByTags: (tags: string[]) => Scenario[];
}

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      scenarios: {},
      currentScenarioId: null,

      saveScenario: (scenario) => {
        const id = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newScenario: Scenario = {
          ...scenario,
          id,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          scenarios: {
            ...state.scenarios,
            [id]: newScenario,
          },
          currentScenarioId: id,
        }));

        return id;
      },

      loadScenario: (scenarioId) => {
        const scenario = get().scenarios[scenarioId];
        if (scenario) {
          set({ currentScenarioId: scenarioId });
          return scenario;
        }
        return null;
      },

      updateScenario: (scenarioId, updates) => {
        const scenario = get().scenarios[scenarioId];
        if (!scenario) return;

        set(state => ({
          scenarios: {
            ...state.scenarios,
            [scenarioId]: {
              ...scenario,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      deleteScenario: (scenarioId) => {
        set(state => {
          const { [scenarioId]: deleted, ...remaining } = state.scenarios;
          return {
            scenarios: remaining,
            currentScenarioId: state.currentScenarioId === scenarioId ? null : state.currentScenarioId,
          };
        });
      },

      setCurrentScenario: (scenarioId) => {
        set({ currentScenarioId: scenarioId });
      },

      duplicateScenario: (scenarioId) => {
        const scenario = get().scenarios[scenarioId];
        if (!scenario) return null;

        const id = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const duplicated: Scenario = {
          ...scenario,
          id,
          name: `${scenario.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          scenarios: {
            ...state.scenarios,
            [id]: duplicated,
          },
        }));

        return id;
      },

      // Getters
      getAllScenarios: () => {
        return Object.values(get().scenarios).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },

      getPublicScenarios: () => {
        return Object.values(get().scenarios)
          .filter(s => s.isPublic)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getUserScenarios: (userId) => {
        return Object.values(get().scenarios)
          .filter(s => s.createdBy === userId)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },

      getScenariosByTags: (tags) => {
        return Object.values(get().scenarios)
          .filter(s => s.tags && s.tags.some(tag => tags.includes(tag)))
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },
    }),
    {
      name: 'scenario-store',
    }
  )
);

// Helper: Calculate scenario statistics
export function calculateScenarioStats(scenario: Scenario): Scenario['stats'] {
  // Mock calculation - in real app, would analyze macro impacts
  const affectedSectors: string[] = [];
  const keyInsights: string[] = [];

  // Analyze macro changes
  if (scenario.macroState['fed_funds_rate'] !== 0.0525) {
    affectedSectors.push('BANKING', 'REALESTATE');
    keyInsights.push(`Fed rate changed to ${(scenario.macroState['fed_funds_rate'] * 100).toFixed(2)}%`);
  }

  if (scenario.macroState['us_gdp_growth'] !== 0.025) {
    affectedSectors.push('MANUFACTURING', 'SEMICONDUCTOR');
    keyInsights.push(`GDP growth adjusted to ${(scenario.macroState['us_gdp_growth'] * 100).toFixed(2)}%`);
  }

  // Calculate total impact (simplified)
  const totalImpact = Object.keys(scenario.relationshipEdits || {}).length * 5;

  return {
    totalImpact,
    affectedSectors: [...new Set(affectedSectors)],
    keyInsights,
  };
}

// Helper: Export scenario to JSON
export function exportScenario(scenario: Scenario): string {
  return JSON.stringify(scenario, null, 2);
}

// Helper: Import scenario from JSON
export function importScenario(jsonString: string): Scenario | null {
  try {
    const scenario = JSON.parse(jsonString);
    // Validate basic structure
    if (!scenario.name || !scenario.macroState) {
      return null;
    }
    return scenario;
  } catch {
    return null;
  }
}

// Preset scenarios
export const PRESET_SCENARIOS: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Fed Rate Hike to 6%',
    description: 'Aggressive monetary tightening scenario - Fed raises rates to 6% to combat inflation',
    macroState: {
      fed_funds_rate: 0.06,
      us_10y_yield: 0.052,
      us_2y_yield: 0.055,
      us_gdp_growth: 0.018,
      us_cpi: 0.042,
      us_unemployment: 4.2,
      us_m2_money_supply: 20500,
      vix: 22,
      usd_index: 107,
      wti_oil: 85,
      // ... other defaults
    } as MacroState,
    selectedSector: 'BANKING',
    createdBy: 'system',
    tags: ['monetary-policy', 'banking', 'high-rates'],
    isPublic: true,
  },
  {
    name: 'Recession Scenario 2025',
    description: 'Economic downturn with negative GDP growth, rising unemployment, and market stress',
    macroState: {
      fed_funds_rate: 0.035,
      us_10y_yield: 0.028,
      us_2y_yield: 0.032,
      us_gdp_growth: -0.008,
      us_cpi: 0.025,
      us_unemployment: 6.5,
      us_m2_money_supply: 19800,
      vix: 35,
      usd_index: 110,
      wti_oil: 65,
    } as MacroState,
    selectedSector: 'MANUFACTURING',
    createdBy: 'system',
    tags: ['recession', 'downturn', 'stress-test'],
    isPublic: true,
  },
  {
    name: 'Tech Boom - AI Revolution',
    description: 'Strong economic growth driven by AI adoption, semiconductor demand surge',
    macroState: {
      fed_funds_rate: 0.045,
      us_10y_yield: 0.042,
      us_2y_yield: 0.044,
      us_gdp_growth: 0.045,
      us_cpi: 0.032,
      us_unemployment: 3.2,
      us_m2_money_supply: 22500,
      vix: 12,
      usd_index: 102,
      wti_oil: 82,
    } as MacroState,
    selectedSector: 'SEMICONDUCTOR',
    createdBy: 'system',
    tags: ['tech', 'ai', 'growth'],
    isPublic: true,
  },
];
