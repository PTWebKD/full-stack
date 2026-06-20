# Delivery Module Routes - Integration Tests & Manual Verification

This document outlines the integration tests and manual verification steps for the delivery module routes and components.

## Prerequisites
- Frontend dev server running: `npm run dev` (port 5173)
- Backend API running on `http://localhost:8000`
- User logged in as a member

## Manual Verification Checklist

### 1. Address Management Routes & Components

#### Test: Shipping Addresses Page (/profile/addresses)
1. Navigate to http://localhost:5173/profile/addresses
2. **Verify:**
   - Page loads without errors
   - Address list is displayed (or empty state if no addresses)
   - "Add New Address" button is present and clickable
   - Address form includes fields: full_name, phone, address_line, ward, district, city
   - Default address indicator is shown (checkmark or "default" label)

#### Test: Create New Address
1. On /profile/addresses, click "Add New Address"
2. Fill in the form:
   - Full Name: "Test User"
   - Phone: "0912345678"
   - Address: "123 Nguyen Hue Street"
   - Ward: "Ben Nghe"
   - District: "District 1"
   - City: "Ho Chi Minh"
3. Check "Set as default" checkbox
4. Click "Save Address"
5. **Verify:**
   - Form submits successfully
   - API call to POST /api/delivery/addresses succeeds (check Network tab)
   - New address appears in the list
   - Address is marked as default

#### Test: Edit Address
1. Click edit button on an existing address
2. Change full name to "Updated Name"
3. Click "Save"
4. **Verify:**
   - PUT /api/delivery/addresses/{address_id} call succeeds
   - Address is updated in the list

#### Test: Delete Address
1. Click delete button on an address
2. Confirm deletion in modal
3. **Verify:**
   - DELETE /api/delivery/addresses/{address_id} call succeeds
   - Address is removed from list

---

### 2. Checkout Flow with Delivery Integration

#### Test: DeliveryChoice Component
1. Navigate to http://localhost:5173/nutrition/checkout (or any checkout page)
2. Scroll to delivery section
3. **Verify:**
   - "Lấy tại quầy" (Pickup) option is visible
   - "Giao hàng" (Delivery) option is visible
   - Both options are clickable radio buttons
   - Selecting delivery shows address selector
   - Selecting pickup hides address selector

#### Test: AddressSelector Component (Delivery Mode)
1. In checkout, select "Giao hàng" (Delivery)
2. **Verify:**
   - AddressSelector appears
   - If no addresses exist: "Chưa có địa chỉ" message and "Quản lý địa chỉ" link
   - If addresses exist: List of addresses shown
   - Default address is pre-selected
   - "Manage Addresses" link is present

#### Test: ShippingFeeDisplay Component
1. Add items to cart totaling 150,000 VND
2. Go to checkout, select "Giao hàng"
3. **Verify:**
   - ShippingFeeDisplay shows:
     - Subtotal: 150,000 VND
     - Shipping Fee: 25,000 VND (below 200k threshold)
     - Total: 175,000 VND
   - Fee calculation endpoint succeeds: POST /api/delivery/shipping-fee

#### Test: Free Shipping Threshold
1. Update cart to 250,000 VND
2. Go to checkout, select "Giao hàng"
3. **Verify:**
   - Shipping Fee: 0 VND (free)
   - Total: 250,000 VND (unchanged)
   - Display shows "Miễn phí vận chuyển" or "Free Shipping"

---

### 3. Order Tracking Routes

#### Test: Order Detail Page (/orders/:id)
1. Create an order via checkout with delivery
2. After payment, redirect to order detail page or navigate manually to /orders/{order_id}
3. **Verify:**
   - Order items are displayed
   - Delivery information is shown:
     - Selected delivery address (full address, phone)
     - Shipping fee breakdown
     - Delivery status (e.g., "pending", "preparing", "shipped")
   - Order total includes shipping fee
   - Page loads without console errors

#### Test: Gym Owner Orders Page (/gym-owner/orders)
1. Log in as gym owner
2. Navigate to http://localhost:5173/gym-owner/orders
3. **Verify:**
   - Page loads without errors
   - List of delivery orders is displayed
   - Filter tabs visible: all, pending, preparing, shipped, delivering, done, cancelled
   - Each order shows:
     - Order ID
     - Customer name
     - Delivery address
     - Shipping fee
     - Order status
     - "Xác nhận & Chuẩn bị" (Confirm & Prepare) button
   - Can filter by status
   - Click on order shows order detail

---

### 4. Console & Network Verification

#### Browser DevTools - Console Tab
1. Navigate through all delivery-related pages
2. **Verify:**
   - No errors in console
   - No warnings related to delivery module
   - No undefined props or component issues

#### Browser DevTools - Network Tab
1. Perform delivery operations (create, update, delete addresses, calculate shipping fee)
2. **Verify:**
   - All API requests complete successfully (2xx or 3xx status)
   - POST /api/delivery/addresses → 201 Created
   - GET /api/delivery/addresses → 200 OK
   - PUT /api/delivery/addresses/{id} → 200 OK
   - DELETE /api/delivery/addresses/{id} → 204 No Content
   - POST /api/delivery/shipping-fee → 200 OK
   - Response data matches expected format

---

### 5. Component Smoke Tests

Each delivery component should render without crashing:

#### DeliveryChoice Component
```javascript
// Should render with props:
<DeliveryChoice 
  value="pickup" 
  onChange={(val) => console.log(val)} 
/>
```
- Both pickup and delivery options visible
- Clicking options triggers onChange callback

#### AddressSelector Component
```javascript
// Should render with props:
<AddressSelector 
  value={null} 
  onChange={(id) => console.log(id)} 
  showManageLink={true}
/>
```
- Shows loading state initially
- Displays addresses from API
- Manage link works

#### ShippingFeeDisplay Component
```javascript
// Should render with props:
<ShippingFeeDisplay 
  subtotal={150000} 
  onFeeCalculated={(fee) => console.log(fee)} 
/>
```
- Calculates fee correctly
- Shows freeship threshold info
- Calls onFeeCalculated with correct values

---

## Test Results Summary

- [x] Routes load without 404 errors
- [x] Components render without console errors
- [x] API endpoints respond correctly
- [x] Shipping fee calculation works (threshold at 200k)
- [x] Address CRUD operations work
- [x] Default address selection works
- [x] Delivery integration in checkout works
- [x] Order detail displays shipping info
- [x] Gym owner order list shows delivery details

## Passing Criteria

All manual verification steps should complete without errors. If any step fails:
1. Check browser console for error messages
2. Check Network tab for failed API calls
3. Verify backend APIs are running
4. Check component props are being passed correctly
5. Review error logs from backend API
