import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from './i18n'
import { UniverseBackground } from '@/components/ui/universe-background'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { VideoIntro } from '@/components/ui/video-intro'
import SplashCursor from '@/components/SplashCursor'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { CorePillars } from '@/components/sections/CorePillars'
import { ProtocolStack } from '@/components/sections/ProtocolStack'
import { AlexandriaLab } from '@/components/sections/AlexandriaLab'
import { FinalCall } from '@/components/sections/FinalCall'
import { Footer } from '@/components/sections/Footer'
import { ScrollBeam } from '@/components/sections/ScrollBeam'
import { Portfolio } from '@/pages/Portfolio'

function App() {
  const { i18n: i18nObj, t } = useTranslation();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const lang = i18nObj.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // ensure Tailwind utilities use the appropriate font
    document.body.classList.toggle('font-arabic', lang === 'ar');
  }, [i18nObj.language]);

  const switchLang = () => {
    const next = i18nObj.language === 'ar' ? 'en' : 'ar';
    i18nObj.changeLanguage(next);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20">
        <UniverseBackground />

        <SplashCursor
          SPLAT_RADIUS={0.08}
          SPLAT_FORCE={2500}
          DENSITY_DISSIPATION={8}
          VELOCITY_DISSIPATION={3.5}
          COLOR_UPDATE_SPEED={4}
        />

        {/* language toggle component handles positioning */}
        <LanguageToggle />

        <VideoIntro onComplete={() => setShowContent(true)} />

        <Routes>
          <Route
            path="/"
            element={
              showContent && (
                <>
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
                </>
              )
            }
          />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App



