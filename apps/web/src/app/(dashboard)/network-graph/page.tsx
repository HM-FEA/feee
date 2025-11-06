"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';
import { Building2, Factory, Home, Cpu, BarChart3, AlertTriangle, Info, Check } from 'lucide-react';
import { ALL_COMPANIES, COMPANY_LINKS, type Company, type Sector } from '@/data/companies';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  sector: Sector;
  icr: number;
  debt: number;
  assets: number;
  netIncome: number;
}

interface GraphLink extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  amount: number;
  type: string;
}

// Convert company data to graph nodes
const SAMPLE_NODES: Node[] = ALL_COMPANIES.map(company => ({
  id: company.id,
  name: company.name,
  sector: company.sector,
  icr: company.ratios.icr,
  debt: company.financials.total_debt,
  assets: company.financials.total_assets,
  netIncome: company.financials.net_income,
}));

const SAMPLE_LINKS: GraphLink[] = COMPANY_LINKS.map(link => ({
  source: link.source,
  target: link.target,
  amount: link.amount,
  type: link.type,
}));

function getRiskStatus(icr: number): { status: string; color: string } {
  if (icr > 2.5) return { status: 'SAFE', color: '#00FF9F' };
  if (icr >= 2.0) return { status: 'CAUTION', color: '#F59E0B' };
  return { status: 'RISK', color: '#EF4444' };
}

