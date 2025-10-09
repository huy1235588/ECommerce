# 🔍 Steam Fields Analyzer - Công cụ phân tích Schema NoSQL

## 📝 Mô tả

Tool phân tích chi tiết các fields trong dữ liệu JSON của Steam games để đề xuất thiết kế schema NoSQL (MongoDB, DynamoDB) tối ưu.

## ✨ Tính năng mới

### 1. **Phân tích kiểu dữ liệu**
- Tự động xác định kiểu dữ liệu của mỗi field (string, integer, float, boolean, array, object)
- Theo dõi tần suất xuất hiện của từng kiểu dữ liệu
- Xác định kiểu dữ liệu chủ đạo (primary type)

### 2. **Phân tích Array Fields**
- Thống kê độ dài array (min, max, average)
- Phân tích kiểu dữ liệu của các phần tử trong array
- Đề xuất cách tối ưu lưu trữ cho array lớn

### 3. **Phân tích Nested Objects**
- Liệt kê tất cả keys trong nested objects
- Đếm số lượng keys trong mỗi nested object
- Đề xuất normalization khi cần thiết

### 4. **Cardinality Analysis**
- Đo độ phân tán của dữ liệu
- Xác định fields phù hợp để tạo index
- Gợi ý fields có thể dùng enum

### 5. **Size Statistics**
- Thống kê kích thước trung bình và tối đa của mỗi field
- Cảnh báo fields có kích thước lớn (>1KB, >10KB)
- Đề xuất lưu trữ bằng GridFS hoặc external storage

### 6. **Schema Suggestions**
- Phân loại fields: Required (>90%), Optional (30-90%), Rare (<30%)
- Tạo MongoDB schema với kiểu dữ liệu phù hợp
- Đề xuất indexes dựa trên cardinality
- Đề xuất normalization cho nested objects lớn
- Tạo validation schema cho MongoDB
- Đề xuất query patterns phổ biến

## 🚀 Cách sử dụng

### Chạy phân tích cơ bản

```bash
# Phân tích thư mục app_details mặc định
python analyze_fields.py

# Phân tích thư mục cụ thể
python analyze_fields.py "path/to/json/folder"
```

### Ví dụ:

```bash
# Phân tích dữ liệu trong server/json
python analyze_fields.py "E:/Project/Node.js/ECommerce/server/json"

# Phân tích subfolder
python analyze_fields.py "E:/Project/Node.js/ECommerce/server/json/data-20250316"
```

## 📊 Kết quả đầu ra

Script tạo ra 7 file trong thư mục `analysis_results/`:

### 1. **all_fields.txt**
Danh sách đầy đủ tất cả fields trong dữ liệu (sorted)

### 2. **field_statistics.csv** ⭐
File Excel-friendly với thông tin:
- Tên field
- Số lần xuất hiện
- Phần trăm coverage
- Các kiểu dữ liệu và tần suất
- Kiểu dữ liệu chủ đạo
- Required/Optional
- Cardinality
- Kích thước trung bình

### 3. **field_levels.txt**
Phân tích fields theo cấp độ nesting (level 1, 2, 3...)

### 4. **array_fields_analysis.txt**
Phân tích chi tiết các array fields:
- Số lần xuất hiện
- Độ dài min/max/avg
- Kiểu dữ liệu của items

### 5. **nested_objects_analysis.txt**
Phân tích các nested objects:
- Số lượng keys
- Danh sách các keys

### 6. **field_samples.json**
Mẫu dữ liệu thực tế của các fields (tối đa 5 mẫu/field)

### 7. **nosql_schema_suggestions.md** ⭐⭐⭐
File quan trọng nhất với:
- Phân loại fields (Required/Optional/Rare)
- MongoDB schema suggestions
- Indexes suggestions
- Normalization suggestions
- Performance optimization tips
- Query patterns
- Validation schema

## 💡 Cách đọc kết quả

### Phân loại Fields

- **Required (>90%)**: Fields bắt buộc, nên có trong schema chính
- **Optional (30-90%)**: Fields tùy chọn, có thể nullable
- **Rare (<30%)**: Fields hiếm, cân nhắc flexible schema

### Index Suggestions

Tool tự động đề xuất indexes cho:
- Fields có cardinality cao (>100 unique values)
- Fields xuất hiện thường xuyên (>50% coverage)
- Text search indexes
- Compound indexes cho query patterns phổ biến

