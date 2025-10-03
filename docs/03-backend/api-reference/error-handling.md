# Error Handling Standards

## 📋 Tổng quan

Tài liệu này định nghĩa chuẩn xử lý lỗi thống nhất cho toàn bộ hệ thống ECommerce. Mục tiêu là cung cấp error responses nhất quán, dễ hiểu và actionable cho cả client developers và end users.

## 🎯 Nguyên tắc xử lý lỗi

### 1. Consistency (Nhất quán)

-   Tất cả services phải trả về error format giống nhau
-   Sử dụng error codes chuẩn hóa
-   Message rõ ràng, dễ hiểu

### 2. Actionability (Có thể hành động)

-   Error message phải chỉ rõ vấn đề gì
-   Cung cấp hướng dẫn khắc phục nếu có thể
-   Include field-level errors cho validation

### 3. Security (Bảo mật)

-   KHÔNG expose internal system details
-   KHÔNG trả về stack traces trong production
-   KHÔNG leak sensitive information

-### 4. Debugging (Dễ debug)

-   Include traceId cho mỗi request
-   Log detailed errors server-side
-   Provide timestamp

## 📦 Error Response Structure

### Standard Error Response

```json
{
	"success": false,
	"error": {
		"code": "ERROR_CODE",
		"message": "Human-readable error message",
		"details": []
	},
    "timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "550e8400-e29b-41d4-a716-446655440000",
	"path": "/v1/users/123"
}
```

### Field Descriptions

| Field       | Type     | Required | Description                                   |
| ----------- | -------- | -------- | --------------------------------------------- |
| success     | boolean  | Yes      | Always `false` cho error responses            |
| error       | object   | Yes      | Error information object                      |
| error.code  | string   | Yes      | Machine-readable error code                   |
| error.message | string | Yes      | Human-readable error message                  |
| error.details | array  | No       | Array of detailed errors (validation, etc.)   |
| timestamp   | string   | Yes      | ISO 8601 timestamp                            |
| traceId    | string   | Yes      | Unique request identifier for tracking        |
| path        | string   | Yes      | API path that caused the error                |

## 🏷️ Error Categories & Codes

### 1. Authentication Errors (AUTH_*)

| Error Code              | HTTP Status | Description                    | Example Message                       |
| ----------------------- | ----------- | ------------------------------ | ------------------------------------- |
| AUTH_MISSING_TOKEN      | 401         | No authentication token        | "Authentication token is required"    |
| AUTH_INVALID_TOKEN      | 401         | Invalid/malformed token        | "Invalid authentication token"        |
| AUTH_TOKEN_EXPIRED      | 401         | Token has expired              | "Authentication token has expired"    |
| AUTH_INVALID_CREDENTIALS| 401         | Wrong username/password        | "Invalid email or password"           |
| AUTH_ACCOUNT_LOCKED     | 403         | Account is locked/suspended    | "Account has been locked"             |

**Example Response:**

```json
{
	"success": false,
	"error": {
		"code": "AUTH_TOKEN_EXPIRED",
		"message": "Your session has expired. Please login again."
	},
	"timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "abc-123-def-456",
	"path": "/v1/users/profile"
}
```

### 2. Authorization Errors (AUTHZ_*)

| Error Code              | HTTP Status | Description                    | Example Message                       |
| ----------------------- | ----------- | ------------------------------ | ------------------------------------- |
| AUTHZ_FORBIDDEN         | 403         | No permission for resource     | "You don't have permission"           |
| AUTHZ_INSUFFICIENT_ROLE | 403         | User role not sufficient       | "Admin role required"                 |
| AUTHZ_RESOURCE_OWNER    | 403         | Only resource owner can access | "You can only modify your own profile"|

### 3. Validation Errors (VALIDATION_*)

