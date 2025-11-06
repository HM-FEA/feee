'use client';

import React, { useState, useMemo } from 'react';
import { Globe as GlobeIcon, Building2, MapPin, DollarSign, Link2, TrendingUp, TrendingDown, ChevronRight, Info, Zap, Database, Home } from 'lucide-react';

// Types
interface AssetNode {
  id: string;
  name: string;
  type: 'company' | 'property' | 'datacenter' | 'revenue_stream' | 'location';
  region: string;
  value?: number;
  description: string;
  coordinates?: { lat: number; lon: number };
  parent?: string;
}

interface Relationship {
  id: string;
  from: string;
  to: string;
  type: 'owns' | 'revenue' | 'supplies' | 'located_at' | 'investment';
  value: number;
  change: number;
  label: string;
}

// Mock Data - Detailed asset relationships
const ASSET_NODES: AssetNode[] = [
  // Companies
  { id: 'iron_mountain', name: 'Iron Mountain', type: 'company', region: 'United States', value: 15200, description: 'Data storage and management services' },
  { id: 'equinix', name: 'Equinix', type: 'company', region: 'United States', value: 28500, description: 'Digital infrastructure company' },
  { id: 'prologis', name: 'Prologis', type: 'company', region: 'United States', value: 45600, description: 'Logistics real estate' },

  // Iron Mountain Assets
  { id: 'im_dc_virginia', name: 'Northern Virginia Data Center', type: 'datacenter', region: 'Virginia, US', value: 450, description: 'Primary data center facility', coordinates: { lat: 38.9072, lon: -77.0369 }, parent: 'iron_mountain' },
  { id: 'im_dc_texas', name: 'Dallas-Fort Worth Data Center', type: 'datacenter', region: 'Texas, US', value: 380, description: 'Secondary data center', coordinates: { lat: 32.7767, lon: -96.7970 }, parent: 'iron_mountain' },
  { id: 'im_revenue_storage', name: 'Data Storage Revenue', type: 'revenue_stream', region: 'Global', value: 3200, description: 'Annual storage services revenue', parent: 'iron_mountain' },
  { id: 'im_revenue_cloud', name: 'Cloud Services Revenue', type: 'revenue_stream', region: 'Global', value: 1800, description: 'Cloud migration services', parent: 'iron_mountain' },

  // Equinix Assets
  { id: 'eq_dc_silicon', name: 'Silicon Valley Campus', type: 'datacenter', region: 'California, US', value: 890, description: 'Flagship interconnection hub', coordinates: { lat: 37.3688, lon: -122.0363 }, parent: 'equinix' },
  { id: 'eq_property_london', name: 'London LD7 Facility', type: 'property', region: 'London, UK', value: 620, description: 'International exchange point', coordinates: { lat: 51.5074, lon: -0.1278 }, parent: 'equinix' },
  { id: 'eq_revenue_colocation', name: 'Colocation Revenue', type: 'revenue_stream', region: 'Global', value: 5600, description: 'Data center colocation services', parent: 'equinix' },

  // Prologis Assets
  { id: 'pr_warehouse_nj', name: 'New Jersey Distribution Hub', type: 'property', region: 'New Jersey, US', value: 280, description: '1.2M sq ft logistics facility', coordinates: { lat: 40.0583, lon: -74.4057 }, parent: 'prologis' },
  { id: 'pr_warehouse_ca', name: 'Southern California Logistics', type: 'property', region: 'California, US', value: 340, description: 'Port-adjacent warehouse', coordinates: { lat: 33.7701, lon: -118.1937 }, parent: 'prologis' },
  { id: 'pr_revenue_rent', name: 'Rental Income', type: 'revenue_stream', region: 'Global', value: 4200, description: 'Warehouse rental income', parent: 'prologis' },
];

