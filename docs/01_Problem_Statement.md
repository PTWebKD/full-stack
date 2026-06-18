# 01. PHAT BIEU BAI TOAN VA PHAM VI HE THONG
# (Problem Statement & System Scope)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026 (Cap nhat: 18/06/2026 — Dinh huong lai theo Product Owner)

========================================================================

## 1. DAT VAN DE
========================================================================

### 1.1. Boi canh

Thi truong fitness tai Viet Nam tang truong manh trong giai doan 2020-2026.
So luong phong tap gym tai cac thanh pho lon tang trung binh 15-20% moi nam.
Tuy nhien, phan lon phong tap con van hanh theo kieu thu cong — quan ly hoi vien
bang excel, ghi chep coc-tay, khong co cong cu theo doi hay canh bao tu dong.
Chu phong tap chua khai thac duoc du lieu san co de giu chan hoi vien, tang
doanh thu phu tro va van hanh hieu qua hon.

### 1.2. Cac van de cu the

Van de 1: KHO QUAN LY VONG DOI HOI VIEN
- Chu phong tap khong biet hoi vien nao sap het han, da het han, lau chua tap.
- Khong co canh bao tu dong de nhan vien lien he gia han kip thoi.
- Hoi vien roi bo ma phong tap khong hay biet cho den khi da mat.
- Khong co du lieu de biet goi nao ban chay, goi nao can dieu chinh gia.

Van de 2: DOANH THU TU BAN VA CHO THUE GEAR BI BO NGO
- Phong tap co san pham gear (ta, day, gang tay, dung cu phu tro) nhung ban khong he thong.
- Khong quan ly duoc so luong gear cho thue, dat coc, ngay tra, tinh trang gear.
- Khach vang lai (chua co tai khoan) khong the mua hang tai chong ma khong dang ky.
- Khong co bao cao doanh thu theo kenh: ban gear, cho thue gear, dat coc dang giu.

Van de 3: DOANH THU PHU TRO TU DINH DUONG CHUA DUOC TOI UU
- San pham dinh duong (protein shake, nuoc dien giai, snack, meal prep) ban khong co he thong.
- Khong biet san pham nao ban chay, san pham nao ton kho, khung gio nao ban nhieu nhat.
- Nhan vien ban le thu cong, khong co bao cao doanh thu theo san pham.
- Khong the tao combo (goi tap + dinh duong) de tang doanh thu tren moi hoi vien.

Van de 4: AI CHUA HO TRO QUYET DINH VAN HANH
- Du lieu hoi vien co nhung nhan vien khong biet can hanh dong gi.
- Khong co goi y "ai can cham soc", "ai nen upsell goi", "ai co nguy co roi bo".
- Bao cao chi thong ke so lieu, khong tao ra hanh dong cu the cho nhan vien.
- HLV/PT khong co cong cu theo doi tien do hoi vien de tu van dung luc.

### 1.3. Doi tuong bi anh huong

- Chu phong tap / Quan ly (Gym Owner): can he thong quan ly toan dien
- Nhan vien le tan: can cong cu nhanh cho check-in, ban dinh duong, quan ly gear
- HLV / Personal Trainer (PT): can theo doi tien do hoi vien, quan ly lich tap
- Hoi vien (Member): can xem quyen loi, lich su tap, dinh duong ca nhan hoa

========================================================================

## 2. GIAI PHAP DE XUAT
========================================================================

### 2.1. Mo ta giai phap

