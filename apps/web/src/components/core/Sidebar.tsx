'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

interface SectorItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  color: string;
  status: 'active' | 'coming_soon';
}

const SECTORS: SectorItem[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏢',
    path: '/sectors/real-estate',
    color: 'text-accent-magenta',
    status: 'active',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    path: '/sectors/manufacturing',
    color: 'text-accent-cyan',
    status: 'coming_soon',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '💎',
    path: '/sectors/crypto',
    color: 'text-accent-green',
    status: 'coming_soon',
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <aside className="w-64 bg-background-secondary border-r border-border min-h-[calc(100vh-var(--header-height))] flex flex-col p-4 space-y-6">
      {/* Logo/Home */}
      <div>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors group"
        >
          <span className="text-2xl">🚀</span>
          <span className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
            Dashboard
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Sectors Section */}
      <div className="flex-1">
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide px-3 mb-3">
          Sectors
        </h2>

        <div className="space-y-2">
          {SECTORS.map((sector) => {
            const active = isActive(sector.path);

            return (
              <div key={sector.id}>
                {sector.status === 'active' ? (
                  <Link
                    href={sector.path}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                      active
                        ? 'bg-background-tertiary border border-border text-accent-magenta'
                        : 'hover:bg-background-tertiary text-text-primary'
                    )}
                  >
                    <span className="text-lg">{sector.icon}</span>
                    <span className="text-sm font-medium">{sector.name}</span>
                    {active && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-accent-magenta" />
                    )}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-50 cursor-not-allowed">
                    <span className="text-lg">{sector.icon}</span>
                    <span className="text-sm font-medium text-text-tertiary">
                      {sector.name}
                    </span>
                    <span className="ml-auto text-xs text-text-tertiary">Soon</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="px-3 py-2">
          <p className="text-xs text-text-tertiary mb-1">Version</p>
          <p className="text-sm font-semibold text-text-primary">0.1.0</p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-background-tertiary hover:bg-opacity-80 transition-colors text-text-secondary text-sm"
        >
          <span>?</span>
          Help
        </Link>
      </div>
    </aside>
  );
};