const RELATIONSHIPS: Relationship[] = [
  { id: 'r1', from: 'iron_mountain', to: 'im_dc_virginia', type: 'owns', value: 450, change: 2.3, label: 'Owns & Operates' },
  { id: 'r2', from: 'iron_mountain', to: 'im_dc_texas', type: 'owns', value: 380, change: 1.8, label: 'Owns & Operates' },
  { id: 'r3', from: 'im_dc_virginia', to: 'im_revenue_storage', type: 'revenue', value: 2100, change: 5.2, label: 'Generates $2.1B' },
  { id: 'r4', from: 'im_dc_texas', to: 'im_revenue_storage', type: 'revenue', value: 1100, change: 4.8, label: 'Generates $1.1B' },
  { id: 'r5', from: 'im_dc_virginia', to: 'im_revenue_cloud', type: 'revenue', value: 1200, change: 8.5, label: 'Cloud Services $1.2B' },
  { id: 'r6', from: 'im_dc_texas', to: 'im_revenue_cloud', type: 'revenue', value: 600, change: 7.2, label: 'Cloud Services $0.6B' },

  { id: 'r7', from: 'equinix', to: 'eq_dc_silicon', type: 'owns', value: 890, change: 3.5, label: 'Owns & Operates' },
  { id: 'r8', from: 'equinix', to: 'eq_property_london', type: 'owns', value: 620, change: 2.1, label: 'Owns & Operates' },
  { id: 'r9', from: 'eq_dc_silicon', to: 'eq_revenue_colocation', type: 'revenue', value: 3200, change: 6.3, label: 'Generates $3.2B' },
  { id: 'r10', from: 'eq_property_london', to: 'eq_revenue_colocation', type: 'revenue', value: 2400, change: 5.8, label: 'Generates $2.4B' },

  { id: 'r11', from: 'prologis', to: 'pr_warehouse_nj', type: 'owns', value: 280, change: 1.9, label: 'Owns Property' },
  { id: 'r12', from: 'prologis', to: 'pr_warehouse_ca', type: 'owns', value: 340, change: 2.5, label: 'Owns Property' },
  { id: 'r13', from: 'pr_warehouse_nj', to: 'pr_revenue_rent', type: 'revenue', value: 1800, change: 4.2, label: 'Rental Income $1.8B' },
  { id: 'r14', from: 'pr_warehouse_ca', to: 'pr_revenue_rent', type: 'revenue', value: 2400, change: 4.8, label: 'Rental Income $2.4B' },
];

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

const NodeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'company': return <Building2 size={16} className="text-accent-cyan" />;
    case 'datacenter': return <Database size={16} className="text-accent-magenta" />;
    case 'property': return <Home size={16} className="text-accent-emerald" />;
    case 'revenue_stream': return <DollarSign size={16} className="text-yellow-400" />;
    default: return <MapPin size={16} className="text-text-tertiary" />;
  }
};

