
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ProjectTask, RoadmapModule, ModuleStatus } from '../types';

interface StatsProps {
  xp: number;
  tasks: ProjectTask[];
  roadmap: RoadmapModule[];
  logs: { id: string; text: string; type: 'info' | 'warn' | 'success'; timestamp: string }[];
}

const timeData = [
  { name: 'Mon', hours: 4 },
  { name: 'Tue', hours: 6.5 },
  { name: 'Wed', hours: 2 },
  { name: 'Thu', hours: 8 },
  { name: 'Fri', hours: 5.5 },
  { name: 'Sat', hours: 3 },
  { name: 'Sun', hours: 1 },
];

const Stats: React.FC<StatsProps> = ({ xp, tasks, roadmap, logs }) => {
  const completedModules = roadmap.filter(m => m.status === ModuleStatus.COMPLETED).length;
  const projectSync = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  const skillData = [
    { subject: 'Logic', A: Math.min(100, 45 + (xp / 500)), fullMark: 100 },
    { subject: 'Arch', A: Math.min(100, 30 + (xp / 1000)), fullMark: 100 },
    { subject: 'Front', A: 75, fullMark: 100 },
    { subject: 'Back', A: 50, fullMark: 100 },
    { subject: 'Sec', A: 40, fullMark: 100 },
    { subject: 'Ops', A: 30, fullMark: 100 },
  ];

  const pulseData = Array.from({ length: 20 }, (_, i) => ({
    name: i,
    value: 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10
  }));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide py-16">
      <div className="managed-container space-y-20 pb-40">
        <header className="space-y-4">
          <h2 className="text-7xl font-black text-white tracking-tighter antialiased">System Diagnostic<span className="text-indigo-500">.</span></h2>
          <p className="text-2xl text-slate-400 font-medium">Monitoring the evolution of a world-class engineer.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Cumulative XP', value: xp.toLocaleString(), change: `Mastery Rank: ${Math.floor(xp / 10000) + 1}`, color: 'indigo' },
            { label: 'Unit Uptime', value: '142 hrs', change: '92% Concentration', color: 'cyan' },
            { label: 'Odyssey Path', value: `${Math.round((completedModules / roadmap.length) * 100)}%`, change: `${completedModules} / ${roadmap.length} Modules`, color: 'emerald' },
            { label: 'Project Pulse', value: projectSync.toString(), change: projectSync === 100 ? 'Deployment Ready' : 'Execution Phase', color: 'rose' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-white/5 p-10 rounded-[50px] relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl backdrop-blur-2xl">
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-black text-white tracking-tighter">{stat.value}</span>
                </div>
                <p className={`text-[11px] font-black uppercase tracking-widest text-${stat.color}-400`}>{stat.change}</p>
              </div>
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Skill Matrix (Radar) */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-white/10 p-12 rounded-[70px] shadow-4xl relative overflow-hidden flex flex-col items-center group">
            {/* Radar HUD Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-scan z-20"></div>
            <header className="w-full mb-12">
              <h3 className="text-2xl font-black text-white">Full-Stack DNA</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Skill Distribution Matrix</p>
            </header>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} />
                  <Radar name="User" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-12 grid grid-cols-2 gap-4">
              {skillData.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.subject}</span>
                  <span className="text-sm font-black text-indigo-400">{s.A}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Velocity Graph */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-16 rounded-[70px] shadow-4xl backdrop-blur-3xl flex flex-col">
            <header className="flex justify-between items-center mb-16">
              <div>
                <h3 className="text-3xl font-black text-white">Execution Velocity</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Deep Work Distribution (Current Week)</p>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-2 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                System Optimized
              </div>
            </header>
            <div className="flex-1 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} dy={20} tick={{ fontWeight: 800 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '24px', padding: '20px' }}
                    itemStyle={{ color: '#818cf8', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Neural Frequency & Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Real-time Frequency Pulse */}
          <div className="lg:col-span-4 bg-slate-950/60 border border-white/10 p-10 rounded-[60px] shadow-4xl relative overflow-hidden flex flex-col group">
            <header className="mb-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Neural Frequency</h3>
              <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Real-time Diagnostic</p>
            </header>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pulseData}>
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="#6366f1" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase text-white/20 tracking-widest px-2">
              <span>SYNC_STABLE</span>
              <span className="animate-pulse text-indigo-500">62.8 HZ</span>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-950 border border-white/5 p-12 rounded-[60px] shadow-3xl">
            <h3 className="text-xl font-black text-white mb-8 tracking-tight uppercase">Strategic Activity Feed</h3>
            <div className="space-y-3">
              {logs.slice(-5).reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between p-6 bg-white/[0.01] border border-white/5 rounded-[30px] group transition-all hover:bg-white/[0.03] hover:border-indigo-500/20">
                  <div className="flex items-center space-x-8">
                    <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest w-20">{log.timestamp}</span>
                    <span className="text-lg text-slate-200 font-black group-hover:text-indigo-400 transition-colors uppercase truncate max-w-md">{log.text}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-xl bg-slate-900 border border-white/10 group-hover:text-white transition-colors ${log.type === 'success' ? 'text-emerald-500' : log.type === 'warn' ? 'text-rose-500' : 'text-slate-500'
                    }`}>{log.type}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-20 text-slate-700 font-black uppercase tracking-[1em]">NO DATA DETECTED</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