| Error Code                | HTTP Status | Description                  | Example Message                     |
| ------------------------- | ----------- | ---------------------------- | ----------------------------------- |
| VALIDATION_ERROR          | 422         | General validation failure   | "Invalid input data"                |
| VALIDATION_REQUIRED_FIELD | 422         | Required field missing       | "Email is required"                 |
| VALIDATION_INVALID_FORMAT | 422         | Invalid field format         | "Invalid email format"              |
| VALIDATION_MIN_LENGTH     | 422         | String too short             | "Password must be at least 8 chars" |
| VALIDATION_MAX_LENGTH     | 422         | String too long              | "Username max 50 characters"        |
| VALIDATION_INVALID_TYPE   | 422         | Wrong data type              | "Age must be a number"              |

**Example Response:**

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Request validation failed",
		"details": [
			{
				"field": "email",
				"code": "VALIDATION_REQUIRED_FIELD",
				"message": "Email is required"
			},
			{
				"field": "password",
				"code": "VALIDATION_MIN_LENGTH",
				"message": "Password must be at least 8 characters"
			},
			{
				"field": "age",
				"code": "VALIDATION_INVALID_TYPE",
				"message": "Age must be a number"
			}
		]
	},
	"timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "xyz-789-uvw-012",
	"path": "/v1/users"
}
```

### 4. Resource Errors (RESOURCE_*)

| Error Code            | HTTP Status | Description                | Example Message                      |
| --------------------- | ----------- | -------------------------- | ------------------------------------ |
| RESOURCE_NOT_FOUND    | 404         | Resource doesn't exist     | "User not found"                     |
| RESOURCE_ALREADY_EXISTS| 409        | Duplicate resource         | "Email already registered"           |
| RESOURCE_CONFLICT     | 409         | Resource state conflict    | "Cannot delete user with active orders"|
| RESOURCE_GONE         | 410         | Resource permanently deleted| "This account has been deleted"     |

### 5. Business Logic Errors (BUSINESS_*)

| Error Code                | HTTP Status | Description                  | Example Message                     |
| ------------------------- | ----------- | ---------------------------- | ----------------------------------- |
| BUSINESS_INSUFFICIENT_FUNDS| 402        | Not enough money/credits     | "Insufficient balance"              |
| BUSINESS_OUT_OF_STOCK     | 409         | Product not available        | "Game is out of stock"              |
| BUSINESS_ALREADY_OWNED    | 409         | User already owns item       | "You already own this game"         |
| BUSINESS_AGE_RESTRICTION  | 403         | Age verification failed      | "Must be 18+ to purchase"           |
| BUSINESS_REGION_RESTRICTED| 403         | Region lock                  | "Not available in your region"      |

### 6. Rate Limiting Errors (RATE_*)

| Error Code          | HTTP Status | Description            | Example Message                         |
| ------------------- | ----------- | ---------------------- | --------------------------------------- |
| RATE_LIMIT_EXCEEDED | 429         | Too many requests      | "Too many requests. Try again in 1 hour"|
| RATE_LIMIT_IP       | 429         | IP rate limit hit      | "Too many requests from this IP"        |

**Example Response:**

```json
{
	"success": false,
	"error": {
		"code": "RATE_LIMIT_EXCEEDED",
		"message": "Too many requests. Please try again later.",
		"details": [
            {
                "retryAfter": 3600,
                "limit": 1000,
                "remaining": 0,
                "resetAt": "2025-10-03T13:00:00.000Z"
            }
		]
	},
	"timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "rate-limit-123"
}
```

**Response Headers:**

```
Retry-After: 3600
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1696334400
```

### 7. Payment Errors (PAYMENT_*)

| Error Code               | HTTP Status | Description                | Example Message                      |
| ------------------------ | ----------- | -------------------------- | ------------------------------------ |
| PAYMENT_FAILED           | 402         | Payment processing failed  | "Payment could not be processed"     |
| PAYMENT_INVALID_CARD     | 400         | Invalid card details       | "Invalid credit card number"         |
| PAYMENT_DECLINED         | 402         | Card declined              | "Your card was declined"             |
| PAYMENT_INSUFFICIENT_FUNDS| 402        | Not enough funds on card   | "Insufficient funds"                 |
| PAYMENT_GATEWAY_ERROR    | 502         | Payment gateway issue      | "Payment service temporarily unavailable"|

### 8. Server Errors (SERVER_*)

| Error Code               | HTTP Status | Description                | Example Message                      |
| ------------------------ | ----------- | -------------------------- | ------------------------------------ |
| SERVER_INTERNAL_ERROR    | 500         | Unhandled server error     | "An unexpected error occurred"       |
| SERVER_SERVICE_UNAVAILABLE| 503        | Service down/maintenance   | "Service temporarily unavailable"    |
| SERVER_DATABASE_ERROR    | 500         | Database connection issue  | "Database connection failed"         |
| SERVER_TIMEOUT           | 504         | Request timeout            | "Request timeout"                    |

**Example Response:**

```json
{
	"success": false,
	"error": {
		"code": "SERVER_INTERNAL_ERROR",
		"message": "An unexpected error occurred. Please try again later."
	},
	"timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "error-trace-999",
	"path": "/v1/orders"
}
```

> [!warning] Production Security
> NEVER include stack traces or internal system details in production error responses. Log these server-side with traceId for debugging.

## 🔧 Implementation Guidelines

### Backend (Spring Boot Example)

#### 1. Custom Exception Classes

```java
// Base exception
public class ApiException extends RuntimeException {
    private final String code;
    private final HttpStatus status;
    private final List<ErrorDetail> details;

