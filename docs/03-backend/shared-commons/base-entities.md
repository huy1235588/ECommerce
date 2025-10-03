# Base Entities

## 📋 Tổng quan

Tài liệu này định nghĩa các base entity classes cung cấp common fields và functionality cho tất cả entities trong hệ thống.

## 📦 Entity Classes

### 1. BaseEntity

Base class cho tất cả entities:

```java
package com.ecommerce.commons.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @Version
    @Column(name = "version")
    private Long version;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseEntity that = (BaseEntity) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

**Features:**
- **UUID Primary Key**: Sử dụng UUID cho distributed system
- **Optimistic Locking**: `@Version` để handle concurrent updates
- **Serializable**: Hỗ trợ caching và distributed sessions
- **equals/hashCode**: Based on ID

### 2. AuditableEntity

Entity với audit fields (created/updated tracking):

```java
package com.ecommerce.commons.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditableEntity extends BaseEntity {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private UUID createdBy;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @LastModifiedBy
    @Column(name = "updated_by")
    private UUID updatedBy;
}
```

**Features:**
- **Automatic Timestamps**: Tự động set created/updated timestamps
- **User Tracking**: Track user nào tạo/cập nhật
- **JPA Auditing**: Sử dụng Spring Data JPA auditing

### 3. SoftDeletableEntity

Entity hỗ trợ soft delete:

```java
package com.ecommerce.commons.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public abstract class SoftDeletableEntity extends AuditableEntity {
    
    @Column(name = "deleted_at")
    private Instant deletedAt;
    
    @Column(name = "deleted_by")
    private UUID deletedBy;
    
    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;
    
    /**
     * Soft delete the entity
     */
    public void softDelete(UUID deletedBy) {
        this.deleted = true;
        this.deletedAt = Instant.now();
        this.deletedBy = deletedBy;
    }
    
    /**
     * Restore soft deleted entity
     */
    public void restore() {
        this.deleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
    }
    
    /**
     * Check if entity is deleted
     */
    public boolean isDeleted() {
        return deleted;
    }
}
```

**Features:**
- **Soft Delete**: Không xóa thật khỏi database
- **Recovery**: Có thể restore lại
- **Audit Trail**: Track thời gian và user xóa

### 4. TimestampedEntity

Simplified entity với chỉ timestamps (không cần user tracking):

```java
package com.ecommerce.commons.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class TimestampedEntity extends BaseEntity {
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
}
```

## 🔧 Configuration

### Enable JPA Auditing

```java
package com.ecommerce.commons.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {
    
    @Bean
    public AuditorAware<UUID> auditorProvider() {
        return new AuditorAwareImpl();
    }
    
    static class AuditorAwareImpl implements AuditorAware<UUID> {
        
        @Override
        public Optional<UUID> getCurrentAuditor() {
            Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();
            
            if (authentication == null || 
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
                return Optional.empty();
            }
            
            // Assuming principal contains user ID
            Object principal = authentication.getPrincipal();
            if (principal instanceof String) {
                try {
                    return Optional.of(UUID.fromString((String) principal));
                } catch (IllegalArgumentException e) {
                    return Optional.empty();
                }
            }
            
            return Optional.empty();
        }
    }
}
```

## 🎨 Usage Examples

### Example 1: Simple Entity

```java
@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends AuditableEntity {
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role;
    
    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
```

### Example 2: Soft Deletable Entity

```java
@Entity
@Table(name = "products")
@Getter
@Setter
public class Product extends SoftDeletableEntity {
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "price", nullable = false)
    private BigDecimal price;
    
    @Column(name = "stock", nullable = false)
    private Integer stock;
}
```

### Example 3: Repository với Soft Delete

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    // Find only non-deleted products
    @Query("SELECT p FROM Product p WHERE p.deleted = false")
    Page<Product> findAllActive(Pageable pageable);
    
    // Find by ID (non-deleted only)
    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.deleted = false")
    Optional<Product> findByIdActive(@Param("id") UUID id);
    
    // Find including deleted
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdIncludingDeleted(@Param("id") UUID id);
}
```

### Example 4: Service với Soft Delete

```java
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public Product findById(UUID id) {
        return productRepository.findByIdActive(id)
            .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
    }
    
    public void deleteProduct(UUID id, UUID userId) {
        Product product = findById(id);
        product.softDelete(userId);
        productRepository.save(product);
    }
    
    public void restoreProduct(UUID id) {
        Product product = productRepository.findByIdIncludingDeleted(id)
            .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
        
        if (!product.isDeleted()) {
            throw new InvalidOperationException(
                "PRODUCT_NOT_DELETED",
                "Product is not deleted"
            );
        }
        
        product.restore();
        productRepository.save(product);
    }
}
```

