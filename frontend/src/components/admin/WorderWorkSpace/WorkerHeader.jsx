import React from 'react';
import { Clock, BookOpen, CheckSquare, History, LayoutDashboard } from 'lucide-react';
import { ControlButton } from './ControlButton';

export const WorkerHeader = ({ selectedWorker, activeWindows, toggleWindow, onAvatarChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  React.useEffect(() => {
    setIsCollapsed(window.innerWidth < 1024);
  }, []);

  return (
    <div className="w-full bg-white/6 border border-white/15 rounded-3xl backdrop-blur-xl mb-4 lg:mb-8 p-4 sm:p-5 shadow-[0_0_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.4)] relative z-10 transition-all duration-300">
      <div 
        className="flex flex-row items-center justify-between gap-4 cursor-pointer lg:cursor-default"
        onClick={() => { if (window.innerWidth < 1024) setIsCollapsed(!isCollapsed); }}
      >
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

        <button className="lg:hidden p-2 bg-white/5 rounded-full text-white/50 border border-white/10 hover:bg-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div className="hidden lg:flex items-center gap-3 flex-wrap">
          <p className="text-[11px] text-white/70 font-medium">Change avatar</p>
          <div className="grid grid-cols-5 gap-2">
            {['default', 'blue-dragon', 'neon-robot', 'purple-galaxy', 'gradient-arc'].map((seed) => {
              const value = seed === 'default' ? selectedWorker.name : seed;
              const isActive = (selectedWorker.avatar || selectedWorker.name) === value;
              return (
                <button
                  key={seed}
                  type="button"
                  onClick={() => onAvatarChange && onAvatarChange(value)}
                  className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#111]' : 'hover:ring-2 hover:ring-white/40'}`}
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

      <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out lg:!grid-rows-[1fr] lg:!opacity-100 lg:!mt-4 ${isCollapsed ? 'grid-rows-[0fr] opacity-0 mt-0' : 'grid-rows-[1fr] opacity-100 mt-4'}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 lg:hidden pt-4 border-t border-white/10 mb-4">
            <p className="text-[11px] text-white/70 font-medium">Change avatar</p>
            <div className="flex gap-2 justify-between">
              {['default', 'blue-dragon', 'neon-robot', 'purple-galaxy', 'gradient-arc'].map((seed) => {
                const value = seed === 'default' ? selectedWorker.name : seed;
                const isActive = (selectedWorker.avatar || selectedWorker.name) === value;
                return (
                  <button
                    key={seed}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onAvatarChange && onAvatarChange(value); }}
                    className={`w-[18%] aspect-square rounded-full flex-shrink-0 overflow-hidden transition-all duration-200 ${isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#111]' : 'hover:ring-2 hover:ring-white/40'}`}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ControlButton icon={<Clock size={16} />} label="Timer" active={activeWindows[selectedWorker.id]?.timer} onClick={(e) => { e.stopPropagation(); toggleWindow(selectedWorker.id, 'timer'); }} />
            <ControlButton icon={<BookOpen size={16} />} label="Notes" active={activeWindows[selectedWorker.id]?.notebook} onClick={(e) => { e.stopPropagation(); toggleWindow(selectedWorker.id, 'notebook'); }} />
            <ControlButton icon={<CheckSquare size={16} />} label="Checklist" active={activeWindows[selectedWorker.id]?.checklist} onClick={(e) => { e.stopPropagation(); toggleWindow(selectedWorker.id, 'checklist'); }} />
            <ControlButton icon={<History size={16} />} label="History" active={activeWindows[selectedWorker.id]?.history} onClick={(e) => { e.stopPropagation(); toggleWindow(selectedWorker.id, 'history'); }} />
          </div>
        </div>
      </div>
    </div>
  );
};