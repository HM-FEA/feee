'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, TrendingUp, GitBranch, Database, ExternalLink, Terminal as TerminalIcon } from 'lucide-react';
import { PropagationState } from '@/lib/finance/nineLevelPropagation';

interface StudioRightPanelProps {
  focusedCompany: string | null;
  propagationState: PropagationState | null;
  showPropagation: boolean;
  activePropagationLevel?: number; // Current animation level
}

type TabMode = 'terminal' | 'news' | 'charts' | 'knowledge-graph' | 'er-diagram';

/**
 * StudioRightPanel - Terminal, News, Charts, Knowledge Graph, ER Diagram
 *
 * Features:
 * - Bloomberg-style Terminal (command-line output)
 * - Real-time news (placeholder for now)
 * - Price charts
 * - Obsidian-style Knowledge Graph (DB links, propagation effects)
 * - Lima-hq style ER Diagram
 */

export default function StudioRightPanel({
  focusedCompany,
  propagationState,
  showPropagation,
  activePropagationLevel
}: StudioRightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('terminal');

  return (
    <div className="h-full flex flex-col">
      {/* Tab Selector */}
      <div className="flex border-b border-gray-800">
        <TabButton
          active={activeTab === 'terminal'}
          onClick={() => setActiveTab('terminal')}
          icon={<TerminalIcon size={16} />}
          label="Terminal"
        />
        <TabButton
          active={activeTab === 'news'}
          onClick={() => setActiveTab('news')}
          icon={<Newspaper size={16} />}
          label="News"
        />
        <TabButton
          active={activeTab === 'charts'}
          onClick={() => setActiveTab('charts')}
          icon={<TrendingUp size={16} />}
          label="Charts"
        />
        <TabButton
          active={activeTab === 'knowledge-graph'}
          onClick={() => setActiveTab('knowledge-graph')}
          icon={<GitBranch size={16} />}
          label="Graph"
        />
        <TabButton
          active={activeTab === 'er-diagram'}
          onClick={() => setActiveTab('er-diagram')}
          icon={<Database size={16} />}
          label="ER"
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'terminal' && (
          <TerminalTab
            propagationState={propagationState}
            focusedCompany={focusedCompany}
            showPropagation={showPropagation}
            activePropagationLevel={activePropagationLevel}
          />
        )}
        {activeTab === 'news' && <NewsTab focusedCompany={focusedCompany} />}
        {activeTab === 'charts' && <ChartsTab focusedCompany={focusedCompany} />}
        {activeTab === 'knowledge-graph' && (
          <KnowledgeGraphTab propagationState={propagationState} focusedCompany={focusedCompany} />
        )}
        {activeTab === 'er-diagram' && <ERDiagramTab />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 transition-all ${
        active
          ? 'bg-[#1a1a1a] text-accent-cyan border-b-2 border-accent-cyan'
          : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]/50'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

/**
 * Terminal Tab - Bloomberg/cmd style command-line output with sequential updates
 */
function TerminalTab({
  propagationState,
  focusedCompany,
  showPropagation,
  activePropagationLevel
}: {
  propagationState: PropagationState | null;
  focusedCompany: string | null;
  showPropagation: boolean;
  activePropagationLevel?: number;
}) {
  const [logs, setLogs] = useState<string[]>(['> NEXUS-ALPHA Terminal v3.0', '> Waiting for propagation data...', '']);
  const terminalRef = useRef<HTMLDivElement>(null);
  const prevLevelRef = useRef<number>(-1);

  // Initialize terminal when propagation starts
  useEffect(() => {
    if (activePropagationLevel === 0 || (activePropagationLevel === 1 && prevLevelRef.current === -1)) {
      setLogs([
        '> NEXUS-ALPHA Terminal v3.0',
        '> ========================================',
        '> System: Propagation Engine Active',
        `> Timestamp: ${new Date().toISOString()}`,
        '> ========================================',
        ''
      ]);
      prevLevelRef.current = 0;
    }
  }, [activePropagationLevel]);

  // Add logs sequentially as each level activates
  useEffect(() => {
    if (!propagationState || activePropagationLevel === undefined || activePropagationLevel < 0) return;
    if (activePropagationLevel === prevLevelRef.current) return; // Don't re-add same level

    prevLevelRef.current = activePropagationLevel;

    const newLevelLogs: string[] = [];

    // Add logs for current level
    switch (activePropagationLevel) {
      case 1:
        newLevelLogs.push('> [LEVEL 1] MACRO VARIABLES');
        newLevelLogs.push(`  fed_funds_rate     = ${((propagationState.level1.fed_funds_rate || 0) * 100).toFixed(3)}%`);
        newLevelLogs.push(`  us_gdp_growth      = ${((propagationState.level1.us_gdp_growth || 0) * 100).toFixed(3)}%`);
        newLevelLogs.push(`  us_cpi             = ${((propagationState.level1.us_cpi || 0) * 100).toFixed(3)}%`);
        newLevelLogs.push('');
        break;

      case 2:
        newLevelLogs.push('> [LEVEL 2] SECTOR IMPACT');
        Array.from(propagationState.level2.entries()).slice(0, 5).forEach(([sector, state]) => {
          const impact = state.revenue_impact >= 0 ? `+${state.revenue_impact.toFixed(3)}` : state.revenue_impact.toFixed(3);
          const color = state.revenue_impact >= 0 ? '↑' : '↓';
          newLevelLogs.push(`  ${sector.padEnd(20)} ${color} revenue_impact = ${impact}%`);
        });
        newLevelLogs.push('');
        break;

      case 3:
        newLevelLogs.push('> [LEVEL 3] COMPANY METRICS');
        Array.from(propagationState.level3.entries()).slice(0, 5).forEach(([ticker, state]) => {
          const marketCap = (state.market_cap / 1000000000).toFixed(2);
          newLevelLogs.push(`  ${ticker.padEnd(20)} market_cap = $${marketCap}B`);
        });
        newLevelLogs.push('');
        break;

      case 4:
        newLevelLogs.push('> [LEVEL 4] PRODUCT DEMAND');
        Array.from(propagationState.level4.entries()).slice(0, 4).forEach(([product, state]) => {
          newLevelLogs.push(`  ${product.padEnd(20)} demand_index = ${state.demand_index.toFixed(3)}`);
        });
        newLevelLogs.push('');
        break;

      case 5:
        newLevelLogs.push('> [LEVEL 5] COMPONENT SUPPLY');
        Array.from(propagationState.level5.entries()).slice(0, 4).forEach(([component, state]) => {
          const status = state.bottleneck ? '[BOTTLENECK]' : '[OK]';
          const statusColor = state.bottleneck ? '⚠' : '✓';
          newLevelLogs.push(`  ${component.padEnd(20)} ${statusColor} ${status} qty=${state.required_quantity.toFixed(0)}`);
        });
        newLevelLogs.push('');
        break;

      case 9:
        newLevelLogs.push('> [LEVEL 9] FACILITY OPERATIONS');
        Array.from(propagationState.level9.entries()).slice(0, 3).forEach(([facility, state]) => {
          newLevelLogs.push(`  ${facility.padEnd(20)} utilization = ${state.utilization_pct.toFixed(1)}%`);
        });
        newLevelLogs.push('');
        newLevelLogs.push('> ========================================');
        newLevelLogs.push('> Propagation cycle complete');
        if (focusedCompany) {
          newLevelLogs.push(`> Focused entity: ${focusedCompany}`);
        }
        newLevelLogs.push('> Ready for next update...');
        newLevelLogs.push('');
        break;
    }

    // Append new logs
    setLogs(prev => [...prev, ...newLevelLogs]);

    // Auto-scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 50);
  }, [activePropagationLevel, propagationState, focusedCompany]);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Terminal Header */}
      <div className="px-4 py-2 bg-[#0a0a0a] border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs text-gray-500 font-mono ml-2">bash — nexus-alpha</span>
        </div>
        <div className="text-[10px] text-gray-600 font-mono">
          {showPropagation && <span className="text-green-400">● LIVE</span>}
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
          textShadow: '0 0 2px rgba(0, 229, 255, 0.3)',
        }}
      >
        {logs.map((log, idx) => {
          // Color coding
          let textColor = 'text-green-400';

          if (log.startsWith('>')) {
            textColor = 'text-cyan-400';
          } else if (log.includes('LEVEL')) {
            textColor = 'text-yellow-400 font-bold';
          } else if (log.includes('↑')) {
            textColor = 'text-green-300';
          } else if (log.includes('↓')) {
            textColor = 'text-red-400';
          } else if (log.includes('⚠') || log.includes('BOTTLENECK')) {
            textColor = 'text-red-400';
          } else if (log.includes('✓')) {
            textColor = 'text-green-400';
          } else if (log === '') {
            return <div key={idx} className="h-3"></div>;
          }

          return (
            <div key={idx} className={`${textColor}`}>
              {log || '\u00A0'}
            </div>
          );
        })}

        {/* Blinking cursor */}
        <div className="inline-block w-2 h-4 bg-green-400 animate-pulse mt-1"></div>
      </div>
    </div>
  );
}

