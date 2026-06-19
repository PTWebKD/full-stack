import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/common/Logo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#F3F5F9] relative overflow-hidden">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&h=900&fit=crop"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col justify-end p-12"
        >
          <Link to="/" className="flex items-center gap-2 mb-auto mt-6">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-bold text-2xl text-white drop-shadow-md">FitFuel<span className="text-[#FF5722]">+</span></span>
          </Link>
          <div>
            <p className="text-4xl font-black text-white leading-tight mb-4 drop-shadow-lg">
              Train Harder.<br />Eat Smarter.<br /><span className="text-[#FF5722]">Perform Better.</span>
            </p>
            <p className="text-white/80 text-sm max-w-xs drop-shadow-md">Join 1,800+ athletes already tracking their progress, ordering clean fuel, and gearing up with FitFuel+.</p>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center p-6 bg-white relative shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative z-10 p-6"
        >
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
              <Logo className="w-8 h-8" />
            </div>
            <span className="font-bold text-2xl text-[#18181B]">FitFuel<span className="text-[#FF5722]">+</span></span>
          </Link>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
