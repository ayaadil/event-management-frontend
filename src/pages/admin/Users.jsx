// src/pages/admin/Users.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, ShieldCheck, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const ROLES = ['user', 'organizer', 'admin'];

export default function AdminUsers() {
  const { language } = useLanguage();
  const { user: currentUser, isAdmin } = useAuth();
  const isRtl = language?.includes('Arabic') || language?.includes('العربية') || language === 'ar';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getUsers().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await api.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-slate-400 text-sm p-8 text-center">
        Admins only.
      </div>
    );
  }

  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 dark:bg-[#0b0712] text-slate-900 dark:text-white p-6 md:p-10 font-sans space-y-6 max-w-5xl mx-auto transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-500" /> Manage Users
          </h1>
          <p className="text-slate-600 dark:text-purple-300/60 text-xs mt-1">{users.length} total users</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className={`w-4 h-4 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-purple-500`} />
          <input
            type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-xl py-2.5 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} text-xs focus:outline-none focus:border-purple-500`}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-sm">Loading...</div>
      ) : (
        <div className="bg-white dark:bg-[#150a21] border border-slate-200 dark:border-purple-900/40 rounded-2xl overflow-hidden shadow-md dark:shadow-xl">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-[#0b0712] text-slate-500 dark:text-purple-300/60">
              <tr>
                <th className="p-4 text-start">Name</th>
                <th className="p-4 text-start">Email</th>
                <th className="p-4 text-start">Role</th>
                <th className="p-4 text-start">Joined</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 dark:border-purple-900/20">
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser?.id || savingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-50 dark:bg-[#0b0712] border border-slate-200 dark:border-purple-900/40 rounded-lg px-2 py-1.5 text-xs cursor-pointer disabled:opacity-50"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === currentUser?.id}
                      className="text-rose-500 hover:text-rose-600 disabled:opacity-30 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}