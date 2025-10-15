# Search Service Database Schema

## 📋 Tổng quan

Search Service quản lý tìm kiếm và indexing cho hệ thống ECommerce, sử dụng Elasticsearch để cung cấp khả năng tìm kiếm full-text mạnh mẽ, faceted search, và recommendations. Service này tách riêng từ Game Service để tối ưu hóa performance và scalability.

Service này quản lý:

-   Full-text search trên tên game, mô tả, và metadata
-   Faceted search theo categories, genres, platforms
-   Filtering và sorting theo price, ratings, release date
-   Search suggestions và autocomplete
-   Personalized recommendations
-   Analytics và search metrics

## 🗃️ Database Information

| Property              | Value                 |
| --------------------- | --------------------- |
| Database Type         | Elasticsearch 8.x     |
| Index Name            | `games_search`        |
| Schema Version        | 1.0.0                 |
| Shards                | 3                     |
| Replicas              | 1                     |
| **Event Integration** | ✅ Kafka/RabbitMQ     |
| **Security Level**    | High                  |
| **Total Documents**   | ~6,064 games indexed  |

## 📊 Data Statistics

### Search Coverage

| Category              | Count      | Percentage |
| --------------------- | ---------- | ---------- |
| **Indexed Fields**    | 25 fields  | 100%       |
| **Text Fields**       | 8 fields   | 100%       |
| **Numeric Fields**    | 12 fields  | 100%       |
| **Array Fields**      | 15 fields  | 100%       |

### Field Type Distribution

-   **Text**: 40% (analyzed for full-text search)
-   **Keyword**: 30% (exact match, aggregations)
-   **Numeric**: 20% (integers, floats for ranges)
-   **Boolean**: 5% (flags, filters)
-   **Date**: 5% (timestamps, release dates)

## 📋 Index Mapping: `games_search`

### Core Mapping Structure

```json
{
  "mappings": {
    "properties": {
      // Core Information
      "app_id": {
        "type": "keyword",
        "index": true
      },
      "type": {
        "type": "keyword",
        "index": true
      },
      "name": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "required_age": {
        "type": "integer",
        "index": true
      },
      "is_free": {
        "type": "boolean",
        "index": true
      },

      // Descriptions (Full-text search)
      "detailed_description": {
        "type": "text",
        "analyzer": "standard",
        "term_vector": "with_positions_offsets"
      },
      "about_the_game": {
        "type": "text",
        "analyzer": "standard",
        "term_vector": "with_positions_offsets"
      },
      "short_description": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 512
          }
        }
      },

      // Media Assets
      "header_image": {
        "type": "keyword",
        "index": false
      },
      "capsule_image": {
        "type": "keyword",
        "index": false
      },
      "background": {
        "type": "keyword",
        "index": false
      },

      // Arrays - Screenshots
      "screenshots": {
        "type": "nested",
        "properties": {
          "id": {
            "type": "integer",
            "index": true
          },
          "path_thumbnail": {
            "type": "keyword",
            "index": false
          },
          "path_full": {
            "type": "keyword",
            "index": false
          }
        }
      },

      // Arrays - Categories
      "categories": {
        "type": "nested",
        "properties": {
          "id": {
            "type": "integer",
            "index": true
          },
          "description": {
            "type": "text",
            "analyzer": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword"
              }
            }
          }
        }
      },

      // Arrays - Genres
      "genres": {
        "type": "nested",
        "properties": {
          "id": {
            "type": "keyword",
            "index": true
          },
          "description": {
            "type": "text",
            "analyzer": "keyword",
            "fields": {
              "keyword": {
                "type": "keyword"
              }
            }
          }
        }
      },

      // Arrays - Developers
      "developers": {
        "type": "keyword",
        "index": true
      },

      // Arrays - Publishers
      "publishers": {
        "type": "keyword",
        "index": true
      },

      // Platform Support
      "platforms": {
        "type": "object",
        "properties": {
          "windows": {
            "type": "boolean",
            "index": true
          },
          "mac": {
            "type": "boolean",
            "index": true
          },
          "linux": {
            "type": "boolean",
            "index": true
          }
        }
      },

      // Release Information
      "release_date": {
        "type": "object",
        "properties": {
          "coming_soon": {
            "type": "boolean",
            "index": true
          },
          "date": {
            "type": "date",
            "format": "yyyy-MM-dd||yyyy-MM-dd HH:mm:ss||MMM d, yyyy",
            "index": true
          }
        }
      },

      // Pricing
      "price_overview": {
        "type": "object",
        "properties": {
          "currency": {
            "type": "keyword",
            "index": true
          },
          "initial": {
            "type": "integer",
            "index": true
          },
          "final": {
            "type": "integer",
            "index": true
          },
          "discount_percent": {
            "type": "integer",
            "index": true
          },
          "initial_formatted": {
            "type": "keyword",
            "index": false
          },
          "final_formatted": {
            "type": "keyword",
            "index": false
          }
        }
      },

      // Achievements
      "achievements": {
        "type": "object",
        "properties": {
          "total": {
            "type": "integer",
            "index": true
          }
        }
      },

      // Recommendations
      "recommendations": {
        "type": "object",
        "properties": {
          "total": {
            "type": "integer",
            "index": true
          }
        }
      },

      // Reviews
      "reviews": {
        "type": "object",
        "properties": {
          "positive": {
            "type": "integer",
            "index": true
          },
          "negative": {
            "type": "integer",
            "index": true
          },
          "score": {
            "type": "float",
            "index": true
          }
        }
      },

      // Metadata
      "last_updated": {
        "type": "date",
        "index": true
      },
      "search_score": {
        "type": "float",
        "index": false
      }
    }
  }
}
```

