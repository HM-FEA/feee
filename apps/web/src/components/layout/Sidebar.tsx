'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, Globe, Home, Network, Settings, Users, Bell, GitCompareArrows, BrainCircuit, Smile, History, BookOpen, Trophy, Zap, Landmark, Bot } from 'lucide-react';

import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Network Graph', href: '/network-graph', icon: Network },
  { name: 'Globe', href: '/globe', icon: Globe },
  { name: 'CEO Dashboard', href: '/ceo-dashboard', icon: BarChart },
  { name: 'Community', href: '/community', icon: Users },
];

const platform = [
  { name: 'Ontology', href: '/ontology', icon: Landmark },
  { name: 'Simulate', href: '/simulate', icon: Zap },
  { name: 'Arena', href: '/arena', icon: Trophy },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Trading AI', href: '/trading-agents', icon: Bot },
];

const analysisTools = [
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Compare', href: '/compare', icon: GitCompareArrows },
    { name: 'Predict', href: '/predict', icon: BrainCircuit },
    { name: 'Sentiment', href: '/sentiment', icon: Smile },
    { name: 'Backtest', href: '/backtest', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black border-r border-[#1A1A1F] px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-[#1A1A1F]">
          <h1 className="text-2xl font-bold text-accent-cyan">Nexus-Alpha</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-text-tertiary uppercase tracking-wider">Main</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary hover:bg-[#0D0D0F]',
                        'group flex gap-x-3 rounded-r-md p-2 text-sm leading-6 font-medium transition-all'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-text-tertiary uppercase tracking-wider">Platform</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {platform.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary hover:bg-[#0D0D0F]',
                        'group flex gap-x-3 rounded-r-md p-2 text-sm leading-6 font-medium transition-all'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-text-tertiary uppercase tracking-wider">Analysis Tools</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {analysisTools.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan'
                          : 'text-text-secondary hover:text-text-primary hover:bg-[#0D0D0F]',
                        'group flex gap-x-3 rounded-r-md p-2 text-sm leading-6 font-medium transition-all'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto border-t border-[#1A1A1F] pt-4">
              <Link
                href="/settings"
                className="group -mx-2 flex gap-x-3 rounded-r-md p-2 text-sm font-medium leading-6 text-text-secondary hover:bg-[#0D0D0F] hover:text-text-primary transition-all"
              >
                <Settings className="h-5 w-5 shrink-0" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}