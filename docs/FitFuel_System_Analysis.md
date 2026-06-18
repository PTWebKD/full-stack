# FITFUEL+ — TAI LIEU PHAN TICH THIET KE HE THONG
# (System Analysis & Design Document)

> Do an mon: Web Kinh Doanh
> Phien ban: 3.0 — Gym Management System (cap nhat 18/06/2026)
> Dinh huong: Tu consumer marketplace → Single-gym management platform

---

## MUC LUC

1. Phat bieu bai toan (Problem Statement)
2. Pham vi he thong (System Scope)
3. Yeu cau chuc nang va phi chuc nang
4. Xac dinh Actor
5. Use Case Diagram tong the
6. Mo hinh quy trinh nghiep vu BPMN
7. ERD — Tong quan 35 bang du lieu
8. Non-functional Requirements
9. Transformation Journey Engine — Tong quan
---

## 1. PHAT BIEU BAI TOAN

### 1.1 Van de hien tai

Chu/nhan su phong tap gym quy mo vua tai Viet Nam dang gap cac van de quan ly sau:

(a) **Khong biet ai sap het han goi tap.** Chu phong tap khong co cong cu nao canh bao
    khi hoi vien gan het thoi han, dan den mat doanh thu gia han va khach bo di sang
    phong khac ma khong biet ly do.

(b) **Khong quan ly duoc tai san va tien ich.** Khan, locker, dung cu duoc phat thu
    bang giay tay hoac khau mieng, khong biet ai dang giu gi, mat mat tai san khong
    truy vet duoc, phi phat khong co can cu.

(c) **Ban dinh duong roi rac, khong co he thong.** Protein shake, meal prep ban tai quay
    ghi so tay, khong biet san pham nao ban chay, ton kho the nao, doanh thu bao nhieu.

(d) **Khong co du lieu de giua chan hoi vien.** Khi hoi vien nghi tap vai tuan roi bi,
    chu phong tap khong biet ai dang xa dan truoc khi ho chinh thuc xin huy goi.

(e) **Bao cao van hanh tho so.** Doanh thu hang thang phai tinh thu cong tu so sach,
    khong co bieu do xu huong, khong biet PT nao hieu qua nhat, san pham nao sinh loi nhat.

### 1.2 Giai phap de xuat

FitFuel+ la nen tang quan ly phong tap (Gym Management System) tap trung vao:

- **Membership Lifecycle**: Dang ky, gia han, nang cap, tam ngung; canh bao tu dong het han.
- **Dinh duong noi bo**: POS ban san pham tai quay, pre-order sau tap, quan ly ton kho.
- **Tai san & Tien ich**: Quan ly khan/locker/dung cu, cap phat theo goi, phi phat tu dong.
- **PT / Huan luyen vien**: Quan ly lich, dat buoi tap ca nhan.
- **AI Retention**: Queue cham soc hoi vien, goi y upsell boi staff, theo doi phong do.
- **KPI Dashboard**: Bao cao doanh thu, gia han, ton kho, hieu qua AI care.
- **Transformation Journey Engine**: He thong 5 tang giup hoi vien co muc tieu ro rang, theo doi tien do, nhan goi y bai tap va dinh duong ca nhan hoa, giai phong dot pha giu chan hoi vien dai han.

Diem khac biet cot loi so voi phien ban cu:
- KHONG co Food Vendor ben ngoai — chi ban noi bo cua phong tap.
- KHONG co Gear Hub P2P — chi quan ly tai san phong tap (assets, lockers).
- KHONG co Guest OTP checkout — tat ca dich vu phai co tai khoan.
- Single-tenant: phuc vu 1 phong tap duy nhat (GYMS.gym_id luon = 1).

### 1.3 Muc tieu he thong

- Theo doi toan bo vong doi goi tap hoi vien (dang ky -> gia han -> het han)
- Canh bao tu dong hoi vien sap het han, ho tro staff gia han nhanh
- Quan ly tai san noi bo (cap phat - tra - phi phat)
- Ban dinh duong noi bo voi quan ly ton kho
- AI care queue: quet hang ngay, phat hien hoi vien can cham soc
- Dashboard KPI: doanh thu, ty le gia han, san pham ban chay, hieu qua AI
- Gamification (XP, badge, streak, FitCoin) tang gan ket hoi vien
- Transformation Journey Engine: tang ty le giu chan hoi vien >= 70% sau 12 tuan, tang engagement thong qua muc tieu ca nhan hoa va milestone celebration

---

## 2. PHAM VI HE THONG

### 2.1 Trong pham vi (In Scope)

