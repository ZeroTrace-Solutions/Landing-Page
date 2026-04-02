import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 5x7 Bitmap definitions for digits 0-9
const DIGIT_MAPS = {
  '0': [
    [0,1], [0,2], [0,3], [0,4], [0,5],
    [6,1], [6,2], [6,3], [6,4], [6,5],
    [1,0], [2,0], [3,0], [4,0], [5,0],
    [1,6], [2,6], [3,6], [4,6], [5,6]
  ],
  '1': [
    [1,1], [2,0], [3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6],
    [2,6], [4,6]
  ],
  '2': [
    [0,1], [1,0], [2,0], [3,0], [4,0], [5,1], [5,2], [4,3], [3,4], [2,5], [1,6],
    [0,6], [2,6], [3,6], [4,6], [5,6]
  ],
  '3': [
    [0,0], [1,0], [2,0], [3,0], [4,0], [5,1], [4,3], [3,3], [2,3], [5,5], [1,6],
    [0,6], [2,6], [3,6], [4,6], [5,1], [5,4]
  ],
  '4': [
    [0,0], [0,1], [0,2], [0,3], [1,3], [2,3], [3,3], [4,3], [5,3], [4,0], [4,1], [4,2], [4,4], [4,5], [4,6]
  ],
  '5': [
    [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [0,1], [0,2], [1,3], [2,3], [3,3], [4,3], [5,4], [5,5], [4,6], [3,6], [2,6], [1,6], [0,5]
  ],
  '6': [
    [3,0], [2,0], [1,1], [0,2], [0,3], [0,4], [0,5], [1,6], [2,6], [3,6], [4,6], [5,5], [5,4], [5,3], [4,3], [3,3], [2,3], [1,3], [0,3]
  ],
  '7': [
    [0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [5,1], [4,2], [3,3], [2,4], [1,5], [0,6]
  ],
  '8': [
    [1,0], [2,0], [3,0], [4,0], [0,1], [5,1], [0,2], [5,2], [1,3], [2,3], [3,3], [4,3], [0,4], [5,4], [0,5], [5,5], [1,6], [2,6], [3,6], [4,6]
  ],
  '9': [
    [1,0], [2,0], [3,0], [4,0], [0,1], [5,1], [0,2], [5,2], [1,3], [2,3], [3,3], [4,3], [5,3], [5,4], [5,5], [4,6], [3,6], [2,6]
  ]
};

const PARTICLE_COUNT = 30; // Number of particles per digit

const ParticleDigit = ({ value, currentStatus, isMaximized }) => {
  const points = useMemo(() => DIGIT_MAPS[value] || [], [value]);
  
  // Fill all particles with a point. If points are fewer than particles, reuse or hide.
  const particlePoints = useMemo(() => {
    const res = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i < points.length) {
        res.push({ x: points[i][0] * 12, y: points[i][1] * 12, opacity: 1, scale: 1 });
      } else {
        // Hide unused particles or cluster at center
        res.push({ x: 3 * 12, y: 3 * 12, opacity: 0, scale: 0 });
      }
    }
    return res;
  }, [points]);

  return (
    <div className={`relative ${isMaximized ? 'w-[75px] h-[100px]' : 'w-[50px] h-[70px]'}`}>
      {particlePoints.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            x: p.x,
            y: p.y,
            opacity: p.opacity,
            scale: p.scale,
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            mass: 1,
            delay: i * 0.005 // Stagger for organic reformation
          }}
          className={`absolute left-0 top-0 w-2 h-2 rounded-full blur-[1px] ${currentStatus === 'break' ? 'bg-amber-400' : 'bg-white'}`}
          style={{
            boxShadow: currentStatus === 'break' ? '0 0 8px rgba(251,191,36,0.8)' : '0 0 8px rgba(255,255,255,0.8)'
          }}
        />
      ))}
    </div>
  );
};

export const TimerDisplay = ({ timeObject, currentStatus, isMaximized }) => {
  const units = [
    { label: 'Hours', value: timeObject.H, id: 'H' },
    { label: 'Minutes', value: timeObject.M, id: 'M' },
    { label: 'Seconds', value: timeObject.S, id: 'S' }
  ];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4">
      <div className={`flex items-baseline ${isMaximized ? 'gap-6 md:gap-14' : 'gap-3 md:gap-8'}`}>
        {units.map((unit) => (
          <div key={unit.id} className="flex flex-col items-center gap-2 md:gap-4">
            <div className="flex gap-2 md:gap-3">
              {unit.value.split('').map((digit, dIdx) => (
                <ParticleDigit 
                  key={`${unit.id}-${dIdx}`} 
                  value={digit} 
                  currentStatus={currentStatus} 
                  isMaximized={isMaximized}
                />
              ))}
            </div>
            <span className={`text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold ${currentStatus === 'break' ? 'text-amber-400/50' : 'text-white/20'}`}>
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