    // Constructor, getters...
}

// Specific exceptions
public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resource) {
        super("RESOURCE_NOT_FOUND", 
              resource + " not found", 
              HttpStatus.NOT_FOUND);
    }
}

public class ValidationException extends ApiException {
    public ValidationException(List<ErrorDetail> details) {
        super("VALIDATION_ERROR", 
              "Request validation failed", 
              HttpStatus.UNPROCESSABLE_ENTITY, 
              details);
    }
}
```

#### 2. Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(
            ApiException ex, 
            HttpServletRequest request) {
        
        ErrorResponse response = ErrorResponse.builder()
            .success(false)
            .error(ErrorInfo.builder()
                .code(ex.getCode())
                .message(ex.getMessage())
                .details(ex.getDetails())
                .build())
            .timestamp(Instant.now())
            .traceId(MDC.get("traceId"))
            .path(request.getRequestURI())
            .build();

        return ResponseEntity
            .status(ex.getStatus())
            .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        List<ErrorDetail> details = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> ErrorDetail.builder()
                .field(error.getField())
                .code("VALIDATION_" + error.getCode().toUpperCase())
                .message(error.getDefaultMessage())
                .build())
            .collect(Collectors.toList());

        ErrorResponse response = ErrorResponse.builder()
            .success(false)
            .error(ErrorInfo.builder()
                .code("VALIDATION_ERROR")
                .message("Request validation failed")
                .details(details)
                .build())
            .timestamp(Instant.now())
            .traceId(MDC.get("traceId"))
            .path(request.getRequestURI())
            .build();

        return ResponseEntity
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {
        
        // Log full error with trace ID
        log.error("Unhandled exception: {}", ex.getMessage(), ex);

        ErrorResponse response = ErrorResponse.builder()
            .success(false)
            .error(ErrorInfo.builder()
                .code("SERVER_INTERNAL_ERROR")
                .message("An unexpected error occurred")
                .build())
            .timestamp(Instant.now())
            .traceId(MDC.get("traceId"))
            .path(request.getRequestURI())
            .build();

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(response);
    }
}
```

#### 3. Validation Example

```java
public class CreateUserRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    // Getters, setters...
}

@RestController
@RequestMapping("/v1/users")
public class UserController {

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        
        // Check if email already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        User user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
```

### Frontend (TypeScript/Axios Example)

#### 1. Error Response Types

```typescript
interface ErrorDetail {
	field?: string;
	code: string;
	message: string;
}

interface ErrorInfo {
	code: string;
	message: string;
	details?: ErrorDetail[];
}

interface ErrorResponse {
	success: false;
	error: ErrorInfo;
	timestamp: string;
    traceId: string;
	path: string;
}
```

