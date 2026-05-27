import { BarChart2, Users, Clock, TrendingUp, ArrowUp, Calendar } from 'lucide-react';

const weeklyCheckins = [
  { day: 'Mon', count: 58 },
  { day: 'Tue', count: 72 },
  { day: 'Wed', count: 65 },
  { day: 'Thu', count: 80 },
  { day: 'Fri', count: 91 },
  { day: 'Sat', count: 104 },
  { day: 'Sun', count: 45 },
];

const monthlyGrowth = [280, 292, 305, 318, 330, 342];
const monthLabels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

const peakHours = [
  { hour: '6am', pct: 35 }, { hour: '8am', pct: 55 }, { hour: '10am', pct: 30 },
  { hour: '12pm', pct: 45 }, { hour: '2pm', pct: 25 }, { hour: '4pm', pct: 60 },
  { hour: '6pm', pct: 100 }, { hour: '8pm', pct: 72 }, { hour: '10pm', pct: 20 },
];

const retentionCohorts = [
  { month: 'Jan', m1: 88, m2: 74, m3: 65 },
  { month: 'Feb', m1: 91, m2: 78, m3: null },
  { month: 'Mar', m1: 85, m2: null, m3: null },
];

export default function GymOwnerAnalyticsPage() {
  const maxCheckin = Math.max(...weeklyCheckins.map(d => d.count));
  const maxMonthly = Math.max(...monthlyGrowth);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-[#7dd3fc]" />
        <h2 className="text-lg font-bold text-white">Gym Analytics</h2>
        <span className="text-xs text-white/30 ml-auto">May 2025</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Tổng thành viên', value: '342', sub: '+28 tháng này', color: '#003a5a', Icon: Users },
          { label: 'Hoạt động hôm nay', value: '78', sub: '22.8% tổng', color: '#00d4ff', Icon: TrendingUp },
          { label: 'Thời gian TB/buổi', value: '64m', sub: '+4m vs tháng trước', color: '#a855f7', Icon: Clock },
          { label: 'Retention Rate', value: '96.8%', sub: '3.2% churn', color: '#fbbf24', Icon: ArrowUp },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40">{s.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#7dd3fc] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly check-ins */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Check-ins tuần này</h3>
            <span className="text-xs text-[#7dd3fc]">
              {weeklyCheckins.reduce((s, d) => s + d.count, 0)} tổng
            </span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {weeklyCheckins.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-white/30">{d.count}</span>
                <div className="w-full rounded-t transition-all"
                  style={{ height: `${(d.count / maxCheckin) * 80}px`, background: d.count === maxCheckin ? '#003a5a' : 'rgba(0,58,90,0.25)' }} />
                <span className="text-xs text-white/40">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member growth */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Tăng trưởng thành viên</h3>
            <span className="text-xs text-[#00d4ff]">6 tháng</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {monthlyGrowth.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-white/30">{v}</span>
                <div className="w-full rounded-t"
                  style={{ height: `${(v / maxMonthly) * 80}px`, background: i === monthlyGrowth.length - 1 ? '#00d4ff' : 'rgba(0,212,255,0.25)' }} />
                <span className="text-xs text-white/30">{monthLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak hours heatmap */}
      <div className="glass rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-sm">Giờ cao điểm</h3>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="w-3 h-3 rounded-sm bg-[#003a5a]/20" /> Thấp
            <div className="w-3 h-3 rounded-sm bg-[#003a5a]" /> Cao
          </div>
        </div>
        <div className="flex gap-2">
          {peakHours.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full h-16 rounded-lg flex items-end justify-center pb-1"
                style={{ background: `rgba(0,58,90,${h.pct / 100 * 0.8 + 0.05})` }}>
                {h.pct === 100 && <span className="text-xs font-bold text-black">Peak</span>}
              </div>
              <span className="text-xs text-white/30 whitespace-nowrap">{h.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retention cohort table */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/40" />
          <h3 className="font-semibold text-white text-sm">Retention Cohort (3 tháng)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs text-white/40 font-medium">Tháng gia nhập</th>
                <th className="px-5 py-3 text-center text-xs text-white/40 font-medium">Tháng 1</th>
                <th className="px-5 py-3 text-center text-xs text-white/40 font-medium">Tháng 2</th>
                <th className="px-5 py-3 text-center text-xs text-white/40 font-medium">Tháng 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {retentionCohorts.map(c => (
                <tr key={c.month}>
                  <td className="px-5 py-3 text-white/70 font-medium">{c.month} 2025</td>
                  {[c.m1, c.m2, c.m3].map((v, i) => (
                    <td key={i} className="px-5 py-3 text-center">
                      {v !== null ? (
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold"
                          style={{ background: `rgba(0,58,90,${v / 100 * 0.3})`, color: v >= 80 ? '#003a5a' : v >= 60 ? '#fbbf24' : '#f97316' }}>
                          {v}%
                        </span>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
