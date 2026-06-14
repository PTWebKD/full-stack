import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Star, Calendar } from 'lucide-react';
import { api } from '../../services/api';

const actionConfig = {
  listed: { label: 'Đăng bán/thuê', color: '#f97316', bg: 'bg-[#f97316]/10 border-[#f97316]/20', icon: '📦' },
  sold: { label: 'Đã bán', color: '#22c55e', bg: 'bg-green-400/10 border-green-400/20', icon: '💰' },
  rented: { label: 'Đang thuê', color: '#7dd3fc', bg: 'bg-[#7dd3fc]/10 border-[#7dd3fc]/20', icon: '🔑' },
  returned: { label: 'Đã trả', color: '#a855f7', bg: 'bg-purple-400/10 border-purple-400/20', icon: '↩️' },
  relisted: { label: 'Đăng lại', color: '#fbbf24', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: '🔄' },
};

export default function GearLifecyclePage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [lifecycle, setLifecycle] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/api/gear/${id}`),
      api.get(`/api/gear/${id}/lifecycle`),
    ])
      .then(([gear, events]) => { setItem(gear); setLifecycle(events || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      <p>Đang tải...</p>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      <div className="text-center">
        <p className="mb-4">Không tìm thấy gear</p>
        <Link to="/gear" className="text-[#f97316] hover:underline">Về Gear Hub</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/gear/${id}`} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </Link>

      {/* Gear header */}
      <div className="glass rounded-2xl p-5 border border-white/5 flex items-center gap-5 mb-6">
        <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-black text-white text-lg">{item.name}</h2>
            {item.verified && <ShieldCheck className="w-4 h-4 text-[#7dd3fc]" />}
          </div>
          <p className="text-sm text-white/40 mb-2">Gear ID: <span className="font-mono text-white/60">{item.gear_id}</span></p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{item.avg_rating}</span>
            <span>{lifecycle.length} giao dịch</span>
            <span className="text-[#f97316]">Condition: {'★'.repeat(lifecycle[lifecycle.length - 1]?.condition_at_time || 5)}</span>
          </div>
        </div>
      </div>

      {/* Lifecycle heading */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Gear Lifecycle</h3>
        <span className="text-xs text-white/30">Minh bạch 100% lịch sử</span>
      </div>

      {lifecycle.length === 0 ? (
        <div className="glass rounded-2xl p-8 border border-white/5 text-center text-white/30">
          <p>Chưa có lịch sử giao dịch</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/5" />

          <div className="space-y-0">
            {lifecycle.map((entry) => {
              const cfg = actionConfig[entry.action] || actionConfig.listed;
              return (
                <div key={entry.lifecycle_id} className="relative flex gap-5 pb-6 last:pb-0">
                  {/* Dot */}
                  <div className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 text-xl"
                    style={{ background: `${cfg.color}15`, borderColor: `${cfg.color}40` }}>
                    {cfg.icon}
                  </div>

                  {/* Card */}
                  <div className="flex-1 glass rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg}`}
                        style={{ color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-white/30 flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3" />{new Date(entry.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-white/50 italic">"{entry.notes}"</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3">
                      {entry.condition_at_time && (
                        <span className="text-xs text-white/40">
                          Tình trạng: <span className="text-yellow-400">{'★'.repeat(entry.condition_at_time)}{'☆'.repeat(5 - entry.condition_at_time)}</span>
                        </span>
                      )}
                      {entry.price_snapshot && (
                        <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                          {Number(entry.price_snapshot).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
