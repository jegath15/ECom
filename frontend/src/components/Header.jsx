import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const cartCounter = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
             <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
            Chef<span className="text-[var(--brand-yellow)]">Supply</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/products" className="nav-link">Categories</Link>
          <Link to="/bulk-order" className="nav-link">Bulk Order</Link>
          <Link to="/suppliers" className="nav-link">Suppliers</Link>
          <Link to="/login" className="nav-link flex items-center gap-1">Login <span className="text-xs font-normal opacity-50">🔑</span></Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link to="/bulk-order" className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group">
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <AnimatePresence>
              {cartCounter > 0 && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-2 -right-2 bg-[var(--brand-yellow)] text-[var(--brand-dark)] text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10"
                >
                  {cartCounter}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-ghost hidden sm:flex text-sm">Login</Link>
              <Link to="/register" className="bg-[var(--brand-yellow)] text-[var(--brand-dark)] px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Register</Link>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full pl-2 pr-4 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center text-[var(--brand-dark)] font-bold">
                  {user?.unique_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold text-[var(--brand-dark)]">{user?.unique_name || 'My Account'}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                  >
                     <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm text-[var(--text-primary)] font-bold truncate">{user?.unique_name}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                     </div>
                     <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-primary)] transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard Profile
                     </Link>

                     {user?.role === 'Admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 font-bold transition-colors">
                           <ShieldAlert className="w-4 h-4" /> Admin Console
                        </Link>
                     )}
                     <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-gray-50">
                        <LogOut className="w-4 h-4" /> Sign Out
                     </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
