/**
 * Supply Chain Propagation Engine
 *
 * Simulates how disruptions cascade through supply chain networks:
 * - SK Hynix HBM3E shortage → NVIDIA H100 production delays
 * - TSMC fab issues → Apple/AMD/NVIDIA chip shortages
 * - ASML EUV delays → All 3nm/5nm chip production slows
 * - Port congestion → Global electronics supply chain
 *
 * Implements:
 * - Bottleneck propagation (upstream → downstream)
 * - Lead time calculations
 * - Inventory buffer analysis
 * - Alternative sourcing logic
 * - Price elasticity and allocation
 */

/**
 * Supply Chain Node
 */
export interface SCNode {
  id: string;
  name: string;
  type: 'raw-material' | 'component' | 'manufacturer' | 'integrator' | 'distributor' | 'end-customer';
  level: number; // Tier level (0 = raw material, 5 = end customer)
  capacity: number; // Production capacity per period
  inventory: number; // Current inventory level
  leadTime: number; // Days to produce/deliver
  criticalityScore: number; // 0-100, how critical to downstream
  alternativeSources: string[]; // Alternative supplier IDs
}

/**
 * Supply Chain Link (Dependency)
 */
export interface SCLink {
  from: string; // Supplier node ID
  to: string; // Customer node ID
  quantityPerUnit: number; // How many supplier units needed per customer unit
  leadTime: number; // Delivery time in days
  reliability: number; // 0-1, probability of on-time delivery
  cost: number; // Cost per unit
  isBottleneck: boolean; // Manually flagged bottleneck
}

/**
 * Disruption Event
 */
export interface Disruption {
  id: string;
  nodeId: string; // Which node is disrupted
  type: 'shortage' | 'quality-issue' | 'logistics-delay' | 'price-surge' | 'force-majeure';
  severity: number; // 0-1, percentage impact on capacity
  startDate: Date;
  endDate: Date;
  description: string;
}

/**
 * Propagation Result
 */
export interface PropagationResult {
  step: number;
  timestamp: Date;
  affectedNodes: Map<string, NodeImpact>;
  criticalPaths: CriticalPath[];
  totalImpact: number; // Aggregate financial impact
  recommendations: string[];
}

export interface NodeImpact {
  nodeId: string;
  nodeName: string;
  impactSeverity: number; // 0-1
  productionShortfall: number; // Units per period
  revenueImpact: number; // $ lost
  delayDays: number; // Additional lead time
  probability: number; // Likelihood of this impact
  cascadeFrom: string[]; // Which upstream nodes caused this
}

export interface CriticalPath {
  nodes: string[]; // Path from source to sink
  totalLeadTime: number;
  bottleneckNode: string;
  maxImpact: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Build supply chain graph from nodes and links
 */
export function buildSupplyChainGraph(
  nodes: SCNode[],
  links: SCLink[]
): Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }> {
  const graph = new Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>();

  // Initialize nodes
  nodes.forEach((node) => {
    graph.set(node.id, {
      node,
      suppliers: [],
      customers: [],
    });
  });

  // Add links
  links.forEach((link) => {
    const supplierEntry = graph.get(link.from);
    const customerEntry = graph.get(link.to);

    if (supplierEntry) {
      supplierEntry.customers.push(link);
    }

    if (customerEntry) {
      customerEntry.suppliers.push(link);
    }
  });

  return graph;
}

/**
 * Propagate disruption through supply chain
 */
