# Nexus-Alpha: AI-Powered Economic Ontology Platform

**Status:** Phase 2 In Progress 🔄 | Progress: 52%
**Last Updated:** 2025-11-03

[![Progress](https://img.shields.io/badge/Progress-52%25-brightgreen)]()
[![Companies](https://img.shields.io/badge/Companies-23%2F50-blue)]()
[![Equations](https://img.shields.io/badge/Equations-32-orange)]()
[![Teams](https://img.shields.io/badge/Teams-8-purple)]()

---

## ⚡ Quick Start

**신규 팀원 / 새 세션 시작 시:**
```
📖 FINAL_SUMMARY.md 읽기 ← 최신 작업 내용!
📊 CEO Dashboard 확인 ← /ceo-dashboard
📋 ARCHITECTURE_GAPS.md ← 남은 작업 확인
```

---

## 🎯 프로젝트 핵심

**AI 기반 경제 온톨로지 시스템**
- 4-Level 구조: Macro → Sector → Company → Asset
- 23개 기업 실시간 데이터 (yfinance 연동)
- TradingAgents AI 분석 (계획 완료)
- 3D Network Graph 시각화

**핵심 통찰 (금리 2.5%→3.0% 인상 시):**
```
은행:    +8~13% (순이자마진 확대)
부동산:  -8~40% (이자비용 증가, ICR 악화)
제조업:  -3~7%  (차입비용 증가)
반도체:  -2~5%  (투자 감소)
```

---

## 📊 현재 진행 상황 (2025-11-03)

### ✅ Phase 1: Foundation (100%)
- 4-Level 온톨로지 정의 완료
- 9개 공용 방정식 + 23개 섹터별 방정식
- TEAM_STRUCTURE.md (8개 팀 확립)

### 🔄 Phase 2: Implementation (52%)
- ✅ 23개 기업 데이터 (Banking 7, Real Estate 7, Manufacturing 5, Semiconductor 4)
- ✅ CEO Dashboard 완성
- ✅ Network Graph (D3.js, 23개 노드)
- ✅ FastAPI Backend 구축
- ✅ TradingAgents 통합 계획
- 🔄 Frontend ↔ Backend 연동 (대기)
- 🔄 Fundamental/Technical 페이지 (대기)

### 🔜 Phase 3: AI & Expansion
- [ ] TradingAgents AI 분석 통합
- [ ] 50개 기업 데이터 달성
- [ ] 3D Universe Network
- [ ] 실시간 데이터 스트리밍

---

## 🏗️ 4-Level 온톨로지

```
Level 1: Macro Variables (거시경제)
  └─ 금리, 관세, 환율, 인플레이션

Level 2: Sector Metrics (섹터)
  ├─ Banking: NIM, Provision Rate
  ├─ Real Estate: LTV, Occupancy Rate
  ├─ Manufacturing: Capacity Utilization
  └─ Semiconductor: Wafer Utilization, R&D Intensity

Level 3: Company Details (기업)
  └─ Balance Sheet, Income Statement, Key Ratios
      (ROE, ROA, ICR, D/E, P/E, P/B)

Level 4: Asset/Product (자산)
  └─ 개별 대출, 부동산, 제품, 옵션
```

---

## 👥 Team Structure (8개 팀)

| 팀 | 역할 | 진행률 | 상태 |
|---|------|--------|------|
| **Team Market Structuring** | 4-Level 온톨로지 설계 | 100% | ✅ |
| **Team Sector Analysis** | 섹터별 특수 방정식 발굴 | 75% | ✅ |
| **Team Fundamental** ⭐ | 펀더멘털 분석 (TradingAgents) | 0% | 🆕 |
| **Team Technical** ⭐ | 기술적 분석 (TradingAgents) | 0% | 🆕 |
| **Team Quant** | Backend API, 방정식 구현 | 50% | 🔄 |
| **Team Data** | 데이터 수집 & 검증 | 46% | 🔄 |
| **Team SimViz** | 3D 시각화, Circuit Diagram | 40% | 🔄 |
| **Team UI** | Frontend 개발 | 45% | 🔄 |

자세한 내용: [`TEAM_STRUCTURE.md`](./TEAM_STRUCTURE.md)

---

## 📊 데이터 커버리지

| 섹터 | 기업 수 | 목표 | 달성률 | 주요 기업 |
|------|---------|------|--------|-----------|
| 🏦 **Banking** | 7 | 10 | 70% | 신한은행, KB금융, JP모건체이스, HSBC |
| 🏢 **Real Estate** | 7 | 15 | 47% | 신한알파리츠, 롯데리츠, ESR켄달스퀘어 |
| 🏭 **Manufacturing** | 5 | 10 | 50% | 현대차, LG전자, Tesla, Toyota |
| 💻 **Semiconductor** | 4 | 10 | 40% | 삼성전자, SK하이닉스, TSMC, Intel |
| 📈 **Options** | 0 | 5 | 0% | (계획 중) |
| **Total** | **23** | **50** | **46%** | - |

**글로벌 커버리지:** 🇰🇷 한국 16개 | 🇺🇸 미국 5개 | 🇬🇧 영국 1개 | 🇹🇼 대만 1개 | 🇯🇵 일본 1개

---

## 🔬 방정식 시스템 (32개)

### Common Equations (9개)
모든 섹터에 공통 적용 가능
- **Eq 1.1** - Macro Indicators
- **Eq 2.1** - Sector Growth Rate
- **Eq 3.1-3.8** - Balance Sheet, Income, Ratios, Cash Flow, Default Risk, Credit Rating, Rate Sensitivity, FX Exposure
- **Eq 4.1-4.2** - Asset Profitability, Debt Allocation

### Sector-Specific Equations (23개)

#### Banking (3개)
- **Eq B1:** Net Interest Margin (NIM)
- **Eq B2:** Provision Rate
- **Eq B3:** Loan Portfolio Risk

#### Real Estate (4개)
- **Eq R1:** Loan-to-Value (LTV)
- **Eq R2:** Occupancy Rate
- **Eq R3:** Default Risk
- **Eq R4:** Rental Yield

#### Manufacturing (3개)
- **Eq M1:** Capacity Utilization
- **Eq M2:** Labor Cost Index
- **Eq M3:** Tariff Impact

#### Semiconductor (5개) ⭐ NEW
- **Eq S1:** Wafer Capacity Utilization (가동률)
- **Eq S2:** R&D Intensity (연구개발 집약도)
- **Eq S3:** ASP Trend (평균 판매가격)
- **Eq S4:** CapEx Ratio (설비투자 비율)
- **Eq S5:** Geopolitical Risk Score (지정학적 리스크)

자세한 내용: [`docs/sectors/semiconductor/SECTOR_SPEC.md`](./docs/sectors/semiconductor/SECTOR_SPEC.md)

---

## 🚀 Getting Started

### Frontend Setup
```bash
cd apps/web
npm install
npm run dev
# → http://localhost:3000
```

### Backend Setup
```bash
cd apps/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Environment Variables
```bash
# Backend (.env)
OPENAI_API_KEY=sk-proj-...
ALPHA_VANTAGE_API_KEY=...

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 💻 기술 스택

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS
- **Visualization:** D3.js, Three.js, Recharts
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI 0.115.0
- **Data:** yfinance 0.2.48 (실시간 주식 데이터)
- **Server:** uvicorn 0.32.0
- **Language:** Python 3.13

### AI/ML
- **Framework:** TradingAgents (LangGraph)
- **LLM:** OpenAI (gpt-4o-mini)
- **Data:** Alpha Vantage API

---

## 🎨 주요 페이지

### 1. CEO Dashboard (`/ceo-dashboard`)
전체 프로젝트 현황 모니터링
- 전체 진행률: 52%
- 팀별 진행 상황 (8개 팀)
- 섹터별 방정식 현황
- 데이터 커버리지 (23/50)
- 최근 활동 로그

### 2. Network Graph (`/network-graph`)
23개 기업의 금융 네트워크 3D 시각화
- D3.js Force Simulation
- 섹터별 색상 구분
- 드래그, 클릭, 호버 인터랙션
- 대출 관계 시각화

### 3. Dashboard (`/dashboard`)
5가지 분석 섹션
- 📊 Fundamental Analysis
- 📈 Technical Analysis
- 🔢 Quantitative Analysis
- ⚡ HFT (High-Frequency Trading)
- 🔗 Blockchain Analytics

### 4. Backend API (`http://localhost:8000`)
실시간 주식 데이터 제공
- `GET /api/stock/{ticker}` - 주식 가격
- `GET /api/fundamental/{ticker}` - 펀더멘털 분석
- `GET /api/technical/{ticker}` - 기술적 지표
- `GET /api/news/{ticker}` - 뉴스 데이터

---

## 🤖 TradingAgents Integration

### Framework 개요
Multi-Agent LLM 기반 트레이딩 분석 프레임워크

**위치:** `/Users/jeonhyeonmin/Simulation/TradingAgents/`

**주요 Agent:**
- **Fundamental Analyst** → Team Fundamental 연동
- **Technical Analyst** → Team Technical 연동
- **News Analyst** → Level 1 (Macro) 연동
- **Sentiment Analyst** → 향후 확장
- **Researcher Team** → Bull/Bear 토론
- **Trader Agent** → 거래 결정
- **Risk Management** → Level 3 (Company) 리스크 평가

**통합 계획:** [`TRADINGAGENTS_INTEGRATION.md`](./TRADINGAGENTS_INTEGRATION.md)

---

## 📁 프로젝트 구조

```
nexus-alpha/
│
├── [핵심 문서]
│   ├── README.md (이 파일)
│   ├── FINAL_SUMMARY.md ⭐ (최신 작업 종합)
│   ├── TEAM_STRUCTURE.md (8개 팀 구조)
│   ├── CORE_FRAMEWORK.md (4-Level 온톨로지)
│   ├── TRADINGAGENTS_INTEGRATION.md (AI 통합)
│   └── ARCHITECTURE_GAPS.md (남은 작업)
│
├── apps/
│   ├── web/ (Next.js Frontend)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── ceo-dashboard/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── network-graph/
│   │   │   │   └── ...
│   │   │   ├── data/
│   │   │   │   └── companies.ts (23개 기업)
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── backend/ (FastAPI)
│       ├── main.py (API Server)
│       └── requirements.txt
│
├── docs/
│   └── sectors/
│       ├── banking/
│       ├── realestate/
│       ├── manufacturing/
│       └── semiconductor/ (SECTOR_SPEC.md)
│
└── TradingAgents/ (별도 디렉토리)
    └── tradingagents/
```

---

## 🚨 Known Issues & Gaps

상세 내용: [`ARCHITECTURE_GAPS.md`](./ARCHITECTURE_GAPS.md)

### 🔴 Critical (즉시 필요)
1. Backend API 서버 실행
2. Frontend ↔ Backend 연동
3. Fundamental Analysis 페이지 구현
4. Technical Analysis 페이지 구현

### 🟡 Important (중요)
5. TradingAgents 완전 통합
6. 데이터 확장 (23 → 50 companies)
7. 3D Universe Network 업그레이드
8. Circuit Diagram 고도화

---

## 🎯 다음 단계 (Next Steps)

### Week 1 (현재 주)
1. ✅ Backend API 서버 실행 및 테스트
2. ✅ Frontend ↔ Backend 연동
3. ✅ Fundamental Analysis 페이지 기본 구현
4. ✅ Technical Analysis 페이지 기본 구현

### Week 2
1. TradingAgents 통합 (OpenAI API 설정)
2. 데이터 확장 (23 → 35 companies)
3. CEO Dashboard 실시간 데이터 연동
4. Network Graph 3D 업그레이드 시작

### Week 3
1. Circuit Diagram 구현
2. 데이터 확장 완료 (50 companies)
3. 실시간 데이터 스트리밍
4. 사용자 피드백 수집

---

## 📚 주요 문서

- [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) - **최신 작업 종합 보고서**
- [`TEAM_STRUCTURE.md`](./TEAM_STRUCTURE.md) - 팀 구조 및 역할
- [`ARCHITECTURE_GAPS.md`](./ARCHITECTURE_GAPS.md) - 아키텍처 갭 분석
- [`TRADINGAGENTS_INTEGRATION.md`](./TRADINGAGENTS_INTEGRATION.md) - AI 통합 계획
- [`CORE_FRAMEWORK.md`](./CORE_FRAMEWORK.md) - 4-Level 온톨로지
- [`docs/sectors/semiconductor/SECTOR_SPEC.md`](./docs/sectors/semiconductor/SECTOR_SPEC.md) - 반도체 섹터 분석

---

## 💰 예상 비용

### 개발 단계 (월)
- OpenAI API (gpt-4o-mini): ~$10
- Alpha Vantage Free: $0
- Vercel Hobby: $0
- **Total: ~$10/month**

### 프로덕션 (월)
- OpenAI API (gpt-4o): ~$100
- Alpha Vantage Premium: $50
- Vercel Pro: $20
- Railway (Backend): $20
- PostgreSQL (Supabase): $25
- **Total: ~$215/month**

---

## 📞 Contact

**Project:** Nexus-Alpha
**Status:** Phase 2 (52% Complete)
**Repository:** `/Users/jeonhyeonmin/Simulation/nexus-alpha/`

---

## 📄 License

이 프로젝트는 연구 및 교육 목적으로 개발되었습니다.

**면책 조항:** 본 플랫폼은 투자 조언을 제공하지 않습니다. 모든 투자 결정은 사용자의 책임입니다.

---

**더 자세한 내용은 `FINAL_SUMMARY.md`를 읽어주세요!**
