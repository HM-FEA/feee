import { create } from 'zustand';
import { getAllLevelControls, LevelControl } from '@/data/levelSpecificControls';
import { calculateAllEntityImpacts, EntityImpact } from '@/lib/utils/levelImpactCalculation';

export type LevelState = Record<string, number>;

interface LevelStore {
  // Current level control values
  levelState: LevelState;

  // Calculated entity impacts based on level controls
  entityImpacts: Map<string, EntityImpact>;

  // Update a single level control
  updateLevelControl: (controlId: string, value: number) => void;

  // Reset to defaults
  resetLevelState: () => void;

  // Get value for a specific control
  getControlValue: (controlId: string) => number | undefined;

  // Get impact for a specific entity
  getEntityImpact: (entityId: string) => EntityImpact | undefined;

  // Recalculate all impacts
  recalculateImpacts: () => void;
}

// Initialize default state from level controls
const getDefaultLevelState = (): LevelState => {
  const allControls = getAllLevelControls();
  const state: LevelState = {};

  allControls.forEach(control => {
    state[control.id] = control.value;
  });

  return state;
};

export const useLevelStore = create<LevelStore>((set, get) => ({
  levelState: getDefaultLevelState(),
  entityImpacts: new Map(),

  updateLevelControl: (controlId: string, value: number) => {
    set((state) => {
      const newLevelState = {
        ...state.levelState,
        [controlId]: value,
      };

      // Recalculate impacts immediately
      const newImpacts = calculateAllEntityImpacts(newLevelState);

      return {
        levelState: newLevelState,
        entityImpacts: newImpacts,
      };
    });
  },

  resetLevelState: () => {
    const defaultState = getDefaultLevelState();
    set({
      levelState: defaultState,
      entityImpacts: calculateAllEntityImpacts(defaultState),
    });
  },

  getControlValue: (controlId: string) => {
    return get().levelState[controlId];
  },

  getEntityImpact: (entityId: string) => {
    return get().entityImpacts.get(entityId);
  },

  recalculateImpacts: () => {
    const state = get();
    const newImpacts = calculateAllEntityImpacts(state.levelState);
    set({ entityImpacts: newImpacts });
  },
}));
