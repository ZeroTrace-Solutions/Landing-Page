import { useEffect, useRef, useState } from 'react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { Search, Zap, Infinity as InfinityIcon, ArrowUpRight, Lock } from 'lucide-react'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import TextPressure from '@/components/TextPressure'
import TextType from '@/components/TextType'
import { useTranslation } from 'react-i18next'

export const CorePillars = () => {
  const { t } = useTranslation();
  const mobileCardsRef = useRef([]);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef('down');
  const [visibleCards, setVisibleCards] = useState({});
  const [entryDirections, setEntryDirections] = useState({});

  const getCardOffset = (index, direction) => {
    const isEven = index % 2 === 0;
    if (direction === 'up') {
      return isEven ? 90 : -90;
    }
    return isEven ? -90 : 90;
  };

  useEffect(() => {
    const handleScrollDirection = () => {
      const currentY = window.scrollY;
      scrollDirectionRef.current = currentY < lastScrollYRef.current ? 'up' : 'down';
      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = Number(entry.target.getAttribute('data-card-index'));
          if (!Number.isFinite(cardIndex)) return;

          if (entry.isIntersecting) {
            setEntryDirections((prev) => ({
              ...prev,
              [cardIndex]: scrollDirectionRef.current
            }));
            setVisibleCards((prev) => ({ ...prev, [cardIndex]: true }));
          } else {
            setVisibleCards((prev) => ({ ...prev, [cardIndex]: false }));
          }
        });
      },
      {
        root: null,
        threshold: 0.25,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    mobileCardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const pillars = [
    { icon: <Search className="w-8 h-8" />, titleKey: 'strategicDiscovery', descKey: 'descDiscovery', color: 'bg-white/[0.03]' },
    { icon: <InfinityIcon className="w-8 h-8" />, titleKey: 'totalLifecycle', descKey: 'descLifecycle', color: 'bg-blue-500/5' },
    { icon: <Zap className="w-8 h-8" />, titleKey: 'agileResponse', descKey: 'descResponse', color: 'bg-purple-500/5' },
    { icon: <Lock className="w-8 h-8" />, titleKey: 'zeroTraceSecurity', descKey: 'descZeroTrace', color: 'bg-blue-500/5' }
  ];

  return (
    <section id="framework" className="pt-48 pb-24 px-6 max-w-5xl mx-auto">
      <ScrollReveal direction="left" distance={80}>
        <div className="text-center mb-24 flex flex-col items-center">
          <TextType
            text={t('systemPillars')}
            className="text-xs font-bold text-white/30 uppercase tracking-[0.8em] mb-4 italic"
            speed={50}
          />
          <div className="h-28 sm:h-40 md:h-44 w-full overflow-visible">
            <TextPressure
              text={t('strategicFramework')}
              containerClassName="w-full h-full"
              className="text-4xl md:text-5xl font-black uppercase"
              flex={false}
              alpha={false}
              stroke={false}
              width={false}
              weight={true}
              italic={true}
              textColor="white"
              minFontSize={14}
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={50} distance={40}>
        <div className="hidden lg:block">
          <ScrollStack
            useWindowScroll={true}
            className="max-w-4xl mx-auto"
            itemDistance={40}
            baseScale={0.99}
            rotationAmount={1}
            blurAmount={30}
          >
            {pillars.map((pillar, i) => (
              <ScrollStackItem key={i} itemClassName={`border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 sm:p-12 ${pillar.color}`}>
                <div className="absolute top-0 right-0 p-4 sm:p-8 text-white/5 text-7xl sm:text-8xl font-black select-none italic">
                  {t('pillarIndex', { index: i + 1 })}
                </div>
                <div className="text-white mb-4 sm:mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {pillar.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-widest uppercase mb-4 sm:mb-6 px-4">
                  {t(pillar.titleKey)}
                </h3>
                <p className="text-white/40 max-w-md leading-relaxed font-light text-sm sm:text-base px-2">
                  {t(pillar.descKey)}
                </p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>

        <div className="lg:hidden max-w-4xl mx-auto space-y-6">
          {pillars.map((pillar, i) => (
            <article
              key={i}
              data-card-index={i}
              ref={(node) => {
                mobileCardsRef.current[i] = node;
              }}
              className={`relative min-h-[18rem] border border-white/10 backdrop-blur-xl rounded-[30px] flex flex-col items-center justify-center text-center p-8 ${pillar.color}`}
              style={{
                opacity: visibleCards[i] ? 1 : 0,
                transform: visibleCards[i]
                  ? 'translate3d(0, 0, 0)'
                  : `translate3d(${getCardOffset(i, entryDirections[i] || 'down')}px, 0, 0)`,
                transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease',
                willChange: 'transform, opacity'
              }}
            >
              <div className="absolute top-0 right-0 p-4 text-white/5 text-6xl font-black select-none italic">
                {t('pillarIndex', { index: i + 1 })}
              </div>
              <div className="text-white mb-5">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-black tracking-widest uppercase mb-4 px-2">
                {t(pillar.titleKey)}
              </h3>
              <p className="text-white/40 max-w-md leading-relaxed font-light text-sm px-1">
                {t(pillar.descKey)}
              </p>
            </article>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
