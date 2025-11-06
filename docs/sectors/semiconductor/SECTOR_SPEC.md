# Semiconductor Sector Specification

**섹터 코드:** SEMICONDUCTOR
**작성일:** 2025-11-03
**작성자:** Team Sector Analysis
**상태:** 검증 중 → Team Quant 검토 필요

---

## 1. 섹터 개요

### 산업 특성
- **자본집약적 산업**: CapEx(설비투자)가 매출의 30-40% 차지
- **R&D 집약적**: 연구개발비가 매출의 15-20% (기술 경쟁력 핵심)
- **생산 가동률 의존**: Wafer 가동률이 수익성에 직접 영향
- **글로벌 공급망**: 원자재 수입 의존도 높음 (미중 무역 리스크)
- **사이클 산업**: 메모리 가격 변동성 높음 (DRAM, NAND)

### 주요 기업
- 삼성전자 (Samsung Electronics)
- SK하이닉스 (SK Hynix)
- TSMC (Taiwan Semiconductor Manufacturing Company)
- 인텔 (Intel Corporation)
- ASML (장비 제조)

---

## 2. 공용 방정식 활용 여부

### ✅ 사용하는 공용 방정식 (9개 중)
- **Eq 3.1**: Balance Sheet (자산 = 부채 + 자본)
- **Eq 3.2**: Income Statement (순이익 = 매출 - 비용)
- **Eq 3.3**: Key Ratios (ICR, D/E, ROE, ROA)
- **Eq 3.4**: Cash Flow (FCF = OCF - CapEx)
- **Eq 3.5**: Default Risk (신용 점수, 부도 확률)
- **Eq 3.6**: Credit Rating Impact (신용등급 변화)
- **Eq 3.7**: Rate Sensitivity (금리 민감도)
- **Eq 3.8**: FX Exposure (환율 노출도 - 수출 중심)

### ❌ 사용하지 않는 공용 방정식
- **Eq 1.1**: Macro Indicators (간접 영향만, 직접 사용 안 함)
- **Eq 2.1**: Sector Growth Rate (반도체는 별도 계산)

**사용하지 않는 이유:**
- LTV (Loan-to-Value): 반도체 기업은 부동산 자산이 핵심이 아님
- NIM (Net Interest Margin): 은행 전용 지표
- Occupancy Rate: 부동산 전용 지표

---

## 3. 섹터 특수 방정식 (Sector-Specific Equations)

### 📌 Eq S1: Wafer Capacity Utilization (웨이퍼 가동률)

**정의:**
```
Wafer_Utilization = (Actual_Wafer_Output / Max_Production_Capacity) × 100
```

**설명:**
- 실제 웨이퍼 생산량 / 최대 생산 능력
- 반도체 공장의 효율성 및 수익성 핵심 지표

**범위:** 0 - 100%

**임계값:**
- **80% 이상**: 정상 (고정비 분산, 높은 수익성)
- **60-80%**: 주의 (고정비 부담 증가)
- **60% 미만**: 위험 (적자 가능성, 감산 필요)

**적용 기업:** 삼성전자, SK하이닉스, TSMC

**데이터 출처:** 공시 자료 (분기 실적 발표), 산업 리포트

---

### 📌 Eq S2: R&D Intensity (연구개발 집약도)

**정의:**
```
R&D_Intensity = (R&D_Expense / Revenue) × 100
```

**설명:**
- 매출 대비 R&D 투자 비율
- 기술 경쟁력 유지 및 차세대 공정 개발 필수

**범위:** 5 - 25%

**임계값:**
- **15% 이상**: 기술 경쟁력 유지 (선진 기업 수준)
- **10-15%**: 보통 (중견 기업 수준)
- **10% 미만**: 기술 낙후 위험 (경쟁력 약화)

**적용 기업:** 모든 반도체 기업

**데이터 출처:** 재무제표 (손익계산서), IR 자료

---

### 📌 Eq S3: ASP Trend (Average Selling Price - 평균 판매 가격 추이)

**정의:**
```
ASP_Change = ((ASP_Current - ASP_Previous) / ASP_Previous) × 100
```

**설명:**
- 메모리 반도체 가격 변동성 추적
- DRAM, NAND 가격 사이클 영향 분석

**범위:** -50% ~ +50% (분기별 변동)

**임계값:**
- **+10% 이상**: 호황기 (가격 상승, 이익 증가)
- **-10% ~ +10%**: 안정기 (가격 횡보)
- **-10% 미만**: 불황기 (가격 하락, 이익 감소)

**적용 기업:** 삼성전자, SK하이닉스 (메모리 중심)

**데이터 출처:** DRAMeXchange, TrendForce, 산업 리포트

---

### 📌 Eq S4: CapEx Ratio (설비투자 비율)

**정의:**
```
CapEx_Ratio = (CapEx / Revenue) × 100
```

**설명:**
- 매출 대비 설비투자 비율
- 반도체 공장 증설, 장비 구매 규모

**범위:** 20 - 50%

**임계값:**
- **30% 이상**: 공격적 투자 (미래 성장 준비)
- **20-30%**: 정상 투자 (유지 보수 수준)
- **20% 미만**: 투자 감소 (성장 둔화 신호)

**적용 기업:** 삼성전자, SK하이닉스, TSMC

**데이터 출처:** 재무제표 (현금흐름표), IR 자료

---

