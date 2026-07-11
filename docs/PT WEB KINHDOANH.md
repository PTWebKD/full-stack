**CHƯƠNG 6\. THIẾT KẾ CƠ SỞ DỮ LIỆU**

**6.1. Nhận diện, mô tả và xác định thuộc tính các thực thể**

Cơ sở dữ liệu của hệ thống FitFuel+ được thiết kế trên PostgreSQL, gồm 44 bảng dữ liệu (thực thể), chia thành 5 nhóm chức năng chính: (1) Định danh, Xã hội và Gamification; (2) Phòng gym, Hội viên và Check-in; (3) Giáo trình, Buổi tập và Kỷ lục cá nhân; (4) Sản phẩm, Đơn hàng và Cho thuê thiết bị; (5) Đề xuất, CRM, Thử thách và Xã hội. Mỗi thực thể được mô tả chi tiết bên dưới, kèm bảng thuộc tính thể hiện kiểu dữ liệu và ràng buộc tương ứng.

**6.1.1. Nhóm Định danh, Xã hội và Gamification**

Bảng USERS: Lưu thông tin tài khoản của tất cả người dùng hệ thống (hội viên, chủ phòng gym, nhân viên), gồm thông tin đăng nhập, vai trò, và các chỉ số gamification (XP, level, streak, fitcoin).

**Bảng 6.1: Thuộc tính bảng USERS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | user\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | email | Chuỗi ký tự, tối đa 255 ký tự | NOT NULL, UNIQUE |  |
| 3 | phone | Chuỗi ký tự, tối đa 15 ký tự | UNIQUE |  |
| 4 | password\_hash | Chuỗi ký tự, tối đa 255 ký tự | NOT NULL |  |
| 5 | role | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 6 | display\_name | Chuỗi ký tự, tối đa 100 ký tự | NOT NULL |  |
| 7 | avatar\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 8 | xp\_total | Số nguyên | NOT NULL | Mặc định: 0 |
| 9 | current\_level | Số nguyên | NOT NULL | Mặc định: 1 |
| 10 | current\_streak | Số nguyên | NOT NULL | Mặc định: 0 |
| 11 | longest\_streak | Số nguyên | NOT NULL | Mặc định: 0 |
| 12 | fitcoin\_balance | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 13 | referred\_by | Số nguyên | Khóa ngoại → USERS |  |
| 14 | is\_active | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |
| 15 | terms\_accepted\_at | Ngày giờ | Có thể rỗng (NULL) |  |
| 16 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng AUTH\_OTP: Lưu mã OTP dùng để xác thực số điện thoại trong quá trình đăng ký/đăng nhập.

**Bảng 6.2: Thuộc tính bảng AUTH\_OTP**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | otp\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | phone | Chuỗi ký tự, tối đa 15 ký tự | NOT NULL |  |
| 3 | otp\_code | Chuỗi ký tự, tối đa 10 ký tự | NOT NULL |  |
| 4 | expired\_at | Ngày giờ | NOT NULL |  |
| 5 | attempts\_left | Số nguyên | NOT NULL | Mặc định: 5 |
| 6 | is\_verified | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng FITNESS\_PASSPORTS: Lưu hồ sơ tổng hợp thành tích tập luyện của người dùng (tổng số buổi tập, tổng khối lượng, streak dài nhất) dùng để hiển thị công khai.

**Bảng 6.3: Thuộc tính bảng FITNESS\_PASSPORTS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | passport\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | total\_sessions | Số nguyên | NOT NULL | Mặc định: 0 |
| 4 | total\_volume | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 5 | longest\_streak | Số nguyên | NOT NULL | Mặc định: 0 |
| 6 | is\_public | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng BODY\_METRICS: Lưu lịch sử các chỉ số cơ thể (cân nặng, chiều cao, tỷ lệ mỡ, vòng eo, vòng ngực...) theo từng lần đo của người dùng.

**Bảng 6.4: Thuộc tính bảng BODY\_METRICS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | metric\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | recorded\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 4 | weight\_kg | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 5 | height\_cm | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 6 | body\_fat\_pct | Số thập phân, 4 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 7 | muscle\_mass\_kg | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 8 | waist\_cm | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 9 | chest\_cm | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 10 | arm\_cm | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 11 | thigh\_cm | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |

Bảng BODY\_PHOTOS: Lưu ảnh chụp cơ thể theo thời gian để người dùng theo dõi quá trình thay đổi vóc dáng.

**Bảng 6.5: Thuộc tính bảng BODY\_PHOTOS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | photo\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | photo\_url | Chuỗi ký tự, tối đa 500 ký tự | NOT NULL |  |
| 4 | recorded\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng FOLLOWS: Bảng trung gian thể hiện quan hệ theo dõi (follow) giữa các người dùng với nhau, tạo thành mạng xã hội nội bộ.

**Bảng 6.6: Thuộc tính bảng FOLLOWS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | follower\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 2 | following\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng BADGES: Danh mục các huy hiệu (badge) có thể trao cho người dùng khi đạt mốc thành tích.

**Bảng 6.7: Thuộc tính bảng BADGES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | badge\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 100 ký tự | NOT NULL |  |
| 3 | description | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 4 | icon\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 5 | badge\_type | Chuỗi ký tự, tối đa 50 ký tự | Có thể rỗng (NULL) |  |

Bảng MILESTONE\_ACHIEVEMENTS: Ghi nhận các mốc thành tích người dùng đã đạt được, kèm huy hiệu và phần thưởng XP/fitcoin tương ứng.

**Bảng 6.8: Thuộc tính bảng MILESTONE\_ACHIEVEMENTS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | achievement\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | milestone\_code | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 4 | badge\_id | Số nguyên | Khóa ngoại → BADGES |  |
| 5 | fitcoin\_rewarded | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 6 | xp\_rewarded | Số nguyên | NOT NULL | Mặc định: 0 |
| 7 | achieved\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng FITCOIN\_TRANSACTIONS: Ghi lại lịch sử phát sinh và sử dụng fitcoin (điểm thưởng quy đổi) của từng người dùng.

