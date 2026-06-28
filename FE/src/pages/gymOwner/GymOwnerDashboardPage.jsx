import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Megaphone } from 'lucide-react';
import { api } from '../../services/api';

const fmt = (n) => n.toLocaleString('vi-VN');

export default function GymOwnerDashboardPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [gym, setGym] = useState(null);

  const defaultAnnouncements = [
    {
      announcement_id: 'mock-1',
      title: 'Bảo trì định kỳ khu vực Cardio',
      body: 'Các máy chạy bộ số 3 và số 5 sẽ được bảo trì vào sáng Thứ Hai từ 8:00 đến 11:00. Rất mong quý hội viên thông cảm.',
      priority: 'high',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    },
    {
      announcement_id: 'mock-2',
      title: 'Thử thách Plank Challenge tuần mới',
      body: 'Hội viên hoàn thành thử thách Plank 5 phút sẽ nhận được 50 FitCoin thưởng. Đăng ký tham gia trực tiếp với huấn luyện viên.',
      priority: 'medium',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
    },
    {
      announcement_id: 'mock-3',
      title: 'Khảo sát ý kiến mở lớp Yoga tối',
      body: 'Phòng gym đang lên kế hoạch mở thêm lớp Yoga Vinyasa vào tối Thứ 5 hàng tuần. Vui lòng cho ý kiến phản hồi tại quầy lễ tân.',
      priority: 'low',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 6).toISOString(),
    }
  ];

  useEffect(() => {
    api.get('/api/gym/mine').catch(() => null).then(g => setGym(g));
    api.get('/api/gym/announcements')
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setAnnouncements(list.length > 0 ? list : defaultAnnouncements);
      })
      .catch(() => setAnnouncements(defaultAnnouncements));
  }, []);

  const s = {
    totalMembers: 184,
    newMembersThisMonth: 12,
    activeToday: 42,
    peakHour: '17:00 - 19:00',
    avgSessionLength: '68 min',
    monthlyRevenue: 24500000,
    churnRate: '2.4',
  };

  return (
    <div className="space-y-6">
      {gym && (
        <div className="glass rounded-2xl p-4 border border-[#FF5722]/20">
          <p className="text-xs text-[#18181B]/60 uppercase tracking-widest mb-1">Phòng gym của bạn</p>
          <p className="text-lg font-bold text-[#18181B]">{gym.name}</p>
          <p className="text-sm text-[#18181B]/60">{gym.address}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: s.totalMembers, icon: Users, color: '#FF5722', sub: `+${s.newMembersThisMonth} this month` },
          { label: 'Active Today', value: s.activeToday, icon: TrendingUp, color: '#3b82f6', sub: `Peak: ${s.peakHour}` },
          { label: 'Avg Session', value: s.avgSessionLength, icon: Clock, color: '#FF5722', sub: 'per member' },
          { label: 'Monthly Revenue', value: `${(s.monthlyRevenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: '#a855f7', sub: `Churn: ${s.churnRate}%` },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#18181B]/60">{stat.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-[#18181B]">{stat.value}</p>
            <p className="text-xs text-[#18181B]/40 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18181B]/10">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#FF5722]" />
            <h3 className="font-semibold text-[#18181B]">Announcements</h3>
          </div>
          <button className="text-xs text-[#FF5722] hover:opacity-80">+ New</button>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {announcements.slice(0, 5).map(a => (
            <div key={a.announcement_id} className="flex items-start gap-4 px-5 py-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.priority === 'high' ? 'bg-red-400' : a.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#18181B]">{a.title}</p>
                <p className="text-xs text-[#18181B]/60 mt-0.5 leading-relaxed">{a.body}</p>
                <p className="text-xs text-[#18181B]/40 mt-1">{new Date(a.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="px-5 py-6 text-sm text-[#18181B]/40 text-center">Chưa có thông báo</p>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <h3 className="font-semibold text-[#18181B] mb-4">Weekly Check-ins</h3>
        <div className="flex items-end gap-2 h-20">
          {[45, 62, 38, 71, 58, 29, 48].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-[#FF5722]/20 hover:bg-[#FF5722]/40 transition-colors"
              style={{ height: `${(v / 80) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-1.5">
          {['M','T','W','T','F','S','S'].map((day, i) => (
            <span key={i} className="flex-1 text-center text-xs text-[#18181B]/40">{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
