'use client';

import React from 'react';
import { X, TrendingUp, Package, Factory, Truck, DollarSign } from 'lucide-react';

interface SupplyChainDetailPanelProps {
  link: {
    id?: string;
    source: string;
    target: string;
    type: string;
    strength: number;
    metadata?: any;
  };
  onClose: () => void;
}

export default function SupplyChainDetailPanel({ link, onClose }: SupplyChainDetailPanelProps) {
  // Get relationship type icon and color
  const getRelationshipStyle = (type: string) => {
    const styles: Record<string, { icon: any; color: string; label: string }> = {
      SUPPLIES: {
        icon: Package,
        color: '#00E5FF',
        label: 'Supply Relationship'
      },
      MANUFACTURES: {
        icon: Factory,
        color: '#F59E0B',
        label: 'Manufacturing'
      },
      BUYS: {
        icon: DollarSign,
        color: '#10B981',
        label: 'Customer Purchase'
      },
      USES: {
        icon: TrendingUp,
        color: '#8B5CF6',
        label: 'Component Usage'
      },
      REQUIRES: {
        icon: Package,
        color: '#E6007A',
        label: 'Dependency'
      },
      impact: {
        icon: TrendingUp,
        color: '#FFD700',
        label: 'Impact Relationship'
      },
      supply: {
        icon: Truck,
        color: '#00E5FF',
        label: 'Supply Chain'
      },
      ownership: {
        icon: TrendingUp,
        color: '#8B5CF6',
        label: 'Ownership'
      }
    };
    return styles[type] || styles.impact;
  };

  const relationshipStyle = getRelationshipStyle(link.type);
  const Icon = relationshipStyle.icon;

  // Extract supply chain metadata if available
  const metadata = link.metadata || {};
  const isSupplyChain = ['SUPPLIES', 'MANUFACTURES', 'BUYS', 'USES', 'REQUIRES', 'supply'].includes(link.type);

  return (
    <div className="absolute top-4 right-4 z-10 w-96 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b border-white/10"
        style={{
          background: `linear-gradient(135deg, ${relationshipStyle.color}15 0%, transparent 100%)`
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${relationshipStyle.color}20` }}
            >
              <Icon size={20} style={{ color: relationshipStyle.color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {relationshipStyle.label}
              </h3>
              <p className="text-xs text-text-tertiary">
                Relationship Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} className="text-text-tertiary" />
          </button>
        </div>

        {/* Connection Flow */}
        <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg">
          <div className="flex-1 text-xs">
            <div className="text-text-tertiary mb-1">From:</div>
            <div className="text-text-primary font-mono font-semibold">
              {typeof link.source === 'string' ? link.source : (link.source as any).id || 'Unknown'}
            </div>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: `${relationshipStyle.color}20`,
              color: relationshipStyle.color
            }}
          >
            →
          </div>
          <div className="flex-1 text-xs">
            <div className="text-text-tertiary mb-1">To:</div>
            <div className="text-text-primary font-mono font-semibold">
              {typeof link.target === 'string' ? link.target : (link.target as any).id || 'Unknown'}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {/* Strength */}
        <div className="p-3 bg-background-secondary/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-tertiary">Relationship Strength</span>
            <span
              className="text-lg font-bold"
              style={{ color: relationshipStyle.color }}
            >
              {link.strength.toFixed(2)}
            </span>
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(link.strength / 10) * 100}%`,
                backgroundColor: relationshipStyle.color
              }}
            />
          </div>
        </div>

        {/* Supply Chain Details */}
        {isSupplyChain && (
          <>
            {/* Annual Value */}
            {metadata.annualValue && (
              <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-400" />
                    <span className="text-xs text-text-secondary">Annual Value</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">
                    ${(metadata.annualValue / 1_000_000_000).toFixed(1)}B
                  </span>
                </div>
              </div>
            )}

            {/* Product Details */}
            {metadata.product && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="text-xs text-text-tertiary mb-1">Product</div>
                <div className="text-sm text-text-primary font-medium">
                  {metadata.product}
                </div>
              </div>
            )}

            {/* Component Details */}
            {metadata.component && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="text-xs text-text-tertiary mb-1">Component</div>
                <div className="text-sm text-text-primary font-medium">
                  {metadata.component}
                </div>
              </div>
            )}

            {/* Process/Technology */}
            {metadata.process && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="text-xs text-text-tertiary mb-1">Process Node</div>
                <div className="text-sm text-accent-cyan font-medium">
                  {metadata.process}
                </div>
              </div>
            )}

            {/* Capacity */}
            {metadata.capacity && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-text-tertiary mb-1">Capacity</div>
                    <div className="text-sm text-text-primary font-medium">
                      {metadata.capacity.toLocaleString()}
                    </div>
                  </div>
                  {metadata.unit && (
                    <div className="text-xs text-text-tertiary">
                      {metadata.unit}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Annual Spend (for customer relationships) */}
            {metadata.annualSpend && (
              <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-400" />
                    <span className="text-xs text-text-secondary">Annual Spend</span>
                  </div>
                  <span className="text-lg font-bold text-purple-400">
                    ${(metadata.annualSpend / 1_000_000_000).toFixed(1)}B
                  </span>
                </div>
              </div>
            )}

            {/* GPU Count (for hyperscaler customers) */}
            {metadata.gpuCount && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">GPU Count</span>
                  <span className="text-lg font-bold text-accent-magenta">
                    {metadata.gpuCount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Exclusivity */}
            {metadata.exclusivity && (
              <div className="p-3 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-xs text-orange-400 font-medium">
                    {metadata.exclusivity === 'high' ? 'High Exclusivity' : 'Exclusive Partnership'}
                  </span>
                </div>
              </div>
            )}

            {/* Critical Flag */}
            {metadata.critical && (
              <div className="p-3 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs text-red-400 font-medium">
                    Critical Supply Chain Node
                  </span>
                </div>
              </div>
            )}

            {/* Bottleneck Warning */}
            {metadata.bottleneck && (
              <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs text-yellow-400 font-medium">
                    Supply Bottleneck Risk
                  </span>
                </div>
              </div>
            )}

            {/* Quantity */}
            {metadata.quantity && (
              <div className="p-3 bg-background-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">Quantity</span>
                  <span className="text-sm text-text-primary font-medium">
                    {metadata.quantity} {metadata.unit || 'units'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Generic Metadata Display */}
        {metadata && Object.keys(metadata).length > 0 && (
          <details className="p-3 bg-background-secondary/30 rounded-lg">
            <summary className="text-xs text-text-tertiary cursor-pointer hover:text-text-secondary transition-colors">
              View All Metadata ({Object.keys(metadata).length} fields)
            </summary>
            <div className="mt-3 space-y-2">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-text-tertiary">{key}:</span>
                  <span className="text-text-primary font-mono">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-background-secondary/30">
        <div className="text-xs text-text-tertiary leading-relaxed">
          <strong className="text-text-secondary">Supply Chain Analysis:</strong>{' '}
          {isSupplyChain
            ? 'This relationship represents a critical supply chain connection. Changes to this link affect downstream production and costs.'
            : 'This relationship shows the impact or ownership connection between entities.'}
        </div>
      </div>
    </div>
  );
}
