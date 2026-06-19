import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, ShieldCheck, Calendar, ArrowLeft, RefreshCw,
  ChevronUp, Pause, Ban, Check, ShoppingBag, Utensils,
  Dumbbell, Award, History, Activity
} from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';

const fmt = (n) => n.toLocaleString('vi-VN');

export default function GymOwnerMemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find member from mockAllUsers
  const [member, setMember] = useState(null);
  const [freezePending, setFreezePending] = useState(false);
  const [plan, setPlan] = useState('monthly');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    const found = mockAllUsers.find(u => u.id === Number(id));
    if (found) {
      setMember(found);
      setPlan(found.plan);
      setStatus(found.status);
      // Simulate if they have a pending freeze request (Jake has one, or let's randomly simulate)
      if (found.name === 'Sarah Kim') {
        setFreezePending(true);
      }
    }
  }, [id]);

  if (!member) {
    return (
      <div className="text-center py-12 text-[#18181B]/60">
        <p>Đang tải thông tin hội viên...</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#FF5722] hover:underline flex items-center gap-1.5 justify-center mx-auto text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  // Quick Action Handlers
  const handleApproveFreeze = () => {
    setFreezePending(false);
    setStatus('suspended');
    alert(`Đã duyệt yêu cầu bảo lưu cho hội viên ${member.name}. Trạng thái gói tập chuyển sang Tạm Ngưng.`);
  };

  const handleUpgrade = () => {
    if (plan === 'yearly') {
      alert('Hội viên đã sử dụng gói năm.');
      return;
    }
    setPlan('yearly');
    alert(`Đã nâng cấp hội viên ${member.name} thành công lên Gói Năm.`);
  };

  const handleRenew = () => {
    alert(`Gia hạn thành công gói tập hiện tại cho hội viên ${member.name} (cộng thêm 30 ngày/365 ngày).`);
  };

  const handleToggleSuspend = () => {
    const nextStatus = status === 'active' ? 'suspended' : 'active';
    setStatus(nextStatus);
    alert(`Đã chuyển trạng thái hoạt động của hội viên sang: ${nextStatus.toUpperCase()}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <button onClick={() => navigate(-1)} className="text-[#FF5722] hover:underline text-xs flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách hội viên
      </button>

      {/* Header Profile Info */}
      <div className="glass rounded-2xl p-6 border border-[#18181B]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FF5722]/20 border border-[#7dd3fc]/30 flex items-center justify-center text-[#FF5722] text-xl font-bold shrink-0">
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#18181B]">{member.name}</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#18181B]/60 mt-1">{member.email} · Tham gia: {member.joinedAt}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {freezePending && (
            <button onClick={handleApproveFreeze} className="px-3 py-2 rounded-xl bg-yellow-400/20 text-yellow-400 text-xs font-bold hover:bg-yellow-400/30 transition-all flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Duyệt Bảo Lưu
            </button>
          )}
          <button onClick={handleRenew} className="px-3 py-2 rounded-xl glass border border-[#18181B]/10 text-[#18181B]/80 hover:text-[#18181B] text-xs font-bold transition-all flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-[#FF5722]" /> Gia Hạn
          </button>
          {plan !== 'yearly' && (
            <button onClick={handleUpgrade} className="px-3 py-2 rounded-xl bg-[#FF5722]/20 text-[#FF5722] hover:bg-[#FF5722]/30 text-xs font-bold transition-all flex items-center gap-1">
              <ChevronUp className="w-3.5 h-3.5" /> Nâng Cấp Gói Năm
            </button>
          )}
          <button onClick={handleToggleSuspend} className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all flex items-center gap-1">
            <Ban className="w-3.5 h-3.5" /> {status === 'active' ? 'Khoá Thẻ' : 'Mở Khoá'}
          </button>
        </div>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Membership details & stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Membership Info */}
          <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#18181B]/60 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Chi tiết thẻ tập
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex justify-between py-1.5 border-b border-[#18181B]/10">
                <span className="text-[#18181B]/60">Gói tập</span>
                <span className="font-semibold text-[#18181B] capitalize">{plan === 'yearly' ? 'Gói Năm' : 'Gói Tháng'}</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-[#18181B]/10">
                <span className="text-[#18181B]/60">Giá trị</span>
                <span className="font-semibold text-[#18181B]">{plan === 'yearly' ? '4.990.000đ' : '499.000đ'}</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-[#18181B]/10">
                <span className="text-[#18181B]/60">Kênh thanh toán</span>
                <span className="font-semibold text-[#18181B]">VNPay</span>
              </li>
              <li className="flex justify-between py-1.5 border-b border-[#18181B]/10">
                <span className="text-[#18181B]/60">Tự động gia hạn</span>
                <span className="font-semibold text-green-400">Bật</span>
              </li>
            </ul>
          </div>

          {/* Fitness Passport Stats */}
          <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#18181B]/60 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Fitness Passport
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="glass rounded-xl p-3 border border-[#18181B]/10">
                <p className="text-[#18181B]/60 text-[10px] mb-1">XP tích luỹ</p>
                <p className="text-lg font-black text-[#18181B]">4,820</p>
              </div>
              <div className="glass rounded-xl p-3 border border-[#18181B]/10">
                <p className="text-[#18181B]/60 text-[10px] mb-1">Streak</p>
                <p className="text-lg font-black text-[#FF5722]">14 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Check-in, Orders, Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab lists */}
          <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#18181B]/60 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <History className="w-4 h-4" /> Nhật ký Check-in & Hoạt động
            </h3>
            <div className="space-y-3">
              {[
                { time: '18/06/2026, 18:32', type: 'Check-in thành công', desc: 'Sử dụng Locker #204, mượn 1 khăn tập' },
                { time: '16/06/2026, 17:15', type: 'Check-in thành công', desc: 'Tập nhóm cơ: Ngực & Vai' },
                { time: '15/06/2026, 19:10', type: 'Đặt hàng Dinh Dưỡng', desc: 'Mua 1 Power Protein Bowl (INV-2026-042)' },
                { time: '14/06/2026, 08:30', type: 'Check-in thành công', desc: 'Tập nhóm cơ: Chân' }
              ].map((act, i) => (
                <div key={i} className="flex gap-4 text-xs py-2 border-b border-[#18181B]/10 last:border-0">
                  <div className="text-[10px] text-[#18181B]/40 w-32 shrink-0 mt-0.5">{act.time}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#18181B]">{act.type}</p>
                    <p className="text-[10px] text-[#18181B]/60 mt-0.5">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Retention Recommendations */}
          <div className="glass rounded-2xl p-5 border border-[#18181B]/10">
            <h3 className="text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> AI Care Recommendation & Notes
            </h3>
            <div className="rounded-xl p-4 bg-[#FF5722]/5 border border-[#FF5722]/10 text-xs">
              <p className="font-bold text-[#FF5722] mb-1">Gợi ý chăm sóc & Upsell</p>
              <p className="text-[#18181B]/60 leading-relaxed mb-3">
                Hội viên tập luyện đều đặn (streak 14 ngày) nhưng chưa sử dụng dịch vụ PT. Gợi ý tặng 1 buổi tập thử PT miễn phí để upsell gói PT Plus. Đề xuất sản phẩm protein shake sau tập khi check-in.
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#FF5722]/15 text-[#FF5722] rounded text-[10px] font-bold">Upsell PT</span>
                <span className="px-2 py-0.5 bg-[#FF5722]/15 text-[#FF5722] rounded text-[10px] font-bold">Cross-sell Protein</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
