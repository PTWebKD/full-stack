# FITFUEL+ — TAI LIEU PHAN TICH THIET KE HE THONG
# (System Analysis & Design Document)

> Do an mon: Web Kinh Doanh
> Cap nhat: 10/05/2026

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

---

## 2. PHAM VI HE THONG

### 2.1 Trong pham vi (In Scope)

- Quan ly tai khoan (dang ky, dang nhap, guest OTP, profile)
- Gym tracking (session, exercise log, PR, progress chart)
- Food order (browse, filter, cart, checkout, re-order, meal prep)
- Gear Hub (listing, lifecycle, thue, mua, ban, QR code)
- AI Food Suggestion (rule-based, khong dung ML)
- TDEE Calculator va Macro Dashboard
- Gamification (XP, level, badge, streak, challenge, ranking)
- FitCoin credit system
- Social Feed co ban (milestone post, follow)
- Notification system
- Food Vendor Portal
- Gym Owner Dashboard
- Gym Owner Panel

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

### 3.1 Yeu cau chuc nang (Functional Requirements)

ID     | Mo ta                                                    | Do uu tien
-------|----------------------------------------------------------|----------
FR-01  | Member dang ky tai khoan thong qua Modal mua Membership  | Cao
FR-02  | He thong cho phep dang nhap bang email/password hoac OTP | Cao
FR-03  | Guest co the checkout khong can tao tai khoan (dung OTP) | Cao
FR-04  | User tao workout session va log exercise (set x reps x weight) | Cao
FR-05  | He thong tinh Personal Record (PR) cho tung bai tap     | Cao
FR-06  | He thong hien thi bieu do tien do (progress chart)      | Trung binh
FR-07  | He thong goi y nhom co nen tap dua tren tan suat        | Trung binh
FR-08  | User xem danh sach food va loc theo calo/macro/muc tieu | Cao
FR-09  | User them san pham vao gio hang tu trang chu (khong can vao detail) | Cao
FR-10  | User thay doi thuoc tinh san pham (size, qty) ngay trong gio hang | Cao
FR-11  | User dat hang va chon thoi gian giao                    | Cao
FR-12  | User dat lai don hang cu (Quick Re-order)                | Trung binh
FR-13  | He thong goi y food dua tren nhom co vua tap (rule-based) | Cao
FR-14  | He thong tinh TDEE va hien thi macro dashboard hang ngay | Trung binh
FR-15  | User danh gia san pham kem anh that                     | Thap
FR-16  | User dang ky goi Meal Prep tuan/thang                   | Thap
FR-17  | User xem danh sach gear cho thue/mua                    | Cao
FR-18  | Moi gear co Gear ID duy nhat va Gear Lifecycle          | Cao
FR-19  | User dat thue gear (chon thoi han, dat coc online)      | Cao
FR-20  | User mua gear (bang tien hoac FitCoin)                  | Cao
FR-21  | User dang ban/cho thue gear cua minh                    | Trung binh
FR-22  | He thong gen QR code cho moi Gear ID                    | Trung binh
FR-23  | He thong tinh XP va tu dong nang level                  | Trung binh
FR-24  | He thong unlock badge khi dat milestone                 | Trung binh
FR-25  | He thong theo doi streak (so ngay lien tiep)            | Trung binh
FR-26  | He thong tao va quan ly Weekly Challenge                | Thap
FR-27  | He thong hien thi Ranking Board                         | Trung binh
FR-28  | User post milestone len Social Feed                     | Thap
FR-29  | User follow nguoi khac                                  | Thap
FR-30  | He thong quan ly FitCoin (earn, spend, nap them)        | Cao
FR-31  | Food Vendor dang san pham va nhan don hang              | Cao
FR-32  | Gym Owner xem dashboard va gui thong bao                | Trung binh
FR-33  | Gym Owner duyet vendor, xu ly tranh chap                    | Trung binh
FR-34  | He thong gui notification (streak, order, khuyen mai)   | Trung binh
FR-35  | Fitness Passport hien thi tong hop stats ca nhan        | Cao

### 3.2 Yeu cau phi chuc nang (Non-functional Requirements)

ID     | Loai           | Mo ta
-------|----------------|--------------------------------------------------
NF-01  | Hieu nang      | Trang load duoi 2 giay, API response duoi 500ms
NF-02  | Tuong thich    | Hoat dong tren Chrome, Firefox, Safari, Edge
NF-03  | Responsive     | Hien thi dung tren mobile (375px+), tablet, desktop
NF-04  | Bao mat        | Password hash bang bcrypt, HTTPS, JWT token
NF-05  | Bao mat        | Input validation, chong SQL injection, XSS, CSRF
NF-06  | Du lieu        | Backup database hang ngay
NF-07  | UX             | Toi thieu so buoc de checkout (toi da 3 buoc)
NF-08  | Accessibility  | Font size toi thieu 14px, contrast ratio >= 4.5:1
NF-09  | Privacy        | User co quyen an Passport, an body photo, xoa tai khoan
NF-10  | Scalability    | Database indexing cho cac query nang (ranking, analytics)

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
Đối với Gym Owner, hệ thống cho phép lựa chọn cả hai hình thức “Bán” hoặc “Cho thuê” thiết bị. Trong khi đó, Member cá nhân chỉ được phép tham gia dưới hình thức “Cho thuê” nhằm phục vụ mô hình chia sẻ thiết bị Peer-to-Peer.
Người đăng cung cấp các thông tin cơ bản gồm tên thiết bị, danh mục, giá bán hoặc phí thuê, tình trạng thiết bị và hình ảnh thực tế. Sau khi xác nhận, hệ thống tiến hành định danh thiết bị, khởi tạo hồ sơ vòng đời Gear và niêm yết thiết bị trên Gear Marketplace.
Người mua hoặc người thuê có thể truy cập trang chi tiết để xem thông tin thiết bị, lịch sử sử dụng và trạng thái vòng đời trước khi tiến hành giao dịch.
Nếu giao dịch thuộc hình thức mua bán, hệ thống thực hiện quy trình thanh toán và chuyển quyền sở hữu thiết bị sang người mua mới. Đồng thời, hệ thống cập nhật trạng thái vòng đời thiết bị nhằm ghi nhận giao dịch đã hoàn tất.
Nếu giao dịch thuộc hình thức cho thuê, hệ thống giữ tiền đặt cọc và ghi nhận thời gian thuê tương ứng. Sau khi thiết bị được hoàn trả thành công và không phát sinh tranh chấp, hệ thống tiến hành hoàn cọc và cập nhật trạng thái vòng đời mới cho thiết bị.

