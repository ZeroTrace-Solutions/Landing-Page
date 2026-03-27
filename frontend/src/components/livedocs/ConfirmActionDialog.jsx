import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

const ConfirmActionDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  isBusy,
  theme,
  t 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`w-full max-w-sm border rounded-2xl overflow-hidden shadow-2xl ${
          theme === 'dark' 
            ? 'bg-[#18181b] border-red-500/30' 
            : 'bg-white border-red-500/20'
        }`}
      >
        <div className={`p-5 border-b flex justify-between items-center ${
          theme === 'dark' ? 'border-red-500/10' : 'border-red-500/10'
        }`}>
          <h2 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            <AlertTriangle size={16} className="text-red-500" /> {title}
          </h2>
          <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <Trash2 size={32} />
          </div>
          
          <p className={`text-[13px] font-bold leading-relaxed ${
            theme === 'dark' ? 'text-white/70' : 'text-black/70'
          }`}>
            {message}
          </p>
          
          <p className={`text-[10px] items-center gap-2 opacity-40 uppercase font-black tracking-tighter ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            {t('liveDocs.criticalOperation') || 'Critical Operation // No UNDO'}
          </p>

          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={onClose}
              disabled={isBusy}
              className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                theme === 'dark' 
                  ? 'border-white/10 text-white/50 hover:bg-white/5' 
                  : 'border-black/10 text-black/50 hover:bg-black/5'
              }`}
            >
              {t('liveDocs.cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={isBusy}
              className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmActionDialog;
