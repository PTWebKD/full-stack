# 15. DANH SÁCH CHỨC NĂNG, QUY TRÌNH CHI TIẾT & TRẠNG THÁI TRIỂN KHAI TRÊN WEB

> Dự án: FitFuel+
> Ngày kiểm tra: 03/07/2026
> Phương pháp: đọc trực tiếp `BE/app/modules/*/router.py` và toàn bộ `FE/src/pages/**/*.jsx` để xác định từng chức năng làm gì và làm theo quy trình nào, sau đó đối chiếu xem đã lên web thật hay chưa.

Chú thích trạng thái dùng xuyên suốt: **Đã làm** = có giao diện, gọi API thật, dữ liệu động; **chỉ có Backend** = xử lý đã viết xong ở server nhưng chưa có màn hình nào trên web dùng tới; **mock/tĩnh** = có giao diện đầy đủ nhưng đang hiển thị dữ liệu giả gán cứng trong code; **lỗi kết nối** = giao diện có gọi API nhưng gọi sai hoặc gọi tới API không tồn tại nên luôn báo lỗi khi chạy thật; **mồ côi** = trang đã viết xong nhưng không có đường dẫn nào trong ứng dụng dẫn tới được; **chưa làm** = không có cả xử lý lẫn giao diện thật.

Với các chức năng **chưa làm/chỉ có Backend/mock**, quy trình mô tả là quy trình **dự định theo thiết kế** (dựa trên schema, endpoint đã viết và tài liệu yêu cầu), không phải quy trình đang chạy thật.

---

## 1. Đăng ký, đăng nhập và xác thực OTP

**Đăng ký tài khoản Member** — tạo tài khoản mới để dùng toàn bộ dịch vụ của gym.
Quy trình: (1) Người dùng nhập số điện thoại, mật khẩu, tên hiển thị trên form đăng ký → (2) FE gọi `POST /api/auth/register` → (3) Backend kiểm tra số điện thoại chưa tồn tại, hash mật khẩu bằng bcrypt, tạo bản ghi `USERS` với `role='member'` → (4) Trả về token đăng nhập, FE lưu token và chuyển hướng vào dashboard.
Trạng thái: Đã làm — `AuthContext.jsx`.

**Đăng nhập** — xác thực người dùng đã có tài khoản.
Quy trình: (1) Nhập số điện thoại + mật khẩu → (2) FE gọi `POST /api/auth/login` → (3) Backend so khớp mật khẩu bcrypt, nếu đúng sinh JWT token → (4) FE lưu token vào bộ nhớ/localStorage, gọi tiếp `GET /api/users/me` để lấy hồ sơ, điều hướng theo `role` (member → dashboard hội viên, gym_owner → dashboard quản trị).
Trạng thái: Đã làm — `AuthContext.jsx`.

**Trang giao diện đăng ký riêng** (`RegisterPage.jsx`) — dự định là một form đăng ký đầy đủ tách biệt khỏi trang chủ.
Quy trình dự định: người dùng bấm "Đăng ký" ở trang chủ → điều hướng sang `/auth/register` → điền form nhiều bước (SĐT, mật khẩu, xác nhận mật khẩu) → gọi API đăng ký như trên.
Trạng thái: mồ côi — route `/auth/register` trong `App.jsx` bị redirect thẳng về mục giá trên trang chủ (`/#pricing-section`) thay vì mở form này, nên quy trình trên không bao giờ chạy được trên thực tế dù code đã viết xong.

**Xác thực OTP cho khách vãng lai** — cho phép người chưa có tài khoản xác minh số điện thoại tạm thời để mua hàng.
Quy trình dự định: (1) Khách nhập số điện thoại tại `GearOtpPage.jsx` → (2) Gọi API gửi mã (`POST /api/auth/guest/otp/request`), backend kiểm tra chưa quá 3 lần gửi/ngày (BR-47), sinh mã OTP 6 số TTL 10 phút, gửi qua SMS gateway, lưu vào `OTP_VERIFICATIONS` → (3) Khách nhập mã OTP nhận được → (4) Gọi API xác thực (`POST /api/auth/guest/otp/verify`), backend so khớp mã và thời hạn, cho thử tối đa 3 lần sai → (5) Nếu đúng, backend tạo `session_token` tạm (TTL 2 giờ), FE dùng token này để tiếp tục thao tác mua hàng mà không cần tài khoản đầy đủ.
Trạng thái: lỗi kết nối ở cả bước (2) và (4) — `GearOtpPage.jsx` gọi sai đường dẫn (`/api/guest/otp/send`, `/api/guest/otp/verify` — thiếu tiền tố `/auth`, sai tên hành động), nên quy trình luôn dừng lại ngay bước gửi mã.

## 2. Hồ sơ người dùng

**Xem thông tin bản thân** — lấy dữ liệu tài khoản để hiển thị khắp ứng dụng.
Quy trình: (1) Ngay sau khi có token đăng nhập, FE tự động gọi `GET /api/users/me` → (2) Backend trả về hồ sơ đầy đủ (tên, SĐT, vai trò, XP, streak, số dư FitCoin) → (3) FE lưu vào context toàn cục (`AuthContext`) để mọi trang con dùng lại mà không cần gọi lại API.
Trạng thái: Đã làm.

**Cập nhật hồ sơ cá nhân** — cho hội viên chỉnh sửa tên, ảnh đại diện, mục tiêu tập luyện.
Quy trình dự định: người dùng sửa thông tin trên `ProfilePage.jsx` → bấm Lưu → gọi `PUT /api/users/me` với dữ liệu mới → backend cập nhật bản ghi `USERS` → trả về hồ sơ mới để FE làm mới giao diện.
Trạng thái: chỉ có Backend — nút Lưu trên `ProfilePage.jsx` chưa gọi API này, nên quy trình dừng lại ở bước sửa trên giao diện, không có gì được lưu.

