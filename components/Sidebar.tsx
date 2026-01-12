
import React from 'react';

type NavItem = 'roadmap' | 'project' | 'mentor' | 'stats';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const items: { id: NavItem; label: string; icon: string }[] = [
    { id: 'roadmap', label: 'Roadmap', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'project', label: 'Masterpiece', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'mentor', label: 'AI Mentor', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
    { id: 'stats', label: 'Growth', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950 border-r border-white/5 flex flex-col h-screen sticky top-0 transition-all duration-500 overflow-hidden group">
      <div className="p-6 mb-8">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4z" /></svg>
        </div>
        <h1 className="hidden lg:block text-lg font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          ODYSSEY.OS
        </h1>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center lg:space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative group/btn ${
              activeTab === item.id 
              ? 'bg-white/5 text-white border border-white/10' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover/btn:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
            </svg>
            <span className="hidden lg:block font-medium text-sm">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 lg:p-6">
        <div className="hidden lg:block bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/5 rounded-2xl p-4 overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Rank: Scholar</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Lvl 4</span>
              <span className="text-[10px] text-slate-500">80% to Mastery</span>
            </div>
          </div>
          <div className="mt-3 w-full bg-black/40 rounded-full h-1">
            <div className="bg-indigo-500 h-1 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: '80%' }}></div>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
