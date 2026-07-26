// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomNavBar from '../components/layout/BottomNavBar';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#120A28] text-slate-800 dark:text-white transition-colors duration-200">
      <Sidebar />

      <main className="flex-1 w-full overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 min-w-0">
        <Outlet />
      </main>

      <BottomNavBar />
    </div>
  );
}