**Cập nhật danh sách dị ứng thực phẩm** — hội viên khai báo thành phần cần tránh để lọc gợi ý món ăn AI.
Quy trình dự định: chọn các dị ứng (gluten, hải sản...) trên form hồ sơ → gọi `PUT /api/users/me/allergens` → backend lưu mảng dị ứng vào `USERS` → các API gợi ý món ăn sau này lọc theo danh sách này.
Trạng thái: chỉ có Backend, chưa có giao diện khai báo.

**Xem Fitness Passport** — trang tổng hợp thành tích cá nhân (huy hiệu, tổng buổi tập, kỷ lục, ảnh before/after).
Quy trình dự định: mở `PassportPage.jsx` → gọi `GET /api/users/me/passport` → backend join dữ liệu từ `FITNESS_PASSPORT` (tổng buổi tập, volume, streak dài nhất, ảnh cơ thể) và danh sách badge đã đạt → FE render thành các thẻ thành tích.
Trạng thái: mock/tĩnh — trang hiện chỉ hiển thị huy hiệu suy ra trực tiếp từ dữ liệu user có sẵn trong context, chưa gọi API passport để lấy đủ dữ liệu tổng hợp.

**Xem hồ sơ người dùng khác và theo dõi (follow/unfollow)** — tính năng mạng xã hội.
Quy trình dự định: bấm vào tên một hội viên khác → gọi `GET /api/users/{id}` xem hồ sơ công khai → bấm nút Follow → gọi `POST /api/users/{id}/follow` (hoặc `DELETE` để bỏ theo dõi) → backend ghi/xoá bản ghi trong bảng `FOLLOWS` → feed hoạt động của người được follow sẽ xuất hiện trên Social feed của mình.
Trạng thái: chỉ có Backend, chưa có nút Follow nào trên giao diện.

## 3. Gym, gói tập và buổi tập luyện

**Xem gói tập hiện tại** — hiển thị gói (Tháng/Năm) đang dùng, ngày hết hạn.
Quy trình: (1) FE gọi `GET /api/gym/memberships/my` khi vào Dashboard/trang gói tập/trang chủ → (2) Backend truy `GYM_MEMBERSHIPS` theo `user_id`, trả bản ghi có `status='active'` mới nhất → (3) FE hiển thị tên gói, ngày hết hạn, và cảnh báo nếu còn dưới 7 ngày.
Trạng thái: Đã làm.

**Mua gói tập** — khách hàng chọn Gói Tháng/Năm và thanh toán để trở thành hội viên hoặc gia hạn.
Quy trình dự định (theo BPMN 3.3.4): chọn gói → nhập SĐT (nếu là khách mới) → gọi Call Activity Thanh toán (SP-01) → nếu thành công, backend tạo `USERS` (nếu chưa có), tạo `GYM_MEMBERSHIPS`, ghi `MEMBERSHIP_HISTORY`, gửi SMS mật khẩu tạm (đăng ký mới) hoặc cộng 50 FitCoin (gia hạn) → gọi `POST /api/gym/memberships`.
Trạng thái: chỉ có Backend — `MembershipPage.jsx` hiện chỉ hiển thị danh sách gói để tham khảo, nút "Mua" chưa nối vào API này, nên quy trình dừng ở bước xem, không thực hiện được việc mua/thanh toán qua giao diện.

**Tạo buổi tập, ghi nhận set, hoàn thành buổi tập** — luồng chính khi hội viên tập tại gym.
Quy trình: (1) Bấm "Tạo buổi tập mới" trên `NewSessionPage.jsx` → gọi `POST /api/gym/sessions`, backend tạo `WORKOUT_SESSIONS` trạng thái "Active" → (2) Chọn bài tập theo nhóm cơ, với mỗi set nhập reps + weight → gọi `POST /api/gym/sessions/{id}/exercises`, backend ghi vào `EXERCISE_LOGS`, so sánh với kỷ lục cũ để xác nhận Personal Record (PR = max(weight×reps)) và cộng XP thưởng nếu phá kỷ lục → (3) Bấm "Kết thúc buổi tập" → gọi `POST /api/gym/sessions/{id}/complete`, backend tính tổng XP của session, cập nhật streak (tăng nếu có hoạt động hợp lệ trong ngày, reset về 0 nếu nghỉ 2 ngày liên tiếp), kiểm tra mốc streak (7/30/100 ngày) để cấp badge + FitCoin, và kích hoạt gợi ý dinh dưỡng AI → (4) `SessionDetailPage.jsx`/`GymHistoryPage.jsx` gọi `GET /api/gym/sessions/{id}` và `GET /api/gym/sessions/my` để xem lại.
Trạng thái: Đã làm đầy đủ.

**Transformation Journey — sinh buổi tập bằng AI** — AI tự soạn buổi tập hoàn chỉnh.
Quy trình: (1) Hội viên chọn nhóm cơ muốn tập (Chân/Ngực/Lưng+Vai/Toàn thân/Tự chọn) trên `JourneySessionPage.jsx` → (2) Gọi `POST /api/gym/sessions/generate`, backend lọc thư viện bài tập (`GET /api/gym/exercise-templates`) theo mục tiêu, trình độ và lịch sử tập gần nhất, sinh danh sách bài tập + số set/reps + mức tạ đề xuất → (3) Hội viên xem trước, có thể thêm/bớt/sửa bài tập → (4) Bấm Bắt đầu, gọi `POST /api/gym/sessions/confirm` để chốt chương trình thành một `WORKOUT_SESSIONS` thật → (5) Tập và hoàn thành như luồng thường (`POST /api/gym/sessions/{id}/complete`), đồng thời kích hoạt song song 3 tiến trình: gợi ý tăng tạ (Progressive Overload), gợi ý dinh dưỡng, và kiểm tra milestone.
Trạng thái: Đã làm đầy đủ.

