# 08. TU DIEN DU LIEU
# (Data Dictionary)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: 05/07/2026 — Dong bo lai voi docs/07_ERDnew.md: xoa 4 bang
> Asset & Amenities con sot lai tu ban cu (da xoa khoi schema), sua ten + cau truc 2 bang
> Gear cho dung voi code thuc te (gear_items/gear_transactions), bo sung bang gear_lifecycle
> va 3 bang Guest & Voucher (guests/vouchers/guest_vouchers) truoc do bi thieu hoan toan.
> Tong so bang gio khop tuyet doi 39/39 voi docs/07_ERDnew.md.)

========================================================================

Giai thich cac cot:
  Truong    : Ten truong (column name).
  Kieu      : Kieu du lieu SQL.
  Rang buoc : PK, FK, NN=Not Null, UQ=Unique, DF=Default, CK=Check.
  Mo ta     : Y nghia.
  Vi du     : Gia tri mau.

Tong so bang: 39 bang trong 10 nhom (khop voi docs/07_ERDnew.md).
[Nhom Asset & Amenities (ASSETS, LOCKERS, ASSET_ASSIGNMENTS, ASSET_PENALTIES) va
Nhom PT (PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS) da bi xoa hoan toan khoi ca schema
thuc te lan tai lieu nay — khong con dinh nghia truong o duoi day.]

========================================================================

## BANG 1: USERS
========================================================================

Muc dich: Luu thong tin nguoi dung (member, gym_owner). KHONG con role 'vendor'.
          Single-tenant: tat ca gym_owner deu quan ly cung 1 gym.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
user_id         | INT         | PK, AUTO_INCREMENT  | Ma user                        | 1
email           | VARCHAR(255)| UQ, NN              | Email dang nhap                | an@gmail.com
phone           | VARCHAR(15) | UQ                  | So dien thoai                  | 0912345678
password_hash   | VARCHAR(255)| NN                  | Mat khau bcrypt                | $2b$10$...
role            | ENUM        | NN, DF='member'     | Vai tro: member, gym_owner     | member
display_name    | VARCHAR(100)| NN                  | Ten hien thi                   | Anh Duc
avatar_url      | VARCHAR(500)|                     | URL anh dai dien               | https://...
fitness_goal    | ENUM        |                     | bulk / cut / maintain          | cut
height_cm       | INT         |                     | Chieu cao (cm)                 | 172
weight_kg       | DECIMAL(5,1)|                     | Can nang hien tai (kg)         | 70.5
xp_total        | INT         | DF=0, CK>=0         | Tong XP tich luy               | 1250
current_level   | INT         | DF=1, CK>=1         | Level hien tai                 | 4
current_streak  | INT         | DF=0, CK>=0         | So ngay streak lien tiep       | 12
fitcoin_balance | DECIMAL(12,2)| DF=0, CK>=0        | So du FitCoin                  | 5000.00
referred_by     | INT         | FK->USERS.user_id   | User da gioi thieu             | 5
is_active       | BOOLEAN     | DF=true             | Tai khoan con hoat dong        | true
created_at      | DATETIME    | DF=NOW()            | Ngay tao                       | 2026-05-01

Index: idx_users_email (email), idx_users_phone (phone), idx_users_role (role)

========================================================================

## BANG 2: FITNESS_PASSPORT
========================================================================

Muc dich: Ho so the hinh tong hop 1:1 voi USERS.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
passport_id     | INT         | PK, AUTO_INCREMENT  | Ma passport                    | 1
user_id         | INT         | FK->USERS, UQ, NN   | User so huu                    | 1
total_sessions  | INT         | DF=0                | Tong so buoi tap               | 48
total_volume    | DECIMAL(12,2)| DF=0               | Tong volume (kg * reps)        | 125000.00
longest_streak  | INT         | DF=0                | Streak dai nhat tung dat       | 30
body_weight_log | TEXT(JSON)  |                     | [{date, kg}]                   | [{"date":"2026-05","kg":72}]
body_photos     | TEXT(JSON)  |                     | [{date, url}]                  | [{"date":"...","url":"..."}]
milestone_badges| TEXT(JSON)  |                     | [{badge_id, date}]             | [{"badge_id":1,"date":"..."}]
is_public       | BOOLEAN     | DF=true             | Cho phep nguoi khac xem        | true
created_at      | DATETIME    | DF=NOW()            | Ngay tao                       | 2026-05-01

========================================================================

## BANG 3: FOLLOWS
========================================================================

Muc dich: Quan he N:N follow nhau giua cac member.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
follower_id     | INT         | FK->USERS, PK(1/2)  | Nguoi follow                   | 1
following_id    | INT         | FK->USERS, PK(2/2)  | Nguoi duoc follow              | 2
created_at      | DATETIME    | DF=NOW()            | Thoi gian follow               | 2026-05-10

PK la cap (follower_id, following_id).

========================================================================

## BANG 4: WORKOUT_SESSIONS
========================================================================

Muc dich: Luu tung buoi tap cua member.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
session_id      | INT         | PK, AUTO_INCREMENT  | Ma buoi tap                    | 1
user_id         | INT         | FK->USERS, NN       | Member thuc hien               | 1
gym_id          | INT         | FK->GYMS            | Phong tap (null = tap o nha)   | 1
date            | DATE        | NN                  | Ngay tap                       | 2026-05-10
duration_min    | INT         |                     | Thoi luong (phut)              | 65
status          | ENUM        | DF='active'         | active / done / cancelled      | done
notes           | TEXT        |                     | Ghi chu cua user               | Hom nay hay
created_at      | DATETIME    | DF=NOW()            | Ngay tao                       | 2026-05-10

Truong bo sung (Transformation Journey Engine):
member_program_id   INT   FK->MEMBER_PROGRAMS (nullable — null neu tap tu do)
program_day_id      INT   FK->PROGRAM_DAYS (nullable)
customized_from_prog BOOLEAN  DF=false — member co chinh sua goi y khong?
customization_log   JSON  DF=NULL — {added:[], removed:[], modified:[]}

Index: idx_sessions_user_date (user_id, date)

========================================================================

## BANG 5: EXERCISE_LOGS
========================================================================

Muc dich: Chi tiet tung bai tap trong 1 workout session.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
log_id          | INT         | PK, AUTO_INCREMENT  | Ma log                         | 1
session_id      | INT         | FK->WORKOUT_SESSIONS, NN | Ma buoi tap             | 1
exercise_name   | VARCHAR(100)| NN                  | Ten bai tap                    | Bench Press
muscle_group    | ENUM        | NN                  | Nhom co chinh                  | chest
sets            | TEXT(JSON)  | NN                  | [{reps, weight}]               | [{"reps":10,"weight":60}]
is_pr           | BOOLEAN     | DF=false            | Dat ky luc ca nhan moi         | true
notes           | TEXT        |                     | Ghi chu bai tap                | PR moi!
created_at      | DATETIME    | DF=NOW()            | Thoi gian log                  | 2026-05-10

