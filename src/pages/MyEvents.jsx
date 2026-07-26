// src/pages/MyEvents.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Edit3, Trash2, Plus, X, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatDate } from '../utils/format';

const STATUS_OPTIONS = ['draft', 'published', 'cancelled', 'completed'];

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
    noEvents: isArabic ? 'لم تنشئ أي فعالية بعد' : isKurdish ? 'هێشتا هیچ چالاکییەکت دروست نەکردووە' : "You haven't created any events yet",
    edit: isArabic ? 'تعديل' : isKurdish ? 'دەستکاری' : 'Edit',
    delete: isArabic ? 'حذف' : isKurdish ? 'سڕینەوە' : 'Delete',
    save: isArabic ? 'حفظ' : isKurdish ? 'پاشەکەوتکردن' : 'Save',
    cancel: isArabic ? 'إلغاء' : isKurdish ? 'هەڵوەشاندنەوە' : 'Cancel',
    loading: isArabic ? 'جار التحميل...' : isKurdish ? 'چاوەڕوانبە...' : 'Loading...',
    noAccess: isArabic ? 'هذه الصفحة للمنظمين فقط' : isKurdish ? 'ئەم پەڕەیە تەنها بۆ ڕێکخەرانە' : 'This page is for organizers only',
    status: isArabic ? 'الحالة' : isKurdish ? 'دۆخ' : 'Status',
    title_f: isArabic ? 'العنوان' : isKurdish ? 'ناونیشان' : 'Title',
    location: isArabic ? 'الموقع' : isKurdish ? 'شوێن' : 'Location',
    dateTime: isArabic ? 'التاريخ والوقت' : isKurdish ? 'بەروار و کات' : 'Date & Time',
    quickStatus: isArabic ? 'تغيير الحالة' : isKurdish ? 'گۆڕینی دۆخ' : 'Change status',
  };

  const statusLabels = {
    draft: isArabic ? 'مسودة' : isKurdish ? 'ڕەشنووس' : 'Draft',
    published: isArabic ? 'منشورة' : isKurdish ? 'بڵاوکراوەتەوە' : 'Published',
    cancelled: isArabic ? 'ملغاة' : isKurdish ? 'هەڵوەشێنراوەتەوە' : 'Cancelled',
    completed: isArabic ? 'مكتملة' : isKurdish ? 'تەواوبووە' : 'Completed',
  };

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const canAccess = isOrganizer || isAdmin;

  const loadEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getEvents({ limit: 100 });
      setEvents((data.events || []).filter((e) => Number(e.organizer_id) === Number(user.id)));
    } catch (err) {
      console.error('Failed to load events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { if (canAccess) loadEvents(); }, [canAccess, loadEvents]);

  const openEdit = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      date_time: event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : '',
      status: event.status || 'draft',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateEvent(editingEvent.id, editForm);
      setEditingEvent(null);
      loadEvents();
    } catch (err) {
      console.error('Failed to update event', err);
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
            className="text-slate-600 dark:text-purple-300/70 text-sm md:text-base leading-relaxed mt-2"
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
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-purple-600/20 dark:shadow-purple-900/40 cursor-pointer inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" /> {t.newEvent}
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
          {t.loading}
        </div>
      ) : events.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {events.map((event) => (
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
                  onClick={() => setEditingEvent(null)}
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">{t.dateTime}</label>
                  <input
                    type="datetime-local"
                    required
                    value={editForm.date_time}
                    onChange={(e) => setEditForm({ ...editForm, date_time: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">{t.location}</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-purple-300 block mb-1">{t.status}</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-2xl p-3 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
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