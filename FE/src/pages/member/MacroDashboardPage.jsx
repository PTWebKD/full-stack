import { useState, useEffect } from 'react';
import { Plus, Utensils, Zap, Target, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

const TARGET = { calories: 2400, protein: 180, carbs: 250, fat: 70 };

const macroColors = { protein: '#3b82f6', carbs: '#FF5722', fat: '#a855f7', calories: '#FF5722' };

function MacroRing({ label, current, target, color }) {
  const pct = Math.min((current / target) * 100, 100);
  const r = 28, circ = 2 * Math.PI * r;
  const stroke = circ * (1 - pct / 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={stroke} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#18181B]">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#18181B] mt-1">{current}<span className="text-[#18181B]/40 font-normal">/{target}</span></p>
      <p className="text-xs text-[#18181B]/60">{label}</p>
    </div>
  );
}

export default function MacroDashboardPage() {
  const [log, setLog] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [foodOptions, setFoodOptions] = useState([]);

  useEffect(() => {
    api.get('/api/food/products')
      .then(data => setFoodOptions(Array.isArray(data) ? data.slice(0, 20) : []))
      .catch(() => {});
  }, []);

  const consumed = {
    calories: log.reduce((s, i) => s + (i.calories || 0) * i.qty, 0),
    protein: log.reduce((s, i) => s + Number(i.protein_g || 0) * i.qty, 0),
    carbs: log.reduce((s, i) => s + Number(i.carb_g || 0) * i.qty, 0),
    fat: log.reduce((s, i) => s + Number(i.fat_g || 0) * i.qty, 0),
  };

  const remaining = {
    calories: Math.max(0, TARGET.calories - consumed.calories),
    protein: Math.max(0, TARGET.protein - consumed.protein),
  };

  const addFood = (item) => {
    setLog(prev => [...prev, {
      ...item,
      qty: 1,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      mealType: 'Thêm'
    }]);
    setShowAdd(false);
  };

  const mealGroups = log.reduce((acc, item) => {
    if (!acc[item.mealType]) acc[item.mealType] = [];
    acc[item.mealType].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#18181B] flex items-center gap-2">
          <Target className="w-5 h-5 text-[#FF5722]" /> Macro hôm nay
        </h2>
        <p className="text-xs text-[#18181B]/40">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Calorie ring (big) */}
      <div className="glass rounded-2xl p-6 border border-[#18181B]/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-4xl font-black text-[#18181B]">{consumed.calories.toLocaleString()}</p>
            <p className="text-sm text-[#18181B]/60">/ {TARGET.calories.toLocaleString()} kcal mục tiêu</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#FF5722]">{remaining.calories.toLocaleString()}</p>
            <p className="text-xs text-[#18181B]/60">kcal còn lại</p>
          </div>
        </div>
        <div className="h-3 rounded-full bg-white overflow-hidden mb-1">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF5722] transition-all duration-500"
            style={{ width: `${Math.min((consumed.calories / TARGET.calories) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-[#18181B]/25 text-right">{Math.round((consumed.calories / TARGET.calories) * 100)}%</p>
      </div>

      {/* Macro rings */}
      <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
        <div className="flex items-center justify-around">
          <MacroRing label="Protein" current={Math.round(consumed.protein)} target={TARGET.protein} color={macroColors.protein} />
          <MacroRing label="Carbs" current={Math.round(consumed.carbs)} target={TARGET.carbs} color={macroColors.carbs} />
          <MacroRing label="Fat" current={Math.round(consumed.fat)} target={TARGET.fat} color={macroColors.fat} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: 'Còn thiếu Protein', value: `${Math.round(remaining.protein)}g`, color: macroColors.protein },
            { label: 'Carbs đã nạp', value: `${Math.round(consumed.carbs)}g`, color: macroColors.carbs },
            { label: 'Fat trong ngày', value: `${Math.round(consumed.fat)}g`, color: macroColors.fat },
          ].map(s => (
            <div key={s.label} className="text-center p-2 rounded-xl" style={{ background: `${s.color}08` }}>
              <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-[#18181B]/40 leading-tight mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meal log */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18181B]/10">
          <h3 className="font-semibold text-[#18181B] flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#FF5722]" /> Nhật ký bữa ăn
          </h3>
          <button onClick={() => setShowAdd(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5722] text-white text-xs font-bold hover:bg-[#FF5722]/90 transition-colors shadow-sm">
            <Plus className="w-3 h-3" /> Thêm
          </button>
        </div>

        {showAdd && (
          <div className="px-5 py-4 border-b border-[#18181B]/10 bg-white/[0.02]">
            <p className="text-xs text-[#18181B]/40 mb-3">Chọn nhanh từ Food Hub:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {foodOptions.map(f => (
                <button key={f.product_id} onClick={() => addFood(f)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white transition-colors text-left">
                  <img src={f.images?.[0]} alt={f.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#18181B] truncate">{f.name}</p>
                    <p className="text-xs text-[#18181B]/40">{f.calories} kcal · {Number(f.protein_g || 0)}g P</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-[#FF5722]/50 shrink-0" />
                </button>
              ))}
              {foodOptions.length === 0 && (
                <p className="text-xs text-[#18181B]/40 text-center py-4">Đang tải thực phẩm...</p>
              )}
            </div>
          </div>
        )}

        <div className="divide-y divide-[#18181B]/6">
          {Object.entries(mealGroups).map(([meal, items]) => (
            <div key={meal}>
              <div className="px-5 py-2 bg-white/[0.01]">
                <span className="text-xs font-semibold text-[#18181B]/40 uppercase tracking-wider">{meal}</span>
              </div>
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <img src={item.images?.[0]} alt={item.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#18181B] truncate">{item.name}</p>
                    <p className="text-xs text-[#18181B]/40">{item.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#18181B]">{(item.calories || 0) * item.qty} kcal</p>
                    <p className="text-xs text-[#FF5722]">{(Number(item.protein_g || 0) * item.qty).toFixed(0)}g P</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          {log.length === 0 && (
            <div className="px-5 py-8 text-center text-[#18181B]/40 text-sm">
              Chưa có món nào hôm nay. Nhấn Thêm để ghi nhận.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
