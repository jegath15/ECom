import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
