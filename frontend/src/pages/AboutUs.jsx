import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, ShieldCheck, Zap } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="py-24 space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter"
        >
          Digitizing the Global <span className="text-[var(--brand-yellow)]">Supply Chain.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-500 leading-relaxed"
        >
          ChefSupply is a B2B infrastructure startup dedicated to streamlining procurement for the modern hospitality industry. We connect professional kitchens directly with verified production nodes.
        </motion.p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Globe, label: "Distribution Nodes", value: "42+" },
          { icon: Users, label: "Verified Chefs", value: "5000+" },
          { icon: ShieldCheck, label: "Quality Pass Rate", value: "99.9%" },
          { icon: Zap, label: "Avg Delivery Time", value: "<18h" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-4"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto text-gray-900">
              <stat.icon className="w-6 h-6" />
            </div>
            <h4 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Mission Section */}
      <section className="bg-gray-900 rounded-[4rem] p-16 lg:p-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--brand-yellow)]/5 blur-[120px]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
              Our Mission: Elimination of Procurement Friction.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe that professional chefs should focus on their craft, not paperwork. By leveraging advanced logistics algorithms and real-time inventory tracking, we ensure that every ingredient arriving at your kitchen is fresh, verified, and cost-effective.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
            <div className="h-64 bg-[var(--brand-yellow)]/20 rounded-3xl border border-white/10 mt-8" />
          </div>
        </div>
      </section>
    </div>
  );
}
