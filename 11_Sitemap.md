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
  (S)     : Trang danh cho Gear Seller
  (G)     : Trang danh cho Gym Owner

========================================================================

## SITEMAP TONG THE
========================================================================

```
FitFuel+ (Root)
|
+-- / (P) Landing Page
|   Mo ta: Trang gioi thieu FitFuel+, hero section, 3 module chinh,
|          CTA dang ky, so lieu noi bat, testimonial.
|
+-- /auth
|   +-- /login (P) Dang nhap
|   |   Mo ta: Form email + password. Link "Quen mat khau".
|   |          Link "Dang ky". Link "Dang nhap bang OTP".
|   |
|   +-- /register (P) Dang ky
|   |   Mo ta: Form email/SDT, mat khau, ten. Chon muc tieu the hinh.
|   |
|   +-- /forgot-password (P) Quen mat khau
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
|   +-- /food (P) Danh sach food
|   |   Mo ta: Grid card san pham. Moi card co: anh, ten, gia,
|   |          calo, nut [+] de them vao cart.
|   |          Bo loc: khoang calo, macro, muc tieu, di ung.
|   |          Thanh tim kiem theo ten.
|   |
|   +-- /food/:id (P) Chi tiet food
|   |   Mo ta: Anh lon, ten, gia, mo ta, thanh phan macro
|   |          (protein/carb/fat), nguyen lieu, di ung, review.
|   |          Chon size/option, nut [Them vao gio hang].
|   |
|   +-- /food/meal-prep (M) Goi Meal Prep
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
|   +-- /gear (P) Danh sach gear
|   |   Mo ta: Grid card gear. Moi card: anh, ten, gia,
|   |          tinh trang (1-5 sao), listing type (Ban/Thue).
|   |          Bo loc: danh muc, khoang gia, tinh trang, hinh thuc.
|   |
|   +-- /gear/:id (P) Chi tiet gear + Lifecycle
|   |   Mo ta: Anh lon, thong tin chi tiet, gia.
|   |          GEAR LIFECYCLE TIMELINE:
|   |          Bang doc hien thi toan bo lich su gear
|   |          (ngay, hanh dong, chu nhan, tinh trang, anh, ghi chu).
|   |          Nut [Mua] hoac [Thue].
|   |
|   +-- /gear/sell (M) Dang ban/cho thue gear
|   |   Mo ta: Form dang ban: ten, danh muc, gia, condition (1-5),
|   |          ghi chu, upload anh. Chon: Ban / Thue / Ca hai.
|   |          Sau khi submit: hien thi Gear ID + QR Code.
|   |
|   +-- /gear/my-listings (M) Gear cua toi
|       Mo ta: Danh sach gear user da dang.
|              Trang thai: Dang ban / Da ban / Dang cho thue.
|              Nut [Sua], [An], [Xoa].
|
+-- /passport (M) Fitness Passport
|   Mo ta: Ho so the hinh tong hop.
|          - Stats: tong buoi, tong volume, longest streak
|          - Body Transformation Timeline (anh theo thoi gian)
|          - Badge collection (da unlock va chua unlock)
|          - Lich su milestone
|          Toggle public/private.
|
+-- /nutrition (M) Module Dinh duong
|   +-- /nutrition/tdee (M) TDEE Calculator
|   |   Mo ta: Form nhap: gioi tinh, tuoi, chieu cao, can nang,
|   |          muc do van dong.
|   |          Ket qua: TDEE (kcal/ngay), phan bo macro goi y.
|   |
|   +-- /nutrition/dashboard (M) Macro Dashboard
|       Mo ta: Bieu do vong tron hoac thanh ngang:
|              Calo / Protein / Carb / Fat da nap hom nay vs muc tieu.
|              Lich su 7 ngay.
|
+-- /community (M) Module Cong dong
|   +-- /community/feed (M) Social Feed
|   |   Mo ta: Newsfeed hien thi post tu nguoi user follow.
|   |          Moi post: avatar, ten, noi dung, anh, like, comment.
|   |          Cac loai post: PR moi, badge unlock, streak milestone.
|   |
|   +-- /community/ranking (M) Ranking Board
|   |   Mo ta: Top user theo XP.
|   |          Filter: Toan he thong / Theo phong tap / Tuan nay / Thang nay.
|   |
|   +-- /community/challenges (M) Weekly Challenges
|       Mo ta: Danh sach challenge dang mo.
|              Moi challenge: tieu de, mo ta, thuong, deadline.
|              Nut [Tham gia]. Tien do hien tai (progress bar).
|
+-- /profile (M) Profile ca nhan
|   +-- /profile (M) Thong tin ca nhan
|   |   Mo ta: Chinh sua: ten, avatar, muc tieu, email, SDT.
|   |
|   +-- /profile/:id (P) Xem profile nguoi khac
|   |   Mo ta: Hien thi Passport (neu public), stats, badge.
|   |          Nut [Follow] / [Unfollow].
|   |
|   +-- /profile/settings (M) Cai dat
|   |   Mo ta: Doi mat khau. Privacy (an Passport, an anh body).
|   |          Thong bao preferences. Xoa tai khoan.
|   |
|   +-- /profile/fitcoin (M) Lich su FitCoin
|   |   Mo ta: So du hien tai.
|   |          Lich su giao dich (earn/spend) voi filter.
|   |          Nut [Nap them].
|   |
|   +-- /profile/notifications (M) Thong bao
|       Mo ta: Danh sach thong bao (moi nhat truoc).
|              Danh dau da doc/chua doc.
|              Nhan vao thong bao = chuyen den trang lien quan.
|
+-- /vendor (V) Food Vendor Portal
|   +-- /vendor/products (V) Quan ly san pham
|   |   Mo ta: Danh sach san pham cua vendor.
|   |          Nut [Them san pham], [Sua], [An/Hien], [Xoa].
|   |          Toggle is_available.
|   |
|   +-- /vendor/orders (V) Quan ly don hang
|   |   Mo ta: Danh sach don hang.
|   |          Tab: Moi / Dang lam / Dang giao / Da giao / Huy.
|   |          Nut [Xac nhan], [Chuan bi xong], [Dang giao].
|   |
|   +-- /vendor/analytics (V) Thong ke
|       Mo ta: Doanh thu theo ngay/tuan/thang (bieu do).
|              Top mon ban chay. Rating trung binh.
|              So don hom nay / tuan nay.
|
    |
    +-- /gym-owner/fitcoin (A) Quan ly FitCoin
    |   Mo ta: Tong FitCoin luu thong.
    |          Danh sach giao dich lon.
    |          Dieu chinh ty gia (neu can).
    |
    +-- /gym-owner/reports (A) Bao cao he thong
        Mo ta: Thong ke tong the: so user, don hang, doanh thu.
               Bieu do tang truong.
               Top vendor, top gear seller.
```

========================================================================

## TONG KET SO TRANG
========================================================================

Nhom                  | So trang | Pham vi
----------------------|----------|--------
Landing + Auth        | 4        | Public
Dashboard             | 1        | Member
Gym Tracking          | 5        | Member
Food Order            | 3        | Public + Member
Cart + Checkout       | 2        | Public
Order History         | 2        | Member
Gear Hub              | 4        | Public + Member
Passport              | 1        | Member
Nutrition             | 2        | Member
Community             | 3        | Member
Profile               | 5        | Member + Public
Vendor Portal         | 3        | Vendor
Gym Owner Dashboard & Panel | 4  | Gym Owner
                      |----------|
TONG CONG             | 44 trang |

========================================================================
KET THUC FILE 11
========================================================================
