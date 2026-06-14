# 01. PHAT BIEU BAI TOAN VA PHAM VI HE THONG
# (Problem Statement & System Scope)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

## 1. DAT VAN DE
========================================================================

### 1.1. Boi canh

Thi truong fitness tai Viet Nam tang truong manh trong giai doan 2020-2026.
Theo thong ke, so luong phong tap gym tai cac thanh pho lon tang trung binh
15-20% moi nam. Tuy nhien, nguoi tap gym dang gap nhieu van de trong viec
duy tri thoi quen tap luyen va dinh duong hop ly.

### 1.2. Cac van de cu the

Van de 1: THIEU CONG CU THEO DOI TIEN DO TAP LUYEN
- Phan lon nguoi tap ghi bang tay hoac khong ghi lai buoi tap.
- Khong co du lieu de danh gia ban than co tien bo hay khong.
- Khong biet khi nao dat Personal Record (PR) cho tung bai tap.
- Khong co dong luc duy tri vi khong thay duoc ket qua.

Van de 2: KHONG BIET NEN AN GI SAU BUOI TAP
- Thong tin dinh duong tran lan, mau thuan nhau.
- Khong co su ket noi giua "hom nay tap nhom co gi" va "nen an gi".
- App food khong biet user tap gi. App gym khong biet user an gi.
- Phai tu tinh toan macro (protein, carb, fat) rat mat thoi gian.

Van de 3: THIEU THIET BI TAP NHUNG KHONG MUON MUA MOI
- Newbie chua biet thiet bi nao phu hop, khong muon mua moi vi dat.
- Khong co nen tang cho thue thiet bi gym dang tin cay tai Viet Nam.
- Mua thiet bi cu tren Shopee/Facebook khong dam bao chat luong.
- Khong co thong tin ve lich su su dung cua thiet bi.

Van de 4: THIEU DONG LUC DUY TRI
- Tap mot minh de mat hung.
- Khong co co che khen thuong hay thi dua.
- Khong co cong dong de tuong tac va chia se.

### 1.3. Doi tuong bi anh huong

- Nguoi tap gym 18-35 tuoi tai cac thanh pho lon
- Nguoi muon giam can nhung khong biet cach kiem soat dinh duong
- Nguoi moi bat dau tap (newbie) chua co thiet bi
- Chu phong tap muon so hoa quan ly
- Quan an healthy muon tiep can dung doi tuong khach hang

========================================================================

## 2. GIAI PHAP DE XUAT
========================================================================

### 2.1. Mo ta giai phap

FitFuel+ la nen tang web kinh doanh ket hop 3 mang trong 1 he sinh thai:

  Mang 1 - Gym Tracking:
    Theo doi buoi tap, tien do, streak, personal record.

  Mang 2 - Healthy Food Order:
    Dat do an healthy voi thong tin macro chi tiet.
    AI goi y thuc don dua tren nhom co vua tap.

  Mang 3 - Gear Hub:
    Thue, mua, ban thiet bi gym cu co Gear Lifecycle minh bach.

  Diem ket noi trung tam:
    Fitness Passport - ho so the hinh ca nhan, ghi lai toan bo hanh trinh.

### 2.2. Gia tri cot loi

Gia tri 1: Du lieu ket noi.
  He thong biet hom nay user tap nhom co nao de goi y bua an phu hop.
  Khong app gym rieng le nao lam duoc vi khong co food catalog.
  Khong app food rieng le nao lam duoc vi khong co gym log.

Gia tri 2: Trust thong qua minh bach.
  Moi thiet bi gym co Gear ID rieng, ghi lai toan bo lich su: ai so huu,
  tinh trang nhu the nao, bao duong chua. Mua tren FitFuel+ khac voi mua
  tren Shopee o cho: biet ro thiet bi da qua tay ai.

Gia tri 3: Dong luc thong qua gamification.
  XP, badge, streak, ranking tao co che thuong va thi dua.
  User dau tu cam xuc vao profile nen khong muon roi di.

### 2.3. Tai sao khong dung cac giai phap hien co?

  MyFitnessPal: Chi track calo, khong co gym log, khong co marketplace.
  Strong/JEFIT: Chi gym tracking, khong co food order.
  Shopee: Khong co Gear Lifecycle, khong co trust tu fitness profile.
  GrabFood: Khong co thong tin macro, khong biet user tap gi.

  => Khong co nen tang nao ket hop ca 3 mang de chung "noi chuyen" voi nhau.

