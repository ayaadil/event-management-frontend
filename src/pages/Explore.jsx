// src/pages/Explore.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Laptop, Briefcase, Music, Palette, Megaphone, Gamepad2, MoreHorizontal,
  Calendar, MapPin, Heart, Search, SlidersHorizontal, GraduationCap, Users, Shirt, Theater, Trophy, X, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

const CATEGORY_ICONS = {
  'art & culture': Theater,
  'business': Briefcase,
  'design': Palette,
  'education': GraduationCap,
  'family & kids': Users,
  'fashion': Shirt,
  'gaming': Gamepad2,
  'technology': Laptop,
  'music': Music,
  'marketing': Megaphone,
  'sports & fitness': Trophy,
};
const iconForCategory = (name = '') => CATEGORY_ICONS[name.toLowerCase()] || MoreHorizontal;

const CATEGORY_TRANSLATIONS = {
  'art & culture': { ar: 'فن وثقافة', ku: 'هونەر و کەلتوور', en: 'Art & Culture' },
  'business': { ar: 'أعمال', ku: 'بازرگانی', en: 'Business' },
  'design': { ar: 'تصميم', ku: 'دیزاین', en: 'Design' },
  'education': { ar: 'تعليم', ku: 'پەروەردە', en: 'Education' },
  'family & kids': { ar: 'العائلة والأطفال', ku: 'خێزان و منداڵان', en: 'Family & Kids' },
  'fashion': { ar: 'موضة', ku: 'مۆدا', en: 'Fashion' },
  'gaming': { ar: 'ألعاب', ku: 'یاری', en: 'Gaming' },
  'technology': { ar: 'تكنولوجيا', ku: 'تەکنەلۆژیا', en: 'Technology' },
  'music': { ar: 'موسيقى', ku: 'مۆسیقا', en: 'Music' },
  'marketing': { ar: 'تسويق', ku: 'بازاڕگەری', en: 'Marketing' },
  'sports & fitness': { ar: 'رياضة ولياقة', ku: 'وەرزش و ئامادەیی لەشی', en: 'Sports & Fitness' },
};

