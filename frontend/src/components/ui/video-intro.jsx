import { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs';

import { useTranslation } from 'react-i18next';

export const VideoIntro = ({ onComplete }) => {
  const { t, i18n } = useTranslation();
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
      });
    }
  }, []);

  const handleVideoEnd = () => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1500,
        easing: 'easeInOutExpo',
        onComplete: () => {
          setIsVideoEnded(true);
          onComplete();
        }
      });
    }
  };

  if (isVideoEnded) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover pointer-events-none"
        style={{ filter: 'contrast(1.1) brightness(1)' }}
      >
        <source src={import.meta.env.BASE_URL + "intro.mp4"} type="video/mp4" />
      </video>


      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />
      
      <button 
        onClick={handleVideoEnd}
        className={`absolute bottom-10 ${i18n.language === 'ar' ? 'left-10' : 'right-10'} z-[110] px-6 py-2 glass rounded-full text-white/50 text-sm hover:text-white transition-colors uppercase tracking-widest`}
      >
        {t('skipIntro')}
      </button>
    </div>
  );
};

