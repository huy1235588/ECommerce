import os
from pathlib import Path
import re

def update_logs():
    """
    Script để update các file log dựa trên thư mục app_details.
    Quét các file JSON trong thư mục để cập nhật success_ids.txt, failed_ids.txt, và fetched_ids.txt.
    success_ids từ app_details (loại trừ errors), fetched_ids từ tất cả app_details, failed_ids = fetched_ids - success_ids.
    """
    script_dir = Path(__file__).parent
    logs_dir = script_dir / "logs"
    app_details_dir = script_dir / "app_details"
    
    success_file = logs_dir / "success_ids.txt"
    failed_file = logs_dir / "failed_ids.txt"
    fetched_file = logs_dir / "fetched_ids.txt"
    
    # Khởi tạo sets cho các ID
    success_ids = set()
    fetched_ids = set()
    
    # Pattern để match tên file: app_details_{app_id}.json
    pattern = re.compile(r'app_details_(\d+)\.json')
    
    # Quét thư mục app_details (không bao gồm errors) để lấy success_ids
    if app_details_dir.exists():
        for root, dirs, files in os.walk(app_details_dir):
            # Bỏ qua thư mục errors
            if 'errors' in Path(root).parts:
                continue
            for file in files:
                match = pattern.match(file)
                if match:
                    app_id = match.group(1)
                    success_ids.add(app_id)
    
    # Quét tất cả thư mục app_details (bao gồm errors) để lấy fetched_ids
    if app_details_dir.exists():
        for root, dirs, files in os.walk(app_details_dir):
            for file in files:
                match = pattern.match(file)
                if match:
                    app_id = match.group(1)
                    fetched_ids.add(app_id)
    
    # failed_ids là fetched_ids loại trừ success_ids
    failed_ids = fetched_ids - success_ids
    
    # Sort theo thứ tự số
    sorted_success = sorted(success_ids, key=int)
    sorted_failed = sorted(failed_ids, key=int)
    sorted_fetched = sorted(fetched_ids, key=int)
    
    # Ghi success_ids.txt
    with open(success_file, 'w', encoding='utf-8') as f:
        for app_id in sorted_success:
            f.write(f"{app_id}\n")
    
    # Ghi failed_ids.txt
    with open(failed_file, 'w', encoding='utf-8') as f:
        for app_id in sorted_failed:
            f.write(f"{app_id}\n")
    
    # Ghi fetched_ids.txt
    with open(fetched_file, 'w', encoding='utf-8') as f:
        for app_id in sorted_fetched:
            f.write(f"{app_id}\n")
    
    print(f"Đã update logs:")
    print(f"  success_ids.txt: {len(sorted_success)} ID")
    print(f"  failed_ids.txt: {len(sorted_failed)} ID")
    print(f"  fetched_ids.txt: {len(sorted_fetched)} ID")

if __name__ == "__main__":
    update_logs()