**Bảng 6.9: Thuộc tính bảng FITCOIN\_TRANSACTIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | transaction\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | amount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 4 | tx\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 5 | source | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 6 | reference\_id | Số nguyên | Có thể rỗng (NULL) |  |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng REFERRALS: Quản lý chương trình giới thiệu bạn bè (referral), theo dõi trạng thái từ lúc giới thiệu đến khi bạn bè đăng ký thành công.

**Bảng 6.10: Thuộc tính bảng REFERRALS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | referral\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | referrer\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | friend\_phone | Chuỗi ký tự, tối đa 15 ký tự | NOT NULL |  |
| 4 | friend\_user\_id | Số nguyên | Khóa ngoại → USERS |  |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |
| 6 | expired\_at | Ngày giờ | Có thể rỗng (NULL) |  |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

**6.1.2. Nhóm Phòng gym, Hội viên và Check-in**

Bảng GYMS: Lưu thông tin các chi nhánh/phòng tập gym trong hệ thống.

**Bảng 6.11: Thuộc tính bảng GYMS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | gym\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 3 | address | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 4 | phone | Chuỗi ký tự, tối đa 15 ký tự | Có thể rỗng (NULL) |  |
| 5 | email | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 6 | opening\_hours | Chuỗi ký tự, tối đa 100 ký tự | Có thể rỗng (NULL) |  |
| 7 | logo\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |

Bảng MEMBERSHIP\_PLANS: Danh mục các gói hội viên (thời hạn, giá, mô tả) mà người dùng có thể đăng ký.

**Bảng 6.12: Thuộc tính bảng MEMBERSHIP\_PLANS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | plan\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 100 ký tự | NOT NULL |  |
| 3 | duration\_days | Số nguyên | NOT NULL |  |
| 4 | price | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 5 | description | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 6 | is\_active | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |

Bảng GYM\_MEMBERSHIPS: Lưu thông tin hợp đồng hội viên của từng người dùng tại một phòng gym cụ thể, gồm thời gian hiệu lực và trạng thái.

**Bảng 6.13: Thuộc tính bảng GYM\_MEMBERSHIPS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | membership\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | plan\_id | Số nguyên | Khóa ngoại → MEMBERSHIP\_PLANS, NOT NULL |  |
| 4 | gym\_id | Số nguyên | Khóa ngoại → GYMS, NOT NULL |  |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'active' |
| 6 | start\_date | Ngày (không giờ) | NOT NULL |  |
| 7 | end\_date | Ngày (không giờ) | NOT NULL |  |
| 8 | freeze\_days\_used | Số nguyên | NOT NULL | Mặc định: 0 |
| 9 | cancel\_scheduled\_at | Ngày giờ | Có thể rỗng (NULL) |  |
| 10 | referral\_bonus\_applied | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 11 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 12 | updated\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng FREE\_TRIAL\_PASSES: Quản lý các lượt dùng thử miễn phí (trial pass) cấp cho khách chưa là hội viên.

**Bảng 6.14: Thuộc tính bảng FREE\_TRIAL\_PASSES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | pass\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | phone | Chuỗi ký tự, tối đa 15 ký tự | NOT NULL |  |
| 3 | user\_id | Số nguyên | Khóa ngoại → USERS |  |
| 4 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'active' |
| 5 | activated\_at | Ngày giờ | Có thể rỗng (NULL) |  |
| 6 | expired\_at | Ngày giờ | Có thể rỗng (NULL) |  |

Bảng GYM\_TOURS: Lưu lịch hẹn tham quan phòng gym của khách hàng tiềm năng.

**Bảng 6.15: Thuộc tính bảng GYM\_TOURS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | tour\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | phone | Chuỗi ký tự, tối đa 15 ký tự | NOT NULL |  |
| 3 | user\_id | Số nguyên | Khóa ngoại → USERS |  |
| 4 | scheduled\_at | Ngày giờ | NOT NULL |  |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'scheduled' |

Bảng MEMBERSHIP\_FREEZES: Lưu các yêu cầu tạm ngưng (đóng băng) hợp đồng hội viên và trạng thái phê duyệt.

**Bảng 6.16: Thuộc tính bảng MEMBERSHIP\_FREEZES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | freeze\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | membership\_id | Số nguyên | Khóa ngoại → GYM\_MEMBERSHIPS, NOT NULL |  |
| 3 | freeze\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 4 | start\_date | Ngày (không giờ) | NOT NULL |  |
| 5 | end\_date | Ngày (không giờ) | NOT NULL |  |
| 6 | proof\_document\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | approved\_by | Số nguyên | Khóa ngoại → USERS |  |
| 8 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |

**6.1.3. Nhóm Giáo trình, Buổi tập và Kỷ lục cá nhân**

Bảng EXERCISES: Danh mục các bài tập thể dục, phân loại theo nhóm cơ và thiết bị sử dụng.

**Bảng 6.17: Thuộc tính bảng EXERCISES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | exercise\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 3 | muscle\_group | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 4 | category | Chuỗi ký tự, tối đa 50 ký tự | Có thể rỗng (NULL) |  |
| 5 | equipment\_required | Chuỗi ký tự, tối đa 100 ký tự | Có thể rỗng (NULL) |  |
| 6 | video\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |

Bảng WORKOUT\_PROGRAMS: Danh mục các giáo trình tập luyện mẫu theo mục tiêu và trình độ thể lực.

**Bảng 6.18: Thuộc tính bảng WORKOUT\_PROGRAMS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | program\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 3 | goal\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 4 | fitness\_level | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 5 | days\_per\_week | Số nguyên | NOT NULL |  |
| 6 | description | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | is\_active | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |

