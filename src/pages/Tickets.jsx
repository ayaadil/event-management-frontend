// src/pages/Tickets.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, MapPin, X, ArrowRight, Download, Calendar, CalendarX, Sparkles, CreditCard, Ban } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { formatDate, formatDateBadge } from '../utils/format';

const translations = {
  English: {
    pageTitle: 'My Tickets', pageSubtitle: 'Manage and view your passes for upcoming events',
    upcoming: 'Upcoming', past: 'Past', cancelled: 'Cancelled',
    ticketIdText: 'BOOKING ID', seatText: 'QUANTITY', viewDetails: 'View Details',
    noTicketsTitle: 'No Tickets Found', noTicketsDesc: "You don't have any tickets in this category right now.",
    noCancelledTitle: 'No Cancelled Tickets', noCancelledDesc: "You don't have any cancelled tickets right now.",
    exploreEvents: 'Explore Events', scanCode: 'Scan code at entrance gate',
    saveTicket: 'Save Ticket', locationText: 'Location', dateText: 'Date',
    admitOne: 'OFFICIAL ENTRY PASS', qrModalTitle: 'DIGITAL ACCESS PASS', close: 'Close',
    payNow: 'Pay Now', paying: 'Paying...', cancelBooking: 'Cancel Booking',
    canceling: 'Canceling...', pending: 'Payment pending', confirmed: 'Confirmed', passed: 'Passed', loading: 'Loading...',
    totalPrice: 'Total Price',
  },
  'العربية (Arabic)': {
    pageTitle: 'تذاكري', pageSubtitle: 'إدارة وعرض تذاكرك للفعاليات القادمة',
    upcoming: 'القادمة', past: 'السابقة', cancelled: 'الملغاة',
    ticketIdText: 'رقم الحجز', seatText: 'الكمية', viewDetails: 'عرض التفاصيل',
    noTicketsTitle: 'لا توجد تذاكر في قسم', noTicketsDesc: 'ليس لديك أي تذاكر في هذه الفئة حالياً.',
    noCancelledTitle: 'لا توجد تذاكر ملغاة', noCancelledDesc: 'ليس لديك أي تذاكر ملغاة في الوقت الحالي.',
    exploreEvents: 'استكشاف الفعاليات', scanCode: 'امسح الرمز عند بوابة الدخول',
    saveTicket: 'حفظ التذكرة', locationText: 'الموقع', dateText: 'التاريخ',
    admitOne: 'تذكرة دخول رسمية', qrModalTitle: 'تصريح الدخول الرقمي', close: 'إغلاق',
    payNow: 'ادفع الآن', paying: 'جارٍ الدفع...', cancelBooking: 'إلغاء الحجز',
    canceling: 'جارٍ الإلغاء...', pending: 'بانتظار الدفع', confirmed: 'مؤكدة', passed: 'Passed', loading: 'جارٍ التحميل...',
    totalPrice: 'السعر الإجمالي',
  },
  'Kurdish (کوردی)': {
    pageTitle: 'تیکتەکانم', pageSubtitle: 'ڕێکخستن و پیشاندانی تیکتەکانت بۆ بۆنە داهاتووەکان',
    upcoming: 'داهاتوو', past: 'ڕابردوو', cancelled: 'هەڵوەشاوە',
    ticketIdText: 'ژمارەی فەرمان', seatText: 'چەندایەتی', viewDetails: 'بینینی وردەکاری',
    noTicketsTitle: 'هیچ تیکتێک نەدۆزرایەوە', noTicketsDesc: 'لە ئێستادا هیچ تیکتێکت لەم بەشەدا نییە.',
    noCancelledTitle: 'هیچ تیکتێکی هەڵوەشاوە نییە', noCancelledDesc: 'لە ئێستادا هیچ تیکتێکی هەڵوەشاوت نییە.',
    exploreEvents: 'گەڕان بەدوای بۆنەکاندا', scanCode: 'کۆدەکە لە دەروازەی چوونەژوورەوە سکان بکە',
    saveTicket: 'پاشەکەوتکردنی تیکت', locationText: 'شوێن', dateText: 'بەڕێوەچوون',
    admitOne: 'تیکتی فەرمی چوونەژوورەوە', qrModalTitle: 'مۆڵەتی چوونەژوورەوەی ڕێژەیی', close: 'داخستن',
    payNow: 'پارەدان ئێستا', paying: 'پارەدان...', cancelBooking: 'هەڵوەشاندنەوەی فەرمان',
    canceling: 'هەڵوەشاندنەوە...', pending: 'چاوەڕوانی پارەدان', confirmed: 'پەسەندکراو', passed: 'Passed', loading: 'بارکردن...',
    totalPrice: 'کۆی گشتی نرخ',
  },
};

