"""
Script kiểm tra trước khi import games vào MongoDB
Kiểm tra: kết nối DB, file JSON, và thử import một vài games mẫu
"""

import os
import json
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ImportChecker:
    def __init__(self):
        load_dotenv()
        self.mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        self.db_name = "game_service_db"
        self.base_dir = Path(__file__).parent / 'app_details'
    
    def check_mongodb_connection(self):
        """Kiểm tra kết nối MongoDB"""
        logger.info("\n1. [INFO] Kiem tra ket noi MongoDB...")
        try:
            client = MongoClient(self.mongo_uri, serverSelectionTimeoutMS=5000)
            client.server_info()
            
            db = client[self.db_name]
            games_collection = db['games']
            count = games_collection.count_documents({})
            
            logger.info("   [SUCCESS] Ket noi thanh cong!")
            logger.info(f"   [INFO] Database: {self.db_name}")
            logger.info(f"   [INFO] So games hien tai: {count}")
            client.close()
            return True
        except Exception as e:
            logger.error(f"   [ERROR] Loi ket noi: {e}")
            return False
    
    def check_directory_structure(self):
        """Kiểm tra cấu trúc thư mục"""
        logger.info("\n2. [INFO] Kiem tra cau truc thu muc...")
        
        if not self.base_dir.exists():
            logger.error(f"   [ERROR] Thu muc khong ton tai: {self.base_dir}")
            return False
        
        # Đếm thư mục con
        subdirs = [d for d in self.base_dir.iterdir() if d.is_dir()]
        logger.info(f"   [SUCCESS] Tim thay {len(subdirs)} thu muc con")
        
        # Đếm file JSON
        total_files = 0
        sample_files = []
        
        for subdir in subdirs[:5]:  # Kiểm tra 5 thư mục đầu
            json_files = list(subdir.glob('app_details_*.json'))
            total_files += len(json_files)
            if json_files and len(sample_files) < 3:
                sample_files.extend(json_files[:3])
        
        logger.info(f"   [INFO] Uoc tinh tong so file: ~{total_files * len(subdirs) // 5}")
        logger.info(f"   [INFO] File mau: {[f.name for f in sample_files[:3]]}")
        
        return True, sample_files
    
    def check_json_format(self, sample_files):
        """Kiểm tra format file JSON"""
        logger.info("\n3. [INFO] Kiem tra format file JSON...")
        
        valid_count = 0
        invalid_count = 0
        
        for json_file in sample_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Kiểm tra cấu trúc cơ bản
                if data.get('success') and data.get('data'):
                    game_data = data['data']
                    required_fields = ['steam_appid', 'name', 'type']
                    
                    missing_fields = [f for f in required_fields if f not in game_data]
                    
                    if not missing_fields:
                        valid_count += 1
                        logger.info(f"   [SUCCESS] {json_file.name}: OK - {game_data.get('name')}")
                    else:
                        invalid_count += 1
                        logger.warning(f"   [WARNING] {json_file.name}: Thieu fields: {missing_fields}")
                else:
                    invalid_count += 1
                    logger.warning(f"   [WARNING] {json_file.name}: success=False hoac khong co data")
                    
            except Exception as e:
                invalid_count += 1
                logger.error(f"   [ERROR] {json_file.name}: Loi doc file - {e}")
        
        logger.info(f"\n   [INFO] Ket qua: {valid_count} valid, {invalid_count} invalid")
        return valid_count > 0
    
    def test_import_sample(self, sample_files):
        """Test import một vài games mẫu"""
        logger.info("\n4. [INFO] Test import games mau...")
        
        try:
            client = MongoClient(self.mongo_uri)
            db = client[self.db_name]
            games_collection = db['games']
            
            imported_count = 0
            
            for json_file in sample_files[:2]:  # Import 2 games đầu
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        raw_data = json.load(f)
                    
                    if raw_data.get('success') and raw_data.get('data'):
                        game_data = raw_data['data']
                        
                        # Transform data
                        game_doc = {
                            'app_id': game_data.get('steam_appid'),
                            'name': game_data.get('name'),
                            'type': game_data.get('type'),
                            'is_free': game_data.get('is_free', False),
                            'test_import': True  # Đánh dấu để dễ xóa sau
                        }
                        
                        # Upsert
                        result = games_collection.update_one(
                            {'app_id': game_doc['app_id']},
                            {'$set': game_doc},
                            upsert=True
                        )
                        
                        imported_count += 1
                        logger.info(f"   [SUCCESS] Import thanh cong: {game_doc['name']}")
                        
                except Exception as e:
                    logger.error(f"   [ERROR] Loi import {json_file.name}: {e}")
            
            logger.info(f"\n   [INFO] Da import {imported_count} games mau")
            
            # Kiểm tra
            test_games = list(games_collection.find({'test_import': True}))
            logger.info(f"   [SUCCESS] Tim thay {len(test_games)} games test trong DB")
            
            # Xóa test data
            if input("\n   ? Xoa du lieu test? (y/n): ").lower() == 'y':
                games_collection.delete_many({'test_import': True})
                logger.info("   [SUCCESS] Da xoa du lieu test")
            
            client.close()
            return True
            
        except Exception as e:
            logger.error(f"   [ERROR] Loi test import: {e}")
            return False
    
    def run_checks(self):
        """Chạy tất cả các kiểm tra"""
        logger.info("="*60)
        logger.info("🔍 KIỂM TRA TRƯỚC KHI IMPORT GAMES")
        logger.info("="*60)
        
        # 1. Kiểm tra MongoDB
        if not self.check_mongodb_connection():
            logger.error("\n❌ Không thể kết nối MongoDB. Vui lòng kiểm tra lại!")
            return False
        
        # 2. Kiểm tra thư mục
        result = self.check_directory_structure()
        if not result:
            logger.error("\n[ERROR] Cau truc thu muc khong hop le!")
            return False
        
        _, sample_files = result
        
        # 3. Kiểm tra JSON format
        if not self.check_json_format(sample_files):
            logger.error("\n[ERROR] File JSON khong hop le!")
            return False
        
        # 4. Test import
        if not self.test_import_sample(sample_files):
            logger.error("\n[ERROR] Test import that bai!")
            return False
        
        # Kết luận
        logger.info("\n" + "="*60)
        logger.info("[SUCCESS] TAT CA KIEM TRA DEU PASS!")
        logger.info("="*60)
        logger.info("\n[INFO] Ban co the chay script import chinh:")
        logger.info("   python import_games_to_db.py")
        logger.info("="*60)
        
        return True


def main():
    checker = ImportChecker()
    checker.run_checks()


if __name__ == "__main__":
    main()
