'use client';

import React, { useMemo } from 'react';
import { ChevronDown, ThumbsUp, MessageCircle } from 'lucide-react';

interface CommunityInsight {
  id: string;
  userId: string;
  userName: string;
  avatarColor: string;
  rating: number;
  title: string;
  description: string;
  upvotes: number;
  comments: number;
  timestamp: string;
}

const mockCommunityInsights: CommunityInsight[] = [
  {
    id: '1',
    userId: 'analyst_01',
    userName: '김분석가',
    avatarColor: 'bg-emerald-500',
    rating: 5,
    title: '금리 인상 시 섹터별 영향도',
    description: '은행주는 긍정, 부동산은 부정적 영향이 예상됩니다.',
    upvotes: 234,
    comments: 12,
    timestamp: '3시간 전',
  },
  {
    id: '2',
    userId: 'analyst_02',
    userName: '이트레이더',
    avatarColor: 'bg-cyan-500',
    rating: 4,
    title: '반도체 수급 개선 신호 분석',
    description: '2024년 Q4부터 본격적인 수급 개선이 예상됩니다.',
    upvotes: 156,
    comments: 8,
    timestamp: '5시간 전',
  },
  {
    id: '3',
    userId: 'analyst_03',
    userName: '박연구원',
    avatarColor: 'bg-purple-500',
    rating: 4,
    title: '무역 분쟁이 제조업에 미치는 영향',
    description: '수출입 기업의 마진율 악화 가능성을 검토했습니다.',
    upvotes: 89,
    comments: 5,
    timestamp: '8시간 전',
  },
  {
    id: '4',
    userId: 'analyst_04',
    userName: '최퀀트',
    avatarColor: 'bg-orange-500',
    rating: 5,
    title: 'REITs 매력도 재평가',
    description: '현재 이자율 환경에서 배당 수익률이 매력적입니다.',
    upvotes: 124,
    comments: 7,
    timestamp: '10시간 전',
  },
];

interface CommunityPanelProps {
  onInsightClick?: (insight: CommunityInsight) => void;
}

export default function CommunityPanel({ onInsightClick }: CommunityPanelProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-xs ${i < rating ? 'text-accent-cyan' : 'text-text-tertiary'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="text-xs font-semibold text-text-primary">커뮤니티 인사이트</h3>
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
          {/* Insights List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
            {mockCommunityInsights.map(insight => (
              <button
                key={insight.id}
                onClick={() => onInsightClick?.(insight)}
                className="w-full p-2.5 rounded bg-background-tertiary hover:bg-background-tertiary/80 transition-colors text-left group"
              >
                {/* User Info + Rating */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-full flex-shrink-0 ${insight.avatarColor} opacity-70`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {insight.userName}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">{renderStars(insight.rating)}</div>
                </div>

                {/* Title */}
                <p className="text-xs text-text-primary font-medium line-clamp-2 group-hover:text-accent-cyan transition-colors mb-1">
                  {insight.title}
                </p>

                {/* Description */}
                <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                  {insight.description}
                </p>

                {/* Stats + Timestamp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={12} className="text-text-tertiary" />
                      <span>{insight.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} className="text-text-tertiary" />
                      <span>{insight.comments}</span>
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary flex-shrink-0">
                    {insight.timestamp}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* View All Link */}
          <div className="mt-3 pt-2 border-t border-border-primary flex-shrink-0">
            <a
              href="/community"
              className="text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              전체 커뮤니티 보기 →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
