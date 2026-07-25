// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Bell, Calendar, MapPin,
  Laptop, Briefcase, Music, Palette, Megaphone, Gamepad2,
  GraduationCap, Users, Heart, Sparkles, Theater, Baby, Shirt, MoreHorizontal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatDate, formatDateBadge } from '../utils/format';

const CATEGORY_ICONS = {
  technology: Laptop,
  business: Briefcase,
  music: Music,
  design: Palette,
  marketing: Megaphone,
  gaming: Gamepad2,
  'art & culture': Theater,
  education: GraduationCap,
  'family & kids': Baby,
  fashion: Shirt,
};

const iconForCategory = (name = '') => {
  const formattedName = name.toLowerCase().trim();
  return CATEGORY_ICONS[formattedName] || MoreHorizontal;
};

// دالة لتوليد لون تدرجي خاص بالأيقونة فقط لكل فئة
const getCategoryIconColor = (categoryName = '') => {
  const name = categoryName.toLowerCase().trim();
  switch (name) {
    case 'technology':
      return 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)';
    case 'business':
      return 'linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)';
    case 'music':
      return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    case 'design':
      return 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)';
    case 'art & culture':
    case 'art':
      return 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)';
    case 'gaming':
      return 'linear-gradient(135deg, #EB3349 0%, #F45C43 100%)';
    case 'fashion':
      return 'linear-gradient(135deg, #7F7FD5 0%, #86A8E7 100%)';
    case 'education':
      return 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)';
    case 'marketing':
      return 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)';
    case 'family & kids':
      return 'linear-gradient(135deg, #45b649 0%, #dce35b 100%)';
    default:
      return 'linear-gradient(135deg, #6b11ff 0%, #ef38d6 100%)';
  }
};

