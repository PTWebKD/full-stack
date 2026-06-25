# AI Workout Engine Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI-generated editable workout sessions to FitFuel+ — member picks muscle group, system suggests exercises with progressive overload from history, member edits inline, then confirms to log session + exercises.

**Architecture:** New `exercise_templates` table seeds exercise data per muscle group. New `POST /api/gym/sessions/generate` endpoint returns rule-based suggestions with progressive overload calculated from `exercise_logs` history. New `POST /api/gym/sessions/confirm` creates session + all exercises in one call. Frontend `JourneySessionPage` rebuilt with 4-step flow: select → generate → edit → confirm.

**Tech Stack:** FastAPI + SQLAlchemy async (backend), React + Vite (frontend), Alembic migrations (PostgreSQL on Render), SQLite (tests), `api.js` helper returns `json.data`.

---

## File Map

**Create:**
- `BE/alembic/versions/004_ai_workout_engine_phase1.py` — migration: extend enum, create exercise_templates, add columns to workout_sessions + exercise_logs, seed data
- `BE/app/modules/gym/workout_generator.py` — pure service: rule-based exercise generation + progressive overload logic
- `BE/tests/modules/gym/__init__.py` — empty init for test package
- `BE/tests/modules/gym/test_workout_generator.py` — unit tests for generator

**Modify:**
- `BE/app/modules/gym/model.py` — add `back_shoulders`/`full_body` to `MuscleGroup`, add `ExerciseTemplate` model, add new columns to `WorkoutSession` and `ExerciseLog`
- `BE/app/modules/gym/schema.py` — add `GenerateRequest`, `SuggestedExercise`, `GenerateResponse`, `ConfirmExercise`, `ConfirmRequest`, `ConfirmResponse`, `ExerciseTemplateOut`
- `BE/app/modules/gym/router.py` — add 3 new routes: `POST /sessions/generate`, `POST /sessions/confirm`, `GET /exercise-templates`
- `BE/alembic/env.py` — import `ExerciseTemplate` model
- `FE/src/pages/member/journey/JourneySessionPage.jsx` — full rebuild with 4-step flow

---

## Task 1: Alembic Migration

**Files:**
- Create: `BE/alembic/versions/004_ai_workout_engine_phase1.py`

- [ ] **Step 1: Write the migration file**

