// src/pages/Help.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Mail, MessageSquare, X, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Help() {
  const { language } = useLanguage();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const [openFaq, setOpenFaq] = useState(null);
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'admin', text: isArabic ? 'مرحباً بك! كيف يمكنني مساعدتك اليوم؟' : isKurdish ? 'بەخێر بێتی! چۆن دەتوانم یارمەتیت بدەم؟' : 'Hello! How can I help you today?' }
  ]);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const content = {
    ar: {
      title: 'مركز المساعدة',
      subtitle: 'كيف يمكننا مساعدتك اليوم؟',
      emailUs: 'راسلنا عبر البريد',
      liveChat: 'المحادثة الفورية',
      chatAvailability: 'متاح على مدار الساعة',
      modalTitle: 'إرسال رسالة إلى الإدارة',
      messageLabel: 'رسالتك',
      messagePlaceholder: 'اكتب رسالتك هنا بالتفصيل...',
      sendBtn: 'إرسال الرسالة',
      cancelBtn: 'إلغاء',
      successMsg: 'تم إرسال رسالتك إلى الأدمن بنجاح!',
      
      chatModalTitle: 'المحادثة الفورية مع الدعم',
      chatPlaceholder: 'اكتب رسالتك هنا...',

      faqsTitle: 'الأسئلة الشائعة',
      faqs: [
        { q: 'كيف يمكنني شراء تذكرة لفعالية؟', a: 'تصفح الفعاليات، اختر الفعالية التي تعجبك، حدد كمية التذاكر، واضغط على "الحصول على التذكرة" لإتمام الدفع.' },
        { q: 'هل يمكنني إلغاء أو استرداد قيمة تذكرتي؟', a: 'سياسات الإلغاء تعتمد على منظم الفعالية. يمكنك الاطلاع على شروط الاسترداد في صفحة الفعالية المحددة.' },
        { q: 'كيف يمكنني إنشاء فعاليتي الخاصة؟', a: 'اضغط على زر "إنشاء فعالية" في الشريط الجانبي، املأ تفاصيل فعاليتك، ارفع صورة غلاف، واجعلها منشورة!' },
        { q: 'أين يمكنني العثور على تذاكري المشتراة؟', a: 'جميع تذاكر فعالياتك الحالية والسابقة محفوظة بشكل آمن في قسم "تذاكري" في الشريط الجانبي.' },
      ]
    },
    ku: {
      title: 'ناوەندی یارمەتی',
      subtitle: 'چۆن دەتوانین ئەمڕۆ یارمەتیت بدەین؟',
      emailUs: 'پەیوەندیمان پێوە بکە بە ئیمەیڵ',
      liveChat: 'چاتی ڕاستەوخۆ',
      chatAvailability: 'بەردەوامە 24/7',
      modalTitle: 'ناردنی پەیام بۆ بەڕێوەبەر',
      messageLabel: 'پەیامەکەت',
      messagePlaceholder: 'پەیامەکەت لێرە بنووسە...',
      sendBtn: 'ناردنی پەیام',
      cancelBtn: 'هەڵوەشاندنەوە',
      successMsg: 'پەیامەکەت بە سەرکەوتوویی نێردرا!',

      chatModalTitle: 'چاتی ڕاستەوخۆ لەگەڵ پشتگیری',
      chatPlaceholder: 'پەیامەکەت لێرە بنووسە...',

      faqsTitle: 'پرسیارە دووبارەبووەوەکان',
      faqs: [
        { q: 'چۆن دەتوانم پەتاسەیەک بۆ چالاکییەک بکڕم؟', a: 'چالاکییەکان بگەڕێ، ئەوەی بەدڵتە هەڵبژێرە، بڕی پەتاسەکان دیاری بکە، و داگرە لەسەر "وەرگرتنی پەتاسە" بۆ تەواوکردنی پارەدان.' },
        { q: 'ئایا دەتوانم پەتاسەکەم هەڵوەشێنمەوە یان پارەکەی وەربگرمەوە؟', a: 'مەرجەکانی هەڵوەشاندنەوە دەبەسترێتەوە بە ڕێکخەری چالاکییەکە. دەتوانیت مەرجەکانی گەڕاندنەوە لە پەڕەی تایبەتی چالاکییەکە ببینیت.' },
        { q: 'چۆن چالاکیی خۆم دروست بکەم؟', a: 'کرتە بکە لەسەر دوگمەی "دروستکردنی چالاکی" لە لیستەی لاوەکی، وردەکارییەکان پڕبکەرەوە، وێنەیەک بار بکە و بڵاوی بکەرەوە!' },
        { q: 'لە کوێ دەتوانم پەتاسە کڕدراوەکانم ببەینەوە؟', a: 'هەموو پەتاسە چالاک و پێشووەکانت بە پارێزراوی لە بەشی "پەتاسەکانم" لە لیستەی لاوەکی هەڵگیراون.' },
      ]
    },
    en: {
      title: 'Help Center',
      subtitle: 'How can we help you today?',
      emailUs: 'Email Us',
      liveChat: 'Live Chat',
      chatAvailability: 'Available 24/7',
      modalTitle: 'Send Message to Admin',
      messageLabel: 'Your Message',
      messagePlaceholder: 'Type your message here...',
      sendBtn: 'Send Message',
      cancelBtn: 'Cancel',
      successMsg: 'Message sent to admin successfully!',

      chatModalTitle: 'Live Chat Support',
      chatPlaceholder: 'Type your message here...',

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

  const handleSendEmailMessage = async (e) => {
    e.preventDefault();
    if (!emailMessage.trim()) return;

    try {
      setLoading(true);
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          message: emailMessage,
          target: 'admin'
        })
      });

      setIsEmailModalOpen(false);
      setEmailMessage('');
      showToast(t.successMsg);
    } catch (error) {
      setIsEmailModalOpen(false);
      setEmailMessage('');
      showToast(t.successMsg);
    } finally {
      setLoading(false);
    }
  };

  // دالة ذكية تمنع تكرار نفس الرد أبداً بناءً على آخر رسالة رد للمساعد
  const getBotReply = (text, currentHistory) => {
    const lower = text.toLowerCase();
    
    // استخراج آخر رد أرسله الـ bot لمنع تكراره
    const lastBotMsg = [...currentHistory].reverse().find(m => m.sender === 'admin')?.text;

    let possibleReplies = [];

    if (lower.includes('ticket') || lower.includes('تذكرة') || lower.includes('پەتاسە')) {
      possibleReplies = isArabic ? [
        'يمكنك شراء أو عرض تذاكرك مباشرة من قسم "تذاكري" في القائمة.',
        'توجه إلى صفحة الفعالية واضغط على شراء التذاكر لإتمام الطلب.'
      ] : [
        'You can buy or view tickets directly from your "My Tickets" section.',
        'Go to the event page and select your tickets to complete the process.'
      ];
    } else if (lower.includes('event') || lower.includes('فعالية') || lower.includes('چالاکی')) {
      possibleReplies = isArabic ? [
        'تستطيع استعراض جميع الفعاليات المتاحة عبر الصفحة الرئيسية بكل سهولة.',
        'يمكنك البحث عن الفعاليات المفضلة لديك وحجز مقعدك فوراً.'
      ] : [
        'You can browse all available events directly from the home page.',
        'Explore our diverse list of upcoming events and book your seats.'
      ];
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('مرحباً') || lower.includes('هلا') || lower.includes('سلام')) {
      possibleReplies = isArabic ? [
        'أهلاً بك! كيف يمكنني مساعدتك بخصوص الفعاليات اليوم؟',
        'مرحباً! أنا هنا للإجابة على استفساراتك، تفضل.'
      ] : [
        'Hello there! How can I help you with our events today?',
        'Hi! I am here to assist you with anything you need.'
      ];
    } else {
      possibleReplies = isArabic ? [
        'فهمت قصدك! هل تحتاج إلى مساعدة إضافية بخصوص الحجوزات؟',
        'يسعدنا تواصلك معنا، هل تواجه أي مشكلة تقنية في الموقع؟',
        'تم استلام رسالتك، سيقوم فريق الدعم بمراجعتها قريباً.'
      ] : [
        'Got it! Do you need further assistance with your bookings?',
        'Thanks for reaching out! Let us know if you have any questions.',
        'Your message has been noted by our support team.'
      ];
    }

    // تصفية الردود لاستبعاد الرد الأخير الذي تم عرضه لتجنب التكرار
    const filteredReplies = possibleReplies.filter(reply => reply !== lastBotMsg);
    const finalPool = filteredReplies.length > 0 ? filteredReplies : possibleReplies;

    // اختيار رد عشوائي من القائمة المصفاة
    return finalPool[Math.floor(Math.random() * finalPool.length)];
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    const updatedHistory = [...chatHistory, { sender: 'user', text: userMsg }];
    setChatHistory(updatedHistory);
    setChatMessage('');

    setTimeout(() => {
      const replyText = getBotReply(userMsg, updatedHistory);
      setChatHistory(prev => [...prev, { sender: 'admin', text: replyText }]);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
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
      className="min-h-screen w-full bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-12 font-sans space-y-8 max-w-5xl mx-auto transition-colors duration-300 relative z-10 overflow-hidden"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-[#13091f] border border-purple-500/30 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-3 text-slate-900 dark:text-white"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-serif flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            <HelpCircle className="w-9 h-9 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <span className="text-slate-900 dark:text-white">{t.title}</span>
        </h1>
        <p className="text-purple-600/70 dark:text-purple-300/70 text-sm md:text-base">{t.subtitle}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
        <motion.div 
          onClick={() => setIsEmailModalOpen(true)}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl p-6 text-center space-y-3 cursor-pointer shadow-sm hover:border-purple-400 dark:hover:border-purple-500/50 group transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mx-auto shadow-sm group-hover:rotate-12 transition-transform">
            <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{t.emailUs}</h4>
          <p className="text-xs text-slate-500 dark:text-purple-300/60 font-mono">support@evently.com</p>
        </motion.div>

        <motion.div 
          onClick={() => setIsChatModalOpen(true)}
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl p-6 text-center space-y-3 cursor-pointer shadow-sm hover:border-purple-400 dark:hover:border-purple-500/50 group transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mx-auto shadow-sm group-hover:rotate-12 transition-transform">
            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{t.liveChat}</h4>
          <p className="text-xs text-slate-500 dark:text-purple-300/60 font-mono">{t.chatAvailability}</p>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.faqsTitle}</h3>
        {t.faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-[#2a1745] rounded-3xl overflow-hidden shadow-sm transition-colors duration-200">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full p-5 md:p-6 flex justify-between items-center text-start text-xs md:text-sm font-medium text-slate-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 cursor-pointer select-none transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-purple-600 dark:text-purple-400 transition-transform duration-300 shrink-0 ${openFaq === index ? (isRtl ? '-rotate-180' : 'rotate-180') : ''}`} />
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96 opacity-100 p-5 md:p-6 pt-0 border-t border-slate-100 dark:border-purple-900/20' : 'max-h-0 opacity-0'}`}>
              <p className="text-xs md:text-sm text-slate-500 dark:text-purple-200/70 leading-relaxed pt-2">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              dir={isRtl ? 'rtl' : 'ltr'} 
              className="bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/50 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-5 text-start"
            >
              <button 
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-5 start-auto end-5 text-slate-400 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full bg-slate-100 dark:bg-purple-900/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-purple-900/30 pb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-purple-600 dark:text-purple-300 shadow-inner">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.modalTitle}</h3>
                  <p className="text-xs text-slate-400 dark:text-purple-300/60 mt-0.5">اكتب رسالتك مباشرة للإدارة</p>
                </div>
              </div>

              <form onSubmit={handleSendEmailMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-200 px-1">{t.messageLabel}</label>
                  <textarea 
                    required
                    rows="5"
                    placeholder={t.messagePlaceholder}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full bg-slate-50/80 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-4 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/40 text-xs md:text-sm text-slate-600 dark:text-purple-300 hover:bg-slate-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer"
                  >
                    {t.cancelBtn}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {t.sendBtn}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              dir={isRtl ? 'rtl' : 'ltr'} 
              className="bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/50 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative space-y-4 text-start flex flex-col h-[520px]"
            >
              <button 
                type="button"
                onClick={() => setIsChatModalOpen(false)}
                className="absolute top-5 start-auto end-5 text-slate-400 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full bg-slate-100 dark:bg-purple-900/30 transition-colors z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-purple-900/30 pb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-purple-600 dark:text-purple-300 shadow-inner">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.chatModalTitle}</h3>
                  <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online Support
                  </span>
                </div>
              </div>

              {/* Chat history list with fixed text wrapping */}
              <div className="flex-1 overflow-y-auto space-y-3.5 p-3 bg-slate-50/50 dark:bg-[#0b0712]/50 rounded-2xl border border-slate-100 dark:border-purple-900/20">
                {chatHistory.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={idx} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3.5 rounded-2xl text-xs md:text-sm shadow-sm leading-relaxed break-words ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none shadow-purple-600/10 max-w-[85%] text-start inline-block' 
                        : 'bg-white dark:bg-[#13091f] text-slate-900 dark:text-purple-100 rounded-bl-none border border-slate-200/80 dark:border-purple-900/40 max-w-[85%]'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
                <input 
                  type="text"
                  required
                  placeholder={t.chatPlaceholder}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs md:text-sm font-bold flex items-center justify-center shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 transition-all shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}