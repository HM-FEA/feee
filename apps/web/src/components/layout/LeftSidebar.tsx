'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Globe,
  FileText,
  Trophy,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  TrendingUp,
  LineChart,
  Wallet,
} from 'lucide-react';
import NavSection from './NavSection';

interface LeftSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * LeftSidebar - 좌측 메인 네비게이션
 *
 * 기능:
 * - Desktop: 240px → 64px (접기)
 * - Mobile: slide-in overlay
 * - 섹션별 그룹화 (Core, Personal, Platform, Social, System)
 * - Active state 표시
 */
export default function LeftSidebar({ collapsed, onToggleCollapse }: LeftSidebarProps) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      title: 'Core',
      items: [
        { name: 'Home', href: '/', icon: <Home size={20} /> },
        { name: 'Simulation', href: '/simulation', icon: <Sparkles size={20} />, badge: 'New' },
        { name: 'Ontology', href: '/ontology', icon: <Globe size={20} /> },
        { name: 'Reports', href: '/reports', icon: <FileText size={20} /> },
      ],
    },
    {
      title: 'Personal',
      items: [
        { name: 'Portfolio Manager', href: '/portfolio-manager', icon: <Briefcase size={20} />, badge: 'New' },
        { name: 'My Analysis', href: '/my-analysis', icon: <LineChart size={20} /> },
        { name: 'Trading Bots', href: '/trading', icon: <TrendingUp size={20} /> },
        { name: 'Watchlist', href: '/watchlist', icon: <Wallet size={20} /> },
      ],
    },
    {
      title: 'Platform',
      items: [
        { name: 'Arena', href: '/arena', icon: <Trophy size={20} /> },
        { name: 'Learn', href: '/learn', icon: <BookOpen size={20} /> },
      ],
    },
    {
      title: 'Social',
      items: [
        { name: 'Community', href: '/community', icon: <Users size={20} /> },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
        { name: 'Analytics', href: '/ceo-dashboard', icon: <BarChart3 size={20} /> },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-[56px] bottom-0 z-40
        bg-background-primary border-r border-border-primary
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
        flex flex-col
      `}
    >
      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group) => (
          <NavSection
            key={group.title}
            title={group.title}
            items={group.items}
            collapsed={collapsed}
            currentPath={pathname}
          />
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border-primary">
        <button
          onClick={onToggleCollapse}
          className="
            w-full flex items-center justify-center
            py-2 rounded-lg
            text-text-secondary hover:text-text-primary
            hover:bg-background-secondary
            transition-colors
          "
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Footer (when expanded) */}
      {!collapsed && (
        <div className="p-4 border-t border-border-primary">
          <div className="text-xs text-text-tertiary">
            <div className="font-semibold">Nexus-Alpha</div>
            <div className="mt-1">v0.9.0 Beta</div>
          </div>
        </div>
      )}
    </aside>
  );
}
