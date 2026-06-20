# Delivery Module Documentation

## Overview

The Delivery Module enables gym members to purchase products (nutrition items, gear) with flexible fulfillment options: pickup at counter or home delivery. It includes:

- **Shipping Address Management**: Create, update, delete, and manage multiple shipping addresses per user
- **Real-time Shipping Fee Calculation**: Dynamic fee calculation based on order subtotal with free shipping threshold
- **Order Tracking**: Members can track orders; gym owners can manage fulfillment
- **Delivery Integration**: Foundation for GHN/Ahamove API integration (currently mocked)

## Key Features

### 1. Delivery Type Selection
Users can choose between two fulfillment options at checkout:

- **Lấy tại quầy (Pickup)**: Free, retrieve at gym counter during business hours
- **Giao hàng (Delivery)**: Requires shipping address; fee calculated by subtotal

### 2. Shipping Address Management
- Create multiple addresses per user
- Mark one address as default
- Update address details anytime
- Delete unused addresses
- Address validation includes: name (max 100 chars), phone (10-15 digits), full address details

### 3. Shipping Fee Calculation
Smart fee structure based on order value:

| Order Subtotal | Shipping Fee | Status |
|---|---|---|
| < 200,000 VND | 25,000 VND | Standard fee |
| >= 200,000 VND | 0 VND | Free shipping |

Real-time calculation displayed at checkout before payment.

### 4. Order Management
- **Member View**: Track order status, delivery address, and estimated arrival at `/orders/:id`
- **Gym Owner View**: Manage all delivery orders at `/gym-owner/orders`
- **Status Flow**: pending → preparing → shipped → delivering → done (or cancelled)

---

## Database Schema

### SHIPPING_ADDRESSES Table

```sql
CREATE TABLE shipping_addresses (
  address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL (FK → users.user_id),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  address_line VARCHAR(300) NOT NULL,
  ward VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  city VARCHAR(100) DEFAULT 'Ho Chi Minh',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, address_id)
);
```

### FOOD_ORDERS Extended Columns

```sql
ALTER TABLE food_orders ADD COLUMN (
  delivery_type ENUM('pickup', 'delivery'),
  shipping_address_id INTEGER (FK → shipping_addresses.address_id),
  shipping_fee DECIMAL(10, 2),
  delivery_status ENUM('pending', 'preparing', 'shipped', 'delivering', 'done', 'cancelled'),
  tracking_code VARCHAR(50),
  shipping_provider ENUM('GHN', 'Ahamove', 'mock')
);
```

---

## API Endpoints

All delivery endpoints require authentication (Bearer token).

### Address Management

#### Create Address
```http
POST /api/delivery/addresses
Content-Type: application/json
Authorization: Bearer {token}

{
  "full_name": "Nguyen Van A",
  "phone": "0912345678",
  "address_line": "123 Nguyen Hue Street",
  "ward": "Ben Nghe",
  "district": "District 1",
  "city": "Ho Chi Minh",
  "is_default": false
}

Response (201):
{
  "address_id": 1,
  "user_id": 5,
  "full_name": "Nguyen Van A",
  "phone": "0912345678",
  "address_line": "123 Nguyen Hue Street",
  "ward": "Ben Nghe",
  "district": "District 1",
  "city": "Ho Chi Minh",
  "is_default": true,  // Auto-set to true if first address
  "created_at": "2026-06-20T14:30:00Z"
}
```

**Notes:**
- First address automatically becomes default (is_default = true)
- Subsequent addresses default to is_default = false
- If marked as default, clears previous default for user

#### Get All Addresses
```http
GET /api/delivery/addresses
Authorization: Bearer {token}

Response (200):
[
  {
    "address_id": 1,
    "user_id": 5,
    "full_name": "Nguyen Van A",
    "is_default": true,
    ...
  },
  {
    "address_id": 2,
    "user_id": 5,
    "full_name": "Tran Thi B",
    "is_default": false,
    ...
  }
]
```

**Sorting:** Default addresses first, then by creation date (newest first)

#### Get Default Address
```http
GET /api/delivery/addresses/default
Authorization: Bearer {token}

Response (200):
{
  "address_id": 1,
  "user_id": 5,
  "full_name": "Nguyen Van A",
  "is_default": true,
  ...
}

Response (404): // If no addresses exist
null
```