**Kỷ lục cá nhân (Personal Record)** — hiển thị mức tạ/reps cao nhất từng đạt cho mỗi bài tập.
Quy trình: FE gọi `GET /api/gym/records/my` → backend truy vấn giá trị lớn nhất của `weight × reps` theo từng `exercise_id` trong lịch sử `EXERCISE_LOGS` của user → trả danh sách kỷ lục để `GymRecordsPage.jsx` hiển thị dạng bảng/thẻ.
Trạng thái: Đã làm.

**Thông báo của Gym (Announcements)** — GymOwner đăng tin cho hội viên xem.
Quy trình: GymOwner nhập tiêu đề + nội dung trên `GymAnnouncementsPage.jsx` → gọi `POST /api/gym/announcements` → backend lưu vào `GYM_ANNOUNCEMENTS`, đánh dấu gym liên quan → hội viên vào Dashboard/trang chủ tự động gọi `GET /api/gym/announcements` để xem tin mới nhất → GymOwner có thể gọi `DELETE /api/gym/announcements/{id}` để gỡ tin cũ.
Trạng thái: Đã làm đầy đủ cả ba thao tác.

**Care Queue (hàng đợi chăm sóc hội viên)** — danh sách hội viên cần liên hệ, xếp theo độ ưu tiên.
Quy trình: (1) Mỗi ngày 06:00, cron nội bộ quét toàn bộ hội viên đang active, áp 6 luật (sắp hết hạn ≤7 ngày, không check-in ≥14 ngày, quá hạn 1-3/>3 ngày, tần suất cao + đang dùng Gói Tháng, mua nutrition ≥3 lần/tuần) để sinh `RECOMMENDATIONS` với mức ưu tiên HIGH/MEDIUM/LOW, không tạo trùng nếu đã có bản ghi pending trong 7 ngày → (2) Nhân viên vào `GymOwnerCareQueuePage.jsx`, gọi `GET /api/gym-owner/care-queue` xem danh sách xếp ưu tiên cao trước → (3) Liên hệ hội viên (gọi điện/nhắn tin) → (4) Ghi nhận kết quả (đã gia hạn/từ chối/không liên lạc được), gọi `PATCH /api/gym-owner/care-queue/{id}` để chuyển trạng thái sang "handled" và lưu `MEMBER_CARE_LOGS`.
Trạng thái: Đã làm đầy đủ phần (2)-(4); phần cron sinh recommendation tự động (1) chạy ở backend.

**Phân tích số liệu cho GymOwner (Analytics)** — biểu đồ doanh thu, số hội viên hoạt động, xu hướng tăng trưởng.
Quy trình dự định: GymOwner mở trang Analytics → hệ thống tổng hợp doanh thu theo ngày/tháng từ `INVOICES`, đếm hội viên active từ `GYM_MEMBERSHIPS`, tính xu hướng tăng trưởng theo thời gian → vẽ biểu đồ.
Trạng thái: mock/tĩnh, và backend hiện chưa có API thống kê nào phục vụ mục đích này — cần thiết kế và xây cả API lẫn giao diện từ đầu.

**Danh sách hội viên & chi tiết hội viên (phía GymOwner)** — xem toàn bộ hội viên đang quản lý.
Quy trình dự định: GymOwner mở danh sách → hệ thống trả danh sách `USERS` có `role='member'` kèm gói tập hiện tại → bấm vào 1 người để xem chi tiết (lịch sử tập, đơn hàng, gói đang dùng).
Trạng thái: mock/tĩnh — dùng `mockAllUsers`, chưa có API danh sách hội viên thật đứng sau.

**Check-in tại quầy** — quét QR khi hội viên đến gym để ghi nhận lượt tập.
Quy trình dự định: hội viên đưa mã QR cá nhân cho nhân viên quét (hoặc tự quét mã tại quầy) → hệ thống xác nhận `GYM_MEMBERSHIPS` còn hiệu lực → ghi vào bảng `CHECK_INS` → tính vào streak trong ngày.
Trạng thái: mock/tĩnh, chưa có API check-in QR thật.

**Biểu đồ tiến độ tập luyện & AI Engine cảnh báo Plateau/Overtraining/Undertraining (RE-3)** — đường tiến bộ mức tạ/khối lượng theo thời gian kèm chẩn đoán tự động.
Quy trình: chọn 1 bài tập (danh sách lấy từ `GET /api/gym/progress/exercises`, tổng hợp theo `EXERCISE_LOGS` thật của Member) → `GET /api/gym/progress?exercise_name=...` trả về lịch sử theo từng buổi (max weight, tổng volume, RPE trung bình, đánh dấu buổi lập PR) cùng chẩn đoán: **Plateau** (không có PR mới trong 28 ngày), **Overtraining** (≥9 buổi/14 ngày hoặc RPE trung bình >8.5), **Undertraining** (≤2 buổi/14 ngày), **Steady Progress**, hoặc **Insufficient data** (<3 buổi). Các nút hành động gợi ý (Áp dụng Overload, Nhận Deload, Gửi yêu cầu PT 1:1...) gọi `POST /api/gym/progress/action` và hiển thị xác nhận thật trên giao diện.
Trạng thái: **Đã làm** — `ExerciseProgressPage.jsx` gọi API thật, dữ liệu và chẩn đoán hoàn toàn động theo lịch sử tập của từng Member (không còn `extendedHistory` hardcode). Có test tích hợp tại `BE/tests/modules/gym/test_progress.py`.

