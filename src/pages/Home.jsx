import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Bell, Calendar, MapPin, 
  Music, Laptop, Briefcase, Palette, Megaphone, 
  Gamepad2, MoreHorizontal, Heart 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';

  const t = isKurdish ? {
    greeting: 'سڵاو، سدرە 👋',
    subtitle: 'بۆنە سەرنجڕاکێشەکان کە لە دەوروبەرت ڕوودەدەن بدۆزەرەوە.',
    searchPlaceholder: 'گەڕان بەدوای بۆنەکان...',
    featuredBadge: 'تایبەت',
    featuredTitle: 'شۆو ئاهەنگی مۆسیقای ڕاستەوخۆ ٢٠٢٦',
    featuredLocation: 'دهۆک، باخچەکانی پاکۆ بابلۆ',
    featuredMusic: 'مۆسیقا',
    goingCount: '+٢٠٠ کەس دەچن',
    getTicket: 'بلیت وەرگرە',
    categoriesTitle: 'پۆلەکان',
    seeAll: 'بینینی هەمووی',
    upcomingTitle: 'بۆنە داهاتووەکان',
    viewAll: 'بینینی هەمووی',
    fromPrice: 'لە',
    catTech: 'تکنۆلۆجیا',
    catBusiness: 'کار و بار',
    catMusic: 'مۆسیقا',
    catDesign: 'دیزاین',
    catMarketing: 'مایکرۆتینگ',
    catGaming: 'یاری',
    catMore: 'زیاتر',
    evt1Title: 'فێستیڤاڵی مۆسیقا',
    evt2Title: 'لووتکەی کار',
    evt3Title: 'کۆنگرەی تکنۆلۆجیا',
    evt1Going: '٢.٣ هەزار دەچن',
    evt2Going: '١.١ هەزار دەچن',
    evt3Going: '٣.٨ هەزار دەچن',
    loc1: 'دهۆک', loc2: 'هەولێر', loc3: 'بەغدا',
    noResults: 'هیچ بۆنەیەک نەدۆزراوەتەوە'
  } : isArabic ? {
    greeting: 'أهلاً، سدرة 👋',
    subtitle: 'اكتشف فعاليات مذهلة تجري حولك.',
    searchPlaceholder: 'ابحث عن فعاليات...',
    featuredBadge: 'مميز',
    featuredTitle: 'أمسية الموسيقى الحية 2026',
    featuredLocation: 'دهوك، حدائق باكو بابلو',
    featuredMusic: 'موسيقى',
    goingCount: '+200 شخص ذاهبون',
    getTicket: 'احصل على التذكرة',
    categoriesTitle: 'التصنيفات',
    seeAll: 'عرض الكل',
    upcomingTitle: 'الفعاليات القادمة',
    viewAll: 'عرض الكل',
    fromPrice: 'من',
    catTech: 'تكنولوجيا',
    catBusiness: 'أعمال',
    catMusic: 'موسيقى',
    catDesign: 'تصميم',
    catMarketing: 'تسويق',
    catGaming: 'ألعاب',
    catMore: 'المزيد',
    evt1Title: 'مهرجان الموسيقى',
    evt2Title: 'قمة الأعمال',
    evt3Title: 'مؤتمر التكنولوجيا',
    evt1Going: '2.3 ألف ذاهبون',
    evt2Going: '1.1 ألف ذاهبون',
    evt3Going: '3.8 ألف ذاهبون',
    loc1: 'دهوك', loc2: 'أربيل', loc3: 'بغداد',
    noResults: 'لا توجد فعاليات مطابقة للبحث'
  } : {
    greeting: 'Hello, Sidra 👋',
    subtitle: 'Discover amazing events happening around you.',
    searchPlaceholder: 'Search events...',
    featuredBadge: 'Featured',
    featuredTitle: 'Live Music Night 2026',
    featuredLocation: 'Duhok, pako pablo gardens',
    featuredMusic: 'Music',
    goingCount: '+200 going',
    getTicket: 'Get Ticket',
    categoriesTitle: 'Categories',
    seeAll: 'See all',
    upcomingTitle: 'Upcoming Events',
    viewAll: 'View All',
    fromPrice: 'From',
    catTech: 'Technology',
    catBusiness: 'Business',
    catMusic: 'Music',
    catDesign: 'Design',
    catMarketing: 'Marketing',
    catGaming: 'Gaming',
    catMore: 'More',
    evt1Title: 'Music Festival',
    evt2Title: 'Business Summit',
    evt3Title: 'Tech Conference',
    evt1Going: '2.3K Going',
    evt2Going: '1.1K Going',
    evt3Going: '3.8K Going',
    loc1: 'Duhok', loc2: 'Erbil', loc3: 'Baghdad',
    noResults: 'No events found'
  };

  const isRtl = isArabic || isKurdish;

  const categories = [
    { name: t.catTech, icon: Laptop, iconColor: 'text-[#38bdf8]', path: '/categories' },
    { name: t.catBusiness, icon: Briefcase, iconColor: 'text-[#38bdf8]', path: '/categories' },
    { name: t.catMusic, icon: Music, iconColor: 'text-[#f59e0b]', path: '/categories' },
    { name: t.catDesign, icon: Palette, iconColor: 'text-[#e879f9]', path: '/categories' },
    { name: t.catMarketing, icon: Megaphone, iconColor: 'text-[#facc15]', path: '/categories' },
    { name: t.catGaming, icon: Gamepad2, iconColor: 'text-[#4ade80]', path: '/categories' },
    { name: t.catMore, icon: MoreHorizontal, iconColor: 'text-[#94a3b8]', path: '/categories' },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: t.evt1Title,
      date: '24 May 2026',
      location: t.loc1,
      going: t.evt1Going,
      price: '$39',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
    },
    {
      id: 2,
      title: t.evt2Title,
      date: '3 June 2026',
      location: t.loc2,
      going: t.evt2Going,
      price: '$55',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=80',
    },
    {
      id: 3,
      title: t.evt3Title,
      date: '17 June 2026',
      location: t.loc3,
      going: t.evt3Going,
      price: '$75',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
    },
  ];

  const filteredEvents = upcomingEvents.filter((evt) => 
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0e0f22] text-slate-800 dark:text-white font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200"
    >
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 font-serif tracking-wide text-slate-900 dark:text-white">
              {t.greeting}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder} 
                className={`w-full bg-white dark:bg-[#161836] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 transition`}
              />
            </div>
            
            <button onClick={() => navigate('/settings')} className="p-2.5 rounded-xl bg-white dark:bg-[#161836] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            
            <button onClick={() => navigate('/notifications')} className="p-2.5 rounded-xl bg-white dark:bg-[#161836] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative transition cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} w-2 h-2 bg-pink-500 rounded-full`}></span>
            </button>

            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Profile" onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full border border-indigo-500/50 object-cover cursor-pointer" />
          </div>
        </header>

        {/* Featured Banner */}
        <section className="relative bg-white dark:bg-[#161836] rounded-3xl p-4 md:p-5 border border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center gap-6 shadow-lg dark:shadow-xl">
          <div className="relative w-full md:w-1/2 h-56 rounded-2xl overflow-hidden cursor-pointer" onClick={() => navigate('/events/1')}>
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80" alt="Featured Event" className="w-full h-full object-cover" />
            <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-white/95 backdrop-blur-md text-slate-900 rounded-xl px-2.5 py-1 text-center font-bold text-xs shadow-md`}>
              <span className="block text-sm leading-none font-extrabold">24</span>
              <span className="text-[9px] uppercase tracking-wider">MAY</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="inline-block px-3 py-0.5 bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 text-[11px] font-semibold rounded-full">
                {t.featuredBadge}
              </span>
              <h2 className="text-2xl font-bold tracking-tight cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-300 transition text-slate-900 dark:text-white" onClick={() => navigate('/events/1')}>{t.featuredTitle}</h2>
              
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> {t.featuredLocation}</p>
                <p className="flex items-center gap-2"><Music className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> {t.featuredMusic}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/60">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">👥 {t.goingCount}</span>
              <button onClick={() => navigate('/tickets')} className="bg-[#635bff] hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-xl text-xs transition shadow-md cursor-pointer">
                {t.getTicket}
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{t.categoriesTitle}</h3>
            <button onClick={() => navigate('/categories')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer">{t.seeAll}</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} onClick={() => navigate(cat.path)} className="bg-slate-100 dark:bg-[#1d204a] hover:bg-slate-200 dark:hover:bg-[#25295c] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 text-center shadow-sm dark:shadow-md hover:-translate-y-1">
                  <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="pt-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{t.upcomingTitle}</h3>
            <button onClick={() => navigate('/explore')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer">{t.viewAll}</button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div key={evt.id} onClick={() => navigate(`/events/${evt.id}`)} className="bg-white dark:bg-[#161836] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-950/50 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer flex flex-col group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button onClick={(e) => { e.stopPropagation(); navigate('/saved'); }} className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 bg-slate-900/60 backdrop-blur-md rounded-full text-slate-300 hover:text-white transition cursor-pointer`}>
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>{evt.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {evt.title}
                      </h4>
                      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {evt.location}</p>
                        <p className="flex items-center gap-1.5"><span>👥 {evt.going}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/60">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">{t.fromPrice}</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{evt.price}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); navigate('/tickets'); }} className="bg-[#635bff] hover:bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-md cursor-pointer">
                        {t.getTicket}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-[#161836] rounded-2xl border border-slate-200 dark:border-slate-800">
              {t.noResults}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}