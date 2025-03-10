import json

def extract_ids(json_filename, output_filename):
    # Read JSON data
    with open(json_filename, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error reading JSON: {e}")
            return

    # Extract id values
    ids = []
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and 'id' in item:
                ids.append(str(item['id']))
    elif isinstance(data, dict):
        if 'id' in data:
            ids.append(str(data['id']))
        else:
            # Optionally, iterate nested dict values
            for key, value in data.items():
                if isinstance(value, dict) and 'id' in value:
                    ids.append(str(value['id']))
    else:
        print("Unsupported JSON structure.")
        return

    # Join the ids with ',\n'
    output_content = ',\n'.join(ids)
    
    # Write to output text file
    with open(output_filename, 'w', encoding='utf-8') as f:
        f.write(output_content)
    print(f"IDs have been written to {output_filename}.")

if __name__ == "__main__":
    # Adjust the file names as needed
    json_file = "python/json/games.json"    # Your JSON file
    output_file = "python/ids/ids_from_json.txt"  # Output text file
    extract_ids(json_file, output_file)