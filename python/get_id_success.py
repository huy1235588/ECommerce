import json


# Hàm để đọc dữ liệu JSON và ghi id vào file TXT
def extract_ids_to_txt(json_files, output_file):
    ids = []

    # Đọc các file JSON và lấy giá trị của 'id'
    for json_file in json_files:
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                if "appId" in item:
                    ids.append(str(item["appId"]))

    # Ghi các giá trị id vào file TXT
    with open(output_file, "w", encoding="utf-8") as f:
        for id_value in ids:
            f.write(id_value + ",\n")


# Danh sách các file JSON và file TXT đầu ra
json_folder = "server/json/data-20250126"
json_files = [f"{json_folder}/data.json", f"{json_folder}/data1.json"]
output_file = "server/json/data-20250126/logs/id_success.txt"

# Chạy hàm
extract_ids_to_txt(json_files, output_file)
