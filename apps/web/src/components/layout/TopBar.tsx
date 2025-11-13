'use client';

import React from 'react';
import { Bell, User, Search } from 'lucide-react';

/**
 * TopBar - Thin, wide global header
 *
 * Design: Thinner (40px) and more horizontal/wide aesthetic
 * Features:
 * - Branding (Nexus-Alpha logo)
 * - Search (wider, more prominent)
 * - Notifications
 * - User profile
 */
export default function TopBar() {
  return (
    <div className="h-10 bg-background-secondary border-b border-border-primary flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gradient-to-br from-accent-cyan to-accent-magenta rounded flex items-center justify-center font-bold text-white text-base">
          N
        </div>
        <span className="text-base font-bold text-text-primary hidden md:inline">
          Nexus-Alpha
        </span>
        <span className="text-[10px] text-text-tertiary hidden lg:inline border-l border-border-primary pl-2.5 ml-1">
          Financial Simulation Platform
        </span>
      </div>

      {/* Center: Search (Desktop only) - Wider */}
      <div className="hidden lg:flex flex-1 max-w-3xl mx-12">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search companies, scenarios, reports..."
            className="w-full h-8 pl-9 pr-4 bg-background-tertiary border border-border-primary rounded-md text-xs text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="w-8 h-8 bg-background-tertiary hover:bg-background-secondary border border-border-primary rounded-md flex items-center justify-center transition-colors relative"
          title="Notifications"
        >
          <Bell size={16} className="text-text-secondary" />
          {/* Notification badge */}
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-accent-magenta rounded-full"></span>
        </button>

        {/* User Profile */}
        <button
          className="h-8 px-2.5 bg-background-tertiary hover:bg-background-secondary border border-border-primary rounded-md flex items-center gap-1.5 transition-colors"
          title="User Profile"
        >
          <User size={16} className="text-text-secondary" />
          <span className="text-xs text-text-primary hidden md:inline">User</span>
        </button>
      </div>
    </div>
  );
}
