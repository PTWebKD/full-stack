# 07. BIEU DO THUC THE LIEN KET
# (Entity Relationship Diagram - ERD)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: 01/07/2026 — Dong nhat ten bang va truong voi code thuc te)

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

He thong FitFuel+ (Gym Management System) co 39 entity, chia thanh 10 nhom:

  Nhom 1 - Nguoi dung:       USERS, FITNESS_PASSPORT, FOLLOWS
  Nhom 2 - Gym Tracking:     WORKOUT_SESSIONS, EXERCISE_LOGS, CHECK_INS
  Nhom 3 - Membership:       GYMS, MEMBERSHIP_PLANS, GYM_MEMBERSHIPS,
                              MEMBERSHIP_HISTORY, INVOICES
  Nhom 4 - Nutrition:        NUTRITION_PRODUCTS, NUTRITION_ORDERS,
                              NUTRITION_ORDER_ITEMS, INVENTORY
  Nhom 5 - AI Retention:     RECOMMENDATIONS, MEMBER_CARE_LOGS
  Nhom 6 - He thong:         CHALLENGES, USER_CHALLENGES, BADGES,
                              USER_BADGES, FITCOIN_TRANSACTIONS,
                              NOTIFICATIONS, SOCIAL_POSTS
  Nhom 7 - Transformation:   TRANSFORMATION_GOALS, WORKOUT_PROGRAMS,
                              PROGRAM_DAYS, PROGRAM_EXERCISES,
                              MEMBER_PROGRAMS, BODY_METRICS,
                              PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS
  Nhom 8 - Gear:             gear_items, gear_transactions, gear_lifecycle
  Nhom 9 - Guest & Voucher:  guests, vouchers, guest_vouchers
  Nhom 10 - Delivery:        SHIPPING_ADDRESSES

  LUU Y:
  - ASSETS, LOCKERS, ASSET_ASSIGNMENTS, ASSET_PENALTIES: DA XOA (locker/khan la do ca nhan)
  - PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS: DA XOA (thay the boi Transformation Journey Engine)
  - MEMBERSHIP_PLANS: chi con 2 goi (Goi Thang, Goi Nam), quyen loi giong nhau
  - gear_items: ten bang thuc te trong DB (ERD cu viet sai la GEAR_PRODUCTS)
  - gear_transactions: ten bang thuc te (ERD cu viet sai la GEAR_RENTALS); chua ca giao dich mua va thue
  - gear_lifecycle: bang lich su vong doi gear (listed/sold/rented/returned/relisted)
  - guests + vouchers + guest_vouchers: phan he Guest OTP checkout
  - SHIPPING_ADDRESSES: luu dia chi giao hang ca nhan cua Member
  - USER_BADGES: bang trung gian N-N moi them (01/07/2026) giua USERS va BADGES,
    thay the cho cach luu cu (nhet badge vao cot JSON milestone_badges cua
    FITNESS_PASSPORT khong co FK chuan). Cung cau truc voi USER_CHALLENGES.
  - 05/07/2026: da doi soat va sua lai docs/08_Data_Dictionary.md cho khop tuyet doi
    39/39 bang voi file nay (truoc do 08 con sot 4 bang Asset&Amenities da xoa, sai
    ten+cau truc 2 bang Gear, thieu gear_lifecycle va ca 3 bang Guest & Voucher).

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
|     (member/gym_owner)   |          |     body_photos      TEXT |
|     display_name VARCHAR |          |     milestone_badges TEXT |
|     avatar_url  VARCHAR  |          |     is_public     BOOLEAN |
|     fitness_goal  ENUM   |          |     created_at  DATETIME  |
|     height_cm      INT  |          +============================+
|     weight_kg   DECIMAL  |
|     xp_total       INT  |
|     current_level  INT  |
|     current_streak INT  |
|     fitcoin_balance      |
|                DECIMAL   |
|     referred_by    INT  |----> USERS.user_id (tu tham chieu)
|     is_active   BOOLEAN  |
|     created_at DATETIME  |
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
  - USERS la bang trung tam. role chi co 2 gia tri: 'member' va 'gym_owner'.
  - Khong co role 'vendor' (da loai bo vendor ngoai).
  - FITNESS_PASSPORT quan he 1:1 voi USERS.
  - referred_by la FK tro ve chinh bang USERS (tu tham chieu).

------------------------------------------------------------------------
### 2.2. Nhom Gym Tracking va Check-in
------------------------------------------------------------------------

