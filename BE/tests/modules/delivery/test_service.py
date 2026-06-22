import pytest
from decimal import Decimal
from app.modules.delivery.service import DeliveryService
from app.modules.delivery.schema import ShippingAddressCreate, ShippingAddressUpdate
from app.modules.delivery.model import ShippingAddress
from sqlalchemy.ext.asyncio import AsyncSession


class TestDeliveryService:
    """Tests for DeliveryService"""

    @pytest.mark.asyncio
    async def test_create_address_first_auto_default(self, session_db: AsyncSession):
        """First address should auto-default to is_default=True"""
        user_id = 9991
        schema = ShippingAddressCreate(
            full_name="Nguyen Van A",
            phone="0912345678",
            address_line="123 Nguyen Hue",
            ward="Ben Nghe",
            district="District 1",
            city="Ho Chi Minh"
        )
        addr = await DeliveryService.create_address(session_db, user_id, schema)
        await session_db.flush()
        assert addr.is_default is True
        assert addr.address_id is not None

    @pytest.mark.asyncio
    async def test_create_address_second_not_default(self, session_db: AsyncSession):
        """Second address should NOT auto-default"""
        user_id = 9992
        schema1 = ShippingAddressCreate(
            full_name="User 1",
            phone="0912345678",
            address_line="Addr 1",
            ward="Ward 1",
            district="Dist 1",
            city="HCM"
        )
        addr1 = await DeliveryService.create_address(session_db, user_id, schema1)
        await session_db.flush()

        schema2 = ShippingAddressCreate(
            full_name="User 2",
            phone="0987654321",
            address_line="Address 2 details",
            ward="Ward 2",
            district="Dist 2",
            city="HCM"
        )
        addr2 = await DeliveryService.create_address(session_db, user_id, schema2)
        await session_db.flush()
        assert addr2.is_default is False

    @pytest.mark.asyncio
    async def test_get_addresses(self, session_db: AsyncSession):
        """Get all addresses for user"""
        user_id = 9993
        schema = ShippingAddressCreate(
            full_name="Test User",
            phone="0912345678",
            address_line="Test Address details",
            ward="Test Ward",
            district="Test Dist",
            city="HCM"
        )
        addr = await DeliveryService.create_address(session_db, user_id, schema)
        await session_db.flush()

        addresses = await DeliveryService.get_addresses(session_db, user_id)
        assert len(addresses) >= 1
        assert any(a.address_id == addr.address_id for a in addresses)

    @pytest.mark.asyncio
    async def test_get_default_address(self, session_db: AsyncSession):
        """Get default address"""
        user_id = 9994
        schema = ShippingAddressCreate(
            full_name="Default User",
            phone="0912345678",
            address_line="Default Address details",
            ward="Ward",
            district="Dist",
            city="HCM"
        )
        addr = await DeliveryService.create_address(session_db, user_id, schema)
        await session_db.flush()

        default = await DeliveryService.get_default_address(session_db, user_id)
        assert default.address_id == addr.address_id

    @pytest.mark.asyncio
    async def test_update_address(self, session_db: AsyncSession):
        """Update address details"""
        user_id = 9995
        schema = ShippingAddressCreate(
            full_name="Old Name",
            phone="0912345678",
            address_line="Old Address details",
            ward="Ward",
            district="Dist",
            city="HCM"
        )
        addr = await DeliveryService.create_address(session_db, user_id, schema)
        await session_db.flush()

        update_schema = ShippingAddressUpdate(
            full_name="New Name",
            phone="0987654321"
        )
        updated = await DeliveryService.update_address(session_db, addr.address_id, user_id, update_schema)
        await session_db.flush()
        assert updated.full_name == "New Name"
        assert updated.phone == "0987654321"

    @pytest.mark.asyncio
    async def test_delete_address(self, session_db: AsyncSession):
        """Delete address"""
        user_id = 9996
        schema = ShippingAddressCreate(
            full_name="To Delete",
            phone="0912345678",
            address_line="Address to delete",
            ward="Ward",
            district="Dist",
            city="HCM"
        )
        addr = await DeliveryService.create_address(session_db, user_id, schema)
        await session_db.flush()

        deleted = await DeliveryService.delete_address(session_db, addr.address_id, user_id)
        await session_db.flush()
        assert deleted is True

        # Verify it's gone
        addresses = await DeliveryService.get_addresses(session_db, user_id)
        assert not any(a.address_id == addr.address_id for a in addresses)

    def test_calculate_shipping_fee_below_threshold(self):
        """Calculate fee when subtotal < 200k (should charge)"""
        result = DeliveryService.calculate_shipping_fee(Decimal("100000"))
        assert result['shipping_fee'] == Decimal("25000")
        assert result['is_freeship'] is False

    def test_calculate_shipping_fee_at_threshold(self):
        """Calculate fee when subtotal >= 200k (freeship)"""
        result = DeliveryService.calculate_shipping_fee(Decimal("200000"))
        assert result['shipping_fee'] == Decimal("0")
        assert result['is_freeship'] is True

    def test_calculate_shipping_fee_above_threshold(self):
        """Calculate fee when subtotal > 200k (freeship)"""
        result = DeliveryService.calculate_shipping_fee(Decimal("300000"))
        assert result['shipping_fee'] == Decimal("0")
        assert result['is_freeship'] is True
