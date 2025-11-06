'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StockData } from '@/lib/types/stocks';

interface RealEstateStockChartProps {
  tickers: string[];
  data?: StockData[];
  loading?: boolean;
}

export const RealEstateStockChart = ({
  tickers,
  data = [],
  loading = false
}: RealEstateStockChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      // Transform data for recharts
      const transformed = data.map(stock => ({
        ticker: stock.ticker,
        price: stock.price,
        change: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap,
      }));
      setChartData(transformed);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-pulse text-text-secondary">Loading market data...</div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-text-secondary">
          <p>No data available</p>
          <p className="text-sm mt-2">Run a simulation to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Real Estate Stocks Performance
      </h2>

      {/* Stock Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {data.map((stock) => (
          <div
            key={stock.ticker}
            className="bg-background-primary border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">{stock.ticker}</span>
              <span className={`text-xs font-semibold ${
                stock.changePercent >= 0 ? 'text-accent-green' : 'text-accent-red'
              }`}>
                {stock.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              ${stock.price.toFixed(2)}
            </div>
            <div className="text-xs text-text-tertiary mt-1">
              Vol: {(stock.volume / 1000000).toFixed(2)}M
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#33333F" />
            <XAxis
              dataKey="ticker"
              stroke="#A9A9A9"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#A9A9A9"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1B1B22',
                border: '1px solid #33333F',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F5F5F5' }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '12px',
                color: '#A9A9A9',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00E5FF"
              strokeWidth={2}
              dot={{ fill: '#00E5FF', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
