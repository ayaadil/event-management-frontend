import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, Briefcase, Music, Palette, Megaphone, Gamepad2, MoreHorizontal 
} from 'lucide-react';

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    { title: 'Technology', icon: Laptop, color: 'text-sky-400' },
    { title: 'Business', icon: Briefcase, color: 'text-sky-400' },
    { title: 'Music', icon: Music, color: 'text-orange-400' },
    { title: 'Design', icon: Palette, color: 'text-indigo-400' },
    { title: 'Marketing', icon: Megaphone, color: 'text-yellow-400' },
    { title: 'Gaming', icon: Gamepad2, color: 'text-green-400' },
  ];

  return (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-serif text-white">Categories</h2>
        
        {/* زر See All ينقل لصفحة التصنيفات */}
        <button 
          onClick={() => navigate('/categories')}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer"
        >
          See all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div 
              key={idx}
              onClick={() => navigate(`/categories?type=${cat.title}`)}
              className="bg-[#150a21] hover:bg-[#1f0d33] border border-purple-900/30 hover:border-purple-600/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 text-center"
            >
              <Icon className={`w-6 h-6 ${cat.color}`} />
              <span className="text-xs font-medium text-slate-200">{cat.title}</span>
            </div>
          );
        })}

        {/* كرت More ينقل لصفحة التصنيفات */}
        <div 
          onClick={() => navigate('/categories')}
          className="bg-[#150a21] hover:bg-[#1f0d33] border border-purple-900/30 hover:border-purple-600/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 text-center"
        >
          <MoreHorizontal className="w-6 h-6 text-white" />
          <span className="text-xs font-medium text-slate-200">More</span>
        </div>
      </div>
    </section>
  );
}