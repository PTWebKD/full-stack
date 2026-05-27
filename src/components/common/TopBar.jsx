import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications as initialNotifications } from '../../data/mockNotifications';

export default function TopBar({ onMenuToggle, title }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="relative z-[120] m-3 mb-0 h-16 flex items-center justify-between px-4 sm:px-6 rounded-2xl border border-white/10 glass-dark">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-white glow-text-neon">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-sm text-white/40 border border-white/10">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>

        {/* Notification Bell */}
        <div className="relative z-[130]" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            className="relative p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-[#003a5a] text-white text-[10px] font-black flex items-center justify-center px-0.5 leading-none">
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
              className="absolute right-0 top-full mt-2 w-80 glass-dark rounded-2xl border border-white/10 shadow-2xl z-[9999] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="font-semibold text-white text-sm">Thông báo</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#7dd3fc] hover:text-[#7dd3fc]/80 transition-colors"
                  >
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${!n.read ? 'bg-white/3' : ''}`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#003a5a] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-xs text-white/25 mt-1">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {user && (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#003a5a]/30 shadow-[0_0_22px_rgba(0,58,90,0.12)]" />
        )}
      </div>
    </header>
  );
}
