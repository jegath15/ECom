import React from 'react';
import { Outlet } from 'react-router-dom';
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
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