Bảng PROGRAM\_DAYS: Chia một giáo trình tập luyện thành các ngày tập với nhóm cơ trọng tâm khác nhau.

**Bảng 6.19: Thuộc tính bảng PROGRAM\_DAYS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | day\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | program\_id | Số nguyên | Khóa ngoại → WORKOUT\_PROGRAMS, NOT NULL |  |
| 3 | day\_number | Số nguyên | NOT NULL |  |
| 4 | focus\_muscle\_group | Chuỗi ký tự, tối đa 50 ký tự | Có thể rỗng (NULL) |  |

Bảng PROGRAM\_EXERCISES: Bảng trung gian gắn các bài tập cụ thể vào từng ngày tập trong giáo trình, kèm chỉ tiêu số set/số rep.

**Bảng 6.20: Thuộc tính bảng PROGRAM\_EXERCISES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | program\_exercise\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | day\_id | Số nguyên | Khóa ngoại → PROGRAM\_DAYS, NOT NULL |  |
| 3 | exercise\_id | Số nguyên | Khóa ngoại → EXERCISES, NOT NULL |  |
| 4 | target\_sets | Số nguyên | NOT NULL |  |
| 5 | target\_reps\_min | Số nguyên | NOT NULL |  |
| 6 | target\_reps\_max | Số nguyên | NOT NULL |  |

Bảng MEMBER\_PROGRAMS: Ghi nhận việc một người dùng đăng ký theo một giáo trình tập luyện và tiến độ hoàn thành.

**Bảng 6.21: Thuộc tính bảng MEMBER\_PROGRAMS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | member\_program\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | program\_id | Số nguyên | Khóa ngoại → WORKOUT\_PROGRAMS, NOT NULL |  |
| 4 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'active' |
| 5 | completion\_pct | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 6 | start\_date | Ngày (không giờ) | NOT NULL |  |
| 7 | end\_date | Ngày (không giờ) | Có thể rỗng (NULL) |  |

Bảng WORKOUT\_SESSIONS: Lưu thông tin mỗi buổi tập thực tế của người dùng, có thể gắn với một giáo trình đang theo dõi.

**Bảng 6.22: Thuộc tính bảng WORKOUT\_SESSIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | session\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | member\_program\_id | Số nguyên | Khóa ngoại → MEMBER\_PROGRAMS |  |
| 4 | session\_name | Chuỗi ký tự, tối đa 150 ký tự | Có thể rỗng (NULL) |  |
| 5 | muscle\_group | Chuỗi ký tự, tối đa 50 ký tự | Có thể rỗng (NULL) |  |
| 6 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'active' |
| 7 | is\_pr\_achieved | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 8 | started\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 9 | completed\_at | Ngày giờ | Có thể rỗng (NULL) |  |

Bảng CHECK\_INS: Ghi nhận lịch sử check-in/check-out của hội viên tại phòng gym.

**Bảng 6.23: Thuộc tính bảng CHECK\_INS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | checkin\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | gym\_id | Số nguyên | Khóa ngoại → GYMS, NOT NULL |  |
| 4 | membership\_id | Số nguyên | Khóa ngoại → GYM\_MEMBERSHIPS |  |
| 5 | trial\_pass\_id | Số nguyên | Khóa ngoại → FREE\_TRIAL\_PASSES |  |
| 6 | checkin\_time | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 7 | checkout\_time | Ngày giờ | Có thể rỗng (NULL) |  |

Bảng EXERCISE\_LOGS: Ghi lại từng bài tập đã thực hiện trong một buổi tập, có đánh dấu nếu đạt kỷ lục cá nhân (PR).

**Bảng 6.24: Thuộc tính bảng EXERCISE\_LOGS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | log\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | session\_id | Số nguyên | Khóa ngoại → WORKOUT\_SESSIONS, NOT NULL |  |
| 3 | exercise\_id | Số nguyên | Khóa ngoại → EXERCISES, NOT NULL |  |
| 4 | program\_exercise\_id | Số nguyên | Khóa ngoại → PROGRAM\_EXERCISES |  |
| 5 | is\_pr | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 6 | overload\_suggestion | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng SET\_LOGS: Ghi chi tiết từng set (số rep, mức tạ, thời gian nghỉ) của một bài tập trong nhật ký tập luyện.

**Bảng 6.25: Thuộc tính bảng SET\_LOGS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | set\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | log\_id | Số nguyên | Khóa ngoại → EXERCISE\_LOGS, NOT NULL |  |
| 3 | set\_number | Số nguyên | NOT NULL |  |
| 4 | weight\_kg | Số thập phân, 6 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 5 | reps\_target | Số nguyên | Có thể rỗng (NULL) |  |
| 6 | reps\_actual | Số nguyên | Có thể rỗng (NULL) |  |
| 7 | rest\_seconds | Số nguyên | Có thể rỗng (NULL) |  |

Bảng PERSONAL\_RECORDS: Lưu kỷ lục cá nhân (PR) cao nhất của từng người dùng theo từng bài tập.

**Bảng 6.26: Thuộc tính bảng PERSONAL\_RECORDS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | pr\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | exercise\_id | Số nguyên | Khóa ngoại → EXERCISES, NOT NULL |  |
| 4 | session\_id | Số nguyên | Khóa ngoại → WORKOUT\_SESSIONS |  |
| 5 | pr\_value | Số thập phân, 8 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 6 | previous\_value | Số thập phân, 8 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 7 | improvement\_pct | Số thập phân, 5 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 8 | achieved\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng TRANSFORMATION\_GOALS: Lưu mục tiêu chuyển đổi vóc dáng của người dùng (loại mục tiêu, số ngày tập/tuần, dị ứng thực phẩm...) dùng để cá nhân hoá gợi ý giáo trình.

