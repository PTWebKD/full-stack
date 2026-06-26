from datetime import datetime, date, timedelta
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.dependencies import err
from app.modules.users.model import User, FitnessPassport
from app.modules.users.service import get_or_create_passport
from .model import Gym, GymMembership, WorkoutSession, ExerciseLog, MembershipStatus, SessionStatus, GymAnnouncement
from .schema import MembershipCreate, SessionCreate, ExerciseCreate, GymCreate, AnnouncementCreate


async def list_gyms(db: AsyncSession) -> list:
    r = await db.execute(select(Gym).order_by(Gym.gym_id))
    return r.scalars().all()


async def get_gym(db: AsyncSession, gym_id: int) -> Gym:
    r = await db.execute(select(Gym).where(Gym.gym_id == gym_id))
    g = r.scalar_one_or_none()
    if not g:
        err("NOT_FOUND", "Gym not found", 404)
    return g


async def create_gym(db: AsyncSession, owner: User, data: GymCreate) -> Gym:
    if owner.role.value != "gym_owner":
        err("FORBIDDEN", "Only gym owners can create gyms", 403)
    gym = Gym(owner_id=owner.user_id, **data.model_dump())
    db.add(gym)
    await db.flush()
    return gym


async def get_my_memberships(db: AsyncSession, user_id: int) -> list:
    r = await db.execute(
        select(GymMembership)
        .where(GymMembership.user_id == user_id)
        .order_by(GymMembership.created_at.desc())
    )
    return r.scalars().all()


async def buy_membership(db: AsyncSession, user: User, data: MembershipCreate) -> GymMembership:
    if data.end_date <= data.start_date:
        err("VALIDATION_ERROR", "end_date must be after start_date")
    # BR-06: no overlapping active membership at same gym
    r = await db.execute(
        select(GymMembership).where(
            GymMembership.user_id == user.user_id,
            GymMembership.gym_id == data.gym_id,
            GymMembership.status == MembershipStatus.active,
        )
    )
    if r.scalar_one_or_none():
        err("VALIDATION_ERROR", "Already have an active membership at this gym (BR-06)")
    m = GymMembership(user_id=user.user_id, **data.model_dump())
    db.add(m)
    await db.flush()
    return m


async def log_session(db: AsyncSession, user: User, data: SessionCreate) -> WorkoutSession:
    session = WorkoutSession(user_id=user.user_id, **data.model_dump())
    db.add(session)
    await db.flush()
    return session


async def get_my_sessions(db: AsyncSession, user_id: int) -> list:
    r = await db.execute(
        select(WorkoutSession)
        .where(WorkoutSession.user_id == user_id)
        .options(selectinload(WorkoutSession.exercises))
        .order_by(WorkoutSession.date.desc())
    )
    return r.scalars().all()


def _best_volume(sets) -> float:
    """Return the best (max) weight*reps volume across all sets (DB JSON dicts)."""
    return max((s.get("weight", 0) * s.get("reps", 0) for s in (sets or [])), default=0)


async def log_exercise(
    db: AsyncSession, user: User, session_id: int, data: ExerciseCreate
) -> ExerciseLog:
    r = await db.execute(
        select(WorkoutSession).where(
            WorkoutSession.session_id == session_id,
            WorkoutSession.user_id == user.user_id,
        )
    )
    session = r.scalar_one_or_none()
    if not session:
        err("NOT_FOUND", "Session not found or not yours", 404)
    if session.status != SessionStatus.active:
        err("BAD_REQUEST", "Cannot log exercises on a completed or cancelled session", 400)
    _check_session_editable(session)

    # PR detection (BR-31): best volume = max(weight × reps) across all sets
    prev = await db.execute(
        select(ExerciseLog)
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(
            WorkoutSession.user_id == user.user_id,
            ExerciseLog.exercise_name == data.exercise_name,
        )
    )
    all_prev = prev.scalars().all()
    max_prev = max((_best_volume(log.sets) for log in all_prev), default=0)
    # data.sets is Pydantic objects → use attribute access
    new_best = max((s.weight * s.reps for s in data.sets), default=0)
    is_pr = new_best > max_prev and new_best > 0

    log = ExerciseLog(
        session_id=session_id,
        exercise_name=data.exercise_name,
        muscle_group=data.muscle_group,
        sets=[s.model_dump() for s in data.sets],
        is_pr=is_pr,
        notes=data.notes,
    )
    db.add(log)
    await db.flush()
    return log


