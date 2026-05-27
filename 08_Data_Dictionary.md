# 08. TU DIEN DU LIEU
# (Data Dictionary)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich cac cot trong Data Dictionary:

  Truong      : Ten truong (column name) trong database.
  Kieu        : Kieu du lieu SQL.
  Do dai      : Gioi han ky tu hoac do chinh xac.
  Rang buoc   : PK = Primary Key, FK = Foreign Key, NN = Not Null,
                UQ = Unique, CK = Check constraint, DF = Default value.
  Mo ta       : Y nghia cua truong.
  Vi du       : Gia tri mau.

========================================================================

## BANG 1: USERS
========================================================================

Muc dich: Luu thong tin tat ca nguoi dung he thong (member, vendor,
          gym_owner, gym_owner).

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
user_id         | INT          |         | PK, AUTO_INCREMENT     | Ma dinh danh user             | 1
email           | VARCHAR      | 255     | UQ, NN                 | Email dang nhap               | an@gmail.com
phone           | VARCHAR      | 15      | UQ                     | So dien thoai                 | 0912345678
password_hash   | VARCHAR      | 255     | NN                     | Mat khau da hash bcrypt       | $2b$10$xyz...
role            | ENUM         |         | NN, DF='member'        | Vai tro trong he thong        | member
                |              |         |                        | Gia tri: guest, member,       |
                |              |         |                        | vendor, gym_owner, gym_owner      |
display_name    | VARCHAR      | 100     | NN                     | Ten hien thi                  | Anh Duc
avatar_url      | VARCHAR      | 500     |                        | URL anh dai dien              | https://...
fitness_goal    | ENUM         |         |                        | Muc tieu the hinh             | bulk
                |              |         |                        | Gia tri: bulk, cut, maintain  |
xp_total        | INT          |         | DF=0, CK>=0           | Tong diem XP tich luy         | 1250
current_level   | INT          |         | DF=1, CK>=1           | Level hien tai                | 4
current_streak  | INT          |         | DF=0, CK>=0           | So ngay streak lien tiep      | 12
fitcoin_balance | DECIMAL      | 12,2    | DF=0, CK>=0           | So du FitCoin                 | 5000.00
tdee            | INT          |         | CK>0                  | TDEE da tinh (kcal/ngay)      | 2200
referred_by     | INT          |         | FK->USERS.user_id     | User da gioi thieu            | 5
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao tai khoan            | 2026-05-01 10:00

Index: idx_users_email (email), idx_users_phone (phone)

========================================================================

## BANG 2: FITNESS_PASSPORT
========================================================================

Muc dich: Luu ho so the hinh tong hop cua moi user. Quan he 1:1 voi USERS.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
passport_id     | INT          |         | PK, AUTO_INCREMENT     | Ma passport                   | 1
user_id         | INT          |         | FK->USERS, UQ, NN      | User so huu passport          | 1
total_sessions  | INT          |         | DF=0                   | Tong so buoi tap              | 48
total_volume    | DECIMAL      | 12,2    | DF=0                   | Tong volume (kg * reps)       | 125000.00
longest_streak  | INT          |         | DF=0                   | Streak dai nhat tung dat      | 30
body_weight_log | TEXT         |         |                        | Lich su can nang (JSON)       | [{"date":"2026-05-01","kg":72}]
body_photos     | TEXT         |         |                        | Anh body transformation       | [{"date":"...","url":"..."}]
milestone_badges| TEXT         |         |                        | Danh sach badge da unlock     | [{"badge_id":1,"date":"..."}]
is_public       | BOOLEAN      |         | DF=true                | Cho phep nguoi khac xem       | true
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-01 10:00

========================================================================

## BANG 3: WORKOUT_SESSIONS
========================================================================

