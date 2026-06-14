# 11. SO DO TRANG WEB
# (Sitemap)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich ky hieu:

  |       : Quan he cha-con (trang cha chua link den trang con)
  +--     : Nhanh con
  (P)     : Trang public (ai cung truy cap duoc)
  (M)     : Trang yeu cau dang nhap (Member)
  (V)     : Trang danh cho Food Vendor
  (G)     : Trang danh cho Gym Owner / Admin
  [*]     : Da implement trong code
  [TODO]  : Chua implement (ke hoach tuong lai)

========================================================================

## SITEMAP TONG THE
========================================================================

```
FitFuel+ (Root)
|
+-- / (P) Landing Page
|   Mo ta: Trang gioi thieu FitFuel+, hero section, 3 module chinh,
|          CTA dang ky, so lieu noi bat, testimonial.
|          BANG GIA GOI TAP (Pricing Section):
|          - Toggle Hang thang / Hang nam (giam gia ~16%)
|          - 3 goi: Basic (299K/thang), Pro (499K/thang - Popular),
|            Elite (899K/thang - All-inclusive)
|          - Gia hang nam = 10 thang (tiet kiem 2 thang mien phi)
|          - Nut [Chon goi] chuyen den /auth/register
|
+-- /auth
|   +-- /auth/login (P) [*] Dang nhap
|   |   Mo ta: Form email + password. Link "Dang ky".
|   |
|   +-- /auth/register (P) [*] Dang ky
|   |   Mo ta: Form email/SDT, mat khau, ten. Chon muc tieu the hinh.
|   |          Dung cho: Vendor, Gym Owner. Member dang ky qua Checkout Modal.
|   |
|   +-- /auth/forgot-password (P) [TODO] Quen mat khau
|       Mo ta: Nhap email, nhan link reset password.
|
+-- /dashboard (M) Member Dashboard
|   Mo ta: Tong quan ca nhan. Bao gom:
|          - Streak hien tai + XP + Level
|          - Macro Dashboard nho (calo hom nay)
|          - Buoi tap gan nhat
|          - AI Food Suggestion widget
|          - Thong bao moi nhat
|          - Quick action: [Bat dau tap] [Dat do an] [Gear Hub]
|
+-- /gym (M) Module Gym Tracking
|   +-- /gym/new-session (M) Tao buoi tap moi
|   |   Mo ta: Chon ngay, nhom co, ghi chu. Nhan [Bat dau].
|   |
|   +-- /gym/session/:id (M) Chi tiet buoi tap dang hoat dong
|   |   Mo ta: Log exercise (chon bai tap, nhap set/reps/weight).
|   |          Nut [Them bai tap], [Ket thuc buoi tap].
|   |          Khi ket thuc: hien popup AI Food Suggestion.
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
+-- /food (P/M) Module Food Order
|   +-- /food (P) [*] Danh sach food
|   |   Mo ta: Grid card san pham. Moi card co: anh, ten, gia,
|   |          calo, nut [+] de them vao cart.
|   |          Bo loc: khoang calo, macro, muc tieu, di ung.
|   |          Thanh tim kiem theo ten.
|   |
|   +-- /food/:id (P) [*] Chi tiet food
|   |   Mo ta: Anh lon, ten, gia, mo ta, thanh phan macro
|   |          (protein/carb/fat), nguyen lieu, di ung, review.
|   |          Chon size/option, nut [Them vao gio hang].
|   |
|   +-- /food/meal-prep (M) [TODO] Goi Meal Prep
|       Mo ta: Cac goi co san (tuan/thang).
|              Tu chon mon theo ngay.
|              Tinh tong calo/macro ca goi.
|
+-- /cart (P) Gio hang
|   Mo ta: Danh sach san pham trong cart.
|          Moi dong: anh nho, ten, gia, qty (+ -), size dropdown.
|          THAY DOI THUOC TINH NGAY TRONG CART (khong can roi trang).
|          Tong tien tu dong cap nhat.
|          Nut [Xoa] cho tung san pham.
|          Nut [Thanh toan].
|
+-- /checkout (P/M) Thanh toan
|   Mo ta: 3 buoc:
|          Buoc 1: Xac nhan gio hang (neu chua dang nhap: nhap SDT + OTP).
|          Buoc 2: Dia chi + khung gio giao.
|          Buoc 3: Phuong thuc thanh toan + xac nhan.
|
+-- /orders (P/M) Lich su don hang
|   +-- /orders (M) Danh sach don hang
|   |   Mo ta: Tat ca don hang (moi nhat truoc).
|   |          Hien thi: ma don, ngay, trang thai, tong tien.
|   |          Tab: Tat ca / Dang xu ly / Da giao / Da huy.
|   |          Nut [Dat lai] cho moi don da giao.
|   |
|   +-- /orders/:id (M) Chi tiet don hang
|       Mo ta: Danh sach mon, so luong, gia.
|              Trang thai don (timeline: pending -> delivered).
|              Thong tin giao hang.
|
+-- /gear (P/M) Module Gear Hub
|   +-- /gear (P) [*] Danh sach gear
|   |   Mo ta: Grid card gear. Moi card: anh, ten, gia,
|   |          tinh trang (1-5 sao), listing type (Ban/Thue).
|   |          Bo loc: danh muc (Weights/Apparel/Supplements/Accessories/
|   |          Cardio/Recovery), khoang gia, tinh trang, hinh thuc.
|   |
|   +-- /gear/:id (P) [*] Chi tiet gear
|   |   Mo ta: Anh lon, thong tin chi tiet, gia.
|   |          Nut [Mua] hoac [Thue].
|   |
|   +-- /gear/:id/lifecycle (P) [*] Gear Lifecycle Timeline
|   |   Mo ta: Bang doc hien thi toan bo lich su gear
|   |          (ngay, hanh dong, chu nhan, tinh trang, anh, ghi chu).
|   |
|   +-- /gear/:id/rent (M) [*] Dat thue gear
|   |   Mo ta: Chon ngay bat dau/ket thuc thue. Xac nhan tien coc.
|   |
|   +-- /gear/sell (M) [*] Dang ban/cho thue gear
|   |   Mo ta: Form dang ban: ten, danh muc, gia, condition (1-5),
|   |          ghi chu, upload anh. Chon: Ban / Thue / Ca hai.
|   |          Sau khi submit: hien thi Gear ID + QR Code.
|   |
|   +-- /gear/manage (M) [*] Quan ly gear cua toi
|       Mo ta: Danh sach gear user da dang.
|              Trang thai: cho duyet / dang ban / da ban / dang cho thue.
|              Nut [Sua], [An], [Xoa].
|              (Sitemap goc: /gear/my-listings)
|
+-- /membership (M) Dang ky / Gia han Goi Tap
|   Mo ta: Trang quan ly goi tap cho Member.
|          - Hien thi goi dang su dung, ngay het han, so ngay con lai.
|          - Toggle Hang thang / Hang nam (giam gia ~16%).
|          - 3 goi: Basic / Pro / Elite voi danh sach tinh nang.
|          - Gia hang nam = gia thang x 10 (2 thang mien phi).
|          - Modal xac nhan: tom tat don hang, chon phuong thuc.
|          - Ho tro dung FitCoin giam gia toi da 20%.
|          - Phuong thuc: MoMo, VNPay, ZaloPay, Tien mat.
|          - Sau thanh toan: man hinh thanh cong + +50 FC.
|
+-- /passport (M) Fitness Passport
|   Mo ta: Ho so the hinh tong hop.
|          - Stats: tong buoi, tong volume, longest streak
|          - Body Transformation Timeline (anh theo thoi gian)
|          - Badge collection (da unlock va chua unlock)
|          - Lich su milestone
|          Toggle public/private.
|
+-- /tdee (M) [*] TDEE Calculator
|   Mo ta: Form nhap: gioi tinh, tuoi, chieu cao, can nang, muc do van dong.
|          Ket qua: TDEE (kcal/ngay), phan bo macro goi y.
|          (Sitemap goc: /nutrition/tdee)
|
+-- /macro (M) [*] Macro Dashboard
|   Mo ta: Bieu do vong tron hoac thanh ngang:
|          Calo / Protein / Carb / Fat da nap hom nay vs muc tieu.
|          Lich su 7 ngay.
|          (Sitemap goc: /nutrition/dashboard)
|
+-- /ai-assistant (M) [*] AI Food Suggestion
|   Mo ta: Goi y thuc don tu AI dua tren buoi tap gan nhat.
|          3 mon goi y voi thong so macro. Nut [Them vao gio hang].
|
+-- /social (M) [*] Social Feed
|   Mo ta: Newsfeed hien thi post tu nguoi user follow.
|          Moi post: avatar, ten, noi dung, anh, like, comment.
|          Cac loai post: PR moi, badge unlock, streak milestone.
|          (Sitemap goc: /community/feed)
|
+-- /leaderboard (M) [*] Ranking Board
|   Mo ta: Top user theo XP.
|          Filter: Toan he thong / Theo phong tap / Tuan nay / Thang nay.
|          (Sitemap goc: /community/ranking)
|
+-- /challenges (M) [*] Weekly Challenges
|   Mo ta: Danh sach challenge dang mo.
|          Moi challenge: tieu de, mo ta, thuong, deadline.
|          Nut [Tham gia]. Tien do hien tai (progress bar).
|          (Sitemap goc: /community/challenges)
|
+-- /profile (M) [*] Profile ca nhan
|   Mo ta: Chinh sua: ten, avatar, muc tieu the hinh, email, SDT,
|          di ung ca nhan (allergens).
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
|          (Sitemap goc: /profile/fitcoin)
|
+-- /profile/notifications (M) [TODO] Thong bao
|   Mo ta: Danh sach thong bao (moi nhat truoc).
|          Danh dau da doc/chua doc.
|          Nhan vao thong bao = chuyen den trang lien quan.
|
+-- /vendor (V) Food Vendor Portal
|   +-- /vendor/dashboard (V) [*] Trang tong quan vendor
|   |
|   +-- /vendor/products (V) [*] Quan ly san pham
|   |   Mo ta: Danh sach san pham cua vendor.
|   |          Nut [Them san pham], [Sua], [An/Hien], [Xoa].
|   |          Toggle is_available.
|   |
|   +-- /vendor/orders (V) [*] Quan ly don hang
|   |   Mo ta: Danh sach don hang.
|   |          Tab: Moi / Dang lam / Dang giao / Da giao / Huy.
|   |          Nut [Xac nhan], [Chuan bi xong], [Dang giao].
|   |
|   +-- /vendor/reviews (V) [*] Quan ly danh gia
|   |   Mo ta: Danh sach review tu khach hang. Bo loc theo san pham/sao.
|   |
|   +-- /vendor/analytics (V) [*] Thong ke
|       Mo ta: Doanh thu theo ngay/tuan/thang (bieu do).
|              Top mon ban chay. Rating trung binh.
|              So don hom nay / tuan nay.
|
+-- /gym-owner (G) Gym Owner Portal
|   +-- /gym-owner/dashboard (G) [*] Trang tong quan
|   |   Mo ta: So lieu noi bat: so hoi vien, doanh thu thang, tin dang gear.
|   |
|   +-- /gym-owner/members (G) [*] Quan ly hoi vien
|   |   Mo ta: Danh sach member. Tim kiem, loc theo goi tap.
|   |          Nut [Khoa], [Xem chi tiet].
|   |
|   +-- /gym-owner/announcements (G) [*] Gui thong bao khuyen mai
|   |   Mo ta: Tao va gui thong bao den toan bo hoac nhom hoi vien.
|   |
|   +-- /gym-owner/analytics (G) [*] Thong ke phong tap
|   |   Mo ta: Bieu do tang truong hoi vien, doanh thu.
|   |
|   +-- /gym-owner/fitcoin (G) [TODO] Quan ly FitCoin
|   |   Mo ta: Tong FitCoin luu thong. Danh sach giao dich lon.
|   |
|   +-- /gym-owner/reports (G) [TODO] Bao cao he thong
|       Mo ta: Thong ke tong the: so user, don hang, doanh thu.
|              Bieu do tang truong. Top vendor, top gear seller.
|
+-- /admin (G) Admin Panel (Gym Owner dong vai Admin)
    +-- /admin/dashboard (G) [*] Admin Dashboard
    +-- /admin/users (G) [*] Quan ly tat ca user
    +-- /admin/vendors (G) [*] Duyet va quan ly vendor
    +-- /admin/gear-disputes (G) [*] Xu ly tranh chap gear
    +-- /admin/reports (G) [*] Bao cao tong he thong
```