**Bảng 6.27: Thuộc tính bảng TRANSFORMATION\_GOALS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | goal\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | goal\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 4 | fitness\_level | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 5 | days\_per\_week | Số nguyên | NOT NULL |  |
| 6 | injured\_areas | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 7 | food\_allergies | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 8 | dietary\_preference | Chuỗi ký tự, tối đa 50 ký tự | Có thể rỗng (NULL) |  |
| 9 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

**6.1.4. Nhóm Sản phẩm, Đơn hàng và Cho thuê thiết bị**

Bảng PRODUCTS: Danh mục sản phẩm kinh doanh dinh dưỡng có thể mua. (Ghi chú: thiết bị tập luyện — gear — không dùng mô hình PRODUCTS/INVENTORY chung này; xem nhóm bảng GEAR_ITEMS/GEAR_TRANSACTIONS/GEAR_LIFECYCLE riêng bên dưới, thiết kế theo BR-20 — mỗi gear là một vật thể vật lý độc lập, không quản lý theo số lượng tồn kho chung.)

**Bảng 6.28: Thuộc tính bảng PRODUCTS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | product\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 3 | category | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 4 | price | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 5 | deposit\_amount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 6 | description | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | image\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 8 | is\_available | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |

Bảng INVENTORY: Theo dõi số lượng tồn kho của từng sản phẩm và ngưỡng cảnh báo hết hàng.

**Bảng 6.29: Thuộc tính bảng INVENTORY**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | inventory\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | product\_id | Số nguyên | Khóa ngoại → PRODUCTS, NOT NULL |  |
| 3 | quantity | Số nguyên | NOT NULL | Mặc định: 0 |
| 4 | warning\_threshold | Số nguyên | NOT NULL | Mặc định: 5 |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'in\_stock' |

Bảng GEAR\_ITEMS: Lưu thông tin một thiết bị tập luyện cụ thể được đăng bán hoặc cho thuê. Mỗi bản ghi là một vật thể vật lý độc lập (BR-20) — không nhóm nhiều đơn vị giống nhau dưới một sản phẩm mẫu.

**Bảng 6.30: Thuộc tính bảng GEAR\_ITEMS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | gear\_id | Chuỗi ký tự, tối đa 20 ký tự (khóa chính) | Khóa chính | Định dạng UUID: GEAR-XXXX-XXXX |
| 2 | current\_owner\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | category | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 4 | name | Chuỗi ký tự, tối đa 200 ký tự | NOT NULL |  |
| 5 | description | Chuỗi ký tự, tối đa 1000 ký tự | Có thể rỗng (NULL) |  |
| 6 | condition\_rating | Số nguyên | NOT NULL |  |
| 7 | condition\_notes | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 8 | images | Mảng JSON | Có thể rỗng (NULL) |  |
| 9 | listing\_type | Chuỗi ký tự, tối đa 10 ký tự | NOT NULL | Mặc định: 'rent'; giá trị: 'sell' / 'rent' / 'both' |
| 10 | sell\_price | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 11 | rent\_price\_day | Số thập phân, 10 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 12 | rent\_price\_week | Số thập phân, 10 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 13 | deposit\_amount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 14 | qr\_code\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) | Dự trù, chưa sinh mã QR ở phiên bản hiện tại |
| 15 | verified | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 16 | is\_available | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |
| 17 | avg\_rating | Số thập phân, 2 chữ số, 1 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 18 | total\_reviews | Số nguyên | NOT NULL | Mặc định: 0 |
| 19 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng GEAR\_TRANSACTIONS: Ghi lại một giao dịch mua đứt hoặc thuê thiết bị — dùng chung một bảng cho cả hai loại giao dịch, phân biệt bằng cột `type`.

**Bảng 6.31: Thuộc tính bảng GEAR\_TRANSACTIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | transaction\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | gear\_id | Chuỗi ký tự | Khóa ngoại → GEAR\_ITEMS, NOT NULL |  |
| 3 | seller\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 4 | buyer\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 5 | type | Chuỗi ký tự, tối đa 10 ký tự | NOT NULL | Giá trị: 'sale' / 'rental' |
| 6 | amount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Giá bán, hoặc phí thuê (đơn giá × số ngày) |
| 7 | deposit | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 8 | fitcoin\_used | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 9 | rental\_start | Ngày (không giờ) | Có thể rỗng (NULL) |  |
| 10 | rental\_end | Ngày (không giờ) | Có thể rỗng (NULL) |  |
| 11 | status | Chuỗi ký tự, tối đa 20 ký tự | NOT NULL | Mặc định: 'pending'; giá trị: pending/active/completed/disputed |
| 12 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng GEAR\_LIFECYCLE: Lưu toàn bộ lịch sử vòng đời của một thiết bị (đăng bán, bán, cho thuê, trả, đăng lại) dưới dạng bảng chỉ thêm (append-only) — mỗi sự kiện tạo một bản ghi mới, không sửa/xoá bản ghi cũ.

**Bảng 6.32: Thuộc tính bảng GEAR\_LIFECYCLE**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | lifecycle\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | gear\_id | Chuỗi ký tự | Khóa ngoại → GEAR\_ITEMS, NOT NULL |  |
| 3 | owner\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 4 | action | Chuỗi ký tự, tối đa 20 ký tự | NOT NULL | Giá trị: listed/sold/rented/returned/relisted |
| 5 | condition\_at\_time | Số nguyên | Có thể rỗng (NULL) |  |
| 6 | notes | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | photos | Mảng JSON | Có thể rỗng (NULL) |  |
| 8 | price\_snapshot | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 9 | timestamp | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng SHIPPING\_ADDRESSES: Lưu các địa chỉ giao hàng đã lưu của người dùng.

