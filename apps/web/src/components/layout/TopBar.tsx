'use client';

import React from 'react';
import { Bell, User, Search } from 'lucide-react';

/**
 * TopBar - 얇은 상단 바
 *
 * 기능:
 * - 브랜딩 (Nexus-Alpha logo)
 * - 검색
 * - 알림
 * - 사용자 프로필
 */
export default function TopBar() {
  return (
    <div className="h-14 bg-background-secondary border-b border-border-primary flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-cyan to-accent-magenta rounded flex items-center justify-center font-bold text-white text-lg">
          N
        </div>
        <span className="text-lg font-bold text-text-primary hidden md:inline">
          Nexus-Alpha
        </span>
        <span className="text-xs text-text-tertiary hidden lg:inline border-l border-border-primary pl-3">
          Financial Simulation Platform
        </span>
      </div>

      {/* Center: Search (Desktop only) */}
      <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search companies, scenarios, reports..."
            className="w-full h-9 pl-10 pr-4 bg-background-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="w-9 h-9 bg-background-tertiary hover:bg-background-secondary border border-border-primary rounded-lg flex items-center justify-center transition-colors relative"
          title="Notifications"
        >
          <Bell size={18} className="text-text-secondary" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-magenta rounded-full"></span>
        </button>

        {/* User Profile */}
        <button
          className="h-9 px-3 bg-background-tertiary hover:bg-background-secondary border border-border-primary rounded-lg flex items-center gap-2 transition-colors"
          title="User Profile"
        >
          <User size={18} className="text-text-secondary" />
          <span className="text-sm text-text-primary hidden md:inline">User</span>
        </button>
      </div>
    </div>
  );
}
