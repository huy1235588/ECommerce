# Game Service Database Schema

## 📋 Tổng quan

Game Service quản lý dữ liệu trò chơi từ Steam platform với hệ thống NoSQL (MongoDB). **Không có foreign key references đến services khác** - sử dụng Event-Driven Architecture để communication.

Service này quản lý:

-   Thông tin chi tiết về games (metadata, mô tả, giá cả)
-   Screenshots và media assets (hình ảnh, video)
-   Thông tin về categories và genres
-   Thông tin về platforms (Windows, Mac, Linux)
-   Requirements hệ thống cho mỗi platform
-   Thông tin về packages và pricing
-   Achievements và recommendations
-   Multi-language support

## 🗃️ Database Information

| Property              | Value                 |
| --------------------- | --------------------- |
| Database Name         | `game_service_db`     |
| Schema Version        | 1.0.0                 |
| Engine                | MongoDB 7.x           |
| Charset               | UTF8                  |
| Collation             | utf8_unicode_ci       |
| **Event Integration** | ✅ Kafka/RabbitMQ     |
| **Security Level**    | High                  |
| **Total Documents**   | ~6,064 games analyzed |

## 📊 Data Statistics

### Coverage Analysis

| Category              | Count      | Percentage |
| --------------------- | ---------- | ---------- |
| **Required Fields**   | 75 fields  | >90%       |
| **Optional Fields**   | 49 fields  | 30-90%     |
| **Rare Fields**       | 542 fields | <30%       |
| **Total Unique Keys** | 666 fields | -          |

### Field Type Distribution

-   **Strings**: 40% (mô tả, tên, URL)
-   **Arrays**: 25% (screenshots, categories, genres)
-   **Objects**: 20% (nested structures)
-   **Integers**: 10% (IDs, counts, prices)
-   **Booleans**: 5% (flags, status)

## 📋 Collection: `games`

Main collection lưu trữ toàn bộ thông tin về games.

### Schema Structure

