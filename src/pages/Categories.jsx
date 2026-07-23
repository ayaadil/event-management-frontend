import React, { useState, useEffect } from 'react';
import { 
  Laptop, Briefcase, Music, Palette, Megaphone, Gamepad2, 
  Calendar, MapPin, Heart, Search, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CategoriesPage() {
  const contextLang = useLanguage();
  
  const getCurrentLang = () => {
    const langVal = contextLang?.language || localStorage.getItem('language') || 'en';
    const langStr = String(langVal).toLowerCase();
    if (langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish')) return 'ku';
    if (langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic')) return 'ar';
    return 'en';
  };

  const [currentLang, setCurrentLang] = useState(getCurrentLang());

  useEffect(() => {
    const checkLang = () => {
      setCurrentLang(getCurrentLang());
    };
    const interval = setInterval(checkLang, 200);
    window.addEventListener('storage', checkLang);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkLang);
    };
  }, [contextLang]);

  const isRtl = currentLang === 'ar' || currentLang === 'ku';

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesList = [
    { id: 'all', titleKey: 'All', title: { ar: 'الكل', ku: 'هەموو', en: 'All' }, icon: SlidersHorizontal, iconColor: 'text-purple-500 dark:text-purple-400' },
    { id: 'tech', titleKey: 'Technology', title: { ar: 'تكنولوجيا', ku: 'تەکنەلۆژیا', en: 'Technology' }, icon: Laptop, iconColor: 'text-sky-500 dark:text-sky-400' },
    { id: 'business', titleKey: 'Business', title: { ar: 'أعمال', ku: 'کار', en: 'Business' }, icon: Briefcase, iconColor: 'text-sky-500 dark:text-sky-400' },
    { id: 'music', titleKey: 'Music', title: { ar: 'موسيقى', ku: 'مۆسیقا', en: 'Music' }, icon: Music, iconColor: 'text-orange-500 dark:text-orange-400' },
    { id: 'design', titleKey: 'Design', title: { ar: 'تصميم', ku: 'دیزاین', en: 'Design' }, icon: Palette, iconColor: 'text-indigo-500 dark:text-indigo-400' },
    { id: 'marketing', titleKey: 'Marketing', title: { ar: 'تسويق', ku: 'مارکێتینگ', en: 'Marketing' }, icon: Megaphone, iconColor: 'text-yellow-500 dark:text-yellow-400' },
    { id: 'gaming', titleKey: 'Gaming', title: { ar: 'ألعاب', ku: 'یاری', en: 'Gaming' }, icon: Gamepad2, iconColor: 'text-green-500 dark:text-green-400' },
  ];

  const allEvents = [
    {
      id: 1,
      title: { ar: 'قمة الابتكار التكنولوجي 2026', ku: 'لوتکەی داهێنانی تەکنەلۆژی ٢٠٢٦', en: 'Tech Innovation Summit 2026' },
      categoryKey: 'Technology',
      category: { ar: 'تكنولوجيا', ku: 'تەکنەلۆژیا', en: 'Technology' },
      date: '15 Aug 2026',
      location: { ar: 'أربيل، بارك التكنولوجيا', ku: 'هەولێر، پارکی تەکنەلۆژیا', en: 'Erbil Tech Park' },
      price: '$45',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    },
    {
      id: 2,
      title: { ar: 'أمسية الموسيقى الصوتية الحية', ku: 'شەوی مۆسیقای ڕاستەوخۆی ئەکۆستیک', en: 'Live Acoustic Music Night' },
      categoryKey: 'Music',
      category: { ar: 'موسيقى', ku: 'مۆسیقا', en: 'Music' },
      date: '24 May 2026',
      location: { ar: 'دهوك، حدائق باكو بابلو', ku: 'دهۆک، باخچەکانی پاکۆ پابلۆ', en: 'Duhok, Pako Pablo Gardens' },
      price: '$39',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    },
    {
      id: 3,
      title: { ar: 'معرض التسويق الرقمي', ku: 'پێشانگای مارکێتینگی دیجیتاڵی', en: 'Digital Marketing Expo' },
      categoryKey: 'Marketing',
      category: { ar: 'تسويق', ku: 'مارکێتینگ', en: 'Marketing' },
      date: '10 Sep 2026',
      location: { ar: 'بغداد، أرض المعارض', ku: 'بەغدا، زەوی پێشانگاکان', en: 'Baghdad Fairground' },
      price: '$30',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
    },
    {
      id: 4,
      title: { ar: 'دورة متقدمة في تصميم واجهات المستخدم UI/UX', ku: 'خولێکی پێشکەوتوو لە دیزاینی UI/UX', en: 'UI/UX Design Masterclass' },
      categoryKey: 'Design',
      category: { ar: 'تصميم', ku: 'دیزاین', en: 'Design' },
      date: '02 Oct 2026',
      location: { ar: 'دهوك، المركز الثقافي', ku: 'دهۆک، سەنتەری ڕۆشنبیری', en: 'Duhok Cultural Center' },
      price: '$25',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
    },
    {
      id: 5,
      title: { ar: 'ساحة بطولة الألعاب الإلكترونية', ku: 'گۆڕەپانی پاڵەوانێتی یارییە ئەلیکترۆنییەکان', en: 'Championship Gaming Arena' },
      categoryKey: 'Gaming',
      category: { ar: 'ألعاب', ku: 'یاری', en: 'Gaming' },
      date: '18 Nov 2026',
      location: { ar: 'أربيل، أرينا مول', ku: 'هەولێر، ئارینا مۆڵ', en: 'Erbil Mall Arena' },
      price: '$20',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
    },
  ];

  const getLocalized = (obj) => {
    if (!obj) return '';
    if (currentLang === 'ar') return obj.ar || obj.en;
    if (currentLang === 'ku') return obj.ku || obj.en;
    return obj.en || obj.ar;
  };

  const uiTexts = {
    ar: {
      title: 'استكشاف التصنيفات',
      subtitle: 'تصفح الفعاليات حسب مواضيعك المفضلة',
      search: 'ابحث في التصنيفات...',
      allEvents: 'جميع الفعاليات',
      found: 'فعالية موجودة',
      price: 'السعر',
      getTicket: 'احصل على التذكرة',
      noEvents: 'لا توجد فعاليات مطابقة في هذا التصنيف.'
    },
    ku: {
      title: 'گەڕان بەدوای پۆلەکاندا',
      subtitle: 'چالاکییەکان بەپێی بابەتە دڵخوازەکانت ببینە',
      search: 'گەڕان لە پۆلەکاندا...',
      allEvents: 'هەموو چالاکییەکان',
      found: 'چالاکی دۆزراوەتەوە',
      price: 'نرخ',
      getTicket: 'پەڕە دەستخستن',
      noEvents: 'هیچ چالاکییەک لەم پۆلەدا نەدۆزراوەتەوە.'
    },
    en: {
      title: 'Explore Categories',
      subtitle: 'Browse events by your favorite topics',
      search: 'Search in categories...',
      allEvents: 'All Events',
      found: 'events found',
      price: 'Price',
      getTicket: 'Get Ticket',
      noEvents: 'No events found in this category.'
    }
  };

  const t = uiTexts[currentLang] || uiTexts.en;

  const filteredEvents = allEvents.filter(evt => {
    const matchesCategory = selectedCategory === 'All' || evt.categoryKey === selectedCategory;
    const titleText = getLocalized(evt.title).toLowerCase();
    const matchesSearch = titleText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-10 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white tracking-wide">{t.title}</h1>
            <p className="text-purple-600/70 dark:text-purple-300/70 text-xs md:text-sm mt-1">{t.subtitle}</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400`} />
            <input 
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-white dark:bg-[#150a21] text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-purple-500 transition`}
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.titleKey;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.titleKey)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30 dark:shadow-purple-900/50 scale-105'
                    : 'bg-white dark:bg-[#150a21] border-slate-200 dark:border-purple-900/30 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f0d33] hover:border-purple-300 dark:hover:border-purple-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cat.iconColor}`} />
                <span>{getLocalized(cat.title)}</span>
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              {selectedCategory === 'All' 
                ? t.allEvents 
                : `${categoriesList.find(c => c.titleKey === selectedCategory) ? getLocalized(categoriesList.find(c => c.titleKey === selectedCategory).title) : selectedCategory} - ${t.allEvents}`}
            </h2>
            <span className="text-xs text-purple-600/60 dark:text-purple-300/60">{filteredEvents.length} {t.found}</span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div 
                  key={evt.id} 
                  className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl overflow-hidden hover:border-purple-400 dark:hover:border-purple-600/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer group shadow-md dark:shadow-xl flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={evt.image} 
                      alt={getLocalized(evt.title)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-purple-100/90 dark:bg-purple-900/80 backdrop-blur-md border border-purple-300/60 dark:border-purple-500/40 text-purple-700 dark:text-purple-200 text-[10px] font-semibold px-2.5 py-1 rounded-lg`}>
                      {getLocalized(evt.category)}
                    </span>
                    <button className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white transition`}>
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-600/70 dark:text-purple-300/70">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{evt.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                        {getLocalized(evt.title)}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" /> 
                        <span className="line-clamp-1">{getLocalized(evt.location)}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-purple-900/40">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">{t.price}</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">{evt.price}</span>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-purple-900/20 dark:shadow-purple-900/30 cursor-pointer">
                        {t.getTicket}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#150a21] rounded-3xl border border-slate-200 dark:border-purple-900/30">
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.noEvents}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}