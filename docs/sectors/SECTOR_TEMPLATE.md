# Sector Template - 새 섹터 추가 시 따를 표준

**Purpose:** 모든 새 섹터(Manufacturing, Options, Crypto, S&P500 등)가 이 구조를 따르도록 함
**Rule:** Copy & Paste 후, [SECTOR_NAME], [Company Examples] 등만 변경
**Last Updated:** 2025-11-01

---

## 🏗️ 섹터 폴더 구조

```
/docs/sectors/
├─ banking/               # ✅ 완료
│  ├─ SECTOR_SPEC.md     # 은행 특화 설명
│  └─ SAMPLE_DATA.md     # 샘플 3개 회사
│
├─ realestate/           # ✅ 완료
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
├─ manufacturing/         # 🔜 다음 (템플릿 따름)
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
├─ options/              # 🔜 향후
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
├─ crypto/               # 🔜 향후
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
└─ SECTOR_TEMPLATE.md    # 이 파일 (매뉴얼)
```

---

## 📋 새 섹터 추가 절차

### Step 1: 폴더 생성
```bash
mkdir /docs/sectors/[new-sector]/
touch /docs/sectors/[new-sector]/SECTOR_SPEC.md
touch /docs/sectors/[new-sector]/SAMPLE_DATA.md
```

### Step 2: SECTOR_SPEC.md 작성 (템플릿 다음 페이지 참고)

### Step 3: SAMPLE_DATA.md 작성 (템플릿 다음 페이지 참고)

### Step 4: CORE_FRAMEWORK.md 업데이트
```markdown
# 추가할 부분:

## Level 2: [New Sector] (추가)

### 정의
[새 섹터의 Key Metrics]

### Equation 2.1 확장
[새 섹터의 sensitivity 정의]

예시:
  β_[NewSector] = [value]
```

### Step 5: PROJECT_STATUS.md 업데이트
```markdown
- [ ] [New Sector] 섹터 추가
  - [ ] SECTOR_SPEC.md 작성
  - [ ] SAMPLE_DATA.md 작성
  - [ ] CORE_FRAMEWORK.md 업데이트
  - [ ] Backend calculator 구현
```

---

## 📄 SECTOR_SPEC.md 템플릿

```markdown
# [SECTOR_NAME] Sector Specification

**Sector ID:** [sector-id]
**Company Count (MVP):** 3-5 companies
**Key Metrics:** [List 3-5]
**Risk Level:** Low/Medium/High
**Last Updated:** [Date]

---

## 📊 개요

### What is [SECTOR_NAME]?
[섹터 설명: 1-2 문단]

### Why Include This Sector?
[왜 이 섹터을 포함했는가]

---

## 🎯 Key Metrics (Level 2)

### Metric 1: [Metric Name]
```
정의: [정의]
범위: [범위]
영향도: [금리 변화 시 영향]
기본값: [기본값]

계산식:
  [Metric] = [Formula]
```

### Metric 2: [Metric Name]
[Metric 1과 동일 구조]

### Metric 3: [Metric Name]
[Metric 1과 동일 구조]

---

## 📐 섹터별 추가 방정식

### Equation A: [Equation Name]
```
[Equation] = [Formula]

예시:
  Scenario 1: [Example 1]
  Scenario 2: [Example 2]
```

### Equation B: [Equation Name]
[Equation A와 동일 구조]

---

## 💼 샘플 데이터 (3개 회사)

| Company | Type | Key Metric 1 | Key Metric 2 |
|---------|------|--------------|--------------|
| [Co1]   | Sub  | [Value]      | [Value]      |
| [Co2]   | Sub  | [Value]      | [Value]      |
| [Co3]   | Sub  | [Value]      | [Value]      |

---

## 🔄 Macro → [Sector] 영향도

```
Interest Rate ↑
  ↓
[Sector Impact] = β_[sector] × Δrate

예시:
  rate 2.5% → 3.0% (Δ +0.5%)

  [Company 1]: [Impact] %
  [Company 2]: [Impact] %
  [Company 3]: [Impact] %
```

---

## ✅ 검증 기준

Test 1: [Test Name]
  Input: [Input]
  Expected: [Expected Output]
  Result: [PASS/FAIL]

---

## 📁 관련 문서

- CORE_FRAMEWORK.md (공용 9개 방정식)
- SAMPLE_DATA.md (이 섹터의 회사 데이터)
- Level 1-4 (모든 섹터 공용)
```

---

## 📄 SAMPLE_DATA.md 템플릿

```markdown
# [SECTOR_NAME] Sample Data

**3개 샘플 회사 상세 정보**
**Last Updated:** [Date]

---

## Company 1: [Company Name]

### Basic Info
- Company ID: [ID]
- Ticker: [Ticker]
- Industry: [Industry]
- Market Cap: [Value]

### Level 3: Financial Data (공용)
```
Balance Sheet:
  Assets: [Value]
  Liabilities: [Value]
  Equity: [Value]

Income Statement:
  Revenue: [Value]
  Expenses: [Value]
  Interest Expense: [Value]
  Net Income: [Value]

