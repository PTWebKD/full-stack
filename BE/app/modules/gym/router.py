from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_gym_owner
from app.modules.users.model import User
from .model import Gym
from .schema import (
    GymCreate, GymOut, MembershipCreate, MembershipOut,
    SessionCreate, SessionOut, ExerciseCreate, ExerciseOut,
    AnnouncementCreate, AnnouncementOut,
    GenerateRequest, ConfirmRequest, ExerciseTemplateOut,
    CareRecommendationOut, CareRecommendationUpdate,
    ProgressActionRequest,
)
from .workout_generator import generate_workout
from . import progress_engine
from .model import ExerciseTemplate
from . import service

router = APIRouter()
owner_router = APIRouter()


def ok(data):
    return {"success": True, "data": data}


# 1. GET / — list all gyms (no auth)
@router.get("/")
async def list_gyms(db: AsyncSession = Depends(get_db)):
    gyms = await service.list_gyms(db)
    return ok([GymOut.model_validate(g).model_dump() for g in gyms])


# 2. GET /mine — get the gym owned by current gym_owner (MUST be before /{gym_id})
@router.get("/mine")
async def my_gym(
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(Gym).where(Gym.owner_id == user.user_id))
    g = r.scalar_one_or_none()
    if not g:
        from app.core.dependencies import err
        err("NOT_FOUND", "No gym found for this owner", 404)
    return ok(GymOut.model_validate(g).model_dump())


