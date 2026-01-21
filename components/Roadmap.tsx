
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RoadmapModule, ModuleStatus, Resource, DailyTask } from '../types';
import { getVoiceBriefing } from '../services/geminiService';

interface RoadmapProps {
  modules: RoadmapModule[];
  setRoadmap: (roadmap: RoadmapModule[]) => void;
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  completedDays: Record<string, number[]>;
  setCompletedDays: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  onComplete?: (xp: number) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({
  modules,
  setRoadmap,
  selectedModuleId,
  setSelectedModuleId,
  selectedDayNumber,
  setSelectedDayNumber,
  completedDays,
  setCompletedDays,
  onComplete
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'theory' | 'story' | 'usage' | 'quiz'>('theory');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [shakeQuiz, setShakeQuiz] = useState(false);
  const [completing, setCompleting] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;

    el.style.setProperty('--tilt-x', `${tiltX}deg`);
    el.style.setProperty('--tilt-y', `${tiltY}deg`);
  };


  const activeModule = useMemo(() =>
    modules.find(m => m.id === selectedModuleId) || modules[0],
    [selectedModuleId, modules]);

  const activeDay = useMemo(() => {
    if (!activeModule || !activeModule.dailySchedule || activeModule.dailySchedule.length === 0) {
      return null;
    }
    return activeModule.dailySchedule.find(d => d.day === selectedDayNumber) || activeModule.dailySchedule[0];
  }, [activeModule, selectedDayNumber]);

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

      if (selectedModuleId) {
        setCompletedDays(prev => ({
          ...prev,
          [selectedModuleId]: Array.from(new Set([...(prev[selectedModuleId] || []), selectedDayNumber]))
        }));
      }
    } else {
      setShakeQuiz(true);
      setTimeout(() => setShakeQuiz(false), 500);
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !mod.dailySchedule) return 0;
    const completedCount = completedDays[moduleId]?.length || 0;
    return Math.round((completedCount / mod.dailySchedule.length) * 100);
  };

  if (!activeModule) return null;

  return (
    <div className="flex h-full bg-slate-950/20 backdrop-blur-md font-['Outfit']">

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

      {/* Navigation Panels */}
      <div className="w-[300px] 2xl:w-80 premium-glass border-r border-white/5 flex flex-col p-6 lg:p-10 space-y-10 scrollbar-hide shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Streams</h4>
            <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">Active</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
            {modules.map(mod => {
              const isSelected = selectedModuleId === mod.id;
              const progress = getModuleProgress(mod.id);
              const isLocked = mod.status === ModuleStatus.LOCKED;

              return (
                <button
                  key={mod.id}
                  disabled={isLocked}
                  onMouseMove={handleMouseMove}
                  onClick={() => { setSelectedModuleId(mod.id); setSelectedDayNumber(1); }}
                  className={`w-full group p-5 rounded-2xl text-left border transition-all duration-500 relative overflow-hidden gaze-tilt ${isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_10px_30px_rgba(99,102,241,0.2)] scale-[1.02]'
                    : isLocked
                      ? 'border-transparent opacity-30 grayscale cursor-not-allowed'
                      : 'border-transparent hover:bg-white/[0.03] hover:border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>STREAM_{mod.month.toString().padStart(2, '0')}</span>
                    {isSelected && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"></div>}
                  </div>
                  <h5 className={`text-[11px] font-black uppercase tracking-tight truncate relative z-10 ${isSelected ? 'text-white' : 'text-slate-400'}`}>{mod.title}</h5>
                  <div className="mt-3 h-1 w-full bg-slate-900 rounded-full overflow-hidden relative z-10 p-[1px]">
                    <div
                      className={`h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] ${isSelected ? 'opacity-100' : 'opacity-40'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  {/* Cartridge Edge Decor */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/5 rotate-45 translate-x-4 -translate-y-4 border-l border-b border-indigo-500/20"></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synapse Nodes</h4>
            <span className="text-[9px] font-mono text-indigo-400/60 font-black">{completedDays[selectedModuleId || '']?.length || 0}/{activeModule.dailySchedule?.length || 0}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {activeModule.dailySchedule?.map(day => {
              const isSelected = selectedDayNumber === day.day;
              const isCompleted = completedDays[selectedModuleId || '']?.includes(day.day);

              return (
                <button
                  key={day.day}
                  onMouseMove={handleMouseMove}
                  onClick={() => { setSelectedDayNumber(day.day); setQuizAnswer(null); setShowExplanation(false); setActiveMode('theory'); }}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-500 group gaze-tilt ${isSelected
                    ? 'bg-indigo-500 text-white shadow-[0_10px_25px_rgba(99,102,241,0.5)] scale-110 z-10'
                    : isCompleted
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/20 hover:text-slate-300'
                    }`}
                >
                  <span className="relative z-10">{day.day}</span>
                  {isCompleted && !isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Engine */}
      <div className="flex-1 flex overflow-hidden bg-[#020617]/60">
        <div
          ref={contentContainerRef}
          className="flex-1 overflow-y-auto px-10 lg:px-24 py-20 scrollbar-hide relative"
        >
          {activeDay && (
            <div key={`${selectedModuleId}-${selectedDayNumber}`} className="max-w-4xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
              <header className="space-y-10 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 premium-glass pl-2 pr-4 py-1.5 rounded-full border-white/10 shadow-xl">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Synapse Layer {activeModule.month}.{activeDay.day.toString().padStart(2, '0')}</span>
                  </div>
                  <button
                    onClick={handlePlayBriefing}
                    disabled={isAudioLoading}
                    className="flex items-center space-x-4 premium-glass px-8 py-4 rounded-full border-indigo-500/30 hover:bg-indigo-500/20 transition-all group active:scale-95 shadow-lg"
                  >
                    {isAudioLoading ? (
                      <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5 text-indigo-400 group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Audio Intelligence</span>
                  </button>
                </div>
                <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black text-white leading-[1.1] tracking-tight antialiased">
                  {activeDay.title}
                </h1>
                <p className="text-xl lg:text-2xl text-slate-400 font-medium leading-relaxed italic border-l-[4px] border-indigo-500/30 pl-8 max-w-3xl opacity-80 decoration-indigo-500/20 underline-offset-8 decoration-2">
                  "{activeDay.objective}"
                </p>
              </header>

              <div className="flex p-2.5 premium-glass border-white/10 rounded-[40px] w-fit backdrop-blur-3xl shadow-2xl sticky top-8 z-20 mx-auto">
                {['theory', 'story', 'usage', 'quiz'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode as any)}
                    className={`px-10 py-4.5 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeMode === mode
                      ? 'premium-button text-white shadow-2xl -translate-y-1'
                      : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
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
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Strategic Context</h4>
                      <p className="text-xl lg:text-2xl font-black text-white leading-tight tracking-tight relative z-10">
                        {activeDay.conceptualWhy}
                      </p>
                    </div>

                    <div className="space-y-12">
                      <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4">Deep Knowledge Layers</h4>
                      {activeDay.detailedTheory.map((point, i) => (
                        <div key={i} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white/[0.01] border border-white/5 p-10 rounded-[48px] hover:border-indigo-500/20 transition-all duration-500 shadow-xl">
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 font-black text-lg">
                              {(i + 1).toString().padStart(2, '0')}
                            </div>
                            <h4 className="text-2xl font-black text-white tracking-tight">{point.title}</h4>
                            <p className="text-base text-slate-400 leading-relaxed font-medium">{point.description}</p>
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
                        <p className="text-xl lg:text-2xl text-slate-100 leading-[1.4] font-black tracking-tight antialiased relative z-10">
                          <span className="text-indigo-500 mr-2 text-3xl">"</span>
                          {activeDay.funnyStory}
                          <span className="text-indigo-500 ml-2 text-3xl">"</span>
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
                  <div className={`premium-glass border-white/10 p-16 lg:p-24 rounded-[60px] space-y-20 shadow-4xl backdrop-blur-3xl animate-in fade-in slide-in-from-top-12 duration-1000 ${shakeQuiz ? 'animate-shake' : ''}`}>
                    <div className="space-y-6 flex flex-col md:flex-row md:items-end justify-between gap-10">
                      <div className="space-y-6 max-w-2xl">
                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em]">System Verification Pulse</span>
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-[1.1]">{activeDay.quiz.question}</h3>
                      </div>
                      {showExplanation && (
                        <div className={`px-10 py-5 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] animate-in zoom-in-95 duration-700 shadow-2xl ${quizAnswer === activeDay.quiz.correctIndex ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-rose-500/20'}`}>
                          {quizAnswer === activeDay.quiz.correctIndex ? 'VALIDATION LOCKED' : 'INTEGRITY BREACH'}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {activeDay.quiz.options.map((opt, i) => {
                        const isCorrect = i === activeDay.quiz!.correctIndex;
                        const isSelected = quizAnswer === i;
                        const showResult = showExplanation;

                        return (
                          <button
                            key={i}
                            onClick={() => handleQuizSubmit(i)}
                            disabled={showResult && quizAnswer === activeDay.quiz!.correctIndex}
                            className={`p-10 rounded-[48px] text-left text-2xl font-black transition-all duration-500 border relative group overflow-hidden ${showResult
                              ? isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-400 shadow-xl'
                                : isSelected ? 'bg-rose-500/10 border-rose-500/60 text-rose-400 shadow-xl' : 'bg-white/[0.02] border-white/5 opacity-30 scale-95'
                              : 'premium-glass border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] hover:translate-x-4 shadow-lg active:scale-98'
                              }`}
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <span>{opt}</span>
                              {showResult && isCorrect && (
                                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                </div>
                              )}
                              {showResult && isSelected && !isCorrect && (
                                <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-110">
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {showExplanation && (
                      <div className={`p-16 border rounded-[60px] space-y-8 animate-in fade-in zoom-in-95 duration-1000 shadow-4xl relative overflow-hidden ${quizAnswer === activeDay.quiz.correctIndex ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-rose-500/5 border-rose-500/30'}`}>
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className={`text-[12px] font-black uppercase tracking-[0.5em] ${quizAnswer === activeDay.quiz.correctIndex ? 'text-indigo-400' : 'text-rose-400'}`}>
                          {quizAnswer === activeDay.quiz.correctIndex ? 'Strategic Analysis' : 'Diagnostic Feedback'}
                        </h4>
                        <p className="text-2xl text-slate-200 font-medium leading-relaxed italic max-w-4xl">{activeDay.quiz.explanation}</p>
                        {quizAnswer !== activeDay.quiz.correctIndex && (
                          <button
                            onClick={() => { setShowExplanation(false); setQuizAnswer(null); }}
                            className="mt-10 premium-button inline-flex items-center space-x-4 px-12"
                          >
                            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Reboot Sequence</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-20 flex justify-center">
                  <button
                    onClick={() => {
                      setCompleting(true);
                      document.body.classList.add('animate-stabilization');

                      // Intensity Audio
                      const overdrive = new Audio('data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAZGFzaABUWFhYAAAAEgAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzbzZtcDQxAFRTU0UAAAAPAAADTGF2ZjYwLjMuMTAwAAAAAAAAAAAAAAD/+00AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYXBpbmcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+00fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYXBpbmcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+00fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYXBpbmcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                      overdrive.volume = 0.4;
                      overdrive.play().catch(e => console.log("Audio blocked"));

                      setTimeout(() => {
                        if (onComplete) onComplete(500);
                        setCompleting(false);
                        document.body.classList.remove('animate-stabilization');
                      }, 1500);
                    }}
                    disabled={completing}
                    className="overdrive-lever text-white px-24 py-8 rounded-[40px] text-lg font-black uppercase tracking-[0.4em] group active:scale-95 shadow-4xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">{completing ? 'TRANSMITTING...' : 'FINALIZE_OVERDRIVE'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Lab Sidebar */}
        <div className="w-[320px] 2xl:w-[400px] premium-glass border-l border-white/5 p-8 lg:p-10 overflow-y-auto scrollbar-hide hidden xl:block shrink-0 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-10">
          <div className="space-y-16">
            <header className="flex items-center justify-between">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Strategic Assets</h4>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
            </header>

            <div className="space-y-8">
              {activeDay?.resources.map((res, i) => (
                <div key={i} className="group relative">
                  <button onClick={() => handleResourceClick(res)}
                    className="w-full group p-8 rounded-[50px] premium-glass border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all duration-700 text-left shadow-2xl relative overflow-hidden active:scale-95">
                    {res.thumbnail && (
                      <div className="relative aspect-video rounded-[36px] overflow-hidden mb-8 shadow-3xl bg-black border border-white/5">
                        <img src={res.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] opacity-60 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.5)] scale-90 group-hover:scale-100 transition-transform duration-500">
                            <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" /></svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4 px-3">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{res.type} <span className="text-slate-700 mx-2">/</span> {res.difficulty}</span>
                      <div className="flex items-center space-x-2">
                        <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">{res.duration || '--'}</span>
                      </div>
                    </div>
                    <h5 className="text-2xl font-black text-white px-3 group-hover:text-indigo-400 transition-colors leading-[1.2] tracking-tighter line-clamp-2">{res.label}</h5>
                  </button>
                </div>
              ))}
            </div>

            {activeDay && (
              <div className="p-16 premium-glass border-indigo-500/30 rounded-[60px] text-white shadow-4xl relative overflow-hidden group/lock">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-800/20 opacity-0 group-hover/lock:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover/lock:scale-150 transition-transform duration-[2000ms]">
                  <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div className="relative z-10 flex flex-col space-y-8">
                  <div className="space-y-2">
                    <h5 className="text-4xl font-black tracking-tighter">Timeline Integrity</h5>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed opacity-80">Finalize unit validation to secure this knowledge stream.</p>
                  </div>
                  <button
                    disabled={completedDays[selectedModuleId || '']?.includes(selectedDayNumber)}
                    onClick={() => setActiveMode('quiz')}
                    className={`w-full py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl active:scale-95 ${completedDays[selectedModuleId || '']?.includes(selectedDayNumber)
                      ? 'bg-transparent border border-emerald-500/40 text-emerald-400 cursor-default opacity-100'
                      : 'premium-button text-white'
                      }`}
                  >
                    {completedDays[selectedModuleId || '']?.includes(selectedDayNumber) ? 'STREAM SECURED' : 'INITIATE VALIDATION'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
