# 실제 앱 테스트 방법 - 5분 가이드

**Purpose:** 현재 완성된 Phase 1 MVP를 직접 테스트하는 방법
**Status:** ✅ 앱 실행 중
**Last Updated:** 2025-11-01

---

## 🚀 빠른 시작 (5분)

### 1️⃣ 앱이 실행 중인지 확인

```bash
# 터미널에서 확인
curl http://localhost:3000/rate-simulator

# 또는 브라우저에서 직접 방문
http://localhost:3000
```

만약 실행 안 되고 있으면:
```bash
cd /Users/jeonhyeonmin/Simulation/nexus-alpha
./run.sh
```

### 2️⃣ Rate Simulator 테스트 (2분)

```
브라우저: http://localhost:3000/rate-simulator

1. 화면이 보이는가?
   ✅ "⚡ Rate Simulator" 제목 보임
   ✅ "금리 시나리오 설정" 입력 필드 보임

2. 금리 입력
   현재 금리: 2.5% (기본)
   새 금리: 3.0% (기본)
   → "금리 변화: +0.50%"가 빨간색으로 표시됨

3. "시뮬레이션 실행" 버튼 클릭
   → 2-3초 대기
   → "시뮬레이션 결과" 나타남

4. 결과 확인
   🏦 Banking Sector:
   ├─ 신한은행: +24.3% ✅ (금리↑ → 수익↑)
   ├─ KB금융: +28.2% ✅
   └─ 우리은행: +32.6% ✅

   🏢 Real Estate Sector:
   ├─ 신한알파리츠: -24.3% ✅ (금리↑ → 수익↓)
   ├─ 이리츠코크렙: -49.9% ✅ (부도위험!)
   └─ NH프라임: -6.1% ✅

   📊 Summary:
   ├─ 🏦 Banking Sector Average: +28.4%
   └─ 🏢 Real Estate Sector Average: -26.8%
```

### 3️⃣ Circuit Diagram 테스트 (2분)

```
결과 화면에서 신한은행 카드 클릭

또는 직접 방문:
http://localhost:3000/company/SH_BANK/circuit-diagram

1. Circuit Diagram 보이는가?
   ✅ 예금 (💰) → NIM 계산 (⚙️) → 대출 (📊) 흐름

2. 금리 슬라이더
   범위: 1% ~ 5%
   기본: 3.0%

   슬라이더를 4.0%로 변경 → 모든 수치 실시간 업데이트

3. 대출 포트폴리오 상세
   금리 3.0% 기준:

   신한알파리츠: 100B
   ├─ ICR: 1.83x → 1.53x ⚠️ RISK
   ├─ 변화: -0.30x
   └─ "⚠️ 부도위험" 표시

   이리츠코크렙: 200B (위험!)
   ├─ ICR: 0.8x → 0.67x 🔴 RISK
   ├─ 변화: -0.13x
   └─ "⚠️ 부도위험" 표시 (심각)

   NH프라임: 50B
   ├─ ICR: 4.27x → 3.56x ✅ SAFE
   ├─ 변화: -0.71x
   └─ 안전 유지

4. 순이익 변화
   현재 (금리 2.5%): 2.52T
   새로운 (금리 3.0%): 2.85T
   증가: +330B (+13.1%)
```

---

## 📊 시나리오별 테스트

### Scenario 1: 금리 인상 (현재 기본값)

```
설정:
  현재 금리: 2.5%
  새 금리: 3.0%

예상 결과:
  Banking: ↑ (NIM 확대)
  Real Estate: ↓ (이자비용 증가)

실제 결과 확인:
  http://localhost:3000/rate-simulator
  → "시뮬레이션 실행" 클릭

결과:
  신한은행: 2.52T → 3.13T ✅
  신한알파리츠: 4.48B → 3.39B ✅
  이리츠: 1.88B → 0.94B ✅

✅ PASS: 모두 기대 방향
```

### Scenario 2: 극단적 금리 인상 (부도 위험)

```
설정:
  현재 금리: 2.5%
  새 금리: 5.0% (큰 인상)

예상:
  Banking: 큰 수익 증가
  Real Estate: 심각한 부도 위험

테스트:
  1. rate-simulator에서 새 금리를 5.0%로 변경
  2. "시뮬레이션 실행" 클릭
  3. 결과 확인

확인 포인트:
  - 이리츠 NI가 음수가 되는가? → Yes, 부도
  - 신한은행 이리츠 대출 provision 증가? → Yes
  - ICR이 1.0 이하로 내려가는가? → Yes

✅ 실제 부도 위험이 모델링됨
```

### Scenario 3: 금리 인하

```
설정:
  현재 금리: 2.5%
  새 금리: 1.5% (인하)

예상 (반대 방향):
  Banking: ↓ (NIM 축소)
  Real Estate: ↑ (이자비용 감소)

테스트:
  1. 새 금리를 1.5%로 변경
  2. "시뮬레이션 실행" 클릭

결과:
  신한은행: 수익 감소 ✅
  신한알파리츠: 수익 증가, ICR 개선 ✅
  이리츠: 부도 위험 감소, ICR > 1.0 ✅

✅ 모두 역방향으로 움직임
```

---

## 🔍 세부 확인 사항

### Circuit Diagram 상세 테스트

