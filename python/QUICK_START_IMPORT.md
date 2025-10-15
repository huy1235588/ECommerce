# 🎮 Import Steam Games Data vào MongoDB

Hướng dẫn chi tiết để import toàn bộ dữ liệu games từ file JSON vào MongoDB.

## 📝 Tổng quan

Script này giúp bạn import hàng ngàn file JSON chứa thông tin game từ Steam API vào MongoDB database theo schema đã được định nghĩa sẵn.

**Điểm nổi bật:**
- ⚡ Import hàng loạt với hiệu suất cao (bulk operations)
- 🔄 Tự động xử lý duplicate (upsert)
- 📊 Logging chi tiết và báo cáo thống kê
- 🔍 Tự động tạo indexes để tối ưu truy vấn
- ✅ Kiểm tra dữ liệu trước khi import

## 🚀 Bắt đầu nhanh

### Bước 1: Cài đặt dependencies

```bash
cd python
pip install -r requirements.txt
```

### Bước 2: Cấu hình MongoDB

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
MONGO_URI=mongodb://localhost:27017/
DB_NAME=game_service_db
```

### Bước 3: Kiểm tra trước khi import

```bash
python check_before_import.py
```

Script này sẽ kiểm tra:
- ✅ Kết nối MongoDB
- ✅ Cấu trúc thư mục và file JSON
- ✅ Format dữ liệu
- ✅ Test import một vài games mẫu

### Bước 4: Import toàn bộ games

```bash
python import_games_to_db.py
```

## 📂 Cấu trúc dữ liệu

### Input (File JSON)

```
python/app_details/
├── 1-1000/
│   ├── app_details_10.json
│   ├── app_details_20.json
│   └── ...
├── 1001-2000/
│   └── ...
└── ... (hàng trăm thư mục)
```

**Format file JSON:**
```json
{
    "success": true,
    "data": {
        "steam_appid": 15100,
        "name": "Assassin's Creed™",
        "type": "game",
        "is_free": false,
        "detailed_description": "...",
        "screenshots": [...],
        "movies": [...],
        ...
    }
}
```

### Output (MongoDB)

**Database:** `game_service_db`  
**Collection:** `games`

```javascript
{
    app_id: 15100,              // Unique ID (indexed)
    name: "Assassin's Creed™",  // Game name (text indexed)
    type: "game",               // Type: game, dlc, demo
    is_free: false,
    
    // Descriptions
    detailed_description: "...",
    about_the_game: "...",
    short_description: "...",
    
    // Media
    screenshots: [...],
    movies: [...],
    
    // Game info
    categories: [...],
    genres: [...],
    developers: [...],
    publishers: [...],
    
    // Platform & Requirements
    platforms: {...},
    pc_requirements: {...},
    mac_requirements: {...},
    linux_requirements: {...},
    
    // Pricing
    price_overview: {...},
    packages: [...],
    
    // Additional
    achievements: {...},
    reviews: {...},
    ratings: {...},
    
    // Timestamps
    created_at: ISODate("..."),
    updated_at: ISODate("...")
}
```

## 🎯 Các tính năng chính

### 1. Bulk Import với Upsert

```python
# Import theo batch 100 games
# Tự động cập nhật nếu game đã tồn tại (theo app_id)
importer.run(batch_size=100)
```

### 2. Indexes tự động

Script tự động tạo các indexes sau khi import:

```javascript
// Unique index
db.games.createIndex({ app_id: 1 }, { unique: true })

// Single field indexes
db.games.createIndex({ name: 1 })
db.games.createIndex({ type: 1 })
db.games.createIndex({ is_free: 1 })

// Text search
db.games.createIndex({
    name: "text",
    short_description: "text",
    detailed_description: "text"
})

// Compound indexes
db.games.createIndex({ type: 1, "release_date.date": -1 })
db.games.createIndex({ is_free: 1, "price_overview.final": 1 })
```

### 3. Logging chi tiết

```
2025-01-14 15:30:45 - INFO - ✅ Kết nối thành công đến MongoDB
2025-01-14 15:30:45 - INFO - 📁 Tìm thấy 15000 file JSON
2025-01-14 15:30:50 - INFO - ✅ Import thành công 100 games
2025-01-14 15:31:00 - INFO - 📊 Đã xử lý 500/15000 files...
```

## 📊 Thống kê & Báo cáo

Sau khi hoàn thành, bạn sẽ nhận được báo cáo:

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

📊 Tổng số games trong database: 14850
```

## 🔍 Kiểm tra kết quả

### MongoDB Shell

```javascript
// Kết nối
use game_service_db

// Đếm tổng số games
db.games.countDocuments()

// Xem một game
db.games.findOne({ app_id: 15100 })

// Tìm game theo tên
db.games.find({ name: /Assassin/i })

// Text search
db.games.find({ $text: { $search: "action adventure" } })

// Tìm game miễn phí
db.games.find({ is_free: true })

// Thống kê theo type
db.games.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } }
])
```

