import React, { useEffect, useState } from 'react';
import { DraggableWindow } from './DraggableWindow';
import { WorkTimer } from './WorkTimer';
import { CollaborativeNotebook, CollaborativeChecklist } from './CollaborativeTools';
import { WorkHistory } from './WorkHistory';

export const WorkerWindows = ({
  selectedWorker,
  activeWindows,
  toggleWindow,
  onClockIn,
  onClockOut,
  onTakeBreak,
  onEndBreak,
  syncWorkerField,
  onClearLogs,
}) => {
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const contentWidth = Math.max(900, viewport.width - 280);
  const contentHeight = Math.max(600, viewport.height - 220);
  const margin = 24;
  const gap = 20;

  // 3-Column Semantic Layout
  const colGap = 20;
  const col1Width = contentWidth * 0.34;
  const col2Width = contentWidth * 0.31;
  const col3Width = contentWidth - col1Width - col2Width - (colGap * 2);

  const layouts = {
    timer: { 
      x: margin, 
      y: margin, 
      width: col1Width, 
      height: contentHeight 
    },
    notebook: { 
      x: margin + col1Width + colGap, 
      y: margin, 
      width: col2Width, 
      height: (contentHeight / 2) - (colGap / 2) 
    },
    checklist: { 
      x: margin + col1Width + colGap, 
      y: margin + (contentHeight / 2) + (colGap / 2), 
      width: col2Width, 
      height: (contentHeight / 2) - (colGap / 2) 
    },
    history: { 
      x: margin + col1Width + col2Width + (colGap * 2), 
      y: margin, 
      width: col3Width, 
      height: contentHeight 
    }
  };

  if (!selectedWorker) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
        <span className="text-4xl font-black">👤</span>
        <h3 className="text-[12px] font-bold">Select a worker to begin</h3>
      </div>
    );
  }

  return (
    <>
      <DraggableWindow
        title="Work Timer"
        isOpen={activeWindows[selectedWorker.id]?.timer}
        onClose={() => toggleWindow(selectedWorker.id, 'timer')}
        defaultPosition={{ x: layouts.timer.x, y: layouts.timer.y }}
        defaultSize={{ width: layouts.timer.width, height: layouts.timer.height }}
        noPadding={true}
      >
        <WorkTimer
          key={selectedWorker.id}
          workerId={selectedWorker.id}
          workStatus={selectedWorker.workStatus}
          workTimes={selectedWorker.workTimes}
          timerBgStyle={selectedWorker.timerBgStyle}
          onSync={(field, data) => syncWorkerField(selectedWorker.id, field, data)}
          onClockIn={onClockIn}
          onClockOut={onClockOut}
          onTakeBreak={onTakeBreak}
          onEndBreak={onEndBreak}
        />
      </DraggableWindow>

      <DraggableWindow
        title="Notebook"
        isOpen={activeWindows[selectedWorker.id]?.notebook}
        onClose={() => toggleWindow(selectedWorker.id, 'notebook')}
        defaultPosition={{ x: layouts.notebook.x, y: layouts.notebook.y }}
        defaultSize={{ width: layouts.notebook.width, height: layouts.notebook.height }}
      >
        <CollaborativeNotebook 
          workerId={selectedWorker.id} 
          content={selectedWorker.notebook} 
          fontFamily={selectedWorker.notebookFontFamily}
          fontSize={selectedWorker.notebookFontSize}
          onSync={(field, data) => syncWorkerField(selectedWorker.id, field, data)} 
        />
      </DraggableWindow>

      <DraggableWindow
        title="Checklist"
        isOpen={activeWindows[selectedWorker.id]?.checklist}
        onClose={() => toggleWindow(selectedWorker.id, 'checklist')}
        defaultPosition={{ x: layouts.checklist.x, y: layouts.checklist.y }}
        defaultSize={{ width: layouts.checklist.width, height: layouts.checklist.height }}
      >
        <CollaborativeChecklist workerId={selectedWorker.id} items={selectedWorker.checklist} onSync={(field, data) => syncWorkerField(selectedWorker.id, field, data)} />
      </DraggableWindow>

      <DraggableWindow
        title="History"
        isOpen={activeWindows[selectedWorker.id]?.history}
        onClose={() => toggleWindow(selectedWorker.id, 'history')}
        defaultPosition={{ x: layouts.history.x, y: layouts.history.y }}
        defaultSize={{ width: layouts.history.width, height: layouts.history.height }}
      >
        <WorkHistory
          logs={(selectedWorker.workTimes || []).map((t, i) => ({
            timestamp: t,
            type: (selectedWorker.workStatus || [])[i] || 'unknown',
          }))}
          totalHours={selectedWorker.totalHours ?? 0}
          history={selectedWorker.history || []}
          onClearHistory={onClearLogs}
          status={selectedWorker.status}
        />
      </DraggableWindow>
    </>
  );
};