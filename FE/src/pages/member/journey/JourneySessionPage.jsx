import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap } from 'lucide-react';
import { api } from '../../../services/api';

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Ngực', emoji: '💪', color: '#FF5722' },
  { key: 'back_shoulders', label: 'Lưng + Vai', emoji: '🏋️', color: '#3b82f6' },
  { key: 'legs', label: 'Chân', emoji: '🦵', color: '#a855f7' },
  { key: 'full_body', label: 'Toàn thân', emoji: '⚡', color: '#22c55e' },
  { key: 'arms', label: 'Tay', emoji: '🤜', color: '#fbbf24' },
  { key: 'custom', label: 'Tự chọn', emoji: '🎯', color: '#ec4899' },
];

export default function JourneySessionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleStart = async () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const session = await api.post('/api/gym/sessions', {
        date: new Date().toISOString().split('T')[0],
        notes: selected,
      });
      navigate(`/gym/session/${session.session_id}`);
    } catch {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-xs text-[#FF5722] uppercase tracking-widest mb-2">Bước 1 — Bắt buộc</p>
        <h1 className="text-2xl font-black text-[#18181B] mb-2">Hôm nay tập nhóm cơ nào?</h1>
        <p className="text-[#18181B]/60 text-sm">Chọn nhóm cơ — hệ thống sẽ tạo buổi tập hoàn chỉnh ngay cho bạn</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {MUSCLE_GROUPS.map(mg => (
          <button key={mg.key} onClick={() => setSelected(mg.key)}
            className={`glass rounded-2xl p-5 border text-left transition-all group ${selected === mg.key ? 'border-[#FF5722]/60 shadow-[0_0_20px_rgba(255,87,34,0.15)]' : 'border-[#18181B]/10 hover:border-[#18181B]/20'}`}>
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

      <button onClick={handleStart} disabled={!selected || generating}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#FF5722] text-white hover:bg-[#FF5722]/90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(255,87,34,0.25)]">
        <Zap className="w-5 h-5" />
        {generating ? 'Đang tạo buổi tập...' : 'Bắt đầu ngay'}
      </button>

      <p className="text-center text-xs text-[#18181B]/25 mt-4">Bạn có thể tuỳ chỉnh danh sách bài tập sau khi xem đề xuất</p>
    </div>
  );
}
