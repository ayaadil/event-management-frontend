// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  Ticket,
  Grid3x3,
  Heart,
  User,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  Plus,
  Sun,
  Moon,
  CalendarCog,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  XCircle,
  X as XIcon,
} from 'lucide-react';
import Logo from './logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { api } from '../../services/api';

const sidebarTranslations = {
  English: {
    home: 'Home',
    explore: 'Explore',
    tickets: 'My Tickets',
    saved: 'Save Events',
    profile: 'Profile',
    setting: 'Setting',
    about: 'About',
    help: 'Help Center',
    logout: 'Log Out',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    createTitle: 'Create your own event',
    createDesc: 'Share moments, sell tickets, and connect with people',
    createBtn: 'Create event',
    becomeOrgTitle: 'Want to host events?',
    becomeOrgDesc: 'Request organizer access to start creating your own events',
    becomeOrgBtn: 'Request organizer access',
    becomeOrgSending: 'Sending request...',
    becomeOrgPending: 'Request pending approval',
    myEvents: 'My Events',
    adminUsers: 'Manage Users',
    adminCategories: 'Manage Categories',
    adminReports: 'Reports',
    approvedTitle: 'Request approved!',
    approvedDesc: 'You are now an organizer and can create events.',
    rejectedTitle: 'Request rejected',
    rejectedDesc: 'Your organizer request was not approved.',
  },
  'العربية (Arabic)': {
    home: 'الرئيسية',
    explore: 'استكشاف',
    tickets: 'تذاكري',
    saved: 'الفعاليات المحفوظة',
    profile: 'الملف الشخصي',
    setting: 'الإعدادات',
    about: 'حول الموقع',
    help: 'مركز المساعدة',
    logout: 'تسجيل الخروج',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع المظلم',
    createTitle: 'أنشئ فعاليتك الخاصة',
    createDesc: 'شارك اللحظات، بع التذاكر، وتواصل مع الناس',
    createBtn: 'إنشاء فعالية',
    becomeOrgTitle: 'تريد تنظيم فعاليات؟',
    becomeOrgDesc: 'اطلب صلاحية منظم لتقدر تنشئ فعالياتك الخاصة',
    becomeOrgBtn: 'طلب صلاحية منظم',
    becomeOrgSending: 'جارٍ إرسال الطلب...',
    becomeOrgPending: 'طلبك قيد المراجعة',
    myEvents: 'فعالياتي',
    adminUsers: 'إدارة المستخدمين',
    adminCategories: 'إدارة الفئات',
    adminReports: 'التقارير',
    approvedTitle: 'تمت الموافقة على طلبك!',
    approvedDesc: 'أصبحت الآن منظّم وتقدر تنشئ فعاليات.',
    rejectedTitle: 'تم رفض الطلب',
    rejectedDesc: 'للأسف طلب صلاحية المنظم ماتوافق عليه.',
  },
  'Kurdish (کوردی)': {
    home: 'سەرەکی',
    explore: 'گەڕان',
    tickets: 'بلیتەکانم',
    saved: 'بۆنە پاشەکەوتکراوەکان',
    profile: 'پڕۆفایل',
    setting: 'ڕێکخستن',
    about: 'دەربارە',
    help: 'ناوەندی یارمەتی',
    logout: 'دەرچوون',
    lightMode: 'دۆخی ڕووناک',
    darkMode: 'دۆخی تاریک',
    createTitle: 'بۆنەی خۆت دروست بکە',
    createDesc: 'ساتەکان هاوبەش بکە، بلیت بفرۆشە و پەیوەندی بکە',
    createBtn: 'دروستکردنی بۆنە',
    becomeOrgTitle: 'دەتەوێت چالاکی ڕێکبخەیت؟',
    becomeOrgDesc: 'داواکاری دەسەڵاتی ڕێکخەر بکە بۆ دروستکردنی چالاکییەکانی خۆت',
    becomeOrgBtn: 'داواکردنی دەسەڵاتی ڕێکخەر',
    becomeOrgSending: 'ناردنی داواکاری...',
    becomeOrgPending: 'داواکارییەکەت چاوەڕوانی پێداچوونەوەیە',
    myEvents: 'چالاکییەکانم',
    adminUsers: 'بەڕێوەبردنی بەکارهێنەران',
    adminCategories: 'بەڕێوەبردنی پۆلەکان',
    adminReports: 'ڕاپۆرت',
    approvedTitle: 'داواکارییەکەت پەسەند کرا!',
    approvedDesc: 'ئێستا وەک ڕێکخەر دەتوانیت بۆنە دروست بکەیت.',
    rejectedTitle: 'داواکارییەکەت ڕەت کرایەوە',
    rejectedDesc: 'داواکاری ڕێکخەربوونت پەسەند نەکرا.',
  },
};

