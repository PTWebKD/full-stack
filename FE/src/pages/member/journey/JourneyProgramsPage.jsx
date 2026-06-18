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
        <Dumbbell className="w-5 h-5 text-[#00d4ff]" />
        <h1 className="text-xl font-bold text-white">Thư viện chương trình</h1>
      </div>

      {loading && <div className="py-16 text-center text-white/30">Đang tải...</div>}

      {!loading && programs.length === 0 && (
        <div className="py-16 text-center text-white/30">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Chưa có chương trình nào được tạo</p>
        </div>
      )}

      <div className="space-y-3">
        {programs.map(p => (
          <div key={p.program_id} className="glass rounded-2xl p-4 border border-white/5 hover:border-[#00d4ff]/20 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{p.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]">{GOAL_LABELS[p.goal_type] || p.goal_type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{LEVEL_LABELS[p.level] || p.level}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">{p.duration_weeks} tuần</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 mt-1 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
