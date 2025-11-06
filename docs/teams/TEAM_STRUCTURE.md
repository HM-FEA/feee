# 👥 Nexus-Alpha: Team Structure & Responsibilities

**Version:** 1.0.0
**Last Updated:** 2025-10-31

---

## 🎯 Organization Overview

Nexus-Alpha의 엔지니어링 조직은 **6개의 핵심 Squad**로 구성되며, 각 팀은 명확한 소유권(Ownership)과 책임(R&R)을 가집니다.

### Team Hierarchy

```
Tech Lead (CTO)
├── Team: UI (Frontend)
│   ├── Lead: Frontend Architect
│   ├── Senior Frontend Engineer x2
│   └── Junior Frontend Engineer x1
│
├── Team: Platform (Backend Gateway)
│   ├── Lead: Backend Architect
│   ├── Senior Backend Engineer (Go) x1
│   └── Backend Engineer (Node.js) x1
│
├── Team: Quant (AI & Models)
│   ├── Lead: Quant Lead / ML Engineer
│   ├── Senior Quant Engineer x1
│   └── ML Engineer x1
│
├── Team: Data (Data Engineering)
│   ├── Lead: Data Architect
│   ├── Senior Data Engineer x1
│   └── Data Engineer x1
│
├── Team: SimViz (Simulation & Visualization)
│   ├── Lead: Visualization Architect
│   ├── Senior Frontend Engineer (3D) x1
│   └── Python Engineer (Sim Backend) x1
│
└── Team: Infra (DevOps)
    ├── Lead: DevOps Lead
    └── DevOps Engineer x2
```

**Total Headcount:** 18 engineers

---

## 🏢 Team 1: UI (Frontend)

### Overview
**Mission:** 사용자가 복잡한 금융 데이터를 직관적으로 이해하고 상호작용할 수 있는 최고 수준의 UX를 제공합니다.

**Workspace:** `/apps/web`, `/apps/mobile`

**Tech Stack:**
- TypeScript
- Next.js 14 (App Router)
- React 18
- TailwindCSS + Shadcn/ui
- Zustand (State Management)

### Team Composition

#### 1.1 Lead: Frontend Architect
**Role:** Frontend 팀의 기술적 방향성 설정 및 아키텍처 설계

**Responsibilities:**
- Next.js 앱 전체 구조 설계 (pages, components, hooks)
- 디자인 시스템 구축 및 컴포넌트 라이브러리 관리
- 성능 최적화 (Code splitting, SSR/SSG 전략)
- 다른 팀(SimViz, Platform)과의 API 인터페이스 정의
- 코드 리뷰 및 기술 멘토링

**Deliverables:**
- 디자인 시스템 문서
- 컴포넌트 라이브러리 (Storybook)
- 성능 벤치마크 리포트

**KPIs:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Lighthouse Score > 90

#### 1.2 Senior Frontend Engineer (UI/UX)
**Focus:** 사용자 대면 페이지 개발

**Responsibilities:**
- 랜딩 페이지, 대시보드, 설정 페이지 개발
- 반응형 디자인 구현 (모바일/태블릿/데스크톱)
- 접근성 (A11y) 준수 (WCAG 2.1 AA)
- SEO 최적화
- A/B 테스트 통합

**Tech Focus:**
- React, Next.js
- CSS-in-JS (Tailwind)
- React Query (데이터 fetching)

#### 1.3 Senior Frontend Engineer (Integration)
**Focus:** 백엔드 API 통합 및 상태 관리

**Responsibilities:**
- Platform Service API 연동
- WebSocket 실시간 데이터 스트리밍
- 전역 상태 관리 (Zustand)
- 에러 핸들링 & 로딩 상태
- SimViz 컴포넌트 임베딩

**Tech Focus:**
- TypeScript
- API Client 개발
- WebSocket (socket.io-client)

#### 1.4 Junior Frontend Engineer
**Focus:** 컴포넌트 개발 및 유지보수

