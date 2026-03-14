import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteMenu from '@/components/InfiniteMenu';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Move } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import portfolioData from '@/components/data/portfolioData.json';

export const Portfolio = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const items = portfolioData;

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white selection:bg-white/20">
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group pointer-events-auto flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300"
          >
            <span className={`transition-transform duration-300 ${i18n.language === 'ar' ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
              {i18n.language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </span>
            {t('back')}
          </button>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-white/20" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] italic">
                {t('archiveLabel') || 'ZT-ARCHIVE //'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
              {t('portfolio')}
            </h1>
          </div>
        </div>
      </div>

      {/* Full Screen Menu */}
      <div className="w-full h-full">
        <InfiniteMenu items={items} scale={1} />
      </div>

      {/* Navigation Hint */}
      <Motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-50"
      >
        <div className="flex items-center gap-4 text-white/20">
          <div className="h-px w-8 bg-white/10" />
          <Move className="w-4 h-4 animate-pulse" />
          <div className="h-px w-8 bg-white/10" />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.6em] text-white/30 whitespace-nowrap">
          {t('portfolioInstruction')}
        </span>
      </Motion.div>
    </div>
  );
};