**Bảng 6.33: Thuộc tính bảng SHIPPING\_ADDRESSES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | address\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | recipient\_name | Chuỗi ký tự, tối đa 100 ký tự | NOT NULL |  |
| 4 | recipient\_phone | Chuỗi ký tự, tối đa 15 ký tự | NOT NULL |  |
| 5 | address\_line | Chuỗi ký tự, tối đa 255 ký tự | NOT NULL |  |
| 6 | city | Chuỗi ký tự, tối đa 100 ký tự | NOT NULL |  |
| 7 | is\_default | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |

Bảng INVOICES: Hoá đơn thanh toán chung cho cả đơn hàng thực phẩm và đơn thuê thiết bị, hỗ trợ cả khách vãng lai (guest).

**Bảng 6.34: Thuộc tính bảng INVOICES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | invoice\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS |  |
| 3 | guest\_phone | Chuỗi ký tự, tối đa 15 ký tự | Có thể rỗng (NULL) |  |
| 4 | guest\_session\_token | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 5 | invoice\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 6 | payment\_gateway\_tx\_id | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 7 | subtotal | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 8 | fitcoin\_discount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 9 | shipping\_fee | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 10 | total\_amount | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 11 | payment\_method | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 12 | payment\_status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |
| 13 | paid\_at | Ngày giờ | Có thể rỗng (NULL) |  |
| 14 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng NUTRITION\_ORDERS: Đơn đặt hàng thực phẩm dinh dưỡng, gắn với một hoá đơn và địa chỉ giao hàng.

**Bảng 6.35: Thuộc tính bảng NUTRITION\_ORDERS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | order\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | invoice\_id | Số nguyên | Khóa ngoại → INVOICES, NOT NULL |  |
| 3 | user\_id | Số nguyên | Khóa ngoại → USERS |  |
| 4 | delivery\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 5 | shipping\_address\_id | Số nguyên | Khóa ngoại → SHIPPING\_ADDRESSES |  |
| 6 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng ORDER\_ITEMS: Bảng trung gian chi tiết từng sản phẩm trong một đơn hàng thực phẩm, kèm số lượng và giá tại thời điểm mua.

**Bảng 6.36: Thuộc tính bảng ORDER\_ITEMS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | order\_item\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | order\_id | Số nguyên | Khóa ngoại → NUTRITION\_ORDERS, NOT NULL |  |
| 3 | product\_id | Số nguyên | Khóa ngoại → PRODUCTS, NOT NULL |  |
| 4 | quantity | Số nguyên | NOT NULL |  |
| 5 | price\_at\_purchase | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |

Ghi chú: việc thuê thiết bị (rental) không dùng bảng GEAR\_RENTALS riêng — đã được ghi nhận trong bảng GEAR\_TRANSACTIONS (Bảng 6.31) với cột `type = 'rental'`, dùng chung với giao dịch mua đứt để tránh trùng lặp dữ liệu ngày thuê/trạng thái.

Bảng GEAR\_RETURN\_INSPECTIONS *(Dự kiến — chưa triển khai)*: Thiết kế cho quy trình kiểm tra tình trạng thiết bị khi hội viên trả thiết bị đã thuê, theo BR-19 (hoàn cọc 100%/70%/0% theo tình trạng, xuất hóa đơn bồi thường khi hư nặng/mất). Ở phiên bản hiện tại, hàm xử lý trả gear mới chỉ đổi trạng thái giao dịch, chưa có bước đánh giá tình trạng vật lý.

**Bảng 6.37: Thuộc tính bảng GEAR\_RETURN\_INSPECTIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | inspection\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | transaction\_id | Số nguyên | Khóa ngoại → GEAR\_TRANSACTIONS, NOT NULL |  |
| 3 | inspected\_by | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 4 | condition\_on\_return | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 5 | penalty\_applied | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 6 | notes | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | inspected\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng MEMBERSHIP\_HISTORY: Lưu lịch sử thay đổi của hợp đồng hội viên (gia hạn, nâng cấp, huỷ) để phục vụ đối soát và chăm sóc khách hàng.

**Bảng 6.38: Thuộc tính bảng MEMBERSHIP\_HISTORY**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | history\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | membership\_id | Số nguyên | Khóa ngoại → GYM\_MEMBERSHIPS, NOT NULL |  |
| 3 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 4 | plan\_id | Số nguyên | Khóa ngoại → MEMBERSHIP\_PLANS, NOT NULL |  |
| 5 | invoice\_id | Số nguyên | Khóa ngoại → INVOICES |  |
| 6 | action\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 7 | old\_end\_date | Ngày (không giờ) | Có thể rỗng (NULL) |  |
| 8 | new\_end\_date | Ngày (không giờ) | Có thể rỗng (NULL) |  |
| 9 | price\_paid | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | Có thể rỗng (NULL) |  |
| 10 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

**6.1.5. Nhóm Đề xuất, CRM, Thử thách và Xã hội**

Bảng CHALLENGES: Danh mục các thử thách (challenge) toàn hệ thống với mục tiêu và phần thưởng.

**Bảng 6.39: Thuộc tính bảng CHALLENGES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | challenge\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | name | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 3 | challenge\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 4 | target\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 5 | target\_value | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL |  |
| 6 | fitcoin\_reward | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 7 | xp\_reward | Số nguyên | NOT NULL | Mặc định: 0 |
| 8 | start\_date | Ngày (không giờ) | NOT NULL |  |
| 9 | end\_date | Ngày (không giờ) | NOT NULL |  |

Bảng RECOMMENDATIONS: Lưu các đề xuất/cảnh báo tự động dành cho người dùng (ví dụ: nhắc tập lại, cảnh báo ngưng hoạt động) để đội chăm sóc khách hàng xử lý.

