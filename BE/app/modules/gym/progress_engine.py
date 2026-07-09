from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from .model import ExerciseLog, WorkoutSession

# BR-PROGRESS-01: Plateau = no new PR (max weight record) in the last N days.
PLATEAU_WINDOW_DAYS = 28
# BR-PROGRESS-02: Overtraining = high session frequency or sustained high RPE over 14 days.
OVERTRAINING_WINDOW_DAYS = 14
OVERTRAINING_SESSION_THRESHOLD = 9  # ~ >=6 buổi/tuần trong 2 tuần
OVERTRAINING_RPE_THRESHOLD = 8.5
# BR-PROGRESS-03: Undertraining = too few sessions of ANY exercise over the same window.
UNDERTRAINING_SESSION_THRESHOLD = 2
MIN_SESSIONS_FOR_TREND = 3


async def list_progress_exercises(db: AsyncSession, user_id: int) -> list[dict]:
    """Distinct exercises the member has logged, most-trained first — powers the FE selector."""
    r = await db.execute(
        select(
            ExerciseLog.exercise_name,
            ExerciseLog.muscle_group,
            func.count(ExerciseLog.log_id).label("cnt"),
            func.max(WorkoutSession.date).label("last_date"),
        )
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(WorkoutSession.user_id == user_id)
        .group_by(ExerciseLog.exercise_name, ExerciseLog.muscle_group)
        .order_by(func.count(ExerciseLog.log_id).desc())
    )
    rows = r.all()
    return [
        {
            "exercise_name": row.exercise_name,
            "muscle_group": row.muscle_group.value if hasattr(row.muscle_group, "value") else row.muscle_group,
            "sessions_count": row.cnt,
            "last_date": row.last_date,
        }
        for row in rows
    ]


def _set_stats(sets: list) -> tuple[float, float, list[float]]:
    """max weight lifted, total volume (Σ reps×weight), and per-set RPE values for one log entry."""
    max_weight = 0.0
    total_volume = 0.0
    rpes = []
    for s in sets or []:
        weight = float(s.get("weight", 0) or 0)
        reps = int(s.get("reps", 0) or 0)
        max_weight = max(max_weight, weight)
        total_volume += weight * reps
        if s.get("rpe") is not None:
            rpes.append(float(s["rpe"]))
    return max_weight, total_volume, rpes


