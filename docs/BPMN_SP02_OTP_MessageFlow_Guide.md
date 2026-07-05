# Hướng dẫn nối Message Flow — SP-02 Xác thực OTP Guest

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## SP-02 — Message flows

1. **Nhập số điện thoại** (`g_inputphone` — pool *Guest*)  →  **Nhận yêu cầu gửi OTP** (`s_recvreq` — pool *Hệ thống FitFuel+*)
2. **Gửi qua SMS gateway** (`s_sendsms` — pool *Hệ thống FitFuel+*)  →  **Chờ SMS** (`g_waitsms` — pool *Guest*)
3. **Return: SUCCESS + session_token** (`g_endsuccess` — pool *Guest*)  →  **Nhận xác thực thành công** (`s_recvverify` — pool *Hệ thống FitFuel+*)
4. **Thông báo mã hết hạn, yêu cầu gửi lại mã mới** (`g_expired` — pool *Guest*)  →  **Nhận yêu cầu gửi OTP** (`s_recvreq` — pool *Hệ thống FitFuel+*)


Tổng cộng: **4 message flow** cần nối thủ công.