Truong bo sung (Transformation Journey Engine):
program_exercise_id INT  FK->PROGRAM_EXERCISES (nullable — null neu tu them)
overload_suggestion JSON DF=NULL — {next_weight: 52.5, reason: "exceeded target 2x"}

========================================================================

## BANG 6: CHECK_INS
========================================================================

Muc dich: Ghi nhan moi luot check-in/check-out cua member tai phong tap.

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
checkin_id      | INT         | PK, AUTO_INCREMENT  | Ma check-in                    | 1
user_id         | INT         | FK->USERS, NN       | Member check-in                | 1
gym_id          | INT         | FK->GYMS, NN        | Phong tap (luon = 1)           | 1
membership_id   | INT         | FK->GYM_MEMBERSHIPS | Goi tap dang dung luc check-in | 5
checkin_time    | DATETIME    | NN                  | Thoi gian vao phong tap        | 2026-05-10 08:30
checkout_time   | DATETIME    |                     | Thoi gian ra khoi phong tap    | 2026-05-10 10:00
method          | VARCHAR(20) | NN                  | qr / manual / app              | qr
notes           | TEXT        |                     | Ghi chu cua nhan vien          | 

Index: idx_checkins_user_date (user_id, checkin_time)

========================================================================

## BANG 7: GYMS
========================================================================

Muc dich: Thong tin phong tap. Single-tenant: CHI CO DUY NHAT 1 DONG (gym_id = 1).

Truong          | Kieu        | Rang buoc           | Mo ta                          | Vi du
----------------|-------------|---------------------|--------------------------------|------------------
gym_id          | INT         | PK (luon = 1)       | Ma phong tap (luon = 1)        | 1
name            | VARCHAR(200)| NN                  | Ten phong tap                  | FitFuel+ Gym
address         | VARCHAR(500)|                     | Dia chi                        | 123 Nguyen Hue, Q1
phone           | VARCHAR(15) |                     | Dien thoai lien he             | 0909123456
opening_hours   | TEXT(JSON)  |                     | Gio mo cua theo ngay trong tuan| {"mon":"6:00-22:00"}
logo_url        | VARCHAR(500)|                     | URL logo phong tap             | https://...
created_at      | DATETIME    | DF=NOW()            | Ngay tao he thong              | 2026-05-01

KHONG co truong owner_id (single-tenant, nhieu gym_owner cung quan ly 1 gym).

========================================================================

## BANG 8: MEMBERSHIP_PLANS
========================================================================

Muc dich: Dinh nghia cac loai goi tap co san trong phong tap.

Truong               | Kieu         | Rang buoc           | Mo ta                             | Vi du
---------------------|--------------|---------------------|-----------------------------------|------------------
plan_id              | INT          | PK, AUTO_INCREMENT  | Ma goi tap                        | 1
name                 | VARCHAR(100) | NN, UQ              | Ten goi                           | Premium
duration_days        | INT          | NN, CK>0            | Thoi han (ngay)                   | 30
price_monthly        | DECIMAL(12,2)| NN                  | Gia thang (VND)                   | 600000
price_annual         | DECIMAL(12,2)|                     | Gia nam = x10 thang (tiet kiem 2) | 6000000
amenity_towel        | BOOLEAN      | DF=false            | Kem khan mien phi                 | true
amenity_locker       | BOOLEAN      | DF=false            | Kem locker thang                  | true
amenity_equipment    | BOOLEAN      | DF=false            | Kem dung cu phu tro               | false
is_active            | BOOLEAN      | DF=true             | Goi dang con ban                  | true
created_at           | DATETIME     | DF=NOW()            | Ngay tao goi                      | 2026-05-01

Chi co 2 ban ghi du lieu:
  - Goi Thang: duration_days=30, price=399000, quyen loi vao phong tap tu do.
  - Goi Nam:   duration_days=365, price=3990000, quyen loi giong Goi Thang.

========================================================================

## BANG 9: GYM_MEMBERSHIPS
========================================================================

Muc dich: Goi tap hoi vien dang su dung hoac lich su da su dung.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
membership_id   | INT          | PK, AUTO_INCREMENT  | Ma membership                  | 1
user_id         | INT          | FK->USERS, NN       | Member so huu                  | 1
gym_id          | INT          | FK->GYMS, NN        | Phong tap (luon = 1)           | 1
plan_id         | INT          | FK->MEMBERSHIP_PLANS| Loai goi tap                   | 3
start_date      | DATE         | NN                  | Ngay bat dau hieu luc          | 2026-05-01
end_date        | DATE         | NN                  | Ngay het hieu luc              | 2026-05-31
status          | ENUM         | NN, DF='active'     | active/expired/suspended/      | active
                |              |                     | cancelled                      |
notes           | TEXT         |                     | Ghi chu them                   | Bao luu vi benh
created_at      | DATETIME     | DF=NOW()            | Ngay tao ban ghi               | 2026-05-01

Index: idx_memberships_user_status (user_id, status)
       idx_memberships_end_date (end_date) -- de query sap het han

========================================================================

## BANG 10: MEMBERSHIP_HISTORY
========================================================================

Muc dich: Ghi lai toan bo lich su thay doi goi tap (dang ky, gia han, nang cap, bao luu).
          Moi lan thay doi = 1 ban ghi moi (append-only).

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
history_id      | INT          | PK, AUTO_INCREMENT  | Ma lich su                     | 1
membership_id   | INT          | FK->GYM_MEMBERSHIPS | Goi tap lien quan              | 5
action          | ENUM         | NN                  | register/renew/upgrade/        | renew
                |              |                     | suspend/resume/cancel          |
plan_id_from    | INT          | FK->MEMBERSHIP_PLANS| Goi cu (null neu dang ky moi)  | null
plan_id_to      | INT          | FK->MEMBERSHIP_PLANS, NN | Goi moi / goi da chon     | 3
amount_paid     | DECIMAL(12,2)| DF=0                | So tien da thanh toan          | 600000
payment_method  | VARCHAR(50)  |                     | vnpay/momo/cash/fitcoin        | vnpay
note            | TEXT         |                     | Ghi chu them (ly do bao luu)   | Di cong tac
created_at      | DATETIME     | DF=NOW()            | Thoi gian thay doi             | 2026-05-01

========================================================================

## BANG 11: INVOICES
========================================================================

Muc dich: Hoa don hop nhat cho tat ca loai giao dich trong phong tap.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
invoice_id      | INT          | PK, AUTO_INCREMENT  | Ma hoa don                     | 1
user_id         | INT          | FK->USERS, NN       | Member thanh toan              | 1
service_type    | ENUM         | NN                  | membership/nutrition/          | nutrition
                |              |                     | gear_sale/gear_rental          |
