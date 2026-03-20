import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const EnvImportDialog = ({
  open,
  onOpenChange,
  classification,
  onClassificationChange,
  fileName,
  onConfirm,
  isImporting,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.06)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">IMPORT_ENV_CREDENTIALS</AlertDialogTitle>
          <AlertDialogDescription className="text-white/60 text-xs">
            Apply one classification to every key/value from <span className="text-white font-bold">{fileName || '.env file'}</span> before appending to this project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 mt-2">
          <label htmlFor="env-classification" className="text-[10px] font-black uppercase tracking-widest text-white/50">
            Classification
          </label>
          <input
            id="env-classification"
            type="text"
            value={classification}
            onChange={(e) => onClassificationChange(e.target.value)}
            className="w-full bg-black/50 border border-white/10 p-3 text-sm rounded focus:border-white/30 outline-none"
            placeholder="IMPORTED"
            autoFocus
          />
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">CANCEL</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isImporting}
            className="bg-white text-black hover:bg-white/90 disabled:bg-white/40 disabled:text-black/60"
          >
            {isImporting ? 'IMPORTING...' : 'CONFIRM_IMPORT'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
