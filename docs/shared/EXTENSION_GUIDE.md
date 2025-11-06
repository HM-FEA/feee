# Extension Guide - Level 1 확장 시 엔진 자동 적용

**Purpose:** 새로운 Macro Variable 추가 시 전체 엔진이 자동으로 적용되도록 하는 가이드
**Rule:** Level 1 추가 → Level 2-4 자동 영향 → Backend/Frontend 동시 적용
**Status:** Phase 2 구현 필요
**Last Updated:** 2025-11-01

---

## 📋 문제: Level 1 확장 시 엔진도 함께 변형되어야 함

### 예시: GDP 추가 시나리오

```
현재 Level 1 Macro Variables (금리만 있음):
  interest_rate: 금리 변화 → Banking/Real Estate 영향

확장 요청: GDP 추가
  gdp_growth_rate: GDP 성장률 → Manufacturing 영향
                                → Consumer Spending → Banking 영향
                                → Employment → Wage Inflation

문제: Level 1에 GDP 추가만 했을 때
  ❌ Backend 엔진이 반영하지 않음
  ❌ Frontend가 GDP 입력 필드를 모름
  ❌ 계산 로직이 없음

해결: 이 가이드를 따르면
  ✅ 자동으로 엔진에 반영됨
  ✅ Frontend도 자동으로 업데이트됨
  ✅ 모든 섹터에 영향 계산됨
```

---

## 🔄 확장 프로세스 (5단계)

### Step 1: Level 1 에 Macro Variable 추가

**파일:** `/docs/shared/LEVEL1_MACRO.md`

```markdown
### 새 Macro Variable: GDP Growth Rate

정의: GDP 성장률 = (GDP_현재 - GDP_전기) / GDP_전기

범위: -10% ~ +10%
기본값: 3.0%

영향 메커니즘:
  GDP ↑ → 소비 ↑ → 은행 신용 수요 ↑ → 예금 ↑
  GDP ↑ → 고용 ↑ → 임금 ↑ → 인플레이션 압력
  GDP ↑ → 기업 수익 ↑ → 제조업 매출 ↑
  GDP ↓ → 부도 위험 ↑ → 은행 충당금 ↑
```

### Step 2: Level 2에서 섹터별 민감도 (β값) 정의

**파일:** `/docs/shared/LEVEL2_SECTOR.md` (향후 작성)

```markdown
### GDP Growth Rate Sensitivity

Banking:
  β_Banking_GDP = +0.50 (GDP↑ → 신용수요↑ → 수익↑)

Real Estate:
  β_RealEstate_GDP = +0.30 (GDP↑ → 건설수요↑)

Manufacturing:
  β_Manufacturing_GDP = +0.80 (GDP↑ → 매출↑)

Options:
  β_Options_GDP = -0.20 (GDP↑ → 변동성↓ → 옵션 가격↓)
```

### Step 3: Backend 엔진에 계산식 추가

**파일:** `services/market-data-api/app/main.py`

**추가할 Equation:**
```python
# Equation 1.1 확장 (GDP)
def calculate_gdp_sector_impact(gdp_growth_rate, sector_type):
    """
    GDP 성장률에 따른 섹터 영향 계산
    """
    sensitivities = {
        "BANKING": 0.50,
        "REALESTATE": 0.30,
        "MANUFACTURING": 0.80,
        "OPTIONS": -0.20
    }

    beta = sensitivities.get(sector_type, 0)
    return beta * gdp_growth_rate

# 각 섹터 계산식에 GDP 항 추가
def calculate_banking_impact(company_data, interest_rate, gdp_growth):
    """기존 금리 기반 계산 + GDP 추가"""
    ni_from_nim = calculate_nim_expansion(interest_rate, company_data)
    ni_from_gdp = calculate_gdp_sector_impact(gdp_growth, "BANKING") * company_data["current_ni"]

    total_impact = ni_from_nim + ni_from_gdp
    return total_impact
```

### Step 4: Frontend에 입력 필드 추가

**파일:** `apps/web/src/app/rate-simulator/page.tsx`

