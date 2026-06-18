# 07. BIEU DO THUC THE LIEN KET
# (Entity Relationship Diagram - ERD)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System — bo Vendor/Gear P2P, them Asset/Nutrition/PT/AI)

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

He thong FitFuel+ (Gym Management System) co 37 entity, chia thanh 9 nhom:

  Nhom 1 - Nguoi dung:       USERS, FITNESS_PASSPORT, FOLLOWS
  Nhom 2 - Gym Tracking:     WORKOUT_SESSIONS, EXERCISE_LOGS, CHECK_INS
  Nhom 3 - Membership:       GYMS, MEMBERSHIP_PLANS, GYM_MEMBERSHIPS,
                              MEMBERSHIP_HISTORY, INVOICES
  Nhom 4 - Nutrition:        NUTRITION_PRODUCTS, NUTRITION_ORDERS,
                              NUTRITION_ORDER_ITEMS, INVENTORY
  Nhom 5 - Asset & Amenities:ASSETS, LOCKERS, ASSET_ASSIGNMENTS,
                              ASSET_PENALTIES
  Nhom 6 - PT & AI:          PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS,
                              RECOMMENDATIONS, MEMBER_CARE_LOGS
  Nhom 7 - He thong:         CHALLENGES, USER_CHALLENGES, BADGES,
                              FITCOIN_TRANSACTIONS, NOTIFICATIONS,
                              SOCIAL_POSTS
  Nhom 8 - Transformation:   TRANSFORMATION_GOALS, WORKOUT_PROGRAMS,
                              PROGRAM_DAYS, PROGRAM_EXERCISES,
                              MEMBER_PROGRAMS, BODY_METRICS,
                              PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS
  Nhom 9 - Gear & Guest:     GEAR_PRODUCTS, GEAR_RENTALS

  LUU Y:
  - INVOICES.service_type mo rong: them 'gear_sale', 'gear_rental'
  - NUTRITION_ORDERS.guest_phone: khong con luon la NULL (guest co the mua)
  - GEAR_RENTALS: chi co user_id (Member), KHONG co guest_phone

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
  - checkout_time ghi khi member ra khoi phong tap (dung cho locker buoi).

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
|      nutrition/asset/pt) |
| FK  reference_id    INT |
|     (membership_id,     |
|      order_id, etc.)    |
|     total_amount DECIMAL |
|     fitcoin_used DECIMAL |
|     payment_method      |
|               VARCHAR   |
|     payment_status ENUM |
|     (pending/paid/fail) |
|     created_at DATETIME |
+==========================+

