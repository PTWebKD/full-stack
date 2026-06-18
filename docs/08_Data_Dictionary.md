# 08. TU DIEN DU LIEU
# (Data Dictionary)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 18/06/2026 (Cap nhat: Dinh huong lai Gym Management System)

========================================================================

Giai thich cac cot:
  Truong    : Ten truong (column name).
  Kieu      : Kieu du lieu SQL.
  Rang buoc : PK, FK, NN=Not Null, UQ=Unique, DF=Default, CK=Check.
  Mo ta     : Y nghia.
  Vi du     : Gia tri mau.

Tong so bang: 27 bang trong 7 nhom.

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
duration_days        | INT          | NN, CK>0            | Thoi han (ngay). 0 = day pass     | 30
price_monthly        | DECIMAL(12,2)| NN                  | Gia thang (VND)                   | 600000
price_annual         | DECIMAL(12,2)|                     | Gia nam = x10 thang (tiet kiem 2) | 6000000
amenity_towel        | BOOLEAN      | DF=false            | Kem khan mien phi                 | true
amenity_locker       | BOOLEAN      | DF=false            | Kem locker thang                  | true
amenity_equipment    | BOOLEAN      | DF=false            | Kem dung cu phu tro               | false
pt_sessions_included | INT          | DF=0                | So buoi PT kem theo               | 0
is_active            | BOOLEAN      | DF=true             | Goi dang con ban                  | true
created_at           | DATETIME     | DF=NOW()            | Ngay tao goi                      | 2026-05-01

Goi mau: Day Pass (1 ngay), Basic, Standard (kem khan), Premium (kem khan+locker),
         PT Plus (kem 12 buoi PT), Student (giam gia, gioi han gio).

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
                |              |                     | asset/pt                       |
reference_id    | INT          |                     | Ma ban ghi nguon              | 10
                |              |                     | (membership_id, order_id...)   |
total_amount    | DECIMAL(12,2)| NN                  | Tong tien truoc FitCoin        | 150000
fitcoin_used    | DECIMAL(12,2)| DF=0                | FitCoin da dung giam gia       | 50000
final_amount    | DECIMAL(12,2)| NN                  | Tong tien thuc te phai tra     | 100000
payment_method  | VARCHAR(50)  |                     | vnpay/momo/cash/fitcoin        | vnpay
payment_status  | ENUM         | DF='pending'        | pending/paid/failed/refunded   | paid
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
category             | ENUM         | NN                  | protein/drink/snack/meal/      | protein
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

Muc dich: Don hang dinh duong noi bo. Khong co guest_phone (chi Member).

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
order_id        | INT          | PK, AUTO_INCREMENT  | Ma don hang                    | 1
user_id         | INT          | FK->USERS, NN       | Member mua hang                | 2
created_by      | INT          | FK->USERS, NN       | Nhan vien tao don (pos_sale)   | 6
order_type      | ENUM         | NN                  | pos_sale / pre_order           | pos_sale
status          | ENUM         | DF='pending'        | pending/preparing/ready/done   | done
total_amount    | DECIMAL(12,2)| NN                  | Tong tien (truoc FitCoin)      | 150000
fitcoin_used    | DECIMAL(12,2)| DF=0                | FitCoin dung de giam gia       | 25000
invoice_id      | INT          | FK->INVOICES        | Lien ket hoa don               | 3
notes           | TEXT         |                     | Ghi chu them                   | 
created_at      | DATETIME     | DF=NOW()            | Thoi gian tao don              | 2026-05-10

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

## BANG 16: ASSETS
========================================================================

Muc dich: Danh muc tai san phong tap: khan, tham, dai lung, gang tay, day keo.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
asset_id        | INT          | PK, AUTO_INCREMENT  | Ma tai san                     | 1
asset_code      | VARCHAR(20)  | UQ, NN              | Ma vat ly (KHAN-001)           | KHAN-001
type            | ENUM         | NN                  | towel/mat/belt/glove/rope      | towel
status          | ENUM         | DF='available'      | available/in_use/maintenance/  | available
                |              |                     | lost                           |
condition       | ENUM         | DF='good'           | good/worn/damaged              | good
loss_fee        | DECIMAL(10,2)| DF=0                | Phi mat tai san (VND)          | 50000
damage_fee      | DECIMAL(10,2)| DF=0                | Phi hong tai san (VND)         | 20000
created_at      | DATETIME     | DF=NOW()            | Ngay them vao he thong         | 2026-05-01

========================================================================

## BANG 17: LOCKERS
========================================================================

Muc dich: Quan ly tung o locker cua phong tap.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
locker_id       | INT          | PK, AUTO_INCREMENT  | Ma locker                      | 1
locker_code     | VARCHAR(10)  | UQ, NN              | So o locker (A01, B12...)      | A01
status          | ENUM         | DF='available'      | available/in_use/maintenance   | available
locker_type     | ENUM         | NN                  | daily / monthly                | monthly
monthly_fee     | DECIMAL(10,2)| DF=0                | Phi thue thang (neu co)        | 50000
created_at      | DATETIME     | DF=NOW()            | Ngay them vao he thong         | 2026-05-01

