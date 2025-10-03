# Custom Exceptions

## 📋 Tổng quan

Tài liệu này định nghĩa các custom exception classes và global exception handler để xử lý lỗi thống nhất trong toàn bộ hệ thống.

## 🎯 Hierarchy của Exceptions

```
RuntimeException
├── BusinessException (Base)
│   ├── ResourceNotFoundException
│   ├── ResourceAlreadyExistsException
│   ├── InvalidOperationException
│   └── InsufficientPermissionException
│
├── ValidationException
│
├── AuthenticationException
│   ├── InvalidCredentialsException
│   ├── TokenExpiredException
│   └── TokenInvalidException
│
└── RateLimitException
```

## 📦 Exception Classes

### 1. BusinessException (Base Class)

Base exception cho tất cả business logic errors:

```java
package com.ecommerce.commons.exception;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class BusinessException extends RuntimeException {
    
    private final String errorCode;
    private final Map<String, Object> metadata;
    
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.metadata = new HashMap<>();
    }
    
    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.metadata = new HashMap<>();
    }
    
    public BusinessException addMetadata(String key, Object value) {
        this.metadata.put(key, value);
        return this;
    }
    
    public BusinessException addMetadata(Map<String, Object> metadata) {
        this.metadata.putAll(metadata);
        return this;
    }
}
```

### 2. ResourceNotFoundException

Thrown khi resource không tồn tại:

```java
package com.ecommerce.commons.exception;

import java.util.UUID;

public class ResourceNotFoundException extends BusinessException {
    
    private static final String DEFAULT_CODE = "RESOURCE_NOT_FOUND";
    
    public ResourceNotFoundException(String message) {
        super(DEFAULT_CODE, message);
    }
    
    public ResourceNotFoundException(String code, String message) {
        super(code, message);
    }
    
    // Convenience constructors
    public static ResourceNotFoundException of(String resourceType, UUID id) {
        return new ResourceNotFoundException(
            resourceType.toUpperCase() + "_NOT_FOUND",
            String.format("%s not found with id: %s", resourceType, id)
        );
    }
    
    public static ResourceNotFoundException of(String resourceType, String field, Object value) {
        return new ResourceNotFoundException(
            resourceType.toUpperCase() + "_NOT_FOUND",
            String.format("%s not found with %s: %s", resourceType, field, value)
        );
    }
}
```

**Usage Example:**
```java
public User findById(UUID id) {
    return userRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("User", id));
}

public User findByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> ResourceNotFoundException.of("User", "email", email));
}
```

### 3. ResourceAlreadyExistsException

Thrown khi tạo resource đã tồn tại:

```java
package com.ecommerce.commons.exception;

public class ResourceAlreadyExistsException extends BusinessException {
    
    private static final String DEFAULT_CODE = "RESOURCE_ALREADY_EXISTS";
    
    public ResourceAlreadyExistsException(String message) {
        super(DEFAULT_CODE, message);
    }
    
    public ResourceAlreadyExistsException(String code, String message) {
        super(code, message);
    }
    
    // Convenience constructor
    public static ResourceAlreadyExistsException of(String resourceType, String field, Object value) {
        return new ResourceAlreadyExistsException(
            resourceType.toUpperCase() + "_ALREADY_EXISTS",
            String.format("%s already exists with %s: %s", resourceType, field, value)
        );
    }
}
```

**Usage Example:**
```java
public User register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw ResourceAlreadyExistsException.of("User", "email", request.getEmail());
    }
    // ... create user
}
```

### 4. ValidationException

Thrown cho validation errors:

```java
package com.ecommerce.commons.exception;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class ValidationException extends BusinessException {
    
    private static final String DEFAULT_CODE = "VALIDATION_ERROR";
    
    private final List<FieldError> fieldErrors;
    
    public ValidationException(String message) {
        super(DEFAULT_CODE, message);
        this.fieldErrors = new ArrayList<>();
    }
    
    public ValidationException(String message, List<FieldError> fieldErrors) {
        super(DEFAULT_CODE, message);
        this.fieldErrors = fieldErrors;
    }
    
    public ValidationException addFieldError(String field, String message) {
        this.fieldErrors.add(new FieldError(field, message, null));
        return this;
    }
    
    public ValidationException addFieldError(String field, String message, Object rejectedValue) {
        this.fieldErrors.add(new FieldError(field, message, rejectedValue));
        return this;
    }
    
    @Getter
    public static class FieldError {
        private final String field;
        private final String message;
        private final Object rejectedValue;
        
        public FieldError(String field, String message, Object rejectedValue) {
            this.field = field;
            this.message = message;
            this.rejectedValue = rejectedValue;
        }
    }
}
```

**Usage Example:**
```java
public void validateOrder(Order order) {
    ValidationException exception = new ValidationException("Invalid order data");
    
    if (order.getItems().isEmpty()) {
        exception.addFieldError("items", "Order must have at least one item");
    }
    
    if (order.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
        exception.addFieldError("totalAmount", "Total amount must be greater than 0");
    }
    
    if (!exception.getFieldErrors().isEmpty()) {
        throw exception;
    }
}
```

### 5. Authentication Exceptions

```java
package com.ecommerce.commons.exception;

// Base authentication exception
public class AuthenticationException extends BusinessException {
    public AuthenticationException(String code, String message) {
        super(code, message);
    }
}

// Invalid credentials
public class InvalidCredentialsException extends AuthenticationException {
    public InvalidCredentialsException() {
        super("INVALID_CREDENTIALS", "Invalid email or password");
    }
    
    public InvalidCredentialsException(String message) {
        super("INVALID_CREDENTIALS", message);
    }
}

// Token expired
public class TokenExpiredException extends AuthenticationException {
    public TokenExpiredException() {
        super("TOKEN_EXPIRED", "Authentication token has expired");
    }
    
    public TokenExpiredException(String tokenType) {
        super("TOKEN_EXPIRED", String.format("%s token has expired", tokenType));
    }
}

// Token invalid
public class TokenInvalidException extends AuthenticationException {
    public TokenInvalidException() {
        super("TOKEN_INVALID", "Authentication token is invalid");
    }
    
    public TokenInvalidException(String message) {
        super("TOKEN_INVALID", message);
    }
}
```

### 6. Authorization Exception

```java
package com.ecommerce.commons.exception;

public class InsufficientPermissionException extends BusinessException {
    
    private static final String DEFAULT_CODE = "INSUFFICIENT_PERMISSION";
    
    public InsufficientPermissionException() {
        super(DEFAULT_CODE, "You don't have permission to perform this action");
    }
    
    public InsufficientPermissionException(String message) {
        super(DEFAULT_CODE, message);
    }
    
    public InsufficientPermissionException(String action, String resource) {
        super(
            DEFAULT_CODE,
            String.format("You don't have permission to %s %s", action, resource)
        );
    }
}
```

### 7. RateLimitException

```java
package com.ecommerce.commons.exception;

public class RateLimitException extends BusinessException {
    
    private static final String DEFAULT_CODE = "RATE_LIMIT_EXCEEDED";
    
    public RateLimitException() {
        super(DEFAULT_CODE, "Rate limit exceeded. Please try again later");
    }
    
    public RateLimitException(String message) {
        super(DEFAULT_CODE, message);
    }
    
    public RateLimitException(long retryAfterSeconds) {
        super(
            DEFAULT_CODE,
            String.format("Rate limit exceeded. Please try again after %d seconds", retryAfterSeconds)
        );
        this.addMetadata("retryAfter", retryAfterSeconds);
    }
}
```

## 🌐 Global Exception Handler

Central exception handler cho tất cả services:

