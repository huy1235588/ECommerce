---
title: "{{service_name}} Hướng Dẫn Triển Khai"
type: triển khai
service: "{{service_id}}"
maintainer: "{{maintainer}}"
created: "{{date}}"
updated: "{{date}}"
tags:
    - triển khai
    - devops
    - "{{service_id}}"
    - kubernetes
    - docker
aliases:
    - "{{service_name}} Triển Khai"
    - "{{service_id}} Triển Khai"
status: "{{status}}"
environments:
    - phát triển
    - staging
    - sản xuất
related:
    - "[[{{service_name}} Tài Liệu Dịch Vụ]]"
    - "[[{{service_name}} Khắc Phục Sự Cố]]"
    - "[[Tổng Quan Cơ Sở Hạ Tầng]]"
---

# {{service_name}} Hướng Dẫn Triển Khai

> [!info] Biến Mẫu
>
> -   `{{service_name}}`: Tên dịch vụ (ví dụ: Dịch Vụ Người Dùng)
> -   `{{service_id}}`: ID dịch vụ (ví dụ: user-service)
> -   `{{maintainer}}`: Người duy trì triển khai
> -   `{{status}}`: Trạng thái (active/draft/deprecated)

## 📋 Mục Lục

-   [[#Tổng Quan]]
-   [[#Yêu Cầu Tiên Quyết]]
-   [[#Thiết Lập Môi Trường]]
-   [[#Triển Khai Local]]
-   [[#Triển Khai Staging]]
-   [[#Triển Khai Production]]
-   [[#Sau Triển Khai]]
-   [[#Quy Trình Rollback]]
-   [[#Giám Sát]]

## 🎯 Tổng Quan

> [!abstract] Chiến Lược Triển Khai
> **Dịch Vụ**: {{service_name}}  
> **Chiến Lược**: {{deployment_strategy}}  
> **Điều Khiển**: {{orchestration_platform}}  
> **CI/CD**: {{cicd_platform}}  
> **Người Duy Trì**: {{maintainer}}

### Deployment Environments

> [!info] Cấu Hình Môi Trường
> Mỗi môi trường có cấu hình và mục đích riêng biệt.

| Môi Trường   | Mục Đích          | URL                      | Tự Động Triển Khai    | Trạng Thái   |
| ------------ | ----------------- | ------------------------ | --------------------- | ------------ |
| **Local**    | Phát Triển        | localhost:{{local_port}} | Thủ Công              | 🟢 Hoạt Động |
| **Staging**  | Kiểm Tra Tích Hợp | {{staging_url}}          | Khi merge vào develop | 🟢 Hoạt Động |
| **Sản Xuất** | Dịch Vụ Sống      | {{production_url}}       | Khi release tag       | 🟢 Hoạt Động |

### Architecture Overview

```mermaid
graph LR
  A["Development\nlocalhost"] --> B["Staging\n{{staging_url}}"]
  B --> C["Production\n{{production_url}}"]

  A1["Local Docker"] -.-> A
  B1["Staging K8s"] -.-> B
  C1["Production K8s"] -.-> C

  D["GitHub Actions"] --> B1
  D --> C1
```

## 📋 Prerequisites

### Required Tools

| Công Cụ | Phiên Bản | Mục Đích           | Cài Đặt                                                    |
| ------- | --------- | ------------------ | ---------------------------------------------------------- |
| Docker  | 20+       | Containerization   | [Cài Đặt Docker](https://docs.docker.com/get-docker/)      |
| kubectl | 1.25+     | Kubernetes CLI     | [Cài Đặt kubectl](https://kubernetes.io/docs/tasks/tools/) |
| Helm    | 3.10+     | Trình Quản Lý Gói  | [Cài Đặt Helm](https://helm.sh/docs/intro/install/)        |
| AWS CLI | 2.0+      | Tài Nguyên Đám Mây | [Cài Đặt AWS CLI](https://aws.amazon.com/cli/)             |

### Access Requirements

-   [ ] GitHub repository access
-   [ ] Docker Hub push permissions
-   [ ] Kubernetes cluster access
-   [ ] AWS credentials configured
-   [ ] Staging environment access
-   [ ] Production deployment permissions

### Lệnh Xác Minh

```bash
# Xác minh cài đặt công cụ
docker --version
kubectl version --client
helm version
aws --version

# Kiểm tra kết nối cụm
kubectl cluster-info
kubectl get nodes

# Kiểm tra truy cập registry
docker login
echo "Kiểm tra thành công" | docker run -i --rm alpine cat
```

## 🛠️ Environment Setup

### Development Environment

#### 1. Clone Repository

```bash
git clone https://github.com/company/service-name.git
cd service-name
```

#### 2. Environment Variables

```bash
# Copy environment template
cp .env.template .env.local

# Edit configuration
vim .env.local
```

**Biến Cần Thiết:**

```bash
# Cơ sở dữ liệu
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
DATABASE_USERNAME=dev_user
DATABASE_PASSWORD=dev_password

# Redis
REDIS_URL=redis://localhost:6379

# API bên ngoài
EXTERNAL_API_KEY=your_api_key
EXTERNAL_API_URL=https://api.external.com

# Bảo mật
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

#### 3. Dependencies Setup

```bash
# Install dependencies
./mvnw clean install

# Setup database
docker-compose up -d postgres redis

# Run migrations
./mvnw flyway:migrate

# Verify setup
./mvnw test
```

### Staging Environment

#### Infrastructure

```bash
# Deploy infrastructure with Terraform
cd infrastructure/terraform/staging
terraform init
terraform plan
terraform apply

# Verify infrastructure
aws eks describe-cluster --name staging-cluster
```

#### Secrets Management

```bash
# Create Kubernetes secrets
kubectl create secret generic app-secrets \
  --from-literal=database-password=staging-password \
  --from-literal=api-key=staging-api-key \
  --namespace=staging

# Verify secrets
kubectl get secrets -n staging
```

### Production Environment

#### Infrastructure Validation

```bash
# Verify production infrastructure
kubectl get nodes --show-labels
kubectl get namespaces
kubectl get ingress -A

# Check resource quotas
kubectl describe quota -n production
```

## 🚀 Local Deployment

### Quick Start

```bash
# Start all dependencies
docker-compose up -d

# Build application
./mvnw clean package -DskipTests

# Run application
./mvnw spring-boot:run

# Verify deployment
curl http://localhost:8080/actuator/health
```

### Docker Deployment

#### 1. Build Image

```bash
# Build application JAR
./mvnw clean package

# Build Docker image
docker build -t service-name:local .

# Verify image
docker images | grep service-name
```

#### 2. Run Container

```bash
# Run with docker-compose
docker-compose -f docker-compose.local.yml up

# Or run individual container
docker run -d \
  --name service-name \
  -p 8080:8080 \
  --env-file .env.local \
  service-name:local

# Check container status
docker ps
docker logs service-name
```

#### 3. Health Checks

```bash
# Application health
curl http://localhost:8080/actuator/health

# Metrics endpoint
curl http://localhost:8080/actuator/metrics

# Test API endpoints
curl http://localhost:8080/api/v1/resources
```

## 🏗️ Staging Deployment

### Automated Deployment (CI/CD)

**Trigger**: Push to `develop` branch

```yaml
# .github/workflows/deploy-staging.yml
name: Triển Khai Sang Staging
on:
    push:
        branches: [develop]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Thiết Lập Java
              uses: actions/setup-java@v3
              with:
                  java-version: "21"

            - name: Xây Dựng Ứng Dụng
              run: ./mvnw clean package

            - name: Xây Dựng Hình Ảnh Docker
              run: |
                  docker build -t ${{ secrets.DOCKER_REGISTRY }}/service-name:${{ github.sha }} .
                  docker push ${{ secrets.DOCKER_REGISTRY }}/service-name:${{ github.sha }}

            - name: Triển Khai Sang Staging
              run: |
                  helm upgrade --install service-name \
                    ./helm/service-name \
                    --namespace staging \
                    --set image.tag=${{ github.sha }} \
                    --set environment=staging
```

### Manual Deployment

#### 1. Build and Push

```bash
# Build image
docker build -t myregistry/service-name:v1.2.3 .

# Push to registry
docker push myregistry/service-name:v1.2.3
```

#### 2. Deploy with Helm

```bash
# Add/update Helm repo
helm repo add myrepo https://charts.example.com
helm repo update

# Deploy to staging
helm upgrade --install service-name \
  myrepo/service-chart \
  --namespace staging \
  --set image.tag=v1.2.3 \
  --set environment=staging \
  --set replicas=2 \
  --values values/staging.yaml

# Check deployment status
kubectl rollout status deployment/service-name -n staging
```

#### 3. Verification

```bash
# Check pods
kubectl get pods -n staging -l app=service-name

# Check service
kubectl get service -n staging service-name

# Test endpoints
curl https://staging.example.com/api/v1/health

# Check logs
kubectl logs -n staging deployment/service-name --tail=50
```

## 🏭 Production Deployment

### Pre-deployment Checklist

-   [ ] Staging deployment successful
-   [ ] All tests passing
-   [ ] Performance tests completed
-   [ ] Security scans passed
-   [ ] Database migrations tested
-   [ ] Rollback plan prepared
-   [ ] Team notified
-   [ ] Monitoring alerts configured

### Deployment Process

#### 1. Tag Release

```bash
# Create release tag
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3
```

#### 2. Build Production Image

```bash
# Build production image
docker build -t myregistry/service-name:v1.2.3 .

# Security scan
docker scan myregistry/service-name:v1.2.3

# Push to production registry
docker push myregistry/service-name:v1.2.3
```

#### 3. Database Migration (if needed)

```bash
# Backup database
kubectl exec -n production postgres-0 -- \
  pg_dump -U username dbname > backup-$(date +%Y%m%d-%H%M%S).sql

# Run migration job
kubectl apply -f k8s/migration-job.yaml

# Verify migration
kubectl wait --for=condition=complete job/db-migration -n production --timeout=300s
```

#### 4. Blue-Green Deployment

```bash
# Deploy new version (green)
helm upgrade service-name \
  myrepo/service-chart \
  --namespace production \
  --set image.tag=v1.2.3 \
  --set environment=production \
  --set deployment.strategy=blue-green \
  --values values/production.yaml

# Wait for rollout to complete
kubectl rollout status deployment/service-name-green -n production

# Health check on green deployment
curl https://green.api.example.com/actuator/health

# Switch traffic to green
kubectl patch service service-name -n production -p \
  '{"spec":{"selector":{"version":"green"}}}'

# Verify traffic switch
curl https://api.example.com/actuator/info
```

#### 5. Cleanup Old Version

```bash
# Wait for traffic to stabilize (5-10 minutes)
sleep 600

# Scale down blue deployment
kubectl scale deployment service-name-blue --replicas=0 -n production

# Remove blue deployment after 24 hours
kubectl delete deployment service-name-blue -n production
```

## ✅ Post-Deployment

### Verification Steps

#### 1. Health Checks

```bash
# Application health
curl https://api.example.com/actuator/health

# Dependency health
curl https://api.example.com/actuator/health/components

# Load balancer health
kubectl get ingress -n production
```

#### 2. Functional Testing

```bash
# Smoke tests
./scripts/smoke-tests.sh production

# Integration tests
./mvnw test -Dtest=*IntegrationTest -Dspring.profiles.active=production-test

# End-to-end tests
npm run e2e:production
```

#### 3. Performance Verification

```bash
# Response time test
time curl https://api.example.com/api/v1/resources

# Load test
k6 run --vus 10 --duration 30s loadtest/api-test.js

# Memory usage
kubectl top pods -n production -l app=service-name
```

### Documentation Updates

-   [ ] Update deployment notes
-   [ ] Update API documentation
-   [ ] Update monitoring dashboards
-   [ ] Update incident runbooks
-   [ ] Notify stakeholders

## 🔄 Rollback Procedures

### Automatic Rollback Triggers

-   Health check failures for >5 minutes
-   Error rate >5% for >3 minutes
-   Response time P95 >2s for >5 minutes

### Manual Rollback

#### Quick Rollback (Same Version)

```bash
# Rollback Kubernetes deployment
kubectl rollout undo deployment/service-name -n production

# Verify rollback
kubectl rollout status deployment/service-name -n production
```

#### Full Version Rollback

```bash
# Rollback to previous version
helm rollback service-name 1 -n production

# Or deploy specific version
helm upgrade service-name \
  myrepo/service-chart \
  --namespace production \
  --set image.tag=v1.2.2 \
  --values values/production.yaml

# Verify rollback
curl https://api.example.com/actuator/info
```

#### Database Rollback (if needed)

```bash
# Restore database backup
kubectl exec -n production postgres-0 -- \
  psql -U username -d dbname < backup-20240115-103000.sql

# Verify data integrity
kubectl exec -n production postgres-0 -- \
  psql -U username -d dbname -c "SELECT COUNT(*) FROM main_table;"
```

### Post-Rollback

-   [ ] Verify service functionality
-   [ ] Update incident report
-   [ ] Investigate root cause
-   [ ] Plan fix and re-deployment

## 📊 Monitoring

### Key Metrics

| Chỉ Số                 | Ngưỡng    | Cảnh Báo     |
| ---------------------- | --------- | ------------ |
| Thời Gian Phản Hồi P95 | <2s       | Cảnh Báo     |
| Tỷ Lệ Lỗi              | <1%       | Nghiêm Trọng |
| Sử Dụng Bộ Nhớ         | <80%      | Cảnh Báo     |
| Sử Dụng CPU            | <70%      | Cảnh Báo     |
| Kết Nối Cơ Sở Dữ Liệu  | <80% pool | Cảnh Báo     |

### Health Checks

```bash
# Application health endpoint
curl https://api.example.com/actuator/health

# Kubernetes probes
kubectl describe pod <pod-name> -n production | grep -A5 "Liveness\|Readiness"

# Load balancer health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

### Logging

```bash
# Application logs
kubectl logs -n production deployment/service-name --tail=100 -f

# Structured log queries
kubectl logs -n production deployment/service-name | jq '.level | select(. == "ERROR")'

# Log aggregation
# Check Elasticsearch/ELK dashboard: https://logs.example.com
```

### Dashboards

-   **Service Overview**: https://grafana.example.com/d/service-overview
-   **Infrastructure**: https://grafana.example.com/d/infrastructure
-   **Business Metrics**: https://grafana.example.com/d/business-metrics

### Alerts

```yaml
# Example Prometheus alert rules
groups:
    - name: service-name.rules
      rules:
          - alert: HighErrorRate
            expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
            for: 3m
            labels:
                severity: critical
            annotations:
                summary: "Phát hiện tỷ lệ lỗi cao"

          - alert: HighResponseTime
            expr: http_request_duration_seconds{quantile="0.95"} > 2
            for: 5m
            labels:
                severity: warning
            annotations:
                summary: "Phát hiện thời gian phản hồi cao"
```

## 📞 Support & Escalation

### Deployment Issues

1. **Check deployment status**

    ```bash
    kubectl rollout status deployment/service-name -n production
    kubectl describe deployment service-name -n production
    ```

2. **Review logs**

    ```bash
    kubectl logs deployment/service-name -n production --tail=50
    ```

3. **Contact team**
    - Slack: #deployment-support
    - On-call: +1-xxx-xxx-xxxx
    - Email: devops@company.com

### Emergency Contacts

| Vai Trò            | Liên Hệ         | Leo Thang            |
| ------------------ | --------------- | -------------------- |
| Chủ Sở Hữu Dịch Vụ | @service-owner  | Liên hệ đầu tiên     |
| Trưởng DevOps      | @devops-lead    | Vấn đề cơ sở hạ tầng |
| Quản Lý Kỹ Thuật   | @eng-manager    | Sự cố lớn            |
| Kỹ Sư On-call      | +1-xxx-xxx-xxxx | Khẩn cấp 24/7        |

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Maintainer**: [Team Name]  
**Next Review**: [Date + 3 months]
