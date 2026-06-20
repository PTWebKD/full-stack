import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Play } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[#18181B]/10 bg-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md">
              <Logo className="w-7 h-7" />
            </div>
            <span className="font-bold text-xl text-[#18181B]">FitFuel<span className="text-[#FF5722]">+</span></span>
          </div>
          <p className="text-sm text-[#18181B]/60 leading-relaxed">Hệ sinh thái thể hình toàn diện. Tập luyện bứt phá, ăn uống thông minh, lên đồ cực chất.</p>
          <div className="flex gap-3 mt-4">
            {[Globe, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#18181B]/60 hover:text-[#FF5722] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#18181B]/60 uppercase tracking-wider mb-3">Nền Tảng</p>
          <div className="flex flex-col gap-2">
            {[['/', 'Trang chủ'], ['/nutrition', 'Food Hub'], ['/gear', 'Gear Hub'], ['/#pricing-section', 'Tham gia Miễn phí']].map(([to, label]) => {
              const isHash = to.startsWith('/#');
              return isHash ? (
                <a key={to} href={to} className="text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">{label}</a>
              ) : (
                <Link key={to} to={to} className="text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">{label}</Link>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#18181B]/60 uppercase tracking-wider mb-3">Đối Tác</p>
          <div className="flex flex-col gap-2">
            {[['#', 'Bán Thực Phẩm'], ['#', 'Bán Gear'], ['#', 'Đăng Ký Phòng Tập']].map(([to, label]) => (
              <a key={label} href={to} className="text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#18181B]/60 uppercase tracking-wider mb-3">Hỗ Trợ</p>
          <div className="flex flex-col gap-2">
            {[['#', 'Trung Tâm Trợ Giúp'], ['#', 'Chính Sách Bảo Mật'], ['#', 'Điều Khoản Dịch Vụ'], ['#', 'Liên Hệ']].map(([to, label]) => (
              <a key={label} href={to} className="text-sm text-[#18181B]/60 hover:text-[#18181B] transition-colors">{label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#18181B]/10 px-4 sm:px-6 py-4">
        <p className="text-center text-xs text-[#18181B]/40">© 2025 FitFuel+. Xây dựng với niềm đam mê dành cho cộng đồng thể hình.</p>
      </div>
    </footer>
  );
}