**Responsibilities:**
- 공통 컴포넌트 개발 (Button, Input, Card 등)
- 버그 수정 및 UI 개선
- 단위 테스트 작성 (Jest, React Testing Library)
- Storybook 문서 작성

**Learning Path:**
- React 고급 패턴 (Hooks, Context)
- 성능 최적화 기법
- TypeScript 심화

---

## 🔧 Team 2: Platform (Backend Gateway)

### Overview
**Mission:** 안정적이고 확장 가능한 API 게이트웨이를 구축하여 모든 클라이언트 요청을 처리합니다.

**Workspace:** `/apps/api-gateway`

**Tech Stack:**
- Go (Primary) or Node.js (TypeScript)
- Gin (Go) / Express (Node.js)
- PostgreSQL
- Redis

### Team Composition

#### 2.1 Lead: Backend Architect
**Role:** 백엔드 아키텍처 설계 및 마이크로서비스 오케스트레이션

**Responsibilities:**
- API Gateway 아키텍처 설계
- 마이크로서비스 간 통신 프로토콜 정의 (REST/gRPC)
- 인증/인가 시스템 설계 (JWT, OAuth2)
- 데이터베이스 스키마 설계
- 성능 & 보안 감사

**Deliverables:**
- API 설계 문서 (OpenAPI Spec)
- 인증 플로우 다이어그램
- 데이터베이스 ERD

**KPIs:**
- API Response Time p95 < 200ms
- Uptime > 99.9%
- API Error Rate < 0.1%

#### 2.2 Senior Backend Engineer (Go)
**Focus:** 고성능 API 게이트웨이 개발

**Responsibilities:**
- Gin 프레임워크 기반 API 서버 개발
- Rate Limiting, CORS, 미들웨어 구현
- JWT 토큰 검증 & 갱신
- PostgreSQL 쿼리 최적화
- 부하 테스트 (K6, Locust)

**Tech Focus:**
- Go (Goroutines, Channels)
- GORM (ORM)
- Redis (Caching)

#### 2.3 Backend Engineer (Node.js)
**Focus:** WebSocket 서버 및 실시간 기능

**Responsibilities:**
- Socket.io 서버 구축
- 실시간 시장 데이터 스트리밍
- Kafka 컨슈머 개발
- 세션 관리 (Redis)
- 빌링 시스템 연동 (Stripe API)

**Tech Focus:**
- Node.js, TypeScript
- Socket.io
- Kafka.js

---

## 🧮 Team 3: Quant (AI & Quantitative Models)

### Overview
**Mission:** 데이터를 인사이트로 변환하는 AI/금융 모델을 개발합니다.

**Workspace:** `/services/quant-engine`

**Tech Stack:**
- Python 3.11+
- FastAPI
- PyTorch / TensorFlow
- Pandas, NumPy, SciPy
- OpenBB, QuantLib

### Team Composition

#### 3.1 Lead: Quant Lead / ML Engineer
**Role:** 금융 모델 및 AI 전략 수립

**Responsibilities:**
- 퀀트 모델 설계 (Black-Scholes, Factor Models)
- AI 모델 아키텍처 설계 (NLP, Time-Series)
- 모델 백테스팅 프레임워크 구축
- 학술 논문 리서치 & 구현
- 팀 멘토링

**Deliverables:**
- 모델 설계 문서
- 백테스트 결과 리포트
- API 엔드포인트 스펙

**KPIs:**
- Model Accuracy > 75%
- API Latency < 500ms
- Model Coverage (20+ models)

#### 3.2 Senior Quant Engineer
**Focus:** 전통 퀀트 모델 개발

**Responsibilities:**
- Black-Scholes 옵션 가격 계산
- CAPM, Fama-French 모델
- 포트폴리오 최적화 (Markowitz)
- 리스크 메트릭 계산 (VaR, CVaR)
- OpenBB 통합

**Tech Focus:**
- NumPy, SciPy
- QuantLib
- Statsmodels

#### 3.3 ML Engineer
**Focus:** AI/NLP 모델 개발

