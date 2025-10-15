# MongoDB Data Access & Elasticsearch Integration

Hướng dẫn chi tiết về cách truy xuất dữ liệu cho Game Service với MongoDB và Elasticsearch.

## 📚 Table of Contents

- [Data Access Strategy](#data-access-strategy)
- [MongoDB Operations](#mongodb-operations)
- [Elasticsearch Search Service](#elasticsearch-search-service)
- [Performance Optimization](#performance-optimization)
- [Common Patterns](#common-patterns)
- [Anti-Patterns](#anti-patterns)
- [Best Practices](#best-practices)

## 🎯 Data Access Strategy

### Phân chia trách nhiệm

Game Service sử dụng **hybrid approach** để tối ưu performance:

1. **MongoDB**: Làm primary database cho:
   - CRUD operations (Create, Read by ID, Update, Delete)
   - Point queries (get by app_id)
   - Transactional data
   - Data integrity

2. **Elasticsearch**: Làm search engine cho:
   - Full-text search
   - Advanced filtering
   - Faceted search (categories, genres, tags)
   - Aggregations và analytics
   - Auto-complete và suggestions

### Khi nào dùng MongoDB vs Elasticsearch?

| Use Case | Use | Reason |
|----------|-----|--------|
| Get game by ID | MongoDB | Fastest point query |
| Search games by name | **Elasticsearch** | Better text search |
| Filter by genre/category | **Elasticsearch** | Faceted search |
| Price range queries | **Elasticsearch** | Complex filters |
| Get game details | MongoDB | Source of truth |
| Update game info | MongoDB | Data consistency |
| Analytics/reporting | **Elasticsearch** | Aggregations |

## 🔍 Basic Queries

## 🔍 MongoDB Operations

### 1. Get Game by App ID (Point Query)

```javascript
// Fastest operation - uses unique index
db.games.findOne({ app_id: 220 })

// With projection (only return needed fields)
db.games.findOne(
  { app_id: 220 },
  { 
    name: 1, 
    short_description: 1, 
    price_overview: 1,
    header_image: 1,
    _id: 0 
  }
)
```

**Performance**: < 5ms (index scan)
**Use Case**: Get complete game details, Update operations

### 2. Get Multiple Games by IDs

```javascript
// Bulk fetch by IDs
db.games.find({ 
  app_id: { $in: [220, 240, 440, 570] } 
})

// Efficient batch operations
db.games.find({ 
  app_id: { $in: appIds } 
}).project({ 
  name: 1, 
  header_image: 1, 
  price_overview: 1 
})
```

**Performance**: < 10ms for 10-20 games
**Use Case**: Cart items, Wishlist, Recommendations

### 3. Basic Filtering (Simple Operations)

```javascript
// Get all games (not DLC, demos, etc.)
db.games.find({ type: "game" })

// Count by type
db.games.countDocuments({ type: "game" })

// Get free games
db.games.find({ is_free: true })

// Platform specific
db.games.find({ "platforms.windows": true })
```

**Note**: ⚠️ Các query phức tạp nên sử dụng **Elasticsearch** thay vì MongoDB.

## 🔎 Elasticsearch Search Service

### Overview

Elasticsearch được sử dụng cho tất cả các search và filter operations phức tạp. Game data được sync từ MongoDB sang Elasticsearch thông qua:

1. **Initial Bulk Indexing**: Import toàn bộ data khi khởi tạo
2. **Real-time Sync**: Sử dụng Change Streams hoặc Event-Driven để sync changes
3. **Scheduled Re-indexing**: Sync lại định kỳ để đảm bảo consistency

### 1. Full-Text Search

```javascript
// Search games by name and description
POST /games/_search
{
  "query": {
    "multi_match": {
      "query": "half life",
      "fields": ["name^3", "short_description", "detailed_description"],
      "type": "best_fields",
      "fuzziness": "AUTO"
    }
  },
  "size": 10,
  "highlight": {
    "fields": {
      "name": {},
      "short_description": {}
    }
  }
}
```

**Performance**: < 20ms
**Features**: 
- Fuzzy matching (typo tolerance)
- Field boosting (name có weight cao hơn)
- Highlighting kết quả
- Relevance scoring

### 2. Advanced Filtering

```javascript
// Filter by multiple criteria
POST /games/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "type": "game" } }
      ],
      "filter": [
        { "terms": { "genres.description.keyword": ["Action", "Adventure"] } },
        { "term": { "platforms.windows": true } },
        { "range": { "price_overview.final": { "lte": 2000 } } },
        { "range": { "reviews.positive": { "gte": 1000 } } }
      ]
    }
  },
  "sort": [
    { "recommendations.total": { "order": "desc" } }
  ],
  "size": 20
}
```

**Performance**: < 30ms
**Use Cases**: Product listing page với filters

### 3. Faceted Search (Aggregations)

```javascript
// Get aggregations for filters
POST /games/_search
{
  "size": 0,
  "aggs": {
    "genres": {
      "terms": { "field": "genres.description.keyword", "size": 20 }
    },
    "categories": {
      "terms": { "field": "categories.description.keyword", "size": 30 }
    },
    "platforms": {
      "filters": {
        "filters": {
          "windows": { "term": { "platforms.windows": true } },
          "mac": { "term": { "platforms.mac": true } },
          "linux": { "term": { "platforms.linux": true } }
        }
      }
    },
    "price_ranges": {
      "range": {
        "field": "price_overview.final",
        "ranges": [
          { "key": "free", "to": 1 },
          { "key": "under_10", "from": 1, "to": 1000 },
          { "key": "10_to_20", "from": 1000, "to": 2000 },
          { "key": "20_to_50", "from": 2000, "to": 5000 },
          { "key": "over_50", "from": 5000 }
        ]
      }
    }
  }
}
```

**Performance**: < 50ms
**Features**: Real-time filter counts

### 4. Auto-Complete / Suggestions

```javascript
// Auto-complete search
POST /games/_search
{
  "suggest": {
    "game-suggestion": {
      "prefix": "hal",
      "completion": {
        "field": "name.suggest",
        "size": 5,
        "fuzzy": {
          "fuzziness": 2
        }
      }
    }
  }
}

// Alternative: Search as you type
POST /games/_search
{
  "query": {
    "match_phrase_prefix": {
      "name": {
        "query": "half li"
      }
    }
  },
  "size": 5
}
```

**Performance**: < 10ms
**Use Case**: Search box suggestions

### 5. Complex Queries

```javascript
// Find similar games (More Like This)
POST /games/_search
{
  "query": {
    "more_like_this": {
      "fields": ["name", "short_description", "genres.description", "categories.description"],
      "like": [
        {
          "_index": "games",
          "_id": "220"
        }
      ],
      "min_term_freq": 1,
      "max_query_terms": 12
    }
  },
  "size": 10
}

// Boost by popularity and rating
POST /games/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "action shooter",
          "fields": ["name^3", "short_description"]
        }
      },
      "functions": [
        {
          "field_value_factor": {
            "field": "recommendations.total",
            "factor": 0.1,
            "modifier": "log1p"
          }
        },
        {
          "script_score": {
            "script": {
              "source": "doc['reviews.positive'].value / (doc['reviews.positive'].value + doc['reviews.negative'].value + 1)"
            }
          },
          "weight": 2
        }
      ],
      "score_mode": "sum",
      "boost_mode": "multiply"
    }
  }
}
```

### 6. Price and Date Range Queries

```javascript
// Games on sale
POST /games/_search
{
  "query": {
    "bool": {
      "filter": [
        { "range": { "price_overview.discount_percent": { "gt": 0 } } }
      ]
    }
  },
  "sort": [
    { "price_overview.discount_percent": { "order": "desc" } }
  ]
}

// Recently released games
POST /games/_search
{
  "query": {
    "bool": {
      "filter": [
        { "range": { "release_date.date": { "gte": "2024-01-01" } } },
        { "term": { "release_date.coming_soon": false } }
      ]
    }
  },
  "sort": [
    { "release_date.date": { "order": "desc" } }
  ]
}
```

### Elasticsearch Index Mapping

```javascript
PUT /games
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "game_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "game_stop"]
        }
      },
      "filter": {
        "game_stop": {
          "type": "stop",
          "stopwords": ["the", "a", "an"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "steam_appid": { "type": "integer" },
      "name": {
        "type": "text",
        "analyzer": "game_analyzer",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { 
            "type": "completion",
            "analyzer": "simple"
          }
        }
      },
      "type": { "type": "keyword" },
      "is_free": { "type": "boolean" },
      "short_description": { 
        "type": "text",
        "analyzer": "game_analyzer"
      },
      "detailed_description": { 
        "type": "text",
        "analyzer": "game_analyzer"
      },
      "header_image": { "type": "keyword", "index": false },
      "genres": {
        "properties": {
          "id": { "type": "integer" },
          "description": { 
            "type": "text",
            "fields": {
              "keyword": { "type": "keyword" }
            }
          }
        }
      },
      "categories": {
        "properties": {
          "id": { "type": "integer" },
          "description": { 
            "type": "text",
            "fields": {
              "keyword": { "type": "keyword" }
            }
          }
        }
      },
      "platforms": {
        "properties": {
          "windows": { "type": "boolean" },
          "mac": { "type": "boolean" },
          "linux": { "type": "boolean" }
        }
      },
      "price_overview": {
        "properties": {
          "currency": { "type": "keyword" },
          "initial": { "type": "integer" },
          "final": { "type": "integer" },
          "discount_percent": { "type": "integer" },
          "initial_formatted": { "type": "keyword", "index": false },
          "final_formatted": { "type": "keyword", "index": false }
        }
      },
      "recommendations": {
        "properties": {
          "total": { "type": "integer" }
        }
      },
      "reviews": {
        "properties": {
          "positive": { "type": "integer" },
          "negative": { "type": "integer" }
        }
      },
      "release_date": {
        "properties": {
          "coming_soon": { "type": "boolean" },
          "date": { "type": "date", "format": "yyyy-MM-dd||epoch_millis" }
        }
      },
      "developers": { 
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "publishers": { 
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      }
    }
  }
}
```

## 📊 Data Synchronization Strategy

### 1. Change Streams (Real-time Sync)

```javascript
// MongoDB Change Streams để sync sang Elasticsearch
const changeStream = db.collection('games').watch();

changeStream.on('change', async (change) => {
  switch (change.operationType) {
    case 'insert':
      await elasticsearchClient.index({
        index: 'games',
        id: change.fullDocument.app_id.toString(),
        document: transformToESFormat(change.fullDocument)
      });
      break;
    
    case 'update':
      await elasticsearchClient.update({
        index: 'games',
        id: change.documentKey._id.toString(),
        doc: transformToESFormat(change.updateDescription.updatedFields)
      });
      break;
    
    case 'delete':
      await elasticsearchClient.delete({
        index: 'games',
        id: change.documentKey._id.toString()
      });
      break;
  }
});
```

### 2. Bulk Re-indexing

```javascript
// Scheduled job để re-index toàn bộ
async function reindexAllGames() {
  const cursor = db.collection('games').find({}).batchSize(1000);
  
  const operations = [];
  for await (const game of cursor) {
    operations.push({ index: { _index: 'games', _id: game.app_id.toString() } });
    operations.push(transformToESFormat(game));
    
    if (operations.length >= 2000) {
      await elasticsearchClient.bulk({ operations });
      operations.length = 0;
    }
  }
  
  if (operations.length > 0) {
    await elasticsearchClient.bulk({ operations });
  }
}
```
    _id: "$developers",
    gameCount: { $sum: 1 },
    avgPrice: { $avg: "$price_overview.final" },
    totalRecommendations: { $sum: "$recommendations.total" },
    games: { $push: {
      name: "$name",
      steam_appid: "$steam_appid",
      reviews: "$reviews"
    }}
  }},
  
  // Filter developers with multiple games
  { $match: { gameCount: { $gte: 3 } }},
  
  // Sort by game count
  { $sort: { gameCount: -1 }},
  
  // Limit results
  { $limit: 20 }
])
```

### 4. Monthly Release Statistics

```javascript
db.games.aggregate([
  // Extract month from release date
  { $addFields: {
    releaseMonth: { 
      $substr: ["$release_date.date", 0, 7] // "YYYY-MM"
    }
  }},
  
  // Group by month
  { $group: {
    _id: "$releaseMonth",
    count: { $sum: 1 },
    freeGames: { 
      $sum: { $cond: ["$is_free", 1, 0] }
    },
    paidGames: { 
      $sum: { $cond: ["$is_free", 0, 1] }
    }
  }},
  
  // Sort by month
  { $sort: { _id: -1 }},
  
  // Limit to last 12 months
  { $limit: 12 }
])
```

### 5. Category Popularity Analysis

```javascript
db.games.aggregate([
  // Unwind categories
  { $unwind: "$categories" },
  
  // Group by category
  { $group: {
    _id: {
      id: "$categories.id",
      description: "$categories.description"
    },
    gameCount: { $sum: 1 },
    totalRecommendations: { 
      $sum: "$recommendations.total" 
    },
    avgPositiveReviews: { 
      $avg: "$reviews.positive" 
    }
  }},
  
  // Calculate average recommendations per game
  { $addFields: {
    avgRecommendationsPerGame: { 
      $divide: ["$totalRecommendations", "$gameCount"] 
    }
  }},
  
  // Sort by popularity
  { $sort: { avgRecommendationsPerGame: -1 }},
  
  // Project readable format
  { $project: {
    category: "$_id.description",
    gameCount: 1,
    avgRecommendationsPerGame: { 
      $round: ["$avgRecommendationsPerGame", 2] 
    },
    avgPositiveReviews: { 
      $round: ["$avgPositiveReviews", 0] 
    },
    _id: 0
  }}
])
```

## ⚡ Performance Optimization

### 1. Use Projection (MongoDB)

```javascript
// ❌ Bad - Returns entire document (~20KB)
db.games.findOne({ app_id: 220 })

// ✅ Good - Returns only needed fields
db.games.findOne(
  { app_id: 220 },
  { name: 1, short_description: 1, price_overview: 1, _id: 0 }
)
```

**Benefit**: Reduces network transfer and memory usage by 90%+

### 2. Index Strategy

**MongoDB Indexes** (Simple queries only):
```javascript
// Primary key
db.games.createIndex({ app_id: 1 }, { unique: true })

// Array field indexes for filtering
db.games.createIndex({ "categories.id": 1 })
db.games.createIndex({ "genres.id": 1 })

// Compound indexes
db.games.createIndex({ type: 1, "categories.id": 1 })
db.games.createIndex({ type: 1, "genres.id": 1 })
db.games.createIndex({ is_free: 1, "genres.id": 1 })
```

**Elasticsearch Indexes** (Complex queries):
- Được tự động tạo và optimize bởi Elasticsearch
- Support full-text search với relevance scoring
- Faceted search với sub-millisecond aggregations

### 3. Query Routing Decision

```javascript
// API Layer - Route queries to appropriate service
class GameQueryRouter {
  async getGame(appId) {
    // Simple ID lookup → MongoDB
    return await this.mongodb.findOne({ app_id: appId });
  }
  
  async searchGames(query, filters) {
    // Text search + filters → Elasticsearch
    return await this.elasticsearch.search({
      index: 'games',
      body: {
        query: this.buildElasticsearchQuery(query, filters)
      }
    });
  }
  
  "query": this.buildElasticsearchQuery(query, filters)
    }
  }
  
  async updateGame(appId, data) {
    // Write to MongoDB (source of truth)
    const result = await this.mongodb.updateOne(
      { app_id: appId },
      { $set: data }
    );
    
    // Sync to Elasticsearch (async)
    await this.syncToElasticsearch(appId, data);
    
    return result;
  }
}
```

### 4. Caching Strategy

```javascript
// Multi-layer caching
const getCacheKey = (appId) => `game:${appId}`;

async function getGameOptimized(appId) {
  // Layer 1: Memory cache (fastest)
  const cached = memoryCache.get(getCacheKey(appId));
  if (cached) return cached;
  
  // Layer 2: Redis cache
  const redisCached = await redis.get(getCacheKey(appId));
  if (redisCached) {
    memoryCache.set(getCacheKey(appId), JSON.parse(redisCached));
    return JSON.parse(redisCached);
  }
  
  // Layer 3: MongoDB
  const game = await mongodb.findOne(
    { app_id: appId },
    { projection: { /* essential fields */ } }
  );
  
  // Update caches
  await redis.setex(getCacheKey(appId), 3600, JSON.stringify(game));
  memoryCache.set(getCacheKey(appId), game);
  
  return game;
}
```

### 5. Pagination Best Practices

```javascript
// ❌ Bad - Offset pagination on large datasets
db.games.find({ type: "game" })
  .skip(10000)
  .limit(20)

// ✅ Good - Cursor-based pagination
// First page
const firstPage = await db.games.find({ type: "game" })
  .sort({ _id: 1 })
  .limit(20)
  .toArray();

// Next page using last ID
const lastId = firstPage[firstPage.length - 1]._id;
const nextPage = await db.games.find({ 
  type: "game",
  _id: { $gt: lastId }
})
  .sort({ _id: 1 })
  .limit(20)
  .toArray();
```

**For Elasticsearch**: Use `search_after` parameter for deep pagination.

## 🎯 Common Patterns

### 1. Bulk Operations (MongoDB Only)

```javascript
// Bulk write for efficiency
const operations = games.map(game => ({
  updateOne: {
    filter: { app_id: game.app_id },
    update: { $set: game },
    upsert: true
  }
}));

await db.games.bulkWrite(operations, { ordered: false });
```

### 2. Get Game with Related Data

```javascript
// Get game + enrich with user-specific data from other services
async function getGameDetails(appId, userId) {
  // Get base game info from MongoDB
  const game = await mongodb.findOne({ app_id: appId });
  
  // Enrich with data from other services (via events/API)
  const [userReview, inWishlist, owned] = await Promise.all([
    reviewService.getUserReview(userId, appId),
    wishlistService.isInWishlist(userId, appId),
    libraryService.isOwned(userId, appId)
  ]);
  
  return {
    ...game,
    userReview,
    inWishlist,
    owned
  };
}
```

### 3. Trending Games (Use Elasticsearch Aggregations)

```javascript
// Elasticsearch query for trending
POST /games/_search
{
  "size": 20,
  "query": {
    "function_score": {
      "query": { "match_all": {} },
      "functions": [
        {
          "field_value_factor": {
            "field": "recommendations.total",
            "factor": 2,
            "modifier": "log1p"
          }
        },
        {
          "field_value_factor": {
            "field": "reviews.positive",
            "factor": 1,
            "modifier": "log1p"
          }
        },
        {
          "gauss": {
            "release_date.date": {
              "origin": "now",
              "scale": "30d",
              "decay": 0.5
            }
          }
        }
      ],
      "score_mode": "sum",
      "boost_mode": "multiply"
    }
  },
  "sort": [
    { "_score": { "order": "desc" } }
  ]
}
```

## ⚠️ Anti-Patterns

### ❌ Don't Use MongoDB for Text Search

```javascript
// ❌ Bad - Slow and limited
db.games.find({
  name: { $regex: /half.*life/i }
})

// ❌ Also bad - MongoDB text search is limited
db.games.find({ 
  $text: { $search: "half life" } 
})

// ✅ Good - Use Elasticsearch
POST /games/_search
{
  "query": {
    "multi_match": {
      "query": "half life",
      "fields": ["name^3", "short_description"],
      "fuzziness": "AUTO"
    }
  }
}
```

### ❌ Don't Use MongoDB for Complex Filters

```javascript
// ❌ Bad - Multiple filters in MongoDB
db.games.find({
  type: "game",
  "genres.description": { $in: ["Action", "Adventure"] },
  "platforms.windows": true,
  "price_overview.final": { $gte: 1000, $lte: 3000 },
  "reviews.positive": { $gte: 5000 }
})

// ✅ Good - Use Elasticsearch bool query
POST /games/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "type": "game" } }
      ],
      "filter": [
        { "terms": { "genres.description.keyword": ["Action", "Adventure"] } },
        { "term": { "platforms.windows": true } },
        { "range": { "price_overview.final": { "gte": 1000, "lte": 3000 } } },
        { "range": { "reviews.positive": { "gte": 5000 } } }
      ]
    }
  }
}
```

### ❌ Don't Query Large Arrays Without Projection

```javascript
// ❌ Bad - Returns all screenshots (up to 157 items)
db.games.findOne({ app_id: 220 })