Muc dich: Luu tung buoi tap cua user.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
session_id      | INT          |         | PK, AUTO_INCREMENT     | Ma buoi tap                   | 1
user_id         | INT          |         | FK->USERS, NN          | User thuc hien                | 1
gym_id          | INT          |         | FK->GYMS               | Phong tap (null = tap o nha)  | 2
date            | DATE         |         | NN                     | Ngay tap                      | 2026-05-10
duration_min    | INT          |         |                        | Thoi luong (phut)             | 65
status          | ENUM         |         | DF='active'            | Trang thai buoi tap           | done
                |              |         |                        | Gia tri: active, done,        |
                |              |         |                        | cancelled                     |
notes           | TEXT         |         |                        | Ghi chu cua user              | Tap nang hon tuan truoc
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 08:00

Index: idx_sessions_user_date (user_id, date)

========================================================================

## BANG 4: EXERCISE_LOGS
========================================================================

Muc dich: Luu chi tiet tung bai tap trong 1 buoi tap.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
log_id          | INT          |         | PK, AUTO_INCREMENT     | Ma log                        | 1
session_id      | INT          |         | FK->SESSIONS, NN       | Thuoc buoi tap nao            | 1
exercise_name   | VARCHAR      | 200     | NN                     | Ten bai tap                   | Bench Press
muscle_group    | ENUM         |         | NN                     | Nhom co chinh                 | chest
                |              |         |                        | Gia tri: chest, back, legs,   |
                |              |         |                        | shoulders, arms, core         |
sets            | TEXT         |         | NN                     | Chi tiet sets (JSON array)    | [{"reps":10,"weight":60},
                |              |         |                        |                               |  {"reps":8,"weight":65}]
is_pr           | BOOLEAN      |         | DF=false               | Co phai PR moi khong          | true
notes           | TEXT         |         |                        | Ghi chu                       | Cam giac manh hon
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 08:15

========================================================================

## BANG 5: FOOD_PRODUCTS
========================================================================

Muc dich: Luu san pham do an healthy cua cac vendor.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
product_id      | INT          |         | PK, AUTO_INCREMENT     | Ma san pham                   | 1
vendor_id       | INT          |         | FK->USERS, NN          | Vendor dang ban               | 10
name            | VARCHAR      | 200     | NN                     | Ten mon an                    | Uc ga nuong salad
description     | TEXT         |         |                        | Mo ta chi tiet                | Uc ga nuong kem rau...
price           | DECIMAL      | 10,2    | NN, CK>0              | Gia ban (VND)                 | 65000.00
calories        | INT          |         | NN, CK>=0             | Tong calo                     | 450
protein_g       | DECIMAL      | 5,1     | NN, CK>=0             | Protein (gram)                | 42.5
carb_g          | DECIMAL      | 5,1     | NN, CK>=0             | Carbohydrate (gram)           | 30.0
fat_g           | DECIMAL      | 5,1     | NN, CK>=0             | Fat (gram)                    | 12.0
ingredients     | TEXT         |         |                        | Nguyen lieu (JSON)            | ["uc ga","rau mixed"]
allergens       | TEXT         |         |                        | Di ung (JSON)                 | ["gluten","dairy"]
images          | TEXT         |         | NN                     | URL anh (JSON, min 1)         | ["https://...jpg"]
is_available    | BOOLEAN      |         | DF=true                | Con kha dung                  | true
avg_rating      | DECIMAL      | 2,1     | DF=0                   | Diem TB (1.0-5.0)             | 4.5
total_reviews   | INT          |         | DF=0                   | Tong so review                | 23
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-04-15 09:00

Index: idx_food_vendor (vendor_id), idx_food_available (is_available)

========================================================================

## BANG 6: FOOD_ORDERS
========================================================================

Muc dich: Luu don hang food (ca Member va Guest).

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
order_id        | INT          |         | PK, AUTO_INCREMENT     | Ma don hang                   | 123
user_id         | INT          |         | FK->USERS              | User dat hang (NULL=Guest)    | 1 hoac NULL
guest_phone     | VARCHAR      | 15      |                        | SDT guest (khi user_id=NULL)  | 0912345678
vendor_id       | INT          |         | FK->USERS, NN          | Vendor nhan don               | 10
items           | TEXT         |         | NN                     | Chi tiet mon (JSON)           | [{"product_id":1,
                |              |         |                        |                               |   "qty":2,"size":"M",
                |              |         |                        |                               |   "price":65000}]
