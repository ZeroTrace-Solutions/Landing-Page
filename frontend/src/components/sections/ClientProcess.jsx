import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from 'react-i18next';
import { siteContent } from '@/config/siteContent';
import { Compass, Code2, ShieldAlert, Rocket, CheckCircle2 } from 'lucide-react';
import TextType from '@/components/TextType';
import TextPressure from '@/components/TextPressure';

export const ClientProcess = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const icons = [
    <Compass className="w-6 h-6 text-sky-400" />,
    <Code2 className="w-6 h-6 text-amber-400" />,
    <ShieldAlert className="w-6 h-6 text-purple-400" />,
    <Rocket className="w-6 h-6 text-emerald-400" />
  ];

  return (
    <section
      id="process"
      className="relative z-20 w-full bg-gradient-to-b from-[#0c121e] via-[#111a2c] to-[#0c121e] border-t border-slate-700/30 py-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER: Single Subject - The 4-Step Client Journey */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center mb-20 flex flex-col items-center">
            <TextType
              text={isAr ? "// رحلة العمل والجدول الزمني" : "// THE 4-STEP CLIENT JOURNEY"}
              className="text-xs font-bold text-amber-400 uppercase tracking-[0.6em] mb-4 font-mono"
              speed={50}
            />
            <div className="h-24 sm:h-32 md:h-40 w-full overflow-visible">
              <TextPressure
                text={isAr ? "من الفكرة إلى الإطلاق الكامل" : "FROM VISION TO PRODUCTION"}
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
                ? "منهجية واضحة تضمن لك راحة البال التامة. تسليمات أسبوعية مجدولة، بدون أي مفاجآت عند التسليم النهائي."
                : "A transparent, milestone-driven framework engineered for your peace of mind. Regular staging releases with zero end-of-project surprises."}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 PROCESS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {siteContent.process.map((item, index) => (
            <ScrollReveal key={item.step} delay={index * 120} distance={40} direction="up">
              <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-xl group relative overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.3)]">
                {/* Step indicator watermark - positioned on opposite side of icon in both RTL and LTR */}
                <div className={`absolute top-4 ${isAr ? 'left-6 text-left' : 'right-6 text-right'} text-5xl font-black font-mono text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors`}>
                  {item.step}
                </div>

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {icons[index]}
                  </div>

                  <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400/80 mb-2">
                    {isAr ? `المرحلة ${item.step}` : `PHASE ${item.step}`}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                    {isAr ? item.titleAr : item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed font-light">
                    {isAr ? item.descAr : item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-emerald-400/90">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مرحلة معتمدة ومضمونة' : 'Milestone Verified'}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientProcess;