```python
# BE/alembic/versions/004_ai_workout_engine_phase1.py
"""ai_workout_engine_phase1

Revision ID: 004_ai_workout_engine
Revises: 003_create_guests_vouchers
Create Date: 2026-06-25 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '004_ai_workout_engine'
down_revision = '003_create_guests_vouchers'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Extend PostgreSQL muscle_group enum with new values
    op.execute(sa.text("ALTER TYPE muscle_group ADD VALUE IF NOT EXISTS 'back_shoulders'"))
    op.execute(sa.text("ALTER TYPE muscle_group ADD VALUE IF NOT EXISTS 'full_body'"))

    # 2. Create exercise_templates table (uses VARCHAR for muscle_group — avoids enum lock-in)
    op.create_table(
        'exercise_templates',
        sa.Column('exercise_template_id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('exercise_name', sa.String(100), nullable=False),
        sa.Column('muscle_group', sa.String(50), nullable=False),
        sa.Column('default_sets', sa.Integer, nullable=False, server_default='3'),
        sa.Column('default_reps', sa.Integer, nullable=False, server_default='10'),
        sa.Column('default_weight_kg', sa.Numeric(5, 2), nullable=False, server_default='0'),
        sa.Column('equipment', sa.String(50), nullable=True),
        sa.Column('difficulty', sa.String(20), nullable=True),
    )

    # 3. Seed exercise templates (8 muscle groups × 5-6 exercises = 44 total)
    op.bulk_insert(
        sa.table(
            'exercise_templates',
            sa.column('exercise_name', sa.String),
            sa.column('muscle_group', sa.String),
            sa.column('default_sets', sa.Integer),
            sa.column('default_reps', sa.Integer),
            sa.column('default_weight_kg', sa.Numeric),
            sa.column('equipment', sa.String),
            sa.column('difficulty', sa.String),
        ),
        [
            # --- chest ---
            {'exercise_name': 'Bench Press', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 60, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Incline Dumbbell Press', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 20, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Cable Fly', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 15, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Chest Dip', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
            {'exercise_name': 'Push-Up', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
            # --- back ---
            {'exercise_name': 'Pull-Up', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 8, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
            {'exercise_name': 'Lat Pulldown', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Bent-Over Row', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Seated Cable Row', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 45, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Deadlift', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 5, 'default_weight_kg': 80, 'equipment': 'barbell', 'difficulty': 'advanced'},
            # --- back_shoulders ---
            {'exercise_name': 'Lat Pulldown', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Bent-Over Row', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Overhead Press', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Lateral Raise', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Rear Delt Fly', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Arnold Press', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
            # --- legs ---
            {'exercise_name': 'Squat', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 80, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Leg Press', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 100, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Romanian Deadlift', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 60, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Leg Curl', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 40, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Calf Raise', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 60, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Lunges', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 20, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            # --- shoulders ---
            {'exercise_name': 'Overhead Press', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Lateral Raise', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Front Raise', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Rear Delt Fly', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Arnold Press', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
            # --- arms ---
            {'exercise_name': 'Barbell Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 30, 'equipment': 'barbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Tricep Pushdown', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 30, 'equipment': 'machine', 'difficulty': 'beginner'},
            {'exercise_name': 'Hammer Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Skull Crusher', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 25, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Preacher Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 25, 'equipment': 'machine', 'difficulty': 'beginner'},
            # --- core ---
            {'exercise_name': 'Plank', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 1, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
            {'exercise_name': 'Crunches', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 20, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
            {'exercise_name': 'Russian Twist', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 20, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
            {'exercise_name': 'Leg Raise', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
            {'exercise_name': 'Ab Wheel', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
            # --- full_body ---
            {'exercise_name': 'Burpee', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
            {'exercise_name': 'Clean and Press', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 8, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'advanced'},
            {'exercise_name': 'Kettlebell Swing', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 20, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Thruster', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 30, 'equipment': 'barbell', 'difficulty': 'intermediate'},
            {'exercise_name': 'Box Jump', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
        ]
    )

    # 4. Add new columns to workout_sessions (Phase 1 — no FK constraints yet)
    op.add_column('workout_sessions', sa.Column('member_program_id', sa.Integer, nullable=True))
    op.add_column('workout_sessions', sa.Column('program_day_id', sa.Integer, nullable=True))
    op.add_column('workout_sessions', sa.Column('customized_from_prog', sa.Boolean, nullable=False, server_default='false'))
    op.add_column('workout_sessions', sa.Column('customization_log', sa.JSON, nullable=True))

    # 5. Add new columns to exercise_logs
    op.add_column('exercise_logs', sa.Column('program_exercise_id', sa.Integer, nullable=True))
    op.add_column('exercise_logs', sa.Column('overload_suggestion', sa.JSON, nullable=True))


def downgrade():
    op.drop_column('exercise_logs', 'overload_suggestion')
    op.drop_column('exercise_logs', 'program_exercise_id')
    op.drop_column('workout_sessions', 'customization_log')
    op.drop_column('workout_sessions', 'customized_from_prog')
    op.drop_column('workout_sessions', 'program_day_id')
    op.drop_column('workout_sessions', 'member_program_id')
    op.drop_table('exercise_templates')
    # Note: PostgreSQL does not support removing enum values — back_shoulders and full_body remain
```

- [ ] **Step 2: Run migration locally to verify syntax**

From `BE/` directory:
```bash
cd BE
alembic upgrade 004_ai_workout_engine
```
Expected: `Running upgrade 003_create_guests_vouchers -> 004_ai_workout_engine`

If error `relation "exercise_templates" already exists` → run `alembic downgrade 003_create_guests_vouchers` first.

- [ ] **Step 3: Commit migration**

```bash
git add BE/alembic/versions/004_ai_workout_engine_phase1.py
git commit -m "feat: add migration for AI workout engine phase 1 (exercise_templates, new columns)"
```

---

## Task 2: Update SQLAlchemy Models

**Files:**
- Modify: `BE/app/modules/gym/model.py`
- Modify: `BE/alembic/env.py`

- [ ] **Step 1: Update `MuscleGroup` enum and add `ExerciseTemplate` model, new columns**

Replace the contents of `BE/app/modules/gym/model.py` with:

