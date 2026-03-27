import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Check, Loader2 } from 'lucide-react';

const FinalizeDocDialog = ({ 
  isOpen, 
  onClose, 
  theme, 
  t, 
  i18n, 
  signatureRef, 
  isFinalizing, 
  handleFinalize,
  SignatureComponent
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir={i18n.dir()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-lg ${theme === 'dark' ? 'bg-[#18181b] border-white/10 text-white' : 'bg-white border-black/10 text-black'} border rounded-xl overflow-hidden shadow-2xl relative`}
        >
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} flex justify-between items-center`}>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={20} className="text-blue-500" /> {t('liveDocs.finalizeDocument')}
              </h2>
              <p className={`text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-white/50' : 'text-black/50'} mt-1 font-bold`}>{t('liveDocs.finalizeWarning')}</p>
            </div>
            <button onClick={onClose} className={`${theme === 'dark' ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'}`}>
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className={`${theme === 'dark' ? 'bg-[#09090b] border-white/10' : 'bg-neutral-100 border-black/10'} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-lg p-1 border overflow-hidden touch-none`}>
              <SignatureComponent
                ref={signatureRef}
                penColor={theme === 'dark' ? 'white' : 'black'}
                canvasProps={{ className: 'w-full h-48 cursor-crosshair' }}
              />
              <div className={`flex justify-between items-center p-2 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
                <p className={`text-[9px] uppercase font-bold ${theme === 'dark' ? 'text-white/30' : 'text-black/30'} tracking-widest`}>{t('liveDocs.signInsideBox')}</p>
                <button onClick={() => signatureRef.current.clear()} className={`text-[9px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'}`}>{t('liveDocs.clear')}</button>
              </div>
            </div>

            <div className={`flex gap-2 justify-end pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
              <button onClick={onClose} disabled={isFinalizing} className={`px-6 py-3 border ${theme === 'dark' ? 'border-white/20 text-white/80 hover:text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'} text-[11px] font-bold uppercase tracking-widest rounded transition-all`}>{t('liveDocs.cancel')}</button>
              <button onClick={handleFinalize} disabled={isFinalizing} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-black text-[11px] font-black uppercase tracking-widest rounded transition-all shadow-lg flex items-center gap-2">
                {isFinalizing ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> {t('liveDocs.confirmSign')}</>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FinalizeDocDialog;