```javascript
{
  // Core Information (100% required)
  app_id: Number,                 // Unique App ID
  type: String,                  // game, dlc, demo, etc. (6 types)
  name: String,                  // Game name
  required_age: Number,          // Age restriction (12 values)
  is_free: Boolean,              // Free to play status
  
  // Descriptions (100% required)
  detailed_description: String,  // HTML formatted (~3.6KB avg)
  about_the_game: String,        // Game overview (~3.4KB avg)
  short_description: String,     // Brief summary (~216 bytes avg)
  
  // Media Assets (100% required)
  header_image: String,          // Header banner URL
  capsule_image: String,         // Capsule image URL
  capsule_imagev5: String,       // Capsule image v5 URL
  background: String,            // Background image URL
  background_raw: String,        // Raw background image URL
  
  // Optional but highly recommended
  website: String,               // Official website (nullable)
  
  // Arrays - Screenshots (98.2% coverage)
  screenshots: [{
    id: Number,                  // Screenshot ID
    path_thumbnail: String,      // Thumbnail URL (~145 bytes)
    path_full: String           // Full size URL (~147 bytes)
  }],                            // Avg: 11.5 items, Max: 157 items
  
  // Arrays - Movies/Trailers (93.1% coverage)
  movies: [{
    id: Number,                  // Movie ID
    name: String,                // Movie name (~25 bytes)
    thumbnail: String,           // Thumbnail URL (~113 bytes)
    webm: {
      480: String,               // 480p WebM URL
      max: String                // Max quality WebM URL
    },
    mp4: {
      480: String,               // 480p MP4 URL
      max: String                // Max quality MP4 URL
    },
    highlight: Boolean,          // Featured video flag
    dash_av1: String,            // DASH AV1 stream URL
    dash_h264: String,           // DASH H264 stream URL
    hls_h264: String            // HLS H264 stream URL
  }],                            // Avg: 2.5 items
  
  // Arrays - Categories (97.6% coverage)
  categories: [{
    id: Number,                  // Category ID (62 unique)
    description: String          // Category name (~15 bytes)
  }],                            // Avg: 7.2 items, Max: 29 items
  
  // Arrays - Genres (97.1% coverage)
  genres: [{
    id: String,                  // Genre ID (28 unique)
    description: String          // Genre name (~8 bytes)
  }],                            // Avg: 2.9 items
  
  // Arrays - Developers (97.8% coverage)
  developers: [String],          // Developer names (avg: 1.1 items)
  
  // Arrays - Publishers (97.5% coverage)
  publishers: [String],          // Publisher names (avg: 1.1 items)
  
  // Platform Requirements (100% required)
  pc_requirements: {
    minimum: String,             // Min PC requirements (97.9% has data)
    recommended: String          // Recommended PC requirements (74.8%)
  },
  mac_requirements: {
    minimum: String,             // Min Mac requirements (61.7%)
    recommended: String          // Recommended Mac requirements
  },
  linux_requirements: {
    minimum: String,             // Min Linux requirements (54.6%)
    recommended: String          // Recommended Linux requirements
  },
  
  // Platform Support (100% required)
  platforms: {
    windows: Boolean,            // Windows support
    mac: Boolean,                // macOS support
    linux: Boolean              // Linux support
  },
  
  // Release Information (100% required)
  release_date: {
    coming_soon: Boolean,        // Pre-release status
    date: String                 // Release date (3,053 unique dates)
  },
  
  // Pricing (77.3% coverage)
  packages: [Number],            // Package IDs
  
  // Price Overview (72.8% coverage)
  price_overview: {
    currency: String,            // Currency code (USD, EUR, etc.)
    initial: Number,             // Initial price in cents
    final: Number,               // Final price after discount
    discount_percent: Number,    // Discount percentage
    initial_formatted: String,   // Formatted initial price
    final_formatted: String      // Formatted final price
  },
  
  // Package Groups (100% required, 77.6% has data)
  package_groups: [{
    name: String,                // Group name (20 unique)
    title: String,               // Display title (~24 bytes)
    description: String,         // Group description (~1 byte)
    selection_text: String,      // Selection text (~24 bytes)
    save_text: String,           // Savings text (~0 bytes)
    display_type: Number,        // Display type (3 unique)
    is_recurring_subscription: String,  // Subscription flag
    subs: [{
      packageid: Number,         // Package ID (6,129 unique)
      percent_savings_text: String,  // Savings text (~1 byte)
      percent_savings: Number,   // Savings percentage (18 unique)
      option_text: String,       // Option text (~42 bytes)
      option_description: String,// Option description (~2 bytes)
      can_get_free_license: String,  // Free license flag
      is_free_license: Boolean,  // Free license status
      price_in_cents_with_discount: Number  // Discounted price
    }]
  }],                            // Avg: 0.8 items
  
  // Achievements (73.7% coverage)
  achievements: {
    total: Number,               // Total achievement count (276 unique)
    highlighted: [{
      name: String,              // Achievement name (~15 bytes)
      path: String               // Achievement icon URL (~120 bytes)
    }]                           // Avg: 9.75 items, Max: 10 items
  },

  // Reviews (100% required)
  reviews: {
    positive: Number,            // Positive review count (4,149 unique)
    negative: Number             // Negative review count (2,585 unique)
  },
  
  // Language Support (100% required)
  languages: String,             // Supported languages HTML
  supported_languages: String,   // 97.8% coverage (3,617 unique)
  
  // Content Descriptors (100% required)
  content_descriptors: {
    ids: [Number],               // Content descriptor IDs (0-5 items)
    notes: String                // Additional notes (nullable)
  },
  
  // Support Information (100% required)
  support_info: {
    url: String,                 // Support URL (2,595 unique)
    email: String                // Support email (2,685 unique)
  },
  
  // Tags/Metadata (100% required)
  tags: Object,                  // Game tags (~270 bytes, 441 keys)
  
  // Metacritic (optional)
  metacritic: {
    score: Number,               // Metacritic score
    url: String                  // Metacritic URL
  },
  
  // DLC Information (optional)
  dlc: [Number],                 // DLC App IDs (avg: 9.7, max: 3632)
  
  // Timestamps
  createdAt: Date,               // Document creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

## 🔍 Indexes

### Primary Indexes

```javascript
// Unique identifier
db.games.createIndex({ app_id: 1 }, { unique: true })

// Auto-created by MongoDB
db.games.createIndex({ _id: 1 })

// Array field indexes for filtering and listing
db.games.createIndex({ "categories.id": 1 })
db.games.createIndex({ "genres.id": 1 })
db.games.createIndex({ type: 1, "categories.id": 1 })
db.games.createIndex({ type: 1, "genres.id": 1 })
db.games.createIndex({ is_free: 1, "genres.id": 1 })

// Price and platform filtering
db.games.createIndex({ "price_overview.final": 1 })
db.games.createIndex({ "platforms.windows": 1, "platforms.mac": 1, "platforms.linux": 1 })

## 🔒 Validation Schema

MongoDB Schema Validation:

```javascript
db.createCollection("games", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "app_id", 
        "type", 
        "name", 
        "is_free",
        "detailed_description",
        "about_the_game",
        "short_description",
        "platforms",
        "release_date"
      ],
      properties: {
        app_id: {
          bsonType: "int",
          description: "App ID - required and must be a positive integer"
        },
        type: {
          enum: ["game", "dlc", "demo", "advertising", "mod", "video"],
          description: "Game type - must be one of the enum values"
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 500,
          description: "Game name - required string"
        },
        required_age: {
          bsonType: ["int", "string"],
          description: "Required age rating"
        },
        is_free: {
          bsonType: "bool",
          description: "Free to play status - required boolean"
        },
        platforms: {
          bsonType: "object",
          required: ["windows", "mac", "linux"],
          properties: {
            windows: { bsonType: "bool" },
            mac: { bsonType: "bool" },
            linux: { bsonType: "bool" }
          }
        },
        release_date: {
          bsonType: "object",
          required: ["coming_soon", "date"],
          properties: {
            coming_soon: { bsonType: "bool" },
            date: { bsonType: "string" }
          }
        },
        price_overview: {
          bsonType: "object",
          properties: {
            currency: { bsonType: "string" },
            initial: { bsonType: "int", minimum: 0 },
            final: { bsonType: "int", minimum: 0 },
            discount_percent: { 
              bsonType: "int", 
              minimum: 0, 
              maximum: 100 
            }
          }
        }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
})
```

## 🚨 Business Rules

### Data Management

1. **Game Uniqueness**

    - Mỗi game phải có `app_id` duy nhất
    - Không cho phép duplicate `app_id`
    - `name` nên unique nhưng không enforce (có thể có special editions)

2. **Required Fields**

    - Các fields core (app_id, type, name, is_free) luôn bắt buộc
    - Platform information phải có ít nhất 1 platform = true
    - Release date information là bắt buộc

3. **Data Integrity**
    - Screenshots array không vượt quá 200 items
    - DLC array không vượt quá 5000 items (optimization)
    - Achievements highlighted không vượt quá 10 items

### Pricing Rules

1. **Price Validation**

    - `initial` >= `final` (discount validation)
    - `discount_percent` phải match với (initial - final) / initial \* 100
    - Free games (`is_free: true`) không có `price_overview`

2. **Currency**
    - Currency code phải theo ISO 4217
    - Prices luôn stored in cents (integer)

### Media Assets

1. **URL Validation**

    - All image URLs phải là valid HTTPS URLs
    - URLs nên point to Steam CDN (shared.akamai.steamstatic.com)

2. **Array Size Limits**
    - Screenshots: recommend pagination if > 50 items
    - Movies: recommend pagination if > 10 items
    - DLC: recommend separate collection if > 100 items

### Content

1. **Age Rating**

    - `required_age` phải match với rating systems
    - Nếu có explicit content, phải có content_descriptors

2. **Multi-language Support**
    - `supported_languages` should list all available languages
    - Format: "Language<strong>\*</strong>" for full audio support

## 🎯 Optimization Recommendations

### Query Patterns

**Most Common Queries:**

1. Get game by app_id (point query)
2. Filter by genre + sort by popularity
3. Filter free games
4. Filter by platform + price range
5. Get game details with related data

### Denormalization Strategy

**Keep Embedded** (Current Structure):

-   Screenshots - frequently accessed with game
-   Categories/Genres - small arrays, queried together
-   Platform requirements - always shown with game
-   Reviews summary - small, always displayed

**Consider Separating** (Future optimization):

-   `dlc` array (if > 100 items) → separate `game_dlcs` collection
-   `tags` object (441 keys) → separate `game_tags` collection for faceted search
-   Large `detailed_description` → consider compression or separate collection

### Performance Tips

1. **Large Fields**

    ```javascript
    // Project only needed fields
    db.games.find(
      { app_id: 220 },
      { name: 1, short_description: 1, price_overview: 1 }
    )
    ```

2. **Pagination for Arrays**

    ```javascript
    // Use $slice for large arrays
    db.games.find(
      { app_id: 220 },
      { screenshots: { $slice: [0, 10] } }
    )
    ```

3. **Aggregation for Statistics**
    ```javascript
    // Get average price by genre
    db.games.aggregate([
      { $match: { "price_overview": { $exists: true } } },
      { $unwind: "$genres" },
      { $group: {
        _id: "$genres.description",
        avgPrice: { $avg: "$price_overview.final" }
      }}
    ])
    ```

