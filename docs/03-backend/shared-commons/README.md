# Shared Commons Documentation

## 📋 Tổng quan

Shared Commons là module chứa các thành phần dùng chung (utilities, models, exceptions, constants) được sử dụng bởi tất cả các microservices trong hệ thống ECommerce. Mục tiêu là đảm bảo tính nhất quán, tái sử dụng code và giảm thiểu duplicate code.

## 🎯 Mục đích

### 1. Code Reusability
- Tránh duplicate code giữa các services
- Đảm bảo logic xử lý giống nhau được implement một lần
- Dễ dàng maintain và update

### 2. Consistency
- Chuẩn hóa error handling
- Unified response format
- Consistent validation rules

### 3. Maintainability
- Centralized configuration
- Single source of truth
- Easy to update across services

## 📦 Cấu trúc Module

```
shared-commons/
├── src/main/java/com/ecommerce/commons/
│   ├── annotation/          # Custom annotations
│   │   ├── ValidUUID.java
│   │   ├── ValidEmail.java
│   │   └── ValidPhoneNumber.java
│   │
│   ├── config/              # Common configurations
│   │   ├── JacksonConfig.java
│   │   ├── SecurityConfig.java
│   │   └── KafkaConfig.java
│   │
│   ├── constant/            # Application constants
│   │   ├── ErrorCode.java
│   │   ├── HttpStatusCode.java
│   │   ├── KafkaTopics.java
│   │   └── RedisKeys.java
│   │
│   ├── dto/                 # Data Transfer Objects
│   │   ├── request/
│   │   │   ├── PaginationRequest.java
│   │   │   └── FilterRequest.java
│   │   └── response/
│   │       ├── ApiResponse.java
│   │       ├── ErrorResponse.java
│   │       ├── PageResponse.java
│   │       └── SuccessResponse.java
│   │
│   ├── entity/              # Base entities
│   │   ├── BaseEntity.java
│   │   └── AuditableEntity.java
│   │
│   ├── event/               # Domain events (Kafka)
│   │   ├── BaseEvent.java
│   │   ├── UserEvent.java
│   │   ├── OrderEvent.java
│   │   └── NotificationEvent.java
│   │
│   ├── exception/           # Custom exceptions
│   │   ├── BusinessException.java
│   │   ├── ResourceNotFoundException.java
│   │   ├── ValidationException.java
│   │   ├── UnauthorizedException.java
│   │   └── GlobalExceptionHandler.java
│   │
│   ├── filter/              # Common filters
│   │   ├── RequestLoggingFilter.java
│   │   └── TraceIdFilter.java
│   │
│   ├── security/            # Security utilities
│   │   ├── JwtUtil.java
│   │   ├── PasswordEncoder.java
│   │   └── SecurityContext.java
│   │
│   ├── util/                # Utility classes
│   │   ├── DateTimeUtil.java
│   │   ├── StringUtil.java
│   │   ├── JsonUtil.java
│   │   ├── ValidationUtil.java
│   │   └── UUIDUtil.java
│   │
│   └── validator/           # Custom validators
│       ├── UUIDValidator.java
│       ├── EmailValidator.java
│       └── PhoneNumberValidator.java
│
└── pom.xml
```

## 📚 Nội dung tài liệu

### 1. [Common DTOs](./common-dtos.md)
Định nghĩa các Data Transfer Objects dùng chung:
- Request/Response wrappers
- Pagination structures
- Error response format
- Success response format

### 2. [Custom Exceptions](./custom-exceptions.md)
Các exception classes và global exception handler:
- Business exceptions
- Validation exceptions
- Resource not found
- Authentication/Authorization exceptions
- Global exception handler

### 3. [Utilities](./utilities.md)
Các utility classes hỗ trợ:
- Date/Time utilities
- String manipulation
- JSON processing
- UUID generation
- Validation helpers

### 4. [Base Entities](./base-entities.md)
Các entity base classes:
- Base entity với common fields
- Auditable entity với created/updated tracking
- Soft delete support

### 5. [Domain Events](./domain-events.md)
Event structures cho Kafka messaging:
- Base event structure
- User events
- Order events
- Notification events
- Payment events

### 6. [Constants](./constants.md)
Application-wide constants:
- Error codes
- HTTP status codes
- Kafka topics
- Redis key patterns
- Configuration keys

### 7. [Security Components](./security-components.md)
Security-related utilities:
- JWT utilities
- Password encoding
- Security context
- Token validation

