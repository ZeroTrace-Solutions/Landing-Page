import { getProjectsData, addProject, updateProject, deleteProject } from '../../services/dataService';
import { toast } from 'sonner';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ProjectCreateForm } from '@/components/admin/ProjectCreateForm';
import { ProjectList } from '@/components/admin/ProjectList';
import { DeleteProjectDialog } from '@/components/admin/DeleteProjectDialog';
import { ProjectCredentialsPanel } from '@/components/admin/ProjectCredentialsPanel';
import { EnvImportDialog } from '@/components/admin/EnvImportDialog';

export const ProjectsSection = ({ onUnsavedChangesChange = () => {} }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [localCredentials, setLocalCredentials] = useState([]);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [envImportDialogOpen, setEnvImportDialogOpen] = useState(false);
  const [envImportClassification, setEnvImportClassification] = useState('IMPORTED');
  const [pendingEnvFile, setPendingEnvFile] = useState(null);
  const [isImportingEnv, setIsImportingEnv] = useState(false);

  const cloneCredentials = (credentials = []) => credentials.map((credential) => ({ ...credential }));

  const hasUnsavedChanges = !!selectedProject &&
    JSON.stringify(localCredentials) !== JSON.stringify(selectedProject.credentials || []);

  const isBusy = loading || saving || isDeleting || isImportingEnv;

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
          setLocalCredentials(cloneCredentials(updated.credentials || []));
        }
      } else if (data.length > 0) {
        const initial = data.find(p => p.id === 'ZeroTrace') || data[0];
        setSelectedProject(initial);
        setLocalCredentials(cloneCredentials(initial.credentials || []));
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

  const handleSelectProject = (project) => {
    if (selectedProject?.id !== project.id && hasUnsavedChanges) {
      toast.error('UNCOMMITTED_CHANGES_BLOCKING_PROJECT_SWITCH');
      return;
    }

    setSelectedProject(project);
    setLocalCredentials(cloneCredentials(project.credentials || []));
  };

  const handleChangeCredential = (index, field, value) => {
    setLocalCredentials((prev) =>
      prev.map((credential, credentialIndex) => {
        if (credentialIndex !== index) return credential;
        return { ...credential, [field]: value };
      }),
    );
  };

  const handleRemoveCredential = (index) => {
    const next = localCredentials.filter((_, i) => i !== index);
    setLocalCredentials(next);
  };

  const handleAddCredential = () => {
    setLocalCredentials([...localCredentials, { label: 'ENV', key: 'NEW_KEY', value: '' }]);
  };

  const handleDownloadEnv = (credentialsToExport = localCredentials) => {
    if (!selectedProject || credentialsToExport.length === 0) return;

    const envContent = credentialsToExport
      .filter((credential) => credential?.key)
      .map((credential) => `${credential.key}=${credential.value ?? ''}`)
      .join('\n');

    const blob = new Blob([envContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const fileName = `${selectedProject.id || selectedProject.name || 'project'}.env`;

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    toast.success('CREDENTIALS_EXPORTED_TO_ENV');
  };

  const handleConfirmEnvImport = async () => {
    if (!pendingEnvFile || isImportingEnv) return;

    try {
      setIsImportingEnv(true);
      const classification = envImportClassification.trim() || 'IMPORTED';
      const content = await pendingEnvFile.text();
      const imported = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const separatorIndex = line.indexOf('=');
          if (separatorIndex <= 0) return null;

          const key = line.slice(0, separatorIndex).trim();
          const value = line.slice(separatorIndex + 1).trim();
          if (!key) return null;

          return {
            label: classification,
            key,
            value,
          };
        })
        .filter(Boolean);

      if (imported.length === 0) {
        toast.error('ENV_IMPORT_EMPTY_OR_INVALID');
        return;
      }

      setLocalCredentials((prev) => [...prev, ...imported]);
      setEnvImportDialogOpen(false);
      setPendingEnvFile(null);
      toast.success(`ENV_IMPORTED_${imported.length}_ITEMS_APPENDED`);
    } catch (err) {
      toast.error(`ENV_IMPORT_FAILED: ${err.message}`);
    } finally {
      setIsImportingEnv(false);
    }
  };

  const handleEnvImportDialogChange = (open) => {
    setEnvImportDialogOpen(open);
    if (!open && !isImportingEnv) {
      setPendingEnvFile(null);
    }
  };

  const handleUploadEnv = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingEnvFile(file);
    setEnvImportClassification('IMPORTED');
    setEnvImportDialogOpen(true);
    e.target.value = '';
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
          <EnvImportDialog
            open={envImportDialogOpen}
            onOpenChange={handleEnvImportDialogChange}
            classification={envImportClassification}
            onClassificationChange={setEnvImportClassification}
            fileName={pendingEnvFile?.name}
            onConfirm={handleConfirmEnvImport}
            isImporting={isImportingEnv}
          />

          <ProjectCreateForm
            newProjectName={newProjectName}
            onProjectNameChange={setNewProjectName}
            onCreate={handleCreate}
            disabled={isBusy}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <ProjectList
              projects={projects}
              selectedProjectId={selectedProject?.id}
              onSelect={handleSelectProject}
              onRequestDelete={setDeletingProject}
              isBusy={isBusy}
            />

            <DeleteProjectDialog
              project={deletingProject}
              open={!!deletingProject}
              onOpenChange={() => setDeletingProject(null)}
              onConfirm={handleDelete}
              isBusy={isDeleting}
            />

            <div className="lg:col-span-3">
              <ProjectCredentialsPanel
                selectedProject={selectedProject}
                credentials={localCredentials}
                onChangeCredential={handleChangeCredential}
                onRemoveCredential={handleRemoveCredential}
                onAddCredential={handleAddCredential}
                onSave={handleSaveAllCreds}
                onDownloadEnv={handleDownloadEnv}
                onUploadEnv={handleUploadEnv}
                onLogoUpload={handleLogoUpload}
                isBusy={isBusy}
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
