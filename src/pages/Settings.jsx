// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Bell, Lock, CreditCard, Sliders,
  CheckCircle2, Mail, Globe, Settings as SettingsIcon,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const translations = {
  English: {
    settingsTitle: 'Account Settings', settingsDesc: 'Manage your account settings and set preferences.',
    accountInfo: 'Account Information', accountDesc: 'Update your personal details',
    security: 'Security & Password', securityDesc: 'Password and login protection',
    notifications: 'Notifications', notificationsDesc: 'Manage alerts and reminders',
    privacy: 'Privacy & Data', privacyDesc: 'Control your profile visibility',
    payment: 'Payment Methods', paymentDesc: 'Manage your saved cards',
    preferences: 'Preferences', preferencesDesc: 'Language and regional settings',
    profileInfo: 'Profile Information', profileDesc: 'Update your personal details here.',
    savedSuccessfully: 'Saved successfully', fullName: 'Full Name', email: 'Email Address',
    saveChanges: 'Save Changes', newPassword: 'New Password', confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password', passwordUpdated: 'Password updated', mismatch: 'Passwords do not match',
    publicProfile: 'Public Profile', publicProfileDesc: 'Allow other users to find your profile.',
    languageLabel: 'Language', comingSoon: 'Coming soon — not available yet on the backend.',
  },
  'العربية (Arabic)': {
    settingsTitle: 'إعدادات الحساب', settingsDesc: 'إدارة إعدادات حسابك وتفضيلاتك.',
    accountInfo: 'معلومات الحساب', accountDesc: 'تحديث تفاصيلك الشخصية',
    security: 'الأمان وكلمة المرور', securityDesc: 'كلمة المرور وحماية الدخول',
    notifications: 'الإشعارات', notificationsDesc: 'إدارة التنبيهات والتذكيرات',
    privacy: 'الخصوصية والبيانات', privacyDesc: 'التحكم في ظهور ملفك الشخصي',
    payment: 'وسائل الدفع', paymentDesc: 'إدارة البطاقات المحفوظة',
    preferences: 'التفضيلات', preferencesDesc: 'اللغة والإعدادات الإقليمية',
    profileInfo: 'معلومات الملف الشخصي', profileDesc: 'قم بتحديث تفاصيلك الشخصية هنا.',
    savedSuccessfully: 'تم الحفظ بنجاح', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني',
    saveChanges: 'حفظ التغييرات', newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
    updatePassword: 'تحديث كلمة المرور', passwordUpdated: 'تم تحديث كلمة المرور', mismatch: 'كلمتا المرور غير متطابقتين',
    publicProfile: 'ملف شخصي عام', publicProfileDesc: 'السماح للمستخدمين الآخرين بالعثور على ملفك الشخصي.',
    languageLabel: 'اللغة', comingSoon: 'قريباً — غير متاح حالياً في الخادم.',
  },
  'Kurdish (کوردی)': {
    settingsTitle: 'ڕێکخستنەکانی هەژمار', settingsDesc: 'ڕێکخستنەکانی هەژمارەکەت و ئارەزووەکانت بەڕێوەببە.',
    accountInfo: 'زانیاری هەژمار', accountDesc: 'وردەکارییە کەسییەکانت نوێبکەرەوە',
    security: 'ئاسایش و وشەی نهێنی', securityDesc: 'وشەی نهێنی و پاراستنی چوونەژوورەوە',
    notifications: 'ئاگادارییەکان', notificationsDesc: 'ئاگادارییەکان بەڕێوەببە',
    privacy: 'تایبەتمەندی و داتا', privacyDesc: 'کۆنتڕۆڵی دەرکەوتنی پڕۆفایلی خۆت بکە',
    payment: 'شێوازەکانی پارەدان', paymentDesc: 'کارتە پاشەکەوتکراوەکانت بەڕێوەببە',
    preferences: 'ئارەزووەکان', preferencesDesc: 'زمان و ڕێکخستنە ناوچەییەکان',
    profileInfo: 'زانیاری پڕۆفایل', profileDesc: 'وردەکارییە کەسییەکانت لێرە نوێبکەرەوە.',
    savedSuccessfully: 'بە سەرکەوتوویی پاشەکەوتکرا', fullName: 'ناوی تەواو', email: 'پۆستی ئەلیکترۆنی',
    saveChanges: 'پاشەکەوتکردنی گۆڕانکارییەکان', newPassword: 'وشەی نهێنی نوێ', confirmPassword: 'دووپاتکردنەوەی وشەی نهێنی',
    updatePassword: 'نوێکردنەوەی وشەی نهێنی', passwordUpdated: 'وشەی نهێنی نوێکرایەوە', mismatch: 'وشەکانی نهێنی یەک ناگرنەوە',
    publicProfile: 'پڕۆفایلی گشتی', publicProfileDesc: 'ڕێگە بدە بە بەکارهێنەرانی تر پڕۆفایلەکەت بدۆزنەوە.',
    languageLabel: 'زمان', comingSoon: 'بەم زووانە — هێشتا لە سێرڤەردا بەردەست نییە.',
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [savedMessage, setSavedMessage] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState('');

  const [formData, setFormData] = useState({ fullName: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

  useEffect(() => {
    setFormData({ fullName: user?.name || '', email: user?.email || '' });
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name: formData.fullName, email: formData.email });
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2500);
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordSaved('mismatch');
      return;
    }
    try {
      await updateProfile({ password: passwordData.newPassword });
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setPasswordSaved('ok');
      setTimeout(() => setPasswordSaved(''), 2500);
    } catch (err) {
      console.error('Failed to update password', err);
    }
  };

  const currentLangKey = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku'
    ? 'Kurdish (کوردی)'
    : language?.includes('Arabic') || language?.includes('العربية') || language === 'ar'
    ? 'العربية (Arabic)'
    : 'English';

  const t = translations[currentLangKey] || translations['English'];
  const isRtl = currentLangKey === 'العربية (Arabic)' || currentLangKey === 'Kurdish (کوردی)';

  const menuItems = [
    { id: 'account', label: t.accountInfo, desc: t.accountDesc, icon: User, path: null },
    { id: 'security', label: t.security, desc: t.securityDesc, icon: Shield, path: null },
    { id: 'notifications', label: t.notifications, desc: t.notificationsDesc, icon: Bell, path: '/notifications' },
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
      {/* Title Header Section */}
      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
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
          >
            <SettingsIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {t.settingsTitle}
            </h1>
          </div>
        </div>
        <p className="text-slate-600 dark:text-purple-300/70 text-sm md:text-base leading-relaxed mt-2">
          {t.settingsDesc}
        </p>
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
              {activeTab === 'account' && (
                <motion.form
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSave} 
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-[#2a1745] pb-4">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{t.profileInfo}</h2>
                      <p className="text-xs text-slate-600 dark:text-purple-300/70">{t.profileDesc}</p>
                    </div>
                    {savedMessage && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-2xl border border-green-200 dark:border-green-500/30 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> {t.savedSuccessfully}
                      </motion.span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.fullName}
                      </label>
                      <input
                        type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.email}
                      </label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-[#2a1745]">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-2xl text-sm transition shadow-sm shadow-purple-600/20 dark:shadow-purple-950/40 cursor-pointer"
                    >
                      {t.saveChanges}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-[#2a1745] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">{t.security}</h2>
                      <p className="text-xs text-slate-600 dark:text-purple-300/70">{t.securityDesc}</p>
                    </div>
                    {passwordSaved === 'ok' && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-2xl border border-green-200 dark:border-green-500/30"
                      >
                        <CheckCircle2 className="w-4 h-4" /> {t.passwordUpdated}
                      </motion.span>
                    )}
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold">{t.newPassword}</label>
                      <input
                        type="password" placeholder="••••••••" value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold">{t.confirmPassword}</label>
                      <input
                        type="password" placeholder="••••••••" value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-sm"
                      />
                    </div>
                    {passwordSaved === 'mismatch' && <p className="text-xs text-rose-500">{t.mismatch}</p>}
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePasswordUpdate} 
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-2xl text-sm transition cursor-pointer shadow-sm shadow-purple-600/20 dark:shadow-purple-950/30"
                    >
                      {t.updatePassword}
                    </motion.button>
                  </div>
                </motion.div>
              )}

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