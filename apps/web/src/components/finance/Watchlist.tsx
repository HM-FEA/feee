'use client';

import React, { useState } from 'react';
import { Star, Plus, X } from 'lucide-react';

interface WatchlistStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface WatchlistProps {
  onSelectCompany?: (stock: any) => void;
}

export default function Watchlist({ onSelectCompany }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([
    { ticker: 'AAPL', name: 'Apple', price: 227.48, change: 9.12, changePercent: 4.18 },
    { ticker: 'MSFT', name: 'Microsoft', price: 420.55, change: 14.67, changePercent: 3.61 },
    { ticker: 'NVDA', name: 'NVIDIA', price: 145.89, change: 12.34, changePercent: 9.25 },
  ]);

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(prev => prev.filter(stock => stock.ticker !== ticker));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-accent-cyan fill-accent-cyan" />
          <span className="text-xs font-semibold text-text-primary">Watchlist</span>
          <span className="text-xs text-text-tertiary">({watchlist.length})</span>
        </div>
        <button
          className="p-1 rounded hover:bg-background-tertiary text-accent-cyan transition-colors"
          title="Add to Watchlist"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Watchlist Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {watchlist.length === 0 ? (
          <div className="text-center py-8">
            <Star size={32} className="mx-auto mb-2 text-text-tertiary opacity-30" />
            <p className="text-xs text-text-tertiary">No stocks in watchlist</p>
            <button className="mt-3 px-3 py-1.5 text-xs bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors">
              Add Stock
            </button>
          </div>
        ) : (
          watchlist.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <div
                key={stock.ticker}
                className="group relative p-2.5 rounded-lg bg-background-secondary hover:bg-background-tertiary border border-border-primary hover:border-accent-cyan/50 transition-all"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(stock.ticker);
                  }}
                  className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                  title="Remove from Watchlist"
                >
                  <X size={12} />
                </button>

                <button
                  onClick={() => onSelectCompany && onSelectCompany(stock)}
                  className="w-full text-left"
                >
                  {/* Ticker & Name */}
                  <div className="flex items-center justify-between mb-1.5 pr-6">
                    <div>
                      <div className="text-xs font-bold text-text-primary">{stock.ticker}</div>
                      <div className="text-xs text-text-tertiary truncate">{stock.name}</div>
                    </div>
                    <div className={`text-xs font-bold ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive && '+'}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-text-primary">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`text-xs font-medium ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isPositive && '+'}{stock.change.toFixed(2)}
                    </div>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
