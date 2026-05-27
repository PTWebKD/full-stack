import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, ShoppingCart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { to: '/food', label: 'Food' },
  { to: '/gear', label: 'Gear Hub' },
];

const roleHome = {
  member: '/dashboard',
  vendor: '/vendor/dashboard',
  gymOwner: '/gym-owner/dashboard',
  admin: '/admin/dashboard',
};

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.nav
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-3 left-3 right-3 z-50 glass-dark rounded-2xl border border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#003a5a] flex items-center justify-center glow-neon">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">FitFuel<span className="text-[#7dd3fc]">+</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all ${location.pathname.startsWith(l.to) ? 'text-[#7dd3fc] bg-[#003a5a]/10 shadow-[0_0_24px_rgba(0,58,90,0.12)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#003a5a] text-white text-xs font-bold flex items-center justify-center">{totalItems}</span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to={roleHome[user.role] || '/dashboard'} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-white/80 hover:text-white transition-colors premium-card">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth/login" className="px-4 py-1.5 text-sm text-white/70 hover:text-white transition-colors">Login</Link>
              <Link to="/auth/register" className="px-4 py-1.5 rounded-lg bg-[#003a5a] text-white text-sm font-semibold hover:bg-[#003a5a]/90 transition-colors btn-cinematic glow-neon">Join Free</Link>
            </div>
          )}

          <button className="md:hidden p-2 text-white/60" onClick={() => setOpen(!open)}>
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
          className="md:hidden glass-dark border-t border-white/5 px-4 py-4 flex flex-col gap-3 rounded-b-2xl"
        >
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm text-white/70 hover:text-white py-2">{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link to={roleHome[user.role] || '/dashboard'} onClick={() => setOpen(false)} className="text-sm text-white py-2">Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="text-sm text-red-400 py-2 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" onClick={() => setOpen(false)} className="text-sm text-white/70 py-2">Login</Link>
              <Link to="/auth/register" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-[#003a5a] text-white text-sm font-semibold text-center btn-cinematic">Join Free</Link>
            </>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  );
}