```
+==========================+          +============================+
|    WORKOUT_SESSIONS      |          |      EXERCISE_LOGS         |
|==========================|          |============================|
| PK  session_id      INT |          | PK  log_id           INT  |
| FK  user_id         INT | ||----o{ | FK  session_id       INT  |
| FK  gym_id          INT |          |     exercise_name VARCHAR  |
|     date           DATE |          |     muscle_group     ENUM  |
|     duration_min    INT |          |     sets        TEXT(JSON) |
|     status         ENUM |          |     is_pr        BOOLEAN  |
|     notes          TEXT |          |     notes           TEXT  |
|     created_at DATETIME |          |     created_at  DATETIME  |
+==========================+          +============================+

USERS ||----o{ WORKOUT_SESSIONS
WORKOUT_SESSIONS ||----o{ EXERCISE_LOGS

+==========================+
|        CHECK_INS         |
|==========================|
| PK  checkin_id      INT |
| FK  user_id         INT |----> USERS.user_id
| FK  gym_id          INT |----> GYMS.gym_id
| FK  membership_id   INT |----> GYM_MEMBERSHIPS.membership_id
|     checkin_time DATETIME|
|     checkout_time        |
|               DATETIME   |
|     method       VARCHAR  |
|     (qr / manual)        |
|     notes           TEXT |
+==========================+

USERS ||----o{ CHECK_INS
GYMS  ||----o{ CHECK_INS
GYM_MEMBERSHIPS ||----o{ CHECK_INS
```

Giai thich:
  - CHECK_INS ghi nhan moi luot vao/ra cua member.
  - Lien ket voi GYM_MEMBERSHIPS de xac nhan goi tap con hieu luc.
  - checkout_time ghi khi member ra khoi phong tap.

------------------------------------------------------------------------
### 2.3. Nhom Membership Lifecycle
------------------------------------------------------------------------

```
+==========================+          +============================+
|          GYMS            |          |     MEMBERSHIP_PLANS       |
|==========================|          |============================|
| PK  gym_id          INT |          | PK  plan_id          INT  |
|     (luon = 1)           |          |     name         VARCHAR  |
|     name        VARCHAR  |          |     duration_days    INT  |
|     address     VARCHAR  |          |     price_monthly  DECIMAL|
|     phone       VARCHAR  |          |     price_annual  DECIMAL |
|     opening_hours   TEXT |          |     amenity_towel        |
|     logo_url    VARCHAR  |          |               BOOLEAN     |
|     created_at DATETIME  |          |     amenity_locker       |
+==========================+          |               BOOLEAN     |
                                      |     amenity_equipment    |
GYMS chi co DUY NHAT 1 dong          |               BOOLEAN     |
(single-tenant)                       |     pt_sessions_included |
                                      |               INT         |
                                      |     is_active   BOOLEAN  |
                                      |     created_at DATETIME  |
                                      +============================+

+==========================+          +============================+
|     GYM_MEMBERSHIPS      |          |    MEMBERSHIP_HISTORY      |
|==========================|          |============================|
| PK  membership_id   INT |          | PK  history_id       INT  |
| FK  user_id         INT | ||----o{ | FK  membership_id    INT  |
| FK  gym_id          INT |          |     action           ENUM  |
| FK  plan_id         INT |          |     (register/renew/ |
|     start_date     DATE |          |      upgrade/suspend)|
|     end_date       DATE |          | FK  plan_id_from     INT  |
|     status         ENUM |          |     (null neu dang ky)|
|     (active/expired/     |          | FK  plan_id_to       INT  |
|      suspended/cancelled)|          |     amount_paid   DECIMAL |
|     notes          TEXT |          |     payment_method VARCHAR |
|     created_at DATETIME |          |     note             TEXT  |
+==========================+          |     created_at  DATETIME  |
                                      +============================+

USERS ||----o{ GYM_MEMBERSHIPS
GYMS  ||----o{ GYM_MEMBERSHIPS
MEMBERSHIP_PLANS ||----o{ GYM_MEMBERSHIPS
GYM_MEMBERSHIPS ||----o{ MEMBERSHIP_HISTORY

+==========================+
|        INVOICES          |
|==========================|
| PK  invoice_id      INT |
| FK  user_id         INT |
|     service_type   ENUM |
|     (membership/        |
|      nutrition/         |
|      gear_sale/         |
|      gear_rental)       |
| FK  reference_id    INT |
|     (membership_id,     |
|      order_id, etc.)    |
|     total_amount DECIMAL |
|     fitcoin_used DECIMAL |
|     payment_method      |
|               VARCHAR   |
|     payment_status ENUM |
|     (pending/paid/fail) |
|     delivery_type  ENUM |
|     (pickup/delivery)   |
|  FK shipping_address_id |
|                    INT  |
|  guest_delivery_address |
|                   TEXT  |
|     shipping_fee DECIMAL|
|     tracking_code       |
|               VARCHAR   |
|     shipping_provider   |
|     ENUM(GHN/Ahamove)  |
|     delivery_status ENUM|
|     created_at DATETIME |
+==========================+

USERS ||----o{ INVOICES
```

