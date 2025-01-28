import json

def get_app_ids_with_null_title(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    app_ids = [item['appId'] for item in data if item.get('title') is None]
    return app_ids

# Example usage
if __name__ == "__main__":
    list_file =[
        'server/json/data-20250128/data0.json',
        'server/json/data-20250128/data1.json',
        'server/json/data-20250128/data2.json',
        'server/json/data-20250128/data3.json'
    ]
    with open('python/ids/ids_title_null.txt', 'w', encoding='utf-8') as file:
        for json_file_path in list_file:
            app_ids = get_app_ids_with_null_title(json_file_path)
            # Ghi vào file txt
            for app_id in app_ids:
                file.write(f"{app_id},\n")