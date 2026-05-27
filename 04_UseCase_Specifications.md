# 04. MO TA CHI TIET USE CASE
# (Use Case Specifications)

> Du an: FitFuel+
> Mon hoc: Web Kinh Doanh
> Ngay: 11/05/2026

========================================================================

Giai thich cau truc moi Use Case Specification:

  Use Case ID     : Ma dinh danh duy nhat.
  Ten Use Case    : Ten ngan gon, bat dau bang dong tu.
  Actor           : Tac nhan chinh thuc hien use case nay.
  Muc tieu        : Ket qua ma actor muon dat duoc.
  Dieu kien tien  : Dieu kien phai dung TRUOC khi use case bat dau.
  Dieu kien sau   : Trang thai he thong SAU khi use case hoan tat.
  Luong co ban    : Cac buoc chinh (happy path, moi thu dien ra dung).
  Luong thay the  : Cac nhanh re khi co lua chon hoac dieu kien khac.
  Luong ngoai le  : Cac truong hop loi, that bai.
  Quy tac nghiep vu: Lien ket den Business Rule (neu co).

========================================================================

## UC-01: DANG KY TAI KHOAN
========================================================================

  Use Case ID     : UC-01
  Ten             : Dang ky tai khoan moi
  Actor           : Guest
  Muc tieu        : Guest tao tai khoan de tro thanh Member.
  Dieu kien tien  : Guest chua co tai khoan tren he thong.
  Dieu kien sau   : Tai khoan duoc tao. User nhan JWT token.
                    Fitness Passport duoc khoi tao (rong).
                    Xp_total = 0, level = 1, streak = 0, fitcoin = 0.

  LUONG CO BAN:
    B1. Guest truy cap trang /auth/register.
    B2. He thong hien thi form dang ky.
    B3. Guest nhap: email, mat khau, xac nhan mat khau, ten hien thi.
    B4. Guest nhan nut [Dang ky].
    B5. He thong validate:
        - Email dung dinh dang va chua ton tai.
        - Mat khau >= 8 ky tu, co chu hoa, chu thuong, so.
        - Xac nhan mat khau khop.
        - Ten hien thi khong rong.
    B6. He thong hash mat khau (bcrypt, 10 rounds).
    B7. He thong tao ban ghi moi trong bang USERS (role = member).
    B8. He thong tao ban ghi moi trong bang FITNESS_PASSPORT.
    B9. He thong tra ve JWT token (7 ngay).
    B10. He thong chuyen huong den trang Dashboard.

  LUONG THAY THE:
    B3a. Guest chon dang ky bang SDT thay vi email:
      B3a.1. Guest nhap SDT.
      B3a.2. He thong gui OTP qua SMS.
      B3a.3. Guest nhap OTP.
      B3a.4. Neu dung: tiep tuc tu B6.
      B3a.5. Neu sai: hien thi loi (toi da 3 lan).

  LUONG NGOAI LE:
    E1. Email da ton tai:
        He thong hien thi "Email nay da duoc su dung."
        De xuat: "Dang nhap" hoac "Quen mat khau".
    E2. Loi server:
        He thong hien thi "Co loi xay ra, vui long thu lai."

  QUY TAC NGHIEP VU:
    BR-01 (password policy), BR-02 (OTP policy).

========================================================================