total_amount    | DECIMAL      | 12,2    | NN, CK>0              | Tong tien (da gom phi ship)   | 145000.00
fitcoin_used    | DECIMAL      | 12,2    | DF=0                   | So FitCoin da dung            | 20000.00
delivery_address| VARCHAR      | 500     | NN                     | Dia chi giao                  | 123 Nguyen Hue, Q1
delivery_time   | VARCHAR      | 50      |                        | Khung gio giao                | 12:00-12:30
status          | ENUM         |         | NN, DF='pending'       | Trang thai don hang           | confirmed
                |              |         |                        | Gia tri: pending, confirmed,  |
                |              |         |                        | preparing, delivering,        |
                |              |         |                        | delivered, cancelled          |
payment_method  | VARCHAR      | 50      |                        | Phuong thuc thanh toan        | vnpay
is_meal_prep    | BOOLEAN      |         | DF=false               | Don meal prep dinh ky         | false
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 11:30

Index: idx_orders_user (user_id), idx_orders_status (status),
       idx_orders_vendor (vendor_id)

========================================================================

## BANG 7: FOOD_REVIEWS
========================================================================

Muc dich: Luu danh gia san pham cua user.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
review_id       | INT          |         | PK, AUTO_INCREMENT     | Ma review                     | 1
product_id      | INT          |         | FK->FOOD_PRODUCTS, NN  | San pham duoc review          | 1
user_id         | INT          |         | FK->USERS, NN          | Nguoi review                  | 1
rating          | INT          |         | NN, CK BETWEEN 1 AND 5| Diem (1-5 sao)                | 5
comment         | TEXT         |         |                        | Noi dung danh gia             | Rat ngon, protein cao
photos          | TEXT         |         |                        | Anh review (JSON)             | ["https://...jpg"]
helpful_votes   | INT          |         | DF=0                   | So luot "Huu ich"             | 3
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 14:00

Rang buoc duy nhat: UQ(product_id, user_id) - moi user chi review 1 lan/SP.

========================================================================

## BANG 8: GEAR_ITEMS
========================================================================

Muc dich: Luu thong tin thiet bi gym dang ban/cho thue tren Gear Hub.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
gear_id         | VARCHAR      | 20      | PK                     | Ma duy nhat                   | GEAR-K7X2-3841
current_owner_id| INT          |         | FK->USERS, NN          | Chu nhan hien tai             | 1
category        | ENUM         |         | NN                     | Danh muc thiet bi             | dumbbell
                |              |         |                        | Gia tri: resistance_band,     |
                |              |         |                        | dumbbell, belt, gloves, mat,  |
                |              |         |                        | machine_mini, other           |
name            | VARCHAR      | 200     | NN                     | Ten thiet bi                  | Ta tay 10kg cap
description     | TEXT         |         |                        | Mo ta                         | Ta tay gang cao su...
condition_rating| INT          |         | NN, CK BETWEEN 1 AND 5| Danh gia tinh trang hien tai  | 4
condition_notes | TEXT         |         |                        | Ghi chu tinh trang            | Con moi, chi dung 2 thang
images          | TEXT         |         | NN                     | URL anh (JSON, min 2)         | ["url1","url2","url3"]
listing_type    | ENUM         |         | NN                     | Hinh thuc dang                | both
                |              |         |                        | Gia tri: sell, rent, both     |
sell_price      | DECIMAL      | 12,2    |                        | Gia ban (null neu chi thue)   | 350000.00
rent_price_day  | DECIMAL      | 10,2    |                        | Gia thue/ngay                 | 20000.00
rent_price_week | DECIMAL      | 10,2    |                        | Gia thue/tuan                 | 100000.00
deposit_amount  | DECIMAL      | 12,2    |                        | Tien coc (cho thue)           | 175000.00
qr_code_url     | VARCHAR      | 500     |                        | URL hinh QR code              | https://...png
is_available    | BOOLEAN      |         | DF=true                | Con kha dung                  | true
created_at      | DATETIME     |         | DF=NOW()               | Ngay dang                     | 2026-05-01 09:00

