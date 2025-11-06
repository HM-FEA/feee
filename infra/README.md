# ⚙️ Nexus-Alpha Infrastructure

**Technology:** Terraform + Kubernetes + Docker
**Team:** Team Infra (DevOps)
**Cloud:** AWS (Primary), GCP (Optional)

---

## 📖 Overview

The Infrastructure workspace manages all cloud resources, deployment configurations, and observability tooling for Nexus-Alpha. It provides:

- ☁️ **Cloud Infrastructure**: EKS cluster, RDS, ElastiCache, VPC (Terraform)
- 🚢 **Kubernetes Deployments**: All application manifests, services, ingress
- 📊 **Monitoring Stack**: Prometheus, Grafana, ELK, Jaeger
- 🔐 **Secret Management**: HashiCorp Vault, Sealed Secrets
- 🔄 **CI/CD**: GitHub Actions workflows, ArgoCD GitOps

---

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured (`aws configure`)
- Terraform 1.6+
- kubectl 1.28+
- Helm 3.13+
- Docker 24+

### Initial Setup
```bash
# 1. Initialize Terraform backend (S3 + DynamoDB)
cd terraform/backend
terraform init
terraform apply

# 2. Create VPC and networking
cd terraform/environments/dev
terraform init
terraform apply -target=module.vpc

# 3. Create EKS cluster
terraform apply -target=module.eks

# 4. Configure kubectl
aws eks update-kubeconfig --name nexus-alpha-dev --region us-east-1

# 5. Install core K8s components
kubectl apply -f kubernetes/namespaces/
helm install nginx-ingress ingress-nginx/ingress-nginx
```

---

## 📁 Project Structure

```
infra/
├── terraform/                   # Infrastructure as Code
│   ├── modules/
│   │   ├── eks/                 # EKS cluster
│   │   ├── rds/                 # PostgreSQL RDS
│   │   ├── redis/               # ElastiCache Redis
│   │   ├── vpc/                 # Network setup
│   │   └── s3/                  # Object storage
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   └── backend.tf
├── kubernetes/                  # K8s manifests
│   ├── namespaces/
│   ├── applications/
│   │   ├── platform-service/
│   │   ├── quant-engine/
│   │   ├── simviz-service/
│   │   └── data-pipeline/
│   ├── databases/
│   │   ├── postgresql/
│   │   ├── redis/
│   │   └── clickhouse/
│   └── monitoring/
│       ├── prometheus/
│       ├── grafana/
│       └── elk/
├── helm/                        # Helm charts
│   └── nexus-alpha/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── docker/                      # Dockerfiles
│   ├── platform-service/
│   ├── quant-engine/
│   └── base-images/
├── scripts/
│   ├── setup-cluster.sh
│   ├── backup-db.sh
│   └── restore-db.sh
├── monitoring/
│   ├── grafana-dashboards/
│   └── prometheus-rules/
└── docs/
    └── runbooks/
```

---

## ☁️ Terraform Infrastructure

### 1. Create Production Environment
```bash
cd terraform/environments/production

# Initialize
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply (creates VPC, EKS, RDS, Redis)
terraform apply tfplan
```

### 2. EKS Cluster Configuration
```hcl
# terraform/modules/eks/main.tf (excerpt)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = "nexus-alpha-prod"
  cluster_version = "1.28"

  eks_managed_node_groups = {
    general = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      instance_types = ["t3.large"]
    }

    compute = {
      min_size     = 1
      max_size     = 5
      desired_size = 2
      instance_types = ["c5.xlarge"]
      capacity_type  = "SPOT"  # Cost savings
    }

    data = {
      min_size     = 1
      max_size     = 3
      desired_size = 1
      instance_types = ["r5.large"]  # Memory optimized
    }
  }
}
```

### 3. RDS PostgreSQL
```hcl
# terraform/modules/rds/main.tf (excerpt)
resource "aws_db_instance" "postgres" {
  identifier     = "nexus-alpha-prod-postgres"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.r5.xlarge"

  allocated_storage = 100
  storage_encrypted = true

  multi_az               = true
  backup_retention_period = 7

  performance_insights_enabled = true
}
```

---

## 🚢 Kubernetes Deployments

### Deploy Application
```bash
# Deploy Platform Service
kubectl apply -f kubernetes/applications/platform-service/

# Check status
kubectl get pods -n production

# View logs
kubectl logs -f deployment/platform-service -n production

# Scale deployment
kubectl scale deployment/platform-service --replicas=5 -n production
```

### Platform Service Deployment
```yaml
# kubernetes/applications/platform-service/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: platform-service
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: platform-service
    spec:
      containers:
      - name: platform-service
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/platform-service:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
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
---
apiVersion: v1
kind: Service
metadata:
  name: platform-service
  namespace: production
spec:
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
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
```

### Ingress with TLS
```yaml
# kubernetes/applications/platform-service/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexus-alpha-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
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
      - path: /api/v1
        pathType: Prefix
        backend:
          service:
            name: platform-service
            port:
              number: 8080
```

---

## 📊 Monitoring Stack

### 1. Install Prometheus
```bash
# Add Prometheus Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring/prometheus/values.yaml
```

