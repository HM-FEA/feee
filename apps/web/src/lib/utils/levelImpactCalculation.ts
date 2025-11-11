/**
 * Level Impact Calculation System
 *
 * Calculates how level-specific controls (2-9) affect entities in the knowledge graph.
 * Uses formulas from levelSpecificControls.ts
 */

import { LevelState } from '@/lib/store/levelStore';
import { Entity, Relationship } from '@/data/knowledgeGraph';
import { ALL_EXPANDED_ENTITIES } from '@/data/expandedKnowledgeGraph';

/**
 * Entity Impact Result
 */
export interface EntityImpact {
  entityId: string;
  entityType: string;
  impactScore: number; // -1.0 to +1.0 (negative = bad, positive = good)
  impactPercentage: number; // Percentage change in value/performance
  affectedBy: string[]; // Which control IDs affected this entity
  details: {
    controlId: string;
    controlValue: number;
    impact: number;
    reason: string;
  }[];
}

/**
 * Calculate impact of level controls on all entities
 */
export function calculateAllEntityImpacts(levelState: LevelState): Map<string, EntityImpact> {
  const impacts = new Map<string, EntityImpact>();

  // Get all entities from knowledge graph
  const entities = ALL_EXPANDED_ENTITIES;

  entities.forEach(entity => {
    const impact = calculateEntityImpact(entity, levelState);
    if (impact) {
      impacts.set(entity.id, impact);
    }
  });

  return impacts;
}

/**
 * Calculate impact for a single entity based on its type
 */
function calculateEntityImpact(entity: Entity, levelState: LevelState): EntityImpact | null {
  const details: EntityImpact['details'] = [];
  let totalImpact = 0;

  // Apply level-specific formulas based on entity type
  switch (entity.type) {
    case 'COMPANY':
      totalImpact += calculateCompanyImpact(entity, levelState, details);
      break;
    case 'PRODUCT':
      totalImpact += calculateProductImpact(entity, levelState, details);
      break;
    case 'COMPONENT':
      totalImpact += calculateComponentImpact(entity, levelState, details);
      break;
    case 'TECHNOLOGY':
      totalImpact += calculateTechnologyImpact(entity, levelState, details);
      break;
    case 'CUSTOMER':
      totalImpact += calculateCustomerImpact(entity, levelState, details);
      break;
    default:
      return null;
  }

  if (details.length === 0) return null;

  // Normalize total impact to -1.0 to +1.0
  const normalizedImpact = Math.max(-1.0, Math.min(1.0, totalImpact));

  return {
    entityId: entity.id,
    entityType: entity.type,
    impactScore: normalizedImpact,
    impactPercentage: normalizedImpact * 100,
    affectedBy: details.map(d => d.controlId),
    details
  };
}

/**
 * LEVEL 3: Company Impact Calculations
 */
