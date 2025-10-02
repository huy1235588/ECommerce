# API Standards và Conventions

## 📋 Tổng quan

Tài liệu này định nghĩa các chuẩn API và conventions cho hệ thống My Digital Collection. Tất cả microservices phải tuân thủ các nguyên tắc này để đảm bảo consistency, maintainability và developer experience tốt nhất.

## 🎯 Nguyên tắc thiết kế API

### 1. RESTful Design Principles

#### 1.1 Resource-Based URLs

- **Sử dụng danh từ số nhiều** cho resource names
- **Hierarchy rõ ràng** để thể hiện relationships
- **Consistent naming** across all services

```http
✅ GOOD
GET /users/{userId}/preferences
GET /games/{gameId}/reviews
POST /orders/{orderId}/payments

❌ BAD
GET /getUserPreferences/{userId}
GET /game-review/{gameId}
POST /createPayment/{orderId}
```

#### 1.2 HTTP Methods Usage

| Method | Usage | Description | Idempotent |
|--------|-------|-------------|------------|
| GET | Retrieve data | Lấy thông tin resource | ✅ |
| POST | Create new resource | Tạo resource mới | ❌ |
| PUT | Update entire resource | Cập nhật toàn bộ resource | ✅ |
| PATCH | Partial update | Cập nhật một phần resource | ❌ |
| DELETE | Remove resource | Xóa resource | ✅ |

#### 1.3 Resource Collections vs Single Resource

```http
# Collections (plural nouns)
GET    /users              # List all users
POST   /users              # Create new user
GET    /users/search       # Search users

# Single Resource (with ID)
GET    /users/{userId}     # Get specific user
PUT    /users/{userId}     # Update entire user
PATCH  /users/{userId}     # Partial update user
DELETE /users/{userId}     # Delete user
```

### 2. URL Structure & Naming Conventions

#### 2.1 Base URL Pattern

```
https://api.mydigitalcollection.com/{service}/v{version}/{resource}
```

Examples:
- `https://api.mydigitalcollection.com/auth/v1/sessions`
- `https://api.mydigitalcollection.com/users/v1/profiles`
- `https://api.mydigitalcollection.com/games/v1/catalog`

#### 2.2 URL Naming Rules

1. **Lowercase letters only**: `/users/profiles` not `/Users/Profiles`
2. **Hyphens for word separation**: `/game-reviews` not `/game_reviews`
3. **No trailing slashes**: `/users` not `/users/`
4. **Version in URL path**: `/v1/users` not `?version=1`
5. **Consistent pluralization**: Always use plural nouns for collections

#### 2.3 Query Parameters

```http
# Filtering
GET /games?genre=action&platform=pc

# Sorting
GET /users?sort=created_at&order=desc

# Pagination
GET /reviews?limit=20&offset=40

# Search
GET /games/search?q=minecraft&category=sandbox

# Multiple values
GET /games?genres=action,rpg,strategy
```

## 📊 Request/Response Standards

### 1. Content Types

#### 1.1 Supported Content Types

- **Primary**: `application/json`
- **File uploads**: `multipart/form-data`
- **Form submission**: `application/x-www-form-urlencoded`

#### 1.2 Character Encoding

- **Always use UTF-8 encoding**
- Include charset in Content-Type header: `application/json; charset=utf-8`

### 2. Request Format

#### 2.1 Request Headers

```http
# Required headers
Content-Type: application/json; charset=utf-8
Authorization: Bearer {jwt_token}
X-Request-ID: unique-request-identifier

# Optional headers
Accept: application/json
User-Agent: MyDigitalCollection-Client/1.0
X-API-Version: v1
X-Client-Version: 1.2.3
```

#### 2.2 Request Body Format

```json
{
  "field_name": "value",
  "nested_object": {
    "property": "value"
  },
  "array_field": ["item1", "item2"],
  "timestamp_field": "2024-10-02T10:30:00Z",
  "boolean_field": true,
  "number_field": 42
}
```

