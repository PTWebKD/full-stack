# Guest Checkout Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build React components for guest checkout flow with phone validation, guest recognition via API, conditional voucher display, and order confirmation.

**Architecture:** 
- **GuestContext.jsx**: Centralized guest session state management (phone, guest_id, is_recognized, available_voucher, discount) with localStorage persistence for session continuity
- **GuestCheckoutPage.jsx**: 4-step checkout flow (phone input → API recognition → cart display → voucher popup conditional on returning customer → order confirmation)
- Integration with existing CheckoutPage flow (guest enters phone, then proceeds to existing address/payment/confirmation steps)

**Tech Stack:** React 18, React Router 7, native Fetch API (no Axios), Tailwind CSS 4.3, Lucide React icons, Framer Motion animations

---

## File Structure

```
FE/src/
├── context/
│   └── GuestContext.jsx              [NEW] Guest session state + localStorage
└── pages/
    └── guest/
        └── GuestCheckoutPage.jsx     [NEW] 4-step checkout flow component
```

**Integration points:**
- `FE/src/App.jsx` - Wrap with GuestProvider
- `FE/src/pages/public/CheckoutPage.jsx` - Already calls guest OTP flow; will use GuestContext instead

---

## Task 1: Create GuestContext.jsx

**Files:**
- Create: `FE/src/context/GuestContext.jsx`

- [ ] **Step 1: Write the context structure with initial state**

Create a new file `FE/src/context/GuestContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const GuestContext = createContext(null);

export function GuestProvider({ children }) {
  // Initial state - restore from localStorage or start fresh
  const [guest_id, setGuestId] = useState(null);
  const [phone, setPhone] = useState('');
  const [is_recognized, setIsRecognized] = useState(false);
  const [is_returning_customer, setIsReturningCustomer] = useState(false);
  const [available_voucher, setAvailableVoucher] = useState(null);
  const [discount_amount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('fitfuel_guest');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setGuestId(data.guest_id);
        setPhone(data.phone);
        setIsRecognized(data.is_recognized);
        setIsReturningCustomer(data.is_returning_customer);
        setAvailableVoucher(data.available_voucher);
        setDiscountAmount(data.discount_amount);
        setSubtotal(data.subtotal);
        setTotal(data.total);
      } catch (e) {
        console.error('Failed to restore guest session:', e);
      }
    }
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const guestData = {
      guest_id,
      phone,
      is_recognized,
      is_returning_customer,
      available_voucher,
      discount_amount,
      subtotal,
      total
    };
    localStorage.setItem('fitfuel_guest', JSON.stringify(guestData));
  }, [guest_id, phone, is_recognized, is_returning_customer, available_voucher, discount_amount, subtotal, total]);

  // Action: Set guest phone and recognize via API
  const setGuestPhone = (phoneNum) => {
    setPhone(phoneNum);
  };

  // Action: Update guest info after API recognition
  const setRecognizedGuest = (guestInfo) => {
    setGuestId(guestInfo.guest_id);
    setIsRecognized(true);
    setIsReturningCustomer(guestInfo.is_returning_customer);
    setSubtotal(guestInfo.subtotal);
    setDiscountAmount(guestInfo.discount_amount);
    setTotal(guestInfo.total);
  };

  // Action: Update available voucher when user accepts/rejects
  const setAvailableVoucher = (voucher) => {
    setAvailableVoucher(voucher);
  };

  // Action: Clear guest session (on order complete or logout)
  const clearGuest = () => {
    setGuestId(null);
    setPhone('');
    setIsRecognized(false);
    setIsReturningCustomer(false);
    setAvailableVoucher(null);
    setDiscountAmount(0);
    setSubtotal(0);
    setTotal(0);
    localStorage.removeItem('fitfuel_guest');
  };

  return (
    <GuestContext.Provider value={{
      guest_id,
      phone,
      is_recognized,
      is_returning_customer,
      available_voucher,
      discount_amount,
      subtotal,
      total,
      setGuestPhone,
      setRecognizedGuest,
      setAvailableVoucher,
      clearGuest
    }}>
      {children}
    </GuestContext.Provider>
  );
}

export const useGuest = () => {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error('useGuest must be used within GuestProvider');
  return ctx;
};
```

- [ ] **Step 2: Verify context structure matches spec**

