# 🌌 NEXUS-ALPHA: 완전한 비전 & 마스터 플랜

**작성일:** 2025-11-06
**버전:** 2.0 - 전문가 수준 확장
**목표:** 세계 최고 수준의 글로벌 금융 디지털 트윈 플랫폼

---

## 📋 목차

1. [핵심 비전](#1-핵심-비전)
2. [경쟁사 분석 & 차별화](#2-경쟁사-분석--차별화)
3. [상세 기능 설계](#3-상세-기능-설계)
4. [Macro 변수 완전 목록 (50+)](#4-macro-변수-완전-목록-50)
5. [데이터 소스 & 비용](#5-데이터-소스--비용)
6. [UI/UX 디자인 철학](#6-uiux-디자인-철학)
7. [기술 스택 & 아키텍처](#7-기술-스택--아키텍처)
8. [블록체인 인센티브 생태계](#8-블록체인-인센티브-생태계)
9. [단계별 로드맵](#9-단계별-로드맵)
10. [예상 비용 & 수익 모델](#10-예상-비용--수익-모델)

---

## 1. 핵심 비전

### 🎯 한 문장 정의
> "전 세계 금융 시스템을 3D 지식 그래프로 시각화하고, 모든 변수를 실시간 시뮬레이션하며, 커뮤니티가 검증한 인사이트를 블록체인에 영구 기록하는 **글로벌 금융 디지털 트윈**"

### 🧠 핵심 가치 제안

1. **완전한 투명성**
   - 전 세계 중앙은행 정책 → 개별 기업 재무까지 한눈에
   - 헤지펀드 포트폴리오 실시간 추적 (13F 공시)
   - 인플루언서/기관투자자 포지션 공개

2. **실시간 시뮬레이션**
   - "Fed 금리 4% → 5% 인상하면?"
   - 전 세계 2,500개 기업 재무제표 즉시 업데이트
   - Cascade 효과 애니메이션 (Macro → Sector → Company → Asset)

3. **커뮤니티 검증 지식**
   - 사용자: "환율 상승 → 반도체 수출 증가" 가설 제시
   - AI 검증 + 커뮤니티 투표
   - 검증 완료 → 블록체인 영구 기록 → 토큰 보상

4. **AI 애널리스트**
   - 개별 기업 심층 분석 (TradingAgents)
   - 공시 자동 파싱 → 재무 영향 예측
   - "계약 체결 공시 → 예상 매출 +15% 상승"

5. **Trading Bot Arena**
   - 사용자 커스텀 AI 모델 경쟁
   - n of 1 스타일 투자 대회
   - 우승 전략 NFT화

---

## 2. 경쟁사 분석 & 차별화

### 🏆 경쟁사 비교

| 기능 | Bloomberg Terminal | Palantir Foundry | Perplexity Finance | TradingView | **Nexus-Alpha** |
|------|-------------------|------------------|-------------------|-------------|-----------------|
| **실시간 데이터** | ✅ ($24K/year) | ✅ (Enterprise) | ✅ (Free) | ✅ (Free) | ✅ (Free) |
| **3D 지식 그래프** | ❌ | ⚠️ (2D) | ❌ | ❌ | ✅ (3D Obsidian) |
| **Macro → Asset Cascade** | ❌ | ❌ | ❌ | ❌ | ✅ (실시간) |
| **13F 헤지펀드 추적** | ✅ | ❌ | ⚠️ (일부) | ❌ | ✅ (무료) |
| **공시 → 재무 시뮬레이션** | ❌ | ❌ | ❌ | ❌ | ✅ (AI 자동) |
| **커뮤니티 검증** | ❌ | ❌ | ❌ | ⚠️ (Ideas) | ✅ (블록체인) |
| **Trading Bot 대회** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **블록체인 인센티브** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **가격** | $24,000/year | Enterprise | $20/month | $15/month | **$0 (Freemium)** |

### ⚡ 차별화 포인트

1. **Bloomberg 대비**
   - 가격: $0 vs $24K
   - 시뮬레이션: Nexus는 실시간, Bloomberg는 정적 데이터

2. **Palantir 대비**
   - 접근성: 누구나 vs 기업 전용
   - 3D 시각화: Nexus는 Obsidian 스타일

3. **Perplexity 대비**
   - Nexus는 뉴스 + 시뮬레이션 + 지식 그래프 통합
   - Perplexity는 뉴스/검색 중심

4. **TradingView 대비**
   - Nexus는 Fundamental + Technical 통합
   - TradingView는 차트 중심

---

## 3. 상세 기능 설계

### 📊 3.1. Dashboard (통합 컨트롤 센터)

#### 레이아웃
```
┌─────────────────────────────────────────────────────────────┐
│  [Nexus-Alpha Logo]              [User] [Settings] [Logout] │ ← Header
├───────────┬─────────────────────────────────────────────────┤
│           │  🌍 Global Macro Control Panel                  │
│           ├─────────────────────────────────────────────────┤
│  📁 Macro │  Interest Rate:  [▓▓▓▓▓░░░░░] 2.5% → 3.0%      │
│  📊 Sectors│  GDP Growth:     [▓▓▓▓░░░░░░] 2.1%             │
│  🏢 Companies│ Oil Price:     [▓▓▓▓▓▓░░░░] $85/barrel       │
│  🌐 Network│  VIX:            [▓▓▓░░░░░░░] 18.5             │
│  📈 Simulate│ Container Rate:  [▓▓▓▓▓▓▓░░░] $3,200          │
│  🤖 Arena │  EUR/USD:        [▓▓▓▓▓▓░░░░] 1.08             │
│  💬 Community│                                              │
│  📚 Learn │  ┌─────────────────────────────────────────┐   │
│  📰 News  │  │  Real-time Impact: 23 Companies Affected│   │
│  👤 Profile│  │  ✓ Banking: +8% (NIM 확대)             │   │
│           │  │  ✗ Real Estate: -12% (이자부담 증가)    │   │
│           │  │  ⚠ Manufacturing: -3% (수요 감소)       │   │
│           │  └─────────────────────────────────────────┘   │
│           ├─────────────────────────────────────────────────┤
│           │  🔗 Circuit Diagram (Live Cascade)             │
│           │  ┌───────┐                                      │
│           │  │Level 1│ Fed Rate ↑ 0.5%                     │
│           │  └───┬───┘                                      │
│           │      ├──→ Level 2: Banking NIM +0.3%           │
│           │      ├──→ Level 2: RE Yield -0.5%              │
│           │      └──→ Level 3: 신한은행 NI +13%            │
│           │                    신한알파리츠 NI -23%         │
│           └─────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

#### 핵심 기능
1. **Macro 슬라이더**
   - 50+ 변수 (섹션 4 참조)
   - 드래그하면 실시간 업데이트
   - "Reset" 버튼으로 초기화

2. **실시간 영향 계산**
   - 0.5초 내 모든 회사 재계산
   - 애니메이션으로 변화 표시

3. **Circuit Diagram**
   - Level 1 → 2 → 3 → 4 순차 강조
   - 각 노드 클릭 → 상세 정보 팝업

4. **Hot Keys**
   - `Cmd/Ctrl + K`: Quick Search
   - `Cmd/Ctrl + M`: Macro Panel Toggle
   - `Cmd/Ctrl + N`: Network Graph

---

### 🌐 3.2. Network Graph (3D Obsidian 스타일)

#### 시각화 설계

**3D 공간 배치:**
```
      🌍 Level 1: Macro (최상단)
     ╱ │ ╲
    ╱  │  ╲
   🏦  🏢  💻  Level 2: Sectors (중단)
   │╲  │  ╱│
   │ ╲ │ ╱ │
  🏛️ 🏠 🚗 💡  Level 3: Companies (하단)
   │   │   │
  💰 🏘️ 🔧   Level 4: Assets (최하단)
```

**노드 디자인:**
- **Level 1 (Macro)**: 큰 황금 구체, 글로우 효과
- **Level 2 (Sector)**: 중간 크기, 섹터별 색상
  - Banking: 파란색
  - Real Estate: 초록색
  - Manufacturing: 주황색
  - Semiconductor: 보라색
  - Crypto: 황금색
- **Level 3 (Company)**: 작은 구체, ICR 기반 색상
  - ICR > 2.5: 초록색
  - 2.0 < ICR < 2.5: 노란색
  - ICR < 2.0: 빨간색
- **Level 4 (Asset)**: 매우 작은 점

**연결선 디자인:**
- **대출 관계**: 점선, 흰색
- **공급망**: 실선, 파란색
- **경쟁 관계**: 빨간 파선
- **두께**: 관계 강도에 비례

**인터랙션:**
1. **마우스 호버**: 노드 정보 툴팁
   ```
   ┌─────────────────┐
   │ 신한은행         │
   │ ICR: 3.2x       │
   │ D/E: 0.8x       │
   │ 주가: ₩42,500   │
   │ [상세보기 →]    │
   └─────────────────┘
   ```

2. **클릭**: 상세 패널 슬라이드
   - 재무제표
   - 최근 공시
   - 뉴스 피드
   - AI 분석

3. **더블 클릭**: 해당 노드 중심으로 확대

4. **우클릭**: 컨텍스트 메뉴
   - "Add to Watchlist"
   - "Compare with..."
   - "Run Simulation"
   - "Generate Report"

**카메라 컨트롤:**
- 마우스 드래그: 회전
- 스크롤: 줌
- `Space`: 애니메이션 재생/정지
- `R`: 카메라 리셋

**성능 최적화:**
- LOD (Level of Detail): 멀리 있는 노드는 단순화
- Frustum Culling: 화면 밖 노드는 렌더링 안 함
- Instancing: 같은 모양 노드는 인스턴싱

---

### 📰 3.3. News Feed (Perplexity 스타일)

#### 데이터 소스
1. **기업 공시**
   - SEC EDGAR (미국)
   - DART (한국)
   - 실시간 파싱

2. **뉴스 API**
   - News API
   - Alpha Vantage News
   - Google News RSS

3. **소셜 미디어**
   - Twitter/X API
   - Reddit (r/wallstreetbets, r/stocks)

4. **헤지펀드 공시**
   - 13F Filings (분기별)
   - Whale Wisdom API

#### UI 디자인

```
┌─────────────────────────────────────────────────────────┐
│  📰 Real-time Financial Feed                            │
├─────────────────────────────────────────────────────────┤
│  🔥 Trending Now                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🚨 Breaking: Fed Holds Rate at 5.25%              │  │
│  │    Impact: Banking +2%, Real Estate Stable        │  │
│  │    [Simulate Impact →]                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  📊 13F Filings (Hedge Funds)                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🐋 Berkshire Hathaway Q3 2024                     │  │
│  │    ✓ Increased: Apple +5M shares ($850M)         │  │
│  │    ✗ Reduced: Bank of America -10M shares        │  │
│  │    [View Full Portfolio →]                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  📄 Company Filings                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📝 Tesla 8-K: New Gigafactory in Texas            │  │
│  │    AI Analysis: Revenue +$2.5B/year expected     │  │
│  │    [Run Financial Simulation →]                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  💬 Social Sentiment                                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🐦 @elonmusk: "Tesla production at record high"   │  │
│  │    Sentiment: 🟢 Bullish (85% positive)          │  │
│  │    Impact: TSLA +3.2% AH                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### 핵심 기능

1. **AI 자동 분석**
   - 공시 내용 파싱
   - 재무 영향 예측
   - "계약 체결 공시 → 매출 +15% 예상"

2. **지식 그래프 연결**
   - 뉴스 클릭 → 관련 노드 하이라이트
   - "Tesla 뉴스" → Network Graph에서 Tesla + 공급망 강조

3. **필터링**
   - Sector별
   - 중요도별 (Breaking, High, Medium, Low)
   - 시간별 (Last 1h, 24h, 7d, 30d)

---

### 📊 3.4. 공시 → 재무 시뮬레이션

#### 프로세스

```
1. 공시 수신
   "Tesla signs $5B battery supply contract with Panasonic"

2. AI 파싱 (TradingAgents)
   Contract Value: $5B
   Duration: 5 years
   Annual Revenue: $1B/year

3. 재무제표 업데이트
   Before:
   ┌─────────────────────┐
   │ Revenue: $96.8B     │
   │ Cost: $82.0B        │
   │ Net Income: $12.6B  │
   │ EPS: $4.07          │
   └─────────────────────┘

   After (Simulated):
   ┌─────────────────────┐
   │ Revenue: $97.8B (+1B)│
   │ Cost: $82.6B (+0.6B)│ ← 60% COGS 가정
   │ Net Income: $13.0B  │ ← +3.2%
   │ EPS: $4.20 (+3.2%)  │
   └─────────────────────┘

4. 주가 영향 예측
   P/E Ratio: 25x (historical average)
   New EPS: $4.20
   Target Price: $4.20 × 25 = $105
   Current Price: $98
   Expected Return: +7.1%

5. 사용자에게 표시
   "Tesla 주가 +7.1% 예상 (계약 체결 영향)"
```

#### UI 예시

```
┌─────────────────────────────────────────────────────────┐
│  📝 Filing Impact Simulator                             │
├─────────────────────────────────────────────────────────┤
│  Company: Tesla (TSLA)                                  │
│  Filing: 8-K (Current Report)                           │
│  Date: 2024-11-06                                       │
│                                                         │
│  📄 Summary                                             │
│  "Signed $5B battery supply contract with Panasonic    │
│   over 5 years"                                         │
│                                                         │
│  🤖 AI Analysis                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Expected Revenue: +$1B/year                       │ │
│  │ Cost of Goods Sold: +$600M/year (60% margin)     │ │
│  │ Net Income Impact: +$400M/year (+3.2%)           │ │
│  │ EPS Impact: +$0.13 (+3.2%)                       │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  📈 Price Target                                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Current: $98.00                                   │ │
│  │ Target:  $105.00 (+7.1%)                         │ │
│  │ P/E Method: 25x (historical)                     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [💾 Save Simulation]  [🔗 Add to Graph]  [📊 Compare] │
└─────────────────────────────────────────────────────────┘
```

---

### 👤 3.5. 헤지펀드 & 인플루언서 추적

#### 13F 공시 (헤지펀드 포트폴리오)

**데이터 소스:**
- SEC EDGAR 13F filings
- Whale Wisdom API
- Dataroma (Superinvestor 추적)

**UI 예시:**

```
┌─────────────────────────────────────────────────────────┐
│  🐋 Hedge Fund Portfolio Tracker                        │
├─────────────────────────────────────────────────────────┤
│  📊 Top Funds                                           │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Berkshire Hathaway (Warren Buffett)              │ │
│  │ AUM: $354B | Holdings: 45                        │ │
│  │ ┌─────────────────────────────────────────────┐  │ │
│  │ │ Top 5 Positions                             │  │ │
│  │ │ 1. Apple (AAPL)        $174.3B  (49.2%)    │  │ │
│  │ │ 2. Bank of America     $41.1B   (11.6%)    │  │ │
│  │ │ 3. American Express    $35.1B   (9.9%)     │  │ │
│  │ │ 4. Coca-Cola           $25.5B   (7.2%)     │  │ │
│  │ │ 5. Chevron             $18.6B   (5.3%)     │  │ │
│  │ └─────────────────────────────────────────────┘  │ │
│  │                                                   │ │
│  │ 📈 Recent Changes (Q3 2024)                      │ │
│  │ ✅ Added: Domino's Pizza (+$550M)               │ │
│  │ ✅ Increased: Apple (+5M shares, +$850M)        │ │
│  │ ❌ Reduced: Bank of America (-10M shares)       │ │
│  │ ❌ Sold: Paramount Global (full exit)           │ │
│  │                                                   │ │
│  │ [📊 View Full Portfolio] [🔔 Set Alert]         │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  🦅 ARK Invest (Cathie Wood)                           │
│  AUM: $8.2B | Holdings: 52                             │
│  Top: Tesla (9.8%), Coinbase (8.5%), Roku (7.1%)      │
│  [Expand →]                                             │
└─────────────────────────────────────────────────────────┘
```

#### 인플루언서 포트폴리오

**추적 대상:**
- Warren Buffett (Berkshire)
- Cathie Wood (ARK)
- Michael Burry (Scion)
- Bill Ackman (Pershing Square)
- Ray Dalio (Bridgewater)

**소셜 미디어 연동:**
- Twitter/X: 투자 의견 트윗
- Reddit: r/wallstreetbets 인기 종목
- StockTwits: Sentiment 분석

---

### 📈 3.6. 차트 디자인 & 라이브러리

#### 차트 라이브러리 선택

| 라이브러리 | 장점 | 단점 | 추천 |
|-----------|------|------|------|
| **Recharts** | React 친화적, 간단 | 커스터마이징 제한 | ⚠️ |
| **Chart.js** | 가볍고 빠름 | React 통합 불편 | ❌ |
| **D3.js** | 완전한 제어 가능 | 러닝 커브 높음 | ✅ |
| **ApexCharts** | 아름다운 디자인, React 지원 | 무거움 | ✅✅ |
| **Lightweight Charts** | TradingView 라이브러리, 초고속 | 금융 전용 | ✅✅✅ |

**최종 선택: Lightweight Charts + ApexCharts 병행**
- **Lightweight Charts**: 가격 차트, 캔들스틱 (금융 전문)
- **ApexCharts**: 재무 차트, 비교 차트 (다목적)

#### 차트 디자인 가이드

**1. 가격 차트 (Lightweight Charts)**
```typescript
// Dark Theme
background: '#050505'
grid: '#1A1A1F'
text: '#9CA3AF'

// Candlestick
upColor: '#00FF9F'  // Emerald
downColor: '#FF1744' // Red
borderUpColor: '#00FF9F'
borderDownColor: '#FF1744'
wickUpColor: '#00FF9F'
wickDownColor: '#FF1744'

// Volume
upVolume: 'rgba(0, 255, 159, 0.3)'
downVolume: 'rgba(255, 23, 68, 0.3)'
```

**2. 재무 차트 (ApexCharts)**
```typescript
// Revenue/Profit Line Chart
series: [{
  name: 'Revenue',
  data: [96.8, 97.8, 98.5, ...],
  color: '#00E5FF' // Cyan
}, {
  name: 'Net Income',
  data: [12.6, 13.0, 13.4, ...],
  color: '#00FF9F' // Emerald
}]

theme: {
  mode: 'dark',
  palette: 'palette2'
}

chart: {
  background: '#0D0D0F',
  foreColor: '#9CA3AF',
  toolbar: {
    tools: {
      download: true,
      selection: true,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: true,
      reset: true
    }
  }
}
```

**3. 비교 차트 (Heatmap)**
```
┌─────────────────────────────────────────────────────────┐
│  🔥 Sector Performance Heatmap                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Banking     [████████] +8.2%  (High Impact)           │
│  Tech        [██████░░] +4.1%                           │
│  Consumer    [███░░░░░] +1.5%                           │
│  Energy      [░░░░░░░░] -0.3%                           │
│  Real Estate [░░░░░░░░] -5.8%  (High Risk)              │
│  Materials   [░░░░░░░░] -8.1%                           │
│                                                         │
│  Color Scale:                                           │
│  🟢 >+5%  🟡 0~5%  🟠 -5~0%  🔴 <-5%                   │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Macro 변수 완전 목록 (50+)

### 📊 Category 1: 통화 정책 (Central Bank Policy)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **Fed Funds Rate** | 미국 기준금리 | FRED API | 실시간 |
| **ECB Main Rate** | 유럽 기준금리 | ECB API | 실시간 |
| **BOJ Rate** | 일본 기준금리 | BOJ | 일별 |
| **BOK Rate** | 한국 기준금리 | 한국은행 API | 일별 |
| **10Y Treasury Yield** | 미국 10년물 국채 | FRED | 실시간 |
| **2Y Treasury Yield** | 미국 2년물 국채 | FRED | 실시간 |
| **Yield Curve** | 2Y-10Y 스프레드 | FRED (계산) | 실시간 |
| **Fed Balance Sheet** | Fed 자산 규모 | FRED | 주별 |
| **ECB Balance Sheet** | ECB 자산 규모 | ECB | 주별 |
| **PBOC Balance Sheet** | 중국 인민은행 자산 | PBOC | 월별 |

### 💰 Category 2: 유동성 (Liquidity)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **M2 Money Supply (US)** | 미국 통화량 | FRED | 주별 |
| **M2 Money Supply (China)** | 중국 통화량 | PBOC | 월별 |
| **M2 Money Supply (EU)** | 유럽 통화량 | ECB | 월별 |
| **M2 Money Supply (Korea)** | 한국 통화량 | 한국은행 | 월별 |
| **Global Liquidity** | 전 세계 M2 합계 | 계산 | 월별 |
| **Credit Spread** | 회사채 - 국채 스프레드 | FRED | 일별 |
| **TED Spread** | LIBOR - Treasury 스프레드 | FRED | 일별 |
| **LIBOR Rate** | 런던 은행간 금리 | ICE | 일별 |
| **SOFR** | Secured Overnight Financing Rate | FRED | 일별 |
| **Repo Rate** | 환매조건부채권 금리 | FRED | 일별 |

### 🌍 Category 3: 경제 성장 (Economic Growth)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **US GDP Growth** | 미국 GDP 성장률 | FRED | 분기 |
| **China GDP Growth** | 중국 GDP 성장률 | World Bank | 분기 |
| **EU GDP Growth** | 유럽 GDP 성장률 | Eurostat | 분기 |
| **Korea GDP Growth** | 한국 GDP 성장률 | 한국은행 | 분기 |
| **Global GDP Growth** | 전 세계 GDP 성장률 | World Bank | 분기 |
| **US Unemployment** | 미국 실업률 | BLS | 월별 |
| **US Jobless Claims** | 미국 신규 실업수당 | BLS | 주별 |
| **ISM Manufacturing** | 미국 제조업 지수 | ISM | 월별 |
| **PMI Global** | 전 세계 제조업 지수 | IHS Markit | 월별 |
| **Retail Sales (US)** | 미국 소매 판매 | FRED | 월별 |

### 💵 Category 4: 환율 (Foreign Exchange)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **USD/KRW** | 달러/원 환율 | yfinance | 실시간 |
| **EUR/USD** | 유로/달러 | yfinance | 실시간 |
| **USD/JPY** | 달러/엔 | yfinance | 실시간 |
| **USD/CNY** | 달러/위안 | yfinance | 실시간 |
| **GBP/USD** | 파운드/달러 | yfinance | 실시간 |
| **AUD/USD** | 호주달러/달러 | yfinance | 실시간 |
| **DXY** | 달러 인덱스 | yfinance | 실시간 |
| **Trade Weighted USD** | 무역 가중 달러 지수 | FRED | 일별 |

### 🛢️ Category 5: 원자재 (Commodities)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **Crude Oil (WTI)** | 서부텍사스산 원유 | yfinance | 실시간 |
| **Brent Oil** | 브렌트유 | yfinance | 실시간 |
| **Natural Gas** | 천연가스 | yfinance | 실시간 |
| **Gold** | 금 | yfinance | 실시간 |
| **Silver** | 은 | yfinance | 실시간 |
| **Copper** | 구리 | yfinance | 실시간 |
| **Wheat** | 밀 | yfinance | 실시간 |
| **Corn** | 옥수수 | yfinance | 실시간 |
| **Soybeans** | 대두 | yfinance | 실시간 |
| **Coffee** | 커피 | yfinance | 실시간 |

### 📦 Category 6: 무역 & 물류 (Trade & Logistics)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **Baltic Dry Index** | 건화물 해운 지수 | Investing.com | 일별 |
| **Container Freight Rate** | 컨테이너 운임 | Freightos | 주별 |
| **US Trade Balance** | 미국 무역수지 | FRED | 월별 |
| **China Exports** | 중국 수출액 | Investing.com | 월별 |
| **Global Trade Volume** | 전 세계 무역량 | WTO | 분기 |
| **US Tariff Rate** | 미국 관세율 | USTR | 정책 변경 시 |

### 📈 Category 7: 시장 심리 (Market Sentiment)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **VIX** | 변동성 지수 | yfinance | 실시간 |
| **Fear & Greed Index** | 공포 탐욕 지수 | CNN Money | 일별 |
| **Put/Call Ratio** | 풋/콜 비율 | CBOE | 실시간 |
| **AAII Sentiment** | 개인투자자 심리 | AAII | 주별 |
| **High Yield Spread** | 하이일드 스프레드 | FRED | 일별 |

### 🏠 Category 8: 부동산 (Real Estate)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **US Home Prices** | 미국 주택 가격 | S&P Case-Shiller | 월별 |
| **US Mortgage Rate** | 미국 주택담보대출 금리 | FRED | 주별 |
| **Housing Starts** | 주택 착공 | FRED | 월별 |
| **REIT Index** | 리츠 지수 | yfinance | 실시간 |

### 💻 Category 9: 기술 & 혁신 (Tech & Innovation)

| 변수 | 설명 | 데이터 소스 | 업데이트 주기 |
|------|------|------------|--------------|
| **Semiconductor Sales** | 반도체 판매액 | WSTS | 월별 |
| **Cloud Revenue Growth** | 클라우드 매출 성장률 | Synergy Research | 분기 |
| **AI Chip Demand** | AI 칩 수요 지수 | 계산 | 분기 |

---

## 5. 데이터 소스 & 비용

### 📊 무료 데이터 소스

| 소스 | 제공 데이터 | Rate Limit | API Key |
|------|-----------|-----------|---------|
| **FRED (Federal Reserve)** | 미국 경제 지표 (500K+ series) | 무제한 | ✅ 필요 (무료) |
| **yfinance** | 주가, 재무제표, 뉴스 | 2,000 req/hour | ❌ 불필요 |
| **World Bank API** | 글로벌 GDP, 인구 등 | 무제한 | ❌ 불필요 |
| **SEC EDGAR** | 미국 기업 공시 | 10 req/sec | ❌ 불필요 |
| **DART (한국)** | 한국 기업 공시 | 1,000 req/day | ✅ 필요 (무료) |
| **ECB API** | 유럽 경제 지표 | 무제한 | ❌ 불필요 |
| **한국은행 API** | 한국 경제 지표 | 1,000 req/day | ✅ 필요 (무료) |
| **News API** | 글로벌 뉴스 | 100 req/day (Free) | ✅ 필요 |
| **Investing.com** | VIX, 컨테이너 운임비 | Scraping | ❌ |

### 💰 유료 데이터 소스 (옵션)

| 소스 | 제공 데이터 | 가격 | 필요성 |
|------|-----------|------|--------|
| **Alpha Vantage** | 실시간 주가, 뉴스, 펀더멘털 | $50/month (Premium) | ⚠️ 중 |
| **Polygon.io** | 실시간 주가, 옵션 | $99/month | ⚠️ 중 |
| **Quandl** | 금융 데이터셋 | $50-500/month | ❌ 낮음 |
| **Bloomberg Terminal** | 모든 것 | $24,000/year | ❌ 불필요 |
| **Whale Wisdom** | 13F 공시 분석 | $99/month | ✅ 높음 |

### 💡 비용 최적화 전략

1. **무료 소스 우선**
   - yfinance + FRED로 90% 커버
   - SEC EDGAR로 공시 무료 수집

2. **캐싱 전략**
   - Redis에 1시간 캐시
   - 중복 요청 방지

3. **점진적 업그레이드**
   - MVP: 무료만 사용
   - 사용자 1,000명: Alpha Vantage 추가
   - 사용자 10,000명: Polygon.io 추가

---

## 6. UI/UX 디자인 철학

### 🎨 디자인 원칙

1. **Dark First**
   - 기본: 어두운 테마 (Bloomberg/Palantir 스타일)
   - 눈의 피로 최소화
   - 데이터 강조

2. **Data Density**
   - 많은 정보를 작은 공간에
   - 하지만 복잡하지 않게
   - 계층적 정보 표시

3. **Professional yet Accessible**
   - 전문가: 모든 기능 접근 가능
   - 초보자: 간단한 가이드 제공

4. **Speed**
   - 모든 액션 < 300ms
   - 로딩 상태 명확히

5. **Consistency**
   - 모든 페이지 동일한 패턴
   - 사용자 학습 부담 최소화

### 🖥️ 반응형 디자인

**Desktop (1920px+):**
- 3단 레이아웃 (사이드바 + 메인 + 패널)
- 모든 기능 표시

**Laptop (1280px-1919px):**
- 2단 레이아웃 (사이드바 접기 가능 + 메인)
- 핵심 기능 우선

**Tablet (768px-1279px):**
- 1단 레이아웃
- 하단 탭 네비게이션

**Mobile (< 768px):**
- 모바일 앱 스타일
- 스와이프 제스처

---

## 7. 기술 스택 & 아키텍처

### 🔧 Frontend

```typescript
// Framework
Next.js 14 (App Router)
React 18
TypeScript 5

// State Management
Zustand (global state)
TanStack Query (server state)

// 3D Visualization
Three.js + React Three Fiber
D3.js (2D graphs)

// Charts
Lightweight Charts (TradingView)
ApexCharts

// UI Components
Tailwind CSS
Headless UI
Framer Motion (animations)

// Data Fetching
Axios
SWR (real-time)
```

### ⚙️ Backend (API Layer)

```python
# Framework
FastAPI 0.115.0
Uvicorn (ASGI server)

# AI/ML
TradingAgents (LangGraph)
OpenAI API (gpt-4o-mini)

# Data
yfinance 0.2.48
pandas 2.1.4
numpy 1.26.2

# Database
PostgreSQL 15+ (structured data)
Redis 7+ (cache)
MongoDB (unstructured: news, filings)

# Real-time
WebSocket (Socket.io)
Kafka (event streaming)
```

### 🗄️ Database Schema

```sql
-- Macro Variables
CREATE TABLE macro_variables (
  date DATE PRIMARY KEY,
  fed_rate DECIMAL(5,3),
  ecb_rate DECIMAL(5,3),
  gdp_growth_us DECIMAL(5,2),
  oil_price DECIMAL(8,2),
  vix DECIMAL(5,2),
  usd_krw DECIMAL(8,2),
  container_rate DECIMAL(10,2),
  m2_us BIGINT,
  m2_china BIGINT,
  m2_eu BIGINT,
  -- ... 50+ columns
);

-- Companies
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(20) UNIQUE,
  name VARCHAR(255),
  sector VARCHAR(50),
  market_cap BIGINT,
  employees INT
);

-- 13F Filings (Hedge Funds)
CREATE TABLE hedge_fund_filings (
  id SERIAL PRIMARY KEY,
  fund_name VARCHAR(255),
  fund_cik VARCHAR(20),
  filing_date DATE,
  total_value BIGINT,
  holdings JSONB  -- [{ticker, shares, value, change}]
);

-- News Feed
CREATE TABLE news_feed (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100),
  title TEXT,
  summary TEXT,
  url TEXT,
  published_at TIMESTAMP,
  sentiment VARCHAR(20),  -- 'BULLISH', 'BEARISH', 'NEUTRAL'
  related_tickers VARCHAR(100)[],
  impact_score DECIMAL(3,2)
);

-- Filings (SEC, DART)
CREATE TABLE filings (
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  filing_type VARCHAR(20),  -- '8-K', '10-K', '13F'
  filed_at TIMESTAMP,
  content TEXT,
  ai_analysis JSONB  -- {revenue_impact, profit_impact, price_target}
);

-- User Contributions (for blockchain later)
CREATE TABLE knowledge_graph_nodes (
  id SERIAL PRIMARY KEY,
  user_id INT,
  node_type VARCHAR(50),  -- 'HYPOTHESIS', 'RELATIONSHIP', 'INSIGHT'
  content TEXT,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  blockchain_hash VARCHAR(66)  -- For future blockchain integration
);
```

---

## 8. 블록체인 인센티브 생태계

### ⛓️ Phase 4 (12-18개월 후)

#### 토큰 경제 설계

**Token Name:** NEXUS
**Total Supply:** 1,000,000,000 (1B)
**Blockchain:** Polygon (낮은 Gas Fee)

**분배:**
- Team: 20% (2년 vesting)
- Community Rewards: 40%
- Liquidity: 20%
- Ecosystem Fund: 10%
- Investors: 10%

#### 획득 방법

| 활동 | 보상 | 검증 |
|------|------|------|
| 새로운 관계 발견 | 10 NEXUS | AI + 커뮤니티 투표 |
| 가설 검증 | 50 NEXUS | 70% 이상 동의 |
| 공시 파싱 기여 | 20 NEXUS | 정확도 검증 |
| Bot 대회 우승 | 500 NEXUS | 자동 |
| 강의 수료 | 5 NEXUS | 자동 |
| 리포트 작성 | 30 NEXUS | 조회수 기반 |

#### 사용처

| 용도 | 비용 | 대안 |
|------|------|------|
| AI 애널리스트 리포트 | 10 NEXUS | $5 USD |
| 프리미엄 강의 | 50 NEXUS | $20 USD |
| API 사용 (1,000 calls) | 100 NEXUS | $50 USD |
| Bot Arena 참가 | 20 NEXUS | $10 USD |
| 광고 제거 | 200 NEXUS | $8/month |

#### 법적 고려사항

**Utility Token vs Security Token:**
- **Utility**: API, 강의 등 실제 사용처 → 증권 아님
- **Security**: 투자 목적, 배당 → SEC 규제 대상

**전략:**
- 초기: Utility Token으로 설계
- 변호사 검토 필수
- SEC Safe Harbor 활용

---

## 9. 단계별 로드맵

### 🚀 Phase 1: Core Platform (Week 1-8)

**Week 1-2: Dashboard Rebuild**
- [ ] 사이드바 추가 (모든 페이지 접근)
- [ ] Macro 슬라이더 10개 (금리, GDP, 유가, VIX, 환율 등)
- [ ] Circuit Diagram Interactive
- [ ] 실시간 계산 엔진 (0.5초 내)

**Week 3-4: 3D Network Graph**
- [ ] Three.js 세팅
- [ ] 23개 회사 노드 배치
- [ ] Sector 클러스터링
- [ ] 관계 선 표시 (대출, 공급망)
- [ ] 인터랙션 (hover, click, zoom)

**Week 5-6: News Feed & 13F**
- [ ] News API 연동
- [ ] SEC EDGAR 13F 파싱
- [ ] 헤지펀드 포트폴리오 페이지
- [ ] 뉴스 → 지식 그래프 연결

**Week 7-8: Polish & Integration**
- [ ] 전체 페이지 스타일 통일
- [ ] 차트 디자인 개선 (Lightweight Charts)
- [ ] 성능 최적화
- [ ] 데모 동영상 제작

**Deliverable:** "와, 이거 진짜 멋지다" 반응 나오는 데모

---

### 📈 Phase 2: Advanced Features (Week 9-16)

**Week 9-10: Macro 확장**
- [ ] 50+ Macro 변수 추가
- [ ] FRED, World Bank API 연동
- [ ] 변수 간 상관관계 분석

**Week 11-12: Filing Simulator**
- [ ] SEC, DART 공시 자동 수집
- [ ] AI 파싱 (TradingAgents)
- [ ] 재무제표 시뮬레이션

**Week 13-14: 3D Globe**
- [ ] 각국 M2 통화량 시각화
- [ ] 자본 흐름 애니메이션
- [ ] 국가별 경제 지표 표시

**Week 15-16: Community & Arena**
- [ ] 포스팅/댓글 시스템
- [ ] 가설 제시 & 투표
- [ ] Trading Bot Arena UI
- [ ] 리더보드

**Deliverable:** 완성도 높은 Beta 버전

---

### 🌍 Phase 3: Global Expansion (Week 17-32)

**Month 5-6:**
- [ ] 회사 23개 → 500개 확장
- [ ] Crypto 섹터 추가 (BTC, ETH, DeFi)
- [ ] Quant 도구 (Black-Scholes, Portfolio Optimization)

**Month 7-8:**
- [ ] 사용자 100명 → 1,000명
- [ ] API 오픈 (외부 개발자)
- [ ] 모바일 앱 개발

**Deliverable:** Product-Market Fit 달성

---

### ⛓️ Phase 4: Blockchain (Month 9-18)

**Month 9-12:**
- [ ] 토큰 경제 설계
- [ ] 법률 검토
- [ ] 스마트 컨트랙트 개발

**Month 13-18:**
- [ ] 토큰 발행
- [ ] 기여도 → 토큰 전환
- [ ] 지식 그래프 온체인 저장

**Deliverable:** 탈중앙화 인센티브 생태계

---

## 10. 예상 비용 & 수익 모델

### 💰 Phase 1 비용 (월간)

| 항목 | 비용 | 비고 |
|------|------|------|
| **데이터** |
| yfinance | $0 | 무료 |
| FRED API | $0 | 무료 |
| News API | $0 | Free Tier (100 req/day) |
| **인프라** |
| Vercel (Frontend) | $0 | Hobby Plan |
| Railway (Backend) | $5 | Starter |
| PostgreSQL | $0 | Supabase Free |
| Redis | $0 | Upstash Free |
| **AI** |
| OpenAI API | $20 | gpt-4o-mini (테스트) |
| **Total** | **$25/month** | 🎉 매우 저렴! |

### 📈 Phase 2-3 비용 (월간)

| 항목 | 비용 | 비고 |
|------|------|------|
| **데이터** |
| Alpha Vantage | $50 | Premium |
| Whale Wisdom | $99 | 13F 분석 |
| **인프라** |
| Vercel Pro | $20 | Pro Plan |
| AWS EC2 | $100 | t3.large |
| PostgreSQL | $25 | Supabase Pro |
| Redis | $10 | Upstash Pro |
| **AI** |
| OpenAI API | $200 | 사용자 증가 |
| **Total** | **$504/month** | 사용자 1,000명 기준 |

### 💵 수익 모델

**Freemium:**
- Free Tier:
  - 기본 차트, 뉴스 피드
  - 10개 회사 추적
  - 커뮤니티 접근

- Pro Tier ($20/month):
  - 무제한 회사 추적
  - AI 애널리스트 리포트 (월 10개)
  - Trading Bot Arena 참가
  - 프리미엄 강의

- Enterprise ($500/month):
  - API 접근
  - 전용 지원
  - 커스텀 분석

**예상 수익 (1년 후):**
- 사용자: 10,000명
- Conversion Rate: 5% → 500명 Pro
- 수익: 500 × $20 = $10,000/month
- 비용: $504/month
- **순이익: $9,496/month** 🚀

---

## 11. 리스크 & 대응

### ⚠️ 주요 리스크

1. **데이터 정확성**
   - 리스크: yfinance 데이터 오류
   - 대응: 여러 소스 교차 검증

2. **법적 리스크**
   - 리스크: 토큰 증권 분류
   - 대응: 변호사 검토, Utility 강조

3. **경쟁**
   - 리스크: Bloomberg, TradingView 견제
   - 대응: 차별화 (3D, 시뮬레이션, 커뮤니티)

4. **기술적 복잡도**
   - 리스크: 3D 렌더링 성능 문제
   - 대응: LOD, Instancing, WebWorker

---

## 12. 최종 결론

### ✅ 강점 요약

1. **차별화**: Bloomberg + Palantir + Obsidian + 블록체인
2. **비용**: 초기 $25/month로 시작 가능
3. **확장성**: 단계적 성장 가능
4. **커뮤니티**: 네트워크 효과로 성장

### 🎯 즉시 시작해야 할 이유

1. **완성도 높은 데모**: 8주 내 완성 가능
2. **투자 유치**: VC/엔젤 관심 끌 수 있음
3. **선점 효과**: 경쟁자 없는 블루오션
4. **학습**: 구축 과정에서 엄청난 지식 습득

---

## 📝 다음 단계

### Option A: Phase 1 먼저 (8주)
**추천 ⭐⭐⭐⭐⭐**
- 완성도 높은 데모
- 빠른 피드백
- 투자 유치 가능
- 법적 리스크 없음

### Option B: 전체 동시 진행 (18-24개월)
**비추천**
- 완성도 저하
- 번아웃 위험
- 법적 리스크

---

## 🚀 진행 여부 확인

**나의 제안: Option A (Phase 1 집중)**

이유:
1. 8주 내 완성 가능한 현실적 목표
2. 백엔드 없어도 멋진 데모 가능
3. 블록체인은 커뮤니티 확보 후
4. 단계적 학습 & 검증

**시작하시겠습니까?**

---

**문서 버전:** 2.0
**최종 수정:** 2025-11-06
**작성자:** Claude (AI Assistant) + 당신의 비전
**상태:** 검토 대기 중

---

*이 문서는 Nexus-Alpha 프로젝트의 완전한 마스터 플랜입니다.*
*모든 팀원이 이 비전을 공유하고 실현해 나가길 바랍니다.* 🌌