**Bảng 6.40: Thuộc tính bảng RECOMMENDATIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | recommendation\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | rule\_code | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 4 | priority | Số nguyên | NOT NULL | Mặc định: 0 |
| 5 | suggested\_action | Chuỗi ký tự, tối đa 255 ký tự | NOT NULL |  |
| 6 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |
| 7 | dismiss\_reason | Chuỗi ký tự, tối đa 255 ký tự | Có thể rỗng (NULL) |  |
| 8 | assigned\_staff\_id | Số nguyên | Khóa ngoại → USERS |  |
| 9 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 10 | updated\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng CARE\_FOLLOWUPS: Ghi nhận quá trình nhân viên chăm sóc khách hàng theo dõi và liên hệ với hội viên có nguy cơ rời bỏ.

**Bảng 6.41: Thuộc tính bảng CARE\_FOLLOWUPS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | followup\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | session\_id | Số nguyên | Khóa ngoại → WORKOUT\_SESSIONS |  |
| 4 | assigned\_staff\_id | Số nguyên | Khóa ngoại → USERS |  |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'pending' |
| 6 | notes | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 8 | completed\_at | Ngày giờ | Có thể rỗng (NULL) |  |

Bảng USER\_CHALLENGES: Bảng trung gian thể hiện người dùng tham gia thử thách nào và tiến độ hoàn thành.

**Bảng 6.42: Thuộc tính bảng USER\_CHALLENGES**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | user\_challenge\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | challenge\_id | Số nguyên | Khóa ngoại → CHALLENGES, NOT NULL |  |
| 4 | progress\_value | Số thập phân, 12 chữ số, 2 chữ số phần thập phân | NOT NULL | Mặc định: 0 |
| 5 | status | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL | Mặc định: 'in\_progress' |
| 6 | joined\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |
| 7 | completed\_at | Ngày giờ | Có thể rỗng (NULL) |  |

Bảng NOTIFICATIONS: Lưu các thông báo hệ thống gửi đến từng người dùng.

**Bảng 6.43: Thuộc tính bảng NOTIFICATIONS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | notification\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | title | Chuỗi ký tự, tối đa 150 ký tự | NOT NULL |  |
| 4 | content | Chuỗi ký tự, tối đa 500 ký tự | NOT NULL |  |
| 5 | is\_read | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: FALSE |
| 6 | notification\_type | Chuỗi ký tự, tối đa 50 ký tự | NOT NULL |  |
| 7 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

Bảng SOCIAL\_POSTS: Lưu các bài đăng chia sẻ hoạt động/thành tích của người dùng trên mạng xã hội nội bộ.

**Bảng 6.44: Thuộc tính bảng SOCIAL\_POSTS**

| STT | Tên thuộc tính | Kiểu dữ liệu | Ràng buộc | Ghi chú |
| :---- | :---- | :---- | :---- | :---- |
| 1 | post\_id | Số nguyên tự tăng (khóa chính) | Khóa chính |  |
| 2 | user\_id | Số nguyên | Khóa ngoại → USERS, NOT NULL |  |
| 3 | post\_type | Chuỗi ký tự, tối đa 30 ký tự | NOT NULL |  |
| 4 | achievement\_id | Số nguyên | Khóa ngoại → MILESTONE\_ACHIEVEMENTS |  |
| 5 | content | Chuỗi ký tự, tối đa 1000 ký tự | Có thể rỗng (NULL) |  |
| 6 | image\_url | Chuỗi ký tự, tối đa 500 ký tự | Có thể rỗng (NULL) |  |
| 7 | is\_public | Đúng/Sai (TRUE hoặc FALSE) | NOT NULL | Mặc định: TRUE |
| 8 | created\_at | Ngày giờ | NOT NULL | Mặc định: NOW() |

**6.2. Mối quan hệ giữa các thực thể**

Các mối quan hệ giữa thực thể được xác lập thông qua khóa ngoại (Foreign Key). Đa số là quan hệ Một-Nhiều (1:N); riêng các bảng FOLLOWS, PROGRAM\_EXERCISES, ORDER\_ITEMS và USER\_CHALLENGES đóng vai trò bảng trung gian, hiện thực hóa các quan hệ Nhiều-Nhiều (N:N) giữa hai thực thể liên quan. Chi tiết từng mối quan hệ được liệt kê trong bảng dưới đây.

**Bảng 6.45: Danh sách mối quan hệ giữa các thực thể**

