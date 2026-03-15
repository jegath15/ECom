import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Promo Bar */}
      <div className="bg-gray-900 text-white py-2 px-6 text-center text-[10px] font-black uppercase tracking-[0.2em] relative z-50">
        <span className="opacity-80">Enterprise Alert:</span> 
        <span className="mx-2 text-[var(--brand-yellow)]">Fresh Harvest Node #42</span> 
        is now live with 15% discount on all seasonal perishables. 
        <Link to="/products" className="ml-4 underline hover:text-[var(--brand-yellow)] transition-colors">Order Now</Link>
      </div>

      {/* Utility Marquee Bar (ZeeStore Inspired) */}
      <div className="bg-white border-b border-gray-100 py-3 overflow-hidden group">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 px-6"
        >
          {[
            "ABOUT US", "MY ACCOUNT", "MY ACCOUNT", "CART", "WISHLIST", 
            "MY ACCOUNT", "ORDER TRACKING", "CHECKOUT", "CART", "SHOP", "ABOUT US",
            "ABOUT US", "MY ACCOUNT", "MY ACCOUNT", "CART", "WISHLIST", 
            "MY ACCOUNT", "ORDER TRACKING", "CHECKOUT", "CART", "SHOP", "ABOUT US"
          ].map((label, idx) => (
            <Link 
              key={idx} 
              to={label === 'ABOUT US' ? '/about' : label === 'MY ACCOUNT' ? '/dashboard' : label === 'SHOP' ? '/products' : '/bulk-order'}
              className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.25em] transition-all shrink-0"
            >
              {label}
            </Link>
          ))}
        </motion.div>
      </div>

      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