```python
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Enum, Text, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from app.core.database import Base


class SessionStatus(str, enum.Enum):
    active = "active"
    done = "done"
    cancelled = "cancelled"


class MuscleGroup(str, enum.Enum):
    chest = "chest"
    back = "back"
    legs = "legs"
    shoulders = "shoulders"
    arms = "arms"
    core = "core"
    back_shoulders = "back_shoulders"
    full_body = "full_body"


class MembershipStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"


class Gym(Base):
    __tablename__ = "gyms"

    gym_id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    address = Column(String(500), nullable=False)
    phone = Column(String(15))
    opening_hours = Column(JSON, default=dict)
    services = Column(JSON, default=list)
    membership_plans = Column(JSON, default=list)
    logo_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class GymMembership(Base):
    __tablename__ = "gym_memberships"

    membership_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.gym_id", ondelete="CASCADE"), nullable=False)
    plan_name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(
        Enum(MembershipStatus, name="membership_status"), nullable=False, default=MembershipStatus.active
    )
    auto_renew = Column(Boolean, default=False, nullable=False)
    payment_method = Column(String(50))
    amount_paid = Column(Numeric(12, 2), nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    session_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.gym_id", ondelete="SET NULL"))
    date = Column(Date, nullable=False)
    duration_min = Column(Integer)
    status = Column(
        Enum(SessionStatus, name="session_status"), nullable=False, default=SessionStatus.active
    )
    notes = Column(Text)
    xp_earned = Column(Integer, default=0, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Phase 1: nullable int columns — FK constraints added in Phase 2 migration
    member_program_id = Column(Integer, nullable=True)
    program_day_id = Column(Integer, nullable=True)
    customized_from_prog = Column(Boolean, default=False, nullable=False)
    customization_log = Column(JSON, nullable=True)

    exercises = relationship(
        "ExerciseLog", back_populates="session", cascade="all, delete-orphan",
    )


class ExerciseLog(Base):
    __tablename__ = "exercise_logs"

    log_id = Column(Integer, primary_key=True)
    session_id = Column(
        Integer, ForeignKey("workout_sessions.session_id", ondelete="CASCADE"), nullable=False
    )
    exercise_name = Column(String(200), nullable=False)
    muscle_group = Column(Enum(MuscleGroup, name="muscle_group"), nullable=False)
    sets = Column(JSON, nullable=False, default=list)
    is_pr = Column(Boolean, default=False, nullable=False)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Phase 1: no FK constraint yet
    program_exercise_id = Column(Integer, nullable=True)
    overload_suggestion = Column(JSON, nullable=True)

    session = relationship("WorkoutSession", back_populates="exercises")


class ExerciseTemplate(Base):
    __tablename__ = "exercise_templates"

    exercise_template_id = Column(Integer, primary_key=True)
    exercise_name = Column(String(100), nullable=False)
    muscle_group = Column(String(50), nullable=False)
    default_sets = Column(Integer, nullable=False, default=3)
    default_reps = Column(Integer, nullable=False, default=10)
    default_weight_kg = Column(Numeric(5, 2), nullable=False, default=0)
    equipment = Column(String(50), nullable=True)
    difficulty = Column(String(20), nullable=True)


class AnnouncementPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class GymAnnouncement(Base):
    __tablename__ = "gym_announcements"

    announcement_id = Column(Integer, primary_key=True)
    gym_id = Column(Integer, ForeignKey("gyms.gym_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    priority = Column(Enum(AnnouncementPriority, name="announcement_priority"), default=AnnouncementPriority.medium, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
```

- [ ] **Step 2: Register `ExerciseTemplate` in Alembic env.py**

In `BE/alembic/env.py`, find line 20:
```python
from app.modules.gym.model import Gym, GymMembership, WorkoutSession, ExerciseLog, GymAnnouncement  # noqa
```
Replace with:
```python
from app.modules.gym.model import Gym, GymMembership, WorkoutSession, ExerciseLog, GymAnnouncement, ExerciseTemplate  # noqa
```

- [ ] **Step 3: Commit model changes**

```bash
git add BE/app/modules/gym/model.py BE/alembic/env.py
git commit -m "feat: add ExerciseTemplate model, extend MuscleGroup enum, add AI columns to WorkoutSession/ExerciseLog"
```

---

## Task 3: Workout Generator Service

**Files:**
- Create: `BE/app/modules/gym/workout_generator.py`
- Create: `BE/tests/modules/gym/__init__.py`
- Create: `BE/tests/modules/gym/test_workout_generator.py`

- [ ] **Step 1: Write failing tests**

Create `BE/tests/modules/gym/__init__.py` (empty):
```python
```

