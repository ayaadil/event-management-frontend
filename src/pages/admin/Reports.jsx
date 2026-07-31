// src/pages/admin/Reports.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarDays, Ticket, Wallet, Loader2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const t = {
  ar: {
    pageTitle: 'التقارير والإحصائيات الشاملة للفعاليات',
    adminsOnly: 'للمشرفين فقط.',
    loading: 'جاري تحميل التقرير...',
    totalUsers: 'إجمالي المستخدمين',
    totalEvents: 'إجمالي الفعاليات',
    totalBookings: 'إجمالي الحجوزات',
    totalRevenue: 'إجمالي الإيرادات (المؤكدة)',
    usersByRole: 'المستخدمون حسب الدور',
    eventsByStatus: 'الفعاليات حسب الحالة',
    bookingsByStatus: 'الحجوزات حسب الحالة',
    allEventsStats: 'إحصائيات جميع فعاليات الموقع',
    noData: 'لا توجد بيانات كافية بعد.',
    recentBookings: 'آخر الحجوزات',
    event: 'الفعالية',
    user: 'المستخدم',
    amount: 'المبلغ',
    status: 'الحالة',
    date: 'التاريخ',
    bookingsCount: 'عدد الحجوزات',
    revenue: 'الإيرادات',
    roles: { user: 'مستخدم', organizer_pending: 'طلب معلّق', organizer: 'منظّم', admin: 'مشرف' },
    eventStatuses: { draft: 'مسودة', published: 'منشورة', cancelled: 'ملغاة', completed: 'منتهية' },
    bookingStatuses: { pending: 'بانتظار الدفع', confirmed: 'مؤكدة', cancelled: 'ملغاة' },
  },
  ku: {
    pageTitle: 'ڕاپۆرت و ئاماری گشتی بۆنەکان',
    adminsOnly: 'تەنها بۆ بەڕێوەبەران.',
    loading: 'بارکردنی ڕاپۆرت...',
    totalUsers: 'کۆی بەکارهێنەران',
    totalEvents: 'کۆی بۆنەکان',
    totalBookings: 'کۆی حجزکردنەکان',
    totalRevenue: 'کۆی داهات (پشتڕاستکراوە)',
    usersByRole: 'بەکارهێنەران بەپێی ڕۆڵ',
    eventsByStatus: 'بۆنەکان بەپێی دۆخ',
    bookingsByStatus: 'حجزکردنەکان بەپێی دۆخ',
    allEventsStats: 'ئاماری هەموو بۆنەکانی ماڵپەڕەکە',
    noData: 'زانیاری بەس نییە.',
    recentBookings: 'دوایین حجزکردنەکان',
    event: 'بۆنە',
    user: 'بەکارهێنەر',
    amount: 'بڕ',
    status: 'دۆخ',
    date: 'بەروار',
    bookingsCount: 'ژمارەی حجزەکان',
    revenue: 'داهات',
    roles: { user: 'بەکارهێنەر', organizer_pending: 'داواکاری چاوەڕوان', organizer: 'ڕێکخەر', admin: 'بەڕێوەبەر' },
    eventStatuses: { draft: 'ڕەشنووس', published: 'بڵاوکراوە', cancelled: 'هەڵوەشاوە', completed: 'تەواوبووە' },
    bookingStatuses: { pending: 'چاوەڕوانی پارەدان', confirmed: 'پشتڕاستکراوە', cancelled: 'هەڵوەشاوە' },
  },
  en: {
    pageTitle: 'Comprehensive Site Events Statistics',
    adminsOnly: 'Admins only.',
    loading: 'Loading report...',
    totalUsers: 'Total Users',
    totalEvents: 'Total Events',
    totalBookings: 'Total Bookings',
    totalRevenue: 'Total Revenue (confirmed)',
    usersByRole: 'Users by Role',
    eventsByStatus: 'Events by Status',
    bookingsByStatus: 'Bookings by Status',
    allEventsStats: 'All Site Events Statistics',
    noData: 'Not enough data yet.',
    recentBookings: 'Recent Bookings',
    event: 'Event',
    user: 'User',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
    bookingsCount: 'Bookings Count',
    revenue: 'Revenue',
    roles: { user: 'User', organizer_pending: 'Pending request', organizer: 'Organizer', admin: 'Admin' },
    eventStatuses: { draft: 'Draft', published: 'Published', cancelled: 'Cancelled', completed: 'Completed' },
    bookingStatuses: { pending: 'Awaiting payment', confirmed: 'Confirmed', cancelled: 'Cancelled' },
  },
};

