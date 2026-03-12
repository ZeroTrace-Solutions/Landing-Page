import { useState, useEffect } from 'react'
import { UniverseBackground } from '@/components/ui/universe-background'
import { VideoIntro } from '@/components/ui/video-intro'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Logo } from '@/components/ui/branding'
import { Button } from '@/components/ui/button'
import { Rocket, Cpu, Globe, MessageSquare, ArrowRight, Zap, Shield, Code, Layers } from 'lucide-react'
import SplashCursor from '@/components/SplashCursor'
import Magnet from '@/components/Magnet'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import StarBorder from '@/components/StarBorder'
import GradualBlur from '@/components/GradualBlur'
import MetaBalls from '@/components/MetaBalls'
import FluidGlass from '@/components/FluidGlass'
import DecryptedText from '@/components/DecryptedText'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'


function App() {
  const [showContent, setShowContent] = useState(false)

  return (
    <div className="relative min-h-screen bg-transparent text-white selection:bg-white/20">
      <UniverseBackground />
      <SplashCursor
        SPLAT_RADIUS={0.08}
        SPLAT_FORCE={2500}
        DENSITY_DISSIPATION={8}
        VELOCITY_DISSIPATION={3.5}
        COLOR_UPDATE_SPEED={4}
      />

      <VideoIntro onComplete={() => setShowContent(true)} />

      {showContent && (
        <>
          {/* Overlay Layers - Glass Nebula */}
          <div className="fixed inset-0 bg-space-gradient pointer-events-none mix-blend-screen opacity-10 z-[2]" />




          {/* Navigation & Header Above All (z-50) */}
          <header className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center animate-in fade-in duration-1000">

            <div className="flex items-center gap-4">
              <div className="w-10 h-px bg-white/20" />
              <DecryptedText
                text="Alexandria 2026"
                animateOn="view"
                revealDirection="start"
                className="text-xs font-bold tracking-[0.4em] uppercase text-white/40"
              />
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
                  <div className="max-w-xl mx-auto text-center mb-16 px-4">
                    <GradualBlur
                      text="Architecting high-performance digital infrastructure with mathematical precision. We don't just write code; we build the future."
                      className="text-lg md:text-xl text-white/40 font-light leading-relaxed tracking-wide backdrop-blur-sm"
                    />
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={900}>
                  <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                    <Magnet padding={20} disabled={false} magnetStrength={2}>
                      <Button size="xl" className="rounded-none px-16 bg-white text-black hover:bg-white/90 transition-all font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(255,255,255,0.2)]">
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

              {/* Scroll Indicator */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-bold uppercase tracking-[1em] -mr-[1em]">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
              </div>
            </section>


            {/* Core Pillars - Storytelling Stack */}
            <section className="py-48 px-6 max-w-5xl mx-auto">
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


            {/* The Lab / Alexandria Section */}
            <section className="py-64 relative overflow-hidden">
              {/* Metaballs Background Layer */}
              <div className="absolute inset-0 z-0">
                <MetaBalls
                  color="rgba(255, 255, 255, 0.05)"
                  cursorBallColor="rgba(255, 255, 255, 0.1)"
                  numBalls={15}
                  size={0.6}
                  enableTransparency={true}
                />
              </div>

              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-32 items-center relative z-10">
                <div>
                  <ScrollReveal direction="left">
                    <TextType
                      text="// Alexandria Node"
                      className="text-xs font-bold text-white/30 uppercase tracking-[0.5em] mb-8 italic"
                      speed={50}
                    />
                    <div className="h-48 mb-12">
                      <TextPressure
                        text="BORN IN EGYPT SCALED GLOBALLY"
                        containerClassName="w-full h-full"
                        className="text-4xl md:text-6xl font-black uppercase leading-tight"
                        flex={true}
                        width={true}
                        weight={true}
                        textColor="white"
                      />
                    </div>
                    <p className="text-xl text-white/40 font-light leading-relaxed mb-12 max-w-lg">
                      Strategic software development rooted in the cradle of civilization, delivering future-proof architecture to the modern world.
                    </p>
                    <div className="grid grid-cols-2 gap-12">
                      <Magnet padding={10}>
                        <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                          <div className="text-4xl font-black mb-2 logo-font">2026</div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Inception</div>
                        </div>
                      </Magnet>
                      <Magnet padding={10}>
                        <div className="p-6 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                          <div className="text-4xl font-black mb-2 logo-font">100%</div>
                          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Uptime Target</div>
                        </div>
                      </Magnet>
                    </div>
                  </ScrollReveal>
                </div>
                <div className="relative">
                  <ScrollReveal direction="right">
                    <div className="relative group">
                      <FluidGlass
                        className="aspect-square w-full rounded-2xl overflow-hidden grayscale contrast-125 opacity-40 group-hover:opacity-100 transition-opacity duration-1000"
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-24 pointer-events-none">
                        <StarBorder className="p-1 overflow-hidden" speed="6s">
                          <div className="w-64 h-64 glass flex items-center justify-center relative overflow-hidden bg-black/40">
                            <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full" />
                            <div className="text-9xl font-black text-white/[0.05] logo-font select-none">
                              V1
                            </div>
                            <Code className="absolute w-16 h-16 text-white/20" />
                          </div>
                        </StarBorder>
                      </div>
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
                <Magnet padding={30}>
                  <Button size="xl" className="rounded-none px-24 py-10 bg-white text-black hover:scale-105 transition-all flex gap-6 mx-auto font-black uppercase tracking-widest text-xs">
                    Initiate Connection <MessageSquare className="w-5 h-5" />
                  </Button>
                </Magnet>
              </ScrollReveal>

            </section>
          </main>

          <footer className="pb-32 px-12 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 pt-16 border-t border-white/5">
              <div className="flex flex-col gap-6">
                <div className="text-xl font-black tracking-tighter">ZERO TRACE</div>
                <DecryptedText
                  text="© 2026 | All Operations Logical"
                  className="text-white/20 text-[10px] font-bold uppercase tracking-widest"
                />
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


