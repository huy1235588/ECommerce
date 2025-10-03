# Constants

## 📋 Tổng quan

Tài liệu này định nghĩa các constants dùng chung trong toàn bộ hệ thống để đảm bảo tính nhất quán và dễ bảo trì.

## 📦 Constant Classes

### 1. ErrorCode

Error codes chuẩn hóa:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ErrorCode {
    
    // Authentication Errors (AUTH_*)
    public static final String INVALID_CREDENTIALS = "AUTH_001";
    public static final String TOKEN_EXPIRED = "AUTH_002";
    public static final String TOKEN_INVALID = "AUTH_003";
    public static final String TOKEN_MISSING = "AUTH_004";
    public static final String UNAUTHORIZED = "AUTH_005";
    
    // Validation Errors (VAL_*)
    public static final String VALIDATION_ERROR = "VAL_001";
    public static final String INVALID_EMAIL = "VAL_002";
    public static final String INVALID_PASSWORD = "VAL_003";
    public static final String INVALID_PHONE = "VAL_004";
    public static final String INVALID_UUID = "VAL_005";
    
    // Resource Errors (RES_*)
    public static final String RESOURCE_NOT_FOUND = "RES_001";
    public static final String RESOURCE_ALREADY_EXISTS = "RES_002";
    public static final String RESOURCE_CONFLICT = "RES_003";
    
    // Business Logic Errors (BUS_*)
    public static final String INSUFFICIENT_PERMISSION = "BUS_001";
    public static final String INVALID_OPERATION = "BUS_002";
    public static final String BUSINESS_RULE_VIOLATION = "BUS_003";
    
    // Rate Limiting Errors (RATE_*)
    public static final String RATE_LIMIT_EXCEEDED = "RATE_001";
    public static final String TOO_MANY_REQUESTS = "RATE_002";
    
    // Payment Errors (PAY_*)
    public static final String PAYMENT_FAILED = "PAY_001";
    public static final String PAYMENT_DECLINED = "PAY_002";
    public static final String INSUFFICIENT_FUNDS = "PAY_003";
    public static final String PAYMENT_TIMEOUT = "PAY_004";
    
    // Order Errors (ORD_*)
    public static final String ORDER_NOT_FOUND = "ORD_001";
    public static final String INVALID_ORDER_STATUS = "ORD_002";
    public static final String ORDER_ALREADY_PAID = "ORD_003";
    public static final String ORDER_CANCELLED = "ORD_004";
    
    // User Errors (USR_*)
    public static final String USER_NOT_FOUND = "USR_001";
    public static final String USER_ALREADY_EXISTS = "USR_002";
    public static final String USER_INACTIVE = "USR_003";
    public static final String EMAIL_NOT_VERIFIED = "USR_004";
    
    // Server Errors (SRV_*)
    public static final String INTERNAL_SERVER_ERROR = "SRV_001";
    public static final String SERVICE_UNAVAILABLE = "SRV_002";
    public static final String DATABASE_ERROR = "SRV_003";
    public static final String EXTERNAL_SERVICE_ERROR = "SRV_004";
}
```

### 2. HttpStatusCode

HTTP status codes mapping:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;
import org.springframework.http.HttpStatus;

import java.util.Map;

@UtilityClass
public class HttpStatusCode {
    
    // Success
    public static final int OK = 200;
    public static final int CREATED = 201;
    public static final int ACCEPTED = 202;
    public static final int NO_CONTENT = 204;
    
    // Client Errors
    public static final int BAD_REQUEST = 400;
    public static final int UNAUTHORIZED = 401;
    public static final int FORBIDDEN = 403;
    public static final int NOT_FOUND = 404;
    public static final int METHOD_NOT_ALLOWED = 405;
    public static final int CONFLICT = 409;
    public static final int UNPROCESSABLE_ENTITY = 422;
    public static final int TOO_MANY_REQUESTS = 429;
    
    // Server Errors
    public static final int INTERNAL_SERVER_ERROR = 500;
    public static final int NOT_IMPLEMENTED = 501;
    public static final int BAD_GATEWAY = 502;
    public static final int SERVICE_UNAVAILABLE = 503;
    public static final int GATEWAY_TIMEOUT = 504;
    
    /**
     * Map error codes to HTTP status codes
     */
    private static final Map<String, HttpStatus> ERROR_CODE_TO_STATUS = Map.ofEntries(
        // Authentication
        Map.entry(ErrorCode.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED),
        Map.entry(ErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED),
        Map.entry(ErrorCode.TOKEN_INVALID, HttpStatus.UNAUTHORIZED),
        Map.entry(ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED),
        
        // Validation
        Map.entry(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST),
        Map.entry(ErrorCode.INVALID_EMAIL, HttpStatus.BAD_REQUEST),
        Map.entry(ErrorCode.INVALID_PASSWORD, HttpStatus.BAD_REQUEST),
        
        // Resource
        Map.entry(ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND),
        Map.entry(ErrorCode.RESOURCE_ALREADY_EXISTS, HttpStatus.CONFLICT),
        Map.entry(ErrorCode.RESOURCE_CONFLICT, HttpStatus.CONFLICT),
        
        // Business
        Map.entry(ErrorCode.INSUFFICIENT_PERMISSION, HttpStatus.FORBIDDEN),
        Map.entry(ErrorCode.INVALID_OPERATION, HttpStatus.BAD_REQUEST),
        
        // Rate Limiting
        Map.entry(ErrorCode.RATE_LIMIT_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS),
        
        // Server
        Map.entry(ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR),
        Map.entry(ErrorCode.SERVICE_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE)
    );
    
    public static HttpStatus getStatus(String errorCode) {
        return ERROR_CODE_TO_STATUS.getOrDefault(errorCode, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 3. KafkaTopics

Kafka topic names:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class KafkaTopics {
    
    // User Events
    public static final String USER_EVENTS = "user-events";
    public static final String USER_REGISTERED = "user-registered";
    public static final String USER_UPDATED = "user-updated";
    public static final String USER_DELETED = "user-deleted";
    
    // Order Events
    public static final String ORDER_EVENTS = "order-events";
    public static final String ORDER_CREATED = "order-created";
    public static final String ORDER_PAID = "order-paid";
    public static final String ORDER_CANCELLED = "order-cancelled";
    public static final String ORDER_COMPLETED = "order-completed";
    
    // Payment Events
    public static final String PAYMENT_EVENTS = "payment-events";
    public static final String PAYMENT_INITIATED = "payment-initiated";
    public static final String PAYMENT_COMPLETED = "payment-completed";
    public static final String PAYMENT_FAILED = "payment-failed";
    public static final String PAYMENT_REFUNDED = "payment-refunded";
    
    // Notification Events
    public static final String NOTIFICATION_EVENTS = "notification-events";
    public static final String NOTIFICATION_EMAIL = "notification-email";
    public static final String NOTIFICATION_PUSH = "notification-push";
    public static final String NOTIFICATION_SMS = "notification-sms";
    
    // Game Events
    public static final String GAME_EVENTS = "game-events";
    public static final String GAME_CREATED = "game-created";
    public static final String GAME_UPDATED = "game-updated";
    public static final String GAME_DELETED = "game-deleted";
    
    // Inventory Events
    public static final String INVENTORY_EVENTS = "inventory-events";
    public static final String STOCK_UPDATED = "stock-updated";
    public static final String STOCK_RESERVED = "stock-reserved";
    public static final String STOCK_RELEASED = "stock-released";
    
    // Dead Letter Queue
    public static final String DLQ_SUFFIX = ".dlq";
    
    public static String getDlqTopic(String originalTopic) {
        return originalTopic + DLQ_SUFFIX;
    }
}
```

