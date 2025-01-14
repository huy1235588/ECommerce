import os

# Danh sách các file cần ghép
file_list = [
    "python/ids/app_ids1.txt",
    "python/ids/app_ids2.txt",
    "python/ids/app_ids3.txt",
    "python/ids/app_ids4.txt",
    "python/ids/app_ids5.txt"
]  
# Tên file kết quả
output_file = "python/ids/app_ids.txt"

# Mở file kết quả để ghi
with open(output_file, "w") as outfile:
    for file_name in file_list:
        # Kiểm tra xem file có tồn tại hay không
        if os.path.exists(file_name):
            with open(file_name, "r") as infile:
                # Đọc và ghi nội dung vào file kết quả
                outfile.write(infile.read())
                outfile.write("\n")  # Thêm dấu xuống dòng giữa các file nếu cần
        else:
            print(f"File {file_name} không tồn tại.")

print(f"Đã ghép các tệp vào {output_file}")
