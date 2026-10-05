import React, { useState } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { MessageSquare, Mail, MessageCircle, Instagram, ArrowRight, Check, Copy, ExternalLink, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DecryptedText from '@/components/DecryptedText';
import TextPressure from '@/components/TextPressure';
import Magnet from '@/components/Magnet';
import { useTranslation } from 'react-i18next';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const FinalCall = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const TARGET_EMAIL = 'solutionzerotrace@gmail.com';

  const [copied, setCopied] = useState(false);

  const projectTypes = [
    { id: 'saas', label: isAr ? 'منصة SaaS سحابية' : 'SaaS Platform' },
    { id: 'custom-web', label: isAr ? 'تطبيق ويب / بوابة إلكترونية' : 'Custom Web App' },
    { id: 'ecommerce', label: isAr ? 'متجر إلكتروني / تجارة مخصصة' : 'E-Commerce / Custom Studio' },
    { id: 'backend', label: isAr ? 'بنية تحتية سحابية و APIs' : 'Cloud Architecture & APIs' }
  ];

  const [selectedType, setSelectedType] = useState('saas');

  const selectedLabel = projectTypes.find((p) => p.id === selectedType)?.label || 'Software Project';

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً ZT Solutions، أرغب في مناقشة تفاصيل مشروع: ${selectedLabel}`
      : `Hello ZT Solutions, I would like to discuss building a ${selectedLabel}.`
  );

  const emailSubject = isAr
    ? `استفسار عن مشروع: ${selectedLabel} - ZT Solutions`
    : `Project Inquiry: ${selectedLabel} - ZT Solutions`;

  const emailBody = isAr
    ? `مرحباً فريق ZT Solutions،\n\nأود مناقشة تفاصيل تطوير مشروع (${selectedLabel}).\n\nنطاق المشروع المبدئي: ${selectedLabel}\n\nالرجاء التواصل لتحديد موعد مكالمة استكشافية.\n\nمع التحية،`
    : `Hello ZT Solutions team,\n\nI would like to discuss building a ${selectedLabel}.\n\nLooking forward to hearing from you!\n\nBest regards,`;

  const encodedSubject = encodeURIComponent(emailSubject);
  const encodedBody = encodeURIComponent(emailBody);

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${encodedSubject}&body=${encodedBody}`;
  const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`;

  const copyToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(TARGET_EMAIL);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = TARGET_EMAIL;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast.success(
        isAr
          ? `تم نسخ البريد: ${TARGET_EMAIL}`
          : `Copied to clipboard: ${TARGET_EMAIL}`
      );
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      toast.info(TARGET_EMAIL);
    }
  };

  const handleEmailAction = (e) => {
    e.preventDefault();
    copyToClipboard();
    try {
      const opened = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        window.location.href = mailtoUrl;
      }
    } catch {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <section
      id="begin"
      className="relative z-20 w-full bg-gradient-to-b from-[#03050c] via-[#050914] to-[#010206] border-t border-sky-500/30 py-32 md:py-48 flex flex-col items-center text-center px-6 overflow-hidden"
    >
      {/* Ambient Radiant Beacon Flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <ScrollReveal direction="up" distance={40} duration={1}>
          <DecryptedText
            text={isAr ? "ابدأ اليوم // بدون أي مخاطرة" : "EXECUTE_COLLABORATION // RISK_FREE"}
            animateOn="view"
            revealDirection="center"
            className="text-[11px] sm:text-xs font-mono font-bold text-sky-400 uppercase tracking-[0.6em] mb-8 italic"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" distance={50} duration={1.2} delay={100}>
          <div className="h-36 sm:h-48 md:h-56 w-full max-w-4xl mx-auto mb-10">
            <TextPressure
              text={isAr ? "هيا لنبنِ مشروعك" : "LET'S BUILD TOGETHER."}
              containerClassName="w-full h-full"
              className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={false}
              textColor="white"
            />
          </div>
        </ScrollReveal>

        {/* Interactive Scope Pre-Selector */}
        <ScrollReveal direction="up" distance={40} duration={1} delay={200}>
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl mb-12 max-w-2xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-4">
              {isAr ? "١. اختر نوع مشروعك للمناقشة المباشرة:" : "1. SELECT YOUR PROJECT TYPE:"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {projectTypes.map((pt) => {
                const isSelected = selectedType === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setSelectedType(pt.id)}
                    className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span>{pt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-white/40 font-light mb-6">
              {isAr
                ? "تحدث مباشرة مع مهندسينا لنحدد معك نطاق العمل وجدول التسليم خلال مكالمة استكشافية مجانية مدتها 30 دقيقة."
                : "Connect directly with our engineering team to scope your milestones during a free 30-minute discovery call."}
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/201556548385?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs sm:text-sm tracking-widest transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{isAr ? 'محادثة واتساب فورية' : 'Chat on WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleEmailAction}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-white font-bold uppercase text-xs sm:text-sm tracking-widest transition-all shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-sky-400" />
                <span>{isAr ? 'إرسال بريد إلكتروني' : 'Email Team'}</span>
              </button>
            </div>

            {/* Direct Email Address & 1-Click Copy Strip */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.03] rounded-2xl p-4 sm:px-5 border border-white/5 text-left">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {isAr ? 'البريد الإلكتروني المباشر' : 'Direct Email Address'}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-sky-300 font-semibold select-all">
                    {TARGET_EMAIL}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/15'
                  }`}
                  title={isAr ? 'نسخ البريد إلى الحافظة' : 'Copy email to clipboard'}
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ البريد' : 'Copy')}</span>
                </button>

                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 border border-sky-500/30 transition-all cursor-pointer"
                  title={isAr ? 'فتح في موقع Gmail' : 'Open composer in Gmail web'}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح في Gmail' : 'Gmail Web'}</span>
                </a>

                <a
                  href={mailtoUrl}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all cursor-pointer"
                  title={isAr ? 'فتح في تطبيق البريد بالنظام' : 'Open in system mail app'}
                >
                  <span>{isAr ? 'تطبيق البريد' : 'Mail App'}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Social / Direct Proof Links */}
        <ScrollReveal direction="up" distance={30} delay={300}>
          <div className="flex items-center justify-center gap-6 text-white/30 text-xs font-mono">
            <a
              href="https://www.instagram.com/zt.solutions?igsh=MW16bmFkbm0yM21sdA=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@zt.solutions</span>
            </a>
            <span>•</span>
            <a
              href="https://github.com/ZeroTrace-Solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              github.com/ZeroTrace-Solutions
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCall;
