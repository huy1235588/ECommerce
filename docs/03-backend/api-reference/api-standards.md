# API Standards & Conventions

## 📋 Tổng quan

Tài liệu này định nghĩa các chuẩn và quy ước để thiết kế RESTful API cho dự án ECommerce. Mục tiêu là đảm bảo tính nhất quán, dễ sử dụng và dễ bảo trì cho tất cả các API endpoints.

## 🎯 Nguyên tắc thiết kế API

### 1. RESTful Principles

-   Sử dụng HTTP methods đúng mục đích:
    -   `GET`: Lấy dữ liệu (idempotent)
    -   `POST`: Tạo mới resource
    -   `PUT`: Cập nhật toàn bộ resource
    -   `PATCH`: Cập nhật một phần resource
    -   `DELETE`: Xóa resource
-   Resource-oriented URLs
-   Stateless communication
-   Sử dụng HTTP status codes chuẩn

### 2. API Versioning

Sử dụng URL path versioning để dễ quản lý và maintain:

```
https://api.ecommerce.com/v1/users
https://api.ecommerce.com/v1/games
https://api.ecommerce.com/v2/orders
```

**Quy tắc:**

-   Version là số nguyên (v1, v2, v3...)
-   Không deprecated version cũ quá nhanh (maintain ít nhất 6 tháng)
-   Document rõ breaking changes khi release version mới

### 3. Resource Naming

#### Quy tắc đặt tên

-   Sử dụng **danh từ số nhiều** cho collection: `/users`, `/games`, `/orders`
-   Sử dụng **kebab-case** cho URLs: `/game-catalog`, `/user-reviews`
-   Tránh động từ trong URL (dùng HTTP methods thay thế)
-   Sử dụng UUID cho resource IDs thay vì auto-increment integers

#### Ví dụ đúng

```
GET    /v1/users                      # Lấy danh sách users
GET    /v1/users/{userId}             # Lấy chi tiết 1 user
POST   /v1/users                      # Tạo user mới
PUT    /v1/users/{userId}             # Cập nhật toàn bộ user
PATCH  /v1/users/{userId}             # Cập nhật một phần user
DELETE /v1/users/{userId}             # Xóa user

GET    /v1/users/{userId}/orders      # Lấy orders của user
GET    /v1/games/{gameId}/reviews     # Lấy reviews của game
```

#### Ví dụ sai

```
❌ GET /v1/getUsers
❌ POST /v1/user/create
❌ GET /v1/user_orders
❌ DELETE /v1/deleteUser/{id}
```

### 4. Query Parameters

Sử dụng query parameters cho:

-   **Filtering**: `/v1/games?genre=action&platform=pc`
-   **Sorting**: `/v1/games?sort=price:asc,rating:desc`
-   **Pagination**: `/v1/games?page=1&limit=20`
-   **Search**: `/v1/games?search=cyberpunk`
-   **Field selection**: `/v1/users?fields=id,name,email`

#### Pagination Standard

```json
// Request
GET /v1/games?page=1&limit=20

// Response
{
    "data": [...],
    "pagination": {
        "current_page": 1,
        "per_page": 20,
        "total_pages": 5,
        "total_items": 100,
        "has_next": true,
        "has_prev": false
    }
}
```

## 📦 Request & Response Format

### 1. Content Type

-   Luôn sử dụng `Content-Type: application/json`
-   Chấp nhận `Accept: application/json` trong request header

### 2. Request Body Structure

**POST/PUT Request:**

```json
{
	"email": "user@example.com",
	"username": "john_doe",
	"profile": {
		"first_name": "John",
		"last_name": "Doe",
		"birth_date": "1990-01-15"
	}
}
```

**Quy tắc:**

-   Sử dụng `snake_case` cho field names
-   Dates theo ISO 8601 format: `YYYY-MM-DD` hoặc `YYYY-MM-DDTHH:mm:ss.sssZ`
-   Booleans: `true` hoặc `false` (lowercase)
-   Null values: `null`

### 3. Response Structure

#### Success Response

```json
{
	"success": true,
	"data": {
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"email": "user@example.com",
		"username": "john_doe",
		"created_at": "2025-01-15T10:30:00.000Z"
	},
	"message": "User created successfully",
	"timestamp": "2025-10-03T12:00:00.000Z"
}
```

#### List Response

```json
{
	"success": true,
	"data": [
		{ "id": "uuid-1", "name": "Game 1" },
		{ "id": "uuid-2", "name": "Game 2" }
	],
	"pagination": {
		"current_page": 1,
		"per_page": 20,
		"total_pages": 5,
		"total_items": 100
	},
	"timestamp": "2025-10-03T12:00:00.000Z"
}
```

#### Error Response

Xem chi tiết tại [[error-handling]]

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Invalid input data",
		"details": [
			{
				"field": "email",
				"message": "Email is required"
			}
		]
	},
	"timestamp": "2025-10-03T12:00:00.000Z",
	"trace_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🔐 Security Standards

### 1. Authentication

Sử dụng JWT (JSON Web Token) trong Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. API Rate Limiting

-   Authenticated users: 1000 requests/hour
-   Anonymous users: 100 requests/hour
-   Headers phản hồi:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

### 3. CORS Policy

