# Error Handling Guide

## 📋 Tổng quan

Tài liệu này định nghĩa chiến lược xử lý lỗi toàn diện cho hệ thống My Digital Collection. Mục tiêu là cung cấp error handling nhất quán, meaningful error messages, và debugging capabilities tốt nhất cho developers và end-users.

## 🎯 Error Handling Principles

### 1. Consistency First

- **Standardized error format** across all services
- **Consistent error codes** và naming conventions  
- **Predictable error behavior** để client có thể handle properly

### 2. Developer-Friendly

- **Clear error messages** with actionable guidance
- **Detailed error context** để debugging dễ dàng
- **Request tracing** với unique request IDs

### 3. User Experience

- **Appropriate error disclosure** (không expose sensitive data)
- **Localized error messages** cho international users
- **Graceful degradation** khi possible

### 4. Operational Excellence

- **Comprehensive logging** cho all errors
- **Monitoring và alerting** cho critical errors
- **Error metrics** để improve system reliability

## 📊 HTTP Status Codes

### 1. Success Codes (2xx)

| Code | Status | Usage | Description |
|------|--------|-------|-------------|
| 200 | OK | GET, PUT, PATCH | Request successful |
| 201 | Created | POST | Resource created successfully |
| 202 | Accepted | Async operations | Request accepted for processing |
| 204 | No Content | DELETE | Resource deleted successfully |

### 2. Client Error Codes (4xx)

| Code | Status | Usage | Description |
|------|--------|-------|-------------|
| 400 | Bad Request | Invalid request format | Malformed request syntax |
| 401 | Unauthorized | Authentication required | Missing or invalid authentication |
| 403 | Forbidden | Authorization failed | Authenticated but insufficient permissions |
| 404 | Not Found | Resource missing | Requested resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method | HTTP method not supported for resource |
| 406 | Not Acceptable | Content negotiation | Requested format not supported |
| 409 | Conflict | Resource conflict | Resource already exists or conflicts |
| 410 | Gone | Resource removed | Resource permanently deleted |
| 412 | Precondition Failed | Conditional request | If-Match, If-None-Match conditions failed |
| 413 | Payload Too Large | Request size limit | Request entity too large |
| 415 | Unsupported Media Type | Content type | Request media type not supported |
| 422 | Unprocessable Entity | Validation error | Request syntax valid but semantically incorrect |
| 429 | Too Many Requests | Rate limiting | Rate limit exceeded |

### 3. Server Error Codes (5xx)

| Code | Status | Usage | Description |
|------|--------|-------|-------------|
| 500 | Internal Server Error | Unexpected error | Generic server error |
| 501 | Not Implemented | Missing functionality | Server doesn't support requested functionality |
| 502 | Bad Gateway | Upstream error | Invalid response from upstream server |
| 503 | Service Unavailable | Service down | Service temporarily unavailable |
| 504 | Gateway Timeout | Upstream timeout | Upstream server timeout |
| 507 | Insufficient Storage | Storage full | Server unable to store representation |

## 🔧 Error Response Format

### 1. Standard Error Response Schema

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "email": ["Invalid email format", "Email already exists"],
        "password": ["Password must be at least 8 characters"]
      },
      "validation_context": {
        "resource": "user_profile",
        "operation": "create"
      }
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789",
    "path": "/users/v1/profiles",
    "method": "POST"
  },
  "meta": {
    "api_version": "v1",
    "service": "user-service",
    "environment": "production"
  }
}
```

### 2. Error Response Fields

#### 2.1 Required Fields

- **`error.code`**: Machine-readable error identifier
- **`error.message`**: Human-readable error description
- **`error.timestamp`**: ISO 8601 timestamp của error
- **`error.request_id`**: Unique identifier để trace request

#### 2.2 Optional Fields

- **`error.details`**: Additional context và debugging information
- **`error.path`**: API endpoint path
- **`error.method`**: HTTP method
- **`error.user_message`**: User-friendly message (localized)
- **`meta`**: Service metadata

### 3. Error Response Examples

#### 3.1 Validation Error (422 Unprocessable Entity)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "username": [
          "Username must be between 3 and 50 characters",
          "Username can only contain letters, numbers, and underscores"
        ],
        "email": ["Invalid email format"],
        "age": ["Age must be at least 13"]
      },
      "validation_rules": {
        "username": "^[a-zA-Z0-9_]{3,50}$",
        "email": "email_format",
        "age": "min:13"
      }
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789",
    "path": "/users/v1/profiles",
    "method": "POST"
  }
}
```