========================================================================

## BANG 9: GEAR_LIFECYCLE
========================================================================

Muc dich: Ghi lai toan bo lich su cua 1 thiet bi gym qua tung thoi diem.
          Day la bang cot loi cua tinh nang Gear Lifecycle.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
lifecycle_id    | INT          |         | PK, AUTO_INCREMENT     | Ma entry                      | 1
gear_id         | VARCHAR      | 20      | FK->GEAR_ITEMS, NN     | Thiet bi nao                  | GEAR-K7X2-3841
owner_id        | INT          |         | FK->USERS, NN          | Chu nhan tai thoi diem        | 1
action          | ENUM         |         | NN                     | Hanh dong xay ra              | listed
                |              |         |                        | Gia tri: listed (dang ban     |
                |              |         |                        | lan dau), sold (da ban),      |
                |              |         |                        | rented (cho thue), returned   |
                |              |         |                        | (tra lai), relisted (ban lai) |
condition_at_time| INT         |         | CK BETWEEN 1 AND 5    | Tinh trang tai thoi diem      | 4
notes           | TEXT         |         |                        | Ghi chu cua chu nhan          | Con moi, chi dung 2 thang
photos          | TEXT         |         |                        | Anh tai thoi diem (JSON)      | ["url1","url2"]
timestamp       | DATETIME     |         | DF=NOW()               | Thoi diem ghi nhan            | 2026-05-01 09:00

Index: idx_lifecycle_gear (gear_id)

========================================================================

## BANG 10: GEAR_TRANSACTIONS
========================================================================

Muc dich: Ghi nhan giao dich mua/thue gear.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
transaction_id  | INT          |         | PK, AUTO_INCREMENT     | Ma giao dich                  | 1
gear_id         | VARCHAR      | 20      | FK->GEAR_ITEMS, NN     | Thiet bi                      | GEAR-K7X2-3841
seller_id       | INT          |         | FK->USERS, NN          | Nguoi ban                     | 1
buyer_id        | INT          |         | FK->USERS, NN          | Nguoi mua/thue                | 5
type            | ENUM         |         | NN                     | Loai: sale, rental            | sale
amount          | DECIMAL      | 12,2    | NN, CK>0              | So tien giao dich             | 350000.00
deposit         | DECIMAL      | 12,2    | DF=0                   | Tien coc (cho rental)         | 175000.00
fitcoin_used    | DECIMAL      | 12,2    | DF=0                   | FitCoin da dung               | 50000.00
rental_start    | DATE         |         |                        | Ngay bat dau thue             | 2026-05-10
rental_end      | DATE         |         |                        | Ngay ket thuc thue            | 2026-05-17
status          | ENUM         |         | NN, DF='pending'       | Trang thai                    | active
                |              |         |                        | Gia tri: pending, active,     |
                |              |         |                        | completed, disputed           |
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 10:00

========================================================================

## BANG 11: GYMS
========================================================================

Muc dich: Luu thong tin phong tap gym.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
gym_id          | INT          |         | PK, AUTO_INCREMENT     | Ma phong tap                  | 1
owner_id        | INT          |         | FK->USERS, NN          | Chu phong tap                 | 20
name            | VARCHAR      | 200     | NN                     | Ten phong tap                 | Iron Gym Q1
address         | VARCHAR      | 500     | NN                     | Dia chi                       | 456 Le Lai, Q1, HCM
phone           | VARCHAR      | 15      |                        | SDT                           | 02812345678
opening_hours   | TEXT         |         |                        | Gio mo cua (JSON)             | {"mon_fri":"6:00-22:00"}
services        | TEXT         |         |                        | Dich vu (JSON)                | ["gym","yoga","boxing"]
membership_plans| TEXT         |         |                        | Cac goi tap (JSON)            | [{"name":"1 thang","price":500000}]
logo_url        | VARCHAR      | 500     |                        | Logo phong tap                | https://...png
created_at      | DATETIME     |         | DF=NOW()               | Ngay dang ky                  | 2026-04-01 08:00

