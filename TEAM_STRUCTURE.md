# Nexus-Alpha Team Structure & Responsibilities

**Last Updated:** 2025-11-03
**Purpose:** 모든 팀원이 자신의 역할과 책임을 명확히 이해하기 위한 문서

---

## 🏢 Team Organization

```
CEO (대표)
├─ 전체 프로젝트 현황 모니터링
├─ 팀 간 조율 및 의사결정
└─ 전략적 방향 설정

├─ Team Market Structuring (시장 구조 설계팀)
│   ├─ 역할: 4-Level 온톨로지 설계, 공용 방정식 정의
│   ├─ 책임: CORE_FRAMEWORK.md 관리
│   └─ 산출물: Level 1-4 구조, 9개 공용 방정식
│
├─ Team Sector Analysis (섹터 분석팀) ⭐ NEW
│   ├─ 역할: 섹터별 특수 방정식 발굴 및 검증
│   ├─ 책임: 각 섹터의 SECTOR_SPEC.md 작성
│   ├─ 예시:
│   │   ├─ Banking: LTV, NIM, Provision 방정식 추가
│   │   ├─ Real Estate: ICR, Occupancy, 부도위험 추가
│   │   ├─ Manufacturing: Capacity, Labor Cost 추가
│   │   ├─ Semiconductor: Wafer 가동률, R&D 비율 추가
│   │   └─ Options: Greeks (Delta, Gamma, Vega) 추가
│   └─ 프로세스:
│       1. 섹터 특성 연구
│       2. 필요 방정식 제안
│       3. Team Quant와 검증
│       4. SECTOR_SPEC.md에 추가 (Append-only)
│
├─ Team Fundamental (펀더멘털 분석팀) ⭐ NEW
│   ├─ 역할: 기업 재무제표 분석, 내재가치 평가
│   ├─ 책임: Balance Sheet, Income Statement, Cash Flow 분석
│   ├─ 도구: TradingAgents Fundamental Analyst 연동
│   ├─ 산출물:
│   │   ├─ 재무비율 분석 (ROE, ROA, P/E, P/B)
│   │   ├─ 기업가치 평가 (DCF, Multiples)
│   │   └─ 재무 건전성 평가 리포트
│   └─ 협업: Team Quant (방정식 검증), Team Data (실제 데이터)
│
├─ Team Technical (기술적 분석팀) ⭐ NEW
│   ├─ 역할: 가격 패턴, 기술적 지표 분석
│   ├─ 책임: Chart Pattern, Technical Indicators
│   ├─ 도구: TradingAgents Technical Analyst 연동
│   ├─ 산출물:
│   │   ├─ 기술적 지표 (MACD, RSI, Bollinger Bands)
│   │   ├─ 차트 패턴 인식 (Head & Shoulders, Double Top/Bottom)
│   │   └─ 매매 시그널 생성
│   └─ 협업: Team Quant (지표 계산), Team Data (가격 데이터)
│
├─ Team Quant (퀀트팀)
│   ├─ 역할: 방정식 구현, 계산 엔진 개발
│   ├─ 책임: Backend API (FastAPI), Python 계산 로직
│   ├─ 협업: Team Sector Analysis의 방정식 검증
│   └─ 산출물: /api/simulator/* 엔드포인트
│
├─ Team Data (데이터팀)
│   ├─ 역할: 데이터베이스 구축, 실제 데이터 연동
│   ├─ 책임: PostgreSQL, yfinance, DART API 연동
│   └─ 산출물: 50+ 기업 실제 재무 데이터
│
├─ Team SimViz (시뮬레이션 & 시각화팀)
│   ├─ 역할: 3D 시각화, Circuit Diagram, Network Graph
│   ├─ 책임: Three.js, D3.js 구현
│   └─ 산출물: 3D Globe, 3D Network, Circuit Diagram
│
└─ Team UI (프론트엔드팀)
    ├─ 역할: 사용자 인터페이스 구현
    ├─ 책임: Next.js, React 컴포넌트
    └─ 산출물: Dashboard, Analysis Pages
```

---

## ⭐ Team Sector Analysis (섹터 분석팀) - 상세

### 핵심 역할
**"이 섹터에는 어떤 특수 방정식이 필요한가?"를 판단하고 추가**

### 작업 프로세스