- Quan ly tai khoan (dang ky Member qua Membership flow, dang nhap)
- Gym Tracking (session, exercise log, PR, check-in QR)
- Membership Lifecycle (dang ky, gia han, nang cap, tam ngung, bao cao)
- Dinh duong noi bo (POS, pre-order, ton kho, bao cao)
- Tai san & Tien ich (cap phat theo goi, locker, phi phat, kiem ke)
- PT / Huan luyen vien (quan ly lich, dat buoi tap)
- Gamification (XP, level, badge, streak, challenge, ranking)
- FitCoin (tich luy, su dung giam gia den 50%, khong doi tien mat)
- AI Retention & Care Queue (rule-based, 9 dieu kien — 6 cu + R7/R8/R9 tu Transformation)
- Transformation Journey Engine (5 tang: Goal Engine, Program Engine, Progressive Overload AI, Progress Visualization, Milestone Engine)
- KPI Dashboard & SQL Reporting
- Notification system (in-app + SMS)
- Social Feed co ban (milestone post, follow)
- Payment: VNPay / MoMo sandbox
- Single-tenant: 1 phong tap, 2 role (member, gym_owner)

### 2.2 Ngoai pham vi (Out of Scope)

- Food Vendor ben ngoai / giao do an tu ben ngoai
- Gear Hub P2P (cho thue / mua ban thiet bi giua hoi vien)
- Guest OTP checkout (khong co khach vang lai)
- Quan ly nhieu phong tap / chuoi gym (single-tenant, 1 gym duy nhat)
- Mobile app native (chi responsive web)
- Tich hop wearable device
- Video call voi PT
- Chat real-time
- AI/ML phuc tap (chi rule-based)
- Thanh toan that (chi sandbox)

---

## 3. YEU CAU CHUC NANG VA PHI CHUC NANG

### 3.1 Yeu cau chuc nang

#### 3.1.1. Quan ly tai khoan

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-ACC-01   | Dang ky Member qua Membership| Tao TK tu dong trong luong mua goi tap (SDT + thanh toan)    | Cao
FR-ACC-02   | Dang nhap (email + mat khau) | JWT, 7 ngay, route theo role                                  | Cao
FR-ACC-03   | Cap nhat ho so               | ten, avatar, muc tieu, chieu cao, can nang                    | Cao
FR-ACC-04   | Fitness Passport             | Ho so tap luyen, huy hieu, streak, stats                     | Trung binh

#### 3.1.2. Gym Tracking

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-GYM-01   | Tao buoi tap                | Tao Workout Session theo ngay va nhom co                     | Cao
FR-GYM-02   | Ghi nhan bai tap            | Nhap set, reps, weight; kiem tra PR tu dong                  | Cao
FR-GYM-03   | Personal Record              | Tu dong phat hien ky luc ca nhan                             | Cao
FR-GYM-04   | Bieu do tien do              | Hien thi tien trinh theo thoi gian                           | Trung binh
FR-GYM-05   | Check-in QR                 | Check-in tai phong tap, kiem tra goi hop le                  | Cao

#### 3.1.3. Membership Lifecycle

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-MEM-01   | Cac loai goi tap            | Day Pass, Basic, Standard, Premium, PT Plus, Student          | Cao
FR-MEM-02   | Dang ky goi tap             | Chon goi + thanh toan + tao GYM_MEMBERSHIPS                  | Cao
FR-MEM-03   | Gia han goi tap             | Cap nhat end_date + ghi HISTORY + FitCoin bonus               | Cao
FR-MEM-04   | Nang cap goi tap            | Tinh phi phu troi + cap nhat plan_id                         | Trung binh
FR-MEM-05   | Tam ngung / Bao luu         | Admin duyet, cong ngay vao end_date khi het bao luu           | Trung binh
FR-MEM-06   | Canh bao het han            | RECOMMENDATIONS + NOTIFICATIONS khi con <= 7 ngay / <= 3 ngay| Cao
FR-MEM-07   | Danh sach sap het han       | SQL query: end_date trong 7 ngay, cho care queue             | Cao
FR-MEM-08   | Bao cao membership          | Doanh thu, hoi vien moi, ty le gia han theo thang             | Cao

#### 3.1.4. Dinh duong noi bo

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-NUT-01   | Quan ly san pham            | Them, sua, xoa, cap nhat ton kho; nguong canh bao             | Cao
FR-NUT-02   | POS ban tai quay            | Tim member, chon SP, tinh tong, thanh toan                   | Cao
FR-NUT-03   | Pre-order sau tap           | Member dat truoc sau buoi tap, nhan tai quay                  | Trung binh
FR-NUT-04   | AI goi y san pham           | Goi y theo nhom co vua tap, loc macro uu tien                | Trung binh
FR-NUT-05   | Quan ly ton kho             | Xem ton kho, nhap hang, canh bao thap                        | Cao
FR-NUT-06   | Bao cao doanh thu nutrition  | San pham ban chay, doanh thu, ton kho theo thang              | Cao

#### 3.1.5. Tai san & Tien ich

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-ASS-01   | Danh muc tai san            | Them, sua, cap nhat so luong tai san (khan, tham...)          | Cao
FR-ASS-02   | Cap phat tai san check-in   | Tu dong xac dinh quyen loi theo goi, ghi ASSET_ASSIGNMENTS   | Cao
FR-ASS-03   | Quan ly locker              | Phan, thu hoi, gia han locker; theo doi trang thai            | Cao
FR-ASS-04   | Ghi nhan phi phat           | Tai san hong/mat -> ASSET_PENALTIES -> INVOICES               | Trung binh
FR-ASS-05   | Bao cao tai san             | Occupancy, that lac, bao tri, phi phat thu duoc               | Trung binh