#### 3.2 Authentication Error (401 Unauthorized)

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Authentication token is invalid or expired",
    "details": {
      "token_status": "expired",
      "expired_at": "2024-10-02T09:30:00Z",
      "refresh_available": true,
      "refresh_endpoint": "/auth/v1/refresh"
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

#### 3.3 Authorization Error (403 Forbidden)

```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to perform this action",
    "details": {
      "required_permissions": ["write:user_profile"],
      "user_permissions": ["read:user_profile"],
      "resource_id": "550e8400-e29b-41d4-a716-446655440000",
      "action": "update_profile"
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

#### 3.4 Resource Not Found (404 Not Found)

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource could not be found",
    "details": {
      "resource_type": "user_profile",
      "resource_id": "550e8400-e29b-41d4-a716-446655440000",
      "suggestions": [
        "Check if the user ID is correct",
        "Verify that the user exists and is active"
      ]
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

#### 3.5 Rate Limit Error (429 Too Many Requests)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later",
    "details": {
      "limit": 1000,
      "window_seconds": 3600,
      "remaining": 0,
      "reset_at": "2024-10-02T11:30:00Z",
      "retry_after_seconds": 60
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

#### 3.6 Business Logic Error (409 Conflict)

```json
{
  "error": {
    "code": "DUPLICATE_RESOURCE",
    "message": "A user with this email already exists",
    "details": {
      "conflicting_field": "email",
      "conflicting_value": "user@example.com",
      "existing_resource_id": "550e8400-e29b-41d4-a716-446655440000",
      "actions": [
        "Use a different email address",
        "Try logging in if this is your account",
        "Use password recovery if you forgot your password"
      ]
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

#### 3.7 Internal Server Error (500 Internal Server Error)

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later",
    "details": {
      "error_id": "err-789012345",
      "support_reference": "Please contact support with this reference ID"
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

## 📋 Error Code Catalog

### 1. Authentication Errors (AUTH_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTH_TOKEN_MISSING` | 401 | Authorization header missing |
| `AUTH_TOKEN_INVALID` | 401 | Token format invalid |
| `AUTH_TOKEN_EXPIRED` | 401 | Token has expired |
| `AUTH_TOKEN_REVOKED` | 401 | Token has been revoked |
| `AUTH_CREDENTIALS_INVALID` | 401 | Invalid username/password |
| `AUTH_2FA_REQUIRED` | 401 | Two-factor authentication required |
| `AUTH_2FA_INVALID` | 401 | Invalid 2FA code |
| `AUTH_ACCOUNT_LOCKED` | 401 | Account temporarily locked |
| `AUTH_ACCOUNT_SUSPENDED` | 401 | Account suspended |

### 2. Authorization Errors (AUTHZ_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTHZ_INSUFFICIENT_PERMISSIONS` | 403 | Missing required permissions |
| `AUTHZ_RESOURCE_ACCESS_DENIED` | 403 | Access denied to specific resource |
| `AUTHZ_ADMIN_REQUIRED` | 403 | Admin privileges required |
| `AUTHZ_OWNERSHIP_REQUIRED` | 403 | Resource ownership required |
| `AUTHZ_ACCOUNT_VERIFICATION_REQUIRED` | 403 | Account verification required |

### 3. Validation Errors (VALIDATION_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | General validation error |
| `VALIDATION_REQUIRED_FIELD` | 422 | Required field missing |
| `VALIDATION_FORMAT_INVALID` | 422 | Field format invalid |
| `VALIDATION_LENGTH_INVALID` | 422 | Field length invalid |
| `VALIDATION_VALUE_INVALID` | 422 | Field value invalid |
| `VALIDATION_TYPE_MISMATCH` | 422 | Field type mismatch |

### 4. Resource Errors (RESOURCE_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource already exists |
| `RESOURCE_CONFLICT` | 409 | Resource state conflict |
| `RESOURCE_GONE` | 410 | Resource permanently deleted |
| `RESOURCE_LOCKED` | 409 | Resource temporarily locked |
| `RESOURCE_LIMIT_EXCEEDED` | 409 | Resource limit exceeded |

### 5. Request Errors (REQUEST_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `REQUEST_MALFORMED` | 400 | Request syntax error |
| `REQUEST_METHOD_NOT_ALLOWED` | 405 | HTTP method not supported |
| `REQUEST_CONTENT_TYPE_UNSUPPORTED` | 415 | Content-Type not supported |
| `REQUEST_PAYLOAD_TOO_LARGE` | 413 | Request body too large |
| `REQUEST_RATE_LIMITED` | 429 | Rate limit exceeded |
| `REQUEST_TIMEOUT` | 408 | Request timeout |

### 6. Business Logic Errors (BUSINESS_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BUSINESS_RULE_VIOLATION` | 409 | Business rule violated |
| `BUSINESS_WORKFLOW_ERROR` | 409 | Invalid workflow state |
| `BUSINESS_QUOTA_EXCEEDED` | 409 | User quota exceeded |
| `BUSINESS_OPERATION_NOT_ALLOWED` | 409 | Operation not allowed in current state |
| `BUSINESS_DEPENDENCY_ERROR` | 409 | Dependent resource error |

### 7. External Service Errors (EXTERNAL_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EXTERNAL_SERVICE_UNAVAILABLE` | 503 | External service down |
| `EXTERNAL_SERVICE_TIMEOUT` | 504 | External service timeout |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service error |
| `EXTERNAL_API_RATE_LIMITED` | 503 | External API rate limited |
| `EXTERNAL_PAYMENT_ERROR` | 502 | Payment provider error |

### 8. System Errors (SYSTEM_*)

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `SYSTEM_INTERNAL_ERROR` | 500 | Internal system error |
| `SYSTEM_DATABASE_ERROR` | 500 | Database connection error |
| `SYSTEM_CACHE_ERROR` | 500 | Cache system error |
| `SYSTEM_QUEUE_ERROR` | 500 | Message queue error |
| `SYSTEM_STORAGE_ERROR` | 500 | File storage error |
| `SYSTEM_MAINTENANCE` | 503 | System under maintenance |

## 🔍 Error Context & Debugging

### 1. Request Tracing

#### 1.1 Request ID Generation

```javascript
// Generate unique request ID
const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Include in all log entries
logger.info('Processing request', { requestId, userId, endpoint });
```

#### 1.2 Distributed Tracing

```javascript
// Propagate trace context across services
const traceHeaders = {
  'X-Request-ID': requestId,
  'X-Trace-ID': traceId,
  'X-Span-ID': spanId,
  'X-Parent-Span-ID': parentSpanId
};
```

### 2. Error Correlation

#### 2.1 Error ID Mapping

```json
{
  "error": {
    "code": "SYSTEM_DATABASE_ERROR",
    "message": "Database connection failed",
    "details": {
      "error_id": "err-database-20241002-103045-abc123",
      "correlation_id": "corr-user-login-session-xyz789",
      "service_call_chain": [
        "api-gateway -> auth-service",
        "auth-service -> user-service", 
        "user-service -> database"
      ]
    }
  }
}
```

### 3. Error Context Enrichment

#### 3.1 User Context

```json
{
  "error": {
    "details": {
      "user_context": {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "user_type": "premium",
        "account_age_days": 365,
        "last_login": "2024-10-01T08:00:00Z"
      }
    }
  }
}
```

#### 3.2 System Context

```json
{
  "error": {
    "details": {
      "system_context": {
        "service_version": "1.2.3",
        "deployment_id": "deploy-20241001-v123",
        "server_instance": "user-service-pod-abc123",
        "region": "us-east-1",
        "environment": "production"
      }
    }
  }
}
```

## 📊 Error Monitoring & Alerting

### 1. Error Metrics

#### 1.1 Key Metrics to Track

- **Error Rate**: Percentage of requests resulting in errors
- **Error Distribution**: Breakdown by error type và HTTP status
- **Response Time**: P50, P95, P99 for error responses
- **Error Volume**: Total number of errors per time period
- **Service Availability**: Uptime percentage

#### 1.2 Metric Labels

```javascript
// Prometheus metrics example
const errorCounter = new prometheus.Counter({
  name: 'http_requests_errors_total',
  help: 'Total number of HTTP request errors',
  labelNames: ['service', 'endpoint', 'method', 'status_code', 'error_code']
});

errorCounter.labels({
  service: 'user-service',
  endpoint: '/v1/profiles',
  method: 'POST',
  status_code: '422',
  error_code: 'VALIDATION_ERROR'
}).inc();
```

### 2. Alerting Rules

#### 2.1 Critical Alerts

```yaml
# High error rate alert
- alert: HighErrorRate
  expr: rate(http_requests_errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value }}% over the last 5 minutes"

# Service down alert  
- alert: ServiceDown
  expr: up{job="user-service"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: "Service is down"
    description: "{{ $labels.job }} has been down for more than 1 minute"
```

#### 2.2 Warning Alerts

```yaml
# Increased 4xx errors
- alert: IncreasedClientErrors
  expr: rate(http_requests_errors_total{status_code=~"4.."}[10m]) > 10
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "Increased client errors"
    description: "4xx error rate is {{ $value }} per second"

# Database connection errors
- alert: DatabaseConnectionErrors
  expr: rate(database_connection_errors_total[5m]) > 0
  for: 1m
  labels:
    severity: warning
  annotations:
    summary: "Database connection issues"
    description: "Database connection errors detected"
```

### 3. Error Dashboards

#### 3.1 Service Health Dashboard

- **Error Rate Timeline**: Error percentage over time
- **Status Code Distribution**: Breakdown of HTTP status codes
- **Top Error Endpoints**: Most error-prone endpoints
- **Error Response Time**: Latency for error responses
- **Service Dependencies**: External service error rates

#### 3.2 Error Investigation Dashboard

- **Error Search**: Filter by error code, user, time range
- **Error Correlation**: Related errors và patterns
- **User Impact**: Affected users và business metrics
- **System Context**: Infrastructure metrics during errors

## 🔒 Security Considerations

### 1. Error Information Disclosure

#### 1.1 Production vs Development

```javascript
// Development environment
{
  "error": {
    "code": "SYSTEM_DATABASE_ERROR",
    "message": "Database connection failed",
    "details": {
      "sql_error": "Connection refused to postgres://localhost:5432/userdb",
      "stack_trace": "Error at DatabaseConnection.connect...",
      "internal_state": { "connection_pool_size": 10 }
    }
  }
}

// Production environment
{
  "error": {
    "code": "SYSTEM_INTERNAL_ERROR", 
    "message": "An unexpected error occurred. Please try again later",
    "details": {
      "error_id": "err-789012345",
      "support_contact": "support@mydigitalcollection.com"
    }
  }
}
```

#### 1.2 Sensitive Data Filtering

```javascript
// Filter sensitive information from error details
const sanitizeErrorDetails = (details) => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'credit_card'];
  
  return Object.keys(details).reduce((sanitized, key) => {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = details[key];
    }
    return sanitized;
  }, {});
};
```

### 2. Error Rate Limiting

#### 2.1 Prevent Error-Based Attacks

```javascript
// Rate limit failed authentication attempts
const authErrorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 failed attempts
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.ip}-${req.body.email}`,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'AUTH_RATE_LIMITED',
        message: 'Too many failed login attempts. Please try again later.'
      }
    });
  }
});
```

## 📝 Error Logging Strategy

### 1. Structured Logging

#### 1.1 Log Format

```json
{
  "timestamp": "2024-10-02T10:30:00Z",
  "level": "ERROR",
  "service": "user-service",
  "request_id": "req-123456789",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "http_status": 422,
    "endpoint": "/v1/profiles",
    "method": "POST"
  },
  "context": {
    "user_agent": "MyDigitalCollection-Client/1.0",
    "ip_address": "192.168.1.100",
    "session_id": "sess-abc123"
  },
  "stack_trace": "Error at ValidationService.validate...",
  "environment": "production",
  "version": "1.2.3"
}
```

### 2. Log Levels

| Level | Usage | Examples |
|-------|-------|----------|
| ERROR | System errors, exceptions | Database failures, external service errors |
| WARN | Business rule violations | Validation errors, rate limits |
| INFO | Normal operations | Successful requests, user actions |
| DEBUG | Detailed debugging | Request/response details, internal state |

### 3. Log Aggregation

#### 3.1 Centralized Logging

- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Structured logs** với JSON format
- **Log correlation** với request IDs
- **Real-time dashboards** cho error monitoring

#### 3.2 Log Retention

- **Production logs**: 90 days retention
- **Error logs**: 1 year retention
- **Audit logs**: 7 years retention (compliance)
- **Debug logs**: 7 days retention

## 🚀 Error Recovery Strategies

### 1. Retry Mechanisms

#### 1.1 Exponential Backoff

```javascript
const retryWithBackoff = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries || !isRetryableError(error)) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

