'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Zap, Code, Target, TrendingUp, Users, Calendar, Award, Plus, Search, Filter, Swords, Bot, Crown, Rocket, Check } from 'lucide-react';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useBotStore, STRATEGY_PRESETS, SAMPLE_TOURNAMENTS } from '@/lib/store/botStore';
import type { TradingBot, Tournament } from '@/lib/store/botStore';

// Generate performance data for charts
const generatePerformanceData = (botId: string, finalReturn: number) => {
  const days = 30;
  const data = [];
  let value = 100;

  for (let i = 0; i < days; i++) {
    const progress = i / (days - 1);
    const targetValue = 100 + finalReturn;
    const volatility = (Math.sin(botId.charCodeAt(2) * i * 0.5) * 2);
    const trend = (targetValue - 100) * progress;
    value = 100 + trend + volatility;
    data.push({ day: i + 1, value: Math.max(95, value) });
  }

  return data;
};

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const BotCard = ({ bot, onView }: { bot: TradingBot, onView: () => void }) => {
  const isPositive = bot.bestResult ? bot.bestResult.totalReturn >= 0 : false;
  const returns30d = bot.bestResult?.totalReturn || 0;
  const performanceData = useMemo(() => generatePerformanceData(bot.id, returns30d), [bot.id, returns30d]);
  const rank = bot.leaderboardPosition || 0;

  return (
    <div onClick={onView} className="cursor-pointer">
      <Card className="hover:border-[#2A2A3F] transition-all group h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{bot.name}</h3>
              {rank === 1 && <Award size={16} className="text-yellow-400" />}
              {rank === 2 && <Award size={16} className="text-gray-400" />}
              {rank === 3 && <Award size={16} className="text-orange-400" />}
            </div>
            <p className="text-xs text-text-secondary line-clamp-2">{bot.description}</p>
            <p className="text-xs text-text-tertiary mt-1">By <span className="text-accent-cyan">{bot.createdBy}</span></p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full font-semibold ${bot.status === 'running' ? 'bg-green-500/20 text-green-400' : bot.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>
            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
          </div>
        </div>

        {/* Performance Chart */}
        {bot.bestResult && (
          <div className="h-16 mb-3 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-border-primary">
          <div>
            <div className="text-xs text-text-secondary mb-1">Return</div>
            <div className={`text-sm font-bold ${isPositive ? 'text-status-safe' : 'text-status-danger'}`}>
              {bot.bestResult ? `${isPositive ? '+' : ''}${returns30d.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Win Rate</div>
            <div className="text-sm font-bold text-accent-cyan">
              {bot.bestResult ? `${bot.bestResult.winRate.toFixed(1)}%` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Sharpe</div>
            <div className="text-sm font-bold text-accent-cyan">
              {bot.bestResult ? bot.bestResult.sharpeRatio.toFixed(2) : 'N/A'}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-text-tertiary">
              <Code size={12} />
              {bot.config.strategy}
            </div>
            <div className="flex items-center gap-1 text-text-tertiary">
              Runs: {bot.backtestResults.length}
            </div>
          </div>
          {rank > 0 && <div className="text-accent-cyan font-semibold">#{rank}</div>}
        </div>
      </Card>
    </div>
  );
};

const TournamentCard = ({ tournament, onJoin, userBots }: { tournament: Tournament, onJoin: () => void, userBots: TradingBot[] }) => {
  const canJoin = tournament.status !== 'completed' && userBots.length > 0;

  return (
    <Card className="hover:border-[#2A2A3F] transition-all group h-full">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {tournament.status === 'completed' && <Swords size={24} />}
            {tournament.status === 'active' && <TrendingUp size={24} />}
            {tournament.status === 'upcoming' && <Crown size={24} />}
            <h3 className="text-sm font-semibold text-text-primary">{tournament.name}</h3>
          </div>
          <p className="text-xs text-text-secondary">{tournament.description}</p>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${tournament.status === 'active' ? 'bg-green-500/20 text-green-400' : tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-background-secondary rounded">
        <div className="text-xs">
          <div className="text-text-tertiary mb-1">Participants</div>
          <div className="font-semibold text-text-primary">{tournament.participants.length}</div>
        </div>
        <div className="text-xs">
          <div className="text-text-tertiary mb-1">Prize Pool</div>
          <div className="font-semibold text-accent-cyan">${tournament.prizes[0]?.reward || '0'}</div>
        </div>
        <div className="text-xs">
          <div className="text-text-tertiary mb-1">Period</div>
          <div className="font-semibold text-text-primary">
            {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
      <button
        onClick={canJoin ? onJoin : undefined}
        disabled={!canJoin}
        className={`w-full py-2 font-semibold rounded-lg transition-all text-xs ${
          canJoin
            ? 'bg-accent-cyan text-black hover:bg-accent-cyan/80'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        {tournament.status === 'active'
          ? canJoin
            ? 'Join Now'
            : 'Create a bot first'
          : tournament.status === 'upcoming'
          ? 'Register'
          : 'View Results'}
      </button>
    </Card>
  );
};

export default function ArenaPage() {
  const { bots, tournaments, activeTournamentId, getUserBots, getTopBots, createBot, createTournament, runBacktest, joinTournament } = useBotStore();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('all');
  const [currentUser] = useState('user-trader'); // In real app, get from auth
  const [isCreatingBot, setIsCreatingBot] = useState(false);

  const allBots = Object.values(bots);
  const allTournaments = Object.values(tournaments);
  const userBots = getUserBots(currentUser);
  const topBots = getTopBots(10);

  // Initialize with sample data if empty
  useEffect(() => {
    // Initialize tournaments if empty
    if (allTournaments.length === 0) {
      SAMPLE_TOURNAMENTS.forEach(tournament => {
        createTournament(tournament);
      });
    }

    // Initialize bots if empty
    if (allBots.length === 0) {
      // Create 3 sample bots
      const sampleBots = [
        {
          name: 'Golden Cross Eagle',
          description: 'SMA 50/200 crossover with RSI filter for momentum detection',
          config: {
            strategy: 'sma_crossover' as const,
            parameters: { fastPeriod: 50, slowPeriod: 200, rsiFilter: 30 },
            riskManagement: { maxPositionSize: 25, stopLoss: 5, takeProfit: 10, maxDrawdown: 20 },
            timeframe: '1d' as const,
          },
          createdBy: 'Alex Chen',
          isPublic: true,
        },
        {
          name: 'Macro Momentum Hunter',
          description: 'Trades based on macro variable changes and momentum indicators',
          config: {
            strategy: 'momentum' as const,
            parameters: { period: 20, threshold: 0.03, macroWeight: 0.4 },
            riskManagement: { maxPositionSize: 20, stopLoss: 6, takeProfit: 12, maxDrawdown: 25 },
            timeframe: '4h' as const,
          },
          createdBy: 'Sarah Kumar',
          isPublic: true,
        },
        {
          name: 'Mean Reversion Master',
          description: 'Statistical arbitrage using Bollinger Bands and mean reversion',
          config: {
            strategy: 'mean_reversion' as const,
            parameters: { lookback: 30, threshold: 2.5, confirmationPeriod: 3 },
            riskManagement: { maxPositionSize: 15, stopLoss: 4, takeProfit: 8, maxDrawdown: 15 },
            timeframe: '1h' as const,
          },
          createdBy: 'Maya Patel',
          isPublic: true,
        },
      ];

      sampleBots.forEach((bot, idx) => {
        const botId = createBot(bot);
        // Run backtest for each
        setTimeout(() => {
          runBacktest(botId, '2024-01-01', '2024-10-31').then(() => {
            console.log(`Backtest completed for ${bot.name}`);
          });
        }, idx * 100);
      });
    }
  }, []);

  const filteredBots = useMemo(() => {
    let filtered = topBots;
    if (strategyFilter !== 'all') {
      filtered = filtered.filter(b => b.config.strategy === strategyFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(term) ||
        b.createdBy.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.config.strategy.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [topBots, searchTerm, strategyFilter]);

  const handleCreateBot = () => {
    const botName = prompt('Enter bot name:');
    if (!botName) return;

    const botDescription = prompt('Enter bot description:');
    if (!botDescription) return;

    const strategy = prompt('Choose strategy (sma_crossover, rsi_threshold, mean_reversion, momentum):') as any;
    if (!strategy || !STRATEGY_PRESETS[strategy]) {
      alert('Invalid strategy');
      return;
    }

    const newBotId = createBot({
      name: botName,
      description: botDescription,
      config: {
        strategy,
        parameters: STRATEGY_PRESETS[strategy].defaultParams,
        riskManagement: {
          maxPositionSize: 20,
          stopLoss: 5,
          takeProfit: 10,
          maxDrawdown: 20,
        },
        timeframe: '1d',
      },
      createdBy: currentUser,
      isPublic: true,
    });

    // Automatically run backtest
    runBacktest(newBotId, '2024-01-01', '2024-10-31').then(() => {
      alert('Bot created and backtested successfully!');
    });
  };

  const handleJoinTournament = (tournamentId: string) => {
    if (userBots.length === 0) {
      alert('Create a bot first!');
      return;
    }

    // Use first bot for simplicity (in real app, let user choose)
    joinTournament(userBots[0].id, tournamentId);
    alert(`Joined tournament with ${userBots[0].name}!`);
  };

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <GlobalTopNav />
      <div className="relative z-10">
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2">
                <Trophy size={24} />
                Trading Bot Arena
              </h1>
              <p className="text-sm text-text-secondary">Create, compete, and earn with algorithmic trading bots</p>
            </div>
            <button
              onClick={handleCreateBot}
              className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Create Bot
            </button>
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Trophy size={16} />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'tournaments' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Swords size={16} />
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('my-bots')}
              className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'my-bots' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Bot size={16} />
              My Bots ({userBots.length})
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search bots, creators, strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan text-text-primary"
            >
              <option value="all">All Strategies</option>
              {Object.keys(STRATEGY_PRESETS).map(strategy => (
                <option key={strategy} value={strategy}>
                  {STRATEGY_PRESETS[strategy as keyof typeof STRATEGY_PRESETS].name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-6 py-6 h-[calc(100vh-260px)] overflow-y-auto">
          {activeTab === 'leaderboard' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Trophy size={20}/>
                  Global Leaderboard
                </h2>
                <p className="text-sm text-text-secondary">Top performing bots ranked by Sharpe ratio</p>
              </div>

              {/* Top 3 Podium */}
              {filteredBots.length >= 3 && filteredBots[0].bestResult && filteredBots[1].bestResult && filteredBots[2].bestResult && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* 2nd Place */}
                  <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-400/30">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-400/20 mb-3">
                        <Award size={24} className="text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-400 mb-1">#2</div>
                      <div className="text-sm font-semibold text-text-primary mb-1">{filteredBots[1].name}</div>
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[1].createdBy}</div>
                      <div className="text-lg font-bold text-status-safe">
                        +{filteredBots[1].bestResult.totalReturn.toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-tertiary">Return</div>
                    </div>
                  </Card>

                  {/* 1st Place */}
                  <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-400/40 -mt-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20 mb-3">
                        <Crown size={32} className="text-yellow-400" />
                      </div>
                      <div className="text-3xl font-bold text-yellow-400 mb-1">#1</div>
                      <div className="text-base font-semibold text-text-primary mb-1">{filteredBots[0].name}</div>
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[0].createdBy}</div>
                      <div className="text-2xl font-bold text-status-safe">
                        +{filteredBots[0].bestResult.totalReturn.toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-tertiary">Return</div>
                    </div>
                  </Card>

                  {/* 3rd Place */}
                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-400/30">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-400/20 mb-3">
                        <Award size={24} className="text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-orange-400 mb-1">#3</div>
                      <div className="text-sm font-semibold text-text-primary mb-1">{filteredBots[2].name}</div>
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[2].createdBy}</div>
                      <div className="text-lg font-bold text-status-safe">
                        +{filteredBots[2].bestResult.totalReturn.toFixed(1)}%
                      </div>
                      <div className="text-xs text-text-tertiary">Return</div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Bot Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBots.map(bot => (
                  <BotCard
                    key={bot.id}
                    bot={bot}
                    onView={() => console.log('View bot:', bot.id)}
                  />
                ))}
              </div>

              {filteredBots.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-sm text-text-secondary">No bots found. Try adjusting your filters.</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Swords size={20}/>
                  Tournaments
                </h2>
                <p className="text-sm text-text-secondary">Compete with other traders. Earn prizes and reputation.</p>
              </div>

              {allTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTournaments.map(tournament => (
                    <TournamentCard
                      key={tournament.id}
                      tournament={tournament}
                      userBots={userBots}
                      onJoin={() => handleJoinTournament(tournament.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <Swords size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                  <p className="text-text-secondary">No tournaments available at the moment.</p>
                  <p className="text-sm text-text-tertiary mt-2">Check back soon for exciting competitions!</p>
                </Card>
              )}

              <Card className="mt-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Tournament Rules</h3>
                <div className="space-y-2 text-xs text-text-secondary">
                  <p><Check size={12} className="inline-flex mr-1" /> Live trading simulations with historical data</p>
                  <p><Check size={12} className="inline-flex mr-1" /> Bots ranked by Sharpe ratio and total return</p>
                  <p><Check size={12} className="inline-flex mr-1" /> Monthly tournaments with prize pools</p>
                  <p><Check size={12} className="inline-flex mr-1" /> Fair play enforced - all bots use same data</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'my-bots' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                    <Bot size={20}/>
                    My Bots
                  </h2>
                  <p className="text-sm text-text-secondary">Your created trading bots and their performance</p>
                </div>
                <button
                  onClick={handleCreateBot}
                  className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Bot
                </button>
              </div>

              {userBots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userBots.map(bot => (
                    <BotCard
                      key={bot.id}
                      bot={bot}
                      onView={() => console.log('View bot:', bot.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <Trophy size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                  <p className="text-text-secondary mb-4">You haven't created any bots yet.</p>
                  <button
                    onClick={handleCreateBot}
                    className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm inline-flex items-center gap-2"
                  >
                    <Code size={14} />
                    Create Your First Bot
                  </button>
                </Card>
              )}

              <Card className="mt-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Rocket size={16}/>
                  Quick Start
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">1. Choose Strategy</h4>
                    <p className="text-text-secondary">SMA, RSI, Mean Reversion, or Momentum</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">2. Configure Parameters</h4>
                    <p className="text-text-secondary">Set risk management and timeframes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">3. Backtest</h4>
                    <p className="text-text-secondary">Automatically tested on historical data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">4. Compete</h4>
                    <p className="text-text-secondary">Join tournaments and climb the leaderboard</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
