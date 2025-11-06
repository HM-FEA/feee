# 🌐 Nexus-Alpha Web Application

**Technology:** Next.js 14 (App Router) + TypeScript
**Team:** Team UI (Frontend)
**Port:** 3000 (dev), 443 (prod)

---

## 📖 Overview

The Nexus-Alpha web application is the primary user interface for our financial intelligence platform. Built with Next.js 14 and the Quantum Ledger design system, it provides:

- 🌍 **Macro Simulations**: 3D global liquidity visualization, interest rate impact simulator
- 📈 **Micro Signals**: Influencer tracking, meme stock dashboard, social sentiment analysis
- 💎 **Crypto Analytics**: On-chain whale watching, DeFi protocol explorer
- 🎨 **Perplexity-Style UI**: Obsidian-link network graphs, matte black aesthetic

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- pnpm 9.x
- PostgreSQL (local or Docker)
- Redis (local or Docker)

### Installation
```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API keys:
# NEXT_PUBLIC_PLATFORM_API_URL=http://localhost:8080
# NEXT_PUBLIC_QUANT_ENGINE_URL=http://localhost:8000
# NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

### Development
```bash
# Run dev server (http://localhost:3000)
pnpm dev

# Run with turbo (faster)
pnpm turbo dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format
```

### Building
```bash
# Production build
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm analyze
```

---

## 📁 Project Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard shell
│   │   ├── page.tsx              # Dashboard home
│   │   ├── macro/
│   │   │   ├── liquidity/page.tsx    # 3D Globe
│   │   │   └── interest-rate/page.tsx
│   │   ├── micro/
│   │   │   ├── influencers/page.tsx
│   │   │   └── meme-stocks/page.tsx
│   │   └── crypto/
│   │       ├── on-chain/page.tsx
│   │       └── defi/page.tsx
│   ├── api/                      # API routes (BFF pattern)
│   │   └── auth/[...nextauth]/route.ts
│   └── layout.tsx                # Root layout
├── components/
│   ├── ui/                       # Shadcn components
│   ├── charts/                   # ECharts/D3 wrappers
│   ├── simulations/              # Simulation widgets
│   └── layout/                   # Nav, Sidebar, Footer
├── lib/
│   ├── api/                      # API clients
│   ├── hooks/                    # Custom hooks
│   ├── stores/                   # Zustand stores
│   └── utils/                    # Utilities
├── public/
│   ├── images/
│   └── fonts/
├── styles/
│   └── globals.css               # Global styles + Quantum Ledger colors
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System (Quantum Ledger)

### Color Palette
```css
/* Matte Black Backgrounds */
--background-primary: #101015
--background-secondary: #1B1B22

/* Accent Colors */
--accent-cyan: #00E5FF       /* Primary actions, links */
--accent-magenta: #E6007A    /* Highlights, warnings */
--accent-green: #39FF14      /* Success, positive metrics */
--accent-red: #FF1744        /* Errors, negative metrics */

/* Text */
--text-primary: #F5F5F5
--text-secondary: #A9A9A9

/* Borders */
--border: #33333F
```

### Typography
```typescript
font-family:
  sans: ['Inter', 'sans-serif']
  mono: ['Roboto Mono', 'monospace']

font-size:
  h1: 48px / 1.2 / 700
  h2: 32px / 1.3 / 600
  h3: 24px / 1.4 / 500
  body: 16px / 1.5 / 400
  caption: 14px / 1.5 / 400
```

### Component Example
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="md">
  Run Simulation
</Button>
```

---

## 🔌 API Integration

### Platform Service Client
```typescript
// lib/api/platform.ts
import axios from 'axios';

const platformAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  timeout: 10000,
});

// Auto-inject JWT token
platformAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email, password) => platformAPI.post('/api/v1/auth/login', { email, password }),
  logout: () => platformAPI.post('/api/v1/auth/logout'),
  getProfile: () => platformAPI.get('/api/v1/users/me'),
};

export const simulations = {
  create: (params) => platformAPI.post('/api/v1/simulations', params),
  get: (id) => platformAPI.get(`/api/v1/simulations/${id}`),
  list: () => platformAPI.get('/api/v1/simulations'),
};
```

### WebSocket Hook
```typescript
// lib/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (channel: string) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!);

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe', channel);
    });

    socket.on(channel, (message) => {
      setData(message);
    });

    return () => { socket.close(); };
  }, [channel]);

  return { data, isConnected };
};

// Usage
const { data, isConnected } = useWebSocket('market-updates');
```

