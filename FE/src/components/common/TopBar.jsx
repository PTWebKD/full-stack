import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Menu, Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function TopBar({ onMenuToggle, title }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const typeIcon = (type) => ({ streak_reminder: '🔥', order_update: '📦', promo: '🎉', challenge: '🏆', gear_return: '⚙️', gym_closed: '🏋️', gear_approved: '✅' }[type] || '🔔');

  useEffect(() => {
    if (!user) return;
    api.get('/api/notifications/')
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Close when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showDropdown]);

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
    api.put(`/api/notifications/${id}/read`, {}).catch(() => {});
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    api.put('/api/notifications/read-all', {}).catch(() => {});
  };

  return (
    <header className="relative z-[120] m-4 mb-4 h-16 flex items-center justify-between px-4 sm:px-6 rounded-2xl border border-[#18181B]/10 glass shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl text-[#18181B]/40 hover:text-[#18181B] hover:bg-[#18181B]/5">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-[#18181B]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-sm text-[#18181B]/40 border border-[#18181B]/10">
          <Search className="w-4 h-4" />
          <span>Tìm kiếm...</span>
        </div>

        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,87,34,0.1)',
            border: '1px solid rgba(255,87,34,0.2)',
            color: '#FF5722',
            boxShadow: '0 4px 15px rgba(255,87,34,0.1)',
          }}
        >
          <Home className="w-3.5 h-3.5" />
          Trang Chủ
        </Link>

        {/* Notification Bell */}
        <div className="relative z-[130]" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="relative p-2 rounded-xl text-[#18181B]/40 hover:text-[#18181B] hover:bg-[#18181B]/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-[#FF5722] text-white text-[10px] font-black flex items-center justify-center px-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-[#18181B]/10 shadow-[0_10px_40px_rgba(26,43,76,0.15)] z-[9999] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#18181B]/5">
                <span className="font-semibold text-[#18181B] text-sm">Thông báo</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#FF5722] hover:text-[#FF5722]/80 transition-colors"
                  >
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#18181B]/5">
                {notifications.map(n => (
                  <button
                    key={n.notification_id}
                    onClick={() => markRead(n.notification_id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#18181B]/5 transition-colors ${!n.is_read ? 'bg-[#FF5722]/5' : ''}`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${!n.is_read ? 'text-[#18181B]' : 'text-[#18181B]/60'}`}>{n.title}</p>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-[#FF5722] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#18181B]/60 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-[#18181B]/40 mt-1">{new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </button>
                ))}
                {notifications.length === 0 && (
                  <p className="px-4 py-6 text-sm text-[#18181B]/40 text-center">Không có thông báo</p>
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {user && (
          <img src={user.avatar_url || user.avatar} alt={user.display_name || user.name} className="w-8 h-8 rounded-full object-cover border border-[#18181B]/10 shadow-sm" />
        )}
      </div>
    </header>
  );
}
