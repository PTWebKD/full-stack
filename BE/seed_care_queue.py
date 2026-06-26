import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal

# Import ALL models exactly from main.py style to ensure SQLAlchemy registry is fully loaded
from app.modules.users.model import User, FitnessPassport, Follow  # noqa
from app.modules.auth.model import GuestOTP  # noqa
from app.modules.gym.model import Gym, GymMembership, WorkoutSession, ExerciseLog, GymAnnouncement, CareRecommendation  # noqa
from app.modules.food.model import FoodProduct, FoodOrder, FoodReview  # noqa
from app.modules.gear.model import GearItem, GearLifecycle, GearTransaction  # noqa
from app.modules.gamification.model import Challenge, UserChallenge, Badge  # noqa
from app.modules.fitcoin.model import FitcoinTransaction  # noqa
from app.modules.social.model import SocialPost  # noqa
from app.modules.notifications.model import Notification  # noqa
from app.modules.delivery.model import ShippingAddress  # noqa
from app.modules.guests.model import Guest, Voucher, GuestVoucher  # noqa


async def seed():
    async with AsyncSessionLocal() as db:
        # 1. Query the first gym
        r_gym = await db.execute(select(Gym))
        gym = r_gym.scalars().first()
        if not gym:
            print("No gym found in the database. Please create a gym first.")
            return

        # 2. Query users who are members
        r_members = await db.execute(select(User).where(User.role == "member"))
        members = r_members.scalars().all()
        if not members:
            print("No members found in the database. Please register some members first.")
            return

        print(f"Found gym: {gym.name} (ID: {gym.gym_id})")
        print(f"Found {len(members)} members.")

        # 3. Clear existing care recommendations for clean slate
        # (This is safe because it's simulated data requested by the user)
        r_existing = await db.execute(select(CareRecommendation))
        existing = r_existing.scalars().all()
        for e in existing:
            await db.delete(e)
        await db.flush()

        # 4. Generate care recommendations for members
        # We will cycle through members and assign different types of care queue cards
        types = [
            ("renew_reminder", "HIGH", "Gói tập Gói Tháng của hội viên sẽ hết hạn trong 3 ngày tới. Cần liên hệ nhắc nhở gia hạn sớm để tránh gián đoạn tập luyện."),
            ("inactive_alert", "HIGH", "Hội viên chưa đến phòng tập trong 14 ngày qua (buổi tập cuối cùng là 2 tuần trước). Hệ thống AI gắn cờ cảnh báo nguy cơ bỏ tập cao."),
            ("upsell_plan", "MEDIUM", "Hội viên tập luyện rất đều đặn (4 buổi/tuần) trong 30 ngày liên tiếp. Đề xuất giới thiệu nâng cấp từ Gói Tháng lên Gói Năm để nhận ưu đãi giảm 20%."),
            ("upsell_nutrition", "LOW", "Hội viên tập luyện với cường độ volume cao (chuyên nhóm cơ Ngực, Chân) nhưng chưa từng sử dụng các sản phẩm dinh dưỡng bổ sung Whey/Protein của phòng tập.")
        ]

        inserted_count = 0
        for i, member in enumerate(members[:4]):  # Seed up to 4 members
            rec_type, priority, reason = types[i % len(types)]
            rec = CareRecommendation(
                gym_id=gym.gym_id,
                member_id=member.user_id,
                type=rec_type,
                priority=priority,
                reason=reason,
                status="pending"
            )
            db.add(rec)
            inserted_count += 1
            print(f"Adding care recommendation for {member.display_name} ({member.email}) - Type: {rec_type}, Priority: {priority}")

        # If we have more members, seed some more with variation
        if len(members) > 4:
            for j, member in enumerate(members[4:8]):
                rec_type, priority, reason = types[(j + 2) % len(types)]
                rec = CareRecommendation(
                    gym_id=gym.gym_id,
                    member_id=member.user_id,
                    type=rec_type,
                    priority=priority,
                    reason=reason,
                    status="pending"
                )
                db.add(rec)
                inserted_count += 1
                print(f"Adding care recommendation for {member.display_name} ({member.email}) - Type: {rec_type}, Priority: {priority}")

        await db.commit()
        print(f"Successfully seeded {inserted_count} care recommendations into the database!")


if __name__ == "__main__":
    asyncio.run(seed())
