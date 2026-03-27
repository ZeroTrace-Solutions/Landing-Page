import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, X } from 'lucide-react';

const DocContextMenu = ({ 
  show, 
  x, 
  y, 
  onAddComment, 
  onCopy, 
  onClose,
  theme,
  t 
}) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] cursor-default" 
      onClick={onClose} 
      onContextMenu={(e) => { e.preventDefault(); onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        style={{ top: y, left: x }}
        className={`fixed z-[101] w-48 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border p-1 backdrop-blur-xl ${theme === 'dark' ? 'bg-[#18181b]/95 border-white/10' : 'bg-white/95 border-black/10'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 border-b border-inherit mb-1">
           <div className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/30' : 'text-black/30'}`}>{t('liveDocs.selectionOptions')}</div>
        </div>

        <button
          onClick={() => { onAddComment(); onClose(); }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-blue-500/20 hover:text-blue-400' : 'text-black hover:bg-blue-500/10 hover:text-blue-600'}`}
        >
          <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center">
            <MessageSquare size={14} className="text-blue-500" />
          </div>
          {t('liveDocs.addComment')}
        </button>

        <button
          onClick={() => { onCopy(); onClose(); }}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
            <Copy size={14} className={theme === 'dark' ? 'text-white/70' : 'text-black/70'} />
          </div>
          {t('liveDocs.copy') || 'Copy Selection'}
        </button>

        <div className="h-px bg-inherit my-1" />

        <button
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg transition-all opacity-50 hover:opacity-100 ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-black hover:bg-black/5'}`}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <X size={14} />
          </div>
          {t('liveDocs.cancel')}
        </button>
      </motion.div>
    </div>
  );
};

export default DocContextMenu;