**2. Quy tắc nghiệp vụ (Business Rules)**
- **BR-11B:** Gym Owner được phép thực hiện cả hai hình thức Bán và Cho thuê thiết bị, trong khi Member cá nhân chỉ được phép tham gia hình thức Cho thuê.
- **BR-37:** Mọi thay đổi trạng thái của thiết bị đều phải tạo bản ghi vòng đời mới. Hệ thống không cho phép chỉnh sửa hoặc xóa lịch sử nhằm đảm bảo tính minh bạch và khả năng truy vết.
- **BR-11:** Thiết bị đăng tải bắt buộc phải có tối thiểu 2 hình ảnh thực tế để đảm bảo độ tin cậy của thông tin sản phẩm.
- **BR-12:** Mỗi thiết bị được gắn với một mã định danh duy nhất xuyên suốt toàn bộ vòng đời sử dụng, kể cả khi thay đổi chủ sở hữu.
- **BR-13:** Thiết bị cho thuê bắt buộc phải có tiền đặt cọc nhằm hạn chế rủi ro thất thoát hoặc hư hỏng trong quá trình sử dụng.
- **BR-16 & BR-17:** Hệ thống thu phí dịch vụ trên mỗi giao dịch mua bán hoặc cho thuê theo chính sách vận hành của nền tảng.

**3. Tình huống ngoại lệ (Exception Handling)**
- Trong trường hợp phát sinh tranh chấp về tình trạng thiết bị sau khi nhận hàng, người thuê có quyền gửi khiếu nại kèm hình ảnh xác thực trong khoảng thời gian quy định. Admin hệ thống sẽ tham gia kiểm tra và đưa ra quyết định xử lý phù hợp.
- Nếu người thuê trả thiết bị quá thời hạn cho phép, hệ thống tự động áp dụng cơ chế phạt dựa trên chính sách vận hành. Tùy theo mức độ vi phạm, hệ thống có thể trừ tiền cọc, hạn chế quyền thuê hoặc khóa tính năng giao dịch của tài khoản vi phạm.

#### 3.3.4 — Quy trình thanh toán và đối soát đa kênh (Quy trình Payment Gateway và FitCoin Economy)
**1. Mô tả quy trình chi tiết**
Quy trình thanh toán được kích hoạt khi người dùng thực hiện các giao dịch phát sinh chi phí trên nền tảng như đặt suất ăn dinh dưỡng, giao dịch Gear hoặc đăng ký/gia hạn gói Membership.
Tại bước Checkout Membership, khách hàng (nếu chưa có tài khoản) sẽ điền trực tiếp thông tin tạo tài khoản (Tên, Email, Mật khẩu) vào Modal và chọn phương thức thanh toán. Sau khi thanh toán hoàn tất, tài khoản được tự động tạo và kích hoạt thẻ hội viên. Trang /auth/register chỉ còn dùng cho Vendor/Gym Owner.
Tại bước Checkout, khách hàng lựa chọn phương thức thanh toán phù hợp bao gồm thanh toán qua cổng Payment Gateway hoặc sử dụng FitCoin. Hệ thống cho phép áp dụng hình thức thanh toán kết hợp giữa FitCoin và tiền thật nhằm tăng tính linh hoạt cho người dùng.
Đối với giao dịch qua Payment Gateway, hệ thống chuyển người dùng đến cổng thanh toán tương ứng để xác nhận giao dịch. Sau khi thanh toán hoàn tất, hệ thống nhận kết quả phản hồi và cập nhật trạng thái giao dịch trên nền tảng.
Đối với thanh toán bằng FitCoin, hệ thống kiểm tra số dư ví trước khi thực hiện khấu trừ. Sau khi giao dịch thành công, hệ thống ghi nhận lịch sử biến động FitCoin và cập nhật trạng thái đơn hàng tương ứng.
Trong quá trình sử dụng hệ thống, người dùng có thể nhận thêm FitCoin thông qua các hoạt động như duy trì Streak, hoàn thành Challenge, giới thiệu bạn bè hoặc nhận Cashback từ giao dịch.
Khi giao dịch hoàn tất, hệ thống cập nhật trạng thái thanh toán, ghi nhận lịch sử giao dịch tài chính và hoàn tất quy trình đối soát đơn hàng.

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
Quy trình bắt đầu khi Khách hàng (Guest) truy cập trang chủ FitFuel+, tiến hành tham khảo thông tin và cuộn xuống bảng giá (Pricing Section). Khách hàng lựa chọn một trong hai chu kỳ thanh toán: Gói Tháng hoặc Gói Năm, sau đó nhấn nút "Đăng ký ngay".
Hệ thống lập tức hiển thị một Checkout Modal trực tiếp (không chuyển trang) ngay trên màn hình. Tại bước 1 (Account), khách hàng điền các thông tin cơ bản: Họ và tên, Email, và Mật khẩu. Hệ thống tiến hành xác thực dữ liệu ngay tại client (kiểm tra định dạng email, độ mạnh mật khẩu tối thiểu 6 ký tự). Nếu hợp lệ, hệ thống sẽ lưu tạm thông tin và chuyển tiếp sang bước 2.
Tại bước 2 (Payment), khách hàng xác nhận lại tổng tiền và chọn phương thức thanh toán (VNPay / Momo Sandbox). Khi khách hàng nhấn "Thanh toán", hệ thống backend kiểm tra xem Email này đã tồn tại trong database chưa. 
- Nếu đã tồn tại: Hệ thống chặn lại và báo lỗi "Email đã được sử dụng".
- Nếu chưa: Hệ thống tạo tài khoản mới ở trạng thái `pending_payment` và khởi tạo một giao dịch thanh toán qua cổng VNPay/Momo, đồng thời điều hướng trình duyệt của khách hàng đến cổng thanh toán.

