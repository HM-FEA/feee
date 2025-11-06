'use client';

import React, { useState, useMemo } from 'react';
import { Trophy, Zap, Code, Target, TrendingUp, Users, Calendar, Award, Plus, Search, Filter, Swords, Bot, Crown, Rocket, Check } from 'lucide-react';

// Types
interface TradingBot {
  id: string;
  name: string;
  creator: string;
  description: string;
  language: 'python' | 'javascript';
  strategy: string;
  returns30d: number;
  winRate: number;
  trades: number;
  sharpeRatio: number;
  maxDrawdown: number;
  rank: number;
  status: 'active' | 'paused' | 'archived';
  created: Date;
  joined: number;
}

interface Tournament {
  id: string;
  name: string;
  description: string;
  period: string;
  status: 'active' | 'upcoming' | 'completed';
  participants: number;
  prizePool: string;
  startDate: Date;
  endDate: Date;
  icon: string;
}

// Mock Data
const MOCK_BOTS: TradingBot[] = [
  { id: 'bot1', name: 'Golden Cross Eagle', creator: 'Alex Chen', description: 'SMA 50/200 crossover with RSI filter.', language: 'python', strategy: 'SMA Crossover + RSI', returns30d: 12.5, winRate: 58.2, trades: 34, sharpeRatio: 2.14, maxDrawdown: -8.5, rank: 1, status: 'active', created: new Date(), joined: 1250, },
  { id: 'bot2', name: 'Macro Momentum Hunter', creator: 'Sarah Kumar', description: 'Trades based on macro variable changes.', language: 'python', strategy: 'Macro + Momentum', returns30d: 9.8, winRate: 52.1, trades: 28, sharpeRatio: 1.87, maxDrawdown: -12.3, rank: 2, status: 'active', created: new Date(), joined: 892, },
  { id: 'bot3', name: 'Volatility Crushers', creator: 'Maya Patel', description: 'Iron condor and strangle options strategies.', language: 'javascript', strategy: 'Options Spreads', returns30d: 7.2, winRate: 64.7, trades: 42, sharpeRatio: 2.31, maxDrawdown: -5.2, rank: 3, status: 'active', created: new Date(), joined: 756, },
];

