import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * SupplyChainVoteStore - Manages votes for supply chain scenarios
 *
 * Replaces hardcoded votes in supplyChainScenarios.ts with dynamic voting system
 *
 * Future DB Schema (PostgreSQL + TimescaleDB):
 *
 * Table: supply_chain_votes
 * ┌─────────────────┬──────────────┬──────────────────────────────────┐
 * │ Column          │ Type         │ Description                      │
 * ├─────────────────┼──────────────┼──────────────────────────────────┤
 * │ id              │ SERIAL       │ Primary key                      │
 * │ scenario_id     │ VARCHAR(100) │ FK to supply_chain_scenarios.id  │
 * │ user_id         │ VARCHAR(100) │ FK to users.id                   │
 * │ vote_type       │ ENUM         │ 'up' or 'down'                   │
 * │ created_at      │ TIMESTAMPTZ  │ Vote timestamp                   │
 * │ updated_at      │ TIMESTAMPTZ  │ Last change timestamp            │
 * └─────────────────┴──────────────┴──────────────────────────────────┘
 *
 * Indexes:
 * - idx_votes_scenario_user (scenario_id, user_id) - UNIQUE
 * - idx_votes_scenario (scenario_id) - For aggregation
 * - idx_votes_created (created_at) - For trending analysis
 *
 * Materialized View: scenario_vote_summary
 * ┌─────────────────┬──────────────┬──────────────────────────────────┐
 * │ scenario_id     │ VARCHAR(100) │                                  │
 * │ upvotes         │ INTEGER      │ COUNT(*) WHERE vote_type = 'up'  │
 * │ downvotes       │ INTEGER      │ COUNT(*) WHERE vote_type = 'down'│
 * │ total_votes     │ INTEGER      │ COUNT(*)                         │
 * │ vote_ratio      │ DECIMAL      │ upvotes / total_votes            │
 * │ updated_at      │ TIMESTAMPTZ  │ Last refresh                     │
 * └─────────────────┴──────────────┴──────────────────────────────────┘
 *
 * Real-time Features (PostgreSQL):
 * - LISTEN/NOTIFY for live vote updates
 * - Row-level security (RLS) for user permissions
 * - Triggers for auto-updating materialized view
 */

export interface Vote {
  scenarioId: string;
  userId: string;
  voteType: 'up' | 'down';
  timestamp: number;
}

export interface VoteSummary {
  up: number;
  down: number;
  total: number;
  ratio: number; // up / total (0-1)
}

interface SupplyChainVoteStore {
  // State
  votes: Vote[];

  // Vote Actions
  upvote: (scenarioId: string, userId: string) => void;
  downvote: (scenarioId: string, userId: string) => void;
  removeVote: (scenarioId: string, userId: string) => void;

  // Queries
  getUserVote: (scenarioId: string, userId: string) => Vote | undefined;
  getVoteSummary: (scenarioId: string) => VoteSummary;
  getAllVoteSummaries: () => Record<string, VoteSummary>;

  // Analytics
  getTrendingScenarios: (limit?: number) => Array<{ scenarioId: string; summary: VoteSummary }>;
  getRecentVotes: (limit?: number) => Vote[];

  // Admin
  reset: () => void;
  importVotes: (votes: Vote[]) => void;
}

// Initialize with existing votes from SUPPLY_CHAIN_SCENARIOS
const INITIAL_VOTES: Vote[] = [
  // NVIDIA H100 - 298 up, 44 down
  ...Array.from({ length: 298 }, (_, i) => ({
    scenarioId: 'nvidia-h100-hbm',
    userId: `user-${i}`,
    voteType: 'up' as const,
    timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Last 7 days
  })),
  ...Array.from({ length: 44 }, (_, i) => ({
    scenarioId: 'nvidia-h100-hbm',
    userId: `user-${298 + i}`,
    voteType: 'down' as const,
    timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
  })),

  // Tesla 4680 - 251 up, 36 down
  ...Array.from({ length: 251 }, (_, i) => ({
    scenarioId: 'tesla-4680-battery',
    userId: `user-tesla-${i}`,
    voteType: 'up' as const,
    timestamp: Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000
  })),
  ...Array.from({ length: 36 }, (_, i) => ({
    scenarioId: 'tesla-4680-battery',
    userId: `user-tesla-${251 + i}`,
    voteType: 'down' as const,
    timestamp: Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000
  })),

  // iPhone 15 Pro - 172 up, 26 down
  ...Array.from({ length: 172 }, (_, i) => ({
    scenarioId: 'apple-iphone15-supply',
    userId: `user-apple-${i}`,
    voteType: 'up' as const,
    timestamp: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
  })),
  ...Array.from({ length: 26 }, (_, i) => ({
    scenarioId: 'apple-iphone15-supply',
    userId: `user-apple-${172 + i}`,
    voteType: 'down' as const,
    timestamp: Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
  })),

  // Pfizer Vaccine - 142 up, 14 down
  ...Array.from({ length: 142 }, (_, i) => ({
    scenarioId: 'pfizer-vaccine-mrna',
    userId: `user-pfizer-${i}`,
    voteType: 'up' as const,
    timestamp: Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    scenarioId: 'pfizer-vaccine-mrna',
    userId: `user-pfizer-${142 + i}`,
    voteType: 'down' as const,
    timestamp: Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
  })),

  // Solar Panel - 115 up, 19 down
  ...Array.from({ length: 115 }, (_, i) => ({
    scenarioId: 'solar-panel-polysilicon',
    userId: `user-solar-${i}`,
    voteType: 'up' as const,
    timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  })),
  ...Array.from({ length: 19 }, (_, i) => ({
    scenarioId: 'solar-panel-polysilicon',
    userId: `user-solar-${115 + i}`,
    voteType: 'down' as const,
    timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  })),
];

