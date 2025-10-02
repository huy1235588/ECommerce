# Database Schemas Overview

## 📋 Tổng quan

Thư mục này chứa tài liệu thiết kế database schema cho từng microservice trong hệ thống My Digital Collection. Mỗi service có database riêng biệt theo nguyên tắc **Database-per-Service** pattern.

## 🗂️ Cấu trúc thư mục

```
schemas/
├── README.md                    # File này - tổng quan về database schemas
├── auth-service-db.md          # Auth Service database schema
├── user-service-db.md          # User Service database schema
├── game-catalog-db.md          # Game Catalog Service database schema (future)
├── order-service-db.md         # Order Service database schema (future)
├── payment-service-db.md       # Payment Service database schema (future)
├── inventory-service-db.md     # Inventory Service database schema (future)
├── notification-db.md          # Notification Service database schema (future)
├── review-service-db.md        # Review Service database schema (future)
├── achievement-db.md           # Achievement Service database schema (future)
├── social-service-db.md        # Social Service database schema (future)
└── shared-tables.md            # Shared database patterns (future)
```

## 🎯 Nguyên tắc thiết kế

### 1. Microservices Database Strategy

- **Database per Service**: Mỗi service sở hữu database riêng
- **No Cross-Service Foreign Keys**: Không có foreign key references giữa services
- **Event-Driven Communication**: Sử dụng events để đồng bộ dữ liệu giữa services
- **Data Consistency**: Eventual consistency thông qua Saga pattern

### 2. Schema Design Principles

- **Domain-Driven Design**: Schema phản ánh business domain
- **Normalization**: Balanced approach giữa normalization và performance
- **Audit Trail**: Tracking changes với created_at/updated_at
- **Soft Deletes**: Preservation data với status flags thay vì hard delete

### 3. Security & Privacy

- **Data Encryption**: Sensitive data được encrypt at rest và in transit
- **Privacy by Design**: GDPR compliance built-in
- **Access Control**: Row-level security và function-based access control
- **Audit Logging**: Comprehensive logging cho security events

## 📊 Database Technology Stack

### Primary Database: PostgreSQL 15.x

- **Strengths**: ACID compliance, mature ecosystem, JSON support
- **Use Cases**: Transactional data, user profiles, orders, payments
- **Features**: 
  - JSONB support cho flexible schemas
  - Full-text search capabilities
  - Row-level security
  - Advanced indexing (GIN, GiST)

### Caching Layer: Redis

- **Use Cases**: Session storage, rate limiting, temporary data
- **Features**:
  - In-memory performance
  - Data structure support (strings, hashes, sets, sorted sets)
  - Pub/Sub messaging
  - TTL support

### Message Queue: Apache Kafka

- **Use Cases**: Event streaming, inter-service communication
- **Features**:
  - High throughput event streaming
  - Durable message storage
  - Event sourcing capabilities
  - Distributed architecture

## 🗃️ Services Database Mapping

| Service | Database Name | Technology | Primary Use Case |
|---------|---------------|------------|------------------|
| Auth Service | `auth_service_db` | PostgreSQL | Authentication, sessions, tokens |
| User Service | `user_service_db` | PostgreSQL | User profiles, preferences, social |
| Game Catalog | `game_catalog_db` | MongoDB | Game metadata, descriptions, media |
| Order Service | `order_service_db` | PostgreSQL | Orders, shopping carts, transactions |
| Payment Service | `payment_service_db` | PostgreSQL | Payment processing, financial data |
| Inventory Service | `inventory_service_db` | PostgreSQL | Game keys, licenses, inventory |
| Notification Service | `notification_db` | PostgreSQL + Redis | Messages, templates, delivery status |
| Review Service | `review_service_db` | MongoDB | Reviews, ratings, comments |
| Achievement Service | `achievement_db` | PostgreSQL | User achievements, progress tracking |
| Social Service | `social_service_db` | PostgreSQL | Communities, groups, social features |

## 🔄 Event-Driven Architecture

### Event Types

#### User Events
- `UserCreated`: Khi user đăng ký thành công
- `UserUpdated`: Khi profile được cập nhật
- `UserDeleted`: Khi user xóa account (GDPR)

#### Auth Events
- `UserAuthenticated`: Successful login
- `TokenRefreshed`: Token được refresh
- `SecurityBreach`: Suspicious activity detected

#### Order Events
- `OrderCreated`: New order placed
- `OrderPaid`: Payment completed
- `OrderCompleted`: Order fulfilled

### Event Schema Example

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_type": "UserCreated",
  "event_version": "1.0",
  "timestamp": "2024-10-02T10:30:00Z",
  "source_service": "auth-service",
  "correlation_id": "corr-123456",
  "payload": {
    "user_id": "user-uuid",
    "email": "user@example.com",
    "username": "newuser123",
    "created_at": "2024-10-02T10:30:00Z"
  },
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "source": "web_app"
  }
}
```

## 📋 Schema Documentation Template

Mỗi service schema document tuân theo template chuẩn:

1. **Tổng quan**: Mô tả service và responsibilities
2. **Database Information**: Technical specifications
3. **Entity Relationship Diagram**: Visual representation
4. **Table Definitions**: Detailed table schemas
5. **Indexes**: Performance optimization
6. **Security Constraints**: Validation và security rules
7. **Business Rules**: Domain-specific logic
8. **Migration History**: Version tracking

## 🔍 Schema Validation & Quality

### Automated Checks

- **Schema Linting**: Validate naming conventions
- **Migration Validation**: Check migration safety
- **Performance Analysis**: Index effectiveness
- **Security Audit**: Sensitive data protection

### Manual Reviews

- **Design Reviews**: Architecture compliance
- **Security Reviews**: Data protection assessment
- **Performance Reviews**: Query optimization
- **Business Logic Reviews**: Domain rule validation

## 🚀 Migration Strategy

### Migration Principles

- **Backward Compatibility**: New migrations don't break existing code
- **Zero-Downtime**: Online schema changes when possible
- **Rollback Support**: All migrations có rollback script
- **Testing**: Thorough testing trên staging environment

### Migration Process

1. **Design**: Document proposed changes
2. **Review**: Peer review và security assessment
3. **Testing**: Validate on staging environment
4. **Deployment**: Gradual rollout với monitoring
5. **Verification**: Post-deployment validation

## 📚 Related Documentation

- [[Database Migration Guide]] - Migration procedures và best practices
- [[Event Sourcing Guide]] - Event-driven architecture patterns
- [[Security Implementation Guide]] - Database security measures
- [[Performance Optimization Guide]] - Query optimization techniques
- [[GDPR Compliance Guide]] - Data privacy implementation

## 🔗 External References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-best-practices.html)
- [Microservices Data Patterns](https://microservices.io/patterns/data/)
- [Event Sourcing Pattern](https://martinfowler.com/eaaDev/EventSourcing.html)
- [GDPR Compliance Guide](https://gdpr.eu/)

---

**Last Updated**: 2024-10-02  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team