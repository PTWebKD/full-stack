import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, Dumbbell, Utensils, ShoppingBag, Award,
  Users, BarChart2, LogOut, ChevronRight,
  Package, ClipboardList, Star, Megaphone, ShieldAlert,
  User, Coins, Calculator, PieChart, Trophy, TrendingUp, Medal, Sparkles,
  Target, Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuByRole = {
  member: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Sparkles, label: 'AI Assistant', to: '/ai-assistant' },
    { icon: Award, label: 'Hộ Chiếu Thể Hình', to: '/passport' },
    { icon: Dumbbell, label: 'Theo Dõi Tập Luyện', to: '/gym/history' },
    { icon: Trophy, label: 'Kỷ Lục Cá Nhân', to: '/gym/records' },
    { icon: TrendingUp, label: 'Biểu Đồ Tiến Độ', to: '/gym/progress' },
    { icon: Medal, label: 'Bảng Xếp Hạng', to: '/leaderboard' },
    { icon: Calculator, label: 'Máy Tính TDEE', to: '/tdee' },
    { icon: PieChart, label: 'Theo Dõi Macro', to: '/macro' },
    { icon: Coins, label: 'FitCoin', to: '/fitcoin' },
    { icon: Utensils, label: 'Đơn Hàng Của Tôi', to: '/orders' },
    { icon: ShoppingBag, label: 'Gear Cho Thuê', to: '/gear/manage' },
    { icon: Package, label: 'Đăng Cho Thuê', to: '/gear/sell' },
    { icon: Globe, label: 'Cộng Đồng', to: '/social' },
    { icon: Target, label: 'Thử Thách', to: '/challenges' },
    { icon: Crown, label: 'Gói Hội Viên', to: '/membership' },
    { icon: User, label: 'Hồ Sơ', to: '/profile' },
  ],
  vendor: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/vendor/dashboard' },
    { icon: Package, label: 'Sản Phẩm Của Tôi', to: '/vendor/products' },
    { icon: ClipboardList, label: 'Đơn Hàng', to: '/vendor/orders' },
    { icon: Star, label: 'Đánh Giá', to: '/vendor/reviews' },
    { icon: BarChart2, label: 'Phân Tích', to: '/vendor/analytics' },
  ],
  gymOwner: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/gym-owner/dashboard' },
    { icon: Users, label: 'Hội Viên', to: '/gym-owner/members' },
    { icon: BarChart2, label: 'Phân Tích', to: '/gym-owner/analytics' },
    { icon: ShoppingBag, label: 'Danh Sách Gear', to: '/gear/manage' },
    { icon: Package, label: 'Đăng Bán Gear', to: '/gear/sell' },
    { icon: Megaphone, label: 'Thông Báo', to: '/gym-owner/announcements' },
    { icon: Users, label: 'Quản Lý Người Dùng', to: '/admin/users' },
    { icon: Package, label: 'Đối Tác', to: '/admin/vendors' },
    { icon: ShieldAlert, label: 'Khiếu Nại', to: '/admin/gear-disputes' },
    { icon: BarChart2, label: 'Báo Cáo', to: '/admin/reports' },
  ]
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = menuByRole[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed left-3 top-3 bottom-3 z-40 flex flex-col glass-dark rounded-3xl border border-white/10 transition-all duration-300 shadow-2xl ${collapsed ? 'w-16' : 'w-60'}`}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-[#003a5a] flex items-center justify-center glow-neon">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-white">FitFuel<span className="text-[#7dd3fc]">+</span></span>}
        <button onClick={onToggle} className="ml-auto rounded-lg p-1 text-white/30 hover:text-white hover:bg-white/5 transition-colors">
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-[#003a5a]/30 shadow-[0_0_24px_rgba(0,58,90,0.12)]" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/40 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-1">
        {menu.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-[#003a5a]/12 text-[#7dd3fc] border border-[#003a5a]/25 shadow-[0_0_28px_rgba(0,58,90,0.12)]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:translate-x-0.5'
            }`
          }>
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 pb-3">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Đăng xuất'}
        </button>
      </div>
    </motion.aside>
  );
}