#### 3.1.6. PT / Huan luyen vien

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-PT-01    | Quan ly HLV                 | Them, chinh sua lich, chuyen mon, gia HLV                    | Trung binh
FR-PT-02    | Dat lich PT                 | Member chon HLV, khung gio trong, xac nhan                   | Trung binh
FR-PT-03    | Ghi ket qua buoi PT         | HLV ghi PT_SESSIONS sau buoi tap                             | Thap

#### 3.1.7. Gamification

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-GAME-01  | He thong XP va level        | XP tu hanh dong tap/check-in/gia han; level theo XP           | Trung binh
FR-GAME-02  | Huy hieu (Badge)            | Mo khoa theo milestone                                        | Trung binh
FR-GAME-03  | Streak                      | Theo doi chuoi tap lien tuc, reset khi nghi                  | Cao
FR-GAME-04  | Challenge                   | Nhiem vu ngan han, phan thuong XP + FitCoin                  | Thap
FR-GAME-05  | Leaderboard                 | Bang xep hang XP / streak                                    | Thap

#### 3.1.8. FitCoin & Thanh toan

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-PAY-01   | Thanh toan VNPay/MoMo       | Tich hop cong thanh toan sandbox, xu ly callback HMAC         | Cao
FR-PAY-02   | FitCoin economy             | Tich luy khi gia han / streak / challenge; su dung den 50%   | Trung binh
FR-PAY-03   | Hoa don tap trung (INVOICES) | 1 bang INVOICES cho tat ca dich vu (membership/nutrition/PT) | Cao

#### 3.1.9. AI Retention & Reporting

Ma YC       | Yeu cau chuc nang           | Mo ta                                                         | Uu tien
------------|-----------------------------|---------------------------------------------------------------|---------
FR-AI-01    | Quet va tao recommendation  | Timer daily 06:00, quet 9 dieu kien (6+R7/R8/R9), INSERT RECOMMENDATIONS | Cao
FR-AI-02    | Hien thi care queue         | Danh sach priority, ly do, goi y hanh dong cho staff          | Cao
FR-AI-03    | Ghi nhan xu ly              | Staff ghi outcome + ghi chu -> MEMBER_CARE_LOGS               | Cao
FR-AI-04    | Dashboard KPI               | Doanh thu, ty le gia han, san pham ban chay, conversion rate  | Cao
FR-AI-05    | Bao cao SQL                 | Expiring members, inactive, revenue by service, stock levels  | Cao

#### 3.1.10. Transformation Journey Engine

Ma YC       | Yeu cau chuc nang                      | Mo ta                                                              | Uu tien
------------|----------------------------------------|--------------------------------------------------------------------|----------
FR-053      | Goal Onboarding (5 buoc)               | Thu thap goal_type, fitness_level, available_days, target_date, body_metrics | Cao
FR-054      | Program Matching tu dong               | Ket noi muc tieu voi WORKOUT_PROGRAMS phu hop (vol/intensity/duration) | Cao
FR-055      | Tao MEMBER_PROGRAMS                    | Ghi nhan chuong trinh duoc phan cong, kich hoat trang thai 'active' | Cao
FR-056      | Goi y bai tap hang ngay                | He thong de xuat lich tap (danh sach exercises + target sets/reps/weight) | Cao
FR-057      | Chinh sua goi y truoc khi xac nhan     | Member co the them/bot/sua exercises, luu customization_log JSON    | Cao
FR-058      | Progressive Overload AI                | Khi actual_reps >= target_max 2 buoi lien tiep -> goi y tang 2.5kg | Cao
FR-059      | Ghi nhan Body Metrics                  | Member nhap can nang, body_fat%, measurements theo tuan/thang       | Trung binh
FR-060      | Dashboard Tien Do 3 tab                | Tab Hanh Trinh (program), Suc Manh (PR chart), Co The (body metrics) | Cao
FR-061      | Milestone Engine (22 milestone)        | Tu dong phat hien va trao thuong FitCoin/XP khi dat moc             | Cao
FR-062      | Share Card viral                       | Tao anh chia se tren M32/M42 milestone voi gym logo + stats         | Trung binh
FR-063      | R7/R8/R9 Care Queue triggers           | R7: bo chuong trinh >7 ngay; R8: hoan thanh 100%; R9: bi tac 3 buoi | Cao
FR-064      | 4-tin-hieu Nutrition AI post-workout   | Sau hoan thanh buoi tap: goi y dinh duong theo nhom co + goal_type + volume + lich su mua | Cao

### 3.2 Yeu cau phi chuc nang

