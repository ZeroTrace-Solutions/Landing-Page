import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteMenu from '@/components/InfiniteMenu';

export const Portfolio = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const items = [
    {
      image: 'https://picsum.photos/300/300?grayscale',
      link: 'https://google.com/',
      title: 'Item 1',
      description: 'This is pretty cool, right?'
    },
    {
      image: 'https://picsum.photos/400/400?grayscale',
      link: 'https://google.com/',
      title: 'Item 2',
      description: 'This is pretty cool, right?'
    },
    {
      image: 'https://picsum.photos/500/500?grayscale',
      link: 'https://google.com/',
      title: 'Item 3',
      description: 'This is pretty cool, right?'
    },
    {
      image: 'https://picsum.photos/600/600?grayscale',
      link: 'https://google.com/',
      title: 'Item 4',
      description: 'This is pretty cool, right?'
    }
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white selection:bg-white/20">
      {/* Absolute Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="pointer-events-auto px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.4em] transition-all"
          >
            {t('back')}
          </button>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-glow">
            {t('portfolio')}
          </h1>
        </div>
      </div>

      {/* Full Screen Menu */}
      <div className="w-full h-full">
        <InfiniteMenu items={items} scale={1} />
      </div>
    </div>
  );
};
