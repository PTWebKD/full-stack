import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Dumbbell, Utensils, ShoppingBag, Brain } from 'lucide-react';

const features = [
  { icon: Dumbbell, label: 'Lập lịch tập', desc: 'Gợi ý bài tập theo nhóm cơ và mục tiêu' },
  { icon: Utensils, label: 'Tư vấn dinh dưỡng', desc: 'Tính macro, calo, protein cá nhân hóa' },
  { icon: ShoppingBag, label: 'Gợi ý gear', desc: 'Tư vấn dụng cụ tập luyện phù hợp' },
  { icon: Brain, label: 'Hồi phục thông minh', desc: 'Hướng dẫn nghỉ ngơi và recovery' },
];

export default function AiAssistantPage() {
  return (
    <div className="max-w-xl mx-auto py-12 flex flex-col items-center text-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ boxShadow: ['0 0 8px #003a5a44', '0 0 32px #003a5a99', '0 0 8px #003a5a44'] }}
          transition={{ repeat: Infinity, duration: 2.4 }}
          className="w-20 h-20 rounded-3xl bg-[#003a5a]/20 border border-[#003a5a]/30 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-[#7dd3fc]" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-white mb-2">FitAI Assistant</h1>
          <p className="text-white/45 text-sm leading-relaxed">
            Trợ lý AI của bạn luôn sẵn sàng ở góc dưới bên phải màn hình.<br />
            Nhấn vào bong bóng để bắt đầu trò chuyện bất cứ lúc nào.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 gap-3 w-full"
      >
        {features.map(({ icon: Icon, label, desc }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
            className="glass rounded-2xl border border-white/8 p-4 text-left hover:border-[#003a5a]/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-[#003a5a]/15 flex items-center justify-center mb-3">
              <Icon className="w-4 h-4 text-[#7dd3fc]" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">{label}</p>
            <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[#003a5a]/25 bg-[#003a5a]/8"
      >
        <MessageCircle className="w-4 h-4 text-[#7dd3fc] shrink-0" />
        <p className="text-xs text-white/40">
          Nhấn nút <span className="text-[#7dd3fc] font-semibold">✦</span> góc dưới phải để chat với FitAI
        </p>
      </motion.div>
    </div>
  );
}
