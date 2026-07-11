-- ============================================================
-- FitFuel+ Database Schema (generated to match generate_erd.py)
-- Database: PostgreSQL 15+
-- Tables/columns/relations mirror the `tables` and `relations`
-- dicts in generate_erd.py exactly (same names, same FK edges).
-- ============================================================

-- ------------------------------------------------------------
-- Group 1: Identity, Social, Gamification
-- ------------------------------------------------------------

CREATE TABLE USERS (
  user_id             SERIAL PRIMARY KEY,
  email               VARCHAR(255) NOT NULL UNIQUE,
  phone               VARCHAR(15) UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,
  role                VARCHAR(30) NOT NULL,
  display_name        VARCHAR(100) NOT NULL,
  avatar_url          VARCHAR(500),
  xp_total            INT NOT NULL DEFAULT 0,
  current_level       INT NOT NULL DEFAULT 1,
  current_streak      INT NOT NULL DEFAULT 0,
  longest_streak      INT NOT NULL DEFAULT 0,
  fitcoin_balance     DECIMAL(12,2) NOT NULL DEFAULT 0,
  referred_by         INT REFERENCES USERS(user_id),
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  terms_accepted_at   TIMESTAMP,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE AUTH_OTP (
  otp_id              SERIAL PRIMARY KEY,
  phone               VARCHAR(15) NOT NULL,
  otp_code            VARCHAR(10) NOT NULL,
  expired_at          TIMESTAMP NOT NULL,
  attempts_left       INT NOT NULL DEFAULT 5,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE FITNESS_PASSPORTS (
  passport_id         SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  total_sessions      INT NOT NULL DEFAULT 0,
  total_volume        DECIMAL(12,2) NOT NULL DEFAULT 0,
  longest_streak      INT NOT NULL DEFAULT 0,
  is_public           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE BODY_METRICS (
  metric_id           SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  recorded_at         TIMESTAMP NOT NULL DEFAULT NOW(),
  weight_kg           DECIMAL(5,2),
  height_cm           DECIMAL(5,2),
  body_fat_pct        DECIMAL(4,2),
  muscle_mass_kg      DECIMAL(5,2),
  waist_cm            DECIMAL(5,2),
  chest_cm            DECIMAL(5,2),
  arm_cm              DECIMAL(5,2),
  thigh_cm            DECIMAL(5,2)
);

CREATE TABLE BODY_PHOTOS (
  photo_id            SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  photo_url           VARCHAR(500) NOT NULL,
  recorded_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE FOLLOWS (
  follower_id         INT NOT NULL REFERENCES USERS(user_id),
  following_id        INT NOT NULL REFERENCES USERS(user_id),
  created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE BADGES (
  badge_id            SERIAL PRIMARY KEY,
  name                VARCHAR(100) NOT NULL,
  description         VARCHAR(500),
  icon_url            VARCHAR(500),
  badge_type          VARCHAR(50)
);

CREATE TABLE MILESTONE_ACHIEVEMENTS (
  achievement_id      SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  milestone_code      VARCHAR(50) NOT NULL,
  badge_id            INT REFERENCES BADGES(badge_id),
  fitcoin_rewarded    DECIMAL(12,2) NOT NULL DEFAULT 0,
  xp_rewarded         INT NOT NULL DEFAULT 0,
  achieved_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE FITCOIN_TRANSACTIONS (
  transaction_id      SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  amount              DECIMAL(12,2) NOT NULL,
  tx_type             VARCHAR(30) NOT NULL,
  source              VARCHAR(50) NOT NULL,
  reference_id        INT,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE REFERRALS (
  referral_id         SERIAL PRIMARY KEY,
  referrer_id         INT NOT NULL REFERENCES USERS(user_id),
  friend_phone        VARCHAR(15) NOT NULL,
  friend_user_id      INT REFERENCES USERS(user_id),
  status              VARCHAR(30) NOT NULL DEFAULT 'pending',
  expired_at          TIMESTAMP,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Group 2: Gym, Membership, Check-in
-- ------------------------------------------------------------

CREATE TABLE GYMS (
  gym_id              SERIAL PRIMARY KEY,
  name                VARCHAR(150) NOT NULL,
  address             VARCHAR(255),
  phone               VARCHAR(15),
  email               VARCHAR(255),
  opening_hours       VARCHAR(100),
  logo_url            VARCHAR(500)
);

CREATE TABLE MEMBERSHIP_PLANS (
  plan_id             SERIAL PRIMARY KEY,
  name                VARCHAR(100) NOT NULL,
  duration_days       INT NOT NULL,
  price               DECIMAL(12,2) NOT NULL,
  description         VARCHAR(500),
  is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE GYM_MEMBERSHIPS (
  membership_id           SERIAL PRIMARY KEY,
  user_id                 INT NOT NULL REFERENCES USERS(user_id),
  plan_id                 INT NOT NULL REFERENCES MEMBERSHIP_PLANS(plan_id),
  gym_id                  INT NOT NULL REFERENCES GYMS(gym_id),
  status                  VARCHAR(30) NOT NULL DEFAULT 'active',
  start_date              DATE NOT NULL,
  end_date                DATE NOT NULL,
  freeze_days_used        INT NOT NULL DEFAULT 0,
  cancel_scheduled_at     TIMESTAMP,
  referral_bonus_applied  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE FREE_TRIAL_PASSES (
  pass_id             SERIAL PRIMARY KEY,
  phone               VARCHAR(15) NOT NULL,
  user_id             INT REFERENCES USERS(user_id),
  status              VARCHAR(30) NOT NULL DEFAULT 'active',
  activated_at        TIMESTAMP,
  expired_at          TIMESTAMP
);

CREATE TABLE GYM_TOURS (
  tour_id             SERIAL PRIMARY KEY,
  phone               VARCHAR(15) NOT NULL,
  user_id             INT REFERENCES USERS(user_id),
  scheduled_at        TIMESTAMP NOT NULL,
  status              VARCHAR(30) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE MEMBERSHIP_FREEZES (
  freeze_id           SERIAL PRIMARY KEY,
  membership_id       INT NOT NULL REFERENCES GYM_MEMBERSHIPS(membership_id),
  freeze_type         VARCHAR(30) NOT NULL,
  start_date          DATE NOT NULL,
  end_date            DATE NOT NULL,
  proof_document_url  VARCHAR(500),
  approved_by         INT REFERENCES USERS(user_id),
  status              VARCHAR(30) NOT NULL DEFAULT 'pending'
);

-- ------------------------------------------------------------
-- Group 3: Workout Programs, Sessions, PRs
-- ------------------------------------------------------------

CREATE TABLE EXERCISES (
  exercise_id         SERIAL PRIMARY KEY,
  name                VARCHAR(150) NOT NULL,
  muscle_group        VARCHAR(50) NOT NULL,
  category            VARCHAR(50),
  equipment_required  VARCHAR(100),
  video_url           VARCHAR(500)
);

CREATE TABLE WORKOUT_PROGRAMS (
  program_id          SERIAL PRIMARY KEY,
  name                VARCHAR(150) NOT NULL,
  goal_type           VARCHAR(30) NOT NULL,
  fitness_level       VARCHAR(30) NOT NULL,
  days_per_week       INT NOT NULL,
  description         VARCHAR(500),
  is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE PROGRAM_DAYS (
  day_id              SERIAL PRIMARY KEY,
  program_id          INT NOT NULL REFERENCES WORKOUT_PROGRAMS(program_id),
  day_number          INT NOT NULL,
  focus_muscle_group  VARCHAR(50)
);

CREATE TABLE PROGRAM_EXERCISES (
  program_exercise_id SERIAL PRIMARY KEY,
  day_id              INT NOT NULL REFERENCES PROGRAM_DAYS(day_id),
  exercise_id         INT NOT NULL REFERENCES EXERCISES(exercise_id),
  target_sets         INT NOT NULL,
  target_reps_min     INT NOT NULL,
  target_reps_max     INT NOT NULL
);

CREATE TABLE MEMBER_PROGRAMS (
  member_program_id   SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  program_id          INT NOT NULL REFERENCES WORKOUT_PROGRAMS(program_id),
  status              VARCHAR(30) NOT NULL DEFAULT 'active',
  completion_pct      DECIMAL(5,2) NOT NULL DEFAULT 0,
  start_date          DATE NOT NULL,
  end_date            DATE
);

CREATE TABLE WORKOUT_SESSIONS (
  session_id          SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  member_program_id   INT REFERENCES MEMBER_PROGRAMS(member_program_id),
  session_name        VARCHAR(150),
  muscle_group        VARCHAR(50),
  status              VARCHAR(30) NOT NULL DEFAULT 'active',
  is_pr_achieved      BOOLEAN NOT NULL DEFAULT FALSE,
  started_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMP
);

CREATE TABLE CHECK_INS (
  checkin_id          SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  gym_id              INT NOT NULL REFERENCES GYMS(gym_id),
  membership_id       INT REFERENCES GYM_MEMBERSHIPS(membership_id),
  trial_pass_id       INT REFERENCES FREE_TRIAL_PASSES(pass_id),
  checkin_time        TIMESTAMP NOT NULL DEFAULT NOW(),
  checkout_time       TIMESTAMP
);

CREATE TABLE EXERCISE_LOGS (
  log_id              SERIAL PRIMARY KEY,
  session_id          INT NOT NULL REFERENCES WORKOUT_SESSIONS(session_id),
  exercise_id         INT NOT NULL REFERENCES EXERCISES(exercise_id),
  program_exercise_id INT REFERENCES PROGRAM_EXERCISES(program_exercise_id),
  is_pr               BOOLEAN NOT NULL DEFAULT FALSE,
  overload_suggestion VARCHAR(255),
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE SET_LOGS (
  set_id              SERIAL PRIMARY KEY,
  log_id              INT NOT NULL REFERENCES EXERCISE_LOGS(log_id),
  set_number          INT NOT NULL,
  weight_kg           DECIMAL(6,2),
  reps_target         INT,
  reps_actual         INT,
  rest_seconds        INT
);

CREATE TABLE PERSONAL_RECORDS (
  pr_id               SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  exercise_id         INT NOT NULL REFERENCES EXERCISES(exercise_id),
  session_id          INT REFERENCES WORKOUT_SESSIONS(session_id),
  pr_value            DECIMAL(8,2) NOT NULL,
  previous_value      DECIMAL(8,2),
  improvement_pct     DECIMAL(5,2),
  achieved_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE TRANSFORMATION_GOALS (
  goal_id             SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  goal_type           VARCHAR(30) NOT NULL,
  fitness_level       VARCHAR(30) NOT NULL,
  days_per_week       INT NOT NULL,
  injured_areas       VARCHAR(255),
  food_allergies      VARCHAR(255),
  dietary_preference  VARCHAR(50),
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Group 4: Products, Orders, Gear Marketplace
-- ------------------------------------------------------------

CREATE TABLE PRODUCTS (
  product_id          SERIAL PRIMARY KEY,
  name                VARCHAR(150) NOT NULL,
  category            VARCHAR(50) NOT NULL,
  price               DECIMAL(12,2) NOT NULL,
  deposit_amount      DECIMAL(12,2) NOT NULL DEFAULT 0,
  description         VARCHAR(500),
  image_url           VARCHAR(500),
  is_available        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE INVENTORY (
  inventory_id        SERIAL PRIMARY KEY,
  product_id          INT NOT NULL REFERENCES PRODUCTS(product_id),
  quantity            INT NOT NULL DEFAULT 0,
  warning_threshold   INT NOT NULL DEFAULT 5,
  status              VARCHAR(30) NOT NULL DEFAULT 'in_stock'
);

-- ------------------------------------------------------------
-- Group 4a: Gear Marketplace (mua đứt & cho thuê thiết bị)
-- Ghi chú: mỗi GEAR_ITEMS là một vật thể vật lý độc lập (BR-20) — không
-- nhóm nhiều đơn vị giống nhau dưới một sản phẩm mẫu, không dùng số lượng
-- tồn kho chung (PRODUCTS/INVENTORY ở trên chỉ áp dụng cho domain dinh
-- dưỡng, không áp dụng cho gear).
-- ------------------------------------------------------------

CREATE TABLE GEAR_ITEMS (
  gear_id              VARCHAR(20) PRIMARY KEY,          -- sinh dạng UUID: GEAR-XXXX-XXXX
  current_owner_id     INT NOT NULL REFERENCES USERS(user_id),
  category             VARCHAR(50) NOT NULL,
  name                 VARCHAR(200) NOT NULL,
  description          VARCHAR(1000),
  condition_rating     INT NOT NULL,
  condition_notes      VARCHAR(500),
  images               JSON,
  listing_type         VARCHAR(10) NOT NULL DEFAULT 'rent',   -- 'sell' | 'rent' | 'both'
  sell_price           DECIMAL(12,2),
  rent_price_day       DECIMAL(10,2),
  rent_price_week      DECIMAL(10,2),
  deposit_amount       DECIMAL(12,2),
  qr_code_url          VARCHAR(500),        -- dự trù, chưa sinh mã QR ở phiên bản hiện tại
  verified             BOOLEAN NOT NULL DEFAULT FALSE,
  is_available         BOOLEAN NOT NULL DEFAULT TRUE,
  avg_rating           DECIMAL(2,1) NOT NULL DEFAULT 0,
  total_reviews        INT NOT NULL DEFAULT 0,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE GEAR_TRANSACTIONS (
  transaction_id       SERIAL PRIMARY KEY,
  gear_id              VARCHAR(20) NOT NULL REFERENCES GEAR_ITEMS(gear_id),
  seller_id            INT NOT NULL REFERENCES USERS(user_id),
  buyer_id             INT NOT NULL REFERENCES USERS(user_id),
  type                 VARCHAR(10) NOT NULL,               -- 'sale' | 'rental'
  amount               DECIMAL(12,2) NOT NULL,              -- giá bán, hoặc phí thuê (đơn giá x số ngày)
  deposit              DECIMAL(12,2) NOT NULL DEFAULT 0,
  fitcoin_used         DECIMAL(12,2) NOT NULL DEFAULT 0,
  rental_start         DATE,
  rental_end           DATE,
  status               VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending|active|completed|disputed
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE GEAR_LIFECYCLE (
  lifecycle_id         SERIAL PRIMARY KEY,
  gear_id              VARCHAR(20) NOT NULL REFERENCES GEAR_ITEMS(gear_id),
  owner_id             INT NOT NULL REFERENCES USERS(user_id),
  action               VARCHAR(20) NOT NULL,   -- listed|sold|rented|returned|relisted
  condition_at_time    INT,
  notes                VARCHAR(500),
  photos               JSON,
  price_snapshot       DECIMAL(12,2),
  timestamp            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE SHIPPING_ADDRESSES (
  address_id          SERIAL PRIMARY KEY,
  user_id             INT NOT NULL REFERENCES USERS(user_id),
  recipient_name      VARCHAR(100) NOT NULL,
  recipient_phone     VARCHAR(15) NOT NULL,
  address_line        VARCHAR(255) NOT NULL,
  city                VARCHAR(100) NOT NULL,
  is_default          BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE INVOICES (
  invoice_id             SERIAL PRIMARY KEY,
  user_id                INT REFERENCES USERS(user_id),
  guest_phone            VARCHAR(15),
  guest_session_token    VARCHAR(255),
  invoice_type           VARCHAR(30) NOT NULL,
  payment_gateway_tx_id  VARCHAR(255),
  subtotal               DECIMAL(12,2) NOT NULL,
  fitcoin_discount       DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_fee           DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_amount           DECIMAL(12,2) NOT NULL,
  payment_method         VARCHAR(30) NOT NULL,
  payment_status         VARCHAR(30) NOT NULL DEFAULT 'pending',
  paid_at                TIMESTAMP,
  created_at             TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE NUTRITION_ORDERS (
  order_id             SERIAL PRIMARY KEY,
  invoice_id           INT NOT NULL REFERENCES INVOICES(invoice_id),
  user_id              INT REFERENCES USERS(user_id),
  delivery_type        VARCHAR(30) NOT NULL,
  shipping_address_id  INT REFERENCES SHIPPING_ADDRESSES(address_id),
  status               VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ORDER_ITEMS (
  order_item_id        SERIAL PRIMARY KEY,
  order_id             INT NOT NULL REFERENCES NUTRITION_ORDERS(order_id),
  product_id           INT NOT NULL REFERENCES PRODUCTS(product_id),
  quantity             INT NOT NULL,
  price_at_purchase    DECIMAL(12,2) NOT NULL
);

-- Việc thuê gear (rental) đã nằm trong GEAR_TRANSACTIONS (type='rental') ở
-- Group 4a — không tách bảng GEAR_RENTALS riêng, tránh trùng lặp dữ liệu
-- ngày thuê/trạng thái với GEAR_TRANSACTIONS.

-- [DỰ KIẾN — CHƯA TRIỂN KHAI] Quy trình kiểm tra tình trạng khi trả gear
-- (BR-19: hoàn cọc theo tình trạng 100%/70%/0%, xuất hóa đơn bồi thường khi
-- hư nặng/mất) chưa có bước xử lý trong code hiện tại — return_gear() mới
-- chỉ đổi trạng thái giao dịch, chưa đánh giá tình trạng vật lý. Thiết kế
-- dự kiến cho giai đoạn phát triển tiếp theo, tham chiếu GEAR_TRANSACTIONS:
CREATE TABLE GEAR_RETURN_INSPECTIONS (
  inspection_id        SERIAL PRIMARY KEY,
  transaction_id       INT NOT NULL REFERENCES GEAR_TRANSACTIONS(transaction_id),
  inspected_by         INT NOT NULL REFERENCES USERS(user_id),
  condition_on_return  VARCHAR(50) NOT NULL,
  penalty_applied      DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes                VARCHAR(500),
  inspected_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE MEMBERSHIP_HISTORY (
  history_id           SERIAL PRIMARY KEY,
  membership_id        INT NOT NULL REFERENCES GYM_MEMBERSHIPS(membership_id),
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  plan_id              INT NOT NULL REFERENCES MEMBERSHIP_PLANS(plan_id),
  invoice_id           INT REFERENCES INVOICES(invoice_id),
  action_type          VARCHAR(30) NOT NULL,
  old_end_date         DATE,
  new_end_date         DATE,
  price_paid           DECIMAL(12,2),
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- Group 5: Recommendations, CRM, Challenges, Social
-- ------------------------------------------------------------

CREATE TABLE CHALLENGES (
  challenge_id         SERIAL PRIMARY KEY,
  name                 VARCHAR(150) NOT NULL,
  challenge_type       VARCHAR(30) NOT NULL,
  target_type          VARCHAR(30) NOT NULL,
  target_value         DECIMAL(12,2) NOT NULL,
  fitcoin_reward       DECIMAL(12,2) NOT NULL DEFAULT 0,
  xp_reward            INT NOT NULL DEFAULT 0,
  start_date           DATE NOT NULL,
  end_date             DATE NOT NULL
);

CREATE TABLE RECOMMENDATIONS (
  recommendation_id    SERIAL PRIMARY KEY,
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  rule_code            VARCHAR(50) NOT NULL,
  priority             INT NOT NULL DEFAULT 0,
  suggested_action     VARCHAR(255) NOT NULL,
  status               VARCHAR(30) NOT NULL DEFAULT 'pending',
  dismiss_reason       VARCHAR(255),
  assigned_staff_id    INT REFERENCES USERS(user_id),
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE CARE_FOLLOWUPS (
  followup_id          SERIAL PRIMARY KEY,
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  session_id           INT REFERENCES WORKOUT_SESSIONS(session_id),
  assigned_staff_id    INT REFERENCES USERS(user_id),
  status               VARCHAR(30) NOT NULL DEFAULT 'pending',
  notes                VARCHAR(500),
  created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at         TIMESTAMP
);

CREATE TABLE USER_CHALLENGES (
  user_challenge_id    SERIAL PRIMARY KEY,
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  challenge_id         INT NOT NULL REFERENCES CHALLENGES(challenge_id),
  progress_value       DECIMAL(12,2) NOT NULL DEFAULT 0,
  status               VARCHAR(30) NOT NULL DEFAULT 'in_progress',
  joined_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at         TIMESTAMP
);

CREATE TABLE NOTIFICATIONS (
  notification_id      SERIAL PRIMARY KEY,
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  title                VARCHAR(150) NOT NULL,
  content              VARCHAR(500) NOT NULL,
  is_read              BOOLEAN NOT NULL DEFAULT FALSE,
  notification_type    VARCHAR(50) NOT NULL,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE SOCIAL_POSTS (
  post_id              SERIAL PRIMARY KEY,
  user_id              INT NOT NULL REFERENCES USERS(user_id),
  post_type            VARCHAR(30) NOT NULL,
  achievement_id       INT REFERENCES MILESTONE_ACHIEVEMENTS(achievement_id),
  content              VARCHAR(1000),
  image_url            VARCHAR(500),
  is_public            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);
