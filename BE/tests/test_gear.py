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
async def test_member_can_buy_gear(client, owner_token, member_token):
    create_resp = await client.post("/api/gear/", json={
        "name": "Buyable Dumbbell", "category": "Weights", "condition_rating": 5,
        "listing_type": "sell", "sell_price": 500000,
    }, headers={"Authorization": f"Bearer {owner_token}"})
    gear_id = create_resp.json()["data"]["gear_id"]

    buy_resp = await client.post(f"/api/gear/{gear_id}/buy",
                                  headers={"Authorization": f"Bearer {member_token}"})
    assert buy_resp.status_code == 200
    txn = buy_resp.json()["data"]
    assert txn["type"] == "sale"
    assert float(txn["amount"]) == 500000

    # Sold gear is no longer available for a second buyer.
    get_resp = await client.get(f"/api/gear/{gear_id}")
    assert get_resp.json()["data"]["is_available"] is False


@pytest.mark.asyncio
async def test_checkout_gear_cart_partial_failure(client, owner_token, member_token):
    ids = []
    for i in range(2):
        r = await client.post("/api/gear/", json={
            "name": f"Cart Item {i}", "category": "Weights", "condition_rating": 5,
            "listing_type": "sell", "sell_price": 100000,
        }, headers={"Authorization": f"Bearer {owner_token}"})
        ids.append(r.json()["data"]["gear_id"])

    # Cart has both real items plus a duplicate of the first (simulates qty=2 on one line) —
    # the duplicate must fail gracefully (already sold) without blocking the rest.
    resp = await client.post("/api/gear/checkout",
                              json={"gear_ids": [ids[0], ids[1], ids[0]]},
                              headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert len(data["transactions"]) == 2
    assert len(data["errors"]) == 1
    assert data["errors"][0]["gear_id"] == ids[0]


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
