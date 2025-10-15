# Database Documentation

Tài liệu về database schemas và data models cho các microservices trong E-Commerce platform.

## 📚 Overview

Hệ thống sử dụng **Database per Service pattern** - mỗi microservice có database riêng, đảm bảo loose coupling và independence.

## 🗄️ Database Technologies

| Service       | Database Type | Engine       | Purpose                      |
| ------------- | ------------- | ------------ | ---------------------------- |
| User Service  | SQL           | PostgreSQL   | User accounts, authentication |
| Game Service  | NoSQL         | MongoDB      | Game catalog, metadata       |
| Order Service | SQL           | PostgreSQL   | Orders, transactions         |
| Cart Service  | NoSQL         | Redis        | Shopping cart, sessions      |

## 📋 Service Schemas

### [Game Service Database](./game-service-database-schema.md) ⭐ NEW

**Database**: MongoDB  
**Collection**: `games`  
**Documents**: ~6,000+ games

**Key Features**:
-   Complete Steam game metadata
-   Screenshots & media assets
-   Multi-language support
-   Pricing & package information
-   Categories, genres, tags
-   Platform requirements
-   Reviews & recommendations

**Size Metrics**:
-   Average document: 15-20 KB
-   Total size: ~100-120 MB
-   Index size: ~10-15 MB

**Related Documentation**:
-   📊 [Database Architecture Diagrams](./database-architecture-diagrams.md) - Visual diagrams and architecture
-   🔍 [MongoDB Query Patterns](./mongodb-query-patterns.md) - Query examples and best practices
-   ⚡ [Quick Reference Guide](./game-service-quick-reference.md) - Cheat sheet for developers

### User Service Database (Coming Soon)

**Database**: PostgreSQL  
**Tables**: users, roles, permissions, sessions

### Order Service Database (Coming Soon)

**Database**: PostgreSQL  
**Tables**: orders, order_items, payments, refunds

### Cart Service (Coming Soon)

**Database**: Redis  
**Collections**: user_carts, wishlist

## 🔗 Data Relationships

### Cross-Service Communication

Services **DO NOT** have direct database connections to each other. Instead:

```
┌─────────────┐     Events      ┌─────────────┐
│   Service A │ ───────────────> │   Service B │
│  Database   │   (Kafka/AMQP)  │  Database   │
└─────────────┘                 └─────────────┘
```

**Event-Driven Architecture**:
-   Services publish domain events
-   Other services subscribe to relevant events
-   Eventually consistent data synchronization
-   No tight coupling between services

### Example Event Flow

```javascript
// Game Service publishes
{
  eventType: "GAME_PRICE_CHANGED",
  steam_appid: 220,
  newPrice: 999,
  discount: 50
}

// Order Service subscribes
// Updates cached game prices for order processing

// Email Service subscribes
// Sends price alert notifications to users
```

## 🔍 Query Patterns

### Game Service - MongoDB

**Note**: MongoDB chỉ dùng cho CRUD operations (Create, Read by ID, Update, Delete). 
Tất cả search/filter operations đều do **Search Service (Elasticsearch)** xử lý.

```javascript
// Get game by ID (Point Query) - MongoDB
db.games.findOne({ app_id: 220 })

// Get multiple games by IDs - MongoDB
db.games.find({ app_id: { $in: [220, 240, 440] } })

// Count games by type - MongoDB
db.games.countDocuments({ type: "game" })

// For advanced queries, use Search Service (Elasticsearch):
// - Full-text search on game names and descriptions
// - Filter by genres, categories, price ranges
// - Sort by popularity, ratings, release date
// - Faceted search with aggregations
```

### User Service - PostgreSQL

```sql
-- Find user with roles
SELECT u.*, r.role_name 
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'user@example.com';
```

## 📊 Data Models

### Game Service Entity Relationship

```
games (main collection)
├── Basic Info (app_id, name, type)
├── Media
│   ├── screenshots []
│   ├── movies []
│   └── images (header, capsule, background)
├── Metadata
│   ├── categories []
│   ├── genres []
│   ├── developers []
│   └── publishers []
├── Pricing
│   ├── price_overview {}
│   └── package_groups []
├── Platform Support
│   ├── platforms {}
│   ├── pc_requirements {}
│   ├── mac_requirements {}
│   └── linux_requirements {}
└── User Engagement
    ├── reviews {}
    └── achievements {}
```

## 🔒 Security & Access Control

### Database Security Layers

1. **Network Level**
   - VPC/Private subnet isolation
   - Security groups/Firewall rules
   - No public internet access

2. **Authentication**
   - Strong passwords/certificates
   - Service accounts per microservice
   - No shared credentials

3. **Authorization**
   - Least privilege principle
   - Role-based access control (RBAC)
   - Read-only replicas for analytics

4. **Encryption**
   - TLS/SSL for connections
   - Encryption at rest
   - Encrypted backups

