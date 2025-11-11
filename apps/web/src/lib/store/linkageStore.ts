/**
 * Linkage Store
 * Manages user-adjusted weights for Macro-Sector linkages
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MACRO_SECTOR_LINKAGES, MacroSectorLink } from '@/data/macroSectorLinkages';
import { SectorType } from '@/data/companies';

interface UserLinkageAdjustment {
  macroId: string;
  sectorId: SectorType;
  userWeight: number;  // 0-2, default 1
}

interface LinkageStore {
  // User adjustments
  userAdjustments: Record<string, number>;  // key: `${macroId}_${sectorId}`

  // Get adjusted linkages
  getAdjustedLinkages: () => MacroSectorLink[];
  getLinkage: (macroId: string, sectorId: SectorType) => MacroSectorLink | undefined;

  // Update weight
  updateLinkageWeight: (macroId: string, sectorId: SectorType, weight: number) => void;
  resetLinkageWeight: (macroId: string, sectorId: SectorType) => void;
  resetAllWeights: () => void;

  // Bulk operations
  setPreset: (preset: 'conservative' | 'moderate' | 'aggressive') => void;
}

// Generate key for user adjustments
const getAdjustmentKey = (macroId: string, sectorId: SectorType): string => {
  return `${macroId}_${sectorId}`;
};

export const useLinkageStore = create<LinkageStore>()(
  persist(
    (set, get) => ({
      userAdjustments: {},

      getAdjustedLinkages: () => {
        const adjustments = get().userAdjustments;
        return MACRO_SECTOR_LINKAGES.map(link => ({
          ...link,
          userWeight: adjustments[getAdjustmentKey(link.macroId, link.sectorId)] ?? link.userWeight,
        }));
      },

      getLinkage: (macroId: string, sectorId: SectorType) => {
        const adjustments = get().userAdjustments;
        const baseLinkage = MACRO_SECTOR_LINKAGES.find(
          l => l.macroId === macroId && l.sectorId === sectorId
        );
        if (!baseLinkage) return undefined;

        return {
          ...baseLinkage,
          userWeight: adjustments[getAdjustmentKey(macroId, sectorId)] ?? baseLinkage.userWeight,
        };
      },

      updateLinkageWeight: (macroId: string, sectorId: SectorType, weight: number) => {
        set(state => ({
          userAdjustments: {
            ...state.userAdjustments,
            [getAdjustmentKey(macroId, sectorId)]: Math.max(0, Math.min(2, weight)),
          },
        }));
      },

      resetLinkageWeight: (macroId: string, sectorId: SectorType) => {
        set(state => {
          const newAdjustments = { ...state.userAdjustments };
          delete newAdjustments[getAdjustmentKey(macroId, sectorId)];
          return { userAdjustments: newAdjustments };
        });
      },

      resetAllWeights: () => {
        set({ userAdjustments: {} });
      },

      setPreset: (preset: 'conservative' | 'moderate' | 'aggressive') => {
        const multiplier =
          preset === 'conservative' ? 0.7 :
          preset === 'aggressive' ? 1.3 :
          1.0;

        const adjustments: Record<string, number> = {};
        MACRO_SECTOR_LINKAGES.forEach(link => {
          adjustments[getAdjustmentKey(link.macroId, link.sectorId)] = multiplier;
        });

        set({ userAdjustments: adjustments });
      },
    }),
    {
      name: 'linkage-store',
    }
  )
);
