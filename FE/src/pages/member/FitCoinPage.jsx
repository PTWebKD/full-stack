import { useState, useEffect } from 'react';
import { Zap, TrendingUp, TrendingDown, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const FITCOIN_RULES = [
  { action: 'Hoàn thành buổi tập', earn: '+20 FC', icon: '💪' },
  { action: 'Streak mỗi ngày', earn: '+10 FC', icon: '🔥' },
  { action: 'Đặt hàng thực phẩm', earn: '+5% giá trị', icon: '🍱' },
  { action: 'Bán gear thành công', earn: '+2% giá trị', icon: '🏷️' },
  { action: 'Đạt Personal Record', earn: '+30 FC', icon: '⚡' },
  { action: 'Unlock badge', earn: '+50–200 FC', icon: '🏆' },
];

export default function FitCoinPage() {
  const [filter, setFilter] = useState('all');
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/fitcoin/balance'),
      api.get('/api/fitcoin/history'),
    ])
      .then(([bal, hist]) => {
        setBalance(bal.balance !== undefined ? bal.balance : bal);
        setHistory(hist.items || hist || []);
      })
      .catch(() => {
        setBalance(0);
        setHistory([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter(h =>
    filter === 'all' || h.type === filter
  );

  const totalEarned = history.filter(h => h.type === 'earn').reduce((s, h) => s + (h.amount || 0), 0);
  const totalSpent = Math.abs(history.filter(h => h.type === 'spend').reduce((s, h) => s + (h.amount || 0), 0));

  if (loading) return (
    <div className="py-16 text-center text-[#18181B]/40">Đang tải...</div>
  );

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
              <Zap className="w-4 h-4 text-[#FF5722]" />
              <span className="text-xs font-semibold text-[#FF5722] uppercase tracking-wider">FitCoin Balance</span>
            </div>
            <p className="text-5xl font-black text-white">{balance.toLocaleString()}</p>
            <p className="text-sm text-white/70 mt-1">≈ {balance.toLocaleString('vi-VN')}đ giá trị</p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-1.5 text-[#FF5722]">
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
        <Link to="/food" className="glass rounded-xl p-4 border border-[#18181B]/10 hover:border-[#FF5722]/30 transition-all group">
          <p className="text-xs text-[#18181B]/60 mb-1">Dùng FitCoin mua food</p>
          <p className="text-sm font-bold text-[#18181B] group-hover:text-[#FF5722] transition-colors flex items-center gap-1">
            Đến Food Hub <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
        <Link to="/gear" className="glass rounded-xl p-4 border border-[#18181B]/10 hover:border-[#FF5722]/30 transition-all group">
          <p className="text-xs text-[#18181B]/60 mb-1">Dùng FitCoin thuê gear</p>
          <p className="text-sm font-bold text-[#18181B] group-hover:text-[#FF5722] transition-colors flex items-center gap-1">
            Đến Gear Hub <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* How to earn */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#18181B]/10">
          <Gift className="w-4 h-4 text-[#FF5722]" />
          <h3 className="font-semibold text-[#18181B]">Cách kiếm FitCoin</h3>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {FITCOIN_RULES.map((r, i) => (
            <div key={i} className="bg-white px-4 py-3 flex items-center gap-3">
              <span className="text-xl">{r.icon}</span>
              <div>
                <p className="text-xs text-[#18181B]/60">{r.action}</p>
                <p className="text-sm font-bold text-[#FF5722]">{r.earn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="glass rounded-2xl border border-[#18181B]/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#18181B]/10">
          <h3 className="font-semibold text-[#18181B]">Lịch sử giao dịch</h3>
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'earn', label: 'Kiếm' },
              { id: 'spend', label: 'Dùng' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === f.id ? 'bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20' : 'text-[#18181B]/40 hover:text-[#18181B]'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-[#18181B]/6">
          {filtered.map((h, i) => (
            <div key={h.transaction_id || h.id || i} className="flex items-center gap-4 px-5 py-3.5">
              <span className="text-xl w-8 text-center shrink-0">{h.icon || (h.type === 'earn' ? '⚡' : '💸')}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#18181B] truncate">{h.description || h.source}</p>
                <p className="text-xs text-[#18181B]/40">{h.created_at ? new Date(h.created_at).toLocaleDateString('vi-VN') : h.date}</p>
              </div>
              <p className={`text-sm font-bold shrink-0 ${h.type === 'earn' ? 'text-[#FF5722]' : 'text-red-400'}`}>
                {h.type === 'earn' ? '+' : ''}{(h.amount || 0).toLocaleString()} FC
              </p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-[#18181B]/40 text-sm">Không có giao dịch</div>
        )}
      </div>
    </div>
  );
}
