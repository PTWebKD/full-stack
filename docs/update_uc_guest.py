import re

with open('d:\\doanWEDKD\\docs\\03_Actor_UseCase.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    # UC-08
    "Member thêm sản phẩm vào giỏ hàng.": 
    "Member (hoặc Guest sau khi xác thực OTP) thêm sản phẩm vào giỏ hàng.",
    
    "* *1a. Chủ động mua:* Member tự vào cửa hàng (Store) chọn sản phẩm và thanh toán.":
    "* *1a. Chủ động mua:* Member/Guest tự vào cửa hàng (Store) chọn sản phẩm và thanh toán.",
    
    # UC-09
    "* **Tóm tắt (Description):** Member thuê các thiết bị tập luyện nâng cao (đai, bao tay) hoặc mua phụ kiện.":
    "* **Tóm tắt (Description):** Hội viên thuê các thiết bị tập luyện nâng cao (Guest không được thuê) hoặc tiến hành mua phụ kiện (Guest được mua qua xác thực OTP).",
    
    "* **Tiền điều kiện (Pre-conditions):** Member (chỉ Member mới được thuê).":
    "* **Tiền điều kiện (Pre-conditions):** Member (nếu thuê). Guest hoặc Member (nếu mua).",
    
    "1. Member duyệt danh sách dụng cụ (Gear Marketplace).":
    "1. Member/Guest duyệt danh sách dụng cụ (Gear Marketplace).",
    
    # UC-16
    "* **Tiền điều kiện (Pre-conditions):** Một Actor (Visitor/Member) đã tạo giỏ hàng hoặc xác nhận mua một dịch vụ/sản phẩm có giá trị lớn hơn 0 VND.":
    "* **Tiền điều kiện (Pre-conditions):** Một Actor (Guest/Member) đã tạo giỏ hàng hoặc xác nhận mua một dịch vụ/sản phẩm có giá trị lớn hơn 0 VND (yêu cầu Guest xác thực OTP với đơn hàng phụ kiện/đồ uống).",
    
    # UC-02
    "Cho phép Visitor đăng ký gói trải nghiệm miễn phí hoặc đặt lịch tham quan phòng tập. Quá trình này bao gồm việc xác thực định danh cơ bản qua số điện thoại nhằm chống spam.":
    "Cho phép Visitor đăng ký gói trải nghiệm miễn phí, đặt lịch tham quan phòng tập hoặc thanh toán giỏ hàng (Gear/Food). Khách phải xác thực OTP qua số điện thoại. Phiên khách có hiệu lực 2 giờ.",
    
    # Update Actor table
    "| **Visitor / Guest** | Primary | Người dùng chưa có tài khoản hoặc chưa mua gói hội viên. Mục tiêu chính là tìm hiểu thông tin, nhận tư vấn, và tham gia các luồng trải nghiệm (Free Trial, Gym Tour). |":
    "| **Visitor / Guest** | Primary | Người dùng chưa có tài khoản hoặc chưa mua gói hội viên. Mục tiêu chính là tìm hiểu thông tin, nhận tư vấn, tham gia luồng trải nghiệm (Free Trial, Gym Tour) và mua hàng trực tuyến (Gear/Nutrition). |"
}

for old_str, new_str in replacements.items():
    if old_str in content:
        content = content.replace(old_str, new_str)
    else:
        print(f"Warning: String not found:\n{old_str}")

with open('d:\\doanWEDKD\\docs\\03_Actor_UseCase.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done updating Actor_UseCase for Guest permissions.")
