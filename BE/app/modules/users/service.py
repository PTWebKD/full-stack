from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from .model import User, FitnessPassport, Follow
from .schema import UserUpdate
from .referral_utils import make_referral_code
from app.core.dependencies import err


async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        err("NOT_FOUND", "User not found", 404)
    return user


async def update_user(db: AsyncSession, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    await db.flush()
    return user


async def get_or_create_passport(db: AsyncSession, user_id: int) -> FitnessPassport:
    result = await db.execute(
        select(FitnessPassport).where(FitnessPassport.user_id == user_id)
    )
    passport = result.scalar_one_or_none()
    if not passport:
        passport = FitnessPassport(user_id=user_id)
        db.add(passport)
        await db.flush()
    return passport


async def get_referral_info(db: AsyncSession, user: User) -> dict:
    """UC-11: the member's own shareable referral code + how many signups/FitCoin it earned."""
    from app.modules.fitcoin.model import FitcoinTransaction, FitcoinSource, FitcoinType

    count_r = await db.execute(
        select(func.count(User.user_id)).where(User.referred_by == user.user_id)
    )
    referred_count = count_r.scalar_one()

    sum_r = await db.execute(
        select(func.coalesce(func.sum(FitcoinTransaction.amount), 0)).where(
            FitcoinTransaction.user_id == user.user_id,
            FitcoinTransaction.source == FitcoinSource.referral,
            FitcoinTransaction.type == FitcoinType.earn,
        )
    )
    total_referral_fitcoin = sum_r.scalar_one()

    return {
        "referral_code": make_referral_code(user.user_id),
        "referred_count": referred_count,
        "total_referral_fitcoin": total_referral_fitcoin,
    }


async def follow_user(db: AsyncSession, follower_id: int, following_id: int):
    if follower_id == following_id:
        err("VALIDATION_ERROR", "Cannot follow yourself")
    existing = await db.execute(
        select(Follow).where(
            Follow.follower_id == follower_id, Follow.following_id == following_id
        )
    )
    if existing.scalar_one_or_none():
        err("VALIDATION_ERROR", "Already following this user")
    follow = Follow(follower_id=follower_id, following_id=following_id)
    db.add(follow)
    await db.flush()
    return follow


async def unfollow_user(db: AsyncSession, follower_id: int, following_id: int):
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == follower_id, Follow.following_id == following_id
        )
    )
    follow = result.scalar_one_or_none()
    if not follow:
        err("NOT_FOUND", "Not following this user", 404)
    await db.delete(follow)
