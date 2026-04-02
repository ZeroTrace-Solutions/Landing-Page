import React from 'react';
import Avatar from 'boring-avatars';
import { Users, Plus, Monitor } from 'lucide-react';

export const WorkerSidebar = ({ workers, selectedWorkerId, setSelectedWorkerId, setIsAddWorkerOpen }) => {
  const renderWorker = (worker) => {
    const initials = worker.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
    const isSelected = selectedWorkerId === worker.id;

    return (
      <button
        key={worker.id}
        onClick={() => setSelectedWorkerId(worker.id)}
        className={`relative group p-0.5 rounded-2xl transition-all duration-300 ${isSelected ? 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.45)]' : 'border border-white/10'} ${isSelected ? 'bg-cyan-500/10' : 'bg-transparent'}`}
      >
        <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden perspective-500">
          <div className="absolute inset-0 rounded-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 rounded-full backface-hidden">
              <img
                className="w-full h-full object-cover"
                alt={worker.name}
                src={`https://robohash.org/${encodeURIComponent(worker.avatar || worker.name)}.png?size=64x64`}
              />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 via-indigo-600 to-violet-700 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-black backface-hidden rotate-y-180">
              {initials}
            </div>
          </div>
        </div>

        <div className={`absolute -right-1 bottom-1 w-3 h-3 rounded-full border-2 border-black ${
          worker.status === 'clockin' ? 'bg-green-500' :
          worker.status === 'break' ? 'bg-yellow-500' :
          'bg-red-500'
        }`} />
      </button>
    );
  };

  return (
    <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-24 border-r border-white/5 flex flex-col items-center py-8 gap-6 z-20">
      <Users size={16} className="text-white/50 mb-4" />

      <div className="flex-grow flex flex-col gap-4 overflow-auto custom-scrollbar px-2 w-full items-center" data-lenis-prevent>
        {workers.map(renderWorker)}

        <button
          onClick={() => setIsAddWorkerOpen(true)}
          className="w-10 h-10 rounded-2xl border border-dashed border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4 border-t border-white/5 w-full flex justify-center">
        <Monitor size={14} className="text-white/50" />
      </div>
    </div>
  );
};