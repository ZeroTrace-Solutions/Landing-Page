import React from 'react';
import Avatar from 'boring-avatars';
import { Users, Plus, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WorkerSidebar = ({ workers, selectedWorkerId, setSelectedWorkerId, setIsAddWorkerOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const renderWorker = (worker) => {
    const initials = worker.name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
    const isSelected = selectedWorkerId === worker.id;

    return (
      <button
        key={worker.id}
        onClick={() => { setSelectedWorkerId(worker.id); setIsOpen(false); }}
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
    <>
      <button 
        className="lg:hidden absolute top-5 left-5 z-[55] w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-white hover:bg-white/10 active:scale-95 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed lg:absolute left-0 top-0 bottom-0 w-24 bg-black/95 lg:bg-transparent backdrop-blur-3xl border-r border-white/10 lg:border-white/5 flex flex-col items-center py-10 gap-6 z-[70] lg:z-20 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          className="lg:hidden absolute top-4 right-4 text-white/50 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <Users size={16} className="text-white/50 mb-4 mt-6 lg:mt-0" />

        <div className="flex-grow flex flex-col gap-4 overflow-auto custom-scrollbar px-2 w-full items-center" data-lenis-prevent>
          {workers.map(renderWorker)}

          <button
            onClick={() => { setIsAddWorkerOpen(true); setIsOpen(false); }}
            className="w-11 h-11 rounded-2xl border border-dashed border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="pt-4 pb-6 border-t border-white/5 w-full flex justify-center">
          <button 
            onClick={() => navigate('/admin')} 
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <LayoutDashboard size={18} />
          </button>
        </div>
      </div>
    </>
  );
};