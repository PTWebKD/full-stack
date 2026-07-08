import { useState } from 'react';
import { TrendingUp, Dumbbell, ChevronDown, Brain, Sparkles, Check, AlertTriangle } from 'lucide-react';

// Fabricated historical data for chart visualization
const extendedHistory = {
  1: [
    { date: '2025-01-10', maxWeight: 85, totalVol: 3400 },
    { date: '2025-01-24', maxWeight: 90, totalVol: 3600 },
    { date: '2025-02-07', maxWeight: 92.5, totalVol: 3700 },
    { date: '2025-02-21', maxWeight: 95, totalVol: 3800 },
    { date: '2025-03-07', maxWeight: 97.5, totalVol: 3900 },
    { date: '2025-03-21', maxWeight: 100, totalVol: 4000 },
    { date: '2025-04-04', maxWeight: 102.5, totalVol: 4100 },
    { date: '2025-04-18', maxWeight: 105, totalVol: 4200 },
    { date: '2025-05-02', maxWeight: 107.5, totalVol: 4300 },
    { date: '2025-05-21', maxWeight: 110, totalVol: 4400 },
  ],
  2: [
    { date: '2025-01-15', maxWeight: 140, totalVol: 8400 },
    { date: '2025-02-01', maxWeight: 150, totalVol: 9000 },
    { date: '2025-02-18', maxWeight: 155, totalVol: 9300 },
    { date: '2025-03-05', maxWeight: 160, totalVol: 9600 },
    { date: '2025-03-22', maxWeight: 162.5, totalVol: 9750 },
    { date: '2025-04-08', maxWeight: 165, totalVol: 9900 },
    { date: '2025-04-25', maxWeight: 167.5, totalVol: 10050 },
    { date: '2025-05-12', maxWeight: 170, totalVol: 10200 },
    { date: '2025-05-17', maxWeight: 170, totalVol: 10200 },
    { date: '2025-05-21', maxWeight: 170, totalVol: 10200 },
  ],
  4: [
    { date: '2025-01-20', maxWeight: 100, totalVol: 6000 },
    { date: '2025-02-03', maxWeight: 110, totalVol: 6600 },
    { date: '2025-02-17', maxWeight: 115, totalVol: 6900 },
    { date: '2025-03-03', maxWeight: 120, totalVol: 7200 },
    { date: '2025-03-17', maxWeight: 125, totalVol: 7500 },
    { date: '2025-04-01', maxWeight: 130, totalVol: 7800 },
    { date: '2025-04-14', maxWeight: 132.5, totalVol: 7950 },
    { date: '2025-04-28', maxWeight: 135, totalVol: 8100 },
    { date: '2025-05-12', maxWeight: 137.5, totalVol: 8250 },
    { date: '2025-05-19', maxWeight: 140, totalVol: 8400 },
  ],
  5: [
    { date: '2025-01-08', maxWeight: 50, totalVol: 2000 },
    { date: '2025-01-22', maxWeight: 52.5, totalVol: 2100 },
    { date: '2025-02-05', maxWeight: 55, totalVol: 2200 },
    { date: '2025-02-19', maxWeight: 57.5, totalVol: 2300 },
    { date: '2025-03-05', maxWeight: 60, totalVol: 2400 },
    { date: '2025-03-19', maxWeight: 62.5, totalVol: 2500 },
    { date: '2025-04-02', maxWeight: 62.5, totalVol: 2500 },
    { date: '2025-04-16', maxWeight: 65, totalVol: 2600 },
    { date: '2025-04-30', maxWeight: 65, totalVol: 2600 },
    { date: '2025-05-21', maxWeight: 65, totalVol: 2600 },
  ],
};

const availableExercises = [
  { id: 1, name: 'Bench Press', unit: 'kg', color: '#FF5722' },
  { id: 2, name: 'Deadlift', unit: 'kg', color: '#3b82f6' },
  { id: 4, name: 'Squat', unit: 'kg', color: '#71717a' },
  { id: 5, name: 'Shoulder Press', unit: 'kg', color: '#a855f7' },
];

