import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // إظهار مؤشر تحميل أثناء التحقق من حالة تسجيل الدخول
  if (loading) {
    return (
      <div className="min-h-screen bg-[#120A28] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // إذا لم يكن مسجلاً الدخول، يتم التوجيه لصفحة الـ Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان مسجلاً الدخول، اعرض الصفحات المحمية
  return <Outlet />;
}