### 📌 Eq S5: Geopolitical Risk Score (지정학적 리스크)

**정의:**
```
Geo_Risk = (China_Revenue_Ratio × 0.5) + (Import_Dependency × 0.3) + (US_Sanction_Risk × 0.2)
```

**설명:**
- 중국 매출 비중, 원자재 수입 의존도, 미국 제재 리스크
- 미중 무역 갈등 영향 평가

**범위:** 0 - 100 (점수)

**임계값:**
- **70 이상**: 고위험 (중국 의존도 높음)
- **40-70**: 중위험 (분산 필요)
- **40 미만**: 저위험 (다변화 완료)

**적용 기업:** 삼성전자, SK하이닉스, TSMC

**데이터 출처:** 지역별 매출 분석, 산업 리포트

**⚠️ 주의:** 이 방정식은 정량화 어려움 → Team Quant 검증 필요

---

## 4. 방정식 검증 상태

| 방정식 | 정의 완료 | Team Quant 검증 | 데이터 확보 | 상태 |
|--------|----------|----------------|------------|------|
| Eq S1: Wafer Utilization | ✅ | ⏳ 대기 중 | ✅ 공시 자료 | 승인 대기 |
| Eq S2: R&D Intensity | ✅ | ⏳ 대기 중 | ✅ 재무제표 | 승인 대기 |
| Eq S3: ASP Trend | ✅ | ⏳ 대기 중 | ✅ TrendForce | 승인 대기 |
| Eq S4: CapEx Ratio | ✅ | ⏳ 대기 중 | ✅ 재무제표 | 승인 대기 |
| Eq S5: Geo Risk | ✅ | ⏳ 대기 중 | ⚠️ 추정치 | 보류 가능 |

---

## 5. 샘플 데이터 (검증용)

### 삼성전자 (Samsung Electronics)
```json
{
  "company_id": "SAMSUNG_ELEC",
  "name": "삼성전자",
  "sector": "SEMICONDUCTOR",
  "financials": {
    "revenue": 234000,           // 234조원 (2024)
    "net_income": 23000,          // 23조원
    "total_assets": 450000,       // 450조원
    "total_debt": 100000,         // 100조원
    "capex": 50000,               // 50조원 (CapEx)
    "rd_expense": 28000           // 28조원 (R&D)
  },
  "sector_metrics": {
    "wafer_utilization": 85,      // 85% (정상)
    "rd_intensity": 12.0,         // 12% (보통)
    "asp_change": -5.2,           // -5.2% (DRAM 가격 하락)
    "capex_ratio": 21.4,          // 21.4% (유지 보수)
    "geo_risk_score": 65          // 65 (중위험 - 중국 의존)
  }
}
```

### SK하이닉스 (SK Hynix)
```json
{
  "company_id": "SK_HYNIX",
  "name": "SK하이닉스",
  "sector": "SEMICONDUCTOR",
  "financials": {
    "revenue": 50000,             // 50조원 (2024)
    "net_income": 5000,           // 5조원
    "total_assets": 80000,        // 80조원
    "total_debt": 20000,          // 20조원
    "capex": 15000,               // 15조원
    "rd_expense": 7500            // 7.5조원
  },
  "sector_metrics": {
    "wafer_utilization": 78,      // 78% (주의)
    "rd_intensity": 15.0,         // 15% (경쟁력 유지)
    "asp_change": -8.5,           // -8.5% (NAND 가격 하락)
    "capex_ratio": 30.0,          // 30% (공격적 투자)
    "geo_risk_score": 55          // 55 (중위험)
  }
}
```

---

## 6. Team Quant 검토 요청 사항

### 구현 가능성 확인
1. **Eq S1 (Wafer Utilization)**: 공시 자료에서 가동률 추출 가능한가?
2. **Eq S2 (R&D Intensity)**: 재무제표에서 R&D 비용 확인 가능한가?
3. **Eq S3 (ASP Trend)**: TrendForce API 또는 DRAMeXchange 연동 가능한가?
4. **Eq S4 (CapEx Ratio)**: 현금흐름표에서 CapEx 추출 가능한가?
5. **Eq S5 (Geo Risk)**: 지역별 매출 분석 가능한가? (정량화 어려울 수 있음)

### API 연동 확인
- yfinance: 미국 상장 반도체 기업 (Intel, AMD) 데이터 가능?
- DART: 한국 반도체 기업 (삼성전자, SK하이닉스) 공시 자료 파싱 가능?
- TrendForce: 메모리 가격 데이터 (ASP) 연동 가능?

---

## 7. 다음 단계

### Team Quant 검증 후
1. ✅ 승인된 방정식 → Backend API 구현
2. ⚠️ 보류된 방정식 → 재검토 또는 v2 개선안 제시
3. ❌ 거부된 방정식 → 삭제하지 않고 기록 보존 (Append-only)

### Team Data 데이터 수집
- 삼성전자, SK하이닉스 실제 재무 데이터 확보
- TrendForce에서 메모리 가격 트렌드 수집

### Team UI 페이지 추가
- `/fundamental/semiconductor` 페이지 생성
- Wafer Utilization 차트, R&D Intensity 트렌드 시각화

---

**이 문서는 Append-only입니다. 수정 금지, 추가만 가능합니다.**
**잘못된 방정식도 삭제하지 않고 Eq S1_v2로 새 버전을 추가합니다.**
