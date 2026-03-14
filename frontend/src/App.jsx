import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { UniverseBackground } from '@/components/ui/universe-background'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { VideoIntro } from '@/components/ui/video-intro'
import SplashCursor from '@/components/SplashCursor'
import { Main } from '@/pages/Main'
import { Portfolio } from '@/pages/Portfolio'
import { Whitepaper } from '@/pages/Whitepaper'
import { NotFound } from '@/pages/NotFound'

function App() {
  const { i18n: i18nObj } = useTranslation();
  const [showContent, setShowContent] = useState(() => {
    return sessionStorage.getItem('introPlayed') === 'true';
  });
  const location = useLocation();

  const isHome = location.pathname === '/';
  const showCursor = location.pathname !== '/whitepaper';

  const handleIntroComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowContent(true);
  };

  useEffect(() => {
    const lang = i18nObj.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('font-arabic', lang === 'ar');
  }, [i18nObj.language]);

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20 font-sans">
      <UniverseBackground />

      {showCursor && (
        <SplashCursor
          SPLAT_RADIUS={0.08}
          SPLAT_FORCE={2500}
          DENSITY_DISSIPATION={8}
          VELOCITY_DISSIPATION={3.5}
          COLOR_UPDATE_SPEED={4}
        />
      )}

      <LanguageToggle />

      {isHome && !showContent && <VideoIntro onComplete={handleIntroComplete} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={(showContent || !isHome) ? <Main /> : <div />}
          />
          <Route
            path="/portfolio"
            element={
              <Motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Portfolio />
              </Motion.div>
            }
          />
          <Route
            path="/whitepaper"
            element={
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Whitepaper />
              </Motion.div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App



