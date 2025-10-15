# Database Architecture Diagrams

Visual representations của database architecture và relationships trong E-Commerce platform.

## 🏗️ Overall Database Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[Next.js Frontend]
    end

    subgraph "API Gateway"
        GW[API Gateway<br/>Port 3000]
    end

    subgraph "Microservices Layer"
        US[User Service<br/>Port 3001]
        GS[Game Service<br/>Port 3002]
        OS[Order Service<br/>Port 3003]
        CS[Cart Service<br/>Port 3004]
    end

    subgraph "Database Layer"
        PG1[(PostgreSQL<br/>User DB)]
        MG1[(MongoDB<br/>Game DB)]
        PG2[(PostgreSQL<br/>Order DB)]
        RD1[(Redis<br/>Cart Cache)]
    end

    subgraph "Event Bus"
        KB[Kafka/RabbitMQ<br/>Event Stream]
    end

    FE --> GW
    GW --> US
    GW --> GS
    GW --> OS
    GW --> CS

    US --> PG1
    GS --> MG1
    OS --> PG2
    CS --> RD1

    US -.->|Publish Events| KB
    GS -.->|Publish Events| KB
    OS -.->|Publish Events| KB
    
    KB -.->|Subscribe Events| US
    KB -.->|Subscribe Events| GS
    KB -.->|Subscribe Events| OS

    style PG1 fill:#336791,color:#fff
    style PG2 fill:#336791,color:#fff
    style MG1 fill:#47A248,color:#fff
    style RD1 fill:#DC382D,color:#fff
    style KB fill:#231F20,color:#fff
