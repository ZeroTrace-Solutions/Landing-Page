import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { ClientGuarantees } from '@/components/sections/ClientGuarantees';
import { ServicesShowcase } from '@/components/sections/ServicesShowcase';
import { ProvenSystems } from '@/components/sections/ProvenSystems';
import { ClientProcess } from '@/components/sections/ClientProcess';
import { ClientFAQ } from '@/components/sections/ClientFAQ';
import { FinalCall } from '@/components/sections/FinalCall';
import { Footer } from '@/components/sections/Footer';

export const Main = () => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="bg-[#030712] min-h-screen text-white"
    >
      <Header />

      <main className="relative z-10 w-full overflow-hidden">
        {/* SECTION 1: Brand & Constellation Hero (Cosmic Black #030712 with Compact Orbits) */}
        <Hero />

        {/* SECTION 2: Client Safety & Guarantees (Midnight Sapphire Navy #091124 - Curtain Covers Hero) */}
        <ClientGuarantees />

        {/* SECTION 3: What We Build & Capabilities (Deep Emerald Charcoal #051813) */}
        <ServicesShowcase />

        {/* SECTION 4: Proven Systems & Live Case Studies (Deep Royal Violet #110c26) */}
        <ProvenSystems />

        {/* SECTION 5: The 4-Step Client Journey (Dark Carbon Graphite #0c121e) */}
        <ClientProcess />

        {/* SECTION 6: Client FAQ & Transparency (Deep Oceanic Cyan #071622) */}
        <ClientFAQ />

        {/* SECTION 7: Final Call & Project Scope Selector (Midnight Obsidian #03050c) */}
        <FinalCall />
      </main>

      <Footer />
    </Motion.div>
  );
};

export default Main;
