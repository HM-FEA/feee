'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Building2, DollarSign, AlertTriangle } from 'lucide-react';
import { useMacroStore } from '@/lib/store/macroStore';
import { companies } from '@/data/companies';

// ===== TYPES =====

type Level = 1 | 2 | 3 | 4;

interface Node {
  id: string;
  level: Level;
  label: string;
  value: number;
  change: number;
  color: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
}

interface Edge {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

// ===== CONSTANTS =====

const LEVEL_CONFIG = {
  1: {
    label: 'MACRO VARIABLES',
    y: 50,
    color: '#FFD700',
    icon: Zap,
    delay: 0
  },
  2: {
    label: 'SECTORS',
    y: 200,
    color: '#06B6D4',
    icon: TrendingUp,
    delay: 300
  },
  3: {
    label: 'COMPANIES',
    y: 350,
    color: '#10B981',
    icon: Building2,
    delay: 600
  },
  4: {
    label: 'ASSETS',
    y: 500,
    color: '#C026D3',
    icon: DollarSign,
    delay: 900
  }
};

// ===== COMPONENTS =====

const CircuitNode = ({
  node,
  isActive,
  delay
}: {
  node: Node;
  isActive: boolean;
  delay: number;
}) => {
  const Icon = LEVEL_CONFIG[node.level].icon;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isActive ? [1, 1.2, 1] : 1,
        opacity: 1
      }}
      transition={{
        scale: {
          duration: 0.6,
          delay: delay / 1000,
          ease: "easeOut"
        },
        opacity: {
          duration: 0.3,
          delay: delay / 1000
        }
      }}
    >
      {/* Glow effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: node.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1, delay: delay / 1000 }}
        />
      )}

      {/* Node circle */}
      <div
        className={`
          relative w-16 h-16 rounded-full border-2 flex items-center justify-center
          transition-all duration-300
          ${isActive
            ? 'border-white shadow-lg shadow-white/50'
            : 'border-white/30'
          }
        `}
        style={{
          backgroundColor: isActive ? node.color : '#0D0D0F',
          boxShadow: isActive ? `0 0 30px ${node.color}` : 'none'
        }}
      >
        <Icon size={24} className={isActive ? 'text-black' : 'text-white/50'} />
      </div>

      {/* Label */}
      <div className="absolute top-full mt-2 text-center whitespace-nowrap">
        <div className="text-xs font-semibold text-text-primary">{node.label}</div>
        <div className={`text-xs font-mono ${node.change >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
          {node.change >= 0 ? '+' : ''}{node.change.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  );
};

const CircuitEdge = ({
  edge,
  nodes,
  isActive
}: {
  edge: Edge;
  nodes: Node[];
  isActive: boolean;
}) => {
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const x1 = fromNode.position.x;
  const y1 = fromNode.position.y;
  const x2 = toNode.position.x;
  const y2 = toNode.position.y;

  // Calculate path with bezier curve
  const midY = (y1 + y2) / 2;
  const path = `M ${x1} ${y1} Q ${x1} ${midY}, ${(x1 + x2) / 2} ${midY} Q ${x2} ${midY}, ${x2} ${y2}`;

  return (
    <motion.g>
      {/* Shadow/glow */}
      {isActive && (
        <motion.path
          d={path}
          fill="none"
          stroke={fromNode.color}
          strokeWidth="8"
          strokeOpacity="0"
          initial={{ strokeOpacity: 0 }}
          animate={{ strokeOpacity: [0, 0.3, 0] }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          filter="url(#glow)"
        />
      )}

      {/* Main line */}
      <motion.path
        d={path}
        fill="none"
        stroke={isActive ? fromNode.color : '#1A1A1F'}
        strokeWidth={isActive ? "3" : "2"}
        strokeOpacity={isActive ? 1 : 0.3}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Animated particles */}
      {isActive && edge.active && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.circle
              key={i}
              r="4"
              fill={fromNode.color}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                offsetPath: `path('${path}')`,
                offsetRotate: "0deg"
              }}
            >
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              >
                <mpath href={`#path-${edge.from}-${edge.to}`} />
              </animateMotion>
            </motion.circle>
          ))}

          {/* Hidden path for animateMotion */}
          <path id={`path-${edge.from}-${edge.to}`} d={path} fill="none" stroke="none" />
        </>
      )}
    </motion.g>
  );
};

