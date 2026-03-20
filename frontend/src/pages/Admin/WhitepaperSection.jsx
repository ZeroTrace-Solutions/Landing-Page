import React, { useState, useEffect } from 'react';
import { getWhitepaperData, addWhitepaperItem, updateWhitepaperItem, deleteWhitepaperItem } from '../../services/dataService';
import { Plus, Save, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

export const WhitepaperSection = ({ onUnsavedChangesChange = () => {} }) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newItem, setNewItem] = useState({
    id: '', category: '', categoryAr: '',
    title: '', titleAr: '', excerpt: '', excerptAr: '',
    content: '', contentAr: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isBusy = loading || isDeleting || saving;
  const hasUnsavedChanges =
    !!editingItem ||
    Object.values(newItem).some((value) => String(value || '').trim() !== '');

  useEffect(() => {
    onUnsavedChangesChange(hasUnsavedChanges);
    return () => onUnsavedChangesChange(false);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWhitepaperData();
      setItems(data);
      console.log(data);
    } catch (err) {
      console.error("Failed to fetch whitepaper:", err);
      toast.error(`FETCH_ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (firebaseId, data) => {
    try {
      setSaving(true);
      await updateWhitepaperItem(firebaseId, data);
      setEditingItem(null);
      fetchData();
      toast.success("ARCHIVE_ENTRY_UPDATED");
    } catch (err) {
      toast.error(`WRITE_EXCEPTION: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const now = new Date();
      const dateEn = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const dateAr = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
      const autoId = now.toISOString().split('T')[0];
      
      await addWhitepaperItem({
        ...newItem,
        id: newItem.id || autoId,
        date: dateEn,
        dateAr: dateAr,
        createdAt: now.toISOString()
      });
      
      setNewItem({
        id: '', category: '', categoryAr: '',
        title: '', titleAr: '', excerpt: '', excerptAr: '',
        content: '', contentAr: ''
      });
      fetchData();
      toast.success("NEW_ARCHIVE_INITIALIZED");
    } catch (err) {
      toast.error(`INITIALIZATION_FAILED: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteWhitepaperItem(deletingItem.firebaseId);
      setDeletingItem(null);
      fetchData();
      toast.success("ARCHIVE_ENTRY_PURGED");
    } catch (err) {
      toast.error(`PURGE_FAILED: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {loading && (
        <div className="p-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
          Scanning Archive...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">NODE_DIRECTORY</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-widest border-l-4 border-white pl-4">ARCHIVAL_INDEX</h2>
                <Link
                  to="/whitepaper"
                  className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                >
                  View Whitepaper
                </Link>
              </div>
              {items.map(item => (
                <div key={item.firebaseId} className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center group">
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-[11px] text-white/40">{item.date}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      disabled={isBusy}
                      className="opacity-100 sm:opacity-0 group-hover:opacity-100 px-4 py-2 text-[11px] font-black border border-white/20 hover:bg-white hover:text-black transition-all disabled:pointer-events-none tracking-widest"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      disabled={isBusy}
                      className="opacity-100 sm:opacity-0 group-hover:opacity-100 px-4 py-2 text-[11px] font-black border border-red-500/30 text-red-500/70 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:pointer-events-none"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
            <AlertDialogContent className="border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertTriangle size={18} />
                  </div>
                  <AlertDialogTitle className="text-red-500">PURGE_ARCHIVE_CONFIRM</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-white/60 text-xs">
                  This action will permanently purge <span className="text-white font-bold">{deletingItem?.title}</span> from the whitepaper node. Data recovery is impossible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">ABORT</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                >
                  INITIALIZE_PURGE
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="bg-white/5 p-8 rounded-lg border border-white/10 h-fit">
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8">
              {editingItem ? 'Edit_Entry' : 'Initialize_New'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input
                  placeholder="ID (Auto-generated if empty, e.g., 2026-03-14)"
                  value={editingItem ? editingItem.id : newItem.id}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, id: e.target.value }) : setNewItem({ ...newItem, id: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                />
              </div>
              {editingItem && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Date"
                      value={editingItem.date}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                    />
                    <input
                      placeholder="التاريخ"
                      dir='rtl'
                      value={editingItem.dateAr}
                      onChange={(e) => setEditingItem({ ...editingItem, dateAr: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Category"
                  value={editingItem ? editingItem.category : newItem.category}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, category: e.target.value }) : setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                />
                <input
                  placeholder="التصنيف"
                  dir='rtl'
                  value={editingItem ? editingItem.categoryAr : newItem.categoryAr}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, categoryAr: e.target.value }) : setNewItem({ ...newItem, categoryAr: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Title"
                  value={editingItem ? editingItem.title : newItem.title}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, title: e.target.value }) : setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                />
                <input
                  placeholder="العنوان"
                  dir='rtl'
                  value={editingItem ? editingItem.titleAr : newItem.titleAr}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, titleAr: e.target.value }) : setNewItem({ ...newItem, titleAr: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <textarea
                  placeholder="Excerpt"
                  value={editingItem ? editingItem.excerpt : newItem.excerpt}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, excerpt: e.target.value }) : setNewItem({ ...newItem, excerpt: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-24 focus:border-white/30 outline-none"
                />
                <textarea
                  placeholder="الملخص"
                  dir='rtl'
                  value={editingItem ? editingItem.excerptAr : newItem.excerptAr}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, excerptAr: e.target.value }) : setNewItem({ ...newItem, excerptAr: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-24 focus:border-white/30 outline-none"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <textarea
                  placeholder="Content"
                  value={editingItem ? editingItem.content : newItem.content}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, content: e.target.value }) : setNewItem({ ...newItem, content: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-40 focus:border-white/30 outline-none"
                />
                <textarea
                  placeholder="المحتوى"
                  dir='rtl'
                  value={editingItem ? editingItem.contentAr : newItem.contentAr}
                  onChange={(e) => editingItem ? setEditingItem({ ...editingItem, contentAr: e.target.value }) : setNewItem({ ...newItem, contentAr: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-40 focus:border-white/30 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                {editingItem ? (
                  <>
                    <button
                      onClick={() => handleSave(editingItem.firebaseId, editingItem)}
                      disabled={isBusy}
                      className="flex-grow bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Save size={16} /> {saving ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      disabled={isBusy}
                      className="flex-grow border border-white/10 py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <RotateCcw size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={isBusy}
                    className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus size={16} /> {saving ? 'Initializing...' : 'Add Article'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
