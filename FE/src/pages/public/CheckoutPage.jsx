import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Phone, Loader2, ShieldCheck, Info, AlertCircle, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import DeliveryChoice from '../../components/delivery/DeliveryChoice';
import AddressSelector from '../../components/delivery/AddressSelector';
import ShippingFeeDisplay from '../../components/delivery/ShippingFeeDisplay';

const steps = ['Địa chỉ', 'Thanh toán', 'Xác nhận'];

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: '💵' },
  { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
  { id: 'vnpay', label: 'VNPay', icon: '🔵' },
  { id: 'card', label: 'Thẻ Tín dụng / Ghi nợ', icon: '💳' },
];

// Thông tin thụ hưởng mô phỏng cho màn hình quét QR thanh toán online (demo, không phải cổng thật)
const QR_PAYEE_INFO = {
  momo: { channel: 'Ví MoMo', accountLabel: 'Số điện thoại', accountNumber: '0909 123 456' },
  vnpay: { channel: 'VNPAY-QR · Vietcombank', accountLabel: 'Số tài khoản', accountNumber: '0071 0002 1379 4562' },
  card: { channel: 'Cổng thanh toán thẻ', accountLabel: 'Số tài khoản', accountNumber: '0071 0002 1379 4562' },
};
const QR_PAYEE_NAME = 'ĐỖ PHÚC KHANG';