### 4. RedisKeys

Redis key patterns:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;

import java.util.UUID;

@UtilityClass
public class RedisKeys {
    
    // Prefixes
    private static final String SESSION_PREFIX = "session:";
    private static final String CACHE_PREFIX = "cache:";
    private static final String RATE_LIMIT_PREFIX = "rate_limit:";
    private static final String TOKEN_PREFIX = "token:";
    private static final String OTP_PREFIX = "otp:";
    private static final String LOCK_PREFIX = "lock:";
    
    // Session Keys
    public static String sessionKey(String sessionId) {
        return SESSION_PREFIX + sessionId;
    }
    
    public static String userSessionsKey(UUID userId) {
        return SESSION_PREFIX + "user:" + userId;
    }
    
    // Cache Keys
    public static String cacheKey(String entity, UUID id) {
        return CACHE_PREFIX + entity + ":" + id;
    }
    
    public static String userCacheKey(UUID userId) {
        return cacheKey("user", userId);
    }
    
    public static String gameCacheKey(UUID gameId) {
        return cacheKey("game", gameId);
    }
    
    public static String orderCacheKey(UUID orderId) {
        return cacheKey("order", orderId);
    }
    
    // Rate Limit Keys
    public static String rateLimitKey(String identifier, String endpoint) {
        return RATE_LIMIT_PREFIX + identifier + ":" + endpoint;
    }
    