#### 2.3 Field Naming Conventions

- **snake_case** for JSON fields: `user_id`, `created_at`, `display_name`
- **camelCase** for query parameters: `userId`, `createdAt`, `displayName`
- **Consistent field names** across all services
- **Descriptive names**: `is_active` not `active`, `created_at` not `created`

### 3. Response Format

#### 3.1 Success Response Structure

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "gamer123",
  "display_name": "John Doe",
  "email": "john@example.com",
  "is_verified": true,
  "preferences": {
    "theme": "dark",
    "language": "en"
  },
  "created_at": "2024-10-02T10:30:00Z",
  "updated_at": "2024-10-02T15:45:00Z"
}
```

#### 3.2 Collection Response Structure

```json
{
  "data": [
    {
      "id": "user-1",
      "username": "user1"
    },
    {
      "id": "user-2", 
      "username": "user2"
    }
  ],
  "pagination": {
    "total_count": 150,
    "limit": 20,
    "offset": 40,
    "has_next": true,
    "has_previous": true,
    "next_url": "/users?limit=20&offset=60",
    "previous_url": "/users?limit=20&offset=20"
  },
  "meta": {
    "request_id": "req-123456789",
    "timestamp": "2024-10-02T10:30:00Z",
    "api_version": "v1"
  }
}
```

#### 3.3 Empty Collections

```json
{
  "data": [],
  "pagination": {
    "total_count": 0,
    "limit": 20,
    "offset": 0,
    "has_next": false,
    "has_previous": false
  }
}
```

## 🔐 Security Standards

### 1. Authentication

#### 1.1 JWT Bearer Token

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 1.2 Token Validation

- **All protected endpoints** require valid JWT token
- **Token expiry** must be checked on every request
- **Invalid tokens** return 401 Unauthorized
- **Expired tokens** return 401 with specific error code

### 2. Authorization

#### 2.1 Role-Based Access Control (RBAC)

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "roles": ["user", "moderator"],
  "permissions": [
    "read:profile",
    "write:profile",
    "moderate:comments"
  ]
}
```

#### 2.2 Resource-Based Authorization

- **Ownership validation**: Users can only access their own resources
- **Permission checks**: Verify specific permissions for actions
- **Admin overrides**: Admin roles can access all resources (with audit)

### 3. Input Validation & Sanitization

#### 3.1 Request Validation

```json
{
  "email": {
    "required": true,
    "format": "email",
    "max_length": 255
  },
  "username": {
    "required": true,
    "pattern": "^[a-zA-Z0-9_]{3,50}$",
    "min_length": 3,
    "max_length": 50
  },
  "age": {
    "type": "integer",
    "minimum": 13,
    "maximum": 120
  }
}
```

#### 3.2 Data Sanitization

- **HTML encoding** cho text fields
- **SQL injection prevention** với parameterized queries
- **XSS protection** cho user-generated content
- **File upload validation** cho file types và sizes

## 📋 Pagination Standards

### 1. Offset-Based Pagination

#### 1.1 Query Parameters

```http
GET /users?limit=20&offset=40
```

#### 1.2 Response Format

```json
{
  "data": [...],
  "pagination": {
    "total_count": 1500,
    "limit": 20,
    "offset": 40,
    "current_page": 3,
    "total_pages": 75,
    "has_next": true,
    "has_previous": true,
    "next_url": "/users?limit=20&offset=60",
    "previous_url": "/users?limit=20&offset=20"
  }
}
```

### 2. Cursor-Based Pagination (for real-time data)

#### 2.1 Query Parameters

```http
GET /notifications?limit=20&cursor=eyJjcmVhdGVkX2F0IjoiMjAyNC0xMC0wMlQxMDozMDowMFoifQ
```

#### 2.2 Response Format

```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "has_next": true,
    "has_previous": true,
    "next_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMC0wMlQxMTozMDowMFoifQ",
    "previous_cursor": "eyJjcmVhdGVkX2F0IjoiMjAyNC0xMC0wMlQwOTozMDowMFoifQ"
  }
}
```

