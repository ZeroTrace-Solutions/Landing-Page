import React, { useState, useEffect, useMemo } from 'react';
import Avatar from 'boring-avatars';
import {
  subscribeToWorkers,
  updateWorkerStatus,
  syncWorkerField,
  addWorker,
  clearWorkerLogs
} from '../../../services/dataService';
import { WorkerSidebar } from '@/components/admin/WorderWorkSpace/WorkerSidebar';
import { WorkerHeader } from '@/components/admin/WorderWorkSpace/WorkerHeader';
import { WorkerWindows } from '@/components/admin/WorderWorkSpace/WorkerWindows';
import { AddWorkerModal } from '@/components/admin/WorderWorkSpace/AddWorkerModal';
import {
  Users,
  Plus,
  Clock,
  BookOpen,
  CheckSquare,
  History,
  ChevronRight,
  Monitor,
  LayoutDashboard
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const WorkerWorkspace = ({ isFullScreen = false }) => {
  const { workerId } = useParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(workerId || null);
  const [activeWindows, setActiveWindows] = useState({}); // { workerId: { timer: bool, notebook: bool, ... } }
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerAvatar, setNewWorkerAvatar] = useState('');

  // Sync URL changes to local state
  useEffect(() => {
    if (workerId && workerId !== selectedWorkerId) {
      setSelectedWorkerId(workerId);
    }
  }, [workerId]);

  // Fetch all workers real-time
  useEffect(() => {
    const unsub = subscribeToWorkers((data) => {
      setWorkers(data);
      if (!selectedWorkerId && data.length > 0) {
        const firstId = data[0].id;
        setSelectedWorkerId(firstId);
        // Replace current URL with the first worker if root route
        if (!workerId) {
          navigate(`/admin/work-space/${firstId}`, { replace: true });
        }
      }
    });
    return () => unsub();
  }, [selectedWorkerId, workerId, navigate]);

  const handleSetSelectedWorkerId = (id) => {
    setSelectedWorkerId(id);
    navigate(`/admin/work-space/${id}`);
  };

  const selectedWorker = useMemo(() =>
    workers.find(w => w.id === selectedWorkerId),
    [workers, selectedWorkerId]);

  const toggleWindow = (workerId, windowType) => {
    setActiveWindows(prev => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [windowType]: !prev[workerId]?.[windowType]
      }
    }));
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;

    const avatarSeed = newWorkerAvatar.trim() || newWorkerName.trim();

    try {
      const id = await addWorker(newWorkerName, avatarSeed);
      setNewWorkerName('');
      setNewWorkerAvatar('');
      setIsAddWorkerOpen(false);
      setSelectedWorkerId(id);
      toast.success("Worker added successfully");
    } catch {
      toast.error("Failed to add worker");
    }
  };

  return (
    <div className={`overflow-hidden overflow-x-hidden bg-transparent ${isFullScreen ? 'fixed inset-0 z-[100] w-screen h-screen p-0 m-0 rounded-none border-none' : 'relative w-full rounded-3xl border border-white/5 h-[calc(100vh-200px)] min-h-[600px]'}`} dir="ltr">
      <WorkerSidebar
        workers={workers}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={handleSetSelectedWorkerId}
        setIsAddWorkerOpen={setIsAddWorkerOpen}
      />

      <div className="ml-0 lg:ml-24 h-full relative overflow-hidden p-4 pt-[80px] lg:pt-8 lg:p-8 flex flex-col">
        {selectedWorker ? (
          <>
            <WorkerHeader
              selectedWorker={selectedWorker}
              activeWindows={activeWindows}
              toggleWindow={toggleWindow}
              onAvatarChange={(newAvatar) => syncWorkerField(selectedWorker.id, 'avatar', newAvatar)}
              onClockIn={() => updateWorkerStatus(selectedWorker.id, 'clockin', new Date().toISOString())}
              onClockOut={() => updateWorkerStatus(selectedWorker.id, 'clockout', new Date().toISOString())}
              onTakeBreak={() => updateWorkerStatus(selectedWorker.id, 'break', new Date().toISOString())}
              onEndBreak={() => updateWorkerStatus(selectedWorker.id, 'clockin', new Date().toISOString())}
            />

            <div className="flex-grow relative">
              <WorkerWindows
                selectedWorker={selectedWorker}
                activeWindows={activeWindows}
                toggleWindow={toggleWindow}
                onClockIn={() => updateWorkerStatus(selectedWorker.id, 'clockin', new Date().toISOString())}
                onClockOut={() => updateWorkerStatus(selectedWorker.id, 'clockout', new Date().toISOString())}
                onTakeBreak={() => updateWorkerStatus(selectedWorker.id, 'break', new Date().toISOString())}
                onEndBreak={() => updateWorkerStatus(selectedWorker.id, 'clockin', new Date().toISOString())}
                syncWorkerField={syncWorkerField}
                onClearLogs={() => clearWorkerLogs(selectedWorker.id)}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
            <Users size={64} strokeWidth={1} />
            <h3 className="text-[12px] font-bold">Select a worker to begin</h3>
          </div>
        )}
      </div>

      <AddWorkerModal
        open={isAddWorkerOpen}
        currentName={newWorkerName}
        currentAvatar={newWorkerAvatar}
        onClose={() => setIsAddWorkerOpen(false)}
        onNameChange={(e) => setNewWorkerName(e.target.value)}
        onAvatarChange={(e) => setNewWorkerAvatar(e.target.value)}
        onSubmit={handleAddWorker}
      />
    </div>
  );
};