export default function NetworkGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create simulation
    const simulation = d3.forceSimulation(SAMPLE_NODES)
      .force('link', d3.forceLink<Node, GraphLink>(SAMPLE_LINKS).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(SAMPLE_LINKS)
      .join('line')
      .attr('stroke', '#4B5563')
      .attr('stroke-width', d => Math.sqrt(d.amount) / 2)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(SAMPLE_NODES)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Node circles
    node.append('circle')
      .attr('r', d => {
        if (d.sector === 'BANKING') return 35;
        if (d.sector === 'MANUFACTURING' || d.sector === 'SEMICONDUCTOR') return 30;
        return 25;
      })
      .attr('fill', d => {
        if (d.sector === 'BANKING') return '#06B6D4';
        if (d.sector === 'MANUFACTURING') return '#8B5CF6';
        if (d.sector === 'SEMICONDUCTOR') return '#F59E0B';
        if (d.sector === 'REALESTATE') {
          const risk = getRiskStatus(d.icr);
          return risk.color;
        }
        return '#9CA3AF';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Node labels
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');

    // Sector text (first letter)
    node.append('text')
      .text(d => {
        if (d.sector === 'BANKING') return 'B';
        if (d.sector === 'REALESTATE') return 'R';
        if (d.sector === 'MANUFACTURING') return 'M';
        if (d.sector === 'SEMICONDUCTOR') return 'S';
        return 'X';
      })
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .style('pointer-events', 'none');

    // Click and hover handlers
    node.on('click', (event, d) => {
      setSelectedNode(d);
    });

    node.on('mouseenter', (event, d) => {
      setHoveredNode(d);
    });

    node.on('mouseleave', () => {
      setHoveredNode(null);
    });

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  const SECTOR_FILTERS = [
    { key: 'all', label: 'All Sectors' },
    { key: 'BANKING', label: 'Banking' },
    { key: 'REALESTATE', label: 'Real Estate' },
    { key: 'MANUFACTURING', label: 'Manufacturing' },
    { key: 'SEMICONDUCTOR', label: 'Semiconductor' },
  ];

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2 mb-1">
              <BarChart3 size={24} />
              Network Graph
            </h1>
            <p className="text-sm text-text-secondary">
              Interactive financial network visualization - systemic risk analysis
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {SECTOR_FILTERS.map(filter => (
              <button
                key={filter.key}
                onClick={() => setSectorFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  sectorFilter === filter.key
                    ? 'bg-accent-cyan text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6 h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Network Graph */}
          <div className="col-span-2 bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-6 hover:border-[#2A2A3F] transition-all">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Network Visualization</h2>

            <div className="bg-background-primary rounded-lg p-4 mb-4 border border-border-primary">
              <svg ref={svgRef} className="w-full" style={{ maxHeight: '600px' }}></svg>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-bold mb-2 text-text-primary">Sectors</h3>
                <div className="space-y-1 text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#06B6D4]"></div>
                    <span>Banking (7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#00FF9F]"></div>
                    <span>Real Estate (7)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6]"></div>
                    <span>Manufacturing (5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
                    <span>Semiconductor (4)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-text-primary">Risk Levels</h3>
                <div className="space-y-1 text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#00FF9F]"></div>
                    <span>SAFE (ICR &gt; 2.5x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#F59E0B]"></div>
                    <span>CAUTION (2.0 - 2.5x)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#EF4444]"></div>
                    <span>RISK (ICR &lt; 2.0x)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Company Details */}
          <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-6 hover:border-[#2A2A3F] transition-all">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Company Details</h2>

            {selectedNode ? (
              <div className="space-y-4">
                <div className="bg-background-tertiary rounded-lg p-4 border border-border-primary">
                  <div className="mb-2">
                    {selectedNode.sector === 'BANKING' && <Building2 size={32} className="text-[#06B6D4]" />}
                    {selectedNode.sector === 'REALESTATE' && <Home size={32} className="text-[#00FF9F]" />}
                    {selectedNode.sector === 'MANUFACTURING' && <Factory size={32} className="text-[#8B5CF6]" />}
                    {selectedNode.sector === 'SEMICONDUCTOR' && <Cpu size={32} className="text-[#F59E0B]" />}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-text-primary">{selectedNode.name}</h3>
                  <p className="text-sm text-text-secondary">{selectedNode.sector}</p>
                </div>

                <div className="bg-background-tertiary rounded-lg p-4 space-y-2 border border-border-primary">
                  <h4 className="font-bold text-sm text-text-secondary">Financial Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>ICR:</span>
                      <span className="font-bold">{selectedNode.icr.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`font-bold`} style={{ color: getRiskStatus(selectedNode.icr).color }}>
                        {getRiskStatus(selectedNode.icr).status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Debt:</span>
                      <span className="font-mono">{selectedNode.debt.toLocaleString()}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assets:</span>
                      <span className="font-mono">{selectedNode.assets.toLocaleString()}B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Income:</span>
                      <span className="font-mono">{selectedNode.netIncome.toLocaleString()}B</span>
                    </div>
                  </div>
                </div>

                {selectedNode.sector === 'BANKING' && (
                  <div className="bg-background-tertiary rounded-lg p-4 border border-border-primary">
                    <h4 className="font-bold text-sm text-text-secondary mb-2">Loan Portfolio</h4>
                    <div className="space-y-2 text-xs">
                      {SAMPLE_LINKS
                        .filter(l => l.source === selectedNode.id || (typeof l.source === 'object' && l.source.id === selectedNode.id))
                        .map((link, idx) => {
                          const targetNode = SAMPLE_NODES.find(n =>
                            n.id === (typeof link.target === 'string' ? link.target : link.target.id)
                          );
                          if (!targetNode) return null;
                          const risk = getRiskStatus(targetNode.icr);
                          return (
                            <div key={idx} className="flex justify-between items-center bg-background-secondary p-2 rounded border border-border-primary hover:border-accent-emerald transition-colors">
                              <span>{targetNode.name}</span>
                              <div className="text-right">
                                <div className="font-mono">{link.amount}B</div>
                                <div className="text-xs" style={{ color: risk.color }}>{risk.status}</div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <Link href={`/company/${selectedNode.id}/circuit-diagram`} className="block w-full px-4 py-2 bg-[#00FF9F] text-[#050505] font-bold rounded hover:bg-[#00D98A] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300 text-center">
                  View Circuit Diagram
                </Link>
              </div>
            ) : (
              <div className="text-center text-text-secondary py-12">
                <BarChart3 size={48} className="mx-auto mb-3 text-text-tertiary opacity-50" />
                <p>Click on a node to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 hover:border-[#2A2A3F] transition-all">
          <h3 className="font-bold mb-2 text-text-primary text-sm flex items-center gap-2">
            <Info size={14} />
            How to Use
          </h3>
          <ul className="text-xs text-text-secondary space-y-1">
            <li className="flex items-center gap-2">
              <Check size={12} className="text-accent-cyan" />
              <span><strong className="text-accent-cyan">Drag</strong> nodes to reposition them</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-accent-cyan" />
              <span><strong className="text-accent-cyan">Click</strong> on a node to view detailed information</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-accent-cyan" />
              <span><strong className="text-accent-cyan">Hover</strong> over nodes to highlight connections</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-accent-cyan" />
              <span>Line thickness represents loan amount</span>
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} className="text-accent-cyan" />
              <span>Node colors indicate sector and risk level</span>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}
