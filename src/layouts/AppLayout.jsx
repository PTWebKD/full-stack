import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';
import CinematicMapLayer from '../components/common/CinematicMapLayer';
import ThreeCityBackdrop from '../components/common/ThreeCityBackdrop';
import ScrollRevealScope from '../components/common/ScrollRevealScope';
import FloatingChatbot from '../components/common/FloatingChatbot';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/passport': 'Fitness Passport',
  '/gym/history': 'Workout History',
  '/gym/new-session': 'New Session',
  '/gym/records': 'Personal Records',
  '/ai-assistant': 'FitAI Assistant',
  '/gym/progress': 'Exercise Progress',
  '/leaderboard': 'Leaderboard',
  '/tdee': 'TDEE Calculator',
  '/macro': 'Macro Tracker',
  '/fitcoin': 'FitCoin',
  '/orders': 'My Orders',
  '/social': 'Community',
  '/profile': 'Profile',
  '/vendor/dashboard': 'Vendor Dashboard',
  '/vendor/products': 'My Products',
  '/vendor/orders': 'Customer Orders',
  '/vendor/reviews': 'Reviews',
  '/vendor/analytics': 'Analytics',
  '/gear/sell': 'List Gear',
  '/gear/manage': 'Gear Listings',
  '/gym-owner/dashboard': 'Gym Dashboard',
  '/gym-owner/members': 'Members',
  '/gym-owner/analytics': 'Analytics',
  '/gym-owner/announcements': 'Announcements',
  '/admin/dashboard': 'Management Dashboard',
  '/admin/users': 'User Management',
  '/admin/vendors': 'Vendor Management',
  '/admin/gear-disputes': 'Gear Disputes',
  '/admin/reports': 'Reports',
  '/membership': 'Membership',
  '/challenges': 'Weekly Challenges',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'FitFuel+';

  return (
    <div className="flex h-screen overflow-hidden cinematic-bg cinematic-noise relative">
      <div className="fixed inset-0 cinematic-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none opacity-55">
        <ThreeCityBackdrop density={16} />
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <CinematicMapLayer />
      </div>
      <div className="fixed top-10 left-64 h-72 w-72 rounded-full bg-[#003a5a]/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 h-96 w-96 rounded-full bg-[#ef4444]/10 blur-3xl pointer-events-none" />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <FloatingChatbot />
      <div className={`relative z-10 flex-1 flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        <TopBar onMenuToggle={() => setCollapsed(c => !c)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="page-surface mx-auto w-full max-w-6xl"
          >
            <ScrollRevealScope>
              <Outlet />
            </ScrollRevealScope>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