| STT | Thực thể cha (1) | Thực thể con (N) | Cột khóa ngoại | Loại quan hệ |
| :---- | :---- | :---- | :---- | :---- |
| 1 | USERS | USERS | referred\_by | Một-Nhiều (1:N) |
| 2 | USERS | FITNESS\_PASSPORTS | user\_id | Một-Nhiều (1:N) |
| 3 | USERS | BODY\_METRICS | user\_id | Một-Nhiều (1:N) |
| 4 | USERS | BODY\_PHOTOS | user\_id | Một-Nhiều (1:N) |
| 5 | USERS | FOLLOWS | follower\_id | Một-Nhiều (1:N) |
| 6 | USERS | FOLLOWS | following\_id | Một-Nhiều (1:N) |
| 7 | USERS | MILESTONE\_ACHIEVEMENTS | user\_id | Một-Nhiều (1:N) |
| 8 | BADGES | MILESTONE\_ACHIEVEMENTS | badge\_id | Một-Nhiều (1:N) |
| 9 | USERS | FITCOIN\_TRANSACTIONS | user\_id | Một-Nhiều (1:N) |
| 10 | USERS | REFERRALS | referrer\_id | Một-Nhiều (1:N) |
| 11 | USERS | REFERRALS | friend\_user\_id | Một-Nhiều (1:N) |
| 12 | USERS | GYM\_MEMBERSHIPS | user\_id | Một-Nhiều (1:N) |
| 13 | MEMBERSHIP\_PLANS | GYM\_MEMBERSHIPS | plan\_id | Một-Nhiều (1:N) |
| 14 | GYMS | GYM\_MEMBERSHIPS | gym\_id | Một-Nhiều (1:N) |
| 15 | USERS | FREE\_TRIAL\_PASSES | user\_id | Một-Nhiều (1:N) |
| 16 | USERS | GYM\_TOURS | user\_id | Một-Nhiều (1:N) |
| 17 | GYM\_MEMBERSHIPS | MEMBERSHIP\_FREEZES | membership\_id | Một-Nhiều (1:N) |
| 18 | USERS | MEMBERSHIP\_FREEZES | approved\_by | Một-Nhiều (1:N) |
| 19 | WORKOUT\_PROGRAMS | PROGRAM\_DAYS | program\_id | Một-Nhiều (1:N) |
| 20 | PROGRAM\_DAYS | PROGRAM\_EXERCISES | day\_id | Một-Nhiều (1:N) |
| 21 | EXERCISES | PROGRAM\_EXERCISES | exercise\_id | Một-Nhiều (1:N) |
| 22 | USERS | MEMBER\_PROGRAMS | user\_id | Một-Nhiều (1:N) |
| 23 | WORKOUT\_PROGRAMS | MEMBER\_PROGRAMS | program\_id | Một-Nhiều (1:N) |
| 24 | USERS | WORKOUT\_SESSIONS | user\_id | Một-Nhiều (1:N) |
| 25 | MEMBER\_PROGRAMS | WORKOUT\_SESSIONS | member\_program\_id | Một-Nhiều (1:N) |
| 26 | USERS | CHECK\_INS | user\_id | Một-Nhiều (1:N) |
| 27 | GYMS | CHECK\_INS | gym\_id | Một-Nhiều (1:N) |
| 28 | GYM\_MEMBERSHIPS | CHECK\_INS | membership\_id | Một-Nhiều (1:N) |
| 29 | FREE\_TRIAL\_PASSES | CHECK\_INS | trial\_pass\_id | Một-Nhiều (1:N) |
| 30 | WORKOUT\_SESSIONS | EXERCISE\_LOGS | session\_id | Một-Nhiều (1:N) |
| 31 | EXERCISES | EXERCISE\_LOGS | exercise\_id | Một-Nhiều (1:N) |
| 32 | PROGRAM\_EXERCISES | EXERCISE\_LOGS | program\_exercise\_id | Một-Nhiều (1:N) |
| 33 | EXERCISE\_LOGS | SET\_LOGS | log\_id | Một-Nhiều (1:N) |
| 34 | USERS | PERSONAL\_RECORDS | user\_id | Một-Nhiều (1:N) |
| 35 | EXERCISES | PERSONAL\_RECORDS | exercise\_id | Một-Nhiều (1:N) |
| 36 | WORKOUT\_SESSIONS | PERSONAL\_RECORDS | session\_id | Một-Nhiều (1:N) |
| 37 | USERS | TRANSFORMATION\_GOALS | user\_id | Một-Nhiều (1:N) |
| 38 | USERS | GEAR\_ITEMS | current\_owner\_id | Một-Nhiều (1:N) |
| 39 | GEAR\_ITEMS | GEAR\_TRANSACTIONS | gear\_id | Một-Nhiều (1:N) |
| 40 | USERS | GEAR\_TRANSACTIONS | seller\_id | Một-Nhiều (1:N) |
| 41 | USERS | GEAR\_TRANSACTIONS | buyer\_id | Một-Nhiều (1:N) |
| 42 | GEAR\_ITEMS | GEAR\_LIFECYCLE | gear\_id | Một-Nhiều (1:N) |
| 43 | USERS | GEAR\_LIFECYCLE | owner\_id | Một-Nhiều (1:N) |
| 44 | GEAR\_TRANSACTIONS | GEAR\_RETURN\_INSPECTIONS | transaction\_id | Một-Nhiều (1:N) |
| 45 | USERS | GEAR\_RETURN\_INSPECTIONS | inspected\_by | Một-Nhiều (1:N) |
| 46 | PRODUCTS | INVENTORY | product\_id | Một-Nhiều (1:N) |
| 47 | USERS | SHIPPING\_ADDRESSES | user\_id | Một-Nhiều (1:N) |
| 48 | USERS | INVOICES | user\_id | Một-Nhiều (1:N) |
| 49 | INVOICES | NUTRITION\_ORDERS | invoice\_id | Một-Nhiều (1:N) |
| 50 | USERS | NUTRITION\_ORDERS | user\_id | Một-Nhiều (1:N) |
| 51 | SHIPPING\_ADDRESSES | NUTRITION\_ORDERS | shipping\_address\_id | Một-Nhiều (1:N) |
| 52 | NUTRITION\_ORDERS | ORDER\_ITEMS | order\_id | Một-Nhiều (1:N) |
| 53 | PRODUCTS | ORDER\_ITEMS | product\_id | Một-Nhiều (1:N) |
| 54 | GYM\_MEMBERSHIPS | MEMBERSHIP\_HISTORY | membership\_id | Một-Nhiều (1:N) |
| 55 | USERS | MEMBERSHIP\_HISTORY | user\_id | Một-Nhiều (1:N) |
| 56 | MEMBERSHIP\_PLANS | MEMBERSHIP\_HISTORY | plan\_id | Một-Nhiều (1:N) |
| 57 | INVOICES | MEMBERSHIP\_HISTORY | invoice\_id | Một-Nhiều (1:N) |
| 58 | USERS | RECOMMENDATIONS | user\_id | Một-Nhiều (1:N) |
| 59 | USERS | RECOMMENDATIONS | assigned\_staff\_id | Một-Nhiều (1:N) |
| 60 | USERS | CARE\_FOLLOWUPS | user\_id | Một-Nhiều (1:N) |
| 61 | WORKOUT\_SESSIONS | CARE\_FOLLOWUPS | session\_id | Một-Nhiều (1:N) |
| 62 | USERS | CARE\_FOLLOWUPS | assigned\_staff\_id | Một-Nhiều (1:N) |
| 63 | USERS | USER\_CHALLENGES | user\_id | Một-Nhiều (1:N) |
| 64 | CHALLENGES | USER\_CHALLENGES | challenge\_id | Một-Nhiều (1:N) |
| 65 | USERS | NOTIFICATIONS | user\_id | Một-Nhiều (1:N) |
| 66 | USERS | SOCIAL\_POSTS | user\_id | Một-Nhiều (1:N) |
| 67 | MILESTONE\_ACHIEVEMENTS | SOCIAL\_POSTS | achievement\_id | Một-Nhiều (1:N) |

