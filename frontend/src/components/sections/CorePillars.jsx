import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Search, Shield, Zap, Infinity, ArrowUpRight, Lock } from 'lucide-react'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'
import { useTranslation } from 'react-i18next'

export const CorePillars = () => {
  const { t } = useTranslation();

  return (
    <section id="framework" className="pt-48 pb-0 px-6 max-w-5xl mx-auto">
      <ScrollReveal direction="left" distance={80}>
        <div className="text-center mb-24 flex flex-col items-center">
          <TextType
            text={t('systemPillars')}
            className="text-xs font-bold text-white/30 uppercase tracking-[0.8em] mb-4 italic"
            speed={50}
          />
          <div className="h-32 w-full">
            <TextPressure
              text={t('strategicFramework')}
              containerClassName="w-full h-full"
              className="text-4xl md:text-5xl font-black uppercase"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="white"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={300} distance={40}>
        <ScrollStack
          useWindowScroll={true}
          className="max-w-4xl mx-auto"
          itemDistance={80}
          baseScale={0.9}
          rotationAmount={2}
          blurAmount={10}
        >
          {[
            { icon: <Search className="w-8 h-8" />, titleKey: "strategicDiscovery", descKey: "descDiscovery", color: "bg-white/[0.03]" },
            { icon: <Infinity className="w-8 h-8" />, titleKey: "totalLifecycle", descKey: "descLifecycle", color: "bg-blue-500/5" },
            { icon: <Zap className="w-8 h-8" />, titleKey: "agileResponse", descKey: "descResponse", color: "bg-purple-500/5" },
            { icon: <ArrowUpRight className="w-8 h-8" />, titleKey: "elasticScaling", descKey: "descScaling", color: "bg-white/[0.03]" },
            { icon: <Lock className="w-8 h-8" />, titleKey: "zeroTraceSecurity", descKey: "descZeroTrace", color: "bg-blue-500/5" }
          ].map((pillar, i) => (
            <ScrollStackItem key={i} itemClassName={`border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12 overflow-hidden ${pillar.color}`}>
              <div className="absolute top-0 right-0 p-8 text-white/5 text-8xl font-black select-none italic">
                {t('pillarIndex', { index: i + 1 })}
              </div>
              <div className="text-white mb-8 transform group-hover:scale-110 transition-transform duration-500">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-black tracking-widest uppercase mb-6">
                {t(pillar.titleKey)}
              </h3>
              <p className="text-white/40 max-w-md leading-relaxed font-light">
                {t(pillar.descKey)}
              </p>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </ScrollReveal>
    </section>
  )
}