const LevelIndicator = ({
  level,
  isActive
}: {
  level: Level;
  isActive: boolean;
}) => {
  const config = LEVEL_CONFIG[level];

  return (
    <motion.div
      className="absolute left-4 flex items-center gap-3"
      style={{ top: `${config.y}px` }}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isActive ? 1.1 : 1
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all
          ${isActive
            ? 'border-white bg-white text-black'
            : 'border-white/30 bg-black/50 text-white/50'
          }
        `}
        style={{
          boxShadow: isActive ? `0 0 20px ${config.color}` : 'none'
        }}
      >
        LEVEL {level}
      </div>
      <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white/30'}`}>
        {config.label}
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====

export default function CircuitDiagram() {
  const { macroState, calculatedImpacts } = useMacroStore();
  const [activeLevels, setActiveLevels] = useState<Level[]>([]);
  const [cascadeTriggered, setCascadeTriggered] = useState(0);

  // Watch for macro changes
  const fedRate = macroState['fed_funds_rate'] || 5.25;
  const prevFedRate = useRef(fedRate);

  useEffect(() => {
    // Trigger cascade when fed rate changes
    if (Math.abs(fedRate - prevFedRate.current) > 0.1) {
      prevFedRate.current = fedRate;
      setCascadeTriggered(prev => prev + 1);
      setActiveLevels([]);

      // Activate levels sequentially
      setTimeout(() => setActiveLevels([1]), 0);
      setTimeout(() => setActiveLevels([1, 2]), 300);
      setTimeout(() => setActiveLevels([1, 2, 3]), 600);
      setTimeout(() => setActiveLevels([1, 2, 3, 4]), 900);
      setTimeout(() => setActiveLevels([]), 2000); // Reset
    }
  }, [fedRate]);

  // Generate nodes
  const nodes: Node[] = useMemo(() => {
    const result: Node[] = [];

    // Level 1: Macro (3 nodes)
    const macroVars = [
      { id: 'fed_rate', label: 'Fed Rate', value: fedRate, change: (fedRate - 5.25) * 100 / 5.25 },
      { id: 'gdp', label: 'GDP Growth', value: 2.5, change: 0.3 },
      { id: 'inflation', label: 'CPI', value: 3.7, change: -0.5 }
    ];

    macroVars.forEach((v, i) => {
      result.push({
        id: `L1-${v.id}`,
        level: 1,
        label: v.label,
        value: v.value,
        change: v.change,
        color: LEVEL_CONFIG[1].color,
        icon: <Zap />,
        position: { x: 20 + i * 30, y: LEVEL_CONFIG[1].y }
      });
    });

    // Level 2: Sectors (4 nodes)
    const sectors = ['BANKING', 'REALESTATE', 'MANUFACTURING', 'SEMICONDUCTOR'];
    sectors.forEach((sector, i) => {
      const impact = calculatedImpacts[sector.toLowerCase() as keyof typeof calculatedImpacts] || 0;
      result.push({
        id: `L2-${sector}`,
        level: 2,
        label: sector.slice(0, 8),
        value: 100 + impact,
        change: impact,
        color: LEVEL_CONFIG[2].color,
        icon: <TrendingUp />,
        position: { x: 15 + i * 23, y: LEVEL_CONFIG[2].y }
      });
    });

    // Level 3: Companies (6 nodes)
    companies.slice(0, 6).forEach((company, i) => {
      const sectorImpact = calculatedImpacts[company.sector.toLowerCase() as keyof typeof calculatedImpacts] || 0;
      result.push({
        id: `L3-${company.ticker}`,
        level: 3,
        label: company.ticker,
        value: 100 + sectorImpact * 0.8,
        change: sectorImpact * 0.8,
        color: LEVEL_CONFIG[3].color,
        icon: <Building2 />,
        position: { x: 12 + i * 15, y: LEVEL_CONFIG[3].y }
      });
    });

    // Level 4: Assets (8 nodes)
    for (let i = 0; i < 8; i++) {
      result.push({
        id: `L4-asset${i}`,
        level: 4,
        label: `Asset ${i + 1}`,
        value: 100,
        change: Math.random() * 4 - 2,
        color: LEVEL_CONFIG[4].color,
        icon: <DollarSign />,
        position: { x: 10 + i * 11.5, y: LEVEL_CONFIG[4].y }
      });
    }

    return result;
  }, [fedRate, calculatedImpacts]);

  // Generate edges
  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];

    // Connect L1 to L2
    nodes.filter(n => n.level === 1).forEach(fromNode => {
      nodes.filter(n => n.level === 2).forEach(toNode => {
        result.push({
          from: fromNode.id,
          to: toNode.id,
          strength: 1,
          active: activeLevels.includes(1) && activeLevels.includes(2)
        });
      });
    });

    // Connect L2 to L3
    nodes.filter(n => n.level === 2).forEach(fromNode => {
      nodes.filter(n => n.level === 3).slice(0, 2).forEach(toNode => {
        result.push({
          from: fromNode.id,
          to: toNode.id,
          strength: 0.8,
          active: activeLevels.includes(2) && activeLevels.includes(3)
        });
      });
    });

    // Connect L3 to L4
    nodes.filter(n => n.level === 3).forEach((fromNode, i) => {
      nodes.filter(n => n.level === 4).slice(i, i + 2).forEach(toNode => {
        result.push({
          from: fromNode.id,
          to: toNode.id,
          strength: 0.6,
          active: activeLevels.includes(3) && activeLevels.includes(4)
        });
      });
    });

    return result;
  }, [nodes, activeLevels]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-black via-[#0A0A0C] to-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(#1A1A1F 1px, transparent 1px), linear-gradient(90deg, #1A1A1F 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Level indicators */}
      {([1, 2, 3, 4] as Level[]).map(level => (
        <LevelIndicator
          key={level}
          level={level}
          isActive={activeLevels.includes(level)}
        />
      ))}

      {/* SVG for edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(0, 0)">
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <CircuitEdge
                key={`${edge.from}-${edge.to}-${cascadeTriggered}`}
                edge={edge}
                nodes={nodes}
                isActive={edge.active}
              />
            );
          })}
        </g>
      </svg>

      {/* Nodes */}
      {nodes.map(node => (
        <CircuitNode
          key={`${node.id}-${cascadeTriggered}`}
          node={node}
          isActive={activeLevels.includes(node.level)}
          delay={LEVEL_CONFIG[node.level].delay}
        />
      ))}

      {/* Cascade info */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-border-primary rounded-lg p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-accent-cyan" />
          <h4 className="text-sm font-semibold text-accent-cyan">Cascade Propagation</h4>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          Adjust macro variables to see real-time impact cascade through all 4 levels
        </p>
        <div className="space-y-1 text-xs">
          {([1, 2, 3, 4] as Level[]).map(level => (
            <div key={level} className="flex items-center justify-between">
              <span className="text-text-tertiary">Level {level}:</span>
              <span className={activeLevels.includes(level) ? 'text-accent-cyan font-semibold' : 'text-text-secondary'}>
                {activeLevels.includes(level) ? 'ACTIVE' : 'Idle'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-border-primary rounded-lg p-3">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary">Nodes</div>
            <div className="text-accent-cyan font-semibold">{nodes.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Connections</div>
            <div className="text-accent-magenta font-semibold">{edges.length}</div>
          </div>
          <div>
            <div className="text-text-tertiary">Active</div>
            <div className="text-accent-emerald font-semibold">{edges.filter(e => e.active).length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const useRef = React.useRef;
