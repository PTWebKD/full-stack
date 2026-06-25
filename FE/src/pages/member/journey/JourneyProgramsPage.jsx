import { Link } from 'react-router-dom';
import { Dumbbell, ChevronRight } from 'lucide-react';

const GOAL_LABELS = { muscle_gain: 'Tăng cơ', fat_loss: 'Giảm mỡ', maintain: 'Duy trì', strength: 'Tăng sức mạnh' };
const LEVEL_LABELS = { beginner: 'Mới bắt đầu', intermediate: 'Trung cấp', advanced: 'Nâng cao' };

const MOCK_PROGRAMS = [
  { program_id: 1, name: 'Tăng cơ 3 ngày/tuần', description: 'Chương trình tập trung phát triển cơ bắp toàn thân với lịch 3 buổi/tuần.', goal_type: 'muscle_gain', level: 'beginner', duration_weeks: 8 },
  { program_id: 2, name: 'Đốt mỡ Full Body', description: 'Kết hợp cardio và tập tạ để tối đa hóa lượng calo tiêu thụ mỗi buổi tập.', goal_type: 'fat_loss', level: 'intermediate', duration_weeks: 6 },
  { program_id: 3, name: 'Nền tảng sức mạnh', description: 'Tập trung vào 3 bài tập nền: Squat, Deadlift, Bench Press để xây dựng nền sức mạnh.', goal_type: 'strength', level: 'intermediate', duration_weeks: 12 },
  { program_id: 4, name: 'Duy trì & Linh hoạt', description: 'Kết hợp tập tạ nhẹ và yoga để duy trì thể lực và cải thiện tính linh hoạt.', goal_type: 'maintain', level: 'beginner', duration_weeks: 4 },
  { program_id: 5, name: 'Tăng cơ nâng cao', description: 'Chương trình 5 ngày/tuần với split cơ chuyên biệt dành cho người đã có nền tảng.', goal_type: 'muscle_gain', level: 'advanced', duration_weeks: 16 },
];

export default function JourneyProgramsPage() {
  const programs = MOCK_PROGRAMS;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-5 h-5 text-[#FF5722]" />
        <h1 className="text-xl font-bold text-[#18181B]">Thư viện chương trình</h1>
      </div>

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