---

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)
```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

Example:
```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)
```bash
# Run E2E tests
pnpm test:e2e

# Run in UI mode
pnpm test:e2e:ui
```

Example:
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});
```

---

## 📊 Performance

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Score Goals
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### Optimization Techniques
```typescript
// 1. Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const MacroGlobe = dynamic(() => import('@/components/simulations/MacroGlobe'), {
  ssr: false,
  loading: () => <div>Loading 3D visualization...</div>,
});

// 2. Image optimization
import Image from 'next/image';

<Image src="/hero.png" alt="Nexus Alpha" width={1200} height={600} priority />

// 3. Data fetching with React Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['simulations', id],
  queryFn: () => simulations.get(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🚀 Deployment

### Development
```bash
# Local dev server
pnpm dev
```

### Staging
```bash
# Build for staging
NEXT_PUBLIC_ENV=staging pnpm build

# Deploy to Vercel staging
vercel --env staging
```

### Production
```bash
# Build for production
NEXT_PUBLIC_ENV=production pnpm build

# Deploy to Vercel
vercel --prod

# Or deploy to Kubernetes (see /infra/kubernetes/applications/web/)
docker build -t nexus-alpha/web:latest .
kubectl apply -f /infra/kubernetes/applications/web/
```

---

## 🔧 Configuration

### Environment Variables
```bash
# .env.local (DO NOT COMMIT)

# API URLs
NEXT_PUBLIC_PLATFORM_API_URL=http://localhost:8080
NEXT_PUBLIC_QUANT_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_SIMVIZ_URL=http://localhost:8001
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Next.js Config
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.nexus-alpha.com'],
  },
  webpack: (config) => {
    // Custom webpack config
    return config;
  },
};
```

---

## 📚 Documentation

- **Component Library**: [Storybook](http://localhost:6006)
- **API Reference**: See `/docs/api/API_REFERENCE.md`
- **Team Handbook**: See `/docs/teams/TEAM_UI_HANDBOOK.md`
- **Design System**: See `/docs/design/QUANTUM_LEDGER.md`

---

## 🤝 Contributing

### Branch Naming
- `feature/add-crypto-dashboard`
- `fix/button-hover-state`
- `refactor/api-client`

### Commit Convention (Conventional Commits)
```bash
feat(crypto): add crypto dashboard page
fix(ui): resolve button hover state issue
refactor(api): simplify API client logic
docs(readme): update installation steps
```

### Pull Request Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Accessibility maintained (WCAG 2.1 AA)
- [ ] Performance not degraded (Lighthouse check)
- [ ] Documentation updated

---

## 📞 Support

**Team:** Team UI (Frontend)
**Lead:** @frontend-architect
**Slack:** #team-ui
**Standup:** Daily 10:00 AM (Async in Slack)

---

**Last Updated:** 2025-10-31

---

## 🎨 Design System Update (2025-11-05)

### Design Philosophy
Nexus-Alpha는 **Bloomberg, Finviz, Palantir** 스타일의 전문가용 금융 분석 플랫폼입니다. 
어둡고 우주적인 테마로 데이터 중심의 고급스러운 UI를 제공합니다.

### Unified Design Tokens

모든 페이지가 다음의 일관된 디자인 시스템을 따릅니다:

```tsx
// Background
bg-black                    // Main background (pure black)
bg-[#0D0D0F]               // Card background (slightly lighter)
bg-background-secondary     // Alternative panels
bg-background-tertiary      // Nested elements

// Borders
border-[#1A1A1F]           // Subtle borders
border-border-primary       // Primary borders
hover:border-[#2A2A3F]     // Hover state borders

// Accents
text-accent-cyan           // Primary actions (#00E5FF)
text-accent-magenta        // Secondary highlights (#E6007A)
text-accent-emerald        // Success states (#00FF9F)
bg-accent-cyan             // Primary buttons
bg-accent-magenta          // Secondary buttons

// Typography
text-text-primary          // Main text (#F5F5F5)
text-text-secondary        // Secondary text (#A9A9A9)
text-text-tertiary         // Tertiary/disabled text

// Components
rounded-2xl                // Card border radius
p-4 sm:p-6                // Card padding
transition-all             // Smooth transitions
backdrop-blur              // Glass morphism effect
```

### Icon System

**모든 emoji 아이콘이 Lucide React로 교체되었습니다:**

| Category | Icons Used |
|----------|-----------|
| **Navigation** | `Home`, `BarChart`, `Globe`, `Network`, `Users`, `Settings` |
| **Actions** | `Plus`, `Search`, `Filter`, `Download`, `Share2` |
| **Status** | `CheckCircle`, `Clock`, `Circle`, `AlertTriangle`, `TrendingUp` |
| **Data** | `BarChart3`, `Rocket`, `Target`, `DollarSign` |
| **Features** | `Trophy`, `Zap`, `Code`, `Brain`, `Shield`, `Sparkles` |

### Page Styles Reference

#### ✅ Approved Style (Learn, Arena, Simulate, CEO Dashboard, Trading AI)
```tsx
<div className="relative min-h-screen bg-black text-text-primary">
  <div className="border-b border-border-primary px-6 py-4 bg-black/50 backdrop-blur">
    <h1 className="text-2xl font-bold text-accent-cyan flex items-center gap-2">
      <Icon size={24} />
      Page Title
    </h1>
    <p className="text-sm text-text-secondary">Description</p>
  </div>
  
  <div className="px-6 py-6 h-[calc(100vh-200px)] overflow-y-auto">
    <Card className="hover:border-[#2A2A3F] transition-all">
      {/* Content */}
    </Card>
  </div>
</div>
```

#### Card Component Pattern
```tsx
const Card = ({ children, className = '' }: CardProps) => (
  <div className={`bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);
```

### Recent Design Updates

#### 1. Landing Page Improvements
- ✅ **Starfield Animation**: 100개의 별이 원통 안에서 미세하게 움직임 (2px float)
- ✅ **Fade-in Effects**: Hero section 부드러운 등장 애니메이션
- ✅ **Apple-style Navigation**: 반투명 backdrop blur 네비게이션
- ✅ **Parallax 제거**: 스크롤 시 과도한 움직임 제거, 정적인 프로페셔널한 느낌

#### 2. Navigation Redesign
- ✅ Background: `bg-gray-900` → `bg-black`
- ✅ Active state: Cyan 좌측 보더 + 배경 하이라이트
- ✅ Hover effects: `hover:bg-[#0D0D0F]`
- ✅ Typography: 작고 데이터 집약적인 텍스트

#### 3. Korean Pages Localization
**Analyst Report (`/company/[id]/analyst-report`)**
- ✅ 모든 emoji → Lucide 아이콘
- ✅ Background: `bg-background-primary` → `bg-black`
- ✅ Sticky header: `bg-black/90 backdrop-blur`

**Circuit Diagram (`/company/[id]/circuit-diagram`)**
- ✅ Background: `bg-background-primary` → `bg-black`
- ✅ Lucide icons 적용 완료

#### 4. Feature Pages
- ✅ **Globe**: 3D 글로브 시각화 (Coming Soon)
- ✅ **Network Graph**: D3.js 기반 금융 네트워크 그래프
- ✅ **CEO Dashboard**: 비즈니스 메트릭 대시보드
- ✅ **Community**: 커뮤니티 피드 및 토론
- ✅ **Ontology**: 4-Level 경제 온톨로지 시각화
- ✅ **Arena**: 트레이딩 봇 경쟁 플랫폼
- ✅ **Simulate**: 백테스팅 시뮬레이션
- ✅ **Learn**: 교육 콘텐츠 및 튜토리얼
- ✅ **Trading AI**: AI 기반 트레이딩 에이전트

### Color Palette Updates

```css
/* Background Hierarchy */
--bg-primary: #000000           /* Pure black base */
--bg-secondary: #0D0D0F         /* Cards */
--bg-tertiary: #1A1A1F          /* Nested elements */

/* Borders */
--border-subtle: #1A1A1F        /* Subtle separators */
--border-primary: #2A2A3F       /* Primary borders */
--border-hover: #3A3A4F         /* Hover state */

/* Accent Colors (Unchanged) */
--accent-cyan: #00E5FF          /* Primary */
--accent-magenta: #E6007A       /* Secondary */
--accent-emerald: #00FF9F       /* Success */
--accent-amber: #F59E0B         /* Warning */

/* Status Colors */
--status-safe: #00FF9F          /* ICR > 2.5 */
--status-caution: #F59E0B       /* ICR 2.0-2.5 */
--status-danger: #EF4444        /* ICR < 2.0 */
```

### Typography Scale

```typescript
// Heading Sizes (reduced for data density)
h1: 'text-2xl font-bold'        // 24px (was 48px)
h2: 'text-xl font-bold'         // 20px (was 32px)
h3: 'text-lg font-semibold'     // 18px (was 24px)
body: 'text-sm'                 // 14px (was 16px)
caption: 'text-xs'              // 12px (was 14px)

// Font Weights
regular: 400
medium: 500
semibold: 600
bold: 700

// Line Heights
tight: 1.2    // Headers
normal: 1.5   // Body text
relaxed: 1.75 // Long-form content
```

### Component Library

#### Button Variants
```tsx
// Primary (Cyan)
className="px-4 py-2 bg-accent-cyan text-black font-semibold rounded-lg hover:bg-accent-cyan/80 transition-all"

// Secondary (Magenta)
className="px-4 py-2 bg-accent-magenta text-white font-semibold rounded-lg hover:bg-accent-magenta/80 transition-all"

// Ghost
className="px-4 py-2 border border-border-primary text-text-primary rounded-lg hover:bg-[#0D0D0F] transition-all"
```

#### Input Fields
```tsx
className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent-cyan text-sm"
```

#### Cards
```tsx
// Standard Card
className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6"

// Hover Card
className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 hover:border-[#2A2A3F] transition-all"

// Interactive Card (with glow)
className="bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl p-4 sm:p-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all"
```

### Animation Guidelines

```tsx
// Standard transition
transition-all duration-300

// Fade in
className={`transition-all duration-1500 ${
  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
}`}

// Hover scale
hover:scale-105 transition-transform

// Subtle float (stars)
@keyframes subtleFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(2px, 2px); }
}
```

### Accessibility

- ✅ **WCAG 2.1 AA Compliant**: 모든 텍스트가 4.5:1 이상의 대비율
- ✅ **Keyboard Navigation**: 모든 인터랙티브 요소 접근 가능
- ✅ **Screen Reader**: ARIA labels 및 semantic HTML
- ✅ **Focus States**: 명확한 포커스 인디케이터

### Performance Metrics

```typescript
// Current Bundle Sizes
Landing Page:        7.54 kB  (First Load: 102 kB)
Dashboard:          105 kB    (First Load: 195 kB)
CEO Dashboard:       41 kB    (First Load: 135 kB)
Network Graph:      21.1 kB   (First Load: 118 kB)
Arena:              5.03 kB   (First Load: 92.4 kB)

// Total Routes: 22
// Build Time: ~30s
// Zero TypeScript errors
// Zero linting errors
```

### Development Workflow

```bash
# Start dev server
npm run dev                    # Runs on http://localhost:3000

# Check for style issues
npm run lint                   # ESLint + Prettier

# Type checking
npm run type-check             # TypeScript validation

# Production build
npm run build                  # Optimized build (~30s)

# View in browser
open http://localhost:3000     # Opens landing page
```

### Design Checklist for New Pages

When creating new pages, ensure:

- [ ] Background: `bg-black`
- [ ] Cards: `bg-[#0D0D0F] border border-[#1A1A1F] rounded-2xl`
- [ ] Headers: `bg-black/50 backdrop-blur` with cyan title
- [ ] Icons: Lucide React (no emojis)
- [ ] Typography: Small, data-dense text (`text-sm`, `text-xs`)
- [ ] Hover states: `hover:border-[#2A2A3F]`
- [ ] Transitions: `transition-all duration-300`
- [ ] Responsive: Grid layouts with proper breakpoints
- [ ] Accessibility: Semantic HTML + ARIA labels

### Future Enhancements

**Q1 2025 Roadmap:**
- [ ] 3D Globe 실제 구현 (Three.js)
- [ ] Real-time WebSocket 데이터 연동
- [ ] 다크/라이트 모드 토글
- [ ] 사용자 커스터마이징 가능한 대시보드
- [ ] 모바일 최적화 (현재 데스크톱 중심)
- [ ] Storybook 컴포넌트 라이브러리
- [ ] 성능 최적화 (code splitting, lazy loading)

---

**Design System Last Updated:** 2025-11-05  
**Style Guide Maintained by:** Frontend Team  
**Questions?** Contact #team-ui on Slack
