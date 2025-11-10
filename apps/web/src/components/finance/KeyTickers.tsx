'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const KEY_TICKERS: Ticker[] = [
  { symbol: 'SPX', name: 'S&P 500', price: 5893.62, change: 23.00, changePercent: 0.39 },
  { symbol: 'DJI', name: 'Dow Jones', price: 43988.99, change: -207.33, changePercent: -0.47 },
  { symbol: 'IXIC', name: 'NASDAQ', price: 18742.18, change: 27.27, changePercent: 0.15 },
  { symbol: 'RUT', name: 'Russell 2000', price: 2442.03, change: -10.58, changePercent: -0.43 },
  { symbol: 'VIX', name: 'VIX', price: 15.08, change: 0.39, changePercent: 2.66 },
  { symbol: 'TNX', name: '10Y Treasury', price: 4.31, change: -0.03, changePercent: -0.69 },
  { symbol: 'DXY', name: 'US Dollar', price: 104.42, change: 0.18, changePercent: 0.17 },
  { symbol: 'GC=F', name: 'Gold', price: 2677.20, change: 8.40, changePercent: 0.31 },
];

export default function KeyTickers() {
  return (
    <div className="bg-[#0A0A0C] border-b border-[#1A1A1F] py-3">
      <div className="px-6">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-accent-cyan/20">
          {KEY_TICKERS.map((ticker) => {
            const isPositive = ticker.change >= 0;

            return (
              <button
                key={ticker.symbol}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-background-tertiary transition-all group"
              >
                {/* Symbol & Name */}
                <div className="text-left">
                  <div className="text-xs font-bold text-text-primary group-hover:text-accent-cyan transition-colors">
                    {ticker.symbol}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {ticker.name}
                  </div>
                </div>

                {/* Price */}
                <div className="text-sm font-mono font-semibold text-text-primary">
                  {ticker.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                {/* Change */}
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  <span>
                    {isPositive && '+'}{ticker.changePercent.toFixed(2)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