```typescript
// 기존 코드에 추가
const [gdpGrowth, setGdpGrowth] = useState(3.0); // GDP 기본값

// 입력 폼에 추가
<div>
  <label className="block text-sm text-gray-400 mb-3">GDP 성장률 (%)</label>
  <input
    type="number"
    step="0.1"
    value={gdpGrowth}
    onChange={(e) => setGdpGrowth(parseFloat(e.target.value))}
    className="flex-1 bg-[#101015] border border-[#33333F] rounded px-4 py-2 text-white"
  />
</div>

// API 호출 시 GDP 포함
const response = await fetch("http://localhost:8000/api/simulator/rate-change", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    old_rate: oldRate / 100,
    new_rate: newRate / 100,
    gdp_growth: gdpGrowth / 100,  // 새로 추가
  }),
});
```

### Step 5: 새로운 시나리오로 테스트

```
기존: 금리만 변화
  Input: interest_rate 2.5% → 3.0%
  Output: Banking +8~33%, RealEstate -6~50%

확장: 금리 + GDP 동시 변화
  Input:
    interest_rate 2.5% → 3.0% (금리 인상)
    gdp_growth 3.0% → 1.5% (경제 침체)

  Output:
    신한은행:
      - NIM 효과: +0.8T
      - GDP 효과: -0.2T (경제 침체로 신용수요 감소)
      - Net: +0.6T (금리 이득 < GDP 손실)

    신한알파리츠:
      - Interest 효과: -1.09B
      - GDP 효과: -0.4B (건설 수요 감소)
      - Net: -1.49B (더 악화)
```

---

## 💬 새 Claude Code 세션에서 요청하는 방법

### 방법 1: "Level 1에 GDP 추가"

```
요청문:
"LEVEL1_MACRO.md에 GDP Growth Rate를 추가해주고,
 이것이 Banking과 Real Estate에 영향을 주도록
 backend 계산식도 함께 업데이트해줘.

 GDP 성장률 변화:
 - Banking: β = +0.50 (수익 증가)
 - Real Estate: β = +0.30 (건설 수요 증가)

 그리고 Frontend rate-simulator 페이지에
 GDP 입력 필드도 추가해줘"

Claude가 해야 할 일:
1. ✅ LEVEL1_MACRO.md에 GDP 정의 추가
2. ✅ backend에 GDP 계산식 추가
3. ✅ Frontend에 GDP 입력 필드 추가
4. ✅ API endpoint 수정
5. ✅ 테스트 시나리오 실행
```

### 방법 2: "새로운 Macro Variable 추가 (명세 상세)"

```
요청문:
"새로운 Macro Variable을 추가해줘.

Level 1에 추가할 항목:
  - Variable Name: inflation_rate
  - Range: 0% ~ 10%
  - Default: 2.0%

섹터별 민감도:
  - Banking: β = -0.20 (인플레이션 → 임금비용 증가 → 수익 감소)
  - Real Estate: β = +0.10 (임대료 인상 가능)
  - Manufacturing: β = -0.40 (원재료 비용 증가)

구현해야 할 것:
1. LEVEL1_MACRO.md 업데이트
2. backend 계산식 추가
3. Frontend 입력 필드 추가
4. 금리 + 인플레이션 동시 시나리오 테스트"

Claude가 해야 할 일:
1. ✅ 모든 문서 업데이트
2. ✅ 모든 코드 수정
3. ✅ 테스트 시나리오 실행
```

### 방법 3: "Manufacturing 섹터 추가 + GDP 영향"

```
요청문:
"Manufacturing 섹터를 추가하는데,
 GDP Growth Rate 기반으로 영향을 받도록 해줘.

Manufacturing 특화:
  - Key Metrics: Capacity Utilization, COGS, Export Ratio
  - GDP Sensitivity: β = +0.80 (경제 성장에 매우 민감)
  - Tariff Sensitivity: β = -0.50 (수출 관세에 민감)

샘플 회사:
  - 삼성전자 (수출 50%)
  - SK하이닉스 (반도체)
  - LG전자 (가전)

구현:
1. /docs/sectors/manufacturing/SECTOR_SPEC.md 작성
2. backend manufacturing_calculator.py 구현
3. Frontend manufacturing 대시보드 추가
4. GDP + Tariff 시나리오 테스트"

Claude가 해야 할 일:
1. ✅ SECTOR_TEMPLATE.md 따라 문서 작성
2. ✅ Backend 계산식 구현
3. ✅ Frontend 페이지 추가
4. ✅ Cross-sector impact 테스트 (GDP ↓ → 은행 신용 영향)
```

