import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { loadFull } from 'tsparticles';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';
import { TimerParticles } from './TimerParticles';
import { buildDigitTargets } from './TimerUtils';
import { calculateElapsedTime } from './calculationUtils';

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
  onSync
}) => {
  const particlesContainer = useRef(null);
  const animationFrame = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('clockout');
  const [digitTargets, setDigitTargets] = useState(() => buildDigitTargets({ H: '00', M: '00', S: '00' }));

  const [localBgStyle, setLocalBgStyle] = useState(timerBgStyle);

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
      engine.checkVersion = () => {};
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

  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-br ${currentBgClass} text-white transition-all duration-700 ${isMaximized ? 'pb-32 pt-8' : 'pb-24'}`}>
      
      {/* Background Selector Bubbles */}
      <div className="absolute top-4 right-4 z-[40] flex items-center gap-2 p-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
        {bgStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleChange(style.id)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${style.color} ${localBgStyle === style.id ? 'scale-125 ring-2 ring-white/40 ring-offset-2 ring-offset-black/20 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-40 hover:opacity-80 scale-100'}`}
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

      <TimerParticles init={particlesInit} loaded={particlesLoaded} />
      <TimerDisplay timeObject={timeObject} currentStatus={currentStatus} isMaximized={isMaximized} />
      <TimerControls 
        currentStatus={currentStatus}
        onClockIn={onClockIn}
        onClockOut={onClockOut}
        onTakeBreak={onTakeBreak}
        onEndBreak={onEndBreak}
        isMaximized={isMaximized}
      />
    </div>
  );
};
