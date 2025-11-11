/**
 * Relationship Store - Manages user-edited relationships
 * Polymarket-style: users can adjust relationship strengths, add/remove connections
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditedRelationship {
  id: string;
  source: string;
  target: string;
  originalStrength: number;
  editedStrength: number;
  type: 'impact' | 'supply' | 'ownership' | 'loan' | 'competition';
  metadata?: {
    reason?: string;
    confidence?: number;
    upvotes?: number;
    downvotes?: number;
    editedBy?: string;
    editedAt?: string;
  };
}

export interface NewRelationship {
  id: string;
  source: string;
  target: string;
  strength: number;
  type: 'impact' | 'supply' | 'ownership' | 'loan' | 'competition';
  userCreated: true;
  metadata?: {
    reason?: string;
    confidence?: number;
  };
}

interface RelationshipStore {
  // Edited relationships (existing links with modified strength)
  editedRelationships: Record<string, EditedRelationship>;

  // New relationships (user-created links)
  newRelationships: Record<string, NewRelationship>;

  // Removed relationships (hidden by user)
  removedRelationships: Set<string>;

  // Actions
  editRelationship: (relationship: EditedRelationship) => void;
  addRelationship: (relationship: NewRelationship) => void;
  removeRelationship: (id: string) => void;
  restoreRelationship: (id: string) => void;
  resetAllEdits: () => void;

  // Getters
  getRelationshipStrength: (id: string, originalStrength: number) => number;
  isRelationshipEdited: (id: string) => boolean;
  isRelationshipRemoved: (id: string) => boolean;
}

export const useRelationshipStore = create<RelationshipStore>()(
  persist(
    (set, get) => ({
      editedRelationships: {},
      newRelationships: {},
      removedRelationships: new Set<string>(),

      editRelationship: (relationship: EditedRelationship) => {
        set(state => ({
          editedRelationships: {
            ...state.editedRelationships,
            [relationship.id]: {
              ...relationship,
              metadata: {
                ...relationship.metadata,
                editedAt: new Date().toISOString(),
              },
            },
          },
        }));
      },

      addRelationship: (relationship: NewRelationship) => {
        set(state => ({
          newRelationships: {
            ...state.newRelationships,
            [relationship.id]: relationship,
          },
        }));
      },

      removeRelationship: (id: string) => {
        set(state => ({
          removedRelationships: new Set([...state.removedRelationships, id]),
        }));
      },

      restoreRelationship: (id: string) => {
        set(state => {
          const newSet = new Set(state.removedRelationships);
          newSet.delete(id);
          return { removedRelationships: newSet };
        });
      },

      resetAllEdits: () => {
        set({
          editedRelationships: {},
          newRelationships: {},
          removedRelationships: new Set<string>(),
        });
      },

      getRelationshipStrength: (id: string, originalStrength: number) => {
        const state = get();
        if (state.editedRelationships[id]) {
          return state.editedRelationships[id].editedStrength;
        }
        return originalStrength;
      },

      isRelationshipEdited: (id: string) => {
        const state = get();
        return !!state.editedRelationships[id];
      },

      isRelationshipRemoved: (id: string) => {
        const state = get();
        return state.removedRelationships.has(id);
      },
    }),
    {
      name: 'relationship-store',
      // Custom serialization for Set
      partialize: (state) => ({
        editedRelationships: state.editedRelationships,
        newRelationships: state.newRelationships,
        removedRelationships: Array.from(state.removedRelationships),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Set
          state.removedRelationships = new Set(state.removedRelationships as any);
        }
      },
    }
  )
);

// Helper: Generate unique link ID from source and target
export function generateLinkId(source: string, target: string): string {
  // Normalize order to ensure same link regardless of direction
  const [s, t] = [source, target].sort();
  return `${s}::${t}`;
}

// Helper: Get link color based on edit status
export function getLinkColor(
  id: string,
  originalColor: string,
  isEdited: boolean,
  isRemoved: boolean
): string {
  if (isRemoved) return 'rgba(239, 68, 68, 0.3)'; // Red for removed
  if (isEdited) return 'rgba(34, 197, 94, 0.6)'; // Green for edited
  return originalColor;
}
