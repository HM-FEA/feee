# ⚡ START HERE - Nexus-Alpha

**새 Claude Code 세션 시작 시 이 파일부터 읽으세요**
**Last Updated:** 2025-11-01

---

## 🎯 프로젝트 목표

**경제 온톨로지 플랫폼**
- 금리/관세 변화 → 섹터 영향 → 기업 영향 → 주가 예측
- 은행 vs 부동산: 금리↑ → 은행은 이득(+8%), 부동산은 손해(-25%)
- 기업 간 관계 모델링: 부동산 부실 → 은행 provision 증가

---

## 📚 문서는 딱 4개만

```
/nexus-alpha
│
├─ START_HERE.md ⭐ 지금 이 파일 (여기서 시작)
├─ PROJECT_STATUS.md ⭐ 진행 상황 (매주 업데이트)
├─ CORE_FRAMEWORK.md ⭐ 기술 기초 (4-Level + 방정식)
└─ README.md (기존 프로젝트 소개)
```

---

## 🏗️ 4-Level 온톨로지란?

모든 경제 분석은 이 4단계로 이루어짐:

```
Level 1: Macro Variables (매크로 변수)
├─ 예: 금리 2.5% → 3.0% 인상
├─ 예: 관세 0% → 10% 인상
└─ 영향: 전체 경제, 모든 섹터
      ↓

Level 2: Sector (섹터)
├─ Banking: NIM(순이자마진) ↑ → 수익 ↑
├─ Real Estate: 이자비용 ↑ → 수익 ↓
└─ Manufacturing: 관세 ↑ → 수익 ↓
      ↓

Level 3: Company (개별 회사)
├─ 신한은행: NI 2.52조 → 2.85조 (+13%)
├─ 신한알파리츠: NI 4.48B → 3.44B (-23%)
└─ 이리츠코크렙: NI 1.88B → -0.50B (부도!)
      ↓

Level 4: Asset/Product (자산/제품)
├─ Banking: 개별 대출 (이리츠에 대출 200B)
├─ Real Estate: 개별 부동산 (서울 오피스 빌딩)
└─ Manufacturing: 개별 제품 (아이폰 부품)
```

---

## ⚡ 5분 Quick Start

### 1단계: 현재 상태 확인
```bash
cat PROJECT_STATUS.md
```
→ Phase 1 완료 여부, 다음 작업 확인

### 2단계: 기술 기초 이해 (필요 시)
```bash
cat CORE_FRAMEWORK.md
```
→ 9개 공용 방정식, 데이터베이스 스키마

### 3단계: 작업 시작!

**Phase 1 (Foundation) 완료됨:**
- ✅ 4-Level 온톨로지 정의
- ✅ Banking + Real Estate 방정식 (총 16개)
- ✅ 샘플 데이터 (6개 회사)
- ✅ 통합 시나리오

**Phase 2 (Implementation) 시작 대기:**
- [ ] 데이터베이스 구축
- [ ] Quant 엔진 구현
- [ ] 시각화 구현

---

## 📊 핵심 인사이트 (금리 인상 예시)

### 시나리오: 금리 2.5% → 3.0% (+0.5%)

**은행 (승자):**
```
우리은행:   +10% (부동산 노출 15% - 낮음)
신한은행:   +8%  (부동산 노출 25% - 균형)
KB금융:     -5%  (부동산 노출 30% - 높음)

이유: 순이자마진(NIM) 확대
- 대출금리 ↑↑ (빠르게 인상)
- 예금금리 ↑ (천천히 인상)
- 차이(NIM)가 벌어짐 → 수익 ↑
```

**부동산 (패자):**
```
NH프라임:   -8%  (차입 25% - 안전)
신한알파:   -23% (차입 50% - 위험)
이리츠:     -40% (차입 62.5% - 부도 위험!)

이유: 이자비용 증가
- 임대수익 동일 (변화 없음)
- 이자비용 ↑ (급증)
- 순이익 ↓
```

**Cross-Sector 영향:**
```
이리츠 부도 위험 ↑
    ↓
신한은행의 이리츠 대출 200B
    ↓
은행 provision(충당금) ↑
    ↓
은행 순이익 일부 감소

BUT: NIM 확대 > Provision 증가
→ 결과적으로 은행은 여전히 이득
```

---

## 📁 더 자세한 정보가 필요하면?

### Banking 섹터 상세
```bash
cat /Users/jeonhyeonmin/Simulation/nexus-alpha/docs/implementation/BANKING_CORE_EQUATIONS.md
```

### Real Estate 섹터 상세
```bash
cat /Users/jeonhyeonmin/Simulation/nexus-alpha/docs/implementation/REALESTATE_CORE_EQUATIONS.md
```

### 통합 시나리오 (금리 인상)
```bash
cat /Users/jeonhyeonmin/Simulation/nexus-alpha/docs/implementation/REALESTATE_BANKING_INTEGRATION.md
```

### 데이터베이스 스키마
```bash
cat /Users/jeonhyeonmin/Simulation/nexus-alpha/docs/implementation/REALESTATE_BANKING_DATA_SCHEMA.md
```

---

## 🚀 새 섹터 추가 시 (예: Manufacturing)

### 규칙
1. **공용은 추가만** (CORE_FRAMEWORK.md)
2. **섹터별은 새로 생성** (/docs/sectors/manufacturing/)
3. **4-Level 구조 동일** (Level 1~4 그대로)

### 프로세스
```
1. CORE_FRAMEWORK.md에 Level 2 섹터 지표 추가
   → Capacity Utilization, Labor Cost Index 등

2. /docs/sectors/manufacturing/ 폴더 생성

3. SECTOR_SPEC.md 작성
   → Banking/Real Estate 템플릿 따름

4. PROJECT_STATUS.md 업데이트
```

---

## ✅ 체크리스트

**새 세션 시작:**
- [ ] `START_HERE.md` 읽음 (이 파일)
- [ ] `PROJECT_STATUS.md` 확인 (진행 상황)
- [ ] `CORE_FRAMEWORK.md` 참고 (필요 시)
- [ ] 시작!

**Phase 2 구현 시작:**
- [ ] 데이터베이스 설치 (PostgreSQL)
- [ ] `/docs/shared/` 폴더 생성
- [ ] Level 1~4 문서 작성
- [ ] core_equations.py 구현

---

## 🎯 핵심 방정식 (9개 공용)

모든 섹터가 사용:
```
Eq 1.1: Macro → Sector Impact
Eq 2.1: Sector Sensitivity
Eq 3.1: Balance Sheet Identity (Assets = Liabilities + Equity)
Eq 3.2: Income Statement (NI = Revenue - Expenses - Interest - Tax)
Eq 3.3: Key Ratios (ICR, D/E, ROA, ROE)
Eq 3.7: Rate Sensitivity Analysis
Eq 3.8: Cross-Sector Impact
Eq 4.1: Asset Profitability
Eq 4.2: Debt Allocation
```

섹터별 추가:
- Banking: 8개 (NIM, Provision 등)
- Real Estate: 8개 (Property NOI, ICR 등)

---

## 📞 다음 액션

**지금 바로:**
```bash
cat PROJECT_STATUS.md
```

**구현 시작 전:**
```bash
cat CORE_FRAMEWORK.md
```

**상세 정보:**
```bash
ls /Users/jeonhyeonmin/Simulation/nexus-alpha/docs/implementation/
```

---

**이 파일 하나로 프로젝트 시작 가능!**
