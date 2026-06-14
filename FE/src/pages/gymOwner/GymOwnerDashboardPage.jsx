import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Megaphone } from 'lucide-react';
import { api } from '../../services/api';

const fmt = (n) => n.toLocaleString('vi-VN');

export default function GymOwnerDashboardPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [gym, setGym] = useState(null);

  useEffect(() => {
    api.get('/api/gym/mine').catch(() => null).then(g => setGym(g));
    api.get('/api/gym/announcements')
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setAnnouncements([]));
  }, []);

  const s = {
    totalMembers: '—',
    newMembersThisMonth: '—',
    activeToday: '—',
    peakHour: '—',
    avgSessionLength: '—',
    monthlyRevenue: 0,
    churnRate: '—',
  };

  return (
    <div className="space-y-6">
      {gym && (
        <div className="glass rounded-2xl p-4 border border-[#003a5a]/20">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Phòng gym của bạn</p>
          <p className="text-lg font-bold text-white">{gym.name}</p>
          <p className="text-sm text-white/50">{gym.address}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: s.totalMembers, icon: Users, color: '#003a5a', sub: `+${s.newMembersThisMonth} this month` },
          { label: 'Active Today', value: s.activeToday, icon: TrendingUp, color: '#00d4ff', sub: `Peak: ${s.peakHour}` },
          { label: 'Avg Session', value: s.avgSessionLength, icon: Clock, color: '#f97316', sub: 'per member' },
          { label: 'Monthly Revenue', value: `${(s.monthlyRevenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: '#a855f7', sub: `Churn: ${s.churnRate}%` },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">{stat.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/30 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#f97316]" />
            <h3 className="font-semibold text-white">Announcements</h3>
          </div>
          <button className="text-xs text-[#7dd3fc] hover:opacity-80">+ New</button>
        </div>
        <div className="divide-y divide-white/5">
          {announcements.slice(0, 5).map(a => (
            <div key={a.announcement_id} className="flex items-start gap-4 px-5 py-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.priority === 'high' ? 'bg-red-400' : a.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{a.title}</p>
                <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{a.body}</p>
                <p className="text-xs text-white/20 mt-1">{new Date(a.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="px-5 py-6 text-sm text-white/30 text-center">Chưa có thông báo</p>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-white/5">
        <h3 className="font-semibold text-white mb-4">Weekly Check-ins</h3>
        <div className="flex items-end gap-2 h-24">
          {[45, 62, 38, 71, 58, 29, 48].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-[#003a5a]/20 hover:bg-[#003a5a]/40 transition-colors" style={{ height: `${(v / 80) * 100}%` }} />
              <span className="text-xs text-white/20">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
