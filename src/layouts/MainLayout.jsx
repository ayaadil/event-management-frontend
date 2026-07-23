import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import BottomNavBar from '../components/layout/BottomNavBar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#120A28] text-slate-800 dark:text-white overflow-x-hidden transition-colors duration-200">
      {/* 1. السايدبار الجانبي ثابت العرض */}
      <Sidebar />

      {/* 2. المحتوى الرئيسي ياخذ باقي مساحة الشاشة بالكامل flex-1 */}
      <main className="flex-1 w-full overflow-y-auto p-6 md:p-8 pb-24 md:pb-8 min-w-0">
        <Outlet />
      </main>

      {/* 3. شريط التنقل السفلي للشاشات الصغيرة */}
      <BottomNavBar />
    </div>
  );
}