#### Update Address
```http
PUT /api/delivery/addresses/{address_id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "full_name": "Updated Name",
  "phone": "0987654321"
  // Other fields optional
}

Response (200):
{
  "address_id": 1,
  "full_name": "Updated Name",
  "phone": "0987654321",
  ...
}
```

**Notes:**
- All fields are optional
- Only provided fields are updated
- Cannot update user_id or address_id

#### Delete Address
```http
DELETE /api/delivery/addresses/{address_id}
Authorization: Bearer {token}

Response (204): // No content
```

**Notes:**
- Returns 404 if address doesn't exist or doesn't belong to user
- Deleting default address does not reassign default status

---

### Shipping Fee Calculation

#### Calculate Shipping Fee
```http
POST /api/delivery/shipping-fee?subtotal=150000
Authorization: (not required)

Response (200):
{
  "shipping_fee": 25000,
  "is_freeship": false,
  "subtotal": 150000,
  "total": 175000,
  "freeship_threshold": 200000
}
```

**Query Parameters:**
- `subtotal`: Order subtotal in VND (required, integer)

**Response Fields:**
- `shipping_fee`: Calculated fee in VND
- `is_freeship`: Boolean indicating if free shipping applies
- `subtotal`: Echo of input subtotal
- `total`: subtotal + shipping_fee
- `freeship_threshold`: Threshold value (200000 VND)

**Example Scenarios:**
```
Subtotal: 100,000 → Fee: 25,000, Total: 125,000
Subtotal: 200,000 → Fee: 0, Total: 200,000
Subtotal: 500,000 → Fee: 0, Total: 500,000
```

---

## Frontend Components

### DeliveryChoice Component

**Purpose:** Radio selector for delivery mode at checkout

**Location:** `src/components/delivery/DeliveryChoice.jsx`

**Props:**
```jsx
<DeliveryChoice 
  value="pickup" | "delivery"
  onChange={(type) => void}
/>
```

**Features:**
- Two options: "Lấy tại quầy" (Pickup) and "Giao hàng" (Delivery)
- Radio buttons with clean styling
- Integrated with checkout flow

**Usage Example:**
```jsx
const [deliveryType, setDeliveryType] = useState('pickup');

<DeliveryChoice value={deliveryType} onChange={setDeliveryType} />
```

---

### AddressSelector Component

**Purpose:** Select shipping address when delivery mode is chosen

**Location:** `src/components/delivery/AddressSelector.jsx`

**Props:**
```jsx
<AddressSelector 
  value={null | number}  // address_id
  onChange={(addressId) => void}
  showManageLink={true}  // Optional
/>
```

**Features:**
- Fetches user's addresses via GET /api/delivery/addresses
- Displays default address pre-selected
- "Manage Addresses" link to `/profile/addresses`
- Shows loading state during fetch
- Empty state: "Chưa có địa chỉ giao hàng" (No delivery addresses)

**Usage Example:**
```jsx
const [addressId, setAddressId] = useState(null);
const [deliveryType, setDeliveryType] = useState('pickup');

{deliveryType === 'delivery' && (
  <AddressSelector value={addressId} onChange={setAddressId} />
)}
```

---

### ShippingFeeDisplay Component

**Purpose:** Calculate and display shipping fees with visual feedback

**Location:** `src/components/delivery/ShippingFeeDisplay.jsx`

**Props:**
```jsx
<ShippingFeeDisplay 
  subtotal={number}
  onFeeCalculated={(fee) => void}
/>
```

**Features:**
- Calculates fee via POST /api/delivery/shipping-fee
- Displays fee breakdown: subtotal, shipping fee, total
- Shows freeship threshold reminder
- Calls parent callback with calculated fee
- Formats values as Vietnamese currency

**Usage Example:**
```jsx
const [shippingFee, setShippingFee] = useState(0);

<ShippingFeeDisplay 
  subtotal={cartSubtotal} 
  onFeeCalculated={setShippingFee} 
/>
<div>Total: {cartSubtotal + shippingFee} VND</div>
```

---

### ShippingAddressesPage Component

**Purpose:** Full address management interface for members