FitFuel+ la he thong quan ly phong tap gym toan dien (Single-tenant Gym Management
System), tap trung vao bai toan van hanh thuc cua chu phong tap. He sinh thai ket hop
4 nhan to cot loi:

  Tru cot 1 — Quan ly vong doi hoi vien (Membership Lifecycle):
    Dang ky, gia han, nang cap, tam ngung goi tap.
    Theo doi hoi vien sap het han, da het han, lau chua check-in.
    Giao dien check-in nhanh tai quay: xac nhan goi tap va quyen loi tuc thi.

  Tru cot 2 — Van hanh noi bo (Nutrition & Gear Marketplace):
    Ban san pham dinh duong noi bo (protein, nuoc, snack, meal combo).
    Ban va cho thue gear noi bo: ta, day, gang tay, dung cu phu tro.
    Guest OTP Checkout: khach vang lai mua hang bang SDT + OTP, khong can dang ky.

  Tru cot 3 — AI & Bao cao ra quyet dinh:
    Rule-based recommendation: ai can cham soc, ai nen upsell, ai co nguy co roi bo.
    Dashboard KPI: doanh thu, hoi vien active, ton kho gear/dinh duong.
    SQL bao cao minh bach: ty le gia han, san pham ban chay, gear cho thue.

  Diem ket noi:
    Fitness Passport — ho so the hinh ca nhan cua hoi vien (buoi tap, PR, streak, badge).
    Tat ca module (check-in, dinh duong, tai san) deu gan voi membership cua hoi vien.

### 2.2. Gia tri cot loi

Gia tri 1: Du lieu thanh hanh dong.
  He thong khong chi luu so lieu, ma chuyen du lieu thanh danh sach viec cho nhan vien:
  "5 hoi vien sap het han tuan nay — goi dien ngay", "Gear G03 qua han tra 2 ngay".

Gia tri 2: Membership la xuong song.
  Moi giao dich (dinh duong, check-in, gear, PT) deu duoc gan vao goi tap.
  Gym Owner biet chinh xac goi nao dem lai doanh thu cao nhat va giu chan hoi vien tot nhat.

Gia tri 3: Van hanh nhanh tai quay.
  Nhan vien quet/tim member -> xac nhan goi -> ban dinh duong / gear
  trong cung 1 man hinh POS, giam thoi gian phuc vu va loi viec thu cong.

Gia tri 4: Dong luc hoi vien qua gamification.
  XP, badge, streak, ranking — hoi vien dau tu cam xuc vao profile nen kho roi bo.
  Lich su tap luyen minh bach giup HLV tu van dung hon.

### 2.3. Tai sao khong dung cac giai phap hien co?

  Excel / Google Sheets: Khong canh bao tu dong, khong co AI, khong co bao cao.
  Mindbody / Gymdesk: Phan mem nuoc ngoai, phi cao, khong phu hop quy mo VN.
  Phan mem ke toan thong thuong: Khong co check-in, khong co quan ly tien ich, khong co AI.
  App chat + ghi tay: Khong the tong hop du lieu, khong bao cao duoc.

  => FitFuel+ la giai phap tich hop, tieng Viet, phu hop quy mo 1 phong tap, co AI retention.

========================================================================

## 3. MUC TIEU HE THONG
========================================================================

### 3.1. Muc tieu chinh

  MT-01: Quan ly vong doi membership day du (dang ky, gia han, nang cap, bao luu).
  MT-02: He thong check-in nhanh (quet QR), xac nhan quyen loi membership tu dong.
  MT-03: Ban san pham dinh duong noi bo, quan ly ton kho, bao cao san pham ban chay.
  MT-04: Ban va cho thue gear noi bo (ta, day, gang tay, dung cu); quan ly ton kho, dat coc.
  MT-05: AI rule-based cho retention (nhac han, cham soc hoi vien rui ro, upsell).
  MT-06: Dashboard KPI cho chu phong tap (doanh thu, hoi vien, ton kho, tai san).
  MT-07: Gym Tracking — hoi vien log buoi tap, theo doi PR, streak, Fitness Passport.
  MT-08: Gamification (XP, badge, streak) de giu chan hoi vien.

### 3.2. Muc tieu do luong duoc

  - Check-in tai quay hoan thanh duoi 10 giay.
  - Hoi vien sap het han (7 ngay) xuat hien ngay trong AI care queue.
  - Bao cao doanh thu theo module cap nhat real-time.
  - Hoi vien co the log buoi tap trong duoi 60 giay.
  - Trang load duoi 2 giay tren mobile.

