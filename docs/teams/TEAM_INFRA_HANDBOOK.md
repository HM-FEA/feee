# ⚙️ Team Infra: DevOps & Infrastructure Handbook

**Team:** Infra (DevOps)
**Squad Size:** 3 engineers
**Workspace:** `/infra`

---

## 🎯 Team Mission

"우리는 모든 팀이 인프라 걱정 없이 개발에 집중할 수 있도록 자동화되고 안정적이며 확장 가능한 인프라를 제공합니다."

---

## 👥 Team Roles

### Lead: DevOps Lead
- Cloud architecture design (AWS/GCP)
- Kubernetes cluster management
- CI/CD pipeline strategy
- Security & compliance
- Cost optimization

### DevOps Engineer (Kubernetes)
- Helm chart development
- Service mesh (Istio)
- Auto-scaling configuration
- Network policies
- Secret management (Vault)

### DevOps Engineer (Monitoring)
- Observability stack (Prometheus, Grafana)
- Log aggregation (ELK)
- Distributed tracing (Jaeger)
- Alerting & on-call
- Performance tuning

---

## 🛠️ Technology Stack

```yaml
# Cloud Providers
AWS: EKS, RDS, S3, CloudFront, Route53
GCP: GKE, Cloud SQL, Cloud Storage (Alternative)

# Container Orchestration
Kubernetes: 1.28+
Helm: 3.13+
Istio: 1.20+ (Service Mesh)

# Infrastructure as Code
Terraform: 1.6+
Terragrunt: (for multi-environment)

# CI/CD
GitHub Actions
ArgoCD: (GitOps for K8s)

# Monitoring
Prometheus: 2.48+
Grafana: 10.2+
Alertmanager: 0.26+

# Logging
Elasticsearch: 8.11+
Logstash: 8.11+
Kibana: 8.11+
Filebeat: 8.11+

# Tracing
Jaeger: 1.52+
OpenTelemetry: 1.21+

# Secret Management
HashiCorp Vault: 1.15+
Sealed Secrets (Bitnami)

# Container Registry
AWS ECR
Docker Hub (public images)
```

---

## 📁 Project Structure

```
infra/
├── terraform/                   # Infrastructure as Code
│   ├── modules/
│   │   ├── eks/                 # EKS cluster module
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── rds/                 # PostgreSQL RDS
│   │   ├── redis/               # ElastiCache
│   │   ├── vpc/                 # Network setup
│   │   └── s3/                  # Object storage
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   └── terraform.tfvars
│   │   ├── staging/
│   │   └── production/
│   └── backend.tf               # S3 backend for state
├── kubernetes/                  # K8s manifests
│   ├── namespaces/
│   │   ├── production.yaml
│   │   ├── data.yaml
│   │   └── monitoring.yaml
│   ├── applications/
│   │   ├── platform-service/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── hpa.yaml         # Horizontal Pod Autoscaler
│   │   │   └── ingress.yaml
│   │   ├── quant-engine/
│   │   ├── simviz-service/
│   │   └── data-pipeline/
│   ├── databases/
│   │   ├── postgresql/
│   │   │   ├── statefulset.yaml
│   │   │   └── pvc.yaml
│   │   ├── redis/
│   │   └── clickhouse/
│   └── monitoring/
│       ├── prometheus/
│       │   ├── deployment.yaml
│       │   ├── configmap.yaml
│       │   └── servicemonitor.yaml
│       ├── grafana/
│       └── elk/
├── helm/                        # Helm charts
│   ├── nexus-alpha/             # Umbrella chart
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   ├── values-dev.yaml
│   │   ├── values-prod.yaml
│   │   └── templates/
│   └── dependencies/
│       ├── kafka/
│       └── vault/
├── docker/                      # Dockerfiles
│   ├── platform-service/
│   │   └── Dockerfile
│   ├── quant-engine/
│   │   └── Dockerfile
│   └── base-images/
│       ├── node.Dockerfile
│       └── python.Dockerfile
├── scripts/                     # Utility scripts
│   ├── setup-cluster.sh
│   ├── backup-db.sh
│   ├── restore-db.sh
│   └── rotate-secrets.sh
├── monitoring/
│   ├── grafana-dashboards/
│   │   ├── api-performance.json
│   │   ├── database-metrics.json
│   │   └── kubernetes-overview.json
│   └── prometheus-rules/
│       ├── alerts.yaml
│       └── recording-rules.yaml
└── docs/
    ├── runbooks/
    │   ├── incident-response.md
    │   ├── scaling-guide.md
    │   └── disaster-recovery.md
    └── architecture/
        └── network-diagram.md
```