export default function AdminReports() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([
      api.getUsers().catch(() => []),
      api.getEvents({ limit: 1000 }).catch(() => []),
      api.getAllBookings().catch(() => []),
    ])
      .then(([u, e, b]) => {
        setUsers(u || []);
        
        let allEventsList = [];
        if (Array.isArray(e)) {
          allEventsList = e;
        } else if (e?.events && Array.isArray(e.events)) {
          allEventsList = e.events;
        } else if (e?.data && Array.isArray(e.data)) {
          allEventsList = e.data;
        }
        
        setEvents(allEventsList);
        setBookings(b || []);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const stats = useMemo(() => {
    const usersByRole = users.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {});

    const eventsByStatus = events.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {});

    const bookingsByStatus = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

    const allEventsDetailed = events.map((ev) => {
      const evBookings = bookings.filter((b) => String(b.event_id) === String(ev.id));
      const evConfirmed = evBookings.filter((b) => b.status === 'confirmed');
      const evRevenue = evConfirmed.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

      return {
        ...ev,
        bookingsCount: evBookings.length,
        confirmedCount: evConfirmed.length,
        revenue: evRevenue,
      };
    });

    const recentBookings = [...bookings]
      .sort((a, b) => new Date(b.booked_at) - new Date(a.booked_at))
      .slice(0, 10);

    return { usersByRole, eventsByStatus, bookingsByStatus, totalRevenue, allEventsDetailed, recentBookings };
  }, [users, events, bookings]);

  // دالة لتحديد الألوان والشارات الأنيقة حسب الحالة
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'published':
      case 'confirmed':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50';
      case 'completed':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50';
      case 'cancelled':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/50';
      case 'draft':
      case 'pending':
      default:
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200/50';
    }
  };

  if (!isAdmin) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        {text.adminsOnly}
      </div>
    );
  }

  // تم إزالة الـ path من جميع البطاقات (Totals) لتصبح إحصائية بحتة بدون أي تفاعل أو توجيه
  const summaryCards = [
    { label: text.totalUsers, value: users.length, icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-500/10' },
    { label: text.totalEvents, value: events.length, icon: CalendarDays, color: 'text-purple-600 bg-purple-100 dark:bg-purple-500/10' },
    { label: text.totalBookings, value: bookings.length, icon: Ticket, color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/10' },
    { label: text.totalRevenue, value: `$${stats.totalRevenue.toFixed(2)}`, icon: Wallet, color: 'text-green-600 bg-green-100 dark:bg-green-500/10' },
  ];

  const breakdownBlock = (title, dict, labels) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-2xl p-5 shadow-sm space-y-3"
    >
      <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
      {Object.keys(dict).length === 0 ? (
        <p className="text-xs text-slate-400">{text.noData}</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(dict).map(([key, count]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-purple-200/70">{labels[key] || key}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadgeStyle(key)}`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </motion.div>
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xl md:text-2xl font-bold font-serif"
        >
          {text.pageTitle}
        </motion.h1>
      </div>

      {loading ? (
        <div className="text-center py-24 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-purple-300 text-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-6 h-6 text-purple-500" />
          </motion.div>
          <span>{text.loading}</span>
        </div>
      ) : (
        <>
          {/* Summary cards (Totals) without onClick */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((c, index) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-2xl p-4 shadow-sm space-y-2 cursor-default"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: index * 0.3 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}
                >
                  <c.icon className="w-4.5 h-4.5" />
                </motion.div>
                <p className="text-lg font-bold">{c.value}</p>
                <p className="text-[11px] text-slate-500 dark:text-purple-300/70">{c.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Breakdown grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breakdownBlock(text.usersByRole, stats.usersByRole, text.roles)}
            {breakdownBlock(text.eventsByStatus, stats.eventsByStatus, text.eventStatuses)}
            {breakdownBlock(text.bookingsByStatus, stats.bookingsByStatus, text.bookingStatuses)}
          </div>

          {/* All Events Statistics Table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-2xl overflow-hidden shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-white p-5 pb-0">{text.allEventsStats}</h3>
            <div className="overflow-x-auto p-5 pt-3">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 dark:text-purple-300/70 border-b border-slate-100 dark:border-purple-900/20">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">{text.event}</th>
                    <th className="py-2 pr-3 font-semibold">{text.status}</th>
                    <th className="py-2 pr-3 font-semibold">{text.bookingsCount}</th>
                    <th className="py-2 font-semibold">{text.revenue}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                  {stats.allEventsDetailed.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400">{text.noData}</td>
                    </tr>
                  ) : (
                    stats.allEventsDetailed.map((ev, index) => (
                      <motion.tr
                        key={ev.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                      >
                        <td className="py-2.5 pr-3 font-medium text-slate-800 dark:text-white">{ev.title || ev.name}</td>
                        <td className="py-2.5 pr-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block ${getStatusBadgeStyle(ev.status)}`}>
                            {text.eventStatuses[ev.status] || ev.status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3">{ev.bookingsCount}</td>
                        <td className="py-2.5 font-semibold text-green-600">${ev.revenue.toFixed(2)}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent bookings table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-2xl overflow-hidden shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-white p-5 pb-0">{text.recentBookings}</h3>
            <div className="overflow-x-auto p-5 pt-3">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 dark:text-purple-300/70 border-b border-slate-100 dark:border-purple-900/20">
                  <tr>
                    <th className="py-2 pr-3 font-semibold">{text.event}</th>
                    <th className="py-2 pr-3 font-semibold">{text.user}</th>
                    <th className="py-2 pr-3 font-semibold">{text.amount}</th>
                    <th className="py-2 pr-3 font-semibold">{text.status}</th>
                    <th className="py-2 font-semibold">{text.date}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                  {stats.recentBookings.map((b, index) => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <td className="py-2.5 pr-3">{b.event_title}</td>
                      <td className="py-2.5 pr-3">{b.user_name}</td>
                      <td className="py-2.5 pr-3 font-semibold">${Number(b.total_price || 0).toFixed(2)}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block ${getStatusBadgeStyle(b.status)}`}>
                          {text.bookingStatuses[b.status] || b.status}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono">{b.booked_at ? new Date(b.booked_at).toLocaleDateString() : '—'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}