Các chức năng phụ — xem danh sách gym công khai (`GET /api/gym/`), xem chi tiết 1 gym (`GET /api/gym/{id}`), nhận gợi ý buổi tập tự động (`GET /api/gym/sessions/suggest`), và tạo gym mới (`POST /api/gym/`) — đều đã có xử lý ở backend nhưng chưa có giao diện nào gọi tới.

## 4. Dinh dưỡng nội bộ

**Xem danh sách và chi tiết sản phẩm dinh dưỡng** — duyệt món ăn bán tại gym.
Quy trình: FE gọi `GET /api/food/products` (danh sách) hoặc `GET /api/food/products/{id}` (chi tiết) → backend trả thông tin món (giá, calo, đạm/carb/béo, thành phần, ảnh) → hiển thị trên `NutritionListPage.jsx`/`NutritionDetailPage.jsx`.
Trạng thái: Đã làm.

**Gợi ý dinh dưỡng cá nhân hóa theo toàn bộ lịch sử tập luyện** — panel "Gợi ý dành cho bạn" trên đầu trang `/nutrition`, khác với popup sau buổi tập (vốn chỉ phản ứng theo 1 session vừa xong).
Quy trình: Member vào trang `/nutrition` → FE gọi `GET /api/ai/food-recommendation/history` → backend tổng hợp toàn bộ `EXERCISE_LOGS` của Member để xác định nhóm cơ tập nhiều nhất (không chỉ buổi gần nhất) → áp dụng macro rule + Genetic Algorithm (RE-4) + lọc dị ứng → trả gợi ý kèm lý do. Guest hoặc Member chưa có lịch sử tập sẽ tự rơi về chế độ best-seller.
Trạng thái: Đã làm. Nhân tiện phát hiện và sửa 1 lỗi có sẵn trong `run_genetic_nutrition_optimizer` (cộng `Decimal` từ cột Numeric với `float` gây crash) — lỗi này ảnh hưởng cả popup gợi ý sau buổi tập, không riêng tính năng mới. Test tích hợp tại `BE/tests/modules/ai_coaching/test_nutrition_history.py`.

**Tạo, sửa, ẩn/hiện sản phẩm** — GymOwner quản lý danh mục món ăn.
Quy trình: GymOwner điền form sản phẩm trên `GymOwnerNutritionProductsPage.jsx` → gọi `POST /api/food/products` (tạo mới) hoặc `PUT /api/food/products/{id}` (sửa) → backend lưu vào `NUTRITION_PRODUCTS`; muốn tạm ẩn món hết nguyên liệu thì gọi `PATCH /api/food/products/{id}/availability` để đổi cờ `is_available`.
Trạng thái: Đã làm đầy đủ.

**Đặt hàng dinh dưỡng và xem đơn hàng của mình** — 2 luồng: mua tại quầy (POS) và đặt trước (pre-order) sau buổi tập.
Quy trình: (1) Luồng POS: nhân viên chọn sản phẩm + hội viên/khách trên POS → kiểm tra tồn kho `INVENTORY` → thanh toán qua SP-01 → tạo `NUTRITION_ORDERS`, cập nhật tồn kho, tạo `INVOICES` → (2) Luồng pre-order: hội viên hoàn thành buổi tập → hệ thống AI gợi ý 3 sản phẩm → chọn sản phẩm, thanh toán online (SP-01) → tạo đơn `status='pending'` → nhân viên chuẩn bị, đổi `status='ready'` → hội viên đến quầy nhận, nhân viên đổi `status='done'`, hệ thống tự trừ tồn kho → cả hai luồng đều xem lại qua `GET /api/food/orders`, `GET /api/food/orders/{id}`.
Trạng thái: Đã làm đầy đủ phần đặt hàng và xem đơn.

**Cập nhật trạng thái đơn hàng (phía nhân viên)** — chuyển trạng thái đơn qua các bước chuẩn bị/sẵn sàng/đã giao.
Quy trình dự định: nhân viên mở `GymOwnerNutritionOrdersPage.jsx` → chọn đơn → bấm cập nhật trạng thái → gọi `PUT /api/food/orders/{id}/status` → backend đổi trạng thái, nếu là `done` thì tự trừ tồn kho.
Trạng thái: chỉ có Backend — trang hiện chỉ hiển thị dữ liệu mock, nút cập nhật chưa thực sự gọi API dù công cụ gọi API đã import sẵn trong code.

**Đánh giá sản phẩm (review)** — chấm điểm và nhận xét sau khi dùng món ăn.
Quy trình dự định: sau khi đơn hàng ở trạng thái "done", hội viên bấm đánh giá → chọn số sao + viết nhận xét → gọi `POST /api/food/products/{id}/reviews` → backend lưu vào bảng review, cập nhật điểm trung bình sản phẩm; người khác xem qua `GET /api/food/products/{id}/reviews`.
Trạng thái: chỉ có Backend, chưa có giao diện đánh giá nào trên web.

**Đặt hàng của khách vãng lai** — người chưa có tài khoản đặt đồ ăn sau khi xác thực OTP.
Quy trình dự định: khách xác thực OTP (SP-02) → xem giỏ hàng → gọi API đặt hàng để tạo đơn gắn với số điện thoại khách → thanh toán online bắt buộc.
Trạng thái: lỗi kết nối — `GuestCheckoutPage.jsx` gọi `POST /api/orders/place`, đường dẫn này không tồn tại ở backend; đáng lẽ phải gọi `POST /api/food/orders` giống luồng đặt hàng thông thường, nên bước đặt hàng cuối cùng của khách vãng lai luôn thất bại.

## 5. Gear Marketplace (mua bán và cho thuê dụng cụ)