// ✅ Good - Slice arrays
db.games.findOne(
  { app_id: 220 },
  { 
    name: 1,
    screenshots: { $slice: 5 },  // First 5 only
    _id: 0
  }
)
```

### ❌ Don't Query Large Arrays Without Limit

```javascript
// ❌ Returns 3632 DLC items
db.games.findOne({ app_id: 570 }) // Dota 2

// ✅ Use projection and slice
db.games.findOne(
  { app_id: 570 },
  { 
    name: 1,
    dlc: { $slice: 10 }
  }
)
```

### ❌ Don't Use MongoDB for Aggregations When ES Available

```javascript
// ❌ Bad - Complex aggregation in MongoDB
db.games.aggregate([
  { $unwind: "$genres" },
  { $group: { _id: "$genres.description", count: { $sum: 1 } }},
  { $sort: { count: -1 }}
])

// ✅ Good - Use Elasticsearch terms aggregation
POST /games/_search
{
  "size": 0,
  "aggs": {
    "genres": {
      "terms": { 
        "field": "genres.description.keyword",
        "size": 50
      }
    }
  }
}
```

### ❌ Don't Fetch Large Documents Repeatedly

```javascript
// ❌ Bad - Fetching full document in loop
const appIds = [220, 240, 440, 570];
for (const id of appIds) {
  const game = await db.games.findOne({ app_id: id });
  // Process game...
}