    public static String userRateLimitKey(UUID userId, String endpoint) {
        return rateLimitKey("user:" + userId, endpoint);
    }
    
    public static String ipRateLimitKey(String ip, String endpoint) {
        return rateLimitKey("ip:" + ip, endpoint);
    }
    
    // Token Keys
    public static String refreshTokenKey(String token) {
        return TOKEN_PREFIX + "refresh:" + token;
    }
    
    public static String accessTokenKey(String token) {
        return TOKEN_PREFIX + "access:" + token;
    }
    
    public static String passwordResetTokenKey(String token) {
        return TOKEN_PREFIX + "password_reset:" + token;
    }
    
    public static String emailVerificationTokenKey(String token) {
        return TOKEN_PREFIX + "email_verification:" + token;
    }
    
    // OTP Keys
    public static String otpKey(String identifier, String purpose) {
        return OTP_PREFIX + purpose + ":" + identifier;
    }
    
    public static String emailOtpKey(String email) {
        return otpKey(email, "email");
    }
    
    public static String phoneOtpKey(String phone) {
        return otpKey(phone, "phone");
    }
    
    // Distributed Lock Keys
    public static String lockKey(String resource) {
        return LOCK_PREFIX + resource;
    }
    
    public static String orderLockKey(UUID orderId) {
        return lockKey("order:" + orderId);
    }
    
    public static String inventoryLockKey(UUID gameId) {
        return lockKey("inventory:" + gameId);
    }
    
    // TTL Constants (in seconds)
    public static final long SESSION_TTL = 24 * 60 * 60; // 24 hours
    public static final long CACHE_TTL = 60 * 60; // 1 hour
    public static final long RATE_LIMIT_TTL = 60; // 1 minute
    public static final long REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
    public static final long ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes
    public static final long OTP_TTL = 5 * 60; // 5 minutes
    public static final long LOCK_TTL = 30; // 30 seconds
}
```

### 5. ConfigKeys

Configuration keys:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ConfigKeys {
    
    // Application
    public static final String APP_NAME = "spring.application.name";
    public static final String APP_VERSION = "spring.application.version";
    public static final String APP_PROFILE = "spring.profiles.active";
    
    // Server
    public static final String SERVER_PORT = "server.port";
    public static final String SERVER_CONTEXT_PATH = "server.servlet.context-path";
    
    // Database
    public static final String DB_URL = "spring.datasource.url";
    public static final String DB_USERNAME = "spring.datasource.username";
    public static final String DB_PASSWORD = "spring.datasource.password";
    public static final String DB_DRIVER = "spring.datasource.driver-class-name";
    
    // Redis
    public static final String REDIS_HOST = "spring.redis.host";
    public static final String REDIS_PORT = "spring.redis.port";
    public static final String REDIS_PASSWORD = "spring.redis.password";
    
    // Kafka
    public static final String KAFKA_BOOTSTRAP_SERVERS = "spring.kafka.bootstrap-servers";
    public static final String KAFKA_GROUP_ID = "spring.kafka.consumer.group-id";
    
    // JWT
    public static final String JWT_SECRET = "jwt.secret";
    public static final String JWT_EXPIRATION = "jwt.expiration";
    public static final String JWT_REFRESH_EXPIRATION = "jwt.refresh-expiration";
    
    // Email
    public static final String EMAIL_HOST = "spring.mail.host";
    public static final String EMAIL_PORT = "spring.mail.port";
    public static final String EMAIL_USERNAME = "spring.mail.username";
    public static final String EMAIL_PASSWORD = "spring.mail.password";
    
    // File Upload
    public static final String UPLOAD_MAX_FILE_SIZE = "spring.servlet.multipart.max-file-size";
    public static final String UPLOAD_MAX_REQUEST_SIZE = "spring.servlet.multipart.max-request-size";
    
    // CORS
    public static final String CORS_ALLOWED_ORIGINS = "cors.allowed-origins";
    public static final String CORS_ALLOWED_METHODS = "cors.allowed-methods";
    
    // API Rate Limiting
    public static final String RATE_LIMIT_ENABLED = "rate-limit.enabled";
    public static final String RATE_LIMIT_REQUESTS = "rate-limit.requests";
    public static final String RATE_LIMIT_DURATION = "rate-limit.duration";
}
```

