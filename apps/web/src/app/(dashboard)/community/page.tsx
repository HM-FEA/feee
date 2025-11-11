'use client';

import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Search, Filter, User, Check, BarChart, Bot, Newspaper, HelpCircle, ClipboardList, Star, Hash, Trophy, Plus, Flame, Users, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Card, Button, Badge, SectionHeader } from '@/components/ui/DesignSystem';
import {
  useProposalStore,
  Proposal,
  ProposalType,
  ProposalStatus,
  getNetVotes,
  getApprovalRate,
  hasUserVoted
} from '@/lib/store/proposalStore';
import { useScenarioStore, Scenario } from '@/lib/store/scenarioStore';
import { useMacroStore } from '@/lib/store/macroStore';
import { useLevelStore } from '@/lib/store/levelStore';
import ScenarioSection from '@/components/community/ScenarioSection';
import ReportSection from '@/components/community/ReportSection';

// Types
interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  title: string;
  content: string;
  category: 'discussion' | 'question' | 'analysis' | 'news';
  likes: number;
  comments: number;
  tags: string[];
  hasLiked?: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
}

// Dummy Data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Alex Chen',
    avatar: 'AC',
    timestamp: '2 hours ago',
    title: 'Fed Rate Decision Impact on Banking Sector ICR',
    content: 'With the Fed holding rates at 5.25%, I\'ve been analyzing the impact on major banks\' Interest Coverage Ratios. JPM and BAC show strong resilience with ICR > 3.5x, but regional banks are showing signs of stress. What are your thoughts on the sector outlook?',
    category: 'analysis',
    likes: 42,
    comments: 12,
    tags: ['banking', 'fed', 'icr', 'macro'],
  },
  {
    id: '2',
    author: 'Sarah Kumar',
    avatar: 'SK',
    timestamp: '5 hours ago',
    title: 'Question: How to interpret negative Sharpe ratios?',
    content: 'I\'m backtesting a momentum strategy and getting Sharpe ratios around -0.3. Should I abandon this approach or is there a way to refine it? The win rate is 52% but max drawdown is concerning.',
    category: 'question',
    likes: 18,
    comments: 8,
    tags: ['backtesting', 'sharpe', 'help'],
  },
  {
    id: '3',
    author: 'Maya Patel',
    avatar: 'MP',
    timestamp: '1 day ago',
    title: 'Real Estate Macro Variables Deep Dive',
    content: 'Created a comprehensive analysis of how 12 macro variables (interest rates, unemployment, M2 liquidity, etc.) affect REIT performance. The correlation matrix reveals some surprising insights about inflation vs. property values.',
    category: 'analysis',
    likes: 67,
    comments: 23,
    tags: ['real-estate', 'macro', 'correlation'],
  },
  {
    id: '4',
    author: 'David Park',
    avatar: 'DP',
    timestamp: '1 day ago',
    title: 'Trading Bot Tournament Results - October',
    content: 'Congrats to @GoldenCrossEagle for winning October\'s tournament with +12.5% returns! The SMA crossover strategy with RSI filter proved incredibly effective. Full breakdown of top 10 strategies attached.',
    category: 'news',
    likes: 91,
    comments: 34,
    tags: ['tournament', 'bots', 'results'],
  },
  {
    id: '5',
    author: 'Emily Zhang',
    avatar: 'EZ',
    timestamp: '2 days ago',
    title: 'Semiconductor Sector: Tariff Impact Analysis',
    content: 'With new tariff rates at 15%, I\'ve modeled the impact on NVDA, TSM, and INTC. The results show varying degrees of margin compression. Companies with diversified supply chains (like TSM) show better resilience.',
    category: 'analysis',
    likes: 53,
    comments: 19,
    tags: ['semiconductor', 'tariffs', 'trade'],
  },
];

const MOCK_CONTRIBUTORS = [
  { name: 'Maya Patel', posts: 127, likes: 3420, avatar: 'MP' },
  { name: 'Alex Chen', posts: 98, likes: 2890, avatar: 'AC' },
  { name: 'David Park', posts: 84, likes: 2156, avatar: 'DP' },
  { name: 'Sarah Kumar', posts: 71, likes: 1987, avatar: 'SK' },
  { name: 'Emily Zhang', posts: 63, likes: 1654, avatar: 'EZ' },
];

const TRENDING_TAGS = [
  { tag: '#banking', posts: 234 },
  { tag: '#macro', posts: 189 },
  { tag: '#fed', posts: 156 },
  { tag: '#backtesting', posts: 142 },
  { tag: '#icr', posts: 98 },
  { tag: '#real-estate', posts: 87 },
  { tag: '#bots', posts: 76 },
  { tag: '#semiconductor', posts: 64 },
];

