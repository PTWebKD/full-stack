# Delivery Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete Delivery module (FR-072 to FR-080, BR-52 to BR-55) enabling members to choose pickup/delivery, manage shipping addresses, track orders, and receive real-time shipping fees from GHN/Ahamove.

**Architecture:** 
- **Backend (Python/FastAPI):** New `delivery` module with SHIPPING_ADDRESSES model; extend food_orders & invoices with delivery fields; API endpoints for address management, delivery tracking, freeship logic.
- **Frontend (React/Vite):** 4 new pages (/profile/addresses, /orders/:id, /gym-owner/orders, updated /orders); updated checkout flow with delivery choice + address selection + shipping fee display.
- **Database:** Add SHIPPING_ADDRESSES table; extend food_orders, invoices with delivery_type, shipping_address_id, shipping_fee, tracking_code, shipping_provider, delivery_status fields.

**Tech Stack:** 
- Backend: FastAPI, SQLAlchemy, Alembic (migrations)
- Frontend: React 19, React Router 7, Tailwind CSS 4
- Integrations: GHN/Ahamove shipping APIs (mocked for now)

---

## File Structure

**Backend (New Files):**
- `app/modules/delivery/model.py` — SHIPPING_ADDRESSES SQLAlchemy model
- `app/modules/delivery/schema.py` — Pydantic schemas (ShippingAddressCreate, ShippingAddressResponse, etc.)
- `app/modules/delivery/service.py` — Business logic (CRUD, freeship calc, delivery tracking)
- `app/modules/delivery/router.py` — FastAPI endpoints
- `app/modules/delivery/__init__.py` — Module init

**Backend (Modified Files):**
- `app/main.py` — Register delivery router
- `schema.sql` — Add SHIPPING_ADDRESSES table, extend food_orders/invoices columns
- `alembic/versions/` — Create migration (Alembic)

**Frontend (New Files):**
- `src/pages/member/ShippingAddressesPage.jsx` — Manage addresses (/profile/addresses)
- `src/pages/member/OrderDetailPage.jsx` — Order detail with tracking (/orders/:id)
- `src/pages/gymOwner/GymOwnerOrdersPage.jsx` — Delivery order management (/gym-owner/orders)
- `src/components/delivery/DeliveryChoice.jsx` — Pickup/Delivery selector
- `src/components/delivery/AddressSelector.jsx` — Choose or add address
- `src/components/delivery/ShippingFeeDisplay.jsx` — Show fee, freeship threshold

**Frontend (Modified Files):**
- `src/App.jsx` — Add new routes
- `src/pages/member/OrdersPage.jsx` — Add delivery status, address, fee display
- `src/pages/nutrition/NutritionCheckoutPage.jsx` (or similar) — Add delivery choice
- `src/pages/gear/GearCheckoutPage.jsx` — Add delivery choice

---

## Task Breakdown

### Task 1: Create SHIPPING_ADDRESSES Database Table & Migration

**Files:**
- Create: `app/modules/delivery/__init__.py`
- Modify: `schema.sql`
- Modify: `alembic/versions/001_add_shipping_addresses.py` (create new migration file)

- [ ] **Step 1: Create Alembic migration file**

Run:
```bash
cd d:/doanWEDKD/BE
alembic revision --autogenerate -m "add_shipping_addresses_table"
```

- [ ] **Step 2: Write SQL for SHIPPING_ADDRESSES table in migration**

Edit `alembic/versions/XXX_add_shipping_addresses.py`:
```python
def upgrade():
    op.create_table(
        'shipping_addresses',
        sa.Column('address_id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(15), nullable=False),
        sa.Column('address_line', sa.String(300), nullable=False),
        sa.Column('ward', sa.String(100), nullable=False),
        sa.Column('district', sa.String(100), nullable=False),
        sa.Column('city', sa.String(100), nullable=False, server_default='Ho Chi Minh'),
        sa.Column('is_default', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_shipping_addresses_user_id', 'shipping_addresses', ['user_id'])

def downgrade():
    op.drop_table('shipping_addresses')
```

- [ ] **Step 3: Run migration**

```bash
cd d:/doanWEDKD/BE
alembic upgrade head
```

- [ ] **Step 4: Verify table in schema.sql**

Run:
```bash
cd d:/doanWEDKD/BE
psql -d fitfuel -c "\dt shipping_addresses"
```

Expected: Table exists with 8 columns

- [ ] **Step 5: Commit**

```bash
git add alembic/versions/XXX_add_shipping_addresses.py
git commit -m "db: add shipping_addresses table migration"
```

---

### Task 2: Extend food_orders Table with Delivery Fields

**Files:**
- Modify: `alembic/versions/002_extend_food_orders_delivery.py`

- [ ] **Step 1: Create Alembic migration**

```bash
cd d:/doanWEDKD/BE
alembic revision --autogenerate -m "extend_food_orders_with_delivery"
```

- [ ] **Step 2: Add columns to food_orders**