**Responsibilities:**
- 트윗/뉴스 센티먼트 분석 (BERT, FinBERT)
- SEC 보고서 NLP 파싱
- 시계열 예측 (LSTM, Transformer)
- 모델 훈련 파이프라인
- MLflow 실험 추적

**Tech Focus:**
- PyTorch
- Transformers (Hugging Face)
- Scikit-learn

---

## 📊 Team 4: Data (Data Engineering)

### Overview
**Mission:** 모든 외부 데이터를 수집, 정제하여 신뢰할 수 있는 데이터 인프라를 구축합니다.

**Workspace:** `/services/data-pipeline`

**Tech Stack:**
- Python
- Apache Airflow
- Apache Kafka
- ClickHouse
- Snowflake (Optional)

### Team Composition

#### 4.1 Lead: Data Architect
**Role:** 데이터 파이프라인 아키텍처 설계

**Responsibilities:**
- ETL/ELT 파이프라인 설계
- 데이터 웨어하우스 스키마 (Star/Snowflake)
- 데이터 품질 모니터링
- 데이터 거버넌스 정책
- Kafka 토픽 설계

**Deliverables:**
- 데이터 플로우 다이어그램
- 데이터 카탈로그
- SLA 정의 문서

**KPIs:**
- Data Freshness < 5 minutes
- Pipeline Success Rate > 99%
- Data Quality Score > 95%

#### 4.2 Senior Data Engineer
**Focus:** 실시간 데이터 파이프라인

**Responsibilities:**
- Kafka 프로듀서/컨슈머 개발
- 스트리밍 데이터 처리 (Flink/Spark)
- ClickHouse 테이블 최적화
- 데이터 파티셔닝 전략
- 모니터링 대시보드 (Grafana)

**Tech Focus:**
- Kafka
- ClickHouse
- Apache Flink

#### 4.3 Data Engineer
**Focus:** 배치 ETL 작업

**Responsibilities:**
- Airflow DAG 개발
- FRED, SEC EDGAR, X API 크롤링
- 데이터 정제 & 변환
- PostgreSQL → ClickHouse 마이그레이션
- 데이터 백업 & 복구

**Tech Focus:**
- Apache Airflow
- Pandas
- SQL

---

## 🎨 Team 5: SimViz (Simulation & Visualization)

### Overview
**Mission:** 추상적인 금융 모델을 시각적이고 인터랙티브한 경험으로 변환합니다.

**Workspace:** `/services/simviz-service`

**Tech Stack:**
- TypeScript (Frontend)
- Python (Backend)
- Three.js, D3.js, ECharts
- FastAPI

### Team Composition

#### 5.1 Lead: Visualization Architect
**Role:** 시각화 전략 및 기술 선택

**Responsibilities:**
- 3D/2D 시각화 라이브러리 선정
- 성능 최적화 (60 FPS 보장)
- Quant Engine과의 통합 설계
- 웹 컴포넌트 아키텍처
- UX 리서치 & A/B 테스트

**Deliverables:**
- 시각화 컴포넌트 라이브러리
- 성능 벤치마크
- 사용자 가이드

**KPIs:**
- Frame Rate > 60 FPS
- Load Time < 2s
- User Engagement (avg session > 10min)

#### 5.2 Senior Frontend Engineer (3D Specialist)
**Focus:** Three.js 기반 3D 시각화

**Responsibilities:**
- 글로벌 유동성 3D Globe 개발
- WebGL 셰이더 프로그래밍
- 3D 객체 최적화 (LOD, Culling)
- 애니메이션 시스템
- VR/AR 지원 (향후)

**Tech Focus:**
- Three.js
- React Three Fiber
- WebGL/GLSL

#### 5.3 Python Engineer (Simulation Backend)
**Focus:** 시뮬레이션 로직 구현

**Responsibilities:**
- FastAPI 시뮬레이션 엔드포인트
- Quant Engine API 호출 & 데이터 가공
- 네트워크 그래프 데이터 생성 (D3.js용)
- 캐싱 전략 (Redis)
- 부하 테스트

