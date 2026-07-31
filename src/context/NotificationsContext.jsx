// src/context/NotificationsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { api } from '../services/api';

const NotificationsContext = createContext(null);
const storageKey = (userId) => `notifications:${userId}`;

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const eventCache = useRef({});

  // تحميل الإشعارات المخزنة محلياً لهذا المستخدم بالذات
  useEffect(() => {
    if (!user?.id) { setNotifications([]); return; }
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      setNotifications(raw ? JSON.parse(raw) : []);
    } catch {
      setNotifications([]);
    }
  }, [user?.id]);

  const persist = useCallback((list) => {
    if (user?.id) localStorage.setItem(storageKey(user.id), JSON.stringify(list));
  }, [user?.id]);

  const addIfNew = useCallback((id, notif) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === id)) return prev;
      const next = [{ id, read: false, createdAt: new Date().toISOString(), ...notif }, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  // يفحص حجوزات المستخدم الحقيقية ويولّد إشعارات فعلية منها (بدون أي endpoint جديد)
  const checkBookings = useCallback(async () => {
    if (!user?.id) return;
    try {
      const bookings = await api.getMyBookings();
      const now = Date.now();

      for (const b of bookings) {
        if (b.status === 'confirmed') {
          addIfNew(`ticket-confirmed-${b.id}`, { type: 'ticket', path: '/tickets', eventTitle: b.event_title });

          try {
            let ev = eventCache.current[b.event_id];
            if (!ev) {
              ev = await api.getEventById(b.event_id);
              eventCache.current[b.event_id] = ev;
            }
            const hoursLeft = (new Date(ev.date_time).getTime() - now) / 36e5;
            if (hoursLeft > 0 && hoursLeft <= 48) {
              addIfNew(`reminder-${b.id}`, { type: 'reminder', path: '/tickets', eventTitle: b.event_title });
            }
          } catch { /* تجاهل فشل جلب الفعالية */ }
        }

        if (b.status === 'cancelled') {
          addIfNew(`ticket-cancelled-${b.id}`, { type: 'cancelled', path: '/tickets', eventTitle: b.event_title });
        }
      }
    } catch { /* تجاهل فشل جلب الحجوزات */ }
  }, [user?.id, addIfNew]);

  // فحص فوري عند تسجيل الدخول أو تغيّر المستخدم
  useEffect(() => {
    if (user?.id) checkBookings();
  }, [user?.id, checkBookings]);

  // تحديث تلقائي كل دقيقة، ويتوقف تلقائيًا لو التبويب مو ظاهر (نفس أسلوب باقي الموقع)
  useAutoRefresh(checkBookings, 60000, !!user?.id);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => { const next = prev.map((n) => ({ ...n, read: true })); persist(next); return next; });
  }, [persist]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => { const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n)); persist(next); return next; });
  }, [persist]);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => { const next = prev.filter((n) => n.id !== id); persist(next); return next; });
  }, [persist]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllAsRead, markAsRead, deleteNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};