Create `BE/tests/modules/gym/test_workout_generator.py`:
```python
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from app.modules.gym.workout_generator import generate_workout, EXERCISES_PER_SESSION


@pytest.mark.asyncio
async def test_generate_workout_no_history_returns_defaults():
    """With no exercise history, all suggestions use template defaults."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_db = AsyncMock()
    # First execute → templates
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    # Second execute → empty history
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = []
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    assert result["source"] == "rule_based"
    assert result["program_day_id"] is None
    assert len(result["suggested_exercises"]) == 1
    ex = result["suggested_exercises"][0]
    assert ex["exercise_name"] == "Bench Press"
    assert ex["overload_suggestion"] is None
    assert ex["sets"] == [{"reps": 10, "weight": 60.0}] * 3


@pytest.mark.asyncio
async def test_generate_workout_with_completed_history_bumps_weight():
    """When last session completed all sets with full reps, suggest +2.5kg."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_log = MagicMock()
    mock_log.exercise_name = "Bench Press"
    mock_log.sets = [
        {"reps": 10, "weight": 57.5},
        {"reps": 10, "weight": 57.5},
        {"reps": 10, "weight": 57.5},
    ]

    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = [mock_log]
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    ex = result["suggested_exercises"][0]
    assert ex["overload_suggestion"]["suggested_weight"] == 60.0
    assert ex["overload_suggestion"]["prev_weight"] == 57.5
    for s in ex["sets"]:
        assert s["weight"] == 60.0


@pytest.mark.asyncio
async def test_generate_workout_with_incomplete_history_bumps_reps():
    """When last session had low reps, suggest +1 rep, same weight."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_log = MagicMock()
    mock_log.exercise_name = "Bench Press"
    mock_log.sets = [
        {"reps": 7, "weight": 60},
        {"reps": 7, "weight": 60},
        {"reps": 7, "weight": 60},
    ]

    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = [mock_log]
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    ex = result["suggested_exercises"][0]
    assert ex["overload_suggestion"]["suggested_weight"] == 60
    for s in ex["sets"]:
        assert s["reps"] == 8  # 7 + 1


@pytest.mark.asyncio
async def test_generate_workout_maps_custom_to_full_body():
    """'custom' muscle group fetches full_body templates."""
    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = []
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = []
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="custom")

    # Verify the template query used 'full_body'
    first_call_args = str(mock_db.execute.call_args_list[0])
    assert "full_body" in first_call_args
    assert result["source"] == "rule_based"
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd BE
pytest tests/modules/gym/test_workout_generator.py -v
```
Expected: `ModuleNotFoundError: No module named 'app.modules.gym.workout_generator'`

- [ ] **Step 3: Implement the generator**

Create `BE/app/modules/gym/workout_generator.py`:
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .model import ExerciseTemplate, ExerciseLog, WorkoutSession

EXERCISES_PER_SESSION = 5
_MUSCLE_GROUP_MAP = {
    "custom": "full_body",
}


async def generate_workout(db: AsyncSession, user_id: int, muscle_group: str) -> dict:
    lookup_mg = _MUSCLE_GROUP_MAP.get(muscle_group, muscle_group)

    # 1. Fetch exercise templates for this muscle group
    r = await db.execute(
        select(ExerciseTemplate)
        .where(ExerciseTemplate.muscle_group == lookup_mg)
        .order_by(ExerciseTemplate.exercise_template_id)
        .limit(EXERCISES_PER_SESSION + 3)
    )
    templates = r.scalars().all()
    chosen = templates[:EXERCISES_PER_SESSION]

    # 2. Fetch user's most recent exercise logs for this muscle group (last 30)
    r = await db.execute(
        select(ExerciseLog)
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(
            WorkoutSession.user_id == user_id,
            ExerciseLog.muscle_group == lookup_mg,
        )
        .order_by(ExerciseLog.created_at.desc())
        .limit(30)
    )
    recent_logs = r.scalars().all()

    # 3. Build history map: exercise_name → last performance (first occurrence = most recent)
    history: dict[str, dict] = {}
    for log in recent_logs:
        if log.exercise_name not in history:
            sets = log.sets or []
            if sets:
                avg_reps = sum(s.get("reps", 0) for s in sets) / len(sets)
                last_weight = max((float(s.get("weight", 0)) for s in sets), default=0.0)
                history[log.exercise_name] = {
                    "avg_reps": avg_reps,
                    "last_weight": last_weight,
                    "sets_count": len(sets),
                }

    # 4. Build suggestions with progressive overload
    suggested = []
    for tmpl in chosen:
        prev = history.get(tmpl.exercise_name)
        default_weight = float(tmpl.default_weight_kg)
        target_reps = tmpl.default_reps
        target_sets = tmpl.default_sets

        if prev:
            if prev["sets_count"] >= target_sets and prev["avg_reps"] >= target_reps:
                # Fully completed last time → bump weight
                suggested_weight = prev["last_weight"] + 2.5
                suggested_reps = target_reps
                overload_suggestion = {
                    "prev_weight": prev["last_weight"],
                    "prev_reps": int(prev["avg_reps"]),
                    "suggested_weight": suggested_weight,
                    "note": f"Tăng 2.5kg so với buổi trước ({prev['last_weight']}kg → {suggested_weight}kg)",
                }
            else:
                # Not fully completed → same weight, target +1 rep
                suggested_weight = prev["last_weight"]
                suggested_reps = min(int(prev["avg_reps"]) + 1, target_reps + 2)
                overload_suggestion = {
                    "prev_weight": prev["last_weight"],
                    "prev_reps": int(prev["avg_reps"]),
                    "suggested_weight": suggested_weight,
                    "note": f"Cố {suggested_reps} reps (lần trước đạt {int(prev['avg_reps'])} reps)",
                }
        else:
            suggested_weight = default_weight
            suggested_reps = target_reps
            overload_suggestion = None

        sets = [{"reps": suggested_reps, "weight": suggested_weight}] * target_sets

        suggested.append({
            "exercise_name": tmpl.exercise_name,
            "muscle_group": tmpl.muscle_group,
            "sets": sets,
            "overload_suggestion": overload_suggestion,
        })

    return {
        "source": "rule_based",
        "program_day_id": None,
        "suggested_exercises": suggested,
    }
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd BE
pytest tests/modules/gym/test_workout_generator.py -v
```
Expected: All 4 tests `PASSED`

- [ ] **Step 5: Commit**

```bash
git add BE/app/modules/gym/workout_generator.py BE/tests/modules/gym/__init__.py BE/tests/modules/gym/test_workout_generator.py
git commit -m "feat: add workout_generator service with rule-based progressive overload"
```

---

## Task 4: New Schemas and Router Endpoints

**Files:**
- Modify: `BE/app/modules/gym/schema.py`
- Modify: `BE/app/modules/gym/router.py`

- [ ] **Step 1: Add new schemas to `schema.py`**

Append to the bottom of `BE/app/modules/gym/schema.py`:
```python

