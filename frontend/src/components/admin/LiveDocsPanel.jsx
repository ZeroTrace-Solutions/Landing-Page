import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Plus, Trash2, Lock, Copy, Eye, Edit3, ExternalLink, ShieldCheck, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLiveDocs, deleteLiveDoc } from '../../services/dataService';
import { toast } from 'sonner';
import { CreateLiveDocDialog } from './CreateLiveDocDialog';
import { CloseDocDialog } from './CloseDocDialog';
import { DeleteDocDialog } from './DeleteDocDialog';
import { createLiveDoc } from '../../services/dataService';

// Utility for hashing an ID to an HSL color for the stack labels
const getDocColor = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 40%)`;
};

export const LiveDocsPanel = ({ selectedProject, isBusy }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [closingDoc, setClosingDoc] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const [deletingDoc, setDeletingDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load docs on mount and when selected project changes
  useEffect(() => {
    let active = true;
    const fetchDocs = async () => {
      if (!selectedProject?.id) return;
      setLoading(true);
      try {
        const result = await getLiveDocs(selectedProject.id);
        if (active) setDocs(result);
      } catch (err) {
        toast.error(`ERROR_LOADING_DOCS: ${err.message}`);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDocs();
    return () => { active = false; };
  }, [selectedProject?.id]);

  const handleCreate = async (name, password) => {
    try {
      setIsCreating(true);
      const newDocId = await createLiveDoc(
        selectedProject.id, 
        name, 
        password, 
        selectedProject
      );
      toast.success('DOCUMENT_NODE_INITIALIZED');
      
      // Auto-refresh list
      const result = await getLiveDocs(selectedProject.id);
      setDocs(result);

      // Copy invite link
      handleCopyLink(newDocId);
    } catch (err) {
      toast.error(`DOC_CREATION_FAILED: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async (docId) => {
    try {
      const link = `${window.location.origin}/docs/${docId}`;
      
      // Try navigator.clipboard first
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        toast.success('INVITATIONAL_LINK_COPIED');
      } else {
        // Fallback for non-secure contexts or legacy browsers
        const textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (success) {
          toast.success('INVITATIONAL_LINK_COPIED');
        } else {
          throw new Error('EXEC_COMMAND_FAILED');
        }
      }
    } catch (err) {
      console.error('Failed to copy document link:', err);
      toast.error('COPY_FAILED');
    }
  };

  const handleDelete = async (docId) => {
    try {
      setIsDeleting(true);
      await deleteLiveDoc(docId);
      setDocs(docs.filter(d => d.id !== docId));
      toast.success('DOC_PURGED');
    } catch (err) {
      toast.error(`PURGE_FAILED: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setDeletingDoc(null);
    }
  };

  const handleCloseConfirm = async () => {
    if (!closingDoc) return;
    try {
      setIsClosing(true);
      const { closeDoc } = await import('../../services/dataService');
      await closeDoc(closingDoc.id);
      toast.success('DOC_LOCKED_PERMANENTLY');
      // Refresh
      const result = await getLiveDocs(selectedProject.id);
      setDocs(result);
    } catch (err) {
      toast.error(`LOCK_FAILED: ${err.message}`);
    } finally {
      setIsClosing(false);
      setClosingDoc(null);
    }
  };

  if (!selectedProject) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl italic text-white/20 uppercase tracking-widest text-[11px]">
        Select a project to view docs
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-2">
          <FileText size={14} /> LIVE_DOCS_ARCHIVE
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/60 ml-2">{docs.length}</span>
        </h3>
        
        <button
          onClick={() => setCreateDialogOpen(true)}
          disabled={isBusy}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-black text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50"
        >
          <Plus size={12} /> New Live Doc
        </button>
      </div>

      <CreateLiveDocDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreate}
        isBusy={isCreating || isBusy}
      />

      <CloseDocDialog 
        open={!!closingDoc}
        onOpenChange={(v) => !v && setClosingDoc(null)}
        onCloseDoc={handleCloseConfirm}
        isBusy={isClosing}
      />

      <DeleteDocDialog
        open={!!deletingDoc}
        onOpenChange={(v) => !v && setDeletingDoc(null)}
        doc={deletingDoc}
        onDelete={handleDelete}
        isBusy={isDeleting}
      />

      {loading ? (
        <div className="py-20 flex justify-center text-white/20">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : docs.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
          <p className="text-[11px] uppercase tracking-widest text-white/30 font-bold mb-2">No active documents</p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest">Create one to begin collaborative sessions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 py-4">
          <AnimatePresence>
            {docs.map(doc => (
              <DocCard 
                key={doc.id} 
                doc={doc} 
                onDelete={() => setDeletingDoc(doc)}
                onClose={() => setClosingDoc(doc)}
                onCopy={() => handleCopyLink(doc.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const DocCard = ({ doc, onDelete, onClose, onCopy }) => {
  const color = useMemo(() => getDocColor(doc.id), [doc.id]);
  const link = `/docs/${doc.id}`;
  const previewLink = `/docs/${doc.id}/preview`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative h-48 [perspective:1000px] z-0 hover:z-10"
    >
      {/* 3D Stack Effect Layers */}
      <div className="absolute inset-0 bg-white/5 border border-white/5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform translate-z-[-20px] translate-y-3 scale-95 transition-all duration-300 group-hover:translate-z-[-40px] group-hover:translate-y-4 group-hover:scale-95" />
      <div className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg shadow-[0_4px_15px_rgba(0,0,0,0.6)] transform translate-z-[-10px] translate-y-1.5 scale-95 transition-all duration-300 group-hover:translate-z-[-20px] group-hover:translate-y-2 group-hover:scale-[0.98]" />

      {/* Main Front Card */}
      <div className="absolute inset-0 bg-black border border-white/20 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-5 flex flex-col justify-between transform transition-all duration-300 group-hover:translate-z-[10px] group-hover:-translate-y-2 group-hover:border-white/40 overflow-hidden">
        
        {/* Color Spine/Tab */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-2"
          style={{ backgroundColor: color }}
        />

        {/* Header content */}
        <div className="pl-4">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-base truncate pr-2 text-white/90 group-hover:text-white transition-colors">{doc.name}</h4>
            {doc.closed ? (
              <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                <Lock size={8} /> Closed
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1">
                <ShieldCheck size={8} /> Active
              </span>
            )}
          </div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-2">
            Created: {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col p-4 justify-center items-center gap-3">
          
          <div className="flex w-full gap-2">
            {!doc.closed ? (
              <a 
                href={link} target="_blank" rel="noreferrer"
                className="flex-1 bg-blue-500 hover:bg-blue-400 text-black py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <Edit3 size={12} /> Edit
              </a>
            ) : (
              <button disabled className="flex-1 bg-white/10 text-white/40 py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock size={12} /> Closed
              </button>
            )}
            
            <a 
              href={previewLink} target="_blank" rel="noreferrer"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/20 hover:border-white/40"
            >
              <Eye size={12} /> Preview
            </a>
          </div>

          <div className="w-full h-px bg-white/10 my-1" />

          {/* Admin Tools */}
          <div className="flex w-full justify-between gap-2">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy();
              }}
              className="flex-1 px-2 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 rounded transition-all"
              title="Copy Link (Anyone with password)"
            >
              <Copy size={10} /> Link
            </button>
            {!doc.closed && (
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-1 px-2 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest text-amber-500/50 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-all"
                title="Permanently Close"
              >
                <Lock size={10} /> Close
              </button>
            )}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 px-2 py-1.5 flex items-center justify-center gap-1 text-[9px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
              title="Delete Doc"
            >
              <Trash2 size={10} /> Del
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
