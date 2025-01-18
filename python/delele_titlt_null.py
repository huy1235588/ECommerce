import json

def remove_null_titles(input_file, output_file):
    """
    Removes objects with null titles from a JSON file.

    Parameters:
    input_file (str): Path to the input JSON file.
    output_file (str): Path to save the cleaned JSON file.
    """
    try:
        # Read the JSON file
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Ensure the JSON file contains a list
        if not isinstance(data, list):
            raise ValueError("JSON file must contain a list of objects.")

        # Filter out objects with null titles
        cleaned_data = [item for item in data if item.get('title') is not None]

        # Write the cleaned data back to a new file
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(cleaned_data, file, ensure_ascii=False, indent=4)

        print(f"Successfully removed objects with null titles. Cleaned data saved to {output_file}.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
remove_null_titles('server/json/data-20250117/achievement.json', 'output.json')
