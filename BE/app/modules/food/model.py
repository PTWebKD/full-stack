import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from app.core.database import Base


class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    delivering = "delivering"
    delivered = "delivered"
    cancelled = "cancelled"


class DeliveryType(str, enum.Enum):
    pickup = "pickup"
    delivery = "delivery"


class ShippingProvider(str, enum.Enum):
    GHN = "GHN"
    Ahamove = "Ahamove"


class DeliveryStatus(str, enum.Enum):
    pending = "pending"
    preparing = "preparing"
    shipped = "shipped"
    delivering = "delivering"
    done = "done"
    cancelled = "cancelled"


class FoodProduct(Base):
    __tablename__ = "food_products"

    product_id = Column(Integer, primary_key=True)
    vendor_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    calories = Column(Integer, nullable=False, default=0)
    protein_g = Column(Numeric(5, 1), default=0, nullable=False)
    carb_g = Column(Numeric(5, 1), default=0, nullable=False)
    fat_g = Column(Numeric(5, 1), default=0, nullable=False)
    ingredients = Column(JSON, default=lambda: [], server_default='[]')
    allergens = Column(JSON, default=lambda: [], server_default='[]')
    images = Column(JSON, default=lambda: [], server_default='[]')
    category = Column(String(50))
    badge = Column(String(50))
    is_available = Column(Boolean, default=True, nullable=False)
    avg_rating = Column(Numeric(2, 1), default=0, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)
    total_orders = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    reviews = relationship("FoodReview", back_populates="product")


class FoodOrder(Base):
    __tablename__ = "food_orders"

    order_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    guest_phone = Column(String(15))
    vendor_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    items = Column(JSON, nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), nullable=False, default=15000)
    total_amount = Column(Numeric(12, 2), nullable=False)
    fitcoin_used = Column(Numeric(12, 2), nullable=False, default=0)
    delivery_address = Column(String(500), nullable=False)
    delivery_time = Column(String(50))
    status = Column(Enum(OrderStatus, name="order_status"), nullable=False, default=OrderStatus.pending)
    payment_method = Column(String(50))
    is_meal_prep = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Delivery fields
    delivery_type = Column(Enum(DeliveryType, name="delivery_type_enum"), nullable=False, default=DeliveryType.pickup)
    shipping_address_id = Column(Integer, ForeignKey("shipping_addresses.address_id"), nullable=True, index=True)
    shipping_fee = Column(Numeric(10, 2), nullable=False, default=0)
    tracking_code = Column(String(100), nullable=True)
    shipping_provider = Column(Enum(ShippingProvider, name="shipping_provider_enum"), nullable=True)
    delivery_status = Column(Enum(DeliveryStatus, name="delivery_status_enum"), nullable=True)

    shipping_address = relationship("ShippingAddress", foreign_keys=[shipping_address_id])


class FoodReview(Base):
    __tablename__ = "food_reviews"

    review_id = Column(Integer, primary_key=True)
    product_id = Column(
        Integer, ForeignKey("food_products.product_id", ondelete="CASCADE"), nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    photos = Column(JSON, default=lambda: [], server_default='[]')
    helpful_votes = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    product = relationship("FoodProduct", back_populates="reviews")
