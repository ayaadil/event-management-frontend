// src/pages/MyEvents.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Edit3, Trash2, Plus, X, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { api } from '../services/api';
import { formatDate, encodeEndTime, extractEndTime, stripEndTimeMarker, toLocalDateTimeInputValue, toLocalTimeInputValue } from '../utils/format';

const STATUS_OPTIONS = ['draft', 'published', 'cancelled', 'completed'];

const PREDEFINED_TICKET_NAMES = ['VIP Pass', 'Concert Ticket', 'General Admission', 'Standard', 'Early Bird'];

const statusStyles = {
  published: 'bg-emerald-500/80 text-white',
  draft: 'bg-amber-500/80 text-white',
  cancelled: 'bg-rose-500/80 text-white',
  completed: 'bg-slate-500/80 text-white',
};

export default function MyEvents() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isOrganizer, isAdmin } = useAuth();

  const langStr = String(language || '').toLowerCase();
  const isKurdish = langStr.includes('ku') || langStr.includes('کوردی') || langStr.includes('kurdish');
  const isArabic = langStr.includes('ar') || langStr.includes('عربي') || langStr.includes('العربية') || langStr.includes('arabic');
  const isRtl = isArabic || isKurdish;

  const t = {
    title: isArabic ? 'فعالياتي' : isKurdish ? 'چالاکییەکانم' : 'My Events',
    subtitle: isArabic ? 'إدارة الفعاليات التي أنشأتها' : isKurdish ? 'بەڕێوەبردنی چالاکییە دروستکراوەکانت' : 'Manage the events you created',
    newEvent: isArabic ? 'فعالية جديدة' : isKurdish ? 'چالاکی نوێ' : 'New Event',
    noEvents: isArabic ? 'لا توجد فعاليات في هذا القسم' : isKurdish ? 'هیچ چالاکییەک لەم بەشەدا نییە' : "No events found in this section",
    edit: isArabic ? 'تعديل' : isKurdish ? 'دەستکاری' : 'Edit',
    delete: isArabic ? 'حذف' : isKurdish ? 'سڕینەوە' : 'Delete',
    save: isArabic ? 'حفظ' : isKurdish ? 'پاشەکەوتکردن' : 'Save',
    cancel: isArabic ? 'إلغاء' : isKurdish ? 'هەڵوەشاندنەوە' : 'Cancel',
    loading: isArabic ? 'جار التحميل...' : isKurdish ? 'چاوەڕوانبە...' : 'Loading...',
    noAccess: isArabic ? 'هذه الصفحة للمنظمين فقط' : isKurdish ? 'ئەم پەڕەیە تەنها بۆ ڕێکخەرانە' : 'This page is for organizers only',
    status: isArabic ? 'الحالة' : isKurdish ? 'دۆخ' : 'Status',
    title_f: isArabic ? 'العنوان' : isKurdish ? 'ناونیشان' : 'Title',
    location: isArabic ? 'الموقع' : isKurdish ? 'شوێن' : 'Location',
    quickStatus: isArabic ? 'تغيير الحالة' : isKurdish ? 'گۆڕینی دۆخ' : 'Change status',
    all: isArabic ? 'الكل' : isKurdish ? 'هەموو' : 'All',
  };

  const statusLabels = {
    draft: isArabic ? 'مسودة' : isKurdish ? 'ڕەشنووس' : 'Draft',
    published: isArabic ? 'منشورة' : isKurdish ? 'بڵاوکراوەتەوە' : 'Published',
    cancelled: isArabic ? 'ملغاة' : isKurdish ? 'هەڵوەشێنراوەتەوە' : 'Cancelled',
    completed: isArabic ? 'مكتملة' : isKurdish ? 'تەواوبووە' : 'Completed',
  };

  const [events, setEvents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [ticketCapacities, setTicketCapacities] = useState({});
  const [ticketPrices, setTicketPrices] = useState({});
  const [newTicketTypes, setNewTicketTypes] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [linkedSpeakerIds, setLinkedSpeakerIds] = useState([]);
  const [selectedNewSpeakerIds, setSelectedNewSpeakerIds] = useState([]);
  const [newSpeakerName, setNewSpeakerName] = useState('');
  const [addingSpeaker, setAddingSpeaker] = useState(false);
  const [unlinkingSpeakerId, setUnlinkingSpeakerId] = useState(null);
  const canAccess = isOrganizer || isAdmin;

  const editingEventRef = useRef(null); // يمنع الـ auto-refresh من التدخل وقت فتح مودال التعديل

  const loadEvents = useCallback(async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);
    try {
      const data = await api.getEvents({ limit: 100 });
      setEvents((data.events || []).filter((e) => Number(e.organizer_id) === Number(user.id)));
    } catch (err) {
      console.error('Failed to load events', err);
      if (!isBackground) setEvents([]);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [user]);

  useEffect(() => { if (canAccess) loadEvents(); }, [canAccess, loadEvents]);

  // تحديث تلقائي كل 15 ثانية بدون ما يوقف الصفحة على "جاري التحميل"، ويتوقف وقت فتح مودال التعديل
  useAutoRefresh(() => {
    if (!editingEventRef.current) {
      loadEvents(true);
    }
  }, 30000, canAccess);

  const openEdit = async (event) => {
    editingEventRef.current = event;
    setEditingEvent(event);
    setEditError('');
    setNewTicketTypes([]);

    setEditForm({
      title: event.title || '',
      description: stripEndTimeMarker(event.description),
      location: event.location || '',
      date_time: toLocalDateTimeInputValue(event.date_time),
      end_time: toLocalTimeInputValue(extractEndTime(event.description)),
    });

    try {
      const types = await api.getTicketTypesByEvent(event.id);
      setTicketTypes(types || []);
      if (types && types.length > 0) {
        const caps = {};
        const prices = {};
        types.forEach((ty) => {
          caps[ty.id] = ty.capacity;
          prices[ty.id] = ty.price;
        });
        setTicketCapacities(caps);
        setTicketPrices(prices);
      } else {
        setTicketCapacities({});
        setTicketPrices({});
      }
    } catch (err) {
      console.error(err);
    }

    setSelectedNewSpeakerIds([]);
    setNewSpeakerName('');
    try {
      const [speakersList, eventSpeakers] = await Promise.all([
        api.getSpeakers(),
        api.getSpeakersByEvent(event.id),
      ]);
      setAllSpeakers(speakersList || []);
      setLinkedSpeakerIds((eventSpeakers || []).map((sp) => sp.id));
    } catch (err) {
      console.error(err);
      setAllSpeakers([]);
      setLinkedSpeakerIds([]);
    }
  };

  const closeEdit = () => {
    editingEventRef.current = null;
    setEditingEvent(null);
  };

  const buildEndDateTime = (form) => {
    if (!form.end_time || !form.date_time) return undefined;

    const start = new Date(form.date_time);
    const [endHours, endMinutes] = form.end_time.split(':').map(Number);

    const end = new Date(start);
    end.setHours(endHours, endMinutes, 0, 0);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const pad = (n) => String(n).padStart(2, '0');
    const datePart = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
    const timePart = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
    return `${datePart}T${timePart}`;
  };

  const toggleNewSpeaker = (id) => {
    setSelectedNewSpeakerIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleQuickAddSpeaker = async () => {
    if (!newSpeakerName.trim()) return;
    setAddingSpeaker(true);
    try {
      const res = await api.createSpeaker({ name: newSpeakerName.trim() });
      const newId = res.id;
      setAllSpeakers((prev) => [...prev, { id: newId, name: newSpeakerName.trim() }]);
      setSelectedNewSpeakerIds((prev) => [...prev, newId]);
      setNewSpeakerName('');
    } catch (err) {
      setEditError(err.message || 'Failed to add speaker');
    } finally {
      setAddingSpeaker(false);
    }
  };

  const handleUnlinkSpeaker = async (speakerId) => {
    if (!editingEvent) return;
    setUnlinkingSpeakerId(speakerId);
    try {
      await api.unlinkSpeakerFromEvent({ event_id: editingEvent.id, speaker_id: speakerId });
      setLinkedSpeakerIds((prev) => prev.filter((id) => id !== speakerId));
    } catch (err) {
      setEditError(err.message || 'Failed to remove speaker');
    } finally {
      setUnlinkingSpeakerId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');

    const endDateTime = buildEndDateTime(editForm);

    try {
      const { end_time, ...eventFields } = editForm;
      await api.updateEvent(editingEvent.id, {
        ...eventFields,
        description: encodeEndTime(editForm.description, endDateTime),
      });

      // تحديث السعة والسعر للتذاكر الحالية بشكل مباشر وآمن لتجنب كسر القيود
      await Promise.all(
        ticketTypes.map((ty) =>
          api.updateTicketType(ty.id, {
            capacity: Number(ticketCapacities[ty.id] ?? ty.capacity),
            price: Number(ticketPrices[ty.id] ?? ty.price),
          })
        )
      );

      if (newTicketTypes.length > 0) {
        await Promise.all(
          newTicketTypes.map((nt) =>
            api.createTicketType({
              event_id: editingEvent.id,
              ticket_name: nt.ticket_name,
              price: Number(nt.price || 0),
              capacity: Number(nt.capacity || 0),
              available_tickets: Number(nt.capacity || 0),
            })
          )
        );
      }

      if (selectedNewSpeakerIds.length > 0) {
        await Promise.all(
          selectedNewSpeakerIds.map((speakerId) =>
            api.linkSpeakerToEvent({ event_id: editingEvent.id, speaker_id: speakerId })
          )
        );
      }

      closeEdit();
      loadEvents();
    } catch (err) {
      console.error('Failed to update event', err);
      setEditError(err.response?.data?.message || 'Failed to update ticket types. Please check your values.');
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteTicketType = async (id) => {
    try {
      await api.deleteTicketType(id);
      setTicketTypes((prev) => prev.filter((t) => t.id !== id));
      setTicketCapacities((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setTicketPrices((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTicketField = () => {
    setNewTicketTypes((prev) => [...prev, { ticket_name: 'VIP Pass', price: 45, capacity: 50 }]);
  };

  const handleNewTicketChange = (index, field, value) => {
    setNewTicketTypes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveNewTicketField = (index) => {
    setNewTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuickStatusChange = async (event, newStatus) => {
    if (event.status === newStatus) return;
    setUpdatingStatusId(event.id);
    try {
      await api.updateEvent(event.id, { status: newStatus });
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (!canAccess) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-purple-300/70 text-sm p-8 text-center font-sans">
        {t.noAccess}
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    if (selectedFilter === 'all') return true;
    return event.status === selectedFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-6xl mx-auto px-4 py-8 overflow-hidden font-sans">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-slate-900 dark:text-white"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-purple-600 dark:text-purple-300 text-sm md:text-base leading-relaxed mt-1"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/create-event')}
          className="bg-purple-800 hover:bg-purple-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> {t.newEvent}
        </motion.button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setSelectedFilter('all')}
          className={`text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-sm ${
            selectedFilter === 'all'
              ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-purple-600/30 ring-2 ring-purple-400/30'
              : 'bg-white dark:bg-[#13091f]/80 text-slate-600 dark:text-purple-200/80 border border-slate-200/80 dark:border-purple-900/40 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
          }`}
        >
          {t.all} <span className="opacity-75 ms-1">({events.length})</span>
        </motion.button>
        {STATUS_OPTIONS.map((status) => {
          const count = events.filter((e) => e.status === status).length;
          const isActive = selectedFilter === status;
          return (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedFilter(status)}
              className={`text-xs font-semibold px-4 py-2.5 rounded-2xl transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-purple-600/30 ring-2 ring-purple-400/30'
                  : 'bg-white dark:bg-[#13091f]/80 text-slate-600 dark:text-purple-200/80 border border-slate-200/80 dark:border-purple-900/40 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/20'
              }`}
            >
              {statusLabels[status]} <span className="opacity-75 ms-1">({count})</span>
            </motion.button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
          {t.loading}
        </div>
      ) : filteredEvents.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/30 rounded-3xl overflow-hidden shadow-sm hover:border-purple-400 dark:hover:border-purple-500/50 flex flex-col justify-between group transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  src={event.image_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} text-[10px] font-bold px-3 py-1 rounded-xl uppercase shadow-sm backdrop-blur-md border border-white/10 ${statusStyles[event.status] || 'bg-slate-500/80 text-white'}`}
                >
                  {statusLabels[event.status] || event.status}
                </span>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-500 dark:text-purple-300/60">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> {formatDate(event.date_time)}
                    </p>
                    <p className="flex items-center gap-2 text-slate-500 dark:text-purple-300/70">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="line-clamp-1">{event.location || '—'}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-purple-300/50 uppercase tracking-wide">
                    {t.quickStatus}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((s) => {
                      const isCurrent = event.status === s;
                      return (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.94 }}
                          disabled={updatingStatusId === event.id}
                          onClick={() => handleQuickStatusChange(event, s)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition disabled:opacity-50 cursor-pointer ${
                            isCurrent
                              ? `${statusStyles[s]} border-transparent`
                              : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-purple-300/60 border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-500/50'
                          }`}
                        >
                          {statusLabels[s]}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-purple-900/20 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openEdit(event)}
                    className="flex-1 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-600 text-purple-600 dark:text-purple-200 hover:text-white text-xs font-semibold py-2 px-3 rounded-xl border border-purple-200 dark:border-purple-800/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> {t.edit}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-600 disabled:opacity-60 text-rose-600 dark:text-rose-400 hover:text-white p-2 rounded-xl border border-rose-200 dark:border-rose-500/30 transition cursor-pointer shadow-sm"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/30 rounded-3xl p-10 text-center max-w-md mx-auto space-y-2 my-12 shadow-sm"
        >
          <p className="text-slate-600 dark:text-purple-300/70 text-sm font-medium">{t.noEvents}</p>
        </motion.div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/50 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-purple-900/30 pb-4">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">{t.edit}</h3>
                <button
                  onClick={closeEdit}
                  className="text-slate-400 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">{t.title_f}</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={editForm.date_time}
                    onChange={(e) => setEditForm({ ...editForm, date_time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={editForm.end_time || ''}
                    onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                {editError && <p className="text-xs text-rose-500">{editError}</p>}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">{t.location}</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block">
                    Ticket Types
                  </label>

                  {ticketTypes.map((type) => (
                    <div
                      key={type.id}
                      className="bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                          {type.ticket_name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTicketType(type.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-purple-300 block mb-1">
                            Capacity
                          </label>
                          <input
                            type="number"
                            value={ticketCapacities[type.id] ?? ''}
                            onChange={(e) =>
                              setTicketCapacities((prev) => ({
                                ...prev,
                                [type.id]:
                                  e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                              }))
                            }
                            className="w-full bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/60 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 dark:text-purple-300 block mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={ticketPrices[type.id] ?? ''}
                            onChange={(e) =>
                              setTicketPrices((prev) => ({
                                ...prev,
                                [type.id]:
                                  e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                              }))
                            }
                            className="w-full bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/60 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* التذاكر الجديدة مع اسم التذكرة، والسعة، والسعر */}
                  {newTicketTypes.map((nt, index) => (
                    <div
                      key={index}
                      className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-300 dark:border-purple-500/40 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                          New Ticket Type
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewTicketField(index)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-600 dark:text-purple-300 block mb-1">Ticket Name List</label>
                          <select
                            value={nt.ticket_name}
                            onChange={(e) => handleNewTicketChange(index, 'ticket_name', e.target.value)}
                            className="w-full bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/60 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                          >
                            {PREDEFINED_TICKET_NAMES.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-600 dark:text-purple-300 block mb-1">Capacity</label>
                            <input
                              type="number"
                              required
                              value={nt.capacity}
                              onChange={(e) => handleNewTicketChange(index, 'capacity', e.target.value)}
                              className="w-full bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/60 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-600 dark:text-purple-300 block mb-1">Price</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={nt.price}
                              onChange={(e) => handleNewTicketChange(index, 'price', e.target.value)}
                              className="w-full bg-white dark:bg-[#13091f] border border-slate-200 dark:border-purple-900/60 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddTicketField}
                    className="w-full border-2 border-dashed border-purple-400 dark:border-purple-500/50 rounded-2xl py-3 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition cursor-pointer font-medium text-xs flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ticket Type
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block">
                    {isArabic ? 'المتحدثون / الفنانون' : isKurdish ? 'وتاربێژان' : 'Speakers / Artists'}
                  </label>

                  {linkedSpeakerIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {allSpeakers
                          .filter((sp) => linkedSpeakerIds.includes(sp.id))
                          .map((sp) => (
                            <motion.span
                              key={sp.id}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
                              className="px-3 py-2 rounded-xl text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 flex items-center gap-1.5"
                            >
                              {sp.name}
                              <button
                                type="button"
                                disabled={unlinkingSpeakerId === sp.id}
                                onClick={() => handleUnlinkSpeaker(sp.id)}
                                className="text-purple-500 hover:text-rose-500 disabled:opacity-40 cursor-pointer transition"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {allSpeakers.filter((sp) => !linkedSpeakerIds.includes(sp.id)).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {allSpeakers
                          .filter((sp) => !linkedSpeakerIds.includes(sp.id))
                          .map((sp) => {
                            const selected = selectedNewSpeakerIds.includes(sp.id);
                            return (
                              <motion.button
                                key={sp.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => toggleNewSpeaker(sp.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                                  selected
                                    ? 'bg-purple-600 border-purple-600 text-white'
                                    : 'bg-white dark:bg-[#0b0712] border-slate-200 dark:border-purple-900/40 text-slate-700 dark:text-purple-200'
                                }`}
                              >
                                {sp.name}
                              </motion.button>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSpeakerName}
                      onChange={(e) => setNewSpeakerName(e.target.value)}
                      placeholder={isArabic ? 'أضف متحدث جديد بالاسم...' : isKurdish ? 'وتاربێژێکی نوێ زیاد بکە...' : 'Add a new speaker by name...'}
                      className="flex-1 bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl py-2.5 px-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                    />
                    <button
                      type="button"
                      disabled={addingSpeaker || !newSpeakerName.trim()}
                      onClick={handleQuickAddSpeaker}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 disabled:opacity-50 cursor-pointer transition"
                    >
                      {isArabic ? 'إضافة' : isKurdish ? 'زیادکردن' : 'Add'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-purple-900/40 text-slate-600 dark:text-purple-300 hover:bg-slate-100 dark:hover:bg-purple-900/30 cursor-pointer transition"
                  >
                    {t.cancel}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40"
                  >
                    <Save className="w-3.5 h-3.5" /> {t.save}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}