```java
package com.ecommerce.commons.exception;

import com.ecommerce.commons.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handle Resource Not Found exceptions
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        
        log.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }
    
    /**
     * Handle Resource Already Exists exceptions
     */
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleResourceAlreadyExists(
            ResourceAlreadyExistsException ex,
            HttpServletRequest request) {
        
        log.warn("Resource already exists: {}", ex.getMessage());
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }
    
    /**
     * Handle Validation exceptions
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex,
            HttpServletRequest request) {
        
        log.warn("Validation error: {}", ex.getMessage());
        
        List<ErrorResponse.FieldError> fieldErrors = ex.getFieldErrors().stream()
                .map(fe -> ErrorResponse.FieldError.builder()
                        .field(fe.getField())
                        .message(fe.getMessage())
                        .rejectedValue(fe.getRejectedValue())
                        .build())
                .collect(Collectors.toList());
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            fieldErrors,
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
    
    /**
     * Handle Spring Validation exceptions
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        log.warn("Method argument validation failed: {}", ex.getMessage());
        
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> ErrorResponse.FieldError.builder()
                        .field(fe.getField())
                        .message(fe.getDefaultMessage())
                        .rejectedValue(fe.getRejectedValue())
                        .build())
                .collect(Collectors.toList());
        
        ErrorResponse response = buildErrorResponse(
            "VALIDATION_ERROR",
            "Invalid input data",
            fieldErrors,
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
    
    /**
     * Handle Authentication exceptions
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(
            AuthenticationException ex,
            HttpServletRequest request) {
        
        log.warn("Authentication failed: {}", ex.getMessage());
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
    
    /**
     * Handle Authorization exceptions
     */
    @ExceptionHandler({
        InsufficientPermissionException.class,
        AccessDeniedException.class
    })
    public ResponseEntity<ErrorResponse> handleAuthorization(
            Exception ex,
            HttpServletRequest request) {
        
        log.warn("Authorization failed: {}", ex.getMessage());
        
        String code = ex instanceof InsufficientPermissionException
                ? ((InsufficientPermissionException) ex).getErrorCode()
                : "INSUFFICIENT_PERMISSION";
        
        ErrorResponse response = buildErrorResponse(
            code,
            "You don't have permission to perform this action",
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }
    
    /**
     * Handle Rate Limit exceptions
     */
    @ExceptionHandler(RateLimitException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(
            RateLimitException ex,
            HttpServletRequest request) {
        
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            request
        );
        
        // Add metadata if available
        if (ex.getMetadata().containsKey("retryAfter")) {
            response.getError().setMetadata(ex.getMetadata());
        }
        
        return ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .body(response);
    }
    
    /**
     * Handle all other Business exceptions
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(
            BusinessException ex,
            HttpServletRequest request) {
        
        log.error("Business exception: {}", ex.getMessage(), ex);
        
        ErrorResponse response = buildErrorResponse(
            ex.getErrorCode(),
            ex.getMessage(),
            request
        );
        
        // Add metadata if available
        if (!ex.getMetadata().isEmpty()) {
            response.getError().setMetadata(ex.getMetadata());
        }
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
    
    /**
     * Handle all unhandled exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex,
            HttpServletRequest request) {
        
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        
        ErrorResponse response = buildErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred. Please try again later",
            request
        );
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
    
    // Helper methods
    private ErrorResponse buildErrorResponse(
            String code,
            String message,
            HttpServletRequest request) {
        return buildErrorResponse(code, message, null, request);
    }
    
    private ErrorResponse buildErrorResponse(
            String code,
            String message,
            List<ErrorResponse.FieldError> details,
            HttpServletRequest request) {
        
        ErrorResponse response = ErrorResponse.builder()
                .error(ErrorResponse.ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .build();
        
        response.setTimestamp(Instant.now());
        response.setTraceId(UUID.randomUUID().toString());
        response.setPath(request.getRequestURI());
        
        return response;
    }
}
```

## 🎨 Usage Examples

### Service Layer

