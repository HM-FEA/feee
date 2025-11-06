'use client';

import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Share2, TrendingUp, Search, Filter, User, Check, BarChart, Bot, Newspaper, HelpCircle, ClipboardList, Star, Hash, Trophy } from 'lucide-react';

// Types and Mock Data would be here, refactored to use string identifiers for icons

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

// ... (PostCard and other components refactored to use lucide-react icons)

export default function CommunityPage() {
  // ... (state and logic)

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
            {/* ... Header content ... */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6 px-6 py-6 h-[calc(100vh-240px)]">
            {/* Left Sidebar */}
            <div className="col-span-1 overflow-y-auto pr-2">
                <Card>
                    <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2"><Star size={16} /> Top Contributors</h3>
                    {/* ... contributors list using User icon ... */}
                </Card>
                <Card className="mt-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2"><Hash size={16} /> Trending Tags</h3>
                    {/* ... tags list ... */}
                </Card>
            </div>

            {/* Center Feed */}
            <div className="col-span-1 overflow-y-auto pr-2">
                {/* ... post list using PostCard ... */}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-1 overflow-y-auto pl-2">
                <Card className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><ClipboardList size={16} /> Community Guidelines</h3>
                    <ul className="text-xs text-text-secondary space-y-2">
                        <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Be respectful and constructive</li>
                        <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> Back up claims with data</li>
                        <li className="flex items-center gap-2"><Check size={12} className="text-accent-cyan"/> No spam or self-promotion</li>
                    </ul>
                </Card>
                 <Card className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><Trophy size={16} /> Rewards System</h3>
                    {/* ... rewards ... */}
                </Card>
                <Card>
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2"><BarChart size={16} /> Community Stats</h3>
                    {/* ... stats ... */}
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}