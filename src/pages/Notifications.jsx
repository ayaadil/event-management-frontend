import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Calendar, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'ticket',
      path: '/tickets',
      title: {
        ar: 'تم تأكيد حجز تذكرتك بنجاح!',
        ku: 'پەتاسەکەت بە سەرکەوتوویی پاشەکەوت کردا!',
        en: 'Ticket booking confirmed successfully!'
      },
      desc: {
        ar: 'تم إصدار تذكرتك لمهرجان الموسيقى القادم. يمكنك عرضها في قسم التذاكر.',
        ku: 'پەتاسەی فێستیڤالی مۆسیقای داهاتوو دەرچوو. دەتوانیت لە بەشی پەتاسەکان بیبینیت.',
        en: 'Your ticket for the upcoming music festival has been issued. Check your tickets section.'
      },
      time: { ar: 'منذ 10 دقائق', ku: 'پێش ١٠ خولەک', en: '10 mins ago' },
      read: false
    },
    {
      id: 2,
      type: 'event',
      path: '/explore',
      title: {
        ar: 'فعالية جديدة أُضيفت في مدينتك ✨',
        ku: 'چالاکییەکی نوێ لە شارەکەت زیادکرا ✨',
        en: 'New event added in your city ✨'
      },
      desc: {
        ar: 'تم إضافة مؤتمر تكنولوجيا جديد في دهوك، تحقق منه الآن ولا تفوت الفرصة.',
        ku: 'کۆنگرەیەکی نوێی تەکنەلۆژیا لە دهۆک زیادکرا، ئێستا سەردانی بکە.',
        en: 'A new tech conference was added in Duhok. Check it out now.'
      },
      time: { ar: 'منذ ساعتين', ku: 'پێش دوو کاتژمێر', en: '2 hours ago' },
      read: false
    },
    {
      id: 3,
      type: 'reminder',
      path: '/home',
      title: {
        ar: 'تذكير: موعد الفعالية اقترب!',
        ku: 'بیرخستنەوە: کاتی چالاکییەکە نزیکبووەوە!',
        en: 'Reminder: Event is coming up!'
      },
      desc: {
        ar: 'فعالية "Tech Night 2026" ستتبدأ غداً في تمام الساعة الثامنة مساءً.',
        ku: 'چالاکی "Tech Night 2026" سبەی دەستپێدەکات.',
        en: 'Tech Night 2026 starts tomorrow at 8:00 PM.'
      },
      time: { ar: 'أمس', ku: 'دوێنێ', en: 'Yesterday' },
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
    if (item.path) {
      navigate(item.path);
    }
  };

  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (isArabic) return obj.ar || obj.en;
    if (isKurdish) return obj.ku || obj.en;
    return obj.en || obj.ar;
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ticket': return <Ticket className="w-5 h-5 text-purple-500 dark:text-purple-400" />;
      case 'event': return <Calendar className="w-5 h-5 text-fuchsia-500 dark:text-fuchsia-400" />;
      default: return <Bell className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
    }
  };

  const uiTexts = {
    ar: {
      title: 'الإشعارات',
      subtitle: 'تابع آخر التحديثات والتنبيهات الخاصة بفعالياتك',
      markAll: 'تحديد الكل كمقروء',
      noNotifs: 'لا توجد إشعارات جديدة حالياً'
    },
    ku: {
      title: 'ئاگادارییەکان',
      subtitle: 'دوای نوێترین چالاکی و ئاگادارییەکان بکەوە',
      markAll: 'هەموویان بخوێنراوە بن',
      noNotifs: 'هیچ ئاگادارییەکی نوێ نییە'
    },
    en: {
      title: 'Notifications',
      subtitle: 'Keep track of your latest updates and event alerts',
      markAll: 'Mark all as read',
      noNotifs: 'No new notifications right now'
    }
  };

  const t = uiTexts[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full min-h-full text-slate-800 dark:text-white p-4 md:p-8 font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-100 via-purple-50 to-white dark:from-[#1e0c30] dark:via-[#2a1240] dark:to-[#170a2c] rounded-3xl p-6 md:p-8 border border-purple-200 dark:border-purple-900/40 shadow-lg dark:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-800/50 rounded-2xl text-purple-600 dark:text-purple-400 shadow-inner">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-slate-900 dark:text-white">{t.title}</h1>
              <p className="text-purple-600/70 dark:text-purple-300/70 text-xs md:text-sm mt-1">{t.subtitle}</p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 bg-purple-200 dark:bg-purple-600/30 hover:bg-purple-300 dark:hover:bg-purple-600/50 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{t.markAll}</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-3xl p-12 text-center space-y-3 shadow-sm dark:shadow-none">
              <Bell className="w-12 h-12 text-purple-300 dark:text-purple-500/30 mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.noNotifs}</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`bg-white dark:bg-[#150a21] border rounded-2xl p-5 flex items-start justify-between gap-4 transition hover:border-purple-400 dark:hover:border-purple-500/80 hover:bg-purple-50 dark:hover:bg-purple-950/20 cursor-pointer shadow-sm dark:shadow-none ${
                  item.read 
                    ? 'border-slate-200 dark:border-purple-900/20 opacity-80' 
                    : 'border-purple-300 dark:border-purple-500/40 shadow-md dark:shadow-lg dark:shadow-purple-950/40 bg-gradient-to-r from-purple-50 to-white dark:from-[#170a25] dark:to-[#12071c]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/40 rounded-xl mt-0.5 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getLocalized(item.title)}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed">{getLocalized(item.desc)}</p>
                    <span className="text-[11px] text-purple-500 dark:text-purple-400/70 block pt-1">{getLocalized(item.time)}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => deleteNotification(item.id, e)}
                  className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}