reference_id    | INT          |                     | Ma ban ghi nguon              | 10
                |              |                     | (membership_id, order_id...)   |
total_amount    | DECIMAL(12,2)| NN                  | Tong tien truoc FitCoin        | 150000
fitcoin_used    | DECIMAL(12,2)| DF=0                | FitCoin da dung giam gia       | 50000
final_amount    | DECIMAL(12,2)| NN                  | Tong tien thuc te phai tra     | 100000
payment_method  | VARCHAR(50)  |                     | vnpay/momo/cash/fitcoin        | vnpay
payment_status  | ENUM         | DF='pending'        | pending/paid/failed/refunded   | paid
delivery_type   | ENUM         |                     | pickup / delivery              | pickup
shipping_address_id | INT     | FK->SHIPPING_ADDRESSES | Dia chi giao (gear delivery) | 1
guest_delivery_address | TEXT |                     | Dia chi guest (khong co acc.)  |
shipping_fee    | DECIMAL(10,2)| DF=0                | Phi giao hang                  | 25000
tracking_code   | VARCHAR(100) |                     | Ma van don GHN/Ahamove         | GHN123456
shipping_provider | ENUM       |                     | GHN / Ahamove                  | GHN
delivery_status | ENUM         |                     | pending/preparing/shipped/     | delivering
                |              |                     | delivering/done/cancelled      |
created_at      | DATETIME     | DF=NOW()            | Ngay tao hoa don               | 2026-05-10

========================================================================

## BANG 12: NUTRITION_PRODUCTS
========================================================================

Muc dich: San pham dinh duong noi bo cua phong tap. KHONG co vendor_id.

Truong               | Kieu         | Rang buoc           | Mo ta                          | Vi du
---------------------|--------------|---------------------|--------------------------------|------------------
product_id           | INT          | PK, AUTO_INCREMENT  | Ma san pham                    | 1
name                 | VARCHAR(200) | NN                  | Ten san pham                   | Whey Protein Shake
description          | TEXT         |                     | Mo ta chi tiet                 | Protein sau tap...
category              | ENUM         | NN                  | protein/drink/snack/meal/      | protein
                     |              |                     | supplement                     |
price                | DECIMAL(10,2)| NN, CK>0            | Gia ban (VND)                  | 75000
calories             | INT          |                     | Calo moi phan (kcal)           | 350
protein_g            | DECIMAL(6,2) |                     | Protein (gram)                 | 30.00
carb_g               | DECIMAL(6,2) |                     | Carbohydrate (gram)            | 20.00
fat_g                | DECIMAL(6,2) |                     | Fat (gram)                     | 5.00
allergens            | TEXT         | DF='[]'             | Thanh phan di ung (JSON array) | ["dairy","gluten"]
image_url            | VARCHAR(500) |                     | URL anh san pham               | https://...
is_available         | BOOLEAN      | DF=true             | Con ban hay khong              | true
low_stock_threshold  | INT          | DF=10               | Nguong canh bao ton kho thap   | 5
created_at           | DATETIME     | DF=NOW()            | Ngay tao                       | 2026-05-01

========================================================================

## BANG 13: NUTRITION_ORDERS
========================================================================

Muc dich: Don hang dinh duong noi bo. Ho tro ca pos_sale (tai quay),
          pre_order (dat truoc), va delivery_order (giao ve nha).

Truong               | Kieu         | Rang buoc               | Mo ta                          | Vi du
---------------------|--------------|-------------------------|--------------------------------|------------------
order_id             | INT          | PK, AUTO_INCREMENT      | Ma don hang                    | 1
user_id              | INT          | FK->USERS, NULL         | Member mua (NULL neu guest)    | 2
guest_id             | INT          | FK->guests, NULL        | Guest mua (NULL neu member)    | 4
created_by           | INT          | FK->USERS, NULL         | Nhan vien tao (pos_sale)       | 6
order_type           | ENUM         | NN                      | pos_sale/pre_order/            | delivery_order
                     |              |                         | delivery_order                 |
delivery_type        | ENUM         | DF='pickup'             | pickup / delivery              | delivery
shipping_address_id  | INT          | FK->SHIPPING_ADDRESSES, | Dia chi giao (NULL=pickup)     | 1
                     |              | NULL                    |                                |
guest_delivery_addr  | TEXT         | NULL                    | Dia chi guest (khong co acc.)  |
shipping_fee         | DECIMAL(10,2)| DF=0                    | Phi giao hang (0 neu freeship) | 25000
tracking_code        | VARCHAR(100) | NULL                    | Ma van don GHN/Ahamove         | GHN123456
shipping_provider    | ENUM         | NULL                    | GHN / Ahamove                  | GHN
status               | ENUM         | DF='pending'            | pending/preparing/ready/       | delivering
                     |              |                         | shipped/delivering/done/       |
                     |              |                         | cancelled                      |
total_amount         | DECIMAL(12,2)| NN                      | Tong tien san pham             | 150000
fitcoin_used         | DECIMAL(12,2)| DF=0                    | FitCoin dung de giam gia       | 25000
invoice_id           | INT          | FK->INVOICES            | Lien ket hoa don               | 3
notes                | TEXT         |                         | Ghi chu them                   |
created_at           | DATETIME     | DF=NOW()                | Thoi gian tao don              | 2026-05-10

Giai thich: guest_id NULL khi la member da dang nhap; co gia tri khi la guest OTP (BANG 36).

========================================================================

## BANG 14: NUTRITION_ORDER_ITEMS
========================================================================

Muc dich: Chi tiet tung san pham trong don hang dinh duong.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
item_id         | INT          | PK, AUTO_INCREMENT  | Ma dong hang                   | 1
order_id        | INT          | FK->NUTRITION_ORDERS, NN | Ma don hang             | 1
product_id      | INT          | FK->NUTRITION_PRODUCTS, NN | Ma san pham          | 3
quantity        | INT          | NN, CK>0            | So luong                       | 2
unit_price      | DECIMAL(10,2)| NN                  | Don gia luc mua                | 75000
line_total      | DECIMAL(12,2)| NN                  | Thanh tien (quantity x price)  | 150000

========================================================================

## BANG 15: INVENTORY
========================================================================

Muc dich: Theo doi ton kho cua tung san pham dinh duong. 1:1 voi NUTRITION_PRODUCTS.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
inventory_id    | INT          | PK, AUTO_INCREMENT  | Ma ton kho                     | 1
product_id      | INT          | FK->NUTRITION_PRODUCTS, UQ, NN | Ma san pham      | 1
quantity_in_stock | INT        | NN, DF=0, CK>=0     | So luong con trong kho         | 24
last_updated    | DATETIME     | DF=NOW()            | Lan cap nhat gan nhat          | 2026-05-10
note            | TEXT         |                     | Ghi chu nhap kho / xuat kho    | Nhap 50 hop