const MOCK_TOURNAMENTS: Tournament[] = [
  { id: 't1', name: 'September Showdown', description: '30-day tournament with real-time rankings.', period: 'Sep 1-30', status: 'completed', participants: 247, prizePool: '$5,000', startDate: new Date(), endDate: new Date(), icon: 'swords', },
  { id: 't2', name: 'October Bull Run', description: 'Can your bot catch the fall bull run?', period: 'Oct 1-31', status: 'active', participants: 312, prizePool: '$7,500', startDate: new Date(), endDate: new Date(), icon: 'bull', },
  { id: 't3', name: 'Q4 Championship', description: 'The grand finale! Largest prize pool.', period: 'Oct 15 - Dec 31', status: 'upcoming', participants: 0, prizePool: '$25,000', startDate: new Date(), endDate: new Date(), icon: 'crown', },
];

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const BotCard = ({ bot, onView }: { bot: TradingBot, onView: () => void }) => {
  const isPositive = bot.returns30d >= 0;
  return (
    <div onClick={onView} className="cursor-pointer">
      <Card className="hover:border-[#2A2A3F] transition-all group h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">{bot.name}</h3>
              {bot.rank === 1 && <Award size={16} className="text-yellow-400" />}
              {bot.rank === 2 && <Award size={16} className="text-gray-400" />}
              {bot.rank === 3 && <Award size={16} className="text-orange-400" />}
            </div>
            <p className="text-xs text-text-secondary">{bot.description}</p>
            <p className="text-xs text-text-tertiary mt-1">By <span className="text-accent-cyan">{bot.creator}</span></p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full font-semibold ${bot.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-border-primary">
          <div>
            <div className="text-xs text-text-secondary mb-1">30D Return</div>
            <div className={`text-sm font-bold ${isPositive ? 'text-status-safe' : 'text-status-danger'}`}>{isPositive ? '+' : ''}{bot.returns30d.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Win Rate</div>
            <div className="text-sm font-bold text-accent-cyan">{bot.winRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-1">Sharpe</div>
            <div className="text-sm font-bold text-accent-cyan">{bot.sharpeRatio.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs pt-2 border-t border-border-primary">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-text-tertiary"><Code size={12} />{bot.language}</div>
            <div className="flex items-center gap-1 text-text-tertiary"><Users size={12} />{bot.joined} followers</div>
          </div>
          <div className="text-accent-cyan font-semibold">#{bot.rank + 1}</div>
        </div>
      </Card>
    </div>
  );
};

const TournamentCard = ({ tournament, onJoin }: { tournament: Tournament, onJoin: () => void }) => (
  <Card className="hover:border-[#2A2A3F] transition-all group h-full">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {tournament.icon === 'swords' && <Swords size={24} />}
          {tournament.icon === 'bull' && <TrendingUp size={24} />}
          {tournament.icon === 'crown' && <Crown size={24} />}
          <h3 className="text-sm font-semibold text-text-primary">{tournament.name}</h3>
        </div>
        <p className="text-xs text-text-secondary">{tournament.description}</p>
      </div>
      <div className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${tournament.status === 'active' ? 'bg-green-500/20 text-green-400' : tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-background-secondary rounded">
      <div className="text-xs"><div className="text-text-tertiary mb-1">Participants</div><div className="font-semibold text-text-primary">{tournament.participants}</div></div>
      <div className="text-xs"><div className="text-text-tertiary mb-1">Prize Pool</div><div className="font-semibold text-accent-cyan">{tournament.prizePool}</div></div>
      <div className="text-xs"><div className="text-text-tertiary mb-1">Period</div><div className="font-semibold text-text-primary">{tournament.period}</div></div>
    </div>
    <button onClick={onJoin} className="w-full py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-xs">
      {tournament.status === 'active' ? 'Join Now' : tournament.status === 'upcoming' ? 'Register' : 'View Results'}
    </button>
  </Card>
);

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');

  const filteredBots = useMemo(() => {
    let filtered = MOCK_BOTS;
    if (languageFilter !== 'all') filtered = filtered.filter(b => b.language === languageFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => b.name.toLowerCase().includes(term) || b.creator.toLowerCase().includes(term) || b.description.toLowerCase().includes(term) || b.strategy.toLowerCase().includes(term));
    }
    return filtered.sort((a, b) => a.rank - b.rank);
  }, [searchTerm, languageFilter]);

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10">
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2"><Trophy size={24} />Trading Bot Arena</h1>
              <p className="text-sm text-text-secondary">Create, compete, and earn with algorithmic trading bots</p>
            </div>
            <button className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"><Plus size={16} />Create Bot</button>
          </div>
          <div className="flex gap-4 mb-4">
            <button onClick={() => setActiveTab('leaderboard')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><Trophy size={16} />Leaderboard</button>
            <button onClick={() => setActiveTab('tournaments')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'tournaments' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><Swords size={16} />Tournaments</button>
            <button onClick={() => setActiveTab('my-bots')} className={`px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'my-bots' ? 'text-accent-cyan border-b-2 border-accent-cyan' : 'text-text-secondary hover:text-text-primary'}`}><Bot size={16} />My Bots</button>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input type="text" placeholder="Search bots, creators, strategies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-cyan" />
            </div>
            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-cyan text-text-primary">
              <option value="all">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
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
                <p className="text-sm text-text-secondary">Top performing bots ranked by 30-day returns</p>
              </div>

              {/* Top 3 Podium */}
              {filteredBots.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* 2nd Place */}
                  <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-400/30">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-400/20 mb-3">
                        <Award size={24} className="text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-400 mb-1">#2</div>
                      <div className="text-sm font-semibold text-text-primary mb-1">{filteredBots[1].name}</div>
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[1].creator}</div>
                      <div className="text-lg font-bold text-status-safe">+{filteredBots[1].returns30d.toFixed(1)}%</div>
                      <div className="text-xs text-text-tertiary">30-day return</div>
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
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[0].creator}</div>
                      <div className="text-2xl font-bold text-status-safe">+{filteredBots[0].returns30d.toFixed(1)}%</div>
                      <div className="text-xs text-text-tertiary">30-day return</div>
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
                      <div className="text-xs text-text-secondary mb-2">by {filteredBots[2].creator}</div>
                      <div className="text-lg font-bold text-status-safe">+{filteredBots[2].returns30d.toFixed(1)}%</div>
                      <div className="text-xs text-text-tertiary">30-day return</div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Full Leaderboard Table */}
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-primary">
                        <th className="text-left py-3 px-3 text-text-tertiary font-semibold text-xs">Rank</th>
                        <th className="text-left py-3 px-3 text-text-tertiary font-semibold text-xs">Bot Name</th>
                        <th className="text-left py-3 px-3 text-text-tertiary font-semibold text-xs">Creator</th>
                        <th className="text-left py-3 px-3 text-text-tertiary font-semibold text-xs">Strategy</th>
                        <th className="text-right py-3 px-3 text-text-tertiary font-semibold text-xs">30D Return</th>
                        <th className="text-right py-3 px-3 text-text-tertiary font-semibold text-xs">Win Rate</th>
                        <th className="text-right py-3 px-3 text-text-tertiary font-semibold text-xs">Sharpe</th>
                        <th className="text-right py-3 px-3 text-text-tertiary font-semibold text-xs">Trades</th>
                        <th className="text-center py-3 px-3 text-text-tertiary font-semibold text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBots.map((bot, index) => {
                        const isPositive = bot.returns30d >= 0;
                        return (
                          <tr
                            key={bot.id}
                            className="border-b border-border-primary hover:bg-background-secondary transition-colors cursor-pointer"
                            onClick={() => console.log('View bot:', bot.id)}
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-text-primary">#{bot.rank + 1}</span>
                                {bot.rank === 0 && <Crown size={16} className="text-yellow-400" />}
                                {bot.rank === 1 && <Award size={16} className="text-gray-400" />}
                                {bot.rank === 2 && <Award size={16} className="text-orange-400" />}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-text-primary hover:text-accent-cyan transition-colors">
                                {bot.name}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-text-secondary">{bot.creator}</td>
                            <td className="py-3 px-3">
                              <span className="text-xs px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded">
                                {bot.strategy}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className={`font-bold ${isPositive ? 'text-status-safe' : 'text-status-danger'}`}>
                                {isPositive ? '+' : ''}{bot.returns30d.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right text-accent-cyan font-semibold">
                              {bot.winRate.toFixed(1)}%
                            </td>
                            <td className="py-3 px-3 text-right text-accent-magenta font-semibold">
                              {bot.sharpeRatio.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-right text-text-secondary">
                              {bot.trades}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex justify-center">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                  bot.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              {filteredBots.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-sm text-text-secondary">No bots found. Try adjusting your filters.</p>
                </Card>
              )}
            </div>
          )}
          {activeTab === 'tournaments' && (
            <div>
              <div className="mb-4"><h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2"><Swords size={20}/>Active Tournaments</h2><p className="text-sm text-text-secondary">Compete with other traders. Earn prizes and reputation.</p></div>
              <div className="grid grid-cols-2 gap-4">{MOCK_TOURNAMENTS.map(tournament => (<TournamentCard key={tournament.id} tournament={tournament} onJoin={() => console.log('Join tournament:', tournament.id)} />))}</div>
              <Card className="mt-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Tournament Rules</h3>
                <div className="space-y-2 text-xs text-text-secondary">
                  <p><Check size={12} className="inline-flex mr-1" /> Live trading simulations</p>
                  <p><Check size={12} className="inline-flex mr-1" /> Bots ranked by return, Sharpe ratio, etc.</p>
                  <p><Check size={12} className="inline-flex mr-1" /> Monthly tournaments with prize pools</p>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'my-bots' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div><h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2"><Bot size={20}/>My Bots</h2><p className="text-sm text-text-secondary">Your created trading bots and their performance</p></div>
                <button className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm flex items-center gap-2"><Plus size={16} />New Bot</button>
              </div>
              <Card className="text-center py-12">
                <Trophy size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                <p className="text-text-secondary mb-4">You haven't created any bots yet.</p>
                <button className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all text-sm inline-flex items-center gap-2"><Code size={14} />Create Your First Bot</button>
              </Card>
              <Card className="mt-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Rocket size={16}/>Quick Start</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><h4 className="font-semibold text-text-primary mb-1">1. Choose Language</h4><p className="text-text-secondary">Python or JavaScript</p></div>
                  <div><h4 className="font-semibold text-text-primary mb-1">2. Write Logic</h4><p className="text-text-secondary">Use our SDK to code your strategy</p></div>
                  <div><h4 className="font-semibold text-text-primary mb-1">3. Backtest</h4><p className="text-text-secondary">Test on 10 years of data</p></div>
                  <div><h4 className="font-semibold text-text-primary mb-1">4. Deploy & Compete</h4><p className="text-text-secondary">Go live and earn rewards</p></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}