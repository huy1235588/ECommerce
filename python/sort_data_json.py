import json

def main(txt_file, json_file, output_file):
    # Đọc file txt chứa danh sách các id, phân tách bởi ",\n"
    with open(txt_file, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    # Tách các id và loại bỏ khoảng trắng thừa
    id_order = [item.strip() for item in content.split(',\n') if item.strip()]

    # Tạo dictionary ánh xạ id -> vị trí (để dùng sắp xếp)
    order_mapping = {id_val: idx for idx, id_val in enumerate(id_order)}

    # Đọc file json chứa mảng đối tượng
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Sắp xếp mảng đối tượng theo thứ tự của appId theo file txt
    # Nếu appId không tồn tại trong order_mapping thì xếp cuối
    sorted_data = sorted(
        data,
        key=lambda item: order_mapping.get(str(item.get('appId')), len(id_order))
    )

    # Ghi kết quả ra file json mới
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    txt_file = 'server/json/data-20250311/logs/success.txt'
    json_file = 'python/json/filtered_data.json'
    output_file = 'python/json/sorted_data.json'
    main(txt_file, json_file, output_file)
