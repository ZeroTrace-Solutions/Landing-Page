import { Button } from '@/components/ui/button'
import { useLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

export const Header = () => {
  const lenis = useLenis()
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = ['framework', 'solutions', 'begin']
    const observers = []

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Center-ish trigger
      threshold: 0
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      });
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e, target) => {
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.5,
      })
    }
  }

  const navLinks = [
    { label: 'Framework', href: '#framework', id: 'framework' },
    { label: 'Solutions', href: '#solutions', id: 'solutions' },
    { label: 'Manifesto', href: '#begin', id: 'begin' },
  ]

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-between items-center animate-in fade-in ${
      isScrolled 
        ? 'py-4 px-8 glass-dark bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
        : 'py-8 px-8 bg-transparent'
    }`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-px bg-white/20" />
        <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/40">Alexandria 2026</span>
      </div>
      <nav className="hidden lg:flex gap-12 text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`transition-all duration-300 hover:text-white ${
              activeSection === link.id ? 'text-white' : ''
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <Button variant="outline" size="sm" className="rounded-none border-white/10 glass-dark hover:bg-white hover:text-black transition-all px-8 uppercase tracking-widest text-[10px]">
        Secure Node
      </Button>
    </header>
  )
}