---

## 🔧 Backend 엔진 확장 구조 (자동 적용)

### 현재 구조 (금리만)
```python
# services/market-data-api/app/main.py

@app.post("/api/simulator/rate-change")
async def simulate_rate_change(request: RateScenarioRequest):
    impacts = []

    for company_id, company_data in SAMPLE_COMPANIES.items():
        sector = company_data["sector"]

        if sector == "BANKING":
            impact = calculate_banking_impact(
                company_data,
                old_rate,
                new_rate
            )
        elif sector == "REALESTATE":
            impact = calculate_realestate_impact(
                company_data,
                old_rate,
                new_rate
            )

    return impacts
```

### 확장 후 구조 (금리 + GDP + 관세)
```python
# 새로운 요청 모델
class MacroScenarioRequest(BaseModel):
    interest_rate: float
    gdp_growth_rate: float
    tariff_rate: float
    inflation_rate: float

@app.post("/api/simulator/macro-scenario")
async def simulate_macro_scenario(request: MacroScenarioRequest):
    impacts = []

    for company_id, company_data in ALL_COMPANIES.items():
        sector = company_data["sector"]

        # 각 섹터별 전용 계산기 호출
        calculator = get_sector_calculator(sector)
        impact = calculator.calculate_impact(
            company_data,
            macro_variables={
                "interest_rate": request.interest_rate,
                "gdp_growth": request.gdp_growth_rate,
                "tariff_rate": request.tariff_rate,
                "inflation_rate": request.inflation_rate,
            }
        )

    return impacts

# 섹터별 계산기 (자동 확장 가능)
class BankingCalculator:
    def calculate_impact(self, company, macro_variables):
        nim_impact = self.calculate_nim(macro_variables["interest_rate"])
        gdp_impact = self.calculate_gdp_effect(macro_variables["gdp_growth"])
        inflation_impact = self.calculate_inflation_effect(macro_variables["inflation_rate"])

        return nim_impact + gdp_impact + inflation_impact

class RealEstateCalculator:
    def calculate_impact(self, company, macro_variables):
        interest_impact = self.calculate_interest_expense(macro_variables["interest_rate"])
        gdp_impact = self.calculate_construction_demand(macro_variables["gdp_growth"])
        inflation_impact = self.calculate_rental_inflation(macro_variables["inflation_rate"])

        return interest_impact + gdp_impact + inflation_impact

class ManufacturingCalculator:
    def calculate_impact(self, company, macro_variables):
        gdp_impact = self.calculate_sales_impact(macro_variables["gdp_growth"])
        tariff_impact = self.calculate_tariff_effect(macro_variables["tariff_rate"])
        inflation_impact = self.calculate_cogs_impact(macro_variables["inflation_rate"])

        return gdp_impact + tariff_impact + inflation_impact
```

---

## ✅ Level 1 확장 체크리스트

### 새 Macro Variable 추가할 때:

```
[ ] Step 1: LEVEL1_MACRO.md에 정의 추가
    [ ] Variable name, range, default value
    [ ] 영향 메커니즘 설명
    [ ] 섹터별 예상 영향

[ ] Step 2: LEVEL2_SECTOR.md에 β값 추가 (향후 작성)
    [ ] 각 섹터별 민감도 정의
    [ ] 계산식 명시

[ ] Step 3: Backend 계산식 추가
    [ ] Equation 1.1 확장
    [ ] 각 섹터 계산기에 항 추가
    [ ] API request model 수정
    [ ] API response model 수정

[ ] Step 4: Frontend 입력 필드 추가
    [ ] 새로운 입력 상자 추가
    [ ] 상태 변수 추가 (useState)
    [ ] API 호출 시 새 변수 포함
    [ ] 결과 화면에 새 변수 영향도 표시

[ ] Step 5: 테스트
    [ ] 단일 변수 시나리오 (GDP만 변화)
    [ ] 다중 변수 시나리오 (금리 + GDP)
    [ ] Cross-sector 영향 확인
    [ ] 예상 결과 vs 실제 결과 비교
```

