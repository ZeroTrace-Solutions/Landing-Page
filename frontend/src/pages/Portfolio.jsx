import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteMenu from '@/components/InfiniteMenu';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Portfolio = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const items = [
    {
      image: 'https://picsum.photos/300/300?grayscale',
      link: 'https://google.com/',
      title: 'Item 1',
      titleAr: 'المشروع ١',
      description: 'This is pretty cool, right?',
      descriptionAr: 'هذا مذهل حقاً، أليس كذلك؟'
    },
    {
      image: 'https://picsum.photos/400/400?grayscale',
      link: 'https://google.com/',
      title: 'Item 2',
      titleAr: 'المشروع ٢',
      description: 'This is pretty cool, right?',
      descriptionAr: 'هذا مذهل حقاً، أليس كذلك؟'
    },
    {
      image: 'https://picsum.photos/500/500?grayscale',
      link: 'https://google.com/',
      title: 'Item 3',
      titleAr: 'المشروع ٣',
      description: 'This is pretty cool, right?',
      descriptionAr: 'هذا مذهل حقاً، أليس كذلك؟'
    },
    {
      image: 'https://picsum.photos/600/600?grayscale',
      link: 'https://google.com/',
      title: 'Item 4',
      titleAr: 'المشروع ٤',
      description: 'This is pretty cool, right?',
      descriptionAr: 'هذا مذهل حقاً، أليس كذلك؟'
    }
  ];

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
    </div>
  );
};
