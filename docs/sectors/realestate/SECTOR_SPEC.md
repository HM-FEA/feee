# Real Estate Sector Specification

**Sector ID:** realestate
**MVP Companies:** 3 (신한알파리츠, 이리츠코크렙, NH프라임리츠)
**Key Metrics:** ICR, Interest Expense, NOI
**Implementation Status:** ✅ Phase 1 Complete
**Last Updated:** 2025-11-01

---

## 📊 개요

### What is Real Estate?
부동산 투자회사(REIT)는 **부동산에서 나오는 순임대수익(NOI)**으로 유지되며, **차입금의 이자비용**이 수익성을 크게 좌우합니다.

금리가 올라가면:
- 💸 **이자비용**이 급증함
- 📉 **순이익**이 감소함 (임대수익은 고정)
- ⚠️ **ICR (Interest Coverage Ratio)**이 악화됨 → 부도 위험 증가
- 🏦 은행들이 이 회사에 대한 충당금 증가

### Why Include This Sector?
- **금리 변화에 반대 방향**: β = -0.50 (금리↑ → 수익↓)
- **Cross-Sector 영향**: 은행의 신용위험 증가
- **부도 위험 현실화**: 극단적 금리 인상 시 실제 부도 가능성
- **대조 구조**: Banking과 정반대로 움직여 리스크 분산 학습 가능

---

## 🎯 Key Metrics (Level 2)

### Metric 1: ICR (Interest Coverage Ratio)
```
정의: 이자 부담 능력 = EBITDA / Interest Expense

의미:
  ICR > 2.5x: Safe (여유있게 이자 지급 가능)
  ICR 2.0-2.5x: Caution (주의 필요)
  ICR < 2.0x: Risk (이자 지급 어려움)
  ICR < 1.0x: Default (완전 부도 - 이자도 못 냄)

금리 변화 영향:
  금리 ↑ → Interest Expense ↑ → ICR ↓

예시 (이리츠 - 위험):
  Before: ICR = 5B EBITDA / 6.25B Interest = 0.8x (이미 위험)
  After (금리 ↑0.5%): 5B / 7.5B = 0.67x (더 악화)
```

### Metric 2: Interest Expense (이자비용)
```
정의: 차입금에 대한 이자 = Debt × Interest_Rate

계산식:
  Interest_Expense = Debt × interest_rate

금리 변화 민감도:
  ΔInterest_Expense = Debt × Δinterest_rate

예시:
  이리츠: Debt 250B, 금리 2.5% → 3.0%

  Current: 250B × 2.5% = 6.25B
  New: 250B × 3.0% = 7.5B
  Δ = +1.25B (+20%)
```

### Metric 3: NOI (Net Operating Income)
```
정의: 순임대수익 = 임대수익 - 운영비용

특징:
  ✓ 금리 변화에 영향 받지 않음 (고정)
  ✗ 임대인 변화에 민감함

예시:
  이리츠: NOI = 임대수익 - 관리비 - 유지비 = 5B (고정)
  금리 인상으로 변하지 않음
```

---

## 📐 Real Estate 추가 방정식 (Level 2)

### Equation R1: Interest Expense Change

```
ΔInterest_Expense = Debt × Δinterest_rate

금리 2.5% → 3.0% 시나리오:
  Δrate = +0.5% = +0.005

신한알파리츠:
  Debt: 290B
  ΔInterest_Expense = 290B × 0.5% = 1.45B

이리츠:
  Debt: 250B
  ΔInterest_Expense = 250B × 0.5% = 1.25B

NH프라임:
  Debt: 75B
  ΔInterest_Expense = 75B × 0.5% = 0.375B
```

### Equation R2: Tax Benefit from Interest Deduction

```
세법 규정에 따라 이자비용은 세전이익에서 공제됨

ΔTax_Benefit = ΔInterest_Expense × tax_rate

일반적으로 tax_rate = 25% (법인세)

예시 (이리츠):
  ΔInterest_Expense = 1.25B
  ΔTax_Benefit = 1.25B × 25% = 0.3125B
```

### Equation R3: Net Income Change (통합)

```
ΔNI_RealEstate = -ΔInterest_Expense + ΔTax_Benefit
                = -ΔInterest_Expense × (1 - tax_rate)

금리 2.5% → 3.0% 시나리오:

신한알파리츠:
  ΔNI = -1.45B × (1 - 0.25) = -1.09B
  NI: 4.48B → 3.39B (-24.3%) ⚠️

이리츠:
  ΔNI = -1.25B × (1 - 0.25) = -0.94B
  NI: 1.88B → 0.94B (-50%) 🔴

NH프라임:
  ΔNI = -0.375B × (1 - 0.25) = -0.28B
  NI: 4.60B → 4.32B (-6.1%) ✅

모든 REIT: 금리↑ → 수익↓ ⚠️
```

### Equation R4: ICR Change

```
ΔInterest_Expense → ΔICR

ΔICR = EBITDA / (Interest_Expense + ΔInterest_Expense)
     - EBITDA / Interest_Expense

예시 (이리츠):
  EBITDA: 5B (고정)
  Interest_Expense: 6.25B → 7.5B

  Current ICR: 5B / 6.25B = 0.8x
  New ICR: 5B / 7.5B = 0.67x
  ΔICR = 0.67 - 0.8 = -0.13x

  상태: RISK (< 2.0x) - 더 위험해짐
```

---

## 💼 샘플 데이터 (3개 REIT)

