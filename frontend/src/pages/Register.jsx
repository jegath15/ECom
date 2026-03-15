import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Building, Phone } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    phone: '',
    gstNumber: '',
    address: '',
    industryType: 'QSR',
    monthlyVolume: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5180/api/auth/register', {
        Name: formData.businessName,
        Email: formData.email,
        Password: formData.password,
        Role: "buyer",
        BusinessName: formData.businessName,
        GstNumber: formData.gstNumber,
        Address: formData.address,
        IndustryType: formData.industryType,
        EstimatedMonthlyVolume: parseFloat(formData.monthlyVolume) || 0
      });
      navigate('/login'); // Redirect to login on success
    } catch (err) {
      setError('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden py-12">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--brand-yellow)]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-2xl w-full mx-auto relative z-10 p-6">
        <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-12 group">
          <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50"
        >
          <div className="text-center mb-10">
             <div className="w-16 h-1 bg-gray-100 mx-auto mb-8 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '40%' }}
                   className="h-full premium-gradient"
                />
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase italic">Wholesale Node Onboarding</h2>
             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Step 1: Entity Credentials & Tier Selection</p>
          </div>

          {error && <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold mb-8 text-center uppercase tracking-wider">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Enterprise Tier</label>
                  <select 
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm appearance-none"
                  >
                     <option value="Standard">Standard Node (Net-30)</option>
                     <option value="Premium">Premium Node (Net-60)</option>
                     <option value="Enterprise">Enterprise Node (Custom SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Business Entity Name</label>
                  <div className="relative">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                      placeholder="Official LLC Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Industry Segment</label>
                  <select 
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm appearance-none"
                  >
                    <option value="QSR">Quick Service Restaurant (QSR)</option>
                    <option value="Fine Dining">Fine Dining & Bistro</option>
                    <option value="Hotel">Hotel Chain / Full Service</option>
                    <option value="Catering">Industrial & Corporate Catering</option>
                    <option value="Dark Kitchen">Ghost / Dark Kitchen Node</option>
                    <option value="Other">Other Enterprise Entry</option>
                  </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">GST Number</label>
                 <input 
                   type="text" 
                   name="gstNumber"
                   value={formData.gstNumber}
                   onChange={handleChange}
                   className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                   placeholder="GST-99..."
                 />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Est. Monthly Volume (₹)</label>
                  <input 
                    type="number" 
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                    placeholder="e.g. 50000"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                      placeholder="officer@company.com"
                      required
                    />
                  </div>
               </div>
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Primary Phone</label>
                 <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                      placeholder="+1 (555)..."
                      required
                    />
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Operational Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm resize-none"
                placeholder="HQ or Primary Warehouse..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 font-bold rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-yellow)] focus:bg-white transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">KYC Verification (Artifact)</label>
                  <div className="w-full bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl px-6 py-3.5 flex items-center justify-between">
                     <span className="text-[10px] font-bold text-gray-400">UPLOAD LICENSE PDF</span>
                     <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Transmitting Credentials...' : 'Execute Wholesale Application'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-10 text-[10px] font-black uppercase tracking-widest">
            Existing Account? <Link to="/login" className="text-gray-900 border-b-2 border-[var(--brand-yellow)] pb-0.5 ml-1">Authorize Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