Ma so    | Yeu cau                    | Mo ta                                                                          | Uu tien
---------|----------------------------|--------------------------------------------------------------------------------|----------
NFR-01   | Hieu suat                  | API phan hoi < 500ms; trang tai < 2s                                           | Cao
NFR-02   | Bao mat                    | bcrypt mat khau; HTTPS; JWT; HMAC xac thuc callback thanh toan                 | Cao
NFR-03   | Phan quyen truy cap         | 2 role: member / gym_owner; middleware kiem tra role tren moi route             | Cao
NFR-04   | Single-tenant              | GYMS.gym_id luon = 1; khong ho tro multi-gym                                  | Cao
NFR-05   | Sao luu du lieu             | Backup hang ngay, luu 7 ban gan nhat                                           | Cao
NFR-06   | Responsive                 | Mobile-first, ho tro tat ca kich thuoc man hinh                                | Cao
NFR-07   | Quyen rieng tu              | Member tu quyet dinh che do Public/Private cho Fitness Passport                | Trung binh
NFR-08   | Idempotency                | Callback thanh toan khong xu ly 2 lan cung invoice_id (BR-38)                  | Cao

---

## 4. XAC DINH ACTOR

| Actor                  | Role           | Mo ta                                                         |
|------------------------|----------------|---------------------------------------------------------------|
| Hoi vien (Member)      | member         | Nguoi su dung dich vu phong tap (tap, check-in, mua dinh duong, dat PT) |
| Chu phong tap (Gym Owner) | gym_owner   | Quan tri va van hanh phong tap (quan ly member, tai san, bao cao, AI care) |
| HLV (PT Trainer)       | (sub-actor)    | Ghi ket qua buoi tap PT; dung TK member, co quyen PT-specific |
| Payment Gateway        | (external)     | VNPay / MoMo sandbox                                          |
| Timer / Cron Job       | (system)       | Chay hang ngay 06:00 de quet AI recommendations va streak     |

Luu y: KHONG con role 'vendor' hay 'guest'. USERS.role ENUM chi co 'member' va 'gym_owner'.

---

## 5. USE CASE DIAGRAM TONG THE

Ngoai chi tiet (xem file 03_Actor_UseCase.md) — 62 Use Cases tong so:

| Nhom                         | So UC | Pham vi                                                          |
|------------------------------|-------|------------------------------------------------------------------|
| Quan ly tai khoan             | 5     | Dang ky, dang nhap, ho so, mat khau, passport                    |
| Gym Tracking                 | 8     | Session, exercise, PR, check-in, lich su                         |
| Membership Lifecycle         | 8     | Dang ky, gia han, nang cap, bao luu, bao cao                     |
| Dinh duong noi bo            | 7     | POS, pre-order, AI goi y, ton kho, bao cao                       |
| Tai san & Tien ich           | 7     | Cap phat, locker, phi phat, kiem ke, bao cao                     |
| PT / HLV                     | 4     | Quan ly HLV, dat lich, ghi ket qua, lich tong                    |
| Gamification                 | 8     | XP, badge, streak, challenge, leaderboard, FitCoin               |
| Payment                      | 3     | Tao hoa don, callback, FitCoin giao dich                         |
| AI Retention & Reporting     | 5     | Quet rec, care queue, ghi xu ly, KPI, bao cao                    |
| Admin (Gym Owner)            | 3     | Quan ly Member, cau hinh goi tap, chinh sach                     |
| Transformation Journey       | 8     | Goal onboarding, goi y bai tap, chinh sua, hoan thanh, tien do, milestone, Share Card, quan ly chuong trinh (GymOwner) |
| **Tong**                     | **62**|                                                                  |

---

## 6. MO HINH QUY TRINH NGHIEP VU BPMN

### 6.1 — Gym Tracking & Gamification

**Mo ta quy trinh:**
Quy trinh bat dau khi Member check-in tai phong tap bang QR code. He thong xac nhan
goi tap con hieu luc, ghi CHECK_INS va cap phat tien ich theo goi (khan/locker cho
Standard/Premium/PT Plus).

Member tao Workout Session, chon ngay va nhom co. Trong buoi tap, Member log tung
bai tap voi cac set (reps, weight). He thong tu dong kiem tra PR sau moi set. Neu
dat ky luc moi, hien thi hieu ung chuc mung va flag is_pr = true.

Khi ket thuc buoi tap:
- Tinh duration va tong volume
- Cong 50 XP va tang streak +1
- Cap nhat FITNESS_PASSPORT
- Hien thi popup goi y san pham dinh duong (AI suggestion theo nhom co)
- Ket qua luu vao Workout History

**Quy tac nghiep vu ap dung:**
- BR-09 (check-in toi da 1 lan/ngay)
- BR-16 (quyen loi tien ich theo goi)
- BR-21 (bang XP — cong 50 XP/session)
- BR-23 (streak tang khi check-in hoac hoan thanh session)
- BR-24 (reset streak khi nghi >= 2 ngay)
- BR-31 (PR = max(weight x reps) cho moi bai tap)

**Xu ly ngoai le:**
- Goi tap het han khi check-in: thong bao, redirect sang gia han.
- Mat ket noi khi dang log: cache local, dong bo khi co lai mang.
- Nhap lieu bat thuong (so am, qua lon): hien thi canh bao, cho xac nhan truoc khi luu.

---

### 6.2 — Ban Dinh Duong Noi Bo (Internal Nutrition Sales)

**Mo ta quy trinh:**

