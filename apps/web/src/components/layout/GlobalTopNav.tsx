'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Network, Trophy, BookOpen, Zap, Landmark, Bot, BarChart, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { name: 'Platform', href: '/dashboard', icon: Home },
  { name: 'Network', href: '/network-graph', icon: Network },
  { name: 'Globe', href: '/globe', icon: Globe },
  { name: 'Ontology', href: '/ontology', icon: Landmark },
  { name: 'Sim Lab', href: '/simulation', icon: Sparkles },
  { name: 'Simulate', href: '/simulate', icon: Zap },
  { name: 'Arena', href: '/arena', icon: Trophy },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Trading', href: '/trading', icon: BarChart },
];

export function GlobalTopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-border-primary">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-accent-cyan">Nexus-Alpha</h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu Placeholder */}
        <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan flex items-center justify-center">
          <span className="text-xs font-semibold text-accent-cyan">U</span>
        </div>
      </div>
    </nav>
  );
}
