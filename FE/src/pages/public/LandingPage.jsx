import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Dumbbell, Utensils, ShoppingBag, Award, Users, Star, 
  ChevronRight, CheckCircle, Gift, ShieldCheck, Calendar, Megaphone, 
  X, Check, Clock, Shield, Sparkles, Smile, Flame, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import CinematicMapLayer from '../../components/common/CinematicMapLayer';
import { CheckoutModal, SuccessScreen } from '../member/MembershipPage';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  MONTHLY_PRICE, YEARLY_PRICE, MEMBER_BENEFITS, YEARLY_DISCOUNT_PCT
} from '../../data/mockMembership';

const fmtLanding = (n) => n.toLocaleString('vi-VN');

// ─── 1. REGISTRATION MODAL WITH OTP STEP (PREMIUM CRO LEAD FORM) ───
function RegistrationModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: Info Form, 2: OTP, 3: Success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gym, setGym] = useState('FitFuel Center Quận 1');
  const [time, setTime] = useState('13:00 - 16:00 (Khung giờ vắng)');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !email) return;
    setLoading(true);
    // Giả lập gửi OTP qua SMS Gateway
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus input kế tiếp
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập xác thực OTP thành công
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start md:items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-3xl border border-[#18181B]/15 w-full max-w-lg shadow-2xl overflow-hidden text-[#18181B] bg-white/95 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#18181B]/10">
          <div>
            <p className="text-xs text-[#FF5722] font-black uppercase tracking-wider">Trải Nghiệm FitFuel+</p>
            <h3 className="font-extrabold text-[#18181B] text-lg">Đăng Ký Tập Thử Miễn Phí</h3>
          </div>
          <button onClick={onClose} className="text-[#18181B]/40 hover:text-[#18181B] transition-colors p-1.5 rounded-lg hover:bg-black/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Bên trái: Quyền lợi */}
              <div className="md:col-span-2 space-y-4 bg-[#FF5722]/5 p-4 rounded-2xl border border-[#FF5722]/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-xs text-[#FF5722] uppercase tracking-wider mb-3">Quyền Lợi Độc Quyền</h4>
                  <ul className="space-y-2.5 text-xs text-[#18181B]/80 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                      <span>Đo chỉ số cơ thể InBody miễn phí</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                      <span>Giáo án luyện tập được AI thiết kế</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                      <span>1 buổi tư vấn dinh dưỡng chuyên sâu</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0 mt-0.5" />
                      <span>Trải nghiệm 24/7 toàn bộ tiện ích</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-[#18181B]/10 text-[10px] text-[#18181B]/50">
                  ⭐⭐⭐⭐⭐ Đánh giá 4.9★ bởi 5,000+ hội viên. Không yêu cầu thẻ thanh toán.
                </div>
              </div>

              {/* Bên phải: Form */}
              <form onSubmit={handleInfoSubmit} className="md:col-span-3 space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-[#18181B]/60 tracking-wider">Họ và tên</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white border border-[#18181B]/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722] transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-[#18181B]/60 tracking-wider">Số điện thoại (Nhận mã OTP)</label>
                  <input
                    type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full bg-white border border-[#18181B]/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722] transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-[#18181B]/60 tracking-wider">Địa chỉ Email</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-[#18181B]/15 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF5722] transition-all mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#18181B]/60 tracking-wider">Phòng tập</label>
                    <select value={gym} onChange={e => setGym(e.target.value)}
                      className="w-full bg-white border border-[#18181B]/15 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#FF5722] transition-all mt-1">
                      <option>FitFuel Center Quận 1</option>
                      <option>FitFuel Premium Bình Thạnh</option>
                      <option>FitFuel Hub Quận 7</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-[#18181B]/60 tracking-wider">Thời gian</label>
                    <select value={time} onChange={e => setTime(e.target.value)}
                      className="w-full bg-white border border-[#18181B]/15 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-[#FF5722] transition-all mt-1">
                      <option>13:00 - 16:00 (Yên tĩnh nhất)</option>
                      <option>09:00 - 12:00 (Trung bình)</option>
                      <option>18:00 - 21:00 (Cao điểm)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[#FF5722] text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5722]/20 mt-3 cursor-pointer">
                  {loading ? 'Đang gửi mã...' : 'Nhận Vé Tập Thử Miễn Phí'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="text-center py-4 space-y-6 max-w-sm mx-auto">
              <div>
                <h4 className="font-extrabold text-base mb-1">Xác thực số điện thoại</h4>
                <p className="text-xs text-[#18181B]/60 leading-relaxed">
                  Chúng tôi đã gửi mã xác thực 6 số đến số điện thoại <b className="text-[#18181B]">{phone}</b>
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx} id={`otp-${idx}`}
                    type="text" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-12 bg-white border-2 border-[#18181B]/15 rounded-xl text-center text-lg font-black focus:outline-none focus:border-[#FF5722] transition-all"
                  />
                ))}
              </div>

              <div className="space-y-3">
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[#FF5722] text-white hover:opacity-90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                  {loading ? 'Đang xác thực...' : 'Xác nhận kích hoạt vé'}
                </button>

                <p className="text-[11px] text-[#18181B]/60">
                  {timer > 0 ? (
                    <span>Gửi lại mã sau <b className="text-[#FF5722]">{timer}s</b></span>
                  ) : (
                    <button type="button" onClick={() => setTimer(60)} className="text-[#FF5722] font-bold hover:underline">
                      Gửi lại mã OTP
                    </button>
                  )}
                </p>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-5 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-[#4ade80]/15 border border-[#4ade80]/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[#4ade80]" />
              </div>
              <div>
                <h4 className="font-black text-xl mb-1 text-[#18181B]">Kích Hoạt Thành Công!</h4>
                <p className="text-xs text-[#18181B]/60 leading-relaxed px-4">
                  Vé trải nghiệm của bạn tại cơ sở <b className="text-[#18181B]">{gym}</b> đã được tạo. Hãy mang mã số này đến quầy lễ tân để bắt đầu.
                </p>
              </div>

              {/* Ticket Card */}
              <div className="bg-[#18181B] text-white p-4 rounded-2xl text-left border border-white/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF5722]/20 rounded-full blur-xl pointer-events-none" />
                <div className="flex justify-between items-start border-b border-white/10 pb-2.5 mb-2.5">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-white/50 font-bold">FitFuel Free Trial Pass</p>
                    <h5 className="font-extrabold text-xs tracking-wide text-white uppercase mt-0.5">Vé Tập Thử 01 Ngày</h5>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black uppercase">
                    Active
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span className="text-white/40">Hội viên:</span>
                    <span className="font-semibold text-white">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cơ sở tập:</span>
                    <span className="font-semibold text-white">{gym}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Thời điểm đặt:</span>
                    <span className="font-semibold text-[#FF5722]">{time}</span>
                  </div>
                </div>
              </div>

              <button onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#18181B] text-white hover:bg-black transition-all cursor-pointer">
                Đóng cửa sổ
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── 2. BEGINNER ANXIETY MODAL POPUP ───
function BeginnerAnxietyPopup({ onBookTrial, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start md:items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93 }}
        className="glass rounded-3xl border border-[#18181B]/15 w-full max-w-md shadow-2xl p-6 text-[#18181B] bg-white/95 relative overflow-hidden my-8"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/10 rounded-full blur-2xl pointer-events-none" />
        <button onClick={onClose} className="absolute right-4 top-4 text-[#18181B]/40 hover:text-[#18181B] transition-all p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-2xl flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6 text-[#FF5722]" />
          </div>
          <div>
            <h3 className="font-black text-[#18181B] text-lg leading-tight">Lần đầu đi tập gym?</h3>
            <p className="text-xs text-[#18181B]/60">Chúng tôi đồng hành từng bước cùng bạn</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[#18181B]/70 leading-relaxed">
            Đừng e ngại. Hơn <b>85% hội viên</b> của FitFuel+ bắt đầu từ con số không. Chúng tôi thiết lập không gian thoải mái nhất để bạn làm quen:
          </p>

          <ul className="space-y-2.5 text-xs text-[#18181B]/80 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
              <span>Khu vực tập luyện riêng tư, không phán xét (No-judgment).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
              <span>Huấn luyện viên thân thiện chỉ dẫn máy tập chi tiết 1:1.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
              <span>Gợi ý biểu đồ vắng khách để bạn tập một mình tự tin hơn.</span>
            </li>
          </ul>

          <div className="flex gap-3 pt-3">
            <button
              onClick={() => { onClose(); onBookTrial(); }}
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#FF5722] text-white hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-md shadow-[#FF5722]/20 cursor-pointer"
            >
              Đặt lịch tập thử miễn phí
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-[#18181B]/10 text-xs text-[#18181B]/60 hover:text-[#18181B] transition-colors cursor-pointer"
            >
              Để sau
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── 3. GYM CROWD FORECAST COMPLEMENTARY TIMELINE (24H HEATMAP) ───
function GymCrowdTimeline() {
  const currentHour = new Date().getHours();
  const [selectedHour, setSelectedHour] = useState(currentHour);
  const [gridCols, setGridCols] = useState(6);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) setGridCols(24);
      else if (window.innerWidth >= 640) setGridCols(12);
      else setGridCols(6);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const forecastData = [
    { hour: '00:00', level: 5, status: 'Yên tĩnh', desc: 'Rất vắng khách, không gian rộng mở và yên tĩnh tuyệt đối.' },
    { hour: '01:00', level: 5, status: 'Yên tĩnh', desc: 'Không khí tập luyện thư giãn, toàn bộ máy tập đều trống.' },
    { hour: '02:00', level: 5, status: 'Yên tĩnh', desc: 'Thích hợp cho các cú đêm muốn tập trung cao độ.' },
    { hour: '03:00', level: 5, status: 'Yên tĩnh', desc: 'Yên tĩnh, không gian thoải mái riêng tư.' },
    { hour: '04:00', level: 10, status: 'Yên tĩnh', desc: 'Bắt đầu ngày mới thư thái, không lo chen chúc.' },
    { hour: '05:00', level: 35, status: 'Thoải mái', desc: 'Lớp tập yoga và chạy bộ sáng sớm bắt đầu nhộn nhịp.' },
    { hour: '06:00', level: 65, status: 'Trung bình', desc: 'Hội viên tập nhẹ trước giờ làm việc văn phòng.' },
    { hour: '07:00', level: 85, status: 'Rất đông (Peak)', desc: 'Cao điểm sáng, khu vực cardio và tạ tay kín chỗ.' },
    { hour: '08:00', level: 80, status: 'Rất đông (Peak)', desc: 'Vẫn khá đông, cần phối hợp đổi lượt dùng máy.' },
    { hour: '09:00', level: 50, status: 'Trung bình', desc: 'Thời điểm lý tưởng cho người làm việc tự do.' },
    { hour: '10:00', level: 40, status: 'Trung bình', desc: 'Phòng tập thoáng mát, PT sẵn sàng hỗ trợ sửa form.' },
    { hour: '11:00', level: 30, status: 'Thoải mái', desc: 'Bắt đầu giờ nghỉ trưa, phòng tập khá dễ chịu.' },
    { hour: '12:00', level: 25, status: 'Thoải mái', desc: 'Khung giờ trưa vắng vẻ, nhạc chill êm dịu.' },
    { hour: '13:00', level: 15, status: 'Yên tĩnh', desc: 'Vắng khách nhất ngày, khuyên dùng cho người mới bắt đầu.' },
    { hour: '14:00', level: 15, status: 'Yên tĩnh', desc: 'Không gian tự do tuyệt đối để bạn thử máy mới.' },
    { hour: '15:00', level: 20, status: 'Yên tĩnh', desc: 'Yên tĩnh, không khí mát mẻ dễ chịu.' },
    { hour: '16:00', level: 45, status: 'Trung bình', desc: 'Học sinh sinh viên bắt đầu đến tập luyện sôi nổi.' },
    { hour: '17:00', level: 75, status: 'Rất đông (Peak)', desc: 'Bắt đầu giờ tan tầm, các class Group X lên nhạc.' },
    { hour: '18:00', level: 95, status: 'Cực kỳ đông (Peak)', desc: 'Đỉnh điểm mật độ trong ngày, không gian bùng nổ.' },
    { hour: '19:00', level: 90, status: 'Cực kỳ đông (Peak)', desc: 'Khu vực tạ Free Weight hoạt động tối đa công suất.' },
    { hour: '20:00', level: 70, status: 'Rất đông', desc: 'Hội viên ca tối muộn tập trung siết cơ.' },
    { hour: '21:00', level: 45, status: 'Trung bình', desc: 'Phòng tập hạ nhiệt dần, máy tập bắt đầu trống.' },
    { hour: '22:00', level: 25, status: 'Thoải mái', desc: 'Ca tập muộn yên tĩnh cho người thích sự riêng tư.' },
    { hour: '23:00', level: 10, status: 'Yên tĩnh', desc: 'Chuẩn bị đóng cửa, chỉ còn lác đác vài hội viên.' },
  ];

  const getHeatColor = (level) => {
    if (level <= 20) return 'bg-[#10B981]/15 hover:bg-[#10B981]/25 border-[#10B981]/30 text-[#10B981]';
    if (level <= 40) return 'bg-[#14B8A6]/25 hover:bg-[#14B8A6]/35 border-[#14B8A6]/40 text-[#14B8A6]';
    if (level <= 70) return 'bg-[#FBBF24]/20 hover:bg-[#FBBF24]/30 border-[#FBBF24]/35 text-[#D97706]';
    return 'bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border-[#EF4444]/30 text-[#EF4444]';
  };

  const getSolidColor = (level) => {
    if (level <= 20) return 'bg-[#10B981]';
    if (level <= 40) return 'bg-[#14B8A6]';
    if (level <= 70) return 'bg-[#FBBF24]';
    return 'bg-[#EF4444]';
  };

  const selectedItem = forecastData[selectedHour];

  return (
    <section className="py-20 bg-[#18181B]/5 border-y border-[#18181B]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Tránh Đông Đúc · Tập Tự Tin</p>
          <h2 className="text-3xl font-black text-[#18181B] mb-3">Biểu Đồ Mật Độ 24h Real-time</h2>
          <p className="text-[#18181B]/60 text-sm max-w-xl mx-auto">
            Di chuyển chuột hoặc nhấn chọn các khung giờ để xem chi tiết mật độ hoạt động của phòng tập trong ngày.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 border border-[#18181B]/10 space-y-6">
          {/* Heatmap Grid */}
          <div>
            <div 
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`
              }}
            >
              {forecastData.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setSelectedHour(idx)}
                  onClick={() => setSelectedHour(idx)}
                  className={`h-16 flex flex-col justify-between items-center rounded-xl border transition-all cursor-pointer p-1.5 ${getHeatColor(item.level)} ${
                    selectedHour === idx ? 'ring-2 ring-[#FF5722] border-transparent scale-105 shadow-lg bg-white/70' : 'bg-white/20'
                  }`}
                >
                  <span className="text-[9px] font-black tracking-tighter opacity-80">{item.hour.split(':')[0]}h</span>
                  <div className="w-full flex-1 flex items-end justify-center pb-0.5">
                    <span className="text-xs font-extrabold">{item.level}%</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getSolidColor(item.level)} shrink-0`} />
                </div>
              ))}
            </div>
            
            {/* Heatmap Legend */}
            <div className="flex flex-wrap gap-4 items-center justify-center mt-4 text-[10px] font-bold text-[#18181B]/60">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Yên tĩnh (≤20%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" /> Thoải mái (21-40%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> Trung bình (41-70%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Cao điểm (&gt;70%)</span>
            </div>
          </div>

          {/* Active Detail Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedHour}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-[#18181B]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#18181B] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-5 h-5 text-[#FF5722] mb-0.5" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{selectedItem.hour.split(':')[0]}H</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#18181B]">Khung giờ {selectedItem.hour} - {(selectedHour + 1) % 24}:00</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      selectedItem.level <= 20 ? 'bg-[#10B981]/15 text-[#10B981]' :
                      selectedItem.level <= 40 ? 'bg-[#14B8A6]/15 text-[#14B8A6]' :
                      selectedItem.level <= 70 ? 'bg-[#FBBF24]/15 text-[#D97706]' :
                      'bg-[#EF4444]/15 text-[#EF4444]'
                    }`}>
                      {selectedItem.status} ({selectedItem.level}%)
                    </span>
                  </div>
                  <p className="text-xs text-[#18181B]/60 leading-relaxed font-medium">{selectedItem.desc}</p>
                </div>
              </div>
              
              {selectedHour === currentHour && (
                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 text-[10px] font-black text-[#FF5722] animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-[#FF5722]" /> HIỆN TẠI
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Beginner tips banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3 text-xs">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-600 mb-0.5">✅ Khung giờ khuyên dùng cho người mới: 13:00 - 16:00 (Yên tĩnh)</p>
              <p className="text-[#18181B]/70 leading-relaxed">
                Đây là khung giờ vắng khách nhất. Bạn sẽ có không gian rộng rãi để tự do làm quen với các loại máy tập, thoải mái nghe nhạc tập luyện mà không lo bị phán xét hay xếp hàng chờ máy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 4. PRICING SECTION OPTIMIZATION ───
function PricingSection({ onBookTrial }) {
  const [billing, setBilling] = useState('monthly');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(null);

  const price = billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE;
  const saving = MONTHLY_PRICE * 12 - YEARLY_PRICE;

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  if (success) {
    return (
      <section id="pricing-section" className="py-24 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent flex justify-center items-center">
        <div className="w-full">
          <SuccessScreen billing={success.billing} isUpgrade={success.isUpgrade} isRenewal={success.isRenewal} finalPrice={success.finalPrice} />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing-section" className="py-24 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Gói Tập Luyện</p>
          <h2 className="text-4xl font-black text-[#18181B] mb-3">Đăng Ký Gói Tập</h2>
          <p className="text-[#18181B]/60 text-sm">Chu kỳ linh hoạt · Không phí ẩn · Hoàn tiền trong 7 ngày nếu không hài lòng</p>
        </div>

        {/* Two billing cards optimized with Badges and high contrast */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Monthly card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`w-full text-left rounded-3xl p-6 border-2 relative cursor-pointer transition-all flex flex-col justify-between ${
              billing === 'monthly' ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-lg shadow-[#FF5722]/10' : 'border-[#18181B]/10 bg-white/40'
            }`}
            onClick={() => setBilling('monthly')}
          >
            <span className="absolute -top-3.5 left-5 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-[#FF5722] text-white flex items-center gap-1 shadow">
              <Flame className="w-3 h-3" /> 🔥 Most Popular
            </span>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-[#18181B] text-xl">Gói Tháng</h3>
                  <p className="text-xs text-[#18181B]/60 mt-0.5">Hủy bất cứ lúc nào, gia hạn linh hoạt</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  billing === 'monthly' ? 'border-[#FF5722]' : 'border-[#18181B]/20'
                }`}>
                  {billing === 'monthly' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-xs text-[#18181B]/50 line-through">799.000đ</span>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-[#18181B]">559.000đ</span>
                  <span className="text-[#18181B]/60 text-xs mb-1">/ tháng đầu</span>
                </div>
                <p className="text-[10px] text-[#FF5722] font-bold">Giảm ngay 30% cho tháng đăng ký đầu tiên</p>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setBilling('monthly'); setShowModal(true); }}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                billing === 'monthly' ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20' : 'bg-[#18181B] text-white'
              }`}
            >
              Chọn Gói Tháng <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Yearly card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`w-full text-left rounded-3xl p-6 border-2 relative cursor-pointer transition-all flex flex-col justify-between ${
              billing === 'yearly' ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-lg shadow-[#FF5722]/10' : 'border-[#18181B]/10 bg-white/40'
            }`}
            onClick={() => setBilling('yearly')}
          >
            <span className="absolute -top-3.5 left-5 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-gradient-to-r from-amber-400 to-amber-600 text-black flex items-center gap-1 shadow">
              <Award className="w-3 h-3" /> 💎 Best Value
            </span>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-[#18181B] text-xl">Gói Năm</h3>
                  <p className="text-xs text-[#18181B]/60 mt-0.5">Tiết kiệm nhiều nhất, đặc quyền VIP</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  billing === 'yearly' ? 'border-[#FF5722]' : 'border-[#18181B]/20'
                }`}>
                  {billing === 'yearly' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF5722]" />}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <span className="text-xs text-[#18181B]/50 line-through">9.588.000đ</span>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black text-[#18181B]">4.800.000đ</span>
                  <span className="text-[#18181B]/60 text-xs mb-1">/ năm</span>
                </div>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> Tiết kiệm 50% (Được tặng 6 tháng tập miễn phí)
                </p>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setBilling('yearly'); setShowModal(true); }}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                billing === 'yearly' ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20' : 'bg-[#18181B] text-white'
              }`}
            >
              Chọn Gói Năm <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 border border-[#18181B]/10 mb-8"
        >
          <p className="text-xs text-[#18181B]/50 uppercase tracking-wider font-extrabold mb-4">Mọi Gói Hội Viên Đều Bao Gồm</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs text-[#18181B]/80 font-medium">
            {MEMBER_BENEFITS.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#4ade80]" />
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Big CTA with high visual emphasis */}
        <AnimatePresence mode="wait">
          <motion.div key={billing}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
              style={{
                background: '#FF5722',
                boxShadow: '0 8px 30px rgba(255,87,34,0.3)',
              }}
            >
              <Zap className="w-4 h-4 fill-white" />
              Đăng Ký {billing === 'yearly' ? 'Gói Năm (4,8M/năm)' : 'Gói Tháng (559K/tháng)'} Ngay
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-[10px] text-[#18181B]/40 mt-4 leading-relaxed">
          Thanh toán bảo mật · Kích hoạt ngay · Nhấn để đăng ký tài khoản và mua gói trong cùng 1 bước.
        </p>

        <AnimatePresence>
          {showModal && (
            <CheckoutModal
              billing={billing}
              onClose={() => setShowModal(false)}
              onSuccess={(res) => { setShowModal(false); setSuccess(res); }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── 5. TRUST FEATURE CARDS (STRIPE-LIKE GRID) ───
function TrustSection() {
  const trusts = [
    { title: 'PT Đạt Chuẩn Quốc Tế', desc: '100% PT có chứng chỉ huấn luyện uy tín NASM, ISSA. Đồng hành bài bản.', icon: Shield },
    { title: 'Thiết Bị Nhập Khẩu Mỹ', desc: 'Hệ thống máy tập cao cấp chính hãng từ Life Fitness và Hammer Strength.', icon: Dumbbell },
    { title: 'Quản Lý Gói Linh Hoạt', desc: 'Bảo lưu, gia hạn hoặc nâng cấp gói tập trực tuyến 100%, không thủ tục rườm rà.', icon: Calendar },
    { title: 'Phòng Tập Tiêu Chuẩn 5★', desc: 'Vệ sinh khử khuẩn liên tục mỗi 2 giờ, hệ thống lọc khí tươi thoáng đãng.', icon: CheckCircle },
    { title: 'Hỗ Trợ & Trợ Lý AI 24/7', desc: 'AI FitBot luôn sẵn sàng hỗ trợ lên giáo án tập luyện và tính toán calorie tức thì.', icon: Sparkles },
    { title: 'Cam Kết Hoàn Tiền 7 Ngày', desc: 'Hoàn lại 100% học phí trong vòng 7 ngày đầu nếu bạn cảm thấy không phù hợp.', icon: Gift },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Đặc Quyền Vượt Trội</p>
        <h2 className="text-3xl font-black text-[#18181B]">Cam Kết Dịch Vụ Của FitFuel+</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trusts.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            className="glass rounded-3xl p-6 border border-[#18181B]/10 premium-card hover:border-[#FF5722]/20 flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF5722]/10 border border-[#FF5722]/25 flex items-center justify-center shrink-0">
              <t.icon className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#18181B] mb-1.5">{t.title}</h4>
              <p className="text-xs text-[#18181B]/60 leading-relaxed">{t.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── 6. STATIC MOCK DATA ───
const stats = [
  { value: '10,000+', label: 'Hội Viên Tin Dùng' },
  { value: '4.9★', label: 'Đánh Giá Trải Nghiệm' },
  { value: '20+', label: 'PT Đẳng Cấp Quốc Tế' },
  { value: '98%', label: 'Hài Lòng Với AI Bot' },
];

const features = [
  { icon: Dumbbell, title: 'Theo Dõi Tập Luyện', desc: 'Ghi chép từng set, theo dõi PRs, trực quan hóa quá trình tiến bộ.', color: '#FF5722', to: '/dashboard', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=520&h=320&fit=crop' },
  { icon: Utensils, title: 'Dinh Dưỡng Nội Bộ', desc: 'Đặt các bữa ăn theo chuẩn macro từ đối tác dinh dưỡng uy tín.', color: '#3b82f6', to: '/nutrition', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=520&h=320&fit=crop' },
  { icon: ShoppingBag, title: 'Gear Hub', desc: 'Mua sắm dụng cụ thể thao và thực phẩm bổ sung chính hãng.', color: '#FF5722', to: '/gear', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=520&h=320&fit=crop' },
  { icon: Award, title: 'Hộ Chiếu Thể Hình', desc: 'Nhận huy hiệu, duy trì streak, thăng hạng thể hình của bạn.', color: '#a855f7', to: '/dashboard', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=520&h=320&fit=crop' },
  { icon: Users, title: 'Cộng Đồng', desc: 'Chia sẻ bài tập, bữa ăn và thành tựu với những vận động viên khác.', color: '#ec4899', to: '/social', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=520&h=320&fit=crop' },
];

const reviews = [
  { name: 'Khánh Vy', role: 'Nhân viên Văn phòng', rating: 5, text: 'Từng rất e sợ việc đi tập, sợ bị dòm ngó. Nhờ biểu đồ mật độ của FitFuel, mình chọn khung giờ vắng (13h chiều) để tập một mình thoải mái. Đã giảm 12kg sau 6 tháng!', avatar: 'https://images.unsplash.com/photo-1546961342-ea5f62d1a22b?w=80&h=80&fit=crop&crop=face' },
  { name: 'Minh Hoàng', role: 'Lập trình viên', rating: 5, text: 'Đặt cơm theo chuẩn macro sau khi tập tiện cực kỳ. FitFuel giúp mình tiết kiệm 2 tiếng nấu ăn mỗi Chủ Nhật mà vẫn đủ chất.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { name: 'Bảo Trân', role: 'Người mới bắt đầu', rating: 5, text: 'Lúc đầu lo lắng lắm nhưng PT kèm cặp nhiệt tình từng nhịp thở, không có cảm giác bị bỏ rơi hay phán xét. Đánh giá 5 sao!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' },
];

function ActiveMembershipSection({ membership }) {
  return (
    <section id="pricing-section" className="py-24 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Gói Tập Luyện</p>
          <h2 className="text-3xl font-black text-[#18181B]">Gói Của Bạn</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 border border-[#FF5722]/30 text-center"
          style={{ boxShadow: '0 0 60px rgba(255,87,34,0.15)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(255,87,34,0.15)', border: '1px solid rgba(255,87,34,0.3)' }}>
            <ShieldCheck className="w-8 h-8 text-[#FF5722]" />
          </div>
          <p className="text-xs font-semibold text-[#4ade80] uppercase tracking-widest mb-1">● Đang hoạt động</p>
          <h3 className="text-2xl font-black text-[#18181B] mb-1">FitFuel+ <span className="text-[#FF5722]">Member</span></h3>
          <p className="text-[#18181B]/60 text-sm mb-6">{membership.plan_name || 'Gói thành viên'}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl p-4 border border-[#18181B]/10">
              <p className="text-xs text-[#18181B]/60 mb-1">Ngày bắt đầu</p>
              <p className="font-bold text-[#18181B] text-sm">{membership.start_date || '—'}</p>
            </div>
            <div className="glass rounded-xl p-4 border border-[#18181B]/10">
              <p className="text-xs text-[#18181B]/60 mb-1 flex items-center gap-1 justify-center"><Calendar className="w-3 h-3" />Hết hạn</p>
              <p className="font-bold text-[#FF5722] text-sm">{membership.end_date || '—'}</p>
            </div>
          </div>
          <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: '#FF5722', boxShadow: '0 0 30px rgba(255,87,34,0.3)' }}>
            <Dumbbell className="w-4 h-4" /> Vào Dashboard
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const roleHome = {
  member: '/dashboard',
  gymOwner: '/gym-owner/dashboard',
  admin: '/admin/dashboard',
};


// ─── GOAL ENGINE WIZARD (AUTO ADVICE & QUIZ) ───
function GoalEngineWizard({ onOpenReg }) {
  const [step, setStep] = useState(0); // 0: Start, 1: Goal, 2: Frequency, 3: Exp, 4: Suggestion
  const [goal, setGoal] = useState('');
  const [freq, setFreq] = useState('');
  const [exp, setExp] = useState('');

  const restart = () => {
    setStep(1);
    setGoal('');
    setFreq('');
    setExp('');
  };

  const getAdvice = () => {
    let adviceText = '';
    let plan = '';
    
    if (goal === 'muscle') {
      adviceText = 'Đo chỉ số cơ thể InBody để xem lượng cơ hiện tại. Luyện tập kháng lực 3-4 buổi/tuần, bổ sung 1.6g - 2g protein/kg trọng lượng cơ thể mỗi ngày.';
      plan = 'Gói Năm (Tiết kiệm 50%) vì lộ trình tăng cơ bền vững cần tối thiểu 6-12 tháng.';
    } else if (goal === 'fat') {
      adviceText = 'Luyện tập hỗn hợp kháng lực + Cardio 30 phút sau tập. Ăn thâm hụt calo nhẹ (từ 300-500 kcal). Đặt cơm theo chuẩn Macro tại FitFuel Food Hub để kiểm soát dinh dưỡng.';
      plan = 'Gói Tháng (Tặng 30% tháng đầu) hoặc Gói Năm để duy trì kỷ luật dài hạn.';
    } else if (goal === 'endurance') {
      adviceText = 'Luyện tập các bài cardio cường độ cao (HIIT) kết hợp các bài tập thể lực nhóm cơ lớn. Đảm bảo nạp đủ tinh bột phức hợp trước buổi tập.';
      plan = 'Gói Năm (VIP Pass) để truy cập không giới hạn các khu vực tập nâng cao.';
    } else {
      adviceText = 'Luyện tập nhẹ nhàng với các bài kéo giãn cơ và PT hướng dẫn sử dụng máy an toàn. Tránh đi tập các khung giờ cao điểm (18:00) để không bị stress.';
      plan = 'Nhận Vé Tập Thử Miễn Phí (Free Trial) để làm quen không gian yên tĩnh.';
    }

    return { advice: adviceText, plan: plan };
  };

  const adviceObj = getAdvice();

  return (
    <section className="py-20 bg-gradient-to-b from-[#F0F2F5] via-white to-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">AI FitAdvisor</p>
          <h2 className="text-3xl font-black text-[#18181B] mb-3">Công Cụ Gợi Ý Lộ Trình Tự Động</h2>
          <p className="text-[#18181B]/60 text-sm max-w-lg mx-auto">
            Chỉ mất 30 giây trả lời câu hỏi để AI thiết kế lộ trình tập luyện và gợi ý gói hội viên tối ưu nhất cho bạn.
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border border-[#18181B]/10 bg-white/60 min-h-[300px] flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/5 rounded-full blur-2xl pointer-events-none" />
          
          {step === 0 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-2xl flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-[#FF5722]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-[#18181B] text-lg">Tìm kiếm lộ trình dành riêng cho bạn?</h3>
                <p className="text-xs text-[#18181B]/60 max-w-sm mx-auto leading-relaxed">
                  Chúng tôi phân tích mục tiêu, thời gian biểu và kinh nghiệm để đề xuất phương án tập luyện phù hợp nhất.
                </p>
              </div>
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-[#FF5722] text-white text-xs font-black rounded-xl hover:opacity-90 transition-all cursor-pointer">
                Bắt đầu phân tích ngay
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-[#FF5722]">Bước 1/3</span>
                <span className="text-[10px] text-[#18181B]/40">Mục tiêu chính</span>
              </div>
              <h3 className="font-extrabold text-[#18181B] text-base">Mục tiêu thể hình lớn nhất của bạn là gì?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'muscle', label: '💪 Tăng cơ bắp & Sức mạnh' },
                  { id: 'fat', label: '🔥 Giảm mỡ thừa & Thon gọn' },
                  { id: 'endurance', label: '⚡ Tăng thể lực & Sức bền' },
                  { id: 'health', label: '💚 Cải thiện sức khỏe & Cột sống' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { setGoal(opt.id); setStep(2); }}
                    className="w-full p-4 rounded-2xl border border-[#18181B]/10 hover:border-[#FF5722] bg-white text-left text-xs font-bold text-[#18181B] transition-all hover:bg-[#FF5722]/5 cursor-pointer">
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-[#FF5722]">Bước 2/3</span>
                <span className="text-[10px] text-[#18181B]/40">Tần suất tập luyện</span>
              </div>
              <h3 className="font-extrabold text-[#18181B] text-base">Bạn có thể dành bao nhiêu buổi tập một tuần?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'low', label: '📅 1 - 2 buổi', desc: 'Bận rộn/Duy trì' },
                  { id: 'mid', label: '📅 3 - 4 buổi', desc: 'Lý tưởng/Cải thiện' },
                  { id: 'high', label: '📅 5+ buổi', desc: 'Chuyên sâu/Bứt phá' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { setFreq(opt.id); setStep(3); }}
                    className="w-full p-4 rounded-2xl border border-[#18181B]/10 hover:border-[#FF5722] bg-white text-center text-xs font-bold text-[#18181B] transition-all hover:bg-[#FF5722]/5 flex flex-col gap-1 cursor-pointer">
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-[#18181B]/40 font-medium">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-[#18181B]/50 hover:text-[#18181B] font-semibold cursor-pointer">← Quay lại</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-[#FF5722]">Bước 3/3</span>
                <span className="text-[10px] text-[#18181B]/40">Kinh nghiệm</span>
              </div>
              <h3 className="font-extrabold text-[#18181B] text-base">Mức độ kinh nghiệm trong phòng gym của bạn?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'beg', label: '🔰 Mới hoàn toàn', desc: 'Chưa biết dùng máy' },
                  { id: 'int', label: '🏋️ Đã tập dưới 6 tháng', desc: 'Biết động tác cơ bản' },
                  { id: 'adv', label: '👑 Tập lâu năm', desc: 'Tập nâng cao/Tự do' },
                ].map(opt => (
                  <button key={opt.id} onClick={() => { setExp(opt.id); setStep(4); }}
                    className="w-full p-4 rounded-2xl border border-[#18181B]/10 hover:border-[#FF5722] bg-white text-center text-xs font-bold text-[#18181B] transition-all hover:bg-[#FF5722]/5 flex flex-col gap-1 cursor-pointer">
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-[#18181B]/40 font-medium">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-[#18181B]/50 hover:text-[#18181B] font-semibold cursor-pointer">← Quay lại</button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-[#18181B]/10 pb-3">
                <span className="text-xs font-black uppercase text-[#FF5722] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-[#FF5722]" /> Kết quả đề xuất từ AI
                </span>
                <button onClick={restart} className="text-xs text-[#FF5722] font-extrabold hover:underline cursor-pointer">Làm lại ↺</button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-2xl p-4 text-xs">
                  <p className="font-extrabold text-[#4ade80] mb-1">💡 Lộ trình luyện tập dành riêng cho bạn:</p>
                  <p className="text-[#18181B]/80 leading-relaxed font-medium">{adviceObj.advice}</p>
                </div>

                <div className="bg-[#FF5722]/5 border border-[#FF5722]/10 rounded-2xl p-4 text-xs flex justify-between items-center gap-4">
                  <div>
                    <p className="font-black text-[#FF5722] uppercase text-[10px] tracking-wide">Đề xuất gói hội viên:</p>
                    <p className="font-extrabold text-sm text-[#18181B] mt-0.5">{adviceObj.plan}</p>
                  </div>
                  {goal === 'health' ? (
                    <button onClick={onOpenReg} className="px-4 py-2.5 bg-[#FF5722] text-white text-xs font-black rounded-xl hover:opacity-95 transition-all shrink-0 cursor-pointer">
                      Đăng Ký Tập Thử
                    </button>
                  ) : (
                    <a href="#pricing-section" className="px-4 py-2.5 bg-[#FF5722] text-white text-xs font-black rounded-xl hover:opacity-95 transition-all shrink-0 cursor-pointer text-center">
                      Đăng Ký Gói Tập
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


// ─── 7. MAIN LANDING PAGE ───
export default function LandingPage() {
  const { user } = useAuth();
  const [activeMembership, setActiveMembership] = useState(null);
  const [membershipLoaded, setMembershipLoaded] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  
  // Modals visibility state
  const [showRegModal, setShowRegModal] = useState(false);
  const [showAnxietyPopup, setShowAnxietyPopup] = useState(false);

  const defaultAnnouncements = [
    {
      announcement_id: 'mock-1',
      title: 'Bảo trì định kỳ khu vực Cardio',
      body: 'Các máy chạy bộ số 3 và số 5 sẽ được bảo trì vào sáng Thứ Hai từ 8:00 đến 11:00. Rất mong quý hội viên thông cảm.',
      priority: 'high',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    },
    {
      announcement_id: 'mock-2',
      title: 'Thử thách Plank Challenge tuần mới',
      body: 'Hội viên hoàn thành thử thách Plank 5 phút sẽ nhận được 50 FitCoin thưởng. Đăng ký tham gia trực tiếp với huấn luyện viên.',
      priority: 'medium',
      created_at: new Date(Date.now() - 24 * 3600 * 1000 * 4).toISOString(),
    },
  ];

  useEffect(() => {
    // Scroll trigger for Beginner Anxiety popup (triggers when scrolled past 50% of page height)
    const handleScroll = () => {
      const shown = sessionStorage.getItem('anxiety_popup_shown');
      if (!shown) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0 && (scrollTop / docHeight) >= 0.5) {
          setShowAnxietyPopup(true);
          sessionStorage.setItem('anxiety_popup_shown', 'true');
        }
      }
    };
    // Clear the shown status on component mount, so that F5/refresh allows it to show again
    sessionStorage.removeItem('anxiety_popup_shown');

    window.addEventListener('scroll', handleScroll);

    api.get('/api/gym/announcements')
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setAnnouncements(list.length > 0 ? list : defaultAnnouncements);
      })
      .catch(() => setAnnouncements(defaultAnnouncements));

    if (!user) { setMembershipLoaded(true); return; }
    api.get('/api/gym/memberships/my')
      .then(data => {
        const list = data.items || data || [];
        setActiveMembership(list.find(m => m.status === 'active') || null);
      })
      .catch(() => {})
      .finally(() => setMembershipLoaded(true));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user]);

  useEffect(() => {
    if (showRegModal || showAnxietyPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRegModal, showAnxietyPopup]);

  return (
    <div className="relative">
      {/* HERO SECTION IMPROVED */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop" alt="Hero" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-[#FF5722]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute inset-0 cinematic-grid opacity-25" />
          <CinematicMapLayer showCards intensity="strong" />
          <div className="absolute right-[8%] top-[20%] h-60 w-60 rounded-full bg-[#FF5722]/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 flex flex-col lg:flex-row lg:items-center justify-between gap-12 w-full">
          {/* Cột Trái: Nội dung chữ */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-neon text-[#FF5722] text-xs font-black mb-6">
              <Zap className="w-3.5 h-3.5" />
              ĐỒNG HÀNH LUYỆN TẬP THẾ HỆ MỚI
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Tập Thông Minh.<br />
              Khỏe Mạnh Hơn.<br />
              <span className="text-gradient-orange">Stay Consistent.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-md leading-relaxed">
              Tránh đám đông với biểu đồ dự báo mật độ phòng tập. Nhận giáo án AI cá nhân hóa và quản lý thực đơn dinh dưỡng trọn gói cùng FitFuel+.
            </p>
            <div className="flex flex-wrap gap-3.5">
              {user ? (
                <Link to={roleHome[user.role] || '/dashboard'} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FF5722] text-white font-extrabold text-xs hover:bg-[#FF5722]/90 transition-all shadow-md btn-cinematic cursor-pointer">
                  Vào Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button onClick={() => setShowRegModal(true)} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FF5722] text-white font-extrabold text-xs hover:bg-[#FF5722]/90 transition-all shadow-md btn-cinematic cursor-pointer">
                  Bắt Đầu Trải Nghiệm <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <a href="#pricing-section" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md text-white font-bold text-xs hover:bg-white/20 transition-all btn-cinematic border border-white/25">
                Xem Bảng Giá
              </a>
            </div>
          </motion.div>

          {/* Cột Phải: Floating Stats (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-4 relative pr-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-5 rounded-3xl border border-white/20 shadow-2xl w-60 floating-card"
            >
              <span className="text-3xl font-black text-gradient-orange">10,000+</span>
              <p className="text-xs text-white/70 font-semibold mt-1">Hội viên đồng hành bứt phá</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="glass p-5 rounded-3xl border border-white/20 shadow-2xl w-60 floating-card"
            >
              <div className="flex items-center gap-1">
                <span className="text-3xl font-black text-gradient-orange">4.9★</span>
                <div className="flex gap-0.5">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <p className="text-xs text-white/70 font-semibold mt-1">Đánh giá độ hài lòng dịch vụ</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-5 rounded-3xl border border-white/20 shadow-2xl w-60 floating-card"
            >
              <span className="text-3xl font-black text-gradient-orange">20+</span>
              <p className="text-xs text-white/70 font-semibold mt-1">PT chứng chỉ quốc tế kèm cặp</p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F7FA] to-transparent" />
      </section>

      {/* STATS STRIP */}
      <section className="py-12 border-y border-[#18181B]/10 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center glass rounded-2xl p-5 border border-[#18181B]/10 premium-card"
            >
              <p className="text-3xl font-black text-[#FF5722] mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-[#18181B]/60 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GOAL ENGINE WIZARD */}
      {!user && <GoalEngineWizard onOpenReg={() => setShowRegModal(true)} />}

      {/* FEATURES HUB */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-3">Mọi Thứ Bạn Cần</p>
          <h2 className="text-4xl font-black text-[#18181B]">Một Nền Tảng.<br />Mọi Mục Tiêu.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, delay: i * 0.05 }}
            >
              <Link to={f.to} className="group glass rounded-3xl hover:bg-white/[0.06] transition-all border border-[#18181B]/10 hover:border-[#18181B]/15 premium-card block h-full overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <img src={f.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#FF5722]/15 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl" style={{ background: `${f.color}22`, border: `1px solid ${f.color}40`, boxShadow: `0 0 34px ${f.color}22` }}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-base font-bold text-[#18181B] mb-2">{f.title}</h3>
                  <p className="text-xs text-[#18181B]/60 leading-relaxed mb-4">{f.desc}</p>
                  <span className="text-xs font-black flex items-center gap-1 transition-all" style={{ color: f.color }}>
                    Khám phá ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* GYM CROWD FORECAST TIMELINE */}
      <GymCrowdTimeline />

      {/* PRICING / MEMBERSHIP */}
      {!user ? (
        <PricingSection onBookTrial={() => setShowRegModal(true)} />
      ) : (
        user.role !== 'gymOwner' && user.role !== 'admin' && membershipLoaded && (
          <ActiveMembershipSection membership={activeMembership || {}} />
        )
      )}

      {/* FOOD PREVIEW */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Food Hub</p>
              <h2 className="text-3xl font-black text-[#18181B]">Năng Lượng Cho Hiệu Suất</h2>
            </div>
            <Link to="/nutrition" className="hidden sm:flex items-center gap-1 text-sm font-bold text-[#18181B]/60 hover:text-[#18181B] transition-colors">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Power Protein Bowl', cal: 520, protein: 45, price: '89.000đ', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', badge: 'Bán chạy' },
              { name: 'Keto Warrior Plate', cal: 480, protein: 38, price: '95.000đ', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', badge: 'Keto' },
              { name: 'Vegan Gains Bowl', cal: 440, protein: 28, price: '79.000đ', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', badge: 'Thuần chay' },
            ].map(item => (
              <Link key={item.name} to="/nutrition" className="group rounded-3xl overflow-hidden glass border border-[#18181B]/10 hover:border-[#18181B]/15 transition-all premium-card block">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#FF5722] text-white text-[10px] font-black uppercase tracking-wider">{item.badge}</span>
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-sm text-[#18181B] mb-1.5">{item.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#18181B]/60">
                    <span>{item.cal} kcal · {item.protein}g protein</span>
                    <span className="text-[#FF5722] font-black">{item.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <TrustSection />

      {/* SOCIAL PROOF (AIRBNB REVIEW CARDS) */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Đánh Giá Thực Tế</p>
            <h2 className="text-3xl font-black text-[#18181B]">Cộng Đồng Nói Gì Về FitFuel+</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, idx) => (
              <div key={idx} className="glass rounded-3xl p-6 border border-[#18181B]/10 premium-card bg-white/40 flex flex-col justify-between h-full">
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#18181B]/80 leading-relaxed italic mb-6">"{r.text}"</p>
                </div>
                <div className="flex items-center gap-3.5 border-t border-[#18181B]/5 pt-4">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-[#18181B]/15" />
                  <div>
                    <p className="text-xs font-extrabold text-[#18181B]">{r.name}</p>
                    <p className="text-[10px] text-[#18181B]/60 font-semibold">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS SECTION */}
      {announcements.length > 0 && (
        <section className="py-16 bg-[#18181B]/5 border-y border-[#18181B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2.5 mb-8">
              <Megaphone className="w-5 h-5 text-[#FF5722]" />
              <div>
                <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest">Bảng Tin Phòng Tập</p>
                <h2 className="text-3xl font-black text-[#18181B]">Thông Báo Mới Nhất</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {announcements.slice(0, 2).map(a => (
                <div key={a.announcement_id} className="glass rounded-3xl p-6 border border-[#18181B]/10 premium-card hover:border-[#FF5722]/30 transition-all flex flex-col justify-between bg-white/40">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        a.priority === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        a.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                        {a.priority === 'high' ? 'Khẩn cấp' : a.priority === 'medium' ? 'Sự kiện' : 'Thông tin'}
                      </span>
                      <span className="text-[10px] text-[#18181B]/40 font-bold">{new Date(a.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#18181B] mb-2 leading-snug">{a.title}</h4>
                    <p className="text-xs text-[#18181B]/60 leading-relaxed">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM HERO CTA */}
      {(!user || (user.role !== 'gymOwner' && user.role !== 'admin')) && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative rounded-3xl overflow-hidden glass p-12 md:p-16 border border-[#18181B]/10 premium-card">
            <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop')" }} />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-5xl font-black text-[#18181B]">
                Sẵn sàng <span className="text-gradient-orange">Bứt Phá?</span>
              </h2>
              <p className="text-[#18181B]/60 text-sm max-w-lg mx-auto">
                Gia nhập cộng đồng hơn 10,000+ hội viên đang thay đổi hình thể mỗi ngày. Hãy bắt đầu ngay hôm nay để nhận ưu đãi tập thử 0đ.
              </p>
              <div className="flex justify-center gap-3.5 flex-wrap">
                <button
                  onClick={() => setShowRegModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#FF5722] text-white font-black text-xs hover:opacity-95 transition-all shadow-md shadow-[#FF5722]/30 cursor-pointer"
                >
                  Nhận Vé Tập Thử Miễn Phí <Zap className="w-4 h-4 fill-white" />
                </button>
                <a href="#pricing-section" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#18181B] text-white font-black text-xs hover:bg-black transition-all cursor-pointer">
                  Đăng Ký Gói Tập
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── POPUPS & MODALS ── */}
      <AnimatePresence>
        {/* Beginner Anxiety Popup */}
        {showAnxietyPopup && (
          <BeginnerAnxietyPopup
            onBookTrial={() => setShowRegModal(true)}
            onClose={() => setShowAnxietyPopup(false)}
          />
        )}

        {/* Lead Registration Modal (Free Trial) */}
        {showRegModal && (
          <RegistrationModal
            onClose={() => setShowRegModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
