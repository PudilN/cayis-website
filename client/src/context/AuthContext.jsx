import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user on mount (automatically routed through Vercel/Vite Proxy)
    fetch(`/auth/user`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => console.error('Auth check failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = `/auth/google`;
  };

  const logout = () => {
    window.location.href = `/auth/logout`;
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