Key Ratios:
  ICR: [Value]x
  D/E: [Value]x
  ROA: [Value]%
  ROE: [Value]%
```

### Level 2: Sector-Specific Metrics
```
[Metric 1]: [Value]
[Metric 2]: [Value]
[Metric 3]: [Value]
```

### Level 4: Asset Details (섹터별)

**Banking:**
```
Loan Portfolio:
  - Borrower 1: [Amount] @ [Rate], ICR [Value]
  - Borrower 2: [Amount] @ [Rate], ICR [Value]
```

**Real Estate:**
```
Properties:
  - Property 1: [Value], Occupancy [%]
  - Property 2: [Value], Occupancy [%]
```

**Manufacturing:**
```
Production Facilities:
  - Factory 1: [Capacity], Utilization [%]
  - Factory 2: [Capacity], Utilization [%]
```

**Options:**
```
Option Contracts:
  - Call 1: Strike [Price], Greeks [Delta, Gamma, Vega]
  - Put 1: Strike [Price], Greeks [Delta, Gamma, Vega]
```

---

## 시나리오: 금리 2.5% → 3.0%

### Current State (금리 2.5%)
```
NI: [Value]
[Metric 1]: [Value]
[Metric 2]: [Value]
Status: [Status]
```

### New State (금리 3.0%)
```
NI: [Value]
[Metric 1]: [Value]
[Metric 2]: [Value]
Status: [Status]

Change:
  ΔNI: [Value] ([%])
  Δ[Metric 1]: [Value]
  Δ[Metric 2]: [Value]
```

---

## Company 2, 3...
[Company 1과 동일 구조]
```

---

## 🔗 확장 예시

### Manufacturing 추가 시
```
/docs/sectors/manufacturing/
├─ SECTOR_SPEC.md
│  ├─ Key Metrics: Capacity Utilization, Labor Cost, COGS
│  ├─ Equations: Profit = Revenue - COGS - Labor - Interest
│  └─ 샘플: 삼성전자, SK하이닉스, LG전자
│
└─ SAMPLE_DATA.md
   ├─ 삼성전자 (수출 중심)
   ├─ SK하이닉스 (반도체)
   └─ LG전자 (가전)
```

### Options 추가 시
```
/docs/sectors/options/
├─ SECTOR_SPEC.md
│  ├─ Key Metrics: Delta, Gamma, Vega, Rho, Theta
│  ├─ Equations: Black-Scholes, Greeks
│  └─ 샘플: KOSPI 200 Call, Put Options
│
└─ SAMPLE_DATA.md
   ├─ KOSPI 200 Call (ATM)
   ├─ KOSPI 200 Put (OTM)
   └─ Individual Stock Options
```

### S&P 500 추가 시
```
/docs/sectors/sp500/
├─ SECTOR_SPEC.md
│  ├─ Key Metrics: P/E, Dividend Yield, Beta
│  ├─ Equations: Dividend Discount Model
│  └─ 샘플: Apple, Microsoft, Google
│
└─ SAMPLE_DATA.md
   ├─ Tech Companies (Apple, Microsoft, Google)
   ├─ Financial Companies (JPMorgan, Goldman Sachs)
   └─ Energy Companies (ExxonMobil, Chevron)
```

---

## ✅ 체크리스트: 새 섹터 추가

```
[ ] Step 1: 폴더 생성
    [ ] /docs/sectors/[sector]/ 생성
    [ ] SECTOR_SPEC.md 생성
    [ ] SAMPLE_DATA.md 생성

[ ] Step 2: 문서 작성
    [ ] SECTOR_SPEC.md 작성 (50-100줄)
    [ ] SAMPLE_DATA.md 작성 (3개 회사 상세)

[ ] Step 3: Core 문서 업데이트
    [ ] CORE_FRAMEWORK.md Level 2 추가
    [ ] CORE_FRAMEWORK.md Database Schema 추가

[ ] Step 4: Backend 구현
    [ ] services/market-data-api/sectors/[sector]_calculator.py
    [ ] Equation A, B, C 구현

[ ] Step 5: Frontend 추가
    [ ] /app/sectors/[sector]/page.tsx (대시보드)
    [ ] /app/company/[id]/circuit-diagram (이미 존재)

[ ] Step 6: 테스트
    [ ] Rate scenario 테스트
    [ ] Cross-sector impact 테스트
    [ ] 예상 결과 vs 실제 결과 비교
```

---

## 🎯 중요 원칙

1. **공용은 추가만**: CORE_FRAMEWORK.md는 추가만 하고 수정 금지
2. **구조는 동일**: 모든 섹터는 Level 1-4 동일 구조 따름
3. **확장성 우선**: 한 번에 한 섹터씩 추가, 겹치지 않게
4. **테스트 필수**: 새 섹터 추가 후 기존 섹터와 동시 테스트

---

**이 템플릿을 따르면, S&P500, KOSPI, Options, Crypto 등을 언제든 추가할 수 있습니다!**