export function propagateDisruption(
  disruption: Disruption,
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  maxSteps: number = 10
): PropagationResult[] {
  const results: PropagationResult[] = [];
  const affectedNodes = new Map<string, NodeImpact>();

  // Initial impact
  const sourceEntry = graph.get(disruption.nodeId);
  if (!sourceEntry) return results;

  affectedNodes.set(disruption.nodeId, {
    nodeId: disruption.nodeId,
    nodeName: sourceEntry.node.name,
    impactSeverity: disruption.severity,
    productionShortfall: sourceEntry.node.capacity * disruption.severity,
    revenueImpact: sourceEntry.node.capacity * disruption.severity * 1000, // Simplified
    delayDays: Math.floor(disruption.severity * 30),
    probability: 1.0,
    cascadeFrom: [],
  });

  // BFS propagation
  let currentWave = [disruption.nodeId];
  let step = 0;

  while (currentWave.length > 0 && step < maxSteps) {
    const nextWave: string[] = [];

    for (const nodeId of currentWave) {
      const nodeEntry = graph.get(nodeId);
      if (!nodeEntry) continue;

      const nodeImpact = affectedNodes.get(nodeId);
      if (!nodeImpact) continue;

      // Propagate to customers (downstream)
      nodeEntry.customers.forEach((link) => {
        const customerEntry = graph.get(link.to);
        if (!customerEntry) return;

        // Calculate propagated impact
        const propagatedSeverity = nodeImpact.impactSeverity * link.reliability * 0.8; // 20% damping
        const customerShortfall = link.quantityPerUnit * nodeImpact.productionShortfall;

        // Check if customer has alternative sources
        const hasAlternatives = customerEntry.suppliers.length > 1;
        const alternativeFactor = hasAlternatives ? 0.5 : 1.0; // 50% mitigation if alternatives exist

        const finalSeverity = propagatedSeverity * alternativeFactor;

        if (finalSeverity > 0.05) {
          // Threshold: 5% impact
          const existingImpact = affectedNodes.get(link.to);

          if (!existingImpact || existingImpact.impactSeverity < finalSeverity) {
            affectedNodes.set(link.to, {
              nodeId: link.to,
              nodeName: customerEntry.node.name,
              impactSeverity: finalSeverity,
              productionShortfall: customerShortfall,
              revenueImpact: customerShortfall * 1500, // Higher value for downstream
              delayDays: nodeImpact.delayDays + link.leadTime,
              probability: nodeImpact.probability * link.reliability,
              cascadeFrom: [...(existingImpact?.cascadeFrom || []), nodeId],
            });

            nextWave.push(link.to);
          }
        }
      });
    }

    // Calculate critical paths
    const criticalPaths = findCriticalPaths(graph, affectedNodes);

    // Generate recommendations
    const recommendations = generateRecommendations(graph, affectedNodes, disruption);

    // Calculate total impact
    const totalImpact = Array.from(affectedNodes.values()).reduce(
      (sum, impact) => sum + impact.revenueImpact,
      0
    );

    results.push({
      step,
      timestamp: new Date(disruption.startDate.getTime() + step * 24 * 60 * 60 * 1000),
      affectedNodes: new Map(affectedNodes),
      criticalPaths,
      totalImpact,
      recommendations,
    });

    currentWave = nextWave;
    step++;
  }

  return results;
}

/**
 * Find critical paths in the supply chain
 */
function findCriticalPaths(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  affectedNodes: Map<string, NodeImpact>
): CriticalPath[] {
  const paths: CriticalPath[] = [];

  // Find paths from most upstream to most downstream affected nodes
  const sortedNodes = Array.from(affectedNodes.values()).sort((a, b) => {
    const aEntry = graph.get(a.nodeId);
    const bEntry = graph.get(b.nodeId);
    return (aEntry?.node.level || 0) - (bEntry?.node.level || 0);
  });

  const sourceNodes = sortedNodes.slice(0, 3); // Top 3 upstream
  const sinkNodes = sortedNodes.slice(-3); // Top 3 downstream

  for (const source of sourceNodes) {
    for (const sink of sinkNodes) {
      const path = findPath(graph, source.nodeId, sink.nodeId);
      if (path) {
        const totalLeadTime = calculatePathLeadTime(graph, path);
        const maxImpact = Math.max(...path.map((id) => affectedNodes.get(id)?.impactSeverity || 0));

        paths.push({
          nodes: path,
          totalLeadTime,
          bottleneckNode: findBottleneckInPath(graph, path, affectedNodes),
          maxImpact,
          priority: maxImpact > 0.7 ? 'critical' : maxImpact > 0.4 ? 'high' : maxImpact > 0.2 ? 'medium' : 'low',
        });
      }
    }
  }

  return paths.sort((a, b) => b.maxImpact - a.maxImpact).slice(0, 5);
}

/**
 * Find path between two nodes (BFS)
 */
function findPath(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  start: string,
  end: string
): string[] | null {
  const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (node === end) return path;
    if (visited.has(node)) continue;
    visited.add(node);

    const entry = graph.get(node);
    if (!entry) continue;

    entry.customers.forEach((link) => {
      if (!visited.has(link.to)) {
        queue.push({ node: link.to, path: [...path, link.to] });
      }
    });
  }

  return null;
}

/**
 * Calculate total lead time for a path
 */
