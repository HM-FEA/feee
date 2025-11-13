'use client';

import React, { useState, useMemo, memo } from 'react';
import { Building, Landmark, TrendingUp, Factory, Globe } from 'lucide-react';

export interface GraphNode {
  id: string;
  name: string;
  level: number; // 0-9 for ontology levels
  type: 'macro' | 'sector' | 'company' | 'product' | 'component';
  value?: number;
  position: { x: number; y: number };
}

export interface GraphEdge {
  from: string;
  to: string;
  strength: number; // 0-1
  label?: string;
}

interface NetworkGraph2DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeLevel?: number; // For propagation animation
  highlightedNodes?: Set<string>; // Nodes affected by propagation
  onNodeClick?: (nodeId: string) => void;
  compact?: boolean; // For small inset version
}

/**
 * NetworkGraph2D - 2D SVG Network with Propagation Visualization
 *
 * Features:
 * - Pure SVG rendering (no React Flow dependency)
 * - Propagation animation (bright nodes + glowing edges)
 * - Level-based color coding (0-9)
 * - Optimized with React.memo to prevent re-renders
 * - Compact mode for inset graphs
 */

const LEVEL_COLORS: Record<number, string> = {
  0: '#6b7280',  // Gray - Trade & Logistics
  1: '#00d4ff',  // Cyan - Macro
  2: '#00ff88',  // Green - Sector
  3: '#ff00ff',  // Magenta - Company
  4: '#ffaa00',  // Orange - Product
  5: '#ff6b6b',  // Red - Component
  6: '#a855f7',  // Purple - Technology
  7: '#10b981',  // Emerald - Ownership
  8: '#f59e0b',  // Amber - Customer
  9: '#3b82f6',  // Blue - Facility
};

