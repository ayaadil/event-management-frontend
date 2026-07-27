// src/pages/Saved.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkX, ArrowRight, Trash2, Calendar, MapPin, Ticket, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

export default function Saved() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const uiTexts = {
    ar: {
      title: 'الفعاليات المحفوظة', subtitle: 'فعالياتك وأنشطتك المفضلة في مكان واحد',
      savedItems: 'عنصر محفوظ', details: 'التفاصيل', get: 'حجز',
      noSavedTitle: 'لا توجد فعاليات محفوظة',
      noSavedDesc: 'لم تقم بحفظ أي فعاليات حتى الآن. استكشف الفعاليات القادمة واضغط على أيقونة القلب لحفظها هنا.',
      explore: 'استكشاف الفعاليات', loading: 'جارٍ التحميل...',
    },
    ku: {
      title: 'چالاکییە پاشەکەوتکراوەکان', subtitle: 'چالاکی و چالاکییە دڵخوازەکانت لە یەک شوێنندا',
      savedItems: 'بڕگەی پاشەکەوتکراو', details: 'وردەکاری', get: 'گرتن',
      noSavedTitle: 'هیچ چالاکییەکی پاشەکەوتکراو نییە',
      noSavedDesc: 'هێشتا هیچ چالاکییەکت پاشەکەوت نەکردووە. بەدوای چالاکییەکاندا بگەرێ و کلیک لە نیشانەی دڵ بکە بۆ پاشەکەوتکردنیان.',
      explore: 'گەڕان بەدوای چالاکییەکاندا', loading: 'چاوەڕوانبە...',
    },
    en: {
      title: 'Saved Events', subtitle: 'Your bookmarked events and activities in one place',
      savedItems: 'Saved Items', details: 'Details', get: 'Get',
      noSavedTitle: 'No Saved Events Found',
      noSavedDesc: "You haven't saved any events yet. Explore upcoming events and tap the heart icon to save them here.",
      explore: 'Explore Events', loading: 'Loading...',
    }
  };
  const t = uiTexts[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  const loadSaved = useCallback(() => {
    setLoading(true);
    api.getMySavedEvents()
      .then(setSavedEvents)
      .catch(() => setSavedEvents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const handleRemove = async (id) => {
    setSavedEvents((prev) => prev.filter((e) => e.id !== id));
    try {
      await api.unsaveEvent(id);
    } catch (err) {
      console.error('Failed to remove saved event', err);
      loadSaved();
    }
  };

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
      {/* Header Section with Animated Red Heart Icon */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1, 1.2, 1],
              rotate: [0, 10, -10, 10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut" 
            }}
            className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center justify-center shadow-sm"
          >
            <Heart className="w-6 h-6 text-red-600 dark:text-red-500 fill-current" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {t.title}
            </h1>
            <motion.p 
              variants={itemVariants}
              className="text-purple-600 dark:text-purple-300 text-sm md:text-base font-medium mt-1 block w-full"
            >
              {t.subtitle}
            </motion.p>
          </div>
        </div>
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-xs bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-300 px-3.5 py-1.5 rounded-full w-fit font-medium shadow-sm"
        >
          {savedEvents.length} {t.savedItems}
        </motion.span>
      </motion.div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-16 text-slate-500 dark:text-purple-300/60 text-sm font-medium animate-pulse"
        >
          {t.loading}
        </motion.div>
      ) : savedEvents.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {savedEvents.map((event) => (
              <motion.div
                variants={itemVariants}
                exit="exit"
                layout
                key={event.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl overflow-hidden shadow-sm hover:border-purple-400 dark:hover:border-purple-500/50 flex flex-col justify-between group"
              >
                <div className="relative h-44 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    src={event.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(event.id)}
                    title="Remove from Saved"
                    className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} bg-red-50 dark:bg-red-950/80 hover:bg-red-600 text-red-600 dark:text-red-300 hover:text-white p-2 rounded-2xl border border-red-200 dark:border-red-900/50 transition cursor-pointer shadow-sm`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {event.title}
                    </h3>
                    <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-purple-300/70">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> {formatDate(event.date_time)}
                      </p>
                      <p className="flex items-center gap-2 text-slate-500 dark:text-purple-300/50">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="line-clamp-1">{event.location || '—'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#2a1745] flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{event.category_name || ''}</span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 text-purple-600 dark:text-purple-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-2xl border border-purple-200 dark:border-purple-800/40 transition flex items-center gap-1 cursor-pointer"
                      >
                        {t.details} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-3 rounded-2xl transition flex items-center gap-1 cursor-pointer shadow-sm shadow-purple-600/20 dark:shadow-purple-950/40"
                      >
                        <Ticket className="w-3.5 h-3.5" /> {t.get}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl p-10 text-center max-w-md mx-auto space-y-4 my-12 shadow-sm"
        >
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/30 rounded-2xl w-fit mx-auto text-purple-600 dark:text-purple-400 shadow-sm"
          >
            <BookmarkX className="w-8 h-8" />
          </motion.div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">{t.noSavedTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">{t.noSavedDesc}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/explore')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-6 py-2.5 rounded-2xl transition shadow-sm shadow-purple-600/20 dark:shadow-purple-950/40 cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            {t.explore} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}