export default function Sidebar() {
  const { user, logout, isOrganizer, isAdmin, updateProfile, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [requestingOrganizer, setRequestingOrganizer] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);
  const [statusToast, setStatusToast] = React.useState(null); // 'approved' | 'rejected' | null

  const isPendingOrganizer = user?.role === 'organizer_pending';

  const prevRoleRef = React.useRef(user?.role);

  const loadPendingCount = React.useCallback(() => {
    if (!isAdmin) return;
    api.getUsers()
      .then((users) => {
        const count = users.filter((u) => u.role === 'organizer_pending').length;
        setPendingCount(count);
      })
      .catch(() => setPendingCount(0));
  }, [isAdmin]);

  // مراقبة أدمن users عند تغيير الصفحة
  React.useEffect(() => {
    loadPendingCount();
  }, [loadPendingCount, location.pathname]);

  // تحديث تلقائي لعدد الطلبات المعلّقة كل 30 ثانية (بدل الاعتماد فقط على تغيّر الصفحة)
  useAutoRefresh(loadPendingCount, 120000, isAdmin);

  // ملاحظة: تحديث بيانات المستخدم (refreshUser) صار مسؤولية AuthContext فقط،
  // حذفنا الـ setInterval المكرر اللي كان هنا كل 3 ثواني لتجنب تكرار الطلبات.

  // مراقبة تغيّر الـ role وإظهار رسالة موافقة/رفض
  React.useEffect(() => {
    const prevRole = prevRoleRef.current;
    const currentRole = user?.role;

    if (prevRole === 'organizer_pending' && currentRole === 'organizer') {
      setStatusToast('approved');
    } else if (prevRole === 'organizer_pending' && currentRole === 'user') {
      setStatusToast('rejected');
    }

    prevRoleRef.current = currentRole;
  }, [user?.role]);

  // إخفاء الرسالة تلقائيًا بعد 6 ثواني
  React.useEffect(() => {
    if (!statusToast) return;
    const timeout = setTimeout(() => setStatusToast(null), 6000);
    return () => clearTimeout(timeout);
  }, [statusToast]);

  const handleRequestOrganizer = async () => {
    setRequestingOrganizer(true);
    try {
      await updateProfile({ role: 'organizer_pending' });
    } catch (err) {
      console.error('Failed to request organizer access', err);
    } finally {
      setRequestingOrganizer(false);
    }
  };

  const handleUserLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLangKey = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku'
    ? 'Kurdish (کوردی)'
    : language?.includes('Arabic') || language?.includes('العربية') || language === 'ar'
    ? 'العربية (Arabic)'
    : 'English';

  const isRtl = currentLangKey === 'العربية (Arabic)' || currentLangKey === 'Kurdish (کوردی)';
  const t = sidebarTranslations[currentLangKey] || sidebarTranslations['English'];

  const navItems = [
    { to: '/home', label: t.home, icon: Home },
    { to: '/explore', label: t.explore, icon: Compass },
    { to: '/tickets', label: t.tickets, icon: Ticket },
    { to: '/saved', label: t.saved, icon: Heart },
    { to: '/profile', label: t.profile, icon: User },
    // يظهر بس للمنظم أو الأدمن
    ...(isOrganizer || isAdmin ? [{ to: '/my-events', label: t.myEvents, icon: CalendarCog }] : []),
  ];

  const adminItems = isAdmin
    ? [
        { to: '/admin/users', label: t.adminUsers, icon: ShieldCheck, badge: pendingCount },
        { to: '/admin/categories', label: t.adminCategories, icon: Grid3x3 },
        { to: '/admin/reports', label: t.adminReports, icon: BarChart3 },
      ]
    : [];

  const footerItems = [
    { to: '/settings', label: t.setting, icon: Settings },
    { to: '/about', label: t.about, icon: Info },
    { to: '/help', label: t.help, icon: HelpCircle },
  ];

  const itemVariants = {
    hidden: { opacity: 0, x: isRtl ? 10 : -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Toast: موافقة / رفض طلب المنظم */}
      <AnimatePresence>
        {statusToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`fixed top-5 ${isRtl ? 'left-5' : 'right-5'} z-[100] w-80 max-w-[90vw] rounded-2xl shadow-lg border p-4 flex items-start gap-3 ${
              statusToast === 'approved'
                ? 'bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/40'
                : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/40'
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${statusToast === 'approved' ? 'text-green-600' : 'text-rose-600'}`}>
              {statusToast === 'approved' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div className="flex-1">
              <h4 className={`text-xs font-bold ${statusToast === 'approved' ? 'text-green-700 dark:text-green-400' : 'text-rose-700 dark:text-rose-400'}`}>
                {statusToast === 'approved' ? t.approvedTitle : t.rejectedTitle}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                {statusToast === 'approved' ? t.approvedDesc : t.rejectedDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast(null)}
              className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <XIcon size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        dir={isRtl ? 'rtl' : 'ltr'}
        className="hidden md:flex w-64 flex-col justify-between p-5 bg-white dark:bg-[#130B38] border-r border-slate-200 dark:border-white/10 h-screen overflow-y-auto text-slate-800 dark:text-white shrink-0 transition-colors duration-200 shadow-sm"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-2 py-1 flex items-center"
          >
            <Logo size="sm" showText={true} />
          </motion.div>

          <motion.nav
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.06, delayChildren: 0.15 }}
            className="space-y-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <motion.div key={item.to} variants={itemVariants}>
                  <NavLink
                    to={item.to}
                    className="relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors duration-200"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-purple-50 dark:bg-white/15 shadow-xs"
                      />
                    )}
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: -8 }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative z-10 flex items-center ${isActive ? 'text-purple-700 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}
                    >
                      <Icon size={16} />
                    </motion.span>
                    <span className={`relative z-10 ${isActive ? 'text-purple-700 dark:text-white font-semibold' : 'text-slate-600 dark:text-gray-300 group-hover:text-purple-600'}`}>
                      {item.label}
                    </span>
                  </NavLink>
                </motion.div>
              );
            })}

            {adminItems.length > 0 && (
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-white/5 space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <motion.div key={item.to} variants={itemVariants}>
                      <NavLink
                        to={item.to}
                        className="relative flex items-center justify-between gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors duration-200"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active-pill"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            className="absolute inset-0 rounded-xl bg-purple-50 dark:bg-white/15 shadow-xs"
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-3.5">
                          <span className={`flex items-center ${isActive ? 'text-purple-700 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}>
                            <Icon size={16} />
                          </span>
                          <span className={`${isActive ? 'text-purple-700 dark:text-white font-semibold' : 'text-slate-600 dark:text-gray-300'}`}>
                            {item.label}
                          </span>
                        </span>
                        {!!item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative z-10 bg-amber-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shrink-0"
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="space-y-1">
            {footerItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-purple-700 bg-purple-50 dark:text-white dark:bg-white/15 font-semibold'
                        : 'text-slate-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`
                  }
                >
                  <motion.span whileHover={{ scale: 1.15, rotate: 8 }} whileTap={{ scale: 0.9 }}>
                    <Icon size={15} />
                  </motion.span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-1">
              <motion.button
                whileHover={{ scale: 1.02, x: isRtl ? -3 : 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <motion.span
                  key={isDarkMode ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-purple-600" />}
                </motion.span>
                <span>{isDarkMode ? t.lightMode : t.darkMode}</span>
              </motion.button>
            </div>

            <div className="pt-1">
              <motion.button
                whileHover={{ scale: 1.02, x: isRtl ? -3 : 3 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleUserLogout}
                className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                <span>{t.logout}</span>
              </motion.button>
            </div>
          </div>

          {(isOrganizer || isAdmin) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 dark:from-[#2A1868] dark:to-[#1D104A] border border-purple-500/20 text-center space-y-2 shadow-md text-white"
            >
              <motion.h4
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-xs font-semibold text-white"
              >
                {t.createTitle}
              </motion.h4>
              <p className="text-[10px] text-purple-200 leading-tight">
                {t.createDesc}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate('/create-event')}
                className="w-full py-2 px-3 mt-1 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <motion.span
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
                >
                  <Plus size={14} />
                </motion.span>
                <span>{t.createBtn}</span>
              </motion.button>
            </motion.div>
          )}

          {!(isOrganizer || isAdmin) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
             className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 dark:from-[#2A1868] dark:to-[#1D104A] border border-purple-500/20 text-center space-y-2 shadow-md text-white"
            >
              <motion.h4
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="text-xs font-semibold text-white"
              >
                {t.becomeOrgTitle}
              </motion.h4>
              <p className="text-[10px] text-purple-200 leading-tight">
                {t.becomeOrgDesc}
              </p>
              {isPendingOrganizer ? (
                <div className="w-full py-2 px-3 mt-1 bg-white/10 text-purple-200 text-xs font-medium rounded-xl border border-white/10 flex items-center justify-center gap-1.5">
                  {t.becomeOrgPending}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  disabled={requestingOrganizer}
                  onClick={handleRequestOrganizer}
                  className="w-full py-2 px-3 mt-1 bg-white text-[#6D4AA2] hover:bg-[#F7F3FB] text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{requestingOrganizer ? t.becomeOrgSending : t.becomeOrgBtn}</span>
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
}