========================================================================

## 4. PHAM VI HE THONG
========================================================================

### 4.1. Trong pham vi (In Scope)

  MODULE 1 — Quan ly tai khoan:
    Dang ky (Gym Owner tao Member qua POS hoac Online 100%).
    Dang nhap, cap nhat ho so, Fitness Passport.

  MODULE 2 — Gym Tracking:
    Tao session, log exercise, PR, progress chart, check-in QR,
    Smart Workout Suggestion, thong ke.

  MODULE 3 — Membership Lifecycle:
    Dang ky goi tap, gia han, nang cap, tam ngung, bao luu.
    Danh sach hoi vien sap het han, da het han, lau chua check-in.
    Lich su membership va hoa don.

  MODULE 4 — Nutrition (Noi bo):
    Chu phong tap quan ly san pham dinh duong (ten, gia, ton kho).
    Nhan vien ban tai quay (POS noi bo). Hoi vien dat truoc sau buoi tap.
    Combo goi tap + dinh duong. Bao cao ton kho va san pham ban chay.

  MODULE 5 — Gear Marketplace (noi bo):
    Catalog gear: ta, day, gang tay, dung cu phu tro (ban + cho thue mang ve).
    Guest OTP Checkout: khach vang lai mua gear/dinh duong bang SDT + OTP.
    Member thue gear: dat coc, theo doi ngay tra, xu ly qua han va phi phat.

  MODULE 6 — PT / Lich tap (Personal Training):
    Quan ly HLV, dang ky buoi PT, lich tap ca nhan.
    Ghi nhan ket qua buoi PT, tien do hoi vien.

  MODULE 7 — Gamification:
    XP, level, badge, streak, challenge, ranking board.

  MODULE 8 — Payment va FitCoin:
    Thanh toan sandbox (VNPay/Momo), gia han membership.
    FitCoin earn/spend/deposit.

  MODULE 9 — AI Retention & Reporting:
    Care queue: danh sach hoi vien can cham soc va ly do.
    Goi y upsell: goi, PT, dinh duong phu hop theo hanh vi.
    Dashboard KPI: doanh thu, hoi vien, ton kho gear/dinh duong.
    SQL bao cao chuan chung minh du lieu co the ra quyet dinh.

### 4.2. Ngoai pham vi (Out of Scope)

  - Food Vendor ben ngoai (chuoi, nha hang, giao hang nhu ShopeeFood)
  - Thi truong thiet bi P2P giua cac hoi vien (mua ban, cho thue gear)
  - Tich hop wearable device (Apple Watch, Fitbit)
  - Video call voi Personal Trainer
  - Live streaming buoi tap
  - Chat real-time giua user voi nhau
  - Thanh toan that (chi dung sandbox VNPay/Momo)
  - Mobile app native (chi lam responsive web)
  - AI/ML phuc tap (chi dung rule-based mapping)
  - He thong logistics / van chuyen tu dong
  - Quan ly nhieu phong tap / chuoi gym (single-tenant, 1 gym duy nhat)

========================================================================

## 5. CAC GIA DINH VA RANG BUOC
========================================================================

### 5.1. Gia dinh (Assumptions)

  GD-01: Moi user co smartphone hoac may tinh co trinh duyet web hien dai.
  GD-02: User co ket noi Internet on dinh.
  GD-03: Chu phong tap quan ly toan bo san pham dinh duong noi bo (khong co vendor ngoai).
  GD-04: Hoi vien tu nhap du lieu buoi tap (khong tu dong tu thiet bi).
  GD-05: He thong thanh toan chi hoat dong o che do sandbox (demo).
  GD-06: Du lieu seed (san pham dinh duong, loai tai san, goi tap mau) duoc tao san.
  GD-07: He thong phuc vu DUY NHAT 1 phong tap (single-tenant — khong co chuoi gym).

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
