import json
import sys
from pathlib import Path
from collections import defaultdict, Counter

class SteamFieldsAnalyzer:
    """
    Lớp phân tích các field trong dữ liệu Steam app details.
    Tương tự như SteamDataProcessor nhưng dành cho việc phân tích.
    """

    def __init__(self, script_dir: Path):
        """
        Khởi tạo analyzer với thư mục gốc.
        """
        self.script_dir = script_dir
        self.app_details_dir = script_dir / "app_details"
        self.analysis_dir = script_dir / "analysis_results"

        # Đảm bảo thư mục tồn tại
        self.analysis_dir.mkdir(exist_ok=True)

    def analyze_json_fields(self, root_dir: Path):
        """
        Phân tích tất cả các field trong các file JSON của Steam app details
        """
        all_fields = set()
        field_counter = Counter()
        total_files = 0
        error_files = 0

        # Tìm tất cả file JSON trong thư mục app_details
        json_files = list(root_dir.rglob("app_details_*.json"))

        print(f"Tìm thấy {len(json_files)} file JSON")

        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                total_files += 1

                # Duyệt qua từng app trong file
                for app_id, app_data in data.items():
                    if 'data' in app_data:
                        game_data = app_data['data']

                        # Thu thập tất cả keys/field names
                        def collect_keys(obj, prefix=""):
                            if isinstance(obj, dict):
                                for key, value in obj.items():
                                    full_key = f"{prefix}.{key}" if prefix else key
                                    all_fields.add(full_key)
                                    field_counter[full_key] += 1
                                    collect_keys(value, full_key)
                            elif isinstance(obj, list):
                                for item in obj:
                                    collect_keys(item, prefix)

                        collect_keys(game_data)

            except Exception as e:
                error_files += 1
                print(f"Lỗi xử lý file {json_file}: {e}")

        print(f"\nĐã xử lý thành công: {total_files} files")
        print(f"Lỗi: {error_files} files")

        return all_fields, field_counter

    def save_analysis_results(self, all_fields, field_counter):
        """
        Lưu kết quả phân tích vào file
        """
        # Lưu danh sách tất cả fields
        with open(self.analysis_dir / "all_fields.txt", 'w', encoding='utf-8') as f:
            f.write("Danh sách tất cả các field trong Steam app details:\n")
            f.write("=" * 50 + "\n\n")
            for field in sorted(all_fields):
                f.write(f"{field}\n")

        # Lưu thống kê tần suất
        with open(self.analysis_dir / "field_statistics.csv", 'w', encoding='utf-8') as f:
            f.write("Field,Count,Percentage\n")
            total_games = max(field_counter.values()) if field_counter else 0

            for field, count in sorted(field_counter.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / total_games * 100) if total_games > 0 else 0
                f.write(f'"{field}",{count},{percentage:.2f}%\n')

        # Phân tích theo cấp độ
        level_analysis = defaultdict(set)
        for field in all_fields:
            level = len(field.split('.'))
            level_analysis[level].add(field)

        with open(self.analysis_dir / "field_levels.txt", 'w', encoding='utf-8') as f:
            f.write("Phân tích field theo cấp độ nesting:\n")
            f.write("=" * 40 + "\n\n")

            for level in sorted(level_analysis.keys()):
                f.write(f"Cấp độ {level}: {len(level_analysis[level])} fields\n")
                for field in sorted(level_analysis[level]):
                    f.write(f"  {field}\n")
                f.write("\n")

    def run_analysis(self, target_dir: Path = None):
        """
        Chạy phân tích trên thư mục được chỉ định hoặc thư mục app_details mặc định
        """
        if target_dir is None:
            target_dir = self.app_details_dir

        if not target_dir.exists():
            print(f"Thư mục {target_dir} không tồn tại!")
            return

        print(f"Bắt đầu phân tích các field trong Steam app details từ: {target_dir}")

        # Phân tích
        all_fields, field_counter = self.analyze_json_fields(target_dir)

        print(f"\nTổng số unique fields: {len(all_fields)}")

        # Lưu kết quả
        self.save_analysis_results(all_fields, field_counter)

        print(f"\nKết quả đã được lưu vào thư mục: {self.analysis_dir}")
        print("- all_fields.txt: Danh sách tất cả fields")
        print("- field_statistics.csv: Thống kê tần suất xuất hiện")
        print("- field_levels.txt: Phân tích theo cấp độ nesting")

def main():
    """
    Hàm chính: Khởi tạo analyzer và chạy phân tích
    """
    script_dir = Path(__file__).parent
    analyzer = SteamFieldsAnalyzer(script_dir)

    # Nhận đường dẫn từ tham số dòng lệnh hoặc sử dụng mặc định
    if len(sys.argv) > 1:
        target_dir = Path(sys.argv[1])
        # Xử lý đường dẫn tuyệt đối nếu bắt đầu bằng /
        if str(target_dir).startswith('/'):
            if sys.platform == 'win32':
                path_str = str(target_dir).lstrip('/')
                target_dir = Path(path_str)
    else:
        target_dir = None  # Sử dụng mặc định

    analyzer.run_analysis(target_dir)

if __name__ == "__main__":
    main()