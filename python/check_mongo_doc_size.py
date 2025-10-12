"""
Check BSON size of JSON files to determine if they would exceed MongoDB's 16MB document limit.
Usage (from repository root):
    python .\python\scripts\check_mongo_doc_size.py <path-or-file> [--threshold-bytes N]

Examples:
    python python/scripts/check_mongo_doc_size.py python/app_details/1-1000/app_details_10.json
    python python/scripts/check_mongo_doc_size.py python/app_details/1-1000/ --threshold-bytes 16000000

The script supports individual files or directories (it will recurse and check .json files).
It requires `pymongo` to be installed (for bson encoding). If not installed, install via:
    pip install pymongo

Outputs a table-like summary to stdout and exits with code 0. If any file exceeds threshold, exit code will be 2.
"""

import argparse
import json
import os
import sys
from typing import List, Tuple

try:
    from bson import BSON
    from bson import json_util
except Exception:
    BSON = None
    json_util = None

MONGO_MAX_BYTES = 16 * 1024 * 1024  # 16 MiB


def find_json_files(path: str) -> List[str]:
    files = []
    if os.path.isfile(path):
        files.append(path)
    else:
        for root, _, filenames in os.walk(path):
            for fn in filenames:
                if fn.lower().endswith('.json'):
                    files.append(os.path.join(root, fn))
    return files


def load_json(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        # use json_util to be tolerant of non-standard JSON if available
        content = f.read()
        try:
            if json_util:
                return json_util.loads(content)
            return json.loads(content)
        except Exception as e:
            # try fallback json
            return json.loads(content)


def bson_size_of_doc(doc) -> int:
    if BSON is None:
        raise RuntimeError('bson (pymongo) is required. Install with: pip install pymongo')
    # The BSON.encode expects a dict-like; json_util will have converted special types
    encoded = BSON.encode(doc)
    return len(encoded)


def format_bytes(n: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if n < 1024.0:
            return f"{n:.2f} {unit}"
        n /= 1024.0
    return f"{n:.2f} TB"


def check_files(paths: List[str], threshold: int) -> int:
    exit_code = 0
    any_exceed = False
    results: List[Tuple[str, int]] = []

    for p in paths:
        try:
            doc = load_json(p)
        except Exception as e:
            print(f"ERROR loading JSON {p}: {e}")
            exit_code = 1
            continue

        try:
            size = bson_size_of_doc(doc)
        except Exception as e:
            print(f"ERROR encoding BSON for {p}: {e}")
            exit_code = 1
            continue

        results.append((p, size))
        exceed = size > threshold
        if exceed:
            any_exceed = True

        print(f"{p}: {format_bytes(size)} ({size} bytes) - {'EXCEEDS' if exceed else 'OK'}")

        # If it's a big top-level object that contains a 'data' key which is large, report that too
        if isinstance(doc, dict) and 'data' in doc:
            try:
                data_size = bson_size_of_doc({'data': doc['data']})
                print(f"  top-level 'data' field BSON size: {format_bytes(data_size)} ({data_size} bytes)")
            except Exception:
                pass

    if any_exceed:
        exit_code = 2
    return exit_code


def main(argv=None):
    parser = argparse.ArgumentParser(description='Check JSON files for MongoDB/BSON document size limit (16MB).')
    parser.add_argument('paths', nargs='*', help='File or directory paths to check (.json). If omitted, defaults to python/app_details')
    parser.add_argument('--threshold-bytes', type=int, default=MONGO_MAX_BYTES,
                        help='Threshold in bytes (default: 16 MiB)')
    parser.add_argument('--top', type=int, default=10, help='Show top N largest files in the summary')
    args = parser.parse_args(argv)

    if BSON is None:
        print('ERROR: pymongo is required for BSON encoding. Install with: pip install pymongo')
        return 1

    paths = args.paths if args.paths else [os.path.join(os.path.dirname(__file__), 'app_details')]

    files = []
    for p in paths:
        files.extend(find_json_files(p))

    if not files:
        print('No JSON files found for the given paths:', paths)
        return 1

    # run checks and collect results
    results = []
    exit_code = 0
    any_exceed = False
    for p in files:
        try:
            doc = load_json(p)
            size = bson_size_of_doc(doc)
        except Exception as e:
            print(f"ERROR processing {p}: {e}")
            exit_code = 1
            continue

        results.append((p, size))
        if size > args.threshold_bytes:
            any_exceed = True
        print(f"{p}: {format_bytes(size)} ({size} bytes) - {'EXCEEDS' if size > args.threshold_bytes else 'OK'}")

        if isinstance(doc, dict) and 'data' in doc:
            try:
                data_size = bson_size_of_doc({'data': doc['data']})
                print(f"  top-level 'data' field BSON size: {format_bytes(data_size)} ({data_size} bytes)")
            except Exception:
                pass

    # Summary
    total_files = len(results)
    total_bytes = sum(s for _, s in results)
    print('\nSummary:')
    print(f"  Files checked: {total_files}")
    print(f"  Total BSON size (sum of documents): {format_bytes(total_bytes)} ({total_bytes} bytes)")

    # Top N largest
    top_n = sorted(results, key=lambda x: x[1], reverse=True)[:args.top]
    print(f"  Top {len(top_n)} largest files:")
    for p, s in top_n:
        print(f"    {p}: {format_bytes(s)} ({s} bytes){'  <-- EXCEEDS' if s > args.threshold_bytes else ''}")

    if any_exceed:
        print('\nOne or more files exceed the threshold of', args.threshold_bytes, 'bytes')
        exit_code = 2

    return exit_code


if __name__ == '__main__':
    sys.exit(main())
