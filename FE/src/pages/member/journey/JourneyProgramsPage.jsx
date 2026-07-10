import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight, X, Calendar, Award, Compass, CheckCircle, BrainCircuit, Clock, Target, AlertTriangle, ArrowLeft } from 'lucide-react';
import { buildProfile, riskyGroupsForProfile, riskySessionCount, groupPrograms } from './programMatching';

const GOAL_LABELS = { muscle_gain: 'Tăng cơ', fat_loss: 'Giảm mỡ', maintain: 'Duy trì', strength: 'Tăng sức mạnh' };
const LEVEL_LABELS = { beginner: 'Mới bắt đầu', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

const MOCK_PROGRAMS = [
  { 
    program_id: 1, 
    name: 'Tăng cơ 3 ngày/tuần', 
    description: 'Chương trình tập trung phát triển cơ bắp toàn thân với lịch 3 buổi/tuần.', 
    goal_type: 'muscle_gain', 
    level: 'beginner', 
    duration_weeks: 8,
    schedule: [
      { day: 1, muscle_group: 'chest', title: 'Buổi 1: Ngực & Tay sau', desc: 'Tập trung phát triển nhóm cơ đẩy (Ngực, Vai, Tay sau)' },
      { day: 2, muscle_group: 'back_shoulders', title: 'Buổi 2: Lưng & Tay trước', desc: 'Tập trung phát triển nhóm cơ kéo (Lưng, Vai sau, Tay trước)' },
      { day: 3, muscle_group: 'legs', title: 'Buổi 3: Chân & Bụng', desc: 'Xây dựng sức mạnh phần thân dưới và cơ trọng tâm' }
    ]
  },
  { 
    program_id: 2, 
    name: 'Đốt mỡ Full Body', 
    description: 'Kết hợp cardio và tập tạ để tối đa hóa lượng calo tiêu thụ mỗi buổi tập.', 
    goal_type: 'fat_loss', 
    level: 'intermediate', 
    duration_weeks: 6,
    schedule: [
      { day: 1, muscle_group: 'full_body', title: 'Buổi 1: HIIT Toàn thân', desc: 'Cardio cường độ cao kết hợp các bài tạ nhẹ liên tục' },
      { day: 2, muscle_group: 'custom', title: 'Buổi 2: Core & Abs', desc: 'Tập trung siết chặt vòng 2 và nâng cao sức bền cốt lõi' },
      { day: 3, muscle_group: 'full_body', title: 'Buổi 3: Full Body Strength', desc: 'Các bài tập compound kích hoạt toàn bộ nhóm cơ lớn' }
    ]
  },
  { 
    program_id: 3, 
    name: 'Nền tảng sức mạnh', 
    description: 'Tập trung vào 3 bài tập nền: Squat, Deadlift, Bench Press để xây dựng nền sức mạnh.', 
    goal_type: 'strength', 
    level: 'intermediate', 
    duration_weeks: 12,
    schedule: [
      { day: 1, muscle_group: 'legs', title: 'Buổi 1: Squat Day (Chân)', desc: 'Xây dựng lực đẩy từ đùi trước và cơ mông' },
      { day: 2, muscle_group: 'chest', title: 'Buổi 2: Bench Press Day (Ngực)', desc: 'Nâng cao sức mạnh cơ ngực, vai trước và tay sau' },
      { day: 3, muscle_group: 'back_shoulders', title: 'Buổi 3: Deadlift Day (Lưng)', desc: 'Tối ưu hóa chuỗi cơ phía sau (Lưng, mông, đùi sau)' }
    ]
  },
  { 
    program_id: 4, 
    name: 'Duy trì & Linh hoạt', 
    description: 'Kết hợp tập tạ nhẹ và yoga để duy trì thể lực và cải thiện tính linh hoạt.', 
    goal_type: 'maintain', 
    level: 'beginner', 
    duration_weeks: 4,
    schedule: [
      { day: 1, muscle_group: 'full_body', title: 'Buổi 1: Mobility & Stretching', desc: 'Gia tăng phạm vi chuyển động của khớp và kéo giãn cơ' },
      { day: 2, muscle_group: 'arms', title: 'Buổi 2: Light Arms & Shoulders', desc: 'Tập tạ nhẹ kích hoạt tuần hoàn máu và làm săn chắc cơ' },
      { day: 3, muscle_group: 'custom', title: 'Buổi 3: Core & Flexibility', desc: 'Bài tập thăng bằng và giữ vững cơ thể' }
    ]
  },
  { 
    program_id: 5, 
    name: 'Tăng cơ nâng cao', 
    description: 'Chương trình 5 ngày/tuần với split cơ chuyên biệt dành cho người đã có nền tảng.', 
    goal_type: 'muscle_gain', 
    level: 'advanced', 
    duration_weeks: 16,
    schedule: [
      { day: 1, muscle_group: 'chest', title: 'Buổi 1: Ngực', desc: 'Tập trung kích thích phì đại sợi cơ ngực' },
      { day: 2, muscle_group: 'back_shoulders', title: 'Buổi 2: Lưng & Cầu vai', desc: 'Tạo độ dày và rộng cho tấm lưng' },
      { day: 3, muscle_group: 'legs', title: 'Buổi 3: Chân', desc: 'Xây dựng cặp đùi mạnh mẽ và săn chắc' },
      { day: 4, muscle_group: 'back_shoulders', title: 'Buổi 4: Vai', desc: 'Tạo hình vai tròn trịa 3D' },
      { day: 5, muscle_group: 'arms', title: 'Buổi 5: Tay', desc: 'Kích nổ cơ tay trước và tay sau' }
    ]
  },
];

export default function JourneyProgramsPage() {
  const [activeProg, setActiveProg] = useState(null);
  const [selectedProg, setSelectedProg] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingAnswers, setOnboardingAnswers] = useState({
    goal: '',
    experience: '',
    daysPerWeek: '',
    duration: '',
    health: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem('fitfuel_goal_onboarded');
      if (!hasOnboarded) {
        setShowOnboarding(true);
      }
      const prog = localStorage.getItem('fitfuel_active_program');
      if (prog) {
        setActiveProg(JSON.parse(prog));
      }
      const savedProfile = localStorage.getItem('fitfuel_goal_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleEnroll = (prog) => {
    try {
      localStorage.setItem('fitfuel_active_program', JSON.stringify(prog));
      localStorage.setItem('fitfuel_program_progress', JSON.stringify({ week: 1, day: 1 }));
      setActiveProg(prog);
      setSuccessMsg(`Đã chọn lịch tập thành công: ${prog.name}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      setSelectedProg(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelEnroll = () => {
    try {
      localStorage.removeItem('fitfuel_active_program');
      localStorage.removeItem('fitfuel_program_progress');
      setActiveProg(null);
      setSuccessMsg('Đã hủy chọn lịch tập.');
      setTimeout(() => setSuccessMsg(''), 3000);
      setSelectedProg(null);
    } catch (e) {
      console.error(e);
    }
  };

  const { recommended, others, isGrouped } = useMemo(
    () => groupPrograms(MOCK_PROGRAMS, profile),
    [profile]
  );

  const modalRiskyGroups = useMemo(
    () => (profile && selectedProg ? riskyGroupsForProfile(profile) : new Set()),
    [profile, selectedProg]
  );

  const renderProgramCard = (p, { muted = false } = {}) => {
    const isActive = activeProg?.program_id === p.program_id;
    const riskyCount = profile ? riskySessionCount(p, profile) : 0;
    return (
      <div key={p.program_id}
        onClick={() => setSelectedProg(p)}
        className={`glass rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] ${muted ? 'opacity-70' : ''} ${isActive ? 'border-green-500/30' : 'border-[#18181B]/10 hover:border-[#FF5722]/20'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#18181B] text-sm">{p.name}</h3>
              {isActive && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-green-500 text-white font-black uppercase">ACTIVE</span>
              )}
            </div>
            <p className="text-xs text-[#18181B]/60 mt-1 line-clamp-2">{p.description}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5722]/10 text-[#FF5722]">{GOAL_LABELS[p.goal_type] || p.goal_type}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{LEVEL_LABELS[p.level] || p.level}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#18181B]/5 text-[#18181B]/60">{p.duration_weeks} tuần</span>
              {riskyCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Có buổi cần lưu ý
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#18181B]/40 mt-1 shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/journey" className="p-2 -ml-2 rounded-xl text-[#18181B]/40 hover:text-[#18181B] hover:bg-[#18181B]/5 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Dumbbell className="w-5 h-5 text-[#FF5722]" />
          <h1 className="text-xl font-black text-[#18181B]">Thư viện chương trình</h1>
        </div>
        <button 
          onClick={() => {
            setOnboardingStep(1);
            setShowOnboarding(true);
          }} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 text-xs font-bold transition-colors cursor-pointer">
          <BrainCircuit className="w-4 h-4" />
          AI Tư vấn
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 font-bold text-sm text-center">
          {successMsg}
        </div>
      )}

      {activeProg && (
        <div className="mb-6 glass rounded-2xl p-5 border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
          <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Lịch tập đang áp dụng
          </p>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-[#18181B] text-base">{activeProg.name}</h3>
              <p className="text-xs text-[#18181B]/60 mt-1 line-clamp-2">{activeProg.description}</p>
            </div>
            <button 
              onClick={() => {
                const fullProg = MOCK_PROGRAMS.find(p => p.program_id === activeProg.program_id);
                setSelectedProg(fullProg || activeProg);
              }}
              className="text-xs text-[#FF5722] hover:underline font-bold shrink-0 ml-4 mt-1">
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {isGrouped ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-xs font-black text-[#18181B]/50 uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-[#FF5722]" /> Đề xuất cho bạn
            </h2>
            <div className="space-y-3">
              {recommended.map(p => renderProgramCard(p))}
            </div>
          </div>
          {others.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#18181B]/50 uppercase tracking-widest">Chương trình khác</h2>
              <div className="space-y-3">
                {others.map(p => renderProgramCard(p, { muted: true }))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_PROGRAMS.map(p => renderProgramCard(p))}
        </div>
      )}

      {/* Program Detail Modal */}
      {selectedProg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setSelectedProg(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#18181B]/10 flex items-center justify-between bg-gradient-to-r from-[#FF5722]/5 to-transparent">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FF5722]" />
                <h3 className="font-black text-[#18181B] text-base">Chi tiết chương trình</h3>
              </div>
              <button onClick={() => setSelectedProg(null)} className="text-[#18181B]/40 hover:text-[#18181B] p-1 rounded-full hover:bg-black/5 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#18181B]">{selectedProg.name}</h2>
                <p className="text-xs text-[#18181B]/60 mt-1">{selectedProg.description}</p>
              </div>

              {/* Tags */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#18181B]/5 border border-[#18181B]/5">
                  <Award className="w-4 h-4 text-[#FF5722] mx-auto mb-1" />
                  <p className="text-[10px] text-[#18181B]/40 font-bold">Mục tiêu</p>
                  <p className="text-xs font-black text-[#18181B] mt-0.5">{GOAL_LABELS[selectedProg.goal_type] || selectedProg.goal_type}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181B]/5 border border-[#18181B]/5">
                  <Compass className="w-4 h-4 text-[#3b82f6] mx-auto mb-1" />
                  <p className="text-[10px] text-[#18181B]/40 font-bold">Độ khó</p>
                  <p className="text-xs font-black text-[#18181B] mt-0.5">{LEVEL_LABELS[selectedProg.level] || selectedProg.level}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181B]/5 border border-[#18181B]/5">
                  <Calendar className="w-4 h-4 text-[#22c55e] mx-auto mb-1" />
                  <p className="text-[10px] text-[#18181B]/40 font-bold">Thời gian</p>
                  <p className="text-xs font-black text-[#18181B] mt-0.5">{selectedProg.duration_weeks} tuần</p>
                </div>
              </div>

              {/* Schedule */}
              {selectedProg.schedule && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FF5722]" /> Lịch tập mẫu hàng tuần
                  </h4>
                  <div className="space-y-2">
                    {selectedProg.schedule.map(s => {
                      const isRisky = modalRiskyGroups.has(s.muscle_group);
                      return (
                        <div key={s.day} className={`p-3 rounded-xl border transition flex items-start gap-3 ${isRisky ? 'border-red-500/30 bg-red-500/5' : 'border-[#18181B]/10 hover:border-[#18181B]/20 bg-white/5'}`}>
                          <div className="w-8 h-8 rounded-lg bg-[#FF5722]/15 text-[#FF5722] font-black text-xs flex items-center justify-center shrink-0">
                            {s.day}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[#18181B] text-xs">{s.title}</p>
                              {isRisky && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-red-500 text-white font-black uppercase flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5" /> Cân nhắc chấn thương
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#18181B]/50 mt-0.5">{s.desc}</p>
                            {isRisky && (
                              <p className="text-[10px] text-red-500 mt-1 font-semibold">Trao đổi với PT để điều chỉnh bài tập phù hợp.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#18181B]/10 bg-white flex gap-2">
              {activeProg?.program_id === selectedProg.program_id ? (
                <button 
                  onClick={handleCancelEnroll}
                  className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-black text-sm hover:bg-red-600 transition shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  HỦY CHỌN LỊCH TẬP
                </button>
              ) : (
                <button 
                  onClick={() => handleEnroll(selectedProg)}
                  className="w-full py-3.5 rounded-2xl bg-[#FF5722] text-white font-black text-sm hover:bg-[#FF5722]/90 transition shadow-[0_0_20px_rgba(255,87,34,0.3)]">
                  CHỌN LỊCH TẬP NÀY
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    {/* AI Goal Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            {analyzing ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 border-4 border-[#FF5722]/20 border-t-[#FF5722] rounded-full animate-spin"></div>
                <h3 className="text-lg font-black text-[#18181B]">AI đang phân tích...</h3>
                <p className="text-sm text-[#18181B]/60">FitFuel AI đang tổng hợp câu trả lời để tạo lộ trình cá nhân hóa cho bạn.</p>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-[#18181B]/10 flex items-center justify-between bg-gradient-to-r from-[#FF5722]/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-[#FF5722]" />
                    <h3 className="font-black text-[#18181B] text-base">Goal Questionnaire</h3>
                  </div>
                  {localStorage.getItem('fitfuel_goal_onboarded') && (
                    <button onClick={() => setShowOnboarding(false)} className="text-[#18181B]/40 hover:text-[#18181B] p-1 rounded-full hover:bg-black/5 transition cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold text-[#FF5722]">Bước {onboardingStep} / 5</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`h-1.5 w-6 rounded-full transition-colors ${s <= onboardingStep ? 'bg-[#FF5722]' : 'bg-[#18181B]/10'}`} />
                      ))}
                    </div>
                  </div>

                  {onboardingStep === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-lg font-black text-[#18181B] flex items-center gap-2"><Target className="w-5 h-5 text-[#FF5722]" /> Mục tiêu chính của bạn?</h4>
                        <p className="text-xs text-[#18181B]/60 mt-1">AI sẽ tối ưu giáo án dựa trên mục tiêu này.</p>
                      </div>
                      <div className="space-y-2">
                        {['Giảm mỡ & Săn chắc', 'Tăng cơ bắp', 'Tăng sức mạnh', 'Duy trì vóc dáng'].map(opt => (
                          <button key={opt} onClick={() => { setOnboardingAnswers(p => ({...p, goal: opt})); setOnboardingStep(2); }} className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${onboardingAnswers.goal === opt ? 'border-[#FF5722] bg-[#FF5722]/5 text-[#FF5722]' : 'border-[#18181B]/10 text-[#18181B] hover:border-[#FF5722]/30'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-lg font-black text-[#18181B] flex items-center gap-2"><Award className="w-5 h-5 text-[#FF5722]" /> Kinh nghiệm tập luyện?</h4>
                        <p className="text-xs text-[#18181B]/60 mt-1">Để lựa chọn bài tập có độ khó phù hợp.</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'Mới bắt đầu', desc: 'Chưa từng tập hoặc tập dưới 3 tháng' },
                          { label: 'Trung bình', desc: 'Đã tập đều đặn từ 3 - 12 tháng' },
                          { label: 'Nâng cao', desc: 'Tập luyện nghiêm túc trên 1 năm' }
                        ].map(opt => (
                          <button key={opt.label} onClick={() => { setOnboardingAnswers(p => ({...p, experience: opt.label})); setOnboardingStep(3); }} className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${onboardingAnswers.experience === opt.label ? 'border-[#FF5722] bg-[#FF5722]/5' : 'border-[#18181B]/10 hover:border-[#FF5722]/30'}`}>
                            <p className={`font-bold ${onboardingAnswers.experience === opt.label ? 'text-[#FF5722]' : 'text-[#18181B]'}`}>{opt.label}</p>
                            <p className="text-xs text-[#18181B]/50 mt-1">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-lg font-black text-[#18181B] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#FF5722]" /> Số ngày tập mỗi tuần?</h4>
                        <p className="text-xs text-[#18181B]/60 mt-1">Để phân bổ nhóm cơ tối ưu nhất.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['2-3 ngày', '4 ngày', '5 ngày', '6 ngày'].map(opt => (
                          <button key={opt} onClick={() => { setOnboardingAnswers(p => ({...p, daysPerWeek: opt})); setOnboardingStep(4); }} className={`p-4 rounded-2xl border-2 text-center font-bold transition-all cursor-pointer ${onboardingAnswers.daysPerWeek === opt ? 'border-[#FF5722] bg-[#FF5722]/5 text-[#FF5722]' : 'border-[#18181B]/10 text-[#18181B] hover:border-[#FF5722]/30'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-lg font-black text-[#18181B] flex items-center gap-2"><Clock className="w-5 h-5 text-[#FF5722]" /> Thời lượng mỗi buổi tập?</h4>
                        <p className="text-xs text-[#18181B]/60 mt-1">Giúp giới hạn số lượng bài tập và hiệp tập.</p>
                      </div>
                      <div className="space-y-2">
                        {['Dưới 45 phút (Nhanh gọn)', '45 - 60 phút (Tiêu chuẩn)', 'Trên 60 phút (Chuyên sâu)'].map(opt => (
                          <button key={opt} onClick={() => { setOnboardingAnswers(p => ({...p, duration: opt})); setOnboardingStep(5); }} className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${onboardingAnswers.duration === opt ? 'border-[#FF5722] bg-[#FF5722]/5 text-[#FF5722]' : 'border-[#18181B]/10 text-[#18181B] hover:border-[#FF5722]/30'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {onboardingStep === 5 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <h4 className="text-lg font-black text-[#18181B] flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#FF5722]" /> Tình trạng sức khỏe & Chấn thương?</h4>
                        <p className="text-xs text-[#18181B]/60 mt-1">Đánh dấu những vấn đề bạn đang gặp phải.</p>
                      </div>
                      <div className="space-y-2">
                        {[
                          { id: 'none', label: 'Không có vấn đề gì (Hoàn toàn khỏe mạnh)' },
                          { id: 'back', label: 'Đau lưng / Thoát vị đĩa đệm' },
                          { id: 'knee', label: 'Đau khớp gối / Chấn thương chân' },
                          { id: 'shoulder', label: 'Đau khớp vai / Cổ tay' },
                          { id: 'cardio', label: 'Huyết áp / Tim mạch' }
                        ].map(opt => {
                          const isSelected = onboardingAnswers.health.includes(opt.id);
                          return (
                            <button key={opt.id} onClick={() => {
                              setOnboardingAnswers(p => {
                                let newHealth = p.health ? p.health.split(',') : [];
                                if (opt.id === 'none') return { ...p, health: 'none' };
                                newHealth = newHealth.filter(h => h !== 'none');
                                if (isSelected) newHealth = newHealth.filter(h => h !== opt.id);
                                else newHealth.push(opt.id);
                                return { ...p, health: newHealth.join(',') };
                              });
                            }} className={`w-full p-3.5 rounded-2xl border-2 text-left font-bold transition-all cursor-pointer ${isSelected ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-[#18181B]/10 text-[#18181B] hover:border-[#18181B]/20'}`}>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                      <button 
                        disabled={!onboardingAnswers.health}
                        onClick={() => {
                          setAnalyzing(true);
                          setTimeout(() => {
                            setAnalyzing(false);
                            setShowOnboarding(false);
                            localStorage.setItem('fitfuel_goal_onboarded', 'true');
                            const newProfile = buildProfile(onboardingAnswers);
                            localStorage.setItem('fitfuel_goal_profile', JSON.stringify(newProfile));
                            setProfile(newProfile);
                            setSuccessMsg('AI đã phân tích xong và đề xuất lộ trình phù hợp nhất cho bạn!');
                            setTimeout(() => setSuccessMsg(''), 4000);
                          }, 2500);
                        }}
                        className="w-full py-3.5 mt-6 rounded-2xl bg-[#FF5722] text-white font-black text-sm hover:bg-[#FF5722]/90 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        HOÀN TẤT & NHẬN LỘ TRÌNH
                      </button>
                    </div>
                  )}

                  {onboardingStep > 1 && onboardingStep < 5 && (
                    <button onClick={() => setOnboardingStep(p => p - 1)} className="mt-6 text-xs font-bold text-[#18181B]/40 hover:text-[#18181B] cursor-pointer">
                      ← Quay lại bước trước
                    </button>
                  )}
                  {onboardingStep === 5 && (
                    <button onClick={() => setOnboardingStep(4)} className="mt-2 w-full text-center text-xs font-bold text-[#18181B]/40 hover:text-[#18181B] cursor-pointer">
                      Quay lại bước trước
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
