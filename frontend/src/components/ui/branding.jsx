import React from 'react';
import { ZTLogo } from './ZTLogo';

export { ZTLogo };

export const Logo = ({ className = "", size = "hero", showSubtitle = true }) => {
  return (
    <div dir="ltr" className={`flex flex-col items-center justify-center text-white ${className}`}>
      {/* Official ZT Solutions Constellation Mark + Typography */}
      <ZTLogo size={size} showText={true} animated={true} />

      {/* Subtle Engineering Subtitle */}
      {showSubtitle && (
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-sky-400/40" />
          <span className="text-[9px] sm:text-[11px] font-mono tracking-[0.55em] text-white/50 uppercase -mr-[0.55em]">
            Digital Infrastructure &amp; SaaS
          </span>
          <div className="w-8 h-px bg-sky-400/40" />
        </div>
      )}
    </div>
  );
};

export default Logo;