export default function ExploreEventsPage() {
  const contextLang = useLanguage();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const getCurrentLang = () => {
    const langVal = contextLang?.language || 'en';
    const langStr = String(langVal).toLowerCase();
    if (langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish')) return 'ku';
    if (langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic')) return 'ar';
    return 'en';
  };

  const currentLang = getCurrentLang();
  const isRtl = currentLang === 'ar' || currentLang === 'ku';

  const localize = (obj, base) => {
    if (!obj) return '';
    const dbKey = `${base}_${currentLang}`;
    if (obj[dbKey]) return obj[dbKey];

    const fallbackName = obj[base];
    if (fallbackName && CATEGORY_TRANSLATIONS[fallbackName.toLowerCase()]) {
      return CATEGORY_TRANSLATIONS[fallbackName.toLowerCase()][currentLang];
    }
    return fallbackName || '';
  };

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const uiTexts = {
    ar: {
      title: 'استكشاف الفعاليات',
      subtitle: 'تصفح الفعاليات حسب مواضيعك المفضلة والوقت',
      search: 'ابحث عن فعالية...',
      allEvents: 'جميع الفعاليات',
      found: 'فعالية متاحة',
      getTicket: 'احصل على التذكرة',
      noEvents: 'لا توجد فعاليات مطابقة في هذا التصنيف أو الوقت.',
      loading: 'جاري تحميل الفعاليات...',
      allCat: 'الكل',
      category: 'التصنيف',
      filterAll: 'الكل',
      filterUpcoming: 'القادمة',
      filterPast: 'السابقة',
      loadMore: 'تحميل المزيد',
      loadingMore: 'جارٍ التحميل...',
    },
    ku: {
      title: 'گەڕان بەدوای چالاکییەکاندا',
      subtitle: 'چالاکییەکان بەپێی بابەتە دڵخوازەکانت و کات ببینە',
      search: 'گەڕان بەدوای چالاکی...',
      allEvents: 'هەموو چالاکییەکان',
      found: 'چالاکی بەردەستە',
      getTicket: 'پەڕە دەستخستن',
      noEvents: 'هیچ چالاکییەک لەم پۆلەدا نەدۆزراوەتەوە.',
      loading: 'چاوەڕوانبە...',
      allCat: 'هەموو',
      category: 'پۆل',
      filterAll: 'هەموو',
      filterUpcoming: 'داتوو',
      filterPast: 'ڕابردوو',
      loadMore: 'زیاتر باربکە',
      loadingMore: 'باردەکرێت...',
    },
    en: {
      title: 'Explore Events',
      subtitle: 'Browse events by your favorite topics and time',
      search: 'Search events...',
      allEvents: 'All Events',
      found: 'events found',
      getTicket: 'Get Ticket',
      noEvents: 'No events found matching this filter.',
      loading: 'Loading events...',
      allCat: 'All',
      category: 'Category',
      filterAll: 'All',
      filterUpcoming: 'Upcoming',
      filterPast: 'Past',
      loadMore: 'Load More',
      loadingMore: 'Loading...',
    }
  };
  const t = uiTexts[currentLang] || uiTexts.en;

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
    api.getMySavedEvents()
      .then((saved) => setSavedIds(new Set(saved.map((e) => e.id))))
      .catch(() => setSavedIds(new Set()));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getEvents({ limit: 20, page: 1 })
      .then((data) => {
        const fetched = data.events || data.rows || data || [];
        setAllEvents(Array.isArray(fetched) ? fetched : []);
        setPage(data.page || 1);
        setTotalPages(data.pages || 1);
      })
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const loadMoreEvents = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    api.getEvents({ limit: 20, page: nextPage })
      .then((data) => {
        const fetched = data.events || data.rows || data || [];
        setAllEvents((prev) => [...prev, ...(Array.isArray(fetched) ? fetched : [])]);
        setPage(data.page || nextPage);
        setTotalPages(data.pages || totalPages);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    let result = [...allEvents];
    const now = new Date();

    result = result.filter(evt => {
      const status = (evt.status || '').toLowerCase();
      return status !== 'cancelled' && status !== 'canceled' && status !== 'draft' && status !== 'completed';
    });

    if (timeFilter === 'upcoming') {
      result = result.filter(evt => {
        const evtDate = new Date(evt.date_time || evt.dateTime || evt.date || 0);
        return evtDate >= now;
      });
    } else if (timeFilter === 'past') {
      result = result.filter(evt => {
        const evtDate = new Date(evt.date_time || evt.dateTime || evt.date || 0);
        return evtDate < now;
      });
    }

    if (selectedCategory !== 'all') {
      result = result.filter(evt => String(evt.category_id || evt.categoryId) === String(selectedCategory));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(evt => 
        (evt.title && evt.title.toLowerCase().includes(q)) ||
        (evt.location && evt.location.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date_time || a.dateTime || a.date || 0);
      const dateB = new Date(b.date_time || b.dateTime || b.date || 0);
      return timeFilter === 'past'
        ? dateB - dateA   
        : dateA - dateB;  
    });

    setFilteredEvents(result);
  }, [allEvents, selectedCategory, searchQuery, timeFilter]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const selectedCategoryObj = categories.find((c) => String(c.id) === String(selectedCategory));
  const activeCategoryName =
    selectedCategory === 'all'
      ? t.allEvents
      : `${localize(selectedCategoryObj, 'name')} - ${t.allEvents}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-12 font-sans transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* سهم الرجوع فقط */}
        <div>
          <motion.button
            whileHover={{ scale: 1.05, x: isRtl ? 4 : -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-950 rounded-2xl text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition shadow-sm cursor-pointer w-fit"
            title="Back"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white"
            >
              {t.title}
            </motion.h1>
            <p className="text-purple-600/80 dark:text-purple-300/80 text-xs md:text-sm">{t.subtitle}</p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-950 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${timeFilter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-purple-300/70 hover:text-purple-600'}`}
              >
                {t.filterAll}
              </button>
              <button
                onClick={() => setTimeFilter('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${timeFilter === 'upcoming' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-purple-300/70 hover:text-purple-600'}`}
              >
                {t.filterUpcoming}
              </button>
              <button
                onClick={() => setTimeFilter('past')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${timeFilter === 'past' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 dark:text-purple-300/70 hover:text-purple-600'}`}
              >
                {t.filterPast}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="p-3 bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-950 rounded-2xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition shadow-sm cursor-pointer shrink-0"
              title="Search"
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full overflow-hidden"
            >
              <Search className={`w-4 h-4 absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400`} />
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white dark:bg-[#150a21] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 rounded-2xl border border-slate-200 dark:border-purple-950 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 shadow-sm transition-all duration-300`}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('left')}
              className="p-2.5 bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-950 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition shadow-sm cursor-pointer shrink-0"
              title="Scroll Left"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </motion.button>

            <div
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto pb-1 pt-1 w-full no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory('all');
                  navigate('/categories');
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 shadow-sm ${
                  String(selectedCategory) === 'all'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40 scale-105'
                    : 'bg-white dark:bg-[#150a21] border-slate-200 dark:border-purple-950 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1f0d33] hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <SlidersHorizontal className={`w-4 h-4 ${String(selectedCategory) === 'all' ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
                <span>{t.allCat}</span>
              </motion.button>

              {categories.map((cat) => {
                const localizedName = localize(cat, 'name');
                const Icon = iconForCategory(cat.name);
                const isActive = String(selectedCategory) === String(cat.id);
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigate(`/categories?category=${cat.id}`);
                    }}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 shadow-sm ${
                      isActive
                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40 scale-105'
                        : 'bg-white dark:bg-[#150a21] border-slate-200 dark:border-purple-950 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1f0d33] hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
                    <span>{localizedName}</span>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll('right')}
              className="p-2.5 bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-950 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition shadow-sm cursor-pointer shrink-0"
              title="Scroll Right"
            >
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </motion.button>

          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {activeCategoryName}
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50">
              {filteredEvents.length} {t.found}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-24 text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">{t.loading}</div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => {
                  const isSaved = savedIds.has(evt.id);
                  const evtTitle = evt.title;
                  const evtLocation = evt.location;
                  const evtCategoryName = localize(
                    {
                      name: evt.category_name,
                      name_ar: evt.category_name_ar,
                      name_ku: evt.category_name_ku,
                      name_en: evt.category_name_en,
                    },
                    'name'
                  );

                  return (
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                      key={evt.id}
                      onClick={() => navigate(`/events/${evt.id}`)}
                      className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl overflow-hidden transition-all duration-300 shadow-sm cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <img
                          src={evt.image_url || evt.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'}
                          alt={evtTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13091f] via-transparent to-black/20" />
                        
                        {evtCategoryName && (
                          <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-purple-200`}>
                            {evtCategoryName}
                          </span>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSave(e, evt.id)}
                          className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 rounded-xl backdrop-blur-md border transition duration-300 cursor-pointer shadow-md ${
                            isSaved
                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                              : 'bg-black/40 border-white/10 text-white hover:text-rose-400 hover:border-rose-500/30'
                          }`}
                        >
                          <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
                        </motion.button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-purple-300/60">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span>{formatDate(evt.date_time || evt.dateTime || evt.date)}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-400 transition line-clamp-1">
                            {evtTitle}
                          </h3>
                          <div className="space-y-1 text-xs text-slate-500 dark:text-purple-300/70">
                            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" /><span className="line-clamp-1">{evtLocation || '—'}</span></p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-purple-900/20">
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-purple-300/50 block">{t.category}</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{evtCategoryName || '—'}</span>
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

              {page < totalPages && (
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={loadMoreEvents}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-semibold rounded-2xl transition shadow-lg shadow-purple-900/20 cursor-pointer"
                  >
                    {loadingMore ? t.loadingMore : t.loadMore}
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-[#13091f] rounded-3xl border border-slate-200 dark:border-[#2a1745]"
            >
              {t.noEvents}
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}