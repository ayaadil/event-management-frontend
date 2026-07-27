// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Users2, Ticket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/layout/logo';

export default function About() {
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const content = {
    ar: {
      aboutTitle: 'عن',
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
      aboutDesc: 'ئێڤێنتلی شوێنێکە بۆ دۆزینەوەی ئەو چالاکییەکانەی کە دەتبەستنەوە بە خەڵک و یادەوەرییەکان کە دەمێننەوە. جا تۆ بەدوای کۆنسێرتێک، وۆرکشوپێک، یان کۆبوونەوەیەکدا دەگەڕێیت، ئێڤێنتلی یارمەتیت دەدات بۆ دۆزینەوە، رزۆرکردن و چێژھوەرگرتن - هەمووی لە یەک شوێن.',
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-4xl mx-auto px-4 py-8 overflow-hidden"
    >
      <motion.div 
        variants={itemVariants}
        className="mb-8 space-y-4"
      >
        {/* الترتيب الجديد: أيقونة الشعار أولاً، ثم كلمة About، ثم Evently بنفس الستايل واللون */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex items-center gap-3 flex-wrap"
        >
          {/* أيقونة الشعار فقط */}
          <Logo showText={false} size="lg" />

          {/* كلمة About */}
          <motion.span 
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.3 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 dark:from-purple-300 dark:via-fuchsia-400 dark:to-indigo-300 bg-clip-text text-transparent inline-block cursor-pointer"
          >
            {t.aboutTitle}
          </motion.span>

          {/* كلمة Evently */}
          <motion.span 
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.3 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 dark:from-purple-300 dark:via-fuchsia-400 dark:to-indigo-300 bg-clip-text text-transparent inline-block cursor-pointer"
          >
            Evently
          </motion.span>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-600 dark:text-[#B6A6D6] text-sm md:text-base leading-relaxed pt-2"
        >
          {t.aboutDesc}
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {t.features.map(({ icon: Icon, title, text }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:border-purple-400 dark:hover:border-purple-500/40 transition shadow-md dark:shadow-lg group cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-[#DD3E93]/15 flex items-center justify-center mb-4"
            >
              <Icon size={20} className="text-purple-600 dark:text-[#F0ABFC]" />
            </motion.div>
            <h3 className="font-bold text-base mb-1.5 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#F0ABFC] transition-colors">{title}</h3>
            <p className="text-xs text-slate-600 dark:text-[#B6A6D6] leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-[#2E1B4F] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md dark:shadow-lg"
      >
        <h2 className="font-serif text-xl font-bold mb-2 text-slate-900 dark:text-white">{t.missionTitle}</h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-[#B6A6D6] leading-relaxed">
          {t.missionDesc}
        </p>
      </motion.div>
    </motion.div>
  );
}