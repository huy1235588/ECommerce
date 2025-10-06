import requests
import json
import sys
from pathlib import Path

# Constants - Các hằng số cấu hình
API_URL_TEMPLATE = "https://store.steampowered.com/api/appdetails?appids={app_id}"
SUBDIR_GROUP_SIZE = 1000

class SteamDataProcessor:
    """
    Lớp xử lý dữ liệu từ Steam API.
    Quản lý việc fetch dữ liệu ứng dụng, lưu file, và ghi log.
    """
    def __init__(self, script_dir: Path):
        """
        Khởi tạo processor với thư mục gốc.
        Tạo các thư mục cần thiết nếu chưa có.
        """
        self.script_dir = script_dir
        self.logs_dir = script_dir / "logs"
        self.app_details_dir = script_dir / "app_details"
        self.errors_dir = self.app_details_dir / "errors"
        
        # Đường dẫn file log
        self.fetched_ids_file = self.logs_dir / "fetched_ids.txt"
        self.success_ids_file = self.logs_dir / "success_ids.txt"
        self.failed_ids_file = self.logs_dir / "failed_ids.txt"
        
        # Đảm bảo thư mục tồn tại
        self.logs_dir.mkdir(exist_ok=True)
        self.app_details_dir.mkdir(exist_ok=True)
        self.errors_dir.mkdir(exist_ok=True)
    
    def fetch_app_details(self, app_id: str):
        """
        Lấy dữ liệu chi tiết ứng dụng từ Steam API.
        Trả về dữ liệu JSON hoặc None nếu lỗi.
        """
        url = API_URL_TEMPLATE.format(app_id=app_id)
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Lỗi khi lấy dữ liệu cho app_id {app_id}: {e}")
            return None
    
    def save_to_file(self, data, filename: Path):
        """
        Lưu dữ liệu JSON vào file.
        """
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Dữ liệu đã lưu vào {filename}")
    
    def get_subdir(self, app_id: str) -> str:
        """
        Tính tên thư mục con dựa trên app_id (nhóm 1000 ID).
        """
        app_id_int = int(app_id)
        start = ((app_id_int - 1) // SUBDIR_GROUP_SIZE) * SUBDIR_GROUP_SIZE + 1
        end = start + SUBDIR_GROUP_SIZE - 1
        return f"{start}-{end}"
    
    def read_ids_from_file(self, filename: Path):
        """
        Đọc danh sách ID từ file.
        Trả về list các ID hoặc [] nếu file không tồn tại.
        """
        if not filename.exists():
            print(f"File {filename} không tồn tại.")
            return []
        with open(filename, 'r') as f:
            return [line.strip() for line in f if line.strip()]
    
    def load_fetched_ids(self):
        """
        Tải danh sách ID đã xử lý vào set.
        """
        return set(self.read_ids_from_file(self.fetched_ids_file))
    
    def log_id(self, app_id: str, log_file: Path):
        """
        Ghi ID vào file log.
        """
        with open(log_file, "a") as f:
            f.write(f"{app_id}\n")
    
    def process_app_id(self, app_id: str, fetched_ids: set):
        """
        Xử lý một app_id: fetch dữ liệu, lưu file, ghi log.
        """
        if app_id in fetched_ids:
            print(f"ID {app_id} đã được xử lý, bỏ qua.")
            return
        
        data = self.fetch_app_details(app_id)
        if data and app_id in data:
            success = data[app_id].get("success", False)
            if success:
                subdir = self.app_details_dir / self.get_subdir(app_id)
                log_file = self.success_ids_file
            else:
                subdir = self.errors_dir
                log_file = self.failed_ids_file
            
            subdir.mkdir(exist_ok=True)
            filename = subdir / f"app_details_{app_id}.json"
            self.save_to_file(data, filename)
            self.log_id(app_id, log_file)
        else:
            self.log_id(app_id, self.failed_ids_file)
            print(f"Không có dữ liệu cho app_id {app_id}")
        
        # Luôn ghi vào fetched_ids
        self.log_id(app_id, self.fetched_ids_file)
        fetched_ids.add(app_id)

def main():
    """
    Hàm chính: Khởi tạo processor và xử lý danh sách ID.
    """
    script_dir = Path(__file__).parent
    processor = SteamDataProcessor(script_dir)
    
    ids_file = script_dir / "ids.txt"
    app_ids = processor.read_ids_from_file(ids_file)
    if not app_ids:
        print("Không tìm thấy app ID nào trong file.")
        sys.exit(1)
    
    fetched_ids = processor.load_fetched_ids()
    
    for app_id in app_ids:
        processor.process_app_id(app_id, fetched_ids)

if __name__ == "__main__":
    main()