function calculateCompanyImpact(
  entity: Entity,
  levelState: LevelState,
  details: EntityImpact['details']
): number {
  let impact = 0;

  // Semiconductor sector companies
  if (entity.metadata?.sector === 'SEMICONDUCTOR') {
    // Semiconductor CapEx Index impact
    const capexIndex = levelState['semiconductor_capex_index'] || 100;
    const capexBaseline = 100;
    if (Math.abs(capexIndex - capexBaseline) > 5) {
      const capexImpact = (capexIndex - capexBaseline) / 100 * 0.5; // 50% sensitivity
      impact += capexImpact;
      details.push({
        controlId: 'semiconductor_capex_index',
        controlValue: capexIndex,
        impact: capexImpact,
        reason: `Semiconductor CapEx ${capexIndex > capexBaseline ? 'increase' : 'decrease'} affects industry investment`
      });
    }

    // NVIDIA-specific
    if (entity.id === 'company-nvidia') {
      const marketShare = levelState['nvidia_market_share'] || 85;
      const shareBaseline = 85;
      if (Math.abs(marketShare - shareBaseline) > 2) {
        const shareImpact = (marketShare - shareBaseline) / 100 * 0.8; // 80% sensitivity
        impact += shareImpact;
        details.push({
          controlId: 'nvidia_market_share',
          controlValue: marketShare,
          impact: shareImpact,
          reason: `AI GPU market share ${marketShare > shareBaseline ? 'gain' : 'loss'} directly affects revenue`
        });
      }
    }

    // TSMC-specific
    if (entity.id === 'company-tsmc') {
      const utilization = levelState['tsmc_utilization_rate'] || 95;
      const utilizationBaseline = 95;
      if (Math.abs(utilization - utilizationBaseline) > 3) {
        const utilizationImpact = (utilization - utilizationBaseline) / 100 * 0.6;
        impact += utilizationImpact;
        details.push({
          controlId: 'tsmc_utilization_rate',
          controlValue: utilization,
          impact: utilizationImpact,
          reason: `Fab utilization ${utilization > utilizationBaseline ? 'increase' : 'decrease'} affects pricing power`
        });
      }
    }

    // SK Hynix-specific (HBM supplier)
    if (entity.id === 'company-sk-hynix') {
      const hbmShare = levelState['sk_hynix_hbm_share'] || 50;
      const hbmBaseline = 50;
      if (Math.abs(hbmShare - hbmBaseline) > 5) {
        const hbmImpact = (hbmShare - hbmBaseline) / 100 * 0.7;
        impact += hbmImpact;
        details.push({
          controlId: 'sk_hynix_hbm_share',
          controlValue: hbmShare,
          impact: hbmImpact,
          reason: `HBM market share ${hbmShare > hbmBaseline ? 'expansion' : 'contraction'} affects revenue`
        });
      }
    }
  }

  // Technology sector - AI investment impact
  if (entity.metadata?.sector === 'TECHNOLOGY' || entity.id.includes('google') || entity.id.includes('microsoft') || entity.id.includes('meta') || entity.id.includes('amazon')) {
    const aiInvestment = levelState['ai_investment'] || 150;
    const aiBaseline = 150;
    if (Math.abs(aiInvestment - aiBaseline) > 10) {
      const aiImpact = (aiInvestment - aiBaseline) / aiBaseline * 0.6;
      impact += aiImpact;
      details.push({
        controlId: 'ai_investment',
        controlValue: aiInvestment,
        impact: aiImpact,
        reason: `Global AI investment ${aiInvestment > aiBaseline ? 'surge' : 'decline'} affects cloud AI demand`
      });
    }
  }

  return impact;
}

/**
 * LEVEL 4: Product Impact Calculations
 */
function calculateProductImpact(
  entity: Entity,
  levelState: LevelState,
  details: EntityImpact['details']
): number {
  let impact = 0;

  // AI GPU products (H100, A100, MI300X, etc.)
  if (entity.id.includes('h100') || entity.id.includes('a100') || entity.id.includes('gpu') || entity.id.includes('mi300')) {
    const gpuDemand = levelState['gpu_demand_index'] || 85;
    const demandBaseline = 85;
    if (Math.abs(gpuDemand - demandBaseline) > 5) {
      const demandImpact = (gpuDemand - demandBaseline) / 100 * 0.9; // 90% sensitivity
      impact += demandImpact;
      details.push({
        controlId: 'gpu_demand_index',
        controlValue: gpuDemand,
        impact: demandImpact,
        reason: `AI GPU demand ${gpuDemand > demandBaseline ? 'surge' : 'decline'} affects production & pricing`
      });
    }
  }

  // Smartphone products
  if (entity.id.includes('iphone') || entity.id.includes('galaxy') || entity.metadata?.category === 'smartphone') {
    const smartphoneDemand = levelState['smartphone_demand'] || 100;
    const demandBaseline = 100;
    if (Math.abs(smartphoneDemand - demandBaseline) > 10) {
      const demandImpact = (smartphoneDemand - demandBaseline) / 100 * 0.7;
      impact += demandImpact;
      details.push({
        controlId: 'smartphone_demand',
        controlValue: smartphoneDemand,
        impact: demandImpact,
        reason: `Smartphone shipments ${smartphoneDemand > demandBaseline ? 'increase' : 'decrease'}`
      });
    }
  }

  // Cloud services
  if (entity.id.includes('azure') || entity.id.includes('aws') || entity.id.includes('gcp') || entity.metadata?.category === 'cloud') {
    const cloudGrowth = levelState['cloud_service_growth'] || 25;
    const growthBaseline = 25;
    if (Math.abs(cloudGrowth - growthBaseline) > 5) {
      const cloudImpact = (cloudGrowth - growthBaseline) / 100 * 0.8;
      impact += cloudImpact;
      details.push({
        controlId: 'cloud_service_growth',
        controlValue: cloudGrowth,
        impact: cloudImpact,
        reason: `Cloud infrastructure growth ${cloudGrowth > growthBaseline ? 'acceleration' : 'slowdown'}`
      });
    }
  }

  return impact;
}

