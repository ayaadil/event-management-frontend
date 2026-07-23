import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, MapPin, X, ArrowRight, Download, Calendar, CalendarX, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const t = {
  ar: {
    pageTitle: 'تذاكري',
    pageSubtitle: 'إدارة وعرض تذاكرك للفعاليات القادمة',
    upcoming: 'القادمة',
    past: 'السابقة',
    cancelled: 'الملغاة',
    ticketIdText: 'رقم التذكرة',
    seatText: 'المقعد',
    viewDetails: 'عرض التفاصيل',
    noTicketsTitle: 'لا توجد تذاكر في قسم',
    noTicketsDesc: 'ليس لديك أي تذاكر في هذه الفئة حالياً.',
    noCancelledTitle: 'لا توجد تذاكر ملغاة',
    noCancelledDesc: 'ليس لديك أي تذاكر ملغاة في الوقت الحالي.',
    exploreEvents: 'استكشاف الفعاليات',
    scanCode: 'امسح الرمز عند بوابة الدخول',
    seat: 'المقعد',
    saveTicket: 'حفظ التذكرة',
    locationText: 'الموقع',
    dateText: 'التاريخ',
    admitOne: 'تذكرة دخول رسمية',
    qrModalTitle: 'تصريح الدخول الرقمي',
    close: 'إغلاق',
  },
  ku: {
    pageTitle: 'پەتکەکانی من',
    pageSubtitle: 'بەڕێوەبردن و بینینی پەڕەکانی خۆت بۆ چالاکییە داهاتووەکان',
    upcoming: 'داهاتوو',
    past: 'ڕابردوو',
    cancelled: 'هەڵوەشاوە',
    ticketIdText: 'ژمارەی پەڕە',
    seatText: 'شوێنشتن',
    viewDetails: 'بینینی وردەکاری',
    noTicketsTitle: 'هیچ پەڕەیەک نەدۆزرایەوە لە',
    noTicketsDesc: 'لە ئێستادا هیچ پەڕەیەکت لەم بەشەدا نییە.',
    noCancelledTitle: 'هیچ پەڕەیەکی هەڵوەشاوە نییە',
    noCancelledDesc: 'لە ئێستادا هیچ پەڕەیەکی هەڵوەشاوەت نییە.',
    exploreEvents: 'گەڕان بەدوای چالاکییەکان',
    scanCode: 'ئەم کۆدە لە دەروازەی چوونەژوورەوە سکان بکە',
    seat: 'شوێنشتن',
    saveTicket: 'پاشەکەوتکردنی پەڕە',
    locationText: 'شوێن',
    dateText: 'بەڕۆژ',
    admitOne: 'پەڕەی چوونەژوورەوەی فەرمی',
    qrModalTitle: 'مۆڵەتی چوونەژوورەوەی دیجیتاڵی',
    close: 'داخستن',
  },
  en: {
    pageTitle: 'My Tickets',
    pageSubtitle: 'Manage and view your passes for upcoming events',
    upcoming: 'Upcoming',
    past: 'Past',
    cancelled: 'Cancelled',
    ticketIdText: 'TICKET ID',
    seatText: 'SEAT',
    viewDetails: 'View Details',
    noTicketsTitle: 'No Tickets Found',
    noTicketsDesc: "You don't have any tickets in this category right now.",
    noCancelledTitle: 'No Cancelled Tickets',
    noCancelledDesc: "You don't have any cancelled tickets right now.",
    exploreEvents: 'Explore Events',
    scanCode: 'Scan code at entrance gate',
    seat: 'Seat',
    saveTicket: 'Save Ticket',
    locationText: 'Location',
    dateText: 'Date',
    admitOne: 'OFFICIAL ENTRY PASS',
    qrModalTitle: 'DIGITAL ACCESS PASS',
    close: 'Close',
  }
};