Tại cổng thanh toán, khách hàng dùng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và hoàn tất giao dịch. Cổng thanh toán sau đó sẽ gọi Webhook trả kết quả ngầm về cho hệ thống FitFuel+.
Sau khi hệ thống kiểm tra chữ ký Webhook hợp lệ và giao dịch thành công:
1. Đổi trạng thái tài khoản thành `Active`.
2. Tạo hồ sơ Fitness Passport trống (0 XP, Level 1) cho thành viên mới.
3. Cập nhật ngày hết hạn Membership (cộng thêm 1 tháng hoặc 1 năm tùy gói).
Hệ thống điều hướng trình duyệt của khách hàng tới trang "Thành công", hiển thị hiệu ứng chúc mừng và cấp nút "Vào Dashboard" để họ bắt đầu sử dụng dịch vụ.

**2. Quy tắc nghiệp vụ (Business Rules)**
* **BR-01:** Quy tắc xác thực tài khoản: Email phải đúng định dạng và chưa từng đăng ký. Mật khẩu tuân thủ yêu cầu độ dài.
* **BR-40:** Member mới chỉ được tạo qua luồng mua gói tập này (Checkout Modal). Trang `/auth/register` từ chối các đăng ký không phải của Vendor/Gym Owner.
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
2   | Member     | User da dang ky, co day du quyen su dung | Chinh
3   | Food Vendor| Quan an healthy dang ky ban tren nen tang | Chinh
4   | Gear Seller| Gym Owner (ban/thue) hoac Member (thue)  | Chinh
5   | Gym Owner  | Chu phong tap, quan tri vien he thong FitFuel+        | Chinh
6   | Timer      | Kich hoat tu dong: streak reset, subscription renew, challenge deadline | Phu

### 4.2 Mo ta chi tiet tung Actor

GUEST:
- Xem danh sach food va gear
- Them san pham vao gio hang
- Checkout bang SĐT + OTP (khong can tao tai khoan)
- Xem lai don hang cu bang SĐT
- KHONG co: Fitness Passport, gym tracking, gamification, social

MEMBER:
- Tat ca quyen cua Guest
- Tao va log workout session
- Xem progress chart, PR, streak
- Nhan goi y food tu AI
- Xem/cap nhat Fitness Passport
- Tham gia challenge, ranking
- Earn va spend FitCoin
- Post milestone, follow user khac
- Dang ban/cho thue gear cua minh

FOOD VENDOR:
- Dang ky tai khoan vendor
- Dang san pham (ten, gia, calo, macro, anh)
- Nhan va xu ly don hang (xac nhan, chuan bi, giao)
- Xem analytics (doanh thu, top mon, review)

GEAR SELLER:
- Dang ban hoac cho thue gear
- Nhap condition, anh, ghi chu
- He thong tu dong gen Gear ID
- Nhan FitCoin khi ban thanh cong
- Quan ly don thue (theo doi ngay tra)

GYM OWNER:
- Thiet lap membership plans
- Xem dashboard (doanh thu, retention)
- Quan ly member, gui thong bao
- Duyet tai khoan vendor va gym owner moi
- Xu ly tranh chap, khieu nai
- Quan ly he thong FitCoin (tong cung, ty gia)
- Xem bao cao tong the he thong
- Khoa/mo tai khoan user vi pham

---

## 5. USE CASE DIAGRAM

### 5.1 Use Case Diagram tong the

Ghi chu ky hieu:
- [Actor] la tac nhan
- (Use Case) la chuc nang
- <<include>> la quan he bat buoc
- <<extend>> la quan he mo rong (khong bat buoc)
- --- la duong ket noi

