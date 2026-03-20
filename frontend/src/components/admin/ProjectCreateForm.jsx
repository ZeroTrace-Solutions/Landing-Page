import { Plus } from 'lucide-react';

export const ProjectCreateForm = ({
  newProjectName,
  onProjectNameChange,
  onCreate,
  disabled,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        placeholder="New Project Name"
        value={newProjectName}
        onChange={(e) => onProjectNameChange(e.target.value)}
        className="flex-grow bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none w-full"
      />
      <button
        onClick={onCreate}
        disabled={disabled}
        className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
      >
        <Plus size={18} /> Create Project
      </button>
    </div>
  );
};
