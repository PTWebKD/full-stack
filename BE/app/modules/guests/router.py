# BE/app/modules/guests/router.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
from app.core.database import get_db
from app.core.dependencies import err
from .model import Guest
from .schema import GuestCheckoutRequest, GuestCheckoutResponse, GuestOut, VoucherOut
from .service import (
    get_or_create_guest,
    calculate_upsell_voucher,
    assign_voucher_to_guest
)

router = APIRouter(prefix="/api/guests", tags=["guests"])

def ok(data):
    return {"success": True, "data": data}

@router.post("/checkout/preview")
async def guest_checkout_preview(
    request: GuestCheckoutRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Preview guest checkout: recognize returning customer, suggest upsell voucher

    Returns: guest info, subtotal, available voucher, total with discount
    """
    # Get or create guest
    guest = await get_or_create_guest(db, request.phone)

    # Calculate subtotal from items (simplified — normally would query products)
    subtotal = Decimal("0")
    # TODO: implement item price calculation

    # Determine if returning customer
    is_returning = guest.total_purchases > 0

    # Calculate upsell voucher
    available_voucher = None
    discount_amount = Decimal("0")

    if is_returning:
        available_voucher_obj = await calculate_upsell_voucher(db, guest)

        if available_voucher_obj:
            # Assign if not already assigned
            await assign_voucher_to_guest(db, guest.guest_id, available_voucher_obj.voucher_id)
            available_voucher = VoucherOut.model_validate(available_voucher_obj)

            # Calculate discount
            if available_voucher_obj.discount_percent:
                discount_amount = subtotal * Decimal(available_voucher_obj.discount_percent) / Decimal("100")
            elif available_voucher_obj.discount_amount:
                discount_amount = available_voucher_obj.discount_amount

    total = subtotal - discount_amount

    await db.commit()

    return ok(GuestCheckoutResponse(
        guest_id=guest.guest_id,
        is_returning_customer=is_returning,
        available_voucher=available_voucher,
        subtotal=subtotal,
        discount_amount=discount_amount,
        total=total
    ).model_dump())

@router.get("/{guest_id}")
async def get_guest(guest_id: int, db: AsyncSession = Depends(get_db)):
    """Get guest by ID"""
    result = await db.execute(select(Guest).where(Guest.guest_id == guest_id))
    guest = result.scalar_one_or_none()

    if not guest:
        err("NOT_FOUND", "Guest not found", 404)

    return ok(GuestOut.model_validate(guest).model_dump())
