import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DeleteDocDialog = ({ open, onOpenChange, doc, onDelete, isBusy }) => {
  if (!open || !doc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-black border border-red-500/30 rounded-xl overflow-hidden shadow-2xl relative shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <div className="p-6 border-b border-red-500/20 flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2 text-white">
              <AlertTriangle size={20} className="text-red-500" /> Confirm Deletion
            </h2>
            <button onClick={() => onOpenChange(false)} className="text-white/30 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4 text-center">
            <Trash2 size={48} className="mx-auto text-red-500/50 mb-4" />
            <p className="text-[12px] uppercase tracking-widest text-white/50 font-bold mb-2">
              Permanently delete this document and all its data?
            </p>
            <p className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
              Doc: {doc.name}
            </p>
            <p className="text-[9px] uppercase tracking-widest text-white/30">
              This action cannot be undone.
            </p>

            <div className="flex gap-2 justify-end pt-4 mt-8 border-t border-white/10">
              <button 
                onClick={() => onOpenChange(false)} 
                disabled={isBusy} 
                className="px-6 py-3 border border-white/20 text-white/80 hover:text-white hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest rounded transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => onDelete(doc.id)} 
                disabled={isBusy} 
                className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white text-[11px] font-black uppercase tracking-widest rounded transition-all shadow-lg flex items-center gap-2 disabled:bg-red-500/50"
              >
                {isBusy ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} /> Delete</>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
