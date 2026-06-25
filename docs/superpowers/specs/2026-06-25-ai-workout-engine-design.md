# AI Workout Engine — Layer 2 Program Engine Design

**Date:** 2026-06-25  
**Status:** Approved  
**Scope:** Phase 1 (AI session generation + editable workout flow) + Phase 2 (WORKOUT_PROGRAMS backend + member enrollment)

---

## 1. Overview

Build a two-phase AI workout engine for FitFuel+ members:

- **Phase 1:** Member chọn muscle group → AI generate suggested exercises (rule-based + progressive overload từ lịch sử) → member chỉnh sửa inline → confirm → lưu session + exercises vào DB.
- **Phase 2:** GymOwner tạo chương trình 12-tuần → Member đăng ký → system giao đúng bài tập theo tuần/ngày → AI session generation ưu tiên program exercises thay vì rule-based.

Workout data được AI coaching engine (`engine.py`) đọc để gợi ý đồ ăn. Customization log (bài tập member thêm/bớt) dùng để cá nhân hoá gợi ý tương lai.

---

## 2. Architecture

```
Member chọn muscle group
        ↓
POST /api/gym/sessions/generate
  ├─ Có active MemberProgram? → lấy ProgramDay hôm nay
  └─ Không → rule-based từ exercise_templates + lịch sử
        ↓
Frontend: Editable workout list (add/remove/edit sets/reps/weight)
        ↓
POST /api/gym/sessions/confirm
  → WorkoutSession + ExerciseLog[] lưu DB
  → customization_log lưu diff (thêm/bớt/swap)
        ↓
AI coaching engine đọc ExerciseLog → gợi ý đồ ăn
```

---

## 3. Data Models

### Phase 1 — Migrations nhỏ

**Bảng mới: `exercise_templates`**
```sql
exercise_template_id  SERIAL PRIMARY KEY
exercise_name         VARCHAR(100) NOT NULL
muscle_group          muscle_group_enum NOT NULL  -- reuse enum từ exercise_logs
default_sets          INT DEFAULT 3
default_reps          INT DEFAULT 10
default_weight_kg     DECIMAL(5,2) DEFAULT 0
equipment             VARCHAR(50)   -- 'barbell', 'dumbbell', 'machine', 'bodyweight'
difficulty            VARCHAR(20)   -- 'beginner', 'intermediate', 'advanced'
```
Seed data: 6-8 exercises mỗi muscle_group.

**Thay đổi `workout_sessions`:**
```sql
member_program_id     INT NULL   -- FK constraint added in Phase 2 migration (table doesn't exist yet)
program_day_id        INT NULL   -- FK constraint added in Phase 2 migration
customized_from_prog  BOOLEAN DEFAULT FALSE
customization_log     JSONB   -- { added: [], removed: [], modified: [] }
```

**Thay đổi `exercise_logs`:**
```sql
program_exercise_id   INT NULL   -- FK constraint added in Phase 2 migration
overload_suggestion   JSONB   -- { prev_weight, prev_reps, suggested_weight, note }
```

### Phase 2 — Program tables

**`workout_programs`**
```sql
program_id       SERIAL PRIMARY KEY
name             VARCHAR(100) NOT NULL
description      TEXT
goal_type        VARCHAR(20)   -- 'muscle_gain', 'fat_loss', 'strength', 'maintain'
level            VARCHAR(20)   -- 'beginner', 'intermediate', 'advanced'
duration_weeks   INT NOT NULL
days_per_week    INT NOT NULL DEFAULT 3
created_by       INT REFERENCES users(user_id)  -- GymOwner
is_active        BOOLEAN DEFAULT TRUE
```

**`program_days`**
```sql
program_day_id   SERIAL PRIMARY KEY
program_id       INT REFERENCES workout_programs(program_id)
week_number      INT NOT NULL    -- 1-based
day_index        INT NOT NULL    -- 0-based within week (0=Mon, 1=Wed, 2=Fri...)
muscle_focus     muscle_group_enum NOT NULL
notes            TEXT
```

**`program_exercises`**
```sql
program_exercise_id  SERIAL PRIMARY KEY
program_day_id       INT REFERENCES program_days(program_day_id)
exercise_name        VARCHAR(100) NOT NULL
muscle_group         muscle_group_enum NOT NULL
sets                 INT DEFAULT 3
reps                 INT DEFAULT 10
rest_seconds         INT DEFAULT 90
order_index          INT DEFAULT 0
notes                TEXT
```

**`member_programs`**
```sql
member_program_id  SERIAL PRIMARY KEY
user_id            INT REFERENCES users(user_id)
program_id         INT REFERENCES workout_programs(program_id)
start_date         DATE NOT NULL
status             VARCHAR(20) DEFAULT 'active'  -- 'active', 'paused', 'completed'
```

---

## 4. Backend Endpoints

### Phase 1

**`POST /api/gym/sessions/generate`**
- Auth: required (member)
- Input: `{ muscle_group: string, date: string }`
- Logic:
  1. Kiểm tra active `MemberProgram` → nếu có, tính `ProgramDay` hôm nay (Phase 2)
  2. Fallback: query `exercise_templates` theo `muscle_group`, chọn 4-6 exercises
  3. Query 3 sessions gần nhất cùng `muscle_group` → lấy weight/reps từ `ExerciseLog`
  4. Tính progressive overload: nếu completed ≥ 3 sets đủ reps → +2.5kg; nếu chưa đủ reps → +1 rep; nếu mới → dùng `default_weight_kg`
  5. Return suggested exercises với `overload_suggestion`
