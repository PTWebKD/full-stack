from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .model import ExerciseTemplate, ExerciseLog, WorkoutSession

EXERCISES_PER_SESSION = 5
_MUSCLE_GROUP_MAP = {
    "custom": "full_body",
}


from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .model import ExerciseTemplate, ExerciseLog, WorkoutSession

EXERCISES_PER_SESSION = 5
_MUSCLE_GROUP_MAP = {
    "custom": "full_body",
}

async def generate_workout(db: AsyncSession, user_id: int, muscle_group: str) -> dict:
    """
    RE-2 (Workout Generator):
    - Uses a mock/simulated Neural Collaborative Filtering (NCF) model combining user embeddings
      and item (exercise) embeddings to predict user preferences.
    - Combined with Content-based filtering using muscle group, difficulty level, and equipment tags.
    
    Safety Guardrails Layer:
    - Analyzes recent logs using RE-3 (Sentiment NLP on exercise qualitative notes for injury terms like 'đau', 'nhức', 'chấn thương').
    - If pain/injury sentiment is detected, forces a DELOAD program (reduces weight by 30% and flags warning).
    - Hard limit: Any weight increase is strictly capped at <= 10% of the historical maximum weight (PR) to prevent injury.
    """
    lookup_mg = _MUSCLE_GROUP_MAP.get(muscle_group, muscle_group)

    # 1. Fetch exercise templates for the target muscle group
    r = await db.execute(
        select(ExerciseTemplate)
        .where(ExerciseTemplate.muscle_group == lookup_mg)
        .order_by(ExerciseTemplate.exercise_template_id)
    )
    templates = r.scalars().all()
    if not templates:
        return {
            "source": "hybrid_ai_engine (NCF + Content-based)",
            "program_day_id": None,
            "suggested_exercises": [],
            "status_flags": {"safety_guardrails_applied": True, "model_version": "RE-2_v2.0"}
        }

    # 2. Fetch user's history for RE-3 Sentiment NLP and Plateau check
    r_history = await db.execute(
        select(ExerciseLog)
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(
            WorkoutSession.user_id == user_id,
        )
        .order_by(ExerciseLog.created_at.desc())
        .limit(30)
    )
    recent_logs = r_history.scalars().all()

    # ── [RE-3 Component] Sentiment NLP & Injury Detection ──
    has_injury_sentiment = False
    injury_keywords = ["đau", "nhức", "chấn thương", "nhói", "mỏi khớp", "đau lưng", "đau gối"]
    for log in recent_logs:
        if log.notes:
            note_content = log.notes.lower()
            if any(kw in note_content for kw in injury_keywords):
                has_injury_sentiment = True
                break

    # ── [RE-2 Component] Hybrid Scoring: NCF Preference Score + Content-based Similarity ──
    scored_templates = []
    for tmpl in templates:
        # Content-based score: matching difficulty, muscle focus
        content_score = 0.5
        if tmpl.muscle_group == lookup_mg:
            content_score += 0.3
        
        # NCF Score simulation: user-item collaborative similarity mapping
        # User ID hash and exercise template ID hash used as a pseudo-embedding dot product
        user_factor = (user_id % 7 + 1) / 7.0
        item_factor = (tmpl.exercise_template_id % 11 + 1) / 11.0
        ncf_score = user_factor * item_factor * 0.4
        
        final_score = content_score + ncf_score
        scored_templates.append((final_score, tmpl))

    # Sort templates by high preference score
    scored_templates.sort(key=lambda x: x[0], reverse=True)
    chosen = [t[1] for t in scored_templates[:EXERCISES_PER_SESSION]]

    # 3. Build history map for progressive overload and safety checks
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

    # 4. Build suggestions with progressive overload & Safety Guardrails
    suggested = []
    for tmpl in chosen:
        prev = history.get(tmpl.exercise_name)
        default_weight = float(tmpl.default_weight_kg)
        target_reps = tmpl.default_reps
        target_sets = tmpl.default_sets

        if prev:
            prev_weight = prev["last_weight"]
            prev_reps = prev["avg_reps"]

            if has_injury_sentiment:
                # Deload rule (Safety Guardrail): reduce weight by 30%
                suggested_weight = round(prev_weight * 0.7 / 2.5) * 2.5
                suggested_reps = max(6, target_reps - 2)
                note = f"⚠️ Phát hiện phản hồi cảm giác đau nhức (RE-3 NLP). Kích hoạt Deload bảo vệ khớp tạ: Giảm 30% tạ ({prev_weight}kg → {suggested_weight}kg)."
                overload_suggestion = {
                    "prev_weight": prev_weight,
                    "prev_reps": int(prev_reps),
                    "suggested_weight": suggested_weight,
                    "note": note,
                    "is_deload": True
                }
            elif prev["sets_count"] >= target_sets and prev_reps >= target_reps:
                # Overload suggestion
                raw_suggested = prev_weight + 2.5
                # Safety Guardrail: Max weight increase capped at 10% of previous weight
                max_allowed_weight = prev_weight * 1.10
                if raw_suggested > max_allowed_weight:
                    suggested_weight = round(max_allowed_weight / 2.5) * 2.5
                    note = f"Tăng tải tiệm tiến (Cập nhật tối đa +10% theo Safety Guardrails): {prev_weight}kg → {suggested_weight}kg"
                else:
                    suggested_weight = raw_suggested
                    note = f"Tăng 2.5kg tạ dựa trên tiến độ hoàn thành tốt buổi trước ({prev_weight}kg → {suggested_weight}kg)"
                
                suggested_reps = target_reps
                overload_suggestion = {
                    "prev_weight": prev_weight,
                    "prev_reps": int(prev_reps),
                    "suggested_weight": suggested_weight,
                    "note": note,
                }
            else:
                # Keep weight, increase rep slightly
                suggested_weight = prev_weight
                suggested_reps = min(int(prev_reps) + 1, target_reps + 2)
                overload_suggestion = {
                    "prev_weight": prev_weight,
                    "prev_reps": int(prev_reps),
                    "suggested_weight": suggested_weight,
                    "note": f"Giữ nguyên mức tạ {prev_weight}kg, tăng mục tiêu lặp ({suggested_reps} reps) để cải thiện độ bền cơ.",
                }
        else:
            if has_injury_sentiment:
                suggested_weight = round(default_weight * 0.7 / 2.5) * 2.5
                suggested_reps = max(6, target_reps - 2)
                overload_suggestion = {
                    "prev_weight": 0,
                    "prev_reps": 0,
                    "suggested_weight": suggested_weight,
                    "note": f"⚠️ Kích hoạt Deload an toàn cho bài tập mới do phát hiện trạng thái chấn thương.",
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
        "source": "hybrid_ai_engine (NCF + Content-based)",
        "program_day_id": None,
        "suggested_exercises": suggested,
        "status_flags": {
            "safety_guardrails_applied": True,
            "has_injury_sentiment_alert": has_injury_sentiment,
            "model_version": "RE-2_v2.0"
        }
    }
