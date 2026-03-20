import { ShieldCheck, Trash2 } from 'lucide-react';

export const ProjectList = ({
  projects,
  selectedProjectId,
  onSelect,
  onRequestDelete,
  isBusy,
}) => {
  return (
    <div className="lg:col-span-1 space-y-2">
      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 mb-6">NODE_DIRECTORY</h3>
      {projects.map((project) => (
        <div key={project.id} className="group relative">
          <button
            onClick={() => onSelect(project)}
            className={`w-full text-left p-4 rounded border transition-all ${selectedProjectId === project.id
                ? 'bg-white/10 border-white/30'
                : 'bg-transparent border-white/5 hover:border-white/10'
              } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isBusy}
          >
            <div className="flex items-center gap-2 pr-8">
              {project.logo ? (
                <img src={project.logo} alt="" className="w-5 h-5 rounded-sm object-cover" />
              ) : (
                <ShieldCheck size={16} className={project.id === 'ZeroTrace' ? 'text-blue-400' : 'text-white/40'} />
              )}
              <span className="font-bold text-base truncate">{project.name || project.id}</span>
            </div>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete(project);
            }}
            disabled={isBusy}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-100 lg:opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-500 transition-all disabled:pointer-events-none"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};