## 🔐 Security Features

### Access Control

```javascript
// Read-only role for public API
db.createRole({
  role: "gameReader",
  privileges: [{
    resource: { db: "game_service_db", collection: "games" },
    actions: ["find", "collStats"]
  }],
  roles: []
})

// Write role for admin/sync operations
db.createRole({
  role: "gameWriter",
  privileges: [{
    resource: { db: "game_service_db", collection: "games" },
    actions: ["find", "insert", "update", "remove"]
  }],
  roles: []
})
```

### Data Privacy

-   No personal user data stored in this collection
-   Public information only (from Steam API)
-   Support emails masked in public API responses

## 📚 Related Collections (Future)

### Lookup Collections for Listing

Để hỗ trợ việc **liệt kê categories, genres, languages** một cách hiệu quả:

```javascript
// categories - Danh sách tất cả categories
{
  _id: Number,                    // Category ID
  name: String,                   // Category name
  description: String,            // Chi tiết về category
  icon_url: String,               // Icon URL (optional)
  game_count: Number,             // Số lượng games (cached)
  display_order: Number,          // Thứ tự hiển thị
  is_active: Boolean,             // Status
  createdAt: Date,
  updatedAt: Date
}
// Indexes:
db.categories.createIndex({ _id: 1 }, { unique: true })
db.categories.createIndex({ display_order: 1, is_active: 1 })

// genres - Danh sách tất cả genres
{
  _id: String,                    // Genre ID
  name: String,                   // Genre name
  description: String,            // Chi tiết về genre
  slug: String,                   // URL-friendly name
  icon_url: String,               // Icon URL (optional)
  game_count: Number,             // Số lượng games (cached)
  display_order: Number,          // Thứ tự hiển thị
  is_popular: Boolean,            // Popular genre flag
  is_active: Boolean,             // Status
  createdAt: Date,
  updatedAt: Date
}
// Indexes:
db.genres.createIndex({ _id: 1 }, { unique: true })
db.genres.createIndex({ slug: 1 }, { unique: true })
db.genres.createIndex({ is_popular: 1, display_order: 1 })

// languages - Danh sách tất cả languages
{
  _id: ObjectId,
  code: String,                   // Language code (en, vi, ja, etc.)
  name: String,                   // Language name (English, Vietnamese, etc.)
  native_name: String,            // Native name (English, Tiếng Việt, 日本語)
  game_count: Number,             // Số games hỗ trợ (cached)
  interface_support: Number,      // Số games hỗ trợ interface
  audio_support: Number,          // Số games hỗ trợ audio
  subtitles_support: Number,      // Số games hỗ trợ subtitles
  display_order: Number,          // Thứ tự hiển thị
  is_active: Boolean,             // Status
  createdAt: Date,
  updatedAt: Date
}
// Indexes:
db.languages.createIndex({ code: 1 }, { unique: true })
db.languages.createIndex({ display_order: 1, is_active: 1 })
```

### Aggregation Queries cho Listing

**1. Liệt kê tất cả Categories với số lượng games:**

```javascript
db.games.aggregate([
  { $match: { type: "game" } },
  { $unwind: "$categories" },
  { $group: {
    _id: "$categories.id",
    name: { $first: "$categories.description" },
    game_count: { $sum: 1 }
  }},
  { $sort: { game_count: -1 } }
])
```

**2. Liệt kê tất cả Genres với thống kê:**

```javascript
db.games.aggregate([
  { $match: { type: "game" } },
  { $unwind: "$genres" },
  { $group: {
    _id: "$genres.id",
    name: { $first: "$genres.description" },
    game_count: { $sum: 1 },
    avg_price: { $avg: "$price_overview.final" },
    free_games: { 
      $sum: { $cond: ["$is_free", 1, 0] } 
    }
  }},
  { $sort: { game_count: -1 } },
  { $limit: 50 }
])
```

**3. Phân tích Language Support:**

```javascript
// Parse supported_languages và đếm
db.games.aggregate([
  { $match: { 
    supported_languages: { $exists: true, $ne: null } 
  }},
  { $project: {
    app_id: 1,
    name: 1,
    // Extract language codes from HTML string
    languages_text: "$supported_languages"
  }},
  // Note: Cần xử lý parsing ở application level
  // hoặc lưu array languages riêng trong schema
])
```

**4. Filter games theo multiple criteria:**

