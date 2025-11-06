'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function PortfolioPage() {
  const portfolio = {
    total_value: 125000,
    total_cost: 100000,
    total_gain_loss: 25000,
    positions: [
      {
        ticker: 'AAPL',
        quantity: 10,
        average_cost: 150,
        current_value: 2690.50,
        gain_loss: 269.5,
        gain_loss_percent: 11,
      },
      {
        ticker: 'MSFT',
        quantity: 5,
        average_cost: 300,
        current_value: 1839,
        gain_loss: -145,
        gain_loss_percent: -7.3,
      },
      {
        ticker: 'GOOGL',
        quantity: 3,
        average_cost: 2500,
        current_value: 2400,
        gain_loss: -300,
        gain_loss_percent: -4,
      },
    ],
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Portfolio']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-current border-opacity-20 bg-background-secondary rounded-lg p-6 hover:border-opacity-40 transition">
              <div className="text-text-secondary text-sm mb-2">포트폴리오 가치</div>
              <div className="text-3xl font-bold text-accent-cyan mb-1">${portfolio.total_value.toLocaleString()}</div>
              <div className="text-sm text-accent-green">+$25,000</div>
            </div>

            <div className="border border-current border-opacity-20 bg-background-secondary rounded-lg p-6 hover:border-opacity-40 transition">
              <div className="text-text-secondary text-sm mb-2">투자 비용</div>
              <div className="text-3xl font-bold text-text-primary mb-1">${portfolio.total_cost.toLocaleString()}</div>
              <div className="text-sm text-text-secondary">총 투입액</div>
            </div>

            <div className="border border-current border-opacity-20 bg-background-secondary rounded-lg p-6 hover:border-opacity-40 transition">
              <div className="text-text-secondary text-sm mb-2">수익</div>
              <div className="text-3xl font-bold text-accent-green mb-1">+${portfolio.total_gain_loss.toLocaleString()}</div>
              <div className="text-sm text-accent-green">+25%</div>
            </div>

            <div className="border border-current border-opacity-20 bg-background-secondary rounded-lg p-6 hover:border-opacity-40 transition">
              <div className="text-text-secondary text-sm mb-2">포지션 수</div>
              <div className="text-3xl font-bold text-accent-magenta mb-1">{portfolio.positions.length}</div>
              <div className="text-sm text-text-secondary">보유 종목</div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="border border-border-color rounded-lg overflow-hidden bg-background-secondary/50">
            <div className="p-6 border-b border-border-color">
              <h2 className="text-xl font-bold text-text-primary">보유 종목</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background-tertiary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">종목</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">수량</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">평균 매입가</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">현재 가치</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">손익</th>
                    <th className="px-6 py-4 text-left text-text-secondary font-semibold">손익률</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.positions.map((pos, idx) => (
                    <tr
                      key={pos.ticker}
                      className="border-t border-border-color hover:bg-background-tertiary/30 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-accent-cyan">{pos.ticker}</td>
                      <td className="px-6 py-4 text-text-primary">{pos.quantity} 주</td>
                      <td className="px-6 py-4 text-text-primary">${pos.average_cost}</td>
                      <td className="px-6 py-4 text-text-primary">${pos.current_value.toFixed(2)}</td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          pos.gain_loss >= 0 ? 'text-accent-green' : 'text-accent-red'
                        }`}
                      >
                        {pos.gain_loss >= 0 ? '+' : ''}${pos.gain_loss.toFixed(2)}
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          pos.gain_loss_percent >= 0 ? 'text-accent-green' : 'text-accent-red'
                        }`}
                      >
                        {pos.gain_loss_percent >= 0 ? '+' : ''}
                        {pos.gain_loss_percent}%
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
