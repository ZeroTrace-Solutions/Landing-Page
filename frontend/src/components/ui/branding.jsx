import { animate, stagger } from 'animejs';
import { useEffect, useRef } from 'react';

export const Logo = ({ size = "lg", className = "" }) => {
  const logoRef = useRef(null);
  const logoMarkRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Cinematic entrance for the logo mark (Coming from far Z)
    animate(logoMarkRef.current, {
      opacity: [0, 1],
      scale: [0.2, 1],
      filter: ['blur(40px)', 'blur(0px)'],
      duration: 2500,
      easing: 'easeOutExpo'
    });

    // Initial entrance animation for text
    const letters = textRef.current.querySelectorAll('.letter');
    animate(letters, {
      opacity: [0, 1],
      scale: [1.5, 1],
      filter: ['blur(20px)', 'blur(0px)'],
      delay: stagger(50, { start: 400 }),
      duration: 1500,
      easing: 'easeOutExpo'
    });
  }, []);

  return (
    <div ref={logoRef} className={`flex flex-col items-center justify-center text-white ${className}`}>
      {/* Official Logo.png Mark */}
      <div ref={logoMarkRef} className="relative mb-8 select-none">
        <img 
          src="/logo.png" 
          alt="ZeroTrace" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] brightness-110"
        />
      </div>


      {/* Synchronized Typography */}
      <div ref={textRef} className="flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight logo-font text-glow flex">
          {"ZERO TRACE".split("").map((l, i) => (
            <span key={i} className="letter inline-block">{l === " " ? "\u00A0" : l}</span>
          ))}
        </h1>
        <div className="mt-4 flex justify-center w-full">
          <h2 className="text-lg md:text-2xl font-light tracking-[0.8em] sub-logo-font text-white/30 -mr-[0.8em] flex">
            {"SOLUTIONS".split("").map((l, i) => (
              <span key={i} className="letter inline-block">{l}</span>
            ))}
          </h2>
        </div>
      </div>
    </div>
  );
};




