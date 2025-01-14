from bs4 import BeautifulSoup
import re

# Đọc file HTML
with open('python/test.html', 'r', encoding='utf-8') as f:
    # Phân tích cú pháp HTML bằng BeautifulSoup
    soup = BeautifulSoup(f, 'html.parser')

# Mở file để ghi kết quả
with open('python/ids/app_ids6.txt', 'w', encoding='utf-8') as out_file:
    # Tìm tất cả thẻ <a> trong HTML
    for a_tag in soup.find_all('a'):
        # Chỉ xử lý thẻ <a> có nội dung text
        if a_tag.text.strip():
            href = a_tag.get('href')
            if href:
                # Tìm và trích xuất ID từ href dạng /app/{id}/charts/
                match = re.search(r'/app/(\d+)/charts/', href)
                if match:
                    # Ghi ID vào file, thêm dấu phẩy ở cuối
                    out_file.write(match.group(1) + ',\n')