'use client';

import React, { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Calendar, Building2, Download, Eye, Search, Filter } from 'lucide-react';
import { Card, Button, Badge, SectionHeader } from '@/components/ui/DesignSystem';

// Types
interface Filing {
  id: string;
  company: string;
  ticker: string;
  type: '10-K' | '10-Q' | '8-K' | 'DEF 14A';
  filedDate: string;
  period: string;
  description: string;
  size: string;
  url: string;
}

interface FinancialStatement {
  period: string;
  revenue: number;
  netIncome: number;
  eps: number;
  assets: number;
  liabilities: number;
  equity: number;
  operatingCashFlow: number;
  freeCashFlow: number;
}

// Mock Data
const MOCK_FILINGS: Filing[] = [
  {
    id: 'f1',
    company: 'Samsung Electronics',
    ticker: '005930',
    type: '10-K',
    filedDate: '2025-02-15',
    period: 'FY 2024',
    description: 'Annual Report for fiscal year ending December 31, 2024',
    size: '15.2 MB',
    url: '#'
  },
  {
    id: 'f2',
    company: 'SK Hynix',
    ticker: '000660',
    type: '10-Q',
    filedDate: '2025-01-30',
    period: 'Q4 2024',
    description: 'Quarterly Report for period ending December 31, 2024',
    size: '8.5 MB',
    url: '#'
  },
  {
    id: 'f3',
    company: 'KB Financial Group',
    ticker: '086790',
    type: '8-K',
    filedDate: '2025-01-20',
    period: 'Current',
    description: 'Current Report: CEO Transition Announcement',
    size: '1.2 MB',
    url: '#'
  },
  {
    id: 'f4',
    company: 'Hyundai Motor',
    ticker: '005380',
    type: '10-Q',
    filedDate: '2025-01-15',
    period: 'Q4 2024',
    description: 'Quarterly Report for period ending December 31, 2024',
    size: '9.8 MB',
    url: '#'
  },
  {
    id: 'f5',
    company: 'POSCO Holdings',
    ticker: '005490',
    type: '10-K',
    filedDate: '2024-12-28',
    period: 'FY 2024',
    description: 'Annual Report for fiscal year ending December 31, 2024',
    size: '12.4 MB',
    url: '#'
  },
];

const MOCK_FINANCIAL_DATA: Record<string, FinancialStatement[]> = {
  '005930': [
    { period: 'Q4 2024', revenue: 75000, netIncome: 8500, eps: 5.20, assets: 450000, liabilities: 180000, equity: 270000, operatingCashFlow: 12000, freeCashFlow: 9500 },
    { period: 'Q3 2024', revenue: 72000, netIncome: 8000, eps: 4.90, assets: 445000, liabilities: 175000, equity: 270000, operatingCashFlow: 11500, freeCashFlow: 9000 },
    { period: 'Q2 2024', revenue: 70000, netIncome: 7500, eps: 4.60, assets: 440000, liabilities: 170000, equity: 270000, operatingCashFlow: 11000, freeCashFlow: 8500 },
    { period: 'Q1 2024', revenue: 68000, netIncome: 7000, eps: 4.30, assets: 435000, liabilities: 165000, equity: 270000, operatingCashFlow: 10500, freeCashFlow: 8000 },
  ],
  '000660': [
    { period: 'Q4 2024', revenue: 15000, netIncome: 2000, eps: 2.80, assets: 80000, liabilities: 30000, equity: 50000, operatingCashFlow: 3500, freeCashFlow: 2800 },
    { period: 'Q3 2024', revenue: 14500, netIncome: 1800, eps: 2.50, assets: 78000, liabilities: 29000, equity: 49000, operatingCashFlow: 3200, freeCashFlow: 2500 },
    { period: 'Q2 2024', revenue: 14000, netIncome: 1600, eps: 2.20, assets: 76000, liabilities: 28000, equity: 48000, operatingCashFlow: 3000, freeCashFlow: 2300 },
    { period: 'Q1 2024', revenue: 13500, netIncome: 1400, eps: 1.90, assets: 74000, liabilities: 27000, equity: 47000, operatingCashFlow: 2800, freeCashFlow: 2100 },
  ],
};

