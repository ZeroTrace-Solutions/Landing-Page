import { useState } from 'react'
import { UniverseBackground } from '@/components/ui/universe-background'
import { VideoIntro } from '@/components/ui/video-intro'
import SplashCursor from '@/components/SplashCursor'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { CorePillars } from '@/components/sections/CorePillars'
import { ProtocolStack } from '@/components/sections/ProtocolStack'
import { AlexandriaLab } from '@/components/sections/AlexandriaLab'
import { FinalCall } from '@/components/sections/FinalCall'
import { Footer } from '@/components/sections/Footer'
import { ScrollBeam } from '@/components/sections/ScrollBeam'

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

          <Header />

          <main className="relative z-10">
            <Hero />
            <ScrollBeam />

            <CorePillars />

            <ProtocolStack />

            <AlexandriaLab />

            <FinalCall />
          </main>

          <Footer />
        </>
      )}
    </div>
  )
}

export default App



