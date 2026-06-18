import { useState, useEffect } from 'react';
import { HeartHandshake, PhoneCall, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const PRIORITY_MAP = {
  HIGH:   { label: 'Cao',    color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/20' },
  MEDIUM: { label: 'Trung',  color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  LOW:    { label: 'Thấp',   color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20' },
};

const TYPE_LABELS = {
  renew_reminder:   'Nhắc gia hạn',
  inactive_alert:   'Lâu không tập',
  upsell_plan:      'Đề xuất Gói Năm',
  upsell_nutrition: 'Đề xuất dinh dưỡng',
};

export default function GymOwnerCareQueuePage() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handling, setHandling] = useState({});

  useEffect(() => {
    api.get('/api/gym-owner/care-queue')
      .then(data => setRecs(Array.isArray(data) ? data : []))
      .catch(() => setRecs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDone = async (recId, result) => {
    setHandling(prev => ({ ...prev, [recId]: true }));
    try {
      await api.patch(`/api/gym-owner/care-queue/${recId}`, { status: 'handled', result });
      setRecs(prev => prev.filter(r => r.rec_id !== recId));
    } catch { /* ignore */ }
    setHandling(prev => ({ ...prev, [recId]: false }));
  };

  const sorted = [...recs].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HeartHandshake className="w-5 h-5 text-[#00d4ff]" />
        <h1 className="text-xl font-bold text-white">AI Care Queue</h1>
        {recs.length > 0 && (
          <span className="ml-auto px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
            {recs.filter(r => r.priority === 'HIGH').length} HIGH
          </span>
        )}
      </div>

      {loading && <div className="py-16 text-center text-white/30">Đang tải...</div>}

      {!loading && sorted.length === 0 && (
        <div className="py-16 text-center text-white/30">
          <Check className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Không có hội viên nào cần chăm sóc!</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(rec => {
          const pr = PRIORITY_MAP[rec.priority] || PRIORITY_MAP.LOW;
          return (
            <div key={rec.rec_id} className={`glass rounded-2xl p-4 border ${pr.bg} transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{rec.member_name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${pr.bg} ${pr.color}`}>{pr.label}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{rec.member_phone}</p>
                </div>
                <span className="text-xs text-white/30 glass px-2 py-1 rounded-lg border border-white/5">
                  {TYPE_LABELS[rec.type] || rec.type}
                </span>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <AlertCircle className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <p className="text-xs text-white/50">{rec.reason || 'Cần liên hệ chăm sóc.'}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <a href={`tel:${rec.member_phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium glass border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all">
                  <PhoneCall className="w-3.5 h-3.5" /> Gọi điện
                </a>
                <button onClick={() => handleDone(rec.rec_id, 'renewed')} disabled={handling[rec.rec_id]}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50">
                  <Check className="w-3.5 h-3.5" /> Đã gia hạn
                </button>
                <button onClick={() => handleDone(rec.rec_id, 'unreachable')} disabled={handling[rec.rec_id]}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium glass border border-white/10 text-white/50 hover:text-white transition-all disabled:opacity-50">
                  <MessageSquare className="w-3.5 h-3.5" /> Không liên lạc được
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