## UC-03: GUEST CHECKOUT BANG OTP
========================================================================

  Use Case ID     : UC-03
  Ten             : Checkout khong can dang ky (Guest OTP)
  Actor           : Guest
  Muc tieu        : Guest dat hang ma khong can tao tai khoan.
  Dieu kien tien  : Gio hang co it nhat 1 san pham.
                    Guest chua dang nhap.
  Dieu kien sau   : Don hang duoc tao voi guest_phone, user_id = null.
                    Vendor nhan thong bao don moi.

  LUONG CO BAN:
    B1. Guest nhan nut [Thanh toan] trong trang cart.
    B2. He thong phat hien khong co JWT token (chua dang nhap).
    B3. He thong hien thi form: "Nhap so dien thoai de dat hang".
    B4. Guest nhap so dien thoai.
    B5. He thong validate: SDT dung dinh dang VN (10 so, bat dau 0).
    B6. He thong gen OTP 6 so, luu vao cache (het han 5 phut).
    B7. He thong gui OTP qua SMS den SDT.
    B8. He thong hien thi form nhap OTP.
    B9. Guest nhap OTP.
    B10. He thong kiem tra OTP:
         - Dung va chua het han: tiep tuc.
         - Sai: tang bo dem (toi da 3 lan).
    B11. He thong tao temporary session cho Guest.
    B12. He thong chuyen den buoc nhap dia chi + chon gio giao.
    B13. Guest nhap dia chi, chon khung gio giao.
    B14. Guest chon phuong thuc thanh toan (VNPay/Momo).
    B15. He thong chuyen den cong thanh toan.
    B16. Thanh toan thanh cong (callback tu Payment Gateway).
    B17. He thong tao don hang:
         - user_id = null
         - guest_phone = SDT da nhap
         - status = pending
    B18. He thong gui thong bao den Vendor.
    B19. He thong hien thi "Dat hang thanh cong".

  LUONG THAY THE:
    B10a. OTP sai lan thu 3:
      B10a.1. He thong khoa SDT trong 15 phut.
      B10a.2. He thong hien thi "Ban da nhap sai qua nhieu lan.
               Vui long thu lai sau 15 phut."

    B14a. Guest muon xem lai don cu:
      B14a.1. He thong hoi SDT.
      B14a.2. He thong tim tat ca don hang co guest_phone = SDT.
      B14a.3. Hien thi danh sach don cu (Quick Re-order cho Guest).

  LUONG NGOAI LE:
    E1. SMS khong gui duoc:
        He thong hien thi "Khong gui duoc OTP. Vui long kiem tra SDT."
    E2. Thanh toan that bai:
        He thong hien thi "Thanh toan khong thanh cong."
        Quay lai buoc chon thanh toan (B14).

  QUY TAC NGHIEP VU:
    BR-02 (OTP het han 5 phut, toi da 3 lan).

  GHI CHU THIET KE:
    Day la yeu cau dac biet theo ghi chu giang vien: "Nguoi lon tuoi
    khong can dang nhap, khong can email cung checkout duoc."

========================================================================

## UC-18: THEM SAN PHAM VAO GIO HANG
========================================================================

  Use Case ID     : UC-18
  Ten             : Them san pham vao gio hang
  Actor           : Guest, Member
  Muc tieu        : User them food vao gio hang nhanh nhat co the.
  Dieu kien tien  : User dang o trang Food Listing hoac Food Detail.
  Dieu kien sau   : San pham nam trong gio hang, so luong cap nhat.

  LUONG CO BAN:
    B1. User xem danh sach food (trang listing hoac trang chu).
    B2. User nhan nut [+] tren card san pham.
        (Nut [+] nam ngay tren card, khong can vao trang detail)
    B3. He thong kiem tra: san pham con hang? (is_available = true)
    B4. He thong kiem tra: san pham da co trong gio hang chua?
    B5. Neu CHUA co: them moi voi qty = 1.
    B6. Neu DA co: tang qty them 1.
    B7. He thong luu gio hang (localStorage cho Guest, server cho Member).
    B8. He thong hien thi thong bao ngan: "Da them [ten mon]".
    B9. Icon gio hang tren navbar cap nhat so luong.

  LUONG THAY THE:
    B2a. User them tu trang Food Detail:
      B2a.1. User dang o trang chi tiet san pham.
      B2a.2. User co the chon size/option truoc khi them.
      B2a.3. User nhan [Them vao gio hang].
      B2a.4. Tiep tuc tu B3.

    B3a. San pham het hang:
      B3a.1. Nut [+] o trang thai disabled (xam).
      B3a.2. Neu user van nhan duoc bang cach nao do:
             hien thi "San pham tam het hang."

  LUONG NGOAI LE:
    E1. Loi luu gio hang:
        Hien thi "Co loi xay ra, vui long thu lai."

  GHI CHU THIET KE:
    Yeu cau giang vien: "Can chuc nang o trang chu add sp vao cart luon,
    khong can bam detail." -> Nut [+] tren moi food card la bat buoc.
    Tren mobile: nut [+] toi thieu 44x44 pixel de de bam.

========================================================================

