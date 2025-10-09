# 🚀 Quick Start Guide - Steam Fields Analyzer

## Cài đặt nhanh (5 phút)

### Bước 1: Kiểm tra Python
```bash
python --version  # Cần Python 3.7+
```

### Bước 2: Không cần cài dependencies
Script chỉ dùng standard library Python, không cần pip install gì cả!

## 🎯 Chạy ngay

### Scenario 1: Phân tích dữ liệu test
```bash
# Tạo sample data
python create_test_data.py

# Phân tích
python analyze_fields.py "python/test_data"

# Xem kết quả
code analysis_results/nosql_schema_suggestions.md
```

### Scenario 2: Phân tích dữ liệu thực
```bash
# Phân tích app_details folder
python analyze_fields.py

# Hoặc chỉ định folder cụ thể
python analyze_fields.py "E:/Project/Node.js/ECommerce/python/app_details"
```

### Scenario 3: Phân tích server JSON
```bash
python analyze_fields.py "E:/Project/Node.js/ECommerce/server/json/data-20250316"
```

## 📊 Xem kết quả

### File quan trọng nhất: `nosql_schema_suggestions.md`
```bash
# Windows
code analysis_results/nosql_schema_suggestions.md

# Hoặc notepad
notepad analysis_results/nosql_schema_suggestions.md
```

### File thống kê Excel: `field_statistics.csv`
```bash
# Mở bằng Excel
start excel analysis_results/field_statistics.csv

# Hoặc xem trong VS Code
code analysis_results/field_statistics.csv
```

## 🎓 Workflow đề xuất

### 1️⃣ Phase 1: Analysis (5 phút)
```bash
# Chạy analyzer
python analyze_fields.py "path/to/json"

# Output:
# ✅ 7 files trong analysis_results/
```

### 2️⃣ Phase 2: Review (15 phút)
```bash
# Đọc file chính
code analysis_results/nosql_schema_suggestions.md

# Các section quan trọng:
# - Section 1: Phân loại fields
# - Section 2: MongoDB schema
# - Section 3: Indexes
# - Section 4: Normalization
# - Section 5: Performance tips
```

### 3️⃣ Phase 3: Implementation (30 phút)
```javascript
// Copy schema từ Section 2
const gameSchema = new Schema({
  // Paste suggested schema here
});

// Copy indexes từ Section 3
db.games.createIndex({ ... });

// Áp dụng validation từ Section 7
db.createCollection('games', {
  validator: { ... }
});
```

### 4️⃣ Phase 4: Optimization (Optional)
```bash
# Review performance tips
# Section 5 trong nosql_schema_suggestions.md

# Implement GridFS nếu cần
# Tách collection nếu được đề xuất
# Add pagination cho large arrays
```

## 📋 Checklist

- [ ] Python 3.7+ installed
- [ ] Sample data created (optional)
- [ ] Analysis completed (7 files generated)
- [ ] Schema reviewed and understood
- [ ] Indexes planned
- [ ] Validation schema prepared
- [ ] Performance considerations noted
- [ ] Schema implemented in code
- [ ] Indexes created in database
- [ ] Validation rules applied
- [ ] Testing completed

## 🔥 Tips & Tricks

### Tip 1: Phân tích nhanh với sample
```bash
# Chỉ analyze 1 folder nhỏ để test
python analyze_fields.py "python/app_details/1-1000"
```

### Tip 2: So sánh versions
```bash
# Xem improvements
python compare_versions.py
```

### Tip 3: Export ra Excel để share
```bash
# File CSV đã sẵn sàng để import Excel
start excel analysis_results/field_statistics.csv

# Sort by Coverage để xem required fields
# Sort by Cardinality để xem index candidates
# Sort by Avg_Size để xem large fields
```

### Tip 4: Backup kết quả
```bash
# Rename analysis folder với timestamp
mv analysis_results analysis_results_20250316

# Chạy lại để so sánh
python analyze_fields.py
```

### Tip 5: Share với team
```bash
# Copy file markdown để review
cp analysis_results/nosql_schema_suggestions.md docs/schema_v1.md

# Commit vào git
git add docs/schema_v1.md
git commit -m "Add NoSQL schema design v1"
```

## ❓ Common Questions

### Q: Tôi có nhiều JSON files, analyzer xử lý tất cả chứ?
✅ Yes! Script tự động tìm và xử lý TẤT CẢ .json files trong folder và subfolders.

### Q: Kết quả có chính xác không nếu data không đồng nhất?
✅ Yes! Script phân tích % coverage và data types để bạn biết field nào reliable.

### Q: Tôi có thể dùng cho MongoDB, DynamoDB không?
✅ Schema suggestions chủ yếu cho MongoDB, nhưng concepts áp dụng được cho mọi NoSQL DB.

### Q: Script có xử lý được nested arrays không?
✅ Yes! Phân tích đệ quy không giới hạn độ sâu.

### Q: Làm sao biết field nào nên index?
✅ Xem Section 3 trong nosql_schema_suggestions.md - có đề xuất dựa trên cardinality.

### Q: Field nào nên tách collection riêng?
✅ Xem Section 4 trong nosql_schema_suggestions.md - có đề xuất normalization.

## 🐛 Troubleshooting

### Error: "Thư mục không tồn tại"
```bash
# Check path
ls "path/to/folder"

# Windows: Use forward slash
python analyze_fields.py "E:/Project/..."
```

### Error: "No JSON files found"
```bash
# Check file pattern
# Script tìm tất cả *.json files
# Nếu files có pattern khác, update line 46 trong script:
json_files = list(root_dir.rglob("your_pattern_*.json"))
```

### Warning: Memory high
```bash
# Phân tích subfolder thay vì toàn bộ
python analyze_fields.py "python/app_details/1-1000"

# Hoặc giới hạn cardinality tracking (edit script)
```

## 📞 Support

- 📖 Đọc SCHEMA_ANALYZER_README.md cho chi tiết
- 🔍 Xem compare_versions.py để hiểu improvements
- 💻 Tạo issue nếu gặp bug
- 💡 Đề xuất features mới welcome!

## ⭐ Next Steps

Sau khi có schema:
1. ✅ Implement trong code
2. ✅ Create database với validation
3. ✅ Add indexes
4. ✅ Test với sample data
5. ✅ Migrate production data
6. ✅ Monitor performance

---

**Happy Schema Designing! 🎉**
