'use client';

import Link from 'next/link';
import { ChevronRight, User } from 'lucide-react';

interface HeaderProps {
  breadcrumbs: string[];
}

export const Header = ({ breadcrumbs }: HeaderProps) => {
  return (
    <header className="bg-background-secondary border-b border-border px-8 py-4 h-header sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-accent-cyan hover:opacity-80 transition-opacity">
            Nexus-Alpha
          </Link>

          <nav className="flex items-center gap-2 text-text-secondary">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight size={16} />}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'text-text-primary'
                      : 'hover:text-text-primary cursor-pointer transition-colors'
                  }
                >
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
            aria-label="User menu"
          >
            <User size={20} className="text-text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
