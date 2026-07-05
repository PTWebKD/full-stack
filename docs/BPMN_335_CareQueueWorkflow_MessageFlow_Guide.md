# Hướng dẫn nối Message Flow — 3.3.5 Care Queue Workflow

Sơ đồ `.drawio` chỉ chứa **Sequence Flow**. Toàn bộ **Message Flow** (giao tiếp giữa các pool khác nhau) được liệt kê dưới đây theo kiểu **task này → task kia**, nối tay trong draw.io theo đúng thứ tự.

## Cách vẽ 1 Message Flow trong draw.io

1. Vẽ 1 cạnh thường giữa 2 shape, bấm chuột phải → Edit Style → dán:
   ```
   edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=open;endFill=1;
   ```
2. Kéo 2 đầu mũi tên đúng theo danh sách bên dưới (mở file `.drawio`, tìm shape theo tên và id ghi trong ngoặc). Có thể thêm waypoint (click giữa cạnh, kéo) để né task khác.


## 3.3.5 Care Queue — Message flows

1. **Gia hạn / check-in** (`m_selfserve` — pool *Member (Passive)*)  →  **Nhận sự kiện gia hạn** (`s_recvrenew` — pool *Hệ thống FitFuel+*)
2. **Gửi tin nhắn/email nhắc nhở qua hệ thống** (`g_action` — pool *GymOwner / Nhân viên*)  →  **Nhận tin nhắn/email nhắc nhở** (`m_wait` — pool *Member (Passive)*)
3. **Kết thúc** (`g_end` — pool *GymOwner / Nhân viên*)  →  **Nhận kết quả chăm sóc từ GymOwner** (`s_recvresult` — pool *Hệ thống FitFuel+*)


Tổng cộng: **3 message flow** cần nối thủ công.
