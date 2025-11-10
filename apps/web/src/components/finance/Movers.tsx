'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Company } from '@/data/companies';

type MoverType = 'gainers' | 'losers';

interface MoverStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector: string;
}

interface MoversProps {
  onSelectCompany?: (company: any) => void;
}

export default function Movers({ onSelectCompany }: MoversProps) {
  const [selectedTab, setSelectedTab] = useState<MoverType>('gainers');

  // Mock data - Top Gainers
  const gainers: MoverStock[] = [
    { ticker: 'NVDA', name: 'NVIDIA', price: 145.89, change: 12.34, changePercent: 9.25, sector: 'SEMICONDUCTOR' },
    { ticker: 'TSLA', name: 'Tesla', price: 242.15, change: 15.87, changePercent: 7.01, sector: 'AUTOMOTIVE' },
    { ticker: 'META', name: 'Meta', price: 562.77, change: 28.45, changePercent: 5.33, sector: 'TECHNOLOGY' },
    { ticker: 'AAPL', name: 'Apple', price: 227.48, change: 9.12, changePercent: 4.18, sector: 'TECHNOLOGY' },
    { ticker: 'MSFT', name: 'Microsoft', price: 420.55, change: 14.67, changePercent: 3.61, sector: 'TECHNOLOGY' },
  ];

  // Mock data - Top Losers
  const losers: MoverStock[] = [
    { ticker: 'INTC', name: 'Intel', price: 22.45, change: -2.87, changePercent: -11.34, sector: 'SEMICONDUCTOR' },
    { ticker: 'PYPL', name: 'PayPal', price: 78.32, change: -5.23, changePercent: -6.26, sector: 'FINTECH' },
    { ticker: 'DIS', name: 'Disney', price: 112.56, change: -5.89, changePercent: -4.97, sector: 'ENTERTAINMENT' },
    { ticker: 'WMT', name: 'Walmart', price: 89.23, change: -3.45, changePercent: -3.72, sector: 'RETAIL' },
    { ticker: 'CVX', name: 'Chevron', price: 156.78, change: -4.12, changePercent: -2.56, sector: 'ENERGY' },
  ];

  const currentMovers = selectedTab === 'gainers' ? gainers : losers;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex gap-2 mb-3 border-b border-border-primary pb-2">
        <button
          onClick={() => setSelectedTab('gainers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'gainers'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
          }`}
        >
          <TrendingUp size={14} />
          Gainers
        </button>
        <button
          onClick={() => setSelectedTab('losers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedTab === 'losers'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
          }`}
        >
          <TrendingDown size={14} />
          Losers
        </button>
      </div>

      {/* Movers List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {currentMovers.map((stock) => {
          const isGainer = stock.change > 0;

          return (
            <button
              key={stock.ticker}
              onClick={() => onSelectCompany && onSelectCompany(stock)}
              className="w-full p-2.5 rounded-lg bg-background-secondary hover:bg-background-tertiary border border-border-primary hover:border-accent-cyan/50 transition-all text-left"
            >
              {/* Ticker & Name */}
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <div className="text-xs font-bold text-text-primary">{stock.ticker}</div>
                  <div className="text-xs text-text-tertiary truncate">{stock.name}</div>
                </div>
                <div className={`text-xs font-bold ${
                  isGainer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isGainer && '+'}{stock.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Price & Change */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-text-primary">
                  ${stock.price.toFixed(2)}
                </div>
                <div className={`text-xs font-medium ${
                  isGainer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isGainer && '+'}{stock.change.toFixed(2)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