========================================================================

## NHOM DA XOA: Asset & Amenities, Personal Training
========================================================================

*(ASSETS, LOCKERS, ASSET_ASSIGNMENTS, ASSET_PENALTIES: da xoa hoan toan khoi schema.
Khan/tham la do ca nhan cua member, khong quan ly trong he thong. Cho thue thiet bi
duoc thay the boi Nhom Gear — xem gear_items / gear_transactions o BANG 33-34.)*

*(PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS: da xoa. Khong co role PT trong he thong,
thay the boi Transformation Journey Engine — xem BANG 25-32.)*

========================================================================

## BANG 16: RECOMMENDATIONS
========================================================================

Muc dich: AI care queue — danh sach hoi vien can cham soc voi ly do va goi y hanh dong.

Truong               | Kieu         | Rang buoc           | Mo ta                          | Vi du
---------------------|--------------|---------------------|--------------------------------|------------------
rec_id               | INT          | PK, AUTO_INCREMENT  | Ma recommendation              | 1
user_id              | INT          | FK->USERS, NN       | Member can cham soc            | 3
recommendation_type  | ENUM         | NN                  | renew_reminder/inactive_alert/ | renew_reminder
                     |              |                     | upsell_plan/upsell_pt/         |
                     |              |                     | upsell_nutrition/              |
                     |              |                     | inactive_program/              |
                     |              |                     | goal_achieved_upsell/          |
                     |              |                     | technique_issue_upsell_pt      |
priority             | ENUM         | NN                  | high / medium / low            | high
suggested_action     | TEXT         |                     | Goi y hanh dong cu the         | Goi dien nhac gia han
status               | ENUM         | DF='pending'        | pending/handled/dismissed      | pending
created_at           | DATETIME     | DF=NOW()            | Thoi diem tao recommendation   | 2026-05-10
resolved_at          | DATETIME     |                     | Thoi diem xu ly (null = chua)  | null

Index: idx_rec_user_status (user_id, status)
       idx_rec_status_priority (status, priority)

========================================================================

## BANG 17: MEMBER_CARE_LOGS
========================================================================

Muc dich: Ghi lai ket qua xu ly cua nhan vien doi voi tung recommendation.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
care_log_id     | INT          | PK, AUTO_INCREMENT  | Ma log cham soc                | 1
rec_id          | INT          | FK->RECOMMENDATIONS, NN | Ma recommendation          | 1
staff_id        | INT          | FK->USERS, NN       | Nhan vien xu ly                | 6
action_taken    | TEXT         | NN                  | Mo ta viec da lam              | Da goi dien, member dong y gia han
result          | ENUM         | NN                  | renewed/declined/unreachable/  | renewed
                |              |                     | other                          |
notes           | TEXT         |                     | Ghi chu chi tiet               | Gia han 3 thang
created_at      | DATETIME     | DF=NOW()            | Thoi gian ghi nhan             | 2026-05-10

========================================================================

## BANG 18: CHALLENGES
========================================================================

Muc dich: Thach thuc gamification hang tuan / hang thang.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
challenge_id    | INT          | PK, AUTO_INCREMENT  | Ma thu thach                   | 1
title           | VARCHAR(200) | NN                  | Tieu de                        | Tap 5 buoi tuan nay
description     | TEXT         |                     | Mo ta chi tiet                 | Hoan thanh 5 session...
type            | ENUM         | NN                  | weekly / monthly               | weekly
criteria        | TEXT(JSON)   |                     | Dieu kien hoan thanh (JSON)    | {"sessions": 5}
reward_xp       | INT          | DF=0                | XP thuong khi hoan thanh       | 100
reward_fitcoin  | DECIMAL(10,2)| DF=0                | FitCoin thuong                 | 50
start_date      | DATE         | NN                  | Ngay bat dau                   | 2026-05-12
end_date        | DATE         | NN                  | Ngay ket thuc                  | 2026-05-18
is_active       | BOOLEAN      | DF=true             | Thu thach con mo                | true

========================================================================

## BANG 19: USER_CHALLENGES
========================================================================

Muc dich: Bang trung gian ghi nhan tham gia thu thach cua member.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
id              | INT          | PK, AUTO_INCREMENT  | Ma dong                        | 1
user_id         | INT          | FK->USERS, NN       | Member tham gia                | 2
challenge_id    | INT          | FK->CHALLENGES, NN  | Thu thach tham gia             | 1
progress        | TEXT(JSON)   |                     | Tien do hien tai               | {"sessions_done":3}
status          | ENUM         | DF='in_progress'    | in_progress/completed/failed   | completed
completed_at    | DATETIME     |                     | Thoi gian hoan thanh           | 2026-05-17

========================================================================

## BANG 20: BADGES
========================================================================

Muc dich: Danh sach cac huy hieu (badges) ma member co the dat duoc qua Gamification.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
badge_id        | INT          | PK, AUTO_INCREMENT  | Ma huy hieu                    | 1
name            | VARCHAR(100) | NN, UQ              | Ten huy hieu                   | 'Iron Warrior'
description     | TEXT         | NN                  | Mo ta dieu kien hoan thanh     | 'Tap 3 ngay lien tiep'
icon_url        | VARCHAR(500) |                     | URL anh bieu tuong             | 'https://...'
criteria        | TEXT(JSON)   |                     | Rule check dynamic (JSON)      | {"streak_days": 3}
category        | ENUM         | NN                  | Phan loai: strength/streak/etc.| 'streak'
created_at      | DATETIME     | DF=NOW()            | Ngay tao                       | 2026-05-01

========================================================================

## BANG 21: USER_BADGES
========================================================================

Muc dich: Bang trung gian N-N ghi nhan member nao da dat duoc badge nao va luc nao.
Them ngay 01/07/2026 de thay the cach luu cu (nhet thang badge vao cot JSON
milestone_badges cua FITNESS_PASSPORT, khong co FK chuan, khong truy van duoc).
Cung cau truc voi BANG USER_CHALLENGES (bang trung gian giua USERS va CHALLENGES).

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
id              | INT          | PK, AUTO_INCREMENT  | Ma dinh danh                   | 1
user_id         | INT          | FK->USERS, NN       | Member da dat badge            | 2
badge_id        | INT          | FK->BADGES, NN      | Badge da dat                   | 1
earned_at       | DATETIME     | NN, DF=NOW()        | Thoi diem dat duoc badge       | 2026-06-20 08:00:00

Rang buoc bo sung: UNIQUE(user_id, badge_id) — moi member chi duoc ghi nhan 1 lan
cho moi badge (tranh trung lap khi dieu kien dat badge bi kiem tra nhieu lan).