export default function GlobePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>('iron_mountain');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  // Get related nodes and relationships for selected node
  const relatedData = useMemo(() => {
    if (!selectedNode) return { nodes: [], relationships: [] };

    const directRelationships = RELATIONSHIPS.filter(r => r.from === selectedNode || r.to === selectedNode);
    const relatedNodeIds = new Set<string>();
    directRelationships.forEach(r => {
      relatedNodeIds.add(r.from);
      relatedNodeIds.add(r.to);
    });

    // Add children
    const children = ASSET_NODES.filter(n => n.parent === selectedNode);
    children.forEach(c => relatedNodeIds.add(c.id));

    const nodes = ASSET_NODES.filter(n => relatedNodeIds.has(n.id));

    return { nodes, relationships: directRelationships };
  }, [selectedNode]);

  const selectedNodeData = ASSET_NODES.find(n => n.id === selectedNode);
  const companies = ASSET_NODES.filter(n => n.type === 'company');

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2 mb-1">
                <GlobeIcon size={24} />
                Asset Relationship Graph
              </h1>
              <p className="text-sm text-text-secondary">
                Explore company assets, properties, and revenue streams with Obsidian-style relationship mapping
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('graph')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'graph' ? 'bg-accent-cyan text-black' : 'bg-background-secondary text-text-secondary'
                }`}
              >
                Graph View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' ? 'bg-accent-cyan text-black' : 'bg-background-secondary text-text-secondary'
                }`}
              >
                List View
              </button>
            </div>
          </div>

          {/* Company Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {companies.map(company => (
              <button
                key={company.id}
                onClick={() => setSelectedNode(company.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedNode === company.id
                    ? 'bg-accent-cyan text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                <Building2 size={16} />
                {company.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-4 gap-6 px-6 py-6 h-[calc(100vh-220px)]">
          {/* Left Sidebar - Selected Node Details */}
          <div className="col-span-1 overflow-y-auto pr-2 space-y-4">
            {selectedNodeData && (
              <>
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <NodeIcon type={selectedNodeData.type} />
                    <h3 className="text-sm font-semibold text-text-primary">{selectedNodeData.name}</h3>
                  </div>
                  <p className="text-xs text-text-secondary mb-3">{selectedNodeData.description}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Type</span>
                      <span className="font-semibold text-text-primary capitalize">{selectedNodeData.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Region</span>
                      <span className="font-semibold text-text-primary">{selectedNodeData.region}</span>
                    </div>
                    {selectedNodeData.value && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Value</span>
                        <span className="font-semibold text-accent-cyan">${selectedNodeData.value}M</span>
                      </div>
                    )}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Link2 size={16} />
                    Connected Assets ({relatedData.nodes.length})
                  </h3>
                  <div className="space-y-2">
                    {relatedData.nodes.slice(0, 8).map(node => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node.id)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <NodeIcon type={node.type} />
                          <span className="text-xs font-medium text-text-primary">{node.name}</span>
                        </div>
                        <span className="text-xs text-text-tertiary">{node.region}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Info size={16} />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-text-secondary mb-1">Total Assets</div>
                      <div className="text-lg font-bold text-accent-cyan">{relatedData.nodes.filter(n => n.type !== 'company').length}</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">Relationships</div>
                      <div className="text-lg font-bold text-text-primary">{relatedData.relationships.length}</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-secondary mb-1">Total Value</div>
                      <div className="text-lg font-bold text-status-safe">
                        ${relatedData.nodes.reduce((sum, n) => sum + (n.value || 0), 0)}M
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Center - Relationship Graph Visualization */}
          <div className="col-span-2 overflow-y-auto pr-2">
            <Card className="h-full">
              {viewMode === 'graph' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <Link2 size={20} />
                      Asset Relationship Map
                    </h2>
                  </div>

                  {/* Graph Visualization Area */}
                  <div className="w-full h-[calc(100%-60px)] flex items-center justify-center bg-gradient-to-br from-accent-cyan/5 to-accent-magenta/5 rounded-lg border border-border-primary relative">
                    {selectedNodeData && (
                      <div className="absolute inset-0 p-8 overflow-hidden">
                        {/* Central Node */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="bg-accent-cyan/20 border-2 border-accent-cyan rounded-xl p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <NodeIcon type={selectedNodeData.type} />
                              <span className="text-sm font-bold text-accent-cyan">{selectedNodeData.name}</span>
                            </div>
                            <span className="text-xs text-text-secondary">${selectedNodeData.value}M</span>
                          </div>
                        </div>

                        {/* Connected Nodes in Circle */}
                        {relatedData.nodes.filter(n => n.id !== selectedNode).map((node, index, arr) => {
                          const angle = (index / arr.length) * 2 * Math.PI;
                          const radius = 180;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;

                          return (
                            <div
                              key={node.id}
                              className="absolute top-1/2 left-1/2 cursor-pointer hover:scale-110 transition-transform"
                              style={{
                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                              }}
                              onClick={() => setSelectedNode(node.id)}
                            >
                              <div className="bg-[#0D0D0F] border border-[#1A1A1F] hover:border-accent-magenta rounded-lg p-3 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <NodeIcon type={node.type} />
                                  <span className="text-xs font-medium text-text-primary">{node.name}</span>
                                </div>
                                {node.value && (
                                  <span className="text-xs text-text-secondary">${node.value}M</span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Connection Lines (SVG) */}
                        <svg className="absolute inset-0 pointer-events-none">
                          {relatedData.relationships.map((rel, index) => {
                            const sourceNode = relatedData.nodes.find(n => n.id === rel.from);
                            const targetNode = relatedData.nodes.find(n => n.id === rel.to);

                            if (!sourceNode || !targetNode) return null;

                            const isSource = rel.from === selectedNode;
                            const startX = '50%';
                            const startY = '50%';

                            const targetIndex = relatedData.nodes.filter(n => n.id !== selectedNode).indexOf(targetNode);
                            if (targetIndex === -1) return null;

                            const totalNodes = relatedData.nodes.filter(n => n.id !== selectedNode).length;
                            const angle = (targetIndex / totalNodes) * 2 * Math.PI;
                            const radius = 180;
                            const endX = `calc(50% + ${Math.cos(angle) * radius}px)`;
                            const endY = `calc(50% + ${Math.sin(angle) * radius}px)`;

                            return (
                              <line
                                key={rel.id}
                                x1={startX}
                                y1={startY}
                                x2={endX}
                                y2={endY}
                                stroke={rel.type === 'revenue' ? '#06B6D4' : '#C026D3'}
                                strokeWidth="2"
                                strokeDasharray={rel.type === 'owns' ? '5,5' : '0'}
                                opacity="0.3"
                              />
                            );
                          })}
                        </svg>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // List View
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">All Assets</h2>
                  {ASSET_NODES.map(node => (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedNode === node.id
                          ? 'bg-accent-cyan/20 border border-accent-cyan'
                          : 'bg-background-secondary hover:bg-background-tertiary border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <NodeIcon type={node.type} />
                          <div>
                            <h3 className="text-sm font-semibold text-text-primary">{node.name}</h3>
                            <p className="text-xs text-text-secondary mt-1">{node.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                              <span>{node.region}</span>
                              {node.value && <span className="text-accent-cyan">${node.value}M</span>}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-tertiary" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar - Relationships */}
          <div className="col-span-1 overflow-y-auto pr-2 space-y-3">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Zap size={16} />
                Active Relationships ({relatedData.relationships.length})
              </h3>
            </div>

            {relatedData.relationships.map(rel => {
              const fromNode = ASSET_NODES.find(n => n.id === rel.from);
              const toNode = ASSET_NODES.find(n => n.id === rel.to);
              const isPositive = rel.change >= 0;

              return (
                <Card key={rel.id} className="hover:border-[#2A2A3F] transition-all">
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block mb-2 ${
                    rel.type === 'revenue' ? 'bg-blue-500/20 text-blue-400' :
                    rel.type === 'owns' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {rel.type.charAt(0).toUpperCase() + rel.type.slice(1)}
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-text-secondary mb-1">From: {fromNode?.name}</div>
                    <div className="text-xs text-text-secondary">To: {toNode?.name}</div>
                  </div>
                  <div className="text-xs font-medium text-accent-cyan mb-2">{rel.label}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">Change</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      isPositive ? 'text-status-safe' : 'text-status-danger'
                    }`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isPositive ? '+' : ''}{rel.change}%
                    </span>
                  </div>
                </Card>
              );
            })}

            {relatedData.relationships.length === 0 && (
              <Card className="text-center py-8">
                <Link2 size={32} className="mx-auto mb-2 text-text-tertiary opacity-50" />
                <p className="text-xs text-text-secondary">No relationships found</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
