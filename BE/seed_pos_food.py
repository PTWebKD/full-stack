import asyncio
from decimal import Decimal
from sqlalchemy import select
from app.core.database import AsyncSessionLocal
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

async def seed_pos_products():
    async with AsyncSessionLocal() as db:
        # Find first gym owner to assign as vendor_id
        r_owner = await db.execute(select(User).where(User.role == "gym_owner"))
        owner = r_owner.scalars().first()
        if not owner:
            print("No gym_owner found to assign as vendor!")
            return
        
        vendor_id = owner.user_id
        print(f"Using owner: {owner.display_name} (ID: {vendor_id}) as vendor for POS items.")

        pos_items = [
            {
                "name": "Protein Shake Whey Vanilla",
                "description": "Whey protein shake vị vani thơm ngon, hấp thu nhanh sau tập.",
                "price": Decimal("89000"),
                "calories": 180,
                "protein_g": Decimal("25.0"),
                "carb_g": Decimal("2.0"),
                "fat_g": Decimal("1.5"),
                "category": "Drink",
                "badge": "Best Seller",
                "images": ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=400&fit=crop"]
            },
            {
                "name": "Protein Bar Double Chocolate",
                "description": "Bánh protein vị sô-cô-la nhân đôi, bổ sung năng lượng tức thì.",
                "price": Decimal("45000"),
                "calories": 210,
                "protein_g": Decimal("20.0"),
                "carb_g": Decimal("15.0"),
                "fat_g": Decimal("6.0"),
                "category": "Snack",
                "badge": "High Protein",
                "images": ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop"]
            },
            {
                "name": "BCAA Amino Recovery (Dưa hấu)",
                "description": "Nước uống BCAA phục hồi cơ bắp, chống dị hóa cơ trong và sau tập.",
                "price": Decimal("55000"),
                "calories": 15,
                "protein_g": Decimal("5.0"),
                "carb_g": Decimal("0.0"),
                "fat_g": Decimal("0.0"),
                "category": "Drink",
                "badge": "Recovery",
                "images": ["https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop"]
            },
            {
                "name": "Pre-Workout C4 Lemonade",
                "description": "Tăng sức mạnh, tăng độ tập trung cực đại trước buổi tập.",
                "price": Decimal("65000"),
                "calories": 10,
                "protein_g": Decimal("0.0"),
                "carb_g": Decimal("2.0"),
                "fat_g": Decimal("0.0"),
                "category": "Drink",
                "badge": "Energy",
                "images": ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=400&fit=crop"]
            },
            {
                "name": "Whey Gold Standard 2kg",
                "description": "Hộp sữa bột Whey Protein tinh khiết 100% Whey Isolate.",
                "price": Decimal("1250000"),
                "calories": 120,
                "protein_g": Decimal("24.0"),
                "carb_g": Decimal("3.0"),
                "fat_g": Decimal("1.0"),
                "category": "Supplements",
                "badge": "Premium",
                "images": ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=400&fit=crop"]
            },
            {
                "name": "Nước Điện Giải Revive 500ml",
                "description": "Nước bù nước bù khoáng, điện giải nhanh chóng.",
                "price": Decimal("20000"),
                "calories": 80,
                "protein_g": Decimal("0.0"),
                "carb_g": Decimal("20.0"),
                "fat_g": Decimal("0.0"),
                "category": "Drink",
                "badge": "Hydrate",
                "images": ["https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&h=400&fit=crop"]
            },
            {
                "name": "Yến Mạch Ăn Liền Oats 100g",
                "description": "Yến mạch nguyên cám ăn liền, tinh bột hấp thu chậm cực tốt.",
                "price": Decimal("35000"),
                "calories": 150,
                "protein_g": Decimal("5.0"),
                "carb_g": Decimal("27.0"),
                "fat_g": Decimal("3.0"),
                "category": "Snack",
                "badge": "Healthy Carb",
                "images": ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=400&fit=crop"]
            }
        ]

        inserted = 0
        for item in pos_items:
            # Check if product with this name already exists
            r_exist = await db.execute(select(FoodProduct).where(FoodProduct.name == item["name"]))
            if r_exist.scalars().first():
                print(f"Product '{item['name']}' already exists, skipping.")
                continue
            
            p = FoodProduct(
                vendor_id=vendor_id,
                name=item["name"],
                description=item["description"],
                price=item["price"],
                calories=item["calories"],
                protein_g=item["protein_g"],
                carb_g=item["carb_g"],
                fat_g=item["fat_g"],
                category=item["category"],
                badge=item["badge"],
                images=item["images"],
                is_available=True
            )
            db.add(p)
            inserted += 1
            print(f"Seeding product: {item['name']}")
        
        if inserted > 0:
            await db.commit()
            print(f"Successfully seeded {inserted} POS food products!")
        else:
            print("No new products seeded.")

if __name__ == "__main__":
    asyncio.run(seed_pos_products())
