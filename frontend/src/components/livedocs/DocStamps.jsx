import React from 'react';

const DocStamps = ({ docMeta, id, theme, t, i18n }) => {
  if (!docMeta?.finalized) return null;

  return (
    <div className={`mt-20 p-8 pt-0 flex justify-between items-end border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} print:border-black/10 pt-10 mx-8 mb-8 ${i18n.dir() === 'rtl' ? 'flex-row-reverse' : ''}`} style={{ pageBreakInside: 'avoid' }}>
      <div className={i18n.dir() === 'rtl' ? 'text-right' : ''}>
        <img src={docMeta.signature} alt="Signature" className={`h-24 object-contain opacity-80 ${theme === 'dark' ? 'brightness-200' : 'brightness-0'} print:brightness-0`} />
        <div className={`h-px w-48 ${theme === 'dark' ? 'bg-white/50' : 'bg-black'} print:bg-black mb-2 mt-2`} />
        <p className="text-[9px] font-bold uppercase tracking-widest">{docMeta.signerName}</p>
        <p className={`text-[8px] uppercase tracking-widest ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} print:text-black/50 mt-1`}>{t('liveDocs.authorizedSignature')}</p>
        <p className={`text-[8px] uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-black/30'} print:text-black/30 mt-1`}>{t('liveDocs.date')} {new Date(docMeta.finalizedAt).toLocaleDateString()}</p>
      </div>
      <div className={`flex flex-col items-end ${i18n.dir() === 'rtl' ? 'items-start text-left' : 'items-end text-right'}`}>
        <img 
          src="/logoBlack.png" 
          alt="ZeroTrace Stamp" 
          className={`h-12 object-contain mb-2 ${theme === 'dark' ? 'opacity-30 brightness-200' : 'opacity-10'}`} 
        />
        <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-blue-500/50' : 'text-blue-900/30'}`}>{t('liveDocs.securelySignedSealed')}</p>
        <p className={`text-[7px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'} mt-1`}>{t('liveDocs.id')} {id}</p>
      </div>
    </div>
  );
};

export default DocStamps;