| REIT | Debt | EBITDA | Current Interest | Current NI | Current ICR | Leverage |
|------|------|--------|------------------|------------|-------------|----------|
| 신한알파리츠 | 290B | 13.29B | 7.25B | 4.48B | 1.83x | 50% |
| 이리츠코크렙 | 250B | 5B | 6.25B | 1.88B | 0.8x | 62.5% |
| NH프라임리츠 | 75B | 8B | 1.875B | 4.60B | 4.27x | 25% |

**주석:**
- **Debt:** 차입금 규모
- **EBITDA:** 임대수익 - 운영비
- **Leverage:** Debt / Total Assets 비율
  - 50% 이상: 고위험 (이자비용 많음)
  - 25-50%: 중위험
  - 25% 이하: 저위험

---

## 🔄 Macro → Real Estate 영향도

### Interest Rate 변화

```
금리 2.5% → 3.0% 시나리오

신한알파리츠 (50% 차입):
  ├─ Interest Expense ↑: 7.25B → 8.70B (+1.45B)
  ├─ Tax Benefit: +0.36B
  ├─ Net Impact: -1.09B
  ├─ NI: 4.48B → 3.39B (-24.3%)
  └─ ICR: 1.83x → 1.53x (CAUTION → RISK)

이리츠코크렙 (62.5% 차입 - 고위험):
  ├─ Interest Expense ↑: 6.25B → 7.50B (+1.25B)
  ├─ Tax Benefit: +0.31B
  ├─ Net Impact: -0.94B
  ├─ NI: 1.88B → 0.94B (-50%)
  └─ ICR: 0.8x → 0.67x (RISK - 부도위험 높음!)

NH프라임 (25% 차입 - 안전):
  ├─ Interest Expense ↑: 1.875B → 2.25B (+0.375B)
  ├─ Tax Benefit: +0.09B
  ├─ Net Impact: -0.28B
  ├─ NI: 4.60B → 4.32B (-6.1%)
  └─ ICR: 4.27x → 3.56x (SAFE 유지)

결론:
  - 고차입 REIT는 부도 위험 급증
  - 저차입 REIT는 안정적
  - 금리 인상 시 구조조정 압박
```

---

## 🎓 Cross-Sector Impact (Real Estate ↔ Banking)

### Real Estate → Banking (신용위험)

```
REIT 부도위험 증가 (ICR 악화)
  ↓
REIT 차용금 상환 위험 증가
  ↓
은행의 REIT 대출 부도위험 증가
  ↓
은행이 충당금 증가
  ↓
은행 순이익 감소 (하지만 NIM 이득이 크면 상쇄)

수치 예시:
  신한은행 이리츠 대출: 200B
  이리츠 부도 확률: 5% → 15% (증가)
  은행 expected loss: 10B → 30B
  → 신한은행이 추가 충당금 20B 적립
```

---

## ✅ 검증 기준

### Test 1: Interest Expense Increase
```
Input: interest_rate 2.5% → 3.0%
Expected: All REITs' Interest Expense ↑
Actual:
  신한알파: 7.25B → 8.70B ✓
  이리츠: 6.25B → 7.50B ✓
  NH: 1.875B → 2.25B ✓
Result: ✅ PASS
```

### Test 2: NI Decrease
```
Input: Interest Expense ↑ (NOI 고정)
Expected: All REITs' NI ↓
Actual:
  신한알파: 4.48B → 3.39B ✓
  이리츠: 1.88B → 0.94B ✓
  NH: 4.60B → 4.32B ✓
Result: ✅ PASS
```

### Test 3: ICR Deterioration
```
Input: Interest Expense ↑
Expected: All REITs' ICR ↓
Actual:
  신한알파: 1.83x → 1.53x ✓
  이리츠: 0.8x → 0.67x ✓
  NH: 4.27x → 3.56x ✓
Result: ✅ PASS

특히 이리츠는 이미 부도 위험(ICR < 1.0x)
```

### Test 4: Cross-Sector (Banking ↔ Real Estate)
```
Input: 이리츠 ICR 악화, 신한은행이 200B 대출
Expected: 신한은행 provision ↑
Actual: 이리츠 부도확률 증가로 신한은행 expected loss ↑
Result: ✅ PASS (양쪽 모두 영향 받음)
```

---

## 🔗 관련 문서

- **CORE_FRAMEWORK.md** (공용 9개 방정식)
- **LEVEL1_MACRO.md** (금리, 관세 등)
- **LEVEL2_SECTOR.md** (섹터 민감도 β값)
- **LEVEL3_COMPANY.md** (회사 재무 표준)
- **LEVEL4_ASSET.md** (부동산 자산 포트폴리오)
- **SAMPLE_DATA.md** (3개 REIT 상세 데이터)

---

## 💻 구현 위치

**Backend:**
- `services/market-data-api/app/main.py` (현재 구현됨)
- 추가 예정: `services/market-data-api/sectors/realestate_calculator.py`

**Frontend:**
- `apps/web/src/app/rate-simulator/page.tsx` (결과 표시)
- `apps/web/src/app/company/[id]/circuit-diagram/page.tsx` (부동산 자산 포트폴리오 시각화 - 향후)

---

## 🔮 다음 단계

### Phase 2 (진행 중)
- ✅ Circuit Diagram (Banking + Real Estate)
- ⏳ 3D Network Graph (은행 ↔ REIT 관계)
- ⏳ Analyst Report Agent

### Phase 3 (향후)
- Manufacturing Sector (관세 민감도)
- Options Sector (변동성 민감도)
- Crypto Sector (규제 민감도)
- S&P 500 / KOSPI (전체 시장)

---

**SECTOR_TEMPLATE.md를 따르면 위의 모든 섹터를 확장할 수 있습니다!**
