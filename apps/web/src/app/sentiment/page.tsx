'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function SentimentPage() {
  const sentiments = [
    { label: 'Bullish (긍정)', count: 7, percentage: 70, color: 'green' },
    { label: 'Neutral (중립)', count: 2, percentage: 20, color: 'yellow' },
    { label: 'Bearish (부정)', count: 1, percentage: 10, color: 'red' },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Sentiment']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Overall Sentiment */}
          <div className="border border-accent-green border-opacity-30 rounded-lg bg-background-secondary/50 p-8 mb-8">
            <h2 className="text-text-secondary mb-2">Apple (AAPL) 시장 감정</h2>
            <div className="text-5xl font-bold text-accent-green">긍정적</div>
            <p className="text-accent-green mt-2">Bullish Sentiment Prevails</p>
          </div>

          {/* Sentiment Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {sentiments.map((sentiment) => {
              const colorClass =
                sentiment.color === 'green'
                  ? 'border-accent-green'
                  : sentiment.color === 'red'
                  ? 'border-accent-red'
                  : 'border-accent-yellow';

              return (
                <div
                  key={sentiment.label}
                  className={`border ${colorClass} border-opacity-30 rounded-lg bg-background-secondary/50 p-6`}
                >
                  <h3 className="font-bold text-lg mb-3 text-text-primary">{sentiment.label}</h3>

                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-accent-cyan">{sentiment.count}</div>
                    <p className="text-text-secondary">votes / 의견</p>
                  </div>

                  <div className="w-full bg-background-tertiary rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sentiment.color === 'green'
                          ? 'bg-accent-green'
                          : sentiment.color === 'red'
                          ? 'bg-accent-red'
                          : 'bg-accent-yellow'
                      }`}
                      style={{ width: `${sentiment.percentage}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-text-secondary mt-2">{sentiment.percentage}% of sentiment</p>
                </div>
              );
            })}
          </div>

          {/* Drivers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: '긍정 신호',
                items: [
                  '강한 분기별 실적',
                  'AI 기술 리더십',
                  '높은 배당금',
                  '시장 점유율 확대',
                ],
                color: 'accent-green',
              },
              {
                title: '부정 신호',
                items: [
                  '높은 밸류에이션',
                  '경제 금리 인상',
                  '경쟁 심화',
                  '과도한 주가 상승',
                ],
                color: 'accent-red',
              },
              {
                title: '중립 신호',
                items: [
                  '거래량 정상',
                  '변동성 낮음',
                  '시장 전망 엇갈림',
                  '기업 지배구조 안정',
                ],
                color: 'accent-yellow',
              },
            ].map((driver) => (
              <div
                key={driver.title}
                className="border border-border-color rounded-lg bg-background-secondary/50 p-6"
              >
                <h3 className={`text-lg font-bold mb-4 text-${driver.color}`}>{driver.title}</h3>

                <div className="space-y-2">
                  {driver.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-${driver.color}`}></div>
                      <span className="text-text-secondary text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6">
            <h3 className="text-xl font-bold text-text-primary mb-3">감정 분석 결론</h3>
            <p className="text-text-secondary mb-4">
              시장 감정이 매우 긍정적이며, 투자자들의 기대감이 높습니다. 다만 높은 밸류에이션에 대한 우려도
              있으니 신중한 접근이 필요합니다. 기술 기업의 특성상 시장 변동성이 존재할 수 있습니다.
            </p>
            <button className="bg-accent-green text-background-primary px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition">
              상세 리포트 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
