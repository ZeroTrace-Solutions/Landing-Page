import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Move } from 'lucide-react';
import InfiniteMenu from '@/components/InfiniteMenu';
import { UniverseBackground } from '@/components/ui/universe-background';
import { getPortfolioData } from '../services/dataService';

export const Portfolio = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolioData();
        setItems(data.length > 0 ? data : []);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleBackNavigation = () => {
    if (globalThis.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  if (loading) {
    return (
      <div className="relative w-screen h-screen flex items-center justify-center bg-black overflow-hidden">
        <UniverseBackground />
        <Motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6 z-10"
        >
          <div className="w-16 h-16 border-t-2 border-white/20 rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic animate-pulse">
            {t('loadingArchive')}
          </span>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white selection:bg-white/20">
      <UniverseBackground />
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <button
            onClick={handleBackNavigation}
            className="group cursor-pointer pointer-events-auto flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300"
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
                {t('archiveLabel')}
              </span>
            </div>
            {/* <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
              {t('portfolio')}
            </h1> */}
          </div>
        </div>
      </div>

      {/* Full Screen Menu / No Data Fallback */}
      <div className="w-full h-full relative z-10">
        {items.length > 0 ? (
          <>
            <InfiniteMenu items={items} scale={1} />
            {/* Navigation Hint */}
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ delay: 1, duration: 2.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              className="absolute top-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-50 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-4 text-white/30">
                <div className="h-px w-10 bg-white/20" />
                <Move className="w-5 h-5 animate-pulse" />
                <div className="h-px w-10 bg-white/20" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/70 whitespace-nowrap">
                {t('portfolioInstruction')}
              </span>
            </Motion.div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-12 h-px bg-white/20" />
              <span className="italic text-white/40 uppercase tracking-[0.8em] text-[10px] font-black">
                {t('noRecords')}
              </span>
              <div className="w-12 h-px bg-white/20" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
