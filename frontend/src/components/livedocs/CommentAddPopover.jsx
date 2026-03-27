import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';

const CommentAddPopover = ({
  show,
  popoverData,
  theme,
  t,
  draftText,
  setDraftText,
  onAddComment,
  isVisible,
  onOpenInput,
  onClose
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show || !isVisible) return null;

  // Mobile specific positioning for input mode
  const mobileInputStyles = isMobile && popoverData.isInputMode ? {
    bottom: 0,
    left: 0,
    right: 0,
    top: 'auto',
    transform: 'none',
    width: '100vw',
    borderRadius: '24px 24px 0 0',
  } : {
    top: Math.max(80, popoverData.y),
    left: Math.min(window.innerWidth - 160, Math.max(160, popoverData.x)),
    transform: 'translate(-50%, -130%)'
  };

  return (
    <AnimatePresence>
      {show && isVisible && (
        <>
          {/* Backdrop for mobile input mode */}
          {isMobile && popoverData.isInputMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[65]"
            />
          )}

          <motion.div
            initial={isMobile && popoverData.isInputMode ? { y: '100%' } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={isMobile && popoverData.isInputMode ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile && popoverData.isInputMode ? { y: '100%' } : { opacity: 0, scale: 0.8, y: 10 }}
            className={`fixed z-[70] ${isMobile && popoverData.isInputMode ? 'shadow-[0_-20px_50px_rgba(0,0,0,0.5)]' : ''}`}
            style={mobileInputStyles}
          >
            {!popoverData.isInputMode ? (
              <button
                onClick={onOpenInput}
                className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl border backdrop-blur-xl group hover:scale-105 transition-all ${theme === 'dark'
                  ? 'bg-[#18181b]/90 border-blue-500/30 text-blue-400'
                  : 'bg-white/90 border-blue-500/30 text-blue-600'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-black flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <MessageSquare size={16} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{t('liveDocs.addComment') || 'Add Comment'}</span>
              </button>
            ) : (
              <div className={`p-6 rounded-t-[2.5rem] sm:rounded-2xl shadow-2xl border flex flex-col gap-4 w-full sm:min-w-[420px] max-w-[100vw] ${theme === 'dark' ? 'bg-[#09090b] border-white/10' : 'bg-white border-black/10'} ${isMobile ? 'pb-12 pt-8' : ''}`}>
                
                {/* Drag Handle for Mobile */}
                {isMobile && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/10 rounded-full" />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{t('liveDocs.newComment') || 'New Comment'}</div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className={`p-2 rounded-full transition-all active:scale-90 ${theme === 'dark' ? 'bg-white/5 hover:bg-red-500/20 text-red-500' : 'bg-black/5 hover:bg-red-500/10 text-red-500'}`}
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>{t('liveDocs.referencing') || 'Reference'}</div>
                   <div className={`text-[12px] italic border-l-2 pl-4 py-2 ${theme === 'dark' ? 'border-blue-500/30 text-white/50 bg-white/[0.02]' : 'border-blue-500/30 text-black/50 bg-black/[0.02]'} line-clamp-2 leading-relaxed rounded-r-xl`}>
                     "{popoverData.lineText}"
                   </div>
                </div>

                <div className="flex gap-3 items-center mt-2">
                  <div className={`flex-1 flex flex-col border-b-2 transition-all ${theme === 'dark' ? 'border-white/10 focus-within:border-blue-500' : 'border-black/10 focus-within:border-blue-500'}`}>
                    <input
                      autoFocus
                      type="text"
                      value={draftText}
                      onChange={e => setDraftText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && onAddComment()}
                      placeholder={t('liveDocs.commentPlaceholder') || 'Enter your message...'}
                      className={`bg-transparent outline-none text-[16px] px-0 py-3 ${theme === 'dark' ? 'text-white' : 'text-black'} placeholder:text-white/10`}
                    />
                  </div>
                  <button
                    onClick={onAddComment}
                    disabled={!draftText.trim()}
                    className="bg-blue-500 text-black w-12 h-12 rounded-2xl hover:bg-blue-400 transition-all active:scale-90 shadow-xl shadow-blue-500/20 flex items-center justify-center shrink-0 disabled:opacity-30 disabled:grayscale"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentAddPopover;
