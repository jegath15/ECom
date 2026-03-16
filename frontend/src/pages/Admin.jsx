import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertCircle, Database, Package, Truck, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('orders'); // 'orders' or 'system'

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    }
  }, []);

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab, fetchOrders]);

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

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/orders/${orderId}/status`, 
        JSON.stringify(newStatus), 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchOrders();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-amber-400 decoration-4 underline-offset-4">Control Plane</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Authorized Node Administration</p>
            </div>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => setTab('orders')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'orders' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Order Central
            </button>
            <button 
              onClick={() => setTab('system')}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'system' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              System Health
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-8 flex items-center gap-3 border border-red-100 shadow-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'orders' ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Global Log ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Node Origin</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Payload Value</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status State</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-bold italic">No active telemetry found.</td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                                <span className="text-sm font-black text-gray-900 font-mono tracking-tighter">
                                  #{order.orderId.slice(0, 8)}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter block truncate max-w-[120px]">
                                {order.businessId}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-sm font-black text-gray-900 tracking-tighter">
                              ₹{order.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full w-fit shadow-sm">
                                {getStatusIcon(order.orderStatus)}
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                  {order.orderStatus}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex gap-2">
                                {order.orderStatus === 'Pending' && (
                                  <button 
                                    onClick={() => updateStatus(order.orderId, 'Approved')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-200"
                                  >
                                    Approve
                                  </button>
                                )}
                                {order.orderStatus === 'Approved' && (
                                  <button 
                                    onClick={() => updateStatus(order.orderId, 'Shipped')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-200"
                                  >
                                    Dispatch
                                  </button>
                                )}
                                <button className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-white transition-all shadow-sm">
                                   <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="system"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/50">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                       <Database className="w-6 h-6 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Core Reset</h2>
                 </div>
                 
                 <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                    Initiate a destructive re-seed of all marketplace nodes. This will truncate the current product catalog, supplier nodes, and active transactions to restore the baseline B2B enterprise state.
                 </p>

                 {status && (
                   <div className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl text-xs font-black mb-8 flex items-center gap-3 border border-emerald-100 shadow-sm uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" /> {status}
                   </div>
                 )}

                 <button 
                   onClick={handleReset}
                   disabled={loading}
                   className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                 >
                   {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                   {loading ? 'Executing Protocol...' : 'Full System Synchronization'}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
