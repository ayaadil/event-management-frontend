import React from 'react';
// استدعاء أيقونة بسيطة من المكتبة التي قمتِ بتثبيتها
import { CheckCircle2 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center border border-slate-100">
        
        {/* أيقونة للتحقق */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
        </div>

        {/* نصوص لتجربة الخطوط وتنسيقات Tailwind */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          المشروع يعمل بنجاح! 🎉
        </h1>
        
        <p className="text-slate-600 mb-6 text-sm">
          تم إعداد جميع المكتبات (Tailwind CSS, Lucide Icons) وهي جاهزة لبناء مشروع إدارة الفعاليات الخاص بكِ.
        </p>

        {/* زر بسيط لتجربة تفاعل التنسيقات */}
        <button 
          onClick={() => alert('أهلاً بكِ في المشروع!')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer"
        >
          اضغطي هنا للتجربة
        </button>
      </div>
    </div>
  );
}

export default App;