========================================================================

## BANG 22: FITCOIN_TRANSACTIONS
========================================================================

Muc dich: Ghi lai moi bien dong so du FitCoin cua member.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
txn_id          | INT          | PK, AUTO_INCREMENT  | Ma giao dich                   | 1
user_id         | INT          | FK->USERS, NN       | Member lien quan               | 2
type            | ENUM         | NN                  | earn / spend                   | earn
amount          | DECIMAL(12,2)| NN, CK>0            | So FitCoin bien dong           | 200.00
source          | ENUM         | NN                  | streak_milestone/challenge/    | streak_milestone
                |              |                     | referral/deposit/membership_   |
                |              |                     | bonus/nutrition_spend/         |
                |              |                     | membership_spend/milestone_reward |
reference_id    | INT          |                     | ID ban ghi lien quan           | 5
created_at      | DATETIME     | DF=NOW()            | Thoi gian giao dich            | 2026-05-10

========================================================================

## BANG 23: NOTIFICATIONS
========================================================================

Muc dich: Thong bao he thong gui cho member.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
notification_id | INT          | PK, AUTO_INCREMENT  | Ma thong bao                   | 1
user_id         | INT          | FK->USERS, NN       | Nguoi nhan                     | 2
type            | ENUM         | NN                  | membership_expiry/streak_reset | membership_expiry
                |              |                     | /low_inventory/new_challenge   |
                |              |                     | /general                       |
title           | VARCHAR(200) | NN                  | Tieu de thong bao              | Goi tap sap het han
message         | TEXT         | NN                  | Noi dung chi tiet              | Goi tap het han sau 5 ngay
is_read         | BOOLEAN      | DF=false            | Da doc chua                    | false
action_url      | VARCHAR(500) |                     | URL chuyen den khi bam         | /membership
created_at      | DATETIME     | DF=NOW()            | Thoi gian gui                  | 2026-05-10

========================================================================

## BANG 24: SOCIAL_POSTS
========================================================================

Muc dich: Bai dang tu dong khi member dat milestone (PR, streak, badge).

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
post_id         | INT          | PK, AUTO_INCREMENT  | Ma bai dang                    | 1
user_id         | INT          | FK->USERS, NN       | Nguoi dang                     | 2
type            | ENUM         | NN                  | pr_record/streak_milestone/    | pr_record
                |              |                     | badge_unlock/challenge_done    |
content         | TEXT         | NN                  | Noi dung bai dang              | Vua pha PR Bench Press!
media_urls      | TEXT(JSON)   |                     | URL anh kem theo               | []
linked_data     | TEXT(JSON)   |                     | Du lieu lien ket (exercise, badge) | {"exercise":"Bench Press","weight":100}
likes_count     | INT          | DF=0                | So luot like                   | 5
created_at      | DATETIME     | DF=NOW()            | Thoi gian dang                 | 2026-05-10

========================================================================

## TOM TAT CAU TRUC DATABASE
========================================================================

Nhom                    | Bang                                          | So bang
------------------------|-----------------------------------------------|---------
1. Nguoi dung           | USERS, FITNESS_PASSPORT, FOLLOWS               | 3
2. Gym Tracking         | WORKOUT_SESSIONS, EXERCISE_LOGS, CHECK_INS      | 3
3. Membership           | GYMS, MEMBERSHIP_PLANS, GYM_MEMBERSHIPS,        | 5
                        | MEMBERSHIP_HISTORY, INVOICES                    |
4. Nutrition            | NUTRITION_PRODUCTS, NUTRITION_ORDERS,           | 4
                        | NUTRITION_ORDER_ITEMS, INVENTORY                |
5. AI Retention         | RECOMMENDATIONS, MEMBER_CARE_LOGS               | 2
6. He thong             | CHALLENGES, USER_CHALLENGES, BADGES,            | 7
                        | USER_BADGES, FITCOIN_TRANSACTIONS,              |
                        | NOTIFICATIONS, SOCIAL_POSTS                     |
7. Transformation       | TRANSFORMATION_GOALS, WORKOUT_PROGRAMS,         | 8
                        | PROGRAM_DAYS, PROGRAM_EXERCISES,                |
                        | MEMBER_PROGRAMS, BODY_METRICS,                  |
                        | PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS        |
8. Gear                 | gear_items, gear_transactions, gear_lifecycle   | 3
9. Guest & Voucher      | guests, vouchers, guest_vouchers                | 3
10. Delivery            | SHIPPING_ADDRESSES                              | 1
                        |-------------------------------------------------|-----
TONG                    |                                                  | 39

(Da xoa hoan toan, khong tinh vao tong: ASSETS, LOCKERS, ASSET_ASSIGNMENTS,
ASSET_PENALTIES, PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS.)

========================================================================

## BANG 25: TRANSFORMATION_GOALS
========================================================================

Muc dich: Luu muc tieu ca nhan cua tung member. 1 member co the co
          nhieu muc tieu (theo thoi gian), nhung chi 1 muc tieu active.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
goal_id         | INT          | PK, AUTO_INCREMENT  | Ma muc tieu                    | 1
user_id         | INT          | FK->USERS, NN       | Member so huu                  | 2
goal_type       | ENUM         | NN                  | muscle_gain/fat_loss/          | muscle_gain
                |              |                     | maintain/strength              |
target_desc     | VARCHAR(255) |                     | Mo ta chi tieu cu the          | Tang 5kg co
target_value    | DECIMAL(8,2) |                     | Gia tri muc tieu (so)          | 5.00
target_metric   | ENUM         |                     | weight_kg/lift_kg/body_fat_pct | weight_kg
deadline        | DATE         |                     | Ngay muc tieu (tuy chon)       | 2026-09-01
status          | ENUM         | DF='active'         | active/achieved/abandoned/     | active
                |              |                     | expired                        |
created_at      | DATETIME     | DF=NOW()            | Ngay tao muc tieu              | 2026-06-01

========================================================================

## BANG 26: WORKOUT_PROGRAMS
========================================================================

Muc dich: Thu vien chuong trinh tap do Gym Owner quan ly. Gym Owner
          tao, sua, tat; member chon 1 chuong trinh de bat dau.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
program_id      | INT          | PK, AUTO_INCREMENT  | Ma chuong trinh                | 1
gym_id          | INT          | FK->GYMS, NN, DF=1  | Phong tap (luon = 1)           | 1
name            | VARCHAR(150) | NN                  | Ten chuong trinh               | 12-Week Bulk 4x/tuan
goal_type       | ENUM         | NN                  | muscle_gain/fat_loss/          | muscle_gain
                |              |                     | maintain/strength              |
