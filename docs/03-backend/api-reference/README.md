# API Reference Documentation

## 📋 Tổng quan

Thư mục này chứa tài liệu API reference toàn diện cho hệ thống My Digital Collection, bao gồm standards, conventions, error handling guidelines và OpenAPI specifications cho tất cả microservices.

## 🗂️ Cấu trúc thư mục

```
api-reference/
├── README.md                    # File này - tổng quan về API documentation
├── api-standards.md            # ✅ API design standards và conventions
├── error-handling.md           # ✅ Error handling strategies và guidelines
├── authentication-api.md       # 📋 Authentication patterns và examples (planned)
└── swagger/                    # OpenAPI specifications
    ├── README.md                  # ✅ API documentation overview
    ├── auth-service-api.yaml      # ✅ Authentication Service API spec
    ├── user-service-api.yaml      # ✅ User Service API spec
    ├── api-gateway.yaml           # 📋 API Gateway endpoints (planned)
    ├── game-catalog-api.yaml      # 📋 Game Catalog API spec (planned)
    ├── order-service-api.yaml     # 📋 Order Service API spec (planned)
    ├── payment-service-api.yaml   # 📋 Payment Service API spec (planned)
    ├── inventory-api.yaml         # 📋 Inventory Service API spec (planned)
    ├── notification-api.yaml      # 📋 Notification Service API spec (planned)
    ├── review-service-api.yaml    # 📋 Review Service API spec (planned)
    ├── achievement-api.yaml       # 📋 Achievement Service API spec (planned)
    ├── social-service-api.yaml    # 📋 Social Service API spec (planned)
    ├── file-service-api.yaml      # 📋 File Service API spec (planned)
    └── shared-models.yaml         # 📋 Shared API models và schemas (planned)
```

## 🎯 Documentation Philosophy

### 1. Documentation-First Approach

- **Design APIs** trong documentation trước khi implement
- **Contract-driven development** với OpenAPI specifications
- **Consumer-focused** design patterns
- **Comprehensive examples** cho all use cases

### 2. Consistency & Standards

- **Uniform API patterns** across all microservices
- **Standardized error handling** với predictable responses
- **Common authentication** và authorization patterns
- **Shared data models** để ensure compatibility

### 3. Developer Experience

- **Interactive documentation** với Swagger UI
- **Code examples** trong multiple languages
- **SDK generation** từ OpenAPI specs
- **Testing tools** và mock servers

## 📚 Core Documentation

### 1. [API Standards](./api-standards.md) ✅

Comprehensive guide covering:
- **RESTful design principles** và best practices
- **URL structure** và naming conventions
- **Request/response formats** và field standards
- **Authentication** và authorization patterns
- **Pagination, filtering, sorting** strategies
- **Versioning** và backward compatibility
- **Performance guidelines** và optimization
- **Rate limiting** policies

**Key Topics:**
- Resource-based URL design
- HTTP methods usage guidelines
- JSON field naming conventions (snake_case)
- Security headers và authentication
- Pagination với offset/cursor strategies
- API versioning với URL paths
- Response time targets và caching
- Rate limiting tiers based on user types

### 2. [Error Handling Guide](./error-handling.md) ✅

Detailed error handling strategy including:
- **HTTP status codes** usage guidelines
- **Standardized error response** format
- **Error code catalog** với descriptions
- **Error context** và debugging information
- **Monitoring** và alerting strategies
- **Security considerations** cho error disclosure
- **Recovery strategies** và retry mechanisms

**Key Features:**
- Consistent error response schema
- Comprehensive error code taxonomy
- Request tracing với unique IDs
- Error metrics và monitoring setup
- Security-conscious error disclosure
- Circuit breaker và retry patterns

### 3. [OpenAPI Specifications](./swagger/) ✅

Complete API specifications for:
- **Auth Service API** - Authentication, sessions, 2FA
- **User Service API** - Profiles, preferences, social features
- **Additional services** (planned for future releases)

**Current Coverage:**
- JWT authentication flow
- OAuth2 integration endpoints
- User profile management
- Friend system và social features
- Privacy settings và GDPR compliance
- Comprehensive request/response examples

## 🔧 API Development Workflow

### 1. Design Phase

1. **Define API contract** trong OpenAPI specification
2. **Review with stakeholders** để ensure requirements coverage
3. **Generate client SDKs** từ specifications
4. **Create mock servers** for early integration testing

### 2. Implementation Phase

1. **Implement backend services** following specifications
2. **Generate API documentation** từ code annotations
3. **Validate implementation** against OpenAPI specs
4. **Run integration tests** với generated clients

### 3. Deployment Phase