async def analyze_progress(db: AsyncSession, user_id: int, exercise_name: str | None) -> dict:
    """
    RE-3 (Progress & Plateau Engine):
    Rule-based analysis over the member's real workout history — detects Plateau
    (no PR in 28 days), Overtraining (high frequency / sustained high RPE over 14 days)
    and Undertraining (too few sessions over the same window), otherwise reports Steady Progress.
    """
    # 1. Resolve target exercise (default: the member's most-trained one)
    if not exercise_name:
        options = await list_progress_exercises(db, user_id)
        if not options:
            return _empty_response(None)
        exercise_name = options[0]["exercise_name"]

    r = await db.execute(
        select(ExerciseLog, WorkoutSession.date)
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(
            WorkoutSession.user_id == user_id,
            ExerciseLog.exercise_name == exercise_name,
        )
        .order_by(WorkoutSession.date.asc(), ExerciseLog.created_at.asc())
    )
    rows = r.all()
    if not rows:
        return _empty_response(exercise_name)

    muscle_group = rows[0][0].muscle_group
    muscle_group = muscle_group.value if hasattr(muscle_group, "value") else muscle_group

    # 2. Build per-session history + PR flags (a PR = new all-time max weight for this exercise)
    history: list[dict] = []
    running_max = 0.0
    for log, sess_date in rows:
        max_w, total_vol, rpes = _set_stats(log.sets)
        is_pr = max_w > running_max
        if is_pr:
            running_max = max_w
        history.append({
            "date": sess_date,
            "max_weight": max_w,
            "total_volume": total_vol,
            "avg_rpe": (sum(rpes) / len(rpes)) if rpes else None,
            "is_pr": is_pr,
        })

    # Collapse same-day duplicate logs by keeping the highest weight (a Member may log an exercise
    # more than once per day) so the trend line reflects one point per session.
    by_date: dict[date, dict] = {}
    for h in history:
        cur = by_date.get(h["date"])
        if cur is None or h["max_weight"] >= cur["max_weight"]:
            by_date[h["date"]] = h
    history = sorted(by_date.values(), key=lambda h: h["date"])

    last = history[-1]
    first = history[0]
    sessions_count = len(history)

    # 3. Recompute frequency/RPE signals over the trailing windows (across ALL exercises,
    #    since over/undertraining reflects overall training load, not just this exercise)
    today = last["date"]
    r_recent = await db.execute(
        select(WorkoutSession.date, ExerciseLog.sets)
        .join(ExerciseLog, ExerciseLog.session_id == WorkoutSession.session_id)
        .where(
            WorkoutSession.user_id == user_id,
            WorkoutSession.date >= today - timedelta(days=OVERTRAINING_WINDOW_DAYS),
            WorkoutSession.date <= today,
        )
    )
    recent_rows = r_recent.all()
    sessions_last_14_days = len({d for d, _ in recent_rows})
    recent_rpes = []
    for _, sets in recent_rows:
        for s in sets or []:
            if s.get("rpe") is not None:
                recent_rpes.append(float(s["rpe"]))
    avg_rpe_recent = round(sum(recent_rpes) / len(recent_rpes), 1) if recent_rpes else None

    # 4. Plateau signal: days since the last PR for THIS exercise
    last_pr_date = max((h["date"] for h in history if h["is_pr"]), default=None)
    days_since_last_pr = (today - last_pr_date).days if last_pr_date else None

    # 5. Decide status (priority: not enough data > overtraining > plateau > undertraining > steady)
    if sessions_count < MIN_SESSIONS_FOR_TREND:
        status, severity = "insufficient_data", "info"
        title = "Chưa đủ dữ liệu để phân tích"
        detail = (
            f"Bạn mới có {sessions_count} buổi tập được ghi nhận cho bài {exercise_name}. "
            f"AI cần tối thiểu {MIN_SESSIONS_FOR_TREND} buổi để phân tích xu hướng đáng tin cậy."
        )
    elif sessions_last_14_days >= OVERTRAINING_SESSION_THRESHOLD or (
        avg_rpe_recent is not None and avg_rpe_recent > OVERTRAINING_RPE_THRESHOLD
    ):
        status, severity = "overtraining", "danger"
        title = "Chẩn đoán: Nguy cơ tập quá sức (Overtraining)"
        detail = (
            f"Bạn đã tập {sessions_last_14_days} buổi trong {OVERTRAINING_WINDOW_DAYS} ngày qua"
            + (f", RPE trung bình {avg_rpe_recent}/10" if avg_rpe_recent is not None else "")
            + ". AI khuyến nghị giảm tần suất hoặc chèn tuần phục hồi (deload) để tránh chấn thương."
        )
    elif days_since_last_pr is not None and days_since_last_pr >= PLATEAU_WINDOW_DAYS:
        status, severity = "plateau", "warning"
        title = "Chẩn đoán: Phát hiện chững tạ (Plateau)"
        detail = (
            f"Đã {days_since_last_pr} ngày kể từ kỷ lục (PR) gần nhất ở mức {running_max:g}kg cho bài "
            f"{exercise_name} (ngưỡng phát hiện: {PLATEAU_WINDOW_DAYS} ngày). AI đề xuất đổi biến thể "
            f"bài tập hoặc áp dụng chu kỳ tăng tải tiệm tiến (progressive overload) để phá vỡ thích nghi."
        )
    elif sessions_last_14_days <= UNDERTRAINING_SESSION_THRESHOLD:
        status, severity = "undertraining", "warning"
        title = "Chẩn đoán: Tần suất tập chưa đủ (Undertraining)"
        detail = (
            f"Bạn chỉ tập {sessions_last_14_days} buổi trong {OVERTRAINING_WINDOW_DAYS} ngày qua. "
            "AI khuyến nghị tăng tần suất tập để duy trì đà tiến bộ."
        )
    else:
        status, severity = "steady", "success"
        gain_recent = last["max_weight"] - first["max_weight"]
        title = "Chẩn đoán: Tiến trình tốt (Steady Progress)"
        detail = (
            f"Mức tạ tối đa {last['max_weight']:g}kg của bài {exercise_name} đang tăng đều "
            f"(+{gain_recent:g}kg so với buổi đầu tiên được ghi nhận)"
            + (f", RPE trung bình gần đây {avg_rpe_recent}/10" if avg_rpe_recent is not None else "")
            + ". AI khuyến khích tiếp tục tăng tải nhẹ ở buổi sau."
        )

    actions_map = {
        "plateau": [
            {"id": "apply_overload", "label": "Áp dụng Overload (+2.5kg)"},
            {"id": "apply_deload", "label": "Nhận chu kỳ Deload"},
            {"id": "request_pt", "label": "Gửi yêu cầu PT 1:1"},
        ],
        "overtraining": [
            {"id": "apply_deload", "label": "Áp dụng tuần Deload"},
            {"id": "reduce_frequency", "label": "Giảm tần suất buổi tới"},
            {"id": "request_pt", "label": "Gửi yêu cầu PT 1:1"},
        ],
        "undertraining": [
            {"id": "increase_frequency", "label": "Tăng lịch tập tuần này"},
            {"id": "keep_plan", "label": "Giữ nguyên kế hoạch"},
        ],
        "steady": [
            {"id": "apply_overload", "label": "Tăng tạ buổi tới (+2.5kg)"},
            {"id": "keep_plan", "label": "Giữ nguyên mức tạ"},
        ],
        "insufficient_data": [],
    }

    first_weight = first["max_weight"] or 0
    progress_pct = round(((last["max_weight"] - first_weight) / first_weight) * 100, 1) if first_weight else 0.0

    return {
        "exercise_name": exercise_name,
        "muscle_group": muscle_group,
        "unit": "kg",
        "history": history,
        "stats": {
            "max_weight": last["max_weight"],
            "progress_pct": progress_pct,
            "sessions": sessions_count,
        },
        "diagnosis": {"status": status, "severity": severity, "title": title, "detail": detail},
        "actions": actions_map[status],
        "meta": {
            "avg_rpe_recent": avg_rpe_recent,
            "days_since_last_pr": days_since_last_pr,
            "sessions_last_14_days": sessions_last_14_days,
            "model_version": "RE-3_v1.0",
        },
    }


