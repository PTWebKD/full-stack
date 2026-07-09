import os

path = r"d:\doanWEDKD\generate_stakeholder_doc.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Gear Seller definition in text
content = content.replace(
"""add_body(
    'Người bán/cho thuê thiết bị (Gear Seller) là thành viên có thêm vai trò người bán, đăng '
    'thiết bị gym lên Gear Hub kèm Gear ID, hình ảnh và lịch sử sử dụng minh bạch. Nhóm này '
    'tạo nên thị trường thiết bị đã qua sử dụng đáng tin cậy, phân biệt FitFuel+ với các nền '
    'tảng mua bán thông thường như Shopee hay Facebook Marketplace.',
    bold_parts=['Người bán/cho thuê thiết bị (Gear Seller)']
)""",
"""add_body(
    'Người đăng bán/cho thuê thiết bị (Gear Seller/Renter) là vai trò phụ khi Gym Owner (được bán/cho thuê) '
    'hoặc Member (chỉ được cho thuê) đăng thiết bị gym lên Gear Hub kèm Gear ID, hình ảnh và lịch sử '
    'sử dụng minh bạch. Vai trò này tạo nên thị trường thiết bị đáng tin cậy, phân biệt FitFuel+ với '
    'các nền tảng mua bán thông thường.',
    bold_parts=['Người đăng bán/cho thuê thiết bị (Gear Seller/Renter)']
)""")

# 2. Update Gym Owner definition in text
content = content.replace(
"""add_body(
    'Chủ phòng tập (Gym Owner) đăng ký tài khoản Business, sử dụng dashboard riêng để quản lý '
    'thành viên, thiết lập gói membership, gửi thông báo và theo dõi báo cáo hoạt động. Nhóm '
    'này đại diện cho kênh B2B quan trọng, kết nối người tập và cơ sở tập luyện trên cùng '
    'một nền tảng số.',
    bold_parts=['Chủ phòng tập (Gym Owner)']
)""",
"""add_body(
    'Chủ phòng tập kiêm Quản trị viên (Gym Owner) đăng ký tài khoản Business, sử dụng dashboard riêng '
    'để quản lý phòng tập (thành viên, membership) đồng thời nắm toàn quyền quản trị hệ thống FitFuel+ '
    '(duyệt vendor, xử lý tranh chấp, quản lý FitCoin). Nhóm này đại diện cho kênh B2B quan trọng '
    'và là cấp quản lý cao nhất của nền tảng.',
    bold_parts=['Chủ phòng tập kiêm Quản trị viên (Gym Owner)']
)""")

# 3. Update Summary table 1.5.1
content = content.replace(
"['Gear Seller', 'Member kiêm vai trò bán hàng',        'Đăng gear, tạo Gear ID, quản lý listing'],\n    ['Gym Owner',   'Tài khoản Business, dashboard riêng', 'Quản lý member, gói membership, báo cáo hoạt động'],",
"['Gear Seller', 'Role phụ của Gym Owner/Member',        'Đăng gear, tạo Gear ID, quản lý listing'],\n    ['Gym Owner',   'Quản lý hệ thống & phòng tập',        'Quản lý member, duyệt vendor, xử lý tranh chấp, hệ thống FitCoin'],")

# 4. Remove Admin from 1.5.2
content = content.replace(
"""add_heading2('1.5.2. Nhóm quản trị và phát triển hệ thống')

add_body(
    'Nhóm này bao gồm Quản trị viên (Admin) và Nhóm phát triển, giữ vai trò đảm bảo vận hành, '
    'kiểm soát chất lượng và phát triển liên tục hệ thống trong suốt vòng đời dự án.',
    bold_parts=['Quản trị viên (Admin)', 'Nhóm phát triển']
)

add_body(
    'Quản trị viên (Admin) có quyền cao nhất trong hệ thống, chịu trách nhiệm duyệt đơn đăng ký '
    'của Food Vendor và Gym Owner, xử lý tranh chấp giao dịch Gear Hub, quản lý tổng thể FitCoin '
    'và xem báo cáo hoạt động toàn nền tảng. Admin là tác nhân duy nhất có thể can thiệp vào '
    'mọi phân hệ của hệ thống.',
    bold_parts=['Quản trị viên (Admin)']
)

add_body(
    'Nhóm phát triển hệ thống thực hiện phân tích yêu cầu, thiết kế kiến trúc, triển khai và '""",
"""add_heading2('1.5.2. Nhóm phát triển hệ thống')

add_body(
    'Nhóm này bao gồm Nhóm phát triển phần mềm, giữ vai trò đảm bảo vận hành, '
    'kiểm soát chất lượng và phát triển liên tục hệ thống trong suốt vòng đời dự án.',
    bold_parts=['Nhóm phát triển phần mềm']
)

add_body(
    'Nhóm phát triển hệ thống thực hiện phân tích yêu cầu, thiết kế kiến trúc, triển khai và '""")

content = content.replace(
"bold_parts=['Nhóm phát triển hệ thống']",
"bold_parts=['Nhóm phát triển hệ thống']") # keeping it same if no change

# 5. Update Summary table 1.5.2 & 1.5.3
content = content.replace(
"['Admin',           'Người dùng – Chính', 'Duyệt vendor/gym, xử lý tranh chấp, quản lý FitCoin, báo cáo tổng thể'],\n    ",
"")
content = content.replace("Bảng 1.5.2 – Tổng hợp nhóm quản trị và hệ thống tích hợp", "Bảng 1.5.2 – Tổng hợp nhóm phát triển và hệ thống tích hợp")


# 6. Remove Admin from Matrix Relations text
content = content.replace(
"Admin đảm bảo tính tin cậy của toàn bộ hệ sinh '",
"Gym Owner đảm bảo tính tin cậy của toàn bộ hệ sinh '")
content = content.replace(
"'thái thông qua kiểm duyệt và xử lý tranh chấp. Timer và Payment Gateway duy trì tính '",
"'thái thông qua kiểm duyệt và xử lý tranh chấp trên toàn nền tảng. Timer và Payment Gateway duy trì tính '")

content = content.replace(
"bold_parts=['Food Vendor', 'Gear Seller', 'Gym Owner', 'Admin', 'Timer', 'Payment Gateway']",
"bold_parts=['Food Vendor', 'Gear Seller', 'Gym Owner', 'Timer', 'Payment Gateway']")


# 7. Update Relationship matrix table code
content = content.replace(
"actors = ['Guest', 'Member', 'Food Vendor', 'Gear Seller', 'Gym Owner', 'Admin', 'Timer', 'Payment GW']",
"actors = ['Guest', 'Member', 'Food Vendor', 'Gear Seller', 'Gym Owner', 'Timer', 'Payment GW']")

content = content.replace(
"""    ('Food Vendor', 'Admin'):         '✅ Được duyệt',
    ('Gear Seller', 'Admin'):         '✅ Listing duyệt',
    ('Gym Owner',   'Admin'):         '✅ Được duyệt',
    ('Admin',       'Timer'):         '⚙ Cấu hình',
    ('Admin',       'Payment GW'):    '⚙ Giám sát',""",
"""    ('Food Vendor', 'Gym Owner'):     '✅ Được duyệt',
    ('Gear Seller', 'Gym Owner'):     '✅ Listing duyệt',
    ('Gym Owner',   'Timer'):         '⚙ Cấu hình',
    ('Gym Owner',   'Payment GW'):    '⚙ Giám sát',""")


with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated generate_stakeholder_doc.py")