**Luong A — Ban tai quay (POS):**
Nhan vien mo man hinh POS, tim kiem Member bang SDT. He thong hien thi danh sach
san pham con hang. Nhan vien chon san pham va nhap so luong, he thong tinh tong tien.
Member co the dung FitCoin de giam gia (toi da 50%). Nhan vien xac nhan, he thong
ghi NUTRITION_ORDERS, tru INVENTORY, tao INVOICES. Xuat bien lai xac nhan.

Neu ton kho sau giao dich <= low_stock_threshold: he thong tu dong tao NOTIFICATIONS
canh bao ton kho thap cho Gym Owner.

**Luong B — Pre-order sau buoi tap:**
Member hoan thanh buoi tap, he thong hien thi popup goi y dinh duong (AI suggestion
dua tren nhom co tap). Member chon san pham, dat truoc, thanh toan VNPay/FitCoin.
He thong ghi NUTRITION_ORDERS (status='pending'), tang qty_reserved. Nhan vien thay
thong bao, chuan bi hang. Khi giao xong: xac nhan 'completed', tru qty_in_stock.

**Luong C — Canh bao ton kho:**
Timer hang ngay quet INVENTORY, phat hien san pham co qty_in_stock <= low_stock_threshold.
He thong tao NOTIFICATIONS cho Gym Owner de kip thoi nhap hang.

**Quy tac nghiep vu ap dung:**
- BR-12 (chi ban noi bo, khong co Food Vendor ben ngoai)
- BR-13 (nguong canh bao ton kho theo san pham)
- BR-14 (logic goi y dinh duong theo nhom co)
- BR-30 (FitCoin toi da 50% gia tri don hang)

---

### 6.3 — Tai San & Tien Ich (Asset & Amenities Management)

**Mo ta quy trinh:**

**Luong A — Cap phat tai san khi check-in:**
Khi Member check-in thanh cong, he thong xac dinh quyen loi theo goi tap:
- Basic: khong co tien ich
- Standard: khan tap (1 cai)
- Premium: khan tap + locker thang
- PT Plus: khan tap + dung cu tap ca nhan

He thong ghi ASSET_ASSIGNMENTS, giam ASSETS.available_qty. Nhan vien thay thong
bao cap phat tren man hinh Staff Terminal.

**Luong B — Tra tai san & phi phat:**
Cuoi buoi tap, nhan vien thu hoi tai san. Neu tai san bi hong hoac mat:
-> Ghi ASSET_ASSIGNMENTS.status = 'damaged' hoac 'lost'
-> Tao ASSET_PENALTIES (ty le phi phat theo BR-17)
-> Tao INVOICES cho phi phat
-> Tang ASSETS.available_qty (neu da thu hoi du dieu kien)

**Luong C — Quan ly locker:**
Gym Owner phan locker cho Member co goi Premium/PT Plus. Locker co the daily
(trong buoi tap) hoac monthly (thue theo thang). Khi het han locker monthly:
he thong gui NOTIFICATIONS nhac nho. Qua 3 ngay khong gia han: tu dong thu hoi.

**Luong D — Bao tri tai san:**
Gym Owner danh dau tai san can bao tri: ASSETS.condition = 'damaged', is_active = false.
Sau khi sua xong: cap nhat lai, tang available_qty.

**Quy tac nghiep vu ap dung:**
- BR-16 (tien ich theo goi)
- BR-17 (phi phat tai san hong/mat)
- BR-18 (quan ly locker)
- BR-19 (phi phat locker het han)
- BR-20 (quy trinh bao tri)

---

### 6.4 — Membership Lifecycle

**Mo ta quy trinh:**

**Luong A — Dang ky truc tuyen:**
Khach hang truy cap /membership, chon goi tap, nhap SDT va thanh toan VNPay/MoMo.
Sau khi thanh toan thanh cong, he thong tu dong tao tai khoan USERS, GYM_MEMBERSHIPS
(status='active'), MEMBERSHIP_HISTORY (change_type='register'), INVOICES (status='paid').
Gui SMS xac nhan + mat khau tam thoi.

**Luong B — Gia han:**
Member truy cap /membership, chon thoi han gia han, thanh toan. He thong cap nhat
GYM_MEMBERSHIPS.end_date, ghi MEMBERSHIP_HISTORY (change_type='renewal'). Tu dong
resolve RECOMMENDATIONS.type='renew_reminder'. Cong +50 FitCoin bonus.

**Luong C — Nang cap goi:**
Member chon goi cao hon. He thong tinh phi phu troi theo so ngay con lai. Thanh toan
phi phu troi. Cap nhat plan_id, ghi MEMBERSHIP_HISTORY (change_type='upgrade').

**Luong D — Tam ngung / Bao luu:**
Member xin bao luu (vi du: di du lich, chan thuong). Admin kiem tra: chua qua 2 lan/nam
(BR-08). Admin nhap so ngay bao luu (toi da 30 ngay). Cap nhat status='suspended',
ghi MEMBERSHIP_HISTORY (change_type='suspension'). Khi het thoi gian bao luu: he thong
tu dong phuc hoi, cong them so ngay vao end_date.

