# ⚙️ Team Platform: Backend Gateway Handbook

**Team:** Platform (Backend Gateway)
**Squad Size:** 3 engineers
**Workspace:** `/apps/api-gateway`

---

## 🎯 Team Mission

"우리는 초당 10만 건의 요청을 안정적으로 처리하는 확장 가능한 API 인프라를 구축합니다."

---

## 👥 Team Members & Roles

### Lead: Backend Architect
**Responsibilities:**
- API Gateway architecture design
- Microservices orchestration strategy
- Database schema design & optimization
- Security & authentication systems
- Performance benchmarking

### Senior Backend Engineer (Go)
**Focus:** High-performance API development
**Current Tasks:**
- [ ] Implement JWT refresh token logic
- [ ] Optimize PostgreSQL connection pooling
- [ ] Rate limiting middleware
- [ ] Load testing with K6

### Backend Engineer (Node.js)
**Focus:** WebSocket & real-time features
**Current Tasks:**
- [ ] WebSocket server with Socket.io
- [ ] Kafka consumer for market data
- [ ] Stripe billing integration
- [ ] Redis session management

---

## 🛠️ Technology Stack

### Option 1: Go (Recommended for Performance)
```go
// Tech Stack
- Language: Go 1.21+
- Framework: Gin or Fiber
- ORM: GORM
- Database: PostgreSQL 15+ (via pgx driver)
- Cache: Redis 7+
- Message Queue: Kafka
```

### Option 2: Node.js (Faster Development)
```typescript
// Tech Stack
- Language: TypeScript 5+
- Runtime: Node.js 20 LTS
- Framework: Express or Fastify
- ORM: Prisma
- Database: PostgreSQL 15+
- Cache: Redis 7+ (ioredis)
```

**Decision:** Team will decide in Week 1 based on:
- Team expertise
- Performance requirements
- Hiring availability

---

## 📁 Project Structure (Go Example)

```
apps/api-gateway/
├── cmd/
│   └── server/
│       └── main.go            # Entry point
├── internal/
│   ├── api/
│   │   ├── handlers/          # HTTP handlers
│   │   │   ├── auth.go
│   │   │   ├── simulations.go
│   │   │   └── users.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   ├── ratelimit.go
│   │   │   └── cors.go
│   │   └── routes.go
│   ├── models/                # Database models
│   │   ├── user.go
│   │   ├── simulation.go
│   │   └── subscription.go
│   ├── services/              # Business logic
│   │   ├── auth_service.go
│   │   ├── simulation_service.go
│   │   └── billing_service.go
│   ├── repository/            # Data access layer
│   │   ├── user_repo.go
│   │   └── simulation_repo.go
│   └── clients/               # External service clients
│       ├── quant_client.go    # Quant Engine
│       ├── simviz_client.go   # SimViz Service
│       └── stripe_client.go
├── pkg/
│   ├── config/                # Configuration
│   ├── logger/                # Logging
│   ├── jwt/                   # JWT utilities
│   └── validator/             # Input validation
├── migrations/                # Database migrations
│   ├── 001_create_users.sql
│   └── 002_create_simulations.sql
├── scripts/
│   ├── seed.go                # Test data
│   └── migrate.sh
├── .env.example
├── Dockerfile
├── go.mod
└── go.sum
```

---

## 🔐 Authentication System

### JWT Token Flow
```go
// internal/services/auth_service.go
package services

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
    UserID string `json:"user_id"`
    Email  string `json:"email"`
    Tier   string `json:"tier"` // free, pro, enterprise
    jwt.RegisteredClaims
}

func GenerateTokenPair(userID, email, tier string) (string, string, error) {
    // Access Token (15 minutes)
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
        UserID: userID,
        Email:  email,
        Tier:   tier,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    })

    // Refresh Token (7 days)
    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
        UserID: userID,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
        },
    })

    accessStr, _ := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))
    refreshStr, _ := refreshToken.SignedString([]byte(os.Getenv("JWT_REFRESH_SECRET")))

    return accessStr, refreshStr, nil
}
```

