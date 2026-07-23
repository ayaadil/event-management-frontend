import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import Logo from './logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const sidebarTranslations = {
  English: {
    home: 'Home',
    explore: 'Explore',
    tickets: 'My Tickets',
    categories: 'Categories',
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
  },
  'العربية (Arabic)': {
    home: 'الرئيسية',
    explore: 'استكشاف',
    tickets: 'تذاكري',
    categories: 'الفئات',
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
  },
  'Kurdish (کوردی)': {
    home: 'سەرەکی',
    explore: 'گەڕان',
    tickets: 'بلیتەکانم',
    categories: 'پۆلەکان',
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
  },
};

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

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
    { to: '/categories', label: t.categories, icon: Grid3x3 },
    { to: '/saved', label: t.saved, icon: Heart },
    { to: '/profile', label: t.profile, icon: User },
  ];

  const footerItems = [
    { to: '/settings', label: t.setting, icon: Settings },
    { to: '/about', label: t.about, icon: Info },
    { to: '/help', label: t.help, icon: HelpCircle },
  ];

  return (
    <aside
      dir={isRtl ? 'rtl' : 'ltr'}
      className="hidden md:flex w-64 flex-col justify-between p-5 bg-white dark:bg-[#130B38] border-r border-slate-200 dark:border-white/10 min-h-screen text-slate-800 dark:text-white shrink-0 transition-colors duration-200 shadow-sm"
    >
      <div className="space-y-6">
        <div className="px-2 py-1 flex items-center">
          <Logo size="sm" showText={true} />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-purple-700 bg-purple-50 dark:text-white dark:bg-white/15 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
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
                <Icon size={15} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-purple-600" />}
              <span>{isDarkMode ? t.lightMode : t.darkMode}</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleUserLogout}
              className="w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 dark:from-[#2A1868] dark:to-[#1D104A] border border-purple-500/20 text-center space-y-2 shadow-md text-white">
          <h4 className="text-xs font-semibold text-white">
            {t.createTitle}
          </h4>
          <p className="text-[10px] text-purple-200 leading-tight">
            {t.createDesc}
          </p>
          <button
            type="button"
            onClick={() => navigate('/create-event')}
            className="w-full py-2 px-3 mt-1 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>{t.createBtn}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}