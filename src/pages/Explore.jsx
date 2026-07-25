// src/pages/Explore.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Heart, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

const t = {
  ar: {
    exploreTitle: 'استكشاف الفعاليات',
    exploreSubtitle: 'اكتشف الأنشطة والورش المثيرة القريبة منك',
    searchPlaceholder: 'ابحث عن الفعاليات...',
    viewDetails: 'عرض التفاصيل',
    noResults: 'لا توجد فعاليات مطابقة',
    loading: 'جارٍ التحميل...',
  },
  ku: {
    exploreTitle: 'گەڕان بەدوای چالاکییەکاندا',
    exploreSubtitle: 'چالاکی و وۆرکشۆپە سەرنجڕاکێشەکانی نزیک خۆت بدۆزەرەوە',
    searchPlaceholder: 'گەڕان بەدوای چالاکییەکان...',
    viewDetails: 'بینینی وردەکاری',
    noResults: 'هیچ چالاکییەک نەدۆزراوەتەوە',
    loading: 'چاوەڕوانبە...',
  },
  en: {
    exploreTitle: 'Explore Events',
    exploreSubtitle: 'Discover exciting activities and workshops near you',
    searchPlaceholder: 'Search events...',
    viewDetails: 'View Details',
    noResults: 'No events found',
    loading: 'Loading...',
  }
};

export default function Explore() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());

  const loadSaved = useCallback(async () => {
    try {
      const saved = await api.getMySavedEvents();
      setSavedIds(new Set(saved.map((e) => e.id)));
    } catch {
      setSavedIds(new Set());
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .getEvents({
          search: searchTerm || undefined,
          status: 'published',
          limit: 30,
        })
        .then((data) => {
          const rawEvents = data.events || [];
          const sortedEvents = rawEvents.sort((a, b) => {
            const dateA = new Date(a.date_time);
            const dateB = new Date(b.date_time);
            return dateA - dateB;
          });
          setEvents(sortedEvents);
        })
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleSaveEvent = async (e, eventId) => {
    e.stopPropagation();
    try {
      if (savedIds.has(eventId)) {
        await api.unsaveEvent(eventId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
      } else {
        await api.saveEvent(eventId);
        setSavedIds((prev) => new Set(prev).add(eventId));
      }
    } catch (err) {
      console.error('Failed to toggle saved event', err);
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
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-4 md:p-8 font-sans space-y-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Header Banner */}
      <div className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white"
        >
          {text.exploreTitle}
        </motion.h1>
        <p className="text-sm text-purple-600/70 dark:text-purple-300/70">
          {text.exploreSubtitle}
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <div className="relative w-full md:w-96">
          <Search className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition-all duration-300`}
          />
        </div>
      </div>

      {/* Events Grid with Framer Motion */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm animate-pulse">{text.loading}</div>
      ) : events.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {events.map((event) => {
            const isSaved = savedIds.has(event.id);
            return (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl overflow-hidden shadow-sm hover:border-purple-400 dark:hover:border-purple-500/50 group flex flex-col justify-between cursor-pointer transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: "out" }}
                    src={event.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13091f] via-transparent to-black/30" />

                  {event.category_name && (
                    <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-purple-200`}>
                      {event.category_name}
                    </span>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleSaveEvent(e, event.id)}
                    className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 rounded-xl backdrop-blur-md border transition duration-300 cursor-pointer shadow-md ${
                      isSaved
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                        : 'bg-black/40 border-white/10 text-white hover:text-rose-400 hover:border-rose-500/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
                  </motion.button>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-purple-300/60">
                      <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                      <span>{formatDate(event.date_time)}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition line-clamp-1">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-purple-300/70 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                      <span className="line-clamp-1">{event.location || '—'}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-purple-900/20 flex items-center justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
                      className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 text-purple-600 dark:text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-800/40 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                    >
                      {text.viewDetails} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#13091f] rounded-3xl border border-slate-200 dark:border-[#2a1745]">
          <p className="text-slate-500 dark:text-slate-400 text-sm">{text.noResults}</p>
        </div>
      )}
    </div>
  );
}