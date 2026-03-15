import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, Star, MapPin, Truck, FileSignature } from 'lucide-react';
import axios from 'axios';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5180/api/suppliers/contracts')
      .then(res => {
         setSuppliers(res.data);
         setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 max-w-[1400px] mx-auto px-6 space-y-20">
      
      {/* Header and Search */}
      <div className="bg-white border border-gray-100 p-16 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-xl">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--brand-yellow)]/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <Building2 className="w-16 h-16 text-gray-900 mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">Verified Global Registry</h1>
        <p className="text-xl text-gray-500 font-medium max-w-3xl mb-12 leading-relaxed">Connect directly with certified growers, Tier-1 manufacturers, and cold-chain logistics partners verified for enterprise excellence.</p>
        
        <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-[2rem]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter by Entity Name, ISO Region, or SKU Category..." 
            className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-[2rem] pl-20 pr-8 py-6 focus:outline-none focus:ring-4 focus:ring-gray-900/5 focus:bg-white transition-all text-lg font-medium placeholder-gray-400 shadow-inner"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
         <div className="py-40 flex flex-col items-center justify-center text-gray-400">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mb-6"></div>
           <p className="font-black uppercase tracking-[0.2em] text-[10px]">Accessing Proprietary Network Hub...</p>
         </div>
      ) : suppliers.length === 0 ? (
         <div className="py-40 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
            <p className="font-black uppercase tracking-widest text-sm">Registry is currently offline or empty.</p>
         </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {suppliers.map((s, i) => (
          <motion.div 
            key={s.supplierId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-gray-100 p-10 rounded-[2.5rem] transition-all group hover:shadow-2xl hover:border-gray-900 cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-8">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-sm border border-gray-100">
                  <Building2 className="w-8 h-8" />
               </div>
               <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 font-black uppercase tracking-widest text-[9px]">Verified Node</span>
               </div>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter px-0">{s.supplierName}</h3>
            
            <div className="space-y-4 mb-10 flex-grow">
               <div className="flex items-center gap-4 text-gray-500">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-gray-400" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">{s.location || 'EMEA / NORTH AMERICA'}</span>
               </div>
               <div className="flex items-center gap-4 text-gray-500">
                 <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Truck className="w-4 h-4 text-gray-400" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Enterprise LTL Freight</span>
               </div>
               {s.contracts && s.contracts.length > 0 && (
                 <div className="flex items-center gap-4 text-gray-900 bg-[var(--brand-yellow)]/10 w-fit px-4 py-2 rounded-xl border border-[var(--brand-yellow)]/20 shadow-sm">
                   <FileSignature className="w-4 h-4 text-gray-600" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{s.contracts.length} SLA RECORDS DETECTED</span>
                 </div>
               )}
            </div>

            <button 
              onClick={() => window.location.href = `mailto:${s.email || 'procurement@chefsupply.com'}?subject=Inquiry from B2B Marketplace`}
              className="w-full bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-[var(--brand-yellow)] hover:text-gray-900 transition-all shadow-xl group-hover:shadow-2xl"
            >
              Contact Lead Partner
            </button>
          </motion.div>
        ))}
      </div>
      )}

    </div>
  );
}
