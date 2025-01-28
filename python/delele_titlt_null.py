import json
import os


def remove_null_titles(input_file, output_file):
    """
    Removes objects with null titles from a JSON file.

    Parameters:
    input_file (str): Path to the input JSON file.
    output_file (str): Path to save the cleaned JSON file.
    """
    try:
        # Read the JSON file
        with open(input_file, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Ensure the JSON file contains a list
        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of objects.")

        # Filter out objects with null titles
        cleaned_data = [item for item in data if item.get("title") is not None]

        # Write the cleaned data back to a new file
        with open(output_file, "w", encoding="utf-8") as file:
            json.dump(cleaned_data, file, ensure_ascii=False, indent=4)

        print(
            f"Successfully removed objects with null titles. Cleaned data saved to {output_file}."
        )
    except Exception as e:
        print(f"An error occurred: {e}")


id_file = "data-20250128"
path_file = "server/json/" + id_file

# Example usage
file_list = [
    "/data0.json",
    "/data1.json",
    "/data2.json",
    "/data3.json",
    "/language0.json",
    "/language1.json",
    "/language2.json",
    "/language3.json",
    "/achievement0.json",
    "/achievement1.json",
    "/achievement2.json",
    "/achievement3.json",
]

# Tạo folder nếu chưa tồn tại
path_file_v2 = f"{path_file}_v2"
if not os.path.exists(f"{path_file_v2}"):
    os.makedirs(f"{path_file_v2}")

for file in file_list:
    remove_null_titles(f"{path_file}{file}", f"{path_file_v2}{file}")
