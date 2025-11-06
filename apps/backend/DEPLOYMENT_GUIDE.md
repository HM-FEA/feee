# Nexus-Alpha Backend - Deployment Guide

Complete guide for deploying Nexus-Alpha backend to production.

## Pre-Deployment Checklist

- [ ] All tests passing: `pytest test_api.py -v`
- [ ] Environment variables configured in `.env`
- [ ] Database migrations ready
- [ ] API endpoints documented
- [ ] Error handling implemented
- [ ] Caching configured
- [ ] Security settings applied

## Deployment Options

### Option 1: Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
```

**URL:** `http://localhost:8000`

### Option 2: Docker (Recommended for Production)

```bash
# Build image
docker build -t nexus-alpha-backend:latest .

# Run with environment variables
docker run -d \
  --name nexus-backend \
  -p 8000:8000 \
  -e OPENAI_API_KEY=sk-xxx \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_ENABLED=True \
  nexus-alpha-backend:latest
```

### Option 3: Docker Compose (Full Stack)

```bash
# Start all services (backend + postgres + redis)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

Services started:
- **Backend:** http://localhost:8000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379
- **pgAdmin:** http://localhost:5050 (optional)
- **Redis Commander:** http://localhost:8081 (optional)

## Cloud Deployment

### Railway.app (Recommended)

```bash
# 1. Create Railway account and project
# 2. Connect GitHub repository
# 3. Add environment variables in Railway dashboard
# 4. Deploy

# Key environment variables to set:
# OPENAI_API_KEY=sk-xxx
# DATABASE_URL=postgresql://...
# ENVIRONMENT=production
```

### Vercel

Vercel is primarily for frontend, but can host API:

```bash
# Add vercel.json
{
  "buildCommand": "pip install -r requirements.txt",
  "outputDirectory": "./",
  "functions": {
    "main.py": {
      "memory": 3008,
      "maxDuration": 300
    }
  }
}
```

### AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu 22.04)
# 2. Install dependencies
sudo apt-get update
sudo apt-get install -y python3.13 python3-pip postgresql redis-server

# 3. Clone repository
git clone <repository>
cd nexus-alpha/apps/backend

# 4. Install Python requirements
pip install -r requirements.txt

# 5. Configure systemd service
sudo cp nexus-backend.service /etc/systemd/system/
sudo systemctl enable nexus-backend
sudo systemctl start nexus-backend

# 6. Configure nginx reverse proxy
sudo apt-get install -y nginx
```

**Nginx config:**
```nginx
upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    server_name api.nexus-alpha.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static API responses
    location /api/stock/ {
        proxy_pass http://backend;
        proxy_cache_valid 200 5m;
    }

    location /api/fundamental/ {
        proxy_pass http://backend;
        proxy_cache_valid 200 1h;
    }
}
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml nexus

# View services
docker service ls

# Scale service
docker service scale nexus_backend=3
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexus-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nexus-backend
  template:
    metadata:
      labels:
        app: nexus-backend
    spec:
      containers:
      - name: backend
        image: nexus-alpha-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: nexus-secrets
              key: openai-key
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: nexus-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: nexus-backend-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8000
  selector:
    app: nexus-backend
```

Deploy:
```bash
kubectl apply -f k8s-deployment.yaml
```

## Production Configuration

### Environment Variables

Create `.env.production`:

```env
ENVIRONMENT=production
DEBUG=False
RELOAD=False

DATABASE_URL=postgresql://user:pass@db-host:5432/nexus_alpha
REDIS_ENABLED=True
REDIS_HOST=redis-host
REDIS_PORT=6379

OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o

FRONTEND_URL=https://nexus-alpha.com
CORS_ALLOWED_ORIGINS=https://nexus-alpha.com,https://www.nexus-alpha.com

SECRET_KEY=your-production-secret-key-change-this
LOG_LEVEL=INFO
```

### Database Migration

```bash
# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### SSL/TLS Certificates

Using Let's Encrypt with Nginx:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.nexus-alpha.com
```

Update nginx config to use SSL:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/api.nexus-alpha.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nexus-alpha.com/privkey.pem;

    # ... rest of config
}

# Redirect http to https
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Monitoring

