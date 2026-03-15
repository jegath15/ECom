import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2 space-y-12">
        <header>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Procurement <span className="text-[var(--brand-yellow)]">Sheet.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Reviewing {totalItems} SKUs for node allocation.</p>
        </header>

        {cart.length === 0 ? (
          <div className="bg-gray-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-8" />
            <h3 className="text-2xl font-black text-gray-400">Inventory cache is empty.</h3>
            <Link to="/products" className="btn-primary inline-flex mt-8 px-12">Procure Items</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-8 group"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-xs text-gray-400 overflow-hidden">
                     {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : 'SKU'}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-black text-gray-900 tracking-tighter leading-tight">{item.name}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">₹{item.price} / {item.unit || 'Unit'}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-black text-sm">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                      <p className="text-xl font-black text-gray-900 tracking-tighter">₹{Math.round(item.price * item.qty)}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <button 
              onClick={clearCart}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 px-6 py-2 transition-all"
            >
              Clear Entire Cache
            </button>
          </div>
        )}
      </div>

      {/* Summary Sidebar */}
      <div className="space-y-8">
        <div className="bg-gray-900 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[var(--brand-yellow)]/5 pointer-events-none" />
          <h3 className="text-2xl font-black tracking-tighter flex items-center gap-3">
             <ShieldCheck className="w-6 h-6 text-[var(--brand-yellow)]" /> Allocation Summary
          </h3>

          <div className="space-y-4 border-t border-white/10 pt-8">
            <div className="flex justify-between text-gray-400">
              <span className="text-xs uppercase font-bold tracking-widest">Base Value</span>
              <span className="font-black">₹{Math.round(total)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span className="text-xs uppercase font-bold tracking-widest">Node Logistics</span>
              <span className="font-black text-green-400">FREE</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-6 mt-6">
              <span className="text-lg font-black tracking-tighter">Total Allocation</span>
              <span className="text-2xl font-black tracking-tighter text-[var(--brand-yellow)]">₹{Math.round(total)}</span>
            </div>
          </div>

          <Link 
            to="/bulk-order" 
            className="w-full flex items-center justify-center gap-3 py-5 bg-[var(--brand-yellow)] text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:scale-[1.02] transition-all"
          >
            Initiate Bulk RFQ <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center leading-relaxed">
            Prices are exclusive of Net-30 interest terms. Verified B2B accounts only.
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex items-center gap-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
             <ShoppingBag className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
            Items remain in node cache for 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
