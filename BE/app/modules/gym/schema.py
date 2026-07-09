from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from .model import SessionStatus, MuscleGroup, MembershipStatus


class GymOut(BaseModel):
    gym_id: int
    owner_id: int
    name: str
    address: str
    phone: Optional[str] = None
    logo_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class GymCreate(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    logo_url: Optional[str] = None


class MembershipCreate(BaseModel):
    gym_id: int
    plan_name: str
    start_date: date
    end_date: date
    amount_paid: Decimal
    payment_method: Optional[str] = None
    auto_renew: bool = False


class MembershipOut(BaseModel):
    membership_id: int
    user_id: int
    gym_id: int
    plan_name: str
    start_date: date
    end_date: date
    status: MembershipStatus
    amount_paid: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}


class SetData(BaseModel):
    reps: int
    weight: float
    rpe: Optional[int] = None


class ExerciseCreate(BaseModel):
    exercise_name: str
    muscle_group: MuscleGroup
    sets: List[SetData]
    notes: Optional[str] = None


class ExerciseOut(BaseModel):
    log_id: int
    exercise_name: str
    muscle_group: MuscleGroup
    sets: list
    is_pr: bool
    notes: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SessionCreate(BaseModel):
    date: date
    gym_id: Optional[int] = None
    duration_min: Optional[int] = None
    notes: Optional[str] = None


class SessionOut(BaseModel):
    session_id: int
    user_id: int
    gym_id: Optional[int] = None
    date: date
    duration_min: Optional[int] = None
    status: SessionStatus
    notes: Optional[str] = None
    xp_earned: int = 0
    completed_at: Optional[datetime] = None
    exercises: List[ExerciseOut] = []
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("exercises", mode="before")
    @classmethod
    def safe_exercises(cls, v):
        # Catch MissingGreenlet when relationship not eagerly loaded
        try:
            return list(v) if v is not None else []
        except Exception:
            return []


class SessionCompleteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    session: SessionOut
    xp_earned: int
    new_streak: int
    badges_earned: list[str]


class MuscleGroupSuggestion(BaseModel):
    suggested_muscle_group: str
    reason: str


class AnnouncementCreate(BaseModel):
    title: str
    body: str
    priority: str = "medium"


class AnnouncementOut(BaseModel):
    announcement_id: int
    gym_id: int
    title: str
    body: str
    priority: str
    created_at: datetime
    model_config = {"from_attributes": True}


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


class CareRecommendationOut(BaseModel):
    rec_id: int
    gym_id: int
    member_id: int
    member_name: str
    member_phone: Optional[str] = None
    type: str
    priority: str
    reason: Optional[str] = None
    status: str
    result: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class CareRecommendationUpdate(BaseModel):
    status: str
    result: Optional[str] = None


# --- Progress / Plateau AI Engine (RE-3) ---

class ProgressExerciseOption(BaseModel):
    exercise_name: str
    muscle_group: str
    sessions_count: int
    last_date: date


class ProgressHistoryPoint(BaseModel):
    date: date
    max_weight: float
    total_volume: float
    avg_rpe: Optional[float] = None
    is_pr: bool = False


class ProgressDiagnosis(BaseModel):
    status: str  # 'plateau' | 'overtraining' | 'undertraining' | 'steady' | 'insufficient_data'
    severity: str  # 'success' | 'warning' | 'danger' | 'info'
    title: str
    detail: str


class ProgressAction(BaseModel):
    id: str
    label: str


class ProgressStats(BaseModel):
    max_weight: float
    progress_pct: float
    sessions: int


class ProgressMeta(BaseModel):
    avg_rpe_recent: Optional[float] = None
    days_since_last_pr: Optional[int] = None
    sessions_last_14_days: int
    model_version: str


class ProgressResponse(BaseModel):
    exercise_name: str
    muscle_group: Optional[str] = None
    unit: str = "kg"
    history: List[ProgressHistoryPoint]
    stats: ProgressStats
    diagnosis: ProgressDiagnosis
    actions: List[ProgressAction]
    meta: ProgressMeta


class ProgressActionRequest(BaseModel):
    exercise_name: str
    action_id: str


class ProgressActionResult(BaseModel):
    action_id: str
    applied: bool
    message: str