```
http://localhost:3000/company/SH_BANK/circuit-diagram

1. 금리 슬라이더 조작
   - 1% 설정: 이자비용 최소, 순이익 최대
   - 5% 설정: 이자비용 최대, 순이익 최소
   - 슬라이더 움직임에 따라 실시간 업데이트 확인

2. 대출 상태 변화
   - 금리 3.0% → 4.0%: 이리츠 ICR 0.67 → 0.60 (악화)
   - 금리 3.0% → 2.5%: 이리츠 ICR 0.67 → 0.75 (개선)

3. 색상 변화
   - SAFE (초록): NH프라임 (항상 안전)
   - RISK (빨강): 이리츠 (항상 위험)
   - CAUTION (노랑): 신한알파 (금리에 따라 변함)

4. 순이익 변화
   - 신한은행 순이익 변화 실시간 확인
   - 금리 1% 상승 → 약 330B 수익 증가 비율 확인
```

### Backend API 직접 테스트

```bash
# Rate Scenario API 호출
curl -X POST http://localhost:8000/api/simulator/rate-change \
  -H "Content-Type: application/json" \
  -d '{
    "old_rate": 0.025,
    "new_rate": 0.030
  }' | python3 -m json.tool

# 응답 확인:
{
  "old_rate": 0.025,
  "new_rate": 0.03,
  "rate_change": 0.005,
  "companies": [
    {
      "company_id": "SH_BANK",
      "name": "신한은행",
      "sector": "BANKING",
      "current_net_income": 2520000000000,
      "new_net_income": 3132500000000,
      "net_income_change": 612500000000,
      "net_income_change_pct": 24.3,
      ...
    },
    ...
  ]
}
```

---

## ✅ 체크리스트: 모두 정상?

```
[ ] Rate Simulator 페이지 로드 (http://localhost:3000/rate-simulator)
[ ] 금리 입력 필드 작동
[ ] "시뮬레이션 실행" 버튼 작동
[ ] Banking Sector 결과 표시됨
[ ] Real Estate Sector 결과 표시됨
[ ] Summary 섹션 표시됨

[ ] Circuit Diagram 페이지 로드 (클릭으로 이동)
[ ] 금리 슬라이더 작동
[ ] 예금 → NIM → 대출 흐름 보임
[ ] 대출 포트폴리오 상세 표시됨
[ ] ICR 수치 실시간 업데이트

[ ] 금리 2.5% → 3.0%: Banking +, Real Estate -
[ ] 금리 2.5% → 1.5%: Banking -, Real Estate +
[ ] 금리 2.5% → 5.0%: 부도 위험 (이리츠 NI < 0)

[ ] Backend API 정상 응답 (curl 테스트)
```

---

## 🎯 다음 단계 (완료 후)

### Phase 2 기능들을 추가하고 싶으면:

```
1. 3D Network Graph
   → 모든 회사를 3D 노드로, 대출 관계를 선으로

2. Analyst Report Agent
   → 자동 생성 분석 리포트, PDF 다운로드

3. Manufacturing Sector
   → 관세 변화 시나리오 추가
   → 샘플: 삼성전자, SK하이닉스, LG전자

각 단계별로 새로운 Claude Code 세션을 시작하고
이 가이드를 참고해서 요청하면 됩니다.
```

---

## 💬 새로운 기능 추가 시 요청 방법

### Level 1에 GDP 추가 예시:

```
Claude Code에서:

"LEVEL1_MACRO.md에 GDP Growth Rate를 추가해줄래?

변수:
  - Name: gdp_growth_rate
  - Range: -10% ~ +10%
  - Default: 3.0%

섹터별 영향:
  - Banking: β = +0.50 (GDP ↑ → 신용수요 ↑)
  - Real Estate: β = +0.30 (GDP ↑ → 건설수요 ↑)
  - Manufacturing: β = +0.80 (GDP ↑ → 매출 ↑)

Backend와 Frontend도 함께 업데이트해줄래?
완료 후 금리 + GDP 동시 변화 시나리오로 테스트해줘."

→ Claude가 자동으로 5개 파일 모두 수정
→ 브라우저에서 바로 확인 가능
```

---

## 📞 문제 해결

### 문제 1: "페이지가 안 뜬다"
```bash
# 앱 재시작
./run.sh

# 또는 포트 확인
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# 포트 충돌 시 프로세스 종료
kill -9 [PID]
```

### 문제 2: "API 호출 실패"
```bash
# Backend 실행 확인
curl http://localhost:8000/health

# 응답: {"status":"healthy"} 보이면 정상
```

### 문제 3: "결과가 이상하다"
```bash
# 1. 입력값 확인
   금리 2.5% → 3.0%인지 확인

# 2. Backend 로그 확인
   Terminal 보면 API 호출 기록 있는지 확인

# 3. Circuit Diagram과 Rate Simulator 결과 비교
   같은 금리일 때 수치가 동일한지 확인
```

---

## 🎓 학습 포인트

### Phase 1 MVP에서 배우는 것:

1. **4-Level 온톨로지**
   - Macro (금리) → Sector (NIM, ICR) → Company (순이익) → Asset (대출)

2. **Cross-Sector 관계**
   - 은행이 부동산에 대출 → 부동산 부도위험 증가 → 은행 provision 증가

3. **민감도 분석**
   - 같은 금리 인상에도 회사마다 영향이 다름 (RE exposure에 따라)

4. **위험도 평가**
   - ICR < 1.0x = 부도 위험 (이리츠)
   - ICR > 2.5x = 안전 (NH프라임)

---

**이제 직접 테스트해보세요!**

브라우저 열기:
```
http://localhost:3000/rate-simulator
```

금리를 조정하고, 신한은행을 클릭해서 Circuit Diagram을 보세요!
