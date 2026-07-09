import os

path = r"d:\doanWEDKD\FitFuel_Plus_Project.md"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix table duplicate
content = content.replace(
"| Gym Owner | Chủ phòng tập | Dashboard B2B, quản lý member, đẩy thông báo |\n| Gym Owner | Quản trị viên hệ thống | Quản lý toàn bộ, duyệt vendor, xử lý tranh chấp |",
"| Gym Owner | Quản lý phòng tập & hệ thống | Dashboard B2B, quản lý member, duyệt vendor, xử lý tranh chấp, quản lý FitCoin |")

# Fix outline tree duplicate
content = content.replace(
"└── 8. Gym Owner & Business Dashboard\n    ├── 8.1 Food Vendor Portal\n    ├── 8.2 Gym Owner Dashboard\n    ├── 8.3 Gym Owner Panel (duyệt, tranh chấp, hệ thống)",
"└── 8. B2B & System Management\n    ├── 8.1 Food Vendor Portal\n    ├── 8.2 Gym Owner Dashboard & Panel (quản lý member, duyệt, tranh chấp, hệ thống)")

content = content.replace(
"    ├── 8.2 Gym Owner Dashboard\n    ├── 8.3 Gym Owner Panel (duyệt, tranh chấp, hệ thống)",
"    ├── 8.2 Gym Owner Dashboard & Panel")

# Fix UI section duplicate
content = content.replace(
"- Gym Owner Dashboard\n- Gym Owner Panel",
"- Gym Owner Dashboard & Admin Panel")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated FitFuel_Plus_Project.md")
