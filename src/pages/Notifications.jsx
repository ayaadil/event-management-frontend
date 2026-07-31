// src/pages/NotificationsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Calendar, Ticket, XCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationsContext';

const templates = {
  ar: {
    ticket: { title: 'تم تأكيد حجز تذكرتك بنجاح!', desc: 'تم تأكيد حجزك لفعالية "{event}". يمكنك عرضها من قسم التذاكر.' },
    cancelled: { title: 'تم إلغاء حجزك', desc: 'تم إلغاء حجزك لفعالية "{event}".' },
    reminder: { title: 'تذكير: فعاليتك قريبة!', desc: 'فعالية "{event}" ستبدأ خلال يومين أو أقل.' },
  },
  ku: {
    ticket: { title: 'حجزی پەتاسەکەت پشتڕاست کرا!', desc: 'حجزەکەت بۆ چالاکی "{event}" پشتڕاست کرا.' },
    cancelled: { title: 'حجزەکەت هەڵوەشایەوە', desc: 'حجزەکەت بۆ چالاکی "{event}" هەڵوەشایەوە.' },
    reminder: { title: 'بیرخستنەوە: چالاکییەکەت نزیکە!', desc: 'چالاکی "{event}" لە ماوەی دوو ڕۆژدا دەستپێدەکات.' },
  },
  en: {
    ticket: { title: 'Ticket booking confirmed!', desc: 'Your booking for "{event}" has been confirmed. Check your tickets.' },
    cancelled: { title: 'Your booking was cancelled', desc: 'Your booking for "{event}" has been cancelled.' },
    reminder: { title: 'Reminder: Your event is coming up!', desc: '"{event}" starts within the next 2 days.' },
  },
};

const uiTexts = {
  ar: { title: 'الإشعارات', subtitle: 'تابع آخر التحديثات الخاصة بحجوزاتك', markAll: 'تحديد الكل كمقروء', noNotifs: 'لا توجد إشعارات جديدة حالياً' },
  ku: { title: 'ئاگادارییەکان', subtitle: 'دوای نوێترین چالاکییەکانی حجزەکانت بکەوە', markAll: 'هەموویان بخوێنراوە بن', noNotifs: 'هیچ ئاگادارییەکی نوێ نییە' },
  en: { title: 'Notifications', subtitle: 'Keep track of updates about your bookings', markAll: 'Mark all as read', noNotifs: 'No new notifications right now' },
};

function timeAgo(iso, lang) {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  const labels = {
    ar: (n, u) => `منذ ${n} ${u}`,
    ku: (n, u) => `پێش ${n} ${u}`,
    en: (n, u) => `${n} ${u} ago`,
  };
  const units = {
    ar: { m: 'دقيقة', h: 'ساعة', d: 'يوم' },
    ku: { m: 'خولەک', h: 'کاتژمێر', d: 'ڕۆژ' },
    en: { m: 'min', h: 'hour', d: 'day' },
  };
  const f = labels[lang] || labels.en;
  const u = units[lang] || units.en;
  if (diffMin < 1) return lang === 'ar' ? 'الآن' : lang === 'ku' ? 'ئێستا' : 'Just now';
  if (diffMin < 60) return f(diffMin, u.m);
  if (diffMin < 1440) return f(Math.floor(diffMin / 60), u.h);
  return f(Math.floor(diffMin / 1440), u.d);
}

export default function NotificationsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { notifications, markAllAsRead, markAsRead, deleteNotification } = useNotifications();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;
  const lang = isArabic ? 'ar' : isKurdish ? 'ku' : 'en';

  const t = uiTexts[lang];
  const tpl = templates[lang];

  // أيكونات متحركة عند التحويم أو العرض
  const getIcon = (type) => {
    switch (type) {
      case 'ticket': 
        return <Ticket className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
      case 'cancelled': 
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'reminder': 
        return <Calendar className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
      default: 
        return <Bell className="w-5 h-5 text-purple-600 dark:text-[#F0ABFC]" />;
    }
  };

  const buildText = (n) => {
    const tmpl = tpl[n.type] || tpl.ticket;
    return {
      title: tmpl.title,
      desc: tmpl.desc.replace('{event}', n.eventTitle || ''),
    };
  };

  const handleClick = (n) => {
    markAsRead(n.id);
    if (n.path) navigate(n.path);
  };

  return (
    <motion.div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 py-8 font-sans"
    >
      {/* Header section with animations */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08, x: isRtl ? 3 : -3 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl bg-purple-100 dark:bg-[#DD3E93]/15 hover:bg-purple-200 dark:hover:bg-[#DD3E93]/25 border border-purple-200 dark:border-white/10 text-purple-700 dark:text-[#F0ABFC] transition cursor-pointer shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>
          
          {/* Bell Icon Animation */}
          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4 }}
          >
            <Bell className="w-8 h-8 text-purple-600 dark:text-[#F0ABFC]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white"
          >
            {t.title}
          </motion.h1>
        </div>

        {notifications.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 bg-purple-100 dark:bg-[#DD3E93]/15 hover:bg-purple-200 dark:hover:bg-[#DD3E93]/25 border border-purple-200 dark:border-white/10 text-purple-700 dark:text-[#F0ABFC] px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm w-fit"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t.markAll}</span>
          </motion.button>
        )}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-600 dark:text-[#B6A6D6] text-sm md:text-base leading-relaxed mb-6 -mt-4"
      >
        {t.subtitle}
      </motion.p>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-10 text-center max-w-md mx-auto space-y-4 my-12 shadow-md"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-4 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-xl w-fit mx-auto text-purple-600 dark:text-[#F0ABFC]"
            >
              <Bell className="w-8 h-8" />
            </motion.div>
            <p className="text-slate-600 dark:text-[#B6A6D6] text-sm font-medium">{t.noNotifs}</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((item, index) => {
              const { title, desc } = buildText(item);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleClick(item)}
                  className={`bg-white dark:bg-[#2E1B4F] border rounded-2xl p-5 flex items-start justify-between gap-4 transition cursor-pointer group shadow-md ${
                    item.read ? 'border-slate-200 dark:border-white/10 opacity-75' : 'border-purple-400 dark:border-purple-500/40 bg-purple-50/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* تحريك الأيقونة عند الهوفر على كارد الإشعار */}
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 bg-purple-100 dark:bg-[#DD3E93]/15 border border-purple-200 dark:border-white/10 rounded-xl mt-0.5 shrink-0"
                    >
                      {getIcon(item.type)}
                    </motion.div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
                        {!item.read && (
                          <motion.span 
                            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-purple-600 dark:bg-[#F0ABFC]" 
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#B6A6D6] leading-relaxed">{desc}</p>
                      <span className="text-[11px] text-purple-600 dark:text-[#F0ABFC]/70 block pt-1">{timeAgo(item.createdAt, lang)}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); deleteNotification(item.id); }}
                    className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}