#### 1.2 Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  async call(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### 2. Graceful Degradation

#### 2.1 Feature Toggles

```javascript
const featureFlags = {
  RECOMMENDATIONS_ENABLED: true,
  SOCIAL_FEATURES_ENABLED: true,
  PAYMENT_PROCESSING_ENABLED: true
};

// Disable features when dependencies fail
if (recommendationServiceDown) {
  featureFlags.RECOMMENDATIONS_ENABLED = false;
}
```

#### 2.2 Fallback Responses

```javascript
const getUserRecommendations = async (userId) => {
  try {
    return await recommendationService.getRecommendations(userId);
  } catch (error) {
    logger.warn('Recommendation service unavailable, using fallback', { userId });
    return getFallbackRecommendations(userId);
  }
};
```

---

**Last Updated**: 2024-10-02  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team

## 📚 Related Documentation

- [[API Standards Guide]] - API design standards và conventions
- [[Monitoring Implementation Guide]] - System monitoring setup
- [[Security Implementation Guide]] - Security best practices
- [[Logging Strategy Guide]] - Comprehensive logging approach
- [[Testing Strategy Guide]] - Error testing methodologies

## 🔗 External References

- [HTTP Status Codes](https://httpstatuses.com/)
- [RFC 7807 - Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807)
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines - Error Handling](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)