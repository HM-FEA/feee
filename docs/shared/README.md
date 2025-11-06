# /docs/shared/ - 모든 섹터가 사용하는 공용 프레임

**Purpose:** Banking, Real Estate, Manufacturing, Options, Crypto 등 모든 섹터가 따를 공용 구조
**Rule:** 추가만 가능, 수정 불가
**Status:** Phase 1 완료, Phase 2-3 준비 중
**Last Updated:** 2025-11-01

---

## 📚 문서 구조

```
/docs/shared/                          # 모든 섹터 공용
├─ LEVEL1_MACRO.md          ✅ 완료
│  ├─ 금리, 관세, 환율, 인플레이션
│  ├─ Equation 1.1: Macro → Sector
│  └─ 모든 섹터 적용 가능
│
├─ LEVEL2_SECTOR.md         ⏳ 향후
│  ├─ Banking: NIM, β = +0.30
│  ├─ Real Estate: ICR, β = -0.50
│  ├─ Manufacturing: Capacity, β = -0.10
│  ├─ Options: Greeks, β = complex
│  └─ Crypto: Regulation, β = volatile
│
├─ LEVEL3_COMPANY.md        ⏳ 향후
│  ├─ Balance Sheet (Assets = Liabilities + Equity)
│  ├─ Income Statement (NI = Revenue - Expenses)
│  ├─ Key Ratios (ICR, D/E, ROA, ROE)
│  ├─ Eq 3.1-3.3, 3.7-3.8 (모두 공용)
│  └─ 모든 회사 동일 구조
│
├─ LEVEL4_ASSET.md          ⏳ 향후
│  ├─ Banking: Individual Loans
│  ├─ Real Estate: Properties
│  ├─ Manufacturing: Facilities
│  ├─ Eq 4.1-4.2 (공용 방정식)
│  └─ 섹터별 자산 타입 다름
│
└─ DATABASE_SCHEMA.md        ⏳ 향후
   ├─ Public Tables (companies, balance_sheets, income_statements)
   ├─ Banking Tables (bank_loan_portfolios)
   ├─ Real Estate Tables (properties)
   ├─ Manufacturing Tables (facilities)
   └─ Relationship Table (cross-sector links)

/docs/sectors/                         # 섹터별 상세
├─ banking/
│  ├─ SECTOR_SPEC.md        ✅ 완료 (NIM, Provision, ICR)
│  └─ SAMPLE_DATA.md        ⏳ 향후
│
├─ realestate/
│  ├─ SECTOR_SPEC.md        ✅ 완료 (ICR, Interest Expense, NOI)
│  └─ SAMPLE_DATA.md        ⏳ 향후
│
├─ manufacturing/            # 🔜 다음 (Template 따름)
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
├─ options/                  # 🔜 향후
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
├─ crypto/                   # 🔜 향후
│  ├─ SECTOR_SPEC.md
│  └─ SAMPLE_DATA.md
│
└─ SECTOR_TEMPLATE.md        ✅ 완료 (신규 섹터 추가 매뉴얼)
```

---

## 🔄 파일 간 관계도

```
CORE_FRAMEWORK.md (Root)
├─ 4-Level 온톨로지 개요
├─ 9개 공용 방정식 (Eq 1.1, 2.1, 3.1-3.8, 4.1-4.2)
└─ Implementation Flow 설명

  ↓ 구체화 ↓

/docs/shared/
├─ LEVEL1_MACRO.md
│  ├─ Eq 1.1 상세
│  ├─ 6개 Macro Variables
│  └─ 모든 섹터 적용
│
├─ LEVEL2_SECTOR.md (향후)
│  ├─ Eq 2.1 상세
│  ├─ 섹터별 β값 정의
│  └─ 섹터별 추가 지표
│
├─ LEVEL3_COMPANY.md (향후)
│  ├─ Eq 3.1-3.8 상세
│  ├─ 모든 회사 동일 구조
│  └─ 샘플 재무제표
│
└─ LEVEL4_ASSET.md (향후)
   ├─ Eq 4.1-4.2 상세
   ├─ 자산 타입별 구현
   └─ 부채 할당 방식

  ↓ 섹터별 상세화 ↓

/docs/sectors/banking/SECTOR_SPEC.md
├─ Level 2 Banking 특화:
│  ├─ NIM (순이자마진)
│  ├─ Provision Rate (충당금)
│  ├─ Eq B1-B3 (Banking 추가 방정식)
│  └─ 샘플: 신한, KB, 우리은행

/docs/sectors/realestate/SECTOR_SPEC.md
├─ Level 2 Real Estate 특화:
│  ├─ ICR (이자비용 커버율)
│  ├─ Interest Expense
│  ├─ Eq R1-R4 (Real Estate 추가 방정식)
│  └─ 샘플: 신한알파, 이리츠, NH프라임

/docs/sectors/manufacturing/SECTOR_SPEC.md (🔜)
├─ Level 2 Manufacturing 특화:
│  ├─ Capacity Utilization
│  ├─ COGS (원재료비)
│  ├─ Eq M1-M4 (Manufacturing 추가 방정식)
│  └─ 샘플: 삼성, SK하이닉스, LG
```

---

## 📊 현재 구현 상태

### ✅ Phase 1: Foundation Complete

**공용 프레임:**
- ✅ LEVEL1_MACRO.md (완료)
- ⏳ LEVEL2_SECTOR.md (향후)
- ⏳ LEVEL3_COMPANY.md (향후)
- ⏳ LEVEL4_ASSET.md (향후)
- ⏳ DATABASE_SCHEMA.md (향후)

