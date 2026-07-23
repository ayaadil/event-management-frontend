import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((data) => setUser(data.user || data))
      .catch((err) => {
        console.warn("Server is offline or route /api/me not found:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    const token = data.token || data.data?.token;
    const userData = data.user || data.data?.user || data;

    if (token) {
      localStorage.setItem("token", token);
      setUser(userData);
      return data;
    } else {
      throw new Error(data.message || "فشل تسجيل الدخول: استجابة غير صحيحة من السيرفر");
    }
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    const token = data.token || data.data?.token;
    const userData = data.user || data.data?.user || data;

    if (token) {
      localStorage.setItem("token", token);
      setUser(userData);
      return data;
    } else {
      throw new Error(data.message || "فشل إنشاء الحساب");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};