========================================================================

## BANG 12: GYM_MEMBERSHIPS
========================================================================

Muc dich: Luu thong tin membership cua user tai phong tap.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
membership_id   | INT          |         | PK, AUTO_INCREMENT     | Ma membership                 | 1
user_id         | INT          |         | FK->USERS, NN          | User dang ky                  | 1
gym_id          | INT          |         | FK->GYMS, NN           | Phong tap                     | 1
plan_name       | VARCHAR      | 100     | NN                     | Ten goi tap                   | 1 thang
start_date      | DATE         |         | NN                     | Ngay bat dau                  | 2026-05-01
end_date        | DATE         |         | NN                     | Ngay het han                  | 2026-05-31
status          | ENUM         |         | NN, DF='active'        | Trang thai                    | active
                |              |         |                        | Gia tri: active, expired,     |
                |              |         |                        | cancelled                     |
auto_renew      | BOOLEAN      |         | DF=false               | Tu dong gia han               | false
payment_method  | VARCHAR      | 50      |                        | Phuong thuc TT                | vnpay
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-01 08:00

========================================================================

## BANG 13: CHALLENGES
========================================================================

Muc dich: Luu thong tin cac thu thach (weekly, monthly).

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
challenge_id    | INT          |         | PK, AUTO_INCREMENT     | Ma challenge                  | 1
title           | VARCHAR      | 200     | NN                     | Tieu de                       | Tap 5 buoi trong tuan
description     | TEXT         |         |                        | Mo ta chi tiet                | Hoan thanh 5 buoi...
type            | ENUM         |         | NN                     | Loai: weekly, monthly, special| weekly
criteria        | TEXT         |         | NN                     | Dieu kien hoan thanh (JSON)   | {"sessions_required":5}
reward_xp       | INT          |         | NN, CK>0              | Thuong XP                     | 100
reward_fitcoin  | DECIMAL      | 10,2    | DF=0                   | Thuong FitCoin                | 50.00
start_date      | DATE         |         | NN                     | Ngay bat dau                  | 2026-05-06
end_date        | DATE         |         | NN                     | Ngay ket thuc                 | 2026-05-12
is_active       | BOOLEAN      |         | DF=true                | Dang hoat dong                | true

========================================================================

## BANG 14: USER_CHALLENGES
========================================================================

Muc dich: Luu tien do tham gia challenge cua tung user.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
id              | INT          |         | PK, AUTO_INCREMENT     | Ma ban ghi                    | 1
user_id         | INT          |         | FK->USERS, NN          | User tham gia                 | 1
challenge_id    | INT          |         | FK->CHALLENGES, NN     | Challenge tham gia            | 1
progress        | TEXT         |         |                        | Tien do (JSON)                | {"sessions_done":3}
status          | ENUM         |         | NN, DF='in_progress'   | Trang thai                    | in_progress
                |              |         |                        | Gia tri: in_progress,         |
                |              |         |                        | completed, failed             |
completed_at    | DATETIME     |         |                        | Thoi diem hoan thanh          | 2026-05-10 18:00

Rang buoc: UQ(user_id, challenge_id) - moi user chi tham gia 1 challenge 1 lan.

========================================================================

## BANG 15: BADGES
========================================================================

Muc dich: Luu danh sach badge trong he thong.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
badge_id        | INT          |         | PK, AUTO_INCREMENT     | Ma badge                      | 1
name            | VARCHAR      | 100     | NN, UQ                 | Ten badge                     | Iron Warrior
description     | TEXT         |         |                        | Mo ta                         | Hoan thanh 100 buoi tap
icon_url        | VARCHAR      | 500     |                        | URL icon badge                | https://...png
criteria        | TEXT         |         | NN                     | Dieu kien unlock (JSON)       | {"total_sessions":100}
category        | ENUM         |         | NN                     | Nhom badge                    | gym
                |              |         |                        | Gia tri: gym, food, gear,     |
                |              |         |                        | social, streak                |

========================================================================

## BANG 16: FITCOIN_TRANSACTIONS
========================================================================

