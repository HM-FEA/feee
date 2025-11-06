'use client';

import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sector: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '금리 인상 가능성 언급, 은행주 상승',
    source: 'Bloomberg',
    timestamp: '2분 전',
    sentiment: 'positive',
    sector: 'Banking',
  },
  {
    id: '2',
    title: '부동산 시장 침체 우려, REITs 하락',
    source: 'Reuters',
    timestamp: '15분 전',
    sentiment: 'negative',
    sector: 'RealEstate',
  },
  {
    id: '3',
    title: '반도체 수급 안정화 신호',
    source: 'MarketWatch',
    timestamp: '28분 전',
    sentiment: 'positive',
    sector: 'Semiconductors',
  },
  {
    id: '4',
    title: '무역 분쟁 심화, 제조업 우려',
    source: 'CNBC',
    timestamp: '45분 전',
    sentiment: 'negative',
    sector: 'Manufacturing',
  },
  {
    id: '5',
    title: '환율 상승으로 수출입 기업 영향',
    source: 'Financial Times',
    timestamp: '1시간 전',
    sentiment: 'neutral',
    sector: 'Manufacturing',
  },
];

const getSentimentColor = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return 'text-status-safe bg-status-safe/10';
    case 'negative':
      return 'text-status-danger bg-status-danger/10';
    default:
      return 'text-status-caution bg-status-caution/10';
  }
};

const getSentimentLabel = (sentiment: string): string => {
  switch (sentiment) {
    case 'positive':
      return '+';
    case 'negative':
      return '−';
    default:
      return '○';
  }
};

interface NewsFeedProps {
  selectedSector?: string;
  onNewsClick?: (news: NewsItem) => void;
}

export default function NewsFeed({ selectedSector, onNewsClick }: NewsFeedProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);

  const filteredNews = useMemo(() => {
    let filtered = mockNews;
    if (selectedFilter) {
      filtered = filtered.filter(n => n.sector === selectedFilter);
    }
    return filtered;
  }, [selectedFilter]);

  const sectors = useMemo(() => {
    return Array.from(new Set(mockNews.map(n => n.sector)));
  }, []);

  return (
    <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-semibold text-text-primary">뉴스 피드</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-background-tertiary rounded transition-colors"
        >
          <ChevronDown
            size={14}
            className={`text-text-secondary transition-transform ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Filters */}
          <div className="flex gap-1 mb-3 overflow-x-auto pb-2 flex-shrink-0 text-xs">
            <button
              onClick={() => setSelectedFilter(null)}
              className={`px-2 py-1 rounded whitespace-nowrap transition-colors text-xs ${
                selectedFilter === null
                  ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan'
                  : 'bg-background-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              All
            </button>
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedFilter(sector)}
                className={`px-2 py-1 rounded whitespace-nowrap transition-colors text-xs ${
                  selectedFilter === sector
                    ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* News List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
            {filteredNews.map(news => (
              <button
                key={news.id}
                onClick={() => onNewsClick?.(news)}
                className="w-full p-2 rounded bg-background-tertiary hover:bg-background-tertiary/80 transition-colors text-left group"
              >
                {/* Title */}
                <p className="text-xs text-text-primary font-medium line-clamp-2 group-hover:text-accent-cyan transition-colors mb-1">
                  {news.title}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-text-tertiary">{news.source}</span>
                    <span className="text-text-tertiary">·</span>
                    <span className="text-text-tertiary">{news.timestamp}</span>
                  </div>

                  {/* Sentiment Badge */}
                  <div className={`px-1.5 py-0.5 rounded text-xs font-semibold ${getSentimentColor(news.sentiment)}`}>
                    {getSentimentLabel(news.sentiment)}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-3 pt-2 border-t border-border-primary flex-shrink-0">
            <a
              href="/news"
              className="text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              전체 뉴스 보기 →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
