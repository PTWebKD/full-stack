import { createContext, useContext, useState, useEffect } from 'react';
import { getMockUser } from '../data/mockUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitfuel_user')); } catch { return null; }
  });

  const login = (email, password) => {
    const found = getMockUser(email, password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('fitfuel_user', JSON.stringify(safeUser));
      return { ok: true, user: safeUser };
    }
    return { ok: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitfuel_user');
  };

  const switchRole = (role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('fitfuel_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
