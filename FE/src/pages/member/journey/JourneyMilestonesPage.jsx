import { useState, useEffect } from 'react';
import { Award, Lock, Coins } from 'lucide-react';
import { api } from '../../../services/api';

export default function JourneyMilestonesPage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/journey/milestones')
      .then(data => setMilestones(Array.isArray(data) ? data : []))
      .catch(() => setMilestones([]))
      .finally(() => setLoading(false));
  }, []);

  const earned = milestones.filter(m => m.achieved);
  const locked = milestones.filter(m => !m.achieved);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-5 h-5 text-[#f97316]" />
        <h1 className="text-xl font-bold text-white">Cột mốc thành tựu</h1>
        <span className="ml-auto text-sm text-white/40">{earned.length}/{milestones.length} đã đạt</span>
      </div>

      {loading && <div className="py-16 text-center text-white/30">Đang tải...</div>}

      {!loading && (
        <>
          {earned.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Đã đạt được</p>
              <div className="space-y-3">
                {earned.map(m => (
                  <div key={m.milestone_id} className="glass rounded-2xl p-4 border border-[#f97316]/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f97316]/20 flex items-center justify-center text-lg shrink-0">
                      {m.emoji || '🏆'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{m.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{m.description}</p>
                      <p className="text-xs text-white/20 mt-0.5">{new Date(m.achieved_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#fbbf24] text-xs font-bold">
                      <Coins className="w-3.5 h-3.5" />+{m.fitcoin_reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {locked.length > 0 && (
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wide mb-3">Chưa đạt</p>
              <div className="space-y-3">
                {locked.map(m => (
                  <div key={m.milestone_id} className="glass rounded-2xl p-4 border border-white/5 flex items-center gap-4 opacity-50">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{m.title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{m.condition_description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Coins className="w-3.5 h-3.5" />+{m.fitcoin_reward}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {milestones.length === 0 && (
            <div className="py-16 text-center text-white/30">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Hoàn thành buổi tập đầu tiên để bắt đầu thu thập cột mốc!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
