import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SHARED NOTEBOOK ---
export const CollaborativeNotebook = ({ workerId, content = '', fontFamily = 'ZTMS, serif', fontSize = '14px', onSync }) => {
  const [localContent, setLocalContent] = useState(content || '');
  const [isSyncing, setIsSyncing] = useState(false);

  const fonts = [
    { name: 'Modern Serif', value: 'ZTMS, serif' },
    { name: 'Technical Sans', value: 'Genos, sans-serif' },
    { name: 'Arabic Serif', value: 'Amiri, serif' },
    { name: 'Arabic Modern', value: 'Zain, sans-serif' },
    { name: 'System Mono', value: 'ui-monospace, SFMono-Regular, Consolas, monospace' }
  ];

  const sizes = ['12px', '14px', '16px', '18px', '22px'];

  useEffect(() => {
    setLocalContent(content || '');
  }, [content]);

  // Debounced Sync for Content
  useEffect(() => {
    if (localContent === content) return;

    const timeout = setTimeout(async () => {
      setIsSyncing(true);
      await onSync('notebook', localContent);
      setIsSyncing(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [localContent, content, onSync]);

  const handleFontChange = (val) => {
    onSync('notebookFontFamily', val);
  };

  const handleSizeChange = (val) => {
    onSync('notebookFontSize', val);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <select 
            value={fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold text-white/80 px-3 py-1.5 focus:outline-none focus:border-white/40 hover:bg-white/20 transition-all cursor-pointer shadow-sm"
          >
            {fonts.map(f => <option key={f.value} value={f.value} className="bg-[#111] text-white py-2">{f.name}</option>)}
          </select>

          <select 
            value={fontSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg text-[10px] font-bold text-white/80 px-3 py-1.5 focus:outline-none focus:border-white/40 hover:bg-white/20 transition-all cursor-pointer shadow-sm"
          >
            {sizes.map(s => <option key={s} value={s} className="bg-[#111] text-white py-2">{s}</option>)}
          </select>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        <AnimatePresence>
          {isSyncing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 size={12} className="animate-spin text-white/60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <textarea
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        placeholder="Type notes here..."
        data-lenis-prevent
        style={{ fontFamily: fontFamily, fontSize: fontSize, lineHeight: '1.6' }}
        className="flex-grow bg-white/[0.03] border border-white/10 rounded-xl p-5 text-white focus:outline-none focus:border-white/30 transition-all resize-none custom-scrollbar placeholder:text-white/20 shadow-inner"
      />
    </div>
  );
};

const CheckIndicator = ({ completed }) => (
  <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
    <motion.div
      initial={false}
      animate={{
        scale: completed ? 1.05 : 1,
        borderColor: completed ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)',
        backgroundColor: completed ? 'rgba(255,255,255,0.08)' : 'transparent'
      }}
      transition={{ duration: 0.2 }}
      className={`absolute inset-0 rounded-full border-[1.5px] ${completed ? 'border-solid' : 'border-dashed'}`}
    />
    <AnimatePresence>
      {completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: -45 }}
          className="relative z-10"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="filter drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              d="M 2.5,6.5 L 5,9 L 9.5,3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- SHARED CHECKLIST ---
export const CollaborativeChecklist = ({ workerId, items = [], onSync }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [newItemText, setNewItemText] = useState('');

  const activeItems = safeItems.filter(item => !item.completed);
  const completedItems = safeItems.filter(item => item.completed);

  const toggleItem = (id) => {
    const newItems = safeItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onSync('checklist', newItems);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItems = [...safeItems, { text: newItemText, completed: false, id: Date.now() }];
    onSync('checklist', newItems);
    setNewItemText('');
  };

  const removeItem = (id) => {
    const newItems = safeItems.filter(item => item.id !== id);
    onSync('checklist', newItems);
  };

  const renderItem = (item) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${item.completed ? 'bg-white/[0.01] border-white/[0.03] opacity-50' : 'bg-white/[0.05] border-white/10 hover:border-white/20 hover:bg-white/[0.06] shadow-sm'}`}
    >
      <div onClick={() => toggleItem(item.id)} className="cursor-pointer">
        <CheckIndicator completed={item.completed} />
      </div>
      
      <div 
        className="flex-grow cursor-pointer"
        onClick={() => toggleItem(item.id)}
      >
        <span className={`text-[12px] font-bold transition-all ${item.completed ? 'text-white/40 line-through decoration-white/20' : 'text-white/90'}`}>
          {item.text}
        </span>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Search-like Add Input */}
      <form onSubmit={addItem} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          <Plus size={14} />
        </div>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Include new requirement..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
        />
      </form>

      {/* Structured List */}
      <div className="flex-grow overflow-auto custom-scrollbar pr-2 -mr-2" data-lenis-prevent>
        <div className="flex flex-col gap-1.5 pb-4">
          <AnimatePresence initial={false} mode="popLayout">
            {activeItems.map(renderItem)}

            {activeItems.length > 0 && completedItems.length > 0 && (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 py-4"
              >
                <div className="h-[1px] flex-grow bg-white/[0.05]" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">Completed Assignments</span>
                <div className="h-[1px] flex-grow bg-white/[0.05]" />
              </motion.div>
            )}

            {completedItems.map(renderItem)}
          </AnimatePresence>

          {safeItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="py-16 flex flex-col items-center justify-center gap-3 text-white/20"
            >
              <CheckCircle2 size={32} strokeWidth={1} />
              <div className="text-[12px] font-medium">Process requirements cleared</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
