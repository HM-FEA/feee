# Manufacturing Sector Specification

**Purpose:** Manufacturing 섹터의 거시경제 영향 모델링
**Status:** ✅ Phase 3 구현 시작
**Last Updated:** 2025-11-01

---

## 🏭 Manufacturing Sector 개요

### 섹터 특성

Manufacturing은 다음 특성을 가집니다:

- **핵심 지표**: Capacity Utilization, COGS, Operating Margin
- **Macro 민감도**: 관세(Tariff), GDP Growth, 환율(FX Rate)
- **레벨 4 자산**: 생산 시설(Facilities), 생산 능력(Capacity)
- **핵심 위험**: 원자재 가격, 환율 변동, 수요 부진

### 샘플 회사 (Phase 3)

```
삼성전자 (Samsung Electronics)
├─ 섹터: Manufacturing (Semi, Electronics)
├─ 주요 제품: DRAM, NAND, Display
├─ 글로벌 수출 의존도: 95%
└─ 관세 민감도: 매우 높음

SK하이닉스 (SK Hynix)
├─ 섹터: Manufacturing (Semi)
├─ 주요 제품: DRAM, NAND
├─ 글로벌 수출 의존도: 90%
└─ 관세 민감도: 매우 높음

LG전자 (LG Electronics)
├─ 섹터: Manufacturing (Consumer Electronics)
├─ 주요 제품: TV, Appliances, Display
├─ 글로벌 수출 의존도: 85%
└─ 관세 민감도: 높음
```

---

## 📊 Manufacturing 특화 지표

### 1. Capacity Utilization (생산능력 가동률)

**정의**: 실제 생산 / 최대 생산 능력

```
Capacity_Utilization = Current_Production / Maximum_Capacity × 100%
```

**범위**: 40% ~ 95%
**기본값**: 80%

**영향**:
- Capacity ↑ → 수익성 ↑ (고정비용 분산)
- Capacity ↓ → 수익성 ↓ (고정비용 증가)

### 2. Cost of Goods Sold (COGS) - 원가율

**정의**: 판매된 제품의 직접비용 / 매출액

```
COGS_Ratio = Total_COGS / Revenue × 100%
```

**범위**: 50% ~ 75%
**기본값**: 65%

**영향 요소**:
- 관세 인상 → COGS ↑ (수입 원자재)
- 환율 약세 → COGS ↑ (해외 수입 재료)

### 3. Operating Margin (영업이익률)

**정의**: 영업이익 / 매출

```
Operating_Margin = (Revenue - COGS - OpEx) / Revenue × 100%
```

**범위**: 5% ~ 20%
**기본값**: 12%

---

## 📐 Manufacturing 추가 방정식 (Eq M1-M4)

### Equation M1: Tariff Impact on COGS

```
ΔCogs = Revenue × (base_cogs_ratio + tariff_rate × import_exposure)

Where:
- tariff_rate: 추가 관세율 (%)
- import_exposure: 수입 원재료 비중 (0~1)

Example:
- Revenue: 50T
- base_cogs_ratio: 65%
- tariff_rate: +10% (US tariff)
- import_exposure: 0.70 (70% 수입 재료)

ΔCogs = 50T × (0.65 + 0.10 × 0.70)
      = 50T × 0.72
      = 36T (COGS 증가)
```

### Equation M2: Capacity Utilization Impact

```
ΔOperatingIncome = (CapacityIncrease × margin_per_unit)
                 - (CapacityIncrease × additional_fixed_cost)

Where:
- CapacityIncrease: 추가 생산량 (단위: 조)
- margin_per_unit: 단위당 마진
- additional_fixed_cost: 추가 고정비

Example:
- 가동률 80% → 90% 상향
- margin_per_unit: 10B/unit
- additional_fixed_cost: 2B/unit

ΔOperatingIncome = 10 × (10B - 2B) = 80B 추가 이익
```

### Equation M3: FX Rate Impact

```
ΔFX_Impact = Revenue × export_ratio × (current_rate - base_rate) / base_rate

Where:
- export_ratio: 수출 비중 (0~1)
- current_rate: 현재 환율 (KRW/USD)
- base_rate: 기준 환율 (1,200 KRW/USD)

Example:
- Revenue: 50T
- export_ratio: 90%
- current_rate: 1,100 KRW/USD (원화 강세)
- base_rate: 1,200

ΔFX_Impact = 50T × 0.90 × (1,100 - 1,200) / 1,200
           = 45T × (-0.0833)
           = -3.75T (수익 감소)
```

### Equation M4: Net Income Change (综合)

```
ΔNI_Manufacturing = -ΔCOGS
                  + ΔOperatingIncome
                  + ΔFX_Impact
                  - Δ(Tax × effective_tax_rate)

Where:
- effective_tax_rate: 실효세율 (25%)
```

---

## 🔗 LEVEL1_MACRO과의 연결

### 관세율 (Tariff Rate) - LEVEL1에서 정의