```

## 📊 Game Service - MongoDB Schema

### Collection Structure

```mermaid
erDiagram
    GAMES {
        int app_id PK "Unique App ID"
        string type "game, dlc, demo"
        string name "Game name"
        int required_age "Age rating"
        boolean is_free "Free to play"
        string detailed_description "HTML description"
        string short_description "Brief summary"
        string header_image "Banner URL"
        object platforms "OS support"
        object release_date "Release info"
        object price_overview "Pricing"
        array screenshots "Game images"
        array movies "Trailers"
        array categories "Game categories"
        array genres "Game genres"
        array developers "Developer list"
        array publishers "Publisher list"
        object reviews "Review counts"
        datetime createdAt "Creation timestamp"
        datetime updatedAt "Update timestamp"
    }

    GAMES ||--o{ SCREENSHOTS : contains
    GAMES ||--o{ MOVIES : contains
    GAMES ||--o{ CATEGORIES : has
    GAMES ||--o{ GENRES : has
    GAMES ||--o{ PACKAGE_GROUPS : includes

    SCREENSHOTS {
        int id
        string path_thumbnail
        string path_full
    }

    MOVIES {
        int id
        string name
        string thumbnail
        object webm
        object mp4
        boolean highlight
    }

    CATEGORIES {
        int id
        string description
    }

    GENRES {
        string id
        string description
    }

    PACKAGE_GROUPS {
        string name
        string title
        array subs
    }
```

### Document Hierarchy

```mermaid
graph TD
    GAME[Game Document]
    
    GAME --> BASIC[Basic Info]
    GAME --> MEDIA[Media Assets]
    GAME --> META[Metadata]
    GAME --> PRICE[Pricing]
    GAME --> PLATFORM[Platform Support]
    GAME --> ENGAGE[User Engagement]

    BASIC --> B1[app_id]
    BASIC --> B2[type]
    BASIC --> B3[name]
    BASIC --> B4[required_age]
    BASIC --> B5[is_free]

    MEDIA --> M1[screenshots<br/>Array 0-157]
    MEDIA --> M2[movies<br/>Array 0-50]
    MEDIA --> M3[header_image]
    MEDIA --> M4[background]

    META --> MT1[categories<br/>Array 1-29]
    META --> MT2[genres<br/>Array 1-10]
    META --> MT3[developers<br/>Array]
    META --> MT4[publishers<br/>Array]

    PRICE --> P1[price_overview<br/>Object]
    PRICE --> P2[package_groups<br/>Array]
    PRICE --> P3[packages<br/>Array]

    PLATFORM --> PF1[platforms<br/>Object]
    PLATFORM --> PF2[pc_requirements]
    PLATFORM --> PF3[mac_requirements]
    PLATFORM --> PF4[linux_requirements]

    ENGAGE --> E1[reviews<br/>Object]
    ENGAGE --> E2[achievements<br/>Object]

    style GAME fill:#47A248,color:#fff
    style BASIC fill:#4A90E2
    style MEDIA fill:#F5A623
    style META fill:#50E3C2
    style PRICE fill:#B8E986
    style PLATFORM fill:#BD10E0
    style ENGAGE fill:#FF6B6B
```

## 🔄 Event-Driven Data Flow

### Game Price Update Flow

```mermaid
sequenceDiagram
    participant Steam as Steam API
    participant GameSvc as Game Service
    participant MongoDB as MongoDB
    participant Kafka as Event Bus
    participant OrderSvc as Order Service
    participant EmailSvc as Email Service
    participant PG as PostgreSQL

    Steam->>GameSvc: Price Update Webhook
    GameSvc->>MongoDB: Update game document
    MongoDB-->>GameSvc: Document updated
    
    GameSvc->>Kafka: Publish GAME_PRICE_CHANGED
    Note over Kafka: Event: {<br/>app_id: 220,<br/>oldPrice: 999,<br/>newPrice: 499,<br/>discount: 50%<br/>}
    
    Kafka->>OrderSvc: Subscribe event
    OrderSvc->>PG: Update cached game prices
    
    Kafka->>EmailSvc: Subscribe event
    EmailSvc->>EmailSvc: Find users with wishlist
    EmailSvc->>EmailSvc: Send price alert emails
```

### Order Creation Flow

```mermaid
sequenceDiagram
    participant User as User
    participant API as API Gateway
    participant CartSvc as Cart Service
    participant GameSvc as Game Service
    participant OrderSvc as Order Service
    participant Redis as Redis
    participant MongoDB as MongoDB
    participant PG as PostgreSQL
    participant Kafka as Event Bus

    User->>API: POST /orders/create
    API->>CartSvc: Get cart items
    CartSvc->>Redis: Fetch cart
    Redis-->>CartSvc: Cart data
    
    CartSvc->>GameSvc: Verify games & prices
    GameSvc->>MongoDB: Query games
    MongoDB-->>GameSvc: Game details
    GameSvc-->>CartSvc: Validated data
    
    CartSvc->>OrderSvc: Create order
    OrderSvc->>PG: Insert order record
    PG-->>OrderSvc: Order created
    
    OrderSvc->>Kafka: Publish ORDER_CREATED
    OrderSvc-->>API: Order response
    API-->>User: Order confirmation
    
    Kafka->>CartSvc: Subscribe event
    CartSvc->>Redis: Clear cart
```

## 📈 Data Growth & Scaling

### Collection Size Projection

```mermaid
graph LR
    subgraph "Current State"
        C1[6K Games<br/>~120 MB]
    end
    
    subgraph "6 Months"
        M6[15K Games<br/>~300 MB]
    end
    
    subgraph "1 Year"
        Y1[30K Games<br/>~600 MB]
    end
    
    subgraph "2 Years"
        Y2[50K Games<br/>~1 GB]
    end
    
    C1 --> M6 --> Y1 --> Y2
    
    Y2 -.->|Consider| SHARD[Sharding<br/>Strategy]
```

### Scaling Strategy

```mermaid
graph TB
    subgraph "Stage 1: Single Instance"
        S1[MongoDB Primary<br/>4GB RAM, 2 CPU]
    end
    
    subgraph "Stage 2: Replication"
        S2P[MongoDB Primary<br/>8GB RAM, 4 CPU]
        S2S1[Secondary 1<br/>Read Queries]
        S2S2[Secondary 2<br/>Backup]
        
        S2P --> S2S1
        S2P --> S2S2
    end
    
    subgraph "Stage 3: Sharding"
        S3R[Router<br/>mongos]
        S3C[Config Servers]
        S3SH1[Shard 1<br/>App IDs: 1-20K]
        S3SH2[Shard 2<br/>App IDs: 20K-40K]
        S3SH3[Shard 3<br/>App IDs: 40K+]
        
        S3R --> S3C
        S3R --> S3SH1
        S3R --> S3SH2
        S3R --> S3SH3
    end
    
    S1 -->|Growth| S2P
    S2P -->|Heavy Load| S3R
    
    style S1 fill:#47A248,color:#fff
    style S2P fill:#47A248,color:#fff
    style S3R fill:#47A248,color:#fff
```

## 🔍 Index Strategy

### Game Service Indexes

```mermaid
graph TB
    COLL[games Collection]
    
    COLL --> IDX1[Primary Index<br/>_id: 1]
    COLL --> IDX2[Unique Index<br/>app_id: 1]
    COLL --> IDX3[Array Index<br/>categories.id: 1]
    COLL --> IDX4[Array Index<br/>genres.id: 1]
    COLL --> IDX5[Compound Index<br/>type: 1, categories.id: 1]
    COLL --> IDX6[Compound Index<br/>type: 1, genres.id: 1]
    COLL --> IDX7[Compound Index<br/>is_free: 1, genres.id: 1]
    
    NOTE[Note: Search/Filter queries<br/>are handled by Elasticsearch]
    
    style IDX1 fill:#FF6B6B
    style IDX2 fill:#4ECDC4
    style IDX3 fill:#FFE66D
    style IDX4 fill:#95E1D3
    style IDX5 fill:#F38181
    style IDX6 fill:#AA96DA
    style IDX7 fill:#FCBAD3
    style NOTE fill:#FFA07A,color:#000
```

### Query Performance

```mermaid
graph LR
    Q1[Point Query<br/>app_id]
    Q2[Text Search<br/>name]
    Q3[Filter + Sort<br/>genre + price]
    Q4[Free Games<br/>is_free]
    
    Q1 -->|< 5ms| R1[MongoDB: Uses app_id index]
    Q2 -->|< 50ms| R2[Elasticsearch: Uses text index]
    Q3 -->|< 100ms| R3[Elasticsearch: Faceted search]
    Q4 -->|< 20ms| R4[Elasticsearch: Filter query]
    
    style Q1 fill:#4ECDC4
    style Q2 fill:#4ECDC4
    style Q3 fill:#4ECDC4
    style Q4 fill:#4ECDC4
    style R1 fill:#47A248,color:#fff
    style R2 fill:#FFD700
    style R3 fill:#FFD700
    style R4 fill:#FFD700
```

## 🔐 Security Architecture

### Database Access Control

```mermaid
graph TB
    subgraph "Application Layer"
        APP1[User Service]
        APP2[Game Service]
        APP3[Order Service]
    end
    
    subgraph "Database Security"
        subgraph "Network Security"
            VPC[VPC/Private Subnet]
            SG[Security Groups]
            FW[Firewall Rules]
        end
        
        subgraph "Authentication"
            AUTH[MongoDB Auth]
            CERT[TLS Certificates]
            ROLE[Role-Based Access]
        end
        
        subgraph "Encryption"
            TLS[TLS/SSL In-Transit]
            ENC[Encryption At-Rest]
            BACKUP[Encrypted Backups]
        end
    end
    
    subgraph "Databases"
        DB1[(MongoDB)]
        DB2[(PostgreSQL)]
        DB3[(Redis)]
    end
    
    APP1 --> VPC
    APP2 --> VPC
    APP3 --> VPC
    
    VPC --> SG
    SG --> FW
    FW --> AUTH
    AUTH --> CERT
    CERT --> ROLE
    
    ROLE --> TLS
    TLS --> ENC
    ENC --> BACKUP
    
    BACKUP --> DB1
    BACKUP --> DB2
    BACKUP --> DB3
    
    style VPC fill:#336791,color:#fff
    style AUTH fill:#47A248,color:#fff
    style TLS fill:#DC382D,color:#fff
```

## 📊 Monitoring Dashboard Layout

### Key Metrics Overview

```mermaid
graph TB
    subgraph "MongoDB Monitoring"
        M1[Operations/sec]
        M2[Query Execution Time]
        M3[Connection Pool Usage]
        M4[Replication Lag]
        M5[Disk Space]
        M6[Index Hit Rate]
    end
    
    subgraph "Alerts"
        A1{Response Time<br/>> 500ms?}
        A2{CPU > 90%?}
        A3{Disk > 90%?}
        A4{Replication Lag<br/>> 30s?}
    end
    
    M2 --> A1
    M3 --> A2
    M5 --> A3
    M4 --> A4
    
    A1 -->|Yes| ALERT[Send Alert]
    A2 -->|Yes| ALERT
    A3 -->|Yes| ALERT
    A4 -->|Yes| ALERT
    
    style M1 fill:#4ECDC4
    style M2 fill:#4ECDC4
    style M3 fill:#4ECDC4
    style M4 fill:#4ECDC4
    style M5 fill:#4ECDC4
    style M6 fill:#4ECDC4
    style ALERT fill:#FF6B6B,color:#fff
```

## 🔄 Backup & Recovery Strategy

### Backup Architecture

```mermaid
graph LR
    subgraph "Production"
        PRIMARY[(MongoDB<br/>Primary)]
        SEC1[(Secondary 1)]
        SEC2[(Secondary 2)]
        
        PRIMARY -->|Replication| SEC1
        PRIMARY -->|Replication| SEC2
    end
    
    subgraph "Backup Process"
        DAILY[Daily Backup<br/>mongodump]
        INCREMENTAL[Incremental<br/>Oplog]
        SNAPSHOT[Storage<br/>Snapshots]
    end
    
    subgraph "Storage"
        S3[S3 Bucket<br/>30 days retention]
        GLACIER[Glacier<br/>Long-term archive]
    end
    
    subgraph "Recovery"
        PITR[Point-in-Time<br/>Recovery]
        DR[Disaster<br/>Recovery]
    end
    
    SEC2 --> DAILY
    PRIMARY --> INCREMENTAL
    PRIMARY --> SNAPSHOT
    
    DAILY --> S3
    INCREMENTAL --> S3
    SNAPSHOT --> S3
    
    S3 --> GLACIER
    S3 --> PITR
    S3 --> DR
    
    style PRIMARY fill:#47A248,color:#fff
    style S3 fill:#FF9900,color:#fff
    style GLACIER fill:#0073BB,color:#fff
```

## 📈 Data Flow Diagram

### Complete User Journey

```mermaid
flowchart TD
    START([User Visits Site]) --> BROWSE[Browse Games]
    BROWSE --> SEARCH{Search/Filter?}
    
    SEARCH -->|Yes| QUERY[Query Game Service]
    SEARCH -->|No| DISPLAY[Display All Games]
    
    QUERY --> MONGO[(MongoDB<br/>Query games)]
    DISPLAY --> MONGO
    
    MONGO --> RESULTS[Show Results]
    RESULTS --> SELECT[Select Game]
    
    SELECT --> DETAIL[Get Game Details]
    DETAIL --> MONGO2[(MongoDB<br/>Get full document)]
    MONGO2 --> SHOW[Show Game Page]
    
    SHOW --> CART{Add to Cart?}
    CART -->|Yes| REDIS[(Redis<br/>Store cart)]
    CART -->|No| END1([Continue Browsing])
    
    REDIS --> CHECKOUT[Proceed to Checkout]
    CHECKOUT --> VALIDATE[Validate Cart Items]
    
    VALIDATE --> MONGO3[(MongoDB<br/>Verify games & prices)]
    MONGO3 --> CREATE[Create Order]
    
    CREATE --> PG[(PostgreSQL<br/>Store order)]
    PG --> EVENT[Publish Events]
    
    EVENT --> KAFKA[Kafka/RabbitMQ]
    KAFKA --> CLEAR[Clear Cart]
    KAFKA --> EMAIL[Send Confirmation]
    
    CLEAR --> REDIS2[(Redis<br/>Remove cart)]
    EMAIL --> END2([Order Complete])
    
    style START fill:#4ECDC4
    style MONGO fill:#47A248,color:#fff
    style MONGO2 fill:#47A248,color:#fff
    style MONGO3 fill:#47A248,color:#fff
    style REDIS fill:#DC382D,color:#fff
    style REDIS2 fill:#DC382D,color:#fff
    style PG fill:#336791,color:#fff
    style KAFKA fill:#231F20,color:#fff
    style END2 fill:#95E1D3
```

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0  
**Maintained by**: Backend Development Team
