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
    <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20">
      {/* reuse UniverseBackground and normal layout if desired */}
      <div className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded"
        >
          {t('back')}
        </button>
        <h1 className="text-3xl font-bold mb-8">{t('portfolio')}</h1>
      </div>
      <div className="w-full h-[70vh]">
        <InfiniteMenu items={items} scale={1} />
      </div>
    </div>
  );
};
