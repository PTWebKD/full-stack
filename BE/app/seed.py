from passlib.context import CryptContext
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def seed_database(conn: AsyncConnection) -> None:
    result = await conn.execute(text("SELECT COUNT(*) FROM users"))
    if result.scalar() > 0:
        return

    pw = pwd_context.hash("123456")

    await conn.execute(text(f"""
        INSERT INTO users (user_id, email, phone, password_hash, role, display_name, avatar_url, fitness_goal, xp_total, current_level, current_streak, fitcoin_balance, tdee, created_at) VALUES
        (1, 'alex@fitfuel.com',   '0901234561', '{pw}', 'member',    'Alex Thunder', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&h=150&fit=crop&crop=face', 'bulk',    4820, 8, 14, 2500.00, 2800, '2024-01-15 08:00:00'),
        (2, 'sarah@fitfuel.com',  '0901234562', '{pw}', 'member',    'Sarah Kim',    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face', 'cut',     2310, 6, 7,  1200.00, 1900, '2024-03-22 09:00:00'),
        (3, 'vendor@fitfuel.com', '0901234563', '{pw}', 'gym_owner', 'Mike Forge',   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NULL,      0,    1, 0,  0.00,    NULL, '2024-02-01 10:00:00'),
        (4, 'seller@fitfuel.com', '0901234564', '{pw}', 'gym_owner', 'Tony Reps',    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face', 'maintain',1500, 5, 0,  8000.00, 2500, '2024-01-01 08:00:00'),
        (5, 'gym@fitfuel.com',    '0901234565', '{pw}', 'gym_owner', 'Coach Dana',   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'maintain',2000, 6, 5,  5000.00, 2600, '2024-01-05 08:00:00'),
        (6, 'admin@fitfuel.com',  '0901234566', '{pw}', 'gym_owner', 'Admin Rex',    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'bulk',    3000, 7, 2,  12000.00,2700, '2024-01-03 08:00:00')
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('users_user_id_seq', 6)"))

    await conn.execute(text("""
        INSERT INTO fitness_passport (user_id, total_sessions, total_volume, longest_streak, body_weight_log, is_public) VALUES
        (1, 127, 285000.00, 30, '[{"date":"2026-01-01","kg":82},{"date":"2026-02-01","kg":80},{"date":"2026-03-01","kg":79}]', true),
        (2, 64,  142000.00, 14, '[{"date":"2026-01-01","kg":65},{"date":"2026-02-01","kg":63},{"date":"2026-03-01","kg":62}]', true)
        ON CONFLICT DO NOTHING
    """))

    await conn.execute(text("""
        INSERT INTO gyms (gym_id, owner_id, name, address, phone, opening_hours, services, membership_plans) VALUES
        (1, 4, 'Iron Gear Co. Gym',    '123 Võ Văn Tần, Quận 3, TP.HCM', '02838123456',
          '{"mon_fri":"05:30-22:30","sat":"06:00-22:00","sun":"07:00-20:00"}',
          '["gym","powerlifting","gear_hub"]',
          '[{"name":"Gói Tháng","price":500000},{"name":"Gói Năm","price":5000000}]'),
        (2, 5, 'Apex Performance Gym', '456 Lê Lợi, Quận 1, TP.HCM',    '02839234567',
          '{"mon_fri":"05:00-23:00","sat":"06:00-22:00","sun":"07:00-21:00"}',
          '["gym","yoga","boxing"]',
          '[{"name":"Gói Tháng","price":600000},{"name":"Gói Năm","price":6000000}]'),
        (3, 6, 'Rex Power Gym',        '789 Nguyễn Huệ, Quận 1, TP.HCM', '02840345678',
          '{"mon_fri":"05:00-23:30","sat":"06:00-23:00","sun":"06:00-22:00"}',
          '["gym","crossfit","swimming","sauna"]',
          '[{"name":"Gói Tháng","price":550000},{"name":"Gói Năm","price":5500000}]')
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('gyms_gym_id_seq', 3)"))

    await conn.execute(text("""
        INSERT INTO gym_memberships (user_id, gym_id, plan_name, start_date, end_date, status, auto_renew, payment_method, amount_paid) VALUES
        (1, 1, 'Gói Tháng', '2026-05-01', '2026-05-31', 'active', false, 'vnpay', 500000),
        (2, 2, 'Gói Tháng', '2026-05-01', '2026-05-31', 'active', false, 'momo',  600000),
        (1, 2, 'Gói Năm',   '2026-01-01', '2026-12-31', 'active', true,  'vnpay', 6000000)
        ON CONFLICT DO NOTHING
    """))

    await conn.execute(text("""
        INSERT INTO food_products (product_id, vendor_id, name, description, price, calories, protein_g, carb_g, fat_g, ingredients, allergens, images, category, badge, is_available, avg_rating, total_reviews) VALUES
        (1,  3, 'Power Protein Bowl',       'Ức gà nướng, quinoa, khoai lang, bơ và rau xanh.',        89000,  520, 45.0, 38.0, 12.0, '["uc ga","quinoa","khoai lang"]',    '["gluten"]',         '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"]',  'High Protein', 'Best Seller',   true,  4.9, 234),
        (2,  3, 'Keto Warrior Plate',       'Thịt bò ăn cỏ, bắp cải nghiền, rau bina, bacon giòn.',   95000,  480, 38.0, 8.0,  34.0, '["thit bo","canh hoa","rau bina"]',  '[]',                 '["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"]', 'Keto',         'Keto Friendly', true,  4.7, 178),
        (3,  3, 'Vegan Gains Bowl',         'Tempeh, đậu đen, gạo lứt, xoài salsa.',                   79000,  440, 28.0, 55.0, 14.0, '["tempeh","dau den","gao lut"]',     '[]',                 '["https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop"]', 'Vegan',        'Vegan',         true,  4.6, 143),
        (4,  3, 'Bulk King Meal',           'Đôi ức gà, 2 chén cơm, khoai lang, bông cải.',            115000, 950, 72.0, 95.0, 28.0, '["uc ga","com trang","khoai lang"]', '[]',                 '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"]', 'Bulk',         'Bulk Special',  true,  4.8, 312),
        (5,  3, 'Shred Mode Salad',         'Cá ngừ, rau hỗn hợp, cà chua bi, trứng, giấm táo.',       72000,  280, 32.0, 18.0, 9.0,  '["ca ngu","rau mix","ca chua bi"]',  '[]',                 '["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop"]', 'Cut',          'Shred Pick',    true,  4.5, 97),
        (6,  3, 'Pre-Workout Fuel',         'Chuối yến mạch, mật ong, bơ đậu phộng, hạt chia.',        65000,  380, 18.0, 62.0, 6.0,  '["chuoi","yen mach","mat ong"]',     '["gluten"]',         '["https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop"]',  'Pre-Workout',  'Energy Boost',  true,  4.7, 204),
        (7,  3, 'Recovery Smoothie Bowl',   'Açaí, chuối, bột protein, granola, quả mọng.',             68000,  320, 24.0, 48.0, 7.0,  '["acai","chuoi","bot protein"]',     '[]',                 '["https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop"]', 'Recovery',     'Recovery+',     true,  4.8, 156),
        (8,  3, 'Salmon Power Pack',        'Cá hồi tự nhiên, măng tây nướng, gạo lứt.',               125000, 560, 48.0, 32.0, 24.0, '["ca hoi","mang tay","gao lut"]',    '[]',                 '["https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop"]', 'High Protein', 'Premium',       false, 4.9, 89),
        (9,  3, 'Thai Basil Chicken Bowl',  'Gà xào húng quế Thái, cơm hoa lài, trứng ốp la.',         85000,  490, 40.0, 44.0, 14.0, '["ga","hung que","com hoa lai"]',    '["gluten"]',         '["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop"]', 'High Protein', 'Asian Pick',    true,  4.6, 118),
        (10, 3, 'Mediterranean Power Wrap', 'Gà nướng, feta, dưa leo, cà chua, sốt tzatziki.',         92000,  420, 36.0, 34.0, 16.0, '["ga nuong","pho mai feta"]',        '["gluten","dairy"]', '["https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop"]', 'High Protein', 'Mediterranean', true,  4.7, 87)
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('food_products_product_id_seq', 10)"))

    await conn.execute(text("""
        INSERT INTO gear_items (gear_id, current_owner_id, lister_id, lister_role, category, name, description, condition_rating, images, listing_type, sell_price, rent_price_day, rent_price_week, deposit_amount, verified, is_available, avg_rating, total_reviews) VALUES
        ('GEAR-K7X2-3841', 4, 4, 'gym_owner', 'Weights',     'Titan Barbell Pro 20kg',          'Thanh đòn Olympic tiêu chuẩn thi đấu. Thép mạ chrome 20kg.',  5, '["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=400&fit=crop"]', 'both', 2800000,  56000, 280000,  1400000,  true,  true, 4.9, 456),
        ('GEAR-A2P4-1222', 4, 4, 'gym_owner', 'Apparel',     'Alpha Performance Tee',           'Áo thể thao co giãn 4 chiều, kháng khuẩn.',                   4, '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=400&fit=crop"]', 'sell', 380000,   NULL,  NULL,    NULL,     true,  true, 4.7, 312),
        ('GEAR-W9Q1-5033', 4, 4, 'gym_owner', 'Supplements', 'Whey Isolate 2kg',                'Whey isolate lọc vi siêu. 27g protein/serving.',               5, '["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=400&fit=crop"]', 'sell', 950000,   NULL,  NULL,    NULL,     true,  true, 4.8, 789),
        ('GEAR-D5M3-8814', 4, 4, 'gym_owner', 'Weights',     'Adjustable Dumbbell Set 5-52.5kg','Thay thế 15 bộ tạ. Bán theo cặp.',                            5, '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"]', 'both', 4500000,  90000, 450000,  2250000,  true,  true, 4.9, 234),
        ('GEAR-B8R6-2291', 4, 4, 'gym_owner', 'Accessories', 'Resistance Bands Pro Kit',        'Bộ 5 dây kháng lực 10-200 lbs. Cao su tự nhiên.',             4, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop"]', 'both', 280000,   5600,  28000,   140000,   true,  true, 4.6, 567),
        ('GEAR-C1T9-7742', 5, 5, 'gym_owner', 'Cardio',      'Air Assault Bike Pro',            'Xe đạp kháng lực không khí toàn thân.',                       5, '["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop"]', 'both', 12500000, 250000,1250000, 6250000,  true,  true, 4.8, 123),
        ('GEAR-G3N7-4455', 5, 5, 'gym_owner', 'Recovery',    'Massage Gun Pro X3',              'Thiết bị massage percussive 30 tốc độ.',                       4, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop"]', 'both', 1200000,  24000, 120000,  600000,   false, true, 4.7, 398),
        ('GEAR-L2K8-9963', 4, 4, 'gym_owner', 'Accessories', 'Lifting Belt 10mm',               'Đai tập powerlifting chuẩn IPF. Da thật 10mm.',                5, '["https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&h=400&fit=crop"]', 'both', 650000,   13000, 65000,   325000,   true,  true, 4.8, 211),
        ('GEAR-P5T1-0088', 6, 6, 'gym_owner', 'Cardio',      'Treadmill Pro X9 Commercial',     'Máy chạy bộ thương mại 3.5HP, tốc độ 0.5-22 km/h.',          5, '["https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=400&fit=crop"]', 'both', 25000000, 300000,1500000, 12500000, true,  true, 4.9, 67),
        ('GEAR-M1X5-3377', 1, 1, 'member',    'Accessories', 'Dây kháng lực cá nhân',           'Bộ dây kháng lực dùng 3 tháng còn mới.',                      4, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=400&fit=crop"]', 'rent', NULL,     15000, 75000,   90000,    false, true, 0.0, 0)
        ON CONFLICT DO NOTHING
    """))

    await conn.execute(text("""
        INSERT INTO challenges (challenge_id, title, description, type, criteria, reward_xp, reward_fitcoin, start_date, end_date, is_active) VALUES
        (1, 'Tuần Chiến Binh', 'Hoàn thành 5 buổi tập trong tuần này.',    'weekly',  '{"sessions_required":5}',                 100, 50.00,  '2026-05-06', '2026-05-12', false),
        (2, 'Tháng Bền Bỉ',   'Đạt streak 20 ngày liên tiếp.',            'monthly', '{"streak_required":20}',                  200, 150.00, '2026-05-01', '2026-05-31', true),
        (3, 'Protein Warrior', 'Đặt 10 đơn High Protein trong tháng.',      'monthly', '{"protein_orders":10}',                   150, 100.00, '2026-05-01', '2026-05-31', true),
        (4, 'Tuần Hàng Đầu',  'Hoàn thành 5 buổi tập và 3 đơn food.',     'weekly',  '{"sessions_required":5,"food_orders":3}', 150, 75.00,  '2026-05-13', '2026-05-19', true)
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('challenges_challenge_id_seq', 4)"))

    await conn.execute(text("""
        INSERT INTO badges (badge_id, name, description, icon_url, criteria, category) VALUES
        (1,  'Iron Newbie',      'Hoàn thành buổi tập đầu tiên.',  NULL, '{"total_sessions":1}',   'gym'),
        (2,  'Century Club',     'Hoàn thành 100 buổi tập.',        NULL, '{"total_sessions":100}', 'gym'),
        (3,  'PR Breaker',       'Phá 5 kỷ lục cá nhân.',           NULL, '{"total_prs":5}',        'gym'),
        (4,  'Streak 7',         'Duy trì streak 7 ngày.',           NULL, '{"streak":7}',           'streak'),
        (5,  'Streak 30',        'Duy trì streak 30 ngày.',          NULL, '{"streak":30}',          'streak'),
        (6,  'Streak 100',       'Duy trì streak 100 ngày.',         NULL, '{"streak":100}',         'streak'),
        (7,  'Foodie Fighter',   'Đặt 20 đơn healthy food.',         NULL, '{"food_orders":20}',     'food'),
        (8,  'Gear Collector',   'Hoàn thành 3 giao dịch gear.',     NULL, '{"gear_rentals":3}',     'gear'),
        (9,  'Social Butterfly', 'Được 50 người follow.',            NULL, '{"followers":50}',       'social'),
        (10, 'Legend',           'Đạt Level 10.',                    NULL, '{"level":10}',           'gym')
        ON CONFLICT DO NOTHING
    """))
    await conn.execute(text("SELECT setval('badges_badge_id_seq', 10)"))