### Example 5: Simple Timestamped Entity

```java
@Entity
@Table(name = "logs")
@Getter
@Setter
public class ActivityLog extends TimestampedEntity {
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "action", nullable = false)
    private String action;
    
    @Column(name = "entity_type")
    private String entityType;
    
    @Column(name = "entity_id")
    private UUID entityId;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "metadata", columnDefinition = "JSONB")
    @Type(JsonBinaryType.class)
    private Map<String, Object> metadata;
}
```

## 📊 Database Schema Example

### Generated Schema

```sql
-- Base fields (from BaseEntity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version BIGINT DEFAULT 0,
    
    -- Auditable fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,
    
    -- User-specific fields
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Soft deletable entity
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version BIGINT DEFAULT 0,
    
    -- Auditable fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID,
    
    -- Soft delete fields
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    
    -- Product-specific fields
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0
);

-- Index for soft delete queries
CREATE INDEX idx_products_not_deleted ON products (id) WHERE is_deleted = false;
```

## ✅ Best Practices

### 1. Choose the Right Base Class

- **BaseEntity**: Minimal, chỉ ID và version
- **TimestampedEntity**: Cần timestamps nhưng không cần user tracking (e.g., logs)
- **AuditableEntity**: Full audit trail với user tracking
- **SoftDeletableEntity**: Cần soft delete functionality

### 2. Optimistic Locking

```java
@Service
public class OrderService {
    
    @Transactional
    public Order updateOrder(UUID orderId, UpdateOrderRequest request) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> ResourceNotFoundException.of("Order", orderId));
        
        // Version check happens automatically
        order.setStatus(request.getStatus());
        
        try {
            return orderRepository.save(order);
        } catch (OptimisticLockingFailureException e) {
            throw new InvalidOperationException(
                "ORDER_CONFLICT",
                "Order was modified by another user. Please refresh and try again"
            );
        }
    }
}
```

### 3. Soft Delete Queries

Always filter by `deleted = false` trong queries:

```java
// Using @Query
@Query("SELECT p FROM Product p WHERE p.deleted = false AND p.category = :category")
List<Product> findByCategory(@Param("category") String category);

// Or use Specification
public class ProductSpecifications {
    
    public static Specification<Product> notDeleted() {
        return (root, query, cb) -> cb.equal(root.get("deleted"), false);
    }
    
    public static Specification<Product> byCategory(String category) {
        return (root, query, cb) -> cb.equal(root.get("category"), category);
    }
}

// Usage
List<Product> products = productRepository.findAll(
    Specification.where(ProductSpecifications.notDeleted())
        .and(ProductSpecifications.byCategory("ACTION"))
);
```

### 4. Audit Logging

```java
@Aspect
@Component
@Slf4j
public class AuditAspect {
    
    @AfterReturning(
        pointcut = "execution(* com.ecommerce.*.service.*Service.save(..))",
        returning = "result"
    )
    public void logSave(JoinPoint joinPoint, Object result) {
        if (result instanceof AuditableEntity entity) {
            log.info("Entity saved: type={}, id={}, createdBy={}",
                entity.getClass().getSimpleName(),
                entity.getId(),
                entity.getCreatedBy()
            );
        }
    }
}
```

### 5. Testing

```java
@DataJpaTest
class BaseEntityTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void testAuditableEntity() {
        // Given
        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("password");
        
        // When
        User saved = entityManager.persistAndFlush(user);
        
        // Then
        assertNotNull(saved.getId());
        assertNotNull(saved.getCreatedAt());
        assertEquals(0L, saved.getVersion());
    }
    
    @Test
    void testSoftDelete() {
        // Given
        Product product = new Product();
        product.setName("Test Product");
        product.setPrice(BigDecimal.valueOf(29.99));
        Product saved = entityManager.persistAndFlush(product);
        
        UUID userId = UUID.randomUUID();
        
        // When
        saved.softDelete(userId);
        entityManager.flush();
        
        // Then
        assertTrue(saved.isDeleted());
        assertNotNull(saved.getDeletedAt());
        assertEquals(userId, saved.getDeletedBy());
    }
}
```

## 📝 Notes

- Tất cả entities nên extend từ một trong các base classes
- UUID generation strategy: `GenerationType.UUID` (Java 17+)
- Timestamps luôn sử dụng `Instant` (UTC)
- Soft delete nên có index để tối ưu queries
- Version field cho optimistic locking
- Consider performance impact của auditing fields

---

**Next**: [Domain Events →](./domain-events.md)
