import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';
import CinematicMapLayer from '../components/common/CinematicMapLayer';
import ThreeCityBackdrop from '../components/common/ThreeCityBackdrop';
import ScrollRevealScope from '../components/common/ScrollRevealScope';
import FloatingChatbot from '../components/common/FloatingChatbot';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col cinematic-bg cinematic-noise relative overflow-hidden">
      <div className="fixed inset-0 cinematic-grid opacity-40 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <ThreeCityBackdrop density={14} />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-55">
        <CinematicMapLayer />
      </div>
      <div className="fixed -top-32 left-1/4 h-80 w-80 rounded-full bg-[#003a5a]/10 blur-3xl pointer-events-none" />
      <div className="fixed top-20 right-0 h-96 w-96 rounded-full bg-[#f97316]/10 blur-3xl pointer-events-none" />
      <PublicNavbar />
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pt-16 relative z-10"
      >
        <ScrollRevealScope className="relative">
          <Outlet />
        </ScrollRevealScope>
      </motion.main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FloatingChatbot />
    </div>
  );
}
