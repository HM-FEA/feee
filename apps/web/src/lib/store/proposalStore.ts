/**
 * Community Proposal Store - Polymarket-style proposal system
 * Users can propose new relationships, vote on proposals, and see approved changes
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProposalType = 'add_relationship' | 'edit_relationship' | 'remove_relationship' | 'add_entity';
export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface Proposal {
  id: string;
  type: ProposalType;
  title: string;
  description: string;

  // Relationship data (for add/edit/remove relationship proposals)
  relationship?: {
    source: string;
    target: string;
    type: 'impact' | 'supply' | 'ownership' | 'loan' | 'competition';
    strength: number;
    originalStrength?: number; // For edit proposals
  };

  // Entity data (for add entity proposals)
  entity?: {
    name: string;
    type: 'company' | 'product' | 'component' | 'technology';
    sector?: string;
    metadata?: Record<string, any>;
  };

  // Voting
  upvotes: number;
  downvotes: number;
  userVotes: Record<string, 'up' | 'down'>; // userId -> vote

  // Status
  status: ProposalStatus;

  // Metadata
  createdBy: string; // userId or username
  createdAt: string;
  updatedAt: string;

  // Evidence & reasoning
  reasoning: string;
  sources?: string[]; // URLs to supporting evidence

  // Community feedback
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  upvotes: number;
}

interface ProposalStore {
  proposals: Record<string, Proposal>;
  currentUserId: string; // Mock user ID (in real app, from auth)

  // Actions
  createProposal: (proposal: Omit<Proposal, 'id' | 'upvotes' | 'downvotes' | 'userVotes' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  voteProposal: (proposalId: string, vote: 'up' | 'down') => void;
  removeVote: (proposalId: string) => void;
  updateProposalStatus: (proposalId: string, status: ProposalStatus) => void;
  addComment: (proposalId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'upvotes'>) => void;
  deleteProposal: (proposalId: string) => void;

  // Getters
  getProposalsByStatus: (status: ProposalStatus) => Proposal[];
  getProposalsByType: (type: ProposalType) => Proposal[];
  getTrendingProposals: () => Proposal[]; // Sort by net votes
  getUserProposals: (userId: string) => Proposal[];
}

export const useProposalStore = create<ProposalStore>()(
  persist(
    (set, get) => ({
      proposals: {},
      currentUserId: 'user-demo-123', // Mock user

      createProposal: (proposal) => {
        const id = `proposal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newProposal: Proposal = {
          ...proposal,
          id,
          upvotes: 1, // Creator auto-upvotes
          downvotes: 0,
          userVotes: { [get().currentUserId]: 'up' },
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          comments: [],
        };

        set(state => ({
          proposals: {
            ...state.proposals,
            [id]: newProposal,
          },
        }));
      },

      voteProposal: (proposalId, vote) => {
        const state = get();
        const proposal = state.proposals[proposalId];
        if (!proposal) return;

        const currentUserId = state.currentUserId;
        const existingVote = proposal.userVotes[currentUserId];

        let newUpvotes = proposal.upvotes;
        let newDownvotes = proposal.downvotes;
        const newUserVotes = { ...proposal.userVotes };

        // Remove existing vote if any
        if (existingVote === 'up') {
          newUpvotes--;
        } else if (existingVote === 'down') {
          newDownvotes--;
        }

        // Add new vote
        if (vote === 'up') {
          newUpvotes++;
          newUserVotes[currentUserId] = 'up';
        } else {
          newDownvotes++;
          newUserVotes[currentUserId] = 'down';
        }

        set(state => ({
          proposals: {
            ...state.proposals,
            [proposalId]: {
              ...proposal,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVotes: newUserVotes,
              updatedAt: new Date().toISOString(),
            },
          },
        }));

        // Auto-approve if threshold met (10 net votes)
        const netVotes = newUpvotes - newDownvotes;
        if (netVotes >= 10 && proposal.status === 'pending') {
          get().updateProposalStatus(proposalId, 'approved');
        } else if (netVotes <= -5 && proposal.status === 'pending') {
          get().updateProposalStatus(proposalId, 'rejected');
        }
      },

      removeVote: (proposalId) => {
        const state = get();
        const proposal = state.proposals[proposalId];
        if (!proposal) return;

        const currentUserId = state.currentUserId;
        const existingVote = proposal.userVotes[currentUserId];
        if (!existingVote) return;

        let newUpvotes = proposal.upvotes;
        let newDownvotes = proposal.downvotes;
        const newUserVotes = { ...proposal.userVotes };

        if (existingVote === 'up') {
          newUpvotes--;
        } else {
          newDownvotes--;
        }

        delete newUserVotes[currentUserId];

        set(state => ({
          proposals: {
            ...state.proposals,
            [proposalId]: {
              ...proposal,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVotes: newUserVotes,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      updateProposalStatus: (proposalId, status) => {
        const proposal = get().proposals[proposalId];
        if (!proposal) return;

        set(state => ({
          proposals: {
            ...state.proposals,
            [proposalId]: {
              ...proposal,
              status,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      addComment: (proposalId, comment) => {
        const proposal = get().proposals[proposalId];
        if (!proposal) return;

        const newComment: Comment = {
          ...comment,
          id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          upvotes: 0,
        };

        set(state => ({
          proposals: {
            ...state.proposals,
            [proposalId]: {
              ...proposal,
              comments: [...(proposal.comments || []), newComment],
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      deleteProposal: (proposalId) => {
        set(state => {
          const { [proposalId]: deleted, ...remaining } = state.proposals;
          return { proposals: remaining };
        });
      },

      // Getters
      getProposalsByStatus: (status) => {
        return Object.values(get().proposals).filter(p => p.status === status);
      },

      getProposalsByType: (type) => {
        return Object.values(get().proposals).filter(p => p.type === type);
      },

      getTrendingProposals: () => {
        return Object.values(get().proposals)
          .filter(p => p.status === 'pending')
          .sort((a, b) => {
            const aScore = a.upvotes - a.downvotes;
            const bScore = b.upvotes - b.downvotes;
            return bScore - aScore;
          });
      },

      getUserProposals: (userId) => {
        return Object.values(get().proposals).filter(p => p.createdBy === userId);
      },
    }),
    {
      name: 'proposal-store',
    }
  )
);

// Helper: Get net votes
export function getNetVotes(proposal: Proposal): number {
  return proposal.upvotes - proposal.downvotes;
}

// Helper: Get vote percentage
export function getApprovalRate(proposal: Proposal): number {
  const total = proposal.upvotes + proposal.downvotes;
  if (total === 0) return 0;
  return (proposal.upvotes / total) * 100;
}

// Helper: Check if user has voted
export function hasUserVoted(proposal: Proposal, userId: string): 'up' | 'down' | null {
  return proposal.userVotes[userId] || null;
}