**Xem danh sách và chi tiết Gear** — duyệt dụng cụ đang rao bán/cho thuê.
Quy trình: FE gọi `GET /api/gear/` (danh sách, có thể lọc theo loại) hoặc `GET /api/gear/{id}` (chi tiết kèm lịch sử vòng đời) → hiển thị trên `GearListPage.jsx`/`GearDetailPage.jsx`.
Trạng thái: Đã làm.

**Thuê Gear và xem Gear mình đang thuê** — chỉ dành cho hội viên (BR-47/48: khách vãng lai bị khoá tính năng thuê).
Quy trình: (1) Chọn Gear có `is_for_rental=true` trên `GearRentPage.jsx` → chọn ngày bắt đầu + ngày trả (tối đa 7 ngày, tối đa 3 Gear cùng lúc theo BR-49) → hệ thống tính tiền cọc + phí thuê theo ngày → (2) Thanh toán qua Call Activity SP-01 → nếu thành công, backend ghi `GEAR_TRANSACTIONS.status='active'`, trừ `qty_available` → (3) `GearMyRentalsPage.jsx` gọi `GET /api/gear/my/rentals` để xem các món đang thuê và hạn trả; nếu quá hạn, cron hằng ngày tự chuyển trạng thái "Quá hạn" và cộng phí phạt 50.000đ/ngày, quá 14 ngày thì đánh dấu "Bị mất".
Trạng thái: Đã làm đầy đủ bước thuê và xem lại.

**Đăng bán/cho thuê Gear, sửa, xoá tin đăng** — GymOwner hoặc hội viên niêm yết dụng cụ lên chợ.
Quy trình dự định: điền thông tin Gear (tên, giá, loại niêm yết bán/thuê, ảnh) → gọi `POST /api/gear/` → backend sinh mã Gear, tạo bản ghi `GEAR_ITEMS` + khởi tạo `GEAR_LIFECYCLE` trạng thái "listed" → có thể sửa (`PUT /api/gear/{id}`) hoặc gỡ tin (`DELETE /api/gear/{id}`) sau đó.
Trạng thái: chỉ có Backend — `GymOwnerGearProductsPage.jsx` vẫn dùng dữ liệu mock thay vì các API này.

**Trả Gear đã thuê** — hội viên xác nhận trả lại dụng cụ.
Quy trình dự định: hội viên mang Gear tới quầy → nhân viên kiểm tra tình trạng vật lý (nguyên vẹn/hư nhẹ/hư nặng/mất) → gọi `POST /api/gear/{id}/return` với tình trạng đã chọn → backend tính số cọc hoàn lại tương ứng (100%/70%/0%), tạo `INVOICES` bồi thường nếu cần, đổi `status='returned'` (hoặc `'lost'` nếu mất — không cộng lại tồn kho) và cập nhật tồn kho.
Trạng thái: chỉ có Backend, chưa có nút "trả Gear" trên giao diện.

**Xem lịch sử vòng đời Gear** — theo dõi một món đã qua bao nhiêu lượt bán/thuê.
Quy trình dự định: gọi `GET /api/gear/{id}/lifecycle` → backend trả toàn bộ chuỗi sự kiện (listed → sold/rented → returned → relisted...) của Gear đó.
Trạng thái: chỉ có Backend, chưa có giao diện xem.

**Quản lý đơn thuê Gear (phía GymOwner)** — theo dõi ai đang thuê gì, xử lý trả trễ/hư hỏng.
Quy trình dự định: GymOwner mở danh sách đơn thuê đang active theo Gear mình sở hữu → xử lý các trường hợp quá hạn/hư hỏng.
Trạng thái: mock/tĩnh, và backend cũng chưa có API riêng để lọc đơn thuê theo từng GymOwner.

## 6. Gamification (thử thách và bảng xếp hạng)

**Thử thách (Challenges)** — mục tiêu ngắn hạn (VD: tập 4 buổi/tuần) để nhận thưởng khi hoàn thành.
Quy trình dự định: xem danh sách thử thách đang mở (`GET /api/gamification/challenges`) → tham gia (`POST /api/gamification/challenges/{id}/join`, tạo bản ghi `USER_CHALLENGES` trạng thái "in_progress") → hệ thống tự cập nhật tiến độ (`PUT .../progress`) mỗi khi có hoạt động liên quan → khi đạt tiêu chí, chuyển "completed" và cộng XP/FitCoin → xem thử thách của mình qua `GET /api/gamification/challenges/my`.
Trạng thái: chỉ có Backend — `WeeklyChallengePage.jsx` hoàn toàn tĩnh, không gọi API nào trong số này.

**Bảng xếp hạng (Leaderboard)** — so sánh XP/streak giữa các hội viên.
Quy trình dự định: gọi `GET /api/gamification/leaderboard` → backend sắp xếp `USERS` theo `xp_total` hoặc `current_streak` giảm dần, trả top N kèm thứ hạng của người dùng hiện tại.
Trạng thái: chỉ có Backend — `LeaderboardPage.jsx` dùng `mockLeaderboard`.

**Huy hiệu (Badge)** — phần thưởng hình ảnh khi đạt mốc thành tích.
Quy trình dự định (sau khi thiết kế lại `USER_BADGES`, xem mục ERD): hệ thống kiểm tra điều kiện đạt badge (streak, PR, hoàn thành thử thách...) → nếu đủ điều kiện và chưa từng nhận, tra `badge_id` tương ứng từ bảng `BADGES`, ghi vào `USER_BADGES` kèm `earned_at` → hội viên xem danh sách đã đạt/chưa đạt qua `GET /api/gamification/badges` kết hợp `GET /api/users/me/passport`.
Trạng thái: chỉ có Backend, và như đã phân tích ở phần ERD, phần code cấp badge thật (`gym/service.py`) hiện chưa tra đúng bảng `BADGES` mà dùng chuỗi hardcode riêng.

## 7. FitCoin (điểm thưởng nội bộ)

