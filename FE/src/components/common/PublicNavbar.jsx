import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const allNavLinks = [
  { to: '/nutrition', label: 'Dinh Dưỡng' },
  { to: '/gear', label: 'Gear Hub' },
  { to: '/#pricing-section', label: 'Gói Tập', memberOnly: true },
];

const roleHome = {
  member: '/dashboard',
  gymOwner: '/gym-owner/dashboard',
  admin: '/admin/dashboard',
};

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Ẩn "Gói Tập" cho gym owner — chỉ member mới cần mua gói
  const navLinks = allNavLinks.filter(l => !(l.memberOnly && user?.role === 'gymOwner'));

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-3 left-3 right-3 z-50 glass rounded-2xl border border-[#18181B]/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md">
            <Logo className="w-7 h-7" />
          </div>
          <span className="font-bold text-xl text-[#18181B]">FitFuel<span className="text-[#FF5722]">+</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => {
            const isHash = l.to.startsWith('/#');
            const isActive = location.pathname.startsWith(l.to) && !isHash;
            const cls = `relative px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isActive ? 'text-[#FF5722] bg-[#FF5722]/10 shadow-[0_0_24px_rgba(0,58,90,0.12)]' : 'text-[#18181B]/60 hover:text-[#18181B] hover:bg-white'}`;
            return isHash ? (
              <a key={l.to} href={l.to} className={cls}>{l.label}</a>
            ) : (
              <Link key={l.to} to={l.to} className={cls}>{l.label}</Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-xl text-[#18181B]/60 hover:text-[#18181B] hover:bg-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5722] text-white text-xs font-bold flex items-center justify-center">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to={roleHome[user.role] || '/dashboard'} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-[#18181B]/80 hover:text-[#18181B] transition-colors premium-card">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-xl text-[#18181B]/60 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth/login" className="px-4 py-1.5 text-sm text-[#18181B]/80 hover:text-[#18181B] transition-colors">Đăng nhập</Link>
              <a href="/#pricing-section" className="px-4 py-1.5 rounded-lg bg-[#FF5722] text-white text-sm font-semibold hover:bg-[#FF5722]/90 transition-colors btn-cinematic shadow-md">Đăng Ký Thành Viên</a>
            </div>
          )}

          <button className="md:hidden p-2 text-[#18181B]/60" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="md:hidden glass border-t border-[#18181B]/10 px-4 py-4 flex flex-col gap-3 rounded-b-2xl"
        >
          {navLinks.map(l => {
            const isHash = l.to.startsWith('/#');
            const cls = "text-sm text-[#18181B]/80 hover:text-[#18181B] py-2";
            return isHash ? (
              <a key={l.to} href={l.to} onClick={() => setOpen(false)} className={cls}>{l.label}</a>
            ) : (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={cls}>{l.label}</Link>
            );
          })}
          {user ? (
            <>
              <Link to={roleHome[user.role] || '/dashboard'} onClick={() => setOpen(false)} className="text-sm text-[#18181B] py-2">Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-sm text-red-400 py-2 text-left">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setOpen(false)} className="text-sm text-[#18181B]/80 py-2">Đăng nhập</Link>
              <a href="/#pricing-section" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-[#FF5722] text-white text-sm font-semibold text-center btn-cinematic">Đăng Ký Thành Viên</a>
            </>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  );
}