```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ResourceAlreadyExistsException.of(
                "User", "email", request.getEmail()
            );
        }
        
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw ResourceAlreadyExistsException.of(
                "User", "username", request.getUsername()
            );
        }
        
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        return userRepository.save(user);
    }
    
    public User findById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> ResourceNotFoundException.of("User", id));
    }
    
    public void validateUserUpdate(UUID userId, UpdateUserRequest request) {
        ValidationException exception = new ValidationException("Invalid update data");
        
        // Check if new email is already taken by another user
        if (request.getEmail() != null) {
            userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    if (!user.getId().equals(userId)) {
                        exception.addFieldError(
                            "email", 
                            "Email is already taken",
                            request.getEmail()
                        );
                    }
                });
        }
        
        if (!exception.getFieldErrors().isEmpty()) {
            throw exception;
        }
    }
    
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new InvalidCredentialsException());
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        
        if (!user.isActive()) {
            throw new InvalidOperationException(
                "USER_INACTIVE",
                "User account is inactive"
            );
        }
        
        return user;
    }
}
```

### Controller Layer

```java
@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping
    public ApiResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        // Service throws exception if validation fails
        User user = userService.register(request);
        return SuccessResponse.of(user, "User created successfully");
    }
    
    @GetMapping("/{id}")
    public ApiResponse getUser(@PathVariable UUID id) {
        // Service throws ResourceNotFoundException if not found
        User user = userService.findById(id);
        return SuccessResponse.of(user);
    }
    
    @PutMapping("/{id}")
    public ApiResponse updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        
        // Validate first
        userService.validateUserUpdate(id, request);
        
        // Update
        User user = userService.update(id, request);
        return SuccessResponse.of(user, "User updated successfully");
    }
}
```

## ✅ Best Practices

### 1. Exception Naming
- Use clear, descriptive names
- Follow pattern: `ResourceVerbException` (e.g., `UserNotFoundException`)
- Include context in error codes

### 2. Error Messages
- Clear and actionable
- Don't expose sensitive information
- Use proper grammar and punctuation
- Include what went wrong and how to fix it

### 3. Logging
- Log at appropriate levels (WARN for expected, ERROR for unexpected)
- Include context (user ID, resource ID, etc.)
- Use structured logging
- Don't log sensitive data

### 4. HTTP Status Codes
- 400 Bad Request: Validation errors
- 401 Unauthorized: Authentication failed
- 403 Forbidden: Authorization failed
- 404 Not Found: Resource not found
- 409 Conflict: Resource already exists
- 429 Too Many Requests: Rate limit
- 500 Internal Server Error: Unexpected errors

### 5. Field Errors
- Include field name
- Provide clear error message
- Include rejected value (if not sensitive)
- Group related errors together

## 🧪 Testing

```java
@Test
void testResourceNotFoundException() {
    // Given
    UUID userId = UUID.randomUUID();
    when(userRepository.findById(userId)).thenReturn(Optional.empty());
    
    // When & Then
    ResourceNotFoundException exception = assertThrows(
        ResourceNotFoundException.class,
        () -> userService.findById(userId)
    );
    
    assertEquals("USER_NOT_FOUND", exception.getErrorCode());
    assertTrue(exception.getMessage().contains(userId.toString()));
}

@Test
void testValidationException() {
    // Given
    UpdateUserRequest request = new UpdateUserRequest();
    request.setEmail("existing@example.com");
    
    User existingUser = new User();
    existingUser.setId(UUID.randomUUID());
    
    when(userRepository.findByEmail(request.getEmail()))
        .thenReturn(Optional.of(existingUser));
    
    // When & Then
    ValidationException exception = assertThrows(
        ValidationException.class,
        () -> userService.validateUserUpdate(UUID.randomUUID(), request)
    );
    
    assertEquals(1, exception.getFieldErrors().size());
    assertEquals("email", exception.getFieldErrors().get(0).getField());
}
```

---

**Next**: [Utilities →](./utilities.md)
