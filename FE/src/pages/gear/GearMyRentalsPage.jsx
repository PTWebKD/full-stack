import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

// Backend GearTxnStatus only has pending/active/completed/disputed — there is no
// overdue/lost/returned status yet (that's part of the BR-19 return-flow work).
// "Quá hạn" below is derived client-side from rental_end, not a real status.
const STATUS_MAP = {
  pending:   { label: 'Chờ xử lý', color: 'text-[#18181B]/60', bg: 'bg-white border-[#18181B]/10' },
  active:    { label: 'Đang thuê', color: 'text-blue-400',     bg: 'bg-blue-400/10 border-blue-400/20' },
  completed: { label: 'Đã trả',    color: 'text-[#18181B]/60', bg: 'bg-white border-[#18181B]/10' },
  disputed:  { label: 'Đang tranh chấp', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function GearMyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    api.get('/api/gear/my/rentals')
      .then(data => setRentals(Array.isArray(data) ? data : []))
      .catch(() => setRentals([]))
      .finally(() => setLoading(false));
  }, []);

  const active = rentals.filter(r => r.status === 'active');
  const history = rentals.filter(r => ['completed', 'disputed'].includes(r.status));
  const displayed = tab === 'active' ? active : history;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-[#FF5722]" />
        <h1 className="text-xl font-bold text-[#18181B]">Gear đang thuê</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {[['active', 'Đang thuê'], ['history', 'Lịch sử']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-[#FF5722] text-white shadow-sm' : 'glass border border-[#18181B]/10 text-[#18181B]/60 hover:text-[#18181B]'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>}

      {!loading && displayed.length === 0 && (
        <div className="py-16 text-center text-[#18181B]/40">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{tab === 'active' ? 'Không có gear nào đang thuê' : 'Chưa có lịch sử thuê gear'}</p>
          <Link to="/gear" className="mt-4 inline-block text-[#FF5722] text-sm hover:underline">Xem Gear Marketplace</Link>
        </div>
      )}

      <div className="space-y-3">
        {displayed.map(rental => {
          const st = STATUS_MAP[rental.status] || STATUS_MAP.active;
          const daysLeft = rental.status === 'active' && rental.rental_end
            ? Math.ceil((new Date(rental.rental_end) - new Date()) / 86400000)
            : null;
          // No overdue status/late-fee field exists on the backend yet (BR-19
          // return-flow work) — this is just a client-side day-count display.
          const isOverdue = daysLeft !== null && daysLeft < 0;
          return (
            <div key={rental.transaction_id} className={`glass rounded-2xl p-4 border ${st.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#18181B]">{rental.gear_name}</p>
                  <p className="text-xs text-[#18181B]/60 mt-0.5">
                    Thuê từ {new Date(rental.rental_start).toLocaleDateString('vi-VN')} → {new Date(rental.rental_end).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
              </div>

              {rental.status === 'active' && daysLeft !== null && !isOverdue && (
                <div className={`flex items-center gap-2 mt-2 p-2 rounded-xl text-xs ${daysLeft <= 1 ? 'bg-orange-400/10 border border-orange-400/20 text-orange-300' : 'bg-white border border-[#18181B]/10 text-[#18181B]/60'}`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {daysLeft === 0 ? 'Đến hạn trả hôm nay!' : `Còn ${daysLeft} ngày`}
                </div>
              )}

              {isOverdue && (
                <div className="flex items-center gap-2 mt-2 p-2 rounded-xl text-xs bg-red-400/10 border border-red-400/20 text-red-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Quá hạn {Math.abs(daysLeft)} ngày — vui lòng trả gear tại quầy
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#18181B]/10">
                <span className="text-xs text-[#18181B]/40">Đặt cọc: {(rental.deposit || 0).toLocaleString('vi-VN')}đ</span>
                <span className="text-xs text-[#18181B]/40">Thuê: {(rental.amount || 0).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