export default function Tickets() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [qrTicket, setQrTicket] = useState(null);

  const ticketsData = [
    {
      id: 'VENT23-8F7X',
      eventId: 1,
      title: { ar: 'أمسية الموسيقى الحية 2026', ku: 'شەوی مۆسیقای ڕاستەوخۆ ٢٠٢٦', en: 'Live Music Night 2026' },
      location: { ar: 'دهوك، حدائق باكو بابلو', ku: 'دهۆک، باخچەکانی پاکۆ پابلۆ', en: 'Duhok, pako pablo gardens' },
      date: '24 MAY',
      seat: 'B12',
      type: 'VIP PASS',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
      status: 'Upcoming',
      description: {
        ar: 'أمسية موسيقية استثنائية تضم عروضاً حية لأشهر الفنانين وسط أجواء ساحرة في حدائق باكو بابلو.',
        ku: 'شەوێکی مۆسیقایی تایبەت کە پێشکەشکردنی ڕاستەوخۆی تیایدایە لە باخچەکانی پاکۆ پابلۆ.',
        en: 'An exceptional musical evening featuring live performances by top artists in the enchanting atmosphere of Pako Pablo Gardens.'
      }
    },
    {
      id: 'VENT23-9K2L',
      eventId: 2,
      title: { ar: 'مهرجان الرياضة', ku: 'فێستیڤاڵی وەرزشی', en: 'Sports Festival' },
      location: { ar: 'دهوك، ملعب دهوك', ku: 'دهۆک، یاریگای دهۆک', en: 'Duhok, Duhok Stadium' },
      date: '25 JUN',
      seat: 'A04',
      type: 'GENERAL',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
      status: 'Upcoming',
      description: {
        ar: 'مهرجان رياضي حماسي يجمع عشاق الرياضة والمسابقات الحية في ملعب دهوك.',
        ku: 'فێستیڤاڵێکی وەرزشی پڕ لە خرۆش بۆ خۆشەویستانی وەرزش لە یاریگای دهۆک.',
        en: 'An energetic sports festival bringing together sports enthusiasts and live competitions at Duhok Stadium.'
      }
    },
    {
      id: 'VENT23-3M4P',
      eventId: 3,
      title: { ar: 'عالم التكنولوجيا 2026', ku: 'جیهانی تەکنەلۆژیا ٢٠٢٦', en: 'Tech World 2026' },
      location: { ar: 'أربيل، ملتقى الشباب', ku: 'هەولێر، یۆس هاب', en: 'Erbil, Youth Hub' },
      date: '09 JUL',
      seat: 'C15',
      type: 'STANDARD',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      status: 'Upcoming',
      description: {
        ar: 'معرض ومؤتمر يبرز أحدثابتكارات التكنولوجيا والذكاء الاصطناعي بمشاركة أبرز الخبراء والمبرمجين.',
        ku: 'پێشانگا و کۆنگرەیەک کە نوێترین داهێنانی تەکنەلۆژیا و ژیری دەستکرد دەخاتە ڕوو.',
        en: 'An exhibition and conference highlighting the latest innovations in technology and AI with leading experts.'
      }
    },
    {
      id: 'VENT23-1Z8Q',
      eventId: 4,
      title: { ar: 'مهرجان الرسم 2026', ku: 'فێستیڤاڵی وێنەکێشان ٢٠٢٦', en: 'Drawing Festival 2026' },
      location: { ar: 'دهوك، بارك نوروز', ku: 'دهۆک، پارکی نەورۆز', en: 'Duhok, Parka Nawroz' },
      date: '05 JUL',
      seat: 'B02',
      type: 'STANDARD',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
      status: 'Upcoming',
      description: {
        ar: 'احتفالية فنية تجمع الرسامين والمبدعين لعرض لوحاتهم الفنية في بارك نوروز.',
        ku: 'ئاهەنگێکی هونەری کە وێنەکێشان و داهێنەران کۆدەکاتەوە بۆ پیشاندانی تابلۆکانیان لە پارکی نەورۆز.',
        en: 'An artistic celebration gathering painters and creators to showcase their artworks at Parka Nawroz.'
      }
    },
  ];

  const filteredTickets = ticketsData.filter((t) => t.status === activeTab);

  const tabsList = [
    { key: 'Upcoming', label: text.upcoming },
    { key: 'Past', label: text.past },
    { key: 'Cancelled', label: text.cancelled },
  ];

  const getLocalizedField = (fieldObj) => {
    if (isArabic) return fieldObj.ar;
    if (isKurdish) return fieldObj.ku;
    return fieldObj.en;
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">{text.pageTitle}</h1>
          <p className="text-slate-600 dark:text-purple-300/60 text-xs md:text-sm mt-1">
            {text.pageSubtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#150a21] p-1.5 rounded-2xl border border-slate-200 dark:border-purple-900/30 w-fit shadow-sm dark:shadow-none">
          {tabsList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50'
                  : 'text-slate-600 dark:text-purple-300/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State Message */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-300 shadow-md dark:shadow-xl group"
            >
              <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                <img
                  src={ticket.image}
                  alt={getLocalizedField(ticket.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} bg-purple-100 dark:bg-purple-950/80 backdrop-blur-md text-purple-700 dark:text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30`}>
                  {ticket.date}
                </div>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-wider font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-500/20 inline-block">
                    {ticket.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition line-clamp-1">
                    {getLocalizedField(ticket.title)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    {getLocalizedField(ticket.location)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#1f0d33]/60 p-3 rounded-xl border border-slate-200 dark:border-purple-900/20 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{text.ticketIdText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-semibold">{ticket.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{text.seatText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-semibold">{ticket.seat}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    className="flex-1 bg-purple-50 dark:bg-purple-600/30 hover:bg-purple-600 text-purple-700 dark:text-purple-200 hover:text-white text-xs font-semibold py-2.5 px-3 rounded-xl border border-purple-200 dark:border-purple-500/30 transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {text.viewDetails}
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => setQrTicket(ticket)}
                    className="bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-600 border border-purple-200 dark:border-purple-500/40 p-2.5 rounded-xl text-purple-700 dark:text-purple-300 hover:text-white transition duration-300 cursor-pointer flex items-center justify-center shadow-sm dark:shadow-lg"
                    title="QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#150a21]/60 border border-slate-200 dark:border-purple-900/30 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12 shadow-xl dark:shadow-2xl">
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
          <button
            onClick={() => navigate('/explore')}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer inline-flex items-center gap-2 mt-2"
          >
            {text.exploreEvents}
            <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* 1. نافذة عرض التفاصيل الكاملة */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="relative max-w-md w-full animate-in fade-in zoom-in duration-300 my-8">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-12 right-0 bg-white dark:bg-purple-950/80 hover:bg-slate-100 dark:hover:bg-purple-900 text-slate-900 dark:text-white p-2.5 rounded-full border border-slate-200 dark:border-purple-500/30 backdrop-blur-md transition cursor-pointer z-10 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-white dark:bg-gradient-to-b dark:from-[#1c0f2e] dark:via-[#150a21] dark:to-[#0f0619] border border-slate-200 dark:border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-44 w-full">
                <img
                  src={selectedTicket.image}
                  alt={getLocalizedField(selectedTicket.title)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="bg-white/90 dark:bg-purple-950/80 backdrop-blur-md text-purple-700 dark:text-purple-300 text-[10px] font-bold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30 uppercase tracking-widest shadow-sm">
                    {text.admitOne}
                  </span>
                  <span className="bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {selectedTicket.type}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white tracking-wide">
                    {getLocalizedField(selectedTicket.title)}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">
                    {getLocalizedField(selectedTicket.description)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#12071c] p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40 text-xs">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block">{text.locationText}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{getLocalizedField(selectedTicket.location)}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block">{text.dateText}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{selectedTicket.date}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#12071c] p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase">{text.ticketIdText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-sm">{selectedTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase">{text.seatText}</span>
                    <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-sm">{selectedTicket.seat}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> {text.saveTicket}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. نافذة الـ QR Code الفاخرة والمستقلة */}
      {qrTicket && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="relative max-w-sm w-full animate-in fade-in zoom-in duration-300">
            
            {/* زر الإغلاق العلوي */}
            <button
              onClick={() => setQrTicket(null)}
              className="absolute -top-12 right-0 bg-white dark:bg-purple-950/80 hover:bg-slate-100 dark:hover:bg-purple-900 text-slate-900 dark:text-white p-2.5 rounded-full border border-slate-200 dark:border-purple-500/30 backdrop-blur-md transition cursor-pointer z-10 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* البطاقة الفاخرة للـ QR */}
            <div className="bg-white dark:bg-gradient-to-b dark:from-[#1e1035] dark:via-[#140822] dark:to-[#0c0414] border border-slate-200 dark:border-purple-500/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl dark:shadow-[0_0_50px_rgba(147,51,234,0.2)] relative overflow-hidden">
              
              {/* تأثيرات جمالية مضيئة في الخلفية */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-2xl"></div>

              {/* العنوان والأيقونة */}
              <div className="relative z-10 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  {text.qrModalTitle}
                </div>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white line-clamp-1">
                  {getLocalizedField(qrTicket.title)}
                </h3>
              </div>

              {/* حاوية الـ QR الراقية (بتصميم متناسق تماماً مع الموقع بدون خلفية بيضاء مزعجة) */}
              <div className="relative z-10 bg-slate-50 dark:bg-gradient-to-b dark:from-[#1a0c29] dark:to-[#12071c] p-5 rounded-2xl border border-slate-200 dark:border-purple-500/30 inline-block shadow-inner">
                <div className="bg-white dark:bg-[#12071c] p-2.5 rounded-xl border border-slate-200 dark:border-purple-500/20 shadow-md inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrTicket.id}&color=7c3aed&bgcolor=ffffff`}
                    alt="Ticket QR Code"
                    className="w-36 h-36 mx-auto rounded-lg dark:hidden"
                  />
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrTicket.id}&color=e9d5ff&bgcolor=12071c`}
                    alt="Ticket QR Code"
                    className="w-36 h-36 mx-auto rounded-lg hidden dark:block"
                  />
                </div>
              </div>

              {/* رقم التذكرة والمقعد بشكل أنيق */}
              <div className="relative z-10 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#12071c]/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-purple-900/50 text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase font-mono">{text.ticketIdText}</span>
                  <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-xs tracking-wider">{qrTicket.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 dark:text-purple-400/70 block uppercase font-mono">{text.seatText}</span>
                  <span className="font-mono text-purple-700 dark:text-purple-200 font-bold text-xs tracking-wider">{qrTicket.seat}</span>
                </div>
              </div>

              <p className="relative z-10 text-[11px] text-slate-600 dark:text-purple-300/70 tracking-wide font-medium">
                {text.scanCode}
              </p>

              <button
                onClick={() => setQrTicket(null)}
                className="relative z-10 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition text-xs shadow-lg shadow-purple-600/20 dark:shadow-purple-900/50 cursor-pointer"
              >
                {text.close}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}