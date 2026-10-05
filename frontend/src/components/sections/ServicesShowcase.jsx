import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from 'react-i18next';
import { Layers, ShoppingBag, Server, ArrowUpRight, Cpu, Zap, Check } from 'lucide-react';
import TextType from '@/components/TextType';
import TextPressure from '@/components/TextPressure';
import { siteContent } from '@/config/siteContent';

export const ServicesShowcase = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const serviceIcons = [
    <Layers className="w-8 h-8 text-emerald-400" />,
    <ShoppingBag className="w-8 h-8 text-emerald-300" />,
    <Server className="w-8 h-8 text-teal-400" />
  ];

  return (
    <section
      id="services"
      className="relative z-20 w-full bg-gradient-to-b from-[#051813] via-[#08221a] to-[#051813] border-t border-emerald-500/20 py-32 px-6 overflow-hidden"
    >
      {/* Ambient Emerald Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-96 bg-emerald-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER: Single Subject - What We Build */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center mb-20 flex flex-col items-center">
            <TextType
              text={isAr ? "// خدماتنا وحلولنا البرمجية" : "// WHAT WE ENGINEER"}
              className="text-xs font-bold text-emerald-400 uppercase tracking-[0.6em] mb-4 font-mono"
              speed={50}
            />
            <div className="h-24 sm:h-32 md:h-40 w-full overflow-visible">
              <TextPressure
                text={isAr ? "أنظمة صُممت للنمو السريع" : "ENGINEERED FOR MODERN SCALE"}
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
                ? "من الفكرة المبدئية إلى المنتج المتكامل الجاهز للإنتاج. نطور أنظمة برمجية تواكب تطلعات عملك التقنية والتجارية."
                : "From initial architecture to production deployment. We build digital products tailored to your operational and commercial vision."}
            </p>
          </div>
        </ScrollReveal>

        {/* 3 CORE SERVICES CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteContent.services.map((srv, idx) => (
            <ScrollReveal key={srv.id} delay={idx * 120} distance={40} direction="up">
              <div className="h-full p-8 rounded-3xl bg-white/[0.02] border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-950/20 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between group relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                {/* Ambient Card Flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {serviceIcons[idx]}
                  </div>

                  <div className="text-[10px] font-mono tracking-[0.3em] text-emerald-400/80 uppercase mb-2">
                    SOLUTIONS // 0{idx + 1}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                    {isAr ? srv.titleAr : srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-8">
                    {isAr ? srv.descAr : srv.desc}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-emerald-500/10">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-[10px] font-mono text-emerald-300/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>{isAr ? 'تسليم أسبوعي تفاعلي' : 'Weekly Live Sprints'}</span>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Core Technologies & Frameworks Showcase */}
        <ScrollReveal direction="up" distance={30} delay={300}>
          <div className="mt-16 pt-10 border-t border-emerald-500/10 flex flex-col items-center text-center">
            <div className="text-[11px] font-mono tracking-[0.3em] text-emerald-400/80 uppercase mb-5">
              {isAr ? '// البنى البرمجية والتقنيات الأساسية' : '// CORE ENGINEERING STACK'}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl">
              {[
                { name: "Spring Framework", role: isAr ? "أنظمة المؤسسات و Microservices" : "Enterprise Microservices" },
                { name: "Python", role: isAr ? "الأنظمة الخلفية والأتمتة" : "Backend & Automation" },
                { name: "NestJS", role: isAr ? "معمارية Node المعيارية" : "Modular Scalable Backend" },
                { name: "React", role: isAr ? "واجهات تفاعلية فائقة" : "Modern High-Speed UI" },
                { name: "Node.js", role: isAr ? "بيئة تشغيل عالية الأداء" : "Async Runtime" },
                { name: "PostgreSQL", role: isAr ? "قواعد بيانات علائقية متينة" : "ACID Data Persistence" },
                { name: "Cloud Edge & Docker", role: isAr ? "نشر سحابي وحاويات" : "Cloud & Containerization" }
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all flex items-center gap-2.5 group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] group-hover:scale-125 transition-transform" />
                  <span className="text-xs sm:text-sm font-mono font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {tech.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/60 hidden sm:inline">
                    • {tech.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesShowcase;
