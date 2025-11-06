# Nexus-Alpha Master Guide

**새로운 Claude Code 세션 시작 시 이 파일부터 읽으세요**

**Last Updated:** 2025-11-01
**Project Status:** Phase 1 - Foundation Complete ✅
**Current Phase:** Phase 2 - Implementation

---

## 🎯 프로젝트 핵심 목표

**경제 온톨로지 플랫폼 구축**
- 금리/관세 등 매크로 변수 변화 → 섹터별 영향 → 개별 기업 영향 → 주가 예측
- 은행 vs 부동산: 같은 금리 인상이지만 정반대 영향 (은행↑, 부동산↓)
- 기업 간 관계: 부동산 부실 → 은행의 provision 증가

---

## 📁 핵심 문서 구조 (3-Tier)

```
/nexus-alpha
│
├─ [Tier 1: 프로젝트 레벨 - 모두가 읽음]
│  ├─ MASTER_GUIDE.md ← 지금 이 파일 (신규 세션 시작점)
│  ├─ PROJECT_STATUS.md ← 매주 업데이트 (완료 여부 확인)
│  └─ CORE_FRAMEWORK.md ← 핵심 프레임워크 (4-Level 온톨로지, 공용 방정식)
│
├─ /docs
│  ├─ /shared ← [Tier 2: 공용 - 모든 섹터가 사용, 추가만 함]
│  │  ├─ LEVEL1_MACRO.md
│  │  ├─ LEVEL2_SECTOR.md
│  │  ├─ LEVEL3_COMPANY.md
│  │  ├─ LEVEL4_ASSET.md
│  │  └─ DATABASE_SCHEMA.md
│  │
│  └─ /sectors ← [Tier 3: 섹터별 - 각 섹터 고유, 복사 안 함]
│     ├─ /banking
│     │  ├─ SECTOR_SPEC.md (Level 2-4 상세)
│     │  └─ COMPLETION_REPORT.md (작업 완료 후)
│     └─ /realestate
│        ├─ SECTOR_SPEC.md (Level 2-4 상세)
│        └─ COMPLETION_REPORT.md (작업 완료 후)
│
└─ /archived ← 필요없거나 중복된 문서들
```

---

## 📋 현재 프로젝트 상태

### ✅ Phase 1 완료 (Foundation)
- 4-Level 온톨로지 정의 완료
- Banking + Real Estate 방정식 정의 완료
- 샘플 데이터 (은행 3개, 부동산 3개) 정의 완료
- 통합 시나리오 (금리 2.5%→3.0%) 정의 완료

### ⏳ Phase 2 진행 중 (Implementation)
- [ ] 데이터베이스 구축
- [ ] Quant 엔진 구현
- [ ] 시각화 구현

### ❌ Phase 3 대기 중 (Manufacturing 추가)

---

## 🔑 핵심 개념 (5분 요약)

### 4-Level 온톨로지

```
Level 1: Macro Variables (금리, 관세, 환율, 인플레이션)
         ↓ 모든 섹터에 영향
Level 2: Sector Metrics (NIM, Occupancy, Capacity)
         ↓ 섹터별로 다름
Level 3: Company Details (신한은행, 신한알파리츠, ...)
         ↓ 개별 회사마다 다름
Level 4: Asset/Product (개별 부동산, 대출, 제품)
         ↓ 가장 세부적
```

### 핵심 인사이트: 금리 인상 시

```
금리 2.5% → 3.0% 인상하면:

은행:
  순이자마진(NIM) 확대 → 수익 ↑ (+8~13%)
  이유: 대출금리↑↑ vs 예금금리↑ (차이가 벌어짐)

부동산:
  이자비용 증가 → 수익 ↓ (-5~40%)
  이유: 임대수익 같음 vs 이자비용↑

은행 내부에서도 차이:
  - 우리은행 (+10%): 부동산 노출 낮음 → 승자
  - 신한은행 (+8%): 균형적
  - KB금융 (-5%): 부동산 노출 높음 → 패자
```

---

## 📖 각 문서의 역할

### Tier 1: 프로젝트 레벨 (루트 폴더)

**MASTER_GUIDE.md** (지금 이 파일)
- 새 세션 시작 시 첫 번째로 읽는 파일
- 프로젝트 전체 개요
- 어디서 뭘 찾아야 하는지

**PROJECT_STATUS.md**
```markdown
# 이번 주 완료: Banking Level 3 구현
# 다음 주 목표: Real Estate Level 3 구현
# 블로킹 이슈: 없음
# 진행률: Phase 1 100%, Phase 2 40%
```

**CORE_FRAMEWORK.md**
- 4-Level 온톨로지 정의
- 공용 방정식 (모든 섹터가 사용)
- Balance Sheet, Income Statement 구조

---

### Tier 2: 공용 문서 (/docs/shared)

**LEVEL1_MACRO.md**
```
매크로 변수 정의:
- interest_rate: 0-10%
- tariff_rate: 0-50%
- inflation_rate: 0-10%
- fx_rate: USD/KRW

Equation 1.1: Macro → Sector Impact
```

**LEVEL2_SECTOR.md**
```
섹터별 추가 필요 사항:
- Banking: NIM, Provision Rate
- Real Estate: Occupancy, Rental Yield
- Manufacturing: Capacity Utilization (추후)

Equation 2.1: Sector Sensitivity
```

**LEVEL3_COMPANY.md**
```
개별 회사 데이터 구조:
- Balance Sheet (모든 회사 공통)
- Income Statement (모든 회사 공통)
- Key Ratios (모든 회사 공통)

Equation 3.1-3.8: Company Financials
```