Giai thich:
  - GYMS chi co 1 dong du lieu (single-tenant). Khong co owner_id FK.
  - MEMBERSHIP_PLANS chi co 2 ban ghi: Goi Thang (1 thang) va Goi Nam (12 thang).
    Quyen loi y het nhau.
  - GYM_MEMBERSHIPS la goi tap hoi vien dang su dung/da dung.
  - MEMBERSHIP_HISTORY ghi lai toan bo lich su gia han, nang cap, bao luu.
  - INVOICES la hoa don hop nhat cho moi loai giao dich.

------------------------------------------------------------------------
### 2.4. Nhom Nutrition (Ban dinh duong noi bo)
------------------------------------------------------------------------

```
+==========================+
|   NUTRITION_PRODUCTS     |
|==========================|
| PK  product_id      INT |
|     name        VARCHAR  |
|     description    TEXT  |
|     category      ENUM  |
|     (protein/drink/snack |
|      /meal/supplement)   |
|     price       DECIMAL  |
|     calories        INT  |
|     protein_g   DECIMAL  |
|     carb_g      DECIMAL  |
|     fat_g       DECIMAL  |
|     allergens       TEXT |
|     image_url   VARCHAR  |
|     is_available BOOLEAN |
|     low_stock_threshold  |
|                    INT   |
|     created_at DATETIME  |
+==========================+
         |
         | 1:N (thong qua NUTRITION_ORDER_ITEMS)
         v
+==========================+          +============================+
|    NUTRITION_ORDERS      |          |  NUTRITION_ORDER_ITEMS     |
|==========================|          |============================|
| PK  order_id        INT |          | PK  item_id          INT  |
| FK  user_id         INT |          | FK  order_id         INT  |
| FK  guest_id        INT |          | FK  product_id       INT  |
|     (NULL neu member)   |          |     quantity           INT |
| FK  created_by      INT |          |     unit_price    DECIMAL  |
|     (nhan vien ban)     |          |     line_total    DECIMAL  |
|     order_type    ENUM  |          +============================+
|     (pos_sale /         |
|      pre_order /        |
|      delivery_order)    |
|     delivery_type  ENUM |
|     (pickup/delivery)   |
|  FK shipping_address_id |
|                    INT  |
|  guest_delivery_address |
|                   TEXT  |
|     shipping_fee DECIMAL|
|     tracking_code       |
|               VARCHAR   |
|     shipping_provider   |
|     ENUM(GHN/Ahamove)  |
|     status        ENUM  |
|     (pending/preparing/ |
|      ready/shipped/     |
|      delivering/done/   |
|      cancelled)         |
|     total_amount DECIMAL|
|     fitcoin_used DECIMAL|
| FK  invoice_id      INT |
|     notes          TEXT |
|     created_at DATETIME |
+==========================+

USERS  ||----o{ NUTRITION_ORDERS      (member mua hang)
guests ||----o{ NUTRITION_ORDERS      (guest OTP mua hang)
USERS  ||----o{ NUTRITION_ORDERS      (nhan vien tao don)
NUTRITION_ORDERS ||----o{ NUTRITION_ORDER_ITEMS
NUTRITION_PRODUCTS ||----o{ NUTRITION_ORDER_ITEMS

+==========================+
|        INVENTORY         |
|==========================|
| PK  inventory_id    INT |
| FK  product_id      INT |----> NUTRITION_PRODUCTS.product_id
|     quantity_in_stock    |
|                    INT   |
|     last_updated DATETIME|
|     note           TEXT  |
+==========================+

NUTRITION_PRODUCTS ||----|| INVENTORY  (1:1 — moi san pham 1 dong ton kho)
```

Giai thich:
  - Khong co vendor_id. NUTRITION_PRODUCTS la tai san noi bo cua phong tap.
  - order_type = 'pos_sale': Nhan vien ban tai quay.
  - order_type = 'pre_order': Member dat truoc sau buoi tap.
  - order_type = 'delivery_order': Don giao hang online.
  - guest_id NULL khi la member da dang nhap; co gia tri khi la guest OTP.
  - INVENTORY theo doi ton kho, canh bao khi < low_stock_threshold.

------------------------------------------------------------------------
### 2.5. Nhom Asset & Amenities (Tai san va tien ich)
------------------------------------------------------------------------

