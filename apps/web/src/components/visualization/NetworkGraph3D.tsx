'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MACRO_VARIABLES, MACRO_CATEGORIES, MacroCategory } from '@/data/macroVariables';
import { companies } from '@/data/companies';

// Node types for 4-level ontology
type NodeLevel = 'macro' | 'sector' | 'company' | 'asset';

interface GraphNode {
  id: string;
  label: string;
  level: NodeLevel;
  category?: string;
  position: [number, number, number];
  color: string;
  size: number;
  data?: any;
}

interface GraphEdge {
  from: string;
  to: string;
  type: 'impact' | 'supply' | 'competition' | 'ownership';
  strength: number;
}

// Level colors
const LEVEL_COLORS = {
  macro: '#FFD700',      // Gold
  sector: '#00E5FF',     // Cyan
  company: '#00FF9F',    // Emerald
  asset: '#C026D3'       // Magenta
};

const SECTOR_COLORS: Record<string, string> = {
  BANKING: '#06B6D4',
  REALESTATE: '#00FF9F',
  MANUFACTURING: '#8B5CF6',
  SEMICONDUCTOR: '#F59E0B',
};

// Generate 3D positions in layers
function generateNodePositions(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Level 1: Macro Variables (top layer, Y=8)
  const macroCategories = Object.entries(MACRO_CATEGORIES).slice(0, 6); // Top 6 categories
  macroCategories.forEach(([key, category], i) => {
    const angle = (i / macroCategories.length) * Math.PI * 2;
    const radius = 12;
    nodes.push({
      id: `macro-${key}`,
      label: category.label,
      level: 'macro',
      category: key,
      position: [
        Math.cos(angle) * radius,
        8,
        Math.sin(angle) * radius
      ],
      color: LEVEL_COLORS.macro,
      size: 0.8,
      data: { icon: category.icon, variableCount: MACRO_VARIABLES.filter(v => v.category === key).length }
    });
  });

  // Level 2: Sectors (middle-top layer, Y=4)
  const sectors = ['BANKING', 'REALESTATE', 'MANUFACTURING', 'SEMICONDUCTOR'];
  sectors.forEach((sector, i) => {
    const angle = (i / sectors.length) * Math.PI * 2;
    const radius = 8;
    const nodeId = `sector-${sector}`;
    nodes.push({
      id: nodeId,
      label: sector,
      level: 'sector',
      position: [
        Math.cos(angle) * radius,
        4,
        Math.sin(angle) * radius
      ],
      color: SECTOR_COLORS[sector] || LEVEL_COLORS.sector,
      size: 0.6,
      data: { sector }
    });

    // Connect macro to sectors
    macroCategories.forEach(([macroKey]) => {
      if (
        (macroKey === 'MONETARY_POLICY' && (sector === 'BANKING' || sector === 'REALESTATE')) ||
        (macroKey === 'COMMODITIES' && sector === 'MANUFACTURING') ||
        (macroKey === 'TECH_INNOVATION' && sector === 'SEMICONDUCTOR')
      ) {
        edges.push({
          from: `macro-${macroKey}`,
          to: nodeId,
          type: 'impact',
          strength: 0.8
        });
      }
    });
  });

  // Level 3: Companies (middle-bottom layer, Y=0)
  const companySample = companies.slice(0, 20); // Top 20 companies
  const companiesBySector = companySample.reduce((acc, c) => {
    if (!acc[c.sector]) acc[c.sector] = [];
    acc[c.sector].push(c);
    return acc;
  }, {} as Record<string, typeof companies>);

  Object.entries(companiesBySector).forEach(([sector, sectorCompanies]) => {
    const sectorNode = nodes.find(n => n.id === `sector-${sector}`);
    if (!sectorNode) return;

    const sectorAngle = Math.atan2(sectorNode.position[2], sectorNode.position[0]);
    const count = sectorCompanies.length;

    sectorCompanies.forEach((company, i) => {
      const spreadAngle = sectorAngle + (i - count / 2) * 0.3;
      const radius = 5 + Math.random() * 2;
      const nodeId = `company-${company.ticker}`;

      nodes.push({
        id: nodeId,
        label: company.ticker,
        level: 'company',
        position: [
          Math.cos(spreadAngle) * radius,
          0,
          Math.sin(spreadAngle) * radius
        ],
        color: SECTOR_COLORS[sector] || LEVEL_COLORS.company,
        size: 0.4,
        data: company
      });

      // Connect to sector
      edges.push({
        from: `sector-${sector}`,
        to: nodeId,
        type: 'ownership',
        strength: 0.6
      });
    });
  });

  // Level 4: Assets (bottom layer, Y=-4) - Sample
  const assetSamples = ['Product A', 'Product B', 'Service X', 'Platform Y'];
  companySample.slice(0, 8).forEach((company, companyIdx) => {
    assetSamples.slice(0, 2).forEach((asset, assetIdx) => {
      const companyNode = nodes.find(n => n.id === `company-${company.ticker}`);
      if (!companyNode) return;

      const offset = (assetIdx - 0.5) * 1.5;
      const nodeId = `asset-${company.ticker}-${assetIdx}`;

      nodes.push({
        id: nodeId,
        label: `${company.ticker}-${asset}`,
        level: 'asset',
        position: [
          companyNode.position[0] + offset,
          -4,
          companyNode.position[2] + offset
        ],
        color: LEVEL_COLORS.asset,
        size: 0.2,
        data: { assetName: asset, parent: company.ticker }
      });

      edges.push({
        from: `company-${company.ticker}`,
        to: nodeId,
        type: 'ownership',
        strength: 0.4
      });
    });
  });

  return { nodes, edges };
}

