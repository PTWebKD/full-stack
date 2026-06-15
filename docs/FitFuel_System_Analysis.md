# FITFUEL+ — TAI LIEU PHAN TICH THIET KE HE THONG
# (System Analysis & Design Document)

> Do an mon: Web Kinh Doanh
> Cap nhat: 14/06/2026 (Sua BR-11B: Gym Owner chi ban, Member chi cho thue Peer-to-Peer)

---

## MUC LUC

1. Phat bieu bai toan (Problem Statement)
2. Pham vi he thong (System Scope)
3. Yeu cau chuc nang va phi chuc nang
4. Xac dinh Actor
5. Use Case Diagram tong the
6. Use Case Specifications (Mo ta chi tiet)
7. Activity Diagram (Bieu do hoat dong)
8. Sequence Diagram (Bieu do tuan tu)
9. ERD (Entity Relationship Diagram)
10. Data Dictionary (Tu dien du lieu)
11. DFD (Data Flow Diagram)
12. Class Diagram
13. Sitemap (So do trang web)
14. Business Rules (Quy tac nghiep vu)

---

## 1. PHAT BIEU BAI TOAN

### 1.1 Van de hien tai

Nguoi tap gym tai Viet Nam dang gap cac van de sau:

(a) Khong co cong cu theo doi tien do tap luyen mot cach he thong. Phan lon ghi
    bang tay hoac khong ghi, dan den khong biet minh co tien bo hay khong.

(b) Khong biet nen an gi sau buoi tap. Thong tin dinh duong tran lan nhung khong
    co su ket noi giua "hom nay tap gi" va "nen an gi".

(c) Thieu thiet bi tap nhung khong muon mua moi vi dat hoac chua biet co phu hop
    khong. Khong co noi nao cho thue thiet bi gym dang tin cay.

(d) Mua thiet bi cu tren Shopee/Facebook khong co dam bao ve chat luong va lich su
    su dung cua thiet bi.

### 1.2 Giai phap de xuat

FitFuel+ la nen tang web ket hop 3 mang trong 1 he sinh thai:
- Gym Tracking: theo doi buoi tap, tien do, streak
- Healthy Food Order: dat do an healthy voi macro phu hop buoi tap
- Gear Hub: thue/mua/ban thiet bi gym cu co lich su minh bach

Diem ket noi trung tam la Fitness Passport — ho so the hinh ca nhan ghi lai
toan bo hanh trinh: buoi tap, bua an, thiet bi, milestone.

### 1.3 Muc tieu he thong

- Cho phep user log buoi tap va theo doi tien do tang tien
- Goi y bua an phu hop dua tren nhom co vua tap (rule-based)
- Cho phep dat do an healthy voi day du thong tin macro
- Ho tro guest checkout khong can dang ky tai khoan
- Cho phep thue/mua/ban thiet bi gym voi Gear Lifecycle minh bach
- Gamification (XP, badge, streak, ranking) de tang dong luc
- Dashboard cho Food Vendor va Gym Owner (B2B)
- Member dang ky tai khoan qua Checkout Modal (mua goi tap) truc tiep tren Landing Page
- Goi tap don gian: 1 hang thanh vien, 2 chu ky thanh toan (Thang 499K / Nam 4.99M)
- Admin Panel (Gym Owner) quan ly user, vendor, tranh chap, bao cao

---

## 2. PHAM VI HE THONG

### 2.1 Trong pham vi (In Scope)

- Quan ly tai khoan (dang ky qua Checkout Modal, dang nhap, guest OTP, profile)
- Gym tracking (session, exercise log, PR, progress chart)
- Food order (browse, filter, cart, checkout, re-order, meal prep)
- Gear Hub (listing, lifecycle, thue, mua, ban, QR code)
- AI Food Suggestion (rule-based, khong dung ML)
- AI FitBot Assistant (tro ly AI tich hop)
- TDEE Calculator va Macro Dashboard
- Gamification (XP, level, badge, streak, challenge, ranking)
- FitCoin credit system
- Social Feed co ban (milestone post, follow)
- Notification system
- Food Vendor Portal
- Gym Owner Dashboard
- Admin Panel (Gym Owner): Quan ly user, vendor, tranh chap, bao cao
- Membership Checkout Modal (dang ky + thanh toan tich hop)

### 2.2 Ngoai pham vi (Out of Scope)

- Tich hop wearable device (Apple Watch, Fitbit)
- Video call voi PT (Personal Trainer)
- Live streaming buoi tap
- Chat real-time giua user
- Thanh toan that (chi dung sandbox)
- Mobile app native (chi lam responsive web)
- 3D food rendering
- AI/ML phuc tap (chi dung rule-based)

---

## 3. YEU CAU CHUC NANG VA PHI CHUC NANG

### 3.3 Yeu cau chuc nang (Functional Requirements)

#### 3.3.1. Quan ly tai khoan

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-ACC-01   | Dang ky tai khoan          | Thanh vien (Member) dang ky truc tiep qua Modal Mua goi tap (Checkout Modal). Doi tac (Vendor/Gym Owner) dang ky qua trang xac thuc rieng biet. | Cao
FR-ACC-02   | Dang nhap he thong         | Xac thuc thong tin dang nhap va cap JWT token                                                                        | Cao
FR-ACC-03   | Guest Checkout (OTP)       | Cho phep khach xac thuc qua OTP khi chua co tai khoan                                                                | Cao
FR-ACC-04   | Hop nhat tai khoan         | Dong bo du lieu Guest vao Member khi cung SDT                                                                        | Trung binh
FR-ACC-05   | Cap nhat ho so             | Cho phep cap nhat thong tin ca nhan va muc tieu the hinh                                                             | Cao
FR-ACC-06   | Fitness Passport           | Hien thi ho so tap luyen, thanh tich va huy hieu                                                                     | Cao

#### 3.3.2. Gym Tracking

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-GYM-01   | Tao buoi tap               | Tao buoi tap theo ngay va nhom co                                                                                    | Cao
FR-GYM-02   | Ghi nhan bai tap           | Nhap set, reps, weight cho tung bai tap                                                                              | Cao
FR-GYM-03   | Personal Record            | Tu dong xac dinh ky luc ca nhan                                                                                     | Cao
FR-GYM-04   | Bieu do tien do            | Hien thi tien trinh tap luyen theo thoi gian                                                                         | Trung binh
FR-GYM-05   | Lich su tap luyen          | Xem lai cac buoi tap truoc do                                                                                        | Cao
FR-GYM-06   | Goi y nhom co              | De xuat nhom co nen tap                                                                                              | Trung binh
FR-GYM-07   | Check-in QR                | Check-in tai phong gym bang QR                                                                                       | Thap
FR-GYM-08   | Dashboard tap luyen        | Thong ke volume, streak, tan suat                                                                                    | Trung binh

#### 3.3.3. Food Order

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-FOOD-01  | Danh sach mon an           | Hien thi mon an voi bo loc dinh duong                                                                                | Cao
FR-FOOD-02  | Chi tiet mon an            | Hien thi macro, nguyen lieu, di ung                                                                                  | Cao
FR-FOOD-03  | Them vao gio               | Them nhanh san pham vao gio hang                                                                                     | Cao
FR-FOOD-04  | Gio hang dong              | Chinh sua so luong, size, topping                                                                                    | Cao
FR-FOOD-05  | Thanh toan Member          | Quy trinh checkout cho user dang ky                                                                                  | Cao
FR-FOOD-06  | Thanh toan Guest           | Thanh toan qua OTP                                                                                                   | Cao
FR-FOOD-07  | Re-order                   | Dat lai don hang cu nhanh                                                                                            | Trung binh
FR-FOOD-08  | Goi y mon an               | Goi y mon theo macro sau tap                                                                                         | Cao
FR-FOOD-09  | TDEE Calculator            | Tinh nhu cau calo ca nhan                                                                                            | Trung binh
FR-FOOD-10  | Macro Dashboard            | Theo doi dinh duong hang ngay                                                                                        | Trung binh
FR-FOOD-11  | Danh gia san pham          | Rating va review mon an                                                                                              | Thap
FR-FOOD-12  | Meal Prep                  | Dat don dinh ky                                                                                                      | Thap

#### 3.3.4. Gear Hub

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-GEAR-01  | Danh sach thiet bi         | Hien thi thiet bi voi bo loc                                                                                         | Cao
FR-GEAR-02  | Vong doi thiet bi          | Hien thi lich su su dung                                                                                             | Cao
FR-GEAR-03  | Thue thiet bi              | Thue voi phi va tien coc                                                                                             | Cao
FR-GEAR-04  | Mua thiet bi               | Mua va chuyen quyen so huu                                                                                           | Cao
FR-GEAR-05  | Ky gui thiet bi            | Dang ky ky gui thiet bi                                                                                              | Trung binh
FR-GEAR-06  | QR Code                    | Tao ma QR cho thiet bi                                                                                               | Trung binh
FR-GEAR-07  | Goi y thiet bi             | De xuat thiet bi phu hop                                                                                             | Thap

#### 3.3.5. Gamification

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-GAME-01  | He thong XP                | Tinh diem kinh nghiem                                                                                                | Trung binh
FR-GAME-02  | Huy hieu                   | Mo khoa badges                                                                                                       | Trung binh
FR-GAME-03  | Streak                     | Theo doi chuoi hoat dong                                                                                             | Trung binh
FR-GAME-04  | Challenge                  | Tao nhiem vu                                                                                                         | Thap
FR-GAME-05  | Leaderboard                | Bang xep hang                                                                                                        | Trung binh

#### 3.3.6. Thanh toan

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-PAY-01   | Xu ly thanh toan           | Tich hop VNPay/Momo                                                                                                  | Cao
FR-PAY-02   | FitCoin                    | Quan ly tien ao                                                                                                      | Cao
FR-PAY-03   | Membership                 | Tich hop luong Dang ky moi va Gia han goi tap (Goi Thang/Nam) truc tiep tren trang chu thong qua Checkout Modal 1-cham. | Cao

#### 3.3.7. Social

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-SOC-01   | Social Feed                | Tao bai dang tu dong                                                                                                 | Thap
FR-SOC-02   | Follow                     | Theo doi nguoi dung                                                                                                  | Thap
FR-SOC-03   | Referral                   | Gioi thieu ban be                                                                                                    | Thap

#### 3.3.8. Quan tri he thong

Ma YC       | Yeu cau chuc nang          | Mo ta chi tiet                                                                                                       | Muc do uu tien
------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|---------------
FR-ADM-01   | Vendor Portal              | Quan ly mon an va don hang                                                                                           | Cao
FR-ADM-02   | Analytics                  | Dashboard phan tich                                                                                                  | Trung binh
FR-ADM-03   | Gym Management             | Quan ly hoi vien                                                                                                     | Trung binh
FR-ADM-04   | Duyet doi tac              | Xet duyet Vendor/Gym                                                                                                 | Trung binh
FR-ADM-05   | Tranh chap                 | Xu ly khieu nai va hoan tien                                                                                         | Trung binh
FR-ADM-06   | Thong bao                  | Gui notification he thong                                                                                            | Trung binh

### 3.4 Yeu cau phi chuc nang (Non-functional Requirements)

#### Bang Yeu cau Phi chuc nang

Ma so    | Yeu cau phi chuc nang     | Mo ta chi tiet                                                                                                                                            | Ghi chu uu tien
---------|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------
NFR-01   | Hieu suat                 | He thong phai phan hoi cac thao tac chinh (dang nhap, tai dashboard, them vao gio, ghi nhan buoi tap) trung binh duoi 2 giay.                              | Cao
NFR-02   | Bao mat                   | Mat khau duoc ma hoa bang bcrypt; toan bo giao tiep truyen tai phai su dung HTTPS; bao ve API bang JWT.                                                    | Cao
NFR-03   | Phan quyen truy cap       | Cac vai tro: Member, Guest, Vendor, Gym Owner; moi vai tro chi duoc truy cap cac chuc nang va vung du lieu tuong ung.                                      | Cao
NFR-04   | Kha nang chiu loi         | He thong thiet ke theo module. Khi mot module (Food, Gym, Gear) gap loi, cac module khac van duy tri hoat dong doc lap.                                    | Trung binh
NFR-05   | Sao luu du lieu           | Co so du lieu duoc backup tu dong hang ngay, luu tru toi thieu 7 ban sao luu gan nhat de du phong.                                                         | Cao
NFR-06   | Giao dien nguoi dung      | Giao dien mang tinh the thao, than thien, de su dung, ho tro responsive hoan hao tren moi kich thuoc thiet bi (mobile, tablet, desktop).                  | Cao
NFR-07   | Quyen rieng tu            | Nguoi dung toan quyen kiem soat che do hien thi (Public/Private) cua ho so the hinh va hinh anh ca nhan; co quyen xoa vinh vien tai khoan.                 | Cao
NFR-08   | Kha nang bao tri          | Ma nguon tuan thu nghiem ngat coding convention, ghi log he thong chi tiet giup de dang truy vet loi, mo rong va bao tri.                                  | Trung binh

#### 3.4.1. Yeu cau giao dien nguoi dung (User Interface Requirements)

Giao dien he thong FitFuel+ duoc thiet ke theo huong hien dai, nang dong va truc quan, dam bao tinh nhat quan ve mau sac, typography va cac component tren toan bo nen tang. Thiet ke uu tien triet ly Mobile-first (uu tien trai nghiem tren thiet bi di dong) va toi uu hoa UX, giup nguoi dung co the thao tac nhanh chong ngay ca khi dang tap luyen tai phong gym ma khong mat nhieu thoi gian lam quen.

He thong ho tro hien thi responsive muot ma tren desktop, tablet va mobile. Cac thanh phan giao dien duoc to chuc theo ngu canh su dung, chi hien thi nhung chuc nang can thiet tai tung thoi diem nham giam tai nhan thuc (cognitive load) cho nguoi dung.

Moi hanh dong quan trong nhu thanh toan hoa don, dat coc thue thiet bi, ghi nhan buoi tap (Log Exercise) deu co buoc xac nhan ro rang nham han che sai sot. He thong cung cap phan hoi tuc thi thong qua cac trang thai hien thi nhu loading, success, error (vi du: hieu ung chuc mung khi pha ky luc PR, "Them vao gio thanh cong", "Loi ket noi, vui long thu lai").

Giao dien duoc tuy bien chuyen sau theo tung nhom nguoi dung:
- **Member (Hoi vien):** Giao dien tap trung vao viec theo doi tien do tap luyen, dat mon an theo muc tieu dinh duong (AI Suggestion), theo doi Gamification (XP, Streak) va san thiet bi tren Gear Hub.
- **Vendor (Nha cung cap thuc pham):** Giao dien phuc vu quan ly menu, xu ly don hang va theo doi hieu suat doanh thu.
- **Gym Owner (Chu phong tap):** Giao dien quan ly danh sach hoi vien, gia han goi tap va niem yet thiet bi kinh doanh, tong quan he thong, quan ly doi tac va phan xu cac tranh chap giao dich.

Muc tieu cua thiet ke la mang lai trai nghiem lien mach, de hieu va truyen cam hung trong toan bo hanh trinh ren luyen suc khoe cua nguoi dung.

