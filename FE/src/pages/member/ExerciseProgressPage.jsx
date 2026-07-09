import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Dumbbell, ChevronDown, Brain, Sparkles, Check, AlertTriangle, Flame, BatteryLow, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

const SEVERITY_STYLES = {
  success: { box: 'bg-emerald-500/10 border-emerald-500/20', icon: Check, iconColor: 'text-emerald-500', titleColor: 'text-emerald-600' },
  warning: { box: 'bg-amber-500/10 border-amber-500/20', icon: AlertTriangle, iconColor: 'text-amber-500', titleColor: 'text-amber-600' },
  danger: { box: 'bg-red-500/10 border-red-500/20', icon: Flame, iconColor: 'text-red-500', titleColor: 'text-red-600' },
  info: { box: 'bg-slate-500/10 border-slate-500/20', icon: BatteryLow, iconColor: 'text-slate-500', titleColor: 'text-slate-600' },
};

const PRIMARY_ACTION_IDS = new Set(['apply_overload', 'apply_deload', 'increase_frequency']);

function LineChart({ data, color, unit }) {
  if (!data || data.length < 2) return null;
  const W = 500, H = 120, padX = 10, padY = 10;
  const values = data.map(d => d.max_weight);
  const minV = Math.min(...values) * 0.95;
  const maxV = Math.max(...values) * 1.02;
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (W - padX * 2);
    const y = padY + (1 - (d.max_weight - minV) / range) * (H - padY * 2);
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
          <circle key={i} cx={p.x} cy={p.y} r={p.is_pr ? 4.5 : 3} fill={p.is_pr ? '#FF5722' : color} stroke="#080c10" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-[#18181B]/25 mt-1 px-2">
        <span>{data[0].date.slice(5)}</span>
        <span className="text-[#18181B]/60 font-semibold">{data[data.length - 1].max_weight}{unit}</span>
        <span>{data[data.length - 1].date.slice(5)}</span>
      </div>
    </div>
  );
}

const EXERCISE_COLORS = ['#FF5722', '#3b82f6', '#71717a', '#a855f7', '#10b981', '#eab308'];

