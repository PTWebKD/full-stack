from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class ShippingAddressBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    address_line: str = Field(..., min_length=5, max_length=300)
    ward: str = Field(..., min_length=1, max_length=100)
    district: str = Field(..., min_length=1, max_length=100)
    city: str = Field(default="Ho Chi Minh", max_length=100)
    is_default: bool = False


class ShippingAddressCreate(ShippingAddressBase):
    pass


class ShippingAddressUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address_line: Optional[str] = None
    ward: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    is_default: Optional[bool] = None


class ShippingAddressResponse(ShippingAddressBase):
    address_id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class DeliveryChoiceRequest(BaseModel):
    """For order checkout: choose pickup or delivery"""
    delivery_type: str = Field(..., pattern="^(pickup|delivery)$")
    shipping_address_id: Optional[int] = None  # Required if delivery_type == 'delivery'


class ShippingFeeResponse(BaseModel):
    """Response from shipping fee calculation"""
    shipping_fee: Decimal
    is_freeship: bool
    subtotal: Decimal
    total: Decimal
    freeship_threshold: int = 200000  # 200k VND

    model_config = {"from_attributes": True}
