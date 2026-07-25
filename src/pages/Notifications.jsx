// src/pages/NotificationsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      case 'ticket': return <Ticket className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
      case 'event': return <Calendar className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
      default: return <Bell className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-4xl mx-auto px-4 py-8 overflow-hidden font-sans"
    >
      {/* Header Section matching About/Settings/Saved style */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
            <Bell className="w-8 h-8 text-purple-600 dark:text-[#F0ABFC]" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {t.title}
            </h1>
          </div>
        </div>

        {notifications.length > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 bg-purple-100 dark:bg-[#DD3E93]/15 hover:bg-purple-200 dark:hover:bg-[#DD3E93]/25 border border-purple-200 dark:border-white/10 text-purple-700 dark:text-[#F0ABFC] px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm w-fit"
          >
            <CheckCheck className="w-4 h-4 text-purple-600 dark:text-[#F0ABFC]" />
            <span>{t.markAll}</span>
          </motion.button>
        )}
      </motion.div>

      <motion.p 
        variants={itemVariants}
        className="text-slate-600 dark:text-[#B6A6D6] text-sm md:text-base leading-relaxed mb-6 -mt-4"
      >
        {t.subtitle}
      </motion.p>

      {/* Notifications List */}
      <motion.div variants={containerVariants} className="space-y-3">
        {notifications.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-10 text-center max-w-md mx-auto space-y-4 my-12 shadow-md dark:shadow-lg"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="p-4 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-xl w-fit mx-auto text-purple-600 dark:text-[#F0ABFC]"
            >
              <Bell className="w-8 h-8" />
            </motion.div>
            <p className="text-slate-600 dark:text-[#B6A6D6] text-sm font-medium">{t.noNotifs}</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((item) => (
              <motion.div
                variants={itemVariants}
                exit="exit"
                layout
                key={item.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleNotificationClick(item)}
                className={`bg-white dark:bg-[#2E1B4F] border rounded-2xl p-5 flex items-start justify-between gap-4 transition cursor-pointer group shadow-md dark:shadow-lg ${
                  item.read 
                    ? 'border-slate-200 dark:border-white/10 opacity-75' 
                    : 'border-purple-400 dark:border-purple-500/40 bg-purple-50/50 dark:bg-[#2E1B4F]/90'
                }`}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="p-3 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-xl mt-0.5 shrink-0 flex items-center justify-center"
                  >
                    {getIcon(item.type)}
                  </motion.div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#F0ABFC] transition-colors">
                        {getLocalized(item.title)}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-[#F0ABFC] animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#B6A6D6] leading-relaxed">{getLocalized(item.desc)}</p>
                    <span className="text-[11px] text-purple-600 dark:text-[#F0ABFC]/70 block pt-1">{getLocalized(item.time)}</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => deleteNotification(item.id, e)}
                  className="text-slate-400 dark:text-[#B6A6D6] hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}