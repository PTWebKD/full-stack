from datetime import date, timedelta
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.gym.model import WorkoutSession, ExerciseLog, MuscleGroup
from app.modules.food.model import FoodProduct


@pytest.fixture(scope="module", autouse=True)
async def seed_history_and_food(session_db: AsyncSession, member_user, gym_owner_user):
    uid = member_user.user_id

    # Training history spread across many sessions: legs dominates overall,
    # even though the MOST RECENT session was a chest day (post-workout popup would say "chest").
    plan = [
        (40, MuscleGroup.legs), (35, MuscleGroup.legs), (30, MuscleGroup.legs),
        (25, MuscleGroup.back), (20, MuscleGroup.legs), (15, MuscleGroup.back),
        (10, MuscleGroup.legs), (5, MuscleGroup.chest), (0, MuscleGroup.chest),
    ]
    for offset, mg in plan:
        sess = WorkoutSession(user_id=uid, date=date.today() - timedelta(days=offset))
        session_db.add(sess)
        await session_db.flush()
        session_db.add(ExerciseLog(
            session_id=sess.session_id, exercise_name="Test Exercise",
            muscle_group=mg, sets=[{"reps": 8, "weight": 50}],
        ))
    await session_db.commit()

    # Enough allergen-free, high-protein/high-carb food products for the GA optimizer to run (>=3)
    for i in range(5):
        session_db.add(FoodProduct(
            vendor_id=gym_owner_user.user_id,
            name=f"Legs Bulk Meal {i}",
            price=50000,
            calories=600,
            protein_g=35,
            carb_g=55,
            fat_g=15,
            allergens=[],
            images=["https://example.com/x.png"],
            is_available=True,
        ))
    await session_db.commit()


@pytest.mark.asyncio
async def test_history_recommendation_uses_overall_dominant_muscle_not_last_session(client, member_token):
    resp = await client.get("/api/ai/food-recommendation/history",
                             headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["basis"] == "history"
    # Legs has 5 logs overall vs 2 back / 2 chest — must win despite the last session being chest.
    assert data["muscle_group"] == "legs"
    assert data["training_summary"]["legs"] == 5
    assert len(data["recommendations"]) >= 1


@pytest.mark.asyncio
async def test_history_recommendation_falls_back_for_guest(client):
    resp = await client.get("/api/ai/food-recommendation/history")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["mode"] == "best_seller"
    assert data["basis"] is None


@pytest.mark.asyncio
async def test_session_recommendation_still_uses_single_session(client, member_token, session_db):
    # The most recent session (offset 0) is a chest day — session-based mode must say "chest",
    # proving the two endpoints genuinely differ in basis.
    from sqlalchemy import select
    r = await session_db.execute(
        select(WorkoutSession).where(WorkoutSession.user_id != None).order_by(WorkoutSession.date.desc())
    )
    latest_session = r.scalars().first()

    resp = await client.post("/api/ai/food-recommendation",
                              json={"session_id": latest_session.session_id},
                              headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["basis"] == "session"
    assert data["muscle_group"] == "chest"