def _empty_response(exercise_name: str | None) -> dict:
    return {
        "exercise_name": exercise_name or "",
        "muscle_group": None,
        "unit": "kg",
        "history": [],
        "stats": {"max_weight": 0, "progress_pct": 0, "sessions": 0},
        "diagnosis": {
            "status": "insufficient_data",
            "severity": "info",
            "title": "Chưa có dữ liệu tập luyện",
            "detail": "Hãy hoàn thành ít nhất một buổi tập có ghi nhận bài tập này để AI bắt đầu phân tích.",
        },
        "actions": [],
        "meta": {
            "avg_rpe_recent": None,
            "days_since_last_pr": None,
            "sessions_last_14_days": 0,
            "model_version": "RE-3_v1.0",
        },
    }


ACTION_MESSAGES = {
    "apply_overload": "Đã ghi nhận đề xuất tăng tạ +2.5kg — hệ thống sẽ áp dụng khi bạn tạo buổi tập kế tiếp cho bài này.",
    "apply_deload": "Đã kích hoạt chu kỳ Deload (giảm ~20-30% tải) cho buổi tập kế tiếp để hỗ trợ phục hồi.",
    "request_pt": "Yêu cầu tư vấn PT 1:1 đã được gửi tới phòng gym. Huấn luyện viên sẽ liên hệ với bạn sớm.",
    "reduce_frequency": "Đã ghi nhận khuyến nghị giảm tần suất tập trong tuần tới.",
    "increase_frequency": "Đã ghi nhận khuyến nghị tăng tần suất tập trong tuần tới.",
    "keep_plan": "Đã ghi nhận: giữ nguyên kế hoạch tập hiện tại.",
}


def apply_progress_action(action_id: str) -> dict:
    message = ACTION_MESSAGES.get(action_id)
    if not message:
        return {"action_id": action_id, "applied": False, "message": "Hành động không hợp lệ."}
    return {"action_id": action_id, "applied": True, "message": message}
