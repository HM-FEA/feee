'use client';

import React from 'react';
import { Bot, Wrench, BarChart, TrendingUp, Newspaper } from 'lucide-react';
import StarfieldBackground from '@/components/background/StarfieldBackground';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

export default function TradingAgentsPage() {
  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <GlobalTopNav />
      <div className="relative z-10 p-6">
        <div className="border-b border-border-primary pb-4 mb-4">
            <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2"><Bot size={24} /> TradingAgents AI</h1>
            <p className="text-sm text-text-secondary">AI-powered analysis for fundamental, technical, and news-based insights.</p>
        </div>

        <div className="max-w-4xl mx-auto mt-10">
            <Card>
                <div className="text-center p-8">
                    <Wrench size={48} className="mx-auto mb-4 text-text-tertiary" />
                    <h2 className="text-xl font-bold text-text-primary mb-2">Feature Under Construction</h2>
                    <p className="text-text-secondary mb-6">The TradingAgents integration is currently in development. This page will soon provide access to a suite of AI-powered analytical tools.</p>
                    
                    <div className="text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-background-secondary p-4 rounded-lg">
                            <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-2"><BarChart size={16}/> Fundamental Analyst</h3>
                            <p className="text-xs text-text-secondary">AI-driven analysis of financial statements, ratios, and company health.</p>
                        </div>
                        <div className="bg-background-secondary p-4 rounded-lg">
                            <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-2"><TrendingUp size={16}/> Technical Analyst</h3>
                            <p className="text-xs text-text-secondary">Automated identification of chart patterns and technical indicators.</p>
                        </div>
                        <div className="bg-background-secondary p-4 rounded-lg">
                            <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-2"><Newspaper size={16}/> News Analyst</h3>
                            <p className="text-xs text-text-secondary">Real-time news sentiment analysis and its impact on market movements.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}