async def get_my_records(db: AsyncSession, user_id: int) -> list:
    r = await db.execute(
        select(ExerciseLog)
        .join(WorkoutSession, WorkoutSession.session_id == ExerciseLog.session_id)
        .where(WorkoutSession.user_id == user_id, ExerciseLog.is_pr == True)
        .order_by(ExerciseLog.created_at.desc())
    )
    return r.scalars().all()


def _check_session_editable(session: WorkoutSession) -> None:
    """BR-33: sessions are locked from editing 24 hours after completion."""
    if session.status == SessionStatus.done:
        if session.completed_at and (datetime.utcnow() - session.completed_at).total_seconds() > 86400:
            err("FORBIDDEN", "Session locked — cannot edit after 24 hours (BR-33)", 403)


async def complete_session(db: AsyncSession, user: User, session_id: int) -> dict:
    """Mark a session as done, award XP, update streak, check milestones (BR-18/20/21/22)."""
    # 1. Fetch session
    r = await db.execute(
        select(WorkoutSession)
        .where(
            WorkoutSession.session_id == session_id,
            WorkoutSession.user_id == user.user_id,
        )
        .options(selectinload(WorkoutSession.exercises))
    )
    session = r.scalar_one_or_none()
    if not session:
        err("NOT_FOUND", "Session not found or not yours", 404)
    if session.status != SessionStatus.active:
        err("BAD_REQUEST", "Session is already done or cancelled", 400)

    # 2. Calculate XP (BR-18)
    total_sets = sum(len(ex.sets or []) for ex in session.exercises)
    xp = max(total_sets * 10, 20)
    pr_count = sum(1 for ex in session.exercises if ex.is_pr)
    xp += pr_count * 50

    # 3. Update streak (BR-20/21)
    today = date.today()
    yesterday = date.fromordinal(today.toordinal() - 1)
    last_active = user.last_active_date

    if last_active is None or last_active < yesterday:
        user.current_streak = 1
    elif last_active == yesterday:
        user.current_streak = (user.current_streak or 0) + 1
    # if last_active == today: keep streak unchanged

    user.last_active_date = today

    # Load passport, auto-create if missing (covers seeded users / gym_owner accounts)
    passport = await get_or_create_passport(db, user.user_id)

    if passport and user.current_streak > (passport.longest_streak or 0):
        passport.longest_streak = user.current_streak

    # 4. Check streak milestones (BR-22)
    badges_earned = []
    streak_milestones = [
        (7, 50, "streak_7"),
        (30, 200, "streak_30"),
        (100, 500, "streak_100"),
    ]
    if passport is not None:
        existing_badges = [b.get("badge") for b in (passport.milestone_badges or [])]
        for days, coins, badge_name in streak_milestones:
            if user.current_streak >= days and badge_name not in existing_badges:
                user.fitcoin_balance = Decimal(str(user.fitcoin_balance or 0)) + Decimal(str(coins))
                milestone_badges_list = list(passport.milestone_badges or [])
                milestone_badges_list.append(
                    {"badge": badge_name, "earned_at": datetime.utcnow().isoformat()}
                )
                passport.milestone_badges = milestone_badges_list
                badges_earned.append(badge_name)

    # 5. Update FitnessPassport totals
    if passport is not None:
        passport.total_sessions = (passport.total_sessions or 0) + 1
        session_volume = sum(
            float(s.get("weight", 0)) * int(s.get("reps", 0))
            for ex in session.exercises
            for s in (ex.sets or [])
        )
        passport.total_volume = Decimal(str(passport.total_volume or 0)) + Decimal(str(session_volume))

    # 6. Mark session done
    session.status = SessionStatus.done
    session.xp_earned = xp
    session.completed_at = datetime.utcnow()

    # 7. Update user XP
    user.xp_total = (user.xp_total or 0) + xp

    # 8. Flush
    await db.flush()

    # 9. Return result dict
    return {
        "session": session,
        "xp_earned": xp,
        "new_streak": user.current_streak,
        "badges_earned": badges_earned,
    }


