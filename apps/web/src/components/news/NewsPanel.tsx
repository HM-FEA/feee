'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, Users, ExternalLink, Clock, AlertCircle, Briefcase } from 'lucide-react';

// ===== TYPES =====

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedTickers: string[];
  imageUrl?: string;
}

interface InvestorPosition {
  id: string;
  investor: string;
  investorType: 'hedge_fund' | 'mutual_fund' | 'insider' | 'institution';
  ticker: string;
  action: 'buy' | 'sell' | 'hold';
  shares: number;
  value: number;
  changePercent: number;
  filingDate: Date;
}

interface CryptoWhale {
  id: string;
  address: string;
  addressLabel?: string;
  token: string;
  action: 'accumulate' | 'distribute';
  amount: number;
  valueUSD: number;
  timestamp: Date;
}

// ===== MOCK DATA (Replace with real API calls) =====

const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Fed Signals Potential Rate Cut in Q2 2025',
    summary: 'Federal Reserve officials hint at possible monetary easing amid cooling inflation data and stable employment figures.',
    source: 'Bloomberg',
    url: '#',
    publishedAt: new Date(Date.now() - 1000 * 60 * 30),
    sentiment: 'positive',
    relatedTickers: ['JPM', 'BAC', 'GS']
  },
  {
    id: '2',
    title: 'Tech Giants Report Record AI Infrastructure Spending',
    summary: 'Microsoft, Google, and Amazon announce $150B combined investment in AI data centers, boosting semiconductor demand.',
    source: 'WSJ',
    url: '#',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    sentiment: 'positive',
    relatedTickers: ['MSFT', 'GOOGL', 'NVDA', 'TSM']
  },
  {
    id: '3',
    title: 'Oil Prices Surge on OPEC+ Supply Cut Extension',
    summary: 'Crude oil hits $95/barrel as OPEC+ extends production cuts through Q3, raising inflation concerns.',
    source: 'Reuters',
    url: '#',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    sentiment: 'negative',
    relatedTickers: ['XOM', 'CVX']
  }
];

const MOCK_POSITIONS: InvestorPosition[] = [
  {
    id: '1',
    investor: 'Warren Buffett (Berkshire Hathaway)',
    investorType: 'hedge_fund',
    ticker: 'AAPL',
    action: 'buy',
    shares: 915_560_382,
    value: 174_300_000_000,
    changePercent: 2.3,
    filingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: '2',
    investor: 'Ray Dalio (Bridgewater)',
    investorType: 'hedge_fund',
    ticker: 'GLD',
    action: 'buy',
    shares: 45_230_000,
    value: 8_200_000_000,
    changePercent: 15.7,
    filingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
  },
  {
    id: '3',
    investor: 'Bill Ackman (Pershing Square)',
    investorType: 'hedge_fund',
    ticker: 'GOOGL',
    action: 'sell',
    shares: 12_500_000,
    value: 1_750_000_000,
    changePercent: -8.2,
    filingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  }
];

const MOCK_WHALES: CryptoWhale[] = [
  {
    id: '1',
    address: '0x742d...a5b3',
    addressLabel: 'Binance Cold Wallet #8',
    token: 'BTC',
    action: 'accumulate',
    amount: 2500,
    valueUSD: 108_750_000,
    timestamp: new Date(Date.now() - 1000 * 60 * 20)
  },
  {
    id: '2',
    address: '0x3f5c...2e9a',
    addressLabel: 'Jump Trading',
    token: 'ETH',
    action: 'distribute',
    amount: 45000,
    valueUSD: 108_000_000,
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  }
];

