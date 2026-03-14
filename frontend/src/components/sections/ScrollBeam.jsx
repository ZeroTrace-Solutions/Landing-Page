import { motion as Motion, useScroll, useSpring } from 'framer-motion';

export const ScrollBeam = () => {
  const { scrollYProgress } = useScroll();

  // Smooth the scroll progress for a more "liquid" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div className="absolute left-1/2 top-[110vh] -translate-x-1/2 w-px z-[5] pointer-events-none h-[calc(100%-110vh)]">
      {/* The main beam body */}
      <Motion.div
        style={{
          scaleY: smoothProgress,
          originY: 0
        }}
        className="w-full h-full relative"
      >
        {/* Core Line with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

        {/* Multilayered Glow for "Beam" effect */}
        <div className="absolute inset-x-[-1px] bg-white/30 blur-[2px]" />
        <div className="absolute inset-x-[-3px] bg-white/10 blur-[10px]" />
        <div className="absolute inset-x-[-10px] bg-white/[0.03] blur-[25px]" />

        {/* The Leading Tip (Glow Point) */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-full w-full">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_20px_white]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 rounded-full blur-md animate-pulse" />
        </div>
      </Motion.div>
    </div>
  );
};