#### 2. Axios Interceptor

```typescript
import axios, { AxiosError } from "axios";

// Add trace ID to all requests
axios.interceptors.request.use((config) => {
	config.headers["X-Trace-ID"] = generateTraceId();
	return config;
});

// Handle error responses
axios.interceptors.response.use(
	(response) => response,
	(error: AxiosError<ErrorResponse>) => {
		if (error.response) {
			const errorData = error.response.data;

            // Log error with trace ID
            console.error(`[${errorData.traceId}] API Error:`, errorData.error);

			// Handle specific error codes
			switch (errorData.error.code) {
				case "AUTH_TOKEN_EXPIRED":
					// Redirect to login
					window.location.href = "/login";
					break;

				case "VALIDATION_ERROR":
					// Show field-level errors
					errorData.error.details?.forEach((detail) => {
						showFieldError(detail.field, detail.message);
					});
					break;

				case "RATE_LIMIT_EXCEEDED":
					// Show rate limit message
					showNotification(
						"Too many requests. Please try again later.",
						"warning"
					);
					break;

				default:
					// Show generic error
					showNotification(errorData.error.message, "error");
			}
		}

		return Promise.reject(error);
	}
);
```

#### 3. Error Display Component

```typescript
interface FormErrorProps {
	errors?: ErrorDetail[];
}

export function FormErrors({ errors }: FormErrorProps) {
	if (!errors || errors.length === 0) return null;

	return (
		<div className="error-container">
			{errors.map((error, index) => (
				<div key={index} className="error-message">
					<strong>{error.field}:</strong> {error.message}
				</div>
			))}
		</div>
	);
}
```

## 🔍 Error Logging & Monitoring

### 1. Server-side Logging

```java
@Slf4j
public class ErrorLogger {

    public static void logError(Exception ex, HttpServletRequest request) {
        String traceId = MDC.get("traceId");
        
        Map<String, Object> logData = Map.of(
            "traceId", traceId,
            "path", request.getRequestURI(),
            "method", request.getMethod(),
            "errorType", ex.getClass().getSimpleName(),
            "errorMessage", ex.getMessage(),
            "userId", getCurrentUserId(),
            "ipAddress", request.getRemoteAddr()
        );

        log.error("API Error: {}", logData, ex);

        // Send to monitoring service (Sentry, etc.)
        if (shouldReportToMonitoring(ex)) {
            monitoringService.captureException(ex, logData);
        }
    }
}
```

### 2. Error Metrics

Track error rates by:

-   Error code
-   HTTP status
-   Service/endpoint
-   User/session

```java
@Component
public class ErrorMetrics {

    private final MeterRegistry registry;

    public void recordError(String errorCode, HttpStatus status) {
        registry.counter("api.errors",
            "code", errorCode,
            "status", String.valueOf(status.value())
        ).increment();
    }
}
```

## ✅ Error Handling Checklist

-   [ ] All errors return consistent JSON structure
-   [ ] Error codes are machine-readable and documented
-   [ ] Error messages are clear and actionable
-   [ ] Field-level validation errors included
-   [ ] Trace IDs generated and logged
-   [ ] Stack traces NEVER exposed in production
-   [ ] Sensitive data NOT leaked in errors
-   [ ] HTTP status codes used correctly
-   [ ] Rate limit info in response headers
-   [ ] Errors logged with trace IDs
-   [ ] Error metrics tracked
-   [ ] Frontend handles all error types
-   [ ] User-friendly error messages displayed

## 📚 Related Documentation

-   [[api-standards]] - API design standards
-   [[authentication-design]] - Authentication error handling
-   [[monitoring-strategy]] - Error monitoring and alerting
-   [[logging-strategy]] - Logging standards

---

**Version**: 1.0.0  
**Last Updated**: 2025-10-03  
**Maintained by**: Backend Team
