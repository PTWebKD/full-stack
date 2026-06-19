import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { api } from '../../../services/api';

const GOAL_LABELS = { muscle_gain: 'Tăng cơ', fat_loss: 'Giảm mỡ', maintain: 'Duy trì', strength: 'Tăng sức mạnh' };
const LEVEL_LABELS = { beginner: 'Mới bắt đầu', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

export default function JourneyProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/workout/programs')
      .then(data => setPrograms(Array.isArray(data) ? data : []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-5 h-5 text-[#FF5722]" />
        <h1 className="text-xl font-bold text-[#18181B]">Thư viện chương trình</h1>
      </div>

      {loading && <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>}

      {!loading && programs.length === 0 && (
        <div className="py-16 text-center text-[#18181B]/40">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Chưa có chương trình nào được tạo</p>
        </div>
      )}

      <div className="space-y-3">
        {programs.map(p => (
          <div key={p.program_id} className="glass rounded-2xl p-4 border border-[#18181B]/10 hover:border-[#FF5722]/20 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[#18181B]">{p.name}</h3>
                <p className="text-xs text-[#18181B]/60 mt-0.5 line-clamp-2">{p.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722]">{GOAL_LABELS[p.goal_type] || p.goal_type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#18181B]/10 text-[#18181B]/60">{LEVEL_LABELS[p.level] || p.level}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#18181B]/10 text-[#18181B]/60">{p.duration_weeks} tuần</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#18181B]/40 mt-1 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