#### 3.4.2. Cac yeu cau khac (Non-functional Requirements)

**3.4.2.1. Yeu cau ve Hieu nang**

He thong FitFuel+ phai dam bao kha nang phan hoi nhanh va on dinh trong cac tinh huong su dung thuc te, dac biet trong cac thoi diem cao diem nhu gio an trua (luong dat mon tang vot) hoac chieu toi (khung gio vang tap gym).

Cac thao tac mang tinh lien tuc nhu tai danh sach mon an, ghi nhan so lieu buoi tap (Log Set/Reps), va thao tac thanh toan phai co thoi gian phan hoi API duoi 500ms va thoi gian tai trang trung binh duoi 2 giay. He thong can toi uu hoa truy van du lieu va su dung bo nho dem (cache) khi can thiet de dam bao hieu suat khong bi suy giam khi so luong nguoi dung dong thoi tang cao.

**3.4.2.2. Yeu cau ve Bao mat & Kiem soat truy cap**

Toan bo du lieu nguoi dung bao gom thong tin ca nhan, chi so co the, lich su giao dich va du lieu the thanh toan phai duoc bao ve o muc cao nhat.

Mat khau nguoi dung bat buoc duoc ma hoa mot chieu an toan (bcrypt) truoc khi luu tru vao he thong. Tat ca cac giao tiep trao doi du lieu giua trinh duyet (Client) va may chu (Server) phai duoc ma hoa thong qua giao thuc HTTPS (SSL/TLS).

He thong ap dung co che xac thuc bang JWT Token va phan quyen (Authorization) ro rang theo vai tro. Ngoai ra, he thong tich hop cac co che chong tan cong pho bien tren khong gian mang nhu brute-force, SQL Injection va XSS de dam bao tinh toan ven cua du lieu.

**3.4.2.3. Yeu cau ve Kha nang chiu loi, Bao tri & Mo rong**

He thong FitFuel+ duoc thiet ke theo kien truc phan tach chuc nang (Modular), giup he thong co kha nang mo rong (Scale) linh hoat trong tuong lai. Viec bao tri hoac nang cap mot phan he (vi du: cap nhat thuat toan AI cho Food Order) se khong lam gian doan luong hoat dong chinh cua phan he Gym Tracking hay Gear Hub.

He thong cam ket duy tri thoi gian hoat dong on dinh (Uptime) toi thieu 99%. Moi ngoai le (Exception) hay loi phat sinh trong qua trinh thanh toan deu phai duoc ghi log (Logging) chi tiet tren server va hien thi thong bao loi than thien cho nguoi dung.

**3.4.2.4. Yeu cau dac thu ve Quyen rieng tu**

Do tinh chat dac thu cua nen tang FitFuel+ yeu cau thu thap du lieu ca nhan nhay cam (nhu chi so co the, hinh anh, thoi quen sinh hoat), he thong phai cung cap co che kiem soat du lieu chat che.

Nguoi dung co the tuy chinh trang thai hien thi ho so (Public/Private), kiem soat viec chia se du lieu ca nhan va hinh anh. He thong cung cung cap chuc nang xoa tai khoan vinh vien, dam bao tuan thu quyen rieng tu va quyen kiem soat du lieu cua nguoi dung.

---

### 3.3. MÔ HÌNH QUY TRÌNH NGHIỆP VỤ BPMN

#### 3.3.1 — Quy trình quản lý và đánh giá tiến độ tập luyện (Quy trình Gym Tracking và Gamification)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Hội viên (Member) truy cập ứng dụng và chọn chức năng “Tạo buổi tập mới”. Hệ thống tự động phân tích lịch sử tập luyện trong 7 ngày gần nhất nhằm đề xuất nhóm cơ phù hợp cho buổi tập hiện tại. Sau đó, Member nhập các thông tin cơ bản gồm ngày tập, nhóm cơ mục tiêu và ghi chú tùy chọn.
Sau khi xác nhận, hệ thống khởi tạo Workout Session với trạng thái “Active” và chuyển người dùng sang giao diện ghi nhận bài tập. Trong quá trình tập luyện, Member lựa chọn bài tập từ thư viện dữ liệu theo từng nhóm cơ và tiến hành nhập thông tin cho từng Set tập luyện gồm số lần lặp (Reps) và mức tạ (Weight).
Sau mỗi lần ghi nhận Set, hệ thống tự động thực hiện quy trình đánh giá thành tích tập luyện. Dữ liệu được kiểm tra nhằm phát hiện các giá trị bất thường trước khi đối chiếu với lịch sử tập luyện trước đó của Member. Nếu thành tích mới vượt qua kỷ lục cũ của bài tập tương ứng, hệ thống xác nhận Personal Record (PR), cộng thêm XP thưởng và hiển thị hiệu ứng chúc mừng ngay trên giao diện.
Member có thể tiếp tục thêm Set mới hoặc chuyển sang bài tập khác cho đến khi hoàn tất Workout Session. Khi người dùng chọn “Kết thúc buổi tập”, hệ thống tiến hành tổng hợp toàn bộ dữ liệu tập luyện, tính toán XP của Session, cập nhật chuỗi Streak hằng ngày và kiểm tra các mốc thành tựu đã đạt được.
Sau cùng, hệ thống kích hoạt quy trình AI Recommendation nhằm đề xuất các suất ăn dinh dưỡng phù hợp với nhu cầu phục hồi sau tập luyện. Workout Session được chuyển sang trạng thái “Done” và lưu vào Fitness Passport của Member.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-31:** Kỷ lục cá nhân (Personal Record) được tính độc lập cho từng bài tập dựa trên công thức: PR = max(weight × reps). Nếu Set mới vượt giá trị PR hiện tại, hệ thống ghi nhận thành tích mới và kích hoạt thưởng thành tích tương ứng.
- **BR-18:** Member nhận XP dựa trên tổng khối lượng tập luyện, mức độ hoàn thành Session và thành tích PR đạt được trong buổi tập.
- **BR-20 & BR-21:** Streak tăng khi Member có ít nhất một hoạt động hợp lệ trong ngày như hoàn thành Workout Session hoặc phát sinh đơn hàng dinh dưỡng thành công. Nếu không ghi nhận hoạt động liên tiếp trong 2 ngày, hệ thống tự động reset Streak về 0.
- **BR-22:** Khi đạt các mốc Streak như 7 ngày, 30 ngày hoặc 100 ngày, hệ thống tự động mở khóa Badge, thưởng FitCoin và cập nhật hồ sơ thành tích cá nhân.
- **BR-32:** Hệ thống ưu tiên đề xuất nhóm cơ có tần suất tập thấp nhất trong 7 ngày gần nhất. Nếu nhiều nhóm cơ có cùng tần suất, hệ thống ưu tiên nhóm cơ có thời gian nghỉ lâu hơn.
- **BR-33:** Workout Session chỉ được phép chỉnh sửa hoặc xóa trong vòng 24 giờ kể từ khi hoàn tất. Sau thời gian này, dữ liệu bị khóa vĩnh viễn nhằm đảm bảo tính toàn vẹn của Fitness Passport.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp Member nhập dữ liệu vượt ngưỡng hợp lý, hệ thống sẽ hiển thị cảnh báo xác nhận trước khi cho phép lưu dữ liệu. Các dữ liệu bất thường vẫn được lưu vào lịch sử tập luyện nhưng sẽ bị loại khỏi thuật toán tính PR nhằm tránh sai lệch thành tích cá nhân.
- Nếu xảy ra mất kết nối mạng trong lúc ghi nhận Workout Session, hệ thống sẽ tạm thời bảo toàn tiến trình tập luyện và tự động đồng bộ dữ liệu khi kết nối được khôi phục. Điều này giúp Member không bị mất dữ liệu giữa chừng.
- Trong trường hợp phiên đăng nhập hết hạn khi đang tập luyện, dữ liệu của Workout Session vẫn được duy trì. Sau khi đăng nhập lại, Member có thể tiếp tục Session trước đó mà không cần nhập lại dữ liệu.

#### 3.3.2 — Quy trình tư vấn và phân phối suất ăn dinh dưỡng (Quy trình AI Food Recommendation và Food Delivery)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi Member hoàn thành Workout Session. Hệ thống phát sinh sự kiện “Workout Completed” và tự động kích hoạt AI Recommendation Engine nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi sau tập luyện.
Đầu tiên, hệ thống phân tích dữ liệu Workout Session để xác định nhóm cơ chính được tập luyện và cường độ vận động của buổi tập. Đồng thời, hệ thống đối chiếu với hồ sơ cá nhân của Member bao gồm mục tiêu thể hình, lịch sử dinh dưỡng và các thông tin dị ứng thực phẩm đã được khai báo trước đó.
Sau quá trình phân tích, hệ thống hiển thị các suất ăn được đề xuất trực tiếp trên giao diện ứng dụng. Member có thể xem thông tin chi tiết của món ăn, thêm nhanh vào giỏ hàng hoặc tiếp tục khám phá thực đơn từ các Vendor khác nhau trên nền tảng.
Khi tiến hành đặt món, khách hàng thực hiện quy trình Checkout bao gồm xác nhận giỏ hàng, nhập thông tin giao nhận và lựa chọn phương thức thanh toán. Đối với Guest chưa có tài khoản, hệ thống yêu cầu xác thực số điện thoại trước khi hoàn tất đơn hàng.
Sau khi đơn hàng được tạo thành công, hệ thống gửi thông báo đến Vendor tương ứng để xác nhận đơn. Vendor tiến hành chuẩn bị món ăn và cập nhật trạng thái vận hành của đơn hàng theo từng giai đoạn gồm “Preparing”, “Delivering” và “Delivered”.
Khi đơn hàng hoàn tất, hệ thống tự động cập nhật dữ liệu dinh dưỡng vào Macro Dashboard của Member nhằm hỗ trợ theo dõi lượng Protein, Carb và Fat tiêu thụ trong ngày.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-28 & BR-29:** Hệ thống sử dụng cơ chế Mapping giữa nhóm cơ tập luyện và định hướng Macro ưu tiên nhằm đề xuất các suất ăn phù hợp với nhu cầu phục hồi và phát triển cơ bắp.
- **BR-30:** Hệ thống luôn hiển thị đúng 3 món ăn đề xuất. Trong trường hợp số lượng món phù hợp không đủ, hệ thống ưu tiên bổ sung các món có Rating cao hơn.
- **BR-34:** Nếu Workout Session có nhiều nhóm cơ với khối lượng tập luyện tương đương nhau, hệ thống ưu tiên theo thứ tự: Legs → Back → Chest → Shoulders → Arms → Core.
- **BR-35:** Một giỏ hàng chỉ được chứa sản phẩm từ một Vendor duy nhất nhằm đảm bảo tính đồng nhất trong quy trình vận chuyển và giao nhận.
- **BR-36:** Đơn hàng của Guest được liên kết với số điện thoại đã xác thực. Khi Guest tạo tài khoản Member bằng cùng số điện thoại, hệ thống tự động đồng bộ lịch sử đơn hàng vào Fitness Passport.
- **BR-10:** Chức năng Quick Re-order cho phép Member đặt lại toàn bộ món ăn từ một đơn hàng cũ chỉ với một thao tác.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp hệ thống không tìm được món ăn phù hợp với điều kiện dinh dưỡng của Member, hệ thống sẽ tự động nới lỏng tiêu chí đề xuất nhằm ưu tiên hiển thị các món ăn an toàn và phù hợp hơn. Nếu vẫn không có kết quả phù hợp, hệ thống hiển thị thông báo để người dùng tự khám phá thực đơn.
- Nếu Vendor không đủ nguyên liệu để hoàn thành đơn hàng sau khi đã xác nhận, Vendor có thể chủ động đề xuất món thay thế hoặc thực hiện hủy đơn theo yêu cầu của khách hàng. Trong trường hợp đơn hàng bị hủy, hệ thống tự động thực hiện hoàn tiền theo chính sách vận hành của nền tảng.

#### 3.3.3 — Quy trình ký gửi, cho thuê và giao dịch thiết bị Gym (Quy trình Gear Hub Lifecycle)
**1. Mô tả quy trình chi tiết**
Quy trình bắt đầu khi người dùng truy cập Gear Hub và lựa chọn chức năng đăng thiết bị lên hệ thống. Dựa trên vai trò tài khoản, hệ thống phân quyền hình thức giao dịch phù hợp cho từng nhóm người dùng.
Gym Owner chỉ được đăng thiết bị dưới hình thức “Bán đứt” (không cho thuê). Member cá nhân chỉ được đăng thiết bị dưới hình thức “Cho thuê” nhằm phục vụ mô hình chia sẻ thiết bị Peer-to-Peer (không được bán).
Người đăng cung cấp các thông tin cơ bản gồm tên thiết bị, danh mục, giá bán hoặc phí thuê, tình trạng thiết bị và hình ảnh thực tế. Sau khi xác nhận, hệ thống tiến hành định danh thiết bị, khởi tạo hồ sơ vòng đời Gear và niêm yết thiết bị trên Gear Marketplace.
Người mua hoặc người thuê có thể truy cập trang chi tiết để xem thông tin thiết bị, lịch sử sử dụng và trạng thái vòng đời trước khi tiến hành giao dịch.
Nếu giao dịch thuộc hình thức mua bán, hệ thống thực hiện quy trình thanh toán và chuyển quyền sở hữu thiết bị sang người mua mới. Đồng thời, hệ thống cập nhật trạng thái vòng đời thiết bị nhằm ghi nhận giao dịch đã hoàn tất.
Nếu giao dịch thuộc hình thức cho thuê, hệ thống giữ tiền đặt cọc và ghi nhận thời gian thuê tương ứng. Sau khi thiết bị được hoàn trả thành công và không phát sinh tranh chấp, hệ thống tiến hành hoàn cọc và cập nhật trạng thái vòng đời mới cho thiết bị.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-11B:** Gym Owner chỉ được đăng thiết bị dưới hình thức Bán đứt (không cho thuê). Member cá nhân chỉ được đăng thiết bị dưới hình thức Cho thuê Peer-to-Peer (không được bán).
- **BR-37:** Mọi thay đổi trạng thái của thiết bị đều phải tạo bản ghi vòng đời mới. Hệ thống không cho phép chỉnh sửa hoặc xóa lịch sử nhằm đảm bảo tính minh bạch và khả năng truy vết.
- **BR-11:** Thiết bị đăng tải bắt buộc phải có tối thiểu 2 hình ảnh thực tế để đảm bảo độ tin cậy của thông tin sản phẩm.
- **BR-12:** Mỗi thiết bị được gắn với một mã định danh duy nhất xuyên suốt toàn bộ vòng đời sử dụng, kể cả khi thay đổi chủ sở hữu.
- **BR-13:** Thiết bị cho thuê bắt buộc phải có tiền đặt cọc nhằm hạn chế rủi ro thất thoát hoặc hư hỏng trong quá trình sử dụng.
- **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch mua bán hoặc cho thuê theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp phát sinh tranh chấp về tình trạng thiết bị sau khi nhận hàng, người thuê có quyền gửi khiếu nại kèm hình ảnh xác thực trong khoảng thời gian quy định. Admin hệ thống sẽ tham gia kiểm tra và đưa ra quyết định xử lý phù hợp.
- Nếu người thuê trả thiết bị quá thời hạn cho phép, hệ thống tự động áp dụng cơ chế phạt dựa trên chính sách vận hành. Tùy theo mức độ vi phạm, hệ thống có thể trừ tiền cọc, hạn chế quyền thuê hoặc khóa tính năng giao dịch của tài khoản vi phạm.