### Python

```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['game_service_db']

# Tổng số games
print(db.games.count_documents({}))

# Query games
games = db.games.find({ 'is_free': True }).limit(10)
for game in games:
    print(f"{game['name']} - {game['type']}")
```

## ⚙️ Tùy chỉnh

### Import với các tùy chọn khác

```python
from import_games_to_db import GameImporter

importer = GameImporter(
    mongo_uri="mongodb://localhost:27017/",
    db_name="game_service_db"
)

# Import với batch size lớn hơn (nếu có đủ RAM)
importer.run(
    create_indexes=True,
    batch_size=500
)
```

### Skip việc tạo indexes

```python
# Nếu đã có indexes rồi
importer.run(create_indexes=False)
```

### Chỉ import một số thư mục nhất định

Chỉnh sửa trong `import_games_to_db.py`:

```python
def get_all_json_files(self):
    json_files = []
    
    # Chỉ import từ thư mục 1-1000 đến 5000-6000
    for subdir in sorted(self.base_dir.iterdir()):
        if subdir.is_dir():
            # Filter theo tên thư mục
            if "1-1000" <= subdir.name <= "5000-6000":
                for json_file in sorted(subdir.glob('app_details_*.json')):
                    json_files.append(json_file)
    
    return json_files
```

## ⚠️ Lưu ý quan trọng

### 1. Dung lượng disk

- Mỗi game document: ~50-100 KB
- 15,000 games: ~1-1.5 GB
- Indexes: thêm ~200-300 MB

### 2. Thời gian import

- 100 games/batch: ~15-30 phút cho 15,000 games
- 500 games/batch: ~10-15 phút (cần RAM cao hơn)

### 3. RAM

- Batch size 100: ~500 MB RAM
- Batch size 500: ~2 GB RAM

### 4. Xử lý duplicate

Script tự động xử lý duplicate bằng upsert:
- Nếu `app_id` đã tồn tại → Cập nhật
- Nếu chưa tồn tại → Insert mới

## 🐛 Xử lý sự cố

### 1. Lỗi kết nối MongoDB

```
❌ Lỗi kết nối MongoDB: ServerSelectionTimeoutError
```

**Giải pháp:**
- Kiểm tra MongoDB đang chạy: `mongod --version`
- Kiểm tra MONGO_URI trong `.env`
- Test kết nối: `python check_before_import.py`

### 2. Lỗi không tìm thấy file

```
❌ Thư mục không tồn tại: app_details
```

**Giải pháp:**
- Đảm bảo thư mục `app_details` tồn tại
- Kiểm tra cấu trúc: `ls app_details/`

### 3. Lỗi out of memory

```
MemoryError: ...
```

**Giải pháp:**
- Giảm batch size: `batch_size=50`
- Tăng RAM cho Python

### 4. Lỗi permission

```
PermissionError: [Errno 13] Permission denied
```

**Giải pháp:**
- Chạy với quyền administrator (Windows)
- Hoặc: `sudo python import_games_to_db.py` (Linux/Mac)

## 📝 Logs

Logs được lưu trong `logs/`:

```
logs/
├── import_games_20250114_153045.log
├── import_games_20250114_163212.log
└── ...
```

Xem log:
```bash
# Windows
type logs\import_games_20250114_153045.log

# Linux/Mac
cat logs/import_games_20250114_153045.log
```

## 🔄 Re-import hoặc Update

Để cập nhật dữ liệu:

1. **Update một số games:**
   - Thêm/sửa file JSON mới
   - Chạy lại script (tự động upsert)

2. **Re-import toàn bộ:**
   ```javascript
   // Drop collection
   db.games.drop()
   ```
   ```bash
   # Import lại
   python import_games_to_db.py
   ```

## 📚 Tài liệu liên quan

- [game-service-database-schema.md](../docs/03-backend/database/GAME-SERVICE/game-service-database-schema.md) - Schema chi tiết
- [IMPORT_GAMES_README.md](IMPORT_GAMES_README.md) - Hướng dẫn chi tiết
- [Steam API Documentation](https://partner.steamgames.com/doc/webapi) - API reference

## 🎉 Hoàn thành!

Sau khi import thành công, bạn có thể:

1. **Sử dụng trong Game Service:**
   ```javascript
   // Node.js/Express
   const games = await Game.find({ type: 'game' }).limit(10);
   ```

2. **Tạo API endpoints:**
   - GET /api/games
   - GET /api/games/:id
   - GET /api/games/search?q=...

3. **Tích hợp với Frontend:**
   - Hiển thị danh sách games
   - Tìm kiếm và filter
   - Chi tiết game

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Xem logs: `logs/import_games_*.log`
2. Chạy check: `python check_before_import.py`
3. Test với một vài games trước
4. Kiểm tra MongoDB logs

---

**Made with ❤️ for Steam Games Database**
