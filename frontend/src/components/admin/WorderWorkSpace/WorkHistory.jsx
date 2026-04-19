import React from "react";
import { History, Calendar, Clock, BarChart3, AlertTriangle, Trash2, Filter, Tag, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const WorkHistory = ({ logs = [], totalHours = 0, history = {}, onClearHistory, status, categories = [] }) => {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [filterLabel, setFilterLabel] = React.useState('all');

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const formatTime = (ms) => {
    const totalSeconds = Math.floor((ms || 0) / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // Calculate total from current logs (completed segments), aware of label filter
  const sessionTotal = React.useMemo(() => {
    let total = 0;
    let lastIn = null;
    let lastInLabel = null;

    logs.forEach(log => {
      const time = new Date(log.timestamp).getTime();
      if (isNaN(time)) return;
      if (log.type === 'clockin') {
        lastIn = time;
        lastInLabel = log.label;
      } else if (log.type === 'break' || log.type === 'clockout') {
        if (lastIn) {
          // If filtering, only add if the label matches
          if (filterLabel === 'all' || lastInLabel === filterLabel) {
            total += (time - lastIn);
          }
          lastIn = null;
          lastInLabel = null;
        }
      }
    });
    return total;
  }, [logs, filterLabel]);

  // Handle ticking for active session
  const [activeExtra, setActiveExtra] = React.useState(0);
  React.useEffect(() => {
    if (status !== 'clockin') {
      setActiveExtra(0);
      return;
    }

    // Find the start time of the current active block
    let lastInTime = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i].type === 'clockin') {
        lastInTime = new Date(logs[i].timestamp).getTime();
        break;
      }
      // If we hit a break or clockout after the last clockin, it's not an active block
      if (logs[i].type === 'break' || logs[i].type === 'clockout') break;
    }

    if (!lastInTime) return;

    const timer = setInterval(() => {
      setActiveExtra(Math.max(0, Date.now() - lastInTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [logs, status]);

  const filteredLogs = React.useMemo(() => {
    const baseLogs = filterLabel === 'all' ? logs : logs.filter(log => log.label === filterLabel);
    return [...baseLogs].reverse();
  }, [logs, filterLabel]);

  const isClockedInMatch = React.useMemo(() => {
    if (status !== 'clockin') return false;
    if (filterLabel === 'all') return true;
    
    let currentLabel = null;
    for (let i = logs.length - 1; i >= 0; i--) {
      if (logs[i].type === 'clockin') {
        currentLabel = logs[i].label;
        break;
      }
    }
    return currentLabel === filterLabel;
  }, [status, logs, filterLabel]);

  const displayTotal = (filterLabel === 'all' ? (totalHours || 0) : 0) + sessionTotal + (isClockedInMatch ? activeExtra : 0);
  const isClockedIn = status === 'clockin';

  const confirmClear = async () => {
    await onClearHistory?.();
    setShowConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-0 h-full gap-4">
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="border-red-500/20 bg-black/90">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="animate-pulse" />
              Deleting Logs Warning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              {isClockedIn
                ? "Warning: Worker is currently clocked in. Deleting logs will force an emergency checkout and wipe all active session data. This action is irreversible."
                : "You are about to wipe all active session logs for this worker. Archived history will remain intact. Proceed with data deletion?"
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClear}
              className="bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-[12px] font-bold text-white/70">
          History Logs
        </h3>
        <button
          onClick={() => setShowConfirm(true)}
          className="ml-auto text-[11px] font-bold text-white/60 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <Trash2 size={12} />
          Delete Logs
        </button>
      </div>

      <div className="h-[1px] w-full bg-white/5 mb-2" />

      {/* Filter and Stats */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Label Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterLabel('all')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border ${filterLabel === 'all' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white/60'}`}
          >
            All Logs
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterLabel(cat.name)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border ${filterLabel === cat.name ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-transparent border-white/5 text-white/40 hover:text-white/60'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <Clock size={14} className="text-white/60" />
            <span className="text-[11px] font-bold text-white/70">
              Total work time
            </span>
          </div>
          <div className="text-xl font-black">
            {displayTotal > 0 ? formatTime(displayTotal) : "0h 0m"}
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-0 overflow-hidden">
        <div className="h-full min-h-0 overflow-y-auto custom-scrollbar space-y-3 pr-2 py-2" data-lenis-prevent>
          {/* Current Month Logs */}
          <div className="text-[11px] font-bold text-white/60 mb-2">
            {currentMonth}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-[11px] text-white/20 font-medium">
              {filterLabel === 'all' ? "No logs recorded for this session" : `No logs found for "${filterLabel}"`}
            </div>
          ) : (
            filteredLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                style={{ maxHeight: "64px", overflow: "hidden" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${log.type === "clockin" ? "bg-green-500" : log.type === "break" ? "bg-yellow-500" : "bg-red-500"}`}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold capitalize text-white/80">
                        {log.type}
                      </span>
                      {log.label && (
                        <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-[8px] font-black uppercase tracking-tighter">
                          {log.label}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-white/30 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-white/60">
                  {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          )}

          {/* Global Summary History */}
          <div className="mt-8 border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 text-white/20 mb-4">
              <History size={14} className="text-white/50" />
              <span className="text-[12px] font-bold text-white/60">
                Archived history
              </span>
            </div>
            {Object.entries(history).map(([month, data]) => (
              <div
                key={month}
                className="flex justify-between p-3 border-b border-white/5 group hover:bg-white/[0.01]"
              >
                <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">
                  {month}
                </span>
                <span className="text-[11px] font-black text-white/30">
                  {typeof data.totalHours === 'number' ? formatTime(data.totalHours) : (data.totalHours || "0h")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
