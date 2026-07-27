// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, CreditCard, Sliders,
  CheckCircle2, Globe, Settings as SettingsIcon, ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const translations = {
  English: {
    settingsTitle: 'Account Settings', settingsDesc: 'Manage your account settings and set preferences.',
    notifications: 'Notifications', notificationsDesc: 'Manage alerts and reminders',
    privacy: 'Privacy & Data', privacyDesc: 'Control your profile visibility',
    payment: 'Payment Methods', paymentDesc: 'Manage your saved cards',
    preferences: 'Preferences', preferencesDesc: 'Language and regional settings',
    savedSuccessfully: 'Saved successfully', 
    publicProfile: 'Public Profile', publicProfileDesc: 'Allow other users to find your profile.',
    languageLabel: 'Language', comingSoon: 'Coming soon — not available yet on the backend.',
  },
  'العربية (Arabic)': {
    settingsTitle: 'إعدادات الحساب', settingsDesc: 'إدارة إعدادات حسابك وتفضيلاتك.',
    notifications: 'الإشعارات', notificationsDesc: 'إدارة التنبيهات والتذكيرات',
    privacy: 'الخصوصية والبيانات', privacyDesc: 'التحكم في ظهور ملفك الشخصي',
    payment: 'وسائل الدفع', paymentDesc: 'إدارة البطاقات المحفوظة',
    preferences: 'التفضيلات', preferencesDesc: 'اللغة والإعدادات الإقليمية',
    savedSuccessfully: 'تم الحفظ بنجاح', 
    publicProfile: 'ملف شخصي عام', publicProfileDesc: 'السماح للمستخدمين الآخرين بالعثور على ملفك الشخصي.',
    languageLabel: 'اللغة', comingSoon: 'قريباً — غير متاح حالياً في الخادم.',
  },
  'Kurdish (کوردی)': {
    settingsTitle: 'ڕێکخستنەکانی هەژمار', settingsDesc: 'ڕێکخستنەکانی هەژمارەکەت و ئارەزووەکانت بەڕێوەببە.',
    notifications: 'ئاگادارییەکان', notificationsDesc: 'ئاگادارییەکان بەڕێوەببە',
    privacy: 'تایبەتمەندی و داتا', privacyDesc: 'کۆنتڕۆڵی دەرکەوتنی پڕۆفایلی خۆت بکە',
    payment: 'شێوازەکانی پارەدان', paymentDesc: 'کارتە پاشەکەوتکراوەکانت بەڕێوەببە',
    preferences: 'ئارەزووەکان', preferencesDesc: 'زمان و ڕێکخستنە ناوچەییەکان',
    savedSuccessfully: 'بە سەرکەوتوویی پاشەکەوتکرا', 
    publicProfile: 'پڕۆفایلی گشتی', publicProfileDesc: 'ڕێگە بدە بە بەکارهێنەرانی تر پڕۆفایلەکەت بدۆزنەوە.',
    languageLabel: 'زمان', comingSoon: 'بەم زووانە — هێشتا لە سێرڤەردا بەردەست نییە.',
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('privacy');

  const currentLangKey = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku'
    ? 'Kurdish (کوردی)'
    : language?.includes('Arabic') || language?.includes('العربية') || language === 'ar'
    ? 'العربية (Arabic)'
    : 'English';

  const t = translations[currentLangKey] || translations['English'];
  const isRtl = currentLangKey === 'العربية (Arabic)' || currentLangKey === 'Kurdish (کوردی)';

  const menuItems = [
    { id: 'notifications', label: t.notifications, desc: t.notificationsDesc, icon: Sliders, path: '/notifications' },
    { id: 'privacy', label: t.privacy, desc: t.privacyDesc, icon: Lock, path: null },
    { id: 'payment', label: t.payment, desc: t.paymentDesc, icon: CreditCard, path: null },
    { id: 'preferences', label: t.preferences, desc: t.preferencesDesc, icon: Sliders, path: null },
  ];

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
      {/* Title Header Section with Back Arrow to Home and Settings Icon */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          {/* Back Button to Home with Arrow inside a box */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2.5 rounded-2xl bg-purple-100 dark:bg-[#DD3E93]/15 hover:bg-purple-200 dark:hover:bg-[#DD3E93]/25 border border-purple-200 dark:border-white/10 text-purple-700 dark:text-[#F0ABFC] transition cursor-pointer shadow-sm flex items-center justify-center"
            title="Go to home"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>

          <motion.div
            animate={{ 
              rotate: [0, 15, -15, 15, 0],
              scale: [1, 1.1, 1, 1.1, 1] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center"
          >
            <SettingsIcon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {t.settingsTitle}
            </h1>
            <motion.p 
              variants={itemVariants}
              className="text-purple-600 dark:text-purple-300 text-sm md:text-base leading-relaxed mt-1"
            >
              {t.settingsDesc}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Menu Items */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                custom={index}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { item.path ? navigate(item.path) : setActiveTab(item.id); }}
                className={`w-full text-start p-4 rounded-3xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                  isActive && !item.path
                    ? 'bg-purple-600 dark:bg-purple-600 text-white border-purple-500 shadow-lg dark:shadow-xl dark:shadow-purple-950/40'
                    : 'bg-white dark:bg-[#13091f] border-slate-200/80 dark:border-[#2a1745] hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-2xl border transition duration-300 group-hover:scale-110 ${
                    isActive && !item.path
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isActive && !item.path ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</h3>
                    <p className={`text-[11px] ${isActive && !item.path ? 'text-purple-100' : 'text-slate-600 dark:text-purple-300/70'}`}>{item.desc}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-[#2a1745] pb-4">
                    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{t.privacy}</h2>
                    <p className="text-xs text-slate-600 dark:text-purple-300/70">{t.privacyDesc}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl cursor-not-allowed opacity-60 shadow-sm">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.publicProfile}</h4>
                        <p className="text-[11px] text-slate-600 dark:text-purple-300/70">{t.publicProfileDesc}</p>
                      </div>
                      <input type="checkbox" disabled defaultChecked className="w-5 h-5 accent-purple-600 rounded" />
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-purple-300/60">{t.comingSoon}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-[#2a1745] pb-4">
                    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{t.payment}</h2>
                    <p className="text-xs text-slate-600 dark:text-purple-300/70">{t.paymentDesc}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-purple-300/60">{t.comingSoon}</p>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-[#2a1745] pb-4">
                    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{t.preferences}</h2>
                    <p className="text-xs text-slate-600 dark:text-purple-300/70">{t.preferencesDesc}</p>
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.languageLabel}
                      </label>
                      <select
                        value={currentLangKey}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-sm"
                      >
                        <option value="English">English</option>
                        <option value="العربية (Arabic)">العربية (Arabic)</option>
                        <option value="Kurdish (کوردی)">Kurdish (کوردی)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}