**Banking + Real Estate:**
- ✅ banking/SECTOR_SPEC.md (완료)
- ✅ realestate/SECTOR_SPEC.md (완료)
- ⏳ banking/SAMPLE_DATA.md (향후)
- ⏳ realestate/SAMPLE_DATA.md (향후)

**확장 준비:**
- ✅ SECTOR_TEMPLATE.md (매뉴얼 완성)
- ⏳ manufacturing/ (🔜 다음)
- ⏳ options/ (향후)
- ⏳ crypto/ (향후)
- ⏳ sp500/ (향후)

---

## 🎯 확장 로드맵

### Week 1 (지금)
```
✅ /docs/shared/LEVEL1_MACRO.md
✅ /docs/sectors/banking/SECTOR_SPEC.md
✅ /docs/sectors/realestate/SECTOR_SPEC.md
✅ /docs/sectors/SECTOR_TEMPLATE.md
```

### Week 2-3
```
⏳ LEVEL2_SECTOR.md (섹터별 민감도)
⏳ LEVEL3_COMPANY.md (재무 표준)
⏳ LEVEL4_ASSET.md (자산 레벨)
⏳ DATABASE_SCHEMA.md (DB 스키마)
```

### Week 4-5
```
⏳ manufacturing/ (Template 따라 생성)
⏳ options/ (Template 따라 생성)
⏳ Backend 확장 (manufacturing_calculator.py, options_calculator.py)
```

### Week 6+
```
⏳ crypto/, sp500/, kospi/ 등 추가
⏳ KOSPI 전 종목 통합
⏳ S&P 500 통합
⏳ 3D Network Graph 고도화
```

---

## 💡 핵심 원칙

### 1️⃣ 공용-섹터별 분리
```
공용 (이것들은 수정 금지):
├─ Eq 1.1: Macro → Sector
├─ Eq 3.1-3.8: Balance Sheet, Income, Ratios, Rate Sensitivity
└─ Eq 4.1-4.2: Asset Profitability, Debt Allocation

섹터별 (이것들은 추가만):
├─ Banking: Eq B1-B3 (NIM, Provision)
├─ Real Estate: Eq R1-R4 (Interest Expense, ICR)
├─ Manufacturing: Eq M1-M4 (COGS, Capacity)
├─ Options: Eq O1-O4 (Greeks, Pricing)
└─ Crypto: Eq C1-C4 (Regulation, Volatility)
```

### 2️⃣ 확장 가능성
```
Banking + Real Estate ✅
        ↓ (Template 사용)
+ Manufacturing
+ Options
+ Crypto
+ S&P 500
+ KOSPI
+ KOSDAQ
= 통합 금융 온톨로지 플랫폼
```

### 3️⃣ 동일 구조, 다른 내용
```
모든 섹터:
├─ Level 1: 동일 (금리, 관세, 환율...)
├─ Level 2: 다름 (각 섹터의 Key Metrics)
├─ Level 3: 동일 구조, 다른 값 (모두 재무제표)
└─ Level 4: 섹터별 자산 타입 다름 (대출, 부동산, 공장, 옵션...)
```

---

## 📖 사용 방법

### 신규 팀원 (Banking + Real Estate 이해)
```
1. /nexus-alpha/START_HERE.md 읽기
2. /docs/shared/LEVEL1_MACRO.md 읽기
3. /docs/sectors/banking/SECTOR_SPEC.md 읽기
4. /docs/sectors/realestate/SECTOR_SPEC.md 읽기
5. 앱 테스트 (http://localhost:3000/rate-simulator)
```

### 새 섹터 추가 팀 (Manufacturing)
```
1. /docs/sectors/SECTOR_TEMPLATE.md 읽기
2. /docs/sectors/banking/SECTOR_SPEC.md 참고
3. /docs/sectors/manufacturing/ 폴더 생성
4. SECTOR_SPEC.md 작성 (Template 따라)
5. SAMPLE_DATA.md 작성 (3개 회사)
6. CORE_FRAMEWORK.md Level 2 업데이트
7. Backend calculator 구현
```

### 전체 구조 이해
```
1. CORE_FRAMEWORK.md (9개 공용 방정식 개요)
2. /docs/shared/LEVEL1_MACRO.md (Eq 1.1 상세)
3. /docs/sectors/banking/SECTOR_SPEC.md (실제 사례: Banking)
4. /docs/sectors/realestate/SECTOR_SPEC.md (실제 사례: Real Estate)
5. /docs/sectors/SECTOR_TEMPLATE.md (새 섹터 추가 방법)
```

---

## 🔗 관련 Root 문서

- **START_HERE.md** (5분 시작 가이드)
- **CORE_FRAMEWORK.md** (9개 공용 방정식 + 4-Level 개요)
- **PROJECT_STATUS.md** (진행 상황)
- **README.md** (프로젝트 개요)

---

## ✅ 검증: 확장성

### ✓ Banking + Real Estate
```
Macro (금리) → Banking (+impact) + Real Estate (-impact)
             → Cross-sector (부도위험) → Stable ✅
```

### ✓ + Manufacturing (향후)
```
Macro (관세) → Manufacturing (-impact)
             → Banking (고객 부도위험) → Stable ✅
```

### ✓ + Options (향후)
```
Macro (금리, 변동성) → Options (복잡한 Greeks)
                    → Banking + RE (헤징) → More stable ✅
```

### ✓ + Crypto (향후)
```
Macro (규제, 감정) → Crypto (고변동성)
                   → 포트폴리오 다양화 ✅
```

---

**결론: SECTOR_TEMPLATE.md를 따르면 무한 확장 가능!**