const FilingCard = ({ filing, onClick }: { filing: Filing, onClick: () => void }) => {
  const typeColors: Record<string, string> = {
    '10-K': 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan',
    '10-Q': 'bg-accent-magenta/20 text-accent-magenta border-accent-magenta',
    '8-K': 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald',
    'DEF 14A': 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  };

  return (
    <Card className="hover:border-accent-cyan/50 transition-all cursor-pointer group" onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <FileText size={24} className="text-accent-cyan mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors mb-1">
              {filing.company} ({filing.ticker})
            </h3>
            <p className="text-xs text-text-secondary line-clamp-2">{filing.description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded border text-xs font-semibold ${typeColors[filing.type]}`}>
          {filing.type}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-tertiary mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{filing.filedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Building2 size={12} />
          <span>{filing.period}</span>
        </div>
        <div className="text-accent-cyan">{filing.size}</div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-border-primary">
        <Button variant="secondary" size="sm" className="flex-1 justify-center">
          <Eye size={14} className="mr-1" />
          View
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 justify-center">
          <Download size={14} className="mr-1" />
          Download
        </Button>
      </div>
    </Card>
  );
};

const FinancialStatementView = ({ ticker, company }: { ticker: string, company: string }) => {
  const data = MOCK_FINANCIAL_DATA[ticker] || [];
  const latest = data[0];

  if (!latest) {
    return (
      <div className="text-center py-12 text-text-secondary">
        No financial data available for {company}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Income Statement */}
      <Card>
        <h3 className="text-sm font-semibold text-accent-cyan mb-4">Income Statement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left py-2 text-text-secondary font-semibold">Period</th>
                <th className="text-right py-2 text-text-secondary font-semibold">Revenue</th>
                <th className="text-right py-2 text-text-secondary font-semibold">Net Income</th>
                <th className="text-right py-2 text-text-secondary font-semibold">EPS</th>
                <th className="text-right py-2 text-text-secondary font-semibold">Growth</th>
              </tr>
            </thead>
            <tbody>
              {data.map((period, index) => {
                const prevPeriod = data[index + 1];
                const revenueGrowth = prevPeriod
                  ? ((period.revenue - prevPeriod.revenue) / prevPeriod.revenue) * 100
                  : 0;

                return (
                  <tr key={period.period} className="border-b border-border-primary/50">
                    <td className="py-3 text-text-primary font-medium">{period.period}</td>
                    <td className="text-right py-3 font-mono text-accent-emerald">
                      ${period.revenue.toLocaleString()}M
                    </td>
                    <td className="text-right py-3 font-mono text-text-primary">
                      ${period.netIncome.toLocaleString()}M
                    </td>
                    <td className="text-right py-3 font-mono text-text-primary">
                      ${period.eps.toFixed(2)}
                    </td>
                    <td className="text-right py-3">
                      {prevPeriod ? (
                        <span className={`flex items-center justify-end gap-1 ${revenueGrowth >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                          {revenueGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {revenueGrowth.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-text-tertiary">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Balance Sheet */}
      <Card>
        <h3 className="text-sm font-semibold text-accent-magenta mb-4">Balance Sheet</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="text-xs text-text-tertiary mb-1">Total Assets</div>
            <div className="text-xl font-bold text-accent-cyan">
              ${latest.assets.toLocaleString()}M
            </div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="text-xs text-text-tertiary mb-1">Total Liabilities</div>
            <div className="text-xl font-bold text-status-danger">
              ${latest.liabilities.toLocaleString()}M
            </div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="text-xs text-text-tertiary mb-1">Shareholders' Equity</div>
            <div className="text-xl font-bold text-accent-emerald">
              ${latest.equity.toLocaleString()}M
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-background-secondary rounded-lg">
          <div className="text-xs text-text-tertiary mb-2">Debt-to-Equity Ratio</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-status-caution"
                style={{ width: `${(latest.liabilities / latest.equity) * 50}%` }}
              />
            </div>
            <span className="text-sm font-mono text-text-primary">
              {(latest.liabilities / latest.equity).toFixed(2)}x
            </span>
          </div>
        </div>
      </Card>

      {/* Cash Flow */}
      <Card>
        <h3 className="text-sm font-semibold text-accent-emerald mb-4">Cash Flow Statement</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="text-xs text-text-tertiary mb-1">Operating Cash Flow</div>
            <div className="text-xl font-bold text-accent-emerald">
              ${latest.operatingCashFlow.toLocaleString()}M
            </div>
          </div>
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="text-xs text-text-tertiary mb-1">Free Cash Flow</div>
            <div className="text-xl font-bold text-accent-cyan">
              ${latest.freeCashFlow.toLocaleString()}M
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function FilingsPage() {
  const [selectedFiling, setSelectedFiling] = useState<Filing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFilings = MOCK_FILINGS.filter(filing => {
    const matchesSearch = filing.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          filing.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || filing.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <SectionHeader
        title="SEC Filings Simulator"
        subtitle="Browse and analyze company filings and financial statements (Dummy Data)"
        icon={<FileText size={24} />}
        action={
          selectedFiling && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedFiling(null)}
            >
              Back to Filings
            </Button>
          )
        }
      />

      <div className="px-6 py-6">
        {!selectedFiling ? (
          <>
            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search by company or ticker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-secondary border border-border-primary rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-background-secondary border border-border-primary rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
              >
                <option value="all">All Types</option>
                <option value="10-K">10-K (Annual)</option>
                <option value="10-Q">10-Q (Quarterly)</option>
                <option value="8-K">8-K (Current)</option>
                <option value="DEF 14A">DEF 14A (Proxy)</option>
              </select>
            </div>

            {/* Filings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFilings.map(filing => (
                <FilingCard
                  key={filing.id}
                  filing={filing}
                  onClick={() => setSelectedFiling(filing)}
                />
              ))}
            </div>

            {filteredFilings.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-sm text-text-secondary">No filings found. Try adjusting your filters.</p>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Filing Detail View */}
            <div className="max-w-6xl mx-auto">
              <Card className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-1">
                      {selectedFiling.company} ({selectedFiling.ticker})
                    </h2>
                    <p className="text-sm text-text-secondary">{selectedFiling.description}</p>
                  </div>
                  <Badge variant="cyan">{selectedFiling.type}</Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-text-tertiary">Filed Date:</span>
                    <span className="ml-2 text-text-primary font-semibold">{selectedFiling.filedDate}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Period:</span>
                    <span className="ml-2 text-text-primary font-semibold">{selectedFiling.period}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Size:</span>
                    <span className="ml-2 text-accent-cyan font-semibold">{selectedFiling.size}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">Status:</span>
                    <Badge variant="emerald" className="ml-2">Filed</Badge>
                  </div>
                </div>
              </Card>

              <FinancialStatementView
                ticker={selectedFiling.ticker}
                company={selectedFiling.company}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