- Output:
  ```json
  {
    "source": "rule_based" | "program",
    "program_day_id": null | int,
    "suggested_exercises": [
      {
        "exercise_name": "Bench Press",
        "muscle_group": "chest",
        "sets": [{"reps": 10, "weight": 60}],
        "overload_suggestion": {
          "prev_weight": 57.5,
          "prev_reps": 10,
          "suggested_weight": 60,
          "note": "Tăng 2.5kg so với buổi trước"
        }
      }
    ]
  }
  ```

**`POST /api/gym/sessions/confirm`**
- Auth: required (member)
- Input:
  ```json
  {
    "date": "2026-06-25",
    "notes": "chest",
    "muscle_group": "chest",
    "member_program_id": null,
    "program_day_id": null,
    "exercises": [
      {
        "exercise_name": "Bench Press",
        "muscle_group": "chest",
        "sets": [{"reps": 10, "weight": 60}],
        "overload_suggestion": {...},
        "was_modified": false
      }
    ],
    "customization_log": {
      "added": ["Cable Fly"],
      "removed": ["Incline Press"],
      "modified": [{"exercise": "Bench Press", "change": "weight 57.5→60"}]
    }
  }
  ```
- Logic: tạo `WorkoutSession` → tạo `ExerciseLog` cho từng exercise → commit
- Output: `{ session_id: int }`

Endpoints cũ (`POST /api/gym/sessions`, `POST /api/gym/sessions/{id}/exercises`) **giữ nguyên** — backward compatible.

### Phase 2

```
GET  /api/gym/programs                  list programs (public, no auth)
POST /api/gym/programs                  GymOwner tạo program [role: gym_owner]
GET  /api/gym/programs/{id}             program detail + days + exercises
POST /api/gym/member-programs           member enroll { program_id }
GET  /api/gym/member-programs/active    active program + today's ProgramDay
DELETE /api/gym/member-programs/{id}    pause/cancel enrollment
```

---

## 5. Frontend Flow

### `JourneySessionPage` (rebuilt — Phase 1)

**Step 1 — Chọn muscle group** (UI hiện tại giữ nguyên)

**Step 2 — Generate** (loading state)
```
"Đang phân tích lịch sử tập luyện..."
POST /api/gym/sessions/generate
```

**Step 3 — Editable workout list**
- Mỗi exercise card: tên, muscle badge, sets/reps/weight edit inline
- Badge progressive overload: `↑ Tăng 2.5kg so với kỳ trước` (màu xanh)
- Button `+ Thêm bài` → modal search từ exercise_templates
- Button xoá (×) trên mỗi exercise
- Track `customization_log` local state khi user add/remove/modify

**Step 4 — Confirm**
- Button `Bắt đầu buổi tập` → POST `/api/gym/sessions/confirm`
- Redirect đến `/journey/session/:id`

### `JourneyProgramsPage`
- Phase 1: giữ mock data (không thay đổi)
- Phase 2: fetch `/api/gym/programs`, show nút `Đăng ký`, badge `Đang tham gia` nếu đã enroll

---

## 6. AI Generation Logic (Rule-based Engine)

File: `BE/app/modules/gym/workout_generator.py`

```python
async def generate_workout(db, user_id, muscle_group, date) -> dict:
    # 1. Check active MemberProgram (Phase 2 gate)
    # 2. Fetch exercise_templates for muscle_group (ordered by difficulty)
    # 3. Fetch last 3 ExerciseLog for same muscle_group
    # 4. Build overload map: exercise_name → {prev_weight, prev_reps}
    # 5. Apply progressive overload rules
    # 6. Return 4-6 exercises with suggested sets/reps/weight
```

Progressive overload rules (đọc từ **last session** của user, không phải session đang tạo):
- Nếu `last_session.sets_count >= target_sets AND last_session.avg_reps >= target_reps` → suggest `weight += 2.5kg`
- Nếu `last_session.sets_count >= target_sets AND last_session.avg_reps < target_reps` → suggest `reps += 1`, weight giữ nguyên
- Nếu không có lịch sử → dùng `exercise_templates.default_weight_kg` và `default_reps`

---

## 7. Customization Learning (Future AI input)

`customization_log` được lưu trong `workout_sessions` dưới dạng JSONB:
```json
{
  "added": ["Cable Fly"],
  "removed": ["Incline Press"],
  "modified": [{"exercise": "Bench Press", "change": "sets 3→4"}]
}
```

AI coaching engine (`engine.py`) có thể đọc patterns này theo thời gian:
- Member hay bỏ "Incline Press" → giảm priority cho exercise đó
- Member hay thêm "Cable Fly" → tăng priority trong lần generate tương lai

Implementation cụ thể của learning logic là **out-of-scope** cho sprint này — chỉ đảm bảo data được capture đúng format.

---

## 8. Implementation Order

### Sprint 1 — Phase 1 (Member-facing, ship first)
1. Alembic migration: `exercise_templates`, alter `workout_sessions`, alter `exercise_logs`
2. Seed `exercise_templates` với 40+ exercises (6-8 mỗi muscle_group)
3. `workout_generator.py` — rule-based generation service
4. Router: `POST /api/gym/sessions/generate`, `POST /api/gym/sessions/confirm`
5. Frontend: Rebuild `JourneySessionPage` (generate → editable list → confirm)

### Sprint 2 — Phase 2 (GymOwner + Program management)
6. Alembic migration: 4 program tables
7. Router: program CRUD + member enrollment endpoints
8. Frontend: `JourneyProgramsPage` kết nối real API + enroll flow
9. Wire `sessions/generate` để ưu tiên `ProgramDay` khi member có active program

---

## 9. Out of Scope

- GymOwner UI để tạo/edit program (Sprint 2 — backend API trước, UI sau)
- AI learning từ customization_log (data capture Sprint 1, learning logic Sprint 3+)
- Push notification nhắc lịch tập
- Leaderboard / social features
