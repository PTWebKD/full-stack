# 11. SO DO TRANG WEB
# (Sitemap)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026 (Cap nhat: 18/06/2026 — Dinh huong lai: Gym Management System)

========================================================================

Giai thich ky hieu:

  |       : Quan he cha-con (trang cha chua link den trang con)
  +--     : Nhanh con
  (P)     : Trang public (ai cung truy cap duoc)
  (M)     : Trang yeu cau dang nhap (Member)
  (G)     : Trang danh cho Gym Owner / Admin
  [*]     : Da implement trong code
  [TODO]  : Chua implement (ke hoach tuong lai)
  [NEW]   : Trang moi theo dinh huong Product Owner

========================================================================

## SITEMAP TONG THE
========================================================================

```
FitFuel+ (Root)
|
+-- / (P) Landing Page
|   Mo ta: Trang gioi thieu FitFuel+, thong tin phong tap, cac goi dich vu,
|          CTA dang ky, so lieu noi bat, testimonial hoi vien.
|          BANG GIA GOI TAP (Pricing Section):
|          - Goi Thang (399,000 VND/thang)
|          - Goi Nam (3,990,000 VND/nam — tiet kiem 2 thang)
|          - Ca hai goi: quyen loi y het nhau (vao phong tap tu do)
|          - Nut [Dang ky ngay] -> luong mua Membership
|
+-- /auth
|   +-- /auth/login (P) [*] Dang nhap
|   |   Mo ta: Form email + password. Danh cho tat ca role.
|   |
|   +-- /auth/register (P) [*] Dang ky Gym Owner
|   |   Mo ta: Form email, mat khau, ten. Chi danh cho Gym Owner.
|   |          Member dang ky qua luong mua Membership (khong qua trang nay).
|   |
|   +-- /auth/forgot-password (P) [TODO] Quen mat khau
|       Mo ta: Nhap email, nhan link reset password.
|
+-- /dashboard (M) Member Dashboard
|   Mo ta: Tong quan ca nhan hoi vien. Bao gom:
|          - Streak hien tai + XP + Level
|          - Goi tap dang su dung + ngay het han + so ngay con lai
|          - Buoi tap gan nhat
|          - AI Nutrition Suggestion widget (sau buoi tap)
|          - Thong bao moi nhat
|          - Quick action: [Bat dau tap] [Check-in] [Xem lich PT]
|
+-- /gym (M) Module Gym Tracking
|   +-- /gym/new-session (M) Tao buoi tap moi
|   |   Mo ta: Chon ngay, nhom co, ghi chu. Nhan [Bat dau].
|   |
|   +-- /gym/session/:id (M) Chi tiet buoi tap dang hoat dong
|   |   Mo ta: Log exercise (chon bai tap, nhap set/reps/weight).
|   |          Nut [Them bai tap], [Ket thuc buoi tap].
|   |          Khi ket thuc: hien popup AI Nutrition Suggestion.
|   |
|   +-- /gym/history (M) Lich su buoi tap
|   |   Mo ta: Danh sach session theo ngay (moi nhat truoc).
|   |          Hien thi: ngay, so bai tap, tong volume, thoi luong.
|   |          Filter theo tuan/thang.
|   |
|   +-- /gym/progress (M) Bieu do tien do
|   |   Mo ta: Bieu do duong hien thi weight theo thoi gian.
|   |          Chon bai tap cu the de xem progress.
|   |          So sanh theo tuan/thang.
|   |
|   +-- /gym/records (M) Personal Records
|       Mo ta: Danh sach PR cho tung bai tap.
|              Hien thi: ten bai, weight x reps, ngay dat PR.
|
+-- /checkin (M/G) Check-in phong tap [*]
|   Mo ta: Member quet QR hoac nhap SDT.
|          He thong tu dong: xac nhan goi tap, kiem tra con hieu luc,
|          ghi nhan check-in. Lich su check-in 7 ngay gan nhat.
|
+-- /membership (M) Goi tap cua toi
|   Mo ta: Trang quan ly goi tap cho Member.
|          - Hien thi goi dang su dung, ngay het han, so ngay con lai.
|          - Nut [Gia han] -> Modal gia han + thanh toan.
|          - Nut [Chuyen sang Goi Nam] -> Tinh phi con lai cua Goi Thang.
|          - Nut [Bao luu] -> Form xin bao luu, doi admin duyet.
|          - Lich su goi tap va hoa don cu.
|
+-- /nutrition (M/G) Module Dinh duong Noi bo [NEW]
|   +-- /nutrition (M) [NEW] Danh sach san pham dinh duong
|   |   Mo ta: Grid card san pham cua phong tap.
|   |          Moi card: anh, ten, gia, calo, macro, ton kho.
|   |          Bo loc: muc tieu (tang co/giam can/giu dang), macro.
|   |          Tim kiem theo ten.
|   |
|   +-- /nutrition/:id (M) [NEW] Chi tiet san pham
|   |   Mo ta: Anh lon, ten, gia, mo ta, thanh phan macro,
|   |          nguyen lieu, di ung.
|   |          Nut [Dat truoc] (nhan sau buoi tap) hoac [Mua ngay].
|   |
|   +-- /nutrition/orders (M) [NEW] Don dat truoc dinh duong
|       Mo ta: Danh sach don dat truoc dang cho (pending).
|              Trang thai: Dang chuan bi / San sang / Da nhan.
|
+-- /pt (M/G) Module Personal Training [NEW]
|   +-- /pt/trainers (G) [NEW] Quan ly HLV
|   |   Mo ta: Danh sach HLV: ten, chuyen mon, lich lam viec, gia buoi.
|   |          Nut [Them HLV], [Sua], [An/Hien].
|   |
|   +-- /pt/schedule (M/G) [NEW] Lich PT
|   |   Mo ta: Calendar view: lich buoi PT cua tung HLV.
|   |          Member: xem lich cua minh + lich HLV trong.
|   |          Admin: xem lich cua tat ca HLV.
|   |
|   +-- /pt/book (M) [NEW] Dat buoi PT
|   |   Mo ta: Chon HLV, chon ngay/gio, chon goi PT.
|   |          Xac nhan va thanh toan.
|   |
|   +-- /pt/sessions (M) [NEW] Ket qua buoi PT
|       Mo ta: Lich su buoi PT: bai da lam, nhan xet HLV, tien do.
|
+-- /passport (M) [*] Fitness Passport
|   Mo ta: Ho so the hinh tong hop.
|          - Stats: tong buoi, tong volume, longest streak
|          - Body Transformation Timeline (anh theo thoi gian)
|          - Badge collection (da unlock va chua unlock)
|          - Lich su milestone
|          - Lich su buoi PT (neu co)
|          Toggle public/private.
|
+-- /journey (M) [NEW] Transformation Journey
|   Mo ta: Hub chinh cua hanh trinh bien doi ca nhan.
|   +-- /journey (M) [NEW] Tong quan hanh trinh
|   |   Mo ta: Neu chua co goal -> CTA "Bat dau hanh trinh cua ban".
|   |          Neu co goal + CT active:
|   |          - Buoi tap hom nay: ten buoi, nhom co, uoc tinh thoi gian
|   |          - Progress bar chuong trinh hien tai (% + tuan X/12)
|   |          - Streak check-in + tien do goal
|   |
|   +-- /journey/goal (M) [NEW] Tao muc tieu (Goal Onboarding)
|   |   Mo ta: Wizard 5 buoc: Chon muc tieu -> Chi tieu cu the ->
|   |          So ngay/tuan -> Trinh do -> Chon chuong trinh.
|   |
|   +-- /journey/session (M) [NEW] Buoi tap hom nay
|   |   Mo ta: Hien thi goi y tu chuong trinh.
|   |          [Them bai] [Xoa bai] [Sua sets/reps] (tuy chon).
|   |          [CHAP NHAN & BAT DAU] -> /gym/session/:id.
|   |
|   +-- /journey/progress (M) [NEW] Progress Dashboard 3 tab
|   |   Mo ta: Tab 1: Hanh Trinh (progress bar + lich thang + streak).
|   |          Tab 2: Suc Manh (line chart Bench / Squat / Deadlift / OHP).
|   |          Tab 3: Co The (bieu do can nang + so do + body fat%).
|   |          Nut [Cap nhat so do hom nay].
|   |
|   +-- /journey/milestones (M) [NEW] Danh sach Milestone
|   |   Mo ta: Timeline milestone da dat (voi ngay, FitCoin nhan).
|   |          Share Card cho M32 / M42 neu da tao.
|   |          Milestone chua dat (locked, mo ta dieu kien).
|   |
|   +-- /journey/programs (M) [NEW] Cac chuong trinh co san
|       Mo ta: Thu vien chuong trinh cua phong tap.
|              Card: ten CT, goal, level, so tuan, mo ta ngan.
|              Nut [Bat dau] (neu chua co CT active) hoac [Xem chi tiet].
|
+-- /tdee (M) [*] TDEE Calculator
|   Mo ta: Form nhap: gioi tinh, tuoi, chieu cao, can nang, muc do van dong.
|          Ket qua: TDEE (kcal/ngay), phan bo macro goi y.
|
+-- /macro (M) [*] Macro Dashboard
|   Mo ta: Bieu do vong tron hoac thanh ngang:
|          Calo / Protein / Carb / Fat da nap hom nay vs muc tieu.
|          Lich su 7 ngay.
|
+-- /social (M) [*] Social Feed
|   Mo ta: Newsfeed hien thi post tu nguoi user follow.
|          Cac loai post: PR moi, badge unlock, streak milestone.
|
+-- /leaderboard (M) [*] Ranking Board
|   Mo ta: Top member theo XP.
|          Filter: Toan he thong / Tuan nay / Thang nay.
|
+-- /challenges (M) [*] Weekly Challenges
|   Mo ta: Danh sach challenge dang mo.
|          Nut [Tham gia]. Tien do hien tai (progress bar).
|
+-- /profile (M) [*] Profile ca nhan
|   Mo ta: Chinh sua: ten, avatar, muc tieu the hinh, email, SDT,
|          di ung ca nhan (allergens), muc tieu (bulk/cut/maintain).
|
+-- /profile/:id (P) [TODO] Xem profile nguoi khac
|   Mo ta: Hien thi Passport (neu public), stats, badge.
|          Nut [Follow] / [Unfollow].
|
+-- /profile/settings (M) [TODO] Cai dat
|   Mo ta: Doi mat khau. Privacy (an Passport, an anh body).
|          Thong bao preferences. Xoa tai khoan.
|
+-- /fitcoin (M) [*] Lich su FitCoin
|   Mo ta: So du hien tai.
|          Lich su giao dich (earn/spend) voi filter.
|          Nut [Nap them].
|
+-- /profile/notifications (M) [TODO] Thong bao
|   Mo ta: Danh sach thong bao (moi nhat truoc).
|          Danh dau da doc/chua doc.
|
+-- /gym-owner (G) Gym Owner Portal
|   +-- /gym-owner/dashboard (G) [*] Trang tong quan
|   |   Mo ta: KPI noi bat:
|   |          - So hoi vien active / sap het han / het han
|   |          - Doanh thu hom nay / thang nay (theo module)
|   |          - AI care queue: so hoi vien can xu ly
|   |          - Ton kho canh bao thap
|   |
|   +-- /gym-owner/members (G) [*] Quan ly hoi vien
|   |   Mo ta: Danh sach member. Tim kiem, loc theo goi tap.
|   |          Tab: Tat ca / Active / Sap het han / Da het han / Bao luu.
|   |          Bam vao member: xem ho so 360 day du.
|   |          Nut [Gia han], [Nang cap], [Khoa].
|   |
|   +-- /gym-owner/members/:id (G) [NEW] Ho so 360 hoi vien
|   |   Mo ta: Thong tin ca nhan, goi tap hien tai + lich su, lich su check-in,
|   |          hoa don, dinh duong da mua, gear da mua/thue, buoi PT, recommendation.
|   |
|   +-- /gym-owner/programs (G) [NEW] Quan ly thu vien chuong trinh
|   |   Mo ta: Danh sach tat ca chuong trinh (active/inactive).
|   |          Nut [Tao CT moi], [Sua], [An/Hien], [Sao chep].
|   |   +-- /gym-owner/programs/new (G) [NEW] Tao chuong trinh moi
|   |   |   Mo ta: Nhap thong tin CT: ten, goal, level, so tuan, so ngay/tuan.
|   |   |          Cau hinh tung tuan: PROGRAM_DAYS + PROGRAM_EXERCISES.
|   |   |
|   |   +-- /gym-owner/programs/:id/edit (G) [NEW] Sua chuong trinh
|   |       Mo ta: Chinh sua bai tap, sets/reps, phase, thu tu bai.
|   |
|   +-- /gym-owner/memberships (G) [NEW] Quan ly goi tap
|   |   Mo ta: Danh sach cac loai goi tap. Nut [Them goi], [Sua gia], [An/Hien].
|   |          Bao cao: goi nao ban chay nhat, doanh thu theo goi.
|   |
|   +-- /gym-owner/nutrition (G) [NEW] Quan ly dinh duong noi bo
|   |   +-- /gym-owner/nutrition/products (G) [NEW] Quan ly san pham
|   |   |   Mo ta: Danh sach san pham. Nut [Them], [Sua], [An/Hien], [Cap nhat ton kho].
|   |   |          Toggle is_available. Hien thi: ten, gia, ton kho, trang thai.
|   |   |
|   |   +-- /gym-owner/nutrition/pos (G) [NEW] POS ban tai quay
|   |   |   Mo ta: Giao dien ban hang nhanh. Tim kiem member, chon san pham,
|   |   |          so luong, tong tien. Xac nhan va tao hoa don.
|   |   |
|   |   +-- /gym-owner/nutrition/orders (G) [NEW] Don dat truoc tu member
|   |   |   Mo ta: Danh sach don dat truoc. Tab: Moi / Dang chuan bi / San sang.
|   |   |          Nut [Xac nhan], [Da chuan bi xong].
|   |   |
|   |   +-- /gym-owner/nutrition/analytics (G) [NEW] Thong ke dinh duong
|   |       Mo ta: Doanh thu theo ngay/tuan/thang. San pham ban chay.
|   |              Ton kho thap. Bieu do ban hang theo gio trong ngay.
|   |
|   +-- /gym-owner/pt (G) [NEW] Quan ly PT -> /pt
|   |   Mo ta: Redirect den /pt/trainers va /pt/schedule.
|   |
|   +-- /gym-owner/care-queue (G) [NEW] AI Care Queue
|   |   Mo ta: Danh sach hoi vien can cham soc, sap xep theo do uu tien.
|   |          Moi dong: ten member, ly do, goi y hanh dong, nut [Ghi nhan xu ly].
|   |          Ly do: Sap het han / Lau chua check-in / Da het han chua gia han.
|   |
|   +-- /gym-owner/announcements (G) [*] Gui thong bao
|   |   Mo ta: Tao va gui thong bao den toan bo hoac nhom hoi vien.
|   |
|   +-- /gym-owner/analytics (G) [*] Dashboard KPI tong hop
|   |   Mo ta: Doanh thu theo module, tang truong hoi vien, bieu do.
|   |          Ma tran traceability: quy trinh -> man hinh -> bang -> bao cao -> KPI.
|   |
|   +-- /gym-owner/reports (G) [NEW] Bao cao phan tich
|   |   Mo ta: Cac SQL report chuan:
|   |          - Hoi vien sap het han 7 ngay
|   |          - Hoi vien 14 ngay chua check-in
|   |          - Doanh thu theo loai dich vu
|   |          - San pham dinh duong ban chay
|   |          - Ty le recommendation da xu ly
|   |          - Doanh thu gear (ban + thue)
|   |
|   +-- /gym-owner/settings (G) [TODO] Cai dat phong tap
|       Mo ta: Ten, dia chi, SDT, gio mo cua, logo, thong tin lien he.
|
+-- /gear (P/M) Gear Marketplace
|   +-- /gear (P) [NEW] Danh sach gear
|   |   Mo ta: Guest/Member duyet gear. 2 tab: "Mua" va "Thue" (tab Thue chi hien khi dang nhap).
|   |          Hien thi: anh, ten, gia, trang thai con hang. Nut [Mua] / [Thue ngay].
|   |          Guest muon mua: redirect sang /gear/otp truoc.
|   |
|   +-- /gear/otp (P) [NEW] Guest xac thuc OTP
|   |   Mo ta: Guest nhap SDT -> He thong gui SMS OTP 6 so.
|   |          Nhap OTP -> xac thuc thanh cong -> redirect ve gio hang.
|   |          Hien thi: dem nguoc 10 phut, nut [Gui lai OTP].
|   |
|   +-- /gear/:id (P) [NEW] Chi tiet gear
|   |   Mo ta: Hinh anh, mo ta, gia ban, gia thue/ngay, so luong con, danh gia.
|   |          Nut [Them vao gio hang] / [Dat thue] (Dat thue chi cho Member).
|   |
|   +-- /gear/checkout (P/M) [NEW] Thanh toan mua gear
|   |   Mo ta: Gio hang, tong tien, phuong thuc thanh toan (VNPay/MoMo/tien mat).
|   |          Guest: hien thi guest_phone tu session OTP.
|   |
|   +-- /gear/rent (M) [NEW] Dat thue gear (Member only)
|   |   Mo ta: Chon gear, chon ngay bat dau, ngay tra. Tinh phi tong: thue + dat coc.
|   |          Thanh toan truoc -> tao GEAR_RENTALS.status='active'.
|   |
|   +-- /gear/my-rentals (M) [NEW] Lich su thue gear cua toi
|       Mo ta: Danh sach GEAR_RENTALS. Tab: Dang thue / Lich su / Qua han.
|              Moi dong: ten gear, ngay muon, ngay tra, phi, trang thai.
|
+-- /gym-owner/gear (G) [NEW] Quan ly Gear Marketplace
|   +-- /gym-owner/gear/products (G) [NEW] Catalog gear
|   |   Mo ta: Danh sach gear. Nut [Them], [Sua], [An/Hien]. Hien thi: qty, gia, trang thai.
|   |
|   +-- /gym-owner/gear/rentals (G) [NEW] Quan ly cho thue
|   |   Mo ta: Tat ca GEAR_RENTALS. Tab: Dang thue / Qua han / Lich su.
|   |          Nut [Xac nhan tra], [Danh dau mat/hong].
|   |
|   +-- /gym-owner/gear/analytics (G) [NEW] Bao cao gear
|       Mo ta: Doanh thu ban + thue gear. Dat coc dang giu. Gear ban chay / thue nhieu.
|
+-- /admin (G) Admin Panel (Gym Owner dong vai Admin)
    +-- /admin/dashboard (G) [*] Admin Dashboard
    +-- /admin/users (G) [*] Quan ly tat ca user
    +-- /admin/reports (G) [*] Bao cao tong he thong
    +-- /admin/settings (G) [TODO] Cai dat he thong
```