## 🔍 Search Configuration

### Analyzers

```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "game_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "stop",
            "porter_stem"
          ]
        },
        "autocomplete_analyzer": {
          "type": "custom",
          "tokenizer": "edge_ngram_tokenizer",
          "filter": [
            "lowercase"
          ]
        }
      },
      "tokenizer": {
        "edge_ngram_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 1,
          "max_gram": 20,
          "token_chars": [
            "letter",
            "digit"
          ]
        }
      }
    }
  }
}
```

### Search Indexes

```javascript
// Create index with settings
PUT /games_search
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "analysis": { /* analyzer config */ }
  },
  "mappings": { /* mapping config */ }
}
```

## 🎯 Search Queries

### Full-Text Search

```javascript
// Basic full-text search
GET /games_search/_search
{
  "query": {
    "multi_match": {
      "query": "action adventure",
      "fields": ["name^10", "short_description^5", "about_the_game^3"],
      "type": "best_fields",
      "tie_breaker": 0.3
    }
  },
  "highlight": {
    "fields": {
      "name": {},
      "short_description": {},
      "about_the_game": {}
    }
  }
}
```

### Faceted Search

```javascript
// Search with filters
GET /games_search/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "rpg",
            "fields": ["name", "genres.description"]
          }
        }
      ],
      "filter": [
        {
          "term": { "is_free": false }
        },
        {
          "range": {
            "price_overview.final": {
              "gte": 0,
              "lte": 2000
            }
          }
        },
        {
          "nested": {
            "path": "genres",
            "query": {
              "term": { "genres.id": "rpg" }
            }
          }
        }
      ]
    }
  },
  "sort": [
    { "recommendations.total": "desc" },
    { "_score": "desc" }
  ],
  "aggs": {
    "genres": {
      "nested": { "path": "genres" },
      "aggs": {
        "genre_names": {
          "terms": { "field": "genres.description.keyword" }
        }
      }
    },
    "price_ranges": {
      "range": {
        "field": "price_overview.final",
        "ranges": [
          { "to": 500 },
          { "from": 500, "to": 1500 },
          { "from": 1500, "to": 3000 },
          { "from": 3000 }
        ]
      }
    }
  }
}
```