**Xem số dư và lịch sử giao dịch FitCoin** — theo dõi điểm thưởng đã kiếm/tiêu.
Quy trình: FE gọi `GET /api/fitcoin/balance` (số dư hiện tại) và `GET /api/fitcoin/history` (danh sách giao dịch từ `FITCOIN_TRANSACTIONS`, phân loại earn/spend theo nguồn: streak/challenge/referral/deposit/membership_bonus) → hiển thị trên `FitCoinPage.jsx`; số dư cũng hiển thị ở `GearRentPage.jsx`, `CheckoutPage.jsx` để áp dụng giảm giá khi thanh toán.
Trạng thái: Đã làm.

**Cộng FitCoin** — thưởng điểm khi hoàn thành buổi tập, đạt streak, gia hạn gói...
Quy trình: xảy ra ngầm trong các luồng khác (hoàn thành session, gia hạn membership...) — backend tự gọi hàm nội bộ tương đương `POST /api/fitcoin/earn` để cộng điểm và ghi giao dịch, không phải người dùng bấm trực tiếp.
Trạng thái: chỉ có Backend (dùng nội bộ).

**Dùng/đổi FitCoin (spend)** — quy đổi FitCoin thành giảm giá hoặc quà.
Quy trình dự định: tại bước thanh toán, nhập số FitCoin muốn dùng (tối đa 50% giá trị đơn theo BR-30) → gọi `POST /api/fitcoin/spend` → backend trừ tạm số dư, tính lại số tiền còn phải trả.
Trạng thái: chỉ có Backend — việc áp dụng giảm giá lúc thanh toán có xuất hiện trên giao diện checkout nhưng chưa xác nhận rõ có gọi đúng endpoint này hay xử lý tại chỗ; chưa có nút "đổi quà" độc lập ngoài luồng thanh toán.

**Giới thiệu bạn bè (Referral) — chia sẻ mã mời, Guest nhập mã và nhận thưởng** (UC-11).
Quy trình: mã giới thiệu được suy ra trực tiếp từ `user_id` (`FIT{user_id:05d}`, không cần cột riêng) qua `app/modules/users/referral_utils.py`. Member xem mã + link + số bạn đã mời + tổng FitCoin đã nhận qua `GET /api/users/me/referral`, hiển thị ở card "Mời bạn bè" đầu `SocialPage.jsx` (nút sao chép link) và trong thẻ chia sẻ thành tích sau buổi tập (`AiFoodSuggestion.jsx`). Khi Guest đăng ký (qua ô "Mã giới thiệu" ở bước tạo tài khoản trong `MembershipPage.jsx`, tự điền nếu bấm link có `?ref=`), `POST /api/auth/register` giải mã `referral_code` → nếu hợp lệ, set `users.referred_by` và cộng FitCoin thật cho cả hai bên (100 cho người giới thiệu, 50 cho người mới, qua `fitcoin.service.earn`, có ghi `FITCOIN_TRANSACTIONS` nguồn `referral`) → hiển thị banner "🎉 Nhận ngay X FitCoin" ngay ở bước thanh toán tiếp theo. Mã không hợp lệ vẫn cho đăng ký bình thường, chỉ không cộng thưởng.
Trạng thái: Đã làm (không chỉ mock — FitCoin cộng thật, có thể kiểm tra lại qua `GET /api/fitcoin/history`). Đơn giản hóa so với đặc tả UC-11 gốc: chỉ thưởng FitCoin, chưa cộng thêm "+1 tháng sử dụng gói tập". Test tích hợp tại `BE/tests/modules/users/test_referral.py`.

## 8. Social (mạng xã hội nội bộ)

**Feed cộng đồng, đăng bài, thích bài** — chia sẻ thành tích tập luyện, tương tác giữa hội viên.
Quy trình dự định: hoàn thành buổi tập/đạt PR → hệ thống tự tạo bài đăng gợi ý (hoặc hội viên tự đăng) chứa ảnh/số liệu → gọi `POST /api/social/posts` để lưu vào `SOCIAL_POSTS` → những người follow xem trên feed (`GET /api/social/feed`) → thả tim bài viết (`POST /api/social/posts/{id}/like`, cộng `likes_count`) → tác giả có thể xoá bài (`DELETE /api/social/posts/{id}`).
Trạng thái: chỉ có Backend, cả 5 API đều chưa được FE gọi — `SocialPage.jsx` chạy hoàn toàn bằng `mockSocial.js`, nút thích chỉ đổi state cục bộ trên trình duyệt.

## 9. Thông báo (Notifications)

**Xem, đánh dấu đã đọc thông báo** — cảnh báo nhắc gia hạn, xác nhận đơn hàng, cảnh báo tồn kho...
Quy trình: hệ thống tự tạo thông báo ở nhiều luồng khác (Care Queue, đơn hàng, tồn kho thấp...) và ghi vào bảng `NOTIFICATIONS` → `TopBar.jsx` gọi `GET /api/notifications/` định kỳ để hiển thị số chưa đọc trên biểu tượng chuông → bấm vào 1 thông báo gọi `PUT /api/notifications/{id}/read` để đánh dấu đã đọc, hoặc bấm "Đọc tất cả" gọi `PUT /api/notifications/read-all`.
Trạng thái: Đã làm đầy đủ — module hoàn thiện 100%.

## 10. AI Coaching

**Gợi ý dinh dưỡng sau buổi tập** — AI đề xuất món ăn phục hồi phù hợp.
Quy trình: sau khi hoàn thành buổi tập, `AiFoodSuggestion.jsx` gọi `POST /api/ai/food-recommendation` kèm nhóm cơ vừa tập → backend chọn 3 sản phẩm dựa trên 4 tín hiệu (nhóm cơ, mục tiêu cá nhân, cường độ tập, lịch sử mua hàng) → hiển thị popup gợi ý cho hội viên chọn đặt trước.
Trạng thái: Đã làm.

