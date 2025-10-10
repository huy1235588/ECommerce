import json
import sys
from pathlib import Path
from collections import defaultdict, Counter
from typing import Dict, Set, Any, Tuple, List
from datetime import datetime

class SteamFieldsAnalyzer:
    """
    Lớp phân tích các field trong dữ liệu Steam app details.
    Tối ưu hóa cho việc thiết kế schema NoSQL (MongoDB/DynamoDB).
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
        
        # Thêm các cấu trúc dữ liệu để phân tích chi tiết
        self.field_types = defaultdict(Counter)  # Theo dõi kiểu dữ liệu
        self.field_samples = defaultdict(list)   # Lưu mẫu dữ liệu
        self.array_fields = defaultdict(dict)    # Phân tích array fields
        self.nested_objects = defaultdict(set)   # Phân tích nested objects
        self.field_cardinality = defaultdict(set)  # Độ phân tán của dữ liệu
        self.field_size_stats = defaultdict(list)  # Thống kê kích thước
        
        # Cấu trúc dữ liệu riêng cho SteamSpy
        self.steamspy_fields = set()
        self.steamspy_field_counter = Counter()
        self.steamspy_tags = Counter()  # Thống kê tags
        self.steamspy_languages = Counter()  # Thống kê languages
        self.steamspy_positive_ratings = []  # Lưu positive ratings
        self.steamspy_negative_ratings = []  # Lưu negative ratings
        self.steamspy_owners_ranges = Counter()  # Thống kê owners ranges

    def get_value_type(self, value: Any) -> str:
        """Xác định kiểu dữ liệu chi tiết của value"""
        if value is None:
            return "null"
        elif isinstance(value, bool):
            return "boolean"
        elif isinstance(value, int):
            return "integer"
        elif isinstance(value, float):
            return "float"
        elif isinstance(value, str):
            return "string"
        elif isinstance(value, list):
            return "array"
        elif isinstance(value, dict):
            return "object"
        else:
            return "unknown"
    
    def get_value_size(self, value: Any) -> int:
        """Tính kích thước ước lượng của value (bytes)"""
        if isinstance(value, str):
            return len(value.encode('utf-8'))
        elif isinstance(value, (list, dict)):
            return len(json.dumps(value, ensure_ascii=False).encode('utf-8'))
        else:
            return len(str(value).encode('utf-8'))

    def analyze_steamspy_data(self, steamspy_data: dict):
        """
        Phân tích chi tiết dữ liệu SteamSpy
        """
        if not steamspy_data:
            return
            
        # Thu thập fields
        def collect_steamspy_keys(obj, prefix=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    full_key = f"steamspy.{prefix}.{key}" if prefix else f"steamspy.{key}"
                    self.steamspy_fields.add(full_key)
                    self.steamspy_field_counter[full_key] += 1
                    
                    # Phân tích đặc biệt cho từng field
                    if key == "tags" and isinstance(value, dict):
                        # Phân tích tags
                        for tag_name, tag_count in value.items():
                            self.steamspy_tags[tag_name] += tag_count
                    elif key == "languages" and isinstance(value, str):
                        # Phân tích languages
                        langs = [lang.strip() for lang in value.split(',')]
                        for lang in langs:
                            self.steamspy_languages[lang] += 1
                    elif key == "positive" and isinstance(value, int):
                        self.steamspy_positive_ratings.append(value)
                    elif key == "negative" and isinstance(value, int):
                        self.steamspy_negative_ratings.append(value)
                    elif key == "owners" and isinstance(value, str):
                        self.steamspy_owners_ranges[value] += 1
                    
                    # Đệ quy cho nested objects
                    if isinstance(value, dict):
                        collect_steamspy_keys(value, key)
        
        collect_steamspy_keys(steamspy_data)

    def analyze_json_fields(self, root_dir: Path):
        """
        Phân tích chi tiết tất cả các field trong các file JSON
        """
        all_fields = set()
        field_counter = Counter()
        total_files = 0
        error_files = 0
        total_games = 0

        # Tìm tất cả file JSON trong thư mục
        json_files = list(root_dir.rglob("*.json"))

        print(f"Tìm thấy {len(json_files)} file JSON")

        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                total_files += 1

                # Check if this is a single app file or multiple apps file
                if 'success' in data and 'data' in data:
                    # Single app file
                    app_data = data
                    if app_data.get('success'):
                        game_data = app_data['data']
                        total_games += 1

                        # Phân tích SteamSpy data nếu có
                        if 'steamspy' in app_data:
                            self.analyze_steamspy_data(app_data['steamspy'])

                        # Thu thập và phân tích keys/field names
                        def collect_keys(obj, prefix="", parent_type=""):
                            if isinstance(obj, dict):
                                for key, value in obj.items():
                                    full_key = f"{prefix}.{key}" if prefix else key
                                    all_fields.add(full_key)
                                    field_counter[full_key] += 1
                                    
                                    # Phân tích kiểu dữ liệu
                                    value_type = self.get_value_type(value)
                                    self.field_types[full_key][value_type] += 1
                                    
                                    # Lưu mẫu dữ liệu (tối đa 5 mẫu)
                                    if len(self.field_samples[full_key]) < 5:
                                        if value_type not in ["array", "object"]:
                                            self.field_samples[full_key].append(value)
                                    
                                    # Phân tích cardinality
                                    if value_type in ["string", "integer", "boolean"]:
                                        self.field_cardinality[full_key].add(str(value))
                                    
                                    # Thống kê kích thước
                                    size = self.get_value_size(value)
                                    self.field_size_stats[full_key].append(size)
                                    
                                    # Phân tích array fields
                                    if isinstance(value, list):
                                        self.array_fields[full_key]['count'] = self.array_fields[full_key].get('count', 0) + 1
                                        self.array_fields[full_key]['lengths'] = self.array_fields[full_key].get('lengths', [])
                                        self.array_fields[full_key]['lengths'].append(len(value))
                                        
                                        # Phân tích kiểu dữ liệu trong array
                                        if value and 'item_types' not in self.array_fields[full_key]:
                                            self.array_fields[full_key]['item_types'] = Counter()
                                        
                                        for item in value:
                                            item_type = self.get_value_type(item)
                                            self.array_fields[full_key]['item_types'][item_type] += 1
                                    
                                    # Phân tích nested objects
                                    if isinstance(value, dict):
                                        nested_keys = set(value.keys())
                                        self.nested_objects[full_key].update(nested_keys)
                                    
                                    # Đệ quy
                                    collect_keys(value, full_key, value_type)
                                    
                            elif isinstance(obj, list):
                                for item in obj:
                                    collect_keys(item, prefix, "array_item")

                        collect_keys(game_data)
                else:
                    # Multiple apps file
                    for app_id, app_data in data.items():
                        if 'data' in app_data and app_data.get('success'):
                            game_data = app_data['data']
                            total_games += 1

                            # Phân tích SteamSpy data nếu có
                            if 'steamspy' in app_data:
                                self.analyze_steamspy_data(app_data['steamspy'])

                            collect_keys(game_data)

            except Exception as e:
                error_files += 1
                print(f"Lỗi xử lý file {json_file}: {e}")

        print(f"\nĐã xử lý thành công: {total_files} files")
        print(f"Tổng số games phân tích: {total_games}")
        print(f"Lỗi: {error_files} files")

        return all_fields, field_counter, total_games

    def save_analysis_results(self, all_fields, field_counter, total_games):
        """
        Lưu kết quả phân tích chi tiết vào nhiều file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 1. Lưu danh sách tất cả fields
        with open(self.analysis_dir / "all_fields.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("DANH SÁCH TẤT CẢ CÁC FIELD TRONG STEAM APP DETAILS\n")
            f.write(f"Phân tích lúc: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Tổng số games: {total_games}\n")
            f.write("=" * 80 + "\n\n")
            for field in sorted(all_fields):
                f.write(f"{field}\n")

        # 2. Lưu thống kê tần suất và kiểu dữ liệu (CSV)
        with open(self.analysis_dir / "field_statistics.csv", 'w', encoding='utf-8') as f:
            f.write("Field,Count,Percentage,Data_Types,Primary_Type,Is_Required,Cardinality,Avg_Size_Bytes\n")

            for field, count in sorted(field_counter.items(), key=lambda x: x[1], reverse=True):
                percentage = (count / total_games * 100) if total_games > 0 else 0
                
                # Kiểu dữ liệu
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                types_str = "|".join([f"{k}:{v}" for k, v in types.items()])
                
                # Xác định field bắt buộc (xuất hiện > 90%)
                is_required = "Yes" if percentage > 90 else "No"
                
                # Cardinality
                cardinality = len(self.field_cardinality.get(field, set()))
                
                # Kích thước trung bình
                sizes = self.field_size_stats.get(field, [])
                avg_size = sum(sizes) / len(sizes) if sizes else 0
                
                f.write(f'"{field}",{count},{percentage:.2f},{types_str},{primary_type},{is_required},{cardinality},{avg_size:.2f}\n')

        # 3. Phân tích theo cấp độ nesting
        level_analysis = defaultdict(set)
        for field in all_fields:
            level = len(field.split('.'))
            level_analysis[level].add(field)

        with open(self.analysis_dir / "field_levels.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("PHÂN TÍCH FIELD THEO CẤP ĐỘ NESTING\n")
            f.write("=" * 80 + "\n\n")

            for level in sorted(level_analysis.keys()):
                f.write(f"\nCấp độ {level}: {len(level_analysis[level])} fields\n")
                f.write("-" * 40 + "\n")
                for field in sorted(level_analysis[level]):
                    count = field_counter[field]
                    percentage = (count / total_games * 100) if total_games > 0 else 0
                    f.write(f"  {field} ({percentage:.1f}%)\n")

        # 4. Phân tích Array Fields
        with open(self.analysis_dir / "array_fields_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("PHÂN TÍCH CHI TIẾT CÁC ARRAY FIELDS\n")
            f.write("=" * 80 + "\n\n")
            
            for field in sorted(self.array_fields.keys()):
                info = self.array_fields[field]
                lengths = info.get('lengths', [])
                
                f.write(f"\n{field}\n")
                f.write("-" * 40 + "\n")
                f.write(f"  Xuất hiện: {info.get('count', 0)} lần\n")
                
                if lengths:
                    f.write(f"  Độ dài array:\n")
                    f.write(f"    - Min: {min(lengths)}\n")
                    f.write(f"    - Max: {max(lengths)}\n")
                    f.write(f"    - Avg: {sum(lengths)/len(lengths):.2f}\n")
                
                if 'item_types' in info:
                    f.write(f"  Kiểu dữ liệu trong array:\n")
                    for item_type, count in info['item_types'].most_common():
                        f.write(f"    - {item_type}: {count}\n")

        # 5. Phân tích Nested Objects
        with open(self.analysis_dir / "nested_objects_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("PHÂN TÍCH CÁC NESTED OBJECTS\n")
            f.write("=" * 80 + "\n\n")
            
            for field in sorted(self.nested_objects.keys()):
                nested_keys = self.nested_objects[field]
                if nested_keys:
                    f.write(f"\n{field}\n")
                    f.write("-" * 40 + "\n")
                    f.write(f"  Số lượng keys: {len(nested_keys)}\n")
                    f.write(f"  Keys:\n")
                    for key in sorted(nested_keys):
                        f.write(f"    - {key}\n")

        # 6. Đề xuất Schema NoSQL (MongoDB)
        self.generate_nosql_schema_suggestions(all_fields, field_counter, total_games)
        
        # 7. Lưu mẫu dữ liệu
        with open(self.analysis_dir / "field_samples.json", 'w', encoding='utf-8') as f:
            samples = {field: values for field, values in self.field_samples.items() if values}
            json.dump(samples, f, indent=2, ensure_ascii=False)

        # 8. Phân tích SteamSpy data
        self.save_steamspy_analysis(total_games)

    def save_steamspy_analysis(self, total_games: int):
        """
        Lưu kết quả phân tích SteamSpy vào các file riêng
        """
        if not self.steamspy_fields:
            return
            
        # 1. SteamSpy fields overview
        with open(self.analysis_dir / "steamspy_fields.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("STEAMSPY FIELDS ANALYSIS\n")
            f.write(f"Phân tích lúc: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Tổng số games có SteamSpy data: {len(self.steamspy_positive_ratings)}\n")
            f.write("=" * 80 + "\n\n")
            for field in sorted(self.steamspy_fields):
                count = self.steamspy_field_counter[field]
                percentage = (count / total_games * 100) if total_games > 0 else 0
                f.write(f"{field} ({percentage:.1f}%)\n")

        # 2. Tags analysis
        with open(self.analysis_dir / "steamspy_tags_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("STEAMSPY TAGS ANALYSIS\n")
            f.write("=" * 80 + "\n\n")
            
            total_tag_usage = sum(self.steamspy_tags.values())
            f.write(f"Tổng số tags được sử dụng: {len(self.steamspy_tags)}\n")
            f.write(f"Tổng số lượt tag: {total_tag_usage}\n\n")
            
            f.write("Top 50 tags phổ biến nhất:\n")
            f.write("-" * 50 + "\n")
            for i, (tag, count) in enumerate(self.steamspy_tags.most_common(50), 1):
                percentage = (count / total_tag_usage * 100) if total_tag_usage > 0 else 0
                f.write(f"{i:2d}. {tag:<25} {count:>6} ({percentage:>5.1f}%)\n")

        # 3. Languages analysis
        with open(self.analysis_dir / "steamspy_languages_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("STEAMSPY LANGUAGES ANALYSIS\n")
            f.write("=" * 80 + "\n\n")
            
            total_lang_usage = sum(self.steamspy_languages.values())
            f.write(f"Tổng số ngôn ngữ: {len(self.steamspy_languages)}\n")
            f.write(f"Tổng số lượt ngôn ngữ: {total_lang_usage}\n\n")
            
            f.write("Ngôn ngữ phổ biến nhất:\n")
            f.write("-" * 40 + "\n")
            for i, (lang, count) in enumerate(self.steamspy_languages.most_common(20), 1):
                percentage = (count / total_lang_usage * 100) if total_lang_usage > 0 else 0
                f.write(f"{i:2d}. {lang:<25} {count:>6} ({percentage:>5.1f}%)\n")

        # 4. Ratings analysis
        with open(self.analysis_dir / "steamspy_ratings_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("STEAMSPY RATINGS ANALYSIS\n")
            f.write("=" * 80 + "\n\n")
            
            if self.steamspy_positive_ratings:
                f.write(f"Số games có dữ liệu ratings: {len(self.steamspy_positive_ratings)}\n\n")
                
                # Positive ratings stats
                pos_ratings = self.steamspy_positive_ratings
                f.write("POSITIVE RATINGS:\n")
                f.write("-" * 30 + "\n")
                f.write(f"  Min: {min(pos_ratings):,}\n")
                f.write(f"  Max: {max(pos_ratings):,}\n")
                f.write(f"  Avg: {sum(pos_ratings)/len(pos_ratings):,.0f}\n")
                f.write(f"  Median: {sorted(pos_ratings)[len(pos_ratings)//2]:,}\n")
                f.write(f"  Total: {sum(pos_ratings):,}\n\n")
                
                # Negative ratings stats
                neg_ratings = self.steamspy_negative_ratings
                f.write("NEGATIVE RATINGS:\n")
                f.write("-" * 30 + "\n")
                f.write(f"  Min: {min(neg_ratings):,}\n")
                f.write(f"  Max: {max(neg_ratings):,}\n")
                f.write(f"  Avg: {sum(neg_ratings)/len(neg_ratings):,.0f}\n")
                f.write(f"  Median: {sorted(neg_ratings)[len(neg_ratings)//2]:,}\n")
                f.write(f"  Total: {sum(neg_ratings):,}\n\n")
                
                # Rating ratios
                f.write("RATING RATIOS:\n")
                f.write("-" * 20 + "\n")
                ratios = []
                for pos, neg in zip(pos_ratings, neg_ratings):
                    total = pos + neg
                    if total > 0:
                        ratio = pos / total
                        ratios.append(ratio)
                
                if ratios:
                    f.write(f"  Positive ratio - Min: {min(ratios):.3f}, Max: {max(ratios):.3f}, Avg: {sum(ratios)/len(ratios):.3f}\n")
                
                # Distribution analysis
                f.write("\nRATING DISTRIBUTION:\n")
                f.write("-" * 25 + "\n")
                
                # Group by rating ranges
                ranges = [(0, 10), (10, 100), (100, 1000), (1000, 10000), (10000, 100000), (100000, float('inf'))]
                range_names = ["0-10", "10-100", "100-1K", "1K-10K", "10K-100K", "100K+"]
                
                for (min_val, max_val), name in zip(ranges, range_names):
                    count = sum(1 for r in pos_ratings if min_val <= r < max_val)
                    percentage = (count / len(pos_ratings) * 100) if pos_ratings else 0
                    f.write(f"  {name:<10} {count:>5} games ({percentage:>5.1f}%)\n")

        # 5. Owners analysis
        with open(self.analysis_dir / "steamspy_owners_analysis.txt", 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("STEAMSPY OWNERS ANALYSIS\n")
            f.write("=" * 80 + "\n\n")
            
            total_owners_data = sum(self.steamspy_owners_ranges.values())
            f.write(f"Tổng số games có dữ liệu owners: {total_owners_data}\n\n")
            
            f.write("Phân bố theo range:\n")
            f.write("-" * 30 + "\n")
            for owners_range, count in sorted(self.steamspy_owners_ranges.items(), 
                                            key=lambda x: self.parse_owners_range(x[0])):
                percentage = (count / total_owners_data * 100) if total_owners_data > 0 else 0
                f.write(f"  {owners_range:<20} {count:>5} games ({percentage:>5.1f}%)\n")

    def parse_owners_range(self, range_str: str) -> int:
        """
        Parse owners range string để sort
        """
        if " .. " in range_str:
            parts = range_str.split(" .. ")
            if len(parts) == 2:
                try:
                    return int(parts[0].replace(",", ""))
                except:
                    pass
        return 0

    def generate_nosql_schema_suggestions(self, all_fields, field_counter, total_games):
        """
        Tạo đề xuất schema NoSQL (MongoDB) dựa trên phân tích
        """
        with open(self.analysis_dir / "nosql_schema_suggestions.md", 'w', encoding='utf-8') as f:
            f.write("# ĐỀ XUẤT SCHEMA NoSQL CHO STEAM GAMES\n\n")
            f.write(f"*Phân tích từ {total_games} games*\n\n")
            f.write("---\n\n")
            
            # 1. Phân loại fields
            f.write("## 1. PHÂN LOẠI FIELDS\n\n")
            
            required_fields = []
            optional_fields = []
            rare_fields = []
            
            for field, count in field_counter.items():
                percentage = (count / total_games * 100) if total_games > 0 else 0
                if percentage > 90:
                    required_fields.append((field, percentage))
                elif percentage > 30:
                    optional_fields.append((field, percentage))
                else:
                    rare_fields.append((field, percentage))
            
            f.write(f"### Required Fields (>90% coverage): {len(required_fields)} fields\n\n")
            for field, pct in sorted(required_fields, key=lambda x: x[1], reverse=True):
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                f.write(f"- `{field}` ({pct:.1f}%) - Type: {primary_type}\n")
            
            f.write(f"\n### Optional Fields (30-90% coverage): {len(optional_fields)} fields\n\n")
            for field, pct in sorted(optional_fields[:20], key=lambda x: x[1], reverse=True):
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                f.write(f"- `{field}` ({pct:.1f}%) - Type: {primary_type}\n")
            
            f.write(f"\n### Rare Fields (<30% coverage): {len(rare_fields)} fields\n")
            f.write("*(Consider storing in flexible schema or separate collection)*\n\n")
            
            # 2. Đề xuất schema MongoDB
            f.write("\n## 2. ĐỀ XUẤT MONGODB SCHEMA\n\n")
            f.write("```javascript\n")
            f.write("// Collection: games\n")
            f.write("{\n")
            
            # Required fields
            level_1_required = [f for f, p in required_fields if '.' not in f]
            for field in sorted(level_1_required):
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                mongo_type = self.get_mongodb_type(primary_type)
                
                cardinality = len(self.field_cardinality.get(field, set()))
                comment = ""
                
                if cardinality > 0 and cardinality < 50:
                    comment = f" // Low cardinality ({cardinality}) - Consider enum"
                elif field in self.array_fields:
                    info = self.array_fields[field]
                    lengths = info.get('lengths', [])
                    if lengths:
                        avg_len = sum(lengths) / len(lengths)
                        comment = f" // Array (avg length: {avg_len:.1f})"
                
                f.write(f"  {field}: {mongo_type},{comment}\n")
            
            f.write("  \n  // Optional fields\n")
            level_1_optional = [field for field, p in optional_fields[:10] if '.' not in field]
            for field in sorted(level_1_optional):
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                mongo_type = self.get_mongodb_type(primary_type)
                f.write(f"  {field}?: {mongo_type},\n")
            
            f.write("}\n```\n\n")
            
            # 3. Indexes suggestions
            f.write("## 3. ĐỀ XUẤT INDEXES\n\n")
            f.write("```javascript\n")
            
            # Tìm các field có cardinality cao (tốt cho index)
            high_cardinality_fields = []
            for field in level_1_required + level_1_optional:
                if '.' not in field:
                    cardinality = len(self.field_cardinality.get(field, set()))
                    percentage = (field_counter[field] / total_games * 100) if total_games > 0 else 0
                    if cardinality > 100 and percentage > 50:
                        high_cardinality_fields.append((field, cardinality, percentage))
            
            f.write("// Single field indexes\n")
            for field, card, pct in sorted(high_cardinality_fields, key=lambda x: x[1], reverse=True)[:5]:
                f.write(f"db.games.createIndex({{ {field}: 1 }})  // Cardinality: {card}, Coverage: {pct:.1f}%\n")
            
            f.write("\n// Text search index\n")
            f.write("db.games.createIndex({ name: \"text\", short_description: \"text\" })\n")
            
            f.write("\n// Compound indexes (query patterns)\n")
            f.write("db.games.createIndex({ type: 1, release_date: -1 })\n")
            f.write("db.games.createIndex({ is_free: 1, price: 1 })\n")
            f.write("```\n\n")
            
            # 4. Normalization suggestions
            f.write("## 4. ĐỀ XUẤT NORMALIZATION\n\n")
            
            # Tìm các nested objects lớn
            large_nested = []
            for field, keys in self.nested_objects.items():
                if len(keys) > 5 and '.' not in field:
                    count = field_counter.get(field, 0)
                    percentage = (count / total_games * 100) if total_games > 0 else 0
                    large_nested.append((field, len(keys), percentage))
            
            if large_nested:
                f.write("### Các nested objects nên tách thành collection riêng:\n\n")
                for field, key_count, pct in sorted(large_nested, key=lambda x: x[1], reverse=True)[:5]:
                    f.write(f"- `{field}` ({key_count} keys, {pct:.1f}% coverage)\n")
                    f.write(f"  - Đề xuất: Tạo collection `game_{field}` với reference\n")
            
            # 5. Performance tips
            f.write("\n## 5. PERFORMANCE OPTIMIZATION TIPS\n\n")
            
            # Array fields lớn
            large_arrays = []
            for field, info in self.array_fields.items():
                lengths = info.get('lengths', [])
                if lengths and max(lengths) > 50:
                    avg_len = sum(lengths) / len(lengths)
                    large_arrays.append((field, max(lengths), avg_len))
            
            if large_arrays:
                f.write("### Large Array Fields:\n\n")
                for field, max_len, avg_len in sorted(large_arrays, key=lambda x: x[1], reverse=True)[:5]:
                    f.write(f"- `{field}`: Max length {max_len}, Avg {avg_len:.1f}\n")
                    f.write(f"  - ⚠️ Consider pagination or separate collection\n")
            
            # Fields với kích thước lớn
            f.write("\n### Large Size Fields:\n\n")
            large_fields = []
            for field, sizes in self.field_size_stats.items():
                if sizes:
                    avg_size = sum(sizes) / len(sizes)
                    max_size = max(sizes)
                    if avg_size > 1000:  # > 1KB
                        large_fields.append((field, avg_size, max_size))
            
            for field, avg_size, max_size in sorted(large_fields, key=lambda x: x[1], reverse=True)[:5]:
                f.write(f"- `{field}`: Avg {avg_size:.0f} bytes, Max {max_size:.0f} bytes\n")
                if avg_size > 10000:
                    f.write(f"  - ⚠️ Consider storing in GridFS or external storage\n")
            
            # 6. Query patterns
            f.write("\n## 6. SUGGESTED QUERY PATTERNS\n\n")
            f.write("```javascript\n")
            f.write("// Find by common filters\n")
            f.write("db.games.find({ type: 'game', is_free: false })\n\n")
            f.write("// Search by text\n")
            f.write("db.games.find({ $text: { $search: 'action adventure' } })\n\n")
            f.write("// Aggregate by categories\n")
            f.write("db.games.aggregate([\n")
            f.write("  { $unwind: '$categories' },\n")
            f.write("  { $group: { _id: '$categories.description', count: { $sum: 1 } } },\n")
            f.write("  { $sort: { count: -1 } }\n")
            f.write("])\n")
            f.write("```\n\n")
            
            # 7. Data validation schema
            f.write("## 7. MONGODB VALIDATION SCHEMA\n\n")
            f.write("```javascript\n")
            f.write("db.createCollection('games', {\n")
            f.write("  validator: {\n")
            f.write("    $jsonSchema: {\n")
            f.write("      bsonType: 'object',\n")
            f.write("      required: [" + ", ".join([f"'{f}'" for f, _ in required_fields[:5] if '.' not in f]) + "],\n")
            f.write("      properties: {\n")
            
            for field in [f for f, _ in required_fields[:5] if '.' not in f]:
                types = dict(self.field_types[field])
                primary_type = max(types.items(), key=lambda x: x[1])[0] if types else "unknown"
                bson_type = self.get_bson_type(primary_type)
                f.write(f"        {field}: {{ bsonType: '{bson_type}' }},\n")
            
            f.write("      }\n")
            f.write("    }\n")
            f.write("  }\n")
            f.write("})\n")
            f.write("```\n\n")
            
            # 8. SteamSpy Schema Suggestions
            if self.steamspy_fields:
                f.write("## 8. STEAMSPY DATA SCHEMA\n\n")
                f.write("SteamSpy cung cấp dữ liệu thống kê cộng đồng và metadata bổ sung:\n\n")
                f.write("```javascript\n")
                f.write("// SteamSpy subdocument structure\n")
                f.write("steamspy: {\n")
                f.write("  appid: Number,           // Steam App ID\n")
                f.write("  name: String,            // Game name\n")
                f.write("  developer: String,       // Developer name\n")
                f.write("  publisher: String,       // Publisher name\n")
                f.write("  score_rank: String,      // Score ranking\n")
                f.write("  positive: Number,        // Positive reviews count\n")
                f.write("  negative: Number,        // Negative reviews count\n")
                f.write("  userscore: Number,       // User score (0-100)\n")
                f.write("  owners: String,          // Owners range (e.g., '10,000,000 .. 20,000,000')\n")
                f.write("  average_forever: Number, // Average playtime forever (minutes)\n")
                f.write("  average_2weeks: Number,  // Average playtime 2 weeks (minutes)\n")
                f.write("  median_forever: Number,  // Median playtime forever (minutes)\n")
                f.write("  median_2weeks: Number,   // Median playtime 2 weeks (minutes)\n")
                f.write("  price: String,           // Price in cents (string format)\n")
                f.write("  initialprice: String,    // Initial price in cents\n")
                f.write("  discount: String,        // Current discount percentage\n")
                f.write("  ccu: Number,             // Current concurrent users\n")
                f.write("  languages: String,       // Supported languages (comma-separated)\n")
                f.write("  genre: String,           // Primary genre\n")
                f.write("  tags: {                  // User-defined tags with vote counts\n")
                
                # Show top tags as examples
                if self.steamspy_tags:
                    top_tags = self.steamspy_tags.most_common(5)
                    for tag, count in top_tags:
                        f.write(f"    '{tag}': Number,\n")
                    f.write("    // ... other tags\n")
                
                f.write("  }\n")
                f.write("}\n")
                f.write("```\n\n")
                
                # SteamSpy indexes
                f.write("### SteamSpy Indexes:\n\n")
                f.write("```javascript\n")
                f.write("// Index for rating queries\n")
                f.write("db.games.createIndex({ 'steamspy.positive': -1, 'steamspy.negative': 1 })\n\n")
                f.write("// Index for concurrent users\n")
                f.write("db.games.createIndex({ 'steamspy.ccu': -1 })\n\n")
                f.write("// Index for owners range (text search)\n")
                f.write("db.games.createIndex({ 'steamspy.owners': 1 })\n\n")
                f.write("// Compound index for popular games\n")
                f.write("db.games.createIndex({ 'steamspy.positive': -1, 'steamspy.ccu': -1 })\n")
                f.write("```\n\n")
                
                # SteamSpy query examples
                f.write("### SteamSpy Query Examples:\n\n")
                f.write("```javascript\n")
                f.write("// Find highly rated games\n")
                f.write("db.games.find({\n")
                f.write("  'steamspy.positive': { $gt: 1000 },\n")
                f.write("  $expr: { $gt: ['$steamspy.positive', '$steamspy.negative'] }\n")
                f.write("})\n\n")
                f.write("// Find games by tag popularity\n")
                f.write("db.games.find({ 'steamspy.tags.Action': { $gt: 100 } })\n\n")
                f.write("// Aggregate average ratings by genre\n")
                f.write("db.games.aggregate([\n")
                f.write("  { $match: { 'steamspy.positive': { $gt: 0 } } },\n")
                f.write("  { $group: {\n")
                f.write("    _id: '$steamspy.genre',\n")
                f.write("    avgPositive: { $avg: '$steamspy.positive' },\n")
                f.write("    avgNegative: { $avg: '$steamspy.negative' },\n")
                f.write("    count: { $sum: 1 }\n")
                f.write("  }},\n")
                f.write("  { $sort: { avgPositive: -1 } }\n")
                f.write("])\n")
                f.write("```\n\n")
                
                # SteamSpy data insights
                f.write("### SteamSpy Data Insights:\n\n")
                if self.steamspy_tags:
                    top_tag = self.steamspy_tags.most_common(1)[0]
                    f.write(f"- **Most popular tag**: '{top_tag[0]}' ({top_tag[1]} votes)\n")
                
                if self.steamspy_positive_ratings:
                    total_pos = sum(self.steamspy_positive_ratings)
                    total_neg = sum(self.steamspy_negative_ratings)
                    total_reviews = total_pos + total_neg
                    pos_ratio = total_pos / total_reviews if total_reviews > 0 else 0
                    f.write(f"- **Total reviews analyzed**: {total_reviews:,} ({total_pos:,} positive, {total_neg:,} negative)\n")
                    f.write(f"- **Overall positive ratio**: {pos_ratio:.1%}\n")
                
                if self.steamspy_languages:
                    total_langs = len(self.steamspy_languages)
                    f.write(f"- **Total languages supported**: {total_langs}\n")
                
                f.write("\n---\n\n")

    def get_mongodb_type(self, python_type: str) -> str:
        """Chuyển đổi Python type sang MongoDB type"""
        type_map = {
            "string": "String",
            "integer": "Number",
            "float": "Number",
            "boolean": "Boolean",
            "array": "Array",
            "object": "Object",
            "null": "null"
        }
        return type_map.get(python_type, "Mixed")
    
    def get_bson_type(self, python_type: str) -> str:
        """Chuyển đổi Python type sang BSON type"""
        type_map = {
            "string": "string",
            "integer": "int",
            "float": "double",
            "boolean": "bool",
            "array": "array",
            "object": "object",
            "null": "null"
        }
        return type_map.get(python_type, "mixed")

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
        print("=" * 80)

        # Phân tích
        all_fields, field_counter, total_games = self.analyze_json_fields(target_dir)

        print(f"\n{'=' * 80}")
        print(f"TỔNG KẾT:")
        print(f"- Tổng số unique fields: {len(all_fields)}")
        print(f"- Tổng số games phân tích: {total_games}")
        print(f"- Field xuất hiện nhiều nhất: {field_counter.most_common(1)[0] if field_counter else 'N/A'}")
        print("=" * 80)

        # Lưu kết quả
        self.save_analysis_results(all_fields, field_counter, total_games)

        print(f"\n✅ Kết quả đã được lưu vào thư mục: {self.analysis_dir}")
        print("\nCác file được tạo:")
        print("  📄 all_fields.txt                  - Danh sách tất cả fields")
        print("  📊 field_statistics.csv            - Thống kê chi tiết (Excel-friendly)")
        print("  📋 field_levels.txt                - Phân tích theo cấp độ nesting")
        print("  🔢 array_fields_analysis.txt       - Phân tích array fields")
        print("  🏗️  nested_objects_analysis.txt    - Phân tích nested objects")
        print("  💾 field_samples.json              - Mẫu dữ liệu thực tế")
        print("  🎯 nosql_schema_suggestions.md     - Đề xuất schema NoSQL")
        
        # SteamSpy files
        if self.steamspy_fields:
            print("  🔍 steamspy_fields.txt             - Danh sách fields SteamSpy")
            print("  🏷️  steamspy_tags_analysis.txt      - Phân tích tags")
            print("  🌐 steamspy_languages_analysis.txt - Phân tích ngôn ngữ")
            print("  ⭐ steamspy_ratings_analysis.txt   - Phân tích ratings")
            print("  👥 steamspy_owners_analysis.txt    - Phân tích owners")
        
        print("\n" + "=" * 80)
        print("💡 Mở file 'nosql_schema_suggestions.md' để xem đề xuất thiết kế schema!")
        if self.steamspy_fields:
            print("💡 Mở các file steamspy_*.txt để xem phân tích chi tiết SteamSpy data!")
        print("=" * 80)

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