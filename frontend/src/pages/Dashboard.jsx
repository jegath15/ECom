import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Clock, UserPlus, Building2, FileKey2, CheckCircle2, AlertCircle, Plus, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_URL from '../config';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [wallet, setWallet] = useState({ balance: 0.00 });
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiLoading] = useState(false);
  const [aiSuggestions] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Fallback businessId for any remaining static references
  const businessId = '00000000-0000-0000-0000-000000000000';

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Resolve Business ID first
      if (!user?.userId) {
        console.warn("No userId available in session");
        setLoading(false);
        return;
      }

      const businessRes = await axios.get(`${API_URL}/api/business/${user.userId}`);
      const bid = businessRes.data.businessId;
      setBusinessProfile(businessRes.data);
      setCurrentBid(bid);

      // Run remaining API calls concurrently with the resolved BID
      const [walletRes, txRes, invoiceRes, orderRes, supplierRes, inventoryRes] = await Promise.all([
         axios.get(`${API_URL}/api/wallet/${bid}`).catch(() => ({ data: { balance: 0.00 } })),
         axios.get(`${API_URL}/api/wallet/${bid}/transactions`).catch(() => ({ data: [] })),
         axios.get(`${API_URL}/api/invoices/business/${bid}`).catch(() => ({ data: [] })),
         axios.get(`${API_URL}/api/orders/business/${bid}`).catch(() => ({ data: [] })),
         axios.get(`${API_URL}/api/suppliers/contracts`).catch(() => ({ data: [] })),
         axios.get(`${API_URL}/api/inventory`).catch(() => ({ data: [] }))
      ]);

      setWallet(walletRes.data);
      setWalletTransactions(txRes.data);
      setInvoices(invoiceRes.data);
      setInventory(inventoryRes.data);
      
      // Filter Orders separate from Quotations
      const fetchedOrders = orderRes.data || [];
      setOrders(fetchedOrders.filter(o => o.orderStatus !== 'Quotation'));
      setQuotations(fetchedOrders.filter(o => o.orderStatus === 'Quotation'));
      
      // Extract contracts from the suppliers array
      const allContracts = supplierRes.data.flatMap(s => 
         (s.contracts || []).map(c => ({ ...c, supplierName: s.supplierName }))
      );
      setContracts(allContracts);
      
      setLoading(false);
    } catch (err) {
      console.error("Dashboard Fetch Error", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTopUp = async () => {
    if (!currentBid) return;
    try {
       setActionLoading(true);
       const res = await axios.post(`${API_URL}/api/wallet/add-money`, {
          BusinessId: currentBid,
          Amount: 500.00
       });
       setWallet({ balance: res.data.balance });
       showToast("Successfully topped up ₹500.00 via Bank Transfer protocol.");
       // Refresh transactions
       const txRes = await axios.get(`${API_URL}/api/wallet/${currentBid}/transactions`);
       setWalletTransactions(txRes.data);
    } catch(err) {
       console.error("Top-up failed", err);
       showToast("Error adding funds to wallet.", "error");
    } finally {
       setActionLoading(false);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    if (!currentBid) return;
    try {
      setActionLoading(true);
      await axios.post(`${API_URL}/api/invoices/${invoiceId}/pay/${currentBid}`);
      showToast("✅ Invoice successfully paid from Business Wallet!");
      await fetchDashboardData();
    } catch (err) {
      console.error("Payment failed", err);
      // Checking for specific 400 error for low balance
      if (err.response?.status === 400) {
        showToast("Insufficient balance in wallet. Please top up funds.", "error");
      } else {
        showToast("Error processing payment. Please try again.", "error");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertQuotation = async (orderId) => {
    try {
      setActionLoading(true);
      await axios.patch(`${API_URL}/api/orders/${orderId}/convert`);
      showToast("✅ Quotation successfully converted to a Procurement Order!");
      await fetchDashboardData();
      setActiveTab('orders');
    } catch (err) {
      console.error("Conversion failed", err);
      showToast("Error converting quotation. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };


  return (
    <>
      <div className="py-16 max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 flex justify-between items-end border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Enterprise Console</h1>
            <p className="text-gray-500 font-medium tracking-wide">Business Partner ID: <span className="text-gray-900 font-black">{(currentBid || businessId).substring(0,8)}</span> | Welcome back, <span className="text-[var(--brand-yellow)] font-black uppercase tracking-widest text-xs">{user?.unique_name || 'Partner'}</span></p>
          </div>
          <div className="flex items-center gap-6">
             {businessProfile?.creditStatus === 'Verified' && (
               <div className="hidden md:flex items-center gap-2 px-6 py-2 bg-green-50 text-green-600 rounded-full border border-green-100 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Enterprise Node</span>
               </div>
             )}
             <div className="hidden md:block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm">Global Marketplace Status: <span className="text-green-600">Active</span></span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-1 space-y-3">
            {['overview', 'analytics', 'profile', 'wallet', 'quotations', 'orders', 'invoices', 'inventory', 'contracts', 'fleet', 'team'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] group ${activeTab === tab ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-900 border border-gray-100 shadow-sm'}`}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${activeTab === tab ? 'bg-[var(--brand-yellow)] scale-125' : 'bg-gray-200 group-hover:bg-gray-400'}`} />
                {tab === 'fleet' ? 'Fleet / Nodes' : tab === 'team' ? 'Enterprise Team' : tab}
                <ArrowUpRight className={`w-3 h-3 ml-auto transition-all ${activeTab === tab ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {loading ? (
               <div className="h-96 flex flex-col items-center justify-center text-gray-400 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <div className="w-10 h-10 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin mb-6"></div>
                 <p className="font-black uppercase tracking-[0.2em] text-[10px]">Syncing Enterprise Ledger...</p>
               </div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                
                 {/* Wallet Card */}
                {(activeTab === 'overview' || activeTab === 'wallet') && (
                  <div className="space-y-8">
                    <div className="bg-gray-900 p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--brand-yellow)]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 flex items-center gap-2">Corporate Liquidity / Net-30 Status</p>
                            <h2 className="text-6xl font-black text-white tracking-tighter">₹{wallet.balance?.toFixed(2) || '0.00'}</h2>
                          </div>
                          <button onClick={handleTopUp} disabled={actionLoading} className="bg-[var(--brand-yellow)] hover:bg-white hover:text-gray-900 transition-all text-gray-900 font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl shadow-xl disabled:opacity-50 flex items-center gap-3">
                            Verify Deposit <ArrowUpRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>

                    {activeTab === 'wallet' && (
                       <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8 pb-4 border-b border-gray-50">Operational Transaction Log</h3>
                          {walletTransactions.length === 0 ? (
                             <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-[2rem] bg-gray-50/50">
                                <p className="text-gray-400 font-bold text-sm">No transaction entries found.</p>
                             </div>
                          ) : (
                             <div className="space-y-4">
                                {walletTransactions.map(tx => (
                                   <div key={tx.transactionId} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-300 transition-all group">
                                      <div className="flex items-center gap-6">
                                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {tx.amount > 0 ? <Plus className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                         </div>
                                         <div>
                                            <p className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-1">{tx.type || 'Standard Xfer'}</p>
                                            <p className="text-[10px] text-gray-400 font-black">{new Date(tx.createdAt).toLocaleString().toUpperCase()}</p>
                                         </div>
                                      </div>
                                      <p className={`text-2xl font-black tracking-tighter ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                         {tx.amount > 0 ? '+' : ''}₹{tx.amount.toFixed(2)}
                                      </p>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Recent Orders */}
                   {(activeTab === 'overview' || activeTab === 'orders') && (
                     <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">Procurement Queue</h3>
                          {activeTab === 'overview' && <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Audit All</button>}
                        </div>
                        {orders.length === 0 ? (
                          <p className="text-gray-400 font-bold text-sm">Queue is currently clear.</p>
                        ) : (
                          <div className="space-y-5">
                             {orders.map(order => (
                               <div key={order.orderId} className="bg-gray-50 border border-gray-100 rounded-[2rem] overflow-hidden hover:border-gray-900 transition-all group shadow-sm cursor-pointer">
                                 <div className="flex items-center justify-between p-6">
                                    <div>
                                      <p className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-2">
                                        PO-{order.orderId.substring(0,8).toUpperCase()} {order.internalPoNumber && <span className="text-blue-600 ml-2">[{order.internalPoNumber}]</span>}
                                      </p>
                                      <p className="text-[10px] text-gray-400 font-black flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-black text-gray-900 tracking-tighter mb-1">₹{(order.totalAmount || 0).toFixed(2)}</p>
                                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.1em] shadow-sm ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-[var(--brand-yellow)] text-gray-900'}`}>
                                        {order.orderStatus}
                                      </span>
                                    </div>
                                 </div>
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   )}

                    {/* Open Quotations */}
                   {(activeTab === 'overview' || activeTab === 'quotations') && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">Draft Quotations / RFQs</h3>
                          {activeTab === 'overview' && <button onClick={() => setActiveTab('quotations')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Audit All</button>}
                        </div>
                        {quotations.length === 0 ? (
                          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-[2rem] bg-gray-50/50">
                             <FileKey2 className="w-8 h-8 text-gray-200 mb-4" />
                             <p className="text-gray-400 font-bold text-sm">No pending quotations found.</p>
                          </div>
                        ) : (
                           <div className="space-y-6">
                              {quotations.map(quote => (
                                 <div key={quote.orderId} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-gray-50/80 rounded-[2rem] border border-gray-100 hover:border-gray-900 transition-all group shadow-sm">
                                    <div className="mb-6 sm:mb-0">
                                       <div className="flex items-center gap-4 mb-3">
                                          <p className="text-gray-900 font-black text-xl tracking-tighter uppercase tracking-widest">RFQ-{quote.orderId.substring(0,6).toUpperCase()}</p>
                                          <span className="bg-white text-gray-400 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-gray-100 shadow-sm">Review Pending</span>
                                       </div>
                                       <p className="text-[10px] text-gray-400 font-black flex items-center gap-2 uppercase tracking-widest"><Clock className="w-3 h-3" /> Drafted: {new Date(quote.createdAt).toLocaleDateString()}</p>
                                       <p className="text-[10px] text-gray-900 font-black mt-3 uppercase tracking-widest">{quote.items?.length || 0} Line Items Verified</p>
                                    </div>
                                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-6">
                                       <p className="text-4xl font-black text-gray-900 tracking-tighter">₹{quote.totalAmount.toFixed(2)}</p>
                                       <button 
                                         onClick={() => handleConvertQuotation(quote.orderId)}
                                         disabled={actionLoading}
                                         className="text-[10px] font-black uppercase tracking-widest bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl shadow-xl disabled:opacity-50"
                                       >
                                          Authorize Purchase
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                      </div>
                   )}

                   {/* Recent Invoices */}
                   {(activeTab === 'overview' || activeTab === 'invoices') && (
                     <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-3">Revenue Ledger</h3>
                          {activeTab === 'overview' && <button onClick={() => setActiveTab('invoices')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Audit All</button>}
                        </div>
                        {invoices.length === 0 ? (
                          <p className="text-gray-400 font-bold text-sm">No outstanding invoices linked.</p>
                        ) : (
                          <div className="space-y-4">
                             {invoices.map(inv => (
                               <div key={inv.invoiceId} className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-900 transition-all shadow-sm">
                                  <div className="flex items-center gap-5">
                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${inv.status?.toLowerCase() === 'paid' ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-600'}`}>
                                        {inv.status?.toLowerCase() === 'paid' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                     </div>
                                     <div>
                                        <p className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-1">TX-{inv.invoiceId.substring(0,6).toUpperCase()}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Dated: {new Date(inv.createdAt || inv.invoiceDate).toLocaleDateString()}</p>
                                     </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-3">
                                    <p className="text-xl font-black text-gray-900 tracking-tighter">₹{(inv.amount || inv.totalAmount || 0).toFixed(2)}</p>
                                    {inv.status?.toLowerCase() === 'unpaid' ? (
                                       <button 
                                         onClick={() => handlePayInvoice(inv.invoiceId)}
                                         disabled={actionLoading}
                                         className="text-[9px] font-black px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-[var(--brand-yellow)] hover:text-gray-900 transition-all disabled:opacity-50 uppercase tracking-widest shadow-md"
                                       >
                                          Execute Payment
                                       </button>
                                    ) : (
                                       <span className="text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest bg-gray-100 text-gray-400 border border-gray-200 shadow-inner">
                                         Settled
                                       </span>
                                    )}
                                  </div>
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   )}

                    {/* Inventory Tab */}
                   {activeTab === 'inventory' && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                         <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-4">Global Distribution Nodes</h3>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Live Satellite Sync Active</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                   <th className="pb-6 px-6">Proprietary SKU ID</th>
                                   <th className="pb-6 px-6 text-center">Available Volume</th>
                                   <th className="pb-6 px-6 text-right">Last Telemetry</th>
                                   <th className="pb-6 px-6 text-right">Priority</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50">
                                {inventory.length === 0 ? (
                                   <tr>
                                      <td colSpan="4" className="py-20 text-center font-black uppercase tracking-widest text-[10px] text-gray-300">Awaiting SKU Handshake...</td>
                                   </tr>
                                ) : (
                                   inventory.map(item => (
                                      <tr key={item.inventoryId} className="group hover:bg-gray-50 transition-colors">
                                         <td className="py-6 px-6">
                                            <p className="font-black text-gray-900 text-sm mb-1">{item.productName || 'SKU ' + item.productId.substring(0,8)}</p>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.inventoryId.substring(0,12)}</p>
                                         </td>
                                         <td className="py-6 px-6 text-center">
                                            <div className="flex flex-col items-center">
                                               <span className={`text-xl font-black tracking-tighter ${item.availableQuantity > 100 ? 'text-green-600' : 'text-gray-900'}`}>
                                                  {item.availableQuantity}
                                               </span>
                                               <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden shadow-inner">
                                                  <div className={`h-full ${item.availableQuantity > 100 ? 'bg-green-500' : 'bg-[var(--brand-yellow)]'}`} style={{ width: `${Math.min(100, item.availableQuantity / 5)}%` }}></div>
                                               </div>
                                            </div>
                                         </td>
                                         <td className="py-6 px-6 text-right text-gray-400 text-[10px] font-black uppercase">{new Date(item.updatedAt || Date.now()).toLocaleTimeString()}</td>
                                         <td className="py-6 px-6 text-right">
                                            <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm ${item.availableQuantity > 0 ? 'bg-white border border-gray-100 text-gray-900' : 'bg-red-50 text-red-600'}`}>
                                               {item.availableQuantity > 0 ? 'Optimal' : 'Immediate Restock'}
                                            </span>
                                         </td>
                                      </tr>
                                   ))
                                )}
                             </tbody>
                          </table>
                        </div>
                      </div>
                   )}

                    {/* Business Profile Tab */}
                   {activeTab === 'profile' && businessProfile && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-4">Corporate Identity Registry</h3>
                          <div className="flex gap-4">
                             <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${businessProfile.creditStatus === 'Verified' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {businessProfile.creditStatus || 'Verification Pending'}
                             </span>
                             {businessProfile.creditStatus === 'Verified' && (
                               <div className="px-4 py-2 bg-[var(--brand-yellow)]/10 text-gray-900 border border-[var(--brand-yellow)]/20 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                                 <Zap className="w-3 h-3" /> Enterprise Pricing Active
                               </div>
                             )}
                             <button className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md">Modify Record</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div>
                              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase tracking-widest">Legal Business Entity</p>
                              <p className="text-gray-900 font-black text-xl tracking-tighter">{businessProfile.businessName}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase tracking-widest">Industry Segment</p>
                              <p className="text-gray-900 font-black text-xl tracking-tighter uppercase">{businessProfile.industryType || 'General Enterprise'}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase tracking-widest">Authorized TAX ID</p>
                              <p className="text-gray-900 font-black text-xl tracking-tighter uppercase">{businessProfile.gstNumber}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase tracking-widest">Estimated Monthly Volume</p>
                              <p className="text-gray-900 font-black text-xl tracking-tighter">₹{(businessProfile.estimatedMonthlyVolume || 0).toLocaleString()}</p>
                           </div>
                           <div className="md:col-span-2">
                              <p className="text-[10px] text-gray-400 font-black mb-3 uppercase tracking-widest flex items-center gap-2">Registered Operational HQ</p>
                              <p className="text-gray-900 font-black text-xl tracking-tighter leading-snug">{businessProfile.address}, {businessProfile.city}, {businessProfile.state} <br/> <span className="text-gray-400 text-sm">Verified Node Status: Active</span></p>
                           </div>
                        </div>
                      </div>
                   )}

                   {/* Fleet / Nodes Tab */}
                   {activeTab === 'fleet' && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                         <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-4">Fleet & Delivery Nodes</h3>
                          <button className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"><Plus className="w-3 h-3"/> Register New Node</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                             { name: 'Primary Warehouse', loc: 'Downtown Node', type: 'Core Distribution', status: 'Active' },
                             { name: 'Satellite Hub A', loc: 'Industrial West', type: 'Fulfillment', status: 'Maintenance' },
                             { name: 'Cold Storage 04', loc: 'Port Authority', type: 'Specialized', status: 'Active' }
                           ].map((node, i) => (
                             <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] hover:border-gray-900 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                   <Building2 className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-all"/>
                                   <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${node.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{node.status}</span>
                                </div>
                                <h4 className="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-1">{node.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold mb-4">{node.loc}</p>
                                <div className="pt-4 border-t border-gray-200/50 flex items-center justify-between">
                                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{node.type}</span>
                                   <ArrowUpRight className="w-3 h-3 text-gray-300"/>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                   )}

                   {/* Enterprise Team Tab */}
                   {activeTab === 'team' && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                         <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-100">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-4">Organizational Hierarchy</h3>
                          <button className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"><UserPlus className="w-3 h-3"/> Provision Member</button>
                        </div>
                        <div className="space-y-4">
                           {[
                             { name: user?.unique_name || 'Partner Account', role: 'Global Administrator', status: 'Verified', clearance: 'Level 04' },
                             { name: 'Procurement Specialist', role: 'Purchasing Officer', status: 'Active', clearance: 'Level 02' },
                             { name: 'Finance Controller', role: 'Accounts Payable', status: 'Active', clearance: 'Level 03' }
                           ].map((member, i) => (
                             <div key={i} className="flex items-center justify-between p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-gray-900 transition-all shadow-sm">
                                <div className="flex items-center gap-5">
                                   <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-black text-gray-400 text-xs">
                                      {member.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-1">{member.name}</p>
                                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.role}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">{member.clearance}</p>
                                   <span className="text-[8px] font-black px-2 py-1 rounded-md bg-white border border-gray-100 text-gray-400 uppercase tracking-widest">{member.status}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                   )}

                   {/* Contracts Tab */}
                   {activeTab === 'contracts' && (
                      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm md:col-span-2">
                        <div className="mb-10 pb-8 border-b border-gray-100">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-4">Active SLA Partnerships</h3>
                        </div>
                        {contracts.length === 0 ? (
                          <div className="py-20 flex items-center justify-center border-2 border-dashed border-gray-50 rounded-[2rem] bg-gray-50/50">
                             <p className="text-gray-400 font-bold text-sm">No binding contracts found.</p>
                          </div>
                        ) : (
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {contracts.map(contract => (
                                 <div key={contract.contractId} className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 hover:border-gray-900 transition-all shadow-sm group">
                                    <div className="flex items-center justify-between mb-6">
                                       <span className="bg-white text-green-600 border border-green-100 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-sm">Binding SLA</span>
                                       <p className="text-gray-300 text-[9px] font-black uppercase">CID-{contract.contractId.substring(0,8)}</p>
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 mb-2 tracking-tighter">{contract.supplierName}</h4>
                                    <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">{contract.terms}</p>
                                    <div className="flex justify-between items-center pt-6 border-t border-gray-200/50">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Effective Date:</span>
                                       <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{new Date(contract.validityStart).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                      </div>
                   )}
                   {/* Analytics Tab */}
                   {activeTab === 'analytics' && (
                      <div className="space-y-8">
                         <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                               <div>
                                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-2">Procurement Velocity</h3>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Expenditures & SKU Trends</p>
                               </div>
                               <div className="flex gap-4 items-center">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/5 rounded-xl border border-gray-100">
                                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Sync Intelligence Live</span>
                                  </div>
                                  <span className="bg-green-50 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl border border-green-100">+14% vs Last Quarter</span>
                               </div>
                            </div>
                            
                            <div className="h-[400px] w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={[
                                     { name: 'Jan', spend: 4500, volume: 120 },
                                     { name: 'Feb', spend: 5200, volume: 150 },
                                     { name: 'Mar', spend: 4800, volume: 140 },
                                     { name: 'Apr', spend: 6100, volume: 180 },
                                     { name: 'May', spend: 5900, volume: 175 },
                                     { name: 'Jun', spend: 7200, volume: 210 },
                                  ]}>
                                     <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="var(--brand-yellow)" stopOpacity={0.3}/>
                                           <stop offset="95%" stopColor="var(--brand-yellow)" stopOpacity={0}/>
                                        </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} dy={10} />
                                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                                      <Tooltip 
                                         contentStyle={{ 
                                            borderRadius: '1.5rem', 
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0,0,0,0.05)', 
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
                                            fontFamily: 'inherit',
                                            fontWeight: '900',
                                            fontSize: '10px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em'
                                         }}
                                         cursor={{ stroke: 'var(--brand-yellow)', strokeWidth: 2, strokeDasharray: '5 5' }}
                                      />
                                     <Area type="monotone" dataKey="spend" stroke="var(--brand-yellow)" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
                                  </AreaChart>
                               </ResponsiveContainer>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-10 pb-4 border-b border-gray-50">Spending by Vertical</h3>
                               <div className="h-[300px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <PieChart>
                                        <Pie
                                           data={[
                                              { name: 'Pantry', value: 4000 },
                                              { name: 'Kitchen', value: 3000 },
                                              { name: 'Cleaning', value: 2000 },
                                              { name: 'Equipment', value: 5000 },
                                           ]}
                                           innerRadius={60}
                                           outerRadius={80}
                                           paddingAngle={5}
                                           dataKey="value"
                                        >
                                           {[{ name: 'Pantry', color: '#111' }, { name: 'Kitchen', color: '#FFD700' }, { name: 'Cleaning', color: '#444' }, { name: 'Equipment', color: '#888' }].map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.color} />
                                           ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                     </PieChart>
                                  </ResponsiveContainer>
                               </div>
                            </div>

                            <div className="bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                               <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--brand-yellow)]/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Node restock Efficiency</h3>
                               <div className="space-y-6">
                                  {[
                                     { label: 'Bulk Savings', value: '24.2%', color: 'text-[var(--brand-yellow)]' },
                                     { label: 'Avg Lead Time', value: '1.4 Days', color: 'text-green-400' },
                                     { label: 'Cost per Node', value: '₹1.1k', color: 'text-white' }
                                  ].map((stat, i) => (
                                     <div key={i} className="flex justify-between items-end border-b border-white/10 pb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                                        <span className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</span>
                                     </div>
                                  ))}
                               </div>
                               <button className="w-full mt-10 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/10">Download Audit Report</button>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

        {/* Procure AI Assistant - Floating Elite Access */}
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-12 right-12 w-20 h-20 premium-gradient rounded-full shadow-[0_20px_60px_-15px_rgba(242,201,76,0.5)] flex items-center justify-center text-white z-40 border-4 border-white/20 animate-pulse-glow"
        >
          <Zap className="w-10 h-10" />
        </motion.button>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl relative border border-gray-100"
             >
                <div className="bg-gray-900 p-10 text-white relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-yellow)]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-[var(--brand-yellow)] rounded-xl flex items-center justify-center text-gray-900">
                            <Zap className="w-6 h-6" />
                         </div>
                         <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Procure AI</h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Market Intelligence Synth v2.5</p>
                         </div>
                      </div>
                      <button onClick={() => setAiAssistantOpen(false)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                         <Plus className="w-6 h-6 rotate-45" />
                      </button>
                   </div>
                   <p className="text-sm font-medium text-gray-400 leading-relaxed italic">Analyzing your enterprise velocity and global node telemetery for optimized procurement routes.</p>
                </div>

                <div className="p-10 bg-gray-50/50">
                   {aiLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-6">
                         <div className="w-12 h-12 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synthesizing Market Data...</p>
                      </div>
                   ) : (
                      <div className="space-y-6">
                         {aiSuggestions.map((s, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx} 
                              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                            >
                               <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 border-b border-[var(--brand-yellow)] pb-1">{s.title}</h4>
                                  <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:text-gray-900 transition-colors" />
                               </div>
                               <p className="text-xs text-gray-500 font-medium leading-relaxed italic">{s.desc}</p>
                            </motion.div>
                         ))}
                         <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all mt-4">Execute Auto-Optimization</button>
                      </div>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border ${
              toast.type === 'error' 
                ? 'bg-red-500 text-white border-red-400' 
                : 'bg-slate-900 text-white border-primary/30'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
