'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function AlertsPage() {
  const alerts = [
    {
      id: 1,
      ticker: 'AAPL',
      type: 'above',
      price: 270,
      status: 'active',
      current: 269.05,
    },
    {
      id: 2,
      ticker: 'MSFT',
      type: 'below',
      price: 360,
      status: 'triggered',
      current: 367.85,
    },
    {
      id: 3,
      ticker: 'GOOGL',
      type: 'above',
      price: 2600,
      status: 'active',
      current: 2400,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Alerts']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Create Alert Form */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">새 알림 생성</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="종목 (예: AAPL)"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition"
              />
              <input
                type="number"
                placeholder="목표 가격"
                className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-cyan transition"
              />
              <select className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan transition">
                <option>above (이상)</option>
                <option>below (이하)</option>
              </select>
              <select className="bg-background-tertiary border border-border-color rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-cyan transition">
                <option>Email</option>
                <option>Push</option>
                <option>SMS</option>
              </select>
              <button className="bg-accent-cyan text-background-primary rounded font-semibold hover:opacity-80 transition">
                알림 생성
              </button>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="border border-border-color rounded-lg overflow-hidden bg-background-secondary/50">
            <div className="p-6 border-b border-border-color">
              <h2 className="text-xl font-bold text-text-primary">활성 알림</h2>
            </div>

            <div className="divide-y divide-border-color">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-6 flex items-center justify-between hover:bg-background-tertiary/30 transition"
                >
                  <div>
                    <h3 className="font-bold text-text-primary">{alert.ticker}</h3>
                    <p className="text-text-secondary text-sm">
                      {alert.type === 'above' ? '↑ ' : '↓ '}
                      ${alert.price} ({alert.type === 'above' ? '이상' : '이하'})
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-text-secondary text-sm">현재 가격</p>
                      <p className="font-bold text-text-primary">${alert.current}</p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded ${
                        alert.status === 'triggered'
                          ? 'bg-accent-green/20 text-accent-green'
                          : 'bg-accent-cyan/20 text-accent-cyan'
                      }`}
                    >
                      {alert.status === 'triggered' ? '트리거됨' : '활성'}
                    </div>

                    <button className="text-accent-red hover:opacity-80 transition">
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
