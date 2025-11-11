/**
 * Timeline Simulation Engine
 *
 * 시간에 따른 impact 전파를 시뮬레이션합니다.
 * t=0에서 시작하여 각 time step마다 영향이 전파되는 과정을 추적합니다.
 */

import { MacroState } from '@/lib/store/macroStore';
import { LevelState } from '@/lib/store/levelStore';
import { EntityImpact } from '@/lib/utils/levelImpactCalculation';
import { ALL_EXPANDED_ENTITIES, Entity } from '@/data/expandedKnowledgeGraph';

export interface TimeStep {
  time: number; // 시간 (0, 1, 2, ...)
  description: string; // 이 time step의 설명
  entityStates: Map<string, EntityState>; // 각 엔티티의 상태
  activeChanges: ChangeEvent[]; // 이 step에서 발생한 변화들
}

export interface EntityState {
  entityId: string;
  entityName: string;
  entityType: string;
  value: number; // 0-100 스케일 (정규화된 값)
  impactScore: number; // -1.0 ~ +1.0
  changeFromPrevious: number; // 이전 step과의 차이
  isActive: boolean; // 이 step에서 변화가 있었는가
  affectedBy: string[]; // 어떤 컨트롤/엔티티에 의해 영향받았는가
}

export interface ChangeEvent {
  sourceId: string; // 영향을 준 엔티티/컨트롤
  sourceName: string;
  targetId: string; // 영향받은 엔티티
  targetName: string;
  impactMagnitude: number; // 영향의 크기
  propagationDelay: number; // 전파 지연 (time steps)
}

export interface SimulationConfig {
  maxTimeSteps: number; // 최대 시뮬레이션 시간
  convergenceThreshold: number; // 수렴 판정 기준 (변화가 이 값보다 작으면 종료)
  propagationSpeed: number; // 전파 속도 (1.0 = 정상, 0.5 = 느림, 2.0 = 빠름)
}

const DEFAULT_CONFIG: SimulationConfig = {
  maxTimeSteps: 10,
  convergenceThreshold: 0.01,
  propagationSpeed: 1.0,
};

/**
 * 타임라인 시뮬레이션 실행
 */
export function runTimelineSimulation(
  macroState: MacroState,
  levelState: LevelState,
  config: Partial<SimulationConfig> = {}
): TimeStep[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const timeSteps: TimeStep[] = [];

  // t=0: 초기 상태
  const initialState = createInitialState(macroState, levelState);
  timeSteps.push({
    time: 0,
    description: 'Initial state - Controls adjusted',
    entityStates: initialState,
    activeChanges: [],
  });

  // t=1부터 시뮬레이션 진행
  let currentState = new Map(initialState);

  for (let t = 1; t <= finalConfig.maxTimeSteps; t++) {
    const { nextState, changes, hasConverged } = propagateOneStep(
      currentState,
      macroState,
      levelState,
      t,
      finalConfig
    );

    timeSteps.push({
      time: t,
      description: getStepDescription(t, changes),
      entityStates: nextState,
      activeChanges: changes,
    });

    // 수렴 체크
    if (hasConverged) {
      console.log(`Simulation converged at t=${t}`);
      break;
    }

    currentState = nextState;
  }

  return timeSteps;
}

/**
 * 초기 상태 생성 (t=0)
 */
function createInitialState(
  macroState: MacroState,
  levelState: LevelState
): Map<string, EntityState> {
  const entityStates = new Map<string, EntityState>();

  ALL_EXPANDED_ENTITIES.forEach((entity) => {
    const baseValue = getEntityBaseValue(entity);
    const directImpact = calculateDirectImpact(entity, levelState);

    entityStates.set(entity.id, {
      entityId: entity.id,
      entityName: entity.name,
      entityType: entity.type,
      value: baseValue,
      impactScore: directImpact,
      changeFromPrevious: directImpact,
      isActive: Math.abs(directImpact) > 0.05,
      affectedBy: getDirectAffectors(entity.id, levelState),
    });
  });

  return entityStates;
}

/**
 * 한 time step 전파
 */
