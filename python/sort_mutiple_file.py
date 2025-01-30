import json
import math
import os


# Đọc dữ liệu từ file JSON
def read_json(filename):
    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)


# Lưu dữ liệu đã chia vào file JSON
def write_json(filename, data):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


# Hàm sắp xếp appId và chia thành 4 file
def process_json_files(input_files, output_prefix, max_size=1000):
    all_data = []

    # Đọc và gộp dữ liệu từ nhiều file
    for filename in input_files:
        all_data.extend(read_json(filename))

    # Sắp xếp danh sách theo appId
    sorted_data = sorted(all_data, key=lambda x: x["appId"])

    # Chia danh sách thành các file con
    num_files = math.ceil(len(sorted_data) / max_size)  # Tính số file cần thiết
    for i in range(num_files):
        start = i * max_size
        end = start + max_size
        chunk = sorted_data[start:end]  # Cắt dữ liệu theo từng phần nhỏ

        # Bắt đầu bằng 0
        output_filename = f"{output_prefix}{i}.json"
        write_json(output_filename, chunk)
        print(f"Đã ghi {len(chunk)} object vào {output_filename}")


# Danh sách các file JSON
json_files = [
    "server/json/data-20250128/data0.json",
    "server/json/data-20250128/data1.json",
    "server/json/data-20250128/data2.json",
    "server/json/data-20250128/data3.json",
]

# Language
language_json_files = [
    "server/json/data-20250128/language0.json",
    "server/json/data-20250128/language1.json",
    "server/json/data-20250128/language2.json",
    "server/json/data-20250128/language3.json",
]

# Achievements
achievements_json_files = [
    "server/json/data-20250128/achievement0.json",
    "server/json/data-20250128/achievement1.json",
    "server/json/data-20250128/achievement2.json",
    "server/json/data-20250128/achievement3.json",
]

# Thư mục chứa dữ liệu đã sắp xếp
folder = "server/json/sorted/data-20250128"

# Tạo thư mục nếu chưa tồn tại
os.makedirs(folder, exist_ok=True)

# Sắp xếp và chia dữ liệu thành các file
process_json_files(json_files, f"{folder}/data", max_size=1000)
process_json_files(language_json_files, f"{folder}/language", max_size=1000)
# process_json_files(achievements_json_files, f"{folder}/achievement", max_size=1000)

achievements_json = [
    "python/json/achievement0.json",
    "python/json/achievement1.json",
    "python/json/achievement2.json",
    "python/json/achievement3.json",
]

process_json_files(achievements_json, f"{folder}/achievement", max_size=1000)