level           | ENUM         | NN                  | beginner/intermediate/advanced | intermediate
duration_weeks  | INT          | NN, CK>0            | So tuan (thuong la 12)         | 12
days_per_week   | INT          | NN, CK>=2, CK<=6    | So ngay tap moi tuan           | 4
description     | TEXT         |                     | Mo ta chi tiet, muc tieu       | Chuong trinh 12 tuan...
is_active       | BOOLEAN      | DF=true             | Con duoc goi y cho member      | true

========================================================================

## BANG 27: PROGRAM_DAYS
========================================================================

Muc dich: Cau truc tung ngay trong chuong trinh tap. 12 tuan x 4 ngay/tuan
          = toi da 48 ban ghi cho 1 chuong trinh.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
day_id          | INT          | PK, AUTO_INCREMENT  | Ma ngay tap                    | 1
program_id      | INT          | FK->WORKOUT_PROGRAMS | Chuong trinh chua ngay tap    | 1
week_number     | INT          | NN, CK>=1           | Tuan thu may (1-12)            | 3
day_number      | INT          | NN, CK>=1, CK<=7    | Ngay trong tuan (1=Mon, 7=Sun) | 1
session_name    | VARCHAR(100) |                     | Ten buoi tap                   | Push Day A
muscle_focus    | TEXT(JSON)   |                     | Nhom co chinh                  | ["chest","shoulders"]
is_rest_day     | BOOLEAN      | DF=false            | La ngay nghi (khong co bai tap)| false

========================================================================

## BANG 28: PROGRAM_EXERCISES
========================================================================

Muc dich: Danh sach bai tap cu the trong 1 ngay tap cua chuong trinh.
          Day la du lieu go y cho member, member co the chinh sua truoc khi bat dau.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
exercise_id     | INT          | PK, AUTO_INCREMENT  | Ma bai tap trong CT            | 1
day_id          | INT          | FK->PROGRAM_DAYS, NN| Ngay tap chua bai nay          | 5
exercise_name   | VARCHAR(100) | NN                  | Ten bai tap                    | Bench Press
muscle_group    | ENUM         | NN                  | chest/back/shoulders/biceps/   | chest
                |              |                     | triceps/quads/hamstrings/      |
                |              |                     | glutes/calves/core             |
target_sets     | INT          | NN, CK>0            | So set muc tieu                | 4
target_reps_min | INT          | NN, CK>0            | Rep toi thieu muc tieu         | 8
target_reps_max | INT          | NN                  | Rep toi da muc tieu            | 10
target_rpe      | DECIMAL(3,1) |                     | Rate of Perceived Exertion     | 7.5
rest_seconds    | INT          | DF=90               | Nghi giua set (giay)           | 90
order_in_day    | INT          | NN                  | Thu tu bai trong buoi tap      | 1
notes           | TEXT         |                     | Ghi chu ky thuat               | Kep khuyu tay vao

========================================================================

## BANG 29: MEMBER_PROGRAMS
========================================================================

Muc dich: Ghi nhan member dang chay hoac da chay chuong trinh nao.
          Ket noi USERS - WORKOUT_PROGRAMS - TRANSFORMATION_GOALS.

Truong            | Kieu         | Rang buoc           | Mo ta                          | Vi du
------------------|--------------|---------------------|--------------------------------|------------------
member_program_id | INT          | PK, AUTO_INCREMENT  | Ma tham gia chuong trinh       | 1
user_id           | INT          | FK->USERS, NN       | Member tham gia                | 2
program_id        | INT          | FK->WORKOUT_PROGRAMS| Chuong trinh dang chay         | 1
goal_id           | INT          | FK->TRANSFORMATION_GOALS | Muc tieu kem theo (null OK)| 3
start_date        | DATE         | NN                  | Ngay bat dau CT                | 2026-06-01
expected_end_date | DATE         | NN                  | Ngay du kien hoan thanh        | 2026-08-24
current_week      | INT          | DF=1, CK>=1         | Dang o tuan thu may            | 3
status            | ENUM         | DF='active'         | active/completed/abandoned/    | active
                  |              |                     | paused                         |
completion_pct    | DECIMAL(5,2) | DF=0, CK>=0         | % tien do hoan thanh           | 16.67
created_at        | DATETIME     | DF=NOW()            | Ngay tao                       | 2026-06-01

Index: idx_member_programs_user_status (user_id, status)

========================================================================

## BANG 30: BODY_METRICS
========================================================================

Muc dich: Ghi nhan so do co the theo thoi gian do member tu nhap.
          Khong can may do chuyen dung, chi can can nha.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
metric_id       | INT          | PK, AUTO_INCREMENT  | Ma ban ghi so do               | 1
user_id         | INT          | FK->USERS, NN       | Member nhap so do              | 2
recorded_at     | DATETIME     | NN                  | Thoi diem do                   | 2026-06-01 07:00
weight_kg       | DECIMAL(5,2) |                     | Can nang (kg)                  | 72.50
body_fat_pct    | DECIMAL(4,1) |                     | % mo co the (null neu chua co) | 18.5
muscle_mass_kg  | DECIMAL(5,2) |                     | Khoi co (null neu chua co)     | 58.20
waist_cm        | DECIMAL(5,1) |                     | Vong bung (cm)                 | 82.0
chest_cm        | DECIMAL(5,1) |                     | Vong nguc (cm)                 | 95.5
arm_cm          | DECIMAL(5,1) |                     | Vong tay (cm)                  | 35.0
thigh_cm        | DECIMAL(5,1) |                     | Vong dui (cm)                  | 56.0
notes           | TEXT         |                     | Ghi chu (dieu kien do, trang thai) | Buoi sang truoc an

========================================================================

## BANG 31: PERSONAL_RECORDS
========================================================================

Muc dich: Luu ky luc ca nhan moi lan dat PR cho tung bai tap.
          Tich luy theo thoi gian, dung cho bieu do Suc Manh (Tab 2 Progress Dashboard).

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
pr_id           | INT          | PK, AUTO_INCREMENT  | Ma ky luc                      | 1
user_id         | INT          | FK->USERS, NN       | Member dat ky luc              | 2
exercise_name   | VARCHAR(100) | NN                  | Ten bai tap                    | Bench Press
pr_type         | ENUM         | NN                  | max_weight/max_reps/max_volume | max_weight
pr_value        | DECIMAL(8,2) | NN, CK>0            | Gia tri ky luc                 | 65.00
previous_value  | DECIMAL(8,2) |                     | PR truoc do (de tinh % tang)   | 62.50
improvement_pct | DECIMAL(5,2) |                     | % cai thien so voi truoc       | 4.00
achieved_at     | DATETIME     | NN                  | Thoi diem dat PR               | 2026-06-15 09:30
session_id      | INT          | FK->WORKOUT_SESSIONS| Buoi tap dat PR nay            | 25

Index: idx_pr_user_exercise (user_id, exercise_name)
       idx_pr_user_achieved (user_id, achieved_at)

