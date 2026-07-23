import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Calendar, Heart, 
  Ticket, Edit3, ShieldCheck, LogOut, Save, X, KeyRound, CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [toastMessage, setToastMessage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userData, setUserData] = useState({
    name: 'Noor Ahmad',
    role: {
      ar: 'منسقة ومحبة للفعاليات',
      ku: 'خۆشەویست و ڕێکخەری چالاکییەکان',
      en: 'Event Enthusiast'
    },
    location: 'Duhok, Iraq',
    email: 'noorahmad@gmail.com',
    phone: '075079800456',
    bio: {
      ar: 'شغوفة بمهرجانات الموسيقى، مؤتمرات التكنولوجيا، وفعاليات التواصل. دائماً أبحث عن تجارب جديدة!',
      ku: 'حەز بە فێستیڤالی مۆسیقا، کۆنگرەکانی تەکنەلۆژیا و چالاکییەکان دەکەم. هەمیشە بەدوای ئەزموونی نوێدا دەگەڕێم!',
      en: 'Passionate about music festivals, tech conferences, and networking events. Always looking for new experiences!'
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    stats: {
      tickets: 12,
      saved: 8,
      attended: 24
    }
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSave = () => {
    setUserData({
      ...userData,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location
    });
    setIsEditing(false);
    showToast(isArabic ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast(isArabic ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!');
      return;
    }
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast(isArabic ? 'تم تغيير كلمة المرور بنجاح ✨' : 'Password changed successfully ✨');
  };

  const uiTexts = {
    ar: {
      pro: 'محترف',
      editProfile: 'تعديل الملف الشخصي',
      saveChanges: 'حفظ التعديلات',
      cancel: 'إلغاء',
      myTickets: 'تذاكري',
      savedEvents: 'الفعاليات المحفوظة',
      attended: 'تم الحضور',
      tabInfo: 'المعلومات الشخصية',
      tabSecurity: 'أمان الحساب',
      fullName: 'الاسم الكامل',
      emailAddress: 'بريد الكتروني',
      phoneNumber: 'رقم الهاتف',
      location: 'الموقع',
      changePassword: 'تغيير كلمة المرور',
      changePasswordDesc: 'قم بتحديث كلمة المرور بانتظام للحفاظ على أمان حسابك',
      update: 'تحديث',
      logOut: 'تسجيل الخروج',
      logOutDesc: 'تسجيل الخروج من هذا الجهاز',
      currentPass: 'كلمة المرور الحالية',
      newPass: 'كلمة المرور الجديدة',
      confirmPass: 'تأكيد كلمة المرور الجديدة',
      savePass: 'تحديث كلمة المرور'
    },
    ku: {
      pro: 'پڕۆفیشناڵ',
      editProfile: 'دەستکاری پڕۆفایل',
      saveChanges: 'پاشەکەوتکردن',
      cancel: 'هەڵوەشاندنەوە',
      myTickets: 'پەتاسەکانم',
      savedEvents: 'پاشەکەوتکراوەکان',
      attended: 'بەشداربوو',
      tabInfo: 'زانیاری کەسی',
      tabSecurity: 'ئاسایشی هەژمار',
      fullName: 'ناوی تەواو',
      emailAddress: 'ئیمەیڵ',
      phoneNumber: 'ژمارەی مۆبایل',
      location: 'شوێن',
      changePassword: 'گۆڕینی وشەی تێپەڕ',
      changePasswordDesc: 'وشەی تێپەڕ نوێبکەرەوە بۆ پاراستنی هەژمارەکەت',
      update: 'نوێکردنەوە',
      logOut: 'دەرچوون',
      logOutDesc: 'دەرچوون لەم ئامێرە',
      currentPass: 'وشەی تێپەڕی ئێستا',
      newPass: 'وشەی تێپەڕی نوێ',
      confirmPass: 'پشتڕاستکردنەوەی وشەی تێپەڕ',
      savePass: 'نوێکردنەوەی وشەی تێپەڕ'
    },
    en: {
      pro: 'Pro',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      myTickets: 'My Tickets',
      savedEvents: 'Saved Events',
      attended: 'Attended',
      tabInfo: 'Personal Info',
      tabSecurity: 'Account Security',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      location: 'Location',
      changePassword: 'Change Password',
      changePasswordDesc: 'Update your password regularly to keep your account safe',
      update: 'Update',
      logOut: 'Log Out',
      logOutDesc: 'Log out from this device',
      currentPass: 'Current Password',
      newPass: 'New Password',
      confirmPass: 'Confirm New Password',
      savePass: 'Update Password'
    }
  };

  const t = uiTexts[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (isArabic) return obj.ar || obj.en;
    if (isKurdish) return obj.ku || obj.en;
    return obj.en || obj.ar;
  };

  const infoInputClass = "w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-300 dark:border-purple-700/50 rounded-lg px-2.5 py-1 text-sm text-slate-800 dark:text-white mt-1 focus:outline-none focus:border-purple-400";

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full min-h-full text-slate-800 dark:text-white p-4 md:p-8 font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-900 to-indigo-950 border border-purple-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-100 via-purple-50 to-white dark:from-[#1e0c30] dark:via-[#2a1240] dark:to-[#170a2c] rounded-3xl p-6 md:p-8 border border-purple-200 dark:border-purple-900/40 shadow-lg dark:shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            <div className={`flex flex-col md:flex-row items-center gap-6 text-center ${isRtl ? 'md:text-right' : 'md:text-left'}`}>
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-purple-800 shadow-xl">
                <img 
                  src={userData.avatar} 
                  alt={userData.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-slate-900 dark:text-white">{userData.name}</h1>
                  <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                    {t.pro}
                  </span>
                </div>
                <p className="text-purple-600/80 dark:text-purple-300/80 text-xs md:text-sm">{getLocalized(userData.role)}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center md:justify-start gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" /> {userData.location}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto z-20">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> {t.saveChanges}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> {t.cancel}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {t.editProfile}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-purple-200 dark:border-purple-900/40 text-xs md:text-sm text-slate-600 dark:text-purple-100/70 max-w-2xl leading-relaxed">
            {getLocalized(userData.bio)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div 
            onClick={() => navigate('/tickets')}
            className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-sm dark:shadow-none"
          >
            <Ticket className="w-5 h-5 text-purple-500 dark:text-purple-400 mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{userData.stats.tickets}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.myTickets}</span>
          </div>

          <div 
            onClick={() => navigate('/saved')}
            className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-sm dark:shadow-none"
          >
            <Heart className="w-5 h-5 text-fuchsia-500 dark:text-fuchsia-400 mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{userData.stats.saved}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.savedEvents}</span>
          </div>

          <div 
            onClick={() => navigate('/tickets')}
            className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer shadow-sm dark:shadow-none"
          >
            <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400 mx-auto mb-1.5" />
            <span className="block text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{userData.stats.attended}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{t.attended}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-purple-900/40 gap-6 text-sm font-medium z-20 relative">
          <button 
            type="button"
            onClick={() => setActiveTab('info')}
            className={`pb-3 transition relative cursor-pointer ${activeTab === 'info' ? 'text-purple-600 dark:text-purple-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            {t.tabInfo}
            {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full" />}
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 transition relative cursor-pointer ${activeTab === 'security' ? 'text-purple-600 dark:text-purple-300 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            {t.tabSecurity}
            {activeTab === 'security' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full" />}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 rounded-xl text-purple-600 dark:text-purple-400">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-purple-600/60 dark:text-purple-300/60 block font-medium">{t.fullName}</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={infoInputClass}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{userData.name}</span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 rounded-xl text-purple-600 dark:text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-purple-600/60 dark:text-purple-300/60 block font-medium">{t.emailAddress}</span>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={infoInputClass}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{userData.email}</span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 rounded-xl text-purple-600 dark:text-purple-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-purple-600/60 dark:text-purple-300/60 block font-medium">{t.phoneNumber}</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={infoInputClass}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{userData.phone}</span>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center gap-4 shadow-sm dark:shadow-none">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 rounded-xl text-purple-600 dark:text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-purple-600/60 dark:text-purple-300/60 block font-medium">{t.location}</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={infoInputClass}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{userData.location}</span>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div 
              onClick={() => setShowPasswordModal(true)}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1c0d2b] transition cursor-pointer shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.changePassword}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.changePasswordDesc}</p>
                </div>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 hover:underline">{t.update}</span>
            </div>

            <div 
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#1c0d2b] transition cursor-pointer shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-300">{t.logOut}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.logOutDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Change Password Modal - stays dark themed (overlay style) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-[#1c0d2b] to-[#11061c] border border-purple-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-950 border border-purple-800/50 rounded-xl text-purple-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{t.changePassword}</h3>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-purple-300/80 block mb-1.5 font-medium">{t.currentPass}</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-[#0b0712] border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300/80 block mb-1.5 font-medium">{t.newPass}</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-[#0b0712] border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-purple-300/80 block mb-1.5 font-medium">{t.confirmPass}</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-[#0b0712] border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-900/40">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 transition cursor-pointer"
                >
                  {t.savePass}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}