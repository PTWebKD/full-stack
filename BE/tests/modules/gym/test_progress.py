from datetime import date, timedelta
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.gym.model import WorkoutSession, ExerciseLog, MuscleGroup


async def _log(session_db: AsyncSession, user_id: int, day_offset: int, exercise_name: str,
                muscle_group: MuscleGroup, weight: float, reps: int = 5, rpe: float | None = None):
    sess = WorkoutSession(user_id=user_id, date=date.today() - timedelta(days=day_offset))
    session_db.add(sess)
    await session_db.flush()
    sets = [{"reps": reps, "weight": weight, **({"rpe": rpe} if rpe is not None else {})}]
    session_db.add(ExerciseLog(session_id=sess.session_id, exercise_name=exercise_name,
                                muscle_group=muscle_group, sets=sets))
    await session_db.commit()


@pytest.fixture(scope="module", autouse=True)
async def seed_progress_data(session_db: AsyncSession, member_user):
    uid = member_user.user_id
    # Bench Press: 4 sessions, each a new PR, all within the last 14 days -> Steady Progress
    for offset, w in [(12, 80), (8, 85), (4, 90), (0, 95)]:
        await _log(session_db, uid, offset, "Bench Press", MuscleGroup.chest, w, rpe=7.0)

    # Deadlift: PR peaks 33 days ago, then flat for the two most recent sessions -> Plateau
    for offset, w in [(60, 100), (45, 110), (33, 120), (10, 120), (3, 120)]:
        await _log(session_db, uid, offset, "Deadlift", MuscleGroup.back, w)

    # Squat: only one session ever logged -> not enough data
    await _log(session_db, uid, 1, "Squat", MuscleGroup.legs, 60)


@pytest.mark.asyncio
async def test_progress_exercises_lists_all_logged_exercises(client, member_token):
    resp = await client.get("/api/gym/progress/exercises", headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    names = {row["exercise_name"] for row in resp.json()["data"]}
    assert {"Bench Press", "Deadlift", "Squat"} <= names


@pytest.mark.asyncio
async def test_progress_steady(client, member_token):
    resp = await client.get("/api/gym/progress?exercise_name=Bench Press",
                             headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["diagnosis"]["status"] == "steady"
    assert data["stats"]["sessions"] == 4
    assert data["stats"]["max_weight"] == 95
    assert data["history"][-1]["is_pr"] is True


@pytest.mark.asyncio
async def test_progress_plateau(client, member_token):
    resp = await client.get("/api/gym/progress?exercise_name=Deadlift",
                             headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["diagnosis"]["status"] == "plateau"
    assert data["meta"]["days_since_last_pr"] >= 28
    assert any(a["id"] == "apply_overload" for a in data["actions"])


@pytest.mark.asyncio
async def test_progress_insufficient_data(client, member_token):
    resp = await client.get("/api/gym/progress?exercise_name=Squat",
                             headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["diagnosis"]["status"] == "insufficient_data"
    assert data["actions"] == []


@pytest.mark.asyncio
async def test_progress_action_apply(client, member_token):
    resp = await client.post("/api/gym/progress/action",
                              json={"exercise_name": "Bench Press", "action_id": "apply_overload"},
                              headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["applied"] is True
    assert "message" in data


@pytest.mark.asyncio
async def test_progress_action_invalid(client, member_token):
    resp = await client.post("/api/gym/progress/action",
                              json={"exercise_name": "Bench Press", "action_id": "not_a_real_action"},
                              headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    assert resp.json()["data"]["applied"] is False
