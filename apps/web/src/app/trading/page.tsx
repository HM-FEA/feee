'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, BarChart2, Activity, DollarSign, Search } from 'lucide-react';
import { companies } from '@/data/companies';
import { GlobalTopNav } from '@/components/layout/GlobalTopNav';

// Dynamic import to avoid SSR issues
const LightweightChart = dynamic(() => import('@/components/charts/LightweightChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#0D0D0F] border border-border-primary rounded-lg flex items-center justify-center">
      <span className="text-accent-cyan animate-pulse">Loading chart...</span>
    </div>
  ),
});

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

// Generate realistic price data
const generatePriceData = (ticker: string, basePrice: number) => {
  const data = [];
  const now = new Date();
  let price = basePrice;

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Add realistic price movement
    const change = (Math.random() - 0.48) * (basePrice * 0.02);
    price = Math.max(price + change, basePrice * 0.7);

    data.push({
      time: date.toISOString().split('T')[0],
      value: parseFloat(price.toFixed(2))
    });
  }

  return data;
};

export default function TradingPage() {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('3M');

  const chartData = useMemo(() => {
    const basePrice = selectedCompany.financials.equity / 100;
    return generatePriceData(selectedCompany.ticker, basePrice);
  }, [selectedCompany]);

  const currentPrice = chartData[chartData.length - 1]?.value || 0;
  const previousPrice = chartData[chartData.length - 2]?.value || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies.slice(0, 20);
    const term = searchTerm.toLowerCase();
    return companies.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.ticker.toLowerCase().includes(term)
    ).slice(0, 20);
  }, [searchTerm]);

  return (
    <div className="relative min-h-screen bg-black text-text-primary">
      <GlobalTopNav />
      {/* Header */}
      <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur sticky top-16 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent-cyan mb-1 flex items-center gap-2">
              <Activity size={24} />
              Advanced Trading
            </h1>
            <p className="text-sm text-text-secondary">
              Professional charts powered by TradingView's Lightweight Charts
            </p>
          </div>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-accent-cyan text-black'
                    : 'bg-background-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-90px)]">
        {/* Sidebar - Watchlist */}
        <div className="w-64 border-r border-border-primary bg-[#0A0A0C] overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-text-tertiary mb-2 uppercase">Watchlist</h3>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-tertiary"/>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background-secondary border border-border-primary rounded-lg pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div className="space-y-1">
              {filteredCompanies.map(company => {
                const isSelected = selectedCompany.ticker === company.ticker;
                return (
                  <button
                    key={company.ticker}
                    onClick={() => setSelectedCompany(company)}
                    className={`w-full text-left p-2 rounded-lg transition-all text-xs ${
                      isSelected
                        ? 'bg-accent-cyan/10 border border-accent-cyan'
                        : 'hover:bg-background-tertiary'
                    }`}
                  >
                    <div className="font-semibold text-text-primary">{company.ticker}</div>
                    <div className="text-text-tertiary text-xs">{company.sector}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Price Header */}
          <div className="px-6 py-4 border-b border-border-primary bg-[#0A0A0C]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">
                  {selectedCompany.name} ({selectedCompany.ticker})
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-text-primary">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className={`text-lg font-semibold ${priceChange >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-text-tertiary mb-1">Market Cap</div>
                  <div className="font-semibold text-text-primary">
                    ${(selectedCompany.financials.equity * 1.5).toLocaleString()}M
                  </div>
                </div>
                <div>
                  <div className="text-text-tertiary mb-1">Volume</div>
                  <div className="font-semibold text-text-primary">2.4M</div>
                </div>
                <div>
                  <div className="text-text-tertiary mb-1">P/E Ratio</div>
                  <div className="font-semibold text-text-primary">
                    {selectedCompany.ratios?.pe_ratio?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 p-6 overflow-auto">
            <LightweightChart
              data={chartData}
              height={500}
              ticker={selectedCompany.ticker}
            />

            {/* Company Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <Card className="text-xs">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={16} className="text-accent-cyan" />
                  <h3 className="font-semibold text-text-primary">Revenue</h3>
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">
                  ${selectedCompany.financials.revenue.toLocaleString()}M
                </div>
                <div className="text-text-tertiary">Annual</div>
              </Card>

              <Card className="text-xs">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-accent-emerald" />
                  <h3 className="font-semibold text-text-primary">Net Income</h3>
                </div>
                <div className="text-2xl font-bold text-status-safe mb-1">
                  ${selectedCompany.financials.net_income.toLocaleString()}M
                </div>
                <div className="text-text-tertiary">Annual</div>
              </Card>

              <Card className="text-xs">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 size={16} className="text-accent-magenta" />
                  <h3 className="font-semibold text-text-primary">ICR</h3>
                </div>
                <div className={`text-2xl font-bold mb-1 ${
                  selectedCompany.ratios?.icr && selectedCompany.ratios.icr > 2.5
                    ? 'text-status-safe'
                    : 'text-status-caution'
                }`}>
                  {selectedCompany.ratios?.icr?.toFixed(2) || 'N/A'}x
                </div>
                <div className="text-text-tertiary">Interest Coverage</div>
              </Card>

              <Card className="text-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={16} className="text-accent-cyan" />
                  <h3 className="font-semibold text-text-primary">ROE</h3>
                </div>
                <div className="text-2xl font-bold text-accent-cyan mb-1">
                  {selectedCompany.ratios?.roe?.toFixed(1) || 'N/A'}%
                </div>
                <div className="text-text-tertiary">Return on Equity</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