**Quy tac nghiep vu ap dung:**
- BR-05 (6 loai goi tap)
- BR-06 (ghi MEMBERSHIP_HISTORY cho moi thay doi)
- BR-07 (canh bao 7 ngay, 3 ngay truoc het han)
- BR-08 (bao luu toi da 2 lan/nam, 30 ngay/lan)
- BR-38 (idempotency payment callback)

---

### 6.5 — AI Retention & Care Queue

**Mo ta quy trinh:**

**Luong A — Tao recommendation (Timer daily 06:00):**
Cron job chay hang ngay, quet tat ca GYM_MEMBERSHIPS co status = 'active' hoac 'expiring'.
Voi moi Member, kiem tra 6 dieu kien (BR-35):
- R1: Goi het han trong 7 ngay -> renew_reminder (HIGH)
- R2: Goi het han 1-3 ngay ma chua gia han -> renew_reminder (HIGH)
- R3: Chua check-in >= 14 ngay -> inactive_alert (MEDIUM)
- R4: Tap >= 4 buoi/tuan trong 3 tuan, dang goi Basic -> upsell_plan (LOW)
- R5: Chua dat lich PT ma co goi PT -> upsell_pt (LOW)
- R6: Chua mua dinh duong >= 14 ngay -> upsell_nutrition (LOW)

Voi moi dieu kien dung: kiem tra trung lap trong 7 ngay, neu chua co thi INSERT
RECOMMENDATIONS moi. Doi voi Member het han trong <= 3 ngay: gui NOTIFICATIONS nhac nho.

**Luong B — Staff xu ly care queue:**
Gym Owner/nhan vien truy cap /gym-owner/care-queue. He thong hien thi danh sach
RECOMMENDATIONS.status='pending' sap xep HIGH -> MEDIUM -> LOW. Staff chon 1 Member,
xem chi tiet (so ngay chua check-in, goi tap, lich su mua hang), thuc hien lien lac.
Ghi nhan ket qua (renewed/declined/unreachable/other) + ghi chu. He thong ghi
MEMBER_CARE_LOGS, cap nhat RECOMMENDATIONS.status = 'handled'.

**Luong C — Upsell suggestion:**
Doi voi RECOMMENDATIONS loai upsell_plan/upsell_pt/upsell_nutrition, staff xem chi
tiet goi y cu the (vi du: "Member nay tap 5 buoi/tuan, nen de xuat nang len Premium").
Staff lien lac truc tiep. Neu Member dong y, tien hanh quy trinh Nang cap goi (Luong C
cua 6.4) hoac dat PT (UC-36).

**Quy tac nghiep vu ap dung:**
- BR-35 (6 dieu kien tao recommendation)
- BR-36 (ghi MEMBER_CARE_LOGS bat buoc khi xu ly)
- BR-45 (R7/R8/R9 — 3 trigger moi tu Transformation Journey)
- Khong tao recommendation trung lap trong 7 ngay

---

### 6.6 — Transformation Journey Engine

**Mo ta quy trinh:**

**Pool MEMBER — Hanh trinh tu muc tieu den ket qua:**

Bat dau tai /journey/goal: Member hoan thanh 5-buoc Goal Onboarding (goal_type, fitness_level,
available_days, target_date, can/chieu cao). He thong ghi TRANSFORMATION_GOALS va ket hop
BODY_METRICS. Thuat toan matching quet WORKOUT_PROGRAMS theo goal_type + fitness_level + duration,
chon chuong trinh phu hop nhat, ghi MEMBER_PROGRAMS.status = 'active'.

Hang ngay, he thong lay PROGRAM_DAYS tuong ung voi ngay trong chuong trinh va de xuat lich tap
(danh sach PROGRAM_EXERCISES voi target_sets / target_reps / suggested_weight). Member co the
**chinh sua goi y**: them, bot, doi thu tu exercise truoc khi xac nhan. Thay doi duoc luu vao
customization_log JSON cua WORKOUT_SESSIONS.

Trong buoi tap: Member log tung set (actual_reps, actual_weight). Sau khi nhan "Hoan Thanh Buoi Tap",
3 engine chay song song:

1. **Progressive Overload AI**: kiem tra EXERCISE_LOGS 2 buoi gan nhat. Neu actual_reps >= target_max
   ca 2 buoi -> INSERT RECOMMENDATIONS loai 'progressive_overload', goi y tang 2.5kg.
2. **Nutrition Suggestion AI**: lay 4 tin hieu (nhom co vua tap + goal_type + tong_volume + lich_su_mua)
   -> INSERT RECOMMENDATIONS loai 'nutrition_post_workout', hien thi popup goi y san pham.
3. **Milestone Engine**: kiem tra 22 milestone condition, neu thoa man thi ghi MILESTONE_ACHIEVEMENTS,
   +FitCoin, +XP, tao Share Card URL (M32/M42), hien thi celebration modal.

