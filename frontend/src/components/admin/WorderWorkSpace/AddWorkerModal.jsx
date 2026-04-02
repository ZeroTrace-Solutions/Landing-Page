import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export const AddWorkerModal = ({ open, currentName, currentAvatar, onClose, onNameChange, onAvatarChange, onSubmit }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-[#111] border border-white/15 p-10 rounded-3xl shadow-3xl"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Add New Worker</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="text-[12px] font-semibold text-white/60 block mb-2 px-1">Worker Name</label>
              <input
                type="text"
                value={currentName}
                onChange={onNameChange}
                placeholder="Enter full name..."
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-white/60 block mb-2 px-1">Avatar Seed (optional)</label>
              <input
                type="text"
                value={currentAvatar}
                onChange={onAvatarChange}
                placeholder="e.g. blue-dragon or alice-01"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all font-mono"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-grow py-4 bg-white/5 text-white/70 font-bold text-[12px] rounded-2xl hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-grow py-4 bg-white text-black font-bold text-[12px] rounded-2xl hover:bg-white/90 transition-all shadow-xl"
              >
                Add Worker
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);