export default function Home() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  const t = isKurdish ? {
    greeting: `سڵاو، ${user?.name || ''} 👋`,
    subtitle: 'بۆنە سەرنجڕاکێشەکان کە لە دەوروبەرت ڕوودەدەن بدۆزەرەوە.',
    searchPlaceholder: 'گەڕان بەدوای بۆنەکان...',
    featuredBadge: 'تایبەت', getTicket: 'بلیت وەرگرە',
    categoriesTitle: 'پۆلەکان', seeAll: 'بینینی هەمووی',
    upcomingTitle: 'بۆنە داهاتووەکان', viewAll: 'بینینی هەمووی',
    noResults: 'هیچ بۆنەیەک نەدۆزراوەتەوە', loading: 'چاوەڕوانبە...',
  } : isArabic ? {
    greeting: `أهلاً، ${user?.name || ''} 👋`,
    subtitle: 'اكتشف فعاليات مذهلة تجري حولك.',
    searchPlaceholder: 'ابحث عن فعاليات...',
    featuredBadge: 'مميز', getTicket: 'احصل على التذكرة',
    categoriesTitle: 'التصنيفات', seeAll: 'عرض الكل',
    upcomingTitle: 'الفعاليات القادمة', viewAll: 'عرض الكل',
    noResults: 'لا توجد فعاليات مطابقة للبحث', loading: 'جارٍ التحميل...',
  } : {
    greeting: `Hello, ${user?.name || ''} 👋`,
    subtitle: 'Discover amazing events happening around you.',
    searchPlaceholder: 'Search events...',
    featuredBadge: 'Featured', getTicket: 'Get Ticket',
    categoriesTitle: 'Categories', seeAll: 'See all',
    upcomingTitle: 'Upcoming Events', viewAll: 'View All',
    noResults: 'No events found', loading: 'Loading...',
  };

  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    try {
      const saved = await api.getMySavedEvents();
      setSavedIds(new Set(saved.map((e) => e.id)));
    } catch {
      setSavedIds(new Set());
    }
  }, []);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .getEvents({ search: searchQuery || undefined, status: 'published', limit: 6 })
        .then((data) => setEvents(data.events || []))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSave = async (e, eventId) => {
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

  const featured = events[0];
  const upcoming = events.slice(1, 4).length > 0 ? events.slice(1, 4) : events;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white font-sans transition-colors duration-200"
    >
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2"
            >
              {t.greeting}
            </motion.h1>
            <p className="text-xs text-slate-500 dark:text-purple-300/60">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-purple-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-white dark:bg-[#13091f] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-2xl border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-purple-500 transition shadow-sm`}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/settings')} 
              className="p-2.5 rounded-2xl bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/40 text-slate-500 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/notifications')} 
              className="p-2.5 rounded-2xl bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/40 text-slate-500 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white relative transition cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} w-2 h-2 bg-rose-500 rounded-full`}></span>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="w-9 h-9 rounded-2xl border border-purple-500/50 bg-purple-600 text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm"
            >
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </motion.div>
          </div>
        </header>

        {/* Featured Banner */}
        {featured && (
          <motion.section 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-[#13091f] rounded-3xl p-4 md:p-5 border border-slate-200/80 dark:border-[#2a1745] flex flex-col md:flex-row items-center gap-6 shadow-sm"
          >
            <div className="relative w-full md:w-1/2 h-56 rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate(`/events/${featured.id}`)}>
              <img
                src={featured.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'}
                alt={featured.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-white/95 backdrop-blur-md text-slate-900 rounded-xl px-2.5 py-1 text-center font-bold text-xs shadow-md`}>
                <span className="block text-sm leading-none font-extrabold">{formatDateBadge(featured.date_time).day}</span>
                <span className="text-[9px] uppercase tracking-wider">{formatDateBadge(featured.date_time).month}</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-between self-stretch">
              <div className="space-y-2.5 relative">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => toggleSave(e, featured.id)} 
                  className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl transition cursor-pointer ${savedIds.has(featured.id) ? 'text-rose-400 border-rose-500/50 bg-rose-500/20' : 'text-white hover:text-rose-400'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedIds.has(featured.id) ? 'fill-rose-500 scale-110' : ''}`} />
                </motion.button>

                <span className="inline-block px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-200 border border-purple-200 dark:border-purple-800/40 text-[10px] font-bold rounded-xl">
                  {t.featuredBadge}
                </span>
                <h2 className="text-xl md:text-2xl font-bold font-serif tracking-tight cursor-pointer hover:text-purple-500 dark:hover:text-purple-300 transition text-slate-900 dark:text-white" onClick={() => navigate(`/events/${featured.id}`)}>
                  {featured.title}
                </h2>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-purple-300/70 pt-1">
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {featured.location || '—'}</p>
                  {featured.category_name && (
                    <p className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> {featured.category_name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-purple-900/20">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/events/${featured.id}`)} 
                  className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 text-purple-600 dark:text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-800/40 transition-all duration-300 cursor-pointer"
                >
                  {t.getTicket}
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        {/* Categories Section (Unified Card Background with Unique Icon Colors) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{t.categoriesTitle}</h3>
            <button onClick={() => navigate('/categories')} className="text-xs text-purple-600 dark:text-purple-300 hover:underline font-medium cursor-pointer">{t.seeAll}</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.slice(0, 7).map((cat) => {
              const Icon = iconForCategory(cat.name);
              return (
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={cat.id} 
                  onClick={() => navigate(`/categories?category=${cat.id}`)} 
                  className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 text-center shadow-sm group"
                >
                  <div 
                    style={{ background: getCategoryIconColor(cat.name) }}
                    className="p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-white">{cat.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="pt-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{t.upcomingTitle}</h3>
            <button onClick={() => navigate('/explore')} className="text-xs text-purple-600 dark:text-purple-300 hover:underline font-medium cursor-pointer">{t.viewAll}</button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm animate-pulse">{t.loading}</div>
          ) : upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((evt) => {
                const isSaved = savedIds.has(evt.id);
                return (
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    key={evt.id} 
                    onClick={() => navigate(`/events/${evt.id}`)} 
                    className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl overflow-hidden transition-all duration-300 shadow-sm cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={evt.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80'} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13091f] via-transparent to-black/20" />
                      
                      {evt.category_name && (
                        <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-purple-200`}>
                          {evt.category_name}
                        </span>
                      )}

                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleSave(e, evt.id)} 
                        className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 rounded-xl backdrop-blur-md border transition duration-300 cursor-pointer shadow-md ${isSaved ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-black/40 border-white/10 text-white hover:text-rose-400 hover:border-rose-500/30'}`}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
                      </motion.button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-purple-300/60">
                          <Calendar className="w-3.5 h-3.5 text-purple-400" />
                          <span>{formatDate(evt.date_time)}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-400 transition line-clamp-1">
                          {evt.title}
                        </h4>
                        <div className="space-y-1 text-xs text-slate-500 dark:text-purple-300/70">
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" /><span className="line-clamp-1">{evt.location || '—'}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-purple-900/20">
                        <div>
                          <span className="text-[10px] text-slate-400 dark:text-purple-300/50 block">Category</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{evt.category_name || '—'}</span>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/events/${evt.id}`); }} 
                          className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 text-purple-600 dark:text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-800/40 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                        >
                          {t.getTicket}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-[#13091f] rounded-3xl border border-slate-200 dark:border-[#2a1745]"
            >
              {t.noResults}
            </motion.div>
          )}
        </section>

      </main>
    </motion.div>
  );
}