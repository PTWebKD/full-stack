import { useState } from 'react';
import { Crown, CheckCircle, X, Zap, CreditCard, Coins, ShieldCheck, Calendar } from 'lucide-react';
import { mockFitCoinBalance } from '../../data/mockFitCoin';

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299000,
    color: '#6b7280',
    accent: 'border-white/10',
    features: ['Gym access 6am-10pm', 'Locker', 'Basic classes'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 499000,
    color: '#003a5a',
    accent: 'border-[#003a5a]/40',
    features: ['24/7 access', 'Personal locker', 'All classes', '1 PT session/month'],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 899000,
    color: '#f97316',
    accent: 'border-[#f97316]/40',
    features: ['24/7 VIP access', 'Towel service', 'Unlimited PT', 'Nutrition consult'],
  },
];

const paymentOptions = [
  { id: 'cash', label: 'Tiền mặt', icon: '💵' },
  { id: 'momo', label: 'MoMo', icon: '🟣' },
  { id: 'vnpay', label: 'VNPay', icon: '🔵' },
  { id: 'fitcoin', label: `FitCoin (${mockFitCoinBalance} FC)`, icon: '⚡' },
];

const MOCK_CURRENT = { plan: 'Pro', expires: '2025-06-30' };

const fmt = (n) => n.toLocaleString('vi-VN');

export default function MembershipPage() {
  const [selected, setSelected] = useState(null);
  const [payMethod, setPayMethod] = useState('momo');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRenew = (pkg) => {
    setSelected(pkg);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    await new Promise(r => setTimeout(r, 800));
    setShowModal(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <div className="glass-dark rounded-2xl p-10 border border-[#003a5a]/30 text-center">
          <div className="w-20 h-20 rounded-full bg-[#003a5a]/10 border border-[#003a5a]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#7dd3fc]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Gia hạn thành công!</h2>
          <p className="text-white/50 text-sm mb-1">Gói <span className="text-[#7dd3fc] font-bold">{selected?.name}</span> đã được kích hoạt.</p>
          <p className="text-white/30 text-xs">Hiệu lực đến: 30/07/2025</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Current status */}
      <div className="glass-dark rounded-2xl p-5 border border-[#003a5a]/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#003a5a]/10 border border-[#003a5a]/20 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6 text-[#7dd3fc]" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-white/40 mb-0.5">Gói hiện tại</p>
          <p className="font-black text-white text-lg">{MOCK_CURRENT.plan} <span className="text-[#7dd3fc]">Member</span></p>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
            <Calendar className="w-3 h-3" />
            <span>Hết hạn</span>
          </div>
          <p className="text-white font-bold text-sm">{MOCK_CURRENT.expires}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-white">Chọn gói gia hạn</h2>

      {/* Package cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`glass-dark rounded-2xl p-5 border-2 transition-all relative ${pkg.id === MOCK_CURRENT.plan.toLowerCase() ? 'border-[#003a5a]/60' : pkg.accent}`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-[#003a5a] text-white whitespace-nowrap">
                Most Popular
              </div>
            )}
            {pkg.id === MOCK_CURRENT.plan.toLowerCase() && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold bg-[#003a5a] text-white whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Hiện tại
              </div>
            )}
            <div className="mb-4">
              <h3 className="font-black text-white text-xl" style={{ color: pkg.color }}>{pkg.name}</h3>
              <p className="text-white font-bold text-lg mt-1">{fmt(pkg.price)}<span className="text-white/30 text-xs font-normal">đ/tháng</span></p>
            </div>
            <ul className="space-y-2 mb-5">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: pkg.color }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleRenew(pkg)}
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-all"
              style={pkg.id === 'basic' ? undefined : { backgroundColor: pkg.color, color: '#000' }}
              {...(pkg.id === 'basic' ? { className: 'w-full py-2.5 rounded-xl font-bold text-sm transition-all glass border border-white/10 text-white hover:bg-white/5' } : {})}
            >
              {pkg.id === MOCK_CURRENT.plan.toLowerCase() ? 'Gia hạn gói này' : 'Chọn gói'}
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-dark rounded-2xl p-7 border border-white/10 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Xác nhận gia hạn</h3>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="glass rounded-xl p-4 mb-5 text-sm">
              <div className="flex justify-between text-white/50 mb-2">
                <span>Gói</span><span className="text-white font-bold">{selected.name}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Số tiền</span><span className="text-[#7dd3fc] font-black">{fmt(selected.price)}đ/tháng</span>
              </div>
            </div>
            <p className="text-xs text-white/40 mb-3">Phương thức thanh toán</p>
            <div className="space-y-2 mb-6">
              {paymentOptions.map(p => (
                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payMethod === p.id ? 'border-[#f97316]/50 bg-[#f97316]/5' : 'border-white/10 hover:border-white/20'}`}>
                  <input type="radio" name="pm" value={p.id} checked={payMethod === p.id} onChange={e => setPayMethod(e.target.value)} className="sr-only" />
                  <span className="text-base">{p.icon}</span>
                  <span className="text-sm text-white">{p.label}</span>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all ${payMethod === p.id ? 'border-[#f97316] bg-[#f97316]' : 'border-white/20'}`} />
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl glass border border-white/10 text-white text-sm font-semibold hover:bg-white/5">Hủy</button>
              <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl bg-[#f97316] text-black font-bold text-sm hover:bg-[#f97316]/90 transition-colors flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