const PostCard = ({ post }: { post: Post }) => {
  const [hasLiked, setHasLiked] = useState(post.hasLiked || false);
  const [likes, setLikes] = useState(post.likes);

  const getCategoryIcon = () => {
    switch (post.category) {
      case 'analysis': return <BarChart size={14} />;
      case 'question': return <HelpCircle size={14} />;
      case 'news': return <Newspaper size={14} />;
      default: return <MessageCircle size={14} />;
    }
  };

  const getCategoryColor = () => {
    switch (post.category) {
      case 'analysis': return 'bg-accent-cyan/10 text-accent-cyan';
      case 'question': return 'bg-accent-magenta/10 text-accent-magenta';
      case 'news': return 'bg-accent-emerald/10 text-accent-emerald';
      default: return 'bg-background-secondary text-text-secondary';
    }
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);
  };

  return (
    <Card className="hover:border-[#2A2A3F] transition-all cursor-pointer mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-semibold text-sm">
            {post.avatar}
          </div>
          <div>
            <div className="font-semibold text-text-primary text-sm">{post.author}</div>
            <div className="text-xs text-text-tertiary">{post.timestamp}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor()}`}>
          {getCategoryIcon()}
          <span>{post.category}</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-text-primary mb-2">{post.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{post.content}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-background-secondary text-accent-cyan rounded">
            #{tag}
          </span>
        ))}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border-primary">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs transition-colors ${
            hasLiked ? 'text-red-500' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors">
          <MessageCircle size={14} />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors">
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>
    </Card>
  );
};

const PROPOSAL_TYPE_LABELS: Record<ProposalType, { label: string; icon: string; color: string }> = {
  add_relationship: { label: 'Add Link', icon: '🔗', color: '#10B981' },
  edit_relationship: { label: 'Edit Link', icon: '✏️', color: '#06B6D4' },
  remove_relationship: { label: 'Remove Link', icon: '🗑️', color: '#EF4444' },
  add_entity: { label: 'Add Entity', icon: '➕', color: '#8B5CF6' },
};

export default function CommunityPage() {
  const [mainTab, setMainTab] = useState<'feed' | 'proposals' | 'scenarios' | 'reports'>('feed');
  const [activeFilter, setActiveFilter] = useState<'all' | 'discussion' | 'question' | 'analysis' | 'news'>('all');
  const [proposalFilter, setProposalFilter] = useState<'trending' | 'pending' | 'approved' | 'rejected'>('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateScenario, setShowCreateScenario] = useState(false);

  const {
    proposals,
    currentUserId,
    createProposal,
    voteProposal,
    removeVote,
    getTrendingProposals,
    getProposalsByStatus,
  } = useProposalStore();

  // Add initial proposals if empty
  useMemo(() => {
    if (Object.keys(proposals).length === 0) {
      createProposal({
        type: 'add_relationship',
        title: 'Add Microsoft → Azure AI relationship',
        description: 'Microsoft heavily invests in Azure AI infrastructure.',
        relationship: {
          source: 'company-microsoft',
          target: 'product-azure-ai',
          type: 'supply',
          strength: 8.5,
        },
        createdBy: 'user-alice',
        reasoning: 'Microsoft has committed $10B+ to Azure AI infrastructure in 2024.',
        sources: ['https://azure.microsoft.com'],
      });

      createProposal({
        type: 'edit_relationship',
        title: 'Increase Fed Rate → Banking impact strength',
        description: 'Banking sector is more sensitive to rate changes.',
        relationship: {
          source: 'macro-fed_rate',
          target: 'sector-banking',
          type: 'impact',
          strength: 9.2,
          originalStrength: 7.5,
        },
        createdBy: 'user-bob',
        reasoning: 'Q4 2024 data shows 15% increase in bank profitability per 1% rate hike.',
      });
    }
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = MOCK_POSTS;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [activeFilter, searchTerm]);

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10">
        {/* Header */}
        <SectionHeader
          title="Community"
          subtitle="Connect, share, and learn from fellow traders"
          icon={<Users size={24} />}
          action={
            <Button variant="primary" size="md">
              <Plus size={16} className="mr-2" />
              New Post
            </Button>
          }
        />

        <div className="px-6 py-4 border-b border-border-primary bg-black/50 backdrop-blur">
          {/* Main Tab Navigation */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMainTab('feed')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mainTab === 'feed'
                  ? 'bg-accent-cyan text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              <MessageCircle size={16} className="inline mr-2" />
              Feed
            </button>
            <button
              onClick={() => setMainTab('proposals')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mainTab === 'proposals'
                  ? 'bg-accent-magenta text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              <ClipboardList size={16} className="inline mr-2" />
              Proposals
            </button>
            <button
              onClick={() => setMainTab('scenarios')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mainTab === 'scenarios'
                  ? 'bg-accent-emerald text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              <TrendingUp size={16} className="inline mr-2" />
              Scenarios
            </button>
            <button
              onClick={() => setMainTab('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mainTab === 'reports'
                  ? 'bg-accent-magenta text-black'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              <Newspaper size={16} className="inline mr-2" />
              AI Reports
            </button>
          </div>

          {/* Filters - Only show for Feed tab */}
          {mainTab === 'feed' && (
            <>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search posts, tags, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {(['all', 'analysis', 'question', 'discussion', 'news'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-accent-cyan text-black'
                        : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="px-6 py-6 h-[calc(100vh-240px)]">
          {/* Feed Tab */}
          {mainTab === 'feed' && (
            <div className="grid grid-cols-4 gap-6 h-full">
              {/* Left Sidebar - 20% */}
              <div className="col-span-1 overflow-y-auto pr-2 space-y-4">
            {/* Top Contributors */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-400" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {MOCK_CONTRIBUTORS.map((contributor, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-background-secondary rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-semibold text-xs">
                      {contributor.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-text-primary">{contributor.name}</div>
                      <div className="text-xs text-text-tertiary">
                        {contributor.posts} posts · {contributor.likes} likes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Tags */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Flame size={16} className="text-orange-400" />
                Trending Tags
              </h3>
              <div className="space-y-2">
                {TRENDING_TAGS.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs hover:bg-background-secondary rounded px-2 py-1.5 cursor-pointer transition-colors">
                    <span className="text-accent-cyan font-medium">{item.tag}</span>
                    <span className="text-text-tertiary">{item.posts}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center Feed - 50% */}
          <div className="col-span-2 overflow-y-auto pr-2">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {filteredPosts.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-sm text-text-secondary">No posts found. Try adjusting your filters.</p>
              </Card>
            )}
          </div>

          {/* Right Sidebar - 30% */}
          <div className="col-span-1 overflow-y-auto pl-2 space-y-4">
            {/* Community Guidelines */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <ClipboardList size={16} className="text-accent-cyan" />
                Community Guidelines
              </h3>
              <ul className="text-xs text-text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>Be respectful and constructive</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>Back up claims with data and analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>No spam or excessive self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={12} className="text-accent-cyan mt-0.5 flex-shrink-0" />
                  <span>Share knowledge and help others learn</span>
                </li>
              </ul>
            </Card>

            {/* Rewards System */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                Rewards System
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-background-secondary rounded">
                  <div className="font-semibold text-accent-cyan mb-1">🏆 Quality Post</div>
                  <div className="text-text-tertiary">+50 points for 10+ likes</div>
                </div>
                <div className="p-2 bg-background-secondary rounded">
                  <div className="font-semibold text-accent-magenta mb-1">💬 Active Contributor</div>
                  <div className="text-text-tertiary">+100 points for 50 comments</div>
                </div>
                <div className="p-2 bg-background-secondary rounded">
                  <div className="font-semibold text-accent-emerald mb-1">⭐ Expert Helper</div>
                  <div className="text-text-tertiary">+200 points for best answer</div>
                </div>
              </div>
            </Card>

            {/* Community Stats */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <BarChart size={16} className="text-accent-cyan" />
                Community Stats
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Members:</span>
                  <span className="font-semibold text-accent-cyan">14,287</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Posts This Week:</span>
                  <span className="font-semibold text-text-primary">1,842</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Active Now:</span>
                  <span className="font-semibold text-status-safe">2,134</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg Response Time:</span>
                  <span className="font-semibold text-text-primary">12 min</span>
                </div>
              </div>
            </Card>
          </div>
            </div>
          )}

          {/* Proposals Tab */}
          {mainTab === 'proposals' && (
            <div className="max-w-6xl mx-auto">
              <Card className="text-center py-12">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Proposals Section</h3>
                <p className="text-sm text-text-secondary">Community proposals for knowledge graph edits coming soon...</p>
              </Card>
            </div>
          )}

          {/* Scenarios Tab */}
          {mainTab === 'scenarios' && (
            <div className="max-w-6xl mx-auto overflow-y-auto h-full">
              <ScenarioSection />
            </div>
          )}

          {/* Reports Tab */}
          {mainTab === 'reports' && (
            <div className="max-w-7xl mx-auto overflow-y-auto h-full">
              <ReportSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
