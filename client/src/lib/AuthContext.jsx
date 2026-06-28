import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, oauthUrl } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const response = await apiRequest('/auth/me');
      setUser(response.data);
      setAuthError(null);
      return response.data;
    } catch (error) {
      setUser(null);
      if (error.status !== 401) setAuthError({ type: 'auth_error', message: error.message });
      return null;
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => { checkUserAuth(); }, [checkUserAuth]);

  const login = useCallback(async (email, password) => {
    const response = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setUser(response.data);
    setAuthError(null);
    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    setUser(response.data);
    setAuthError(null);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try { await apiRequest('/auth/logout', { method: 'POST' }); } finally { setUser(null); }
  }, []);

  const startOAuth = useCallback((provider) => { window.location.assign(oauthUrl(provider)); }, []);
  const value = useMemo(() => ({
    user, isAuthenticated: Boolean(user), isLoadingAuth, isLoadingPublicSettings: false,
    authError, appPublicSettings: { name: 'HostelOS', isPublic: true }, authChecked,
    login, register, logout, startOAuth, checkUserAuth, checkAppState: checkUserAuth,
    navigateToLogin: () => window.location.assign('/login')
  }), [user, isLoadingAuth, authError, authChecked, login, register, logout, startOAuth, checkUserAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}