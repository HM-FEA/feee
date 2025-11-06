'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function ComparePage() {
  const comparison = {
    stocks: [
      { ticker: 'AAPL', price: 269.05, pe: 32.5, market_cap: '3.97T', dividend: '0.40%' },
      { ticker: 'MSFT', price: 367.85, pe: 36.8, market_cap: '2.73T', dividend: '0.76%' },
    ],
    metrics: [
      { label: '현재 주가', aapl: '$269.05', msft: '$367.85', winner: 'MSFT' },
      { label: 'P/E 비율', aapl: '32.5', msft: '36.8', winner: 'AAPL' },
      { label: '시가총액', aapl: '$3.97T', msft: '$2.73T', winner: 'AAPL' },
      { label: '배당수익률', aapl: '0.40%', msft: '0.76%', winner: 'MSFT' },
    ],
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Compare']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Stock Selector */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">비교 대상 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="첫 번째 종목"
                defaultValue="AAPL"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition"
              />
              <input
                type="text"
                placeholder="두 번째 종목"
                defaultValue="MSFT"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition"
              />
              <button className="bg-accent-cyan text-background-primary rounded font-semibold hover:opacity-80 transition">
                비교 시작
              </button>
            </div>
          </div>

          {/* Comparison Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border border-accent-cyan border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
              <h3 className="text-2xl font-bold text-accent-cyan mb-4">AAPL</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">현재 주가</span>
                  <span className="font-bold text-text-primary">$269.05</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">시가총액</span>
                  <span className="font-bold text-text-primary">$3.97T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">P/E 비율</span>
                  <span className="font-bold text-text-primary">32.5</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">종합 점수</span>
                  <span className="text-2xl font-bold text-accent-cyan">4.2/5</span>
                </div>
              </div>
            </div>

            <div className="border border-accent-green border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
              <h3 className="text-2xl font-bold text-accent-green mb-4">MSFT</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">현재 주가</span>
                  <span className="font-bold text-text-primary">$367.85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">시가총액</span>
                  <span className="font-bold text-text-primary">$2.73T</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">P/E 비율</span>
                  <span className="font-bold text-text-primary">36.8</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border-color">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">종합 점수</span>
                  <span className="text-2xl font-bold text-accent-green">4.5/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="border border-border-color rounded-lg overflow-hidden bg-background-secondary/50">
            <div className="p-6 border-b border-border-color">
              <h2 className="text-xl font-bold text-text-primary">상세 지표 비교</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background-tertiary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">지표</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">AAPL</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">MSFT</th>
                    <th className="px-6 py-4 text-center text-text-secondary font-semibold">우위</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.metrics.map((metric) => (
                    <tr
                      key={metric.label}
                      className="border-t border-border-color hover:bg-background-tertiary/30 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-text-primary">{metric.label}</td>
                      <td className="px-6 py-4 text-text-primary">{metric.aapl}</td>
                      <td className="px-6 py-4 text-text-primary">{metric.msft}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            metric.winner === 'AAPL'
                              ? 'bg-accent-cyan/20 text-accent-cyan'
                              : 'bg-accent-green/20 text-accent-green'
                          }`}
                        >
                          {metric.winner}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