========================================================================

## BANG 18: ASSET_ASSIGNMENTS
========================================================================

Muc dich: Ghi nhan moi lan cap phat va thu hoi tai san / locker.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
assignment_id   | INT          | PK, AUTO_INCREMENT  | Ma cap phat                    | 1
asset_id        | INT          | FK->ASSETS          | Tai san duoc cap (null neu locker) | 3
locker_id       | INT          | FK->LOCKERS         | Locker duoc cap (null neu tai san) | null
user_id         | INT          | FK->USERS, NN       | Member nhan tai san            | 2
checkin_id      | INT          | FK->CHECK_INS       | Kem voi luot check-in          | 10
assigned_at     | DATETIME     | NN                  | Thoi gian cap phat             | 2026-05-10 08:30
due_back        | DATETIME     |                     | Han tra (null = tra luc ra)    | null
returned_at     | DATETIME     |                     | Thoi gian da tra (null = chua) | null
return_status   | ENUM         | DF='pending'        | pending/returned/damaged/lost  | returned
staff_note      | TEXT         |                     | Ghi chu cua nhan vien          | Khan sach

========================================================================

## BANG 19: ASSET_PENALTIES
========================================================================

Muc dich: Phi phat phat sinh do mat/hong tai san.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
penalty_id      | INT          | PK, AUTO_INCREMENT  | Ma phi phat                    | 1
assignment_id   | INT          | FK->ASSET_ASSIGNMENTS, NN | Ma lan cap phat lien quan | 5
penalty_type    | ENUM         | NN                  | loss / damage / late_return    | loss
amount          | DECIMAL(10,2)| NN, CK>0            | So tien phat (VND)             | 50000
description     | TEXT         |                     | Mo ta chi tiet vi sao phat     | Mat khan KHAN-001
status          | ENUM         | DF='pending'        | pending / paid                 | pending
invoice_id      | INT          | FK->INVOICES        | Lien ket hoa don               | 7
created_at      | DATETIME     | DF=NOW()            | Ngay ghi nhan phi phat         | 2026-05-10

========================================================================

## BANG 20: PT_TRAINERS
========================================================================

Muc dich: Thong tin HLV (Personal Trainer) cua phong tap.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
trainer_id      | INT          | PK, AUTO_INCREMENT  | Ma HLV                         | 1
name            | VARCHAR(100) | NN                  | Ten HLV                        | Coach Minh
specialty       | VARCHAR(200) |                     | Chuyen mon                     | Powerlifting, Yoga
schedule        | TEXT(JSON)   |                     | Lich lam viec theo ngay        | {"mon":"8:00-17:00"}
price_per_session | DECIMAL(10,2)| NN               | Gia 1 buoi PT (VND)            | 200000
is_active       | BOOLEAN      | DF=true             | Dang lam viec                  | true
created_at      | DATETIME     | DF=NOW()            | Ngay them                      | 2026-05-01

========================================================================

## BANG 21: PT_BOOKINGS
========================================================================

Muc dich: Lich dat buoi PT cua member.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
booking_id      | INT          | PK, AUTO_INCREMENT  | Ma lich dat                    | 1
trainer_id      | INT          | FK->PT_TRAINERS, NN | HLV phu trach                  | 1
user_id         | INT          | FK->USERS, NN       | Member dat buoi                | 2
scheduled_at    | DATETIME     | NN                  | Thoi gian buoi PT              | 2026-05-12 09:00
duration_min    | INT          | DF=60               | Thoi luong (phut)              | 60
status          | ENUM         | DF='scheduled'      | scheduled/done/cancelled       | done
notes           | TEXT         |                     | Ghi chu them                   | Tap chan
created_at      | DATETIME     | DF=NOW()            | Ngay dat                       | 2026-05-10

========================================================================

## BANG 22: PT_SESSIONS
========================================================================

Muc dich: Ket qua thuc te cua buoi tap PT (HLV ghi sau khi tap xong). 1:1 PT_BOOKINGS.

Truong          | Kieu         | Rang buoc           | Mo ta                          | Vi du
----------------|--------------|---------------------|--------------------------------|------------------
pt_session_id   | INT          | PK, AUTO_INCREMENT  | Ma ket qua buoi PT             | 1
booking_id      | INT          | FK->PT_BOOKINGS, UQ, NN | Ma lich dat               | 1
exercises_done  | TEXT(JSON)   |                     | Danh sach bai da lam           | [{"name":"Squat","sets":4}]
trainer_notes   | TEXT         |                     | Nhan xet cua HLV               | Tien bo tot o Squat
member_feedback | TEXT         |                     | Phan hoi cua member            | Tap rat hay
created_at      | DATETIME     | DF=NOW()            | Thoi gian ghi ket qua          | 2026-05-12