**Location:** `src/pages/ShippingAddressesPage.jsx`

**Features:**
- List all user's shipping addresses
- Create new address with form
- Edit existing addresses
- Delete addresses
- Mark/unmark as default
- Responsive design for mobile/desktop

**Route:** `/profile/addresses`

---

### OrderDetailPage Component

**Purpose:** Display order details with delivery information

**Location:** `src/pages/OrderDetailPage.jsx`

**Features:**
- Show order items and quantities
- Display delivery method (pickup or delivery)
- If delivery:
  - Show shipping address (name, phone, full address)
  - Show shipping fee and total amount
  - Show delivery status and estimated date
- Order timeline/status progression
- Cancel order option (if applicable)

**Route:** `/orders/:id`

**Example Data:**
```json
{
  "order_id": 123,
  "status": "shipped",
  "delivery_type": "delivery",
  "shipping_address": {
    "full_name": "Nguyen Van A",
    "phone": "0912345678",
    "address_line": "123 Nguyen Hue",
    "ward": "Ben Nghe",
    "district": "District 1",
    "city": "Ho Chi Minh"
  },
  "items": [...],
  "subtotal": 200000,
  "shipping_fee": 0,
  "total": 200000,
  "delivery_status": "shipped",
  "tracking_code": "GHN-123456"
}
```

---

### GymOwnerOrdersPage Component

**Purpose:** Gym owner dashboard for managing delivery orders

**Location:** `src/pages/GymOwnerOrdersPage.jsx`

**Features:**
- List all delivery orders
- Filter by status: pending, preparing, shipped, delivering, done, cancelled
- Show order details: customer, address, fee, status
- "Xác nhận & Chuẩn bị" (Confirm & Prepare) button changes status
- Search/sort by order date
- One-click access to order detail

**Route:** `/gym-owner/orders`

**Status Progression:**
1. **pending**: Order created, awaiting confirmation
2. **preparing**: Gym owner confirmed, items being prepared
3. **shipped**: Items handed to shipping provider
4. **delivering**: In transit with customer
5. **done**: Successfully delivered
6. **cancelled**: Order cancelled by member or gym owner

---

## Integration Flow: Complete User Journey

### Member Scenario: Ordering with Home Delivery

```
1. Member browses nutrition products
   └─ Adds items to cart (subtotal: 150,000 VND)

2. Go to checkout
   ├─ Select "Giao hàng" (Delivery)
   │  └─ ShippingFeeDisplay shows: Fee: 25,000 VND, Total: 175,000 VND
   ├─ AddressSelector displays saved addresses
   ├─ Select default address (or create new)
   │  └─ POST /api/delivery/addresses (if new)
   ├─ Review order with fee breakdown
   └─ Proceed to payment

3. Payment processing
   ├─ VNPay/Momo sandbox payment
   ├─ Create order with delivery_type='delivery', shipping_address_id=1
   │  └─ POST /api/food/orders { items, delivery_type, shipping_address_id }
   └─ Set delivery_status='pending'

4. Order Confirmation
   ├─ Redirect to /orders/{order_id}
   ├─ Display order details + shipping address
   ├─ Show status: "Chờ xác nhận"
   └─ Member can share with gym owner or save

5. Gym Owner Review
   ├─ Navigate to /gym-owner/orders
   ├─ Click order → view details
   └─ "Xác nhận & Chuẩn bị" (updates status to 'preparing')

6. Fulfillment
   ├─ Gym owner prepares items
   ├─ Prints shipping label (future: auto-generate GHN/Ahamove)
   ├─ Hands to delivery provider
   └─ Status updated to 'shipped'

7. Delivery
   ├─ Item in transit
   ├─ Member gets SMS/Email updates (future)
   └─ Status: 'delivering'

8. Completion
   ├─ Member receives package
   ├─ Confirms delivery (or auto-confirm after X days)
   └─ Status: 'done'
```

### Free Shipping Scenario

```
Member adds products totaling 250,000 VND
   ├─ Select delivery
   ├─ ShippingFeeDisplay shows: Fee: 0 VND (freeship!)
   └─ Order with 0 shipping_fee
```

---

## Testing

### Backend Tests

