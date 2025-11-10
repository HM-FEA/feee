"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Globe as GlobeIcon, Info, MapPin, TrendingUp } from 'lucide-react';

const Globe3D = dynamic(() => import('@/components/visualization/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-accent-cyan animate-pulse">Loading 3D Globe...</div>
    </div>
  ),
});

export default function GlobePage() {
  const [view, setView] = useState<'globe' | 'info'>('globe');

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      {/* Header */}
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-light text-accent-cyan mb-1 flex items-center gap-2">
              <GlobeIcon size={24} />
              Global Capital Flow
            </h1>
            <p className="text-sm text-text-secondary font-light">
              Visualize M2 money supply and capital flows across major economies
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView('globe')}
              className={`px-4 py-2 rounded-lg text-xs transition-all ${
                view === 'globe'
                  ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/50'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              Globe View
            </button>
            <button
              onClick={() => setView('info')}
              className={`px-4 py-2 rounded-lg text-xs transition-all ${
                view === 'info'
                  ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/50'
                  : 'bg-background-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              Info
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'globe' ? (
        <div className="h-[calc(100vh-120px)]">
          <Globe3D />
        </div>
      ) : (
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview */}
            <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <GlobeIcon size={18} className="text-accent-cyan" />
                <h3 className="text-base font-semibold text-text-primary">Overview</h3>
              </div>

              <div className="space-y-3 text-sm text-text-secondary">
                <p>
                  The 3D Globe visualizes global monetary systems and capital flows in real-time.
                  See how M2 money supply varies across countries and track international capital movements.
                </p>
                <p>
                  Interactive arcs show billions of dollars flowing between major economies,
                  revealing the interconnected nature of global finance.
                </p>
              </div>
            </div>

            {/* View Modes */}
            <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-accent-magenta" />
                <h3 className="text-base font-semibold text-text-primary">View Modes</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1 shadow-lg" style={{ backgroundColor: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }} />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">M2 Supply Mode</div>
                    <div className="text-xs text-text-tertiary">View money supply by country. Point size represents total M2.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-accent-magenta to-transparent mt-2" />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Capital Flows Mode</div>
                    <div className="text-xs text-text-tertiary">See animated arcs showing international capital movements.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction Guide */}
            <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-accent-emerald" />
                <h3 className="text-base font-semibold text-text-primary">How to Use</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Rotate:</span>
                    <span className="text-text-secondary ml-1">Click and drag to rotate the globe</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Zoom:</span>
                    <span className="text-text-secondary ml-1">Scroll to zoom in/out</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Click Country:</span>
                    <span className="text-text-secondary ml-1">Click a point to see country details</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Auto Rotate:</span>
                    <span className="text-text-secondary ml-1">Toggle automatic globe rotation</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Reset View:</span>
                    <span className="text-text-secondary ml-1">Return to default camera position</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-accent-emerald" />
                <h3 className="text-base font-semibold text-text-primary">Key Metrics</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-text-tertiary mb-1">M2 Money Supply</div>
                  <div className="text-sm text-text-secondary">
                    Total broad money supply including cash, checking deposits, and easily convertible near money.
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-tertiary mb-1">M2/GDP Ratio</div>
                  <div className="text-sm text-text-secondary">
                    Measures liquidity in the economy. Higher ratio may indicate loose monetary policy.
                  </div>
                </div>

                <div>
                  <div className="text-xs text-text-tertiary mb-1">Capital Flows</div>
                  <div className="text-sm text-text-secondary">
                    Cross-border investment and trade flows between major economies.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
