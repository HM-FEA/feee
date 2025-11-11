import { create } from 'zustand';
import { getAllLevelControls, LevelControl } from '@/data/levelSpecificControls';

export type LevelState = Record<string, number>;

interface LevelStore {
  // Current level control values
  levelState: LevelState;

  // Update a single level control
  updateLevelControl: (controlId: string, value: number) => void;

  // Reset to defaults
  resetLevelState: () => void;

  // Get value for a specific control
  getControlValue: (controlId: string) => number | undefined;
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

  updateLevelControl: (controlId: string, value: number) => {
    set((state) => ({
      levelState: {
        ...state.levelState,
        [controlId]: value,
      },
    }));
  },

  resetLevelState: () => {
    set({
      levelState: getDefaultLevelState(),
    });
  },

  getControlValue: (controlId: string) => {
    return get().levelState[controlId];
  },
}));
