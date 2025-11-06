# 🎨 Core Layout System - Universal Simulation Interface

**Purpose:** 모든 섹터 시뮬레이션에서 공통으로 사용하는 레이아웃 시스템
**Version:** 1.0.0
**Last Updated:** 2025-10-31

---

## 🎯 Design Philosophy

**"One Layout to Rule Them All"** - 부동산, 제조업, 암호화폐 등 모든 섹터가 동일한 레이아웃 구조를 공유하되, 중앙 컨텐츠만 섹터별로 다르게 렌더링.

---

## 📐 Universal Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Header (Fixed)                                    [User]    │
│  Home > Sector > Analysis                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────┐  ┌────────────────┐   │
│  │                                  │  │  Control Panel │   │
│  │                                  │  │                │   │
│  │       Main Visualization         │  │  - Slider      │   │
│  │       (Sector-Specific)          │  │  - Dropdowns   │   │
│  │                                  │  │  - Buttons     │   │
│  │  - Real Estate: Network Graph    │  │                │   │
│  │  - Stocks: Candlestick Chart     │  │  - Metrics     │   │
│  │  - Crypto: Blockchain Viz        │  │  - KPIs        │   │
│  │                                  │  │                │   │
│  │                                  │  │                │   │
│  └──────────────────────────────────┘  └────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Real-time News Feed (Scrollable)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📰 [2m ago] KB금융, 부동산PF 대출 비중 축소...        │  │
│  │ 📰 [5m ago] 신한리츠, 배당 수익률 4.2% 기록...       │  │
│  │ 📊 [10m ago] Analyst Report: Real Estate Sector...   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Architecture

### 1. Core Layout Component (Universal)

```tsx
// components/core/SimulationLayout.tsx
'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { ControlPanel } from './ControlPanel';
import { NewsFeed } from './NewsFeed';

interface SimulationLayoutProps {
  // 섹터별로 다른 부분
  sector: 'real-estate' | 'stocks' | 'crypto' | 'manufacturing';
  mainContent: ReactNode;  // 중앙 시각화 컴포넌트
  controls: ReactNode;     // 오른쪽 컨트롤 패널 내용

  // 공통 부분
  breadcrumbs?: string[];
  onSimulate?: () => void;
}

export const SimulationLayout = ({
  sector,
  mainContent,
  controls,
  breadcrumbs = ['Home', 'Sector'],
  onSimulate,
}: SimulationLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#101015] flex flex-col">
      {/* Header - Fixed */}
      <Header breadcrumbs={breadcrumbs} />

      {/* Main Content Area */}
      <main className="flex-1 flex gap-6 p-6">
        {/* Left: Main Visualization (70%) */}
        <div className="flex-1 min-h-0">
          <div className="h-full bg-[#1B1B22] border border-[#33333F] rounded-lg p-6">
            {mainContent}
          </div>
        </div>

        {/* Right: Control Panel (30%) */}
        <aside className="w-[400px] flex flex-col gap-4">
          <div className="bg-[#1B1B22] border border-[#33333F] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
              Controls
            </h2>
            {controls}
          </div>

          {/* Quick Metrics */}
          <div className="bg-[#1B1B22] border border-[#33333F] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">
              Quick Metrics
            </h2>
            {/* Sector-specific metrics will be passed as children */}
          </div>
        </aside>
      </main>

      {/* Bottom: News Feed - Fixed Height, Scrollable */}
      <NewsFeed sector={sector} />
    </div>
  );
};
```

---

### 2. Header Component (Universal)

```tsx
// components/core/Header.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, User } from 'lucide-react';

interface HeaderProps {
  breadcrumbs: string[];
}

export const Header = ({ breadcrumbs }: HeaderProps) => {
  return (
    <header className="bg-[#1B1B22] border-b border-[#33333F] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-[#00E5FF]">
            Nexus-Alpha
          </Link>

          <nav className="flex items-center gap-2 text-[#A9A9A9]">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight size={16} />}
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? 'text-[#F5F5F5]'
                      : 'hover:text-[#F5F5F5] cursor-pointer'
                  }
                >
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#33333F] rounded-lg transition-colors">
            <User size={20} className="text-[#F5F5F5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
```

