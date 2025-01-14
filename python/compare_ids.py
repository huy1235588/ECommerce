# Đọc nội dung từ nhiều file và lưu các ID vào một tập hợp
def read_ids_from_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        # Tách các ID bằng dấu phẩy hoặc xuống dòng
        ids = set(content.replace('\n', ',').split(','))
        # Loại bỏ các ID trống (nếu có)
        ids = {id.strip() for id in ids if id.strip()}
        return ids

# So sánh nhiều file và lọc các ID giống nhau
def compare_multiple_files(files):
    # Lấy các ID từ file đầu tiên
    common_ids = read_ids_from_file(files[0])

    # So sánh với các file còn lại
    for file in files[1:]:
        ids_in_file = read_ids_from_file(file)
        common_ids = common_ids.intersection(ids_in_file)
    
    # Trả về các ID chung giữa tất cả các file
    return common_ids

# Tìm các ID khác nhau giữa các file
def find_unique_ids(files):
    all_ids = set()         # Hợp của tất cả các ID
    common_ids = None       # Giao của tất cả các ID

    for file in files:
        ids_in_file = read_ids_from_file(file)
        all_ids.update(ids_in_file)
        if common_ids is None:
            common_ids = ids_in_file
        else:
            common_ids = common_ids.intersection(ids_in_file)
    
    # Các ID khác nhau = tất cả ID - ID chung
    unique_ids = all_ids - common_ids
    return unique_ids

# Chạy chương trình so sánh nhiều file
files = [
    'python/ids/app_ids7.txt', 
    'python/ids/app_ids6.txt'
    ]  # Danh sách các file

# common_ids = compare_multiple_files(files)
common_ids = find_unique_ids(files)

print("Các ID giống nhau trong tất cả các file là:")
for id in common_ids:
    print(id)
