'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Building2, Cpu, Factory, Boxes, AlertTriangle, TrendingUp } from 'lucide-react';

export interface SupplyChainNode {
  id: string;
  name: string;
  category: 'supplier' | 'manufacturer' | 'component' | 'customer' | 'equipment';
  details: {
    role: string;
    marketShare?: string;
    leadTime?: string;
    cost?: string;
    risk?: 'low' | 'medium' | 'high' | 'critical';
    revenue?: string;
    capacity?: string;
  };
  icon?: React.ReactNode;
  position?: { x: number; y: number };
}

export interface SupplyChainLink {
  source: string;
  target: string;
  label: string;
  volume?: string;
  bottleneck?: boolean;
}

// Custom Node Component
function CustomNode({ data }: { data: any }) {
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-border-primary bg-background-secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'supplier': return 'text-blue-400';
      case 'manufacturer': return 'text-purple-400';
      case 'component': return 'text-emerald-400';
      case 'customer': return 'text-cyan-400';
      case 'equipment': return 'text-orange-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className={`px-4 py-3 shadow-xl rounded-lg border-2 min-w-[180px] ${getRiskColor(data.details?.risk)}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`text-lg ${getCategoryColor(data.category)}`}>
          {data.icon}
        </div>
        <div>
          <div className="text-sm font-bold text-text-primary">{data.name}</div>
          <div className="text-xs text-text-tertiary">{data.details.role}</div>
        </div>
      </div>

      {data.details.risk && (
        <div className="flex items-center gap-1 mt-2 text-xs">
          <AlertTriangle size={12} className={
            data.details.risk === 'critical' ? 'text-red-400' :
            data.details.risk === 'high' ? 'text-orange-400' :
            data.details.risk === 'medium' ? 'text-yellow-400' :
            'text-green-400'
          } />
          <span className="text-text-secondary capitalize">{data.details.risk} Risk</span>
        </div>
      )}

      {data.details.marketShare && (
        <div className="text-xs text-text-secondary mt-1">
          Share: {data.details.marketShare}
        </div>
      )}
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

interface SupplyChainFlowProps {
  nodes: SupplyChainNode[];
  links: SupplyChainLink[];
  title?: string;
  description?: string;
  activeLevel?: number; // For propagation visualization
}

export default function SupplyChainFlow({
  nodes: supplychainNodes,
  links,
  title = 'Supply Chain Network',
  description,
  activeLevel,
}: SupplyChainFlowProps) {
  // Auto-layout nodes if positions not provided
  const initialNodes: Node[] = useMemo(() => {
    return supplychainNodes.map((node, index) => {
      const position = node.position || {
        x: (index % 3) * 300 + 100,
        y: Math.floor(index / 3) * 200 + 100,
      };

      return {
        id: node.id,
        type: 'custom',
        position,
        data: {
          ...node,
          icon: node.icon || <Building2 size={18} />,
        },
      };
    });
  }, [supplychainNodes]);

  const initialEdges: Edge[] = useMemo(() => {
    // Propagation effect: all edges animate and brighten during active propagation
    const isPropagating = activeLevel !== undefined && activeLevel >= 0;

    return links.map((link, index) => ({
      id: `e${index}`,
      source: link.source,
      target: link.target,
      label: link.label,
      animated: isPropagating || link.bottleneck, // Animate all edges during propagation
      style: {
        stroke: isPropagating
          ? '#00E5FF' // Bright cyan during propagation
          : link.bottleneck ? '#EF4444' : '#00E5FF',
        strokeWidth: isPropagating
          ? 4 // Thicker during propagation
          : link.bottleneck ? 3 : 2,
        filter: isPropagating ? 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.8))' : undefined, // Glow effect
      },
      labelStyle: {
        fill: isPropagating
          ? '#00E5FF'
          : link.bottleneck ? '#EF4444' : '#00E5FF',
        fontSize: 12,
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: '#000',
        fillOpacity: 0.8,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isPropagating
          ? '#00E5FF'
          : link.bottleneck ? '#EF4444' : '#00E5FF',
        width: isPropagating ? 24 : 20, // Larger arrow during propagation
        height: isPropagating ? 24 : 20,
      },
    }));
  }, [links, activeLevel]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update edges when activeLevel changes (for propagation animation)
  React.useEffect(() => {
    setEdges(initialEdges);
  }, [activeLevel, setEdges, initialEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full bg-background-primary rounded-lg border border-border-primary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
        className="bg-background-primary"
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="bg-background-secondary border border-border-primary rounded" />
        <MiniMap
          className="bg-background-secondary border border-border-primary rounded"
          nodeColor={(node) => {
            switch (node.data.category) {
              case 'supplier': return '#3B82F6';
              case 'manufacturer': return '#A855F7';
              case 'component': return '#10B981';
              case 'customer': return '#06B6D4';
              case 'equipment': return '#F59E0B';
              default: return '#64748B';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
        <Panel position="top-left" className="bg-background-secondary/90 backdrop-blur border border-border-primary rounded-lg p-3">
          <h2 className="text-sm font-bold text-text-primary mb-1">{title}</h2>
          {description && (
            <p className="text-xs text-text-secondary">{description}</p>
          )}
        </Panel>
        <Panel position="top-right" className="bg-background-secondary/90 backdrop-blur border border-border-primary rounded-lg p-3">
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-accent-cyan"></div>
              <span className="text-text-secondary">Normal Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-text-secondary">Bottleneck</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// H100 Supply Chain Data (React Flow format)
export const H100_SUPPLY_CHAIN_DATA: {
  nodes: SupplyChainNode[];
  links: SupplyChainLink[];
} = {
  nodes: [
    {
      id: 'asml',
      name: 'ASML',
      category: 'equipment',
      details: {
        role: 'EUV Lithography Equipment',
        marketShare: '100% (EUV monopoly)',
        leadTime: '18-24 months',
        risk: 'medium',
        revenue: '€27.6B (2023)',
      },
      icon: <Factory size={18} />,
      position: { x: 50, y: 50 },
    },
    {
      id: 'tsmc',
      name: 'TSMC',
      category: 'manufacturer',
      details: {
        role: '4nm GPU Die + CoWoS Packaging',
        marketShare: '95% advanced packaging',
        leadTime: '60-90 days',
        cost: '$16,000 per wafer',
        risk: 'critical',
        revenue: '$69.3B (2023)',
      },
      icon: <Cpu size={18} />,
      position: { x: 50, y: 250 },
    },
    {
      id: 'sk-hynix',
      name: 'SK Hynix',
      category: 'component',
      details: {
        role: 'HBM3E Memory',
        marketShare: '50% HBM market',
        leadTime: '90 days',
        cost: '$3,500 per stack',
        risk: 'critical',
        capacity: '400K stacks/month',
      },
      icon: <Boxes size={18} />,
      position: { x: 400, y: 250 },
    },
    {
      id: 'nvidia',
      name: 'NVIDIA',
      category: 'manufacturer',
      details: {
        role: 'H100 GPU Assembly',
        marketShare: '95% AI GPU',
        revenue: '$60.9B (FY2024)',
        risk: 'low',
      },
      icon: <Cpu size={18} />,
      position: { x: 225, y: 450 },
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      category: 'customer',
      details: {
        role: 'Azure AI Infrastructure',
        cost: '$10B annual purchases',
        risk: 'low',
      },
      icon: <Building2 size={18} />,
      position: { x: 50, y: 650 },
    },
    {
      id: 'meta',
      name: 'Meta',
      category: 'customer',
      details: {
        role: 'AI Research & Training',
        cost: '$9B annual purchases',
        risk: 'low',
      },
      icon: <Building2 size={18} />,
      position: { x: 225, y: 650 },
    },
    {
      id: 'google',
      name: 'Google',
      category: 'customer',
      details: {
        role: 'Cloud AI & Gemini',
        cost: '$5B annual purchases',
        risk: 'low',
      },
      icon: <Building2 size={18} />,
      position: { x: 400, y: 650 },
    },
  ],
  links: [
    {
      source: 'asml',
      target: 'tsmc',
      label: 'EUV Systems',
      volume: '40 systems/year',
      bottleneck: false,
    },
    {
      source: 'tsmc',
      target: 'nvidia',
      label: '4nm Wafers + CoWoS',
      volume: '2M GPUs/year',
      bottleneck: true,
    },
    {
      source: 'sk-hynix',
      target: 'nvidia',
      label: 'HBM3E Stacks',
      volume: '2.4M GPUs/year max',
      bottleneck: true,
    },
    {
      source: 'nvidia',
      target: 'microsoft',
      label: 'H100 GPUs',
      volume: '$10B/year',
      bottleneck: false,
    },
    {
      source: 'nvidia',
      target: 'meta',
      label: 'H100 GPUs',
      volume: '$9B/year',
      bottleneck: false,
    },
    {
      source: 'nvidia',
      target: 'google',
      label: 'H100 GPUs',
      volume: '$5B/year',
      bottleneck: false,
    },
  ],
};