**Pool HE THONG — Care Queue Transformation:**
Daily cron quet them 3 dieu kien moi:
- R7: MEMBER_PROGRAMS.status = 'active' nhung khong co WORKOUT_SESSIONS trong 7 ngay -> INSERT 'inactive_program' (HIGH)
- R8: MEMBER_PROGRAMS.completed_days = total_days -> 'program_completed' (LOW), chao mung, goi y chuong trinh tiep theo
- R9: 3 buoi tap lien tiep actual_reps < target_min -> 'stuck_plateau' (MEDIUM)

**Pool GYM OWNER — Quan ly chuong trinh:**
Gym Owner vao /gym-owner/programs, tao/sua WORKOUT_PROGRAMS voi cac PROGRAM_DAYS va PROGRAM_EXERCISES.
Khi nhan notification R7/R8/R9, xu ly care queue giong flow 6.5.

**Quy tac nghiep vu ap dung:**
- BR-41 (Program matching: goal_type + fitness_level + duration)
- BR-42 (Editable workout suggestion: luu customization_log, lien ket WORKOUT_SESSIONS)
- BR-43 (Progressive Overload: actual_reps >= target_max 2x lien tiep -> goi y +2.5kg)
- BR-44 (Nutrition 4-tin-hieu: nhom co + goal_type + volume + lich su mua)
- BR-45 (R7/R8/R9 Care Queue triggers tu Transformation Journey)
- BR-46 (22 Milestone voi FitCoin/XP; M32/M42 tao Share Card)

---

## 7. ERD — TONG QUAN 35 BANG DU LIEU

### 7.1 Cac nhom bang

**Nhom 1 — Nguoi dung:**
USERS (role ENUM: 'member','gym_owner'), FITNESS_PASSPORT, FOLLOWS

**Nhom 2 — Gym Tracking:**
WORKOUT_SESSIONS, EXERCISE_LOGS, CHECK_INS

**Nhom 3 — Membership:**
GYMS (1 hang duy nhat, gym_id=1), MEMBERSHIP_PLANS, GYM_MEMBERSHIPS, MEMBERSHIP_HISTORY, INVOICES

**Nhom 4 — Dinh duong:**
NUTRITION_PRODUCTS, NUTRITION_ORDERS, NUTRITION_ORDER_ITEMS, INVENTORY

**Nhom 5 — Tai san:**
ASSETS, LOCKERS, ASSET_ASSIGNMENTS, ASSET_PENALTIES

**Nhom 6 — PT & AI:**
PT_TRAINERS, PT_BOOKINGS, PT_SESSIONS, RECOMMENDATIONS, MEMBER_CARE_LOGS

**Nhom 7 — He thong:**
CHALLENGES, USER_CHALLENGES, BADGES, FITCOIN_TRANSACTIONS, NOTIFICATIONS, SOCIAL_POSTS

**Nhom 8 — Transformation Journey Engine:**
TRANSFORMATION_GOALS, WORKOUT_PROGRAMS, PROGRAM_DAYS, PROGRAM_EXERCISES,
MEMBER_PROGRAMS, BODY_METRICS, PERSONAL_RECORDS, MILESTONE_ACHIEVEMENTS

### 7.2 Cac quy tac ERD quan trong

- GYMS chi co 1 hang (single-tenant). KHONG co truong owner_id trong GYMS.
- USERS.role chi co 2 gia tri: 'member', 'gym_owner'.
- NUTRITION_PRODUCTS.vendor_id = NULL (khong co vendor ben ngoai).
- NUTRITION_ORDERS.guest_phone = NULL (khong co guest).
- INVOICES.service_type ENUM: 'membership','nutrition','asset_penalty','pt'.
- CHECK_INS lien ket voi GYM_MEMBERSHIPS de xac nhan goi hop le.
- ASSET_ASSIGNMENTS co the co asset_id (nullable) HOAC locker_id (nullable).
- RECOMMENDATIONS.recommendation_type ENUM: 'renew_reminder','inactive_alert','upsell_plan','upsell_pt','upsell_nutrition','progressive_overload','nutrition_post_workout','inactive_program','program_completed','stuck_plateau'.
- TRANSFORMATION_GOALS.goal_type ENUM: 'weight_loss','muscle_gain','endurance','general_fitness','strength'.
- MEMBER_PROGRAMS.status ENUM: 'active','paused','completed','abandoned'.
- WORKOUT_SESSIONS.session_source ENUM: 'free','program' (+ customization_log JSON, member_program_id FK).
- EXERCISE_LOGS: them is_pr_attempt BOOLEAN, progressive_overload_flag BOOLEAN.

(Xem chi tiet trong file 07_ERDnew.md va 08_Data_Dictionary.md)

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Hieu suat

He thong phai phan hoi nhanh trong cac thao tac thuong xuyen cua phong tap:
- Thao tac check-in va xac nhan goi tap: < 1 giay.
- API truy van danh sach (membership, care queue, san pham): < 500ms.
- Trang tai lan dau tien (FCP): < 2 giay.

### 8.2 Bao mat & Kiem soat truy cap

