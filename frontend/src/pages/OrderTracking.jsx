import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Search, MapPin } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Mock tracking data
      setTracking({
        id: orderId,
        status: "In Transit",
        currentLocation: "Denver Distribution Node #14",
        history: [
          { time: "08:45 AM", location: "Departure - Salinas Production Node", status: "Origin Dispatched" },
          { time: "02:15 PM", location: "Arrival - Salt Lake City Hub", status: "Sorting Complete" },
          { time: "Current", location: "Denver Distribution Node", status: "In Transit" }
        ]
      });
    }
  };

  return (
    <div className="py-24 space-y-24">
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Logistics <span className="text-[var(--brand-yellow)]">Tracker.</span></h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Real-time telemetry across the ChefSupply distribution mesh.</p>
        
        <form onSubmit={handleTrack} className="flex gap-2 p-3 bg-white border border-gray-200 rounded-3xl shadow-xl mt-12">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-8 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter node order ID (e.g. ORD-123)..." 
              className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none pl-16 pr-8 py-4 text-sm font-bold"
            />
          </div>
          <button type="submit" className="bg-gray-900 text-white px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
            Track Node
          </button>
        </form>
      </header>

      {tracking ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden"
        >
          <div className="bg-gray-900 p-12 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">Tracking ID</p>
              <h3 className="text-3xl font-black tracking-tighter">{tracking.id}</h3>
            </div>
            <div className="bg-[var(--brand-yellow)] text-gray-900 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
              {tracking.status}
            </div>
          </div>

          <div className="p-12 space-y-12">
            <div className="flex items-center gap-6 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Truck className="w-6 h-6 text-gray-900" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Node</p>
                  <p className="text-lg font-black text-gray-900">{tracking.currentLocation}</p>
               </div>
            </div>

            <div className="space-y-8 relative pl-8">
              <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gray-100" />
              {tracking.history.map((step, i) => (
                <div key={i} className="relative flex items-center gap-8">
                  <div className={`w-2 h-2 rounded-full z-10 ${i === 2 ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'}`} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{step.time}</p>
                    <p className="font-black text-gray-900">{step.status}</p>
                    <p className="text-xs text-gray-500">{step.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 grayscale">
           {[Truck, Package, MapPin].map((Icon, i) => (
             <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-200 flex flex-col items-center gap-6">
                <Icon className="w-8 h-8 text-gray-300" />
                <div className="h-2 w-24 bg-gray-200 rounded-full" />
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
