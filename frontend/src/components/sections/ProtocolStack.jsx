import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Cpu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'
import CardSwap, { Card } from '@/components/CardSwap'

export const ProtocolStack = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section id="solutions" className="py-32 px-6 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div>
          <ScrollReveal direction="left">
            <TextType
              text={t('protocolStack')}
              className="text-xs font-bold text-white/30 uppercase tracking-[0.5em] mb-8 italic"
              speed={50}
            />
            <div className="h-32 mb-8">
              <TextPressure
                text="SYSTEMIC LOGIC"
                containerClassName="w-full h-full"
                className="text-5xl md:text-7xl font-black uppercase"
                flex={true}
                width={true}
                weight={true}
                textColor="white"
              />
            </div>
            <p className="text-lg text-white/40 font-light leading-relaxed max-w-md mb-12">
              Our methodology is defined by three recursive layers of development, ensuring absolute stability from kernel to interface. We translate complex requirements into streamlined, mathematical architectures.
            </p>
            <div className="flex items-center gap-6">
              <div className="h-px w-12 bg-white/20" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
                {t('proprietaryFramework')}
              </span>
            </div>
            {/* portfolio button */}
            <div className="mt-12">
              <button
                onClick={() => navigate('/portfolio')}
                className="px-6 py-3 bg-[#00ffff] text-black font-bold rounded-full hover:bg-[#00e5e5] transition-colors"
              >
                {t('viewPortfolio')}
              </button>
            </div>
          </ScrollReveal>
        </div>

        <div className="relative h-[600px] flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[450px] h-[500px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <CardSwap
              width={400}
              height={500}
              cardDistance={50}
              verticalDistance={60}
              delay={4500}
              pauseOnHover={true}
              easing="power"
            >
              {[
                {
                  titleKey: "architecture",
                  subtitle: "Structural Integrity",
                  layer: "Layer 01",
                  desc: "Mathematical models define our data structures, ensuring O(1) efficiency where it matters most. We architect for scale before the first line of code is committed."
                },
                {
                  titleKey: "zeroTrust",
                  subtitle: "Immutable Security",
                  layer: "Layer 02",
                  desc: "Every interaction is validated. Our security protocols aren't an afterthought; they are the foundation. Logic is isolated, immutable, and fully verifiable."
                },
                {
                  titleKey: "autonomy",
                  subtitle: "Self-Healing Edges",
                  layer: "Layer 03",
                  desc: "Digital infrastructure that manages itself through automated scaling and self-healing deployment pipelines optimized for global edge delivery and zero latency."
                }
              ].map((step, i) => (
                <Card key={i} className="border-white/10 bg-white/[0.02] backdrop-blur-2xl p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-500 rounded-2xl">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
                        {t('layer', { num: step.layer.split(' ')[1] })}
                      </div>
                      <Cpu className="w-5 h-5 text-white/10" />
                    </div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">
                      {t(step.titleKey)}
                    </h3>
                    <div className="w-16 h-1 bg-white/10 mb-8" />
                    <p className="text-white/40 leading-relaxed font-light text-sm md:text-base">
                      {step.desc}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                      {step.subtitle}
                    </div>
                    <div className="text-[9px] text-white/10 font-mono">
                      EXEC_STATUS: OPTIMIZED
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