-   Cho phép credentials: `Access-Control-Allow-Credentials: true`
-   Allowed origins: Configure theo môi trường
-   Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
-   Allowed headers: `Content-Type, Authorization, X-Requested-With`

### 4. HTTPS Only

-   Tất cả API endpoints phải sử dụng HTTPS trong production
-   Redirect HTTP requests sang HTTPS

## 📊 HTTP Status Codes

### Success Codes (2xx)

| Code | Description       | Usage                              |
| ---- | ----------------- | ---------------------------------- |
| 200  | OK                | GET, PUT, PATCH successful         |
| 201  | Created           | POST successful, resource created  |
| 204  | No Content        | DELETE successful, no content back |
| 206  | Partial Content   | Partial GET request (range)        |

### Client Error Codes (4xx)

| Code | Description           | Usage                             |
| ---- | --------------------- | --------------------------------- |
| 400  | Bad Request           | Invalid request syntax/data       |
| 401  | Unauthorized          | Missing or invalid authentication |
| 403  | Forbidden             | Valid auth but no permission      |
| 404  | Not Found             | Resource not found                |
| 409  | Conflict              | Duplicate resource, race condition|
| 422  | Unprocessable Entity  | Validation failed                 |
| 429  | Too Many Requests     | Rate limit exceeded               |

### Server Error Codes (5xx)

| Code | Description           | Usage                             |
| ---- | --------------------- | --------------------------------- |
| 500  | Internal Server Error | Unhandled server error            |
| 502  | Bad Gateway           | Invalid upstream response         |
| 503  | Service Unavailable   | Service down/maintenance          |
| 504  | Gateway Timeout       | Upstream timeout                  |

## 🔍 Filtering & Searching

### Basic Filtering

```
GET /v1/games?genre=action
GET /v1/games?genre=action&platform=pc
GET /v1/users?status=active&role=customer
```

### Advanced Filtering (Operators)

```
GET /v1/games?price[gte]=10&price[lte]=50     # Price between 10 and 50
GET /v1/games?release_date[gt]=2024-01-01     # Released after date
GET /v1/users?created_at[lt]=2025-01-01       # Created before date
```

**Supported operators:**

-   `eq`: Equal (default)
-   `ne`: Not equal
-   `gt`: Greater than
-   `gte`: Greater than or equal
-   `lt`: Less than
-   `lte`: Less than or equal
-   `in`: In array
-   `nin`: Not in array

### Text Search

```
GET /v1/games?search=cyberpunk                 # Full-text search
GET /v1/games?search=cyberpunk&fields=title,description  # Search in specific fields
```

### Sorting

```
GET /v1/games?sort=price:asc                   # Single field ascending
GET /v1/games?sort=price:desc                  # Single field descending
GET /v1/games?sort=rating:desc,price:asc       # Multiple fields
```

## 📄 Pagination Best Practices

### Offset-based Pagination

```
GET /v1/games?page=1&limit=20
```

**Response:**

```json
{
	"data": [...],
	"pagination": {
		"current_page": 1,
		"per_page": 20,
		"total_pages": 10,
		"total_items": 200,
		"has_next": true,
		"has_prev": false
	}
}
```

### Cursor-based Pagination (cho real-time data)

```
GET /v1/notifications?cursor=eyJpZCI6IjEyMyJ9&limit=20
```

**Response:**

```json
{
	"data": [...],
	"pagination": {
		"next_cursor": "eyJpZCI6IjE0MyJ9",
		"has_more": true
	}
}
```

## 🔄 Idempotency

### Idempotent Methods

-   `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` - phải idempotent
-   Gọi nhiều lần cho kết quả giống nhau

### POST Idempotency

Sử dụng `Idempotency-Key` header cho POST requests:

```
POST /v1/orders
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Server cache response với key này trong 24h để tránh duplicate orders.

## 📝 Documentation Standards

### OpenAPI 3.0 (Swagger)

-   Tất cả APIs phải document bằng OpenAPI 3.0
-   Include examples cho request/response
-   Document tất cả error scenarios
-   Keep Swagger spec updated với code changes

### API Documentation Location

```
docs/03-backend/api-reference/swagger/
├── api-gateway.yaml
├── user-service-api.yaml
├── game-catalog-api.yaml
└── shared-models.yaml
```

## ✅ Checklist Thiết Kế API

-   [ ] Sử dụng HTTP methods đúng mục đích
-   [ ] URLs theo chuẩn RESTful (danh từ số nhiều, kebab-case)
-   [ ] Response structure nhất quán
-   [ ] Error handling chuẩn hóa
-   [ ] Authentication với JWT
-   [ ] Rate limiting implemented
-   [ ] HTTPS only trong production
-   [ ] Pagination cho list endpoints
-   [ ] Filtering và sorting support
-   [ ] OpenAPI 3.0 documentation
-   [ ] Versioning strategy
-   [ ] CORS policy configured
-   [ ] Idempotency cho critical operations

## 📚 Related Documentation

-   [[error-handling]] - Error handling standards
-   [[user-service-api]] - User Service API specification
-   [[game-catalog-api]] - Game Catalog API specification
-   [[authentication-design]] - Authentication & Authorization
-   [[api-gateway-design]] - API Gateway configuration

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-03  
**Maintained by**: Backend Team