```javascript
// Tìm games theo genre + category + language
db.games.find({
  "genres.id": "1",              // Action
  "categories.id": 2,            // Single-player
  supported_languages: /English/, // Hỗ trợ tiếng Anh
  is_free: false,
  "price_overview.final": { $lte: 2000 } // <= $20
}).sort({ "recommendations.total": -1 })
  .limit(20)
```

**5. Cập nhật cached counts (định kỳ):**

```javascript
// Update category game counts
const categories = await db.games.aggregate([
  { $unwind: "$categories" },
  { $group: { _id: "$categories.id", count: { $sum: 1 } }}
])

categories.forEach(cat => {
  db.categories.updateOne(
    { _id: cat._id },
    { $set: { game_count: cat.count, updatedAt: new Date() } },
    { upsert: true }
  )
})
```

### Potential Normalized Collections

```javascript
// game_tags - For advanced filtering
{
  _id: ObjectId,
  app_id: Number,
  tags: [{
    name: String,
    count: Number
  }]
}

// game_prices_history - Track price changes
{
  _id: ObjectId,
  app_id: Number,
  timestamp: Date,
  price: Number,
  discount: Number,
  currency: String
}

// game_reviews_detail - Extended reviews
{
  _id: ObjectId,
  app_id: Number,
  user_id: String,
  score: Number,
  text: String,
  helpful_count: Number,
  timestamp: Date
}
```

## 🔄 Event Integration

### Published Events

```javascript
// Game created
{
  eventType: "GAME_CREATED",
  aggregateId: app_id,
  timestamp: Date,
  payload: { /* game data */ }
}

// Game updated
{
  eventType: "GAME_UPDATED",
  aggregateId: app_id,
  timestamp: Date,
  payload: { 
    changes: { /* changed fields */ },
    previous: { /* old values */ }
  }
}

// Price changed
{
  eventType: "GAME_PRICE_CHANGED",
  aggregateId: app_id,
  timestamp: Date,
  payload: {
    oldPrice: Number,
    newPrice: Number,
    discount: Number
  }
}
```

### Consumed Events

-   None (standalone service, data from Steam API)

## 📈 Monitoring & Maintenance

### Key Metrics

1. **Storage Metrics**

    - Average document size: ~15-20 KB
    - Total collection size: ~100-120 MB (for 6K games)
    - Index size: ~10-15 MB

2. **Query Performance**

    - Point queries (by app_id): < 5ms
    - Filter queries: < 20ms
    - Complex aggregations: < 200ms

3. **Update Frequency**
    - Full sync: Daily (Steam API updates)
    - Price updates: Every 6 hours
    - New games: Real-time via webhook

### Maintenance Tasks

```javascript
// Regular index maintenance
db.games.reIndex()

// Analyze query performance
db.games.explain("executionStats").find({ type: "game" })

// Check storage stats
db.games.stats()

// Find games with missing required fields
db.games.find({
  $or: [
    { screenshots: { $exists: false } },
    { "screenshots.0": { $exists: false } }
  ]
})
```

## 🚀 Migration & Deployment

### Initial Data Import

```bash
# Import from JSON files
mongoimport --db game_service_db --collection games --file games_data.json --jsonArray

# Create indexes after import
mongo game_service_db < create_indexes.js
```

### Schema Migration Script

```javascript
// migrations/v1.0.0_init.js
db.games.createIndex({ app_id: 1 }, { unique: true })
// Note: Text search indexes moved to Search Service (Elasticsearch)
// ... other indexes
```

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0  
**Schema Analysis**: Based on 6,064 Steam games  
**Data Source**: Steam Store API  
**Maintained by**: Backend Development Team

## 📚 Related Documentation

-   [[Game Service API Documentation]] - API endpoints và usage
-   [[Steam API Integration Guide]] - Steam API integration details
-   [[Game Service Architecture]] - Service architecture overview
-   [[MongoDB Best Practices]] - MongoDB optimization tips
-   [[Event-Driven Architecture Guide]] - Event integration patterns
-   [[Search Service Database Schema]] - Elasticsearch search indexing schema

## 📊 Additional Analysis Files

Các file phân tích chi tiết trong `python/analysis_results/`:

-   `all_fields.txt` - Danh sách tất cả fields
-   `array_fields_analysis.txt` - Phân tích các array fields
-   `field_levels.txt` - Hierarchy của fields
-   `field_samples.json` - Sample data cho mỗi field
-   `field_statistics.csv` - Thống kê chi tiết
-   `nested_objects_analysis.txt` - Phân tích nested objects
-   `nosql_schema_suggestions.md` - Đề xuất schema optimization
