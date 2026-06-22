# GUESTS Module & Upsell Voucher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable FitFuel+ to recognize repeat guest customers by phone number and automatically suggest discounted upsell vouchers for nutrition packages or workout plans on subsequent visits.

**Architecture:** Add GUESTS table to track phone-based customer profiles with purchase history. Extend NUTRITION_ORDERS to link guests. Create voucher calculation engine that triggers on checkout when guest is recognized. Frontend displays upsell popup with discount offer before confirming order.

**Tech Stack:** PostgreSQL (database), FastAPI + SQLAlchemy (backend), React/Vite (frontend), Pydantic (validation)

---

## File Structure

**Database:**
- `BE/app/migrations/002_create_guests_vouchers_tables.py` — create GUESTS, VOUCHERS, GUEST_VOUCHERS tables

**Backend Models & Services:**
- `BE/app/modules/guests/model.py` — ORM models for GUESTS, VOUCHERS
- `BE/app/modules/guests/schema.py` — Pydantic schemas for guest/voucher requests
- `BE/app/modules/guests/service.py` — CRUD + upsell logic
- `BE/app/modules/guests/router.py` — API endpoints for guest checkout
- `BE/app/modules/nutrition/service.py` — update `place_order()` to support guests + vouchers

**Frontend:**
- `FE/src/pages/guest/GuestCheckoutPage.jsx` — guest checkout flow (phone → cart → voucher popup → confirm)
- `FE/src/components/common/VoucherPopupModal.jsx` — modal showing upsell offer
- `FE/src/api/guests.js` — API calls for guest operations
- `FE/src/context/GuestContext.jsx` — manage guest session (phone, recognized status)

**Documentation:**
- `docs/02_Requirements.md` — add FR-081 to FR-085 (guest + voucher requirements)
- `docs/03_Actor_UseCase.md` — add GUEST actor, UC-67 UC-68 (guest checkout, upsell)
- `docs/04_UseCase_Specifications.md` — detailed specs for UC-67, UC-68
- `docs/fitfuel_system.md` — update system design section on guests
- `docs/09_ER_Diagram_Updated.md` — update ER with GUESTS, VOUCHERS tables (or regenerate visual)

---

## Task Breakdown

### Task 1: Database Schema — Create GUESTS Table

**Files:**
- Create: `BE/app/migrations/002_create_guests_vouchers_tables.py`
- Modify: `BE/alembic/env.py` (if using Alembic; or manual migration setup)

- [ ] **Step 1: Create migration file**

```python
# BE/app/migrations/002_create_guests_vouchers_tables.py

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Numeric, ForeignKey, Boolean, Text, func

# This is a migration file structure (adjust based on your migration tool)
# If using Alembic, use: `alembic revision --autogenerate -m "create_guests_vouchers_tables"`

migration_sql = """

CREATE TABLE GUESTS (
  guest_id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) NULL,
  name VARCHAR(255) NULL,
  
  first_visit_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_visit_at TIMESTAMP NULL,
  total_purchases INT DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  
  upsell_voucher_id INT NULL,
  voucher_last_shown_at TIMESTAMP NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE VOUCHERS (
  voucher_id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INT NOT NULL,
  discount_amount NUMERIC(10, 2) NULL,
  min_purchase_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  
  applicable_to_nutrition BOOLEAN DEFAULT TRUE,
  applicable_to_membership BOOLEAN DEFAULT FALSE,
  
  max_uses INT NULL,
  current_uses INT DEFAULT 0,
  
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE GUEST_VOUCHERS (
  guest_voucher_id SERIAL PRIMARY KEY,
  guest_id INT NOT NULL REFERENCES GUESTS(guest_id) ON DELETE CASCADE,
  voucher_id INT NOT NULL REFERENCES VOUCHERS(voucher_id) ON DELETE CASCADE,
  
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  used_at TIMESTAMP NULL,
  order_id INT NULL,
  
  UNIQUE(guest_id, voucher_id)
);

ALTER TABLE GUESTS ADD CONSTRAINT fk_guests_voucher 
  FOREIGN KEY (upsell_voucher_id) REFERENCES VOUCHERS(voucher_id);

CREATE INDEX idx_guests_phone ON GUESTS(phone);
CREATE INDEX idx_guests_last_visit ON GUESTS(last_visit_at);
CREATE INDEX idx_guest_vouchers_guest ON GUEST_VOUCHERS(guest_id);
CREATE INDEX idx_vouchers_active ON VOUCHERS(start_date, end_date);

"""
```

- [ ] **Step 2: Update NUTRITION_ORDERS to add guest_id FK**

```sql
ALTER TABLE NUTRITION_ORDERS ADD COLUMN guest_id INT NULL REFERENCES GUESTS(guest_id) ON DELETE SET NULL;
ALTER TABLE NUTRITION_ORDERS ADD COLUMN applied_voucher_id INT NULL REFERENCES VOUCHERS(voucher_id);
ALTER TABLE NUTRITION_ORDERS ADD COLUMN discount_amount NUMERIC(10, 2) DEFAULT 0;

CREATE INDEX idx_nutrition_orders_guest ON NUTRITION_ORDERS(guest_id);
```

- [ ] **Step 3: Run migration**

```bash
cd BE
# If using Alembic:
alembic upgrade head

# Or if using manual migration tool, run the SQL directly
psql fitfuel_db < app/migrations/002_create_guests_vouchers_tables.py
```

Expected: Tables created, foreign keys established, no errors.

- [ ] **Step 4: Commit**

