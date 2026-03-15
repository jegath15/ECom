import React, { useState, useEffect } from 'react';
import { Search, Plus, Home as HomeIcon, ChevronRight, Package, Truck, ShieldCheck, Zap, Layers, Filter } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAdd }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all group flex flex-col h-full"
  >
    <div className="h-64 bg-[#f8f9fa] flex items-center justify-center relative overflow-hidden group">
      <img src={`https://placehold.co/400x300/F9FAFB/111827?text=${encodeURIComponent(product.productName)}`} alt={product.productName} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      
      <div className="absolute top-6 right-6 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-2 rounded-xl shadow-lg transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
           <Zap className="w-4 h-4 text-[var(--brand-yellow)]" />
        </div>
      </div>

      {/* PROCURE Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           whileHover={{ scale: 1 }}
           className="bg-[var(--brand-yellow)] text-gray-900 px-8 py-3 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl"
         >
           Procure Node
         </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <span className="bg-gray-900/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shadow-2xl border border-white/10">
          ID: {product.productId.toString().slice(0, 8).toUpperCase()}
        </span>
      </div>
    </div>

    <div className="p-10 flex flex-col flex-1 relative">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] font-black text-[var(--brand-yellow)] uppercase tracking-[0.2em]">{product.categoryName || 'General Supply'}</span>
             <div className="w-1 h-1 rounded-full bg-gray-200" />
             <ShieldCheck className="w-3 h-3 text-gray-400" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors uppercase italic">{product.productName}</h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 italic font-medium">{product.description}</p>
        </div>
      </div>
      
      <div className="mb-8 grid grid-cols-2 gap-4">
         <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
               <Layers className="w-3 h-3" /> Availability
            </p>
            <p className={`text-sm font-black ${product.availableQuantity > 50 ? 'text-gray-900' : 'text-red-600'}`}>
               {product.availableQuantity} <span className="text-[10px] uppercase">{product.unit}s</span>
            </p>
         </div>
         <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
               <Truck className="w-3 h-3" /> Delivery
            </p>
            <p className="text-sm font-black text-gray-900">Next Business Day</p>
         </div>
      </div>

      {product.pricingTiers && product.pricingTiers.length > 0 && (
         <div className="mb-8 space-y-3 bg-gray-900/5 p-5 rounded-[1.5rem] border border-gray-100/50">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Enterprise Tiers</span>
              <span className="text-[9px] text-[var(--brand-yellow)] font-black uppercase">MOQ ACTIVE</span>
            </div>
            {product.pricingTiers.map((tier, idx) => (
               <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-600 font-bold">{tier.minQuantity}+ {product.unit}s</span>
                  <div className="h-px flex-1 mx-4 bg-gray-200 border-dotted border-b opacity-50" />
                  <span className="text-gray-900 font-black">₹{tier.price.toFixed(2)}</span>
               </div>
            ))}
         </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-8 border-t border-gray-50">
        <div>
          <span className="text-[10px] text-gray-400 font-black uppercase block mb-1">Unit Price (Base)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{product.basePrice?.toFixed(2) || '0.00'}</span>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">INR</span>
          </div>
        </div>
        <button 
          onClick={() => onAdd(product)}
          className="w-14 h-14 bg-[var(--brand-yellow)] hover:bg-gray-900 hover:text-white rounded-2xl flex items-center justify-center text-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all active:scale-95 group/btn"
        >
          <Plus className="w-7 h-7 transition-transform duration-300 group-hover/btn:rotate-90" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [volumetricActive, setVolumetricActive] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    // Fetch products and categories in parallel
    Promise.all([
      axios.get('http://localhost:5180/api/product'),
      axios.get('http://localhost:5180/api/product/categories')
    ])
    .then(([prodRes, catRes]) => {
       setProducts(prodRes.data);
       setCategories(catRes.data);
       setFilteredProducts(prodRes.data);
       setLoading(false);
    })
    .catch(err => {
       console.error('Data synchronization failed', err);
       setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = products;

    // Search filter - Robust case-insensitive search
    const activeSearch = (searchTerm || '').trim().toLowerCase();
    if (activeSearch !== '') {
       result = result.filter(p => {
         const nameMatch = (p.productName || '').toLowerCase().includes(activeSearch);
         const descMatch = (p.description || '').toLowerCase().includes(activeSearch);
         const catMatch = (p.categoryName || '').toLowerCase().includes(activeSearch);
         return nameMatch || descMatch || catMatch;
       });
    }

    // Volumetric filter logic: Products with pricing tiers and high stock (>100)
    if (volumetricActive) {
       result = result.filter(p => 
         p.pricingTiers && p.pricingTiers.length > 0 && Number(p.availableQuantity) > 100
       );
    }

    setFilteredProducts(result);
  }, [searchTerm, products, volumetricActive]);

  return (
    <div className="py-20 space-y-16 max-w-[1600px] mx-auto px-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            <Link to="/" className="hover:text-gray-900 transition-colors">Start-up Node</Link>
            <ChevronRight className="w-3 h-3 text-[var(--brand-yellow)]" />
            <span className="text-gray-900">Procurement Hub</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
            Enterprise <span className="text-[var(--brand-yellow)]">Supply</span> Chain
          </h1>
           <p className="text-gray-500 max-w-xl font-medium leading-relaxed italic">
            Procure industrial-grade hospitality assets. Real-time global synchronization of {products.length} verified B2B nodes with automated volumetric pricing logic.
          </p>
        </div>

        <div className="flex gap-4">
           {[
              { label: 'Platform Scale', val: '400+', sub: 'Active SKUs', icon: Package },
              { label: 'Global Network', val: '24/7', sub: 'Hub Uptime', icon: Zap }
           ].map((stat, i) => (
             <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex items-start gap-6 min-w-[240px]">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900">
                   <stat.icon className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.val}</p>
                   <p className="text-[10px] text-gray-500 font-bold italic">{stat.sub}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        {/* Advanced Filters Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-10 space-y-16">
            <div>
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-sm uppercase tracking-[0.3em] text-gray-900 italic">Core Verticals</h3>
                <Filter className="w-4 h-4 text-gray-300" />
              </div>
              <ul className="space-y-4">
                {categories.map((cat, i) => (
                  <li key={cat.categoryId}>
                    <button 
                      onClick={() => setSearchTerm(cat.categoryName)}
                      className={`flex items-center justify-between w-full p-5 rounded-[1.5rem] transition-all group relative overflow-hidden ${searchTerm === cat.categoryName ? 'bg-gray-900 text-white shadow-2xl translate-x-3 ring-4 ring-[var(--brand-yellow)]/20' : 'bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md'}`}
                    >
                      {searchTerm === cat.categoryName && (
                        <motion.div 
                          layoutId="cat-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--brand-yellow)]"
                        />
                      )}
                      <span className={`text-sm font-black italic transition-all ${searchTerm === cat.categoryName ? 'opacity-100' : 'text-gray-500'}`}>{cat.categoryName}</span>
                      <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${searchTerm === cat.categoryName ? 'bg-[var(--brand-yellow)] text-gray-900' : 'bg-white text-gray-400 border border-gray-100'}`}>
                         {products.filter(p => p.categoryId == cat.categoryId).length}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-yellow)] blur-[100px] opacity-20 transition-all duration-700 group-hover:scale-150" />
               <Zap className="w-8 h-8 text-[var(--brand-yellow)] mb-6" />
               <h4 className="text-lg font-black uppercase italic mb-3">Enterprise Pro</h4>
               <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8">Unlock wholesale credit lines and custom RFQ integration.</p>
               <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--brand-yellow)] transition-all">Enable Tier 2 Node</button>
            </div>
          </div>
        </aside>

        {/* Dynamic Product Grid */}
        <div className="flex-1 space-y-12">
          {/* Universal Search & Sort */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 flex flex-wrap items-center justify-between gap-8 shadow-sm">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 scale-x-[-1]" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Query Enterprise Catalog (Name, SKU, Category)..." 
                  className="w-full pl-16 pr-8 py-5 rounded-2xl border border-transparent bg-gray-50 text-base font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all italic shadow-inner" 
                />
             </div>
             
             <div className="flex items-center gap-6 pr-4">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 border-b-2 border-[var(--brand-yellow)] pb-1">Master View</button>
                <button 
                  onClick={() => setVolumetricActive(!volumetricActive)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-lg ${volumetricActive ? 'bg-gray-900 text-[var(--brand-yellow)] shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   Volumetric Filter {volumetricActive ? '(ACTIVE)' : ''}
                </button>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="py-48 flex flex-col items-center justify-center text-gray-400"
               >
                 <div className="w-16 h-16 border-[6px] border-gray-50 border-t-[var(--brand-yellow)] rounded-full animate-spin mb-8 shadow-xl"></div>
                 <p className="font-black uppercase tracking-[0.4em] text-[10px] italic">Synchronizing Global Procurement Nodes...</p>
               </motion.div>
            ) : filteredProducts.length === 0 ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="py-48 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100"
               >
                  <Package className="w-16 h-16 mb-6 opacity-20" />
                  <p className="font-black uppercase tracking-widest text-sm mb-2 text-gray-900">No Enterprise Match</p>
                  <p className="text-xs italic">Refine your query parameters or contact your node manager for catalog expansion.</p>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setSearchTerm('')} className="text-[10px] font-black uppercase tracking-[0.2em] bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg">Reset View</button>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] border border-gray-200 px-6 py-3 rounded-xl hover:bg-white transition-all">Request New SKU</button>
                  </div>
               </motion.div>
            ) : (
              <motion.div 
                 key="grid"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-10"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} onAdd={addToCart} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {!loading && filteredProducts.length > 0 && (
             <div className="pt-20 flex justify-center">
                <button className="px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] hover:bg-[var(--brand-yellow)] hover:text-gray-900 transition-all shadow-2xl hover:-translate-y-2">
                   Load Master Batches
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