### Normalization Suggestions

Tool đề xuất tách collection riêng khi:
- Nested object có nhiều keys (>5)
- Array có độ dài lớn (>50 items)
- Field có kích thước lớn (>10KB)

## 🎯 Use Cases

### 1. Thiết kế Database mới
```
1. Chạy analyze_fields.py
2. Đọc nosql_schema_suggestions.md
3. Áp dụng schema được đề xuất
4. Tạo indexes theo gợi ý
```

### 2. Tối ưu Database hiện có
```
1. Phân tích để tìm fields ít dùng
2. Kiểm tra size statistics
3. Tối ưu indexes dựa trên cardinality
4. Normalize dữ liệu nếu cần
```

### 3. Migration Planning
```
1. Phân tích schema cũ
2. So sánh với schema mới
3. Lập kế hoạch migration
4. Validate với samples
```

## 📈 Performance Tips

### Cho datasets lớn:
1. Chạy trên sample data trước
2. Monitor memory usage
3. Sử dụng batch processing nếu cần
4. Chỉ analyze subfolder nếu cần

### Tối ưu script:
```python
# Giới hạn số mẫu lưu trữ
if len(self.field_samples[full_key]) < 5:  # Tăng/giảm con số này

# Giới hạn cardinality tracking
if len(self.field_cardinality[full_key]) < 1000:  # Tránh OOM
    self.field_cardinality[full_key].add(str(value))
```

## 🔧 Customization

### Thay đổi ngưỡng phân loại:
```python
# Trong generate_nosql_schema_suggestions()
if percentage > 90:  # Required threshold
    required_fields.append((field, percentage))
elif percentage > 30:  # Optional threshold
    optional_fields.append((field, percentage))
```

### Thay đổi định nghĩa "large":
```python
# Array lớn
if lengths and max(lengths) > 50:  # Thay đổi 50

# Field lớn
if avg_size > 1000:  # Thay đổi 1000 (bytes)
```

## 📚 Ví dụ Output

### MongoDB Schema Example:
```javascript
{
  steam_appid: Number,
  name: String,
  type: String,  // Low cardinality (3) - Consider enum
  is_free: Boolean,
  categories: Array,  // Array (avg length: 5.2)
  
  // Optional fields
  dlc?: Array,
  recommendations?: Object,
}
```

### Index Example:
```javascript
// High cardinality fields
db.games.createIndex({ steam_appid: 1 })  // Cardinality: 50000, Coverage: 100%
db.games.createIndex({ name: 1 })  // Cardinality: 49800, Coverage: 99.8%

// Text search
db.games.createIndex({ name: "text", short_description: "text" })

// Compound indexes
db.games.createIndex({ type: 1, release_date: -1 })
```

## 🐛 Troubleshooting

### Lỗi "Thư mục không tồn tại"
```bash
# Kiểm tra đường dẫn
ls "path/to/folder"

# Windows: Dùng forward slash hoặc double backslash
python analyze_fields.py "E:/Project/..."
python analyze_fields.py "E:\\Project\\..."
```

### Memory Error với dataset lớn
```python
# Giới hạn cardinality tracking
if len(self.field_cardinality[full_key]) < 1000:
    self.field_cardinality[full_key].add(str(value))
```

### Unicode Error
```python
# Đã xử lý với encoding='utf-8' và ensure_ascii=False
```

## 🎓 Best Practices

1. **Luôn backup dữ liệu** trước khi áp dụng schema mới
2. **Test với sample data** trước khi migrate toàn bộ
3. **Monitor performance** sau khi tạo indexes
4. **Review suggestions** - tool chỉ đề xuất, quyết định cuối cùng là của bạn
5. **Update analysis** khi dữ liệu thay đổi đáng kể

## 📝 Notes

- Tool hỗ trợ nested JSON không giới hạn độ sâu
- Array items được phân tích đệ quy
- Kích thước là ước lượng (JSON serialized)
- Cardinality có thể bị giới hạn để tránh OOM

## 🚀 Future Enhancements

- [ ] Support PostgreSQL JSONB
- [ ] Support DynamoDB schema
- [ ] Visual schema diagram
- [ ] Migration script generator
- [ ] Performance benchmark
- [ ] A/B testing suggestions

---

**Author**: ECommerce Team  
**Last Updated**: 2025-10-06  
**Version**: 2.0 (Enhanced for NoSQL Schema Design)
