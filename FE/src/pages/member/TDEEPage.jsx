import { useState } from 'react';
import { Calculator, Zap, Target, TrendingUp } from 'lucide-react';

const activityLevels = [
  { id: 1.2, label: 'Ít vận động', desc: 'Ít hoặc không tập, ngồi nhiều' },
  { id: 1.375, label: 'Nhẹ', desc: 'Tập 1–3 buổi/tuần' },
  { id: 1.55, label: 'Vừa phải', desc: 'Tập 3–5 buổi/tuần' },
  { id: 1.725, label: 'Cao', desc: 'Tập 6–7 buổi/tuần' },
  { id: 1.9, label: 'Rất cao', desc: 'Tập 2 lần/ngày' },
];

const goals = [
  { id: 'cut', label: 'Giảm mỡ', adjust: -500, color: '#00d4ff' },
  { id: 'maintain', label: 'Duy trì', adjust: 0, color: '#003a5a' },
  { id: 'bulk', label: 'Tăng cơ', adjust: 300, color: '#f97316' },
];

export default function TDEEPage() {
  const [form, setForm] = useState({ gender: 'male', age: '', height: '', weight: '', activity: 1.55 });
  const [result, setResult] = useState(null);
  const [goal, setGoal] = useState('maintain');

  const calculate = (e) => {
    e.preventDefault();
    const { gender, age, height, weight, activity } = form;
    // Mifflin-St Jeor
    let bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
    const tdee = Math.round(bmr * activity);
    const adj = goals.find(g => g.id === goal)?.adjust || 0;
    setResult({
      bmr: Math.round(bmr),
      tdee,
      target: tdee + adj,
      protein: Math.round(weight * 2.2),
      carbs: Math.round((tdee + adj - weight * 2.2 * 4 - weight * 1 * 9) / 4),
      fat: Math.round(weight * 1),
    });
  };

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Calculator className="w-5 h-5 text-[#00d4ff]" /> Tính TDEE & Macro
      </h2>
      <p className="text-sm text-white/40">TDEE (Total Daily Energy Expenditure) — lượng calo bạn đốt mỗi ngày dựa trên thể trạng và mức độ vận động.</p>

      <form onSubmit={calculate} className="glass rounded-2xl p-6 border border-white/5 space-y-5">
        {/* Gender */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Giới tính</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ id: 'male', label: 'Nam' }, { id: 'female', label: 'Nữ' }].map(g => (
              <button key={g.id} type="button" onClick={() => setForm(p => ({ ...p, gender: g.id }))}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${form.gender === g.id ? 'border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Measurements */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'age', label: 'Tuổi', placeholder: '25', unit: 'tuổi' },
            { key: 'height', label: 'Chiều cao', placeholder: '175', unit: 'cm' },
            { key: 'weight', label: 'Cân nặng', placeholder: '70', unit: 'kg' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-white/40 mb-1.5">{f.label}</label>
              <div className="relative">
                <input type="number" required value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#00d4ff]/50 text-sm pr-10"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/25">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Mức độ vận động</label>
          <div className="space-y-2">
            {activityLevels.map(a => (
              <label key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.activity === a.id ? 'border-[#00d4ff]/40 bg-[#00d4ff]/5' : 'border-white/5 hover:border-white/10'}`}>
                <input type="radio" name="activity" checked={form.activity === a.id} onChange={() => setForm(p => ({ ...p, activity: a.id }))} className="sr-only" />
                <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${form.activity === a.id ? 'border-[#00d4ff] bg-[#00d4ff]' : 'border-white/20'}`} />
                <div>
                  <p className="text-sm font-medium text-white">{a.label}</p>
                  <p className="text-xs text-white/30">{a.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-xs text-white/40 mb-2">Mục tiêu</label>
          <div className="grid grid-cols-3 gap-2">
            {goals.map(g => (
              <button key={g.id} type="button" onClick={() => setGoal(g.id)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${goal === g.id ? 'border-current' : 'border-white/10 text-white/50 hover:border-white/20'}`}
                style={goal === g.id ? { color: g.color, borderColor: `${g.color}50`, background: `${g.color}10` } : {}}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <button type="submit"
          className="w-full py-3 rounded-xl bg-[#00d4ff] text-black font-bold text-sm hover:bg-[#00d4ff]/90 transition-colors flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" /> Tính ngay
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="glass rounded-2xl border border-[#00d4ff]/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-[#00d4ff]/5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00d4ff]" /> Kết quả của bạn
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'BMR (nghỉ ngơi)', value: result.bmr, unit: 'kcal', color: '#6b7280' },
                { label: 'TDEE (duy trì)', value: result.tdee, unit: 'kcal', color: '#00d4ff' },
                { label: 'Mục tiêu của bạn', value: result.target, unit: 'kcal/ngày', color: goals.find(g => g.id === goal)?.color },
              ].map(s => (
                <div key={s.label} className="text-center glass rounded-xl p-4 border border-white/5">
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
                  <p className="text-xs text-white/30 mt-0.5">{s.unit}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Macro split */}
            <div>
              <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wider">Macro khuyến nghị / ngày</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Protein', value: result.protein, unit: 'g', color: '#003a5a', desc: `${result.protein * 4} kcal` },
                  { label: 'Carbs', value: Math.max(0, result.carbs), unit: 'g', color: '#f97316', desc: `${Math.max(0, result.carbs) * 4} kcal` },
                  { label: 'Fat', value: result.fat, unit: 'g', color: '#a855f7', desc: `${result.fat * 9} kcal` },
                ].map(m => (
                  <div key={m.label} className="rounded-xl p-4 border border-white/5 text-center" style={{ background: `${m.color}08` }}>
                    <p className="text-xl font-black" style={{ color: m.color }}>{m.value}<span className="text-xs ml-0.5 font-normal text-white/40">{m.unit}</span></p>
                    <p className="text-xs font-medium text-white mt-0.5">{m.label}</p>
                    <p className="text-xs text-white/30 mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro bar */}
            <div className="mt-4 h-3 rounded-full overflow-hidden flex gap-0.5">
              {[
                { color: '#003a5a', w: (result.protein * 4 / result.target) * 100 },
                { color: '#f97316', w: (Math.max(0, result.carbs) * 4 / result.target) * 100 },
                { color: '#a855f7', w: (result.fat * 9 / result.target) * 100 },
              ].map((b, i) => (
                <div key={i} className="rounded-full" style={{ width: `${b.w}%`, background: b.color }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
