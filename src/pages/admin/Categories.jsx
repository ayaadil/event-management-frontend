// src/pages/admin/Categories.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Grid3x3, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function AdminCategories() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const isRtl = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [form, setForm] = useState({ name: '', icon_url: '' });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.getCategories().then(setCategories).catch(() => setCategories([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const openNew = () => { setEditing({}); setForm({ name: '', icon_url: '' }); setError(''); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, icon_url: cat.icon_url || '' }); setError(''); };

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
      setError(err.message || 'Failed to save category');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        Admins only.
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-6 max-w-4xl mx-auto transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-2">
          <Grid3x3 className="w-6 h-6 text-purple-500" /> Manage Categories
        </h1>
        <button onClick={openNew} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl p-4 flex items-center justify-between shadow-sm dark:shadow-none">
              <span className="text-sm font-semibold">{cat.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-purple-900/30 pb-3">
              <h3 className="text-base font-bold">{editing.id ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-purple-700 dark:text-purple-200 block mb-1">Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-purple-700 dark:text-purple-200 block mb-1">Icon URL (optional)</label>
                <input
                  type="text" value={form.icon_url}
                  onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/60 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 cursor-pointer">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}