// ✅ Good - Batch fetch with $in
const games = await db.games.find({ 
  app_id: { $in: appIds } 
}).toArray();
```

## ✅ Best Practices

### 1. Clear Separation of Concerns

| Operation Type | Use | Reason |
|----------------|-----|--------|
| **Get by ID** | MongoDB | Point query, fastest |
| **CRUD Operations** | MongoDB | Data integrity |
| **Text Search** | Elasticsearch | Better relevance |
| **Filters + Search** | Elasticsearch | Complex queries |
| **Aggregations** | Elasticsearch | Real-time analytics |
| **Reporting** | Elasticsearch | Advanced analytics |

### 2. MongoDB Index Strategy (Minimal)

```javascript
// Only essential indexes for MongoDB
db.games.createIndex({ app_id: 1 }, { unique: true })  // Primary key
db.games.createIndex({ type: 1 })                      // Basic filter
db.games.createIndex({ is_free: 1 })                   // Basic filter
```

### 3. Monitor Query Performance

```javascript
// Check MongoDB slow queries
db.setProfilingLevel(1, { slowms: 100 })

db.system.profile.find({ millis: { $gt: 100 }})
  .sort({ ts: -1 })
  .limit(10)

// Analyze specific query
db.games.find({ app_id: 220 }).explain("executionStats")
```

```javascript
// Monitor Elasticsearch query performance
GET /_cat/thread_pool/search?v&h=node_name,name,active,rejected,completed

