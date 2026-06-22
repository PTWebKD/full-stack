import pytest
from decimal import Decimal


class TestDeliveryRouter:
    """Tests for delivery API endpoints"""

    @pytest.mark.asyncio
    async def test_create_address_endpoint(self, client, member_token):
        """POST /api/delivery/addresses — create address"""
        payload = {
            "full_name": "Nguyen Van A",
            "phone": "0912345678",
            "address_line": "123 Main St",
            "ward": "Ben Nghe",
            "district": "District 1",
            "city": "Ho Chi Minh",
            "is_default": False
        }
        response = await client.post(
            "/api/delivery/addresses",
            json=payload,
            headers={"Authorization": f"Bearer {member_token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data['full_name'] == "Nguyen Van A"
        assert data['phone'] == "0912345678"
        assert 'address_id' in data

    @pytest.mark.asyncio
    async def test_get_addresses_endpoint(self, client, member_token):
        """GET /api/delivery/addresses — list addresses"""
        # Create test address
        payload = {
            "full_name": "Test",
            "phone": "0912345678",
            "address_line": "Address details",
            "ward": "Ward",
            "district": "Dist",
            "city": "HCM"
        }
        await client.post(
            "/api/delivery/addresses",
            json=payload,
            headers={"Authorization": f"Bearer {member_token}"}
        )

        # Get addresses
        response = await client.get(
            "/api/delivery/addresses",
            headers={"Authorization": f"Bearer {member_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    @pytest.mark.asyncio
    async def test_get_default_address_endpoint(self, client, member_token):
        """GET /api/delivery/addresses/default — get default address"""
        # Get default - should get first created address from earlier test
        response = await client.get(
            "/api/delivery/addresses/default",
            headers={"Authorization": f"Bearer {member_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data is not None
        assert 'address_id' in data
        assert data['is_default'] is True

    @pytest.mark.asyncio
    async def test_update_address_endpoint(self, client, member_token):
        """PUT /api/delivery/addresses/{address_id} — update address"""
        # Create address
        payload = {
            "full_name": "Old Name",
            "phone": "0912345678",
            "address_line": "Address details",
            "ward": "Ward",
            "district": "Dist",
            "city": "HCM"
        }
        create_response = await client.post(
            "/api/delivery/addresses",
            json=payload,
            headers={"Authorization": f"Bearer {member_token}"}
        )
        addr_id = create_response.json()['address_id']

        # Update
        update_payload = {"full_name": "New Name"}
        response = await client.put(
            f"/api/delivery/addresses/{addr_id}",
            json=update_payload,
            headers={"Authorization": f"Bearer {member_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data['full_name'] == "New Name"

    @pytest.mark.asyncio
    async def test_delete_address_endpoint(self, client, member_token):
        """DELETE /api/delivery/addresses/{address_id} — delete address"""
        # Create address
        payload = {
            "full_name": "To Delete",
            "phone": "0912345678",
            "address_line": "Address details",
            "ward": "Ward",
            "district": "Dist",
            "city": "HCM"
        }
        create_response = await client.post(
            "/api/delivery/addresses",
            json=payload,
            headers={"Authorization": f"Bearer {member_token}"}
        )
        addr_id = create_response.json()['address_id']

        # Delete
        response = await client.delete(
            f"/api/delivery/addresses/{addr_id}",
            headers={"Authorization": f"Bearer {member_token}"}
        )
        assert response.status_code == 204

    @pytest.mark.asyncio
    async def test_shipping_fee_endpoint_below_threshold(self, client):
        """POST /api/delivery/shipping-fee — calculate fee < 200k"""
        response = await client.post(
            "/api/delivery/shipping-fee",
            params={"subtotal": 100000}
        )
        assert response.status_code == 200
        data = response.json()
        assert float(data['shipping_fee']) == 25000.0
        assert data['is_freeship'] is False

    @pytest.mark.asyncio
    async def test_shipping_fee_endpoint_freeship(self, client):
        """POST /api/delivery/shipping-fee — freeship >= 200k"""
        response = await client.post(
            "/api/delivery/shipping-fee",
            params={"subtotal": 250000}
        )
        assert response.status_code == 200
        data = response.json()
        assert float(data['shipping_fee']) == 0.0
        assert data['is_freeship'] is True