// ===== COMPONENTS =====

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-xl p-4 ${className}`}>
    {children}
  </div>
);

const NewsCard = ({ article }: { article: NewsArticle }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const sentimentColor = {
    positive: 'text-status-safe',
    negative: 'text-status-danger',
    neutral: 'text-text-secondary'
  }[article.sentiment];

  return (
    <Card className="hover:border-[#2A2A2F] transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-accent-cyan transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-text-secondary mb-2 line-clamp-2">
            {article.summary}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-text-tertiary">{article.source}</span>
            <div className="flex items-center gap-1 text-text-tertiary">
              <Clock size={12} />
              {timeAgo(article.publishedAt)}
            </div>
            <span className={`font-semibold ${sentimentColor}`}>
              {article.sentiment.toUpperCase()}
            </span>
          </div>
          {article.relatedTickers.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {article.relatedTickers.slice(0, 3).map(ticker => (
                <span key={ticker} className="px-2 py-0.5 bg-accent-cyan/10 text-accent-cyan text-xs rounded">
                  {ticker}
                </span>
              ))}
            </div>
          )}
        </div>
        <ExternalLink size={14} className="text-text-tertiary group-hover:text-accent-cyan transition-colors" />
      </div>
    </Card>
  );
};

const PositionCard = ({ position }: { position: InvestorPosition }) => {
  const timeAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  const actionColor = {
    buy: 'text-status-safe bg-status-safe/10',
    sell: 'text-status-danger bg-status-danger/10',
    hold: 'text-text-secondary bg-background-tertiary'
  }[position.action];

  const investorIcon = {
    hedge_fund: Briefcase,
    mutual_fund: Users,
    insider: AlertCircle,
    institution: TrendingUp
  }[position.investorType];

  const Icon = investorIcon;

  return (
    <Card className="hover:border-[#2A2A2F] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          <Icon size={16} className="text-accent-cyan mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-text-primary">{position.investor}</h4>
            <p className="text-xs text-text-tertiary">{timeAgo(position.filingDate)}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${actionColor}`}>
          {position.action.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Ticker:</span>
          <span className="font-bold text-accent-cyan">{position.ticker}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Value:</span>
          <span className="font-mono text-text-primary">${(position.value / 1_000_000_000).toFixed(2)}B</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Change:</span>
          <span className={`font-semibold ${position.changePercent >= 0 ? 'text-status-safe' : 'text-status-danger'}`}>
            {position.changePercent >= 0 ? '+' : ''}{position.changePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </Card>
  );
};

const WhaleCard = ({ whale }: { whale: CryptoWhale }) => {
  const timeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const actionColor = whale.action === 'accumulate' ? 'text-status-safe bg-status-safe/10' : 'text-status-danger bg-status-danger/10';

  return (
    <Card className="hover:border-[#2A2A2F] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary font-mono">{whale.address}</h4>
          {whale.addressLabel && (
            <p className="text-xs text-accent-cyan">{whale.addressLabel}</p>
          )}
          <p className="text-xs text-text-tertiary mt-1">{timeAgo(whale.timestamp)}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${actionColor}`}>
          {whale.action.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Token:</span>
          <span className="font-bold text-accent-magenta">{whale.token}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Amount:</span>
          <span className="font-mono text-text-primary">{whale.amount.toLocaleString()} {whale.token}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Value:</span>
          <span className="font-mono text-accent-emerald">${(whale.valueUSD / 1_000_000).toFixed(2)}M</span>
        </div>
      </div>
    </Card>
  );
};

// ===== MAIN COMPONENT =====

export default function NewsPanel() {
  const [activeTab, setActiveTab] = useState<'news' | 'positions' | 'whales'>('news');
  const [news, setNews] = useState<NewsArticle[]>(MOCK_NEWS);
  const [positions, setPositions] = useState<InvestorPosition[]>(MOCK_POSITIONS);
  const [whales, setWhales] = useState<CryptoWhale[]>(MOCK_WHALES);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with real API calls
  useEffect(() => {
    // Fetch news from Finnhub/NewsAPI
    // Fetch positions from WhaleWisdom/SEC EDGAR
    // Fetch whale activity from Etherscan/Glassnode
  }, [activeTab]);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Header */}
      <div className="border-b border-[#1A1A1F] p-4">
        <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
          <Newspaper size={20} className="text-accent-cyan" />
          Market Intelligence
        </h2>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'news'
                ? 'bg-accent-cyan text-black'
                : 'bg-[#1A1A1F] text-text-secondary hover:text-text-primary'
              }
            `}
          >
            News ({news.length})
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'positions'
                ? 'bg-accent-cyan text-black'
                : 'bg-[#1A1A1F] text-text-secondary hover:text-text-primary'
              }
            `}
          >
            Investor Positions ({positions.length})
          </button>
          <button
            onClick={() => setActiveTab('whales')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'whales'
                ? 'bg-accent-cyan text-black'
                : 'bg-[#1A1A1F] text-text-secondary hover:text-text-primary'
              }
            `}
          >
            Crypto Whales ({whales.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-secondary text-sm">Loading...</p>
          </div>
        ) : activeTab === 'news' ? (
          news.map(article => <NewsCard key={article.id} article={article} />)
        ) : activeTab === 'positions' ? (
          positions.map(position => <PositionCard key={position.id} position={position} />)
        ) : (
          whales.map(whale => <WhaleCard key={whale.id} whale={whale} />)
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1A1A1F] p-3 text-xs text-text-tertiary">
        <p>
          {activeTab === 'news' && 'News from Bloomberg, WSJ, Reuters via Finnhub/NewsAPI'}
          {activeTab === 'positions' && '13F filings from SEC EDGAR & WhaleWisdom'}
          {activeTab === 'whales' && 'On-chain data from Etherscan & Glassnode'}
        </p>
      </div>
    </div>
  );
}
