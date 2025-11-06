'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface LightweightChartProps {
  data: { time: string; value: number }[];
  height?: number;
  ticker?: string;
}

export default function LightweightChart({ data, height = 400, ticker = 'Stock' }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0D0D0F' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#1A1A1F' },
        horzLines: { color: '#1A1A1F' },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      timeScale: {
        borderColor: '#1A1A1F',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1A1A1F',
      },
    });

    chartRef.current = chart;

    // Create area series
    const areaSeries = chart.addAreaSeries({
      lineColor: '#00E5FF',
      topColor: 'rgba(0, 229, 255, 0.4)',
      bottomColor: 'rgba(0, 229, 255, 0.0)',
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    // Set data
    const formattedData = data.map(d => ({
      time: d.time,
      value: d.value
    }));
    areaSeries.setData(formattedData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  return (
    <div className="relative">
      <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border-primary">
        <span className="text-xs font-semibold text-accent-cyan">{ticker}</span>
      </div>
      <div ref={chartContainerRef} className="rounded-lg overflow-hidden border border-border-primary" />
    </div>
  );
}
