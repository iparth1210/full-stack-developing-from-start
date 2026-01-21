
import React, { useState, useEffect } from 'react';
import { RoadmapModule, ProjectTask } from '../types';

interface AntigravityPortalProps {
  onExit: () => void;
  xp: number;
  activeModule: RoadmapModule;
  tasks: ProjectTask[];
  projectIdea: string;
}

const AntigravityPortal: React.FC<AntigravityPortalProps> = ({ onExit, xp, activeModule, tasks, projectIdea }) => {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const progress = Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100);

  return (
    <div className={`fixed inset-0 z-[200] bg-[#020617] transition-all duration-1000 flex items-center justify-center overflow-hidden font-sans ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[220px] animate-pulse [animation-delay:3s]"></div>

        {/* Code Stream Overlay */}
        <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
          <div className="absolute top-0 w-full h-full flex flex-col space-y-4 animate-scan">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="font-mono text-[10px] whitespace-nowrap text-indigo-400">
                {`0x${Math.random().toString(16).slice(2, 10)} >> EXECUTE_VIRTUAL_SYNAPSE_LINK --THREAD_${i} [STABLE]`}
              </div>
            ))}
          </div>
        </div>

        {/* Star Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              transition: 'transform 0.5s ease-out',
              transform: `translate(${mousePos.x * (i % 5)}px, ${mousePos.y * (i % 5)}px)`
            }}
          ></div>
        ))}
      </div>

      <div
        className="relative w-full max-w-7xl h-full flex items-center justify-center transition-transform duration-700 ease-out"
        style={{ transform: `perspective(1000px) rotateX(${-mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)` }}
      >
        {/* Central Hub */}
        <div className="relative z-10 text-center space-y-8 animate-float">
          <div className="w-48 h-48 rounded-[60px] glass mx-auto flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-[60px] blur-2xl group-hover:blur-3xl transition-all"></div>
            <svg className="w-20 h-20 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4z" /></svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-8xl font-black text-white tracking-tighter chromatic-text">ODYSSEY<span className="text-indigo-500">.</span>CORE</h1>
            <p className="text-slate-500 text-sm font-black uppercase tracking-[1em] opacity-40">Direct Neural Interface</p>
          </div>
        </div>

        {/* Orbiting Panels */}
        <div
          className="absolute glass p-8 rounded-[40px] w-80 animate-float"
          style={{
            top: '15%',
            left: '10%',
            animationDelay: '1s',
            transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`
          }}
        >
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4">Neural Path</span>
          <h3 className="text-2xl font-black text-white mb-2">{activeModule.title}</h3>
          <div className="h-1 w-full bg-white/5 rounded-full mt-4 overflow-hidden p-[1px]">
            <div className="h-full bg-indigo-500 shadow-[0_0_10px_indigo]" style={{ width: '45%' }}></div>
          </div>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-6">Protocol Status: [SYNCHRONIZED]</p>

          {/* HUD Decor */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20 rounded-tr-2xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20 rounded-bl-2xl"></div>
        </div>

        <div
          className="absolute glass p-8 rounded-[40px] w-80 animate-float"
          style={{
            bottom: '15%',
            right: '10%',
            animationDelay: '2.5s',
            transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)`
          }}
        >
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-4">Masterpiece Link</span>
          <h3 className="text-xl font-black text-white mb-2 line-clamp-1">{projectIdea || "System Idle"}</h3>
          <div className="flex items-center justify-between mt-6">
            <span className="text-3xl font-black text-white">{progress}%</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architecture Sync</span>
          </div>

          {/* HUD Decor */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20 rounded-tl-2xl"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20 rounded-br-2xl"></div>
        </div>

        <div
          className="absolute glass p-10 rounded-[50px] animate-float"
          style={{
            top: '55%',
            left: '15%',
            animationDelay: '4s',
            transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`
          }}
        >
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-2">XP Energy</span>
          <span className="text-5xl font-black text-white tracking-tighter">{xp.toLocaleString()}</span>
        </div>

        <div
          className="absolute glass p-6 rounded-3xl animate-float hidden lg:block"
          style={{
            top: '20%',
            right: '25%',
            animationDelay: '0.5s',
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Uptime: 142.4h</span>
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-5 rounded-full bg-white text-slate-950 font-black uppercase tracking-[0.3em] text-xs hover:scale-110 active:scale-95 transition-all shadow-4xl group"
      >
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
        <span className="relative z-10">Return to Ground</span>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-700 uppercase tracking-[0.8em] pointer-events-none">
        Spatial Interface Enabled • v2.0
      </div>
    </div>
  );
};

export default AntigravityPortal;
