import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiClient, { TOKEN_KEY, USER_KEY } from '../api/apiClient';

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [loadingUser, setLoadingUser] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const saveSession = useCallback((authResponse) => {
    const nextToken = authResponse.token;
    const nextUser = {
      id: authResponse.userId,
      email: authResponse.email,
      role: authResponse.role,
    };

    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await apiClient.get('/api/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  useEffect(() => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    refreshUser()
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, [token]);

  const login = useCallback(async (payload) => {
    const { data } = await apiClient.post('/api/auth/login', payload);
    saveSession(data);
    return data;
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    const { data } = await apiClient.post('/api/auth/register', payload);
    saveSession(data);
    return data;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loadingUser,
      login,
      register,
      logout,
      refreshUser,
    }),
    [token, user, loadingUser, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
