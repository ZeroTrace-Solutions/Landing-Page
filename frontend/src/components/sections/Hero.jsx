import React, { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Logo } from '@/components/ui/branding';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowDown } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { useTranslation } from 'react-i18next';
import { getPortfolioData } from '@/services/dataService';
import { motion } from 'framer-motion';

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const lenis = useLenis();
  const isAr = i18n.language === 'ar';
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getPortfolioData();
        if (data && data.length > 0) {
          setProjects(data.slice(0, 3));
        } else {
          setProjects([
            {
              id: 'bayan',
              title: 'Bayan',
              titleAr: 'منصة بيان',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
              link: 'https://bayan-edu.web.app/'
            },
            {
              id: 'tayf',
              title: 'Tayf',
              titleAr: 'منصة طيف',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
              link: 'https://tayf-custom.web.app/'
            },
            {
              id: 'sostudy',
              title: 'SOStudy',
              titleAr: 'سو ستادي',
              image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
              link: 'https://sostudy.web.app/'
            }
          ]);
        }
      } catch (error) {
        setProjects([
          {
            id: 'bayan',
            title: 'Bayan',
            titleAr: 'منصة بيان',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
            link: 'https://bayan-edu.web.app/'
          },
          {
            id: 'tayf',
            title: 'Tayf',
            titleAr: 'منصة طيف',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
            link: 'https://tayf-custom.web.app/'
          }
        ]);
      }
    };
    fetchProjects();
  }, []);

  const handleStart = () => {
    if (lenis) {
      lenis.scrollTo('#begin', { duration: 1.5 });
    } else {
      document.getElementById('begin')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplore = () => {
    if (lenis) {
      lenis.scrollTo('#guarantees', { duration: 1.2 });
    } else {
      document.getElementById('guarantees')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="sticky top-0 h-screen w-full flex flex-col justify-between items-center px-6 pt-24 pb-8 z-10 overflow-hidden bg-[#030712] select-none">
      {/* Background Starfield Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.06)_0,transparent_70%)] pointer-events-none" />

      {/* TOP / CENTER: The Constellation Sun & Small Orbits */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <ScrollReveal distance={30} duration={1.2}>
          <div className="relative flex items-center justify-center">
            {/* The Constellation Logo */}
            <div className="relative z-10 scale-90 sm:scale-100 transition-transform duration-700">
              <Logo size="md" showSubtitle={false} className="transform hover:scale-[1.03] transition-all" />
            </div>

            {/* Small Refined Orbital System */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none perspective-1000 preserve-3d">
              <div className="absolute inset-0 flex items-center justify-center [transform:rotateX(68deg)] preserve-3d">
                {projects.map((project, index) => {
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                  const baseRadius = isMobile ? 85 : 155;
                  const orbitRadius = baseRadius + index * (isMobile ? 28 : 48);
                  const duration = 28 + index * 12;
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
                        opacity: { duration: 1, delay: 0.3 }
                      }}
                    >
                      {/* Visible Orbit Path Line */}
                      <div className="absolute inset-0 rounded-full border border-sky-400/15 shadow-[0_0_15px_rgba(56,189,248,0.05)] pointer-events-none" />

                      {/* Orbiting Planet Node */}
                      <motion.div
                        className="absolute top-0 left-1/2 pointer-events-auto preserve-3d"
                        style={{ x: "-50%", y: "-50%" }}
                        animate={{ rotate: -360 }}
                        transition={{
                          rotate: {
                            duration: duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: delay
                          }
                        }}
                      >
                        <div style={{ transform: 'rotateX(-68deg)' }} className="preserve-3d group/planet cursor-pointer">
                          <motion.button
                            onClick={handleProjectClick}
                            whileHover={{ scale: 1.25 }}
                            className="group relative flex items-center justify-center p-2 cursor-pointer transition-transform"
                          >
                            {/* Compact Planet Core */}
                            <div className="relative w-8 h-8 md:w-11 md:h-11 rounded-full border border-sky-300/30 overflow-hidden bg-black/90 backdrop-blur-md shadow-[0_0_25px_rgba(56,189,248,0.25)] group-hover:border-sky-300 transition-all duration-300">
                              <img
                                src={project.image}
                                alt={isAr ? project.titleAr : project.title}
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>

                            {/* Tooltip on Hover */}
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0 z-50">
                              <div className="bg-black/95 backdrop-blur-xl border border-sky-500/30 px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-2 shadow-2xl">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                                  {isAr ? project.titleAr : project.title}
                                </span>
                                <ExternalLink className="w-2.5 h-2.5 text-sky-400" />
                              </div>
                            </div>
                          </motion.button>
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

      {/* BOTTOM SECTION: Value Proposition & Clear Primary Action */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center relative z-20 mb-2">
        <ScrollReveal distance={20} duration={1} delay={100}>
          <p className="text-sm sm:text-base md:text-lg text-white/60 font-light leading-relaxed mb-6 px-4">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button
              onClick={handleStart}
              size="xl"
              className="rounded-full px-10 py-6 bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_35px_rgba(56,189,248,0.35)] hover:shadow-[0_0_50px_rgba(56,189,248,0.6)] cursor-pointer"
            >
              {t('initializeProject')}
            </Button>

            <Button
              onClick={handleExplore}
              size="xl"
              variant="ghost"
              className="rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/70 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.25em] text-xs font-bold px-8 py-6 cursor-pointer backdrop-blur-md"
            >
              {isAr ? 'لماذا ZT Solutions' : 'Why ZT Solutions'}
            </Button>
          </div>
        </ScrollReveal>

        {/* Subtle Scroll Cue */}
        <div
          onClick={handleExplore}
          className="mt-6 flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer text-[10px] uppercase font-mono tracking-widest"
        >
          <span>{isAr ? 'مرر للأسفل' : 'Scroll down'}</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
