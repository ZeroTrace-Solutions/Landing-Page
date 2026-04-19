import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Check, Lock } from 'lucide-react';
import { loadFull } from 'tsparticles';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerParticles } from './TimerParticles';
import { buildDigitTargets } from './TimerUtils';
import { calculateElapsedTime, formatTime } from './calculationUtils';

export const WorkTimer = ({
  workerId,
  workStatus = [],
  workTimes = [],
  onClockIn,
  onClockOut,
  onTakeBreak,
  onEndBreak,
  isMaximized = false,
  timerBgStyle = 'cosmic',
  onSync,
  categories = [],
  onAddCategory,
  workLabels = [],
}) => {
  const particlesContainer = useRef(null);
  const animationFrame = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('clockout');
  const [digitTargets, setDigitTargets] = useState(() => buildDigitTargets({ H: '00', M: '00', S: '00' }));

  const [localBgStyle, setLocalBgStyle] = useState(timerBgStyle);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Auto-select latest label when clocked out or worker changes
  useEffect(() => {
    if (currentStatus === 'clockout' && workLabels && workLabels.length > 0) {
      const lastLabel = [...workLabels].reverse().find(l => l && l.trim() !== '');
      setSelectedLabel(lastLabel || '');
    }
  }, [currentStatus, workerId, workLabels]); // Only reset on status change, worker change, or labels update

  const bgStyles = [
    { id: 'cosmic', color: 'bg-slate-500', class: 'from-slate-950 via-slate-900 to-slate-900', label: 'Cosmic' },
    { id: 'emerald', color: 'bg-emerald-500', class: 'from-black via-emerald-950 to-emerald-900', label: 'Emerald' },
    { id: 'violet', color: 'bg-indigo-500', class: 'from-black via-violet-950 to-violet-900', label: 'Violet' },
    { id: 'zinc', color: 'bg-zinc-500', class: 'from-black via-zinc-900 to-zinc-800', label: 'Monotone' },
    { id: 'solar', color: 'bg-amber-500', class: 'from-black via-amber-950 to-amber-900', label: 'Solar' },
  ];

  useEffect(() => {
    setLocalBgStyle(timerBgStyle);
  }, [timerBgStyle]);

  const currentBgClass = useMemo(() => {
    const found = bgStyles.find(b => b.id === localBgStyle);
    return found ? found.class : bgStyles[0].class;
  }, [localBgStyle]);

  const handleStyleChange = (id) => {
    setLocalBgStyle(id);
    if (onSync) onSync('timerBgStyle', id);
  };

  const timeObject = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(elapsedTime / 1000));
    return {
      H: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
      M: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
      S: String(totalSeconds % 60).padStart(2, '0')
    };
  }, [elapsedTime]);

  useEffect(() => {
    if (!workStatus || !workStatus.length || !workTimes || !workTimes.length) {
      setElapsedTime(0);
      setCurrentStatus('clockout');
      return;
    }

    const activeStatus = workStatus[workStatus.length - 1];
    setCurrentStatus(activeStatus || 'clockout');

    const compute = () => {
      const now = Date.now();
      const elapsed = calculateElapsedTime(workStatus, workTimes, now);
      setElapsedTime(elapsed);
    };

    compute();
    const timer = setInterval(compute, 1000);
    return () => clearInterval(timer);
  }, [workStatus, workTimes]);

  useEffect(() => {
    setDigitTargets(buildDigitTargets(timeObject));
  }, [timeObject]);

  const particlesInit = useCallback(async (engine) => {
    // Compatibility hack for tsparticles v3/v2 mismatch
    if (engine && !engine.checkVersion) {
      engine.checkVersion = () => { };
    }
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    particlesContainer.current = container;
  }, []);

  useEffect(() => {
    const animateDigits = () => {
      const container = particlesContainer.current;
      if (!container) {
        animationFrame.current = requestAnimationFrame(animateDigits);
        return;
      }
      const canvasSize = container.canvas?.size || { width: 0, height: 0 };
      const particles = (container.particles && container.particles.array) || [];
      const targetLength = digitTargets.length;

      particles.forEach((p, index) => {
        if (!p.position || !p.velocity) return;
        const target = targetLength ? digitTargets[index % targetLength] : { x: Math.random(), y: Math.random() };
        const desiredX = (target.x || Math.random()) * canvasSize.width;
        const desiredY = (target.y || Math.random()) * canvasSize.height;
        const dx = desiredX - p.position.x;
        const dy = desiredY - p.position.y;
        p.velocity.x = p.velocity.x * 0.82 + dx * 0.014 + (Math.random() - 0.5) * 0.4;
        p.velocity.y = p.velocity.y * 0.82 + dy * 0.014 + (Math.random() - 0.5) * 0.4;
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        if (p.position.x < 0 || p.position.x > canvasSize.width) p.position.x = Math.random() * canvasSize.width;
        if (p.position.y < 0 || p.position.y > canvasSize.height) p.position.y = Math.random() * canvasSize.height;
        if (p.size) p.size.value = 1 + Math.sin(Date.now() / 260 + index * 0.3) * 1.5;
      });
      animationFrame.current = requestAnimationFrame(animateDigits);
    };
    animationFrame.current = requestAnimationFrame(animateDigits);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [digitTargets]);

  const handleClockIn = () => {
    onClockIn(selectedLabel);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const id = await onAddCategory(newCatName.trim());
      setSelectedLabel(newCatName.trim());
      setNewCatName('');
      setIsCategoryOpen(false);
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-br ${currentBgClass} text-white transition-all duration-700 ${isMaximized ? 'pb-32 pt-8' : 'pb-24'}`}>

      {/* Background Selector Bubbles */}
      <div className="absolute top-4 right-4 z-[40] flex items-center gap-3 p-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
        {/* Category Label Selector */}
        <div className="relative">
          <button
            onClick={() => currentStatus === 'clockout' && setIsCategoryOpen(!isCategoryOpen)}
            className={`group relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2 rounded-2xl transition-all duration-500 border ${currentStatus !== 'clockout' ? 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed' : selectedLabel ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/20' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
            title={currentStatus !== 'clockout' ? 'Label is locked during session' : 'Select session label'}
          >
            {currentStatus !== 'clockout' ? (
              <Lock size={12} className="text-white/20 flex-shrink-0" />
            ) : (
              <Tag size={12} className={`transition-transform duration-500 group-hover:rotate-12 flex-shrink-0 ${selectedLabel ? 'text-cyan-400' : 'text-white/20'}`} />
            )}
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-center sm:text-left leading-tight max-w-[80px] sm:max-w-none break-words sm:whitespace-nowrap">
              {selectedLabel || 'Label'}
            </span>
            {selectedLabel && currentStatus === 'clockout' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-1 pl-3 border-l border-white/10">
          {bgStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleStyleChange(style.id)}
              className={`group relative w-2.5 h-2.5 rounded-full transition-all duration-500 ${style.color} ${localBgStyle === style.id ? 'scale-125 ring-2 ring-white/40 ring-offset-2 ring-offset-black/40 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'opacity-30 hover:opacity-100 scale-90'}`}
              title={style.label}
            >
              {localBgStyle === style.id && (
                <motion.div
                  layoutId="activeBgBubble"
                  className="absolute inset-0 rounded-full bg-white/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Repositioned Modal for better mobile visibility */}
      <AnimatePresence>
        {isCategoryOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute z-[60] bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] overflow-hidden 
              ${isMaximized 
                ? 'top-20 right-6 w-72' 
                : 'top-16 right-4 left-4 sm:left-auto sm:w-64'
              }`}
          >
            {/* Header glow */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

            <div className="relative p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Active Categories
                </p>
                <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              
              <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar pr-1">
                <button
                  onClick={() => { setSelectedLabel(''); setIsCategoryOpen(false); }}
                  className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${!selectedLabel ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'hover:bg-white/5 text-white/50 hover:text-white/80'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${!selectedLabel ? 'bg-cyan-400' : 'bg-white/10 group-hover:bg-white/30'}`} />
                    <span className="text-[11px] font-bold tracking-wide">Standard Session</span>
                  </div>
                  {!selectedLabel && <Check size={14} className="text-cyan-400" />}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedLabel(cat.name); setIsCategoryOpen(false); }}
                    className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${selectedLabel === cat.name ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-transparent border border-transparent hover:bg-white/5 text-white/50 hover:text-white/80'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={12} className={`transition-colors ${selectedLabel === cat.name ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/40'}`} />
                      <span className="text-[11px] font-bold tracking-wide">{cat.name}</span>
                    </div>
                    {selectedLabel === cat.name && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative p-4 bg-black/40">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 px-1">
                System Global Label
              </p>
              <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl focus-within:border-cyan-500/30 transition-all duration-300">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Enter new label..."
                  className="flex-grow bg-transparent px-3 py-1.5 text-[11px] font-medium text-white placeholder:text-white/20 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCatName.trim()}
                  className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${newCatName.trim() ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TimerParticles init={particlesInit} loaded={particlesLoaded} />
      <TimerDisplay timeObject={timeObject} currentStatus={currentStatus} isMaximized={isMaximized} />

      <TimerControls
        currentStatus={currentStatus}
        onClockIn={handleClockIn}
        onClockOut={onClockOut}
        onTakeBreak={onTakeBreak}
        onEndBreak={onEndBreak}
        isMaximized={isMaximized}
      />
    </div>
  );
};