---

## ☁️ Cloud Infrastructure (Terraform)

### EKS Cluster Module
```hcl
# infra/terraform/modules/eks/main.tf
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.28"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  # Managed Node Groups
  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 10
      desired_size = 3

      instance_types = ["t3.large"]
      capacity_type  = "ON_DEMAND"

      labels = {
        workload = "general"
      }
    }

    compute = {
      min_size     = 1
      max_size     = 5
      desired_size = 2

      instance_types = ["c5.xlarge"]  # Compute optimized
      capacity_type  = "SPOT"         # Cost savings

      labels = {
        workload = "compute"
      }

      taints = [{
        key    = "workload"
        value  = "compute"
        effect = "NO_SCHEDULE"
      }]
    }

    data = {
      min_size     = 1
      max_size     = 3
      desired_size = 1

      instance_types = ["r5.large"]   # Memory optimized
      capacity_type  = "ON_DEMAND"

      labels = {
        workload = "data"
      }
    }
  }

  # Cluster addons
  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  # Enable IRSA (IAM Roles for Service Accounts)
  enable_irsa = true

  tags = {
    Environment = var.environment
    Project     = "nexus-alpha"
    Terraform   = "true"
  }
}

# IRSA for Platform Service (access to S3, RDS)
module "platform_irsa" {
  source = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"

  role_name = "platform-service-${var.environment}"

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["production:platform-service"]
    }
  }

  role_policy_arns = {
    s3_access = aws_iam_policy.s3_access.arn
    rds_access = aws_iam_policy.rds_access.arn
  }
}
```

### RDS PostgreSQL Module
```hcl
# infra/terraform/modules/rds/main.tf
resource "aws_db_instance" "postgres" {
  identifier     = "${var.cluster_name}-postgres"
  engine         = "postgres"
  engine_version = "15.4"

  instance_class    = var.instance_class  # db.t3.medium
  allocated_storage = 100
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.database_name
  username = var.master_username
  password = random_password.db_password.result

  # High Availability
  multi_az               = var.environment == "production" ? true : false
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"

  # Network
  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Performance Insights
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = true

  # Deletion protection
  deletion_protection = var.environment == "production" ? true : false
  skip_final_snapshot = var.environment != "production"

  tags = {
    Name        = "${var.cluster_name}-postgres"
    Environment = var.environment
  }
}

# Store password in Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.cluster_name}-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.db_password.result
    host     = aws_db_instance.postgres.address
    port     = aws_db_instance.postgres.port
    dbname   = var.database_name
  })
}
```

### Production Environment
```hcl
# infra/terraform/environments/production/main.tf
terraform {
  backend "s3" {
    bucket         = "nexus-alpha-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "nexus-alpha"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

module "vpc" {
  source = "../../modules/vpc"

  cluster_name = "nexus-alpha-prod"
  vpc_cidr     = "10.0.0.0/16"
  azs          = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = "nexus-alpha-prod"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnets
  environment         = "production"
}

module "rds" {
  source = "../../modules/rds"

  cluster_name    = "nexus-alpha-prod"
  instance_class  = "db.r5.xlarge"
  database_name   = "nexus_alpha"
  master_username = "admin"
  environment     = "production"
}

module "redis" {
  source = "../../modules/redis"

  cluster_name   = "nexus-alpha-prod"
  node_type      = "cache.r5.large"
  num_cache_nodes = 3
  environment    = "production"
}
```

---

## 🚢 Kubernetes Deployments

