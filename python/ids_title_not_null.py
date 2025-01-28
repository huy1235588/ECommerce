def read_numbers_from_file(file_path):
    with open(file_path, "r") as file:
        return set(line.strip() for line in file if line.strip())


def write_numbers_to_file(file_path, numbers):
    with open(file_path, "w") as file:
        file.write("\n".join(map(str, numbers)))


def find_unique_numbers(file1, file2, output_file):
    numbers1 = read_numbers_from_file(file1)
    numbers2 = read_numbers_from_file(file2)

    unique_numbers = []
    
    for number in numbers1:
        if number not in numbers2:
            unique_numbers.append(number)

    write_numbers_to_file(output_file, unique_numbers)


# Example usage
file1 = "python/ids/app_ids6.txt"
file2 = "python/ids/ids_title_null.txt"
output_file = "python/ids/app_ids6_not_null.txt"

find_unique_numbers(file1, file2, output_file)
