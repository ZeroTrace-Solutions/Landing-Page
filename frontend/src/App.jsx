import { useState, useEffect } from 'react'
import { UniverseBackground } from '@/components/ui/universe-background'
import { VideoIntro } from '@/components/ui/video-intro'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Logo } from '@/components/ui/branding'
import { Button } from '@/components/ui/button'
import { Rocket, Cpu, Globe, MessageSquare, ArrowRight, Zap, Shield, Code } from 'lucide-react'

function App() {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20">
      <UniverseBackground />
      <VideoIntro onComplete={() => setShowContent(true)} />

      {showContent && (
        <>
          {/* Overlay Layers - Glass Nebula */}
          <div className="fixed inset-0 bg-space-gradient pointer-events-none mix-blend-screen opacity-10 z-[2]" />




          {/* Navigation & Header Above All (z-50) */}
          <header className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center animate-in fade-in duration-1000">

            <div className="flex items-center gap-4">
              <div className="w-10 h-px bg-white/20" />
              <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/40">Alexandria 2026</span>
            </div>
            <nav className="hidden lg:flex gap-12 text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">
              <a href="#" className="hover:text-white transition-colors">Framework</a>
              <a href="#" className="hover:text-white transition-colors">Solutions</a>
              <a href="#" className="hover:text-white transition-colors">Manifesto</a>
            </nav>
            <Button variant="outline" size="sm" className="rounded-none border-white/10 glass-dark hover:bg-white hover:text-black transition-all px-8 uppercase tracking-widest text-[10px]">
              Secure Node
            </Button>
          </header>

          <main className="relative z-10">
            {/* Hero Section: Centered Branding to match video end frame */}
            <section className="relative min-h-[120vh] flex flex-col items-center px-6">
              {/* This container ensures the logo stays at dead center of the first viewport */}
              <div className="h-screen flex flex-col items-center justify-center">
                <ScrollReveal delay={0}>
                  <Logo className="transform hover:scale-[1.05] transition-transform duration-1000" />
                </ScrollReveal>


              </div>

              {/* Tagline and Buttons follow immediately in the flow */}
              <div className="w-full flex flex-col items-center -mt-32 pb-32">
                <ScrollReveal delay={600}>
                  <p className="max-w-xl mx-auto text-center text-lg md:text-xl text-white/40 font-light leading-relaxed mb-16 tracking-wide backdrop-blur-sm">
                    Architecting high-performance digital infrastructure with mathematical precision. We don't just write code; we build the future.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={900}>
                  <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                    <Button size="xl" className="rounded-none px-16 bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      Initialize Project
                    </Button>
                    <Button size="xl" variant="ghost" className="text-white/40 hover:text-white transition-all uppercase tracking-[0.3em] text-[10px] font-bold">
                      Read Whitepaper <ArrowRight className="ml-4 w-4 h-4" />
                    </Button>
                  </div>
                </ScrollReveal>
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-bold uppercase tracking-[1em] -mr-[1em]">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
              </div>
            </section>


            {/* Core Pillars */}
            <section className="py-48 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/5 border border-white/5 overflow-hidden">
                {[
                  { icon: <Code />, title: "Precision Engineering", desc: "Every micro-interaction is optimized for peak performance and absolute reliability." },
                  { icon: <Shield />, title: "Zero Compromise", desc: "Security is baked into our DNA. We build systems that are resilient by design." },
                  { icon: <Zap />, title: "Quantum Velocity", desc: "Radically fast deployment cycles powered by a modern, cloud-native tech stack." }
                ].map((pillar, i) => (
                  <ScrollReveal key={i} delay={i * 200} direction="up">
                    <div className="p-16 bg-white/[0.02] backdrop-blur-sm border border-white/5 flex flex-col items-start gap-8 group hover:bg-white/5 transition-colors h-full">

                      <div className="text-white/20 group-hover:text-white transition-colors transform group-hover:scale-110 duration-500">
                        {pillar.icon}
                      </div>
                      <h3 className="text-xl font-bold tracking-widest uppercase">{pillar.title}</h3>
                      <p className="text-white/40 leading-relaxed font-light">{pillar.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {/* The Lab / Alexandria Section */}
            <section className="py-64 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-32 items-center">
                <div>
                  <ScrollReveal direction="left">
                    <div className="text-xs font-bold text-white/30 uppercase tracking-[0.5em] mb-8 italic">// Alexandria Node</div>
                    <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-[0.9]">
                      BORN IN <span className="text-glow underline decoration-white/10 italic">EGYPT.</span><br />SCALED GLOBALLY.
                    </h2>
                    <p className="text-xl text-white/40 font-light leading-relaxed mb-12 max-w-lg">
                      Strategic software development rooted in the cradle of civilization, delivering future-proof architecture to the modern world.
                    </p>
                    <div className="grid grid-cols-2 gap-12">
                      <div>
                        <div className="text-4xl font-black mb-2 logo-font">2026</div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Inception</div>
                      </div>
                      <div>
                        <div className="text-4xl font-black mb-2 logo-font">100%</div>
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Uptime Target</div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
                <div className="relative">
                  <ScrollReveal direction="right">
                    <div className="aspect-square glass flex items-center justify-center p-24 animate-float">
                      <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full" />
                      <div className="text-[15rem] font-black text-white/[0.02] logo-font select-none">
                        V1
                      </div>
                      <Code className="absolute w-32 h-32 text-white/10" />
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* Final Call */}
            <section className="py-64 flex flex-col items-center text-center px-6 border-t border-white/5">
              <ScrollReveal>
                <div className="text-xs font-bold text-white/30 uppercase tracking-[0.8em] mb-12 italic">Execute Final Command</div>
                <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter logo-font">
                  LET'S <span className="text-glow italic">BUILD.</span>
                </h2>
                <Button size="xl" className="rounded-none px-24 py-10 bg-white text-black hover:scale-105 transition-all flex gap-6 mx-auto font-black uppercase tracking-widest text-xs">
                  Initiate Connection <MessageSquare className="w-5 h-5" />
                </Button>
              </ScrollReveal>
            </section>
          </main>

          <footer className="pb-32 px-12 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 pt-16 border-t border-white/5">
              <div className="flex flex-col gap-6">
                <div className="text-xl font-black tracking-tighter">ZERO TRACE</div>
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">© 2026 | All Operations Logical</p>
              </div>
              <div className="flex gap-16 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
                <a href="#" className="hover:text-white transition-colors">Endpoint</a>
                <a href="#" className="hover:text-white transition-colors">Protocol</a>
                <a href="#" className="hover:text-white transition-colors">Source</a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

export default App


