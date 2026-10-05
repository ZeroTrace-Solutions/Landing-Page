import React from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Eye, Award, Lock, CheckCircle2 } from 'lucide-react';
import TextType from '@/components/TextType';
import TextPressure from '@/components/TextPressure';
import { siteContent } from '@/config/siteContent';

export const ClientGuarantees = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const icons = [
    <ShieldCheck className="w-8 h-8 text-sky-400" />,
    <Eye className="w-8 h-8 text-amber-400" />,
    <Award className="w-8 h-8 text-purple-400" />,
    <Lock className="w-8 h-8 text-emerald-400" />
  ];

  return (
    <section
      id="guarantees"
      className="relative z-20 w-full bg-gradient-to-b from-[#091124] via-[#0c1733] to-[#091124] rounded-t-[36px] sm:rounded-t-[56px] shadow-[0_-30px_90px_rgba(0,0,0,0.98)] border-t border-sky-500/25 py-32 px-6 overflow-hidden"
    >
      {/* Background Ambient Sapphire Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* SECTION HEADER: Single Subject - Client Safety & Guarantees */}
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center mb-20 flex flex-col items-center">
            <TextType
              text={isAr ? "// معايير الجودة والموثوقية" : "// THE ZT ADVANTAGE & CORE STANDARDS"}
              className="text-xs font-bold text-sky-400 uppercase tracking-[0.6em] mb-4 font-mono"
              speed={50}
            />
            <div className="h-24 sm:h-32 md:h-40 w-full overflow-visible">
              <TextPressure
                text={isAr ? "لماذا تختار ZT Solutions" : "ENGINEERED FOR ABSOLUTE TRUST"}
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
                ? "نحن نبني أنظمتنا البرمجية وفق أعلى معايير الشفافية والاحترافية: ملكية كاملة للكود، مراحل تسليم أسبوعية حية، وضمان شامل بعد الإطلاق."
                : "We architect software systems with uncompromising engineering excellence: complete IP ownership, weekly interactive staging demos, and dedicated post-launch support."}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 HIGHLIGHT METRICS */}
        <ScrollReveal direction="up" distance={40} delay={100}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {siteContent.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition-all duration-300 backdrop-blur-xl"
              >
                <span className="text-3xl sm:text-4xl font-black text-sky-400 font-mono tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-2">
                  {isAr ? stat.labelAr : stat.label}
                </span>
                <span className="text-[11px] text-white/40 mt-1 font-light">
                  {stat.subtext}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 4 CORE GUARANTEE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {siteContent.guarantees.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 100} distance={40} direction="up">
              <div className="h-full p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-sky-400/40 hover:bg-white/[0.04] transition-all duration-500 backdrop-blur-2xl flex flex-col justify-between group relative overflow-hidden">
                {/* Number Watermark - Positioned on opposite side of icon in both RTL and LTR */}
                <div className={`absolute top-0 ${isAr ? 'left-0 text-left' : 'right-0 text-right'} p-6 sm:p-8 text-white/5 text-7xl font-black select-none font-mono pointer-events-none`}>
                  0{index + 1}
                </div>

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {icons[index]}
                  </div>

                  <div className="text-[10px] font-mono tracking-[0.3em] text-sky-400/70 uppercase mb-2">
                    {item.badge}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-4 group-hover:text-sky-300 transition-colors">
                    {isAr ? item.titleAr : item.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/50 leading-relaxed font-light">
                    {isAr ? item.descAr : item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'ضمان رسمي ملزم بالعقد' : 'Contractually Guaranteed Standard'}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientGuarantees;
