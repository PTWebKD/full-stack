import { Outlet, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import CinematicMapLayer from '../components/common/CinematicMapLayer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex cinematic-bg cinematic-noise relative overflow-hidden">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=1200&h=900&fit=crop"
          alt="Gym"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#152b3a]/90 via-[#0b2535]/58 to-transparent" />
        <div className="absolute inset-0 cinematic-grid opacity-35" />
        <CinematicMapLayer showCards intensity="strong" />
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col justify-end p-12"
        >
          <Link to="/" className="flex items-center gap-2 mb-auto mt-6">
            <div className="w-9 h-9 rounded-xl bg-[#003a5a] flex items-center justify-center glow-neon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">FitFuel<span className="text-[#7dd3fc]">+</span></span>
          </Link>
          <div>
            <p className="text-4xl font-black text-white leading-tight mb-4">
              Train Harder.<br />Eat Smarter.<br /><span className="text-[#7dd3fc]">Perform Better.</span>
            </p>
            <p className="text-white/50 text-sm max-w-xs">Join 1,800+ athletes already tracking their progress, ordering clean fuel, and gearing up with FitFuel+.</p>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-[480px] shrink-0 flex items-center justify-center p-6 bg-[#071f2f]/86 backdrop-blur-xl relative">
        <div className="absolute inset-0 cinematic-grid opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm relative z-10 glass rounded-3xl border border-white/10 p-6"
        >
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-[#003a5a] flex items-center justify-center glow-neon">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">FitFuel<span className="text-[#7dd3fc]">+</span></span>
          </Link>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
