import json as _j
from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_database(conn: AsyncConnection) -> None:
    result = await conn.execute(text("SELECT COUNT(*) FROM users"))
    if result.scalar() > 0:
        return

    pw = pwd_context.hash("123456")

    # -- Users --
    await conn.execute(text(f"""
        INSERT INTO users (user_id, email, phone, password_hash, role, display_name, avatar_url, fitness_goal, xp_total, current_level, current_streak, fitcoin_balance, tdee, allergens, created_at) VALUES
        (1, 'alex@fitfuel.com',   '0901234561', '{pw}', 'member',    'Alex Thunder', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face', 'bulk',    4820, 8, 14, 2500.00, 2800, '[]', '2024-01-15 08:00:00'),
        (2, 'sarah@fitfuel.com',  '0901234562', '{pw}', 'member',    'Sarah Kim',    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face', 'cut',     2310, 6, 7,  1200.00, 1900, '[]', '2024-03-22 09:00:00'),
        (3, 'vendor@fitfuel.com', '0901234563', '{pw}', 'gym_owner', 'Mike Forge',   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NULL,      0,    1, 0,  0.00,    NULL, '[]', '2024-02-01 10:00:00'),
        (4, 'seller@fitfuel.com', '0901234564', '{pw}', 'gym_owner', 'Tony Reps',    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face', 'maintain',1500, 5, 0,  8000.00, 2500, '[]', '2024-01-01 08:00:00'),
        (5, 'gym@fitfuel.com',    '0901234565', '{pw}', 'gym_owner', 'Coach Dana',   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'maintain',2000, 6, 5,  5000.00, 2600, '[]', '2024-01-05 08:00:00'),
        (6, 'admin@fitfuel.com',  '0901234566', '{pw}', 'gym_owner', 'Admin Rex',    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'bulk',    3000, 7, 2,  12000.00,2700, '[]', '2024-01-03 08:00:00')
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('users_user_id_seq', 6)"))

    # -- Fitness Passport --
    await conn.execute(text("""
        INSERT INTO fitness_passport (user_id, total_sessions, total_volume, longest_streak, body_weight_log, is_public, created_at) VALUES
        (1, 127, 285000.00, 30, '[]', true, NOW()),
        (2, 64,  142000.00, 14, '[]', true, NOW())
        ON CONFLICT DO NOTHING
    """))

    # -- Gyms (parameterized to avoid ":number" in JSON time strings and price values) --
    gym_sql = text("""
        INSERT INTO gyms (gym_id, owner_id, name, address, phone, opening_hours, services, membership_plans, created_at)
        VALUES (:gid, :oid, :name, :address, :phone, :oh, :svc, :plans, NOW())
        ON CONFLICT DO NOTHING
    """)
    gyms = [
        {
            "gid": 1, "oid": 4, "name": "Iron Gear Co. Gym",
            "address": "123 Võ Văn Tần, Quận 3, TP.HCM", "phone": "02838123456",
            "oh":    _j.dumps({"mon_fri": "05:30-22:30", "sat": "06:00-22:00", "sun": "07:00-20:00"}),
            "svc":   _j.dumps(["gym", "powerlifting", "gear_hub"]),
            "plans": _j.dumps([{"name": "Gói Tháng", "price": 500000}, {"name": "Gói Năm", "price": 5000000}]),
        },
        {
            "gid": 2, "oid": 5, "name": "Apex Performance Gym",
            "address": "456 Lê Lợi, Quận 1, TP.HCM", "phone": "02839234567",
            "oh":    _j.dumps({"mon_fri": "05:00-23:00", "sat": "06:00-22:00", "sun": "07:00-21:00"}),
            "svc":   _j.dumps(["gym", "yoga", "boxing"]),
            "plans": _j.dumps([{"name": "Gói Tháng", "price": 600000}, {"name": "Gói Năm", "price": 6000000}]),
        },
        {
            "gid": 3, "oid": 6, "name": "Rex Power Gym",
            "address": "789 Nguyễn Huệ, Quận 1, TP.HCM", "phone": "02840345678",
            "oh":    _j.dumps({"mon_fri": "05:00-23:30", "sat": "06:00-23:00", "sun": "06:00-22:00"}),
            "svc":   _j.dumps(["gym", "crossfit", "swimming", "sauna"]),
            "plans": _j.dumps([{"name": "Gói Tháng", "price": 550000}, {"name": "Gói Năm", "price": 5500000}]),
        },
    ]
    for row in gyms:
        await conn.execute(gym_sql, row)
    await conn.execute(text("SELECT setval('gyms_gym_id_seq', 3)"))

    # -- Gym Memberships --
    await conn.execute(text("""
        INSERT INTO gym_memberships (user_id, gym_id, plan_name, start_date, end_date, status, auto_renew, payment_method, amount_paid, created_at) VALUES
        (1, 1, 'Gói Tháng', '2026-05-01', '2026-05-31', 'active', false, 'vnpay', 500000,  NOW()),
        (2, 2, 'Gói Tháng', '2026-05-01', '2026-05-31', 'active', false, 'momo',  600000,  NOW()),
        (1, 2, 'Gói Năm',   '2026-01-01', '2026-12-31', 'active', true,  'vnpay', 6000000, NOW())
        ON CONFLICT DO NOTHING
    """))

    # -- Food Products --
    await conn.execute(text("""
        INSERT INTO food_products (product_id, vendor_id, name, description, price, calories, protein_g, carb_g, fat_g, ingredients, allergens, images, category, badge, is_available, avg_rating, total_reviews, total_orders, created_at) VALUES
        (1,  3, 'Power Protein Bowl',       'Uc ga nuong, quinoa, khoai lang, bo va rau xanh.',    89000,  520, 45.0, 38.0, 12.0, '["uc ga","quinoa","khoai lang"]',    '["gluten"]',         '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"]',  'High Protein', 'Best Seller',   true,  4.9, 234, 0, NOW()),
        (2,  3, 'Keto Warrior Plate',       'Thit bo an co, bap cai nghien, rau bina, bacon gion.',95000,  480, 38.0, 8.0,  34.0, '["thit bo","canh hoa","rau bina"]',  '[]',                 '["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"]', 'Keto',         'Keto Friendly', true,  4.7, 178, 0, NOW()),
        (3,  3, 'Vegan Gains Bowl',         'Tempeh, dau den, gao lut, xoai salsa.',               79000,  440, 28.0, 55.0, 14.0, '["tempeh","dau den","gao lut"]',     '[]',                 '["https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop"]', 'Vegan',        'Vegan',         true,  4.6, 143, 0, NOW()),
        (4,  3, 'Bulk King Meal',           'Doi uc ga, 2 chen com, khoai lang, bong cai.',        115000, 950, 72.0, 95.0, 28.0, '["uc ga","com trang","khoai lang"]', '[]',                 '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"]', 'Bulk',         'Bulk Special',  true,  4.8, 312, 0, NOW()),
        (5,  3, 'Shred Mode Salad',         'Ca ngu, rau hon hop, ca chua bi, trung, giam tao.',   72000,  280, 32.0, 18.0, 9.0,  '["ca ngu","rau mix","ca chua bi"]',  '[]',                 '["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"]', 'Cut',          'Shred Pick',    true,  4.5, 97,  0, NOW()),
        (6,  3, 'Pre-Workout Fuel',         'Chuoi yen mach, mat ong, bo dau phong, hat chia.',    65000,  380, 18.0, 62.0, 6.0,  '["chuoi","yen mach","mat ong"]',     '["gluten"]',         '["https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop"]',  'Pre-Workout',  'Energy Boost',  true,  4.7, 204, 0, NOW()),
        (7,  3, 'Recovery Smoothie Bowl',   'Acai, chuoi, bot protein, granola, qua mong.',        68000,  320, 24.0, 48.0, 7.0,  '["acai","chuoi","bot protein"]',     '[]',                 '["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop"]', 'Recovery',     'Recovery+',     true,  4.8, 156, 0, NOW()),
        (8,  3, 'Salmon Power Pack',        'Ca hoi tu nhien, mang tay nuong, gao lut.',           125000, 560, 48.0, 32.0, 24.0, '["ca hoi","mang tay","gao lut"]',    '[]',                 '["https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop"]', 'High Protein', 'Premium',       false, 4.9, 89,  0, NOW()),
        (9,  3, 'Thai Basil Chicken Bowl',  'Ga xao hung que Thai, com hoa lai, trung op la.',     85000,  490, 40.0, 44.0, 14.0, '["ga","hung que","com hoa lai"]',    '["gluten"]',         '["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop"]', 'High Protein', 'Asian Pick',    true,  4.6, 118, 0, NOW()),
        (10, 3, 'Mediterranean Power Wrap', 'Ga nuong, feta, dua leo, ca chua, sot tzatziki.',     92000,  420, 36.0, 34.0, 16.0, '["ga nuong","pho mai feta"]',        '["gluten","dairy"]', '["https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop"]', 'High Protein', 'Mediterranean', true,  4.7, 87,  0, NOW())
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('food_products_product_id_seq', 10)"))

    # -- Gear Items --
    await conn.execute(text("""
        INSERT INTO gear_items (gear_id, current_owner_id, lister_id, lister_role, category, name, description, condition_rating, images, listing_type, sell_price, rent_price_day, rent_price_week, deposit_amount, verified, is_available, avg_rating, total_reviews, created_at) VALUES
        ('GEAR-K7X2-3841', 4, 4, 'gym_owner', 'Weights',     'Titan Barbell Pro 20kg',          'Thanh don Olympic tieu chuan thi dau. Thep ma chrome 20kg.',  5, '["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop"]', 'both', 2800000,  56000, 280000,  1400000,  true,  true, 4.9, 456, NOW()),
        ('GEAR-A2P4-1222', 4, 4, 'gym_owner', 'Apparel',     'Alpha Performance Tee',           'Ao the thao co gian 4 chieu, khang khuan.',                   4, '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=400&fit=crop"]', 'sell', 380000,   NULL,  NULL,    NULL,     true,  true, 4.7, 312, NOW()),
        ('GEAR-W9Q1-5033', 4, 4, 'gym_owner', 'Supplements', 'Whey Isolate 2kg',                'Whey isolate loc vi sieu. 27g protein moi serving.',          5, '["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=400&fit=crop"]', 'sell', 950000,   NULL,  NULL,    NULL,     true,  true, 4.8, 789, NOW()),
        ('GEAR-D5M3-8814', 4, 4, 'gym_owner', 'Weights',     'Adjustable Dumbbell Set 5-52kg',  'Thay the 15 bo ta. Ban theo cap.',                            5, '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"]', 'both', 4500000,  90000, 450000,  2250000,  true,  true, 4.9, 234, NOW()),
        ('GEAR-B8R6-2291', 4, 4, 'gym_owner', 'Accessories', 'Resistance Bands Pro Kit',        'Bo 5 day khang luc. Cao su tu nhien.',                        4, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop"]', 'both', 280000,   5600,  28000,   140000,   true,  true, 4.6, 567, NOW()),
        ('GEAR-C1T9-7742', 5, 5, 'gym_owner', 'Cardio',      'Air Assault Bike Pro',            'Xe dap khang luc khong khi toan than.',                       5, '["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop"]', 'both', 12500000, 250000,1250000, 6250000,  true,  true, 4.8, 123, NOW()),
        ('GEAR-G3N7-4455', 5, 5, 'gym_owner', 'Recovery',    'Massage Gun Pro X3',              'Thiet bi massage percussive 30 toc do.',                      4, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop"]', 'both', 1200000,  24000, 120000,  600000,   false, true, 4.7, 398, NOW()),
        ('GEAR-L2K8-9963', 4, 4, 'gym_owner', 'Accessories', 'Lifting Belt 10mm',               'Dai tap powerlifting chuan IPF. Da that 10mm.',               5, '["https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop"]', 'both', 650000,   13000, 65000,   325000,   true,  true, 4.8, 211, NOW()),
        ('GEAR-P5T1-0088', 6, 6, 'gym_owner', 'Cardio',      'Treadmill Pro X9 Commercial',     'May chay bo thuong mai 3.5HP, toc do 0.5-22 km/h.',          5, '["https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop"]', 'both', 25000000, 300000,1500000, 12500000, true,  true, 4.9, 67,  NOW()),
        ('GEAR-M1X5-3377', 1, 1, 'member',    'Accessories', 'Day khang luc ca nhan',           'Bo day khang luc dung 3 thang con moi.',                      4, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop"]', 'rent', NULL,     15000, 75000,   90000,    false, true, 0.0, 0,   NOW())
        ON CONFLICT DO NOTHING
    """))

    # -- Challenges (parameterized to avoid ":number" in criteria JSON) --
    ch_sql = text("""
        INSERT INTO challenges (challenge_id, title, description, type, criteria, reward_xp, reward_fitcoin, start_date, end_date, is_active)
        VALUES (:id, :title, :desc, :type, :criteria, :xp, :fc, :start, :end, :active)
        ON CONFLICT DO NOTHING
    """)
    challenges = [
        {"id": 1, "title": "Tuần Chiến Binh", "desc": "Hoàn thành 5 buổi tập trong tuần này.",
         "type": "weekly",  "criteria": _j.dumps({"sessions_required": 5}),
         "xp": 100, "fc": 50.00,  "start": "2026-05-06", "end": "2026-05-12", "active": False},
        {"id": 2, "title": "Tháng Bền Bỉ",   "desc": "Đạt streak 20 ngày liên tiếp.",
         "type": "monthly", "criteria": _j.dumps({"streak_required": 20}),
         "xp": 200, "fc": 150.00, "start": "2026-05-01", "end": "2026-05-31", "active": True},
        {"id": 3, "title": "Protein Warrior", "desc": "Đặt 10 đơn High Protein trong tháng.",
         "type": "monthly", "criteria": _j.dumps({"protein_orders": 10}),
         "xp": 150, "fc": 100.00, "start": "2026-05-01", "end": "2026-05-31", "active": True},
        {"id": 4, "title": "Tuần Hàng Đầu",  "desc": "Hoàn thành 5 buổi tập và 3 đơn food.",
         "type": "weekly",  "criteria": _j.dumps({"sessions_required": 5, "food_orders": 3}),
         "xp": 150, "fc": 75.00,  "start": "2026-05-13", "end": "2026-05-19", "active": True},
    ]
    for row in challenges:
        await conn.execute(ch_sql, row)
    await conn.execute(text("SELECT setval('challenges_challenge_id_seq', 4)"))

    # -- Badges (parameterized to avoid ":number" in criteria JSON) --
    badge_sql = text("""
        INSERT INTO badges (badge_id, name, description, icon_url, criteria, category)
        VALUES (:id, :name, :desc, NULL, :criteria, :cat)
        ON CONFLICT DO NOTHING
    """)
    badges = [
        {"id": 1,  "name": "Iron Newbie",      "desc": "Hoàn thành buổi tập đầu tiên.",  "criteria": _j.dumps({"total_sessions": 1}),   "cat": "gym"},
        {"id": 2,  "name": "Century Club",     "desc": "Hoàn thành 100 buổi tập.",        "criteria": _j.dumps({"total_sessions": 100}), "cat": "gym"},
        {"id": 3,  "name": "PR Breaker",       "desc": "Phá 5 kỷ lục cá nhân.",           "criteria": _j.dumps({"total_prs": 5}),        "cat": "gym"},
        {"id": 4,  "name": "Streak 7",         "desc": "Duy trì streak 7 ngày.",           "criteria": _j.dumps({"streak": 7}),           "cat": "streak"},
        {"id": 5,  "name": "Streak 30",        "desc": "Duy trì streak 30 ngày.",          "criteria": _j.dumps({"streak": 30}),          "cat": "streak"},
        {"id": 6,  "name": "Streak 100",       "desc": "Duy trì streak 100 ngày.",         "criteria": _j.dumps({"streak": 100}),         "cat": "streak"},
        {"id": 7,  "name": "Foodie Fighter",   "desc": "Đặt 20 đơn healthy food.",         "criteria": _j.dumps({"food_orders": 20}),     "cat": "food"},
        {"id": 8,  "name": "Gear Collector",   "desc": "Hoàn thành 3 giao dịch gear.",     "criteria": _j.dumps({"gear_rentals": 3}),     "cat": "gear"},
        {"id": 9,  "name": "Social Butterfly", "desc": "Được 50 người follow.",            "criteria": _j.dumps({"followers": 50}),       "cat": "social"},
        {"id": 10, "name": "Legend",           "desc": "Đạt Level 10.",                    "criteria": _j.dumps({"level": 10}),           "cat": "gym"},
    ]
    for row in badges:
        await conn.execute(badge_sql, row)
    await conn.execute(text("SELECT setval('badges_badge_id_seq', 10)"))