```
+=========================================================================+
|                         HE THONG FITFUEL+                               |
|                                                                         |
|  +-----------------------+   +------------------------+                 |
|  | QUAN LY TAI KHOAN     |   | GYM TRACKING           |                |
|  |-----------------------|   |------------------------|                |
|  | (UC01: Dang ky)       |   | (UC08: Tao session)    |                |
|  | (UC02: Dang nhap)     |   | (UC09: Log exercise)   |                |
|  | (UC03: Guest OTP)     |   | (UC10: Xem lich su)    |                |
|  | (UC05: Quan ly profile)|   | (UC11: Xem progress)   |                |
|  | (UC06: Fitness Passport)|  | (UC12: Xem PR)         |                |
|  +-----------------------+   | (UC13: Check-in QR)    |                |
|                              | (UC14: Goi y bai tap)  |                |
|                              +------------------------+                |
|                                                                         |
|  +-----------------------+   +------------------------+                 |
|  | FOOD ORDER            |   | GEAR HUB               |                |
|  |-----------------------|   |------------------------|                |
|  | (UC08: Xem food list) |   | (UC27: Xem gear list)  |                |
|  | (UC09: Add to cart)   |   | (UC28: Xem Lifecycle)  |                |
|  | (UC10: Checkout)      |   | (UC29: Dat thue gear)  |                |
|  | (UC12: Re-order)      |   | (UC30: Mua gear)       |                |
|  | (UC13: AI Suggestion) |   | (UC31: Dang ban gear)  |                |
|  | (UC14: TDEE Calc)     |   | (UC33: Scan QR Gear)   |                |
|  | (UC15: Review food)   |   +------------------------+                |
|  +-----------------------+                                              |
|                                                                         |
|  +-----------------------+   +------------------------+                 |
|  | GAMIFICATION          |   | PAYMENT & FITCOIN      |                |
|  |-----------------------|   |------------------------|                |
|  | (UC35: Xem XP/Level)  |   | (UC43: Thanh toan)     |                |
|  | (UC36: Xem Badge)     |   | (UC44: Gia han gym)    |                |
|  | (UC37: Challenge)     |   | (UC45: Nap FitCoin)    |                |
|  | (UC38: Ranking Board) |   | (UC46: Nhan FitCoin)   |                |
|  | (UC39: Post milestone)|   +------------------------+                |
|  | (UC40: Follow user)   |                                              |
|  +-----------------------+                                              |
|                                                                         |
|  +-----------------------+                                              |
|  | GYM OWNER             |                                              |
|  |-----------------------|                                              |
|  | (UC48: Vendor dang SP) |                                             |
|  | (UC49: Vendor xu ly DH)|                                             |
|  | (UC51: Gym quan ly)    |                                             |
|  | (UC54: Gym Owner duyet)    |                                         |
|  | (UC55: Gym Owner xu ly TC) |                                         |
|  +-----------------------+                                              |
+=========================================================================+

Actors ket noi:

[Guest]    --- (UC03), (UC08-Food), (UC09-Food), (UC10-Food)
[Member]   --- Tat ca Use Case
[Vendor]   --- (UC48), (UC49), (UC50)
[Seller]   --- (UC31), (UC33)
[Gym Owner]--- (UC51), (UC52), (UC53), (UC54), (UC55), (UC56)
```

### 5.2 Use Case Diagram — Module Food Order (chi tiet)

```
                        +--------------------------------------+
                        |        MODULE FOOD ORDER             |
                        |                                      |
                        |  (UC-F01: Xem danh sach food)        |
                        |       |                              |
                        |       |---<<include>>-->(Loc theo    |
                        |       |                  macro/calo) |
                        |       |                              |
[Guest]------           |  (UC-F02: Xem chi tiet food)         |
      |      \          |                                      |
      |       \---------|  (UC-F03: Them vao gio hang)         |
      |        \        |       |                              |
      |         \       |       |---<<extend>>-->(Them tu      |
      |          \      |       |                trang chu)    |
      |           \     |                                      |
      |            \----|  (UC-F04: Checkout)                  |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Chon phuong |
      |                 |       |                 thuc TT)     |
      |                 |       |                              |
[Member]-----           |       |---<<extend>>-->(Guest OTP)   |
      |      \          |       |                              |
      |       \         |       |---<<extend>>-->(Dung FitCoin)|
      |        \        |                                      |
      |         \-------|  (UC-F05: Thay doi trong gio hang)   |
      |          \      |                                      |
      |           \-----|  (UC-F06: Dat lai don cu)            |
      |            \    |                                      |
      |             \---|  (UC-F07: AI Food Suggestion)        |
      |              \  |       |                              |
      |               \ |       |---<<include>>-->(Lay du lieu |
      |                \|       |                 gym log)     |
      |                 |                                      |
      |                 |  (UC-F08: Tinh TDEE)                 |
      |                 |                                      |
      |                 |  (UC-F09: Xem Macro Dashboard)       |
      |                 |                                      |
      |                 |  (UC-F10: Review san pham)            |
      |                 |       |                              |
      |                 |       |---<<extend>>-->(Upload anh)  |
      |                 |                                      |
[Food Vendor]-----------|  (UC-F11: Dang san pham)             |
                        |                                      |
                        |  (UC-F12: Xu ly don hang)            |
                        |                                      |
                        |  (UC-F13: Xem analytics)             |
                        +--------------------------------------+
```

### 5.3 Use Case Diagram — Module Gym Tracking (chi tiet)

```
                        +--------------------------------------+
                        |        MODULE GYM TRACKING           |
                        |                                      |
[Member]---------       |  (UC-G01: Tao workout session)       |
      |          \      |       |                              |
      |           \     |       |---<<include>>-->(Chon nhom   |
      |            \    |       |                 co)          |
      |             \   |                                      |
      |              \--|  (UC-G02: Log exercise)              |
      |               \ |       |                              |
      |                \|       |---<<include>>-->(Nhap set    |
      |                 |       |        x reps x weight)      |
      |                 |                                      |
      |                 |  (UC-G03: Ket thuc session)          |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Tinh XP)    |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Cap nhat    |
      |                 |       |                 streak)      |
      |                 |       |                              |
      |                 |       |---<<extend>>-->(Hien thi     |
      |                 |       |         AI Food Suggestion)  |
      |                 |                                      |
      |                 |  (UC-G04: Xem lich su buoi tap)      |
      |                 |                                      |
      |                 |  (UC-G05: Xem progress chart)        |
      |                 |       |                              |
      |                 |       |---<<extend>>-->(So sanh      |
      |                 |       |         theo tuan/thang)     |
      |                 |                                      |
      |                 |  (UC-G06: Xem Personal Record)       |
      |                 |                                      |
      |                 |  (UC-G07: Check-in QR)               |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Scan QR     |
      |                 |       |         tai phong tap)       |
      |                 |                                      |
      |                 |  (UC-G08: Nhan goi y nhom co)        |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Phan tich   |
      |                 |                tan suat per muscle)  |
      |                 |                                      |
      |                 |  (UC-G09: Xem thong ke tong hop)     |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Tinh tong   |
      |                 |              volume, streak, so buoi)|
      |                 |                                      |
[Gym Owner]-------------|  (UC-G10: Xem check-in cua member)   |
                        |                                      |
                        |  (UC-G11: Quan ly membership)        |
                        +--------------------------------------+
```

### 5.4 Use Case Diagram — Module Gear Hub (chi tiet)

