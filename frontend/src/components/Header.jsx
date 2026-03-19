import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed, ShieldAlert, Menu, X, ChevronRight, Zap, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {!isAuthenticated && (
            <Link to="/login" className="nav-link flex items-center gap-1">Login <span className="text-xs font-normal opacity-50">🔑</span></Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/cart" className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
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
              <Link to="/login" className="btn-ghost hidden lg:flex text-sm">Login</Link>
              <Link to="/register" className="bg-[var(--brand-yellow)] text-[var(--brand-dark)] px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all">Register</Link>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full pl-2 pr-4 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center text-[var(--brand-dark)] font-bold">
                  {(user?.unique_name || user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-[var(--brand-dark)]">{user?.unique_name || user?.name || 'My Account'}</span>
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
                        <p className="text-sm text-[var(--text-primary)] font-bold truncate">{user?.unique_name || user?.name}</p>
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

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 border border-gray-100 rounded-xl bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <nav className="flex flex-col gap-5">
                {[
                  { label: 'Categories', path: '/products' },
                  { label: 'Bulk Order', path: '/bulk-order' },
                  { label: 'Suppliers', path: '/suppliers' },
                  { label: 'Wishlist', path: '/wishlist' },
                  { label: 'Order Tracking', path: '/orders' }
                ].map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-lg font-black text-gray-900 uppercase tracking-tighter"
                  >
                    {item.label} <ChevronRight className="w-5 h-5 text-gray-300" />
                  </Link>
                ))}
              </nav>

              <div className="pt-8 border-t border-gray-100 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-10 h-10 bg-[var(--brand-yellow)] rounded-full flex items-center justify-center font-black">
                        {(user?.unique_name || user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm leading-none">{user?.unique_name || user?.name}</p>
                        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">View Account Dashboard</p>
                      </div>
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-black uppercase tracking-widest text-[10px] border border-red-100 rounded-2xl hover:bg-red-50 transition-all">
                       <LogOut className="w-3 h-3" /> Sign Out from Node
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                    Sign In to Portal
                  </Link>
                )}
              </div>

              {/* Node Information Section (Elite B2B) */}
              <div className="pt-8 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Infra Node: Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Reliability SLA</p>
                      <p className="text-sm font-black text-gray-900 tracking-tighter">99.98%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Node Latency</p>
                      <p className="text-sm font-black text-gray-900 tracking-tighter">24ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Supply Pulse Ticker */}
      <div className="bg-gray-900/95 backdrop-blur-md overflow-hidden py-2 relative border-t border-white/5">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-20 items-center">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Market Node: <span className="text-white">Active</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-3 h-3 text-[var(--brand-yellow)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Procurement Velocity: <span className="text-white">412 Units/Hr</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-3 h-3 text-white/60" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Global SKUs Sycned: <span className="text-white">12,402</span></span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Verification Protocol: <span className="text-white">v2.5 SLA</span></span>
              </div>
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-3 h-3 text-[var(--brand-yellow)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Cold Chain Status: <span className="text-white">Optimal</span></span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}
