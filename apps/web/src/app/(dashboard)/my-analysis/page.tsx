'use client';

import React, { useState } from 'react';
import { LineChart, TrendingUp, FileText, Target, Sparkles, Calendar, Zap } from 'lucide-react';

/**
 * My Analysis - Personal AI Analyst Dashboard
 *
 * Perplexity Finance-style integrated view:
 * - AI-generated reports
 * - Automated portfolio analysis
 * - Real-time insights
 * - Personalized recommendations
 */

interface AIReport {
  id: string;
  title: string;
  type: 'portfolio' | 'market' | 'company' | 'macro';
  summary: string;
  generatedAt: Date;
  confidence: number;
  sources: number;
}

export default function MyAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | AIReport['type']>('all');

  // Mock AI-generated reports
  const aiReports: AIReport[] = [
    {
      id: '1',
      title: 'Portfolio Health Check: Strong Performance This Quarter',
      type: 'portfolio',
      summary: 'Your portfolio returned +12.4% YTD, outperforming S&P 500 by 340bps. Tech allocation (35%) is driving returns. Consider rebalancing into value sectors.',
      generatedAt: new Date('2025-11-13T08:00:00'),
      confidence: 0.92,
      sources: 15,
    },
    {
      id: '2',
      title: 'NVIDIA: AI Demand Surge Expected in Q1 2025',
      type: 'company',
      summary: 'Hyperscaler CapEx up 42% YoY. H100/H200 demand exceeds supply by 3x. Price target raised to $580 (+19% upside). Buy rating maintained.',
      generatedAt: new Date('2025-11-13T07:30:00'),
      confidence: 0.88,
      sources: 23,
    },
    {
      id: '3',
      title: 'Fed Rate Cut Probability: 65% by March 2025',
      type: 'macro',
      summary: 'Core PCE trending down to 2.8%. Labor market cooling (unemployment 3.9%). Fed fund futures pricing 50bps cut Q1. Bullish for growth stocks.',
      generatedAt: new Date('2025-11-13T06:00:00'),
      confidence: 0.78,
      sources: 31,
    },
    {
      id: '4',
      title: 'Semiconductor Sector: Supply Chain Bottlenecks Easing',
      type: 'market',
      summary: 'HBM3E supply up 40% QoQ. TSMC CoWoS capacity increased by 60%. Lead times down from 52 to 38 weeks. Margin expansion expected.',
      generatedAt: new Date('2025-11-12T18:00:00'),
      confidence: 0.85,
      sources: 19,
    },
    {
      id: '5',
      title: 'Your Watchlist: 3 Stocks Hit Buy Signals',
      type: 'portfolio',
      summary: 'NVDA, AMD, and TSMC triggered technical buy signals (RSI < 30, MACD crossover). Combined upside potential: +28%. Suggested allocation: 15% of cash.',
      generatedAt: new Date('2025-11-12T16:00:00'),
      confidence: 0.81,
      sources: 12,
    },
  ];

  const filteredReports = activeFilter === 'all'
    ? aiReports
    : aiReports.filter(r => r.type === activeFilter);

  const getTypeColor = (type: AIReport['type']) => {
    const colors = {
      portfolio: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
      market: 'bg-status-safe/20 text-status-safe border-status-safe/30',
      company: 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta/30',
      macro: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
    };
    return colors[type];
  };

  const getTypeLabel = (type: AIReport['type']) => {
    const labels = {
      portfolio: 'Portfolio',
      market: 'Market',
      company: 'Company',
      macro: 'Macro',
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="bg-background-secondary border-b border-border-primary">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={32} className="text-accent-cyan" />
            <h1 className="text-3xl font-bold text-text-primary">My Analysis</h1>
          </div>
          <p className="text-text-secondary">
            AI-powered insights, automated reports, and personalized recommendations
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-text-tertiary text-sm">AI Reports Today</div>
              <Sparkles size={16} className="text-accent-cyan" />
            </div>
            <div className="text-2xl font-bold text-text-primary">5</div>
            <div className="text-status-safe text-xs mt-1">+2 from yesterday</div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-text-tertiary text-sm">Avg Confidence</div>
              <Target size={16} className="text-status-safe" />
            </div>
            <div className="text-2xl font-bold text-text-primary">85%</div>
            <div className="text-text-tertiary text-xs mt-1">High accuracy</div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-text-tertiary text-sm">Data Sources</div>
              <FileText size={16} className="text-accent-magenta" />
            </div>
            <div className="text-2xl font-bold text-text-primary">100+</div>
            <div className="text-text-tertiary text-xs mt-1">Real-time feeds</div>
          </div>
          <div className="bg-background-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-text-tertiary text-sm">Portfolio Score</div>
              <TrendingUp size={16} className="text-status-safe" />
            </div>
            <div className="text-2xl font-bold text-status-safe">92/100</div>
            <div className="text-status-safe text-xs mt-1">Excellent</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-accent-cyan text-black'
                : 'bg-background-secondary text-text-tertiary hover:text-text-primary border border-border-secondary'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setActiveFilter('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'portfolio'
                ? 'bg-accent-cyan text-black'
                : 'bg-background-secondary text-text-tertiary hover:text-text-primary border border-border-secondary'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveFilter('market')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'market'
                ? 'bg-accent-cyan text-black'
                : 'bg-background-secondary text-text-tertiary hover:text-text-primary border border-border-secondary'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveFilter('company')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'company'
                ? 'bg-accent-cyan text-black'
                : 'bg-background-secondary text-text-tertiary hover:text-text-primary border border-border-secondary'
            }`}
          >
            Company
          </button>
          <button
            onClick={() => setActiveFilter('macro')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeFilter === 'macro'
                ? 'bg-accent-cyan text-black'
                : 'bg-background-secondary text-text-tertiary hover:text-text-primary border border-border-secondary'
            }`}
          >
            Macro
          </button>
        </div>

        {/* AI Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-background-secondary border border-border-primary rounded-lg p-6 hover:border-accent-cyan/50 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(report.type)}`}>
                      {getTypeLabel(report.type)}
                    </span>
                    <div className="flex items-center gap-1 text-text-tertiary text-xs">
                      <Calendar size={12} />
                      <span>{new Date(report.generatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">{report.title}</h3>
                  <p className="text-text-secondary text-sm">{report.summary}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border-secondary">
                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <div className="flex items-center gap-1">
                    <Target size={12} />
                    <span>Confidence: {(report.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText size={12} />
                    <span>{report.sources} sources</span>
                  </div>
                </div>
                <button className="text-accent-cyan hover:text-accent-cyan/80 text-sm font-medium">
                  View Full Report →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Generation Notice */}
        <div className="mt-8 bg-background-secondary border border-border-secondary rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap size={20} className="text-accent-cyan mt-0.5" />
            <div>
              <div className="font-medium text-text-primary mb-1">Powered by AI Analysts</div>
              <div className="text-text-secondary text-sm">
                Reports are automatically generated using real-time market data, your portfolio holdings,
                and macroeconomic indicators. New insights are generated every 2 hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
