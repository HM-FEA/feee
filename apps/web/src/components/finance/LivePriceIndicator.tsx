'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';

interface LivePriceIndicatorProps {
  ticker: string;
  currentPrice: number;
  previousClose?: number;
  currency?: string;
  onOpenAlert?: () => void;
}

export default function LivePriceIndicator({
  ticker,
  currentPrice,
  previousClose = 0,
  currency = 'USD',
  onOpenAlert
}: LivePriceIndicatorProps) {
  const [price, setPrice] = useState(currentPrice);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  const change = price - previousClose;
  const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
  const isPositive = change >= 0;

  useEffect(() => {
    setPrice(currentPrice);
  }, [currentPrice]);

  // Simulate real-time price updates (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newPrice = price * (1 + variation);

      if (newPrice > price) {
        setFlash('up');
      } else if (newPrice < price) {
        setFlash('down');
      }

      setPrice(newPrice);

      setTimeout(() => setFlash(null), 300);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="flex items-center gap-4">
      {/* Live Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-xs font-medium text-text-secondary">LIVE</span>
      </div>

      {/* Price */}
      <div className={`flex items-baseline gap-2 transition-all duration-300 ${
        flash === 'up' ? 'text-green-400 scale-105' :
        flash === 'down' ? 'text-red-400 scale-105' :
        ''
      }`}>
        <span className="text-3xl font-bold text-text-primary">
          {currency === 'USD' && '$'}
          {price.toFixed(2)}
        </span>
        {currency !== 'USD' && (
          <span className="text-lg font-medium text-text-tertiary">{currency}</span>
        )}
      </div>

      {/* Change */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        isPositive
          ? 'bg-green-500/10 text-green-400'
          : 'bg-red-500/10 text-red-400'
      }`}>
        {isPositive ? (
          <TrendingUp size={16} className="flex-shrink-0" />
        ) : (
          <TrendingDown size={16} className="flex-shrink-0" />
        )}
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold">
            {isPositive && '+'}{change.toFixed(2)}
          </span>
          <span className="text-xs font-medium">
            ({isPositive && '+'}{changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Alert Button */}
      {onOpenAlert && (
        <button
          onClick={onOpenAlert}
          className="ml-auto p-2 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan transition-all border border-accent-cyan/30"
          title="Set Price Alert"
        >
          <Bell size={16} />
        </button>
      )}

      {/* Market Status */}
      <div className={onOpenAlert ? '' : 'ml-auto'}>
        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-medium">
          Market Open
        </span>
      </div>
    </div>
  );
}
