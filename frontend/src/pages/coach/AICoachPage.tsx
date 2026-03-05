import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap, Brain, MessageSquare, Loader2, ChevronRight, Target } from 'lucide-react';
import { authApi } from '../../services/api';

const AICoachPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "Hello! I'm AROMI, your personalized AI Fitness Coach. How can I help you crush your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // For now, using the basic chat endpoint. Later, this can be more specialized.
      // const response = await api.post('/chat', { message: input });
      // Mock response for high-fidelity UI demonstration
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: "That's a great question! Based on your current progress in the 'Muscle Gain' program, I recommend focusing on progressive overload. Would you like me to adjust your tomorrow's workout plan to include higher volume?"
        }]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Chat failed', error);
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] flex flex-col gap-4 md:gap-6 pt-14 md:pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 premium-gradient rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Brain className="w-6 h-6 md:w-7 md:h-7 text-black" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-white">AROMI <span className="text-cyan-400">Coach</span></h1>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-3">
          {['Schedule', 'Diet Advice', 'Form Check'].map(tag => (
            <button key={tag} className="glass-card px-4 py-2 text-[10px] font-black uppercase tracking-widest border-white/5 hover:border-cyan-400/30 transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Chat Interface */}
        <div className="flex-1 glass-card flex flex-col overflow-hidden border-cyan-400/5">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-white/10' : 'premium-gradient text-black'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-400 text-black font-medium rounded-tr-none'
                      : 'bg-white/5 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[80%]">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none italic text-xs text-gray-500">
                    Aromi is crafting a personalized response...
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your fitness journey..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-400 text-black rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-cyan-400/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* AI Stats / Context Sidebar */}
        <div className="hidden lg:block w-80 space-y-6">
          <div className="glass-card p-6 border-cyan-400/20">
            <h3 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Live Context
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Current Phase', value: 'Hypertrophy', icon: Zap },
                { label: 'Weekly Consistency', value: '85%', icon: MessageSquare },
                { label: 'Energy Trend', value: 'Improving', icon: Target },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                    <item.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">{item.label}</p>
                    <p className="text-sm font-bold text-gray-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-between group">
              View Detailed Metrics
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-cyan-400/10 to-transparent border-cyan-400/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-2">Coach Note</h3>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "You've been killing the consistency game lately. Let's try to add one extra set to your compound lifts this week to break that plateau."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;