### Connection Strings (Example)

```bash
# MongoDB - Game Service
MONGODB_URI=mongodb://game_user:${PASSWORD}@mongodb:27017/game_service_db?authSource=admin

# PostgreSQL - User Service
DATABASE_URL=postgresql://user_service:${PASSWORD}@postgres:5432/user_service_db?sslmode=require

# Redis - Cart Service
REDIS_URL=redis://:${PASSWORD}@redis:6379/0
```

## 📈 Monitoring & Metrics

### Key Performance Indicators

| Metric                    | Target       | Critical |
| ------------------------- | ------------ | -------- |
| Query Response Time       | < 100ms      | < 500ms  |
| Database CPU Usage        | < 70%        | < 90%    |
| Connection Pool Usage     | < 80%        | < 95%    |
| Replication Lag           | < 5s         | < 30s    |
| Disk Space Usage          | < 80%        | < 90%    |
| Index Hit Rate            | > 95%        | > 90%    |

### Monitoring Tools

-   **MongoDB**: MongoDB Compass, Cloud Manager
-   **PostgreSQL**: pgAdmin, pg_stat_statements
-   **Redis**: RedisInsight
-   **General**: Prometheus + Grafana

## 🔄 Backup & Recovery

### Backup Strategy

| Database   | Method           | Frequency    | Retention  |
| ---------- | ---------------- | ------------ | ---------- |
| MongoDB    | mongodump        | Daily        | 30 days    |
| PostgreSQL | pg_dump          | Daily        | 30 days    |
| Redis      | RDB + AOF        | Every 6 hrs  | 7 days     |

### Recovery Procedures

1. **Point-in-Time Recovery (PITR)**
   - PostgreSQL: WAL archiving
   - MongoDB: Oplog replay

2. **Disaster Recovery**
   - Cross-region replication
   - Automated failover
   - Recovery Time Objective (RTO): < 1 hour
   - Recovery Point Objective (RPO): < 15 minutes

## 🚀 Scaling Strategy

### Horizontal Scaling

**MongoDB (Game Service)**:
```
Primary + 2 Secondaries (Read replicas)
├── Primary: Write operations
├── Secondary 1: Read operations (analytics)
└── Secondary 2: Backup/DR
```

**PostgreSQL (User/Order Service)**:
```
Primary + Read Replicas
├── Primary: Write operations
├── Read Replica 1: API queries
└── Read Replica 2: Reports/Analytics
```

**Redis (Cart Service)**:
```
Redis Cluster or Sentinel
├── Master: Write operations
└── Slaves: Read operations
```

### Vertical Scaling

-   Start: 2 CPU, 4GB RAM
-   Medium: 4 CPU, 16GB RAM
-   Large: 8 CPU, 32GB RAM

### Sharding Strategy (Future)

**MongoDB - Game Service**:
```javascript
// Shard by steam_appid ranges
sh.shardCollection("game_service_db.games", { steam_appid: 1 })

// Shard zones by regions
sh.addShardTag("shard01", "US")
sh.addShardTag("shard02", "EU")
sh.addShardTag("shard03", "ASIA")
```

## 🛠️ Development Setup

### Local Development

```bash
# Docker Compose for local databases
docker-compose up -d mongodb postgres redis

# Initialize databases
npm run db:migrate
npm run db:seed

# Verify connections
npm run db:check
```

### Database Migrations

```bash
# PostgreSQL migrations (Flyway/Liquibase)
services/user-service/migrations/
├── V1__init_schema.sql
├── V2__add_oauth_tables.sql
└── V3__add_user_preferences.sql

# MongoDB migrations (migrate-mongo)
services/game-service/migrations/
├── 20250101_init_games_collection.js
├── 20250102_add_indexes.js
└── 20250103_add_validation.js
```

## 📚 Additional Resources

### Documentation Links

-   [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)
-   [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
-   [Redis Configuration](https://redis.io/topics/config)

### Schema Design Tools

-   [Moon Modeler](https://www.datensen.com/) - MongoDB schema design
-   [dbdiagram.io](https://dbdiagram.io/) - SQL schema design
-   [DrawSQL](https://drawsql.app/) - ERD diagrams

### Migration Tools

-   [migrate-mongo](https://github.com/seppevs/migrate-mongo) - MongoDB migrations
-   [Flyway](https://flywaydb.org/) - SQL migrations
-   [Liquibase](https://www.liquibase.org/) - Database change management

## 🤝 Contributing

Khi thêm/sửa database schema:

1. ✅ Update schema documentation
2. ✅ Create migration scripts
3. ✅ Update API documentation
4. ✅ Test migrations on staging
5. ✅ Review indexes for performance
6. ✅ Update backup procedures if needed

---

**Last Updated**: October 12, 2025  
**Maintained by**: Backend Development Team
