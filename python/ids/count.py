from collections import Counter

# Đọc nội dung từ file txt
input_file = 'python/ids/app_ids.txt'  # Thay thế tên file của bạn nếu cần
output_file = 'python/ids/duplicates.txt'

# Mở file và đọc nội dung
with open(input_file, 'r') as infile:
    lines = infile.readlines()

# Xử lý để lấy ra tất cả các ID (giả sử mỗi ID là một chuỗi trong mỗi dòng)
ids = [line.strip() for line in lines]  # Giả sử mỗi dòng là một ID

# Đếm tần suất xuất hiện của từng ID
id_counts = Counter(ids)

# Lọc các ID xuất hiện nhiều lần
duplicates = {id: count for id, count in id_counts.items() if count > 1}

# Ghi kết quả vào một file mới
with open(output_file, 'w') as outfile:
    if duplicates:
        outfile.write("Các ID giống nhau:\n")
        for id, count in duplicates.items():
            outfile.write(f"ID: {id}, Số lần xuất hiện: {count}\n")
    else:
        outfile.write("Không có ID nào trùng lặp.\n")

print(f"Đã ghi các ID giống nhau vào {output_file}")
