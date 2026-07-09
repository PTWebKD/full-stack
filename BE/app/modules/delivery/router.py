from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal
from app.core.dependencies import get_db, get_current_user, err
from app.modules.users.model import User
from app.modules.delivery.schema import (
    ShippingAddressCreate,
    ShippingAddressUpdate,
    ShippingAddressResponse,
    ShippingFeeResponse,
)
from app.modules.delivery.service import DeliveryService

router = APIRouter(tags=["delivery"])


def ok(data):
    return {"success": True, "data": data}


@router.post("/addresses", status_code=status.HTTP_201_CREATED)
async def create_address(
    address: ShippingAddressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new shipping address for the current user."""
    res = await DeliveryService.create_address(db, current_user.user_id, address)
    return ok(ShippingAddressResponse.model_validate(res).model_dump())


@router.get("/addresses")
async def get_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all shipping addresses for the current user."""
    res = await DeliveryService.get_addresses(db, current_user.user_id)
    return ok([ShippingAddressResponse.model_validate(a).model_dump() for a in res])


@router.get("/addresses/default")
async def get_default_address(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the default shipping address."""
    res = await DeliveryService.get_default_address(db, current_user.user_id)
    if not res:
        return ok(None)
    return ok(ShippingAddressResponse.model_validate(res).model_dump())


@router.put("/addresses/{address_id}")
async def update_address(
    address_id: int,
    address: ShippingAddressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a shipping address."""
    res = await DeliveryService.update_address(db, address_id, current_user.user_id, address)
    return ok(ShippingAddressResponse.model_validate(res).model_dump())


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a shipping address."""
    if not await DeliveryService.delete_address(db, address_id, current_user.user_id):
        err("NOT_FOUND", "Address not found", 404)
    return ok({"deleted": address_id})


@router.get("/shipping-fee")
async def calculate_shipping_fee(subtotal: Decimal):
    """Calculate shipping fee based on subtotal. Free if >= 200k VND."""
    result = DeliveryService.calculate_shipping_fee(subtotal)
    return ok(ShippingFeeResponse(
        shipping_fee=result["shipping_fee"],
        is_freeship=result["is_freeship"],
        subtotal=subtotal,
        total=subtotal + result["shipping_fee"],
    ).model_dump())
