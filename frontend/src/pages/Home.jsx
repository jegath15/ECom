import React, { useState } from 'react';
import { Search, HeadphonesIcon, Truck, ShoppingBag, UtensilsCrossed, Package, RefreshCw, BarChart, Soup } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';


const CategoryItem = ({ icon: Icon, title, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, x: 2 }}
    onClick={onClick}
    className="bg-white p-6 rounded-2xl flex items-center gap-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all"
  >
    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-[var(--brand-dark)]">
       {typeof Icon === 'string' ? <span className="text-2xl">{Icon}</span> : <Icon className="w-7 h-7" />}
    </div>
    <div>
       <h4 className="font-bold text-[var(--text-primary)] text-sm mb-0.5">{title}</h4>
       <p className="text-[var(--text-secondary)] text-xs leading-tight">Professional grade fresh selection from verified nodes.</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title }) => (
  <div className="flex bg-[#E5E7EB]/50 p-8 rounded-xl items-center gap-6 border border-gray-100">
    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white shrink-0">
       <Icon className="w-6 h-6" />
    </div>
    <div>
       <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
       <p className="text-gray-500 text-xs leading-relaxed">Enterprise-grade service standards for high-volume operations.</p>
    </div>
  </div>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="space-y-32 pb-32 bg-mesh">
      
      {/* Hero Section */}
      <section className="bg-white rounded-[3rem] mt-8 p-12 lg:p-24 relative overflow-hidden border border-gray-100 shadow-2xl min-h-[600px] flex items-center">
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(circle,rgba(242,201,76,0.2)_1.5px,transparent_1px)] bg-[length:32px_32px]"></div>
           <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--brand-yellow)]/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
            Bulk Food & Kitchen Supply for Professional chefs
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-xl leading-relaxed">
            Streamlining procurement for the modern hospitality industry. Access wholesale pricing, manage multi-location logistics, and secure flexible Net-30 credit terms in one unified startup ecosystem.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/products" className="btn-primary px-10">Browse Products</Link>
            <Link to="/bulk-order" className="btn-secondary px-10">Request Quote</Link>
          </div>
        </div>

        {/* Hero Image Illustration Placeholder */}
        <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-center p-8">
           <div className="relative w-full h-full">
              <img 
                src="/assets/hero-chef.png" 
                alt="Professional Chef Procurement" 
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
           </div>
        </div>
      </section>

      {/* Search Bar (Restored & Refined) */}
      <div className="max-w-5xl mx-auto -mt-24 relative z-20 px-6">
         <form onSubmit={handleSearch} className="flex gap-2 p-3 bg-white border border-gray-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl">
            <div className="relative flex-1 flex items-center">
               <Search className="absolute left-8 w-6 h-6 text-gray-400" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search global B2B inventory..." 
                 className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none pl-20 pr-8 py-5 text-xl font-medium"
               />
            </div>
            <button type="submit" className="bg-gray-900 hover:bg-black text-white px-12 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95">
              Execute Search
            </button>
         </form>
      </div>

      {/* Service Highlights Bar (ZeeStore Style) */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
         {[
           { icon: Truck, title: "Next-Day Freight", desc: "For all orders placed before 16:00 GMT." },
           { icon: HeadphonesIcon, title: "24/7 Procurement Desk", desc: "Direct access to node account managers." },
           { icon: Package, title: "Cold Chain Verified", desc: "Real-time temperature and humidity tracking." }
         ].map((item, i) => (
           <div key={i} className="flex items-center gap-8 p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-gray-900 transition-all group cursor-default">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all shadow-inner border border-gray-100">
                 <item.icon className="w-8 h-8" />
              </div>
              <div>
                 <h4 className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-900 mb-2">{item.title}</h4>
                 <p className="text-gray-400 text-xs font-bold leading-relaxed">{item.desc}</p>
              </div>
           </div>
         ))}
      </section>

      {/* Two Column Categories Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Food Items */}
         <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[3rem] border border-white/40 shadow-xl"
         >
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight flex items-center gap-4">
               <div className="w-2 h-8 premium-gradient rounded-full" />
               Food Supply Nodes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <CategoryItem icon="🥦" title="Vegetables" onClick={() => navigate('/products?search=Vegetables')} />
               <CategoryItem icon="🥩" title="Meat & Poultry" onClick={() => navigate('/products?search=Meat%20%26%20Poultry')} />
               <CategoryItem icon="🥛" title="Dairy" onClick={() => navigate('/products?search=Dairy')} />
               <CategoryItem icon="🐟" title="Seafood" onClick={() => navigate('/products?search=Seafood')} />
            </div>
         </motion.div>

         {/* Non-Food Items */}
         <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-[3rem] border border-white/40 shadow-xl"
         >
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight flex items-center gap-4">
               <div className="w-2 h-8 bg-gray-900 rounded-full" />
               Industrial Verticals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <CategoryItem icon={UtensilsCrossed} title="Kitchen Equipment" onClick={() => navigate('/products?search=Kitchen%20Equipment')} />
               <CategoryItem icon={ShoppingBag} title="Disposables" onClick={() => navigate('/products?search=Disposables')} />
               <CategoryItem icon={Soup} title="Cooking Utensils" onClick={() => navigate('/products?search=Cooking%20Utensils')} />
               <CategoryItem icon={Package} title="Cleaning Supplies" onClick={() => navigate('/products?search=Cleaning%20Supplies')} />
            </div>
         </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="space-y-12 text-center">
         <h2 className="text-4xl font-black text-gray-900">Why Choose Us</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Truck} title="Fast & Free Shipping" />
            <FeatureCard icon={RefreshCw} title="Hassie Free Returns" />
            <FeatureCard icon={HeadphonesIcon} title="24/7 Support" />
            <FeatureCard icon={BarChart} title="Bulk Discounts" />
         </div>
      </section>

      {/* How it Works */}
      <section className="space-y-16 py-12">
         <h2 className="text-4xl font-black text-gray-900 text-center">How it Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
            {[
                { id: 1, title: "Register Your Business", desc: "Complete our verified wholesale application to unlock enterprise pricing." },
                { id: 2, title: "Browse & Select SKUs", desc: "Build your procurement sheet from our global network of verified suppliers." },
                { id: 3, title: "Lock Pricing & Terms", desc: "Convert your draft RFQ into a binding order with approved Net-30 terms." },
                { id: 4, title: "Automated Logistics", desc: "Real-time tracking as your order moves through our distribution nodes." }
            ].map((step, idx) => (
               <div key={idx} className={`p-10 flex flex-col items-start gap-6 border-gray-200 ${idx !== 3 ? 'border-r' : ''} ${idx >= 2 ? 'md:border-t-0' : ''}`}>
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-black text-gray-900 shadow-sm">
                     {step.id}
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 mb-2 leading-tight">{step.title}</h4>
                     <p className="text-gray-500 text-[13px] leading-relaxed">{step.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Newsletter Subscription (ZeeStore Style) */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 lg:p-24 overflow-hidden relative group border border-white/10 shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-yellow)]/10 rounded-full blur-[120px] -translate-y-1/2 group-hover:bg-[var(--brand-yellow)]/20 transition-all duration-1000"></div>
         <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl">
               <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter">Stay Connected to the Harvest.</h2>
               <p className="text-gray-400 text-lg font-medium leading-relaxed">Join 500+ professional kitchens receiving weekly market intelligence, seasonal forecasts, and exclusive wholesale price drops.</p>
            </div>
            <div className="w-full max-w-md">
               <form className="bg-white/5 p-3 rounded-[2rem] border border-white/10 backdrop-blur-xl flex gap-3 shadow-2xl">
                  <input 
                    type="email" 
                    placeholder="Enter professional email..." 
                    className="flex-1 bg-transparent border-none text-white px-6 py-4 focus:outline-none placeholder-gray-500 font-bold"
                  />
                  <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[var(--brand-yellow)] transition-all transform active:scale-95 shadow-xl">Join Registry</button>
               </form>
               <p className="text-center mt-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Verified B2B Enterprise Registry Only</p>
            </div>
         </div>
      </section>

    </div>
  );
}
