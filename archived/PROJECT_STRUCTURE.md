# Nexus-Alpha Project Structure

**Purpose:** Master document showing complete project organization
**Status:** Active Project
**Last Updated:** 2025-11-01

---

## 📁 Directory Hierarchy

```
/nexus-alpha
├─ [프로젝트 레벨 문서들 - 모든 사람이 참고]
│  ├─ PROJECT_STRUCTURE.md (← 지금 이 파일)
│  ├─ PROJECT_STATUS.md (매주 업데이트)
│  ├─ GETTING_STARTED.md (신규 팀원 입장 시 필독)
│  ├─ FUNDAMENTAL_EQUATIONS.md (공용, 모든 섹터의 기초)
│  └─ COMMON_DATA_MODEL.md (공용, 모든 섹터이 데이터 구조)
│
├─ /docs
│  ├─ /shared
│  │  ├─ ARCHITECTURE.md (전체 아키텍처)
│  │  ├─ ONTOLOGY_FRAMEWORK.md (4-레벨 온톨로지, 모든 섹터 공용)
│  │  ├─ MACRO_VARIABLES.md (모든 섹터가 사용)
│  │  ├─ DATABASE_SCHEMA.md (모든 섹터 공용 테이블)
│  │  ├─ IMPLEMENTATION_STANDARDS.md (코딩 표준)
│  │  └─ TEAM_CHARTER.md (각 팀 역할)
│  │
│  ├─ /sectors
│  │  ├─ /banking
│  │  │  ├─ BANKING_EQUATIONS.md (은행만의 추가 방정식)
│  │  │  ├─ BANKING_COMPANIES.md (은행 샘플 데이터)
│  │  │  ├─ BANKING_IMPLEMENTATION.md (구현 가이드)
│  │  │  └─ BANKING_COMPLETION_REPORT.md (완료 보고서)
│  │  │
│  │  ├─ /realestate
│  │  │  ├─ REALESTATE_EQUATIONS.md (부동산만의 추가 방정식)
│  │  │  ├─ REALESTATE_COMPANIES.md (부동산 샘플 데이터)
│  │  │  ├─ REALESTATE_IMPLEMENTATION.md (구현 가이드)
│  │  │  └─ REALESTATE_COMPLETION_REPORT.md (완료 보고서)
│  │  │
│  │  ├─ /manufacturing (추후 추가)
│  │  │  └─ ...
│  │  │
│  │  └─ /crypto (추후 추가)
│  │     └─ ...
│  │
│  ├─ /integration
│  │  ├─ BANKING_REALESTATE_INTEGRATION.md (은행↔부동산 통합)
│  │  └─ SCENARIOS.md (테스트 시나리오 모음)
│  │
│  └─ /reports
│     ├─ PHASE_1_COMPLETION.md (Phase 1 완료 보고서)
│     ├─ PHASE_2_PLAN.md (Phase 2 계획서)
│     └─ ...
│
└─ /src (코드)
   ├─ /shared
   │  ├─ core_equations.py (FUNDAMENTAL_EQUATIONS에서 구현)
   │  ├─ database.py (COMMON_DATA_MODEL에서 구현)
   │  └─ ...
   ├─ /sectors
   │  ├─ /banking
   │  ├─ /realestate
   │  └─ ...
   └─ ...
```

---

## 📄 각 문서의 역할

### Tier 1: 신규 팀원 필독

**GETTING_STARTED.md**
- 프로젝트가 뭔지
- 어디서 뭘 찾아야 하는지
- 첫 주에 이해해야 할 것

**PROJECT_STATUS.md** (매주 업데이트)
- 지금 어디까지 완료됐는지
- 이번 주 목표
- 블로킹 이슈

### Tier 2: 프로젝트 기초 (모든 팀이 참고)

**FUNDAMENTAL_EQUATIONS.md**
```
공통 방정식들 (모든 섹터이 사용)
├─ Equation 1.1: Macro Variable Impact (금리, 관세, 환율)
├─ Equation 2.1: Sector-Level Sensitivity
├─ Equation 3.1: Balance Sheet Identity
├─ Equation 3.2: Income Statement Structure
├─ Equation 3.3: Key Financial Ratios
├─ Equation 3.7: Rate Sensitivity (모든 회사)
└─ Equation 3.8: Cross-Sector Impact (모든 섹터간)

섹터별 추가 방정식:
├─ BANKING_EQUATIONS.md: Eq 3.2.1~3.2.8 (NIM, Provision)
├─ REALESTATE_EQUATIONS.md: Eq 3.2.1~4.2 (Property-level)
├─ MANUFACTURING_EQUATIONS.md: (추후)
└─ ...
```