```
                        +--------------------------------------+
                        |        MODULE GEAR HUB               |
                        |                                      |
[Guest]---------        |  (UC-GH01: Xem danh sach gear)      |
      |         \       |       |                              |
      |          \      |       |---<<extend>>-->(Loc theo     |
      |           \     |       |         loai/gia/condition)  |
      |            \    |                                      |
      |             \---|  (UC-GH02: Xem chi tiet gear)       |
      |              \  |       |                              |
      |               \ |       |---<<include>>-->(Xem Gear   |
      |                \|       |         Lifecycle)           |
      |                 |                                      |
[Member]---------       |  (UC-GH03: Dat thue gear)           |
      |          \      |       |                              |
      |           \     |       |---<<include>>-->(Chon thoi  |
      |            \    |       |         han thue)            |
      |             \   |       |                              |
      |              \  |       |---<<include>>-->(Dat coc     |
      |               \ |       |         online)             |
      |                \|                                      |
      |                 |  (UC-GH04: Mua gear)                |
      |                 |       |                              |
      |                 |       |---<<extend>>-->(Dung FitCoin)|
      |                 |                                      |
      |                 |  (UC-GH05: Dang ban/cho thue gear)  |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Nhap        |
      |                 |       |   condition + anh + note)    |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Gen Gear ID |
      |                 |       |         + QR Code)           |
      |                 |                                      |
      |                 |  (UC-GH06: Scan QR Gear ID)         |
      |                 |                                      |
      |                 |  (UC-GH07: Tra gear khi het han)    |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Cap nhat    |
      |                 |       |         Gear Lifecycle)      |
      |                 |                                      |
      |                 |  (UC-GH08: Nhan goi y gear tu AI)   |
      |                 |       |                              |
      |                 |       |---<<include>>-->(Phan tich   |
      |                 |              gym log tim gear thieu) |
      |                 |                                      |
[Gym Owner]-------------|  (UC-GH09: Duyet listing moi)        |
                        |                                      |
                        |  (UC-GH10: Xu ly tranh chap gear)    |
                        +--------------------------------------+
```

---

## 6. USE CASE SPECIFICATIONS

### UC-F03: Them san pham vao gio hang

Muc                | Noi dung
--------------------|--------------------------------------------------
Use Case ID         | UC-F03
Ten Use Case        | Them san pham vao gio hang
Actor chinh         | Guest, Member
Dieu kien tien      | User dang o trang Food Listing hoac Food Detail
Dieu kien sau       | San pham duoc them vao gio hang, so luong cap nhat
Mo ta               | User them food vao gio hang de chuan bi checkout

Luong co ban (Basic Flow):
1. User xem danh sach food tren trang chu hoac trang listing.
2. User nhan nut [+] tren card san pham.
3. He thong kiem tra san pham con hang (is_available = true).
4. He thong them san pham vao gio hang voi so luong mac dinh = 1.
5. He thong hien thi thong bao "Da them vao gio hang".
6. Icon gio hang tren navbar cap nhat so luong.

Luong thay the (Alternative Flow):
- 3a. San pham het hang:
  + He thong hien thi thong bao "San pham tam het hang".
  + Nut [+] chuyen sang trang thai disabled.
  + Use case ket thuc.
- 4a. San pham da co trong gio hang:
  + He thong tang so luong them 1 (khong them moi).
  + He thong hien thi thong bao "Da cap nhat so luong".

Luong ngoai le (Exception Flow):
- E1. Loi server: Hien thi "Co loi xay ra, vui long thu lai".

Ghi chu:
- Day la tinh nang "Add to cart tu trang chu" theo yeu cau giang vien.
- User KHONG CAN navigate sang trang detail de them vao gio hang.
- Tren mobile, nut [+] phai du lon (toi thieu 44x44px) de de bam.

---

### UC-F04: Checkout

Muc                | Noi dung
--------------------|--------------------------------------------------
Use Case ID         | UC-F04
Ten Use Case        | Checkout don hang
Actor chinh         | Guest, Member
Dieu kien tien      | Gio hang co it nhat 1 san pham
Dieu kien sau       | Don hang duoc tao, thong bao gui den Vendor
Mo ta               | User hoan tat thanh toan de dat do an

Luong co ban (Basic Flow) — Member:
1. User nhan nut [Thanh toan] trong trang gio hang.
2. He thong hien thi trang checkout voi: danh sach san pham, tong tien.
3. User nhap hoac chon dia chi giao hang.
4. User chon thoi gian giao (khung gio).
5. User chon phuong thuc thanh toan (VNPay/Momo/FitCoin).
6. He thong hien thi tong thanh toan (bao gom phi giao hang).
7. User nhan [Xac nhan dat hang].
8. He thong xu ly thanh toan.
9. He thong tao don hang voi trang thai "pending".
10. He thong gui thong bao den Food Vendor.
11. He thong gui xac nhan don hang den User (notification + email).
12. He thong cong XP cho User (20 XP/don).
13. He thong xoa gio hang.
14. He thong chuyen den trang "Dat hang thanh cong".

Luong thay the — Guest Checkout:
- 1a. He thong phat hien user chua dang nhap.
  + He thong hien thi form nhap So dien thoai.
  + User nhap SDT.
  + He thong gui ma OTP qua SMS.
  + User nhap OTP.
  + He thong xac thuc OTP.
  + Neu dung: tiep tuc tu buoc 2.
  + Neu sai: hien thi "Ma OTP khong dung, vui long thu lai" (toi da 3 lan).
  + Don hang tao voi truong guest_phone, khong co user_id.

Luong thay the — Thanh toan bang FitCoin:
- 5a. User chon thanh toan bang FitCoin.
  + He thong kiem tra so du FitCoin.
  + Neu du: tru FitCoin, khong can chuyen den cong thanh toan.
  + Neu khong du: cho phep ket hop FitCoin + tien mat.
  + Ghi nhan giao dich FitCoin vao FITCOIN_TRANSACTIONS.

