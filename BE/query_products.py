import asyncio
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.modules.food.model import FoodProduct
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

async def query_all():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(FoodProduct))
        products = r.scalars().all()
        print(f"Total products in DB: {len(products)}")
        for p in products:
            print(f"ID: {p.product_id} | Name: {p.name} | Category: {p.category} | Available: {p.is_available}")

if __name__ == "__main__":
    asyncio.run(query_all())
