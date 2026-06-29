import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';
import CinematicMapLayer from '../components/common/CinematicMapLayer';
import ThreeCityBackdrop from '../components/common/ThreeCityBackdrop';
import ScrollRevealScope from '../components/common/ScrollRevealScope';
import FloatingChatbot from '../components/common/FloatingChatbot';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';

const pageTitles = {
  '/dashboard': 'Bảng Điều Khiển',
  '/passport': 'Hộ Chiếu Thể Hình',
  '/gym/history': 'Lịch Sử Tập Luyện',
  '/gym/new-session': 'Buổi Tập Mới',
  '/gym/records': 'Kỷ Lục Cá Nhân',
  '/ai-assistant': 'Trợ Lý AI',
  '/gym/progress': 'Tiến Trình Luyện Tập',
  '/leaderboard': 'Bảng Xếp Hạng',
  '/tdee': 'Công Cụ Tính TDEE',
  '/macro': 'Theo Dõi Macro',
  '/fitcoin': 'FitCoin',
  '/orders': 'Đơn Hàng Của Tôi',
  '/social': 'Cộng Đồng',
  '/profile': 'Thông Tin Cá Nhân',
  '/gym-owner/dashboard': 'Bảng Điều Khiển Phòng Gym',
  '/gym-owner/members': 'Hội Viên',
  '/gym-owner/members/:id': 'Hồ Sơ Hội Viên 360',
  '/gym-owner/analytics': 'Phân Tích',
  '/gym-owner/announcements': 'Thông Báo',
  '/gym-owner/care-queue': 'Hàng Đợi Chăm Sóc AI',
  '/admin/dashboard': 'Bảng Điều Khiển Quản Trị',
  '/admin/users': 'Quản Lý Người Dùng',
  '/admin/reports': 'Báo Cáo',
  '/membership': 'Gói Hội Viên',
  '/challenges': 'Thử Thách Hàng Tuần',
  '/checkin': 'Điểm Danh Phòng Gym',
  '/journey': 'Hành Trình Thay Đổi',
  '/nutrition': 'Dinh Dưỡng Nội Bộ',
};

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { selectedModule } = useApp();
  const title = pageTitles[location.pathname] || 'FitFuel+';

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F5F9] relative">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} selectedModule={selectedModule} />
      <FloatingChatbot />
      <div className={`relative z-10 flex-1 flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'ml-[112px]' : 'ml-[288px]'}`}>
        <TopBar onMenuToggle={() => setCollapsed(c => !c)} title={title} />
        <main className="flex-1 overflow-y-auto p-2 sm:p-4">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-6xl"
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