// Sinh ảnh QR thật (quét được bằng camera) chứa nội dung chuyển khoản mô phỏng —
// dùng dịch vụ tạo QR công khai, không cần thư viện/backend riêng.
function buildQrImageUrl({ channel, accountNumber }, amount) {
  const content = `FitFuel+ Thanh toan don hang\n${channel}\nSTK: ${accountNumber}\nNguoi nhan: ${QR_PAYEE_NAME}\nSo tien: ${Math.round(amount)}d`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(content)}`;
}

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const type = params.get('type') || 'food';
  const { foodCart, gearCart, foodTotal, gearTotal, clearCart, updateFoodQty, updateGearQty, removeFood, removeGear, addFood, addGear } = useCart();
  const { user } = useAuth();
  const items = type === 'food' ? foodCart : gearCart;
  const total = type === 'food' ? foodTotal : gearTotal;
  // If not logged in, start at step -1 (OTP), otherwise start at step 0
  const [step, setStep] = useState(user ? 0 : -1);
  const [form, setForm] = useState(() => ({
    name: user?.name || user?.display_name || '',
    phone: user?.phone || '',
    address: '',
    note: ''
  }));
  const [payment, setPayment] = useState('cod');
  const [done, setDone] = useState(false);
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [shippingAddressId, setShippingAddressId] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isFreeship, setIsFreeship] = useState(false);
  const [useFitcoin, setUseFitcoin] = useState(false);
  const [fitcoinInput, setFitcoinInput] = useState(0);
  const [fitcoinBalance, setFitcoinBalance] = useState(0);
  const navigate = useNavigate();
  const fmt = (n) => n.toLocaleString('vi-VN');

  useEffect(() => {
    if (user && user.role === 'member') {
      api.get('/api/fitcoin/balance')
        .then(bal => {
          setFitcoinBalance(bal.balance !== undefined ? bal.balance : bal);
        })
        .catch(() => {
          setFitcoinBalance(0);
        });
    }
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || user.name || user.display_name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Bổ sung thêm món khác ngay tại trang thanh toán, không cần quay lại trang danh mục
  const [showAddMore, setShowAddMore] = useState(false);
  const [addMoreSearch, setAddMoreSearch] = useState('');
  const [addMoreItems, setAddMoreItems] = useState([]);
  const [addMoreLoading, setAddMoreLoading] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  useEffect(() => {
    if (!showAddMore || addMoreItems.length > 0) return;
    setAddMoreLoading(true);
    const endpoint = type === 'food' ? '/api/food/products' : '/api/gear';
    api.get(endpoint)
      .then(data => setAddMoreItems(Array.isArray(data) ? data : data.items || []))
      .catch(() => setAddMoreItems([]))
      .finally(() => setAddMoreLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddMore]);

  const currentCartIds = new Set(items.map(i => i.id));
  const addMoreFiltered = addMoreItems
    .filter(p => type === 'gear' ? p.listing_type !== 'rent' : true) // gear thuê xử lý ở trang riêng, không thêm qua đây
    .filter(p => p.is_available !== false)
    .filter(p => p.name.toLowerCase().includes(addMoreSearch.toLowerCase()));

  const handleAddMore = (p) => {
    if (type === 'food') {
      addFood({ id: p.product_id, name: p.name, price: parseFloat(p.price) || 0, vendor_id: p.vendor_id, image: p.images?.[0] || '' });
    } else {
      addGear({ ...p, id: p.gear_id, price: p.sell_price || p.rent_price_day || 0 });
    }
    setJustAddedId(p.product_id || p.gear_id);
    setTimeout(() => setJustAddedId(null), 1200);
  };

  // Guest OTP state
  const [guestPhone, setGuestPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = async () => {
    if (!guestPhone || guestPhone.length < 9) {
      setOtpError('Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }
    setOtpError('');
    setOtpSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setOtpSending(false);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (otpValue.length !== 6) {
      setOtpError('OTP phải đúng 6 chữ số.');
      return;
    }
    // Any 6-digit OTP is valid (mock)
    setStep(0);
  };

  const [showCounterGuide, setShowCounterGuide] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [targetPhoneState, setTargetPhoneState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gearCheckoutResult, setGearCheckoutResult] = useState(null); // { transactions, errors }

  // Mô phỏng màn hình quét mã QR cho các phương thức thanh toán online (momo/vnpay/card)
  const [showQrPayment, setShowQrPayment] = useState(false);
  const [qrPaymentStage, setQrPaymentStage] = useState('waiting'); // 'waiting' | 'success'
  const [qrSecondsLeft, setQrSecondsLeft] = useState(6);

  const submitOrder = async () => {
    setIsSubmitting(true);
    try {
      if (type === 'gear') {
        // Mua đứt gear — khác hoàn toàn luồng food: gọi checkout riêng của gear module,
        // không đi qua /api/food/orders (gear dùng gear_id dạng chuỗi, không phải product_id số).
        const result = await api.post('/api/gear/checkout', {
          gear_ids: items.map(item => item.id),
        });
        clearCart(type);
        setGearCheckoutResult(result);
        setShowCounterGuide(false);
        setShowSuccessPopup(true);
        return;
      }

      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        delivery_address: deliveryType === 'delivery'
          ? (user ? 'Giao hàng tận nơi' : form.address)
          : 'Lấy tại quầy',
        vendor_id: items[0]?.vendor_id || 1,
        payment_method: payment,
        fitcoin_used: useFitcoin ? fitcoinInput : 0,
        delivery_type: deliveryType,
        shipping_address_id: deliveryType === 'delivery' && user ? shippingAddressId : null,
        shipping_fee: deliveryType === 'delivery' ? shippingFee : 0,
        // Guests are identified by phone (BR-18); members by their JWT
        ...(user ? {} : { guest_phone: form.phone || guestPhone }),
      };

      await api.post('/api/food/orders', orderData);
      clearCart(type);
      const targetPhone = form.phone || guestPhone || user?.phone || '';
      setTargetPhoneState(targetPhone);

      // Đóng hướng dẫn nếu đang hiển thị
      setShowCounterGuide(false);

      // Hiển thị pop-up thành công trên web
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Failed to create order:', error);
      setErrorMessage(error.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (skipGuide = false) => {
    // Nếu là khách (guest) chọn thanh toán tại quầy/COD và chưa qua bước popup xác nhận hướng dẫn
    if (!user && payment === 'cod' && !skipGuide) {
      setShowCounterGuide(true);
      return;
    }

    // Phương thức online → hiện màn hình quét QR mô phỏng trước, chỉ tạo đơn thật sau khi
    // "thanh toán" giả lập báo thành công (xem useEffect theo dõi showQrPayment bên dưới).
    if (payment !== 'cod') {
      setShowCounterGuide(false);
      setQrPaymentStage('waiting');
      setShowQrPayment(true);
      return;
    }

    await submitOrder();
  };

  // Tự động chuyển từ "đang chờ quét" → "thanh toán thành công" → tạo đơn hàng thật
  // (kéo dài hơn để người dùng có đủ thời gian nhìn/quét mã QR, không bị nhảy quá nhanh)
  useEffect(() => {
    if (!showQrPayment) return;
    setQrPaymentStage('waiting');
    setQrSecondsLeft(6);
    const tick = setInterval(() => setQrSecondsLeft(s => Math.max(0, s - 1)), 1000);
    const toSuccess = setTimeout(() => setQrPaymentStage('success'), 6000);
    const proceed = setTimeout(() => {
      setShowQrPayment(false);
      submitOrder();
    }, 8500);
    return () => { clearInterval(tick); clearTimeout(toSuccess); clearTimeout(proceed); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQrPayment]);

  // Không áp dụng "giỏ hàng trống" ngay sau khi đặt hàng thành công — nếu không, clearCart()
  // sẽ làm items rỗng NGAY trong lần render đó và che mất pop-up thông báo bên dưới.
  if (items.length === 0 && !showSuccessPopup) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-[#18181B]/60 mb-4">Giỏ hàng {type === 'food' ? 'Thực phẩm' : 'Gear'} của bạn đang trống.</p>
      <Link to="/cart" className="text-[#FF5722] hover:underline text-sm">Quay lại Giỏ hàng</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-[#18181B] mb-8">Thanh Toán</h1>

      {step === -1 && type === 'gear' ? (
        <div className="max-w-md mx-auto">
          {/* Mua gear yêu cầu tài khoản thật (GearTransaction cần buyer_id) — không hỗ trợ Guest OTP như bên food */}
          <div className="glass rounded-3xl p-6 border border-[#18181B]/10 text-center space-y-4">
            <ShieldCheck className="w-10 h-10 text-[#FF5722] mx-auto" />
            <h3 className="font-bold text-[#18181B]">Cần đăng nhập để mua Gear</h3>
            <p className="text-sm text-[#18181B]/60">Vui lòng đăng nhập tài khoản Member để hoàn tất mua dụng cụ tập luyện.</p>
            <Link to="/auth/login" className="inline-block w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm hover:bg-[#FF5722]/90 transition-colors">
              Đăng nhập
            </Link>
          </div>
        </div>
      ) : step === -1 ? (
        <div className="max-w-md mx-auto">
          {/* Guest OTP Step */}
          <div className="glass rounded-3xl p-6 border border-[#18181B]/10">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
              <h3 className="font-semibold text-[#18181B]">Xác thực khách hàng</h3>
            </div>
            <p className="text-sm text-[#18181B]/60 mb-5">Nhập số điện thoại để nhận OTP và tiếp tục thanh toán.</p>
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5">Số điện thoại (VD: 0912 345 678)</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#18181B]/40" />
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={e => { setGuestPhone(e.target.value); setOtpError(''); }}
                        placeholder="0912 345 678"
                        className="w-full pl-9 pr-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={otpSending || !guestPhone}
                      className="px-5 py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm disabled:opacity-40 hover:bg-[#FF5722]/90 transition-colors flex items-center gap-2 shrink-0"
                    >
                      {otpSending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {otpSending ? 'Đang gửi...' : 'Gửi OTP'}
                    </button>
                  </div>
                </div>
                {otpError && <p className="text-red-400 text-xs">{otpError}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FF5722]/5 border border-[#FF5722]/20 text-sm text-[#FF5722]">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  OTP đã gửi đến {guestPhone}
                </div>
                <div>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5">Nhập mã OTP (6 chữ số)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={e => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                    placeholder="• • • • • •"
                    className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm text-center tracking-[0.5em] font-bold"
                  />
                </div>
                {otpError && <p className="text-red-400 text-xs">{otpError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => { setOtpSent(false); setOtpValue(''); setOtpError(''); }} className="flex-1 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-semibold hover:bg-white">Nhập lại số</button>
                  <button onClick={handleVerifyOtp} className="flex-1 py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm hover:bg-[#FF5722]/90 transition-colors">Xác nhận</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Delivery details, order items, and payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Delivery Info */}
            <div className="glass rounded-3xl p-6 border border-[#18181B]/10 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#18181B]/10">
                <MapPin className="w-4.5 h-4.5 text-[#FF5722]" />
                <h3 className="font-black text-[#18181B] text-base">1. Thông tin giao nhận</h3>
              </div>

              <DeliveryChoice value={deliveryType} onChange={setDeliveryType} />

              {deliveryType === 'delivery' && (
                <>
                  {user ? (
                    <AddressSelector value={shippingAddressId} onChange={setShippingAddressId} />
                  ) : (
                    <div>
                      <label className="block text-xs text-[#18181B]/60 mb-1.5 font-bold">Địa chỉ giao hàng</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                        placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                        className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm font-medium"
                      />
                    </div>
                  )}
                  <ShippingFeeDisplay
                    subtotal={total}
                    onFeeCalculated={(fee) => { setShippingFee(fee.shipping_fee); setIsFreeship(fee.is_freeship ?? false); }}
                  />
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5 font-bold">Họ và tên người nhận</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Tên người nhận"
                    className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#18181B]/60 mb-1.5 font-bold">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="0xxx xxx xxx"
                    className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#18181B]/60 mb-1.5 font-bold">Ghi chú giao hàng (tùy chọn)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="VD: Yêu cầu đặc biệt, hướng dẫn giao nhận..."
                  className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm font-medium"
                />
              </div>
            </div>

            {/* Section 2: Items in Order */}
            <div className="glass rounded-3xl p-6 border border-[#18181B]/10 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#18181B]/10">
                <CheckCircle className="w-4.5 h-4.5 text-[#FF5722]" />
                <h3 className="font-black text-[#18181B] text-base">2. Sản phẩm trong đơn hàng</h3>
              </div>
              <div className="divide-y divide-[#18181B]/5">
                {items.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-[#18181B]/50 mb-4">Giỏ hàng trống</p>
                    <Link to={type === 'food' ? '/nutrition' : '/gear'} className="px-4 py-2 bg-[#18181B] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors inline-block">
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 group">
                      <img src={item.images?.[0] || item.image || ''} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[#18181B]/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#18181B] truncate pr-2">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex items-center bg-white/5 border border-[#18181B]/10 rounded-lg">
                            <button 
                              onClick={() => type === 'food' ? updateFoodQty(item.id, item.qty - 1) : updateGearQty(item.id, item.qty - 1)}
                              className="p-1 text-[#18181B]/60 hover:text-[#18181B] hover:bg-[#18181B]/5 rounded-l-lg transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-semibold text-[#18181B] w-6 text-center">{item.qty}</span>
                            <button 
                              onClick={() => type === 'food' ? updateFoodQty(item.id, item.qty + 1) : updateGearQty(item.id, item.qty + 1)}
                              className="p-1 text-[#18181B]/60 hover:text-[#18181B] hover:bg-[#18181B]/5 rounded-r-lg transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => type === 'food' ? removeFood(item.id) : removeGear(item.id)}
                            className="p-1 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[#18181B]">{fmt(item.price * item.qty)}đ</p>
                    </div>
                  ))
                )}
              </div>

              {/* Bổ sung thêm món khác ngay tại trang thanh toán */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddMore(v => !v)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-[#FF5722]/40 text-[#FF5722] text-xs font-bold hover:bg-[#FF5722]/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> {showAddMore ? 'Ẩn danh sách' : 'Bổ sung thêm món khác'}
                </button>

                {showAddMore && (
                  <div className="mt-3 rounded-2xl border border-[#18181B]/10 bg-white/60 p-3 space-y-3">
                    <input
                      value={addMoreSearch}
                      onChange={e => setAddMoreSearch(e.target.value)}
                      placeholder={type === 'food' ? 'Tìm món ăn...' : 'Tìm dụng cụ...'}
                      className="w-full px-3 py-2 rounded-xl border border-[#18181B]/10 text-sm text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50"
                    />
                    <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                      {addMoreLoading ? (
                        <p className="text-center text-xs text-[#18181B]/40 py-4">Đang tải...</p>
                      ) : addMoreFiltered.length === 0 ? (
                        <p className="text-center text-xs text-[#18181B]/40 py-4">Không tìm thấy sản phẩm phù hợp</p>
                      ) : (
                        addMoreFiltered.map(p => {
                          const pid = p.product_id || p.gear_id;
                          const price = p.price ?? p.sell_price ?? p.rent_price_day ?? 0;
                          const alreadyInCart = currentCartIds.has(pid);
                          return (
                            <div key={pid} className="flex items-center gap-3 py-1.5">
                              <img src={p.images?.[0] || ''} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#18181B]/10 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#18181B] truncate">{p.name}</p>
                                <p className="text-[11px] text-[#18181B]/50">{fmt(Number(price) || 0)}đ</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleAddMore(p)}
                                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${justAddedId === pid ? 'bg-[#FF5722]/20 text-[#FF5722]' : 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'}`}
                              >
                                {justAddedId === pid ? 'Đã thêm' : alreadyInCart ? '+1' : 'Thêm'}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Payment & Offers */}
            <div className="glass rounded-3xl p-6 border border-[#18181B]/10 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-[#18181B]/10">
                <CreditCard className="w-4.5 h-4.5 text-[#FF5722]" />
                <h3 className="font-black text-[#18181B] text-base">3. Ưu đãi & Phương thức thanh toán</h3>
              </div>

              {/* FitCoin block */}
              {user && user.role === 'member' && (
                <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪙</span>
                      <div>
                        <h4 className="text-xs font-black text-[#18181B]">Sử dụng FitCoin tích lũy</h4>
                        <p className="text-[10px] text-[#18181B]/60 font-semibold">
                          Số dư khả dụng: <span className="font-bold text-[#FF5722]">{fmt(fitcoinBalance)} FitCoin</span>
                        </p>
                      </div>
                    </div>
                    <label className={`relative inline-flex items-center ${fitcoinBalance > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                      <input
                        type="checkbox"
                        checked={useFitcoin}
                        disabled={fitcoinBalance === 0}
                        onChange={(e) => {
                          setUseFitcoin(e.target.checked);
                          if (e.target.checked) {
                            const maxCoins = Math.floor(total * 0.5);
                            const toUse = Math.min(fitcoinBalance, maxCoins);
                            setFitcoinInput(toUse);
                          } else {
                            setFitcoinInput(0);
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#18181B]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5722]"></div>
                    </label>
                  </div>

                  {useFitcoin && (
                    <div className="space-y-2 mt-3 pt-3 border-t border-orange-500/10">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={fitcoinInput}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value) || 0);
                            const maxCoins = Math.floor(total * 0.5);
                            const finalVal = Math.min(val, fitcoinBalance, maxCoins);
                            setFitcoinInput(finalVal);
                          }}
                          className="w-28 px-3 py-1.5 rounded-lg bg-white border border-[#18181B]/10 text-xs text-[#18181B] focus:outline-none focus:border-[#FF5722] font-black text-center"
                          placeholder="Số FitCoin"
                        />
                        <span className="text-xs text-[#18181B]/60 font-bold">
                          = -{fmt(fitcoinInput)}đ
                        </span>
                      </div>
                      <p className="text-[10px] text-[#18181B]/40 font-semibold">
                        * Khấu trừ tối đa 50% đơn hàng (tối đa -{fmt(Math.floor(total * 0.5))}đ)
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs text-[#18181B]/60 font-bold">Chọn phương thức thanh toán</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map(m => (
                    <label key={m.id} className={`relative flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${payment === m.id ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-sm' : 'border-[#18181B]/10 hover:border-[#18181B]/20 bg-white/40'}`}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={e => setPayment(e.target.value)} className="sr-only" />
                      <span className="text-xl">{m.icon}</span>
                      <span className="text-xs font-bold text-[#18181B]">{m.label}</span>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${payment === m.id ? 'border-[#FF5722]' : 'border-[#18181B]/20'}`}>
                        {payment === m.id && <div className="w-2 h-2 rounded-full bg-[#FF5722]" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout summary and order button */}
          <div className="lg:col-span-1 sticky top-6">
            <div className="glass rounded-3xl p-6 border border-[#18181B]/10 space-y-6">
              <h3 className="font-bold text-[#18181B] text-base pb-3 border-b border-[#18181B]/10">Tóm tắt thanh toán</h3>

              <div className="space-y-3 text-xs font-semibold text-[#18181B]/60">
                <div className="flex justify-between">
                  <span>Tổng tiền sản phẩm</span>
                  <span className="text-[#18181B] font-bold">{fmt(total)}đ</span>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span className={isFreeship ? 'text-green-500 font-bold' : 'text-[#18181B] font-bold'}>
                      {isFreeship ? 'Miễn phí' : `+${fmt(shippingFee)}đ`}
                    </span>
                  </div>
                )}

                {useFitcoin && fitcoinInput > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Khấu trừ FitCoin</span>
                    <span className="font-bold">-{fmt(fitcoinInput)}đ</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#18181B]/10 flex justify-between items-baseline">
                <span className="text-xs font-bold text-[#18181B]">Tổng số tiền</span>
                <span className="text-xl font-black text-[#FF5722]">{fmt(Math.max(0, (deliveryType === 'delivery' ? total + shippingFee : total) - (useFitcoin ? fitcoinInput : 0)))}đ</span>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!form.name || !form.phone || (deliveryType === 'delivery' && (user ? !shippingAddressId : !form.address))}
                className="w-full py-4 rounded-2xl bg-[#FF5722] text-white font-black text-sm disabled:opacity-40 hover:opacity-95 transition-all shadow-md shadow-[#FF5722]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Đặt hàng ngay
              </button>

              <div className="text-[10px] text-[#18181B]/40 font-semibold text-center leading-relaxed">
                Bằng việc nhấn đặt hàng, bạn đồng ý với các điều khoản mua sắm và chính sách giao hàng của FitFuel+.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up mô phỏng quét mã QR thanh toán online (momo/vnpay/thẻ) — rendered via
          portal so it isn't clipped by PublicLayout's animated (transformed) page
          wrapper, which would otherwise become the containing block for this
          fixed-position overlay instead of the viewport. */}
      {showQrPayment && (() => {
        const payee = QR_PAYEE_INFO[payment] || QR_PAYEE_INFO.vnpay;
        const displayTotal = Math.max(0, (deliveryType === 'delivery' ? total + shippingFee : total) - (useFitcoin ? fitcoinInput : 0));
        return createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full border border-[#18181B]/10 overflow-hidden shadow-2xl p-6 text-center space-y-5">
              {qrPaymentStage === 'waiting' ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{paymentMethods.find(m => m.id === payment)?.icon}</span>
                    <p className="font-black text-[#18181B]">{payee.channel}</p>
                  </div>

                  <div className="mx-auto w-56 h-56 flex items-center justify-center bg-white border-2 border-[#FF5722]/15 rounded-2xl p-3 shadow-inner">
                    <img
                      src={buildQrImageUrl(payee, displayTotal)}
                      alt="Mã QR thanh toán"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="text-xs text-left space-y-1.5 bg-[#18181B]/[0.03] rounded-2xl p-4">
                    <div className="flex justify-between">
                      <span className="text-[#18181B]/50">Người thụ hưởng</span>
                      <span className="font-bold text-[#18181B]">{QR_PAYEE_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#18181B]/50">{payee.accountLabel}</span>
                      <span className="font-mono font-bold text-[#18181B]">{payee.accountNumber}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#18181B]/10">
                      <span className="text-[#18181B]/50">Số tiền</span>
                      <span className="font-black text-[#FF5722]">{fmt(displayTotal)}đ</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#18181B]/50">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Đang chờ xác nhận thanh toán... ({qrSecondsLeft}s)
                  </div>
                </>
              ) : (
                <div className="py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500 animate-[pulse_0.6s_ease-in-out]">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#18181B] text-lg">Thanh toán thành công!</h3>
                    <p className="text-sm text-[#18181B]/60 mt-1">Đang tạo đơn hàng của bạn...</p>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Pop-up Hướng dẫn thanh toán tại quầy cho Khách (Guest) */}
      {showCounterGuide && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#18181B]/10 overflow-hidden shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#18181B]/10 pb-3">
              <div className="flex items-center gap-2 text-[#FF5722]">
                <Info className="w-5 h-5" />
                <h3 className="font-black text-[#18181B] text-base">Hướng dẫn thanh toán tại quầy</h3>
              </div>
              <button onClick={() => setShowCounterGuide(false)} className="text-[#18181B]/40 hover:text-[#18181B] transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3.5 text-sm text-[#18181B]/80">
              <p>Quý khách là Khách vãng lai và đã chọn hình thức <b>Thanh toán tại quầy / COD</b>.</p>
              
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-2">
                <p className="text-xs text-[#FF5722] font-black uppercase tracking-wider">Thông tin thanh toán</p>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#18181B]/60 font-semibold">Hình thức:</span>
                  <span className="font-bold text-[#18181B]">{deliveryType === 'pickup' ? 'Lấy tại quầy FitFuel+' : 'Nhận hàng thanh toán (COD)'}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[#18181B]/60 font-semibold">Tổng tiền thanh toán:</span>
                  <span className="font-black text-[#FF5722] text-base">{fmt(Math.max(0, (deliveryType === 'delivery' ? total + shippingFee : total) - (useFitcoin ? fitcoinInput : 0)))}đ</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="font-bold text-[#18181B] text-xs">Các bước hoàn tất thanh toán:</p>
                <ul className="space-y-2 text-xs leading-relaxed pl-1">
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 text-[#FF5722] flex items-center justify-center font-bold shrink-0">1</span>
                    <span>Di chuyển tới quầy lễ tân của FitFuel+ (hoặc chờ shipper liên hệ).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 text-[#FF5722] flex items-center justify-center font-bold shrink-0">2</span>
                    <span>Cung cấp số điện thoại người nhận: <b>{form.phone || guestPhone}</b> cho nhân viên lễ tân hoặc shipper.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 text-[#FF5722] flex items-center justify-center font-bold shrink-0">3</span>
                    <span>Thực hiện thanh toán bằng tiền mặt hoặc chuyển khoản ngân hàng và nhận hàng.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCounterGuide(false)}
                className="flex-1 py-3 rounded-2xl glass border border-[#18181B]/10 text-[#18181B] text-xs font-bold hover:bg-white/60 transition-all"
              >
                Thay đổi
              </button>
              <button
                onClick={() => handleConfirm(true)}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-[#FF5722] text-white font-black text-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5722]/15"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Đã hiểu & Đặt hàng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Pop-up Thông báo thành công và SMS trên Web */}
      {showSuccessPopup && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#18181B]/10 overflow-hidden shadow-2xl p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-9 h-9" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-black text-[#18181B] text-xl">
                {type === 'gear' ? 'Mua Gear thành công!' : 'Đặt hàng thành công!'}
              </h3>
              <p className="text-sm text-[#18181B]/60 font-medium">Cảm ơn bạn đã tin dùng dịch vụ của FitFuel+.</p>
            </div>

            {type === 'gear' ? (
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 text-xs text-left space-y-2.5">
                <div className="flex gap-2.5 items-start">
                  <span className="text-base leading-none">✅</span>
                  <p className="text-[#18181B]/75 leading-relaxed font-semibold">
                    Đã mua thành công <b>{gearCheckoutResult?.transactions?.length || 0}</b> sản phẩm. Đến quầy FitFuel+ để nhận hàng.
                  </p>
                </div>
                {gearCheckoutResult?.errors?.length > 0 && (
                  <div className="flex gap-2.5 items-start pt-2 border-t border-green-500/10">
                    <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div className="text-[#18181B]/75 leading-relaxed font-semibold">
                      <p>{gearCheckoutResult.errors.length} sản phẩm không thể mua (có thể đã hết hàng):</p>
                      <ul className="list-disc pl-4 mt-1 font-normal">
                        {gearCheckoutResult.errors.map(e => (
                          <li key={e.gear_id}>{e.gear_id}: {e.message}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 text-xs text-left space-y-2.5">
                <div className="flex gap-2.5 items-start">
                  <span className="text-base leading-none">✉️</span>
                  <p className="text-[#18181B]/75 leading-relaxed font-semibold">
                    Hệ thống đã gửi tin nhắn SMS xác nhận đơn hàng thành công đến số điện thoại: <b>{targetPhoneState}</b>.
                  </p>
                </div>

                {!user && payment === 'cod' && (
                  <div className="flex gap-2.5 items-start pt-2 border-t border-green-500/10">
                    <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-[#18181B]/75 leading-relaxed font-semibold">
                      <b>Lưu ý thanh toán tại quầy:</b> Vui lòng tới quầy FitFuel+ đọc số điện thoại <b>{targetPhoneState}</b> để lễ tân xác nhận thanh toán trực tiếp.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate(type === 'gear' ? '/gear' : '/orders');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#FF5722] text-white font-black text-sm hover:opacity-95 transition-all shadow-md shadow-[#FF5722]/15"
            >
              {type === 'gear' ? 'Tiếp tục mua sắm' : 'Xem danh sách đơn hàng'}
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Pop-up báo lỗi — luôn hiển thị rõ ràng khi đặt hàng thất bại, thay vì alert() dễ bị bỏ sót */}
      {showErrorPopup && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#18181B]/10 overflow-hidden shadow-2xl p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
              <AlertCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-[#18181B] text-xl">Đặt hàng thất bại</h3>
              <p className="text-sm text-[#18181B]/70 font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full py-3.5 rounded-2xl bg-[#18181B] text-white font-black text-sm hover:bg-black transition-all"
            >
              Đóng
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