Edit `alembic/versions/002_*.py`:
```python
def upgrade():
    op.add_column('food_orders', sa.Column('delivery_type', sa.Enum('pickup', 'delivery', name='delivery_type_enum'), nullable=False, server_default='pickup'))
    op.add_column('food_orders', sa.Column('shipping_address_id', sa.Integer, sa.ForeignKey('shipping_addresses.address_id'), nullable=True))
    op.add_column('food_orders', sa.Column('shipping_fee', sa.Numeric(10, 2), nullable=False, server_default='0'))
    op.add_column('food_orders', sa.Column('tracking_code', sa.String(100), nullable=True))
    op.add_column('food_orders', sa.Column('shipping_provider', sa.Enum('GHN', 'Ahamove', name='shipping_provider_enum'), nullable=True))
    op.add_column('food_orders', sa.Column('delivery_status', sa.Enum('pending', 'preparing', 'shipped', 'delivering', 'done', 'cancelled', name='delivery_status_enum'), nullable=True))

def downgrade():
    op.drop_column('food_orders', 'delivery_type')
    op.drop_column('food_orders', 'shipping_address_id')
    op.drop_column('food_orders', 'shipping_fee')
    op.drop_column('food_orders', 'tracking_code')
    op.drop_column('food_orders', 'shipping_provider')
    op.drop_column('food_orders', 'delivery_status')
```

- [ ] **Step 3: Run migration**

```bash
alembic upgrade head
```

- [ ] **Step 4: Commit**

```bash
git add alembic/versions/002_*.py
git commit -m "db: extend food_orders with delivery fields"
```

---

### Task 3: Create Delivery Module Model (Backend)

**Files:**
- Create: `app/modules/delivery/model.py`

- [ ] **Step 1: Create SHIPPING_ADDRESSES model**

Create `app/modules/delivery/model.py`:
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class ShippingAddress(Base):
    __tablename__ = "shipping_addresses"

    address_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    address_line = Column(String(300), nullable=False)
    ward = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False, default="Ho Chi Minh")
    is_default = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="shipping_addresses")
```

- [ ] **Step 2: Update User model to include relationship**

Edit `app/modules/users/model.py`, add to User class:
```python
shipping_addresses = relationship("ShippingAddress", back_populates="user", cascade="all, delete-orphan")
```

- [ ] **Step 3: Commit**

```bash
git add app/modules/delivery/model.py
git commit -m "feat: add ShippingAddress model"
```

---

### Task 4: Create Delivery Schema (Backend Pydantic)

**Files:**
- Create: `app/modules/delivery/schema.py`

- [ ] **Step 1: Create Pydantic schemas**

Create `app/modules/delivery/schema.py`:
```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ShippingAddressBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., regex=r"^\+?[0-9]{10,15}$")
    address_line: str = Field(..., min_length=5, max_length=300)
    ward: str = Field(..., min_length=1, max_length=100)
    district: str = Field(..., min_length=1, max_length=100)
    city: str = Field(..., default="Ho Chi Minh", max_length=100)
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

    class Config:
        from_attributes = True

class DeliveryChoiceRequest(BaseModel):
    """For order checkout: choose pickup or delivery"""
    delivery_type: str = Field(..., pattern="^(pickup|delivery)$")
    shipping_address_id: Optional[int] = None  # Required if delivery_type == 'delivery'

class ShippingFeeResponse(BaseModel):
    """Response from shipping fee calculation"""
    shipping_fee: float
    is_freeship: bool
    subtotal: float
    total: float
    freeship_threshold: int = 200000  # 200k VND
```

- [ ] **Step 2: Commit**

```bash
git add app/modules/delivery/schema.py
git commit -m "feat: add delivery schemas (Pydantic)"
```

---

### Task 5: Create Delivery Service (Backend Business Logic)

**Files:**
- Create: `app/modules/delivery/service.py`

- [ ] **Step 1: Create service with CRUD + shipping logic**

Create `app/modules/delivery/service.py`:
```python
from sqlalchemy.orm import Session
from app.modules.delivery.model import ShippingAddress
from app.modules.delivery.schema import ShippingAddressCreate, ShippingAddressUpdate
from sqlalchemy import and_

