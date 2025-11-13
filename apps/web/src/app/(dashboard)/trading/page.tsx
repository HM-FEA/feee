'use client';

import React, { useState, useEffect } from 'react';
import { useTradingBotStore, SAMPLE_TRADING_BOTS, type TradingBot, type BotType } from '@/lib/store/tradingBotStore';
import { Bot, TrendingUp, DollarSign, Users, Star, Play, Pause, Settings, Plus, Zap } from 'lucide-react';

export default function TradingPage() {
  const { bots, createBot, runBacktest, subscribeToBot } = useTradingBotStore();
  const [viewMode, setViewMode] = useState<'marketplace' | 'myBots' | 'create'>('marketplace');
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [creatingBot, setCreatingBot] = useState(false);

  // Initialize with sample bots
  useEffect(() => {
    if (Object.keys(bots).length === 0) {
      SAMPLE_TRADING_BOTS.forEach(bot => createBot(bot));
    }
  }, []);

  const botList = Object.values(bots);
  const publicBots = botList.filter(b => b.isPublic);
  const myBots = botList.filter(b => b.author === 'user'); // In real app, filter by current user

  const handleCreateAIBot = () => {
    const prompt = window.prompt('Describe your trading strategy in plain English:\n\nExample: "Buy when RSI < 30 and sell when RSI > 70. Use 2% stop loss."');
    if (!prompt) return;

    const name = window.prompt('Bot name:') || 'Unnamed Bot';

    setCreatingBot(true);
    setTimeout(() => {
      createBot({
        name,
        description: 'AI-generated trading strategy',
        author: 'user',
        type: 'AI_DESCRIPTION',
        status: 'DRAFT',
        strategy: prompt,
        aiPrompt: prompt,
        isPublic: false,
        subscriptionPrice: 29,
        revenueShare: 0.7,
      });
      setCreatingBot(false);
      setViewMode('myBots');
    }, 1500);
  };

  const handleCreateTraditionalBot = () => {
    const strategyType = window.prompt('Strategy type:\n1. MEAN_REVERSION\n2. MOMENTUM\n3. PAIRS_TRADING\n4. STAT_ARB\n5. LONG_SHORT\n\nEnter number:');
    const strategies = ['MEAN_REVERSION', 'MOMENTUM', 'PAIRS_TRADING', 'STAT_ARB', 'LONG_SHORT'];
    const selected = strategies[parseInt(strategyType || '1') - 1] as any;

    const name = window.prompt('Bot name:') || 'Unnamed Bot';

    createBot({
      name,
      description: `${selected} trading strategy`,
      author: 'user',
      type: 'TRADITIONAL',
      status: 'DRAFT',
      strategy: `Traditional ${selected} strategy`,
      strategyType: selected,
      parameters: {
        period: 20,
        threshold: 2,
        stop_loss: -2,
        take_profit: 3,
      },
      isPublic: false,
      subscriptionPrice: 19,
      revenueShare: 0.7,
    });
    setViewMode('myBots');
  };

  const handleRunBacktest = async (botId: string) => {
    await runBacktest(botId);
    alert('Backtest complete! Check results below.');
  };

  const handleSubscribe = (botId: string) => {
    subscribeToBot(botId);
    alert('Subscribed! You can now use this bot.');
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-8 h-8 text-accent-cyan" />
                <h1 className="text-3xl font-bold text-text-primary">Trading Bots</h1>
              </div>
              <p className="text-text-secondary">
                AI-powered and traditional trading strategies with backtesting
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateAIBot}
                disabled={creatingBot}
                className="flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white rounded transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {creatingBot ? 'Creating...' : 'AI Bot'}
              </button>
              <button
                onClick={handleCreateTraditionalBot}
                className="flex items-center gap-2 px-4 py-2 bg-accent-magenta hover:bg-accent-magenta/80 text-white rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Traditional
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border-primary">
            <button
              onClick={() => setViewMode('marketplace')}
              className={`px-4 py-2 font-medium transition-colors ${
                viewMode === 'marketplace'
                  ? 'text-accent-cyan border-b-2 border-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Marketplace ({publicBots.length})
            </button>
            <button
              onClick={() => setViewMode('myBots')}
              className={`px-4 py-2 font-medium transition-colors ${
                viewMode === 'myBots'
                  ? 'text-accent-cyan border-b-2 border-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              My Bots ({myBots.length})
            </button>
          </div>
        </div>

        {/* Bot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(viewMode === 'marketplace' ? publicBots : myBots).map(bot => (
            <div
              key={bot.id}
              className="bg-background-secondary border border-border-primary rounded-lg p-6 hover:border-accent-cyan/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-1">{bot.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      bot.type === 'AI_DESCRIPTION'
                        ? 'bg-accent-cyan/20 text-accent-cyan'
                        : 'bg-accent-magenta/20 text-accent-magenta'
                    }`}>
                      {bot.type === 'AI_DESCRIPTION' ? '🤖 AI' : '📊 Traditional'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      bot.status === 'LIVE'
                        ? 'bg-accent-emerald/20 text-accent-emerald'
                        : 'bg-text-tertiary/20 text-text-tertiary'
                    }`}>
                      {bot.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">{bot.description}</p>
                </div>
              </div>

              {/* Performance Metrics */}
              {bot.backtestResults && (
                <div className="mb-4 p-3 bg-background-tertiary rounded border border-border-primary">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-text-tertiary text-xs">Return</div>
                      <div className="text-accent-emerald font-bold">
                        +{bot.backtestResults.totalReturn.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-text-tertiary text-xs">Sharpe</div>
                      <div className="text-text-primary font-bold">
                        {bot.backtestResults.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-text-tertiary text-xs">Max DD</div>
                      <div className="text-accent-magenta font-bold">
                        {bot.backtestResults.maxDrawdown.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-text-tertiary text-xs">Win Rate</div>
                      <div className="text-text-primary font-bold">
                        {bot.backtestResults.winRate.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Preview */}
              {bot.type === 'AI_DESCRIPTION' && bot.aiPrompt && (
                <div className="mb-4 p-3 bg-background-primary rounded text-xs text-text-secondary line-clamp-3">
                  "{bot.aiPrompt}"
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 text-text-secondary">
                  <Users className="w-4 h-4" />
                  <span>{bot.subscribers}</span>
                </div>
                {bot.isPublic && (
                  <div className="flex items-center gap-1 text-accent-emerald font-medium">
                    <DollarSign className="w-4 h-4" />
                    <span>${bot.subscriptionPrice}/mo</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {viewMode === 'myBots' ? (
                  <>
                    <button
                      onClick={() => handleRunBacktest(bot.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm rounded transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Backtest
                    </button>
                    <button className="px-3 py-2 bg-background-tertiary hover:bg-background-primary border border-border-primary text-text-secondary rounded transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSubscribe(bot.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((viewMode === 'marketplace' && publicBots.length === 0) ||
          (viewMode === 'myBots' && myBots.length === 0)) && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {viewMode === 'marketplace' ? 'No bots in marketplace' : 'No bots created yet'}
            </h3>
            <p className="text-text-secondary mb-4">
              {viewMode === 'marketplace'
                ? 'Check back later for community trading bots'
                : 'Create your first AI or traditional trading bot'}
            </p>
            {viewMode === 'myBots' && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleCreateAIBot}
                  className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white rounded transition-colors"
                >
                  Create AI Bot
                </button>
                <button
                  onClick={handleCreateTraditionalBot}
                  className="px-4 py-2 bg-accent-magenta hover:bg-accent-magenta/80 text-white rounded transition-colors"
                >
                  Create Traditional Bot
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
