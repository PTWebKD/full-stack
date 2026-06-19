from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from decimal import Decimal
from app.modules.delivery.model import ShippingAddress
from app.modules.delivery.schema import ShippingAddressCreate, ShippingAddressUpdate
from app.core.dependencies import err


FREESHIP_THRESHOLD = Decimal("200000")


class DeliveryService:
    @staticmethod
    async def create_address(
        db: AsyncSession, user_id: int, address: ShippingAddressCreate
    ) -> ShippingAddress:
        """Create a new shipping address. Auto-set as default if first address."""
        if address.is_default:
            # Clear previous defaults
            await db.execute(
                select(ShippingAddress).where(
                    and_(
                        ShippingAddress.user_id == user_id,
                        ShippingAddress.is_default == True,
                    )
                )
            )
            result = await db.execute(
                select(ShippingAddress).where(
                    and_(
                        ShippingAddress.user_id == user_id,
                        ShippingAddress.is_default == True,
                    )
                )
            )
            for addr in result.scalars().all():
                addr.is_default = False

        # Check if this will be the first address
        result = await db.execute(
            select(ShippingAddress).where(ShippingAddress.user_id == user_id)
        )
        is_first = result.scalar_one_or_none() is None

        db_address = ShippingAddress(
            user_id=user_id,
            full_name=address.full_name,
            phone=address.phone,
            address_line=address.address_line,
            ward=address.ward,
            district=address.district,
            city=address.city,
            is_default=address.is_default or is_first,
        )
        db.add(db_address)
        await db.flush()
        return db_address

    @staticmethod
    async def get_addresses(db: AsyncSession, user_id: int) -> list[ShippingAddress]:
        """Get all addresses for user."""
        result = await db.execute(
            select(ShippingAddress)
            .where(ShippingAddress.user_id == user_id)
            .order_by(ShippingAddress.is_default.desc(), ShippingAddress.created_at.desc())
        )
        return result.scalars().all()

    @staticmethod
    async def get_default_address(
        db: AsyncSession, user_id: int
    ) -> ShippingAddress | None:
        """Get user's default shipping address."""
        result = await db.execute(
            select(ShippingAddress).where(
                and_(ShippingAddress.user_id == user_id, ShippingAddress.is_default == True)
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_address(
        db: AsyncSession, address_id: int, user_id: int, address: ShippingAddressUpdate
    ) -> ShippingAddress:
        """Update a shipping address."""
        result = await db.execute(
            select(ShippingAddress).where(
                and_(
                    ShippingAddress.address_id == address_id,
                    ShippingAddress.user_id == user_id,
                )
            )
        )
        db_address = result.scalar_one_or_none()
        if not db_address:
            err("NOT_FOUND", "Address not found", 404)

        if address.is_default and not db_address.is_default:
            # Clear other defaults
            result = await db.execute(
                select(ShippingAddress).where(
                    and_(
                        ShippingAddress.user_id == user_id,
                        ShippingAddress.is_default == True,
                    )
                )
            )
            for addr in result.scalars().all():
                addr.is_default = False

        for key, value in address.model_dump(exclude_unset=True).items():
            setattr(db_address, key, value)

        await db.flush()
        return db_address

    @staticmethod
    async def delete_address(db: AsyncSession, address_id: int, user_id: int) -> bool:
        """Delete a shipping address."""
        result = await db.execute(
            select(ShippingAddress).where(
                and_(
                    ShippingAddress.address_id == address_id,
                    ShippingAddress.user_id == user_id,
                )
            )
        )
        db_address = result.scalar_one_or_none()
        if not db_address:
            return False
        await db.delete(db_address)
        await db.flush()
        return True

    @staticmethod
    def calculate_shipping_fee(subtotal: Decimal) -> dict:
        """Calculate shipping fee. Free if subtotal >= 200k VND."""
        if subtotal >= FREESHIP_THRESHOLD:
            return {"shipping_fee": Decimal("0"), "is_freeship": True}

        # Mock: real implementation would call GHN/Ahamove API
        # For now, fixed fee of 25000 for distances < 10km
        shipping_fee = Decimal("25000")
        return {"shipping_fee": shipping_fee, "is_freeship": False}