// Slow log
GET /games/_search
{
  "profile": true,
  "query": { "match_all": {} }
}
```

### 4. Data Consistency Checks

```javascript
// Periodic sync verification
async function verifySyncStatus() {
  const mongoCount = await db.games.countDocuments();
  
  const esCount = await elasticsearchClient.count({
    index: 'games'
  });
  
  if (mongoCount !== esCount.count) {
    console.warn(`Sync mismatch: MongoDB=${mongoCount}, ES=${esCount.count}`);
    // Trigger re-indexing
    await reindexAllGames();
  }
}
```

### 5. Connection Pooling

```javascript
// MongoDB
const mongoClient = new MongoClient(uri, {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000
});

// Elasticsearch
const elasticsearchClient = new Client({
  node: 'http://elasticsearch:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true
});
```

### 6. Error Handling

```javascript
async function searchGames(query) {
  try {
    // Try Elasticsearch first
    return await elasticsearchClient.search({
      index: 'games',
      body: { query }
    });
  } catch (esError) {
    console.error('Elasticsearch error:', esError);
    
    // Fallback to MongoDB basic search (limited)
    console.warn('Falling back to MongoDB');
    return await db.games.find({
      name: { $regex: query, $options: 'i' }
    }).limit(20).toArray();
  }
}
```

### 7. API Response Structure

```javascript
// Consistent API response
{
  "data": [...],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 20,
    "pages": 50
  },
  "filters": {
    "genres": [
      { "key": "Action", "count": 1500 },
      { "key": "Adventure", "count": 1200 }
    ],
    "platforms": {
      "windows": 5000,
      "mac": 2000,
      "linux": 1500
    }
  },
  "source": "elasticsearch" // or "mongodb"
}
```

## 📚 Additional Resources

- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-checklist-operations/)
- [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- [Game Service Architecture](./game-service-database-schema.md)
- [Quick Reference Guide](./game-service-quick-reference.md)

---

**Last Updated**: October 12, 2025  
**Version**: 2.0.0 (Elasticsearch Integration)  
**Maintained by**: Backend Development Team
