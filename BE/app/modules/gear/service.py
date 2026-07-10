import uuid
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.dependencies import err
from app.modules.users.model import User
from .model import (
    GearItem, GearLifecycle, GearTransaction,
    ListingType, LifecycleAction, GearTxnType, GearTxnStatus,
)
from .schema import GearItemCreate, GearItemUpdate, RentIn, GearCheckoutIn

MAX_RENTAL_DAYS = 7  # BR-18: rental duration must not exceed 7 days
MAX_CONCURRENT_RENTALS = 3  # BR-18: a member may have at most 3 active rentals at once


def _gen_gear_id() -> str:
    uid = uuid.uuid4().hex[:8].upper()
    return f"GEAR-{uid[:4]}-{uid[4:]}"


async def list_gear(db: AsyncSession, category: str = None, search: str = None) -> list:
    q = select(GearItem).where(GearItem.is_available == True)
    if category:
        q = q.where(GearItem.category == category)
    if search:
        q = q.where(GearItem.name.ilike(f"%{search}%"))
    result = await db.execute(q.order_by(GearItem.created_at.desc()))
    return result.scalars().all()


async def get_gear(db: AsyncSession, gear_id: str) -> GearItem:
    result = await db.execute(select(GearItem).where(GearItem.gear_id == gear_id))
    item = result.scalar_one_or_none()
    if not item:
        err("NOT_FOUND", "Gear item not found", 404)
    return item


async def create_gear(db: AsyncSession, user: User, data: GearItemCreate) -> GearItem:
    # BR-11B: gear is gym-owned inventory — only GymOwner may create listings
    # (sell, rent, or both); Members/Guests are customers only, never listers.
    if user.role.value != "gym_owner":
        err("FORBIDDEN", "Only GymOwner can list gear (BR-11B)", 403)

    gear_id = _gen_gear_id()
    item = GearItem(
        gear_id=gear_id,
        current_owner_id=user.user_id,
        category=data.category,
        name=data.name,
        description=data.description,
        condition_rating=data.condition_rating,
        condition_notes=data.condition_notes,
        listing_type=data.listing_type,
        sell_price=data.sell_price,
        rent_price_day=data.rent_price_day,
        rent_price_week=data.rent_price_week,
        deposit_amount=data.deposit_amount,
        images=data.images,
    )
    db.add(item)
    await db.flush()

    lc = GearLifecycle(
        gear_id=gear_id,
        owner_id=user.user_id,
        action=LifecycleAction.listed,
        condition_at_time=data.condition_rating,
        price_snapshot=data.sell_price or data.rent_price_day,
    )
    db.add(lc)
    await db.flush()
    return item


async def update_gear(db: AsyncSession, user: User, gear_id: str, data: GearItemUpdate) -> GearItem:
    item = await get_gear(db, gear_id)
    if user.role.value != "gym_owner":
        err("FORBIDDEN", "Only GymOwner can manage gear listings", 403)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    await db.flush()
    return item


async def delete_gear(db: AsyncSession, user: User, gear_id: str):
    item = await get_gear(db, gear_id)
    if user.role.value != "gym_owner":
        err("FORBIDDEN", "Only GymOwner can manage gear listings", 403)
    item.is_available = False
    await db.flush()


async def rent_gear(db: AsyncSession, user: User, gear_id: str, data: RentIn) -> GearTransaction:
    item = await get_gear(db, gear_id)
    if not item.is_available:
        err("VALIDATION_ERROR", "Gear is not currently available")
    # BR-18: rentable if listing_type is 'rent' or 'both'
    if item.listing_type not in (ListingType.rent, ListingType.both):
        err("VALIDATION_ERROR", "This gear is not listed for rent")
    if item.current_owner_id == user.user_id:
        err("VALIDATION_ERROR", "Cannot rent your own gear")
    days = (data.rental_end - data.rental_start).days
    if days <= 0:
        err("VALIDATION_ERROR", "rental_end must be after rental_start")
    # BR-18: rental duration must not exceed 7 days
    if days > MAX_RENTAL_DAYS:
        err("VALIDATION_ERROR", f"Rental duration must not exceed {MAX_RENTAL_DAYS} days (BR-18)")

    # BR-18: a member may have at most 3 active rentals at once
    active_count = await db.scalar(
        select(func.count()).where(
            GearTransaction.buyer_id == user.user_id,
            GearTransaction.type == GearTxnType.rental,
            GearTransaction.status == GearTxnStatus.active,
        )
    )
    if active_count >= MAX_CONCURRENT_RENTALS:
        err("VALIDATION_ERROR", f"You may have at most {MAX_CONCURRENT_RENTALS} active rentals (BR-18)")

    daily = item.rent_price_day or Decimal("0")
    total = daily * days
    # BR-18: member pays 100% of the listing's configured deposit_amount
    deposit = item.deposit_amount or Decimal("0")

    txn = GearTransaction(
        gear_id=gear_id,
        seller_id=item.current_owner_id,
        buyer_id=user.user_id,
        type=GearTxnType.rental,
        amount=total,
        deposit=deposit,
        rental_start=data.rental_start,
        rental_end=data.rental_end,
        status=GearTxnStatus.active,
    )
    db.add(txn)
    item.is_available = False

    lc = GearLifecycle(
        gear_id=gear_id,
        owner_id=user.user_id,
        action=LifecycleAction.rented,
        price_snapshot=total,
    )
    db.add(lc)
    await db.flush()
    return txn