========================================================================

## TONG KET SO TRANG
========================================================================

Nhom                        | Da impl | TODO | Pham vi
----------------------------|---------|------|--------------------
Landing + Auth              | 3       | 1    | Public (forgot-password chua co)
Dashboard                   | 1       | 0    | Member
Gym Tracking                | 5       | 0    | Member
Food Order                  | 2       | 1    | Public + Member (meal-prep chua co)
Cart + Checkout             | 2       | 0    | Public
Order History               | 1       | 1    | Member (orders/:id chua co)
Gear Hub                    | 6       | 0    | Public + Member
Passport                    | 1       | 0    | Member
Nutrition / AI              | 3       | 0    | Member
Social / Community          | 3       | 0    | Member
Profile                     | 2       | 3    | Member (settings, :id, notifications chua)
FitCoin                     | 1       | 0    | Member
Membership                  | 1       | 0    | Member
Vendor Portal               | 4       | 0    | Vendor
Gym Owner Portal            | 4       | 2    | Gym Owner (fitcoin, reports chua co)
Admin Panel                 | 5       | 0    | Gym Owner (dong vai Admin)
                            |---------|------|
DA IMPLEMENT                | 44      |      |
CHUA IMPLEMENT (TODO)       |         | 8    |
TONG KE HOACH               | 52      |      |

========================================================================
KET THUC FILE 11
========================================================================
