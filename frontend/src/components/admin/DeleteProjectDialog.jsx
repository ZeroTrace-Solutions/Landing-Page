import { AlertTriangle } from 'lucide-react';
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

export const DeleteProjectDialog = ({
  project,
  open,
  onOpenChange,
  onConfirm,
  isBusy,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle size={18} />
            </div>
            <AlertDialogTitle className="text-red-500">PURGE_PROJECT_CONFIRM</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-white/60 text-xs">
            This action will permanently purge the project node <span className="text-white font-bold">{project?.name || project?.id}</span>. This protocol is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">ABORT</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isBusy}
            className="bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
          >
            CONFIRM_PURGE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
