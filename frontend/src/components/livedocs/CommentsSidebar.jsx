import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Edit2, Trash2, Check, MessageCircle, Sparkles, Loader2, Wind } from 'lucide-react';

const CommentsSidebar = ({ 
  isOpen, 
  onClose, 
  comments, 
  theme, 
  currentUser, 
  i18n, 
  t, 
  editingCommentId, 
  editCommentText, 
  setEditingCommentId, 
  setEditCommentText, 
  handleEditComment, 
  handleDeleteComment, 
  focusCommentInEditor, 
  enterFocusMode,
  handleAiResolve,
  resolvingCommentId,
  handleAiAccept,
  handleAiReject
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 shadow-2xl backdrop-blur-sm z-[45] sm:hidden"
          />

          <motion.div
            initial={{ x: i18n.dir() === 'rtl' ? '-100%' : '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: i18n.dir() === 'rtl' ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-[52px] bottom-0 ${i18n.dir() === 'rtl' ? 'left-0 border-r' : 'right-0 border-l'} w-full sm:w-80 z-50 shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#09090b] border-white/10' : 'bg-white border-black/10'}`}
          >
            <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}>
              <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} /> {t('liveDocs.commentsCount')} ({comments.length})
              </h3>
              <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity p-2">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-40 opacity-30 mt-10">
                  <MessageCircle size={32} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">{t('liveDocs.noComments')}</p>
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className={`p-4 rounded-xl border flex flex-col gap-3 group/comment relative ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} hover:border-blue-500/50 transition-colors`}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{c.authorName}</span>
                        <span className={`text-[8px] uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{new Date(c.createdAt).toLocaleTimeString()}</span>
                      </div>

                      <div className="opacity-0 group-hover/comment:opacity-100 sm:group-hover/comment:opacity-100 sm:opacity-0 transition-opacity flex gap-1">
                        {currentUser?.key === c.authorKey && (
                          <button onClick={() => { setEditingCommentId(c.id); setEditCommentText(c.text); }} className="p-2 text-blue-500 hover:bg-blue-500/20 rounded">
                            <Edit2 size={12} />
                          </button>
                        )}
                        {(currentUser?.isAdmin || currentUser?.key === c.authorKey) && (
                          <button onClick={() => handleDeleteComment(c.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`text-[11px] italic border-l-2 pl-3 ${theme === 'dark' ? 'border-white/20 text-white/50' : 'border-black/20 text-black/50'} line-clamp-3 cursor-pointer hover:text-blue-500`} onClick={() => focusCommentInEditor(c)} title="Go to line">
                      "{c.lineText}"
                    </div>

                    {editingCommentId === c.id ? (
                      <div className="flex flex-col gap-3">
                        <textarea
                          autoFocus
                          value={editCommentText}
                          onChange={e => setEditCommentText(e.target.value)}
                          className={`w-full bg-black/10 rounded-lg p-3 border ${theme === 'dark' ? 'border-white/10 text-white focus:border-blue-500' : 'border-black/10 text-black focus:border-blue-500'} outline-none text-[13px] resize-none`}
                          rows={3}
                        />
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditingCommentId(null)} className="text-[10px] uppercase font-bold tracking-widest opacity-50 hover:opacity-100">{t('liveDocs.cancel')}</button>
                          <button onClick={() => handleEditComment(c.id)} className="text-[10px] uppercase font-bold tracking-widest text-blue-500 hover:text-blue-400">{t('liveDocs.confirmSign', { defaultValue: 'Save' })}</button>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-[14px] leading-relaxed ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>{c.text}</p>
                    )}

                    {currentUser?.isAdmin && !c.resolved && editingCommentId !== c.id && (
                      <div className="mt-2">
                        {c.aiDraft ? (
                          <div className={`p-3 rounded-xl border flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-500/5 border-blue-500/10'}`}>
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-1.5">
                                 <Sparkles size={11} className="text-blue-500" />
                                 <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Proposed Version</span>
                               </div>
                               <div className="flex items-center gap-1">
                                 <button 
                                   onClick={() => handleAiResolve(c)} 
                                   disabled={resolvingCommentId === c.id}
                                   className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-500/10 text-blue-600'}`}
                                   title="Retry"
                                 >
                                   {resolvingCommentId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Wind size={14} />}
                                 </button>
                                 <button 
                                   onClick={() => handleAiReject(c)} 
                                   className="p-1.5 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                   title="Reject"
                                 >
                                   <X size={14} />
                                 </button>
                                 <button 
                                   onClick={() => handleAiAccept(c)} 
                                   className="p-1.5 hover:bg-emerald-500/20 text-emerald-500 rounded transition-colors"
                                   title="Accept"
                                 >
                                   <Check size={14} />
                                 </button>
                               </div>
                             </div>
                             <p className={`text-[12px] italic line-clamp-3 leading-relaxed ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>"{c.aiDraft.proposedText}"</p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAiResolve(c)} 
                              disabled={resolvingCommentId === c.id}
                              className="flex-1 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 text-[9px] font-black uppercase tracking-widest border border-purple-500/20 hover:border-purple-500/50 rounded flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                            >
                              {resolvingCommentId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} 
                              {t('liveDocs.aiResolve') || 'AI Resolve'}
                            </button>
                            <button onClick={() => enterFocusMode(c)} className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest border border-blue-500/20 hover:border-blue-500/50 rounded flex justify-center items-center gap-2 transition-colors">
                              <Check size={12} /> {t('liveDocs.resolveComment')}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentsSidebar;