export default function ExerciseProgressPage() {
  const [exercises, setExercises] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // 1. Load the list of exercises the Member has actually logged (for the selector)
  useEffect(() => {
    api.get('/api/gym/progress/exercises')
      .then(list => {
        setExercises(list || []);
        if (list && list.length > 0) setSelectedName(list[0].exercise_name);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 2. Fetch the real RE-3 progress analysis whenever the selected exercise changes
  const fetchProgress = useCallback((name) => {
    if (!name) return;
    setLoading(true);
    setActionMsg(null);
    api.get(`/api/gym/progress?exercise_name=${encodeURIComponent(name)}`)
      .then(data => setProgress(data))
      .catch(() => setProgress(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedName) fetchProgress(selectedName);
  }, [selectedName, fetchProgress]);

  const handleAction = (actionId) => {
    setActionLoading(actionId);
    api.post('/api/gym/progress/action', { exercise_name: selectedName, action_id: actionId })
      .then(res => setActionMsg(res.message))
      .catch(() => setActionMsg('Không thể ghi nhận hành động, vui lòng thử lại.'))
      .finally(() => setActionLoading(null));
  };

  const colorFor = (name) => {
    const idx = exercises.findIndex(e => e.exercise_name === name);
    return EXERCISE_COLORS[idx % EXERCISE_COLORS.length];
  };

  const ex = exercises.find(e => e.exercise_name === selectedName);
  const color = colorFor(selectedName) || '#FF5722';
  const history = progress?.history || [];
  const diag = progress?.diagnosis;
  const sev = SEVERITY_STYLES[diag?.severity] || SEVERITY_STYLES.info;
  const SevIcon = sev.icon;

  if (!loading && exercises.length === 0) {
    return (
      <div className="space-y-5 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FF5722]" />
          <h2 className="text-lg font-bold text-[#18181B]">Exercise Progress</h2>
        </div>
        <div className="glass rounded-2xl border border-[#18181B]/10 p-8 text-center text-sm text-[#18181B]/60">
          Bạn chưa có buổi tập nào được ghi nhận. Hãy hoàn thành buổi tập đầu tiên để AI Engine bắt đầu phân tích tiến độ.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#FF5722]" />
        <h2 className="text-lg font-bold text-[#18181B]">Exercise Progress</h2>
      </div>

      {/* Exercise selector — populated from real logged exercises */}
      <div className="relative">
        <button onClick={() => setOpen(o => !o)}
          className="w-full sm:w-72 flex items-center justify-between px-4 py-3 glass rounded-xl border border-[#18181B]/10 text-[#18181B] text-sm font-medium hover:border-[#18181B]/20 transition-all">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            {ex?.exercise_name || 'Đang tải...'}
          </div>
          <ChevronDown className={`w-4 h-4 text-[#18181B]/60 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute top-full mt-1 left-0 w-full sm:w-72 glass rounded-xl border border-[#18181B]/10 z-10 overflow-hidden max-h-64 overflow-y-auto">
            {exercises.map(e => (
              <button key={e.exercise_name} onClick={() => { setSelectedName(e.exercise_name); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white ${e.exercise_name === selectedName ? 'text-[#18181B] font-semibold' : 'text-[#18181B]/60'}`}>
                <span className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colorFor(e.exercise_name) }} />
                  {e.exercise_name}
                </span>
                <span className="text-[10px] text-[#18181B]/40">{e.sessions_count} buổi</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="glass rounded-2xl border border-[#18181B]/10 p-8 flex items-center justify-center gap-2 text-sm text-[#18181B]/60">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang phân tích dữ liệu tập luyện...
        </div>
      )}

      {!loading && progress && (
        <>
          {/* FitFuel AI Engine Recommendation Panel — driven by real backend diagnosis */}
          <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden shadow-lg bg-white">
            <div className="px-5 py-4 border-b border-[#18181B]/10 flex items-center justify-between bg-gradient-to-r from-orange-500/5 to-transparent">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#FF5722]" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#18181B]">FitFuel AI Engine</h4>
                  <p className="text-[10px] text-[#FF5722] font-black uppercase tracking-wider">
                    Mô hình phân tích tiến độ & Plateau ({progress.meta?.model_version || 'RE-3'})
                  </p>
                </div>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className={`flex items-start gap-3 border rounded-xl p-4 ${sev.box}`}>
                <SevIcon className={`w-5 h-5 shrink-0 mt-0.5 ${sev.iconColor}`} />
                <div>
                  <h5 className={`font-extrabold text-xs uppercase tracking-wider mb-1 ${sev.titleColor}`}>{diag?.title}</h5>
                  <p className="text-xs text-[#18181B]/80 leading-relaxed">{diag?.detail}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-[#18181B]/40 font-medium">
                    {progress.meta?.avg_rpe_recent != null && <span>RPE 14 ngày: {progress.meta.avg_rpe_recent}/10</span>}
                    <span>Buổi tập 14 ngày: {progress.meta?.sessions_last_14_days ?? 0}</span>
                    {progress.meta?.days_since_last_pr != null && <span>Ngày kể từ PR: {progress.meta.days_since_last_pr}</span>}
                  </div>
                </div>
              </div>

              {progress.actions?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {progress.actions.map(a => (
                    <button
                      key={a.id}
                      disabled={actionLoading === a.id}
                      onClick={() => handleAction(a.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                        PRIMARY_ACTION_IDS.has(a.id)
                          ? 'bg-[#FF5722] text-white hover:bg-[#FF5722]/90'
                          : a.id === 'keep_plan'
                          ? 'border border-[#18181B]/10 text-[#18181B]/60 hover:text-[#18181B] hover:bg-slate-50'
                          : 'bg-[#18181B] text-white hover:bg-black'
                      }`}
                    >
                      {actionLoading === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (PRIMARY_ACTION_IDS.has(a.id) && <Sparkles className="w-3.5 h-3.5" />)}
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {actionMsg && (
                <div className="text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  {actionMsg}
                </div>
              )}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Max Weight', value: `${progress.stats.max_weight}${progress.unit}`, color },
              { label: 'Progress', value: `${progress.stats.progress_pct >= 0 ? '+' : ''}${progress.stats.progress_pct}%`, color: '#FF5722' },
              { label: 'Sessions', value: progress.stats.sessions, color: '#71717a' },
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
              {history.length > 0 && (
                <span className="text-xs text-[#18181B]/40">{history[0].date} – {history[history.length - 1].date}</span>
              )}
            </div>
            {history.length >= 2 ? (
              <LineChart data={history} color={color} unit={progress.unit} />
            ) : (
              <p className="text-xs text-[#18181B]/40 text-center py-6">Cần thêm buổi tập để vẽ biểu đồ xu hướng.</p>
            )}
          </div>

          {/* Session log table */}
          <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-[#18181B]/10">
              <h3 className="font-semibold text-[#18181B] text-sm">Session Log</h3>
            </div>
            <div className="divide-y divide-[#18181B]/6">
              {[...history].reverse().slice(0, 8).map((d, i, arr) => {
                const prevWeight = arr[i + 1]?.max_weight;
                const delta = prevWeight != null ? d.max_weight - prevWeight : 0;
                return (
                  <div key={d.date} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Dumbbell className="w-3.5 h-3.5 text-[#18181B]/40 shrink-0" />
                      <span className="text-sm text-[#18181B]/80">{d.date}</span>
                      {d.is_pr && <span className="text-[9px] font-black text-[#FF5722] bg-[#FF5722]/10 rounded px-1.5 py-0.5">PR</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[#18181B]">{d.max_weight}{progress.unit}</span>
                      {delta !== 0 && (
                        <span className={`text-xs font-medium ${delta > 0 ? 'text-[#FF5722]' : 'text-red-400'}`}>
                          {delta > 0 ? '+' : ''}{delta}{progress.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