---

### 3. News Feed Component (Universal with Sector Filter)

```tsx
// components/core/NewsFeed.tsx
'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/lib/hooks/useWebSocket';
import { Clock, TrendingUp, FileText } from 'lucide-react';

interface NewsItem {
  id: string;
  type: 'news' | 'analyst_report' | 'market_update';
  title: string;
  source: string;
  timestamp: Date;
  sector: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  url?: string;
}

interface NewsFeedProps {
  sector: string;
}

export const NewsFeed = ({ sector }: NewsFeedProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { data: liveNews } = useWebSocket('news-feed');

  useEffect(() => {
    if (liveNews) {
      // Filter by sector
      if (liveNews.sector === sector || liveNews.sector === 'all') {
        setNews((prev) => [liveNews, ...prev].slice(0, 50)); // Keep last 50
      }
    }
  }, [liveNews, sector]);

  // Initial load
  useEffect(() => {
    fetchInitialNews();
  }, [sector]);

  const fetchInitialNews = async () => {
    const response = await fetch(`/api/news?sector=${sector}&limit=20`);
    const data = await response.json();
    setNews(data);
  };

  const getIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'analyst_report':
        return <FileText size={16} className="text-[#E6007A]" />;
      case 'market_update':
        return <TrendingUp size={16} className="text-[#00E5FF]" />;
      default:
        return <Clock size={16} className="text-[#A9A9A9]" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-[#39FF14]';
      case 'negative':
        return 'text-[#FF1744]';
      default:
        return 'text-[#A9A9A9]';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <footer className="bg-[#1B1B22] border-t border-[#33333F] px-8 py-4 h-[200px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#F5F5F5]">
          Real-time News Feed
        </h3>
        <span className="text-sm text-[#A9A9A9]">{news.length} items</span>
      </div>

      <div className="space-y-2">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 bg-[#101015] rounded-lg hover:bg-[#1B1B22] transition-colors cursor-pointer"
            onClick={() => item.url && window.open(item.url, '_blank')}
          >
            {/* Icon */}
            <div className="mt-1">{getIcon(item.type)}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#A9A9A9]">
                  {formatTimestamp(item.timestamp)}
                </span>
                <span className="text-xs text-[#A9A9A9]">•</span>
                <span className="text-xs text-[#A9A9A9]">{item.source}</span>
                {item.sentiment && (
                  <>
                    <span className="text-xs text-[#A9A9A9]">•</span>
                    <span className={`text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                      {item.sentiment}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-[#F5F5F5] line-clamp-2">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
};
```

---

### 4. Control Panel Base (Sector-Specific Content)

```tsx
// components/core/ControlPanel.tsx
'use client';

import { ReactNode } from 'react';

interface ControlPanelProps {
  children: ReactNode;
}

export const ControlPanel = ({ children }: ControlPanelProps) => {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
};

// Example: Control Group Component
interface ControlGroupProps {
  title: string;
  children: ReactNode;
}

export const ControlGroup = ({ title, children }: ControlGroupProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-[#A9A9A9] mb-3">{title}</h3>
      {children}
    </div>
  );
};
```

---

## 🏢 Usage Example: Real Estate Stocks Sector

```tsx
// app/(dashboard)/stocks/real-estate/page.tsx
'use client';

import { SimulationLayout } from '@/components/core/SimulationLayout';
import { RealEstateStockChart } from '@/components/stocks/RealEstateStockChart';
import { StockControls } from '@/components/stocks/StockControls';

