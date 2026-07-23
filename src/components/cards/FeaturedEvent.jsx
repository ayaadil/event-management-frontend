import React from 'react';

export default function FeaturedEvent() {
  return (
    <div className="w-full bg-[#1B1938] border border-white/5 rounded-3xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-xl">
      
      
      <div className="relative w-full md:w-1/2 h-60 rounded-2xl overflow-hidden flex-shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" 
          alt="Live Music Night 2026" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black font-extrabold text-xs px-3 py-2 rounded-2xl text-center shadow-lg">
          <span className="block text-base leading-none text-[#120A28]">24</span>
          <span className="block text-[10px] text-purple-700 tracking-wider">MAY</span>
        </div>
      </div>

      
      <div className="w-full md:w-1/2 flex flex-col justify-between h-60 py-1">
        
        
        <div className="flex justify-between items-center">
          <span className="bg-purple-600/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">
            Featured
          </span>
          <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition">
            ♡
          </button>
        </div>

       
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Live Music Night 2026
        </h2>

        
        <div className="flex flex-col space-y-2 text-gray-300 text-sm">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="text-gray-400">Duhok, pako pablo gardens</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎵</span>
            <span className="text-gray-400">Music</span>
          </div>
        </div>

      
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-purple-400">👥</span>
            <span>+200 going</span>
          </div>

          <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-purple-600/30">
            Get Ticket
          </button>
        </div>

      </div>

    </div>
  );
}