function propagateOneStep(
  currentState: Map<string, EntityState>,
  macroState: MacroState,
  levelState: LevelState,
  timeStep: number,
  config: SimulationConfig
): {
  nextState: Map<string, EntityState>;
  changes: ChangeEvent[];
  hasConverged: boolean;
} {
  const nextState = new Map<string, EntityState>();
  const changes: ChangeEvent[] = [];
  let totalChange = 0;

  // 각 엔티티에 대해 다음 상태 계산
  ALL_EXPANDED_ENTITIES.forEach((entity) => {
    const currentEntityState = currentState.get(entity.id)!;

    // 간접 영향 계산 (다른 엔티티로부터의 전파)
    const indirectImpact = calculateIndirectImpact(
      entity,
      currentState,
      timeStep,
      config.propagationSpeed
    );

    // 새 상태 = 현재 상태 + 간접 영향
    const newImpactScore = currentEntityState.impactScore + indirectImpact * 0.3; // 30% 전파율
    const changeFromPrevious = newImpactScore - currentEntityState.impactScore;

    totalChange += Math.abs(changeFromPrevious);

    nextState.set(entity.id, {
      ...currentEntityState,
      impactScore: newImpactScore,
      changeFromPrevious,
      isActive: Math.abs(changeFromPrevious) > 0.01,
    });

    // 변화 이벤트 기록
    if (Math.abs(changeFromPrevious) > 0.01) {
      const affectingSources = findAffectingSources(entity, currentState);
      affectingSources.forEach((source) => {
        changes.push({
          sourceId: source.entityId,
          sourceName: source.entityName,
          targetId: entity.id,
          targetName: entity.name,
          impactMagnitude: changeFromPrevious,
          propagationDelay: timeStep,
        });
      });
    }
  });

  const hasConverged = totalChange < config.convergenceThreshold;

  return { nextState, changes, hasConverged };
}

/**
 * 엔티티의 기본 값 (정규화된 0-100)
 */
function getEntityBaseValue(entity: Entity): number {
  // 실제로는 각 엔티티의 실제 값을 사용해야 하지만,
  // 여기서는 간단히 50 (중립)으로 시작
  return 50;
}

/**
 * 직접 영향 계산 (level controls로부터)
 */
function calculateDirectImpact(entity: Entity, levelState: LevelState): number {
  let impact = 0;

  // COMPANY level
  if (entity.type === 'COMPANY') {
    if (entity.id === 'company-nvidia' && levelState['nvidia_market_share']) {
      const marketShare = levelState['nvidia_market_share'];
      impact += (marketShare - 85) / 100 * 0.8;
    }
    if (entity.id === 'company-tsmc' && levelState['tsmc_utilization_rate']) {
      const utilization = levelState['tsmc_utilization_rate'];
      impact += (utilization - 85) / 100 * 0.6;
    }
    if (entity.id === 'company-sk-hynix' && levelState['sk_hynix_hbm_share']) {
      const hbmShare = levelState['sk_hynix_hbm_share'];
      impact += (hbmShare - 50) / 100 * 0.7;
    }
  }

  // PRODUCT level
  if (entity.type === 'PRODUCT') {
    if (entity.id.includes('gpu') && levelState['gpu_demand_index']) {
      const demand = levelState['gpu_demand_index'];
      impact += (demand - 100) / 100 * 0.9;
    }
    if (entity.id.includes('smartphone') && levelState['smartphone_demand']) {
      const demand = levelState['smartphone_demand'];
      impact += (demand - 1200) / 1200 * 0.7;
    }
  }

  // COMPONENT level
  if (entity.type === 'COMPONENT') {
    if (entity.id === 'component-hbm3e' && levelState['hbm3e_supply_index']) {
      const supply = levelState['hbm3e_supply_index'];
      impact += (supply - 100) / 100 * 0.8;
    }
    if (entity.id.includes('dram') && levelState['dram_price_index']) {
      const price = levelState['dram_price_index'];
      impact += (price - 100) / 100 * 0.4;
    }
  }

  // CUSTOMER level
  if (entity.type === 'CUSTOMER') {
    if (levelState['hyperscaler_capex']) {
      const capex = levelState['hyperscaler_capex'];
      impact += (capex - 180) / 180 * 1.2;
    }
  }

  return impact;
}

/**
 * 간접 영향 계산 (다른 엔티티로부터의 전파)
 */
