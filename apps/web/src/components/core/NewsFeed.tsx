'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import type { NewsItem, SectorType } from '@/lib/types/common';

interface NewsFeedProps {
  sector: SectorType;
  tickers?: string[];
}

export const NewsFeed = ({ sector, tickers = [] }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchNews();
    // Refresh every 60 seconds
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, [sector, tickers]);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams({
        sector,
        limit: '20',
        ...(tickers.length > 0 && { tickers: tickers.join(',') }),
      });

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'analyst_report':
        return <FileText size={16} className="text-accent-magenta" />;
      case 'market_update':
        return <TrendingUp size={16} className="text-accent-cyan" />;
      default:
        return <Clock size={16} className="text-text-secondary" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-accent-green';
      case 'negative':
        return 'text-accent-red';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimestamp = (date: Date | string) => {
    const now = new Date();
    const newsDate = new Date(date);
    const diff = Math.floor((now.getTime() - newsDate.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <footer
      className={`bg-background-secondary border-t border-border px-8 transition-all duration-300 ${
        collapsed ? 'h-12' : 'h-news-feed'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          Real-time News Feed
          {loading && (
            <span className="text-xs text-text-secondary animate-pulse">Loading...</span>
          )}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">{news.length} items</span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-background-tertiary rounded transition-colors"
            aria-label={collapsed ? 'Expand news feed' : 'Collapse news feed'}
          >
            {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* News Items */}
      {!collapsed && (
        <div className="space-y-2 overflow-y-auto pb-4" style={{ maxHeight: 'calc(200px - 48px)' }}>
          {news.length === 0 && !loading ? (
            <div className="text-center text-text-secondary py-8">
              No news available for this sector
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 bg-background-primary rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer"
                onClick={() => item.url && window.open(item.url, '_blank')}
              >
                {/* Icon */}
                <div className="mt-1">{getIcon(item.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-text-secondary">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <span className="text-xs text-text-secondary">•</span>
                    <span className="text-xs text-text-secondary">{item.source}</span>
                    {item.sentiment && (
                      <>
                        <span className="text-xs text-text-secondary">•</span>
                        <span className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                          {item.sentiment}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-text-primary line-clamp-2">
                    {item.title}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </footer>
  );
};
