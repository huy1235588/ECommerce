# Import Games to MongoDB - Hướng Dẫn Sử Dụng

## 📋 Mô tả

Script Python để import toàn bộ dữ liệu game từ file JSON (trong thư mục `app_details`) vào MongoDB theo schema đã định nghĩa.

## 🎯 Tính năng

- ✅ Import tất cả file JSON từ các thư mục con
- ✅ Transform dữ liệu theo schema MongoDB
- ✅ Bulk insert với hiệu suất cao
- ✅ Upsert để tránh duplicate (dựa trên app_id)
- ✅ Tự động tạo indexes
- ✅ Logging chi tiết
- ✅ Báo cáo thống kê

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

Dependencies cần thiết:
- `pymongo`: MongoDB driver
- `python-dotenv`: Đọc biến môi trường
- `requests`: (đã có sẵn)

### 2. Cấu hình MongoDB

Tạo file `.env` trong thư mục `python`:

```env
MONGO_URI=mongodb://localhost:27017/
```

Hoặc sử dụng MongoDB Atlas:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

## 🚀 Sử dụng

### Import tất cả games

```bash
cd python
python import_games_to_db.py
```

### Import với tùy chọn

```python
from import_games_to_db import GameImporter

# Khởi tạo
importer = GameImporter(
    mongo_uri="mongodb://localhost:27017/",
    db_name="game_service_db"
)

# Import với batch size tùy chỉnh
importer.run(
    create_indexes=True,  # Tạo indexes sau khi import
    batch_size=100        # Số lượng games mỗi batch
)
```

## 📊 Cấu trúc dữ liệu

### Input: File JSON

```
python/app_details/
├── 1-1000/
│   ├── app_details_10.json
│   ├── app_details_20.json
│   └── ...
├── 1001-2000/
│   └── ...
└── ...
```

### Format file JSON:

```json
{
    "success": true,
    "data": {
        "steam_appid": 15100,
        "name": "Assassin's Creed™: Director's Cut Edition",
        "type": "game",
        "required_age": 0,
        "is_free": false,
        ...
    }
}
```

### Output: MongoDB Collection

**Database**: `game_service_db`  
**Collection**: `games`

```javascript
{
    app_id: 15100,
    name: "Assassin's Creed™: Director's Cut Edition",
    type: "game",
    required_age: 0,
    is_free: false,
    detailed_description: "...",
    screenshots: [...],
    movies: [...],
    categories: [...],
    genres: [...],
    platforms: {...},
    price_overview: {...},
    created_at: ISODate("2025-01-01T00:00:00Z"),
    updated_at: ISODate("2025-01-01T00:00:00Z")
}
```

## 📈 Indexes được tạo

Script tự động tạo các indexes sau:

```javascript
// Single field indexes
db.games.createIndex({ app_id: 1 }, { unique: true })
db.games.createIndex({ name: 1 })
db.games.createIndex({ type: 1 })
db.games.createIndex({ is_free: 1 })
db.games.createIndex({ "release_date.date": 1 })

// Text search index
db.games.createIndex({
    name: "text",
    short_description: "text",
    detailed_description: "text"
})

// Compound indexes
db.games.createIndex({ type: 1, "release_date.date": -1 })
db.games.createIndex({ is_free: 1, "price_overview.final": 1 })
```

## 📝 Logs

Logs được lưu trong thư mục `logs/`:

```
logs/
└── import_games_20250114_153045.log
```

Format log:

```
2025-01-14 15:30:45 - INFO - ✅ Kết nối thành công đến MongoDB: game_service_db
2025-01-14 15:30:45 - INFO - 📁 Tìm thấy 15000 file JSON
2025-01-14 15:30:50 - INFO - ✅ Import thành công 100 games (Upserted: 100, Modified: 0)
2025-01-14 15:31:00 - INFO - 📊 Đã xử lý 500/15000 files...
```

## 📊 Báo cáo thống kê

Sau khi hoàn thành, script sẽ hiển thị báo cáo:

```
============================================================
📊 KẾT QUẢ IMPORT
============================================================
⏱️  Thời gian: 0:15:32
📁 Tổng số file: 15000
✅ Thành công: 14850
⚠️  Bỏ qua: 100
❌ Thất bại: 50
============================================================
```

## 🔍 Kiểm tra kết quả

### Sử dụng MongoDB Shell

```javascript
// Kết nối đến database
use game_service_db

// Đếm số lượng games
db.games.countDocuments()

// Xem một game mẫu
db.games.findOne()

// Tìm kiếm theo tên
db.games.find({ name: /Assassin/i }).limit(5)

// Tìm game miễn phí
db.games.find({ is_free: true }).limit(10)

// Thống kê theo type
db.games.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
])
```

### Sử dụng Python

```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['game_service_db']
games = db['games']

# Đếm số games
print(f"Tổng số games: {games.count_documents({})}")

# Lấy một game
game = games.find_one({'app_id': 15100})
print(game)

# Tìm kiếm
for game in games.find({'is_free': True}).limit(5):
    print(f"{game['name']} - {game['type']}")
```

## ⚠️ Lưu ý

1. **Dung lượng**: Import toàn bộ có thể tốn nhiều dung lượng (vài GB)
2. **Thời gian**: Quá trình import có thể mất 10-30 phút tùy vào số lượng file
3. **RAM**: Batch size mặc định là 100, có thể tăng lên nếu có đủ RAM
4. **Duplicate**: Script tự động xử lý duplicate bằng upsert (dựa trên app_id)
5. **Indexes**: Tạo indexes sau khi import xong để tối ưu hiệu suất

## 🐛 Xử lý lỗi

### Lỗi kết nối MongoDB

```
❌ Lỗi kết nối MongoDB: ...
```

**Giải pháp**: Kiểm tra MongoDB đang chạy và MONGO_URI đúng

### Lỗi không tìm thấy file

```
❌ Thư mục không tồn tại: ...
```

**Giải pháp**: Đảm bảo thư mục `app_details` tồn tại và có file JSON

### Lỗi duplicate key

```
DuplicateKeyError: E11000 duplicate key error
```

**Giải pháp**: Script tự động xử lý bằng upsert, nhưng nếu vẫn gặp lỗi, xóa collection và chạy lại:

```javascript
db.games.drop()
```

## 🔄 Cập nhật dữ liệu

Để cập nhật dữ liệu mới:

1. Thêm file JSON mới vào thư mục `app_details`
2. Chạy lại script (sẽ tự động upsert)

```bash
python import_games_to_db.py
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. File logs trong thư mục `logs/`
2. MongoDB logs
3. Đảm bảo file JSON có format đúng

## 🎉 Hoàn thành!

Sau khi import thành công, bạn có thể:

- Sử dụng API để query dữ liệu
- Tích hợp với Game Service
- Thực hiện các phân tích dữ liệu
