"""
Referral code helpers (UC-11).

The code is deterministically derived from the user's id — no extra DB column
needed, and it's trivially reversible so redemption is just a lookup by id.
"""

REFERRAL_PREFIX = "FIT"


def make_referral_code(user_id: int) -> str:
    return f"{REFERRAL_PREFIX}{user_id:05d}"


def decode_referral_code(code: str | None) -> int | None:
    if not code:
        return None
    code = code.strip().upper()
    if not code.startswith(REFERRAL_PREFIX):
        return None
    tail = code[len(REFERRAL_PREFIX):]
    if not tail.isdigit():
        return None
    return int(tail)
