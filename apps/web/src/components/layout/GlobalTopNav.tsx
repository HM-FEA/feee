'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Network, Trophy, BookOpen, Zap, Landmark, Bot, BarChart, Globe, Sparkles, Users, Settings, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home, group: 'core' },
  { name: 'Sim Lab', href: '/simulation', icon: Sparkles, group: 'core' },
  { name: 'Ontology', href: '/ontology', icon: Landmark, group: 'platform' },
  { name: 'Reports', href: '/reports', icon: FileText, group: 'platform' },
  { name: 'Arena', href: '/arena', icon: Trophy, group: 'platform' },
  { name: 'Learn', href: '/learn', icon: BookOpen, group: 'platform' },
  { name: 'Community', href: '/community', icon: Users, group: 'social' },
  { name: 'Admin', href: '/ceo-dashboard', icon: Settings, group: 'admin' },
];

export function GlobalTopNav() {
  const pathname = usePathname();

  // Group navigation items
  const coreItems = mainNavigation.filter(item => item.group === 'core');
  const vizItems = mainNavigation.filter(item => item.group === 'visualization');
  const platformItems = mainNavigation.filter(item => item.group === 'platform');
  const socialItems = mainNavigation.filter(item => item.group === 'social');
  const adminItems = mainNavigation.filter(item => item.group === 'admin');

  const renderNavItems = (items: typeof mainNavigation) => {
    return items.map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
      return (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
            isActive
              ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span className="hidden lg:inline">{item.name}</span>
        </Link>
      );
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-border-primary">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-accent-cyan hidden sm:block">Nexus-Alpha</h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 mx-4">
          {/* Core */}
          <div className="flex items-center gap-1">
            {renderNavItems(coreItems)}
          </div>

          {/* Visualization */}
          {vizItems.length > 0 && (
            <>
              <div className="h-6 w-px bg-border-primary" />
              <div className="flex items-center gap-1">
                {renderNavItems(vizItems)}
              </div>
            </>
          )}

          {/* Platform */}
          {platformItems.length > 0 && (
            <>
              <div className="h-6 w-px bg-border-primary" />
              <div className="flex items-center gap-1">
                {renderNavItems(platformItems)}
              </div>
            </>
          )}

          {/* Social */}
          {socialItems.length > 0 && (
            <>
              <div className="h-6 w-px bg-border-primary" />
              <div className="flex items-center gap-1">
                {renderNavItems(socialItems)}
              </div>
            </>
          )}

          {/* Admin */}
          {adminItems.length > 0 && (
            <>
              <div className="h-6 w-px bg-border-primary" />
              <div className="flex items-center gap-1">
                {renderNavItems(adminItems)}
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-magenta rounded-full"></span>
          </button>

          <Link
            href="/mypage"
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all',
              pathname === '/mypage'
                ? 'bg-gradient-to-br from-accent-cyan to-accent-magenta ring-2 ring-accent-cyan/50'
                : 'bg-gradient-to-br from-accent-cyan/80 to-accent-magenta/80 hover:opacity-80'
            )}
            title="My Page"
          >
            <User className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
