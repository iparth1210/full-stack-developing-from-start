
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Roadmap from './components/Roadmap';
import ProjectConsole from './components/ProjectConsole';
import MentorChat from './components/MentorChat';
import Stats from './components/Stats';
import AntigravityPortal from './components/AntigravityPortal';
import { INITIAL_ROADMAP } from './constants';
import { ProjectTask } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'project' | 'mentor' | 'stats'>('roadmap');
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [roadmap, setRoadmap] = useState(INITIAL_ROADMAP);
  const [xp, setXp] = useState(45200);
  const [showXpAlert, setShowXpAlert] = useState(false);
  const [isAntigravity, setIsAntigravity] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
    setShowXpAlert(true);
    setTimeout(() => setShowXpAlert(false), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'roadmap':
        return <Roadmap modules={roadmap} onComplete={addXp} />;
      case 'project':
        return <ProjectConsole projectIdea={projectIdea} setProjectIdea={setProjectIdea} tasks={projectTasks} setTasks={setProjectTasks} />;
      case 'mentor':
        return <MentorChat context={`Active Module: ${roadmap.find(m => m.status === 'CURRENT')?.title || 'None'}. Project: ${projectIdea}`} />;
      case 'stats':
        return <Stats xp={xp} tasks={projectTasks} roadmap={roadmap} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative font-['Outfit']">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[200px] animate-nebula"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[250px] animate-nebula [animation-delay:4s]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[150px] animate-nebula [animation-delay:8s]"></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {isAntigravity && (
        <AntigravityPortal
          onExit={() => setIsAntigravity(false)}
          xp={xp}
          activeModule={INITIAL_ROADMAP[0]}
          tasks={projectTasks}
          projectIdea={projectIdea}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-[100] transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500 ease-in-out`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
          onLaunchAntigravity={() => { setIsAntigravity(true); setMobileMenuOpen(false); }}
        />
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      <main className="flex-1 min-w-0 relative h-screen overflow-hidden flex flex-col">
        {/* Cinematic Mastery Notification */}
        {showXpAlert && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-indigo-600/30 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_rgba(79,70,229,0.4)] border border-white/20 animate-in fade-in slide-in-from-top-full duration-700 ease-out">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">Sync Success</p>
                <p className="text-sm font-black tracking-widest">+500 MASTERY XP ACCUMULATED</p>
              </div>
            </div>
          </div>
        )}

        <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 bg-slate-950/40 backdrop-blur-3xl z-50">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white premium-glass rounded-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
            <div className="flex items-baseline space-x-2 lg:space-x-3">
              <span className="premium-gradient-text text-[10px] lg:text-sm tracking-[0.2em]">ODYSSEY_PLATFORM</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest opacity-40">v2.4.0</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10"></div>
            <h4 className="hidden lg:block text-white text-[10px] font-black uppercase tracking-[0.4em] opacity-80">{activeTab}</h4>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-12">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-60">Global Ranking</span>
              <span className="text-sm font-black text-indigo-400 tracking-tighter">SCHOLAR TIER [IV]</span>
            </div>
            <div className="px-4 lg:px-6 py-2.5 lg:py-3 premium-glass rounded-[24px] lg:rounded-[28px] flex items-center space-x-4 lg:space-x-6 shadow-2xl backdrop-blur-xl group cursor-pointer hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Progress</span>
                <span className="text-lg lg:text-xl font-black text-white tracking-tighter transition-transform group-hover:scale-105">{xp.toLocaleString()} <span className="text-[10px] lg:text-xs text-indigo-400 ml-1">XP</span></span>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
