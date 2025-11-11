'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, TrendingUp, TrendingDown, ArrowRight, Activity } from 'lucide-react';
import { useLevelStore } from '@/lib/store/levelStore';
import { getAffectedEntities } from '@/lib/utils/levelImpactCalculation';
import { ALL_EXPANDED_ENTITIES } from '@/data/expandedKnowledgeGraph';

/**
 * Cascade Effects Animation
 *
 * Shows real-time propagation of control changes through the knowledge graph
 */

interface CascadeEvent {
  id: string;
  controlId: string;
  controlName: string;
  timestamp: number;
  affectedCount: number;
  topAffectedEntities: {
    entityId: string;
    entityName: string;
    impactScore: number;
    level: string;
  }[];
}

export default function CascadeEffects() {
  const [cascadeEvents, setCascadeEvents] = useState<CascadeEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const entityImpacts = useLevelStore((state) => state.entityImpacts);
  const previousImpactsRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    // Detect changes in entity impacts
    const previousImpacts = previousImpactsRef.current;
    const changedControls = new Set<string>();

    // Find which controls caused changes
    entityImpacts.forEach((impact, entityId) => {
      const prevImpact = previousImpacts.get(entityId);

      if (!prevImpact || prevImpact.impactScore !== impact.impactScore) {
        // Impact changed - identify which controls
        impact.affectedBy.forEach((controlId) => {
          changedControls.add(controlId);
        });
      }
    });

    // Create cascade events for changed controls
    if (changedControls.size > 0) {
      const newEvents: CascadeEvent[] = [];

      changedControls.forEach((controlId) => {
        const affected = getAffectedEntities(controlId, entityImpacts);

        if (affected.length > 0) {
          const topAffected = affected.slice(0, 5).map((impact) => {
            const entity = ALL_EXPANDED_ENTITIES.find((e) => e.id === impact.entityId);
            return {
              entityId: impact.entityId,
              entityName: entity?.name || impact.entityId,
              impactScore: impact.impactScore,
              level: entity?.type || 'UNKNOWN',
            };
          });

          newEvents.push({
            id: `${controlId}-${Date.now()}`,
            controlId,
            controlName: getControlDisplayName(controlId),
            timestamp: Date.now(),
            affectedCount: affected.length,
            topAffectedEntities: topAffected,
          });
        }
      });

      if (newEvents.length > 0) {
        setCascadeEvents((prev) => [...newEvents, ...prev].slice(0, 10)); // Keep last 10
        setIsVisible(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    }

    // Update previous impacts reference
    previousImpactsRef.current = new Map(entityImpacts);
  }, [entityImpacts]);

  const clearEvent = (eventId: string) => {
    setCascadeEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  if (cascadeEvents.length === 0) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 space-y-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {cascadeEvents.map((event, idx) => (
        <CascadeEventCard
          key={event.id}
          event={event}
          index={idx}
          onClose={() => clearEvent(event.id)}
        />
      ))}
    </div>
  );
}

/**
 * Individual cascade event card
 */
interface CascadeEventCardProps {
  event: CascadeEvent;
  index: number;
  onClose: () => void;
}

function CascadeEventCard({ event, index, onClose }: CascadeEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="w-96 bg-background-primary border-2 border-accent-cyan rounded-lg shadow-2xl overflow-hidden animate-slide-in-right"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 bg-accent-cyan/10 border-b border-accent-cyan/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
              <Zap size={16} className="text-accent-cyan animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Activity size={14} className="text-accent-cyan" />
                Cascade Effect Detected
              </div>
              <div className="text-xs text-text-secondary mt-1">
                <strong className="text-accent-cyan">{event.controlName}</strong> changed
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                {event.affectedCount} entities affected
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-text-tertiary hover:text-text-primary transition-colors text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="px-4 py-3 space-y-2 animate-fade-in">
          <div className="text-xs font-semibold text-text-secondary mb-2">Top Affected Entities:</div>
          {event.topAffectedEntities.map((entity, idx) => (
            <div
              key={entity.entityId}
              className="flex items-center gap-2 p-2 bg-background-secondary rounded border border-border-primary animate-fade-in"
              style={{
                animationDelay: `${idx * 50}ms`,
              }}
            >
              {/* Level indicator */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-xs px-2 py-0.5 bg-background-tertiary text-accent-cyan rounded flex-shrink-0">
                  {entity.level}
                </div>
                <ArrowRight size={12} className="text-text-tertiary flex-shrink-0" />
                <div className="text-xs font-medium text-text-primary truncate">
                  {entity.entityName}
                </div>
              </div>

              {/* Impact indicator */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {entity.impactScore > 0 ? (
                  <>
                    <TrendingUp size={12} className="text-accent-emerald" />
                    <span className="text-xs font-bold text-accent-emerald">
                      +{(entity.impactScore * 100).toFixed(0)}%
                    </span>
                  </>
                ) : entity.impactScore < 0 ? (
                  <>
                    <TrendingDown size={12} className="text-red-400" />
                    <span className="text-xs font-bold text-red-400">
                      {(entity.impactScore * 100).toFixed(0)}%
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-text-tertiary">0%</span>
                )}
              </div>
            </div>
          ))}

          {event.affectedCount > 5 && (
            <div className="text-xs text-text-tertiary text-center pt-1">
              +{event.affectedCount - 5} more entities affected
            </div>
          )}
        </div>
      )}

      {/* Progress bar (auto-dismiss timer) */}
      <div className="h-1 bg-background-secondary overflow-hidden">
        <div className="h-full bg-accent-cyan animate-progress-shrink" />
      </div>
    </div>
  );
}

/**
 * Get human-readable control display name
 */
function getControlDisplayName(controlId: string): string {
  const names: Record<string, string> = {
    nvidia_market_share: 'NVIDIA Market Share',
    tsmc_utilization_rate: 'TSMC Utilization Rate',
    sk_hynix_hbm_share: 'SK Hynix HBM Share',
    semiconductor_capex_index: 'Semiconductor CapEx',
    ai_investment: 'Global AI Investment',
    gpu_demand_index: 'GPU Demand Index',
    smartphone_demand: 'Smartphone Demand',
    cloud_service_growth: 'Cloud Service Growth',
    hbm3e_supply_index: 'HBM3E Supply',
    dram_price_index: 'DRAM Price Index',
    cowos_capacity: 'CoWoS Capacity',
    cuda_ecosystem_strength: 'CUDA Ecosystem Strength',
    process_node_advancement: 'Process Node Advancement',
    hyperscaler_capex: 'Hyperscaler CapEx',
  };

  return names[controlId] || controlId;
}