#### Step 1: 섹터 특성 연구
```
예시: Semiconductor 섹터 분석 시작

1. 산업 특성 파악
   - 반도체는 자본집약적 (CapEx 높음)
   - R&D 비중 매우 높음 (매출의 15-20%)
   - Wafer 가동률이 수익성에 직접 영향
   - 글로벌 공급망 의존도 높음

2. 기존 9개 공용 방정식 검토
   ✅ Eq 3.1 Balance Sheet - 사용 가능
   ✅ Eq 3.2 Income Statement - 사용 가능
   ✅ Eq 3.3 Key Ratios (ICR, D/E) - 사용 가능
   ❌ LTV - 반도체에는 부적합 (부동산 자산 없음)
   ❌ NIM - 반도체에는 부적합 (은행 아님)

3. 필요한 추가 방정식 도출
   📌 Eq S1: Wafer Capacity Utilization
      Utilization = Actual_Wafer_Output / Max_Capacity
      Impact: 80% 미만 시 고정비 부담 ↑

   📌 Eq S2: R&D Intensity
      R&D_Ratio = R&D_Expense / Revenue
      Impact: 15% 이상 유지 필요 (기술 경쟁력)

   📌 Eq S3: Supply Chain Risk
      Risk_Score = Import_Dependency × Geopolitical_Risk
      Impact: 중국 의존도 높으면 위험 ↑
```

#### Step 2: 방정식 제안서 작성
```markdown
# Semiconductor Sector - New Equations Proposal

**제안일:** 2025-11-03
**제안자:** Team Sector Analysis

## 필요한 추가 방정식

### Eq S1: Wafer Capacity Utilization
- 정의: 실제 웨이퍼 생산량 / 최대 생산 능력
- 범위: 0-100%
- 임계값:
  - 80% 이상: 정상
  - 60-80%: 주의 (고정비 부담)
  - 60% 미만: 위험 (적자 가능성)
- 적용 회사: 삼성전자, SK하이닉스, TSMC

### Eq S2: R&D Intensity
- 정의: R&D 비용 / 매출
- 범위: 5-25%
- 임계값:
  - 15% 이상: 기술 경쟁력 유지
  - 10-15%: 보통
  - 10% 미만: 기술 낙후 위험
- 적용 회사: 모든 반도체 기업
```

#### Step 3: Team Quant와 검증
```
Team Sector Analysis → Team Quant
"이 방정식들이 구현 가능한가요? 데이터 수집 가능한가요?"

Team Quant 검토:
✅ Eq S1: 가능 (공시 자료에서 가동률 확인 가능)
✅ Eq S2: 가능 (재무제표에서 R&D 비용 확인)
⚠️ Eq S3: 어려움 (Supply Chain Risk는 정량화 어려움)

→ Eq S1, S2 승인
→ Eq S3 보류 (추가 연구 필요)
```

#### Step 4: SECTOR_SPEC.md에 추가
```
/docs/sectors/semiconductor/SECTOR_SPEC.md 생성

- Eq S1, S2 추가
- 삭제/수정 불가 (Append-only)
- 잘못된 방정식도 유지하고 S1_v2로 새 버전 추가
```

---

## 🎯 섹터별 특수 방정식 예시

### Banking
```
공용 방정식 사용:
✅ Eq 3.1-3.3 (Balance Sheet, Income, Ratios)
✅ Eq 3.7 (Rate Sensitivity)

추가 방정식:
+ Eq B1: NIM (Net Interest Margin)
+ Eq B2: Provision Rate
+ Eq B3: Loan Portfolio Risk
```

### Real Estate
```
공용 방정식 사용:
✅ Eq 3.1-3.3 (재무제표)
✅ Eq 3.7 (금리 민감도)
❌ NIM (은행 아님, 사용 안 함)

추가 방정식:
+ Eq R1: LTV (Loan-to-Value)
+ Eq R2: Occupancy Rate
+ Eq R3: 부도위험
+ Eq R4: Rental Yield
```

### Manufacturing
```
공용 방정식 사용:
✅ Eq 3.1-3.3 (재무제표)
✅ Eq 3.7 (금리 민감도)
❌ LTV (부동산 없음, 사용 안 함)
❌ NIM (은행 아님, 사용 안 함)

추가 방정식:
+ Eq M1: Capacity Utilization
+ Eq M2: Labor Cost Index
+ Eq M3: Tariff Impact
```

### Semiconductor (추가 예정)
```
공용 방정식 사용:
✅ Eq 3.1-3.3 (재무제표)
✅ Eq 3.7 (금리 민감도)
❌ LTV, NIM (사용 안 함)

추가 방정식:
+ Eq S1: Wafer Capacity Utilization
+ Eq S2: R&D Intensity
+ Eq S3: ASP (Average Selling Price) Trend
```