# --- AI Workout Generation ---

class GenerateRequest(BaseModel):
    muscle_group: str
    date: date


class OverloadSuggestion(BaseModel):
    prev_weight: float
    prev_reps: int
    suggested_weight: float
    note: str


class SuggestedExercise(BaseModel):
    exercise_name: str
    muscle_group: str
    sets: List[dict]
    overload_suggestion: Optional[OverloadSuggestion] = None


class GenerateResponse(BaseModel):
    source: str
    program_day_id: Optional[int] = None
    suggested_exercises: List[SuggestedExercise]


class ConfirmExercise(BaseModel):
    exercise_name: str
    muscle_group: str
    sets: List[SetData]
    overload_suggestion: Optional[dict] = None
    was_modified: bool = False


class ConfirmRequest(BaseModel):
    date: date
    notes: Optional[str] = None
    muscle_group: str
    member_program_id: Optional[int] = None
    program_day_id: Optional[int] = None
    exercises: List[ConfirmExercise]
    customization_log: Optional[dict] = None


class ConfirmResponse(BaseModel):
    session_id: int


class ExerciseTemplateOut(BaseModel):
    exercise_template_id: int
    exercise_name: str
    muscle_group: str
    default_sets: int
    default_reps: int
    default_weight_kg: float
    equipment: Optional[str] = None
    difficulty: Optional[str] = None

    model_config = {"from_attributes": True}
