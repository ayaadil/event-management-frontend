// src/pages/admin/Speakers.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic2, Plus, X, Save, Loader2, Pencil, Trash2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const t = {
  ar: {
    pageTitle: 'إدارة المتحدثين',
    newSpeaker: 'متحدث جديد',
    loading: 'جاري تحميل المتحدثين...',
    noSpeakers: 'لا يوجد متحدثون.',
    newTitle: 'إضافة متحدث',
    editTitle: 'تعديل متحدث',
    name: 'الاسم',
    namePlaceholder: 'أدخل اسم المتحدث...',
    role: 'الدور / اللقب',
    rolePlaceholder: 'مثال: مغني، متحدث رئيسي...',
    company: 'الجهة (اختياري)',
    companyPlaceholder: 'اسم الشركة أو الجهة...',
    imageLabel: 'صورة المتحدث (اختياري)',
    imageHint: 'PNG أو JPG بحد أقصى 10MB',
    uploading: 'جاري رفع الصورة...',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    confirmDeleteTitle: 'حذف المتحدث؟',
    confirmDeleteDesc: 'بيتحذف من كل الفعاليات المرتبط بيها. هذا الإجراء ما ينرجع.',
    confirmDeleteBtn: 'نعم، احذف',
    noAccess: 'هذه الصفحة للمنظمين والمشرفين فقط.',
    saveError: 'فشل حفظ المتحدث',
    deleteError: 'فشل حذف المتحدث',
    nameRequired: 'اسم المتحدث مطلوب',
  },
  ku: {
    pageTitle: 'بەڕێوەبردنی وتاربێژان',
    newSpeaker: 'وتاربێژی نوێ',
    loading: 'بارکردنی وتاربێژان...',
    noSpeakers: 'هیچ وتاربێژێک نییە.',
    newTitle: 'زیادکردنی وتاربێژ',
    editTitle: 'دەستکاریکردنی وتاربێژ',
    name: 'ناو',
    namePlaceholder: 'ناوی وتاربێژ بنووسە...',
    role: 'ڕۆڵ',
    rolePlaceholder: 'نموونە: گۆرانیبێژ، وتاربێژی سەرەکی...',
    company: 'کۆمپانیا (ئارەزوومەندانە)',
    companyPlaceholder: 'ناوی کۆمپانیا...',
    imageLabel: 'وێنەی وتاربێژ (ئارەزوومەندانە)',
    imageHint: 'PNG یان JPG تا ١٠ مێگابایت',
    uploading: 'بارکردنی وێنە...',
    cancel: 'پاشگەزبوونەوە',
    save: 'پاشکەوتکردن',
    edit: 'دەستکاری',
    delete: 'سڕینەوە',
    confirmDeleteTitle: 'وتاربێژ بسڕدرێتەوە؟',
    confirmDeleteDesc: 'لە هەموو چالاکییە پەیوەندیدارەکان دەسڕدرێتەوە. ناتوانرێت هەڵبوەشێتەوە.',
    confirmDeleteBtn: 'بەڵێ، بسڕەوە',
    noAccess: 'ئەم پەڕەیە تەنها بۆ ڕێکخەران و بەڕێوەبەرانە.',
    saveError: 'پاشکەوتکردن سەرکەوتوو نەبوو',
    deleteError: 'سڕینەوە سەرکەوتوو نەبوو',
    nameRequired: 'ناوی وتاربێژ پێویستە',
  },
  en: {
    pageTitle: 'Manage Speakers',
    newSpeaker: 'New Speaker',
    loading: 'Loading speakers...',
    noSpeakers: 'No speakers found.',
    newTitle: 'Add Speaker',
    editTitle: 'Edit Speaker',
    name: 'Name',
    namePlaceholder: 'Enter speaker name...',
    role: 'Role / Title',
    rolePlaceholder: 'e.g. Singer, Keynote speaker...',
    company: 'Company (optional)',
    companyPlaceholder: 'Company or organization name...',
    imageLabel: 'Speaker photo (optional)',
    imageHint: 'PNG or JPG up to 10MB',
    uploading: 'Uploading image...',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirmDeleteTitle: 'Delete this speaker?',
    confirmDeleteDesc: 'They will be removed from every event they are linked to. This cannot be undone.',
    confirmDeleteBtn: 'Yes, delete',
    noAccess: 'This page is for organizers and admins only.',
    saveError: 'Failed to save speaker',
    deleteError: 'Failed to delete speaker',
    nameRequired: 'Speaker name is required',
  },
};

const emptyForm = { name: '', role: '', company: '', image_url: '' };

