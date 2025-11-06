# 🔧 Nexus-Alpha API Gateway (Platform Service)

**Technology:** Go (Gin) or Node.js (Express) + TypeScript
**Team:** Team Platform (Backend)
**Port:** 8080 (HTTP), 8443 (HTTPS)

---

## 📖 Overview

The API Gateway (Platform Service) is the central entry point for all client requests. It handles:

- 🔐 **Authentication & Authorization**: JWT tokens, API keys, rate limiting
- 🔀 **Service Orchestration**: Routes requests to microservices (Quant, SimViz, Data)
- 🔌 **WebSocket Server**: Real-time data streaming to clients
- 💳 **Billing & Subscriptions**: Stripe integration, usage tracking
- 📊 **Metrics & Logging**: Prometheus metrics, structured logging

---

## 🚀 Quick Start (Go Version)

### Prerequisites
- Go 1.21+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation
```bash
# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=postgresql://user:pass@localhost:5432/nexus_alpha
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your-secret-here
```

### Development
```bash
# Run with hot reload (using air)
air

# Or run directly
go run cmd/api/main.go

# Run tests
go test ./...

# Run with coverage
go test -cover ./...

# Lint
golangci-lint run
```

### Building
```bash
# Build binary
go build -o bin/api-gateway cmd/api/main.go

# Run production build
./bin/api-gateway

# Build Docker image
docker build -t nexus-alpha/api-gateway:latest .
```

---

## 📁 Project Structure (Go)

```
apps/api-gateway/
├── cmd/
│   └── api/
│       └── main.go              # Application entrypoint
├── internal/
│   ├── api/
│   │   ├── middleware/
│   │   │   ├── auth.go          # JWT validation
│   │   │   ├── rate_limit.go    # Rate limiting
│   │   │   ├── cors.go          # CORS handling
│   │   │   └── logger.go        # Request logging
│   │   ├── routes/
│   │   │   ├── auth.go          # /api/v1/auth/*
│   │   │   ├── users.go         # /api/v1/users/*
│   │   │   ├── simulations.go   # /api/v1/simulations/*
│   │   │   └── billing.go       # /api/v1/billing/*
│   │   └── handlers/
│   │       ├── auth_handler.go
│   │       ├── user_handler.go
│   │       └── simulation_handler.go
│   ├── services/
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── simulation_service.go   # Calls Quant Engine
│   │   └── billing_service.go
│   ├── models/
│   │   ├── user.go
│   │   ├── simulation.go
│   │   └── subscription.go
│   ├── repositories/
│   │   ├── user_repository.go
│   │   └── simulation_repository.go
│   ├── websocket/
│   │   ├── hub.go               # WebSocket hub
│   │   ├── client.go            # Client connection
│   │   └── message.go           # Message types
│   ├── clients/
│   │   ├── quant_client.go      # HTTP client for Quant Engine
│   │   ├── simviz_client.go
│   │   └── data_client.go
│   └── config/
│       ├── config.go            # Configuration struct
│       └── database.go          # DB connection
├── pkg/
│   ├── jwt/
│   │   └── jwt.go               # JWT utilities
│   ├── logger/
│   │   └── logger.go            # Structured logger
│   └── errors/
│       └── errors.go            # Custom error types
├── migrations/
│   ├── 001_create_users.up.sql
│   ├── 002_create_simulations.up.sql
│   └── ...
├── tests/
│   ├── integration/
│   └── e2e/
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
└── README.md
```

---

## 🔐 Authentication Flow

### JWT Token Generation
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

func (s *AuthService) GenerateTokenPair(userID, email, tier string) (string, string, error) {
	// Access Token (15 minutes)
	accessClaims := Claims{
		UserID: userID,
		Email:  email,
		Tier:   tier,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "nexus-alpha",
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", "", err
	}

	// Refresh Token (7 days)
	refreshClaims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
```

### Auth Middleware
```go
// internal/api/middleware/auth.go
package middleware

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(*Claims)
		c.Set("user_id", claims.UserID)
		c.Set("user_tier", claims.Tier)

		c.Next()
	}
}
```

---

## 🚦 Rate Limiting

### Redis-Based Rate Limiter
```go
// internal/api/middleware/rate_limit.go
package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type RateLimiter struct {
	redis *redis.Client
}

func NewRateLimiter(redisClient *redis.Client) *RateLimiter {
	return &RateLimiter{redis: redisClient}
}

