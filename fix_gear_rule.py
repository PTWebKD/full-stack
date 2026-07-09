import os

# 1. 03_Actor_UseCase.md
path1 = r"d:\doanWEDKD\03_Actor_UseCase.md"
with open(path1, "r", encoding="utf-8") as f:
    c1 = f.read()

c1 = c1.replace(
"""Actor 4: GEAR SELLER
  Loai        : Chinh
  Mo ta       : Nguoi ban hoac cho thue thiet bi gym.
  Dac diem    : La Member co them vai tro seller khi dang gear.
  Tuong tac   : Dang ban/thue gear, quan ly listing, nhan FitCoin.
  Ghi chu     : Khong phai actor rieng biet, ma la Member thuc hien
                chuc nang dang ban. Tuy nhien tach ra de lam ro
                cac use case lien quan.""",
"""Actor 4: GEAR SELLER / RENTER
  Loai        : Chinh
  Mo ta       : Nguoi dang ban hoac cho thue thiet bi gym tren he thong.
  Dac diem    : La Gym Owner (duoc Ban/Cho thue) hoac Member (chi duoc Cho thue).
  Tuong tac   : Dang ban/thue gear, quan ly listing, nhan FitCoin.
  Ghi chu     : Khong phai actor rieng biet, ma la vai tro phu khi Gym Owner hoac
                Member thuc hien chuc nang dang gear tren Gear Hub.""")

with open(path1, "w", encoding="utf-8") as f:
    f.write(c1)


# 2. FitFuel_System_Analysis.md
path2 = r"d:\doanWEDKD\FitFuel_System_Analysis.md"
with open(path2, "r", encoding="utf-8") as f:
    c2 = f.read()

c2 = c2.replace(
"4   | Gear Seller| Nguoi ban/cho thue thiet bi gym          | Chinh",
"4   | Gear Seller| Gym Owner (ban/thue) hoac Member (thue)  | Chinh")

c2 = c2.replace(
"""GEAR SELLER:
- Dang ban/cho thue gear cua minh
- Quan ly listing (gia, tinh trang)
- Xac nhan don mua/thue
- Quan ly don thue (theo doi ngay tra)""",
"""GEAR SELLER / RENTER:
- Gym Owner: Dang ban / cho thue gear cua minh
- Member: Chi duoc dang cho thue gear cua minh
- Quan ly listing (gia, tinh trang)
- Xac nhan don mua/thue
- Quan ly don thue (theo doi ngay tra)""")

c2 = c2.replace(
"Actor chinh         | Member (voi vai tro Gear Seller)",
"Actor chinh         | Gym Owner (ban/thue) hoac Member (chi thue)")

with open(path2, "w", encoding="utf-8") as f:
    f.write(c2)


# 3. 04_UseCase_Specifications.md
path3 = r"d:\doanWEDKD\04_UseCase_Specifications.md"
with open(path3, "r", encoding="utf-8") as f:
    c3 = f.read()

c3 = c3.replace(
"Actor           : Member (vai tro Gear Seller)",
"Actor           : Gym Owner (ban/thue) hoac Member (chi thue)")

c3 = c3.replace(
"Dieu kien tien quyet: Member da dang nhap va co thiet bi muon ban/cho thue.",
"Dieu kien tien quyet: User da dang nhap va co thiet bi muon ban (Gym Owner) hoac cho thue (Member).")

with open(path3, "w", encoding="utf-8") as f:
    f.write(c3)


# 4. FitFuel_Plus_Project.md
path4 = r"d:\doanWEDKD\FitFuel_Plus_Project.md"
with open(path4, "r", encoding="utf-8") as f:
    c4 = f.read()

c4 = c4.replace(
"| Gear Seller | Người bán/cho thuê gear | Đăng gear, quản lý đơn thuê/bán, nhận FitCoin |",
"| Gear Seller | Người bán/cho thuê gear | Gym Owner (bán/thuê), Member (chỉ thuê). Đăng gear, quản lý đơn, nhận FitCoin |")

with open(path4, "w", encoding="utf-8") as f:
    f.write(c4)

print("Updated gear listing logic across all files.")