## 🔍 Filtering, Sorting & Search

### 1. Filtering

#### 1.1 Simple Filters

```http
GET /games?platform=pc&genre=action&price_max=50
```

#### 1.2 Complex Filters

```http
GET /games?filters=platform:pc,genre:action|rpg,price:10-50
```

### 2. Sorting

#### 2.1 Single Field Sorting

```http
GET /users?sort=created_at&order=desc
```

#### 2.2 Multiple Field Sorting

```http
GET /games?sort=rating:desc,price:asc,name:asc
```

### 3. Search

#### 3.1 Full-Text Search

```http
GET /games/search?q=minecraft&fields=title,description
```

#### 3.2 Advanced Search

```http
GET /games/search?q=title:minecraft AND genre:sandbox OR tag:building
```

## 📈 Versioning Strategy

### 1. URL Path Versioning

```http
https://api.mydigitalcollection.com/users/v1/profiles
https://api.mydigitalcollection.com/users/v2/profiles
```

### 2. Version Lifecycle

| Stage | Version | Description | Support Duration |
|-------|---------|-------------|------------------|
| Alpha | v1-alpha | Development testing | Development only |
| Beta | v1-beta | Public testing | 3 months |
| Stable | v1 | Production release | 12+ months |
| Deprecated | v1 | Sunset phase | 6 months |
| Removed | - | No longer available | - |

### 3. Breaking Changes Policy

#### 3.1 What Constitutes Breaking Changes

- **Removing fields** từ response
- **Changing field types** (string to number)
- **Adding required fields** to request
- **Changing URL structure**
- **Removing endpoints**

#### 3.2 Non-Breaking Changes

- **Adding optional fields** to request
- **Adding new fields** to response
- **Adding new endpoints**
- **Adding new optional query parameters**

## 🏷️ Field Standards

### 1. Common Field Types

#### 1.1 Identifiers

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",  // UUID v4
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_id": "steam_12345678"  // External system ID
}
```

#### 1.2 Timestamps

```json
{
  "created_at": "2024-10-02T10:30:00Z",    // ISO 8601 UTC
  "updated_at": "2024-10-02T15:45:00Z",
  "deleted_at": null,                       // Soft delete timestamp
  "expires_at": "2024-10-02T20:30:00Z"
}
```

#### 1.3 Status Fields

```json
{
  "status": "active",           // Enum: active, inactive, suspended
  "is_active": true,           // Boolean flag
  "is_verified": false,        // Boolean flag
  "is_public": true            // Boolean flag
}
```

#### 1.4 Monetary Values

```json
{
  "price": {
    "amount": 1999,           // Amount in cents
    "currency": "USD",        // ISO 4217 currency code
    "formatted": "$19.99"     // Human-readable format
  }
}
```

### 2. Common Response Fields

#### 2.1 Metadata Fields

```json
{
  "meta": {
    "request_id": "req-123456789",
    "timestamp": "2024-10-02T10:30:00Z",
    "api_version": "v1",
    "service": "user-service",
    "execution_time_ms": 45
  }
}
```

#### 2.2 Links (HATEOAS)

```json
{
  "links": {
    "self": "/users/550e8400-e29b-41d4-a716-446655440000",
    "edit": "/users/550e8400-e29b-41d4-a716-446655440000",
    "delete": "/users/550e8400-e29b-41d4-a716-446655440000",
    "preferences": "/users/550e8400-e29b-41d4-a716-446655440000/preferences"
  }
}
```

## 🔄 Asynchronous Operations

### 1. Long-Running Operations

#### 1.1 Accepted Response (202)

```json
{
  "operation_id": "op-123456789",
  "status": "processing",
  "estimated_completion": "2024-10-02T10:35:00Z",
  "status_url": "/operations/op-123456789",
  "message": "Data export request is being processed"
}
```

#### 1.2 Status Checking

```http
GET /operations/{operationId}
```

```json
{
  "operation_id": "op-123456789",
  "status": "completed",
  "progress": 100,
  "started_at": "2024-10-02T10:30:00Z",
  "completed_at": "2024-10-02T10:34:30Z",
  "result": {
    "download_url": "https://files.example.com/export-123456789.zip",
    "expires_at": "2024-10-03T10:34:30Z"
  }
}
```

### 2. Webhooks

#### 2.1 Webhook Registration

```json
{
  "url": "https://client.example.com/webhooks/orders",
  "events": ["order.created", "order.completed", "payment.processed"],
  "secret": "webhook-secret-key",
  "active": true
}
```

#### 2.2 Webhook Payload

```json
{
  "event_id": "evt-123456789",
  "event_type": "order.completed",
  "event_version": "1.0",
  "timestamp": "2024-10-02T10:30:00Z",
  "data": {
    "order_id": "order-123456789",
    "user_id": "user-123456789",
    "status": "completed"
  }
}
```

## 📚 Documentation Standards

### 1. OpenAPI Specification

- **All endpoints** must be documented trong OpenAPI 3.0
- **Examples** for all request/response schemas
- **Detailed descriptions** for all parameters
- **Error response examples** for each endpoint

### 2. Code Examples

#### 2.1 cURL Examples

```bash
# Create user profile
curl -X POST "https://api.mydigitalcollection.com/users/v1/profiles" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gamer123",
    "email": "gamer@example.com",
    "display_name": "Pro Gamer"
  }'