========================================================================

## TONG KET SO TRANG
========================================================================

Nhom                        | Da impl | NEW  | TODO | Pham vi
----------------------------|---------|------|------|--------------------
Landing + Auth              | 3       | 0    | 1    | Public
Dashboard                   | 1       | 0    | 0    | Member
Gym Tracking                | 5       | 0    | 0    | Member
Check-in                    | 1       | 0    | 0    | Member
Membership                  | 1       | 1    | 0    | Member
Nutrition (Noi bo)          | 0       | 5    | 0    | Member + Admin
Personal Training           | 0       | 4    | 0    | Member + Admin
Fitness Passport            | 1       | 0    | 0    | Member
Nutrition / AI              | 2       | 0    | 0    | Member
Social / Community          | 3       | 0    | 0    | Member
Profile                     | 2       | 0    | 3    | Member
FitCoin                     | 1       | 0    | 0    | Member
Transformation Journey      | 0       | 6    | 0    | Member
Gym Owner Portal (cu)       | 4       | 5    | 1    | Gym Owner
Gym Owner Programs          | 0       | 3    | 0    | Gym Owner
AI Care Queue               | 0       | 1    | 0    | Gym Owner
Gear Marketplace (Guest/Mem)| 0       | 6    | 0    | Public + Member
Gym Owner Gear              | 0       | 3    | 0    | Gym Owner
Admin Panel                 | 3       | 0    | 1    | Gym Owner
                            |---------|------|------|
DA IMPLEMENT                | 27      |      |      |
MAN HINH MOI (NEW)          |         | 34   |      |
CHUA IMPLEMENT (TODO)       |         |      | 6    |
TONG KE HOACH               | 67      |      |      |

========================================================================
KET THUC FILE 11
========================================================================