## UC-20: THAY DOI THUOC TINH SAN PHAM TRONG GIO HANG
========================================================================

  Use Case ID     : UC-20
  Ten             : Thay doi thuoc tinh san pham ngay trong gio hang
  Actor           : Guest, Member
  Muc tieu        : User thay doi qty, size, option ma khong can roi cart.
  Dieu kien tien  : Gio hang co it nhat 1 san pham.
  Dieu kien sau   : Thuoc tinh san pham trong cart duoc cap nhat.
                    Tong tien tu dong tinh lai.

  LUONG CO BAN:
    B1. User mo trang Gio hang (/cart).
    B2. He thong hien thi danh sach san pham trong cart:
        Moi dong gom: anh nho, ten, gia, qty, size/option (neu co).
    B3. User muon thay doi so luong:
        B3.1. User nhan nut [+] hoac [-] ben canh qty.
        B3.2. He thong cap nhat qty.
        B3.3. He thong tinh lai tong tien dong do va tong gio hang.
    B4. User muon thay doi size:
        B4.1. User nhan vao dropdown size ngay trong dong san pham.
        B4.2. He thong hien thi cac size co san.
        B4.3. User chon size moi.
        B4.4. He thong cap nhat gia theo size moi.
        B4.5. He thong tinh lai tong tien.
    B5. User muon xoa san pham:
        B5.1. User nhan nut [X] hoac vuot sang trai (mobile).
        B5.2. He thong xoa san pham khoi cart.
        B5.3. He thong tinh lai tong tien.

  LUONG THAY THE:
    B3a. Qty giam xuong 0:
      He thong tu dong xoa san pham khoi cart (khong can xac nhan).

    B3b. Qty vuot qua gioi han ton kho:
      He thong hien thi "Chi con [X] san pham."
      Qty tu dong dat ve muc ton kho toi da.

  GHI CHU THIET KE:
    Yeu cau giang vien: "Thay doi thuoc tinh trong cart luon."
    User KHONG DUOC phai quay lai trang detail de thay doi bat ky thu gi.
    Moi thay doi phai cap nhat tong tien NGAY LAP TUC (khong can bam Save).

========================================================================

## UC-08: LOG EXERCISE TRONG BUOI TAP
========================================================================

  Use Case ID     : UC-08
  Ten             : Log exercise trong workout session
  Actor           : Member
  Muc tieu        : Ghi lai bai tap da thuc hien voi chi tiet set/reps/weight.
  Dieu kien tien  : Member da tao workout session (UC-07).
  Dieu kien sau   : Exercise log luu trong database.
                    PR duoc kiem tra va cap nhat neu can.
                    Fitness Passport cap nhat total_volume.

  LUONG CO BAN:
    B1. Trong trang session dang hoat dong, user nhan [Them bai tap].
    B2. He thong hien thi danh sach exercise pho bien, nhom theo muscle_group:
        - Chest: Bench Press, Incline Press, Chest Fly, ...
        - Back: Deadlift, Lat Pulldown, Barbell Row, ...
        - Legs: Squat, Leg Press, Leg Curl, ...
        - Shoulders: Overhead Press, Lateral Raise, ...
        - Arms: Bicep Curl, Tricep Pushdown, ...
        - Core: Plank, Crunch, Cable Woodchop, ...
    B3. User chon exercise (vi du: Bench Press).
    B4. He thong hien thi form nhap sets voi 1 dong rong san:
        [Set 1]  Reps: [___]  Weight: [___] kg
    B5. User nhap Set 1: reps = 10, weight = 60.
    B6. User nhan [+ Them set].
    B7. He thong them 1 dong moi:
        [Set 2]  Reps: [___]  Weight: [___] kg
    B8. User nhap Set 2: reps = 8, weight = 65.
    B9. (Lap lai B6-B8 cho cac set tiep theo)
    B10. User nhan [Luu bai tap].
    B11. He thong validate: moi set phai co reps > 0 va weight >= 0.
    B12. He thong luu exercise log vao bang EXERCISE_LOGS:
         exercise_name, muscle_group, sets (JSON).
    B13. He thong tinh: max(weight * reps) cua buoi nay.
    B14. He thong so sanh voi PR hien tai (query tu cac session truoc).
    B15. Neu la PR moi:
         B15.1. Danh dau is_pr = true.
         B15.2. Hien thi thong bao "PR moi! Bench Press 65kg x 8".
         B15.3. Cong 30 XP (BR-18).
    B16. He thong cap nhat total_volume trong FITNESS_PASSPORT:
         total_volume += sum(weight * reps) cua cac set.

  LUONG THAY THE:
    B3a. Exercise khong co trong danh sach:
      B3a.1. User nhan [+ Tao bai tap moi].
      B3a.2. He thong hien thi form: Ten bai tap, Nhom co.
      B3a.3. User nhap va luu.
      B3a.4. Bai tap moi xuat hien trong danh sach.
      B3a.5. Tiep tuc tu B4.

    B8a. User muon xoa 1 set:
      B8a.1. User nhan nut [X] ben canh set can xoa.
      B8a.2. He thong xoa dong do, danh so lai cac set.

  LUONG NGOAI LE:
    E1. Reps hoac weight khong hop le (am, chu, rong):
        He thong highlight truong loi, hien thi "Nhap so hop le."