const NetworkGraph2D = memo(function NetworkGraph2D({
  nodes,
  edges,
  activeLevel,
  highlightedNodes = new Set(),
  onNodeClick,
  compact = false
}: NetworkGraph2DProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Memoize calculations to prevent re-render
  const { width, height, nodeRadius, fontSize } = useMemo(() => {
    if (compact) {
      return { width: 300, height: 200, nodeRadius: 8, fontSize: 10 };
    }
    return { width: 1000, height: 600, nodeRadius: 20, fontSize: 12 };
  }, [compact]);

  // Find connected nodes for highlighting
  const connectedNodes = useMemo(() => {
    if (!selectedNode && !hoveredNode) return new Set<string>();
    const target = selectedNode || hoveredNode;
    const connected = new Set([target]);

    edges.forEach(edge => {
      if (edge.from === target) connected.add(edge.to);
      if (edge.to === target) connected.add(edge.from);
    });

    return connected;
  }, [selectedNode, hoveredNode, edges]);

  // Check if node is highlighted by propagation or selection
  const isNodeHighlighted = (nodeId: string) => {
    return highlightedNodes.has(nodeId) || connectedNodes.has(nodeId);
  };

  // Check if edge is highlighted
  const isEdgeHighlighted = (edge: GraphEdge) => {
    return connectedNodes.has(edge.from) && connectedNodes.has(edge.to);
  };

  // Get node color based on level and highlight status
  const getNodeColor = (node: GraphNode, isHighlighted: boolean) => {
    const baseColor = LEVEL_COLORS[node.level] || '#ffffff';
    if (isHighlighted || highlightedNodes.has(node.id)) {
      return baseColor; // Full brightness
    }
    if (selectedNode && !connectedNodes.has(node.id)) {
      return `${baseColor}40`; // Dimmed
    }
    return `${baseColor}CC`; // Normal
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <div className={`relative ${compact ? 'w-full h-full' : 'w-full h-full'} bg-[#0a0a0a]`}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        <defs>
          {/* Enhanced Glow filter for propagation animation */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Strong glow for nodes */}
          <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur1"/>
            <feGaussianBlur stdDeviation="12" result="blur2"/>
            <feMerge>
              <feMergeNode in="blur2"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="blur1"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Arrow markers */}
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#52525b" />
          </marker>

          <marker
            id="arrow-highlight"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#00d4ff" />
          </marker>
        </defs>

        {/* Edges */}
        <g className="edges">
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted = isEdgeHighlighted(edge);
            const isPropagating = highlightedNodes.has(edge.from) && highlightedNodes.has(edge.to);

            const strokeColor = isPropagating ? '#00d4ff' : isHighlighted ? '#00d4ff' : '#52525b';
            const strokeWidth = isPropagating ? 3 : isHighlighted ? 2.5 : 1.5;
            const opacity = !selectedNode || isHighlighted ? (isPropagating ? 1 : 0.8) : 0.2;

            return (
              <g key={idx} opacity={opacity}>
                <line
                  x1={fromNode.position.x}
                  y1={fromNode.position.y}
                  x2={toNode.position.x}
                  y2={toNode.position.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={`url(#${isHighlighted || isPropagating ? 'arrow-highlight' : 'arrow'})`}
                  filter={isPropagating ? 'url(#glow)' : undefined}
                  className={isPropagating ? 'animate-pulse' : ''}
                />
                {!compact && edge.label && isHighlighted && (
                  <text
                    x={(fromNode.position.x + toNode.position.x) / 2}
                    y={(fromNode.position.y + toNode.position.y) / 2 - 8}
                    fill={strokeColor}
                    fontSize={fontSize - 2}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {nodes.map(node => {
            const isHighlighted = isNodeHighlighted(node.id);
            const isPropagating = highlightedNodes.has(node.id);
            const isActive = activeLevel === node.level;
            const color = getNodeColor(node, isHighlighted || isPropagating);

            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node.id)}
                className="cursor-pointer"
                filter={isPropagating || isActive ? 'url(#node-glow)' : undefined}
              >
                {/* Node circle */}
                <circle
                  r={nodeRadius}
                  fill={color}
                  stroke={isPropagating || isActive ? color : '#1a1a1a'}
                  strokeWidth={isPropagating || isActive ? 4 : 2}
                  className={isPropagating ? 'animate-pulse' : ''}
                  opacity={isPropagating || isActive ? 1 : 0.9}
                />

                {/* Node label */}
                {!compact && (
                  <text
                    y={nodeRadius + fontSize + 4}
                    fill="#ffffff"
                    fontSize={fontSize}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    fontWeight={isHighlighted || isPropagating ? 'bold' : 'normal'}
                  >
                    {node.name}
                  </text>
                )}

                {/* Level indicator */}
                {!compact && isHighlighted && (
                  <text
                    y={-nodeRadius - 4}
                    fill={color}
                    fontSize={fontSize - 2}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    L{node.level}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend (only in non-compact mode) */}
      {!compact && (
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
          <div className="text-xs font-bold text-white mb-2">Ontology Levels</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(LEVEL_COLORS).slice(0, 5).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-gray-400">L{level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default NetworkGraph2D;

/**
 * Generate sample network data for testing
 */
export function generateSampleNetwork(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [
    // Level 1: Macro
    { id: 'fed', name: 'Fed Rate', level: 1, type: 'macro', position: { x: 500, y: 50 } },
    { id: 'gdp', name: 'GDP', level: 1, type: 'macro', position: { x: 400, y: 50 } },
    { id: 'm2', name: 'M2', level: 1, type: 'macro', position: { x: 600, y: 50 } },

    // Level 2: Sectors
    { id: 'banking', name: 'Banking', level: 2, type: 'sector', position: { x: 300, y: 150 } },
    { id: 'semiconductor', name: 'Semiconductor', level: 2, type: 'sector', position: { x: 500, y: 150 } },
    { id: 'realestate', name: 'Real Estate', level: 2, type: 'sector', position: { x: 700, y: 150 } },

    // Level 3: Companies
    { id: 'jpm', name: 'JPM', level: 3, type: 'company', position: { x: 250, y: 270 } },
    { id: 'nvda', name: 'NVIDIA', level: 3, type: 'company', position: { x: 450, y: 270 } },
    { id: 'tsmc', name: 'TSMC', level: 3, type: 'company', position: { x: 550, y: 270 } },
    { id: 'sk', name: 'SK Hynix', level: 3, type: 'company', position: { x: 650, y: 270 } },

    // Level 4: Products
    { id: 'h100', name: 'H100 GPU', level: 4, type: 'product', position: { x: 450, y: 390 } },
    { id: 'hbm', name: 'HBM3E', level: 5, type: 'component', position: { x: 550, y: 510 } },
  ];

  const edges: GraphEdge[] = [
    // Macro → Sector
    { from: 'fed', to: 'banking', strength: 0.9, label: 'Rate Sensitive' },
    { from: 'fed', to: 'semiconductor', strength: 0.6 },
    { from: 'gdp', to: 'semiconductor', strength: 0.8, label: 'Demand' },
    { from: 'm2', to: 'realestate', strength: 0.7 },

    // Sector → Company
    { from: 'banking', to: 'jpm', strength: 1.0 },
    { from: 'semiconductor', to: 'nvda', strength: 0.9 },
    { from: 'semiconductor', to: 'tsmc', strength: 0.9 },
    { from: 'semiconductor', to: 'sk', strength: 0.85 },

    // Company → Product
    { from: 'nvda', to: 'h100', strength: 1.0 },
    { from: 'tsmc', to: 'h100', strength: 0.9, label: 'Fabrication' },

    // Product → Component
    { from: 'h100', to: 'hbm', strength: 1.0, label: 'Requires' },
    { from: 'sk', to: 'hbm', strength: 1.0, label: 'Supplies' },
  ];

  return { nodes, edges };
}
