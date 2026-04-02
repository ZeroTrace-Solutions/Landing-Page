import React from 'react';
import { Clock, BookOpen, CheckSquare, History, LayoutDashboard } from 'lucide-react';
import { ControlButton } from './ControlButton';

export const WorkerHeader = ({ selectedWorker, activeWindows, toggleWindow, onAvatarChange }) => (
  <div className="w-full bg-white/6 border border-white/15 rounded-3xl backdrop-blur-xl mb-8 p-4 sm:p-5 shadow-[0_0_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.4)]">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-3">
      <div className="flex flex-1 items-center gap-3 md:gap-4">
        <img
          alt="worker"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 shadow-md"
          src={`https://robohash.org/${encodeURIComponent(selectedWorker.avatar || selectedWorker.name)}.png?size=96x96`}
        />
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white truncate">{selectedWorker.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${selectedWorker.status === 'clockin' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : selectedWorker.status === 'break' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
            <span className="text-[12px] font-bold text-white/90">
              {selectedWorker.status === 'clockin' ? 'Clocked In' : selectedWorker.status === 'break' ? 'On Break' : 'Clocked Out'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-2 md:flex-none flex-wrap">
        <p className="text-[11px] text-white/70 mb-1 lg:mb-0 font-medium">Change avatar</p>
        <div className="grid grid-cols-5 gap-2">
          {['default', 'blue-dragon', 'neon-robot', 'purple-galaxy', 'gradient-arc'].map((seed) => {
            const value = seed === 'default' ? selectedWorker.name : seed;
            const isActive = (selectedWorker.avatar || selectedWorker.name) === value;
            return (
              <button
                key={seed}
                type="button"
                onClick={() => onAvatarChange && onAvatarChange(value)}
                className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-indigo-950' : 'hover:ring-2 hover:ring-white/40'}`}
              >
                <img
                  alt={seed}
                  src={`https://robohash.org/${encodeURIComponent(value)}.png?size=64x64`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      <ControlButton icon={<Clock size={16} />} label="Timer" active={activeWindows[selectedWorker.id]?.timer} onClick={() => toggleWindow(selectedWorker.id, 'timer')} />
      <ControlButton icon={<BookOpen size={16} />} label="Notes" active={activeWindows[selectedWorker.id]?.notebook} onClick={() => toggleWindow(selectedWorker.id, 'notebook')} />
      <ControlButton icon={<CheckSquare size={16} />} label="Checklist" active={activeWindows[selectedWorker.id]?.checklist} onClick={() => toggleWindow(selectedWorker.id, 'checklist')} />
      <ControlButton icon={<History size={16} />} label="History" active={activeWindows[selectedWorker.id]?.history} onClick={() => toggleWindow(selectedWorker.id, 'history')} />
    </div>
  </div>
);