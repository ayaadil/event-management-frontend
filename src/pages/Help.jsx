import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Mail, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Help() {
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [openFaq, setOpenFaq] = useState(null);

  const content = {
    ar: {
      title: 'مركز المساعدة',
      subtitle: 'كيف يمكننا مساعدتك اليوم؟',
      emailUs: 'راسلنا عبر البريد',
      callSupport: 'اتصل بالدعم',
      liveChat: 'المحادثة الفورية',
      chatAvailability: 'متاح على مدار الساعة',
      faqsTitle: 'الأسئلة الشائعة',
      faqs: [
        { q: 'كيف يمكنني شراء تذكرة لفعالية؟', a: 'تصفح الفعاليات، اختر الفعالية التي تعجبك، حدد كمية التذاكر، واضغط على "الحصول على التذكرة" لإتمام الدفع.' },
        { q: 'هل يمكنني إلغاء أو استرداد قيمة تذكرتي؟', a: 'سياسات الإلغاء تعتمد على منظم الفعالية. يمكنك الاطلاع على شروط الاسترداد في صفحة الفعالية المحددة.' },
        { q: 'كيف يمكنني إنشاؤ فعاليتي الخاصة؟', a: 'اضغط على زر "إنشاء فعالية" في الشريط الجانبي، املأ تفاصيل فعاليتك، ارفع صورة غلاف، واجعلها منشورة!' },
        { q: 'أين يمكنني العثور على تذاكري المشتراة؟', a: 'جميع تذاكر فعالياتك الحالية والسابقة محفوظة بشكل آمن في قسم "تذاكري" في الشريط الجانبي.' },
      ]
    },
    ku: {
      title: 'ناوەندی یارمەتی',
      subtitle: 'چۆن دەتوانین ئەمڕۆ یارمەتیت بدەین؟',
      emailUs: 'پەیوەندیمان پێوە بکە بە ئیمەیڵ',
      callSupport: 'پەیوەندی بە پشتگیری',
      liveChat: 'چاتی ڕاستەوخۆ',
      chatAvailability: 'بەردەوامە 24/7',
      faqsTitle: 'پرسیارە دووبارەبووەوەکان',
      faqs: [
        { q: 'چۆن دەتوانم پەتاسەیەک بۆ چالاکییەک بکڕم؟', a: 'چالاکییەکان بگەڕێ، ئەوەی بەدڵتە هەڵبژێرە، بڕی پەتاسەکان دیاری بکە، و داگرە لەسەر "وەرگرتنی پەتاسە" بۆ تەواوکردنی پارەدان.' },
        { q: 'ئایا دەتوانم پەتاسەکەم هەڵوەشێنمەوە یان پارەکەی وەربگرمەوە؟', a: 'مەرجەکانی هەڵوەشاندنەوە دەبەسترێتەوە بە رێکخەری چالاکییەکە. دەتوانیت مەرجەکانی گەڕاندنەوە لە پەڕەی تایبەتی چالاکییەکە ببینیت.' },
        { q: 'چۆن چالاکیی خۆم دروست بکەم؟', a: 'کرتە بکە لەسەر دوگمەی "دروستکردنی چالاکی" لە لیستەی لاوەکی، وردەکارییەکان پڕبکەرەوە، وێنەیەک بار بکە و بڵاوی بکەرەوە!' },
        { q: 'لە کوێ دەتوانم پەتاسە کڕدراوەکانم ببەینەوە؟', a: 'هەموو پەتاسە چالاک و پێشووەکانت بە پارێزراوی لە بەشی "پەتاسەکانم" لە لیستەی لاوەکی هەڵگیراون.' },
      ]
    },
    en: {
      title: 'Help Center',
      subtitle: 'How can we help you today?',
      emailUs: 'Email Us',
      callSupport: 'Call Support',
      liveChat: 'Live Chat',
      chatAvailability: 'Available 24/7',
      faqsTitle: 'Frequently Asked Questions',
      faqs: [
        { q: 'How can I buy a ticket for an event?', a: 'Browse through events, select the one you like, choose your ticket quantity, and click "Get Ticket" to complete payment.' },
        { q: 'Can I cancel or refund my ticket?', a: 'Cancellation policies depend on the event organizer. You can view the refund terms on the specific event page.' },
        { q: 'How do I create my own event?', a: 'Click on the "Create Event" button in the sidebar, fill in your event details, upload a banner image, and publish it!' },
        { q: 'Where can I find my purchased tickets?', a: 'All your active and past event tickets are securely saved in the "My Tickets" section of your sidebar.' },
      ]
    }
  };

  const t = content[isArabic ? 'ar' : isKurdish ? 'ku' : 'en'];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-10 font-sans space-y-8 max-w-4xl mx-auto transition-colors duration-200">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-serif flex items-center justify-center gap-2 text-slate-900 dark:text-white">
          <HelpCircle className="text-purple-500 dark:text-purple-400 w-8 h-8" /> {t.title}
        </h1>
        <p className="text-purple-600/60 dark:text-purple-300/60 text-xs md:text-sm">{t.subtitle}</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 text-center space-y-2 hover:border-purple-400 dark:hover:border-purple-600/40 transition shadow-sm dark:shadow-none">
          <Mail className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.emailUs}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">support@evently.com</p>
        </div>

        <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 text-center space-y-2 hover:border-purple-400 dark:hover:border-purple-600/40 transition shadow-sm dark:shadow-none">
          <Phone className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.callSupport}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">+964 750 000 0000</p>
        </div>

        <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl p-5 text-center space-y-2 hover:border-purple-400 dark:hover:border-purple-600/40 transition shadow-sm dark:shadow-none">
          <MessageSquare className="w-6 h-6 text-purple-500 dark:text-purple-400 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t.liveChat}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.chatAvailability}</p>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.faqsTitle}</h3>
        {t.faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/30 rounded-2xl overflow-hidden transition shadow-sm dark:shadow-none">
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full p-4 flex justify-between items-center text-start text-xs md:text-sm font-medium text-slate-700 dark:text-purple-100 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-purple-500 dark:text-purple-400 transition-transform duration-200 shrink-0 ${isRtl ? (openFaq === index ? '-rotate-180' : '') : (openFaq === index ? 'rotate-180' : '')}`} />
            </button>
            {openFaq === index && (
              <div className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-purple-900/20 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}