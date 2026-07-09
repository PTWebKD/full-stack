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
    is_returning_customer,
    available_voucher,
    discount_amount,
    setGuestPhone,
    setRecognizedGuest,
    updateAvailableVoucher,
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

      console.log('API Response:', response);

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

  const [form, setForm] = useState({
    recipient_name: '',
    recipient_phone: '',
    delivery_address: '',
    note: ''
  });
  const [payment_method, setPaymentMethod] = useState('cod');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        <Toast message={toast} />
      </div>
    );
  }

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

        <Toast message={toast} />
      </div>
    );
  }

  // Step 2: Voucher Popup (only for returning customers)
  if (step === 2 && is_returning_customer && available_voucher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <VoucherPopupModal
          voucher={available_voucher}
          onApply={async () => {
            setStep(3);
            showToast('Voucher đã được áp dụng');
          }}
          onSkip={() => {
            setStep(3);
            showToast('Bỏ qua voucher');
          }}
          isLoading={false}
        />
        <Toast message={toast} />
      </div>
    );
  }

  // If step 2 but not returning customer, skip to step 3
  if (step === 2) {
    setStep(3);
  }

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

        <Toast message={toast} />
      </div>
    );
  }

  // Placeholder for other steps (to be implemented)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <div className="max-w-md mx-auto text-center">
        <p className="text-[#4C607C]">Step {step + 1}</p>
      </div>
    </div>
  );
}

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

// Toast Component
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg bg-[#FF5722] text-white text-sm font-bold animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
      {message}
    </div>
  );
}
