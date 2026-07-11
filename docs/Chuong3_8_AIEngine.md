**3.8. Kiến trúc AI Recommendation Engine**

**3.8.1. Mục tiêu và định vị công nghệ**

FitFuel AI Engine là hệ thống gợi ý tập trung, được thiết kế để cá nhân hóa trải nghiệm người dùng trong các hoạt động chuyên môn như lập lịch tập, theo dõi tiến độ và tối ưu dinh dưỡng. Ở giai đoạn hiện tại, hệ thống vận hành dựa trên sự kết hợp giữa Rule-based (hệ luật nghiệp vụ), Heuristic Engineering (thuật toán ngưỡng rút gọn từ dữ liệu lịch sử) và Genetic Algorithm (thuật toán di truyền) cho bài toán tối ưu hóa dinh dưỡng.

Nguyên tắc thiết kế cốt lõi:

- **Tính giải thích (Explainability - XAI)**: Mọi kết quả gợi ý đều đi kèm với diễn giải logic, giúp người dùng hiểu rõ căn cứ của đề xuất.
- **An toàn là ưu tiên (Safety First)**: Hệ thống tích hợp các bộ lọc (Guardrails) nhằm ngăn chặn các đề xuất quá tải hoặc vi phạm các giới hạn sức khỏe cá nhân (ví dụ: dị ứng).
- **Định hướng dữ liệu (Data-Driven)**: Các ngưỡng và quy luật được tinh chỉnh dựa trên dữ liệu lịch sử thực tế từ các bảng EXERCISE_LOGS (chứa chi tiết từng set dưới dạng JSON) và WORKOUT_SESSIONS.

**3.8.2. Kiến trúc pipeline tổng quát**

Quy trình xử lý của AI Engine được phân tầng thành 4 giai đoạn chính:

1. **Input Data**: Thu thập dữ liệu từ các nguồn: WORKOUT_SESSIONS, EXERCISE_LOGS, FOOD_PRODUCTS và hồ sơ cá nhân (thông tin dị ứng, mục tiêu thể hình).
2. **Feature Aggregation**: Tính toán các đặc trưng quan trọng: khối lượng tập luyện (Volume = tạ × reps), số ngày từ cột mốc PR (Personal Record) gần nhất, chỉ số RPE (Rating of Perceived Exertion) trung bình và tần suất tập luyện.
3. **Core Processing (RE-Module)**: Vận hành ba module song song (RE-2, RE-3, RE-4) tùy thuộc vào loại gợi ý, áp dụng các luật ngưỡng, điểm khớp (matching score) hoặc thuật toán di truyền.
4. **Guardrails**: Lọc dữ liệu đầu ra dựa trên các ràng buộc về dị ứng, thiết bị khả dụng tại chi nhánh và giới hạn tăng tải an toàn trước khi hiển thị cho người dùng.

**3.8.3. Chi tiết các module gợi ý (RE-1 đến RE-5)**

| Mã | Tên Module | Cách tiếp cận |
| :---- | :---- | :---- |
| RE-1 | Membership Classifier | Rule-based scoring |
| RE-2 | Workout Generator | Content-based filtering |
| RE-3 | Progress & Plateau Detector | Heuristic/Threshold-based |
| RE-4 | Nutrition Optimizer | Genetic Algorithm |
| RE-5 | Churn & Upgrade Predictor | Predictive Modeling |

**RE-2 (Workout Generator):** Thực hiện lọc bài tập dựa trên mục tiêu, nhóm cơ ưu tiên và tình trạng thiết bị khả dụng. Hệ thống cung cấp giải thích XAI, ví dụ: "Lịch tập Full Body 3 buổi/tuần được thiết kế cho người mới bắt đầu để tối ưu hóa khả năng thích nghi cơ bắp mà không gây quá tải."

**RE-3 (Progress & Plateau Detector):** Phân tích sự tiến bộ qua lịch tập và RPE. Hệ thống tự động phát hiện trạng thái (Plateau, Overtraining, Undertraining) dựa trên ngưỡng logic (ví dụ: Plateau nếu ≥ 28 ngày không có PR mới). Trong trường hợp phát hiện từ khóa về chấn thương trong ghi chú buổi tập, hệ thống tự động đề xuất phương án Deload giảm 30% cường độ.

**RE-4 (Nutrition Optimizer):** Sử dụng thuật toán di truyền để tạo thực đơn tối ưu. Một quần thể gồm 3 sản phẩm được chọn ngẫu nhiên, sau đó tiến hành các phép lai ghép (crossover) và đột biến (mutation) để tìm ra tổ hợp có hàm mục tiêu (fitness) gần nhất với yêu cầu macro của người dùng.

**Hướng phát triển:** RE-1 và RE-5 hiện chưa có triển khai trong hệ thống — dự kiến được xây dựng bằng các mô hình học máy có giám sát (XGBoost/Random Forest) khi hệ thống tích lũy đủ dữ liệu tương tác người dùng thật.

**3.8.4. Cơ chế phản hồi (Feedback Loop)**

Ở phiên bản hiện tại, mọi lượt tương tác với gợi ý (chấp nhận/bỏ qua) được ghi nhận qua log vận hành (server log) để phục vụ giám sát và gỡ lỗi thủ công, chưa được lưu trữ vào một bảng cơ sở dữ liệu riêng. Đây là nền tảng thiết kế cho vòng phản hồi (Feedback Loop) đầy đủ trong tương lai: khi được nâng cấp, các sự kiện này sẽ được lưu trữ có cấu trúc để phục vụ việc đánh giá hiệu quả của các luật gợi ý hiện tại và làm dữ liệu huấn luyện (training data) cho các mô hình học máy nâng cao (RE-1, RE-5).

**3.8.5. Các biện pháp bảo vệ an toàn (Guardrails)**

- **Ngưỡng an toàn thể chất:** Thiết lập chặn cứng đối với các bài tập phức hợp, đảm bảo không đề xuất tăng khối lượng vượt quá mức an toàn (+2.5kg/lần tập).
- **Quyền kiểm soát của người dùng:** Hệ thống giữ vai trò hỗ trợ ra quyết định; mọi điều chỉnh vào lịch tập hoặc chế độ dinh dưỡng đều yêu cầu sự xác nhận trực tiếp từ người dùng.
- **Bảo mật dữ liệu:** Các chỉ số nhạy cảm (cân nặng, chỉ số cơ thể, ảnh tiến trình) được xử lý tách biệt và không hiển thị trong phần diễn giải công khai khi chưa được phép.
