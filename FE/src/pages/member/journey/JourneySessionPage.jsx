import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Plus, Trash2, X, Loader2, Clock, CheckCircle, Flame, Calendar, Award } from 'lucide-react';
import { api } from '../../../services/api';
import AiFoodSuggestion from '../../../components/common/AiFoodSuggestion';

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

  // step: 'select' | 'loading' | 'edit' | 'confirming' | 'active' | 'done'
  const [step, setStep] = useState('select');
  const [selected, setSelected] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [originalNames, setOriginalNames] = useState([]);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Program-based workout state
  const [activeProg, setActiveProg] = useState(null);
  const [progProgress, setProgProgress] = useState(null);

  // Active workout states
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [completedSets, setCompletedSets] = useState({}); // 'exIdx-setIdx': boolean
  const [finishedData, setFinishedData] = useState(null);
  const [finishing, setFinishing] = useState(false);

  // Timer effect
  useEffect(() => {
    if (step !== 'active' || !startTime) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, startTime]);

  // Load active program from localStorage on mount
  useEffect(() => {
    try {
      const prog = localStorage.getItem('fitfuel_active_program');
      const progress = localStorage.getItem('fitfuel_program_progress');
      if (prog) setActiveProg(JSON.parse(prog));
      if (progress) setProgProgress(JSON.parse(progress));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getCurrentProgDay = () => {
    if (!activeProg || !progProgress) return null;
    const daysCount = activeProg.schedule.length;
    const idx = (progProgress.day - 1) % daysCount;
    return activeProg.schedule[idx];
  };

  // ── Step 1 → 2: generate ──────────────────────────────────────────
  const handleGenerate = async (muscleGroupOverride = null) => {
    const targetMuscle = muscleGroupOverride || selected;
    if (!targetMuscle) return;
    setStep('loading');
    setError('');
    try {
      const data = await api.post('/api/gym/sessions/generate', {
        muscle_group: targetMuscle,
        date: new Date().toISOString().split('T')[0],
      });
      const stamped = (data.suggested_exercises || []).map((ex, i) => ({
        ...ex,
        _id: i,
        _modified: false,
      }));
      setExercises(stamped);
      setOriginalNames(stamped.map(ex => ex.exercise_name));
      if (muscleGroupOverride) {
        setSelected(muscleGroupOverride);
      }
      setStep('edit');
    } catch (e) {
      setError(e.message || 'Không thể tạo buổi tập, vui lòng thử lại');
      setStep('select');
    }
  };

  // ── Step 3 → active ──────────────────────────────────────────────
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
        notes: MG_LABEL[selected] || selected,
        muscle_group: selected,
        member_program_id: null,
        program_day_id: null,
        exercises: exercises.map(ex => ({
          exercise_name: ex.exercise_name,
          muscle_group: ex.muscle_group,
          sets: ex.sets.map(s => ({ reps: Number(s.reps), weight: Number(s.weight) })),
          overload_suggestion: ex.overload_suggestion || null,
          was_modified: ex._modified,
        })),
        customization_log,
      });
      
      setSessionId(result.session_id);
      setStartTime(Date.now());
      setElapsed(0);
      setCompletedSets({});
      setStep('active');
    } catch (e) {
      setError(e.message || 'Xác nhận thất bại, vui lòng thử lại');
      setStep('edit');
    }
  };

  // ── Step 4 → complete ─────────────────────────────────────────────
  const handleFinishWorkout = async () => {
    if (!sessionId) return;
    setFinishing(true);
    setError('');
    try {
      const res = await api.post(`/api/gym/sessions/${sessionId}/complete`, {});
      setFinishedData(res);

      // Auto-increment program progress if completed the scheduled workout
      if (activeProg && progProgress) {
        const currentDay = getCurrentProgDay();
        if (currentDay && selected === currentDay.muscle_group) {
          let newDay = progProgress.day + 1;
          let newWeek = progProgress.week;
          const daysCount = activeProg.schedule.length;

          // If we completed all days in the schedule for the week, advance to next week
          if ((progProgress.day % daysCount) === 0) {
            newWeek += 1;
          }

          if (newWeek > activeProg.duration_weeks) {
            localStorage.removeItem('fitfuel_active_program');
            localStorage.removeItem('fitfuel_program_progress');
          } else {
            localStorage.setItem('fitfuel_program_progress', JSON.stringify({ week: newWeek, day: newDay }));
          }
        }
      }

      setStep('done');
    } catch (e) {
      setError(e.message || 'Không thể lưu kết quả, vui lòng thử lại');
    } finally {
      setFinishing(false);
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

  // Toggle set checkbox in active mode
  const toggleSetComplete = (exIdx, setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Renders ────────────────────────────────────────────────────────
  if (step === 'select') {
    const currentDay = getCurrentProgDay();
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-2 font-black">Bước 1</p>
          <h1 className="text-2xl font-black text-[#18181B] mb-2 font-black">Hôm nay tập nhóm cơ nào?</h1>
          <p className="text-[#18181B]/60 text-sm">Chọn nhóm cơ hoặc tập theo lộ trình đang học</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Active Program Recommendation */}
        {activeProg && currentDay && (
          <div className="mb-6 glass rounded-2xl p-5 border border-[#FF5722]/30 bg-gradient-to-br from-[#FF5722]/10 to-transparent">
            <p className="text-[10px] text-[#FF5722] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Lộ trình học tiếp theo
            </p>
            <h3 className="font-black text-[#18181B] text-base">{activeProg.name}</h3>
            <p className="text-xs font-bold text-[#FF5722] mt-0.5">
              Tuần {progProgress.week}, {currentDay.title} ({MG_LABEL[currentDay.muscle_group]})
            </p>
            <p className="text-[11px] text-[#18181B]/60 mt-1">{currentDay.desc}</p>
            
            <button 
              onClick={() => handleGenerate(currentDay.muscle_group)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-[#FF5722] text-white hover:bg-[#FF5722]/90 transition-all shadow-[0_0_15px_rgba(255,87,34,0.2)]">
              <Zap className="w-4 h-4 animate-pulse" /> TẬP THEO CHƯƠNG TRÌNH NGAY
            </button>
          </div>
        )}

        <div className="mb-3">
          <p className="text-xs text-[#18181B]/40 font-bold uppercase tracking-wider">
            {activeProg ? 'Hoặc chọn nhóm cơ khác' : 'Chọn nhóm cơ để tập'}
          </p>
        </div>

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

        <button onClick={() => handleGenerate()} disabled={!selected}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
          <Zap className="w-5 h-5" />
          Tạo buổi tập tự chọn
        </button>
        <p className="text-center text-xs text-[#18181B]/25 mt-4">Bạn có thể tuỳ chỉnh danh sách bài tập sau khi xem đề xuất</p>
      </div>
    );
  }

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
          <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-1 font-black">Bước 2: Thiết lập lịch tập</p>
          <h1 className="text-xl font-black text-[#18181B]">{MG_LABEL[selected] || selected}</h1>
        </div>
        <button onClick={() => setStep('select')} className="text-xs text-[#18181B]/40 hover:text-[#18181B] transition font-bold">
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
                  <p className="text-xs text-green-600 mt-0.5 font-semibold">↑ {ex.overload_suggestion.note}</p>
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
              className="mt-2 text-xs text-[#FF5722]/70 hover:text-[#FF5722] flex items-center gap-1 transition font-bold">
              <Plus className="w-3 h-3" /> Thêm set
            </button>
          </div>
        ))}
      </div>

      <button onClick={openAddModal}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-[#18181B]/20 text-[#18181B]/50 hover:border-[#FF5722]/40 hover:text-[#FF5722] transition flex items-center justify-center gap-2 text-sm font-bold mb-4">
        <Plus className="w-4 h-4" /> Thêm bài tập
      </button>

      <button onClick={handleConfirm} disabled={exercises.length === 0 || step === 'confirming'}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        {step === 'confirming' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Đang chuẩn bị...</>
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
                    <p className="font-semibold text-[#18181B] text-sm">{tmpl.exercise_name}</p>
                    <p className="text-xs text-[#18181B]/40 font-medium">{tmpl.default_sets}×{tmpl.default_reps} · {tmpl.equipment}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (step === 'active') return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Header and Timer */}
      <div className="glass rounded-3xl p-6 border border-[#FF5722]/20 bg-gradient-to-br from-[#FF5722]/10 to-transparent flex items-center justify-between">
        <div>
          <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-1 font-black flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Buổi tập đang diễn ra
          </p>
          <h1 className="text-xl font-black text-[#18181B]">{MG_LABEL[selected] || selected}</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#18181B]/5 border border-[#18181B]/10 text-[#18181B]/80 text-sm font-bold">
          <Clock className="w-4 h-4 text-[#FF5722]" />
          <span>{formatTime(elapsed)}</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Exercise Checklist */}
      <div className="space-y-4">
        {exercises.map((ex, exIdx) => (
          <div key={ex._id ?? exIdx} className="glass rounded-2xl p-4 border border-[#18181B]/10">
            <div className="mb-3">
              <p className="font-bold text-[#18181B] text-sm">{ex.exercise_name}</p>
              <p className="text-xs text-[#18181B]/40 font-semibold">{ex.muscle_group}</p>
            </div>

            <div className="space-y-2">
              {ex.sets.map((set, setIdx) => {
                const isCompleted = completedSets[`${exIdx}-${setIdx}`];
                return (
                  <div key={setIdx} 
                    onClick={() => toggleSetComplete(exIdx, setIdx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${isCompleted ? 'bg-[#22c55e]/10 border-[#22c55e]/30' : 'bg-white/5 hover:bg-white/10 border-transparent'}`}>
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`font-semibold ${isCompleted ? 'text-[#22c55e]' : 'text-[#18181B]/60'}`}>Set {setIdx + 1}</span>
                      <span className={`font-bold ${isCompleted ? 'line-through text-[#18181B]/30' : 'text-[#18181B]'}`}>
                        {set.reps} reps × {set.weight} kg
                      </span>
                    </div>
                    
                    <button 
                      type="button"
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${isCompleted ? 'bg-[#22c55e] border-[#22c55e] text-white' : 'border-[#18181B]/20 text-transparent hover:border-[#FF5722]'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Complete Button */}
      <button onClick={handleFinishWorkout} disabled={finishing}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.3)]">
        {finishing ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Đang hoàn tất...</>
        ) : (
          <><CheckCircle className="w-5 h-5" /> KẾT THÚC BUỔI TẬP</>
        )}
      </button>
    </div>
  );

  if (step === 'done' && finishedData) {
    return (
      <AiFoodSuggestion
        sessionId={sessionId}
        sessionName={MG_LABEL[selected] || selected}
        xpEarned={finishedData.xp_earned}
        newStreak={finishedData.new_streak}
        badgesEarned={finishedData.badges_earned}
        exercises={exercises}
        durationMin={Math.round(elapsed / 60)}
        onClose={() => navigate('/journey')}
      />
    );
  }

  return null;
}
