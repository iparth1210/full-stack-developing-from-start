
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Roadmap from './components/Roadmap';
import ProjectConsole from './components/ProjectConsole';
import MentorChat from './components/MentorChat';
import Stats from './components/Stats';
import { INITIAL_ROADMAP } from './constants';
import { ProjectTask } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'project' | 'mentor' | 'stats'>('roadmap');
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [xp, setXp] = useState(45200);
  const [showXpAlert, setShowXpAlert] = useState(false);

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
    setShowXpAlert(true);
    setTimeout(() => setShowXpAlert(false), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'roadmap':
        return <Roadmap modules={INITIAL_ROADMAP} onComplete={addXp} />;
      case 'project':
        return <ProjectConsole projectIdea={projectIdea} setProjectIdea={setProjectIdea} tasks={projectTasks} setTasks={setProjectTasks} />;
      case 'mentor':
        return <MentorChat context={`Focused on Month 0. Hardware and logic fundamentals. Current XP: ${xp}. Project: ${projectIdea}`} />;
      case 'stats':
        return <Stats />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[200px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600 rounded-full blur-[250px] animate-pulse [animation-delay:2s]"></div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 min-w-0 relative h-screen overflow-hidden flex flex-col">
        {/* Cinematic Notification */}
        {showXpAlert && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-indigo-600 rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.4)] border border-white/20 animate-in slide-in-from-top-12 duration-500 ease-out">
             <div className="flex items-center space-x-4 text-white">
               <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Synchronized</p>
                  <p className="text-sm font-black tracking-widest">+500 MASTERY XP ACCUMULATED</p>
               </div>
             </div>
          </div>
        )}

        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-slate-950/20 backdrop-blur-3xl z-50">
          <div className="flex items-center space-x-6">
            <div className="flex items-baseline space-x-2">
               <span className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em]">ODYSSEY_V2.0</span>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.5em]">{activeTab}</h4>
          </div>
          
          <div className="flex items-center space-x-12">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Ranking</span>
                <span className="text-sm font-black text-indigo-400">SCHOLAR TIER [04]</span>
            </div>
            <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-[28px] flex items-center space-x-6 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total XP</span>
                  <span className="text-lg font-black text-white tracking-tighter">{xp.toLocaleString()}</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none -z-10"></div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