========================================================================

## 3. MUC TIEU HE THONG
========================================================================

### 3.1. Muc tieu chinh

  MT-01: Cho phep user log buoi tap, theo doi tien do va dat PR.
  MT-02: Goi y bua an phu hop dua tren nhom co vua tap (rule-based).
  MT-03: Cho phep dat do an healthy voi day du thong tin macro.
  MT-04: Ho tro guest checkout khong can dang ky tai khoan.
  MT-05: Cho phep thue/mua/ban thiet bi gym voi Gear Lifecycle minh bach.
  MT-06: Xay dung he thong gamification (XP, badge, streak, ranking).
  MT-07: Xay dung he thong FitCoin (credit noi bo).
  MT-08: Cung cap dashboard cho Food Vendor va Gym Owner (B2B).

### 3.2. Muc tieu do luong duoc

  - User co the tao buoi tap va log exercise trong duoi 60 giay.
  - Checkout don food toi da 3 buoc (ke ca guest).
  - Trang load duoi 2 giay tren mobile.
  - Gear Lifecycle hien thi day du history trong 1 man hinh.

========================================================================

## 4. PHAM VI HE THONG
========================================================================

### 4.1. Trong pham vi (In Scope)

  MODULE 1 - Quan ly tai khoan:
    Dang ky, dang nhap, guest OTP, profile, Fitness Passport.

  MODULE 2 - Gym Tracking:
    Tao session, log exercise, PR, progress chart, check-in QR,
    Smart Workout Suggestion, thong ke.

  MODULE 3 - Food Order:
    Browse, filter, cart, checkout (member va guest), re-order,
    AI Food Suggestion, TDEE Calculator, Macro Dashboard,
    review, Meal Prep subscription.

  MODULE 4 - Gear Hub:
    Listing, Gear Lifecycle, thue, mua, ban, QR code, AI Gear Suggestion.

  MODULE 5 - Gamification:
    XP, level, badge, streak, challenge, ranking board.

  MODULE 6 - Social:
    Feed, follow, referral program.

  MODULE 7 - Payment va FitCoin:
    Thanh toan, gia han membership, FitCoin earn/spend/deposit.

  MODULE 8 - Gym Owner va B2B:
    Food Vendor Portal, Gym Owner Dashboard, Gym Owner Panel.

### 4.2. Ngoai pham vi (Out of Scope)

  - Tich hop wearable device (Apple Watch, Fitbit)
  - Video call voi Personal Trainer
  - Live streaming buoi tap
  - Chat real-time giua user voi nhau
  - Thanh toan that (chi dung sandbox VNPay/Momo)
  - Mobile app native (chi lam responsive web)
  - 3D food rendering
  - AI/ML phuc tap (chi dung rule-based mapping)
  - Quan ly kho hang cho vendor
  - He thong logistics/van chuyen tu dong

========================================================================

## 5. CAC GIA DINH VA RANG BUOC
========================================================================

### 5.1. Gia dinh (Assumptions)

  GD-01: User co smartphone hoac may tinh co trinh duyet web hien dai.
  GD-02: User co ket noi Internet on dinh.
  GD-03: Food Vendor tu quan ly viec chuan bi va giao hang.
  GD-04: User tu nhap du lieu buoi tap (khong tu dong tu thiet bi).
  GD-05: He thong thanh toan chi hoat dong o che do sandbox (demo).
  GD-06: Du lieu seed (mon an, thiet bi mau) duoc tao san de demo.

### 5.2. Rang buoc (Constraints)

  RB-01: Thoi gian phat trien: 6 tuan.
  RB-02: Doi ngu: 5 thanh vien, trinh do khong dong deu.
  RB-03: Tech stack: React.js (Frontend) + Node.js/Express (Backend).
  RB-04: Database: MySQL hoac PostgreSQL.
  RB-05: Ngan sach: 0 dong (dung free tier cho moi thu).
  RB-06: Deployment: Vercel (FE) + Railway/Render (BE).

========================================================================
KET THUC FILE 01
========================================================================
