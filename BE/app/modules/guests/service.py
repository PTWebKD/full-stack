from datetime import datetime, timedelta, timezone
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from app.core.dependencies import err
from .model import Guest, Voucher, GuestVoucher
from .schema import GuestCreate, GuestUpdate


async def get_or_create_guest(db: AsyncSession, phone: str) -> Guest:
    """Get guest by phone, or create if new"""
    result = await db.execute(select(Guest).where(Guest.phone == phone))
    guest = result.scalar_one_or_none()

    if not guest:
        # New guest
        guest = Guest(phone=phone)
        db.add(guest)
        await db.flush()

    return guest


async def update_guest_after_purchase(db: AsyncSession, guest_id: int, order_total: Decimal) -> Guest:
    """Update guest stats after purchase: total_purchases, total_spent, last_visit_at"""
    result = await db.execute(select(Guest).where(Guest.guest_id == guest_id))
    guest = result.scalar_one_or_none()

    if not guest:
        err("NOT_FOUND", "Guest not found", 404)

    guest.total_purchases += 1
    guest.total_spent = Decimal(str(guest.total_spent or 0)) + order_total
    guest.last_visit_at = datetime.now(timezone.utc)

    await db.flush()
    return guest


async def get_active_vouchers(db: AsyncSession) -> list[Voucher]:
    """Get all vouchers currently valid (start_date <= now <= end_date, not exhausted)"""
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(Voucher).where(
            Voucher.start_date <= now,
            Voucher.end_date >= now,
            or_(Voucher.max_uses == None, Voucher.current_uses < Voucher.max_uses)
        )
    )
    return result.scalars().all()


async def calculate_upsell_voucher(db: AsyncSession, guest: Guest) -> Voucher | None:
    """
    Determine which voucher to offer to guest based on:
    1. Is returning customer (total_purchases >= 1)
    2. Has not been shown this voucher recently (voucher_last_shown_at < 24h ago)
    3. Has active, applicable, non-exhausted vouchers

    Returns: Best upsell voucher, or None if not eligible
    """
    # Only upsell to returning customers
    if guest.total_purchases < 1:
        return None

    # Check if voucher was shown recently (within 24 hours)
    if guest.voucher_last_shown_at:
        if datetime.now(timezone.utc) - guest.voucher_last_shown_at < timedelta(hours=24):
            return None

    # Get active nutrition-applicable vouchers directly in SQL
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(Voucher).where(
            Voucher.start_date <= now,
            Voucher.end_date >= now,
            or_(Voucher.max_uses == None, Voucher.current_uses < Voucher.max_uses),
            Voucher.applicable_to_nutrition == True
        )
    )
    nutrition_vouchers = result.scalars().all()

    if not nutrition_vouchers:
        return None

    # Return voucher with highest discount (percent-based preferred)
    def voucher_score(v):
        if v.discount_percent:
            return v.discount_percent * 1000 + float(Decimal(str(v.discount_amount or 0)))
        return float(Decimal(str(v.discount_amount or 0)))

    best_voucher = max(nutrition_vouchers, key=voucher_score)
    return best_voucher


async def assign_voucher_to_guest(db: AsyncSession, guest_id: int, voucher_id: int) -> GuestVoucher:
    """Assign a voucher to a guest (create GUEST_VOUCHER record)"""
    # Check if already assigned
    result = await db.execute(
        select(GuestVoucher).where(
            GuestVoucher.guest_id == guest_id,
            GuestVoucher.voucher_id == voucher_id
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        return existing

    gv = GuestVoucher(guest_id=guest_id, voucher_id=voucher_id)
    db.add(gv)
    await db.flush()
    return gv


async def mark_voucher_used(db: AsyncSession, guest_voucher_id: int, order_id: int) -> GuestVoucher:
    """Mark voucher as used on an order"""
    result = await db.execute(
        select(GuestVoucher)
        .where(GuestVoucher.guest_voucher_id == guest_voucher_id)
        .options(selectinload(GuestVoucher.voucher))
    )
    gv = result.scalar_one_or_none()

    if not gv:
        err("NOT_FOUND", "Guest voucher not found", 404)

    gv.used_at = datetime.now(timezone.utc)
    gv.order_id = order_id

    # Voucher is already loaded via selectinload, just update it
    if gv.voucher:
        gv.voucher.current_uses += 1

    await db.flush()
    return gv
