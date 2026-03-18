import { getProjectsData, addProject, updateProject, deleteProject } from '../../services/dataService';
import { Plus, Save, ShieldCheck, Trash2, AlertTriangle, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
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
import { useEffect, useState } from 'react';

export const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [localCredentials, setLocalCredentials] = useState([]);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isBusy = loading || saving || isDeleting;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const optimizeLogo = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = 64; // Small icon resolution
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          // Crop to square and draw
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          resolve(canvas.toDataURL('image/webp', 0.6)); // WebP at 60% quality
        };
      };
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getProjectsData();
      setProjects(data);

      // Keep selected project in sync with new data
      if (selectedProject) {
        const updated = data.find(p => p.id === selectedProject.id);
        if (updated) {
          setSelectedProject(updated);
          setLocalCredentials(updated.credentials || []);
        }
      } else if (data.length > 0) {
        const initial = data.find(p => p.id === 'ZeroTrace') || data[0];
        setSelectedProject(initial);
        setLocalCredentials(initial.credentials || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast.error(`NODE_CONNECTION_FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newProjectName) return;
    try {
      await addProject({
        name: newProjectName,
        logo: null,
        credentials: [
          { label: 'ENVIRONMENT', key: 'API_KEY', value: 'TEMPORARY_KEY_' + Math.random().toString(36).substr(2, 9).toUpperCase() },
          { label: 'SECRET', key: 'SECRET_PHRASE', value: 'GENERATE_SECRET' }
        ],
        lastUpdated: new Date().toLocaleString()
      });
      setNewProjectName('');
      fetchData();
      toast.success("PROJECT_NODE_INITIALIZED");
    } catch (err) {
      toast.error(`REGISTRATION_FAILED: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteProject(deletingProject.id);
      if (selectedProject?.id === deletingProject.id) {
        setSelectedProject(null);
      }
      setDeletingProject(null);
      fetchData();
      toast.success("PROJECT_PURGED");
    } catch (err) {
      toast.error(`PURGE_FAILED: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveAllCreds = async () => {
    if (!selectedProject || saving) return;
    try {
      setSaving(true);
      await updateProject(selectedProject.id, {
        credentials: localCredentials,
        lastUpdated: new Date().toLocaleString()
      });
      await fetchData();
      toast.success("PROJECT_CREDENTIALS_COMMITTED");
    } catch (err) {
      toast.error(`COMMIT_FAILED: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProject) return;

    try {
      setSaving(true);
      const optimized = await optimizeLogo(file);
      await updateProject(selectedProject.id, {
        logo: optimized,
        lastUpdated: new Date().toLocaleString()
      });
      await fetchData();
      toast.success("PROJECT_LOGO_OPTIMIZED_AND_SET");
    } catch (err) {
      toast.error(`LOGO_UPLOAD_FAILED: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      {loading && (
        <div className="p-8 text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
          Connecting to Node...
        </div>
      )}

      {!loading && (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Create Project */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-grow bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none w-full"
            />
            <button
              onClick={handleCreate}
              disabled={isBusy}
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
            >
              <Plus size={18} /> Create Project
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Project List */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">NODE_DIRECTORY</h3>
              {projects.map(p => (
                <div
                  key={p.id}
                  className="group relative"
                >
                  <button
                    onClick={() => {
                      setSelectedProject(p);
                      setLocalCredentials(p.credentials || []);
                    }}
                    className={`w-full text-left p-4 rounded border transition-all ${selectedProject?.id === p.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-transparent border-white/5 hover:border-white/10'
                      } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isBusy}
                  >
                    <div className="flex items-center gap-2 pr-8">
                      {p.logo ? (
                        <img src={p.logo} alt="" className="w-5 h-5 rounded-sm object-cover" />
                      ) : (
                        <ShieldCheck size={16} className={p.id === 'ZeroTrace' ? 'text-blue-400' : 'text-white/40'} />
                      )}
                      <span className="font-bold text-base truncate">{p.name || p.id}</span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingProject(p);
                    }}
                    disabled={isBusy}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-100 lg:opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-500 transition-all disabled:pointer-events-none"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <AlertDialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
              <AlertDialogContent className="border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                      <AlertTriangle size={18} />
                    </div>
                    <AlertDialogTitle className="text-red-500">PURGE_PROJECT_CONFIRM</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-white/60 text-xs">
                    This action will permanently purge the project node <span className="text-white font-bold">{deletingProject?.name || deletingProject?.id}</span>. This protocol is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">ABORT</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                  >
                    CONFIRM_PURGE
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Credentials Table */}
            <div className="lg:col-span-3">
              {selectedProject ? (
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="relative group/logo w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        <div className="w-full h-full border border-white/10 rounded overflow-hidden bg-black/20 flex items-center justify-center">
                          {selectedProject.logo ? (
                            <img src={selectedProject.logo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-white/10" />
                          )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/logo:opacity-100 cursor-pointer transition-all">
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isBusy} />
                          <Upload size={14} className="text-white" />
                        </label>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter">{selectedProject.name} // CREDENTIALS</h3>
                        <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-1">Last Updated: {selectedProject.lastUpdated}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveAllCreds}
                      disabled={isBusy}
                      className="w-full md:w-auto px-8 py-3 bg-white text-black hover:bg-white/90 disabled:bg-white/40 disabled:text-black/60 disabled:cursor-not-allowed text-[11px] font-black uppercase tracking-widest rounded flex items-center gap-2 shadow-lg shadow-white/10 transition-all active:scale-95 min-w-[140px] justify-center"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> SAVING...
                        </>
                      ) : (
                        <>
                          <Save size={12} /> Commit Changes
                        </>
                      )}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-white/5 text-[11px] font-black uppercase tracking-widest text-white/30">
                          <th className="px-6 py-5 w-1/4">Classification</th>
                          <th className="px-6 py-5 w-1/4">Key_Identifier</th>
                          <th className="px-6 py-5">Access_Value</th>
                          <th className="px-6 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {localCredentials.map((cred, index) => (
                          <tr key={index} className="hover:bg-white/[0.01] transition-colors group/row">
                             <td className="px-6 py-5 font-mono text-white/40 italic text-[11px]">
                               <input
                                 type="text"
                                 value={cred.label || ''}
                                 placeholder="UNCLASSIFIED"
                                 onChange={(e) => {
                                   const next = [...localCredentials];
                                   next[index].label = e.target.value;
                                   setLocalCredentials(next);
                                 }}
                                 className="bg-transparent border-none focus:ring-0 text-white/40 font-mono p-0 w-full uppercase text-[11px]"
                               />
                             </td>
                             <td className="px-6 py-5 font-mono text-white/60">
                               <input
                                 type="text"
                                 value={cred.key}
                                 onChange={(e) => {
                                   const next = [...localCredentials];
                                   next[index].key = e.target.value;
                                   setLocalCredentials(next);
                                 }}
                                 className="bg-transparent border-none focus:ring-0 text-white font-mono p-0 w-full text-base"
                               />
                             </td>
                             <td className="px-6 py-5">
                               <input
                                 type="text"
                                 value={cred.value}
                                 onChange={(e) => {
                                   const next = [...localCredentials];
                                   next[index].value = e.target.value;
                                   setLocalCredentials(next);
                                 }}
                                 className="w-full bg-transparent border-none focus:ring-0 text-white font-mono placeholder:text-white/10 p-0 text-base"
                                 placeholder="NO_VALUE_SET"
                               />
                             </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  const next = localCredentials.filter((_, i) => i !== index);
                                  setLocalCredentials(next);
                                }}
                                disabled={isBusy}
                                className="opacity-100 group-hover/row:opacity-100 text-red-500/40 hover:text-red-500 transition-all p-2 disabled:pointer-events-none"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-white/[0.01]">
                          <td colSpan={4} className="px-6 py-3">
                             <button
                               onClick={() => setLocalCredentials([...localCredentials, { label: 'ENV', key: 'NEW_KEY', value: '' }])}
                               disabled={isBusy}
                               className="w-full py-4 border border-dashed border-white/10 rounded-lg text-[11px] font-black uppercase tracking-widest text-white/20 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                               <Plus size={14} /> Add_New_Credential_Pair
                             </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl italic text-white/20">
                  Select a project to view credentials
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
