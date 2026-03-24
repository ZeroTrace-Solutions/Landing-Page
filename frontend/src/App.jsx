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
import { AdminDashboard } from '@/pages/Admin/Dashboard'
import { Toaster, toast } from 'sonner'
import { auth } from '@/lib/firebase'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { ComplaintWidget } from './components/ui/complaint-widget'

function App() {
  const { i18n: i18nObj } = useTranslation();
  const [showContent, setShowContent] = useState(() => {
    return sessionStorage.getItem('introPlayed') === 'true';
  });
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const location = useLocation();

  const isHome = location.pathname === '/';
  const showCursor = location.pathname !== '/whitepaper';
  const shouldShowIntro = isHome && !showContent && !isMobileView;

  const handleIntroComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setShowContent(true);
  };

  useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    const lang = isAdmin ? 'en' : (i18nObj.language || 'en');
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' && !isAdmin) ? 'rtl' : 'ltr';
    document.body.classList.toggle('font-arabic', lang === 'ar' && !isAdmin);
  }, [i18nObj.language, location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const onChange = (event) => setIsMobileView(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20 font-sans">
      <UniverseBackground />
      <ComplaintWidget 
        whatsappUrl="https://wa.me/201557792361"
        apiEndpoint="/api/complaints"
        i18n={i18nObj}
        zIndex={9999999}
        colors={{
          primary: "green",
          surface: "brown",
          text: "hsl(green)",
          border: "hsl(var(--border))"
        }}
        direction="ltr"
        side="left"

      />
      {showCursor && (
        <SplashCursor
          SPLAT_RADIUS={0.08}
          SPLAT_FORCE={2500}
          DENSITY_DISSIPATION={8}
          VELOCITY_DISSIPATION={3.5}
          COLOR_UPDATE_SPEED={4}
        />
      )}

      {!location.pathname.startsWith('/admin') && <LanguageToggle />}

      {shouldShowIntro && <VideoIntro onComplete={handleIntroComplete} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={!shouldShowIntro ? <Main /> : <div />}
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
          <Route
            path="/admin"
            element={
              <div className="admin-font">
                <AdminProtection>
                  <AdminDashboard />
                </AdminProtection>
              </div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        theme="dark"
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 20, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          },
        }}
      />
    </div>
  );
}

function AdminProtection({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthorized(true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubit = async (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      try {
        toast.loading("SECURE_AUTH_INITIALIZING...");
        await signInAnonymously(auth);
        setAuthorized(true);
        setError(false);
        toast.dismiss();
        toast.success("AUTH_SESSION_ESTABLISHED");
      } catch (err) {
        console.error("Auth failed:", err);
        toast.dismiss();
        toast.error("GATEWAY_ERROR: Auth failure");
        setError(true);
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  if (loading) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <div className="text-[10px] font-black uppercase tracking-[1em] animate-pulse">Synchronizing_Keys...</div>
    </div>
  );

  if (authorized) return children;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-sans bg-black/40 backdrop-blur-md" dir="ltr">
      <Motion.div
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-10 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <AnimatePresence>
          {error && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-2 border-red-500/50 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]"
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl">
              <span className="text-black font-black text-xl">ZT</span>
            </div>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-2 text-center">ACCESS_REQUIRED</h2>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.4em] mb-8 text-center">Authorized Personnel Only</p>

          <form onSubmit={handleSubit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER_ENCRYPTION_KEY"
                dir='ltr'
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-white/30 transition-all font-mono text-center tracking-widest"
              />
              {error && (
                <Motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 left-0 w-full text-center text-[9px] font-black uppercase tracking-widest text-red-500"
                >
                  Invalid Access Token // Retry
                </Motion.p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white/90 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-[0.98]"
            >
              Initialize Session
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-white/10">
            <span>SECURE_NODE_01</span>
            <span>ZT_OS_v1.0.4</span>
          </div>
        </div>
      </Motion.div>
    </div>
  );
}

export default App;