/**
 * LEVEL 5: Component Impact Calculations
 */
function calculateComponentImpact(
  entity: Entity,
  levelState: LevelState,
  details: EntityImpact['details']
): number {
  let impact = 0;

  // HBM3E memory
  if (entity.id.includes('hbm')) {
    const hbmSupply = levelState['hbm3e_supply_index'] || 100;
    const supplyBaseline = 100;

    // Supply constraint creates bottleneck (negative for supply, positive for HBM price/value)
    if (hbmSupply < 80) {
      const bottleneckImpact = (80 - hbmSupply) / 100 * 0.5; // Scarcity increases value
      impact += bottleneckImpact;
      details.push({
        controlId: 'hbm3e_supply_index',
        controlValue: hbmSupply,
        impact: bottleneckImpact,
        reason: 'HBM3E supply shortage creates bottleneck, increases component value'
      });
    } else if (hbmSupply > 120) {
      const oversupplyImpact = (hbmSupply - 120) / 100 * -0.3; // Oversupply reduces value
      impact += oversupplyImpact;
      details.push({
        controlId: 'hbm3e_supply_index',
        controlValue: hbmSupply,
        impact: oversupplyImpact,
        reason: 'HBM3E oversupply reduces pricing power'
      });
    }
  }

  // DRAM
  if (entity.id.includes('dram') || entity.metadata?.componentType === 'memory') {
    const dramPrice = levelState['dram_price_index'] || 100;
    const priceBaseline = 100;
    if (Math.abs(dramPrice - priceBaseline) > 10) {
      const priceImpact = (dramPrice - priceBaseline) / 100 * 0.4;
      impact += priceImpact;
      details.push({
        controlId: 'dram_price_index',
        controlValue: dramPrice,
        impact: priceImpact,
        reason: `DRAM price ${dramPrice > priceBaseline ? 'increase' : 'decrease'} affects memory module costs`
      });
    }
  }

  // Advanced packaging (CoWoS)
  if (entity.id.includes('cowos') || entity.id.includes('packaging')) {
    const cowosCapacity = levelState['cowos_capacity'] || 15000;
    const capacityBaseline = 15000;
    if (Math.abs(cowosCapacity - capacityBaseline) > 1000) {
      const capacityImpact = (cowosCapacity - capacityBaseline) / capacityBaseline * 0.5;
      impact += capacityImpact;
      details.push({
        controlId: 'cowos_capacity',
        controlValue: cowosCapacity,
        impact: capacityImpact,
        reason: `CoWoS packaging capacity ${cowosCapacity > capacityBaseline ? 'expansion' : 'constraint'}`
      });
    }
  }

  return impact;
}

/**
 * LEVEL 6: Technology Impact Calculations
 */
