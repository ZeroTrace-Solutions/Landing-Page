import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Logo } from '@/components/ui/branding'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Magnet from '@/components/Magnet'
import GradualBlur from '@/components/GradualBlur'
import { useLenis } from 'lenis/react'

export const Hero = () => {
  const lenis = useLenis()

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
      <div className="h-screen flex flex-col items-center justify-center">
        <ScrollReveal distance={100} duration={1.5}>
          <Logo className="transform hover:scale-[1.05] transition-transform duration-1000" />
        </ScrollReveal>
      </div>

      <div className="w-full flex flex-col items-center -mt-32 pb-32">
        <ScrollReveal delay={400} distance={40} direction="up" duration={1.2}>
          <div className="max-w-xl mx-auto text-center mb-16 px-4">
            <GradualBlur
              text="Architecting high-performance digital infrastructure with mathematical precision. We don't just write code; we build the future."
              className="text-lg md:text-xl text-white/40 font-light leading-relaxed tracking-wide backdrop-blur-sm"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={800} distance={60} direction="up" duration={1}>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Magnet padding={20} disabled={false} magnetStrength={2}>
              <Button 
                onClick={handleStart}
                size="xl" 
                className="rounded-none px-16 bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Initialize Project
              </Button>
            </Magnet>
            <Magnet padding={20}>
              <Button size="xl" variant="ghost" className="text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold">
                Read Whitepaper <ArrowRight className="ml-4 w-4 h-4" />
              </Button>
            </Magnet>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={1200} direction="down" distance={20}>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
          <span className="text-[8px] font-bold uppercase tracking-[1em] -mr-[1em]">Scroll</span>
        </div>
      </ScrollReveal>
    </section>
  )
}
