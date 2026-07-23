import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, ArrowRight, Trash2, Calendar, MapPin, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Saved() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [savedEvents, setSavedEvents] = useState([]);

  // قاموس شامل لترجمة العناوين والمواقع بدقة
  const translationsMap = {
    "Summer Music Festival 2026": {
      ar: "مهرجان صيف الموسيقى 2026",
      ku: "فێستیڤالی مۆسیقای هاوین ٢٠٢٦",
      en: "Summer Music Festival 2026"
    },
    "Duhok, Family Screen Park": {
      ar: "دهوك، حدائق فاميلي سكرين",
      ku: "دهۆک، باخچەی فامیلی سکریین",
      en: "Duhok, Family Screen Park"
    },
    "AI & Future Tech Conf": {
      ar: "مؤتمر الذكاء الاصطناعي وتقنيات المستقبل",
      ku: "کۆنگرەی زیرەکی دەستکرد و تەکنەلۆژیای داهاتوو",
      en: "AI & Future Tech Conf"
    },
    "Erbil International Fair": {
      ar: "معرض أربيل الدولي",
      ku: "پێشانگای نێودەوڵەتی هەولێر",
      en: "Erbil International Fair"
    },
    "Tech Innovation Summit 2026": {
      ar: "قمة الابتكار التكنولوجي 2026",
      ku: "لوتکەی داهێنانی تەکنەلۆژی ٢٠٢٦",
      en: "Tech Innovation Summit 2026"
    },
    "Erbil Tech Park": {
      ar: "أربيل، بارك التكنولوجيا",
      ku: "هەولێر، پارکی تەکنەلۆژیا",
      en: "Erbil Tech Park"
    },
    "Live Acoustic Music Night": {
      ar: "أمسية الموسيقى الصوتية الحية",
      ku: "شەوی مۆسیقای ڕاستەوخۆی ئەکۆستیک",
      en: "Live Acoustic Music Night"
    },
    "Duhok, Pako Pablo Gardens": {
      ar: "دهوك، حدائق باكو بابلو",
      ku: "دهۆک، باخچەکانی پاکۆ پابلۆ",
      en: "Duhok, Pako Pablo Gardens"
    },
    "Art & Design Expo": {
      ar: "معرض الفن والتصميم",
      ku: "پێشانگای هونەر و دیزاین",
      en: "Art & Design Expo"
    },
    "Duhok Cultural Center": {
      ar: "دهوك، المركز الثقافي",
      ku: "دهۆک، سەنتەری ڕۆشنبیری",
      en: "Duhok Cultural Center"
    }
  };

  useEffect(() => {
    let events = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    
    // إصلاح وتحديث النصوص القديمة المخزنة تلقائياً بناءً على القاموس
    events = events.map(event => {
      let originalTitle = event.title;
      if (typeof originalTitle === 'object') originalTitle = originalTitle.en;
      
      return {
        ...event,
        title: translationsMap[originalTitle] ? translationsMap[originalTitle].en : originalTitle
      };
    });

    setSavedEvents(events);
    localStorage.setItem('savedEvents', JSON.stringify(events));
  }, []);

  const handleRemove = (id) => {
    const updated = savedEvents.filter((event) => String(event.id) !== String(id));
    setSavedEvents(updated);
    localStorage.setItem('savedEvents', JSON.stringify(updated));
  };

  const getLocalized = (field) => {
    if (!field) return '';
    if (typeof field === 'object') {
      if (isArabic) return field.ar || field.en || '';
      if (isKurdish) return field.ku || field.en || '';
      return field.en || field.ar || '';
    }
    const matched = translationsMap[field];
    if (matched) {
      if (isArabic) return matched.ar;
      if (isKurdish) return matched.ku;
      return matched.en;
    }
    return field;
  };

  const uiTexts = {
    ar: {
      title: 'الفعاليات المحفوظة',
      subtitle: 'فعالياتك وأنشطتك المفضلة في مكان واحد',
      savedItems: 'عنصر محفوظ',
      details: 'التفاصيل',
      get: 'حجز',
      noSavedTitle: 'لا توجد فعاليات محفوظة',
      noSavedDesc: 'لم تقم بحفظ أي فعاليات حتى الآن. استكشف الفعاليات القادمة واضغط على أيقونة القلب لحفظها هنا.',
      explore: 'استكشاف الفعاليات',
    },
    ku: {
      title: 'چالاکییە پاشەکەوتکراوەکان',
      subtitle: 'چالاکی و چالاکییە دڵخوازەکانت لە یەک شوێنندا',
      savedItems: 'بڕگەی پاشەکەوتکراو',
      details: 'وردەکاری',
      get: 'گرتن',
      noSavedTitle: 'هیچ چالاکییەکی پاشەکەوتکراو نییە',
      noSavedDesc: 'هێشتا هیچ چالاکییەکت پاشەکەوت نەکردووە. بەدوای چالاکییەکاندا بگەرێ و کلیک لە نیشانەی دڵ بکە بۆ پاشەکەوتکردنیان.',
      explore: 'گەڕان بەدوای چالاکییەکاندا',
    },
    en: {
      title: 'Saved Events',
      subtitle: 'Your bookmarked events and activities in one place',
      savedItems: 'Saved Items',
      details: 'Details',
      get: 'Get',
      noSavedTitle: 'No Saved Events Found',
      noSavedDesc: "You haven't saved any events yet. Explore upcoming events and tap the heart icon to save them here.",
      explore: 'Explore Events',
    }
  };

  const t = uiTexts[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-8 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-purple-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">{t.title}</h1>
          <p className="text-slate-600 dark:text-purple-300/60 text-xs md:text-sm mt-1">{t.subtitle}</p>
        </div>
        <span className="text-xs bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full w-fit">
          {savedEvents.length} {t.savedItems}
        </span>
      </div>

      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl overflow-hidden shadow-md dark:shadow-xl hover:border-purple-400 dark:hover:border-purple-500/50 transition duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={getLocalized(event.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  onClick={() => handleRemove(event.id)}
                  title="Remove from Saved"
                  className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} bg-red-100 dark:bg-red-950/80 hover:bg-red-600 text-red-600 dark:text-red-300 hover:text-white p-2 rounded-xl border border-red-200 dark:border-red-500/30 transition cursor-pointer`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{getLocalized(event.title)}</h3>
                  <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {event.date}
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> 
                      <span className="line-clamp-1">{getLocalized(event.location)}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-purple-900/30 flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 dark:text-white">{event.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="bg-purple-50 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-700 dark:text-purple-200 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-purple-200 dark:border-purple-500/30 transition flex items-center gap-1 cursor-pointer"
                    >
                      {t.details} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => navigate('/tickets')}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5" /> {t.get}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#150a21]/60 border border-slate-200 dark:border-purple-900/30 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12 shadow-xl dark:shadow-2xl">
          <div className="p-4 bg-purple-100 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl w-fit mx-auto text-purple-600 dark:text-purple-400">
            <BookmarkX className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.noSavedTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-purple-300/60 leading-relaxed">{t.noSavedDesc}</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            {t.explore} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}