import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Dumbbell, Utensils, ShoppingBag, Award, Users, Star, ChevronRight, CheckCircle, Gift, ShieldCheck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicMapLayer from '../../components/common/CinematicMapLayer';
import { CheckoutModal, SuccessScreen } from '../member/MembershipPage';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  MONTHLY_PRICE, YEARLY_PRICE, MEMBER_BENEFITS, YEARLY_DISCOUNT_PCT
} from '../../data/mockMembership';

const fmtLanding = (n) => n.toLocaleString('vi-VN');

function HeroPricingWidget() {
  const [billing, setBilling] = useState('monthly');
  const price = billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE;
  const saving = MONTHLY_PRICE * 12 - YEARLY_PRICE;

  return (
    <div className="glass rounded-2xl border border-[#18181B]/10 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF5722]/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-[#18181B]">FitFuel+ Member</h3>
          <p className="text-[11px] text-[#18181B]/60">Chu kỳ linh hoạt, tối ưu chi phí</p>
        </div>
        <span className="px-2 py-1 rounded bg-[#FF5722]/8 text-[#FF5722] text-[9px] font-black tracking-wider uppercase">
          Giá Tốt Nhất
        </span>
      </div>

      {/* Monthly/Yearly toggle pills */}
      <div className="flex bg-white p-1 rounded-xl gap-1 mb-4 border border-[#18181B]/10">
        {['monthly', 'yearly'].map((type) => (
          <button
            key={type}
            onClick={() => setBilling(type)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              billing === type ? 'bg-[#FF5722] text-white shadow-lg' : 'text-white/60 hover:text-white/60'
            }`}
          >
            {type === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
            {type === 'yearly' && (
              <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF5722] text-[#fff] text-[8px] font-black">
                -{YEARLY_DISCOUNT_PCT}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Price tag */}
      <div className="mb-4">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-black text-[#18181B]">{fmtLanding(price)}</span>
          <span className="text-[#18181B]/60 text-xs mb-0.5">đ / {billing === 'monthly' ? 'tháng' : 'năm'}</span>
        </div>
        {billing === 'yearly' ? (
          <p className="text-[10px] text-[#4ade80] font-semibold mt-1 flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" /> Tiết kiệm {fmtLanding(saving)}đ (2 tháng miễn phí)
          </p>
        ) : (
          <p className="text-[10px] text-[#18181B]/40 mt-1">Gia hạn từng tháng · Hủy bất cứ lúc nào</p>
        )}
      </div>

      {/* Mini benefits */}
      <ul className="space-y-2 mb-5 border-t border-[#18181B]/10 pt-4">
        {[
          'Vào gym 24/7 toàn hệ thống',
          'Tất cả lớp nhóm không giới hạn',
          'Theo dõi dinh dưỡng & macro',
          'AI FitBot trợ lý cá nhân',
        ].map((text, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-[#18181B]/80">
            <CheckCircle className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#pricing-section"
        className="w-full py-3 rounded-xl font-black text-xs text-center flex items-center justify-center gap-2 text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{
          background: '#FF5722',
          boxShadow: '0 0 30px rgba(255,87,34,0.25)',
        }}
      >
        <Zap className="w-3.5 h-3.5" /> Đăng ký gói tập ngay
      </a>
    </div>
  );
}

function PricingSection() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(null);

  const price = billing === 'yearly' ? YEARLY_PRICE : MONTHLY_PRICE;
  const saving = MONTHLY_PRICE * 12 - YEARLY_PRICE;

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
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Gói Tập Luyện</p>
          <h2 className="text-4xl font-black text-[#18181B] mb-3">Đăng Ký Gói Tập</h2>
          <p className="text-[#18181B]/60 text-sm">Tất cả ưu đãi giống nhau · Hủy bất kỳ lúc nào · 7 ngày hoàn tiền</p>
        </div>

        {/* Two billing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {['monthly', 'yearly'].map((type, i) => {
            const isYearly = type === 'yearly';
            const cardPrice = isYearly ? YEARLY_PRICE : MONTHLY_PRICE;
            const active = billing === type;
            return (
              <motion.button
                key={type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                onClick={() => setBilling(type)}
                className="w-full text-left rounded-2xl p-5 border-2 relative transition-all duration-200 cursor-pointer focus:outline-none"
                style={{
                  border: `2px solid ${active ? '#FF5722' : 'rgba(255,255,255,0.08)'}`,
                  background: active
                    ? 'rgba(255,87,34,0.08)'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: active
                    ? '0 0 40px rgba(255,87,34,0.15)'
                    : 'none',
                }}
              >
                {isYearly && (
                  <span className="absolute -top-3.5 left-4 px-3 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: '#FF5722', color: '#fff' }}>
                    🔥 Tiết kiệm {YEARLY_DISCOUNT_PCT}%
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-black text-[#18181B] text-lg">{isYearly ? 'Gói Năm' : 'Gói Tháng'}</p>
                    <p className="text-xs text-[#18181B]/60 mt-0.5">
                      {isYearly ? '2 tháng miễn phí · Gia hạn 12 tháng' : 'Linh hoạt · Hủy bất cứ lúc nào'}
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: active ? '#FF5722' : 'rgba(255,255,255,0.2)' }}>
                    {active && <div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: '#FF5722' }} />}
                  </div>
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-black text-[#18181B]">{fmtLanding(cardPrice)}</span>
                  <span className="text-[#18181B]/60 text-sm mb-0.5">đ / {isYearly ? 'năm' : 'tháng'}</span>
                </div>
                {isYearly && (
                  <p className="text-xs text-[#4ade80] font-semibold mt-1 flex items-center gap-1">
                    <Gift className="w-3 h-3" /> Tiết kiệm {fmtLanding(saving)}đ so với gói tháng
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Benefits grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="glass rounded-2xl p-6 border border-[#18181B]/10 mb-6"
        >
          <p className="text-xs text-[#18181B]/60 uppercase tracking-wider font-semibold mb-4">Tất cả ưu đãi bao gồm</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
            {MEMBER_BENEFITS.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#18181B]/75">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#4ade80]" />
                {b.text}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <AnimatePresence mode="wait">
          <motion.div key={billing}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: '#FF5722',
                boxShadow: '0 0 40px rgba(255,87,34,0.3)',
              }}
            >
              <Zap className="w-5 h-5" />
              Đăng ký Gói {billing === 'yearly' ? 'Năm' : 'Tháng'} — {fmtLanding(price)}đ
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-[#18181B]/25 mt-4">
          Sau khi nhấn đăng ký, bạn sẽ được hướng dẫn tạo tài khoản và thanh toán ngay trong một bước.
        </p>

        <AnimatePresence>
          {showModal && (
            <CheckoutModal
              billing={billing}
              onClose={() => setShowModal(false)}
              onSuccess={(res) => { setShowModal(false); setSuccess(res); setTimeout(() => navigate('/dashboard'), 2000); }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}



const stats = [
  { value: '1,800+', label: 'Vận Động Viên' },
  { value: '50+', label: 'Bữa Ăn Sạch Mỗi Ngày' },
  { value: '2,400+', label: 'Sản Phẩm Gear' },
  { value: '98%', label: 'Tỷ Lệ Hài Lòng' },
];

const features = [
  { icon: Dumbbell, title: 'Theo Dõi Tập Luyện', desc: 'Ghi chép từng set, theo dõi PRs, trực quan hóa quá trình tiến bộ.', color: '#FF5722', to: '/dashboard', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=520&h=320&fit=crop' },
  { icon: Utensils, title: 'Dinh Dưỡng Nội Bộ', desc: 'Đặt các bữa ăn theo chuẩn macro từ đối tác dinh dưỡng uy tín.', color: '#3b82f6', to: '/nutrition', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=520&h=320&fit=crop' },
  { icon: ShoppingBag, title: 'Gear Hub', desc: 'Mua sắm dụng cụ thể thao và thực phẩm bổ sung chính hãng.', color: '#FF5722', to: '/gear', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=520&h=320&fit=crop' },
  { icon: Award, title: 'Hộ Chiếu Thể Hình', desc: 'Nhận huy hiệu, duy trì streak, thăng hạng thể hình của bạn.', color: '#a855f7', to: '/dashboard', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=520&h=320&fit=crop' },
  { icon: Users, title: 'Cộng Đồng', desc: 'Chia sẻ bài tập, bữa ăn và thành tựu với những vận động viên khác.', color: '#ec4899', to: '/social', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=520&h=320&fit=crop' },
];


const reviews = [
  { name: 'Marcus T.', role: 'Powerlifter', rating: 5, text: 'FitFuel+ đã hoàn toàn thay đổi cách tôi tập luyện. Tính năng theo dõi gym thật tuyệt vời — Tôi thấy chính xác sự tiến bộ của mình.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
  { name: 'Jess N.', role: 'Vận Động Viên CrossFit', rating: 5, text: 'Tôi đã thử nghiệm mọi ứng dụng. Không gì sánh bằng. Sự kết hợp giữa đặt đồ ăn và theo dõi macro giúp tôi tiết kiệm 2 giờ mỗi Chủ nhật.', avatar: 'https://images.unsplash.com/photo-1546961342-ea5f62d1a22b?w=60&h=60&fit=crop&crop=face' },
  { name: 'Ryan K.', role: 'Chủ Phòng Tập', rating: 5, text: 'Dashboard B2B cho chủ phòng tập thật đẳng cấp. Cuối cùng cũng có một nền tảng thực sự hiểu những gì chúng tôi cần.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face' },
];


function ActiveMembershipSection({ membership }) {
  const fmt = (n) => n?.toLocaleString('vi-VN');
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

export default function LandingPage() {
  const { user } = useAuth();
  const [activeMembership, setActiveMembership] = useState(null);
  const [membershipLoaded, setMembershipLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setMembershipLoaded(true); return; }
    api.get('/api/gym/memberships/my')
      .then(data => {
        const list = data.items || data || [];
        setActiveMembership(list.find(m => m.status === 'active') || null);
      })
      .catch(() => {})
      .finally(() => setMembershipLoaded(true));
  }, [user]);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop" alt="Hero" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-[#FF5722]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 cinematic-grid opacity-20" />
          <CinematicMapLayer showCards intensity="strong" />
          <div className="absolute right-[8%] top-[20%] h-60 w-60 rounded-full bg-[#FF5722]/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-neon text-[#FF5722] text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              Hệ Sinh Thái Thể Hình Toàn Diện
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[0.95] mb-6">
              TẬP LUYỆN.<br />DINH DƯỠNG.<br /><span className="text-gradient-orange">BỨT PHÁ.</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Theo dõi tập luyện chuyên sâu. Đặt đồ ăn dinh dưỡng chuẩn macro. FitFuel+ đồng hành cùng hành trình bứt phá của bạn.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white font-bold hover:bg-[#FF5722]/90 transition-all shadow-md btn-cinematic">
                  Vào Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <a href="#pricing-section" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5722] text-white font-bold hover:bg-[#FF5722]/90 transition-all shadow-md btn-cinematic">
                  Đăng ký ngay <ArrowRight className="w-4 h-4" />
                </a>
              )}
              <Link to="/nutrition" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md text-white font-semibold hover:bg-white/25 transition-all btn-cinematic border border-white/30">
                Khám phá Hub <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-[#18181B]/10">
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
              <p className="text-3xl font-black text-gradient-orange mb-1">{s.value}</p>
              <p className="text-sm text-[#18181B]/60">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-3">Mọi Thứ Bạn Cần</p>
          <h2 className="text-4xl font-black text-[#18181B]">Một Nền Tảng.<br />Mọi Mục Tiêu.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, delay: i * 0.05 }}
            >
            <Link to={f.to} className="group glass rounded-2xl hover:bg-white/[0.06] transition-all border border-[#18181B]/10 hover:border-[#18181B]/10 premium-card block h-full">
              <div className="relative h-36 overflow-hidden">
                <img src={f.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#FF5722]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl" style={{ background: `${f.color}22`, border: `1px solid ${f.color}40`, boxShadow: `0 0 34px ${f.color}22` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
              </div>
              <div className="p-6 pt-4">
                <h3 className="text-lg font-bold text-[#18181B] mb-2">{f.title}</h3>
                <p className="text-sm text-[#18181B]/60 leading-relaxed mb-4">{f.desc}</p>
                <span className="text-xs font-semibold flex items-center gap-1 transition-all" style={{ color: f.color }}>
                  Khám phá <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOD PREVIEW */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#FF5722] uppercase tracking-widest mb-2">Food Hub</p>
              <h2 className="text-3xl font-black text-[#18181B]">Năng Lượng Cho Hiệu Suất</h2>
            </div>
            <Link to="/nutrition" className="hidden sm:flex items-center gap-1 text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Power Protein Bowl', cal: 520, protein: 45, price: '89K', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', badge: 'Bán chạy' },
              { name: 'Keto Warrior Plate', cal: 480, protein: 38, price: '95K', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', badge: 'Keto' },
              { name: 'Vegan Gains Bowl', cal: 440, protein: 28, price: '79K', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', badge: 'Thuần chay' },
            ].map(item => (
              <Link key={item.name} to="/nutrition" className="group rounded-2xl overflow-hidden glass border border-[#18181B]/10 hover:border-[#18181B]/10 transition-all premium-card">
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 img-overlay" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#FF5722] text-white text-xs font-bold">{item.badge}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-[#18181B] mb-1">{item.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#18181B]/60">
                    <span>{item.cal} kcal · {item.protein}g protein</span>
                    <span className="text-[#FF5722] font-semibold">{item.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* REVIEWS */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#F0F2F5] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#a855f7] uppercase tracking-widest mb-2">Đánh Giá</p>
            <h2 className="text-3xl font-black text-[#18181B]">Cộng Đồng Nói Gì</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map(r => (
              <div key={r.name} className="glass rounded-2xl p-6 border border-[#18181B]/10 premium-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-[#18181B]/80 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#18181B]">{r.name}</p>
                    <p className="text-xs text-[#18181B]/60">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / MEMBERSHIP */}
      {!user
        ? <PricingSection />
        : membershipLoaded && <ActiveMembershipSection membership={activeMembership || {}} />
      }

      {/* CTA */}

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl overflow-hidden glass-neon p-12 md:p-16 premium-card">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black text-[#18181B] mb-4">Sẵn sàng <span className="text-gradient-orange">Thăng Hạng?</span></h2>
            <p className="text-[#18181B]/60 text-lg mb-8 max-w-xl mx-auto">Gia nhập cùng 1,800+ vận động viên. Cam kết đồng hành trên mọi hành trình.</p>
            <a href="#pricing-section" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF5722] text-white font-black text-lg hover:bg-[#FF5722]/90 transition-all shadow-md btn-cinematic">
              Đăng Ký Ngay <Zap className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
