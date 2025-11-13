'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/DesignSystem';
import { Trophy, Swords, Crown, TrendingUp, Users, Calendar, ArrowRight, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBotStore, Tournament } from '@/lib/store/botStore';

interface TournamentWidgetProps {
  maxItems?: number;
  compact?: boolean;
}

export default function TournamentWidget({ maxItems = 3, compact = false }: TournamentWidgetProps) {
  const { tournaments, bots, getUserBots } = useBotStore();
  const [currentUser] = useState('user-trader');

  const allTournaments = Object.values(tournaments);
  const activeTournaments = allTournaments.filter(t => t.status === 'active').slice(0, maxItems);
  const upcomingTournaments = allTournaments.filter(t => t.status === 'upcoming').slice(0, maxItems - activeTournaments.length);
  const displayTournaments = [...activeTournaments, ...upcomingTournaments].slice(0, maxItems);

  const userBots = getUserBots(currentUser);
  const hasJoinedTournament = (tournamentId: string) => {
    return userBots.some(bot => bot.tournamentIds?.includes(tournamentId));
  };

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'active':
        return 'text-status-safe';
      case 'upcoming':
        return 'text-accent-cyan';
      case 'completed':
        return 'text-text-tertiary';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status: Tournament['status']) => {
    switch (status) {
      case 'active':
        return <Flame size={14} className="text-status-safe animate-pulse" />;
      case 'upcoming':
        return <Calendar size={14} className="text-accent-cyan" />;
      case 'completed':
        return <Trophy size={14} className="text-yellow-400" />;
      default:
        return <Swords size={14} />;
    }
  };

  if (displayTournaments.length === 0) {
    return (
      <Card className="bg-background-secondary">
        <div className="text-center py-6">
          <Trophy size={32} className="mx-auto mb-2 text-text-tertiary opacity-50" />
          <p className="text-xs text-text-tertiary">No active tournaments</p>
          <Link
            href="/arena"
            className="text-xs text-accent-cyan hover:underline mt-2 inline-block"
          >
            View all tournaments →
          </Link>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Trophy size={16} className="text-yellow-400" />
            Tournaments
          </h3>
          <Link
            href="/arena"
            className="text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2">
          {displayTournaments.map((tournament, idx) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href="/arena">
                <div className="p-3 bg-background-tertiary hover:bg-background-secondary rounded-lg border border-border-primary hover:border-accent-cyan/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(tournament.status)}
                        <span className="text-xs font-semibold text-text-primary truncate">
                          {tournament.name}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary line-clamp-1">
                        {tournament.description}
                      </p>
                    </div>
                    {hasJoinedTournament(tournament.id) && (
                      <Crown size={14} className="text-yellow-400 flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border-primary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-text-tertiary">
                        <Users size={10} />
                        {tournament.participants.length}
                      </span>
                      <span className={`font-semibold ${getStatusColor(tournament.status)}`}>
                        {tournament.status === 'active' ? 'LIVE' : tournament.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-accent-cyan font-semibold">
                      ${tournament.prizes[0]?.reward || '0'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {allTournaments.length > maxItems && (
          <Link href="/arena">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mt-3 p-2 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg text-center text-xs font-semibold text-accent-cyan hover:bg-accent-cyan/20 transition-all cursor-pointer"
            >
              +{allTournaments.length - maxItems} more tournaments
            </motion.div>
          </Link>
        )}
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" />
            Active Tournaments
          </h3>
          <p className="text-xs text-text-tertiary mt-1">Compete and earn prizes</p>
        </div>
        <Link
          href="/arena"
          className="px-3 py-1.5 bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/80 transition-all text-xs font-semibold"
        >
          Join Arena
        </Link>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayTournaments.map((tournament, idx) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href="/arena">
                <div className="p-4 bg-background-secondary hover:bg-background-tertiary rounded-lg border border-border-primary hover:border-accent-cyan transition-all cursor-pointer group">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {tournament.status === 'active' && <Swords size={18} className="text-status-safe" />}
                      {tournament.status === 'upcoming' && <Crown size={18} className="text-accent-cyan" />}
                      {tournament.status === 'completed' && <Trophy size={18} className="text-yellow-400" />}
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                          {tournament.name}
                        </h4>
                        {hasJoinedTournament(tournament.id) && (
                          <span className="text-xs text-accent-emerald flex items-center gap-1 mt-0.5">
                            <Crown size={10} />
                            Enrolled
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      tournament.status === 'active'
                        ? 'bg-status-safe/20 text-status-safe'
                        : tournament.status === 'upcoming'
                        ? 'bg-accent-cyan/20 text-accent-cyan'
                        : 'bg-text-tertiary/20 text-text-tertiary'
                    }`}>
                      {tournament.status === 'active' ? 'LIVE' : tournament.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                    {tournament.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <Users size={12} className="mx-auto mb-1 text-text-tertiary" />
                      <div className="font-semibold text-text-primary">{tournament.participants.length}</div>
                      <div className="text-text-tertiary text-[10px]">Participants</div>
                    </div>
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <TrendingUp size={12} className="mx-auto mb-1 text-accent-cyan" />
                      <div className="font-semibold text-accent-cyan">${tournament.prizes[0]?.reward || '0'}</div>
                      <div className="text-text-tertiary text-[10px]">Prize Pool</div>
                    </div>
                    <div className="text-center p-2 bg-background-tertiary rounded">
                      <Calendar size={12} className="mx-auto mb-1 text-text-tertiary" />
                      <div className="font-semibold text-text-primary">
                        {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-text-tertiary text-[10px]">Start Date</div>
                    </div>
                  </div>

                  {/* Leaderboard Preview */}
                  {tournament.leaderboard && tournament.leaderboard.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border-primary">
                      <div className="text-xs text-text-tertiary mb-2 flex items-center gap-1">
                        <Trophy size={10} />
                        Top 3
                      </div>
                      <div className="space-y-1">
                        {tournament.leaderboard.slice(0, 3).map((entry, i) => {
                          const bot = bots[entry.botId];
                          return bot ? (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  i === 0 ? 'bg-yellow-400 text-black' :
                                  i === 1 ? 'bg-gray-400 text-black' :
                                  'bg-orange-400 text-black'
                                }`}>
                                  {i + 1}
                                </span>
                                <span className="text-text-primary truncate max-w-[120px]">{bot.name}</span>
                              </div>
                              <span className="text-accent-emerald font-mono">+{entry.totalReturn.toFixed(1)}%</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
