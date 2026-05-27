import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, Dumbbell, Utensils, ShoppingBag, Award,
  Users, Globe, BarChart2, LogOut, ChevronRight,
  Package, ClipboardList, Star, Megaphone, ShieldAlert,
  User, Coins, Calculator, PieChart, Trophy, TrendingUp, Medal, Sparkles,
  Target, Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuByRole = {
  member: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Award, label: 'Fitness Passport', to: '/passport' },
    { icon: Dumbbell, label: 'Gym Tracker', to: '/gym/history' },
    { icon: Trophy, label: 'Personal Records', to: '/gym/records' },
    { icon: TrendingUp, label: 'Progress Charts', to: '/gym/progress' },
    { icon: Medal, label: 'Leaderboard', to: '/leaderboard' },
    { icon: Calculator, label: 'TDEE Calculator', to: '/tdee' },
    { icon: PieChart, label: 'Macro Tracker', to: '/macro' },
    { icon: Coins, label: 'FitCoin', to: '/fitcoin' },
    { icon: Utensils, label: 'My Orders', to: '/orders' },
    { icon: ShoppingBag, label: 'My Gear Listings', to: '/gear/manage' },
    { icon: Package, label: 'List My Gear', to: '/gear/sell' },
    { icon: Globe, label: 'Community', to: '/social' },
    { icon: Target, label: 'Challenges', to: '/challenges' },
    { icon: Crown, label: 'Membership', to: '/membership' },
    { icon: User, label: 'Profile', to: '/profile' },
  ],
  vendor: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/vendor/dashboard' },
    { icon: Package, label: 'My Products', to: '/vendor/products' },
    { icon: ClipboardList, label: 'Orders', to: '/vendor/orders' },
    { icon: Star, label: 'Reviews', to: '/vendor/reviews' },
    { icon: BarChart2, label: 'Analytics', to: '/vendor/analytics' },
  ],
  gymOwner: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/gym-owner/dashboard' },
    { icon: Users, label: 'Members', to: '/gym-owner/members' },
    { icon: BarChart2, label: 'Analytics', to: '/gym-owner/analytics' },
    { icon: ShoppingBag, label: 'Gear Listings', to: '/gear/manage' },
    { icon: Package, label: 'List Gear', to: '/gear/sell' },
    { icon: Megaphone, label: 'Announcements', to: '/gym-owner/announcements' },
    { icon: Users, label: 'User Management', to: '/admin/users' },
    { icon: Package, label: 'Vendors', to: '/admin/vendors' },
    { icon: ShieldAlert, label: 'Disputes', to: '/admin/gear-disputes' },
    { icon: BarChart2, label: 'Reports', to: '/admin/reports' },
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

      <div className="px-2 pb-3 flex flex-col gap-1">
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && 'Public Site'}
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
}