async def get_session(db: AsyncSession, user_id: int, session_id: int) -> WorkoutSession:
    r = await db.execute(
        select(WorkoutSession)
        .where(WorkoutSession.session_id == session_id, WorkoutSession.user_id == user_id)
        .options(selectinload(WorkoutSession.exercises))
    )
    session = r.scalar_one_or_none()
    if not session:
        err("NOT_FOUND", "Session not found or not yours", 404)
    return session


async def get_gym_announcements(db: AsyncSession, gym_id: int) -> list:
    r = await db.execute(
        select(GymAnnouncement).where(GymAnnouncement.gym_id == gym_id).order_by(GymAnnouncement.created_at.desc())
    )
    return r.scalars().all()


async def create_announcement(db: AsyncSession, owner: User, data: AnnouncementCreate) -> GymAnnouncement:
    r = await db.execute(select(Gym).where(Gym.owner_id == owner.user_id))
    gym = r.scalar_one_or_none()
    if not gym:
        err("NOT_FOUND", "No gym found for this owner", 404)
    ann = GymAnnouncement(gym_id=gym.gym_id, **data.model_dump())
    db.add(ann)
    await db.flush()
    return ann


async def delete_announcement(db: AsyncSession, owner: User, announcement_id: int) -> None:
    r = await db.execute(select(GymAnnouncement).where(GymAnnouncement.announcement_id == announcement_id))
    ann = r.scalar_one_or_none()
    if not ann:
        err("NOT_FOUND", "Announcement not found", 404)
    # Verify ownership via gym
    r2 = await db.execute(select(Gym).where(Gym.gym_id == ann.gym_id, Gym.owner_id == owner.user_id))
    if not r2.scalar_one_or_none():
        err("FORBIDDEN", "Not your gym's announcement", 403)
    await db.delete(ann)
    await db.flush()


async def suggest_muscle_group(db: AsyncSession, user_id: int) -> dict:
    """Suggest the least-trained muscle group from the last 7 days (BR-32/34)."""
    # Priority order for tiebreak (BR-34)
    priority = ["legs", "back", "chest", "shoulders", "arms", "core"]

    # 1. Fetch done sessions from last 7 days with exercises
    seven_days_ago = date.today() - timedelta(days=7)
    r = await db.execute(
        select(WorkoutSession)
        .where(
            WorkoutSession.user_id == user_id,
            WorkoutSession.status == SessionStatus.done,
            WorkoutSession.date >= seven_days_ago,
        )
        .options(selectinload(WorkoutSession.exercises))
    )
    sessions = r.scalars().all()

    # 2. If no sessions, return first priority group
    if not sessions:
        return {
            "suggested_muscle_group": "legs",
            "reason": "No workouts in the last 7 days — legs are the highest priority muscle group to train.",
        }

    # 3. Count exercises per muscle group
    counts: dict[str, int] = {g: 0 for g in priority}
    for session in sessions:
        for ex in session.exercises:
            group = ex.muscle_group.value if hasattr(ex.muscle_group, "value") else str(ex.muscle_group)
            if group in counts:
                counts[group] += 1

    # 4. Find the least-trained group, using priority order as tiebreak
    min_count = min(counts.values())
    least_trained = [g for g in priority if counts[g] == min_count]
    suggested = least_trained[0]  # priority order already applied via list comprehension

    return {
        "suggested_muscle_group": suggested,
        "reason": f"'{suggested}' has been trained only {min_count} time(s) in the last 7 days — it needs the most attention.",
    }


