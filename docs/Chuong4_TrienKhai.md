**CHƯƠNG 4. TRIỂN KHAI WEBSITE**

**4.1. Triển khai Frontend**

Frontend được xây dựng trên React + Vite, với cấu trúc thư mục thực tế tại `FE/src` gồm: `components/` (thành phần UI tái sử dụng), `pages/` (chia theo vai trò: `admin/`, `auth/`, `gear/`, `guest/`, `gymOwner/`, `member/`, `nutrition/`, `public/`), `context/`, `services/`, `routes/`, `layouts/`, `data/`.

Quản lý trạng thái sử dụng **React Context API** (`AuthContext.jsx`, `AppContext.jsx`, `CartContext.jsx`, `GuestContext.jsx`) — thông tin đăng nhập, giỏ hàng và trạng thái khách vãng lai được lưu và chia sẻ qua các Context Provider bọc ứng dụng, không dùng thư viện quản lý trạng thái ngoài (Redux/Zustand).

Routing dùng **React Router v7**, với component `ProtectedRoute` (`src/routes/ProtectedRoute.jsx`) kiểm tra đăng nhập và phân quyền theo prop `allowedRoles`, tự động chuyển hướng nếu người dùng chưa đăng nhập hoặc không đủ quyền truy cập trang.

Việc gọi API được thực hiện qua một wrapper `fetch` tự viết (`src/services/api.js`): token JWT được đọc từ `localStorage` (khóa `fitfuel_token`) và gắn thủ công vào header `Authorization: Bearer <token>` cho từng request cần xác thực.

**4.2. Triển khai Backend**

Backend sử dụng **FastAPI** (Python, bất đồng bộ), tổ chức theo mô hình module hóa tại `BE/app/modules/<domain>/`, mỗi domain gồm 4 file: `model.py` (SQLAlchemy model), `service.py` (logic nghiệp vụ), `router.py` (endpoint), `schema.py` (Pydantic schema cho request/response). Các domain hiện có: `auth`, `users`, `gym`, `food`, `gear`, `gamification`, `fitcoin`, `social`, `notifications`, `ai_coaching`, `delivery`, `upload`, `guests`, `billing`, `catalog`.

Xác thực dùng **JWT** (thư viện `python-jose`), thuật toán **HS256**, thời hạn token **7 ngày** (`ACCESS_TOKEN_EXPIRE_DAYS = 7`).

Xác thực OTP cho khách vãng lai (`GuestOTP`): mã gồm **6 chữ số** sinh ngẫu nhiên, thời hạn hiệu lực **5 phút**, tối đa **3 lần thử sai** cho mỗi mã — hết số lần thử, hệ thống yêu cầu xin mã mới (không áp dụng khóa tài khoản theo thời gian).

Mật khẩu được băm bằng thư viện **bcrypt** (salt sinh tự động qua `bcrypt.gensalt()`, cost factor mặc định 12). Việc kiểm tra dữ liệu đầu vào (input validation) tận dụng cơ chế khai báo kiểu của **Pydantic** thông qua các schema request/response — FastAPI tự động kiểm tra và trả lỗi 422 khi dữ liệu không hợp lệ.

Xử lý lỗi tập trung qua các exception handler toàn cục khai báo tại `app/main.py` (bắt `Exception`, `RequestValidationError`, `HTTPException`), trả về JSON theo cấu trúc thống nhất: `{"success": false, "error": <mã lỗi>, "message": <thông báo>, "detail": ...}`.

**4.3. Triển khai cơ sở dữ liệu**

Cơ sở dữ liệu sử dụng **PostgreSQL** (driver `asyncpg`), triển khai trên Render. Schema được khởi tạo qua `Base.metadata.create_all()` khi ứng dụng chạy lần đầu, kết hợp với thư mục `alembic/` chứa các migration cho những thay đổi schema phát sinh sau đó — không chỉ dựa hoàn toàn vào `create_all()`. Nhiều khóa ngoại được khai báo `ON DELETE CASCADE` hoặc `ON DELETE SET NULL` (ví dụ trong các model của `billing`, `food`, `gym`, `gamification`, `users`, `gear`) để tự động dọn dữ liệu liên quan khi bản ghi cha bị xóa.

Bảng `GEAR_LIFECYCLE` được thiết kế theo nguyên tắc **append-only theo quy ước code**: lớp service chỉ cung cấp hành động thêm bản ghi mới, không có endpoint nào cho phép sửa bản ghi lịch sử cũ — đây là ràng buộc ở tầng ứng dụng, chưa phải ràng buộc cứng ở tầng cơ sở dữ liệu (chưa có trigger/constraint chặn UPDATE).

Dữ liệu demo được khởi tạo qua script `app/seed.py` (kèm hai script bổ sung `seed_care_queue.py`, `seed_pos_food.py`), gồm: 6 tài khoản demo (2 Hội viên, 4 Chủ phòng gym — trong đó 1 đóng vai trò Admin), 10 sản phẩm dinh dưỡng, 10 thiết bị gear, 7 bài tập mẫu và 2 giáo trình tập luyện mẫu.

**4.4. Tích hợp bổ sung**

**4.4.1. Module sinh lịch tập tự động (Workout Generator)**