class DeliveryService:
    @staticmethod
    def create_address(db: Session, user_id: int, address: ShippingAddressCreate) -> ShippingAddress:
        """Create a new shipping address. Auto-set as default if first address."""
        if address.is_default:
            # Clear previous defaults
            db.query(ShippingAddress).filter(
                and_(ShippingAddress.user_id == user_id, ShippingAddress.is_default == True)
            ).update({"is_default": False})
        
        db_address = ShippingAddress(
            user_id=user_id,
            full_name=address.full_name,
            phone=address.phone,
            address_line=address.address_line,
            ward=address.ward,
            district=address.district,
            city=address.city,
            is_default=address.is_default or not db.query(ShippingAddress).filter(ShippingAddress.user_id == user_id).first()
        )
        db.add(db_address)
        db.commit()
        db.refresh(db_address)
        return db_address

    @staticmethod
    def get_addresses(db: Session, user_id: int) -> list[ShippingAddress]:
        """Get all addresses for user."""
        return db.query(ShippingAddress).filter(ShippingAddress.user_id == user_id).all()

    @staticmethod
    def get_default_address(db: Session, user_id: int) -> ShippingAddress | None:
        """Get user's default shipping address."""
        return db.query(ShippingAddress).filter(
            and_(ShippingAddress.user_id == user_id, ShippingAddress.is_default == True)
        ).first()

    @staticmethod
    def update_address(db: Session, address_id: int, user_id: int, address: ShippingAddressUpdate) -> ShippingAddress:
        """Update a shipping address."""
        db_address = db.query(ShippingAddress).filter(
            and_(ShippingAddress.address_id == address_id, ShippingAddress.user_id == user_id)
        ).first()
        if not db_address:
            raise ValueError("Address not found")
        
        if address.is_default and not db_address.is_default:
            # Clear other defaults
            db.query(ShippingAddress).filter(
                and_(ShippingAddress.user_id == user_id, ShippingAddress.is_default == True)
            ).update({"is_default": False})
        
        for key, value in address.dict(exclude_unset=True).items():
            setattr(db_address, key, value)
        
        db.commit()
        db.refresh(db_address)
        return db_address

    @staticmethod
    def delete_address(db: Session, address_id: int, user_id: int) -> bool:
        """Delete a shipping address."""
        result = db.query(ShippingAddress).filter(
            and_(ShippingAddress.address_id == address_id, ShippingAddress.user_id == user_id)
        ).delete()
        db.commit()
        return result > 0

    @staticmethod
    def calculate_shipping_fee(subtotal: float) -> dict:
        """Calculate shipping fee. Free if subtotal >= 200k VND."""
        FREESHIP_THRESHOLD = 200000
        if subtotal >= FREESHIP_THRESHOLD:
            return {"shipping_fee": 0, "is_freeship": True}
        
        # Mock: real implementation would call GHN/Ahamove API
        # For now, fixed fee of 25000 for distances < 10km
        shipping_fee = 25000
        return {"shipping_fee": shipping_fee, "is_freeship": False}
```

- [ ] **Step 2: Commit**

```bash
git add app/modules/delivery/service.py
git commit -m "feat: add delivery service (CRUD + shipping logic)"
```

---

### Task 6: Create Delivery Router (Backend API Endpoints)

**Files:**
- Create: `app/modules/delivery/router.py`
- Create: `app/modules/delivery/__init__.py`

- [ ] **Step 1: Create router with endpoints**

Create `app/modules/delivery/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.modules.users.model import User
from app.modules.delivery.schema import ShippingAddressCreate, ShippingAddressUpdate, ShippingAddressResponse, ShippingFeeResponse
from app.modules.delivery.service import DeliveryService

router = APIRouter(prefix="/api/delivery", tags=["delivery"])

