# Hướng dẫn nối Message Flow — 3.3.2 Dinh dưỡng nội bộ

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## 3.3.2 — Message flows

1. **Member hoàn thành buổi tập** (`b_finish` — pool *Member*)  →  **Nhận yêu cầu gợi ý sản phẩm** (`sys_recv_suggest` — pool *Hệ thống FitFuel+*)
2. **Kết thúc** (`sys_suggest_end` — pool *Hệ thống FitFuel+*)  →  **Chờ gợi ý từ AI Engine** (`b_waitsuggest` — pool *Member*)
3. **Kết thúc** (`b_end2` — pool *Member*)  →  **Nhận thanh toán thành công (pre-order)** (`sys_recv_b` — pool *Hệ thống FitFuel+*)
4. **Kết thúc** (`sys_end_b` — pool *Hệ thống FitFuel+*)  →  **Nhận thông báo đơn pre-order / Guest mới** (`s_start` — pool *GymOwner (quản lý đơn qua web)*)
5. **Kết thúc** (`g_end3` — pool *Guest*)  →  **Nhận thanh toán thành công (Guest order)** (`sys_recv_g` — pool *Hệ thống FitFuel+*)
6. **Kết thúc** (`sys_end_g` — pool *Hệ thống FitFuel+*)  →  **Nhận thông báo đơn pre-order / Guest mới** (`s_start` — pool *GymOwner (quản lý đơn qua web)*)
7. **Chuyển status = 'done' (sau khi khách nhận hàng)** (`s_done` — pool *GymOwner (quản lý đơn qua web)*)  →  **Nhận event status thay đổi** (`h_start` — pool *Hệ thống FitFuel+*)


Tổng cộng: **7 message flow** cần nối thủ công.