export default function AdminSpeakers() {
  const { language } = useLanguage();
  const { isOrganizer, isAdmin } = useAuth();
  const canAccess = isOrganizer || isAdmin;

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null); // null = create mode
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getSpeakers().then(setSpeakers).catch(() => setSpeakers([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (canAccess) load(); }, [canAccess, load]);

  const openNew = () => {
    setEditingSpeaker(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (speaker) => {
    setEditingSpeaker(speaker);
    setForm({
      name: speaker.name || '',
      role: speaker.role || '',
      company: speaker.company || '',
      image_url: speaker.image_url || '',
    });
    setError('');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError('');
    api
      .uploadImage(file)
      .then((res) => {
        setForm((prev) => ({ ...prev, image_url: res.url }));
      })
      .catch((err) => setError(err.message || 'Image upload failed'))
      .finally(() => setUploadingImage(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError(text.nameRequired);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role || undefined,
        company: form.company || undefined,
        image_url: form.image_url || undefined,
      };
      if (editingSpeaker) {
        await api.updateSpeaker(editingSpeaker.id, payload);
      } else {
        await api.createSpeaker(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || text.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.deleteSpeaker(id);
      setSpeakers((prev) => prev.filter((sp) => sp.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (!canAccess) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        {text.noAccess}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-6 max-w-5xl mx-auto transition-colors duration-300"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#13091f] p-6 rounded-3xl border border-slate-200/80 dark:border-violet-900/30 shadow-sm"
      >
        <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
          <motion.div
  animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.1, 1.1, 1.05, 1.05, 1] }}
  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
  className="p-2 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-200/60 dark:border-violet-500/20 text-violet-600 dark:text-violet-400"
>
  <Mic2 className="w-6 h-6" />
</motion.div>
          {text.pageTitle}
        </h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openNew}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-5 py-3 rounded-2xl transition inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-violet-500/20"
        >
          <Plus className="w-4 h-4" /> {text.newSpeaker}
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="text-center py-28 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-violet-300 text-sm">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <span>{text.loading}</span>
        </div>
      ) : speakers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 bg-white dark:bg-[#13091f] rounded-3xl border border-slate-200/80 dark:border-violet-900/30 text-slate-400 text-sm shadow-sm"
        >
          {text.noSpeakers}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {speakers.map((sp, index) => (
              <motion.div
                key={sp.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 12px 24px -8px rgba(124,58,237,0.25)" }}
                className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-violet-900/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm relative"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                  {sp.image_url ? (
                    <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-violet-700 dark:text-violet-300 font-bold text-sm">{sp.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-semibold truncate">{sp.name}</p>
                  {(sp.role || sp.company) && (
                    <p className="text-[11px] text-slate-500 dark:text-violet-300/60 truncate">
                      {[sp.role, sp.company].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: isRtl ? -6 : 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.03, duration: 0.3 }}
                  className="flex items-center gap-1 shrink-0"
                >
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: -6 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEdit(sp)}
                    className="p-1.5 rounded-lg text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 cursor-pointer transition-colors"
                    title={text.edit}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmDeleteId(sp.id)}
                    className="p-1.5 rounded-lg text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                    title={text.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-violet-900/40 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-violet-900/30 pb-4">
                <h3 className="text-base font-bold font-serif">
                  {editingSpeaker ? text.editTitle : text.newTitle}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-violet-900/20 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-violet-700 dark:text-violet-300 block">{text.name}</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={text.namePlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-violet-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-violet-700 dark:text-violet-300 block">{text.role}</label>
                  <input
                    type="text" value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder={text.rolePlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-violet-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-violet-700 dark:text-violet-300 block">{text.company}</label>
                  <input
                    type="text" value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder={text.companyPlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-violet-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-violet-700 dark:text-violet-300 block">{text.imageLabel}</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-violet-900/60 bg-slate-50/50 dark:bg-[#0b0712]/50 rounded-2xl p-4 text-center hover:border-violet-400 dark:hover:border-violet-500/50 transition cursor-pointer flex items-center gap-3 relative overflow-hidden"
                  >
                    {form.image_url ? (
                      <div className="relative w-14 h-14 shrink-0">
                        <img src={form.image_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      </div>
                    )}
                    <div className="text-start">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">
                        {uploadingImage ? text.uploading : text.imageLabel}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-violet-300/50 mt-0.5">{text.imageHint}</p>
                    </div>
                  </motion.div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-rose-500 font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    {text.cancel}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={saving || uploadingImage}
                    className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white flex items-center gap-2 cursor-pointer shadow-sm shadow-violet-500/20 transition-all"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {text.save}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#13091f] border border-rose-200 dark:border-rose-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full space-y-5 shadow-2xl text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 text-rose-500 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{text.confirmDeleteTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-violet-300/60 leading-relaxed">{text.confirmDeleteDesc}</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {text.cancel}
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={deletingId === confirmDeleteId}
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-500/20 transition-all"
                >
                  {deletingId === confirmDeleteId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {text.confirmDeleteBtn}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}