**LEVEL4_ASSET.md**
```
자산/제품 레벨:
- Banking: 개별 대출 (loan_portfolios)
- Real Estate: 개별 부동산 (properties)
- Manufacturing: 개별 제품 (추후)

Equation 4.1-4.2: Asset-Level Profitability
```

**DATABASE_SCHEMA.md**
```sql
공용 테이블:
- macro_variables
- companies
- balance_sheets
- income_statements
- company_financials
- relationships

섹터별 추가 테이블:
- bank_loan_portfolios (Banking)
- properties (Real Estate)
```

---

### Tier 3: 섹터별 문서 (/docs/sectors/[sector])

**각 섹터는 SECTOR_SPEC.md 하나만 유지**

```markdown
# Banking Sector Specification

## Level 2: Banking-Specific Metrics
- NIM = Lending Rate - Deposit Rate
- Provision = Loan Portfolio × Default Rate × LGD

## Level 3: Sample Companies
- Shinhan Bank: 450조, 25% RE exposure
- KB Financial: 400조, 30% RE exposure (risky)
- Woori Bank: 300조, 15% RE exposure (safe)

## Level 4: Loan Portfolio
- Individual loans with default probability
- Borrower ICR tracking

## Implementation Status
- [ ] Equations implemented
- [ ] Sample data loaded
- [ ] Tests passing

## Test Cases
- Rate 2.5% → 3.0%: Shinhan NI 2.52조 → 2.85조
```

**COMPLETION_REPORT.md** (작업 완료 후 작성)
```markdown
# Banking Sector Completion Report

## What was completed
- ✅ All equations implemented
- ✅ 3 sample banks with financials
- ✅ Rate sensitivity tested

## Lessons learned
- NIM expansion > Provision increase
- RE exposure matters

## For next sector
- Reuse LEVEL3_COMPANY structure
- Add sector-specific metrics to LEVEL2_SECTOR
```

---

## 🚀 새 섹터 추가 시 프로세스

### Manufacturing 추가한다면:

1. **공용 문서 업데이트** (추가만)
```
LEVEL2_SECTOR.md에 추가:
- Manufacturing: Capacity Utilization, Labor Cost Index

DATABASE_SCHEMA.md에 추가:
- manufacturing_facilities 테이블
```

2. **섹터 폴더 생성**
```
/docs/sectors/manufacturing/
├─ SECTOR_SPEC.md (새로 작성)
└─ COMPLETION_REPORT.md (완료 후 작성)
```

3. **PROJECT_STATUS.md 업데이트**
```
Phase 3 시작: Manufacturing 추가
```

**❌ 하지 않는 것:**
- 공용 문서 복사/수정 (추가만!)
- 새로운 온톨로지 구조 만들기 (4-Level 그대로 사용)
- Banking/Real Estate 문서 수정 (독립적)

---

## 📊 Quick Reference

### 필수 방정식 (모든 섹터)

```
Eq 3.1: Assets = Liabilities + Equity
Eq 3.2: Net Income = Revenue - Expenses - Interest - Tax
Eq 3.7: ΔNI = f(ΔRate, Debt, Sensitivity)
Eq 3.8: Cross-Sector Impact
```

### 샘플 데이터 위치

```
Banking: /docs/sectors/banking/SECTOR_SPEC.md
Real Estate: /docs/sectors/realestate/SECTOR_SPEC.md
Integration: /docs/shared/INTEGRATION_SCENARIOS.md
```

### 코드 위치

```
공용: /src/shared/core_equations.py
섹터: /src/sectors/banking/, /src/sectors/realestate/
```

---

## ✅ 체크리스트 (새 세션 시작 시)

1. [ ] `MASTER_GUIDE.md` 읽음 (이 파일)
2. [ ] `PROJECT_STATUS.md` 확인 (현재 진행 상황)
3. [ ] `CORE_FRAMEWORK.md` 참고 (핵심 프레임워크)
4. [ ] 작업할 섹터의 `SECTOR_SPEC.md` 확인
5. [ ] 시작!

---

## 🗑️ 정리 대상 (필요 없는 문서들)

다음 문서들은 `/archived`로 이동:
- `REALESTATE_CORE_EQUATIONS.md` → `CORE_FRAMEWORK.md` + `/sectors/realestate/SECTOR_SPEC.md`로 통합
- `BANKING_CORE_EQUATIONS.md` → `CORE_FRAMEWORK.md` + `/sectors/banking/SECTOR_SPEC.md`로 통합
- `REALESTATE_LEVEL3_COMPANIES.md` → `/sectors/realestate/SECTOR_SPEC.md`로 통합
- `BANKING_LEVEL3_COMPANIES.md` → `/sectors/banking/SECTOR_SPEC.md`로 통합
- `IMPLEMENTATION_CHECKLIST.md` → `PROJECT_STATUS.md`로 통합
- 기타 중복 문서들

---

## 🎯 다음 액션

1. **지금 바로:**
   - `CORE_FRAMEWORK.md` 작성 (공용 방정식)
   - `PROJECT_STATUS.md` 작성 (현재 상태)
   - `/docs/shared/LEVEL*.md` 작성
   - `/docs/sectors/banking/SECTOR_SPEC.md` 작성
   - `/docs/sectors/realestate/SECTOR_SPEC.md` 작성

2. **그 다음:**
   - 중복 문서들 `/archived`로 이동
   - 코드 구현 시작

---

**이 문서 하나로 프로젝트 전체를 이해하고 시작할 수 있어야 합니다.**
