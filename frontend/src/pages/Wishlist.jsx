import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  // Static placeholder for demonstration - in a real app this would come from a Context or API
  const drafts = [
    { id: 1, name: "Premium Ribeye Steak 01", price: 180.50, category: "Meat & Poultry" },
    { id: 2, name: "Organic Hass Avocados 05", price: 42.00, category: "Vegetables" }
  ];

  return (
    <div className="py-24 space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Procurement <span className="text-[var(--brand-yellow)]">Drafts.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your saved SKUs and future node allocations.</p>
        </div>
        <Link to="/products" className="btn-primary flex items-center gap-3">
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {drafts.length === 0 ? (
        <div className="bg-gray-50 rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-200">
          <Heart className="w-16 h-16 text-gray-200 mx-auto mb-8" />
          <h3 className="text-2xl font-black text-gray-400">No drafts saved in this node.</h3>
          <p className="text-gray-400 text-sm mt-4">Save items from the catalog to build your next procurement cycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {drafts.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 10 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between gap-8 group"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 font-black">
                  SKU
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{item.name}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Base Price</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{item.price}</p>
                </div>
                <div className="flex gap-3">
                  <button className="p-4 bg-gray-50 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl">
                    Move to Cart <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