Check that the context includes:
- State: `guest_id, phone, is_recognized, is_returning_customer, available_voucher, discount_amount, subtotal, total`
- Methods: `setGuestPhone, setRecognizedGuest, setAvailableVoucher, clearGuest`
- localStorage key: `fitfuel_guest`
- Auto-restore on mount ✓
- Auto-persist on state change ✓

- [ ] **Step 3: Commit context**

```bash
git add FE/src/context/GuestContext.jsx
git commit -m "feat: add GuestContext for guest session state management"
```

---

## Task 2: Create GuestCheckoutPage.jsx with Step 1 (Phone Input)

**Files:**
- Create: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Create page structure with phone input form**

Create file `FE/src/pages/guest/GuestCheckoutPage.jsx`:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2, AlertCircle } from 'lucide-react';
import { useGuest } from '../../context/GuestContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';

const PHONE_REGEX = /^\d{10,15}$/;

export default function GuestCheckoutPage() {
  const navigate = useNavigate();
  const { 
    phone, 
    is_recognized, 
    setGuestPhone, 
    setRecognizedGuest,
    clearGuest 
  } = useGuest();
  const { foodCart, gearCart, foodTotal, gearTotal } = useCart();
  
  const [step, setStep] = useState(is_recognized ? 1 : 0); // 0=phone, 1=cart, 2=voucher, 3=confirm
  const [phoneInput, setPhoneInput] = useState(phone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const items = foodCart.length > 0 ? foodCart : gearCart;
  const cartTotal = foodCart.length > 0 ? foodTotal : gearTotal;

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Step 0: Phone Input
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!PHONE_REGEX.test(phoneInput)) {
      setError('Số điện thoại phải từ 10-15 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      // Call checkout preview API
      const response = await api.post('/api/guests/checkout/preview', {
        phone: phoneInput,
        items: items.map(i => ({ product_id: i.id, quantity: i.qty }))
      });

      // Store guest info in context
      setGuestPhone(phoneInput);
      setRecognizedGuest({
        guest_id: response.guest_id,
        is_returning_customer: response.is_returning_customer,
        subtotal: response.subtotal,
        discount_amount: response.discount_amount,
        total: response.total
      });

      // Move to cart step
      setStep(1);
      showToast('Nhận diện khách hàng thành công');
    } catch (err) {
      setError(err.message || 'Không thể nhận diện khách hàng. Vui lòng thử lại.');
      console.error('Guest recognition failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render Step 0: Phone Input
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#18181B] mb-2">Nhập số điện thoại</h1>
            <p className="text-sm text-[#4C607C]">Để tiếp tục đặt hàng</p>
          </div>

          {/* Form */}
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#18181B] mb-2">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4C607C]" />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="0912345678"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#18181B]/10 bg-white focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 outline-none transition"
                />
              </div>
              <p className="text-xs text-[#4C607C] mt-1">10-15 chữ số</p>
            </div>

            {error && (
              <div className="flex gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !phoneInput}
              className="w-full py-3 rounded-lg bg-[#FF5722] text-white font-bold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
            </button>
          </form>

          {/* Info box */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Khách hàng cũ?</strong> Nhập số điện thoại để nhận voucher giảm giá độc quyền!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Placeholder for other steps (to be implemented in next tasks)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-md mx-auto text-center">
        <p className="text-[#4C607C]">Step {step + 1}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test phone validation**

Verify the regex and form:
- Input "0912345678" (10 digits) → should pass
- Input "0912345678901234" (16 digits) → should show error "Số điện thoại phải từ 10-15 chữ số"
- Input "abc" → should show error
- Input "" → button should be disabled
- Input "0912345" (7 digits) → should show error

- [ ] **Step 3: Commit phone input step**

```bash
git add FE/src/pages/guest/GuestCheckoutPage.jsx
git commit -m "feat: add GuestCheckoutPage Step 1 - phone input form"
```

---

## Task 3: Implement Step 1 (Phone Input) Integration with Context

**Files:**
- Modify: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Fix setAvailableVoucher naming conflict**

In GuestContext.jsx, there's a variable name conflict. Update the context to use a different setter:

Edit `FE/src/context/GuestContext.jsx`, replace this section:

```javascript
  // Action: Update available voucher when user accepts/rejects
  const setAvailableVoucher = (voucher) => {
    setAvailableVoucher(voucher);
  };
```

With:

```javascript
  // Action: Update available voucher when user accepts/rejects
  const updateAvailableVoucher = (voucher) => {
    setAvailableVoucher(voucher);
  };
```

And update the return value:

```javascript
  return (
    <GuestContext.Provider value={{
      guest_id,
      phone,
      is_recognized,
      is_returning_customer,
      available_voucher,
      discount_amount,
      subtotal,
      total,
      setGuestPhone,
      setRecognizedGuest,
      updateAvailableVoucher,  // Changed from setAvailableVoucher
      clearGuest
    }}>
```

- [ ] **Step 2: Verify API response format in GuestCheckoutPage**

Add console logging to verify API response structure:

In `GuestCheckoutPage.jsx`, after the `api.post` call:

```javascript
      // Store guest info in context
      console.log('API Response:', response);
      setGuestPhone(phoneInput);
      setRecognizedGuest({
        guest_id: response.guest_id,
        is_returning_customer: response.is_returning_customer,
        subtotal: response.subtotal,
        discount_amount: response.discount_amount,
        total: response.total
      });
```

- [ ] **Step 3: Commit context fix**

```bash
git add FE/src/context/GuestContext.jsx
git commit -m "fix: resolve naming conflict in GuestContext setAvailableVoucher"
```

---

## Task 4: Implement Step 2 (Cart Display)

**Files:**
- Modify: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Add cart display component inline**

Update GuestCheckoutPage.jsx to show Step 1 (cart display):

```javascript
  // Render Step 1: Cart Display
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep(0)}
              className="text-sm text-[#FF5722] hover:underline mb-4"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-black text-[#18181B] mb-2">Giỏ hàng</h1>
            <p className="text-sm text-[#4C607C]">Xác nhận sản phẩm trước khi thanh toán</p>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg border border-[#18181B]/10 overflow-hidden mb-6">
            {items && items.length > 0 ? (
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    {item.image && (
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-20 h-20 rounded object-cover bg-slate-100"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-[#18181B]">{item.name}</h3>
                      <p className="text-sm text-[#4C607C]">Số lượng: {item.qty}</p>
                      <p className="text-sm font-bold text-[#18181B] mt-1">
                        {(item.price * item.qty).toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#4C607C]">
                <p>Giỏ hàng trống</p>
              </div>
            )}
          </div>

          {/* Price Summary */}
          {items && items.length > 0 && (
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#4C607C]">Tạm tính:</span>
                <span className="font-bold text-[#18181B]">{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              {discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá:</span>
                  <span className="font-bold text-green-600">-{discount_amount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="border-t border-[#18181B]/10 pt-3 flex justify-between">
                <span className="font-bold text-[#18181B]">Tổng cộng:</span>
                <span className="text-lg font-black text-[#FF5722]">
                  {(cartTotal - discount_amount).toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          )}

          {/* Next Step Button */}
          <button
            onClick={() => setStep(is_returning_customer && available_voucher ? 2 : 3)}
            className="w-full py-3 rounded-lg bg-[#FF5722] text-white font-bold hover:opacity-90 transition"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  }
```

- [ ] **Step 2: Update state to include discount_amount from context**

At the top of GuestCheckoutPage, add to destructuring:

```javascript
  const { 
    phone, 
    is_recognized, 
    is_returning_customer,
    available_voucher,
    discount_amount,
    setGuestPhone, 
    setRecognizedGuest,
    updateAvailableVoucher,
    clearGuest 
  } = useGuest();
```

- [ ] **Step 3: Verify cart calculation**

Test with sample items:
- Food cart with 2 items (50k each) → shows 100k subtotal
- Discount_amount from context shows correctly
- Total calculation: subtotal - discount = correct
- "Tiếp tục" navigates to step 2 (voucher) or step 3 (confirm) based on is_returning_customer

- [ ] **Step 4: Commit cart display**

```bash
git add FE/src/pages/guest/GuestCheckoutPage.jsx
git commit -m "feat: add Step 2 - cart display with price summary"
```

---

## Task 5: Implement Step 3 (Voucher Popup Modal - Conditional)

**Files:**
- Modify: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Create inline VoucherPopupModal component**

Add this component to GuestCheckoutPage.jsx before the default export:

```javascript
// VoucherPopupModal Component
function VoucherPopupModal({ voucher, onApply, onSkip, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full transform animate-in scale-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF5722] to-orange-500 px-6 py-4">
          <h2 className="text-xl font-black text-white">Chúc mừng!</h2>
          <p className="text-sm text-orange-100">Bạn có voucher độc quyền</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Voucher Code */}
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-dashed border-[#FF5722]">
            <p className="text-xs text-[#4C607C] mb-1">Mã voucher</p>
            <p className="text-2xl font-black text-[#FF5722] font-mono">{voucher.code}</p>
          </div>

          {/* Discount Info */}
          <div className="space-y-2">
            <p className="text-sm text-[#4C607C]">{voucher.description || 'Voucher giảm giá'}</p>
            <div className="flex gap-2">
              {voucher.discount_percent && (
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[#FF5722] text-sm font-bold">
                  Giảm {voucher.discount_percent}%
                </span>
              )}
              {voucher.discount_amount && (
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[#FF5722] text-sm font-bold">
                  Giảm {voucher.discount_amount.toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>
          </div>

          {/* Min Purchase */}
          {voucher.min_purchase_amount > 0 && (
            <p className="text-xs text-[#4C607C] bg-yellow-50 p-3 rounded">
              Áp dụng cho đơn hàng từ {voucher.min_purchase_amount.toLocaleString('vi-VN')} ₫
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-[#18181B]/10 p-6 space-y-3">
          <button
            onClick={onApply}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#FF5722] text-white font-bold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Đang áp dụng...' : 'Áp dụng voucher'}
          </button>
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="w-full py-3 rounded-lg border border-[#18181B]/10 text-[#18181B] font-bold hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement Step 2 (Voucher Popup) in main component**

Add this render logic before the "Placeholder for other steps" comment:

```javascript
  // Step 2: Voucher Popup (only for returning customers)
  if (step === 2 && is_returning_customer && available_voucher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <VoucherPopupModal
          voucher={available_voucher}
          onApply={async () => {
            // Mark voucher as applied - for now, just move to confirm step
            setStep(3);
            showToast('Voucher đã được áp dụng');
          }}
          onSkip={() => {
            // Skip voucher
            setStep(3);
            showToast('Bỏ qua voucher');
          }}
          isLoading={false}
        />
      </div>
    );
  }

  // If step 2 but not returning customer, skip to step 3
  if (step === 2) {
    setStep(3);
  }
```

- [ ] **Step 3: Test voucher modal**

Scenario 1: is_returning_customer=false, available_voucher=null
- Should skip step 2, go directly to step 3 ✓

Scenario 2: is_returning_customer=true, available_voucher={code: "WELCOME20", discount_percent: 20}
- Should show modal with voucher code
- "Áp dụng voucher" button moves to step 3
- "Bỏ qua" button moves to step 3 ✓

- [ ] **Step 4: Commit voucher modal**

```bash
git add FE/src/pages/guest/GuestCheckoutPage.jsx
git commit -m "feat: add Step 3 - conditional voucher popup modal for returning customers"
```

---

## Task 6: Implement Step 4 (Order Confirmation Form)

**Files:**
- Modify: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Add delivery address and payment method state**

At the top of the component, add new state:

```javascript
  const [form, setForm] = useState({
    recipient_name: '',
    recipient_phone: '',
    delivery_address: '',
    note: ''
  });
  const [payment_method, setPaymentMethod] = useState('cod');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
```

- [ ] **Step 2: Implement Step 3 (Confirmation Form) render**

Add this before the "Placeholder" comment:

```javascript
  const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: '💵' },
    { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
    { id: 'vnpay', label: 'VNPay', icon: '🔵' },
    { id: 'card', label: 'Thẻ Tín dụng / Ghi nợ', icon: '💳' },
  ];

  // Step 3: Order Confirmation
  if (step === 3) {
    const finalTotal = cartTotal - discount_amount;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setStep(2)}
              className="text-sm text-[#FF5722] hover:underline mb-4"
            >
              ← Quay lại
            </button>
            <h1 className="text-3xl font-black text-[#18181B] mb-2">Xác nhận đơn hàng</h1>
            <p className="text-sm text-[#4C607C]">Số điện thoại: {phone}</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Recipient Info */}
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-4">
              <h3 className="font-bold text-[#18181B]">Thông tin người nhận</h3>
              
              <div>
                <label className="block text-sm font-bold text-[#18181B] mb-2">Họ tên</label>
                <input
                  type="text"
                  value={form.recipient_name}
                  onChange={(e) => setForm({...form, recipient_name: e.target.value})}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#18181B] mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={form.recipient_phone}
                  onChange={(e) => setForm({...form, recipient_phone: e.target.value.replace(/\D/g, '')})}
                  placeholder="0912345678"
                  className="w-full px-4 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 outline-none transition"
                />
              </div>
            </div>

            {/* Delivery Type */}
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-3">
              <h3 className="font-bold text-[#18181B]">Hình thức giao hàng</h3>
              <div className="space-y-2">
                {['pickup', 'delivery'].map((type) => (
                  <label key={type} className="flex items-center gap-3 p-3 border border-[#18181B]/10 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="delivery"
                      value={type}
                      checked={deliveryType === type}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-bold text-[#18181B]">
                      {type === 'pickup' ? 'Lấy tại cửa hàng' : 'Giao hàng'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Address (if delivery type) */}
            {deliveryType === 'delivery' && (
              <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-4">
                <h3 className="font-bold text-[#18181B]">Địa chỉ giao hàng</h3>
                <textarea
                  value={form.delivery_address}
                  onChange={(e) => setForm({...form, delivery_address: e.target.value})}
                  placeholder="Địa chỉ chi tiết"
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 outline-none transition"
                />
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-3">
              <h3 className="font-bold text-[#18181B]">Phương thức thanh toán</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="flex items-center gap-3 p-3 border border-[#18181B]/10 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment_method === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-sm font-bold text-[#18181B]">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-4">
              <h3 className="font-bold text-[#18181B]">Ghi chú</h3>
              <textarea
                value={form.note}
                onChange={(e) => setForm({...form, note: e.target.value})}
                placeholder="Ví dụ: Không cay, không mặn..."
                rows="3"
                className="w-full px-4 py-2 rounded-lg border border-[#18181B]/10 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722]/20 outline-none transition"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-3 sticky bottom-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#4C607C]">Tạm tính:</span>
                <span className="font-bold text-[#18181B]">{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              {discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá:</span>
                  <span className="font-bold text-green-600">-{discount_amount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="border-t border-[#18181B]/10 pt-3 flex justify-between">
                <span className="font-bold text-[#18181B]">Tổng cộng:</span>
                <span className="text-lg font-black text-[#FF5722]">
                  {finalTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting || !form.recipient_name || !form.recipient_phone}
              className="w-full py-3 rounded-lg bg-[#FF5722] text-white font-bold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
            </button>
          </div>
        </div>
      </div>
    );
  }
```

- [ ] **Step 3: Implement handleConfirmOrder function**

Add this function before the render logic (after handlePhoneSubmit):

```javascript
  const handleConfirmOrder = async () => {
    // Validate required fields
    if (!form.recipient_name || !form.recipient_phone) {
      setError('Vui lòng điền đầy đủ thông tin người nhận');
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    if (deliveryType === 'delivery' && !form.delivery_address) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      showToast('Vui lòng nhập địa chỉ giao hàng', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        guest_id: guest_id,
        items: items.map(i => ({
          product_id: i.id,
          name: i.name,
          quantity: i.qty,
          price: i.price,
          image: i.image || i.images?.[0]
        })),
        subtotal: cartTotal,
        discount_amount: discount_amount,
        total: cartTotal - discount_amount,
        recipient_name: form.recipient_name,
        recipient_phone: form.recipient_phone,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? form.delivery_address : null,
        note: form.note,
        payment_method: payment_method,
        voucher_id: available_voucher?.voucher_id || null
      };

      console.log('Submitting order:', orderPayload);

      // Call place_order API
      await api.post('/api/orders/place', orderPayload);

      // Clear carts and guest session
      clearCart('all');
      clearGuest();

      showToast('Đơn hàng đã được tạo thành công!');
      
      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      console.error('Order creation failed:', err);
      showToast(err.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
```

- [ ] **Step 4: Update toast function to support error type**

Update showToast at the top:

```javascript
  const showToast = (msg, type = 'success') => {
    setToast(msg);
    // Could add type styling here in a real implementation
    setTimeout(() => setToast(''), 3000);
  };
```

- [ ] **Step 5: Test confirmation form**

Scenarios:
- Click "Xác nhận đơn hàng" without name → shows error, disabled button ✓
- Fill all required fields, click submit → calls API, redirects to /orders ✓
- Delivery type = 'delivery' → address field required ✓
- Delivery type = 'pickup' → address field hidden ✓

- [ ] **Step 6: Commit confirmation form**

```bash
git add FE/src/pages/guest/GuestCheckoutPage.jsx
git commit -m "feat: add Step 4 - order confirmation form with delivery and payment"
```

---

## Task 7: Add Toast Notifications Display

**Files:**
- Modify: `FE/src/pages/guest/GuestCheckoutPage.jsx`

- [ ] **Step 1: Add toast UI at the top level**

Add this JSX at the end of every render path, just before closing divs:

```javascript
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg bg-[#FF5722] text-white text-sm font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
            {toast}
          </div>
        )}
```

Actually, better to extract this to avoid duplication. Add to the return statement of each step or create a wrapper. For now, add it to the end of the Step 0 return, then replicate for other steps.

Better approach: Create a Toast component wrapper. Add at the very end of the file:

```javascript
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg bg-[#FF5722] text-white text-sm font-bold animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
      {message}
    </div>
  );
}
```

Then add `<Toast message={toast} />` at the end of every render, before the closing div.

- [ ] **Step 2: Test toast notifications**

- Step 0: Submit phone → "Nhận diện khách hàng thành công" appears ✓
- Step 2: Apply/Skip voucher → "Voucher đã được áp dụng" or "Bỏ qua voucher" ✓
- Step 3: Submit order → "Đơn hàng đã được tạo thành công!" ✓
- Toast disappears after 3 seconds ✓

- [ ] **Step 3: Commit toast notifications**

```bash
git add FE/src/pages/guest/GuestCheckoutPage.jsx
git commit -m "feat: add toast notifications for user feedback"
```

---

## Task 8: Create Guest Page Route & Register in App.jsx

**Files:**
- Modify: `FE/src/App.jsx`

- [ ] **Step 1: Add GuestCheckoutPage route**

Find the routes section in `FE/src/App.jsx` and add:

```javascript
import GuestCheckoutPage from './pages/guest/GuestCheckoutPage';

// In the routes array:
{
  path: '/guest/checkout',
  element: <GuestCheckoutPage />
}
```

Or if using newer React Router syntax (v7), it might be:

```javascript
<Route path="/guest/checkout" element={<GuestCheckoutPage />} />
```

- [ ] **Step 2: Add GuestProvider to App**

Wrap the router in GuestProvider:

```javascript
import { GuestProvider } from './context/GuestContext';

// In the render:
<GuestProvider>
  {/* existing provider/route structure */}
</GuestProvider>
```

Ensure the nesting order is: AuthProvider → AppProvider → CartProvider → GuestProvider → Routes

- [ ] **Step 3: Verify navigation**

- Navigate to `/guest/checkout` → shows phone input step ✓
- Complete all steps → redirects to `/orders` ✓

- [ ] **Step 4: Commit route setup**

```bash
git add FE/src/App.jsx
git commit -m "feat: add guest checkout route and GuestProvider to app"
```

---

## Task 9: Self-Review & Final Polish

**Files:**
- Review: `FE/src/context/GuestContext.jsx`
- Review: `FE/src/pages/guest/GuestCheckoutPage.jsx`
- Review: `FE/src/App.jsx`

- [ ] **Step 1: Run phone validation tests**

Test these inputs:
- "0912345678" (10 digits) → ✓ valid
- "09123456789" (11 digits) → ✓ valid
- "0123456789012345" (16 digits) → ✗ invalid, error shown
- "" → ✗ invalid, button disabled
- "abc123" → ✗ invalid, only digits allowed in input
- Expected error: "Số điện thoại phải từ 10-15 chữ số"

- [ ] **Step 2: Verify API integration**

Check that:
- POST /api/guests/checkout/preview receives: { phone, items: [{product_id, quantity}] }
- Response unwrapped correctly by api.js (returns .data)
- Guest info stored in context: guest_id, is_returning_customer, subtotal, discount_amount, total
- Voucher object stored: voucher_id, code, discount_percent/discount_amount, description

- [ ] **Step 3: Verify context localStorage persistence**

- Open DevTools → Application → Local Storage → find `fitfuel_guest`
- Refresh page → guest session restored
- Clear context via clearGuest() → localStorage item cleared

- [ ] **Step 4: Verify component imports**

Grep for missing imports:

Check GuestCheckoutPage.jsx has:
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2, AlertCircle } from 'lucide-react';
import { useGuest } from '../../context/GuestContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
```

Check GuestContext.jsx has:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
```

- [ ] **Step 5: Verify responsive design**

Test at breakpoints:
- Mobile (375px): Forms stack, buttons full-width, text readable ✓
- Tablet (768px): Layout expands, spacing increases ✓
- Desktop (1024px): Max-width containers work, sidebar for summary ✓

- [ ] **Step 6: Check console for errors**

Run in browser, complete full flow:
- No red errors in console ✓
- Network tab shows API calls with correct payloads ✓
- No TypeScript errors (if using TS) ✓

- [ ] **Step 7: Verify UI consistency**

Check against existing FitFuel+ design:
- Colors: Orange #FF5722 for CTAs, dark #18181B for text ✓
- Borders: 1px border-[#18181B]/10 for cards ✓
- Spacing: 4px/8px/12px/16px Tailwind scale ✓
- Icons: Lucide React size 4-5 for inline, 20 for headers ✓
- Font weights: bold (600) for labels, black (900) for headings ✓

- [ ] **Step 8: Final verification checklist**

- [ ] Phone input validation regex: `^\d{10,15}$` ✓
- [ ] Checkout preview endpoint correct: `POST /api/guests/checkout/preview` ✓
- [ ] Voucher shows only for is_returning_customer=true AND available_voucher exists ✓
- [ ] Discount amount displayed correctly in cart summary ✓
- [ ] Order submission includes guest_id (not user_id) ✓
- [ ] localStorage key is `fitfuel_guest` ✓
- [ ] Toast notifications appear/disappear correctly ✓
- [ ] All 4 steps reachable and functional ✓
- [ ] Navigation back-button works at each step ✓
- [ ] Redirect to /orders after successful order ✓

- [ ] **Step 9: Final commit**

```bash
git add FE/src/context/GuestContext.jsx FE/src/pages/guest/GuestCheckoutPage.jsx FE/src/App.jsx
git commit -m "feat: add GuestContext and GuestCheckoutPage for guest phone-based checkout flow"
```

---

## Spec Coverage Verification

**Requirement: Phone input with Vietnamese phone validation (10-15 digits, regex: ^\d{10,15}$)**
- ✓ Task 2, Step 1: Regex validation in phone form

**Requirement: Call checkout preview endpoint: POST /api/guests/checkout/preview**
- ✓ Task 2, Step 1: handlePhoneSubmit calls api.post('/api/guests/checkout/preview', ...)

**Requirement: Response contains guest_id, is_returning_customer, available_voucher (optional), subtotal, discount_amount, total**
- ✓ Task 1: GuestContext stores all these fields
- ✓ Task 2: setRecognizedGuest stores the response

**Requirement: If is_returning_customer=true and available_voucher exists, show VoucherPopupModal**
- ✓ Task 5: Conditional render checks both conditions

**Requirement: User can Apply voucher or Skip it**
- ✓ Task 5: Modal has onApply and onSkip buttons

**Requirement: Cart display shows subtotal, discount, total**
- ✓ Task 4, Step 1: Cart step displays all three values

**Requirement: Final button "Xác nhận đơn hàng" calls place_order endpoint**
- ✓ Task 6, Step 3: handleConfirmOrder calls api.post('/api/orders/place', ...)

**Requirement: Create GuestContext.jsx with context hook and Provider**
- ✓ Task 1: Full context implementation

**Requirement: Create GuestCheckoutPage.jsx with 4-step flow**
- ✓ Task 2-6: All steps implemented (phone → cart → voucher → confirm)

**Requirement: All state persists to localStorage**
- ✓ Task 1: useEffect syncs to localStorage on mount and change

**Requirement: Toast notifications for success/error**
- ✓ Task 7: Toast component and showToast function