### Options (추가 예정)
```
공용 방정식 사용:
✅ Eq 3.7 (금리 민감도)
❌ Balance Sheet (옵션은 파생상품, 재무제표 없음)

추가 방정식:
+ Eq O1: Delta (가격 민감도)
+ Eq O2: Gamma (Delta 변화율)
+ Eq O3: Vega (변동성 민감도)
+ Eq O4: Theta (시간 가치 감소)
+ Eq O5: Rho (금리 민감도)
```

---

## 👔 CEO Dashboard 요구사항

### 전체 현황 모니터링 페이지 필요
```
/ceo-dashboard 페이지 생성

1. 팀별 진행 상황
   ├─ Team Market Structuring: Phase 1 완료 ✅
   ├─ Team Sector Analysis: Banking ✅, Real Estate ✅, Semiconductor 🔄
   ├─ Team Quant: API 구현 50% 🔄
   ├─ Team Data: 6개 종목 ✅, 50개 목표 (12%)
   ├─ Team SimViz: Network Graph ✅, 3D 업그레이드 ⏳
   └─ Team UI: Dashboard ✅, Analysis Pages 🔄

2. 섹터별 방정식 현황
   ├─ Banking: 9 공용 + 3 추가 = 12개 ✅
   ├─ Real Estate: 9 공용 + 4 추가 = 13개 ✅
   ├─ Manufacturing: 9 공용 + 3 추가 = 12개 ✅
   ├─ Semiconductor: 계획 중 ⏳
   └─ Options: 계획 중 ⏳

3. 데이터 커버리지
   ├─ Banking: 3개 / 목표 10개 (30%)
   ├─ Real Estate: 3개 / 목표 15개 (20%)
   ├─ Manufacturing: 0개 / 목표 15개 (0%)
   └─ 전체: 6개 / 목표 50개 (12%)

4. 최근 활동 로그
   ├─ 2025-11-03 17:00 - [Team UI] Dashboard 생성 완료
   ├─ 2025-11-03 16:30 - [Team UI] 색상 테마 업데이트 (#050505)
   ├─ 2025-11-03 16:00 - [Team SimViz] Network Graph 완료
   └─ 2025-11-01 - [Team Market] Phase 1 완료
```

---

## 🔄 협업 프로세스

### 새 섹터 추가 시
```
1. Team Sector Analysis
   - 섹터 특성 연구
   - 필요 방정식 도출
   - 제안서 작성

2. Team Quant
   - 방정식 검증
   - 구현 가능성 확인
   - 승인/보류 결정

3. Team Sector Analysis
   - SECTOR_SPEC.md 작성
   - 샘플 데이터 정의

4. Team Data
   - 실제 데이터 수집
   - 데이터베이스 추가

5. Team Quant
   - 계산 엔진 구현
   - API 엔드포인트 추가

6. Team UI
   - 분석 페이지 추가
   - Dashboard 통합

7. CEO
   - 최종 검토 및 승인
   - 전체 현황 모니터링
```

---

## 📊 팀별 KPI

### Team Market Structuring
- 목표: 공용 방정식 9개 유지
- KPI: 방정식 변경 없음 (Append-only 준수)

### Team Sector Analysis
- 목표: 섹터당 3-5개 추가 방정식
- KPI: 신규 섹터 월 1개 추가

### Team Quant
- 목표: 모든 방정식 API 구현
- KPI: API 응답 속도 < 100ms

### Team Data
- 목표: 50개 이상 기업 데이터
- KPI: 데이터 정확도 > 95%

### Team SimViz
- 목표: 3D 시각화 완성
- KPI: 60fps 유지, 50개 노드 처리

### Team UI
- 목표: 5개 분석 페이지 완성
- KPI: 페이지 로드 < 1초

---

## 🎯 현재 우선순위

### 이번 주 (2025-11-03 ~ 11-10)
1. **CEO Dashboard 생성** (Team UI)
2. **Team Sector Analysis 가동** (Semiconductor 분석 시작)
3. **데이터 확장** (Team Data: 6개 → 20개)
4. **3D Network 업그레이드** (Team SimViz)

### 다음 주 (2025-11-11 ~ 11-17)
1. Semiconductor 섹터 추가 (Team Sector Analysis + Team Quant)
2. Fundamental Analysis 페이지 완성 (Team UI)
3. 실제 API 연동 (Team Data + Team Quant)

---

**이 문서는 모든 팀원이 공유합니다. 역할과 책임이 명확해졌다면 각자 작업을 시작하세요!**
