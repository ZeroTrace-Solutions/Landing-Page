import { useState } from 'react';
import { ShieldAlert, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreateLiveDocDialog = ({ open, onOpenChange, onCreate, isBusy }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      onCreate(name.trim(), password.trim());
      setName('');
      setPassword('');
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-6 bg-black border border-white/10 rounded-xl shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
        
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Plus size={20} className="text-blue-400" /> New Live Doc
          </h2>
          <p className="text-[11px] text-white/40 uppercase tracking-widest mt-2">Initialize a new collaborative session</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Document Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. SRS Phase 1"
              required
              disabled={isBusy}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2 relative group">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <ShieldAlert size={12} className="text-amber-500" /> Access Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a secure password..."
              required
              disabled={isBusy}
              autoComplete="new-password"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-amber-500/50 outline-none transition-all font-mono placeholder-sans"
            />
            <p className="text-[9px] text-amber-500/70 uppercase tracking-wider mt-1 flex items-start gap-1">
              <AlertTriangle size={10} className="shrink-0 mt-[1px]" />
              This password will be required for ALL participants to enter the document.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              className="px-6 py-2 border border-white/10 rounded text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy || !name.trim() || !password.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-black text-[11px] font-black uppercase tracking-widest rounded transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : 'Create Node'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
