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
    freeze_days_used = Column(Integer, default=0, nullable=False)
    cancel_scheduled_at = Column(DateTime, nullable=True)
    referral_bonus_applied = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


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
    is_pr_achieved = Column(Boolean, default=False, nullable=False)

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


class CareRecommendation(Base):
    __tablename__ = "care_recommendations"

    rec_id = Column(Integer, primary_key=True)
    gym_id = Column(Integer, ForeignKey("gyms.gym_id", ondelete="CASCADE"), nullable=False)
    member_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # 'renew_reminder', 'inactive_alert', 'upsell_plan', 'upsell_nutrition'
    priority = Column(String(20), nullable=False)  # 'HIGH', 'MEDIUM', 'LOW'
    reason = Column(Text)
    status = Column(String(20), nullable=False, default="pending")  # 'pending', 'handled'
    result = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ── schema_erd.sql Group 2: Membership plans, trial, freeze ──────────────────

class MembershipPlan(Base):
    """schema_erd.sql: MEMBERSHIP_PLANS — catalog of purchasable plans (Tháng/Năm)."""
    __tablename__ = "membership_plans"

    plan_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    duration_days = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True, nullable=False)


class FreeTrialPass(Base):
    """schema_erd.sql: FREE_TRIAL_PASSES — 7-day Free Trial issued to a Guest phone."""
    __tablename__ = "free_trial_passes"

    pass_id = Column(Integer, primary_key=True)
    phone = Column(String(15), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="active", nullable=False)
    activated_at = Column(DateTime, nullable=True)
    expired_at = Column(DateTime, nullable=True)


class GymTour(Base):
    """schema_erd.sql: GYM_TOURS — booked in-person tour slot for a Guest."""
    __tablename__ = "gym_tours"

    tour_id = Column(Integer, primary_key=True)
    phone = Column(String(15), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String(30), default="scheduled", nullable=False)


class MembershipFreeze(Base):
    """schema_erd.sql: MEMBERSHIP_FREEZES — a member's request to pause their plan."""
    __tablename__ = "membership_freezes"

    freeze_id = Column(Integer, primary_key=True)
    membership_id = Column(Integer, ForeignKey("gym_memberships.membership_id", ondelete="CASCADE"), nullable=False)
    freeze_type = Column(String(30), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    proof_document_url = Column(String(500), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="pending", nullable=False)


# ── schema_erd.sql Group 3: Programs, personal records, transformation goals ──

class Exercise(Base):
    """schema_erd.sql: EXERCISES — canonical exercise catalog (name + muscle group)."""
    __tablename__ = "exercises"

    exercise_id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    muscle_group = Column(String(50), nullable=False)
    category = Column(String(50), nullable=True)
    equipment_required = Column(String(100), nullable=True)
    video_url = Column(String(500), nullable=True)


class WorkoutProgram(Base):
    """schema_erd.sql: WORKOUT_PROGRAMS — a named multi-day training program."""
    __tablename__ = "workout_programs"

    program_id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    goal_type = Column(String(30), nullable=False)
    fitness_level = Column(String(30), nullable=False)
    days_per_week = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)


class ProgramDay(Base):
    """schema_erd.sql: PROGRAM_DAYS — one training day within a WorkoutProgram."""
    __tablename__ = "program_days"

    day_id = Column(Integer, primary_key=True)
    program_id = Column(Integer, ForeignKey("workout_programs.program_id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False)
    focus_muscle_group = Column(String(50), nullable=True)


class ProgramExercise(Base):
    """schema_erd.sql: PROGRAM_EXERCISES — target sets/reps for one exercise on a ProgramDay."""
    __tablename__ = "program_exercises"

    program_exercise_id = Column(Integer, primary_key=True)
    day_id = Column(Integer, ForeignKey("program_days.day_id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.exercise_id", ondelete="CASCADE"), nullable=False)
    target_sets = Column(Integer, nullable=False)
    target_reps_min = Column(Integer, nullable=False)
    target_reps_max = Column(Integer, nullable=False)


class MemberProgram(Base):
    """schema_erd.sql: MEMBER_PROGRAMS — a member's enrollment in a WorkoutProgram."""
    __tablename__ = "member_programs"

    member_program_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    program_id = Column(Integer, ForeignKey("workout_programs.program_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), default="active", nullable=False)
    completion_pct = Column(Numeric(5, 2), default=0, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)


class CheckIn(Base):
    """schema_erd.sql: CHECK_INS — a member's physical check-in/out at a gym."""
    __tablename__ = "check_ins"

    checkin_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    gym_id = Column(Integer, ForeignKey("gyms.gym_id", ondelete="CASCADE"), nullable=False)
    membership_id = Column(Integer, ForeignKey("gym_memberships.membership_id", ondelete="SET NULL"), nullable=True)
    trial_pass_id = Column(Integer, ForeignKey("free_trial_passes.pass_id", ondelete="SET NULL"), nullable=True)
    checkin_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    checkout_time = Column(DateTime, nullable=True)


class SetLog(Base):
    """schema_erd.sql: SET_LOGS — one logged set within an ExerciseLog (normalized form
    of the JSON `sets` blob already stored on exercise_logs.sets for the live app)."""
    __tablename__ = "set_logs"

    set_id = Column(Integer, primary_key=True)
    log_id = Column(Integer, ForeignKey("exercise_logs.log_id", ondelete="CASCADE"), nullable=False)
    set_number = Column(Integer, nullable=False)
    weight_kg = Column(Numeric(6, 2), nullable=True)
    reps_target = Column(Integer, nullable=True)
    reps_actual = Column(Integer, nullable=True)
    rest_seconds = Column(Integer, nullable=True)


class PersonalRecord(Base):
    """schema_erd.sql: PERSONAL_RECORDS — one PR event for a user+exercise."""
    __tablename__ = "personal_records"

    pr_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.exercise_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Integer, ForeignKey("workout_sessions.session_id", ondelete="SET NULL"), nullable=True)
    pr_value = Column(Numeric(8, 2), nullable=False)
    previous_value = Column(Numeric(8, 2), nullable=True)
    improvement_pct = Column(Numeric(5, 2), nullable=True)
    achieved_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class TransformationGoal(Base):
    """schema_erd.sql: TRANSFORMATION_GOALS — the AI Goal Engine onboarding answers."""
    __tablename__ = "transformation_goals"

    goal_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    goal_type = Column(String(30), nullable=False)
    fitness_level = Column(String(30), nullable=False)
    days_per_week = Column(Integer, nullable=False)
    injured_areas = Column(String(255), nullable=True)
    food_allergies = Column(String(255), nullable=True)
    dietary_preference = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


# ── schema_erd.sql Group 5 (CRM): Recommendations, Care Follow-ups ───────────

class Recommendation(Base):
    """schema_erd.sql: RECOMMENDATIONS — AI/rule-based suggested action for a member."""
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    rule_code = Column(String(50), nullable=False)
    priority = Column(Integer, default=0, nullable=False)
    suggested_action = Column(String(255), nullable=False)
    status = Column(String(30), default="pending", nullable=False)
    dismiss_reason = Column(String(255), nullable=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class CareFollowup(Base):
    """schema_erd.sql: CARE_FOLLOWUPS — a staff follow-up task tied to a session/member."""
    __tablename__ = "care_followups"

    followup_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    session_id = Column(Integer, ForeignKey("workout_sessions.session_id", ondelete="SET NULL"), nullable=True)
    assigned_staff_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="pending", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
