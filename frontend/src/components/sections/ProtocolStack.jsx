import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { ArrowUpLeft, ArrowUpRight, Cpu } from 'lucide-react'
import Magnet from '@/components/Magnet'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'
import CardSwap, { Card } from '@/components/CardSwap'
import { Button } from '../ui/button'

export const ProtocolStack = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const publicPackagesUrl = 'https://github.com/orgs/ZeroTrace-Solutions/repositories?q=visibility%3Apublic+archived%3Afalse';
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 480;

  const projects = [
    {
      name: t('saasProjectBayanName'),
      type: t('saasProjectBayanType'),
      subtitle: t('saasProjectBayanSubtitle'),
      description: t('saasProjectBayanDescription'),
      status: t('saasProjectBayanStatus')
    },
    {
      name: t('saasProjectTayfName'),
      type: t('saasProjectTayfType'),
      subtitle: t('saasProjectTayfSubtitle'),
      description: t('saasProjectTayfDescription'),
      status: t('saasProjectTayfStatus')
    },
    {
      name: t('saasProjectSOStudyName'),
      type: t('saasProjectSOStudyType'),
      subtitle: t('saasProjectSOStudySubtitle'),
      description: t('saasProjectSOStudyDescription'),
      status: t('saasProjectSOStudyStatus')
    }
  ];

  return (
    <section id="solutions" className="py-32 px-6 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div>
          <ScrollReveal direction="left">
            <TextType
              text={t('saasProjectsLabel')}
              className="text-xs font-bold text-white/30 uppercase tracking-[0.5em] mb-8 italic"
              speed={50}
            />
            <div className="h-28 sm:h-40 md:h-48 mb-8 overflow-visible">
              <TextPressure
                text={t('saasProjectsTitle')}
                containerClassName="w-full h-full"
                className="text-4xl md:text-7xl font-black uppercase"
                flex={false}
                width={false}
                weight={true}
                textColor="white"
                minFontSize={14}
              />
            </div>
            <p className="text-lg text-white/40 font-light leading-relaxed max-w-md mb-12 break-words [overflow-wrap:anywhere]">
              {t('saasProjectsDescription')}
            </p>
            <div className="flex items-center gap-6">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] break-words [overflow-wrap:anywhere]">
                {t('saasProjectsTagline')}
              </span>
            </div>
            <p className="mt-8 text-sm md:text-base text-white/35 max-w-md leading-relaxed break-words [overflow-wrap:anywhere]">
              {t('publicPackagesNote')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnet padding={50} magnetStrength={3}>
                <Button
                  variant="default"
                  onClick={() => navigate('/portfolio')}
                  className="px-6 py-3 text-black font-bold rounded-full transition-colors"
                >
                  {t('viewPortfolio')}
                </Button>
              </Magnet>
              <Magnet padding={40} magnetStrength={2}>
                <Button
                  asChild
                  variant="ghost"
                  className="px-6 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40"
                >
                  <a href={publicPackagesUrl} target="_blank" rel="noopener noreferrer">
                    {t('explorePublicPackages')}
                    {i18n.language === "ar" ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </a>
                </Button>
              </Magnet>
            </div>
          </ScrollReveal>
        </div>

        <div className="relative h-[600px] flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[450px] h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <CardSwap
              width={isSmallMobile ? 320 : isMobile ? 360 : 400}
              height={isSmallMobile ? 450 : isMobile ? 480 : 500}
              cardDistance={isMobile ? 30 : 50}
              verticalDistance={isMobile ? 40 : 60}
              delay={4500}
              pauseOnHover={true}
              easing="power"
            >
              {projects.map((project, i) => (
                <Card key={i} className="border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-500 rounded-2xl">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                        {project.type}
                      </div>
                      <Cpu className="w-5 h-5 text-white/10" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-6">
                      {project.name}
                    </h3>
                    <div className="w-16 h-1 bg-white/10 mb-8" />
                    <p className="text-white/40 leading-relaxed font-light text-sm md:text-base">
                      {project.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                      {project.subtitle}
                    </div>
                    <div className="text-[9px] text-white/10 font-mono">
                      {project.status}
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl pointer-events-none" />
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  )
}