**Trang "Trợ lý AI"** — hướng dẫn dùng khung chat AI nổi.
Quy trình: trang tĩnh giới thiệu, dẫn người dùng tới `FloatingChatbot` ở nơi khác trong ứng dụng để trò chuyện thật — đây là chủ đích thiết kế, không phải phần dang dở.
Trạng thái: mock/tĩnh theo thiết kế.

## 11. Giao hàng (Delivery)

**Quản lý địa chỉ giao hàng** — thêm/sửa/xoá địa chỉ nhận hàng đã lưu.
Quy trình: hội viên điền địa chỉ trên `ShippingAddressesPage.jsx` → gọi `POST /api/delivery/addresses` để thêm mới, `GET /api/delivery/addresses` để xem danh sách, `PUT/DELETE /api/delivery/addresses/{id}` để sửa/xoá → dùng lại các địa chỉ này khi đặt hàng giao tận nơi qua `AddressSelector.jsx`.
Trạng thái: Đã làm đầy đủ.

**Tính phí giao hàng** — miễn phí nếu đơn đủ lớn, ngược lại tính phí chuẩn.
Quy trình: FE gọi `GET /api/delivery/shipping-fee` kèm tổng giá trị đơn → backend áp BR-52 (miễn phí nếu đơn ≥200.000đ trước phí ship và FitCoin, ngược lại phí chuẩn 25.000đ; không áp dụng cho Pickup/Membership/thuê Gear) → `ShippingFeeDisplay.jsx` hiển thị phí tính được.
Trạng thái: Đã làm.

**Quản lý đơn giao hàng (phía GymOwner)** — xem danh sách đơn cần giao, cập nhật trạng thái.
Quy trình dự định (theo BPMN 3.3.3): GymOwner nhận đơn mới → chuẩn bị sản phẩm → xác nhận sẵn sàng → kích hoạt subprocess giao hàng bên thứ 3 (GHN/Ahamove) → hệ thống chỉ chờ webhook từ bên thứ 3 để tự cập nhật trạng thái `shipped → delivering → done`; GymOwner chỉ can thiệp thủ công khi giao thất bại (chuyển `cancelled` + hoàn tiền tự động).
Trạng thái: lỗi kết nối — `GymOwnerOrdersPage.jsx` gọi `GET /api/delivery/orders` và `PUT /api/delivery/orders/{id}`, nhưng cả hai đường dẫn **không tồn tại** trong `delivery/router.py` (module này hiện chỉ xử lý địa chỉ và phí ship), nên trang luôn báo lỗi khi tải.

## 12. Khách vãng lai (Guest)

**Xem trước đơn hàng** — khách xem lại giỏ hàng và tổng tiền trước khi xác thực OTP.
Quy trình: khách thêm sản phẩm vào giỏ → tại bước checkout, `GuestCheckoutPage.jsx` gọi `POST /api/guests/checkout/preview` kèm danh sách sản phẩm → backend tính tổng tiền, phí ship, hiển thị bản xem trước để khách xác nhận trước khi xác thực OTP và thanh toán thật.
Trạng thái: Đã làm (bước gọi API này hoạt động đúng).

**Xem thông tin Guest theo ID** — tra cứu thông tin một khách vãng lai đã từng mua hàng.
Quy trình dự định: gọi `GET /api/guests/{guest_id}` → backend trả thông tin khách (SĐT, lịch sử đơn) — chức năng phục vụ nội bộ, có thể dùng khi nhân viên cần tra cứu đơn của khách vãng lai.
Trạng thái: chỉ có Backend, chưa có giao diện dùng tới.

**Toàn bộ luồng checkout của khách vãng lai** — dù mỗi bước riêng lẻ đã viết code (xác thực OTP, xem trước đơn, đặt hàng), quy trình tổng thể (chọn hàng → xác thực OTP → xem trước đơn → thanh toán → xác nhận) không thể chạy trọn vẹn.
Trạng thái: mồ côi — `GuestCheckoutPage.jsx` không có route nào trong `App.jsx` dẫn tới, nên không ai vào được trang này dù nó đã viết đầy đủ; cộng thêm lỗi kết nối ở bước đặt hàng cuối (mục 4) nếu có cách nào vào được.

## 13. Transformation Journey (tổng hợp)

**Trang trung tâm Journey** — điều hướng tới các tính năng con.
Quy trình: mở `/journey` → hiển thị các lối vào: Tập theo ngày, Tiến độ, Cột mốc, Chương trình mẫu — không tự gọi API, chỉ là trang điều hướng.
Trạng thái: Đã làm.

**Tiến độ chương trình** — hiển thị phần trăm hoàn thành chương trình đang theo.
Quy trình dự định: gọi API lấy `MEMBER_PROGRAMS.completion_pct` (đã được cập nhật mỗi khi hoàn thành buổi tập trong luồng Journey) → vẽ thanh tiến độ.
Trạng thái: mock/tĩnh, `JourneyProgressPage.jsx` hiện dùng dữ liệu tĩnh, chưa gọi API thật dù dữ liệu `completion_pct` đã được backend tính đúng ở nơi khác.

**Cột mốc thành tựu (Milestones)** — các mốc quan trọng đã đạt (VD: hoàn thành 100% chương trình) kèm phần thưởng.
Quy trình dự định: Milestone Engine kiểm tra 22 điều kiện mỗi khi hoàn thành buổi tập, cấp FitCoin/XP cho mốc mới đạt, mốc lớn (M32/M42) kích hoạt hiệu ứng chúc mừng đặc biệt và cho phép tạo Share Card chia sẻ mạng xã hội.
Trạng thái: lỗi kết nối — `JourneyMilestonesPage.jsx` gọi `GET /api/journey/milestones`, một module `journey` riêng **chưa hề tồn tại ở backend** (logic milestone thực tế nằm trong `gym/service.py` như một phần của luồng hoàn thành buổi tập, không có endpoint riêng để trang này gọi), nên trang luôn trả về rỗng/lỗi.

