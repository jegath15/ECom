import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Building, ShieldCheck, Globe } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Assuming your C# auth service expects Email/Password
      const res = await axios.post('http://localhost:5180/api/auth/login', {
        email,
        password
      });
      // Store token (assuming response structure { token: "..." })
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-yellow)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full mx-auto relative z-10 p-6">
        <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-12 group">
          <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50"
        >
          <div className="text-center mb-10">
             <div className="w-12 h-12 premium-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Building className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase italic">Buyer Executive Portal</h2>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest opacity-60">Authorized procurement instance: NODE-01_IND</p>
          </div>

          {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold mb-8 text-center uppercase tracking-wider">{error}</div>}

          <div className="grid grid-cols-2 gap-4 mb-8">
             <button className="flex flex-col items-center justify-center p-4 bg-gray-900 text-[var(--brand-yellow)] rounded-2xl border-2 border-transparent hover:border-[var(--brand-yellow)] transition-all">
                <Globe className="w-4 h-4 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">Global Node</span>
             </button>
             <button className="flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-400 rounded-2xl border-2 border-transparent hover:bg-white hover:border-gray-200 transition-all">
                <ShieldCheck className="w-4 h-4 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">SLA Auth</span>
             </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end mt-3">
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Emergency Access?</a>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Verifying...' : 'Authorize Login'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-10 text-[10px] font-black uppercase tracking-widest">
            New Business? <Link to="/register" className="text-gray-900 border-b-2 border-[var(--brand-yellow)] pb-0.5 ml-1">Apply for Wholesale</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