func (rl *RateLimiter) Middleware(requestsPerMinute int) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		if userID == "" {
			userID = c.ClientIP() // Fallback to IP for unauthenticated requests
		}

		key := fmt.Sprintf("rate_limit:%s", userID)
		ctx := context.Background()

		// Increment counter
		count, err := rl.redis.Incr(ctx, key).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "rate limit check failed"})
			c.Abort()
			return
		}

		// Set expiration on first request
		if count == 1 {
			rl.redis.Expire(ctx, key, time.Minute)
		}

		// Check limit
		if count > int64(requestsPerMinute) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "rate limit exceeded",
				"retry_after": 60,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
```

---

## 🔌 WebSocket Server

### WebSocket Hub
```go
// internal/websocket/hub.go
package websocket

import (
	"sync"
)

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.RUnlock()
		}
	}
}

func (h *Hub) BroadcastToUser(userID string, event string, data interface{}) {
	// Filter clients by userID and send message
	// Implementation depends on your client tracking
}
```

---

## 🧩 Service Orchestration

### Simulation Service (Calls Quant Engine)
```go
// internal/services/simulation_service.go
package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type SimulationService struct {
	quantEngineURL string
	httpClient     *http.Client
}

func (s *SimulationService) CreateSimulation(params SimulationParams) (*Simulation, error) {
	// 1. Validate user tier limits
	if !s.canRunSimulation(params.UserID, params.Tier) {
		return nil, fmt.Errorf("simulation limit reached for tier %s", params.Tier)
	}

	// 2. Call Quant Engine
	quantReq := QuantSimulationRequest{
		ScenarioType: params.ScenarioType,
		Parameters:   params.MarketConditions,
	}

	jsonData, _ := json.Marshal(quantReq)
	resp, err := s.httpClient.Post(
		fmt.Sprintf("%s/api/v1/simulations/interest-rate", s.quantEngineURL),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var quantResp QuantSimulationResponse
	json.NewDecoder(resp.Body).Decode(&quantResp)

	// 3. Save to database
	sim := &Simulation{
		UserID:    params.UserID,
		Type:      params.ScenarioType,
		Result:    quantResp,
		CreatedAt: time.Now(),
	}
	s.repo.Create(sim)

	// 4. Increment usage counter (Redis)
	s.incrementUsage(params.UserID)

	// 5. Send WebSocket update
	s.wsHub.BroadcastToUser(params.UserID, "simulation-complete", sim)

	return sim, nil
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
-- migrations/001_create_users.up.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Simulations Table
```sql
-- migrations/002_create_simulations.up.sql
CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    result JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_simulations_user_id ON simulations(user_id);
CREATE INDEX idx_simulations_created_at ON simulations(created_at DESC);
```

---

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
go test ./...

# Test specific package
go test ./internal/services

# With coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

Example:
```go
// internal/services/auth_service_test.go
package services

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestGenerateTokenPair(t *testing.T) {
	service := NewAuthService("test-secret")

	accessToken, refreshToken, err := service.GenerateTokenPair("user123", "test@example.com", "pro")

	assert.NoError(t, err)
	assert.NotEmpty(t, accessToken)
	assert.NotEmpty(t, refreshToken)
}
```

### Integration Tests
```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
go test -tags=integration ./tests/integration/...
```

---

## 📊 Monitoring

### Prometheus Metrics
```go
// internal/api/middleware/metrics.go
package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "path", "status"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "path"},
	)
)

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		timer := prometheus.NewTimer(httpRequestDuration.WithLabelValues(c.Request.Method, c.FullPath()))
		defer timer.ObserveDuration()

		c.Next()

		httpRequestsTotal.WithLabelValues(
			c.Request.Method,
			c.FullPath(),
			fmt.Sprintf("%d", c.Writer.Status()),
		).Inc()
	}
}
```

---

## 🚀 Deployment

### Docker
```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o api-gateway cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/api-gateway .
EXPOSE 8080

CMD ["./api-gateway"]
```

### Kubernetes
```yaml
# See /infra/kubernetes/applications/platform-service/deployment.yaml
kubectl apply -f /infra/kubernetes/applications/platform-service/
```

---

## 📚 Documentation

- **API Reference**: [OpenAPI Spec](./docs/openapi.yaml)
- **Team Handbook**: See `/docs/teams/TEAM_PLATFORM_HANDBOOK.md`
- **Architecture**: See `/docs/ARCHITECTURE.md`

---

## 🤝 Contributing

### Code Style
- Follow [Effective Go](https://go.dev/doc/effective_go)
- Use `gofmt` for formatting
- Run `golangci-lint` before committing

### PR Checklist
- [ ] Tests pass (`go test ./...`)
- [ ] Lint passes (`golangci-lint run`)
- [ ] API documentation updated
- [ ] Migration scripts added (if needed)

---

**Last Updated:** 2025-10-31
