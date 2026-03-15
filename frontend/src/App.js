import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PageWrapper from './components/PageWrapper';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import BulkOrder from './pages/BulkOrder';
import Suppliers from './pages/Suppliers';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

// Placeholders for unimplemented features
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-[60vh] text-2xl font-semibold text-gray-400">
    {title} Page - Coming Soon
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/bulk-order" element={<PageWrapper><BulkOrder /></PageWrapper>} />
            <Route path="/suppliers" element={<PageWrapper><Suppliers /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
