import React, { useState, useEffect } from 'react';
import { getPortfolioData, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../../services/dataService';
import { Plus, Save, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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

export const PortfolioSection = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', titleAr: '', description: '', descriptionAr: '', image: '', link: '' });

  const isBusy = loading || isDeleting || saving;

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
      const data = await getPortfolioData();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
      toast.error(`FETCH_ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id, data) => {
    try {
      setSaving(true);
      await updatePortfolioItem(id, data);
      setEditingItem(null);
      fetchData();
      toast.success("RECORD_UPDATED");
    } catch (err) {
      toast.error(`UPDATE_FAILED: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      await addPortfolioItem(newItem);
      setNewItem({ title: '', titleAr: '', description: '', descriptionAr: '', image: '', link: '' });
      fetchData();
      toast.success("NEW_RECORD_INITIALIZED");
    } catch (err) {
      toast.error(`CREATION_FAILED: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem || isDeleting) return;
    try {
      setIsDeleting(true);
      await deletePortfolioItem(deletingItem.id);
      setDeletingItem(null);
      fetchData();
      toast.success("RECORD_DELETED");
    } catch (err) {
      toast.error(`DELETE_FAILED: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {loading && (
        <div className="p-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
          Retrieving Archival Data...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* List View */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-widest border-l-4 border-white pl-4 mb-8">CURRENT_ARCHIVE</h2>
            {items.map(item => (
              <div key={item.id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center group">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-[10px] text-white/40">{item.id}</p>
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

          <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
            <AlertDialogContent className="border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertTriangle size={18} />
                  </div>
                  <AlertDialogTitle className="text-red-500">DELETE_RECORD_CONFIRM</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-white/60 text-xs">
                  This action will permanently purge <span className="text-white font-bold">{deletingItem?.title}</span> from the archival node. Data retrieval post-operation is impossible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">ABORT</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                >
                  PURGE_DATA
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Form View (Edit/Create) */}
          <div className="bg-white/5 p-8 rounded-lg border border-white/10 h-fit">
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8">
              {editingItem ? 'Edit_Record' : 'Initialize_New'}
            </h3>
            <div className="space-y-4">
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
              <textarea
                placeholder="Description"
                value={editingItem ? editingItem.description : newItem.description}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, description: e.target.value }) : setNewItem({ ...newItem, description: e.target.value })}
                className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-24 focus:border-white/30 outline-none"
              />
              <textarea
                placeholder="الوصف"
                dir='rtl'
                value={editingItem ? editingItem.descriptionAr : newItem.descriptionAr}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, descriptionAr: e.target.value }) : setNewItem({ ...newItem, descriptionAr: e.target.value })}
                className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded h-24 focus:border-white/30 outline-none"
              />
              <input
                placeholder="Image URL"
                value={editingItem ? editingItem.image : newItem.image}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, image: e.target.value }) : setNewItem({ ...newItem, image: e.target.value })}
                className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
              />
              <input
                placeholder="Link"
                value={editingItem ? editingItem.link : newItem.link}
                onChange={(e) => editingItem ? setEditingItem({ ...editingItem, link: e.target.value }) : setNewItem({ ...newItem, link: e.target.value })}
                className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
              />

              <div className="flex gap-2 pt-4">
                {editingItem ? (
                  <>
                    <button
                      onClick={() => handleSave(editingItem.id, editingItem)}
                      disabled={isBusy}
                      className="flex-grow bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={16} /> {saving ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      disabled={isBusy}
                      className="flex-grow border border-white/10 py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={isBusy}
                    className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} /> {saving ? 'Initializing...' : 'Add Item'}
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