// Node Component
function Node({ node, onClick, isHovered, onHover }: {
  node: GraphNode;
  onClick: (node: GraphNode) => void;
  isHovered: boolean;
  onHover: (node: GraphNode | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isHovered) {
      meshRef.current.scale.setScalar(1.2);
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[node.size, 32, 32]}
        onClick={() => onClick(node)}
        onPointerOver={() => onHover(node)}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {isHovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/90 border border-accent-cyan rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap pointer-events-none">
            <div className="font-semibold">{node.label}</div>
            <div className="text-text-tertiary text-xs">{node.level.toUpperCase()}</div>
          </div>
        </Html>
      )}

      <Text
        position={[0, -node.size - 0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.level === 'macro' || node.level === 'sector' ? node.label : ''}
      </Text>
    </group>
  );
}

// Edge Component
function Edge({ edge, nodes }: { edge: GraphEdge; nodes: GraphNode[] }) {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const lineColor = edge.type === 'impact' ? '#FFD700' :
                    edge.type === 'supply' ? '#00E5FF' :
                    edge.type === 'competition' ? '#EF4444' : '#00FF9F';

  return (
    <Line
      points={[fromNode.position, toNode.position]}
      color={lineColor}
      lineWidth={edge.strength * 2}
      transparent
      opacity={0.3}
      dashed={edge.type === 'competition'}
    />
  );
}

// Scene Component
function Scene({ nodes, edges, selectedNode, onNodeClick, hoveredNode, onNodeHover }: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNode: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
  hoveredNode: GraphNode | null;
  onNodeHover: (node: GraphNode | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {edges.map((edge, i) => (
        <Edge key={i} edge={edge} nodes={nodes} />
      ))}

      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          onClick={onNodeClick}
          isHovered={hoveredNode?.id === node.id}
          onHover={onNodeHover}
        />
      ))}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

// Main Component
export default function NetworkGraph3D() {
  const { nodes, edges } = useMemo(() => generateNodePositions(), []);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [filterLevel, setFilterLevel] = useState<NodeLevel | 'all'>('all');

  const filteredNodes = useMemo(() => {
    if (filterLevel === 'all') return nodes;
    return nodes.filter(n => n.level === filterLevel);
  }, [nodes, filterLevel]);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2">Filter by Level</div>
          <div className="flex gap-2">
            {(['all', 'macro', 'sector', 'company', 'asset'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  filterLevel === level
                    ? 'bg-accent-cyan text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs text-text-tertiary mb-2">Levels</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.macro }} />
              <span className="text-xs text-text-primary">Macro Variables</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.sector }} />
              <span className="text-xs text-text-primary">Sectors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.company }} />
              <span className="text-xs text-text-primary">Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: LEVEL_COLORS.asset }} />
              <span className="text-xs text-text-primary">Assets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 w-64 bg-black/90 backdrop-blur border border-accent-cyan rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-accent-cyan">{selectedNode.label}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Level:</span>
              <span className="text-text-primary font-semibold">{selectedNode.level.toUpperCase()}</span>
            </div>

            {selectedNode.level === 'macro' && selectedNode.data && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Variables:</span>
                <span className="text-accent-cyan">{selectedNode.data.variableCount}</span>
              </div>
            )}

            {selectedNode.level === 'company' && selectedNode.data && (
              <>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Sector:</span>
                  <span className="text-text-primary">{selectedNode.data.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Revenue:</span>
                  <span className="text-accent-emerald">${selectedNode.data.financials.revenue.toLocaleString()}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">ICR:</span>
                  <span className={selectedNode.data.ratios?.icr > 2.5 ? 'text-status-safe' : 'text-status-caution'}>
                    {selectedNode.data.ratios?.icr?.toFixed(2) || 'N/A'}x
                  </span>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-border-primary">
              <div className="text-text-tertiary mb-1">Connected to:</div>
              <div className="text-accent-cyan">
                {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length} nodes
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary">Nodes</div>
            <div className="text-accent-cyan font-semibold">{filteredNodes.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Edges</div>
            <div className="text-accent-magenta font-semibold">{edges.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Levels</div>
            <div className="text-accent-emerald font-semibold">4</div>
          </div>
          <div>
            <div className="text-text-tertiary">Sectors</div>
            <div className="text-text-primary font-semibold">4</div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 10, 15], fov: 60 }}
        style={{ background: 'radial-gradient(circle at center, #0A0A0C 0%, #000000 100%)' }}
      >
        <Scene
          nodes={filteredNodes}
          edges={edges}
          selectedNode={selectedNode}
          onNodeClick={setSelectedNode}
          hoveredNode={hoveredNode}
          onNodeHover={setHoveredNode}
        />
      </Canvas>
    </div>
  );
}
