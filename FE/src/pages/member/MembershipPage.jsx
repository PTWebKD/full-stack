import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Zap, Calendar, ShieldCheck, Gift,
  CreditCard, X, TrendingUp, Eye, EyeOff, ArrowRight, Clock,
  Pause, RefreshCw, ChevronUp, FileText, Check, Ban,
  Award, Sparkles, PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import {
  MONTHLY_PRICE, YEARLY_PRICE, MEMBER_BENEFITS,
  PAYMENT_METHODS, YEARLY_DISCOUNT_PCT
} from '../../data/mockMembership';
import { api } from '../../services/api';

const fmt = (n) => n.toLocaleString('vi-VN');

/* ── Payment icon badge ─────────────────────────────────────────────────── */
function PayBadge({ id, color }) {
  const labels = { momo: 'M', vnpay: 'VP', zalopay: 'ZP', cash: '₫' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6, background: color,
      color: '#fff', fontSize: 10, fontWeight: 900, flexShrink: 0,
    }}>
      {labels[id]}
    </span>
  );
}

/* ── Billing card ───────────────────────────────────────────────────────── */
function BillingCard({ type, selected, onSelect }) {
  const isYearly = type === 'yearly';
  const price = isYearly ? YEARLY_PRICE : MONTHLY_PRICE;
  const saving = MONTHLY_PRICE * 12 - YEARLY_PRICE;

  return (
    <button
      onClick={() => onSelect(type)}
      className="w-full text-left transition-all duration-200 rounded-2xl p-5 border-2 relative focus:outline-none"
      style={{
        border: `2px solid ${selected ? '#FF5722' : 'rgba(255,255,255,0.08)'}`,
        background: selected
          ? 'rgba(255,87,34,0.08)'
          : 'rgba(255,255,255,0.03)',
        boxShadow: selected
          ? '0 0 40px rgba(255,87,34,0.15)'
          : 'none',
        cursor: 'pointer',
      }}
    >
      {isYearly && (
        <span className="absolute -top-3.5 left-4 px-3 py-0.5 rounded-full text-xs font-bold"
          style={{ background: '#FF5722', color: '#fff' }}>
          🔥 Tiết kiệm {YEARLY_DISCOUNT_PCT}% — {fmt(saving)}đ
        </span>
      )}

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-black text-[#18181B] text-lg">
            {isYearly ? 'Gói Năm' : 'Gói Tháng'}
          </p>
          <p className="text-xs text-[#18181B]/60 mt-0.5">
            {isYearly ? '2 tháng miễn phí · Gia hạn sau 12 tháng' : 'Linh hoạt · Hủy bất kỳ lúc nào'}
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
          selected ? 'border-current' : 'border-[#18181B]/20'
        }`} style={{ color: '#FF5722' }}>
          {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF5722' }} />}
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-black text-[#18181B]">{fmt(price)}</span>
        <span className="text-[#18181B]/60 text-sm mb-0.5">đ / {isYearly ? 'năm' : 'tháng'}</span>
      </div>
      {isYearly && (
        <p className="text-xs text-[#18181B]/40 mt-1">
          ≈ {fmt(Math.round(YEARLY_PRICE / 12))}.000đ/tháng
        </p>
      )}
    </button>
  );
}

/* ── Registration + Payment Modal ──────────────────────────────────────── */
export function CheckoutModal({ billing, onClose, onSuccess, isUpgrade = false, isRenewal = false, forcedPrice }) {
  const { user, register } = useAuth();
  const basePrice = billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE;
  const finalPrice = forcedPrice !== undefined ? forcedPrice : basePrice;

  // Steps: 'account' | 'payment'
  const [step, setStep] = useState(user ? 'payment' : 'account');

  // Account form
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authErr, setAuthErr] = useState('');

  // Payment form
  const [payMethod, setPayMethod] = useState('momo');
  const [loading, setLoading]     = useState(false);

  const handleAccountNext = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setAuthErr('Vui lòng điền đầy đủ thông tin (mật khẩu ≥ 6 ký tự)');
      return;
    }
    setAuthErr('');
    setStep('payment');
  };

  const handlePay = async () => {
    setLoading(true);
    setAuthErr('');
    // Nếu chưa đăng nhập → tạo tài khoản trước khi thanh toán
    if (!user) {
      const result = await register({ display_name: name, email, password });
      if (!result.ok) {
        setAuthErr(result.error || 'Đăng ký thất bại, vui lòng thử lại');
        setLoading(false);
        return;
      }
    }
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onSuccess({ billing, payMethod, isUpgrade, isRenewal, finalPrice });
  };

  const inputCls = `w-full bg-white border border-[#18181B]/10 rounded-xl px-4 py-3 text-sm text-[#18181B]
    placeholder:text-[#18181B]/25 focus:outline-none focus:border-[#7dd3fc]/50 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="glass rounded-2xl border border-[#18181B]/10 w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#18181B]/10">
          <div>
            <p className="text-xs text-[#18181B]/60 mb-0.5">
              {step === 'account' ? 'Bước 1/2 — Thông tin tài khoản' : 'Bước 2/2 — Thanh toán'}
            </p>
            <h3 className="font-bold text-[#18181B] text-lg">
              {isUpgrade ? 'Nâng cấp lên Gói Năm' : isRenewal ? 'Gia hạn gói tập' : 'Xác nhận đăng ký'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#18181B]/40 hover:text-[#18181B] transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order summary strip */}
        <div className="flex items-center justify-between px-6 py-3"
          style={{ background: 'rgba(255,87,34,0.1)' }}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: '#FF5722' }} />
            <span className="text-sm font-semibold text-[#18181B]">
              {isUpgrade ? 'Phí chênh lệch nâng cấp' : `Gói ${billing === 'yearly' ? 'Năm' : 'Tháng'}`}
            </span>
          </div>
          <span className="font-black text-[#18181B] text-sm">
            {fmt(finalPrice)}đ
          </span>
        </div>

        <div className="px-6 pb-6 pt-5">
          <AnimatePresence mode="wait">
            {/* ── Step 1: Account ── */}
            {step === 'account' && (
              <motion.form
                key="account"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                onSubmit={handleAccountNext}
                className="space-y-3"
              >
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Họ và tên" className={inputCls} required
                />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email" className={inputCls} required
                />
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password} onChange={e => setPass(e.target.value)}
                    placeholder="Mật khẩu" className={`${inputCls} pr-10`} required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#18181B]/40 hover:text-[#18181B]/60">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authErr && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" /> {authErr}
                  </p>
                )}

                <p className="text-xs text-[#18181B]/40 leading-relaxed">
                  Bằng cách tạo tài khoản, bạn đồng ý với{' '}
                  <span className="text-[#FF5722] cursor-pointer">Điều khoản</span> và{' '}
                  <span className="text-[#FF5722] cursor-pointer">Chính sách bảo mật</span> của FitFuel+.
                </p>

                <button type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white shadow-md shadow-[#FF5722]/20">
                  Tiếp theo — Thanh toán <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-3"
              >
                {user && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                    style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                    <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
                    <span className="text-xs text-[#4ade80] font-medium">Đăng nhập với {user.email}</span>
                  </div>
                )}

                <p className="text-xs text-[#18181B]/60 font-medium mb-2">Phương thức thanh toán</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(p => (
                    <label key={p.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: `1px solid ${payMethod === p.id ? 'rgba(255,87,34,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        background: payMethod === p.id ? 'rgba(255,87,34,0.1)' : 'transparent',
                      }}>
                      <input type="radio" name="pay" value={p.id}
                        checked={payMethod === p.id}
                        onChange={() => setPayMethod(p.id)}
                        className="sr-only" />
                      <PayBadge id={p.id} color={p.color} />
                      <span className="text-sm text-[#18181B] flex-1">{p.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        payMethod === p.id ? 'border-[#FF5722]' : 'border-[#18181B]/20'
                      }`}>
                        {payMethod === p.id && <div className="w-2 h-2 rounded-full bg-[#FF5722]" />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl p-3 text-xs text-[#18181B]/40 flex items-start gap-2 mt-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CreditCard className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#18181B]/40" />
                  Giao dịch bảo mật qua SSL. Gói tập được kích hoạt ngay lập tức sau thanh toán.
                </div>

                {authErr && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" /> {authErr}
                  </p>
                )}

                <div className="flex gap-3 mt-2">
                  {!user && (
                    <button onClick={() => setStep('account')}
                      className="px-4 py-3 rounded-xl glass border border-[#18181B]/10 text-[#18181B]/60 text-sm hover:text-[#18181B] transition-colors">
                      ← Quay lại
                    </button>
                  )}
                  <button onClick={handlePay} disabled={loading}
                    className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 bg-[#FF5722] text-white">
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Zap className="w-4 h-4" /> Thanh toán {fmt(finalPrice)}đ</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Success Screen ─────────────────────────────────────────────────────── */
export function SuccessScreen({ billing, isUpgrade, isRenewal, finalPrice }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    // Spectacular confetti sequence
    const triggerConfetti = () => {
      // 1. Center big blast
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FF5722', '#FF8A50', '#FF3D00', '#FFD180', '#4ade80', '#60a5fa'],
        disableForcedLimit: true,
      });

      // 2. Left side cannon
      setTimeout(() => {
        confetti({
          particleCount: 65,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#FF5722', '#FF8A50', '#FFD180'],
        });
      }, 300);

      // 3. Right side cannon
      setTimeout(() => {
        confetti({
          particleCount: 65,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#FF5722', '#FF8A50', '#FFD180'],
        });
      }, 450);

      // 4. Randomized mini fireworks bursts for 3 seconds
      const end = Date.now() + 3000;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: Math.random() * 0.5 + 0.25, // centered horizontally
            y: Math.random() * 0.4 + 0.2,  // upper half
          },
          colors: ['#FF5722', '#FFD180', '#ffffff', '#4ade80'],
        });
      }, 150);
    };

    triggerConfetti();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b]/85 backdrop-blur-2xl p-4 overflow-hidden">
      {/* Glow shapes in background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#FF5722]/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#FF8A50]/15 rounded-full blur-[80px] sm:blur-[110px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      
      {/* Styles for custom keyframe animations */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-shine-effect {
          position: absolute;
          animation: shine 3s infinite;
        }
        @keyframes float-box {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-float-box {
          animation: float-box 6s ease-in-out infinite;
        }
        @keyframes pulse-ring-anim {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.35; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-pulse-ring-anim {
          animation: pulse-ring-anim 2.5s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
      `}</style>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="glass rounded-3xl p-6 sm:p-8 border border-white/20 w-full max-w-md shadow-2xl relative text-center bg-white/90 backdrop-blur-xl animate-float-box"
        style={{ 
          boxShadow: '0 20px 80px rgba(255,87,34,0.2), inset 0 1px 1px rgba(255,255,255,0.3)',
          color: '#18181B'
        }}
      >
        {/* Top Badge with Ring animation */}
        <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FF5722] opacity-20 animate-pulse-ring-anim" style={{ animationDelay: '0s' }} />
          <div className="absolute inset-0 rounded-full bg-[#FFD180] opacity-20 animate-pulse-ring-anim" style={{ animationDelay: '1.2s' }} />
          
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF8A50] flex items-center justify-center shadow-lg border border-white/20">
            <PartyPopper className="w-9 h-9 text-white" />
          </div>
        </div>

        {/* Header Text */}
        <h2 className="text-xl sm:text-2xl font-black mb-2 tracking-tight bg-gradient-to-r from-[#FF5722] via-[#FF8A50] to-[#FF3D00] bg-clip-text text-transparent">
          {isUpgrade ? 'NÂNG CẤP THÀNH CÔNG!' : isRenewal ? 'GIA HẠN THÀNH CÔNG!' : 'ĐĂNG KÝ THÀNH CÔNG!'}
        </h2>
        <p className="text-[#18181B]/60 text-xs px-2 mb-5">
          Chào mừng bạn đến với hội viên đặc quyền FitFuel+. Tài khoản đã được kích hoạt thành công!
        </p>

        {/* Membership Ticket Card */}
        <div className="bg-gradient-to-br from-[#18181B] to-[#27272A] text-white rounded-2xl p-4 sm:p-5 mb-5 text-left relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-amber-400/10 rounded-full blur-lg pointer-events-none" />

          <div className="flex justify-between items-start mb-3.5 border-b border-white/10 pb-3">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold">FitFuel+ Member Pass</p>
              <h4 className="font-extrabold text-xs sm:text-sm tracking-wide mt-0.5 uppercase">
                {billing === 'yearly' ? '👑 Premium Annual Pass' : '⚡ Premium Monthly Pass'}
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow">
              VIP Member
            </span>
          </div>

          <div className="space-y-2 text-xs text-white/80">
            <div className="flex justify-between">
              <span className="text-white/40">Hội viên:</span>
              <span className="font-semibold text-white">{user?.display_name || 'Khách hàng FitFuel+'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Thời hạn gói:</span>
              <span className="font-semibold text-[#FF5722]">
                {billing === 'yearly' ? '08/06/2027 (12 tháng)' : '08/07/2026 (1 tháng)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Đã thanh toán:</span>
              <span className="font-bold text-amber-400">{fmt(finalPrice ?? 0)}đ</span>
            </div>
          </div>
        </div>

        {/* Benefits Unlocked */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-left">
            <span className="text-lg">🪙</span>
            <div>
              <p className="text-[10px] font-black text-amber-600 leading-none">+50 FitCoins</p>
              <p className="text-[8px] text-gray-500 mt-1">Đã cộng vào ví</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-xl p-2 text-left">
            <span className="text-lg">🏋️</span>
            <div>
              <p className="text-[10px] font-black text-[#FF5722] leading-none">Full Lộ trình</p>
              <p className="text-[8px] text-gray-500 mt-1">Đã mở khóa</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 rounded-xl bg-[#FF5722] text-white font-black text-xs relative overflow-hidden transition-all duration-300 shadow-md shadow-[#FF5722]/35 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          {/* Shine swept */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/30 opacity-30 animate-shine-effect" />
          <span>Vào phòng tập ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Timer count down */}
        <p className="text-[9px] text-[#18181B]/40 mt-3.5 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
          Hệ thống sẽ tự chuyển hướng sau <span className="font-bold text-[#18181B]/60">{timeLeft}s</span>...
        </p>
      </motion.div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function MembershipPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('monthly');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('register'); // 'register' | 'upgrade' | 'renew'
  const [success, setSuccess]   = useState(null);
  
  // Custom mock states for interactive flows
  const [memberships, setMemberships] = useState([
    {
      id: 'ms-992',
      plan_name: 'Gói Hội Viên Tháng',
      billing: 'monthly',
      start_date: '2026-06-01',
      end_date: '2026-06-30',
      status: 'active',
      auto_renew: true,
      days_remaining: 12
    }
  ]);
  const [freezeStatus, setFreezeStatus] = useState('none'); // 'none' | 'pending' | 'frozen'
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-042', plan: 'Gói Hội Viên Tháng', amount: 499000, date: '2026-06-01', method: 'vnpay', status: 'Success' },
    { id: 'INV-2026-011', plan: 'Gói Hội Viên Tháng', amount: 499000, date: '2026-05-01', method: 'momo', status: 'Success' }
  ]);

  useEffect(() => {
    if (user) {
      api.get('/api/gym/memberships/my')
        .then(data => {
          if (data && data.length > 0) {
            setMemberships(data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const activeMembership = memberships.find(m => m.status === 'active') || null;

  // Upgrade calculation
  const remainingDays = activeMembership ? activeMembership.days_remaining : 0;
  const priceDiff = YEARLY_PRICE - MONTHLY_PRICE;
  const upgradeFee = Math.max(0, Math.round((priceDiff / 30) * remainingDays));

  const handleCheckoutSuccess = (res) => {
    setShowModal(false);
    if (res.isUpgrade) {
      setMemberships(prev => prev.map(m => m.status === 'active' ? {
        ...m,
        plan_name: 'Gói Hội Viên Năm (Upgraded)',
        billing: 'yearly',
        end_date: '2027-06-18',
        days_remaining: 365
      } : m));
      setInvoices(prev => [
        { id: `INV-2026-${Math.floor(100+Math.random()*900)}`, plan: 'Nâng cấp Gói Năm', amount: upgradeFee, date: '2026-06-18', method: res.payMethod, status: 'Success' },
        ...prev
      ]);
    } else if (res.isRenewal) {
      setMemberships(prev => prev.map(m => m.status === 'active' ? {
        ...m,
        end_date: res.billing === 'yearly' ? '2027-06-30' : '2026-07-30',
        days_remaining: m.days_remaining + (res.billing === 'yearly' ? 365 : 30)
      } : m));
      setInvoices(prev => [
        { id: `INV-2026-${Math.floor(100+Math.random()*900)}`, plan: `Gia hạn ${res.billing === 'yearly' ? 'Gói Năm' : 'Gói Tháng'}`, amount: res.finalPrice, date: '2026-06-18', method: res.payMethod, status: 'Success' },
        ...prev
      ]);
    }
    setSuccess(res);
  };

  const handleFreezeRequest = () => {
    if (freezeStatus === 'none') {
      setFreezeStatus('pending');
      alert('Yêu cầu bảo lưu của bạn đã được gửi đến Gym Owner để duyệt (BR-08: Tối đa 60 ngày, 1 lần/năm).');
    }
  };

  if (success) {
    return <SuccessScreen billing={success.billing} isUpgrade={success.isUpgrade} isRenewal={success.isRenewal} finalPrice={success.finalPrice} />;
  }

  // Active membership screen
  if (activeMembership) {
    return (
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 360 info & main actions */}
        <div className="md:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 border border-[#FF5722]/30 relative overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(255,87,34,0.1)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  ● Đang hoạt động
                </span>
                <h2 className="text-xl font-black text-[#18181B] mt-1.5 flex items-center gap-1.5">
                  FitFuel+ Member
                </h2>
                <p className="text-[#FF5722] text-xs font-semibold">{activeMembership.plan_name}</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-[#FF5722]" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass rounded-xl p-3 border border-[#18181B]/10">
                <p className="text-[10px] text-[#18181B]/40 mb-0.5">Ngày kích hoạt</p>
                <p className="font-bold text-[#18181B] text-xs">{activeMembership.start_date}</p>
              </div>
              <div className="glass rounded-xl p-3 border border-[#18181B]/10">
                <p className="text-[10px] text-[#18181B]/40 mb-0.5">Ngày hết hạn</p>
                <p className="font-bold text-[#FF5722] text-xs">{activeMembership.end_date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#18181B]/60 border-t border-[#18181B]/10 pt-4">
              <span>Còn lại: <b>{activeMembership.days_remaining} ngày</b></span>
              <span>Tự động gia hạn: <b>{activeMembership.auto_renew ? 'Bật' : 'Tắt'}</b></span>
            </div>
          </motion.div>

          {/* Action Hub */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setModalType('renew'); setSelected('monthly'); setShowModal(true); }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl glass border border-[#18181B]/10 hover:border-[#18181B]/10 text-[#18181B]/80 hover:text-[#18181B] transition-all text-center gap-2"
            >
              <RefreshCw className="w-5 h-5 text-[#FF5722]" />
              <div>
                <p className="text-xs font-bold">Gia Hạn Gói</p>
                <p className="text-[10px] text-[#18181B]/60 mt-0.5">Cộng dồn thời gian</p>
              </div>
            </button>

            {activeMembership.billing === 'monthly' ? (
              <button
                onClick={() => { setModalType('upgrade'); setSelected('yearly'); setShowModal(true); }}
                className="flex flex-col items-center justify-center p-4 rounded-2xl glass border border-[#FF5722]/20 hover:border-[#FF5722]/40 text-[#18181B] hover:bg-[#FF5722]/5 transition-all text-center gap-2"
              >
                <ChevronUp className="w-5 h-5 text-[#FF5722]" />
                <div>
                  <p className="text-xs font-bold text-[#FF5722]">Nâng Cấp Gói Năm</p>
                  <p className="text-[10px] text-[#18181B]/60 mt-0.5">Tiết kiệm {YEARLY_DISCOUNT_PCT}%</p>
                </div>
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col items-center justify-center p-4 rounded-2xl glass border border-[#18181B]/10 opacity-50 text-center gap-2"
              >
                <Gift className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs font-bold text-green-400">Đã là Gói Năm</p>
                  <p className="text-[10px] text-[#18181B]/60 mt-0.5">Đã được tối ưu chi phí</p>
                </div>
              </button>
            )}

            <button
              onClick={handleFreezeRequest}
              disabled={freezeStatus !== 'none'}
              className="col-span-2 flex items-center justify-between p-4 rounded-2xl glass border border-[#18181B]/10 hover:border-[#18181B]/10 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Pause className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs font-bold text-[#18181B]">
                    {freezeStatus === 'none' ? 'Yêu Cầu Bảo Lưu (Freeze)' : 'Đang chờ duyệt bảo lưu'}
                  </p>
                  <p className="text-[10px] text-[#18181B]/60 mt-0.5">
                    {freezeStatus === 'none' ? 'Tạm ngưng tập tối đa 60 ngày' : 'Gym Owner đang xem xét yêu cầu'}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                freezeStatus === 'none' ? 'bg-white text-[#18181B]/60' : 'bg-yellow-400/15 text-yellow-400'
              }`}>
                {freezeStatus === 'none' ? 'Chưa gửi' : 'Chờ duyệt'}
              </span>
            </button>
          </div>

          {/* Upgrade Banner Suggestion */}
          {activeMembership.billing === 'monthly' && remainingDays > 3 && (
            <div className="rounded-2xl p-4 flex gap-3 text-xs glass border border-[#FF5722]/20 bg-[#FF5722]/5">
              <Gift className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#FF5722] mb-0.5">Ưu đãi chuyển đổi Gói Năm</p>
                <p className="text-[#18181B]/60 leading-relaxed">
                  Gói Tháng của bạn còn <b>{remainingDays} ngày</b>. Bạn chỉ cần đóng thêm phí chênh lệch <b>{fmt(upgradeFee)}đ</b> (thay vì {fmt(YEARLY_PRICE)}đ) để nâng cấp lên 12 tháng tập luyện trọn gói.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right side benefits & invoices */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#18181B]/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Lịch sử thanh toán
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {invoices.map(inv => (
                <div key={inv.id} className="flex justify-between items-center py-2 border-b border-[#18181B]/10 last:border-0 text-xs">
                  <div>
                    <p className="font-semibold text-[#18181B] truncate max-w-[130px]">{inv.plan}</p>
                    <p className="text-[10px] text-[#18181B]/40 mt-0.5">{inv.date} · {inv.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#18181B]">{fmt(inv.amount)}đ</p>
                    <p className="text-[10px] text-green-400 mt-0.5 flex items-center gap-0.5 justify-end">
                      <Check className="w-2.5 h-2.5" /> Success
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#18181B]/40 uppercase tracking-wider mb-3">Quyền lợi của bạn</h3>
            <ul className="space-y-2">
              {MEMBER_BENEFITS.slice(0, 5).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#18181B]/80">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal upgrade / renew */}
        <AnimatePresence>
          {showModal && (
            <CheckoutModal
              billing={selected}
              isUpgrade={modalType === 'upgrade'}
              isRenewal={modalType === 'renew'}
              forcedPrice={modalType === 'upgrade' ? upgradeFee : undefined}
              onClose={() => setShowModal(false)}
              onSuccess={handleCheckoutSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Not a member yet screen
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Gói tập luyện</p>
        <h2 className="text-3xl font-black text-[#18181B] mb-2">Chọn chu kỳ thanh toán</h2>
        <p className="text-[#18181B]/60 text-sm">Tất cả ưu đãi giống nhau · Hủy bất kỳ lúc nào · 0 phí ẩn</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['monthly', 'yearly'].map((type, i) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <BillingCard type={type} selected={selected === type} onSelect={setSelected} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass rounded-2xl p-6 border border-[#18181B]/10"
      >
        <p className="text-xs font-semibold text-[#18181B]/60 uppercase tracking-wider mb-4">
          Tất cả ưu đãi bao gồm
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
          {MEMBER_BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#18181B]/75">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#4ade80]" />
              {b.text}
            </li>
          ))}
        </ul>
      </motion.div>

      <AnimatePresence>
        {selected === 'yearly' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <Gift className="w-4 h-4 text-[#FF5722] shrink-0" />
            <span className="text-[#FF5722] font-semibold">
              Bạn đang tiết kiệm {fmt(MONTHLY_PRICE * 12 - YEARLY_PRICE)}đ — tương đương 2 tháng miễn phí!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onClick={() => { setModalType('register'); setShowModal(true); }}
        className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90 bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20"
      >
        <Zap className="w-5 h-5" />
        Đăng ký Gói {selected === 'yearly' ? 'Năm' : 'Tháng'} —{' '}
        {fmt(selected === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE)}đ
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <CheckoutModal
            billing={selected}
            onClose={() => setShowModal(false)}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