export const useSupplyChainVoteStore = create<SupplyChainVoteStore>()(
  persist(
    (set, get) => ({
      votes: INITIAL_VOTES,

      upvote: (scenarioId, userId) => {
        set((state) => {
          // Remove existing vote
          const filteredVotes = state.votes.filter(
            v => !(v.scenarioId === scenarioId && v.userId === userId)
          );

          // Add upvote
          return {
            votes: [
              ...filteredVotes,
              { scenarioId, userId, voteType: 'up', timestamp: Date.now() }
            ]
          };
        });
      },

      downvote: (scenarioId, userId) => {
        set((state) => {
          // Remove existing vote
          const filteredVotes = state.votes.filter(
            v => !(v.scenarioId === scenarioId && v.userId === userId)
          );

          // Add downvote
          return {
            votes: [
              ...filteredVotes,
              { scenarioId, userId, voteType: 'down', timestamp: Date.now() }
            ]
          };
        });
      },

      removeVote: (scenarioId, userId) => {
        set((state) => ({
          votes: state.votes.filter(
            v => !(v.scenarioId === scenarioId && v.userId === userId)
          )
        }));
      },

      getUserVote: (scenarioId, userId) => {
        return get().votes.find(
          v => v.scenarioId === scenarioId && v.userId === userId
        );
      },

      getVoteSummary: (scenarioId) => {
        const votes = get().votes.filter(v => v.scenarioId === scenarioId);
        const up = votes.filter(v => v.voteType === 'up').length;
        const down = votes.filter(v => v.voteType === 'down').length;
        const total = votes.length;

        return {
          up,
          down,
          total,
          ratio: total > 0 ? up / total : 0
        };
      },

      getAllVoteSummaries: () => {
        const summaries: Record<string, VoteSummary> = {};
        const scenarioIds = [...new Set(get().votes.map(v => v.scenarioId))];

        for (const scenarioId of scenarioIds) {
          summaries[scenarioId] = get().getVoteSummary(scenarioId);
        }

        return summaries;
      },

      getTrendingScenarios: (limit = 10) => {
        const summaries = get().getAllVoteSummaries();

        return Object.entries(summaries)
          .map(([scenarioId, summary]) => ({ scenarioId, summary }))
          .sort((a, b) => {
            // Sort by total votes descending
            return b.summary.total - a.summary.total;
          })
          .slice(0, limit);
      },

      getRecentVotes: (limit = 20) => {
        return [...get().votes]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
      },

      reset: () => {
        set({ votes: [] });
      },

      importVotes: (votes) => {
        set({ votes });
      }
    }),
    {
      name: 'supply-chain-vote-store',
      // Production: Replace with PostgreSQL + real-time subscriptions
      // See DB schema above for implementation details
    }
  )
);

/**
 * Hook to get vote summary for a scenario
 * Reactive - updates when votes change
 */
export function useScenarioVotes(scenarioId: string) {
  const getVoteSummary = useSupplyChainVoteStore(state => state.getVoteSummary);
  const getUserVote = useSupplyChainVoteStore(state => state.getUserVote);
  const upvote = useSupplyChainVoteStore(state => state.upvote);
  const downvote = useSupplyChainVoteStore(state => state.downvote);
  const votes = useSupplyChainVoteStore(state => state.votes); // Subscribe to changes

  const summary = getVoteSummary(scenarioId);
  // Mock user ID - in production, get from auth context
  const currentUserId = 'current-user';
  const userVote = getUserVote(scenarioId, currentUserId);

  return {
    summary,
    userVote,
    upvote: () => upvote(scenarioId, currentUserId),
    downvote: () => downvote(scenarioId, currentUserId),
    hasVoted: !!userVote,
    hasUpvoted: userVote?.voteType === 'up',
    hasDownvoted: userVote?.voteType === 'down'
  };
}
