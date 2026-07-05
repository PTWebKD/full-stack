# Hướng dẫn nối Message Flow — 3.3.7 Gear Marketplace

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## 3.3.7 — Message flows

1. **[Call Activity] Thanh toán (SP-01)** (`g_pay` — pool *Guest*)  →  **Nhận SP-01 SUCCESS (bán gear)** (`s_recv1` — pool *Hệ thống FitFuel+*)
2. **[Call Activity] Thanh toán (SP-01)** (`m2_pay` — pool *Member*)  →  **Nhận SP-01 SUCCESS (bán gear)** (`s_recv1` — pool *Hệ thống FitFuel+*)
3. **[Call Activity] Thanh toán (SP-01)** (`m_pay` — pool *Member*)  →  **Nhận SP-01 SUCCESS (thuê gear)** (`s_recv2` — pool *Hệ thống FitFuel+*)
4. **<= 7 ngày & đang thuê < 3 gear (BR-49)?** (`m_gwlimit` — pool *Member*)  →  **Nhận yêu cầu tính phí thuê** (`s_recvcalc` — pool *Hệ thống FitFuel+*)
5. **Kết thúc** (`s_endcalc` — pool *Hệ thống FitFuel+*)  →  **Chờ tính deposit + fee** (`m_waitcalc` — pool *Member*)
6. **Chọn tình trạng trả: nguyên vẹn/hư nhẹ/ hư nặng/mất** (`gy_condition` — pool *GymOwner (xác nhận trả gear qua web)*)  →  **Nhận xác nhận tình trạng trả gear** (`s_recvreturn` — pool *Hệ thống FitFuel+*)


Tổng cộng: **6 message flow** cần nối thủ công.