### Auth Middleware
```go
// internal/api/middleware/auth.go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"error": "missing authorization header"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims := &Claims{}

        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(401, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        c.Set("userID", claims.UserID)
        c.Set("tier", claims.Tier)
        c.Next()
    }
}
```

---

## 🔌 Microservices Communication

### Quant Engine Client
```go
// internal/clients/quant_client.go
package clients

import (
    "bytes"
    "encoding/json"
    "net/http"
)

type QuantClient struct {
    BaseURL string
    Client  *http.Client
}

type SimulationRequest struct {
    ScenarioType string         `json:"scenario_type"`
    Parameters   map[string]any `json:"parameters"`
}

type SimulationResponse struct {
    ID      string         `json:"id"`
    Results map[string]any `json:"results"`
}

func (c *QuantClient) RunSimulation(req SimulationRequest) (*SimulationResponse, error) {
    body, _ := json.Marshal(req)
    resp, err := c.Client.Post(
        c.BaseURL+"/api/v1/simulate",
        "application/json",
        bytes.NewBuffer(body),
    )
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var result SimulationResponse
    json.NewDecoder(resp.Body).Decode(&result)
    return &result, nil
}
```

### Service Orchestration Example
```go
// internal/services/simulation_service.go
func (s *SimulationService) CreateSimulation(params SimulationParams) (*Simulation, error) {
    // 1. Validate user tier limits
    if !s.canRunSimulation(params.UserID, params.Tier) {
        return nil, errors.New("simulation limit reached for your tier")
    }

    // 2. Call Quant Engine
    quantResp, err := s.quantClient.RunSimulation(QuantSimulationRequest{
        ScenarioType: params.ScenarioType,
        Parameters:   params.MarketConditions,
    })
    if err != nil {
        return nil, err
    }

    // 3. Save to database
    sim := &Simulation{
        ID:       uuid.New().String(),
        UserID:   params.UserID,
        Type:     params.ScenarioType,
        Results:  quantResp.Results,
        CreateTime: time.Now(),
    }
    s.repo.Create(sim)

    // 4. Increment usage counter (Redis)
    s.redis.Incr(fmt.Sprintf("user:%s:simulations:count", params.UserID))

    // 5. Send WebSocket update
    s.wsHub.BroadcastToUser(params.UserID, "simulation-complete", sim)

    return sim, nil
}
```

---

## 🚀 WebSocket Server (Node.js Example)

