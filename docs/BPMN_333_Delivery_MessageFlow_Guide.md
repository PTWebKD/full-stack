# Hướng dẫn nối Message Flow — 3.3.3 Delivery & Quản lý đơn hàng

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## 3.3.3 — Message flows

1. **[Call Activity] Thanh toán online (SP-01)** (`m_pay` — pool *Member*)  →  **Nhận thanh toán thành công** (`sys_recvpay` — pool *Hệ thống FitFuel+*)
2. **Kết thúc** (`sys_end_createorder` — pool *Hệ thống FitFuel+*)  →  **Nhận đơn mới tại /gym-owner/orders** (`g_start` — pool *GymOwner*)
3. **Xác nhận sẵn sàng** (`g_confirm` — pool *GymOwner*)  →  **Nhận tín hiệu từ GymOwner** (`h_start1` — pool *Hệ thống FitFuel+*)
4. **Kích hoạt Subprocess: Quy trình giao hàng bên thứ 3 (+)** (`g_activate` — pool *GymOwner*)  →  **Nhận bàn giao** (`sp_start` — pool *Đơn vị vận chuyển (Bên thứ 3)*)
5. **QUY TRÌNH GIAO HÀNG BÊN THỨ 3 (+) (GHN/Ahamove: điều phối shipper → lấy hàng → giao hàng → gửi webhook báo kết quả)** (`sp_task` — pool *Đơn vị vận chuyển (Bên thứ 3)*)  →  **Nhận webhook từ Subprocess (+)** (`h_start2` — pool *Hệ thống FitFuel+*)
6. **Gửi NOTIFICATIONS cho Member** (`h_notify` — pool *Hệ thống FitFuel+*)  →  **Theo dõi status trên Web App** (`m_track` — pool *Member*)
7. **Gửi cảnh báo giao hàng thất bại cho GymOwner** (`h_notifyfail` — pool *Hệ thống FitFuel+*)  →  **Nhận cảnh báo giao hàng thất bại từ hệ thống** (`g_start2` — pool *GymOwner*)
8. **Hủy đơn** (`m_cancel` — pool *Member*)  →  **Nhận yêu cầu hủy đơn (Member)** (`sys_recvcancel` — pool *Hệ thống FitFuel+*)
9. **Bấm hủy đơn (giao hàng thất bại)** (`g_cancelship` — pool *GymOwner*)  →  **Nhận yêu cầu hủy đơn (GymOwner)** (`sys_recvcancel2` — pool *Hệ thống FitFuel+*)


Tổng cộng: **9 message flow** cần nối thủ công.
