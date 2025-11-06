# Nexus-Alpha: 빠른 시작 가이드 (5분)

**상태:** Phase 2 (52% 완료) | 준비됨 ✅

---

## 🚀 5분 안에 시작하기

### 1️⃣ Terminal 1: Backend 시작 (2분)

```bash
cd /Users/jeonhyeonmin/Simulation/nexus-alpha/apps/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**확인:**
```
✅ "Application startup complete" 메시지 나타나면 성공
✅ http://localhost:8000/docs 접속 (Swagger UI)
```

### 2️⃣ Terminal 2: Frontend 시작 (2분)

```bash
cd /Users/jeonhyeonmin/Simulation/nexus-alpha/apps/web
npm install  # 처음 실행 시만
npm run dev
```

**확인:**
```
✅ http://localhost:3000 자동 오픈
✅ "Ready in X.Xs" 메시지 나타나면 성공
```

### 3️⃣ 브라우저에서 확인 (1분)

```
http://localhost:3000
├─ 👔 CEO Dashboard (/ceo-dashboard) - 팀별 진행률 확인
├─ 🔗 Network Graph (/network-graph) - 23개 기업 네트워크
└─ 📊 Dashboard (/dashboard) - 분석 섹션
```

---

## 📊 현재 상태

| 항목 | 상태 | 진행률 |
|------|------|--------|
| **Data** | ✅ 23개 기업 | 46% (23/50) |
| **Backend** | ⚠️ 코드만 있음 | 10% |
| **Frontend** | 🔄 진행 중 | 45% |
| **AI** | 📋 계획만 있음 | 0% |

---

## ⚠️ 주의사항

### Port 충돌 확인
```bash
# 이미 사용 중인 포트가 있으면:
lsof -i :3000  # Frontend
lsof -i :8000  # Backend

# 만약 사용 중이면 다른 포트로 실행:
npm run dev -- -p 3001
uvicorn main:app --port 8001
```

### npm 의존성 설치 에러
```bash
# 캐시 삭제 후 다시 설치
cd apps/web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Python 패키지 충돌
```bash
# 가상환경 사용 추천
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

---

## 📚 다음 단계

### 읽어야 할 문서 (우선순위)
1. **README.md** (프로젝트 개요) - 5분
2. **PROJECT_VERIFICATION.md** (현황 확인) - 10분
3. **ARCHITECTURE_GAPS.md** (남은 작업) - 15분
4. **FINAL_SUMMARY.md** (작업 종합) - 10분

### 하면 좋은 작업 (우선순위)
1. Backend API 테스트 (curl 명령어)
2. Frontend ↔ Backend 연동
3. Fundamental/Technical 페이지 구현

---

## 🆘 문제 해결

### Frontend 안 열리면
```bash
# 1. npm 업데이트
npm install -g npm@latest

# 2. node_modules 재설치
cd apps/web
rm -rf node_modules
npm install
npm run dev
```

### Backend API 안 된다면
```bash
# 1. 패키지 확인
pip list | grep yfinance

# 2. 패키지 재설치
pip install --upgrade yfinance pandas fastapi uvicorn

# 3. API 직접 테스트
curl http://localhost:8000/api/health
```

### Port 이미 사용 중
```bash
# 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :8000

# 프로세스 종료 (필요시)
kill -9 <PID>
```

---

**더 자세한 정보는 README.md 또는 PROJECT_VERIFICATION.md를 읽어주세요!**
