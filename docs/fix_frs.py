import re

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    # FR-024
    "Hệ thống hỗ trợ POS bán sản phẩm dinh dưỡng tại quầy cho Member hoặc Guest đã xác thực OTP.": 
    "Hệ thống hỗ trợ POS bán sản phẩm dinh dưỡng tại quầy cho Member. Chỉ bán nội bộ, không áp dụng cho Guest.",
    
    # FR-058
    "Hệ thống cho phép Guest xác thực bằng số điện thoại và OTP 6 số để mua food/gear/supplement; session sau xác thực có hiệu lực 2 giờ.":
    "Hệ thống cho phép Guest/Visitor xác thực bằng số điện thoại và OTP 6 số để đăng ký tài khoản trải nghiệm (Free Trial / Gym Tour); session khách có hiệu lực 2 giờ.",
    
    "| FR-058 | Guest |": "| FR-058 | Guest, Visitor |",
    
    # FR-060
    "| FR-060 | Gym Owner, Member, Guest | Hệ thống cho phép bán gear tại quầy hoặc online, tạo hóa đơn `gear_sale` và trừ tồn kho.":
    "| FR-060 | Gym Owner, Member | Hệ thống cho phép bán gear tại quầy hoặc online cho Member, tạo hóa đơn `gear_sale` và trừ tồn kho.",
    
    # FR-067
    "| FR-067 | Member, Guest | Hệ thống cho phép chọn hình thức nhận hàng: lấy tại quầy hoặc giao hàng. Nếu chọn giao hàng, người dùng phải cung cấp địa chỉ nhận.":
    "| FR-067 | Member | Hệ thống cho phép Member chọn hình thức nhận hàng: lấy tại quầy hoặc giao hàng. Nếu chọn giao hàng, Member cung cấp địa chỉ nhận.",
    
    # FR-071
    "| FR-071 | Member, Guest | Hệ thống cho phép theo dõi trạng thái đơn hàng theo luồng: chờ xác nhận, đang chuẩn bị, đã giao shipper, đang giao, đã nhận hoặc đã hủy.":
    "| FR-071 | Member | Hệ thống cho phép Member theo dõi trạng thái đơn hàng theo luồng: chờ xác nhận, đang chuẩn bị, đã giao shipper, đang giao, đã nhận hoặc đã hủy."
}

for old_str, new_str in replacements.items():
    if old_str in content:
        content = content.replace(old_str, new_str)
    else:
        print(f"Warning: String not found:\n{old_str}")

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done fixing requirements for user centric UX.")
