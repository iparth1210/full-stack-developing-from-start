
import React from 'react';

type NavItem = 'roadmap' | 'project' | 'mentor' | 'stats';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
  onLaunchAntigravity: () => void;
  intensity: number;
  setIntensity: (value: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLaunchAntigravity, intensity, setIntensity }) => {
  const items: { id: NavItem; label: string; icon: string }[] = [
    { id: 'roadmap', label: 'Roadmap', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'project', label: 'Masterpiece', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'mentor', label: 'AI Mentor', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
    { id: 'stats', label: 'Growth', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="w-20 lg:w-72 bg-slate-950/40 backdrop-blur-3xl border-r border-white/5 flex flex-col h-screen sticky top-0 transition-all duration-500 overflow-hidden group">
      <div className="p-8 mb-8">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 group-hover:rotate-12 transition-transform duration-500 animate-heartbeat">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4z" /></svg>
        </div>
        <div className="space-y-1">
          <h1 className="hidden lg:block text-2xl font-black tracking-tighter premium-gradient-text uppercase">
            ODYSSEY.OS
          </h1>
          <p className="hidden lg:block text-[9px] font-bold text-slate-500 tracking-[0.4em] uppercase opacity-60">Elite Education</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="relative group/nav">
            <button
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 relative ${activeTab === item.id
                ? 'premium-glass text-white border-white/10 shadow-lg bg-indigo-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
            >
              <div className="flex items-center lg:space-x-4">
                <div className={`transition-all duration-300 ${activeTab === item.id ? 'scale-110 text-indigo-400' : 'group-hover/nav:scale-110'}`}>
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="hidden lg:block font-black text-sm tracking-tight">{item.label}</span>
              </div>

              {/* 3-Dot Menu Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = document.getElementById(`nav-dropdown-${item.id}`);
                  document.querySelectorAll('[id^="nav-dropdown-"]').forEach(el => {
                    if (el.id !== `nav-dropdown-${item.id}`) el.classList.add('hidden');
                  });
                  dropdown?.classList.toggle('hidden');
                }}
                className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="4" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" /></svg>
              </button>

              {activeTab === item.id && (
                <div className="absolute left-0 w-1.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
              )}
            </button>

            {/* Dropdown Menu */}
            <div id={`nav-dropdown-${item.id}`} className="hidden absolute left-full top-0 ml-2 w-48 premium-glass border border-white/10 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-left-2 duration-200">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-2">{item.label} Options</div>
              <button className="w-full p-3 rounded-lg text-left text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Details
              </button>
              <button className="w-full p-3 rounded-lg text-left text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh Data
              </button>
              <button className="w-full p-3 rounded-lg text-left text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share Progress
              </button>
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 lg:p-8 space-y-6">
        <button
          onClick={onLaunchAntigravity}
          className="hidden lg:flex w-full items-center justify-center space-x-3 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/40 group active:scale-95"
        >
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          <span>Antigravity App</span>
        </button>

        <div className="hidden lg:block premium-glass rounded-2xl p-6 overflow-hidden relative group/intensity">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Link</span>
              <span className="text-[10px] font-black text-white/40 uppercase">{intensity}%</span>
            </div>
            <div className="relative h-6 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest opacity-60">Optic Distortion Level</p>
          </div>
        </div>

        <div className="hidden lg:block premium-glass rounded-2xl p-5 overflow-hidden relative cursor-help group/rank">
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Rank: Scholar</span>
              <span className="text-xl font-black text-white tracking-tighter transition-transform group-hover/rank:scale-110">Lv. 4</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold mb-2">
              <span>PROGRESSION</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-slate-950/60 rounded-full h-1.5 p-[2px]">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl group-hover/rank:w-32 group-hover/rank:h-32 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
