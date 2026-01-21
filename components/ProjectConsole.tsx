
import React, { useState, useEffect, useRef } from 'react';
import { ProjectTask } from '../types';
import { generateProjectTasks, generateProjectBlueprint } from '../services/geminiService';

interface ProjectConsoleProps {
  projectIdea: string;
  setProjectIdea: (idea: string) => void;
  tasks: ProjectTask[];
  setTasks: (tasks: ProjectTask[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  logs: { id: string; text: string; type: 'info' | 'warn' | 'success'; timestamp: string }[];
  addLog: (text: string, type: 'info' | 'warn' | 'success') => void;
}

type BlueprintStyle = 'blueprint' | 'neon' | 'minimalist' | 'cyberpunk';

const ProjectConsole: React.FC<ProjectConsoleProps> = ({
  projectIdea, setProjectIdea, tasks, setTasks, notes, setNotes, logs, addLog
}) => {
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [newIdea, setNewIdea] = useState(projectIdea);
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<BlueprintStyle>('blueprint');
  const logEndRef = useRef<HTMLDivElement>(null);

  const styles: { id: BlueprintStyle; label: string }[] = [
    { id: 'blueprint', label: 'Classic Blueprint' },
    { id: 'neon', label: 'Neon Hologram' },
    { id: 'minimalist', label: 'Zen Architecture' },
    { id: 'cyberpunk', label: 'Cyber Deck' },
  ];

  const handleGenerate = async () => {
    if (!newIdea) return;
    setLoading(true);
    addLog(`INITIALIZING PROJECT MATRIX [MODE: ${selectedStyle.toUpperCase()}]`, "info");
    try {
      setProjectIdea(newIdea);
      addLog("DECRYPTING ARCHITECTURAL CONSTRAINTS...", "info");

      const [generatedTasks, blueprint] = await Promise.all([
        generateProjectTasks(newIdea, 1),
        generateProjectBlueprint(newIdea, selectedStyle)
      ]);

      setTasks(generatedTasks);
      setBlueprintUrl(blueprint);
      addLog("MASTERPIECE SCHEMA GENERATED SUCCESSFULLY.", "success");
      addLog("VISUAL BLUEPRINT SYNCHRONIZED.", "success");
    } catch (e) {
      addLog("SYSTEM CRITICAL: GENERATION SEQUENCE ABORTED.", "warn");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBlueprint = async () => {
    if (!projectIdea) return;
    setRegenerating(true);
    addLog(`RECONFIGURING VISUAL OUTPUT [STYLE: ${selectedStyle.toUpperCase()}]`, "info");
    try {
      const blueprint = await generateProjectBlueprint(projectIdea, selectedStyle);
      setBlueprintUrl(blueprint);
      addLog("VISUAL BLUEPRINT REFRESH COMPLETE.", "success");
    } catch (e) {
      addLog("BLUEPRINT REFRESH FAILED: SIGNAL INTERFERENCE.", "warn");
    } finally {
      setRegenerating(false);
    }
  };

  const handleExport = () => {
    const data = {
      project: projectIdea,
      blueprintStyle: selectedStyle,
      tasks,
      notes,
      logs,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `odyssey-archive-${Date.now()}.json`;
    a.click();
    addLog("SECURE_EXPORT: ARCHIVE_DATA_SYNCED_TO_EXTERNAL_STORAGE", "success");
  };

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (blueprintUrl) {
      // Simulate Terminal Boot Sequence
      const bootLogs = [
        "INITIALIZING_VIRTUAL_DOM_SYNK...",
        "AUTHENTICATING_CREATOR_KEY...",
        "LOADING_SILICON_ARCHITECTURES...",
        "SYSTEM_READY_FOR_MANIFESTATION."
      ];
      bootLogs.forEach((msg, i) => {
        setTimeout(() => {
          addLog(msg, 'info');
        }, i * 250);
      });
    }
  }, [blueprintUrl]);

  useEffect(() => {
    if (projectIdea) {
      const interval = setInterval(() => {
        const phrases = [
          "OPTIMIZING DATA INGESTION LAYERS...",
          "ANALYZING ARCHITECTURAL ENTROPY...",
          "SECURING INGRESS PROTOCOLS...",
          "VALIDATING SCHEMA RELATIONSHIPS...",
          "SCALING VISUAL PRIMITIVES...",
          "SYNCHRONIZING KERNEL THREADS..."
        ];
        addLog(phrases[Math.floor(Math.random() * phrases.length)], 'info');
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [projectIdea]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    addLog(`SYNAPSE UPDATE: NODE ${id.slice(0, 4).toUpperCase()} MODIFIED.`, 'success');
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide py-12 lg:py-16">
      <div className="managed-container flex flex-col min-h-full">
        <header className="mb-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-16 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <h2 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] antialiased">
              Masterpiece<span className="premium-gradient-text">.</span>
            </h2>
            <div className="flex items-center space-x-4">
              <div className="h-px w-24 bg-indigo-500/40"></div>
              <p className="text-slate-500 text-sm font-black uppercase tracking-[0.5em] italic">Architectural Hub 01</p>
            </div>
            <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed opacity-80 border-l-2 border-indigo-500/20 pl-8">
              Manifesting silent visions into high-concurrency silicon reality. This is the terminal of raw creation.
            </p>
          </div>

          {projectIdea && tasks.length > 0 && (
            <div className="flex space-x-12 premium-glass p-8 rounded-[48px] border-white/10 shadow-4xl backdrop-blur-3xl">
              <div className="text-center group">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Protocol</span>
                <span className="text-3xl font-black text-emerald-400 group-hover:drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all">ACTIVE</span>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Modules</span>
                <span className="text-3xl font-black text-white">{tasks.length}</span>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync</span>
                <span className="text-3xl font-black text-indigo-400 tracking-tighter">
                  {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
                </span>
              </div>
            </div>
          )}
        </header>

        {!projectIdea ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="max-w-5xl w-full premium-glass border-white/10 rounded-[80px] p-20 lg:p-32 space-y-16 text-center shadow-4xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10 space-y-12">
                <div className="w-28 h-28 bg-white rounded-[44px] flex items-center justify-center text-slate-950 mx-auto shadow-4xl transform group-hover:rotate-12 transition-all duration-1000">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="space-y-6">
                  <h3 className="text-6xl font-black text-white tracking-tighter">Initialize Creative Intent</h3>
                  <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto opacity-80">What legendary platform defines your odyssey? Describe the vision to begin the architectural build.</p>
                </div>
                <div className="space-y-12">
                  <textarea
                    className="w-full bg-slate-950/60 border-2 border-white/5 rounded-[56px] p-12 text-white text-3xl font-bold focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all h-64 placeholder:text-slate-800 shadow-inner resize-none"
                    placeholder="e.g., A globally distributed, collaborative workspace for high-stakes engineering..."
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                  />

                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em]">Architectural Preset</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                      {styles.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedStyle(s.id)}
                          className={`px-8 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${selectedStyle === s.id
                            ? 'bg-indigo-500 border-indigo-400 text-white shadow-2xl scale-105'
                            : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/30'
                            }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 pt-8">
                    <button
                      onClick={handleGenerate}
                      disabled={loading || !newIdea.trim()}
                      className="flex-1 premium-button font-black py-10 px-16 rounded-[40px] text-xl uppercase tracking-[0.2em] disabled:opacity-30 shadow-4xl active:scale-95 transition-all"
                    >
                      {loading ? 'CALCULATING SCHEMA...' : 'COMMENCE SYSTEM GENESIS'}
                    </button>

                    <button
                      onClick={() => setSelectedStyle(prev => {
                        const idx = styles.findIndex(s => s.id === prev);
                        return styles[(idx + 1) % styles.length].id;
                      })}
                      className="px-16 premium-glass border-white/10 text-white font-black py-10 rounded-[40px] text-xl uppercase tracking-widest hover:bg-white/[0.05] transition-all flex items-center justify-center group"
                    >
                      <svg className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 flex-1 pb-40">
            <div className="lg:col-span-8 space-y-20">
              {/* Achievement/Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="premium-glass p-12 rounded-[60px] border-white/10 space-y-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Neural Archive</h4>
                    <button
                      onClick={handleExport}
                      className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                      title="Secure Export"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900/40 rounded-[40px] p-8 text-white text-lg font-medium outline-none border border-white/5 focus:border-indigo-500/30 transition-all resize-none h-48 placeholder:text-slate-700"
                    placeholder="Commence architectural field notes..."
                  />
                </div>

                <div className="premium-glass p-12 rounded-[60px] border-white/10 flex flex-col justify-center space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Masterpiece Integrity</span>
                    <div className="text-5xl font-black text-white italic tracking-tighter">
                      {Math.round((tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100)}%
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[1px]">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${(tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="premium-glass border-white/10 rounded-[72px] p-16 lg:p-24 space-y-16 shadow-4xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Primary Architectural Blueprint</h4>
                    <p className="text-3xl font-black text-white tracking-tighter uppercase">{selectedStyle} Projection</p>
                  </div>
                  <button
                    onClick={handleRegenerateBlueprint}
                    disabled={regenerating}
                    className="flex items-center space-x-4 premium-glass border-white/10 px-8 py-4 rounded-full text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/[0.05] transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                  >
                    {regenerating ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    )}
                    <span>{regenerating ? 'RECALIBRATING...' : 'REFRESH VISION'}</span>
                  </button>
                </div>

                <div className="relative aspect-video rounded-[56px] overflow-hidden shadow-inner border-[6px] border-white/5 bg-slate-950 flex items-center justify-center group/img">
                  {blueprintUrl ? (
                    <img key={blueprintUrl} src={blueprintUrl} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000 group-hover/img:scale-110 transition-transform duration-[3000ms]" alt="Project Blueprint" />
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(99,102,241,0.4)]"></div>
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Rendering Spatial Data...</p>
                    </div>
                  )}
                  {regenerating && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-10 animate-in fade-in duration-500">
                      <div className="text-center space-y-6">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_30px_indigo]"></div>
                        <p className="text-[12px] font-black text-white uppercase tracking-[0.6em] animate-pulse">Reconfiguring Vision...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-8 left-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.5em] pointer-events-none">
                    AXIS_REF: {Math.random().toFixed(4)} • SYNC_AUTO: ON
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-10 relative z-10">
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Visual Modulation</span>
                  <div className="flex gap-3">
                    {styles.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedStyle === s.id
                          ? 'bg-indigo-500 text-white shadow-2xl -translate-y-1'
                          : 'bg-white/5 text-slate-600 hover:text-slate-200 hover:bg-white/10'
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <header className="flex items-center justify-between px-6">
                  <h4 className="text-[12px] font-black text-slate-600 uppercase tracking-[0.6em]">System Implementation Matrix</h4>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest opacity-60">Real-time Sync Active</div>
                </header>
                <div className="grid grid-cols-1 gap-8">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-12 rounded-[64px] border-2 transition-all duration-700 text-left relative group overflow-hidden ${task.completed
                        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-30 grayscale-[0.8] scale-[0.97]'
                        : 'premium-glass border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.03] shadow-2xl'
                        }`}
                    >
                      <div className="flex items-start space-x-12 relative z-10">
                        <div className={`mt-3 w-16 h-16 rounded-[24px] border-2 flex items-center justify-center transition-all duration-500 ${task.completed ? 'bg-emerald-500 border-emerald-500 rotate-12 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-slate-800 group-hover:border-indigo-500 group-hover:rotate-6'
                          }`}>
                          {task.completed && <svg className="w-10 h-10 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-3xl font-black tracking-tight ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</h5>
                            <span className={`text-[11px] font-black uppercase tracking-widest ${task.completed ? 'text-slate-700' : 'text-indigo-400'}`}>{task.category}</span>
                          </div>
                          <p className="text-2xl text-slate-400 font-medium leading-relaxed italic opacity-80">"{task.description}"</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-16">
              <div className="bg-slate-950/90 border border-white/10 rounded-[72px] p-16 h-[900px] flex flex-col shadow-4xl backdrop-blur-3xl relative overflow-hidden group/kernel">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,100,0.02),rgba(0,255,200,0.01),rgba(0,100,255,0.02))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-scan z-20"></div>

                <header className="flex items-center justify-between mb-12 relative z-10 px-2">
                  <div className="flex items-center space-x-5">
                    <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rose]"></div>
                    <h4 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.5em] drop-shadow-[0_0_8px_indigo]">Kernel Flow</h4>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-mono text-slate-600 font-black tracking-widest">ENCRYPTED</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_emerald]"></div>
                  </div>
                </header>

                <div className="flex-1 font-mono text-[11px] space-y-5 overflow-y-auto scrollbar-hide relative z-10 pr-2">
                  <div className="terminal-scroll space-y-5">
                    {logs.map((log) => (
                      <div key={log.id} className={`flex space-x-5 animate-in slide-in-from-bottom-2 fade-in duration-300 ${log.type === 'success' ? 'text-emerald-400 text-glow-emerald' : log.type === 'warn' ? 'text-rose-400 text-glow-rose' : 'text-slate-500'}`}>
                        <span className="opacity-10 text-[9px] mt-0.5 tracking-tighter">[{log.timestamp}]</span>
                        <p className="flex-1 leading-relaxed tracking-tight group-hover/kernel:text-slate-300 transition-colors font-mono">{log.text}</p>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 space-y-12 relative z-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
                      <span className="text-slate-600">Cognitive Load</span>
                      <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">OPTIMAL</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-[2px]">
                      <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,1)] transition-all duration-1000" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setProjectIdea(''); setBlueprintUrl(null); }}
                    className="w-full py-6 border border-rose-500/20 text-rose-500/40 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-rose-500 hover:text-white transition-all duration-500 active:scale-95 shadow-lg"
                  >
                    TERMINATE SYSTEM
                  </button>
                </div>

                {/* Terminal Corner HUD Decor */}
                <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-indigo-500/20 rounded-tr-3xl pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-indigo-500/20 rounded-bl-3xl pointer-events-none"></div>
              </div>

              <div className="p-16 premium-gradient rounded-[72px] text-white shadow-4xl relative overflow-hidden group shadow-indigo-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-900 group-hover:scale-110 transition-transform duration-[3000ms]"></div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-3xl rounded-[28px] flex items-center justify-center border border-white/20 shadow-2xl transition-transform group-hover:-rotate-12">
                      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-2xl font-black tracking-tight uppercase">Architect Voice</h5>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">Advisory Protocol</p>
                    </div>
                  </div>
                  <p className="text-2xl text-white font-black leading-tight italic tracking-tight antialiased">
                    <span className="text-white/30 text-4xl mr-1">"</span>
                    Your vision suggests a decoupled microservices approach. Prioritize the core ingress validation before optimizing visual state.
                    <span className="text-white/30 text-4xl ml-1">"</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectConsole;
