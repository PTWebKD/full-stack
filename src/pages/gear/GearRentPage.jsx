import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Calendar, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { getGearById } from '../../data/mockGear';
import { mockFitCoinBalance } from '../../data/mockFitCoin';

const rentDurations = [
  { days: 1, label: '1 ngày', multiplier: 1 },
  { days: 3, label: '3 ngày', multiplier: 2.5 },
  { days: 7, label: '1 tuần', multiplier: 5 },
  { days: 14, label: '2 tuần', multiplier: 8 },
  { days: 30, label: '1 tháng', multiplier: 14 },
];

const RENT_RATE = 0.02; // 2% of price per day
const DEPOSIT_RATE = 0.25; // 25% deposit

export default function GearRentPage() {
  const { id } = useParams();
  const item = getGearById(id);
  const navigate = useNavigate();
  const [duration, setDuration] = useState(rentDurations[2]);
  const [payment, setPayment] = useState('cash');
  const [done, setDone] = useState(false);

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      <Link to="/gear" className="text-[#f97316] hover:underline">Về Gear Hub</Link>
    </div>
  );

  const dailyRate = Math.round(item.price * RENT_RATE);
  const rentFee = Math.round(dailyRate * duration.multiplier);
  const deposit = Math.round(item.price * DEPOSIT_RATE);
  const total = rentFee + deposit;
  const fmt = (n) => n.toLocaleString('vi-VN');

  const handleConfirm = async () => {
    await new Promise(r => setTimeout(r, 800));
    setDone(true);
    setTimeout(() => navigate('/orders'), 2000);
  };

  if (done) return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <CheckCircle className="w-16 h-16 text-[#7dd3fc] mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Đặt thuê thành công!</h3>
      <p className="text-white/40 text-sm">Gear sẽ được giao trong 24h. Bạn có {duration.days} ngày để sử dụng.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/gear/${id}`} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <Key className="w-5 h-5 text-[#f97316]" />
        <h2 className="text-xl font-black text-white">Thuê Gear</h2>
      </div>

      {/* Item summary */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-4 mb-5">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
        <div>
          <h3 className="font-bold text-white">{item.name}</h3>
          <p className="text-sm text-white/40">{item.seller}</p>
          <p className="text-xs text-white/30 mt-1">Giá gốc: {fmt(item.price)}đ · Thuê/ngày: ~{fmt(dailyRate)}đ</p>
        </div>
      </div>

      {/* Duration picker */}
      <div className="glass rounded-2xl p-5 border border-white/5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#f97316]" />
          <h3 className="font-semibold text-white">Chọn thời gian thuê</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {rentDurations.map(d => (
            <button key={d.days} onClick={() => setDuration(d)}
              className={`py-3 rounded-xl border text-center transition-all ${duration.days === d.days ? 'border-[#f97316]/50 bg-[#f97316]/10 text-[#f97316]' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
              <p className="text-sm font-bold">{d.days}N</p>
              <p className="text-xs opacity-70">{fmt(Math.round(dailyRate * d.multiplier))}đ</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3">Trả gear đúng hạn để nhận lại tiền cọc toàn bộ.</p>
      </div>

      {/* Cost breakdown */}
      <div className="glass rounded-2xl p-5 border border-white/5 mb-4 space-y-3">
        <h3 className="font-semibold text-white mb-1">Chi phí thuê {duration.label}</h3>
        {[
          { label: 'Phí thuê', value: fmt(rentFee) + 'đ' },
          { label: `Tiền cọc (hoàn trả khi trả gear)`, value: fmt(deposit) + 'đ', note: true },
        ].map(r => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className={r.note ? 'text-white/40 italic' : 'text-white/70'}>{r.label}</span>
            <span className={r.note ? 'text-white/40' : 'text-white font-medium'}>{r.value}</span>
          </div>
        ))}
        <div className="border-t border-white/5 pt-3 flex justify-between font-black text-white">
          <span>Tổng thanh toán</span>
          <span className="text-[#f97316]">{fmt(total)}đ</span>
        </div>
      </div>

      {/* Payment */}
      <div className="glass rounded-2xl p-5 border border-white/5 mb-5 space-y-3">
        <h3 className="font-semibold text-white">Phương thức thanh toán</h3>
        {[
          { id: 'cash', label: 'Tiền mặt khi nhận hàng', icon: '💵' },
          { id: 'momo', label: 'Ví MoMo', icon: '🟣' },
          { id: 'fitcoin', label: `FitCoin (bạn có ${mockFitCoinBalance.toLocaleString()} FC)`, icon: '⚡' },
        ].map(m => (
          <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${payment === m.id ? 'border-[#f97316]/40 bg-[#f97316]/5' : 'border-white/5 hover:border-white/10'}`}>
            <input type="radio" name="rent-payment" checked={payment === m.id} onChange={() => setPayment(m.id)} className="sr-only" />
            <span className="text-lg">{m.icon}</span>
            <span className="text-sm text-white/80">{m.label}</span>
            {m.id === 'fitcoin' && total > mockFitCoinBalance && (
              <span className="ml-auto text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />Không đủ
              </span>
            )}
            <div className={`ml-auto w-4 h-4 rounded-full border-2 transition-all ${payment === m.id ? 'border-[#f97316] bg-[#f97316]' : 'border-white/20'}`} />
          </label>
        ))}
      </div>

      <button onClick={handleConfirm}
        disabled={payment === 'fitcoin' && total > mockFitCoinBalance}
        className="w-full py-3.5 rounded-xl bg-[#f97316] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f97316]/90 transition-colors disabled:opacity-40">
        <Zap className="w-4 h-4" /> Xác nhận thuê {duration.label} — {fmt(total)}đ
      </button>
    </div>
  );
}