Muc dich: Ghi nhan moi giao dich FitCoin (earn va spend).

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
txn_id          | INT          |         | PK, AUTO_INCREMENT     | Ma giao dich                  | 1
user_id         | INT          |         | FK->USERS, NN          | User thuc hien                | 1
type            | ENUM         |         | NN                     | Loai giao dich                | earn
                |              |         |                        | Gia tri: earn, spend,         |
                |              |         |                        | deposit, refund               |
amount          | DECIMAL      | 12,2    | NN, CK>0              | So FitCoin                    | 200.00
source          | ENUM         |         | NN                     | Nguon goc                     | challenge
                |              |         |                        | Gia tri: gear_sale, challenge,|
                |              |         |                        | referral, streak, deposit,    |
                |              |         |                        | food_order, gear_rental,      |
                |              |         |                        | membership                    |
reference_id    | INT          |         |                        | ID tham chieu (order_id,      | 123
                |              |         |                        | challenge_id, gear_txn_id...) |
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 18:00

Index: idx_fitcoin_user (user_id)

========================================================================

## BANG 17: SOCIAL_POSTS
========================================================================

Muc dich: Luu bai dang tren Social Feed.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
post_id         | INT          |         | PK, AUTO_INCREMENT     | Ma post                       | 1
user_id         | INT          |         | FK->USERS, NN          | Nguoi dang                    | 1
type            | ENUM         |         | NN                     | Loai post                     | milestone
                |              |         |                        | Gia tri: milestone, pr,       |
                |              |         |                        | streak, transformation, review|
content         | TEXT         |         |                        | Noi dung                      | Dat PR Bench 80kg!
media_urls      | TEXT         |         |                        | Anh/video (JSON)              | ["https://...jpg"]
linked_data     | TEXT         |         |                        | Du lieu lien ket (JSON)       | {"exercise":"Bench","weight":80}
likes_count     | INT          |         | DF=0                   | So luot thich                 | 12
comments_count  | INT          |         | DF=0                   | So binh luan                  | 3
created_at      | DATETIME     |         | DF=NOW()               | Ngay dang                     | 2026-05-10 18:30

Index: idx_posts_user (user_id), idx_posts_created (created_at DESC)

========================================================================

## BANG 18: NOTIFICATIONS
========================================================================

Muc dich: Luu thong bao gui den user.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
notification_id | INT          |         | PK, AUTO_INCREMENT     | Ma thong bao                  | 1
user_id         | INT          |         | FK->USERS, NN          | User nhan                     | 1
type            | ENUM         |         | NN                     | Loai thong bao                | order_update
                |              |         |                        | Gia tri: streak_reminder,     |
                |              |         |                        | order_update, promo,          |
                |              |         |                        | challenge, gear_return,       |
                |              |         |                        | gym_closed                    |
title           | VARCHAR      | 200     | NN                     | Tieu de                       | Don hang da giao
message         | TEXT         |         |                        | Noi dung                      | Don #123 da giao thanh cong
is_read         | BOOLEAN      |         | DF=false               | Da doc chua                   | false
action_url      | VARCHAR      | 500     |                        | URL khi nhan vao              | /orders/123
created_at      | DATETIME     |         | DF=NOW()               | Ngay tao                      | 2026-05-10 12:30

Index: idx_notif_user_read (user_id, is_read)

========================================================================

## BANG 19: FOLLOWS
========================================================================

Muc dich: Luu quan he follow giua cac user.

Truong          | Kieu         | Do dai  | Rang buoc              | Mo ta                         | Vi du
----------------|--------------|---------|------------------------|-------------------------------|------------------
follower_id     | INT          |         | FK->USERS, NN          | Nguoi follow                  | 1
following_id    | INT          |         | FK->USERS, NN          | Nguoi duoc follow             | 5
created_at      | DATETIME     |         | DF=NOW()               | Ngay follow                   | 2026-05-08 15:00

PK: (follower_id, following_id)
Rang buoc: follower_id != following_id (khong tu follow chinh minh)

========================================================================
KET THUC FILE 08
========================================================================
