import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, ArrowUpRight, ShieldCheck, Terminal, Cpu, Send, MessageSquare, BarChart3, Globe } from 'lucide-react';

export default function GlobalAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "SYSTEM: Procurement Intelligence Synth v2.8.5 Online. Satellite Node Handshake: Optimal. How may I optimize your enterprise velocity today?" }
  ]);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulated Intelligence Response Engine
    setTimeout(() => {
      let aiResponse = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("inventory") || lowerText.includes("stock") || lowerText.includes("node")) {
        aiResponse = "ANALYSIS: 'Pantry' SKU node indicates 12% stock-out risk. Procurement velocity is 412 units/hr. Recommend immediate batch scaling at Primary Hub A to maintain 99.9% SLA.";
      } else if (lowerText.includes("save") || lowerText.includes("money") || lowerText.includes("tier") || lowerText.includes("discount")) {
        aiResponse = "OPPORTUNITY: Current aggregate for 'Industrial Equipment' is ₹4,200 below Tier 4 Threshold. Bundle your next 3 pending RFQs to unlock an 8.5% margin boost.";
      } else if (lowerText.includes("logistics") || lowerText.includes("shipping") || lowerText.includes("port")) {
        aiResponse = "TELEMETRY: Port IN-MAA latency increased by 1.2s. Satellite rerouting active via Secondary Hub B. Estimated delivery windows remain stable within ±15min deviation.";
      } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
        aiResponse = "GREETINGS. Mission Control is ready. I can provide real-time telemetry on inventory nodes, logistics latency, or procurement margin optimizations. Specify command.";
      } else {
        aiResponse = "QUERY ACKNOWLEDGED. Synthesizing data points... Currently monitoring 12,402 SKUs across 4 global nodes. Would you like a detailed velocity report for your most active category?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: "Node Velocity", icon: <BarChart3 className="w-3 h-3" />, query: "Check inventory node velocity" },
    { label: "SLA Status", icon: <ShieldCheck className="w-3 h-3" />, query: "Check logistics SLA telemetry" },
    { label: "Tier Alerts", icon: <Zap className="w-3 h-3" />, query: "Check discount tier opportunities" }
  ];

  return (
    <>
      {/* Floating Elite Trigger */}
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 premium-gradient rounded-full shadow-[0_15px_50px_-10px_rgba(242,201,76,0.6)] flex items-center justify-center text-white z-[9999] border-4 border-white/30 animate-pulse-glow"
      >
        <Zap className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
           <Cpu className="w-2.5 h-2.5 text-white" />
        </div>
      </motion.button>

      {/* Conversational Intelligence Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-end p-6 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, x: 20 }}
              animate={{ scale: 1, y: 0, x: 0 }}
              exit={{ scale: 0.9, y: 50, x: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg h-[600px] flex flex-col overflow-hidden shadow-2xl relative border border-gray-100 mb-20 sm:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Header */}
              <div className="bg-gray-900 p-6 text-white relative flex-shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-yellow)]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--brand-yellow)] rounded-xl flex items-center justify-center text-gray-900 shadow-lg shadow-[var(--brand-yellow)]/20">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase italic tracking-tighter">PROCURE AI <span className="text-[10px] text-[var(--brand-yellow)] not-italic ml-2">CHAT BOT V3.0</span></h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Market Control Interface Active</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                <div className="flex gap-2">
                   {quickActions.map((action, idx) => (
                      <button 
                         key={idx}
                         onClick={() => handleSendMessage(action.query)}
                         className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-[var(--brand-yellow)] hover:border-[var(--brand-yellow)]/30"
                      >
                         {action.icon}
                         {action.label}
                      </button>
                   ))}
                </div>
              </div>

              {/* Chat Area */}
              <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50/50 scroll-smooth"
              >
                 {messages.map((msg, idx) => (
                    <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       key={idx}
                       className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-gray-900 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-100 text-gray-700 italic rounded-tl-none'
                       }`}>
                          {msg.role === 'assistant' && <div className="text-[8px] font-black uppercase tracking-widest text-[var(--brand-yellow)] mb-1">Incoming Transmission:</div>}
                          {msg.content}
                       </div>
                    </motion.div>
                 ))}
                 
                 {isTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                    </div>
                 )}
              </div>

              {/* Input Bar */}
              <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
                 <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="relative flex items-center"
                 >
                    <input 
                       type="text"
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       placeholder="Enter Intelligence Query..."
                       className="w-full pl-6 pr-14 py-4 bg-gray-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                    />
                    <button 
                       type="submit"
                       className="absolute right-2 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-gray-900/20"
                    >
                       <Send className="w-4 h-4" />
                    </button>
                 </form>
                 <div className="mt-3 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                       <Globe className="w-2.5 h-2.5 text-emerald-500" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Satellite Sync Active</span>
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">|</div>
                    <div className="flex items-center gap-1">
                       <MessageSquare className="w-2.5 h-2.5 text-blue-500" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Secure Protocol v3.0</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
