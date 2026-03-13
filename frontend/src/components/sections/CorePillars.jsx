import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Code, Shield, Zap, Layers } from 'lucide-react'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'

export const CorePillars = () => {
  return (
    <section id="framework" className="pt-48 pb-0 px-6 max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="text-center mb-24 flex flex-col items-center">
          <TextType
            text="// System Pillars"
            className="text-xs font-bold text-white/30 uppercase tracking-[0.8em] mb-4 italic"
            speed={50}
          />
          <div className="h-32 w-full max-w-2xl">
            <TextPressure
              text="Core Framework"
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

      <ScrollStack
        useWindowScroll={true}
        className="max-w-4xl mx-auto"
        itemDistance={80}
        baseScale={0.9}
        rotationAmount={2}
        blurAmount={10}
      >
        {[
          { icon: <Code className="w-8 h-8" />, title: "Precision Engineering", desc: "Every micro-interaction is optimized for peak performance and absolute reliability. Our codebases are architected to withstand the tests of scale and time.", color: "bg-white/[0.03]" },
          { icon: <Shield className="w-8 h-8" />, title: "Zero Compromise", desc: "Security is baked into our DNA. We build systems that are resilient by design, utilizing military-grade encryption and zero-trust protocols.", color: "bg-blue-500/5" },
          { icon: <Zap className="w-8 h-8" />, title: "Quantum Velocity", desc: "Radically fast deployment cycles powered by a modern, cloud-native tech stack. We move at the speed of thought, ensuring your project hits the market first.", color: "bg-purple-500/5" },
          { icon: <Layers className="w-8 h-8" />, title: "Recursive Growth", desc: "Scalable architecture that evolves with your users. We don't just build for the present; we engineer for a decade of expansion.", color: "bg-white/[0.03]" }
        ].map((pillar, i) => (
          <ScrollStackItem key={i} itemClassName={`border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12 overflow-hidden ${pillar.color}`}>
            <div className="absolute top-0 right-0 p-8 text-white/5 text-8xl font-black select-none italic">
              0{i + 1}
            </div>
            <div className="text-white mb-8 transform group-hover:scale-110 transition-transform duration-500">
              {pillar.icon}
            </div>
            <h3 className="text-2xl font-black tracking-widest uppercase mb-6">{pillar.title}</h3>
            <p className="text-white/40 max-w-md leading-relaxed font-light">{pillar.desc}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  )
}
