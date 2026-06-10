import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Zap, Calendar, ShieldCheck, Gift,
  CreditCard, X, TrendingUp, Eye, EyeOff, ArrowRight, Clock
} from 'lucide-react';
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
        border: `2px solid ${selected ? (isYearly ? '#f97316' : '#7dd3fc') : 'rgba(255,255,255,0.08)'}`,
        background: selected
          ? isYearly ? 'rgba(249,115,22,0.08)' : 'rgba(0,58,90,0.18)'
          : 'rgba(255,255,255,0.03)',
        boxShadow: selected
          ? isYearly ? '0 0 40px rgba(249,115,22,0.15)' : '0 0 40px rgba(0,58,90,0.2)'
          : 'none',
        cursor: 'pointer',
      }}
    >
      {isYearly && (
        <span className="absolute -top-3.5 left-4 px-3 py-0.5 rounded-full text-xs font-bold"
          style={{ background: '#f97316', color: '#000' }}>
          🔥 Tiết kiệm {YEARLY_DISCOUNT_PCT}% — {fmt(saving)}đ
        </span>
      )}

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-black text-white text-lg">
            {isYearly ? 'Gói Năm' : 'Gói Tháng'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {isYearly ? '2 tháng miễn phí · Gia hạn sau 12 tháng' : 'Linh hoạt · Hủy bất kỳ lúc nào'}
          </p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
          selected ? 'border-current' : 'border-white/20'
        }`} style={{ color: isYearly ? '#f97316' : '#7dd3fc' }}>
          {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: isYearly ? '#f97316' : '#7dd3fc' }} />}
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-black text-white">{fmt(price)}</span>
        <span className="text-white/40 text-sm mb-0.5">đ / {isYearly ? 'năm' : 'tháng'}</span>
      </div>
      {isYearly && (
        <p className="text-xs text-white/30 mt-1">
          ≈ {fmt(Math.round(YEARLY_PRICE / 12))}.000đ/tháng
        </p>
      )}
    </button>
  );
}

/* ── Registration + Payment Modal ──────────────────────────────────────── */
export function CheckoutModal({ billing, onClose, onSuccess }) {
  const { user, login } = useAuth();
  const price = billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE;

  // Steps: 'account' | 'payment'
  const [step, setStep] = useState(user ? 'payment' : 'account');
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'

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
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onSuccess({ billing, payMethod });
  };

  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
    placeholder:text-white/25 focus:outline-none focus:border-[#7dd3fc]/50 transition-colors`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        className="glass-dark rounded-2xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <p className="text-xs text-white/40 mb-0.5">
              {step === 'account' ? 'Bước 1/2 — Thông tin tài khoản' : 'Bước 2/2 — Thanh toán'}
            </p>
            <h3 className="font-bold text-white text-lg">
              {step === 'account' ? 'Tạo tài khoản' : 'Xác nhận đăng ký'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order summary strip */}
        <div className="flex items-center justify-between px-6 py-3"
          style={{ background: billing === 'yearly' ? 'rgba(249,115,22,0.08)' : 'rgba(0,58,90,0.15)' }}>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: billing === 'yearly' ? '#f97316' : '#7dd3fc' }} />
            <span className="text-sm font-semibold text-white">
              Gói {billing === 'yearly' ? 'Năm' : 'Tháng'}
            </span>
          </div>
          <span className="font-black text-white text-sm">
            {fmt(price)}đ
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authErr && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" /> {authErr}
                  </p>
                )}

                <p className="text-xs text-white/30 leading-relaxed">
                  Bằng cách tạo tài khoản, bạn đồng ý với{' '}
                  <span className="text-[#7dd3fc] cursor-pointer">Điều khoản</span> và{' '}
                  <span className="text-[#7dd3fc] cursor-pointer">Chính sách bảo mật</span> của FitFuel+.
                </p>

                <button type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2"
                  style={{ background: '#003a5a', color: '#fff' }}>
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

                <p className="text-xs text-white/40 font-medium mb-2">Phương thức thanh toán</p>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(p => (
                    <label key={p.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: `1px solid ${payMethod === p.id ? 'rgba(125,211,252,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        background: payMethod === p.id ? 'rgba(0,58,90,0.15)' : 'transparent',
                      }}>
                      <input type="radio" name="pay" value={p.id}
                        checked={payMethod === p.id}
                        onChange={() => setPayMethod(p.id)}
                        className="sr-only" />
                      <PayBadge id={p.id} color={p.color} />
                      <span className="text-sm text-white flex-1">{p.label}</span>
                      <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                        payMethod === p.id ? 'border-[#7dd3fc]' : 'border-white/20'
                      }`}>
                        {payMethod === p.id && <div className="w-2 h-2 rounded-full bg-[#7dd3fc]" />}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="rounded-xl p-3 text-xs text-white/30 flex items-start gap-2 mt-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CreditCard className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/20" />
                  Giao dịch được mã hóa SSL 256-bit. Hoàn tiền trong 7 ngày nếu không hài lòng.
                </div>

                <div className="flex gap-3 mt-2">
                  {!user && (
                    <button onClick={() => setStep('account')}
                      className="px-4 py-3 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white transition-colors">
                      ← Quay lại
                    </button>
                  )}
                  <button onClick={handlePay} disabled={loading}
                    className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    style={{ background: billing === 'yearly' ? '#f97316' : '#003a5a', color: '#fff' }}>
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <><Zap className="w-4 h-4" /> Thanh toán {fmt(price)}đ</>
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
export function SuccessScreen({ billing }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-sm mx-auto"
    >
      <div className="glass-dark rounded-2xl p-10 border border-[#003a5a]/40 text-center"
        style={{ boxShadow: '0 0 80px rgba(0,58,90,0.2)' }}>
        <div className="w-20 h-20 rounded-full border border-[#003a5a]/30 flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,58,90,0.15)', boxShadow: '0 0 40px rgba(0,58,90,0.3)' }}>
          <CheckCircle className="w-10 h-10 text-[#7dd3fc]" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Đăng ký thành công!</h2>
        <p className="text-white/50 text-sm mb-1">
          Gói <span className="text-white font-bold">{billing === 'yearly' ? 'Năm' : 'Tháng'}</span> đã được kích hoạt.
        </p>
        <p className="text-white/30 text-xs flex items-center justify-center gap-1 mb-6">
          <Clock className="w-3 h-3" />
          Hiệu lực đến: {billing === 'yearly' ? '08/06/2027' : '08/07/2026'}
        </p>
        <div className="pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-white/30">
          <TrendingUp className="w-3 h-3" />
          +50 FitCoin đã được tặng vào tài khoản
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function MembershipPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState('monthly');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess]   = useState(null);
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    api.get('/api/gym/memberships/my')
      .then(data => setMemberships(data.items || data || []))
      .catch(() => setMemberships([]));
  }, []);

  const activeMembership = memberships.find(m => m.status === 'active') || memberships[0] || null;

  if (success) return <SuccessScreen billing={success.billing} />;

  // If user already has an active membership, show info only
  if (activeMembership) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-8 border border-[#003a5a]/40 text-center"
          style={{ boxShadow: '0 0 60px rgba(0,58,90,0.15)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(0,58,90,0.2)', border: '1px solid rgba(0,58,90,0.4)' }}>
            <ShieldCheck className="w-8 h-8 text-[#7dd3fc]" />
          </div>
          <p className="text-xs font-semibold text-[#7dd3fc] uppercase tracking-widest mb-2">Gói đang hoạt động</p>
          <h2 className="text-2xl font-black text-white mb-1">
            FitFuel+ <span className="text-[#7dd3fc]">Member</span>
          </h2>
          <p className="text-white/40 text-sm mb-6">{activeMembership.plan_name || 'Gói thành viên'}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl p-4 border border-white/5">
              <p className="text-xs text-white/40 mb-1">Ngày bắt đầu</p>
              <p className="font-bold text-white">{activeMembership.start_date || '—'}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-white/5">
              <p className="text-xs text-white/40 mb-1">Ngày hết hạn</p>
              <p className="font-bold text-[#7dd3fc]">{activeMembership.end_date || '—'}</p>
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/5 mb-6">
            <p className="text-xs text-white/40 mb-2">Quyền lợi hội viên</p>
            <ul className="space-y-1.5 text-left">
              {MEMBER_BENEFITS.slice(0, 4).map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                  {b.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-white/30">
            <Calendar className="w-3.5 h-3.5" />
            Tự động gia hạn: {activeMembership.auto_renew ? 'Bật' : 'Tắt'}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold text-[#7dd3fc] uppercase tracking-widest mb-2">Gói tập luyện</p>
        <h2 className="text-3xl font-black text-white mb-2">Chọn chu kỳ thanh toán</h2>
        <p className="text-white/40 text-sm">Tất cả ưu đãi giống nhau · Hủy bất kỳ lúc nào · 0 phí ẩn</p>
      </div>

      {/* Two billing cards */}
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

      {/* Benefits (same for both) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="glass-dark rounded-2xl p-6 border border-white/5"
      >
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
          Tất cả ưu đãi bao gồm
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
          {MEMBER_BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#4ade80]" />
              {b.text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Savings note */}
      <AnimatePresence>
        {selected === 'yearly' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <Gift className="w-4 h-4 text-[#f97316] shrink-0" />
            <span className="text-[#f97316] font-semibold">
              Bạn đang tiết kiệm {fmt(MONTHLY_PRICE * 12 - YEARLY_PRICE)}đ — tương đương 2 tháng miễn phí!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onClick={() => setShowModal(true)}
        className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
        style={{
          background: selected === 'yearly' ? '#f97316' : '#003a5a',
          color: '#fff',
          boxShadow: selected === 'yearly'
            ? '0 0 40px rgba(249,115,22,0.3)'
            : '0 0 40px rgba(0,58,90,0.3)',
        }}
      >
        <Zap className="w-5 h-5" />
        Đăng ký Gói {selected === 'yearly' ? 'Năm' : 'Tháng'} —{' '}
        {fmt(selected === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE)}đ
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CheckoutModal
            billing={selected}
            onClose={() => setShowModal(false)}
            onSuccess={(res) => { setShowModal(false); setSuccess(res); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
