
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RoadmapModule, ModuleStatus, Resource, DailyTask } from '../types';
import { getVoiceBriefing } from '../services/geminiService';

interface RoadmapProps {
  modules: RoadmapModule[];
  onComplete?: (xp: number) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ modules, onComplete }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(modules[0]?.id || null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'theory' | 'story' | 'usage' | 'quiz'>('theory');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [shakeQuiz, setShakeQuiz] = useState(false);
  
  // Ref for the scrollable content container
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
  // Local state to simulate completed days for visual feedback
  const [completedDays, setCompletedDays] = useState<Record<string, Set<number>>>({
    'm0': new Set([1]) // Assuming day 1 is done for demo
  });

  const activeModule = useMemo(() => 
    modules.find(m => m.id === selectedModuleId) || modules[0], 
  [selectedModuleId, modules]);

  const activeDay = useMemo(() => {
    if (!activeModule || !activeModule.dailySchedule || activeModule.dailySchedule.length === 0) {
      return null;
    }
    return activeModule.dailySchedule.find(d => d.day === selectedDayNumber) || activeModule.dailySchedule[0];
  }, [activeModule, selectedDayNumber]);

  // Effect to scroll to top smoothly when module or day changes
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedModuleId, selectedDayNumber]);

  const handlePlayBriefing = async () => {
    if (!activeDay || isAudioLoading) return;
    setIsAudioLoading(true);
    try {
      const base64 = await getVoiceBriefing(`${activeDay.title}. Objective: ${activeDay.objective}. ${activeDay.conceptualWhy}`);
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.play();
    } catch (e) {
      console.error("Audio error", e);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleResourceClick = (res: Resource) => {
    if (res.type === 'video' && res.embedId) {
      setActiveVideo(res.embedId);
    } else {
      window.open(res.url, '_blank');
    }
  };

  const handleQuizSubmit = (idx: number) => {
    setQuizAnswer(idx);
    setShowExplanation(true);
    
    if (idx === activeDay?.quiz?.correctIndex) {
      if (onComplete) onComplete(500);
      
      // Mark day as completed
      if (selectedModuleId) {
        setCompletedDays(prev => ({
          ...prev,
          [selectedModuleId]: new Set([...(prev[selectedModuleId] || []), selectedDayNumber])
        }));
      }
    } else {
      // Trigger shake animation for incorrect answer
      setShakeQuiz(true);
      setTimeout(() => setShakeQuiz(false), 500);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !mod.dailySchedule) return 0;
    const completedCount = completedDays[moduleId]?.size || 0;
    return Math.round((completedCount / mod.dailySchedule.length) * 100);
  };

  if (!activeModule) return null;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#020617] text-slate-100">
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite alternate;
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
      
      {/* Video Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl transition-all duration-500">
          <button onClick={() => setActiveVideo(null)} className="absolute top-8 right-8 text-white p-4 bg-white/5 rounded-full hover:scale-110 transition-transform active:scale-95">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)] animate-in zoom-in-95 duration-300">
            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      )}

      {/* Nav Sidebar */}
      <div className="w-72 bg-slate-950/80 border-r border-white/5 flex flex-col p-6 space-y-8 scrollbar-hide shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Paths</h4>
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
          </div>
          <div className="space-y-2.5 overflow-y-auto max-h-[350px] scrollbar-hide pr-1">
            {modules.map(mod => {
              const isSelected = selectedModuleId === mod.id;
              const progress = getModuleProgress(mod.id);
              const isLocked = mod.status === ModuleStatus.LOCKED;

              return (
                <button 
                  key={mod.id} 
                  disabled={isLocked}
                  onClick={() => { setSelectedModuleId(mod.id); setSelectedDayNumber(1); }}
                  className={`w-full group p-4 rounded-2xl text-left border-2 transition-all duration-300 relative overflow-hidden ${
                    isSelected 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-white shadow-xl translate-x-1' 
                    : isLocked 
                      ? 'border-transparent text-slate-700 opacity-50 cursor-not-allowed'
                      : 'border-transparent text-slate-500 hover:bg-white/5 hover:border-white/10 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 relative z-10">
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">Month {mod.month.toString().padStart(2, '0')}</span>
                    {isSelected && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>}
                    {mod.status === ModuleStatus.COMPLETED && (
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <h5 className="text-[11px] font-black uppercase tracking-tight truncate relative z-10">{mod.title}</h5>
                  <div className="mt-2.5 h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                    <div 
                      className="h-full bg-indigo-500/40 transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="pt-6 border-t border-white/5 space-y-5">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Unit Sequence</h4>
            <span className="text-[9px] font-mono text-slate-600">{completedDays[selectedModuleId || '']?.size || 0}/{activeModule.dailySchedule?.length || 0}</span>
          </div>
          <div className="grid grid-cols-5 gap-2.5">
            {activeModule.dailySchedule?.map(day => {
              const isSelected = selectedDayNumber === day.day;
              const isCompleted = completedDays[selectedModuleId || '']?.has(day.day);
              
              return (
                <button 
                  key={day.day} 
                  onClick={() => { setSelectedDayNumber(day.day); setQuizAnswer(null); setShowExplanation(false); setActiveMode('theory'); }}
                  className={`relative aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-300 group ${
                    isSelected 
                    ? 'bg-indigo-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)] scale-110 z-10' 
                    : isCompleted
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                  }`}
                >
                  <span className="relative z-10">{day.day}</span>
                  {isCompleted && !isSelected && (
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-emerald-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div 
          ref={contentContainerRef}
          className="flex-1 overflow-y-auto p-12 lg:p-20 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent)] scrollbar-hide relative"
        >
          {activeDay && (
            <div key={`${selectedModuleId}-${selectedDayNumber}`} className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="space-y-8 relative">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 bg-white/5 border border-white/5 pl-2 pr-4 py-1 rounded-full">
                      <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,1)]"></span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Phase {activeModule.month}.{activeDay.day.toString().padStart(2, '0')}</span>
                    </div>
                    <button 
                      onClick={handlePlayBriefing}
                      disabled={isAudioLoading}
                      className="flex items-center space-x-3 bg-indigo-500/5 border border-indigo-500/20 px-6 py-3 rounded-full hover:bg-indigo-500/10 transition-all group active:scale-95"
                    >
                      {isAudioLoading ? (
                        <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Play Mission Briefing</span>
                    </button>
                 </div>
                 <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight antialiased">
                   {activeDay.title}
                 </h1>
                 <p className="text-slate-400 text-2xl font-medium leading-relaxed italic border-l-4 border-indigo-500/40 pl-10 max-w-3xl">
                   "{activeDay.objective}"
                 </p>
              </header>

              <div className="flex p-2 bg-slate-900/60 border border-white/10 rounded-3xl w-fit backdrop-blur-3xl shadow-2xl sticky top-4 z-20">
                 {['theory', 'story', 'usage', 'quiz'].map(mode => (
                   <button 
                     key={mode} 
                     onClick={() => setActiveMode(mode as any)}
                     className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                       activeMode === mode 
                       ? 'bg-indigo-500 text-white shadow-lg -translate-y-0.5' 
                       : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                     }`}
                   >
                     {mode}
                   </button>
                 ))}
              </div>

              <div className="min-h-[500px]">
                {activeMode === 'theory' && (
                  <div className="space-y-20 animate-in fade-in slide-in-from-right-8 duration-500">
                     <div className="p-14 bg-white/[0.02] border border-white/5 rounded-[60px] relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                           <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">Strategic Context</h4>
                        <p className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight relative z-10">
                          {activeDay.conceptualWhy}
                        </p>
                     </div>

                     <div className="space-y-12">
                        <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">Deep Knowledge Layers</h4>
                        {activeDay.detailedTheory.map((point, i) => (
                          <div key={i} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/[0.01] border border-white/5 p-10 rounded-[48px] hover:border-indigo-500/20 transition-all duration-500 shadow-xl">
                             <div className="space-y-6">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 font-black text-xl">
                                   {(i + 1).toString().padStart(2, '0')}
                                </div>
                                <h4 className="text-3xl font-black text-white tracking-tight">{point.title}</h4>
                                <p className="text-lg text-slate-400 leading-relaxed font-medium">{point.description}</p>
                             </div>
                             <div className="relative aspect-video lg:aspect-[4/3] rounded-[36px] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
                                <img src={point.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={point.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {activeMode === 'story' && (
                  <div className="relative bg-slate-950 border border-indigo-500/20 p-16 lg:p-24 rounded-[70px] overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-700 min-h-[600px] flex flex-col justify-end">
                     {/* Immersive Background */}
                     <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <img 
                          src={activeDay.storyImageUrl} 
                          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-[3000ms] animate-kenburns" 
                          alt="Story Visual"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent"></div>
                        
                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent animate-scan z-20"></div>
                        
                        {/* Decorative HUD Elements */}
                        <div className="absolute top-10 left-10 text-[8px] font-mono text-indigo-500/40 uppercase tracking-[0.5em] hidden lg:block">
                           COORD_REF: {Math.random().toFixed(4)}N / {Math.random().toFixed(4)}E
                        </div>
                        <div className="absolute top-10 right-10 text-[8px] font-mono text-indigo-500/40 uppercase tracking-[0.5em] hidden lg:block">
                           DATA_STREAM: [STABLE]
                        </div>
                        <div className="absolute bottom-10 right-10 text-[8px] font-mono text-indigo-500/40 uppercase tracking-[0.5em] hidden lg:block">
                           SIG_SECURE: YES
                        </div>
                     </div>

                     <div className="relative z-10 space-y-12 max-w-3xl">
                        <div className="flex items-center space-x-8">
                           <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] flex items-center justify-center text-white shadow-3xl rotate-12 transform group-hover:rotate-0 transition-all duration-1000">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">The Human Interface</h4>
                              <h3 className="text-4xl font-black text-white italic tracking-tighter">Metaphor Deployment</h3>
                           </div>
                        </div>
                        
                        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 lg:p-14 rounded-[50px] shadow-4xl relative group/card overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                           <p className="text-3xl lg:text-4xl text-slate-100 leading-[1.3] font-black tracking-tight antialiased relative z-10">
                              <span className="text-indigo-500 mr-2 text-5xl">"</span>
                              {activeDay.funnyStory}
                              <span className="text-indigo-500 ml-2 text-5xl">"</span>
                           </p>
                           <div className="mt-8 flex items-center space-x-4 opacity-40">
                              <div className="h-px w-12 bg-white/20"></div>
                              <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Concept Digest v1.0.4</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {activeMode === 'usage' && (
                   <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-500">
                      <div className="p-14 bg-slate-900/40 border border-white/5 rounded-[60px] space-y-8">
                         <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Real-World Deployment</h4>
                         <p className="text-3xl font-black text-white leading-tight">{activeDay.practicalUsage}</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-4">
                               <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                               </div>
                               <h5 className="text-lg font-black text-white">Performance Optimization</h5>
                               <p className="text-slate-400 text-sm leading-relaxed">How this concept translates to efficient execution in a high-concurrency production environment.</p>
                            </div>
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-4">
                               <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                               </div>
                               <h5 className="text-lg font-black text-white">System Architecture</h5>
                               <p className="text-slate-400 text-sm leading-relaxed">Integrating this module into the broader microservices fabric of your Masterpiece project.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {activeMode === 'quiz' && activeDay.quiz && (
                  <div className={`bg-slate-900/40 border border-white/5 p-12 lg:p-20 rounded-[70px] space-y-16 shadow-3xl backdrop-blur-3xl animate-in fade-in slide-in-from-top-8 duration-500 ${shakeQuiz ? 'animate-shake' : ''}`}>
                     <div className="space-y-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Verification Required</span>
                           <h3 className="text-4xl font-black text-white tracking-tight leading-tight">{activeDay.quiz.question}</h3>
                        </div>
                        {showExplanation && (
                           <div className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in zoom-in-95 duration-500 ${quizAnswer === activeDay.quiz.correctIndex ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                              {quizAnswer === activeDay.quiz.correctIndex ? 'VALIDATION SUCCESSFUL' : 'VALIDATION FAILED'}
                           </div>
                        )}
                     </div>
                     <div className="grid grid-cols-1 gap-5">
                        {activeDay.quiz.options.map((opt, i) => {
                          const isCorrect = i === activeDay.quiz!.correctIndex;
                          const isSelected = quizAnswer === i;
                          const showResult = showExplanation;

                          return (
                            <button 
                              key={i} 
                              onClick={() => handleQuizSubmit(i)} 
                              disabled={showResult && quizAnswer === activeDay.quiz!.correctIndex}
                              className={`p-8 rounded-[36px] text-left text-xl font-black transition-all border-2 relative group overflow-hidden ${
                                showResult
                                ? isCorrect 
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                  : isSelected ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-white/5 border-white/5 opacity-50'
                                : 'bg-white/5 border-white/5 hover:border-indigo-500/50 hover:bg-white/10 hover:translate-x-2'
                              }`}
                            >
                              <div className="flex items-center justify-between relative z-10">
                                <span>{opt}</span>
                                {showResult && isCorrect && (
                                  <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <svg className="w-8 h-8 text-rose-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                     </div>
                     {showExplanation && (
                       <div className={`p-10 border rounded-[40px] space-y-5 animate-in fade-in zoom-in-95 duration-700 shadow-xl ${quizAnswer === activeDay.quiz.correctIndex ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                          <h4 className={`text-[11px] font-black uppercase tracking-[0.4em] ${quizAnswer === activeDay.quiz.correctIndex ? 'text-indigo-400' : 'text-rose-400'}`}>
                             {quizAnswer === activeDay.quiz.correctIndex ? 'CTO Rationale' : 'System Diagnostic'}
                          </h4>
                          <p className="text-xl text-slate-200 font-medium leading-relaxed italic">{activeDay.quiz.explanation}</p>
                          {quizAnswer !== activeDay.quiz.correctIndex && (
                            <button 
                              onClick={() => { setShowExplanation(false); setQuizAnswer(null); }}
                              className="mt-6 text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                              Retry Validation Sequence →
                            </button>
                          )}
                       </div>
                     )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Lab Sidebar */}
        <div className="w-[480px] bg-slate-950/90 border-l border-white/5 p-12 overflow-y-auto scrollbar-hide hidden xl:block shadow-[-40px_0_80px_rgba(0,0,0,0.8)] z-10">
           <div className="space-y-12">
              <header className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Primary Knowledge Assets</h4>
              </header>

              <div className="space-y-6">
                 {activeDay?.resources.map((res, i) => (
                  <div key={i} className="group relative">
                    <button onClick={() => handleResourceClick(res)}
                      className="w-full group p-7 rounded-[40px] bg-slate-900/50 border border-white/5 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-left shadow-xl relative overflow-hidden">
                      {res.thumbnail && (
                        <div className="relative aspect-video rounded-[28px] overflow-hidden mb-6 shadow-2xl bg-black">
                           <img src={res.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                           <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center text-slate-950 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                 <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" /></svg>
                              </div>
                           </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{res.type} • {res.difficulty}</span>
                        <span className="text-[9px] font-mono text-slate-700">{res.duration || '--'}</span>
                      </div>
                      <h5 className="text-xl font-black text-white px-2 group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">{res.label}</h5>
                    </button>
                  </div>
                ))}
              </div>

              {activeDay && (
                <div className="p-12 bg-gradient-to-br from-indigo-600/90 to-purple-800/90 rounded-[50px] text-white shadow-3xl relative overflow-hidden group border border-white/20">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                      <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                   </div>
                   <h5 className="text-2xl font-black mb-3 tracking-tight">Sequence Lock</h5>
                   <p className="text-base text-white/80 font-medium mb-8 leading-relaxed">Complete Day {activeDay.day} validation to advance the timeline.</p>
                   <button 
                    disabled={completedDays[selectedModuleId || '']?.has(selectedDayNumber)}
                    onClick={() => setActiveMode('quiz')}
                    className="w-full py-5 bg-white text-slate-950 rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100"
                   >
                      {completedDays[selectedModuleId || '']?.has(selectedDayNumber) ? 'Unit Synchronized' : 'Execute Validation'}
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
