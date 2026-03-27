import React from 'react';

const DocHeader = ({ docMeta, theme, t, i18n, id, isPrintView }) => {
  const isDark = theme === 'dark' && !isPrintView;
  
  return (
    <div className={`relative flex flex-col items-center p-12 border-b-2 ${isDark ? 'border-white/5 bg-[#0c0c0e]/50' : 'border-black/5 bg-neutral-50'} overflow-hidden`}>
      {/* Decorative Background Elements (Hidden on Print) */}
      <div className="no-print absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className={`no-print absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-10 ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`} />
      <div className={`no-print absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-10 ${isDark ? 'bg-purple-500' : 'bg-purple-300'}`} />

      {/* Main Header Content */}
      <div className="w-full grid grid-cols-3 items-center z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 blur-lg opacity-20 ${isDark ? 'bg-blue-500' : 'bg-blue-300'}`} />
            {docMeta?.projectLogo ? (
              <img src={docMeta.projectLogo} alt="" className="w-12 h-12 relative object-contain drop-shadow-md" />
            ) : (
              <img 
                src="/logoBlack.png" 
                alt="ZeroTrace" 
                className={`w-12 h-12 relative object-contain drop-shadow-md ${isDark ? 'brightness-200' : ''}`} 
              />
            )}
          </div>
          <div>
            <h1 className={`text-[9px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-white/30' : 'text-black/30'}`}>{t('liveDocs.project')}</h1>
            <h2 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>{docMeta?.projectName}</h2>
          </div>
        </div>

        <div className="text-center">
          <h1 className={`text-2xl font-black uppercase tracking-[0.4em] ${isDark ? 'text-white' : 'text-black'} drop-shadow-sm`}>{docMeta?.name}</h1>
          <div className="flex items-center justify-center gap-4 mt-3">
             <div className={`h-px w-12 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
             <p className={`text-[8px] uppercase tracking-[0.5em] ${isDark ? 'text-white/40' : 'text-black/40'} font-black italic`}>{t('liveDocs.confidentialProtocol')}</p>
             <div className={`h-px w-12 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          </div>
        </div>

        <div className={`text-right flex flex-col items-end ${i18n.dir() === 'rtl' ? 'items-start text-left' : ''}`}>
          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[8px] font-black tracking-widest uppercase mb-2 ${isDark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-black/5 border-black/10 text-black/50'}`}>
            {t('liveDocs.issuer')}
          </div>
          <h2 className={`text-sm font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>ZeroTrace</h2>
        </div>
      </div>
    </div>
  );
};

export default DocHeader;
