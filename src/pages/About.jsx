import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users2, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const content = {
    ar: {
      aboutTitle: 'عن موقع',
      brand: 'Evently',
      aboutDesc: 'إيفينتلي هو منصتك لاكتشاف الفعاليات التي تربطك بالناس وذكريات تدوم طويلاً. سواء كنت تبحث عن حفلة موسيقية، ورشة عمل، أو لقاء مجتمعي، يساعدك إيفينتلي في العثور عليها وحجزها والاستمتاع بها - كل ذلك في مكان واحد.',
      missionTitle: 'مهمتنا',
      missionDesc: 'نؤمن أن الفعاليات هي أكثر من مجرد تواريخ على التقويم - فهي المكان الذي تحدث فيه الاتصالات الحقيقية. مهمتنا هي جعل العثور على الفعاليات وتنظيمها أمراً سهلاً، حتى تقضي وقتاً أقصر في البحث وقتاً أطول في الاستمتاع بالتجربة.',
      features: [
        { icon: Compass, title: 'اكتشف الفعاليات', text: 'ابحث عن الفعاليات التي تتناسب مع اهتماماتك، من الحفلات الموسيقية إلى ورش العمل.' },
        { icon: Users2, title: 'تواصل مع الآخرين', text: 'تعرف على أشخاص جدد ووسع شبكة علاقاتك في كل فعالية تحضرها.' },
        { icon: Ticket, title: 'تذاكر سهلة', text: 'احجز، وأدر، وقم بالوصول إلى تذاكرك بكل سهولة في مكان واحد.' },
      ]
    },
    ku: {
      aboutTitle: 'دەربارەی',
      brand: 'Evently',
      aboutDesc: 'ئێڤێنتلی شوێنێکە بۆ دۆزینەوەی ئەو چالاکییانەی کە دەتبەستنەوە بە خەڵک و یادەوەرییەکان کە دەمێننەوە. جا تۆ بەدوای کۆنسێرتێک، وۆرکشوپێک، یان کۆبوونەوەیەکدا دەگەڕێیت، ئێڤێنتلی یارمەتیت دەدات بۆ دۆزینەوە، رزۆرکردن و چێژھوەرگرتن - هەمووی لە یەک شوێن.',
      missionTitle: 'ئامانجمان',
      missionDesc: 'باوەڕمان وابەستەیە کە چالاکییەکان تەنها ڕێکەوت نین لە ڕۆژژمێردا - بەڵکو ئەو شوێنەن کە پەیوەندی ڕاستەقینە تێیدا روودەدات. ئامانجمان ئەوەیە دۆزینەوەی چالاکییەکان ئاسان بکەین، بۆ ئەوەی کاتێکی کەمتر لە گەڕان و کاتێکی زیاتر لە بەسەربردن بەسەر ببەیت.',
      features: [
        { icon: Compass, title: 'دۆزینەوەی چالاکییەکان', text: 'ئەو چالاکییانە بدۆزەوە کە لەگەڵ بەرژەوەندییەکانت دەگونجێن، لە کۆنسێرتەوە تا وۆرکشوپ.' },
        { icon: Users2, title: 'پەیوەندی کردن', text: 'خەڵکی نوێ بناسە و تۆڕی پەیوەندییەکانت فراوان بکە لە هەر چالاکییەکدا.' },
        { icon: Ticket, title: 'پەتاسەی ئاسان', text: 'پەتاسەکانت رزۆر بکە، بەڕێوەبە و دەستیان پێ بگات لە یەک شوێنی سادەدا.' },
      ]
    },
    en: {
      aboutTitle: 'About',
      brand: 'Evently',
      aboutDesc: "Evently is a place to discover events that connect you with people and memories that last. Whether you're looking for a concert, a workshop, or a community meetup, Evently helps you find it, book it, and enjoy it — all in one place.",
      missionTitle: 'Our Mission',
      missionDesc: "We believe events are more than dates on a calendar — they're where real connections happen. Our mission is to make finding and organizing events effortless, so you can spend less time searching and more time experiencing.",
      features: [
        { icon: Compass, title: 'Discover Events', text: 'Find events that match your interests, from concerts to workshops.' },
        { icon: Users2, title: 'Connect', text: 'Meet new people and grow your network at every event you attend.' },
        { icon: Ticket, title: 'Easy Tickets', text: 'Book, manage, and access your tickets in one simple place.' },
      ]
    }
  };

  const t = content[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="font-serif text-3xl mb-3 font-bold text-slate-900 dark:text-white">
        {t.aboutTitle} <span className="text-purple-600 dark:text-[#F0ABFC]">{t.brand}</span>
      </h1>
      <p className="text-slate-600 dark:text-[#B6A6D6] text-sm md:text-base leading-relaxed mb-8">
        {t.aboutDesc}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {t.features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-purple-400 dark:hover:border-purple-500/40 transition shadow-md dark:shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-[#DD3E93]/15 flex items-center justify-center mb-4">
              <Icon size={20} className="text-purple-600 dark:text-[#F0ABFC]" />
            </div>
            <h3 className="font-bold text-base mb-1.5 text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-[#B6A6D6] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md dark:shadow-lg">
        <h2 className="font-serif text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.missionTitle}</h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-[#B6A6D6] leading-relaxed">
          {t.missionDesc}
        </p>
      </div>
    </motion.div>
  );
}