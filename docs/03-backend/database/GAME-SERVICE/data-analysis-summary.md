# Game Service Database - Data Analysis Summary

Tóm tắt về dữ liệu phân tích được sử dụng để tạo database schema.

## 📊 Analysis Overview

Tài liệu database này được tạo dựa trên phân tích **6,064 games** từ Steam platform.

## 📁 Source Files

Các file phân tích trong `python/analysis_results/`:

### 1. `nosql_schema_suggestions.md`

**Nội dung**: Đề xuất schema NoSQL cho MongoDB

-   Phân loại fields theo coverage (Required, Optional, Rare)
-   Schema structure recommendations
-   Index suggestions
-   Normalization proposals
-   Performance optimization tips

**Key Insights**:
-   75 required fields (>90% coverage)
-   49 optional fields (30-90% coverage)
-   542 rare fields (<30% coverage)
-   Recommendations for field separation and denormalization

### 2. `field_statistics.csv`

**Nội dung**: Thống kê chi tiết cho mỗi field

**Columns**:
-   `Field`: Field name (including nested paths)
-   `Count`: Number of documents with this field
-   `Percentage`: Coverage percentage
-   `Data_Types`: Data types found
-   `Primary_Type`: Most common type
-   `Is_Required`: Whether field should be required
-   `Cardinality`: Number of unique values
-   `Avg_Size_Bytes`: Average field size

**Total Fields**: 668 fields analyzed

**Sample Data**:
```csv
Field,Count,Percentage,Data_Types,Primary_Type,Is_Required,Cardinality,Avg_Size_Bytes
"app_id",6064,100.00,integer:6064,integer,Yes,6052,6.42
"name",6064,100.00,string:6064,string,Yes,6051,19.33
"type",6064,100.00,string:6064,string,Yes,6,4.01
```

### 3. `field_samples.json`

**Nội dung**: Sample values cho mỗi field

**Format**:
```json
{
  "field_name": [
    "sample_value_1",
    "sample_value_2",
    "sample_value_3",
    "sample_value_4",
    "sample_value_5"
  ]
}
```

**Purpose**: Hiểu data types và formats thực tế

**Size**: 4,231 lines covering all fields

### 4. `array_fields_analysis.txt`

**Nội dung**: Phân tích chi tiết các array fields

**Information per Array**:
-   Số lần xuất hiện
-   Độ dài array (Min, Max, Avg)
-   Kiểu dữ liệu trong array
-   Element counts

**Key Findings**:
-   `screenshots`: Avg 11.5 items, Max 157 items
-   `dlc`: Avg 9.7 items, Max 3,632 items ⚠️
-   `categories`: Avg 7.2 items, Max 29 items
-   `genres`: Avg 2.9 items, Max 10 items
-   `movies`: Avg 2.5 items, Max 50 items

### 5. `nested_objects_analysis.txt`

**Nội dung**: Phân tích các nested objects

**Information per Object**:
-   Số lượng keys
-   Danh sách keys
-   Structure depth

**Key Objects**:
-   `tags`: 441 keys (very large!)
-   `ratings`: 20 keys
-   `price_overview`: 8 keys
-   `platforms`: 3 keys
-   `release_date`: 2 keys

### 6. `field_levels.txt`

**Nội dung**: Hierarchy của fields

**Purpose**: Hiểu structure và nesting levels

**Example**:
```
level_1: app_id
level_1: name
level_1: platforms
level_2: platforms.windows
level_2: platforms.mac
level_3: movies.webm.480
```

### 7. `all_fields.txt`

**Nội dung**: Danh sách tất cả 668 fields

**Format**: Simple list of field paths
```
app_id
name
type
platforms.windows
genres.description
movies.webm.480
```

## 📈 Key Statistics

### Coverage Distribution

| Coverage Range | Field Count | Percentage |
| -------------- | ----------- | ---------- |
| 100%           | 65          | 9.7%       |
| 90-99%         | 10          | 1.5%       |
| 70-89%         | 18          | 2.7%       |
| 30-69%         | 31          | 4.6%       |
| <30%           | 542         | 81.1%      |

### Data Type Distribution

| Data Type | Field Count | Percentage |
| --------- | ----------- | ---------- |
| String    | 380         | 56.9%      |
| Object    | 95          | 14.2%      |
| Array     | 85          | 12.7%      |
| Integer   | 65          | 9.7%       |
| Boolean   | 35          | 5.2%       |
| Null      | 8           | 1.2%       |

### Size Analysis

| Field Category      | Avg Size (bytes) | Max Size (bytes) |
| ------------------- | ---------------- | ---------------- |
| Descriptions        | 3,600            | 52,840           |
| Screenshots (array) | 3,950            | 54,432           |
| Movies (array)      | 2,723            | 50,000+          |
| Tags (object)       | 270              | 5,000+           |
| Regular strings     | 20-200           | 1,000            |

## 🎯 Design Decisions Based on Analysis

