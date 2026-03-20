import { Download, FileUp, Image as ImageIcon, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';

export const ProjectCredentialsPanel = ({
  selectedProject,
  credentials,
  onChangeCredential,
  onRemoveCredential,
  onAddCredential,
  onSave,
  onDownloadEnv,
  onUploadEnv,
  onLogoUpload,
  isBusy,
  saving,
}) => {
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [keySearch, setKeySearch] = useState('');

  if (!selectedProject) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl italic text-white/20">
        Select a project to view credentials
      </div>
    );
  }

  const classifications = useMemo(() => {
    const unique = new Set(
      credentials
        .map((credential) => (credential.label || '').trim())
        .filter(Boolean),
    );
    return ['ALL', ...Array.from(unique)];
  }, [credentials]);

  const filteredCredentials = useMemo(() => {
    const normalizedSearch = keySearch.trim().toLowerCase();

    return credentials.filter((credential) => {
      const label = (credential.label || '').trim();
      const key = String(credential.key || '');

      const matchesClassification = classificationFilter === 'ALL' || label === classificationFilter;
      const matchesSearch = !normalizedSearch || key.toLowerCase().includes(normalizedSearch);

      return matchesClassification && matchesSearch;
    });
  }, [classificationFilter, keySearch, credentials]);

  return (
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
              <input type="file" className="hidden" accept="image/*" onChange={onLogoUpload} disabled={isBusy} />
              <Upload size={14} className="text-white" />
            </label>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tighter">{selectedProject.name} // CREDENTIALS</h3>
            <p className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest mt-1">Last Updated: {selectedProject.lastUpdated}</p>
          </div>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onDownloadEnv(filteredCredentials)}
            disabled={isBusy || filteredCredentials.length === 0}
            className="px-4 py-3 border border-white/20 text-white/80 hover:text-white hover:border-white/40 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all"
          >
            <Download size={12} /> Export .env
          </button>
          <label className="px-4 py-3 border border-white/20 text-white/80 hover:text-white hover:border-white/40 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".env,text/plain"
              onChange={onUploadEnv}
              disabled={isBusy}
            />
            <FileUp size={12} /> Import .env
          </label>
          <button
            onClick={onSave}
            disabled={isBusy}
            className="px-8 py-3 bg-white text-black hover:bg-white/90 disabled:bg-white/40 disabled:text-black/60 disabled:cursor-not-allowed text-[11px] font-black uppercase tracking-widest rounded flex items-center gap-2 shadow-lg shadow-white/10 transition-all active:scale-95 min-w-[140px] justify-center"
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
      </div>
      <div className="px-4 sm:px-6 py-4 border-b border-white/10 bg-white/[0.01] flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Classification</span>
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="bg-black/50 border border-white/10 rounded px-3 py-2 text-[11px] uppercase tracking-wider text-white/80 focus:border-white/30 outline-none"
          >
            {classifications.map((item) => (
              <option key={item} value={item} className="bg-black text-white">
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="w-full md:w-[320px]">
            <input
              type="text"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              placeholder="Search key_identifier..."
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-white/30 outline-none"
            />
          </div>
          <button
            onClick={() => {
              setClassificationFilter('ALL');
              setKeySearch('');
            }}
            disabled={classificationFilter === 'ALL' && keySearch.trim() === ''}
            className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-black uppercase tracking-widest rounded transition-all"
          >
            Clear
          </button>
        </div>
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
            {filteredCredentials.map((credential) => {
              const index = credentials.indexOf(credential);

              return (
              <tr key={index} className="hover:bg-white/[0.01] transition-colors group/row">
                <td className="px-6 py-5 font-mono text-white/40 italic text-[11px]">
                  <input
                    type="text"
                    value={credential.label || ''}
                    placeholder="UNCLASSIFIED"
                    onChange={(e) => onChangeCredential(index, 'label', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white/40 font-mono p-0 w-full uppercase text-[11px]"
                  />
                </td>
                <td className="px-6 py-5 font-mono text-white/60">
                  <input
                    type="text"
                    value={credential.key}
                    onChange={(e) => onChangeCredential(index, 'key', e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-white font-mono p-0 w-full text-base"
                  />
                </td>
                <td className="px-6 py-5">
                  <input
                    type="text"
                    value={credential.value}
                    onChange={(e) => onChangeCredential(index, 'value', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-white font-mono placeholder:text-white/10 p-0 text-base"
                    placeholder="NO_VALUE_SET"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRemoveCredential(index)}
                    disabled={isBusy}
                    className="opacity-100 group-hover/row:opacity-100 text-red-500/40 hover:text-red-500 transition-all p-2 disabled:pointer-events-none"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
              );
            })}
            {filteredCredentials.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/30 text-[11px] uppercase tracking-wider">
                  No credentials match current filter
                </td>
              </tr>
            )}
            <tr className="bg-white/[0.01]">
              <td colSpan={4} className="px-6 py-3">
                <button
                  onClick={onAddCredential}
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
  );
};
