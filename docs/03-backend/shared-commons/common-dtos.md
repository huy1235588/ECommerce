# Common DTOs (Data Transfer Objects)

## 📋 Tổng quan

Tài liệu này định nghĩa các Data Transfer Objects dùng chung cho toàn bộ hệ thống. Các DTOs này đảm bảo tính nhất quán trong cách trả về dữ liệu và nhận request từ client.

## 📦 Response DTOs

### 1. ApiResponse (Base Interface)

Interface cơ bản cho tất cả API responses:

```java
package com.ecommerce.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.Instant;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class ApiResponse {
    protected boolean success;
    protected Instant timestamp;
    protected String traceId;
    protected String path;
    
    protected ApiResponse(boolean success) {
        this.success = success;
        this.timestamp = Instant.now();
    }
}
```

### 2. SuccessResponse

Response cho các trường hợp thành công:

```java
package com.ecommerce.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SuccessResponse<T> extends ApiResponse {
    private T data;
    private String message;
    
    @Builder
    public SuccessResponse(T data, String message) {
        super(true);
        this.data = data;
        this.message = message;
    }
    
    // Static factory methods
    public static <T> SuccessResponse<T> of(T data) {
        return SuccessResponse.<T>builder()
                .data(data)
                .build();
    }
    
    public static <T> SuccessResponse<T> of(T data, String message) {
        return SuccessResponse.<T>builder()
                .data(data)
                .message(message)
                .build();
    }
    
    public static SuccessResponse<Void> empty() {
        return SuccessResponse.<Void>builder().build();
    }
    
    public static SuccessResponse<Void> withMessage(String message) {
        return SuccessResponse.<Void>builder()
                .message(message)
                .build();
    }
}
```

**JSON Example:**
```json
{
    "success": true,
    "data": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "username": "john_doe",
        "email": "john@example.com"
    },
    "message": "User retrieved successfully",
    "timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "550e8400-e29b-41d4-a716-446655440000",
    "path": "/v1/users/123e4567-e89b-12d3-a456-426614174000"
}
```

### 3. ErrorResponse

Response cho các trường hợp lỗi:

```java
package com.ecommerce.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse extends ApiResponse {
    private ErrorDetail error;
    
    @Builder
    public ErrorResponse(ErrorDetail error) {
        super(false);
        this.error = error;
    }
    
    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorDetail {
        private String code;
        private String message;
        private List<FieldError> details;
        private Map<String, Object> metadata;
    }
    
    @Data
    @Builder
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;
    }
    
    // Static factory methods
    public static ErrorResponse of(String code, String message) {
        return ErrorResponse.builder()
                .error(ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .build())
                .build();
    }
    
    public static ErrorResponse of(String code, String message, List<FieldError> details) {
        return ErrorResponse.builder()
                .error(ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .build();
    }
}
```