### 1. Required vs Optional Fields

**Decision**: Mark fields as required if coverage > 90%

**Rationale**: 
-   Core functionality requires these fields
-   Missing data is exceptional case
-   Can enforce with MongoDB schema validation

**Result**: 75 required fields identified

### 2. Embedded vs Referenced

**Decision**: Keep most data embedded in single document

**Rationale**:
-   Game data is read-heavy (95% reads, 5% writes)
-   Data is always queried together
-   No complex relationships between games
-   Document size (~20KB avg) is reasonable

**Exceptions**:
-   Future: Consider separating `dlc` array if > 100 items
-   Future: Extract `tags` object for faceted search

### 3. Index Strategy

**Decision**: Create indexes based on query patterns from analysis

**High Cardinality Fields** (good for indexing):
-   `app_id`: 6,052 unique (99.8%)
-   `name`: 6,051 unique (99.8%)
-   `header_image`: 6,045 unique
-   `detailed_description`: 5,899 unique

**Low Cardinality Fields** (consider for compound indexes):
-   `type`: 6 unique values
-   `is_free`: 2 unique values
-   `required_age`: 12 unique values

### 4. Array Size Considerations

**Problem**: Some arrays are very large

**Solutions**:
-   `dlc` (max 3,632): Recommend pagination, consider separate collection
-   `screenshots` (max 157): Use `$slice` projection for pagination
-   `achievements.highlighted` (max 10): Keep embedded, reasonable size
-   `categories` (max 29): Keep embedded, frequently queried together

### 5. Large Text Fields

**Problem**: Descriptions can be 50KB+

**Solutions**:
-   Keep in main document (queried together)
-   Use projection to exclude when not needed
-   Consider compression at application level
-   Text index for search functionality

## 🔍 Analysis Scripts

### Python Scripts Used

Located in `python/` directory:

1. **`analyze_fields.py`**
   - Scans all JSON files in `app_details/`
   - Extracts all field paths
   - Calculates statistics
   - Generates analysis files

2. **`check_mongo_doc_size.py`**
   - Validates document sizes
   - Checks BSON size limits (16MB)
   - Identifies large documents

3. **`steam_games.py`**
   - Fetches game data from Steam API
   - Stores in `app_details/` folders

### Running Analysis Again

```bash
cd python/

# Install dependencies
pip install -r requirements.txt

# Run field analysis
python analyze_fields.py

# Check document sizes
python check_mongo_doc_size.py

# Results in analysis_results/
ls analysis_results/
```

## 📊 Data Quality Issues Found

### Missing Data

1. **Optional Websites** (30.7% missing)
   - Many games don't have official websites
   - Store as nullable field

2. **Price Information** (27.2% missing)
   - Free games don't have price_overview
   - Pre-release games might not have pricing yet
   - Handle as optional field

3. **Screenshots** (1.8% missing)
   - Small percentage of games without screenshots
   - Should be required but handle gracefully

### Data Inconsistencies

1. **required_age Field**
   - Type: 93% integer, 7% string
   - Solution: Accept both, normalize to integer

2. **pc_requirements/mac_requirements**
   - Type: 98% object, 2% array
   - Solution: Accept both, prefer object

3. **Date Formats**
   - Multiple formats: "Jan 1, 2025", "2025-01-01", "Coming soon"
   - Solution: Store as string, parse at application level

### Edge Cases

1. **Empty Arrays**
   - Some games have `genres: []`
   - Solution: Require at least 1 genre in business logic

2. **Null Values**
   - `website: null` in 30% of documents
   - Solution: Accept null, filter in queries

3. **Very Large Arrays**
   - Dota 2 has 3,632 DLC items
   - Solution: Implement pagination, warn at 100+ items

## 🚀 Future Analysis

### Recommended Additional Analysis

1. **Query Pattern Analysis**
   - Track actual user queries in production
   - Optimize indexes based on real usage
   - Identify slow queries

2. **Growth Trend Analysis**
   - Monitor document size growth
   - Track field usage patterns
   - Plan for scaling

3. **Performance Benchmarking**
   - Test query performance with full dataset
   - Measure index effectiveness
   - Optimize based on metrics

4. **User Behavior Analysis**
   - Track most queried games
   - Identify popular filters
   - Optimize for common patterns

## 📚 Related Documentation

-   📖 [Game Service Database Schema](./game-service-database-schema.md)
-   📊 [Database Architecture Diagrams](./database-architecture-diagrams.md)
-   🔍 [MongoDB Query Patterns](./mongodb-query-patterns.md)
-   ⚡ [Quick Reference Guide](./game-service-quick-reference.md)
-   🏠 [Database Documentation Home](./README.md)

---

**Analysis Date**: October 12, 2025  
**Dataset Size**: 6,064 games  
**Data Source**: Steam Store API  
**Analysis Scripts**: Python 3.x  
**Maintained by**: Backend Development Team