```bash
# Install Sentry for error tracking
pip install sentry-sdk

# Configure in main.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

### Logging Configuration

```python
# Configure structured logging
import structlog
import logging

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": structlog.stdlib.ProcessorFormatter,
            "processor": structlog.processors.JSONRenderer(),
        }
    },
    "handlers": {
        "default": {
            "class": "logging.StreamHandler",
            "formatter": "json"
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/nexus_alpha.log",
            "formatter": "json",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 10
        }
    }
})
```

### Prometheus Metrics

```bash
# Add prometheus to requirements.txt
pip install prometheus-client
```

### Health Checks

```bash
# Check application health
curl https://api.nexus-alpha.com/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2025-11-04T12:00:00Z"
}
```

## Backup & Recovery

### Database Backups

```bash
# Daily backup script (backup.sh)
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/nexus_db"

pg_dump -U nexus -h localhost nexus_alpha > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Schedule with cron:
```bash
# 2 AM daily
0 2 * * * /path/to/backup.sh
```

### Restore from Backup

```bash
# Decompress backup
gunzip backup_20251104_020000.sql.gz

# Restore database
psql -U nexus -h localhost nexus_alpha < backup_20251104_020000.sql
```

## Performance Optimization

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Run load test (1000 requests, 100 concurrent)
ab -n 1000 -c 100 http://localhost:8000/api/stock/AAPL

# Or use wrk for more detailed results
wrk -t12 -c400 -d30s http://localhost:8000/api/stock/AAPL
```

### Database Optimization

```sql
-- Create indexes for frequent queries
CREATE INDEX idx_stock_ticker ON stocks(ticker);
CREATE INDEX idx_price_stock_date ON stock_prices(stock_id, date DESC);
CREATE INDEX idx_report_date ON ai_reports(created_at DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM stock_prices WHERE stock_id = 1 ORDER BY date DESC LIMIT 10;
```

### Cache Warming

```python
# Pre-populate cache on startup
async def warmup_cache():
    popular_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
    for ticker in popular_tickers:
        await get_stock_price(ticker)
        await get_fundamental_analysis(ticker)
        await get_technical_analysis(ticker)
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Test connection
   psql -U nexus -h localhost -d nexus_alpha
   ```

2. **Redis connection failed**
   ```bash
   # Check Redis status
   redis-cli ping

   # Restart Redis
   sudo systemctl restart redis-server
   ```

3. **API returning 503 (Service Unavailable)**
   - Check database connection
   - Check Redis connection
   - Check OpenAI API key
   - Review application logs

4. **High memory usage**
   - Clear cache: `redis-cli FLUSHDB`
   - Restart application
   - Check for memory leaks in logs

### Debug Mode

Enable detailed logging:
```bash
# .env
LOG_LEVEL=DEBUG
ENVIRONMENT=development
```

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down
# or
systemctl stop nexus-backend

# Rollback to previous version
docker pull nexus-alpha-backend:previous
docker-compose up -d
# or
git revert <commit-hash>
systemctl start nexus-backend

# Verify
curl http://localhost:8000/api/health
```

## Security Hardening

### API Security

```python
# Rate limiting
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/stock/{ticker}")
@limiter.limit("100/minute")
async def get_stock_price(request: Request, ticker: str):
    pass
```

### Database Security

```sql
-- Create limited user (not admin)
CREATE USER api_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE nexus_alpha TO api_user;
GRANT USAGE ON SCHEMA public TO api_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO api_user;
```

### API Authentication (Optional)

```python
from fastapi.security import HTTPBearer, HTTPAuthCredential

security = HTTPBearer()

@app.get("/api/protected")
async def protected_endpoint(credentials: HTTPAuthCredential = Depends(security)):
    # Validate token
    pass
```

## Scaling

### Horizontal Scaling

```bash
# With Docker Swarm
docker service scale nexus_backend=5

# With Kubernetes
kubectl scale deployment nexus-backend --replicas=5

# With Docker Compose
docker-compose up -d --scale backend=3
```

### Database Connection Pooling

```python
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True
)
```

## Post-Deployment

1. Verify all endpoints are working
2. Monitor logs for errors
3. Set up alerting (Sentry, CloudWatch, etc)
4. Configure backups
5. Set up CDN for frontend
6. Configure DNS records
7. Test disaster recovery procedure
8. Document deployment process

## Support

For issues or questions:
- Check logs: `docker-compose logs backend`
- Review BACKEND_README.md
- Check application health: `/api/health`
