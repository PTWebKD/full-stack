import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Ngực', emoji: '💪', color: '#FF5722' },
  { key: 'back_shoulders', label: 'Lưng + Vai', emoji: '🏋️', color: '#3b82f6' },
  { key: 'legs', label: 'Chân', emoji: '🦵', color: '#a855f7' },
  { key: 'full_body', label: 'Toàn thân', emoji: '⚡', color: '#22c55e' },
  { key: 'arms', label: 'Tay', emoji: '🤜', color: '#fbbf24' },
  { key: 'custom', label: 'Tự chọn', emoji: '🎯', color: '#ec4899' },
];

const MG_LABEL = Object.fromEntries(MUSCLE_GROUPS.map(m => [m.key, m.label]));

export default function JourneySessionPage() {
  const navigate = useNavigate();

  // step: 'select' | 'loading' | 'edit' | 'confirming'
  const [step, setStep] = useState('select');
  const [selected, setSelected] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [originalNames, setOriginalNames] = useState([]);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  // ── Step 1 → 2: generate ──────────────────────────────────────────
  const handleGenerate = async () => {
    if (!selected) return;
    setStep('loading');
    setError('');
    try {
      const data = await api.post('/api/gym/sessions/generate', {
        muscle_group: selected,
        date: new Date().toISOString().split('T')[0],
      });
      const stamped = (data.suggested_exercises || []).map((ex, i) => ({
        ...ex,
        _id: i,
        _modified: false,
      }));
      setExercises(stamped);
      setOriginalNames(stamped.map(ex => ex.exercise_name));
      setStep('edit');
    } catch (e) {
      setError(e.message || 'Không thể tạo buổi tập, vui lòng thử lại');
      setStep('select');
    }
  };

  // ── Step 3 → confirm ──────────────────────────────────────────────
  const handleConfirm = async () => {
    if (exercises.length === 0) return;
    setStep('confirming');
    setError('');

    const origSet = new Set(originalNames);
    const currSet = new Set(exercises.map(ex => ex.exercise_name));
    const customization_log = {
      added: exercises.filter(ex => !origSet.has(ex.exercise_name)).map(ex => ex.exercise_name),
      removed: originalNames.filter(n => !currSet.has(n)),
      modified: exercises
        .filter(ex => ex._modified && origSet.has(ex.exercise_name))
        .map(ex => ({ exercise: ex.exercise_name, change: 'sets modified' })),
    };

    try {
      const result = await api.post('/api/gym/sessions/confirm', {
        date: new Date().toISOString().split('T')[0],
        notes: selected,
        muscle_group: selected,
        member_program_id: null,
        program_day_id: null,
        exercises: exercises.map(ex => ({
          exercise_name: ex.exercise_name,
          muscle_group: ex.muscle_group,
          sets: ex.sets,
          overload_suggestion: ex.overload_suggestion || null,
          was_modified: ex._modified,
        })),
        customization_log,
      });
      navigate(`/journey?session=${result.session_id}`);
    } catch (e) {
      setError(e.message || 'Xác nhận thất bại, vui lòng thử lại');
      setStep('edit');
    }
  };

  // ── Exercise editing helpers ───────────────────────────────────────
  const updateSet = (exIdx, setIdx, field, raw) => {
    const value = parseFloat(raw) || 0;
    setExercises(prev => prev.map((ex, i) =>
      i !== exIdx ? ex : {
        ...ex,
        _modified: true,
        sets: ex.sets.map((s, j) => j !== setIdx ? s : { ...s, [field]: value }),
      }
    ));
  };

  const addSet = (exIdx) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx) return ex;
      const last = ex.sets[ex.sets.length - 1] || { reps: 10, weight: 0 };
      return { ...ex, _modified: true, sets: [...ex.sets, { ...last }] };
    }));
  };

  const removeSet = (exIdx, setIdx) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== exIdx || ex.sets.length <= 1) return ex;
      return { ...ex, _modified: true, sets: ex.sets.filter((_, j) => j !== setIdx) };
    }));
  };

  const removeExercise = (exIdx) => {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  };

  const openAddModal = async () => {
    try {
      const data = await api.get(`/api/gym/exercise-templates?muscle_group=${selected}`);
      const existing = new Set(exercises.map(ex => ex.exercise_name));
      setTemplates((data || []).filter(t => !existing.has(t.exercise_name)));
      setShowAddModal(true);
    } catch {
      setTemplates([]);
      setShowAddModal(true);
    }
  };

  const addFromTemplate = (tmpl) => {
    setExercises(prev => [...prev, {
      exercise_name: tmpl.exercise_name,
      muscle_group: tmpl.muscle_group,
      sets: Array.from({ length: tmpl.default_sets }, () => ({
        reps: tmpl.default_reps,
        weight: tmpl.default_weight_kg,
      })),
      overload_suggestion: null,
      _id: Date.now(),
      _modified: false,
    }]);
    setShowAddModal(false);
  };

  // ── Renders ────────────────────────────────────────────────────────
  if (step === 'select') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-2">Bước 1</p>
        <h1 className="text-2xl font-black text-[#18181B] mb-2">Hôm nay tập nhóm cơ nào?</h1>
        <p className="text-[#18181B]/60 text-sm">Chọn nhóm cơ — AI sẽ tạo buổi tập hoàn chỉnh cho bạn</p>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <div className="grid grid-cols-2 gap-3 mb-8">
        {MUSCLE_GROUPS.map(mg => (
          <button key={mg.key} onClick={() => setSelected(mg.key)}
            className={`glass rounded-2xl p-5 border text-left transition-all ${selected === mg.key ? 'border-[#FF5722]/60 shadow-[0_0_20px_rgba(255,87,34,0.15)]' : 'border-[#18181B]/10 hover:border-[#18181B]/20'}`}>
            <div className="text-3xl mb-2">{mg.emoji}</div>
            <p className="font-bold text-[#18181B] text-sm">{mg.label}</p>
            {selected === mg.key && (
              <div className="mt-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: mg.color }}>
                <ChevronRight className="w-2.5 h-2.5 text-black" />
              </div>
            )}
          </button>
        ))}
      </div>

      <button onClick={handleGenerate} disabled={!selected}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        <Zap className="w-5 h-5" />
        Tạo buổi tập
      </button>
      <p className="text-center text-xs text-[#18181B]/25 mt-4">Bạn có thể tuỳ chỉnh danh sách bài tập sau khi xem đề xuất</p>
    </div>
  );

  if (step === 'loading') return (
    <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-[#FF5722] animate-spin" />
      <p className="text-[#18181B]/60 text-sm">Đang phân tích lịch sử tập luyện...</p>
    </div>
  );

  if (step === 'edit' || step === 'confirming') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-1">Buổi tập AI</p>
          <h1 className="text-xl font-black text-[#18181B]">{MG_LABEL[selected] || selected}</h1>
        </div>
        <button onClick={() => setStep('select')} className="text-xs text-[#18181B]/40 hover:text-[#18181B] transition">
          ← Đổi nhóm cơ
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4 mb-6">
        {exercises.map((ex, exIdx) => (
          <div key={ex._id ?? exIdx} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#18181B] text-sm">{ex.exercise_name}</p>
                {ex.overload_suggestion?.note && (
                  <p className="text-xs text-green-600 mt-0.5">↑ {ex.overload_suggestion.note}</p>
                )}
              </div>
              <button onClick={() => removeExercise(exIdx)}
                className="text-[#18181B]/30 hover:text-red-500 transition ml-2 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {ex.sets.map((set, setIdx) => (
                <div key={setIdx} className="flex items-center gap-2 text-sm">
                  <span className="text-[#18181B]/40 w-12 shrink-0">Set {setIdx + 1}</span>
                  <input
                    type="number"
                    value={set.reps}
                    min="1"
                    onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    className="w-16 text-center border border-[#18181B]/20 rounded-lg py-1 text-sm font-bold focus:outline-none focus:border-[#FF5722]"
                  />
                  <span className="text-[#18181B]/40">reps</span>
                  <span className="text-[#18181B]/20">×</span>
                  <input
                    type="number"
                    value={set.weight}
                    min="0"
                    step="0.5"
                    onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    className="w-20 text-center border border-[#18181B]/20 rounded-lg py-1 text-sm font-bold focus:outline-none focus:border-[#FF5722]"
                  />
                  <span className="text-[#18181B]/40">kg</span>
                  {ex.sets.length > 1 && (
                    <button onClick={() => removeSet(exIdx, setIdx)}
                      className="text-[#18181B]/20 hover:text-red-400 transition ml-auto">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addSet(exIdx)}
              className="mt-2 text-xs text-[#FF5722]/70 hover:text-[#FF5722] flex items-center gap-1 transition">
              <Plus className="w-3 h-3" /> Thêm set
            </button>
          </div>
        ))}
      </div>

      <button onClick={openAddModal}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#18181B]/20 text-[#18181B]/50 hover:border-[#FF5722]/40 hover:text-[#FF5722] transition flex items-center justify-center gap-2 text-sm font-medium mb-4">
        <Plus className="w-4 h-4" /> Thêm bài tập
      </button>

      <button onClick={handleConfirm} disabled={exercises.length === 0 || step === 'confirming'}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        {step === 'confirming' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
        ) : (
          <><Zap className="w-5 h-5" /> Bắt đầu buổi tập ({exercises.length} bài)</>
        )}
      </button>

      {/* Add exercise modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[70vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#18181B]">Thêm bài tập</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-[#18181B]/40" /></button>
            </div>
            {templates.length === 0 ? (
              <p className="text-[#18181B]/50 text-sm text-center py-4">Không có bài tập nào khác trong danh mục này</p>
            ) : (
              <div className="space-y-2">
                {templates.map(tmpl => (
                  <button key={tmpl.exercise_template_id} onClick={() => addFromTemplate(tmpl)}
                    className="w-full text-left p-3 rounded-xl border border-[#18181B]/10 hover:border-[#FF5722]/40 transition">
                    <p className="font-medium text-[#18181B] text-sm">{tmpl.exercise_name}</p>
                    <p className="text-xs text-[#18181B]/40">{tmpl.default_sets}×{tmpl.default_reps} · {tmpl.equipment}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
