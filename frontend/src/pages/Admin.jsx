import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, RefreshCw, CheckCircle2, AlertCircle, 
  Package, Truck, Clock, BarChart3, Users, 
  Building2, ShoppingBag, LayoutDashboard
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

export default function Admin() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tab, setTab] = useState('dashboard'); // 'dashboard', 'orders', 'businesses', 'products', 'system'

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (tab === 'dashboard') {
        const res = await axios.get(`${API_URL}/api/admin/stats`, { headers });
        setStats(res.data);
      } else if (tab === 'orders') {
        const res = await axios.get(`${API_URL}/api/orders/admin/all`, { headers });
        setOrders(res.data);
      } else if (tab === 'businesses') {
        const res = await axios.get(`${API_URL}/api/admin/businesses`, { headers });
        setBusinesses(res.data);
      } else if (tab === 'products') {
        const res = await axios.get(`${API_URL}/api/admin/products`, { headers });
        setProducts(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Data retrieval failed for specialized node.');
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [tab, fetchData]);

  const handleReset = async () => {
    if (!window.confirm("Are you sure? This will TRUNCATE and RE-SEED the database with initial B2B data.")) return;
    setLoading(true);
    setStatus(null);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/admin/reset-data`);
      setStatus(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Reset protocol failed.");
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
      fetchData();
    } catch (err) {
      alert('Security violation or network error.');
    }
  };

  const verifyBusiness = async (businessId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/admin/businesses/${businessId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Business successfully verified for Enterprise Credit.');
    } catch (err) {
      alert('Verification protocol failed.');
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'businesses', label: 'Businesses', icon: Building2 },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'system', label: 'System Health', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <ShieldAlert className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                Control<span className="text-emerald-400 tracking-tighter">Plane</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">B2B Enterprise Node Administration</p>
            </div>
          </div>

          <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 backdrop-blur-xl">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  tab === item.id 
                  ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs font-bold mb-8 flex items-center gap-3 border border-red-500/20 shadow-xl shadow-red-500/5">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'dashboard' && stats && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: BarChart3, color: 'text-emerald-400' },
                { label: 'Marketplace Nodes', value: stats.totalBusinesses, icon: Building2, color: 'text-blue-400' },
                { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'text-purple-400' },
                { label: 'Pending Logistics', value: stats.pendingOrders, icon: Clock, color: 'text-amber-400' },
                { label: 'Product Catalog', value: stats.totalProducts, icon: ShoppingBag, color: 'text-pink-400' },
                { label: 'Supply Alerts', value: stats.lowStockAlerts, icon: AlertCircle, color: stats.lowStockAlerts > 0 ? 'text-red-400' : 'text-slate-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                  <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <stat.icon className="w-24 h-24" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.label}</p>
                  <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                </div>
              ))}
            </motion.div>
          )}

          {tab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Log ID</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payload Value</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status State</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {orders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <Package className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                            <span className="text-sm font-black text-white font-mono">#{order.orderId.slice(0, 8)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-emerald-400 tracking-tighter italic">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full w-fit">
                            {getStatusIcon(order.orderStatus)}
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.orderStatus}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                             <button 
                                onClick={() => setSelectedOrder(order)}
                                className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2"
                              >
                                Details
                              </button>
                            {order.orderStatus === 'Pending' && (
                              <button 
                                onClick={() => updateStatus(order.orderId, 'Approved')}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/10"
                              >
                                Approve
                              </button>
                            )}
                            {order.orderStatus === 'Approved' && (
                              <button 
                                onClick={() => updateStatus(order.orderId, 'Shipped')}
                                className="bg-blue-500 hover:bg-blue-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/10"
                              >
                                Dispatch
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'businesses' && (
            <motion.div 
              key="businesses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/50 rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/50 border-b border-slate-700">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Business Entity</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ownership</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">GST-ID</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Credit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {businesses.map((biz) => (
                      <tr key={biz.businessId} className="hover:bg-slate-700/30 transition-colors group">
                        <td className="px-8 py-6 font-black text-white">{biz.businessName}</td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">{biz.industryType || 'General'}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-bold text-slate-200">{biz.ownerName}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-tight">{biz.ownerEmail}</div>
                        </td>
                        <td className="px-8 py-6 font-black text-slate-500 font-mono text-xs">{biz.gstNumber || 'UNREGISTERED'}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${biz.creditStatus === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{biz.creditStatus}</span>
                            {biz.creditStatus !== 'Verified' && (
                              <button 
                                onClick={() => verifyBusiness(biz.businessId)}
                                className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-900 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all"
                              >
                                Verify Credit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {tab === 'products' && (
            <motion.div 
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {products.map((prod) => (
                    <div key={prod.productId} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 hover:border-emerald-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-black text-white leading-tight">{prod.productName}</h4>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{prod.categoryName}</p>
                            </div>
                            <div className="text-emerald-400 font-black text-xl italic">₹{prod.basePrice?.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-500" />
                                <span className={`text-xs font-bold ${prod.stockLevel < 50 ? 'text-red-400' : 'text-slate-400'}`}>
                                    {prod.stockLevel} units in inventory
                                </span>
                            </div>
                            {prod.stockLevel < 50 && (
                                <span className="animate-pulse bg-red-500/20 text-red-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">Critical Low</span>
                            )}
                        </div>
                    </div>
                ))}
            </motion.div>
          )}

          {tab === 'system' && (
            <motion.div 
              key="system"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-800/50 p-12 rounded-[3rem] border border-slate-700 shadow-2xl backdrop-blur-3xl text-center">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 group hover:rotate-90 transition-transform duration-500">
                    <RefreshCw className="w-10 h-10 text-emerald-400" />
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-4">Marketplace Reset Protocol</h2>
                 <p className="text-slate-400 text-sm mb-10 leading-relaxed font-bold px-12">
                    Initiate a destructive re-seed of all globally distributed enterprise nodes. All active transactions, inventory state, and B2B contracts will be synchronized to the baseline state.
                 </p>

                 {status && (
                   <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-2xl text-xs font-black mb-8 flex items-center justify-center gap-3 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" /> {status}
                   </div>
                 )}

                 <button 
                   onClick={handleReset}
                   disabled={loading}
                   className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-xs uppercase tracking-[0.3em] py-6 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
                 >
                   {loading ? <RefreshCw className="w-6 h-6 animate-spin text-slate-800" /> : <RefreshCw className="w-6 h-6 text-slate-800 group-hover:rotate-180 transition-transform" />}
                   {loading ? 'Executing Protocol...' : 'System Global Synchronization'}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-700 shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic">Order Breakdown</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ref: #{selectedOrder.orderId.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">✕</button>
              </div>
              <div className="p-10 max-h-[60vh] overflow-y-auto space-y-4">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div>
                      <p className="text-sm font-black text-white">{item.productName || 'Proprietary SKU'}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty: {item.quantity} units @ ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-xl font-black text-emerald-400 tracking-tighter italic">₹{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="p-10 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Global Aggregate</span>
                <span className="text-4xl font-black text-emerald-400 tracking-tighter italic">₹{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
