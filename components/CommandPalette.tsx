
import React, { useState, useEffect, useRef } from 'react';

import { RoadmapModule, ProjectTask } from '../types';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    modules: RoadmapModule[];
    tasks: ProjectTask[];
    onSelectAction: (id: string, type: 'navigation' | 'roadmap' | 'task', metadata?: any) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, modules, tasks, onSelectAction }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const actions = [
        { id: 'roadmap', label: 'Access Roadmap', category: 'Navigation', shortcut: 'R', type: 'navigation' as const },
        { id: 'project', label: 'Initialize Masterpiece', category: 'Project', shortcut: 'P', type: 'navigation' as const },
        { id: 'mentor', label: 'Consult Neural Mentor', category: 'AI', shortcut: 'M', type: 'navigation' as const },
        { id: 'stats', label: 'View Growth Diagnostics', category: 'Stats', shortcut: 'G', type: 'navigation' as const },
        { id: 'antigravity', label: 'Execute Antigravity Portal', category: 'System', shortcut: 'A', type: 'navigation' as const },
    ];

    const searchResults = React.useMemo(() => {
        if (!query) return actions;

        const q = query.toLowerCase();
        const results: any[] = [];

        // 1. Search Actions
        actions.forEach(a => {
            if (a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
                results.push(a);
            }
        });

        // 2. Search Roadmap Modules
        modules.forEach(m => {
            if (m.title.toLowerCase().includes(q)) {
                results.push({
                    id: m.id,
                    label: `Jump to: ${m.title}`,
                    category: 'Roadmap',
                    shortcut: 'STRM',
                    type: 'roadmap',
                    metadata: { moduleId: m.id, day: 1 }
                });
            }
            m.dailySchedule?.forEach(d => {
                if (d.title.toLowerCase().includes(q)) {
                    results.push({
                        id: `${m.id}-day-${d.day}`,
                        label: `Module Node: ${d.title}`,
                        category: `Roadmap // ${m.title}`,
                        shortcut: `D${d.day}`,
                        type: 'roadmap',
                        metadata: { moduleId: m.id, day: d.day }
                    });
                }
            });
        });

        return results.slice(0, 8);
    }, [query, modules]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-6">
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl premium-glass rounded-[40px] border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-top-10 zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan z-20"></div>

                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center space-x-6">
                        <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Execute Neural Command..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent text-3xl font-black text-white placeholder-white/10 outline-none tracking-tight"
                        />
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest whitespace-nowrap">
                            ESC TO CLOSE
                        </div>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto p-4 space-y-2">
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => { onSelectAction(result.id, result.type, result.metadata); onClose(); }}
                                className="w-full group flex items-center justify-between p-6 rounded-[28px] hover:bg-white/[0.05] transition-all duration-300 text-left"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase">{result.shortcut}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors uppercase">{result.label}</h4>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">{result.category}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-12 text-center text-white/20">
                            <span className="text-[10px] font-black uppercase tracking-[1em]">NO COMMANDS DETECTED</span>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-950/40 border-t border-white/5 flex justify-between items-center px-10">
                    <div className="flex items-center space-x-12">
                        <div className="flex items-center space-x-3 text-[9px] font-black text-white/20 uppercase tracking-widest">
                            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">↑↓</span>
                            <span>NAVIGATE</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[9px] font-black text-white/20 uppercase tracking-widest">
                            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">ENTER</span>
                            <span>EXECUTE</span>
                        </div>
                    </div>
                    <span className="text-[9px] font-black text-indigo-400/40 uppercase tracking-widest">ODYSSEY.OS // ARCHITECT_MODE</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