*(Nhom nay da bi xoa khoi schema. ASSETS, LOCKERS, ASSET_ASSIGNMENTS, ASSET_PENALTIES
khong con ton tai. Locker va khan la do ca nhan cua member, khong quan ly trong he thong.
Cho thue thiet bi duoc thay the boi Nhom 8 — Gear.)*

------------------------------------------------------------------------
### 2.6. Nhom AI Retention
------------------------------------------------------------------------

*(PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS da bi xoa. Phan he PT thay the boi
Transformation Journey Engine — Nhom 7.)*

```
+==========================+          +============================+
|     RECOMMENDATIONS      |          |    MEMBER_CARE_LOGS        |
|==========================|          |============================|
| PK  rec_id          INT |          | PK  care_log_id      INT  |
| FK  user_id         INT |          | FK  rec_id           INT  |
|     recommendation_type  |          | FK  staff_id         INT  |
|               ENUM       |          |     action_taken     TEXT |
|     (renew_reminder/    |          |     result           ENUM  |
|      inactive_alert/    |          |     (renewed/declined/     |
|      upsell_plan/       |          |      unreachable/other)    |
|      upsell_pt/         |          |     notes            TEXT  |
|      upsell_nutrition/  |          |     created_at   DATETIME  |
|      inactive_program/  |          +============================+
|      goal_achieved_     |
|       upsell/           |
|      technique_issue_   |
|       upsell_pt)        |
|     priority      ENUM  |
|     (high/medium/low)   |
|     suggested_action TEXT|
|     status        ENUM  |
|     (pending/handled/   |
|      dismissed)         |
|     created_at DATETIME |
|     resolved_at DATETIME|
+==========================+

USERS ||----o{ RECOMMENDATIONS
RECOMMENDATIONS ||----o{ MEMBER_CARE_LOGS
```

Giai thich:
  - RECOMMENDATIONS: hang doi AI care queue.
  - MEMBER_CARE_LOGS: ghi nhan nhan vien da xu ly recommendation nao the nao.

------------------------------------------------------------------------
### 2.7. Nhom He thong (Gamification, Payment, Social)
------------------------------------------------------------------------

```
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
|         BADGES           |          |       USER_BADGES          |
|==========================|          |============================|
| PK  badge_id        INT |          | PK  id                INT  |
|     name        VARCHAR  | ||----o{ | FK  user_id          INT  |
|     description    TEXT  |          | FK  badge_id          INT  |
|     icon_url    VARCHAR  |          |     earned_at    DATETIME  |
|     criteria        TEXT |          +============================+
|     category       ENUM  |
+==========================+          +============================+
                                      |  FITCOIN_TRANSACTIONS      |
                                      |============================|
                                      | PK  txn_id           INT  |
                                      | FK  user_id          INT  |
                                      |     type             ENUM  |
                                      |     (earn/spend)          |
                                      |     amount        DECIMAL  |
                                      |     source           ENUM  |
                                      |     (streak/challenge/    |
                                      |      referral/deposit/    |
                                      |      membership_bonus)    |
                                      |     reference_id     INT  |
                                      |     created_at   DATETIME  |
                                      +============================+

USERS ||----o{ USER_BADGES
BADGES ||----o{ USER_BADGES
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
|     created_at DATETIME |          |     created_at   DATETIME  |
+==========================+          +============================+

USERS ||----o{ SOCIAL_POSTS
USERS ||----o{ NOTIFICATIONS
```

------------------------------------------------------------------------
### 2.8. Nhom Transformation Journey Engine
------------------------------------------------------------------------

