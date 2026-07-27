// src/pages/CreateEvent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Calendar, Clock, MapPin, DollarSign, Users, User, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { encodeEndTime } from '../utils/format';

const t = {
  ar: {
    title: 'إنشاء فعالية', subtitle: 'املأ التفاصيل أدناه لنشر فعاليتك الجديدة',
    imageTitle: 'رفع صورة الفعالية', imageDesc: 'PNG, JPG, أو GIF بحد أقصى 10MB',
    eventName: 'اسم الفعالية', eventNamePlaceholder: 'أدخل اسم الفعالية..',
    ticketPrice: 'سعر التذكرة', pricePlaceholder: 'أدخل السعر (0 = مجاني)',
    ticketTypesTitle: 'أنواع التذاكر',
    ticketTypeName: 'اسم نوع التذكرة', ticketTypeNamePlaceholder: 'مثال: VIP، عام...',
    addTicketType: '+ إضافة نوع تذكرة', removeTicketType: 'حذف',
    ticketTypesError: 'يجب إضافة اسم وسعر وسعة صحيحة لكل نوع تذكرة',
    category: 'الفئة', selectCategory: 'اختر الفئة',
    capacity: 'السعة', capacityPlaceholder: 'أدخل السعة (عدد الحضور)',
    date: 'تاريخ ووقت البداية', organizer: 'اسم المنظم',
    endTime: 'وقت الانتهاء', endTimeHint: 'اختر ساعة انتهاء الفعالية (نفس اليوم)',
    endTimeError: 'وقت الانتهاء يجب أن يكون بعد وقت البداية',
    location: 'الموقع', locationPlaceholder: 'أدخل موقع الفعالية',
    description: 'الوصف', descPlaceholder: 'اكتب وصفاً قصيراً...',
    publish: 'نشر الفعالية', publishing: 'جارٍ النشر...',
    noAccessTitle: 'هذه الصفحة للمنظمين فقط',
    noAccessDesc: 'يجب أن يكون حسابك بصلاحية منظم لإنشاء فعالية جديدة.',
  },
  ku: {
    title: 'دروستکردنی چالاکی', subtitle: 'وردەکارییەکان پڕبکەرەوە بۆ بڵاوکردنەوەی چالاکییە نوێیەکەت',
    imageTitle: 'بارکردنی وێنەی چالاکی', imageDesc: 'PNG, JPG, یان GIF تا ١٠ مێگابایت',
    eventName: 'ناوی چالاکی', eventNamePlaceholder: 'ناوی چالاکی بنووسه..',
    ticketPrice: 'نرخی بلیت', pricePlaceholder: 'نرخ بنووسە (٠ = خۆڕایی)',
    ticketTypesTitle: 'جۆرەکانی بلیت',
    ticketTypeName: 'ناوی جۆری بلیت', ticketTypeNamePlaceholder: 'نموونە: VIP، گشتی...',
    addTicketType: '+ زیادکردنی جۆری بلیت', removeTicketType: 'سڕینەوە',
    ticketTypesError: 'پێویستە ناو، نرخ و توانای دروست بۆ هەر جۆرێکی بلیت زیاد بکەیت',
    category: 'پۆل', selectCategory: 'پۆل هەڵبژێرە',
    capacity: 'توانای وەرگرتن', capacityPlaceholder: 'توانای شوێنەکە بنووسە',
    date: 'بەروار و کاتی دەستپێک', organizer: 'ناوی ڕێکخەر',
    endTime: 'کاتی کۆتایی', endTimeHint: 'کاتی کۆتایی چالاکییەکە هەڵبژێرە (هەمان ڕۆژ)',
    endTimeError: 'کاتی کۆتایی دەبێت دوای کاتی دەستپێک بێت',
    location: 'شوێن', locationPlaceholder: 'شوێن بنووسە',
    description: 'پێناسە', descPlaceholder: 'پێناسەیەکی کورت بنووسە...',
    publish: 'بڵاوکردنەوەی چالاکی', publishing: 'جارٍ النشر...',
    noAccessTitle: 'ئەم پەڕەیە تەنها بۆ ڕێکخەرانە',
    noAccessDesc: 'دەبێت هەژمارەکەت ڕێکخەر بێت بۆ دروستکردنی چالاکی نوێ.',
  },
  en: {
    title: 'Create Event', subtitle: 'Fill in the details below to publish your new event',
    imageTitle: 'Upload Event Image', imageDesc: 'PNG, JPG, or GIF up to 10MB',
    eventName: 'Event name', eventNamePlaceholder: 'Enter Event name..',
    ticketPrice: 'Ticket price', pricePlaceholder: 'Enter price (0 = Free)',
    ticketTypesTitle: 'Ticket Types',
    ticketTypeName: 'Ticket type name', ticketTypeNamePlaceholder: 'e.g. VIP, General...',
    addTicketType: '+ Add Ticket Type', removeTicketType: 'Remove',
    ticketTypesError: 'Every ticket type needs a name, a valid price, and a valid capacity',
    category: 'Category', selectCategory: 'Select category',
    capacity: 'Capacity', capacityPlaceholder: 'Enter Capacity',
    date: 'Start Date & Time', organizer: 'Organizer Name',
    endTime: 'End Time', endTimeHint: "Pick the event's end time (same day)",
    endTimeError: 'End time must be after the start time',
    location: 'Location', locationPlaceholder: 'Enter location',
    description: 'Description', descPlaceholder: 'Write a short description...',
    publish: 'Publish Event', publishing: 'Publishing...',
    noAccessTitle: 'This page is for organizers only',
    noAccessDesc: 'Your account needs organizer access to create a new event.',
  }
};

