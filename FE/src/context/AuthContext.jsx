import { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

function normalizeRole(role) {
  return role === 'gym_owner' ? 'gymOwner' : role;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitfuel_user')); } catch { return null; }
  });

  // Normalize profile fields so both API names (display_name, avatar_url)
  // and legacy mock names (name, avatar) are available on the user object.
  function buildSafeUser(profile) {
    return {
      ...profile,
      role: normalizeRole(profile.role),
      // aliases for components still using mock field names
      name: profile.display_name || profile.name || '',
      avatar: profile.avatar_url || profile.avatar || '',
    };
  }

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('fitfuel_token', data.access_token);
      const profile = await api.get('/api/users/me');
      const safeUser = buildSafeUser(profile);
      setUser(safeUser);
      localStorage.setItem('fitfuel_user', JSON.stringify(safeUser));
      return { ok: true, user: safeUser };
    } catch (err) {
      return { ok: false, error: err.message || 'Đăng nhập thất bại' };
    }
  };

  const register = async ({ display_name, email, password, phone }) => {
    try {
      const data = await api.post('/api/auth/register', { display_name, email, password, phone });
      localStorage.setItem('fitfuel_token', data.access_token);
      const profile = await api.get('/api/users/me');
      const safeUser = buildSafeUser(profile);
      setUser(safeUser);
      localStorage.setItem('fitfuel_user', JSON.stringify(safeUser));
      return { ok: true, user: safeUser };
    } catch (err) {
      return { ok: false, error: err.message || 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitfuel_user');
    localStorage.removeItem('fitfuel_token');
  };

  // Keep switchRole for dev/demo convenience
  const switchRole = (role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('fitfuel_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