```
+============================+          +=============================+
|   TRANSFORMATION_GOALS     |          |      WORKOUT_PROGRAMS       |
|============================|          |=============================|
| PK  goal_id          INT  |          | PK  program_id        INT  |
| FK  user_id          INT  |          |     gym_id            INT  |
|     goal_type        ENUM |          |     (luon = 1)             |
|     (muscle_gain/fat_loss/ |          |     name          VARCHAR  |
|      maintain/strength)   |          |     goal_type         ENUM |
|     target_desc   VARCHAR  |          |     level             ENUM  |
|     target_value  DECIMAL  |          |     (beginner/            |
|     target_metric   ENUM  |          |      intermediate/advanced)|
|     deadline        DATE  |          |     duration_weeks    INT  |
|     status          ENUM  |          |     days_per_week     INT  |
|     (active/achieved/     |          |     description      TEXT  |
|      abandoned/expired)   |          |     is_active     BOOLEAN  |
|     created_at   DATETIME |          +=============================+
+============================+                    |
         |                                        | 1:N
         |                                        v
         |                           +============================+
         |                           |       PROGRAM_DAYS         |
         |                           |============================|
         |                           | PK  day_id          INT   |
         |                           | FK  program_id      INT   |
         |                           |     week_number     INT   |
         |                           |     day_number      INT   |
         |                           |     session_name VARCHAR  |
         |                           |     muscle_focus   JSON   |
         |                           |     is_rest_day BOOLEAN   |
         |                           +============================+
         |                                        |
         |                                        | 1:N
         |                                        v
         |                           +============================+
         |                           |     PROGRAM_EXERCISES      |
         |                           |============================|
         |                           | PK  exercise_id     INT   |
         |                           | FK  day_id          INT   |
         |                           |     exercise_name VARCHAR  |
         |                           |     muscle_group   ENUM   |
         |                           |     target_sets     INT   |
         |                           |     target_reps_min INT   |
         |                           |     target_reps_max INT   |
         |                           |     target_rpe   DECIMAL  |
         |                           |     rest_seconds    INT   |
         |                           |     order_in_day    INT   |
         |                           |     notes          TEXT   |
         |                           +============================+
         |
         | (MEMBER_PROGRAMS ket noi USERS <-> WORKOUT_PROGRAMS <-> TRANSFORMATION_GOALS)
         v
+============================+
|      MEMBER_PROGRAMS       |
|============================|
| PK  member_program_id INT |
| FK  user_id         INT   |----> USERS.user_id
| FK  program_id      INT   |----> WORKOUT_PROGRAMS.program_id
| FK  goal_id         INT   |----> TRANSFORMATION_GOALS.goal_id
|     start_date      DATE  |
|     expected_end_date DATE|
|     current_week    INT   |
|     status          ENUM  |
|     (active/completed/    |
|      abandoned/paused)    |
|     completion_pct DECIMAL|
|     created_at  DATETIME  |
+============================+

USERS ||----o{ TRANSFORMATION_GOALS
WORKOUT_PROGRAMS ||----o{ PROGRAM_DAYS
PROGRAM_DAYS ||----o{ PROGRAM_EXERCISES
USERS ||----o{ MEMBER_PROGRAMS
WORKOUT_PROGRAMS ||----o{ MEMBER_PROGRAMS
TRANSFORMATION_GOALS ||----o{ MEMBER_PROGRAMS

+============================+          +=============================+
|       BODY_METRICS         |          |      PERSONAL_RECORDS       |
|============================|          |=============================|
| PK  metric_id        INT  |          | PK  pr_id            INT   |
| FK  user_id          INT  |          | FK  user_id          INT   |
|     recorded_at  DATETIME |          |     exercise_name VARCHAR  |
|     weight_kg    DECIMAL  |          |     pr_type          ENUM  |
|     body_fat_pct DECIMAL  |          |     (max_weight/max_reps/  |
|     muscle_mass_kg DECIMAL|          |      max_volume)           |
|     waist_cm     DECIMAL  |          |     pr_value      DECIMAL  |
|     chest_cm     DECIMAL  |          |     previous_value DECIMAL |
|     arm_cm       DECIMAL  |          |     improvement_pct DECIMAL|
|     thigh_cm     DECIMAL  |          |     achieved_at  DATETIME  |
|     notes           TEXT  |          | FK  session_id       INT   |
+============================+          +=============================+

USERS ||----o{ BODY_METRICS
USERS ||----o{ PERSONAL_RECORDS
WORKOUT_SESSIONS ||----o{ PERSONAL_RECORDS

+============================+
|   MILESTONE_ACHIEVEMENTS   |
|============================|
| PK  achievement_id   INT  |
| FK  user_id          INT  |----> USERS.user_id
|     milestone_code VARCHAR|
|     milestone_data   JSON |
|     fitcoin_awarded  INT  |
|     xp_awarded       INT  |
|     share_card_url VARCHAR|
|     is_shared     BOOLEAN |
|     achieved_at  DATETIME |
|     notified_at  DATETIME |
+============================+

USERS ||----o{ MILESTONE_ACHIEVEMENTS
```

Truong bo sung cho bang hien co:

  WORKOUT_SESSIONS (them):
    member_program_id  INT   FK -> MEMBER_PROGRAMS (nullable)
    program_day_id     INT   FK -> PROGRAM_DAYS (nullable)
    customized_from_prog BOOLEAN DEFAULT FALSE
    customization_log  JSON  -- {added:[], removed:[], modified:[]}

  EXERCISE_LOGS (them):
    program_exercise_id INT  FK -> PROGRAM_EXERCISES (nullable)
    overload_suggestion JSON -- {next_weight: 52.5, reason: "exceeded target 2x"}

