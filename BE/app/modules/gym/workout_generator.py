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
