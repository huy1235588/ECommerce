from pathlib import Path

def merge_id_files(file1_path, file2_path, output_path=None):
    """
    Merge two ID files, remove duplicates, and sort numerically.

    Args:
        file1_path (str or Path): Path to first ID file
        file2_path (str or Path): Path to second ID file
        output_path (str or Path, optional): Path to output file. If None, overwrites file1

    Returns:
        int: Number of unique IDs after merge
    """
    file1_path = Path(file1_path)
    file2_path = Path(file2_path)

    if output_path is None:
        output_path = file1_path
    else:
        output_path = Path(output_path)

    # Read IDs from both files
    ids1 = read_ids_from_file(file1_path)
    ids2 = read_ids_from_file(file2_path)

    # Combine and remove duplicates
    all_ids = set(ids1 + ids2)

    # Convert to int for sorting, then back to string
    sorted_ids = sorted(all_ids, key=lambda x: int(x))

    # Write to output file
    with open(output_path, 'w', encoding='utf-8') as f:
        for app_id in sorted_ids:
            f.write(f"{app_id}\n")

    print(f"Merged {len(ids1)} IDs from {file1_path.name} and {len(ids2)} IDs from {file2_path.name}")
    print(f"Total unique IDs: {len(sorted_ids)}")
    print(f"Saved to: {output_path}")

    return len(sorted_ids)

def read_ids_from_file(file_path):
    """
    Read IDs from a text file, one ID per line.

    Args:
        file_path (str or Path): Path to the file

    Returns:
        list: List of IDs as strings
    """
    ids = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and line.isdigit():
                    ids.append(line)
    except FileNotFoundError:
        print(f"Warning: File {file_path} not found.")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

    return ids

def merge_all_log_ids(script_dir):
    """
    Merge all IDs from log files (success_ids.txt, failed_ids.txt, etc.) into ids.txt

    Args:
        script_dir (str or Path): Directory containing the log files and ids.txt
    """
    script_dir = Path(script_dir)

    log_files = [
        script_dir / "logs" / "success_ids.txt",
        script_dir / "logs" / "failed_ids.txt",
        script_dir / "logs" / "retried_ids.txt",
        script_dir / "logs" / "fetched_ids.txt"
    ]

    ids_txt = script_dir / "ids.txt"

    # Read existing ids.txt
    existing_ids = read_ids_from_file(ids_txt)

    # Read all log files
    all_log_ids = []
    for log_file in log_files:
        log_ids = read_ids_from_file(log_file)
        all_log_ids.extend(log_ids)
        print(f"Found {len(log_ids)} IDs in {log_file.name}")

    # Combine all
    all_ids = set(existing_ids + all_log_ids)
    sorted_ids = sorted(all_ids, key=lambda x: int(x))

    # Save back to ids.txt
    with open(ids_txt, 'w', encoding='utf-8') as f:
        for app_id in sorted_ids:
            f.write(f"{app_id}\n")

    print(f"Merged all log IDs into {ids_txt}")
    print(f"Total unique IDs: {len(sorted_ids)}")

if __name__ == "__main__":
    script_dir = Path(__file__).parent

    # Option 1: Merge extracted_ids.txt with ids.txt
    extracted_file = script_dir / "extracted_ids.txt"
    ids_file = script_dir / "ids.txt"

    if extracted_file.exists():
        print("Merging extracted_ids.txt with ids.txt...")
        merge_id_files(ids_file, extracted_file)
    else:
        print("extracted_ids.txt not found. Merging log files instead...")

    # Option 2: Merge all log IDs
    merge_all_log_ids(script_dir)