# API Documentation Overview

## 📋 Tổng quan

Thư mục này chứa tài liệu API chi tiết cho tất cả microservices trong hệ thống My Digital Collection. Tất cả APIs được document theo chuẩn OpenAPI 3.0 (Swagger) để đảm bảo consistency và automation support.

## 🗂️ Cấu trúc thư mục

```
swagger/
├── README.md                    # File này - tổng quan về API documentation
├── api-gateway.yaml            # API Gateway endpoints (future)
├── auth-service-api.yaml       # Authentication Service API
├── user-service-api.yaml       # User Service API
├── game-catalog-api.yaml       # Game Catalog Service API (future)
├── order-service-api.yaml      # Order Service API (future)
├── payment-service-api.yaml    # Payment Service API (future)
├── inventory-api.yaml          # Inventory Service API (future)
├── notification-api.yaml       # Notification Service API (future)
├── review-service-api.yaml     # Review Service API (future)
├── achievement-api.yaml        # Achievement Service API (future)
├── social-service-api.yaml     # Social Service API (future)
├── file-service-api.yaml       # File Service API (future)
└── shared-models.yaml          # Shared API models và schemas (future)
```

## 🎯 API Design Principles

### 1. RESTful Design

- **Resource-Based URLs**: `/users/{userId}/preferences`
- **HTTP Methods**: Proper use của GET, POST, PUT, PATCH, DELETE
- **Status Codes**: Meaningful HTTP status codes
- **Content Negotiation**: Support cho JSON (primary), form-data (uploads)

### 2. Consistency Standards

- **Naming Conventions**: snake_case cho JSON fields, camelCase cho query params
- **Date/Time Format**: ISO 8601 format (`2024-10-02T10:30:00Z`)
- **Pagination**: Consistent offset/limit pattern
- **Error Format**: Standardized error response structure

### 3. Security-First Approach

- **Authentication**: JWT Bearer token cho all protected endpoints
- **Authorization**: Role-based và resource-based access control
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: POST `/auth/v1/auth/login`
2. **Receive Tokens**: Access token (15 min) + Refresh token (30 days)
3. **API Calls**: Include `Authorization: Bearer {access_token}` header
4. **Token Refresh**: POST `/auth/v1/auth/refresh` when access token expires
5. **Logout**: POST `/auth/v1/auth/logout` to revoke tokens

### Security Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-Request-ID: unique-request-identifier
X-API-Version: v1
```

## 🌐 API Gateway & Service Discovery

### Service Endpoints

| Service | Base URL | Port | Status |
|---------|----------|------|--------|
| API Gateway | `https://api.mydigitalcollection.com` | 80/443 | Planning |
| Auth Service | `https://api.mydigitalcollection.com/auth/v1` | 8081 | ✅ Documented |
| User Service | `https://api.mydigitalcollection.com/users/v1` | 8082 | ✅ Documented |
| Game Catalog | `https://api.mydigitalcollection.com/games/v1` | 8083 | 📋 Planned |
| Order Service | `https://api.mydigitalcollection.com/orders/v1` | 8084 | 📋 Planned |
| Payment Service | `https://api.mydigitalcollection.com/payments/v1` | 8085 | 📋 Planned |

### Environment URLs

- **Production**: `https://api.mydigitalcollection.com`
- **Staging**: `https://staging-api.mydigitalcollection.com`
- **Development**: `http://localhost:8080` (API Gateway)

## 📊 API Standards & Conventions

### Request/Response Format

#### Success Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "gamer123",
  "display_name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-10-02T10:30:00Z",
  "updated_at": "2024-10-02T15:45:00Z"
}
```

#### Error Response
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2024-10-02T10:30:00Z",
  "request_id": "req-123456789"
}
```

#### Paginated Response
```json
{
  "data": [...],
  "pagination": {
    "total_count": 150,
    "limit": 20,
    "offset": 40,
    "has_next": true,
    "has_previous": true
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required/failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 🔍 API Testing & Validation

### Testing Tools

- **Postman Collections**: Pre-configured request collections
- **Newman**: Command-line test runner
- **Swagger UI**: Interactive API documentation
- **API Mocking**: Mock servers cho development

### Testing Categories

1. **Unit Tests**: Individual endpoint testing
2. **Integration Tests**: Cross-service API calls
3. **Contract Tests**: API contract validation
4. **Load Tests**: Performance và scalability
5. **Security Tests**: Authentication, authorization, input validation

## 📋 Error Handling Strategy

### Error Categories

#### Client Errors (4xx)

- **400 Bad Request**: Malformed request, invalid JSON
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource không tồn tại
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limiting

#### Server Errors (5xx)

- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: Upstream service error
- **503 Service Unavailable**: Service temporarily down
- **504 Gateway Timeout**: Upstream service timeout

### Error Response Schema

```yaml
ErrorResponse:
  type: object
  required:
    - error
    - message
  properties:
    error:
      type: string
      description: Machine-readable error code
      example: "VALIDATION_ERROR"
    message:
      type: string
      description: Human-readable error message
      example: "Request validation failed"
    details:
      type: object
      description: Additional error details
    timestamp:
      type: string
      format: date-time
      description: Error timestamp
    request_id:
      type: string
      description: Request ID for tracking
```

## 🔄 API Versioning Strategy

### Versioning Approach

- **URL Path Versioning**: `/v1/`, `/v2/`
- **Backward Compatibility**: Support previous version for migration period
- **Deprecation Notice**: Clear communication về version deprecation
- **Migration Guide**: Documentation cho version upgrades

### Version Lifecycle

1. **Development**: Alpha version (`/v1-alpha/`)
2. **Beta**: Beta testing (`/v1-beta/`)
3. **Stable**: Production release (`/v1/`)
4. **Deprecated**: Sunset period (`/v1/` with deprecation headers)
5. **Removed**: Version discontinued

## 📈 API Monitoring & Analytics

### Metrics & Monitoring

- **Response Times**: P50, P95, P99 latency
- **Error Rates**: 4xx và 5xx error rates
- **Throughput**: Requests per second
- **Availability**: Service uptime
- **Resource Usage**: CPU, memory, database connections

### Logging & Tracing

- **Request Logging**: Comprehensive request/response logging
- **Distributed Tracing**: End-to-end request tracing
- **Error Tracking**: Structured error reporting
- **Audit Trails**: Security và compliance logging

## 🛠️ Development Tools

### Code Generation

- **OpenAPI Generator**: Generate client SDKs
- **API Documentation**: Auto-generated docs từ specs
- **Mock Servers**: Development và testing
- **Validation**: Request/response validation

### Integration Tools

- **Postman**: API testing và documentation
- **Insomnia**: Alternative API client
- **HTTPie**: Command-line HTTP client
- **curl**: Basic HTTP testing

## 📚 Related Documentation

- [[API Design Guidelines]] - Detailed API design standards
- [[Authentication Guide]] - Authentication implementation
- [[Rate Limiting Guide]] - Rate limiting implementation
- [[API Testing Guide]] - Testing strategies và tools
- [[API Security Guide]] - Security best practices
- [[API Gateway Documentation]] - Gateway configuration và routing

## 🔗 External References

- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Design Guidelines](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [JWT Specification](https://jwt.io/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

**Last Updated**: 2024-10-02  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team