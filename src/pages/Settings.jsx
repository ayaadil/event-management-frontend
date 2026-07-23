import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Bell,
  Lock,
  CreditCard,
  Sliders,
  Camera,
  CheckCircle2,
  Mail,
  MapPin, 
  Phone,
  FileText,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  English: {
    settingsTitle: 'Account Settings',
    settingsDesc: 'Manage your account settings and set preferences.',
    accountInfo: 'Account Information',
    accountDesc: 'Update your personal details',
    security: 'Security & Password',
    securityDesc: 'Password and login protection',
    notifications: 'Notifications',
    notificationsDesc: 'Manage alerts and reminders',
    privacy: 'Privacy & Data',
    privacyDesc: 'Control your profile visibility',
    payment: 'Payment Methods',
    paymentDesc: 'Manage your saved cards',
    preferences: 'Preferences',
    preferencesDesc: 'Language and regional settings',
    profileInfo: 'Profile Information',
    profileDesc: 'Update your photo and personal details here.',
    savedSuccessfully: 'Saved successfully',
    uploadPhoto: 'Upload New Photo',
    fullName: 'Full Name',
    location: 'Location',
    email: 'Email Address',
    phone: 'Phone Number',
    bio: 'Bio',
    saveChanges: 'Save Changes',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    emailNotif: 'Email Notifications',
    emailNotifDesc: 'Receive emails about your activity and ticket purchases.',
    publicProfile: 'Public Profile',
    publicProfileDesc: 'Allow other users to find your profile.',
    languageLabel: 'Language',
  },
  'العربية (Arabic)': {
    settingsTitle: 'إعدادات الحساب',
    settingsDesc: 'إدارة إعدادات حسابك وتفضيلاتك.',
    accountInfo: 'معلومات الحساب',
    accountDesc: 'تحديث تفاصيلك الشخصية',
    security: 'الأمان وكلمة المرور',
    securityDesc: 'كلمة المرور وحماية الدخول',
    notifications: 'الإشعارات',
    notificationsDesc: 'إدارة التنبيهات والتذكيرات',
    privacy: 'الخصوصية والبيانات',
    privacyDesc: 'التحكم في ظهور ملفك الشخصي',
    payment: 'وسائل الدفع',
    paymentDesc: 'إدارة البطاقات المحفوظة',
    preferences: 'التفضيلات',
    preferencesDesc: 'اللغة والإعدادات الإقليمية',
    profileInfo: 'معلومات الملف الشخصي',
    profileDesc: 'قم بتحديث صورتك وتفاصيلك الشخصية هنا.',
    savedSuccessfully: 'تم الحفظ بنجاح',
    uploadPhoto: 'رفع صورة جديدة',
    fullName: 'الاسم الكامل',
    location: 'الموقع',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    bio: 'النبذة التعريفية',
    saveChanges: 'حفظ التغييرات',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    emailNotif: 'إشعارات البريد الإلكتروني',
    emailNotifDesc: 'تلقي رسائل حول نشاطك وحجز التذاكر.',
    publicProfile: 'ملف شخصي عام',
    publicProfileDesc: 'السماح للمستخدمين الآخرين بالعثور على ملفك الشخصي.',
    languageLabel: 'اللغة',
  },
  'Kurdish (کوردی)': {
    settingsTitle: 'ڕێکخستنەکانی هەژمار',
    settingsDesc: 'ڕێکخستنەکانی هەژمارەکەت و ئارەزووەکانت بەڕێوەببە.',
    accountInfo: 'زانیاری هەژمار',
    accountDesc: 'وردەکارییە کەسییەکانت نوێبکەرەوە',
    security: 'ئاسایش و وشەی نهێنی',
    securityDesc: 'وشەی نهێنی و پاراستنی چوونەژوورەوە',
    notifications: 'ئاگادارییەکان',
    notificationsDesc: 'ئاگادارییەکان بەڕێوەببە',
    privacy: 'تایبەتمەندی و داتا',
    privacyDesc: 'کۆنتڕۆڵی دەرکەوتنی پڕۆفایلی خۆت بکە',
    payment: 'شێوازەکانی پارەدان',
    paymentDesc: 'کارتە پاشەکەوتکراوەکانت بەڕێوەببە',
    preferences: 'ئارەزووەکان',
    preferencesDesc: 'زمان و ڕێکخستنە ناوچەییەکان',
    profileInfo: 'زانیاری پڕۆفایل',
    profileDesc: 'وێنە و وردەکارییە کەسییەکانت لێرە نوێبکەرەوە.',
    savedSuccessfully: 'بە سەرکەوتوویی پاشەکەوتکرا',
    uploadPhoto: 'بارکردنی وێنەی نوێ',
    fullName: 'ناوی تەواو',
    location: 'شوێن',
    email: 'پۆستی ئەلیکترۆنی',
    phone: 'ژمارەی تەلەفۆن',
    bio: 'کۆمێنت / Bio',
    saveChanges: 'پاشەکەوتکردنی گۆڕانکارییەکان',
    currentPassword: 'وشەی نهێنی ئێستا',
    newPassword: 'وشەی نهێنی نوێ',
    updatePassword: 'نوێکردنەوەی وشەی نهێنی',
    emailNotif: 'ئاگادارییەکانی پۆستی ئەلیکترۆنی',
    emailNotifDesc: 'ئیمەیڵ وەرگرە دەربارەی چالاکی و کڕینی بلیتەکانت.',
    publicProfile: 'پڕۆفایلی گشتی',
    publicProfileDesc: 'ڕێگە بدە بە بەکارهێنەرانی تر پڕۆفایلەکەت بدۆزنەوە.',
    languageLabel: 'زمان',
  },
};

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('account');
  const [savedMessage, setSavedMessage] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Sidra Jalal',
    location: 'Duhok, Iraq',
    email: 'sidra@example.com',
    phone: '075079800456',
    bio: 'Always looking for new experience in live music and events.',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
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

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-6 transition-colors duration-200"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white">{t.settingsTitle}</h1>
          <p className="text-xs text-slate-600 dark:text-purple-300/60 mt-1">{t.settingsDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* قائمة الخيارات الجانبية (مع تعديل التباين لتصبح النصوص واضحة تماماً) */}
        <div className="lg:col-span-4 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full text-start p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                  isActive && !item.path
                    ? 'bg-purple-600 dark:bg-purple-600 text-white border-purple-500 shadow-lg dark:shadow-xl dark:shadow-purple-900/40'
                    : 'bg-white dark:bg-[#150a21] border-slate-200 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border transition ${
                    isActive && !item.path
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-purple-100 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-600/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isActive && !item.path ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {item.label}
                    </h3>
                    <p className={`text-[11px] ${isActive && !item.path ? 'text-purple-100' : 'text-slate-600 dark:text-purple-300/60'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* لوحة المحتوى الرئيسي */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl dark:shadow-2xl relative overflow-hidden">
            
            {activeTab === 'account' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-purple-900/40 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.profileInfo}</h2>
                    <p className="text-xs text-slate-600 dark:text-purple-300/60">{t.profileDesc}</p>
                  </div>
                  {savedMessage && (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-500/30 shadow-md">
                      <CheckCircle2 className="w-4 h-4" /> {t.savedSuccessfully}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-5 bg-slate-50 dark:bg-[#0b0712]/60 p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-300 dark:border-purple-500/40 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-md inline-flex items-center gap-2">
                      <Camera className="w-4 h-4" /> {t.uploadPhoto}
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.fullName}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.location}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.phone}
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.bio}
                  </label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none transition"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-purple-900/40">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl text-sm transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-purple-900/40 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.security}</h2>
                  <p className="text-xs text-slate-600 dark:text-purple-300/60">{t.securityDesc}</p>
                </div>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold">{t.currentPassword}</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold">{t.newPassword}</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500" />
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition cursor-pointer shadow-lg shadow-purple-600/20 dark:shadow-purple-900/30">
                    {t.updatePassword}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-purple-900/40 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.privacy}</h2>
                  <p className="text-xs text-slate-600 dark:text-purple-300/60">{t.privacyDesc}</p>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/40 rounded-2xl cursor-pointer">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.publicProfile}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-purple-300/60">{t.publicProfileDesc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-purple-600 rounded cursor-pointer" />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-purple-900/40 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.payment}</h2>
                  <p className="text-xs text-slate-600 dark:text-purple-300/60">{t.paymentDesc}</p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 rounded-xl text-purple-600 dark:text-purple-400">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">MasterCard ending in •••• 4592</p>
                      <p className="text-[11px] text-slate-600 dark:text-purple-300/60">Expires 08/28</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-purple-900/40 pb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.preferences}</h2>
                  <p className="text-xs text-slate-600 dark:text-purple-300/60">{t.preferencesDesc}</p>
                </div>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs text-slate-700 dark:text-purple-300/80 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {t.languageLabel}
                    </label>
                    <select 
                      value={currentLangKey}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="English">English</option>
                      <option value="العربية (Arabic)">العربية (Arabic)</option>
                      <option value="Kurdish (کوردی)">Kurdish (کوردی)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}