function calculatePathLeadTime(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  path: string[]
): number {
  let totalLeadTime = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    const entry = graph.get(from);
    const link = entry?.customers.find((l) => l.to === to);

    if (link) {
      totalLeadTime += link.leadTime;
    }
  }

  return totalLeadTime;
}

/**
 * Find bottleneck node in path
 */
function findBottleneckInPath(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  path: string[],
  affectedNodes: Map<string, NodeImpact>
): string {
  let maxImpact = 0;
  let bottleneck = path[0];

  path.forEach((nodeId) => {
    const impact = affectedNodes.get(nodeId);
    const node = graph.get(nodeId)?.node;

    if (impact && node) {
      const score = impact.impactSeverity * node.criticalityScore;
      if (score > maxImpact) {
        maxImpact = score;
        bottleneck = nodeId;
      }
    }
  });

  return bottleneck;
}

/**
 * Generate recommendations for mitigation
 */
function generateRecommendations(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>,
  affectedNodes: Map<string, NodeImpact>,
  disruption: Disruption
): string[] {
  const recommendations: string[] = [];

  // 1. Alternative sourcing
  const sourceEntry = graph.get(disruption.nodeId);
  if (sourceEntry && sourceEntry.node.alternativeSources.length > 0) {
    recommendations.push(
      `Activate alternative sources: ${sourceEntry.node.alternativeSources.join(', ')}`
    );
  }

  // 2. Inventory buffer
  const criticalNodes = Array.from(affectedNodes.values())
    .filter((impact) => impact.impactSeverity > 0.5)
    .slice(0, 3);

  criticalNodes.forEach((impact) => {
    const entry = graph.get(impact.nodeId);
    if (entry && entry.node.inventory < entry.node.capacity * 0.5) {
      recommendations.push(
        `Increase inventory buffer for ${entry.node.name} (current: ${(entry.node.inventory / entry.node.capacity * 100).toFixed(0)}%)`
      );
    }
  });

  // 3. Pre-buy critical components
  if (disruption.type === 'shortage') {
    recommendations.push(
      `Pre-purchase critical components from ${sourceEntry?.node.name} before shortage worsens`
    );
  }

  // 4. Expedited shipping
  const delayedNodes = Array.from(affectedNodes.values()).filter(
    (impact) => impact.delayDays > 14
  );

  if (delayedNodes.length > 0) {
    recommendations.push(
      `Consider expedited shipping for ${delayedNodes.length} delayed nodes (avg delay: ${Math.floor(delayedNodes.reduce((sum, n) => sum + n.delayDays, 0) / delayedNodes.length)} days)`
    );
  }

  // 5. Customer communication
  if (affectedNodes.size > 5) {
    recommendations.push(
      `Proactive customer communication required - ${affectedNodes.size} nodes affected`
    );
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}

/**
 * Calculate supply chain resilience score
 */
export function calculateResilienceScore(
  graph: Map<string, { node: SCNode; suppliers: SCLink[]; customers: SCLink[] }>
): {
  overallScore: number;
  diversificationScore: number;
  inventoryScore: number;
  reliabilityScore: number;
  bottleneckRisk: number;
} {
  let diversificationScore = 0;
  let inventoryScore = 0;
  let reliabilityScore = 0;
  let bottleneckCount = 0;

  const nodes = Array.from(graph.values());

  nodes.forEach((entry) => {
    // Diversification: multiple suppliers
    const supplierCount = entry.suppliers.length;
    diversificationScore += supplierCount > 1 ? 1 : 0;

    // Inventory buffer
    const inventoryRatio = entry.node.inventory / entry.node.capacity;
    inventoryScore += Math.min(inventoryRatio, 1.0);

    // Reliability
    const avgReliability =
      entry.suppliers.reduce((sum, link) => sum + link.reliability, 0) / Math.max(entry.suppliers.length, 1);
    reliabilityScore += avgReliability;

    // Bottleneck detection
    if (entry.suppliers.length === 1 && entry.customers.length > 3) {
      bottleneckCount++;
    }
  });

  const n = nodes.length;
  diversificationScore = (diversificationScore / n) * 100;
  inventoryScore = (inventoryScore / n) * 100;
  reliabilityScore = (reliabilityScore / n) * 100;
  const bottleneckRisk = (bottleneckCount / n) * 100;

  const overallScore = (diversificationScore + inventoryScore + reliabilityScore - bottleneckRisk) / 3;

  return {
    overallScore,
    diversificationScore,
    inventoryScore,
    reliabilityScore,
    bottleneckRisk,
  };
}
