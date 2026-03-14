import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StarBorder from '@/components/StarBorder';

export const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden bg-black selection:bg-white/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.02] rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Geometric Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl border border-white/[0.02] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-2xl max-h-2xl border border-white/[0.01] rounded-full animate-spin-slow" />
      </div>

      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 w-full max-w-2xl"
      >
        {/* Large 404 with Glitch/Flicker Effect */}
        <div className="relative mb-8">
          <h1 className="text-[14rem] md:text-[22rem] font-black tracking-tighter leading-none select-none font-genos bg-clip-text text-transparent bg-gradient-to-b from-white/[0.15] to-transparent animate-flicker">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay">
             <h1 className="text-[14rem] md:text-[22rem] font-black tracking-tighter leading-none select-none font-genos text-white blur-sm">
              404
            </h1>
          </div>
        </div>

        <div className="mt-[-2rem] md:mt-[-4rem] space-y-8 px-6">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-white drop-shadow-2xl">
              {t('pageNotFoundTitle', 'LOST_IN_SPACE')}
            </h2>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
          </Motion.div>

          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/40 text-[10px] md:text-xs max-w-sm mx-auto font-bold uppercase tracking-[0.4em] leading-[2] mb-12"
          >
            {t('pageNotFoundMessage', 'THE COORDINATES YOU PROVIDED DO NOT EXIST IN THIS SECTOR OF THE UNIVERSE.')}
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="inline-block"
          >
            <StarBorder
              onClick={() => navigate('/')}
              className="px-12 py-5"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
                {t('backToSafety', 'INITIALIZE_RECOVERY')}
              </span>
            </StarBorder>
          </Motion.div>
        </div>
      </Motion.div>

      {/* Cyberpunk Footer Detail */}
      <div className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-center opacity-20 text-[8px] font-black uppercase tracking-[0.8em]">
        <div className="flex items-center gap-4">
          <div className="h-px w-8 bg-white" />
          <span>SYS_ERR_404</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ZT SOLUTIONS</span>
          <div className="h-px w-8 bg-white" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 1;
            filter: blur(0px);
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
            filter: blur(2px);
          }
        }
        .animate-flicker {
          animation: flicker 4s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }
      `}} />
    </div>
  );
};

export default NotFound;
