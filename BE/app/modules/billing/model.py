from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Date, Text
from app.core.database import Base


class Invoice(Base):
    """schema_erd.sql: INVOICES — the unified payment record for any purchase
    (design-level umbrella over the live app's per-domain payment fields)."""
    __tablename__ = "invoices"

    invoice_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    guest_phone = Column(String(15), nullable=True)
    guest_session_token = Column(String(255), nullable=True)
    invoice_type = Column(String(30), nullable=False)
    payment_gateway_tx_id = Column(String(255), nullable=True)
    subtotal = Column(Numeric(12, 2), nullable=False)
    fitcoin_discount = Column(Numeric(12, 2), default=0, nullable=False)
    shipping_fee = Column(Numeric(12, 2), default=0, nullable=False)
    total_amount = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String(30), nullable=False)
    payment_status = Column(String(30), default="pending", nullable=False)
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class NutritionOrder(Base):
    """schema_erd.sql: NUTRITION_ORDERS — order header linked to an Invoice."""
    __tablename__ = "nutrition_orders"

    order_id = Column(Integer, primary_key=True)
    invoice_id = Column(Integer, ForeignKey("invoices.invoice_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    delivery_type = Column(String(30), nullable=False)
    shipping_address_id = Column(Integer, ForeignKey("shipping_addresses.address_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class OrderItem(Base):
    """schema_erd.sql: ORDER_ITEMS — normalized line items for a NutritionOrder
    (design-level counterpart to the live app's food_orders.items JSON blob)."""
    __tablename__ = "order_items"

    order_item_id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("nutrition_orders.order_id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Numeric(12, 2), nullable=False)


class GearRental(Base):
    """schema_erd.sql: GEAR_RENTALS — a rental of one serialized GearItem."""
    __tablename__ = "gear_rentals"

    rental_id = Column(Integer, primary_key=True)
    invoice_id = Column(Integer, ForeignKey("invoices.invoice_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    gear_item_id = Column(String(20), ForeignKey("gear_items.gear_id", ondelete="CASCADE"), nullable=False)
    rent_start_date = Column(Date, nullable=False)
    rent_end_expected = Column(Date, nullable=False)
    rent_end_actual = Column(Date, nullable=True)
    status = Column(String(30), default="active", nullable=False)
    penalty_amount = Column(Numeric(12, 2), default=0, nullable=False)
    refund_amount = Column(Numeric(12, 2), default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class GearReturnInspection(Base):
    """schema_erd.sql: GEAR_RETURN_INSPECTIONS — staff condition check on gear return."""
    __tablename__ = "gear_return_inspections"

    inspection_id = Column(Integer, primary_key=True)
    rental_id = Column(Integer, ForeignKey("gear_rentals.rental_id", ondelete="CASCADE"), nullable=False)
    inspected_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    condition_on_return = Column(String(50), nullable=False)
    penalty_applied = Column(Numeric(12, 2), default=0, nullable=False)
    notes = Column(Text, nullable=True)
    inspected_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class MembershipHistory(Base):
    """schema_erd.sql: MEMBERSHIP_HISTORY — audit trail of renew/upgrade/freeze/cancel actions."""
    __tablename__ = "membership_history"

    history_id = Column(Integer, primary_key=True)
    membership_id = Column(Integer, ForeignKey("gym_memberships.membership_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(Integer, ForeignKey("membership_plans.plan_id", ondelete="SET NULL"), nullable=True)
    invoice_id = Column(Integer, ForeignKey("invoices.invoice_id", ondelete="SET NULL"), nullable=True)
    action_type = Column(String(30), nullable=False)
    old_end_date = Column(Date, nullable=True)
    new_end_date = Column(Date, nullable=True)
    price_paid = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
