'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function BacktestPage() {
  const results = {
    totalReturn: 45.8,
    annualReturn: 21.2,
    maxDrawdown: -18.5,
    sharpeRatio: 1.32,
    trades: 24,
    winners: 16,
    losers: 8,
    winRate: 66.7,
  };

  const equity = [
    10000, 10250, 10075, 10400, 10630, 10340, 10795, 11230, 11840, 12150, 12560,
    13120, 13850, 14200, 14890, 15400, 15920, 16450, 16980, 17650, 18340, 19050,
    19800, 20600,
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Backtest']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Strategy Setup */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">전략 설정</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                defaultValue="AAPL"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan transition"
              />
              <select className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan transition">
                <option>MA Crossover (20/50)</option>
                <option>RSI Strategy</option>
                <option>MACD Strategy</option>
              </select>
              <input
                type="number"
                defaultValue="10000"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan transition"
              />
              <button className="bg-accent-cyan text-background-primary rounded font-semibold hover:opacity-80 transition">
                백테스트 실행
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-accent-green border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
              <div className="text-text-secondary text-sm mb-2">총 수익률</div>
              <p className="text-3xl font-bold text-accent-green">+{results.totalReturn}%</p>
              <p className="text-text-secondary text-sm">2년 동안</p>
            </div>

            <div className="border border-accent-cyan border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
              <div className="text-text-secondary text-sm mb-2">연간 수익률</div>
              <p className="text-3xl font-bold text-accent-cyan">+{results.annualReturn}%</p>
              <p className="text-text-secondary text-sm">연 평균</p>
            </div>

            <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6">
              <div className="text-text-secondary text-sm mb-2">승률</div>
              <p className="text-3xl font-bold text-accent-yellow">{results.winRate}%</p>
              <p className="text-text-secondary text-sm">{results.winners}승 / {results.trades}거래</p>
            </div>

            <div className="border border-accent-red border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
              <div className="text-text-secondary text-sm mb-2">최대 낙폭</div>
              <p className="text-3xl font-bold text-accent-red">{results.maxDrawdown}%</p>
              <p className="text-text-secondary text-sm">DrawDown</p>
            </div>
          </div>

          {/* Equity Curve */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">자산 변동 (Equity Curve)</h2>

            <div className="bg-background-tertiary rounded p-4 h-64 flex items-end justify-between gap-1">
              {equity.map((value, idx) => {
                const minVal = Math.min(...equity);
                const maxVal = Math.max(...equity);
                const height = ((value - minVal) / (maxVal - minVal)) * 100;

                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-accent-cyan to-accent-green rounded-t opacity-70 hover:opacity-100 transition"
                    style={{ height: `${height}%` }}
                    title={`$${value.toLocaleString()}`}
                  ></div>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-text-secondary">
              <p>초기 자본: $10,000 → 최종 자본: $14,580</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">거래 통계</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">총 거래 수</span>
                  <span className="font-bold text-text-primary">{results.trades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">승리한 거래</span>
                  <span className="font-bold text-accent-green">{results.winners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">손실한 거래</span>
                  <span className="font-bold text-accent-red">{results.losers}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border-color">
                  <span className="text-text-secondary">승률</span>
                  <span className="font-bold text-text-primary">{results.winRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">평균 이익</span>
                  <span className="font-bold text-accent-green">+$285</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">평균 손실</span>
                  <span className="font-bold text-accent-red">-$120</span>
                </div>
              </div>
            </div>

            <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">위험 지표</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">샤프 비율</span>
                  <span className="font-bold text-text-primary">{results.sharpeRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">최대 낙폭</span>
                  <span className="font-bold text-accent-red">{results.maxDrawdown}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">하락 기간</span>
                  <span className="font-bold text-text-primary">3개월</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border-color">
                  <span className="text-text-secondary">최대 연속 승리</span>
                  <span className="font-bold text-accent-green">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">최대 연속 패배</span>
                  <span className="font-bold text-accent-red">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">이익 인수</span>
                  <span className="font-bold text-text-primary">2.38</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
