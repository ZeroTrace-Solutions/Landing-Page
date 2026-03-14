import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { ScrollBeam } from '@/components/sections/ScrollBeam';
import { CorePillars } from '@/components/sections/CorePillars';
import { ProtocolStack } from '@/components/sections/ProtocolStack';
import { AlexandriaLab } from '@/components/sections/AlexandriaLab';
import { FinalCall } from '@/components/sections/FinalCall';
import { Footer } from '@/components/sections/Footer';

export const Main = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Overlay Layers - Glass Nebula */}
      <div className="fixed inset-0 bg-space-gradient pointer-events-none mix-blend-screen opacity-10 z-[2]" />

      <Header />

      <main className="relative z-10">
        <Hero />
        <ScrollBeam />
        <CorePillars />
        <ProtocolStack />
        <AlexandriaLab />
        <FinalCall />
      </main>

      <Footer />
    </Motion.div>
  );
};

export default Main;
