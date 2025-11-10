'use client';

import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { companies } from '@/data/companies';
import { MACRO_CATEGORIES } from '@/data/macroVariables';
import { useMacroStore } from '@/lib/store/macroStore';

// Dynamic import to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface GraphNode {
  id: string;
  name: string;
  level: 'macro' | 'sector' | 'company';
  sector?: string;
  category?: string;
  val: number; // Node size
  color: string;
  data?: any;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'impact' | 'supply' | 'ownership' | 'loan' | 'competition';
  strength: number;
  color?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Level colors - Bloomberg style
const LEVEL_COLORS = {
  macro: '#FFD700',      // Gold
  sector: '#00E5FF',     // Cyan
  company: '#00FF9F',    // Emerald
};

const SECTOR_COLORS: Record<string, string> = {
  BANKING: '#06B6D4',
  REALESTATE: '#00FF9F',
  MANUFACTURING: '#8B5CF6',
  SEMICONDUCTOR: '#F59E0B',
};

// Generate graph data with 4-level ontology
function generateGraphData(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Level 1: Macro Variables (6 key categories)
  const macroCategories = [
    'MONETARY_POLICY',
    'LIQUIDITY',
    'ECONOMIC_GROWTH',
    'COMMODITIES',
    'MARKET_SENTIMENT',
    'TECH_INNOVATION'
  ];

  macroCategories.forEach(category => {
    const categoryData = MACRO_CATEGORIES[category];
    if (categoryData) {
      nodes.push({
        id: `macro-${category}`,
        name: categoryData.label,
        level: 'macro',
        category,
        val: 30,
        color: LEVEL_COLORS.macro,
        data: { icon: categoryData.icon, category }
      });
    }
  });

  // Level 2: Sectors (4 main sectors)
  const sectors = ['BANKING', 'REALESTATE', 'MANUFACTURING', 'SEMICONDUCTOR'];
  sectors.forEach(sector => {
    nodes.push({
      id: `sector-${sector}`,
      name: sector,
      level: 'sector',
      sector,
      val: 20,
      color: SECTOR_COLORS[sector] || LEVEL_COLORS.sector,
      data: { sector }
    });

    // Connect macro to sectors (impact relationships)
    if (sector === 'BANKING' || sector === 'REALESTATE') {
      links.push({
        source: 'macro-MONETARY_POLICY',
        target: `sector-${sector}`,
        type: 'impact',
        strength: 5,
        color: 'rgba(255, 215, 0, 0.3)'
      });
    }
    if (sector === 'MANUFACTURING') {
      links.push({
        source: 'macro-COMMODITIES',
        target: `sector-${sector}`,
        type: 'impact',
        strength: 4,
        color: 'rgba(139, 92, 246, 0.3)'
      });
    }
    if (sector === 'SEMICONDUCTOR') {
      links.push({
        source: 'macro-TECH_INNOVATION',
        target: `sector-${sector}`,
        type: 'impact',
        strength: 4,
        color: 'rgba(245, 158, 11, 0.3)'
      });
    }
  });

  // Level 3: Companies (top 23 companies)
  const companySample = companies.slice(0, 23);
  companySample.forEach(company => {
    nodes.push({
      id: `company-${company.ticker}`,
      name: company.ticker,
      level: 'company',
      sector: company.sector,
      val: 10,
      color: SECTOR_COLORS[company.sector] || LEVEL_COLORS.company,
      data: company
    });

    // Connect to sector
    links.push({
      source: `sector-${company.sector}`,
      target: `company-${company.ticker}`,
      type: 'ownership',
      strength: 2,
      color: 'rgba(0, 255, 159, 0.2)'
    });
  });

  // Add supply chain relationships (example: Samsung -> SK Hynix)
  const supplyChainPairs = [
    ['005930', '000660'], // Samsung -> SK Hynix
    ['066570', '035720'], // LG전자 -> Kakao
    ['000660', '000270'], // SK Hynix -> Kia
  ];

  supplyChainPairs.forEach(([from, to]) => {
    const fromCompany = companySample.find(c => c.ticker === from);
    const toCompany = companySample.find(c => c.ticker === to);
    if (fromCompany && toCompany) {
      links.push({
        source: `company-${from}`,
        target: `company-${to}`,
        type: 'supply',
        strength: 1,
        color: 'rgba(0, 229, 255, 0.4)'
      });
    }
  });

  // Add loan relationships (Banks -> Companies)
  const bankingCompanies = companySample.filter(c => c.sector === 'BANKING');
  const nonBankingCompanies = companySample.filter(c => c.sector !== 'BANKING').slice(0, 8);

  bankingCompanies.forEach((bank, idx) => {
    // Each bank lends to 2-3 companies
    const startIdx = idx * 2;
    nonBankingCompanies.slice(startIdx, startIdx + 3).forEach(company => {
      links.push({
        source: `company-${bank.ticker}`,
        target: `company-${company.ticker}`,
        type: 'loan',
        strength: 1.5,
        color: 'rgba(255, 215, 0, 0.35)'
      });
    });
  });

  // Add competition relationships (same sector companies)
  const competitionPairs = [
    ['005930', '000660'], // Samsung vs SK Hynix (Semiconductor)
    ['086790', '035420'], // KB Financial vs Shinhan (Banking)
    ['051910', '034730'], // LG Chem vs SK (Manufacturing)
  ];

  competitionPairs.forEach(([from, to]) => {
    const company1 = companySample.find(c => c.ticker === from);
    const company2 = companySample.find(c => c.ticker === to);
    if (company1 && company2) {
      links.push({
        source: `company-${from}`,
        target: `company-${to}`,
        type: 'competition',
        strength: 0.8,
        color: 'rgba(239, 68, 68, 0.4)'
      });
    }
  });

  return { nodes, links };
}