```typescript
// websocket/server.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket'],
});

// Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.data.userId} connected`);

  // Subscribe to channels
  socket.on('subscribe', (channel) => {
    socket.join(channel);
    console.log(`User subscribed to ${channel}`);
  });

  // Unsubscribe
  socket.on('unsubscribe', (channel) => {
    socket.leave(channel);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.data.userId} disconnected`);
  });
});

// Kafka consumer for market data
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'websocket-group' });

consumer.subscribe({ topic: 'market-updates' });
consumer.run({
  eachMessage: async ({ message }) => {
    const data = JSON.parse(message.value.toString());
    io.to('market-updates').emit('market-updates', data);
  },
});

httpServer.listen(8080);
```

---

## 🗄️ Database Design

### User Schema
```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Simulation Schema
```sql
-- migrations/002_create_simulations.sql
CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'macro', 'micro', 'crypto'
    parameters JSONB NOT NULL,
    results JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_simulations_user_id ON simulations(user_id);
CREATE INDEX idx_simulations_created_at ON simulations(created_at DESC);
```

### GORM Models (Go)
```go
// internal/models/user.go
type User struct {
    ID           string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    Email        string    `gorm:"uniqueIndex;not null" json:"email"`
    PasswordHash string    `gorm:"not null" json:"-"`
    Tier         string    `gorm:"default:free" json:"tier"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
}

// internal/models/simulation.go
type Simulation struct {
    ID         string                 `gorm:"type:uuid;primaryKey" json:"id"`
    UserID     string                 `gorm:"type:uuid;not null" json:"user_id"`
    Type       string                 `json:"type"`
    Parameters map[string]interface{} `gorm:"type:jsonb" json:"parameters"`
    Results    map[string]interface{} `gorm:"type:jsonb" json:"results"`
    Status     string                 `gorm:"default:pending" json:"status"`
    CreatedAt  time.Time             `json:"created_at"`
}
```

---

## 🧪 Testing

### Unit Tests (Go)
```go
// internal/services/auth_service_test.go
package services

import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestGenerateTokenPair(t *testing.T) {
    accessToken, refreshToken, err := GenerateTokenPair("user-123", "test@example.com", "pro")

    assert.NoError(t, err)
    assert.NotEmpty(t, accessToken)
    assert.NotEmpty(t, refreshToken)
}

func TestValidateToken(t *testing.T) {
    token, _, _ := GenerateTokenPair("user-123", "test@example.com", "free")
    claims, err := ValidateToken(token)

    assert.NoError(t, err)
    assert.Equal(t, "user-123", claims.UserID)
    assert.Equal(t, "free", claims.Tier)
}
```

### Integration Tests
```go
// internal/api/handlers/simulation_test.go
func TestCreateSimulation(t *testing.T) {
    // Setup test server
    router := setupTestRouter()
    w := httptest.NewRecorder()

    // Create request
    body := `{"scenario_type":"macro","parameters":{"base_rate":5.0}}`
    req, _ := http.NewRequest("POST", "/api/v1/simulations", strings.NewReader(body))
    req.Header.Set("Authorization", "Bearer "+testToken)
    req.Header.Set("Content-Type", "application/json")

    // Execute
    router.ServeHTTP(w, req)

    // Assert
    assert.Equal(t, 201, w.Code)

    var response map[string]interface{}
    json.Unmarshal(w.Body.Bytes(), &response)
    assert.NotNil(t, response["id"])
}
```

### Load Testing (K6)
```javascript
// scripts/load_test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up
    { duration: '3m', target: 1000 }, // Peak load
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const res = http.post('http://localhost:8080/api/v1/simulations', JSON.stringify({
    scenario_type: 'macro',
    parameters: { base_rate: Math.random() * 8 },
  }), {
    headers: {
      'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response has id': (r) => JSON.parse(r.body).id !== undefined,
  });
}
```

---

## 📊 Monitoring & Logging

### Structured Logging (Zap for Go)
```go
// pkg/logger/logger.go
import "go.uber.org/zap"

var Logger *zap.Logger

func Init() {
    Logger, _ = zap.NewProduction()
}

// Usage
Logger.Info("Simulation created",
    zap.String("user_id", userID),
    zap.String("simulation_id", simID),
    zap.String("type", simType),
)
```

### Prometheus Metrics
```go
// internal/api/middleware/metrics.go
import "github.com/prometheus/client_golang/prometheus"

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request latency",
            Buckets: prometheus.DefBuckets,
        },
        []string{"method", "endpoint"},
    )
)

func MetricsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        duration := time.Since(start).Seconds()

        httpRequestsTotal.WithLabelValues(c.Request.Method, c.FullPath(), fmt.Sprintf("%d", c.Writer.Status())).Inc()
        httpRequestDuration.WithLabelValues(c.Request.Method, c.FullPath()).Observe(duration)
    }
}
```

---

## 🚀 Deployment

### Dockerfile (Go)
```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/server

# Run stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

### docker-compose.yml (Local Development)
```yaml
version: '3.8'
services:
  api-gateway:
    build: ./apps/api-gateway
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/nexus
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: nexus
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

**Document Owner:** Backend Architect
**Last Updated:** 2025-10-31
**Review Cycle:** Monthly
