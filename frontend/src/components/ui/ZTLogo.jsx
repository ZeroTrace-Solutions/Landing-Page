import React from 'react';
import { motion } from 'framer-motion';

/**
 * ZTLogo - Official Constellation Logo for ZT Solutions
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'hero' | 'responsive'
 * @param {boolean} showText - whether to render the 'ZT SOLUTIONS' typography
 * @param {boolean} animated - whether to enable beacon pulsation and glow
 * @param {string} className - extra CSS classes
 */
export const ZTLogo = ({
  size = 'md',
  showText = true,
  animated = true,
  className = '',
  onClick
}) => {
  // Dimensions map
  const dimensions = {
    sm: { width: 140, height: 115, fontSize: 34 },
    md: { width: 280, height: 230, fontSize: 34 },
    lg: { width: 420, height: 345, fontSize: 34 },
    hero: { width: '100%', maxWidth: 520, height: 'auto', fontSize: 34 },
    responsive: { width: '100%', height: 'auto', fontSize: 34 }
  };

  const dim = dimensions[size] || dimensions.md;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width: typeof dim.width === 'number' ? `${dim.width}px` : dim.width,
        maxWidth: dim.maxWidth ? `${dim.maxWidth}px` : undefined,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={showText ? "0 0 800 650" : "280 60 260 470"}
        className="w-full h-auto overflow-visible drop-shadow-[0_0_40px_rgba(56,189,248,0.15)]"
      >
        <defs>
          {/* Cyan Beacon Glow Gradient */}
          <radialGradient id="ztBeaconGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="35%" stopColor="#0284c7" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#0369a1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
          </radialGradient>

          {/* Star Node Radial Halo */}
          <radialGradient id="ztNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#bae6fd" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Soft Filter */}
          <filter id="ztSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Nebula Bloom */}
          <filter id="ztDeepBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="26" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g id="constellation-network">
          {/* Ambient Glow Paths */}
          <g opacity="0.35" filter="url(#ztSoftGlow)">
            <line x1="318" y1="285" x2="416" y2="262" stroke="#38bdf8" strokeWidth="5" />
            <line x1="416" y1="262" x2="322" y2="446" stroke="#38bdf8" strokeWidth="5" />
            <line x1="322" y1="446" x2="310" y2="502" stroke="#38bdf8" strokeWidth="5" />
            <line x1="310" y1="502" x2="344" y2="486" stroke="#38bdf8" strokeWidth="5" />
            <line x1="344" y1="486" x2="322" y2="446" stroke="#38bdf8" strokeWidth="5" />
            <line x1="344" y1="486" x2="430" y2="455" stroke="#38bdf8" strokeWidth="5" />
            <line x1="430" y1="455" x2="462" y2="152" stroke="#38bdf8" strokeWidth="6" />
          </g>

          {/* Crisp Primary Constellation Lines */}
          <line x1="318" y1="285" x2="416" y2="262" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="416" y1="262" x2="352" y2="390" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="352" y1="390" x2="322" y2="446" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="322" y1="446" x2="310" y2="502" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="310" y1="502" x2="344" y2="486" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="344" y1="486" x2="322" y2="446" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="344" y1="486" x2="430" y2="455" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.5" />
          <line x1="430" y1="455" x2="462" y2="152" stroke="#ffffff" strokeOpacity="0.95" strokeWidth="2.8" />

          {/* Star Nodes (White Stars with Halo) */}
          <g>
            {/* Node 1 */}
            <circle cx="318" cy="285" r="9" fill="url(#ztNodeGlow)" />
            <circle cx="318" cy="285" r="5" fill="#ffffff" />

            {/* Node 2 */}
            <circle cx="416" cy="262" r="9" fill="url(#ztNodeGlow)" />
            <circle cx="416" cy="262" r="5" fill="#ffffff" />

            {/* Node 3 */}
            <circle cx="352" cy="390" r="8" fill="url(#ztNodeGlow)" />
            <circle cx="352" cy="390" r="4.5" fill="#ffffff" />

            {/* Node 4 */}
            <circle cx="322" cy="446" r="8" fill="url(#ztNodeGlow)" />
            <circle cx="322" cy="446" r="4.5" fill="#ffffff" />

            {/* Node 5 */}
            <circle cx="310" cy="502" r="9" fill="url(#ztNodeGlow)" />
            <circle cx="310" cy="502" r="5" fill="#ffffff" />

            {/* Node 6 */}
            <circle cx="344" cy="486" r="9" fill="url(#ztNodeGlow)" />
            <circle cx="344" cy="486" r="5" fill="#ffffff" />

            {/* Node 7 */}
            <circle cx="430" cy="455" r="9" fill="url(#ztNodeGlow)" />
            <circle cx="430" cy="455" r="5.5" fill="#ffffff" />
          </g>

          {/* RADIANT NORTH STAR (Beacon) */}
          <g id="beacon-star">
            {/* Outer deep nebula aura */}
            <motion.circle
              cx="462"
              cy="152"
              r="85"
              fill="url(#ztBeaconGlow)"
              filter="url(#ztDeepBloom)"
              animate={animated ? { scale: [0.95, 1.12, 0.95], opacity: [0.75, 1, 0.75] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "462px 152px" }}
            />
            {/* Inner intense cyan disc */}
            <circle cx="462" cy="152" r="48" fill="url(#ztBeaconGlow)" opacity="0.9" />

            {/* 4-Pointed Radiant Flare Spikes */}
            <motion.g
              filter="url(#ztSoftGlow)"
              animate={animated ? { rotate: [0, 2, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              style={{ transformOrigin: "462px 152px" }}
            >
              {/* Vertical flare */}
              <polygon points="462,82 467,147 462,222 457,147" fill="#38bdf8" />
              <polygon points="462,94 465,148 462,210 459,148" fill="#e0f2fe" />
              
              {/* Horizontal cross flare */}
              <polygon points="402,152 458,156 522,152 458,148" fill="#38bdf8" />
              <polygon points="414,152 459,155 510,152 459,149" fill="#e0f2fe" />

              {/* Brilliant Star Core */}
              <circle cx="462" cy="152" r="5" fill="#ffffff" />
            </motion.g>
          </g>
        </g>

        {/* Wordmark Typography */}
        {showText && (
          <text
            x="400"
            y="595"
            textAnchor="middle"
            fill="#ffffff"
            className="tracking-[0.28em] font-black"
            style={{
              fontFamily: "system-ui, -apple-system, 'Inter', 'Outfit', sans-serif",
              fontSize: "33px",
              fontWeight: 800,
              letterSpacing: "0.28em",
              textTransform: "uppercase"
            }}
          >
            ZT SOLUTIONS
          </text>
        )}
      </svg>
    </div>
  );
};

export default ZTLogo;
