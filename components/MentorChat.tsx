
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
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', text: "Transmission failed. Recalibrate connection and try again.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-12 flex flex-col h-[calc(100vh-80px)]">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center text-white shadow-2xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Master Mentor</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">AI Reasoning Terminal</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 bg-slate-950/40 border border-white/5 rounded-[40px] p-10 overflow-y-auto space-y-8 scrollbar-hide backdrop-blur-3xl shadow-2xl">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[32px] p-8 shadow-2xl relative ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-900/80 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-xl'
            }`}>
              <div className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap leading-relaxed font-medium">
                {m.text || (m.isStreaming && "Thinking...")}
              </div>
              <div className={`text-[9px] mt-4 font-black uppercase tracking-widest opacity-40`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length - 1]?.text === '' && (
          <div className="flex justify-start">
             <div className="bg-slate-900/50 border border-white/10 rounded-2xl px-8 py-4 flex space-x-3 items-center">
               <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architect is writing...</span>
             </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center space-x-6 bg-slate-900 p-2 rounded-[32px] border border-white/5 shadow-2xl focus-within:border-indigo-500/50 transition-all">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about architectural patterns or system design..."
          className="flex-1 bg-transparent border-none px-8 py-5 text-white font-medium outline-none placeholder:text-slate-600"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="bg-white text-slate-950 px-10 py-5 rounded-[24px] font-black uppercase tracking-tighter hover:bg-indigo-400 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MentorChat;