Hàm `generate_workout()` (`app/modules/gym/workout_generator.py`, gọi qua `POST /sessions/generate`) lọc bài tập từ bảng `EXERCISE_TEMPLATES` theo nhóm cơ mục tiêu (`muscle_group`); mức tạ/số reps đề xuất được tính dựa trên lịch sử `ExerciseLog` thật của người dùng theo cơ chế tăng tải dần (progressive overload). Nếu ghi chú buổi tập gần nhất chứa từ khóa liên quan chấn thương (đau, nhức, chấn thương, nhói, mỏi khớp, đau lưng, đau gối...), hệ thống tự chuyển sang chế độ giảm tải (deload), giảm mức tạ đi 30% (`prev_weight * 0.7`). Mỗi lần tăng tải bị giới hạn đồng thời hai điều kiện: tối đa +2.5kg và không vượt quá 10% mức tạ hiện tại (`prev_weight * 1.10`). Hệ thống cũng tự sinh ghi chú giải thích ngắn cho từng gợi ý (ví dụ: "Tăng 2.5kg tạ dựa trên tiến độ tập luyện gần đây"). Điểm khớp nội dung (docstring gọi là "NCF") ở phiên bản hiện tại chỉ là công thức băm rút gọn từ `user_id`/`exercise_template_id`, mang tính minh họa, chưa phải mô hình học máy thật; việc lọc theo thiết bị khả dụng hoặc độ khó (`equipment`, `difficulty`) cũng chưa được áp dụng dù hai cột này đã có trong model.

**4.4.2. Module phát hiện Plateau & đề xuất Deload**

Hàm `analyze_progress()` (`app/modules/gym/progress_engine.py`) phân tích lịch sử tập luyện để phát hiện ba trạng thái: **Plateau** (không có Personal Record mới trong ≥ 28 ngày — `PLATEAU_WINDOW_DAYS = 28`), **Overtraining** (≥ 9 buổi tập trong 14 ngày hoặc RPE trung bình ≥ 8.5) và **Undertraining** (≤ 2 buổi tập trong cùng khoảng thời gian). Khi phát hiện Overtraining hoặc từ khóa chấn thương, hệ thống đề xuất hành động Deload (giảm cường độ khoảng 20-30%, thực thi bởi module 4.4.1).

**4.4.3. Module gợi ý thực đơn dinh dưỡng (Genetic Algorithm)**

Module gợi ý dinh dưỡng (`app/modules/ai_coaching/engine.py`) xác định mục tiêu macro (protein/carb/fat) phù hợp với nhóm cơ tập nhiều nhất gần đây và mục tiêu thể hình của người dùng qua hàm `get_macro_profile(muscle_group, fitness_goal)` (tra bảng ánh xạ `MACRO_RULES`). Đường dẫn xử lý chính là hàm `run_genetic_nutrition_optimizer()`: khởi tạo quần thể 20 cá thể (mỗi cá thể là tổ hợp ngẫu nhiên 3 sản phẩm dinh dưỡng), tiến hóa qua 5 thế hệ bằng chọn lọc (giữ 50% cá thể tốt nhất theo hàm fitness dựa trên sai số macro - MSE), lai ghép (crossover) và đột biến (mutation ~10%), trả về tổ hợp thực đơn tối ưu nhất. Trường hợp danh sách sản phẩm sau khi lọc dị ứng (`_filter_allergens()`) còn dưới 3 món, hệ thống dùng phương án dự phòng đơn giản hơn (`_query_personalized()`, chấm điểm MSE trực tiếp, không qua GA).

**4.4.4. Sinh mã định danh thiết bị (Gear ID)**

Mỗi thiết bị gear được cấp một mã định danh duy nhất qua hàm `_gen_gear_id()` (`app/modules/gear/service.py`): lấy 8 ký tự đầu (viết hoa) của một UUID v4 (`uuid.uuid4().hex[:8].upper()`) và định dạng theo mẫu `GEAR-XXXX-XXXX`, đảm bảo mỗi thiết bị có mã dễ đọc, dễ tra cứu và không trùng lặp.

**4.4.5. Upload ảnh lên Cloudinary**

Ảnh (đánh giá sản phẩm, ảnh thiết bị cho thuê...) được tải lên trực tiếp bằng cách stream `UploadFile` của FastAPI vào Cloudinary qua `cloudinary.uploader.upload(file.file)`, không lưu tạm trên đĩa cục bộ của server. Điều kiện kiểm tra hiện tại là loại nội dung (`content_type`) phải bắt đầu bằng `image/`.

**4.4.6. Trợ lý AI dạng chat (FitAI Chatbot)**

Hệ thống có một trợ lý chat nổi tên **FitAI** (`FE/src/components/common/FloatingChatbot.jsx`), chỉ hiển thị cho người dùng có vai trò `member`. Khác với module gợi ý ở mục 4.4.1, thành phần này **gọi trực tiếp từ Frontend đến Groq API** (model `llama-3.1-8b-instant`, endpoint `api.groq.com/openai/v1/chat/completions`) bằng `fetch`, không đi qua backend và không có endpoint chat riêng ở phía server.

FitAI được cấu hình bằng một system prompt cố định (định danh trợ lý, giới hạn phạm vi tư vấn thể hình/dinh dưỡng, cấm chẩn đoán bệnh, yêu cầu trả lời tiếng Việt ngắn gọn). Trước mỗi phiên chat, hệ thống gọi `GET /api/gym/sessions/my` để lấy buổi tập gần nhất của người dùng và bổ sung thông tin này vào system prompt, giúp câu trả lời có ngữ cảnh cá nhân hóa. Giao diện có sẵn 6 gợi ý câu hỏi nhanh (quick prompts) và cơ chế "Chế độ Demo" khi biến môi trường `VITE_GROQ_API_KEY` chưa được thiết lập.

Cần lưu ý: do API key Groq được gọi trực tiếp từ trình duyệt qua biến môi trường `VITE_` (biến này được đóng gói (bundle) vào mã JavaScript công khai khi build Vite), khóa API không được giữ kín hoàn toàn ở phía client — đây là điểm đánh đổi giữa tốc độ triển khai và mức độ bảo mật khóa API, được ghi nhận là hạn chế cần cải thiện (ví dụ: chuyển sang gọi qua một endpoint proxy ở backend) trong các phiên bản sau.