========================================================================

## BANG 23: RECOMMENDATIONS
========================================================================

Muc dich: AI care queue — danh sach hoi vien can cham soc voi ly do va goi y hanh dong.

Truong               | Kieu         | Rang buoc           | Mo ta                          | Vi du
---------------------|--------------|---------------------|--------------------------------|------------------
rec_id               | INT          | PK, AUTO_INCREMENT  | Ma recommendation              | 1
user_id              | INT          | FK->USERS, NN       | Member can cham soc            | 3
recommendation_type  | ENUM         | NN                  | renew_reminder/inactive_alert/ | renew_reminder
                     |              |                     | upsell_plan/upsell_pt/         |
                     |              |                     | upsell_nutrition               |
priority             | ENUM         | NN                  | high / medium / low            | high
suggested_action     | TEXT         |                     | Goi y hanh dong cu the         | Goi dien nhac gia han
status               | ENUM         | DF='pending'        | pending/handled/dismissed      | pending
created_at           | DATETIME     | DF=NOW()            | Thoi diem tao recommendation   | 2026-05-10
resolved_at          | DATETIME     |                     | Thoi diem xu ly (null = chua)  | null

Index: idx_rec_user_status (user_id, status)
       idx_rec_status_priority (status, priority)

========================================================================

## BANG 24: MEMBER_CARE_LOGS
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

## BANG 25: CHALLENGES
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

## BANG 26: USER_CHALLENGES
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

## BANG 27: FITCOIN_TRANSACTIONS
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
                |              |                     | membership_spend               |
reference_id    | INT          |                     | ID ban ghi lien quan           | 5
created_at      | DATETIME     | DF=NOW()            | Thoi gian giao dich            | 2026-05-10

========================================================================

## BANG 28: NOTIFICATIONS
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

## BANG 29: SOCIAL_POSTS
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

Nhom            | Bang                                      | So bang
----------------|-------------------------------------------|---------
Nguoi dung      | USERS, FITNESS_PASSPORT, FOLLOWS          | 3
Gym Tracking    | WORKOUT_SESSIONS, EXERCISE_LOGS, CHECK_INS | 3
Membership      | GYMS, MEMBERSHIP_PLANS, GYM_MEMBERSHIPS, | 5
                | MEMBERSHIP_HISTORY, INVOICES               |
Nutrition       | NUTRITION_PRODUCTS, NUTRITION_ORDERS,     | 4
                | NUTRITION_ORDER_ITEMS, INVENTORY           |
Asset & Amenities | ASSETS, LOCKERS, ASSET_ASSIGNMENTS,     | 4
                | ASSET_PENALTIES                            |
PT & AI         | PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS,    | 5
                | RECOMMENDATIONS, MEMBER_CARE_LOGS          |
He thong        | CHALLENGES, USER_CHALLENGES, BADGES,      | 6
                | FITCOIN_TRANSACTIONS, NOTIFICATIONS,       |
                | SOCIAL_POSTS                               |
Transformation  | TRANSFORMATION_GOALS, WORKOUT_PROGRAMS,  | 8
                | PROGRAM_DAYS, PROGRAM_EXERCISES,           |
                | MEMBER_PROGRAMS, BODY_METRICS,             |
                | PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS   |
                |-------------------------------------------|-----
TONG            |                                           | 38

========================================================================

## BANG 30: TRANSFORMATION_GOALS
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

## BANG 31: WORKOUT_PROGRAMS
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

## BANG 32: PROGRAM_DAYS
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

## BANG 33: PROGRAM_EXERCISES
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

## BANG 34: MEMBER_PROGRAMS
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

## BANG 35: BODY_METRICS
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

## BANG 36: PERSONAL_RECORDS
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

## BANG 37: MILESTONE_ACHIEVEMENTS
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

## GHI CHU: TRUONG BO SUNG CHO BANG HIEN CO
========================================================================

WORKOUT_SESSIONS — bo sung 4 truong:
  member_program_id   INT   FK->MEMBER_PROGRAMS (nullable — null neu tap tu do)
  program_day_id      INT   FK->PROGRAM_DAYS (nullable)
  customized_from_prog BOOLEAN  DF=false — member co chinh sua goi y khong?
  customization_log   JSON  DF=NULL — {added:[], removed:[], modified:[]}

EXERCISE_LOGS — bo sung 2 truong:
  program_exercise_id INT   FK->PROGRAM_EXERCISES (nullable — null neu tu them)
  overload_suggestion JSON  DF=NULL — {next_weight:52.5, reason:"exceeded target 2x"}

RECOMMENDATIONS.recommendation_type — mo rong ENUM:
  Them 3 gia tri moi: inactive_program, goal_achieved_upsell, technique_issue_upsell_pt

FITCOIN_TRANSACTIONS.source — mo rong ENUM:
  Them: milestone_reward (tu Milestone Engine)

========================================================================
KET THUC FILE 08
========================================================================