**Tech Focus:**
- Python, FastAPI
- NetworkX (그래프 알고리즘)
- Redis

---

## ⚙️ Team 6: Infra (DevOps)

### Overview
**Mission:** 모든 팀이 인프라 걱정 없이 개발에 집중할 수 있도록 자동화된 인프라를 제공합니다.

**Workspace:** `/infra`

**Tech Stack:**
- AWS / GCP
- Terraform
- Kubernetes (EKS/GKE)
- Docker
- GitHub Actions

### Team Composition

#### 6.1 Lead: DevOps Lead
**Role:** 인프라 전략 및 보안

**Responsibilities:**
- 클라우드 아키텍처 설계
- Kubernetes 클러스터 관리
- CI/CD 파이프라인 구축
- 보안 정책 수립
- 비용 최적화

**Deliverables:**
- Terraform 모듈
- K8s 매니페스트
- Runbook (장애 대응)

**KPIs:**
- Deployment Frequency (daily)
- Mean Time to Recovery < 30min
- Infrastructure Cost Growth < 20%/year

#### 6.2 DevOps Engineer (Kubernetes)
**Focus:** 컨테이너 오케스트레이션

**Responsibilities:**
- Helm 차트 개발
- Service Mesh 구축 (Istio)
- Auto-scaling 설정
- 네트워크 정책
- 시크릿 관리 (Vault)

**Tech Focus:**
- Kubernetes
- Helm
- Istio

#### 6.3 DevOps Engineer (Monitoring)
**Focus:** 관측성 (Observability)

**Responsibilities:**
- Prometheus 메트릭 수집
- Grafana 대시보드 구축
- ELK 로그 파이프라인
- Jaeger 분산 추적
- 알림 시스템 (PagerDuty)

**Tech Focus:**
- Prometheus, Grafana
- Elasticsearch, Kibana
- Jaeger

---

## 🔄 Cross-Team Collaboration

### Communication Protocols

| Scenario | Method | Frequency |
|----------|--------|-----------|
| **Daily Standup** | Slack (async) | Daily |
| **Sprint Planning** | Zoom | Bi-weekly |
| **Architecture Review** | In-person | Monthly |
| **Incident Response** | Slack + PagerDuty | As needed |
| **Code Review** | GitHub PR | Continuous |

### Ownership Matrix

| Domain | Primary Team | Supporting Teams |
|--------|--------------|------------------|
| **User Authentication** | Platform | UI, Infra |
| **Simulation Logic** | Quant | SimViz, Platform |
| **3D Visualization** | SimViz | UI, Quant |
| **Data Collection** | Data | Quant |
| **API Performance** | Platform | Infra |

### Decision Making

**RFC (Request for Comments) Process:**
1. Engineer proposes change in `/docs/rfcs/`
2. Tech Lead reviews (48h)
3. Team discussion (async in Slack)
4. Decision recorded in RFC

---

## 📚 Team Documentation

Each team maintains:
- **Team Handbook:** `/docs/teams/[TEAM_NAME]_HANDBOOK.md`
- **API Contracts:** `/docs/teams/[TEAM_NAME]_API.md`
- **Runbooks:** `/docs/teams/[TEAM_NAME]_RUNBOOK.md`

---

## 🎯 Hiring Roadmap

### Phase 1 (Month 1-3): Founding Team
- [ ] Tech Lead (Hired)
- [ ] Frontend Architect (Hiring)
- [ ] Backend Architect (Hiring)
- [ ] Quant Lead (Hiring)

### Phase 2 (Month 4-6): Core Team
- [ ] +2 Frontend Engineers
- [ ] +2 Quant Engineers
- [ ] +1 Data Architect
- [ ] +1 DevOps Lead

### Phase 3 (Month 7-12): Scaling
- [ ] +3 Backend Engineers
- [ ] +2 Data Engineers
- [ ] +2 DevOps Engineers
- [ ] +1 Product Manager

---

**Document Owner:** Tech Lead
**Review Cycle:** Quarterly
**Last Review:** 2025-10-31