**JSON Example:**
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Email must be valid",
                "rejectedValue": "invalid-email"
            },
            {
                "field": "password",
                "message": "Password must be at least 8 characters",
                "rejectedValue": null
            }
        ]
    },
    "timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "550e8400-e29b-41d4-a716-446655440000",
    "path": "/v1/auth/register"
}
```

### 4. PageResponse

Response cho pagination:

```java
package com.ecommerce.commons.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PageResponse<T> extends ApiResponse {
    private List<T> data;
    private PageMetadata pagination;
    
    @Builder
    public PageResponse(List<T> data, PageMetadata pagination) {
        super(true);
        this.data = data;
        this.pagination = pagination;
    }
    
    @Data
    @Builder
    public static class PageMetadata {
        private int page;           // Current page (0-indexed)
        private int size;           // Page size
        private long totalElements; // Total items
        private int totalPages;     // Total pages
        private boolean hasNext;    // Has next page
        private boolean hasPrevious; // Has previous page
    }
    
    // Static factory method
    public static <T> PageResponse<T> of(
            List<T> data, 
            int page, 
            int size, 
            long totalElements) {
        
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        return PageResponse.<T>builder()
                .data(data)
                .pagination(PageMetadata.builder()
                        .page(page)
                        .size(size)
                        .totalElements(totalElements)
                        .totalPages(totalPages)
                        .hasNext(page < totalPages - 1)
                        .hasPrevious(page > 0)
                        .build())
                .build();
    }
}
```

**JSON Example:**
```json
{
    "success": true,
    "data": [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "title": "Game Title 1",
            "price": 29.99
        },
        {
            "id": "223e4567-e89b-12d3-a456-426614174001",
            "title": "Game Title 2",
            "price": 39.99
        }
    ],
    "pagination": {
        "page": 0,
        "size": 20,
        "totalElements": 150,
        "totalPages": 8,
        "hasNext": true,
        "hasPrevious": false
    },
    "timestamp": "2025-10-03T12:00:00.000Z",
    "traceId": "550e8400-e29b-41d4-a716-446655440000",
    "path": "/v1/games"
}
```

## 📥 Request DTOs

### 1. PaginationRequest

Request cho pagination parameters:

```java
package com.ecommerce.commons.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {
    
    @Min(value = 0, message = "Page must be greater than or equal to 0")
    @Builder.Default
    private Integer page = 0;
    
    @Min(value = 1, message = "Size must be greater than 0")
    @Max(value = 100, message = "Size must be less than or equal to 100")
    @Builder.Default
    private Integer size = 20;
    
    @Builder.Default
    private String sort = "createdAt";
    
    @Builder.Default
    private String direction = "DESC"; // ASC or DESC
    
    // Helper methods
    public int getOffset() {
        return page * size;
    }
    
    public boolean isAscending() {
        return "ASC".equalsIgnoreCase(direction);
    }
}
```

**Usage Example:**
```java
@GetMapping("/games")
public PageResponse<GameDto> getGames(
        @Valid PaginationRequest pagination) {
    
    Page<Game> games = gameService.findAll(
        pagination.getPage(), 
        pagination.getSize(),
        pagination.getSort(),
        pagination.isAscending()
    );
    
    return PageResponse.of(
        games.getContent(),
        games.getNumber(),
        games.getSize(),
        games.getTotalElements()
    );
}
```

### 2. FilterRequest

Generic filter request:

```java
package com.ecommerce.commons.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FilterRequest {
    
    @Builder.Default
    private List<FilterCriteria> filters = new ArrayList<>();
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FilterCriteria {
        private String field;      // Field name
        private String operator;   // eq, ne, gt, gte, lt, lte, like, in
        private Object value;      // Value to filter
    }
    
    // Helper methods
    public void addFilter(String field, String operator, Object value) {
        filters.add(FilterCriteria.builder()
                .field(field)
                .operator(operator)
                .value(value)
                .build());
    }
    
    public FilterCriteria getFilter(String field) {
        return filters.stream()
                .filter(f -> f.getField().equals(field))
                .findFirst()
                .orElse(null);
    }
}
```

**Usage Example:**
```http
GET /v1/games?filters[0].field=price&filters[0].operator=gte&filters[0].value=20&filters[1].field=category&filters[1].operator=eq&filters[1].value=ACTION
```

### 3. SearchRequest

Search request với pagination:

```java
package com.ecommerce.commons.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest extends PaginationRequest {
    
    @NotBlank(message = "Search query is required")
    @Size(min = 2, max = 100, message = "Search query must be between 2 and 100 characters")
    private String query;
    
    private List<String> fields; // Fields to search in
    
    private List<String> filters; // Additional filters
    
    @Builder
    public SearchRequest(
            Integer page, 
            Integer size, 
            String sort, 
            String direction,
            String query, 
            List<String> fields, 
            List<String> filters) {
        super(page, size, sort, direction);
        this.query = query;
        this.fields = fields;
        this.filters = filters;
    }
}
```

## 🎨 Usage Examples

### Controller Example

```java
@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    // Get single user
    @GetMapping("/{id}")
    public ApiResponse getUser(@PathVariable UUID id) {
        UserDto user = userService.findById(id);
        return SuccessResponse.of(user, "User retrieved successfully");
    }
    
    // Get paginated users
    @GetMapping
    public ApiResponse getUsers(@Valid PaginationRequest pagination) {
        Page<UserDto> users = userService.findAll(
            pagination.getPage(),
            pagination.getSize()
        );
        
        return PageResponse.of(
            users.getContent(),
            users.getNumber(),
            users.getSize(),
            users.getTotalElements()
        );
    }
    
    // Create user
    @PostMapping
    public ApiResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDto user = userService.create(request);
        return SuccessResponse.of(user, "User created successfully");
    }
    
    // Delete user
    @DeleteMapping("/{id}")
    public ApiResponse deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return SuccessResponse.withMessage("User deleted successfully");
    }
}
```

### Service Example

```java
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserDto findById(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "USER_NOT_FOUND",
                "User not found with id: " + id
            ));
        
        return UserDto.from(user);
    }
    
    public Page<UserDto> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserDto::from);
    }
}
```

### Frontend Usage (TypeScript)

```typescript
// Response types
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ErrorDetail;
    message?: string;
    timestamp: string;
    traceId: string;
    path: string;
}