========================================================================

## BANG 32: MILESTONE_ACHIEVEMENTS
========================================================================

Muc dich: Ghi nhan tat ca milestone member da dat duoc, kem theo
          phan thuong va trang thai chia se Share Card.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
achievement_id  | INT          | PK, AUTO_INCREMENT  | Ma thanh tich                  | 1
user_id         | INT          | FK->USERS, NN       | Member dat milestone           | 2
milestone_code  | VARCHAR(10)  | NN                  | Ma milestone (M01, M32, M42)   | M20
milestone_data  | TEXT(JSON)   |                     | Du lieu cu the cua milestone   | {"exercise":"Bench Press","value":65}
fitcoin_awarded | INT          | DF=0, CK>=0         | FitCoin da thuong              | 30
xp_awarded      | INT          | DF=0, CK>=0         | XP da thuong                   | 150
share_card_url  | VARCHAR(500) |                     | URL anh Share Card (null neu khong tao)| https://...
is_shared       | BOOLEAN      | DF=false            | Member da share len mang xa hoi| false
achieved_at     | DATETIME     | NN                  | Thoi diem dat milestone        | 2026-06-15 09:30
notified_at     | DATETIME     |                     | Thoi diem da gui notification  | 2026-06-15 09:31

Index: idx_milestones_user (user_id)
       idx_milestones_code (milestone_code)

========================================================================

## BANG 33: gear_items
========================================================================

Muc dich: Danh muc dung cu the thao (mua ban / cho thue). B2C ONLY (cap nhat
          05/07/2026) — gear la tai san cua phong gym, khong con mo hinh
          peer-to-peer giua cac Member. Moi gear la 1 vat the rieng le (KHONG co
          qty_total/qty_available), trang thai quan ly qua is_available (BOOLEAN).
          Ten bang thuc te trong code (ERD cu ghi sai la GEAR_PRODUCTS).

Truong             | Kieu           | Rang buoc        | Mo ta                             | Vi du
-------------------|----------------|-------------------|------------------------------------|-------------------
gear_id            | VARCHAR(20)    | PK               | Dinh dang GEAR-XXXX-XXXX          | GEAR-A1B2-C3D4
current_owner_id   | INT            | FK->USERS        | Chu so huu — luon la GymOwner      | 4
category           | ENUM           | NN               | Weights/Apparel/Supplements/       | Weights
                   |                |                  | Accessories/Cardio/Recovery/       |
                   |                |                  | shoes                              |
name               | VARCHAR(200)   | NN               | Ten san pham                       | Ta don 10kg
description        | TEXT           |                  | Mo ta chi tiet                     | Ta don cao su boc...
condition_rating   | INT            | CK 1-5           | Danh gia tinh trang (1-5)          | 4
condition_notes    | TEXT           |                  | Ghi chu tinh trang                 | Xuoc nhe o day
images             | JSON           |                  | Danh sach URL anh                  | ["https://..."]
listing_type       | ENUM           | NN               | sell / rent / both                 | rent
sell_price         | DECIMAL(10,2)  |                  | Gia ban (NULL neu khong ban)        | 350000
rent_price_day     | DECIMAL(10,2)  |                  | Gia thue/ngay (NULL neu khong thue) | 30000
rent_price_week    | DECIMAL(10,2)  |                  | Gia thue/tuan                      | 180000
deposit_amount     | DECIMAL(10,2)  |                  | Tien coc bat buoc khi thue          | 200000
qr_code_url        | VARCHAR(500)   |                  | URL ma QR dinh danh gear            | https://...
verified           | BOOLEAN        | DF=false         | GymOwner da xac minh gear           | true
is_available       | BOOLEAN        | DF=true          | Con san sang de ban/cho thue        | true
avg_rating         | DECIMAL(3,2)   |                  | Diem danh gia trung binh            | 4.50
total_reviews      | INT            | DF=0             | So luot danh gia                    | 8
created_at         | DATETIME       | DF=NOW()         | Ngay dang tin                       | 2026-06-01

Rang buoc nghiep vu:
  BR-11B (cap nhat 05/07/2026): gear la tai san cua phong gym (B2C only) — CHI
  GymOwner duoc tao listing (sell/rent/both); Member/Guest chi mua/thue.
  BR-13 : deposit_amount >= 50% gia tri gear.

========================================================================

## BANG 34: gear_transactions
========================================================================

Muc dich: Giao dich mua/thue gear. Chua ca don mua (type='sale') lan don thue
          (type='rental') trong cung 1 bang. Ten bang thuc te trong code (ERD cu
          ghi sai la GEAR_RENTALS).

Truong          | Kieu           | Rang buoc                 | Mo ta                        | Vi du
----------------|----------------|---------------------------|------------------------------|-------------------
transaction_id  | INT            | PK, AUTO_INCREMENT        | Ma giao dich                 | 1
gear_id         | VARCHAR(20)    | FK->gear_items, NN        | Gear giao dich               | GEAR-A1B2-C3D4
seller_id       | INT            | FK->USERS, NN             | Luon la GymOwner (B2C only)  | 4
buyer_id        | INT            | FK->USERS, NN             | Member/Guest mua; chi Member duoc thue | 12
type            | ENUM           | NN                        | sale / rental                | rental
amount          | DECIMAL(10,2)  | NN                        | So tien giao dich             | 180000
deposit         | DECIMAL(10,2)  | DF=0                      | Tien coc (chi rental)         | 200000
fitcoin_used    | DECIMAL(10,2)  | DF=0                      | FitCoin da dung giam gia      | 20000
rental_start    | DATE           | NULL                      | Ngay bat dau thue (rental)    | 2026-06-18
rental_end      | DATE           | NULL                      | Ngay tra du kien (rental)     | 2026-06-25
status          | ENUM           | NN, DF='pending'          | pending/active/completed/     | active
                |                |                           | disputed                      |
created_at      | DATETIME       | DF=NOW()                  | Ngay tao giao dich            | 2026-06-18

Ghi chu: buyer_id chi tro den USERS (Member); Guest khong duoc thue gear (FR-061).

========================================================================

## BANG 35: gear_lifecycle
========================================================================

Muc dich: Lich su toan bo vong doi 1 gear item: dang ban, ban, cho thue, tra lai,
          dang lai. Bang moi, bo sung so voi ERD cu.

Truong             | Kieu           | Rang buoc          | Mo ta                          | Vi du
-------------------|----------------|--------------------|--------------------------------|-------------------
lifecycle_id       | INT            | PK, AUTO_INCREMENT | Ma su kien vong doi            | 1
gear_id            | VARCHAR(20)    | FK->gear_items, NN | Gear lien quan                 | GEAR-A1B2-C3D4
owner_id           | INT            | FK->USERS, NN      | Nguoi so huu tai thoi diem do  | 12
action             | ENUM           | NN                 | listed/sold/rented/returned/   | rented
                   |                |                    | relisted                       |
