import React, { useState, useEffect } from 'react';
import {
  getPortfolioData,
  getWhitepaperData,
  getProjectsData,
  migrateData
} from '../../services/dataService';
import { PortfolioSection } from './PortfolioSection';
import { WhitepaperSection } from './WhitepaperSection';
import { ProjectsSection } from './ProjectsSection';
import portfolioDataJSON from '../../components/data/portfolioData.json';
import whitepaperDataJSON from '../../components/data/whitepaperData.json';
import { toast } from 'sonner';
import { AlertTriangle, Database, Zap, ShieldAlert, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isMigrationDialogOpen, setIsMigrationDialogOpen] = useState(false);

  const handleMigration = async () => {
    if (isMigrating) return;
    try {
      setIsMigrating(true);
      await migrateData(portfolioDataJSON, whitepaperDataJSON);
      toast.success("MIGRATION_SUCCESSFUL");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("MIGRATION_FAILED: Check console diagnostics");
      setIsMigrating(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white p-4 sm:p-8 pt-20 sm:pt-24 font-sans z-10" dir="ltr">
      {/* Semi-transparent background overlay to allow UniverseBackground to peek through */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10" />

      {/* Return Navigation - Responsive Wrapper */}
      <>
        {/* Desktop Vertical Sidebar */}
        <Link
          to="/"
          className="hidden md:flex fixed left-0 top-0 h-full w-14 z-50 group border-r border-white/10 bg-black/40 backdrop-blur-md -translate-x-10 hover:translate-x-0 transition-all duration-500 flex-col items-center justify-center gap-16 shadow-2xl"
        >
          <div className="flex flex-col items-center gap-8 [writing-mode:vertical-lr]">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">
              DEPART_SYSTEM_NODE
            </span>
            <div className="h-32 w-[1px] bg-gradient-to-t from-transparent via-white/30 to-transparent" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">
              BACK_TO_THE_PORTAL
            </span>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronLeft size={18} className="text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all duration-300" />
          </div>
        </Link>

        {/* Mobile Horizontal Top-Bar Button */}
        <Link
          to="/"
          className="md:hidden fixed top-4 left-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-lg active:scale-95 transition-all"
        >
          <ChevronLeft size={14} className="text-white" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">NEXUS_PORTAL</span>
        </Link>
      </>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">ZeroTrace</h1>
            <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mt-2">Management System</p>
          </div>
          {/* <button
            onClick={() => setIsMigrationDialogOpen(true)}
            className="w-full sm:w-auto px-6 py-3 border border-red-500/50 text-red-500 text-[11px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all backdrop-blur-xl"
          >
            Run Initial Migration
          </button> */}
        </div>

        <AlertDialog open={isMigrationDialogOpen} onOpenChange={setIsMigrationDialogOpen}>
          <AlertDialogContent className="max-w-xl border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldAlert size={120} />
            </div>

            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle size={18} />
                </div>
                <AlertDialogTitle className="text-red-500">CRITICAL_OVERRIDE_REQUIRED</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-white/60 text-xs">
                You are about to initiate a global data synchronization protocol between local archives and the Firebase production node.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-8 space-y-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                  <span className="text-white/30 flex items-center gap-2"><Database size={10} /> Source_Archive</span>
                  <span className="text-white/30 flex items-center gap-2">Firebase_Node <Zap size={10} /></span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-red-500/50" />
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  WARN: This action will serialize all local JSON objects and transmit them to the remote collection.
                  <span className="text-red-400/80"> Existing records with matching identifiers will be overwritten.</span>
                </p>
              </div>
            </div>

            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel className="border-white/5 text-white bg-transparent hover:bg-white/5">ABORT_SYNC</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMigration}
                disabled={isMigrating}
                className="bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.2)] disabled:opacity-50"
              >
                {isMigrating ? 'MIGRATING...' : 'INITIALIZE_PUSH'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
          {['portfolio', 'whitepaper', 'projects'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-grow sm:flex-grow-0 px-6 sm:px-8 py-3 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] transition-all border backdrop-blur-xl ${activeTab === tab
                ? 'bg-white text-black border-white'
                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-4 sm:p-8 rounded-2xl backdrop-blur-3xl shadow-2xl">
          {activeTab === 'portfolio' && <PortfolioSection />}
          {activeTab === 'whitepaper' && <WhitepaperSection />}
          {activeTab === 'projects' && <ProjectsSection />}
        </div>
      </div>
    </div>
  );
};
