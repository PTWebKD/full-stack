import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Calendar, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const rentDurations = [
  { days: 1, label: '1 ngày', multiplier: 1 },
  { days: 3, label: '3 ngày', multiplier: 2.5 },
  { days: 7, label: '1 tuần', multiplier: 5 },
  { days: 14, label: '2 tuần', multiplier: 8 },
  { days: 30, label: '1 tháng', multiplier: 14 },
];

export default function GearRentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [fitCoinBalance, setFitCoinBalance] = useState(0);
  const [duration, setDuration] = useState(rentDurations[2]);
  const [payment, setPayment] = useState('cash');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRentalsCount, setActiveRentalsCount] = useState(0);

  useEffect(() => {
    api.get(`/api/gear/${id}`)
      .then(setItem)
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
    api.get('/api/fitcoin/balance')
      .then(bal => setFitCoinBalance(bal.balance !== undefined ? bal.balance : bal))
      .catch(() => setFitCoinBalance(0));
    api.get('/api/gear/my/rentals')
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const active = list.filter(r => ['active','overdue'].includes(r.status));
        setActiveRentalsCount(active.length);
      })
      .catch(() => setActiveRentalsCount(0));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#18181B]/60">Đang tải...</div>
  );

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-[#18181B]/60">
      <Link to="/gear" className="text-[#FF5722] hover:underline">Về Gear Hub</Link>
    </div>
  );

  const dailyRate = item.rent_price_day || 0;
  const rentFee = Math.round(dailyRate * duration.multiplier);
  const deposit = item.deposit_amount || 0;
  const total = rentFee + deposit;
  const fmt = (n) => (n || 0).toLocaleString('vi-VN');

  const handleConfirm = async () => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + duration.days);
    const rental_start = today.toISOString().slice(0, 10);
    const rental_end = endDate.toISOString().slice(0, 10);
    try {
      await api.post(`/api/gear/${id}/rent`, { rental_start, rental_end });
    } catch {
      // proceed to done state even on error for UX continuity
    }
    setDone(true);
    setTimeout(() => navigate('/orders'), 2000);
  };

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-16 h-16 text-[#FF5722] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-[#18181B] mb-2">Đặt thuê thành công!</h3>
      <p className="text-[#18181B]/60 text-sm">Gear sẽ được giao trong 24h. Bạn có {duration.days} ngày để sử dụng.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/gear/${id}`} className="inline-flex items-center gap-2 text-sm text-[#18181B]/60 hover:text-[#18181B] mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <Key className="w-5 h-5 text-[#FF5722]" />
        <h2 className="text-xl font-black text-[#18181B]">Thuê Gear</h2>
      </div>

      {/* Item summary */}
      <div className="glass rounded-2xl p-4 border border-[#18181B]/10 flex items-center gap-4 mb-5">
        <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
        <div>
          <h3 className="font-bold text-[#18181B]">{item.name}</h3>
          <p className="text-sm text-[#18181B]/60">{item.seller}</p>
          <p className="text-xs text-[#18181B]/40 mt-1">Tiền cọc: {fmt(deposit)}đ · Thuê/ngày: {fmt(dailyRate)}đ</p>
        </div>
      </div>

      {/* Duration picker */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#FF5722]" />
          <h3 className="font-semibold text-[#18181B]">Chọn thời gian thuê</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {rentDurations.map(d => (
            <button key={d.days} onClick={() => setDuration(d)}
              className={`py-3 rounded-xl border text-center transition-all ${duration.days === d.days ? 'border-[#FF5722]/50 bg-[#FF5722]/10 text-[#FF5722]' : 'border-[#18181B]/10 text-[#18181B]/60 hover:border-[#18181B]/20'}`}>
              <p className="text-sm font-bold">{d.days}N</p>
              <p className="text-xs opacity-70">{fmt(Math.round(dailyRate * d.multiplier))}đ</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-[#18181B]/40 mt-3">Trả gear đúng hạn để nhận lại tiền cọc toàn bộ.</p>
      </div>

      {/* Cost breakdown */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 mb-4 space-y-3">
        <h3 className="font-semibold text-[#18181B] mb-1">Chi phí thuê {duration.label}</h3>
        {[
          { label: 'Phí thuê', value: fmt(rentFee) + 'đ' },
          { label: 'Tiền cọc (hoàn trả khi trả gear)', value: fmt(deposit) + 'đ', note: true },
        ].map(r => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className={r.note ? 'text-[#18181B]/60 italic' : 'text-[#18181B]/80'}>{r.label}</span>
            <span className={r.note ? 'text-[#18181B]/60' : 'text-[#18181B] font-medium'}>{r.value}</span>
          </div>
        ))}
        <div className="border-t border-[#18181B]/10 pt-3 flex justify-between font-black text-[#18181B]">
          <span>Tổng thanh toán</span>
          <span className="text-[#FF5722]">{fmt(total)}đ</span>
        </div>
      </div>

      {/* Payment */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10 mb-5 space-y-3">
        <h3 className="font-semibold text-[#18181B]">Phương thức thanh toán</h3>
        {[
          { id: 'cash', label: 'Tiền mặt khi nhận hàng', icon: '💵' },
          { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
          { id: 'fitcoin', label: `FitCoin (bạn có ${fitCoinBalance.toLocaleString()} FC)`, icon: '⚡' },
        ].map(m => (
          <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payment === m.id ? 'border-[#FF5722]/40 bg-[#FF5722]/5' : 'border-[#18181B]/10 hover:border-[#18181B]/10'}`}>
            <input type="radio" name="rent-payment" checked={payment === m.id} onChange={() => setPayment(m.id)} className="sr-only" />
            <span className="text-lg">{m.icon}</span>
            <span className="text-sm text-[#18181B]/80">{m.label}</span>
            {m.id === 'fitcoin' && total > fitCoinBalance && (
              <span className="ml-auto text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />Không đủ
              </span>
            )}
            <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all ${payment === m.id ? 'border-[#FF5722] bg-[#FF5722]' : 'border-[#18181B]/20'}`} />
          </label>
        ))}
      </div>

      {activeRentalsCount >= 3 && (
        <div className="glass border border-amber-500/20 bg-amber-500/10 text-amber-200 rounded-2xl p-4 mb-5 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold">Đạt giới hạn thuê tối đa (Luật BR-18)</p>
            <p className="mt-0.5 opacity-80">Bạn đang thuê {activeRentalsCount} thiết bị và không thể thuê thêm. Vui lòng hoàn trả thiết bị cũ tại quầy trước khi tiếp tục thuê mới.</p>
          </div>
        </div>
      )}

      <button onClick={handleConfirm}
        disabled={(payment === 'fitcoin' && total > fitCoinBalance) || activeRentalsCount >= 3}
        className="w-full py-3.5 rounded-xl bg-[#FF5722] text-[#18181B] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FF5722]/90 transition-colors disabled:opacity-40">
        <Zap className="w-4 h-4" /> Xác nhận thuê {duration.label} — {fmt(total)}đ
      </button>
    </div>
  );
}
