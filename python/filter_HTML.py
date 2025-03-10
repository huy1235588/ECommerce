from bs4 import BeautifulSoup
import json

htmlFile = [
    "python/html/current.html",
    "python/html/24h_peak.html",
    "python/html/all_time_peak.html",
]

jsonFile = [
    "python/json/current.json",
    "python/json/24h_peak.json",
    "python/json/all_time_peak.json",
]

for file in htmlFile:
    # Đọc file HTML
    with open(file, "r", encoding="utf-8") as f:
        # Phân tích cú pháp HTML bằng BeautifulSoup
        soup = BeautifulSoup(f, "html.parser")

    games = []

    # Lặp qua từng dòng trong bảng và trích xuất thông tin,
    # loại bỏ các game có title chứa từ "demo" hoặc "(demo)" ở cuối title
    for row in soup.find_all("tr", class_="app"):
        game_data = {
            "id": row.get("data-appid"),
            "title": row.find_all("td")[2].a.text.strip(),
            "current": int(row.find_all("td")[3].get("data-sort")),
            "24h_peak": int(row.find_all("td")[4].get("data-sort")),
            "all_time_peak": int(row.find_all("td")[5].get("data-sort")),
        }

        if game_data["title"].lower().endswith("demo") or game_data["title"].lower().endswith("(demo)"):
            continue
        games.append(game_data)

    # Mở file để ghi kết quả
    with open(jsonFile[htmlFile.index(file)], "w", encoding="utf-8") as f:
        # Ghi dữ liệu dưới dạng JSON
        json.dump(games, f, indent=4)
        print(f"Đã ghi file {jsonFile[htmlFile.index(file)]}")
