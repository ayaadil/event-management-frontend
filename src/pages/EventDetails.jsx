// src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Heart, Calendar, Clock, MapPin, Ticket,
  Plus, Minus, MessageSquare, X, Send, Music, Users,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDate, formatTimeRange, isEventPast, extractEndTime, stripEndTimeMarker } from '../utils/format';

// قاموس ترجمة ثابت لأسماء التصنيفات الشائعة (fallback لو الباك اند ما يرجع category_name_ar/ku)
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

const t = {
  ar: {
    loading: 'جاري التحميل...',
    notFound: 'الفعالية غير موجودة',
    backHome: '← العودة للرئيسية',
    aboutEvent: 'عن الفعالية:',
    theArtists: 'الفنانون:',
    tickets: 'التذاكر',
    soldOut: 'نفدت الكمية',
    available: 'متاح',
    free: 'مجاناً',
    capacity: 'السعة',
    general: 'عام',
    contact: 'تواصل',
    getTicket: 'احصل على التذكرة',
    booking: 'جاري الحجز...',
    contactOrganizer: 'تواصل مع المنظم',
    yourMessage: 'رسالتك',
    messagePlaceholder: 'اسأل عن التذاكر أو الموقع أو الجدول...',
    openEmail: 'فتح البريد الإلكتروني',
    selectTicket: 'الرجاء اختيار تذكرة واحدة على الأقل',
    bookingFailed: 'فشل الحجز',
    eventEnded: 'انتهت الفعالية',
    eventEndedDesc: 'لم يعد الحجز متاحاً لأن هذه الفعالية قد انتهت.',
    linkCopied: 'تم نسخ رابط الفعالية بنجاح!',
  },
  ku: {
    loading: 'چاوەڕوانبە...',
    notFound: 'چالاکییەکە نەدۆزرایەوە',
    backHome: '← گەڕانەوە بۆ سەرەکی',
    aboutEvent: 'دەربارەی چالاکییەکە:',
    theArtists: 'هونەرمەندەکان:',
    tickets: 'پەتاسەکان',
    soldOut: 'تەواو بووە',
    available: 'بەردەستە',
    free: 'بێبەرامبەر',
    capacity: 'گونجایی',
    general: 'گشتی',
    contact: 'پەیوەندی',
    getTicket: 'پەتاسە وەربگرە',
    booking: 'رزۆرکردن...',
    contactOrganizer: 'پەیوەندی بە ڕێکخەرەوە',
    yourMessage: 'پەیامەکەت',
    messagePlaceholder: 'پرسیار بکە دەربارەی پەتاسە، شوێن، یان خشتە...',
    openEmail: 'کردنەوەی ئیمەیل',
    selectTicket: 'تکایە لانیکەم یەک پەتاسە هەڵبژێرە',
    bookingFailed: 'رزۆرکردن سەرکەوتوو نەبوو',
    eventEnded: 'چالاکییەکە تەواو بووە',
    eventEndedDesc: 'ئیتر ناتوانیت پەتاسە وەربگریت چونکە ئەم چالاکییە تەواو بووە.',
    linkCopied: 'بەستەری چالاکییەکە کۆپی کرا!',
  },
  en: {
    loading: 'Loading...',
    notFound: 'Event not found',
    backHome: '← Back home',
    aboutEvent: 'About Event:',
    theArtists: 'The Artists:',
    tickets: 'Tickets',
    soldOut: 'Sold out',
    available: 'available',
    free: 'Free',
    capacity: 'capacity',
    general: 'General',
    contact: 'Contact',
    getTicket: 'Get Ticket',
    booking: 'Booking...',
    contactOrganizer: 'Contact Organizer',
    yourMessage: 'Your Message',
    messagePlaceholder: 'Ask a question about tickets, location, or schedule...',
    openEmail: 'Open Email',
    selectTicket: 'Please select at least one ticket',
    bookingFailed: 'Booking failed',
    eventEnded: 'Event Ended',
    eventEndedDesc: 'Booking is no longer available because this event has already ended.',
    linkCopied: 'Event link copied to clipboard!',
  },
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;
  const langKey = isArabic ? 'ar' : isKurdish ? 'ku' : 'en';
  const text = t[langKey];

  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  const [quantities, setQuantities] = useState({});
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // دالة المشاركة الفعالة (تعتمد على Web Share API أو النسخ المباشر)
  const handleShare = async () => {
    const shareData = {
      title: event?.title || 'Event',
      text: stripEndTimeMarker(event?.description) || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(text.linkCopied);
        setTimeout(() => setCopySuccess(''), 3000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  // يرجع اسم التصنيف مترجماً: من قاعدة البيانات أولاً، ثم من القاموس الثابت
  const localizeCategory = (categoryObj) => {
    if (!categoryObj) return '';
    const dbKey = `category_name_${langKey}`;
    if (categoryObj[dbKey]) return categoryObj[dbKey];

    const base = categoryObj.category_name;
    if (base && CATEGORY_TRANSLATIONS[base.toLowerCase()]) {
      return CATEGORY_TRANSLATIONS[base.toLowerCase()][langKey];
    }
    return base || '';
  };

  // جلب بيانات الفعالية، أنواع التذاكر، والمتحدثين من الباك إند
  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    Promise.all([
      api.getEventById(id),
      api.getTicketTypesByEvent(id).catch(() => []),
      api.getSpeakersByEvent(id).catch(() => []),
    ])
      .then(([eventData, ticketData, speakerData]) => {
        if (!eventData) {
          setNotFound(true);
          return;
        }
        setEvent(eventData);
        setTicketTypes(ticketData || []);
        setSpeakers(speakerData || []);

        // تهيئة كميات التذاكر بـ صفر
        const initialQty = {};
        (ticketData || []).forEach((tt) => { initialQty[tt.id] = 0; });
        setQuantities(initialQty);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    // التحقق مما إذا كانت الفعالية محفوظة لدى المستخدم
    api.getMySavedEvents()
      .then((saved) => setIsSaved(saved.some((e) => String(e.id) === String(id))))
      .catch(() => setIsSaved(false));
  }, [id]);

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await api.unsaveEvent(id);
      } else {
        await api.saveEvent(id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Failed to toggle saved event', err);
    }
  };

  const handleQtyChange = (ticketTypeId, delta, max) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[ticketTypeId] || 0) + delta);
      return { ...prev, [ticketTypeId]: Math.min(next, max ?? next) };
    });
  };

  const totalPrice = ticketTypes.reduce(
    (sum, tt) => sum + (quantities[tt.id] || 0) * Number(tt.price),
    0
  );

  const handleGetTicket = async () => {
    setBookingError('');

    if (isEventPast(event?.date_time, extractEndTime(event?.description))) {
      setBookingError(text.eventEndedDesc);
      return;
    }

    const selections = ticketTypes.filter((tt) => (quantities[tt.id] || 0) > 0);
    if (selections.length === 0) {
      setBookingError(text.selectTicket);
      return;
    }
    setBooking(true);
    try {
      for (const tt of selections) {
        await api.createBooking({ ticket_type_id: tt.id, quantity: quantities[tt.id] });
      }
      navigate('/tickets');
    } catch (err) {
      setBookingError(err.message || text.bookingFailed);
    } finally {
      setBooking(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !event?.organizer_email) return;
    const subject = encodeURIComponent(`Question about ${event.title}`);
    const body = encodeURIComponent(messageText);
    window.location.href = `mailto:${event.organizer_email}?subject=${subject}&body=${body}`;
    setShowContactModal(false);
    setMessageText('');
  };

  if (loading) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm transition-colors duration-200">
        {text.loading}
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <p className="text-sm">{text.notFound}</p>
        <button onClick={() => navigate('/home')} className="text-purple-600 dark:text-purple-400 text-xs font-semibold hover:underline cursor-pointer">
          {text.backHome}
        </button>
      </div>
    );
  }

  const categoryName = localizeCategory({
    category_name: event.category_name,
    category_name_ar: event.category_name_ar,
    category_name_ku: event.category_name_ku,
    category_name_en: event.category_name_en,
  });

  const eventEndTime = extractEndTime(event.description);
  const isPast = isEventPast(event.date_time, eventEndTime) || event.status === 'cancelled';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-4 md:p-8 font-sans max-w-5xl mx-auto space-y-6 transition-colors duration-200"
    >
      
      {/* رسالة نجاح نسخ الرابط */}
      {copySuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white text-xs px-4 py-2 rounded-xl shadow-lg transition-all">
          {copySuccess}
        </div>
      )}

      {/* البطاقة الرئيسية */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-[#2a1745] bg-white dark:bg-[#13091f] shadow-xl transition-colors duration-200">
        
        {/* البانر العلوي */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7, ease: "out" }}
            src={event.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#13091f] via-transparent to-black/30" />

          {/* أزرار التحكم العلوية */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)} 
              className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white transition cursor-pointer shadow-sm"
            >
              <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white transition cursor-pointer shadow-sm"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSave}
                className={`p-2.5 backdrop-blur-md border border-white/10 rounded-xl transition cursor-pointer shadow-sm ${isSaved ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-black/40 text-white hover:text-rose-400'}`}
              >
                <Heart className={`w-5 h-5 transition-transform duration-300 ${isSaved ? 'fill-rose-500 scale-110' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* تفاصيل المحتوى */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* العنوان والموقع */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white"
            >
              {event.title}
            </motion.h1>
            <p className="text-slate-600 dark:text-purple-300/80 text-xs mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {event.location || '—'}
            </p>
          </div>

          {/* شبكة المعلومات */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 py-3 border-y border-slate-200 dark:border-purple-900/30 text-xs text-slate-600 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{formatDate(event.date_time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{categoryName || text.general}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{formatTimeRange(event.date_time, eventEndTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                {ticketTypes.reduce((sum, tt) => sum + Number(tt.capacity || 0), 0)} {text.capacity}
              </span>
            </div>
          </div>

          {/* وصف الفعالية */}
          {stripEndTimeMarker(event.description) && (
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{text.aboutEvent}</h3>
              <p className="text-xs text-slate-600 dark:text-purple-200/70 leading-relaxed">
                {stripEndTimeMarker(event.description)}
              </p>
            </div>
          )}

          {/* قسم الفنانين */}
          {speakers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{text.theArtists}</h3>
              <div className="flex flex-wrap gap-6 pt-1">
                {speakers.map((sp) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={sp.id} 
                    className="flex flex-col items-center text-center space-y-1.5 w-20 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-300 dark:border-purple-500/40 shadow-md bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center">
                      {sp.image_url ? (
                        <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">{sp.name?.charAt(0)}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-900 dark:text-white line-clamp-1">{sp.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* كروت التذاكر وأزرار التحكم */}
          {ticketTypes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{text.tickets}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticketTypes.map((tt) => {
                  const soldOut = Number(tt.available_tickets) <= 0;
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      key={tt.id} 
                      className="bg-slate-50 dark:bg-[#180e28] border border-slate-200 dark:border-purple-900/50 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">{tt.ticket_name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-purple-300/60">
                          {soldOut ? text.soldOut : `${tt.available_tickets} ${text.available}`}
                        </p>
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 pt-1">
                          {Number(tt.price) === 0 ? text.free : `$${tt.price}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-white dark:bg-[#0b0712] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-purple-500/20 shadow-sm">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          disabled={soldOut || isPast}
                          onClick={() => handleQtyChange(tt.id, -1, tt.available_tickets)}
                          className="p-1 text-slate-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">
                          {quantities[tt.id] || 0}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          disabled={soldOut || isPast}
                          onClick={() => handleQtyChange(tt.id, 1, tt.available_tickets)}
                          className="p-1 text-slate-700 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {bookingError && <p className="text-xs text-rose-500">{bookingError}</p>}
            </div>
          )}

          {/* أزرار التواصل والحجز السفلية */}
          <div className="pt-4 border-t border-slate-200 dark:border-purple-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            {event.organizer_name ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowContactModal(true)}
                className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-200 rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-500/30 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" /> {text.contact}
              </motion.button>
            ) : <div />}

            {isPast ? (
              <div className="w-full sm:w-auto bg-slate-100 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-900/50 text-slate-500 dark:text-purple-300/70 font-bold py-2.5 px-8 rounded-xl flex items-center justify-center gap-2 text-xs">
                <Ticket className="w-4 h-4" /> {text.eventEnded}
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetTicket}
                disabled={booking || ticketTypes.length === 0}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 px-8 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Ticket className="w-4 h-4" /> {booking ? text.booking : text.getTicket} {totalPrice > 0 ? `($${totalPrice})` : ''}
              </motion.button>
            )}
          </div>

        </div>
      </div>

      {/* نافذة التواصل مع المنظم */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative"
            >
              <button onClick={() => setShowContactModal(false)} className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} text-slate-500 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg`}>
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-purple-900/30 pb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30 rounded-2xl text-purple-600 dark:text-purple-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{text.contactOrganizer}</h3>
                  <p className="text-xs text-slate-500 dark:text-purple-300/60">{event.organizer_name}</p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-700 dark:text-purple-300 block mb-1 font-semibold">{text.yourMessage}</label>
                  <textarea
                    rows="4"
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={text.messagePlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" /> {text.openEmail}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}