### Autocomplete/Suggestions

```javascript
// Autocomplete query
GET /games_search/_search
{
  "query": {
    "match_phrase_prefix": {
      "name": "warc"
    }
  },
  "size": 10,
  "_source": ["name", "steam_appid"]
}
```

## 🔄 Event Integration

### Published Events

```javascript
// Search index updated
{
  eventType: "SEARCH_INDEX_UPDATED",
  aggregateId: app_id,
  timestamp: Date,
  payload: {
    operation: "index|update|delete",
    document: { /* game data */ }
  }
}

// Search query performed
{
  eventType: "SEARCH_QUERY_EXECUTED",
  aggregateId: query_id,
  timestamp: Date,
  payload: {
    query: String,
    filters: Object,
    results_count: Number,
    response_time: Number
  }
}
```

### Consumed Events

```javascript
// From Game Service
{
  eventType: "GAME_CREATED",
  aggregateId: app_id,
  payload: { /* full game data */ }
}

{
  eventType: "GAME_UPDATED",
  aggregateId: app_id,
  payload: {
    changes: { /* changed fields */ }
  }
}
```

## 📈 Monitoring & Maintenance

### Key Metrics

1. **Search Performance**

    - Average query response time: < 50ms
    - 95th percentile: < 200ms
    - Index size: ~50-70 MB
    - Query throughput: 1000+ QPS

2. **Index Health**

    - Cluster status: Green
    - Shard distribution: Balanced
    - Replication lag: < 1 second

3. **Search Analytics**

    - Popular search terms
    - Zero-result queries
    - Click-through rates
    - User engagement metrics

### Maintenance Tasks

```bash
# Check cluster health
curl -X GET "localhost:9200/_cluster/health?pretty"

# Get index stats
curl -X GET "localhost:9200/games_search/_stats?pretty"

# Reindex for optimization
curl -X POST "localhost:9200/_reindex" -H 'Content-Type: application/json' -d'
{
  "source": {
    "index": "games_search"
  },
  "dest": {
    "index": "games_search_v2"
  }
}
'

# Update index settings
curl -X PUT "localhost:9200/games_search/_settings" -H 'Content-Type: application/json' -d'
{
  "index": {
    "refresh_interval": "30s"
  }
}
'
```

## 🚀 Migration & Deployment

### Data Migration from MongoDB

```javascript
// Migration script
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

// Transform MongoDB documents to Elasticsearch format
async function migrateGames() {
  const games = await mongoClient.db('game_service_db').collection('games').find({}).toArray();
  
  const body = games.flatMap(doc => [
    { index: { _id: doc.app_id.toString() } },
    {
      app_id: doc.app_id,
      name: doc.name,
      type: doc.type,
      is_free: doc.is_free,
      short_description: doc.short_description,
      about_the_game: doc.about_the_game,
      detailed_description: doc.detailed_description,
      categories: doc.categories,
      genres: doc.genres,
      platforms: doc.platforms,
      release_date: doc.release_date,
      price_overview: doc.price_overview,
      recommendations: doc.recommendations,
      reviews: doc.reviews,
      last_updated: new Date()
    }
  ]);
  
  await client.bulk({ body });
}
```

### Index Templates

```json
PUT /_index_template/games_template
{
  "index_patterns": ["games_search*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1
    },
    "mappings": { /* mapping config */ }
  }
}
```

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0  
**Migration Source**: MongoDB Game Service  
**Maintained by**: Search Team

## 📚 Related Documentation

-   [[Search Service API Documentation]] - API endpoints và usage
-   [[Elasticsearch Best Practices]] - Elasticsearch optimization tips
-   [[Search Service Architecture]] - Service architecture overview
-   [[Event-Driven Architecture Guide]] - Event integration patterns
-   [[Game Service Database Schema]] - Source MongoDB schema</content>
<parameter name="filePath">e:\Project\Node.js\ECommerce\docs\03-backend\database\search-service-database-schema.md