#### 3.3.4 — Quy trình thanh toán và đối soát đa kênh (Quy trình Payment Gateway và FitCoin Economy)
> *(Cập nhật: 14/06/2026 — Sửa luồng FitCoin: khách chọn dùng FitCoin trước → tính hóa đơn → chọn phương thức thanh toán)*

**1. Mô tả quy trình chi tiết**
Quy trình thanh toán được kích hoạt khi người dùng thực hiện các giao dịch phát sinh chi phí trên nền tảng như đặt suất ăn dinh dưỡng, giao dịch Gear hoặc đăng ký/gia hạn gói Membership.
Tại bước Checkout Membership, khách hàng (nếu chưa có tài khoản) sẽ điền trực tiếp thông tin tạo tài khoản (Tên, Email, Mật khẩu) vào Modal và chọn phương thức thanh toán. Sau khi thanh toán hoàn tất, tài khoản được tự động tạo và kích hoạt thẻ hội viên. Trang /auth/register chỉ còn dùng cho Vendor/Gym Owner.
**Bước 1 — Áp dụng FitCoin (tùy chọn):** Tại màn hình Checkout, trước khi hiển thị hóa đơn cuối cùng, hệ thống kiểm tra số dư ví FitCoin của khách hàng và hiển thị tùy chọn "Dùng FitCoin để giảm giá". Khách hàng chủ động chọn áp dụng hoặc bỏ qua. Nếu chọn áp dụng, hệ thống tính toán số FitCoin được khấu trừ (tối đa 50% giá trị đơn hàng theo BR-27), tạm giữ số FitCoin tương ứng và cập nhật lại hóa đơn với số tiền thực tế còn lại cần thanh toán.

**Bước 2 — Xác nhận hóa đơn:** Hệ thống hiển thị hóa đơn đã tính toán đầy đủ gồm giá gốc, số FitCoin được khấu trừ (nếu có) và số tiền thực cần thanh toán qua cổng thanh toán.

**Bước 3 — Chọn phương thức thanh toán:** Sau khi xác nhận hóa đơn, khách hàng chọn phương thức thanh toán cho phần tiền còn lại (VNPay / Momo Sandbox). Hệ thống chuyển người dùng đến cổng thanh toán tương ứng để xác nhận giao dịch. Sau khi Payment Gateway phản hồi thành công, hệ thống xác nhận trừ FitCoin đã tạm giữ (nếu có), ghi nhận lịch sử biến động FitCoin, cập nhật trạng thái đơn hàng và ghi nhận lịch sử giao dịch tài chính.

Trong quá trình sử dụng hệ thống, người dùng có thể tích lũy thêm FitCoin thông qua các hoạt động như duy trì Streak, hoàn thành Challenge, giới thiệu bạn bè hoặc nhận Cashback từ giao dịch.

Khi toàn bộ quy trình hoàn tất, hệ thống hoàn thành đối soát đơn hàng và cập nhật trạng thái thanh toán.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-38:** Mọi phản hồi thanh toán từ Payment Gateway đều phải trải qua bước xác thực bảo mật trước khi được chấp nhận và cập nhật trạng thái giao dịch.
- **BR-39:** Hệ thống đảm bảo mỗi Transaction chỉ được xử lý thành công một lần duy nhất nhằm tránh phát sinh lỗi cộng tiền hoặc cập nhật trạng thái trùng lặp.
- **BR-23 & BR-24:** FitCoin có tỷ lệ quy đổi cố định và chỉ được sử dụng trong hệ sinh thái FitFuel+. Người dùng không được phép quy đổi FitCoin thành tiền mặt hoặc sử dụng vượt quá số dư hiện có.
- **BR-25 & BR-26:** Mọi hoạt động Earn và Spend FitCoin đều được ghi nhận vào lịch sử giao dịch nhằm đảm bảo khả năng kiểm tra và đối soát.
- **BR-27:** Người dùng chỉ được phép sử dụng tối đa 50% giá trị đơn hàng bằng FitCoin trong một giao dịch.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp người dùng khởi tạo giao dịch nhưng không hoàn tất thanh toán trong khoảng thời gian quy định, hệ thống tự động hủy giao dịch và hoàn lại số FitCoin đã tạm giữ nếu có phát sinh thanh toán kết hợp.
- Nếu đơn hàng bị hủy sau khi đã thanh toán thành công, hệ thống thực hiện quy trình hoàn tiền theo chính sách vận hành. Trạng thái hoàn tiền được cập nhật liên tục để người dùng theo dõi tiến trình xử lý giao dịch.

#### 3.3.5 — Quy trình Đăng ký tài khoản và Mua gói tập (Membership Onboarding)
*(Quy trình thu hút người dùng mới và chuyển đổi doanh thu)*

**1. Mô tả quy trình chi tiết**
Quy trình được chia làm hai giải pháp độc lập nhằm tối ưu hóa trải nghiệm khách hàng:

**Giải pháp 1: Offline to Online (Tại quầy lễ tân)**
- **Bước 1 — Tạo mã QR động:** Khách hàng đến quầy và yêu cầu mua gói tập. Admin thao tác chọn gói trên màn hình POS của hệ thống FitFuel+. Hệ thống tự động sinh mã VietQR/MoMo động hiển thị trên màn hình, nhúng sẵn số tiền và mã đơn hàng.
- **Bước 2 — Thanh toán:** Khách hàng cầm điện thoại dùng ứng dụng ngân hàng quét mã QR để chuyển khoản.
- **Bước 3 — Webhook kích hoạt ngầm:** Khi giao dịch thành công, webhook từ ngân hàng báo về hệ thống. FitFuel+ tự động trích xuất thông tin (Số điện thoại từ nội dung chuyển khoản hoặc Tên tài khoản ngân hàng) để tạo ngay một tài khoản Member, kích hoạt gói tập, và khởi tạo Fitness Passport.
- **Bước 4 — Gửi SMS tự động:** Hệ thống tự động bắn SMS thông báo đến số điện thoại của khách hàng: "Cảm ơn bạn đã đăng ký 3 tháng. Đăng nhập FitFuel+ bằng SĐT này, mật khẩu là 123456".

**Giải pháp 2: Online 100% (Khách tự mua ở nhà)**
Quy trình tối giản chỉ gồm 3 bước, không yêu cầu nhập Email hay Mật khẩu ban đầu để tránh ma sát:
- **Bước 1 — Chọn gói & Nhập SĐT:** Khách hàng chọn gói tập trên trang chủ. Giao diện hiển thị một ô duy nhất để nhập "Số điện thoại của bạn".
- **Bước 2 — Thanh toán:** Khách hàng được đẩy trực tiếp sang cổng thanh toán (Apple Pay, MoMo, hoặc quét QR VNPay) để hoàn tất giao dịch.
- **Bước 3 — Cập nhật hồ sơ (Tùy chọn):** Sau khi thanh toán thành công, hệ thống ngầm tạo tài khoản Member và kích hoạt gói. Khách hàng được chuyển đến Thank You Page với thông báo: "Thanh toán thành công! Bạn có thể cập nhật thêm thông tin cơ thể (Chiều cao, Cân nặng) để AI gợi ý bài tập ngay bây giờ, hoặc làm sau".

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-01:** Quy tắc xác thực tài khoản: Vendor/Gym Owner phải tuân thủ mật khẩu mạnh. Member mới đăng ký qua SĐT không cần mật khẩu ban đầu, hệ thống tự cấp mật khẩu 6 số qua SMS.
* **BR-40:** Member mới chỉ được tạo qua luồng mua gói tập này (Online 100% hoặc Offline to Online). Trang `/auth/register` từ chối các đăng ký không phải của Vendor/Gym Owner.
* **BR-41:** Gói tập chỉ có 2 chu kỳ: Tháng và Năm. Gói Năm được giảm giá (tương đương 10 tháng).
* **BR-38 & BR-39:** Mọi phản hồi từ cổng thanh toán phải được kiểm tra chữ ký (HMAC) và chỉ xử lý cấp gói tập đúng 1 lần (Idempotency) dù có gọi callback nhiều lần.

**3. Tình huống ngoại lệ (Exception Handling)**
* **Hủy thanh toán giữa chừng:** Khách hàng đến cổng VNPay nhưng nhấn nút "Hủy và quay lại". Cổng thanh toán điều hướng khách hàng lại trang web với mã lỗi hủy. Hệ thống vẫn giữ lại tài khoản ở dạng `pending_payment`. Khách hàng có thể thử thanh toán lại. Nếu quá 1 ngày không thanh toán, một cron job sẽ dọn dẹp các tài khoản rác này.
* **Mất kết nối mạng:** Nếu khách hàng thanh toán xong nhưng rớt mạng chưa kịp thấy màn hình thành công, hệ thống backend qua Webhook vẫn nhận được kết quả và đã kích hoạt tài khoản. Khách hàng chỉ cần tải lại trang chủ và đăng nhập bằng email/mật khẩu vừa tạo là có thể vào Dashboard bình thường.

---

## 4. XAC DINH ACTOR

### 4.1 Danh sach Actor

STT | Actor      | Mo ta                                    | Loai
----|------------|------------------------------------------|----------
1   | Guest      | Khach chua dang ky, chi co the xem va    | Chinh
    |            | mua hang bang OTP                        |
2   | Member     | User da dang ky (qua Checkout Modal),    | Chinh
    |            | co day du quyen su dung                  |
3   | Food Vendor| Quan an healthy dang ky ban tren nen tang | Chinh
4   | Gear Seller| Gym Owner (chi ban) hoac Member (chi thue)  | Chinh
5   | Gym Owner  | Chu phong tap, dong thoi la quan tri vien | Chinh
    |            | he thong FitFuel+ (Admin Panel)          |
6   | Timer      | Kich hoat tu dong: streak reset,         | Phu
    |            | subscription renew, challenge deadline   |
7   | Payment GW | Cong thanh toan ben ngoai (VNPay/Momo)   | Phu

### 4.2 Mo ta chi tiet tung Actor

GUEST:
- Xem danh sach food va gear (bao gom Gear Lifecycle)
- Them san pham vao gio hang
- Checkout bang SDT + OTP (khong can tao tai khoan)
- Xem lai don hang cu bang SDT
- KHONG co: Fitness Passport, gym tracking, gamification, social

MEMBER (dang ky qua Checkout Modal tren Landing Page):
- Tat ca quyen cua Guest
- Tao va log workout session
- Xem progress chart, PR, streak
- Nhan goi y food tu AI (SuggestionEngine)
- Su dung AI FitBot Assistant
- Xem/cap nhat Fitness Passport
- Tham gia challenge, ranking (Leaderboard)
- Earn va spend FitCoin
- Tinh TDEE va xem Macro Dashboard
- Post milestone, follow user khac
- Dang CHO THUE gear cua minh (CHI thue, khong duoc ban — BR-11B)
- Quan ly goi tap (Membership)

FOOD VENDOR (dang ky qua /auth/register):
- Dang san pham (ten, gia, calo, macro, anh)
- Nhan va xu ly don hang (xac nhan, chuan bi, giao)
- Xem analytics (doanh thu, top mon, review)

GEAR SELLER (vai tro phu cua Gym Owner hoac Member):
- Gym Owner: CHI duoc dang BAN dut gear (khong cho thue — BR-11B)
- Member: CHI duoc dang CHO THUE gear Peer-to-Peer (khong duoc ban — BR-11B)
- Nhap condition, anh, ghi chu
- He thong tu dong gen Gear ID + QR Code
- Nhan FitCoin khi giao dich thanh cong
- Quan ly listing cua minh (/gear/manage)

