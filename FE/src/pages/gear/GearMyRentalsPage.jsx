import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_MAP = {
  active:   { label: 'Đang thuê',  color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20' },
  overdue:  { label: 'Quá hạn',   color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20' },
  returned: { label: 'Đã trả',    color: 'text-white/40',   bg: 'bg-white/5 border-white/10' },
  lost:     { label: 'Bị mất',    color: 'text-red-500',    bg: 'bg-red-500/10 border-red-500/20' },
};

export default function GearMyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');

  useEffect(() => {
    api.get('/api/gear/rentals/mine')
      .then(data => setRentals(Array.isArray(data) ? data : []))
      .catch(() => setRentals([]))
      .finally(() => setLoading(false));
  }, []);

  const active = rentals.filter(r => ['active','overdue'].includes(r.status));
  const history = rentals.filter(r => ['returned','lost'].includes(r.status));
  const displayed = tab === 'active' ? active : history;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-[#00d4ff]" />
        <h1 className="text-xl font-bold text-white">Gear đang thuê</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {[['active', 'Đang thuê'], ['history', 'Lịch sử']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-[#00d4ff] text-black' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="py-16 text-center text-white/30">Đang tải...</div>}

      {!loading && displayed.length === 0 && (
        <div className="py-16 text-center text-white/30">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{tab === 'active' ? 'Không có gear nào đang thuê' : 'Chưa có lịch sử thuê gear'}</p>
          <Link to="/gear" className="mt-4 inline-block text-[#00d4ff] text-sm hover:underline">Xem Gear Marketplace</Link>
        </div>
      )}

      <div className="space-y-3">
        {displayed.map(rental => {
          const st = STATUS_MAP[rental.status] || STATUS_MAP.active;
          const daysLeft = rental.status === 'active' ? Math.ceil((new Date(rental.due_date) - new Date()) / 86400000) : null;
          return (
            <div key={rental.rental_id} className={`glass rounded-2xl p-4 border ${st.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">{rental.gear_name}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Thuê từ {new Date(rental.start_date).toLocaleDateString('vi-VN')} → {new Date(rental.due_date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>{st.label}</span>
              </div>

              {rental.status === 'active' && daysLeft !== null && (
                <div className={`flex items-center gap-2 mt-2 p-2 rounded-xl text-xs ${daysLeft <= 1 ? 'bg-orange-400/10 border border-orange-400/20 text-orange-300' : 'bg-white/5 border border-white/5 text-white/40'}`}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {daysLeft <= 0 ? 'Đến hạn trả hôm nay!' : `Còn ${daysLeft} ngày`}
                </div>
              )}

              {rental.status === 'overdue' && (
                <div className="flex items-center gap-2 mt-2 p-2 rounded-xl text-xs bg-red-400/10 border border-red-400/20 text-red-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Quá hạn — Phí phạt: {((rental.late_fee || 0)).toLocaleString('vi-VN')}đ
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-white/30">Đặt cọc: {(rental.deposit || 0).toLocaleString('vi-VN')}đ</span>
                <span className="text-xs text-white/30">Thuê: {(rental.rental_fee || 0).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
