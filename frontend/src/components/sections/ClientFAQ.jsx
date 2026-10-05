import React, { useState } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useTranslation } from 'react-i18next';
import { siteContent } from '@/config/siteContent';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ClientFAQ = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="relative z-20 w-full bg-gradient-to-b from-[#071622] via-[#0a2030] to-[#071622] border-t border-cyan-500/25 py-32 px-6 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal direction="up" distance={40}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? "الأسئلة الشائعة والشفافية" : "TRANSPARENCY & COMMON QUESTIONS"}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {isAr ? "كل ما تحتاج معرفته قبل أن نبدأ" : "EVERYTHING YOU NEED TO KNOW"}
            </h2>
            <p className="text-white/50 text-sm sm:text-base mt-3 max-w-xl mx-auto font-light">
              {isAr
                ? "إجابات واضحة ومباشرة حول ملكية الكود، وجدول التسليمات، والضمان الفني بعد الإطلاق."
                : "Straightforward clarity on code ownership, milestone staging, post-launch warranties, and kickoff times."}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {siteContent.faq.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={index * 80} distance={30} direction="up">
                <div
                  className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden ${
                    isOpen
                      ? 'border-cyan-400/50 bg-white/[0.04] shadow-[0_0_35px_rgba(6,182,212,0.15)]'
                      : 'border-cyan-500/15 bg-white/[0.02] hover:border-cyan-500/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer"
                    dir={isAr ? 'rtl' : 'ltr'}
                  >
                    <span className="font-bold text-white text-base sm:text-lg flex items-center gap-3">
                      <ShieldCheck className={`w-5 h-5 shrink-0 ${isOpen ? 'text-cyan-400' : 'text-white/30'}`} />
                      {isAr ? item.qAr : item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-6 pb-6 pt-2 text-white/60 text-sm leading-relaxed border-t border-cyan-500/10 font-light"
                          dir={isAr ? 'rtl' : 'ltr'}
                        >
                          {isAr ? item.aAr : item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ClientFAQ;