---

## 🎯 확인 방법 (실제 앱에서 테스트)

### 현재 상태에서 바로 확인:

```bash
# 1. 앱 실행 (이미 실행 중이면 생략)
./run.sh

# 2. 브라우저에서 확인
http://localhost:3000/rate-simulator

# 3. 금리만으로 테스트
  금리: 2.5% → 3.0%
  → Banking: +8~33%
  → Real Estate: -6~50%

# 4. Circuit Diagram 확인
  신한은행 카드 클릭 → 🔌 Circuit Diagram 보기
  → http://localhost:3000/company/SH_BANK/circuit-diagram
  → 예금 → NIM → 대출 흐름 시각화
  → 금리 슬라이더 (1% ~ 5%)로 실시간 영향도 확인

# 5. 대출 포트폴리오 위험도 확인
  Circuit Diagram에서:
  - 신한알파리츠: ICR 1.83x → 1.53x (RISK)
  - 이리츠: ICR 0.8x → 0.67x (부도위험)
  - NH프라임: ICR 4.27x → 3.56x (SAFE 유지)
```

### GDP 추가 후 확인:

```bash
# 1. 동일하게 앱 실행

# 2. Rate Simulator에 GDP 입력 필드 추가됨
  금리: 2.5% → 3.0%
  GDP: 3.0% → 1.5% (경제 침체)

  → Banking: +8~33% (금리 이득) - 3~5% (GDP 손실) = 작아짐
  → Real Estate: -6~50% (금리 손실) - 1~3% (GDP 손실) = 더 나빠짐

# 3. 새로운 결과 보기
  신한은행: 금리만 +24% → 금리+GDP +18% (GDP 침체로 신용수요 감소)
  이리츠: 금리만 -50% → 금리+GDP -54% (더 악화)
```

---

## 🔮 Level 1 추가 아이디어 (향후)

```
현재: interest_rate (금리)
      → Eq 1.1 → 모든 섹터 영향

추가 가능한 Macro Variables:

1. gdp_growth_rate (GDP 성장률)
   → Banking: 신용수요
   → Manufacturing: 매출
   → Real Estate: 건설수요

2. inflation_rate (인플레이션)
   → Manufacturing: COGS
   → Banking: 임금비용
   → Real Estate: 임대료

3. tariff_rate (관세)
   → Manufacturing: 수출경쟁력
   → Banking: 고객 부도위험
   → Crypto: 규제강도

4. unemployment_rate (실업률)
   → Banking: 신용위험
   → Manufacturing: 임금
   → Real Estate: 건설수요

5. credit_spread (신용스프레드)
   → All sectors: 차입비용
   → Startup impact: 성장속도

6. volatility_index (변동성)
   → Options: 가격
   → Crypto: 수익성
   → All sectors: 위험프리미엄

모두 동일한 구조로 추가 가능!
```

---

## 📝 요약

### Level 1에 새 Variable 추가 시 흐름:

```
LEVEL1_MACRO.md 추가
        ↓
LEVEL2_SECTOR.md 업데이트 (β값)
        ↓
Backend Equation 1.1 확장
        ↓
각 섹터 계산기에 항 추가
        ↓
Frontend 입력 필드 추가
        ↓
API request/response 수정
        ↓
테스트 시나리오 실행
        ↓
결과 확인 (브라우저에서 직접 보기)
```

### 한 번의 Claude Code 요청으로 모두 수행:
```
"LEVEL1_MACRO.md에 [Variable Name]을 추가하고,
 섹터별 민감도는 [Banking: β = 0.XX, Real Estate: β = -0.XX, ...]

 Backend와 Frontend 모두 업데이트해줘.
 완료 후 금리 + [Variable Name] 동시 변화 시나리오 테스트해줘."

→ Claude가 모든 5단계 자동 수행
```

---

**이 가이드를 따르면, 언제든지 새로운 Macro Variable을 추가할 수 있으며,**
**자동으로 모든 섹터에 영향이 반영됩니다!**