Giai thich:
  - TRANSFORMATION_GOALS luu muc tieu cua tung member.
  - WORKOUT_PROGRAMS la thu vien chuong trinh do Gym Owner quan ly.
  - PROGRAM_DAYS va PROGRAM_EXERCISES dinh nghia lich tap chi tiet theo tuan/ngay.
  - MEMBER_PROGRAMS ghi nhan member dang chay chuong trinh nao.
  - BODY_METRICS theo doi so do co the theo thoi gian (tu nhap).
  - PERSONAL_RECORDS luu ky luc ca nhan tung bai tap.
  - MILESTONE_ACHIEVEMENTS ghi nhan 22 milestone + share card.

------------------------------------------------------------------------
### 2.9. Nhom Gear
------------------------------------------------------------------------

LUU Y ten bang thuc te trong DB:
  - gear_items       (ERD cu viet sai la GEAR_PRODUCTS)
  - gear_transactions (ERD cu viet sai la GEAR_RENTALS; chua ca giao dich mua va thue)
  - gear_lifecycle   (bang moi, ghi lich su vong doi tung gear)

```
+================================+
|          gear_items            |
|================================|
| PK  gear_id       VARCHAR(20) |  (dinh dang: GEAR-XXXX-XXXX)
| FK  current_owner_id    INT   |----> USERS.user_id (luon la GymOwner — B2C only)
|     category          ENUM    |
|     (Weights/Apparel/         |
|      Supplements/             |
|      Accessories/Cardio/      |
|      Recovery)                |
|     name          VARCHAR(200)|
|     description         TEXT  |
|     condition_rating     INT  |  (1-5)
|     condition_notes     TEXT  |
|     images              JSON  |
|     listing_type        ENUM  |
|     (sell / rent / both)      |
|     sell_price        DECIMAL |
|     rent_price_day    DECIMAL |
|     rent_price_week   DECIMAL |
|     deposit_amount    DECIMAL |
|     qr_code_url     VARCHAR   |
|     verified        BOOLEAN   |
|     is_available    BOOLEAN   |
|     avg_rating        DECIMAL |
|     total_reviews       INT   |
|     created_at       DATETIME |
+================================+

BR-11B (cap nhat 05/07/2026): gear la tai san cua phong gym (B2C only, khong con
peer-to-peer giua cac Member) — CHI GymOwner duoc tao listing (sell/rent/both);
Member/Guest chi duoc mua/thue, khong duoc tu dang gear cua minh.
BR-13 : deposit_amount >= 50% gia tri gear.
```

```
+================================+          +================================+
|       gear_transactions        |          |        gear_lifecycle          |
|================================|          |================================|
| PK  transaction_id      INT   |          | PK  lifecycle_id        INT   |
| FK  gear_id        VARCHAR(20)|          | FK  gear_id        VARCHAR(20)|
| FK  seller_id           INT   |----> USERS| FK  owner_id            INT   |----> USERS
| FK  buyer_id            INT   |----> USERS|     action              ENUM  |
|     type                ENUM  |          |     (listed/sold/rented/ |
|     (sale / rental)           |          |      returned/relisted)        |
|     amount            DECIMAL |          |     condition_at_time    INT   |
|     deposit           DECIMAL |          |     notes               TEXT   |
|     fitcoin_used      DECIMAL |          |     photos              JSON   |
|     rental_start        DATE  |          |     price_snapshot    DECIMAL  |
|     rental_end          DATE  |          |     timestamp        DATETIME  |
|     status              ENUM  |          +================================+
|     (pending/active/          |
|      completed/disputed)      |
|     created_at       DATETIME |
+================================+

gear_items ||----o{ gear_transactions  (1 gear nhieu giao dich lich su)
gear_items ||----o{ gear_lifecycle     (1 gear nhieu su kien vong doi)
USERS      ||----o{ gear_transactions  (seller — luon la GymOwner, B2C only)
USERS      ||----o{ gear_transactions  (buyer — Member/Guest mua; chi Member duoc thue)
```

Giai thich:
  - gear_transactions chua ca don mua (type='sale') lan don thue (type='rental').
  - seller_id luon la GymOwner (gear thuoc so huu phong gym, khong con peer-to-peer).
  - buyer_id la Member hoac Guest khi mua (sale); rieng thue (rental) chi Member duoc
    phep, Guest khong duoc thue gear (FR-061).
  - gear_lifecycle ghi lai toan bo hanh dong: dang ban, ban, cho thue, tra lai, dang lai.
  - Khong co truong qty_total / qty_available — moi gear_item la 1 vat the rieng le,
    trang thai quan ly qua is_available (BOOLEAN).