- Mat khau ma hoa bcrypt (cost factor >= 12).
- Tat ca giao tiep qua HTTPS.
- JWT Token (7 ngay), refresh token tuy chon.
- Middleware kiem tra role tren moi route API:
  - `/gym-owner/*`: yeu cau role = 'gym_owner'
  - `/member/*`: yeu cau role = 'member'
- HMAC xac thuc toan ven callback thanh toan (BR-38).
- Bao ve chong SQL Injection, XSS, CSRF.

### 8.3 Kien truc he thong

- Single-tenant: 1 gym_id = 1 xuyen suot toan bo he thong.
- Frontend: React.js (camelCase role: 'gymOwner', 'member').
- Backend: Node.js / Express (snake_case role: 'gym_owner', 'member').
- Database: MySQL / PostgreSQL (chi dinh CHAR SET utf8mb4).
- Payment: VNPay / MoMo sandbox.
- Cron Job: node-cron hoac equivalent, chay 06:00 hang ngay.

### 8.4 Kha nang bao tri & Mo rong

- Code theo module (Gym Tracking / Membership / Nutrition / Assets / PT / AI Retention).
- Moi module co router / controller / service / repository rieng.
- Bao tri 1 module khong anh huong module khac.
- Ghi log (winston / pino) day du: timestamp, user_id, action, ket qua.
- Migration script quan ly thay doi schema (knex migrations hoac Flyway).

### 8.5 Du phong & Bao luu

- Database backup hang ngay, luu 7 ban gan nhat.
- Uptime muc tieu >= 99%.
- Moi ngoai le thanh toan phai ghi log server, hien thi thong bao than thien cho nguoi dung.

---

## PHU LUC: CAU HINH GOI TAP MAC DINH (MEMBERSHIP_PLANS)

| plan_name  | Gia/thang | Gia/nam | Towel | Locker | PT        |
|------------|-----------|---------|-------|--------|-----------|
| Day Pass   | 50,000    | N/A     | No    | No     | No        |
| Basic      | 299,000   | 2.99M   | No    | No     | No        |
| Standard   | 399,000   | 3.99M   | Yes   | No     | No        |
| Premium    | 549,000   | 5.49M   | Yes   | Yes    | No        |
| PT Plus    | 899,000   | 8.99M   | Yes   | Yes    | 4 buoi/th |
| Student    | 249,000   | 2.49M   | No    | No     | No        |

(Gia tri trong bang la tham khao, Gym Owner co the chinh sua trong MEMBERSHIP_PLANS)

---

## PHU LUC: CAU TRUC CONG THUC SQL QUAN TRONG

**1. Hoi vien sap het han (7 ngay):**
```sql
SELECT u.display_name, u.phone, gm.end_date,
       DATEDIFF(gm.end_date, NOW()) AS days_left
FROM GYM_MEMBERSHIPS gm JOIN USERS u ON u.user_id = gm.user_id
WHERE gm.status = 'active'
  AND gm.end_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
ORDER BY days_left ASC;
```

**2. Doanh thu theo dich vu (thang nay):**
```sql
SELECT service_type, SUM(total_amount) AS revenue, COUNT(*) AS txn_count
FROM INVOICES
WHERE status = 'paid'
  AND YEAR(paid_at) = YEAR(NOW())
  AND MONTH(paid_at) = MONTH(NOW())
GROUP BY service_type;
```

**3. San pham dinh duong ban chay:**
```sql
SELECT np.name, SUM(noi.qty) AS total_sold
FROM NUTRITION_ORDER_ITEMS noi
JOIN NUTRITION_PRODUCTS np ON np.product_id = noi.product_id
JOIN NUTRITION_ORDERS no2 ON no2.order_id = noi.order_id
WHERE no2.status = 'completed'
  AND MONTH(no2.created_at) = MONTH(NOW())
GROUP BY np.product_id ORDER BY total_sold DESC LIMIT 5;
```

**4. Ty le chuyen doi AI recommendation:**
```sql
SELECT r.recommendation_type,
       COUNT(*) AS total,
       SUM(CASE WHEN r.status='handled' AND mcl.outcome='renewed' THEN 1 ELSE 0 END) AS converted,
       ROUND(SUM(CASE WHEN mcl.outcome='renewed' THEN 1 ELSE 0 END)*100.0/COUNT(*), 1) AS rate_pct
FROM RECOMMENDATIONS r
LEFT JOIN MEMBER_CARE_LOGS mcl ON mcl.rec_id = r.rec_id
GROUP BY r.recommendation_type;
```

**5. Hoi vien khong hoat dong (chua check-in >= 14 ngay):**
```sql
SELECT u.display_name, u.phone,
       MAX(ci.checked_in_at) AS last_checkin,
       DATEDIFF(NOW(), MAX(ci.checked_in_at)) AS days_inactive
FROM GYM_MEMBERSHIPS gm JOIN USERS u ON u.user_id = gm.user_id
LEFT JOIN CHECK_INS ci ON ci.user_id = u.user_id
WHERE gm.status = 'active'
GROUP BY u.user_id
HAVING days_inactive >= 14 OR last_checkin IS NULL
ORDER BY days_inactive DESC;
```

---
KET THUC FILE FitFuel_System_Analysis.md
========================================================================