**Unit Tests:** `tests/modules/delivery/test_service.py`
- Address CRUD operations
- Shipping fee calculations
- Default address logic

**Integration Tests:** `tests/modules/delivery/test_router.py`
- API endpoint functionality
- Authentication & authorization
- Request/response validation

**Run Tests:**
```bash
cd BE
pytest tests/modules/delivery/ -v
```

**Coverage:**
- ✓ Create address (first auto-default)
- ✓ Create address (second not default)
- ✓ Get all addresses
- ✓ Get default address
- ✓ Update address
- ✓ Delete address
- ✓ Calculate shipping fee (<200k)
- ✓ Calculate shipping fee (>=200k free)
- ✓ All CRUD endpoints with auth

### Frontend Tests

**Manual Verification:** `tests/integration/delivery-routes.test.md`

**Smoke Tests:** Verify components load and render:
- DeliveryChoice renders correctly
- AddressSelector fetches and displays addresses
- ShippingFeeDisplay calculates fees
- Routes load without 404 errors

**Run Smoke Tests:**
```bash
cd FE
npm run dev
# Navigate to http://localhost:5173/profile/addresses
# Follow manual verification checklist
```

---

## Error Handling

### Common Errors & Solutions

#### Address Not Found (404)
```
GET /api/delivery/addresses/{address_id}
Response: 404 Not Found

Cause: Address doesn't exist or belongs to another user
Solution: Refresh address list, use correct address_id
```

#### Invalid Shipping Address
```
POST /api/delivery/addresses
Response: 422 Unprocessable Entity

{
  "detail": [
    {
      "loc": ["body", "phone"],
      "msg": "String should have at least 10 characters",
      "type": "string_too_short"
    }
  ]
}

Cause: Validation failed (e.g., phone < 10 digits)
Solution: Fix input validation, check field lengths
```

#### Delivery Without Address
```
POST /api/food/orders
{
  "delivery_type": "delivery",
  "shipping_address_id": null
}
Response: 400 Bad Request

Cause: Delivery requires shipping_address_id
Solution: Select address before checkout
```

---

## Future Enhancements

1. **Real Shipping Integration**
   - Connect to GHN API for real shipping rates
   - Connect to Ahamove for motorcycle delivery
   - Auto-generate shipping labels

2. **Advanced Tracking**
   - Real-time tracking from shipping provider
   - SMS/Email notifications on status change
   - Estimated delivery date calculation

3. **Delivery Preferences**
   - Time window selection
   - Special delivery instructions
   - Signature on delivery

4. **Pricing Rules**
   - Zone-based pricing (city vs. suburbs)
   - Weight-based calculation
   - Promo codes for free shipping

5. **Analytics**
   - Delivery success rate
   - Average delivery time
   - Cost per delivery

6. **Multi-Gym Support**
   - Cross-gym order merging
   - Consolidated delivery

---

## Migration History

### Database Migrations

1. **Migration: 001_add_shipping_addresses_table.py**
   - Created SHIPPING_ADDRESSES table
   - Indexed user_id for fast lookups
   - Default constraint on is_default (false)

2. **Migration: 002_extend_food_orders_delivery.py**
   - Added delivery_type column
   - Added shipping_address_id FK
   - Added shipping_fee column
   - Added delivery_status enum
   - Added tracking_code column
   - Added shipping_provider column

---

## Deployment Checklist

- [ ] Backend migrations applied
- [ ] API tests passing (9 service tests, 7 endpoint tests)
- [ ] Frontend manual verification complete
- [ ] No console errors in browser DevTools
- [ ] API response times acceptable
- [ ] Database indexes optimized
- [ ] Error handling tested
- [ ] Documentation reviewed and complete
- [ ] PR merged to main branch

---

## Support & Troubleshooting

### Common Issues

**Q: Shipping fee shows wrong amount**
- A: Clear browser cache, check subtotal calculation, verify backend API response

**Q: Default address not showing**
- A: Refresh page, check if user has addresses, verify is_default flag

**Q: Can't delete address**
- A: Check if you own the address, verify address_id is correct

**Q: Order not showing shipping details**
- A: Verify order has delivery_type='delivery', check shipping_address_id is valid

**Contact:** Development team or file GitHub issue