```

#### 2.2 JavaScript Examples

```javascript
// Using fetch API
const response = await fetch('/users/v1/profiles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'gamer123',
    email: 'gamer@example.com',
    display_name: 'Pro Gamer'
  })
});

const user = await response.json();
```

## 🚀 Performance Guidelines

### 1. Response Time Targets

| Operation Type | Target | Maximum |
|----------------|---------|---------|
| GET single resource | < 100ms | 500ms |
| GET collection | < 200ms | 1s |
| POST/PUT/PATCH | < 300ms | 2s |
| DELETE | < 200ms | 1s |
| Search operations | < 500ms | 3s |

### 2. Optimization Techniques

#### 2.1 Caching Headers

```http
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 02 Oct 2024 10:30:00 GMT
```

#### 2.2 Conditional Requests

```http
GET /users/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
If-Modified-Since: Wed, 02 Oct 2024 10:30:00 GMT
```

Response for unchanged resource:
```http
HTTP/1.1 304 Not Modified
```

#### 2.3 Field Selection

```http
GET /users?fields=id,username,email
```

#### 2.4 Compression

```http
Accept-Encoding: gzip, deflate, br
Content-Encoding: gzip
```

## 🔧 Rate Limiting

### 1. Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
X-RateLimit-Window: 3600
```

### 2. Rate Limit Tiers

| User Type | Requests/Hour | Burst Limit |
|-----------|---------------|-------------|
| Anonymous | 100 | 10/minute |
| Authenticated | 1000 | 50/minute |
| Premium | 5000 | 100/minute |
| API Partner | 10000 | 200/minute |

### 3. Rate Limit Exceeded Response

```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Try again later.",
  "details": {
    "limit": 1000,
    "window": 3600,
    "reset_at": "2024-10-02T11:30:00Z"
  },
  "timestamp": "2024-10-02T10:30:00Z",
  "request_id": "req-123456789"
}
```

---

**Last Updated**: 2024-10-02  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team

## 📚 Related Documentation

- [[Error Handling Guide]] - Comprehensive error handling strategies
- [[Authentication Documentation]] - Authentication và authorization implementation
- [[API Testing Guide]] - Testing strategies cho APIs
- [[Performance Optimization Guide]] - API performance best practices
- [[Security Implementation Guide]] - API security measures

## 🔗 External References

- [REST API Design Guidelines](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [JSON:API Specification](https://jsonapi.org/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [ISO 8601 Date Format](https://en.wikipedia.org/wiki/ISO_8601)