function LineChart({ data, color, unit }) {
  if (!data || data.length < 2) return null;
  const W = 500, H = 120, padX = 10, padY = 10;
  const values = data.map(d => d.maxWeight);
  const minV = Math.min(...values) * 0.95;
  const maxV = Math.max(...values) * 1.02;
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (W - padX * 2);
    const y = padY + (1 - (d.maxWeight - minV) / range) * (H - padY * 2);
    return { x, y, ...d };
  });

  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `M${pts[0].x},${H} ` + pts.map(p => `L${p.x},${p.y}`).join(' ') + ` L${pts[pts.length - 1].x},${H} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="#080c10" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-[#18181B]/25 mt-1 px-2">
        <span>{data[0].date.slice(5)}</span>
        <span className="text-[#18181B]/60 font-semibold">{data[data.length - 1].maxWeight}{unit}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}

export default function ExerciseProgressPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [open, setOpen] = useState(false);

  const ex = availableExercises.find(e => e.id === selectedId);
  const data = extendedHistory[selectedId] || [];
  const first = data[0]?.maxWeight || 0;
  const last = data[data.length - 1]?.maxWeight || 0;
  const gain = first ? (((last - first) / first) * 100).toFixed(1) : 0;
    const totalVol = data.reduce((s, d) => s + d.totalVol, 0);

  // Check if max weight flatlined in the last 3 sessions
  const isPlateau = data.length >= 3 && 
    data[data.length - 1].maxWeight === data[data.length - 2].maxWeight && 
    data[data.length - 2].maxWeight === data[data.length - 3].maxWeight;

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#FF5722]" />
        <h2 className="text-lg font-bold text-[#18181B]">Exercise Progress</h2>
      </div>

      {/* Exercise selector */}
      <div className="relative">
        <button onClick={() => setOpen(o => !o)}
          className="w-full sm:w-72 flex items-center justify-between px-4 py-3 glass rounded-xl border border-[#18181B]/10 text-[#18181B] text-sm font-medium hover:border-[#18181B]/20 transition-all">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: ex?.color }} />
            {ex?.name}
          </div>
          <ChevronDown className={`w-4 h-4 text-[#18181B]/60 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full mt-1 left-0 w-full sm:w-72 glass rounded-xl border border-[#18181B]/10 z-10 overflow-hidden">
            {availableExercises.map(e => (
              <button key={e.id} onClick={() => { setSelectedId(e.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white ${e.id === selectedId ? 'text-[#18181B] font-semibold' : 'text-[#18181B]/60'}`}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
                {e.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FitFuel AI Engine Recommendation Panel */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden shadow-lg bg-white">
        <div className="px-5 py-4 border-b border-[#18181B]/10 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#FF5722]" />
            <div>
              <h4 className="font-extrabold text-sm text-[#18181B]">FitFuel AI Engine v2.0</h4>
              <p className="text-[10px] text-[#FF5722] font-black uppercase tracking-wider">Mô hình phân tích tiến độ & Plateau (RE-3)</p>
            </div>
          </div>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="p-5 space-y-4">
          {isPlateau ? (
            <>
              <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-xs text-amber-600 uppercase tracking-wider mb-1">Chẩn đoán: Phát hiện chững tạ (Plateau Detected)</h5>
                  <p className="text-xs text-[#18181B]/80 leading-relaxed">
                    Bạn đã đạt mức tạ <b>{last}kg</b> trong 3 buổi liên tục. Dựa trên chuỗi tạ của bài <b>{ex?.name}</b> cùng chỉ số RPE trung bình <b>9.2</b> và từ khóa phân tích cảm xúc từ log tập <i>"mỏi cơ vai/đùi"</i>, AI dự báo cơ sợi của bạn đã thích nghi hoàn toàn.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => alert('AI đã áp dụng chu kỳ Progressive Overload (+2.5kg và giảm số rep xuống 6 cho buổi tập sau)!')}
                  className="px-4 py-2 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Áp dụng Overload (+2.5kg)
                </button>
                <button
                  onClick={() => alert('AI đã kích hoạt tuần phục hồi Deload (giảm 20% tạ/volume để phục hồi cơ sợi)!')}
                  className="px-4 py-2 rounded-xl bg-[#18181B] text-white text-xs font-bold hover:bg-black transition-all"
                >
                  Nhận chu kỳ Deload
                </button>
                <button
                  onClick={() => alert('Yêu cầu đã gửi tới hệ thống chăm sóc PT 1:1. Huấn luyện viên sẽ liên hệ với bạn qua SĐT trong 24 giờ tới!')}
                  className="px-4 py-2 rounded-xl border border-[#18181B]/10 text-[#18181B]/60 text-xs font-semibold hover:text-[#18181B] hover:bg-slate-50 transition-all"
                >
                  Gửi yêu cầu PT 1:1
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-extrabold text-xs text-emerald-600 uppercase tracking-wider mb-1">Chẩn đoán: Tiến trình tốt (Steady Progress)</h5>
                  <p className="text-xs text-[#18181B]/80 leading-relaxed">
                    Mức tạ tối đa <b>{last}kg</b> của bài <b>{ex?.name}</b> đang tiến triển tốt. RPE trung bình <b>7.0</b> (dưới ngưỡng kiệt sức) cho thấy thể lực của bạn dư dả. AI khuyến khích tăng thêm tạ ở buổi sau.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => alert('AI đã thêm đề xuất tăng tạ +2.5kg cho buổi tập tiếp theo của bạn!')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Tăng tạ buổi tới (+2.5kg)
                </button>
                <button
                  onClick={() => alert('Đã ghi nhận giữ nguyên lịch tập hiện tại.')}
                  className="px-4 py-2 rounded-xl border border-[#18181B]/10 text-[#18181B]/60 text-xs font-semibold hover:text-[#18181B] hover:bg-slate-50 transition-all"
                >
                  Giữ nguyên mức tạ
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Max Weight', value: `${last}kg`, color: ex?.color },
          { label: 'Progress', value: `+${gain}%`, color: '#FF5722' },
          { label: 'Sessions', value: data.length, color: '#71717a' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[#18181B]/10 text-center">
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#18181B]/60 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#18181B] text-sm">Max Weight per Session</h3>
          <span className="text-xs text-[#18181B]/40">Jan – May 2025</span>
        </div>
        <LineChart data={data} color={ex?.color || '#FF5722'} unit={ex?.unit || 'kg'} />
      </div>

      {/* Session log table */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-[#18181B]/10">
          <h3 className="font-semibold text-[#18181B] text-sm">Session Log</h3>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {[...data].reverse().slice(0, 8).map((d, i) => {
            const prevWeight = data[data.length - 2 - i]?.maxWeight;
            const delta = prevWeight ? d.maxWeight - prevWeight : 0;
            return (
              <div key={d.date} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-3.5 h-3.5 text-[#18181B]/40 shrink-0" />
                  <span className="text-sm text-[#18181B]/80">{d.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#18181B]">{d.maxWeight}{ex?.unit}</span>
                  {delta !== 0 && (
                    <span className={`text-xs font-medium ${delta > 0 ? 'text-[#FF5722]' : 'text-red-400'}`}>
                      {delta > 0 ? '+' : ''}{delta}{ex?.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