USERS ||----o{ INVOICES
```

Giai thich:
  - GYMS chi co 1 dong du lieu (single-tenant). Khong co owner_id FK.
  - MEMBERSHIP_PLANS dinh nghia cac loai goi: Day Pass, Basic, Standard,
    Premium, PT Plus, Student.
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
| FK  created_by      INT |          | FK  product_id       INT  |
|     (nhan vien ban)     |          |     quantity           INT |
|     order_type    ENUM  |          |     unit_price    DECIMAL  |
|     (pos_sale /         |          |     line_total    DECIMAL  |
|      pre_order)         |          +============================+
|     status        ENUM  |
|     (pending/ready/done)|
|     total_amount DECIMAL|
|     fitcoin_used DECIMAL|
| FK  invoice_id      INT |
|     notes          TEXT |
|     created_at DATETIME |
+==========================+

USERS ||----o{ NUTRITION_ORDERS      (member mua hang)
USERS ||----o{ NUTRITION_ORDERS      (nhan vien tao don)
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
  - INVENTORY theo doi ton kho, canh bao khi < low_stock_threshold.

------------------------------------------------------------------------
### 2.5. Nhom Asset & Amenities (Tai san va tien ich)
------------------------------------------------------------------------

```
+==========================+          +============================+
|         ASSETS           |          |         LOCKERS            |
|==========================|          |============================|
| PK  asset_id        INT |          | PK  locker_id        INT  |
|     asset_code  VARCHAR  |          |     locker_code  VARCHAR  |
|     (KHAN-001, THAM-003) |          |     status           ENUM  |
|     type          ENUM  |          |     (available/in_use/     |
|     (towel/mat/belt/    |          |      maintenance)          |
|      glove/rope)        |          |     locker_type      ENUM  |
|     status        ENUM  |          |     (daily/monthly)        |
|     (available/in_use/  |          |     monthly_fee   DECIMAL  |
|      maintenance/lost)  |          |     created_at  DATETIME  |
|     condition     ENUM  |          +============================+
|     (good/worn/damaged) |
|     loss_fee   DECIMAL  |
|     damage_fee DECIMAL  |
|     created_at DATETIME |
+==========================+
         |
         | 1:N
         v
+==========================+          +============================+
|   ASSET_ASSIGNMENTS      |          |    ASSET_PENALTIES         |
|==========================|          |============================|
| PK  assignment_id   INT |          | PK  penalty_id       INT  |
| FK  asset_id        INT |          | FK  assignment_id    INT  |
| FK  locker_id       INT |          |     penalty_type     ENUM  |
|     (nullable)          |          |     (loss/damage/          |
| FK  user_id         INT |          |      late_return)          |
| FK  checkin_id      INT |          |     amount        DECIMAL  |
|     (nullable)          |          |     description      TEXT  |
|     assigned_at DATETIME|          |     status           ENUM  |
|     due_back   DATETIME |          |     (pending/paid)         |
|     returned_at DATETIME|          | FK  invoice_id       INT  |
|     (nullable)          |          |     created_at   DATETIME  |
|     return_status ENUM  |          +============================+
|     (pending/returned/  |
|      damaged/lost)      |
|     staff_note   TEXT  |
+==========================+

ASSETS ||----o{ ASSET_ASSIGNMENTS
LOCKERS ||----o{ ASSET_ASSIGNMENTS  (khi cap locker, dung ASSET_ASSIGNMENTS)
USERS   ||----o{ ASSET_ASSIGNMENTS
CHECK_INS ||----o{ ASSET_ASSIGNMENTS
ASSET_ASSIGNMENTS ||----o{ ASSET_PENALTIES
```

Giai thich:
  - ASSETS quan ly khan, tham, dai lung, gang tay, day keo.
  - LOCKERS quan ly locker rieng (co ma so, trang thai, loai buoi/thang).
  - ASSET_ASSIGNMENTS ghi nhan moi lan cap phat / thu hoi tai san.
  - ASSET_PENALTIES tinh phi phat neu mat/hong, lien ket voi INVOICES.

------------------------------------------------------------------------
### 2.6. Nhom PT va AI Retention
------------------------------------------------------------------------

```
+==========================+          +============================+
|      PT_TRAINERS         |          |       PT_BOOKINGS          |
|==========================|          |============================|
| PK  trainer_id      INT |          | PK  booking_id       INT  |
|     name        VARCHAR  | ||----o{ | FK  trainer_id       INT  |
|     specialty   VARCHAR  |          | FK  user_id          INT  |
|     schedule       TEXT |          |     scheduled_at DATETIME  |
|     price_per_session    |          |     duration_min     INT  |
|                 DECIMAL  |          |     status           ENUM  |
|     is_active   BOOLEAN  |          |     (scheduled/done/      |
|     created_at DATETIME  |          |      cancelled)           |
+==========================+          |     notes            TEXT |
                                      |     created_at   DATETIME  |
                                      +============================+
                                               |
                                               | 1:1
                                               v
                                      +============================+
                                      |       PT_SESSIONS          |
                                      |============================|
                                      | PK  pt_session_id    INT  |
                                      | FK  booking_id       INT  |
                                      |     exercises_done   TEXT |
                                      |     trainer_notes    TEXT |
                                      |     member_feedback  TEXT |
                                      |     created_at   DATETIME |
                                      +============================+

PT_TRAINERS ||----o{ PT_BOOKINGS
USERS       ||----o{ PT_BOOKINGS
PT_BOOKINGS  ||----o| PT_SESSIONS

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
|      upsell_nutrition)  |          |     created_at   DATETIME  |
|     priority      ENUM  |          +============================+
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
  - PT_TRAINERS luu thong tin HLV cua phong tap.
  - PT_BOOKINGS la lich dat buoi PT cua member voi HLV.
  - PT_SESSIONS ghi ket qua buoi tap (bai da lam, nhan xet HLV).
  - RECOMMENDATIONS la hang doi AI care queue.
  - MEMBER_CARE_LOGS ghi nhan nhan vien da xu ly recommendation nao the nao.

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
|         BADGES           |          |  FITCOIN_TRANSACTIONS      |
|==========================|          |============================|
| PK  badge_id        INT |          | PK  txn_id           INT  |
|     name        VARCHAR  |          | FK  user_id          INT  |
|     description    TEXT  |          |     type             ENUM  |
|     icon_url    VARCHAR  |          |     (earn/spend)          |
|     criteria        TEXT |          |     amount        DECIMAL  |
|     category       ENUM  |          |     source           ENUM  |
+==========================+          |     (streak/challenge/    |
                                      |      referral/deposit/    |
                                      |      membership_bonus)    |
                                      |     reference_id     INT  |
                                      |     created_at   DATETIME  |
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
|     created_at DATETIME |          |     created_at   DATETIME  |
+==========================+          +============================+

USERS ||----o{ SOCIAL_POSTS
USERS ||----o{ NOTIFICATIONS
```

========================================================================

## 3. TONG HOP QUAN HE GIUA CAC ENTITY
========================================================================

STT | Nguon -> Dich                          | Loai | Mo ta nghiep vu
----|----------------------------------------|------|--------------------------------------
1   | USERS -> FITNESS_PASSPORT              | 1:1  | Moi member co 1 ho so the hinh.
2   | USERS -> FOLLOWS                       | N:N  | Nguoi dung follow nhau.
3   | USERS -> WORKOUT_SESSIONS              | 1:N  | Member tao nhieu buoi tap.
4   | WORKOUT_SESSIONS -> EXERCISE_LOGS      | 1:N  | 1 buoi tap co nhieu bai tap.
5   | USERS -> CHECK_INS                     | 1:N  | Member check-in nhieu lan.
6   | GYM_MEMBERSHIPS -> CHECK_INS           | 1:N  | Check-in gan voi goi tap dang dung.
7   | MEMBERSHIP_PLANS -> GYM_MEMBERSHIPS   | 1:N  | 1 loai goi co nhieu hoi vien dang dung.
8   | USERS -> GYM_MEMBERSHIPS              | 1:N  | 1 member co lich su nhieu goi tap.
9   | GYM_MEMBERSHIPS -> MEMBERSHIP_HISTORY | 1:N  | 1 goi co nhieu lan gia han/nang cap.
10  | USERS -> INVOICES                      | 1:N  | 1 user co nhieu hoa don (membership/nutrition/asset/PT).
11  | NUTRITION_PRODUCTS -> INVENTORY        | 1:1  | Moi san pham co 1 dong ton kho.
12  | NUTRITION_ORDERS -> NUTRITION_ORDER_ITEMS | 1:N | 1 don co nhieu san pham.
13  | NUTRITION_PRODUCTS -> NUTRITION_ORDER_ITEMS | 1:N | 1 SP xuat hien nhieu don.
14  | ASSETS -> ASSET_ASSIGNMENTS            | 1:N  | 1 tai san duoc cap phat nhieu lan.
15  | LOCKERS -> ASSET_ASSIGNMENTS           | 1:N  | 1 locker duoc cap nhieu member.
16  | ASSET_ASSIGNMENTS -> ASSET_PENALTIES   | 1:N  | 1 lan cap phat co the phat sinh phi phat.
17  | PT_TRAINERS -> PT_BOOKINGS             | 1:N  | 1 HLV co nhieu lich dat.
18  | PT_BOOKINGS -> PT_SESSIONS             | 1:1  | 1 lich dat -> 1 ket qua buoi tap.
19  | USERS -> RECOMMENDATIONS               | 1:N  | 1 member co nhieu recommendation.
20  | RECOMMENDATIONS -> MEMBER_CARE_LOGS    | 1:N  | 1 recommendation duoc xu ly va ghi nhan.
21  | USERS (gym_owner) -> GYMS              | N:1  | Single-tenant: nhieu gym_owner cung quan ly 1 gym duy nhat (khong co FK owner_id).
22  | CHALLENGES -> USER_CHALLENGES          | 1:N  | 1 thu thach nhieu nguoi tham gia.
23  | USERS -> FITCOIN_TRANSACTIONS          | 1:N  | Quan ly bien dong vi FitCoin.
24  | USERS -> NOTIFICATIONS                 | 1:N  | Nguoi dung nhan thong bao.
25  | USERS -> SOCIAL_POSTS                  | 1:N  | Nguoi dung dang bai milestone.

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

  RECOMMENDATIONS.recommendation_type (mo rong ENUM):
    Them: inactive_program / goal_achieved_upsell / technique_issue_upsell_pt

Giai thich:
  - TRANSFORMATION_GOALS luu muc tieu cua tung member.
  - WORKOUT_PROGRAMS la thu vien chuong trinh do Gym Owner quan ly.
  - PROGRAM_DAYS va PROGRAM_EXERCISES dinh nghia lich tap chi tiet theo tuan/ngay.
  - MEMBER_PROGRAMS ghi nhan member dang chay chuong trinh nao.
  - BODY_METRICS theo doi so do co the theo thoi gian (tu nhap).
  - PERSONAL_RECORDS luu ky luc ca nhan tung bai tap.
  - MILESTONE_ACHIEVEMENTS ghi nhan 22 milestone + share card.

------------------------------------------------------------------------
### 2.9. Nhom Gear & Guest Checkout
------------------------------------------------------------------------

```
+==============================+          +==============================+
|       GEAR_PRODUCTS          |          |         GEAR_RENTALS         |
|==============================|          |==============================|
| PK  gear_id        INT      |          | PK  rental_id       INT     |
| FK  gym_id         INT      |--------> | FK  gear_product_id INT     |
|     name      VARCHAR(200)  |          | FK  user_id         INT     |----> USERS (Member only)
|     description     TEXT   |          |     start_date      DATE    |
|     category  VARCHAR(100)  |          |     due_date        DATE    |
|     price_sale  DECIMAL(10) |          |     actual_return  DATETIME |
|     price_rental_per_day DEC|          |     deposit_paid DECIMAL(10)|
|     deposit_amount  DECIMAL |          |     rental_fee  DECIMAL(10) |
|     qty_total        INT    |          |     late_fee    DECIMAL(10) |
|     qty_available    INT    |          |     status         ENUM     |
|     is_for_sale   BOOLEAN   |          |     (pending/active/        |
|     is_for_rental BOOLEAN   |          |      returned/overdue/lost) |
|     image_url   VARCHAR(500)|          |     return_notes    TEXT    |
|     is_active     BOOLEAN   |          | FK  invoice_id      INT     |
|     created_at   DATETIME   |          |     created_at   DATETIME   |
+==============================+          +==============================+

GYMS ||----o{ GEAR_PRODUCTS
GEAR_PRODUCTS ||----o{ GEAR_RENTALS
USERS ||----o{ GEAR_RENTALS
```

Truong bo sung cho bang hien co (Gear & Guest):

  INVOICES.service_type (mo rong ENUM):
    Them: 'gear_sale', 'gear_rental'

  NUTRITION_ORDERS.guest_phone:
    Khong con phai la NULL — guest xac thuc OTP co the dat hang.
    Format: VARCHAR(15), nullable (NULL neu la member da dang nhap).

========================================================================
KET THUC FILE 07
========================================================================
