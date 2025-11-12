'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Building2, Cpu, Factory, Zap, AlertTriangle } from 'lucide-react';

/**
 * H100 Digital Twin 3D Visualization
 *
 * React Three Fiber를 사용한 NVIDIA H100 GPU 공급망 3D 시뮬레이션
 * - ASML EUV → TSMC 4nm/CoWoS → SK Hynix HBM3E → NVIDIA H100 → Customers
 * - 실시간 병목 시각화
 * - 인터랙티브 노드 클릭
 */

interface Node3D {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
  size: number;
  type: 'equipment' | 'manufacturer' | 'component' | 'customer';
  bottleneck?: boolean;
  data?: {
    revenue?: string;
    capacity?: string;
    leadTime?: string;
    risk?: 'low' | 'medium' | 'high' | 'critical';
  };
}

interface Link3D {
  from: string;
  to: string;
  color: string;
  animated?: boolean;
  label?: string;
}

// H100 Supply Chain 3D Data
const NODES_3D: Node3D[] = [
  {
    id: 'asml',
    name: 'ASML',
    position: [-6, 4, 0],
    color: '#F59E0B',
    size: 1.2,
    type: 'equipment',
    data: {
      revenue: '€27.6B',
      capacity: '40 EUV/year',
      leadTime: '18-24 months',
      risk: 'medium',
    },
  },
  {
    id: 'tsmc',
    name: 'TSMC',
    position: [-3, 2, 0],
    color: '#8B5CF6',
    size: 1.5,
    type: 'manufacturer',
    bottleneck: true,
    data: {
      revenue: '$69.3B',
      capacity: '25K CoWoS wafers/month',
      leadTime: '60-90 days',
      risk: 'critical',
    },
  },
  {
    id: 'sk-hynix',
    name: 'SK Hynix',
    position: [3, 2, 0],
    color: '#10B981',
    size: 1.4,
    type: 'component',
    bottleneck: true,
    data: {
      revenue: '$36.7B',
      capacity: '400K HBM3E stacks/month',
      leadTime: '90 days',
      risk: 'critical',
    },
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    position: [0, 0, 0],
    color: '#00E5FF',
    size: 2.0,
    type: 'manufacturer',
    data: {
      revenue: '$60.9B FY2024',
      capacity: '2M H100/year',
      leadTime: '52 weeks',
      risk: 'low',
    },
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    position: [-4, -2, -1],
    color: '#06B6D4',
    size: 1.3,
    type: 'customer',
    data: {
      revenue: '$10B annual purchases',
      risk: 'low',
    },
  },
  {
    id: 'meta',
    name: 'Meta',
    position: [0, -2, -1],
    color: '#E6007A',
    size: 1.2,
    type: 'customer',
    data: {
      revenue: '$9B annual purchases',
      risk: 'low',
    },
  },
  {
    id: 'google',
    name: 'Google',
    position: [4, -2, -1],
    color: '#FFD700',
    size: 1.1,
    type: 'customer',
    data: {
      revenue: '$5B annual purchases',
      risk: 'low',
    },
  },
];

const LINKS_3D: Link3D[] = [
  { from: 'asml', to: 'tsmc', color: '#F59E0B', label: 'EUV Systems' },
  { from: 'tsmc', to: 'nvidia', color: '#EF4444', animated: true, label: '4nm Wafers (Bottleneck)' },
  { from: 'sk-hynix', to: 'nvidia', color: '#EF4444', animated: true, label: 'HBM3E (Bottleneck)' },
  { from: 'nvidia', to: 'microsoft', color: '#06B6D4', label: '$10B/year' },
  { from: 'nvidia', to: 'meta', color: '#E6007A', label: '$9B/year' },
  { from: 'nvidia', to: 'google', color: '#FFD700', label: '$5B/year' },
];

// Animated Node Component
function AnimatedNode({ node, onClick, selected }: { node: Node3D; onClick: () => void; selected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation animation
      meshRef.current.rotation.y += 0.01;

      // Bottleneck pulsing
      if (node.bottleneck) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      }

      // Hover effect
      if (hovered || selected) {
        meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[node.size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={node.bottleneck ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>

      {node.bottleneck && (
        <Sphere args={[node.size * 1.3, 16, 16]} scale={hovered ? 1.1 : 1}>
          <meshBasicMaterial color="#EF4444" transparent opacity={0.1} wireframe />
        </Sphere>
      )}

      <Text
        position={[0, node.size + 0.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {node.name}
      </Text>

      {node.bottleneck && (
        <Html distanceFactor={10} position={[0, node.size + 1, 0]}>
          <div className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            ⚠️ Bottleneck
          </div>
        </Html>
      )}
    </group>
  );
}

// Animated Connection Line
function ConnectionLine({ from, to, color, animated }: { from: Node3D; to: Node3D; color: string; animated?: boolean }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from.position),
      new THREE.Vector3(
        (from.position[0] + to.position[0]) / 2,
        (from.position[1] + to.position[1]) / 2 + 1,
        (from.position[2] + to.position[2]) / 2
      ),
      new THREE.Vector3(...to.position),
    ]);
    return curve.getPoints(50);
  }, [from, to]);

  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current && animated) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={animated ? 3 : 1.5}
      transparent
      opacity={animated ? 0.8 : 0.5}
    />
  );
}