Ngoài ra, bảng FOLLOWS có khóa chính phức hợp (follower\_id, following\_id), thể hiện quan hệ Nhiều-Nhiều giữa thực thể USERS với chính nó (người dùng theo dõi người dùng khác). Các bảng PROGRAM\_EXERCISES và ORDER\_ITEMS lần lượt liên kết EXERCISES với PROGRAM\_DAYS và PRODUCTS với NUTRITION\_ORDERS, hiện thực hóa quan hệ N:N giữa các cặp thực thể tương ứng thông qua hai khóa ngoại độc lập.

**6.3. Sơ đồ quan hệ thực thể (ERD)**

Sơ đồ quan hệ thực thể (Entity Relationship Diagram) của hệ thống FitFuel+ thể hiện đầy đủ 44 thực thể và 67 mối quan hệ khóa ngoại được mô tả ở mục 6.1 và 6.2. Do số lượng thực thể lớn, ERD được trình bày theo từng nhóm chức năng để đảm bảo khả năng đọc hiểu; quan hệ liên nhóm (ví dụ: USERS liên kết đến hầu hết các nhóm còn lại) được thể hiện thông qua cột "Thực thể cha" trong Bảng 6.45.

Nhóm 1 – Nhóm Định danh, Xã hội và Gamification: USERS, AUTH\_OTP, FITNESS\_PASSPORTS, BODY\_METRICS, BODY\_PHOTOS, FOLLOWS, BADGES, MILESTONE\_ACHIEVEMENTS, FITCOIN\_TRANSACTIONS, REFERRALS

Nhóm 2 – Nhóm Phòng gym, Hội viên và Check-in: GYMS, MEMBERSHIP\_PLANS, GYM\_MEMBERSHIPS, FREE\_TRIAL\_PASSES, GYM\_TOURS, MEMBERSHIP\_FREEZES

Nhóm 3 – Nhóm Giáo trình, Buổi tập và Kỷ lục cá nhân: EXERCISES, WORKOUT\_PROGRAMS, PROGRAM\_DAYS, PROGRAM\_EXERCISES, MEMBER\_PROGRAMS, WORKOUT\_SESSIONS, CHECK\_INS, EXERCISE\_LOGS, SET\_LOGS, PERSONAL\_RECORDS, TRANSFORMATION\_GOALS

Nhóm 4 – Nhóm Sản phẩm, Đơn hàng và Cho thuê thiết bị: PRODUCTS, INVENTORY, GEAR\_ITEMS, GEAR\_TRANSACTIONS, GEAR\_LIFECYCLE, SHIPPING\_ADDRESSES, INVOICES, NUTRITION\_ORDERS, ORDER\_ITEMS, GEAR\_RETURN\_INSPECTIONS (dự kiến), MEMBERSHIP\_HISTORY

Nhóm 5 – Nhóm Đề xuất, CRM, Thử thách và Xã hội: CHALLENGES, RECOMMENDATIONS, CARE\_FOLLOWUPS, USER\_CHALLENGES, NOTIFICATIONS, SOCIAL\_POSTS

**6.4. Định nghĩa kiểu dữ liệu**

Các kiểu dữ liệu PostgreSQL được sử dụng xuyên suốt cơ sở dữ liệu FitFuel+ được quy ước thống nhất như bảng dưới đây, nhằm đảm bảo tính nhất quán khi lưu trữ và xử lý dữ liệu.

**Bảng 6.46: Định nghĩa các kiểu dữ liệu sử dụng**

| Kiểu dữ liệu | Ý nghĩa / Cách dùng | Ví dụ trong schema |
| :---- | :---- | :---- |
| SERIAL | Số nguyên tự tăng, dùng làm khóa chính tự sinh giá trị, không cần ứng dụng tự cấp. | user\_id, session\_id, invoice\_id |
| VARCHAR(n) làm khóa chính | Chuỗi ký tự tự sinh phía ứng dụng (không dùng SERIAL) — áp dụng riêng cho GEAR\_ITEMS (`gear_id`, định dạng UUID) để mỗi thiết bị có mã định danh duy nhất, dễ hiển thị/tra cứu. | gear\_id VARCHAR(20) |
| INT | Số nguyên, dùng cho các giá trị đếm, số lượng hoặc khóa ngoại tham chiếu SERIAL. | xp\_total, quantity, target\_sets |
| VARCHAR(n) | Chuỗi ký tự có độ dài tối đa n, dùng cho văn bản ngắn (tên, email, trạng thái, URL). | email VARCHAR(255), role VARCHAR(30) |
| DECIMAL(p,s) | Số thập phân chính xác với p tổng số chữ số và s chữ số sau dấu thập phân, dùng cho tiền tệ và số đo cơ thể. | price DECIMAL(12,2), weight\_kg DECIMAL(5,2) |
| BOOLEAN | Giá trị luận lý TRUE/FALSE, dùng cho các cờ trạng thái bật/tắt. | is\_active, is\_pr, is\_public |
| DATE | Chỉ lưu ngày (năm-tháng-ngày), dùng khi không cần thông tin giờ. | start\_date, end\_date |
| TIMESTAMP | Lưu cả ngày và giờ, dùng cho các mốc thời gian cần độ chính xác theo giây. | created\_at, checkin\_time, achieved\_at |