@router.get("/mine/members")
async def my_gym_members(
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    from app.modules.gym.schema import GymMemberOut
    # For a single-gym system, any Gym Owner sees all members across the system.
    members = await service.list_gym_members(db, gym_id=None)
    return ok([GymMemberOut(**m).model_dump() for m in members])


# 3. GET /memberships/my
@router.get("/memberships/my")
async def my_memberships(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ms = await service.get_my_memberships(db, user.user_id)
    return ok([MembershipOut.model_validate(m).model_dump() for m in ms])


# 4. POST /memberships
@router.post("/memberships")
async def buy_membership(
    data: MembershipCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    m = await service.buy_membership(db, user, data)
    return ok(MembershipOut.model_validate(m).model_dump())


# 5. POST /sessions — log a new session
@router.post("/sessions")
async def log_session(
    data: SessionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    s = await service.log_session(db, user, data)
    # Build response manually — avoid model_validate on unflushed ORM object
    # which triggers async lazy-load of 'exercises' (MissingGreenlet crash)
    return ok({
        "session_id": s.session_id,
        "user_id": s.user_id,
        "gym_id": s.gym_id,
        "date": s.date.isoformat(),
        "duration_min": s.duration_min,
        "status": s.status.value,
        "notes": s.notes,
        "xp_earned": s.xp_earned or 0,
        "completed_at": s.completed_at,
        "exercises": [],
        "created_at": s.created_at.isoformat(),
    })


# 6. GET /sessions/my
@router.get("/sessions/my")
async def my_sessions(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    sessions = await service.get_my_sessions(db, user.user_id)
    return ok([SessionOut.model_validate(s).model_dump() for s in sessions])


# 7. GET /sessions/suggest — MUST be before /sessions/{session_id}
@router.get("/sessions/suggest")
async def suggest_muscle(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await service.suggest_muscle_group(db, user.user_id)
    return ok(result)


# 7b. POST /sessions/generate — AI-generate suggested exercises
@router.post("/sessions/generate")
async def generate_session(
    data: GenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # data.date reserved for Phase 2 (active program day lookup) — not used in rule-based generation
    result = await generate_workout(db, user.user_id, data.muscle_group)
    return ok(result)


# 7c. POST /sessions/confirm — create session + all exercises atomically
@router.post("/sessions/confirm")
async def confirm_session(
    data: ConfirmRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from .model import WorkoutSession, ExerciseLog, MuscleGroup

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
        overload_data = dict(ex.overload_suggestion) if ex.overload_suggestion else {}
        if ex.was_modified:
            overload_data["was_modified"] = True
        log = ExerciseLog(
            session_id=session.session_id,
            exercise_name=ex.exercise_name,
            muscle_group=mg,
            sets=[s.model_dump() for s in ex.sets],
            overload_suggestion=overload_data or None,
        )
        db.add(log)

    await db.flush()
    return ok({"session_id": session.session_id})


# 7d. GET /exercise-templates — list templates by muscle group
@router.get("/exercise-templates")
async def list_exercise_templates(
    muscle_group: str = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import select as sa_select
    q = sa_select(ExerciseTemplate)
    if muscle_group:
        lookup = "full_body" if muscle_group == "custom" else muscle_group
        q = q.where(ExerciseTemplate.muscle_group == lookup)
    r = await db.execute(q.order_by(ExerciseTemplate.exercise_template_id))
    templates = r.scalars().all()
    return ok([ExerciseTemplateOut.model_validate(t).model_dump() for t in templates])


# 8. GET /sessions/{session_id} — get a single session (NEW)
@router.get("/sessions/{session_id}")
async def get_session(
    session_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session = await service.get_session(db, user.user_id, session_id)
    return ok(SessionOut.model_validate(session).model_dump())


# 9. POST /sessions/{session_id}/complete
@router.post("/sessions/{session_id}/complete")
async def complete_session(
    session_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await service.complete_session(db, user, session_id)
    return ok({
        "session": SessionOut.model_validate(result["session"]).model_dump(),
        "xp_earned": result["xp_earned"],
        "new_streak": result["new_streak"],
        "badges_earned": result["badges_earned"],
    })


# 10. POST /sessions/{session_id}/exercises
@router.post("/sessions/{session_id}/exercises")
async def log_exercise(
    session_id: int,
    data: ExerciseCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    log = await service.log_exercise(db, user, session_id, data)
    return ok(ExerciseOut.model_validate(log).model_dump())


# 10b. GET /progress/exercises — distinct exercises the member has logged (for the selector)
@router.get("/progress/exercises")
async def progress_exercises(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    options = await progress_engine.list_progress_exercises(db, user.user_id)
    return ok(options)


# 10c. GET /progress — RE-3 Progress & Plateau AI analysis for one exercise
@router.get("/progress")
async def get_progress(
    exercise_name: str = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await progress_engine.analyze_progress(db, user.user_id, exercise_name)
    return ok(result)


# 10d. POST /progress/action — apply an AI suggestion (overload/deload/PT request/...)
@router.post("/progress/action")
async def apply_progress_action(
    data: ProgressActionRequest,
    user: User = Depends(get_current_user),
):
    result = progress_engine.apply_progress_action(data.action_id)
    return ok(result)


# 11. GET /records/my
@router.get("/records/my")
async def my_records(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    records = await service.get_my_records(db, user.user_id)
    return ok([ExerciseOut.model_validate(r).model_dump() for r in records])


# 12. GET /announcements (public)
@router.get("/announcements")
async def list_announcements(
    db: AsyncSession = Depends(get_db),
):
    r = await db.execute(select(Gym).order_by(Gym.gym_id.asc()))
    gym = r.scalars().first()
    if not gym:
        return ok([])
    anns = await service.get_gym_announcements(db, gym.gym_id)
    return ok([AnnouncementOut.model_validate(a).model_dump() for a in anns])


# 13. POST /announcements (gym_owner only)
@router.post("/announcements")
async def create_announcement(
    data: AnnouncementCreate,
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    ann = await service.create_announcement(db, user, data)
    return ok(AnnouncementOut.model_validate(ann).model_dump())


# 14. DELETE /announcements/{announcement_id} (gym_owner only)
@router.delete("/announcements/{announcement_id}")
async def delete_announcement(
    announcement_id: int,
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    await service.delete_announcement(db, user, announcement_id)
    return ok({"deleted": announcement_id})


# 15. GET /{gym_id} — MUST be last to avoid catching other paths (catch-all by int)
@router.get("/{gym_id}")
async def get_gym(gym_id: int, db: AsyncSession = Depends(get_db)):
    g = await service.get_gym(db, gym_id)
    return ok(GymOut.model_validate(g).model_dump())


# 16. POST / — create gym
@router.post("/")
async def create_gym(
    data: GymCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    gym = await service.create_gym(db, user, data)
    return ok(GymOut.model_validate(gym).model_dump())


# --- Gym Owner Care Queue Routes ---
@owner_router.get("/care-queue")
async def get_owner_care_queue(
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    recs = await service.get_care_queue(db, user)
    return ok(recs)


@owner_router.patch("/care-queue/{rec_id}")
async def update_owner_care_recommendation(
    rec_id: int,
    body: CareRecommendationUpdate,
    user: User = Depends(require_gym_owner),
    db: AsyncSession = Depends(get_db),
):
    rec = await service.update_care_recommendation(
        db, user, rec_id, body.status, body.result
    )
    return ok({"rec_id": rec.rec_id, "status": rec.status})
