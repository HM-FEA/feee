'use client';

import React, { useState } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, Bell, Star, Search } from 'lucide-react';

interface WatchlistItem {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  alert?: {
    type: 'price' | 'volume' | 'news';
    message: string;
  };
}

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock watchlist data
  const watchlist: WatchlistItem[] = [
    {
      id: '1',
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'SEMICONDUCTOR',
      price: 485.23,
      change: 14.52,
      changePercent: 3.08,
      alert: {
        type: 'price',
        message: 'Price target reached: $485',
      },
    },
    {
      id: '2',
      ticker: 'TSMC',
      name: 'Taiwan Semiconductor',
      sector: 'SEMICONDUCTOR',
      price: 152.34,
      change: -2.15,
      changePercent: -1.39,
    },
    {
      id: '3',
      ticker: 'AMD',
      name: 'Advanced Micro Devices',
      sector: 'SEMICONDUCTOR',
      price: 178.92,
      change: 5.43,
      changePercent: 3.13,
    },
    {
      id: '4',
      ticker: 'JPM',
      name: 'JPMorgan Chase',
      sector: 'BANKING',
      price: 198.45,
      change: 1.23,
      changePercent: 0.62,
    },
  ];

  const filteredWatchlist = watchlist.filter(
    item =>
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="bg-background-secondary border-b border-border-primary">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet size={32} className="text-accent-cyan" />
                <h1 className="text-3xl font-bold text-text-primary">Watchlist</h1>
              </div>
              <p className="text-text-secondary">Track your favorite stocks and get alerts</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-black rounded-lg font-medium hover:bg-accent-cyan/80 transition-all">
              <Plus size={20} />
              Add Symbol
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={20} />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-border-secondary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="bg-background-secondary border border-border-primary rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left px-6 py-3 text-text-tertiary text-sm font-medium">Symbol</th>
                <th className="text-left px-6 py-3 text-text-tertiary text-sm font-medium">Name</th>
                <th className="text-left px-6 py-3 text-text-tertiary text-sm font-medium">Sector</th>
                <th className="text-right px-6 py-3 text-text-tertiary text-sm font-medium">Price</th>
                <th className="text-right px-6 py-3 text-text-tertiary text-sm font-medium">Change</th>
                <th className="text-right px-6 py-3 text-text-tertiary text-sm font-medium">Change %</th>
                <th className="text-right px-6 py-3 text-text-tertiary text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWatchlist.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border-secondary hover:bg-background-tertiary transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-accent-yellow" />
                      <span className="font-bold text-text-primary">{item.ticker}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-text-primary font-medium">{item.name}</div>
                      {item.alert && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-accent-yellow">
                          <Bell size={12} />
                          <span>{item.alert.message}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-background-tertiary text-text-tertiary text-xs rounded">
                      {item.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-text-primary">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <span className={item.change >= 0 ? 'text-status-safe' : 'text-status-danger'}>
                      {item.change >= 0 ? '+' : ''}
                      ${item.change.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`flex items-center justify-end gap-1 ${item.changePercent >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
                      {item.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="font-medium">
                        {item.changePercent >= 0 ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-accent-cyan hover:text-accent-cyan/80 text-sm font-medium">
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWatchlist.length === 0 && (
          <div className="text-center py-12 text-text-tertiary">
            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
            <p>No stocks in watchlist</p>
          </div>
        )}
      </div>
    </div>
  );
}