------------------------------------------------------------------------
### 2.10. Nhom Guest & Voucher
------------------------------------------------------------------------

```
+================================+
|            guests              |
|================================|
| PK  guest_id            INT   |
|     phone         VARCHAR(15) |  (unique, dung de xac thuc OTP)
|     email         VARCHAR(255)|
|     name          VARCHAR(255)|
|     first_visit_at   DATETIME |
|     last_visit_at    DATETIME |
|     total_purchases      INT  |
|     total_spent       DECIMAL |
| FK  upsell_voucher_id    INT  |----> vouchers.voucher_id
|     voucher_last_shown_at     |
|                      DATETIME |
|     created_at       DATETIME |
|     updated_at       DATETIME |
+================================+

+================================+          +================================+
|           vouchers             |          |        guest_vouchers          |
|================================|          |================================|
| PK  voucher_id          INT   |          | PK  guest_voucher_id    INT   |
|     code          VARCHAR(50) | ||----o{ | FK  guest_id            INT   |
|     discount_percent     INT  |          | FK  voucher_id          INT   |
|     discount_amount   DECIMAL |          |     assigned_at      DATETIME |
|     min_purchase_amount       |          |     used_at          DATETIME |
|                      DECIMAL  |          | FK  order_id            INT   |
|     applicable_to_nutrition   |          |     (NULL neu chua dung)      |
|                     BOOLEAN   |          +================================+
|     applicable_to_membership  |
|                     BOOLEAN   |
|     max_uses             INT  |  (NULL = khong gioi han)
|     current_uses         INT  |
|     start_date       DATETIME |
|     end_date         DATETIME |
|     description         TEXT  |
|     created_at       DATETIME |
+================================+

guests  ||----o{ guest_vouchers
vouchers ||----o{ guest_vouchers
guests  ||----o{ NUTRITION_ORDERS   (qua guest_id)
```

Giai thich:
  - guests luu thong tin khach hang OTP (khong co tai khoan USERS).
  - Session Guest co hieu luc 2 gio sau khi xac thuc OTP thanh cong.
  - vouchers: ma giam gia tang cho guest de khuyen khich chuyen doi thanh Member.
  - guest_vouchers: bang noi nhieu-nhieu giua guests va vouchers.
  - Guest chi duoc mua food/supplement, KHONG duoc thue gear va KHONG duoc delivery
    (can dia chi da xac thuc cua Member).

------------------------------------------------------------------------
### 2.11. Nhom Delivery
------------------------------------------------------------------------

```
+==============================+
|      SHIPPING_ADDRESSES      |
|==============================|
| PK  address_id      INT     |
| FK  user_id         INT     |----> USERS (Member only)
|     full_name   VARCHAR(100)|
|     phone       VARCHAR(15) |
|     address_line VARCHAR(300)|
|     ward        VARCHAR(100)|
|     district    VARCHAR(100)|
|     city        VARCHAR(100)|
|     is_default  BOOLEAN     |
|     created_at  DATETIME    |
+==============================+

USERS ||----o{ SHIPPING_ADDRESSES
SHIPPING_ADDRESSES ||----o{ NUTRITION_ORDERS  (1 dia chi nhieu don dinh duong)
SHIPPING_ADDRESSES ||----o{ INVOICES          (1 dia chi nhieu don gear)
```

Ghi chu:
  - Gear thue (gear_transactions type='rental') KHONG ship — member phai den quay nhan truc tiep.
  - Freeship ap dung khi tong don hang (truoc phi ship) >= 200,000 VND (BR-47).
  - Don delivery bat buoc thanh toan online — khong ho tro COD (BR-48).
  - Phi ship lay tu GHN/Ahamove API real-time, hien thi truoc khi member xac nhan.

========================================================================

## 3. TONG HOP QUAN HE GIUA CAC ENTITY
========================================================================

