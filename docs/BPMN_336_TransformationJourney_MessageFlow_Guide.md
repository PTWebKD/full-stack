# Hướng dẫn nối Message Flow — 3.3.6 Transformation Journey Engine

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## 3.3.6 — Message flows

1. **Bấm HOÀN THÀNH BUỔI TẬP** (`m_finishbtn` — pool *Member*)  →  **Nhận event 'hoàn thành buổi tập'** (`s_recvevent` — pool *Hệ thống FitFuel+*)
2. **Tạo R8 recommendation** (`s_r8` — pool *Hệ thống FitFuel+*)  →  **Xem R7 / R8 / R9** (`g_viewrec` — pool *GymOwner*)
3. **B4: Chọn trình độ (beginner/intermediate/ advanced)** (`o_b4` — pool *Member*)  →  **Nhận yêu cầu gợi ý chương trình** (`sys_recvb4` — pool *Hệ thống FitFuel+*)
4. **Kết thúc** (`sys_endsuggest` — pool *Hệ thống FitFuel+*)  →  **Chờ gợi ý chương trình** (`o_wait5` — pool *Member*)
5. **Chọn 1 chương trình** (`o_choose` — pool *Member*)  →  **Nhận lựa chọn chương trình** (`sys_recvchoose` — pool *Hệ thống FitFuel+*)
6. **Kết thúc** (`sys_endcreate` — pool *Hệ thống FitFuel+*)  →  **Chờ tạo goal & program** (`o_waitcreate` — pool *Member*)
7. **Bấm BẮT ĐẦU TẬP THEO CHƯƠNG TRÌNH (tự động chọn nhóm cơ)** (`m_startprog` — pool *Member*)  →  **Nhận yêu cầu sinh buổi tập** (`sys_recvsession` — pool *Hệ thống FitFuel+*)
8. **CHỌN NHÓM CƠ HÔM NAY (Chân / Ngực / Lưng+Vai / Toàn thân / Tự chọn)** (`m_choosemuscle` — pool *Member*)  →  **Nhận yêu cầu sinh buổi tập** (`sys_recvsession` — pool *Hệ thống FitFuel+*)
9. **Kết thúc** (`sys_endsession1` — pool *Hệ thống FitFuel+*)  →  **Chờ hệ thống sinh buổi tập** (`m_waitsession` — pool *Member*)
10. **Kết thúc** (`sys_endsession2` — pool *Hệ thống FitFuel+*)  →  **Chờ hệ thống sinh buổi tập** (`m_waitsession` — pool *Member*)
11. **Thêm / Bớt / Sửa bài tập** (`m_customize` — pool *Member*)  →  **Nhận yêu cầu lưu customization** (`sys_recvcustom` — pool *Hệ thống FitFuel+*)


Tổng cộng: **11 message flow** cần nối thủ công.