Luong ngoai le:
- E1. Thanh toan that bai: Quay lai buoc 5, hien thi loi.
- E2. Vendor khong online: Don van tao, Vendor nhan thong bao khi online.

---

### UC-G02: Log exercise

Muc                | Noi dung
--------------------|--------------------------------------------------
Use Case ID         | UC-G02
Ten Use Case        | Log exercise trong buoi tap
Actor chinh         | Member
Dieu kien tien      | User da tao workout session (UC-G01)
Dieu kien sau       | Exercise log duoc luu, PR duoc kiem tra va cap nhat
Mo ta               | User ghi lai cac bai tap da thuc hien trong buoi tap

Luong co ban:
1. Trong trang session dang hoat dong, user nhan [Them bai tap].
2. He thong hien thi danh sach exercise pho bien (nhom theo muscle_group).
3. User chon exercise (vd: Bench Press).
4. He thong hien thi form nhap sets.
5. User nhap Set 1: reps = 10, weight = 60kg.
6. User nhan [Them set] de nhap tiep.
7. User nhap Set 2: reps = 8, weight = 70kg.
8. (Lap lai buoc 6-7 cho cac set con lai)
9. User nhan [Luu bai tap].
10. He thong luu exercise log vao database.
11. He thong kiem tra: weight x reps co lon hon PR hien tai khong?
12. Neu la PR moi: he thong danh dau is_pr = true, hien thi "PR moi!".
13. He thong cap nhat stats trong Fitness Passport.

Luong thay the:
- 3a. Exercise khong co trong danh sach:
  + User nhan [Tao bai tap moi].
  + User nhap ten + chon muscle_group.
  + He thong luu exercise moi.
  + Tiep tuc tu buoc 4.
- 9a. User muon xoa 1 set:
  + User nhan nut [X] ben canh set can xoa.
  + He thong xoa set khoi danh sach.

---

### UC-GH05: Dang ban/cho thue gear

Muc                | Noi dung
--------------------|--------------------------------------------------
Use Case ID         | UC-GH05
Ten Use Case        | Dang ban hoac cho thue thiet bi gym
Actor chinh         | Gym Owner (ban/thue) hoac Member (chi thue)
Dieu kien tien      | User da dang nhap
Dieu kien sau       | Gear duoc tao voi Gear ID duy nhat, xuat hien tren listing
Mo ta               | User dang thiet bi gym cua minh len Gear Hub

Luong co ban:
1. User nhan [Dang ban thiet bi] tren trang Gear Hub.
2. He thong hien thi form dang ban.
3. User nhap thong tin:
   - Ten thiet bi
   - Danh muc (day khang luc, ta tay, dai lung, gang tay, tham, khac)
   - Hinh thuc: Ban / Cho thue / Ca hai
   - Gia ban (neu ban)
   - Gia thue/ngay va gia thue/tuan (neu cho thue)
   - Tien coc (neu cho thue)
   - Danh gia tinh trang (1-5 sao)
   - Ghi chu ve tinh trang
   - Upload anh (toi thieu 2 anh, toi da 8 anh)
4. User nhan [Dang ban].
5. He thong validate du lieu (gia > 0, co it nhat 2 anh).
6. He thong gen Gear ID duy nhat: GEAR-{4 ky tu random}-{4 so timestamp}.
7. He thong gen QR Code tu Gear ID.
8. He thong tao ban ghi trong GEAR_ITEMS.
9. He thong tao entry dau tien trong GEAR_LIFECYCLE:
   action = "listed", owner_id = user, condition = rating, notes, photos.
10. He thong hien thi thong bao "Dang ban thanh cong! Ma thiet bi: GEAR-XXXX-XXXX".
11. Gear xuat hien tren trang listing.

