# 07. BIEU DO THUC THE LIEN KET
# (Entity Relationship Diagram - ERD)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich ky hieu ERD:

  +===============+
  |  TEN BANG     |    Hinh chu nhat: 1 Entity (thuc the / bang)
  |===============|
  | PK truong     |    PK = Primary Key (khoa chinh)
  | FK truong     |    FK = Foreign Key (khoa ngoai)
  |    truong     |    Truong binh thuong
  +===============+

  Ky hieu quan he (Crow's Foot Notation):
  ||----------||    Mot-Mot (1:1). Moi ben dung 1 ban ghi.
  ||----------o{    Mot-Nhieu (1:N). Ben trai 1, ben phai nhieu.
  }o----------o{    Nhieu-Nhieu (N:N). Ca 2 ben nhieu.

  Chi tiet ky hieu dau:
  ||    Bat buoc (exactly one)
  o|    Khong bat buoc hoac mot (zero or one)
  o{    Khong hoac nhieu (zero or many)
  |{    Mot hoac nhieu (one or many)

========================================================================

## 1. ERD TONG QUAN
========================================================================

He thong FitFuel+ co 18 entity (thuc the) chinh, chia thanh 5 nhom:

  Nhom 1 - Nguoi dung:     USERS, FITNESS_PASSPORT, FOLLOWS
  Nhom 2 - Gym Tracking:   WORKOUT_SESSIONS, EXERCISE_LOGS
  Nhom 3 - Food Order:     FOOD_PRODUCTS, FOOD_ORDERS, FOOD_REVIEWS
  Nhom 4 - Gear Hub:       GEAR_ITEMS, GEAR_LIFECYCLE, GEAR_TRANSACTIONS
  Nhom 5 - He thong:       GYMS, GYM_MEMBERSHIPS, CHALLENGES,
                            USER_CHALLENGES, BADGES, FITCOIN_TRANSACTIONS,
                            NOTIFICATIONS, SOCIAL_POSTS

========================================================================

## 2. ERD CHI TIET
========================================================================

------------------------------------------------------------------------
### 2.1. Nhom Nguoi dung
------------------------------------------------------------------------

```
+==========================+          +============================+
|         USERS            |          |     FITNESS_PASSPORT       |
|==========================|          |============================|
| PK  user_id        INT  |          | PK  passport_id      INT  |
|     email      VARCHAR   | ||----|| | FK  user_id          INT  |
|     phone      VARCHAR   |          |     total_sessions   INT  |
|     password_hash        |          |     total_volume  DECIMAL |
|               VARCHAR    |          |     longest_streak   INT  |
|     role         ENUM    |          |     body_weight_log  TEXT |
|     display_name VARCHAR |          |     body_photos      TEXT |
|     avatar_url  VARCHAR  |          |     milestone_badges TEXT |
|     fitness_goal  ENUM   |          |     is_public     BOOLEAN|
|     xp_total       INT  |          |     created_at  DATETIME |
|     current_level  INT  |          +============================+
|     current_streak INT  |
|     fitcoin_balance      |
|                DECIMAL   |
|     tdee           INT  |
|     referred_by    INT  |---+ (FK tu tham chieu chinh USERS)
|     created_at DATETIME |<--+
+==========================+
         |
         | (N:N thong qua FOLLOWS)
         v
+==========================+
|        FOLLOWS           |
|==========================|
| FK  follower_id     INT |----> USERS.user_id
| FK  following_id    INT |----> USERS.user_id
|     created_at  DATETIME|
+==========================+
  Ghi chu: PK la cap (follower_id, following_id)
```

Giai thich:
  - USERS la bang trung tam cua he thong, moi ban ghi la 1 nguoi dung.
  - FITNESS_PASSPORT quan he 1:1 voi USERS. Moi user co dung 1 Passport.
  - FOLLOWS la bang trung gian cho quan he N:N (user follow user khac).
  - referred_by la FK tro ve chinh bang USERS (tu tham chieu).

------------------------------------------------------------------------
### 2.2. Nhom Gym Tracking
------------------------------------------------------------------------

```
+==========================+          +============================+
|    WORKOUT_SESSIONS      |          |      EXERCISE_LOGS         |
|==========================|          |============================|
| PK  session_id      INT |          | PK  log_id           INT  |
| FK  user_id         INT | ||----o{ | FK  session_id       INT  |
| FK  gym_id          INT |          |     exercise_name VARCHAR  |
|     (nullable)          |          |     muscle_group     ENUM  |
|     date           DATE |          |     sets        TEXT(JSON) |
|     duration_min    INT |          |     is_pr        BOOLEAN  |
|     status         ENUM |          |     notes           TEXT  |
|     notes          TEXT |          |     created_at  DATETIME  |
|     created_at DATETIME |          +============================+
+==========================+

USERS ||----o{ WORKOUT_SESSIONS
  (1 user co nhieu session)

WORKOUT_SESSIONS ||----o{ EXERCISE_LOGS
  (1 session co nhieu exercise log)
```

Giai thich:
  - WORKOUT_SESSIONS luu moi buoi tap. gym_id co the null (tap o nha).
  - EXERCISE_LOGS luu chi tiet tung bai tap trong 1 session.
  - sets la JSON array: [{"reps": 10, "weight": 60}, {"reps": 8, "weight": 65}]
  - is_pr = true khi set nay la Personal Record moi.

------------------------------------------------------------------------
### 2.3. Nhom Food Order
------------------------------------------------------------------------

```
+==========================+
|     FOOD_PRODUCTS        |
|==========================|
| PK  product_id      INT |
| FK  vendor_id       INT |----> USERS.user_id (role=vendor)
|     name        VARCHAR  |
|     description    TEXT  |
|     price       DECIMAL  |
|     calories        INT  |
|     protein_g   DECIMAL  |
|     carb_g      DECIMAL  |
|     fat_g       DECIMAL  |
|     ingredients     TEXT |
|     allergens       TEXT |
|     images          TEXT |
|     is_available BOOLEAN |
|     avg_rating  DECIMAL  |
|     total_reviews   INT  |
|     created_at DATETIME  |
+==========================+
         |
         | 1:N
         v
+==========================+          +============================+
|      FOOD_ORDERS         |          |      FOOD_REVIEWS          |
|==========================|          |============================|
| PK  order_id        INT |          | PK  review_id        INT  |
| FK  user_id         INT |          | FK  product_id       INT  |
|     (nullable, null     |          | FK  user_id          INT  |
|      khi la Guest)      |          |     rating       INT(1-5) |
|     guest_phone VARCHAR |          |     comment          TEXT  |
| FK  vendor_id       INT |          |     photos           TEXT  |
|     items      TEXT(JSON)|          |     helpful_votes    INT  |
|     total_amount DECIMAL |          |     created_at   DATETIME |
|     fitcoin_used DECIMAL |          +============================+
|     delivery_address     |
|               VARCHAR    |
|     delivery_time VARCHAR|
|     status         ENUM  |
|     is_meal_prep BOOLEAN |
|     created_at DATETIME  |
+==========================+

USERS ||----o{ FOOD_PRODUCTS  (1 vendor dang nhieu san pham)
USERS ||----o{ FOOD_ORDERS    (1 user dat nhieu don)
USERS ||----o{ FOOD_REVIEWS   (1 user viet nhieu review)
FOOD_PRODUCTS ||----o{ FOOD_REVIEWS  (1 san pham co nhieu review)
```

Giai thich:
  - FOOD_ORDERS.user_id co the NULL khi la Guest checkout.
    Luc do, guest_phone duoc dung de dinh danh.
  - items la JSON: [{"product_id": 1, "qty": 2, "size": "M", "price": 55000}]
  - status trai qua cac buoc: pending -> confirmed -> preparing ->
    delivering -> delivered (hoac cancelled).

------------------------------------------------------------------------
### 2.4. Nhom Gear Hub
------------------------------------------------------------------------

```
+==========================+
|       GEAR_ITEMS         |
|==========================|
| PK  gear_id    VARCHAR   |
|     (GEAR-XXXX-XXXX)     |
| FK  current_owner_id INT |----> USERS.user_id
|     category       ENUM  |
|     name        VARCHAR   |
|     description    TEXT  |
|     condition_rating INT |
|     condition_notes TEXT |
|     images          TEXT |
|     listing_type   ENUM  |
|     sell_price  DECIMAL  |
|     rent_price_day       |
|                DECIMAL   |
|     rent_price_week      |
|                DECIMAL   |
|     deposit_amount       |
|                DECIMAL   |
|     qr_code_url VARCHAR  |
|     is_available BOOLEAN |
|     created_at DATETIME  |
+==========================+
         |                          |
         | 1:N                      | 1:N
         v                          v
+==========================+  +============================+
|    GEAR_LIFECYCLE        |  |    GEAR_TRANSACTIONS       |
|==========================|  |============================|
| PK  lifecycle_id    INT |  | PK  transaction_id    INT  |
| FK  gear_id    VARCHAR  |  | FK  gear_id      VARCHAR   |
| FK  owner_id       INT |  | FK  seller_id        INT  |
|     action         ENUM |  | FK  buyer_id         INT  |
|     condition_at_time   |  |     type             ENUM  |
|                    INT  |  |     amount        DECIMAL  |
|     notes          TEXT |  |     deposit       DECIMAL  |
|     photos          TEXT |  |     fitcoin_used DECIMAL  |
|     timestamp  DATETIME |  |     rental_start    DATE  |
+==========================+  |     rental_end      DATE  |
                              |     status          ENUM  |
                              |     created_at  DATETIME  |
                              +============================+

USERS ||----o{ GEAR_ITEMS          (1 user so huu nhieu gear)
GEAR_ITEMS ||----o{ GEAR_LIFECYCLE (1 gear co nhieu lifecycle entry)
GEAR_ITEMS ||----o{ GEAR_TRANSACTIONS (1 gear co nhieu giao dich)
USERS ||----o{ GEAR_TRANSACTIONS   (seller)
USERS ||----o{ GEAR_TRANSACTIONS   (buyer)
```

Giai thich:
  - GEAR_ITEMS.gear_id la VARCHAR, dang GEAR-XXXX-XXXX. Day la PK.
  - GEAR_LIFECYCLE la bang quan trong nhat cua Gear Hub. Moi lan gear
    doi tay hoac thay doi trang thai, 1 entry moi duoc tao.
    action co the la: listed, sold, rented, returned, relisted.
  - GEAR_TRANSACTIONS ghi nhan giao dich tai chinh (tien/FitCoin).
  - current_owner_id trong GEAR_ITEMS luon tro den chu nhan hien tai.

------------------------------------------------------------------------
### 2.5. Nhom He thong
------------------------------------------------------------------------

```
+==========================+          +============================+
|          GYMS            |          |     GYM_MEMBERSHIPS        |
|==========================|          |============================|
| PK  gym_id          INT |          | PK  membership_id    INT  |
| FK  owner_id        INT | ||----o{ | FK  user_id          INT  |
|     name        VARCHAR  |          | FK  gym_id           INT  |
|     address     VARCHAR  |          |     plan_name    VARCHAR  |
|     phone       VARCHAR  |          |     start_date      DATE  |
|     opening_hours   TEXT |          |     end_date        DATE  |
|     services        TEXT |          |     status          ENUM  |
|     membership_plans     |          |     auto_renew   BOOLEAN  |
|                    TEXT  |          |     payment_method VARCHAR|
|     logo_url    VARCHAR  |          |     created_at  DATETIME  |
|     created_at DATETIME  |          +============================+
+==========================+

USERS ||----o{ GYMS            (1 owner nhieu phong tap)
USERS ||----o{ GYM_MEMBERSHIPS (1 user nhieu membership)
GYMS  ||----o{ GYM_MEMBERSHIPS (1 gym nhieu member)


+==========================+          +============================+
|       CHALLENGES         |          |     USER_CHALLENGES        |
|==========================|          |============================|
| PK  challenge_id    INT |          | PK  id               INT  |
|     title       VARCHAR  | ||----o{ | FK  user_id          INT  |
|     description    TEXT  |          | FK  challenge_id     INT  |
|     type           ENUM  |          |     progress         TEXT  |
|     criteria        TEXT |          |     status           ENUM  |
|     reward_xp       INT |          |     completed_at DATETIME  |
|     reward_fitcoin       |          +============================+
|                DECIMAL   |
|     start_date     DATE  |
|     end_date       DATE  |
|     is_active   BOOLEAN  |
+==========================+

USERS ||----o{ USER_CHALLENGES
CHALLENGES ||----o{ USER_CHALLENGES


+==========================+          +============================+
|         BADGES           |          |  FITCOIN_TRANSACTIONS      |
|==========================|          |============================|
| PK  badge_id        INT |          | PK  txn_id           INT  |
|     name        VARCHAR  |          | FK  user_id          INT  |
|     description    TEXT  |          |     type             ENUM  |
|     icon_url    VARCHAR  |          |     amount        DECIMAL  |
|     criteria        TEXT |          |     source           ENUM  |
|     category       ENUM  |          |     reference_id     INT  |
+==========================+          |     created_at   DATETIME  |
                                      +============================+

USERS ||----o{ FITCOIN_TRANSACTIONS


+==========================+          +============================+
|     SOCIAL_POSTS         |          |      NOTIFICATIONS         |
|==========================|          |============================|
| PK  post_id         INT |          | PK  notification_id  INT  |
| FK  user_id         INT |          | FK  user_id          INT  |
|     type           ENUM  |          |     type             ENUM  |
|     content        TEXT  |          |     title        VARCHAR  |
|     media_urls      TEXT |          |     message          TEXT  |
|     linked_data     TEXT |          |     is_read      BOOLEAN  |
|     likes_count     INT |          |     action_url   VARCHAR  |
|     comments_count  INT |          |     created_at   DATETIME  |
|     created_at DATETIME |          +============================+
+==========================+

USERS ||----o{ SOCIAL_POSTS
USERS ||----o{ NOTIFICATIONS
```

========================================================================

## 3. TONG HOP QUAN HE GIUA CAC ENTITY
========================================================================

STT | Nguồn → Đích                   | Loại | Mô tả chi tiết nghiệp vụ
----|----------------------------------|------|----------------------------------------------------
1   | USERS → FITNESS_PASSPORT         | 1:1  | Mỗi user (đã đăng ký) sở hữu 1 hồ sơ thể hình lưu tổng volume, streak, badge.
2   | USERS → FOLLOWS                  | N:N  | Người dùng follow nhau (quản lý qua bảng trung gian).
3   | USERS → WORKOUT_SESSIONS         | 1:N  | Người dùng tự tạo và lưu nhiều buổi tập. Không thông qua PT.
4   | WORKOUT_SESSIONS → EXERCISE_LOGS | 1:N  | Một buổi tập chứa nhiều bài tập (Set/Rep/Weight lưu trong JSON).
5   | GYMS → WORKOUT_SESSIONS          | 1:N  | Buổi tập liên kết với phòng Gym nếu có check-in.
6   | USERS (Vendor) → FOOD_PRODUCTS   | 1:N  | Nhà cung cấp đăng bán món ăn. Bếp thuộc Vendor, không thuộc phòng Gym.
7   | USERS → FOOD_ORDERS              | 1:N  | Một người dùng đặt nhiều đơn hàng (Guest dùng SĐT).
8   | FOOD_PRODUCTS → FOOD_ORDERS      | N:N  | Món ăn nằm trong đơn hàng. Lưu siêu việt qua mảng JSON ở cột items của Order.
9   | FOOD_PRODUCTS → FOOD_REVIEWS     | 1:N  | Một món ăn có nhiều đánh giá từ người dùng.
10  | USERS → GEAR_ITEMS               | 1:N  | Gym Owner/Member sở hữu/ký gửi nhiều thiết bị (current_owner_id).
11  | GEAR_ITEMS → GEAR_LIFECYCLE      | 1:N  | Vòng đời thiết bị (Ký gửi, Cho thuê, Trả lại, Bán). Append-only.
12  | GEAR_ITEMS → GEAR_TRANSACTIONS   | 1:N  | Một thiết bị phát sinh nhiều giao dịch tài chính theo thời gian.
13  | USERS → GEAR_TRANSACTIONS        | 1:N  | Người dùng có thể là Seller hoặc Buyer trong nhiều giao dịch.
14  | USERS → FITCOIN_TRANSACTIONS     | 1:N  | Quản lý biến động ví tiền ảo (nhận, tiêu).
15  | CHALLENGES → USER_CHALLENGES     | 1:N  | Một thử thách có nhiều người tham gia.
16  | USERS → USER_CHALLENGES          | 1:N  | Một người tham gia nhiều thử thách.
17  | USERS (Owner) → GYMS             | 1:N  | Chủ doanh nghiệp sở hữu nhiều chi nhánh Gym.
18  | GYMS → GYM_MEMBERSHIPS           | 1:N  | Một phòng Gym cung cấp nhiều gói hội viên.
19  | USERS → GYM_MEMBERSHIPS          | 1:N  | Người dùng mua nhiều thẻ hội viên.
20  | USERS → NOTIFICATIONS            | 1:N  | Người dùng nhận nhiều thông báo hệ thống.
21  | USERS → SOCIAL_POSTS             | 1:N  | Người dùng đăng nhiều bài viết tự động khi phá PR/Streak.
========================================================================
KET THUC FILE 07
========================================================================