1. **Deploy API documentation** to developer portal
2. **Monitor API performance** và error rates
3. **Collect developer feedback** về API usability
4. **Iterate** based on usage patterns

## 🛠️ Development Tools

### 1. OpenAPI Ecosystem

- **Swagger Editor**: Edit và validate OpenAPI specs
- **Swagger UI**: Interactive API documentation
- **Swagger Codegen**: Generate client SDKs
- **Postman**: API testing với OpenAPI import
- **Newman**: Automated API testing

### 2. API Testing

```bash
# Install Newman for automated testing
npm install -g newman

# Run API tests from OpenAPI specs
newman run auth-service-api.yaml --environment production.json

# Generate SDK from OpenAPI spec  
swagger-codegen generate -i user-service-api.yaml -l javascript -o ./sdk/javascript
```

### 3. Documentation Generation

```bash
# Generate static documentation
redoc-cli build user-service-api.yaml --output docs/user-api.html

# Start development server
redoc-cli serve auth-service-api.yaml --watch
```

## 🔍 API Standards Summary

### 1. URL Conventions

```http
# Resource collections (plural nouns)
GET    /users
POST   /users
GET    /users/search

# Single resources (with ID)
GET    /users/{userId}
PUT    /users/{userId}
PATCH  /users/{userId}
DELETE /users/{userId}

# Nested resources
GET    /users/{userId}/preferences
POST   /users/{userId}/friends/request
GET    /games/{gameId}/reviews
```

### 2. Request/Response Format

```json
// Request format
{
  "field_name": "value",
  "created_at": "2024-10-02T10:30:00Z",
  "is_active": true,
  "nested_object": {
    "property": "value"
  }
}

// Success response format
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "gamer123",
  "created_at": "2024-10-02T10:30:00Z",
  "updated_at": "2024-10-02T15:45:00Z"
}

// Error response format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": {
        "email": ["Invalid email format"]
      }
    },
    "timestamp": "2024-10-02T10:30:00Z",
    "request_id": "req-123456789"
  }
}
```

### 3. Authentication Pattern

```http
# JWT Bearer token authentication
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required security headers
Content-Type: application/json; charset=utf-8
X-Request-ID: unique-request-identifier
X-API-Version: v1
```

## 📊 API Metrics & Monitoring

### 1. Key Performance Indicators

- **Response Time**: P50, P95, P99 latency
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Availability**: Service uptime percentage
- **Rate Limit Violations**: Blocked requests

### 2. Monitoring Dashboard

- **Service Health**: Overall API health status
- **Error Analysis**: Error breakdown by type
- **Performance Trends**: Response time trends
- **Usage Analytics**: Endpoint popularity
- **User Impact**: Affected users và business metrics

## 🚀 Future Roadmap

### Phase 1: Core Services (Current)
- ✅ Auth Service API
- ✅ User Service API
- ✅ API Standards documentation
- ✅ Error handling guidelines

### Phase 2: Game & Commerce (Next)
- 📋 Game Catalog Service API
- 📋 Order Service API  
- 📋 Payment Service API
- 📋 Inventory Service API

### Phase 3: Social & Content (Future)
- 📋 Review Service API
- 📋 Social Service API
- 📋 Achievement Service API
- 📋 Notification Service API

### Phase 4: Platform Services (Future)
- 📋 File Service API
- 📋 Analytics Service API
- 📋 Admin Service API
- 📋 Reporting Service API

## 🤝 Contributing Guidelines

### 1. API Design Process

1. **Create OpenAPI specification** for new APIs
2. **Follow established conventions** trong api-standards.md
3. **Include comprehensive examples** for all endpoints
4. **Document error responses** với appropriate status codes
5. **Add authentication** requirements where applicable

### 2. Documentation Standards

- **Use consistent formatting** và structure
- **Provide practical examples** cho common use cases
- **Include troubleshooting** information
- **Link to related documentation**
- **Keep documentation updated** với code changes

### 3. Review Process

1. **Technical review** của API design
2. **Security review** của authentication/authorization
3. **Performance review** của query patterns
4. **Documentation review** của clarity và completeness

---

**Last Updated**: 2024-10-02  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team

## 📚 Related Documentation

- [[Backend Architecture Overview]] - High-level system design
- [[Database Schemas Documentation]] - Data model specifications
- [[Security Implementation Guide]] - Security best practices
- [[Testing Strategy Guide]] - API testing approaches
- [[Deployment Guide]] - API deployment procedures

## 🔗 External References

- [OpenAPI Specification](https://swagger.io/specification/)
- [REST API Design Guidelines](https://restfulapi.net/)
- [HTTP Status Codes Reference](https://httpstatuses.com/)
- [JWT Authentication Guide](https://jwt.io/introduction/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)