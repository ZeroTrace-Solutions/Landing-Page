import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Code } from 'lucide-react'
import Magnet from '@/components/Magnet'
import MetaBalls from '@/components/MetaBalls'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'
import StarBorder from '@/components/StarBorder'
import Lighthouse3D from '@/components/Lighthouse3D'
import { useTranslation } from 'react-i18next'

export const AlexandriaLab = () => {
  const { t, i18n } = useTranslation();

  return (
    <section id="manifesto" className="py-32 md:py-64 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MetaBalls
          color="#00ffff"
          cursorBallColor="rgba(255, 255, 255, 0.1)"
          numBalls={15}
          size={0.6}
          enableTransparency={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-32 items-center relative z-10">
        <div>
          <ScrollReveal direction="left">
            <TextType
              text={t('alexandriaNode')}
              className="text-xs font-bold text-white/30 uppercase tracking-[0.5em] mb-8 italic"
              speed={50}
            />
            <div className="h-28 sm:h-40 md:h-52 mb-12 overflow-visible">
              <TextPressure
                text={t('bornEgypt')}
                containerClassName="w-full h-full"
                className="text-4xl md:text-6xl font-black uppercase leading-tight"
                flex={false}
                width={false}
                weight={true}
                textColor="white"
                minFontSize={14}
              />
            </div>
            <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-12 max-w-lg">
              {t('alexandriaParagraph')}
            </p>
            <div className="grid grid-cols-2 gap-6 sm:gap-12">
              <Magnet padding={10}>
                <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <div className="text-4xl font-black mb-2 logo-font">{t('inceptionYear')}</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('inception')}</div>
                </div>
              </Magnet>
              <Magnet padding={10}>
                <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <div className="text-4xl font-black mb-2 logo-font">{t('uptimeValue')}</div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('uptimeTarget')}</div>
                </div>
              </Magnet>
            </div>
          </ScrollReveal>
        </div>
        <div className="relative">
          <ScrollReveal direction="right">
            <div className="relative group w-full aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none group-hover:bg-white/[0.05] transition-colors duration-1000" />
              <div className="w-full h-full max-w-[500px] max-h-[500px]">
                <Lighthouse3D />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
