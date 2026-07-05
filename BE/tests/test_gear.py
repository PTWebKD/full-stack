import pytest


@pytest.mark.asyncio
async def test_list_gear_public(client):
    resp = await client.get("/api/gear/")
    assert resp.status_code == 200
    assert isinstance(resp.json()["data"], list)


@pytest.mark.asyncio
async def test_gear_not_found(client):
    resp = await client.get("/api/gear/GEAR-XXXX-XXXX")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_member_cannot_list_gear(client, member_token):
    # BR-11B: gear is gym-owned inventory (B2C only) — Member can never list.
    resp = await client.post("/api/gear/", json={
        "name": "Test Dumbbell",
        "category": "Weights",
        "condition_rating": 3,
        "listing_type": "rent",
        "rent_price_day": 50000,
    }, headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_gym_owner_can_sell(client, owner_token):
    resp = await client.post("/api/gear/", json={
        "name": "Olympic Barbell",
        "category": "Weights",
        "condition_rating": 5,
        "listing_type": "sell",
        "sell_price": 3000000,
    }, headers={"Authorization": f"Bearer {owner_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["listing_type"] == "sell"


@pytest.mark.asyncio
async def test_gym_owner_can_rent(client, owner_token):
    resp = await client.post("/api/gear/", json={
        "name": "Rental Kettlebell",
        "category": "Weights",
        "condition_rating": 4,
        "listing_type": "rent",
        "rent_price_day": 20000,
    }, headers={"Authorization": f"Bearer {owner_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["listing_type"] == "rent"


@pytest.mark.asyncio
async def test_lifecycle_is_created_on_listing(client, owner_token):
    create_resp = await client.post("/api/gear/", json={
        "name": "Yoga Mat",
        "category": "Accessories",
        "condition_rating": 4,
        "listing_type": "rent",
        "rent_price_day": 30000,
    }, headers={"Authorization": f"Bearer {owner_token}"})
    gear_id = create_resp.json()["data"]["gear_id"]

    lifecycle_resp = await client.get(f"/api/gear/{gear_id}/lifecycle")
    assert lifecycle_resp.status_code == 200
    events = lifecycle_resp.json()["data"]
    assert len(events) >= 1
    assert events[0]["action"] == "listed"
