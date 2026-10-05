import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import TextType from '@/components/TextType';
import TextPressure from '@/components/TextPressure';
import { siteContent } from '@/config/siteContent';

export const ProvenSystems = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const systemThumbnails = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <section
      id="solutions"
      className="relative z-20 w-full bg-gradient-to-b from-[#110c26] via-[#181136] to-[#110c26] border-t border-purple-500/25 py-32 px-6 overflow-hidden"
    >
      {/* Ambient Royal Violet Nebula Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER: Single Subject - Proven Case Studies */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center mb-20 flex flex-col items-center">
            <TextType
              text={isAr ? "// سابقة الأعمال والمنتجات الحية" : "// PROVEN CASE STUDIES"}
              className="text-xs font-bold text-purple-400 uppercase tracking-[0.6em] mb-4 font-mono"
              speed={50}
            />
            <div className="h-24 sm:h-32 md:h-40 w-full overflow-visible">
              <TextPressure
                text={isAr ? "برمجيات تعمل على أرض الواقع" : "BUILT FOR REAL OPERATIONS"}
                containerClassName="w-full h-full"
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase"
                flex={false}
                alpha={false}
                stroke={false}
                width={false}
                weight={true}
                textColor="white"
                minFontSize={14}
              />
            </div>
            <p className="max-w-2xl text-white/50 text-sm sm:text-base font-light leading-relaxed mt-4">
              {isAr
                ? "نماذج واقعية من المنصات التي صممناها وطورناها. يمكنك تجربة كل نظام مباشرة عبر الروابط الحية."
                : "Real platforms architected and deployed by ZT Solutions. Test live functional builds directly with zero restrictions."}
            </p>
          </div>
        </ScrollReveal>

        {/* CASE STUDIES CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {siteContent.featuredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 120} distance={40} direction="up">
              <div className="h-full rounded-3xl bg-white/[0.02] border border-purple-500/20 hover:border-purple-400/50 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.4)] group">
                {/* Visual Thumbnail */}
                <div className="relative w-full h-48 overflow-hidden bg-black/40">
                  <img
                    src={systemThumbnails[index]}
                    alt={project.name}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110c26] via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-purple-400/30 flex items-center gap-2 text-[10px] font-mono text-purple-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{project.status}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.3em] text-purple-400/80 uppercase mb-2">
                      {project.type}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {project.name}
                    </h3>

                    <div className="text-xs font-mono text-white/40 mb-4">
                      {project.subtitle}
                    </div>

                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-6">
                      {isAr ? project.descriptionAr : project.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-purple-500/10">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white hover:text-purple-300 transition-colors"
                    >
                      <span>{isAr ? 'تجربة النظام المباشر' : 'Launch Live Demo'}</span>
                      <ArrowUpRight className="w-4 h-4 text-purple-400" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvenSystems;
