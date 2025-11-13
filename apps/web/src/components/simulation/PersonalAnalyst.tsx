'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/DesignSystem';
import { User, MessageCircle, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Shield, Sparkles, Brain, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown?: number;
  alpha?: number;
}

interface Recommendation {
  id: string;
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface PersonalAnalystProps {
  strategyName: string;
  aum: number;
  portfolioMetrics: PortfolioMetrics;
  macroState?: Record<string, number>;
  onApplyRecommendation?: (rec: Recommendation) => void;
}

// AI Analyst Persona
const ANALYST_PERSONAS = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Senior Quantitative Analyst',
    specialty: 'Risk Management & Portfolio Optimization',
    avatar: 'SC',
    color: 'accent-cyan',
  },
  {
    name: 'Marcus Wei',
    role: 'Macro Strategy Lead',
    specialty: 'Global Macro & Economic Analysis',
    avatar: 'MW',
    color: 'accent-magenta',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Chief Investment Officer',
    specialty: 'Multi-Asset Allocation',
    avatar: 'ER',
    color: 'accent-emerald',
  },
];

export default function PersonalAnalyst({
  strategyName,
  aum,
  portfolioMetrics,
  macroState = {},
  onApplyRecommendation,
}: PersonalAnalystProps) {
  const [selectedAnalyst, setSelectedAnalyst] = useState(0);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ from: 'user' | 'analyst'; text: string; timestamp: Date }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const analyst = ANALYST_PERSONAS[selectedAnalyst];

  // Generate AI recommendations based on portfolio state
  const generateRecommendations = useMemo(() => {
    const recs: Recommendation[] = [];
    const now = new Date();

    // Risk-based recommendations
    if (portfolioMetrics.sharpeRatio < 1.0) {
      recs.push({
        id: 'risk-1',
        type: 'warning',
        title: 'Low Risk-Adjusted Returns',
        description: `Your Sharpe ratio of ${portfolioMetrics.sharpeRatio.toFixed(2)} is below optimal. Consider reducing position sizes or adjusting stop-loss levels to improve risk-adjusted returns.`,
        confidence: 85,
        impact: 'high',
        timestamp: now,
      });
    }

    if (portfolioMetrics.maxDrawdown && portfolioMetrics.maxDrawdown > 0.15) {
      recs.push({
        id: 'risk-2',
        type: 'warning',
        title: 'High Drawdown Risk',
        description: `Maximum drawdown of ${(portfolioMetrics.maxDrawdown * 100).toFixed(1)}% exceeds recommended threshold. Implement tighter risk controls or diversify across uncorrelated strategies.`,
        confidence: 90,
        impact: 'high',
        timestamp: now,
      });
    }

    // Performance-based recommendations
    if (portfolioMetrics.expectedReturn > 0.15) {
      recs.push({
        id: 'perf-1',
        type: 'bullish',
        title: 'Strong Performance Trajectory',
        description: `Excellent ${(portfolioMetrics.expectedReturn * 100).toFixed(1)}% expected return. Consider gradually increasing position sizes while maintaining strict risk limits.`,
        confidence: 78,
        impact: 'medium',
        timestamp: now,
      });
    } else if (portfolioMetrics.expectedReturn < 0.05) {
      recs.push({
        id: 'perf-2',
        type: 'bearish',
        title: 'Underperformance Alert',
        description: `Returns are below target. Review strategy parameters and consider switching to momentum-based approach in current market conditions.`,
        confidence: 82,
        impact: 'high',
        timestamp: now,
      });
    }

    // Macro-based recommendations
    const fedRate = macroState['fed_funds_rate'] || 5.25;
    if (fedRate > 5.0) {
      recs.push({
        id: 'macro-1',
        type: 'neutral',
        title: 'High Interest Rate Environment',
        description: `Fed funds rate at ${fedRate.toFixed(2)}%. Consider rotating into financial sector plays and reducing growth-oriented positions. Treasury yields offer attractive risk-free returns.`,
        confidence: 88,
        impact: 'high',
        timestamp: now,
      });
    }

    const vix = macroState['vix'] || 18.5;
    if (vix > 30) {
      recs.push({
        id: 'macro-2',
        type: 'warning',
        title: 'Elevated Market Volatility',
        description: `VIX at ${vix.toFixed(1)} indicates heightened uncertainty. Reduce leverage, tighten stops, and consider hedging with protective puts or VIX calls.`,
        confidence: 92,
        impact: 'high',
        timestamp: now,
      });
    }

    // Strategy-specific recommendations
    if (strategyName.toLowerCase().includes('momentum')) {
      recs.push({
        id: 'strat-1',
        type: 'bullish',
        title: 'Momentum Strategy Optimization',
        description: 'Current market conditions favor momentum strategies. Consider extending holding periods and increasing position concentration in strongest trends.',
        confidence: 75,
        impact: 'medium',
        timestamp: now,
      });
    }

    // Portfolio size recommendations
    if (aum > 500_000_000) {
      recs.push({
        id: 'size-1',
        type: 'neutral',
        title: 'Large AUM Considerations',
        description: `With $${(aum / 1_000_000).toFixed(0)}M AUM, focus on liquidity management and reducing market impact. Consider splitting large orders and using dark pools.`,
        confidence: 85,
        impact: 'medium',
        timestamp: now,
      });
    }

    return recs.slice(0, 5); // Return top 5
  }, [portfolioMetrics, macroState, strategyName, aum]);

  useEffect(() => {
    setRecommendations(generateRecommendations);
  }, [generateRecommendations]);

  const analyzePortfolio = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setRecommendations(generateRecommendations);
      setIsAnalyzing(false);

      // Add analyst message
      const newMessage = {
        from: 'analyst' as const,
        text: `I've analyzed your ${strategyName} portfolio with $${(aum / 1_000_000).toFixed(1)}M AUM. I found ${generateRecommendations.length} key insights. Your Sharpe ratio of ${portfolioMetrics.sharpeRatio.toFixed(2)} ${portfolioMetrics.sharpeRatio > 1.5 ? 'is excellent' : portfolioMetrics.sharpeRatio > 1.0 ? 'is good but can be improved' : 'needs attention'}.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      from: 'user' as const,
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);

    // Simulate analyst response
    setTimeout(() => {
      const responses = [
        `Based on current market conditions, I recommend maintaining your current ${strategyName} approach with slight adjustments to risk parameters.`,
        `Your portfolio shows ${portfolioMetrics.expectedReturn > 0.10 ? 'strong' : 'moderate'} performance. Let me analyze deeper...`,
        `The key risk I see is ${portfolioMetrics.maxDrawdown && portfolioMetrics.maxDrawdown > 0.12 ? 'drawdown management' : 'volatility control'}. Here's my suggestion...`,
        `Given the Fed rate at ${(macroState['fed_funds_rate'] || 5.25).toFixed(2)}%, we should consider ${macroState['fed_funds_rate'] > 5.0 ? 'defensive positioning' : 'growth opportunities'}.`,
      ];

      const analystMsg = {
        from: 'analyst' as const,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, analystMsg]);
    }, 1500);

    setInputMessage('');
  };

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'bullish': return <TrendingUp size={16} className="text-status-safe" />;
      case 'bearish': return <TrendingDown size={16} className="text-status-danger" />;
      case 'warning': return <AlertTriangle size={16} className="text-accent-yellow" />;
      default: return <Lightbulb size={16} className="text-accent-cyan" />;
    }
  };

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'bullish': return 'border-status-safe/30 bg-status-safe/5';
      case 'bearish': return 'border-status-danger/30 bg-status-danger/5';
      case 'warning': return 'border-accent-yellow/30 bg-accent-yellow/5';
      default: return 'border-accent-cyan/30 bg-accent-cyan/5';
    }
  };

  const getImpactBadge = (impact: Recommendation['impact']) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      low: 'bg-green-500/20 text-green-400',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[impact]}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Analyst Selection */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Brain size={18} className="text-purple-400" />
              Your Personal Analyst
            </h3>
            <p className="text-xs text-text-tertiary mt-1">AI-powered portfolio analysis and recommendations</p>
          </div>
          <button
            onClick={analyzePortfolio}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={14} />
                </motion.div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Analyze Now
              </>
            )}
          </button>
        </div>

        {/* Analyst Cards */}
        <div className="grid grid-cols-3 gap-3">
          {ANALYST_PERSONAS.map((persona, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAnalyst(idx)}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedAnalyst === idx
                  ? `border-${persona.color} bg-${persona.color}/10`
                  : 'border-border-primary bg-background-secondary hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full bg-${persona.color}/20 flex items-center justify-center text-${persona.color} font-semibold text-xs`}>
                  {persona.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{persona.name}</div>
                  <div className="text-xs text-text-tertiary truncate">{persona.role}</div>
                </div>
              </div>
              <div className="text-xs text-text-secondary line-clamp-2">{persona.specialty}</div>
              {selectedAnalyst === idx && (
                <motion.div
                  layoutId="selected-analyst"
                  className="mt-2 pt-2 border-t border-purple-500/30"
                >
                  <div className="flex items-center gap-1 text-xs text-purple-400">
                    <CheckCircle size={12} />
                    Active
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="bg-background-secondary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Target size={16} className="text-accent-cyan" />
            {analyst.name}'s Recommendations
          </h3>
          <span className="text-xs text-text-tertiary">{recommendations.length} insights</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border ${getRecommendationColor(rec.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(rec.type)}
                    <span className="text-sm font-semibold text-text-primary">{rec.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(rec.impact)}
                    <span className="text-xs text-text-tertiary font-mono">{rec.confidence}%</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock size={12} />
                    {rec.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {onApplyRecommendation && (
                    <button
                      onClick={() => onApplyRecommendation(rec)}
                      className="text-xs px-3 py-1 bg-accent-cyan text-black rounded hover:bg-accent-cyan/80 transition-all font-semibold"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {recommendations.length === 0 && (
            <div className="text-center py-8 text-sm text-text-tertiary">
              Click "Analyze Now" to get personalized recommendations from {analyst.name}
            </div>
          )}
        </div>
      </Card>

      {/* Chat Interface */}
      <Card className="bg-background-secondary">
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full flex items-center justify-between mb-3"
        >
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <MessageCircle size={16} className="text-accent-magenta" />
            Chat with {analyst.name}
          </h3>
          <span className="text-xs text-text-tertiary">{showChat ? '▼' : '▶'}</span>
        </button>

        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Messages */}
              <div className="h-64 overflow-y-auto mb-3 p-3 bg-background-tertiary rounded-lg space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-xs text-text-tertiary py-8">
                    Start a conversation with your analyst
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-xs ${
                        msg.from === 'user'
                          ? 'bg-accent-cyan text-black'
                          : 'bg-background-secondary text-text-primary border border-border-primary'
                      }`}
                    >
                      {msg.text}
                      <div className={`text-xs mt-1 ${msg.from === 'user' ? 'text-black/60' : 'text-text-tertiary'}`}>
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your analyst anything..."
                  className="flex-1 px-3 py-2 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-accent-cyan text-black rounded-lg hover:bg-accent-cyan/80 transition-all text-sm font-semibold"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-background-secondary p-3">
          <div className="text-xs text-text-tertiary mb-1">Portfolio Health</div>
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-accent-emerald">
              {portfolioMetrics.sharpeRatio > 1.5 ? 'Excellent' : portfolioMetrics.sharpeRatio > 1.0 ? 'Good' : 'Needs Attention'}
            </div>
            <Shield size={16} className={portfolioMetrics.sharpeRatio > 1.0 ? 'text-status-safe' : 'text-status-danger'} />
          </div>
        </Card>

        <Card className="bg-background-secondary p-3">
          <div className="text-xs text-text-tertiary mb-1">Risk Level</div>
          <div className="text-lg font-bold text-accent-yellow">
            {portfolioMetrics.volatility > 0.15 ? 'High' : portfolioMetrics.volatility > 0.10 ? 'Medium' : 'Low'}
          </div>
        </Card>

        <Card className="bg-background-secondary p-3">
          <div className="text-xs text-text-tertiary mb-1">Active Alerts</div>
          <div className="text-lg font-bold text-accent-magenta">
            {recommendations.filter(r => r.type === 'warning').length}
          </div>
        </Card>
      </div>
    </div>
  );
}
