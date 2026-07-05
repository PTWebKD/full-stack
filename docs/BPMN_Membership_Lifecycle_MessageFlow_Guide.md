# Hướng dẫn nối Message Flow — BPMN Vòng đời hội viên (3.3.4)

Sơ đồ `.drawio` chỉ chứa **Sequence Flow** (mũi tên đặc, trong cùng 1 pool). Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) đã được bỏ khỏi file để tránh chồng chéo lên task, danh sách dưới đây liệt kê đầy đủ để bạn tự nối tay trong draw.io.

## Cách vẽ 1 Message Flow trong draw.io

1. Mở panel Shape bên trái, tìm mục **BPMN** (hoặc gõ tìm "message flow" trong ô Search Shapes).
2. Kéo thả cạnh **Message Flow** (đường nét đứt, đầu mũi tên tròn rỗng `o->`) vào canvas — hoặc đơn giản hơn: vẽ 1 cạnh thường rồi bấm chuột phải → Edit Style → dán style sau:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
3. Kéo 2 đầu mũi tên gắn vào đúng 2 shape nguồn/đích theo bảng bên dưới. Vì bạn nối tay, bạn có thể chủ động bẻ cong / thêm điểm gấp khúc (waypoint) để né các task khác — click giữa cạnh và kéo để tạo điểm gấp.
4. Toạ độ ước lượng của từng shape đã cho sẵn (x,y tuyệt đối trên canvas) để bạn dễ định vị. Muốn xem chính xác: mở `BPMN_Membership_Lifecycle.drawio`, click vào shape, xem Arrange panel.


## Luồng A — Đăng ký Online

| # | Từ (nguồn) | Pool nguồn | Đến (đích) | Pool đích |
|---|---|---|---|---|
| a_msg1 | **[Call Activity] Thanh toán online (SP-01)** (`a_m_pay`) | Member / Khách hàng | **Nhận yêu cầu thanh toán** (`a_s_recvpay`) | Hệ thống FitFuel+ |
| a_msg2 | **Kết thúc giao dịch thất bại** (`a_s_fail`) | Hệ thống FitFuel+ | **Nhận phản hồi thanh toán** (`a_m_recvpay`) | Member / Khách hàng |
| a_msg3 | **Tạo USERS, kích hoạt GYM_MEMBERSHIPS** (`a_s_createuser`) | Hệ thống FitFuel+ | **Nhận phản hồi thanh toán** (`a_m_recvpay`) | Member / Khách hàng |
| a_msg4 | **Gửi SMS mật khẩu tạm thời** (`a_s_sms`) | Hệ thống FitFuel+ | **Nhận SMS mật khẩu tạm** (`a_m_recvsms`) | Member / Khách hàng |

## Luồng B — Gia hạn

| # | Từ (nguồn) | Pool nguồn | Đến (đích) | Pool đích |
|---|---|---|---|---|
| b_msg1 | **[Call Activity] Thanh toán (SP-01)** (`b_m_pay`) | Member / Khách hàng | **Nhận yêu cầu gia hạn đã thanh toán** (`b_s_recv`) | Hệ thống FitFuel+ |
| b_msg2 | **Gửi xác nhận gia hạn** (`b_s_notify`) | Hệ thống FitFuel+ | **Nhận xác nhận gia hạn + FitCoin** (`b_m_recv`) | Member / Khách hàng |

## Luồng C — Chuyển gói Tháng → Năm

| # | Từ (nguồn) | Pool nguồn | Đến (đích) | Pool đích |
|---|---|---|---|---|
| c_msg1 | **Chọn 'Chuyển sang Gói Năm'** (`c_m_choose`) | Member / Khách hàng | **Nhận yêu cầu chuyển gói** (`c_s_start`) | Hệ thống FitFuel+ |
| c_msg2 | **Cảnh báo, gợi ý đợi hết hạn để tối ưu chi phí** (`c_s_warn`) | Hệ thống FitFuel+ | **Chờ phản hồi kiểm tra điều kiện** (`c_m_recvcheck`) | Member / Khách hàng |
| c_msg3 | **Tính phí chênh lệch (giá Năm - giá Tháng)/30 × số ngày còn lại (BR-07)** (`c_s_calcfee`) | Hệ thống FitFuel+ | **Chờ phản hồi kiểm tra điều kiện** (`c_m_recvcheck`) | Member / Khách hàng |
| c_msg4 | **Tính phí chênh lệch (giá Năm - giá Tháng)/30 × số ngày còn lại (BR-07)** (`c_s_calcfee`) | Hệ thống FitFuel+ | **Xem phí chênh lệch** (`c_m_recvfee`) | Member / Khách hàng |
| c_msg5 | **[Call Activity] Thanh toán phí chênh lệch (SP-01)** (`c_m_pay`) | Member / Khách hàng | **Nhận thanh toán phí chênh lệch** (`c_s_recvpay`) | Hệ thống FitFuel+ |
| c_msg6 | **Gửi xác nhận đổi gói** (`c_s_notify`) | Hệ thống FitFuel+ | **Nhận xác nhận đổi gói** (`c_m_recvresult`) | Member / Khách hàng |

## Luồng D — Bảo lưu

| # | Từ (nguồn) | Pool nguồn | Đến (đích) | Pool đích |
|---|---|---|---|---|
| d_msg1 | **Gửi yêu cầu bảo lưu (BR-08: tối đa 1 lần/năm, <= 60 ngày)** (`d_m_request`) | Member / Khách hàng | **Nhận yêu cầu bảo lưu** (`d_g_recv`) | GymOwner / Nhân viên |
| d_msg2 | **Từ chối + ghi lý do** (`d_g_reject`) | GymOwner / Nhân viên | **Chờ kết quả phê duyệt** (`d_m_recvresult`) | Member / Khách hàng |
| d_msg3 | **Duyệt yêu cầu** (`d_g_approve`) | GymOwner / Nhân viên | **Chờ kết quả phê duyệt** (`d_m_recvresult`) | Member / Khách hàng |
| d_msg4 | **Duyệt yêu cầu** (`d_g_approve`) | GymOwner / Nhân viên | **Nhận phê duyệt bảo lưu** (`d_s_recv1`) | Hệ thống FitFuel+ |
| d_msg5 | **Cập nhật GYM_MEMBERSHIPS.status = 'suspended'** (`d_s_suspend`) | Hệ thống FitFuel+ | **Gói tập chuyển trạng thái 'Tạm ngưng'** (`d_m_suspended`) | Member / Khách hàng |
| d_msg6 | **Gửi yêu cầu kích hoạt lại** (`d_m_reactivate`) | Member / Khách hàng | **Nhận yêu cầu kích hoạt lại** (`d_s_recv2`) | Hệ thống FitFuel+ |
| d_msg7 | **Gửi xác nhận kích hoạt lại** (`d_s_notify`) | Hệ thống FitFuel+ | **Nhận xác nhận kích hoạt lại** (`d_m_recvfinal`) | Member / Khách hàng |


Tổng cộng: **19 message flow** cần nối thủ công.
