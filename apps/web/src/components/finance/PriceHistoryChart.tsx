'use client';

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Period = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

interface PriceHistoryChartProps {
  ticker: string;
  basePrice: number;
}

export default function PriceHistoryChart({ ticker, basePrice }: PriceHistoryChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('1M');

  const periods: { id: Period; label: string; days: number }[] = [
    { id: '1D', label: '1D', days: 1 },
    { id: '1W', label: '1W', days: 7 },
    { id: '1M', label: '1M', days: 30 },
    { id: '3M', label: '3M', days: 90 },
    { id: '1Y', label: '1Y', days: 365 },
    { id: '5Y', label: '5Y', days: 1825 },
  ];

  const chartData = useMemo(() => {
    const period = periods.find(p => p.id === selectedPeriod)!;
    const dataPoints = selectedPeriod === '1D' ? 390 : Math.min(period.days, 365); // 6.5 hours * 60 mins for 1D

    return Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();

      if (selectedPeriod === '1D') {
        // Minute-by-minute for 1D
        date.setMinutes(date.getMinutes() - (dataPoints - i));
      } else {
        // Daily for other periods
        date.setDate(date.getDate() - (dataPoints - i - 1));
      }

      // Generate realistic price movement
      const seed = `${ticker}-${i}`;
      let hash = 0;
      for (let j = 0; j < seed.length; j++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(j);
        hash |= 0;
      }
      const random = (hash & 0x7fffffff) / 0x7fffffff;

      // Add trend and volatility
      const trend = (i / dataPoints) * 0.1; // Slight upward trend
      const volatility = (random - 0.5) * 0.15;
      const price = basePrice * (1 + trend + volatility);

      return {
        date: selectedPeriod === '1D'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2)),
        timestamp: date.getTime(),
      };
    });
  }, [selectedPeriod, ticker, basePrice]);

  const priceRange = useMemo(() => {
    const prices = chartData.map(d => d.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      change: prices[prices.length - 1] - prices[0],
      changePercent: ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100,
    };
  }, [chartData]);

  const isPositive = priceRange.change >= 0;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-background-secondary rounded-lg p-1">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedPeriod === period.id
                  ? 'bg-accent-cyan text-black'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Period Change */}
        <div className={`text-sm font-semibold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {isPositive && '+'}{priceRange.change.toFixed(2)} ({isPositive && '+'}{priceRange.changePercent.toFixed(2)}%)
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1F" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[priceRange.min * 0.995, priceRange.max * 1.005]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0D0D0F',
                border: '1px solid #1A1A1F',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#00E5FF', fontSize: '12px', marginBottom: '4px' }}
              itemStyle={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}
              formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#priceGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
