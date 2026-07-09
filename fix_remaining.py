import os

# Fix 11_Sitemap.md
sitemap_path = r"d:\doanWEDKD\11_Sitemap.md"
with open(sitemap_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will just write a function to replace the chunk since the previous replace failed.
content = content.replace(
"Gym Owner Dashboard   | 4        | Gym Owner\nGym Owner Panel           | 5        | Gym Owner",
"Gym Owner Dashboard & Panel | 4  | Gym Owner")

with open(sitemap_path, "w", encoding="utf-8") as f:
    f.write(content)


# Fix 09_DFD.md
dfd_path = r"d:\doanWEDKD\09_DFD.md"
with open(dfd_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
"    [Gear Seller]                                [Gym Owner]\n                       [Gym Owner]",
"    [Gear Seller]                                [Gym Owner]")

content = content.replace(
"    (4) Gym Owner: chu phong tap.\n    (5) Gym Owner: quan tri vien.",
"    (4) Gym Owner: chu phong tap va quan tri vien.")

content = content.replace(
"  [Gym Owner]                                [Gym Owner]",
"                                             [Gym Owner]")

with open(dfd_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed DFD and Sitemap.")
