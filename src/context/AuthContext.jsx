import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async ({ name, email, password }) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const refreshUser = async () => {
    const userData = await api.getMe();
    setUser(userData);
    return userData;
  };

  const updateProfile = async (fields) => {
    const data = await api.updateMe(fields);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useAutoRefresh(() => {
    if (localStorage.getItem('token')) {
      refreshUser().catch((err) => {
        if (err?.status === 401) {
          logout();
        }
      });
    }
  }, 30000, !loading);

  const isAuthenticated = !!user;
  const isOrganizer = user?.role === 'organizer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOrganizer,
        isAdmin,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};