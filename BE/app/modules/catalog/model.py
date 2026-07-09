from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Text
from app.core.database import Base


class Product(Base):
    """schema_erd.sql: PRODUCTS — generic sellable/rentable product catalog entry
    (design-level umbrella over the live app's food_products / gear_items tables)."""
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    deposit_amount = Column(Numeric(12, 2), default=0, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)


class Inventory(Base):
    """schema_erd.sql: INVENTORY — stock count + low-stock threshold for a Product."""
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, default=0, nullable=False)
    warning_threshold = Column(Integer, default=5, nullable=False)
    status = Column(String(30), default="in_stock", nullable=False)