STT | Nguon -> Dich                              | Loai | Mo ta nghiep vu
----|---------------------------------------------|------|--------------------------------------
1   | USERS -> FITNESS_PASSPORT                   | 1:1  | Moi member co 1 ho so the hinh.
2   | USERS -> FOLLOWS                            | N:N  | Nguoi dung follow nhau.
3   | USERS -> WORKOUT_SESSIONS                   | 1:N  | Member tao nhieu buoi tap.
4   | WORKOUT_SESSIONS -> EXERCISE_LOGS           | 1:N  | 1 buoi tap co nhieu bai tap.
5   | USERS -> CHECK_INS                          | 1:N  | Member check-in nhieu lan.
6   | GYM_MEMBERSHIPS -> CHECK_INS               | 1:N  | Check-in gan voi goi tap dang dung.
7   | MEMBERSHIP_PLANS -> GYM_MEMBERSHIPS        | 1:N  | 1 loai goi co nhieu hoi vien dang dung.
8   | USERS -> GYM_MEMBERSHIPS                   | 1:N  | 1 member co lich su nhieu goi tap.
9   | GYM_MEMBERSHIPS -> MEMBERSHIP_HISTORY      | 1:N  | 1 goi co nhieu lan gia han/nang cap.
10  | USERS -> INVOICES                           | 1:N  | 1 user co nhieu hoa don (membership/nutrition/gear).
11  | NUTRITION_PRODUCTS -> INVENTORY             | 1:1  | Moi san pham co 1 dong ton kho.
12  | NUTRITION_ORDERS -> NUTRITION_ORDER_ITEMS   | 1:N  | 1 don co nhieu san pham.
13  | NUTRITION_PRODUCTS -> NUTRITION_ORDER_ITEMS | 1:N  | 1 SP xuat hien nhieu don.
14  | USERS -> RECOMMENDATIONS                    | 1:N  | 1 member co nhieu recommendation.
15  | RECOMMENDATIONS -> MEMBER_CARE_LOGS         | 1:N  | 1 recommendation duoc xu ly va ghi nhan.
16  | USERS (gym_owner) -> GYMS                   | N:1  | Single-tenant: nhieu gym_owner cung quan ly 1 gym duy nhat.
17  | CHALLENGES -> USER_CHALLENGES               | 1:N  | 1 thu thach nhieu nguoi tham gia.
18  | USERS -> FITCOIN_TRANSACTIONS               | 1:N  | Quan ly bien dong vi FitCoin.
19  | USERS -> NOTIFICATIONS                      | 1:N  | Nguoi dung nhan thong bao.
20  | USERS -> SOCIAL_POSTS                       | 1:N  | Nguoi dung dang bai milestone.
21  | USERS -> TRANSFORMATION_GOALS               | 1:N  | 1 member co nhieu muc tieu.
22  | WORKOUT_PROGRAMS -> PROGRAM_DAYS            | 1:N  | 1 chuong trinh co nhieu ngay tap.
23  | PROGRAM_DAYS -> PROGRAM_EXERCISES           | 1:N  | 1 ngay tap co nhieu bai.
24  | USERS -> MEMBER_PROGRAMS                    | 1:N  | 1 member chay nhieu chuong trinh.
25  | WORKOUT_PROGRAMS -> MEMBER_PROGRAMS         | 1:N  | 1 chuong trinh duoc nhieu member chay.
26  | TRANSFORMATION_GOALS -> MEMBER_PROGRAMS     | 1:N  | 1 muc tieu gan voi nhieu lan chay chuong trinh.
27  | USERS -> BODY_METRICS                       | 1:N  | 1 member nhieu lan do so do.
28  | USERS -> PERSONAL_RECORDS                   | 1:N  | 1 member nhieu ky luc ca nhan.
29  | WORKOUT_SESSIONS -> PERSONAL_RECORDS        | 1:N  | 1 buoi tap co the tao nhieu PR.
30  | USERS -> MILESTONE_ACHIEVEMENTS             | 1:N  | 1 member dat nhieu milestone.
31  | gear_items -> gear_transactions             | 1:N  | 1 gear co nhieu giao dich lich su (mua/thue).
32  | gear_items -> gear_lifecycle                | 1:N  | 1 gear co nhieu su kien vong doi.
33  | USERS -> gear_transactions (seller)         | 1:N  | Nguoi dang ban/cho thue gear.
34  | USERS -> gear_transactions (buyer)          | 1:N  | Nguoi mua/thue gear (chi Member duoc thue).
35  | guests -> NUTRITION_ORDERS                  | 1:N  | Guest OTP dat mon an tai quay.
36  | guests -> guest_vouchers                    | 1:N  | Guest nhan/dung voucher.
37  | vouchers -> guest_vouchers                  | 1:N  | Voucher duoc cap cho nhieu guest.
38  | USERS -> SHIPPING_ADDRESSES                 | 1:N  | 1 member nhieu dia chi giao hang.
39  | SHIPPING_ADDRESSES -> NUTRITION_ORDERS      | 1:N  | 1 dia chi nhieu don delivery.
40  | SHIPPING_ADDRESSES -> INVOICES              | 1:N  | 1 dia chi nhieu don gear delivery.

========================================================================
KET THUC FILE 07
========================================================================