function calculateTechnologyImpact(
  entity: Entity,
  levelState: LevelState,
  details: EntityImpact['details']
): number {
  let impact = 0;

  // AI/ML technologies
  if (entity.id.includes('cuda') || entity.id.includes('tensor') || entity.metadata?.category === 'ai') {
    const aiInvestment = levelState['ai_investment'] || 150;
    const investmentBaseline = 150;
    if (Math.abs(aiInvestment - investmentBaseline) > 20) {
      const aiImpact = (aiInvestment - investmentBaseline) / investmentBaseline * 0.9;
      impact += aiImpact;
      details.push({
        controlId: 'ai_investment',
        controlValue: aiInvestment,
        impact: aiImpact,
        reason: `AI infrastructure investment ${aiInvestment > investmentBaseline ? 'boom' : 'slowdown'} affects ecosystem`
      });
    }

    // CUDA ecosystem lock-in
    if (entity.id.includes('cuda')) {
      const cudaStrength = levelState['cuda_ecosystem_strength'] || 90;
      const cudaBaseline = 90;
      if (Math.abs(cudaStrength - cudaBaseline) > 5) {
        const cudaImpact = (cudaStrength - cudaBaseline) / 100 * 0.6;
        impact += cudaImpact;
        details.push({
          controlId: 'cuda_ecosystem_strength',
          controlValue: cudaStrength,
          impact: cudaImpact,
          reason: `CUDA developer adoption ${cudaStrength > cudaBaseline ? 'strengthens' : 'weakens'} platform lock-in`
        });
      }
    }
  }

  // Semiconductor process technology
  if (entity.id.includes('euv') || entity.id.includes('3nm') || entity.id.includes('5nm')) {
    const processAdvancement = levelState['process_node_advancement'] || 100;
    const processBaseline = 100;
    if (Math.abs(processAdvancement - processBaseline) > 10) {
      const processImpact = (processAdvancement - processBaseline) / 100 * 0.7;
      impact += processImpact;
      details.push({
        controlId: 'process_node_advancement',
        controlValue: processAdvancement,
        impact: processImpact,
        reason: `Process node advancement ${processAdvancement > processBaseline ? 'acceleration' : 'slowdown'}`
      });
    }
  }

  return impact;
}

/**
 * LEVEL 8: Customer Impact Calculations
 */
function calculateCustomerImpact(
  entity: Entity,
  levelState: LevelState,
  details: EntityImpact['details']
): number {
  let impact = 0;

  // Hyperscalers (Microsoft, Meta, Google, Amazon)
  if (entity.id.includes('microsoft') || entity.id.includes('meta') || entity.id.includes('google') || entity.id.includes('amazon')) {
    const hyperscalerCapex = levelState['hyperscaler_capex'] || 180;
    const capexBaseline = 180;
    if (Math.abs(hyperscalerCapex - capexBaseline) > 20) {
      const capexImpact = (hyperscalerCapex - capexBaseline) / capexBaseline * 1.2; // 120% sensitivity (elastic demand)
      impact += capexImpact;
      details.push({
        controlId: 'hyperscaler_capex',
        controlValue: hyperscalerCapex,
        impact: capexImpact,
        reason: `Hyperscaler CapEx ${hyperscalerCapex > capexBaseline ? 'increase' : 'decrease'} drives GPU orders`
      });
    }
  }

  return impact;
}

/**
 * Get entities most affected by a specific control change
 */
export function getAffectedEntities(
  controlId: string,
  impactMap: Map<string, EntityImpact>
): EntityImpact[] {
  const affected: EntityImpact[] = [];

  impactMap.forEach(impact => {
    if (impact.affectedBy.includes(controlId)) {
      affected.push(impact);
    }
  });

  // Sort by absolute impact magnitude
  return affected.sort((a, b) => Math.abs(b.impactScore) - Math.abs(a.impactScore));
}

/**
 * Get color for impact visualization (red = negative, green = positive)
 */
export function getImpactColor(impactScore: number): string {
  if (impactScore > 0.3) return '#00FF9F'; // Strong positive - emerald
  if (impactScore > 0.1) return '#4ADE80'; // Moderate positive - green
  if (impactScore > -0.1) return '#94A3B8'; // Neutral - gray
  if (impactScore > -0.3) return '#FB923C'; // Moderate negative - orange
  return '#EF4444'; // Strong negative - red
}

/**
 * Get size multiplier for impact visualization
 */
export function getImpactSizeMultiplier(impactScore: number): number {
  // Base size = 1.0, range from 0.7 to 1.5
  return 1.0 + (impactScore * 0.5);
}
