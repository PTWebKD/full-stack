import { createContext, useContext, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Global application context
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected module based on pathname (simple mapping)
  const selectedModule = useMemo(() => {
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/gear')) return 'gear';
    if (location.pathname.startsWith('/food')) return 'food';
    if (location.pathname.startsWith('/social')) return 'social';
    if (location.pathname.startsWith('/membership')) return 'membership';
    return '';
  }, [location.pathname]);

  // Gear filter state (shared across pages)
  const [gearFilter, setGearFilter] = useState({
    category: 'All',
    search: '',
    sortBy: 'popular',
  });

  // Helper to navigate while updating selected module
  const navigateTo = (module, extraPath = '') => {
    const base = {
      dashboard: '/dashboard',
      gear: '/gear',
      food: '/food',
      social: '/social',
      membership: '/membership',
    }[module];
    if (base) navigate(`${base}${extraPath}`);
  };

  const value = {
    user,
    selectedModule,
    navigateTo,
    gearFilter,
    setGearFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