**COMMON_DATA_MODEL.md**
```
공통 테이블/필드:
├─ macro_variables (모든 섹터)
├─ companies (모든 섹터)
├─ balance_sheets (모든 섹터)
├─ income_statements (모든 섹터)
├─ company_financials (모든 섹터)
└─ relationships (모든 섹터간)

섹터별 추가 테이블:
├─ BANKING: bank_loan_portfolios
├─ REALESTATE: properties
├─ MANUFACTURING: (추후)
└─ ...
```

**ONTOLOGY_FRAMEWORK.md**
```
4-레벨 온톨로지 (모든 섹터 동일 구조):

Level 1: Macro Variables (금리, 관세, 환율, 인플레이션)
Level 2: Sector-Specific Metrics (NIM, Occupancy, Capacity)
Level 3: Company-Level Details (3개 샘플 회사씩)
Level 4: Product/Asset-Level (Property, Loan, Product)

각 섹터는 이 구조를 따름 (추가만 함, 변경 없음)
```

### Tier 3: 섹터별 구현 (각 섹터팀이 참고)

**BANKING_EQUATIONS.md**
- 은행만의 추가 방정식 (Eq 3.2.1~3.2.8)
- FUNDAMENTAL_EQUATIONS의 기본 방정식들을 상속받음
- 예: NIM = (Interest Income - Interest Expense) / Assets

**BANKING_COMPANIES.md**
- 3개 샘플 은행 (신한, KB, 우리)
- 각 회사의 현재 재무 상태
- 금리 변화 시 예상 영향

**BANKING_IMPLEMENTATION.md**
- 구현 로드맵
- 코드 구조 (shared의 core_equations 사용)
- 테스트 케이스

**BANKING_COMPLETION_REPORT.md**
- 은행 구현 완료 후 작성
- 무엇이 완료됐는지
- 다음 섹터를 위한 교훈

### Tier 4: 통합 & 시나리오

**BANKING_REALESTATE_INTEGRATION.md**
- 은행과 부동산의 상호작용
- 금리 인상 시나리오
- 회사별 주가 예측

**SCENARIOS.md**
```
테스트 시나리오:
├─ Scenario 1: Rate ↑ 2.5% → 3.0%
├─ Scenario 2: Tariff ↑ 0% → 10%
├─ Scenario 3: RE Default Crisis
└─ ...
```

### Tier 5: 완료 보고서

**PHASE_1_COMPLETION.md**
- Phase 1 (Banking + RE) 완료 보고서
- 무엇을 배웠는지
- Phase 2를 위한 계획

---

## 🔄 공용 vs 섹터별 구분 규칙

### 공용 (shared/) - 한 번만 만들고, 모든 섹터이 상속

```
공용 유지:
✅ FUNDAMENTAL_EQUATIONS.md (기본 방정식 구조)
✅ COMMON_DATA_MODEL.md (기본 테이블)
✅ ONTOLOGY_FRAMEWORK.md (4-레벨 구조)
✅ ARCHITECTURE.md (전체 아키텍처)
✅ MACRO_VARIABLES.md (Macro level inputs)
✅ DATABASE_SCHEMA.md (공용 테이블 스키마)
✅ core_equations.py (공용 방정식 구현)
✅ database.py (공용 데이터 레이어)

규칙: "새로운 섹터 추가 시, 이 파일들은 UPDATE만 함 (추가만)"
```

### 섹터별 (sectors/[sector]/) - 각 섹터마다 만들고 추가하지 않음

```
섹터별 유지:
✅ BANKING_EQUATIONS.md (은행만의 추가 방정식)
✅ BANKING_COMPANIES.md (은행 샘플 데이터)
✅ BANKING_IMPLEMENTATION.md (은행 구현 가이드)
✅ BANKING_COMPLETION_REPORT.md (은행 완료 보고서)
❌ 이 파일들은 새로운 섹터 추가 시 복사/수정됨 (추가 아님)

Manufacturing 추가 시:
├─ MANUFACTURING_EQUATIONS.md (새로 생성)
├─ MANUFACTURING_COMPANIES.md (새로 생성)
├─ MANUFACTURING_IMPLEMENTATION.md (새로 생성)
└─ MANUFACTURING_COMPLETION_REPORT.md (새로 생성)
```

---

## 📊 현재 상태

### Phase 1: Banking + Real Estate Foundation