### Platform Service Deployment
```yaml
# infra/kubernetes/applications/platform-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platform-service
  namespace: production
  labels:
    app: platform-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: platform-service
  template:
    metadata:
      labels:
        app: platform-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: platform-service
      containers:
      - name: platform-service
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/platform-service:latest
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: PORT
          value: "8080"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        - name: QUANT_ENGINE_URL
          value: "http://quant-engine:8000"
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: platform-service
  namespace: production
  labels:
    app: platform-service
spec:
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: platform-service
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: platform-service
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: platform-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Ingress with HTTPS
```yaml
# infra/kubernetes/applications/platform-service/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexus-alpha-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://nexus-alpha.com"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.nexus-alpha.com
    secretName: nexus-alpha-tls
  rules:
  - host: api.nexus-alpha.com
    http:
      paths:
      - path: /api/v1/auth
        pathType: Prefix
        backend:
          service:
            name: platform-service
            port:
              number: 8080
      - path: /api/v1/simulations
        pathType: Prefix
        backend:
          service:
            name: quant-engine
            port:
              number: 8000
      - path: /api/v1/viz
        pathType: Prefix
        backend:
          service:
            name: simviz-service
            port:
              number: 8001
```

---

## 📊 Monitoring Stack

### Prometheus Configuration
```yaml
# infra/monitoring/prometheus-rules/alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: nexus-alpha-alerts
  namespace: monitoring
spec:
  groups:
  - name: api-alerts
    interval: 30s
    rules:
    - alert: HighErrorRate
      expr: |
        sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
        /
        sum(rate(http_requests_total[5m])) by (service)
        > 0.05
      for: 5m
      labels:
        severity: critical
        team: platform
      annotations:
        summary: "High error rate on {{ $labels.service }}"
        description: "{{ $labels.service }} has error rate of {{ $value | humanizePercentage }}"

    - alert: HighLatency
      expr: |
        histogram_quantile(0.95,
          rate(http_request_duration_seconds_bucket[5m])
        ) > 1
      for: 10m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "High latency on {{ $labels.service }}"
        description: "P95 latency is {{ $value }}s"

    - alert: ServiceDown
      expr: up{job="platform-service"} == 0
      for: 1m
      labels:
        severity: critical
        team: platform
      annotations:
        summary: "Service {{ $labels.job }} is down"
        description: "{{ $labels.job }} has been down for more than 1 minute"

  - name: database-alerts
    interval: 30s
    rules:
    - alert: HighDatabaseConnections
      expr: |
        pg_stat_database_numbackends{datname="nexus_alpha"}
        /
        pg_settings_max_connections
        > 0.8
      for: 5m
      labels:
        severity: warning
        team: infra
      annotations:
        summary: "High database connections"
        description: "Database connection usage is {{ $value | humanizePercentage }}"

    - alert: SlowQueries
      expr: |
        rate(pg_stat_statements_mean_exec_time[5m]) > 1000
      for: 10m
      labels:
        severity: warning
        team: platform
      annotations:
        summary: "Slow database queries detected"
```

### Grafana Dashboard
```json
{
  "title": "Nexus-Alpha API Performance",
  "panels": [
    {
      "title": "Request Rate",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total[5m])) by (service)"
        }
      ],
      "type": "graph"
    },
    {
      "title": "Error Rate",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)"
        }
      ],
      "type": "graph"
    },
    {
      "title": "P95 Latency",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
        }
      ],
      "type": "graph"
    }
  ]
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main
    paths:
      - 'apps/api-gateway/**'
      - 'services/**'

env:
  AWS_REGION: us-east-1
  EKS_CLUSTER: nexus-alpha-prod

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run unit tests
        run: |
          cd apps/api-gateway
          npm install
          npm test

      - name: Run integration tests
        run: |
          docker-compose up -d
          npm run test:integration

      - name: Code coverage
        run: npm run coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/platform-service:$IMAGE_TAG .
          docker push $ECR_REGISTRY/platform-service:$IMAGE_TAG
          docker tag $ECR_REGISTRY/platform-service:$IMAGE_TAG $ECR_REGISTRY/platform-service:latest
          docker push $ECR_REGISTRY/platform-service:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure kubectl
        run: |
          aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}

      - name: Deploy to Kubernetes
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          kubectl set image deployment/platform-service \
            platform-service=$ECR_REGISTRY/platform-service:$IMAGE_TAG \
            -n production

          kubectl rollout status deployment/platform-service -n production

      - name: Run smoke tests
        run: |
          ./scripts/smoke-tests.sh

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔐 Secret Management

