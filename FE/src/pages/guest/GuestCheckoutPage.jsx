import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2, AlertCircle, X, MapPin, ArrowRight, Zap } from 'lucide-react';
import { useGuest } from '../../context/GuestContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const PHONE_REGEX = /^\d{10,15}$/;

export default function GuestCheckoutPage() {
  const navigate = useNavigate();
  const {
    phone,
    guest_id,
    is_recognized,
    is_returning_customer,
    available_voucher,
    discount_amount,
    setGuestPhone,
    setRecognizedGuest,
    updateAvailableVoucher,
    clearGuest
  } = useGuest();
  const { foodCart, gearCart, foodTotal, gearTotal, clearCart } = useCart();

  const [step, setStep] = useState(is_recognized ? 1 : 0);
  const [phoneInput, setPhoneInput] = useState(phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    recipient_name: '',
    recipient_phone: '',
    delivery_address: '',
    note: ''
  });
  const [payment_method, setPaymentMethod] = useState('cod');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cashGuideOpen, setCashGuideOpen] = useState(false);
  const [cashReference] = useState(() => `FF-GUEST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);

  const items = foodCart && foodCart.length > 0 ? foodCart : gearCart;
  const cartTotal = (foodCart && foodCart.length > 0 ? foodTotal : gearTotal) || 0;

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!PHONE_REGEX.test(phoneInput)) {
      setError('Số điện thoại phải từ 10-15 chữ số');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/guests/checkout/preview', {
        phone: phoneInput,
        items: items.map(i => ({ product_id: i.id, quantity: i.qty }))
      });

      console.log('API Response:', response);

      setGuestPhone(phoneInput);
      setRecognizedGuest({
        guest_id: response.guest_id,
        is_returning_customer: response.is_returning_customer,
        subtotal: response.subtotal,
        discount_amount: response.discount_amount,
        total: response.total
      });

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
      const finalDiscount = discount_amount || 0;
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
        discount_amount: finalDiscount,
        total: cartTotal - finalDiscount,
        recipient_name: form.recipient_name,
        recipient_phone: form.recipient_phone,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? form.delivery_address : null,
        note: form.note,
        payment_method: payment_method,
        voucher_id: available_voucher?.voucher_id || null
      };

      console.log('Submitting order:', orderPayload);

      await api.post('/api/orders/place', orderPayload);

      if (clearCart) clearCart();
      clearGuest();

      showToast('Đơn hàng đã được tạo thành công!');

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

  const handleSubmitOrderClick = () => {
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

    if (payment_method === 'cod') {
      setCashGuideOpen(true);
    } else {
      handleConfirmOrder();
    }
  };

  // Step 0: Phone Input
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#18181B] mb-2">Nhập số điện thoại</h1>
            <p className="text-sm text-[#4C607C]">Để tiếp tục đặt hàng</p>
          </div>

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

  // Step 1: Cart Display
  if (step === 1) {
    const displayDiscount = discount_amount || 0;
    const displayTotal = Math.max(0, cartTotal - displayDiscount);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
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
                        {((item.price || 0) * (item.qty || 1)).toLocaleString('vi-VN')} ₫
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

          {items && items.length > 0 && (
            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#4C607C]">Tạm tính:</span>
                <span className="font-bold text-[#18181B]">{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              {displayDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá:</span>
                  <span className="font-bold text-green-600">-{displayDiscount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="border-t border-[#18181B]/10 pt-3 flex justify-between">
                <span className="font-bold text-[#18181B]">Tổng cộng:</span>
                <span className="text-lg font-black text-[#FF5722]">
                  {displayTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          )}

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

  // Step 2: Voucher Popup or skip to confirmation
  if (step === 2) {
    if (is_returning_customer && available_voucher) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
          <VoucherPopupModal
            voucher={available_voucher}
            onApply={() => {
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
    // If no voucher, skip to step 3 by rendering it directly
    // No setState call here - just continue to step 3 rendering
  }

  const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: '💵' },
    { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
    { id: 'vnpay', label: 'VNPay', icon: '🔵' },
    { id: 'card', label: 'Thẻ Tín dụng / Ghi nợ', icon: '💳' },
  ];

  // Step 3: Order Confirmation
  if (step === 3) {
    const displayDiscount = discount_amount || 0;
    const finalTotal = Math.max(0, cartTotal - displayDiscount);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
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

          <div className="space-y-6">
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

            <div className="bg-white rounded-lg border border-[#18181B]/10 p-6 space-y-3 sticky bottom-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#4C607C]">Tạm tính:</span>
                <span className="font-bold text-[#18181B]">{cartTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              {displayDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Giảm giá:</span>
                  <span className="font-bold text-green-600">-{displayDiscount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
              <div className="border-t border-[#18181B]/10 pt-3 flex justify-between">
                <span className="font-bold text-[#18181B]">Tổng cộng:</span>
                <span className="text-lg font-black text-[#FF5722]">
                  {finalTotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmitOrderClick}
              disabled={isSubmitting || !form.recipient_name || !form.recipient_phone}
              className="w-full py-3 rounded-lg bg-[#FF5722] text-white font-bold hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
            </button>
          </div>
        </div>

        <Toast message={toast} />

        {createPortal(
          <AnimatePresence>
            {cashGuideOpen && (
              <GuestCashPaymentGuide
                deliveryType={deliveryType}
                recipientName={form.recipient_name}
                recipientPhone={form.recipient_phone}
                finalPrice={finalTotal}
                referenceCode={cashReference}
                onDismiss={() => setCashGuideOpen(false)}
                onChooseOnline={() => {
                  setCashGuideOpen(false);
                  setPaymentMethod('momo');
                }}
                onDone={() => {
                  setCashGuideOpen(false);
                  handleConfirmOrder();
                }}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    );
  }

  return null;
}

function VoucherPopupModal({ voucher, onApply, onSkip, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="bg-gradient-to-r from-[#FF5722] to-orange-500 px-6 py-4">
          <h2 className="text-xl font-black text-white">Chúc mừng!</h2>
          <p className="text-sm text-orange-100">Bạn có voucher độc quyền</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-dashed border-[#FF5722]">
            <p className="text-xs text-[#4C607C] mb-1">Mã voucher</p>
            <p className="text-2xl font-black text-[#FF5722] font-mono">{voucher.code}</p>
          </div>

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
                  Giảm {(voucher.discount_amount || 0).toLocaleString('vi-VN')} ₫
                </span>
              )}
            </div>
          </div>

          {(voucher.min_purchase_amount || 0) > 0 && (
            <p className="text-xs text-[#4C607C] bg-yellow-50 p-3 rounded">
              Áp dụng cho đơn hàng từ {(voucher.min_purchase_amount || 0).toLocaleString('vi-VN')} ₫
            </p>
          )}
        </div>

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

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg bg-[#FF5722] text-white text-sm font-bold z-50">
      {message}
    </div>
  );
}

function GuestCashPaymentGuide({
  deliveryType,
  recipientName,
  recipientPhone,
  finalPrice,
  referenceCode,
  onDismiss,
  onChooseOnline,
  onDone,
}) {
  const purpose = deliveryType === 'pickup'
    ? 'Nhận hàng & Thanh toán tại quầy'
    : 'Nhận hàng & Thanh toán khi giao hàng (COD)';

  const steps = deliveryType === 'pickup' ? [
    'Đến quầy lễ tân FitFuel+ trong vòng 24 giờ.',
    `Đọc số điện thoại người nhận: ${recipientPhone} hoặc Mã hướng dẫn: ${referenceCode}.`,
    `Thanh toán số tiền ${finalPrice.toLocaleString('vi-VN')} ₫ bằng tiền mặt hoặc chuyển khoản tại quầy.`,
    'Đơn hàng sẽ được nhân viên chuẩn bị và trao trực tiếp sau khi xác nhận thanh toán.'
  ] : [
    'Đơn hàng sẽ được đóng gói và giao đến địa chỉ của bạn.',
    `Chuẩn bị sẵn số tiền ${finalPrice.toLocaleString('vi-VN')} ₫ tiền mặt khi shippper giao hàng.`,
    'Đồng kiểm và nhận hàng từ nhân viên giao hàng.'
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="glass rounded-2xl border border-[#16a34a]/25 w-full max-w-md shadow-2xl overflow-hidden bg-white text-[#18181B]"
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#18181B]/10">
          <div>
            <p className="text-xs text-[#16a34a] font-bold mb-1">
              {deliveryType === 'pickup' ? 'Thanh toán tại quầy' : 'Thanh toán khi nhận hàng'}
            </p>
            <h3 className="font-black text-[#18181B] text-lg">Hướng dẫn thanh toán</h3>
          </div>
          <button onClick={onDismiss} className="text-[#18181B]/40 hover:text-[#18181B] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-xl p-4 bg-[#16a34a]/10 border border-[#16a34a]/20">
            <p className="text-[11px] text-[#18181B]/50 font-semibold uppercase tracking-wider mb-1">Mã hướng dẫn</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-2xl font-black text-[#18181B] tracking-wide">{referenceCode}</p>
              <span className="text-sm font-black text-[#16a34a]">{finalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            <p className="text-xs text-[#18181B]/60 mt-1">{purpose}</p>
          </div>

          <div className="space-y-3">
            {steps.map((text, index) => (
              <div key={text} className="flex gap-3 text-sm text-[#18181B]/75">
                <span className="w-6 h-6 rounded-full bg-[#16a34a]/10 text-[#16a34a] font-black text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{text}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-3 text-xs text-[#18181B]/60 flex items-start gap-2 bg-white border border-[#18181B]/10">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#16a34a]" />
            <span>Họ tên người nhận: <b>{recipientName}</b> - SĐT: <b>{recipientPhone}</b>.</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onChooseOnline}
              className="flex-1 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B]/70 text-sm font-semibold hover:text-[#18181B] transition-colors">
              Đổi phương thức
            </button>
            <button onClick={onDone}
              className="flex-1 py-3 rounded-xl bg-[#16a34a] text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Đã hiểu & Đặt hàng
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