**변수**: `tariff_rate`
**범위**: 0% ~ 25%
**기본값**: 0%

**Manufacturing 섹터에 미치는 영향**:

```
Eq 1.1 (Macro → Sector):

Tariff_Beta_Manufacturing = -0.75

Manufacturing_Impact = Tariff_Beta × Δ(Tariff_Rate)
                     = -0.75 × Δ(Tariff_Rate)

Example:
- 미국 대선 후 중국 제품 관세 25% 인상
- ΔTariff_Rate = +25%
- Manufacturing_Impact = -0.75 × 25% = -18.75%

→ 삼성, SK하이닉스 등의 순이익 감소
```

### GDP Growth Rate - LEVEL1에서 추가 시

**변수**: `gdp_growth_rate`
**범위**: -10% ~ +10%
**기본값**: 3%

**Manufacturing 섹터에 미치는 영향**:

```
GDP_Beta_Manufacturing = +0.80

Manufacturing_Impact = GDP_Beta × Δ(GDP_Growth)
                     = +0.80 × Δ(GDP_Growth)

Example:
- 경기 호황 예상
- ΔGdp_Growth = +2%
- Manufacturing_Impact = +0.80 × 2% = +1.6%

→ 수요 증가, 판매량 증가, 가동률 상향
```

### 환율 (FX Rate) - LEVEL1에서 정의

**변수**: `fx_rate` (KRW/USD)
**범위**: 1,000 ~ 1,500
**기본값**: 1,200

**Manufacturing 섹터에 미치는 영향**:

```
FX_Beta_Manufacturing = +0.50 (원화 약세 = 수익 증가)

Example:
- 환율 1,200 → 1,300 (원화 약세)
- Δ환율_pct = (1,300 - 1,200) / 1,200 = 8.3%
- Manufacturing_Impact = +0.50 × 8.3% = +4.15%

→ 수출 경쟁력 증가, 판매 증가
```

---

## 💰 샘플 데이터 (Phase 3)

### 삼성전자 (Samsung Electronics)

```yaml
company_id: SAMSUNG
sector: MANUFACTURING
name: 삼성전자

Financial Metrics:
  Revenue: 280조
  COGS: 180조 (64.3%)
  Operating Expense: 50조
  Operating Income: 50조 (17.9%)
  Current NI: 35조

Manufacturing Metrics:
  Capacity: 1,000 units/quarter
  Current Production: 800 units (80% utilization)
  Margin per Unit: 50B
  Import Exposure: 70% (글로벌 supply chain)
  Export Ratio: 95%

Risk Profile:
  Tariff Sensitivity: 높음 (-18% per 25% tariff hike)
  FX Sensitivity: 높음 (+4% per 10% KRW weakening)
  Capacity Risk: 중간 (10년 된 시설)
```

### SK하이닉스 (SK Hynix)

```yaml
company_id: SK_HYNIX
sector: MANUFACTURING
name: SK하이닉스

Financial Metrics:
  Revenue: 70조
  COGS: 42조 (60%)
  Operating Expense: 12조
  Operating Income: 16조 (22.9%)
  Current NI: 12조

Manufacturing Metrics:
  Capacity: 500 units/quarter
  Current Production: 450 units (90% utilization)
  Margin per Unit: 30B
  Import Exposure: 65%
  Export Ratio: 92%

Risk Profile:
  Tariff Sensitivity: 매우 높음 (-20% per 25% tariff hike)
  FX Sensitivity: 높음 (+3.5% per 10% KRW weakening)
  Capacity Risk: 낮음 (최신 시설, 지속 투자)
```

### LG전자 (LG Electronics)

```yaml
company_id: LG_ELEC
sector: MANUFACTURING
name: LG전자

Financial Metrics:
  Revenue: 85조
  COGS: 60조 (70.6%)
  Operating Expense: 15조
  Operating Income: 10조 (11.8%)
  Current NI: 8조

Manufacturing Metrics:
  Capacity: 300 units/quarter
  Current Production: 270 units (90% utilization)
  Margin per Unit: 25B
  Import Exposure: 75% (높은 수입 의존도)
  Export Ratio: 85%

Risk Profile:
  Tariff Sensitivity: 높음 (-16% per 25% tariff hike)
  FX Sensitivity: 중간 (+2.5% per 10% KRW weakening)
  Capacity Risk: 중간 (노후 시설 포함)
```

---

## 🔄 Cross-Sector Impact (Manufacturing → Banking)

### Scenario: US Tariff 25% 인상

```
1️⃣ Manufacturing 직접 영향
   - 삼성전자: -18% → ₩35T → ₩28.7T (-₩6.3T)
   - SK하이닉스: -20% → ₩12T → ₩9.6T (-₩2.4T)
   - LG전자: -16% → ₩8T → ₩6.7T (-₩1.3T)

2️⃣ Banking 간접 영향 (대출 포트폴리오 스트레스)
   ⚠️  Manufacturing 차입자들의 부도 위험 증가

   신한은행 (Manufacturing 노출: 15%)
   ├─ Manufacturing 고객 대출: 30T
   ├─ 예상 부도율: 3% → 8%
   ├─ 추가 충당금: 1.5T
   └─ 순이익 감소: -1.5T

3️⃣ Real Estate 간접 영향 (건설업체 수요 악화)
   - Manufacturing 기업들의 자본지출 감소
   - 건설 수요 감소
   - REIT의 자산가치 하락

⚠️  Cross-sector contagion 위험!
```