**완료된 공용 문서:**
- ✅ FUNDAMENTAL_EQUATIONS.md (기초 방정식 정의)
- ✅ COMMON_DATA_MODEL.md (기초 데이터 모델)
- ✅ ONTOLOGY_FRAMEWORK.md (4-레벨 온톨로지)
- ✅ MACRO_VARIABLES.md (매크로 변수 정의)

**완료된 섹터별 문서:**
- ✅ BANKING_EQUATIONS.md
- ✅ BANKING_COMPANIES.md
- ✅ REALESTATE_EQUATIONS.md
- ✅ REALESTATE_COMPANIES.md

**진행 중:**
- ⏳ BANKING_IMPLEMENTATION.md
- ⏳ REALESTATE_IMPLEMENTATION.md
- ⏳ BANKING_REALESTATE_INTEGRATION.md

**미작성:**
- ❌ BANKING_COMPLETION_REPORT.md (구현 완료 후)
- ❌ REALESTATE_COMPLETION_REPORT.md (구현 완료 후)
- ❌ PHASE_1_COMPLETION.md (전체 완료 후)

### Phase 2 이후: Manufacturing, Crypto, etc

**Template 준비:**
- [ ] MANUFACTURING_EQUATIONS.md (BANKING_EQUATIONS 구조 따름)
- [ ] MANUFACTURING_COMPANIES.md (BANKING_COMPANIES 구조 따름)
- [ ] ...

---

## 🎯 문서 작성 우선순위

### 이번주 (Week 1-2) - 기초 정리

1. **FUNDAMENTAL_EQUATIONS.md** ← 새로 정리 (지금까지의 공통 부분)
2. **COMMON_DATA_MODEL.md** ← 새로 정리
3. **ONTOLOGY_FRAMEWORK.md** ← 현 문서 기반 정리
4. **MACRO_VARIABLES.md** ← 새로 정리

### 다음주 (Week 2-3) - 섹터 정리

5. **BANKING_EQUATIONS.md** ← 현재 BANKING_CORE_EQUATIONS에서 추출
6. **BANKING_COMPANIES.md** ← 현재 BANKING_LEVEL3_COMPANIES에서 추출
7. **REALESTATE_EQUATIONS.md** ← 현재 REALESTATE_CORE_EQUATIONS에서 추출
8. **REALESTATE_COMPANIES.md** ← 현재 REALESTATE_LEVEL3_COMPANIES에서 추출

### 3주 이후 (Week 3+) - 구현

9. **BANKING_IMPLEMENTATION.md** ← 새로 작성
10. **REALESTATE_IMPLEMENTATION.md** ← 새로 작성
11. **BANKING_REALESTATE_INTEGRATION.md** ← 통합 시나리오

---

## 💡 이 구조의 장점

### 1. 명확한 책임 분담
- 공용 부분 = Core Team이 관리
- 섹터별 부분 = 각 Sector Team이 관리

### 2. 재사용성
```
Manufacturing 추가 시:
❌ 공용 문서들 다시 안 만듦 (이미 있음)
✅ Manufacturing 폴더만 추가
✅ MANUFACTURING_EQUATIONS.md만 작성 (BANKING 템플릿 따름)
```

### 3. 일관성
- 모든 섹터이 동일한 구조를 따름 (Level 1~4)
- 새로운 팀원이 빠르게 파악

### 4. 추적 가능성
- PROJECT_STATUS.md 한 파일로 전체 진행 상황 파악
- PHASE_1_COMPLETION.md로 완료 기준 명확

---

## 🚀 다음 액션

1. 기존 문서들을 위 구조에 맞게 **통합 및 정리**
   - REALESTATE_CORE_EQUATIONS + BANKING_CORE_EQUATIONS
     → FUNDAMENTAL_EQUATIONS + REALESTATE_EQUATIONS + BANKING_EQUATIONS

2. **공용 핵심 문서 작성** (이번 주)
   - FUNDAMENTAL_EQUATIONS.md
   - COMMON_DATA_MODEL.md

3. **섹터별 문서 정리** (다음 주)
   - BANKING_EQUATIONS.md
   - REALESTATE_EQUATIONS.md
   - 각각의 COMPANIES.md
   - 각각의 IMPLEMENTATION.md

4. **프로젝트 추적 문서 시작**
   - PROJECT_STATUS.md (매주 업데이트)
   - PHASE_1_COMPLETION.md (Phase 1 완료 후)

---

**이 구조로 관리하면, Manufacturing, Crypto 등 새로운 섹터 추가할 때**
**기존 공용 문서는 한 번 "업데이트"만 하고, 새 섹터 폴더만 추가하면 됨**