### 2. Prometheus Alerts
```yaml
# monitoring/prometheus-rules/alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: nexus-alpha-alerts
  namespace: monitoring
spec:
  groups:
  - name: api-alerts
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
      annotations:
        summary: "High error rate on {{ $labels.service }}"

    - alert: ServiceDown
      expr: up{job="platform-service"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Service {{ $labels.job }} is down"
```

### 3. Grafana Dashboards
```bash
# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80

# Open http://localhost:3000
# Username: admin
# Password: prom-operator

# Import dashboards from monitoring/grafana-dashboards/
```

### 4. ELK Stack for Logging
```bash
# Install Elasticsearch
helm install elasticsearch elastic/elasticsearch \
  --namespace logging \
  --create-namespace

# Install Kibana
helm install kibana elastic/kibana --namespace logging

# Install Filebeat (on all nodes)
kubectl apply -f kubernetes/monitoring/elk/filebeat-daemonset.yaml

# Access Kibana
kubectl port-forward -n logging svc/kibana-kibana 5601:5601
```

---

## 🔐 Secret Management

### HashiCorp Vault
```bash
# Install Vault
helm install vault hashicorp/vault \
  --namespace vault \
  --create-namespace \
  --set server.ha.enabled=true

# Initialize and unseal
kubectl exec -it vault-0 -n vault -- vault operator init
kubectl exec -it vault-0 -n vault -- vault operator unseal <KEY_1>
kubectl exec -it vault-0 -n vault -- vault operator unseal <KEY_2>
kubectl exec -it vault-0 -n vault -- vault operator unseal <KEY_3>

# Store secrets
kubectl exec -it vault-0 -n vault -- vault kv put secret/platform/db \
  username="admin" \
  password="<SECURE_PASSWORD>"
```

### Sealed Secrets (Alternative)
```bash
# Install Sealed Secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Install kubeseal CLI
brew install kubeseal

# Create sealed secret
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=secret123 \
  --dry-run=client -o yaml | \
  kubeseal -o yaml > sealed-secret.yaml

# Apply sealed secret
kubectl apply -f sealed-secret.yaml
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

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

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

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          aws eks update-kubeconfig --name nexus-alpha-prod --region us-east-1
          kubectl set image deployment/platform-service \
            platform-service=$ECR_REGISTRY/platform-service:$IMAGE_TAG \
            -n production
          kubectl rollout status deployment/platform-service -n production
```

---

## 🚨 Incident Response

### Common Operations

#### Restart Crashed Service
```bash
kubectl rollout restart deployment/platform-service -n production
```

#### Scale Up During Traffic Spike
```bash
kubectl scale deployment/platform-service --replicas=10 -n production
```

#### Rollback Deployment
```bash
kubectl rollout undo deployment/platform-service -n production
```

#### View Logs
```bash
# Tail logs
kubectl logs -f deployment/platform-service -n production

# Last 100 lines
kubectl logs --tail=100 deployment/platform-service -n production

# All pods
kubectl logs -l app=platform-service -n production
```

#### Check Resource Usage
```bash
# Pod resource usage
kubectl top pods -n production

# Node resource usage
kubectl top nodes
```

---

## 💰 Cost Optimization

### Cost Monitoring Script
```bash
# scripts/cost-report.sh
#!/bin/bash

# Generate monthly AWS cost report
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --group-by Type=SERVICE

# Identify unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,CreateTime]' \
  --output table

# Check for unused load balancers
aws elbv2 describe-load-balancers \
  --query 'LoadBalancers[?State.Code==`active`]' \
  --output table
```

### Spot Instances for Cost Savings
- Use Spot instances for non-critical compute workloads
- Configure in `terraform/modules/eks/main.tf` with `capacity_type = "SPOT"`
- Estimated savings: 60-70% vs On-Demand

---

## 📋 Runbooks

### Database Backup
```bash
# scripts/backup-db.sh
#!/bin/bash

DB_HOST=$(aws rds describe-db-instances \
  --db-instance-identifier nexus-alpha-prod-postgres \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"

pg_dump -h $DB_HOST -U admin -d nexus_alpha > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://nexus-alpha-backups/db/$BACKUP_FILE

echo "Backup completed: $BACKUP_FILE"
```

### Certificate Renewal
```bash
# Cert-manager auto-renews Let's Encrypt certificates
# Check certificate status
kubectl get certificate -n production

# Force renewal
kubectl delete secret nexus-alpha-tls -n production
kubectl delete certificate nexus-alpha-tls -n production
kubectl apply -f kubernetes/applications/platform-service/ingress.yaml
```

---

## 📚 Documentation

- **Team Handbook**: `/docs/teams/TEAM_INFRA_HANDBOOK.md`
- **Architecture**: `/docs/ARCHITECTURE.md`
- **Runbooks**: `/infra/docs/runbooks/`

---

## 🔗 Useful Commands

```bash
# Get cluster info
kubectl cluster-info

# List all resources
kubectl get all -A

# Check node health
kubectl get nodes

# Describe pod
kubectl describe pod <pod-name> -n production

# Execute command in pod
kubectl exec -it <pod-name> -n production -- /bin/bash

# Port forward service
kubectl port-forward svc/platform-service 8080:8080 -n production

# View events
kubectl get events -n production --sort-by='.lastTimestamp'

# Delete all resources in namespace
kubectl delete all --all -n <namespace>
```

---

**Last Updated:** 2025-10-31