---

## 📈 시나리오 분석

### Scenario 1: 관세 0% (기준선)

```
삼성전자:
├─ 매출: 280조
├─ COGS: 180조
├─ 순이익: 35조
└─ 가동률: 80%

SK하이닉스:
├─ 매출: 70조
├─ COGS: 42조
├─ 순이익: 12조
└─ 가동률: 90%

LG전자:
├─ 매출: 85조
├─ COGS: 60조
├─ 순이익: 8조
└─ 가동률: 90%
```

### Scenario 2: US Tariff +25%

```
삼성전자:
├─ ΔCogs: +25% × 0.70 = +18% → COGS = 212조
├─ 순이익: 35조 → 24.5조 (-31%)
├─ 가동률: 80% → 72% (수요 감소)
└─ 상태: 🔴 위험

SK하이닉스:
├─ ΔCogs: +25% × 0.65 = +16.25% → COGS = 48.8조
├─ 순이익: 12조 → 8.5조 (-29%)
├─ 가동률: 90% → 82%
└─ 상태: 🔴 위험

LG전자:
├─ ΔCogs: +25% × 0.75 = +18.75% → COGS = 71.25조
├─ 순이익: 8조 → 4.5조 (-44%)
├─ 가동률: 90% → 75%
└─ 상태: 🔴 심각한 위험
```

### Scenario 3: 원화 약세 (1,200 → 1,400 KRW/USD)

```
환율 강세 효과 (+16.7%):

삼성전자:
├─ 수출 경쟁력 증가: Revenue +8% → 303조
├─ COGS: 변동 없음 (국내 생산 비중 30%)
├─ 순이익: 35조 → 44조 (+25%)
└─ 상태: ✅ 긍정

SK하이닉스:
├─ 수출 경쟁력 증가: Revenue +7.7% → 75.4조
├─ 순이익: 12조 → 16.2조 (+35%)
└─ 상태: ✅ 매우 긍정

LG전자:
├─ 수출 경쟁력 증가: Revenue +6.8% → 90.8조
├─ 순이익: 8조 → 11조 (+37%)
└─ 상태: ✅ 긍정
```

---

## 🔌 Integration with LEVEL1_MACRO.md

### Manufacturing β값 (Eq 1.1)

```markdown
## Manufacturing Sector β Values

### Tariff Rate → Manufacturing
- β = -0.75 (관세 1% 인상 → 순이익 -0.75%)
- 메커니즘: COGS 증가 (수입 원재료)

### GDP Growth → Manufacturing
- β = +0.80 (경기 1% 상향 → 순이익 +0.80%)
- 메커니즘: 수요 증가, 가동률 상향

### FX Rate (KRW/USD) → Manufacturing
- β = +0.50 (원화 약세 1% → 순이익 +0.50%)
- 메커니즘: 수출 경쟁력 증가

### Inflation Rate → Manufacturing
- β = -0.40 (인플레이션 1% → 순이익 -0.40%)
- 메커니즘: 임금, 에너지 비용 증가, COGS ↑

### Credit Spread → Manufacturing
- β = -0.25 (스프레드 1% → 순이익 -0.25%)
- 메커니즘: 차입비용 증가
```

---

## 📋 Implementation Checklist (Phase 3)

```
☐ Backend:
  ☐ calculate_manufacturing_impact() 함수 구현
  ☐ SAMPLE_COMPANIES에 삼성, SK, LG 추가
  ☐ /api/simulator/tariff-change 엔드포인트 추가
  ☐ Cross-sector 영향 계산 로직

☐ Frontend:
  ☐ Manufacturing Scenario 페이지 추가
  ☐ Tariff Simulator UI
  ☐ 3 companies 비교 차트

☐ Documentation:
  ☐ LEVEL2_SECTOR.md Manufacturing 섹션 추가
  ☐ Cross-sector impact 모델 문서화

☐ Testing:
  ☐ Tariff 0% → 25% 시나리오 테스트
  ☐ 환율 1,200 → 1,400 시나리오 테스트
  ☐ Cross-sector contagion 검증
```

---

## 🎯 Why Manufacturing (Phase 3)?

1. **확장성 검증**: 새로운 Macro Variable (관세) 추가 테스트
2. **Cross-Sector 관계**: Manufacturing → Banking (신용 위험)
3. **글로벌 경제**: 무역, 환율, 관세 시뮬레이션
4. **현실성**: 한국 산업의 핵심 (반도체, 전자)

---

**다음 단계**: Phase 3 백엔드 구현 (calc_manufacturing_impact, tariff-change API)
