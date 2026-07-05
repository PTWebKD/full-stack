# Hướng dẫn nối Message Flow — SP-01 Xử lý Thanh toán

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## SP-01 — Message flows

1. **Return: SUCCESS** (`m_endsuccess` — pool *Member / Guest (người mua)*)  →  **Nhận Return SUCCESS** (`s_recvok` — pool *Hệ thống FitFuel+*)
2. **Return: FAILED** (`m_endfail` — pool *Member / Guest (người mua)*)  →  **Nhận Return FAILED** (`s_recvfail` — pool *Hệ thống FitFuel+*)
3. **Redirect sang Payment Gateway** (`m_redirect` — pool *Member / Guest (người mua)*)  →  **Nhận yêu cầu** (`p_recv` — pool *Payment Gateway*)
4. **Gửi callback kết quả** (`p_callback` — pool *Payment Gateway*)  →  **Chờ webhook callback** (`m_waitcb` — pool *Member / Guest (người mua)*)
5. **Nhập số FitCoin muốn dùng** (`m_inputfc` — pool *Member / Guest (người mua)*)  →  **Nhận yêu cầu áp dụng FitCoin** (`s_recvfcreq` — pool *Hệ thống FitFuel+*)
6. **Kết thúc** (`s_endfc1` — pool *Hệ thống FitFuel+*)  →  **Chờ kết quả áp dụng FitCoin** (`m_waitfcresult` — pool *Member / Guest (người mua)*)
7. **Kết thúc (từ chối)** (`s_endfc2` — pool *Hệ thống FitFuel+*)  →  **Chờ kết quả áp dụng FitCoin** (`m_waitfcresult` — pool *Member / Guest (người mua)*)


Tổng cộng: **7 message flow** cần nối thủ công.
