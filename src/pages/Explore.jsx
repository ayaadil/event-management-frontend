import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Heart, Search, Filter, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const eventsList = [
  {
    id: '1',
    title: {
      ar: 'مهرجان الصيف الموسيقي 2026',
      ku: 'فێستیڤاڵی مۆسیقای هاوینی ٢٠٢٦',
      en: 'Summer Music Festival 2026',
    },
    category: {
      ar: 'موسيقى',
      ku: 'مۆسیقا',
      en: 'Music',
    },
    categoryKey: 'music',
    date: '10 Aug 2026',
    location: {
      ar: 'دهوك، بارك فاميلي سكرين',
      ku: 'دهۆک، فامیلی سکریین پارک',
      en: 'Duhok, Family Screen Park',
    },
    price: '$25',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
  },
  {
    id: '2',
    title: {
      ar: 'مؤتمر الذكاء الاصطناعي والتكنولوجيا المستقبلية',
      ku: 'کۆنگرەی ژیری دەستکرد و تەکنەلۆژیای داهاتوو',
      en: 'AI & Future Tech Conf',
    },
    category: {
      ar: 'تكنولوجيا',
      ku: 'تەکنەلۆژیا',
      en: 'Technology',
    },
    categoryKey: 'tech',
    date: '05 Sep 2026',
    location: {
      ar: 'أربيل، المعرض الدولي',
      ku: 'هەولێر، پێشانگای نێودەوڵەتی',
      en: 'Erbil International Fair',
    },
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
  {
    id: '3',
    title: {
      ar: 'معرض الفن والتصميم',
      ku: 'پێشانگای هونەر و دیزاین',
      en: 'Art & Design Expo',
    },
    category: {
      ar: 'فن',
      ku: 'هونەر',
      en: 'Art',
    },
    categoryKey: 'art',
    date: '18 Oct 2026',
    location: {
      ar: 'دهوك، المركز الثقافي',
      ku: 'دهۆک، سەنتەری ڕۆشنبیری',
      en: 'Duhok Cultural Center',
    },
    price: '$10',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
  },
];

const t = {
  ar: {
    exploreTitle: 'استكشاف الفعاليات',
    exploreSubtitle: 'اكتشف الأنشطة والورش المثيرة القريبة منك',
    searchPlaceholder: 'ابحث عن الفعاليات...',
    allCategories: 'جميع الفئات',
    music: 'موسيقى',
    tech: 'تكنولوجيا',
    art: 'فن',
    viewDetails: 'عرض التفاصيل',
  },
  ku: {
    exploreTitle: 'گەڕان بەدوای چالاکییەکاندا',
    exploreSubtitle: 'چالاکی و وۆرکشۆپە سەرنجڕاکێشەکانی نزیک خۆت بدۆزەرەوە',
    searchPlaceholder: 'گەڕان بەدوای چالاکییەکان...',
    allCategories: 'هەموو بەشەکان',
    music: 'مۆسیقا',
    tech: 'تەکنەلۆژیا',
    art: 'هونەر',
    viewDetails: 'بینینی وردەکاری',
  },
  en: {
    exploreTitle: 'Explore Events',
    exploreSubtitle: 'Discover exciting activities and workshops near you',
    searchPlaceholder: 'Search events...',
    allCategories: 'All Categories',
    music: 'Music',
    tech: 'Technology',
    art: 'Art',
    viewDetails: 'View Details',
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
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('savedEvents');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const toggleSaveEvent = (e, eventObj) => {
    e.stopPropagation();
    setSavedEvents((prev) => {
      const exists = prev.some((item) => String(item.id) === String(eventObj.id));
      let updated;
      if (exists) {
        updated = prev.filter((item) => String(item.id) !== String(eventObj.id));
      } else {
        updated = [...prev, eventObj];
      }
      localStorage.setItem('savedEvents', JSON.stringify(updated));
      return updated;
    });
  };

  const getLocalized = (obj) => {
    if (isArabic) return obj.ar;
    if (isKurdish) return obj.ku;
    return obj.en;
  };

  const filteredEvents = eventsList.filter((event) => {
    const titleText = getLocalized(event.title).toLowerCase();
    const locationText = getLocalized(event.location).toLowerCase();
    const matchesSearch = titleText.includes(searchTerm.toLowerCase()) || locationText.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.categoryKey === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryBtnClass = (active) =>
    `px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
      active
        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40'
        : 'bg-white dark:bg-[#150a21] text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-500/50'
    }`;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-4 md:p-8 font-sans space-y-8 max-w-7xl mx-auto transition-colors duration-200">
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
          {text.exploreTitle}
        </h1>
        <p className="text-sm text-purple-600/70 dark:text-purple-300/70">
          {text.exploreSubtitle}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
          <input
            type="text"
            placeholder={text.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500`}
          />
        </div>

       
        <div className="flex items-center gap-2 overflow-x-auto w-full  md:w-auto overflow-x-auto pb-2  scrollbar-none">
       
          <button
            onClick={() => setSelectedCategory('all')}
            className={categoryBtnClass(selectedCategory === 'all')}
          >
            {text.allCategories}
          </button>
          <button
            onClick={() => setSelectedCategory('music')}
            className={categoryBtnClass(selectedCategory === 'music')}
          >
            {text.music}
          </button>
          <button
            onClick={() => setSelectedCategory('tech')}
            className={categoryBtnClass(selectedCategory === 'tech')}
          >
            {text.tech}
          </button>
          <button
            onClick={() => setSelectedCategory('art')}
            className={categoryBtnClass(selectedCategory === 'art')}
          >
            {text.art}
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isSaved = savedEvents.some((item) => String(item.id) === String(event.id));
          return (
            <div
              key={event.id}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl overflow-hidden shadow-md dark:shadow-xl hover:border-purple-400 dark:hover:border-purple-500/50 transition group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={getLocalized(event.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#150a21] via-transparent to-black/30" />
                
                <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-purple-200`}>
                  {getLocalized(event.category)}
                </span>

                <button
                  onClick={(e) => toggleSaveEvent(e, event)}
                  className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 rounded-xl backdrop-blur-md border transition duration-300 cursor-pointer shadow-lg ${
                    isSaved
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-black/50 border-white/10 text-white hover:text-rose-400 hover:border-rose-500/30'
                  }`}
                  title={isSaved ? 'إزالة من المحفوظات' : 'حفظ الفعالية'}
                >
                  <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
                </button>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-purple-300/60">
                    <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                    <span>{event.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition line-clamp-1">
                    {getLocalized(event.title)}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-purple-300/70 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />
                    <span className="line-clamp-1">{getLocalized(event.location)}</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-purple-900/30 flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {event.price}
                  </span>

                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-700 dark:text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-300 dark:border-purple-500/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {text.viewDetails} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}