export default function CreateEvent() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isOrganizer, isAdmin } = useAuth();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    date_time: '',
    end_time: '', // ساعة الانتهاء فقط (HH:mm) بنفس يوم date_time
    location: '',
    description: '',
    image_url: '',
  });

  // كل فعالية ممكن تكون عندها أكثر من نوع تذكرة (مثلاً VIP + General)
  const [ticketTypes, setTicketTypes] = useState([
    { ticket_name: 'General Admission', price: '', capacity: '' },
  ]);

  const addTicketTypeRow = () => {
    setTicketTypes((prev) => [...prev, { ticket_name: '', price: '', capacity: '' }]);
  };

  const removeTicketTypeRow = (index) => {
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTicketTypeRow = (index, field, value) => {
    setTicketTypes((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const canCreate = isOrganizer || isAdmin;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // يبني وقت انتهاء كامل (تاريخ + ساعة) من تاريخ البداية + ساعة النهاية المختارة
  const buildEndDateTime = () => {
    if (!formData.end_time || !formData.date_time) return undefined;
    const datePart = formData.date_time.split('T')[0];
    return `${datePart}T${formData.end_time}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endDateTime = buildEndDateTime();
    if (endDateTime && new Date(endDateTime) <= new Date(formData.date_time)) {
      setError(text.endTimeError);
      return;
    }

    const validTicketTypes = ticketTypes.filter(
      (tt) => tt.ticket_name.trim() && tt.price !== '' && tt.capacity !== '' && Number(tt.capacity) > 0
    );
    if (validTicketTypes.length === 0) {
      setError(text.ticketTypesError);
      return;
    }

    setSubmitting(true);
    try {
      const event = await api.createEvent({
        title: formData.title,
        // نخزّن وقت الانتهاء داخل description لأن جدول events لا يحتوي عمود end_time
        description: encodeEndTime(formData.description, endDateTime),
        image_url: formData.image_url || undefined,
        date_time: formData.date_time,
        location: formData.location || undefined,
        category_id: formData.category_id || undefined,
        status: 'published',
      });

      // إنشاء كل أنواع التذاكر (VIP، General... إلخ) لنفس الفعالية
      for (const tt of validTicketTypes) {
        await api.createTicketType({
          event_id: event.id,
          ticket_name: tt.ticket_name.trim(),
          price: Number(tt.price) || 0,
          capacity: Number(tt.capacity),
        });
      }

      navigate(`/events/${event.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 px-4 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition-all duration-300";
  const inputClassWithIcon = (rtl) => `w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 ${rtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition-all duration-300`;

  if (!canCreate) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-10 font-sans max-w-5xl mx-auto flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3 bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-3xl p-10 max-w-md shadow-xl"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{text.noAccessTitle}</h2>
          <p className="text-sm text-slate-500 dark:text-purple-300/60">{text.noAccessDesc}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-800 dark:text-white p-6 md:p-10 font-sans space-y-8 max-w-5xl mx-auto transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-purple-900/30 pb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 hover:border-purple-400 dark:hover:border-purple-500/50 text-purple-600 dark:text-purple-300 transition cursor-pointer shadow-sm"
        >
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </motion.button>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-white"
          >
            {text.title}
          </motion.h1>
          <p className="text-purple-600/60 dark:text-purple-300/60 text-xs mt-1">{text.subtitle}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Image Box */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-slate-300 dark:border-purple-900/60 bg-slate-50/50 dark:bg-[#150a21]/50 rounded-3xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-500/50 transition cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden shadow-sm"
        >
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          {imagePreview ? (
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-40 object-cover rounded-2xl" 
            />
          ) : (
            <>
              <div className="p-4 bg-purple-100 dark:bg-purple-600/10 border border-purple-300 dark:border-purple-500/20 rounded-2xl text-purple-600 dark:text-purple-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{text.imageTitle}</p>
                <p className="text-xs text-slate-500 dark:text-purple-300/50 mt-1">{text.imageDesc}</p>
              </div>
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.eventName}</label>
            <input
              type="text" required placeholder={text.eventNamePlaceholder}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.category}</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl py-3 px-4 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 cursor-pointer transition-all duration-300"
            >
              <option value="">{text.selectCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.date}</label>
            <div className="relative">
              <Calendar className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400 pointer-events-none`} />
              <input
                type="datetime-local" required
                value={formData.date_time}
                onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
          </div>

          {/* End Time (ساعة انتهاء الفعالية بنفس اليوم) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.endTime}</label>
            <div className="relative">
              <Clock className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400 pointer-events-none`} />
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className={inputClassWithIcon(isRtl)}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-purple-300/40">{text.endTimeHint}</p>
          </div>

          {/* Organizer Name (read-only, from logged-in account) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.organizer}</label>
            <div className="relative">
              <User className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
              <input
                type="text" disabled value={user?.name || ''}
                className={`${inputClassWithIcon(isRtl)} opacity-70 cursor-not-allowed`}
              />
            </div>
          </div>
        </div>

        {/* Ticket Types (يمكن إضافة أكثر من نوع تذكرة: VIP, General...) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.ticketTypesTitle}</label>
          <div className="space-y-3">
            {ticketTypes.map((row, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-purple-300/60">{text.ticketTypeName}</label>
                  <input
                    type="text" placeholder={text.ticketTypeNamePlaceholder}
                    value={row.ticket_name}
                    onChange={(e) => updateTicketTypeRow(index, 'ticket_name', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/40 rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-purple-300/60">{text.ticketPrice}</label>
                  <div className="relative">
                    <DollarSign className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} w-3.5 h-3.5 text-purple-500 dark:text-purple-400`} />
                    <input
                      type="number" min="0" step="0.01" placeholder={text.pricePlaceholder}
                      value={row.price}
                      onChange={(e) => updateTicketTypeRow(index, 'price', e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/40 rounded-xl py-2.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 dark:text-purple-300/60">{text.capacity}</label>
                  <div className="relative">
                    <Users className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} w-3.5 h-3.5 text-purple-500 dark:text-purple-400`} />
                    <input
                      type="number" min="1" placeholder={text.capacityPlaceholder}
                      value={row.capacity}
                      onChange={(e) => updateTicketTypeRow(index, 'capacity', e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/40 rounded-xl py-2.5 ${isRtl ? 'pr-8 pl-3' : 'pl-8 pr-3'} text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/40 focus:outline-none focus:border-purple-500 transition`}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={ticketTypes.length === 1}
                  onClick={() => removeTicketTypeRow(index)}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer whitespace-nowrap"
                >
                  {text.removeTicketType}
                </button>
              </div>
            ))}
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addTicketTypeRow}
            className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:underline cursor-pointer"
          >
            {text.addTicketType}
          </motion.button>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.location}</label>
          <div className="relative">
            <MapPin className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
            <input
              type="text" placeholder={text.locationPlaceholder}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClassWithIcon(isRtl)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-700 dark:text-purple-200">{text.description}</label>
          <div className="relative">
            <FileText className={`absolute top-3.5 ${isRtl ? 'right-4' : 'left-4'} w-4 h-4 text-purple-500 dark:text-purple-400`} />
            <textarea
              rows="4" placeholder={text.descPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClassWithIcon(isRtl)} resize-none`}
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition shadow-lg shadow-purple-900/20 dark:shadow-purple-900/40 cursor-pointer"
        >
          {submitting ? text.publishing : text.publish}
        </motion.button>
      </form>
    </motion.div>
  );
}