GYM OWNER (dang ky qua /auth/register):
- Gym Owner Dashboard: xem dashboard, quan ly member, gui thong bao, analytics
- Dang ban/cho thue gear (tat ca hinh thuc)
- Admin Panel (/admin/*):
  + Quan ly user (/admin/users): xem, khoa/mo tai khoan
  + Duyet vendor (/admin/vendors)
  + Xu ly tranh chap gear (/admin/gear-disputes)
  + Xem bao cao tong the (/admin/reports)
  + Dashboard quan ly (/admin/dashboard)

---

## 5. USE CASE DIAGRAM (TINH GIẢN & ĐỒNG NHẤT)

### 5.1 Danh sách 48 Use Case cốt lõi

Hệ thống FitFuel+ được thiết kế và chuẩn hóa thành **48 Use Case cốt lõi** phân bổ trên 8 phân hệ:

*   **Phân hệ 1: Quản lý tài khoản (5 UC)**
    - **UC-01**: Đăng ký tài khoản mới *(Member: Membership checkout / Vendor: register)*
    - **UC-02**: Đăng nhập hệ thống *(Gom chung luồng Email/Password và OTP cho Guest)*
    - **UC-04**: Hợp nhất tài khoản (Merge Guest → Member) *(Bắt buộc mua gói tập)*
    - **UC-05**: Cập nhật thông tin cá nhân
    - **UC-06**: Xem Fitness Passport *(Hồ sơ thể hình)*

*   **Phân hệ 2: Gym Tracking & Check-in (8 UC)**
    - **UC-07**: Tạo workout session
    - **UC-08**: Ghi nhận bài tập (Log Exercise)
    - **UC-09**: Kiểm tra và ghi nhận PR *(Kỷ lục cá nhân)*
    - **UC-10**: Xem lịch sử buổi tập
    - **UC-11**: Xem biểu đồ tiến trình *(Progress Chart)*
    - **UC-12**: Nhận gợi ý tập luyện từ AI *(Luồng: <<extend>> từ UC-07)*
    - **UC-13**: Check-in phòng tập bằng mã QR
    - **UC-14**: Xem thống kê tổng hợp *(Đã gỡ Actor TIMER, chỉ để MEMBER xem - Stats Dashboard)*

*   **Phân hệ 3: Ẩm thực sức khỏe (8 UC)**
    - **UC-15**: Xem danh sách thực đơn healthy
    - **UC-17**: Xem chi tiết món ăn
    - **UC-18**: Thêm món ăn vào giỏ hàng
    - **UC-20**: Thay đổi thuộc tính món trong giỏ
    - **UC-21**: Thanh toán đơn hàng (Checkout) *(Post-condition: Tự log macro, gọi Payment Gateway)*
    - **UC-22**: Xem trạng thái & lịch sử đơn *(MỚI: Dành riêng cho MEMBER để phục vụ UX)*
    - **UC-23**: Đặt lại đơn hàng nhanh (Re-order)
    - **UC-24**: Nhận gợi ý thực đơn từ AI

*   **Phân hệ 4: Chợ thiết bị gym (9 UC)**
    - **UC-27**: Xem danh sách thiết bị
    - **UC-28**: Xem vòng đời thiết bị *(Gear Lifecycle)*
    - **UC-29**: Đặt thuê thiết bị *(Bước "đặt cọc" là step nội bộ. Include UC-32)*
    - **UC-31**: Mua thiết bị *(Include UC-32)*
    - **UC-32**: Thanh toán thiết bị *(Gọi chéo Phân hệ 6)*
    - **UC-33**: Đăng niêm yết thiết bị *(Gym Owner: bán | Member: cho thuê)*
    - **UC-35**: Xem chi tiết thiết bị qua mã QR
    - **UC-36**: Trả thiết bị thuê khi hết hạn *(Trigger bởi Actor TIMER hoặc MEMBER)*
    - **UC-37**: Nhận gợi ý thiết bị từ AI

*   **Phân hệ 5: Thi đua & Gamification (4 UC)**
    - **UC-38**: Xem XP và Level
    - **UC-39**: Xem Badge *(Huy hiệu thành tựu)*
    - **UC-40**: Tham gia thử thách tuần *(Weekly Challenge)*
    - **UC-41**: Xem bảng xếp hạng

*   **Phân hệ 6: Thanh toán & Ví FitCoin (5 UC)**
    - **UC-42**: Xử lý thanh toán qua cổng *(Điểm giao tiếp duy nhất với PAYMENT GATEWAY. Post-condition: Tự cộng FitCoin)*
    - **UC-43**: Gia hạn membership *(<<include>> UC-42)*
    - **UC-44**: Nạp tiền vào ví FitCoin *(<<include>> UC-42)*
    - **UC-46**: Tiêu dùng FitCoin (Spend) *(Business Rule: Tối đa 50% giá trị đơn hàng)*
    - **UC-47**: Xem lịch sử giao dịch ví

*   **Phân hệ 7: Quản trị B2B & Admin (6 UC)**
    - **UC-48**: Vendor đăng sản phẩm mới *(Actor: VENDOR & ADMIN (Gym Owner))*
    - **UC-49**: Vendor xử lý đơn hàng *(Độc lập)*
    - **UC-50**: Vendor xem báo cáo doanh số *(Analytics)*
    - **UC-51**: Gym Owner quản lý hội viên *(Chỉ dành cho Actor ADMIN (Gym Owner))*
    - **UC-52**: Gym Owner gửi thông báo *(Chỉ dành cho Actor ADMIN (Gym Owner))*
    - **UC-53**: Admin duyệt đối tác & xử lý *(Chỉ dành cho Actor ADMIN (Gym Owner))*

*   **Phân hệ 8: Tương tác xã hội (3 UC)**
    - **UC-54**: Post thành tựu lên Feed *(Độc lập)*
    - **UC-55**: Follow người dùng khác
    - **UC-56**: Nhận phần thưởng giới thiệu *(Claim Referral)*

---

## 6. USE CASE SPECIFICATIONS (ĐẶC TẢ USE CASE CHI TIẾT)

Dưới đây là đặc tả chi tiết cho 3 Use Case nghiệp vụ quan trọng trong hệ thống:

### 05: Ghi nhận buổi tập (Workout Log)

| Mục | Nội dung |
| :--- | :--- |
| **Use Case ID** | 05 |
| **Tên Use Case** | Ghi nhận buổi tập (Workout Log) |
| **Actor chính** | Hội viên (Member) |
| **Điều kiện tiền** | Hội viên đã đăng nhập và khởi tạo Workout Session |
| **Điều kiện sau** | Nhật ký set tập được ghi nhận thành công, cập nhật Fitness Passport, tự động phát hiện PR và tính Volume. |
| **Mô tả** | Hội viên ghi lại các set tập thực tế (số Reps, mức tạ Weight) của từng bài tập trong buổi tập đang hoạt động. |

**Luồng cơ bản (Basic Flow):**
1. Trong giao diện buổi tập đang kích hoạt, Hội viên chọn [Thêm bài tập].
2. Hệ thống hiển thị danh sách bài tập từ thư viện (nhóm theo cơ ngực, chân, tay...).
3. Hội viên chọn một bài tập cụ thể.
4. Hệ thống hiển thị form nhập set tập.
5. Hội viên nhập thông tin cho Set 1 (Số Reps, Weight).
6. Hội viên nhấn [Thêm set] và tiếp tục nhập Set 2, Set 3...
7. Hội viên nhấn [Lưu bài tập].
8. Hệ thống lưu trữ dữ liệu set tập vào database.
9. Hệ thống tự động tính Volume của bài tập (Volume = Tổng reps x weight của tất cả set) và 1RM cho từng set.
10. Hệ thống đối chiếu mức tạ với lịch sử cá nhân để kiểm tra kỷ lục mới (PR - Personal Record).
11. Nếu đạt PR mới, hệ thống đánh dấu `is_pr = true` và hiển thị thông báo chúc mừng trên giao diện.
12. Hệ thống cập nhật các chỉ số tương ứng vào Fitness Passport của hội viên.

**Luồng thay thế (Alternative Flow):**
*   **3a. Bài tập không có sẵn trong thư viện:**
    1. Hội viên chọn [Tạo bài tập tự định nghĩa].
    2. Hội viên nhập tên bài tập và chọn nhóm cơ tác động chính.
    3. Hệ thống lưu bài tập mới vào danh sách riêng của hội viên và tiếp tục từ bước 4.

---

### 08: Đặt suất ăn & Thanh toán đơn hàng

| Mục | Nội dung |
| :--- | :--- |
| **Use Case ID** | 08 |
| **Tên Use Case** | Đặt suất ăn & Thanh toán đơn hàng |
| **Actor chính** | Khách hàng (Guest, Member) |
| **Điều kiện tiền** | Giỏ hàng có ít nhất một sản phẩm món ăn |
| **Điều kiện sau** | Đơn hàng được tạo thành công ở trạng thái chờ xử lý, lịch sử giao dịch được ghi nhận, thông báo gửi tới Vendor. |
| **Mô tả** | Khách hàng thực hiện thanh toán cho giỏ hàng ẩm thực hiện tại. |

**Luồng cơ bản (Basic Flow) - Hội viên (Member):**
1. Hội viên nhấn nút [Thanh toán] từ màn hình Giỏ hàng.
2. Hệ thống hiển thị trang Checkout chứa danh sách món ăn, đơn giá và tổng số tiền cần thanh toán.
3. Hội viên nhập địa chỉ nhận hàng và chọn khung giờ giao hàng mong muốn.
4. Hội viên chọn phương thức thanh toán (VNPay / MoMo hoặc Ví FitCoin).
5. Hội viên nhấn [Xác nhận đặt hàng].
6. Hệ thống thực hiện trừ tiền trong tài khoản ngân hàng (qua cổng thanh toán) hoặc trừ số dư ví FitCoin tương ứng.
7. Hệ thống tạo đơn hàng với trạng thái `pending`.
8. Hệ thống gửi thông tin đơn hàng tới portal của Đối tác ẩm thực (Vendor).
9. Hệ thống gửi xác nhận đơn hàng thành công đến điện thoại/email của hội viên.
10. Hệ thống tự động tích lũy XP (+20 XP) cho hội viên sau giao dịch thành công.
11. Hệ thống xóa các món ăn đã mua ra khỏi giỏ hàng trực tuyến.

**Luồng thay thế - Guest Checkout (Khách vãng lai):**
*   **1a. Hệ thống phát hiện khách hàng chưa đăng nhập:**
    1. Hệ thống yêu cầu nhập Số điện thoại và gửi mã OTP xác thực qua SMS.
    2. Khách hàng nhập đúng mã OTP.
    3. Hệ thống xác thực OTP thành công và cho phép đi tiếp đến bước 2.
    4. Đơn hàng được tạo kèm thông tin số điện thoại của Guest (không có `user_id`).

**Luồng thay thế - Thanh toán bằng FitCoin:**
*   **4a. Hội viên chọn thanh toán bằng ví FitCoin:**
    1. Hệ thống kiểm tra số dư ví FitCoin của hội viên.
    2. Nếu số dư FitCoin đủ thanh toán 100% hóa đơn: Hệ thống thực hiện trừ trực tiếp FitCoin của hội viên mà không cần chuyển hướng qua gateway VNPay/MoMo.
    3. Nếu số dư không đủ: Hệ thống cho phép thanh toán kết hợp FitCoin và tiền thật (Tối đa sử dụng FitCoin giảm 50% giá trị đơn hàng theo quy tắc BR-27).

---

### 13: Đăng ký ký gửi thiết bị gym

| Mục | Nội dung |
| :--- | :--- |
| **Use Case ID** | 13 |
| **Tên Use Case** | Đăng ký ký gửi thiết bị gym |
| **Actor chính** | Hội viên, Chủ phòng tập |
| **Điều kiện tiền** | Người dùng đã đăng nhập hệ thống |
| **Điều kiện sau** | Thiết bị được đăng tải thành công ở trạng thái chờ duyệt, sinh ID thiết bị cùng mã QR định danh duy nhất. |
| **Mô tả** | Người dùng đăng tải thông tin thiết bị gym lên hệ thống. Gym Owner chỉ được đăng bán đứt; Member chỉ được đăng cho thuê Peer-to-Peer (BR-11B). |

**Luồng cơ bản (Basic Flow):**
1. Người dùng chọn chức năng [Ký gửi thiết bị] trên trang Gear Hub.
2. Hệ thống hiển thị form đăng thông tin thiết bị ký gửi.
3. Người dùng nhập các thông tin chi tiết:
   - Tên thiết bị
   - Danh mục phân loại (Tạ tay, thảm tập, đai lưng, dây kháng lực...)
   - Hình thức: Chỉ cho thuê (nếu là Member — BR-11B) hoặc Chỉ bán đứt (nếu là Gym Owner — BR-11B).
   - Mức giá bán (nếu đăng bán) hoặc giá thuê theo ngày/tuần (nếu cho thuê).
   - Số tiền đặt cọc yêu cầu (bắt buộc đặt cọc >= 50% giá trị thiết bị theo BR-13).
   - Tình trạng thiết bị (đánh giá từ 1 đến 5 sao) kèm hình ảnh thực tế (tối thiểu 2 ảnh).
4. Người dùng nhấn nút [Đăng ký ký gửi].
5. Hệ thống xác thực dữ liệu (kiểm tra tính hợp lệ của giá, cọc và số lượng ảnh).
6. Hệ thống tự động sinh ID thiết bị duy nhất theo định dạng `GEAR-{RANDOM_4_CHARS}-{TIMESTAMP_4_DIGITS}`.
7. Hệ thống tự động sinh mã QR Code gắn liền với ID thiết bị vừa tạo để dán định danh lên thiết bị vật lý.
8. Hệ thống lưu thông tin thiết bị vào cơ sở dữ liệu ở trạng thái chờ duyệt (`status = pending_approval`).
9. Hệ thống gửi thông báo duyệt tin đến Chủ phòng tập (Admin).
10. Sau khi Chủ phòng tập phê duyệt, tin đăng sẽ hiển thị công khai trên Gear Hub và tạo bản ghi trạng thái đầu tiên `listed` trong bảng lịch sử vòng đời thiết bị (Gear Lifecycle).

---

## 7. ACTIVITY DIAGRAM

### 7.1 Activity Diagram — Dat food (bao gom Guest va Member)

```
[Bat dau]
    |
    v
<User xem danh sach food>
    |
    v
<User chon san pham>
    |
    v
<User nhan nut [+] tren card>
    |
    v
{San pham con hang?}
    |           |
   [Co]       [Khong]
    |           |
    v           v
<Them vao    <Hien thi "Het hang">
 gio hang>       |
    |            v
    v         [Ket thuc]
<User vao gio hang>
    |
    v
{Can thay doi qty/size?}
    |           |
   [Co]       [Khong]
    |           |
    v           |
<Thay doi      |
 trong cart>   |
    |           |
    v           v
<User nhan [Thanh toan]>
    |
    v
{Da dang nhap?}
    |           |
   [Co]       [Khong]
    |           |
    |           v
    |     <Nhap So dien thoai>
    |           |
    |           v
    |     <Nhan OTP qua SMS>
    |           |
    |           v
    |     <Nhap OTP>
    |           |
    |           v
    |     {OTP dung?}
    |       |       |
    |     [Co]   [Khong]
    |       |       |
    |       |       v
    |       |   {Thu qua 3 lan?}
    |       |     |        |
    |       |   [Chua]   [Roi]
    |       |     |        |
    |       |     v        v
    |       |  <Thu lai> <Hien thi loi>
    |       |              |
    |       v              v
    |     <Tiep tuc>    [Ket thuc]
    |       |
    v       v
<Nhap dia chi giao hang>
    |
    v
<Chon thoi gian giao>
    |
    v
<Chon phuong thuc thanh toan>
    |
    v
{Phuong thuc?}
    |           |           |
  [VNPay]    [Momo]    [FitCoin]
    |           |           |
    v           v           v
<Chuyen den  <Chuyen den  {Du so du?}
 VNPay>       Momo>       |       |
    |           |        [Co]   [Khong]
    |           |         |       |
    |           |         v       v
    |           |      <Tru     <Ket hop
    |           |     FitCoin>  FitCoin+tien>
    |           |         |       |
    v           v         v       v
{Thanh toan thanh cong?}
    |           |
   [Co]       [Khong]
    |           |
    v           v
<Tao don     <Hien thi loi,
 hang>        quay lai buoc TT>
    |
    v
<Gui thong bao den Vendor>
    |
    v
<Gui xac nhan den User>
    |
    v
<Cong 20 XP cho User>
    |
    v
<Xoa gio hang>
    |
    v
<Hien thi "Dat hang thanh cong">
    |
    v
[Ket thuc]
```

### 7.2 Activity Diagram — Gym Session + AI Food Suggestion

```
[Bat dau]
    |
    v
<User nhan [Bat dau buoi tap]>
    |
    v
<User chon nhom co>
    |
    v
<User nhan [Them bai tap]>
    |
    v
<Chon exercise tu danh sach>
    |
    v
<Nhap Set 1: reps x weight>
    |
    v
{Them set nua?}
    |           |
   [Co]       [Khong]
    |           |
    v           |
<Nhap set      |
 tiep theo>    |
    |           |
    +-----<-----+
    |
    v
{Them bai tap khac?}
    |           |
   [Co]       [Khong]
    |           |
    v           |
<Quay lai      |
 chon exercise>|
    |           |
    +-----<-----+
    |
    v
<User nhan [Ket thuc buoi tap]>
    |
    v
--- SONG SONG (Fork) ---
    |                   |
    v                   v
<Luu session       <Tinh XP
 vao DB>            (+50 XP)>
    |                   |
    v                   v
<Kiem tra PR       <Cap nhat
 cho tung bai>      streak (+1)>
    |                   |
    v                   v
{Co PR moi?}       <Cap nhat
    |       |        Passport>
   [Co]   [Khong]       |
    |       |           |
    v       |           |
<Hien thi  |           |
 "PR moi!"> |           |
    |       |           |
--- HOI TU (Join) ------+
    |
    v
<Phan tich nhom co vua tap>
    |
    v
<Tinh macro ratio can thiet>
    |
    v
<Query food phu hop tu database>
    |
    v
<Hien thi popup "Goi y bua an">
    |
    v
{User chon "Dat ngay"?}
    |           |
   [Co]       [Khong]
    |           |
    v           v
<Chuyen den  <Dong popup>
 Food Order>    |
    |           v
    v        [Ket thuc]
<Them food
 vao cart>
    |
    v
[Ket thuc]
```

### 7.3 Activity Diagram — Gear Lifecycle (Dang ban -> Mua -> Ban lai)

```
[Bat dau]
    |
    v
--- SWIMLANE: SELLER A ---
<Seller A nhap thong tin gear>
    |
    v
<Upload anh + ghi chu condition>
    |
    v
<He thong gen Gear ID + QR>
    |
    v
<He thong tao GEAR_LIFECYCLE entry #1>
  (action=listed, owner=A, condition=4/5)
    |
    v
<Gear xuat hien tren listing>
    |
    v
--- SWIMLANE: BUYER B ---
<Buyer B tim thay gear tren listing>
    |
    v
<Buyer B xem Gear Lifecycle>
  (thay: Owner A, condition 4/5, ghi chu, anh)
    |
    v
{Thue hay Mua?}
    |           |
  [Thue]      [Mua]
    |           |
    v           v
<Chon thoi   <Thanh toan
 han thue>    (tien/FitCoin)>
    |           |
    v           |
<Dat coc       |
 online>       |
    |           |
    v           v
<He thong tao GEAR_LIFECYCLE entry #2>
  (action=sold/rented, owner=B)
    |
    v
<He thong cap nhat current_owner_id = B>
    |
    v
<Seller A nhan FitCoin/tien>
    |
    v
--- SWIMLANE: BUYER B (6 thang sau) ---
<B muon ban lai gear>
    |
    v
<B nhap condition moi + anh moi + ghi chu>
    |
    v
<He thong tao GEAR_LIFECYCLE entry #3>
  (action=relisted, owner=B, condition=3/5)
    |
    v
<Gear xuat hien lai tren listing>
  (Lifecycle hien thi day du: A -> B -> dang ban)
    |
    v
--- SWIMLANE: BUYER C ---
<Buyer C xem gear>
    |
    v
<Buyer C xem Lifecycle: 3 entries, 2 chu nhan truoc>
    |
    v
<Buyer C mua>
    |
    v
<GEAR_LIFECYCLE entry #4>
  (action=sold, owner=C)
    |
    v
<B nhan FitCoin>
    |
    v
[Ket thuc]
```

---

## 8. SEQUENCE DIAGRAM

### 8.1 Sequence Diagram — Dat food (Member)

```
Member        FoodPage       CartService     Server/API      Database       Vendor
  |               |               |               |               |           |
  |--Xem food---->|               |               |               |           |
  |               |--GET /foods-->|               |               |           |
  |               |               |--GET /foods-->|               |           |
  |               |               |               |--SELECT foods-|           |
  |               |               |               |<--food list---|           |
  |               |               |<--food list---|               |           |
  |               |<--render list-|               |               |           |
  |<--hien thi----|               |               |               |           |
  |               |               |               |               |           |
  |--Nhan [+]--->|               |               |               |           |
  |               |--addToCart()-->|               |               |           |
  |               |               |--Luu vao      |               |           |
  |               |               |  localStorage |               |           |
  |               |<--cap nhat UI-|               |               |           |
  |<--"Da them"---|               |               |               |           |
  |               |               |               |               |           |
  |--Vao cart---->|               |               |               |           |
  |               |--getCart()---->|               |               |           |
  |               |<--cart items--|               |               |           |
  |<--hien thi cart               |               |               |           |
  |               |               |               |               |           |
  |--Thay doi qty>|               |               |               |           |
  |               |--updateQty()-->|               |               |           |
  |               |               |--cap nhat     |               |           |
  |               |               |  localStorage |               |           |
  |               |<--cap nhat UI-|               |               |           |
  |<--tong tien moi               |               |               |           |
  |               |               |               |               |           |
  |--Nhan [Thanh toan]------------>               |               |           |
  |               |               |--POST /orders->|               |           |
  |               |               |               |--INSERT order->|           |
  |               |               |               |<--order_id----|           |
  |               |               |               |               |           |
  |               |               |               |--UPDATE user   |           |
  |               |               |               |  xp += 20----->|           |
  |               |               |               |               |           |
  |               |               |               |--Gui thong bao----------->|
  |               |               |               |               |           |
  |               |               |<--order confirmed              |           |
  |               |<--clear cart--|               |               |           |
  |<--"Dat hang thanh cong"       |               |               |           |
```

### 8.2 Sequence Diagram — Guest Checkout

```
Guest         CheckoutPage    Server/API      OTP Service     Database
  |               |               |               |               |
  |--Nhan [TT]--->|               |               |               |
  |               |--Kiem tra auth|               |               |
  |               |  (khong co JWT)               |               |
  |               |<--yeu cau SDT-|               |               |
  |<--Hien thi form SDT           |               |               |
  |               |               |               |               |
  |--Nhap SDT---->|               |               |               |
  |               |--POST /auth/  |               |               |
  |               |  send-otp---->|               |               |
  |               |               |--Gen OTP----->|               |
  |               |               |  (6 so, 5min) |               |
  |               |               |--Gui SMS----->|               |
  |               |               |<--OK----------|               |
  |               |<--"Da gui OTP"|               |               |
  |<--Hien form OTP               |               |               |
  |               |               |               |               |
  |--Nhap OTP---->|               |               |               |
  |               |--POST /auth/  |               |               |
  |               |  verify-otp-->|               |               |
  |               |               |--Verify------>|               |
  |               |               |<--Valid--------|               |
  |               |               |--Gen temp token|               |
  |               |<--temp_token--|               |               |
  |               |               |               |               |
  |               |--POST /orders |               |               |
  |               |  (temp_token, |               |               |
  |               |   guest_phone)|               |               |
  |               |               |--INSERT order->|               |
  |               |               |  (user_id=null |               |
  |               |               |  guest_phone=X)|               |
  |               |               |<--order_id----|               |
  |               |<--order OK----|               |               |
  |<--"Dat hang thanh cong"       |               |               |
```

### 8.3 Sequence Diagram — AI Food Suggestion sau buoi tap

```
Member        GymPage         Server/API      Database        SuggestionEngine
  |               |               |               |               |
  |--Ket thuc     |               |               |               |
  |  buoi tap---->|               |               |               |
  |               |--POST /sessions|              |               |
  |               |  /complete---->|               |               |
  |               |               |--UPDATE session|              |
  |               |               |  status=done-->|               |
  |               |               |               |               |
  |               |               |--Lay muscle_   |               |
  |               |               |  groups tu     |               |
  |               |               |  session------->               |
  |               |               |               |               |
  |               |               |--Goi suggestion|              |
  |               |               |  engine(chest)->|              |
  |               |               |               |               |
  |               |               |  muscle_group = chest          |
  |               |               |  -> macro = {protein:high,     |
  |               |               |     carb:medium, fat:low}      |
  |               |               |               |               |
  |               |               |<-Query: SELECT |               |
  |               |               |  FROM foods    |               |
  |               |               |  WHERE protein>|               |
  |               |               |  30 ORDER BY   |               |
  |               |               |  protein DESC  |               |
  |               |               |  LIMIT 3------>|               |
  |               |               |               |               |
  |               |               |<--top 3 foods--|               |
  |               |               |               |               |
  |               |<--suggestion  |               |               |
  |               |  response-----|               |               |
  |<--Popup:      |               |               |               |
  |  "Goi y bua an                |               |               |
  |  sau tap nguc"|               |               |               |
  |  [Mon 1] [Mon 2] [Mon 3]     |               |               |
  |  [Dat ngay] [Bo qua]         |               |               |
  |               |               |               |               |
  |--Nhan         |               |               |               |
  | [Dat ngay]--->|               |               |               |
  |               |--addToCart()  |               |               |
  |               |--redirect /cart               |               |
  |<--Chuyen sang trang Cart      |               |               |
```

---

## 9. ERD (Entity Relationship Diagram)

### 9.1 ERD tong quan — Ky hieu

```
Quy uoc:
  PK  = Primary Key
  FK  = Foreign Key
  NN  = Not Null
  UQ  = Unique
  --- = Quan he
  ||--|| = 1-to-1
  ||--o{ = 1-to-Many
  }o--o{ = Many-to-Many
```

### 9.2 ERD chi tiet

```
+===================+       +======================+
|      USERS        |       |  FITNESS_PASSPORT    |
|-------------------|       |----------------------|
| PK user_id  INT   |       | PK passport_id  INT |
|    email    VARCHAR|       | FK user_id      INT |
|    phone    VARCHAR|       |    total_sessions INT|
|    password VARCHAR|       |    total_volume  DEC |
|    role     ENUM   |       |    longest_streak INT|
|    display_name    |       |    body_weight_log   |
|    avatar_url      |       |           TEXT(JSON) |
|    fitness_goal    |       |    body_photos       |
|      ENUM          |       |           TEXT(JSON) |
|    xp_total INT    |       |    milestone_badges  |
|    current_level   |       |           TEXT(JSON) |
|      INT           |       |    created_at DATETIME
|    current_streak  |       +======================+
|      INT           |              ||
|    fitcoin_balance |              || 1:1
|      DECIMAL       |              ||
|    tdee INT        |       +===================+
|    referred_by     |
|      FK->USERS     |
|    created_at      |
+===================+
      ||
      || 1:N
      ||
+======================+        +======================+
|  WORKOUT_SESSIONS    |        |    EXERCISE_LOGS     |
|----------------------|        |----------------------|
| PK session_id   INT  |        | PK log_id       INT |
| FK user_id      INT  |        | FK session_id   INT |
| FK gym_id       INT  |        |    exercise_name     |
|    (nullable)        |        |         VARCHAR      |
|    date     DATE     |        |    muscle_group      |
|    duration_min INT  |        |         ENUM         |
|    notes    TEXT     |        |    sets TEXT(JSON)   |
|    created_at DATETIME        |    [{reps, weight}]  |
+======================+        |    is_pr    BOOLEAN  |
      ||                        |    notes    TEXT     |
      || 1:N                    +======================+
      ||
+======================+
|    EXERCISE_LOGS     |
+======================+


+======================+        +======================+
|   FOOD_PRODUCTS      |        |    FOOD_ORDERS       |
|----------------------|        |----------------------|
| PK product_id   INT |        | PK order_id     INT  |
| FK vendor_id    INT  |        | FK user_id      INT  |
|    name    VARCHAR   |        |    (nullable)        |
|    description TEXT  |        |    guest_phone       |
|    price    DECIMAL  |        |         VARCHAR      |
|    calories INT      |        | FK vendor_id    INT  |
|    protein_g DECIMAL |        |    items TEXT(JSON)   |
|    carb_g   DECIMAL  |        |    total_amount DEC  |
|    fat_g    DECIMAL  |        |    fitcoin_used DEC  |
|    ingredients       |        |    delivery_time     |
|         TEXT(JSON)   |        |         VARCHAR      |
|    allergens         |        |    status ENUM       |
|         TEXT(JSON)   |        |    (pending/confirmed|
|    images TEXT(JSON) |        |     /preparing/      |
|    is_available BOOL |        |     delivering/      |
|    avg_rating DECIMAL|        |     delivered/       |
|    total_reviews INT |        |     cancelled)       |
|    created_at DATETIME        |    is_meal_prep BOOL |
+======================+        |    created_at DATETIME
                                +======================+
USERS ||--o{ FOOD_PRODUCTS (vendor_id)
USERS ||--o{ FOOD_ORDERS (user_id)
FOOD_PRODUCTS }o--o{ FOOD_ORDERS (thong qua items JSON)


+======================+        +======================+
|    FOOD_REVIEWS      |        |     GEAR_ITEMS       |
|----------------------|        |----------------------|
| PK review_id    INT  |        | PK gear_id  VARCHAR  |
| FK product_id   INT  |        |    (GEAR-XXXX-XXXX)  |
| FK user_id      INT  |        | FK current_owner_id  |
|    rating    INT(1-5)|        |         INT           |
|    comment   TEXT    |        |    category ENUM      |
|    photos TEXT(JSON) |        |    name     VARCHAR   |
|    body_stats        |        |    description TEXT   |
|         TEXT(JSON)   |        |    condition_rating   |
|    helpful_votes INT |        |         INT(1-5)     |
|    created_at DATETIME        |    condition_notes    |
+======================+        |         TEXT          |
                                |    images TEXT(JSON)  |
FOOD_PRODUCTS ||--o{ FOOD_REVIEWS   |    listing_type ENUM  |
USERS ||--o{ FOOD_REVIEWS          |    (sell/rent-BR-11B)   |
                                |    sell_price DECIMAL |
                                |    rent_price_day DEC |
+======================+        |    rent_price_week DEC|
|   GEAR_LIFECYCLE     |        |    deposit DECIMAL   |
|----------------------|        |    is_available BOOL |
| PK lifecycle_id INT  |        |    created_at DATETIME
| FK gear_id  VARCHAR  |        +======================+
| FK owner_id     INT  |
|    action    ENUM    |        USERS ||--o{ GEAR_ITEMS
|    (listed/sold/     |        GEAR_ITEMS ||--o{ GEAR_LIFECYCLE
|     rented/returned/ |
|     relisted)        |
|    condition_at_time |
|         INT          |
|    notes    TEXT     |
|    photos TEXT(JSON) |
|    timestamp DATETIME|
+======================+


+======================+        +======================+
|  GEAR_TRANSACTIONS   |        |       GYMS           |
|----------------------|        |----------------------|
| PK transaction_id INT|        | PK gym_id       INT  |
| FK gear_id  VARCHAR  |        | FK owner_id     INT  |
| FK seller_id    INT  |        |    name     VARCHAR   |
| FK buyer_id     INT  |        |    address  VARCHAR   |
|    type    ENUM      |        |    phone    VARCHAR   |
|    (sale/rental)     |        |    opening_hours     |
|    amount   DECIMAL  |        |         TEXT(JSON)   |
|    deposit  DECIMAL  |        |    services          |
|    fitcoin_used DEC  |        |         TEXT(JSON)   |
|    rental_start DATE |        |    membership_plans  |
|    rental_end   DATE |        |         TEXT(JSON)   |
|    status   ENUM     |        |    logo_url VARCHAR  |
|    (pending/active/  |        |    created_at DATETIME
|     completed/       |        +======================+
|     disputed)        |
|    created_at DATETIME        USERS ||--o{ GYMS (owner_id)
+======================+

GEAR_ITEMS ||--o{ GEAR_TRANSACTIONS
USERS ||--o{ GEAR_TRANSACTIONS (seller)
USERS ||--o{ GEAR_TRANSACTIONS (buyer)


+======================+        +======================+
|  GYM_MEMBERSHIPS     |        | FITCOIN_TRANSACTIONS |
|----------------------|        |----------------------|
| PK membership_id INT |        | PK txn_id       INT |
| FK user_id      INT  |        | FK user_id      INT |
| FK gym_id       INT  |        |    type ENUM        |
|    plan_name VARCHAR |        |    (earn/spend/     |
|    start_date  DATE  |        |     deposit/refund) |
|    end_date    DATE  |        |    amount  DECIMAL  |
|    status ENUM       |        |    source ENUM      |
|    (active/expired/  |        |    (gear_sale/      |
|     cancelled)       |        |     challenge/      |
|    auto_renew  BOOL  |        |     referral/       |
|    payment_method    |        |     deposit/        |
|         VARCHAR      |        |     food_order/     |
+======================+        |     gear_rental/    |
                                |     membership)     |
USERS ||--o{ GYM_MEMBERSHIPS    |    reference_id INT |
GYMS ||--o{ GYM_MEMBERSHIPS     |    created_at DATETIME
                                +======================+

                                USERS ||--o{ FITCOIN_TRANSACTIONS


+======================+        +======================+
|     CHALLENGES       |        |   USER_CHALLENGES    |
|----------------------|        |----------------------|
| PK challenge_id INT  |        | PK id           INT |
|    title    VARCHAR  |        | FK user_id      INT |
|    description TEXT  |        | FK challenge_id INT |
|    type     ENUM     |        |    progress         |
|    (weekly/monthly)  |        |         TEXT(JSON)  |
|    criteria          |        |    status ENUM      |
|         TEXT(JSON)   |        |    (in_progress/    |
|    reward_xp    INT  |        |     completed/      |
|    reward_fitcoin DEC|        |     failed)         |
|    start_date  DATE  |        |    completed_at     |
|    end_date    DATE  |        |         DATETIME    |
|    is_active   BOOL  |        +======================+
+======================+
                                USERS ||--o{ USER_CHALLENGES
CHALLENGES ||--o{ USER_CHALLENGES


+======================+        +======================+
|      BADGES          |        |    SOCIAL_POSTS      |
|----------------------|        |----------------------|
| PK badge_id     INT  |        | PK post_id      INT |
|    name     VARCHAR  |        | FK user_id      INT |
|    description TEXT  |        |    type ENUM        |
|    icon_url VARCHAR  |        |    (milestone/pr/   |
|    criteria          |        |     streak/         |
|         TEXT(JSON)   |        |     transformation/ |
|    category ENUM     |        |     review)         |
|    (gym/food/gear/   |        |    content TEXT     |
|     social/streak)   |        |    media_urls       |
+======================+        |         TEXT(JSON)  |
                                |    linked_data      |
                                |         TEXT(JSON)  |
+======================+        |    likes_count INT  |
|      FOLLOWS         |        |    comments_count   |
|----------------------|        |         INT         |
| FK follower_id  INT  |        |    created_at DATETIME
| FK following_id INT  |        +======================+
|    created_at DATETIME|
+======================+        USERS ||--o{ SOCIAL_POSTS

USERS }o--o{ USERS (thong qua FOLLOWS)


+======================+
|   NOTIFICATIONS      |
|----------------------|
| PK notification_id   |
|         INT          |
| FK user_id      INT  |
|    type ENUM         |
|    (gym_closed/promo/|
|     streak_reminder/ |
|     challenge/       |
|     order_update/    |
|     gear_return)     |
|    title    VARCHAR  |
|    message  TEXT     |
|    is_read  BOOLEAN  |
|    action_url VARCHAR|
|    created_at DATETIME
+======================+

USERS ||--o{ NOTIFICATIONS
```

### 9.3 Tong hop quan he

```
Quan he                                     | Kieu     | Mo ta
--------------------------------------------|----------|-----------------------------
USERS --- FITNESS_PASSPORT                  | 1:1      | Moi user co 1 Passport
USERS --- WORKOUT_SESSIONS                  | 1:N      | 1 user nhieu session
WORKOUT_SESSIONS --- EXERCISE_LOGS          | 1:N      | 1 session nhieu bai tap
USERS --- FOOD_ORDERS                       | 1:N      | 1 user nhieu don hang
USERS (vendor) --- FOOD_PRODUCTS            | 1:N      | 1 vendor nhieu san pham
FOOD_PRODUCTS --- FOOD_REVIEWS              | 1:N      | 1 san pham nhieu review
USERS --- FOOD_REVIEWS                      | 1:N      | 1 user nhieu review
USERS --- GEAR_ITEMS                        | 1:N      | 1 user so huu nhieu gear
GEAR_ITEMS --- GEAR_LIFECYCLE               | 1:N      | 1 gear nhieu lifecycle entry
GEAR_ITEMS --- GEAR_TRANSACTIONS            | 1:N      | 1 gear nhieu giao dich
USERS (owner) --- GYMS                      | 1:N      | 1 owner nhieu phong tap
USERS --- GYM_MEMBERSHIPS                   | 1:N      | 1 user nhieu membership
GYMS --- GYM_MEMBERSHIPS                    | 1:N      | 1 gym nhieu member
USERS --- FITCOIN_TRANSACTIONS              | 1:N      | 1 user nhieu giao dich FC
CHALLENGES --- USER_CHALLENGES              | 1:N      | 1 challenge nhieu user tham gia
USERS --- USER_CHALLENGES                   | 1:N      | 1 user tham gia nhieu challenge
USERS --- SOCIAL_POSTS                      | 1:N      | 1 user nhieu post
USERS --- USERS (FOLLOWS)                   | N:N      | User follow nhau
USERS --- NOTIFICATIONS                     | 1:N      | 1 user nhieu notification
```

---

## 10. DATA DICTIONARY

### 10.1 Bang USERS

Truong           | Kieu du lieu       | Rang buoc          | Mo ta
-----------------|--------------------|--------------------|---------------------------
user_id          | INT                | PK, AUTO_INCREMENT | Ma dinh danh user
email            | VARCHAR(255)       | UQ, NN             | Email dang nhap
phone            | VARCHAR(15)        | UQ                 | So dien thoai (tuy chon)
password_hash    | VARCHAR(255)       | NN                 | Mat khau da hash (bcrypt)
role             | ENUM               | NN, DEFAULT member | member/vendor/gym_owner
display_name     | VARCHAR(100)       | NN                 | Ten hien thi
avatar_url       | VARCHAR(500)       |                    | URL anh dai dien
fitness_goal     | ENUM               |                    | bulk/cut/maintain
xp_total         | INT                | DEFAULT 0, CHECK>=0| Tong XP tich luy
current_level    | INT                | DEFAULT 1, CHECK>=1| Level hien tai
current_streak   | INT                | DEFAULT 0, CHECK>=0| So ngay streak lien tiep
fitcoin_balance  | DECIMAL(12,2)      | DEFAULT 0, CHECK>=0| So du FitCoin
tdee             | INT                | CHECK > 0          | TDEE da tinh (kcal)
referred_by      | INT                | FK->USERS          | User da gioi thieu
last_active_date | DATE               |                    | Ngay hoat dong gan nhat
allergens        | JSONB              | DEFAULT '[]'       | Danh sach di ung thuc pham
created_at       | DATETIME           | DEFAULT NOW()      | Ngay tao tai khoan

### 10.2 Bang FOOD_PRODUCTS

Truong           | Kieu du lieu       | Rang buoc          | Mo ta
-----------------|--------------------|--------------------|---------------------------
product_id       | INT                | PK, AUTO_INCREMENT | Ma san pham
vendor_id        | INT                | FK->USERS, NN      | Ma vendor
name             | VARCHAR(200)       | NN                 | Ten mon an
description      | TEXT               |                    | Mo ta chi tiet
price            | DECIMAL(10,2)      | NN, CHECK > 0      | Gia ban (VND)
calories         | INT                | NN, CHECK >= 0     | Tong calo
protein_g        | DECIMAL(5,1)       | NN                 | Protein (gram)
carb_g           | DECIMAL(5,1)       | NN                 | Carbohydrate (gram)
fat_g            | DECIMAL(5,1)       | NN                 | Fat (gram)
ingredients      | TEXT (JSON)        |                    | Danh sach nguyen lieu
allergens        | TEXT (JSON)        |                    | Thanh phan di ung
images           | TEXT (JSON)        | NN                 | Danh sach URL anh
is_available     | BOOLEAN            | DEFAULT true       | Con hang hay het
avg_rating       | DECIMAL(2,1)       | DEFAULT 0          | Diem danh gia trung binh
total_reviews    | INT                | DEFAULT 0          | Tong so luot danh gia
created_at       | DATETIME           | DEFAULT NOW()      | Ngay tao

### 10.3 Bang GEAR_ITEMS

Truong           | Kieu du lieu       | Rang buoc          | Mo ta
-----------------|--------------------|--------------------|---------------------------
gear_id          | VARCHAR(20)        | PK                 | Ma duy nhat (GEAR-XXXX-XXXX)
current_owner_id | INT                | FK->USERS, NN      | Chu so huu hien tai
lister_id        | INT                | FK->USERS, NN      | Nguoi dang ban dau (khong doi)
lister_role      | VARCHAR(20)        | NN, DEFAULT gym_owner | 'gym_owner' hoac 'member'
category         | ENUM               | NN                 | Weights/Apparel/Supplements/Accessories/Cardio/Recovery
name             | VARCHAR(200)       | NN                 | Ten thiet bi
description      | TEXT               |                    | Mo ta
condition_rating | INT                | NN, CHECK 1-5      | Danh gia tinh trang (1-5)
condition_notes  | TEXT               |                    | Ghi chu tinh trang
images           | TEXT (JSON)        | NN                 | Danh sach URL anh (min 2)
listing_type     | ENUM               | NN                 | sell (GymOwner) hoac rent (Member) - BR-11B
sell_price       | DECIMAL(12,2)      |                    | Gia ban (nullable neu chi cho thue)
rent_price_day   | DECIMAL(10,2)      |                    | Gia thue/ngay
rent_price_week  | DECIMAL(10,2)      |                    | Gia thue/tuan
deposit_amount   | DECIMAL(12,2)      |                    | Tien coc (cho thue)
qr_code_url      | VARCHAR(500)       |                    | URL hinh QR Code
verified         | BOOLEAN            | DEFAULT false      | Da duoc admin duyet chua
is_available     | BOOLEAN            | DEFAULT true       | Con kha dung hay khong
avg_rating       | DECIMAL(2,1)       | DEFAULT 0          | Diem danh gia trung binh
total_reviews    | INT                | DEFAULT 0          | Tong so luot danh gia
created_at       | DATETIME           | DEFAULT NOW()      | Ngay dang
CONSTRAINT       |                    | member_rent_only   | Member chi duoc listing_type = 'rent' (BR-11B)


### 10.4 Bang GEAR_LIFECYCLE

Truong           | Kieu du lieu       | Rang buoc          | Mo ta
-----------------|--------------------|--------------------|---------------------------
lifecycle_id     | INT                | PK, AUTO_INCREMENT | Ma entry
gear_id          | VARCHAR(20)        | FK->GEAR_ITEMS, NN | Ma thiet bi
owner_id         | INT                | FK->USERS, NN      | Chu nhan tai thoi diem
action           | ENUM               | NN                 | listed/sold/rented/returned/relisted
condition_at_time| INT                | CHECK 1-5          | Tinh trang tai thoi diem
notes            | TEXT               |                    | Ghi chu cua chu nhan
photos           | TEXT (JSON)        |                    | Anh tai thoi diem
timestamp        | DATETIME           | DEFAULT NOW()      | Thoi diem ghi nhan

---

## 11. DFD (DATA FLOW DIAGRAM)

### 11.1 DFD Level 0 — Context Diagram

```
Quy uoc ky hieu:
  [   ] = External Entity (thuc the ngoai)
  (   ) = Process (tien trinh)
  --->  = Data Flow (luong du lieu)

                    Thong tin dang ky
            [Guest/Member] -----------------> (  HE THONG  )
                    <-----------------         ( FITFUEL+  )
                    Ket qua xac thuc           (          )
                                               (   0.0    )
                    Don hang, thanh toan
            [Guest/Member] -----------------> (          )
                    <-----------------         (          )
                    Xac nhan don, trang thai    (          )
                                               (          )
                    Du lieu buoi tap
            [Member] -----------------------> (          )
                    <-----------------         (          )
                    Goi y food/gear, thong ke   (          )
                                               (          )
                    San pham, gia
            [Food Vendor] ------------------> (          )
                    <-----------------         (          )
                    Don hang, analytics         (          )
                                               (          )
                    Gear cho thue (Member) / ban (GymOwner)
            [Member/GymOwner Gear] ----------> (          )
                    <-----------------         (          )
                    Gear ID, FitCoin            (          )
                                               (          )
            [Gym Owner] --------------------> (          )
                    <-----------------         (          )
                    Dashboard, analytics        (          )
                                               (          )
                                               ( 5.0      ) 
                    Lenh duyet, quyet dinh      ( Quan ly  )
                                        ----> ( he thong )(          )
                    <-----------------         (          )
                    Bao cao he thong            (          )
```

### 11.2 DFD Level 1

```
Quy uoc bo sung:
  =   = = Data Store (kho du lieu)
  [ ] = External Entity
  ( ) = Process

                                     [Guest/Member]
                                       |       ^
                           Thong tin   |       | Ket qua
                           dang nhap   |       | xac thuc
                                       v       |
                                   (1.0 Quan ly)
                                   ( Tai khoan )
                                       |   ^
                              Luu/Doc  |   | Doc
                              user     v   | user
                                   = = D1: USERS = =


                                     [Member]
                                       |       ^
                           Du lieu     |       | Thong ke,
                           buoi tap    |       | goi y bai tap
                                       v       |
                                   (2.0 Gym   )
                                   ( Tracking )
                                       |   ^
                              Luu      |   | Doc
                              session  v   | session
                                   = = D2: WORKOUT_SESSIONS = =
                                   = = D3: EXERCISE_LOGS = =


                                     [Guest/Member]
                                       |       ^
                           Chon food,  |       | Xac nhan,
                           dat hang    |       | goi y food
                                       v       |
                                   (3.0 Food  )
                                   ( Order    )
                                       |   ^           ^
                              Luu      |   | Doc       | Doc gym log
                              order    v   | food      | (tu D2)
                                   = = D4: FOOD_PRODUCTS = =
                                   = = D5: FOOD_ORDERS = =
                                               |
                                               v
                                         [Food Vendor]
                                         (Nhan don hang)


                                     [Member/Seller]
                                       |       ^
                           Dang/mua/   |       | Gear ID,
                           thue gear   |       | lifecycle
                                       v       |
                                   (4.0 Gear  )
                                   ( Hub      )
                                       |   ^
                              Luu      |   | Doc
                              gear     v   | gear
                                   = = D6: GEAR_ITEMS = =
                                   = = D7: GEAR_LIFECYCLE = =
                                   = = D8: GEAR_TRANSACTIONS = =


                                     [Member]
                                       |       ^
                           Hanh dong   |       | XP, badge,
                           (tap, an)   |       | ranking
                                       v       |
                                   (5.0 Gamifi)
                                   ( cation   )
                                       |   ^
                              Luu      |   | Doc
                              XP       v   | user
                                   = = D1: USERS (xp, level, streak) = =
                                   = = D9: CHALLENGES = =
                                   = = D10: BADGES = =


                                     [Guest/Member]
                                       |       ^
                           Thanh toan, |       | Xac nhan,
                           nap FitCoin |       | so du
                                       v       |
                                   (6.0 Payment)
                                   ( & FitCoin )
                                       |   ^
                              Luu      |   | Doc
                              txn      v   | balance
                                   = = D11: FITCOIN_TRANSACTIONS = =
                                   = = D1: USERS (fitcoin_balance) = =


                                     [Gym Owner]
                                         |
                                         | Thong tin cau hinh
                                         v
                                   (7.0 Gym Owner )
                                   ( Dashboard  )
                                   ( & Panel    )
                                         |
                                         | Dashboard Data, Reports
                                         v
                                     [Gym Owner]                                  = = Tat ca Data Store = =
```

---

## 12. CLASS DIAGRAM

```
Quy uoc:
  + = public
  - = private
  # = protected

+===========================+
|         User              |
|===========================|
| - user_id: int            |
| - email: string           |
| - phone: string           |
| - password_hash: string   |
| - role: Role              |
| - display_name: string    |
| - avatar_url: string      |
| - fitness_goal: FitnessGoal
| - xp_total: int           |
| - current_level: int      |
| - current_streak: int     |
| - fitcoin_balance: decimal|
| - tdee: int               |
|===========================|
| + register()              |
| + login()                 |
| + updateProfile()         |
| + calculateTDEE()         |
| + earnXP(amount)          |
| + spendFitCoin(amount)    |
| + earnFitCoin(amount)     |
| + getPassport()           |
+===========================+
        |
        | 1:1
        v
+===========================+
|    FitnessPassport        |
|===========================|
| - passport_id: int        |
| - total_sessions: int     |
| - total_volume: decimal   |
| - longest_streak: int     |
| - body_weight_log: JSON   |
| - body_photos: JSON       |
| - milestone_badges: JSON  |
|===========================|
| + updateStats()           |
| + addBodyPhoto()          |
| + unlockBadge(badge_id)   |
| + getTimeline()           |
+===========================+


+===========================+       +===========================+
|    WorkoutSession         |       |     ExerciseLog           |
|===========================|       |===========================|
| - session_id: int         |       | - log_id: int             |
| - user_id: int            |       | - session_id: int         |
| - gym_id: int             |       | - exercise_name: string   |
| - date: Date              |       | - muscle_group: MuscleGroup
| - duration_min: int       |       | - sets: JSON              |
| - notes: string           |       | - is_pr: boolean          |
|===========================|       |===========================|
| + create()                |       | + addSet(reps, weight)    |
| + complete()              |       | + removeSet(index)        |
| + addExercise()           |       | + checkPR()               |
| + getDuration()           |       | + getVolume()             |
+===========================+       +===========================+
        |          1:N              |
        +--------------------------+


+===========================+       +===========================+
|    FoodProduct            |       |      FoodOrder            |
|===========================|       |===========================|
| - product_id: int         |       | - order_id: int           |
| - vendor_id: int          |       | - user_id: int            |
| - name: string            |       | - guest_phone: string     |
| - price: decimal          |       | - vendor_id: int          |
| - calories: int           |       | - items: JSON             |
| - protein_g: decimal      |       | - total_amount: decimal   |
| - carb_g: decimal         |       | - fitcoin_used: decimal   |
| - fat_g: decimal          |       | - delivery_time: string   |
| - allergens: JSON         |       | - status: OrderStatus     |
| - is_available: boolean   |       |===========================|
|===========================|       | + create()                |
| + getMacroBreakdown()     |       | + updateStatus(status)    |
| + updateAvailability()    |       | + calculateTotal()        |
| + getReviews()            |       | + reorder()               |
+===========================+       +===========================+


+===========================+       +===========================+
|     GearItem              |       |    GearLifecycleEntry     |
|===========================|       |===========================|
| - gear_id: string         |       | - lifecycle_id: int       |
| - current_owner_id: int   |       | - gear_id: string         |
| - category: GearCategory  |       | - owner_id: int           |
| - name: string            |       | - action: GearAction      |
| - condition_rating: int   |       | - condition_at_time: int  |
| - listing_type: ListType  |       | - notes: string           |
| - sell_price: decimal     |       | - photos: JSON            |
| - rent_price_day: decimal |       | - timestamp: DateTime     |
| - deposit: decimal        |       |===========================|
| - is_available: boolean   |       | + create()                |
|===========================|       +===========================+
| + generateGearId()        |              |
| + generateQRCode()        |              | 1:N
| + getLifecycle()          |--------------+
| + transferOwnership(newOwner)
| + updateCondition()       |
+===========================+


+===========================+       +===========================+
|    GamificationService    |       |      Challenge            |
|===========================|       |===========================|
| (Utility class)           |       | - challenge_id: int       |
|===========================|       | - title: string           |
| + calculateXP(action)     |       | - type: ChallengeType     |
| + checkLevelUp(user)      |       | - criteria: JSON          |
| + checkBadgeUnlock(user)  |       | - reward_xp: int          |
| + updateStreak(user)      |       | - reward_fitcoin: decimal |
| + resetStreak(user)       |       | - start_date: Date        |
| + getRanking(filter)      |       | - end_date: Date          |
+===========================+       |===========================|
                                    | + joinChallenge(user_id)  |
                                    | + updateProgress(user_id) |
+===========================+       | + checkCompletion()       |
| SuggestionEngine          |       +===========================+
|===========================|
| (Utility class)           |
|===========================|       +===========================+
| + suggestFood(            |       |      FitCoinService       |
|     muscle_group)         |       |===========================|
| + suggestGear(            |       | (Utility class)           |
|     gym_log)              |       |===========================|
| + suggestWorkout(         |       | + earn(user, amount,      |
|     frequency_data)       |       |        source)            |
+===========================+       | + spend(user, amount,     |
                                    |        source)            |
                                    | + deposit(user, amount)   |
                                    | + getBalance(user)        |
                                    | + getHistory(user)        |
                                    +===========================+


ENUM Definitions:

  Role: member, vendor, gym_owner
  FitnessGoal: bulk, cut, maintain
  MuscleGroup: chest, back, legs, shoulders, arms, core
  SessionStatus: active, done, cancelled
  OrderStatus: pending, confirmed, preparing, delivering, delivered, cancelled
  GearCategory: Weights, Apparel, Supplements, Accessories, Cardio, Recovery
  GearAction: listed, sold, rented, returned, relisted
  ListType: sell, rent, both
  GearTxnType: sale, rental
  GearTxnStatus: pending, active, completed, disputed
  MembershipStatus: active, expired, cancelled
  ChallengeType: weekly, monthly, special
  UserChallengeStatus: in_progress, completed, failed
  BadgeCategory: gym, food, gear, social, streak
  FitCoinType: earn, spend, deposit, refund
  FitCoinSource: gear_sale, challenge, referral, streak, deposit, food_order, gear_rental, membership
  PostType: milestone, pr, streak, transformation, review
  NotifType: streak_reminder, order_update, promo, challenge, gear_return, gym_closed, gear_approved
```

---

## 13. SITEMAP

```
FitFuel+
|
+-- / (P) Landing Page
|   Bao gom: Hero, 3 module, Pricing Section (Toggle Thang/Nam),
|   Nut [Dang ky ngay] -> mo Checkout Modal (tao tai khoan + thanh toan)
|
+-- /auth
|   +-- /auth/login (P) Dang nhap (email + password)
|   +-- /auth/register (P) Dang ky cho Vendor / Gym Owner
|   Ghi chu: Member dang ky qua Checkout Modal, KHONG qua /auth/register (BR-40)
|
+-- /dashboard (M) Member Dashboard
|   Tong quan: streak, XP, level, macro hom nay, buoi tap gan nhat
|
+-- /gym (M) Module Gym Tracking
|   +-- /gym/new-session    Tao buoi tap moi
|   +-- /gym/session/:id    Chi tiet buoi tap + log exercise
|   +-- /gym/history        Lich su buoi tap
|   +-- /gym/progress       Bieu do tien do (ExerciseProgress)
|   +-- /gym/records        Personal Records
|
+-- /food (P/M) Module Food Order
|   +-- /food               Danh sach food (listing + filter)
|   +-- /food/:id           Chi tiet food
|
+-- /cart (P) Gio hang
|
+-- /checkout (P) Thanh toan (Guest OTP / Member)
|
+-- /orders (M) Lich su don hang
|
+-- /gear (P/M) Module Gear Hub
|   +-- /gear               Danh sach gear (listing + filter)
|   +-- /gear/:id           Chi tiet gear
|   +-- /gear/:id/rent (M)  Dat thue gear
|   +-- /gear/:id/lifecycle (M) Xem Gear Lifecycle
|   +-- /gear/sell (M/G)    Dang ban/cho thue gear
|   +-- /gear/manage (M/G)  Quan ly listing cua toi
|
+-- /passport (M) Fitness Passport
|
+-- /tdee (M) TDEE Calculator
|
+-- /macro (M) Macro Dashboard
|
+-- /leaderboard (M) Ranking Board
|
+-- /social (M) Community / Social Feed
|
+-- /challenges (M) Weekly Challenges
|
+-- /fitcoin (M) Lich su FitCoin + Nap them
|
+-- /ai-assistant (M) AI FitBot Assistant
|
+-- /membership (M) Quan ly goi tap (Checkout Modal)
|
+-- /profile (M) Thong tin ca nhan
|
+-- /vendor (V) Food Vendor Portal
|   +-- /vendor/dashboard   Dashboard vendor
|   +-- /vendor/products    Quan ly san pham
|   +-- /vendor/orders      Quan ly don hang
|   +-- /vendor/reviews     Danh gia tu khach hang
|   +-- /vendor/analytics   Thong ke doanh thu
|
+-- /gym-owner (G) Gym Owner Dashboard
|   +-- /gym-owner/dashboard     Dashboard phong tap
|   +-- /gym-owner/members       Danh sach member
|   +-- /gym-owner/analytics     Thong ke phong tap
|   +-- /gym-owner/announcements Gui thong bao
|
+-- /admin (G) Admin Panel (quyen Gym Owner)
    +-- /admin/dashboard     Management Dashboard
    +-- /admin/users         Quan ly user (xem, khoa/mo)
    +-- /admin/vendors       Duyet vendor
    +-- /admin/gear-disputes Xu ly tranh chap gear
    +-- /admin/reports       Bao cao tong the he thong
```

---

## 14. BUSINESS RULES (Quy tac nghiep vu)

### 14.1 QUY TAC XAC THUC VA BAO MAT
========================================================================

BR-01: QUY TAC MAT KHAU
  Loai     : Rang buoc
  Chi tiet : Mat khau phai co it nhat 8 ky tu, bao gom:
             - It nhat 1 chu hoa (A-Z)
             - It nhat 1 chu thuong (a-z)
             - It nhat 1 so (0-9)
  Ap dung  : 01, Profile Settings (Doi mat khau)
  Vi du    : "MyPass123" = hop le. "mypass123" = khong (thieu chu hoa).

BR-02: QUY TAC OTP
  Loai     : Rang buoc
  Chi tiet : OTP co 6 chu so, sinh ngau nhien.
             OTP co hieu luc trong 5 phut ke tu khi gui.
             User duoc nhap toi da 3 lan. Sau 3 lan sai, khoa 15 phut.
             Moi OTP chi duoc dung 1 lan (da dung thi vo hieu hoa).
  Ap dung  : 02, 01 (Dang ky bang SDT)

BR-03: QUY TAC JWT TOKEN
  Loai     : Rang buoc
  Chi tiet : Access token het han sau 7 ngay.
             Refresh token het han sau 30 ngay.
             Token bi vo hieu hoa khi user doi mat khau hoac xoa tai khoan.
             Guest OTP chi nhan temporary token (het han 30 phut).
  Ap dung  : Toan bo he thong

BR-04: QUYEN CUA GUEST
  Loai     : Rang buoc
  Chi tiet : Guest (chua dang ky) CHI duoc:
             - Xem food listing va food detail.
             - Xem gear listing va gear detail (bao gom Lifecycle).
             - Them san pham vao gio hang.
             - Checkout bang OTP.
             Guest KHONG duoc:
             - Gym Tracking (tao session, log exercise).
             - Gamification (XP, badge, streak, ranking).
             - Social (post, follow).
             - Dang ban/cho thue gear.
             - Fitness Passport.
             - AI Food Suggestion.
             - FitCoin.
  Ap dung  : Toan bo he thong

========================================================================

### 14.2 QUY TAC FOOD ORDER

BR-05: DON HANG TOI THIEU
  Loai     : Rang buoc
  Chi tiet : Moi don hang phai co it nhat 1 san pham.
             Tong gia tri don (truoc phi giao hang) phai >= 30,000 VND.
  Ap dung  : 08 (Dat suat an & Checkout)

BR-06: PHI GIAO HANG
  Loai     : Tinh toan
  Chi tiet : Khoang cach duoi 5km: phi giao hang = 15,000 VND.
             Khoang cach 5km den 10km: phi giao hang = 25,000 VND.
             Khoang cach tren 10km: khong ho tro giao hang.
  Ap dung  : 08 (Dat suat an & Checkout)
  Ghi chu  : Trong MVP, khoang cach tinh bang tuyen tinh (khong dung
             Google Maps API). Co the dung gia tri co dinh cho demo.

BR-07: THOI HAN XAC NHAN DON
  Loai     : Hanh dong
  Chi tiet : Food Vendor phai xac nhan don trong 15 phut ke tu khi
             nhan duoc. Neu qua 15 phut khong xac nhan, he thong
             tu dong huy don va hoan tien cho user.
  Ap dung  : 11 (Quan tri cua hang)

BR-08: QUY TAC HUY DON
  Loai     : Rang buoc
  Chi tiet : User chi co the huy don khi trang thai la:
             - "pending" (chua xac nhan): huy ngay, hoan tien 100%.
             - "confirmed" (da xac nhan): huy duoc, hoan tien 100%.
             Khong duoc huy khi trang thai la:
             - "preparing", "delivering", "delivered".
  Ap dung  : 08 (Dat suat an & Checkout), Orders page

BR-09: HOA HONG NEN TANG - FOOD
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 10% tren tong gia tri don hang
             (khong tinh phi giao hang).
             Vi du: Don 200,000 VND + phi ship 15,000 VND
             -> Hoa hong = 200,000 * 10% = 20,000 VND.
             -> Vendor nhan = 200,000 - 20,000 = 180,000 VND.
  Ap dung  : He thong thanh toan

BR-10: QUICK RE-ORDER
  Loai     : Rang buoc
  Chi tiet : Khi user nhan [Dat lai], he thong kiem tra tung mon:
             - Mon con hang (is_available = true): them vao cart.
             - Mon het hang: bo qua, thong bao cho user.
             Cart moi KHONG ghi de cart cu (them vao cart hien tai).
  Ap dung  : 09 (Dat lai don cu)

========================================================================

### 14.3 QUY TAC GEAR HUB

BR-11: SO LUONG ANH GEAR
  Loai     : Rang buoc
  Chi tiet : Moi gear phai co toi thieu 2 anh thuc te.
             Toi da 8 anh. Moi anh toi da 5MB.
             Anh dau tien la anh dai dien (thumbnail).
  Ap dung  : 13 (Dang ky ky gui thiet bi)

BR-11B: QUYEN DANG BAN VA CHO THUE GEAR
  Loai     : Rang buoc
  Chi tiet : Do day la web kinh doanh B2C/C2C:
             - Gym Owner: CHI duoc quyen dang thiet bi de BAN dut (khong duoc cho thue).
             - Member: CHI duoc quyen dang thiet bi de CHO THUE Peer-to-Peer (khong the ban).
  Ap dung  : 13 (Dang ky ky gui thiet bi)

BR-12: GEAR ID KHONG DOI
  Loai     : Rang buoc
  Chi tiet : Gear ID duoc he thong gen tu dong theo format:
             GEAR-{4 ky tu ngau nhien}-{4 so cuoi timestamp}
             Vi du: GEAR-K7X2-3841
             Sau khi tao, Gear ID KHONG THE thay doi hoac xoa.
             Gear ID theo thiet bi suot vong doi, bat ke doi tay bao nhieu lan.
  Ap dung  : 13 (Dang ky ky gui thiet bi)

BR-13: TIEN COC CHO THUE
  Loai     : Rang buoc
  Chi tiet : Tien coc cho thue >= 50% gia tri thiet bi (sell_price).
             Neu thiet bi chi cho thue (khong co sell_price):
             coc >= 50% * (rent_price_day * 30).
             Tien coc duoc hoan tra khi tra gear dung han va dung tinh trang.
  Ap dung  : 14 (Giao dich thiet bi)

BR-14: THOI HAN TRA GEAR
  Loai     : Rang buoc
  Chi tiet : Nguoi thue phai tra gear trong vong 3 ngay sau khi het han thue.
             He thong gui nhac nho truoc 1 ngay het han.
             He thong gui nhac nho hang ngay khi qua han.
  Ap dung  : 14 (Giao dich thiet bi)

BR-15: PHI PHAT TRA TRE
  Loai     : Tinh toan
  Chi tiet : Moi ngay tra tre, phi phat = 10% gia thue/ngay.
             Vi du: gia thue = 20,000 VND/ngay. Tra tre 3 ngay.
             Phi phat = 20,000 * 10% * 3 = 6,000 VND.
             Phi phat tu dong tru tu tien coc.
             Neu phi phat > tien coc: khong hoan coc va user bi danh dau.
  Ap dung  : 14 (Giao dich thiet bi)

BR-16: HOA HONG BAN GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 7% tren gia ban gear.
             Vi du: Gear ban 500,000 VND.
             Hoa hong = 500,000 * 7% = 35,000 VND.
             Seller nhan = 465,000 VND (tien hoac FitCoin).
  Ap dung  : 14 (Giao dich thiet bi)

BR-17: HOA HONG THUE GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 15% tren phi thue.
             Vi du: Thue 7 ngay, phi = 100,000 VND.
             Hoa hong = 100,000 * 15% = 15,000 VND.
             Seller nhan = 85,000 VND.
  Ap dung  : 14 (Giao dich thiet bi)

========================================================================

### 14.4 QUY TAC GAMIFICATION

BR-18: BANG TINH XP
  Loai     : Tinh toan
  Chi tiet : XP duoc cong theo bang sau:
             Hanh dong                    | XP
             -----------------------------|----
             Hoan thanh 1 buoi tap        | +50
             Dat Personal Record moi      | +30
             Dat 1 don food               | +20
             Hoan thanh Weekly Challenge   | +100
             Hoan thanh Monthly Challenge  | +200
             Ban gear thanh cong          | +80
             Moi ban (ca 2 ben nhan)      | +50
             Check-in QR tai phong tap    | +10
             Post milestone len Feed      | +5
  Ap dung  : 16 (Xem XP, Level & Huy hieu)

BR-19: BANG LEVEL
  Loai     : Tinh toan
  Chi tiet : Level up khi tong XP dat moc:
             Level  | XP can thiet | Ten level
             -------|--------------|----------
             1      | 0            | Newbie
             2      | 200          | Starter
             3      | 500          | Regular
             4      | 1,000        | Committed
             5      | 2,000        | Dedicated
             6      | 4,000        | Strong
             7      | 7,000        | Advanced
             8      | 11,000       | Elite
             9      | 16,000       | Champion
             10     | 25,000       | Legend
  Ap dung  : Module Gamification

BR-20: DIEU KIEN TINH STREAK
  Loai     : Suy dien
  Chi tiet : Streak duoc cong +1 khi user thuc hien IT NHAT 1 trong cac
             hanh dong sau trong ngay:
             - Hoan thanh 1 buoi tap (workout session status = done).
             - Dat 1 don food healthy.
             Streak tinh theo ngay lich (00:00 - 23:59).
             Moi ngay chi tinh streak 1 lan (du tap 2 buoi, van +1).
  Ap dung  : 16 (Xem XP, Level & Huy hieu)

BR-21: RESET STREAK
  Loai     : Hanh dong
  Chi tiet : Streak bi reset ve 0 khi 2 ngay lien tiep khong co
             bat ky hoat dong nao (khong tap, khong dat food).
             Timer kiem tra moi ngay luc 00:05 (cho du lieu ngay truoc
             duoc ghi nhan xong).
             Khi streak bi reset, gui notification nhac nho user.
  Ap dung  : Timer Actor, Module Gamification

BR-22: THUONG STREAK MILESTONE
  Loai     : Hanh dong
  Chi tiet : Khi streak dat moc, user duoc thuong FitCoin:
             Streak 7 ngay  : +50 FitCoin
             Streak 30 ngay : +200 FitCoin
             Streak 60 ngay : +500 FitCoin
             Streak 100 ngay: +1,000 FitCoin
             Streak 365 ngay: +5,000 FitCoin
             Dong thoi, he thong tu tao post milestone len Social Feed.
  Ap dung  : Module Gamification, Module Social

========================================================================

### 14.5 QUY TAC FITCOIN

BR-23: TY GIA FITCOIN
  Loai     : Rang buoc
  Chi tiet : 1 FitCoin = 1 VND. Ty gia co dinh, khong thay doi.
  Ap dung  : Toan bo he thong

BR-24: HAN CHE SU DUNG FITCOIN
  Loai     : Rang buoc
  Chi tiet : FitCoin KHONG duoc rut ra tien mat.
             FitCoin chi duoc su dung trong he thong FitFuel+.
             So du FitCoin khong duoc am (< 0).
  Ap dung  : Module FitCoin

BR-25: NGUON EARN FITCOIN
  Loai     : Suy dien
  Chi tiet : User nhan FitCoin tu cac nguon:
             - Ban gear thanh cong (so tien ban - hoa hong)
             - Streak milestone (theo BR-22)
             - Hoan thanh challenge (theo reward cua challenge)
             - Gioi thieu ban (referral bonus: 50 FC moi lan)
             - Nap tien thanh FitCoin (1 VND = 1 FC)
  Ap dung  : Module FitCoin

BR-26: NGUON SPEND FITCOIN
  Loai     : Suy dien
  Chi tiet : User tieu FitCoin cho:
             - Mua food (thanh toan 1 phan hoac toan bo)
             - Thue gear (thanh toan 1 phan hoac toan bo)
             - Mua gear (thanh toan 1 phan hoac toan bo)
             - Gia han membership phong tap
  Ap dung  : Module FitCoin

BR-27: GIOI HAN SU DUNG FITCOIN MOI DON
  Loai     : Rang buoc
  Chi tiet : Toi da su dung 50% gia tri don hang bang FitCoin.
             Phan con lai phai thanh toan bang tien that (VNPay/Momo).
             Vi du: Don 200,000 VND. Toi da dung 100,000 FitCoin.
             Phan con lai 100,000 VND phai tra bang tien.
  Ap dung  : 08 (Dat suat an & Checkout), 14 (Giao dich thiet bi)

========================================================================

### 14.6 QUY TAC AI SUGGESTION (RULE-BASED)

BR-28: BANG MAPPING MUSCLE GROUP -> MACRO PRIORITY
  Loai     : Suy dien
  Chi tiet : Moi nhom co duoc map den muc do uu tien cua tung macro:
             Nhom co     | Protein  | Carb     | Fat
             ------------|----------|----------|--------
             chest       | high     | medium   | low
             back        | high     | medium   | low
             legs        | high     | high     | low
             shoulders   | medium   | low      | low
             arms        | high     | low      | low
             core        | medium   | low      | low
             rest_day    | low      | low      | medium
  Ap dung  : 10 (AI goi y thuc don)

BR-29: CACH SORT THEO PRIORITY
  Loai     : Tinh toan
  Chi tiet : Muc do priority duoc chuyen thanh cach sort:
             - "high"   = ORDER BY truong_do DESC (giam dan, uu tien cao)
             - "medium" = khong sort theo truong nay (trung tinh)
             - "low"    = ORDER BY truong_do ASC (tang dan, uu tien thap)
             Uu tien sort: protein truoc, roi carb, roi fat.
  Ap dung  : SuggestionEngine

BR-30: SO LUONG GOI Y
  Loai     : Rang buoc
  Chi tiet : He thong LUON tra ve dung 3 mon goi y.
             Neu ket qua query < 3 mon phu hop:
             bo sung bang mon co avg_rating cao nhat
             (bat ke macro co khop hay khong).
             Neu database khong co mon nao: hien thi thong bao
             "Chua co mon an phu hop" va nut [Xem tat ca].
  Ap dung  : 10 (AI goi y thuc don), SuggestionEngine

========================================================================

### 14.7 QUY TAC GYM TRACKING

BR-31: QUY TAC TINH PERSONAL RECORD (PR)
  Loai     : Tinh toan
  Chi tiet : Ky luc ca nhan duoc tinh doc lap cho tung bai tap.
             Cong thuc: PR = max(weight x reps) trong toan bo lich su.
             Mot buoi tap co the pha nhieu PR cung luc.
  Ap dung  : 05 (Ghi nhan buoi tap)

BR-32: GOI Y NHOM CO (SMART SUGGESTION)
  Loai     : Suy dien
  Chi tiet : He thong tu dong quet lich su 7 ngay gan nhat.
             Nhom co co tan suat tap thap nhat se duoc de xuat tap hom nay.
             Neu tan suat bang nhau, uu tien nhom co co thoi gian nghi lau nhat.
  Ap dung  : 05 (Ghi nhan buoi tap)

BR-33: KHOA DU LIEU GYM SESSION
  Loai     : Rang buoc
  Chi tiet : Du lieu buoi tap chi duoc phep chinh sua hoac xoa trong
             vong 24 gio ke tu khi ket thuc (status = Done).
             Sau 24 gio, ban ghi bi khoa vinh vien.
  Ap dung  : 05 (Ghi nhan buoi tap)

========================================================================

### 14.8 QUY TAC HE THONG KHAC

BR-34: THUAT TOAN TIE-BREAKING NHOM CO
  Loai     : Suy dien
  Chi tiet : Neu buoi tap co nhieu nhom co co so set bang nhau (VD: Fullbody),
             he thong uu tien cac nhom co lon tieu hao nhieu nang luong
             theo thu tu: Legs > Back > Chest > Shoulders > Arms > Core.
  Ap dung  : SuggestionEngine

BR-35: DOC QUYEN VENDOR TRONG GIO HANG
  Loai     : Rang buoc
  Chi tiet : De dam bao quy trinh van chuyen, mot gio hang (Cart) chi duoc
             chua san pham tu mot Food Vendor duy nhat.
  Ap dung  : 08 (Dat suat an & Checkout)

BR-36: MERGE TAI KHOAN GUEST
  Loai     : Hanh dong
  Chi tiet : Du lieu gio hang va don hang cua Guest duoc gan voi SDT.
             Khi Guest tao tai khoan Member bang dung SDT do, he thong
             tu dong dong bo (merge) toan bo lich su vao tai khoan moi.
  Ap dung  : 01 (Dang ky & Dang nhap)

BR-37: QUY TAC BAT BIEN VONG DOI (APPEND-ONLY)
  Loai     : Rang buoc
  Chi tiet : Bang GEAR_LIFECYCLE hoat dong theo co che chi-duoc-them.
             Moi thay doi trang thai deu phai tao ban ghi moi.
             Tuyet doi cam thao tac UPDATE/DELETE tren cac ban ghi cu.
  Ap dung  : Toan bo Module Gear Hub

BR-38: BAO MAT CALLBACK THANH TOAN (WEBHOOK)
  Loai     : Rang buoc
  Chi tiet : Moi request tra ve tu cong thanh toan bat buoc phai vuot
             qua buoc doi chieu chu ky (HMAC). Sai chu ky se bi tu choi.
  Ap dung  : 19 (Quan ly & Giao dich FitCoin)

BR-39: TINH NGUYEN TU (IDEMPOTENCY) CUA GIAO DICH
  Loai     : Rang buoc
  Chi tiet : He thong chi xu ly cong tien/chuyen trang thai dung 1 lan
             duy nhat cho moi Transaction ID tu cong thanh toan de
             tranh loi nhan doi don do mang bi delay.
  Ap dung  : 19 (Quan ly & Giao dich FitCoin)

BR-40: QUY TAC DANG KY MEMBER
  Loai     : Rang buoc
  Chi tiet : Member moi CHI CO THE dang ky tai khoan qua luong Mua Membership
             (Checkout Modal) tren Landing Page. He thong khong ho tro tao tai
             khoan rieng le ma khong co goi tap. Trang /auth/register
             chi danh cho Vendor va Gym Owner.
  Ap dung  : He thong Dang ky, Landing Page

BR-41: QUY TAC GOI TAP (MEMBERSHIP)
  Loai     : Rang buoc
  Chi tiet : He thong chi co 1 hang thanh vien duy nhat voi 2 chu ky thanh toan:
             - Goi Thang: 499,000 VND/thang
             - Goi Nam: 4,990,000 VND/nam (bang 10 thang, tiet kiem 2 thang)
             Tat ca cac uu dai (Vao gym 24/7, AI FitBot, PT, etc.) deu giong nhau.
             Phuong thuc thanh toan: MoMo, VNPay, ZaloPay, Tien mat.
  Ap dung  : Checkout Modal, He thong thanh toan


---

> HET TAI LIEU PHAN TICH THIET KE HE THONG
> Cap nhat lan cuoi: 13/06/2026
> Moi thay doi can duoc cap nhat va ghi log tai day.
>
> LICH SU CAP NHAT:
> - 13/06/2026: Cap nhat toan bo tai lieu theo trang thai code hien tai.
>   + Sua muc tieu he thong: them Checkout Modal, Admin Panel, don gian hoa Membership.
>   + Cap nhat Actor: them Payment GW, sua quyen Gear Seller (Member chi thue).
>   + Cap nhat Sitemap: khop voi routes thuc te trong App.jsx.
>   + Them FR-36, FR-37, FR-38 (AI FitBot, Admin quan ly user/bao cao).
>   + Them BR-40 (Dang ky Member qua Checkout Modal), BR-41 (Goi tap 1 tier, 2 chu ky).
>   + Cap nhat Gym Owner mo ta: tach Admin Panel (/admin/*) va Gym Owner Dashboard.

