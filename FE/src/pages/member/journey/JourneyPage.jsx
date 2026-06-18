import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Dumbbell, Target, BarChart2, Award, ChevronRight, Zap } from 'lucide-react';

export default function JourneyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-6 border border-[#00d4ff]/20 bg-gradient-to-br from-[#003a5a]/30 to-transparent">
        <p className="text-xs text-[#00d4ff] uppercase tracking-widest mb-1">Transformation Journey</p>
        <h1 className="text-2xl font-black text-white mb-1">Hành trình của bạn</h1>
        <p className="text-white/50 text-sm">Chọn nhóm cơ và bắt đầu buổi tập hôm nay</p>

        {/* Quick Start CTA */}
        <Link to="/journey/session"
          className="mt-5 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 transition-all shadow-[0_0_30px_rgba(0,212,255,0.3)]">
          <Zap className="w-5 h-5" /> TẬP NGAY HÔM NAY
        </Link>
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { to: '/journey/progress', icon: BarChart2, label: 'Tiến độ', color: '#00d4ff', desc: '3 biểu đồ theo dõi' },
          { to: '/journey/milestones', icon: Award, label: 'Cột mốc', color: '#f97316', desc: 'Badge & FitCoin' },
          { to: '/journey/goal', icon: Target, label: 'Mục tiêu', color: '#a855f7', desc: 'Cài đặt goal' },
          { to: '/journey/programs', icon: Dumbbell, label: 'Chương trình', color: '#22c55e', desc: 'Thư viện bài tập' },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className="glass rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all group flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="font-semibold text-white text-sm">Buổi tập gần nhất</h2>
        </div>
        <div className="px-5 py-4">
          <Link to="/journey/progress" className="flex items-center justify-between text-sm">
            <span className="text-white/50">Xem lịch sử đầy đủ</span>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </Link>
        </div>
      </div>
    </div>
  );
}
