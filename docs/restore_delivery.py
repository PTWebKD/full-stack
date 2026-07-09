import re

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'r', encoding='utf-8') as f:
    content = f.read()

delivery_content = """
### 3.3.11. Delivery và quản lý đơn hàng

| Mã YC | Actor | Yêu cầu chức năng | Ưu tiên | Use case |
|---|---|---|---|---|
| FR-066 | Member | Hệ thống cho phép Member thêm, sửa, xóa và đặt mặc định địa chỉ giao hàng. | Cao | UC-08, UC-09 |
| FR-067 | Member, Guest | Hệ thống cho phép chọn hình thức nhận hàng: lấy tại quầy hoặc giao hàng. Nếu chọn giao hàng, người dùng phải cung cấp địa chỉ nhận. | Cao | UC-08, UC-09 |
| FR-068 | Hệ thống | Hệ thống tính phí giao hàng real-time, miễn phí giao hàng cho đơn từ 200.000 VND trở lên. | Cao | UC-08, UC-09 |
| FR-069 | Hệ thống | Đơn giao hàng bắt buộc thanh toán online trước khi xác nhận; không hỗ trợ COD. | Cao | UC-08, UC-09 |
| FR-070 | Gym Owner | Hệ thống cho phép Gym Owner xác nhận đơn, chuyển trạng thái sang đang chuẩn bị và tạo đơn vận chuyển qua GHN/Ahamove hoặc mock provider. | Cao | UC-13 |
| FR-071 | Member, Guest | Hệ thống cho phép theo dõi trạng thái đơn hàng theo luồng: chờ xác nhận, đang chuẩn bị, đã giao shipper, đang giao, đã nhận hoặc đã hủy. | Cao | UC-08, UC-09 |
| FR-072 | Hệ thống | Hệ thống gửi notification khi trạng thái đơn hàng thay đổi. | Trung bình | UC-08, UC-09 |
| FR-073 | Member, Gym Owner | Hệ thống cho phép hủy đơn trước khi shipper lấy hàng và xử lý hoàn tiền/mở khóa FitCoin theo quy tắc nghiệp vụ. | Trung bình | UC-08, UC-09 |

## 3.4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)"""

content = content.replace("## 3.4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)", delivery_content)

with open('d:\\doanWEDKD\\docs\\02_Requirements.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done restoring delivery section.")
