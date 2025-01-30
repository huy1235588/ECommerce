import json
import glob

# Đọc danh sách appId từ các file data.json
data_app_ids = {}
# Lấy tất cả các file data.json
data_files = glob.glob("server/json/data-20250128/data*.json")

# Duyệt qua tất cả các file data.json
for file in data_files:
    with open(file, "r", encoding="utf-8") as f:
        data = json.load(f)
        # Duyệt qua từng object trong file
        for item in data:
            data_app_ids[item["appId"]] = item.get("title")

# Cập nhật các file achievement.json
achievement_files = glob.glob("server/json/data-20250128/achievement*.json")
# Tạo một set chứa tất cả appId từ các file achievement.json
achievement_dict = {}

# Thêm các appId còn thiếu vào file achievement.json
for file in achievement_files:
    with open(file, "r", encoding="utf-8") as f:
        achievements = json.load(f)

    # Chuyển danh sách thành dictionary với key là appId
    achievement_dict.update({item["appId"]: item for item in achievements})

    # Ghi lại file mởi sau khi cập nhật
    new_file = file.replace("server/json/data-20250128", "python/json")
    with open(new_file, "w", encoding="utf-8") as f:
        json.dump(achievements, f, indent=4)


# Tìm các appId còn thiếu
missing = set(data_app_ids.keys()) - set(achievement_dict.keys())
missing_app_ids = list(missing)

# Ghi dabnh sách appId còn thiếu vào file cuối cùng
if achievement_files:
    with open(achievement_files[-1], "r", encoding="utf-8") as f:
        achievements = json.load(f)

    for app_id in missing_app_ids:
        achievements.append(
            {"appId": app_id, "title": data_app_ids.get(app_id), "achievement": None}
        )

    last_file = achievement_files[-1].replace(
        "server/json/data-20250128", "python/json"
    )

    with open(last_file, "w", encoding="utf-8") as f:
        json.dump(achievements, f, indent=4, ensure_ascii=False)

print("Cập nhật hoàn tất!")
