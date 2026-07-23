import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Music,
  Users,
  Ticket,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare,
  X,
  Send,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const allEventsData = {
  '1': {
    id: '1',
    title: 'Summer Music Festival 2026',
    category: 'Music',
    attendees: '950 going',
    date: '10 Aug 2026',
    time: '05:00 PM - 12:00 AM',
    location: 'Duhok, Family Screen Park',
    description: 'Experience an unforgettable night of live music featuring top artists, amazing performances, and an energetic atmosphere.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
    organizer: { name: 'Evently Studio', email: 'contact@eventlystudio.com', verified: true },
    artists: [
      { name: 'Rojda', role: 'Vocalist', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
      { name: 'Bilind Ibrahim', role: 'Singer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' }
    ],
    tickets: {
      earlyBird: { name: 'Early Bird (VIP)', price: 40, desc: 'Front row access', type: 'VIP PASS' },
      regular: { name: 'Regular', price: 25, desc: 'Standard Access', type: 'STANDARD' }
    }
  },
  '2': {
    id: '2',
    title: 'AI & Future Tech Conf',
    category: 'Technology',
    attendees: '2,100 going',
    date: '05 Sep 2026',
    time: '09:00 AM - 04:00 PM',
    location: 'Erbil International Fair',
    description: 'Join leading experts in artificial intelligence and future technologies to explore innovations shaping our world.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    organizer: { name: 'Tech Vision Org', email: 'info@techvision.com', verified: true },
    artists: [
      { name: 'Dr. Rami', role: 'AI Researcher', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80' },
      { name: 'Sara Tech', role: 'Keynote Speaker', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80' }
    ],
    tickets: {
      earlyBird: { name: 'VIP Pass', price: 50, desc: 'front seating & workshops', type: 'VIP PASS' },
      regular: { name: 'Free Admission', price: 0, desc: 'Standard Access', type: 'FREE' }
    }
  },
  '3': {
    id: '3',
    title: 'Art & Design Expo',
    category: 'Art',
    attendees: '630 going',
    date: '18 Oct 2026',
    time: '10:00 AM - 08:00 PM',
    location: 'Duhok Cultural Center',
    description: 'Explore breathtaking modern art installations, creative designs, and meet visionary artists from around the region.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
    organizer: { name: 'Duhok Arts', email: 'art@duhok.com', verified: false },
    artists: [
      { name: 'Lara Craft', role: 'Painter', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&q=80' }
    ],
    tickets: {
      earlyBird: { name: 'All Access', price: 20, desc: 'Gallery + Workshop', type: 'VIP PASS' },
      regular: { name: 'Regular', price: 10, desc: 'Standard Entry', type: 'STANDARD' }
    }
  }
};

const t = {
  ar: {
    about: 'حول الفعالية:',
    artists: 'الفنانون المشاركون:',
    tickets: 'التذاكر',
    quantity: 'الكمية',
    verifiedOrganizer: 'منظم معتمد',
    contact: 'تواصل',
    date: 'التاريخ',
    time: 'الوقت',
    location: 'الموقع',
    price: 'السعر',
    getTicket: 'احصل على تذكرة',
    contactOrganizer: 'تواصل مع المنظم',
    messageSent: 'تم إرسال الرسالة!',
    successDesc: 'سيقوم المنظم بالرد عليك قريباً.',
    yourMessage: 'رسالتك',
    placeholderMsg: 'اطرح سؤالاً حول التذاكر، الموقع، أو الجدول...',
    sendMsg: 'إرسال الرسالة',
    copyLink: 'نسخ الرابط'
  },
  en: {
    about: 'About Event:',
    artists: 'The Artists:',
    tickets: 'Tickets',
    quantity: 'Quantity',
    verifiedOrganizer: 'Verified Organizer',
    contact: 'Contact',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    price: 'Price',
    getTicket: 'Get Ticket',
    contactOrganizer: 'Contact Organizer',
    messageSent: 'Message Sent!',
    successDesc: 'The organizer will get back to you shortly.',
    yourMessage: 'Your Message',
    placeholderMsg: 'Ask a question about tickets, location, or schedule...',
    sendMsg: 'Send Message',
    copyLink: 'Copy Link'
  }
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isRtl = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const text = isRtl ? t.ar : t.en;

  const currentEvent = allEventsData[id] || allEventsData['1'];

  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(false);

  const [ticketCounts, setTicketCounts] = useState({
    earlyBird: 1,
    regular: 1,
  });

  const totalPrice =
    ticketCounts.earlyBird * currentEvent.tickets.earlyBird.price +
    ticketCounts.regular * currentEvent.tickets.regular.price;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    const exist = saved.some((item) => String(item.id) === String(currentEvent.id));
    setIsSaved(exist);
  }, [currentEvent.id]);

  const toggleSave = () => {
    let saved = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    if (isSaved) {
      saved = saved.filter((item) => String(item.id) !== String(currentEvent.id));
    } else {
      saved.push({
        id: currentEvent.id,
        title: currentEvent.title,
        date: currentEvent.date,
        location: currentEvent.location,
        price: `$${totalPrice}`,
        image: currentEvent.image,
      });
    }
    localStorage.setItem('savedEvents', JSON.stringify(saved));
    setIsSaved(!isSaved);
  };

  const handleQtyChange = (type, delta) => {
    setTicketCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessageText('');
      setShowContactModal(false);
    }, 1500);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-4 md:p-8 font-sans space-y-6 max-w-6xl mx-auto transition-colors duration-200">
      {/* Header & Banner */}
      <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden border border-slate-200 dark:border-purple-900/30 shadow-2xl">
        <img
          src={currentEvent.image}
          alt={currentEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b0712] via-transparent to-black/40" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white transition cursor-pointer"
          >
            <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              title={text.copyLink}
              className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white transition cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={toggleSave}
              className={`p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-xl transition cursor-pointer ${
                isSaved ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 dark:text-white">
              {currentEvent.title}
            </h1>
            <p className="text-purple-600 dark:text-purple-300 text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500 dark:text-purple-400" /> {currentEvent.location}
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-slate-600 dark:text-purple-200/80 pt-3 border-t border-slate-200 dark:border-purple-900/30">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" /> {currentEvent.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" /> {currentEvent.time}
              </span>
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-purple-500 dark:text-purple-400" /> {currentEvent.category}
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                <Users className="w-4 h-4" /> {currentEvent.attendees}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{text.about}</h3>
            <p className="text-sm text-slate-600 dark:text-purple-200/70 leading-relaxed">
              {currentEvent.description}
            </p>
          </div>

          {/* Artists Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{text.artists}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentEvent.artists.map((artist, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-purple-400 dark:hover:border-purple-500/50 transition group shadow-sm dark:shadow-none"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-400 dark:border-purple-500/40 shadow-md">
                    <img
                      src={artist.img}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {artist.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-purple-300/60 block">
                      {artist.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{text.tickets}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Early Bird / VIP */}
              <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 mb-1 inline-block">
                      {currentEvent.tickets.earlyBird.type}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {currentEvent.tickets.earlyBird.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-purple-300/60">
                      {currentEvent.tickets.earlyBird.desc}
                    </p>
                  </div>
                  <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                    ${currentEvent.tickets.earlyBird.price}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-purple-900/20">
                  <span className="text-xs text-slate-500 dark:text-purple-300/60">{text.quantity}</span>
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-purple-950/60 px-2 py-1 rounded-xl border border-slate-200 dark:border-purple-500/20">
                    <button
                      onClick={() => handleQtyChange('earlyBird', -1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer text-slate-700 dark:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-white">
                      {ticketCounts.earlyBird}
                    </span>
                    <button
                      onClick={() => handleQtyChange('earlyBird', 1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer text-slate-700 dark:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Regular / Standard */}
              <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm dark:shadow-none">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600/30 mb-1 inline-block">
                      {currentEvent.tickets.regular.type}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {currentEvent.tickets.regular.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-purple-300/60">
                      {currentEvent.tickets.regular.desc}
                    </p>
                  </div>
                  <span className="text-base font-bold text-purple-600 dark:text-purple-400">
                    ${currentEvent.tickets.regular.price}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-purple-900/20">
                  <span className="text-xs text-slate-500 dark:text-purple-300/60">{text.quantity}</span>
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-purple-950/60 px-2 py-1 rounded-xl border border-slate-200 dark:border-purple-500/20">
                    <button
                      onClick={() => handleQtyChange('regular', -1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer text-slate-700 dark:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center text-slate-800 dark:text-white">
                      {ticketCounts.regular}
                    </span>
                    <button
                      onClick={() => handleQtyChange('regular', 1)}
                      className="p-1 hover:text-purple-600 dark:hover:text-purple-400 transition cursor-pointer text-slate-700 dark:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 p-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold">
                {currentEvent.organizer.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {currentEvent.organizer.name}
                  {currentEvent.organizer.verified && (
                    <CheckCircle2 className="w-4 h-4 text-purple-500 dark:text-purple-400 fill-purple-200 dark:fill-purple-400/20" />
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-purple-300/60">{text.verifiedOrganizer}</p>
              </div>
            </div>

            <button
              onClick={() => setShowContactModal(true)}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-700 dark:text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-300 dark:border-purple-500/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> {text.contact}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 p-6 rounded-3xl space-y-6 sticky top-6 shadow-lg dark:shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-purple-300/60 font-bold uppercase tracking-wider">
                    {text.date}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentEvent.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-purple-300/60 font-bold uppercase tracking-wider">
                    {text.time}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentEvent.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-purple-300/60 font-bold uppercase tracking-wider">
                    {text.location}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentEvent.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-purple-900/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-purple-300/60 font-bold uppercase">
                  {text.price}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${totalPrice}
                </p>
              </div>

              <button
                onClick={() => navigate('/tickets')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-2xl transition shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 flex items-center gap-2 text-sm cursor-pointer"
              >
                <Ticket className="w-4 h-4" /> {text.getTicket}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Organizer Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-400 dark:text-purple-300 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-purple-900/30 pb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/30 rounded-2xl text-purple-600 dark:text-purple-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{text.contactOrganizer}</h3>
                <p className="text-xs text-slate-500 dark:text-purple-300/60">{currentEvent.organizer.name}</p>
              </div>
            </div>

            {isSent ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 border border-green-400 dark:border-green-500/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{text.messageSent}</h4>
                <p className="text-xs text-slate-500 dark:text-purple-300/60">{text.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-xs text-purple-700 dark:text-purple-300 block mb-1 font-semibold">
                    {text.yourMessage}
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={text.placeholderMsg}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> {text.sendMsg}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}