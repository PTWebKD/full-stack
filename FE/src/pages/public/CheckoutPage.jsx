import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Phone, Loader2, ShieldCheck } from 'lucide-react';
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

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const type = params.get('type') || 'food';
  const { foodCart, gearCart, foodTotal, gearTotal, clearCart } = useCart();
  const { user } = useAuth();
  const items = type === 'food' ? foodCart : gearCart;
  const total = type === 'food' ? foodTotal : gearTotal;
  // If not logged in, start at step -1 (OTP), otherwise start at step 0
  const [step, setStep] = useState(user ? 0 : -1);
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [payment, setPayment] = useState('cod');
  const [done, setDone] = useState(false);
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [shippingAddressId, setShippingAddressId] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const navigate = useNavigate();
  const fmt = (n) => n.toLocaleString('vi-VN');

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

  const handleConfirm = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.images?.[0] || item.image
        })),
        subtotal: total,
        delivery_type: deliveryType,
        shipping_address_id: deliveryType === 'delivery' ? shippingAddressId : null,
        shipping_fee: shippingFee,
        recipient_name: form.name,
        recipient_phone: form.phone,
        note: form.note,
        payment_method: payment
      };

      await api.post('/api/orders', orderData);
      clearCart(type);
      setDone(true);
      setTimeout(() => navigate('/orders'), 2500);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Đặt hàng thất bại. Vui lòng thử lại.');
    }
  };

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-[#FF5722]" />
      </div>
      <h2 className="text-2xl font-black text-[#18181B] mb-2">Đặt hàng thành công!</h2>
      <p className="text-[#18181B]/60 text-sm mb-2">Đơn hàng của bạn đang được xử lý.</p>
      <p className="text-[#18181B]/40 text-xs">Đang chuyển hướng đến Đơn hàng...</p>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-[#18181B]/60 mb-4">Giỏ hàng {type === 'food' ? 'Thực phẩm' : 'Gear'} của bạn đang trống.</p>
      <Link to="/cart" className="text-[#FF5722] hover:underline text-sm">Quay lại Giỏ hàng</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-black text-[#18181B] mb-8">Thanh Toán</h1>

      {/* Stepper — show OTP step for guests */}
      <div className="flex items-center gap-2 mb-8">
        {!user && (
          <>
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === -1 ? 'bg-[#FF5722] text-white' : 'bg-[#FF5722]/60 text-white'}`}>0</div>
              <span className={`text-sm hidden sm:block ${step === -1 ? 'text-[#18181B] font-medium' : 'text-[#18181B]/40'}`}>Xác thực</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#18181B]/40 mx-1" />
          </>
        )}
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'bg-[#FF5722] text-white' : 'bg-white/10 text-white/60'}`}>{i + 1}</div>
            <span className={`text-sm hidden sm:block ${i === step ? 'text-[#18181B] font-medium' : 'text-[#18181B]/40'}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-[#18181B]/40 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Guest OTP Step */}
          {step === -1 && (
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10">
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
          )}

          {step === 0 && (
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-[#FF5722]" />
                <h3 className="font-semibold text-[#18181B]">Địa chỉ & Hình thức giao hàng</h3>
              </div>
              <div className="space-y-4">
                <DeliveryChoice value={deliveryType} onChange={setDeliveryType} />

                {deliveryType === 'delivery' && (
                  <>
                    <AddressSelector value={shippingAddressId} onChange={setShippingAddressId} />
                    <ShippingFeeDisplay
                      subtotal={total}
                      onFeeCalculated={(fee) => setShippingFee(fee.shipping_fee)}
                    />
                  </>
                )}

                {deliveryType === 'pickup' && (
                  <>
                    {[
                      { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Tên của bạn' },
                      { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0xxx xxx xxx' },
                      { key: 'note', label: 'Ghi chú (tùy chọn)', type: 'text', placeholder: 'VD: Yêu cầu đặc biệt' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs text-[#18181B]/60 mb-1.5">{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
                        />
                      </div>
                    ))}
                  </>
                )}

                {deliveryType === 'delivery' && (
                  <>
                    {[
                      { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Tên của bạn' },
                      { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0xxx xxx xxx' },
                      { key: 'note', label: 'Ghi chú giao hàng (tùy chọn)', type: 'text', placeholder: 'VD: Để trước cửa' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs text-[#18181B]/60 mb-1.5">{f.label}</label>
                        <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] placeholder-[#18181B]/40 focus:outline-none focus:border-[#FF5722]/50 text-sm"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <button onClick={() => setStep(1)} disabled={!form.name || !form.phone || (deliveryType === 'delivery' && !shippingAddressId)}
                className="mt-6 w-full py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm disabled:opacity-40 hover:bg-[#FF5722]/90 transition-colors">
                Tiếp tục Thanh toán
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="w-4 h-4 text-[#FF5722]" />
                <h3 className="font-semibold text-[#18181B]">Phương thức thanh toán</h3>
              </div>
              <div className="space-y-3">
                {paymentMethods.map(m => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${payment === m.id ? 'border-[#FF5722]/30 bg-[#FF5722]/5' : 'border-[#18181B]/10 hover:border-[#18181B]/20'}`}>
                    <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={e => setPayment(e.target.value)} className="sr-only" />
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-sm font-medium text-[#18181B]">{m.label}</span>
                    <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all ${payment === m.id ? 'border-[#FF5722] bg-[#FF5722]' : 'border-[#18181B]/20'}`} />
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-semibold hover:bg-white">Quay lại</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm hover:bg-[#FF5722]/90 transition-colors">Xem lại đơn hàng</button>

              </div>
            </div>
          )}

          {step === 2 && (
            <div className="glass rounded-2xl p-6 border border-[#18181B]/10">
              <h3 className="font-semibold text-[#18181B] mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.images?.[0] || item.image || ''} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <p className="flex-1 text-sm text-[#18181B]">{item.name} x{item.qty}</p>
                    <p className="text-sm font-semibold text-[#18181B]">{fmt(item.price * item.qty)}đ</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#18181B]/10 pt-3 mb-4">
                {deliveryType === 'delivery' && (
                  <div className="flex justify-between text-sm text-[#18181B]/60 mb-1">
                    <span>Phí giao hàng</span><span>{fmt(shippingFee)}đ</span>
                  </div>
                )}
                {deliveryType === 'pickup' && (
                  <div className="flex justify-between text-sm text-[#18181B]/60 mb-1">
                    <span>Phí giao hàng</span><span>Miễn phí</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-[#18181B]">
                  <span>Tổng cộng</span><span className="text-[#FF5722]">{fmt(deliveryType === 'delivery' ? total + shippingFee : total)}đ</span>
                </div>
              </div>
              <div className="glass rounded-xl p-3 text-sm text-[#18181B]/60 mb-4">
                <p><span className="text-[#18181B]/80">Người nhận:</span> {form.name} · {form.phone}</p>
                {deliveryType === 'delivery' && (
                  <p className="mt-1"><span className="text-[#18181B]/80">Hình thức:</span> Giao hàng tận nơi</p>
                )}
                {deliveryType === 'pickup' && (
                  <p className="mt-1"><span className="text-[#18181B]/80">Hình thức:</span> Lấy tại quầy</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B] text-sm font-semibold hover:bg-white">Quay lại</button>
                <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-[#FF5722] text-white font-bold text-sm hover:bg-[#FF5722]/90 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Đặt hàng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="glass rounded-2xl p-5 border border-[#18181B]/10 h-fit sticky top-4">
          <h4 className="font-semibold text-[#18181B] mb-4">Giỏ hàng {type === 'food' ? 'Thực phẩm' : 'Gear'}</h4>
          <div className="space-y-3 text-sm">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-[#18181B]/60">
                <span className="truncate">{item.name} x{item.qty}</span>
                <span className="shrink-0 ml-2">{fmt(item.price * item.qty)}đ</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#18181B]/10 mt-4 pt-4 flex justify-between font-black text-[#18181B]">
            <span>Tổng cộng</span>
            <span className="text-[#FF5722]">{fmt(total)}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