function calculateIndirectImpact(
  entity: Entity,
  currentState: Map<string, EntityState>,
  timeStep: number,
  propagationSpeed: number
): number {
  let indirectImpact = 0;

  // 연결된 엔티티들로부터 영향 받기
  const connections = getEntityConnections(entity.id);

  connections.forEach((connectedId) => {
    const connectedState = currentState.get(connectedId);
    if (connectedState && connectedState.isActive) {
      // 거리에 따른 감쇠 (시간이 지날수록 약해짐)
      const distanceDecay = Math.exp(-0.3 * (timeStep - 1));
      const connectionStrength = 0.5; // 연결 강도 (실제로는 관계 타입에 따라 다름)

      indirectImpact += connectedState.impactScore * connectionStrength * distanceDecay * propagationSpeed;
    }
  });

  return indirectImpact;
}

/**
 * 엔티티 간 연결 관계 (간단한 버전)
 */
function getEntityConnections(entityId: string): string[] {
  const connections: Record<string, string[]> = {
    // NVIDIA → Products
    'company-nvidia': ['product-h100', 'product-a100', 'product-rtx4090'],

    // Products → Components
    'product-h100': ['component-hbm3e', 'component-cowos'],
    'product-a100': ['component-hbm2e', 'component-cowos'],

    // Components → Suppliers
    'component-hbm3e': ['company-sk-hynix', 'company-samsung'],
    'component-cowos': ['company-tsmc'],

    // Customers → Products
    'customer-microsoft': ['product-h100', 'product-azure-ai'],
    'customer-meta': ['product-h100'],
    'customer-google': ['product-h100', 'product-tpu-v5'],
    'customer-amazon': ['product-h100', 'product-aws-trainium'],
  };

  return connections[entityId] || [];
}

/**
 * 직접 영향을 주는 컨트롤 찾기
 */
function getDirectAffectors(entityId: string, levelState: LevelState): string[] {
  const affectors: string[] = [];

  if (entityId === 'company-nvidia' && levelState['nvidia_market_share']) {
    affectors.push('nvidia_market_share');
  }
  if (entityId === 'company-tsmc' && levelState['tsmc_utilization_rate']) {
    affectors.push('tsmc_utilization_rate');
  }
  if (entityId === 'component-hbm3e' && levelState['hbm3e_supply_index']) {
    affectors.push('hbm3e_supply_index');
  }

  return affectors;
}

/**
 * 영향을 주는 소스 엔티티 찾기
 */
function findAffectingSources(
  entity: Entity,
  currentState: Map<string, EntityState>
): EntityState[] {
  const sources: EntityState[] = [];

  // 역방향 연결 찾기
  ALL_EXPANDED_ENTITIES.forEach((otherEntity) => {
    const connections = getEntityConnections(otherEntity.id);
    if (connections.includes(entity.id)) {
      const sourceState = currentState.get(otherEntity.id);
      if (sourceState && sourceState.isActive) {
        sources.push(sourceState);
      }
    }
  });

  return sources;
}

/**
 * Time step 설명 생성
 */
function getStepDescription(timeStep: number, changes: ChangeEvent[]): string {
  if (timeStep === 1) {
    return `Direct impact - ${changes.length} entities affected`;
  } else if (timeStep === 2) {
    return `Secondary propagation - Downstream effects`;
  } else if (timeStep === 3) {
    return `Tertiary propagation - Supply chain ripples`;
  } else {
    return `Step ${timeStep} - Continued propagation`;
  }
}

/**
 * 애니메이션 프레임 생성 (t1과 t2 사이를 보간)
 */
export function interpolateTimeSteps(
  step1: TimeStep,
  step2: TimeStep,
  progress: number // 0.0 ~ 1.0
): Map<string, EntityState> {
  const interpolatedState = new Map<string, EntityState>();

  step1.entityStates.forEach((state1, entityId) => {
    const state2 = step2.entityStates.get(entityId);
    if (!state2) {
      interpolatedState.set(entityId, state1);
      return;
    }

    // 값들을 보간
    interpolatedState.set(entityId, {
      ...state1,
      impactScore: state1.impactScore + (state2.impactScore - state1.impactScore) * progress,
      value: state1.value + (state2.value - state1.value) * progress,
      isActive: progress < 0.5 ? state1.isActive : state2.isActive,
    });
  });

  return interpolatedState;
}
