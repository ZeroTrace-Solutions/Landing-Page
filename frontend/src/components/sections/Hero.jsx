import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Logo } from '@/components/ui/branding'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import Magnet from '@/components/Magnet'
import GradualBlur from '@/components/GradualBlur'
import { useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getPortfolioData } from '@/services/dataService'
import { motion, AnimatePresence } from 'framer-motion'

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const lenis = useLenis()
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const publicPackagesUrl = 'https://github.com/orgs/ZeroTrace-Solutions/repositories?q=visibility%3Apublic+archived%3Afalse'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getPortfolioData();
        setProjects(data.slice(0, 5)); // Get latest 5
      } catch (error) {
        console.error("Failed to fetch projects for hero:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 1) {
      const timer = setInterval(() => {
        setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [projects]);

  const handleStart = () => {
    if (lenis) {
      lenis.scrollTo('#begin', {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom cinematic easing
      })
    }
  }

  return (
    <section className="relative min-h-[120vh] flex flex-col items-center px-6">
      <div className="h-screen flex flex-col items-center justify-center relative">
        <ScrollReveal distance={50} duration={1.5}>
          <div className="relative flex items-center justify-center">
            {/* The "Sun" - Logo */}
            <div className="relative z-10 scale-75 md:scale-90 transition-transform duration-1000">
              <Logo className="transform hover:scale-[1.05] transition-all duration-1000" />
            </div>

            {/* Orbital System (3D Perspective Container) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-1000 preserve-3d">
              <div className="absolute inset-0 flex items-center justify-center [transform:rotateX(65deg)] preserve-3d">
                {projects.map((project, index) => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                  const baseRadius = isMobile ? 180 : 380;
                  const orbitRadius = baseRadius + index * (isMobile ? 60 : 130);
                  const duration = 40 + index * 18;   // Majestic tempo
                  const delay = -(index * (duration / Math.max(1, projects.length)));

                  const handleProjectClick = () => {
                    if (!project.link) return;
                    const url = project.link.startsWith('http') ? project.link : `https://${project.link}`;
                    window.open(url, '_blank');
                  };

                  return (
                    <motion.div
                      key={project.id}
                      className="absolute pointer-events-none preserve-3d"
                      style={{
                        width: orbitRadius * 2,
                        height: orbitRadius * 2,
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        rotate: 360,
                        opacity: 1,
                        scale: 1
                      }}
                      transition={{
                        rotate: {
                          duration: duration,
                          repeat: Infinity,
                          ease: "linear",
                          delay: delay
                        },
                        opacity: {
                          duration: 1.5,
                          delay: index * 0.2 + 0.5,
                          ease: "easeOut"
                        },
                        scale: {
                          duration: 2,
                          delay: index * 0.1,
                          ease: "easeOut"
                        }
                      }}
                    >
                      {/* Visible Orbit Path Line (Oval due to parent rotation) */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: index * 0.3 }}
                        className="absolute inset-0 rounded-full border border-white/[0.1] shadow-[0_0_20px_rgba(255,255,255,0.02)] pointer-events-none"
                        style={{ transform: 'none' }}
                      />

                      {/* The Planet Container */}
                      <motion.div
                        className="absolute top-0 left-1/2 pointer-events-auto preserve-3d"
                        style={{ x: "-50%", y: "-50%" }}
                        animate={{
                          rotate: -360
                        }}
                        transition={{
                          rotate: {
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay
                          }
                        }}
                      >
                        {/* Static Un-tilt Layer so the planet perfectly faces the camera at all times */}
                        <div style={{ transform: 'rotateX(-65deg)' }} className="preserve-3d group/planet-hitbox cursor-pointer">
                          <Magnet padding={30}>
                            <motion.button
                              onClick={handleProjectClick}
                              whileHover={{ scale: 1.5, zIndex: 100 }}
                              className="group relative flex items-center justify-center p-4 cursor-pointer"
                            >
                            {/* Inner Planet Core */}
                            <div className="relative w-12 h-12 md:w-24 md:h-24 rounded-full border border-white/10 overflow-hidden bg-black/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(255,255,255,0.1)] group-hover:border-white/40 transition-all duration-500">
                              <img
                                src={project.image}
                                alt={i18n.language === 'ar' ? project.titleAr : project.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Info Card */}
                            <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none translate-y-4 group-hover:translate-y-0">
                              <div className="bg-black/90 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-2xl whitespace-nowrap flex flex-col items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-white/30">
                                <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] font-mono">
                                  {i18n.language === 'ar' ? project.titleAr : project.title}
                                </span>
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">{t('viewProject') || 'ACCESS_ENTITY//'}</span>
                                  <ExternalLink className="w-3 h-3 text-white/20" />
                                </div>
                              </div>
                            </div>

                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-50 transition-opacity" />
                          </motion.button>
                        </Magnet>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="w-full flex flex-col items-center -mt-16 md:-mt-32 pb-32 pointer-events-none relative z-30">
        <ScrollReveal delay={50} distance={40} direction="up" duration={1}>
          <div className="max-w-xl mx-auto text-center mb-16 px-4">
            <GradualBlur
              text={t('heroDescription')}
              className="text-lg md:text-xl text-white/40 font-light leading-relaxed tracking-wide backdrop-blur-sm"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={30} distance={60} direction="up" duration={1}>
          <div className="flex flex-col gap-8 justify-center items-center pointer-events-auto">
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Magnet padding={20} disabled={false} magnetStrength={2}>
                <Button
                  onClick={handleStart}
                  size="xl"
                  className="rounded-none px-16 bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {t('initializeProject')}
                </Button>
              </Magnet>
              <Magnet padding={20}>
                <Button
                  onClick={() => navigate('/whitepaper')}
                  size="xl"
                  variant="ghost"
                  className="text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] text-xs font-bold"
                >
                  {t('readWhitepaper')} {i18n.language === 'ar' ? <ArrowLeft className="ml-4 w-4 h-4" /> : <ArrowRight className="ml-4 w-4 h-4" />}
                </Button>
              </Magnet>
            </div>
            <div className="hidden sm:block">
              <Magnet padding={20}>
                <Button
                  asChild
                  size="xl"
                  variant="ghost"
                  className="text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] text-xs font-bold"
                >
                  <a href={publicPackagesUrl} target="_blank" rel="noopener noreferrer">
                    {t('publicPackages')} {i18n.language === 'ar' ? <ArrowLeft className="ml-4 w-4 h-4" /> : <ArrowRight className="ml-4 w-4 h-4" />}
                  </a>
                </Button>
              </Magnet>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={500} direction="down" distance={20}>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-[8px] font-bold uppercase tracking-[1em] -mr-[1em]">{t('scroll')}</span>
        </div>
      </ScrollReveal>
    </section>
  )
}
