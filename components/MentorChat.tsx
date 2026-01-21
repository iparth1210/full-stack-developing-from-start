
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getMentorResponseStream } from '../services/geminiService';

interface MentorChatProps {
  context: string;
}

const MentorChat: React.FC<MentorChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the Inner Circle. I am your Senior Architect. We aren't just here to learn; we're here to engineer a career. What's on your mind?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const personalities = [
    { id: 'architect', name: 'The Architect', icon: '🏛️', color: 'indigo' },
    { id: 'hacker', name: 'Elite Hacker', icon: '⚡', color: 'emerald' },
    { id: 'minimalist', name: 'The Zen Master', icon: '☯️', color: 'slate' },
  ];
  const [activePersonality, setActivePersonality] = useState(personalities[0]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Initial empty model message for streaming
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date(), isStreaming: true }]);

    try {
      await getMentorResponseStream(input, context, (fullText) => {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'model') {
            lastMsg.text = fullText;
          }
          return updated;
        });
      });

      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
          lastMsg.isStreaming = false;
        }
        return updated;
      });
    } catch (e) {
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: "SYSTEM ERROR: Transmission failed. Re-establishing link...", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden py-8 relative">
      {/* Neural Frequency Pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo-500/30 animate-pulse shadow-[0_0_20px_indigo]"></div>
      </div>
      <div className="managed-container flex-1 flex flex-col min-h-0 relative z-10">
        <header className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
          <div className="flex items-center space-x-8">
            <div className="w-20 h-20 rounded-[32px] bg-white flex items-center justify-center text-slate-950 shadow-4xl transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_indigo]"></span>
                <span>Neural Advisory Active</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter antialiased glitch-text" data-text="Master Architect.">Master Architect<span className="premium-gradient-text">.</span></h2>
              <div className="flex items-center space-x-4">
                <span className="text-[8px] font-mono text-indigo-400/40 uppercase tracking-[0.4em]">Neural_Link: [STABLE]</span>
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.4em]">S_VER: 4.2.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center premium-glass p-2.5 rounded-[32px] border-white/10 shadow-xl">
            {personalities.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePersonality(p)}
                className={`px-6 py-3.5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center space-x-3 ${activePersonality.id === p.id
                  ? 'bg-indigo-500 text-white shadow-2xl scale-105'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                  }`}
              >
                <span>{p.icon}</span>
                <span className={activePersonality.id === p.id ? 'block' : 'hidden md:block'}>{p.name}</span>
              </button>
            ))}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 premium-glass border-white/5 rounded-[64px] p-8 lg:p-14 overflow-y-auto space-y-12 scrollbar-hide shadow-inner relative group/chat">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-700`}>
              <div className={`max-w-[80%] rounded-[48px] p-10 shadow-4xl relative group transition-all duration-500 ${m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-[8px] hover:-translate-x-2'
                : 'premium-glass border-white/10 text-slate-100 rounded-tl-[8px] hover:translate-x-2'
                }`}>
                <div className="prose prose-invert prose-xl max-w-none whitespace-pre-wrap leading-relaxed font-bold tracking-tight antialiased">
                  {m.text || (m.isStreaming && (
                    <div className="flex space-x-2 py-2">
                      <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce"></div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${m.role === 'user' ? 'bg-white' : 'bg-indigo-500'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{m.role === 'user' ? 'SYNODE: USER' : `ADVISOR: ${activePersonality.name}`}</span>
                  </div>
                  <span className="text-[9px] font-black">{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && messages[messages.length - 1]?.text === '' && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="premium-glass border-white/10 rounded-[28px] px-8 py-5 flex space-x-4 items-center">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Architecting response...</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 group">
          <div className="premium-glass p-3 rounded-[48px] border-white/10 shadow-4xl focus-within:ring-8 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 transition-all flex items-center space-x-4 bg-slate-950/40 backdrop-blur-3xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Interrogate the system or seek architectural guidance..."
              className="flex-1 bg-transparent border-none px-6 lg:px-10 py-5 lg:py-7 text-lg lg:text-xl font-bold outline-none placeholder:text-slate-800"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="premium-button text-white px-8 lg:px-14 py-4 lg:py-7 rounded-[28px] lg:rounded-[36px] font-black uppercase tracking-[0.2em] disabled:opacity-30 active:scale-95 transition-all shadow-2xl flex items-center space-x-3 lg:space-x-4 group/btn"
            >
              <span className="text-[10px] lg:text-xs">DISPATCH</span>
              <svg className="w-5 h-5 lg:w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <div className="mt-6 flex justify-center space-x-12 opacity-20 group-focus-within:opacity-60 transition-opacity">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">End-to-End Encryption</span>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Neural Sync: 0.8ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
