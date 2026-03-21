import { useTranslation } from 'react-i18next'
import { Github, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react'
import { useLenis } from 'lenis/react'

export const Footer = () => {
  const { t } = useTranslation();
  const lenis = useLenis();

  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 2,
      });
    }
  };

  return (
    <footer className="pb-32 px-6 md:px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12 pt-16 border-t border-white/5">
        <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
          <div className="text-xl font-black tracking-tighter">ZT Solutions</div>
          <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{t('footerCopyright')}</span>
        </div>
        <div className="flex flex-col gap-6 items-center md:items-end">
          <div className="flex flex-wrap justify-center md:justify-end gap-8 sm:gap-16 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
            <a href="https://github.com/ZeroTrace-Solutions" target="_blank" rel="noopener noreferrer" onClick={(e) => handleNavClick(e, 0)} className="hover:text-white transition-colors">{t('libraries')}</a>
            <a href="#solutions" onClick={(e) => handleNavClick(e, '#solutions')} className="hover:text-white transition-colors">{t('protocol')}</a>
            <a href="https://github.com/ZeroTrace-Solutions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('source')}</a>
          </div>
          <div className="flex gap-6 text-white/40">
            {/* <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1" aria-label={t('linkedin')}>
              <Linkedin className="w-4 h-4" />
            </a> */}
            <a href="https://github.com/ZeroTrace-Solutions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1" aria-label={t('github')}>
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/zt.solutions?igsh=MW16bmFkbm0yM21sdA==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1" aria-label={t('instagram')}>
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://www.facebook.com/share/18Cfgup4mS/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1" aria-label={t('facebook')}>
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://www.youtube.com/@ZeroTraceSolutions2026" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-1" aria-label={t('youtube')}>
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
