import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!window.confirm("Are you sure? This will TRUNCATE and RE-SEED the database with initial B2B data.")) return;
    
    setLoading(true);
    setStatus(null);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/admin/reset-data`);
      setStatus(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset database. Ensure you are authorized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100-80px)] bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
           <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Administration</h1>
              <p className="text-gray-500 font-medium">Restricted access control for platform maintenance.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Database Maintenance */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50"
           >
              <div className="flex items-center gap-3 mb-6">
                 <Database className="w-5 h-5 text-gray-400" />
                 <h2 className="text-xl font-bold text-gray-900">Database Control</h2>
              </div>
              
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                 Trigger a full system reset and re-seed. Useful for clearing test data and restoring verified B2B nodes and product catalogs.
              </p>

              {status && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-3 uppercase tracking-wider">
                   <CheckCircle2 className="w-4 h-4" /> {status}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-3 uppercase tracking-wider">
                   <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {loading ? 'Executing Reset...' : 'Reset & Re-seed Marketplace'}
              </button>
           </motion.div>

           {/* More admin cards can go here */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-gray-100/50 border-2 border-dashed border-gray-200 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-60"
           >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                 <ShieldAlert className="w-5 h-5 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Upcoming Module</h3>
              <p className="text-gray-400 text-xs mt-2 px-8">Advanced node monitoring and SLA management console.</p>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
