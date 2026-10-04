import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api/modules';
import { apiClient } from '../lib/api/client';
import { User, Company } from '../types';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  register: (payload: { company_name: string; full_name: string; email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    setIsLoading(true);
    const storedToken = apiClient.getToken();
    if (!storedToken) {
      setUser(null);
      setCompany(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setCompany(res.data.company);
        setToken(storedToken);
      } else {
        // Token invalid or expired
        apiClient.setToken(null);
        setUser(null);
        setCompany(null);
        setToken(null);
      }
    } catch {
      apiClient.setToken(null);
      setUser(null);
      setCompany(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If no token exists in localStorage, set a demo token to enable instant testing or let them login
    const existing = apiClient.getToken();
    if (!existing) {
      // By default pre-seed the demo session so the user can immediately experience the dashboard without hurdles,
      // but if they click logout it will clear and demand login
      apiClient.setToken('evos-demo-session');
    }
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password?: string }) => {
    setIsLoading(true);
    const res = await authApi.login(credentials);
    setIsLoading(false);

    if (res.success && res.data) {
      apiClient.setToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCompany(res.data.company);
      return { success: true };
    }

    return {
      success: false,
      error: res.error?.message || 'Authentication failed. Please verify credentials.',
    };
  };

  const register = async (payload: { company_name: string; full_name: string; email: string; password?: string }) => {
    setIsLoading(true);
    const res = await authApi.register(payload);
    setIsLoading(false);

    if (res.success && res.data) {
      apiClient.setToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCompany(res.data.company);
      return { success: true };
    }

    return {
      success: false,
      error: res.error?.message || 'Registration failed. Please try again.',
    };
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore network errors on logout
    }
    apiClient.setToken(null);
    setToken(null);
    setUser(null);
    setCompany(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
