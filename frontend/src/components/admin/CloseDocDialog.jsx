import { useState } from 'react';
import { AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CloseDocDialog = ({ open, onOpenChange, onCloseDoc, isBusy }) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState(false);
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const onSubmit = (e) => {
    e.preventDefault();
    if (adminPassword === correctPassword) {
      setError(false);
      onCloseDoc();
      setAdminPassword('');
      onOpenChange(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
      setAdminPassword('');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={error ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1 }}
        transition={error ? { duration: 0.4 } : {}}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-sm p-6 bg-black border ${error ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/10 shadow-2xl'} rounded-xl space-y-6 relative overflow-hidden transition-all`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0"></div>
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <Lock size={20} className="text-red-500" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-widest text-white">Permanently Close</h2>
          <p className="text-[10px] text-white/50 uppercase tracking-wider leading-relaxed">
            This action will disconnect all active sessions and mark the document as <strong className="text-red-400">Read-Only Preview</strong>. This cannot be undone.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-red-500/70 flex items-center gap-2">
              <AlertTriangle size={12} /> Admin Auth Required
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter Admin Password..."
              required
              disabled={isBusy}
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-sm text-center text-white focus:border-red-500/50 outline-none transition-all font-mono tracking-widest`}
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isBusy || !adminPassword}
              className="w-full py-3 bg-red-500 hover:bg-red-400 text-black text-[11px] font-black uppercase tracking-widest rounded transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Closure'}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
              className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
