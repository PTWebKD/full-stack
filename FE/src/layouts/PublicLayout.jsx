import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';
import ScrollRevealScope from '../components/common/ScrollRevealScope';
import FloatingChatbot from '../components/common/FloatingChatbot';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F9] relative overflow-hidden">
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