Luong ngoai le:
- E1. Anh qua lon (>5MB): He thong yeu cau chon anh nho hon.
- E2. User chua xac thuc tai khoan: He thong yeu cau xac thuc truoc.

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
USERS ||--o{ FOOD_REVIEWS          |    (sell/rent/both)   |
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
role             | ENUM               | NN, DEFAULT member | guest/member/vendor/gym-owner
display_name     | VARCHAR(100)       | NN                 | Ten hien thi
avatar_url       | VARCHAR(500)       |                    | URL anh dai dien
fitness_goal     | ENUM               |                    | bulk/cut/maintain
xp_total         | INT                | DEFAULT 0          | Tong XP tich luy
current_level    | INT                | DEFAULT 1          | Level hien tai
current_streak   | INT                | DEFAULT 0          | So ngay streak lien tiep
fitcoin_balance  | DECIMAL(10,2)      | DEFAULT 0          | So du FitCoin
tdee             | INT                |                    | TDEE da tinh (kcal)
referred_by      | INT                | FK->USERS          | User da gioi thieu
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
category         | ENUM               | NN                 | Danh muc thiet bi
name             | VARCHAR(200)       | NN                 | Ten thiet bi
description      | TEXT               |                    | Mo ta
condition_rating | INT                | NN, CHECK 1-5      | Danh gia tinh trang (1-5)
condition_notes  | TEXT               |                    | Ghi chu tinh trang
images           | TEXT (JSON)        | NN                 | Danh sach URL anh (min 2)
listing_type     | ENUM               | NN                 | sell/rent/both
sell_price       | DECIMAL(12,2)      |                    | Gia ban (nullable neu chi cho thue)
rent_price_day   | DECIMAL(10,2)      |                    | Gia thue/ngay
rent_price_week  | DECIMAL(10,2)      |                    | Gia thue/tuan
deposit_amount   | DECIMAL(12,2)      |                    | Tien coc (cho thue)
is_available     | BOOLEAN            | DEFAULT true       | Con kha dung hay khong
created_at       | DATETIME           | DEFAULT NOW()      | Ngay dang

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
                    Gear listing
            [Gear Seller] ------------------> (          )
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

  Role: guest, member, vendor, gym_owner
  FitnessGoal: bulk, cut, maintain
  MuscleGroup: chest, back, legs, shoulders, arms, core
  OrderStatus: pending, confirmed, preparing, delivering, delivered, cancelled
  GearCategory: resistance_band, dumbbell, belt, gloves, mat, machine_mini, other
  GearAction: listed, sold, rented, returned, relisted
  ListType: sell, rent, both
  ChallengeType: weekly, monthly, special
```

---

## 13. SITEMAP

```
FitFuel+
|
+-- / (Landing Page)
|
+-- /auth
|   +-- /login
|   +-- /register
|   +-- /forgot-password
|
+-- /dashboard (Member Dashboard)
|   +-- Tong quan: streak, XP, level, macro hom nay
|   +-- AI Food Suggestion widget
|   +-- Buoi tap gan nhat
|   +-- Thong bao moi nhat
|
+-- /gym
|   +-- /gym/new-session (Tao buoi tap moi)
|   +-- /gym/session/:id (Chi tiet buoi tap)
|   +-- /gym/history (Lich su buoi tap)
|   +-- /gym/progress (Bieu do tien do)
|   +-- /gym/records (Personal Records)
|
+-- /food
|   +-- /food (Danh sach food - listing)
|   +-- /food/:id (Chi tiet food)
|   +-- /food/meal-prep (Goi Meal Prep)
|
+-- /cart (Gio hang)
|
+-- /checkout (Thanh toan)
|
+-- /orders
|   +-- /orders (Lich su don hang)
|   +-- /orders/:id (Chi tiet don hang)
|
+-- /gear
|   +-- /gear (Danh sach gear)
|   +-- /gear/:id (Chi tiet gear + Lifecycle)
|   +-- /gear/sell (Dang ban/cho thue gear)
|   +-- /gear/my-listings (Gear cua toi)
|
+-- /passport (Fitness Passport)
|   +-- Stats tong hop
|   +-- Body Transformation Timeline
|   +-- Badge collection
|
+-- /nutrition
|   +-- /nutrition/tdee (TDEE Calculator)
|   +-- /nutrition/dashboard (Macro Dashboard)
|
+-- /community
|   +-- /community/feed (Social Feed)
|   +-- /community/ranking (Ranking Board)
|   +-- /community/challenges (Weekly Challenges)
|
+-- /profile
|   +-- /profile (Thong tin ca nhan)
|   +-- /profile/:id (Xem profile nguoi khac)
|   +-- /profile/settings (Cai dat)
|   +-- /profile/fitcoin (Lich su FitCoin)
|   +-- /profile/notifications (Thong bao)
|
+-- /vendor (Food Vendor Portal)
|   +-- /vendor/products (Quan ly san pham)
|   +-- /vendor/orders (Quan ly don hang)
|
+-- /gym-owner (Gym Owner Dashboard & Panel)
|   +-- /gym-owner/members (Danh sach member)
|   +-- /gym-owner/notifications (Gui thong bao)
|   +-- /gym-owner/analytics (Thong ke)
|   +-- /gym-owner/users (Quan ly user)
|   +-- /gym-owner/vendors (Duyet vendor)
|   +-- /gym-owner/disputes (Xu ly tranh chap)
|   +-- /gym-owner/fitcoin (Quan ly FitCoin)
|   +-- /gym-owner/reports (Bao cao he thong)
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
  Ap dung  : UC-01 (Dang ky), Profile Settings (Doi mat khau)
  Vi du    : "MyPass123" = hop le. "mypass123" = khong (thieu chu hoa).

BR-02: QUY TAC OTP
  Loai     : Rang buoc
  Chi tiet : OTP co 6 chu so, sinh ngau nhien.
             OTP co hieu luc trong 5 phut ke tu khi gui.
             User duoc nhap toi da 3 lan. Sau 3 lan sai, khoa 15 phut.
             Moi OTP chi duoc dung 1 lan (da dung thi vo hieu hoa).
  Ap dung  : UC-03 (Guest OTP), UC-01 (Dang ky bang SDT)

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
  Ap dung  : UC-21 (Checkout)

BR-06: PHI GIAO HANG
  Loai     : Tinh toan
  Chi tiet : Khoang cach duoi 5km: phi giao hang = 15,000 VND.
             Khoang cach 5km den 10km: phi giao hang = 25,000 VND.
             Khoang cach tren 10km: khong ho tro giao hang.
  Ap dung  : UC-21 (Checkout)
  Ghi chu  : Trong MVP, khoang cach tinh bang tuyen tinh (khong dung
             Google Maps API). Co the dung gia tri co dinh cho demo.

BR-07: THOI HAN XAC NHAN DON
  Loai     : Hanh dong
  Chi tiet : Food Vendor phai xac nhan don trong 15 phut ke tu khi
             nhan duoc. Neu qua 15 phut khong xac nhan, he thong
             tu dong huy don va hoan tien cho user.
  Ap dung  : UC-49 (Vendor xu ly don)

BR-08: QUY TAC HUY DON
  Loai     : Rang buoc
  Chi tiet : User chi co the huy don khi trang thai la:
             - "pending" (chua xac nhan): huy ngay, hoan tien 100%.
             - "confirmed" (da xac nhan): huy duoc, hoan tien 100%.
             Khong duoc huy khi trang thai la:
             - "preparing", "delivering", "delivered".
  Ap dung  : UC-21 (Checkout), Orders page

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
  Ap dung  : UC-23 (Dat lai don cu)

========================================================================

### 14.3 QUY TAC GEAR HUB

BR-11: SO LUONG ANH GEAR
  Loai     : Rang buoc
  Chi tiet : Moi gear phai co toi thieu 2 anh thuc te.
             Toi da 8 anh. Moi anh toi da 5MB.
             Anh dau tien la anh dai dien (thumbnail).
  Ap dung  : UC-33 (Dang ban gear)

BR-11B: QUYEN DANG BAN VA CHO THUE GEAR
  Loai     : Rang buoc
  Chi tiet : Do day la web kinh doanh B2C/C2C:
             - Gym Owner: Duoc quyen dang thiet bi de BAN hoac CHO THUE.
             - Member: CHI duoc quyen dang thiet bi de CHO THUE (khong the ban cho user khac).
  Ap dung  : UC-33 (Dang ban/cho thue gear)

BR-12: GEAR ID KHONG DOI
  Loai     : Rang buoc
  Chi tiet : Gear ID duoc he thong gen tu dong theo format:
             GEAR-{4 ky tu ngau nhien}-{4 so cuoi timestamp}
             Vi du: GEAR-K7X2-3841
             Sau khi tao, Gear ID KHONG THE thay doi hoac xoa.
             Gear ID theo thiet bi suot vong doi, bat ke doi tay bao nhieu lan.
  Ap dung  : UC-33 (Dang ban gear), UC-34 (Gen Gear ID)

BR-13: TIEN COC CHO THUE
  Loai     : Rang buoc
  Chi tiet : Tien coc cho thue >= 50% gia tri thiet bi (sell_price).
             Neu thiet bi chi cho thue (khong co sell_price):
             coc >= 50% * (rent_price_day * 30).
             Tien coc duoc hoan tra khi tra gear dung han va dung tinh trang.
  Ap dung  : UC-29 (Dat thue gear)

BR-14: THOI HAN TRA GEAR
  Loai     : Rang buoc
  Chi tiet : Nguoi thue phai tra gear trong vong 3 ngay sau khi het han thue.
             He thong gui nhac nho truoc 1 ngay het han.
             He thong gui nhac nho hang ngay khi qua han.
  Ap dung  : UC-36 (Tra gear het han)

BR-15: PHI PHAT TRA TRE
  Loai     : Tinh toan
  Chi tiet : Moi ngay tra tre, phi phat = 10% gia thue/ngay.
             Vi du: gia thue = 20,000 VND/ngay. Tra tre 3 ngay.
             Phi phat = 20,000 * 10% * 3 = 6,000 VND.
             Phi phat tu dong tru tu tien coc.
             Neu phi phat > tien coc: khong hoan coc va user bi danh dau.
  Ap dung  : UC-36 (Tra gear)

BR-16: HOA HONG BAN GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 7% tren gia ban gear.
             Vi du: Gear ban 500,000 VND.
             Hoa hong = 500,000 * 7% = 35,000 VND.
             Seller nhan = 465,000 VND (tien hoac FitCoin).
  Ap dung  : UC-31 (Mua gear)

BR-17: HOA HONG THUE GEAR
  Loai     : Tinh toan
  Chi tiet : FitFuel+ thu hoa hong 15% tren phi thue.
             Vi du: Thue 7 ngay, phi = 100,000 VND.
             Hoa hong = 100,000 * 15% = 15,000 VND.
             Seller nhan = 85,000 VND.
  Ap dung  : UC-29 (Dat thue gear)

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
  Ap dung  : Module Gamification (UC-38)

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
  Ap dung  : Module Gamification (UC-36 streak)

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
  Ap dung  : UC-21 (Checkout), UC-31 (Mua gear), UC-29 (Thue gear)

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
  Ap dung  : UC-24 (AI goi y food)

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
  Ap dung  : UC-24 (AI goi y food), SuggestionEngine

========================================================================

### 14.7 QUY TAC GYM TRACKING

BR-31: QUY TAC TINH PERSONAL RECORD (PR)
  Loai     : Tinh toan
  Chi tiet : Ky luc ca nhan duoc tinh doc lap cho tung bai tap.
             Cong thuc: PR = max(weight x reps) trong toan bo lich su.
             Mot buoi tap co the pha nhieu PR cung luc.
  Ap dung  : UC-09 (Tinh PR)

BR-32: GOI Y NHOM CO (SMART SUGGESTION)
  Loai     : Suy dien
  Chi tiet : He thong tu dong quet lich su 7 ngay gan nhat.
             Nhom co co tan suat tap thap nhat se duoc de xuat tap hom nay.
             Neu tan suat bang nhau, uu tien nhom co co thoi gian nghi lau nhat.
  Ap dung  : UC-07 (Tao buoi tap)

BR-33: KHOA DU LIEU GYM SESSION
  Loai     : Rang buoc
  Chi tiet : Du lieu buoi tap chi duoc phep chinh sua hoac xoa trong
             vong 24 gio ke tu khi ket thuc (status = Done).
             Sau 24 gio, ban ghi bi khoa vinh vien.
  Ap dung  : UC-08 (Log exercise)

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
  Ap dung  : UC-20 (Quan ly gio hang)

BR-36: MERGE TAI KHOAN GUEST
  Loai     : Hanh dong
  Chi tiet : Du lieu gio hang va don hang cua Guest duoc gan voi SDT.
             Khi Guest tao tai khoan Member bang dung SDT do, he thong
             tu dong dong bo (merge) toan bo lich su vao tai khoan moi.
  Ap dung  : UC-01 (Dang ky)

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
  Ap dung  : UC-42 (Thanh toan)

BR-39: TINH NGUYEN TU (IDEMPOTENCY) CUA GIAO DICH
  Loai     : Rang buoc
  Chi tiet : He thong chi xu ly cong tien/chuyen trang thai dung 1 lan
             duy nhat cho moi Transaction ID tu cong thanh toan de
             tranh loi nhan doi don do mang bi delay.
  Ap dung  : UC-42 (Thanh toan)


---

> HET TAI LIEU PHAN TICH THIET KE HE THONG
> Moi thay doi can duoc cap nhat va ghi log tai day.
