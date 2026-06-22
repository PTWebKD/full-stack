from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
from decimal import Decimal
from typing import Optional


class GuestCreate(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10,15}$", description="Phone number 10-15 digits")
    email: Optional[str] = None
    name: Optional[str] = None


class GuestUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None


class GuestOut(BaseModel):
    guest_id: int
    phone: str
    email: Optional[str]
    name: Optional[str]
    first_visit_at: datetime
    last_visit_at: Optional[datetime]
    total_purchases: int
    total_spent: Decimal

    model_config = {"from_attributes": True}


class VoucherCreate(BaseModel):
    code: str = Field(..., max_length=50)
    discount_percent: Optional[int] = None  # e.g., 20
    discount_amount: Optional[Decimal] = None  # e.g., 50000
    min_purchase_amount: Decimal = Decimal("0")
    applicable_to_nutrition: bool = True
    applicable_to_membership: bool = False
    max_uses: Optional[int] = None
    start_date: datetime
    end_date: datetime
    description: Optional[str] = None

    @model_validator(mode="after")
    def at_least_one_discount(self):
        """Either discount_percent or discount_amount must be set"""
        if self.discount_percent is None and self.discount_amount is None:
            raise ValueError("Either discount_percent or discount_amount must be provided")
        return self


class VoucherOut(BaseModel):
    voucher_id: int
    code: str
    discount_percent: Optional[int]
    discount_amount: Optional[Decimal]
    min_purchase_amount: Decimal
    applicable_to_nutrition: bool
    applicable_to_membership: bool
    max_uses: Optional[int]
    current_uses: int
    start_date: datetime
    end_date: datetime
    description: Optional[str]

    model_config = {"from_attributes": True}


class GuestVoucherOut(BaseModel):
    guest_voucher_id: int
    guest_id: int
    voucher: VoucherOut
    assigned_at: datetime
    used_at: Optional[datetime]

    model_config = {"from_attributes": True}


class GuestCheckoutRequest(BaseModel):
    """Guest initiating checkout with phone number"""
    phone: str = Field(..., pattern=r"^\d{10,15}$")
    items: list  # [{product_id, quantity}, ...]


class GuestCheckoutResponse(BaseModel):
    """Response with guest info + available upsell voucher"""
    guest_id: int
    is_returning_customer: bool
    available_voucher: Optional[VoucherOut] = None
    subtotal: Decimal
    discount_amount: Decimal = Decimal("0")
    total: Decimal
