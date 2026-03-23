import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { MessageSquare, Mail, X, MessageCircle, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DecryptedText from '@/components/DecryptedText'
import TextPressure from '@/components/TextPressure'
import Magnet from '@/components/Magnet'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion as Motion, AnimatePresence } from 'framer-motion'

export const FinalCall = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      label: t('email'),
      icon: <Mail className="w-4 h-4" />,
      href: 'mailto:solutionzerotrace@gmail.com',
      color: 'bg-white text-black'
    },
    {
      label: t('whatsapp'),
      icon: <MessageCircle className="w-4 h-4" />,
      href: 'https://wa.me/201556548385',
      color: 'bg-green-600 text-white border border-white/10'
    },
    {
      label: t('instagram'),
      icon: <Instagram className="w-4 h-4" />,
      href: 'https://www.instagram.com/zt.solutions?igsh=MW16bmFkbm0yM21sdA==',
      color: 'bg-pink-600 text-white border border-white/10'
    }
  ];

  return (
    <section id='begin' className="py-32 md:py-64 flex flex-col items-center text-center px-6 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" distance={50} duration={1}>
          <DecryptedText
            text={t('executeFinalCommand')}
            animateOn="view"
            revealDirection="center"
            className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.8em] mb-12 italic"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={50} duration={1.5} delay={200}>
          <div className="h-48 md:h-64 w-full max-w-4xl mx-auto transform transition-transform duration-500">
            <TextPressure
              text={t('letsBuild')}
              containerClassName="w-full h-full"
              className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="white"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={60} duration={1.2} delay={50}>
          <div className="relative flex flex-col items-center gap-8">
            <Magnet padding={50} magnetStrength={3}>
              <Button
                size="xl"
                onClick={() => setIsOpen(!isOpen)}
                className={`rounded-none px-12 sm:px-24 py-10 transition-all flex gap-6 mx-auto font-black uppercase tracking-widest text-sm z-20 ${isOpen ? 'bg-white/10 text-white border border-white/20' : 'bg-white text-black'
                  }`}
              >
                {isOpen ? (
                  <>{t('closeConnection')} <X className="w-5 h-5" /></>
                ) : (
                  <>{t('initiateConnection')} <MessageSquare className="w-5 h-5" /></>
                )}
              </Button>
            </Magnet>

            <AnimatePresence>
              {isOpen && (
                <Motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-wrap justify-center gap-4 z-10"
                >
                  {contactOptions.map((opt, i) => (
                    <Motion.div
                      key={opt.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Magnet padding={30} magnetStrength={4}>
                        <a
                          href={opt.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-widest shadow-2xl h-14 ${opt.color}`}
                        >
                          {opt.icon}
                          {opt.label}
                        </a>
                      </Magnet>
                    </Motion.div>
                  ))}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
