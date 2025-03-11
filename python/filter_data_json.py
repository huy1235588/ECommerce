import json

# Đường dẫn tới các file
json_input_file = 'server/json/data-20250311/data.json'
txt_input_file = 'server/json/data-20250311/logs/success.txt'
json_output_file = 'python/json/filtered_data.json'

# Đọc file txt chứa các id, giả sử các id được phân tách bằng ",\n"
with open(txt_input_file, 'r', encoding='utf-8') as f:
    content = f.read()
    # Tách các id và loại bỏ các khoảng trắng thừa
    id_list = [item.strip() for item in content.split(',\n') if item.strip()]

# Đọc file json chứa mảng các đối tượng
with open(json_input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Lọc các đối tượng có thuộc tính appId khớp với các id trong danh sách
filtered_data = [obj for obj in data if str(obj.get("appId")) in id_list]

# Ghi mảng đối tượng còn lại vào file json mới
with open(json_output_file, 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=4)

print(f"Đã ghi dữ liệu đã lọc vào {json_output_file}")