```

- [ ] **Step 2: Add 3 new routes to `router.py`**

In `BE/app/modules/gym/router.py`, add these imports at the top (after existing imports):
```python
from .workout_generator import generate_workout
from .schema import (
    GymCreate, GymOut, MembershipCreate, MembershipOut,
    SessionCreate, SessionOut, ExerciseCreate, ExerciseOut,
    AnnouncementCreate, AnnouncementOut,
    GenerateRequest, GenerateResponse,
    ConfirmRequest, ConfirmResponse, ConfirmExercise,
    ExerciseTemplateOut,
)
from .model import ExerciseTemplate
```

Then insert these 3 routes **after** the `GET /sessions/suggest` route (after line ~107) and **before** `GET /sessions/{session_id}`:

```python
# 7b. POST /sessions/generate — AI-generate suggested exercises
@router.post("/sessions/generate", response_model=None)
async def generate_session(
    data: GenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await generate_workout(db, user.user_id, data.muscle_group)
    return ok(result)


# 7c. POST /sessions/confirm — create session + all exercises atomically
@router.post("/sessions/confirm", response_model=None)
async def confirm_session(
    data: ConfirmRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from .model import WorkoutSession, ExerciseLog, MuscleGroup
    from .service import _check_session_editable

    # Create session
    session = WorkoutSession(
        user_id=user.user_id,
        date=data.date,
        notes=data.notes or data.muscle_group,
        member_program_id=data.member_program_id,
        program_day_id=data.program_day_id,
        customized_from_prog=data.program_day_id is not None,
        customization_log=data.customization_log or {},
    )
    db.add(session)
    await db.flush()

    # Create exercise logs
    for ex in data.exercises:
        try:
            mg = MuscleGroup(ex.muscle_group)
        except ValueError:
            mg = MuscleGroup.full_body
        log = ExerciseLog(
            session_id=session.session_id,
            exercise_name=ex.exercise_name,
            muscle_group=mg,
            sets=[s.model_dump() for s in ex.sets],
            overload_suggestion=ex.overload_suggestion,
        )
        db.add(log)

    await db.flush()
    return ok({"session_id": session.session_id})


# 7d. GET /exercise-templates — list templates by muscle group
@router.get("/exercise-templates", response_model=None)
async def list_exercise_templates(
    muscle_group: str = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import select as sa_select
    q = sa_select(ExerciseTemplate)
    if muscle_group:
        # Map 'custom' to 'full_body'
        lookup = "full_body" if muscle_group == "custom" else muscle_group
        q = q.where(ExerciseTemplate.muscle_group == lookup)
    r = await db.execute(q.order_by(ExerciseTemplate.exercise_template_id))
    templates = r.scalars().all()
    return ok([ExerciseTemplateOut.model_validate(t).model_dump() for t in templates])
```

- [ ] **Step 3: Verify the router compiles**

```bash
cd BE
python -c "from app.modules.gym.router import router; print('OK')"
```
Expected: `OK`

- [ ] **Step 4: Run all existing gym tests to ensure nothing is broken**

```bash
cd BE
pytest tests/ -v -k "not test_workout_generator"
```
Expected: All existing tests pass.

- [ ] **Step 5: Commit**

```bash
git add BE/app/modules/gym/schema.py BE/app/modules/gym/router.py
git commit -m "feat: add /sessions/generate, /sessions/confirm, /exercise-templates endpoints"
```

---

## Task 5: Rebuild Frontend JourneySessionPage

**Files:**
- Modify: `FE/src/pages/member/journey/JourneySessionPage.jsx`

- [ ] **Step 1: Write the new component**

Replace the entire contents of `FE/src/pages/member/journey/JourneySessionPage.jsx`:

```jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Ngực', emoji: '💪', color: '#FF5722' },
  { key: 'back_shoulders', label: 'Lưng + Vai', emoji: '🏋️', color: '#3b82f6' },
  { key: 'legs', label: 'Chân', emoji: '🦵', color: '#a855f7' },
  { key: 'full_body', label: 'Toàn thân', emoji: '⚡', color: '#22c55e' },
  { key: 'arms', label: 'Tay', emoji: '🤜', color: '#fbbf24' },
  { key: 'custom', label: 'Tự chọn', emoji: '🎯', color: '#ec4899' },
];

const MG_LABEL = Object.fromEntries(MUSCLE_GROUPS.map(m => [m.key, m.label]));

export default function JourneySessionPage() {
  const navigate = useNavigate();

  // step: 'select' | 'loading' | 'edit' | 'confirming'
  const [step, setStep] = useState('select');
  const [selected, setSelected] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [originalNames, setOriginalNames] = useState([]);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  // ── Step 1 → 2: generate ──────────────────────────────────────────
  const handleGenerate = async () => {
    if (!selected) return;
    setStep('loading');
    setError('');
    try {
      const data = await api.post('/api/gym/sessions/generate', {
        muscle_group: selected,
        date: new Date().toISOString().split('T')[0],
      });
      const stamped = (data.suggested_exercises || []).map((ex, i) => ({
        ...ex,
        _id: i,
        _modified: false,
      }));
      setExercises(stamped);
      setOriginalNames(stamped.map(ex => ex.exercise_name));
      setStep('edit');
    } catch (e) {
      setError(e.message || 'Không thể tạo buổi tập, vui lòng thử lại');
      setStep('select');
    }
  };

  // ── Step 3 → confirm ──────────────────────────────────────────────
  const handleConfirm = async () => {
    if (exercises.length === 0) return;
    setStep('confirming');
    setError('');

    const origSet = new Set(originalNames);
    const currSet = new Set(exercises.map(ex => ex.exercise_name));
    const customization_log = {
      added: exercises.filter(ex => !origSet.has(ex.exercise_name)).map(ex => ex.exercise_name),
      removed: originalNames.filter(n => !currSet.has(n)),
      modified: exercises
        .filter(ex => ex._modified && origSet.has(ex.exercise_name))
        .map(ex => ({ exercise: ex.exercise_name, change: 'sets modified' })),
    };

    try {
      const result = await api.post('/api/gym/sessions/confirm', {
        date: new Date().toISOString().split('T')[0],
        notes: selected,
        muscle_group: selected,
        member_program_id: null,
        program_day_id: null,
        exercises: exercises.map(ex => ({
          exercise_name: ex.exercise_name,
          muscle_group: ex.muscle_group,
          sets: ex.sets,
          overload_suggestion: ex.overload_suggestion || null,
          was_modified: ex._modified,
        })),
        customization_log,
      });
      navigate(`/journey?session=${result.session_id}`);
    } catch (e) {
      setError(e.message || 'Xác nhận thất bại, vui lòng thử lại');
      setStep('edit');
    }
  };

  // ── Exercise editing helpers ───────────────────────────────────────
  const updateSet = (exIdx, setIdx, field, raw) => {
    const value = parseFloat(raw) || 0;
    setExercises(prev => prev.map((ex, i) =>
      i !== exIdx ? ex : {
        ...ex,
        _modified: true,
        sets: ex.sets.map((s, j) => j !== setIdx ? s : { ...s, [field]: value }),
      }
    ));
  };

  const addSet = (exIdx) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const last = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0 };
      return { ...ex, _modified: true, sets: [...ex.sets, { ...last }] };
    }));
  };

  const removeSet = (exIdx, setIdx) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx || ex.sets.length <= 1) return ex;
      return { ...ex, _modified: true, sets: ex.sets.filter((_, j) => j !== setIdx) };
    }));
  };

  const removeExercise = (exIdx) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const openAddModal = async () => {
    try {
      const data = await api.get(`/api/gym/exercise-templates?muscle_group=${selected}`);
      const existing = new Set(exercises.map(ex => ex.exercise_name));
      setTemplates((data || []).filter(t => !existing.has(t.exercise_name)));
      setShowAddModal(true);
    } catch {
      setTemplates([]);
      setShowAddModal(true);
    }
  };

  const addFromTemplate = (tmpl) => {
    setExercises(prev => [...prev, {
      exercise_name: tmpl.exercise_name,
      muscle_group: tmpl.muscle_group,
      sets: Array.from({ length: tmpl.default_sets }, () => ({
        reps: tmpl.default_reps,
        weight: tmpl.default_weight_kg,
      })),
      overload_suggestion: null,
      _id: Date.now(),
      _modified: false,
    }]);
    setShowAddModal(false);
  };

  // ── Renders ────────────────────────────────────────────────────────
  if (step === 'select') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-2">Bước 1</p>
        <h1 className="text-2xl font-black text-[#18181B] mb-2">Hôm nay tập nhóm cơ nào?</h1>
        <p className="text-[#18181B]/60 text-sm">Chọn nhóm cơ — AI sẽ tạo buổi tập hoàn chỉnh cho bạn</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mb-8">
        {MUSCLE_GROUPS.map(mg => (
          <button key={mg.key} onClick={() => setSelected(mg.key)}
            className={`glass rounded-2xl p-5 border text-left transition-all ${selected === mg.key ? 'border-[#FF5722]/60 shadow-[0_0_20px_rgba(255,87,34,0.15)]' : 'border-[#18181B]/10 hover:border-[#18181B]/20'}`}>
            <div className="text-3xl mb-2">{mg.emoji}</div>
            <p className="font-bold text-[#18181B] text-sm">{mg.label}</p>
            {selected === mg.key && (
              <div className="mt-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: mg.color }}>
                <ChevronRight className="w-2.5 h-2.5 text-black" />
              </div>
            )}
          </button>
        ))}
      </div>

      <button onClick={handleGenerate} disabled={!selected}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        <Zap className="w-5 h-5" />
        Tạo buổi tập
      </button>
      <p className="text-center text-xs text-[#18181B]/25 mt-4">Bạn có thể tuỳ chỉnh danh sách bài tập sau khi xem đề xuất</p>
    </div>
  );

  if (step === 'loading') return (
    <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-[#FF5722] animate-spin" />
      <p className="text-[#18181B]/60 text-sm">Đang phân tích lịch sử tập luyện...</p>
    </div>
  );

  if (step === 'edit' || step === 'confirming') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-1">Buổi tập AI</p>
          <h1 className="text-xl font-black text-[#18181B]">{MG_LABEL[selected] || selected}</h1>
        </div>
        <button onClick={() => setStep('select')} className="text-xs text-[#18181B]/40 hover:text-[#18181B] transition">
          ← Đổi nhóm cơ
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4 mb-6">
        {exercises.map((ex, exIdx) => (
          <div key={ex._id ?? exIdx} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#18181B] text-sm">{ex.exercise_name}</p>
                {ex.overload_suggestion && (
                  <p className="text-xs text-green-600 mt-0.5">↑ {ex.overload_suggestion.note}</p>
                )}
              </div>
              <button onClick={() => removeExercise(exIdx)}
                className="text-[#18181B]/30 hover:text-red-500 transition ml-2 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {ex.sets.map((set, setIdx) => (
                <div key={setIdx} className="flex items-center gap-2 text-sm">
                  <span className="text-[#18181B]/40 w-12 shrink-0">Set {setIdx + 1}</span>
                  <input
                    type="number"
                    value={set.reps}
                    min="1"
                    onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    className="w-16 text-center border border-[#18181B]/20 rounded-lg py-1 text-sm font-bold focus:outline-none focus:border-[#FF5722]"
                  />
                  <span className="text-[#18181B]/40">reps</span>
                  <span className="text-[#18181B]/20">×</span>
                  <input
                    type="number"
                    value={set.weight}
                    min="0"
                    step="0.5"
                    onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    className="w-20 text-center border border-[#18181B]/20 rounded-lg py-1 text-sm font-bold focus:outline-none focus:border-[#FF5722]"
                  />
                  <span className="text-[#18181B]/40">kg</span>
                  {ex.sets.length > 1 && (
                    <button onClick={() => removeSet(exIdx, setIdx)}
                      className="text-[#18181B]/20 hover:text-red-400 transition ml-auto">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addSet(exIdx)}
              className="mt-2 text-xs text-[#FF5722]/70 hover:text-[#FF5722] flex items-center gap-1 transition">
              <Plus className="w-3 h-3" /> Thêm set
            </button>
          </div>
        ))}
      </div>

      <button onClick={openAddModal}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#18181B]/20 text-[#18181B]/50 hover:border-[#FF5722]/40 hover:text-[#FF5722] transition flex items-center justify-center gap-2 text-sm font-medium mb-4">
        <Plus className="w-4 h-4" /> Thêm bài tập
      </button>

      <button onClick={handleConfirm} disabled={exercises.length === 0 || step === 'confirming'}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        {step === 'confirming' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
        ) : (
          <><Zap className="w-5 h-5" /> Bắt đầu buổi tập ({exercises.length} bài)</>
        )}
      </button>

      {/* Add exercise modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#18181B]">Thêm bài tập</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-[#18181B]/40" /></button>
            </div>
            {templates.length === 0 ? (
              <p className="text-[#18181B]/50 text-sm text-center py-4">Không có bài tập nào khác trong danh mục này</p>
            ) : (
              <div className="space-y-2">
                {templates.map(tmpl => (
                  <button key={tmpl.exercise_template_id} onClick={() => addFromTemplate(tmpl)}
                    className="w-full text-left p-3 rounded-xl border border-[#18181B]/10 hover:border-[#FF5722]/40 transition">
                    <p className="font-medium text-[#18181B] text-sm">{tmpl.exercise_name}</p>
                    <p className="text-xs text-[#18181B]/40">{tmpl.default_sets}×{tmpl.default_reps} · {tmpl.equipment}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
```

- [ ] **Step 2: Verify no import errors**

```bash
cd FE
npx vite build 2>&1 | tail -20
```
Expected: Build completes without errors. Warnings are OK.

- [ ] **Step 3: Commit**

```bash
git add FE/src/pages/member/journey/JourneySessionPage.jsx
git commit -m "feat: rebuild JourneySessionPage with AI generate → edit → confirm flow"
```

---

## Task 6: Push and Deploy

- [ ] **Step 1: Verify all tests pass**

```bash
cd BE
pytest tests/ -v
```
Expected: All tests pass.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 3: Run migration on production**

On Render, go to the backend service → **Shell** tab, run:
```bash
alembic upgrade head
```
Expected: `Running upgrade 003_create_guests_vouchers -> 004_ai_workout_engine`

- [ ] **Step 4: Smoke test generate endpoint**

```bash
# Replace <TOKEN> with a real member token from /api/auth/login
curl -X POST https://be-y3gy.onrender.com/api/gym/sessions/generate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"muscle_group": "chest", "date": "2026-06-25"}'
```
Expected: `{"success": true, "data": {"source": "rule_based", "program_day_id": null, "suggested_exercises": [...]}}` with 5 exercises.

- [ ] **Step 5: Smoke test confirm endpoint**

```bash
curl -X POST https://be-y3gy.onrender.com/api/gym/sessions/confirm \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-06-25",
    "muscle_group": "chest",
    "exercises": [
      {"exercise_name": "Bench Press", "muscle_group": "chest", "sets": [{"reps": 10, "weight": 60}], "was_modified": false}
    ],
    "customization_log": {}
  }'
```
Expected: `{"success": true, "data": {"session_id": <int>}}`

---

## Self-Review Notes

- **Spec § 3 Phase 1 columns:** All 6 new columns covered in Task 1 migration + Task 2 models ✓
- **Spec § 4 generate endpoint:** Rule-based generation in Task 3 + Task 4 ✓
- **Spec § 4 confirm endpoint:** Atomically creates session + exercises in Task 4 ✓
- **Spec § 5 frontend flow:** select → loading → edit → confirm in Task 5 ✓
- **Spec § 5 overload badge:** `↑ {note}` shown when `overload_suggestion` exists ✓
- **Spec § 5 add exercise:** Template modal from `/exercise-templates` endpoint ✓
- **Spec § 6 progressive overload:** fully completed → +2.5kg, incomplete → +1 rep, no history → defaults ✓
- **Spec § 6 custom mapping:** `custom` → `full_body` in both generator and `exercise-templates` endpoint ✓
- **back_shoulders enum gap:** PostgreSQL enum extended in migration; Python enum updated in model ✓
- **Backward compat:** Old `/sessions` and `/sessions/{id}/exercises` endpoints untouched ✓
- **FK safety:** Phase 1 adds INT nullable columns without FK constraints (Phase 2 adds constraints) ✓
