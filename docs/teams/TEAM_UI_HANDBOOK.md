# 🎨 Team UI: Frontend Engineering Handbook

**Team:** UI (Frontend)
**Squad Size:** 4 engineers
**Workspace:** `/apps/web`, `/apps/mobile`

---

## 🎯 Team Mission

"우리는 복잡한 금융 데이터를 누구나 이해할 수 있는 아름답고 직관적인 경험으로 만듭니다."

---

## 📜 행동 강령 (Code of Conduct) & UI 원칙 (UI Principles)

모든 UI 팀원은 다음 원칙을 준수하여 일관되고 응집력 있는 사용자 경험을 제공해야 합니다.

### 1. **일관된 글로벌 네비게이션 (Consistent Global Navigation)**
- **원칙:** 모든 주요 기능 페이지는 `app/(dashboard)/layout.tsx`에 정의된 **글로벌 사이드바 (`Sidebar.tsx`)**를 통해 접근할 수 있어야 합니다. 독립적으로 존재하는 "섬" 페이지는 허용하지 않습니다.
- **실행:** 신규 페이지 추가 시, 반드시 `Sidebar`에 메뉴 항목을 추가하고 올바른 라우팅 그룹에 포함시킵니다.

### 2. **단일 진입점 원칙 (Single Source of Truth for Pages)**
- **원칙:** 유사하거나 중복되는 목적의 페이지는 하나로 통합하여 사용자 혼란을 방지합니다. 페이지의 URL은 그 목적을 명확하게 나타내야 합니다.
- **실행:**
    - `/dashboard` 와 `/platform`은 `/dashboard`로 단일화합니다.
    - 관리자용 페이지는 `/my-plan`이 아닌 `/ceo-dashboard` 또는 `/admin`으로 명명합니다.

### 3. **시각적 일관성 (Visual Consistency)**
- **원칙:** 모든 컴포넌트와 시각화(차트, 그래프, 3D 모델)는 핸드북의 `Design System`에 정의된 색상 팔레트와 타이포그래피를 엄격히 준수합니다.
- **실행:** `/globe`와 `/network-graph`처럼 유사한 목적의 시각화는 사용자에게 통일된 인터랙션과 스타일을 제공해야 합니다.

### 4. **데이터 기반 UI (Data-Driven UI)**
- **원칙:** 모든 UI는 정적 데이터(목업)가 아닌, API를 통해 실제 데이터를 표시하는 것을 최종 목표로 합니다.
- **실행:** 백엔드 API가 준비되지 않은 경우, 명확한 **로딩(Loading) 상태**와 **빈(Empty) 상태** UI를 우선적으로 구현하여 사용자에게 현재 상태를 명확히 알려줍니다.

---

## 👥 Team Members & Roles

### Lead: Frontend Architect
**Name:** [TBD]
**GitHub:** @frontend-architect
**Focus:** Architecture, Performance, Design System

**Daily Routine:**
- 09:00-10:00: Code review (PRs from team)
- 10:00-12:00: Deep work (Architecture design)해
- 14:00-15:00: 1-on-1 meetings with team
- 15:00-17:00: Cross-team collaboration (Platform, SimViz)

### Senior Frontend Engineer #1 (UI/UX)
**Name:** [TBD]
**GitHub:** @senior-fe-1
**Focus:** Page Development, Responsive Design

**Current Sprint:**
- [ ] Landing page redesign
- [ ] Dashboard layout optimization
- [ ] Mobile navigation refactor

### Senior Frontend Engineer #2 (Integration)
**Name:** [TBD]
**GitHub:** @senior-fe-2
**Focus:** API Integration, State Management

**Current Sprint:**
- [ ] WebSocket real-time data integration
- [ ] Error boundary implementation
- [ ] API client refactoring

### Junior Frontend Engineer
**Name:** [TBD]
**GitHub:** @junior-fe
**Focus:** Component Development, Testing

**Current Sprint:**
- [ ] Button component variants
- [ ] Form validation
- [ ] Unit tests for Card component

---

## 🛠️ Technology Stack

### Core Technologies
```json
{
  "framework": "Next.js 14.2.x",
  "language": "TypeScript 5.3+",
  "runtime": "Node.js 20 LTS",
  "packageManager": "pnpm 9.x"
}
```

### Libraries & Tools
```typescript
// UI & Styling
import { cn } from '@/lib/utils'; // shadcn/ui
import { cva } from 'class-variance-authority';

// State Management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Data Fetching
import { useQuery, useMutation } from '@tanstack/react-query';

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Charts & Visualization
import * as echarts from 'echarts';
import { ResponsiveLine } from '@nivo/line';

// Animation
import { motion } from 'framer-motion';

// Real-time
import { io } from 'socket.io-client';
```

---

## 📁 Project Structure