export default function ForceNetworkGraph3D() {
  const fgRef = useRef<any>();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterLevel, setFilterLevel] = useState<'all' | 'macro' | 'sector' | 'company'>('all');
  const [highlightNodes, setHighlightNodes] = useState(new Set<string>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<GraphLink>());
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  const calculatedImpacts = useMacroStore(state => state.calculatedImpacts);

  useEffect(() => {
    const data = generateGraphData();
    setGraphData(data);
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(100);

      // Add radial positioning force for better clustering
      fgRef.current.d3Force('radial', null);

      // Add collision force to prevent overlapping
      fgRef.current.d3Force('collision',
        fgRef.current.d3Force('charge').strength(-50).radius(20)
      );

      // Group nodes by level in concentric circles
      fgRef.current.d3Force('center-x', (node: any) => {
        const radius = node.level === 'macro' ? 0 : node.level === 'sector' ? 300 : 600;
        return radius * Math.cos(node.angle || 0);
      });

      fgRef.current.d3Force('center-y', (node: any) => {
        const radius = node.level === 'macro' ? 0 : node.level === 'sector' ? 300 : 600;
        return radius * Math.sin(node.angle || 0);
      });
    }
  }, []);

  const filteredData = useMemo(() => {
    if (filterLevel === 'all') return graphData;
    const filteredNodes = graphData.nodes.filter(n => n.level === filterLevel);
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(
      l => typeof l.source === 'string'
        ? filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
        : filteredNodeIds.has((l.source as any).id) && filteredNodeIds.has((l.target as any).id)
    );
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, filterLevel]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);

    // Highlight connected nodes
    const connectedNodeIds = new Set<string>();
    const connectedLinks = new Set<GraphLink>();

    graphData.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any).id;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any).id;

      if (sourceId === node.id) {
        connectedNodeIds.add(targetId);
        connectedLinks.add(link);
      }
      if (targetId === node.id) {
        connectedNodeIds.add(sourceId);
        connectedLinks.add(link);
      }
    });

    connectedNodeIds.add(node.id);
    setHighlightNodes(connectedNodeIds);
    setHighlightLinks(connectedLinks);
  }, [graphData.links]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoverNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  return (
    <div className="w-full h-full relative bg-black">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">Filter by Level</div>
          <div className="flex gap-2">
            {(['all', 'macro', 'sector', 'company'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterLevel === level
                    ? 'bg-accent-cyan text-black shadow-lg shadow-accent-cyan/50'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Node Legend */}
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">Nodes</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: LEVEL_COLORS.macro, boxShadow: `0 0 10px ${LEVEL_COLORS.macro}` }} />
              <span className="text-xs text-text-primary">Macro Variables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: LEVEL_COLORS.sector, boxShadow: `0 0 10px ${LEVEL_COLORS.sector}` }} />
              <span className="text-xs text-text-primary">Sectors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: LEVEL_COLORS.company, boxShadow: `0 0 10px ${LEVEL_COLORS.company}` }} />
              <span className="text-xs text-text-primary">Companies</span>
            </div>
          </div>
        </div>

        {/* Link Legend */}
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2 font-semibold">Relationships</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(255, 215, 0, 0.8)' }} />
              <span className="text-xs text-text-primary">Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(0, 255, 159, 0.8)' }} />
              <span className="text-xs text-text-primary">Ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(0, 229, 255, 0.8)' }} />
              <span className="text-xs text-text-primary">Supply Chain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5" style={{ backgroundColor: 'rgba(255, 215, 0, 0.7)' }} />
              <span className="text-xs text-text-primary">Loan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderColor: 'rgba(239, 68, 68, 0.8)' }} />
              <span className="text-xs text-text-primary">Competition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 w-72 bg-black/90 backdrop-blur border border-accent-cyan rounded-lg p-4 shadow-2xl shadow-accent-cyan/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-accent-cyan">{selectedNode.name}</h3>
            <button
              onClick={() => {
                setSelectedNode(null);
                setHighlightNodes(new Set());
                setHighlightLinks(new Set());
              }}
              className="text-text-tertiary hover:text-accent-cyan transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border-primary">
              <span className="text-text-tertiary">Level:</span>
              <span className="text-text-primary font-semibold uppercase">{selectedNode.level}</span>
            </div>

            {selectedNode.level === 'company' && selectedNode.data && (
              <>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-tertiary">Name:</span>
                  <span className="text-text-primary font-semibold">{selectedNode.data.name}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-tertiary">Sector:</span>
                  <span className="text-accent-cyan">{selectedNode.data.sector}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-tertiary">Revenue:</span>
                  <span className="text-accent-emerald font-mono">${selectedNode.data.financials.revenue.toLocaleString()}M</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-tertiary">Net Income:</span>
                  <span className="text-accent-emerald font-mono">${selectedNode.data.financials.net_income.toLocaleString()}M</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-text-tertiary">ICR:</span>
                  <span className={`font-mono ${selectedNode.data.ratios?.icr > 2.5 ? 'text-status-safe' : 'text-status-caution'}`}>
                    {selectedNode.data.ratios?.icr?.toFixed(2) || 'N/A'}x
                  </span>
                </div>

                {/* Show macro impact */}
                {selectedNode.data.sector && (
                  <div className="mt-3 pt-3 border-t border-border-primary">
                    <div className="text-text-tertiary mb-1">Macro Impact:</div>
                    {(() => {
                      let impact = 0;
                      if (selectedNode.data.sector === 'BANKING') impact = calculatedImpacts.banking;
                      else if (selectedNode.data.sector === 'REALESTATE') impact = calculatedImpacts.realEstate;
                      else if (selectedNode.data.sector === 'MANUFACTURING') impact = calculatedImpacts.manufacturing;
                      else if (selectedNode.data.sector === 'SEMICONDUCTOR') impact = calculatedImpacts.semiconductor;

                      return (
                        <div className={`text-lg font-bold ${impact >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                          {impact >= 0 ? '+' : ''}{impact.toFixed(2)}%
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            )}

            {selectedNode.level === 'sector' && (
              <div className="mt-3 pt-3 border-t border-border-primary">
                <div className="text-text-tertiary mb-1">Sector Impact:</div>
                {(() => {
                  let impact = 0;
                  if (selectedNode.sector === 'BANKING') impact = calculatedImpacts.banking;
                  else if (selectedNode.sector === 'REALESTATE') impact = calculatedImpacts.realEstate;
                  else if (selectedNode.sector === 'MANUFACTURING') impact = calculatedImpacts.manufacturing;
                  else if (selectedNode.sector === 'SEMICONDUCTOR') impact = calculatedImpacts.semiconductor;

                  return (
                    <div className={`text-xl font-bold ${impact >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                      {impact >= 0 ? '+' : ''}{impact.toFixed(2)}%
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="pt-2 border-t border-border-primary">
              <div className="text-text-tertiary mb-1">Connections:</div>
              <div className="text-accent-cyan font-semibold">
                {highlightNodes.size - 1} connected nodes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary">Nodes</div>
            <div className="text-accent-cyan font-bold text-lg">{filteredData.nodes.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Links</div>
            <div className="text-accent-magenta font-bold text-lg">{filteredData.links.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Levels</div>
            <div className="text-accent-emerald font-bold text-lg">3</div>
          </div>
        </div>
      </div>

      {/* Force Graph */}
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        nodeLabel="name"
        nodeVal="val"
        nodeColor={(node: any) => {
          const n = node as GraphNode;
          if (highlightNodes.size > 0) {
            return highlightNodes.has(n.id) ? n.color : 'rgba(100, 100, 100, 0.3)';
          }
          return n.color;
        }}
        nodeOpacity={1}
        nodeResolution={32}
        linkColor={(link: any) => {
          if (highlightLinks.size > 0) {
            return highlightLinks.has(link as GraphLink) ? link.color : 'rgba(100, 100, 100, 0.1)';
          }
          return link.color || 'rgba(255, 255, 255, 0.2)';
        }}
        linkWidth={(link: any) => link.strength || 1}
        linkOpacity={0.6}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onBackgroundClick={handleBackgroundClick}
        backgroundColor="rgba(0, 0, 0, 0)"
        showNavInfo={false}
        enableNodeDrag={true}
        enableNavigationControls={true}
        controlType="orbit"
      />
    </div>
  );
}
