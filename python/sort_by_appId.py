import json


def sort_json_by_app_id(input_file, output_file):
    try:
        # Đọc dữ liệu từ file JSON
        with open(input_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Kiểm tra xem dữ liệu có phải là danh sách không
        if not isinstance(data, list):
            raise ValueError("JSON data is not a list of objects.")

        # Sắp xếp dữ liệu theo cột `appId`
        sorted_data = sorted(data, key=lambda x: x.get("appId", ""))

        # Ghi dữ liệu đã sắp xếp vào file mới
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=4)

        print(f"File has been sorted and saved to {output_file}.")
    except FileNotFoundError:
        print(f"File not found: {input_file}")
    except ValueError as e:
        print(f"Error processing JSON: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# Sử dụng hàm
input_file = "server/json/data-20250118/achievement.json"  # Đường dẫn đến file JSON gốc
output_file = "python/achievement.json"  # Đường dẫn đến file JSON đã sắp xếp
sort_json_by_app_id(input_file, output_file)
