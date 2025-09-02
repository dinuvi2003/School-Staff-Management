'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { api, API_BASE_URL } from '@/lib/apiClient';
import axios from 'axios';

// small axios instance to avoid interceptor loops during refresh
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); 
  // idle | authenticating | authenticated | unauthenticated

  const refreshingRef = useRef(null);

  /** Update local auth state */
  const setAuth = useCallback((token, userInfo = null) => {
    setAccessToken(token || null);
    if (userInfo) setUser(userInfo);
    setStatus(token ? 'authenticated' : 'unauthenticated');
  }, []);

  /** Logout */
  const logout = useCallback(async () => {
    try {
      await api.post('/api/admin/logout');
    } catch {
      // ignore network errors here
    }
    setAccessToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  /** Login */
  const login = useCallback(
    async ({ nic, password }) => {
      setStatus('authenticating');
      try {
        const res = await api.post('/api/admin/login', { nic, password });
        const token = res?.data?.data?.accessToken;
        const u = res?.data?.data?.user || null;
        if (!token) throw new Error('No access token returned');
        setAuth(token, u);
        return { ok: true };
      } catch (e) {
        setStatus('unauthenticated');
        return {
          ok: false,
          error: e?.response?.data?.errors?.message || e.message,
        };
      }
    },
    [setAuth]
  );

  /** Refresh access token */
  const refresh = useCallback(async () => {
    if (refreshingRef.current) return refreshingRef.current;
    refreshingRef.current = (async () => {
      try {
        const res = await refreshClient.post('/api/admin/refresh');
        const token = res?.data?.data?.accessToken;
        if (!token) throw new Error('No new access token');
        setAccessToken(token);
        setStatus('authenticated');
        return token;
      } catch (e) {
        setAccessToken(null);
        setUser(null);
        setStatus('unauthenticated');
        throw e;
      } finally {
        refreshingRef.current = null;
      }
    })();
    return refreshingRef.current;
  }, []);

  /** Try silent refresh on mount */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await refresh();
        if (mounted) setStatus('authenticated');
      } catch {
        if (mounted) setStatus('unauthenticated');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  /** Attach axios interceptors */
  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const resId = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;
        const status = error?.response?.status;

        if (status === 401 && !original.__isRetry) {
          try {
            const newToken = await refresh();
            original.__isRetry = true;
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          } catch {
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [accessToken, refresh, logout]);

  const value = useMemo(
    () => ({
      status,
      user,
      accessToken,
      login,
      logout,
      refresh,
    }),
    [status, user, accessToken, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