// Scene Component
function Scene({ selectedNode, onNodeClick }: { selectedNode: string | null; onNodeClick: (id: string) => void }) {
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node3D>();
    NODES_3D.forEach(node => map.set(node.id, node));
    return map;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00E5FF" />

      {/* Grid */}
      <gridHelper args={[20, 20, '#334155', '#1E293B']} position={[0, -5, 0]} />

      {/* Nodes */}
      {NODES_3D.map((node) => (
        <AnimatedNode
          key={node.id}
          node={node}
          onClick={() => onNodeClick(node.id)}
          selected={selectedNode === node.id}
        />
      ))}

      {/* Links */}
      {LINKS_3D.map((link, index) => {
        const from = nodeMap.get(link.from);
        const to = nodeMap.get(link.to);
        if (!from || !to) return null;

        return (
          <ConnectionLine
            key={index}
            from={from}
            to={to}
            color={link.color}
            animated={link.animated}
          />
        );
      })}

      {/* Center Platform */}
      <Box args={[0.5, 0.1, 0.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </Box>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main Component
export default function H100DigitalTwin3D() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return NODES_3D.find(n => n.id === selectedNode);
  }, [selectedNode]);

  return (
    <div className="h-full w-full relative bg-background-primary rounded-lg border border-border-primary overflow-hidden">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <Scene selectedNode={selectedNode} onNodeClick={setSelectedNode} />
      </Canvas>

      {/* Info Panel */}
      {selectedNodeData && (
        <div className="absolute top-4 right-4 w-80 bg-background-secondary/95 backdrop-blur-md border border-border-primary rounded-lg p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedNodeData.color + '33', color: selectedNodeData.color }}>
                {selectedNodeData.type === 'equipment' && <Factory size={20} />}
                {selectedNodeData.type === 'manufacturer' && <Cpu size={20} />}
                {selectedNodeData.type === 'component' && <Cpu size={20} />}
                {selectedNodeData.type === 'customer' && <Building2 size={20} />}
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">{selectedNodeData.name}</h3>
                <p className="text-xs text-text-tertiary capitalize">{selectedNodeData.type}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-text-tertiary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          {selectedNodeData.bottleneck && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 mb-3">
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                <AlertTriangle size={16} />
                <span>CRITICAL BOTTLENECK</span>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {selectedNodeData.data?.revenue && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Revenue:</span>
                <span className="text-text-primary font-semibold">{selectedNodeData.data.revenue}</span>
              </div>
            )}
            {selectedNodeData.data?.capacity && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Capacity:</span>
                <span className="text-text-primary font-semibold">{selectedNodeData.data.capacity}</span>
              </div>
            )}
            {selectedNodeData.data?.leadTime && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Lead Time:</span>
                <span className="text-text-primary font-semibold">{selectedNodeData.data.leadTime}</span>
              </div>
            )}
            {selectedNodeData.data?.risk && (
              <div className="flex justify-between">
                <span className="text-text-tertiary">Risk Level:</span>
                <span className={`font-semibold capitalize ${
                  selectedNodeData.data.risk === 'critical' ? 'text-red-400' :
                  selectedNodeData.data.risk === 'high' ? 'text-orange-400' :
                  selectedNodeData.data.risk === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {selectedNodeData.data.risk}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background-secondary/95 backdrop-blur-md border border-border-primary rounded-lg p-3">
        <div className="text-xs font-semibold text-text-secondary mb-2">Legend</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-cyan"></div>
            <span className="text-text-secondary">Normal Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-text-secondary">Bottleneck</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-accent-cyan"></div>
            <span className="text-text-secondary">Flow</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 bg-background-secondary/95 backdrop-blur-md border border-border-primary rounded-lg px-4 py-2">
        <h2 className="text-sm font-bold text-text-primary">H100 Supply Chain Digital Twin</h2>
        <p className="text-xs text-text-tertiary">3D Interactive Visualization</p>
      </div>
    </div>
  );
}