**Danh sách chương trình mẫu** — chọn 1 chương trình có sẵn thay vì tự thiết lập.
Quy trình dự định: hiển thị danh sách chương trình soạn sẵn theo mục tiêu (tăng cơ/giảm mỡ/sức bền...) → chọn 1 chương trình → tạo `MEMBER_PROGRAMS` dựa trên mẫu đó.
Trạng thái: mock/tĩnh — dùng mảng `MOCK_PROGRAMS` hardcode, backend chưa có khái niệm "chương trình mẫu" nào cả (khác với luồng sinh buổi tập AI theo yêu cầu ở mục 3, vốn đã hoạt động).

## 14. Trang quản trị (Admin)

**Dashboard tổng quan, quản lý người dùng, báo cáo doanh thu** — 3 trang cho GymOwner nắm tình hình kinh doanh, quản lý tài khoản, xem báo cáo.
Quy trình dự định: tổng hợp doanh thu từ `INVOICES` theo ngày/tháng, đếm số hội viên/đơn hàng, liệt kê toàn bộ `USERS` kèm bộ lọc theo vai trò/trạng thái, xuất báo cáo theo khoảng thời gian.
Trạng thái: chưa làm thật sự — không chỉ thiếu giao diện nối API mà backend cũng chưa có bất kỳ API thống kê/quản lý người dùng tổng hợp/báo cáo nào; cả ba trang đang chạy bằng dữ liệu giả (`mockAdminStats`, `mockRevenueChart`, `mockAllUsers`) và cần xây mới từ đầu ở cả hai phía nếu muốn dùng thật.

## 15. Các trang công khai khác

**Trang chủ** — giới thiệu FitFuel+, hiển thị thông báo và gói tập nếu đã đăng nhập.
Quy trình: mở `/` → gọi `GET /api/gym/announcements` và `GET /api/gym/memberships/my` (nếu đã đăng nhập) → hiển thị nội dung động kèm mục giới thiệu tĩnh (bảng giá, tính năng).
Trạng thái: Đã làm.

**Giỏ hàng** — gom nhiều món trước khi thanh toán.
Quy trình: thêm sản phẩm vào giỏ trên các trang sản phẩm → `CartContext` lưu state ở phía client (không gọi API) → mở `/cart` để xem/sửa số lượng → bấm Checkout mới thực sự gọi API tạo đơn — thiết kế hợp lý vì giỏ hàng chưa cần tồn tại ở server cho tới lúc đặt hàng thật.
Trạng thái: Đã làm.

**Thanh toán** — bước cuối cùng khi đặt hàng.
Quy trình: xem lại giỏ hàng trên `CheckoutPage.jsx` → gọi `GET /api/fitcoin/balance` để hiển thị số dư và cho áp dụng giảm giá → chọn địa chỉ giao hàng (nếu là đơn giao tận nơi) → gọi `POST /api/food/orders` để tạo đơn hàng dinh dưỡng chính thức → nhận xác nhận và điều hướng sang trang chi tiết đơn.
Trạng thái: Đã làm đầy đủ.

---

## Tổng kết

Trong tổng số 77 chức năng backend đã kiểm tra, khoảng 40 chức năng đã lên web thật với quy trình đầy đủ như mô tả ở trên, khoảng 30 chức năng đã có quy trình xử lý xong ở backend nhưng chưa có giao diện nào kích hoạt được quy trình đó, và 19 trang hiện đang hiển thị kết quả giả định thay vì chạy quy trình thật — trải đều ở cả ba nhóm Admin, GymOwner và Member.

Sáu điểm đáng lưu ý nhất là các chỗ **quy trình chắc chắn đứt gãy khi chạy thật** vì bước gọi API bị sai hoặc gọi tới một API chưa từng tồn tại: xác thực OTP khách vãng lai (đứt ở cả bước gửi mã và xác nhận mã), đặt hàng của khách vãng lai (đứt ở bước tạo đơn cuối), xem và cập nhật đơn giao hàng phía GymOwner (đứt hoàn toàn vì API chưa được viết), và xem cột mốc thành tựu trong Journey (đứt vì module xử lý chưa tồn tại). Ngoài ra còn hai trang mồ côi khiến quy trình dù đã viết đúng cũng không ai chạm tới được — trang đăng ký riêng và toàn bộ quy trình checkout của khách vãng lai.

Về mặt tổng thể, quy trình buổi tập, Journey sinh buổi tập bằng AI, dinh dưỡng, thông báo, và quản lý địa chỉ giao hàng là những quy trình được cài đặt đầy đủ nhất — đúng từ bước người dùng thao tác trên giao diện tới xử lý nghiệp vụ ở backend. Ngược lại, quy trình Gamification (thử thách, bảng xếp hạng, huy hiệu) và Social (đăng bài, feed, like) đã thiết kế và viết xong ở backend nhưng chưa từng được kích hoạt từ web thật, còn quy trình của ba trang Admin thì chưa được thiết kế ở tầng backend nên chưa có gì để chạy thật cả.

> Ghi chú: quy trình mô tả trong tài liệu này được suy ra từ việc đọc trực tiếp mã nguồn (`router.py`/`service.py` của từng module backend, toàn bộ `FE/src/pages/**/*.jsx`) và đối chiếu với các tài liệu thiết kế liên quan (`docs/12_Business_RulesNew.md`, `docs/14_BPMN_Business_Processes.md`) — không suy đoán chủ quan.