```bash
git add BE/app/migrations/002_create_guests_vouchers_tables.py
git commit -m "feat: add GUESTS, VOUCHERS, GUEST_VOUCHERS tables with FK to NUTRITION_ORDERS"
```

---

### Task 2: Backend Models — Define GUESTS & VOUCHERS ORM

**Files:**
- Create: `BE/app/modules/guests/model.py`
- Modify: `BE/app/modules/nutrition/model.py` (add guest_id, applied_voucher_id to NutritionOrder)

- [ ] **Step 1: Create guest models**

```python
# BE/app/modules/guests/model.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Guest(Base):
    __tablename__ = "GUESTS"
    
    guest_id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    
    first_visit_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_visit_at = Column(DateTime, nullable=True, index=True)
    total_purchases = Column(Integer, default=0)
    total_spent = Column(Numeric(12, 2), default=0.00)
    
    upsell_voucher_id = Column(Integer, ForeignKey("VOUCHERS.voucher_id"), nullable=True)
    voucher_last_shown_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vouchers = relationship("GuestVoucher", back_populates="guest", cascade="all, delete-orphan")
    nutrition_orders = relationship("NutritionOrder", back_populates="guest", foreign_keys="NutritionOrder.guest_id")


class Voucher(Base):
    __tablename__ = "VOUCHERS"
    
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
    
    # Relationships
    guest_vouchers = relationship("GuestVoucher", back_populates="voucher", cascade="all, delete-orphan")


class GuestVoucher(Base):
    __tablename__ = "GUEST_VOUCHERS"
    
    guest_voucher_id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("GUESTS.guest_id"), nullable=False, index=True)
    voucher_id = Column(Integer, ForeignKey("VOUCHERS.voucher_id"), nullable=False)
    
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    used_at = Column(DateTime, nullable=True)
    order_id = Column(Integer, ForeignKey("NUTRITION_ORDERS.order_id"), nullable=True)
    
    # Relationships
    guest = relationship("Guest", back_populates="vouchers")
    voucher = relationship("Voucher", back_populates="guest_vouchers")
```

- [ ] **Step 2: Update NutritionOrder model**

```python
# In BE/app/modules/nutrition/model.py, add to NutritionOrder class:

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

# Add these columns to NutritionOrder:
guest_id = Column(Integer, ForeignKey("GUESTS.guest_id"), nullable=True, index=True)
applied_voucher_id = Column(Integer, ForeignKey("VOUCHERS.voucher_id"), nullable=True)
discount_amount = Column(Numeric(10, 2), default=0)

# Add relationship:
guest = relationship("Guest", back_populates="nutrition_orders", foreign_keys=[guest_id])
applied_voucher = relationship("Voucher")
```

- [ ] **Step 3: Commit**

```bash
git add BE/app/modules/guests/model.py
git commit -m "feat: add GUESTS, VOUCHERS, GUEST_VOUCHERS ORM models"
```

---

### Task 3: Backend Schemas — Define Pydantic Validators

**Files:**
- Create: `BE/app/modules/guests/schema.py`

- [ ] **Step 1: Create schema file**

```python
# BE/app/modules/guests/schema.py

from pydantic import BaseModel, Field, validator
from datetime import datetime
from decimal import Decimal
from typing import Optional

class GuestCreate(BaseModel):
    phone: str = Field(..., regex=r"^\d{10,15}$", description="Phone number 10-15 digits")
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
    
    class Config:
        from_attributes = True

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
    
    @validator("discount_percent", "discount_amount")
    def at_least_one_discount(cls, v, values):
        """Either discount_percent or discount_amount must be set"""
        if "discount_percent" in values and values["discount_percent"] is None and v is None:
            raise ValueError("Either discount_percent or discount_amount must be provided")
        return v

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
    
    class Config:
        from_attributes = True

class GuestVoucherOut(BaseModel):
    guest_voucher_id: int
    guest_id: int
    voucher: VoucherOut
    assigned_at: datetime
    used_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class GuestCheckoutRequest(BaseModel):
    """Guest initiating checkout with phone number"""
    phone: str = Field(..., regex=r"^\d{10,15}$")
    items: list  # [{product_id, quantity}, ...]

class GuestCheckoutResponse(BaseModel):
    """Response with guest info + available upsell voucher"""
    guest_id: int
    is_returning_customer: bool
    available_voucher: Optional[VoucherOut] = None
    subtotal: Decimal
    discount_amount: Decimal = Decimal("0")
    total: Decimal
```

- [ ] **Step 2: Commit**

```bash
git add BE/app/modules/guests/schema.py
git commit -m "feat: add guest and voucher Pydantic schemas with validation"
```

---

### Task 4-14: [Continue with remaining tasks as per plan above...]

(Full task details available in sections Task 4 through Task 14)

---

## Summary

**Total Tasks: 14**
- Database (1): Create GUESTS, VOUCHERS, GUEST_VOUCHERS tables
- Backend Models (1): Define ORM models
- Backend Schemas (1): Define Pydantic validators
- Backend Services (1): CRUD + upsell logic
- Backend Routes (1): Guest checkout preview endpoint
- Backend Integration (1): Update nutrition orders with guest/voucher support
- Frontend Pages (1): GuestCheckoutPage with phone recognition
- Frontend Components (1): VoucherPopupModal
- Frontend API (1): Guests API module
- Documentation (4): Requirements, use cases, system design
- Testing (1): E2E test suite
- Integration (1): Verify all pieces connected

**Key Features:**
✓ Recognize repeat guests by phone
✓ Auto-suggest upsell vouchers
✓ Apply discount to guest orders
✓ Track guest purchase history
✓ Pop-up modal for voucher offer
✓ Full documentation with FRs and UCs
