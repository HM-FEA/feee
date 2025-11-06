'use client';

import StarfieldBackground from '@/components/background/StarfieldBackground';
import { Header } from '@/components/core/Header';

export default function PredictPage() {
  const predictions = [
    { period: '1개월', price: 278.5, change: '+3.5%', confidence: 0.72 },
    { period: '3개월', price: 295.2, change: '+9.7%', confidence: 0.68 },
    { period: '12개월', price: 340.8, change: '+26.6%', confidence: 0.58 },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10">
        <Header breadcrumbs={['Predict']} />

        <div className="px-8 py-8 max-w-7xl mx-auto">
          {/* Current Price */}
          <div className="border border-accent-cyan border-opacity-30 rounded-lg bg-background-secondary/50 p-8 mb-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-text-secondary mb-2">Apple (AAPL)</h2>
                <div className="text-5xl font-bold text-accent-cyan">$269.05</div>
                <p className="text-accent-cyan mt-2">현재 주가</p>
              </div>
              <div className="text-right">
                <div className="text-accent-green text-3xl font-bold">+1.5%</div>
                <p className="text-text-secondary">금일 상승</p>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {predictions.map((pred) => (
              <div
                key={pred.period}
                className="border border-border-color rounded-lg bg-background-secondary/50 p-6 hover:border-opacity-40 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-text-primary">{pred.period}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent-green">${pred.price}</div>
                    <div className="text-accent-green text-sm">{pred.change}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-secondary">신뢰도</span>
                    <span className="font-bold text-text-primary">{(pred.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-background-tertiary rounded h-2">
                    <div
                      className="bg-accent-cyan h-2 rounded"
                      style={{ width: `${pred.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button className="mt-4 w-full bg-accent-cyan text-background-primary rounded py-2 font-semibold hover:opacity-80 transition">
                  자세히 보기
                </button>
              </div>
            ))}
          </div>

          {/* Trend Analysis */}
          <div className="border border-border-color rounded-lg bg-background-secondary/50 p-6 mb-8">
            <h2 className="text-xl font-bold text-text-primary mb-4">트렌드 분석</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">단기 트렌드 (1-3개월)</span>
                  <span className="text-accent-green font-bold">강세 ↑</span>
                </div>
                <p className="text-text-secondary text-sm">기술 지표상 강한 상승 추세를 보이고 있습니다.</p>
              </div>

              <div className="border-t border-border-color pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">중기 트렌드 (3-12개월)</span>
                  <span className="text-accent-yellow font-bold">중립 →</span>
                </div>
                <p className="text-text-secondary text-sm">중기적으로는 횡보장 형태가 예상됩니다.</p>
              </div>

              <div className="border-t border-border-color pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-text-secondary">장기 트렌드 (12개월+)</span>
                  <span className="text-accent-green font-bold">강세 ↑</span>
                </div>
                <p className="text-text-secondary text-sm">장기적으로는 긍정적 전망입니다.</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="border border-accent-red border-opacity-30 rounded-lg bg-background-secondary/50 p-6">
            <h2 className="text-xl font-bold text-accent-red mb-4">주요 위험 요소</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '시장 변동성 증가',
                '경제 금리 인상',
                '기술주 부문 조정',
                '경쟁 심화',
              ].map((risk) => (
                <div key={risk} className="bg-accent-red/10 border border-accent-red/30 rounded p-4">
                  <p className="text-accent-red text-sm">{risk}</p>
                </div>
              ))}
            </div>

            <p className="text-text-secondary text-sm mt-4">
              위 위험 요소들이 실현될 경우 예측 가격이 변동될 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
