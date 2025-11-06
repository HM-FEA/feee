# Level 1: Macro Variables (모든 섹터 공용)

**Purpose:** 전체 경제에 영향을 주는 변수 정의
**Rule:** 새 섹터 추가 시 여기에 추가만 함 (수정 X)
**Last Updated:** 2025-11-01

---

## 📊 Macro Variables 정의

### 1. 금리 (Interest Rate)
```
변수명: interest_rate
범위: 0% ~ 10%
영향도: 모든 섹터 (차입기업 영향 큼)
기본값: 2.5%

영향 메커니즘:
- Banking: NIM (순이자마진) 변화
  ├─ 대출금리 인상 속도 > 예금금리 인상 속도
  └─ → NIM 확대 → 수익 증가

- Real Estate: 이자비용 증가
  ├─ Interest Expense = Debt × interest_rate
  └─ → 순이익 감소

- Manufacturing: 간접 영향 (자본 조달 비용)
  └─ → 성장 속도 감소

- Options: Rho (옵션 가격의 금리 민감도)
  └─ → 옵션 가격 변화
```

### 2. 관세 (Tariff Rate)
```
변수명: tariff_rate
범위: 0% ~ 50%
영향도: Manufacturing, Import/Export 기업
기본값: 0%

영향 메커니즘:
- Manufacturing: 수출품 가격 상승 → 수익성 저하
- Importers: 수입 비용 증가 → 마진 감소
- Exporters: 경쟁력 강화 → 수익 증가
```

### 3. 환율 (FX Rate)
```
변수명: fx_rate (USD/KRW)
범위: 1,000 ~ 1,400
영향도: 수출기업, 해외자산 기업
기본값: 1,200

영향 메커니즘:
- Exporters (삼성전자): USD 수익 → KRW 환산 시 이득
  └─ KRW 약세 → 수익 증가

- Importers: USD 비용 → KRW 환산 시 손실
  └─ KRW 약세 → 비용 증가

- Real Estate: 해외 대출자의 상환 능력 변화
```

### 4. 인플레이션 (Inflation Rate)
```
변수명: inflation_rate
범위: 0% ~ 10%
영향도: 모든 섹터
기본값: 2.0%

영향 메커니즘:
- 임금 인상 압력 → 운영 비용 증가
- 원재료 가격 상승
- 소비자 구매력 감소
- 중앙은행의 금리 정책 변화 압력
```

### 5. 유동성 (Money Supply)
```
변수명: m2_money_supply
범위: 0M ~ ∞
영향도: 신용 가능성, 자산 가격
기본값: 현재 통화량

영향 메커니즘:
- 통화량 증가 → 자산 가격 상승
- 통화량 감소 → 신용 위축
```

### 6. 신용 스프레드 (Credit Spread)
```
변수명: credit_spread (basis points, bps)
범위: 50 ~ 500 bps
영향도: 차입기업의 차입 비용
기본값: 200 bps

영향 메커니즘:
- 스프레드 증가 → 차입 비용 증가 → 부도율 증가
- 경제 위험 지표
```

---

## 🔄 Macro Variables 통합 식

### Equation 1.1: Macro → Sector Impact

```
Impact_Sector = f(Macro_Variables, Sector_Sensitivity)

For Interest Rate:
  ΔRevenue = β_sector × Δinterest_rate

  β_Banking = +0.30 (금리↑ → 수익↑)
  β_RealEstate = -0.50 (금리↑ → 수익↓)
  β_Manufacturing = -0.10 (간접 영향)

For Tariff:
  ΔRevenue = -β_tariff × Δtariff_rate

  β_Samsung = 0.80 (수출 기업)
  β_Importer = 0.50 (수입 기업)

For FX:
  ΔRevenue_USD_business = Δfx_rate × USD_revenue

  삼성전자: USD 매출 30% → 환율 변화 영향 큼
```

---

## 📈 예시: 금리 2.5% → 3.0% 시나리오

```
Macro Change:
  interest_rate: 2.5% → 3.0% (Δ +0.5%)

Sector Impact (Eq 1.1 적용):
  Banking:
    ΔRevenue = 0.30 × 0.5% = +0.15%
    (실제 샘플: NIM 확대로 +8~33%)

  Real Estate:
    ΔRevenue = -0.50 × 0.5% = -0.25%
    (실제 샘플: 이자비용 증가로 -6~50%)

Company Impact (Level 3 계산):
  신한은행: 순이익 2.52T → 2.85T (+13%)
  신한알파리츠: 순이익 4.48B → 3.44B (-23%)
  이리츠코크렙: 순이익 1.88B → -0.50B (부도!)
```

---

## 🔧 추가 섹터 시 확장

### Manufacturing (향후)
```
추가 Macro Variables:
  - commodity_price_index (원재료 가격)
  - labor_cost_index (노동 비용)
  - capacity_utilization_rate (설비 가동률)

Equation 1.1 확장:
  ΔRevenue = β_commodity × Δcommodity_price
           + β_labor × Δlabor_cost
           + β_capacity × Δcapacity_utilization
```

### Options (향후)
```
추가 Macro Variables:
  - volatility_index (VIX 유사 지표)
  - market_sentiment (시장 심리)

Equation 1.1 확장:
  ΔOption_Price = Rho × Δinterest_rate
                + Vega × Δvolatility_index
                + Lambda × Δmarket_sentiment
```

### Crypto (향후)
```
추가 Macro Variables:
  - btc_price (비트코인 가격)
  - regulatory_score (규제 수준)

Equation 1.1 확장:
  ΔCrypto_Asset = β_btc × Δbtc_price
                + β_regulation × Δregulatory_score
```

---

## ✅ 검증 기준

### Level 1 적용 테스트
```
Test: 금리 변화 시 모든 섹터 영향 계산
  Input: interest_rate 2.5% → 3.0%

  Banking companies should show: Revenue ↑
  Real Estate companies should show: Revenue ↓
  Cross-sector: Bank provision ↑ (borrower 위험도 증가)

Result: ✅ PASS (모든 섹터가 기대 방향 변화)
```

---

## 📋 다음 문서

- **LEVEL2_SECTOR.md** → 섹터별 민감도 (β값) 정의
- **LEVEL3_COMPANY.md** → 회사 재무 표준
- **LEVEL4_ASSET.md** → 자산 레벨 정의
- **DATABASE_SCHEMA.md** → 데이터베이스 구조

---

**중요:** 새 섹터 추가 시, 이 문서에 "추가만" 함. 기존 내용은 수정하지 않음.
