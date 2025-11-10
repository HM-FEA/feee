"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BarChart3, Info, Network as NetworkIcon, Layers, GitBranch } from 'lucide-react';
import { Card, Button, SectionHeader } from '@/components/ui/DesignSystem';
import SupplyChainDiagram, { HBM_SUPPLY_CHAIN } from '@/components/visualization/SupplyChainDiagram';

const ForceNetworkGraph3D = dynamic(() => import('@/components/visualization/ForceNetworkGraph3D'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-accent-cyan animate-pulse">Loading 3D Force Graph...</div>
    </div>
  ),
});

export default function NetworkGraphPage() {
  const [view, setView] = useState<'3d' | 'supply-chain' | 'info'>('3d');

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <SectionHeader
        title="3D Network Graph"
        subtitle="Obsidian-style 4-Level Ontology Visualization: Macro → Sector → Company → Asset"
        icon={<NetworkIcon size={24} />}
        action={
          <div className="flex gap-2">
            <Button
              onClick={() => setView('3d')}
              variant={view === '3d' ? 'primary' : 'secondary'}
              size="sm"
            >
              3D View
            </Button>
            <Button
              onClick={() => setView('supply-chain')}
              variant={view === 'supply-chain' ? 'primary' : 'secondary'}
              size="sm"
            >
              Supply Chain
            </Button>
            <Button
              onClick={() => setView('info')}
              variant={view === 'info' ? 'primary' : 'secondary'}
              size="sm"
            >
              Info
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      {view === '3d' ? (
        <div className="h-[calc(100vh-120px)]">
          <ForceNetworkGraph3D />
        </div>
      ) : view === 'supply-chain' ? (
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <SupplyChainDiagram
            nodes={HBM_SUPPLY_CHAIN.nodes}
            links={HBM_SUPPLY_CHAIN.links}
            title="NVIDIA H100 Supply Chain Analysis"
            description="Critical path analysis of AI accelerator manufacturing dependencies"
          />

          {/* Additional Supply Chain Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch size={18} className="text-red-400" />
                <h3 className="text-base font-semibold text-text-primary">Critical Bottlenecks</h3>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                  <div>
                    <span className="font-semibold text-white">ASML EUV:</span> Monopoly on extreme ultraviolet lithography equipment (18-24 month lead time)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                  <div>
                    <span className="font-semibold text-white">HBM3E Memory:</span> SK Hynix controls 95% of supply (4-6 month lead time)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                  <div>
                    <span className="font-semibold text-white">TSMC CoWoS:</span> Advanced packaging capacity constrained
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={18} className="text-green-400" />
                <h3 className="text-base font-semibold text-text-primary">Economics</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-text-tertiary mb-1">H100 Retail Price</div>
                  <div className="text-xl font-bold text-white">$30,000 - $40,000</div>
                </div>
                <div>
                  <div className="text-text-tertiary mb-1">Manufacturing Cost</div>
                  <div className="text-lg font-semibold text-text-primary">~$3,500</div>
                </div>
                <div>
                  <div className="text-text-tertiary mb-1">Gross Margin</div>
                  <div className="text-lg font-semibold text-green-400">88%+</div>
                </div>
                <div className="pt-2 border-t border-border-primary">
                  <div className="text-text-tertiary mb-1">HBM3E Cost per Unit</div>
                  <div className="text-text-primary">~$1,500 (43% of COGS)</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info size={18} className="text-blue-400" />
                <h3 className="text-base font-semibold text-text-primary">Market Impact</h3>
              </div>
              <div className="space-y-3 text-sm text-text-secondary">
                <div>
                  <div className="font-semibold text-white mb-1">Annual Demand</div>
                  <p>Growing 150% YoY driven by generative AI adoption</p>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Top Customers</div>
                  <ul className="space-y-1">
                    <li>• Microsoft: ~$8B/year</li>
                    <li>• Meta: ~$6B/year</li>
                    <li>• Google: ~$5B/year</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-white mb-1">Supply Risk</div>
                  <p>Geopolitical concentration in Taiwan (TSMC) and Netherlands (ASML)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-accent-cyan" />
                <h3 className="text-base font-semibold text-text-primary">Overview</h3>
              </div>

              <div className="space-y-3 text-sm text-text-secondary">
                <p>
                  The 3D Network Graph visualizes the entire financial ecosystem as an interconnected
                  network of nodes across 4 hierarchical levels.
                </p>
                <p>
                  Each node represents an entity (macro variable, sector, company, or asset), and
                  connections show relationships such as impact, ownership, supply chains, and competition.
                </p>
              </div>
            </Card>

            {/* 4 Levels */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layers size={18} className="text-accent-magenta" />
                <h3 className="text-base font-semibold text-text-primary">4-Level Ontology</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: '#FFD700' }} />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Level 1: Macro Variables</div>
                    <div className="text-xs text-text-tertiary">Global economic indicators (Fed Rate, GDP, Oil, etc.)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: '#00E5FF' }} />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Level 2: Sectors</div>
                    <div className="text-xs text-text-tertiary">Industry categories (Banking, Real Estate, Manufacturing, etc.)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: '#00FF9F' }} />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Level 3: Companies</div>
                    <div className="text-xs text-text-tertiary">Individual corporations with financial data</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: '#C026D3' }} />
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Level 4: Assets</div>
                    <div className="text-xs text-text-tertiary">Specific products, services, or revenue streams</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interaction Guide */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-accent-emerald" />
                <h3 className="text-base font-semibold text-text-primary">How to Use</h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Rotate:</span>
                    <span className="text-text-secondary ml-1">Click and drag to rotate the graph</span>
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
                    <span className="font-semibold text-text-primary">Pan:</span>
                    <span className="text-text-secondary ml-1">Right-click and drag to pan the view</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Hover:</span>
                    <span className="text-text-secondary ml-1">Hover over nodes to see labels</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Click:</span>
                    <span className="text-text-secondary ml-1">Click nodes to view details</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5" />
                  <div>
                    <span className="font-semibold text-text-primary">Filter:</span>
                    <span className="text-text-secondary ml-1">Use level filters to focus on specific layers</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Connection Types */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <NetworkIcon size={18} className="text-accent-magenta" />
                <h3 className="text-base font-semibold text-text-primary">Connection Types</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-0.5" style={{ backgroundColor: '#FFD700' }} />
                  <div className="text-sm">
                    <div className="font-semibold text-text-primary">Impact</div>
                    <div className="text-xs text-text-tertiary">Macro variables affecting sectors</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-0.5" style={{ backgroundColor: '#00FF9F' }} />
                  <div className="text-sm">
                    <div className="font-semibold text-text-primary">Ownership</div>
                    <div className="text-xs text-text-tertiary">Parent-child relationships</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-0.5" style={{ backgroundColor: '#00E5FF' }} />
                  <div className="text-sm">
                    <div className="font-semibold text-text-primary">Supply Chain</div>
                    <div className="text-xs text-text-tertiary">B2B relationships</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#EF4444' }} />
                  <div className="text-sm">
                    <div className="font-semibold text-text-primary">Competition</div>
                    <div className="text-xs text-text-tertiary">Competing companies</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
