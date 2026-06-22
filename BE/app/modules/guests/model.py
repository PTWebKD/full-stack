from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class Guest(Base):
    __tablename__ = "guests"

    guest_id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)

    first_visit_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_visit_at = Column(DateTime, nullable=True, index=True)
    total_purchases = Column(Integer, default=0)
    total_spent = Column(Numeric(12, 2), default=0.00)

    upsell_voucher_id = Column(Integer, ForeignKey("vouchers.voucher_id"), nullable=True)
    voucher_last_shown_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    vouchers = relationship("GuestVoucher", back_populates="guest", cascade="all, delete-orphan")
    nutrition_orders = relationship("FoodOrder", back_populates="guest", foreign_keys="[FoodOrder.guest_id]")


class Voucher(Base):
    __tablename__ = "vouchers"

    voucher_id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    discount_percent = Column(Integer, nullable=True)  # e.g., 20 = 20%
    discount_amount = Column(Numeric(10, 2), nullable=True)  # flat amount e.g., 50k VND
    min_purchase_amount = Column(Numeric(10, 2), default=0)

    applicable_to_nutrition = Column(Boolean, default=True)
    applicable_to_membership = Column(Boolean, default=False)

    max_uses = Column(Integer, nullable=True)  # NULL = unlimited
    current_uses = Column(Integer, default=0)

    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)

    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    guest_vouchers = relationship("GuestVoucher", back_populates="voucher", cascade="all, delete-orphan")
    food_orders = relationship("FoodOrder", back_populates="applied_voucher")


class GuestVoucher(Base):
    __tablename__ = "guest_vouchers"

    guest_voucher_id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("guests.guest_id"), nullable=False, index=True)
    voucher_id = Column(Integer, ForeignKey("vouchers.voucher_id"), nullable=False)

    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    used_at = Column(DateTime, nullable=True)
    order_id = Column(Integer, ForeignKey("food_orders.order_id", ondelete="SET NULL"), nullable=True)

    # Relationships
    guest = relationship("Guest", back_populates="vouchers")
    voucher = relationship("Voucher", back_populates="guest_vouchers")
