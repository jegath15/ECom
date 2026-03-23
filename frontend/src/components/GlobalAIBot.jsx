import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, ArrowUpRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function GlobalAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generateIntelligence = () => {
    setLoading(true);
    // Simulated AI Intelligence Handshake
    setTimeout(() => {
      const intel = [
        { title: "Node Optimization", desc: "Current procurement velocity (412 Units/Hr) suggests a 12% stock-out risk for 'Pantry' SKU group in 48hrs. Recommend immediate batch scaling." },
        { title: "Tier Access Identified", desc: "Bulk aggregate for 'Equipment' category is ₹4k shy of Tier 4 Wholesaling. Bundle next 3 RFQs to unlock 15% margin boost." },
        { title: "Logistics Telemetry", desc: "Port IN-MAA reports 1.2s higher latency. Traffic rerouted through Secondary Hub B. SLA reliability remains at 99.9%." }
      ];
      setSuggestions(intel);
      setLoading(false);
    }, 1500);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (suggestions.length === 0) {
      generateIntelligence();
    }
  };

  return (
    <>
      {/* Floating Elite Trigger */}
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-8 right-8 w-16 h-16 premium-gradient rounded-full shadow-[0_15px_50px_-10px_rgba(242,201,76,0.6)] flex items-center justify-center text-white z-[9999] border-4 border-white/30 animate-pulse-glow"
        title="Procure AI - Global Intelligence"
      >
        <Zap className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
           <Cpu className="w-2.5 h-2.5 text-white" />
        </div>
      </motion.button>

      {/* Intelligence Dashboard Modal */}
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
              className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative border border-gray-100 mb-20 sm:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD Header */}
              <div className="bg-gray-900 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-yellow)]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--brand-yellow)] rounded-xl flex items-center justify-center text-gray-900 shadow-lg shadow-[var(--brand-yellow)]/20">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase italic tracking-tighter">PROCURE AI <span className="text-[10px] text-[var(--brand-yellow)] not-italic ml-2">V2.8.5</span></h3>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Market Intelligence Synth Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
                  >
                    <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4 text-emerald-400" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">Satellite Node Handshake: Optimal</p>
                </div>
              </div>

              {/* Data Stream */}
              <div className="p-8 bg-gray-50/50">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                       <div className="w-16 h-16 border-2 border-gray-100 rounded-full" />
                       <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-[var(--brand-yellow)] rounded-full animate-spin" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Processing Telemetry...</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {suggestions.map((s, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ delay: idx * 0.15 }}
                        key={idx}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--brand-yellow)]/30 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-black text-[10px] uppercase tracking-[0.15em] text-gray-900 bg-gray-900/5 px-3 py-1 rounded-lg">{s.title}</h4>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-900 group-hover:scale-125 transition-all" />
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">{s.desc}</p>
                      </motion.div>
                    ))}
                    
                    <button 
                      onClick={generateIntelligence}
                      className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all mt-4 shadow-xl active:scale-95 group overflow-hidden relative"
                    >
                      <span className="relative z-10 font-bold italic">Execute Global Analytics Refresh</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