async def buy_gear(db: AsyncSession, user: User, gear_id: str) -> GearTransaction:
    """Outright purchase (GearTxnType.sale) — settles immediately, no deposit/return cycle."""
    item = await get_gear(db, gear_id)
    if not item.is_available:
        err("VALIDATION_ERROR", "Gear is not currently available")
    if item.listing_type not in (ListingType.sell, ListingType.both):
        err("VALIDATION_ERROR", "This gear is not listed for sale")
    if item.current_owner_id == user.user_id:
        err("VALIDATION_ERROR", "Cannot buy your own gear")

    amount = item.sell_price or Decimal("0")

    txn = GearTransaction(
        gear_id=gear_id,
        seller_id=item.current_owner_id,
        buyer_id=user.user_id,
        type=GearTxnType.sale,
        amount=amount,
        deposit=Decimal("0"),
        status=GearTxnStatus.completed,
    )
    db.add(txn)
    item.is_available = False

    lc = GearLifecycle(
        gear_id=gear_id,
        owner_id=user.user_id,
        action=LifecycleAction.sold,
        price_snapshot=amount,
    )
    db.add(lc)
    await db.flush()
    return txn


async def checkout_gear(db: AsyncSession, user: User, data: GearCheckoutIn) -> dict:
    """Bulk cart checkout for gear purchases — buys each line item independently so
    one already-sold/unavailable item doesn't block the rest of the cart."""
    transactions = []
    errors = []
    for gear_id in data.gear_ids:
        try:
            txn = await buy_gear(db, user, gear_id)
            transactions.append(txn)
        except Exception as exc:
            detail = getattr(exc, "detail", None)
            message = detail.get("message") if isinstance(detail, dict) else str(exc)
            errors.append({"gear_id": gear_id, "message": message or "Không thể mua sản phẩm này"})
    return {"transactions": transactions, "errors": errors}


async def return_gear(db: AsyncSession, user: User, gear_id: str) -> GearItem:
    item = await get_gear(db, gear_id)
    result = await db.execute(
        select(GearTransaction).where(
            GearTransaction.gear_id == gear_id,
            GearTransaction.buyer_id == user.user_id,
            GearTransaction.status == GearTxnStatus.active,
        )
    )
    txn = result.scalar_one_or_none()
    if not txn:
        err("NOT_FOUND", "No active rental found for this gear", 404)
    txn.status = GearTxnStatus.completed
    item.is_available = True

    lc = GearLifecycle(
        gear_id=gear_id,
        owner_id=user.user_id,
        action=LifecycleAction.returned,
    )
    db.add(lc)
    await db.flush()
    return item


async def get_my_rentals(db: AsyncSession, user_id: int) -> list:
    result = await db.execute(
        select(GearTransaction, GearItem.name)
        .join(GearItem, GearItem.gear_id == GearTransaction.gear_id)
        .where(
            GearTransaction.buyer_id == user_id,
            GearTransaction.type == GearTxnType.rental,
        )
        .order_by(GearTransaction.created_at.desc())
    )
    rentals = []
    for txn, gear_name in result.all():
        txn.gear_name = gear_name
        rentals.append(txn)
    return rentals


async def get_lifecycle(db: AsyncSession, gear_id: str) -> list:
    await get_gear(db, gear_id)
    result = await db.execute(
        select(GearLifecycle)
        .where(GearLifecycle.gear_id == gear_id)
        .order_by(GearLifecycle.timestamp)
    )
    return result.scalars().all()
