import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { Button } from '@/components/ui/button'

function App() {
  const heroRef = useRef(null)

  useEffect(() => {
    anime({
      targets: heroRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 1500,
      easing: 'easeOutExpo'
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">ZeroTrace Solutions</h1>
        <nav className="flex gap-4">
          <Button variant="ghost">Home</Button>
          <Button variant="ghost">Services</Button>
          <Button variant="ghost">Contact</Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-24">
        <div ref={heroRef} className="text-center max-w-2xl space-y-6">
          <h2 className="text-6xl font-extrabold tracking-tight">
            Build the future with <span className="text-primary">Precision</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Fast, secure, and modern solutions for your next big project.
            Let's create something extraordinary together.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full px-8">Get Started</Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">Learn More</Button>
          </div>
        </div>

        <section className="mt-32 w-full max-w-5xl">
          <h3 className="text-3xl font-bold mb-8">Our Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 border rounded-2xl hover:border-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 bg-primary rounded-full opacity-50" />
                </div>
                <h4 className="text-xl font-bold mb-2">Capability {i}</h4>
                <p className="text-muted-foreground italic">
                  Advanced solutions tailored for high performance and scalability.
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-[200vh] flex items-center justify-center text-muted-foreground opacity-20 text-4xl font-black uppercase tracking-widest overflow-hidden pointer-events-none select-none">
          Scroll Down to test Lenis
        </div>
      </main>

      <footer className="p-12 border-t text-center text-muted-foreground">
        &copy; 2026 ZeroTrace Solutions. All rights reserved.
      </footer>
    </div>
  )
}

export default App