export default function Tickets() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const currentLangKey = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku'
    ? 'Kurdish (کوردی)'
    : language?.includes('Arabic') || language?.includes('العربية') || language === 'ar'
    ? 'العربية (Arabic)'
    : 'English';

  const text = translations[currentLangKey] || translations['English'];
  const isRtl = currentLangKey === 'العربية (Arabic)' || currentLangKey === 'Kurdish (کوردی)';

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrTicket, setQrTicket] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const myBookings = await api.getMyBookings();
      const uniqueEventIds = [...new Set(myBookings.map((b) => b.event_id))];
      const eventsById = {};
      await Promise.all(
        uniqueEventIds.map((eid) =>
          api.getEventById(eid).then((ev) => { eventsById[eid] = ev; }).catch(() => {})
        )
      );
      setBookings(myBookings.map((b) => ({ ...b, event: eventsById[b.event_id] || null })));
    } catch (err) {
      console.error('Failed to load bookings', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const now = Date.now();
  const isPast = (b) => b.event?.date_time && new Date(b.event.date_time).getTime() < now;

  const filteredTickets = bookings.filter((b) => {
    if (activeTab === 'Cancelled') return b.status === 'cancelled';
    if (b.status === 'cancelled') return false;
    return activeTab === 'Past' ? isPast(b) : !isPast(b);
  });

  const tabsList = [
    { key: 'Upcoming', label: text.upcoming },
    { key: 'Past', label: text.past },
    { key: 'Cancelled', label: text.cancelled },
  ];

  const handlePayNow = async (booking) => {
    setPayingId(booking.id);
    try {
      await api.createPayment({
        booking_id: booking.id,
        payment_method: 'cash',
        transaction_ref: `TXN-${Date.now()}-${booking.id}`,
      });
      await loadBookings();
    } catch (err) {
      console.error('Payment failed', err);
    } finally {
      setPayingId(null);
    }
  };

  const handleCancel = async (booking) => {
    setCancelingId(booking.id);
    try {
      await api.cancelBooking(booking.id);
      await loadBookings();
      setSelectedTicket(null);
    } catch (err) {
      console.error('Cancel failed', err);
    } finally {
      setCancelingId(null);
    }
  };

  const openQr = async (booking) => {
    setQrTicket(booking);
    setQrCode(null);
    try {
      const data = await api.getBookingQRCode(booking.id);
      setQrCode(data.qrCode);
    } catch (err) {
      console.error('Failed to load QR code', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-8 transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white"
          >
            {text.pageTitle}
          </motion.h1>
          <p className="text-purple-600 dark:text-purple-400">{text.pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#150a21] p-1.5 rounded-2xl border border-slate-200 dark:border-purple-900/30 w-fit shadow-sm dark:shadow-none">
          {tabsList.map((tab) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50'
                  : 'text-slate-600 dark:text-purple-300/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm animate-pulse">{text.loading}</div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTickets.map((booking) => {
            const ev = booking.event || {};
            const dateBadge = formatDateBadge(ev.date_time);
            const ticketIsPast = isPast(booking);

            return (
              <motion.div 
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                key={booking.id} 
                className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 shadow-md dark:shadow-xl group"
              >
                <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden shrink-0">
                  <img
                    src={ev.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'}
                    alt={booking.event_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-purple-100 dark:bg-purple-950/80 backdrop-blur-md text-purple-700 dark:text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30`}>
                    {dateBadge.day} {dateBadge.month}
                  </div>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* عرض حالة التذكرة بحيث تعرض Passed إذا كانت منتهية */}
                    <div>
                      <span className={`text-[10px] tracking-wider font-bold px-2.5 py-1 rounded-md border inline-block ${
                        booking.status === 'pending'
                          ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/25'
                          : booking.status === 'cancelled'
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/25'
                          : ticketIsPast
                          ? 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40'
                          : 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/25'
                      }`}>
                        {booking.ticket_name} · {
                          booking.status === 'pending' 
                            ? text.pending 
                            : booking.status === 'cancelled' 
                            ? text.cancelled 
                            : ticketIsPast 
                            ? text.passed 
                            : text.confirmed
                        }
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition line-clamp-1">
                      {booking.event_title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      {ev.location || '—'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#1f0d33]/60 p-3 rounded-xl border border-slate-200 dark:border-purple-900/20 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{text.ticketIdText}</span>
                      <span className="font-mono text-purple-700 dark:text-purple-200 font-semibold">#{booking.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{text.seatText}</span>
                      <span className="font-mono text-purple-700 dark:text-purple-200 font-semibold">{booking.quantity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTicket(booking)}
                      className="flex-1 bg-purple-50 dark:bg-purple-600/30 hover:bg-purple-600 text-purple-700 dark:text-purple-200 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-500/30 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {text.viewDetails}
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </motion.button>

                    {booking.status === 'pending' ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayNow(booking)}
                        disabled={payingId === booking.id}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-60 p-2.5 rounded-xl text-white transition duration-300 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold px-3 shadow-sm"
                        title={text.payNow}
                      >
                        <CreditCard className="w-4 h-4" /> {payingId === booking.id ? text.paying : text.payNow}
                      </motion.button>
                    ) : !ticketIsPast ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openQr(booking)}
                        className="bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-600 border border-purple-200 dark:border-purple-500/40 p-2.5 rounded-xl text-purple-700 dark:text-purple-300 hover:text-white transition duration-300 cursor-pointer flex items-center justify-center shadow-sm dark:shadow-lg"
                        title="QR Code"
                      >
                        <QrCode className="w-5 h-5" />
                      </motion.button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#150a21]/60 border border-slate-200 dark:border-purple-900/30 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12 shadow-xl dark:shadow-2xl"
        >
          <div className="p-4 bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl w-fit mx-auto text-purple-600 dark:text-purple-400">
            <CalendarX className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeTab === 'Cancelled' ? text.noCancelledTitle : text.noTicketsTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-purple-300/60 leading-relaxed">
              {activeTab === 'Cancelled' ? text.noCancelledDesc : text.noTicketsDesc}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/explore')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            {text.exploreEvents}
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </motion.button>
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-md w-full my-8"
            >
              <button onClick={() => setSelectedTicket(null)} className="absolute -top-12 right-0 bg-white dark:bg-purple-950/80 hover:bg-slate-100 dark:hover:bg-purple-900 text-slate-900 dark:text-white p-2.5 rounded-full border border-slate-200 dark:border-purple-500/30 backdrop-blur-md transition cursor-pointer z-10 shadow-lg">
                <X className="w-5 h-5" />
              </button>

              <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative h-44 w-full">
                  <img
                    src={selectedTicket.event?.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'}
                    alt={selectedTicket.event_title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="bg-white/90 dark:bg-purple-950/80 backdrop-blur-md text-purple-700 dark:text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30 uppercase tracking-widest shadow-sm">
                      {text.admitOne}
                    </span>
                    <span className="bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {selectedTicket.ticket_name}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-wide">
                      {selectedTicket.event_title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#12071c] p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40 text-xs">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block">{text.locationText}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{selectedTicket.event?.location || '—'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block">{text.dateText}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatDate(selectedTicket.event?.date_time)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#12071c] p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase">{text.ticketIdText}</span>
                      <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-sm">#{selectedTicket.id}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase">{text.totalPrice}</span>
                      <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-sm">${selectedTicket.total_price}</span>
                    </div>
                  </div>

                  {selectedTicket.status === 'confirmed' && !isPast(selectedTicket) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { openQr(selectedTicket); setSelectedTicket(null); }}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> {text.saveTicket}
                    </motion.button>
                  )}

                  {selectedTicket.status !== 'cancelled' && !isPast(selectedTicket) && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancel(selectedTicket)}
                      disabled={cancelingId === selectedTicket.id}
                      className="w-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 disabled:opacity-60 text-rose-600 dark:text-rose-300 hover:text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs border border-rose-200 dark:border-rose-500/30 cursor-pointer"
                    >
                      <Ban className="w-4 h-4" /> {cancelingId === selectedTicket.id ? text.canceling : text.cancelBooking}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrTicket && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-sm w-full"
            >
              <button onClick={() => setQrTicket(null)} className="absolute -top-12 right-0 bg-white dark:bg-purple-950/80 hover:bg-slate-100 dark:hover:bg-purple-900 text-slate-900 dark:text-white p-2.5 rounded-full border border-slate-200 dark:border-purple-500/30 backdrop-blur-md transition cursor-pointer z-10 shadow-lg">
                <X className="w-5 h-5" />
              </button>

              <div className="bg-white dark:bg-[#140822] border border-slate-200 dark:border-purple-500/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold tracking-wider uppercase mb-1">
                    <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    {text.qrModalTitle}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white line-clamp-1">
                    {qrTicket.event_title}
                  </h3>
                </div>

                <div className="relative z-10 bg-slate-50 dark:bg-[#12071c] p-5 rounded-2xl border border-slate-200 dark:border-purple-500/30 inline-block shadow-inner min-h-[176px] flex items-center justify-center">
                  {qrCode ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-[#12071c] p-2.5 rounded-xl border border-slate-200 dark:border-purple-500/20 shadow-md inline-block"
                    >
                      <img src={qrCode} alt="Ticket QR Code" className="w-36 h-36 mx-auto rounded-lg" />
                    </motion.div>
                  ) : (
                    <p className="text-xs text-purple-300/60 animate-pulse">{text.loading}</p>
                  )}
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#12071c]/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-purple-900/50 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase font-mono">{text.ticketIdText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-xs tracking-wider">#{qrTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase font-mono">{text.seatText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-xs tracking-wider">{qrTicket.quantity}</span>
                  </div>
                </div>

                <p className="relative z-10 text-[11px] text-slate-600 dark:text-purple-300/70 tracking-wide font-medium">
                  {text.scanCode}
                </p>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQrTicket(null)} 
                  className="relative z-10 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition text-xs shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50 cursor-pointer"
                >
                  {text.close}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}