import React from 'react';
import { Play, Pause, PowerOff } from 'lucide-react';

export const TimerControls = ({ currentStatus, onClockIn, onClockOut, onTakeBreak, onEndBreak, isMaximized }) => (
  <div className={`z-40 absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 ${isMaximized ? 'px-8 py-5 scale-110' : 'px-5 py-3'}`}>
    <div className="flex items-center gap-2 px-3 border-r border-white/10 mr-2">
      <div className={`w-2 h-2 rounded-full animate-pulse ${currentStatus === 'clockin' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : currentStatus === 'break' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]' : 'bg-slate-500'}`} />
      <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
        {currentStatus === 'clockin' ? 'CLOCKED IN' : currentStatus === 'break' ? 'ON BREAK' : 'CLOCKED OUT'}
      </span>
    </div>

    <div className="flex items-center gap-4">
      {currentStatus === 'clockout' ? (
        <button
          onClick={onClockIn}
          className="group relative flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-100 transition-all hover:scale-110 hover:bg-cyan-400/20 active:scale-95 h-12 w-12"
        >
          <Play size={20} className="fill-cyan-400/20 ml-0.5" />
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all group-hover:-top-14 whitespace-nowrap bg-cyan-950/90 border border-cyan-400/20 px-3 py-1.5 rounded-lg text-cyan-200 pointer-events-none z-[100]">
            CLOCK IN
          </span>
        </button>
      ) : (
        <>
          {currentStatus === 'clockin' ? (
            <button
              onClick={onTakeBreak}
              className="group relative flex items-center justify-center rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-100 transition-all hover:scale-110 hover:bg-orange-400/20 active:scale-95 h-12 w-12"
            >
              <Pause size={20} className="fill-orange-400/20" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all group-hover:-top-14 whitespace-nowrap bg-orange-950/90 border border-orange-400/20 px-3 py-1.5 rounded-lg text-orange-200 pointer-events-none z-[100]">
                TAKE A BREAK
              </span>
            </button>
          ) : (
            <button
              onClick={onEndBreak}
              className="group relative flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-100 transition-all hover:scale-110 hover:bg-emerald-400/20 active:scale-95 h-12 w-12"
            >
              <Play size={20} className="fill-emerald-400/20 ml-0.5" />
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all group-hover:-top-14 whitespace-nowrap bg-emerald-950/90 border border-emerald-400/20 px-3 py-1.5 rounded-lg text-emerald-200 pointer-events-none z-[100]">
                RESUME
              </span>
            </button>
          )}
          <button
            onClick={onClockOut}
            className="group relative flex items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-100 transition-all hover:scale-110 hover:bg-red-500/20 active:scale-95 h-12 w-12"
          >
            <PowerOff size={20} />
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-wider opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all group-hover:-top-14 whitespace-nowrap bg-red-950/90 border border-red-500/20 px-3 py-1.5 rounded-lg text-red-200 pointer-events-none z-[100]">
              CLOCK OUT
            </span>
          </button>
        </>
      )}
    </div>
  </div>
);