condition_at_time  | INT            | CK 1-5             | Tinh trang gear tai thoi diem  | 4
notes              | TEXT           |                    | Ghi chu su kien                | Giao cho member thue
photos             | JSON           |                    | Anh chup tinh trang            | ["https://..."]
price_snapshot     | DECIMAL(10,2)  |                    | Gia tai thoi diem su kien      | 180000
timestamp          | DATETIME       | DF=NOW()           | Thoi diem xay ra su kien       | 2026-06-18 09:00

========================================================================

## BANG 36: guests
========================================================================

Muc dich: Khach hang mua tai quay qua OTP checkout, khong co tai khoan USERS.

Truong                | Kieu           | Rang buoc          | Mo ta                          | Vi du
----------------------|----------------|--------------------|--------------------------------|-------------------
guest_id              | INT            | PK, AUTO_INCREMENT | Ma guest                       | 4
phone                 | VARCHAR(15)    | UQ                 | SDT (dung de xac thuc OTP)     | 0909887766
email                 | VARCHAR(255)   |                    | Email (tuy chon)               | guest@gmail.com
name                  | VARCHAR(255)   |                    | Ten khach hang                | Tran Van Binh
first_visit_at        | DATETIME       |                    | Lan ghe tham dau tien          | 2026-06-01 10:00
last_visit_at         | DATETIME       |                    | Lan ghe tham gan nhat          | 2026-06-20 15:00
total_purchases       | INT            | DF=0               | Tong so lan mua hang           | 3
total_spent           | DECIMAL(12,2)  | DF=0               | Tong tien da chi tieu          | 450000
upsell_voucher_id     | INT            | FK->vouchers       | Voucher goi y de chuyen doi     | 2
voucher_last_shown_at | DATETIME       |                    | Lan cuoi hien voucher upsell   | 2026-06-20 15:05
created_at            | DATETIME       | DF=NOW()           | Ngay tao ban ghi               | 2026-06-01
updated_at            | DATETIME       |                    | Lan cap nhat gan nhat          | 2026-06-20

Ghi chu: Session Guest co hieu luc 2 gio sau khi xac thuc OTP thanh cong. Guest chi
duoc mua food/supplement, KHONG duoc thue gear va KHONG duoc delivery (can dia chi
da xac thuc cua Member).

========================================================================

## BANG 37: vouchers
========================================================================

Muc dich: Ma giam gia tang cho guest de khuyen khich chuyen doi thanh Member.

Truong                     | Kieu           | Rang buoc          | Mo ta                          | Vi du
---------------------------|----------------|--------------------|--------------------------------|-------------------
voucher_id                 | INT            | PK, AUTO_INCREMENT | Ma voucher                     | 2
code                       | VARCHAR(50)    | UQ, NN             | Ma code khach nhap             | WELCOME10
discount_percent           | INT            |                    | % giam gia (NULL neu giam theo so tien) | 10
discount_amount            | DECIMAL(10,2)  |                    | So tien giam co dinh            | 20000
min_purchase_amount        | DECIMAL(10,2)  | DF=0               | Gia tri don toi thieu de dung   | 100000
applicable_to_nutrition    | BOOLEAN        | DF=true            | Ap dung cho don dinh duong      | true
applicable_to_membership   | BOOLEAN        | DF=false           | Ap dung cho dang ky goi tap     | true
max_uses                   | INT            | NULL               | Gioi han luot dung (NULL=khong gioi han) | 100
current_uses               | INT            | DF=0               | So luot da dung                | 15
start_date                 | DATETIME       |                    | Ngay bat dau hieu luc           | 2026-06-01
end_date                   | DATETIME       |                    | Ngay het hieu luc               | 2026-12-31
description                | TEXT           |                    | Mo ta chuong trinh voucher      | Giam 10% cho lan dau
created_at                 | DATETIME       | DF=NOW()           | Ngay tao                       | 2026-06-01

========================================================================

## BANG 38: guest_vouchers
========================================================================

Muc dich: Bang trung gian N-N giua guests va vouchers — ghi nhan voucher nao da
          duoc cap cho guest nao va da su dung hay chua.

Truong             | Kieu           | Rang buoc          | Mo ta                          | Vi du
-------------------|----------------|--------------------|--------------------------------|-------------------
guest_voucher_id   | INT            | PK, AUTO_INCREMENT | Ma dong                        | 1
guest_id           | INT            | FK->guests, NN     | Guest duoc cap voucher         | 4
voucher_id         | INT            | FK->vouchers, NN   | Voucher duoc cap               | 2
assigned_at        | DATETIME       | DF=NOW()           | Thoi diem cap voucher          | 2026-06-20 15:05
used_at            | DATETIME       | NULL               | Thoi diem da dung (NULL=chua)  | null
order_id           | INT            | FK->NUTRITION_ORDERS, NULL | Don hang da ap dung (NULL neu chua dung) | null

========================================================================

## BANG 39: SHIPPING_ADDRESSES
========================================================================

Muc dich: Luu dia chi giao hang ca nhan cua Member. 1 Member co nhieu
          dia chi, dat 1 dia chi mac dinh. Dung cho ca don nutrition
          va don mua gear khi chon hinh thuc giao hang.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
address_id      | INT          | PK, AUTO_INCREMENT  | Ma dia chi                     | 1
user_id         | INT          | FK->USERS, NN       | Member so huu dia chi          | 2
full_name       | VARCHAR(100) | NN                  | Ten nguoi nhan                 | Nguyen Van An
phone           | VARCHAR(15)  | NN                  | SDT nguoi nhan                 | 0901234567
address_line    | VARCHAR(300) | NN                  | So nha, ten duong              | 123 Nguyen Trai
ward            | VARCHAR(100) | NN                  | Phuong / Xa                    | P. Ben Thanh
district        | VARCHAR(100) | NN                  | Quan / Huyen                   | Q. 1
city            | VARCHAR(100) | NN, DF='Ho Chi Minh'| Thanh pho                      | Ho Chi Minh
is_default      | BOOLEAN      | DF=false            | Dia chi mac dinh               | true
created_at      | DATETIME     | DF=NOW()            | Thoi gian tao                  | 2026-05-10

Rang buoc:
  - Moi user chi co 1 dia chi mac dinh (is_default=true) tai mot thoi diem.
  - Khi dat mac dinh moi: tu dong bo is_default=false cac dia chi cu.
  - Guest khong co SHIPPING_ADDRESSES — nhap dia chi tu do (TEXT field trong don hang).
  - Gear thue (gear_transactions type='rental') KHONG ship — member phai den quay
    nhan truc tiep.

========================================================================
KET THUC FILE 08
========================================================================