### 6. AppConstants

General application constants:

```java
package com.ecommerce.commons.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AppConstants {
    
    // API Version
    public static final String API_V1 = "/v1";
    public static final String API_V2 = "/v2";
    
    // Date/Time Formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    
    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "DESC";
    
    // Validation
    public static final int MIN_PASSWORD_LENGTH = 8;
    public static final int MAX_PASSWORD_LENGTH = 100;
    public static final int MIN_USERNAME_LENGTH = 3;
    public static final int MAX_USERNAME_LENGTH = 20;
    public static final int MAX_EMAIL_LENGTH = 255;
    
    // File Upload
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif"};
    
    // Rate Limiting
    public static final int DEFAULT_RATE_LIMIT = 100; // requests
    public static final int DEFAULT_RATE_LIMIT_DURATION = 60; // seconds
    
    // Security
    public static final int BCRYPT_STRENGTH = 12;
    public static final int TOKEN_LENGTH = 32;
    public static final int OTP_LENGTH = 6;
    
    // Headers
    public static final String HEADER_AUTHORIZATION = "Authorization";
    public static final String HEADER_TRACE_ID = "X-Trace-Id";
    public static final String HEADER_API_KEY = "X-Api-Key";
    public static final String HEADER_CORRELATION_ID = "X-Correlation-Id";
    
    // User Roles
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_MODERATOR = "ROLE_MODERATOR";
    
    // Order Status
    public static final String ORDER_STATUS_PENDING = "PENDING";
    public static final String ORDER_STATUS_CONFIRMED = "CONFIRMED";
    public static final String ORDER_STATUS_PAID = "PAID";
    public static final String ORDER_STATUS_SHIPPED = "SHIPPED";
    public static final String ORDER_STATUS_DELIVERED = "DELIVERED";
    public static final String ORDER_STATUS_CANCELLED = "CANCELLED";
    
    // Payment Status
    public static final String PAYMENT_STATUS_PENDING = "PENDING";
    public static final String PAYMENT_STATUS_PROCESSING = "PROCESSING";
    public static final String PAYMENT_STATUS_COMPLETED = "COMPLETED";
    public static final String PAYMENT_STATUS_FAILED = "FAILED";
    public static final String PAYMENT_STATUS_REFUNDED = "REFUNDED";
    
    // Notification Types
    public static final String NOTIFICATION_TYPE_EMAIL = "EMAIL";
    public static final String NOTIFICATION_TYPE_PUSH = "PUSH";
    public static final String NOTIFICATION_TYPE_SMS = "SMS";
    public static final String NOTIFICATION_TYPE_IN_APP = "IN_APP";
    
    // Notification Priority
    public static final String PRIORITY_HIGH = "HIGH";
    public static final String PRIORITY_MEDIUM = "MEDIUM";
    public static final String PRIORITY_LOW = "LOW";
}
```

