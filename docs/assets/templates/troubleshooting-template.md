---
title: "{{component_name}} Troubleshooting Guide"
type: troubleshooting
component: "{{component_id}}"
maintainer: "{{maintainer}}"
created: "{{date}}"
updated: "{{date}}"
tags:
    - troubleshooting
    - debug
    - support
    - "{{component_id}}"
aliases:
    - "{{component_name}} Debug Guide"
    - "{{component_name}} Issues"
status: "{{status}}"
severity_levels:
    - critical
    - high
    - medium
    - low
related:
    - "[[{{component_name}} Service Documentation]]"
    - "[[{{component_name}} Deployment Guide]]"
    - "[[Monitoring Dashboard]]"
escalation_contacts:
    - "{{service_owner}}"
    - "{{devops_team}}"
---

# {{component_name}} Troubleshooting Guide

> [!info] Template Variables
>
> -   `{{component_name}}`: Tên component/service
> -   `{{component_id}}`: ID component (ví dụ: user-service)
> -   `{{maintainer}}`: Người duy trì tài liệu
> -   `{{status}}`: Trạng thái (active/draft/deprecated)

## 📋 Mục Lục

-   [[#Tổng Quan]]
-   [[#Chẩn Đoán Nhanh]]
-   [[#Vấn Đề Thường Gặp]]
-   [[#Công Cụ Debug]]
-   [[#Vấn Đề Hiệu Suất]]
-   [[#Mã Lỗi]]
-   [[#Phân Tích Logs]]
-   [[#Quy Trình Chuyển Giao]]

## 🎯 Tổng Quan

> [!abstract] Troubleshooting Scope
> Tài liệu này cung cấp hướng dẫn khắc phục sự cố cho {{component_name}}.

### Scope

Tài liệu này cover các vấn đề:

-   [x] {{issue_category_1}}
-   [x] {{issue_category_2}}
-   [x] {{issue_category_3}}
-   [x] {{issue_category_4}}

### Before You Start

> [!warning] Prerequisites
> Đảm bảo bạn có đủ quyền truy cập trước khi troubleshoot.

#### Required Access

-   [ ] Service logs access
-   [ ] Monitoring dashboards access
-   [ ] Database read access (if needed)
-   [ ] Admin/debug privileges

#### Emergency Contacts

> [!danger] Chuyển Giao Khẩn Cấp
> Nếu gặp vấn đề nghiêm trọng, liên hệ ngay:

| Role             | Contact            | Availability   | Response Time |
| ---------------- | ------------------ | -------------- | ------------- |
| Service Owner    | {{service_owner}}  | 24/7           | < 15 mins     |
| DevOps Team      | {{devops_team}}    | Business hours | < 30 mins     |
| On-call Engineer | {{oncall_contact}} | 24/7           | < 5 mins      |

## ⚡ Chẩn Đoán Nhanh

> [!tip] Fast Health Check
> Chạy các lệnh sau để kiểm tra nhanh tình trạng service.

### Health Check Commands

```bash
# Service health
curl -f {{base_url}}/actuator/health || echo "❌ Service DOWN"

# Database connectivity
curl -f {{base_url}}/actuator/health/db || echo "❌ Database DOWN"

# Service metrics
curl -f {{base_url}}/actuator/metrics || echo "❌ Metrics unavailable"

# Check service logs (last 10 lines)
kubectl logs -n {{namespace}} deployment/{{service_name}} --tail=10
```

# Database connectivity

pg_isready -h db-host -p 5432 -U username || echo "DB DOWN"

# External dependencies

curl -f https://external-api.com/health || echo "External API DOWN"

````

### System Resources

```bash
# CPU and Memory
top -p $(pgrep java)

# Disk space
df -h

# Network connectivity
netstat -tulpn | grep :8080
````

### Service Status

```bash
# Docker container
docker ps | grep service-name
docker logs service-name --tail 50

# Kubernetes pod
kubectl get pods -l app=service-name
kubectl describe pod pod-name
kubectl logs pod-name --tail 50
```

## 🚨 Vấn Đề Thường Gặp

### 1. Service Won't Start

#### 🔍 **Symptoms**

-   Service fails to start
-   Port binding errors
-   Configuration errors in logs

#### 🔧 **Diagnosis Steps**

1. **Check port availability**

    ```bash
    netstat -tulpn | grep 8080
    # If port is in use, find the process
    lsof -i :8080
    ```

2. **Verify configuration**

    ```bash
    # Check environment variables
    env | grep -E "(DATABASE|REDIS|KAFKA)"

    # Validate configuration file
    yamllint config/application.yml
    ```

3. **Database connectivity**
    ```bash
    # Test database connection
    telnet db-host 5432
    # Or using psql
    psql -h db-host -U username -d database -c "SELECT 1;"
    ```

#### ✅ **Solutions**

**Port Already in Use:**

```bash
# Kill process using the port
kill -9 $(lsof -ti:8080)
# Or change port in configuration
```

**Database Connection Failed:**

```bash
# Check database status
systemctl status postgresql
# Or for Docker
docker ps | grep postgres

# Fix connection string
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**Missing Environment Variables:**

```bash
# Set required variables
export DATABASE_USERNAME=myuser
export DATABASE_PASSWORD=mypass
export REDIS_URL=redis://localhost:6379
```

### 2. High Memory Usage / OutOfMemoryError

#### 🔍 **Symptoms**

-   `java.lang.OutOfMemoryError` in logs
-   Service becomes unresponsive
-   High memory usage in monitoring

#### 🔧 **Diagnosis Steps**

1. **Check memory usage**

    ```bash
    # Java heap dump
    jcmd <pid> GC.run_finalization
    jcmd <pid> VM.memory_summary

    # System memory
    free -h
    cat /proc/meminfo
    ```

2. **Analyze heap dump**

    ```bash
    # Generate heap dump
    jcmd <pid> GC.dump_heap /tmp/heapdump.hprof

    # Or add JVM flag
    -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp
    ```

#### ✅ **Solutions**

**Increase Heap Size:**

```bash
# JVM options
export JAVA_OPTS="-Xmx2g -Xms1g"

# Or in Dockerfile
ENV JAVA_OPTS="-Xmx2g -Xms1g -XX:+UseG1GC"
```

**Optimize GC:**

```bash
# G1 Garbage Collector
-XX:+UseG1GC -XX:MaxGCPauseMillis=200

# For applications with large heaps
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC
```

**Memory Leak Detection:**

```bash
# Enable memory profiling
-XX:+PrintGCDetails -XX:+PrintGCTimeStamps -Xloggc:gc.log
```

### 3. Database Connection Pool Exhausted

#### 🔍 **Symptoms**

-   "Connection pool exhausted" errors
-   High response times
-   Connection timeout exceptions

#### 🔧 **Diagnosis Steps**

```sql
-- Check active connections
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';

-- Check connection pool metrics
SELECT * FROM pg_stat_database WHERE datname = 'your_database';
```

#### ✅ **Solutions**

**Increase Pool Size:**

```yaml
spring:
    datasource:
        hikari:
            maximum-pool-size: 20
            minimum-idle: 5
            connection-timeout: 20000
            idle-timeout: 300000
```

**Find Connection Leaks:**

```bash
# Enable connection leak detection
spring.datasource.hikari.leak-detection-threshold=60000
```

### 4. API Response Time Issues

#### 🔍 **Symptoms**

-   Slow API responses (>2 seconds)
-   Timeout errors
-   High P95/P99 latency

#### 🔧 **Diagnosis Steps**

1. **Check database queries**

    ```sql
    -- PostgreSQL slow query log
    SELECT query, calls, total_time, mean_time
    FROM pg_stat_statements
    ORDER BY mean_time DESC
    LIMIT 10;
    ```

2. **Profile application**
    ```bash
    # Enable profiling
    java -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=profile.jfr -jar app.jar
    ```

#### ✅ **Solutions**

**Database Optimization:**

```sql
-- Add missing indexes
CREATE INDEX idx_table_column ON table_name(column_name);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM table WHERE condition;
```

**Caching:**

```java
@Cacheable("resource")
public Resource findById(Long id) {
    return repository.findById(id);
}
```

### 5. External API Integration Failures

#### 🔍 **Symptoms**

-   HTTP 5xx errors from external APIs
-   Circuit breaker open state
-   API rate limit exceeded

#### 🔧 **Diagnosis Steps**

```bash
# Test external API
curl -v https://external-api.com/endpoint

# Check rate limiting headers
curl -I https://api.example.com/v1/endpoint
```

#### ✅ **Solutions**

**Implement Circuit Breaker:**

```java
@CircuitBreaker(name = "external-api", fallbackMethod = "fallbackMethod")
public String callExternalAPI() {
    // API call
}
```

**Add Retry Logic:**

```java
@Retryable(value = {Exception.class}, maxAttempts = 3)
public String callWithRetry() {
    // Implementation
}
```

## 🛠️ Debugging Tools

### Log Analysis

```bash
# Search for errors
grep -i "error\|exception" logs/application.log | tail -20

# Filter by timestamp
sed -n '/2024-01-15 10:00:00/,/2024-01-15 11:00:00/p' logs/application.log

# Count error types
grep -c "OutOfMemoryError\|SQLException\|TimeoutException" logs/application.log
```

### Monitoring Commands

```bash
# Real-time metrics
watch -n 5 'curl -s http://localhost:8080/actuator/metrics/jvm.memory.used'

# Database connections
watch -n 2 'curl -s http://localhost:8080/actuator/metrics/hikaricp.connections.active'

# HTTP request metrics
curl -s http://localhost:8080/actuator/metrics/http.server.requests
```

### Profiling Tools

| Tool      | Purpose         | Command                                           |
| --------- | --------------- | ------------------------------------------------- |
| JProfiler | Java profiling  | `java -agentpath:/path/to/jprofiler -jar app.jar` |
| VisualVM  | JVM monitoring  | `jvisualvm --jdkhome $JAVA_HOME`                  |
| JStack    | Thread dump     | `jstack <pid> > threaddump.txt`                   |
| JMap      | Memory analysis | `jmap -dump:format=b,file=heapdump.hprof <pid>`   |

## 📊 Performance Issues

### Memory Analysis

```bash
# Memory usage over time
while true; do
  echo "$(date): $(ps -o pid,vsz,rss,comm -p $(pgrep java))"
  sleep 60
done > memory_usage.log

# Heap usage
jstat -gc <pid> 5s
```

### CPU Analysis

```bash
# CPU usage by thread
top -H -p <pid>

# Java thread dump
kill -3 <pid>  # Sends SIGQUIT to generate thread dump
```

### Database Performance

```sql
-- PostgreSQL performance analysis
SELECT schemaname, tablename,
       n_tup_ins, n_tup_upd, n_tup_del,
       n_live_tup, n_dead_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Index usage
SELECT schemaname, tablename, indexname,
       idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 📋 Error Codes Reference

| Error Code | Description                | Severity | Action             |
| ---------- | -------------------------- | -------- | ------------------ |
| `SVC_001`  | Database connection failed | Critical | Check DB status    |
| `SVC_002`  | External API timeout       | Warning  | Check API status   |
| `SVC_003`  | Authentication failed      | Info     | Check credentials  |
| `SVC_004`  | Validation error           | Info     | Check input data   |
| `SVC_005`  | Resource not found         | Info     | Verify resource ID |

### HTTP Status Codes

| Status | Meaning               | Common Causes                    |
| ------ | --------------------- | -------------------------------- |
| 400    | Bad Request           | Invalid input, validation errors |
| 401    | Unauthorized          | Missing/invalid authentication   |
| 403    | Forbidden             | Insufficient permissions         |
| 404    | Not Found             | Resource doesn't exist           |
| 429    | Too Many Requests     | Rate limiting                    |
| 500    | Internal Server Error | Application errors               |
| 502    | Bad Gateway           | Upstream service issues          |
| 503    | Service Unavailable   | Service overloaded               |
| 504    | Gateway Timeout       | Upstream timeout                 |

## 📝 Logs Analysis

### Log Levels and Patterns

```bash
# Error pattern analysis
grep -E "ERROR|FATAL" logs/application.log | \
  awk '{print $4}' | sort | uniq -c | sort -nr

# Warning patterns
grep "WARN" logs/application.log | \
  cut -d' ' -f5- | sort | uniq -c | sort -nr

# Response time analysis
grep "Request processed" logs/application.log | \
  awk '{print $NF}' | awk '{sum+=$1; count++} END {print "Average:", sum/count "ms"}'
```

### Structured Log Queries

```bash
# JSON log parsing (if using structured logging)
jq '.level | select(. == "ERROR")' logs/application.json

# Filter by timestamp
jq 'select(.timestamp >= "2024-01-15T10:00:00Z")' logs/application.json

# Count by error type
jq -r '.exception.class' logs/application.json | sort | uniq -c
```

## 🚨 Escalation Process

### Severity Levels

| Level             | Description             | Response Time     | Actions                |
| ----------------- | ----------------------- | ----------------- | ---------------------- |
| **P0 - Critical** | Service completely down | 15 minutes        | Page on-call, war room |
| **P1 - High**     | Major feature broken    | 1 hour            | Notify team lead       |
| **P2 - Medium**   | Performance degradation | 4 hours           | Create ticket          |
| **P3 - Low**      | Minor issues            | Next business day | Regular workflow       |

### Escalation Steps

1. **Self-Service** (0-30 mins)

    - Check this troubleshooting guide
    - Review monitoring dashboards
    - Check recent deployments

2. **Team Support** (30 mins - 2 hours)

    - Post in team Slack channel
    - Tag relevant team members
    - Provide logs and context

3. **Engineering Lead** (2+ hours)

    - Escalate to @engineering-lead
    - Prepare incident summary
    - Consider rollback options

4. **Management** (Critical issues)
    - Notify @engineering-manager
    - Prepare customer communication
    - Coordinate with other teams

### Incident Template

```markdown
## Incident Summary

**Time**: 2024-01-15 10:30 UTC
**Severity**: P1
**Impact**: API response times increased by 300%
**Affected Users**: ~1000 users

## Timeline

-   10:30 - Issue detected by monitoring
-   10:35 - Investigation started
-   10:45 - Root cause identified (database query)
-   11:00 - Fix deployed
-   11:15 - Service fully recovered

## Root Cause

Missing database index on frequently queried column

## Resolution

Added index: `CREATE INDEX idx_table_column ON table(column)`

## Follow-up Actions

-   [ ] Add monitoring for query performance
-   [ ] Review similar queries
-   [ ] Update deployment checklist
```

## 📞 Getting Help

### Internal Resources

-   💬 **Slack**: #team-support
-   📧 **Email**: team-support@company.com
-   📱 **On-call**: +1-xxx-xxx-xxxx
-   🎫 **Tickets**: [Internal Ticketing System](https://tickets.company.com)

### External Resources

-   📚 [Knowledge Base](https://docs.company.com)
-   🏢 [Vendor Support](https://support.vendor.com)
-   💬 [Community Forum](https://community.technology.com)

---

**Last Updated**: [Date]  
**Version**: 1.0  
**Maintainer**: [Team Name]
