import { useState } from 'react';
import { Zap, TrendingUp, TrendingDown, Gift, ArrowRight } from 'lucide-react';
import { mockFitCoinBalance, mockFitCoinHistory, fitCoinRules } from '../../data/mockFitCoin';
import { Link } from 'react-router-dom';

export default function FitCoinPage() {
  const [filter, setFilter] = useState('all');

  const filtered = mockFitCoinHistory.filter(h =>
    filter === 'all' || h.type === filter
  );

  const totalEarned = mockFitCoinHistory.filter(h => h.type === 'earn').reduce((s, h) => s + h.amount, 0);
  const totalSpent = Math.abs(mockFitCoinHistory.filter(h => h.type === 'spend').reduce((s, h) => s + h.amount, 0));

  return (
    <div className="max-w-2xl space-y-5 mx-auto">
      {/* Balance card */}
      <div className="relative rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=200&fit=crop"
          alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c10]/95 via-[#080c10]/80 to-[#080c10]/60" />
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-[#7dd3fc]" />
              <span className="text-xs font-semibold text-[#7dd3fc] uppercase tracking-wider">FitCoin Balance</span>
            </div>
            <p className="text-5xl font-black text-white">{mockFitCoinBalance.toLocaleString()}</p>
            <p className="text-sm text-white/40 mt-1">≈ {mockFitCoinBalance.toLocaleString('vi-VN')}đ giá trị</p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-1.5 text-[#7dd3fc]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+{totalEarned.toLocaleString()} kiếm được</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-bold">-{totalSpent.toLocaleString()} đã dùng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick use */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/food" className="glass rounded-xl p-4 border border-white/5 hover:border-[#00d4ff]/30 transition-all group">
          <p className="text-xs text-white/40 mb-1">Dùng FitCoin mua food</p>
          <p className="text-sm font-bold text-white group-hover:text-[#00d4ff] transition-colors flex items-center gap-1">
            Đến Food Hub <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
        <Link to="/gear" className="glass rounded-xl p-4 border border-white/5 hover:border-[#f97316]/30 transition-all group">
          <p className="text-xs text-white/40 mb-1">Dùng FitCoin thuê gear</p>
          <p className="text-sm font-bold text-white group-hover:text-[#f97316] transition-colors flex items-center gap-1">
            Đến Gear Hub <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* How to earn */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
          <Gift className="w-4 h-4 text-[#7dd3fc]" />
          <h3 className="font-semibold text-white">Cách kiếm FitCoin</h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/5">
          {fitCoinRules.map((r, i) => (
            <div key={i} className="bg-[#080c10] px-4 py-3 flex items-center gap-3">
              <span className="text-xl">{r.icon}</span>
              <div>
                <p className="text-xs text-white/60">{r.action}</p>
                <p className="text-sm font-bold text-[#7dd3fc]">{r.earn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Lịch sử giao dịch</h3>
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'earn', label: 'Kiếm' },
              { id: 'spend', label: 'Dùng' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === f.id ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.map(h => (
            <div key={h.id} className="flex items-center gap-4 px-5 py-3.5">
              <span className="text-xl w-8 text-center shrink-0">{h.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{h.source}</p>
                <p className="text-xs text-white/30">{h.date}</p>
              </div>
              <p className={`text-sm font-bold shrink-0 ${h.type === 'earn' ? 'text-[#7dd3fc]' : 'text-red-400'}`}>
                {h.type === 'earn' ? '+' : ''}{h.amount.toLocaleString()} FC
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