## 🎨 Usage Examples

### Example 1: Using Error Codes

```java
@Service
public class UserService {
    
    public User findById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                ErrorCode.USER_NOT_FOUND,
                "User not found with id: " + id
            ));
    }
    
    public void validatePassword(String password) {
        if (password.length() < AppConstants.MIN_PASSWORD_LENGTH) {
            throw new ValidationException(ErrorCode.INVALID_PASSWORD)
                .addFieldError(
                    "password",
                    "Password must be at least " + AppConstants.MIN_PASSWORD_LENGTH + " characters",
                    password
                );
        }
    }
}
```

### Example 2: Using Redis Keys

```java
@Service
@RequiredArgsConstructor
public class CacheService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    public void cacheUser(User user) {
        String key = RedisKeys.userCacheKey(user.getId());
        redisTemplate.opsForValue().set(
            key,
            user,
            RedisKeys.CACHE_TTL,
            TimeUnit.SECONDS
        );
    }
    
    public Optional<User> getCachedUser(UUID userId) {
        String key = RedisKeys.userCacheKey(userId);
        User user = (User) redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(user);
    }
    
    public void invalidateUserCache(UUID userId) {
        String key = RedisKeys.userCacheKey(userId);
        redisTemplate.delete(key);
    }
}
```

### Example 3: Using Kafka Topics

```java
@Service
@RequiredArgsConstructor
public class EventPublisher {
    
    private final KafkaTemplate<String, BaseEvent> kafkaTemplate;
    
    public void publishUserRegistered(User user) {
        UserEvent event = UserEvent.registered(
            user.getId(),
            user.getEmail(),
            user.getUsername()
        );
        
        kafkaTemplate.send(
            KafkaTopics.USER_EVENTS,
            user.getId().toString(),
            event
        );
    }
    
    public void publishOrderCreated(Order order) {
        OrderEvent event = OrderEvent.created(
            order.getId(),
            order.getUserId(),
            order.getTotalAmount(),
            order.getItems()
        );
        
        kafkaTemplate.send(
            KafkaTopics.ORDER_EVENTS,
            order.getId().toString(),
            event
        );
    }
}
```

### Example 4: Using Configuration Keys

```java
@Configuration
public class AppConfig {
    
    @Value("${" + ConfigKeys.JWT_SECRET + "}")
    private String jwtSecret;
    
    @Value("${" + ConfigKeys.JWT_EXPIRATION + "}")
    private long jwtExpiration;
    
    @Value("${" + ConfigKeys.RATE_LIMIT_ENABLED + ":true}")
    private boolean rateLimitEnabled;
    
    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil(jwtSecret, jwtExpiration);
    }
}
```

## ✅ Best Practices

1. **Grouping**: Group constants by domain/functionality
2. **Naming**: Use UPPER_SNAKE_CASE cho constants
3. **Documentation**: Document purpose của mỗi constant
4. **Type Safety**: Use enums thay vì string constants khi có thể
5. **Immutability**: Tất cả constants phải là `final`
6. **Utility Class**: Use `@UtilityClass` annotation
7. **Avoid Magic Numbers**: Replace magic numbers với named constants

## 🧪 Testing

```java
@Test
void testRedisKeyGeneration() {
    UUID userId = UUID.randomUUID();
    String key = RedisKeys.userCacheKey(userId);
    
    assertTrue(key.startsWith("cache:user:"));
    assertTrue(key.contains(userId.toString()));
}

@Test
void testErrorCodeMapping() {
    HttpStatus status = HttpStatusCode.getStatus(ErrorCode.USER_NOT_FOUND);
    assertEquals(HttpStatus.NOT_FOUND, status);
}

@Test
void testKafkaDlqTopic() {
    String dlqTopic = KafkaTopics.getDlqTopic(KafkaTopics.USER_EVENTS);
    assertEquals("user-events.dlq", dlqTopic);
}
```

---

**Next**: [Security Components →](./security-components.md)
