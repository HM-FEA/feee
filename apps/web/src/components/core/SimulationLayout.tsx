'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NewsFeed } from './NewsFeed';
import type { SectorType } from '@/lib/types/common';

interface SimulationLayoutProps {
  sector: SectorType;
  mainContent: ReactNode;
  controls: ReactNode;
  breadcrumbs?: string[];
  tickers?: string[];
}

export const SimulationLayout = ({
  sector,
  mainContent,
  controls,
  breadcrumbs = ['Home', 'Sector'],
  tickers = [],
}: SimulationLayoutProps) => {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* Header - Fixed */}
      <Header breadcrumbs={breadcrumbs} />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Center: Main Visualization */}
          <div className="flex-1 min-h-0">
            <div className="h-full bg-background-secondary border border-border rounded-lg p-6">
              {mainContent}
            </div>
          </div>

          {/* Right: Control Panel */}
          <aside className="w-sidebar flex flex-col gap-4">
            <div className="bg-background-secondary border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Controls
              </h2>
              {controls}
            </div>
          </aside>
        </main>
      </div>

      {/* Bottom: News Feed - Fixed Height, Scrollable */}
      <NewsFeed sector={sector} tickers={tickers} />
    </div>
  );
};