interface PageResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
}

interface ErrorDetail {
    code: string;
    message: string;
    details?: FieldError[];
}

interface FieldError {
    field: string;
    message: string;
    rejectedValue?: any;
}

// API call example
async function getUsers(page: number, size: number): Promise<PageResponse<User>> {
    const response = await axios.get<PageResponse<User>>('/v1/users', {
        params: { page, size }
    });
    
    return response.data;
}

// Error handling
try {
    const user = await createUser(userData);
    console.log('User created:', user.data);
} catch (error) {
    if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data as ApiResponse;
        console.error('Error code:', errorResponse.error?.code);
        console.error('Error message:', errorResponse.error?.message);
        
        // Handle field errors
        errorResponse.error?.details?.forEach(fieldError => {
            console.error(`${fieldError.field}: ${fieldError.message}`);
        });
    }
}
```

## ✅ Best Practices

### 1. Consistent Response Format
- Always use `SuccessResponse` for successful operations
- Always use `ErrorResponse` for errors
- Always include `traceId` for debugging

### 2. Pagination
- Default page size: 20
- Max page size: 100
- Page is 0-indexed
- Always include pagination metadata

### 3. Validation
- Validate all request DTOs with `@Valid`
- Use Jakarta Validation annotations
- Provide clear error messages

### 4. Null Handling
- Use `@JsonInclude(JsonInclude.Include.NON_NULL)` to omit null fields
- Explicitly handle Optional values
- Document nullable fields

### 5. Generic Types
- Use generic types for reusability
- Type-safe response handling
- Clear type inference

## 🧪 Testing

### Unit Test Example

```java
@Test
void testSuccessResponseCreation() {
    // Given
    UserDto user = new UserDto("123", "john_doe", "john@example.com");
    
    // When
    SuccessResponse<UserDto> response = SuccessResponse.of(user);
    
    // Then
    assertTrue(response.isSuccess());
    assertEquals(user, response.getData());
    assertNotNull(response.getTimestamp());
}

@Test
void testPageResponseCreation() {
    // Given
    List<UserDto> users = Arrays.asList(
        new UserDto("1", "user1", "user1@example.com"),
        new UserDto("2", "user2", "user2@example.com")
    );
    
    // When
    PageResponse<UserDto> response = PageResponse.of(users, 0, 20, 50);
    
    // Then
    assertTrue(response.isSuccess());
    assertEquals(2, response.getData().size());
    assertEquals(0, response.getPagination().getPage());
    assertEquals(20, response.getPagination().getSize());
    assertEquals(50, response.getPagination().getTotalElements());
    assertEquals(3, response.getPagination().getTotalPages());
    assertTrue(response.getPagination().isHasNext());
    assertFalse(response.getPagination().isHasPrevious());
}
```

## 📝 Notes

- Tất cả DTOs sử dụng Lombok để giảm boilerplate code
- Jackson annotations cho JSON serialization/deserialization
- Immutable khi có thể (sử dụng `@Builder` thay vì setters)
- Generic types cho flexibility và type safety
- Static factory methods cho convenience

---

**Next**: [Custom Exceptions →](./custom-exceptions.md)
