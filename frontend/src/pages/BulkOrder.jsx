import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, ArrowRight, PackageOpen, LayoutList } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function BulkOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateQuantity, updateBidPrice, removeCartItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentBid, setCurrentBid] = useState(null);
  const [internalPo, setInternalPo] = useState('');
  const [rfqNotes, setRfqNotes] = useState('');
  const [negotiationEnabled, setNegotiationEnabled] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const subtotal = cart.reduce((sum, item) => sum + ((item.basePrice || item.price || 0) * item.qty), 0);
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0; // 10% wholesale discount over 1K
  const total = subtotal - discount;

  const handleCheckout = async (isQuotation, isNegotiation = false) => {
    if (!user) {
      showToast("Please login as a business account to place orders.", "error");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    setLoading(true);
    try {
       // Resolve Business ID if not already resolved
       let bid = currentBid;
       if (!bid) {
         const businessRes = await axios.get(`http://localhost:5180/api/business/${user.userId}`);
         bid = businessRes.data.businessId;
         setCurrentBid(bid);
       }

       const orderPayload = {
          BusinessId: bid,
          IsQuotation: isQuotation,
          OrderStatus: isNegotiation ? 'Negotiation' : (isQuotation ? 'Quotation' : 'Pending'),
          InternalPoNumber: internalPo,
          RfqNotes: rfqNotes,
          Items: cart.map(item => ({
             ProductId: item.productId,
             Quantity: item.qty,
             BidPrice: negotiationEnabled ? item.bidPrice : null
          }))
       };
       
       await axios.post('http://localhost:5180/api/orders', orderPayload);
       
       if (isNegotiation) {
         showToast("🤝 Negotiation request transmitted. A procurement officer will contact you shortly.");
       } else if (isQuotation) {
         showToast("✅ Quotation successfully generated and saved to your Dashboard!");
       } else {
         showToast("🎉 Procurement Order successfully placed! An invoice will be emailed to you.");
       }
       
       clearCart();
       setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
       console.error(err);
       showToast("❌ Error processing your request. Please try again.", "error");
    } finally {
       setLoading(false);
    }
  };

  return (
    <>
      <div className="py-16 max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-12">
           <div>
              <Link to="/products" className="inline-flex items-center text-gray-400 hover:text-gray-900 transition-all mb-6 group text-[10px] font-black uppercase tracking-widest">
                  <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-1 transition-transform" /> Return to Catalog
              </Link>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                <LayoutList className="text-[var(--brand-yellow)] w-10 h-10" />
                Active Procurement Sheet
              </h1>
           </div>
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Node: <span className="text-gray-900">DC-NORTH-01</span></p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Cart Items Area */}
          <div className="lg:col-span-2 space-y-8">
            {cart.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-24 text-center shadow-sm">
                <PackageOpen className="w-20 h-20 text-gray-100 mx-auto mb-8" />
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Sheet is Currently Empty</h3>
                <p className="text-gray-400 font-medium mb-10 max-w-sm mx-auto">Your procurement queue is empty. Access the catalog to begin SKU selection.</p>
                <Link to="/products" className="bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-2xl hover:bg-black transition-all shadow-xl">Browse Full Catalog</Link>
              </div>
            ) : (
              <motion.div layout className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Proprietary SKU</th>
                        <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Source node</th>
                        <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Unit Cost</th>
                        <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Volume</th>
                        <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Ext. Cost</th>
                        <th className="py-6 px-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {cart.map((item) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={item.productId} 
                          className="group hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-8 px-10">
                            <p className="font-black text-gray-900 text-sm mb-1">{item.productName}</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">SKU-{item.productId.substring(0,12).toUpperCase()}</p>
                          </td>
                          <td className="py-8 px-10">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">SUP-{item.supplierId.substring(0,6).toUpperCase()}</span>
                          </td>
                          <td className="py-8 px-10">
                            {negotiationEnabled ? (
                              <div className="relative group/bid">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                <input 
                                  type="number" 
                                  value={item.bidPrice || ''} 
                                  onChange={(e) => updateBidPrice(item.productId, parseFloat(e.target.value))}
                                  placeholder={item.basePrice?.toFixed(2)}
                                  className="w-24 pl-6 pr-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-xs font-black text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all italic"
                                />
                              </div>
                            ) : (
                              <p className="text-gray-900 font-black text-sm">₹{(item.basePrice || item.price || 0).toFixed(2)}</p>
                            )}
                          </td>
                          <td className="py-8 px-10">
                            <div className="flex items-center gap-3 bg-gray-50 w-fit p-1.5 rounded-xl border border-gray-200">
                               <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-900 hover:text-white rounded-lg transition-all font-black shadow-sm">-</button>
                               <span className="w-10 text-center text-gray-900 font-black text-sm">{item.qty}</span>
                               <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 flex items-center justify-center bg-white text-gray-900 hover:bg-gray-900 hover:text-white rounded-lg transition-all font-black shadow-sm">+</button>
                            </div>
                          </td>
                          <td className="py-8 px-10 text-right font-black text-gray-900 text-xl tracking-tighter">
                            ₹{((item.bidPrice || item.basePrice || item.price || 0) * item.qty).toFixed(2)}
                          </td>
                          <td className="py-8 px-10 text-right">
                            <button onClick={() => removeCartItem(item.productId)} className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-all">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Area */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 p-10 rounded-[2.5rem] sticky top-32 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-10 pb-4 border-b border-white/10">Quotation Ledger</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Gross Value ({cart.length} SKUs)</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--brand-yellow)]">
                  <span>Wholesale Allowance (-10%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Logistics / Freight</span>
                  <span className="text-green-500 font-black">COMPLIMENTARY</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 mb-10">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Certified Total</span>
                   <span className="text-5xl font-black text-white tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Internal PO Number</label>
                    <input 
                      type="text" 
                      value={internalPo}
                      onChange={(e) => setInternalPo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-yellow)]"
                      placeholder="e.g. PO-88291"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Negotiation Notes / RFQ Details</label>
                    <textarea 
                      value={rfqNotes}
                      onChange={(e) => setRfqNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[var(--brand-yellow)] resize-none"
                      placeholder="Provide context for your bid offer..."
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleCheckout(true)}
                      disabled={cart.length === 0 || loading}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50 border border-white/10"
                    >
                      {loading ? 'Drafting...' : 'Save RFQ'}
                    </button>
                     <button 
                      onClick={() => {
                         if (negotiationEnabled) {
                           handleCheckout(true, true);
                         } else {
                           setNegotiationEnabled(true);
                         }
                      }}
                      disabled={cart.length === 0 || loading}
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50 border ${negotiationEnabled ? 'bg-blue-600 text-white border-blue-400' : 'bg-blue-600/20 text-blue-400 border-blue-500/20 hover:bg-blue-600/40'}`}
                    >
                      {loading ? 'Transmitting...' : (negotiationEnabled ? 'Submit Counter Offer' : 'Initiate Negotiation')}
                    </button>
                 </div>
                 <button 
                   onClick={() => handleCheckout(false)}
                   disabled={cart.length === 0 || loading}
                   className="w-full bg-[var(--brand-yellow)] hover:bg-white text-gray-900 py-6 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                 >
                   {loading ? 'Synthesizing...' : 'Execute Procurement'} <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
              <p className="text-center text-[9px] font-black text-gray-500 mt-8 leading-relaxed uppercase tracking-widest">
                Subject to verified MSA terms. <br/> Net-30 Settlement protocol applied.
              </p>
            </motion.div>
          </div>

        </div>
      </div>

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
