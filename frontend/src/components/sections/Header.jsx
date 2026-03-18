import { Button } from '@/components/ui/button'
import { useLenis } from 'lenis/react'
import { Library, Menu, X, LayoutGrid } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()
  const lenis = useLenis()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = ['framework', 'solutions', 'begin']

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Center-ish trigger
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      });
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e, link) => {
    e.preventDefault()
    if (link.isRoute) {
      navigate(link.href)
    } else if (lenis) {
      lenis.scrollTo(link.href, {
        offset: 0,
        duration: 1.5,
      })
    }
    setIsMenuOpen(false)
  }

  const navLinks = [
    { label: t('framework'), href: '#framework', id: 'framework' },
    { label: t('solutions'), href: '#solutions', id: 'solutions' },
    { label: t('manifesto'), href: '#manifesto', id: 'begin' },
  ]

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 overflow-visible animate-in fade-in ${isScrolled || isMenuOpen
      ? 'glass-dark bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl'
      : 'bg-transparent'
      }`}>
      <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'py-4 px-8' : 'py-8 px-8'}`}>
        <div className="flex items-center gap-4 relative z-[60]">
          <div className="w-10 h-px bg-white/20" />
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/40 text-[15px]">
            {t('alexandria2026')}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-12 text-[15px] font-bold text-white/50 uppercase tracking-[0.5em]">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`transition-all duration-300 hover:text-white ${activeSection === link.id ? 'text-white' : ''
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Trigger & Library Button Wrapper */}
        <div className="flex items-center gap-2 relative z-[60]">
          {/* Portfolio Icon - Visible Always */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/portfolio')}
            className="p-3 cursor-pointer text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-full border border-white/5"
            title={t('portfolio')}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>

          {/* Library Icon - Desktop Only */}
          <div className="hidden lg:block">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="p-3 text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-full border border-white/5"
              title={t('libraries')}
            >
              <a
                href="https://github.com/ZeroTrace-Solutions"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Library"
              >
                <Library className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/60 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop - Outside the flex container to ensure full-screen cover */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 h-screen w-screen bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-8 lg:hidden cursor-pointer"
          >
            <nav
              className="flex flex-col items-center gap-8 text-center pt-24 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((link, i) => (
                <Motion.a
                  key={link.id}
                  href={link.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-3xl font-black uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em] hover:text-white/75 ${activeSection === link.id ? 'text-white' : 'text-white/50'
                    }`}
                >
                  {link.label}
                </Motion.a>
              ))}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-16"
              >
                <a
                  href="https://github.com/ZeroTrace-Solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-10 py-5 bg-white shadow-[0_0_30px_rgba(255,255,255,0.1)] rounded-full text-black text-[15px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
                >
                  <Library className="w-4 h-4" />
                  {t('sourceCode')}
                </a>
              </Motion.div>
            </nav>

            {/* Ambient Nebula decoration in the menu */}
            <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
