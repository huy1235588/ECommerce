import re
from pathlib import Path

def extract_app_ids_from_html(html_file_path):
    """
    Extract app IDs from SteamDB HTML file containing game charts.

    Args:
        html_file_path (str): Path to the HTML file

    Returns:
        list: List of unique app IDs found in the HTML
    """
    app_ids = set()  # Use set to avoid duplicates

    try:
        with open(html_file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Pattern to match SteamDB app URLs: https://steamdb.info/app/{id}/charts/
        pattern = r'https://steamdb\.info/app/(\d+)/charts/'

        matches = re.findall(pattern, content)

        for match in matches:
            app_ids.add(match)

        return sorted(list(app_ids), key=int)  # Sort by numeric value

    except FileNotFoundError:
        print(f"Error: File '{html_file_path}' not found.")
        return []
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

def save_ids_to_file(ids, output_file_path):
    """
    Save list of IDs to a text file, one ID per line.

    Args:
        ids (list): List of app IDs
        output_file_path (str): Path to output file
    """
    try:
        with open(output_file_path, 'w', encoding='utf-8') as file:
            for app_id in ids:
                file.write(f"{app_id}\n")
        print(f"Successfully saved {len(ids)} IDs to '{output_file_path}'")
    except Exception as e:
        print(f"Error saving file: {e}")

if __name__ == "__main__":
    # Path to the HTML file (adjust if needed)
    html_file = Path(__file__).parent / "html" / "Steam Charts · Most Played Games on Steam · SteamDB.htm"

    # Output file path
    output_file = Path(__file__).parent / "extracted_ids.txt"

    # Extract IDs
    app_ids = extract_app_ids_from_html(html_file)

    if app_ids:
        print(f"Found {len(app_ids)} unique app IDs:")
        for app_id in app_ids[:10]:  # Show first 10
            print(app_id)
        if len(app_ids) > 10:
            print("...")

        # Save to file
        save_ids_to_file(app_ids, output_file)
    else:
        print("No app IDs found in the HTML file.")