========================================================================

## UC-24: AI GOI Y FOOD DUA TREN BUOI TAP
========================================================================

  Use Case ID     : UC-24
  Ten             : Goi y bua an dua tren nhom co vua tap
  Actor           : Member
  Muc tieu        : Sau buoi tap, user nhan goi y 3 mon phu hop.
  Dieu kien tien  : Member vua ket thuc 1 workout session.
                    He thong co du lieu nhom co (muscle_group) tu session.
                    Database co food products de query.
  Dieu kien sau   : User thay duoc 3 mon goi y.
                    Neu chon "Dat ngay", mon duoc them vao cart.

  LUONG CO BAN:
    B1. Member nhan [Ket thuc buoi tap] trong trang session.
    B2. He thong luu session (status = completed, tinh XP +50).
    B3. He thong doc nhom co chinh tu session (vi du: chest).
    B4. He thong su dung SuggestionEngine:
        B4.1. Tra bang mapping (BR-28):
              chest -> protein = high, carb = medium, fat = low.
        B4.2. Chuyen thanh query:
              SELECT * FROM FOOD_PRODUCTS
              WHERE is_available = true
              ORDER BY protein_g DESC
              LIMIT 3
    B5. He thong tra ve 3 mon goi y.
    B6. He thong hien thi popup:
        "Vua tap nguc xong? Day la 3 mon goi y cho ban!"
        [Mon 1 - anh, ten, calo, protein] [Them]
        [Mon 2 - anh, ten, calo, protein] [Them]
        [Mon 3 - anh, ten, calo, protein] [Them]
        [Dat ca 3] [Bo qua]
    B7. User nhan [Them] tren 1 mon hoac [Dat ca 3].
    B8. He thong them cac mon da chon vao gio hang.
    B9. He thong chuyen den trang cart.

  LUONG THAY THE:
    B7a. User nhan [Bo qua]:
      Popup dong. User o lai trang session. Khong them gi vao cart.

    B5a. Khong du 3 mon phu hop:
      He thong bo sung bang mon co avg_rating cao nhat.
      Dam bao luon tra ve dung 3 mon (BR-30).

  LUONG NGOAI LE:
    E1. Khong co mon nao trong database:
        Popup hien thi: "Chua co mon an phu hop. Kham pha tat ca mon."
        Nut [Xem tat ca] chuyen den trang food listing.

  QUY TAC NGHIEP VU:
    BR-28 (mapping muscle_group -> macro priority).
    BR-29 (cach sort: high = DESC, low = ASC).
    BR-30 (luon tra ve dung 3 mon).

  GHI CHU:
    Day la logic rule-based don gian, KHONG phai AI/ML.
    Chi la: nhom co -> ratio -> sort food theo ratio -> lay top 3.
    Hoan toan kha thi trong pham vi do an.

========================================================================

