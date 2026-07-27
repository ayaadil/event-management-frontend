// src/pages/admin/Users.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ROLES = ['user', 'organizer_pending', 'organizer', 'admin'];

const t = {
  ar: {
    pageTitle: 'إدارة المستخدمين',
    totalUsers: 'إجمالي المستخدمين:',
    searchPlaceholder: 'ابحث بالاسم أو البريد الإلكتروني...',
    loading: 'جاري تحميل المستخدمين...',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    joinedDate: 'تاريخ الانضمام',
    actions: 'الإجراءات',
    deleteTitle: 'حذف المستخدم',
    adminsOnly: 'للمشرفين فقط.',
    roles: { user: 'مستخدم', organizer_pending: '⏳ طلب معلّق', organizer: 'منظّم', admin: 'مشرف' },
  },
  ku: {
    pageTitle: 'بەڕێوەبردنی بەکارهێنەران',
    totalUsers: 'کۆی بەکارهێنەران:',
    searchPlaceholder: 'گەڕان بە ناو یان ئیمەیل...',
    loading: 'بارکردنی بەکارهێنەران...',
    name: 'ناو',
    email: 'ئیمەیل',
    role: 'ڕۆڵ',
    joinedDate: 'بەرواری چوونەژوورەوە',
    actions: 'کردارەکان',
    deleteTitle: 'سڕینەوەی بەکارهێنەر',
    adminsOnly: 'تەنها بۆ بەڕێوەبەران.',
    roles: { user: 'بەکارهێنەر', organizer_pending: '⏳ داواکاری چاوەڕوان', organizer: 'ڕێکخەر', admin: 'بەڕێوەبەر' },
  },
  en: {
    pageTitle: 'Manage Users',
    totalUsers: 'Total users:',
    searchPlaceholder: 'Search by name or email...',
    loading: 'Loading users...',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    joinedDate: 'Joined Date',
    actions: 'Actions',
    deleteTitle: 'Delete user',
    adminsOnly: 'Admins only.',
    roles: { user: 'user', organizer_pending: '⏳ Pending request', organizer: 'organizer', admin: 'admin' },
  },
};

export default function AdminUsers() {
  const { language } = useLanguage();
  const { user: currentUser, isAdmin } = useAuth();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await api.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  if (!isAdmin) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        {text.adminsOnly}
      </div>
    );
  }

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-6 max-w-5xl mx-auto transition-colors duration-200"
    >
      {/* Top Header & Search Bar with Animation */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#13091f] p-5 md:p-6 rounded-2xl border border-slate-200/80 dark:border-purple-900/40 shadow-sm"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-serif flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </motion.div>
            {text.pageTitle}
          </h1>
          <p className="text-slate-500 dark:text-purple-300/60 text-xs mt-1">
            {text.totalUsers} <span className="font-semibold text-purple-600 dark:text-purple-400">{users.length}</span>
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-purple-500`} />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl py-2.5 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-slate-900 dark:text-white`}
          />
        </div>
      </motion.div>

      {/* Table Container */}
      {loading ? (
        <div className="text-center py-24 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-purple-300 text-sm">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <span>{text.loading}</span>
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-[#0b0712]/80 text-slate-500 dark:text-purple-300/70 border-b border-slate-200/80 dark:border-purple-900/30">
                <tr>
                  <th className="p-4 font-semibold">{text.name}</th>
                  <th className="p-4 font-semibold">{text.email}</th>
                  <th className="p-4 font-semibold">{text.role}</th>
                  <th className="p-4 font-semibold">{text.joinedDate}</th>
                  <th className="p-4 text-center font-semibold">{text.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                <AnimatePresence>
                  {filtered.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.04)" }}
                      className={`transition-colors ${u.role === 'organizer_pending' ? 'bg-amber-50 dark:bg-amber-500/10' : ''}`}
                    >
                      <td className="p-4 font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 text-[11px] font-bold shrink-0 shadow-sm"
                        >
                          {u.name?.charAt(0).toUpperCase()}
                        </motion.div>
                        {u.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-purple-200/70">{u.email}</td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          disabled={u.id === currentUser?.id || savingId === u.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border cursor-pointer disabled:opacity-50 transition-all
${
  u.role === 'admin'
    ? 'bg-red-100 text-red-700 border-red-500'
    : u.role === 'organizer'
    ? 'bg-green-100 text-green-700 border-green-400'
    : u.role === 'organizer_pending'
    ? 'bg-yellow-100 text-yellow-900 border-yellow-800'
    : 'bg-blue-100 text-blue-700 border-blue-500'
}`}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{text.roles[r]}</option>)}
                        </select>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-purple-200/60 font-mono">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === currentUser?.id}
                          className="text-rose-500 hover:text-rose-600 disabled:opacity-25 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition-colors inline-flex items-center justify-center"
                          title={text.deleteTitle}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}