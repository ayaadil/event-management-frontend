// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, Heart,
  Ticket, Edit3, ShieldCheck, LogOut, Save, X, KeyRound, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProfilePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });

  const [stats, setStats] = useState({ tickets: 0, saved: 0, attended: 0 });

  useEffect(() => {
    setFormData({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  useEffect(() => {
    Promise.all([
      api.getMyBookings().catch(() => []),
      api.getMySavedEvents().catch(() => []),
    ]).then(([bookings, saved]) => {
      setStats({
        tickets: bookings.filter((b) => b.status !== 'cancelled').length,
        saved: saved.length,
        attended: bookings.filter((b) => b.checked_in_at).length,
      });
    });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const uiTexts = {
    ar: {
      profileTitle: 'الملف الشخصي',
      subtitle: 'إدارة معلومات حسابك الشخصي وإعدادات الأمان الخاصة بك',
      editProfile: 'تعديل الملف الشخصي', saveChanges: 'حفظ التعديلات', cancel: 'إلغاء',
      myTickets: 'تذاكري', savedEvents: 'الفعاليات المحفوظة', attended: 'تم الحضور',
      tabInfo: 'المعلومات الشخصية', tabSecurity: 'أمان الحساب', fullName: 'الاسم الكامل',
      emailAddress: 'بريد الكتروني', memberSince: 'عضو منذ',
      changePassword: 'تغيير كلمة المرور', changePasswordDesc: 'قم بتحديث كلمة المرور بانتظام للحفاظ على أمان حسابك',
      update: 'تحديث', logOut: 'تسجيل الخروج', logOutDesc: 'تسجيل الخروج من هذا الجهاز',
      newPass: 'كلمة المرور الجديدة', confirmPass: 'تأكيد كلمة المرور الجديدة', savePass: 'تحديث كلمة المرور',
      savedMsg: 'تم حفظ التعديلات بنجاح', mismatchMsg: 'كلمات المرور غير متطابقة!',
      passChangedMsg: 'تم تغيير كلمة المرور بنجاح ✨',
      roles: { user: 'مستخدم', organizer: 'منظم فعاليات', admin: 'مدير النظام' },
    },
    ku: {
      profileTitle: 'پڕۆفایل',
      subtitle: 'بەڕێوەبردنی زانیارییەکانی هەژمارەکەت و ئاسایش',
      editProfile: 'دەستکاری پڕۆفایل', saveChanges: 'پاشەکەوتکردن', cancel: 'هەڵوەشاندنەوە',
      myTickets: 'پەتاسەکانم', savedEvents: 'پاشەکەوتکراوەکان', attended: 'بەشداربوو',
      tabInfo: 'زانیاری کەسی', tabSecurity: 'ئاسایشی هەژمار', fullName: 'ناوی تەواو',
      emailAddress: 'ئیمەیڵ', memberSince: 'ئەندام لە',
      changePassword: 'گۆڕینی وشەی تێپەڕ', changePasswordDesc: 'وشەی تێپەڕ نوێبکەرەوە بۆ پاراستنی هەژمارەکەت',
      update: 'نوێکردنەوە', logOut: 'دەرچوون', logOutDesc: 'دەرچوون لەم ئامێرە',
      newPass: 'وشەی تێپەڕی نوێ', confirmPass: 'پشتڕاستکردنەوەی وشەی تێپەڕ', savePass: 'نوێکردنەوەی وشەی تێپەڕ',
      savedMsg: 'گۆڕانکارییەکان پاشەکەوتکران', mismatchMsg: 'وشەی تێپەڕەکان یەک ناگرنەوە!',
      passChangedMsg: 'وشەی تێپەڕ بە سەرکەوتوویی گۆڕا ✨',
      roles: { user: 'بەکارهێنەر', organizer: 'ڕێکخەری چالاکی', admin: 'بەڕێوەبەری سیستەم' },
    },
    en: {
      profileTitle: 'Profile',
      subtitle: 'Manage your personal account information and security settings',
      editProfile: 'Edit Profile', saveChanges: 'Save Changes', cancel: 'Cancel',
      myTickets: 'My Tickets', savedEvents: 'Saved Events', attended: 'Attended',
      tabInfo: 'Personal Info', tabSecurity: 'Account Security', fullName: 'Full Name',
      emailAddress: 'Email Address', memberSince: 'Member since',
      changePassword: 'Change Password', changePasswordDesc: 'Update your password regularly to keep your account safe',
      update: 'Update', logOut: 'Log Out', logOutDesc: 'Log out from this device',
      newPass: 'New Password', confirmPass: 'Confirm New Password', savePass: 'Update Password',
      savedMsg: 'Changes saved successfully', mismatchMsg: 'Passwords do not match!',
      passChangedMsg: 'Password changed successfully ✨',
      roles: { user: 'Event Enthusiast', organizer: 'Event Organizer', admin: 'System Admin' },
    }
  };
  const t = uiTexts[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: formData.name, email: formData.email });
      setIsEditing(false);
      showToast(t.savedMsg);
    } catch (err) {
      showToast(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast(t.mismatchMsg);
      return;
    }
    try {
      await updateProfile({ password: passwordData.newPassword });
      setShowPasswordModal(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      showToast(t.passChangedMsg);
    } catch (err) {
      showToast(err.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const memberSinceYear = user?.created_at ? new Date(user.created_at).getFullYear() : null;
  const infoInputClass = "w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-300 dark:border-purple-700/50 rounded-2xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-white mt-1 focus:outline-none focus:border-purple-500 transition shadow-sm font-sans";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-4xl mx-auto px-4 py-8 overflow-hidden font-sans"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-900 to-indigo-950 border border-purple-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section: Arrow with box, User Icon without box */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          {/* Back Button with Arrow inside a box */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl bg-purple-100 dark:bg-[#DD3E93]/15 hover:bg-purple-200 dark:hover:bg-[#DD3E93]/25 border border-purple-200 dark:border-white/10 text-purple-700 dark:text-[#F0ABFC] transition cursor-pointer shadow-sm flex items-center justify-center"
            title="Go back"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* User Icon without box */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="text-purple-600 dark:text-[#F0ABFC] flex items-center justify-center"
          >
            <User className="w-7 h-7" />
          </motion.div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {t.profileTitle}
            </h1>
            <motion.p
              variants={itemVariants}
              className="text-purple-600 dark:text-purple-300 text-sm md:text-base leading-relaxed mt-1"
            >
              {t.subtitle}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Header Banner */}
        <motion.div 
          variants={itemVariants}
          className="relative bg-gradient-to-r from-purple-100 via-purple-50 to-white dark:from-[#2E1B4F] dark:via-[#2E1B4F]/90 dark:to-[#1F1035] rounded-3xl p-6 md:p-8 border border-purple-200 dark:border-white/10 shadow-xl overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">

            <div className={`flex flex-col md:flex-row items-center gap-6 text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ duration: 0.3 }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-purple-800 shadow-xl"
              >
                <div className="w-full h-full rounded-full bg-purple-900 flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </motion.div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-xl md:text-2xl font-bold tracking-wide text-slate-900 dark:text-white font-sans">{user?.name}</h2>
                  <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
                <p className="text-purple-600/80 dark:text-purple-300/80 text-xs md:text-sm">{t.roles[user?.role] || t.roles.user}</p>
                {memberSinceYear && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center md:justify-start gap-1 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" /> {t.memberSince} {memberSinceYear}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto z-20">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg"
                  >
                    <Save className="w-3.5 h-3.5" /> {t.saveChanges}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsEditing(false); setFormData({ name: user?.name || '', email: user?.email || '' }); }}
                    className="flex items-center justify-center gap-2 bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg"
                  >
                    <X className="w-3.5 h-3.5" /> {t.cancel}
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab('info');
                    setIsEditing(true);
                  }}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold transition shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t.editProfile}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 md:gap-4">
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tickets')} 
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-lg"
          >
            <Ticket className="w-5 h-5 text-purple-500 dark:text-[#F0ABFC] mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.tickets}</span>
            <span className="text-[11px] text-slate-500 dark:text-[#B6A6D6]">{t.myTickets}</span>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/saved')} 
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-lg"
          >
            <Heart className="w-5 h-5 text-fuchsia-500 dark:text-[#F0ABFC] mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.saved}</span>
            <span className="text-[11px] text-slate-500 dark:text-[#B6A6D6]">{t.savedEvents}</span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tickets?filter=attended')}
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-lg"
          >
            <Calendar className="w-5 h-5 text-purple-500 dark:text-[#F0ABFC] mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.attended}</span>
            <span className="text-[11px] text-slate-500 dark:text-[#B6A6D6]">{t.attended}</span>
          </motion.div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div variants={itemVariants} className="flex border-b border-slate-200 dark:border-white/10 gap-6 text-sm font-medium z-20 relative">
          <button type="button" onClick={() => setActiveTab('info')} className={`pb-3 transition relative cursor-pointer ${activeTab === 'info' ? 'text-purple-600 dark:text-[#F0ABFC] font-bold' : 'text-slate-500 dark:text-[#B6A6D6] hover:text-slate-700 dark:hover:text-white'}`}>
            {t.tabInfo}
            {activeTab === 'info' && <motion.span layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 dark:bg-[#F0ABFC] rounded-full" />}
          </button>
          <button type="button" onClick={() => setActiveTab('security')} className={`pb-3 transition relative cursor-pointer ${activeTab === 'security' ? 'text-purple-600 dark:text-[#F0ABFC] font-bold' : 'text-slate-500 dark:text-[#B6A6D6] hover:text-slate-700 dark:hover:text-white'}`}>
            {t.tabSecurity}
            {activeTab === 'security' && <motion.span layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 dark:bg-[#F0ABFC] rounded-full" />}
          </button>
        </motion.div>

        {/* Tab Content with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-2xl text-purple-600 dark:text-[#F0ABFC]">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-purple-600/70 dark:text-[#B6A6D6] block font-medium">{t.fullName}</span>
                  {isEditing ? (
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={infoInputClass} />
                  ) : (
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 flex items-center gap-4 shadow-xl">
                <div className="p-3 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-2xl text-purple-600 dark:text-[#F0ABFC]">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-purple-600/70 dark:text-[#B6A6D6] block font-medium">{t.emailAddress}</span>
                  {isEditing ? (
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={infoInputClass} />
                  ) : (
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <motion.div 
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => setShowPasswordModal(true)} 
                className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 flex items-center justify-between hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-2xl text-purple-600 dark:text-[#F0ABFC]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.changePassword}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#B6A6D6]">{t.changePasswordDesc}</p>
                  </div>
                </div>
                <span className="text-xs text-purple-600 dark:text-[#F0ABFC] hover:underline">{t.update}</span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={handleLogout} 
                className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-3xl p-5 flex items-center justify-between hover:border-rose-400 dark:hover:border-rose-500/50 transition cursor-pointer shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-100 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-300">{t.logOut}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#B6A6D6]">{t.logOutDesc}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Password Modal with Animation */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#2E1B4F] border border-purple-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-2xl text-purple-600 dark:text-[#F0ABFC]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.changePassword}</h3>
                </div>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-700 dark:text-[#B6A6D6] block mb-1.5 font-medium">{t.newPass}</label>
                  <input
                    type="password" required minLength={6} placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition shadow-sm font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 dark:text-[#B6A6D6] block mb-1.5 font-medium">{t.confirmPass}</label>
                  <input
                    type="password" required placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition shadow-sm font-sans"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer">
                    {t.cancel}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40 transition cursor-pointer">
                    {t.savePass}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}