### HashiCorp Vault Setup
```bash
# scripts/setup-vault.sh
#!/bin/bash

# Install Vault
helm repo add hashicorp https://helm.releases.hashicorp.com
helm install vault hashicorp/vault \
  --namespace vault \
  --create-namespace \
  --set server.ha.enabled=true \
  --set server.ha.replicas=3

# Initialize Vault
kubectl exec -it vault-0 -n vault -- vault operator init

# Unseal Vault (repeat for all replicas)
kubectl exec -it vault-0 -n vault -- vault operator unseal <UNSEAL_KEY_1>
kubectl exec -it vault-0 -n vault -- vault operator unseal <UNSEAL_KEY_2>
kubectl exec -it vault-0 -n vault -- vault operator unseal <UNSEAL_KEY_3>

# Enable Kubernetes auth
kubectl exec -it vault-0 -n vault -- vault auth enable kubernetes

# Create policy
kubectl exec -it vault-0 -n vault -- vault policy write platform-service - <<EOF
path "secret/data/platform/*" {
  capabilities = ["read"]
}
EOF

# Store secrets
kubectl exec -it vault-0 -n vault -- vault kv put secret/platform/db \
  username="admin" \
  password="<SECURE_PASSWORD>"
```

---

## 📋 Runbooks

### Incident Response
```markdown
# Incident Response Runbook

## Severity Levels
- **P0 (Critical)**: Service completely down, customer-facing impact
- **P1 (High)**: Degraded service, partial customer impact
- **P2 (Medium)**: Minor issues, internal impact
- **P3 (Low)**: Cosmetic issues, no immediate impact

## On-Call Rotation
- Primary: DevOps Engineer 1
- Secondary: DevOps Lead
- Escalation: CTO

## Response Steps

### 1. Acknowledge Alert (5 minutes)
- Check PagerDuty alert
- Join #incidents Slack channel
- Acknowledge alert in PagerDuty

### 2. Assess Impact (10 minutes)
- Check Grafana dashboards
- Review error logs in Kibana
- Determine affected services
- Communicate status in #incidents

### 3. Mitigate (30 minutes)
- Common fixes:
  - Restart crashed pods: `kubectl rollout restart deployment/<name> -n production`
  - Scale up: `kubectl scale deployment/<name> --replicas=5 -n production`
  - Rollback: `kubectl rollout undo deployment/<name> -n production`
- If database issue: Check RDS console, consider failover

### 4. Root Cause Analysis
- Collect logs: `kubectl logs -f deployment/<name> -n production`
- Check metrics in Prometheus
- Review recent deployments
- Document findings in post-mortem template

### 5. Resolution & Post-Mortem
- Mark incident as resolved in PagerDuty
- Schedule post-mortem meeting within 48 hours
- Create JIRA ticket for preventive measures
```

---

## 💰 Cost Optimization

### FinOps Best Practices
```bash
# scripts/cost-report.sh
#!/bin/bash

# Generate monthly cost report
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=SERVICE

# Identify unused resources
# 1. Unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,CreateTime]' \
  --output table

# 2. Idle ELBs
aws elbv2 describe-load-balancers \
  --query 'LoadBalancers[?State.Code==`active`]' \
  --output table

# 3. Underutilized RDS instances
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=nexus-alpha-prod-postgres \
  --start-time $(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 86400 \
  --statistics Average
```

---

## 📚 Recommended Resources

### Books
- "Kubernetes in Action" - Marko Lukša
- "Terraform: Up & Running" - Yevgeniy Brikman
- "The Phoenix Project" - Gene Kim

### Certifications
- AWS Certified Solutions Architect
- Certified Kubernetes Administrator (CKA)
- HashiCorp Certified: Terraform Associate

### Documentation
- Kubernetes Best Practices: https://kubernetes.io/docs/concepts/
- Terraform AWS Provider: https://registry.terraform.io/providers/hashicorp/aws
- Prometheus Operator: https://prometheus-operator.dev/

---

**Document Owner:** DevOps Lead
**Last Updated:** 2025-10-31
