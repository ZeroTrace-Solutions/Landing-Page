import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { Lock, Printer, ArrowLeft, ArrowRight, Loader2, ShieldAlert, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLiveDocMeta, subscribeToDocContent, hashPassword, subscribeToDocMeta } from '../services/dataService';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next'; // Needed to safely render raw HTML outside of TipTap

export const DocPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('dark');

  // Gates State
  const [passwordState, setPasswordState] = useState('pending'); // pending, checking, authenticated, error
  const [passwordInput, setPasswordInput] = useState('');
  
  // Doc State
  const [docMeta, setDocMeta] = useState(null);
  const [contentHTML, setContentHTML] = useState('');
  const [pages, setPages] = useState([]);

  // Book ref
  const bookRef = useRef();

  // 1. Password Verification
  const checkPassword = async (e) => {
    e?.preventDefault();
    if (!passwordInput.trim()) return;
    setPasswordState('checking');
    try {
      const meta = await getLiveDocMeta(id);
      if (!meta) {
        toast.error(t('liveDocs.archiveNotFound'));
        navigate('/');
        return;
      }
      
      const inputHash = await hashPassword(passwordInput);
      if (inputHash === meta.passwordHash) {
        setPasswordState('authenticated');
        setDocMeta(meta);
      } else {
        setPasswordState('error');
        setTimeout(() => setPasswordState('pending'), 800);
      }
    } catch (err) {
      toast.error(t('liveDocs.verificationFailed'));
      setPasswordState('pending');
    }
  };

  // Subscriptions once authenticated
  useEffect(() => {
    if (passwordState !== 'authenticated') return;

    const unsubMeta = subscribeToDocMeta(id, (meta) => {
      setDocMeta(meta);
    });

    const unsubContent = subscribeToDocContent(id, (contentBlock) => {
      if (contentBlock) {
        setContentHTML(contentBlock.html || '');
      }
    });

    return () => {
      unsubMeta();
      unsubContent();
    };
  }, [passwordState, id]);

  // Paginate HTML content roughly into pages (for a book look)
  // In a real robust implementation, we'd measure DOM nodes height.
  // For this prototype, we'll split by <p> and group them artificially,
  // or just render the WHOLE content in one page if it fits, or let CSS overflow handle it.
  // Or better, since it's just a visual prototype, we put all content on page 1, 
  // and page 2 is the signature finalization page.
  useEffect(() => {
    if (!contentHTML && !docMeta) return;
    
    // Very simplified pagination for the visual effect:
    // Page 1: Title/Cover
    // Page 2: Content Part 1
    // Page 3+ : Signature
    
    // It's safer to have fixed 3 pages for the book effect prototype
    setPages([
      { type: 'cover', title: docMeta?.name, text: t('CONFIDENTIAL ARCHIVE', 'CONFIDENTIAL ARCHIVE') },
      { type: 'content', html: contentHTML },
      docMeta?.finalized ? { type: 'signature' } : null
    ].filter(Boolean));
    
  }, [contentHTML, docMeta, t]);

  // Rendering Password Gate
  if (passwordState !== 'authenticated') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-zinc-950" dir={i18n.dir()}>
        {/* Gate Language Switcher */}
        <div className="absolute top-6 right-6">
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} 
            className="p-2 text-white/30 hover:text-white transition-colors flex items-center gap-2"
          >
            <Globe size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{i18n.language.toUpperCase()}</span>
          </button>
        </div>
        <motion.div
          animate={passwordState === 'error' ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`w-full max-w-sm p-8 bg-zinc-900 border ${passwordState === 'error' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/5 shadow-2xl'} rounded-xl space-y-6 text-center transition-all`}
        >
          <Lock size={32} className={`mx-auto ${passwordState === 'error' ? 'text-red-500' : 'text-white/20'}`} />
          <h2 className="text-xl font-black uppercase tracking-widest text-white/80">{t('liveDocs.confidentialArchive')}</h2>
          <form onSubmit={checkPassword} className="space-y-4">
            <input
              type="password"
              placeholder={t('liveDocs.enterSecurePassword')}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={passwordState === 'checking'}
              className="w-full bg-black/50 border border-white/5 rounded px-4 py-3 text-sm text-center text-white focus:border-white/30 outline-none transition-all font-mono tracking-widest uppercase"
            />
            <button
              type="submit"
              disabled={passwordState === 'checking' || !passwordInput}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white/50 hover:text-white text-[11px] font-black uppercase tracking-widest rounded transition-all disabled:opacity-50 border border-white/5"
            >
              {t('liveDocs.authenticate')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#111]' : 'bg-neutral-100'} text-white selection:bg-white/20 flex flex-col font-sans relative overflow-hidden`} dir={i18n.dir()}>
      
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-leather.png")' }}></div>

      {/* Toolbar */}
      <div className={`relative z-40 ${theme === 'dark' ? 'bg-black/40' : 'bg-black/80'} backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between no-print`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
            {docMeta?.projectLogo ? (
              <img src={docMeta.projectLogo} alt="" className="w-6 h-6 object-contain grayscale opacity-60" />
            ) : (
              <span className="text-white/30 font-black text-xs">ZT</span>
            )}
          </div>
          <div>
            <h1 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30">{t('liveDocs.readOnlyArchive')}</h1>
            <h2 className="text-sm uppercase tracking-widest font-bold text-white/80">{docMeta?.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings Buttons */}
          <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
             <button 
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
               className="p-2 text-white/50 hover:text-white transition-colors"
               title={t('Toggle Theme')}
             >
               {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button 
               onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} 
               className="p-2 text-white/50 hover:text-white transition-colors flex items-center gap-2"
               title={t('Switch Language')}
             >
               <Globe size={16} />
               <span className="text-[9px] font-bold uppercase">{i18n.language.toUpperCase()}</span>
             </button>
          </div>

          {docMeta?.closed && (
             <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 group">
               <Lock size={10} /> {t('liveDocs.permanentlyClosed')}
             </span>
          )}
          <button onClick={() => window.print()} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
            <Printer size={12} /> {t('liveDocs.print')}
          </button>
        </div>
      </div>

      {/* Main Book Area */}
      <div className="flex-1 overflow-visible p-4 sm:p-12 flex justify-center items-center relative z-10 print:p-0">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative print:hidden"
        >
          {pages.length > 0 && (
            <HTMLFlipBook 
              width={500} 
              height={707} 
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              drawShadow={true}
              flippingTime={600}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              direction={i18n.dir()}
              ref={bookRef}
              className="drop-shadow-2xl"
            >
              {pages.map((page, i) => (
                <div key={i} className="bg-white border border-black/10 text-black flex flex-col justify-between overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] h-full">
                  
                  {/* Page Header */}
                  <div className="flex justify-between items-center p-6 border-b border-black/5 opacity-50 text-[8px] font-black uppercase tracking-widest mx-4 mt-2">
                    <span>{docMeta?.projectName}</span>
                    <span>ZT / {docMeta?.id.slice(0,6)}</span>
                  </div>

                  {/* Page Content based on type */}
                  <div className="flex-1 p-10 overflow-hidden relative">
                    {page.type === 'cover' && (
                      <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
                         {docMeta?.projectLogo && <img src={docMeta.projectLogo} alt="" className="w-20 h-20 object-contain mb-8 opacity-80" />}
                         <div className="w-12 h-1 bg-black/80 mb-8" />
                         <h1 className="text-4xl font-black uppercase tracking-widest text-[#111] leading-tight max-w-[80%] mx-auto">{page.title}</h1>
                         <p className="text-xs uppercase tracking-[0.4em] font-bold text-black/30 mt-6">{page.text}</p>
                         <p className="text-[8px] uppercase tracking-widest text-black/20 mt-2">{new Date(docMeta?.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {page.type === 'content' && (
                      <div 
                        className="prose prose-sm max-w-none text-black/80 font-sans prose-headings:font-black prose-headings:uppercase prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.html || '') }} 
                      />
                    )}

                    {page.type === 'signature' && (
                      <div className="h-full flex flex-col justify-end pb-10">
                        <div className={`border-t ${theme === 'dark' ? 'border-black/10' : 'border-black/5'} pt-10`}>
                          <img src={docMeta.signature} alt="Signature" className="h-24 object-contain brightness-0 opacity-80" />
                          <div className="h-px w-48 bg-black mb-2 mt-2" />
                          <p className="text-[9px] font-bold uppercase tracking-widest">{docMeta.signerName}</p>
                          <p className="text-[8px] uppercase tracking-widest text-black/50 mt-1">{t('liveDocs.authorizedSignature')}</p>
                          <p className="text-[8px] uppercase tracking-widest text-black/30 mt-1">{t('liveDocs.date')} {new Date(docMeta.finalizedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="absolute top-10 right-10 flex flex-col items-end">
                          <ShieldAlert size={48} className="text-black/5 mb-2" />
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-black/10">{t('liveDocs.securelySignedSealed')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Page Footer */}
                  <div className="flex justify-between items-center p-4 opacity-30 text-[8px] font-bold uppercase tracking-widest mx-4 mb-2">
                    <span>{t('liveDocs.page')} {i + 1}</span>
                    <span>ZeroTrace Solutions</span>
                  </div>

                </div>
              ))}
            </HTMLFlipBook>
          )}

          {/* Book Controls */}
          {pages.length > 0 && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6 border border-white/5 bg-white/[0.02] p-2 rounded-full backdrop-blur-md">
              <button onClick={() => bookRef.current?.pageFlip()?.flipPrev()} className="p-3 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all">
                <ArrowLeft size={16} />
              </button>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hidden sm:block">{t('liveDocs.archiveNavigation')}</span>
              <button onClick={() => bookRef.current?.pageFlip()?.flipNext()} className="p-3 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Print Only View */}
        <div className="hidden print:block w-full text-black bg-white">
           <div 
             className="prose max-w-none text-black font-sans w-[210mm] mx-auto p-[20mm]"
             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentHTML || '') }} 
           />
           {docMeta?.finalized && (
             <div className="w-[210mm] mx-auto p-[20mm] pt-0">
               <div className="border-t border-black/20 pt-10">
                 <img src={docMeta.signature} alt="Signature" className="h-24 object-contain brightness-0 opacity-80" />
                 <div className="h-px w-48 bg-black mb-2 mt-2" />
                 <p className="text-[9px] font-bold uppercase tracking-widest">{docMeta.signerName}</p>
                 <p className="text-[8px] uppercase tracking-widest text-black/50 mt-1">{t('liveDocs.authorizedSignature')}</p>
               </div>
             </div>
           )}
        </div>
      </div>

    </div>
  );
};