### 8. [Validators & Annotations](./validators-annotations.md)
Custom validation logic:
- UUID validation
- Email validation
- Phone number validation
- Custom annotations

## 🚀 Sử dụng trong Services

### 1. Thêm Dependency

Trong `pom.xml` của mỗi service:

```xml
<dependency>
    <groupId>com.ecommerce</groupId>
    <artifactId>shared-commons</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 2. Import và Sử dụng

```java
// Sử dụng ApiResponse
import com.ecommerce.commons.dto.response.ApiResponse;
import com.ecommerce.commons.dto.response.SuccessResponse;

@RestController
public class UserController {
    
    @GetMapping("/users/{id}")
    public ApiResponse getUser(@PathVariable UUID id) {
        User user = userService.findById(id);
        return SuccessResponse.of(user);
    }
}

// Sử dụng Custom Exception
import com.ecommerce.commons.exception.ResourceNotFoundException;

public class UserService {
    
    public User findById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "USER_NOT_FOUND", 
                "User not found with id: " + id
            ));
    }
}

// Sử dụng Utilities
import com.ecommerce.commons.util.DateTimeUtil;
import com.ecommerce.commons.util.UUIDUtil;

public class OrderService {
    
    public Order createOrder() {
        Order order = new Order();
        order.setId(UUIDUtil.generate());
        order.setCreatedAt(DateTimeUtil.nowUtc());
        return order;
    }
}
```

### 3. Sử dụng Domain Events

```java
import com.ecommerce.commons.event.UserEvent;
import org.springframework.kafka.core.KafkaTemplate;

@Service
public class UserService {
    
    @Autowired
    private KafkaTemplate<String, UserEvent> kafkaTemplate;
    
    public void registerUser(User user) {
        // Save user
        userRepository.save(user);
        
        // Publish event
        UserEvent event = UserEvent.builder()
            .eventType("USER_REGISTERED")
            .userId(user.getId())
            .email(user.getEmail())
            .timestamp(Instant.now())
            .build();
            
        kafkaTemplate.send("user-events", event);
    }
}
```

## ⚠️ Best Practices

### 1. Version Management
- Maintain backward compatibility
- Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Document breaking changes clearly
- Deprecate old features gradually

### 2. Testing
- Unit test all utility methods
- Test custom validators thoroughly
- Test exception handling scenarios
- Mock external dependencies

### 3. Documentation
- JavaDoc cho tất cả public methods
- Provide usage examples
- Document edge cases
- Keep documentation up-to-date

### 4. Performance
- Keep utilities stateless
- Avoid heavy operations
- Cache when appropriate
- Use efficient algorithms

### 5. Security
- Never log sensitive data
- Validate all inputs
- Use secure random for tokens
- Follow OWASP guidelines

## 🔄 Update Strategy

### Khi cần update Shared Commons:

1. **Bump Version**: Tăng version theo semantic versioning
2. **Test Thoroughly**: Test với tất cả services sử dụng
3. **Update Documentation**: Cập nhật tài liệu và migration guide
4. **Notify Teams**: Thông báo breaking changes (nếu có)
5. **Gradual Rollout**: Deploy từng service một để test
6. **Monitor**: Theo dõi logs và metrics sau khi deploy

### Breaking Changes:

Nếu có breaking changes, cần:
- Tạo version mới (major version bump)
- Maintain old version song song trong 1-2 release cycles
- Provide migration guide chi tiết
- Support cả 2 versions trong transition period

## 📊 Dependencies

### Core Dependencies

```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    
    <!-- Jackson -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <scope>provided</scope>
    </dependency>
    
    <!-- Apache Commons -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>
    
    <!-- Kafka -->
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## 🔍 Monitoring & Logging

### Logging Standards

Shared commons tự động thêm:
- Trace ID cho mỗi request
- Request/Response logging
- Exception logging với stack trace
- Performance metrics

### Metrics

Track các metrics quan trọng:
- API response times
- Error rates by type
- JWT validation success/failure
- Cache hit/miss rates

## 📝 Changelog

### Version 1.0.0 (Initial Release)
- Base DTOs (ApiResponse, PageResponse)
- Common exceptions
- Core utilities (DateTime, UUID, String)
- JWT utilities
- Base entities
- Custom validators
- Domain events structure
- Global exception handler

### Future Enhancements
- Rate limiting utilities
- Circuit breaker integration
- Distributed tracing support
- Advanced caching utilities
- More validation annotations
- Audit logging utilities

---

**Note**: Đây là living document và sẽ được cập nhật khi có thay đổi trong shared-commons module.