## UC-33: DANG BAN HOAC CHO THUE GEAR
========================================================================

  Use Case ID     : UC-33
  Ten             : Dang ban hoac cho thue thiet bi gym
  Actor           : Gym Owner (ban/thue) hoac Member (chi thue)
  Muc tieu        : User dang thiet bi cua minh len Gear Hub.
  Dieu kien tien  : User da dang nhap.
  Dieu kien sau   : Gear co Gear ID duy nhat.
                    GEAR_LIFECYCLE co entry dau tien (action = listed).
                    Gear hien thi tren trang listing.

  LUONG CO BAN:
    B1. User nhan [Dang ban thiet bi] tren trang Gear Hub.
    B2. He thong hien thi form dang ban.
    B3. User nhap thong tin:
        - Ten thiet bi (bat buoc, toi da 200 ky tu)
        - Danh muc (bat buoc, chon 1):
          day_khang_luc, ta_tay, dai_lung, gang_tay, tham, may_mini, khac
        - Hinh thuc (bat buoc, chon 1): Ban / Cho thue / Ca hai
        - Gia ban (bat buoc neu chon Ban hoac Ca hai)
        - Gia thue/ngay (bat buoc neu chon Cho thue hoac Ca hai)
        - Gia thue/tuan (tuy chon)
        - Tien coc (bat buoc neu chon Cho thue, >= 50% gia tri)
        - Danh gia tinh trang (bat buoc, thang 1-5):
          1 = Rat cu, co hong
          2 = Cu, co vet tray nhieu
          3 = Kha, co vet tray nhe
          4 = Tot, con moi
          5 = Nhu moi
        - Ghi chu ve tinh trang (tuy chon, toi da 500 ky tu)
        - Upload anh (bat buoc, toi thieu 2, toi da 8, moi anh <= 5MB)
    B4. User nhan [Dang ban].
    B5. He thong validate toan bo du lieu (xem chi tiet o tren).
    B6. He thong gen Gear ID: GEAR-{4 ky tu random}-{4 so cuoi timestamp}.
        Vi du: GEAR-K7X2-3841
    B7. He thong gen QR Code tu Gear ID (chua link: /gear/GEAR-K7X2-3841).
    B8. He thong tao ban ghi trong GEAR_ITEMS.
    B9. He thong tao entry dau tien trong GEAR_LIFECYCLE:
        - gear_id = GEAR-K7X2-3841
        - owner_id = user hien tai
        - action = "listed"
        - condition_at_time = gia tri user nhap
        - notes = ghi chu user nhap
        - photos = danh sach URL anh
        - timestamp = thoi diem hien tai
    B10. He thong hien thi: "Dang thanh cong! Ma: GEAR-K7X2-3841"
         Hien thi hinh QR Code de user luu.
    B11. Gear xuat hien tren trang listing.

  LUONG NGOAI LE:
    E1. Anh vuot qua 5MB:
        He thong hien thi "Anh [ten file] qua lon. Toi da 5MB/anh."
    E2. Duoi 2 anh:
        He thong hien thi "Vui long upload it nhat 2 anh thuc te."
    E3. Tien coc < 50% gia tri:
        He thong hien thi "Tien coc phai >= 50% gia tri thiet bi."

  QUY TAC NGHIEP VU:
    BR-11 (toi thieu 2 anh), BR-12 (Gear ID khong doi),
    BR-13 (coc >= 50% gia tri).

========================================================================

## UC-23: DAT LAI DON CU (Quick Re-order)
========================================================================

  Use Case ID     : UC-23
  Ten             : Dat lai don hang cu
  Actor           : Member
  Muc tieu        : User dat lai cac mon da dat truoc do chi voi 1-2 nut bam.
  Dieu kien tien  : User co it nhat 1 don hang da hoan thanh truoc do.
  Dieu kien sau   : Cac mon tu don cu duoc them vao gio hang.

  LUONG CO BAN:
    B1. User truy cap trang Lich su don hang (/orders).
    B2. He thong hien thi danh sach don cu (moi nhat truoc).
    B3. Moi don hien thi: ngay, danh sach mon, tong tien, nut [Dat lai].
    B4. User nhan [Dat lai] tren 1 don cu.
    B5. He thong kiem tra tung mon trong don cu:
        - Mon con hang (is_available = true): them vao cart.
        - Mon het hang: bo qua, thong bao cho user.
    B6. He thong them cac mon con hang vao gio hang voi cung qty goc.
    B7. He thong hien thi thong bao:
        "Da them [X] mon vao gio hang." (neu co mon het hang: "+ [Y] mon
         tam het hang.")
    B8. He thong chuyen den trang cart.

  LUONG THAY THE:
    B4a. Tat ca mon trong don cu deu het hang:
      He thong hien thi "Tat ca mon trong don nay tam het hang."
      Khong them gi vao cart.

  GHI CHU THIET KE:
    Yeu cau giang vien: "Lich su mua hang de mua lai san pham."

========================================================================
KET THUC FILE 04
========================================================================
