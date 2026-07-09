import pytest
from app.modules.users.referral_utils import make_referral_code


@pytest.mark.asyncio
async def test_referral_endpoint_returns_own_code(client, member_token, member_user):
    resp = await client.get("/api/users/me/referral", headers={"Authorization": f"Bearer {member_token}"})
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["referral_code"] == make_referral_code(member_user.user_id)
    assert data["referred_count"] == 0
    assert float(data["total_referral_fitcoin"]) == 0


@pytest.mark.asyncio
async def test_register_with_valid_referral_code_grants_bonus_to_both_sides(client, member_user):
    code = make_referral_code(member_user.user_id)
    resp = await client.post("/api/auth/register", json={
        "email": "referred_friend@test.com",
        "password": "password123",
        "display_name": "Referred Friend",
        "referral_code": code,
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["referral_bonus_granted"] is True
    assert data["referrer_name"] == member_user.display_name
    assert data["referral_bonus_amount"] == 50

    # The new user actually received the FitCoin bonus.
    login_resp = await client.post("/api/auth/login", json={
        "email": "referred_friend@test.com", "password": "password123",
    })
    new_token = login_resp.json()["data"]["access_token"]
    balance_resp = await client.get("/api/fitcoin/balance", headers={"Authorization": f"Bearer {new_token}"})
    assert balance_resp.json()["data"]["balance"] == 50


@pytest.mark.asyncio
async def test_register_with_invalid_referral_code_still_succeeds_without_bonus(client):
    resp = await client.post("/api/auth/register", json={
        "email": "no_referrer@test.com",
        "password": "password123",
        "display_name": "No Referrer",
        "referral_code": "GARBAGE",
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["referral_bonus_granted"] is False
    assert data["referrer_name"] is None


@pytest.mark.asyncio
async def test_referral_stats_reflect_after_a_signup(client, member_token):
    # Depends on test_register_with_valid_referral_code_grants_bonus_to_both_sides having run.
    resp = await client.get("/api/users/me/referral", headers={"Authorization": f"Bearer {member_token}"})
    data = resp.json()["data"]
    assert data["referred_count"] == 1
    assert float(data["total_referral_fitcoin"]) == 100