@router.post("/addresses", response_model=ShippingAddressResponse)
def create_address(
    address: ShippingAddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new shipping address for the current user."""
    return DeliveryService.create_address(db, current_user.user_id, address)

@router.get("/addresses", response_model=list[ShippingAddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all shipping addresses for the current user."""
    return DeliveryService.get_addresses(db, current_user.user_id)

@router.get("/addresses/default", response_model=ShippingAddressResponse | None)
def get_default_address(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the default shipping address."""
    return DeliveryService.get_default_address(db, current_user.user_id)

@router.put("/addresses/{address_id}", response_model=ShippingAddressResponse)
def update_address(
    address_id: int,
    address: ShippingAddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a shipping address."""
    try:
        return DeliveryService.update_address(db, address_id, current_user.user_id, address)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a shipping address."""
    if not DeliveryService.delete_address(db, address_id, current_user.user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
    return None

@router.post("/shipping-fee", response_model=ShippingFeeResponse)
def calculate_shipping_fee(subtotal: float):
    """Calculate shipping fee based on subtotal. Free if >= 200k VND."""
    result = DeliveryService.calculate_shipping_fee(subtotal)
    return ShippingFeeResponse(
        shipping_fee=result["shipping_fee"],
        is_freeship=result["is_freeship"],
        subtotal=subtotal,
        total=subtotal + result["shipping_fee"]
    )
```

- [ ] **Step 2: Create __init__.py**

Create `app/modules/delivery/__init__.py`:
```python
# Empty init file
```

- [ ] **Step 3: Register router in main.py**

Edit `app/main.py`, add to router includes:
```python
from app.modules.delivery.router import router as delivery_router

app.include_router(delivery_router)
```

- [ ] **Step 4: Commit**

```bash
git add app/modules/delivery/router.py app/modules/delivery/__init__.py
git commit -m "feat: add delivery API endpoints"
```

---

### Task 7: Update Food Orders Service with Delivery Support

**Files:**
- Modify: `app/modules/food/service.py`

- [ ] **Step 1: Add delivery fields to order creation**

Edit `app/modules/food/service.py`, update `create_order` method to accept delivery parameters:
```python
def create_order(
    db: Session, 
    user_id: int | None,
    items: list,
    subtotal: float,
    delivery_type: str = "pickup",  # NEW
    shipping_address_id: int | None = None,  # NEW
    shipping_fee: float = 0,  # NEW
    vendor_id: int = 1
) -> dict:
    """Create food order with optional delivery."""
    
    # Validate delivery_type
    if delivery_type not in ["pickup", "delivery"]:
        raise ValueError("Invalid delivery_type")
    
    # If delivery, require shipping_address_id
    if delivery_type == "delivery" and not shipping_address_id:
        raise ValueError("shipping_address_id required for delivery")
    
    total_amount = subtotal + shipping_fee
    
    new_order = FoodOrder(
        user_id=user_id,
        vendor_id=vendor_id,
        items=items,
        subtotal=subtotal,
        delivery_fee=shipping_fee,
        total_amount=total_amount,
        delivery_type=delivery_type,  # NEW
        shipping_address_id=shipping_address_id,  # NEW
        shipping_fee=shipping_fee,  # NEW
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return {"order_id": new_order.order_id, "total_amount": new_order.total_amount}
```

- [ ] **Step 2: Commit**

```bash
git add app/modules/food/service.py
git commit -m "feat: add delivery support to food orders"
```

---

### Task 8: Frontend - Add Routes for New Pages

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add new routes**

Edit `src/App.jsx`, add these routes in the member section:
```jsx
<Route path="/profile/addresses" element={<ProtectedRoute allowedRoles={['member']}><ShippingAddressesPage /></ProtectedRoute>} />
<Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['member']}><OrderDetailPage /></ProtectedRoute>} />

// In gym owner section:
<Route path="/gym-owner/orders" element={<ProtectedRoute allowedRoles={['gymOwner']}><GymOwnerOrdersPage /></ProtectedRoute>} />
```

- [ ] **Step 2: Import new page components**

Add imports at top:
```jsx
import ShippingAddressesPage from './pages/member/ShippingAddressesPage';
import OrderDetailPage from './pages/member/OrderDetailPage';
import GymOwnerOrdersPage from './pages/gymOwner/GymOwnerOrdersPage';
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add routes for delivery pages"
```

---

### Task 9: Frontend - Create ShippingAddressesPage

**Files:**
- Create: `src/pages/member/ShippingAddressesPage.jsx`

- [ ] **Step 1: Create page component**

Create `src/pages/member/ShippingAddressesPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { api } from '../../services/api';

export default function ShippingAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    ward: '',
    district: '',
    city: 'Ho Chi Minh',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await api.get('/api/delivery/addresses');
      setAddresses(data || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/delivery/addresses/${editingId}`, form);
      } else {
        await api.post('/api/delivery/addresses', form);
      }
      setForm({
        full_name: '',
        phone: '',
        address_line: '',
        ward: '',
        district: '',
        city: 'Ho Chi Minh',
        is_default: false
      });
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Xóa địa chỉ này?')) {
      try {
        await api.delete(`/api/delivery/addresses/${id}`);
        fetchAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/api/delivery/addresses/${id}`, { is_default: true });
      fetchAddresses();
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

  if (loading) return <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>;

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B]">Địa chỉ giao hàng</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90 transition"
        >
          <Plus className="w-4 h-4" />
          Thêm địa chỉ
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 space-y-4 border border-[#18181B]/10">
          <input
            type="text"
            placeholder="Tên người nhận"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            value={form.address_line}
            onChange={(e) => setForm({ ...form, address_line: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Phường/Xã"
              value={form.ward}
              onChange={(e) => setForm({ ...form, ward: e.target.value })}
              className="px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Quận/Huyện"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="px-3 py-2 rounded-lg bg-[#18181B]/5 text-[#18181B] border border-[#18181B]/10 text-sm"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            />
            <span className="text-[#18181B]/70">Đặt làm địa chỉ mặc định</span>
          </label>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#FF5722] text-white text-sm font-bold hover:bg-[#FF5722]/90">
              {editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="flex-1 px-4 py-2 rounded-lg bg-[#18181B]/10 text-[#18181B] text-sm font-bold hover:bg-[#18181B]/20"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-center text-[#18181B]/40 py-8">Chưa có địa chỉ nào</p>
        ) : (
          addresses.map(addr => (
            <div key={addr.address_id} className="glass rounded-2xl p-4 border border-[#18181B]/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-[#18181B]">{addr.full_name}</p>
                  <p className="text-sm text-[#18181B]/70">{addr.phone}</p>
                  <p className="text-sm text-[#18181B]/70">{addr.address_line}, {addr.ward}, {addr.district}, {addr.city}</p>
                </div>
                <div className="flex gap-2">
                  {addr.is_default && <Star className="w-4 h-4 text-[#FF5722]" />}
                  <button
                    onClick={() => handleSetDefault(addr.address_id)}
                    className={`text-xs px-2 py-1 rounded-lg ${addr.is_default ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#18181B]/10 text-[#18181B]/60'}`}
                  >
                    Mặc định
                  </button>
                  <button
                    onClick={() => handleDelete(addr.address_id)}
                    className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/member/ShippingAddressesPage.jsx
git commit -m "feat: add ShippingAddressesPage (/profile/addresses)"
```

---

### Task 10: Frontend - Create OrderDetailPage

**Files:**
- Create: `src/pages/member/OrderDetailPage.jsx`

- [ ] **Step 1: Create order detail page**

Create `src/pages/member/OrderDetailPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Phone } from 'lucide-react';
import { api } from '../../services/api';

const DELIVERY_STATUSES = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-400' },
  preparing: { label: 'Đang chuẩn bị', color: 'text-orange-400' },
  shipped: { label: 'Đã giao shipper', color: 'text-blue-400' },
  delivering: { label: 'Đang giao', color: 'text-purple-400' },
  done: { label: 'Đã giao', color: 'text-green-400' },
  cancelled: { label: 'Đã hủy', color: 'text-red-400' }
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await api.get(`/api/food/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>;
  if (!order) return <div className="py-16 text-center text-red-500">Không tìm thấy đơn hàng</div>;

  const fmt = (n) => n.toLocaleString('vi-VN');
  const status = DELIVERY_STATUSES[order.status] || { label: order.status, color: 'text-[#18181B]/60' };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-[#18181B]/60 hover:text-[#18181B] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#18181B]/60 font-mono">#{order.order_id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
          <h3 className="font-bold text-[#18181B]">Sản phẩm</h3>
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.name} x{item.qty || 1}</span>
              <span className="font-medium">{fmt((item.price || 0) * (item.qty || 1))}đ</span>
            </div>
          ))}
        </div>

        {order.delivery_type === 'delivery' && (
          <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
            <h3 className="font-bold text-[#18181B] flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ giao hàng
            </h3>
            {order.address ? (
              <div className="text-sm text-[#18181B]/70 space-y-1">
                <p>{order.address.full_name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.address_line}, {order.address.ward}, {order.address.district}, {order.address.city}</p>
              </div>
            ) : (
              <p className="text-sm text-[#18181B]/70">{order.delivery_address}</p>
            )}
          </div>
        )}

        {order.tracking_code && (
          <div className="border-t border-[#18181B]/10 pt-4 space-y-3">
            <h3 className="font-bold text-[#18181B] flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Theo dõi giao hàng
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-[#18181B]/60">Nhà vận chuyển: <span className="font-bold">{order.shipping_provider || 'GHN'}</span></p>
              <p className="text-[#18181B]/60">Mã vận đơn: <span className="font-mono font-bold">{order.tracking_code}</span></p>
              {order.delivery_status && <p className="text-[#18181B]/60">Tình trạng: <span className="font-bold">{DELIVERY_STATUSES[order.delivery_status]?.label || order.delivery_status}</span></p>}
            </div>
          </div>
        )}

        <div className="border-t border-[#18181B]/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#18181B]/60">Tổng sản phẩm:</span>
            <span className="font-bold">{fmt(order.subtotal)}đ</span>
          </div>
          {order.shipping_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#18181B]/60">Phí giao hàng:</span>
              <span className="font-bold">{fmt(order.shipping_fee)}đ</span>
            </div>
          )}
          {order.fitcoin_used > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#18181B]/60">FitCoin dùng:</span>
              <span className="font-bold text-[#FF5722]">-{fmt(order.fitcoin_used)}đ</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#18181B]/10 pt-2">
            <span className="font-bold text-[#18181B]">Tổng cộng:</span>
            <span className="font-bold text-lg text-[#18181B]">{fmt(order.total_amount)}đ</span>
          </div>
        </div>

        <div className="text-xs text-[#18181B]/40 text-right border-t border-[#18181B]/10 pt-4">
          {new Date(order.created_at).toLocaleString('vi-VN')}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/member/OrderDetailPage.jsx
git commit -m "feat: add OrderDetailPage with delivery tracking"
```

---

### Task 11: Frontend - Update OrdersPage with Delivery Info

**Files:**
- Modify: `src/pages/member/OrdersPage.jsx`

- [ ] **Step 1: Update to show delivery info and link to detail**

Edit `src/pages/member/OrdersPage.jsx`, update the order card to include delivery info and link:
```jsx
// In the return JSX, update the order card:
<Link to={`/orders/${order.order_id}`} className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden hover:border-[#FF5722] transition">
  {/* existing header */}
  <div className="px-5 py-3">
    {/* existing items display */}
    
    {/* NEW: Delivery info */}
    {order.delivery_type === 'delivery' && (
      <div className="mt-3 pt-3 border-t border-[#18181B]/10 flex items-center gap-2 text-xs text-[#18181B]/60">
        <Truck className="w-3 h-3" />
        <span>Giao hàng</span>
        {order.shipping_fee > 0 && <span>• Phí: {(order.shipping_fee || 0).toLocaleString('vi-VN')}đ</span>}
      </div>
    )}
    
    {/* existing footer */}
  </div>
</Link>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/member/OrdersPage.jsx
git commit -m "feat: add delivery info to orders list, link to detail page"
```

---

### Task 12: Frontend - Create DeliveryChoice Component

**Files:**
- Create: `src/components/delivery/DeliveryChoice.jsx`

- [ ] **Step 1: Create delivery choice selector**

Create `src/components/delivery/DeliveryChoice.jsx`:
```jsx
import { MapPin, Home } from 'lucide-react';

export default function DeliveryChoice({ value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[#18181B]">Hình thức nhận hàng</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange('pickup')}
          className={`p-3 rounded-lg border-2 transition ${
            value === 'pickup'
              ? 'border-[#FF5722] bg-[#FF5722]/10'
              : 'border-[#18181B]/10 hover:border-[#18181B]/20'
          }`}
        >
          <Home className={`w-4 h-4 mx-auto mb-1 ${value === 'pickup' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`} />
          <p className={`text-xs font-bold ${value === 'pickup' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`}>
            Lấy tại quầy
          </p>
        </button>
        <button
          onClick={() => onChange('delivery')}
          className={`p-3 rounded-lg border-2 transition ${
            value === 'delivery'
              ? 'border-[#FF5722] bg-[#FF5722]/10'
              : 'border-[#18181B]/10 hover:border-[#18181B]/20'
          }`}
        >
          <MapPin className={`w-4 h-4 mx-auto mb-1 ${value === 'delivery' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`} />
          <p className={`text-xs font-bold ${value === 'delivery' ? 'text-[#FF5722]' : 'text-[#18181B]/60'}`}>
            Giao hàng
          </p>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/delivery/DeliveryChoice.jsx
git commit -m "feat: add DeliveryChoice component"
```

---

### Task 13: Frontend - Create AddressSelector Component

**Files:**
- Create: `src/components/delivery/AddressSelector.jsx`

- [ ] **Step 1: Create address selector**

Create `src/components/delivery/AddressSelector.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { api } from '../../services/api';

export default function AddressSelector({ value, onChange }) {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddr, setDefaultAddr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await api.get('/api/delivery/addresses');
      setAddresses(data || []);
      const def = data?.find(a => a.is_default);
      setDefaultAddr(def);
      if (def && !value) onChange(def.address_id);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-sm text-[#18181B]/60">Đang tải...</p>;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#18181B]">Địa chỉ giao hàng</p>
        <a href="/profile/addresses" className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 flex items-center gap-1">
          <Plus className="w-3 h-3" />
          Quản lý
        </a>
      </div>
      {addresses.length === 0 ? (
        <p className="text-sm text-[#18181B]/60">Chưa có địa chỉ. <a href="/profile/addresses" className="text-[#FF5722]">Thêm mới</a></p>
      ) : (
        <div className="space-y-2">
          {addresses.map(addr => (
            <label key={addr.address_id} className="flex items-start gap-3 p-3 rounded-lg border border-[#18181B]/10 hover:border-[#FF5722] cursor-pointer transition">
              <input
                type="radio"
                name="address"
                value={addr.address_id}
                checked={value === addr.address_id}
                onChange={(e) => onChange(Number(e.target.value))}
                className="mt-1"
              />
              <div className="flex-1 text-sm">
                <p className="font-bold text-[#18181B]">{addr.full_name}</p>
                <p className="text-[#18181B]/70">{addr.address_line}, {addr.ward}, {addr.district}</p>
                {addr.is_default && <p className="text-xs text-[#FF5722] mt-1">Mặc định</p>}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/delivery/AddressSelector.jsx
git commit -m "feat: add AddressSelector component"
```

---

### Task 14: Frontend - Create ShippingFeeDisplay Component

**Files:**
- Create: `src/components/delivery/ShippingFeeDisplay.jsx`

- [ ] **Step 1: Create shipping fee display**

Create `src/components/delivery/ShippingFeeDisplay.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

export default function ShippingFeeDisplay({ subtotal, onFeeCalculated }) {
  const [shippingFee, setShippingFee] = useState(0);
  const [isFreeship, setIsFreeship] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateFee();
  }, [subtotal]);

  const calculateFee = async () => {
    try {
      const response = await fetch(`/api/delivery/shipping-fee?subtotal=${subtotal}`);
      if (!response.ok) throw new Error('Failed to calculate fee');
      const data = await response.json();
      setShippingFee(data.shipping_fee);
      setIsFreeship(data.is_freeship);
      onFeeCalculated?.({ shipping_fee: data.shipping_fee, total: data.total });
    } catch (error) {
      console.error('Failed to calculate shipping fee:', error);
      setShippingFee(0);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => n.toLocaleString('vi-VN');
  const THRESHOLD = 200000;
  const remaining = Math.max(0, THRESHOLD - subtotal);

  return (
    <div className="space-y-2 p-3 rounded-lg bg-[#18181B]/5 border border-[#18181B]/10">
      <div className="flex items-center gap-2 text-sm">
        <Truck className="w-4 h-4 text-[#FF5722]" />
        <span className="font-bold text-[#18181B]">Phí giao hàng</span>
      </div>
      
      {loading ? (
        <p className="text-xs text-[#18181B]/60">Đang tính...</p>
      ) : (
        <>
          {isFreeship ? (
            <p className="text-sm font-bold text-green-500">Miễn phí giao hàng!</p>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-[#18181B]/60">Phí:</span>
                <span className="font-bold">{fmt(shippingFee)}đ</span>
              </div>
              {remaining > 0 && (
                <p className="text-xs text-[#18181B]/60">
                  Thêm {fmt(remaining)}đ nữa để miễn phí giao hàng
                </p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/delivery/ShippingFeeDisplay.jsx
git commit -m "feat: add ShippingFeeDisplay component with freeship threshold"
```

---

### Task 15: Frontend - Create GymOwnerOrdersPage

**Files:**
- Create: `src/pages/gymOwner/GymOwnerOrdersPage.jsx`

- [ ] **Step 1: Create gym owner orders management page**

Create `src/pages/gymOwner/GymOwnerOrdersPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import { api } from '../../services/api';

const ORDER_STATUSES = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  preparing: { label: 'Đang chuẩn bị', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  shipped: { label: 'Đã giao shipper', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  delivering: { label: 'Đang giao', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  done: { label: 'Đã giao', color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { label: 'Đã hủy', color: 'text-red-400', bg: 'bg-red-400/10' }
};

export default function GymOwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const url = filterStatus === 'all' 
        ? '/api/food/orders?vendor_id=1'
        : `/api/food/orders?vendor_id=1&status=${filterStatus}`;
      const data = await api.get(url);
      setOrders(data.items || data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndPrepare = async (orderId) => {
    try {
      await api.patch(`/api/food/orders/${orderId}`, { status: 'preparing' });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleCreateShipping = async (orderId) => {
    // Mock: In real implementation, call GHN/Ahamove API
    alert(`Tạo đơn giao cho đơn ${orderId} (mock)`);
  };

  if (loading) return <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>;

  const tabs = ['all', 'pending', 'preparing', 'shipped', 'delivering', 'done', 'cancelled'];
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-[#18181B]">Quản lý đơn giao hàng</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              filterStatus === tab
                ? 'bg-[#FF5722] text-white'
                : 'bg-[#18181B]/10 text-[#18181B]/60 hover:bg-[#18181B]/20'
            }`}
          >
            {ORDER_STATUSES[tab]?.label || 'Tất cả'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-[#18181B]/40 py-8">Không có đơn hàng</p>
        ) : (
          filteredOrders.map(order => {
            const status = ORDER_STATUSES[order.status];
            return (
              <div key={order.order_id} className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#18181B]/10">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#18181B]/60" />
                    <span className="text-sm font-mono text-[#18181B]/60">#{order.order_id}</span>
                    {order.delivery_type === 'delivery' && (
                      <span className="text-xs flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722]">
                        <Truck className="w-3 h-3" />
                        Giao hàng
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${status?.color} ${status?.bg}`}>
                    {status?.label}
                  </span>
                </div>

                <div className="px-5 py-3 space-y-2">
                  {/* Items list */}
                  <div className="text-sm">
                    {(order.items || []).map((item, idx) => (
                      <p key={idx} className="text-[#18181B]/70">
                        {item.name} x{item.qty || 1}
                      </p>
                    ))}
                  </div>

                  {/* Delivery address if applicable */}
                  {order.delivery_type === 'delivery' && order.address && (
                    <div className="flex gap-2 text-xs text-[#18181B]/70 mt-2">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{order.address.full_name} • {order.address.phone}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#18181B]/10">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmAndPrepare(order.order_id)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition"
                      >
                        Xác nhận & Chuẩn bị
                      </button>
                    )}
                    {order.status === 'preparing' && order.delivery_type === 'delivery' && (
                      <button
                        onClick={() => handleCreateShipping(order.order_id)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition"
                      >
                        Tạo đơn GHN/Ahamove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/gymOwner/GymOwnerOrdersPage.jsx
git commit -m "feat: add GymOwnerOrdersPage for delivery management"
```

---

### Task 16: Frontend - Update Checkout Flow (Nutrition)

**Files:**
- Modify: `src/pages/nutrition/NutritionCheckoutPage.jsx` (or equivalent)

- [ ] **Step 1: Locate and update checkout component**

Find nutrition checkout page and add delivery choice logic:
```jsx
// Add at top of component
import DeliveryChoice from '../../components/delivery/DeliveryChoice';
import AddressSelector from '../../components/delivery/AddressSelector';
import ShippingFeeDisplay from '../../components/delivery/ShippingFeeDisplay';

// In state
const [deliveryType, setDeliveryType] = useState('pickup');
const [shippingAddressId, setShippingAddressId] = useState(null);
const [shippingFee, setShippingFee] = useState(0);

// In JSX, before payment section add:
<DeliveryChoice value={deliveryType} onChange={setDeliveryType} />

{deliveryType === 'delivery' && (
  <>
    <AddressSelector value={shippingAddressId} onChange={setShippingAddressId} />
    <ShippingFeeDisplay 
      subtotal={subtotal} 
      onFeeCalculated={(fee) => setShippingFee(fee.shipping_fee)}
    />
  </>
)}

// When creating order, include delivery params:
await api.post('/api/food/orders', {
  ...orderData,
  delivery_type: deliveryType,
  shipping_address_id: deliveryType === 'delivery' ? shippingAddressId : null,
  shipping_fee: shippingFee
});
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/nutrition/NutritionCheckoutPage.jsx  # or actual filename
git commit -m "feat: add delivery choice & address selection to nutrition checkout"
```

---

### Task 17: Test Backend Delivery API

**Files:**
- Test: `tests/test_delivery.py` (new)

- [ ] **Step 1: Create test file**

Create `tests/test_delivery.py`:
```python
import pytest
from app.modules.delivery.service import DeliveryService
from app.modules.delivery.schema import ShippingAddressCreate

def test_calculate_shipping_fee_freeship():
    """Test freeship threshold >= 200k"""
    result = DeliveryService.calculate_shipping_fee(200000)
    assert result["is_freeship"] == True
    assert result["shipping_fee"] == 0

def test_calculate_shipping_fee_below_threshold():
    """Test fee below threshold"""
    result = DeliveryService.calculate_shipping_fee(100000)
    assert result["is_freeship"] == False
    assert result["shipping_fee"] > 0

def test_create_address(db, test_user):
    """Test creating shipping address"""
    addr_data = ShippingAddressCreate(
        full_name="Nguyen Van A",
        phone="0912345678",
        address_line="123 Nguyen Trai",
        ward="Ben Thanh",
        district="1",
        city="Ho Chi Minh",
        is_default=True
    )
    address = DeliveryService.create_address(db, test_user.user_id, addr_data)
    assert address.full_name == "Nguyen Van A"
    assert address.is_default == True

def test_get_addresses(db, test_user):
    """Test retrieving all addresses"""
    # Create 2 addresses
    for i in range(2):
        addr_data = ShippingAddressCreate(
            full_name=f"User {i}",
            phone=f"090{i}345678",
            address_line=f"{i} Nguyen Trai",
            ward="Ward",
            district="1",
            city="HCM"
        )
        DeliveryService.create_address(db, test_user.user_id, addr_data)
    
    addresses = DeliveryService.get_addresses(db, test_user.user_id)
    assert len(addresses) >= 2
```

- [ ] **Step 2: Run tests**

```bash
cd d:/doanWEDKD/BE
pytest tests/test_delivery.py -v
```

Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/test_delivery.py
git commit -m "test: add delivery module tests"
```

---

### Task 18: Integration Test - Full Checkout Flow

**Files:**
- Test: `tests/test_checkout_with_delivery.py` (new)

- [ ] **Step 1: Write integration test**

Create `tests/test_checkout_with_delivery.py`:
```python
import pytest
from app.modules.food.service import FoodService
from app.modules.delivery.service import DeliveryService
from app.modules.delivery.schema import ShippingAddressCreate

def test_checkout_with_delivery(db, test_user):
    """Test complete checkout with delivery"""
    # Create shipping address
    addr_data = ShippingAddressCreate(
        full_name="Nguyen Van A",
        phone="0912345678",
        address_line="123 Nguyen Trai",
        ward="Ben Thanh",
        district="1",
        city="Ho Chi Minh",
        is_default=True
    )
    address = DeliveryService.create_address(db, test_user.user_id, addr_data)
    
    # Calculate shipping fee
    fee_result = DeliveryService.calculate_shipping_fee(100000)
    
    # Create order with delivery
    order_data = {
        "user_id": test_user.user_id,
        "items": [{"name": "Protein", "qty": 1, "price": 75000}],
        "subtotal": 75000,
        "delivery_type": "delivery",
        "shipping_address_id": address.address_id,
        "shipping_fee": fee_result["shipping_fee"]
    }
    order = FoodService.create_order(
        db,
        delivery_type="delivery",
        shipping_address_id=address.address_id,
        shipping_fee=fee_result["shipping_fee"],
        **{k: v for k, v in order_data.items() if k not in ["delivery_type", "shipping_address_id", "shipping_fee"]}
    )
    
    assert order["order_id"] is not None
    assert order["total_amount"] == 75000 + fee_result["shipping_fee"]

def test_freeship_checkout(db, test_user):
    """Test checkout with freeship"""
    # Create address
    addr_data = ShippingAddressCreate(
        full_name="User",
        phone="0912345678",
        address_line="Address",
        ward="Ward",
        district="1",
        city="HCM"
    )
    address = DeliveryService.create_address(db, test_user.user_id, addr_data)
    
    # Order > 200k should get freeship
    fee_result = DeliveryService.calculate_shipping_fee(250000)
    assert fee_result["is_freeship"] == True
    assert fee_result["shipping_fee"] == 0
```

- [ ] **Step 2: Run integration tests**

```bash
cd d:/doanWEDKD/BE
pytest tests/test_checkout_with_delivery.py -v
```

Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/test_checkout_with_delivery.py
git commit -m "test: add integration test for checkout with delivery"
```

---

### Task 19: Verify Frontend Routes

**Files:**
- No changes needed

- [ ] **Step 1: Start frontend dev server**

```bash
cd d:/doanWEDKD/FE
npm run dev
```

- [ ] **Step 2: Test new routes**

Navigate to:
- `http://localhost:5173/profile/addresses` — should show shipping address management
- `http://localhost:5173/orders` — should show orders with delivery info
- `http://localhost:5173/orders/1` — should show order detail with tracking
- `http://localhost:5173/gym-owner/orders` — should show gym owner delivery management

- [ ] **Step 3: Verify no console errors**

Check browser DevTools console for errors

- [ ] **Step 4: Commit any minor fixes**

```bash
git add .
git commit -m "feat: verify delivery module routes in frontend"
```

---

### Task 20: Documentation Update

**Files:**
- Modify: `docs/superpowers/plans/` (this plan)

- [ ] **Step 1: Mark plan as complete**

This plan is complete. All 20 tasks cover:
- Backend: 5 files (model, schema, service, router, __init__)
- Database: 2 migrations (SHIPPING_ADDRESSES, extend food_orders)
- Frontend: 8 new components/pages + 3 modified files
- Tests: 2 test files

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/2026-06-19-delivery-module-implementation.md
git commit -m "docs: add delivery module implementation plan"
```

---

## Summary

**Total Tasks:** 20
**Backend:** 5 new modules + 2 migrations
**Frontend:** 8 new pages/components + 3 updated files
**Tests:** 2 new test files with 6+ test cases
**Database:** SHIPPING_ADDRESSES table + extended food_orders

**Estimated Time:** 8-12 hours for experienced developer

---

Plan complete and saved to `docs/superpowers/plans/2026-06-19-delivery-module-implementation.md`. 

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task (or batch of 2-3), review between batches, fast iteration

**2. Inline Execution** - Execute tasks in this session using superpowers:executing-plans with checkpoints

**Which approach would you prefer?**