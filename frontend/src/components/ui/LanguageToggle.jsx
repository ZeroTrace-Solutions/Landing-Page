import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isAr = currentLang === 'ar';

  const setLanguage = (lang) => {
    if (lang !== currentLang) {
      i18n.changeLanguage(lang);
    }
  };

  const isWhitepaper = typeof window !== 'undefined' && window.location.pathname === '/whitepaper';

  return (
    <aside
      aria-label="Language Selector"
      className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-50 select-none transition-all duration-300`}
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#030712]/90 backdrop-blur-2xl border border-sky-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.15)] hover:border-sky-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 group">
        {/* Glowing Mini Globe Icon */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-sky-400 group-hover:scale-110 transition-transform">
          <Globe className="w-3.5 h-3.5" />
        </div>

        {/* English Toggle Button */}
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            !isAr
              ? 'text-sky-300 bg-sky-500/20 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
              : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Switch to English"
        >
          EN
        </button>

        {/* Divider */}
        <div className="w-px h-3.5 bg-white/10" />

        {/* Arabic Toggle Button */}
        <button
          type="button"
          onClick={() => setLanguage('ar')}
          className={`relative px-3 py-1.5 rounded-full text-[12px] font-bold tracking-normal transition-all duration-300 cursor-pointer ${
            isAr
              ? 'text-sky-300 bg-sky-500/20 border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-arabic'
              : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent font-arabic'
          }`}
          title="التحويل إلى العربية"
        >
          عربي
        </button>
      </div>
    </aside>
  );
};

export default LanguageToggle;