async def get_care_queue(db: AsyncSession, owner: User) -> list:
    # 1. Get owner's gym
    r = await db.execute(select(Gym).where(Gym.owner_id == owner.user_id))
    gym = r.scalar_one_or_none()
    if not gym:
        return []

    # --- Run AI Retention & Upsell Rule Engine (Tầng 1 - Rule-based from Product_Owner_Reorientation.md) ---
    r_members = await db.execute(select(User).where(User.role == "member"))
    members = r_members.scalars().all()
    
    current_date_val = date.today()
    from .model import CareRecommendation, GymMembership, WorkoutSession
    
    for member in members:
        # Check current memberships for this user at this gym
        r_mem = await db.execute(
            select(GymMembership)
            .where(GymMembership.user_id == member.user_id)
            .where(GymMembership.gym_id == gym.gym_id)
            .order_by(GymMembership.end_date.desc())
        )
        membership = r_mem.scalars().first()
        
        # 1. Rule: membershipExpireIn <= 7 -> renew_reminder (HIGH priority)
        if membership:
            days_to_expire = (membership.end_date - current_date_val).days
            if 0 <= days_to_expire <= 7:
                # Check if pending renew_reminder already exists
                r_exists = await db.execute(
                    select(CareRecommendation)
                    .where(CareRecommendation.member_id == member.user_id)
                    .where(CareRecommendation.type == "renew_reminder")
                    .where(CareRecommendation.status == "pending")
                )
                if not r_exists.scalars().first():
                    rec = CareRecommendation(
                        gym_id=gym.gym_id,
                        member_id=member.user_id,
                        type="renew_reminder",
                        priority="HIGH",
                        reason=f"Gói tập '{membership.plan_name}' của hội viên sẽ hết hạn vào ngày {membership.end_date.strftime('%d/%m/%Y')} (còn {days_to_expire} ngày). Đề xuất nhắc nhở gia hạn sớm.",
                        status="pending"
                    )
                    db.add(rec)
        
        # 2. Rule: daysSinceLastCheckin > 14 -> inactive_alert (HIGH priority)
        if member.last_active_date:
            days_since_active = (current_date_val - member.last_active_date).days
            if days_since_active > 14:
                # Check if pending inactive_alert already exists
                r_exists = await db.execute(
                    select(CareRecommendation)
                    .where(CareRecommendation.member_id == member.user_id)
                    .where(CareRecommendation.type == "inactive_alert")
                    .where(CareRecommendation.status == "pending")
                )
                if not r_exists.scalars().first():
                    rec = CareRecommendation(
                        gym_id=gym.gym_id,
                        member_id=member.user_id,
                        type="inactive_alert",
                        priority="HIGH",
                        reason=f"Hội viên chưa đến phòng tập trong {days_since_active} ngày qua (lần hoạt động cuối: {member.last_active_date.strftime('%d/%m/%Y')}). Cần chăm sóc rủi ro bỏ tập.",
                        status="pending"
                    )
                    db.add(rec)
        
        # 3. Rule: goal = muscle_gain (bulk) -> gợi ý protein hoặc PT sức mạnh (upsell_nutrition, LOW priority)
        if member.fitness_goal and member.fitness_goal.value == "bulk":
            r_exists = await db.execute(
                select(CareRecommendation)
                .where(CareRecommendation.member_id == member.user_id)
                .where(CareRecommendation.type == "upsell_nutrition")
                .where(CareRecommendation.status == "pending")
            )
            if not r_exists.scalars().first():
                rec = CareRecommendation(
                    gym_id=gym.gym_id,
                    member_id=member.user_id,
                    type="upsell_nutrition",
                    priority="LOW",
                    reason="Hội viên có mục tiêu Tăng cơ (Bulk). Đề xuất tư vấn Whey Protein hoặc gói PT huấn luyện sức mạnh cá nhân hóa.",
                    status="pending"
                )
                db.add(rec)
                
        # 4. Rule: goal = weight_loss (cut) -> gợi ý cardio plan hoặc meal low-calorie (upsell_nutrition, LOW priority)
        elif member.fitness_goal and member.fitness_goal.value == "cut":
            r_exists = await db.execute(
                select(CareRecommendation)
                .where(CareRecommendation.member_id == member.user_id)
                .where(CareRecommendation.type == "upsell_nutrition")
                .where(CareRecommendation.status == "pending")
            )
            if not r_exists.scalars().first():
                rec = CareRecommendation(
                    gym_id=gym.gym_id,
                    member_id=member.user_id,
                    type="upsell_nutrition",
                    priority="LOW",
                    reason="Hội viên có mục tiêu Giảm mỡ (Cut). Đề xuất tư vấn thực đơn Low-Calorie hoặc gói tập Cardio chuyên sâu.",
                    status="pending"
                )
                db.add(rec)

        # 5. Rule: checkinPerWeek >= 4 -> gợi ý gói dài hạn/Premium (upsell_plan, MEDIUM priority)
        # Fetch count of WorkoutSession in the last 7 days for the user
        seven_days_ago = current_date_val - timedelta(days=7)
        r_sessions = await db.execute(
            select(WorkoutSession)
            .where(WorkoutSession.user_id == member.user_id)
            .where(WorkoutSession.date >= seven_days_ago)
        )
        sessions_count = len(r_sessions.scalars().all())
        if sessions_count >= 4:
            r_exists = await db.execute(
                select(CareRecommendation)
                .where(CareRecommendation.member_id == member.user_id)
                .where(CareRecommendation.type == "upsell_plan")
                .where(CareRecommendation.status == "pending")
            )
            if not r_exists.scalars().first():
                rec = CareRecommendation(
                    gym_id=gym.gym_id,
                    member_id=member.user_id,
                    type="upsell_plan",
                    priority="MEDIUM",
                    reason=f"Hội viên tập luyện rất chăm chỉ với tần suất {sessions_count} buổi/tuần. Đề xuất upsell nâng cấp lên gói dài hạn hoặc gói Premium.",
                    status="pending"
                )
                db.add(rec)

    await db.flush()

    # 2. Get recommendations for this gym
    from .model import CareRecommendation
    r2 = await db.execute(
        select(CareRecommendation, User.display_name, User.phone)
        .join(User, User.user_id == CareRecommendation.member_id)
        .where(CareRecommendation.gym_id == gym.gym_id)
        .where(CareRecommendation.status == "pending")
        .order_by(CareRecommendation.created_at.desc())
    )
    rows = r2.all()
    results = []
    for rec, name, phone in rows:
        results.append({
            "rec_id": rec.rec_id,
            "gym_id": rec.gym_id,
            "member_id": rec.member_id,
            "member_name": name,
            "member_phone": phone,
            "type": rec.type,
            "priority": rec.priority,
            "reason": rec.reason,
            "status": rec.status,
            "result": rec.result,
            "created_at": rec.created_at,
        })
    return results


async def update_care_recommendation(
    db: AsyncSession, owner: User, rec_id: int, status: str, result: str | None = None
) -> CareRecommendation:
    from .model import CareRecommendation
    r = await db.execute(select(CareRecommendation).where(CareRecommendation.rec_id == rec_id))
    rec = r.scalar_one_or_none()
    if not rec:
        err("NOT_FOUND", "Care recommendation not found", 404)

    # Verify owner owns the gym
    r2 = await db.execute(select(Gym).where(Gym.gym_id == rec.gym_id, Gym.owner_id == owner.user_id))
    if not r2.scalar_one_or_none():
        err("FORBIDDEN", "Not authorized for this gym", 403)

    rec.status = status
    if result:
        rec.result = result
    await db.flush()
    return rec