/**
 * News Tab - Placeholder for real-time news
 */
function NewsTab({ focusedCompany }: { focusedCompany: string | null }) {
  const mockNews = [
    {
      title: 'Fed Signals Potential Rate Cuts in 2025',
      source: 'Bloomberg',
      time: '2h ago',
      impact: 'positive',
      related: ['Fed', 'Banks', 'Real Estate']
    },
    {
      title: 'NVIDIA Announces Next-Gen AI Chips',
      source: 'Reuters',
      time: '5h ago',
      impact: 'positive',
      related: ['NVDA', 'TSMC', 'AMD']
    },
    {
      title: 'Supply Chain Bottlenecks Ease in Q4',
      source: 'WSJ',
      time: '1d ago',
      impact: 'positive',
      related: ['Manufacturing', 'Logistics']
    },
    {
      title: 'Oil Prices Surge on Middle East Tensions',
      source: 'FT',
      time: '1d ago',
      impact: 'negative',
      related: ['Oil', 'Energy', 'Airlines']
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase">
          Latest News
        </h3>
        {focusedCompany && (
          <span className="text-xs text-accent-cyan">
            Filtered: {focusedCompany}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {mockNews.map((news, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-200 group-hover:text-white">
                {news.title}
              </h4>
              <ExternalLink size={12} className="text-gray-600 group-hover:text-accent-cyan" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{news.source}</span>
              <span>•</span>
              <span>{news.time}</span>
              <span>•</span>
              <span className={news.impact === 'positive' ? 'text-green-400' : 'text-red-400'}>
                {news.impact === 'positive' ? '↑' : '↓'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {news.related.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-4 py-2 text-xs text-gray-500 hover:text-accent-cyan transition-colors">
          Load more news...
        </button>
      </div>
    </div>
  );
}

/**
 * Charts Tab - Placeholder for price charts
 */
function ChartsTab({ focusedCompany }: { focusedCompany: string | null }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase">
          Price Charts
        </h3>
        {focusedCompany && (
          <span className="text-xs text-accent-cyan">
            {focusedCompany}
          </span>
        )}
      </div>

      {/* Placeholder for TradingView widget or custom chart */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 text-center">
        <TrendingUp size={48} className="mx-auto text-gray-700 mb-4" />
        <p className="text-sm text-gray-500">
          Chart integration coming soon
        </p>
        <p className="text-xs text-gray-600 mt-2">
          TradingView / Custom D3 charts will be added here
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Price" value="$135.42" change="+2.4%" positive />
        <MetricCard label="Market Cap" value="$1.1T" change="+3.1%" positive />
        <MetricCard label="Volume" value="45.2M" change="-8.2%" positive={false} />
        <MetricCard label="P/E Ratio" value="42.3" change="+1.2%" positive />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  positive
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </div>
    </div>
  );
}

/**
 * Knowledge Graph Tab - Obsidian-style linked entities with propagation effects
 */
function KnowledgeGraphTab({
  propagationState,
  focusedCompany
}: {
  propagationState: PropagationState | null;
  focusedCompany: string | null;
}) {
  if (!propagationState) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading propagation data...
      </div>
    );
  }

  // Build knowledge graph connections
  const connections = [
    {
      from: 'Fed Rate',
      to: 'Semiconductor Sector',
      type: 'Rate Sensitivity',
      impact: propagationState.level2.get('SEMICONDUCTOR')?.revenue_impact || 0,
      level: '1→2'
    },
    {
      from: 'Semiconductor Sector',
      to: 'NVIDIA',
      type: 'Sector Impact',
      impact: ((propagationState.level3.get('NVDA')?.market_cap || 0) / 1000),
      level: '2→3'
    },
    {
      from: 'NVIDIA',
      to: 'H100 GPU',
      type: 'Product Demand',
      impact: propagationState.level4.get('H100')?.demand_index || 0,
      level: '3→4'
    },
    {
      from: 'H100 GPU',
      to: 'HBM3E',
      type: 'Component Requirement',
      impact: propagationState.level5.get('HBM3E')?.required_quantity || 0,
      level: '4→5'
    },
    {
      from: 'HBM3E',
      to: 'TSMC Fab',
      type: 'Fab Utilization',
      impact: propagationState.level9.get('TSMC_FAB18')?.utilization_pct || 0,
      level: '5→9'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">
          Knowledge Graph
        </h3>
        <p className="text-xs text-gray-600">
          Obsidian-style linked entities showing propagation effects
        </p>
      </div>

      {/* Graph Connections */}
      <div className="space-y-2">
        {connections.map((conn, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-[10px] font-bold rounded">
                {conn.level}
              </span>
              <span className="text-xs text-gray-500">{conn.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-medium">[[{conn.from}]]</span>
              <span className="text-gray-600">→</span>
              <span className="text-accent-cyan font-medium">[[{conn.to}]]</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Impact: <span className="text-white font-mono">{conn.impact.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck Alert */}
      {propagationState.level5.get('HBM3E')?.bottleneck && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold mb-1">
            <span>⚠️</span>
            <span>Supply Bottleneck Detected</span>
          </div>
          <p className="text-xs text-gray-400">
            HBM3E component is constraining H100 production
          </p>
        </div>
      )}

      {/* Entity Details */}
      {focusedCompany && (
        <div className="p-4 bg-[#1a1a1a] border border-accent-cyan/50 rounded-lg">
          <h4 className="text-sm font-bold text-accent-cyan mb-2">
            [[{focusedCompany}]]
          </h4>
          <div className="space-y-1 text-xs text-gray-400">
            <div>Type: Company (Level 3)</div>
            <div>Sector: Semiconductor</div>
            <div>Connected to: 6 entities</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ER Diagram Tab - Lima-hq style database schema
 */
function ERDiagramTab() {
  const tables = [
    {
      name: 'companies',
      fields: ['id', 'ticker', 'name', 'sector', 'market_cap'],
      relations: ['→ financials', '→ relationships']
    },
    {
      name: 'macro_variables',
      fields: ['id', 'variable_name', 'value', 'timestamp'],
      relations: ['→ impacts']
    },
    {
      name: 'propagation_state',
      fields: ['id', 'level', 'entity_id', 'impact_value'],
      relations: ['→ companies', '→ macro_variables']
    },
    {
      name: 'relationships',
      fields: ['id', 'source_id', 'target_id', 'type', 'weight'],
      relations: ['→ companies']
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">
          ER Diagram
        </h3>
        <p className="text-xs text-gray-600">
          Lima-hq style database schema visualization
        </p>
      </div>

      <div className="space-y-3">
        {tables.map((table, idx) => (
          <div
            key={idx}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
          >
            {/* Table Header */}
            <div className="px-3 py-2 bg-accent-cyan/10 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-accent-cyan" />
                <span className="text-sm font-bold text-white font-mono">
                  {table.name}
                </span>
              </div>
            </div>

            {/* Fields */}
            <div className="px-3 py-2 space-y-1">
              {table.fields.map((field, i) => (
                <div
                  key={i}
                  className="text-xs font-mono text-gray-400 flex items-center gap-2"
                >
                  <span className="text-gray-600">•</span>
                  <span>{field}</span>
                  {i === 0 && (
                    <span className="px-1.5 py-0.5 bg-accent-yellow/20 text-accent-yellow text-[10px] rounded">
                      PK
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Relations */}
            <div className="px-3 py-2 border-t border-gray-800">
              <div className="text-[10px] text-gray-600 mb-1">Relations:</div>
              <div className="flex flex-wrap gap-1">
                {table.relations.map((rel, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-4 py-2 text-xs text-gray-500 hover:text-accent-cyan transition-colors">
          View full schema in Lima-hq →
        </button>
      </div>
    </div>
  );
}
