// src/pages/admin/Categories.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Grid3x3, Plus, Edit3, Trash2, X, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

// قاموس ترجمة أسماء الفئات (نفس القاموس المستخدم بصفحة Home)
const CATEGORY_NAME_TRANSLATIONS = {
  technology: { ar: 'تكنولوجيا', ku: 'تەکنەلۆژیا', en: 'Technology' },
  business: { ar: 'أعمال', ku: 'بازرگانی', en: 'Business' },
  music: { ar: 'موسيقى', ku: 'میوزیک', en: 'Music' },
  design: { ar: 'تصميم', ku: 'دیزاین', en: 'Design' },
  marketing: { ar: 'تسويق', ku: 'مارکێتینگ', en: 'Marketing' },
  gaming: { ar: 'ألعاب', ku: 'یاری', en: 'Gaming' },
  'art & culture': { ar: 'فن وثقافة', ku: 'هونەر و کەلتوور', en: 'Art & Culture' },
  education: { ar: 'تعليم', ku: 'پەروەردە', en: 'Education' },
  'family & kids': { ar: 'العائلة والأطفال', ku: 'خێزان و منداڵان', en: 'Family & Kids' },
  fashion: { ar: 'أزياء', ku: 'فاشن', en: 'Fashion' },
  'sports & fitness': { ar: 'رياضة ولياقة', ku: 'وەرزش', en: 'Sports & Fitness' },
};

const t = {
  ar: {
    pageTitle: 'إدارة التصنيفات',
    newCategory: 'تصنيف جديد',
    loading: 'جاري تحميل التصنيفات...',
    noCategories: 'لا توجد تصنيفات.',
    editTitle: 'تعديل التصنيف',
    newTitle: 'تصنيف جديد',
    editCategory: 'تعديل التصنيف',
    deleteCategory: 'حذف التصنيف',
    name: 'الاسم (افتراضي)',
    nameAr: 'الاسم بالعربي',
    nameKu: 'الاسم بالكردي',
    nameEn: 'الاسم بالإنجليزي',
    namePlaceholder: 'أدخل اسم التصنيف...',
    iconUrl: 'رابط الأيقونة (اختياري)',
    cancel: 'إلغاء',
    save: 'حفظ',
    adminsOnly: 'للمشرفين فقط.',
    saveError: 'فشل حفظ التصنيف',
  },
  ku: {
    pageTitle: 'بەڕێوەبردنی بەشەکان',
    newCategory: 'بەشی نوێ',
    loading: 'بارکردنی بەشەکان...',
    noCategories: 'هیچ بەشێک نەدۆزرایەوە.',
    editTitle: 'دەستکاریکردنی بەش',
    newTitle: 'بەشی نوێ',
    editCategory: 'دەستکاریکردنی بەش',
    deleteCategory: 'سڕینەوەی بەش',
    name: 'ناو (بنەڕەت)',
    nameAr: 'ناو بە عەرەبی',
    nameKu: 'ناو بە کوردی',
    nameEn: 'ناو بە ئینگلیزی',
    namePlaceholder: 'ناوی بەش بنووسە...',
    iconUrl: 'لینکی ئایکۆن (ئارەزوومەندانە)',
    cancel: 'پاشگەزبوونەوە',
    save: 'پاشکەوتکردن',
    adminsOnly: 'تەنها بۆ بەڕێوەبەران.',
    saveError: 'سڕینەوەی بەش سەرکەوتوو نەبوو',
  },
  en: {
    pageTitle: 'Manage Categories',
    newCategory: 'New Category',
    loading: 'Loading categories...',
    noCategories: 'No categories found.',
    editTitle: 'Edit Category',
    newTitle: 'New Category',
    editCategory: 'Edit category',
    deleteCategory: 'Delete category',
    name: 'Name (default)',
    nameAr: 'Name (Arabic)',
    nameKu: 'Name (Kurdish)',
    nameEn: 'Name (English)',
    namePlaceholder: 'Enter category name...',
    iconUrl: 'Icon URL (optional)',
    cancel: 'Cancel',
    save: 'Save',
    adminsOnly: 'Admins only.',
    saveError: 'Failed to save category',
  },
};

const emptyForm = { name: '', name_ar: '', name_ku: '', name_en: '', icon_url: '' };

export default function AdminCategories() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();

  const isKurdish = language?.includes('Kurdish') || language?.includes('کوردی') || language === 'ku';
  const isArabic = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';
  const isRtl = isArabic || isKurdish;

  let text = t.en;
  if (isArabic) text = t.ar;
  else if (isKurdish) text = t.ku;

  // دالة ترجمة اسم الفئة حسب اللغة الحالية (نفس أسلوب Home.jsx)
  const translateCategory = (name = '') => {
    const key = name.toLowerCase().trim();
    const entry = CATEGORY_NAME_TRANSLATIONS[key];
    if (!entry) return name;
    return isKurdish ? entry.ku : isArabic ? entry.ar : entry.en;
  };

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.getCategories().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const openNew = () => { setEditing({}); setForm(emptyForm); setError(''); };
  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      name_ar: cat.name_ar || '',
      name_ku: cat.name_ku || '',
      name_en: cat.name_en || '',
      icon_url: cat.icon_url || '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing.id) {
        await api.updateCategory(editing.id, form);
      } else {
        await api.createCategory(form);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || text.saveError);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  if (!isAdmin) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        {text.adminsOnly}
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#13091f] p-6 rounded-3xl border border-slate-200/80 dark:border-purple-900/30 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/60 dark:border-purple-500/20 text-purple-600 dark:text-purple-400"
          >
            <Grid3x3 className="w-6 h-6" />
          </motion.div>
          {text.pageTitle}
        </h1>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openNew}
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-5 py-3 rounded-2xl transition inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> {text.newCategory}
        </motion.button>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="text-center py-28 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-purple-300 text-sm">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>{text.loading}</span>
        </div>
      ) : categories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white dark:bg-[#13091f] rounded-3xl border border-slate-200/80 dark:border-purple-900/30 text-slate-400 text-sm shadow-sm"
        >
          {text.noCategories}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {categories.map((cat, index) => {
              const displayName = translateCategory(cat.name);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/30 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-purple-300 dark:hover:border-purple-500/40 transition-all"
                >
                  <span className="text-xs md:text-sm font-semibold truncate pr-2">{displayName}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(cat)}
                      className="p-2 rounded-xl text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer transition-colors"
                      title={text.editCategory}
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition-colors"
                      title={text.deleteCategory}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Popup */}
      <AnimatePresence>
        {editing !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-[#13091f] border border-slate-200/80 dark:border-purple-900/40 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-900/30 pb-4">
                <h3 className="text-base font-bold font-serif">{editing.id ? text.editTitle : text.newTitle}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditing(null)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">{text.name}</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={text.namePlaceholder}
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">{text.nameAr}</label>
                    <input
                      type="text" dir="rtl" value={form.name_ar}
                      onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">{text.nameKu}</label>
                    <input
                      type="text" dir="rtl" value={form.name_ku}
                      onChange={(e) => setForm({ ...form, name_ku: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">{text.nameEn}</label>
                    <input
                      type="text" value={form.name_en}
                      onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-purple-700 dark:text-purple-300 block">{text.iconUrl}</label>
                  <input
                    type="text" value={form.icon_url}
                    onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                    placeholder="https://example.com/icon.png"
                    className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/50 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    {text.cancel}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 cursor-pointer shadow-sm shadow-purple-500/20 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> {text.save}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}