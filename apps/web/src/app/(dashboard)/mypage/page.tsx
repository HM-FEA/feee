'use client';

import { useState } from 'react';
import { User, BookMarked, LineChart, Award, Settings, Download, Share2 } from 'lucide-react';
import { useReportStore } from '@/lib/store/reportStore';
import { Card } from '@/components/ui/DesignSystem';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'graphs' | 'stats'>('reports');
  const getBookmarkedReports = useReportStore(state => state.getBookmarkedReports);
  const unbookmarkReport = useReportStore(state => state.unbookmarkReport);

  const bookmarkedReports = getBookmarkedReports();

  // Mock user data - will be replaced with actual user system
  const userData = {
    name: 'Portfolio Manager',
    level: 12,
    xp: 3450,
    xpToNextLevel: 5000,
    joined: '2024-09',
    reportsRead: bookmarkedReports.length,
    graphsCreated: 8,
    simulationsRun: 156
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Hero Card - Character View */}
        <Card className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative p-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-1">
                  <div className="w-full h-full rounded-xl bg-background-secondary flex items-center justify-center">
                    <User size={48} className="text-text-primary" />
                  </div>
                </div>
                {/* Level Badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-accent-magenta to-accent-cyan
                  text-black font-bold text-xs px-3 py-1 rounded-full border-2 border-background-primary">
                  LV {userData.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {userData.name}
                </h1>
                <p className="text-text-tertiary mb-4">
                  Member since {userData.joined} • {userData.reportsRead} reports analyzed
                </p>

                {/* XP Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Experience</span>
                    <span className="text-accent-cyan font-mono">
                      {userData.xp} / {userData.xpToNextLevel} XP
                    </span>
                  </div>
                  <div className="h-3 bg-background-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500
                        rounded-full transition-all duration-500"
                      style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary">
                    {userData.xpToNextLevel - userData.xp} XP to Level {userData.level + 1}
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-secondary/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-accent-cyan">
                    {userData.graphsCreated}
                  </div>
                  <div className="text-xs text-text-tertiary">Graphs Saved</div>
                </div>
                <div className="bg-background-secondary/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-accent-magenta">
                    {userData.simulationsRun}
                  </div>
                  <div className="text-xs text-text-tertiary">Simulations</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="px-4 py-2 bg-accent-cyan text-black rounded-lg font-medium
                hover:bg-accent-cyan/80 transition-all flex items-center gap-2">
                <Share2 size={16} />
                Share Profile
              </button>
              <button className="px-4 py-2 bg-background-secondary text-text-primary rounded-lg
                font-medium hover:bg-background-tertiary transition-all flex items-center gap-2
                border border-white/10">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === 'reports'
                ? 'text-accent-cyan'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <BookMarked size={18} className="inline mr-2" />
            Bookmarked Reports
            {activeTab === 'reports' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('graphs')}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === 'graphs'
                ? 'text-accent-cyan'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <LineChart size={18} className="inline mr-2" />
            Saved Graphs
            {activeTab === 'graphs' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === 'stats'
                ? 'text-accent-cyan'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <Award size={18} className="inline mr-2" />
            Achievements
            {activeTab === 'stats' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan" />
            )}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {bookmarkedReports.map((report, idx) => (
              <Card key={report.id} className="group hover:shadow-2xl transition-all duration-300">
                <div className="p-6 space-y-4">
                  {/* Report Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-accent-cyan mb-1">
                        {report.company}
                      </div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-cyan
                        transition-colors line-clamp-2">
                        {report.title}
                      </h3>
                    </div>
                    <button className="text-text-tertiary hover:text-accent-cyan transition-colors">
                      <Download size={18} />
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-text-secondary line-clamp-3">
                    {report.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {report.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-background-tertiary text-text-tertiary
                          text-xs rounded-full border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-xs text-text-tertiary">
                      {report.date}
                    </div>
                    <button className="text-xs text-accent-cyan hover:text-accent-cyan/80
                      font-medium transition-colors">
                      Read Report →
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add More Card */}
            <Card className="border-dashed border-2 border-white/20 hover:border-accent-cyan/50
              transition-all duration-300 group cursor-pointer">
              <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-background-tertiary flex items-center justify-center
                  group-hover:bg-accent-cyan/20 transition-all">
                  <BookMarked size={32} className="text-text-tertiary group-hover:text-accent-cyan transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-secondary group-hover:text-accent-cyan transition-colors">
                    Discover More Reports
                  </h3>
                  <p className="text-sm text-text-tertiary mt-1">
                    Browse analyst reports and bookmark your favorites
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'graphs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Saved Graph Snapshots - Mock Data */}
            {[1, 2, 3].map((idx) => (
              <Card key={idx} className="group hover:shadow-2xl transition-all duration-300">
                <div className="p-4 space-y-3">
                  {/* Graph Thumbnail */}
                  <div className="aspect-video bg-background-tertiary rounded-lg overflow-hidden
                    border border-white/10 relative group-hover:border-accent-cyan/50 transition-all">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LineChart size={48} className="text-text-tertiary" />
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                      transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-accent-cyan text-black rounded-lg font-medium">
                        Open Graph
                      </button>
                    </div>
                  </div>

                  {/* Graph Info */}
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Network Graph #{idx}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      Saved on Nov {10 + idx}, 2025
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan text-xs rounded-full">
                      Semiconductor
                    </span>
                    <span className="px-2 py-1 bg-accent-magenta/20 text-accent-magenta text-xs rounded-full">
                      Supply Chain
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            {/* Save New Card */}
            <Card className="border-dashed border-2 border-white/20 hover:border-accent-cyan/50
              transition-all duration-300 group cursor-pointer">
              <div className="p-4 h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center
                  group-hover:bg-accent-cyan/20 transition-all">
                  <LineChart size={24} className="text-text-tertiary group-hover:text-accent-cyan transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary group-hover:text-accent-cyan transition-colors">
                    Save New Graph
                  </h3>
                  <p className="text-xs text-text-tertiary mt-1">
                    Create and save graph snapshots
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Achievement Cards */}
            {[
              { icon: '🎯', title: 'First Analysis', desc: 'Completed your first macro simulation', unlocked: true },
              { icon: '📊', title: 'Graph Master', desc: 'Created 10 network graphs', unlocked: true },
              { icon: '📚', title: 'Voracious Reader', desc: 'Read 25 analyst reports', unlocked: false },
              { icon: '🏆', title: 'Simulation Expert', desc: 'Ran 100 simulations', unlocked: true },
              { icon: '🔮', title: 'Scenario Creator', desc: 'Saved 5 custom scenarios', unlocked: false },
              { icon: '🌟', title: 'Level 10', desc: 'Reached level 10', unlocked: true }
            ].map((achievement, idx) => (
              <Card
                key={idx}
                className={`p-6 ${
                  achievement.unlocked
                    ? 'border-accent-cyan/30'
                    : 'border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-accent-cyan' : 'text-text-tertiary'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      {achievement.desc}
                    </p>
                    {achievement.unlocked && (
                      <div className="text-xs text-accent-emerald mt-2">
                        ✓ Unlocked
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
