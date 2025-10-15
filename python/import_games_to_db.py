"""
Script import toàn bộ game data từ file JSON vào MongoDB
Cấu trúc: python/app_details/{range}/app_details_{id}.json
"""

import os
import json
import sys
import pymongo
from pymongo import MongoClient, UpdateOne, InsertOne
from pathlib import Path
from typing import Dict, List, Any
import logging
from datetime import datetime, UTC
from dotenv import load_dotenv

# Cấu hình UTF-8 cho console trên Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(
            f'logs/import_games_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log',
            encoding='utf-8'
        ),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class GameImporter:
    def __init__(self, mongo_uri: str = None, db_name: str = "game_service_db"):
        """
        Khởi tạo GameImporter
        
        Args:
            mongo_uri: MongoDB connection string
            db_name: Tên database
        """
        # Load environment variables
        load_dotenv()
        
        self.mongo_uri = mongo_uri or os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        self.db_name = db_name
        self.client = None
        self.db = None
        self.games_collection = None
        
        # Thư mục chứa file JSON
        self.base_dir = Path(__file__).parent / 'app_details'
        
        # Thống kê
        self.stats = {
            'total_files': 0,
            'successful': 0,
            'failed': 0,
            'skipped': 0,
            'errors': []
        }
    
    def connect_db(self):
        """Kết nối đến MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client[self.db_name]
            self.games_collection = self.db['games']
            
            # Test connection
            self.client.server_info()
            logger.info(f"[SUCCESS] Ket noi thanh cong den MongoDB: {self.db_name}")
            return True
        except Exception as e:
            logger.error(f"[ERROR] Loi ket noi MongoDB: {e}")
            return False
    
    def close_db(self):
        """Đóng kết nối MongoDB"""
        if self.client:
            self.client.close()
        logger.info(f"[INFO] Da dong ket noi MongoDB")
    
    def transform_game_data(self, raw_data: Dict) -> Dict:
        """
        Transform dữ liệu từ file JSON sang format MongoDB
        
        Args:
            raw_data: Dữ liệu thô từ file JSON
            
        Returns:
            Dữ liệu đã được transform
        """
        if not raw_data.get('success') or not raw_data.get('data'):
            return None
        
        data = raw_data['data']
        
        # Transform theo schema
        game_doc = {
            # Core Information (Required)
            'app_id': data.get('steam_appid'),
            'type': data.get('type'),
            'name': data.get('name'),
            'required_age': data.get('required_age', 0),
            'is_free': data.get('is_free', False),
            
            # Descriptions
            'detailed_description': data.get('detailed_description'),
            'about_the_game': data.get('about_the_game'),
            'short_description': data.get('short_description'),
            
            # Media Assets
            'header_image': data.get('header_image'),
            'capsule_image': data.get('capsule_image'),
            'capsule_imagev5': data.get('capsule_imagev5'),
            'background': data.get('background'),
            'background_raw': data.get('background_raw'),
            
            # Optional
            'website': data.get('website'),
            'supported_languages': data.get('supported_languages'),
            
            # Arrays
            'screenshots': data.get('screenshots', []),
            'movies': data.get('movies', []),
            'categories': data.get('categories', []),
            'genres': data.get('genres', []),
            'developers': data.get('developers', []),
            'publishers': data.get('publishers', []),
            
            # Platform Requirements
            'pc_requirements': data.get('pc_requirements', {}),
            'mac_requirements': data.get('mac_requirements', {}),
            'linux_requirements': data.get('linux_requirements', {}),
            
            # Platform Support
            'platforms': data.get('platforms', {}),
            
            # Release Information
            'release_date': data.get('release_date', {}),
            
            # Pricing
            'packages': data.get('packages', []),
            'price_overview': data.get('price_overview'),
            'package_groups': data.get('package_groups', []),
            
            # Achievements
            'achievements': data.get('achievements'),
            
            # Reviews
            'reviews': {
                'positive': data.get('reviews', {}).get('positive', 0) if isinstance(data.get('reviews'), dict) else 0,
                'negative': data.get('reviews', {}).get('negative', 0) if isinstance(data.get('reviews'), dict) else 0,
            },
            
            # Languages
            'languages': data.get('languages'),
            
            # Tags
            'tags': data.get('tags', {}),
            
            # Additional fields
            'recommendations': data.get('recommendations'),
            'metacritic': data.get('metacritic'),
            'support_info': data.get('support_info'),
            'content_descriptors': data.get('content_descriptors'),
            'ratings': data.get('ratings'),
            'legal_notice': data.get('legal_notice'),
            'controller_support': data.get('controller_support'),
            'dlc': data.get('dlc', []),
            
            # Metadata
            'created_at': datetime.now(UTC),
            'updated_at': datetime.now(UTC)
        }
        
        # Remove None values while preserving order
        # Using dict comprehension to maintain insertion order (Python 3.7+)
        return {key: value for key, value in game_doc.items() if value is not None}
    
    def get_all_json_files(self) -> List[Path]:
        """
        Lấy danh sách tất cả file JSON trong thư mục app_details
        
        Returns:
            List các Path đến file JSON
        """
        json_files = []
        
        if not self.base_dir.exists():
            logger.error(f"❌ Thư mục không tồn tại: {self.base_dir}")
            return json_files
        
        # Duyệt qua tất cả các thư mục con
        for subdir in self.base_dir.iterdir():
            if subdir.is_dir():
                # Tìm tất cả file JSON trong thư mục con
                for json_file in subdir.glob('app_details_*.json'):
                    json_files.append(json_file)
        
            logger.info(f"[INFO] Tim thay {len(json_files)} file JSON")
        return json_files
    
    def read_json_file(self, file_path: Path) -> Dict:
        """
        Đọc file JSON
        
        Args:
            file_path: Đường dẫn đến file JSON
            
        Returns:
            Dữ liệu JSON
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"❌ Lỗi đọc file {file_path.name}: {e}")
            return None
    
    def import_batch(self, games: List[Dict], batch_size: int = 100):
        """
        Import batch games vào database
        
        Args:
            games: Danh sách game documents
            batch_size: Kích thước batch
        """
        if not games:
            return
        
        try:
            # Sử dụng bulk_write với upsert để tránh duplicate
            operations = []
            for game in games:
                if game and game.get('app_id'):
                    operations.append(
                        InsertOne(
                            game
                            # {'app_id': game['app_id']},
                            # {'$set': game},
                            # upsert=True
                        )
                    )
            
            if operations:
                result = self.games_collection.bulk_write(operations, ordered=False)
                self.stats['successful'] += result.upserted_count + result.modified_count
                logger.info(f"[SUCCESS] Import thanh cong {len(operations)} games (Upserted: {result.upserted_count}, Modified: {result.modified_count})")
                
        except Exception as e:
            logger.error(f"❌ Lỗi import batch: {e}")
            self.stats['failed'] += len(games)
            self.stats['errors'].append(str(e))
    
    def import_all_games(self, batch_size: int = 100):
        """
        Import tất cả games từ file JSON vào MongoDB
        
        Args:
            batch_size: Số lượng games trong mỗi batch
        """
        logger.info("🚀 Bắt đầu import games vào MongoDB...")
        start_time = datetime.now()
        
        # Lấy danh sách file
        json_files = self.get_all_json_files()
        self.stats['total_files'] = len(json_files)
        
        if not json_files:
            logger.warning("⚠️ Không tìm thấy file JSON nào!")
            return
        
        # Process theo batch
        batch = []
        processed_count = 0
        
        for json_file in json_files:
            processed_count += 1
            
            # Đọc file JSON
            raw_data = self.read_json_file(json_file)
            
            if raw_data:
                # Transform data
                game_doc = self.transform_game_data(raw_data)
                
                if game_doc:
                    batch.append(game_doc)
                else:
                    self.stats['skipped'] += 1
                    logger.warning(f"⚠️ Skip file {json_file.name}: Dữ liệu không hợp lệ")
            else:
                self.stats['failed'] += 1
            
            # Import khi batch đầy
            if len(batch) >= batch_size:
                self.import_batch(batch, batch_size)
                batch = []
            
            # Log progress
            if processed_count % 500 == 0:
                logger.info(f"[PROGRESS] Da xu ly {processed_count}/{len(json_files)} files...")
        
        # Import batch cuối cùng
        if batch:
            self.import_batch(batch, batch_size)
        
        # Tính toán thời gian
        duration = datetime.now() - start_time
        
        # In kết quả
        logger.info("\n" + "="*60)
        logger.info("📊 KẾT QUẢ IMPORT")
        logger.info("="*60)
        logger.info(f"[INFO] Thoi gian: {duration}")
        logger.info(f"[INFO] Tong so file: {self.stats['total_files']}")
        logger.info(f"[SUCCESS] Thanh cong: {self.stats['successful']}")
        logger.info(f"[WARNING] Bo qua: {self.stats['skipped']}")
        logger.info(f"[ERROR] That bai: {self.stats['failed']}")
        
        if self.stats['errors']:
            logger.info(f"\n[ERROR] Chi tiet loi:")
            for error in set(self.stats['errors'][:10]):  # Hiển thị 10 lỗi đầu tiên
                logger.error(f"   - {error}")
        
        logger.info("="*60)
    
    def create_indexes(self):
        """Tạo indexes cho collection games"""
        logger.info("[INFO] Tao indexes...")
        try:
            # Single field indexes
            self.games_collection.create_index('app_id', unique=True)
            self.games_collection.create_index('name')
            self.games_collection.create_index('type')
            self.games_collection.create_index('is_free')
            self.games_collection.create_index('release_date.date')
            
            # Text search index
            self.games_collection.create_index([
                ('name', 'text'),
                ('short_description', 'text'),
                ('detailed_description', 'text')
            ])
            
            # Compound indexes
            self.games_collection.create_index([('type', 1), ('release_date.date', -1)])
            self.games_collection.create_index([('is_free', 1), ('price_overview.final', 1)])
            
            logger.info("[SUCCESS] Da tao indexes thanh cong")
            
        except Exception as e:
            logger.error(f"[ERROR] Loi tao indexes: {e}")
    
    def run(self, create_indexes: bool = True, batch_size: int = 100):
        """
        Chạy quá trình import
        
        Args:
            create_indexes: Có tạo indexes không
            batch_size: Kích thước batch
        """
        try:
            # Kết nối database
            if not self.connect_db():
                return
            
            # Import games
            self.import_all_games(batch_size=batch_size)
            
            # Tạo indexes
            if create_indexes:
                self.create_indexes()
            
            # Thống kê
            total_docs = self.games_collection.count_documents({})
            logger.info(f"\n[INFO] Tong so games trong database: {total_docs}")
            
        except Exception as e:
            logger.error(f"❌ Lỗi: {e}")
        finally:
            self.close_db()


def main():
    """Main function"""
    # Tạo thư mục logs nếu chưa có
    logs_dir = Path(__file__).parent / 'logs'
    logs_dir.mkdir(exist_ok=True)
    
    # Khởi tạo và chạy importer
    importer = GameImporter()
    importer.run(create_indexes=True, batch_size=100)


if __name__ == "__main__":
    main()
