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
 * - 섹션별 그룹화 (Core, Platform, Social, System)
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
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-background-secondary border-r border-border-primary transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Collapse Toggle */}
        <div className="h-14 flex items-center justify-end px-3 border-b border-border-primary">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded hover:bg-background-tertiary flex items-center justify-center transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={18} className="text-text-tertiary" />
            ) : (
              <ChevronLeft size={18} className="text-text-tertiary" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group, idx) => (
            <NavSection
              key={idx}
              title={group.title}
              items={group.items}
              collapsed={collapsed}
              currentPath={pathname}
            />
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border-primary">
            <div className="text-xs text-text-tertiary text-center">
              Nexus-Alpha v3.0
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar - TODO: Implement slide-in overlay */}
      {/* For now, mobile will use the existing layout */}
    </>
  );
}
