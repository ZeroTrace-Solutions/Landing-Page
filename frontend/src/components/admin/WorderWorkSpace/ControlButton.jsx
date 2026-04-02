import React from 'react';

export const ControlButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`group relative p-2.5 rounded-xl border transition-all ${active ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'}`}
  >
    {icon}
    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/95 text-white text-[10px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 border border-white/10 backdrop-blur-xl">
      {label}
    </div>
  </button>
);