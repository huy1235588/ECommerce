import json


def extract_ids(json_filename, output_filename):
    # Read JSON data
    with open(json_filename, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error reading JSON: {e}")
            return

    # Extract id values
    ids = []
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and "id" in item:
                ids.append(str(item["id"]))
    elif isinstance(data, dict):
        if "id" in data:
            ids.append(str(data["id"]))
        else:
            # Optionally, iterate nested dict values
            for key, value in data.items():
                if isinstance(value, dict) and "id" in value:
                    ids.append(str(value["id"]))
    else:
        print("Unsupported JSON structure.")
        return

    # Join the ids with ',\n'
    output_content = ",\n".join(ids)

    # Write to output text file
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(output_content)
    print(f"IDs have been written to {output_filename}.")


def merge_unique_ids(file1, file2, output_file):
    def read_ids(filename):
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
            return {item.strip() for item in content.split(",\n") if item.strip()}

    ids1 = read_ids(file1)
    ids2 = read_ids(file2)
    # Get ids that are unique in each file (symmetric difference)
    unique_ids = (ids1 - ids2) | (ids2 - ids1)

    output_content = ",\n".join(unique_ids)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(output_content)
    print(f"Unique IDs have been written to {output_file}.")


if __name__ == "__main__":
    # Adjust the file names as needed
    json_file = "python/json/games_with_score4.json"  # Your JSON file
    output_file = "python/ids/ids_from_json4.txt"  # Output text file
    extract_ids(json_file, output_file)

    # txt_file1 = "python/ids/all_game_ids.txt"  # Your first text file
    # txt_file2 = "server/json/data-20250311/logs/success.txt"  # Your second text file
    # output_file = "python/ids/error.txt"  # Output text file
    # merge_unique_ids(txt_file1, txt_file2, output_file)