export default function RealEstateStocksPage() {
  return (
    <SimulationLayout
      sector="stocks"
      breadcrumbs={['Home', 'Stocks', 'Real Estate']}

      // 중앙 메인 컨텐츠 (섹터별로 다름)
      mainContent={
        <RealEstateStockChart />
      }

      // 오른쪽 컨트롤 패널 (섹터별로 다름)
      controls={
        <StockControls />
      }
    />
  );
}
```

---

## 🎨 Design Tokens (Shared Across All Sectors)

```typescript
// lib/design-tokens.ts

export const COLORS = {
  // Backgrounds
  background: {
    primary: '#101015',
    secondary: '#1B1B22',
    tertiary: '#27272E',
  },

  // Accents
  accent: {
    cyan: '#00E5FF',
    magenta: '#E6007A',
    green: '#39FF14',
    red: '#FF1744',
    yellow: '#FFC107',
  },

  // Text
  text: {
    primary: '#F5F5F5',
    secondary: '#A9A9A9',
    tertiary: '#6B6B6B',
  },

  // Borders
  border: '#33333F',
} as const;

export const SPACING = {
  header: {
    height: '64px',
    padding: '0 32px',
  },
  main: {
    padding: '24px',
    gap: '24px',
  },
  sidebar: {
    width: '400px',
  },
  newsFeed: {
    height: '200px',
  },
} as const;

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    mono: ['Roboto Mono', 'monospace'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
} as const;
```

---

## 📱 Responsive Behavior

```tsx
// Mobile: Stack vertically
// Tablet: Sidebar below main
// Desktop: Side-by-side

<div className="
  flex flex-col lg:flex-row
  gap-4 lg:gap-6
">
  <div className="
    w-full lg:flex-1
    h-[400px] lg:h-auto
  ">
    {mainContent}
  </div>

  <aside className="
    w-full lg:w-[400px]
  ">
    {controls}
  </aside>
</div>
```

---

## 🔌 API Integration Points

### News Feed API
```typescript
// app/api/news/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Fetch from Data Pipeline
  const news = await fetchNewsFromPipeline(sector, limit);

  return Response.json(news);
}
```

### Trading Agent Reports API
```typescript
// app/api/analyst-reports/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  // Call Trading Agents service
  const report = await fetchAnalystReport(ticker);

  return Response.json(report);
}
```

---

## 📊 Sector-Specific Configurations

```typescript
// lib/sector-config.ts

export const SECTOR_CONFIG = {
  'real-estate': {
    name: 'Real Estate',
    icon: '🏢',
    color: '#E6007A',
    newsKeywords: ['부동산', 'REIT', '리츠', '건설'],
    tickers: ['293940', '377190', '338100'], // REIT 종목코드
  },

  'stocks': {
    name: 'Stocks',
    icon: '📈',
    color: '#00E5FF',
    newsKeywords: ['주식', '증시', 'KOSPI'],
    tickers: [], // Dynamic
  },

  'crypto': {
    name: 'Cryptocurrency',
    icon: '💎',
    color: '#39FF14',
    newsKeywords: ['비트코인', '이더리움', 'BTC', 'ETH'],
    tickers: ['BTC-USD', 'ETH-USD'],
  },
} as const;
```

---

## ✅ Implementation Checklist

### Phase 1: Core Layout (Week 1)
- [ ] `SimulationLayout` component
- [ ] `Header` component
- [ ] `NewsFeed` component
- [ ] `ControlPanel` base
- [ ] Design tokens file
- [ ] Responsive breakpoints

### Phase 2: Sector Integration (Week 2)
- [ ] Real Estate Stocks page
- [ ] Stock chart component
- [ ] Stock controls
- [ ] News API integration

### Phase 3: Trading Agents (Week 3)
- [ ] Analyst report fetcher
- [ ] Report display component
- [ ] Integration with news feed

---

**Last Updated:** 2025-10-31

**Next:** [Real Estate Stocks Implementation](./REAL_ESTATE_STOCKS_GUIDE.md)
