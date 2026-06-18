import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode, Keyboard, CheckCircle, XCircle, ArrowRight,
  ShieldAlert, Calendar, User, UserCheck, Key, ShieldCheck
} from 'lucide-react';
import { mockAllUsers } from '../../data/mockAdmin';

export default function CheckinPage() {
  const [method, setMethod] = useState('phone'); // 'phone' | 'qr'
  const [inputValue, setInputValue] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, member: object, msg: string }
  const [recentCheckins, setRecentCheckins] = useState([
    { name: 'Alex Thunder', time: 'Hôm nay, 18:32', plan: 'Gói Năm', status: 'Success' },
    { name: 'Sarah Kim', time: 'Hôm nay, 16:15', plan: 'Gói Tháng', status: 'Success' },
    { name: 'Jake Power', time: 'Hôm qua, 09:20', plan: 'Gói Tháng', status: 'Suspended' }
  ]);

  const handleSelfCheckin = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Simulate search
    const cleanInput = inputValue.trim().toLowerCase();
    const foundUser = mockAllUsers.find(
      u => u.role === 'member' &&
      (u.name.toLowerCase().includes(cleanInput) || u.email.toLowerCase().includes(cleanInput))
    );

    if (foundUser) {
      if (foundUser.status === 'active') {
        const newResult = {
          success: true,
          member: foundUser,
          msg: 'Check-in thành công! Chào mừng bạn đến với phòng tập.'
        };
        setResult(newResult);
        setRecentCheckins(prev => [
          { name: foundUser.name, time: 'Vừa xong', plan: foundUser.plan === 'yearly' ? 'Gói Năm' : 'Gói Tháng', status: 'Success' },
          ...prev
        ]);
      } else {
        setResult({
          success: false,
          member: foundUser,
          msg: 'Tài khoản của bạn đã bị tạm ngưng hoặc hết hạn (Status: Suspended). Vui lòng liên hệ quầy lễ tân.'
        });
      }
    } else {
      setResult({
        success: false,
        msg: 'Không tìm thấy thông tin hội viên tương ứng với dữ liệu nhập.'
      });
    }
  };

  const handleSimulateQRScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      // Pick a random active member
      const activeMembers = mockAllUsers.filter(u => u.role === 'member' && u.status === 'active');
      const randomMember = activeMembers[Math.floor(Math.random() * activeMembers.length)] || mockAllUsers[0];

      setResult({
        success: true,
        member: randomMember,
        msg: 'Quét QR Code thành công! Chúc bạn có một buổi tập luyện hiệu quả.'
      });
      setRecentCheckins(prev => [
        { name: randomMember.name, time: 'Vừa xong (QR)', plan: randomMember.plan === 'yearly' ? 'Gói Năm' : 'Gói Tháng', status: 'Success' },
        ...prev
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
      
      {/* Left panel: check-in station */}
      <div className="md:col-span-3 space-y-4">
        <div className="glass-dark rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#003a5a]/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#7dd3fc]" /> Trạm Check-in Tự Động
          </h2>
          <p className="text-xs text-white/40 mb-6">
            Hội viên quét QR Code trên điện thoại hoặc nhập Email/SĐT để check-in vào phòng tập.
          </p>

          {/* Toggle Method */}
          <div className="flex bg-white/5 p-1 rounded-xl gap-1 mb-6 border border-white/5">
            <button
              onClick={() => { setMethod('phone'); setResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                method === 'phone' ? 'bg-[#003a5a] text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" /> Nhập thông tin
            </button>
            <button
              onClick={() => { setMethod('qr'); setResult(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                method === 'qr' ? 'bg-[#003a5a] text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> Quét mã QR
            </button>
          </div>

          <AnimatePresence mode="wait">
            {method === 'phone' ? (
              <motion.form
                key="phone-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSelfCheckin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-medium text-white/40 mb-1.5">Tên hoặc Email Hội viên</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="Ví dụ: Alex Thunder, alex@fitfuel.com"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#7dd3fc]/50 text-sm"
                    />
                    <button type="submit" className="px-4 rounded-xl bg-[#003a5a] text-white hover:opacity-90 transition-colors flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="qr-scanner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-2xl relative bg-white/[0.02]"
              >
                {scanning ? (
                  <div className="flex flex-col items-center py-4">
                    <span className="w-10 h-10 border-4 border-[#7dd3fc]/30 border-t-[#7dd3fc] rounded-full animate-spin mb-3" />
                    <p className="text-xs text-white/60">Đang quét thiết bị...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-white/20 mx-auto mb-3 animate-pulse" />
                    <button
                      onClick={handleSimulateQRScan}
                      className="px-5 py-2.5 rounded-xl bg-[#003a5a] text-white text-xs font-bold hover:opacity-90 transition-all glow-neon"
                    >
                      Mô phỏng Quét QR
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Alert */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border-t border-white/5 pt-5"
              >
                {result.success ? (
                  <div className="rounded-xl p-4 flex items-start gap-3 bg-green-500/10 border border-green-500/20 text-green-400">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white">CHECK-IN THÀNH CÔNG</h4>
                      <p className="text-xs mt-1 text-white/70">{result.msg}</p>
                      
                      {result.member && (
                        <div className="mt-4 pt-3 border-t border-green-500/10 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-white/40 text-[10px]">Hội viên</p>
                            <p className="font-semibold text-white">{result.member.name}</p>
                          </div>
                          <div>
                            <p className="text-white/40 text-[10px]">Gói dịch vụ</p>
                            <p className="font-semibold text-[#7dd3fc] capitalize">{result.member.plan || 'Gói Tháng'}</p>
                          </div>
                          <div className="col-span-2 pt-2 flex items-center gap-1.5 text-[10px] text-white/50">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                            <span>Quyền lợi đi kèm: Khăn tập + Locker (Miễn phí)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-4 flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400">
                    <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-white">CHECK-IN THẤT BẠI</h4>
                      <p className="text-xs mt-1 text-white/70">{result.msg}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right panel: recent activity feed */}
      <div className="md:col-span-2 space-y-4">
        <div className="glass rounded-2xl p-5 border border-white/5 h-full">
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white/30" /> Lượt Check-in gần nhất (7 ngày)
          </h3>
          <div className="space-y-3">
            {recentCheckins.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'Success' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{item.time} · {item.plan}</p>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                  item.status === 'Success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