```
apps/web/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Main app pages
│   │   ├── macro/           # Macro simulation
│   │   ├── micro/           # Micro signals
│   │   ├── crypto/          # Crypto analytics
│   │   └── layout.tsx
│   ├── api/                 # API routes (BFF pattern)
│   └── layout.tsx
├── components/
│   ├── ui/                  # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── charts/              # Chart components
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   └── ...
│   ├── simulations/         # Simulation widgets
│   │   ├── InterestRateSlider.tsx
│   │   ├── MacroGlobe.tsx   # Imports from SimViz
│   │   └── ...
│   └── layout/
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api/                 # API client
│   │   ├── platform.ts      # Platform Service API
│   │   ├── quant.ts         # Quant Engine API
│   │   └── simviz.ts        # SimViz Service API
│   ├── hooks/               # Custom hooks
│   │   ├── useWebSocket.ts
│   │   ├── useSimulation.ts
│   │   └── ...
│   ├── stores/              # Zustand stores
│   │   ├── authStore.ts
│   │   ├── marketStore.ts
│   │   └── ...
│   └── utils/
│       ├── cn.ts            # Tailwind merge
│       ├── formatters.ts    # Number/date formatting
│       └── ...
├── public/
│   ├── images/
│   └── fonts/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

### Color Palette (Quantum Ledger)
```css
/* globals.css */
@layer base {
  :root {
    --background-primary: 16 16 21;      /* #101015 */
    --background-secondary: 27 27 34;    /* #1B1B22 */

    --accent-cyan: 0 229 255;            /* #00E5FF */
    --accent-magenta: 230 0 122;         /* #E6007A */
    --accent-green: 57 255 20;           /* #39FF14 */
    --accent-red: 255 23 68;             /* #FF1744 */

    --text-primary: 245 245 245;         /* #F5F5F5 */
    --text-secondary: 169 169 169;       /* #A9A9A9 */

    --border: 51 51 63;                  /* #33333F */
  }
}
```

### Typography
```typescript
// tailwind.config.ts
export default {
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Roboto Mono', 'monospace'],
    },
    fontSize: {
      'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
      'h2': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
      'h3': ['24px', { lineHeight: '1.4', fontWeight: '500' }],
      'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      'caption': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
    },
  },
};
```

### Component Example: Button
```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-accent-cyan text-background-primary hover:shadow-[0_0_20px_rgba(0,229,255,0.5)]',
        secondary: 'border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10',
        ghost: 'hover:bg-background-secondary',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
};
```

---

## 🔌 API Integration

### Platform Service API Client
```typescript
// lib/api/platform.ts
import axios from 'axios';

const platformAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  timeout: 10000,
});

// Request interceptor (add JWT token)
platformAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
platformAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email: string, password: string) =>
    platformAPI.post('/api/v1/auth/login', { email, password }),

  logout: () =>
    platformAPI.post('/api/v1/auth/logout'),

  getProfile: () =>
    platformAPI.get('/api/v1/users/me'),
};

export const simulations = {
  create: (params: SimulationParams) =>
    platformAPI.post('/api/v1/simulations', params),

  get: (id: string) =>
    platformAPI.get(`/api/v1/simulations/${id}`),

  list: (filters?: SimulationFilters) =>
    platformAPI.get('/api/v1/simulations', { params: filters }),
};
```

### WebSocket Hook
```typescript
// lib/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (channel: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      newSocket.emit('subscribe', channel);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on(channel, (message) => {
      setData(message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [channel]);

  return { socket, data, isConnected };
};

// Usage
const MarketFeed = () => {
  const { data, isConnected } = useWebSocket('market-updates');

  return (
    <div>
      <span>{isConnected ? '🟢 Live' : '🔴 Disconnected'}</span>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-accent-cyan');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests (Playwright)
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.locator('text=Welcome back')).toBeVisible();
});
```

### Testing Coverage Goals
- Unit Tests: > 80% coverage
- Integration Tests: Critical paths (login, simulation)
- E2E Tests: User flows (onboarding, simulation, payment)

---

## 🚀 Development Workflow

### 1. Local Development Setup
```bash
# Clone repo
git clone https://github.com/nexus-alpha/nexus-alpha.git
cd nexus-alpha/apps/web

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run dev server
pnpm dev
# Open http://localhost:3000
```

### 2. Creating a New Feature
```bash
# Create feature branch
git checkout -b feature/add-crypto-dashboard

# Make changes...

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm format

# Commit (Conventional Commits)
git commit -m "feat(crypto): add crypto dashboard page"

# Push and create PR
git push origin feature/add-crypto-dashboard
```

### 3. Code Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Accessibility (a11y) is maintained
- [ ] Performance is not degraded (Lighthouse check)
- [ ] Tests are added/updated
- [ ] Documentation is updated

---

## 📊 Performance Guidelines

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Techniques

#### 1. Code Splitting
```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic';

const MacroGlobe = dynamic(() => import('@/components/simulations/MacroGlobe'), {
  ssr: false, // Disable SSR for Three.js
  loading: () => <div>Loading 3D visualization...</div>,
});
```

#### 2. Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/images/hero.png"
  alt="Nexus Alpha"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>
```

#### 3. Data Fetching
```typescript
// Use React Query for caching
const { data, isLoading } = useQuery({
  queryKey: ['simulations', id],
  queryFn: () => simulations.get(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 🎓 Learning Resources

### For Junior Engineers
- **Next.js Docs:** https://nextjs.org/docs
- **React Patterns:** https://kentcdodds.com/blog
- **TypeScript Deep Dive:** https://basarat.gitbook.io/typescript/

### For Senior Engineers
- **Web Performance:** https://web.dev/learn-core-web-vitals/
- **Accessibility:** https://www.a11yproject.com/
- **Advanced React:** https://react.gg/

### Team Workshops (Monthly)
- Design System Deep Dive
- Performance Optimization Techniques
- Advanced TypeScript Patterns

---

## 📞 Contact & Support

**Team Lead:** @frontend-architect
**Slack Channel:** #team-ui
**Daily Standup:** 10:00 AM (Async in Slack)
**Office Hours:** Tuesday/Thursday 3-4 PM

---

**Document Owner:** Frontend Architect
**Last Updated:** 2025-10-31
**Review Cycle:** Monthly
